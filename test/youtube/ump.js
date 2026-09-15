// Helpers for building and inspecting UMP (Unified Media Pipeline) streams,
// used by scripts/youtube/{request,response}.js to rewrite the encrypted
// "onesie" player response served from googlevideo.com/initplayback.
const crypto = require("crypto");
const zlib = require("zlib");

// --- UMP framing -----------------------------------------------------------
function wv(value) {
    const o = [];
    const size =
        value < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5;
    if (size === 1) o.push(value);
    else if (size === 2) o.push((value & 63) | 128, value >> 6);
    else if (size === 3) o.push((value & 31) | 192, (value >> 5) & 255, value >> 13);
    else if (size === 4) o.push((value & 15) | 224, (value >> 4) & 255, (value >> 12) & 255, value >> 20);
    else o.push(240, value & 255, (value >> 8) & 255, (value >> 16) & 255, (value >> 24) & 255);
    return Buffer.from(o);
}
function part(type, data) {
    data = Buffer.from(data);
    return Buffer.concat([wv(type), wv(data.length), data]);
}
function readParts(buf) {
    buf = Buffer.from(buf);
    const out = [];
    let o = 0;
    function rv() {
        let first = buf[o++], size = 5;
        for (let c = 1; c < 5; c++) if (!(first & (128 >> (c - 1)))) { size = c; break; }
        let bits = size === 5 ? 0 : 8 - size;
        let val = size === 5 ? 0 : first & ((1 << (8 - size)) - 1);
        for (let i = 1; i < size; i++) { val += buf[o++] * 2 ** bits; bits += 8; }
        return val;
    }
    while (o < buf.length) {
        const type = rv(), len = rv();
        out.push({ type, data: buf.subarray(o, o + len) });
        o += len;
    }
    return out;
}

// --- protobuf (mirrors ../test/youtube/proto.js but Buffer-based) -----------
function v(n) { const o = []; do { o.push((n % 128) | (n > 127 ? 128 : 0)); n = Math.floor(n / 128); } while (n); return Buffer.from(o); }
function ld(no, b) { b = Buffer.from(b); return Buffer.concat([v(no * 8 + 2), v(b.length), b]); }
function vi(no, n) { return Buffer.concat([v(no * 8), v(n)]); }

const ONESIE_HEADER_PART = 10;
const ENCRYPTED_RESPONSE_PART = 11;
const ONESIE_INNERTUBE_RESPONSE = 25;

// clientKey layout: first 16 bytes AES key, remaining 16 bytes HMAC key.
function encryptPart(clientKey, plaintext, { gzip = true, level = 6 } = {}) {
    const iv = Buffer.from("0123456789abcdef");
    const aesKey = Buffer.from(clientKey).subarray(0, 16);
    const hmacKey = Buffer.from(clientKey).subarray(16);
    const payload = gzip ? zlib.gzipSync(Buffer.from(plaintext), { level }) : Buffer.from(plaintext);
    const c = crypto.createCipheriv("aes-128-ctr", aesKey, iv);
    const encryptedContent = Buffer.concat([c.update(payload), c.final()]);
    const h = crypto.createHmac("sha256", hmacKey);
    h.update(Buffer.concat([encryptedContent, iv]));
    return Buffer.concat([
        ld(1, encryptedContent),
        ld(2, h.digest()),
        ld(3, iv),
        vi(4, gzip ? 1 : 0),
    ]);
}

function decryptPart(clientKey, bytes) {
    const aesKey = Buffer.from(clientKey).subarray(0, 16);
    const hmacKey = Buffer.from(clientKey).subarray(16);
    let o = 0, enc, hm, iv, ca = 0;
    function pv() {
        let val = 0, sc = 1, b;
        do { b = bytes[o++]; val += (b & 127) * sc; sc *= 128; } while (b & 128);
        return val;
    }
    while (o < bytes.length) {
        const tag = pv(), no = Math.floor(tag / 8), w = tag % 8;
        if (w === 2) {
            const l = pv();
            const d = bytes.subarray(o, o + l);
            o += l;
            if (no === 1) enc = d; else if (no === 2) hm = d; else if (no === 3) iv = d;
        } else if (w === 0) { let b; do { b = bytes[o++]; } while (b & 128); ca = b & 127; }
        else if (w === 5) o += 4;
        else if (w === 1) o += 8;
    }
    const d = crypto.createDecipheriv("aes-128-ctr", aesKey, Buffer.from(iv));
    const plain = Buffer.concat([d.update(Buffer.from(enc)), d.final()]);
    const h = crypto.createHmac("sha256", hmacKey);
    h.update(Buffer.concat([Buffer.from(enc), Buffer.from(iv)]));
    const hmacValid = h.digest().equals(Buffer.from(hm));
    const inner = plain[0] === 31 && plain[1] === 139 ? zlib.gunzipSync(plain) : plain;
    return { plaintext: inner, hmacValid, compressionAlgorithm: ca };
}

// WatchContent{2: player} inside OnesieInnertubeResponse{4: contents}
function onesiePlayer(player) {
    return ld(4, ld(2, player));
}

function buildUmp({ clientKey, player, gzip = true, level = 6, before = true, after = false }) {
    const parts = [];
    if (before) parts.push(part(31, Buffer.from("DECOY_BEFORE")));
    parts.push(part(ONESIE_HEADER_PART, vi(1, ONESIE_INNERTUBE_RESPONSE)));
    // OnesieInnertubeResponse{4: contents[]} -> WatchContent{2: player}
    parts.push(part(ENCRYPTED_RESPONSE_PART, encryptPart(clientKey, onesiePlayer(player), { gzip, level })));
    if (after) parts.push(part(31, Buffer.from("TRAILER_AFTER")));
    return Buffer.concat(parts);
}

const storeFor = (clientKey, platform = "youtube") => ({
    YouTubeConfig: JSON.stringify({ [platform]: { clientKey: Buffer.from(clientKey).toString("base64"), encryptKey: Buffer.from(clientKey).toString("base64") } }),
});

module.exports = { wv, part, readParts, v, ld, vi, encryptPart, decryptPart, onesiePlayer, buildUmp, storeFor, ONESIE_HEADER_PART, ENCRYPTED_RESPONSE_PART, ONESIE_INNERTUBE_RESPONSE };
