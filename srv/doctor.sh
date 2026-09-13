#!/usr/bin/env bash
# Read-only platform checks. Safe to stream over SSH before uploading secrets.
set -euo pipefail
[[ $(uname -s) == Linux && -r /etc/os-release ]] || {
    echo 'Server must run Debian or Ubuntu Linux.' >&2
    exit 1
}
source /etc/os-release
case ${ID:-} in
debian | ubuntu) ;;
*)
    echo 'Supported server distributions: Debian and Ubuntu.' >&2
    exit 1
    ;;
esac
[[ -d /run/systemd/system ]] || {
    echo 'Running systemd required.' >&2
    exit 1
}
if ((EUID != 0)); then
    sudo -n true || {
        echo 'Passwordless sudo required for remote deployment.' >&2
        exit 1
    }
fi
for command in bash apt-get dpkg-query systemctl tar; do
    command -v "$command" >/dev/null || {
        echo "Missing prerequisite: $command" >&2
        exit 1
    }
done
case $(uname -m) in
x86_64 | aarch64) ;;
*)
    echo 'Supported server architectures: x86_64 and aarch64.' >&2
    exit 1
    ;;
esac
printf 'Platform: %s; architecture: %s\n' "$PRETTY_NAME" "$(uname -m)"
awk '/MemTotal:/ {printf "RAM: %.0f MiB\n", $2/1024}' /proc/meminfo
if command -v sing-box >/dev/null; then sing-box version | head -1; fi
echo 'Preflight passed. Cloud firewall and Tailscale ACLs still require operator review.'
