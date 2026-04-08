const STORAGE_KEY = "story-forge-state-v2";

const themes = {
  ember: {
    id: "ember",
    name: { zh: "琥珀手稿", en: "Ember Manuscript" },
    source: { zh: "Story Forge 内置主题", en: "Built-in Story Forge theme" },
    vars: {
      bg: "#f6efe6",
      bgAccent: "#ead9c8",
      surface: "rgba(255, 250, 244, 0.84)",
      surfaceStrong: "#fffaf5",
      sidebar: "rgba(255, 247, 239, 0.72)",
      text: "#2f231c",
      muted: "#706154",
      border: "rgba(87, 62, 42, 0.14)",
      accent: "#9f4328",
      accentStrong: "#7e321b",
      accentSoft: "rgba(159, 67, 40, 0.12)",
    },
    swatches: ["#f6efe6", "#ead9c8", "#9f4328", "#2f231c"],
  },
  catppuccinLatte: {
    id: "catppuccinLatte",
    name: { zh: "Catppuccin Latte", en: "Catppuccin Latte" },
    source: { zh: "基于 Catppuccin Palette", en: "Based on Catppuccin Palette" },
    vars: {
      bg: "#eff1f5",
      bgAccent: "#dce0e8",
      surface: "rgba(255, 255, 255, 0.78)",
      surfaceStrong: "#ffffff",
      sidebar: "rgba(220, 224, 232, 0.58)",
      text: "#4c4f69",
      muted: "#6c6f85",
      border: "rgba(76, 79, 105, 0.12)",
      accent: "#dc8a78",
      accentStrong: "#d20f39",
      accentSoft: "rgba(220, 138, 120, 0.14)",
    },
    swatches: ["#eff1f5", "#dce0e8", "#dc8a78", "#4c4f69"],
  },
  nord: {
    id: "nord",
    name: { zh: "Nord Frost", en: "Nord Frost" },
    source: { zh: "基于 Nord 配色", en: "Based on Nord colors" },
    vars: {
      bg: "#eceff4",
      bgAccent: "#d8dee9",
      surface: "rgba(255, 255, 255, 0.76)",
      surfaceStrong: "#ffffff",
      sidebar: "rgba(216, 222, 233, 0.7)",
      text: "#2e3440",
      muted: "#4c566a",
      border: "rgba(46, 52, 64, 0.12)",
      accent: "#5e81ac",
      accentStrong: "#4c6d95",
      accentSoft: "rgba(94, 129, 172, 0.14)",
    },
    swatches: ["#eceff4", "#d8dee9", "#5e81ac", "#2e3440"],
  },
  dracula: {
    id: "dracula",
    name: { zh: "Dracula Classic", en: "Dracula Classic" },
    source: { zh: "基于 Dracula Theme", en: "Based on Dracula Theme" },
    vars: {
      bg: "#282a36",
      bgAccent: "#44475a",
      surface: "rgba(52, 55, 70, 0.88)",
      surfaceStrong: "#343746",
      sidebar: "rgba(33, 34, 44, 0.9)",
      text: "#f8f8f2",
      muted: "#bd93f9",
      border: "rgba(248, 248, 242, 0.12)",
      accent: "#ff79c6",
      accentStrong: "#ff5555",
      accentSoft: "rgba(255, 121, 198, 0.18)",
    },
    swatches: ["#282a36", "#44475a", "#ff79c6", "#f8f8f2"],
  },
};

