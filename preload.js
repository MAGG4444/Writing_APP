const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("storyForgeDesktop", {
  saveProjectFile: (payload) => ipcRenderer.invoke("project:save", payload),
  openProjectFile: () => ipcRenderer.invoke("project:open"),
  onMenuAction: (callback) => {
    ipcRenderer.on("menu-action", (_event, action) => callback(action));
  },
});
