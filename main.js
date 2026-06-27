const path = require("node:path");
const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const fs = require("node:fs/promises");
const { TextDecoder } = require("node:util");
const { createProjectManager } = require("./project-manager");

const isMac = process.platform === "darwin";
const LIBRARY_DIRNAME = "jian-ji-library-v2";
const LIBRARY_STATE_FILE = "library-state.json";
const AI_SETTINGS_FILE = "ai-settings.json";
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

  let closeAfterFlush = false;
  let closeFlushTimer = null;
  const continueClose = () => {
    if (closeAfterFlush || window.isDestroyed()) return;
    closeAfterFlush = true;
    if (closeFlushTimer) clearTimeout(closeFlushTimer);
    window.close();
  };
  const handleCloseReady = (event) => {
    if (event.sender !== window.webContents) return;
    continueClose();
  };

  ipcMain.on("app:close-ready", handleCloseReady);
  window.on("close", (event) => {
    if (closeAfterFlush || window.webContents.isDestroyed()) return;
    event.preventDefault();
    window.webContents.send("app:prepare-close");
    closeFlushTimer = setTimeout(continueClose, 1500);
  });
  window.on("closed", () => {
    if (closeFlushTimer) clearTimeout(closeFlushTimer);
    ipcMain.off("app:close-ready", handleCloseReady);
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
          accelerator: "CmdOrCtrl+Shift+S",
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

function getAiSettingsPath() {
  return path.join(getLibraryRoot(), AI_SETTINGS_FILE);
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

function getWorkTextsDirectory(workId) {
  return path.join(getWorkDirectory(workId), "texts");
}

function getProjectManager() {
  return createProjectManager({ projectsRoot: getWorksRoot() });
}

async function ensureLibraryRoot() {
  const root = getLibraryRoot();
  await fs.mkdir(root, { recursive: true });
  await fs.mkdir(getWorksRoot(), { recursive: true });
  return root;
}

function createIdMap(items, prefix) {
  const used = new Set();
  const map = new Map();
  (items || []).forEach((item) => {
    const raw = String(item?.id ?? "");
    const base = sanitizeEntityId(raw, prefix);
    let id = base;
    let suffix = 2;
    while (used.has(id)) {
      id = `${base}-${suffix}`;
      suffix += 1;
    }
    used.add(id);
    map.set(raw, id);
  });
  return map;
}

function mapId(idMap, value, prefix) {
  const raw = String(value ?? "");
  return idMap?.get(raw) ?? sanitizeEntityId(raw, prefix);
}

function sanitizeEntityId(value, prefix) {
  const raw = String(value ?? "").trim();
  const normalized = raw
    .replace(/[^A-Za-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return normalized || `${prefix}-${shortHash(raw || prefix)}`;
}

function shortHash(value) {
  let hash = 5381;
  for (const char of String(value)) {
    hash = ((hash << 5) + hash + char.charCodeAt(0)) >>> 0;
  }
  return hash.toString(36);
}

function normalizeFolder(folder, folderIdMap = null) {
  return {
    id: mapId(folderIdMap, folder.id, "folder"),
    name: String(folder.name || "未命名文件夹"),
    parentId: folder.parentId == null ? null : mapId(folderIdMap, folder.parentId, "folder"),
    createdAt: String(folder.createdAt || new Date().toISOString()),
  };
}

function normalizeWork(work, folderIdMap = null, workIdMap = null, chapterIdMap = null) {
  return {
    id: mapId(workIdMap, work.id, "work"),
    title: String(work.title || "未命名作品"),
    description: String(work.description || ""),
    folderId: work.folderId == null ? null : mapId(folderIdMap, work.folderId, "folder"),
    chapterIds: Array.isArray(work.chapterIds) ? work.chapterIds.map((id) => mapId(chapterIdMap, id, "chapter")) : [],
    updatedAt: String(work.updatedAt || new Date().toISOString()),
    createdAt: String(work.createdAt || new Date().toISOString()),
    lastOpenedChapterId:
      work.lastOpenedChapterId == null ? null : mapId(chapterIdMap, work.lastOpenedChapterId, "chapter"),
  };
}

function normalizeChapter(chapter, workIdMap = null, chapterIdMap = null) {
  const content = String(chapter.content || "");
  return {
    id: mapId(chapterIdMap, chapter.id, "chapter"),
    workId: mapId(workIdMap, chapter.workId, "work"),
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

function normalizeInspirationItem(item, fallbackWorkId = null, workIdMap = null) {
  const workId = mapId(workIdMap, item?.workId || fallbackWorkId || "", "work");
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
    id: sanitizeEntityId(item?.id || `inspiration-${Date.now()}`, "inspiration"),
    workId,
    chapterId: item?.chapterId == null ? null : sanitizeEntityId(item.chapterId, "chapter"),
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

function normalizeInspirations(inspirations, works, activeWorkId = null, workIdMap = null) {
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
      const next = normalizeInspirationItem(item, fallbackWorkId, workIdMap);
      if (!next || !workIds.has(next.workId)) return;
      if (!normalized.itemsByWork[next.workId]) normalized.itemsByWork[next.workId] = [];
      normalized.itemsByWork[next.workId].push(next);
    });
  }

  Object.entries(sourceByWork).forEach(([workId, items]) => {
    const normalizedWorkId = mapId(workIdMap, workId, "work");
    if (!Array.isArray(items) || !workIds.has(normalizedWorkId)) return;
    normalized.itemsByWork[normalizedWorkId] = items
      .map((item) => normalizeInspirationItem(item, normalizedWorkId, workIdMap))
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
  const folderIdMap = createIdMap(Array.isArray(state.folders) ? state.folders : [], "folder");
  const workIdMap = createIdMap(Array.isArray(state.works) ? state.works : [], "work");
  const chapterIdMap = createIdMap(Array.isArray(state.chapters) ? state.chapters : [], "chapter");
  const folders = Array.isArray(state.folders) ? state.folders.map((folder) => normalizeFolder(folder, folderIdMap)) : [];
  const folderIds = new Set(folders.map((folder) => folder.id));
  folders.forEach((folder) => {
    if (folder.parentId != null && !folderIds.has(folder.parentId)) folder.parentId = null;
  });
  const chapters = Array.isArray(state.chapters)
    ? state.chapters.map((chapter) => normalizeChapter(chapter, workIdMap, chapterIdMap))
    : [];
  const chapterMap = new Map(chapters.map((chapter) => [chapter.id, chapter]));
  const works = Array.isArray(state.works)
    ? state.works.map((work) => {
        const normalized = normalizeWork(work, folderIdMap, workIdMap, chapterIdMap);
        normalized.chapterIds = normalized.chapterIds.filter((chapterId) => chapterMap.has(chapterId));
        if (!normalized.lastOpenedChapterId || !chapterMap.has(normalized.lastOpenedChapterId)) {
          normalized.lastOpenedChapterId = normalized.chapterIds[0] ?? null;
        }
        if (normalized.folderId != null && !folderIds.has(normalized.folderId)) normalized.folderId = null;
        return normalized;
      })
    : [];

  const workIds = new Set(works.map((work) => work.id));
  const filteredChapters = chapters.filter((chapter) => workIds.has(chapter.workId));
  const activeWorkId = state.activeWorkId == null ? null : mapId(workIdMap, state.activeWorkId, "work");
  const inspirations = normalizeInspirations(state.inspirations, works, activeWorkId, workIdMap);
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
      await getProjectManager().ensureProject(work.id);
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

function sanitizeFileName(value) {
  const raw = String(value ?? "").trim();
  const normalized = raw
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  return normalized || "imported-text.txt";
}

const AI_PROVIDER_DEFAULTS = {
  openai: "gpt-5.5",
  claude: "claude-sonnet-4-5",
  deepseek: "deepseek-v4-flash",
  custom: "",
};
const AI_PROVIDER_BASE_URLS = {
  openai: "https://api.openai.com/v1",
  claude: "https://api.anthropic.com/v1",
  deepseek: "https://api.deepseek.com",
  custom: "",
};
const AI_REQUEST_TIMEOUT_MS = 60000;
const AI_MAX_OUTPUT_TOKENS = 4096;

function normalizeAiSettings(value) {
  const source = value && typeof value === "object" ? value : {};
  const provider = Object.hasOwn(AI_PROVIDER_DEFAULTS, source.provider) ? source.provider : "openai";
  const model = String(source.model ?? AI_PROVIDER_DEFAULTS[provider] ?? "").trim().slice(0, 120);
  const apiKey = String(source.apiKey ?? "").trim().slice(0, 4096);
  const baseUrl = String(source.baseUrl ?? "").trim().slice(0, 300);
  return {
    provider,
    model,
    apiKey,
    baseUrl,
    updatedAt: String(source.updatedAt || ""),
  };
}

function getPublicAiSettings(settings) {
  const normalized = normalizeAiSettings(settings);
  return {
    provider: normalized.provider,
    model: normalized.model,
    baseUrl: normalized.baseUrl,
    hasApiKey: Boolean(normalized.apiKey),
    apiKeyPreview: normalized.apiKey ? `...${normalized.apiKey.slice(-4)}` : "",
    updatedAt: normalized.updatedAt,
  };
}

function mergeAiSettingsForSave(existingSettings, nextSettings, updatedAt = new Date().toISOString()) {
  const existing = normalizeAiSettings(existingSettings);
  const next = normalizeAiSettings(nextSettings);
  return {
    ...next,
    apiKey: next.apiKey || existing.apiKey,
    updatedAt,
  };
}

async function loadAiSettings() {
  await ensureLibraryRoot();
  try {
    const raw = await fs.readFile(getAiSettingsPath(), "utf8");
    return normalizeAiSettings(JSON.parse(raw));
  } catch (error) {
    if (error.code === "ENOENT") return normalizeAiSettings({});
    throw error;
  }
}

async function saveAiSettings(payload) {
  await ensureLibraryRoot();
  const existing = await loadAiSettings();
  const settings = mergeAiSettingsForSave(existing, payload);
  await fs.writeFile(getAiSettingsPath(), JSON.stringify(settings, null, 2), "utf8");
  return settings;
}

function countReplacementCharacters(text) {
  return (String(text || "").match(/\uFFFD/g) || []).length;
}

function decodeTextBuffer(buffer) {
  const source = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer ?? []);
  const utf8Text = new TextDecoder("utf-8").decode(source);
  if (countReplacementCharacters(utf8Text) === 0) return utf8Text;

  const gbText = new TextDecoder("gb18030").decode(source);
  if (countReplacementCharacters(gbText) < countReplacementCharacters(utf8Text)) return gbText;
  return utf8Text;
}

function normalizeWritingAgentPayload(payload) {
  const source = payload && typeof payload === "object" ? payload : {};
  const chapter = source.chapter && typeof source.chapter === "object" ? source.chapter : {};
  const work = source.work && typeof source.work === "object" ? source.work : {};
  return {
    language: source.language === "en" ? "en" : "zh",
    work: {
      id: String(work.id || ""),
      title: String(work.title || ""),
    },
    chapter: {
      id: String(chapter.id || ""),
      title: String(chapter.title || ""),
      content: String(chapter.content || ""),
      outline: String(chapter.outline || ""),
      notes: String(chapter.notes || ""),
    },
  };
}

function createMockWritingAgentDraft(payload) {
  const normalized = normalizeWritingAgentPayload(payload);
  const { chapter, work, language } = normalized;
  const title = chapter.title.trim();
  const content = chapter.content.trim();
  const outline = chapter.outline.trim();
  const notes = chapter.notes.trim();
  const source = content || outline || notes;

  if (language === "en") {
    if (!source) {
      return "Mock AI version\n\nAdd body text, outline notes, or chapter notes first. A real AI provider will use that context in a later phase.";
    }
    return [
      `Mock AI version${title ? ` for ${title}` : ""}`,
      work.title ? `Work: ${work.title}` : "",
      "",
      content || "No body text yet.",
      "",
      "Revision direction:",
      outline ? `- Follow the outline: ${outline}` : "- Preserve the current chapter direction.",
      notes ? `- Keep the chapter note in mind: ${notes}` : "- Tighten pacing and keep the scene focused.",
    ].filter((line, index, lines) => line || lines[index - 1]).join("\n");
  }

  if (!source) {
    return "模拟 AI 新版\n\n请先补充本章正文、大纲或备注。后续接入真实 AI 后，会基于这些上下文生成新版。";
  }
  return [
    `模拟 AI 新版${title ? `：${title}` : ""}`,
    work.title ? `作品：${work.title}` : "",
    "",
    content || "当前章节还没有正文。",
    "",
    "改写方向：",
    outline ? `- 参考本章大纲：${outline}` : "- 保留当前章节走向。",
    notes ? `- 结合章节备注：${notes}` : "- 收紧节奏，让场景推进更明确。",
  ].filter((line, index, lines) => line || lines[index - 1]).join("\n");
}

function buildWritingAgentPrompt(payload) {
  const normalized = normalizeWritingAgentPayload(payload);
  const { work, chapter, language } = normalized;
  const isEnglish = language === "en";
  return [
    isEnglish
      ? "Create a revised version of the current chapter draft. Preserve the author's intent, do not summarize, and return only the revised chapter text."
      : "请为当前章节生成一个改写后的新版。保留作者原意，不要总结，不要解释，只返回改写后的章节正文。",
    "",
    isEnglish ? `Work: ${work.title || "Untitled"}` : `作品：${work.title || "未命名作品"}`,
    isEnglish ? `Chapter: ${chapter.title || "Untitled chapter"}` : `章节：${chapter.title || "未命名章节"}`,
    "",
    isEnglish ? "Chapter notes:" : "章节备注：",
    chapter.notes || (isEnglish ? "(none)" : "（无）"),
    "",
    isEnglish ? "Chapter outline:" : "章节大纲：",
    chapter.outline || (isEnglish ? "(none)" : "（无）"),
    "",
    isEnglish ? "Current chapter draft:" : "当前章节正文：",
    chapter.content || (isEnglish ? "(empty)" : "（空）"),
  ].join("\n");
}

function buildOpenAiResponseRequest(settings, payload) {
  const normalizedSettings = normalizeAiSettings(settings);
  return {
    model: normalizedSettings.model || AI_PROVIDER_DEFAULTS.openai,
    instructions:
      normalizeWritingAgentPayload(payload).language === "en"
        ? "You are a careful fiction writing editor. Produce polished prose while preserving voice, continuity, and concrete story details."
        : "你是一名谨慎的小说写作编辑。请在保留作者声音、连续性和具体情节细节的前提下，生成更成熟的正文版本。",
    input: buildWritingAgentPrompt(payload),
  };
}

function getWritingAgentSystemPrompt(payload) {
  return normalizeWritingAgentPayload(payload).language === "en"
    ? "You are a careful fiction writing editor. Produce polished prose while preserving voice, continuity, and concrete story details. Return only the revised chapter text."
    : "你是一名谨慎的小说写作编辑。请在保留作者声音、连续性和具体情节细节的前提下，生成更成熟的正文版本。只返回改写后的章节正文。";
}

function extractOpenAiOutputText(responseBody) {
  if (typeof responseBody?.output_text === "string" && responseBody.output_text.trim()) return responseBody.output_text;
  if (!Array.isArray(responseBody?.output)) return "";
  return responseBody.output
    .flatMap((item) => (Array.isArray(item?.content) ? item.content : []))
    .map((content) => content?.text)
    .filter((text) => typeof text === "string" && text.trim())
    .join("\n");
}

function normalizeBaseUrl(value) {
  return String(value || "").trim().replace(/\/+$/g, "");
}

function buildProviderEndpoint(settings, pathSuffix) {
  const normalizedSettings = normalizeAiSettings(settings);
  const defaultBaseUrl = AI_PROVIDER_BASE_URLS[normalizedSettings.provider] || "";
  const baseUrl = normalizeBaseUrl(normalizedSettings.baseUrl || defaultBaseUrl);
  if (!baseUrl) {
    throw new Error("Base URL is required for this AI provider.");
  }
  return `${baseUrl}/${String(pathSuffix || "").replace(/^\/+/g, "")}`;
}

function buildOpenAiCompatibleChatRequest(settings, payload) {
  const normalizedSettings = normalizeAiSettings(settings);
  return {
    model: normalizedSettings.model || AI_PROVIDER_DEFAULTS[normalizedSettings.provider] || AI_PROVIDER_DEFAULTS.deepseek,
    messages: [
      { role: "system", content: getWritingAgentSystemPrompt(payload) },
      { role: "user", content: buildWritingAgentPrompt(payload) },
    ],
    stream: false,
  };
}

function extractChatCompletionOutputText(responseBody) {
  const message = responseBody?.choices?.[0]?.message;
  if (typeof message?.content === "string") return message.content;
  if (Array.isArray(message?.content)) {
    return message.content
      .map((part) => part?.text || part?.content)
      .filter((text) => typeof text === "string" && text.trim())
      .join("\n");
  }
  return "";
}

function buildClaudeMessagesRequest(settings, payload) {
  const normalizedSettings = normalizeAiSettings(settings);
  return {
    model: normalizedSettings.model || AI_PROVIDER_DEFAULTS.claude,
    max_tokens: AI_MAX_OUTPUT_TOKENS,
    system: getWritingAgentSystemPrompt(payload),
    messages: [{ role: "user", content: buildWritingAgentPrompt(payload) }],
  };
}

function extractClaudeOutputText(responseBody) {
  if (!Array.isArray(responseBody?.content)) return "";
  return responseBody.content
    .map((item) => item?.text)
    .filter((text) => typeof text === "string" && text.trim())
    .join("\n");
}

async function fetchJsonWithTimeout(url, options = {}, timeoutMs = AI_REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const body = await response.json().catch(() => ({}));
    return { response, body };
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("AI request timed out. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function getProviderErrorMessage(provider, body, status) {
  const errorValue = body?.error;
  return (
    errorValue?.message ||
    body?.message ||
    (typeof errorValue === "string" ? errorValue : "") ||
    `${provider} request failed with status ${status}`
  );
}

async function runOpenAiWritingAgent(settings, payload) {
  const normalizedSettings = normalizeAiSettings(settings);
  if (!normalizedSettings.apiKey) {
    throw new Error("OpenAI API key is not configured.");
  }
  const { response, body } = await fetchJsonWithTimeout(buildProviderEndpoint(normalizedSettings, "responses"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${normalizedSettings.apiKey}`,
    },
    body: JSON.stringify(buildOpenAiResponseRequest(normalizedSettings, payload)),
  });
  if (!response.ok) {
    const message = getProviderErrorMessage("OpenAI", body, response.status);
    throw new Error(message);
  }
  const content = extractOpenAiOutputText(body).trim();
  if (!content) throw new Error("OpenAI returned an empty response.");
  return {
    content,
    provider: "openai",
    generatedAt: new Date().toISOString(),
  };
}

async function runOpenAiCompatibleWritingAgent(settings, payload, providerLabel) {
  const normalizedSettings = normalizeAiSettings(settings);
  if (!normalizedSettings.apiKey) {
    throw new Error(`${providerLabel} API key is not configured.`);
  }
  const { response, body } = await fetchJsonWithTimeout(buildProviderEndpoint(normalizedSettings, "chat/completions"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${normalizedSettings.apiKey}`,
    },
    body: JSON.stringify(buildOpenAiCompatibleChatRequest(normalizedSettings, payload)),
  });
  if (!response.ok) {
    throw new Error(getProviderErrorMessage(providerLabel, body, response.status));
  }
  const content = extractChatCompletionOutputText(body).trim();
  if (!content) throw new Error(`${providerLabel} returned an empty response.`);
  return {
    content,
    provider: normalizedSettings.provider,
    generatedAt: new Date().toISOString(),
  };
}

async function runClaudeWritingAgent(settings, payload) {
  const normalizedSettings = normalizeAiSettings(settings);
  if (!normalizedSettings.apiKey) {
    throw new Error("Claude API key is not configured.");
  }
  const { response, body } = await fetchJsonWithTimeout(buildProviderEndpoint(normalizedSettings, "messages"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": normalizedSettings.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(buildClaudeMessagesRequest(normalizedSettings, payload)),
  });
  if (!response.ok) {
    throw new Error(getProviderErrorMessage("Claude", body, response.status));
  }
  const content = extractClaudeOutputText(body).trim();
  if (!content) throw new Error("Claude returned an empty response.");
  return {
    content,
    provider: "claude",
    generatedAt: new Date().toISOString(),
  };
}

async function ensureUniqueFilePath(directory, fileName) {
  const parsed = path.parse(fileName);
  let candidate = path.join(directory, fileName);
  let counter = 2;
  while (true) {
    try {
      await fs.access(candidate);
      candidate = path.join(directory, `${parsed.name}-${counter}${parsed.ext}`);
      counter += 1;
    } catch (error) {
      if (error.code === "ENOENT") return candidate;
      throw error;
    }
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
  const content = decodeTextBuffer(await fs.readFile(filePath));
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

ipcMain.handle("text:store-import", async (_event, payload) => {
  const sourcePath = String(payload?.sourcePath ?? "");
  const workId = String(payload?.workId ?? "").trim();
  const sourceName = sanitizeFileName(payload?.sourceName ?? path.basename(sourcePath));
  if (!sourcePath || !workId) {
    return { canceled: true, error: "Invalid import payload" };
  }

  await ensureLibraryRoot();
  const targetDirectory = getWorkTextsDirectory(workId);
  await fs.mkdir(targetDirectory, { recursive: true });
  const targetPath = await ensureUniqueFilePath(targetDirectory, sourceName);
  await fs.copyFile(sourcePath, targetPath);
  return { canceled: false, filePath: targetPath };
});

ipcMain.handle("app:getVersion", () => app.getVersion());

ipcMain.handle("ai:write", async (_event, payload) => {
  const normalized = normalizeWritingAgentPayload(payload);
  const settings = await loadAiSettings();
  if (settings.provider === "openai") {
    return runOpenAiWritingAgent(settings, normalized);
  }
  if (settings.provider === "claude") {
    return runClaudeWritingAgent(settings, normalized);
  }
  if (settings.provider === "deepseek") {
    return runOpenAiCompatibleWritingAgent(settings, normalized, "DeepSeek");
  }
  if (settings.provider === "custom") {
    return runOpenAiCompatibleWritingAgent(settings, normalized, "Custom AI provider");
  }
  throw new Error(`Unsupported AI provider: ${settings.provider}`);
});

ipcMain.handle("ai:settings:get", async () => getPublicAiSettings(await loadAiSettings()));

ipcMain.handle("ai:settings:save", async (_event, payload) => getPublicAiSettings(await saveAiSettings(payload)));

ipcMain.handle("project-materials:ensure", async (_event, workId) => getProjectManager().ensureProject(workId));

ipcMain.handle("project-materials:read", async (_event, workId) => getProjectManager().readProject(workId));

ipcMain.handle("project-materials:save", async (_event, payload) =>
  getProjectManager().saveProjectMaterial(payload?.workId, payload?.material, payload?.content),
);

ipcMain.handle("project-materials:list-chapters", async (_event, workId) => getProjectManager().listProjectChapters(workId));

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