const translations = {
  zh: {
    appKicker: "本地写作工作台",
    appTitle: "Story Forge",
    appSubtitle: "底部三栏结构：作品存储、灵感存储、设置。",
    runtimeBrowser: "浏览器模式",
    runtimeDesktop: "桌面应用模式",
    exportProject: "导出项目",
    importProject: "导入项目",
    storageTab: "存储",
    storageMeta: "文件夹与作品",
    inspirationTab: "灵感存储",
    inspirationMeta: "对话式灵感流",
    settingsTab: "设置",
    settingsMeta: "主题与语言",
    storageKicker: "作品资源库",
    storageTitle: "文件夹与作品",
    newFolder: "新建文件夹",
    newWork: "新建作品",
    toolsKicker: "编辑功能",
    toolsTitle: "作品详情工具",
    workTitleLabel: "作品标题",
    editorLabel: "正文编辑器",
    emptyWork: "先选择一个作品，或新建文件夹与作品。",
    emptyTools: "右侧会显示当前作品的结构化编辑工具。",
    formattingLabel: "格式与写作规则",
    outlineLabel: "大纲页",
    detailedOutlineLabel: "详细大纲页",
    plotLabel: "Plot Pointers / 情节提示",
    tagsLabel: "标签",
    mindMapLabel: "关系与 Mind-map 备注",
    charactersLabel: "角色分析",
    inspirationKicker: "灵感对话流",
    inspirationTitle: "灵感存储",
    searchPlaceholder: "搜索灵感内容或分类",
    allCategories: "全部分类",
    newCategory: "新建分类",
    postPlaceholder: "把一条灵感记录在这里……",
    postButton: "发布灵感",
    uncategorized: "未分类",
    noPosts: "还没有匹配的灵感记录。",
    appearanceKicker: "外观",
    appearanceTitle: "颜色风格",
    languageKicker: "语言",
    languageTitle: "界面语言",
    themeSource:
      "主题候选包含内置方案，以及基于开源配色项目的方案：Catppuccin、Nord、Dracula。",
    languageZh: "中文",
    languageEn: "英文",
    folderCount: "作品数",
    deleteFolder: "删除文件夹",
    deleteWork: "删除作品",
    renameHint: "可直接点击文字进行修改",
    defaultFolder: "未命名文件夹",
    defaultWork: "未命名作品",
    defaultCategory: "新分类",
    prompts: {
      folder: "输入新文件夹名称",
      work: "输入新作品名称",
      category: "输入新分类名称",
    },
    postedAt: "发布于",
  },
  en: {
    appKicker: "Local Writing Studio",
    appTitle: "Story Forge",
    appSubtitle: "Three bottom tabs: storage, inspiration, and settings.",
    runtimeBrowser: "Browser Mode",
    runtimeDesktop: "Desktop App Mode",
    exportProject: "Export Project",
    importProject: "Import Project",
    storageTab: "Storage",
    storageMeta: "Folders and works",
    inspirationTab: "Inspiration",
    inspirationMeta: "Conversation feed",
    settingsTab: "Settings",
    settingsMeta: "Theme and language",
    storageKicker: "Project Library",
    storageTitle: "Folders and Works",
    newFolder: "New Folder",
    newWork: "New Work",
    toolsKicker: "Editing Tools",
    toolsTitle: "Work Detail Tools",
    workTitleLabel: "Work title",
    editorLabel: "Main editor",
    emptyWork: "Select a work first, or create a folder and a work.",
    emptyTools: "The structured writing tools for the current work appear here.",
    formattingLabel: "Formatting and writing rules",
    outlineLabel: "Outline page",
    detailedOutlineLabel: "Detailed outline page",
    plotLabel: "Plot pointers",
    tagsLabel: "Tags",
    mindMapLabel: "Mind-map and relationship notes",
    charactersLabel: "Character analysis",
    inspirationKicker: "Conversation Feed",
    inspirationTitle: "Inspiration Storage",
    searchPlaceholder: "Search inspiration text or categories",
    allCategories: "All categories",
    newCategory: "New Category",
    postPlaceholder: "Drop a new spark of inspiration here...",
    postButton: "Post Inspiration",
    uncategorized: "Uncategorized",
    noPosts: "No inspiration posts match the current filter.",
    appearanceKicker: "Appearance",
    appearanceTitle: "Color Styles",
    languageKicker: "Language",
    languageTitle: "App Language",
    themeSource:
      "Theme options include a built-in style plus presets based on open-source palette projects: Catppuccin, Nord, and Dracula.",
    languageZh: "Chinese",
    languageEn: "English",
    folderCount: "Works",
    deleteFolder: "Delete folder",
    deleteWork: "Delete work",
    renameHint: "You can edit names directly",
    defaultFolder: "Untitled Folder",
    defaultWork: "Untitled Work",
    defaultCategory: "New Category",
    prompts: {
      folder: "Enter a new folder name",
      work: "Enter a new work name",
      category: "Enter a new category name",
    },
    postedAt: "Posted",
  },
};

