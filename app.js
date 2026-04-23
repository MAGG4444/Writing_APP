const STORAGE_KEY = "jian-ji-workbench-v3";

const themePresets = [
  {
    id: "light",
    name: "浅色",
    palette: {
      bg: "#f6f3ee",
      panel: "rgba(255, 253, 250, 0.88)",
      panelStrong: "#ffffff",
      text: "#261d17",
      muted: "#76685d",
      line: "rgba(62, 43, 29, 0.12)",
      accent: "#a64b2a",
      accentSoft: "rgba(166, 75, 42, 0.12)",
    },
  },
  {
    id: "dark",
    name: "深色",
    palette: {
      bg: "#17171b",
      panel: "rgba(32, 32, 38, 0.92)",
      panelStrong: "#262730",
      text: "#f3f2ef",
      muted: "#aaa6a0",
      line: "rgba(255, 255, 255, 0.12)",
      accent: "#f28a5d",
      accentSoft: "rgba(242, 138, 93, 0.18)",
    },
  },
  {
    id: "eyeCare",
    name: "护眼",
    palette: {
      bg: "#eef3e4",
      panel: "rgba(248, 251, 241, 0.9)",
      panelStrong: "#ffffff",
      text: "#253021",
      muted: "#677063",
      line: "rgba(37, 48, 33, 0.12)",
      accent: "#598157",
      accentSoft: "rgba(89, 129, 87, 0.14)",
    },
  },
  {
    id: "cream",
    name: "米白",
    palette: {
      bg: "#f5eee3",
      panel: "rgba(253, 248, 241, 0.92)",
      panelStrong: "#fffdf8",
      text: "#302219",
      muted: "#857565",
      line: "rgba(48, 34, 25, 0.12)",
      accent: "#b67930",
      accentSoft: "rgba(182, 121, 48, 0.14)",
    },
  },
  {
    id: "ink",
    name: "墨黑",
    palette: {
      bg: "#101114",
      panel: "rgba(23, 25, 29, 0.94)",
      panelStrong: "#1c1f24",
      text: "#f2f2f0",
      muted: "#9ea2a8",
      line: "rgba(255, 255, 255, 0.1)",
      accent: "#6ea5ff",
      accentSoft: "rgba(110, 165, 255, 0.18)",
    },
  },
  {
    id: "mistBlue",
    name: "雾蓝",
    palette: {
      bg: "#eaf1f7",
      panel: "rgba(252, 254, 255, 0.9)",
      panelStrong: "#ffffff",
      text: "#1d2d3a",
      muted: "#637789",
      line: "rgba(29, 45, 58, 0.12)",
      accent: "#3f78b5",
      accentSoft: "rgba(63, 120, 181, 0.14)",
    },
  },
  {
    id: "pine",
    name: "松影",
    palette: {
      bg: "#e9f0eb",
      panel: "rgba(250, 253, 250, 0.9)",
      panelStrong: "#ffffff",
      text: "#21332a",
      muted: "#687b71",
      line: "rgba(33, 51, 42, 0.12)",
      accent: "#2f7a58",
      accentSoft: "rgba(47, 122, 88, 0.14)",
    },
  },
  {
    id: "roseDust",
    name: "玫瑰尘",
    palette: {
      bg: "#f6ecec",
      panel: "rgba(255, 250, 250, 0.92)",
      panelStrong: "#fffefe",
      text: "#382326",
      muted: "#8b6e74",
      line: "rgba(56, 35, 38, 0.12)",
      accent: "#c06b7b",
      accentSoft: "rgba(192, 107, 123, 0.14)",
    },
  },
  {
    id: "lavenderPaper",
    name: "薰衣纸",
    palette: {
      bg: "#f0edf7",
      panel: "rgba(252, 250, 255, 0.92)",
      panelStrong: "#ffffff",
      text: "#2d2540",
      muted: "#786f92",
      line: "rgba(45, 37, 64, 0.12)",
      accent: "#7b69b8",
      accentSoft: "rgba(123, 105, 184, 0.14)",
    },
  },
  {
    id: "amber",
    name: "琥珀",
    palette: {
      bg: "#f7efe2",
      panel: "rgba(255, 250, 243, 0.92)",
      panelStrong: "#fffdf8",
      text: "#352718",
      muted: "#8c7258",
      line: "rgba(53, 39, 24, 0.12)",
      accent: "#c9862f",
      accentSoft: "rgba(201, 134, 47, 0.15)",
    },
  },
  {
    id: "riverStone",
    name: "河石",
    palette: {
      bg: "#eef1f2",
      panel: "rgba(251, 252, 252, 0.92)",
      panelStrong: "#ffffff",
      text: "#283136",
      muted: "#708188",
      line: "rgba(40, 49, 54, 0.12)",
      accent: "#4d7a86",
      accentSoft: "rgba(77, 122, 134, 0.14)",
    },
  },
  {
    id: "mint",
    name: "薄荷",
    palette: {
      bg: "#e9f5ef",
      panel: "rgba(249, 254, 251, 0.92)",
      panelStrong: "#ffffff",
      text: "#20342d",
      muted: "#628175",
      line: "rgba(32, 52, 45, 0.12)",
      accent: "#36a37d",
      accentSoft: "rgba(54, 163, 125, 0.14)",
    },
  },
  {
    id: "nightSea",
    name: "夜海",
    palette: {
      bg: "#121b24",
      panel: "rgba(21, 31, 43, 0.94)",
      panelStrong: "#1a2734",
      text: "#edf4fb",
      muted: "#8da0b3",
      line: "rgba(255, 255, 255, 0.1)",
      accent: "#53a8d7",
      accentSoft: "rgba(83, 168, 215, 0.18)",
    },
  },
  {
    id: "graphite",
    name: "石墨",
    palette: {
      bg: "#18191d",
      panel: "rgba(30, 32, 37, 0.94)",
      panelStrong: "#24262c",
      text: "#f2f3f5",
      muted: "#a0a4ab",
      line: "rgba(255, 255, 255, 0.1)",
      accent: "#7c8aa5",
      accentSoft: "rgba(124, 138, 165, 0.18)",
    },
  },
  {
    id: "plumNight",
    name: "梅夜",
    palette: {
      bg: "#1b1620",
      panel: "rgba(34, 28, 42, 0.95)",
      panelStrong: "#2b2434",
      text: "#f4eff7",
      muted: "#aa9bb4",
      line: "rgba(255, 255, 255, 0.1)",
      accent: "#b27ad6",
      accentSoft: "rgba(178, 122, 214, 0.18)",
    },
  },
  {
    id: "forestNight",
    name: "林夜",
    palette: {
      bg: "#131b18",
      panel: "rgba(24, 34, 31, 0.95)",
      panelStrong: "#1e2925",
      text: "#eef5f1",
      muted: "#95a99d",
      line: "rgba(255, 255, 255, 0.1)",
      accent: "#5db287",
      accentSoft: "rgba(93, 178, 135, 0.18)",
    },
  },
  {
    id: "sunset",
    name: "晚霞",
    palette: {
      bg: "#f8ece6",
      panel: "rgba(255, 250, 247, 0.92)",
      panelStrong: "#fffdfb",
      text: "#3a241d",
      muted: "#946f62",
      line: "rgba(58, 36, 29, 0.12)",
      accent: "#d65f47",
      accentSoft: "rgba(214, 95, 71, 0.14)",
    },
  },
  {
    id: "sandstone",
    name: "砂岩",
    palette: {
      bg: "#f1ece3",
      panel: "rgba(252, 249, 243, 0.92)",
      panelStrong: "#fffdfa",
      text: "#332a21",
      muted: "#837568",
      line: "rgba(51, 42, 33, 0.12)",
      accent: "#a77a4c",
      accentSoft: "rgba(167, 122, 76, 0.14)",
    },
  },
  {
    id: "oceanGlass",
    name: "海玻璃",
    palette: {
      bg: "#e7f4f4",
      panel: "rgba(248, 254, 254, 0.92)",
      panelStrong: "#ffffff",
      text: "#1f3233",
      muted: "#668082",
      line: "rgba(31, 50, 51, 0.12)",
      accent: "#2f9ea3",
      accentSoft: "rgba(47, 158, 163, 0.14)",
    },
  },
  {
    id: "aurora",
    name: "极光",
    palette: {
      bg: "#eaf3f0",
      panel: "rgba(248, 254, 251, 0.92)",
      panelStrong: "#ffffff",
      text: "#20302f",
      muted: "#5f7a77",
      line: "rgba(32, 48, 47, 0.12)",
      accent: "#4d9db8",
      accentSoft: "rgba(77, 157, 184, 0.14)",
    },
  },
];

const fontChoices = [
  { id: "notoSansSC", name: "思源黑体 SC", family: '"Noto Sans SC", "PingFang SC", "Segoe UI", sans-serif' },
  { id: "notoSerifSC", name: "思源宋体 SC", family: '"Noto Serif SC", "Songti SC", serif' },
  { id: "notoSansMonoCJKsc", name: "思源等宽 SC", family: '"Noto Sans Mono CJK SC", "Noto Sans Mono", monospace' },
  { id: "maShanZheng", name: "马善政", family: '"Ma Shan Zheng", "Noto Serif SC", cursive' },
  { id: "longCang", name: "龙藏体", family: '"Long Cang", "Noto Serif SC", cursive' },
  { id: "liuJianMaoCao", name: "刘建毛草", family: '"Liu Jian Mao Cao", "Noto Serif SC", cursive' },
  { id: "zcoolKuaiLe", name: "站酷快乐体", family: '"ZCOOL KuaiLe", "Noto Sans SC", cursive' },
  { id: "zcoolQingKeHuangYou", name: "站酷庆科黄油体", family: '"ZCOOL QingKe HuangYou", "Noto Sans SC", sans-serif' },
  { id: "zcoolXiaoWei", name: "站酷小薇", family: '"ZCOOL XiaoWei", "Noto Serif SC", serif' },
  { id: "zhiMangXing", name: "知芒行书", family: '"Zhi Mang Xing", "Noto Serif SC", cursive' },
  { id: "sourceSans3", name: "Source Sans 3", family: '"Source Sans 3", "Noto Sans SC", sans-serif' },
  { id: "merriweather", name: "Merriweather", family: '"Merriweather", "Noto Serif SC", serif' },
  { id: "sourceSansSerif", name: "Source Sans 3 + 宋体", family: '"Source Sans 3", "Noto Serif SC", serif' },
  { id: "notoSansMerriweather", name: "思源黑体 + Merriweather", family: '"Noto Sans SC", "Merriweather", sans-serif' },
  { id: "merriweatherSans", name: "Merriweather + Source Sans 3", family: '"Merriweather", "Source Sans 3", serif' },
  { id: "openSans", name: "Open Sans", family: '"Open Sans", "Noto Sans SC", sans-serif' },
  { id: "montserrat", name: "Montserrat", family: '"Montserrat", "Noto Sans SC", sans-serif' },
  { id: "cantarell", name: "Cantarell", family: '"Cantarell", "Noto Sans SC", sans-serif' },
  { id: "adwaitaSans", name: "Adwaita Sans", family: '"Adwaita Sans", "Noto Sans SC", sans-serif' },
  { id: "sourceCodePro", name: "Source Code Pro", family: '"Source Code Pro", "Noto Sans Mono CJK SC", monospace' },
  { id: "adwaitaMono", name: "Adwaita Mono", family: '"Adwaita Mono", "Noto Sans Mono CJK SC", monospace' },
  { id: "liberationMono", name: "Liberation Mono", family: '"Liberation Mono", "Noto Sans Mono CJK SC", monospace' },
  { id: "notoSansMono", name: "Noto Sans Mono", family: '"Noto Sans Mono", "Noto Sans Mono CJK SC", monospace' },
  { id: "caladea", name: "Caladea", family: '"Caladea", "Noto Serif SC", serif' },
  { id: "carlito", name: "Carlito", family: '"Carlito", "Noto Sans SC", sans-serif' },
  { id: "stixTwoText", name: "STIX Two Text", family: '"STIX Two Text", "Noto Serif SC", serif' },
  { id: "liberationSerif", name: "Liberation Serif", family: '"Liberation Serif", "Noto Serif SC", serif' },
  { id: "liberationSans", name: "Liberation Sans", family: '"Liberation Sans", "Noto Sans SC", sans-serif' },
];

const inspirationCategories = ["all", "人物", "剧情", "对白", "设定", "场景", "待补充"];
const punctuationChoices = ["，", "。", "？", "！", "“”", "（）", "——", "……"];
const phraseChoices = ["转场提示", "冲突升级", "伏笔回收", "环境描写", "情绪推进"];

const DEFAULT_CHAPTER_TEMPLATE = {
  blank: {
    chapterTitle: "第一章",
    content: "",
    notes: "从这里开始写。",
    outline: "",
  },
  intro: {
    chapterTitle: "第一章：开场",
    content:
      "先写下这一幕的起点。\n\n人物在什么地方？他此刻最想解决的是什么？第一句应该把读者直接带进场景。",
    notes: "开篇目标：建立人物、地点和冲突。",
    outline: "1. 进入场景\n2. 抛出问题\n3. 留下继续读下去的动力",
  },
  outline: {
    chapterTitle: "第一章：大纲起笔",
    content: "场景一：\n\n场景二：\n\n场景三：",
    notes: "先按大纲写，再补足细节。",
    outline: "1. 开场\n2. 冲突升级\n3. 本章收束",
  },
};

const state = loadState();
const refs = {};
const desktopApi = window.storyForgeDesktop ?? null;
let autosaveTimer = null;
let focusTimer = null;
let suppressHistory = false;
let draggedChapterId = null;

init();

async function init() {
  ensureStateIntegrity();
  await bootstrapDesktopLibrary();
  document.getElementById("app").innerHTML = AppShell();
  collectRefs();
  bindEvents();
  hydrateEditor();
  updateAll();
}

function loadState() {
  const seed = createSeedState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    return deepMerge(seed, JSON.parse(raw));
  } catch (error) {
    console.error(error);
    return seed;
  }
}

function createSeedState() {
  const createdAt = "2026-04-07T20:00:00.000Z";
  const updatedAt = "2026-04-08T01:20:00.000Z";

  return {
    route: "library",
    activeFolderId: "folder-serial",
    activeTab: "writing",
    activeWorkId: "work-1",
    activeChapterId: "chapter-1",
    folders: [
      { id: "folder-serial", name: "长篇连载", parentId: null, createdAt },
      { id: "folder-short", name: "短篇练习", parentId: null, createdAt },
      { id: "folder-world", name: "世界观设定", parentId: null, createdAt },
      { id: "folder-archive", name: "已完结", parentId: null, createdAt },
      { id: "folder-world-port", name: "旧港资料", parentId: "folder-world", createdAt },
    ],
    works: [
      {
        id: "work-1",
        title: "雾海长歌",
        description: "长篇悬疑航海小说，围绕旧港与失踪航线展开。",
        folderId: "folder-serial",
        chapterIds: ["chapter-1", "chapter-2"],
        updatedAt,
        createdAt,
        lastOpenedChapterId: "chapter-1",
      },
      {
        id: "work-2",
        title: "星砂档案",
        description: "偏科幻的多线叙事项目，用于演示目录和编辑页跳转。",
        folderId: "folder-short",
        chapterIds: ["chapter-3"],
        updatedAt: "2026-04-07T23:11:00.000Z",
        createdAt,
        lastOpenedChapterId: "chapter-3",
      },
      {
        id: "work-3",
        title: "港务局口述史",
        description: "世界观补充文档，整理旧港职能、派系与口述记录。",
        folderId: "folder-world-port",
        chapterIds: ["chapter-4"],
        updatedAt: "2026-04-07T21:05:00.000Z",
        createdAt,
        lastOpenedChapterId: "chapter-4",
      },
      {
        id: "work-4",
        title: "未归档随笔",
        description: "放在根目录的零散灵感项目。",
        folderId: null,
        chapterIds: ["chapter-5"],
        updatedAt: "2026-04-06T14:08:00.000Z",
        createdAt,
        lastOpenedChapterId: "chapter-5",
      },
    ],
    chapters: [
      createSeedChapter({
        id: "chapter-1",
        workId: "work-1",
        title: "第一章：风从旧港吹来",
        content:
          "海风先撞上窗，再撞上她的名字。\n\n林序推开旧港旅馆的木门，雨水顺着伞骨滴落成一圈冷白。她知道自己回来得太晚了，但长街尽头那盏始终没有熄灭的灯，又像是在等她把故事重新写下去。\n\n她把箱子放在门边，先记下第一句：这座港口从不真正欢迎归来者。",
        notes: "本章任务：建立旧港氛围，放出“灯塔未熄”的悬念。",
        bookmarks: ["旧港入口", "旅馆灯", "第一句手稿"],
        wordGoal: 2500,
        outline: "1. 回港\n2. 旅馆旧灯\n3. 第一句手稿回归",
        updatedAt: "2026-04-08T01:20:00.000Z",
        createdAt,
        versions: [{ id: "version-1", label: "自动保存版本", time: "今天 20:12", content: "海风先撞上窗，再撞上她的名字。" }],
      }),
      createSeedChapter({
        id: "chapter-2",
        workId: "work-1",
        title: "第二章：灯塔后的回声",
        content: "码头封锁线升起的时候，灯塔的雾号只响了一次。\n\n她记下另一个问题：是谁比风更早知道她会回来？",
        notes: "推进封锁线和港务长线索。",
        bookmarks: ["封锁线", "雾号"],
        wordGoal: 2200,
        outline: "1. 码头封锁\n2. 港务长出现\n3. 灯塔雾号",
        updatedAt: "2026-04-07T23:45:00.000Z",
        createdAt,
      }),
      createSeedChapter({
        id: "chapter-3",
        workId: "work-2",
        title: "序章：第九观测站",
        content: "她在观测站的玻璃墙前，看见宇宙像一份尚未签收的报告。",
        notes: "序章负责抛出观测站事故。",
        bookmarks: ["观测站"],
        wordGoal: 1800,
        outline: "1. 观测站夜景\n2. 事故预警",
        updatedAt: "2026-04-07T22:11:00.000Z",
        createdAt,
      }),
      createSeedChapter({
        id: "chapter-4",
        workId: "work-3",
        title: "港务局职责沿革",
        content: "旧港的管理权在三次事故之后才真正集中到港务局。",
        notes: "作为设定资料，不必追求章节感。",
        bookmarks: [],
        wordGoal: 1200,
        outline: "1. 事故前\n2. 职能集中\n3. 派系冲突",
        updatedAt: "2026-04-07T21:05:00.000Z",
        createdAt,
      }),
      createSeedChapter({
        id: "chapter-5",
        workId: "work-4",
        title: "灵感草稿",
        content: "她在车站捡起的不是纸，而是别人替她写过的一次结局。",
        notes: "",
        bookmarks: [],
        wordGoal: 800,
        outline: "",
        updatedAt: "2026-04-06T14:08:00.000Z",
        createdAt,
      }),
    ],
    inspirations: {
      activeCategory: "all",
      search: "",
      sort: "newest",
      categoryOrder: inspirationCategories.filter((item) => item !== "all"),
      itemsByWork: {
        "work-1": [
          {
            id: "inspiration-1",
            workId: "work-1",
            chapterId: "chapter-1",
            content: "她不是回来找答案，而是回来确认自己是否还属于这里。",
            category: "剧情",
            isFavorite: true,
            isPinned: true,
            createdAt: "2026-04-07T21:05:00.000Z",
            updatedAt: "2026-04-07T21:05:00.000Z",
          },
          {
            id: "inspiration-2",
            workId: "work-1",
            chapterId: "chapter-2",
            content: "对白：‘你走的时候像离家，回来却像潜入。’",
            category: "对白",
            isFavorite: false,
            isPinned: false,
            createdAt: "2026-04-07T20:48:00.000Z",
            updatedAt: "2026-04-07T20:48:00.000Z",
          },
        ],
        "work-2": [
          {
            id: "inspiration-3",
            workId: "work-2",
            chapterId: "chapter-3",
            content: "人物关系：林序与港务长是旧识，但彼此都知道一半真相。",
            category: "人物",
            isFavorite: true,
            isPinned: false,
            createdAt: "2026-04-07T20:30:00.000Z",
            updatedAt: "2026-04-07T20:30:00.000Z",
          },
        ],
      },
    },
    account: {
      loggedIn: false,
      nickname: "未登录用户",
      avatar: "SF",
      syncStatus: "本地写作中",
    },
    theme: {
      presets: themePresets,
      currentId: "cream",
      nightMode: false,
    },
    font: {
      families: fontChoices,
      currentId: "notoSansSC",
      size: 18,
      lineHeight: 1.9,
      letterSpacing: 0,
    },
    ui: {
      autosaveEnabled: true,
      replaceOpen: false,
      leftSidebarCollapsed: false,
      rightSidebarCollapsed: false,
      sidebarSection: "notes",
      selectionVisible: false,
      selectionStart: 0,
      selectionEnd: 0,
      lastFocused: false,
      focusMode: false,
      findQuery: "",
      replaceQuery: "",
      focusStartedAt: null,
      focusAccumulated: 0,
      libraryScrollTop: 0,
      libraryCreateOpen: false,
      libraryEntityMenu: null,
      libraryEntityMenuPosition: null,
      librarySearch: "",
      librarySort: "updated-desc",
      libraryWorkViewId: "work-1",
      chapterPanelOpen: false,
      chapterPanelFocusedId: null,
      chapterCreateMenuPosition: null,
      chapterItemMenu: null,
      chapterItemMenuPosition: null,
      inspirationComposeOpen: false,
      inspirationComposeTags: ["待补充"],
      inspirationEditingId: null,
      inspirationCategoryManagerExpanded: false,
      settingsThemeExpanded: false,
      modal: null,
    },
  };
}

