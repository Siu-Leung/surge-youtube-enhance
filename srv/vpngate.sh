#!/usr/bin/env bash
# VPN Gate -> sing-box native OpenVPN -> per-node Snell v6.
set -euo pipefail
source "$(dirname -- "${BASH_SOURCE[0]}")/lib.sh"

pool_config() {
    jq --arg mode "${2:-public}" --arg listen "$(cfg .listen_address)" '
        . as $nodes
        | {
            log: {level: "warn", timestamp: true},
            endpoints: [],
            inbounds: [],
            outbounds: [],
            route: {rules: []}
        }
        | if $mode == "snell" then
            .inbounds = [$nodes[] | {
                type: "socks",
                tag: .id,
                listen: "127.0.0.1",
                listen_port: .probe_port
            }]
            | .outbounds = [$nodes[] | {
                type: "snell",
                tag: ("out-" + .id),
                server: "127.0.0.1",
                server_port: .port,
                psk: .psk,
                version: 6
            }]
            | .route.rules = [$nodes[] | {
                inbound: [.id],
                action: "route",
                outbound: ("out-" + .id)
            }]
        else
            .endpoints = [$nodes[].endpoint]
            | .inbounds = [$nodes[] |
                if $mode == "public" then {
                    type: "snell",
                    tag: ("in-" + .id),
                    listen: $listen,
                    listen_port: .port,
                    version: 6,
                    psk: .psk,
                    mode: "default",
                    tcp_fast_open: true
                } else {
                    type: "socks",
                    tag: ("in-" + .id),
                    listen: "127.0.0.1",
                    listen_port: .probe_port
                } end
            ]
            | if ($nodes | length) > 0 then
                .dns = {
                    servers: [$nodes[] | {
                        type: "openvpn",
                        tag: ("dns-" + .id),
                        endpoint: ("ovpn-" + .id),
                        accept_default_resolvers: true
                    }],
                    rules: [$nodes[] | {
                        inbound: ["in-" + .id],
                        action: "route",
                        server: ("dns-" + .id)
                    }]
                }
                | .route.default_domain_resolver = {
                    server: .dns.servers[0].tag,
                    strategy: "ipv4_only"
                }
            else
                .
            end
            | .route.rules = [$nodes[] |
                {
                    inbound: ["in-" + .id],
                    action: "resolve",
                    server: ("dns-" + .id),
                    strategy: "ipv4_only"
                },
                {
                    inbound: ["in-" + .id],
                    action: "route",
                    outbound: ("ovpn-" + .id)
                }
            ]
        end
        | .route.rules += [{action: "reject"}]
    ' "$1"
}

probe() (
    local nodes=$1 mode=${2:-vpn} work process='' i port count used=' ' pid
    local workers=()
    count=$(jq length "$nodes")
    if ((count == 0)); then
        echo '[]'
        return
    fi
    ((count <= 4)) || die 'Probe batch exceeds four nodes'
    work=$(mktemp -d "$STATE/probe.XXXXXXXX")
    trap 'for pid in "${workers[@]}"; do kill "$pid" 2>/dev/null || :; done; stop_process "$process"; rm -rf -- "$work"' EXIT
    for ((i = 0; i < count; i++)); do
        while :; do
            port=$(free_port)
            [[ $used != *" $port "* ]] && break
        done
        used+="$port "
        jq -c --argjson i "$i" --argjson port "$port" '.[$i]+{probe_port:$port}' "$nodes" >>"$work/nodes.ndjson"
        : >"$work/result-$i"
    done
    jq -s . "$work/nodes.ndjson" >"$work/nodes.json"
    pool_config "$work/nodes.json" "$mode" >"$work/config.json"
    sing-box check -c "$work/config.json" >"$work/log" 2>&1 || die 'Probe configuration rejected' || return
    sing-box run -c "$work/config.json" >>"$work/log" 2>&1 &
    process=$!
    for ((i = 0; i < count; i++)); do
        (
            trap - EXIT INT TERM
            port=$(jq -r --argjson i "$i" '.[$i].probe_port' "$work/nodes.json")
            deadline=$((SECONDS + $(cfg .probe_seconds)))
            while ((SECONDS < deadline)) && kill -0 "$process" 2>/dev/null; do
                if answer=$(curl --silent --show-error --fail --max-time 7 --noproxy '' \
                    --proxy "socks5h://127.0.0.1:$port" "$(cfg .check_url)" 2>/dev/null) &&
                    public_ipv4 "$answer" && [[ $answer != "$(cfg .public_ip)" ]]; then
                    jq --argjson i "$i" --arg exit "$answer" --argjson now "$(date +%s)" \
                        '.[$i] | del(.probe_port) | .+{exit_ip:$exit,checked_at:$now}' "$work/nodes.json" >"$work/result-$i"
                    exit 0
                fi
                sleep 1
            done
        ) &
        workers+=("$!")
    done
    for pid in "${workers[@]}"; do
        wait "$pid"
    done
    workers=()
    kill -0 "$process" 2>/dev/null || die 'Probe sing-box exited unexpectedly' || return
    jq -s . "$work"/result-*
)

