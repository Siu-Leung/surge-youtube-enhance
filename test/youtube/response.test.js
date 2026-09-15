// Tests for scripts/youtube/response.js -- the InnerTube (protobuf) rewrite path.
const { runResponse, check, section, summary, P } = require("./run.js");
const { ld, vi, concat, enc, playability, feedItem, browseFeed, feed, MARK, adPlayer } = P;

const BASE = "https://youtubei.googleapis.com/youtubei/v1/";
const ARGS = JSON.stringify({ blockUpload: true, blockShorts: false, blockGames: true, blockVerticalLive: false });
const has = (body, needle) => !!body && Buffer.from(body).includes(Buffer.from(needle));

// ---------------------------------------------------------------------------
section("/player: ad fields are stripped");
{
    const original = adPlayer();
    const out = runResponse({ url: BASE + "player?key=AIza", responseBody: original, argument: ARGS });
    check("no script error", !out.error, out.error);
    const body = out.done && (out.done.body ?? out.done.bodyBytes);
    check("body rewritten", !!body);
    if (body) {
        check("adPlacements removed", !has(body, "ADPLACEMENT_1") && !has(body, "ADPLACEMENT_2"));
        check("adSlots removed", !has(body, "ADSLOT_1"));
        check("paidPromotion removed", !has(body, "PAID_PROMOTION"));
        check("pagead viewthrough tracking removed", !has(body, "viewthroughconversion"));
        check("sponsored overlay removed", !has(body, "sponsored!"));
        check("legitimate overlay kept", has(body, "real video"));
    }
}

// ---------------------------------------------------------------------------
section("/player: PiP and background playback are forced on");
{
    const original = concat([ld(2, playability())]);
    const out = runResponse({ url: BASE + "player?key=AIza", responseBody: original, argument: ARGS });
    const body = out.done && (out.done.body ?? out.done.bodyBytes);
    check("body rewritten", !!body && Buffer.from(body).length > Buffer.from(original).length);
    if (body) {
        const hex = Buffer.from(body).toString("hex");
        // PictureInPictureAbility {active: true, f4: 0, f6: 0, f8: 1}
        check("PiP forced on", hex.includes("f2d6b8c204080801200030004001"), hex);
        check("background playback forced on", hex.includes("f2f4d2f601020801"), hex);
    }
}

// ---------------------------------------------------------------------------
section("feed (/browse, /next, /search): known ad layouts are dropped");
{
    const known = [
        "inline_injection_entrypoint_layout.eml",
        "video_display_button_group_layout.eml-fe",
        "full_width_portrait_image_layout.eml-fe",
        "full_width_square_image_layout.eml-fe",
        "video_display_full_buttoned_layout.eml-fe",
        "shopping_description_shelf.eml-fe",
    ];
    for (const eml of known) {
        for (const route of ["browse", "next", "search"]) {
            const body0 = feed(route, [
                feedItem([MARK(0)], eml + "|1"),
                feedItem([MARK(1)], "video_with_context_layout.eml|1"),
            ]);
            const out = runResponse({ url: BASE + route + "?key=AIza", responseBody: body0, argument: ARGS });
            const body = out.done && (out.done.body ?? out.done.bodyBytes);
            check(`${route}: ${eml} dropped`, body && !has(body, "MARK_0"));
            check(`${route}: normal video kept`, body && has(body, "MARK_1"));
        }
    }
}

// ---------------------------------------------------------------------------
section("feed: content markers are dropped");
{
    const cases = [
        ["sponsoredVideo", [ld(454362329, enc("x"))]],
        ["sponsoredDisplay", [ld(491441836, enc("x"))]],
        ["/pagead/ in a short field", [ld(400157044, enc("https://a/pagead/"))]],
        ["/pagead/ in a long field", [ld(123456789, enc("https://x/pagead/" + "A".repeat(1500)))]],
        ["paid-promotion overlay 455507059", [ld(455507059, enc("y"))]],
    ];
    for (const [name, extra] of cases) {
        const body0 = browseFeed([feedItem([...extra, MARK(0)]), feedItem([MARK(1)])]);
        const out = runResponse({ url: BASE + "browse?key=AIza", responseBody: body0, argument: ARGS });
        const body = out.done && (out.done.body ?? out.done.bodyBytes);
        check(`${name}: ad dropped`, body && !has(body, "MARK_0"));
        check(`${name}: normal kept`, body && has(body, "MARK_1"));
    }
}