function createSeedChapter({
  id,
  workId,
  title,
  content,
  notes,
  bookmarks,
  wordGoal,
  outline,
  updatedAt,
  createdAt,
  versions = [],
}) {
  return {
    id,
    workId,
    title,
    content,
    savedContent: content,
    notes,
    bookmarks,
    wordGoal,
    outline,
    wordCount: countWords(content),
    updatedAt,
    createdAt,
    dirty: false,
    saveStatus: "已保存",
    saveTime: "刚刚",
    versions,
    history: { undo: [], redo: [] },
  };
}

function deepMerge(base, incoming) {
  if (Array.isArray(base) || Array.isArray(incoming)) return incoming ?? base;
  const result = { ...base };
  Object.keys(incoming || {}).forEach((key) => {
    if (typeof incoming[key] === "object" && incoming[key] && typeof base[key] === "object" && base[key]) {
      result[key] = deepMerge(base[key], incoming[key]);
    } else {
      result[key] = incoming[key];
    }
  });
  return result;
}

function ensureStateIntegrity() {
  migrateLegacyNestedWorks();

  state.folders = Array.isArray(state.folders) ? state.folders : [];
  state.works = Array.isArray(state.works) ? state.works : [];
  state.chapters = Array.isArray(state.chapters) ? state.chapters : [];

  state.ui ??= {};
  state.inspirations ??= {};
  state.inspirations.categoryOrder = Array.isArray(state.inspirations.categoryOrder)
    ? state.inspirations.categoryOrder.map((item) => String(item).trim()).filter(Boolean)
    : inspirationCategories.filter((item) => item !== "all");
  state.inspirations.activeCategory = String(state.inspirations.activeCategory || "all");
  state.inspirations.search = String(state.inspirations.search || "");
  state.inspirations.sort = ["newest", "oldest", "favorite"].includes(state.inspirations.sort) ? state.inspirations.sort : "newest";
  state.ui.leftSidebarCollapsed ??= false;
  state.ui.rightSidebarCollapsed ??= false;
  state.ui.libraryScrollTop ??= 0;
  state.ui.libraryCreateOpen ??= false;
  state.ui.libraryEntityMenu ??= null;
  state.ui.libraryEntityMenuPosition ??= null;
  state.ui.librarySearch ??= "";
  state.ui.librarySort ??= "updated-desc";
  state.ui.libraryWorkViewId ??= null;
  state.ui.chapterPanelOpen ??= false;
  state.ui.chapterPanelFocusedId ??= null;
  state.ui.chapterCreateMenuPosition ??= null;
  state.ui.chapterItemMenu ??= null;
  state.ui.chapterItemMenuPosition ??= null;
  state.ui.inspirationComposeOpen ??= false;
  state.ui.inspirationComposeTags ??= ["待补充"];
  state.ui.inspirationEditingId ??= null;
  state.ui.inspirationCategoryManagerExpanded ??= false;
  state.ui.settingsThemeExpanded ??= false;
  state.theme ??= {};
  state.theme.presets = themePresets;
  state.theme.currentId = themePresets.some((theme) => theme.id === state.theme.currentId) ? state.theme.currentId : "cream";
  state.theme.nightMode = Boolean(state.theme.nightMode);
  state.font ??= {};
  state.font.families = fontChoices;
  state.font.currentId = fontChoices.some((font) => font.id === state.font.currentId) ? state.font.currentId : "notoSansSC";
  state.font.size = Number(state.font.size) || 18;
  state.font.lineHeight = Number(state.font.lineHeight) || 1.9;
  state.font.letterSpacing = Number(state.font.letterSpacing) || 0;

  const folderIds = new Set(state.folders.map((folder) => folder.id));
  state.folders = state.folders.map((folder) => ({
    id: String(folder.id),
    name: String(folder.name || "未命名文件夹"),
    parentId: folder.parentId == null || !folderIds.has(String(folder.parentId)) ? null : String(folder.parentId),
    createdAt: String(folder.createdAt || new Date().toISOString()),
  }));

  const worksById = new Map();
  state.works = state.works.map((work) => {
    const normalized = {
      id: String(work.id),
      title: String(work.title || "未命名作品"),
      description: String(work.description || ""),
      folderId: work.folderId == null ? null : String(work.folderId),
      chapterIds: Array.isArray(work.chapterIds) ? work.chapterIds.map((id) => String(id)) : [],
      updatedAt: String(work.updatedAt || new Date().toISOString()),
      createdAt: String(work.createdAt || new Date().toISOString()),
      lastOpenedChapterId: work.lastOpenedChapterId == null ? null : String(work.lastOpenedChapterId),
    };
    worksById.set(normalized.id, normalized);
    return normalized;
  });

  state.chapters = state.chapters
    .map((chapter) => {
      const content = String(chapter.content || "");
      return {
        id: String(chapter.id),
        workId: String(chapter.workId),
        title: String(chapter.title || "未命名章节"),
        content,
        savedContent: String(chapter.savedContent ?? content),
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
    })
    .filter((chapter) => worksById.has(chapter.workId));

  const chaptersByWork = new Map();
  state.chapters.forEach((chapter) => {
    if (!chaptersByWork.has(chapter.workId)) chaptersByWork.set(chapter.workId, []);
    chaptersByWork.get(chapter.workId).push(chapter.id);
  });

  state.works = state.works.map((work) => {
    const allowedIds = new Set(chaptersByWork.get(work.id) ?? []);
    work.chapterIds = work.chapterIds.filter((id) => allowedIds.has(id));
    for (const chapterId of chaptersByWork.get(work.id) ?? []) {
      if (!work.chapterIds.includes(chapterId)) work.chapterIds.push(chapterId);
    }
    if (!work.lastOpenedChapterId || !work.chapterIds.includes(work.lastOpenedChapterId)) {
      work.lastOpenedChapterId = work.chapterIds[0] ?? null;
    }
    if (work.folderId != null && !state.folders.some((folder) => folder.id === work.folderId)) {
      work.folderId = null;
    }
    return work;
  });

  normalizeInspirationState();

  if (state.activeFolderId != null && !getFolder(state.activeFolderId)) {
    state.activeFolderId = null;
  }

  syncInspirationCategoryOrder();

  normalizeActiveSelection();
  persist();
}

function normalizeInspirationState() {
  const fallbackWorkId = state.activeWorkId ?? state.works[0]?.id ?? null;
  const source =
    state.inspirations && typeof state.inspirations.itemsByWork === "object" && state.inspirations.itemsByWork
      ? state.inspirations.itemsByWork
      : {};
  const normalizedByWork = {};

  if (Array.isArray(state.inspirations.items)) {
    state.inspirations.items.forEach((item) => {
      const normalized = normalizeInspirationItem(item, fallbackWorkId);
      if (!normalized) return;
      if (!normalizedByWork[normalized.workId]) normalizedByWork[normalized.workId] = [];
      normalizedByWork[normalized.workId].push(normalized);
    });
  }

  Object.entries(source).forEach(([workId, items]) => {
    if (!Array.isArray(items)) return;
    items.forEach((item) => {
      const normalized = normalizeInspirationItem(item, workId || fallbackWorkId);
      if (!normalized) return;
      if (!normalizedByWork[normalized.workId]) normalizedByWork[normalized.workId] = [];
      normalizedByWork[normalized.workId].push(normalized);
    });
  });

  const validWorkIds = new Set(state.works.map((work) => work.id));
  Object.keys(normalizedByWork).forEach((workId) => {
    if (!validWorkIds.has(workId)) {
      delete normalizedByWork[workId];
      return;
    }
    const deduped = new Map();
    normalizedByWork[workId].forEach((item) => deduped.set(item.id, item));
    normalizedByWork[workId] = [...deduped.values()].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  });

  state.inspirations.itemsByWork = normalizedByWork;
  delete state.inspirations.items;
  if (state.inspirations.activeCategory !== "all" && !getAvailableInspirationCategories().includes(state.inspirations.activeCategory)) {
    state.inspirations.activeCategory = "all";
  }
}

function normalizeInspirationItem(item, fallbackWorkId = null) {
  const workId = String(item?.workId || fallbackWorkId || "").trim();
  if (!workId) return null;
  const content = String(item?.content ?? item?.text ?? "").trim();
  if (!content) return null;
  const categories = Array.isArray(item?.categories)
    ? item.categories.map((tag) => String(tag).trim()).filter(Boolean)
    : item?.category
      ? [String(item.category).trim()]
      : ["待补充"];
  const primaryCategory = categories[0] || "待补充";
  const createdAt = normalizeIsoDate(item?.createdAt);
  return {
    id: String(item?.id || uid("inspiration")),
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

function migrateLegacyNestedWorks() {
  if (Array.isArray(state.works) && state.works[0]?.chapters && !Array.isArray(state.chapters)) {
    const migrated = migrateLegacyWorksToFlat(state.works);
    state.folders = migrated.folders;
    state.works = migrated.works;
    state.chapters = migrated.chapters;
    state.activeFolderId = migrated.works[0]?.folderId ?? null;
  }
}

function migrateLegacyWorksToFlat(legacyWorks) {
  const works = [];
  const chapters = [];
  const createdAt = new Date().toISOString();

  for (const legacyWork of legacyWorks || []) {
    const chapterIds = (legacyWork.chapters || []).map((chapter) => String(chapter.id));
    works.push({
      id: String(legacyWork.id),
      title: String(legacyWork.title || "未命名作品"),
      description: String(legacyWork.description || ""),
      folderId: null,
      chapterIds,
      updatedAt: createdAt,
      createdAt,
      lastOpenedChapterId: chapterIds[0] ?? null,
    });

    for (const legacyChapter of legacyWork.chapters || []) {
      const content = String(legacyChapter.content || "");
      chapters.push({
        id: String(legacyChapter.id),
        workId: String(legacyWork.id),
        title: String(legacyChapter.title || "未命名章节"),
        content,
        savedContent: String(legacyChapter.savedContent ?? content),
        notes: String(legacyChapter.notes || ""),
        bookmarks: Array.isArray(legacyChapter.bookmarks) ? legacyChapter.bookmarks : [],
        wordGoal: Number(legacyChapter.wordGoal) || 2000,
        outline: String(legacyChapter.outline || ""),
        wordCount: countWords(content),
        updatedAt: createdAt,
        createdAt,
        dirty: Boolean(legacyChapter.dirty),
        saveStatus: String(legacyChapter.saveStatus || "已保存"),
        saveTime: String(legacyChapter.saveTime || "刚刚"),
        versions: Array.isArray(legacyChapter.versions) ? legacyChapter.versions : [],
        history: {
          undo: Array.isArray(legacyChapter.history?.undo) ? legacyChapter.history.undo : [],
          redo: Array.isArray(legacyChapter.history?.redo) ? legacyChapter.history.redo : [],
        },
      });
    }
  }

  return { folders: [], works, chapters };
}

async function bootstrapDesktopLibrary() {
  if (!desktopApi?.bootstrapLibrary) return;
  try {
    const library = await desktopApi.bootstrapLibrary(getLibraryStatePayload());
    applyLibraryState(library);
    ensureStateIntegrity();
  } catch (error) {
    console.error("Failed to bootstrap desktop library", error);
  }
}

async function syncLibraryToDesktop() {
  if (!desktopApi?.syncLibrary) return;
  const preferredFolderId = state.activeFolderId;
  const preferredWorkId = state.activeWorkId;
  const preferredChapterId = state.activeChapterId;
  try {
    const library = await desktopApi.syncLibrary(getLibraryStatePayload());
    applyLibraryState(library);
    state.activeFolderId = preferredFolderId;
    normalizeActiveSelection(preferredWorkId, preferredChapterId);
    persist();
  } catch (error) {
    console.error("Failed to sync desktop library", error);
  }
}

function getLibraryStatePayload() {
  return {
    folders: state.folders,
    works: state.works,
    chapters: state.chapters,
    inspirations: {
      categoryOrder: state.inspirations.categoryOrder,
      itemsByWork: state.inspirations.itemsByWork,
    },
  };
}

function applyLibraryState(library) {
  if (!library || typeof library !== "object") return;
  if (Array.isArray(library.folders)) state.folders = library.folders;
  if (Array.isArray(library.works)) state.works = library.works;
  if (Array.isArray(library.chapters)) state.chapters = library.chapters;
  if (library.inspirations && typeof library.inspirations === "object") {
    state.inspirations = {
      ...state.inspirations,
      ...library.inspirations,
    };
  }
}

function normalizeActiveSelection(preferredWorkId = state.activeWorkId, preferredChapterId = state.activeChapterId) {
  const previousWorkId = state.activeWorkId;
  const preferredWork = getWork(preferredWorkId);
  const preferredChapter = preferredWork ? getChapter(preferredChapterId) : null;

  if (preferredWork && preferredChapter && preferredChapter.workId === preferredWork.id) {
    handleInspirationWorkChange(preferredWork.id, previousWorkId);
    state.activeWorkId = preferredWork.id;
    state.activeChapterId = preferredChapter.id;
    return;
  }

  const firstWork = state.works[0] ?? null;
  const firstChapterId = firstWork?.chapterIds[0] ?? null;
  handleInspirationWorkChange(firstWork?.id ?? null, previousWorkId);
  state.activeWorkId = firstWork?.id ?? null;
  state.activeChapterId = firstChapterId;
  if (!firstWork) state.route = "library";
}

function AppShell() {
  return `
    <div class="app-shell">
      ${FileManagerPage()}
      ${EditorPage()}
      <div class="portal-layer" id="portal-layer"></div>
      <div class="modal-root hidden" id="modal-root"></div>
    </div>
  `;
}

function FileManagerPage() {
  return `
    <section class="library-page" id="library-page">
      <header class="library-header surface">
        <div class="library-header-row">
          <div class="library-title-block">
            <span class="section-kicker">文件管理页</span>
            <h1>作品目录</h1>
            <p>支持文件夹与作品两层管理，进入后可继续按章节写作。</p>
          </div>
        <div class="library-header-actions">
          <button class="ghost-button" id="folder-up-button">返回上一级</button>
          <div class="menu-wrap">
            <button class="primary-button" id="create-entry-button">新建</button>
            <div class="dropdown-menu hidden" id="create-entry-menu">
                <button data-library-action="open-create-folder">新建文件夹</button>
                <button data-library-action="open-create-work">新建作品</button>
              </div>
            </div>
          </div>
        </div>
        <div class="library-breadcrumb" id="library-breadcrumb"></div>
        <div class="library-toolbar">
          <input id="library-search-input" type="search" placeholder="搜索当前目录下的文件夹或作品" />
          <select id="library-sort-select">
            <option value="updated-desc">最近编辑优先</option>
            <option value="title-asc">名称 A-Z</option>
            <option value="created-desc">最新创建优先</option>
          </select>
        </div>
      </header>
      <div class="library-content" id="library-content">
        <div class="library-list" id="library-list"></div>
      </div>
    </section>
  `;
}

function EditorPage() {
  return `
    <section class="editor-page" id="editor-page">
      ${TopBar()}
      <div class="editor-body">
        <aside class="chapter-sidebar surface" id="chapter-sidebar">
          <div class="sidebar-header">
            <strong>章节辅助</strong>
            <button class="ghost-button compact-button" id="left-sidebar-toggle-button">收起</button>
          </div>
          <div class="sidebar-section">
            <div class="sidebar-section-head">
              <strong>章节备注</strong>
              <button class="ghost-button compact-button" data-open-side="notes">定位</button>
            </div>
            <textarea id="chapter-notes-input" placeholder="记录当前章节备注"></textarea>
          </div>
          <div class="sidebar-section">
            <div class="sidebar-section-head">
              <strong>章节大纲</strong>
            </div>
            <textarea id="chapter-outline-input" placeholder="记录本章大纲与推进节点"></textarea>
          </div>
          <div class="sidebar-section">
            <div class="sidebar-section-head">
              <strong>书签</strong>
              <button class="ghost-button compact-button" id="add-bookmark-button">添加书签</button>
            </div>
            <div class="bookmark-list" id="bookmark-list"></div>
          </div>
        </aside>
        <button class="edge-toggle edge-toggle-left hidden" id="left-sidebar-reopen-button" title="展开章节辅助">></button>
        <div class="editor-column" id="editor-column">
          ${DocumentEditor()}
        </div>
        <button class="edge-toggle edge-toggle-right hidden" id="right-sidebar-reopen-button" title="展开工作侧栏"><</button>
        ${BottomWorkspaceTabs()}
      </div>
    </section>
  `;
}

function TopBar() {
  return `
    <header class="top-bar surface">
      <button class="icon-button" id="back-button" title="返回文件管理页">←</button>
      <div class="top-bar-meta">
        <strong id="current-work-title"></strong>
        <div class="chapter-switcher-shell">
          <div class="chapter-switcher-row">
            <button class="chapter-switcher-trigger" id="chapter-switcher-button" title="查看并切换章节">
              <span class="chapter-switcher-label" id="current-chapter-title"></span>
              <small id="current-chapter-meta"></small>
            </button>
            <button class="ghost-button compact-button" id="new-chapter-button" data-chapter-create-trigger title="新建章节">+ 新建章节</button>
          </div>
          <div class="chapter-panel hidden" id="chapter-panel">
            <div class="chapter-panel-head">
              <div>
                <strong>全部章节</strong>
                <small id="chapter-panel-summary"></small>
              </div>
              <button class="ghost-button compact-button" data-chapter-create-trigger>+ 新建章节</button>
            </div>
            <div class="chapter-panel-list" id="chapter-panel-list"></div>
          </div>
        </div>
      </div>
      <div class="top-bar-actions">
        <span class="status-pill" id="save-status-pill"></span>
        <button class="ghost-button" id="word-count-button"></button>
        <div class="menu-wrap">
          <button class="icon-button" id="more-menu-button">⋯</button>
          <div class="dropdown-menu hidden" id="more-menu">
            <button data-menu-action="rename-chapter">重命名章节</button>
            <button data-menu-action="move-chapter">移动章节</button>
            <button data-menu-action="delete-chapter">删除章节</button>
            <button data-menu-action="history">历史版本</button>
            <button data-menu-action="shortcuts">？ 快捷键</button>
            <button data-menu-action="export">导出</button>
            <button data-menu-action="focus">专注模式</button>
            <button data-menu-action="night">夜间模式</button>
          </div>
        </div>
      </div>
    </header>
  `;
}

function DocumentEditor() {
  return `
    <section class="editor-main surface">
      <div class="find-replace-bar hidden" id="find-replace-bar">
        <input id="find-query-input" type="text" placeholder="查找" />
        <input id="replace-query-input" type="text" placeholder="替换为" />
        <button class="ghost-button" id="find-next-button">查找下一个</button>
        <button class="ghost-button" id="replace-button">替换</button>
      </div>
      <div class="selection-toolbar hidden" id="selection-toolbar">
        <button class="ghost-button compact-button" data-selection-action="quote">引用</button>
        <button class="ghost-button compact-button" data-selection-action="divider">插入分隔</button>
        <button class="ghost-button compact-button" data-selection-action="bookmark">设为书签</button>
      </div>
      <textarea id="document-editor" class="document-editor" spellcheck="false" placeholder="开始写作……"></textarea>
    </section>
  `;
}

function BottomWorkspaceTabs() {
  return `
    <aside class="workspace-sidebar surface" id="workspace-sidebar">
      <div class="workspace-sidebar-head">
        <strong>工作侧栏</strong>
        <button class="ghost-button compact-button" id="right-sidebar-toggle-button">收起</button>
      </div>
      <div class="workspace-panels">
        <section class="workspace-panel" data-panel="writing">${WritingPanel()}</section>
        <section class="workspace-panel hidden" data-panel="inspiration">${InspirationPanel()}</section>
        <section class="workspace-panel hidden" data-panel="settings">${SettingsPanel()}</section>
      </div>
      <nav class="workspace-tabs">
        <button class="tab-chip active" data-tab="writing">写作</button>
        <button class="tab-chip" data-tab="inspiration">灵感记录</button>
        <button class="tab-chip" data-tab="settings">设置</button>
      </nav>
    </aside>
  `;
}

function WritingPanel() {
  return `
    <div class="writing-panel" id="writing-panel">
      <div class="tool-group">
        <label>快捷标点</label>
        <div class="chip-row">
          ${punctuationChoices.map((item) => `<button class="chip" data-insert-text="${escapeAttribute(item)}">${escapeHtml(item)}</button>`).join("")}
        </div>
      </div>
      <div class="tool-group">
        <label>常用短语</label>
        <div class="chip-row">
          ${phraseChoices.map((item) => `<button class="chip" data-insert-text="${escapeAttribute(item)}">${escapeHtml(item)}</button>`).join("")}
        </div>
      </div>
      <div class="tool-grid two-col">
        <button class="ghost-button" data-writing-action="divider">插入分隔符</button>
        <button class="ghost-button" data-writing-action="toggle-find">查找替换</button>
        <button class="ghost-button" data-writing-action="undo">撤销</button>
        <button class="ghost-button" data-writing-action="redo">重做</button>
        <button class="ghost-button" data-writing-action="prev">上一章节</button>
        <button class="ghost-button" data-writing-action="next">下一章节</button>
      </div>
      <div class="tool-grid three-col">
        <div class="tool-card stat-card">
          <label>字数目标</label>
          <input id="word-goal-input" type="number" min="0" />
          <small id="word-goal-progress"></small>
        </div>
        <div class="tool-card stat-card">
          <label>专注计时</label>
          <strong id="focus-timer-value">0h 0m 0s</strong>
          <small>仅在编辑器获得焦点时计时</small>
        </div>
        <div class="tool-card stat-card">
          <label>断点续写</label>
          <button class="ghost-button" data-writing-action="resume">回到上次光标</button>
          <small id="resume-hint">保存上一次编辑位置</small>
        </div>
      </div>
      <div class="tool-grid two-col">
        <button class="tool-card action-card" data-writing-action="open-notes">
          <strong>章节备注入口</strong>
          <small>展开左侧备注面板</small>
        </button>
        <button class="tool-card action-card" data-writing-action="open-outline">
          <strong>章节大纲入口</strong>
          <small>查看并编辑本章大纲</small>
        </button>
      </div>
      <div class="tool-grid two-col">
        <button class="tool-card action-card" data-writing-action="open-bookmarks">
          <strong>书签入口</strong>
          <small>查看并管理书签</small>
        </button>
      </div>
    </div>
  `;
}

function InspirationPanel() {
  return `
    <div class="inspiration-panel" id="inspiration-panel">
      <div class="inspiration-toolbar">
        <div class="inspiration-toolbar-row inspiration-toolbar-row-primary">
          <select id="inspiration-category-filter"></select>
          <button class="primary-button" id="new-inspiration-button">新建灵感</button>
        </div>
        <div class="inspiration-toolbar-row inspiration-toolbar-row-filter">
          <input id="inspiration-search-input" type="search" placeholder="搜索灵感内容" />
          <button class="ghost-button subtle-button" id="inspiration-sort-button">排序：最新</button>
        </div>
      </div>
      <div class="inspiration-category-manager tool-card">
        <button class="section-line accordion-trigger" id="inspiration-category-manager-button">
          <strong>分类管理</strong>
          <small id="inspiration-category-manager-hint">点击展开分类管理</small>
        </button>
        <div class="inspiration-category-manager-body hidden" id="inspiration-category-manager-body">
          <div class="inspiration-category-create-row">
            <input id="inspiration-category-create-input" type="text" placeholder="新建分类名称" />
            <button class="ghost-button" id="create-inspiration-category-button">新建分类</button>
          </div>
          <div class="inspiration-category-list" id="inspiration-category-list"></div>
        </div>
      </div>
      <div class="inspiration-compose hidden" id="inspiration-compose">
        <div class="section-line">
          <strong id="inspiration-compose-title">新建灵感</strong>
          <small id="inspiration-compose-hint">填写内容和分类后保存到灵感列表。</small>
        </div>
        <textarea id="inspiration-compose-input" rows="4" placeholder="记录一条灵感内容"></textarea>
        <div class="inspiration-compose-row">
          <select id="inspiration-compose-category"></select>
          <input id="inspiration-custom-category-input" type="text" placeholder="自定义分类" />
          <button class="ghost-button" id="add-inspiration-category-button">添加分类</button>
        </div>
        <div class="inspiration-selected-tags" id="inspiration-selected-tags"></div>
        <div class="inspiration-compose-row">
          <button class="primary-button" id="save-inspiration-button">保存灵感</button>
          <button class="ghost-button" id="cancel-inspiration-button">取消</button>
        </div>
      </div>
      <div class="inspiration-chat-list" id="inspiration-chat-list"></div>
    </div>
  `;
}

function SettingsPanel() {
  return `
    <div class="settings-panel" id="settings-panel">
      ${AccountCard()}
      ${ThemeSelector()}
      ${FontSelector()}
      <section class="tool-card">
        <div class="section-line">
          <strong>编辑器行为</strong>
          <small>控制返回前处理和自动保存逻辑。</small>
        </div>
        <label class="toggle-row">
          <span>自动保存</span>
          <input id="autosave-toggle" type="checkbox" />
        </label>
      </section>
    </div>
  `;
}

function AccountCard() {
  return `<section class="account-card tool-card" id="account-card"></section>`;
}

function ThemeSelector() {
  return `
    <section class="tool-card">
      <button class="section-line accordion-trigger" id="theme-accordion-button">
        <strong>主题</strong>
        <small id="theme-accordion-hint">点击展开主题设置</small>
      </button>
      <div class="theme-list hidden" id="theme-list"></div>
    </section>
  `;
}

function FontSelector() {
  return `
    <section class="tool-card">
      <div class="section-line">
        <strong>字体与排版</strong>
        <small>实时作用于正文编辑器、顶部栏和按钮。</small>
      </div>
      <label>开源字体</label>
      <select id="font-family-select"></select>
      <small>已离线内置 10 组简体中文字体，并保留其他开源英文字体预设。</small>
      <label>字号</label>
      <input id="font-size-range" type="range" min="14" max="28" />
      <label>行高</label>
      <input id="line-height-range" type="range" min="1.4" max="2.6" step="0.1" />
      <label>字间距</label>
      <input id="letter-spacing-range" type="range" min="-1" max="4" step="0.1" />
    </section>
  `;
}

function collectRefs() {
  refs.app = document.getElementById("app");
  refs.libraryPage = document.getElementById("library-page");
  refs.libraryBreadcrumb = document.getElementById("library-breadcrumb");
  refs.folderUpButton = document.getElementById("folder-up-button");
  refs.createEntryButton = document.getElementById("create-entry-button");
  refs.createEntryMenu = document.getElementById("create-entry-menu");
  refs.librarySearchInput = document.getElementById("library-search-input");
  refs.librarySortSelect = document.getElementById("library-sort-select");
  refs.libraryContent = document.getElementById("library-content");
  refs.libraryList = document.getElementById("library-list");
  refs.editorPage = document.getElementById("editor-page");
  refs.backButton = document.getElementById("back-button");
  refs.currentWorkTitle = document.getElementById("current-work-title");
  refs.currentChapterTitle = document.getElementById("current-chapter-title");
  refs.currentChapterMeta = document.getElementById("current-chapter-meta");
  refs.chapterSwitcherButton = document.getElementById("chapter-switcher-button");
  refs.newChapterButton = document.getElementById("new-chapter-button");
  refs.chapterPanel = document.getElementById("chapter-panel");
  refs.chapterPanelSummary = document.getElementById("chapter-panel-summary");
  refs.chapterPanelList = document.getElementById("chapter-panel-list");
  refs.saveStatusPill = document.getElementById("save-status-pill");
  refs.wordCountButton = document.getElementById("word-count-button");
  refs.moreMenuButton = document.getElementById("more-menu-button");
  refs.moreMenu = document.getElementById("more-menu");
  refs.findReplaceBar = document.getElementById("find-replace-bar");
  refs.findQueryInput = document.getElementById("find-query-input");
  refs.replaceQueryInput = document.getElementById("replace-query-input");
  refs.findNextButton = document.getElementById("find-next-button");
  refs.replaceButton = document.getElementById("replace-button");
  refs.selectionToolbar = document.getElementById("selection-toolbar");
  refs.documentEditor = document.getElementById("document-editor");
  refs.chapterSidebar = document.getElementById("chapter-sidebar");
  refs.editorColumn = document.getElementById("editor-column");
  refs.chapterNotesInput = document.getElementById("chapter-notes-input");
  refs.chapterOutlineInput = document.getElementById("chapter-outline-input");
  refs.bookmarkList = document.getElementById("bookmark-list");
  refs.leftSidebarToggleButton = document.getElementById("left-sidebar-toggle-button");
  refs.leftSidebarReopenButton = document.getElementById("left-sidebar-reopen-button");
  refs.addBookmarkButton = document.getElementById("add-bookmark-button");
  refs.workspaceSidebar = document.getElementById("workspace-sidebar");
  refs.rightSidebarToggleButton = document.getElementById("right-sidebar-toggle-button");
  refs.rightSidebarReopenButton = document.getElementById("right-sidebar-reopen-button");
  refs.workspacePanels = [...document.querySelectorAll(".workspace-panel")];
  refs.workspaceTabs = [...document.querySelectorAll("[data-tab]")];
  refs.wordGoalInput = document.getElementById("word-goal-input");
  refs.wordGoalProgress = document.getElementById("word-goal-progress");
  refs.focusTimerValue = document.getElementById("focus-timer-value");
  refs.resumeHint = document.getElementById("resume-hint");
  refs.inspirationCategoryFilter = document.getElementById("inspiration-category-filter");
  refs.inspirationSearchInput = document.getElementById("inspiration-search-input");
  refs.inspirationSortButton = document.getElementById("inspiration-sort-button");
  refs.inspirationCategoryManagerButton = document.getElementById("inspiration-category-manager-button");
  refs.inspirationCategoryManagerHint = document.getElementById("inspiration-category-manager-hint");
  refs.inspirationCategoryManagerBody = document.getElementById("inspiration-category-manager-body");
  refs.inspirationCategoryCreateInput = document.getElementById("inspiration-category-create-input");
  refs.createInspirationCategoryButton = document.getElementById("create-inspiration-category-button");
  refs.inspirationCategoryList = document.getElementById("inspiration-category-list");
  refs.inspirationCompose = document.getElementById("inspiration-compose");
  refs.inspirationComposeTitle = document.getElementById("inspiration-compose-title");
  refs.inspirationComposeHint = document.getElementById("inspiration-compose-hint");
  refs.inspirationComposeInput = document.getElementById("inspiration-compose-input");
  refs.inspirationComposeCategory = document.getElementById("inspiration-compose-category");
  refs.inspirationCustomCategoryInput = document.getElementById("inspiration-custom-category-input");
  refs.addInspirationCategoryButton = document.getElementById("add-inspiration-category-button");
  refs.inspirationSelectedTags = document.getElementById("inspiration-selected-tags");
  refs.saveInspirationButton = document.getElementById("save-inspiration-button");
  refs.cancelInspirationButton = document.getElementById("cancel-inspiration-button");
  refs.inspirationChatList = document.getElementById("inspiration-chat-list");
  refs.accountCard = document.getElementById("account-card");
  refs.themeAccordionButton = document.getElementById("theme-accordion-button");
  refs.themeAccordionHint = document.getElementById("theme-accordion-hint");
  refs.themeList = document.getElementById("theme-list");
  refs.fontFamilySelect = document.getElementById("font-family-select");
  refs.fontSizeRange = document.getElementById("font-size-range");
  refs.lineHeightRange = document.getElementById("line-height-range");
  refs.letterSpacingRange = document.getElementById("letter-spacing-range");
  refs.autosaveToggle = document.getElementById("autosave-toggle");
  refs.portalLayer = document.getElementById("portal-layer");
  refs.modalRoot = document.getElementById("modal-root");
}

function bindEvents() {
  refs.folderUpButton.addEventListener("click", handleFolderUp);
  refs.createEntryButton.addEventListener("click", () => {
    state.ui.libraryCreateOpen = !state.ui.libraryCreateOpen;
    updateLibraryHeader();
    persist();
  });
  refs.librarySearchInput.addEventListener("input", (event) => {
    state.ui.librarySearch = event.target.value;
    renderLibraryPage();
    persist();
  });
  refs.librarySortSelect.addEventListener("change", (event) => {
    state.ui.librarySort = event.target.value;
    renderLibraryPage();
    persist();
  });
  refs.libraryContent.addEventListener("scroll", () => {
    state.ui.libraryScrollTop = refs.libraryContent.scrollTop;
    persist();
  });
  refs.backButton.addEventListener("click", handleBackNavigation);
  refs.chapterSwitcherButton.addEventListener("click", toggleChapterPanel);
  refs.chapterPanelList.addEventListener("keydown", handleChapterPanelKeydown);
  refs.chapterPanelList.addEventListener("dragstart", handleChapterDragStart);
  refs.chapterPanelList.addEventListener("dragover", handleChapterDragOver);
  refs.chapterPanelList.addEventListener("drop", handleChapterDrop);
  refs.chapterPanelList.addEventListener("dragend", handleChapterDragEnd);
  refs.moreMenuButton.addEventListener("click", () => refs.moreMenu.classList.toggle("hidden"));
  refs.wordCountButton.addEventListener("click", () => switchTab("writing"));
  refs.findNextButton.addEventListener("click", findNext);
  refs.replaceButton.addEventListener("click", replaceCurrent);
  refs.findQueryInput.addEventListener("input", (event) => {
    state.ui.findQuery = event.target.value;
    persist();
  });
  refs.replaceQueryInput.addEventListener("input", (event) => {
    state.ui.replaceQuery = event.target.value;
    persist();
  });
  refs.documentEditor.addEventListener("beforeinput", handleBeforeInput);
  refs.documentEditor.addEventListener("input", handleEditorInput);
  refs.documentEditor.addEventListener("keydown", handleEditorKeydown);
  refs.documentEditor.addEventListener("focus", handleEditorFocus);
  refs.documentEditor.addEventListener("blur", handleEditorBlur);
  refs.documentEditor.addEventListener("select", captureSelection);
  refs.documentEditor.addEventListener("mouseup", captureSelection);
  refs.documentEditor.addEventListener("keyup", captureSelection);
  refs.chapterNotesInput.addEventListener("input", handleNotesInput);
  refs.chapterOutlineInput.addEventListener("input", handleOutlineInput);
  refs.leftSidebarToggleButton.addEventListener("click", toggleLeftSidebar);
  refs.leftSidebarReopenButton.addEventListener("click", toggleLeftSidebar);
  refs.addBookmarkButton.addEventListener("click", () => addBookmarkFromSelection());
  refs.rightSidebarToggleButton.addEventListener("click", toggleRightSidebar);
  refs.rightSidebarReopenButton.addEventListener("click", toggleRightSidebar);
  refs.wordGoalInput.addEventListener("input", handleWordGoalInput);
  refs.inspirationCategoryFilter.addEventListener("change", (event) => {
    state.inspirations.activeCategory = event.target.value;
    renderInspirationList();
    persist();
  });
  refs.inspirationSearchInput.addEventListener("input", (event) => {
    state.inspirations.search = event.target.value;
    renderInspirationList();
    persist();
  });
  refs.inspirationSortButton.addEventListener("click", toggleInspirationSort);
  refs.inspirationCategoryManagerButton.addEventListener("click", toggleInspirationCategoryManager);
  refs.createInspirationCategoryButton.addEventListener("click", handleCreateInspirationCategory);
  refs.inspirationCategoryCreateInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    handleCreateInspirationCategory();
  });
  refs.addInspirationCategoryButton.addEventListener("click", addSelectedInspirationCategory);
  refs.saveInspirationButton.addEventListener("click", saveComposedInspiration);
  refs.cancelInspirationButton.addEventListener("click", closeInspirationComposer);
  refs.themeAccordionButton.addEventListener("click", toggleThemeAccordion);
  refs.fontFamilySelect.addEventListener("change", (event) => {
    state.font.currentId = event.target.value;
    applyTypography();
    updateSettingsPanel();
    persist();
  });
  refs.fontSizeRange.addEventListener("input", (event) => {
    state.font.size = Number(event.target.value);
    applyTypography();
    updateSettingsPanel();
    persist();
  });
  refs.lineHeightRange.addEventListener("input", (event) => {
    state.font.lineHeight = Number(event.target.value);
    applyTypography();
    updateSettingsPanel();
    persist();
  });
  refs.letterSpacingRange.addEventListener("input", (event) => {
    state.font.letterSpacing = Number(event.target.value);
    applyTypography();
    updateSettingsPanel();
    persist();
  });
  refs.autosaveToggle.addEventListener("change", (event) => {
    state.ui.autosaveEnabled = event.target.checked;
    if (event.target.checked && getCurrentChapter()?.dirty) void saveCurrentChapter();
    updateSettingsPanel();
    persist();
  });
  refs.workspaceTabs.forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });
  refs.app.addEventListener("click", handleDelegatedClick);
  refs.app.addEventListener("keydown", (event) => {
    if (!state.ui.modal || event.key !== "Enter") return;
    if (event.shiftKey || event.isComposing) return;
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!refs.modalRoot.contains(target)) return;
    if (target.tagName === "TEXTAREA") return;
    if (target.tagName === "BUTTON") return;
    event.preventDefault();
    submitCurrentModalIfPossible();
  });

  if (desktopApi?.onMenuAction) {
    desktopApi.onMenuAction((action) => handleDesktopMenuAction(action));
  }
}

