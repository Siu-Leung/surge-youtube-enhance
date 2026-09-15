// Runs every YouTube module test suite.
//
//   node test/youtube/index.js      (or `npm test` from test/)
//
// No dependencies: the suite only uses Node's built-in modules.
const { spawnSync } = require("child_process");
const path = require("path");

const suites = ["response.test.js", "request.test.js", "ump.test.js"];
let failed = 0;

for (const suite of suites) {
    const result = spawnSync(process.execPath, [path.join(__dirname, suite)], { stdio: "inherit" });
    if (result.status !== 0) failed++;
}

console.log(failed ? `\n${failed} suite(s) failed` : "\nall suites passed");
process.exitCode = failed ? 1 : 0;