const seedState = {
  activeTab: "storage",
  settings: {
    theme: "ember",
    language: "zh",
  },
  storage: {
    activeFolderId: "folder-1",
    activeWorkId: "work-1",
    folders: [
      {
        id: "folder-1",
        name: "长篇项目",
      },
      {
        id: "folder-2",
        name: "角色实验",
      },
    ],
    works: [
      {
        id: "work-1",
        folderId: "folder-1",
        title: "玻璃果园",
        content:
          "第一章\n\nLena 回到果园，原本想尽快处理遗产问题离开，却听见温室深处传来不可能存在的音乐。",
        tools: {
          formatting: "第一人称与近景描写为主，关键线索第一次出现时加粗处理。",
          outline: "回乡 -> 异常声音 -> 家族压力 -> 决定调查",
          detailedOutline:
            "场景 1：到站，编辑催稿。\n场景 2：夜里回到果园。\n场景 3：发现隐藏钥匙。",
          plot: "核心悬念：是谁让果园拥有记忆？\n中段推进：兄长开始销毁旧记录。",
          tags: "家族秘密, 记忆, 修订第一轮",
          mindMap: "Lena -> Tomas：亲情与对立并存。\nLena -> 果园：被召回的继承关系。",
          characters:
            "Lena：逃离过去但不断回头。\nTomas：维护家业的代价越来越高。\nMara：推动真相曝光。",
        },
      },
      {
        id: "work-2",
        folderId: "folder-1",
        title: "城市夜航",
        content: "一部偏悬疑的都市故事草稿。",
        tools: {
          formatting: "短句与节奏优先。",
          outline: "失踪案 -> 错位线索 -> 夜间追踪",
          detailedOutline: "",
          plot: "",
          tags: "悬疑, 都市",
          mindMap: "",
          characters: "",
        },
      },
      {
        id: "work-3",
        folderId: "folder-2",
        title: "配角档案",
        content: "这里集中写配角的语气、动机和背景。",
        tools: {
          formatting: "",
          outline: "",
          detailedOutline: "",
          plot: "",
          tags: "角色",
          mindMap: "",
          characters: "为每个配角保留一个欲望、一个恐惧、一个矛盾。",
        },
      },
    ],
  },
  inspiration: {
    activeCategoryId: "all",
    search: "",
    categories: [
      { id: "cat-1", name: "场景" },
      { id: "cat-2", name: "对白" },
      { id: "cat-3", name: "设定" },
    ],
    posts: [
      {
        id: "post-1",
        categoryId: "cat-1",
        text: "如果开场不是到家，而是她先在火车站丢了一页手稿，节奏会更紧。",
        author: "author",
        createdAt: "2026-04-08 13:10",
      },
      {
        id: "post-2",
        categoryId: "cat-2",
        text: "“你不是回来继承果园的，你是回来替它作证的。”",
        author: "system",
        createdAt: "2026-04-08 13:12",
      },
    ],
  },
};

const toolbarActions = [
  { label: "H1", before: "# ", after: "" },
  { label: "H2", before: "## ", after: "" },
  { label: "B", before: "**", after: "**" },
  { label: "I", before: "_", after: "_" },
  { label: "•", before: "- ", after: "" },
  { label: ">", before: "> ", after: "" },
];

const state = loadState();