async function handleDelegatedClick(event) {
  if (event.target.id === "new-inspiration-button") {
    openInspirationComposer();
    return;
  }

  const folderNav = event.target.closest("[data-folder-nav]");
  if (folderNav) {
    openFolder(folderNav.dataset.folderNav || null);
    return;
  }

  const folderOpen = event.target.closest("[data-open-folder]");
  if (folderOpen) {
    openFolder(folderOpen.dataset.openFolder);
    return;
  }

  const workOpen = event.target.closest("[data-open-work]");
  if (workOpen) {
    await openWorkDefault(workOpen.dataset.openWork);
    return;
  }

  const workManage = event.target.closest("[data-manage-work]");
  if (workManage) {
    state.ui.libraryWorkViewId = workManage.dataset.manageWork;
    updateAll();
    persist();
    return;
  }

  const chapterOpen = event.target.closest("[data-open-chapter]");
  if (chapterOpen) {
    await openChapter(chapterOpen.dataset.workId, chapterOpen.dataset.openChapter);
    return;
  }

  const libraryAction = event.target.closest("[data-library-action]");
  if (libraryAction) {
    await handleLibraryAction(libraryAction.dataset.libraryAction);
    return;
  }

  const entityMenuTrigger = event.target.closest("[data-entity-menu-trigger]");
  if (entityMenuTrigger) {
    const nextKey = `${entityMenuTrigger.dataset.entityType}:${entityMenuTrigger.dataset.entityId}`;
    if (state.ui.libraryEntityMenu === nextKey) {
      state.ui.libraryEntityMenu = null;
      state.ui.libraryEntityMenuPosition = null;
    } else {
      state.ui.libraryEntityMenu = nextKey;
      state.ui.libraryEntityMenuPosition = getEntityMenuPosition(entityMenuTrigger);
    }
    updateAll();
    persist();
    return;
  }

  const entityAction = event.target.closest("[data-entity-action]");
  if (entityAction) {
    await handleEntityAction(
      entityAction.dataset.entityAction,
      entityAction.dataset.entityType,
      entityAction.dataset.entityId,
    );
    return;
  }

  const workAction = event.target.closest("[data-work-action]");
  if (workAction) {
    await handleWorkAction(workAction.dataset.workAction, workAction.dataset.workId);
    return;
  }

  const chapterAction = event.target.closest("[data-chapter-action]");
  if (chapterAction) {
    await handleChapterAction(chapterAction.dataset.chapterAction, chapterAction.dataset.workId, chapterAction.dataset.chapterId);
    return;
  }

  const chapterCreateTrigger = event.target.closest("[data-chapter-create-trigger]");
  if (chapterCreateTrigger) {
    toggleChapterCreateMenu(chapterCreateTrigger);
    return;
  }

  const chapterCreateAction = event.target.closest("[data-chapter-create-mode]");
  if (chapterCreateAction) {
    handleChapterCreateRequest(chapterCreateAction.dataset.chapterCreateMode);
    return;
  }

  const chapterItemMenuTrigger = event.target.closest("[data-chapter-item-menu-trigger]");
  if (chapterItemMenuTrigger) {
    toggleChapterItemMenu(chapterItemMenuTrigger.dataset.chapterId, chapterItemMenuTrigger);
    return;
  }

  const chapterItemAction = event.target.closest("[data-chapter-item-action]");
  if (chapterItemAction) {
    await handleChapterItemAction(chapterItemAction.dataset.chapterItemAction, chapterItemAction.dataset.chapterId);
    return;
  }

  const menuAction = event.target.closest("[data-menu-action]");
  if (menuAction) {
    await handleMenuAction(menuAction.dataset.menuAction);
    return;
  }

  const insertTrigger = event.target.closest("[data-insert-text]");
  if (insertTrigger) {
    insertAtCursor(insertTrigger.dataset.insertText);
    return;
  }

  const writingAction = event.target.closest("[data-writing-action]");
  if (writingAction) {
    handleWritingAction(writingAction.dataset.writingAction);
    return;
  }

  const inspirationAction = event.target.closest("[data-inspiration-action]");
  if (inspirationAction) {
    handleInspirationAction(inspirationAction.dataset.inspirationAction, inspirationAction.dataset.id);
    return;
  }

  const inspirationCategoryAction = event.target.closest("[data-inspiration-category-action]");
  if (inspirationCategoryAction) {
    handleInspirationCategoryAction(
      inspirationCategoryAction.dataset.inspirationCategoryAction,
      inspirationCategoryAction.dataset.categoryName,
    );
    return;
  }

  const selectionAction = event.target.closest("[data-selection-action]");
  if (selectionAction) {
    applySelectionAction(selectionAction.dataset.selectionAction);
    return;
  }

  const themeCard = event.target.closest("[data-theme-id]");
  if (themeCard) {
    state.theme.currentId = themeCard.dataset.themeId;
    if (state.theme.currentId !== "dark" && state.theme.currentId !== "ink") state.theme.nightMode = false;
    applyTheme();
    updateSettingsPanel();
    persist();
    return;
  }

  const bookmarkChip = event.target.closest("[data-bookmark-index]");
  if (bookmarkChip) {
    insertAtCursor(bookmarkChip.dataset.bookmarkText);
    return;
  }

  const sideOpen = event.target.closest("[data-open-side]");
  if (sideOpen) {
    state.ui.leftSidebarCollapsed = false;
    state.ui.sidebarSection = sideOpen.dataset.openSide;
    updateSidebar();
    persist();
    return;
  }

  const modalAction = event.target.closest("[data-modal-action]");
  if (modalAction) {
    await handleModalAction(modalAction.dataset.modalAction);
    return;
  }

  if (!event.target.closest(".menu-wrap") && !event.target.closest(".entity-menu-wrap") && !event.target.closest(".portal-menu")) {
    refs.moreMenu.classList.add("hidden");
    state.ui.libraryCreateOpen = false;
    state.ui.libraryEntityMenu = null;
    state.ui.libraryEntityMenuPosition = null;
    if (!event.target.closest(".chapter-switcher-shell")) {
      closeChapterOverlays();
    }
    updateLibraryHeader();
    renderLibraryPage();
    updateChapterPanel();
    renderPortalLayer();
    persist();
  }
}

