const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
const stylesSource = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const preloadSource = fs.readFileSync(path.join(root, "preload.js"), "utf8");
const mainSource = fs.readFileSync(path.join(root, "main.js"), "utf8");

const requiredUiActions = [
  'data-agent-action="generate-outline"',
  'data-agent-action="write-chapter"',
  'data-agent-action="summarize-chapter"',
  'data-agent-action="check-consistency"',
  'id="agent-generation-mode-select"',
  'id="agent-show-cost-details-toggle"',
  'id="ai-model-select"',
  'data-agent-goal-action="parse"',
  'data-agent-goal-action="execute"',
  'id="agent-goal-input"',
  'data-selection-action="ai-rewrite"',
  'data-inspiration-action="develop-project-materials"',
  'data-inspiration-action="toggle-select"',
  'data-inspiration-action="develop-selected-project-materials"',
  'data-inspiration-action="clear-selection"',
];

for (const marker of requiredUiActions) {
  assert.ok(appSource.includes(marker), `Missing UI action marker: ${marker}`);
}

const clearerLabels = [
  '"ai.writeChapter": "按大纲起草"',
  '"ai.summarizeChapter": "总结并更新记忆"',
  '"ai.generateRevision": "基于正文改稿"',
  '"ai.writeChapter": "Draft from Outline"',
  '"ai.summarizeChapter": "Summarize to Memory"',
  '"ai.generateRevision": "Revise Current Body"',
];

for (const marker of clearerLabels) {
  assert.ok(appSource.includes(marker), `Missing clearer AI label: ${marker}`);
}

