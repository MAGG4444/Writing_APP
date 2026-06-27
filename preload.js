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
