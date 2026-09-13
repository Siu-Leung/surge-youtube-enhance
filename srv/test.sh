#!/usr/bin/env bash
# Offline regression tests. No VPS access, real credentials, or Python required.
set -euo pipefail
umask 077
test_root=$(mktemp -d "${TMPDIR:-/tmp}/vpngate-tests.XXXXXXXX")
trap 'rm -rf -- "$test_root"' EXIT
export VG_CONFIG=$test_root/config VG_STATE=$test_root/state VG_OWNER=''
mkdir -p "$VG_CONFIG" "$VG_STATE/subscriptions"
source "$(dirname -- "${BASH_SOURCE[0]}")/vpngate.sh"

for file in "$SRV_DIR"/*.sh; do
    bash -n "$file"
done
echo '{"label":"server-1","domain":"example.com","subscription_token":"test-token","hostname":"test","max_nodes":12,"per_country":2,"countries":[],"interval_minutes":15,"port_min":13107,"port_max":13200}' >"$CONFIG/settings.json"
printf 'dev tun\nproto tcp\nremote 8.8.8.8 443\ncipher AES-128-CBC\n<ca>\n-----BEGIN CERTIFICATE-----\nfixture\n-----END CERTIFICATE-----\n</ca>\n' >"$test_root/node.ovpn"
row() {
    jq -n --rawfile ovpn "$test_root/input.ovpn" '{IP:"8.8.8.8",CountryShort:"DE",CountryLong:"Germany",Score:"42",OpenVPN_ConfigData_Base64:($ovpn|@base64)}' >"$test_root/row.json"
}
cp "$test_root/node.ovpn" "$test_root/input.ovpn"
row
bash "$SRV_DIR/parse-node.sh" "$test_root/row.json" >"$test_root/node.json"
jq -e '.endpoint.data_ciphers_fallback=="AES-128-CBC" and .endpoint.system==false and .endpoint.tls.certificate=="-----BEGIN CERTIFICATE-----\nfixture\n-----END CERTIFICATE-----"' "$test_root/node.json" >/dev/null
for directive in 'up /tmp/hook' 'script-security 2' 'ca /etc/shadow' 'http-proxy 127.0.0.1 18080' 'auth-user-pass /etc/shadow'; do
    {
        cat "$test_root/node.ovpn"
        printf '%s\n' "$directive"
    } >"$test_root/input.ovpn"
    row
    if bash "$SRV_DIR/parse-node.sh" "$test_root/row.json" >/dev/null 2>&1; then
        die "Unsafe directive accepted: $directive"
        exit 1
    fi
done
{
    cat "$test_root/node.ovpn"
    printf 'verify-x509-name "CN = Test Node" name\nauth-user-pass\n'
} >"$test_root/input.ovpn"
row
bash "$SRV_DIR/parse-node.sh" "$test_root/row.json" | jq -e '.endpoint.tls.server_name=="CN = Test Node" and .endpoint.username=="vpn"' >/dev/null
for ip in 127.0.0.1 10.2.3.4 100.64.0.1 169.254.1.1 192.168.1.1 172.16.0.1 224.1.1.1 203.0.113.1 1.2.3.999; do
    if public_ipv4 "$ip"; then
        die "Non-public IP accepted: $ip"
        exit 1
    fi
done
public_ipv4 8.8.8.8
echo 'PASS: strict OpenVPN parser, quoted values, public IP boundary.'
{
    printf '*vpn_servers\r\n#IP,CountryShort,CountryLong,Score,OpenVPN_ConfigData_Base64\r\n'
    jq -r '[.IP,.CountryShort,"Germany, West",.Score,.OpenVPN_ConfigData_Base64]|@csv' "$test_root/row.json"
    printf '*\r\n'
} >"$test_root/feed.csv"
curl() {
    cp "$test_root/feed.csv" "${!#}"
}
fetch_nodes >"$test_root/fetched.json"
jq -e 'length==1 and .[0].country_name=="Germany West"' "$test_root/fetched.json" >/dev/null
unset -f curl
echo 'PASS: CRLF CSV feed and quoted country names.'
jq '[.+{id:"000000000001"},.+{id:"000000000002"}]' "$test_root/node.json" >"$test_root/nodes.json"
assign_ports "$test_root/nodes.json"
cp "$test_root/nodes.json" "$test_root/assigned.json"
jq '[.[1],.[0],(.[0]+{id:"000000000003"}|del(.port,.psk))]' "$test_root/nodes.json" | atomic "$test_root/nodes.json"
assign_ports "$test_root/nodes.json"
jq -e --slurpfile old "$test_root/assigned.json" '.[0]==$old[0][1] and .[1]==$old[0][0] and ([.[].port]|unique|length)==3 and (.[2].psk|length)==44' "$test_root/nodes.json" >/dev/null
pool_config "$test_root/nodes.json" >"$test_root/pool.json"
jq -e '.route.rules[-1].action=="reject" and .outbounds==[] and .route.rules[0].action=="resolve" and .dns.servers[0].type=="openvpn" and .route.default_domain_resolver.server==.dns.servers[0].tag' "$test_root/pool.json" >/dev/null
echo '[]' >"$test_root/empty.json"
pool_config "$test_root/empty.json" | jq -e '.inbounds==[] and .route.rules==[{action:"reject"}] and (has("dns")|not)' >/dev/null
echo 'PASS: stable ports/PSKs; VPN DNS and fail-closed routes.'
# Deterministic health substitutes exercise the real refresh/allocation flow.
flock() {
    :
}

tailnet() {
    echo test.tailnet.ts.net
}

fetch_nodes() {
    cat "$test_root/candidates.json"
}

probe() {
    jq '[.[]|.+{exit_ip:"9.9.9.9",checked_at:1}]' "$1"
}

activate() {
    jq -e --argjson max "$(cfg .max_nodes)" 'length<=$max' "$1" >/dev/null
    jq --arg bad "${bad_id:-}" '[.[]|select(.id!=$bad)|.+{port:13118,psk:"fixture"}]' "$1" >"$2"
}

make_candidates() {
    jq -n --argjson countries "$1" --argjson count "$2" --slurpfile n "$test_root/node.json" '
      [$countries|to_entries[]|. as $c|range($count) as $i|
       $n[0]+{id:(("000000000000"+(($c.key*100+$i)|tostring))|.[-12:]),country:$c.value,country_name:$c.value,
         ip:("8.8.\($c.key).\($i+1)"),score:(100-$i)}]' >"$test_root/candidates.json"
}
make_candidates '["DE","JP","KR"]' 12
refresh >/dev/null 2>"$test_root/log"
[[ $(jq '.nodes|length' "$WEB/index.json") == 6 ]]
if grep -q 'lifting country cap' "$test_root/log"; then
    die 'Expanded at exactly 50%'
    exit 1
fi
make_candidates '["JP","KR"]' 12
refresh >/dev/null 2>"$test_root/log"
[[ $(jq '.nodes|length' "$WEB/index.json") == 12 ]]
jq -e '.countries.JP.healthy==6 and .countries.KR.healthy==6' "$WEB/index.json" >/dev/null
grep -q 'lifting country cap' "$test_root/log"
make_candidates '["DE","JP","KR"]' 12
bad_id=000000000000
refresh >/dev/null 2>"$test_root/log"
[[ $(jq '.nodes|length' "$WEB/index.json") == 12 ]]
jq -e 'all(.nodes[];.id!="000000000000")' "$WEB/index.json" >/dev/null
unset bad_id
for maximum in 1 13 32; do
    jq --argjson n "$maximum" '.max_nodes=$n' "$CONFIG/settings.json" | atomic "$CONFIG/settings.json"
    make_candidates '["JP"]' 40
    refresh >/dev/null 2>"$test_root/log"
    [[ $(jq '.nodes|length' "$WEB/index.json") == "$maximum" ]]
done
echo 'PASS: <50% expansion, exactly-50% boundary, Snell failures, 1/13/32-node caps.'
grep -Fq 'server-1@jp = smart,' "$WEB/groups.dconf"
grep -Fq 'include-all-proxies=0, hidden=1, evaluate-before-use=1, icon-url=EMOJI::🇯🇵' "$WEB/groups.dconf"
grep -Fq ' = snell, example.com, 13118, psk=fixture, version=6, reuse=true, tfo=true' "$WEB/JP.list"
if grep -Eq '^# (Route|Source|Access):' "$WEB/JP.list"; then
    die 'Removed comments returned'
    exit 1
fi
if [[ -x /Applications/Surge.app/Contents/Applications/surge-cli ]]; then
    {
        printf '[General]\nloglevel = notify\n[Proxy]\n'
        cat "$WEB/all.list" "$WEB/groups.dconf"
        printf '[Rule]\nFINAL,DIRECT\n'
    } >"$test_root/surge.dconf"
    /Applications/Surge.app/Contents/Applications/surge-cli --check "$test_root/surge.dconf"
fi
publish "$test_root/empty.json" test.tailnet.ts.net >/dev/null 2>&1
[[ ! -e $WEB/all.list && ! -e $WEB/JP.list && ! -e $WEB/DE.list ]]
jq -e '.nodes==[] and .countries=={}' "$WEB/index.json" >/dev/null
if grep -q ' = ' "$WEB/groups.dconf"; then
    die 'Empty country still has a group'
    exit 1
fi
echo 'PASS: @ names, hidden Smart groups/flags, comment cleanup, empty-country removal.'
jq '{hostname,subscription_token}' "$CONFIG/settings.json" >"$CONFIG/http.json"
printf 'GET /test-token/index.json HTTP/1.1\r\nHost: localhost\r\n\r\n' | bash "$SRV_DIR/http.sh" | grep -q '403 Forbidden'
printf 'GET /wrong/index.json HTTP/1.1\r\nHost: test.tailnet.ts.net\r\n\r\n' | bash "$SRV_DIR/http.sh" | grep -q '404 Not Found'
printf 'GET /test-token/../settings.json HTTP/1.1\r\nHost: test.tailnet.ts.net\r\n\r\n' | bash "$SRV_DIR/http.sh" | grep -q '404 Not Found'
if [[ $(uname -s) == Linux ]]; then
    printf 'GET /test-token/index.json HTTP/1.1\r\nHost: test.tailnet.ts.net\r\n\r\n' | bash "$SRV_DIR/http.sh" >"$test_root/http.response"
    grep -q '200 OK' "$test_root/http.response"
fi
echo 'PASS: HTTP Host/token/path isolation.'
if bash "$SRV_DIR/deploy.sh" --headless --max-nodes 0 >/dev/null 2>&1; then
    die 'Invalid CLI cap accepted'
    exit 1
fi
if bash "$SRV_DIR/deploy.sh" --headless --action status >"$test_root/no-host.log" 2>&1; then
    die 'Missing host accepted'
    exit 1
fi
grep -Fq 'Specify at least one --host SSH_ALIAS' "$test_root/no-host.log"
bash "$SRV_DIR/test-settings.sh"
echo 'All Bash regression checks passed.'
