// Minimal protobuf builders used by the tests.
const enc = (s) => new TextEncoder().encode(s);

function v(n) {
    const out = [];
    do {
        out.push((n % 128) | (n > 127 ? 128 : 0));
        n = Math.floor(n / 128);
    } while (n);
    return Uint8Array.from(out);
}
function tag(no, wire) {
    return v(no * 8 + wire);
}
function concat(chunks) {
    const total = chunks.reduce((a, b) => a + b.length, 0);
    const out = new Uint8Array(total);
    let o = 0;
    for (const c of chunks) {
        out.set(c, o);
        o += c.length;
    }
    return out;
}
// length-delimited; strings are encoded for you
function ld(no, bytes) {
    return concat([tag(no, 2), v(bytes.length), typeof bytes === "string" ? enc(bytes) : bytes]);
}
// varint
function vi(no, n) {
    return concat([tag(no, 0), v(n)]);
}

// --- Shared fixtures -------------------------------------------------------

// PlayabilityStatus fields 21 (PiP) and 11 (background), both disabled.
const playability = () =>
    concat([ld(21, ld(151635310, vi(1, 0))), ld(11, ld(64657230, vi(1, 0)))]);

// A feed item: videoWithContextRenderer -> ElementRenderer ->
//   VideoRendererContent{1: videoInfo, 2: renderInfo}
// videoInfo -> videoContext -> videoContent{...markers}
// renderInfo -> layoutRender{1: eml}
function feedItem(extra = [], eml = "video_with_context_layout.eml|1") {
    const videoContent = concat(extra);
    const videoInfo = ld(168777401, ld(5, videoContent));
    const renderInfo = ld(183314536, ld(1, eml));
    const vrc = concat([ld(1, videoInfo), ld(2, renderInfo)]);
    return ld(153515154, ld(172660663, vrc));
}

// ItemSectionRenderer{1: richItemContents[]} containing the given items.
function itemSection(items) {
    return ld(50195462, concat(items.map((i) => ld(1, i))));
}

// Wrap a feed so that each route's schema can reach it.
//   browse -> Browse{9: content}
//   next   -> Next{7: content} -> nextResult{1: content}
//   search -> Search{4: content}
function feed(route, items) {
    const section = ld(49399797, concat([ld(1, itemSection(items))])); // sectionListRenderer
    if (route === "next") {
        return ld(7, ld(51779735, ld(1, section))); // nextResult{1: content}
    }
    if (route === "search") return ld(4, section);
    return ld(9, section); // Browse{9: content}
}

// Backwards-compatible name.
function browseFeed(items) {
    return feed("browse", items);
}

// A marker we can grep for in the rewritten output.
const MARK = (label) => ld(999, enc("MARK_" + label));

// Player with adPlacements, adSlots, paidPromotion and an ad overlay.
function adPlayer() {
    const adOverlay = ld(401855120, ld(2, ld(401855122, ld(1, feedItem([ld(454362329, enc("sponsored!"))], "inline_injection_entrypoint_layout.eml|1")))));
    const okOverlay = ld(401855120, ld(2, ld(401855122, ld(1, feedItem([ld(1, enc("real video"))])))));
    return concat([
        ld(7, "ADPLACEMENT_1"),
        ld(7, "ADPLACEMENT_2"),
        ld(68, "ADSLOT_1"),
        ld(61, "PAID_PROMOTION"),
        ld(9, ld(18, "https://googleads.g.doubleclick.net/pagead/viewthroughconversion/1")),
        ld(2, playability()),
        ld(60, adOverlay),
        ld(60, okOverlay),
    ]);
}

module.exports = { v, tag, concat, ld, vi, enc, playability, feedItem, browseFeed, feed, itemSection, MARK, adPlayer };
