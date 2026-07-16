/**
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Based on mekos2772/ios-location-spoofer.
 * Licensed under the GNU Affero General Public License v3.0.
 *
 * Modified by Hugo Lee, 2026.
 */
(function () {
    "use strict";

    var DEFAULT_CONFIG = {
        enabled: true,
        latitude: 35.708516,
        longitude: 139.785174,
        horizontalAccuracy: 39,
    };

    var APPLE_WLOC_MARKER = bytesFromArray([
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00,
    ]);
    var SETTINGS_STORE_KEY = "ios_location_spoofer_settings";
    var CELL_RESPONSE_FIELDS = { 22: true, 24: true };
    var MAX_HORIZONTAL_ACCURACY = 100000;
    var MAX_UINT64 = 0xffffffffffffffffn;
    var MIN_INT64 = -0x8000000000000000n;
    var MAX_INT64 = 0x7fffffffffffffffn;

    function bytesFromArray(values) {
        return new Uint8Array(values);
    }

    function concatBytes(parts) {
        var total = 0;
        var i;
        for (i = 0; i < parts.length; i += 1) {
            total += parts[i].length;
        }

        var out = new Uint8Array(total);
        var offset = 0;
        for (i = 0; i < parts.length; i += 1) {
            out.set(parts[i], offset);
            offset += parts[i].length;
        }
        return out;
    }

    function bytesEqual(left, right) {
        if (!left || !right || left.length !== right.length) {
            return false;
        }
        for (var i = 0; i < left.length; i += 1) {
            if (left[i] !== right[i]) {
                return false;
            }
        }
        return true;
    }

    function findBytes(bytes, marker, start) {
        if (!bytes || !marker || marker.length === 0) {
            return -1;
        }
        start = Math.max(0, Number(start) || 0);
        for (var i = start; i <= bytes.length - marker.length; i += 1) {
            var ok = true;
            for (var j = 0; j < marker.length; j += 1) {
                if (bytes[i + j] !== marker[j]) {
                    ok = false;
                    break;
                }
            }
            if (ok) {
                return i;
            }
        }
        return -1;
    }

    function tryParseFields(bytes) {
        try {
            if (!bytes || bytes.length === 0) {
                return null;
            }
            var fields = parseFields(bytes);
            return fields.length > 0 ? fields : null;
        } catch (e) {
            return null;
        }
    }

    function readUInt16BE(bytes, offset) {
        if (offset + 2 > bytes.length) {
            throw new Error("uint16 out of range");
        }
        return (bytes[offset] << 8) | bytes[offset + 1];
    }

    function readUInt32BE(bytes, offset) {
        if (offset + 4 > bytes.length) {
            throw new Error("uint32 out of range");
        }
        return (
            (bytes[offset] * 0x1000000 +
                ((bytes[offset + 1] << 16) |
                    (bytes[offset + 2] << 8) |
                    bytes[offset + 3])) >>>
            0
        );
    }

    function writeUInt16BE(value) {
        if (value < 0 || value > 0xffff) {
            throw new Error("uint16 value out of range: " + value);
        }
        return bytesFromArray([(value >> 8) & 0xff, value & 0xff]);
    }

    function writeUInt32BE(value) {
        return bytesFromArray([
            (value >>> 24) & 0xff,
            (value >>> 16) & 0xff,
            (value >>> 8) & 0xff,
            value & 0xff,
        ]);
    }

    function encodeVarintUnsigned(value) {
        if (
            typeof value !== "bigint" &&
            (!Number.isSafeInteger(value) || value < 0)
        ) {
            throw new Error("invalid unsigned varint");
        }
        var v = typeof value === "bigint" ? value : BigInt(value);
        if (v < 0n || v > MAX_UINT64) {
            throw new Error("unsigned varint out of range");
        }

        var out = [];
        while (v >= 0x80n) {
            out.push(Number((v & 0x7fn) | 0x80n));
            v >>= 7n;
        }
        out.push(Number(v));
        return bytesFromArray(out);
    }

    function encodeVarintSignedInt64(value) {
        if (
            typeof value !== "bigint" &&
            !Number.isSafeInteger(value)
        ) {
            throw new Error("invalid signed int64");
        }
        var v = typeof value === "bigint" ? value : BigInt(value);
        if (v < MIN_INT64 || v > MAX_INT64) {
            throw new Error("signed int64 out of range");
        }
        if (v < 0n) {
            v = BigInt.asUintN(64, v);
        }
        return encodeVarintUnsigned(v);
    }

    function decodeVarint(bytes, offset) {
        if (
            !bytes ||
            !Number.isInteger(offset) ||
            offset < 0 ||
            offset >= bytes.length
        ) {
            throw new Error("varint offset out of range");
        }
        var result = 0n;
        var shift = 0n;
        var current = offset;
        var byteCount = 0;

        while (current < bytes.length) {
            var b = bytes[current];
            current += 1;
            byteCount += 1;
            if (byteCount === 10 && (b & 0xfe) !== 0) {
                throw new Error("varint exceeds uint64");
            }
            result |= BigInt(b & 0x7f) << shift;
            if ((b & 0x80) === 0) {
                return { value: result, offset: current };
            }
            if (byteCount >= 10) {
                throw new Error("varint too long");
            }
            shift += 7n;
        }

        throw new Error("unterminated varint");
    }

    function makeKey(fieldNumber, wireType) {
        if (
            !Number.isInteger(fieldNumber) ||
            fieldNumber < 1 ||
            fieldNumber > 0x1fffffff
        ) {
            throw new Error("invalid protobuf field number");
        }
        if (
            wireType !== 0 &&
            wireType !== 1 &&
            wireType !== 2 &&
            wireType !== 5
        ) {
            throw new Error("unsupported protobuf wire type: " + wireType);
        }
        return encodeVarintUnsigned(
            (BigInt(fieldNumber) << 3n) | BigInt(wireType),
        );
    }

    function makeVarintField(fieldNumber, value) {
        return concatBytes([
            makeKey(fieldNumber, 0),
            encodeVarintSignedInt64(value),
        ]);
    }

    function makeLengthDelimitedField(fieldNumber, payload) {
        return concatBytes([
            makeKey(fieldNumber, 2),
            encodeVarintUnsigned(payload.length),
            payload,
        ]);
    }

    function parseFields(bytes) {
        var fields = [];
        var offset = 0;

        while (offset < bytes.length) {
            var keyStart = offset;
            var key = decodeVarint(bytes, offset);
            offset = key.offset;

            var fieldNumber = Number(key.value >> 3n);
            var wireType = Number(key.value & 0x7n);
            if (fieldNumber < 1 || fieldNumber > 0x1fffffff) {
                throw new Error("invalid protobuf field number");
            }

            var valueStart = offset;
            var valueEnd;
            if (wireType === 0) {
                valueEnd = decodeVarint(bytes, offset).offset;
            } else if (wireType === 1) {
                valueEnd = offset + 8;
            } else if (wireType === 2) {
                var lengthInfo = decodeVarint(bytes, offset);
                valueStart = lengthInfo.offset;
                var remaining = bytes.length - valueStart;
                if (lengthInfo.value > BigInt(remaining)) {
                    throw new Error("protobuf field exceeds buffer");
                }
                var length = Number(lengthInfo.value);
                valueEnd = valueStart + length;
            } else if (wireType === 5) {
                valueEnd = offset + 4;
            } else {
                throw new Error("unsupported protobuf wire type: " + wireType);
            }

            if (valueEnd > bytes.length) {
                throw new Error("protobuf field exceeds buffer");
            }

            fields.push({
                fieldNumber: fieldNumber,
                wireType: wireType,
                raw: bytes.slice(keyStart, valueEnd),
                valueBytes: bytes.slice(valueStart, valueEnd),
            });
            offset = valueEnd;
        }

        return fields;
    }

    function firstFieldByNumber(fields, fieldNumber) {
        for (var i = 0; i < fields.length; i += 1) {
            if (fields[i].fieldNumber === fieldNumber) {
                return fields[i];
            }
        }
        return null;
    }

    function isCellResponseField(fieldNumber) {
        return CELL_RESPONSE_FIELDS[fieldNumber] === true;
    }

    function coordToInt(value) {
        return Math.round(Number(value) * 100000000);
    }

    function isNumericInput(value) {
        return (
            typeof value === "number" ||
            (typeof value === "string" && value.trim() !== "")
        );
    }

    function normalizeHorizontalAccuracy(value) {
        if (!isNumericInput(value)) {
            throw new Error("invalid horizontal accuracy");
        }
        var accuracy = Number(value);
        if (
            !Number.isFinite(accuracy) ||
            !Number.isInteger(accuracy) ||
            accuracy < 0 ||
            accuracy > MAX_HORIZONTAL_ACCURACY
        ) {
            throw new Error(
                "invalid horizontal accuracy (expected integer 0-" +
                    MAX_HORIZONTAL_ACCURACY +
                    ")",
            );
        }
        return accuracy;
    }

    function normalizeConfig(input) {
        var cfg = mergeConfig(DEFAULT_CONFIG, input);
        if (
            !isNumericInput(cfg.latitude) ||
            !isNumericInput(cfg.longitude)
        ) {
            throw new Error("invalid coordinates");
        }
        cfg.latitude = Number(cfg.latitude);
        cfg.longitude = Number(cfg.longitude);
        cfg.horizontalAccuracy = normalizeHorizontalAccuracy(
            cfg.horizontalAccuracy,
        );

        if (
            !Number.isFinite(cfg.latitude) ||
            cfg.latitude < -90 ||
            cfg.latitude > 90
        ) {
            throw new Error("invalid latitude");
        }
        if (
            !Number.isFinite(cfg.longitude) ||
            cfg.longitude < -180 ||
            cfg.longitude > 180
        ) {
            throw new Error("invalid longitude");
        }
        return cfg;
    }

    function newLocationPayload(config) {
        return concatBytes([
            makeVarintField(1, coordToInt(config.latitude)),
            makeVarintField(2, coordToInt(config.longitude)),
            makeVarintField(3, config.horizontalAccuracy),
        ]);
    }

    function patchLocation(locationPayload, config) {
        var fields = locationPayload.length ? parseFields(locationPayload) : [];
        var latitudeField = firstFieldByNumber(fields, 1);
        var longitudeField = firstFieldByNumber(fields, 2);
        if (
            !latitudeField ||
            latitudeField.wireType !== 0 ||
            !longitudeField ||
            longitudeField.wireType !== 0
        ) {
            return locationPayload;
        }

        var parts = [];
        for (var i = 0; i < fields.length; i += 1) {
            var field = fields[i];
            if (field.fieldNumber === 1 && field.wireType === 0) {
                parts.push(makeVarintField(1, coordToInt(config.latitude)));
            } else if (field.fieldNumber === 2 && field.wireType === 0) {
                parts.push(makeVarintField(2, coordToInt(config.longitude)));
            } else if (field.fieldNumber === 3 && field.wireType === 0) {
                parts.push(makeVarintField(3, config.horizontalAccuracy));
            } else {
                parts.push(field.raw);
            }
        }
        return concatBytes(parts);
    }

    function bytesToAscii(bytes) {
        var out = "";
        for (var i = 0; i < bytes.length; i += 1) {
            out += String.fromCharCode(bytes[i]);
        }
        return out;
    }

    function hasValidWifiMac(fields) {
        for (var i = 0; i < fields.length; i += 1) {
            var field = fields[i];
            if (field.fieldNumber === 1 && field.wireType === 2) {
                if (
                    /^[0-9a-f]{2}(?::[0-9a-f]{2}){5}$/i.test(
                        bytesToAscii(field.valueBytes),
                    )
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    function hasCellIdentity(fields) {
        for (var i = 0; i < fields.length; i += 1) {
            if (
                fields[i].wireType === 0 &&
                fields[i].fieldNumber >= 1 &&
                fields[i].fieldNumber <= 4
            ) {
                return true;
            }
        }
        return false;
    }

    function patchWifiDeviceResult(wifiPayload, config) {
        var fields = parseFields(wifiPayload);
        if (!hasValidWifiMac(fields)) {
            return { payload: wifiPayload, patched: false };
        }

        var parts = [];
        var locationFieldFound = false;
        var patchedLocation = false;

        for (var i = 0; i < fields.length; i += 1) {
            var field = fields[i];
            if (field.fieldNumber === 2 && field.wireType === 2) {
                locationFieldFound = true;
                var patched = patchLocation(field.valueBytes, config);
                if (!bytesEqual(patched, field.valueBytes)) {
                    parts.push(makeLengthDelimitedField(2, patched));
                    patchedLocation = true;
                } else {
                    parts.push(field.raw);
                }
            } else {
                parts.push(field.raw);
            }
        }

        if (!locationFieldFound) {
            parts.push(
                makeLengthDelimitedField(2, newLocationPayload(config)),
            );
            patchedLocation = true;
        }

        return {
            payload: concatBytes(parts),
            patched: patchedLocation,
        };
    }

    function patchCellTowerResult(cellPayload, config) {
        var fields = parseFields(cellPayload);
        if (!hasCellIdentity(fields)) {
            return { payload: cellPayload, patched: false };
        }
        var parts = [];
        var locationFieldFound = false;
        var patchedLocation = false;

        for (var i = 0; i < fields.length; i += 1) {
            var field = fields[i];
            if (field.fieldNumber === 5 && field.wireType === 2) {
                locationFieldFound = true;
                var patched = patchLocation(field.valueBytes, config);
                if (!bytesEqual(patched, field.valueBytes)) {
                    parts.push(makeLengthDelimitedField(5, patched));
                    patchedLocation = true;
                } else {
                    parts.push(field.raw);
                }
            } else {
                parts.push(field.raw);
            }
        }

        if (!locationFieldFound) {
            parts.push(
                makeLengthDelimitedField(5, newLocationPayload(config)),
            );
            patchedLocation = true;
        }

        return {
            payload: concatBytes(parts),
            patched: patchedLocation,
        };
    }

    function patchAppleWLocPayload(payload, config) {
        var fields = parseFields(payload);
        var parts = [];
        var wifiCount = 0;
        var cellCount = 0;

        for (var i = 0; i < fields.length; i += 1) {
            var field = fields[i];
            if (field.fieldNumber === 2 && field.wireType === 2) {
                var wifiResult = patchWifiDeviceResult(
                    field.valueBytes,
                    config,
                );
                if (wifiResult.patched) {
                    parts.push(
                        makeLengthDelimitedField(2, wifiResult.payload),
                    );
                    wifiCount += 1;
                } else {
                    parts.push(field.raw);
                }
            } else if (
                isCellResponseField(field.fieldNumber) &&
                field.wireType === 2
            ) {
                var cellResult = patchCellTowerResult(
                    field.valueBytes,
                    config,
                );
                if (cellResult.patched) {
                    parts.push(
                        makeLengthDelimitedField(
                            field.fieldNumber,
                            cellResult.payload,
                        ),
                    );
                    cellCount += 1;
                } else {
                    parts.push(field.raw);
                }
            } else {
                parts.push(field.raw);
            }
        }

        return {
            payload: concatBytes(parts),
            wifiCount: wifiCount,
            cellCount: cellCount,
        };
    }

    function skipPascalString(bytes, state) {
        var length = readUInt16BE(bytes, state.offset);
        state.offset += 2;
        if (state.offset + length > bytes.length) {
            throw new Error("ARPC pascal string exceeds buffer");
        }
        state.offset += length;
    }

    function parseArpc(bytes) {
        readUInt16BE(bytes, 0);
        var state = { offset: 2 };
        skipPascalString(bytes, state);
        skipPascalString(bytes, state);
        skipPascalString(bytes, state);
        readUInt32BE(bytes, state.offset);
        state.offset += 4;
        var payloadLengthOffset = state.offset;
        var payloadLength = readUInt32BE(bytes, state.offset);
        state.offset += 4;

        if (state.offset + payloadLength > bytes.length) {
            throw new Error("ARPC payload exceeds buffer");
        }

        var payloadEnd = state.offset + payloadLength;

        return {
            header: bytes.slice(0, payloadLengthOffset),
            payload: bytes.slice(state.offset, payloadEnd),
            suffix: bytes.slice(payloadEnd),
        };
    }

    function serializeArpc(arpc) {
        if (!arpc.header) {
            throw new Error("missing ARPC header");
        }
        return concatBytes([
            arpc.header,
            writeUInt32BE(arpc.payload.length),
            arpc.payload,
            arpc.suffix || bytesFromArray([]),
        ]);
    }

    function extractLengthPrefixedAt(responseBytes, offset) {
        if (
            offset < 0 ||
            offset + 10 > responseBytes.length
        ) {
            return null;
        }
        var payloadLength = readUInt16BE(responseBytes, offset + 8);
        var payloadOffset = offset + 10;
        if (
            payloadLength <= 0 ||
            payloadOffset + payloadLength > responseBytes.length
        ) {
            return null;
        }
        var payload = responseBytes.slice(
            payloadOffset,
            payloadOffset + payloadLength,
        );
        if (!looksLikeAppleWLocPayload(payload)) {
            return null;
        }
        return {
            kind: "length-offset",
            payload: payload,
            header: responseBytes.slice(0, offset + 8),
            suffix: responseBytes.slice(payloadOffset + payloadLength),
        };
    }

    function scanLengthPrefixedAppleWLocPayload(responseBytes) {
        var preferredOffsets = [0, 2, 4, 6, 8, 10, 12, 14, 16];
        var visited = {};
        var i;
        for (i = 0; i < preferredOffsets.length; i += 1) {
            visited[preferredOffsets[i]] = true;
            var preferred = extractLengthPrefixedAt(
                responseBytes,
                preferredOffsets[i],
            );
            if (preferred) {
                return preferred;
            }
        }

        var maxOffset = Math.min(96, responseBytes.length - 10);
        for (i = 1; i <= maxOffset; i += 1) {
            if (visited[i]) {
                continue;
            }
            var extraction = extractLengthPrefixedAt(responseBytes, i);
            if (extraction) {
                return extraction;
            }
        }
        return null;
    }

    function scanRawAppleWLocPayload(responseBytes) {
        var maxOffset = Math.min(256, responseBytes.length - 1);
        for (var offset = 0; offset <= maxOffset; offset += 1) {
            var payload = responseBytes.slice(offset);
            if (looksLikeAppleWLocPayload(payload)) {
                return {
                    kind: "raw-offset",
                    payload: payload,
                    prefix: responseBytes.slice(0, offset),
                };
            }
        }
        return null;
    }

    function extractAppleWLocPayload(responseBytes) {
        if (!responseBytes || responseBytes.length < 2) {
            throw new Error("Apple WLoc response too short");
        }

        try {
            var arpc = parseArpc(responseBytes);
            if (
                arpc.payload.length > 0 &&
                looksLikeAppleWLocPayload(arpc.payload)
            ) {
                return {
                    kind: "arpc",
                    payload: arpc.payload,
                    arpc: arpc,
                };
            }
        } catch (e) {}

        var markerSearchOffset = 0;
        var markerIdx;
        while (
            (markerIdx = findBytes(
                responseBytes,
                APPLE_WLOC_MARKER,
                markerSearchOffset,
            )) >= 0
        ) {
            var lenOffset = markerIdx + APPLE_WLOC_MARKER.length;
            if (lenOffset + 2 <= responseBytes.length) {
                var realLen = readUInt16BE(responseBytes, lenOffset);
                var realPayloadOffset = lenOffset + 2;
                if (
                    realLen > 0 &&
                    realPayloadOffset + realLen <= responseBytes.length
                ) {
                    var candidatePayload = responseBytes.slice(
                        realPayloadOffset,
                        realPayloadOffset + realLen,
                    );
                    if (looksLikeAppleWLocPayload(candidatePayload)) {
                        return {
                            kind: "marker",
                            payload: candidatePayload,
                            prefix: responseBytes.slice(0, markerIdx),
                            markerAndLen: responseBytes.slice(
                                markerIdx,
                                realPayloadOffset,
                            ),
                            suffix: responseBytes.slice(
                                realPayloadOffset + realLen,
                            ),
                        };
                    }
                }
            }
            markerSearchOffset = markerIdx + 1;
        }

        var lengthPrefixed =
            scanLengthPrefixedAppleWLocPayload(responseBytes);
        if (lengthPrefixed) {
            return lengthPrefixed;
        }

        var raw = scanRawAppleWLocPayload(responseBytes);
        if (raw) {
            return raw;
        }

        throw new Error("missing Apple WLoc response prefix");
    }

    function looksLikeAppleWLocPayload(bytes) {
        var fields = tryParseFields(bytes);
        if (!fields) {
            return false;
        }
        for (var i = 0; i < fields.length; i += 1) {
            var field = fields[i];
            if (field.wireType !== 2) {
                continue;
            }
            if (field.fieldNumber === 2) {
                var wifiFields = tryParseFields(field.valueBytes);
                if (wifiFields && hasValidWifiMac(wifiFields)) {
                    return true;
                }
            }
            if (isCellResponseField(field.fieldNumber)) {
                var cellFields = tryParseFields(field.valueBytes);
                if (cellFields && hasCellIdentity(cellFields)) {
                    return true;
                }
            }
        }
        return false;
    }

    function spoofAppleResponse(responseBytes, configInput) {
        var config = normalizeConfig(configInput);
        var extraction = extractAppleWLocPayload(responseBytes);
        var patched = patchAppleWLocPayload(extraction.payload, config);
        var response;

        if (patched.wifiCount === 0 && patched.cellCount === 0) {
            return {
                response: responseBytes,
                payload: extraction.payload,
                wifiCount: 0,
                cellCount: 0,
                kind: extraction.kind,
                unchanged: true,
            };
        }

        if (extraction.kind === "arpc") {
            var arpcOut = {
                header: extraction.arpc.header,
                payload: patched.payload,
                suffix: extraction.arpc.suffix,
            };
            response = serializeArpc(arpcOut);
        } else if (extraction.kind === "marker") {
            var newLenBytes = writeUInt16BE(patched.payload.length);
            response = concatBytes([
                extraction.prefix,
                extraction.markerAndLen.slice(0, APPLE_WLOC_MARKER.length),
                newLenBytes,
                patched.payload,
                extraction.suffix,
            ]);
        } else if (extraction.kind === "length-offset") {
            response = concatBytes([
                extraction.header,
                writeUInt16BE(patched.payload.length),
                patched.payload,
                extraction.suffix,
            ]);
        } else if (extraction.kind === "raw-offset") {
            response = concatBytes([
                extraction.prefix,
                patched.payload,
            ]);
        } else {
            throw new Error("unsupported Apple WLoc envelope: " + extraction.kind);
        }

        return {
            response: response,
            payload: patched.payload,
            wifiCount: patched.wifiCount,
            cellCount: patched.cellCount,
            kind: extraction.kind,
            unchanged: false,
        };
    }

    function parseArgumentString(argument) {
        var result = {};
        if (!argument || typeof argument !== "string") {
            return result;
        }

        var pairs = argument.split("&");
        for (var j = 0; j < pairs.length; j += 1) {
            var part = pairs[j];
            if (!part) {
                continue;
            }
            var eq = part.indexOf("=");
            var key = eq >= 0 ? part.slice(0, eq) : part;
            var value = eq >= 0 ? part.slice(eq + 1) : "true";
            try {
                result[decodeURIComponent(key)] = decodeURIComponent(value);
            } catch (err2) {
                result[key] = value;
            }
        }
        return result;
    }

    function readScriptArguments() {
        if (typeof $argument === "undefined" || $argument == null) {
            return {};
        }
        return parseArgumentString(String($argument));
    }

    function readPersistentSettings() {
        if (typeof $persistentStore === "undefined" || !$persistentStore.read) {
            return null;
        }
        try {
            var raw = $persistentStore.read(SETTINGS_STORE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (err) {
            return null;
        }
    }

    function isDisabledCoordinateValue(value) {
        return typeof value === "string" && value.trim() === "-";
    }

    function isValidStoredCoordinate(latitude, longitude) {
        if (!isNumericInput(latitude) || !isNumericInput(longitude)) {
            return false;
        }
        latitude = Number(latitude);
        longitude = Number(longitude);
        return (
            Number.isFinite(latitude) &&
            latitude >= -90 &&
            latitude <= 90 &&
            Number.isFinite(longitude) &&
            longitude >= -180 &&
            longitude <= 180
        );
    }

    function isValidStoredAccuracy(value) {
        try {
            normalizeHorizontalAccuracy(value);
            return true;
        } catch (err) {
            return false;
        }
    }

    function isGzipBytes(bytes) {
        return (
            bytes && bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b
        );
    }

    function mergeConfig(base, extra) {
        var out = {};
        var key;
        for (key in base) {
            if (Object.prototype.hasOwnProperty.call(base, key)) {
                out[key] = base[key];
            }
        }
        extra = extra || {};
        for (key in extra) {
            if (Object.prototype.hasOwnProperty.call(extra, key)) {
                out[key] = extra[key];
            }
        }
        return out;
    }

    function configFromArgs(args) {
        var cfg = {};
        var scalarKeys = ["latitude", "longitude"];

        for (var i = 0; i < scalarKeys.length; i += 1) {
            var key = scalarKeys[i];
            if (Object.prototype.hasOwnProperty.call(args, key)) {
                cfg[key] = args[key];
            }
        }
        if (Object.prototype.hasOwnProperty.call(args, "accuracy")) {
            cfg.horizontalAccuracy = args.accuracy;
        }
        return cfg;
    }

    function resolveRuntimeConfig(args, storedSettings) {
        args = args || {};
        var cfg = mergeConfig(DEFAULT_CONFIG, configFromArgs(args));

        if (storedSettings && storedSettings.enabled === false) {
            cfg.enabled = false;
            return cfg;
        }
        if (
            storedSettings &&
            isValidStoredCoordinate(
                storedSettings.latitude,
                storedSettings.longitude,
            )
        ) {
            cfg.enabled = true;
            cfg.latitude = storedSettings.latitude;
            cfg.longitude = storedSettings.longitude;
            if (
                storedSettings.accuracy != null &&
                isValidStoredAccuracy(storedSettings.accuracy)
            ) {
                cfg.horizontalAccuracy = storedSettings.accuracy;
            }
            return cfg;
        }
        if (
            isDisabledCoordinateValue(args.latitude) ||
            isDisabledCoordinateValue(args.longitude)
        ) {
            cfg.enabled = false;
        }
        return cfg;
    }

    function loadRuntimeConfig() {
        var args = readScriptArguments();
        var cfg = resolveRuntimeConfig(args, readPersistentSettings());
        return cfg.enabled ? normalizeConfig(cfg) : cfg;
    }

    function headersAfterRewrite(sourceHeaders) {
        var headers = {};
        var key;
        sourceHeaders = sourceHeaders || {};
        for (key in sourceHeaders) {
            if (Object.prototype.hasOwnProperty.call(sourceHeaders, key)) {
                var lower = key.toLowerCase();
                if (
                    lower !== "content-length" &&
                    lower !== "content-encoding" &&
                    lower !== "transfer-encoding"
                ) {
                    headers[key] = sourceHeaders[key];
                }
            }
        }
        return headers;
    }

    function decompressBody(body, contentEncoding) {
        if (body == null) {
            return body;
        }
        var enc = contentEncoding
            ? String(contentEncoding).trim().toLowerCase()
            : "";
        if (enc === "identity" || enc === "") {
            return body;
        }
        try {
            if (
                (enc === "gzip" || enc === "x-gzip") &&
                typeof $utils !== "undefined" &&
                $utils.ungzip
            ) {
                return $utils.ungzip(body);
            }
        } catch (err) {}
        return null;
    }

    function prepareResponseBody() {
        var respHeaders = ($response && $response.headers) || {};
        var contentEncoding = headerValue(respHeaders, "Content-Encoding");
        var bytes =
            $response.body instanceof Uint8Array ? $response.body : null;
        if (!bytes || bytes.length < 2) {
            return null;
        }

        var encoding = isGzipBytes(bytes) ? "gzip" : contentEncoding;
        if (encoding) {
            var decompressed = decompressBody(bytes, encoding);
            var decoded =
                decompressed instanceof Uint8Array ? decompressed : null;
            if (
                decoded &&
                decoded.length > 2 &&
                !isGzipBytes(decoded)
            ) {
                return decoded;
            }
            return null;
        }
        return bytes;
    }

    function headerValue(headers, name) {
        if (!headers) {
            return undefined;
        }
        var lower = name.toLowerCase();
        for (var key in headers) {
            if (
                Object.prototype.hasOwnProperty.call(headers, key) &&
                key.toLowerCase() === lower
            ) {
                return headers[key];
            }
        }
        return undefined;
    }

    function donePassThrough() {
        $done({});
    }

    function doneRewriteResponse(bytes) {
        var sourceHeaders =
            typeof $response !== "undefined" ? $response.headers : {};
        var headers = headersAfterRewrite(sourceHeaders);
        $done({
            headers: headers,
            body: bytes,
        });
    }

    function continueResponseRewrite(config, responseBody) {
        if (!responseBody || responseBody.length < 2) {
            donePassThrough();
            return;
        }
        var responseResult = spoofAppleResponse(responseBody, config);
        if (responseResult.unchanged) {
            donePassThrough();
            return;
        }
        doneRewriteResponse(responseResult.response);
    }

    function runSurge() {
        if (typeof $response === "undefined" || $response == null) {
            donePassThrough();
            return;
        }

        try {
            var config = loadRuntimeConfig();
            if (!config.enabled) {
                donePassThrough();
                return;
            }
            var responseBody = prepareResponseBody();
            continueResponseRewrite(config, responseBody);
        } catch (err) {
            console.log(
                "Location spoofer fail-open: " +
                    (err && err.message ? err.message : String(err)),
            );
            donePassThrough();
        }
    }

    runSurge();
})();