// ---------------------------------------------------------------------------
section("feed: ordering is preserved and clean feeds are untouched");
{
    const items = [
        feedItem([MARK(0)]),
        feedItem([MARK(1)]),
        feedItem([MARK(2)], "inline_injection_entrypoint_layout.eml|1"),
        feedItem([MARK(3)]),
        feedItem([MARK(4)]),
    ];
    const body0 = browseFeed(items);
    const out = runResponse({ url: BASE + "browse?key=AIza", responseBody: body0, argument: ARGS });
    const body = out.done && (out.done.body ?? out.done.bodyBytes);
    check("only the ad was removed", body && !has(body, "MARK_2") && has(body, "MARK_0") && has(body, "MARK_4"));
    if (body) {
        const b = Buffer.from(body);
        const order = [0, 1, 3, 4].map((i) => b.indexOf(Buffer.from("MARK_" + i)));
        check("surviving items keep their order", order.every((p, i) => i === 0 || (p > order[i - 1] && p > 0)), JSON.stringify(order));
    }

    const clean = browseFeed([feedItem([MARK(0)]), feedItem([MARK(1)])]);
    const out2 = runResponse({ url: BASE + "browse?key=AIza", responseBody: clean, argument: ARGS });
    check("clean feed is not rewritten", !(out2.done && (out2.done.body ?? out2.done.bodyBytes)));
}

// ---------------------------------------------------------------------------
section("navigation/resolve_url: embedded player is cleaned");
{
    // ResolveUrl{2: endpoint} -> NavigationEndpoint{48687757: watch} ->
    //   NavigationWatch{68146959: embedded} -> EmbeddedPlayer{68202535: response} ->
    //     EmbeddedPlayerBody{1: player}
    const player = concat([ld(7, "ADPLACEMENT_1"), ld(68, "ADSLOT_1"), ld(2, playability())]);
    const body0 = ld(2, ld(48687757, ld(68146959, ld(68202535, ld(1, player)))));
    const out = runResponse({ url: BASE + "navigation/resolve_url?key=AIza", responseBody: body0, argument: ARGS });
    const body = out.done && (out.done.body ?? out.done.bodyBytes);
    check("embedded adPlacements stripped", body && !has(body, "ADPLACEMENT_1"));
    check("embedded adSlots stripped", body && !has(body, "ADSLOT_1"));
}

// ---------------------------------------------------------------------------
section("get_watch: both player and next are handled");
{
    const player = concat([ld(7, "ADPLACEMENT_WATCH"), ld(2, playability())]);
    const next = feed("next", [feedItem([MARK(0)], "inline_injection_entrypoint_layout.eml|1"), feedItem([MARK(1)])]);
    // WatchContent{2: player, 3: next}
    const watchContent = concat([ld(2, player), ld(3, next)]);
    const body0 = ld(1, watchContent);
    const out = runResponse({ url: BASE + "get_watch?key=AIza", responseBody: body0, argument: ARGS });
    const body = out.done && (out.done.body ?? out.done.bodyBytes);
    check("watch player ad stripped", body && !has(body, "ADPLACEMENT_WATCH"));
    check("watch next ad stripped", body && !has(body, "MARK_0"));
    check("watch normal kept", body && has(body, "MARK_1"));
}

