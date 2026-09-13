# Shared validation for previews and server-side installation.
def require($condition; $message):
    if $condition then . else error($message) end;
def integer($lo; $hi):
    type == "number" and floor == . and . >= $lo and . <= $hi;
def dns_name:
    type == "string" and length <= 253 and
    (split(".") | all(.[];
        length <= 63 and test("^[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?$")));
def https_url:
    type == "string" and test("^https://[A-Za-z0-9.-]+(:[0-9]+)?(/[^\\s]*)?$");
def normalize:
    if has("countries") and (.countries | type) == "string" then
        .countries |= (if ascii_downcase == "all" then [] else
            ascii_upcase | split(",") | map(gsub("^\\s+|\\s+$"; "")) end)
    else . end;
def validate($defaults):
    require(type == "object"; "Settings must be an object")
    | require(((keys - ($defaults | keys) - [
        "domain", "hostname", "label", "cloudflare_api_token", "tailscale_auth_key"
    ]) | length) == 0; "Unknown settings key")
    | normalize
    | $defaults + .
    | require(.listen_address == "::" or .listen_address == "0.0.0.0";
        "listen_address must be :: (dual stack) or 0.0.0.0 (IPv4)")
    | require(.sing_box_version | test("^1\\.(1[4-9]|[2-9][0-9])\\.[0-9]+$");
        "sing_box_version must be a stable 1.14+ release")
    | require(all(.anytls_port, .snell_port; integer(1; 65535)); "Invalid base proxy port")
    | require(all(.subscription_port, .api_port; integer(1024; 65535)); "Private ports must be 1024..65535")
    | require(([.anytls_port, .snell_port, .subscription_port, .api_port] | unique | length) == 4;
        "Listener ports must be distinct")
    | require(all(.port_min, .port_max; integer(1024; 65535)) and .port_min <= .port_max;
        "Invalid VPN node port range")
    | require(.max_nodes | integer(1; 128); "max_nodes must be 1..128")
    | require(.per_country | integer(1; 128); "per_country must be 1..128")
    | require(.port_max - .port_min + 1 >= .max_nodes; "Node port range is too small")
    | require(.interval_minutes | integer(5; 1440); "interval_minutes must be 5..1440")
    | require(.refresh_timeout_minutes | integer(5; 240); "refresh_timeout_minutes must be 5..240")
    | require(.probe_seconds | integer(10; 120); "probe_seconds must be 10..120")
    | require(all(.pool_memory_mb, .refresh_memory_mb, .http_memory_mb; integer(32; 65536));
        "Memory limits must be 32..65536 MiB")
    | require(.tune_network | type == "boolean"; "tune_network must be boolean")
    | require(.countries | type == "array" and all(.[]; type == "string" and test("^[A-Z]{2}$"));
        "countries must contain two-letter country codes")
    | require(all(.feed_url, .check_url; https_url); "Feed/check URLs must use HTTPS without credentials")
    | require(all(.domain?, .hostname?; . == null or dns_name); "Invalid domain or hostname")
    | require(.hostname == null or (.hostname | length <= 63 and test("^[A-Za-z0-9][A-Za-z0-9-]*$"));
        "hostname must be a single DNS label")
    | require(.label == null or (.label | type == "string" and test("^[A-Za-z0-9_-]+$"));
        "label may contain letters, digits, underscores and hyphens")
    | require(all(.cloudflare_api_token?, .tailscale_auth_key?; . == null or (type == "string" and length > 0));
        "Credentials must be nonempty strings")
    | if .domain != null then .domain |= ascii_downcase else . end
    | if .hostname != null then .hostname |= ascii_downcase else . end;
validate($defaults[0])
