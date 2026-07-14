/**
 * Based on the Sub-info.js from @mieqq.
 * Rewritten for Surge module arguments.
 */

const DEFAULT_TITLE = "Sub Info";
const DAY_MS = 24 * 60 * 60 * 1000;
const args = parseArguments(typeof $argument === "undefined" ? "" : $argument);

main().catch((error) => {
    finish({
        title: panelTitle(),
        content: `Error: ${messageOf(error)}`,
        style: "error",
        icon: "exclamationmark.triangle.fill",
        color: "#ff453a",
    });
});

async function main() {
    const url = subscriptionUrl();
    if (!url) throw new Error("missing url");

    const timeout = numberArg(["timeout"], 10);
    const policy = arg(["policy", "node"], "");
    const unit = arg(["unit"], "GB").toUpperCase() === "GIB" ? "GiB" : "GB";
    const divisor = unit === "GiB" ? 1024 ** 3 : 1000 ** 3;

    const warmup = Math.floor(
        clamp(numberArg(["warmup", "warmup_requests"], 1), 0, 3),
    );
    for (let index = 0; index < warmup; index += 1) {
        await fetchSubscription(url, timeout, policy).catch(() => {});
    }

    const response = await fetchSubscription(url, timeout, policy);

    if (!response.ok) {
        throw new Error(`subscription HTTP ${statusOf(response)}`);
    }

    const userInfo = headerValue(response.headers, "subscription-userinfo");
    if (!userInfo) throw new Error("missing subscription-userinfo");

    const info = parseUserInfo(userInfo);
    const upload = numberFrom(info, ["upload"]);
    const download = numberFrom(info, ["download"]);
    const total = numberFrom(info, ["total"]);

    if (!Number.isFinite(total) || total <= 0) throw new Error("bad total");
    if (!Number.isFinite(upload) || upload < 0) throw new Error("bad upload");
    if (!Number.isFinite(download) || download < 0)
        throw new Error("bad download");

    const used = upload + download;
    const left = Math.max(total - used, 0);
    const usedPercent = clamp((used / total) * 100, 0, 999);
    const leftPercent = clamp(100 - usedPercent, 0, 100);
    const resetDays = resetDaysLeft(arg(["reset_day", "reset-day"], ""));
    const expireAt = expireTime(info.expire, arg(["expire"], "auto"));
    const expireDays = daysUntil(expireAt);
    const state = stateFor(leftPercent, expireAt ? expireDays : null);

    const lines = [
        `Used: ${formatBytes(used, divisor)} / ${formatBytes(total, divisor)} ${unit} (${usedPercent.toFixed(2)}%)`,
        `Left: ${formatBytes(left, divisor)} ${unit} (${leftPercent.toFixed(2)}%)`,
        bar(usedPercent),
    ];

    if (resetDays !== null) lines.push(`Reset: ${resetDays}d`);
    if (expireAt)
        lines.push(`Expire: ${formatDate(expireAt)} (${expireDays}d)`);
    lines.push(`Updated: ${timestamp()}`);

    finish({
        title: panelTitle(),
        content: lines.join("\n"),
        style: state.style,
        icon: state.icon,
        color: state.color,
    });
}

function fetchSubscription(url, timeout, policy) {
    return httpGet(url, {
        timeout,
        policy: isPlaceholder(policy) ? undefined : policy,
        headers: {
            Accept: "*/*",
            "Cache-Control": "no-cache",
            "User-Agent": "Quantumult%20X",
        },
    });
}

function finish({ title, content, style, icon, color }) {
    finishNative({
        title,
        content,
        style,
        icon,
        "icon-color": color,
    });
}

function finishNative(payload) {
    if (typeof $done === "function") return $done(payload);
}

function httpGet(url, { headers, timeout, policy } = {}) {
    const request = {
        url,
        headers,
        timeout,
        "auto-redirect": true,
    };
    if (policy) request.policy = policy;

    return new Promise((resolve, reject) => {
        $httpClient.get(request, (error, response = {}, body = "") => {
            if (error) {
                reject(new Error(messageOf(error)));
                return;
            }

            const status = Number(response.status || 0);
            response.ok = status >= 200 && status < 300;
            response.status = status;
            response.statusCode = status;
            response.body = body;
            resolve(response);
        });
    });
}

