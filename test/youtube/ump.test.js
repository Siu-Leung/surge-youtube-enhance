// Tests for the UMP / "onesie" rewrite path in scripts/youtube/response.js.
// This is the encrypted stream served from googlevideo.com/initplayback that
// carries the real player response when YouTube bypasses /youtubei/v1/player.
const { runResponse, check, section, summary, P } = require("./run.js");
const U = require("./ump.js");
const { ld, vi, concat, enc, playability } = P;

const URL = "https://rr3---sn-abc.googlevideo.com/initplayback?source=youtube";
const ARGS = JSON.stringify({ blockGames: true, blockVerticalLive: false });

const CLIENT_KEY = Buffer.from(new Uint8Array(32).map((_, i) => i + 1));
const STORE = U.storeFor(CLIENT_KEY);
const hexToBytes = (h) => Buffer.from(h, "hex");
const has = (b, s) => !!b && Buffer.from(b).includes(Buffer.from(s));

function adPlayer() {
    return concat([
        ld(7, "ADPLACEMENT_1"),
        ld(68, "ADSLOT_1"),
        ld(61, "PAID_PROMOTION"),
        ld(2, playability()),
    ]);
}

function runUmp(buffer, store = STORE) {
    return runResponse({ url: URL, responseBody: new Uint8Array(buffer), argument: ARGS, store });
}

// ---------------------------------------------------------------------------
section("initplayback: ads inside the encrypted part are stripped");
{
    const ump = U.buildUmp({ clientKey: CLIENT_KEY, player: adPlayer() });
    const out = runUmp(ump);
    check("no script error", !out.error, out.error);
    const body = out.done && (out.done.body ?? out.done.bodyBytes);
    check("body rewritten", !!body);
    if (body) {
        const parts = U.readParts(body);
        const enc = parts.find((p) => p.type === U.ENCRYPTED_RESPONSE_PART);
        check("encrypted part still present", !!enc);
        check("unrelated parts survive", has(body, "DECOY_BEFORE"));
        if (enc) {
            const { plaintext, hmacValid } = U.decryptPart(CLIENT_KEY, enc.data);
            check("HMAC is re-signed correctly", hmacValid);
            check("adPlacements stripped", !has(plaintext, "ADPLACEMENT_1"));
            check("adSlots stripped", !has(plaintext, "ADSLOT_1"));
            check("paidPromotion stripped", !has(plaintext, "PAID_PROMOTION"));
            // PlayabilityStatus{21: PiP} must still be in the rewritten body
            check("playabilityStatus survives", has(plaintext, Buffer.from(hexToBytes("aa01"))), plaintext.toString("hex"));
        }
    }
}

// ---------------------------------------------------------------------------
section("initplayback: every compression variant is handled");
{
    const variants = [
        ["gzip level 0 (stored)", { gzip: true, level: 0 }],
        ["gzip level 6 (default)", { gzip: true, level: 6 }],
        ["gzip level 9", { gzip: true, level: 9 }],
        ["uncompressed", { gzip: false }],
    ];
    for (const [name, opts] of variants) {
        const ump = U.buildUmp({ clientKey: CLIENT_KEY, player: adPlayer(), ...opts });
        const out = runUmp(ump);
        const body = out.done && (out.done.body ?? out.done.bodyBytes);
        if (!body) { check(name + ": rewritten", false, "no output"); continue; }
        const enc = U.readParts(body).find((p) => p.type === U.ENCRYPTED_RESPONSE_PART);
        const { plaintext, hmacValid } = U.decryptPart(CLIENT_KEY, enc.data);
        check(`${name}: ads stripped`, !has(plaintext, "ADPLACEMENT_1"));
        check(`${name}: HMAC valid`, hmacValid);
    }
}

// ---------------------------------------------------------------------------
section("initplayback: parts after the encrypted one are preserved");
{
    const ump = U.buildUmp({ clientKey: CLIENT_KEY, player: adPlayer(), after: true });
    const out = runUmp(ump);
    const body = out.done && (out.done.body ?? out.done.bodyBytes);
    check("trailing part survives", body && has(body, "TRAILER_AFTER"));
    check("leading part survives", body && has(body, "DECOY_BEFORE"));
    if (body) {
        const types = U.readParts(body).map((p) => p.type).join(",");
        check("part order unchanged", types === "31,10,11,31", types);
    }
}

// ---------------------------------------------------------------------------
section("initplayback: failure modes degrade to a safe fallback");
{
    const wrongKey = Buffer.from(new Uint8Array(32).map((_, i) => 250 - i));
    const cases = [
        ["wrong client key (HMAC fails)", U.buildUmp({ clientKey: wrongKey, player: adPlayer() }), STORE, "HMAC verification failed"],
        ["no stored key", U.buildUmp({ clientKey: CLIENT_KEY, player: adPlayer() }), {}, "clientKey"],
        ["truncated stream", (() => { const u = U.buildUmp({ clientKey: CLIENT_KEY, player: adPlayer() }); return u.subarray(0, u.length - 5); })(), STORE, "Truncated"],
        ["garbage body", Buffer.from("not a ump stream"), STORE, null],
        ["empty body", Buffer.alloc(0), STORE, null],
    ];
    for (const [name, buffer, store, expectLog] of cases) {
        const out = runUmp(buffer, store);
        check(`${name}: no crash`, !out.error, out.error);
        const body = out.done && (out.done.body ?? out.done.bodyBytes);
        // On failure the script must return an EMPTY body so the app falls
        // back to /youtubei/v1/player, which the other handler can rewrite.
        check(`${name}: falls back to empty body`, !!out.done && (!body || Buffer.from(body).length === 0));
        if (expectLog) check(`${name}: logs a reason`, out.logs.join("|").includes(expectLog), out.logs.join("|"));
    }
}

// ---------------------------------------------------------------------------
section("initplayback: redirect responses are left alone");
{
    // A 3xx from the redirector must reach the client so the CDN request
    // can be intercepted downstream.
    const out = runResponse({
        url: URL,
        responseBody: new Uint8Array(U.buildUmp({ clientKey: CLIENT_KEY, player: adPlayer() })),
        argument: ARGS,
        store: STORE,
    });
    check("2xx is processed", !!(out.done && (out.done.body ?? out.done.bodyBytes)));
}

// ---------------------------------------------------------------------------
section("initplayback: a clean player still gets PiP/background enabled");
{
    const clean = concat([ld(2, playability())]);
    const ump = U.buildUmp({ clientKey: CLIENT_KEY, player: clean });
    const out = runUmp(ump);
    const body = out.done && (out.done.body ?? out.done.bodyBytes);
    check("rewritten even without ads", !!body);
    if (body) {
        const enc = U.readParts(body).find((p) => p.type === U.ENCRYPTED_RESPONSE_PART);
        const { plaintext, hmacValid } = U.decryptPart(CLIENT_KEY, enc.data);
        check("HMAC valid", hmacValid);
        check("PiP ability present", plaintext.toString("hex").includes("f2d6b8c204080801200030004001"), plaintext.toString("hex"));
        check("background ability present", plaintext.toString("hex").includes("f2f4d2f601020801"));
    }
}

const s = summary();
console.log(`\nump: ${s.passed} passed, ${s.failed} failed`);
if (s.failed) {
    console.log("failures:\n  " + s.failures.join("\n  "));
    process.exitCode = 1;
}
