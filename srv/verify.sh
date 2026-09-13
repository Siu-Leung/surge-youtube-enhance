#!/usr/bin/env bash
# Live regression/isolation checks. Never prints proxy credentials.
set -euo pipefail
umask 077
source "$(dirname -- "${BASH_SOURCE[0]}")/vpngate.sh"

work=$(mktemp -d "$STATE/verify.XXXXXXXX")
process=''
trap 'stop_process "$process"; rm -rf -- "$work"' EXIT
sing-box check -c "$BASE"
if [[ -f $CONFIG/base.original.json ]]; then
    jq -e --slurpfile original "$CONFIG/base.original.json" '
      . as $current | all(["inbounds","endpoints","certificate_providers","outbounds","log"][]; . as $k|$current[$k]==$original[0][$k])' "$BASE" >/dev/null
    [[ $(stat -c %a:%u:%g "$BASE") == "$(stat -c %a:%u:%g "$CONFIG/base.original.json")" ]]
fi
echo 'Base AnyTLS/Snell/Tailscale/certificate settings and config permissions preserved.'
if [[ $(cfg .tune_network) == true ]]; then
    while read -r key expected; do
        [[ $(sysctl -n "$key") == "$expected" ]]
    done <<'SYSCTL'
net.core.default_qdisc fq
net.ipv4.tcp_congestion_control bbr
net.ipv4.tcp_fastopen 3
net.ipv4.tcp_mtu_probing 1
SYSCTL
    echo 'BBR/fq/TFO/PMTU verified.'
fi
for unit in sing-box.service "$POOL" sing-box-vpngate-http.service sing-box-vpngate-refresh.timer; do
    systemctl is-active --quiet "$unit"
    systemctl is-enabled --quiet "$unit"
done
[[ $(systemctl show sing-box-vpngate-http.service sing-box-vpngate-refresh.service -p ExecStart) != *python* ]]
domain=$(tailnet)
token=$(cfg .subscription_token)
subscription_port=$(cfg .subscription_port)
url="http://$domain:$subscription_port/$token/"
curl --noproxy '*' -fsS --max-time 5 --resolve "$domain:$subscription_port:127.0.0.1" "${url}index.json" >"$work/index.json"
jq -e --slurpfile c "$CONFIG/settings.json" '
  (.nodes|length)<=$c[0].max_nodes and (.countries|keys)==([.nodes[].country]|unique) and
  all(.countries[];.healthy>0)' "$work/index.json" >/dev/null
for resource in groups.dconf all.list; do
    if [[ -f $WEB/$resource ]]; then
        curl --noproxy '*' -fsS --max-time 5 --resolve "$domain:$subscription_port:127.0.0.1" "${url}$resource" >"$work/$resource"
        cmp -s "$WEB/$resource" "$work/$resource"
    fi
done
while IFS= read -r cc; do
    expected=$(jq -r --arg cc "$cc" '.countries[$cc].healthy' "$work/index.json")
    [[ $(awk '!/^#/ && NF{n++} END{print n+0}' "$WEB/$cc.list") == "$expected" ]]
    if grep -Eq '^# (Route|Source|Access):| = reject' "$WEB/$cc.list"; then
        die 'Unexpected comment/reject placeholder'
        exit 1
    fi
    group="$(cfg .label)@${cc,,}"
    grep -Fq "$group = smart, policy-path=" "$WEB/groups.dconf"
    if awk -v prefix="$group-" '!/^#/ && NF && index($0,prefix)!=1 {bad=1} END{exit !bad}' "$WEB/$cc.list"; then
        die 'Unexpected proxy name'
        exit 1
    fi
done < <(jq -r '.countries|keys[]' "$work/index.json")
for file in "$WEB"/[A-Z][A-Z].list; do
    [[ -f $file ]] || continue
    cc=${file##*/}
    cc=${cc%.list}
    jq -e --arg cc "$cc" '.countries|has($cc)' "$work/index.json" >/dev/null
done
for scenario in host token path; do
    request="http://127.0.0.1:$subscription_port/$token/index.json"
    host=$domain
    expected=404
    case $scenario in host)
        host=localhost
        expected=403
        ;;
    token) request=http://127.0.0.1:$subscription_port/wrong/index.json ;;
    path) request="http://127.0.0.1:$subscription_port/$token/settings.json" ;;
    esac
    [[ $(curl --noproxy '*' -sS --max-time 5 -o /dev/null -w '%{http_code}' -H "Host: $host" "$request") == "$expected" ]]
done
echo 'Bash services enabled; private HTTP and healthy-only subscriptions verified.'
for kind in snell anytls; do
    port=$(free_port)
    jq --arg kind "$kind" --argjson port "$port" --slurpfile c "$CONFIG/settings.json" '
      [.inbounds[]|select(.type==$kind)][0] as $original |
      {log:{level:"error"},inbounds:[{type:"socks",tag:"check",listen:"127.0.0.1",listen_port:$port}],
       outbounds:[({type:$kind,tag:"out",server:"127.0.0.1",server_port:$original.listen_port} +
        (if $kind=="snell" then {psk:$original.psk,version:6} else
         {password:$original.users[0].password,tls:{enabled:true,server_name:$c[0].domain}} end))],
       route:{rules:[{inbound:["check"],action:"route",outbound:"out"},{action:"reject"}]}}' "$BASE" >"$work/client.json"
    sing-box check -c "$work/client.json"
    sing-box run -c "$work/client.json" >"$work/log" 2>&1 &
    process=$!
    sleep 1
    [[ $(curl --noproxy '' -fsS --max-time 15 --proxy "socks5h://127.0.0.1:$port" "$(cfg .check_url)") == "$(cfg .public_ip)" ]]
    if curl --noproxy '' -fsS --max-time 5 --proxy "socks5h://127.0.0.1:$port" -H "Host: $domain" \
        "http://127.0.0.1:$subscription_port/$token/index.json" >"$work/forbidden" 2>/dev/null; then
        die "$kind leaked subscriptions"
        exit 1
    fi
    [[ ! -s $work/forbidden ]]
    stop_process "$process"
    process=''
    echo "$kind: original egress works; public proxy cannot access subscriptions."
done
if [[ $(jq length "$STATE/selected.json") != 0 ]]; then
    port=$(free_port)
    dead=$(free_port)
    jq --argjson port "$port" --argjson dead "$dead" '[.[0]|.endpoint.server="127.0.0.1"|.endpoint.server_port=$dead|.probe_port=$port]' "$STATE/selected.json" >"$work/dead.json"
    pool_config "$work/dead.json" vpn >"$work/dead-pool.json"
    sing-box run -c "$work/dead-pool.json" >"$work/log" 2>&1 &
    process=$!
    sleep 1
    if curl --noproxy '' -fsS --max-time 3 --proxy "socks5h://127.0.0.1:$port" "$(cfg .check_url)" >"$work/forbidden" 2>/dev/null; then
        die 'Unavailable VPN fell back to direct'
        exit 1
    fi
    [[ ! -s $work/forbidden ]]
    stop_process "$process"
    process=''
    echo 'Unavailable VPN: blocked, no direct fallback.'
fi
jq '{vps,healthy:(.nodes|length),countries:(.countries|map_values(.healthy))}' "$work/index.json"
