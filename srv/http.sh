#!/usr/bin/env bash
# One request per socat child. Loopback bind is enforced by the systemd service.
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/lib.sh"

reply() {
    printf 'HTTP/1.1 %s\r\nContent-Length: %s\r\nContent-Type: text/plain; charset=utf-8\r\nConnection: close\r\nCache-Control: private, no-store\r\n\r\n%s' "$1" "${#2}" "$2"
    exit 0
}

# Read one bounded request and collect its Host header.
IFS= read -r -t 5 -n 8193 request || exit 0
request=${request%$'\r'}
[[ ${#request} -le 8192 && $request =~ ^GET\ (/[^\ ]*)\ HTTP/1\.[01]$ ]] || reply '400 Bad Request' 'Bad request'
path=${BASH_REMATCH[1]%%\?*}
host=''
total=0
headers=0
complete=false
while IFS= read -r -t 5 -n 8193 line; do
    line=${line%$'\r'}
    total=$((total + ${#line}))
    headers=$((headers + 1))
    ((total <= 16384 && headers <= 50)) || reply '431 Request Header Fields Too Large' 'Headers too large'
    if [[ -z $line ]]; then
        complete=true
        break
    fi
    if [[ ${line,,} == host:* ]]; then
        [[ -z $host ]] || reply '400 Bad Request' 'Duplicate Host'
        host=${line#*:}
        host=${host#"${host%%[![:space:]]*}"}
        host=${host,,}
        host=${host%%:*}
    fi
done
[[ $complete == true ]] || reply '400 Bad Request' 'Incomplete headers'

# Require the tailnet hostname, private token, and an allowed list filename.
hostname=$(jq -er .hostname "$CONFIG/http.json")
[[ $host == "$hostname".*.ts.net ]] || reply '403 Forbidden' 'Forbidden'
token=$(jq -er .subscription_token "$CONFIG/http.json")
name=${path##*/}
[[ $path == "/$token/$name" ]] || reply '404 Not Found' 'Not found'
[[ $name == index.json || $name == groups.dconf || $name == all.list || $name =~ ^[A-Z]{2}\.list$ ]] || reply '404 Not Found' 'Not found'

# Keep length and response body tied to the same file during atomic updates.
exec 3<"$WEB/$name" 2>/dev/null || reply '404 Not Found' 'Not found'
size=$(stat -Lc %s /proc/$$/fd/3)
type='text/plain; charset=utf-8'
[[ $name != index.json ]] || type=application/json
printf 'HTTP/1.1 200 OK\r\nContent-Length: %s\r\nContent-Type: %s\r\nCache-Control: private, no-store\r\nConnection: close\r\n\r\n' "$size" "$type"
cat <&3
