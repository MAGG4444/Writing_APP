const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("storyForgeDesktop", {
  getAppVersion: () => ipcRenderer.invoke("app:getVersion"),
  saveProjectFile: (payload) => ipcRenderer.invoke("project:save", payload),
  openProjectFile: () => ipcRenderer.invoke("project:open"),
  openTextFile: () => ipcRenderer.invoke("text:open"),
  saveTextFile: (payload) => ipcRenderer.invoke("text:save", payload),
  storeImportedTextFile: (payload) => ipcRenderer.invoke("text:store-import", payload),
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