fetch_nodes() (
    local work i count now
    work=$(mktemp -d "$STATE/feed.XXXXXXXX")
    trap 'rm -rf -- "$work"' EXIT
    : >"$work/nodes.ndjson"
    if curl --noproxy '*' -fsSL --max-time 45 --max-filesize 8388608 "$(cfg .feed_url)" -o "$work/feed.csv" &&
        [[ $(head -c 12 "$work/feed.csv") == '*vpn_servers' ]]; then
        # CSV quoting (including commas and doubled quotes); never evaluate feed text.
        awk '
          function csv(s,  i,c,q,n) {
            n=1;q=0;delete a;a[n]=""
            for(i=1;i<=length(s);i++) {
              c=substr(s,i,1)
              if(c=="\"") {if(q && substr(s,i+1,1)=="\""){a[n]=a[n] c;i++}else q=!q}
              else if(c=="," && !q) a[++n]=""; else a[n]=a[n] c
            }
            return q?0:n
          }
          NR==2 {sub(/\r$/,"");sub(/^#/,"");csv($0);for(i in a) h[a[i]]=i;next}
          NR>2 && $0!="*" {
            sub(/\r$/,""); if(!csv($0)) next
            name=a[h["CountryLong"]];gsub(/[\t\r]/," ",name)
            printf "%s\t%s\t%s\t%s\t%s\n",a[h["IP"]],a[h["CountryShort"]],name,a[h["Score"]],a[h["OpenVPN_ConfigData_Base64"]]
          }' "$work/feed.csv" | jq -Rn '[inputs|split("\t")|{IP:.[0],CountryShort:.[1],CountryLong:.[2],Score:.[3],OpenVPN_ConfigData_Base64:.[4]}]' >"$work/rows.json"
        count=$(jq length "$work/rows.json")
        for ((i = 0; i < count; i++)); do
            jq --argjson i "$i" '.[$i]' "$work/rows.json" >"$work/row.json"
            if bash "$SRV_DIR/parse-node.sh" "$work/row.json" >"$work/node.json" 2>/dev/null; then
                jq -c . "$work/node.json" >>"$work/nodes.ndjson"
            fi
        done
    fi
    jq -s . "$work/nodes.ndjson" >"$work/nodes.json"
    now=$(date +%s)
    if [[ $(jq length "$work/nodes.json") != 0 ]]; then
        jq --argjson now "$now" '{fetched_at:$now,nodes:.}' "$work/nodes.json" | atomic "$STATE/feed-cache.json"
        cat "$work/nodes.json"
    elif [[ -f $STATE/feed-cache.json ]] && jq -e --argjson now "$now" '$now-.fetched_at<86400 and $now>=.fetched_at' "$STATE/feed-cache.json" >/dev/null; then
        echo 'Feed unavailable/unsupported; rechecking cache (<24h).' >&2
        jq .nodes "$STATE/feed-cache.json"
    else
        die 'No usable feed/cache; prior pool and subscriptions retained'
    fi
)

# selected/attempted are files so adaptive passes keep state without subshell loss.
select_nodes() (
    local candidates=$1 selected=$2 attempted=$3 relaxed=${4:-false} work cap maximum size
    maximum=$(cfg .max_nodes)
    cap=$(cfg .per_country)
    [[ $relaxed == false ]] || cap=$maximum
    work=$(mktemp -d "$STATE/select.XXXXXXXX")
    trap 'rm -rf -- "$work"' EXIT
    while :; do
        size=$(jq length "$selected")
        ((size < maximum)) || break
        jq --slurpfile s "$selected" --slurpfile a "$attempted" --argjson cap "$cap" \
            --argjson slots "$((maximum - size))" --argjson relaxed "$relaxed" '
          [$s[0][].ip] as $ips |
          reduce .[] as $n ([];
            if length >= ([4,$slots]|min) or (($relaxed|not) and $n.rank>=8) or
               ($a[0]|index($n.id))!=null or ($ips|index($n.ip))!=null or
               ([.[].ip]|index($n.ip))!=null or
               (([$s[0][]|select(.country==$n.country)]|length)+([.[]|select(.country==$n.country)]|length)) >= $cap
            then . else .+[$n] end)' "$candidates" >"$work/chunk.json"
        [[ $(jq length "$work/chunk.json") != 0 ]] || break
        jq --slurpfile c "$work/chunk.json" '.+[$c[0][].id]|unique' "$attempted" | atomic "$attempted"
        probe "$work/chunk.json" >"$work/healthy.json"
        jq --slurpfile h "$work/healthy.json" '.+$h[0]' "$selected" | atomic "$selected"
        jq -r '.[]|"Healthy \(.country) \(.ip) -> \(.exit_ip)"' "$work/healthy.json" >&2
    done
)

assign_ports() (
    local nodes=$1 work id port maximum minimum
    work=$(mktemp -d "$STATE/ports.XXXXXXXX")
    trap 'rm -rf -- "$work"' EXIT
    if [[ -f $STATE/ports.json ]]; then
        cp "$STATE/ports.json" "$work/registry.json"
    else
        echo '{}' >"$work/registry.json"
    fi
    minimum=$(cfg .port_min)
    maximum=$(cfg .port_max)
    echo '[]' >"$work/listeners.json"
    if command -v ss >/dev/null; then
        ss -H -ltn | awk '{port=$4; sub(/^.*:/,"",port); print port}' |
            jq -Rs 'split("\n") | map(select(test("^[0-9]+$")) | tonumber) | unique' >"$work/listeners.json"
    fi
    while IFS= read -r id; do
        if ! jq -e --arg id "$id" 'has($id)' "$work/registry.json" >/dev/null; then
            port=$(jq -er --argjson lo "$minimum" --argjson hi "$maximum" \
                --slurpfile c "$CONFIG/settings.json" --slurpfile d "$SRV_DIR/config/defaults.json" --slurpfile listeners "$work/listeners.json" \
                '($d[0] + $c[0]) as $c | ([.[].port]+$listeners[0]+[$c.subscription_port,$c.api_port,$c.anytls_port,$c.snell_port]) as $used | first(range($lo;$hi+1)|select(. as $p|$used|index($p)|not))' "$work/registry.json") || die 'Port range exhausted (retired ports never reused)' || return
            openssl rand -base64 32 >"$work/psk"
            jq --arg id "$id" --argjson port "$port" --rawfile psk "$work/psk" \
                '.[$id]={port:$port,psk:($psk|rtrimstr("\n"))}' "$work/registry.json" | atomic "$work/registry.json"
        fi
    done < <(jq -r '.[].id' "$nodes")
    atomic "$STATE/ports.json" <"$work/registry.json"
    jq --slurpfile registry "$work/registry.json" '[.[]|.+$registry[0][.id]|del(.rank)]' "$nodes" | atomic "$nodes"
)

activate() (
    local nodes=$1 verified=$2 work size i
    work=$(mktemp -d "$STATE/activate.XXXXXXXX")
    trap 'rm -rf -- "$work"' EXIT
    assign_ports "$nodes"
    jq 'sort_by(.port)' "$nodes" >"$work/ordered.json"
    pool_config "$work/ordered.json" >"$work/pool.json"
    sing-box check -c "$work/pool.json" >"$work/check.log" 2>&1 || die 'Candidate pool rejected; prior pool retained' || return
    if [[ ! -f $CONFIG/pool.json ]] || ! json_equal "$CONFIG/pool.json" "$work/pool.json"; then
        [[ ! -f $CONFIG/pool.json ]] || atomic "$CONFIG/pool.previous.json" <"$CONFIG/pool.json"
        atomic "$CONFIG/pool.json" 640 "$WEB_OWNER" <"$work/pool.json"
        if ! systemctl restart "$POOL" || ! {
            sleep 2
            systemctl is-active --quiet "$POOL"
        }; then
            if [[ -f $CONFIG/pool.previous.json ]]; then
                atomic "$CONFIG/pool.json" 640 "$WEB_OWNER" <"$CONFIG/pool.previous.json"
                systemctl restart "$POOL"
            fi
            die 'Pool startup failed; previous config restored'
            return 1
        fi
    fi
    : >"$work/results.ndjson"
    size=$(jq length "$nodes")
    for ((i = 0; i < size; i += 4)); do
        jq --argjson i "$i" '.[$i:$i+4]' "$nodes" >"$work/chunk.json"
        probe "$work/chunk.json" snell | jq -c '.[]' >>"$work/results.ndjson"
    done
    jq -s . "$work/results.ndjson" | atomic "$verified"
)

publish() (
    local nodes=$1 domain=$2 work cc path
    work=$(mktemp -d "$STATE/publish.XXXXXXXX")
    trap 'rm -rf -- "$work"' EXIT
    mkdir -p "$WEB"
    chmod 750 "$WEB"
    [[ -z $WEB_OWNER ]] || chown "$WEB_OWNER" "$WEB"
    jq --slurpfile c "$CONFIG/settings.json" --argjson subscription_port "$(cfg .subscription_port)" --arg domain "$domain" --arg now "$(date -u +%Y-%m-%dT%H:%M:%SZ)" '
      $c[0] as $c | . as $nodes | ("http://"+$domain+":"+($subscription_port|tostring)+"/"+$c.subscription_token) as $url |
      {updated_at:$now,vps:$c.label,nodes:[$nodes[]|{id,country,port,ip,exit_ip,checked_at}],
       countries:($nodes|group_by(.country)|map({key:.[0].country,value:{name:.[0].country_name,healthy:length,url:($url+"/"+.[0].country+".list")}})|from_entries)}' "$nodes" >"$work/index.json"
    while IFS= read -r cc; do
        jq --arg cc "$cc" '[.[]|select(.country==$cc)]' "$nodes" >"$work/country.json"
        {
            jq -r --arg cc "$cc" --slurpfile c "$CONFIG/settings.json" '
              "# Updated (UTC): \(.updated_at)\n# Country: \(.countries[$cc].name) (\($cc))\n# VPS: \(.vps) / \($c[0].domain)\n# Healthy nodes: \(.countries[$cc].healthy)"' "$work/index.json"
            proxy_lines "$work/country.json"
        } | atomic "$WEB/$cc.list" 640 "$WEB_OWNER"
    done < <(jq -r '.countries|keys[]' "$work/index.json")
    jq -r --slurpfile c "$CONFIG/settings.json" '
      "# Updated (UTC): \(.updated_at)\n# VPS: \(.vps) / \($c[0].domain)\n# Healthy nodes: \(.nodes|length)"' "$work/index.json" >"$work/header"
    if [[ $(jq length "$nodes") != 0 ]]; then
        {
            cat "$work/header"
            proxy_lines "$nodes"
        } | atomic "$WEB/all.list" 640 "$WEB_OWNER"
    else rm -f -- "$WEB/all.list"; fi
    {
        cat "$work/header"
        echo '[Proxy Group]'
        jq -r --slurpfile c "$CONFIG/settings.json" '
          .countries|to_entries[]|.key as $cc|
          ($cc|explode|map(.+127397)|implode) as $flag|
          "\($c[0].label)@\($cc|ascii_downcase) = smart, policy-path=\(.value.url), include-all-proxies=0, hidden=1, evaluate-before-use=1, icon-url=EMOJI::\($flag), update-interval=\($c[0].interval_minutes*60)"' "$work/index.json"
    } | atomic "$WEB/groups.dconf" 640 "$WEB_OWNER"
    atomic "$WEB/index.json" 640 "$WEB_OWNER" <"$work/index.json"
    for path in "$WEB"/[A-Z][A-Z].list; do
        [[ -f $path ]] || continue
        cc=${path##*/}
        cc=${cc%.list}
        if ! jq -e --arg cc "$cc" '.countries|has($cc)' "$work/index.json" >/dev/null; then
            rm -f -- "$path"
        fi
    done
    echo "Published $(jq length "$nodes") healthy nodes ($domain)." >&2
)

proxy_lines() {
    jq -r --slurpfile c "$CONFIG/settings.json" '.[]|
      "# Country: \(.country_name) (\(.country)); node: \(.id); VPN server: \(.ip); verified exit: \(.exit_ip); score: \(.score)",
      "\($c[0].label)@\(.country|ascii_downcase)-\(.id) = snell, \($c[0].domain), \(.port), psk=\(.psk), version=6, reuse=true, tfo=true"' "$1"
}

refresh() (
    local work domain maximum
    exec 9>"$STATE/refresh.lock"
    flock -n 9 || {
        echo 'Refresh already running.'
        return
    }
    work=$(mktemp -d "$STATE/refresh.XXXXXXXX")
    trap 'rm -rf -- "$work"' EXIT
    domain=$(tailnet)
    fetch_nodes >"$work/feed.json"
    if [[ -f $STATE/selected.json ]]; then
        cp "$STATE/selected.json" "$work/previous.json"
    else
        echo '[]' >"$work/previous.json"
    fi
    jq --slurpfile c "$CONFIG/settings.json" --slurpfile p "$work/previous.json" '
      [$p[0][].id] as $ids | $c[0].countries as $wanted |
      unique_by(.id) |
      map(select(($wanted|length)==0 or (.country as $cc|$wanted|index($cc))!=null)) |
      group_by(.country) | map(sort_by([(.id as $id|($ids|index($id))==null),-.score]) | to_entries|map(.value+{rank:.key})) |
      add // [] | sort_by([.rank,.country])' "$work/feed.json" >"$work/candidates.json"
    echo '[]' >"$work/selected.json"
    echo '[]' >"$work/attempted.json"
    select_nodes "$work/candidates.json" "$work/selected.json" "$work/attempted.json"
    activate "$work/selected.json" "$work/verified.json"
    maximum=$(cfg .max_nodes)
    while (($(jq length "$work/verified.json") * 2 < maximum)); do
        echo "Healthy $(jq length "$work/verified.json")/$maximum (<50%): lifting country cap." >&2
        cp "$work/verified.json" "$work/expanded.json"
        select_nodes "$work/candidates.json" "$work/expanded.json" "$work/attempted.json" true
        [[ $(jq length "$work/expanded.json") != "$(jq length "$work/verified.json")" ]] || break
        activate "$work/expanded.json" "$work/verified.json"
    done
    atomic "$STATE/selected.json" <"$work/verified.json"
    publish "$work/verified.json" "$domain"
)

status() {
    sing-box version | head -1
    systemctl is-active sing-box.service "$POOL" sing-box-vpngate-http.service sing-box-vpngate-refresh.timer || :
    api tailscale status
    [[ ! -f $WEB/index.json ]] || jq . "$WEB/index.json"
}
if [[ ${BASH_SOURCE[0]} == "$0" ]]; then
    case ${1:-} in
    refresh) refresh ;;
    status) status ;;
    *)
        die 'Usage: vpngate.sh refresh|status'
        exit 2
        ;;
    esac
fi
