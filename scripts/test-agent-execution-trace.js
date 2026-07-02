const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appPath = path.join(__dirname, "..", "app.js");
const source = fs.readFileSync(appPath, "utf8");

function extractFunction(name) {
  const start = source.indexOf(`function ${name}`);
  if (start < 0) throw new Error(`Missing function ${name}`);

  const signatureEnd = source.indexOf(") {", start);
  const bodyStart = signatureEnd >= 0 ? signatureEnd + 2 : source.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }

  throw new Error(`Could not extract function ${name}`);
}

const functionNames = [
  "normalizeAgentStepStatus",
  "normalizeAgentExecutionTrace",
  "createAgentExecutionTrace",
  "updateAgentExecutionTrace",
  "findAgentConfirmationStepIndex",
  "shouldAgentWaitForConfirmation",
  "completeAgentConfirmationTrace",
  "normalizeAgentGoalDraft",
  "createAgentToolRegistry",
  "getAgentToolDefinition",
  "parseAgentGoal",
  "createAgentGoalPlan",
];

const sandbox = {
  Date,
  getLanguage: () => "zh",
};

vm.createContext(sandbox);
vm.runInContext(functionNames.map(extractFunction).join("\n"), sandbox);

const draft = sandbox.parseAgentGoal("帮我写当前章节正文");
assert.equal(draft.executionTrace.status, "idle");
assert.ok(draft.planSteps.length > 0);
assert.equal(draft.executionTrace.steps.length, draft.planSteps.length);
assert.ok(draft.executionTrace.steps.every((step) => step.status === "queued"));
assert.equal(sandbox.shouldAgentWaitForConfirmation(draft), true);

const runningTrace = sandbox.createAgentExecutionTrace(draft, "running");
assert.equal(runningTrace.status, "running");
assert.equal(runningTrace.steps[0].status, "running");
assert.ok(runningTrace.steps.slice(1).every((step) => step.status === "queued"));

const waitingTrace = sandbox.updateAgentExecutionTrace(runningTrace, "waiting_confirmation", {
  planSteps: draft.planSteps,
  successSummary: "已完成。",
  confirmationSummary: "请先检查生成结果，再确认是否应用。",
});
assert.equal(waitingTrace.status, "waiting_confirmation");
assert.ok(waitingTrace.completedAt);
assert.equal(waitingTrace.steps.at(-1).status, "waiting_confirmation");
assert.equal(waitingTrace.steps.at(-1).resultSummary, "请先检查生成结果，再确认是否应用。");
assert.ok(waitingTrace.steps.slice(0, -1).every((step) => step.status === "success"));

const confirmedTrace = sandbox.completeAgentConfirmationTrace(waitingTrace, draft.planSteps, "AI 草稿已应用。");
assert.equal(confirmedTrace.status, "success");
assert.ok(confirmedTrace.steps.every((step) => step.status === "success"));
assert.ok(confirmedTrace.steps.every((step) => step.resultSummary === "AI 草稿已应用。"));

const noConfirmationDraft = sandbox.parseAgentGoal("检查冲突");
assert.equal(sandbox.shouldAgentWaitForConfirmation(noConfirmationDraft), false);
const successTrace = sandbox.updateAgentExecutionTrace(
  sandbox.createAgentExecutionTrace(noConfirmationDraft, "running"),
  "success",
  {
    planSteps: noConfirmationDraft.planSteps,
    successSummary: "流程已完成。",
  },
);
assert.equal(successTrace.status, "success");
assert.ok(successTrace.steps.every((step) => step.status === "success"));

const errorTrace = sandbox.updateAgentExecutionTrace(runningTrace, "error", {
  planSteps: draft.planSteps,
  error: "模拟失败",
});
assert.equal(errorTrace.status, "error");
assert.equal(errorTrace.steps[0].status, "error");
assert.ok(errorTrace.steps.slice(1).every((step) => step.status === "skipped"));
assert.equal(errorTrace.error, "模拟失败");

const normalized = sandbox.normalizeAgentGoalDraft({
  ...draft,
  executionTrace: waitingTrace,
});
assert.equal(normalized.executionTrace.status, "waiting_confirmation");
assert.equal(normalized.executionTrace.steps.length, normalized.planSteps.length);

console.log("Agent execution trace tests passed");
