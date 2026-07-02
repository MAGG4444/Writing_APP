const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appPath = path.join(__dirname, "..", "app.js");
const source = fs.readFileSync(appPath, "utf8");

function extractFunction(name) {
  const start = source.indexOf(`function ${name}`);
  if (start < 0) throw new Error(`Missing function ${name}`);

  const bodyStart = source.indexOf("{", start);
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
  "createAgentToolRegistry",
  "getAgentToolDefinition",
  "normalizeAgentGoalDraft",
  "parseAgentGoal",
  "createAgentGoalPlan",
];

const sandbox = {
  getLanguage: () => "zh",
};

vm.createContext(sandbox);
vm.runInContext(functionNames.map(extractFunction).join("\n"), sandbox);

const registry = sandbox.createAgentToolRegistry();
const requiredToolIds = [
  "read_project_context",
  "selected_inspirations",
  "generate_project_materials_from_idea",
  "save_project_material",
  "write_chapter",
  "ai_review_surface",
  "summarize_chapter",
  "update_memory",
  "read_chapter",
  "consistency_check",
  "generate_chapter_outline",
  "applyGeneratedOutline",
];

for (const toolId of requiredToolIds) {
  const tool = registry[toolId];
  assert.ok(tool, `Missing registered tool: ${toolId}`);
  assert.equal(tool.id, toolId);
  assert.equal(typeof tool.label, "string");
  assert.equal(typeof tool.description, "string");
  assert.equal(typeof tool.inputSchema, "string");
  assert.equal(typeof tool.outputSchema, "string");
  assert.equal(typeof tool.requiresConfirmation, "boolean");
}

for (const goal of ["根据选中的灵感更新项目资料", "帮我写当前章节正文", "检查设定冲突", "总结这一章记忆", "规划当前章节"]) {
  const draft = sandbox.parseAgentGoal(goal);
  assert.ok(draft.planSteps.length > 0, `Goal should produce plan steps: ${goal}`);
  for (const step of draft.planSteps) {
    assert.ok(registry[step.toolId], `Plan step references unregistered tool: ${step.toolId}`);
  }
}

console.log("Agent tool registry tests passed");