const ui = {
  bottomTabs: document.getElementById("bottom-tabs"),
  runtimeBadge: document.getElementById("runtime-badge"),
  exportButton: document.getElementById("export-button"),
  importButton: document.getElementById("import-button"),
  folderList: document.getElementById("folder-list"),
  newFolderButton: document.getElementById("new-folder-button"),
  newWorkButton: document.getElementById("new-work-button"),
  workEmpty: document.getElementById("work-empty"),
  workEditor: document.getElementById("work-editor"),
  workTitleInput: document.getElementById("work-title-input"),
  currentFolderChip: document.getElementById("current-folder-chip"),
  editorToolbar: document.getElementById("editor-toolbar"),
  workContentInput: document.getElementById("work-content-input"),
  toolFields: document.getElementById("tool-fields"),
  toolEmpty: document.getElementById("tool-empty"),
  toolFormatting: document.getElementById("tool-formatting"),
  toolOutline: document.getElementById("tool-outline"),
  toolDetailedOutline: document.getElementById("tool-detailed-outline"),
  toolPlot: document.getElementById("tool-plot"),
  toolTags: document.getElementById("tool-tags"),
  toolMindMap: document.getElementById("tool-mind-map"),
  toolCharacters: document.getElementById("tool-characters"),
  inspirationSearch: document.getElementById("inspiration-search"),
  categoryList: document.getElementById("category-list"),
  newCategoryButton: document.getElementById("new-category-button"),
  postList: document.getElementById("post-list"),
  postCategorySelect: document.getElementById("post-category-select"),
  postInput: document.getElementById("post-input"),
  postButton: document.getElementById("post-button"),
  themeGrid: document.getElementById("theme-grid"),
  languageOptions: document.getElementById("language-options"),
};

init();

function init() {
  document.documentElement.lang = state.settings.language === "zh" ? "zh-CN" : "en";
  applyTheme(state.settings.theme);
  renderStaticText();
  renderTabs();
  renderToolbar();
  bindEvents();
  renderActiveTab();
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return structuredClone(seedState);
    return mergeState(structuredClone(seedState), JSON.parse(saved));
  } catch (error) {
    console.error("Failed to load state", error);
    return structuredClone(seedState);
  }
}

