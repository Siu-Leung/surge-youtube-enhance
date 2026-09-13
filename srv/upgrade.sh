#!/usr/bin/env bash
# Runs on the VPS as root. Preserves config ownership, credentials and state.
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/lib.sh"
request=${1:-}
bash "$SRV_DIR/doctor.sh"
[[ $EUID == 0 ]] || {
    echo 'Run as root.' >&2
    exit 1
}
command -v apt-get >/dev/null || {
    echo 'Debian/Ubuntu VPS required.' >&2
    exit 1
}
missing=()
if [[ -n $request ]] && command -v jq >/dev/null; then validate_settings "$request" >/dev/null; fi
for package in curl ca-certificates openssl jq socat iproute2 util-linux kmod; do
    if ! dpkg-query -W -f='${Status}' "$package" 2>/dev/null | grep -q 'install ok installed'; then
        missing+=("$package")
    fi
done
if ((${#missing[@]})); then
    apt-get update
    DEBIAN_FRONTEND=noninteractive apt-get install -y "${missing[@]}"
fi
version=$(jq -r .sing_box_version "$SRV_DIR/config/defaults.json")
if [[ -f $CONFIG/settings.json ]]; then version=$(cfg .sing_box_version); fi
if [[ -n $request ]]; then
    validate_settings "$request" >/dev/null
    requested=$(jq -r '.sing_box_version // empty' "$request")
    version=${requested:-$version}
fi
if command -v sing-box >/dev/null; then
    current=$(sing-box version | awk 'NR==1 {print $3}')
    if dpkg --compare-versions "$current" gt "$version"; then
        echo "Refusing implicit downgrade: installed $current, requested $version." >&2
        exit 1
    fi
    if [[ $(command -v sing-box) != /usr/bin/sing-box ]]; then
        die 'Existing binary is outside /usr/bin; migrate the installation explicitly'
        exit 1
    fi
fi
record_version() {
    if [[ -f $CONFIG/settings.json ]]; then
        jq --arg version "$version" '.sing_box_version=$version' "$CONFIG/settings.json" |
            atomic "$CONFIG/settings.json"
    fi
}
if command -v sing-box >/dev/null && [[ $(sing-box version | head -1) == "sing-box version $version" ]]; then
    echo "sing-box $version already installed"
    record_version
    exit 0
fi
umask 077
stage=$(mktemp -d /var/tmp/sing-box-upgrade.XXXXXXXX)
echo "Upgrade backup: $stage"
if command -v sing-box >/dev/null; then
    cp -p /usr/bin/sing-box "$stage/sing-box.previous"
fi
if [[ -d /etc/sing-box ]]; then
    cp -a /etc/sing-box "$stage/config-backup"
fi
curl --fail --silent --show-error --location --retry 3 https://sing-box.app/install.sh -o "$stage/install.sh"
cd "$stage"
sh ./install.sh --version "$version"
[[ $(sing-box version | head -1) == "sing-box version $version" ]]
if [[ -f $CONFIG/pool.json ]] && ! sing-box check -c "$CONFIG/pool.json"; then
    if [[ -f "$stage/sing-box.previous" ]]; then
        install -m 755 "$stage/sing-box.previous" /usr/bin/sing-box
    fi
    die 'New binary rejected the VPN pool; previous binary restored'
    exit 1
fi
if [[ -f /etc/sing-box/config.json ]]; then
    if ! sing-box check -C /etc/sing-box; then
        if [[ -f "$stage/sing-box.previous" ]]; then
            install -m 755 "$stage/sing-box.previous" /usr/bin/sing-box
        fi
        echo 'New binary rejected existing config; previous binary restored.' >&2
        exit 1
    fi
    systemctl enable sing-box.service
    systemctl restart sing-box.service
    sleep 3
    if ! systemctl is-active --quiet sing-box.service; then
        if [[ -f "$stage/sing-box.previous" ]]; then
            install -m 755 "$stage/sing-box.previous" /usr/bin/sing-box
            systemctl restart sing-box.service
        fi
        echo 'Release startup failed; previous binary restored.' >&2
        exit 1
    fi
fi
if systemctl is-active --quiet "$POOL"; then
    if ! systemctl restart "$POOL"; then
        if [[ -f "$stage/sing-box.previous" ]]; then
            install -m 755 "$stage/sing-box.previous" /usr/bin/sing-box
            systemctl restart sing-box.service "$POOL"
        fi
        die 'VPN pool restart failed; previous binary restored'
        exit 1
    fi
fi
sing-box version | head -1
record_version