function updateAll() {
  updateRoute();
  updateLibraryHeader();
  renderLibraryPage();
  hydrateEditor();
  updateTopBar();
  updateChapterPanel();
  updateSidebar();
  updateWorkspace();
  updateSettingsPanel();
  renderInspirationList();
  applyTheme();
  applyTypography();
  renderPortalLayer();
  updateModal();
}

function updateRoute() {
  const onEditor = state.route === "editor" && Boolean(getCurrentChapter());
  refs.libraryPage.classList.toggle("hidden", onEditor);
  refs.editorPage.classList.toggle("hidden", !onEditor);
  refs.editorPage.classList.toggle("focus-mode", state.ui.focusMode);
  if (onEditor) {
    requestAnimationFrame(() => refs.documentEditor.focus());
  } else {
    requestAnimationFrame(() => {
      refs.libraryContent.scrollTop = state.ui.libraryScrollTop ?? 0;
    });
  }
}

function updateLibraryHeader() {
  const path = getFolderPath(state.activeFolderId);
  refs.folderUpButton.disabled = state.activeFolderId == null;
  refs.createEntryMenu.classList.toggle("hidden", !state.ui.libraryCreateOpen);
  refs.librarySearchInput.value = state.ui.librarySearch;
  refs.librarySortSelect.value = state.ui.librarySort;
  refs.libraryBreadcrumb.innerHTML = path
    .map((folder, index) => {
      const isLast = index === path.length - 1;
      return `<button class="breadcrumb-chip ${isLast ? "active" : ""}" data-folder-nav="${folder.id ?? ""}">${escapeHtml(folder.name)}</button>`;
    })
    .join(`<span class="breadcrumb-sep">/</span>`);
}

function renderLibraryPage() {
  const folders = getVisibleFoldersInFolder(state.activeFolderId);
  const works = getVisibleWorksInFolder(state.activeFolderId);
  const currentFolder = getFolder(state.activeFolderId);
  const detailWork = getVisibleWorkDetail();
  const searchLabel = state.ui.librarySearch.trim() ? ` · 搜索“${escapeHtml(state.ui.librarySearch.trim())}”` : "";

  refs.libraryList.innerHTML = `
    ${detailWork ? renderWorkDetailPanel(detailWork) : ""}
    <section class="library-section surface">
      <div class="library-section-head">
        <div>
          <strong>文件夹</strong>
          <small>${currentFolder ? `${escapeHtml(currentFolder.name)} 内的子文件夹` : "根目录中的文件夹"}${searchLabel}</small>
        </div>
      </div>
      <div class="folder-grid">
        ${folders.length > 0 ? folders.map(renderFolderCard).join("") : `<div class="empty-state compact-empty">当前目录下还没有文件夹。</div>`}
      </div>
    </section>
    <section class="library-section surface">
      <div class="library-section-head">
        <div>
          <strong>作品</strong>
          <small>${works.length} 个作品，可直接进入写作或展开章节管理。</small>
        </div>
      </div>
      <div class="work-column">
        ${works.length > 0 ? works.map(renderWorkCard).join("") : renderEmptyLibraryState()}
      </div>
    </section>
  `;
}

function renderFolderCard(folder) {
  return `
    <article class="folder-card">
      <button class="folder-main" data-open-folder="${folder.id}">
        <div>
          <strong>${escapeHtml(folder.name)}</strong>
          <small>${getFoldersInFolder(folder.id).length} 个子文件夹 · ${getWorksInFolder(folder.id).length} 个作品</small>
        </div>
        <span class="folder-arrow">›</span>
      </button>
      <div class="entity-menu-wrap">
        <button class="icon-button" data-entity-menu-trigger data-entity-type="folder" data-entity-id="${folder.id}">⋯</button>
      </div>
    </article>
  `;
}

function renderWorkCard(work) {
  const chapters = getWorkChapters(work.id).slice(0, 3);
  const totalWords = getWorkWordCount(work.id);
  const folder = getFolder(work.folderId);

  return `
    <article class="work-card surface">
      <div class="work-card-head">
        <button class="work-main-entry" data-open-work="${work.id}">
          <strong>${escapeHtml(work.title)}</strong>
          <p>${escapeHtml(work.description || "暂无简介")}</p>
        </button>
        <div class="entity-menu-wrap">
          <button class="icon-button" data-entity-menu-trigger data-entity-type="work" data-entity-id="${work.id}">⋯</button>
        </div>
      </div>
      <div class="work-meta-row">
        <span class="tag">${work.chapterIds.length} 章</span>
        <span class="meta-chip">${totalWords} 字</span>
        <span class="meta-chip">${formatRelativeTime(work.updatedAt)}</span>
        ${folder ? `<span class="meta-chip">所在：${escapeHtml(folder.name)}</span>` : `<span class="meta-chip">根目录</span>`}
      </div>
      <div class="chapter-list">
        ${chapters.map((chapter) => renderChapterRow(work, chapter)).join("")}
      </div>
      <div class="work-card-footer">
        <button class="ghost-button compact-button" data-open-work="${work.id}">继续写作</button>
        <button class="ghost-button compact-button" data-manage-work="${work.id}">章节管理</button>
      </div>
    </article>
  `;
}

function renderChapterRow(work, chapter) {
  return `
    <div class="chapter-item">
      <button class="chapter-row ${chapter.id === state.activeChapterId && work.id === state.activeWorkId ? "active" : ""}" data-work-id="${work.id}" data-open-chapter="${chapter.id}">
        <span>${escapeHtml(chapter.title)}</span>
        <small>${chapter.wordCount} 字</small>
      </button>
      <div class="inline-actions">
        <button class="ghost-button compact-button" data-chapter-action="rename-chapter" data-work-id="${work.id}" data-chapter-id="${chapter.id}">重命名</button>
        <button class="ghost-button compact-button" data-chapter-action="delete-chapter" data-work-id="${work.id}" data-chapter-id="${chapter.id}">删除</button>
      </div>
    </div>
  `;
}

function renderWorkDetailPanel(work) {
  return `
    <section class="library-section surface">
      <div class="library-section-head">
        <div>
          <strong>章节管理</strong>
          <small>${escapeHtml(work.title)} · 最近更新 ${formatRelativeTime(work.updatedAt)}</small>
        </div>
        <div class="inline-actions">
          <button class="ghost-button compact-button" data-work-action="new-chapter" data-work-id="${work.id}">新建章节</button>
          <button class="ghost-button compact-button" data-work-action="close-detail" data-work-id="${work.id}">收起</button>
        </div>
      </div>
      <div class="chapter-list">
        ${getWorkChapters(work.id).map((chapter) => renderChapterRow(work, chapter)).join("")}
      </div>
    </section>
  `;
}

function renderEmptyLibraryState() {
  return `
    <div class="empty-state">
      <div>
        <strong>当前目录还是空的</strong>
        <p>还没有作品，点击右上角“新建”开始创作。</p>
      </div>
    </div>
  `;
}

function renderPortalLayer() {
  if (!refs.portalLayer) return;
  refs.portalLayer.innerHTML = [renderEntityMenuPortal(), renderChapterCreateMenuPortal(), renderChapterItemMenuPortal()].filter(Boolean).join("");
}

function renderEntityMenuPortal() {
  if (!state.ui.libraryEntityMenu || !state.ui.libraryEntityMenuPosition) return "";
  const [type, id] = state.ui.libraryEntityMenu.split(":");
  const buttons =
    type === "folder"
      ? [
          `<button data-entity-action="enter" data-entity-type="folder" data-entity-id="${id}">进入文件夹</button>`,
          `<button data-entity-action="rename" data-entity-type="folder" data-entity-id="${id}">重命名</button>`,
          `<button data-entity-action="delete" data-entity-type="folder" data-entity-id="${id}">删除</button>`,
        ]
      : [
          `<button data-entity-action="open" data-entity-type="work" data-entity-id="${id}">进入编辑页</button>`,
          `<button data-entity-action="detail" data-entity-type="work" data-entity-id="${id}">章节管理</button>`,
          `<button data-entity-action="rename" data-entity-type="work" data-entity-id="${id}">重命名</button>`,
          `<button data-entity-action="delete" data-entity-type="work" data-entity-id="${id}">删除</button>`,
        ];

  const { top, left } = state.ui.libraryEntityMenuPosition;
  return `<div class="dropdown-menu portal-menu" style="top:${top}px;left:${left}px;">${buttons.join("")}</div>`;
}

function renderChapterCreateMenuPortal() {
  if (!state.ui.chapterCreateMenuPosition) return "";
  const { top, left } = state.ui.chapterCreateMenuPosition;
  return `
    <div class="dropdown-menu portal-menu" style="top:${top}px;left:${left}px;">
      <button data-chapter-create-mode="end">在末尾新建</button>
      <button data-chapter-create-mode="after-current">在当前章节后插入</button>
      <button data-chapter-create-mode="before-current">在当前章节前插入</button>
    </div>
  `;
}

function renderChapterItemMenuPortal() {
  if (!state.ui.chapterItemMenu || !state.ui.chapterItemMenuPosition) return "";
  const { top, left } = state.ui.chapterItemMenuPosition;
  const chapter = getChapter(state.ui.chapterItemMenu);
  const work = chapter ? getWork(chapter.workId) : null;
  if (!chapter || !work) return "";
  const index = work.chapterIds.indexOf(chapter.id);
  return `
    <div class="dropdown-menu portal-menu" style="top:${top}px;left:${left}px;">
      <button data-chapter-item-action="rename" data-chapter-id="${chapter.id}">重命名</button>
      <button data-chapter-item-action="duplicate" data-chapter-id="${chapter.id}">复制</button>
      <button data-chapter-item-action="move-up" data-chapter-id="${chapter.id}" ${index <= 0 ? "disabled" : ""}>上移</button>
      <button data-chapter-item-action="move-down" data-chapter-id="${chapter.id}" ${index >= work.chapterIds.length - 1 ? "disabled" : ""}>下移</button>
      <button data-chapter-item-action="delete" data-chapter-id="${chapter.id}">删除</button>
    </div>
  `;
}

function getEntityMenuPosition(trigger) {
  const rect = trigger.getBoundingClientRect();
  const menuWidth = 196;
  const viewportPadding = 12;
  const left = Math.min(Math.max(viewportPadding, rect.right - menuWidth), window.innerWidth - menuWidth - viewportPadding);
  const top = Math.max(viewportPadding, Math.min(rect.bottom + 8, window.innerHeight - 220));
  return { top, left };
}

function hydrateEditor() {
  const chapter = getCurrentChapter();
  refs.documentEditor.disabled = !chapter;
  refs.chapterNotesInput.disabled = !chapter;
  refs.chapterOutlineInput.disabled = !chapter;
  refs.wordGoalInput.disabled = !chapter;
  if (!chapter) {
    refs.documentEditor.value = "";
    refs.chapterNotesInput.value = "";
    refs.chapterOutlineInput.value = "";
    refs.wordGoalInput.value = "0";
    refs.documentEditor.placeholder = "请先从目录页选择章节或新建章节。";
    refs.findQueryInput.value = state.ui.findQuery;
    refs.replaceQueryInput.value = state.ui.replaceQuery;
    return;
  }
  refs.documentEditor.placeholder = "开始写作……";
  if (refs.documentEditor.value !== chapter.content) refs.documentEditor.value = chapter.content;
  refs.chapterNotesInput.value = chapter.notes;
  refs.chapterOutlineInput.value = chapter.outline;
  refs.findQueryInput.value = state.ui.findQuery;
  refs.replaceQueryInput.value = state.ui.replaceQuery;
  refs.wordGoalInput.value = String(chapter.wordGoal);
}

function updateTopBar() {
  const work = getCurrentWork();
  const chapter = getCurrentChapter();
  refs.currentWorkTitle.textContent = work?.title ?? "未选择作品";
  refs.currentChapterTitle.textContent = chapter?.title ?? "请先返回目录页选择章节";
  refs.currentChapterMeta.textContent = chapter ? `${chapter.wordCount} 字 · ${formatRelativeTime(chapter.updatedAt)}` : "点击查看全部章节";
  refs.wordCountButton.textContent = `${countWords(chapter?.content ?? "")} 字`;
  refs.saveStatusPill.textContent = chapter ? `${chapter.saveStatus} · ${chapter.saveTime}` : "未打开章节";
}

