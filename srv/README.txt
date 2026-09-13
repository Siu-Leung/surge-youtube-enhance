SING-BOX VPN GATE TOOLKIT — USAGE GUIDE

REQUIREMENTS

Management machine: Bash 4+, jq, OpenSSL, tar and SSH (Linux or macOS).
Server: Debian or Ubuntu, systemd, x86_64 or aarch64, root/passwordless sudo.
Fresh setup uses Cloudflare DNS-01 certificates and sing-box's built-in Tailscale.
Separate Tailscale/OpenVPN daemons are not required.
An existing base installation must have one AnyTLS inbound, one Snell v6 inbound,
one Tailscale endpoint, and a direct outbound tagged direct.

Run commands from this directory. Replace edge-1 with your SSH alias.
No default servers are selected. SSH uses batch mode; configure key-based login.
Repeat --host for multiple servers, or use --local directly on a server as root.

QUICK START

1. Copy settings.example.json to settings.local.json and protect it:
     cp settings.example.json settings.local.json
     chmod 600 settings.local.json
   Replace host keys, domains, hostnames, and labels. Remove unused example hosts.

2. Preview locally, without SSH or server changes:
     ./deploy.sh --headless --host edge-1 --settings settings.local.json --action plan
   Preview omits credentials and validates settings. Saved server values are
   merged only during deployment; this is not a remote-state diff.

3. Run read-only server prerequisite checks:
     ./deploy.sh --headless --host edge-1 --action doctor

4. Deploy interactively:
     ./deploy.sh --host edge-1 --settings settings.local.json
   Or without prompts:
     ./deploy.sh --headless --host edge-1 --settings settings.local.json --detach

--detach prints a persistent systemd setup job name and returns immediately.
Without it, remote deployment waits for setup, refresh, and verification.
Local deployment returns after setup starts the first refresh.
Use --help to list actions and arguments.

FRESH SERVERS

Point the public domain to the server. Open configured AnyTLS/Snell TCP ports
and the node port range in its cloud firewall (defaults: 443, 8443, 13107–65535).
Do not publicly expose subscription/API ports.

Interactive mode asks for domain, hostname, Cloudflare DNS token and optional
Tailscale auth key. Headless fresh setup requires private settings such as:

  {
      "hosts": {
          "edge-1": {
              "domain": "proxy.example.com",
              "hostname": "edge-1",
              "label": "edge-1",
              "cloudflare_api_token": "YOUR_TOKEN"
          }
      }
  }

Optionally add tailscale_auth_key for unattended authentication. Otherwise use
--detach, authenticate with the URL in the journal, then refresh:
  ssh edge-1 sudo journalctl -u sing-box --no-pager
  ./deploy.sh --headless --host edge-1 --action refresh

Approve exit-node use in Tailscale admin if required.
Never commit credentials, keys, private settings, backups, or generated lists.
Subscription URLs contain access tokens; list files contain proxy passwords.

SETTINGS

Precedence: built-in defaults, saved server settings, requested defaults, requested
host settings, then --max-nodes. Omitted settings retain installed values.
See config/defaults.json for all default values. Unknown settings are rejected.

domain / hostname / label
  Public proxy domain, Tailscale hostname, and Surge group/node prefix.

anytls_port / snell_port
  Fresh base listener ports. Existing ports are discovered and retained; change
  those in the base installation separately.

listen_address
  :: for dual stack or 0.0.0.0 for IPv4-only. Applies to VPN node listeners and
  fresh base listeners. Existing base listeners remain unchanged.

subscription_port / api_port
  Distinct private loopback ports, 1024–65535. Generated URLs, routes and services
  use these values. They must not collide with existing base/node ports.

port_min / port_max
  Inclusive VPN node TCP port range, 1024–65535. Existing assignments remain
  stable, even after narrowing the range. Retired assignments are not reused.
  New allocations skip known listeners and reserved service ports.

countries / per_country / max_nodes
  "all" or comma-separated country codes; normal country cap; global node cap.
  Node limits accept 1–128. Below 50% healthy capacity the country cap is relaxed,
  while the global limit remains enforced. Larger pools need more RAM.

interval_minutes / refresh_timeout_minutes / probe_seconds
  Delay between completed refreshes (5–1440 minutes), overall refresh time limit
  (5–240 minutes), and per-node probe budget (10–120 seconds).

feed_url / check_url
  HTTPS VPN Gate CSV endpoint and HTTPS endpoint returning a plain public IPv4
  address. Defaults use VPN Gate and ipify. URLs cannot contain credentials.

pool_memory_mb / refresh_memory_mb / http_memory_mb
  systemd memory limits in MiB. Size these for the server and desired pool.

tune_network
  false by default. Set true to apply system-wide BBR/fq, TCP Fast Open and PMTU
  tuning. Requires kernel BBR support.

sing_box_version
  Stable 1.14+ release to install; default 1.14.0. Other releases require your
  validation. Downgrades are refused. The supported installation is the official
  manual install at /usr/bin/sing-box, using /etc/sing-box/config.json.

Example override:
  {
      "defaults": {"countries":"JP,KR", "max_nodes":24},
      "hosts": {"edge-1":{"subscription_port":28080,"api_port":28081}}
  }

  ./deploy.sh --headless --host edge-1 --settings settings.local.json
  ./deploy.sh --headless --host edge-1 --max-nodes 24

SURGE SUBSCRIPTIONS

1. Sign Surge into the same tailnet. Permit the configured subscription port in
   tailnet ACLs; route the server's .ts.net hostname through Tailscale.
2. Display available country URLs:
     ./deploy.sh --headless --host edge-1 --action urls
3. Open groups.dconf at the same URL prefix as the country lists.
4. Copy group entries into your existing [Proxy Group] section. Do not replace
   your entire profile with groups.dconf.

Country lists refresh automatically. Recopy groups when countries appear or
disappear. all.list contains every published healthy node. Unavailable countries
have no list (HTTP 404); no reject placeholders are generated.

OPERATIONS AND RECOVERY

  ./deploy.sh --headless --host edge-1 --action status
  ./deploy.sh --headless --host edge-1 --action refresh
  ./deploy.sh --headless --host edge-1 --action verify
  ./deploy.sh --headless --host edge-1 --settings settings.local.json --action upgrade

  ssh edge-1 sudo journalctl -u sing-box-vpngate-refresh -n 60 --no-pager
  ssh edge-1 sudo systemctl list-timers sing-box-vpngate-refresh.timer

Pause/resume automatic refresh without stopping current proxies:
  ssh edge-1 sudo systemctl stop sing-box-vpngate-refresh.timer
  ssh edge-1 sudo systemctl start sing-box-vpngate-refresh.timer

Setup prints a private recovery snapshot path. On setup errors it attempts to
restore prior configuration, service definitions, and enabled/running states.
Package changes are not undone. Review the journal and snapshot after a failure.
Upgrades have separate binary/config backups. Do not delete Tailscale/ACME state.

TESTING

  bash test.sh
  bash test-settings.sh

Local tests require neither root nor SSH. Surge profile validation runs when its
CLI is installed. Test installation and upgrade/rollback paths on a disposable
supported Linux server before production deployment.
