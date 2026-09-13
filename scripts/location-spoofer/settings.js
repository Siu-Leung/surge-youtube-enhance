/**
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * HTTPS Shortcut control for iOS Location Spoofer. The same request route
 * works in Surge iOS and in Surge Mac gateway mode. Only Apple Maps share
 * URLs containing a numeric coordinate are accepted.
 */
(function () {
    "use strict";

    var STORE_KEY = "ios_location_spoofer_settings";
    var SHORTCUT_CONTROL_PATTERN =
        /^https:\/\/location-spoofer\.test\/(set|status|clear|reset)(?:[?#]|$)/i;
    var DEFAULT_ACCURACY = 39;
    var MAX_ACCURACY = 100000;

    function safeDecode(value) {
        var text = String(value == null ? "" : value);
        try {
            return decodeURIComponent(text.replace(/\+/g, "%20"));
        } catch (err) {
            return text;
        }
    }

    function parseCoordinatePair(value) {
        var match = String(value || "").match(
            /^\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*$/,
        );
        if (!match) {
            return null;
        }
        var latitude = Number(match[1]);
        var longitude = Number(match[2]);
        return validCoordinate(latitude, longitude)
            ? { latitude: latitude, longitude: longitude }
            : null;
    }

    function appleMapsParameter(text, name) {
        var pattern = new RegExp("(?:[?&]|&amp;)" + name + "=([^&#\\s]+)", "i");
        var match = text.match(pattern);
        return match ? parseCoordinatePair(safeDecode(match[1])) : null;
    }

    function normalizeMapUrl(input, pattern) {
        var text = String(input == null ? "" : input).trim();
        var urlMatch = text.match(/https?:\/\/[^\s'"<>]+/i);
        if (urlMatch && pattern.test(urlMatch[0])) {
            return urlMatch[0];
        }
        if (pattern.test(text)) {
            return /^https?:\/\//i.test(text) ? text : "https://" + text;
        }
        try {
            var decoded = decodeURIComponent(text);
            urlMatch = decoded.match(/https?:\/\/[^\s'"<>]+/i);
            if (urlMatch && pattern.test(urlMatch[0])) {
                return urlMatch[0];
            }
            if (!pattern.test(decoded)) {
                return null;
            }
            return /^https?:\/\//i.test(decoded)
                ? decoded
                : "https://" + decoded;
        } catch (err) {
            return null;
        }
    }

    function normalizeAppleMapsUrl(input) {
        return normalizeMapUrl(
            input,
            /^(?:https?:\/\/)?maps\.apple\.(?:com|cn)(?:[/:?#]|$)/i,
        );
    }

    function extractAppleMapsCoordinate(input) {
        var text = normalizeAppleMapsUrl(input);
        if (!text) {
            return null;
        }

        var directions = /maps\.apple\.(?:com|cn)\/directions(?:[/?#]|$)/i.test(
            text,
        );
        var parameterNames = directions
            ? [
                  "destination",
                  "waypoint",
                  "coordinate",
                  "center",
                  "ll",
                  "sll",
                  "near",
                  "source",
              ]
            : [
                  "coordinate",
                  "center",
                  "ll",
                  "sll",
                  "near",
                  "destination",
                  "source",
              ];

        for (var i = 0; i < parameterNames.length; i += 1) {
            var coordinate = appleMapsParameter(text, parameterNames[i]);
            if (coordinate) {
                return coordinate;
            }
        }
        return null;
    }

    function validCoordinate(latitude, longitude) {
        return (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude) &&
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180
        );
    }

    function isNumericInput(value) {
        return (
            typeof value === "number" ||
            (typeof value === "string" && value.trim() !== "")
        );
    }

    function normalizeAccuracy(value) {
        var useDefault =
            value == null || (typeof value === "string" && value.trim() === "");
        if (!useDefault && !isNumericInput(value)) {
            throw new Error("invalid accuracy");
        }
        var accuracy = useDefault ? DEFAULT_ACCURACY : Number(value);
        if (
            !Number.isFinite(accuracy) ||
            !Number.isInteger(accuracy) ||
            accuracy < 0 ||
            accuracy > MAX_ACCURACY
        ) {
            throw new Error(
                "invalid accuracy (expected integer 0-" + MAX_ACCURACY + ")",
            );
        }
        return accuracy;
    }

    function buildSaveOperation(values) {
        var mapUrl = normalizeAppleMapsUrl(values.url);
        if (!mapUrl) {
            throw new Error("unsupported input (expected Apple Maps URL)");
        }
        var coordinate = extractAppleMapsCoordinate(mapUrl);
        if (!coordinate) {
            throw new Error("Apple Maps URL has no numeric coordinate");
        }
        var accuracy = normalizeAccuracy(values.accuracy);

        return {
            action: "save",
            settings: {
                enabled: true,
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                accuracy: accuracy,
            },
        };
    }

    function buildIntentOperation(input) {
        if (input == null || input === "") {
            return { action: "status" };
        }
        if (Array.isArray(input)) {
            input = input.length ? input[0] : "";
        }
        if (typeof input === "object") {
            if (Object.prototype.hasOwnProperty.call(input, "action")) {
                var action = String(input.action || "save")
                    .trim()
                    .toLowerCase();
                if (action === "-") {
                    action = "clear";
                }
                if (action !== "save") {
                    if (
                        action !== "clear" &&
                        action !== "status" &&
                        action !== "reset"
                    ) {
                        throw new Error("unsupported action: " + action);
                    }
                    return { action: action };
                }
            }
            var sharedInput = input.url != null ? input.url : input.input;
            if (Array.isArray(sharedInput)) {
                sharedInput = sharedInput.length ? sharedInput[0] : "";
            }
            if (sharedInput != null) {
                return buildSaveOperation({
                    url: sharedInput,
                    accuracy: input.accuracy,
                });
            }
            return buildSaveOperation(input);
        }

        var text = String(input).trim();
        var lower = text.toLowerCase();
        if (!text || lower === "status") {
            return { action: "status" };
        }
        if (text === "-" || lower === "clear") {
            return { action: "clear" };
        }
        if (lower === "reset") {
            return { action: "reset" };
        }
        if (text.charAt(0) === "{") {
            var parsed;
            try {
                parsed = JSON.parse(text);
            } catch (err) {
                throw new Error("invalid Shortcut JSON");
            }
            return buildIntentOperation(parsed);
        }
        if (normalizeAppleMapsUrl(text)) {
            return buildSaveOperation({ url: text });
        }
        throw new Error("unsupported input (expected Apple Maps URL)");
    }

    function requestQueryParameter(url, name) {
        var queryIndex = String(url || "").indexOf("?");
        if (queryIndex < 0) {
            return null;
        }
        var query = String(url)
            .slice(queryIndex + 1)
            .split("#")[0];
        var pairs = query.split("&");
        for (var i = 0; i < pairs.length; i += 1) {
            var pair = pairs[i];
            var separator = pair.indexOf("=");
            var key = separator >= 0 ? pair.slice(0, separator) : pair;
            if (safeDecode(key) === name) {
                return safeDecode(
                    separator >= 0 ? pair.slice(separator + 1) : "",
                );
            }
        }
        return null;
    }

    function parseShortcutBody(body) {
        var text = String(body == null ? "" : body).trim();
        if (!text) {
            return null;
        }
        if (
            text.charAt(0) === "{" ||
            text.charAt(0) === "[" ||
            text.charAt(0) === '"'
        ) {
            try {
                return JSON.parse(text);
            } catch (err) {
                throw new Error("invalid Shortcut JSON");
            }
        }
        return text;
    }

    function shortcutInput() {
        if (typeof $request === "undefined" || !$request) {
            throw new Error("missing Shortcut request");
        }
        var match = String($request.url || "").match(SHORTCUT_CONTROL_PATTERN);
        if (!match) {
            throw new Error("invalid Shortcut control URL");
        }
        var route = match[1].toLowerCase();
        if (route !== "set") {
            return { action: route };
        }

        var bodyInput = parseShortcutBody($request.body);
        if (bodyInput != null) {
            return bodyInput;
        }

        var url = String($request.url || "");
        var sharedInput = requestQueryParameter(url, "input");
        if (sharedInput == null) {
            sharedInput = requestQueryParameter(url, "url");
        }
        if (sharedInput == null || sharedInput === "") {
            throw new Error("missing Shortcut input");
        }
        return {
            input: sharedInput,
            accuracy: requestQueryParameter(url, "accuracy"),
        };
    }

    function persistentStoreAvailable() {
        return (
            typeof $persistentStore !== "undefined" &&
            $persistentStore &&
            typeof $persistentStore.read === "function" &&
            typeof $persistentStore.write === "function"
        );
    }

    function readSettings() {
        if (!persistentStoreAvailable()) {
            return null;
        }
        try {
            var raw = $persistentStore.read(STORE_KEY);
            if (!raw) {
                return null;
            }
            var parsed = JSON.parse(raw);
            return parsed && typeof parsed === "object" ? parsed : null;
        } catch (err) {
            return null;
        }
    }

    function writeStoredString(value) {
        if (!persistentStoreAvailable()) {
            return false;
        }
        try {
            return $persistentStore.write(String(value), STORE_KEY) === true;
        } catch (err) {
            return false;
        }
    }

    function settingsMatch(expected, actual) {
        if (!expected || !actual) {
            return false;
        }
        var keys = ["enabled", "latitude", "longitude", "accuracy"];
        for (var i = 0; i < keys.length; i += 1) {
            var key = keys[i];
            if (
                Object.prototype.hasOwnProperty.call(expected, key) &&
                expected[key] !== actual[key]
            ) {
                return false;
            }
        }
        return true;
    }

    function executeOperation(operation) {
        if (operation.action === "status") {
            return {
                success: true,
                action: "status",
                settings: readSettings(),
                fallback: "module-arguments",
            };
        }
        if (operation.action === "clear") {
            var disabled = {
                enabled: false,
            };
            var clearWritten = writeStoredString(JSON.stringify(disabled));
            var clearStored = readSettings();
            return {
                success:
                    clearWritten &&
                    clearStored &&
                    clearStored.enabled === false,
                action: "clear",
                settings: clearStored,
            };
        }
        if (operation.action === "reset") {
            var resetWritten = writeStoredString("");
            var resetSettings = readSettings();
            return {
                success: resetWritten && resetSettings === null,
                action: "reset",
                settings: resetSettings,
                fallback: "module-arguments",
            };
        }
        if (operation.action === "save") {
            var saveWritten = writeStoredString(
                JSON.stringify(operation.settings),
            );
            var saved = readSettings();
            return {
                success:
                    saveWritten && settingsMatch(operation.settings, saved),
                action: "save",
                settings: saved,
            };
        }
        throw new Error("unsupported action: " + operation.action);
    }

    function finishError(error) {
        finish({
            success: false,
            action: "error",
            error: error && error.message ? error.message : String(error),
        });
    }

    function resultMessage(result) {
        if (!result.success) {
            return result.error
                ? String(result.error)
                : "Settings write failed";
        }
        if (result.action === "save" && result.settings) {
            return (
                Number(result.settings.latitude).toFixed(6) +
                "," +
                Number(result.settings.longitude).toFixed(6) +
                " ±" +
                result.settings.accuracy +
                "m"
            );
        }
        if (result.action === "clear") {
            return "Passthrough enabled";
        }
        if (result.action === "reset") {
            return "Module defaults restored";
        }
        if (result.settings && result.settings.enabled !== false) {
            if (
                isNumericInput(result.settings.latitude) &&
                isNumericInput(result.settings.longitude) &&
                validCoordinate(
                    Number(result.settings.latitude),
                    Number(result.settings.longitude),
                )
            ) {
                return (
                    Number(result.settings.latitude).toFixed(6) +
                    "," +
                    Number(result.settings.longitude).toFixed(6)
                );
            }
            return "Using module defaults";
        }
        return result.settings && result.settings.enabled === false
            ? "Passthrough enabled"
            : "Using module defaults";
    }

    function finish(result) {
        var message = resultMessage(result);
        var responseResult = {};
        var key;
        for (key in result) {
            if (Object.prototype.hasOwnProperty.call(result, key)) {
                responseResult[key] = result[key];
            }
        }
        responseResult.message = message;
        $done({
            response: {
                status: 200,
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Cache-Control": "no-store",
                },
                body: JSON.stringify(responseResult),
            },
        });
    }

    try {
        var operation = buildIntentOperation(shortcutInput());
        finish(executeOperation(operation));
    } catch (err) {
        finishError(err);
    }
})();
