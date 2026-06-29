const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
const preloadSource = fs.readFileSync(path.join(root, "preload.js"), "utf8");
const mainSource = fs.readFileSync(path.join(root, "main.js"), "utf8");

const requiredUiActions = [
  'data-agent-action="generate-outline"',
  'data-agent-action="write-chapter"',
  'data-agent-action="summarize-chapter"',
  'data-agent-action="check-consistency"',
  'data-selection-action="ai-rewrite"',
  'data-inspiration-action="develop-project-materials"',
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
assert.ok(appSource.includes("openIdeaProjectMaterialsPreviewModal"), "Idea-to-project-materials should preview before writing");
assert.ok(appSource.includes("confirm-write-idea-project-materials"), "Idea-to-project-materials should require confirmation");
assert.ok(appSource.includes("desktopApi.generateProjectMaterialsFromIdea"), "Idea-to-project-materials should call the desktop bridge");
assert.ok(appSource.includes("desktopApi.saveProjectMaterial"), "Confirmed idea materials should reuse project material saving");

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

console.log("Agent UI integration test passed");
