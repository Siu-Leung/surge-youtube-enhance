#!/usr/bin/env bash
# Root-only setup. Existing base proxies and secrets are preserved.
set -euo pipefail
umask 077
source "$(dirname -- "${BASH_SOURCE[0]}")/lib.sh"

[[ $EUID == 0 ]] || {
    die 'Run setup.sh as root'
    exit 1
}
request=${1:?Usage: setup.sh request.json}
bash "$SRV_DIR/doctor.sh"
# The installer bootstraps jq on fresh machines; the controller validates first.
bash "$SRV_DIR/upgrade.sh" "$request"
id sing-box >/dev/null
install -d -m 750 -o root -g sing-box "$CONFIG" "$STATE" "$WEB"
exec 9>"$STATE/refresh.lock"
flock 9
work=$(mktemp -d "$STATE/setup.XXXXXXXX")
trap 'rm -rf -- "$work"' EXIT

if [[ -f $CONFIG/settings.json ]]; then
    cp "$CONFIG/settings.json" "$work/saved.json"
else
    echo '{}' >"$work/saved.json"
fi
# Base listener ports belong to the existing sing-box installation.
if [[ -f $BASE ]]; then
    jq -e '[.inbounds[] | select(.type == "anytls")] | length == 1' "$BASE" >/dev/null
    jq -e '[.inbounds[] | select(.type == "snell" and .version == 6)] | length == 1' "$BASE" >/dev/null
    jq --slurpfile base "$BASE" --slurpfile request "$request" '
        ([$base[0].inbounds[] | select(.type == "anytls")][0].listen_port) as $anytls |
        ([$base[0].inbounds[] | select(.type == "snell")][0].listen_port) as $snell |
        if ($request[0].anytls_port != null and $request[0].anytls_port != $anytls) or
           ($request[0].snell_port != null and $request[0].snell_port != $snell) then
            error("Existing base ports cannot be changed by the VPN Gate installer")
        else .anytls_port = $anytls | .snell_port = $snell end
    ' "$work/saved.json" | atomic "$work/saved.json"
fi
# Separate operator settings from generated runtime secrets.
jq 'del(.subscription_token, .api_secret, .public_ip, .dead_psk)' "$work/saved.json" >"$work/operator.json"
jq --slurpfile request "$request" '. + $request[0]' "$work/operator.json" >"$work/request.json"
validate_settings "$work/request.json" >"$work/settings.json"
if [[ -f $STATE/ports.json ]]; then
    jq -e --slurpfile registry "$STATE/ports.json" '
        [$registry[0][].port] as $assigned |
        all([.anytls_port,.snell_port,.subscription_port,.api_port][];
            . as $port | ($assigned | index($port)) == null)
    ' "$work/settings.json" >/dev/null || {
        die 'A listener port is already reserved for a VPN node; choose another port'
        exit 1
    }
