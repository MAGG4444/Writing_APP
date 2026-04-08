const path = require("node:path");
const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const fs = require("node:fs/promises");

const isMac = process.platform === "darwin";

function createWindow() {
  const window = new BrowserWindow({
    width: 1520,
    height: 980,
    minWidth: 1160,
    minHeight: 760,
    backgroundColor: "#f4efe7",
    title: "Story Forge",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  window.loadFile(path.join(__dirname, "index.html"));
  buildMenu(window);
}

function buildMenu(window) {
  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [{ role: "about" }, { type: "separator" }, { role: "quit" }],
          },
        ]
      : []),
    {
      label: "File",
      submenu: [
        {
          label: "Import Project",
          accelerator: "CmdOrCtrl+O",
          click: () => sendMenuAction(window, "import-project"),
        },
        {
          label: "Export Project",
          accelerator: "CmdOrCtrl+S",
          click: () => sendMenuAction(window, "export-project"),
        },
        { type: "separator" },
        {
          label: "Reset Sample Project",
          click: () => sendMenuAction(window, "reset-project"),
        },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [{ role: "reload" }, { role: "togglefullscreen" }],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function sendMenuAction(window, action) {
  window.webContents.send("menu-action", action);
}

ipcMain.handle("project:save", async (_event, payload) => {
  const result = await dialog.showSaveDialog({
    title: "Export Story Forge Project",
    defaultPath: payload.defaultName,
    filters: [{ name: "Story Forge Project", extensions: ["json"] }],
  });

  if (result.canceled || !result.filePath) return result;

  await fs.writeFile(result.filePath, payload.content, "utf8");
  return result;
});

ipcMain.handle("project:open", async () => {
  const result = await dialog.showOpenDialog({
    title: "Import Story Forge Project",
    properties: ["openFile"],
    filters: [{ name: "Story Forge Project", extensions: ["json"] }],
  });

  if (result.canceled || !result.filePaths[0]) return result;

  const filePath = result.filePaths[0];
  const content = await fs.readFile(filePath, "utf8");
  return { canceled: false, filePath, content };
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