function updateChapterPanel() {
  const work = getCurrentWork();
  const chapter = getCurrentChapter();
  refs.chapterPanel.classList.toggle("hidden", !state.ui.chapterPanelOpen || !work);
  if (!work) {
    refs.chapterPanelSummary.textContent = "请先打开作品";
    refs.chapterPanelList.innerHTML = `<div class="empty-inline">当前没有可管理的章节。</div>`;
    return;
  }

  const chapters = getWorkChapters(work.id);
  ensureFocusedChapter(work.id, chapters);
  refs.chapterPanelSummary.textContent = `${getWorkChapters(work.id).length} 章 · 当前 ${chapter?.title ?? "未选择"}`;
  refs.chapterPanelList.innerHTML =
    chapters.length > 0
      ? chapters.map((item, index) => renderEditorChapterPanelRow(work, item, index)).join("")
      : `<div class="empty-inline">当前作品还没有章节。</div>`;

  if (state.ui.chapterPanelOpen) {
    requestAnimationFrame(() => {
      const target =
        refs.chapterPanelList.querySelector(".chapter-panel-entry.focused") ??
        refs.chapterPanelList.querySelector(".chapter-panel-entry.active");
      target?.scrollIntoView({ block: "nearest" });
    });
  }
}

function renderEditorChapterPanelRow(work, chapter, index) {
  const isActive = chapter.id === state.activeChapterId;
  const isFocused = chapter.id === state.ui.chapterPanelFocusedId;
  return `
    <div
      class="chapter-panel-row"
      draggable="true"
      data-chapter-drag-row
      data-chapter-id="${chapter.id}"
      data-work-id="${work.id}"
      tabindex="0"
    >
      <button
        class="chapter-panel-entry ${isActive ? "active" : ""} ${isFocused ? "focused" : ""}"
        data-work-id="${work.id}"
        data-open-chapter="${chapter.id}"
      >
        <span class="chapter-panel-index" title="拖拽可排序">${getChapterOrderNumber(work.id, chapter.id)}</span>
        <span class="chapter-panel-text">
          <strong>${escapeHtml(chapter.title)}</strong>
          <small>${chapter.wordCount} 字 · ${formatRelativeTime(chapter.updatedAt)}</small>
        </span>
      </button>
      <button
        class="icon-button chapter-panel-item-button"
        data-chapter-item-menu-trigger
        data-chapter-id="${chapter.id}"
        title="章节操作"
      >⋯</button>
    </div>
  `;
}

function updateSidebar() {
  const chapter = getCurrentChapter();
  refs.chapterSidebar.classList.toggle("sidebar-collapsed", state.ui.leftSidebarCollapsed);
  refs.leftSidebarReopenButton.classList.toggle("hidden", !state.ui.leftSidebarCollapsed);
  refs.leftSidebarToggleButton.textContent = state.ui.leftSidebarCollapsed ? "展开" : "收起";
  refs.chapterNotesInput.parentElement.classList.toggle("muted-section", state.ui.sidebarSection !== "notes");
  refs.chapterOutlineInput.parentElement.classList.toggle("muted-section", state.ui.sidebarSection !== "outline");
  refs.bookmarkList.parentElement.classList.toggle("muted-section", state.ui.sidebarSection !== "bookmarks");
  if (!chapter) {
    refs.bookmarkList.innerHTML = `<span class="empty-inline">请先打开章节</span>`;
    return;
  }
  refs.bookmarkList.innerHTML =
    chapter.bookmarks.length > 0
      ? chapter.bookmarks
          .map((item, index) => `<button class="bookmark-pill" data-bookmark-index="${index}" data-bookmark-text="${escapeAttribute(item)}">${escapeHtml(item)}</button>`)
          .join("")
      : `<span class="empty-inline">还没有书签</span>`;
}

function updateWorkspace() {
  const chapter = getCurrentChapter();
  refs.workspaceSidebar.classList.toggle("sidebar-collapsed", state.ui.rightSidebarCollapsed);
  refs.rightSidebarReopenButton.classList.toggle("hidden", !state.ui.rightSidebarCollapsed);
  refs.workspaceTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === state.activeTab);
  });
  refs.workspacePanels.forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.panel !== state.activeTab);
  });
  refs.findReplaceBar.classList.toggle("hidden", !state.ui.replaceOpen);
  refs.selectionToolbar.classList.toggle("hidden", !state.ui.selectionVisible);
  refs.resumeHint.textContent = `上次位置：${state.ui.selectionStart}`;
  refs.wordGoalProgress.textContent = chapter ? `当前 ${countWords(chapter.content)} / 目标 ${chapter.wordGoal}` : "请先选择章节";
  refs.focusTimerValue.textContent = formatDuration(getFocusSeconds());
  refs.inspirationCompose.classList.toggle("hidden", !state.ui.inspirationComposeOpen);
}

function updateSettingsPanel() {
  if (!state.account.loggedIn) {
    refs.accountCard.innerHTML = `
      <div>
        <strong>未登录</strong>
        <p>登录后可同步草稿，但不会打断当前写作。</p>
      </div>
      <div class="tool-grid two-col">
        <button class="primary-button" data-account-action="email-login">邮箱登录</button>
        <button class="ghost-button" data-account-action="third-party-login">第三方登录</button>
      </div>
    `;
  } else {
    refs.accountCard.innerHTML = `
      <div class="account-main">
        <span class="avatar">${escapeHtml(state.account.avatar)}</span>
        <div>
          <strong>${escapeHtml(state.account.nickname)}</strong>
          <p>${escapeHtml(state.account.syncStatus)}</p>
        </div>
      </div>
      <button class="ghost-button" data-account-action="logout">退出登录</button>
    `;
  }

  refs.themeAccordionHint.textContent = state.ui.settingsThemeExpanded ? "点击收起主题设置" : "点击展开主题设置";
  refs.themeList.classList.toggle("hidden", !state.ui.settingsThemeExpanded);
  refs.themeList.innerHTML = state.theme.presets
    .map(
      (theme) => `
        <button class="theme-card ${theme.id === state.theme.currentId ? "active" : ""}" data-theme-id="${theme.id}">
          <span>${escapeHtml(theme.name)}</span>
          <span class="theme-swatches">
            <i style="background:${theme.palette.bg}"></i>
            <i style="background:${theme.palette.panel}"></i>
            <i style="background:${theme.palette.accent}"></i>
          </span>
        </button>
      `,
    )
    .join("");

  refs.fontFamilySelect.innerHTML = state.font.families
    .map((font) => `<option value="${font.id}" ${font.id === state.font.currentId ? "selected" : ""}>${escapeHtml(font.name)}</option>`)
    .join("");
  refs.fontSizeRange.value = String(state.font.size);
  refs.lineHeightRange.value = String(state.font.lineHeight);
  refs.letterSpacingRange.value = String(state.font.letterSpacing);
  refs.autosaveToggle.checked = state.ui.autosaveEnabled;

  refs.accountCard.querySelectorAll("[data-account-action]").forEach((button) => {
    button.addEventListener("click", () => handleAccountAction(button.dataset.accountAction));
  });
}

function renderInspirationList() {
  const work = getCurrentWork();
  const categories = getAvailableInspirationCategories();
  const editingItem = state.ui.inspirationEditingId
    ? getInspirationById(work?.id, state.ui.inspirationEditingId) ?? null
    : null;
  refs.inspirationCategoryFilter.innerHTML = categories
    .map((item) => `<option value="${item}">${item === "all" ? "全部分类" : escapeHtml(item)}</option>`)
    .join("");
  refs.inspirationCategoryFilter.value = state.inspirations.activeCategory;
  refs.inspirationSearchInput.value = state.inspirations.search;
  refs.inspirationCategoryManagerHint.textContent = state.ui.inspirationCategoryManagerExpanded ? "点击收起分类管理" : "点击展开分类管理";
  refs.inspirationCategoryManagerBody.classList.toggle("hidden", !state.ui.inspirationCategoryManagerExpanded);
  refs.inspirationComposeTitle.textContent = editingItem ? "编辑灵感" : "新建灵感";
  refs.inspirationComposeHint.textContent = editingItem ? "修改后会直接更新当前灵感条目。" : "填写内容和分类后保存到灵感列表。";
  refs.inspirationComposeCategory.innerHTML = categories
    .filter((item) => item !== "all")
    .map((item) => `<option value="${item}">${escapeHtml(item)}</option>`)
    .join("");
  refs.inspirationComposeCategory.value = refs.inspirationComposeCategory.value || state.ui.inspirationComposeTags[0] || "待补充";
  refs.inspirationCategoryList.innerHTML = categories
    .filter((item) => item !== "all")
    .map((item, index, items) => `
        <div class="inspiration-category-row">
          <span class="tag">${escapeHtml(item)}</span>
          <div class="inline-actions inspiration-category-actions">
            <button class="ghost-button compact-button" data-inspiration-category-action="move-up" data-category-name="${escapeAttribute(item)}" ${index === 0 ? "disabled" : ""}>上移</button>
            <button class="ghost-button compact-button" data-inspiration-category-action="move-down" data-category-name="${escapeAttribute(item)}" ${index === items.length - 1 ? "disabled" : ""}>下移</button>
            <button class="ghost-button compact-button" data-inspiration-category-action="rename" data-category-name="${escapeAttribute(item)}">重命名</button>
            <button class="ghost-button compact-button" data-inspiration-category-action="delete" data-category-name="${escapeAttribute(item)}">删除</button>
          </div>
        </div>`)
    .join("");
  refs.inspirationSelectedTags.innerHTML = state.ui.inspirationComposeTags
    .map(
      (tag) =>
        `<button class="bookmark-pill" data-inspiration-action="remove-tag" data-id="${escapeAttribute(tag)}">${escapeHtml(tag)} ×</button>`,
    )
    .join("");
  refs.inspirationSortButton.textContent = `排序：${
    state.inspirations.sort === "newest" ? "最新" : state.inspirations.sort === "oldest" ? "最早" : "收藏优先"
  }`;
  refs.saveInspirationButton.textContent = editingItem ? "保存修改" : "保存灵感";
  const items = getVisibleInspirations();
  refs.inspirationChatList.innerHTML =
    !work
      ? `<div class="empty-state">请先打开一个作品，再查看该作品的灵感。</div>`
      : items.length === 0
      ? `<div class="empty-state">没有符合条件的灵感。</div>`
      : items
          .map(
            (item) => `
              <article class="inspiration-bubble ${item.isPinned ? "pinned" : ""}">
                <header>
                  <span class="inspiration-tag-row">${getInspirationItemCategories(item).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</span>
                  <time>${escapeHtml(formatInspirationTime(item.updatedAt || item.createdAt))}</time>
                </header>
                <p>${escapeHtml(item.content)}</p>
                <footer>
                  <button data-inspiration-action="favorite" data-id="${item.id}">${item.isFavorite ? "取消收藏" : "收藏"}</button>
                  <button data-inspiration-action="pin" data-id="${item.id}">${item.isPinned ? "取消置顶" : "置顶"}</button>
                  <button data-inspiration-action="insert" data-id="${item.id}">插入正文</button>
                  <button data-inspiration-action="edit" data-id="${item.id}">编辑</button>
                  <button data-inspiration-action="delete" data-id="${item.id}">删除</button>
                </footer>
              </article>
            `,
          )
          .join("");
}

