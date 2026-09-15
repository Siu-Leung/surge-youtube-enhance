// Test harness: runs the module scripts in a minimal fake Surge environment.
//
//   node test/youtube/run.js
//
// The scripts expect the Surge / Loon / Quantumult X globals ($request,
// $response, $argument, $persistentStore, $done, console). We provide
// stand-ins so the same code can be exercised under plain Node.
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const P = require("./proto.js");

const ROOT = path.join(__dirname, "..", "..");
const RESPONSE = fs.readFileSync(path.join(ROOT, "scripts/youtube/response.js"), "utf8");
const REQUEST = fs.readFileSync(path.join(ROOT, "scripts/youtube/request.js"), "utf8");

function sandboxFor({ url, method = "POST", headers = {}, requestBody, responseBody, argument, store }) {
    const persistent = { ...store };
    const logs = [];
    let done = null;
    const sandbox = {
        $request: { url, method, headers, body: requestBody },
        $response: responseBody ? { status: 200, headers: {}, body: responseBody } : undefined,
        $argument: argument,
        $persistentStore: {
            read: (k) => persistent[k] ?? null,
            write: (val, k) => { persistent[k] = val; },
        },
        $done: (r) => { done = r; },
        $notification: { post: () => {} },
        console: { log: (...a) => logs.push(a.join(" ")) },
        TextEncoder, TextDecoder, Uint8Array, Uint16Array, Uint32Array, Int32Array,
        Float64Array, ArrayBuffer, Math, JSON, Object, Number, String, Array,
        Set, Map, WeakSet, WeakMap, Symbol, Error, TypeError, Boolean, RegExp,
        Date, Promise, BigInt, isNaN, parseInt, parseFloat, DataView, Reflect, Proxy,
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    return { sandbox, persistent, logs, result: () => ({ done, logs, persistent }) };
}

function runScript(source, options) {
    const env = sandboxFor(options);
    let error;
    try {
        vm.runInContext(source, env.sandbox, { timeout: 10000 });
    } catch (e) {
        error = String(e);
    }
    const out = env.result();
    return { ...out, error };
}

const runResponse = (options) => runScript(RESPONSE, options);
const runRequest = (options) => runScript(REQUEST, options);

// --- tiny assertion helpers -----------------------------------------------
let passed = 0, failed = 0;
const failures = [];

function check(name, condition, detail) {
    if (condition) {
        passed++;
        console.log("  ok   " + name);
    } else {
        failed++;
        failures.push(name + (detail ? " -- " + detail : ""));
        console.log("  FAIL " + name + (detail ? " -- " + detail : ""));
    }
}
function section(name) {
    console.log("\n" + name);
}
function bodyOf(result) {
    if (!result.done) return null;
    return result.done.body ?? result.done.bodyBytes ?? null;
}

module.exports = { P, runResponse, runRequest, check, section, bodyOf, summary: () => ({ passed, failed, failures }) };