function subscriptionUrl() {
    const raw = arg(["url", "subscription_url", "sub_url"], "").trim();
    if (isPlaceholder(raw)) return "";
    if (/^https?:\/\//i.test(raw)) return raw;

    const decoded = decodeIfUrl(raw);
    if (/^https?:\/\//i.test(decoded)) return decoded;

    const decodedBase64 = decodeBase64IfUrl(raw);
    if (/^https?:\/\//i.test(decodedBase64)) return decodedBase64;

    return raw;
}

function panelTitle() {
    const name = arg(["name"], "");
    if (isPlaceholder(name)) return DEFAULT_TITLE;
    return `${name} Bandwidth`;
}

function headerValue(headers, name) {
    const expected = name.toLowerCase();
    if (!headers) return "";
    if (typeof headers.get === "function") {
        return headers.get(name) || headers.get(expected) || "";
    }
    if (Array.isArray(headers)) {
        for (const [key, value] of headers) {
            if (String(key).toLowerCase() === expected) return String(value);
        }
        return "";
    }
    if (typeof headers !== "object") return "";
    for (const [key, value] of Object.entries(headers)) {
        if (String(key).toLowerCase() === expected) return String(value);
    }
    return "";
}

function statusOf(response) {
    return response.status || response.statusCode || 0;
}

function parseUserInfo(value) {
    const result = {};
    const matches = String(value).matchAll(
        /(?:^|[\s;])([A-Za-z_]+)=([\d.eE+-]+)/g,
    );
    for (const match of matches) {
        result[match[1].toLowerCase()] = Number(match[2]);
    }
    return result;
}

function expireTime(headerExpire, override) {
    if (isPlaceholder(override) || String(override).toLowerCase() === "false") {
        return 0;
    }

    if (override && String(override).toLowerCase() !== "auto") {
        return parseTime(override);
    }

    return parseTime(headerExpire);
}

function parseTime(value) {
    if (value === undefined || value === null || value === "") return 0;
    const text = String(value).trim();
    if (/^\d+(\.\d+)?$/.test(text)) {
        const number = Number(text);
        return number > 1e12 ? number : number * 1000;
    }

    const date = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (date) {
        return new Date(
            Number(date[1]),
            Number(date[2]) - 1,
            Number(date[3]),
        ).getTime();
    }

    const parsed = Date.parse(text);
    return Number.isFinite(parsed) ? parsed : 0;
}

function daysUntil(time) {
    if (!time) return 0;
    const today = startOfDay(new Date()).getTime();
    return Math.ceil((time - today) / DAY_MS);
}

function resetDaysLeft(value) {
    if (isPlaceholder(value)) return null;

    const resetDay = Number(value);
    if (!Number.isInteger(resetDay) || resetDay < 1 || resetDay > 31) {
        return null;
    }

    const now = new Date();
    const today = startOfDay(now);
    let target = resetDate(now.getFullYear(), now.getMonth(), resetDay);
    if (target.getTime() <= today.getTime()) {
        target = resetDate(now.getFullYear(), now.getMonth() + 1, resetDay);
    }

    return Math.ceil((target.getTime() - today.getTime()) / DAY_MS);
}

function resetDate(year, month, resetDay) {
    const maxDay = new Date(year, month + 1, 0).getDate();
    return startOfDay(new Date(year, month, Math.min(resetDay, maxDay)));
}

function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function stateFor(leftPercent, expireDays) {
    if (
        leftPercent <= 5 ||
        (expireDays !== null && expireDays !== undefined && expireDays <= 3)
    ) {
        return {
            style: "error",
            icon: "exclamationmark.triangle.fill",
            color: "#ff453a",
        };
    }
    if (
        leftPercent <= 20 ||
        (expireDays !== null && expireDays !== undefined && expireDays <= 7)
    ) {
        return {
            style: "alert",
            icon: "gauge.with.dots.needle.bottom.100percent",
            color: "#ff9f0a",
        };
    }
    return {
        style: "good",
        icon: "gauge.with.dots.needle.bottom.50percent",
        color: "#32d74b",
    };
}

function bar(percent) {
    const width = 18;
    const filled = Math.round((clamp(percent, 0, 100) / 100) * width);
    return `[${"#".repeat(filled)}${"-".repeat(width - filled)}]`;
}

function decodeIfUrl(value) {
    try {
        return decodeURIComponent(String(value));
    } catch {
        return String(value);
    }
}

function decodeBase64IfUrl(value) {
    let normalized = String(value)
        .trim()
        .replace(/\s/g, "+")
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    while (normalized.length % 4) normalized += "=";

    try {
        if (typeof atob === "function") return atob(normalized);
    } catch {
        return "";
    }

    return "";
}

function isPlaceholder(value) {
    return ["", "-", "none", "null", "undefined"].includes(
        String(value).trim().toLowerCase(),
    );
}

function parseArguments(value) {
    if (value && typeof value === "object") return value;

    const result = {};
    for (const item of String(value || "")
        .replace(/^\?/, "")
        .split("&")) {
        if (!item) continue;
        const separator = item.indexOf("=");
        const key = decodeArgument(
            separator < 0 ? item : item.slice(0, separator),
        );
        if (!key) continue;
        result[key] = decodeArgument(
            separator < 0 ? "" : item.slice(separator + 1),
        );
    }
    return result;
}

function decodeArgument(value) {
    try {
        return decodeURIComponent(String(value).replace(/\+/g, " "));
    } catch {
        return String(value);
    }
}

function arg(names, fallback = "") {
    for (const name of names) {
        const value = getPath(args, name);
        if (value !== undefined && value !== null && String(value).length > 0) {
            return String(value);
        }
    }
    return fallback;
}

function numberArg(names, fallback) {
    const value = Number(arg(names, fallback));
    return Number.isFinite(value) ? value : fallback;
}

function numberFrom(object, names) {
    for (const name of names) {
        const value = Number(getPath(object, name));
        if (Number.isFinite(value)) return value;
    }
    return NaN;
}

function getPath(object, path) {
    return String(path)
        .split(".")
        .reduce(
            (value, key) => (value == null ? undefined : value[key]),
            object,
        );
}

function formatBytes(bytes, divisor) {
    return (bytes / divisor).toFixed(2);
}

function formatDate(time) {
    const date = new Date(time);
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function timestamp() {
    const date = new Date();
    const pad = (value) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function messageOf(error) {
    return error && error.message ? error.message : String(error);
}