function updateModal() {
  const modal = state.ui.modal;
  refs.modalRoot.classList.toggle("hidden", !modal);
  if (!modal) {
    refs.modalRoot.innerHTML = "";
    return;
  }

  refs.modalRoot.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-card surface">
        <strong>${escapeHtml(modal.title)}</strong>
        ${modal.message ? `<p>${escapeHtml(modal.message)}</p>` : ""}
        ${modal.body ?? ""}
        <div class="modal-actions">
          ${modal.actions
            .map((action) => `<button class="${action.primary ? "primary-button" : "ghost-button"}" data-modal-action="${action.id}">${escapeHtml(action.label)}</button>`)
            .join("")}
        </div>
      </div>
    </div>
  `;
  queueModalFocus();
}

async function handleLibraryAction(action) {
  state.ui.libraryCreateOpen = false;
  if (action === "open-create-folder") {
    openCreateFolderModal();
  }
  if (action === "open-create-work") {
    openCreateWorkModal();
  }
  updateLibraryHeader();
  persist();
}

async function handleEntityAction(action, type, id) {
  state.ui.libraryEntityMenu = null;
  state.ui.libraryEntityMenuPosition = null;

  if (type === "folder") {
    if (action === "enter") openFolder(id);
    if (action === "rename") openRenameModal("folder", id);
    if (action === "delete") openDeleteFolderModal(id);
    return;
  }

  if (type === "work") {
    if (action === "open") await openWorkDefault(id);
    if (action === "detail") {
      state.ui.libraryWorkViewId = id;
      updateAll();
      persist();
    }
    if (action === "rename") openRenameModal("work", id);
    if (action === "delete") openDeleteWorkModal(id);
  }
}

async function handleWorkAction(action, workId) {
  const work = getWork(workId);
  if (!work) return;

  if (action === "new-chapter") {
    openCreateChapterModal(work.id);
    return;
  }

  if (action === "close-detail") {
    state.ui.libraryWorkViewId = null;
    updateAll();
    persist();
  }
}

async function handleChapterAction(action, workId, chapterId) {
  const work = getWork(workId);
  const chapter = getChapter(chapterId);
  if (!work || !chapter) return;

  if (action === "rename-chapter") {
    openRenameModal("chapter", chapter.id);
    return;
  }

  if (action === "delete-chapter") {
    openDeleteChapterModal(work.id, chapter.id);
  }
}

async function handleChapterItemAction(action, chapterId) {
  const chapter = getChapter(chapterId);
  const work = chapter ? getWork(chapter.workId) : null;
  if (!chapter || !work) return;

  state.ui.chapterItemMenu = null;
  state.ui.chapterItemMenuPosition = null;

  if (action === "rename") {
    openRenameModal("chapter", chapter.id);
    renderPortalLayer();
    return;
  }

  if (action === "duplicate") {
    duplicateChapter(work.id, chapter.id);
    await syncLibraryToDesktop();
    updateAll();
    return;
  }

  if (action === "move-up") {
    moveChapterWithinWork(work.id, chapter.id, -1);
    await syncLibraryToDesktop();
    updateAll();
    return;
  }

  if (action === "move-down") {
    moveChapterWithinWork(work.id, chapter.id, 1);
    await syncLibraryToDesktop();
    updateAll();
    return;
  }

  if (action === "delete") {
    openDeleteChapterModal(work.id, chapter.id);
    renderPortalLayer();
  }
}

function openCreateFolderModal() {
  state.ui.modal = {
    type: "create-folder",
    title: "新建文件夹",
    body: `
      <div class="modal-form">
        <label>文件夹名称</label>
        <input id="modal-folder-name" type="text" placeholder="例如：长篇连载" />
        <label>父级位置</label>
        <select id="modal-folder-parent">${renderFolderOptions(state.activeFolderId, true)}</select>
      </div>
    `,
    actions: [
      { id: "cancel-modal", label: "取消", primary: false },
      { id: "submit-create-folder", label: "创建文件夹", primary: true },
    ],
  };
  updateModal();
}

function openCreateWorkModal() {
  state.ui.modal = {
    type: "create-work",
    title: "新建作品",
    body: `
      <div class="modal-form">
        <label>作品名称</label>
        <input id="modal-work-title" type="text" placeholder="输入作品名称" />
        <label>作品简介</label>
        <textarea id="modal-work-description" rows="4" placeholder="简要说明作品方向"></textarea>
        <label>所属文件夹</label>
        <select id="modal-work-folder">${renderFolderOptions(state.activeFolderId, true)}</select>
        <label>默认章节模板</label>
        <select id="modal-work-template">
          <option value="blank">空白章节</option>
          <option value="intro">开场模板</option>
          <option value="outline">大纲模板</option>
        </select>
      </div>
    `,
    actions: [
      { id: "cancel-modal", label: "取消", primary: false },
      { id: "submit-create-work", label: "创建作品", primary: true },
    ],
  };
  updateModal();
}

function openCreateChapterModal(workId, options = {}) {
  const work = getWork(workId);
  const currentChapterId = options.referenceChapterId ?? state.activeChapterId;
  const hasCurrent = Boolean(currentChapterId && work?.chapterIds.includes(currentChapterId));
  const defaultMode = options.mode ?? (hasCurrent ? "after-current" : "end");
  state.ui.modal = {
    type: "create-chapter",
    payload: { workId, referenceChapterId: currentChapterId },
    title: "新建章节",
    body: `
      <div class="modal-form">
        <label>章节标题</label>
        <input id="modal-chapter-title" type="text" placeholder="例如：第三章：夜航" value="${escapeAttribute(generateDefaultChapterTitle(workId))}" />
        <label>插入位置</label>
        <select id="modal-chapter-position">
          <option value="end" ${defaultMode === "end" ? "selected" : ""}>在末尾新建</option>
          <option value="after-current" ${defaultMode === "after-current" ? "selected" : ""} ${hasCurrent ? "" : "disabled"}>在当前章节后插入</option>
          <option value="before-current" ${defaultMode === "before-current" ? "selected" : ""} ${hasCurrent ? "" : "disabled"}>在当前章节前插入</option>
        </select>
      </div>
    `,
    actions: [
      { id: "cancel-modal", label: "取消", primary: false },
      { id: "submit-create-chapter", label: "创建章节", primary: true },
    ],
  };
  updateModal();
}

function openRenameModal(entityType, entityId) {
  const entity = entityType === "folder" ? getFolder(entityId) : entityType === "work" ? getWork(entityId) : getChapter(entityId);
  if (!entity) return;
  state.ui.modal = {
    type: "rename-entity",
    payload: { entityType, entityId },
    title: entityType === "folder" ? "重命名文件夹" : entityType === "work" ? "重命名作品" : "重命名章节",
    body: `
      <div class="modal-form">
        <label>名称</label>
        <input id="modal-rename-value" type="text" value="${escapeAttribute(entity.name ?? entity.title)}" />
      </div>
    `,
    actions: [
      { id: "cancel-modal", label: "取消", primary: false },
      { id: "submit-rename-entity", label: "保存", primary: true },
    ],
  };
  updateModal();
}

function openDeleteWorkModal(workId) {
  const work = getWork(workId);
  if (!work) return;
  state.ui.modal = {
    type: "delete-work",
    payload: { workId },
    title: "删除作品",
    message: `确认删除作品“${work.title}”？将同时删除该作品下的全部章节数据。`,
    actions: [
      { id: "cancel-modal", label: "取消", primary: false },
      { id: "confirm-delete-work", label: "删除作品", primary: true },
    ],
  };
  updateModal();
}

function openDeleteChapterModal(workId, chapterId) {
  const chapter = getChapter(chapterId);
  if (!chapter) return;
  state.ui.modal = {
    type: "delete-chapter",
    payload: { workId, chapterId },
    title: "删除章节",
    message: `确认删除章节“${chapter.title}”？`,
    actions: [
      { id: "cancel-modal", label: "取消", primary: false },
      { id: "confirm-delete-chapter", label: "删除章节", primary: true },
    ],
  };
  updateModal();
}

function openDeleteFolderModal(folderId) {
  const folder = getFolder(folderId);
  if (!folder) return;
  const descendantIds = getDescendantFolderIds(folder.id);
  const affectedWorks = state.works.filter((work) => [folder.id, ...descendantIds].includes(work.folderId));
  const affectedChapterCount = affectedWorks.reduce((sum, work) => sum + work.chapterIds.length, 0);
  state.ui.modal = {
    type: "delete-folder",
    payload: { folderId },
    title: "删除文件夹",
    body: `
      <div class="modal-copy-block">
        <p>当前文件夹“${escapeHtml(folder.name)}”下共影响 ${descendantIds.length + 1} 个文件夹、${affectedWorks.length} 个作品、${affectedChapterCount} 个章节。</p>
        <p>你可以选择直接删除全部内容，或仅删除文件夹并将内部作品与子文件夹上移到上一级。</p>
      </div>
    `,
    actions: [
      { id: "cancel-modal", label: "取消", primary: false },
      { id: "confirm-delete-folder-keep", label: "删除文件夹并上移内容", primary: false },
      { id: "confirm-delete-folder-all", label: "连同内容一起删除", primary: true },
    ],
  };
  updateModal();
}

async function handleModalAction(action) {
  if (action === "cancel-modal" || action === "close-modal" || action === "cancel-back") {
    state.ui.modal = null;
    updateModal();
    return;
  }

  if (action === "submit-create-folder") {
    const name = refs.modalRoot.querySelector("#modal-folder-name")?.value.trim();
    const parentId = getNullableValue(refs.modalRoot.querySelector("#modal-folder-parent")?.value);
    if (!name) return;
    state.folders.push({ id: uid("folder"), name, parentId, createdAt: new Date().toISOString() });
    state.activeFolderId = parentId;
    state.ui.modal = null;
    await syncLibraryToDesktop();
    updateAll();
    return;
  }

  if (action === "submit-create-work") {
    const title = refs.modalRoot.querySelector("#modal-work-title")?.value.trim();
    const description = refs.modalRoot.querySelector("#modal-work-description")?.value.trim() || "";
    const folderId = getNullableValue(refs.modalRoot.querySelector("#modal-work-folder")?.value);
    const templateId = refs.modalRoot.querySelector("#modal-work-template")?.value || "blank";
    if (!title) return;
    createWorkWithInitialChapter({ title, description, folderId, templateId });
    state.activeFolderId = folderId;
    state.ui.modal = null;
    await syncLibraryToDesktop();
    updateAll();
    return;
  }

  if (action === "submit-create-chapter") {
    const workId = state.ui.modal?.payload?.workId;
    const referenceChapterId = state.ui.modal?.payload?.referenceChapterId ?? state.activeChapterId;
    const work = getWork(workId);
    const title = refs.modalRoot.querySelector("#modal-chapter-title")?.value.trim() || generateDefaultChapterTitle(workId);
    const insertMode = refs.modalRoot.querySelector("#modal-chapter-position")?.value || "end";
    if (!work) return;
    const chapter = createChapterForWork(work.id, title);
    insertChapterIntoWork(work, chapter.id, insertMode, referenceChapterId);
    work.updatedAt = new Date().toISOString();
    work.lastOpenedChapterId = chapter.id;
    state.activeWorkId = work.id;
    state.activeChapterId = chapter.id;
    state.ui.libraryWorkViewId = work.id;
    closeChapterOverlays();
    state.ui.modal = null;
    await syncLibraryToDesktop();
    updateAll();
    return;
  }

  if (action === "submit-rename-entity") {
    const next = refs.modalRoot.querySelector("#modal-rename-value")?.value.trim();
    const payload = state.ui.modal?.payload;
    if (!payload || !next) return;
    if (payload.entityType === "folder") getFolder(payload.entityId).name = next;
    if (payload.entityType === "work") getWork(payload.entityId).title = next;
    if (payload.entityType === "chapter") getChapter(payload.entityId).title = next;
    state.ui.modal = null;
    await syncLibraryToDesktop();
    updateAll();
    return;
  }

  if (action === "confirm-delete-work") {
    const workId = state.ui.modal?.payload?.workId;
    deleteWork(workId);
    state.ui.modal = null;
    await syncLibraryToDesktop();
    updateAll();
    return;
  }

  if (action === "confirm-delete-chapter") {
    const { workId, chapterId } = state.ui.modal?.payload ?? {};
    deleteChapter(workId, chapterId);
    state.ui.modal = null;
    await syncLibraryToDesktop();
    updateAll();
    return;
  }

  if (action === "confirm-delete-folder-all") {
    const folderId = state.ui.modal?.payload?.folderId;
    deleteFolderAndContents(folderId);
    state.ui.modal = null;
    await syncLibraryToDesktop();
    updateAll();
    return;
  }

  if (action === "confirm-delete-folder-keep") {
    const folderId = state.ui.modal?.payload?.folderId;
    deleteFolderKeepContents(folderId);
    state.ui.modal = null;
    await syncLibraryToDesktop();
    updateAll();
    return;
  }

  if (action === "save-and-back") {
    await saveCurrentChapter();
    state.route = "library";
    state.ui.modal = null;
    updateAll();
    return;
  }

  if (action === "discard-and-back") {
    const chapter = getCurrentChapter();
    if (!chapter) return;
    chapter.content = chapter.savedContent;
    chapter.dirty = false;
    chapter.saveStatus = "已保存";
    chapter.saveTime = "回退到上次保存";
    hydrateEditor();
    state.route = "library";
    state.ui.modal = null;
    updateAll();
  }
}

function createWorkWithInitialChapter({ title, description, folderId, templateId }) {
  const now = new Date().toISOString();
  const workId = uid("work");
  const template = DEFAULT_CHAPTER_TEMPLATE[templateId] ?? DEFAULT_CHAPTER_TEMPLATE.blank;
  const chapter = createChapterForWork(workId, template.chapterTitle, template);

  state.works.unshift({
    id: workId,
    title,
    description,
    folderId,
    chapterIds: [chapter.id],
    updatedAt: now,
    createdAt: now,
    lastOpenedChapterId: chapter.id,
  });
  state.inspirations.itemsByWork ??= {};
  state.inspirations.itemsByWork[workId] = [];
  resetInspirationViewState();
  state.ui.libraryWorkViewId = workId;
  state.activeWorkId = workId;
  state.activeChapterId = chapter.id;
}

function createChapterForWork(workId, title, template = DEFAULT_CHAPTER_TEMPLATE.blank) {
  const now = new Date().toISOString();
  const chapter = {
    id: uid("chapter"),
    workId,
    title,
    content: template.content ?? "",
    savedContent: template.content ?? "",
    notes: template.notes ?? "",
    bookmarks: [],
    wordGoal: 2000,
    outline: template.outline ?? "",
    wordCount: countWords(template.content ?? ""),
    updatedAt: now,
    createdAt: now,
    dirty: false,
    saveStatus: "已保存",
    saveTime: "刚刚",
    versions: [],
    history: { undo: [], redo: [] },
  };
  state.chapters.push(chapter);
  return chapter;
}

function deleteWork(workId) {
  const work = getWork(workId);
  if (!work) return;
  state.chapters = state.chapters.filter((chapter) => chapter.workId !== work.id);
  state.works = state.works.filter((item) => item.id !== work.id);
  if (state.inspirations.itemsByWork) delete state.inspirations.itemsByWork[work.id];
  if (state.ui.libraryWorkViewId === work.id) state.ui.libraryWorkViewId = null;
  if (state.activeWorkId === work.id) normalizeActiveSelection();
}

function deleteChapter(workId, chapterId) {
  const work = getWork(workId);
  const chapter = getChapter(chapterId);
  if (!work || !chapter) return;
  const chapterIndex = work.chapterIds.indexOf(chapter.id);
  work.chapterIds = work.chapterIds.filter((id) => id !== chapter.id);
  state.chapters = state.chapters.filter((item) => item.id !== chapter.id);
  if (work.lastOpenedChapterId === chapter.id) work.lastOpenedChapterId = work.chapterIds[0] ?? null;
  work.updatedAt = new Date().toISOString();
  if (work.chapterIds.length === 0) {
    deleteWork(work.id);
  } else if (state.activeChapterId === chapter.id) {
    state.activeWorkId = work.id;
    state.activeChapterId = work.chapterIds[Math.max(0, chapterIndex - 1)] ?? work.chapterIds[0];
    state.route = "editor";
  }
}

function deleteFolderAndContents(folderId) {
  const folder = getFolder(folderId);
  if (!folder) return;
  const descendantIds = [folder.id, ...getDescendantFolderIds(folder.id)];
  const workIds = state.works.filter((work) => descendantIds.includes(work.folderId)).map((work) => work.id);
  state.chapters = state.chapters.filter((chapter) => !workIds.includes(chapter.workId));
  state.works = state.works.filter((work) => !workIds.includes(work.id));
  workIds.forEach((workId) => {
    if (state.inspirations.itemsByWork) delete state.inspirations.itemsByWork[workId];
  });
  state.folders = state.folders.filter((item) => !descendantIds.includes(item.id));
  if (descendantIds.includes(state.activeFolderId)) state.activeFolderId = folder.parentId;
  if (workIds.includes(state.ui.libraryWorkViewId)) state.ui.libraryWorkViewId = null;
  normalizeActiveSelection();
}

function deleteFolderKeepContents(folderId) {
  const folder = getFolder(folderId);
  if (!folder) return;
  state.folders.forEach((item) => {
    if (item.parentId === folder.id) item.parentId = folder.parentId;
  });
  state.works.forEach((work) => {
    if (work.folderId === folder.id) work.folderId = folder.parentId;
  });
  state.folders = state.folders.filter((item) => item.id !== folder.id);
  if (state.activeFolderId === folder.id) state.activeFolderId = folder.parentId;
}

async function handleBackNavigation() {
  const chapter = getCurrentChapter();
  if (!chapter) {
    state.route = "library";
    updateRoute();
    return;
  }
  if (!chapter.dirty) {
    state.route = "library";
    updateRoute();
    return;
  }
  if (state.ui.autosaveEnabled) {
    await saveCurrentChapter();
    state.route = "library";
    updateRoute();
    return;
  }
  state.ui.modal = {
    type: "back-confirm",
    title: "返回文件管理页？",
    message: "当前章节还有未保存修改，返回前请决定如何处理。",
    actions: [
      { id: "save-and-back", label: "保存并返回", primary: true },
      { id: "discard-and-back", label: "不保存直接返回", primary: false },
      { id: "cancel-back", label: "取消", primary: false },
    ],
  };
  updateModal();
}

function handleFolderUp() {
  const current = getFolder(state.activeFolderId);
  openFolder(current?.parentId ?? null);
}

function openFolder(folderId) {
  state.activeFolderId = folderId ?? null;
  state.ui.libraryWorkViewId = getWorksInFolder(state.activeFolderId)[0]?.id ?? null;
  state.ui.libraryEntityMenu = null;
  state.ui.libraryScrollTop = 0;
  updateAll();
  persist();
}

async function openWorkDefault(workId) {
  const work = getWork(workId);
  if (!work) return;
  const targetChapterId = work.lastOpenedChapterId && work.chapterIds.includes(work.lastOpenedChapterId) ? work.lastOpenedChapterId : work.chapterIds[0];
  if (!targetChapterId) return;
  await openChapter(work.id, targetChapterId);
}

async function openChapter(workId, chapterId) {
  const previous = getCurrentChapter();
  if (previous && previous.dirty && state.ui.autosaveEnabled) await saveCurrentChapter();
  state.ui.libraryScrollTop = refs.libraryContent?.scrollTop ?? state.ui.libraryScrollTop;
  handleInspirationWorkChange(workId, state.activeWorkId);
  state.activeWorkId = workId;
  state.activeChapterId = chapterId;
  state.route = "editor";
  state.activeTab = "writing";
  closeChapterMenus();
  state.ui.chapterPanelOpen = false;
  const work = getWork(workId);
  if (work) {
    work.lastOpenedChapterId = chapterId;
    work.updatedAt = new Date().toISOString();
  }
  hydrateEditor();
  updateAll();
  restoreSelection(0, 0);
}

function handleBeforeInput() {
  if (suppressHistory) return;
  const chapter = getCurrentChapter();
  if (!chapter) return;
  pushUndoSnapshot(chapter, refs.documentEditor.value, refs.documentEditor.selectionStart, refs.documentEditor.selectionEnd);
}

function handleEditorInput() {
  const chapter = getCurrentChapter();
  const work = getCurrentWork();
  if (!chapter || !work) return;
  chapter.content = refs.documentEditor.value;
  chapter.wordCount = countWords(chapter.content);
  chapter.updatedAt = new Date().toISOString();
  chapter.dirty = chapter.content !== chapter.savedContent;
  chapter.saveStatus = state.ui.autosaveEnabled ? "保存中" : "未保存";
  chapter.saveTime = "刚刚修改";
  work.updatedAt = chapter.updatedAt;
  work.lastOpenedChapterId = chapter.id;
  state.account.syncStatus = state.account.loggedIn ? "同步等待中" : "本地写作中";
  state.ui.selectionStart = refs.documentEditor.selectionStart;
  state.ui.selectionEnd = refs.documentEditor.selectionEnd;
  updateTopBar();
  updateWorkspace();
  persist();
  queueAutosave();
}

function handleEditorKeydown(event) {
  const pairs = { "(": ")", "（": "）", "[": "]", "【": "】", "\"": "\"", "“": "”", "'": "'" };
  const key = event.key.toLowerCase();

  if ((event.metaKey || event.ctrlKey) && event.shiftKey && key === "o") {
    event.preventDefault();
    openChapterPanelForKeyboard();
    return;
  }
  if ((event.metaKey || event.ctrlKey) && key === "f") {
    event.preventDefault();
    state.ui.replaceOpen = true;
    updateWorkspace();
    refs.findQueryInput.focus();
    return;
  }
  if (event.altKey && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.key === "ArrowUp") {
    event.preventDefault();
    jumpChapter(-1);
    return;
  }
  if (event.altKey && !event.metaKey && !event.ctrlKey && !event.shiftKey && event.key === "ArrowDown") {
    event.preventDefault();
    jumpChapter(1);
    return;
  }
  if ((event.metaKey || event.ctrlKey) && key === "z" && !event.shiftKey) {
    event.preventDefault();
    undoEditor();
    return;
  }
  if ((event.metaKey || event.ctrlKey) && (key === "y" || (key === "z" && event.shiftKey))) {
    event.preventDefault();
    redoEditor();
    return;
  }
  if (pairs[event.key] && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    insertPair(event.key, pairs[event.key]);
  }
}

function handleEditorFocus() {
  state.ui.lastFocused = true;
  startFocusTimer();
}

function handleEditorBlur() {
  state.ui.lastFocused = false;
  stopFocusTimer();
}

function handleNotesInput(event) {
  const chapter = getCurrentChapter();
  if (!chapter) return;
  chapter.notes = event.target.value;
  persist();
}

function handleOutlineInput(event) {
  const chapter = getCurrentChapter();
  if (!chapter) return;
  chapter.outline = event.target.value;
  persist();
}

function handleWordGoalInput(event) {
  const chapter = getCurrentChapter();
  if (!chapter) return;
  chapter.wordGoal = Number(event.target.value) || 0;
  updateWorkspace();
  persist();
}

function handleWritingAction(action) {
  if (action === "divider") insertAtCursor("\n\n——\n\n");
  if (action === "toggle-find") {
    state.ui.replaceOpen = !state.ui.replaceOpen;
    updateWorkspace();
  }
  if (action === "undo") undoEditor();
  if (action === "redo") redoEditor();
  if (action === "prev") jumpChapter(-1);
  if (action === "next") jumpChapter(1);
  if (action === "resume") restoreSelection(state.ui.selectionStart, state.ui.selectionEnd);
  if (action === "open-notes") {
    state.ui.leftSidebarCollapsed = false;
    state.ui.sidebarSection = "notes";
    updateSidebar();
    persist();
  }
  if (action === "open-outline") {
    state.ui.leftSidebarCollapsed = false;
    state.ui.sidebarSection = "outline";
    updateSidebar();
    persist();
  }
  if (action === "open-bookmarks") {
    state.ui.leftSidebarCollapsed = false;
    state.ui.sidebarSection = "bookmarks";
    updateSidebar();
    persist();
  }
}

async function handleMenuAction(action) {
  refs.moreMenu.classList.add("hidden");
  const chapter = getCurrentChapter();
  const work = getCurrentWork();
  if (!chapter || !work) return;

  if (action === "rename-chapter") {
    openRenameModal("chapter", chapter.id);
    return;
  }

  if (action === "move-chapter") {
    state.ui.chapterPanelOpen = true;
    updateChapterPanel();
    persist();
    return;
  }

  if (action === "delete-chapter") {
    openDeleteChapterModal(work.id, chapter.id);
    return;
  }

  if (action === "history") {
    state.ui.modal = {
      type: "history",
      title: "历史版本",
      message: "以下是当前章节自动保存过的版本。",
      body: `<div class="history-list">${
        chapter.versions.length > 0
          ? chapter.versions.map((version) => `<div class="history-row"><strong>${escapeHtml(version.label)}</strong><span>${escapeHtml(version.time)}</span></div>`).join("")
          : `<div class="empty-inline">暂无历史版本</div>`
      }</div>`,
      actions: [{ id: "close-modal", label: "关闭", primary: true }],
    };
    updateModal();
    return;
  }

  if (action === "shortcuts") {
    state.ui.modal = {
      type: "shortcuts",
      title: "快捷键说明",
      message: "以下快捷键可在编辑页和章节面板中使用。",
      body: `
        <div class="history-list">
          <div class="history-row"><strong>Ctrl / Cmd + Shift + O</strong><span>打开章节面板并聚焦搜索</span></div>
          <div class="history-row"><strong>↑ / ↓</strong><span>在章节面板中移动焦点</span></div>
          <div class="history-row"><strong>Enter</strong><span>在章节面板中切换到当前焦点章节</span></div>
          <div class="history-row"><strong>Esc</strong><span>关闭章节面板并返回正文</span></div>
          <div class="history-row"><strong>Alt + ↑ / ↓</strong><span>在编辑器中快速切换上一章 / 下一章</span></div>
          <div class="history-row"><strong>拖拽章节行</strong><span>在章节面板中调整章节顺序</span></div>
        </div>
      `,
      actions: [{ id: "close-modal", label: "关闭", primary: true }],
    };
    updateModal();
    return;
  }

  if (action === "export") {
    exportCurrentChapter();
    return;
  }

  if (action === "focus") {
    state.ui.focusMode = !state.ui.focusMode;
    refs.editorPage.classList.toggle("focus-mode", state.ui.focusMode);
    persist();
    return;
  }

  if (action === "night") {
    state.theme.nightMode = !state.theme.nightMode;
    applyTheme();
    persist();
  }
}

function handleInspirationAction(action, id) {
  if (action === "remove-tag") {
    state.ui.inspirationComposeTags = state.ui.inspirationComposeTags.filter((tag) => tag !== id);
    if (state.ui.inspirationComposeTags.length === 0) state.ui.inspirationComposeTags = ["待补充"];
    renderInspirationList();
    persist();
    return;
  }
  const work = getCurrentWork();
  if (!work) return;
  const item = getInspirationById(work.id, id);
  if (!item) return;
  if (action === "favorite") item.isFavorite = !item.isFavorite;
  if (action === "pin") item.isPinned = !item.isPinned;
  if (action === "insert") insertAtCursor(item.content);
  if (action === "edit") {
    openInspirationComposer(item.id);
    return;
  }
  if (action === "delete") {
    setInspirationsForWork(
      work.id,
      getInspirationsForWork(work.id).filter((entry) => entry.id !== id),
    );
    if (state.ui.inspirationEditingId === id) closeInspirationComposer(false);
  } else {
    item.updatedAt = new Date().toISOString();
  }
  renderInspirationList();
  persist();
}

function handleInspirationCategoryAction(action, categoryName) {
  if (!categoryName) return;

  if (action === "rename") {
    const next = prompt("重命名分类", categoryName)?.trim();
    if (!next || next === categoryName) return;
    if (hasDuplicateInspirationCategoryName(categoryName, next)) {
      alert(`分类“${next}”已经存在，请换一个名字。`);
      return;
    }
    renameInspirationCategory(categoryName, next);
    renderInspirationList();
    persist();
    return;
  }

  if (action === "delete") {
    const affectedCount = getInspirationCategoryUsageCount(categoryName);
    if (!confirm(`确认删除分类“${categoryName}”？将影响 ${affectedCount} 条灵感，已有灵感会移除这个分类标签。`)) return;
    deleteInspirationCategory(categoryName);
    renderInspirationList();
    persist();
    return;
  }

  if (action === "move-up" || action === "move-down") {
    moveInspirationCategory(categoryName, action === "move-up" ? -1 : 1);
    renderInspirationList();
    persist();
  }
}

function handleAccountAction(action) {
  const chapter = getCurrentChapter();
  if (action === "email-login") {
    state.account.loggedIn = true;
    state.account.nickname = "邮箱用户";
    state.account.avatar = "EM";
    state.account.syncStatus = chapter?.dirty ? "同步等待中" : "已连接云端，同步正常";
  }
  if (action === "third-party-login") {
    state.account.loggedIn = true;
    state.account.nickname = "第三方用户";
    state.account.avatar = "TP";
    state.account.syncStatus = chapter?.dirty ? "同步等待中" : "已连接云端，同步正常";
  }
  if (action === "logout") {
    state.account.loggedIn = false;
    state.account.nickname = "未登录用户";
    state.account.avatar = "SF";
    state.account.syncStatus = "本地写作中";
  }
  updateSettingsPanel();
  persist();
}

function toggleLeftSidebar() {
  state.ui.leftSidebarCollapsed = !state.ui.leftSidebarCollapsed;
  updateSidebar();
  persist();
}

function toggleRightSidebar() {
  state.ui.rightSidebarCollapsed = !state.ui.rightSidebarCollapsed;
  updateWorkspace();
  persist();
}

function toggleThemeAccordion() {
  state.ui.settingsThemeExpanded = !state.ui.settingsThemeExpanded;
  updateSettingsPanel();
  persist();
}

function toggleInspirationCategoryManager() {
  state.ui.inspirationCategoryManagerExpanded = !state.ui.inspirationCategoryManagerExpanded;
  renderInspirationList();
  persist();
}

function openInspirationComposer(editingId = null) {
  const work = getCurrentWork();
  const editingItem = editingId && work ? getInspirationById(work.id, editingId) ?? null : null;
  state.ui.inspirationComposeOpen = true;
  state.ui.inspirationEditingId = editingItem?.id ?? null;
  state.ui.inspirationComposeTags = editingItem
    ? getInspirationItemCategories(editingItem)
    : state.ui.inspirationComposeTags.length > 0
      ? state.ui.inspirationComposeTags
      : ["待补充"];
  updateWorkspace();
  renderInspirationList();
  requestAnimationFrame(() => {
    refs.inspirationComposeInput.value = editingItem?.content ?? "";
    refs.inspirationComposeCategory.value = state.ui.inspirationComposeTags[0] || "待补充";
    refs.inspirationCustomCategoryInput.value = "";
    refs.inspirationComposeInput.focus();
    refs.inspirationComposeInput.setSelectionRange(refs.inspirationComposeInput.value.length, refs.inspirationComposeInput.value.length);
  });
  persist();
}

function closeInspirationComposer(shouldPersist = true) {
  state.ui.inspirationComposeOpen = false;
  state.ui.inspirationEditingId = null;
  refs.inspirationComposeInput.value = "";
  refs.inspirationComposeCategory.value = "待补充";
  refs.inspirationCustomCategoryInput.value = "";
  state.ui.inspirationComposeTags = ["待补充"];
  updateWorkspace();
  renderInspirationList();
  if (shouldPersist) persist();
}

function addSelectedInspirationCategory() {
  const selected = refs.inspirationComposeCategory.value;
  const custom = refs.inspirationCustomCategoryInput.value.trim();
  const nextTags = new Set(state.ui.inspirationComposeTags);
  if (selected) nextTags.add(selected);
  if (custom) {
    createInspirationCategory(custom);
    nextTags.add(custom);
  }
  state.ui.inspirationComposeTags = [...nextTags];
  ensureInspirationCategoriesInOrder(state.ui.inspirationComposeTags);
  refs.inspirationCustomCategoryInput.value = "";
  renderInspirationList();
  persist();
}

function handleCreateInspirationCategory() {
  const name = refs.inspirationCategoryCreateInput.value.trim();
  if (!name) return;
  if (!createInspirationCategory(name)) {
    alert(`分类“${name}”已经存在，请换一个名字。`);
    return;
  }
  refs.inspirationCategoryCreateInput.value = "";
  state.ui.inspirationCategoryManagerExpanded = true;
  renderInspirationList();
  persist();
}

function createInspirationCategory(name) {
  const normalizedName = String(name || "").trim();
  if (!normalizedName) return false;
  if (hasDuplicateInspirationCategoryName(null, normalizedName)) return false;
  ensureInspirationCategoriesInOrder([normalizedName]);
  syncInspirationCategoryOrder();
  return true;
}

function renameInspirationCategory(from, to) {
  getAllInspirations().forEach((item) => {
    const tags = getInspirationItemCategories(item).map((tag) => (tag === from ? to : tag));
    item.categories = [...new Set(tags)];
    item.category = item.categories[0];
    item.updatedAt = new Date().toISOString();
  });
  state.ui.inspirationComposeTags = state.ui.inspirationComposeTags.map((tag) => (tag === from ? to : tag));
  state.inspirations.categoryOrder = state.inspirations.categoryOrder.map((tag) => (tag === from ? to : tag));
  state.inspirations.categoryOrder = [...new Set(state.inspirations.categoryOrder)];
  if (state.inspirations.activeCategory === from) state.inspirations.activeCategory = to;
  syncInspirationCategoryOrder();
}

function deleteInspirationCategory(categoryName) {
  getAllInspirations().forEach((item) => {
    const tags = getInspirationItemCategories(item).filter((tag) => tag !== categoryName);
    item.categories = tags.length > 0 ? tags : ["待补充"];
    item.category = item.categories[0];
    item.updatedAt = new Date().toISOString();
  });
  state.ui.inspirationComposeTags = state.ui.inspirationComposeTags.filter((tag) => tag !== categoryName);
  if (state.ui.inspirationComposeTags.length === 0) state.ui.inspirationComposeTags = ["待补充"];
  state.inspirations.categoryOrder = state.inspirations.categoryOrder.filter((tag) => tag !== categoryName);
  if (state.inspirations.activeCategory === categoryName) state.inspirations.activeCategory = "all";
  syncInspirationCategoryOrder();
}

function moveInspirationCategory(categoryName, direction) {
  syncInspirationCategoryOrder();
  const index = state.inspirations.categoryOrder.indexOf(categoryName);
  if (index === -1) return;
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= state.inspirations.categoryOrder.length) return;
  const [moved] = state.inspirations.categoryOrder.splice(index, 1);
  state.inspirations.categoryOrder.splice(nextIndex, 0, moved);
}

function hasDuplicateInspirationCategoryName(currentName, nextName) {
  const normalizedCurrent = normalizeInspirationCategoryName(currentName);
  const normalizedNext = normalizeInspirationCategoryName(nextName);
  return getAvailableInspirationCategories()
    .filter((item) => item !== "all")
    .some((item) => normalizeInspirationCategoryName(item) === normalizedNext && normalizeInspirationCategoryName(item) !== normalizedCurrent);
}

function getInspirationCategoryUsageCount(categoryName) {
  return getInspirationsForWork(state.activeWorkId).filter((item) => getInspirationItemCategories(item).includes(categoryName)).length;
}

function normalizeInspirationCategoryName(name) {
  return String(name || "").trim().toLowerCase();
}

function ensureInspirationCategoriesInOrder(categories) {
  categories.forEach((category) => {
    if (!state.inspirations.categoryOrder.includes(category)) {
      state.inspirations.categoryOrder.push(category);
    }
  });
}

function syncInspirationCategoryOrder() {
  const availableCategories = new Set();
  inspirationCategories.filter((item) => item !== "all").forEach((item) => availableCategories.add(item));
  state.inspirations.categoryOrder.forEach((item) => availableCategories.add(item));
  getAllInspirations().forEach((item) => {
    getInspirationItemCategories(item).forEach((tag) => availableCategories.add(tag));
  });
  state.ui.inspirationComposeTags.forEach((tag) => availableCategories.add(tag));

  const ordered = state.inspirations.categoryOrder.filter((item) => availableCategories.has(item));
  for (const category of availableCategories) {
    if (!ordered.includes(category)) ordered.push(category);
  }
  state.inspirations.categoryOrder = ordered;
}

function saveComposedInspiration() {
  const work = getCurrentWork();
  if (!work) return;
  const text = refs.inspirationComposeInput.value.trim();
  addSelectedInspirationCategory();
  const categories = state.ui.inspirationComposeTags.length > 0 ? state.ui.inspirationComposeTags : ["待补充"];
  if (!text) return;
  const now = new Date().toISOString();
  const editingItem = state.ui.inspirationEditingId
    ? getInspirationById(work.id, state.ui.inspirationEditingId) ?? null
    : null;
  if (editingItem) {
    editingItem.content = text;
    editingItem.categories = categories;
    editingItem.category = categories[0];
    editingItem.updatedAt = now;
  } else {
    createInspiration(work.id, {
      chapterId: state.activeChapterId ?? null,
      content: text,
      categories,
      category: categories[0],
      isPinned: false,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    });
  }
  closeInspirationComposer();
  renderInspirationList();
  persist();
}

function jumpChapter(direction) {
  const work = getCurrentWork();
  if (!work || work.chapterIds.length === 0) return;
  const chapters = getWorkChapters(work.id);
  const currentIndex = chapters.findIndex((chapter) => chapter.id === state.activeChapterId);
  const nextIndex = Math.max(0, Math.min(chapters.length - 1, currentIndex + direction));
  if (nextIndex === currentIndex) return;
  void openChapter(work.id, chapters[nextIndex].id);
}

function captureSelection() {
  const start = refs.documentEditor.selectionStart;
  const end = refs.documentEditor.selectionEnd;
  state.ui.selectionStart = start;
  state.ui.selectionEnd = end;
  state.ui.selectionVisible = end > start;
  refs.selectionToolbar.classList.toggle("hidden", !state.ui.selectionVisible);
  persist();
}

function restoreSelection(start, end) {
  refs.documentEditor.focus();
  refs.documentEditor.selectionStart = start;
  refs.documentEditor.selectionEnd = end;
  captureSelection();
}

function handleBeforeSelectionMutation() {
  const chapter = getCurrentChapter();
  if (!chapter) return;
  pushUndoSnapshot(chapter, refs.documentEditor.value, refs.documentEditor.selectionStart, refs.documentEditor.selectionEnd);
}

function insertAtCursor(text) {
  if (document.activeElement !== refs.documentEditor) {
    refs.documentEditor.focus();
    refs.documentEditor.selectionStart = state.ui.selectionStart;
    refs.documentEditor.selectionEnd = state.ui.selectionEnd;
  } else {
    refs.documentEditor.focus();
  }
  handleBeforeSelectionMutation();
  const start = refs.documentEditor.selectionStart ?? state.ui.selectionStart;
  const end = refs.documentEditor.selectionEnd ?? state.ui.selectionEnd;
  refs.documentEditor.setRangeText(text, start, end, "end");
  handleEditorInput();
  captureSelection();
}

function insertPair(left, right) {
  refs.documentEditor.focus();
  handleBeforeSelectionMutation();
  const start = refs.documentEditor.selectionStart;
  const end = refs.documentEditor.selectionEnd;
  const selected = refs.documentEditor.value.slice(start, end);
  refs.documentEditor.setRangeText(`${left}${selected}${right}`, start, end, "select");
  refs.documentEditor.selectionStart = start + 1;
  refs.documentEditor.selectionEnd = end + 1;
  handleEditorInput();
  captureSelection();
}

function applySelectionAction(action) {
  const chapter = getCurrentChapter();
  if (!chapter) return;
  const start = refs.documentEditor.selectionStart;
  const end = refs.documentEditor.selectionEnd;
  if (start === end) return;
  const selected = refs.documentEditor.value.slice(start, end);
  if (action === "quote") {
    insertAtCursor(`“${selected}”`);
    return;
  }
  if (action === "divider") {
    insertAtCursor(`\n\n—— ${selected} ——\n\n`);
    return;
  }
  if (action === "bookmark") {
    chapter.bookmarks.unshift(selected.slice(0, 18));
    updateSidebar();
    persist();
    state.ui.selectionVisible = false;
    refs.selectionToolbar.classList.add("hidden");
  }
}

function addBookmarkFromSelection() {
  const chapter = getCurrentChapter();
  if (!chapter) return;
  const start = refs.documentEditor.selectionStart;
  const end = refs.documentEditor.selectionEnd;
  const source = start !== end ? refs.documentEditor.value.slice(start, end) : `书签 ${chapter.bookmarks.length + 1}`;
  chapter.bookmarks.unshift(source.slice(0, 18));
  updateSidebar();
  persist();
}

function pushUndoSnapshot(chapter, content, selectionStart, selectionEnd) {
  const stack = chapter.history.undo;
  const last = stack[stack.length - 1];
  if (last && last.content === content) return;
  stack.push({ content, selectionStart, selectionEnd });
  if (stack.length > 120) stack.shift();
  chapter.history.redo = [];
}

function undoEditor() {
  const chapter = getCurrentChapter();
  if (!chapter) return;
  const previous = chapter.history.undo.pop();
  if (!previous) return;
  chapter.history.redo.push({
    content: refs.documentEditor.value,
    selectionStart: refs.documentEditor.selectionStart,
    selectionEnd: refs.documentEditor.selectionEnd,
  });
  applySnapshot(previous);
}

function redoEditor() {
  const chapter = getCurrentChapter();
  if (!chapter) return;
  const next = chapter.history.redo.pop();
  if (!next) return;
  chapter.history.undo.push({
    content: refs.documentEditor.value,
    selectionStart: refs.documentEditor.selectionStart,
    selectionEnd: refs.documentEditor.selectionEnd,
  });
  applySnapshot(next);
}

function applySnapshot(snapshot) {
  suppressHistory = true;
  refs.documentEditor.value = snapshot.content;
  refs.documentEditor.selectionStart = snapshot.selectionStart;
  refs.documentEditor.selectionEnd = snapshot.selectionEnd;
  suppressHistory = false;
  handleEditorInput();
  captureSelection();
}

function findNext() {
  const query = state.ui.findQuery;
  if (!query) return;
  const content = refs.documentEditor.value;
  const startFrom = refs.documentEditor.selectionEnd || 0;
  let index = content.indexOf(query, startFrom);
  if (index === -1) index = content.indexOf(query, 0);
  if (index === -1) return;
  restoreSelection(index, index + query.length);
}

function replaceCurrent() {
  const start = refs.documentEditor.selectionStart;
  const end = refs.documentEditor.selectionEnd;
  if (start === end) return;
  handleBeforeSelectionMutation();
  refs.documentEditor.setRangeText(state.ui.replaceQuery, start, end, "end");
  handleEditorInput();
  captureSelection();
}

function queueAutosave() {
  clearTimeout(autosaveTimer);
  if (!state.ui.autosaveEnabled) return;
  autosaveTimer = setTimeout(() => {
    void saveCurrentChapter();
  }, 700);
}

async function saveCurrentChapter() {
  clearTimeout(autosaveTimer);
  const chapter = getCurrentChapter();
  const work = getCurrentWork();
  if (!chapter || !work) return;
  if (!chapter.dirty && chapter.saveStatus === "已保存") return;
  chapter.savedContent = chapter.content;
  chapter.wordCount = countWords(chapter.content);
  chapter.updatedAt = new Date().toISOString();
  chapter.dirty = false;
  chapter.saveStatus = "已保存";
  chapter.saveTime = timeNow();
  work.updatedAt = chapter.updatedAt;
  work.lastOpenedChapterId = chapter.id;
  if (!chapter.versions[0] || chapter.versions[0].content !== chapter.content) {
    chapter.versions.unshift({ id: uid("version"), label: "自动保存版本", time: `今天 ${timeNow()}`, content: chapter.content });
    chapter.versions = chapter.versions.slice(0, 20);
  }
  state.account.syncStatus = state.account.loggedIn ? "已连接云端，同步正常" : "本地写作中";
  await syncLibraryToDesktop();
  updateTopBar();
  persist();
}

function startFocusTimer() {
  if (focusTimer) return;
  state.ui.focusStartedAt ??= Date.now();
  focusTimer = setInterval(() => {
    refs.focusTimerValue.textContent = formatDuration(getFocusSeconds());
  }, 1000);
}

function stopFocusTimer() {
  if (state.ui.focusStartedAt) {
    state.ui.focusAccumulated += Date.now() - state.ui.focusStartedAt;
    state.ui.focusStartedAt = null;
  }
  clearInterval(focusTimer);
  focusTimer = null;
  updateWorkspace();
  persist();
}

function getFocusSeconds() {
  const running = state.ui.focusStartedAt ? Date.now() - state.ui.focusStartedAt : 0;
  return Math.floor((state.ui.focusAccumulated + running) / 1000);
}

function switchTab(tabId) {
  state.activeTab = tabId;
  updateWorkspace();
  if (tabId === "writing") refs.documentEditor.focus();
  persist();
}

function toggleChapterPanel() {
  if (!getCurrentWork()) return;
  state.ui.chapterPanelOpen = !state.ui.chapterPanelOpen;
  if (state.ui.chapterPanelOpen) {
    state.ui.chapterPanelFocusedId = state.activeChapterId;
  }
  closeChapterMenus();
  updateChapterPanel();
  renderPortalLayer();
  persist();
}

function toggleChapterCreateMenu(trigger) {
  if (!getCurrentWork()) return;
  const nextPosition = getPopupPosition(trigger, 196);
  const samePosition =
    state.ui.chapterCreateMenuPosition &&
    Math.abs(state.ui.chapterCreateMenuPosition.top - nextPosition.top) < 1 &&
    Math.abs(state.ui.chapterCreateMenuPosition.left - nextPosition.left) < 1;
  state.ui.chapterCreateMenuPosition = samePosition ? null : nextPosition;
  state.ui.chapterItemMenu = null;
  state.ui.chapterItemMenuPosition = null;
  renderPortalLayer();
  persist();
}

function handleChapterCreateRequest(mode) {
  const work = getCurrentWork();
  const chapter = getCurrentChapter();
  if (!work) return;
  state.ui.chapterPanelOpen = true;
  state.ui.chapterCreateMenuPosition = null;
  openCreateChapterModal(work.id, {
    mode,
    referenceChapterId: chapter?.id ?? work.chapterIds[0] ?? null,
  });
  renderPortalLayer();
  persist();
}

function toggleChapterItemMenu(chapterId, trigger) {
  const nextKey = String(chapterId);
  if (state.ui.chapterItemMenu === nextKey) {
    state.ui.chapterItemMenu = null;
    state.ui.chapterItemMenuPosition = null;
  } else {
    state.ui.chapterItemMenu = nextKey;
    state.ui.chapterItemMenuPosition = getPopupPosition(trigger, 180);
  }
  state.ui.chapterCreateMenuPosition = null;
  renderPortalLayer();
  persist();
}

function closeChapterMenus() {
  state.ui.chapterCreateMenuPosition = null;
  state.ui.chapterItemMenu = null;
  state.ui.chapterItemMenuPosition = null;
}

function closeChapterOverlays() {
  state.ui.chapterPanelOpen = false;
  state.ui.chapterPanelFocusedId = null;
  closeChapterMenus();
}

function toggleInspirationSort() {
  state.inspirations.sort =
    state.inspirations.sort === "newest" ? "oldest" : state.inspirations.sort === "oldest" ? "favorite" : "newest";
  renderInspirationList();
  persist();
}

function getVisibleInspirations() {
  let items = [...getInspirationsForWork(state.activeWorkId)];
  if (state.inspirations.activeCategory !== "all") {
    items = items.filter((item) => getInspirationItemCategories(item).includes(state.inspirations.activeCategory));
  }
  if (state.inspirations.search.trim()) {
    const keyword = state.inspirations.search.trim().toLowerCase();
    items = items.filter((item) => {
      const categoryText = getInspirationItemCategories(item).join(" ").toLowerCase();
      return item.content.toLowerCase().includes(keyword) || categoryText.includes(keyword);
    });
  }
  items.sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    if (state.inspirations.sort === "favorite" && a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return state.inspirations.sort === "oldest" ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt);
  });
  return items;
}

function openChapterPanelForKeyboard() {
  const work = getCurrentWork();
  if (!work) return;
  state.ui.chapterPanelOpen = true;
  state.ui.chapterPanelFocusedId = state.activeChapterId ?? work.chapterIds[0] ?? null;
  closeChapterMenus();
  updateChapterPanel();
  renderPortalLayer();
  requestAnimationFrame(() => refs.chapterPanelList.focus());
  persist();
}

function handleChapterPanelKeydown(event) {
  if (!state.ui.chapterPanelOpen) return;
  const work = getCurrentWork();
  if (!work) return;
  const chapters = getWorkChapters(work.id);
  if (event.key === "Escape") {
    event.preventDefault();
    closeChapterOverlays();
    updateChapterPanel();
    renderPortalLayer();
    refs.documentEditor.focus();
    persist();
    return;
  }
  if (chapters.length === 0) return;
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    moveChapterPanelFocus(work.id, event.key === "ArrowDown" ? 1 : -1, chapters);
    return;
  }
  if (event.key === "Enter") {
    event.preventDefault();
    const targetId = state.ui.chapterPanelFocusedId ?? chapters[0]?.id;
    if (targetId) void openChapter(work.id, targetId);
  }
}

function moveChapterPanelFocus(workId, direction, chapters = getWorkChapters(workId)) {
  if (chapters.length === 0) return;
  const currentId = state.ui.chapterPanelFocusedId && chapters.some((chapter) => chapter.id === state.ui.chapterPanelFocusedId)
    ? state.ui.chapterPanelFocusedId
    : state.activeChapterId;
  const currentIndex = Math.max(0, chapters.findIndex((chapter) => chapter.id === currentId));
  const nextIndex = Math.max(0, Math.min(chapters.length - 1, currentIndex + direction));
  state.ui.chapterPanelFocusedId = chapters[nextIndex].id;
  updateChapterPanel();
  persist();
}

function ensureFocusedChapter(workId, chapters = getWorkChapters(workId)) {
  if (chapters.length === 0) {
    state.ui.chapterPanelFocusedId = null;
    return;
  }
  if (state.ui.chapterPanelFocusedId && chapters.some((chapter) => chapter.id === state.ui.chapterPanelFocusedId)) return;
  state.ui.chapterPanelFocusedId = chapters.find((chapter) => chapter.id === state.activeChapterId)?.id ?? chapters[0].id;
}

function getChapterOrderNumber(workId, chapterId) {
  const work = getWork(workId);
  if (!work) return "-";
  const index = work.chapterIds.indexOf(chapterId);
  return index >= 0 ? index + 1 : "-";
}

function insertChapterIntoWork(work, chapterId, mode = "end", referenceChapterId = state.activeChapterId) {
  const index = getChapterInsertIndex(work, mode, referenceChapterId);
  work.chapterIds.splice(index, 0, chapterId);
}

function getChapterInsertIndex(work, mode, referenceChapterId) {
  if (!work) return 0;
  const currentIndex = work.chapterIds.indexOf(referenceChapterId);
  if (mode === "before-current" && currentIndex >= 0) return currentIndex;
  if (mode === "after-current" && currentIndex >= 0) return currentIndex + 1;
  return work.chapterIds.length;
}

function moveChapterWithinWork(workId, chapterId, direction) {
  const work = getWork(workId);
  if (!work) return false;
  const index = work.chapterIds.indexOf(chapterId);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= work.chapterIds.length) return false;
  const [moved] = work.chapterIds.splice(index, 1);
  work.chapterIds.splice(nextIndex, 0, moved);
  work.updatedAt = new Date().toISOString();
  if (state.activeWorkId === work.id && state.activeChapterId === chapterId) {
    work.lastOpenedChapterId = chapterId;
  }
  return true;
}

function moveChapterToIndex(workId, chapterId, targetIndex) {
  const work = getWork(workId);
  if (!work) return false;
  const currentIndex = work.chapterIds.indexOf(chapterId);
  if (currentIndex < 0) return false;
  const boundedIndex = Math.max(0, Math.min(work.chapterIds.length - 1, targetIndex));
  if (currentIndex === boundedIndex) return false;
  const [moved] = work.chapterIds.splice(currentIndex, 1);
  work.chapterIds.splice(boundedIndex, 0, moved);
  work.updatedAt = new Date().toISOString();
  if (state.activeWorkId === work.id && state.activeChapterId === chapterId) {
    work.lastOpenedChapterId = chapterId;
  }
  return true;
}

function duplicateChapter(workId, sourceChapterId) {
  const work = getWork(workId);
  const source = getChapter(sourceChapterId);
  if (!work || !source) return null;
  const chapter = createChapterForWork(work.id, `${source.title}（副本）`, {
    chapterTitle: `${source.title}（副本）`,
    content: source.content,
    notes: source.notes,
    outline: source.outline,
  });
  chapter.savedContent = source.savedContent;
  chapter.bookmarks = [...source.bookmarks];
  chapter.wordGoal = source.wordGoal;
  chapter.wordCount = countWords(chapter.content);
  insertChapterIntoWork(work, chapter.id, "after-current", source.id);
  work.updatedAt = new Date().toISOString();
  work.lastOpenedChapterId = chapter.id;
  state.activeWorkId = work.id;
  state.activeChapterId = chapter.id;
  state.route = "editor";
  return chapter;
}

function generateDefaultChapterTitle(workId) {
  const count = getWork(workId)?.chapterIds.length ?? 0;
  return `第 ${count + 1} 章`;
}

function getPopupPosition(trigger, menuWidth = 196) {
  const rect = trigger.getBoundingClientRect();
  const viewportPadding = 12;
  const left = Math.min(Math.max(viewportPadding, rect.right - menuWidth), window.innerWidth - menuWidth - viewportPadding);
  const top = Math.max(viewportPadding, Math.min(rect.bottom + 8, window.innerHeight - 260));
  return { top, left };
}

function handleChapterDragStart(event) {
  const row = event.target.closest("[data-chapter-drag-row]");
  if (!row) return;
  draggedChapterId = row.dataset.chapterId;
  refs.chapterPanelList.classList.add("drag-active");
  row.classList.add("dragging");
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedChapterId);
  }
}

function handleChapterDragOver(event) {
  const row = event.target.closest("[data-chapter-drag-row]");
  if (!draggedChapterId || !row || row.dataset.chapterId === draggedChapterId) return;
  event.preventDefault();
  const rect = row.getBoundingClientRect();
  const position = event.clientY - rect.top < rect.height / 2 ? "before" : "after";
  refs.chapterPanelList.querySelectorAll("[data-drop-position]").forEach((item) => item.removeAttribute("data-drop-position"));
  row.dataset.dropPosition = position;
}

async function handleChapterDrop(event) {
  const row = event.target.closest("[data-chapter-drag-row]");
  const work = getCurrentWork();
  if (!draggedChapterId || !row || !work) return;
  event.preventDefault();
  const targetChapterId = row.dataset.chapterId;
  const rect = row.getBoundingClientRect();
  const placeAfter = event.clientY - rect.top >= rect.height / 2;
  clearChapterDragIndicators();
  if (targetChapterId === draggedChapterId) {
    draggedChapterId = null;
    return;
  }
  const sourceIndex = work.chapterIds.indexOf(draggedChapterId);
  const targetIndex = work.chapterIds.indexOf(targetChapterId);
  if (sourceIndex < 0 || targetIndex < 0) {
    draggedChapterId = null;
    return;
  }
  let nextIndex = placeAfter ? targetIndex + 1 : targetIndex;
  if (sourceIndex < nextIndex) nextIndex -= 1;
  const moved = moveChapterToIndex(work.id, draggedChapterId, nextIndex);
  draggedChapterId = null;
  if (!moved) return;
  state.ui.chapterPanelFocusedId = state.activeChapterId;
  updateAll();
  await syncLibraryToDesktop();
  updateAll();
}

function handleChapterDragEnd() {
  draggedChapterId = null;
  clearChapterDragIndicators();
}

function clearChapterDragIndicators() {
  refs.chapterPanelList.classList.remove("drag-active");
  refs.chapterPanelList.querySelectorAll(".dragging").forEach((item) => item.classList.remove("dragging"));
  refs.chapterPanelList.querySelectorAll("[data-drop-position]").forEach((item) => item.removeAttribute("data-drop-position"));
}

function getInspirationItemCategories(item) {
  if (Array.isArray(item.categories) && item.categories.length > 0) return item.categories;
  if (item.category) return [item.category];
  return ["待补充"];
}

function getInspirationsForWork(workId) {
  if (!workId) return [];
  return Array.isArray(state.inspirations.itemsByWork?.[workId]) ? state.inspirations.itemsByWork[workId] : [];
}

function setInspirationsForWork(workId, items) {
  if (!workId) return;
  state.inspirations.itemsByWork ??= {};
  state.inspirations.itemsByWork[workId] = items;
}

function getInspirationById(workId, inspirationId) {
  return getInspirationsForWork(workId).find((item) => item.id === inspirationId) ?? null;
}

function getAllInspirations() {
  return Object.values(state.inspirations.itemsByWork ?? {}).flatMap((items) => (Array.isArray(items) ? items : []));
}

function createInspiration(workId, data) {
  const item = normalizeInspirationItem(
    {
      id: data.id ?? uid("inspiration"),
      workId,
      chapterId: data.chapterId ?? null,
      content: data.content,
      category: data.category,
      categories: data.categories,
      isFavorite: data.isFavorite,
      isPinned: data.isPinned,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    },
    workId,
  );
  if (!item) return null;
  setInspirationsForWork(workId, [item, ...getInspirationsForWork(workId)]);
  return item;
}

function resetInspirationViewState() {
  state.inspirations.activeCategory = "all";
  state.inspirations.search = "";
  state.inspirations.sort = "newest";
  state.ui.inspirationComposeOpen = false;
  state.ui.inspirationEditingId = null;
  state.ui.inspirationComposeTags = ["待补充"];
}

function handleInspirationWorkChange(nextWorkId, previousWorkId = state.activeWorkId) {
  if (!nextWorkId || nextWorkId === previousWorkId) return;
  resetInspirationViewState();
}

function getAvailableInspirationCategories() {
  syncInspirationCategoryOrder();
  return ["all", ...state.inspirations.categoryOrder];
}

function parseInspirationCategories(input) {
  const tags = String(input)
    .split(/[，,]/)
    .map((item) => item.trim())
    .filter(Boolean);
  return tags.length > 0 ? [...new Set(tags)] : ["待补充"];
}

function formatInspirationTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "刚刚";
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function exportCurrentChapter() {
  const chapter = getCurrentChapter();
  if (!chapter) return;
  const payload = { defaultName: `${slugify(chapter.title || "chapter")}.txt`, content: chapter.content };
  if (desktopApi?.saveTextFile) {
    desktopApi.saveTextFile(payload);
    return;
  }
  const blob = new Blob([payload.content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = payload.defaultName;
  link.click();
  URL.revokeObjectURL(url);
}

async function exportProjectFile() {
  const payload = {
    defaultName: `简纪项目-${new Date().toISOString().slice(0, 10)}.json`,
    content: JSON.stringify(getLibraryStatePayload(), null, 2),
  };
  if (desktopApi?.saveProjectFile) {
    await desktopApi.saveProjectFile(payload);
    return;
  }
  const blob = new Blob([payload.content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = payload.defaultName;
  link.click();
  URL.revokeObjectURL(url);
}

async function importProjectFile() {
  if (!desktopApi?.openProjectFile) return;
  const result = await desktopApi.openProjectFile();
  if (!result || result.canceled || !result.content) return;
  try {
    const imported = JSON.parse(result.content);
    applyLibraryState(imported);
    ensureStateIntegrity();
    await syncLibraryToDesktop();
    updateAll();
  } catch (error) {
    console.error("Failed to import project file", error);
    state.ui.modal = {
      type: "import-error",
      title: "导入失败",
      message: "项目文件格式无法识别，请确认它是有效的简纪导出文件。",
      actions: [{ id: "close-modal", label: "关闭", primary: true }],
    };
    updateModal();
  }
}

async function handleDesktopMenuAction(action) {
  if (action === "import-project") {
    await importProjectFile();
    return;
  }
  if (action === "export-project") {
    await exportProjectFile();
    return;
  }
  if (action === "reset-project") {
    Object.assign(state, createSeedState());
    ensureStateIntegrity();
    void syncLibraryToDesktop().then(() => updateAll());
  }
}

function applyTheme() {
  const selected = state.theme.presets.find((item) => item.id === state.theme.currentId) ?? state.theme.presets[0];
  const palette = state.theme.nightMode ? themePresets.find((item) => item.id === "ink").palette : selected.palette;
  const root = document.documentElement;
  root.style.setProperty("--bg", palette.bg);
  root.style.setProperty("--panel", palette.panel);
  root.style.setProperty("--panel-strong", palette.panelStrong);
  root.style.setProperty("--text", palette.text);
  root.style.setProperty("--muted", palette.muted);
  root.style.setProperty("--line", palette.line);
  root.style.setProperty("--accent", palette.accent);
  root.style.setProperty("--accent-soft", palette.accentSoft);
}

function applyTypography() {
  const family = state.font.families.find((item) => item.id === state.font.currentId) ?? state.font.families[0];
  const root = document.documentElement;
  root.style.setProperty("--font-family", family.family);
  root.style.setProperty("--editor-font-size", `${state.font.size}px`);
  root.style.setProperty("--editor-line-height", String(state.font.lineHeight));
  root.style.setProperty("--editor-letter-spacing", `${state.font.letterSpacing}px`);
}

function getFolder(folderId) {
  return state.folders.find((folder) => folder.id === folderId) ?? null;
}

function getWork(workId) {
  return state.works.find((work) => work.id === workId) ?? null;
}

function getChapter(chapterId) {
  return state.chapters.find((chapter) => chapter.id === chapterId) ?? null;
}

function getCurrentWork() {
  return getWork(state.activeWorkId);
}

function getCurrentChapter() {
  return getChapter(state.activeChapterId);
}

function getFoldersInFolder(parentId) {
  return state.folders
    .filter((folder) => (folder.parentId ?? null) === (parentId ?? null))
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt, "zh-Hans-CN"));
}

function getWorksInFolder(folderId) {
  return state.works
    .filter((work) => (work.folderId ?? null) === (folderId ?? null))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

function getVisibleFoldersInFolder(folderId) {
  const keyword = state.ui.librarySearch.trim().toLowerCase();
  let folders = getFoldersInFolder(folderId);
  if (keyword) {
    folders = folders.filter((folder) => folder.name.toLowerCase().includes(keyword));
  }
  return sortFolders(folders);
}

function getVisibleWorksInFolder(folderId) {
  const keyword = state.ui.librarySearch.trim().toLowerCase();
  let works = getWorksInFolder(folderId);
  if (keyword) {
    works = works.filter((work) => {
      const haystack = `${work.title} ${work.description}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }
  return sortWorks(works);
}