function mergeState(base, incoming) {
  if (Array.isArray(base) || Array.isArray(incoming)) return incoming ?? base;
  const result = { ...base };
  Object.keys(incoming || {}).forEach((key) => {
    if (typeof incoming[key] === "object" && incoming[key] && typeof base[key] === "object" && base[key]) {
      result[key] = mergeState(base[key], incoming[key]);
    } else {
      result[key] = incoming[key];
    }
  });
  return result;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function t(key) {
  return translations[state.settings.language][key];
}

function renderStaticText() {
  text("app-kicker", t("appKicker"));
  text("app-title", t("appTitle"));
  text("app-subtitle", t("appSubtitle"));
  text("storage-kicker", t("storageKicker"));
  text("storage-title", t("storageTitle"));
  text("tools-kicker", t("toolsKicker"));
  text("tools-title", t("toolsTitle"));
  text("work-title-label", t("workTitleLabel"));
  text("editor-label", t("editorLabel"));
  text("tool-formatting-label", t("formattingLabel"));
  text("tool-outline-label", t("outlineLabel"));
  text("tool-detailed-outline-label", t("detailedOutlineLabel"));
  text("tool-plot-label", t("plotLabel"));
  text("tool-tags-label", t("tagsLabel"));
  text("tool-mind-map-label", t("mindMapLabel"));
  text("tool-characters-label", t("charactersLabel"));
  text("inspiration-kicker", t("inspirationKicker"));
  text("inspiration-title", t("inspirationTitle"));
  text("appearance-kicker", t("appearanceKicker"));
  text("appearance-title", t("appearanceTitle"));
  text("language-kicker", t("languageKicker"));
  text("language-title", t("languageTitle"));
  text("theme-source-note", t("themeSource"));
  ui.exportButton.textContent = t("exportProject");
  ui.importButton.textContent = t("importProject");
  ui.newFolderButton.textContent = t("newFolder");
  ui.newWorkButton.textContent = t("newWork");
  ui.newCategoryButton.textContent = t("newCategory");
  ui.postButton.textContent = t("postButton");
  ui.inspirationSearch.placeholder = t("searchPlaceholder");
  ui.postInput.placeholder = t("postPlaceholder");
  ui.runtimeBadge.textContent = window.storyForgeDesktop ? t("runtimeDesktop") : t("runtimeBrowser");
}

function renderTabs() {
  const tabs = [
    { id: "storage", label: t("storageTab"), meta: t("storageMeta") },
    { id: "inspiration", label: t("inspirationTab"), meta: t("inspirationMeta") },
    { id: "settings", label: t("settingsTab"), meta: t("settingsMeta") },
  ];

  ui.bottomTabs.innerHTML = "";
  tabs.forEach((tab) => {
    const button = document.createElement("button");
    button.className = `tab-button ${state.activeTab === tab.id ? "active" : ""}`;
    button.innerHTML = `<span><strong>${escapeHtml(tab.label)}</strong><small>${escapeHtml(
      tab.meta,
    )}</small></span><span>${state.activeTab === tab.id ? "●" : "○"}</span>`;
    button.addEventListener("click", () => {
      state.activeTab = tab.id;
      saveState();
      renderActiveTab();
      renderTabs();
    });
    ui.bottomTabs.appendChild(button);
  });
}

function renderActiveTab() {
  document.querySelectorAll(".tab-view").forEach((view) => {
    view.classList.toggle("active", view.dataset.tab === state.activeTab);
  });

  renderStorage();
  renderInspiration();
  renderSettings();
}

function renderStorage() {
  const activeFolder = getActiveFolder();
  const activeWork = getActiveWork();

  ui.folderList.innerHTML = "";

  state.storage.folders.forEach((folder) => {
    const works = state.storage.works.filter((work) => work.folderId === folder.id);
    const card = document.createElement("div");
    card.className = `folder-card ${folder.id === state.storage.activeFolderId ? "active" : ""}`;
    card.innerHTML = `
      <header>
        <div class="grow">
          <input data-folder-id="${folder.id}" class="folder-name-input" type="text" value="${escapeAttribute(
            folder.name,
          )}" />
          <small>${t("folderCount")}: ${works.length}</small>
        </div>
        <button class="ghost-button delete-folder" data-folder-id="${folder.id}">${escapeHtml(
          t("deleteFolder"),
        )}</button>
      </header>
      <div class="work-list">
        ${works
          .map(
            (work) => `
              <button class="work-row ${
                work.id === state.storage.activeWorkId ? "active" : ""
              }" data-work-id="${work.id}" data-folder-id="${folder.id}">
                <span>${escapeHtml(work.title)}</span>
                <small>${work.content.length}</small>
              </button>
            `,
          )
          .join("")}
      </div>
    `;
    ui.folderList.appendChild(card);
  });

  ui.folderList.querySelectorAll(".folder-name-input").forEach((input) => {
    input.addEventListener("input", (event) => {
      const folder = state.storage.folders.find((item) => item.id === event.target.dataset.folderId);
      folder.name = event.target.value;
      saveState();
    });
    input.addEventListener("blur", renderStorage);
    input.addEventListener("focus", () => {
      state.storage.activeFolderId = input.dataset.folderId;
      saveState();
      renderStorage();
    });
  });

  ui.folderList.querySelectorAll(".delete-folder").forEach((button) => {
    button.addEventListener("click", () => deleteFolder(button.dataset.folderId));
  });

  ui.folderList.querySelectorAll(".work-row").forEach((button) => {
    button.addEventListener("click", () => {
      state.storage.activeFolderId = button.dataset.folderId;
      state.storage.activeWorkId = button.dataset.workId;
      saveState();
      renderStorage();
    });
  });

  if (!activeWork) {
    ui.workEmpty.classList.remove("hidden");
    ui.workEditor.classList.add("hidden");
    ui.toolFields.classList.add("hidden");
    ui.toolEmpty.classList.remove("hidden");
    ui.workEmpty.textContent = t("emptyWork");
    ui.toolEmpty.textContent = t("emptyTools");
    return;
  }

  ui.workEmpty.classList.add("hidden");
  ui.workEditor.classList.remove("hidden");
  ui.toolFields.classList.remove("hidden");
  ui.toolEmpty.classList.add("hidden");

  ui.workTitleInput.value = activeWork.title;
  ui.currentFolderChip.textContent = activeFolder?.name ?? t("defaultFolder");
  ui.workContentInput.value = activeWork.content;
  ui.toolFormatting.value = activeWork.tools.formatting;
  ui.toolOutline.value = activeWork.tools.outline;
  ui.toolDetailedOutline.value = activeWork.tools.detailedOutline;
  ui.toolPlot.value = activeWork.tools.plot;
  ui.toolTags.value = activeWork.tools.tags;
  ui.toolMindMap.value = activeWork.tools.mindMap;
  ui.toolCharacters.value = activeWork.tools.characters;
}

