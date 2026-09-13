#!/usr/bin/env bash
# Shared Bash/JSON operations. Never evaluate settings or remote OpenVPN text.
[[ ${BASH_VERSINFO[0]} -ge 4 ]] || {
    echo 'Bash 4+ required.' >&2
    exit 1
}
SRV_DIR=$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
CONFIG=${VG_CONFIG:-/etc/sing-box-vpngate}
STATE=${VG_STATE:-/var/lib/sing-box-vpngate}
WEB=$STATE/subscriptions
BASE=${VG_BASE:-/etc/sing-box/config.json}
POOL=sing-box-vpngate.service
WEB_OWNER=${VG_OWNER-root:sing-box}

die() {
    echo "Error: $*" >&2
    return 1
}

cfg() {
    jq -r --slurpfile defaults "$SRV_DIR/config/defaults.json" \
        "\$defaults[0] + . | ($1) | if . == null then error(\"Missing setting\") else . end" "$CONFIG/settings.json"
}

validate_settings() {
    jq -e --slurpfile defaults "$SRV_DIR/config/defaults.json" \
        -f "$SRV_DIR/config/settings.jq" "$1"
}

json_equal() {
    local left right
    left=$(jq -Sc . "$1" | openssl dgst -sha256) || return
    right=$(jq -Sc . "$2" | openssl dgst -sha256) || return
    [[ $left == "$right" ]]
}

atomic() (
    set -e
    local destination=$1 mode=${2:-600} owner=${3:-} pending
    pending=$(mktemp "$(dirname -- "$destination")/.write.XXXXXXXX")
    trap 'rm -f -- "$pending"' EXIT
    cat >"$pending"
    chmod "$mode" "$pending"
    [[ -z $owner ]] || chown "$owner" "$pending"
    mv -f -- "$pending" "$destination"
)

api() {
    BOX_API_URL="http://127.0.0.1:$(cfg .api_port)" BOX_API_SECRET=$(cfg .api_secret) sing-box api "$@"
}

tailnet() {
    local domain
    domain=$(api tailscale peer show "$(cfg .hostname)" | awk '/^DNS name:/ {print $3}')
    domain=${domain%.}
    [[ $domain == *.ts.net && $domain != *[[:space:]]* ]] || die 'Tailscale login/MagicDNS unavailable' || return
    printf '%s\n' "$domain"
}
public_ipv4() {
    # Conservative public IPv4 filter; VPN Gate publishes IPv4 server addresses.
    jq -en --arg ip "$1" '
      ($ip | split(".")) as $s |
      ($s|length)==4 and all($s[]; test("^(0|[1-9][0-9]{0,2})$")) and
      ([$s[]|tonumber] as $a | all($a[]; .<=255) and
        ($a[0]>0 and $a[0]<224 and $a[0]!=10 and $a[0]!=127) and
        ([$a[0],$a[1]]!=[169,254]) and ([$a[0],$a[1]]!=[192,168]) and
        (($a[0]==172 and $a[1]>=16 and $a[1]<=31)|not) and
        (($a[0]==100 and $a[1]>=64 and $a[1]<=127)|not) and
        (($a[0]==198 and ($a[1]==18 or $a[1]==19))|not) and
        (($a[0]==192 and $a[1]==0 and ($a[2]==0 or $a[2]==2))|not) and
        ([$a[0],$a[1],$a[2]]!=[198,51,100]) and
        ([$a[0],$a[1],$a[2]]!=[203,0,113]))' >/dev/null
}

free_port() {
    local port attempts
    for ((attempts = 0; attempts < 100; attempts++)); do
        port=$((20000 + RANDOM))
        if ! ss -H -ltn "sport = :$port" | read -r _; then
            printf '%s\n' "$port"
            return
        fi
    done
    die 'No free probe port'
}

stop_process() {
    local pid=${1:-} i
    [[ -n $pid ]] || return 0
    kill "$pid" 2>/dev/null || :
    for ((i = 0; i < 20; i++)); do
        kill -0 "$pid" 2>/dev/null || break
        sleep 0.1
    done
    kill -KILL "$pid" 2>/dev/null || :
    wait "$pid" 2>/dev/null || :
}
