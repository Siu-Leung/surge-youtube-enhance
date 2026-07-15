/**
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Native Surge Shortcut settings for iOS Location Spoofer.
 * Input arrives through $intent.parameter. No network request is used.
 */
(function () {
    "use strict";

    var STORE_KEY = "ios_location_spoofer_settings";
    var DEFAULT_ACCURACY = 39;
    var MAX_ACCURACY = 100000;
    var SETTINGS_SCHEMA_VERSION = 1;

    // Fast mainland approximation adapted from the Nokia Maps rectangle method.
    // Rectangle format: [west, south, east, north].
    var MAINLAND_REGIONS = [
        [79.4462, 42.8899, 96.33, 49.2204],
        [109.6872, 39.3742, 135.0002, 54.1415],
        [73.1246, 29.5297, 124.143255, 42.8899],
        [82.9684, 26.7186, 97.0352, 29.5297],
        [97.0253, 20.414096, 124.367395, 29.5297],
        [107.975793, 17.871542, 111.744104, 20.414096],
    ];
    var MAINLAND_EXCLUSIONS = [
        // Taiwan
        [119.921265, 21.785006, 122.497559, 25.398623],
        // Northern Vietnam
        [101.8652, 20.0988, 106.665, 22.284],
        [106.4525, 20.4878, 108.051, 21.5422],
        // Conservative neighboring-country exclusions. Border locations can
        // explicitly request gcj02 when their provider returns shifted data.
        // Nepal
        [80.0, 26.3, 88.25, 30.5],
        // Bhutan
        [88.7, 26.5, 92.2, 28.5],
        // Northeast India and northern Myanmar
        [92.0, 22.0, 97.5, 29.6],
        // Russia and far-eastern neighbors
        [109.0323, 50.3257, 119.127, 55.8175],
        [127.4568, 49.5574, 137.0227, 55.8175],
        [131.2662, 42.5692, 137.0227, 44.8922],
        // Hong Kong and Macau; force gcj02 when a provider offsets these areas.
        [113.825, 22.15, 114.435, 22.58],
        [113.52, 22.06, 113.64, 22.23],
    ];

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
        var pattern = new RegExp(
            "(?:[?&]|&amp;)" + name + "=([^&#\\s]+)",
            "i",
        );
        var match = text.match(pattern);
        return match ? parseCoordinatePair(safeDecode(match[1])) : null;
    }

    function normalizeAppleMapsUrl(input) {
        var text = String(input == null ? "" : input).trim();
        var pattern = /^(?:https?:\/\/)?maps\.apple\.(?:com|cn)(?:[/:?#]|$)/i;
        if (pattern.test(text)) {
            return text;
        }
        try {
            var decoded = decodeURIComponent(text);
            return pattern.test(decoded) ? decoded : null;
        } catch (err) {
            return null;
        }
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

    function inRectangle(rectangle, longitude, latitude) {
        return (
            longitude >= rectangle[0] &&
            longitude <= rectangle[2] &&
            latitude >= rectangle[1] &&
            latitude <= rectangle[3]
        );
    }

    function isMainlandChina(longitude, latitude) {
        var included = false;
        var i;
        for (i = 0; i < MAINLAND_REGIONS.length; i += 1) {
            if (inRectangle(MAINLAND_REGIONS[i], longitude, latitude)) {
                included = true;
                break;
            }
        }
        if (!included) {
            return false;
        }
        for (i = 0; i < MAINLAND_EXCLUSIONS.length; i += 1) {
            if (inRectangle(MAINLAND_EXCLUSIONS[i], longitude, latitude)) {
                return false;
            }
        }
        return true;
    }

    function transformLatitude(x, y) {
        var result =
            -100 +
            2 * x +
            3 * y +
            0.2 * y * y +
            0.1 * x * y +
            0.2 * Math.sqrt(Math.abs(x));
        result +=
            ((20 * Math.sin(6 * x * Math.PI) +
                20 * Math.sin(2 * x * Math.PI)) *
                2) /
            3;
        result +=
            ((20 * Math.sin(y * Math.PI) +
                40 * Math.sin((y / 3) * Math.PI)) *
                2) /
            3;
        result +=
            ((160 * Math.sin((y / 12) * Math.PI) +
                320 * Math.sin((y * Math.PI) / 30)) *
                2) /
            3;
        return result;
    }

    function transformLongitude(x, y) {
        var result =
            300 +
            x +
            2 * y +
            0.1 * x * x +
            0.1 * x * y +
            0.1 * Math.sqrt(Math.abs(x));
        result +=
            ((20 * Math.sin(6 * x * Math.PI) +
                20 * Math.sin(2 * x * Math.PI)) *
                2) /
            3;
        result +=
            ((20 * Math.sin(x * Math.PI) +
                40 * Math.sin((x / 3) * Math.PI)) *
                2) /
            3;
        result +=
            ((150 * Math.sin((x / 12) * Math.PI) +
                300 * Math.sin((x / 30) * Math.PI)) *
                2) /
            3;
        return result;
    }

    function wgs84ToGcj02Unchecked(longitude, latitude) {
        var radius = 6378245;
        var eccentricity = 0.006693421622965943;
        var deltaLatitude = transformLatitude(longitude - 105, latitude - 35);
        var deltaLongitude = transformLongitude(longitude - 105, latitude - 35);
        var radianLatitude = (latitude / 180) * Math.PI;
        var magic = Math.sin(radianLatitude);
        magic = 1 - eccentricity * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        deltaLatitude =
            (deltaLatitude * 180) /
            (((radius * (1 - eccentricity)) / (magic * sqrtMagic)) * Math.PI);
        deltaLongitude =
            (deltaLongitude * 180) /
            ((radius / sqrtMagic) * Math.cos(radianLatitude) * Math.PI);
        return {
            longitude: longitude + deltaLongitude,
            latitude: latitude + deltaLatitude,
        };
    }

    function gcj02ToWgs84(longitude, latitude, force) {
        if (!force && !isMainlandChina(longitude, latitude)) {
            return {
                longitude: longitude,
                latitude: latitude,
            };
        }

        var estimateLongitude = longitude;
        var estimateLatitude = latitude;
        for (var i = 0; i < 12; i += 1) {
            var projected = wgs84ToGcj02Unchecked(
                estimateLongitude,
                estimateLatitude,
            );
            var longitudeError = projected.longitude - longitude;
            var latitudeError = projected.latitude - latitude;
            estimateLongitude -= longitudeError;
            estimateLatitude -= latitudeError;
            if (
                Math.abs(longitudeError) < 1e-7 &&
                Math.abs(latitudeError) < 1e-7
            ) {
                break;
            }
        }
        return {
            longitude: estimateLongitude,
            latitude: estimateLatitude,
        };
    }

    function normalizeCoordinateSystem(value, fallback) {
        var normalized = String(value || fallback || "auto")
            .trim()
            .toLowerCase()
            .replace(/[-_]/g, "");
        if (normalized === "auto") {
            return "auto";
        }
        if (normalized === "gcj" || normalized === "gcj02") {
            return "gcj02";
        }
        if (
            normalized === "wgs" ||
            normalized === "wgs84" ||
            normalized === "epsg4326"
        ) {
            return "wgs84";
        }
        throw new Error("invalid coordinate system: " + value);
    }

    function convertCoordinate(coordinate, coordinateSystem) {
        if (coordinateSystem === "wgs84") {
            return {
                longitude: coordinate.longitude,
                latitude: coordinate.latitude,
            };
        }
        return gcj02ToWgs84(
            coordinate.longitude,
            coordinate.latitude,
            coordinateSystem === "gcj02",
        );
    }

    function normalizeAccuracy(value) {
        var useDefault =
            value == null ||
            (typeof value === "string" && value.trim() === "");
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

    function objectValue(object, names) {
        for (var i = 0; i < names.length; i += 1) {
            if (Object.prototype.hasOwnProperty.call(object, names[i])) {
                return object[names[i]];
            }
        }
        return null;
    }

    function buildSaveOperation(values) {
        var action = String(objectValue(values, ["action"]) || "save")
            .trim()
            .toLowerCase();
        if (action === "-") {
            action = "clear";
        }
        var disableNames = [
            "value",
            "latitude",
            "lat",
            "longitude",
            "lon",
            "lng",
        ];
        for (var i = 0; i < disableNames.length; i += 1) {
            var disableValue = objectValue(values, [disableNames[i]]);
            if (
                disableValue != null &&
                String(disableValue).trim() === "-"
            ) {
                action = "clear";
                break;
            }
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

        var sharedInput = objectValue(values, ["url", "input", "map"]);
        var extracted = sharedInput
            ? extractAppleMapsCoordinate(sharedInput)
            : null;
        var coordinate;
        var defaultCoordinateSystem;

        if (extracted) {
            coordinate = extracted;
            defaultCoordinateSystem = "auto";
        } else {
            var latitudeValue = objectValue(values, ["latitude", "lat"]);
            var longitudeValue = objectValue(values, [
                "longitude",
                "lon",
                "lng",
            ]);
            if (
                latitudeValue == null ||
                latitudeValue === "" ||
                longitudeValue == null ||
                longitudeValue === ""
            ) {
                throw new Error(
                    sharedInput
                        ? "Apple Maps link has no numeric coordinate"
                        : "missing or invalid coordinates",
                );
            }
            coordinate = {
                latitude: Number(latitudeValue),
                longitude: Number(longitudeValue),
            };
            defaultCoordinateSystem = "wgs84";
        }

        if (!validCoordinate(coordinate.latitude, coordinate.longitude)) {
            throw new Error("missing or invalid coordinates");
        }

        var coordinateSystem = normalizeCoordinateSystem(
            objectValue(values, [
                "coordinateSystem",
                "coordinate-system",
                "crs",
                "coord",
            ]),
            defaultCoordinateSystem,
        );
        var converted = convertCoordinate(coordinate, coordinateSystem);
        if (!validCoordinate(converted.latitude, converted.longitude)) {
            throw new Error("coordinate conversion failed");
        }
        var accuracy = normalizeAccuracy(
            objectValue(values, ["accuracy", "acc"]),
        );

        return {
            action: "save",
            settings: {
                schemaVersion: SETTINGS_SCHEMA_VERSION,
                enabled: true,
                latitude: converted.latitude,
                longitude: converted.longitude,
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

        var coordinate = parseCoordinatePair(text);
        if (coordinate) {
            return buildSaveOperation(coordinate);
        }
        throw new Error("unsupported Shortcut input");
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
        var keys = [
            "schemaVersion",
            "enabled",
            "latitude",
            "longitude",
            "accuracy",
        ];
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
                schemaVersion: SETTINGS_SCHEMA_VERSION,
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
                success: saveWritten && settingsMatch(operation.settings, saved),
                action: "save",
                settings: saved,
            };
        }
        throw new Error("unsupported action: " + operation.action);
    }

    function resultMessage(result) {
        if (!result.success) {
            return "Settings write failed";
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
        if (result.settings && result.settings.enabled) {
            return (
                Number(result.settings.latitude).toFixed(6) +
                "," +
                Number(result.settings.longitude).toFixed(6)
            );
        }
        return result.settings ? "Passthrough enabled" : "Using module defaults";
    }

    function finish(result) {
        var message = resultMessage(result);
        if (
            typeof $notification !== "undefined" &&
            $notification &&
            typeof $notification.post === "function"
        ) {
            $notification.post(
                "iOS Location Spoofer",
                result.success ? result.action : "error",
                message,
            );
        }
        $done(result);
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = {
            STORE_KEY: STORE_KEY,
            extractAppleMapsCoordinate: extractAppleMapsCoordinate,
            isMainlandChina: isMainlandChina,
            gcj02ToWgs84: gcj02ToWgs84,
            buildIntentOperation: buildIntentOperation,
            readSettings: readSettings,
            executeOperation: executeOperation,
        };
        return;
    }

    try {
        var parameter =
            typeof $intent !== "undefined" && $intent
                ? $intent.parameter
                : null;
        finish(executeOperation(buildIntentOperation(parameter)));
    } catch (err) {
        finish({
            success: false,
            action: "error",
            error: err.message,
        });
    }
})();