function renderInspiration() {
  const activeCategoryId = state.inspiration.activeCategoryId;
  const categories = state.inspiration.categories;
  const posts = getFilteredPosts();
  ui.inspirationSearch.value = state.inspiration.search;

  ui.categoryList.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.className = `chip-button ${activeCategoryId === "all" ? "active" : ""}`;
  allButton.textContent = t("allCategories");
  allButton.addEventListener("click", () => {
    state.inspiration.activeCategoryId = "all";
    saveState();
    renderInspiration();
  });
  ui.categoryList.appendChild(allButton);

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `chip-button ${activeCategoryId === category.id ? "active" : ""}`;
    button.textContent = category.name;
    button.addEventListener("click", () => {
      state.inspiration.activeCategoryId = category.id;
      saveState();
      renderInspiration();
    });
    ui.categoryList.appendChild(button);
  });

  ui.postCategorySelect.innerHTML = `
    <option value="">${escapeHtml(t("uncategorized"))}</option>
    ${categories
      .map(
        (category) =>
          `<option value="${escapeAttribute(category.id)}">${escapeHtml(category.name)}</option>`,
      )
      .join("")}
  `;
  if (activeCategoryId !== "all" && categories.some((category) => category.id === activeCategoryId)) {
    ui.postCategorySelect.value = activeCategoryId;
  }

  ui.postList.innerHTML = "";
  if (posts.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = t("noPosts");
    ui.postList.appendChild(empty);
    return;
  }

  posts.forEach((post) => {
    const categoryName =
      categories.find((category) => category.id === post.categoryId)?.name ?? t("uncategorized");
    const card = document.createElement("article");
    card.className = `post-card ${post.author === "author" ? "mine" : ""}`;
    card.innerHTML = `
      <header>
        <strong>${escapeHtml(categoryName)}</strong>
        <time>${escapeHtml(post.createdAt)}</time>
      </header>
      <p>${escapeHtml(post.text)}</p>
    `;
    ui.postList.appendChild(card);
  });
}

function renderSettings() {
  ui.themeGrid.innerHTML = "";

  Object.values(themes).forEach((theme) => {
    const card = document.createElement("button");
    card.className = `theme-card ${state.settings.theme === theme.id ? "active" : ""}`;
    card.innerHTML = `
      <div class="theme-preview">
        <strong>${escapeHtml(theme.name[state.settings.language])}</strong>
        <div class="swatches">
          ${theme.swatches.map((swatch) => `<span class="swatch" style="background:${swatch}"></span>`).join("")}
        </div>
      </div>
      <p>${escapeHtml(theme.source[state.settings.language])}</p>
    `;
    card.addEventListener("click", () => {
      state.settings.theme = theme.id;
      applyTheme(theme.id);
      saveState();
      renderSettings();
      renderTabs();
      renderStaticText();
    });
    ui.themeGrid.appendChild(card);
  });

  ui.languageOptions.innerHTML = "";
  [
    { id: "zh", label: t("languageZh") },
    { id: "en", label: t("languageEn") },
  ].forEach((option) => {
    const card = document.createElement("button");
    card.className = `language-card ${state.settings.language === option.id ? "active" : ""}`;
    card.innerHTML = `<strong>${escapeHtml(option.label)}</strong><p>${escapeHtml(option.id.toUpperCase())}</p>`;
    card.addEventListener("click", () => {
      state.settings.language = option.id;
      document.documentElement.lang = option.id === "zh" ? "zh-CN" : "en";
      saveState();
      renderStaticText();
      renderTabs();
      renderActiveTab();
    });
    ui.languageOptions.appendChild(card);
  });
}

