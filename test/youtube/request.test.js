// Tests for scripts/youtube/request.js: ad_break short-circuiting, hot-hash
// stripping, onesie key negotiation, and SABR Auto HD.
const { runRequest, check, section, summary, P } = require("./run.js");
const { ld, vi, concat, enc } = P;

const INNERTUBE = "https://youtubei.googleapis.com/youtubei/v1/";
const GV = "https://rr1---sn-x.googlevideo.com/";

const CLIENT_KEY = Buffer.from(new Uint8Array(32).map((_, i) => i + 1));
const ENCRYPT_KEY = Buffer.from(new Uint8Array(32).map((_, i) => 200 - i));
const STORE = {
    YouTubeConfig: JSON.stringify({
        youtube: { clientKey: CLIENT_KEY.toString("base64"), encryptKey: ENCRYPT_KEY.toString("base64") },
    }),
};

// ---------------------------------------------------------------------------
section("player/ad_break is short-circuited");
{
    const out = runRequest({ url: INNERTUBE + "player/ad_break?key=AIza", store: STORE });
    check("no script error", !out.error, out.error);
    const res = out.done?.response ?? out.done;
    check("responds with 200", res?.status === 200, JSON.stringify(res));
    check("content-type is protobuf", res?.headers?.["Content-Type"] === "application/x-protobuf");
    check("body is empty", res?.body && Buffer.from(res.body).length === 0);
}

// ---------------------------------------------------------------------------
section("initplayback: key negotiation");
{
    // The request carries the encrypted client key the app derived from
    // encryptKey. If it matches what we cached, the session is legitimate.
    const goodBody = ld(3, ld(5, ENCRYPT_KEY));
    const ok = runRequest({ url: GV + "initplayback?source=youtube", requestBody: goodBody, store: STORE });
    check("matching key passes through untouched", ok.done && !ok.done.response && !ok.done.headers && !ok.done.body, JSON.stringify(ok.done));
    check("matching key keeps the cache", !!JSON.parse(ok.persistent.YouTubeConfig ?? "{}").youtube);

    const stale = runRequest({
        url: GV + "initplayback?source=youtube",
        requestBody: ld(3, ld(5, Buffer.from(new Uint8Array(32).map(() => 7)))),
        store: STORE,
    });
    check("stale key triggers fallback", !!stale.done?.response);
    check("stale key clears the cache", JSON.stringify(JSON.parse(stale.persistent.YouTubeConfig ?? "{}")) === "{}", stale.persistent.YouTubeConfig);

    const noKeys = runRequest({ url: GV + "initplayback?source=youtube", requestBody: goodBody, store: {} });
    check("missing cache triggers fallback", !!noKeys.done?.response);

    const noBody = runRequest({ url: GV + "initplayback?source=youtube", requestBody: new Uint8Array(), store: STORE });
    check("empty body triggers fallback", !!noBody.done?.response);
}

// ---------------------------------------------------------------------------
section("log_event: hot-hash header is dropped only when no key is cached");
{
    const headers = { "X-Youtube-Hot-Hash-Data": "abc123", "Content-Type": "application/json" };
    const without = runRequest({ url: INNERTUBE + "log_event", headers, requestBody: new Uint8Array(), store: {} });
    check("hot-hash removed without cached key", without.done?.headers && !("X-Youtube-Hot-Hash-Data" in without.done.headers), JSON.stringify(without.done?.headers));
    check("other headers preserved", without.done?.headers?.["Content-Type"] === "application/json");

    const withKeys = runRequest({ url: INNERTUBE + "log_event", headers, requestBody: new Uint8Array(), store: STORE });
    check("hot-hash kept when a key is cached", withKeys.done?.headers?.["X-Youtube-Hot-Hash-Data"] === "abc123");

    // Header matching must be case-insensitive.
    const mixed = runRequest({ url: INNERTUBE + "log_event", headers: { "x-youtube-hot-hash-data": "abc123" }, requestBody: new Uint8Array(), store: {} });
    check("case-insensitive header match", mixed.done?.headers && !("x-youtube-hot-hash-data" in mixed.done.headers));
}

// ---------------------------------------------------------------------------
section("videoplayback: Auto HD forces the highest quality ceiling");
{
    // SABR ClientAbrState: 16 = max resolution, 26 = high-quality preference.
    const body = concat([ld(1, concat([vi(16, 1080), vi(26, 0)])), vi(2, 5)]);
    const on = runRequest({ url: GV + "videoplayback?x=1", requestBody: body, argument: JSON.stringify({ autoHd: true }), store: STORE });
    const outHex = Buffer.from(on.done?.body ?? []).toString("hex");
    check("field 16 raised to 4320", outHex.includes("8001e021"), outHex);
    check("field 26 set to 1", outHex.includes("d00101"), outHex);
    check("unrelated fields preserved", outHex.includes("1005"), outHex);

    const off = runRequest({ url: GV + "videoplayback?x=1", requestBody: body, argument: JSON.stringify({ autoHd: false }), store: STORE });
    check("autoHd=false leaves the body alone", !off.done?.body);

    const noBody = runRequest({ url: GV + "videoplayback?x=1", requestBody: new Uint8Array(), argument: JSON.stringify({ autoHd: true }), store: STORE });
    check("no body is left alone", !noBody.done?.body);
}

// ---------------------------------------------------------------------------
section("unmatched URLs and bad input are harmless");
{
    const cases = [
        ["plain youtube.com", "https://www.youtube.com/watch?v=xyz", new Uint8Array()],
        ["unrelated API", INNERTUBE + "something_else", new Uint8Array()],
        ["garbage body", INNERTUBE + "log_event", new Uint8Array([0xff, 0xff, 0xff])],
    ];
    for (const [name, url, requestBody] of cases) {
        const out = runRequest({ url, requestBody, store: STORE });
        check(`${name}: no crash`, !out.error, out.error);
        check(`${name}: $done called`, out.done !== null);
    }
}

const s = summary();
console.log(`\nrequest.js: ${s.passed} passed, ${s.failed} failed`);
if (s.failed) {
    console.log("failures:\n  " + s.failures.join("\n  "));
    process.exitCode = 1;
}