function sortFolders(folders) {
  const items = [...folders];
  if (state.ui.librarySort === "created-desc") {
    return items.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }
  return items.sort((left, right) => left.name.localeCompare(right.name, "zh-Hans-CN", { numeric: true }));
}

function sortWorks(works) {
  const items = [...works];
  if (state.ui.librarySort === "title-asc") {
    return items.sort((left, right) => left.title.localeCompare(right.title, "zh-Hans-CN", { numeric: true }));
  }
  if (state.ui.librarySort === "created-desc") {
    return items.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }
  return items.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

function getWorkChapters(workId) {
  const work = getWork(workId);
  if (!work) return [];
  return work.chapterIds.map((chapterId) => getChapter(chapterId)).filter(Boolean);
}

function getWorkWordCount(workId) {
  return getWorkChapters(workId).reduce((sum, chapter) => sum + (chapter.wordCount || countWords(chapter.content)), 0);
}

function getFolderPath(folderId) {
  const path = [{ id: null, name: "全部作品" }];
  let current = getFolder(folderId);
  const stack = [];
  while (current) {
    stack.unshift({ id: current.id, name: current.name });
    current = getFolder(current.parentId);
  }
  return path.concat(stack);
}

function getDescendantFolderIds(folderId) {
  const result = [];
  const stack = [folderId];
  while (stack.length > 0) {
    const currentId = stack.pop();
    const children = state.folders.filter((folder) => folder.parentId === currentId);
    for (const child of children) {
      result.push(child.id);
      stack.push(child.id);
    }
  }
  return result;
}

function getVisibleWorkDetail() {
  const work = getWork(state.ui.libraryWorkViewId);
  if (!work) return null;
  if ((work.folderId ?? null) !== (state.activeFolderId ?? null)) return null;
  return work;
}

function renderFolderOptions(selectedId, includeRoot) {
  const options = [];
  if (includeRoot) {
    options.push(`<option value="">根目录</option>`);
  }
  state.folders.forEach((folder) => {
    const depth = getFolderDepth(folder.id);
    const prefix = "　".repeat(depth);
    options.push(
      `<option value="${folder.id}" ${folder.id === selectedId ? "selected" : ""}>${escapeHtml(`${prefix}${folder.name}`)}</option>`,
    );
  });
  return options.join("");
}

function queueModalFocus() {
  requestAnimationFrame(() => {
    const preferred = refs.modalRoot.querySelector(
      "#modal-chapter-title, #modal-work-title, #modal-folder-name, #modal-rename-value",
    );
    preferred?.focus();
    if (preferred && "select" in preferred) preferred.select();
  });
}

function submitCurrentModalIfPossible() {
  const modal = state.ui.modal;
  if (!modal) return;
  const primaryAction = modal.actions.find((action) => action.primary);
  if (primaryAction) {
    void handleModalAction(primaryAction.id);
  }
}

function getFolderDepth(folderId) {
  let depth = 0;
  let current = getFolder(folderId);
  while (current?.parentId) {
    depth += 1;
    current = getFolder(current.parentId);
  }
  return depth;
}

function getNullableValue(value) {
  return value ? value : null;
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

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function timeNow() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remain = seconds % 60;
  return `${hours}h ${minutes}m ${remain}s`;
}

function formatRelativeTime(value) {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "刚刚";
  const diff = Date.now() - time;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  return `${days} 天前`;
}

function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
