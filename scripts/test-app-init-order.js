const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");

const defaultsIndex = source.indexOf("const aiProviderDefaults");
const stateIndex = source.indexOf("const state = loadState()");

assert.notEqual(defaultsIndex, -1, "aiProviderDefaults must exist");
assert.notEqual(stateIndex, -1, "state initialization must exist");
assert.ok(defaultsIndex < stateIndex, "aiProviderDefaults must be defined before loadState() runs");

console.log("App init order test passed");
