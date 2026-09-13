#!/usr/bin/env bash
# Product contract tests: no root, network, SSH, or running sing-box required.
set -euo pipefail
umask 077
source "$(dirname -- "${BASH_SOURCE[0]}")/vpngate.sh"
test_root=$(mktemp -d "${TMPDIR:-/tmp}/vpngate-settings-test.XXXXXXXX")
trap 'rm -rf -- "$test_root"' EXIT
export VG_CONFIG=$test_root/config VG_STATE=$test_root/state VG_OWNER=''
CONFIG=$VG_CONFIG
STATE=$VG_STATE
WEB=$STATE/subscriptions
WEB_OWNER=''
mkdir -p "$CONFIG" "$WEB"

for invalid in \
    '{"max_nodes":0}' \
    '{"max_nodes":"12"}' \
    '{"subscription_port":443}' \
    '{"subscription_port":18081}' \
    '{"tune_network":"true"}' \
    '{"hostname":"bad name"}' \
    '{"unknown_setting":true}' \
    '{"feed_url":"file:///etc/passwd"}' \
    '{"check_url":"https://user:secret@example.com/"}' \
    '{"sing_box_version":"latest"}'; do
    printf '%s\n' "$invalid" >"$test_root/input.json"
    if validate_settings "$test_root/input.json" >"$test_root/output" 2>&1; then
        die "Invalid setting accepted: $invalid"
        exit 1
    fi
done

printf '%s\n' '{
    "domain":"proxy.example.com", "hostname":"server-1", "label":"edge",
    "countries":"jp, kr", "max_nodes":1, "listen_address":"0.0.0.0",
    "anytls_port":22000, "snell_port":22001,
    "api_port":22002, "subscription_port":22003,
    "port_min":22000, "port_max":22004
}' >"$test_root/input.json"
validate_settings "$test_root/input.json" >"$CONFIG/settings.json"
jq -e '.countries == ["JP", "KR"] and .tune_network == false' "$CONFIG/settings.json" >/dev/null
jq '. + {subscription_token:"fixture-token",api_secret:"fixture-secret"}' \
    "$CONFIG/settings.json" | atomic "$CONFIG/settings.json"
[[ $(cfg .api_port) == 22002 && $(cfg .tune_network) == false ]]

printf '%s\n' '[{
    "id":"abc123", "ip":"8.8.8.8", "country":"JP", "country_name":"Japan",
    "exit_ip":"9.9.9.9", "score":100, "checked_at":1,
    "endpoint":{"type":"openvpn-client","tag":"ovpn-abc123"}
}]' >"$test_root/nodes.json"
assign_ports "$test_root/nodes.json"
jq -e '.[0].port == 22004' "$test_root/nodes.json" >/dev/null
cp "$STATE/ports.json" "$test_root/ports.before.json"
assign_ports "$test_root/nodes.json"
cmp "$STATE/ports.json" "$test_root/ports.before.json"
pool_config "$test_root/nodes.json" >"$test_root/pool.json"
jq -e '.inbounds[0].listen == "0.0.0.0" and .inbounds[0].listen_port == 22004' "$test_root/pool.json" >/dev/null
publish "$test_root/nodes.json" server-1.example.ts.net >/dev/null 2>&1
grep -Fq ':22003/fixture-token/JP.list' "$WEB/groups.dconf"
grep -Fq 'edge@jp-abc123 = snell, proxy.example.com, 22004' "$WEB/JP.list"

# A preview must never contact a server or reveal the input credentials.
ssh() {
    echo 'Unexpected SSH during preview' >&2
    exit 77
}
export -f ssh
printf '%s\n' '{"hosts":{"edge":{"cloudflare_api_token":"private-fixture","tailscale_auth_key":"private-ts-fixture","max_nodes":64}}}' >"$test_root/inventory.json"
bash "$SRV_DIR/deploy.sh" --headless --host edge --action plan \
    --settings "$test_root/inventory.json" >"$test_root/plan"
if grep -q 'private-fixture\|private-ts-fixture' "$test_root/plan"; then
    die 'Preview leaked credentials'
    exit 1
fi
grep -q '"max_nodes": 64' "$test_root/plan"
printf '%s\n' '{"hosts":{"first":{},"second":{"max_nodes":0}}}' >"$test_root/inventory.json"
if bash "$SRV_DIR/deploy.sh" --headless --host first --host second \
    --settings "$test_root/inventory.json" >"$test_root/invalid-plan" 2>&1; then
    die 'Invalid second host accepted'
    exit 1
fi
grep -q 'max_nodes must be' "$test_root/invalid-plan"
echo 'PASS: settings validation, custom ports/listen address, stable credentials, redacted offline plan.'