// ---------------------------------------------------------------------------
section("config: onesie keys are captured (and only when they change)");
{
    const clientKey = new Uint8Array(32).map((_, i) => i + 1);
    const encryptKey = new Uint8Array(32).map((_, i) => 200 - i);
    const onesie = concat([ld(1, clientKey), ld(2, encryptKey)]);
    const body0 = ld(1, ld(16, ld(7, ld(138536474, ld(146311580, onesie)))));
    const out = runResponse({ url: BASE + "config?key=AIza", responseBody: body0, argument: ARGS });
    check("no script error", !out.error, out.error);
    const cfg = out.persistent.YouTubeConfig ? JSON.parse(out.persistent.YouTubeConfig) : {};
    check("clientKey stored", !!cfg.youtube?.clientKey);
    check("encryptKey stored", !!cfg.youtube?.encryptKey);
    check("keys are base64", /^[A-Za-z0-9+/=]+$/.test(cfg.youtube?.clientKey ?? ""));

    // replaying the same config must not rewrite the response
    const out2 = runResponse({ url: BASE + "config?key=AIza", responseBody: body0, argument: ARGS, store: out.persistent });
    check("unchanged config is passed through", !(out2.done && (out2.done.body ?? out2.done.bodyBytes)));
}

// ---------------------------------------------------------------------------
section("guide: sidebar entries are filtered per arguments");
{
    const entry = (browseId) => concat([ld(318370163, ld(1, browseId)), ld(117501096, ld(1, browseId))]);
    // rendererItems is REPEATED: one field-1 entry per item, not one blob.
    const rendererItems = concat([entry("FEwhat_to_watch"), entry("FEuploads")].map((i) => ld(1, i)));
    const guideSection = ld(117866661, rendererItems);
    const body0 = concat([ld(4, guideSection), ld(6, guideSection)]);
    const on = runResponse({ url: BASE + "guide?key=AIza", responseBody: body0, argument: JSON.stringify({ blockUpload: true }) });
    const onBody = on.done && (on.done.body ?? on.done.bodyBytes);
    check("FEuploads hidden when blockUpload", onBody && !has(onBody, "FEuploads"));
    check("FEwhat_to_watch kept", onBody && has(onBody, "FEwhat_to_watch"));

    const off = runResponse({ url: BASE + "guide?key=AIza", responseBody: body0, argument: JSON.stringify({ blockUpload: false }) });
    const offBody = off.done && (off.done.body ?? off.done.bodyBytes);
    check("FEuploads kept when blockUpload=false", !offBody || has(offBody, "FEuploads"));
}

// ---------------------------------------------------------------------------
section("shorts: ad entries are dropped");
{
    // Shorts{2: entries[]}; each entry is its own field-2 occurrence.
    // AdClientParams{1: isAd} is a *bool* (wire 0), so it is NOT length-delimited.
    const entry = (isAd) => ld(1, ld(139608561, ld(16, vi(1, isAd))));
    const body0 = concat([ld(2, entry(1)), ld(2, entry(0))]);
    const out = runResponse({ url: BASE + "reel/reel_watch_sequence?key=AIza", responseBody: body0, argument: ARGS });
    const body = out.done && (out.done.body ?? out.done.bodyBytes);
    check("ad entry dropped", !!body && Buffer.from(body).length < Buffer.from(body0).length);
    check("real entry kept", !!body && Buffer.from(body).length > 0);
}

// ---------------------------------------------------------------------------
section("unrouted and malformed input never throws");
{
    const cases = [
        ["unknown endpoint", BASE + "unknown_endpoint?key=AIza", adPlayer()],
        ["empty body", BASE + "player?key=AIza", new Uint8Array()],
        ["single byte", BASE + "player?key=AIza", new Uint8Array([0xff])],
        ["truncated varint", BASE + "browse?key=AIza", new Uint8Array([0x08])],
        ["nonsense bytes", BASE + "browse?key=AIza", new Uint8Array([0xff, 0xff, 0xff, 0xff])],
    ];
    for (const [name, url, responseBody] of cases) {
        const out = runResponse({ url, responseBody, argument: ARGS });
        check(`${name}: handled without crashing`, out.error === undefined || out.error === null, out.error);
    }
}

const s = summary();
console.log(`\nresponse.js: ${s.passed} passed, ${s.failed} failed`);
if (s.failed) {
    console.log("failures:\n  " + s.failures.join("\n  "));
    process.exitCode = 1;
}
