#!/usr/bin/env bash
# Interactive/headless SSH deployment; no Python runtime.
set -euo pipefail
umask 077
source "$(dirname -- "${BASH_SOURCE[0]}")/lib.sh"

headless=false
local_mode=false
detach=false
action=deploy
settings_file=''
maximum=''
hosts=()
usage() {
    echo 'Usage: deploy.sh [--headless] [--host SSH_ALIAS ...] [--settings FILE.json]'
    echo '                 [--action plan|doctor|deploy|upgrade|refresh|status|urls|verify]'
    echo '                 [--max-nodes 1..128] [--local] [--detach]'
    echo 'plan validates settings locally without SSH; doctor checks the selected server.'
}
while (($#)); do
    case $1 in
    --headless)
        headless=true
        shift
        ;;
    --local)
        local_mode=true
        shift
        ;;
    --detach)
        detach=true
        shift
        ;;
    --host)
        hosts+=("${2:?Missing SSH alias}")
        shift 2
        ;;
    --action)
        action=${2:?Missing action}
        shift 2
        ;;
    --settings)
        settings_file=${2:?Missing settings path}
        shift 2
        ;;
    --max-nodes)
        maximum=${2:?Missing node cap}
        shift 2
        ;;
    --help | -h)
        usage
        exit 0
        ;;
    *)
        usage >&2
        die "Unknown option: $1"
        exit 2
        ;;
    esac
done
command -v jq >/dev/null || {
    die 'Install jq on management machine first'
    exit 1
}
stage=$(mktemp -d "${TMPDIR:-/tmp}/vpngate-deploy.XXXXXXXX")
trap 'rm -rf -- "$stage"' EXIT
if [[ -n $settings_file ]]; then
    jq . "$settings_file" >"$stage/settings.json"
else
    echo '{}' >"$stage/settings.json"
