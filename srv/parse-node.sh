#!/usr/bin/env bash
# Usage: parse-node.sh ROW.json. Strict data translation; no eval or OpenVPN execution.
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/lib.sh"

row=$1
work=$(mktemp -d "${TMPDIR:-/tmp}/vpngate-parse.XXXXXXXX")
trap 'rm -rf -- "$work"' EXIT
ip=$(jq -er .IP "$row")
public_ipv4 "$ip"
jq -er '.OpenVPN_ConfigData_Base64 | select(test("^[A-Za-z0-9+/]+={0,2}$"))' "$row" |
    openssl base64 -d -A >"$work/input.ovpn"
[[ $(wc -c <"$work/input.ovpn") -le 100000 ]]
# Tokenize a safe subset of shell-style quoting without running any of it.
awk -v dir="$work" '
    function fail() {
        bad = 1
        exit 1
    }

    function tokens(s,    i, c, q, escape, n, word, started) {
        n = 0
        word = ""
        q = ""
        escape = 0
        started = 0

        for (i = 1; i <= length(s); i++) {
            c = substr(s, i, 1)
            if (escape) {
                word = word c
                escape = 0
                started = 1
                continue
            }
            if (c == "\\" && q != "\047") {
                escape = 1
                continue
            }
            if (q != "") {
                if (c == q) q = ""
                else word = word c
                started = 1
                continue
            }
            if (c == "\042" || c == "\047") {
                q = c
                started = 1
                continue
            }
            if (c == "#") break
            if (c ~ /[ \t]/) {
                if (started) {
                    a[++n] = word
                    word = ""
                    started = 0
                }
                continue
            }
            word = word c
            started = 1
        }

        if (q != "" || escape) fail()
        if (started) a[++n] = word
        for (i = 1; i <= n; i++)
            if (a[i] ~ /[\t\r\n]/) fail()
        return n
    }

    {
        sub(/\r$/, "")
        s = $0
        if (NR == 1) sub(/^\357\273\277/, "", s)

        if (block != "") {
            if (s == "</" block ">") {
                block = ""
                next
            }
            if (s ~ /<\/?[a-z-]+>/) fail()
            print s >> (dir "/" block)
            next
        }

        sub(/^[ \t]+/, "", s)
        sub(/[ \t]+$/, "", s)
        if (s == "" || s ~ /^[#;]/) next
        if (s ~ /^<[a-z-]+>$/) {
            block = substr(s, 2, length(s) - 2)
            if (block !~ /^(ca|cert|key|tls-auth|tls-crypt)$/ || seen[block]++) fail()
            next
        }

        n = tokens(s)
        if (!n) next
        if (a[1] !~ /^(dev|proto|remote|cipher|data-ciphers|data-ciphers-fallback|auth|client|resolv-retry|nobind|persist-key|persist-tun|verb|mute|remote-random|auth-user-pass|remote-cert-tls|verify-x509-name|comp-lzo|compress|tun-mtu|mssfix|reneg-sec|ping|ping-restart|tls-version-min|tls-version-max|key-direction|connect-retry|connect-timeout|explicit-exit-notify|setenv)$/) fail()
        if (a[1] == "auth-user-pass" && n != 1) fail()
        for (i = 1; i <= n; i++)
            printf "%s%s", (i == 1 ? "" : "\t"), a[i]
        printf "\n"
    }

    END {
        if (block != "" || bad) exit 1
    }
' "$work/input.ovpn" >"$work/options.tsv"
jq -Rn '[inputs | split("\t")] | group_by(.[0]) | map({key:.[0][0],value:map(.[1:])}) | from_entries' \
    <"$work/options.tsv" >"$work/options.json"
for block in ca cert key tls-auth tls-crypt; do
    [[ -e $work/$block ]] || : >"$work/$block"
done
jq -en --slurpfile o "$work/options.json" --slurpfile r "$row" '
  $o[0] as $o | $r[0] as $r |
  $o.dev[-1][0]=="tun" and ($o.remote|length)==1 and $o.remote[0][0]==$r.IP and
  ($o.remote[0][1] | test("^[0-9]{1,5}$")) and
  ($o.remote[0][1]|tonumber) >= 1 and ($o.remote[0][1]|tonumber) <= 65535 and
  (["tcp","tcp-client","udp","udp4","tcp4-client"] | index($o.proto[-1][0] // "udp"))!=null and
  ($r.CountryShort | ascii_upcase | test("^[A-Z]{2}$"))' >/dev/null
port=$(jq -r '.remote[0][1]|tonumber' "$work/options.json")
network=$(jq -r 'if (.proto[-1][0] // "udp" | startswith("tcp")) then "tcp" else "udp" end' "$work/options.json")
ident=$(printf '%s' "$ip:$port/$network" | openssl dgst -sha256 | awk '{print substr($NF,1,12)}')
jq -en --arg id "$ident" --arg network "$network" --slurpfile r "$row" --slurpfile o "$work/options.json" \
    --rawfile ca "$work/ca" --rawfile cert "$work/cert" --rawfile key "$work/key" \
    --rawfile ta "$work/tls-auth" --rawfile tc "$work/tls-crypt" '
        def trim: sub("^\\s+"; "") | sub("\\s+$"; "");
        $r[0] as $r | $o[0] as $o |
        def val($k; $d): $o[$k][-1][0] // $d;

        if ($ca | contains("-----BEGIN CERTIFICATE-----") | not) then
            error("Missing CA")
        else .
        end
        | (
            {certificate: ($ca | trim)}
            + (if $cert != "" then {client_certificate: ($cert | trim)} else {} end)
            + (if $key != "" then {client_key: ($key | trim)} else {} end)
            + (reduce [
                ["remote-cert-tls", "remote_certificate_tls"],
                ["tls-version-min", "version_min"],
                ["tls-version-max", "version_max"]
            ][] as $p ({};
                if $o[$p[0]] then .[$p[1]] = val($p[0]; "")
                else .
                end
            ))
            + (if $o["verify-x509-name"] then {
                server_name: $o["verify-x509-name"][-1][0],
                server_name_type: ($o["verify-x509-name"][-1][1] // "subject")
            } else {} end)
            + (if $ta != "" or $tc != "" then {
                control_wrap: (
                    {
                        type: (if $tc != "" then "tls_crypt" else "tls_auth" end),
                        key: ((if $tc != "" then $tc else $ta end) | trim)
                    }
                    + (if $o["key-direction"] then {
                        direction: (
                            {"0": "server", "1": "client"}[val("key-direction"; "")]
                            // error("Invalid key direction")
                        )
                    } else {} end)
                )
            } else {} end)
        ) as $tls
        | {
            id: $id,
            country: ($r.CountryShort | ascii_upcase),
            country_name: (
                ($r.CountryLong // $r.CountryShort)
                | gsub("[^[:alnum:]_ .()/-]"; "") | .[0:80]
            ),
            ip: $r.IP,
            score: (($r.Score // "0") | if . == "" then 0 else tonumber end),
            endpoint: (
                {
                    type: "openvpn-client",
                    tag: ("ovpn-" + $id),
                    server: $r.IP,
                    server_port: ($o.remote[0][1] | tonumber),
                    network: $network,
                    tls: $tls,
                    system: false,
                    data_ciphers: (val("data-ciphers"; val("cipher"; "AES-128-CBC")) | split(":")),
                    data_ciphers_fallback: val("data-ciphers-fallback"; val("cipher"; "AES-128-CBC")),
                    auth: val("auth"; "SHA1"),
                    block_ipv6: true,
                    connect_timeout: "8s",
                    handshake_window: "20s",
                    ping_interval: "10s",
                    ping_restart: "40s"
                }
                + (if $o["auth-user-pass"] then {username: "vpn", password: "vpn"} else {} end)
                + (if $o["comp-lzo"] then {
                    compression_lzo: val("comp-lzo"; "adaptive"),
                    allow_compression: "asym"
                } else {} end)
                + (if $o.compress then {
                    compression: val("compress"; "stub"),
                    allow_compression: "asym"
                } else {} end)
            )
        }
    '
