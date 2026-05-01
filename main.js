const path = require("node:path");
const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const fs = require("node:fs/promises");

const isMac = process.platform === "darwin";
const LIBRARY_DIRNAME = "jian-ji-library-v2";
const LIBRARY_STATE_FILE = "library-state.json";
const WORKS_DIRNAME = "works";
const WORK_INSPIRATIONS_FILE = "inspirations.json";

function createWindow() {
  const version = app.getVersion();
  const window = new BrowserWindow({
    width: 1520,
    height: 980,
    minWidth: 1160,
    minHeight: 760,
    backgroundColor: "#f4efe7",
    title: `简纪 ${version}`,
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

function getLibraryRoot() {
  return path.join(app.getPath("userData"), LIBRARY_DIRNAME);
}

function getLibraryStatePath() {
  return path.join(getLibraryRoot(), LIBRARY_STATE_FILE);
}

function getWorksRoot() {
  return path.join(getLibraryRoot(), WORKS_DIRNAME);
}

function getWorkDirectory(workId) {
  return path.join(getWorksRoot(), String(workId));
}

function getWorkInspirationsPath(workId) {
  return path.join(getWorkDirectory(workId), WORK_INSPIRATIONS_FILE);
}

async function ensureLibraryRoot() {
  const root = getLibraryRoot();
  await fs.mkdir(root, { recursive: true });
  await fs.mkdir(getWorksRoot(), { recursive: true });
  return root;
}

function normalizeFolder(folder) {
  return {
    id: String(folder.id),
    name: String(folder.name || "未命名文件夹"),
    parentId: folder.parentId == null ? null : String(folder.parentId),
    createdAt: String(folder.createdAt || new Date().toISOString()),
  };
}

function normalizeWork(work) {
  return {
    id: String(work.id),
    title: String(work.title || "未命名作品"),
    description: String(work.description || ""),
    folderId: work.folderId == null ? null : String(work.folderId),
    chapterIds: Array.isArray(work.chapterIds) ? work.chapterIds.map((id) => String(id)) : [],
    updatedAt: String(work.updatedAt || new Date().toISOString()),
    createdAt: String(work.createdAt || new Date().toISOString()),
    lastOpenedChapterId: work.lastOpenedChapterId == null ? null : String(work.lastOpenedChapterId),
  };
}

function normalizeChapter(chapter) {
  const content = String(chapter.content || "");
  return {
    id: String(chapter.id),
    workId: String(chapter.workId),
    title: String(chapter.title || "未命名章节"),
    content,
    savedContent: String(chapter.savedContent ?? content),
    savedOutline: String(chapter.savedOutline ?? chapter.outline ?? ""),
    notes: String(chapter.notes || ""),
    bookmarks: Array.isArray(chapter.bookmarks) ? chapter.bookmarks.map((item) => String(item)) : [],
    wordGoal: Number(chapter.wordGoal) || 2000,
    outline: String(chapter.outline || ""),
    wordCount: Number(chapter.wordCount) || countWords(content),
    updatedAt: String(chapter.updatedAt || new Date().toISOString()),
    createdAt: String(chapter.createdAt || new Date().toISOString()),
    dirty: Boolean(chapter.dirty),
    saveStatus: String(chapter.saveStatus || "已保存"),
    saveTime: String(chapter.saveTime || "刚刚"),
    versions: Array.isArray(chapter.versions) ? chapter.versions : [],
    history: {
      undo: Array.isArray(chapter.history?.undo) ? chapter.history.undo : [],
      redo: Array.isArray(chapter.history?.redo) ? chapter.history.redo : [],
    },
  };
}

function countWords(text) {
  const source = String(text).trim();
  if (!source) return 0;
  const cjkCount = (source.match(/[\u3400-\u9fff]/g) || []).length;
  const latinCount = source
    .replace(/[\u3400-\u9fff]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return cjkCount + latinCount;
}

function normalizeInspirationItem(item, fallbackWorkId = null) {
  const workId = String(item?.workId || fallbackWorkId || "").trim();
  const content = String(item?.content ?? item?.text ?? "").trim();
  if (!workId || !content) return null;
  const categories = Array.isArray(item?.categories)
    ? item.categories.map((tag) => String(tag).trim()).filter(Boolean)
    : item?.category
      ? [String(item.category).trim()]
      : ["待补充"];
  const primaryCategory = categories[0] || "待补充";
  const createdAt = normalizeIsoDate(item?.createdAt);
  return {
    id: String(item?.id || `inspiration-${Date.now()}`),
    workId,
    chapterId: item?.chapterId == null ? null : String(item.chapterId),
    content,
    categories,
    category: primaryCategory,
    isFavorite: Boolean(item?.isFavorite ?? item?.favorite),
    isPinned: Boolean(item?.isPinned ?? item?.pinned),
    createdAt,
    updatedAt: normalizeIsoDate(item?.updatedAt, createdAt),
  };
}

function normalizeIsoDate(value, fallback = new Date().toISOString()) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
}

function normalizeInspirations(inspirations, works, activeWorkId = null) {
  const normalized = {
    categoryOrder: Array.isArray(inspirations?.categoryOrder)
      ? inspirations.categoryOrder.map((item) => String(item).trim()).filter(Boolean)
      : [],
    itemsByWork: {},
  };
  const workIds = new Set((works || []).map((work) => work.id));
  const fallbackWorkId = activeWorkId || works?.[0]?.id || null;
  const sourceByWork =
    inspirations && typeof inspirations.itemsByWork === "object" && inspirations.itemsByWork
      ? inspirations.itemsByWork
      : {};

  if (Array.isArray(inspirations?.items)) {
    inspirations.items.forEach((item) => {
      const next = normalizeInspirationItem(item, fallbackWorkId);
      if (!next || !workIds.has(next.workId)) return;
      if (!normalized.itemsByWork[next.workId]) normalized.itemsByWork[next.workId] = [];
      normalized.itemsByWork[next.workId].push(next);
    });
  }

  Object.entries(sourceByWork).forEach(([workId, items]) => {
    if (!Array.isArray(items) || !workIds.has(workId)) return;
    normalized.itemsByWork[workId] = items
      .map((item) => normalizeInspirationItem(item, workId))
      .filter(Boolean)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  });

  return normalized;
}

function migrateLegacyWorks(legacyWorks) {
  const folders = [];
  const works = [];
  const chapters = [];
  const now = new Date().toISOString();

  for (const legacyWork of legacyWorks || []) {
    const work = normalizeWork({
      id: legacyWork.id,
      title: legacyWork.title,
      description: legacyWork.description,
      folderId: null,
      chapterIds: (legacyWork.chapters || []).map((chapter) => chapter.id),
      updatedAt: now,
      createdAt: now,
      lastOpenedChapterId: legacyWork.chapters?.[0]?.id ?? null,
    });
    works.push(work);

    for (const legacyChapter of legacyWork.chapters || []) {
      chapters.push(
        normalizeChapter({
          ...legacyChapter,
          workId: work.id,
          updatedAt: now,
          createdAt: now,
          wordCount: countWords(legacyChapter.content || ""),
        }),
      );
    }
  }

  return { folders, works, chapters };
}

function normalizeLibraryState(payload) {
  if (Array.isArray(payload)) {
    const legacy = migrateLegacyWorks(payload);
    return {
      ...legacy,
      inspirations: { categoryOrder: [], itemsByWork: {} },
    };
  }

  const state = payload && typeof payload === "object" ? payload : {};
  const folders = Array.isArray(state.folders) ? state.folders.map(normalizeFolder) : [];
  const chapters = Array.isArray(state.chapters) ? state.chapters.map(normalizeChapter) : [];
  const chapterMap = new Map(chapters.map((chapter) => [chapter.id, chapter]));
  const works = Array.isArray(state.works)
    ? state.works.map((work) => {
        const normalized = normalizeWork(work);
        normalized.chapterIds = normalized.chapterIds.filter((chapterId) => chapterMap.has(chapterId));
        if (!normalized.lastOpenedChapterId || !chapterMap.has(normalized.lastOpenedChapterId)) {
          normalized.lastOpenedChapterId = normalized.chapterIds[0] ?? null;
        }
        return normalized;
      })
    : [];

  const workIds = new Set(works.map((work) => work.id));
  const filteredChapters = chapters.filter((chapter) => workIds.has(chapter.workId));
  const inspirations = normalizeInspirations(state.inspirations, works, state.activeWorkId);
  return { folders, works, chapters: filteredChapters, inspirations };
}

async function saveLibrary(libraryPayload) {
  await ensureLibraryRoot();
  const library = normalizeLibraryState(libraryPayload);
  await fs.writeFile(
    getLibraryStatePath(),
    JSON.stringify(
      {
        folders: library.folders,
        works: library.works,
        chapters: library.chapters,
        inspirations: { categoryOrder: library.inspirations.categoryOrder },
      },
      null,
      2,
    ),
    "utf8",
  );

  const activeWorkIds = new Set(library.works.map((work) => work.id));
  await Promise.all(
    library.works.map(async (work) => {
      await fs.mkdir(getWorkDirectory(work.id), { recursive: true });
      await fs.writeFile(
        getWorkInspirationsPath(work.id),
        JSON.stringify(library.inspirations.itemsByWork[work.id] ?? [], null, 2),
        "utf8",
      );
    }),
  );

  const workDirs = await fs.readdir(getWorksRoot(), { withFileTypes: true });
  await Promise.all(
    workDirs
      .filter((entry) => entry.isDirectory() && !activeWorkIds.has(entry.name))
      .map((entry) => fs.rm(getWorkDirectory(entry.name), { recursive: true, force: true })),
  );
}

async function loadLibrary() {
  await ensureLibraryRoot();
  try {
    const raw = await fs.readFile(getLibraryStatePath(), "utf8");
    const library = normalizeLibraryState(JSON.parse(raw));
    await Promise.all(
      library.works.map(async (work) => {
        try {
          const content = await fs.readFile(getWorkInspirationsPath(work.id), "utf8");
          const items = JSON.parse(content);
          library.inspirations.itemsByWork[work.id] = Array.isArray(items)
            ? items.map((item) => normalizeInspirationItem(item, work.id)).filter(Boolean)
            : [];
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
          library.inspirations.itemsByWork[work.id] = [];
        }
      }),
    );
    return library;
  } catch (error) {
    if (error.code === "ENOENT") {
      return {
        folders: [],
        works: [],
        chapters: [],
        inspirations: { categoryOrder: [], itemsByWork: {} },
      };
    }
    throw error;
  }
}

ipcMain.handle("project:save", async (_event, payload) => {
  const result = await dialog.showSaveDialog({
    title: "导出简纪项目",
    defaultPath: payload.defaultName,
    filters: [{ name: "简纪项目", extensions: ["json"] }],
  });

  if (result.canceled || !result.filePath) return result;
  await fs.writeFile(result.filePath, payload.content, "utf8");
  return result;
});

ipcMain.handle("project:open", async () => {
  const result = await dialog.showOpenDialog({
    title: "导入简纪项目",
    properties: ["openFile"],
    filters: [{ name: "简纪项目", extensions: ["json"] }],
  });

  if (result.canceled || !result.filePaths[0]) return result;
  const filePath = result.filePaths[0];
  const content = await fs.readFile(filePath, "utf8");
  return { canceled: false, filePath, content };
});

ipcMain.handle("text:open", async () => {
  const result = await dialog.showOpenDialog({
    title: "Import Text Document",
    properties: ["openFile"],
    filters: [{ name: "Text Document", extensions: ["txt"] }],
  });

  if (result.canceled || !result.filePaths[0]) return result;
  const filePath = result.filePaths[0];
  const content = await fs.readFile(filePath, "utf8");
  return { canceled: false, filePath, content };
});

ipcMain.handle("text:save", async (_event, payload) => {
  const result = await dialog.showSaveDialog({
    title: "Export Text Document",
    defaultPath: payload.defaultName,
    filters: [{ name: "Text Document", extensions: ["txt"] }],
  });

  if (result.canceled || !result.filePath) return result;
  await fs.writeFile(result.filePath, payload.content, "utf8");
  return result;
});

ipcMain.handle("app:getVersion", () => app.getVersion());

ipcMain.handle("library:bootstrap", async (_event, seedLibrary) => {
  const library = await loadLibrary();
  if (
    library.folders.length > 0 ||
    library.works.length > 0 ||
    library.chapters.length > 0 ||
    Object.keys(library.inspirations?.itemsByWork ?? {}).length > 0
  ) {
    return library;
  }
  if (seedLibrary && typeof seedLibrary === "object") {
    await saveLibrary(seedLibrary);
    return loadLibrary();
  }
  return {
    folders: [],
    works: [],
    chapters: [],
    inspirations: { categoryOrder: [], itemsByWork: {} },
  };
});

ipcMain.handle("library:sync", async (_event, library) => {
  await saveLibrary(library);
  return loadLibrary();
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