fi
jq -e 'type == "object" and ((keys - ["defaults", "hosts"]) | length) == 0 and
    ((.defaults // {}) | type) == "object" and ((.hosts // {}) | type) == "object" and
    all((.hosts // {})[]; type == "object")' "$stage/settings.json" >/dev/null || {
    die 'Expected a settings object containing defaults and hosts'
    exit 2
}
if [[ $headless == false ]]; then
    read -r -p "Action plan/doctor/deploy/upgrade/refresh/status/urls/verify [$action]: " answer
    action=${answer:-$action}
    if [[ $local_mode == false ]]; then
        read -r -p "SSH aliases [${hosts[*]:-required}]: " answer
        [[ -z $answer ]] || read -r -a hosts <<<"$answer"
    fi
    if [[ $action == deploy ]]; then
        read -r -p 'Countries, comma separated [all]: ' countries
        read -r -p 'Normal healthy nodes/country [2]: ' per_country
        jq --arg countries "${countries:-all}" --arg per "${per_country:-2}" \
            '.defaults.countries=$countries | .defaults.per_country=($per|tonumber)' "$stage/settings.json" | atomic "$stage/settings.json"
        if [[ -z $maximum ]]; then
            current=$(jq -r '.defaults.max_nodes // 12' "$stage/settings.json")
            read -r -p "Total node cap/VPS [$current]: " maximum
            maximum=${maximum:-$current}
        fi
    fi
fi
[[ $action =~ ^(plan|doctor|deploy|upgrade|refresh|status|urls|verify)$ ]] || {
    die 'Invalid action'
    exit 2
}
[[ -z $maximum || $maximum =~ ^([1-9]|[1-9][0-9]|1[01][0-9]|12[0-8])$ ]] || {
    die 'max-nodes must be 1–128'
    exit 2
}
if [[ $local_mode == true ]]; then
    hosts=(local)
elif ((${#hosts[@]} == 0)); then
    die 'Specify at least one --host SSH_ALIAS, or use --local on the server'
    exit 2
fi
for host in "${hosts[@]}"; do
    [[ $host =~ ^[A-Za-z0-9][A-Za-z0-9_.@:-]*$ ]] || {
        die 'Invalid SSH alias'
        exit 2
    }
    jq --arg host "$host" --arg max "$maximum" '
        (.defaults // {}) + (.hosts[$host] // {}) |
        if $max != "" then .max_nodes = ($max | tonumber) else . end
    ' "$stage/settings.json" | validate_settings /dev/stdin >/dev/null
done
remote_run() {
    ssh -o BatchMode=yes -o ConnectTimeout=20 "$1" "$2"
}

wait_unit() {
    local host=$1 unit=$2 kind=$3 deadline=$((SECONDS + ${4:-1800})) state
    while ((SECONDS < deadline)); do
        if state=$(remote_run "$host" "sudo -n systemctl show $unit -p ActiveState -p SubState -p Result"); then
            if [[ $state == *ActiveState=failed* || $state != *Result=success* ]]; then
                remote_run "$host" "sudo -n journalctl -u $unit -n 30 --no-pager"
                die "$host: $unit failed"
                return 1
            fi
            if [[ $kind == setup && $state == *SubState=exited* ]] || [[ $kind == refresh && $state == *ActiveState=inactive* ]]; then
                return
            fi
        fi
        sleep 5
    done
    die "$host: still running; inspect journal for $unit"
}
for host in "${hosts[@]}"; do
    jq --arg host "$host" '(.defaults//{}) + (.hosts[$host]//{})' "$stage/settings.json" >"$stage/request.json"
    if [[ $action == deploy || $action == plan || $action == upgrade ]]; then
        jq --arg max "$maximum" '
          if $max!="" then .max_nodes=($max|tonumber) else . end' "$stage/request.json" | atomic "$stage/request.json"
        if [[ $headless == false && $action == deploy ]]; then
            if [[ $local_mode == true ]]; then
                if [[ -s $BASE ]]; then
                    existing=yes
                else
                    existing=no
                fi
            else
                existing=$(remote_run "$host" 'if sudo -n test -s /etc/sing-box/config.json; then echo yes; else echo no; fi')
            fi
            if [[ $existing == no ]]; then
                read -r -p "$host AnyTLS/public domain: " domain
                read -r -p "$host Tailscale hostname: " hostname
                read -r -s -p 'Cloudflare DNS API token: ' secret
                echo
                printf '%s' "$secret" >"$stage/cloudflare"
                read -r -s -p 'Tailscale auth key (blank -> login URL): ' secret
                echo
                printf '%s' "$secret" >"$stage/tailscale"
                unset secret
                jq --arg domain "$domain" --arg hostname "$hostname" --rawfile cf "$stage/cloudflare" --rawfile ts "$stage/tailscale" \
                    '.+{domain:$domain,hostname:$hostname,cloudflare_api_token:$cf} | if $ts!="" then .tailscale_auth_key=$ts else . end' \
                    "$stage/request.json" | atomic "$stage/request.json"
            fi
        fi
    fi
    validate_settings "$stage/request.json" >"$stage/resolved.json"
    echo "[$host] $action"
    if [[ $action == plan ]]; then
        jq 'del(.cloudflare_api_token, .tailscale_auth_key)' "$stage/resolved.json"
        echo 'Preview only: saved server settings are merged during deployment.'
        continue
    fi
    if [[ $action == doctor ]]; then
        if [[ $local_mode == true ]]; then
            bash "$SRV_DIR/doctor.sh"
        else
            remote_run "$host" 'bash -s' <"$SRV_DIR/doctor.sh"
        fi
        continue
    fi
    case $action in
    status) command='bash /usr/local/lib/sing-box-vpngate/vpngate.sh status' ;;
    urls) command='cat /var/lib/sing-box-vpngate/subscriptions/index.json' ;;
    refresh) command='systemctl start --no-block sing-box-vpngate-refresh.service' ;;
    verify) command='bash /usr/local/lib/sing-box-vpngate/verify.sh' ;;
    esac
    if [[ $local_mode == true ]]; then
        [[ $EUID == 0 ]] || {
            die '--local requires root'
            exit 1
        }
        case $action in
        deploy) bash "$SRV_DIR/setup.sh" "$stage/request.json" ;;
        upgrade) bash "$SRV_DIR/upgrade.sh" "$stage/request.json" ;;
        *) bash -c "$command" ;;
        esac
    elif [[ $action != deploy && $action != upgrade ]]; then
        remote_run "$host" "sudo -n $command"
    else
        remote_run "$host" 'bash -s' <"$SRV_DIR/doctor.sh"
        remote=$(remote_run "$host" 'mktemp -d /var/tmp/vpngate-deploy.XXXXXXXX')
        [[ $remote =~ ^/var/tmp/vpngate-deploy\.[A-Za-z0-9]+$ ]] || {
            die 'Invalid remote stage'
            exit 1
        }
        tar_options=()
        [[ $(uname -s) != Darwin ]] || tar_options=(--no-xattrs)
        COPYFILE_DISABLE=1 tar "${tar_options[@]}" -cf "$stage/payload.tar" -C "$SRV_DIR" lib.sh parse-node.sh vpngate.sh http.sh verify.sh setup.sh upgrade.sh doctor.sh config \
            -C "$stage" request.json
        remote_run "$host" "tar -xf - -C $remote" <"$stage/payload.tar"
        job=vpngate-deploy-${remote##*.}
        if [[ $action == deploy ]]; then
            command="/bin/bash $remote/setup.sh $remote/request.json"
        else
            command="/bin/bash $remote/upgrade.sh $remote/request.json"
        fi
        remote_run "$host" "sudo -n chown -R root:root $remote && sudo -n chmod 700 $remote && sudo -n systemd-run --no-block --unit=$job --property=Type=oneshot --property=RemainAfterExit=yes $command"
        echo "[$host] Job: $job; root-only staging retained: $remote"
        if [[ $detach == false ]]; then
            wait_unit "$host" "$job" setup
            if [[ $action == deploy ]]; then
                remote_run "$host" 'sudo -n bash /usr/local/lib/sing-box-vpngate/vpngate.sh status'
                wait_unit "$host" sing-box-vpngate-refresh.service refresh "$(jq '.refresh_timeout_minutes * 60 + 60' "$stage/resolved.json")"
                remote_run "$host" 'sudo -n bash /usr/local/lib/sing-box-vpngate/verify.sh'
            fi
            remote_run "$host" "sudo -n systemctl stop $job"
        fi
    fi
done
