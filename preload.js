const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("storyForgeDesktop", {
  getAppVersion: () => ipcRenderer.invoke("app:getVersion"),
  saveProjectFile: (payload) => ipcRenderer.invoke("project:save", payload),
  openProjectFile: () => ipcRenderer.invoke("project:open"),
  openTextFile: () => ipcRenderer.invoke("text:open"),
  saveTextFile: (payload) => ipcRenderer.invoke("text:save", payload),
  storeImportedTextFile: (payload) => ipcRenderer.invoke("text:store-import", payload),
  runWritingAgent: (payload) => ipcRenderer.invoke("ai:write", payload),
  getAiSettings: () => ipcRenderer.invoke("ai:settings:get"),
  saveAiSettings: (payload) => ipcRenderer.invoke("ai:settings:save", payload),
  ensureProjectMaterials: (workId) => ipcRenderer.invoke("project-materials:ensure", workId),
  readProjectMaterials: (workId) => ipcRenderer.invoke("project-materials:read", workId),
  saveProjectMaterial: (payload) => ipcRenderer.invoke("project-materials:save", payload),
  listProjectMaterialChapters: (workId) => ipcRenderer.invoke("project-materials:list-chapters", workId),
  readProjectReport: (payload) => ipcRenderer.invoke("project-report:read", payload),
  loadMemory: (workId) => ipcRenderer.invoke("memory:load", workId),
  saveMemory: (payload) => ipcRenderer.invoke("memory:save", payload),
  updateChapterSummary: (payload) => ipcRenderer.invoke("memory:update-chapter-summary", payload),
  getMemoryContextForChapter: (payload) => ipcRenderer.invoke("memory:get-context-for-chapter", payload),
  readProjectContextTool: (projectId) => ipcRenderer.invoke("agent-tools:read-project-context", projectId),
  readChapterTool: (payload) => ipcRenderer.invoke("agent-tools:read-chapter", payload),
  saveChapterTool: (payload) => ipcRenderer.invoke("agent-tools:save-chapter", payload),
  listChaptersTool: (projectId) => ipcRenderer.invoke("agent-tools:list-chapters", projectId),
  searchProjectNotesTool: (payload) => ipcRenderer.invoke("agent-tools:search-project-notes", payload),
  updateMemoryTool: (payload) => ipcRenderer.invoke("agent-tools:update-memory", payload),
  getPreviousChapterSummariesTool: (payload) =>
    ipcRenderer.invoke("agent-tools:get-previous-chapter-summaries", payload),
  writeChapterWithNovelAgent: (payload) => ipcRenderer.invoke("novel-agent:write-chapter", payload),
  generateChapterOutline: (payload) => ipcRenderer.invoke("novel-agent:generate-outline", payload),
  summarizeCurrentChapter: (payload) => ipcRenderer.invoke("novel-agent:summarize-chapter", payload),
  rewriteSelectedText: (payload) => ipcRenderer.invoke("novel-agent:rewrite-text", payload),
  checkChapterConsistency: (payload) => ipcRenderer.invoke("novel-agent:consistency-check", payload),
  generateProjectMaterialsFromIdea: (payload) =>
    ipcRenderer.invoke("novel-agent:generate-project-materials-from-idea", payload),
  bootstrapLibrary: (seedWorks) => ipcRenderer.invoke("library:bootstrap", seedWorks),
  syncLibrary: (works) => ipcRenderer.invoke("library:sync", works),
  closeReady: () => ipcRenderer.send("app:close-ready"),
  onPrepareClose: (callback) => {
    ipcRenderer.on("app:prepare-close", () => callback());
  },
  onMenuAction: (callback) => {
    ipcRenderer.on("menu-action", (_event, action) => callback(action));
  },
});