function bindEvents() {
  ui.exportButton.addEventListener("click", exportState);
  ui.importButton.addEventListener("click", importStateFromFile);
  ui.newFolderButton.addEventListener("click", createFolder);
  ui.newWorkButton.addEventListener("click", createWork);
  ui.newCategoryButton.addEventListener("click", createCategory);
  ui.postButton.addEventListener("click", createPost);

  ui.inspirationSearch.addEventListener("input", (event) => {
    state.inspiration.search = event.target.value;
    saveState();
    renderInspiration();
  });

  ui.workTitleInput.addEventListener("input", (event) => {
    const work = getActiveWork();
    if (!work) return;
    work.title = event.target.value;
    saveState();
  });
  ui.workTitleInput.addEventListener("blur", renderStorage);

  ui.workContentInput.addEventListener("input", (event) => {
    const work = getActiveWork();
    if (!work) return;
    work.content = event.target.value;
    saveState();
  });

  const toolBindings = [
    [ui.toolFormatting, "formatting"],
    [ui.toolOutline, "outline"],
    [ui.toolDetailedOutline, "detailedOutline"],
    [ui.toolPlot, "plot"],
    [ui.toolTags, "tags"],
    [ui.toolMindMap, "mindMap"],
    [ui.toolCharacters, "characters"],
  ];

  toolBindings.forEach(([element, key]) => {
    element.addEventListener("input", (event) => {
      const work = getActiveWork();
      if (!work) return;
      work.tools[key] = event.target.value;
      saveState();
    });
  });

  if (window.storyForgeDesktop?.onMenuAction) {
    window.storyForgeDesktop.onMenuAction((action) => {
      if (action === "export-project") exportState();
      if (action === "import-project") importFromDesktop();
      if (action === "reset-project") {
        Object.assign(state, structuredClone(seedState));
        document.documentElement.lang = "zh-CN";
        applyTheme(state.settings.theme);
        saveState();
        renderStaticText();
        renderTabs();
        renderActiveTab();
      }
    });
  }
}

function renderToolbar() {
  ui.editorToolbar.innerHTML = "";
  toolbarActions.forEach((action) => {
    const button = document.createElement("button");
    button.className = "toolbar-button";
    button.textContent = action.label;
    button.addEventListener("click", () => wrapSelection(action.before, action.after));
    ui.editorToolbar.appendChild(button);
  });
}

function wrapSelection(before, after) {
  const editor = ui.workContentInput;
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selected = editor.value.slice(start, end);
  const nextValue = editor.value.slice(0, start) + before + selected + after + editor.value.slice(end);
  editor.value = nextValue;
  editor.focus();
  editor.selectionStart = start + before.length;
  editor.selectionEnd = end + before.length;
  const work = getActiveWork();
  if (!work) return;
  work.content = nextValue;
  saveState();
  renderStorage();
}

function createFolder() {
  const name = prompt(t("prompts").folder, t("defaultFolder"));
  if (name === null) return;

  const folder = {
    id: uid("folder"),
    name: name.trim() || t("defaultFolder"),
  };

  state.storage.folders.push(folder);
  state.storage.activeFolderId = folder.id;
  saveState();
  renderStorage();
}

function createWork() {
  if (!state.storage.activeFolderId && state.storage.folders[0]) {
    state.storage.activeFolderId = state.storage.folders[0].id;
  }
  if (!state.storage.activeFolderId) {
    createFolder();
    if (!state.storage.activeFolderId) return;
  }

  const name = prompt(t("prompts").work, t("defaultWork"));
  if (name === null) return;

  const work = {
    id: uid("work"),
    folderId: state.storage.activeFolderId,
    title: name.trim() || t("defaultWork"),
    content: "",
    tools: {
      formatting: "",
      outline: "",
      detailedOutline: "",
      plot: "",
      tags: "",
      mindMap: "",
      characters: "",
    },
  };

  state.storage.works.push(work);
  state.storage.activeWorkId = work.id;
  saveState();
  renderStorage();
}

function deleteFolder(folderId) {
  const remainingFolders = state.storage.folders.filter((folder) => folder.id !== folderId);
  const removedWorks = state.storage.works.filter((work) => work.folderId === folderId).map((work) => work.id);
  state.storage.folders = remainingFolders;
  state.storage.works = state.storage.works.filter((work) => work.folderId !== folderId);

  if (state.storage.activeFolderId === folderId) {
    state.storage.activeFolderId = remainingFolders[0]?.id ?? null;
  }
  if (removedWorks.includes(state.storage.activeWorkId)) {
    state.storage.activeWorkId =
      state.storage.works.find((work) => work.folderId === state.storage.activeFolderId)?.id ?? null;
  }

  saveState();
  renderStorage();
}