assert.ok(!appSource.includes('"ai.writeChapter": "写当前章节"'), "Ambiguous Chinese draft label should not return");
assert.ok(!appSource.includes('"ai.summarizeChapter": "总结当前章节"'), "Ambiguous Chinese summary label should not return");
assert.ok(!appSource.includes("生成 AI 新版"), "Ambiguous AI revision label should not return");
assert.ok(!appSource.includes('id="agent-report"'), "AI agent card should not render generated content inline");
assert.ok(!appSource.includes("renderAgentReport"), "AI agent card should not render generated reports inline");
assert.ok(appSource.includes("button.classList.toggle(\"is-loading\""), "AI action buttons should expose progress state");
assert.ok(appSource.includes('id="agent-target-hint"'), "AI agent card should show the current target chapter");
assert.ok(appSource.includes("getCurrentChapterNumber(chapter)"), "Target chapter hint should use the active chapter number");
assert.ok(appSource.includes("快速草稿"), "Generation mode UI should expose fast draft copy");
assert.ok(appSource.includes("标准章节（推荐）"), "Generation mode UI should expose recommended standard chapter copy");
assert.ok(appSource.includes("精修章节"), "Generation mode UI should expose polished chapter copy");
assert.ok(appSource.includes('generation_mode: "fast_draft"'), "Fast draft mode should map to fast_draft");
assert.ok(appSource.includes('generation_mode: "standard_chapter"'), "Standard mode should map to standard_chapter");
assert.ok(appSource.includes('generation_mode: "polished_chapter"'), "Polished mode should map to polished_chapter");
assert.ok(appSource.includes("enable_context_pack_for_summary: true"), "Summary context pack should be enabled in default payload");
assert.ok(appSource.includes("enable_context_pack_for_audit: false"), "Audit context pack should remain disabled in default payload");
assert.ok(appSource.includes("enable_model_routing: false"), "Model routing should remain disabled in default payload");
assert.ok(appSource.includes('id="ai-model-select"'), "AI settings should expose a visible model select");
assert.ok(appSource.includes("handleAiModelSelectChange"), "Selecting a preset model should update the model input");
assert.ok(appSource.includes("aiProviderModelOptions"), "AI model presets should be grouped by provider");
assert.ok(appSource.includes('"gpt-4.1-mini"'), "OpenAI model presets should include the low-cost mini candidate");
assert.ok(appSource.includes("renderAiModelOptions"), "AI model presets should render into a select");
assert.ok(appSource.includes("target_word_count: Number(chapter?.wordGoal) || 0"), "Chapter word goal should be sent to Cost Guard and writer");
assert.ok(appSource.includes("showCostDetails: false"), "Cost details should default to hidden in UI state");
assert.ok(appSource.includes("show_cost_details: Boolean(state.ui.showCostDetails)"), "Payload should carry the cost details preference");
assert.ok(
  appSource.includes("本次生成内容较长，可能消耗较多资源。建议降低目标字数，或切换为快速草稿。"),
  "Cost Guard blocked state should use friendly ordinary-user copy",
);
assert.ok(appSource.includes("formatCostGuardBlockedDetails"), "Cost Guard details should be explicitly formatted for advanced users");
assert.ok(appSource.includes("openCostGuardConfirmationModal"), "Cost Guard blocked write flow should open a continue/cancel confirmation modal");
assert.ok(appSource.includes("confirm-cost-guard-continue"), "Cost Guard confirmation modal should allow continuing the current write");
assert.ok(appSource.includes("cost_guard_confirmed: options.costGuardConfirmed === true"), "Confirmed Cost Guard writes should carry an explicit backend confirmation flag");
assert.ok(appSource.includes("formatAgentFailureMessage"), "Agent failures should be formatted before being shown to users");
assert.ok(appSource.includes("失败前已完成请求"), "Network failures should show how many LLM requests completed before failure");
assert.ok(!appSource.includes("budget_report.llm_events"), "Cost Guard details should not expose full llm_events");
assert.ok(
  appSource.indexOf('id="agent-show-cost-details-toggle"') > appSource.indexOf("function AiSettingsCard"),
  "Cost details toggle should live in the settings card",
);
assert.ok(
  appSource.indexOf('id="agent-show-cost-details-toggle"') < appSource.indexOf("function ThemeSelector"),
  "Cost details toggle should stay within AI settings before theme settings",
);
assert.ok(appSource.includes("parseAgentGoal"), "AI agent card should parse natural-language task goals before execution");
assert.ok(appSource.includes("executeParsedAgentGoal"), "Parsed task goals should route into existing workflows");
assert.ok(appSource.includes("agentGoalDraft"), "Parsed task goal state should be persisted in UI state");
assert.ok(appSource.includes("createAgentGoalPlan"), "Parsed task goals should include a visible execution plan");
assert.ok(appSource.includes("planSteps"), "Agent goal drafts should expose ordered plan steps");
assert.ok(appSource.includes("requiresConfirmation"), "Agent goal plans should mark workflows that require confirmation");
assert.ok(appSource.includes("agent-plan-step"), "AI agent card should render plan steps for review");
assert.ok(appSource.includes("createAgentToolRegistry"), "Agent tools should be registered through a stable registry");
assert.ok(appSource.includes("getAgentToolDefinition"), "Plan steps should resolve tool metadata from the registry");
assert.ok(appSource.includes("toolId"), "Plan steps should reference registered tools by id");
assert.ok(appSource.includes("inputSchema"), "Registered tools should document expected input shape");
assert.ok(appSource.includes("outputSchema"), "Registered tools should document expected output shape");
assert.ok(appSource.includes("agentExecutionTrace"), "Agent goal execution should persist a visible trace");
assert.ok(appSource.includes("normalizeAgentExecutionTrace"), "Agent execution traces should be normalized before rendering");
assert.ok(appSource.includes("createAgentExecutionTrace"), "Agent execution should initialize a trace before running");
assert.ok(appSource.includes("updateAgentExecutionTrace"), "Agent execution should update trace status after completion");
assert.ok(appSource.includes("waiting_confirmation"), "Agent execution should stop at confirmation gates");
assert.ok(appSource.includes("shouldAgentWaitForConfirmation"), "Agent execution should detect workflows that need user confirmation");
assert.ok(appSource.includes("completeAgentConfirmationTrace"), "Agent confirmation should advance waiting traces to success");
assert.ok(appSource.includes("completeCurrentAgentConfirmation"), "Confirmed UI actions should complete the active agent trace");
assert.ok(appSource.includes("getAgentStepStatusLabel"), "Agent plan steps should render readable status labels");
assert.ok(appSource.includes("is-running"), "Agent plan steps should expose running state styling");
assert.ok(stylesSource.includes(".agent-plan-step.is-success"), "Agent plan steps should expose success state styling");
assert.ok(stylesSource.includes(".agent-plan-step.is-error"), "Agent plan steps should expose error state styling");
assert.ok(stylesSource.includes(".agent-plan-step.is-waiting_confirmation"), "Agent plan steps should expose waiting-confirmation state styling");
assert.ok(appSource.includes("openIdeaProjectMaterialsPreviewModal"), "Idea-to-project-materials should preview before writing");
assert.ok(appSource.includes("confirm-write-idea-project-materials"), "Idea-to-project-materials should require confirmation");
assert.ok(appSource.includes("Project materials written."), "Project-material confirmation should update agent trace status");
assert.ok(appSource.includes("AI draft applied."), "AI draft confirmation should update agent trace status");
assert.ok(appSource.includes("desktopApi.generateProjectMaterialsFromIdea"), "Idea-to-project-materials should call the desktop bridge");
assert.ok(appSource.includes("desktopApi.saveProjectMaterial"), "Confirmed idea materials should reuse project material saving");
assert.ok(appSource.includes("selectedInspirationIds"), "Idea-to-project-materials should persist selected ideas");
assert.ok(appSource.includes("buildCombinedIdeaFromInspirations"), "Selected ideas should be merged before developing project materials");
assert.ok(appSource.includes("generateProjectMaterialsFromSelectedInspirations"), "Selected ideas should support one-click project material generation");

