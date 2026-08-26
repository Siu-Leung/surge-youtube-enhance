// Standalone Surge runtime.
(() => {
  // Surge environment
  var SurgeEnvironment = class {
    constructor() {
      this.request = adaptTransaction($request), this.response = typeof $response > "u" ? void 0 : adaptTransaction($response);
    }
    parameters(defaults) {
      return typeof $argument != "string" || $argument.includes("{{{") ? defaults : Object.assign(defaults, JSON.parse($argument));
    }
    getJSON(key2, fallback = {}) {
      let value = $persistentStore.read(key2);
      return value ? JSON.parse(value) : fallback;
    }
    setJSON(value, key2) {
      $persistentStore.write(JSON.stringify(value), key2);
    }
    notify(title, subtitle, body) {
      $notification.post(title, subtitle, body);
    }
    done(result = {}) {
      result.bodyBytes && (result.body = result.bodyBytes, delete result.bodyBytes), $done(result);
    }
    exit() {
      $done({});
    }
  };
  function adaptTransaction(transaction) {
    return new Proxy(transaction, {
      get(target, property) {
        return target[property === "bodyBytes" ? "body" : property];
      }
    });
  }
  function platformKey(request) {
    return (request.headers["user-agent"] ?? request.headers["User-Agent"]).includes("music") ? "youtubeMusic" : "youtube";
  }

  // Persistent state
  var CONFIG_KEY = "YouTubeConfig";
  function loadConfig(environment2) {
    return environment2.getJSON(CONFIG_KEY) ?? {};
  }
  function saveConfig(environment2, config) {
    environment2.setJSON(config, CONFIG_KEY);
  }
  function currentKeys(environment2, key2) {
    return loadConfig(environment2)?.[key2] ?? {};
  }
  function clearCurrentKeys(environment2, key2) {
    let config = loadConfig(environment2);
    config?.[key2] && (delete config[key2], saveConfig(environment2, config));
  }

  // Protobuf helpers
  function readVarint(bytes, cursor) {
    let value = 0, shift = 0;
    for (; shift < 35; ) {
      let byte = bytes[cursor.offset++];
      if (value |= (byte & 127) << shift, !(byte & 128)) return value >>> 0;
      shift += 7;
    }
    throw new Error("invalid varint");
  }
  function findBytesField(bytes, fieldNumber) {
    let cursor = { offset: 0 };
    for (; cursor.offset < bytes.length; ) {
      let tag = readVarint(bytes, cursor), wireType = tag & 7, number = tag >>> 3;
      if (wireType === 0) readVarint(bytes, cursor);
      else if (wireType === 1) cursor.offset += 8;
      else if (wireType === 2) {
        let length = readVarint(bytes, cursor), value = bytes.subarray(cursor.offset, cursor.offset + length);
        if (cursor.offset += length, number === fieldNumber) return value;
      } else if (wireType === 5) cursor.offset += 4;
      else throw new Error(`unsupported wire type ${wireType}`);
    }
  }
  function decodeBase64(value) {
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", output = [], buffer = 0, bits = 0;
    for (let character of value.replace(
      /[-_]/g,
      (item) => item === "-" ? "+" : "/"
    )) {
      if (/\s|=/.test(character)) continue;
      let index = alphabet.indexOf(character);
      if (index < 0) throw new Error("invalid base64 string");
      buffer = buffer << 6 | index, bits += 6, bits >= 8 && (bits -= 8, output.push(buffer >>> bits & 255));
    }
    return new Uint8Array(output);
  }

  // Auto HD
  var MAX_YOUTUBE_RESOLUTION = 4320, HIGHEST_QUALITY = /* @__PURE__ */ new Map([
    [16, MAX_YOUTUBE_RESOLUTION],
    [26, 1]
  ]);
  function encodeVarint(value) {
    let bytes = [];
    for (; value > 127; )
      bytes.push(value % 128 | 128), value = Math.floor(value / 128);
    return bytes.push(value), new Uint8Array(bytes);
  }
  function concat(chunks) {
    let output = new Uint8Array(
      chunks.reduce((length, chunk) => length + chunk.length, 0)
    ), offset = 0;
    for (let chunk of chunks)
      output.set(chunk, offset), offset += chunk.length;
    return output;
  }
  function readField(bytes, cursor) {
    let start = cursor.offset, tag = readVarint(bytes, cursor), tagEnd = cursor.offset, no = tag >>> 3, wire = tag & 7;
    if (!no) throw new Error("invalid protobuf field");
    let payloadStart = cursor.offset;
    if (wire === 0)
      for (let count = 0; count < 10; count++) {
        let byte = bytes[cursor.offset++];
        if (byte === void 0) throw new Error("truncated protobuf varint");
        if (!(byte & 128)) break;
        if (count === 9) throw new Error("invalid protobuf varint");
      }
    else if (wire === 1)
      cursor.offset += 8;
    else if (wire === 2) {
      let length = readVarint(bytes, cursor);
      payloadStart = cursor.offset, cursor.offset += length;
    } else if (wire === 5)
      cursor.offset += 4;
    else
      throw new Error(`unsupported protobuf wire type ${wire}`);
    if (cursor.offset > bytes.length) throw new Error("truncated protobuf field");
    return { start, tagEnd, no, wire, payloadStart, end: cursor.offset };
  }
  function setVarints(bytes, replacements) {
    let chunks = [], seen = /* @__PURE__ */ new Set(), cursor = { offset: 0 };
    for (; cursor.offset < bytes.length; ) {
      let field = readField(bytes, cursor);
      field.wire === 0 && replacements.has(field.no) ? (chunks.push(
        bytes.subarray(field.start, field.tagEnd),
        encodeVarint(replacements.get(field.no))
      ), seen.add(field.no)) : chunks.push(bytes.subarray(field.start, field.end));
    }
    for (let [no, value] of replacements)
      seen.has(no) || chunks.push(encodeVarint(no * 8), encodeVarint(value));
    return concat(chunks);
  }
  function forceHighestQuality(bytes) {
    let chunks = [], cursor = { offset: 0 }, found = !1;
    for (; cursor.offset < bytes.length; ) {
      let field = readField(bytes, cursor);
      if (field.no === 1 && field.wire === 2) {
        let abr = setVarints(
          bytes.subarray(field.payloadStart, field.end),
          HIGHEST_QUALITY
        );
        chunks.push(
          bytes.subarray(field.start, field.tagEnd),
          encodeVarint(abr.length),
          abr
        ), found = !0;
      } else
        chunks.push(bytes.subarray(field.start, field.end));
    }
    if (!found) {
      let abr = setVarints(new Uint8Array(), HIGHEST_QUALITY);
      chunks.push(encodeVarint(10), encodeVarint(abr.length), abr);
    }
    return concat(chunks);
  }

  // Request handler
  var environment = new SurgeEnvironment(), key = platformKey(environment.request);
  function equalBytes(left, right) {
    if (left.length !== right.length) return !1;
    for (let index = 0; index < left.length; index++)
      if (left[index] !== right[index]) return !1;
    return !0;
  }
  function sanitizeLogEventHeaders() {
    let headers = environment.request.headers, hasClientKey = !!currentKeys(environment, key).clientKey;
    for (let name of Object.keys(headers)) {
      let lowerName = name.toLowerCase();
      (lowerName === "content-encoding" || !hasClientKey && lowerName === "x-youtube-hot-hash-data") && delete headers[name];
    }
    environment.done({ headers });
  }
  function validateInitPlaybackKey() {
    let { encryptKey } = currentKeys(environment, key), body = environment.request.bodyBytes;
    if (!encryptKey || !(body instanceof Uint8Array)) {
      clearCurrentKeys(environment, key), environment.exit();
      return;
    }
    let encryptedRequest = findBytesField(body, 3), encryptedClientKey = encryptedRequest && findBytesField(encryptedRequest, 5);
    if (encryptedClientKey && equalBytes(encryptedClientKey, decodeBase64(encryptKey))) {
      environment.exit();
      return;
    }
    console.log(
      "initplayback: encryptedClientKey \u4E0E\u7F13\u5B58\u4E0D\u4E00\u81F4\uFF0C\u9000\u56DE v1/player \u5E76\u6E05\u7F13\u5B58"
    ), clearCurrentKeys(environment, key), environment.done({ status: 200, bodyBytes: new Uint8Array() });
  }
  function applyAutoHd() {
    let { autoHd } = environment.parameters({ autoHd: !0 });
    if (!autoHd) return environment.exit();
    let body = environment.request.bodyBytes;
    if (!(body instanceof Uint8Array)) return environment.exit();
    try {
      environment.done({ bodyBytes: forceHighestQuality(body) });
    } catch (error) {
      console.log(`Auto HD: ${String(error)}`), environment.exit();
    }
  }
  environment.request.url.includes("/videoplayback") ? applyAutoHd() : environment.request.url.includes("log_event") ? sanitizeLogEventHeaders() : environment.request.url.includes("initplayback") ? validateInitPlaybackKey() : environment.exit();
})();