function createCategory() {
  const name = prompt(t("prompts").category, t("defaultCategory"));
  if (name === null) return;

  const category = { id: uid("cat"), name: name.trim() || t("defaultCategory") };
  state.inspiration.categories.push(category);
  state.inspiration.activeCategoryId = category.id;
  saveState();
  renderInspiration();
}

function createPost() {
  const textValue = ui.postInput.value.trim();
  if (!textValue) return;

  state.inspiration.posts.push({
    id: uid("post"),
    categoryId: ui.postCategorySelect.value || null,
    text: textValue,
    author: "author",
    createdAt: formatTimestamp(new Date()),
  });

  ui.postInput.value = "";
  saveState();
  renderInspiration();
}

function getFilteredPosts() {
  const needle = state.inspiration.search.trim().toLowerCase();
  return state.inspiration.posts.filter((post) => {
    const category = state.inspiration.categories.find((item) => item.id === post.categoryId)?.name ?? "";
    const matchesCategory =
      state.inspiration.activeCategoryId === "all" || post.categoryId === state.inspiration.activeCategoryId;
    const matchesSearch =
      !needle ||
      post.text.toLowerCase().includes(needle) ||
      category.toLowerCase().includes(needle);
    return matchesCategory && matchesSearch;
  });
}

function getActiveFolder() {
  return state.storage.folders.find((folder) => folder.id === state.storage.activeFolderId) ?? null;
}

function getActiveWork() {
  return state.storage.works.find((work) => work.id === state.storage.activeWorkId) ?? null;
}

function applyTheme(themeId) {
  const theme = themes[themeId] ?? themes.ember;
  const root = document.documentElement;
  root.style.setProperty("--bg", theme.vars.bg);
  root.style.setProperty("--bg-accent", theme.vars.bgAccent);
  root.style.setProperty("--surface", theme.vars.surface);
  root.style.setProperty("--surface-strong", theme.vars.surfaceStrong);
  root.style.setProperty("--sidebar", theme.vars.sidebar);
  root.style.setProperty("--text", theme.vars.text);
  root.style.setProperty("--muted", theme.vars.muted);
  root.style.setProperty("--border", theme.vars.border);
  root.style.setProperty("--accent", theme.vars.accent);
  root.style.setProperty("--accent-strong", theme.vars.accentStrong);
  root.style.setProperty("--accent-soft", theme.vars.accentSoft);
}

async function exportState() {
  const content = JSON.stringify(state, null, 2);

  if (window.storyForgeDesktop?.saveProjectFile) {
    await window.storyForgeDesktop.saveProjectFile({
      defaultName: "story-forge-project.json",
      content,
    });
    return;
  }

  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "story-forge-project.json";
  link.click();
  URL.revokeObjectURL(url);
}

async function importStateFromFile() {
  if (window.storyForgeDesktop?.openProjectFile) {
    await importFromDesktop();
    return;
  }

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => loadImportedState(String(reader.result));
    reader.readAsText(file);
  });
  input.click();
}

async function importFromDesktop() {
  const result = await window.storyForgeDesktop.openProjectFile();
  if (result?.canceled || !result?.content) return;
  loadImportedState(result.content);
}

function loadImportedState(raw) {
  try {
    const imported = mergeState(structuredClone(seedState), JSON.parse(raw));
    Object.keys(state).forEach((key) => delete state[key]);
    Object.assign(state, imported);
    document.documentElement.lang = state.settings.language === "zh" ? "zh-CN" : "en";
    applyTheme(state.settings.theme);
    saveState();
    renderStaticText();
    renderTabs();
    renderActiveTab();
  } catch (error) {
    alert("Invalid JSON file.");
  }
}

function formatTimestamp(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function uid(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function text(id, value) {
  document.getElementById(id).textContent = value;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#96;");
}