const requiredDesktopCalls = [
  "desktopApi.generateChapterOutline",
  "desktopApi.writeChapterWithNovelAgent",
  "desktopApi.summarizeCurrentChapter",
  "desktopApi.checkChapterConsistency",
  "desktopApi.rewriteSelectedText",
  "desktopApi.generateProjectMaterialsFromIdea",
];

for (const marker of requiredDesktopCalls) {
  assert.ok(appSource.includes(marker), `Missing UI desktop bridge call: ${marker}`);
}

assert.ok(appSource.includes("openInfoModal(t(\"ai.title\"), state.ui.agentStatus)"), "Agent failures should show a modal");
assert.ok(appSource.includes("openInfoModal(t(\"ai.title\"), t(\"ai.desktopRequired\"))"), "Missing desktop-required error feedback");
assert.ok(appSource.includes("state.ui.agentActionPending"), "Missing pending state for agent actions");

const preloadContracts = [
  'generateChapterOutline: (payload) => ipcRenderer.invoke("novel-agent:generate-outline", payload)',
  'writeChapterWithNovelAgent: (payload) => ipcRenderer.invoke("novel-agent:write-chapter", payload)',
  'summarizeCurrentChapter: (payload) => ipcRenderer.invoke("novel-agent:summarize-chapter", payload)',
  'rewriteSelectedText: (payload) => ipcRenderer.invoke("novel-agent:rewrite-text", payload)',
  'checkChapterConsistency: (payload) => ipcRenderer.invoke("novel-agent:consistency-check", payload)',
  'generateProjectMaterialsFromIdea: (payload) =>',
  'ipcRenderer.invoke("novel-agent:generate-project-materials-from-idea", payload)',
];

for (const marker of preloadContracts) {
  assert.ok(preloadSource.includes(marker), `Missing preload contract: ${marker}`);
}

const mainHandlers = [
  'ipcMain.handle("novel-agent:generate-outline"',
  'ipcMain.handle("novel-agent:write-chapter"',
  'ipcMain.handle("novel-agent:summarize-chapter"',
  'ipcMain.handle("novel-agent:rewrite-text"',
  'ipcMain.handle("novel-agent:consistency-check"',
  'ipcMain.handle("novel-agent:generate-project-materials-from-idea"',
];

for (const marker of mainHandlers) {
  assert.ok(mainSource.includes(marker), `Missing main process handler: ${marker}`);
}

assert.ok(mainSource.includes("test_run_mode: false"), "Desktop Cost Guard should not run in 500-word test mode");
assert.ok(mainSource.includes("max_llm_calls_per_chapter: 30"), "Desktop Cost Guard should allow normal polished chapter call counts");
assert.ok(mainSource.includes("max_estimated_cost_usd: 3.0"), "Desktop Cost Guard should use the product runtime cost ceiling");
assert.ok(mainSource.includes("const AI_PROMPT_REQUEST_TIMEOUT_MS = 300000"), "Prompt agent timeout should allow long chapter calls to finish");

console.log("Agent UI integration test passed");