fi
openssl rand -base64 24 | tr '+/' '-_' | tr -d '=\n' >"$work/token"
openssl rand -base64 32 >"$work/api-secret"
jq --slurpfile saved "$work/saved.json" --rawfile token "$work/token" --rawfile secret "$work/api-secret" '
    .subscription_token = ($saved[0].subscription_token // $token)
    | .api_secret = ($saved[0].api_secret // ($secret | rtrimstr("\n")))
' "$work/settings.json" | atomic "$work/settings.json"

# Every setup has a private recovery snapshot, not a one-off migration path.
backup=$(mktemp -d /var/tmp/sing-box-vpngate-backup.XXXXXXXX)
chmod 700 "$backup"
cp -a "$CONFIG" "$backup/config"
[[ ! -f $BASE ]] || cp -a "$BASE" "$backup/base.json"
for name in sing-box-vpngate.service sing-box-vpngate-http.service sing-box-vpngate-refresh.service sing-box-vpngate-refresh.timer; do
    [[ ! -f /etc/systemd/system/$name ]] || cp -a "/etc/systemd/system/$name" "$backup/"
done
for name in sing-box.service sing-box-vpngate.service sing-box-vpngate-http.service sing-box-vpngate-refresh.timer; do
    if systemctl is-active --quiet "$name"; then echo "$name" >>"$backup/active"; fi
    if systemctl is-enabled --quiet "$name"; then echo "$name" >>"$backup/enabled"; fi
done
for name in /etc/sysctl.d/99-proxy.conf /etc/modules-load.d/bbr.conf; do
    [[ ! -f $name ]] || cp -a "$name" "$backup/"
done
if [[ $(jq -r .tune_network "$work/settings.json") == true ]]; then
    sysctl net.core.default_qdisc net.ipv4.tcp_congestion_control net.ipv4.tcp_fastopen net.ipv4.tcp_mtu_probing >"$backup/sysctl.previous"
fi
echo "Recovery snapshot: $backup"

rollback_setup() {
    local result=$?
    [[ $BASHPID == $setup_pid ]] || return "$result"
    trap - ERR
    set +e
    echo "Setup failed; restoring snapshot: $backup" >&2
    for name in settings.json http.json managed-rules.json pool.json; do
        [[ -f $backup/config/$name ]] || rm -f -- "$CONFIG/$name"
    done
    cp -a "$backup/config/." "$CONFIG/"
    if [[ -f $backup/base.json ]]; then
        cp -a "$backup/base.json" "$BASE"
    else
        systemctl stop sing-box.service
        [[ ! -f $BASE ]] || mv "$BASE" "$backup/failed-base.json"
    fi
    if [[ -d $backup/runtime ]]; then
        cp -a "$backup/runtime/." /usr/local/lib/sing-box-vpngate/
    fi
    for name in sing-box-vpngate.service sing-box-vpngate-http.service sing-box-vpngate-refresh.service sing-box-vpngate-refresh.timer; do
        systemctl stop "$name"
        if [[ -f $backup/$name ]]; then
            cp -a "$backup/$name" /etc/systemd/system/
        else
            systemctl disable "$name"
            rm -f -- "/etc/systemd/system/$name"
        fi
    done
    if [[ $(jq -r .tune_network "$work/settings.json") == true ]]; then
        for name in /etc/sysctl.d/99-proxy.conf /etc/modules-load.d/bbr.conf; do
            if [[ -f $backup/${name##*/} ]]; then
                cp -a "$backup/${name##*/}" "$name"
            else rm -f -- "$name"; fi
        done
        sysctl -p "$backup/sysctl.previous"
    fi
    systemctl daemon-reload
    for name in sing-box.service sing-box-vpngate.service sing-box-vpngate-http.service sing-box-vpngate-refresh.timer; do
        if [[ -f $backup/enabled ]] && grep -Fxq "$name" "$backup/enabled"; then
            systemctl enable "$name"
        else systemctl disable "$name"; fi
        if [[ -f $backup/active ]] && grep -Fxq "$name" "$backup/active"; then
            systemctl restart "$name"
        else systemctl stop "$name"; fi
    done
    echo 'Package changes are not rolled back. Recovery snapshot retained.' >&2
    exit "$result"
}
set -E
setup_pid=$BASHPID
trap rollback_setup ERR

# Reuse the live base config, or render the template for a fresh VPS.
fresh=false
if [[ -f $BASE ]]; then
    cp -p "$BASE" "$work/base.original.json"
    [[ -f $CONFIG/base.original.json ]] || cp -a "$BASE" "$CONFIG/base.original.json"
    jq -e '[.endpoints[]|select(.type=="tailscale")]|length==1' "$BASE" >/dev/null || {
        die 'Expected one existing Tailscale endpoint'
        exit 1
    }
    jq --slurpfile base "$BASE" '
      .hostname //= ([$base[0].endpoints[]|select(.type=="tailscale")][0].hostname) |
      .domain //= ([$base[0].certificate_providers[]|select(.type=="acme")][0].domain | if type=="array" then .[0] else . end)' \
        "$work/settings.json" | atomic "$work/settings.json"
    cp "$BASE" "$work/base.json"
else
    fresh=true
    jq -e 'all(.domain,.hostname,.cloudflare_api_token; type=="string" and length>0)' "$work/settings.json" >/dev/null || {
        die 'Fresh setup requires domain, hostname and cloudflare_api_token'
        exit 1
    }
    openssl rand -base64 32 >"$work/anytls"
    openssl rand -base64 32 >"$work/snell"
    jq --slurpfile c "$work/settings.json" --rawfile anytls "$work/anytls" --rawfile snell "$work/snell" '
      .certificate_providers[0].domain=[$c[0].domain] |
      .certificate_providers[0].dns01_challenge.api_token=$c[0].cloudflare_api_token |
      .endpoints[0].hostname=$c[0].hostname |
      (if ($c[0].tailscale_auth_key//"")!="" then .endpoints[0].auth_key=$c[0].tailscale_auth_key else . end) |
      .inbounds[0].listen_port=$c[0].anytls_port |
      .inbounds[1].listen_port=$c[0].snell_port |
      .inbounds[0].listen=$c[0].listen_address |
      .inbounds[1].listen=$c[0].listen_address |
      .inbounds[0].users[0].password=($anytls|rtrimstr("\n")) |
      .inbounds[1].psk=($snell|rtrimstr("\n"))' "$SRV_DIR/config/sing-box.base.json" >"$work/base.json"
fi
jq '.label //= .hostname' "$work/settings.json" | atomic "$work/settings.json"
jq -e '.domain|test("^[A-Za-z0-9.-]+$")' "$work/settings.json" >/dev/null
jq -e '.hostname|test("^[A-Za-z0-9-]+$")' "$work/settings.json" >/dev/null
jq -e '.label|test("^[A-Za-z0-9_-]+$")' "$work/settings.json" >/dev/null
public_ip=$(curl --noproxy '*' -fsS --max-time 20 "$(jq -r .check_url "$work/settings.json")")
public_ipv4 "$public_ip"
jq --arg ip "$public_ip" '.public_ip=$ip | del(.cloudflare_api_token,.tailscale_auth_key,.dead_psk)' "$work/settings.json" | atomic "$work/settings.json"
if [[ -f $CONFIG/managed-rules.json ]]; then
    cp "$CONFIG/managed-rules.json" "$work/old-rules.json"
else
    echo '[]' >"$work/old-rules.json"
fi

# Only the built-in Tailscale endpoint may reach subscription HTTP.
jq --slurpfile c "$work/settings.json" '
    [.endpoints[] | select(.type == "tailscale")][0].tag as $tag
    | [
        {
            inbound: [$tag],
            ip_cidr: ["127.0.0.1/32", "::1/128"],
            port: [$c[0].subscription_port],
            action: "route",
            outbound: "direct",
            override_address: "127.0.0.1"
        },
        {port: [$c[0].subscription_port, $c[0].api_port], action: "reject"}
    ]
' "$work/base.json" >"$work/rules.json"
jq -e --slurpfile c "$work/settings.json" 'any(.outbounds[]; .tag=="direct" and .type=="direct") and
    all((.inbounds+(.services//[]))[]; .tag=="vpngate-admin" or (.listen_port!=$c[0].subscription_port and .listen_port!=$c[0].api_port))' "$work/base.json" >/dev/null
jq --slurpfile c "$work/settings.json" --slurpfile old "$work/old-rules.json" --slurpfile rules "$work/rules.json" '
        .route.rules = $rules[0] + [
            (.route.rules // [])[]
            | select(. as $r | ($old[0] | index($r)) == null)
        ]
        | .services = [
            (.services // [])[] | select(.tag != "vpngate-admin")
        ] + [{
            type: "api",
            tag: "vpngate-admin",
            listen: "127.0.0.1",
            listen_port: $c[0].api_port,
            secret: $c[0].api_secret
        }]
    ' "$work/base.json" >"$work/base.next.json"
sing-box check -c "$work/base.next.json"
if [[ $(jq -r .tune_network "$work/settings.json") == true ]]; then
    install -d -m 755 /etc/modules-load.d /etc/sysctl.d
    atomic /etc/modules-load.d/bbr.conf 644 root:root <"$SRV_DIR/config/bbr.conf"
    modprobe tcp_bbr
    atomic /etc/sysctl.d/99-proxy.conf 644 root:root <"$SRV_DIR/config/99-proxy.conf"
    sysctl -p /etc/sysctl.d/99-proxy.conf
fi
if [[ $fresh == true ]] || ! json_equal "$BASE" "$work/base.next.json"; then
    mode=600
    owner=root:root
    if [[ -f $BASE ]]; then
        mode=$(stat -c %a "$BASE")
        owner=$(stat -c %u:%g "$BASE")
    fi
    atomic "$BASE" "$mode" "$owner" <"$work/base.next.json"
    if ! systemctl restart sing-box.service || ! {
        sleep 3
        systemctl is-active --quiet sing-box.service
    }; then
        if [[ -f $work/base.original.json ]]; then
            atomic "$BASE" "$mode" "$owner" <"$work/base.original.json"
            systemctl restart sing-box.service
        fi
        die 'Base service failed; previous config restored'
        exit 1
    fi
fi
atomic "$CONFIG/settings.json" <"$work/settings.json"
jq '{hostname,subscription_token}' "$work/settings.json" | atomic "$CONFIG/http.json" 640 root:sing-box
atomic "$CONFIG/managed-rules.json" <"$work/rules.json"
if [[ ! -f $CONFIG/pool.json ]]; then
    printf '%s\n' '{"log":{"level":"warn","timestamp":true},"endpoints":[],"inbounds":[],"outbounds":[],"route":{"rules":[{"action":"reject"}]}}' | atomic "$CONFIG/pool.json" 640 root:sing-box
fi
lib=/usr/local/lib/sing-box-vpngate
if [[ -d $lib ]]; then cp -a "$lib" "$backup/runtime"; fi
install -d -m 755 "$lib" "$lib/config"
for name in lib.sh parse-node.sh vpngate.sh http.sh verify.sh setup.sh upgrade.sh doctor.sh; do
    atomic "$lib/$name" 755 root:root <"$SRV_DIR/$name"
done
for name in sing-box.base.json 99-proxy.conf bbr.conf defaults.json settings.jq; do
    atomic "$lib/config/$name" 644 root:root <"$SRV_DIR/config/$name"
done
atomic /etc/systemd/system/sing-box-vpngate.service 644 root:root <<UNIT
[Unit]
Description=VPN Gate native OpenVPN and Snell v6 pool
After=network-online.target
Wants=network-online.target
[Service]
User=sing-box
ExecStart=/usr/bin/sing-box run -c /etc/sing-box-vpngate/pool.json
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
LimitNOFILE=65536
MemoryMax=$(cfg .pool_memory_mb)M
[Install]
WantedBy=multi-user.target
UNIT
atomic /etc/systemd/system/sing-box-vpngate-http.service 644 root:root <<UNIT
[Unit]
Description=Tailscale-only VPN Gate subscriptions (Bash)
After=sing-box.service
[Service]
User=sing-box
ExecStart=/usr/bin/socat -T 10 TCP4-LISTEN:$(cfg .subscription_port),bind=127.0.0.1,reuseaddr,fork,max-children=32 EXEC:/usr/local/lib/sing-box-vpngate/http.sh
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
MemoryMax=$(cfg .http_memory_mb)M
TasksMax=100
[Install]
WantedBy=multi-user.target
UNIT
atomic /etc/systemd/system/sing-box-vpngate-refresh.service 644 root:root <<UNIT
[Unit]
Description=Fetch and verify VPN Gate nodes, publish Surge lists (Bash)
After=network-online.target sing-box.service
Wants=network-online.target
[Service]
Type=oneshot
ExecStart=/bin/bash /usr/local/lib/sing-box-vpngate/vpngate.sh refresh
TimeoutStartSec=$(cfg .refresh_timeout_minutes)min
UMask=0077
Nice=10
MemoryMax=$(cfg .refresh_memory_mb)M
UNIT
atomic /etc/systemd/system/sing-box-vpngate-refresh.timer 644 root:root <<UNIT
[Unit]
Description=Periodically refresh VPN Gate subscriptions
[Timer]
OnBootSec=90s
OnUnitInactiveSec=$(cfg .interval_minutes)min
RandomizedDelaySec=30s
[Install]
WantedBy=timers.target
UNIT
systemctl daemon-reload
systemctl enable --now sing-box.service "$POOL" sing-box-vpngate-http.service sing-box-vpngate-refresh.timer
systemctl restart sing-box-vpngate-http.service || :
http_ok=false
expected=404
[[ ! -f $WEB/index.json ]] || expected=200
for ((i = 0; i < 10; i++)); do
    if [[ $(curl --noproxy '*' -sS --max-time 3 -o /dev/null -w '%{http_code}' \
        -H "Host: $(cfg .hostname).check.ts.net" "http://127.0.0.1:$(cfg .subscription_port)/$(cfg .subscription_token)/index.json" 2>/dev/null) == "$expected" ]]; then
        http_ok=true
        break
    fi
    sleep 0.2
done
if [[ $http_ok != true ]]; then
    die 'Subscription HTTP startup failed'
fi
if ! api tailscale status; then
    echo 'Tailscale is not ready. Read the sing-box journal for its login URL.' >&2
fi
# Release migration lock before the new refresher starts.
flock -u 9
trap - ERR
systemctl start --no-block sing-box-vpngate-refresh.service
echo 'Bash setup complete; first refresh running. Base configs: /etc/sing-box/config.json, /etc/sysctl.d/99-proxy.conf'
