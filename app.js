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
const supportedLanguages = ["zh", "en"];
const LIBRARY_FOLDER_ICON = getRuntimeAssetUrl("fold_image.png");
const LIBRARY_WORK_ICON = getRuntimeAssetUrl("file_image.png");
const translations = {
  zh: {
    "language.label": "系统语言",
    "language.zh": "中文",
    "language.en": "English",
    "library.kicker": "文件管理页",
    "library.title": "作品目录",
    "library.description": "支持文件夹与作品两层管理，进入后可继续按章节写作。",
    "library.up": "返回上一级",
    "library.create": "新建",
    "library.createFolder": "新建文件夹",
    "library.createWork": "新建作品",
    "library.importTxt": "导入 TXT",
    "library.searchPlaceholder": "搜索当前目录下的文件夹或作品",
    "library.fullTextSearchPlaceholder": "搜索全部章节、正文、备注",
    "library.searchCurrentScope": "当前目录搜索",
    "library.searchCurrentHint": "只搜当前目录里的文件夹和作品",
    "library.searchAllScope": "全文搜索",
    "library.searchAllHint": "搜索章节正文、备注和大纲",
    "library.sort.updated": "最近编辑优先",
    "library.sort.title": "名称 A-Z",
    "library.sort.created": "最新创建优先",
    "library.folders": "文件夹",
    "library.folderChildren": "{name} 内的子文件夹",
    "library.rootFolders": "根目录中的文件夹",
    "library.searchLabel": " · 搜索“{query}”",
    "library.noFolders": "当前目录下还没有文件夹。",
    "library.works": "作品",
    "library.worksSummary": "{count} 个作品，可直接进入写作。",
    "library.subfolderCount": "{folders} 个子文件夹 · {works} 个作品",
    "library.itemCount": "{count} 个项目",
    "library.folderTree": "文件夹",
    "library.currentFolder": "当前目录",
    "library.folderType": "文件夹",
    "library.workType": "作品",
    "library.noDescription": "暂无简介",
    "library.chapterCount": "{count} 章",
    "library.wordCount": "{count} 字",
    "library.location": "所在：{name}",
    "library.root": "根目录",
    "library.continue": "继续写作",
    "library.rename": "重命名",
    "library.delete": "删除",
    "library.emptyTitle": "当前文件夹为空",
    "library.emptyCopy": "可以新建文件夹或新建作品。",
    "library.emptyRootTitle": "还没有作品",
    "library.emptyRootCopy": "新建一个作品，或先创建文件夹来整理你的写作项目。",
    "library.emptySearchTitle": "没有匹配结果",
    "library.emptySearchCopy": "换一个关键词，或清空搜索查看全部内容。",
    "library.allWorks": "全部作品",
    "library.recent": "最近编辑",
    "library.recentHint": "快速回到刚写过的章节",
    "library.recentEmpty": "编辑章节后会显示在这里。",
    "library.globalSearch": "全文搜索",
    "library.globalSearchHint": "搜索作品、章节标题、正文、备注和大纲",
    "library.globalSearchEmpty": "输入关键词后搜索全部章节。",
    "library.globalSearchNoResults": "没有找到匹配章节。",
    "library.globalSearchSummary": "找到 {count} 个匹配章节",
    "chapter.new": "新建章节",
    "chapter.all": "全部章节",
    "chapter.currentSummary": "{count} 章 · 当前 {title}",
    "chapter.noneSelected": "未选择",
    "chapter.noManageable": "当前没有可管理的章节。",
    "chapter.noChapters": "当前作品还没有章节。",
    "chapter.emptyWorkTitle": "这个作品还没有章节",
    "chapter.emptyWorkCopy": "先新建一个章节，再开始写作。",
    "chapter.actionsTitle": "章节操作",
    "editor.backTitle": "返回文件管理页",
    "editor.noWork": "未选择作品",
    "editor.selectChapter": "请先返回目录页选择章节",
    "editor.chapterMeta": "{count} 字 · {time}",
    "editor.switchHint": "点击查看全部章节",
    "editor.newChapterTitle": "新建章节",
    "editor.sidebarTitle": "章节辅助",
    "editor.collapse": "收起",
    "editor.expand": "展开",
    "editor.notes": "章节备注",
    "editor.locate": "定位",
    "editor.notesPlaceholder": "记录当前章节备注",
    "editor.outline": "章节大纲",
    "editor.outlineExpand": "拓展",
    "editor.outlinePlaceholder": "记录本章大纲与推进节点",
    "editor.openSidebarTitle": "展开章节辅助",
    "editor.openWorkspaceTitle": "展开工作侧栏",
    "editor.bodyEditor": "正文编辑器",
    "editor.bodyStatusDefault": "正文内容实时跟随当前章节切换。",
    "editor.bodyStatus": "正文 {status} · {time}",
    "editor.emptyPlaceholder": "请先从目录页选择章节或新建章节。",
    "error.openFailedTitle": "无法打开",
    "error.openChapterMissing": "这个章节不存在，可能已经被删除。",
    "error.openWorkEmpty": "这个作品还没有章节，请先新建章节。",
    "error.importUnavailable": "当前环境不支持项目导入，请在桌面应用中使用。",
    "error.importCanceled": "已取消导入。",
    "editor.placeholder": "开始写作……",
    "editor.findPlaceholder": "查找",
    "editor.replacePlaceholder": "替换为",
    "editor.findNext": "查找下一个",
    "editor.replace": "替换",
    "editor.quote": "引用",
    "editor.divider": "插入分隔",
    "editor.outlineResize": "拖动调整大纲高度",
    "editor.save": "保存",
    "editor.closeOutline": "关闭大纲面板",
    "editor.outlinePanelPlaceholder": "在这里展开编辑本章大纲……",
    "workspace.title": "工作侧栏",
    "workspace.writing": "写作",
    "workspace.inspiration": "灵感记录",
    "workspace.settings": "设置",
    "ai.title": "AI 写作助手",
    "ai.readyTitle": "准备生成新版",
    "ai.readyCopy": "后续阶段会在这里显示当前章节的旧版与 AI 新版对照。当前阶段只开放入口，不会修改正文。",
    "ai.emptyTitle": "请先选择章节",
    "ai.emptyCopy": "打开一个章节后，AI 写作助手会读取当前正文、大纲和备注作为上下文。",
    "ai.originalVersion": "旧版",
    "ai.generatedVersion": "AI 新版",
    "ai.originalEmpty": "当前章节还没有正文。",
    "ai.generatedPending": "AI 新版会在下一阶段生成并显示在这里。",
    "ai.generateMock": "生成模拟新版",
    "ai.generatedMock": "本地模拟生成",
    "ai.applyDraft": "覆盖旧版本",
    "ai.beforeApplyVersion": "AI 覆盖前版本",
    "ai.generateOutline": "生成章节小纲",
    "ai.writeChapter": "按大纲起草",
    "ai.summarizeChapter": "总结并更新记忆",
    "ai.checkConsistency": "检查一致性",
    "ai.generateRevision": "基于正文改稿",
    "ai.rewriteSelection": "改写选中文本",
    "ai.running": "AI 处理中……",
    "ai.idleStatus": "选择一个 AI 操作开始。",
    "ai.outlineUpdated": "章节小纲已写入大纲。",
    "ai.chapterDraftReady": "章节正文已生成，可在改稿模式中查看。",
    "ai.summaryUpdated": "章节记忆已总结并更新。",
    "ai.consistencyReady": "一致性检查报告已生成。",
    "ai.latestResult": "最近结果",
    "ai.outlineResult": "章节小纲",
    "ai.summaryResult": "章节总结",
    "ai.draftResult": "章节草稿",
    "ai.consistencyResult": "一致性报告",
    "ai.resultSavedToMemory": "已写入项目记忆。",
    "ai.resultReviewHint": "已生成草稿，可在左右对照改稿模式中查看。",
    "ai.developIdea": "发展成项目资料",
    "ai.ideaMaterialsTitle": "项目资料草稿",
    "ai.ideaMaterialsMessage": "AI 已根据这条灵感生成项目资料草稿。确认后会写入当前作品的项目资料。",
    "ai.writeProjectMaterials": "写入项目资料",
    "ai.projectMaterialsWritten": "项目资料已写入。",
    "ai.selectionRewritten": "选中文本已改写。",
    "ai.desktopRequired": "AI Agent 需要在桌面应用中使用。",
    "workspace.punctuation": "快捷标点",
    "workspace.wordGoal": "字数目标",
    "workspace.chapterProgress": "章节进度",
    "workspace.wordGoalRemaining": "还差 {count} 字",
    "workspace.wordGoalUnset": "未设置目标",
    "workspace.wordGoalReached": "已达成目标",
    "workspace.wordGoalOver": "超出 {count} 字",
    "workspace.workWords": "作品总字数",
    "workspace.workGoalTotal": "作品目标 {count} 字",
    "workspace.focusTimer": "专注计时",
    "workspace.focusToday": "本次累计",
    "workspace.resume": "断点续写",
    "workspace.resumeButton": "回到上次光标",
    "workspace.resumeHint": "保存上一次编辑位置",
    "workspace.toolbarSettings": "工具设置",
    "workspace.toolbarSettingsHint": "开关和排序右侧写作工具。",
    "workspace.quickActions": "快捷操作",
    "workspace.modulePunctuation": "快捷标点",
    "workspace.moduleQuickActions": "快捷操作",
    "workspace.moduleWordGoal": "字数目标",
    "workspace.moduleChapterTools": "章节入口",
    "workspace.moduleAiAgent": "AI 写作助手",
    "workspace.showModule": "显示",
    "workspace.moveUp": "上移",
    "workspace.moveDown": "下移",
    "workspace.lastPosition": "上次位置：{position}",
    "workspace.wordGoalProgress": "当前 {count} / 目标 {goal}",
    "workspace.selectChapter": "请先选择章节",
    "workspace.notesEntry": "章节备注入口",
    "workspace.notesEntryHint": "展开左侧备注面板",
    "workspace.outlineEntry": "章节大纲入口",
    "workspace.outlineEntryHint": "查看并编辑本章大纲",
    "menu.renameChapter": "重命名章节",
    "menu.moveChapter": "移动章节",
    "menu.deleteChapter": "删除章节",
    "menu.history": "历史版本",
    "menu.shortcuts": "？ 快捷键",
    "menu.export": "导出",
    "shortcuts.quickTitle": "写作",
    "shortcuts.navigationTitle": "导航",
    "shortcuts.projectTitle": "项目",
    "shortcuts.moreTitle": "更多操作",
    "shortcuts.tip": "按功能分组，方便快速查找。",
    "menu.importText": "导入 TXT",
    "menu.focus": "专注模式",
    "menu.night": "夜间模式",
    "export.previewTitle": "导出预览",
    "export.chapterTitle": "导出当前章节",
    "export.projectTitle": "导出完整项目",
    "export.scope": "范围",
    "export.format": "格式",
    "export.folders": "文件夹",
    "export.chapters": "章节数",
    "export.words": "字数",
    "export.works": "作品数",
    "export.ideas": "灵感数",
    "export.fileName": "文件名",
    "export.currentChapter": "当前章节",
    "export.fullProject": "完整本地作品库",
    "export.confirm": "确认导出",
    "importTxt.successTitle": "TXT 导入成功",
    "importTxt.copyFailed": "章节已导入，但原始 TXT 复制失败。",
    "status.saved": "已保存",
    "status.saving": "保存中",
    "status.unsaved": "未保存",
    "status.failed": "保存失败",
    "status.justChanged": "刚刚修改",
    "status.noChapter": "未打开章节",
    "status.bodyOutlinePending": "正文/大纲待保存 · 刚刚修改",
    "status.outlinePending": "大纲{status} · 刚刚修改",
    "status.reverted": "回退到上次保存",
    "status.local": "本地保存",
    "status.syncing": "本地有未保存修改",
    "status.synced": "本地已保存",
    "status.syncFailed": "本地保存失败",
    "app.version": "版本 {version}",
  },
  en: {
    "language.label": "System Language",
    "language.zh": "Chinese",
    "language.en": "English",
    "library.kicker": "Library",
    "library.title": "Works",
    "library.description": "Organize folders and works, then open a work to continue writing by chapter.",
    "library.up": "Up One Level",
    "library.create": "New",
    "library.createFolder": "New Folder",
    "library.createWork": "New Work",
    "library.importTxt": "Import TXT",
    "library.searchPlaceholder": "Search folders or works in this folder",
    "library.fullTextSearchPlaceholder": "Search all chapters, text, and notes",
    "library.searchCurrentScope": "Search Current Folder",
    "library.searchCurrentHint": "Only search folders and works in the current folder",
    "library.searchAllScope": "Full Text Search",
    "library.searchAllHint": "Search chapter body, notes, and outlines",
    "library.sort.updated": "Recently Edited",
    "library.sort.title": "Name A-Z",
    "library.sort.created": "Newest Created",
    "library.folders": "Folders",
    "library.folderChildren": "Subfolders in {name}",
    "library.rootFolders": "Folders in root",
    "library.searchLabel": " · Search \"{query}\"",
    "library.noFolders": "No folders in this location yet.",
    "library.works": "Works",
    "library.worksSummary": "{count} works. Open one to write.",
    "library.subfolderCount": "{folders} subfolders · {works} works",
    "library.itemCount": "{count} items",
    "library.folderTree": "Folders",
    "library.currentFolder": "Current Folder",
    "library.folderType": "Folder",
    "library.workType": "Work",
    "library.noDescription": "No description",
    "library.chapterCount": "{count} chapters",
    "library.wordCount": "{count} words",
    "library.location": "In: {name}",
    "library.root": "Root",
    "library.continue": "Continue Writing",
    "library.rename": "Rename",
    "library.delete": "Delete",
    "library.emptyTitle": "This folder is empty",
    "library.emptyCopy": "Create a folder or work to start.",
    "library.emptyRootTitle": "No works yet",
    "library.emptyRootCopy": "Create a work, or create folders to organize writing projects.",
    "library.emptySearchTitle": "No matches",
    "library.emptySearchCopy": "Try another keyword, or clear search to view everything.",
    "library.allWorks": "All Works",
    "library.recent": "Recently Edited",
    "library.recentHint": "Jump back to chapters you worked on",
    "library.recentEmpty": "Edited chapters will appear here.",
    "library.globalSearch": "Full Text Search",
    "library.globalSearchHint": "Search works, chapter titles, body, notes, and outlines",
    "library.globalSearchEmpty": "Enter a keyword to search every chapter.",
    "library.globalSearchNoResults": "No matching chapters found.",
    "library.globalSearchSummary": "{count} matching chapters",
    "chapter.new": "New Chapter",
    "chapter.all": "All Chapters",
    "chapter.currentSummary": "{count} chapters · Current {title}",
    "chapter.noneSelected": "None",
    "chapter.noManageable": "No manageable chapters yet.",
    "chapter.noChapters": "This work has no chapters yet.",
    "chapter.emptyWorkTitle": "This work has no chapters",
    "chapter.emptyWorkCopy": "Create a chapter first, then start writing.",
    "chapter.actionsTitle": "Chapter Actions",
    "editor.backTitle": "Back to Library",
    "editor.noWork": "No Work Selected",
    "editor.selectChapter": "Go back to the library and select a chapter",
    "editor.chapterMeta": "{count} words · {time}",
    "editor.switchHint": "View all chapters",
    "editor.newChapterTitle": "New Chapter",
    "editor.sidebarTitle": "Chapter Tools",
    "editor.collapse": "Collapse",
    "editor.expand": "Expand",
    "editor.notes": "Chapter Notes",
    "editor.locate": "Locate",
    "editor.notesPlaceholder": "Record notes for this chapter",
    "editor.outline": "Chapter Outline",
    "editor.outlineExpand": "Expand",
    "editor.outlinePlaceholder": "Record this chapter's outline and beats",
    "editor.openSidebarTitle": "Open chapter tools",
    "editor.openWorkspaceTitle": "Open workspace sidebar",
    "editor.bodyEditor": "Body Editor",
    "editor.bodyStatusDefault": "Body content follows the current chapter.",
    "editor.bodyStatus": "Body {status} · {time}",
    "editor.emptyPlaceholder": "Select or create a chapter from the library first.",
    "error.openFailedTitle": "Cannot Open",
    "error.openChapterMissing": "This chapter no longer exists. It may have been deleted.",
    "error.openWorkEmpty": "This work has no chapters. Create a chapter first.",
    "error.importUnavailable": "Project import is available in the desktop app.",
    "error.importCanceled": "Import canceled.",
    "editor.placeholder": "Start writing...",
    "editor.findPlaceholder": "Find",
    "editor.replacePlaceholder": "Replace with",
    "editor.findNext": "Find Next",
    "editor.replace": "Replace",
    "editor.quote": "Quote",
    "editor.divider": "Insert Divider",
    "editor.outlineResize": "Drag to resize outline",
    "editor.save": "Save",
    "editor.closeOutline": "Close outline panel",
    "editor.outlinePanelPlaceholder": "Expand and edit this chapter outline here...",
    "workspace.title": "Workspace",
    "workspace.writing": "Writing",
    "workspace.inspiration": "Ideas",
    "workspace.settings": "Settings",
    "ai.title": "AI Writing Agent",
    "ai.readyTitle": "Ready to generate a new version",
    "ai.readyCopy": "A later phase will show the current chapter beside the AI version here. This phase only adds the entry point and will not modify your draft.",
    "ai.emptyTitle": "Select a chapter first",
    "ai.emptyCopy": "Open a chapter so the AI writing agent can use the current body, outline, and notes as context.",
    "ai.originalVersion": "Original",
    "ai.generatedVersion": "AI Version",
    "ai.originalEmpty": "This chapter has no body text yet.",
    "ai.generatedPending": "The AI version will be generated and shown here in the next phase.",
    "ai.generateMock": "Generate Mock Version",
    "ai.generatedMock": "Local mock result",
    "ai.applyDraft": "Replace Original",
    "ai.beforeApplyVersion": "Before AI replacement",
    "ai.generateOutline": "Generate Outline",
    "ai.writeChapter": "Draft from Outline",
    "ai.summarizeChapter": "Summarize to Memory",
    "ai.checkConsistency": "Check Consistency",
    "ai.generateRevision": "Revise Current Body",
    "ai.rewriteSelection": "Rewrite Selection",
    "ai.running": "AI is working...",
    "ai.idleStatus": "Choose an AI action to start.",
    "ai.outlineUpdated": "Chapter outline updated.",
    "ai.chapterDraftReady": "Chapter draft generated. Review it side by side.",
    "ai.summaryUpdated": "Chapter memory summarized and updated.",
    "ai.consistencyReady": "Consistency report generated.",
    "ai.latestResult": "Latest Result",
    "ai.outlineResult": "Chapter Outline",
    "ai.summaryResult": "Chapter Summary",
    "ai.draftResult": "Chapter Draft",
    "ai.consistencyResult": "Consistency Report",
    "ai.resultSavedToMemory": "Saved to project memory.",
    "ai.resultReviewHint": "Draft generated. Review it in the side-by-side revision mode.",
    "ai.developIdea": "Develop Project Materials",
    "ai.ideaMaterialsTitle": "Project Materials Draft",
    "ai.ideaMaterialsMessage": "AI generated project material drafts from this idea. Confirm to write them to the current work.",
    "ai.writeProjectMaterials": "Write Project Materials",
    "ai.projectMaterialsWritten": "Project materials written.",
    "ai.selectionRewritten": "Selected text rewritten.",
    "ai.desktopRequired": "AI Agent is available in the desktop app.",
    "workspace.punctuation": "Quick Punctuation",
    "workspace.wordGoal": "Word Goal",
    "workspace.chapterProgress": "Chapter Progress",
    "workspace.wordGoalRemaining": "{count} words left",
    "workspace.wordGoalUnset": "No goal set",
    "workspace.wordGoalReached": "Goal reached",
    "workspace.wordGoalOver": "{count} words over",
    "workspace.workWords": "Work Total",
    "workspace.workGoalTotal": "Work goal {count} words",
    "workspace.focusTimer": "Focus Timer",
    "workspace.focusToday": "Session Total",
    "workspace.resume": "Resume Point",
    "workspace.resumeButton": "Return to Cursor",
    "workspace.resumeHint": "Save the previous cursor position",
    "workspace.toolbarSettings": "Tool Settings",
    "workspace.toolbarSettingsHint": "Toggle and reorder writing tools.",
    "workspace.quickActions": "Quick Actions",
    "workspace.modulePunctuation": "Quick Punctuation",
    "workspace.moduleQuickActions": "Quick Actions",
    "workspace.moduleWordGoal": "Word Goal",
    "workspace.moduleChapterTools": "Chapter Entries",
    "workspace.moduleAiAgent": "AI Writing Agent",
    "workspace.showModule": "Show",
    "workspace.moveUp": "Up",
    "workspace.moveDown": "Down",
    "workspace.lastPosition": "Last position: {position}",
    "workspace.wordGoalProgress": "Current {count} / Goal {goal}",
    "workspace.selectChapter": "Select a chapter first",
    "workspace.notesEntry": "Chapter Notes",
    "workspace.notesEntryHint": "Open the notes panel",
    "workspace.outlineEntry": "Chapter Outline",
    "workspace.outlineEntryHint": "View and edit this outline",
    "menu.renameChapter": "Rename Chapter",
    "menu.moveChapter": "Move Chapter",
    "menu.deleteChapter": "Delete Chapter",
    "menu.history": "Version History",
    "menu.shortcuts": "? Shortcuts",
    "menu.export": "Export",
    "shortcuts.quickTitle": "Writing",
    "shortcuts.navigationTitle": "Navigation",
    "shortcuts.projectTitle": "Project",
    "shortcuts.moreTitle": "More Actions",
    "shortcuts.tip": "Grouped by task for quick scanning.",
    "menu.importText": "Import TXT",
    "menu.focus": "Focus Mode",
    "menu.night": "Night Mode",
    "export.previewTitle": "Export Preview",
    "export.chapterTitle": "Export Current Chapter",
    "export.projectTitle": "Export Full Project",
    "export.scope": "Scope",
    "export.format": "Format",
    "export.folders": "Folders",
    "export.chapters": "Chapters",
    "export.words": "Words",
    "export.works": "Works",
    "export.ideas": "Ideas",
    "export.fileName": "File Name",
    "export.currentChapter": "Current chapter",
    "export.fullProject": "Full local library",
    "export.confirm": "Export",
    "importTxt.successTitle": "TXT Import Successful",
    "importTxt.copyFailed": "The chapters were imported, but copying the original TXT failed.",
    "status.saved": "Saved",
    "status.saving": "Saving",
    "status.unsaved": "Unsaved",
    "status.failed": "Save failed",
    "status.justChanged": "Just changed",
    "status.noChapter": "No chapter open",
    "status.bodyOutlinePending": "Body/outline pending · just changed",
    "status.outlinePending": "Outline {status} · just changed",
    "status.reverted": "Reverted to last save",
    "status.local": "Local storage",
    "status.syncing": "Unsaved local changes",
    "status.synced": "Saved locally",
    "status.syncFailed": "Local save failed",
    "app.version": "Version {version}",
  },
};

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

const aiProviderDefaults = {
  openai: "gpt-5.5",
  claude: "claude-sonnet-4-5",
  deepseek: "deepseek-v4-flash",
  custom: "",
};
const aiProviderModelOptions = {
  openai: ["gpt-5.5", "gpt-4.1", "gpt-4.1-mini"],
  claude: ["claude-sonnet-4-5"],
  deepseek: ["deepseek-v4-flash"],
  custom: [],
};
const agentGenerationModes = [
  {
    id: "fast_draft",
    generation_mode: "fast_draft",
    zh: "快速草稿",
    en: "Fast Draft",
    zhHint: "更快、更省资源，适合先出初稿。",
    enHint: "Faster and lighter, best for a first pass.",
  },
  {
    id: "standard_chapter",
    generation_mode: "standard_chapter",
    zh: "标准章节（推荐）",
    en: "Standard Chapter (Recommended)",
    zhHint: "平衡质量和速度，适合日常生成。",
    enHint: "Balanced quality and speed for regular drafting.",
  },
  {
    id: "polished_chapter",
    generation_mode: "polished_chapter",
    zh: "精修章节",
    en: "Polished Chapter",
    zhHint: "审查更细致，耗时更久。",
    enHint: "More thorough review, slower and heavier.",
  },
];
const defaultAgentGenerationMode = "standard_chapter";
const costGuardFriendlyBlockedMessage = "本次生成内容较长，可能消耗较多资源。建议降低目标字数，或切换为快速草稿。";
const projectMaterialTypes = [
  { id: "outline", zh: "项目大纲", en: "Outline", zhHint: "故事主线、阶段推进和结局方向。", enHint: "Story arc, major beats, and ending direction." },
  { id: "characters", zh: "角色设定", en: "Characters", zhHint: "人物关系、欲望、秘密和口吻。", enHint: "Relationships, motives, secrets, and voice." },
  { id: "world", zh: "世界观", en: "World", zhHint: "时代、地点、规则、组织和限制。", enHint: "Setting, rules, factions, limits, and constraints." },
  { id: "style", zh: "风格偏好", en: "Style", zhHint: "叙述节奏、文风禁忌和修辞偏好。", enHint: "Pacing, prose preferences, and style boundaries." },
  { id: "goals", zh: "写作目标", en: "Goals", zhHint: "本书目标、读者感受和当前创作重点。", enHint: "Book goals, reader effect, and current writing priorities." },
];
const writingToolModules = [
  { id: "punctuation", labelKey: "workspace.modulePunctuation" },
  { id: "quick-actions", labelKey: "workspace.moduleQuickActions" },
  { id: "word-goal", labelKey: "workspace.moduleWordGoal" },
  { id: "chapter-tools", labelKey: "workspace.moduleChapterTools" },
  { id: "ai-agent", labelKey: "workspace.moduleAiAgent" },
];
const state = loadState();
const refs = {};
const desktopApi = window.storyForgeDesktop ?? null;
const projectMaterialsState = {
  workId: null,
  currentType: "outline",
  materials: {},
  chapters: [],
  loading: false,
  saving: false,
  dirty: false,
  status: "",
};
let appVersion = "";
let autosaveTimer = null;
let librarySyncTimer = null;
let librarySyncSequence = 0;
let librarySyncPending = false;
let focusTimer = null;
let focusTimerLongPressTimer = null;
let focusTimerLongPressTriggered = false;
const focusTimerLongPressMs = 650;
let suppressHistory = false;
let draggedChapterId = null;
let draggedLibrarySectionId = null;
let outlineResizeState = null;
let sidebarResizeState = null;
let sidebarResizeFrame = null;
let globalEventsBound = false;
let editorialSuggestionsDragState = null;

init();

async function init() {
  ensureStateIntegrity();
  await bootstrapDesktopLibrary();
  await loadAiSettings();
  renderAppShell();
  await loadAppVersion();
  updateAll();
}

async function loadAppVersion() {
  if (!desktopApi?.getAppVersion) return;
  try {
    appVersion = await desktopApi.getAppVersion();
    updateAppVersionText();
  } catch (error) {
    console.error(error);
    appVersion = "";
    updateAppVersionText();
  }
}

function renderAppShell() {
  document.documentElement.lang = getLanguage() === "en" ? "en" : "zh-CN";
  document.getElementById("app").innerHTML = AppShell();
  collectRefs();
  bindEvents();
  updateAppVersionText();
}

function getLanguage() {
  return supportedLanguages.includes(state?.ui?.language) ? state.ui.language : "zh";
}

function getRuntimeAssetUrl(fileName) {
  return new URL(fileName, document.baseURI).toString();
}

function t(key, values = {}) {
  const dictionary = translations[getLanguage()] ?? translations.zh;
  const template = dictionary[key] ?? translations.zh[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_match, name) => (values[name] ?? values[name] === 0 ? String(values[name]) : ""));
}

function updateAppVersionText() {
  if (refs.appVersion) refs.appVersion.textContent = appVersion ? t("app.version", { version: appVersion }) : "";
}

function setLanguage(language) {
  if (!supportedLanguages.includes(language) || language === getLanguage()) return;
  state.ui.language = language;
  persist();
  renderAppShell();
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
    activeFolderId: null,
    activeTab: "writing",
    activeWorkId: "work-1",
    activeChapterId: "chapter-1",
    outlinePanelOpen: false,
    outlinePanelHeight: 0.2,
    currentChapterOutline: "1. 回港\n2. 旅馆旧灯\n3. 第一句手稿回归",
    outlineDirty: false,
    outlineLastSavedAt: "2026-04-08T01:20:00.000Z",
    outlineSaveStatus: "已保存",
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
      nickname: "本地模式",
      avatar: "本",
      syncStatus: "本地已保存",
    },
    aiSettings: {
      provider: "openai",
      model: aiProviderDefaults.openai,
      baseUrl: "",
      hasApiKey: false,
      apiKeyPreview: "",
      updatedAt: "",
      saveStatus: "",
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
      leftSidebarWidth: 340,
      rightSidebarWidth: 360,
      sidebarSection: "home",
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
      libraryFullTextSearch: "",
      librarySort: "updated-desc",
      librarySectionOrder: ["browser", "recent", "global-search"],
      libraryWorkViewId: "work-1",
      libraryExpandedFolders: [],
      language: "zh",
      chapterPanelOpen: false,
      chapterPanelFocusedId: null,
      chapterCreateMenuPosition: null,
      chapterItemMenu: null,
      chapterItemMenuPosition: null,
      inspirationComposeOpen: false,
      inspirationComposeTags: ["待补充"],
      inspirationEditingId: null,
      collapsedInspirationIds: [],
      selectedInspirationIds: [],
      aiDraftsByChapter: {},
      aiReviewMode: false,
      aiGenerationPending: false,
      editorialSuggestionsOpen: false,
      editorialSuggestionsPosition: { x: 96, y: 96 },
      editorialSuggestionsLoading: false,
      editorialSuggestionsError: "",
      agentGenerationMode: defaultAgentGenerationMode,
      showCostDetails: false,
      agentActionPending: "",
      agentStatus: "",
      agentGoalText: "",
      agentGoalDraft: null,
      agentExecutionTrace: null,
      ideaProjectMaterialsPendingId: null,
      writingToolOrder: writingToolModules.map((item) => item.id),
      writingToolVisibility: Object.fromEntries(writingToolModules.map((item) => [item.id, true])),
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
    savedOutline: outline,
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
  state.outlinePanelOpen = Boolean(state.outlinePanelOpen);
  state.outlinePanelHeight = clampOutlinePanelRatio(Number(state.outlinePanelHeight) || 0.2);
  state.currentChapterOutline = String(state.currentChapterOutline || "");
  state.outlineDirty = Boolean(state.outlineDirty);
  state.outlineLastSavedAt = state.outlineLastSavedAt ? normalizeIsoDate(state.outlineLastSavedAt) : null;
  state.outlineSaveStatus = String(state.outlineSaveStatus || "已保存");
  state.inspirations.categoryOrder = Array.isArray(state.inspirations.categoryOrder)
    ? state.inspirations.categoryOrder.map((item) => String(item).trim()).filter(Boolean)
    : inspirationCategories.filter((item) => item !== "all");
  state.inspirations.activeCategory = String(state.inspirations.activeCategory || "all");
  state.inspirations.search = String(state.inspirations.search || "");
  state.inspirations.sort = ["newest", "oldest", "favorite"].includes(state.inspirations.sort) ? state.inspirations.sort : "newest";
  state.aiSettings = normalizePublicAiSettings(state.aiSettings);
  state.activeTab = ["writing", "inspiration", "settings"].includes(state.activeTab) ? state.activeTab : "writing";
  state.ui.leftSidebarCollapsed ??= false;
  state.ui.rightSidebarCollapsed ??= false;
  state.ui.leftSidebarWidth = clampSidebarWidth(Number(state.ui.leftSidebarWidth) || 340);
  state.ui.rightSidebarWidth = clampSidebarWidth(Number(state.ui.rightSidebarWidth) || 360);
  state.ui.sidebarSection = ["home", "notes", "outline", "materials"].includes(state.ui.sidebarSection) ? state.ui.sidebarSection : "home";
  state.ui.libraryScrollTop ??= 0;
  state.ui.libraryCreateOpen ??= false;
  state.ui.libraryEntityMenu ??= null;
  state.ui.libraryEntityMenuPosition ??= null;
  state.ui.librarySearch = String(state.ui.librarySearch ?? "");
  state.ui.libraryFullTextSearch = String(state.ui.libraryFullTextSearch ?? "");
  state.ui.librarySort ??= "updated-desc";
  state.ui.librarySectionOrder = Array.isArray(state.ui.librarySectionOrder)
    ? state.ui.librarySectionOrder.map((id) => String(id)).filter((id) => ["global-search", "recent", "browser"].includes(id))
    : ["browser", "recent", "global-search"];
  if (state.ui.librarySectionOrder.join(",") === "global-search,recent,browser") {
    state.ui.librarySectionOrder = ["browser", "recent", "global-search"];
  }
  state.ui.libraryWorkViewId ??= null;
  state.ui.libraryExpandedFolders = Array.isArray(state.ui.libraryExpandedFolders)
    ? state.ui.libraryExpandedFolders.map((id) => String(id))
    : [];
  state.ui.language = supportedLanguages.includes(state.ui.language) ? state.ui.language : "zh";
  state.ui.chapterPanelOpen ??= false;
  state.ui.chapterPanelFocusedId ??= null;
  state.ui.chapterCreateMenuPosition ??= null;
  state.ui.chapterItemMenu ??= null;
  state.ui.chapterItemMenuPosition ??= null;
  state.ui.inspirationComposeOpen ??= false;
  state.ui.inspirationComposeTags ??= ["待补充"];
  state.ui.inspirationEditingId ??= null;
  state.ui.collapsedInspirationIds = Array.isArray(state.ui.collapsedInspirationIds)
    ? state.ui.collapsedInspirationIds.map((id) => String(id))
    : [];
  state.ui.selectedInspirationIds = Array.isArray(state.ui.selectedInspirationIds)
    ? state.ui.selectedInspirationIds.map((id) => String(id))
    : [];
  state.ui.aiDraftsByChapter = state.ui.aiDraftsByChapter && typeof state.ui.aiDraftsByChapter === "object" ? state.ui.aiDraftsByChapter : {};
  state.ui.aiReviewMode = Boolean(state.ui.aiReviewMode);
  state.ui.aiGenerationPending = false;
  state.ui.editorialSuggestionsOpen = Boolean(state.ui.editorialSuggestionsOpen);
  state.ui.editorialSuggestionsPosition = normalizeFloatingPanelPosition(state.ui.editorialSuggestionsPosition);
  state.ui.editorialSuggestionsLoading = false;
  state.ui.editorialSuggestionsError = String(state.ui.editorialSuggestionsError || "");
  state.ui.agentGenerationMode = agentGenerationModes.some((mode) => mode.id === state.ui.agentGenerationMode)
    ? state.ui.agentGenerationMode
    : defaultAgentGenerationMode;
  state.ui.showCostDetails = Boolean(state.ui.showCostDetails);
  state.ui.agentActionPending = "";
  state.ui.agentStatus = String(state.ui.agentStatus || "");
  state.ui.agentGoalText = String(state.ui.agentGoalText || "");
  state.ui.agentGoalDraft = normalizeAgentGoalDraft(state.ui.agentGoalDraft);
  state.ui.agentExecutionTrace = normalizeAgentExecutionTrace(state.ui.agentExecutionTrace, state.ui.agentGoalDraft?.planSteps || []);
  state.ui.ideaProjectMaterialsPendingId ??= null;
  normalizeWritingToolLayout();
  state.ui.projectMaterialType = projectMaterialTypes.some((item) => item.id === state.ui.projectMaterialType)
    ? state.ui.projectMaterialType
    : "outline";
  state.ui.settingsThemeExpanded ??= false;
  state.ui.focusTarget = ["document", "outline"].includes(state.ui.focusTarget) ? state.ui.focusTarget : "document";
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

  const folderIdMap = createIdMap(state.folders, "folder");
  const workIdMap = createIdMap(state.works, "work");
  const chapterIdMap = createIdMap(state.chapters, "chapter");
  const folderIds = new Set([...folderIdMap.values()]);
  state.folders = state.folders.map((folder) => ({
    id: mapId(folderIdMap, folder.id, "folder"),
    name: String(folder.name || "未命名文件夹"),
    parentId:
      folder.parentId == null || !folderIds.has(mapId(folderIdMap, folder.parentId, "folder"))
        ? null
        : mapId(folderIdMap, folder.parentId, "folder"),
    createdAt: String(folder.createdAt || new Date().toISOString()),
  }));

  const worksById = new Map();
  state.works = state.works.map((work) => {
    const normalized = {
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
    worksById.set(normalized.id, normalized);
    return normalized;
  });

  state.chapters = state.chapters
    .map((chapter) => {
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

  state.activeFolderId = state.activeFolderId == null ? null : mapId(folderIdMap, state.activeFolderId, "folder");
  state.activeWorkId = state.activeWorkId == null ? null : mapId(workIdMap, state.activeWorkId, "work");
  state.activeChapterId = state.activeChapterId == null ? null : mapId(chapterIdMap, state.activeChapterId, "chapter");
  state.ui.libraryWorkViewId =
    state.ui.libraryWorkViewId == null ? null : mapId(workIdMap, state.ui.libraryWorkViewId, "work");
  state.ui.chapterPanelFocusedId =
    state.ui.chapterPanelFocusedId == null ? null : mapId(chapterIdMap, state.ui.chapterPanelFocusedId, "chapter");
  state.ui.chapterItemMenu = state.ui.chapterItemMenu == null ? null : mapId(chapterIdMap, state.ui.chapterItemMenu, "chapter");
  state.ui.libraryExpandedFolders = state.ui.libraryExpandedFolders.map((id) =>
    id === "root-collapsed" ? id : mapId(folderIdMap, id, "folder"),
  );

  normalizeInspirationState(workIdMap);

  if (state.activeFolderId != null && !getFolder(state.activeFolderId)) {
    state.activeFolderId = null;
  }

  syncInspirationCategoryOrder();

  normalizeActiveSelection();
  syncOutlineStateWithCurrentChapter();
  persist();
}

function normalizeWritingToolLayout() {
  const knownIds = writingToolModules.map((item) => item.id);
  const sourceOrder = Array.isArray(state.ui.writingToolOrder) ? state.ui.writingToolOrder.map(String) : [];
  state.ui.writingToolOrder = [
    ...sourceOrder.filter((id, index, items) => knownIds.includes(id) && items.indexOf(id) === index),
    ...knownIds.filter((id) => !sourceOrder.includes(id)),
  ];
  const sourceVisibility =
    state.ui.writingToolVisibility && typeof state.ui.writingToolVisibility === "object"
      ? state.ui.writingToolVisibility
      : {};
  state.ui.writingToolVisibility = Object.fromEntries(
    knownIds.map((id) => [id, sourceVisibility[id] !== false]),
  );
}

function getVisibleWritingToolModuleIds() {
  normalizeWritingToolLayout();
  return state.ui.writingToolOrder.filter((id) => state.ui.writingToolVisibility[id] !== false);
}

function normalizeInspirationState(workIdMap = null) {
  const fallbackWorkId = state.activeWorkId ?? state.works[0]?.id ?? null;
  const source =
    state.inspirations && typeof state.inspirations.itemsByWork === "object" && state.inspirations.itemsByWork
      ? state.inspirations.itemsByWork
      : {};
  const normalizedByWork = {};

  if (Array.isArray(state.inspirations.items)) {
    state.inspirations.items.forEach((item) => {
      const normalized = normalizeInspirationItem(item, fallbackWorkId, workIdMap);
      if (!normalized) return;
      if (!normalizedByWork[normalized.workId]) normalizedByWork[normalized.workId] = [];
      normalizedByWork[normalized.workId].push(normalized);
    });
  }

  Object.entries(source).forEach(([workId, items]) => {
    if (!Array.isArray(items)) return;
    const normalizedWorkId = mapId(workIdMap, workId, "work");
    items.forEach((item) => {
      const normalized = normalizeInspirationItem(item, normalizedWorkId || fallbackWorkId, workIdMap);
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

function normalizeInspirationItem(item, fallbackWorkId = null, workIdMap = null) {
  const workId = mapId(workIdMap, item?.workId || fallbackWorkId || "", "work");
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
    id: sanitizeEntityId(item?.id || uid("inspiration"), "inspiration"),
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
        savedOutline: String(legacyChapter.savedOutline ?? legacyChapter.outline ?? ""),
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

function normalizePublicAiSettings(value) {
  const source = value && typeof value === "object" ? value : {};
  const provider = Object.hasOwn(aiProviderDefaults, source.provider) ? source.provider : "openai";
  return {
    provider,
    model: String(source.model || aiProviderDefaults[provider] || "").trim(),
    baseUrl: String(source.baseUrl || "").trim(),
    hasApiKey: Boolean(source.hasApiKey),
    apiKeyPreview: String(source.apiKeyPreview || ""),
    updatedAt: String(source.updatedAt || ""),
    saveStatus: String(source.saveStatus || ""),
  };
}

function getAiModelOptions(provider) {
  const normalizedProvider = Object.hasOwn(aiProviderDefaults, provider) ? provider : "openai";
  return [...new Set([
    aiProviderDefaults[normalizedProvider],
    ...(aiProviderModelOptions[normalizedProvider] || []),
  ].map((model) => String(model || "").trim()).filter(Boolean))];
}

function renderAiModelOptions(provider) {
  return getAiModelOptions(provider)
    .map((model) => `<option value="${escapeAttribute(model)}">${escapeHtml(model)}</option>`)
    .join("");
}

async function loadAiSettings() {
  if (!desktopApi?.getAiSettings) return;
  try {
    state.aiSettings = normalizePublicAiSettings(await desktopApi.getAiSettings());
  } catch (error) {
    console.error("Failed to load AI settings", error);
    state.aiSettings = {
      ...normalizePublicAiSettings(state.aiSettings),
      saveStatus: getLanguage() === "en" ? "Failed to load local AI settings." : "AI 本地设置加载失败。",
    };
  }
}

async function saveAiSettingsFromForm() {
  const provider = refs.aiProviderSelect?.value || "openai";
  const payload = {
    provider,
    model: refs.aiModelInput?.value || aiProviderDefaults[provider] || "",
    baseUrl: refs.aiBaseUrlInput?.value || "",
    apiKey: refs.aiApiKeyInput?.value || "",
  };

  if (!desktopApi?.saveAiSettings) {
    state.aiSettings = {
      ...normalizePublicAiSettings(payload),
      hasApiKey: Boolean(payload.apiKey),
      apiKeyPreview: payload.apiKey ? `...${payload.apiKey.slice(-4)}` : "",
      updatedAt: new Date().toISOString(),
      saveStatus: getLanguage() === "en" ? "Saved for this browser session only." : "已保存到当前浏览器会话。",
    };
    updateAiSettingsPanel();
    return;
  }

  state.aiSettings = {
    ...state.aiSettings,
    saveStatus: getLanguage() === "en" ? "Saving..." : "保存中……",
  };
  updateAiSettingsPanel();
  try {
    state.aiSettings = {
      ...normalizePublicAiSettings(await desktopApi.saveAiSettings(payload)),
      saveStatus: getLanguage() === "en" ? "Saved locally." : "已保存到本地。",
    };
  } catch (error) {
    console.error("Failed to save AI settings", error);
    state.aiSettings = {
      ...normalizePublicAiSettings(state.aiSettings),
      saveStatus: getLanguage() === "en" ? "Save failed." : "保存失败。",
    };
  }
  updateAiSettingsPanel();
}

async function syncLibraryToDesktop() {
  if (!desktopApi?.syncLibrary) return true;
  const syncSequence = ++librarySyncSequence;
  librarySyncPending = true;
  state.account.syncStatus = "本地有未保存修改";
  refreshSaveIndicators();
  const preferredFolderId = state.activeFolderId;
  const preferredWorkId = state.activeWorkId;
  const preferredChapterId = state.activeChapterId;
  try {
    const library = await desktopApi.syncLibrary(getLibraryStatePayload());
    if (syncSequence !== librarySyncSequence) return true;
    librarySyncPending = false;
    state.account.syncStatus = "本地已保存";
    applyLibraryState(library);
    state.activeFolderId = preferredFolderId;
    normalizeActiveSelection(preferredWorkId, preferredChapterId);
    persist();
    refreshSaveIndicators();
    return true;
  } catch (error) {
    console.error("Failed to sync desktop library", error);
    if (syncSequence === librarySyncSequence) {
      librarySyncPending = false;
      state.account.syncStatus = "本地保存失败";
      refreshSaveIndicators();
      persist();
    }
    return false;
  }
}

function queueLibrarySyncToDesktop() {
  if (!desktopApi?.syncLibrary) return;
  clearTimeout(librarySyncTimer);
  librarySyncPending = true;
  state.account.syncStatus = "本地有未保存修改";
  refreshSaveIndicators();
  librarySyncTimer = setTimeout(() => {
    librarySyncTimer = null;
    void syncLibraryToDesktop();
  }, 700);
}

async function flushLibrarySyncToDesktop() {
  if (!desktopApi?.syncLibrary) return;
  if (librarySyncTimer) {
    clearTimeout(librarySyncTimer);
    librarySyncTimer = null;
  }
  await syncLibraryToDesktop();
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
            <span class="section-kicker">${t("library.kicker")}</span>
            <h1>${t("library.title")}</h1>
            <p>${t("library.description")}</p>
          </div>
        <div class="library-header-actions">
          <label class="language-switcher">
            <span>${t("language.label")}</span>
            <select id="language-select">
              <option value="zh" ${getLanguage() === "zh" ? "selected" : ""}>${t("language.zh")}</option>
              <option value="en" ${getLanguage() === "en" ? "selected" : ""}>${t("language.en")}</option>
            </select>
          </label>
          <button class="ghost-button" id="folder-up-button">${t("library.up")}</button>
        </div>
        </div>
        <div class="library-breadcrumb" id="library-breadcrumb"></div>
        <div class="library-toolbar">
          <label class="search-field">
            <span>${t("library.searchCurrentScope")}</span>
            <input id="library-search-input" type="search" placeholder="${escapeAttribute(t("library.searchPlaceholder"))}" />
          </label>
          <label class="search-field">
            <span>${t("library.searchAllScope")}</span>
            <input id="library-full-text-search-input" type="search" placeholder="${escapeAttribute(t("library.fullTextSearchPlaceholder"))}" />
          </label>
          <select id="library-sort-select">
            <option value="updated-desc">${t("library.sort.updated")}</option>
            <option value="title-asc">${t("library.sort.title")}</option>
            <option value="created-desc">${t("library.sort.created")}</option>
          </select>
        </div>
      </header>
      <div class="library-content" id="library-content">
        <aside class="library-sidebar surface">
          <div class="library-sidebar-head">
            <strong>${t("library.folderTree")}</strong>
          </div>
          <div class="library-tree" id="library-tree"></div>
        </aside>
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
            <strong>${t("editor.sidebarTitle")}</strong>
            <button class="ghost-button compact-button" id="left-sidebar-toggle-button">${t("editor.collapse")}</button>
          </div>
          <div class="sidebar-nav" id="left-sidebar-nav">
            <button class="sidebar-nav-card" data-open-side="notes">
              <strong>${t("editor.notes")}</strong>
              <small>${getLanguage() === "en" ? "Chapter notes and temporary ideas" : "本章备注与临时想法"}</small>
            </button>
            <button class="sidebar-nav-card" data-open-side="outline">
              <strong>${t("editor.outline")}</strong>
              <small>${getLanguage() === "en" ? "Chapter outline and beats" : "本章大纲与节拍"}</small>
            </button>
            <button class="sidebar-nav-card" data-open-side="materials">
              <strong>${getLanguage() === "en" ? "Project Materials" : "项目资料"}</strong>
              <small>${getLanguage() === "en" ? "Novel outline, characters, world, and style" : "项目大纲、角色、世界观与风格"}</small>
            </button>
          </div>
          <div class="sidebar-section sidebar-detail" data-sidebar-detail="notes">
            <div class="sidebar-section-head">
              <strong>${t("editor.notes")}</strong>
              <button class="ghost-button compact-button" data-open-side="home">${getLanguage() === "en" ? "Back" : "返回"}</button>
            </div>
            <textarea id="chapter-notes-input" placeholder="${escapeAttribute(t("editor.notesPlaceholder"))}"></textarea>
          </div>
          <div class="sidebar-section sidebar-detail" data-sidebar-detail="outline">
            <div class="sidebar-section-head">
              <strong>${t("editor.outline")}</strong>
              <div class="sidebar-head-actions">
                <button class="ghost-button compact-button" id="outline-expand-button">${t("editor.outlineExpand")}</button>
                <button class="ghost-button compact-button" data-open-side="home">${getLanguage() === "en" ? "Back" : "返回"}</button>
              </div>
            </div>
            <textarea id="chapter-outline-input" class="chapter-outline-input" placeholder="${escapeAttribute(t("editor.outlinePlaceholder"))}"></textarea>
          </div>
          <div class="sidebar-section sidebar-detail" data-sidebar-detail="materials">
            <div class="sidebar-section-head">
              <strong>${getLanguage() === "en" ? "Project Materials" : "项目资料"}</strong>
              <button class="ghost-button compact-button" data-open-side="home">${getLanguage() === "en" ? "Back" : "返回"}</button>
            </div>
            ${ProjectMaterialsPanel()}
          </div>
        </aside>
        <button class="sidebar-resize-handle sidebar-resize-left" id="left-sidebar-resize-handle" title="${escapeAttribute(getLanguage() === "en" ? "Resize chapter sidebar" : "调整章节侧栏宽度")}" aria-label="${escapeAttribute(getLanguage() === "en" ? "Resize chapter sidebar" : "调整章节侧栏宽度")}"></button>
        <button class="edge-toggle edge-toggle-left hidden" id="left-sidebar-reopen-button" title="${escapeAttribute(t("editor.openSidebarTitle"))}">></button>
        <div class="editor-column" id="editor-column">
          ${DocumentEditor()}
        </div>
        <button class="edge-toggle edge-toggle-right hidden" id="right-sidebar-reopen-button" title="${escapeAttribute(t("editor.openWorkspaceTitle"))}"><</button>
        <button class="sidebar-resize-handle sidebar-resize-right" id="right-sidebar-resize-handle" title="${escapeAttribute(getLanguage() === "en" ? "Resize workspace sidebar" : "调整工作区侧栏宽度")}" aria-label="${escapeAttribute(getLanguage() === "en" ? "Resize workspace sidebar" : "调整工作区侧栏宽度")}"></button>
        ${BottomWorkspaceTabs()}
      </div>
    </section>
  `;
}

function TopBar() {
  return `
    <header class="top-bar surface">
      <button class="icon-button" id="back-button" title="${escapeAttribute(t("editor.backTitle"))}">←</button>
      <div class="top-bar-meta">
        <strong id="current-work-title"></strong>
        <small class="app-version" id="app-version">${appVersion ? escapeHtml(t("app.version", { version: appVersion })) : ""}</small>
        <div class="chapter-switcher-shell">
          <div class="chapter-switcher-row">
            <button class="chapter-switcher-trigger" id="chapter-switcher-button" title="${escapeAttribute(t("editor.switchHint"))}">
              <span class="chapter-switcher-label" id="current-chapter-title"></span>
              <small id="current-chapter-meta"></small>
            </button>
            <button class="ghost-button compact-button" id="new-chapter-button" data-chapter-create-trigger title="${escapeAttribute(t("editor.newChapterTitle"))}">+ ${t("chapter.new")}</button>
          </div>
          <div class="chapter-panel hidden" id="chapter-panel">
            <div class="chapter-panel-head">
              <div>
                <strong>${t("chapter.all")}</strong>
                <small id="chapter-panel-summary"></small>
              </div>
              <button class="ghost-button compact-button" data-chapter-create-trigger>+ ${t("chapter.new")}</button>
            </div>
            <div class="chapter-panel-list" id="chapter-panel-list"></div>
          </div>
        </div>
      </div>
      <div class="top-bar-actions">
        <span class="status-pill" id="save-status-pill"></span>
        <button class="ghost-button" id="word-count-button"></button>
        <button class="ghost-button compact-button top-import-button" data-menu-action="import-text">${getLanguage() === "en" ? "Import TXT" : "导入 TXT"}</button>
        <div class="menu-wrap">
          <button class="icon-button" id="more-menu-button">⋯</button>
          <div class="dropdown-menu hidden" id="more-menu">
            <button data-menu-action="rename-chapter">${t("menu.renameChapter")}</button>
            <button data-menu-action="move-chapter">${t("menu.moveChapter")}</button>
            <button data-menu-action="delete-chapter">${t("menu.deleteChapter")}</button>
            <button data-menu-action="history">${t("menu.history")}</button>
            <button data-menu-action="shortcuts">${t("menu.shortcuts")}</button>
            <button data-menu-action="import-text">${t("menu.importText")}</button>
            <button data-menu-action="export">${t("menu.export")}</button>
            <button data-menu-action="focus">${t("menu.focus")}</button>
            <button data-menu-action="night">${t("menu.night")}</button>
          </div>
        </div>
      </div>
    </header>
  `;
}

function DocumentEditor() {
  return `
    <section class="editor-main surface" id="editor-main">
      <div class="find-replace-bar hidden" id="find-replace-bar">
        <input id="find-query-input" type="text" placeholder="${escapeAttribute(t("editor.findPlaceholder"))}" />
        <input id="replace-query-input" type="text" placeholder="${escapeAttribute(t("editor.replacePlaceholder"))}" />
        <button class="ghost-button" id="find-next-button">${t("editor.findNext")}</button>
        <button class="ghost-button" id="replace-button">${t("editor.replace")}</button>
        <button class="icon-button" id="close-find-button" title="${escapeAttribute(getLanguage() === "en" ? "Close find" : "关闭查找")}">×</button>
      </div>
      <div class="selection-toolbar hidden" id="selection-toolbar">
        <button class="ghost-button compact-button" data-selection-action="quote">${t("editor.quote")}</button>
        <button class="ghost-button compact-button" data-selection-action="divider">${t("editor.divider")}</button>
        <button class="ghost-button compact-button" data-selection-action="ai-rewrite">${t("ai.rewriteSelection")}</button>
      </div>
      <div class="editor-stack" id="editor-stack">
        <div class="editor-primary-pane" id="editor-primary-pane">
          <div class="editor-pane-shell">
            <div class="editor-pane-body">
              <textarea id="document-editor" class="document-editor" spellcheck="false" placeholder="${escapeAttribute(t("editor.placeholder"))}"></textarea>
            </div>
          </div>
        </div>
        <section class="outline-panel hidden" id="outline-panel">
          <button class="outline-panel-resize-handle" id="outline-panel-resize-handle" title="${escapeAttribute(t("editor.outlineResize"))}" aria-label="${escapeAttribute(t("editor.outlineResize"))}">
            <span class="outline-panel-size-indicator" id="outline-panel-size-indicator">20%</span>
          </button>
          <div class="outline-panel-shell editor-pane-shell">
            <div class="outline-panel-head editor-pane-head">
              <div>
                <strong>${t("editor.outline")}</strong>
                <small id="outline-panel-status">${t("status.saved")}</small>
              </div>
              <div class="outline-panel-actions">
                <button class="ghost-button compact-button" id="outline-panel-save-button">${t("editor.save")}</button>
                <button class="icon-button outline-panel-close-button" id="outline-panel-close-button" title="${escapeAttribute(t("editor.closeOutline"))}" aria-label="${escapeAttribute(t("editor.closeOutline"))}">×</button>
              </div>
            </div>
            <div class="editor-pane-body">
              <textarea id="outline-panel-editor" class="outline-panel-editor" spellcheck="false" placeholder="${escapeAttribute(t("editor.outlinePanelPlaceholder"))}"></textarea>
            </div>
          </div>
        </section>
      </div>
      <section class="ai-review-surface hidden" id="ai-review-surface"></section>
    </section>
  `;
}

function BottomWorkspaceTabs() {
  return `
    <aside class="workspace-sidebar surface" id="workspace-sidebar">
      <div class="workspace-sidebar-head">
        <strong>${t("workspace.title")}</strong>
        <button class="ghost-button compact-button" id="right-sidebar-toggle-button">${t("editor.collapse")}</button>
      </div>
      <div class="workspace-panels">
        <section class="workspace-panel" data-panel="writing">${WritingPanel()}</section>
        <section class="workspace-panel hidden" data-panel="inspiration">${InspirationPanel()}</section>
        <section class="workspace-panel hidden" data-panel="settings">${SettingsPanel()}</section>
      </div>
      <nav class="workspace-tabs">
        <button class="tab-chip active" data-tab="writing">${t("workspace.writing")}</button>
        <button class="tab-chip" data-tab="inspiration">${t("workspace.inspiration")}</button>
        <button class="tab-chip" data-tab="settings">${t("workspace.settings")}</button>
      </nav>
    </aside>
  `;
}

function WritingPanel() {
  return `
    <div class="writing-panel" id="writing-panel">
      <div class="writing-toolbar-top">
        <button class="focus-timer-chip" id="focus-timer-compact-button" type="button" title="${getLanguage() === "en" ? "Place the cursor in the editor to start. Click to pause. Hold to reset." : "将光标放入编辑区开始计时，点击暂停，长按重置"}">
          <span>${t("workspace.focusTimer")}</span>
          <strong id="focus-timer-value">0h 0m 0s</strong>
        </button>
        <button class="primary-button" data-writing-action="toolbar-settings">${t("workspace.toolbarSettings")}</button>
      </div>
      ${getVisibleWritingToolModuleIds().map(renderWritingToolModule).join("")}
    </div>
  `;
}

function renderWritingToolModule(moduleId) {
  if (moduleId === "punctuation") {
    return `
      <section class="tool-group" data-writing-tool-module="punctuation">
        <label>${t("workspace.punctuation")}</label>
        <div class="chip-row">
          ${punctuationChoices.map((item) => `<button class="chip" data-insert-text="${escapeAttribute(item)}">${escapeHtml(item)}</button>`).join("")}
        </div>
      </section>
    `;
  }
  if (moduleId === "quick-actions") {
    return `
      <section class="tool-card quick-actions-card" data-writing-tool-module="quick-actions">
        <div class="section-line">
          <strong>${t("workspace.quickActions")}</strong>
          <small id="resume-hint">${t("workspace.resumeHint")}</small>
        </div>
        <div class="tool-grid two-col">
          <button class="ghost-button" data-writing-action="divider">${t("editor.divider")}</button>
          <button class="ghost-button" data-writing-action="undo">${getLanguage() === "en" ? "Undo" : "撤销"}</button>
          <button class="ghost-button" data-writing-action="redo">${getLanguage() === "en" ? "Redo" : "重做"}</button>
          <button class="ghost-button" data-writing-action="resume">${t("workspace.resumeButton")}</button>
          <button class="ghost-button" data-writing-action="prev">${getLanguage() === "en" ? "Previous Chapter" : "上一章节"}</button>
          <button class="ghost-button" data-writing-action="next">${getLanguage() === "en" ? "Next Chapter" : "下一章节"}</button>
        </div>
      </section>
    `;
  }
  if (moduleId === "word-goal") {
    return `
      <section class="tool-card stat-card word-goal-card" data-writing-tool-module="word-goal">
        <label>${t("workspace.wordGoal")}</label>
        <input id="word-goal-input" type="number" min="0" />
        <div class="word-goal-meter" aria-hidden="true">
          <span id="word-goal-progress-bar"></span>
        </div>
        <small id="word-goal-progress"></small>
        <div class="word-goal-stats">
          <span>${t("workspace.chapterProgress")}</span>
          <strong id="word-goal-balance">--</strong>
        </div>
        <div class="word-goal-stats">
          <span>${t("workspace.workWords")}</span>
          <strong id="work-word-total">--</strong>
        </div>
        <small id="work-goal-total"></small>
      </section>
    `;
  }
  if (moduleId === "chapter-tools") {
    return `
      <section class="tool-grid two-col" data-writing-tool-module="chapter-tools">
        <button class="tool-card action-card" data-writing-action="open-notes">
          <strong>${t("workspace.notesEntry")}</strong>
          <small>${t("workspace.notesEntryHint")}</small>
        </button>
        <button class="tool-card action-card" data-writing-action="open-outline">
          <strong>${t("workspace.outlineEntry")}</strong>
          <small>${t("workspace.outlineEntryHint")}</small>
        </button>
      </section>
    `;
  }
  if (moduleId === "ai-agent") {
    return `
      <section class="tool-card writing-ai-card" data-writing-tool-module="ai-agent">
        <div class="section-line">
          <div>
            <span class="section-kicker">${getLanguage() === "en" ? "Current Chapter" : "当前章节"}</span>
            <strong>${t("ai.title")}</strong>
          </div>
          <small>${getLanguage() === "en" ? "Project materials, memory, and this chapter." : "调用项目资料、记忆与当前章节。"}</small>
        </div>
        <small class="agent-target-hint" id="agent-target-hint"></small>
        <div class="agent-generation-controls">
          <label for="agent-generation-mode-select">
            <span>${getLanguage() === "en" ? "Mode" : "生成模式"}</span>
            <select id="agent-generation-mode-select">
              ${agentGenerationModes
                .map((mode) => `<option value="${escapeAttribute(mode.id)}">${escapeHtml(getLanguage() === "en" ? mode.en : mode.zh)}</option>`)
                .join("")}
            </select>
          </label>
          <small id="agent-generation-mode-hint"></small>
        </div>
        <div class="agent-goal-box">
          <textarea
            id="agent-goal-input"
            rows="3"
            placeholder="${escapeAttribute(getLanguage() === "en" ? "Describe a task goal, e.g. update project materials from selected ideas." : "描述任务目标，例如：根据选中的灵感更新人物和世界观。")}"
          ></textarea>
          <div class="agent-goal-actions">
            <button class="ghost-button" data-agent-goal-action="parse">${getLanguage() === "en" ? "Parse Goal" : "解析目标"}</button>
            <button class="primary-button" data-agent-goal-action="execute">${getLanguage() === "en" ? "Execute Suggested Workflow" : "执行建议流程"}</button>
          </div>
          <div class="agent-goal-draft" id="agent-goal-draft"></div>
        </div>
        <div class="agent-stage-list">
          <div class="agent-stage-row">
            <span>${getLanguage() === "en" ? "Plan" : "规划"}</span>
            <button class="ghost-button" data-agent-action="generate-outline">${t("ai.generateOutline")}</button>
          </div>
          <div class="agent-stage-row">
            <span>${getLanguage() === "en" ? "Draft" : "起草"}</span>
            <button class="ghost-button" data-agent-action="write-chapter">${t("ai.writeChapter")}</button>
          </div>
          <div class="agent-stage-row">
            <span>${getLanguage() === "en" ? "Revise" : "改稿"}</span>
            <div class="agent-stage-actions">
              <button class="primary-button" data-ai-action="open-review">${getLanguage() === "en" ? "Compare" : "对比改稿"}</button>
              <button class="ghost-button" data-ai-action="generate-mock">${t("ai.generateRevision")}</button>
            </div>
          </div>
          <div class="agent-stage-row">
            <span>${getLanguage() === "en" ? "Maintain" : "维护"}</span>
            <div class="agent-stage-actions">
              <button class="ghost-button" data-agent-action="summarize-chapter">${t("ai.summarizeChapter")}</button>
              <button class="ghost-button" data-agent-action="check-consistency">${t("ai.checkConsistency")}</button>
            </div>
          </div>
        </div>
        <div class="agent-status" id="agent-status"></div>
      </section>
    `;
  }
  return "";
}

function InspirationPanel() {
  return `
    <div class="inspiration-panel" id="inspiration-panel">
      <div class="inspiration-toolbar">
        <div class="inspiration-toolbar-row inspiration-toolbar-row-primary">
          <select id="inspiration-category-filter"></select>
          <button class="primary-button" id="new-inspiration-button">${getLanguage() === "en" ? "New Idea" : "新建灵感"}</button>
        </div>
        <div class="inspiration-toolbar-row inspiration-toolbar-row-filter">
          <input id="inspiration-search-input" type="search" placeholder="${escapeAttribute(getLanguage() === "en" ? "Search ideas" : "搜索灵感内容")}" />
          <button class="ghost-button subtle-button" id="inspiration-sort-button">${getLanguage() === "en" ? "Sort: Newest" : "排序：最新"}</button>
        </div>
      </div>
      <div class="inspiration-compose hidden" id="inspiration-compose">
        <div class="section-line">
          <strong id="inspiration-compose-title">${getLanguage() === "en" ? "New Idea" : "新建灵感"}</strong>
          <small id="inspiration-compose-hint">${getLanguage() === "en" ? "Add content and categories, then save it to the idea list." : "填写内容和分类后保存到灵感列表。"}</small>
        </div>
        <textarea id="inspiration-compose-input" rows="4" placeholder="${escapeAttribute(getLanguage() === "en" ? "Record an idea" : "记录一条灵感内容")}"></textarea>
        <div class="inspiration-compose-row">
          <select id="inspiration-compose-category"></select>
          <input id="inspiration-custom-category-input" type="text" placeholder="${escapeAttribute(getLanguage() === "en" ? "Custom category" : "自定义分类")}" />
          <button class="ghost-button" id="add-inspiration-category-button">${getLanguage() === "en" ? "Add Category" : "添加分类"}</button>
        </div>
        <div class="inspiration-selected-tags" id="inspiration-selected-tags"></div>
        <div class="inspiration-compose-row">
          <button class="primary-button" id="save-inspiration-button">${getLanguage() === "en" ? "Save Idea" : "保存灵感"}</button>
          <button class="ghost-button" id="cancel-inspiration-button">${getLanguage() === "en" ? "Cancel" : "取消"}</button>
        </div>
      </div>
      <div class="inspiration-chat-list" id="inspiration-chat-list"></div>
    </div>
  `;
}

function ProjectMaterialsPanel() {
  return `
    <div class="project-materials-panel" id="project-materials-panel">
      <section class="tool-card project-materials-card">
        <div class="section-line">
          <strong>${getLanguage() === "en" ? "Project Materials" : "项目资料"}</strong>
          <small>${getLanguage() === "en" ? "Agent context for this novel." : "AI 写作助手会优先读取这些资料。"}</small>
        </div>
        <div class="project-material-overview" id="project-material-overview"></div>
        <small class="project-material-helper" id="project-material-helper"></small>
        <textarea id="project-material-editor" class="project-material-editor" spellcheck="false"></textarea>
        <div class="project-materials-footer">
          <small id="project-material-status"></small>
          <button class="primary-button" id="save-project-material-button">${getLanguage() === "en" ? "Save Material" : "保存资料"}</button>
        </div>
      </section>
      <section class="tool-card project-materials-card">
        <div class="section-line">
          <strong>${getLanguage() === "en" ? "Material Chapter Files" : "资料章节文件"}</strong>
          <small>${getLanguage() === "en" ? "Files stored in the project materials chapters folder." : "项目资料 chapters 文件夹中的文件。"}</small>
        </div>
        <div class="project-material-chapter-list" id="project-material-chapter-list"></div>
      </section>
    </div>
  `;
}

function SettingsPanel() {
  return `
    <div class="settings-panel" id="settings-panel">
      ${AccountCard()}
      ${AiSettingsCard()}
      ${ThemeSelector()}
      ${FontSelector()}
      <section class="tool-card">
        <div class="section-line">
          <strong>${getLanguage() === "en" ? "Editor Behavior" : "编辑器行为"}</strong>
          <small>${getLanguage() === "en" ? "Control return handling and autosave." : "控制返回前处理和自动保存逻辑。"}</small>
        </div>
        <label class="toggle-row">
          <span>${getLanguage() === "en" ? "Autosave" : "自动保存"}</span>
          <input id="autosave-toggle" type="checkbox" />
        </label>
      </section>
    </div>
  `;
}

function AccountCard() {
  return `<section class="account-card tool-card" id="account-card"></section>`;
}

function AiSettingsCard() {
  return `
    <section class="tool-card ai-settings-card" id="ai-settings-card">
      <div class="section-line">
        <strong>${getLanguage() === "en" ? "AI Provider" : "AI 模型配置"}</strong>
        <small>${getLanguage() === "en" ? "Keys are stored in a local app settings file on this device, not in exported projects." : "密钥以本机应用配置文件保存，不写入作品导出文件。"}</small>
      </div>
      <label>${getLanguage() === "en" ? "Provider" : "服务商"}</label>
      <select id="ai-provider-select">
        <option value="openai">OpenAI</option>
        <option value="claude">Claude</option>
        <option value="deepseek">DeepSeek</option>
        <option value="custom">${getLanguage() === "en" ? "Custom" : "自定义"}</option>
      </select>
      <label for="ai-model-input">${getLanguage() === "en" ? "Model" : "模型"}</label>
      <select id="ai-model-select"></select>
      <input id="ai-model-input" type="text" autocomplete="off" />
      <small class="ai-model-helper">${getLanguage() === "en" ? "Choose a preset model above, or type a custom model name here." : "上方选择预设模型；也可以在这里手动输入自定义模型名。"}</small>
      <label>${getLanguage() === "en" ? "API Key" : "API Key"}</label>
      <input id="ai-api-key-input" type="password" autocomplete="off" placeholder="${escapeAttribute(getLanguage() === "en" ? "Leave blank to keep the saved key" : "留空则保留已保存密钥")}" />
      <label>${getLanguage() === "en" ? "Base URL" : "Base URL"}</label>
      <input id="ai-base-url-input" type="url" autocomplete="off" placeholder="${escapeAttribute(getLanguage() === "en" ? "Optional for custom-compatible APIs" : "兼容接口可选填写")}" />
      <label class="toggle-row ai-cost-details-toggle">
        <span>${getLanguage() === "en" ? "Show generation cost details" : "显示生成成本详情"}</span>
        <input id="agent-show-cost-details-toggle" type="checkbox" />
      </label>
      <div class="ai-settings-footer">
        <small id="ai-settings-status"></small>
        <button class="primary-button" id="save-ai-settings-button">${getLanguage() === "en" ? "Save AI Settings" : "保存 AI 设置"}</button>
      </div>
    </section>
  `;
}

function ThemeSelector() {
  return `
    <section class="tool-card">
      <button class="section-line accordion-trigger" id="theme-accordion-button">
        <strong>${getLanguage() === "en" ? "Theme" : "主题"}</strong>
        <small id="theme-accordion-hint">${getLanguage() === "en" ? "Click to expand theme settings" : "点击展开主题设置"}</small>
      </button>
      <div class="theme-list hidden" id="theme-list"></div>
    </section>
  `;
}

function FontSelector() {
  return `
    <section class="tool-card">
      <div class="section-line">
        <strong>${getLanguage() === "en" ? "Font and Layout" : "字体与排版"}</strong>
        <small>${getLanguage() === "en" ? "Applies to the editor, top bar, and buttons in real time." : "实时作用于正文编辑器、顶部栏和按钮。"}</small>
      </div>
      <label>${getLanguage() === "en" ? "Open-source Font" : "开源字体"}</label>
      <select id="font-family-select"></select>
      <small>${getLanguage() === "en" ? "Includes offline Simplified Chinese fonts and open-source English font presets." : "已离线内置 10 组简体中文字体，并保留其他开源英文字体预设。"}</small>
      <label>${getLanguage() === "en" ? "Font Size" : "字号"}</label>
      <input id="font-size-range" type="range" min="14" max="28" />
      <label>${getLanguage() === "en" ? "Line Height" : "行高"}</label>
      <input id="line-height-range" type="range" min="1.4" max="2.6" step="0.1" />
      <label>${getLanguage() === "en" ? "Letter Spacing" : "字间距"}</label>
      <input id="letter-spacing-range" type="range" min="-1" max="4" step="0.1" />
    </section>
  `;
}

function collectRefs() {
  refs.app = document.getElementById("app");
  refs.libraryPage = document.getElementById("library-page");
  refs.libraryBreadcrumb = document.getElementById("library-breadcrumb");
  refs.languageSelect = document.getElementById("language-select");
  refs.folderUpButton = document.getElementById("folder-up-button");
  refs.createEntryButton = document.getElementById("create-entry-button");
  refs.createEntryMenu = document.getElementById("create-entry-menu");
  refs.librarySearchInput = document.getElementById("library-search-input");
  refs.libraryFullTextSearchInput = document.getElementById("library-full-text-search-input");
  refs.librarySortSelect = document.getElementById("library-sort-select");
  refs.libraryContent = document.getElementById("library-content");
  refs.libraryTree = document.getElementById("library-tree");
  refs.libraryList = document.getElementById("library-list");
  refs.editorPage = document.getElementById("editor-page");
  refs.backButton = document.getElementById("back-button");
  refs.currentWorkTitle = document.getElementById("current-work-title");
  refs.appVersion = document.getElementById("app-version");
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
  refs.closeFindButton = document.getElementById("close-find-button");
  refs.selectionToolbar = document.getElementById("selection-toolbar");
  refs.editorMain = document.getElementById("editor-main");
  refs.editorStack = document.getElementById("editor-stack");
  refs.editorPrimaryPane = document.getElementById("editor-primary-pane");
  refs.aiReviewSurface = document.getElementById("ai-review-surface");
  refs.documentEditor = document.getElementById("document-editor");
  refs.chapterSidebar = document.getElementById("chapter-sidebar");
  refs.leftSidebarResizeHandle = document.getElementById("left-sidebar-resize-handle");
  refs.editorColumn = document.getElementById("editor-column");
  refs.chapterNotesInput = document.getElementById("chapter-notes-input");
  refs.chapterOutlineInput = document.getElementById("chapter-outline-input");
  refs.outlineExpandButton = document.getElementById("outline-expand-button");
  refs.outlinePanel = document.getElementById("outline-panel");
  refs.outlinePanelStatus = document.getElementById("outline-panel-status");
  refs.outlinePanelSizeIndicator = document.getElementById("outline-panel-size-indicator");
  refs.outlinePanelEditor = document.getElementById("outline-panel-editor");
  refs.outlinePanelSaveButton = document.getElementById("outline-panel-save-button");
  refs.outlinePanelCloseButton = document.getElementById("outline-panel-close-button");
  refs.outlinePanelResizeHandle = document.getElementById("outline-panel-resize-handle");
  refs.leftSidebarToggleButton = document.getElementById("left-sidebar-toggle-button");
  refs.leftSidebarReopenButton = document.getElementById("left-sidebar-reopen-button");
  refs.leftSidebarNav = document.getElementById("left-sidebar-nav");
  refs.sidebarDetails = [...document.querySelectorAll("[data-sidebar-detail]")];
  refs.workspaceSidebar = document.getElementById("workspace-sidebar");
  refs.rightSidebarResizeHandle = document.getElementById("right-sidebar-resize-handle");
  refs.rightSidebarToggleButton = document.getElementById("right-sidebar-toggle-button");
  refs.rightSidebarReopenButton = document.getElementById("right-sidebar-reopen-button");
  refs.workspacePanels = [...document.querySelectorAll(".workspace-panel")];
  refs.workspaceTabs = [...document.querySelectorAll("[data-tab]")];
  refs.wordGoalInput = document.getElementById("word-goal-input");
  refs.wordGoalProgressBar = document.getElementById("word-goal-progress-bar");
  refs.wordGoalProgress = document.getElementById("word-goal-progress");
  refs.wordGoalBalance = document.getElementById("word-goal-balance");
  refs.workWordTotal = document.getElementById("work-word-total");
  refs.workGoalTotal = document.getElementById("work-goal-total");
  refs.focusTimerCompactButton = document.getElementById("focus-timer-compact-button");
  refs.focusTimerValue = document.getElementById("focus-timer-value");
  refs.resumeHint = document.getElementById("resume-hint");
  refs.agentStatus = document.getElementById("agent-status");
  refs.agentTargetHint = document.getElementById("agent-target-hint");
  refs.agentGenerationModeSelect = document.getElementById("agent-generation-mode-select");
  refs.agentGenerationModeHint = document.getElementById("agent-generation-mode-hint");
  refs.agentShowCostDetailsToggle = document.getElementById("agent-show-cost-details-toggle");
  refs.agentGoalInput = document.getElementById("agent-goal-input");
  refs.agentGoalDraft = document.getElementById("agent-goal-draft");
  refs.inspirationCategoryFilter = document.getElementById("inspiration-category-filter");
  refs.inspirationSearchInput = document.getElementById("inspiration-search-input");
  refs.inspirationSortButton = document.getElementById("inspiration-sort-button");
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
  refs.projectMaterialOverview = document.getElementById("project-material-overview");
  refs.projectMaterialHelper = document.getElementById("project-material-helper");
  refs.projectMaterialEditor = document.getElementById("project-material-editor");
  refs.projectMaterialStatus = document.getElementById("project-material-status");
  refs.saveProjectMaterialButton = document.getElementById("save-project-material-button");
  refs.projectMaterialChapterList = document.getElementById("project-material-chapter-list");
  refs.accountCard = document.getElementById("account-card");
  refs.aiProviderSelect = document.getElementById("ai-provider-select");
  refs.aiModelSelect = document.getElementById("ai-model-select");
  refs.aiModelInput = document.getElementById("ai-model-input");
  refs.aiApiKeyInput = document.getElementById("ai-api-key-input");
  refs.aiBaseUrlInput = document.getElementById("ai-base-url-input");
  refs.aiSettingsStatus = document.getElementById("ai-settings-status");
  refs.saveAiSettingsButton = document.getElementById("save-ai-settings-button");
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
  refs.languageSelect.addEventListener("change", (event) => setLanguage(event.target.value));
  refs.folderUpButton.addEventListener("click", handleFolderUp);
  refs.createEntryButton?.addEventListener("click", () => {
    state.ui.libraryCreateOpen = !state.ui.libraryCreateOpen;
    updateLibraryHeader();
    persist();
  });
  refs.librarySearchInput.addEventListener("input", (event) => {
    state.ui.librarySearch = event.target.value;
    renderLibraryPage();
    persist();
  });
  refs.libraryFullTextSearchInput.addEventListener("input", (event) => {
    state.ui.libraryFullTextSearch = event.target.value;
    renderLibraryPage();
    persist();
  });
  refs.librarySortSelect.addEventListener("change", (event) => {
    state.ui.librarySort = event.target.value;
    renderLibraryPage();
    persist();
  });
  refs.libraryList.addEventListener("scroll", () => {
    state.ui.libraryScrollTop = refs.libraryList.scrollTop;
    persist();
  });
  refs.libraryList.addEventListener("dragstart", handleLibrarySectionDragStart);
  refs.libraryList.addEventListener("dragover", handleLibrarySectionDragOver);
  refs.libraryList.addEventListener("drop", handleLibrarySectionDrop);
  refs.libraryList.addEventListener("dragend", handleLibrarySectionDragEnd);
  refs.backButton.addEventListener("click", handleBackNavigation);
  refs.chapterSwitcherButton.addEventListener("click", toggleChapterPanel);
  refs.chapterPanelList.addEventListener("keydown", handleChapterPanelKeydown);
  refs.chapterPanelList.addEventListener("dragstart", handleChapterDragStart);
  refs.chapterPanelList.addEventListener("dragover", handleChapterDragOver);
  refs.chapterPanelList.addEventListener("drop", handleChapterDrop);
  refs.chapterPanelList.addEventListener("dragend", handleChapterDragEnd);
  refs.moreMenuButton.addEventListener("click", () => refs.moreMenu.classList.toggle("hidden"));
  refs.wordCountButton.addEventListener("click", () => switchTab("writing"));
  bindFocusTimerButton();
  refs.findNextButton.addEventListener("click", findNext);
  refs.replaceButton.addEventListener("click", replaceCurrent);
  refs.closeFindButton.addEventListener("click", closeFindReplace);
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
  refs.chapterOutlineInput.addEventListener("focus", handleOutlineFocus);
  refs.chapterOutlineInput.addEventListener("blur", handleOutlineBlur);
  refs.chapterOutlineInput.addEventListener("keydown", handleOutlineKeydown);
  refs.outlineExpandButton.addEventListener("click", () => openOutlinePanel({ focus: true }));
  refs.outlinePanelEditor.addEventListener("input", handleOutlinePanelInput);
  refs.outlinePanelEditor.addEventListener("keydown", handleOutlineKeydown);
  refs.outlinePanelEditor.addEventListener("focus", handleOutlineFocus);
  refs.outlinePanelEditor.addEventListener("blur", handleOutlineBlur);
  refs.outlinePanelSaveButton.addEventListener("click", () => void saveCurrentOutline());
  refs.outlinePanelCloseButton.addEventListener("click", () => void closeOutlinePanel());
  refs.outlinePanelResizeHandle.addEventListener("mousedown", beginOutlineResize);
  refs.leftSidebarToggleButton.addEventListener("click", toggleLeftSidebar);
  refs.leftSidebarReopenButton.addEventListener("click", toggleLeftSidebar);
  refs.leftSidebarResizeHandle.addEventListener("mousedown", (event) => beginSidebarResize(event, "left"));
  refs.rightSidebarToggleButton.addEventListener("click", toggleRightSidebar);
  refs.rightSidebarReopenButton.addEventListener("click", toggleRightSidebar);
  refs.rightSidebarResizeHandle.addEventListener("mousedown", (event) => beginSidebarResize(event, "right"));
  refs.wordGoalInput?.addEventListener("input", handleWordGoalInput);
  refs.agentGenerationModeSelect?.addEventListener("change", handleAgentGenerationModeChange);
  refs.agentShowCostDetailsToggle?.addEventListener("change", handleAgentShowCostDetailsChange);
  refs.agentGoalInput?.addEventListener("input", handleAgentGoalInput);
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
  refs.addInspirationCategoryButton.addEventListener("click", addSelectedInspirationCategory);
  refs.saveInspirationButton.addEventListener("click", saveComposedInspiration);
  refs.cancelInspirationButton.addEventListener("click", closeInspirationComposer);
  refs.projectMaterialOverview.addEventListener("click", handleProjectMaterialOverviewClick);
  refs.projectMaterialEditor.addEventListener("input", handleProjectMaterialInput);
  refs.saveProjectMaterialButton.addEventListener("click", () => void saveCurrentProjectMaterial());
  refs.aiProviderSelect.addEventListener("change", handleAiProviderChange);
  refs.aiModelSelect?.addEventListener("change", handleAiModelSelectChange);
  refs.saveAiSettingsButton.addEventListener("click", () => void saveAiSettingsFromForm());
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
    if (event.target.checked && hasUnsavedChanges()) void saveCurrentChapter();
    updateSettingsPanel();
    persist();
  });
  refs.workspaceTabs.forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });
  refs.app.addEventListener("click", handleDelegatedClick);
  refs.app.addEventListener("mousedown", handleEditorialSuggestionsDragStart);
  refs.app.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (!state.ui.modal && (event.metaKey || event.ctrlKey) && key === "f" && state.route === "editor") {
      event.preventDefault();
      openFindReplace();
      return;
    }
    if (!state.ui.modal && event.key === "Escape" && state.ui.replaceOpen) {
      event.preventDefault();
      closeFindReplace();
      return;
    }
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

  if (!globalEventsBound && desktopApi?.onMenuAction) {
    desktopApi.onMenuAction((action) => handleDesktopMenuAction(action));
  }

  if (!globalEventsBound && desktopApi?.onPrepareClose && desktopApi?.closeReady) {
    desktopApi.onPrepareClose(async () => {
      await flushLibrarySyncToDesktop();
      desktopApi.closeReady();
    });
  }

  if (!globalEventsBound) {
    window.addEventListener("mousemove", handleOutlineResizeMove);
    window.addEventListener("mouseup", endOutlineResize);
    window.addEventListener("mousemove", handleSidebarResizeMove);
    window.addEventListener("mouseup", endSidebarResize);
    window.addEventListener("mousemove", handleEditorialSuggestionsDragMove);
    window.addEventListener("mouseup", endEditorialSuggestionsDrag);
    window.addEventListener("resize", syncOutlinePanelLayout);
    globalEventsBound = true;
  }
}

function bindFocusTimerButton() {
  if (!refs.focusTimerCompactButton) return;

  const clearLongPress = () => {
    clearTimeout(focusTimerLongPressTimer);
    focusTimerLongPressTimer = null;
  };

  refs.focusTimerCompactButton.addEventListener("pointerdown", () => {
    focusTimerLongPressTriggered = false;
    clearLongPress();
    focusTimerLongPressTimer = setTimeout(() => {
      focusTimerLongPressTriggered = true;
      resetFocusTimer();
    }, focusTimerLongPressMs);
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach((eventName) => {
    refs.focusTimerCompactButton.addEventListener(eventName, clearLongPress);
  });
  refs.focusTimerCompactButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (focusTimerLongPressTriggered) {
      focusTimerLongPressTriggered = false;
      return;
    }
    stopFocusTimer();
  });
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

  const folderToggle = event.target.closest("[data-folder-toggle]");
  if (folderToggle) {
    toggleFolderExpanded(folderToggle.dataset.folderToggle);
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

  const chapterOpen = event.target.closest("[data-open-chapter]");
  if (chapterOpen) {
    await openChapter(chapterOpen.dataset.workId, chapterOpen.dataset.openChapter);
    if (chapterOpen.dataset.searchQuery) {
      focusEditorSearchMatch(chapterOpen.dataset.searchQuery);
    }
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

  const aiAction = event.target.closest("[data-ai-action]");
  if (aiAction) {
    await handleAiAction(aiAction.dataset.aiAction);
    return;
  }

  const agentAction = event.target.closest("[data-agent-action]");
  if (agentAction) {
    await handleAgentAction(agentAction.dataset.agentAction);
    return;
  }

  const agentGoalAction = event.target.closest("[data-agent-goal-action]");
  if (agentGoalAction) {
    await handleAgentGoalAction(agentGoalAction.dataset.agentGoalAction);
    return;
  }

  const inspirationAction = event.target.closest("[data-inspiration-action]");
  if (inspirationAction) {
    await handleInspirationAction(
      inspirationAction.dataset.inspirationAction,
      inspirationAction.dataset.id,
    );
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
    await applySelectionAction(selectionAction.dataset.selectionAction);
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
    requestAnimationFrame(() => {
      const shouldFocusOutline = state.outlinePanelOpen && state.ui.focusTarget === "outline";
      (shouldFocusOutline ? refs.outlinePanelEditor : refs.documentEditor)?.focus();
    });
  } else {
    requestAnimationFrame(() => {
      refs.libraryList.scrollTop = state.ui.libraryScrollTop ?? 0;
    });
  }
}

function updateLibraryHeader() {
  const path = getFolderPath(state.activeFolderId);
  refs.folderUpButton.disabled = state.activeFolderId == null;
  refs.createEntryMenu?.classList.toggle("hidden", !state.ui.libraryCreateOpen);
  refs.librarySearchInput.value = state.ui.librarySearch;
  refs.libraryFullTextSearchInput.value = state.ui.libraryFullTextSearch;
  refs.librarySortSelect.value = state.ui.librarySort;
  refs.libraryBreadcrumb.innerHTML = path
    .map((folder, index) => {
      const isLast = index === path.length - 1;
      return `<button class="breadcrumb-chip ${isLast ? "active" : ""}" data-folder-nav="${folder.id ?? ""}">${escapeHtml(folder.name)}</button>`;
    })
    .join(`<span class="breadcrumb-sep">/</span>`);
}

function getOrderedLibrarySectionIds() {
  const hasFullTextQuery = state.ui.libraryFullTextSearch.trim().length > 0;
  const allowedIds = ["browser", "recent"];
  const next = [];
  const seen = new Set();
  for (const id of state.ui.librarySectionOrder ?? []) {
    if (allowedIds.includes(id) && !seen.has(id)) {
      next.push(id);
      seen.add(id);
    }
  }
  for (const id of allowedIds) {
    if (!seen.has(id)) next.push(id);
  }
  return hasFullTextQuery ? ["global-search", ...next] : next;
}

function renderLibraryPage() {
  ensureActiveFolderTreeVisible();
  const folders = getVisibleFoldersInFolder(state.activeFolderId);
  const works = getVisibleWorksInFolder(state.activeFolderId);
  const currentFolder = getFolder(state.activeFolderId);
  const contents = [
    ...folders.map((folder) => ({ type: "folder", item: folder })),
    ...works.map((work) => ({ type: "work", item: work })),
  ];
  const searchLabel = state.ui.librarySearch.trim()
    ? t("library.searchLabel", { query: escapeHtml(state.ui.librarySearch.trim()) })
    : "";

  refs.libraryTree.innerHTML = renderFolderTree();
  const sections = {
    "global-search": renderGlobalSearchSection(),
    recent: renderRecentChaptersSection(),
    browser: renderLibraryBrowserSection(currentFolder, contents, searchLabel),
  };
  refs.libraryList.innerHTML = `
    <div class="library-section-stack">
      ${getOrderedLibrarySectionIds()
        .map((sectionId) => sections[sectionId] ?? "")
        .join("")}
    </div>
  `;
}

function renderLibraryBrowserSection(currentFolder, contents, searchLabel) {
  const folderCount = contents.filter((entry) => entry.type === "folder").length;
  const workCount = contents.filter((entry) => entry.type === "work").length;
  return `
    <section class="library-browser surface" data-library-section="browser">
      <div class="library-browser-head">
        <div class="library-browser-title">
          <strong>${currentFolder ? escapeHtml(currentFolder.name) : t("library.allWorks")}</strong>
          <small>${getLanguage() === "en" ? `${folderCount} folders · ${workCount} works` : `${folderCount} 个文件夹 · ${workCount} 个作品`}${searchLabel}</small>
        </div>
        <div class="library-browser-actions">
          <button class="ghost-button compact-button" data-library-action="open-create-folder">${t("library.createFolder")}</button>
          <button class="primary-button compact-button" data-library-action="open-create-work">${t("library.createWork")}</button>
          <button class="ghost-button compact-button" data-library-action="import-txt">${t("library.importTxt")}</button>
        </div>
        <button
          class="section-drag-handle"
          data-library-section-drag-handle
          data-library-section-id="browser"
          draggable="true"
          title="${escapeAttribute(t("library.sectionOrder"))}"
          aria-label="${escapeAttribute(t("library.sectionOrder"))}"
        >↕</button>
      </div>
      <div class="library-item-grid">
        ${contents.length > 0 ? contents.map(({ type, item }) => renderLibraryItem(type, item)).join("") : renderEmptyLibraryState()}
      </div>
    </section>
  `;
}

function renderGlobalSearchSection() {
  const query = state.ui.libraryFullTextSearch.trim();
  const results = query ? getFullTextSearchResults(query, 12) : [];
  const summary = query
    ? results.length > 0
      ? t("library.globalSearchSummary", { count: results.length })
      : t("library.globalSearchNoResults")
    : t("library.globalSearchEmpty");

  return `
    <section class="global-search-section surface" data-library-section="global-search">
      <div class="library-browser-head">
        <div class="library-browser-title">
          <strong>${t("library.globalSearch")}</strong>
          <small>${query ? escapeHtml(query) : t("library.globalSearchHint")}</small>
        </div>
        <button
          class="section-drag-handle"
          data-library-section-drag-handle
          data-library-section-id="global-search"
          draggable="true"
          title="${escapeAttribute(t("library.sectionOrder"))}"
          aria-label="${escapeAttribute(t("library.sectionOrder"))}"
        >↕</button>
      </div>
      <small class="section-summary">${summary}</small>
      ${
        query
          ? `<div class="global-search-results">
              ${results.length > 0 ? results.map((result) => renderGlobalSearchResult(result, query)).join("") : `<div class="empty-inline">${t("library.globalSearchNoResults")}</div>`}
            </div>`
          : ""
      }
    </section>
  `;
}

function renderGlobalSearchResult(result, query) {
  const { chapter, work, field, snippet } = result;
  return `
    <button
      class="global-search-result"
      data-work-id="${work.id}"
      data-open-chapter="${chapter.id}"
      data-search-query="${escapeAttribute(query)}"
    >
      <span class="global-search-result-main">
        <strong>${escapeHtml(chapter.title)}</strong>
        <small>${escapeHtml(work.title)} · ${escapeHtml(field)} · ${t("library.wordCount", { count: chapter.wordCount })}</small>
      </span>
      <span class="global-search-snippet">${escapeHtml(snippet)}</span>
    </button>
  `;
}

function renderRecentChaptersSection() {
  const recentChapters = getRecentEditedChapters(4);
  if (recentChapters.length === 0) {
    return `
      <section class="recent-section surface" data-library-section="recent">
        <div class="library-browser-head">
          <div class="library-browser-title">
            <strong>${t("library.recent")}</strong>
            <small>${t("library.recentEmpty")}</small>
          </div>
          <button
            class="section-drag-handle"
            data-library-section-drag-handle
            data-library-section-id="recent"
            draggable="true"
            title="${escapeAttribute(t("library.sectionOrder"))}"
            aria-label="${escapeAttribute(t("library.sectionOrder"))}"
          >↕</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="recent-section surface" data-library-section="recent">
      <div class="library-browser-head">
        <div class="library-browser-title">
          <strong>${t("library.recent")}</strong>
          <small>${t("library.recentHint")}</small>
        </div>
        <button
          class="section-drag-handle"
          data-library-section-drag-handle
          data-library-section-id="recent"
          draggable="true"
          title="${escapeAttribute(t("library.sectionOrder"))}"
          aria-label="${escapeAttribute(t("library.sectionOrder"))}"
        >↕</button>
      </div>
      <div class="recent-chapter-list">
        ${recentChapters.map(renderRecentChapterItem).join("")}
      </div>
    </section>
  `;
}

function renderRecentChapterItem({ chapter, work }) {
  return `
    <button class="recent-chapter-card" data-work-id="${work.id}" data-open-chapter="${chapter.id}">
      <span>
        <strong>${escapeHtml(chapter.title)}</strong>
        <small>${escapeHtml(work.title)} · ${t("library.wordCount", { count: chapter.wordCount })}</small>
      </span>
      <time>${formatRelativeTime(chapter.updatedAt)}</time>
    </button>
  `;
}

function renderFolderTree(parentId = null, depth = 0) {
  const folders = sortFolders(getFoldersInFolder(parentId));
  const rootActive = state.activeFolderId == null;
  const root = depth === 0
    ? `
      <div class="folder-tree-row root ${rootActive ? "active" : ""}" style="--depth:0">
        <button class="folder-tree-toggle" data-folder-toggle="root" ${folders.length === 0 ? "disabled" : ""}>${folders.length > 0 ? (isFolderExpanded("root") ? "⌄" : "›") : ""}</button>
        <button class="folder-tree-entry" data-folder-nav="">
          ${renderLibraryIcon("folder", "library-tree-icon")}
          <span>${t("library.allWorks")}</span>
        </button>
      </div>
      ${isFolderExpanded("root") ? renderFolderTree(null, 1) : ""}
    `
    : "";
  if (depth === 0) return root;

  return folders
    .map((folder) => {
      const children = getFoldersInFolder(folder.id);
      const expanded = isFolderExpanded(folder.id);
      const active = state.activeFolderId === folder.id;
      return `
        <div class="folder-tree-row ${active ? "active" : ""}" style="--depth:${depth}">
          <button class="folder-tree-toggle" data-folder-toggle="${folder.id}" ${children.length === 0 ? "disabled" : ""}>${children.length > 0 ? (expanded ? "⌄" : "›") : ""}</button>
          <button class="folder-tree-entry" data-folder-nav="${folder.id}">
            ${renderLibraryIcon("folder", "library-tree-icon")}
            <span>${escapeHtml(folder.name)}</span>
          </button>
        </div>
        ${expanded ? renderFolderTree(folder.id, depth + 1) : ""}
      `;
    })
    .join("");
}

function renderLibraryItem(type, item) {
  return type === "folder" ? renderFolderItem(item) : renderWorkItem(item);
}

function renderFolderItem(folder) {
  return `
    <article class="library-item-card">
      <button class="library-item-main" data-open-folder="${folder.id}">
        ${renderLibraryIcon("folder", "library-item-icon")}
        <span class="library-item-text">
          <em>${getLanguage() === "en" ? "Folder" : "文件夹"}</em>
          <strong>${escapeHtml(folder.name)}</strong>
          <small>${t("library.subfolderCount", { folders: getFoldersInFolder(folder.id).length, works: getWorksInFolder(folder.id).length })}</small>
        </span>
      </button>
      <div class="entity-menu-wrap">
        <button class="icon-button" data-entity-menu-trigger data-entity-type="folder" data-entity-id="${folder.id}">⋯</button>
      </div>
    </article>
  `;
}

function renderWorkItem(work) {
  return `
    <article class="library-item-card">
      <button class="library-item-main" data-open-work="${work.id}">
        ${renderLibraryIcon("work", "library-item-icon")}
        <span class="library-item-text">
          <em>${getLanguage() === "en" ? "Work" : "作品"}</em>
          <strong>${escapeHtml(work.title)}</strong>
          <small>${t("library.chapterCount", { count: work.chapterIds.length })} · ${t("library.wordCount", { count: getWorkWordCount(work.id) })} · ${formatRelativeTime(work.updatedAt)}</small>
        </span>
      </button>
      <div class="entity-menu-wrap">
        <button class="icon-button" data-entity-menu-trigger data-entity-type="work" data-entity-id="${work.id}">⋯</button>
      </div>
    </article>
  `;
}

function renderLibraryIcon(type, className) {
  const src = type === "folder" ? LIBRARY_FOLDER_ICON : LIBRARY_WORK_ICON;
  const alt = type === "folder" ? t("library.folderType") : t("library.workType");
  return `<img class="${className}" src="${src}" alt="${escapeAttribute(alt)}" loading="lazy" />`;
}

function renderEmptyLibraryState() {
  const isSearching = Boolean(state.ui.librarySearch.trim());
  const isRootEmpty = !isSearching && state.activeFolderId == null && state.folders.length === 0 && state.works.length === 0;
  const title = isSearching ? t("library.emptySearchTitle") : isRootEmpty ? t("library.emptyRootTitle") : t("library.emptyTitle");
  const copy = isSearching ? t("library.emptySearchCopy") : isRootEmpty ? t("library.emptyRootCopy") : t("library.emptyCopy");
  return `
    <div class="empty-state">
      <div>
        <strong>${title}</strong>
        <p>${copy}</p>
      </div>
      <div class="inline-actions">
        ${
          isSearching
            ? `<button class="ghost-button compact-button" data-library-action="clear-library-search">${getLanguage() === "en" ? "Clear Search" : "清空搜索"}</button>`
            : `<button class="ghost-button compact-button" data-library-action="open-create-folder">${t("library.createFolder")}</button>
               <button class="primary-button compact-button" data-library-action="open-create-work">${t("library.createWork")}</button>`
        }
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
          `<button data-entity-action="enter" data-entity-type="folder" data-entity-id="${id}">${getLanguage() === "en" ? "Open Folder" : "进入文件夹"}</button>`,
          `<button data-entity-action="rename" data-entity-type="folder" data-entity-id="${id}">${t("library.rename")}</button>`,
          `<button data-entity-action="delete" data-entity-type="folder" data-entity-id="${id}">${t("library.delete")}</button>`,
        ]
      : [
          `<button data-entity-action="open" data-entity-type="work" data-entity-id="${id}">${getLanguage() === "en" ? "Open Editor" : "进入编辑页"}</button>`,
          `<button data-entity-action="rename" data-entity-type="work" data-entity-id="${id}">${t("library.rename")}</button>`,
          `<button data-entity-action="delete" data-entity-type="work" data-entity-id="${id}">${t("library.delete")}</button>`,
        ];

  const { top, left } = state.ui.libraryEntityMenuPosition;
  return `<div class="dropdown-menu portal-menu" style="top:${top}px;left:${left}px;">${buttons.join("")}</div>`;
}

function renderChapterCreateMenuPortal() {
  if (!state.ui.chapterCreateMenuPosition) return "";
  const { top, left } = state.ui.chapterCreateMenuPosition;
  return `
    <div class="dropdown-menu portal-menu" style="top:${top}px;left:${left}px;">
      <button data-chapter-create-mode="end">${getLanguage() === "en" ? "Create at End" : "在末尾新建"}</button>
      <button data-chapter-create-mode="after-current">${getLanguage() === "en" ? "Insert After Current" : "在当前章节后插入"}</button>
      <button data-chapter-create-mode="before-current">${getLanguage() === "en" ? "Insert Before Current" : "在当前章节前插入"}</button>
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
      <button data-chapter-item-action="rename" data-chapter-id="${chapter.id}">${t("library.rename")}</button>
      <button data-chapter-item-action="duplicate" data-chapter-id="${chapter.id}">${getLanguage() === "en" ? "Duplicate" : "复制"}</button>
      <button data-chapter-item-action="move-up" data-chapter-id="${chapter.id}" ${index <= 0 ? "disabled" : ""}>${getLanguage() === "en" ? "Move Up" : "上移"}</button>
      <button data-chapter-item-action="move-down" data-chapter-id="${chapter.id}" ${index >= work.chapterIds.length - 1 ? "disabled" : ""}>${getLanguage() === "en" ? "Move Down" : "下移"}</button>
      <button data-chapter-item-action="delete" data-chapter-id="${chapter.id}">${t("library.delete")}</button>
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
  refs.outlinePanelEditor.disabled = !chapter;
  if (refs.wordGoalInput) refs.wordGoalInput.disabled = !chapter;
  if (!chapter) {
    refs.documentEditor.value = "";
    refs.chapterNotesInput.value = "";
    refs.chapterOutlineInput.value = "";
    refs.outlinePanelEditor.value = "";
    if (refs.wordGoalInput) refs.wordGoalInput.value = "0";
    refs.documentEditor.placeholder = t("editor.emptyPlaceholder");
    refs.findQueryInput.value = state.ui.findQuery;
    refs.replaceQueryInput.value = state.ui.replaceQuery;
    state.currentChapterOutline = "";
    return;
  }
  syncOutlineStateWithCurrentChapter();
  refs.documentEditor.placeholder = t("editor.placeholder");
  if (refs.documentEditor.value !== chapter.content) refs.documentEditor.value = chapter.content;
  refs.chapterNotesInput.value = chapter.notes;
  refs.chapterOutlineInput.value = state.currentChapterOutline;
  refs.outlinePanelEditor.value = state.currentChapterOutline;
  refs.findQueryInput.value = state.ui.findQuery;
  refs.replaceQueryInput.value = state.ui.replaceQuery;
  if (refs.wordGoalInput) refs.wordGoalInput.value = String(chapter.wordGoal);
}

function updateTopBar() {
  const work = getCurrentWork();
  const chapter = getCurrentChapter();
  refs.currentWorkTitle.textContent = work?.title ?? t("editor.noWork");
  refs.currentChapterTitle.textContent = chapter?.title ?? t("editor.selectChapter");
  refs.currentChapterMeta.textContent = chapter ? t("editor.chapterMeta", { count: chapter.wordCount, time: formatRelativeTime(chapter.updatedAt) }) : t("editor.switchHint");
  refs.wordCountButton.textContent = t("library.wordCount", { count: countWords(chapter?.content ?? "") });
  refs.saveStatusPill.textContent = getSaveStatusText(chapter);
  refs.saveStatusPill.classList.remove("status-saved", "status-saving", "status-unsaved", "status-error");
  refs.saveStatusPill.classList.add(`status-${getSaveStatusTone(chapter)}`);
}

function updateChapterPanel() {
  const work = getCurrentWork();
  const chapter = getCurrentChapter();
  refs.chapterPanel.classList.toggle("hidden", !state.ui.chapterPanelOpen || !work);
  if (!work) {
    refs.chapterPanelSummary.textContent = getLanguage() === "en" ? "Open a work first" : "请先打开作品";
    refs.chapterPanelList.innerHTML = `<div class="empty-inline">${t("chapter.noManageable")}</div>`;
    return;
  }

  const chapters = getWorkChapters(work.id);
  ensureFocusedChapter(work.id, chapters);
  refs.chapterPanelSummary.textContent = t("chapter.currentSummary", { count: getWorkChapters(work.id).length, title: chapter?.title ?? t("chapter.noneSelected") });
  refs.chapterPanelList.innerHTML =
    chapters.length > 0
      ? chapters.map((item, index) => renderEditorChapterPanelRow(work, item, index)).join("")
      : `<div class="empty-inline">${t("chapter.noChapters")}</div>`;

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
        <span class="chapter-panel-index" title="${escapeAttribute(getLanguage() === "en" ? "Drag to reorder" : "拖拽可排序")}">${getChapterOrderNumber(work.id, chapter.id)}</span>
        <span class="chapter-panel-text">
          <strong>${escapeHtml(chapter.title)}</strong>
          <small>${t("library.wordCount", { count: chapter.wordCount })} · ${formatRelativeTime(chapter.updatedAt)}</small>
        </span>
      </button>
      <button
        class="icon-button chapter-panel-item-button"
        data-chapter-item-menu-trigger
        data-chapter-id="${chapter.id}"
        title="${escapeAttribute(t("chapter.actionsTitle"))}"
      >⋯</button>
    </div>
  `;
}

function updateSidebar() {
  const chapter = getCurrentChapter();
  refs.editorPage.style.setProperty("--left-sidebar-width", `${state.ui.leftSidebarWidth}px`);
  refs.chapterSidebar.classList.toggle("sidebar-collapsed", state.ui.leftSidebarCollapsed);
  refs.leftSidebarResizeHandle.classList.toggle("hidden", state.ui.leftSidebarCollapsed);
  refs.leftSidebarReopenButton.classList.toggle("hidden", !state.ui.leftSidebarCollapsed);
  refs.leftSidebarToggleButton.textContent = state.ui.leftSidebarCollapsed ? t("editor.expand") : t("editor.collapse");
  const activeSection = ["home", "notes", "outline", "materials"].includes(state.ui.sidebarSection) ? state.ui.sidebarSection : "home";
  refs.leftSidebarNav.classList.toggle("hidden", activeSection !== "home");
  refs.sidebarDetails.forEach((section) => {
    section.classList.toggle("hidden", section.dataset.sidebarDetail !== activeSection);
  });
}

function updateWorkspace() {
  const chapter = getCurrentChapter();
  const isAiReviewMode = Boolean(state.ui.aiReviewMode && chapter);
  refs.editorPage.style.setProperty("--right-sidebar-width", `${state.ui.rightSidebarWidth}px`);
  refs.editorPage.classList.toggle("ai-review-mode", isAiReviewMode);
  refs.editorStack.classList.toggle("hidden", isAiReviewMode);
  refs.aiReviewSurface.classList.toggle("hidden", !isAiReviewMode);
  refs.workspaceSidebar.classList.toggle("sidebar-collapsed", state.ui.rightSidebarCollapsed);
  refs.rightSidebarResizeHandle.classList.toggle("hidden", state.ui.rightSidebarCollapsed || isAiReviewMode);
  refs.rightSidebarReopenButton.classList.toggle("hidden", !state.ui.rightSidebarCollapsed || isAiReviewMode);
  refs.workspaceTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === state.activeTab);
  });
  refs.workspacePanels.forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.panel !== state.activeTab);
  });
  refs.findReplaceBar.classList.toggle("hidden", !state.ui.replaceOpen || isAiReviewMode);
  refs.selectionToolbar.classList.toggle("hidden", !state.ui.selectionVisible || isAiReviewMode);
  if (refs.resumeHint) refs.resumeHint.textContent = t("workspace.lastPosition", { position: state.ui.selectionStart });
  updateWordGoalPanel(chapter);
  updateFocusTimerPanel();
  updateAgentPanel(chapter);
  refs.inspirationCompose.classList.toggle("hidden", !state.ui.inspirationComposeOpen);
  refs.outlinePanel.classList.toggle("hidden", !state.outlinePanelOpen || !chapter || isAiReviewMode);
  refs.outlineExpandButton.disabled = !chapter;
  refs.outlinePanelStatus.textContent = getOutlineStatusText();
  updateAiReviewSurface(chapter);
  updateProjectMaterialsPanel(getCurrentWork());
  syncOutlinePanelLayout();
}

function updateAgentPanel(chapter = getCurrentChapter()) {
  if (!refs.agentStatus) return;
  if (refs.agentGoalInput && refs.agentGoalInput.value !== state.ui.agentGoalText && document.activeElement !== refs.agentGoalInput) {
    refs.agentGoalInput.value = state.ui.agentGoalText;
  }
  if (refs.agentTargetHint) {
    refs.agentTargetHint.textContent = chapter
      ? (getLanguage() === "en"
          ? `Target: Chapter ${getCurrentChapterNumber(chapter)} · ${chapter.title}`
          : `当前目标：第 ${getCurrentChapterNumber(chapter)} 章 · ${chapter.title}`)
      : (getLanguage() === "en" ? "Target: no chapter selected" : "当前目标：未选择章节");
  }
  const currentMode = getCurrentAgentGenerationMode();
  if (refs.agentGenerationModeSelect) refs.agentGenerationModeSelect.value = currentMode.id;
  if (refs.agentGenerationModeHint) refs.agentGenerationModeHint.textContent = getLanguage() === "en" ? currentMode.enHint : currentMode.zhHint;
  const agentPending = Boolean(state.ui.agentActionPending);
  const reviewPending = Boolean(state.ui.aiGenerationPending);
  const pending = agentPending || reviewPending;
  if (refs.agentGenerationModeSelect) refs.agentGenerationModeSelect.disabled = pending;
  refs.app.querySelectorAll("[data-agent-action], [data-selection-action='ai-rewrite'], [data-ai-action='generate-mock']").forEach((button) => {
    button.disabled = pending || !chapter;
    const action = button.dataset.agentAction || button.dataset.selectionAction;
    const isActiveAgentButton = agentPending && action === state.ui.agentActionPending;
    const isActiveReviewButton = reviewPending && button.dataset.aiAction === "generate-mock";
    button.classList.toggle("is-loading", isActiveAgentButton || isActiveReviewButton);
  });
  refs.app.querySelectorAll("[data-agent-goal-action]").forEach((button) => {
    button.disabled = pending || (button.dataset.agentGoalAction === "execute" && !state.ui.agentGoalDraft);
  });
  if (refs.agentGoalDraft) refs.agentGoalDraft.innerHTML = renderAgentGoalDraft(state.ui.agentGoalDraft);
  refs.agentStatus.textContent = pending ? t("ai.running") : state.ui.agentStatus || t("ai.idleStatus");
}

function updateAiReviewSurface(chapter = getCurrentChapter()) {
  if (!refs.aiReviewSurface) return;
  if (!chapter) {
    refs.aiReviewSurface.innerHTML = "";
    state.ui.aiReviewMode = false;
    return;
  }
  const originalContent = chapter.content.trim();
  const aiDraftRecord = state.ui.aiDraftsByChapter?.[chapter.id] ?? null;
  const aiDraft = aiDraftRecord?.content ?? "";
  const isGenerating = Boolean(state.ui.aiGenerationPending);
  const editorialControls = renderEditorialSuggestionsControls(aiDraftRecord);
  refs.aiReviewSurface.innerHTML = `
    <div class="ai-review-mode-shell">
      <header class="ai-review-mode-toolbar">
        <div>
          <span class="section-kicker">${t("ai.title")}</span>
          <strong>${getLanguage() === "en" ? "AI Review Mode" : "AI 改稿模式"}</strong>
          <small>${getLanguage() === "en" ? "Compare the current chapter with the generated version." : "左侧为当前旧版，右侧为 AI 生成版本。"}</small>
        </div>
        <div class="ai-review-actions">
          ${editorialControls}
          <button class="ghost-button" data-ai-action="close-review">${getLanguage() === "en" ? "Exit" : "退出改稿模式"}</button>
          <button class="ghost-button" data-ai-action="generate-mock" ${isGenerating ? "disabled" : ""}>${isGenerating ? (getLanguage() === "en" ? "Generating..." : "生成中……") : (getLanguage() === "en" ? "Regenerate" : "重新生成")}</button>
          ${aiDraft ? `<button class="ghost-button" data-ai-action="copy-draft" ${isGenerating ? "disabled" : ""}>${getLanguage() === "en" ? "Copy AI Version" : "复制 AI 版本"}</button>` : ""}
          ${aiDraft ? `<button class="primary-button" data-ai-action="apply-draft" ${isGenerating ? "disabled" : ""}>${t("ai.applyDraft")}</button>` : ""}
        </div>
      </header>
      ${renderAiCompareGrid(chapter, originalContent, aiDraft, aiDraftRecord)}
    </div>
    ${renderEditorialSuggestionsFloatingPanel(aiDraftRecord)}
  `;
}

function renderEditorialSuggestionsControls(aiDraftRecord = null) {
  const status = String(aiDraftRecord?.editorialSuggestionsStatus || "");
  const fileName = String(aiDraftRecord?.editorialSuggestionsFile || "");
  if (status === "soft_failed") {
    return `<span class="editorial-suggestions-unavailable">${getLanguage() === "en" ? "Editorial suggestions unavailable" : "审稿建议暂不可用"}</span>`;
  }
  if (!fileName) return "";
  const loading = Boolean(state.ui.editorialSuggestionsLoading);
  return `<button class="ghost-button" data-ai-action="open-editorial-suggestions" ${loading ? "disabled" : ""}>${
    loading ? (getLanguage() === "en" ? "Loading..." : "读取中……") : (getLanguage() === "en" ? "View Editorial Suggestions" : "查看审稿建议")
  }</button>`;
}

function renderEditorialSuggestionsFloatingPanel(aiDraftRecord = null) {
  if (!state.ui.editorialSuggestionsOpen) return "";
  const position = normalizeFloatingPanelPosition(state.ui.editorialSuggestionsPosition);
  const content = String(aiDraftRecord?.editorialSuggestionsContent || "").trim();
  const status = String(aiDraftRecord?.editorialSuggestionsStatus || "");
  const error = String(aiDraftRecord?.editorialSuggestionsError || state.ui.editorialSuggestionsError || "").trim();
  const body = getEditorialSuggestionsPanelBody({ content, status, error });
  return `
    <aside
      class="editorial-suggestions-float surface"
      style="left: ${position.x}px; top: ${position.y}px;"
      aria-label="${escapeAttribute(getLanguage() === "en" ? "Editorial suggestions" : "审稿建议")}"
    >
      <header class="editorial-suggestions-float-head" data-editorial-suggestions-drag-handle>
        <div>
          <strong>${getLanguage() === "en" ? "Editorial Suggestions" : "审稿建议"}</strong>
          <small>${getLanguage() === "en" ? "Drag this panel to compare while editing." : "可拖拽浮窗，方便对照正文。"}</small>
        </div>
        <button class="icon-button" data-ai-action="close-editorial-suggestions" title="${escapeAttribute(getLanguage() === "en" ? "Close" : "关闭")}">×</button>
      </header>
      <pre class="editorial-suggestions-content">${escapeHtml(body)}</pre>
    </aside>
  `;
}

function getEditorialSuggestionsPanelBody({ content, status, error }) {
  if (state.ui.editorialSuggestionsLoading) {
    return getLanguage() === "en" ? "Loading editorial suggestions..." : "正在读取审稿建议……";
  }
  if (status === "soft_failed") {
    return getLanguage() === "en" ? "Editorial suggestions are temporarily unavailable." : "审稿建议暂不可用。";
  }
  if (error) {
    return `${getLanguage() === "en" ? "No editorial suggestions available." : "暂无审稿建议。"}\n${error}`;
  }
  return content || (getLanguage() === "en" ? "No editorial suggestions available." : "暂无审稿建议。");
}

function updateProjectMaterialsPanel(work = getCurrentWork()) {
  if (!refs.projectMaterialEditor) return;
  const hasWork = Boolean(work);
  refs.projectMaterialEditor.disabled = !hasWork || projectMaterialsState.loading || projectMaterialsState.saving;
  refs.saveProjectMaterialButton.disabled = !hasWork || projectMaterialsState.loading || projectMaterialsState.saving || !projectMaterialsState.dirty;
  refs.projectMaterialOverview.innerHTML = renderProjectMaterialOverview(hasWork);
  refs.projectMaterialHelper.textContent = getProjectMaterialHelperText(state.ui.projectMaterialType);

  if (!hasWork) {
    projectMaterialsState.workId = null;
    projectMaterialsState.materials = {};
    projectMaterialsState.chapters = [];
    refs.projectMaterialEditor.value = "";
    refs.projectMaterialEditor.placeholder = getLanguage() === "en" ? "Open a work first." : "请先打开一个作品。";
    refs.projectMaterialStatus.textContent = getLanguage() === "en" ? "No work selected." : "未选择作品。";
    refs.projectMaterialChapterList.innerHTML = `<span class="empty-inline">${getLanguage() === "en" ? "No project open" : "尚未打开作品"}</span>`;
    return;
  }

  if (projectMaterialsState.workId !== work.id && !projectMaterialsState.loading) {
    void loadProjectMaterials(work.id);
  }

  const content = projectMaterialsState.materials[state.ui.projectMaterialType] ?? "";
  if (!projectMaterialsState.dirty && refs.projectMaterialEditor.value !== content) {
    refs.projectMaterialEditor.value = content;
  }
  refs.projectMaterialEditor.placeholder =
    getLanguage() === "en" ? "Write project material here..." : "在这里记录项目资料……";
  refs.projectMaterialStatus.textContent = getProjectMaterialStatusText();
  refs.projectMaterialChapterList.innerHTML =
    projectMaterialsState.chapters.length > 0
      ? projectMaterialsState.chapters.map((fileName) => `<span class="project-material-chapter-file">${escapeHtml(fileName)}</span>`).join("")
      : `<span class="empty-inline">${getLanguage() === "en" ? "No material chapter files yet" : "暂无资料章节文件"}</span>`;
}

function renderProjectMaterialOverview(hasWork = true) {
  return projectMaterialTypes
    .map((item) => {
      const content = projectMaterialsState.materials[item.id] ?? "";
      const filled = content.trim().length > 0;
      const isActive = item.id === state.ui.projectMaterialType;
      const label = getLanguage() === "en" ? item.en : item.zh;
      const status = filled ? (getLanguage() === "en" ? "Filled" : "已填写") : (getLanguage() === "en" ? "Blank" : "空白");
      const wordText = filled ? t("library.wordCount", { count: countWords(content) }) : status;
      return `
        <button
          class="project-material-pill ${isActive ? "active" : ""} ${filled ? "is-filled" : "is-empty"}"
          type="button"
          data-project-material-type="${escapeAttribute(item.id)}"
          ${hasWork ? "" : "disabled"}
        >
          <strong>${escapeHtml(label)}</strong>
          <small>${escapeHtml(wordText)}</small>
        </button>
      `;
    })
    .join("");
}

function getProjectMaterialHelperText(type) {
  const item = projectMaterialTypes.find((material) => material.id === type) ?? projectMaterialTypes[0];
  return getLanguage() === "en" ? item.enHint : item.zhHint;
}

function getProjectMaterialStatusText() {
  if (projectMaterialsState.loading) return getLanguage() === "en" ? "Loading materials..." : "正在读取资料……";
  if (projectMaterialsState.saving) return getLanguage() === "en" ? "Saving..." : "保存中……";
  if (projectMaterialsState.status) return projectMaterialsState.status;
  if (projectMaterialsState.dirty) return getLanguage() === "en" ? "Unsaved changes." : "有未保存修改。";
  return getLanguage() === "en" ? "Saved locally." : "已保存到本地资料文件。";
}

async function loadProjectMaterials(workId) {
  if (!desktopApi?.readProjectMaterials) {
    projectMaterialsState.workId = workId;
    projectMaterialsState.status = getLanguage() === "en" ? "Project materials are only available in the desktop app." : "项目资料仅在桌面应用中可用。";
    updateProjectMaterialsPanel(getCurrentWork());
    return;
  }
  projectMaterialsState.loading = true;
  projectMaterialsState.dirty = false;
  projectMaterialsState.workId = workId;
  updateProjectMaterialsPanel(getCurrentWork());
  try {
    const project = await desktopApi.readProjectMaterials(workId);
    projectMaterialsState.materials = project?.materials && typeof project.materials === "object" ? project.materials : {};
    projectMaterialsState.chapters = Array.isArray(project?.chapters) ? project.chapters : [];
    projectMaterialsState.status = getLanguage() === "en" ? "Materials loaded." : "资料已读取。";
  } catch (error) {
    console.error("Failed to load project materials", error);
    projectMaterialsState.materials = {};
    projectMaterialsState.chapters = [];
    projectMaterialsState.status = error?.message || (getLanguage() === "en" ? "Failed to load materials." : "资料读取失败。");
  } finally {
    projectMaterialsState.loading = false;
    updateProjectMaterialsPanel(getCurrentWork());
  }
}

function handleProjectMaterialOverviewClick(event) {
  const button = event.target.closest("[data-project-material-type]");
  if (!button || button.disabled) return;
  switchProjectMaterialType(button.dataset.projectMaterialType);
}

function switchProjectMaterialType(value) {
  const nextType = projectMaterialTypes.some((item) => item.id === value) ? value : "outline";
  if (projectMaterialsState.dirty) {
    projectMaterialsState.materials[state.ui.projectMaterialType] = refs.projectMaterialEditor.value;
  }
  state.ui.projectMaterialType = nextType;
  projectMaterialsState.currentType = nextType;
  persist();
  updateProjectMaterialsPanel(getCurrentWork());
}

function handleProjectMaterialInput(event) {
  projectMaterialsState.dirty = true;
  projectMaterialsState.materials[state.ui.projectMaterialType] = event.target.value;
  updateProjectMaterialsPanel(getCurrentWork());
}

async function saveCurrentProjectMaterial() {
  const work = getCurrentWork();
  if (!work || !desktopApi?.saveProjectMaterial) return;
  const material = state.ui.projectMaterialType;
  const content = refs.projectMaterialEditor.value;
  projectMaterialsState.saving = true;
  projectMaterialsState.status = "";
  updateProjectMaterialsPanel(work);
  try {
    await desktopApi.saveProjectMaterial({ workId: work.id, material, content });
    projectMaterialsState.materials[material] = content;
    projectMaterialsState.dirty = false;
    projectMaterialsState.status = getLanguage() === "en" ? "Material saved." : "资料已保存。";
  } catch (error) {
    console.error("Failed to save project material", error);
    projectMaterialsState.status = error?.message || (getLanguage() === "en" ? "Failed to save material." : "资料保存失败。");
  } finally {
    projectMaterialsState.saving = false;
    updateProjectMaterialsPanel(getCurrentWork());
  }
}

function renderAiCompareGrid(chapter, originalContent = chapter?.content?.trim() ?? "", aiDraft = "", aiDraftRecord = null) {
  const originalWords = countWords(chapter?.content ?? "");
  const generatedMeta = aiDraft
    ? [
        aiDraftRecord?.provider ? String(aiDraftRecord.provider) : "",
        aiDraftRecord?.generatedAt ? formatRelativeTime(aiDraftRecord.generatedAt) : "",
      ].filter(Boolean).join(" · ")
    : (getLanguage() === "en" ? "Pending" : "待生成");
  return `
    <div class="ai-compare-grid">
      <section class="ai-compare-pane">
        <div class="ai-compare-head">
          <strong>${t("ai.originalVersion")}</strong>
          <small>${t("library.wordCount", { count: originalWords })}</small>
        </div>
        <pre>${originalContent ? escapeHtml(originalContent) : escapeHtml(t("ai.originalEmpty"))}</pre>
      </section>
      <section class="ai-compare-pane ${aiDraft ? "is-generated" : "is-pending"}">
        <div class="ai-compare-head">
          <strong>${t("ai.generatedVersion")}</strong>
          <small>${escapeHtml(generatedMeta)}</small>
        </div>
        <pre>${escapeHtml(aiDraft || t("ai.generatedPending"))}</pre>
      </section>
    </div>
  `;
}

async function handleAiAction(action) {
  const chapter = getCurrentChapter();
  if (!chapter) return;
  if (action === "open-review") {
    state.ui.aiReviewMode = true;
    updateWorkspace();
    persist();
    return;
  }
  if (action === "close-review") {
    state.ui.aiReviewMode = false;
    state.ui.editorialSuggestionsOpen = false;
    updateWorkspace();
    persist();
    return;
  }
  if (action === "open-editorial-suggestions") {
    await openEditorialSuggestionsPanel(chapter);
    return;
  }
  if (action === "close-editorial-suggestions") {
    state.ui.editorialSuggestionsOpen = false;
    updateWorkspace();
    persist();
    return;
  }
  if (action === "generate-mock") {
    if (state.ui.aiGenerationPending) return;
    state.ui.aiGenerationPending = true;
    updateWorkspace();
    try {
      const result = await runWritingAgentForChapter(chapter);
      state.ui.aiDraftsByChapter[chapter.id] = {
        content: result.content,
        provider: result.provider,
        generatedAt: result.generatedAt,
      };
      persist();
    } catch (error) {
      console.error("Failed to run writing agent", error);
      openInfoModal(
        getLanguage() === "en" ? "AI Writing Agent" : "AI 写作助手",
        error?.message || (getLanguage() === "en" ? "Generation failed." : "生成失败。"),
      );
    } finally {
      state.ui.aiGenerationPending = false;
      updateWorkspace();
    }
    return;
  }
  if (action === "apply-draft") {
    const aiDraft = state.ui.aiDraftsByChapter?.[chapter.id]?.content ?? "";
    if (!aiDraft) return;
    applyAiDraftToCurrentChapter(chapter, aiDraft);
    completeCurrentAgentConfirmation(getLanguage() === "en" ? "AI draft applied." : "AI 草稿已应用。");
    return;
  }
  if (action === "copy-draft") {
    const aiDraft = state.ui.aiDraftsByChapter?.[chapter.id]?.content ?? "";
    if (!aiDraft) return;
    await copyTextToClipboard(aiDraft);
    state.ui.agentStatus = getLanguage() === "en" ? "AI version copied." : "AI 新版已复制。";
    updateWorkspace();
    persist();
  }
}

async function openEditorialSuggestionsPanel(chapter = getCurrentChapter()) {
  if (!chapter) return;
  const draftRecord = state.ui.aiDraftsByChapter?.[chapter.id];
  if (!draftRecord) {
    state.ui.editorialSuggestionsOpen = true;
    state.ui.editorialSuggestionsError = "";
    updateWorkspace();
    persist();
    return;
  }
  if (draftRecord.editorialSuggestionsStatus === "soft_failed") {
    state.ui.editorialSuggestionsOpen = true;
    draftRecord.editorialSuggestionsError = getLanguage() === "en" ? "Editorial suggestions are temporarily unavailable." : "审稿建议暂不可用。";
    updateWorkspace();
    persist();
    return;
  }
  if (!draftRecord.editorialSuggestionsFile) {
    state.ui.editorialSuggestionsOpen = true;
    draftRecord.editorialSuggestionsError = getLanguage() === "en" ? "No editorial suggestions available." : "暂无审稿建议。";
    updateWorkspace();
    persist();
    return;
  }
  if (draftRecord.editorialSuggestionsContent) {
    state.ui.editorialSuggestionsOpen = true;
    updateWorkspace();
    persist();
    return;
  }
  if (!desktopApi?.readProjectReport) {
    state.ui.editorialSuggestionsOpen = true;
    draftRecord.editorialSuggestionsError = getLanguage() === "en" ? "Desktop report reader is unavailable." : "当前环境无法读取审稿建议。";
    updateWorkspace();
    persist();
    return;
  }
  const work = getCurrentWork();
  if (!work) return;
  state.ui.editorialSuggestionsOpen = true;
  state.ui.editorialSuggestionsLoading = true;
  draftRecord.editorialSuggestionsError = "";
  updateWorkspace();
  try {
    const report = await desktopApi.readProjectReport({
      workId: work.id,
      fileName: draftRecord.editorialSuggestionsFile,
    });
    draftRecord.editorialSuggestionsContent = sanitizeEditorialSuggestionsContent(report?.content);
    draftRecord.editorialSuggestionsError = draftRecord.editorialSuggestionsContent
      ? ""
      : (getLanguage() === "en" ? "No editorial suggestions available." : "暂无审稿建议。");
  } catch (error) {
    console.error("Failed to read editorial suggestions", error);
    draftRecord.editorialSuggestionsContent = "";
    draftRecord.editorialSuggestionsError = getLanguage() === "en" ? "No editorial suggestions available." : "暂无审稿建议。";
  } finally {
    state.ui.editorialSuggestionsLoading = false;
    updateWorkspace();
    persist();
  }
}

function sanitizeEditorialSuggestionsContent(content) {
  const text = String(content || "").trim();
  if (!text) return "";
  if (/```json|^\s*\{[\s\S]*\}\s*$/i.test(text)) return "";
  const blocked = /\b(scene_metadata|llm_events|craft_rule_ids|finish_reason|raw_report)\b/i;
  if (blocked.test(text)) {
    return text
      .split(/\r?\n/)
      .filter((line) => !/\b(scene_metadata|llm_events|craft_rule_ids|finish_reason|raw_report)\b/i.test(line))
      .join("\n")
      .trim();
  }
  return text;
}

function handleEditorialSuggestionsDragStart(event) {
  const handle = event.target.closest("[data-editorial-suggestions-drag-handle]");
  if (!handle || event.target.closest("button")) return;
  const panel = handle.closest(".editorial-suggestions-float");
  if (!panel) return;
  const position = normalizeFloatingPanelPosition(state.ui.editorialSuggestionsPosition);
  editorialSuggestionsDragState = {
    startX: event.clientX,
    startY: event.clientY,
    originX: position.x,
    originY: position.y,
  };
  event.preventDefault();
}

function handleEditorialSuggestionsDragMove(event) {
  if (!editorialSuggestionsDragState) return;
  const next = normalizeFloatingPanelPosition({
    x: editorialSuggestionsDragState.originX + event.clientX - editorialSuggestionsDragState.startX,
    y: editorialSuggestionsDragState.originY + event.clientY - editorialSuggestionsDragState.startY,
  });
  state.ui.editorialSuggestionsPosition = next;
  const panel = refs.app.querySelector(".editorial-suggestions-float");
  if (panel) {
    panel.style.left = `${next.x}px`;
    panel.style.top = `${next.y}px`;
  }
}

function endEditorialSuggestionsDrag() {
  if (!editorialSuggestionsDragState) return;
  editorialSuggestionsDragState = null;
  persist();
}

function normalizeFloatingPanelPosition(value) {
  const source = value && typeof value === "object" ? value : {};
  const maxX = Math.max(12, window.innerWidth - 360);
  const maxY = Math.max(12, window.innerHeight - 220);
  return {
    x: Math.min(Math.max(Number(source.x) || 96, 12), maxX),
    y: Math.min(Math.max(Number(source.y) || 96, 12), maxY),
  };
}

function handleAgentGoalInput(event) {
  state.ui.agentGoalText = event.target.value;
  state.ui.agentGoalDraft = null;
  state.ui.agentExecutionTrace = null;
  updateAgentPanel(getCurrentChapter());
  persist();
}

function handleAgentGenerationModeChange(event) {
  state.ui.agentGenerationMode = agentGenerationModes.some((mode) => mode.id === event.target.value)
    ? event.target.value
    : defaultAgentGenerationMode;
  updateAgentPanel(getCurrentChapter());
  persist();
}

function handleAgentShowCostDetailsChange(event) {
  state.ui.showCostDetails = Boolean(event.target.checked);
  updateAgentPanel(getCurrentChapter());
  persist();
}

async function handleAgentGoalAction(action) {
  if (action === "parse") {
    state.ui.agentGoalDraft = parseAgentGoal(state.ui.agentGoalText);
    state.ui.agentExecutionTrace = null;
    updateAgentPanel(getCurrentChapter());
    persist();
    return;
  }
  if (action === "execute") {
    const draft = state.ui.agentGoalDraft || parseAgentGoal(state.ui.agentGoalText);
    state.ui.agentGoalDraft = draft;
    updateAgentPanel(getCurrentChapter());
    await executeParsedAgentGoal(draft);
  }
}

function normalizeAgentGoalDraft(value) {
  if (!value || typeof value !== "object") return null;
  const action = String(value.action || "");
  const supportedActions = ["generate-outline", "write-chapter", "summarize-chapter", "check-consistency", "develop-selected-project-materials"];
  if (!supportedActions.includes(action)) return null;
  const planSteps = Array.isArray(value.planSteps)
    ? value.planSteps
        .map((step, index) => ({
      id: String(step?.id || `step-${index + 1}`),
      label: String(step?.label || ""),
      detail: String(step?.detail || ""),
      toolId: String(step?.toolId || step?.tool || ""),
      requiresConfirmation: Boolean(step?.requiresConfirmation),
      status: normalizeAgentStepStatus(step?.status || "queued"),
      resultSummary: String(step?.resultSummary || ""),
    }))
        .filter((step) => step.label && step.detail)
    : [];
  return {
    action,
    goal: String(value.goal || ""),
    taskLabel: String(value.taskLabel || ""),
    inputSource: String(value.inputSource || ""),
    expectedOutput: String(value.expectedOutput || ""),
    userInstruction: String(value.userInstruction || ""),
    confidence: Number(value.confidence) || 0.5,
    requiresConfirmation: Boolean(value.requiresConfirmation),
    planSteps,
    executionTrace: normalizeAgentExecutionTrace(value.executionTrace, planSteps),
  };
}

function normalizeAgentStepStatus(value) {
  const status = String(value || "").trim();
  return ["queued", "running", "success", "error", "skipped", "waiting_confirmation"].includes(status) ? status : "queued";
}

function normalizeAgentExecutionTrace(value, planSteps = []) {
  const normalizedSteps = Array.isArray(planSteps) ? planSteps : [];
  if (!value || typeof value !== "object") {
    return {
      status: "idle",
      startedAt: "",
      completedAt: "",
      error: "",
      steps: normalizedSteps.map((step) => ({
        id: String(step?.id || ""),
        toolId: String(step?.toolId || ""),
        status: normalizeAgentStepStatus(step?.status || "queued"),
        resultSummary: String(step?.resultSummary || ""),
      })),
    };
  }
  const knownSteps = new Map(
    (Array.isArray(value.steps) ? value.steps : []).map((step) => [String(step?.id || ""), step]),
  );
  const status = String(value.status || "");
  return {
    status: ["idle", "queued", "running", "success", "error", "skipped", "waiting_confirmation"].includes(status) ? status : "idle",
    startedAt: String(value.startedAt || ""),
    completedAt: String(value.completedAt || ""),
    error: String(value.error || ""),
    steps: normalizedSteps.map((step) => {
      const saved = knownSteps.get(String(step?.id || "")) || {};
      return {
        id: String(step?.id || ""),
        toolId: String(step?.toolId || ""),
        status: normalizeAgentStepStatus(saved.status || step?.status || "queued"),
        resultSummary: String(saved.resultSummary || step?.resultSummary || ""),
      };
    }),
  };
}

function createAgentExecutionTrace(draft, status = "queued") {
  const normalized = normalizeAgentGoalDraft(draft);
  const now = new Date().toISOString();
  const traceStatus = ["queued", "running", "success", "error", "skipped", "waiting_confirmation"].includes(status) ? status : "queued";
  return {
    status: traceStatus,
    startedAt: traceStatus === "running" ? now : "",
    completedAt: ["success", "error", "skipped", "waiting_confirmation"].includes(traceStatus) ? now : "",
    error: "",
    steps: (normalized?.planSteps || []).map((step, index) => ({
      id: step.id,
      toolId: step.toolId,
      status: traceStatus === "running" && index === 0 ? "running" : "queued",
      resultSummary: "",
    })),
  };
}

function updateAgentExecutionTrace(trace, status, options = {}) {
  const normalized = normalizeAgentExecutionTrace(trace, options.planSteps || []);
  const nextStatus = ["queued", "running", "success", "error", "skipped", "waiting_confirmation"].includes(status) ? status : normalized.status;
  const now = new Date().toISOString();
  const confirmationIndex = findAgentConfirmationStepIndex(options.planSteps || []);
  return {
    ...normalized,
    status: nextStatus,
    startedAt: normalized.startedAt || (nextStatus === "running" ? now : ""),
    completedAt: ["success", "error", "skipped", "waiting_confirmation"].includes(nextStatus) ? now : normalized.completedAt,
    error: nextStatus === "error" ? String(options.error || normalized.error || "") : "",
    steps: normalized.steps.map((step, index) => {
      let stepStatus = step.status;
      if (nextStatus === "running") stepStatus = index === 0 ? "running" : "queued";
      if (nextStatus === "success") stepStatus = "success";
      if (nextStatus === "waiting_confirmation") {
        stepStatus = index < confirmationIndex ? "success" : index === confirmationIndex ? "waiting_confirmation" : "queued";
      }
      if (nextStatus === "error") {
        const firstUnfinishedIndex = normalized.steps.findIndex((item) => !["success", "skipped"].includes(item.status));
        stepStatus = index < firstUnfinishedIndex ? "success" : index === firstUnfinishedIndex ? "error" : "skipped";
      }
      if (nextStatus === "skipped") stepStatus = "skipped";
      return {
        ...step,
        status: stepStatus,
        resultSummary:
          stepStatus === "error"
            ? String(options.error || step.resultSummary || "")
            : stepStatus === "waiting_confirmation"
              ? String(options.confirmationSummary || step.resultSummary || "")
            : stepStatus === "success"
              ? String(options.successSummary || step.resultSummary || "")
              : step.resultSummary,
      };
    }),
  };
}

function findAgentConfirmationStepIndex(planSteps = []) {
  const steps = Array.isArray(planSteps) ? planSteps : [];
  const index = steps.findIndex((step) => {
    const tool = getAgentToolDefinition(step?.toolId);
    return Boolean(step?.requiresConfirmation || tool.requiresConfirmation);
  });
  return index >= 0 ? index : steps.length;
}

function shouldAgentWaitForConfirmation(draft) {
  const normalized = normalizeAgentGoalDraft(draft);
  if (!normalized) return false;
  return normalized.requiresConfirmation || findAgentConfirmationStepIndex(normalized.planSteps) < normalized.planSteps.length;
}

function completeAgentConfirmationTrace(trace, planSteps = [], summary = "") {
  const normalized = normalizeAgentExecutionTrace(trace, planSteps);
  if (normalized.status !== "waiting_confirmation") return normalized;
  return updateAgentExecutionTrace(normalized, "success", {
    planSteps,
    successSummary: summary || (getLanguage() === "en" ? "Confirmed and completed." : "已确认并完成。"),
  });
}

function completeCurrentAgentConfirmation(summary = "") {
  const draft = normalizeAgentGoalDraft(state.ui.agentGoalDraft);
  if (!draft || !state.ui.agentExecutionTrace) return false;
  const nextTrace = completeAgentConfirmationTrace(
    state.ui.agentExecutionTrace,
    draft.planSteps,
    summary || (getLanguage() === "en" ? "Confirmed and completed." : "已确认并完成。"),
  );
  if (nextTrace.status !== "success") return false;
  state.ui.agentExecutionTrace = nextTrace;
  state.ui.agentGoalDraft = normalizeAgentGoalDraft({ ...draft, executionTrace: nextTrace });
  state.ui.agentStatus = summary || (getLanguage() === "en" ? "Confirmed and completed." : "已确认并完成。");
  updateAgentPanel(getCurrentChapter());
  persist();
  return true;
}

function createAgentToolRegistry() {
  return {
    read_project_context: {
      id: "read_project_context",
      label: getLanguage() === "en" ? "Read Project Context" : "读取项目上下文",
      description: getLanguage() === "en" ? "Loads project materials, memory, and chapter list." : "读取项目资料、记忆与章节列表。",
      inputSchema: "project_id",
      outputSchema: "materials, memory, chapters",
      requiresConfirmation: false,
    },
    selected_inspirations: {
      id: "selected_inspirations",
      label: getLanguage() === "en" ? "Selected Ideas" : "已选灵感",
      description: getLanguage() === "en" ? "Collects selected inspiration cards into a structured brief." : "把已选灵感卡片整理成结构化输入。",
      inputSchema: "selectedInspirationIds[]",
      outputSchema: "combinedIdea",
      requiresConfirmation: false,
    },
    generate_project_materials_from_idea: {
      id: "generate_project_materials_from_idea",
      label: getLanguage() === "en" ? "Generate Project Materials" : "生成项目资料",
      description: getLanguage() === "en" ? "Turns ideas into project material drafts." : "把灵感发展成项目资料草稿。",
      inputSchema: "project_id, idea",
      outputSchema: "materials",
      requiresConfirmation: false,
    },
    save_project_material: {
      id: "save_project_material",
      label: getLanguage() === "en" ? "Save Project Material" : "保存项目资料",
      description: getLanguage() === "en" ? "Writes confirmed material drafts to project files." : "把确认后的资料草稿写入项目文件。",
      inputSchema: "workId, material, content",
      outputSchema: "saved material file",
      requiresConfirmation: true,
    },
    write_chapter: {
      id: "write_chapter",
      label: getLanguage() === "en" ? "Write Chapter" : "起草章节",
      description: getLanguage() === "en" ? "Generates a draft for the current chapter." : "为当前章节生成正文草稿。",
      inputSchema: "project_id, chapter_number, user_instruction",
      outputSchema: "content",
      requiresConfirmation: false,
    },
    ai_review_surface: {
      id: "ai_review_surface",
      label: getLanguage() === "en" ? "AI Review Surface" : "AI 对比视图",
      description: getLanguage() === "en" ? "Shows AI output before it can be applied." : "展示 AI 结果，等待用户决定是否应用。",
      inputSchema: "chapter_id, content",
      outputSchema: "review draft",
      requiresConfirmation: true,
    },
    summarize_chapter: {
      id: "summarize_chapter",
      label: getLanguage() === "en" ? "Summarize Chapter" : "总结章节",
      description: getLanguage() === "en" ? "Summarizes the current chapter for memory." : "把当前章节总结为项目记忆。",
      inputSchema: "project_id, chapter_number, content",
      outputSchema: "summary",
      requiresConfirmation: false,
    },
    update_memory: {
      id: "update_memory",
      label: getLanguage() === "en" ? "Update Memory" : "更新记忆",
      description: getLanguage() === "en" ? "Stores reusable chapter memory." : "保存可复用的章节记忆。",
      inputSchema: "workId, chapterId, summary",
      outputSchema: "memory",
      requiresConfirmation: false,
    },
    read_chapter: {
      id: "read_chapter",
      label: getLanguage() === "en" ? "Read Chapter" : "读取章节",
      description: getLanguage() === "en" ? "Loads current chapter text for analysis." : "读取当前章节正文用于分析。",
      inputSchema: "project_id, chapter_number",
      outputSchema: "chapter",
      requiresConfirmation: false,
    },
    consistency_check: {
      id: "consistency_check",
      label: getLanguage() === "en" ? "Consistency Check" : "一致性检查",
      description: getLanguage() === "en" ? "Checks contradictions and continuity risks." : "检查设定冲突与连续性风险。",
      inputSchema: "project_id, chapter_number, content",
      outputSchema: "report",
      requiresConfirmation: false,
    },
    generate_chapter_outline: {
      id: "generate_chapter_outline",
      label: getLanguage() === "en" ? "Generate Chapter Outline" : "生成章节小纲",
      description: getLanguage() === "en" ? "Creates an actionable outline for the current chapter." : "为当前章节生成可执行小纲。",
      inputSchema: "project_id, chapter_number, user_instruction",
      outputSchema: "outline",
      requiresConfirmation: false,
    },
    applyGeneratedOutline: {
      id: "applyGeneratedOutline",
      label: getLanguage() === "en" ? "Apply Generated Outline" : "写入生成小纲",
      description: getLanguage() === "en" ? "Writes the generated outline into the outline editor." : "把生成的小纲写入小纲编辑区。",
      inputSchema: "chapter_id, outline",
      outputSchema: "updated outline",
      requiresConfirmation: false,
    },
  };
}

function getAgentToolDefinition(toolId) {
  return createAgentToolRegistry()[toolId] ?? {
    id: String(toolId || ""),
    label: String(toolId || ""),
    description: getLanguage() === "en" ? "Unregistered tool." : "未注册工具。",
    inputSchema: "unknown",
    outputSchema: "unknown",
    requiresConfirmation: false,
  };
}

function getAgentStepStatusLabel(status) {
  const normalized = normalizeAgentStepStatus(status);
  if (getLanguage() === "en") {
    return {
      queued: "Queued",
      running: "Running",
      success: "Done",
      error: "Failed",
      skipped: "Skipped",
      waiting_confirmation: "Needs confirmation",
    }[normalized];
  }
  return {
    queued: "待执行",
    running: "执行中",
    success: "已完成",
    error: "失败",
    skipped: "已跳过",
    waiting_confirmation: "等待确认",
  }[normalized];
}

function getAgentTraceStatusLabel(status) {
  const normalized = String(status || "idle");
  if (getLanguage() === "en") {
    return {
      idle: "Not started",
      queued: "Queued",
      running: "Executing",
      success: "Completed",
      error: "Failed",
      skipped: "Skipped",
      waiting_confirmation: "Waiting for confirmation",
    }[normalized] || "Not started";
  }
  return {
    idle: "未开始",
    queued: "已排队",
    running: "执行中",
    success: "已完成",
    error: "失败",
    skipped: "已跳过",
    waiting_confirmation: "等待确认",
  }[normalized] || "未开始";
}

function parseAgentGoal(goalText) {
  const goal = String(goalText || "").trim();
  const normalized = goal.toLowerCase();
  const has = (patterns) => patterns.some((pattern) => normalized.includes(pattern) || goal.includes(pattern));
  let draft;
  if (has(["灵感", "项目资料", "资料", "人物", "世界观", "设定", "materials", "idea", "ideas"])) {
    draft = {
      action: "develop-selected-project-materials",
      taskLabel: getLanguage() === "en" ? "Develop project materials" : "发展项目资料",
      inputSource: getLanguage() === "en" ? "Selected ideas in the Inspiration panel" : "灵感面板中已选择的灵感",
      expectedOutput: getLanguage() === "en" ? "Project material draft preview" : "项目资料草稿预览",
      confidence: 0.82,
    };
  } else if (has(["冲突", "一致", "检查", "矛盾", "consistency", "conflict"])) {
    draft = {
      action: "check-consistency",
      taskLabel: getLanguage() === "en" ? "Check consistency" : "检查设定一致性",
      inputSource: getLanguage() === "en" ? "Current chapter and project context" : "当前章节与项目上下文",
      expectedOutput: getLanguage() === "en" ? "Consistency report" : "一致性检查报告",
      confidence: 0.78,
    };
  } else if (has(["总结", "记忆", "摘要", "summarize", "summary", "memory"])) {
    draft = {
      action: "summarize-chapter",
      taskLabel: getLanguage() === "en" ? "Summarize to memory" : "总结并更新记忆",
      inputSource: getLanguage() === "en" ? "Current chapter body" : "当前章节正文",
      expectedOutput: getLanguage() === "en" ? "Updated chapter memory" : "更新后的章节记忆",
      confidence: 0.78,
    };
  } else if (has(["写", "起草", "正文", "draft", "write"])) {
    draft = {
      action: "write-chapter",
      taskLabel: getLanguage() === "en" ? "Draft current chapter" : "起草当前章节",
      inputSource: getLanguage() === "en" ? "Current outline, notes, and project context" : "当前小纲、备注与项目上下文",
      expectedOutput: getLanguage() === "en" ? "AI draft in comparison view" : "进入对比视图的 AI 正文草稿",
      confidence: 0.76,
    };
  } else {
    draft = {
      action: "generate-outline",
      taskLabel: getLanguage() === "en" ? "Plan current chapter" : "规划当前章节",
      inputSource: getLanguage() === "en" ? "Project context and current chapter target" : "项目上下文与当前章节目标",
      expectedOutput: getLanguage() === "en" ? "Chapter outline" : "章节小纲",
      confidence: goal ? 0.58 : 0.4,
    };
  }
  const plannedDraft = {
    ...draft,
    planSteps: createAgentGoalPlan(draft.action),
    requiresConfirmation: draft.action === "develop-selected-project-materials" || draft.action === "write-chapter",
  };
  return normalizeAgentGoalDraft({
    ...plannedDraft,
    goal,
    userInstruction: goal || draft.taskLabel,
  });
}

function createAgentGoalPlan(action) {
  const commonContext = {
    id: "read-context",
    label: getLanguage() === "en" ? "Read context" : "读取上下文",
    detail: getLanguage() === "en" ? "Load current work, chapter target, project materials, and memory." : "读取当前作品、章节目标、项目资料与记忆。",
    toolId: "read_project_context",
    requiresConfirmation: false,
  };
  if (action === "develop-selected-project-materials") {
    return [
      {
        id: "collect-ideas",
        label: getLanguage() === "en" ? "Collect selected ideas" : "收集已选灵感",
        detail: getLanguage() === "en" ? "Merge selected idea cards into one structured brief." : "把已选择的灵感卡片整合成结构化输入。",
        toolId: "selected_inspirations",
        requiresConfirmation: false,
      },
      commonContext,
      {
        id: "generate-materials",
        label: getLanguage() === "en" ? "Draft materials" : "生成资料草稿",
        detail: getLanguage() === "en" ? "Run the project-material workflow and open a preview." : "运行项目资料 workflow 并打开草稿预览。",
        toolId: "generate_project_materials_from_idea",
        requiresConfirmation: false,
      },
      {
        id: "write-materials",
        label: getLanguage() === "en" ? "Wait for write confirmation" : "等待写入确认",
        detail: getLanguage() === "en" ? "Only write files after the preview is confirmed." : "只有确认预览后才写入资料文件。",
        toolId: "save_project_material",
        requiresConfirmation: true,
      },
    ];
  }
  if (action === "write-chapter") {
    return [
      commonContext,
      {
        id: "draft-body",
        label: getLanguage() === "en" ? "Draft chapter" : "起草正文",
        detail: getLanguage() === "en" ? "Generate a chapter draft from the goal, outline, notes, and context." : "根据目标、小纲、备注与上下文生成正文草稿。",
        toolId: "write_chapter",
        requiresConfirmation: false,
      },
      {
        id: "review-draft",
        label: getLanguage() === "en" ? "Open comparison" : "打开对比",
        detail: getLanguage() === "en" ? "Show the AI draft in comparison view before applying it." : "先在对比视图展示 AI 草稿，不直接覆盖正文。",
        toolId: "ai_review_surface",
        requiresConfirmation: true,
      },
    ];
  }
  if (action === "summarize-chapter") {
    return [
      commonContext,
      {
        id: "summarize-current",
        label: getLanguage() === "en" ? "Summarize chapter" : "总结章节",
        detail: getLanguage() === "en" ? "Summarize the current chapter into reusable memory." : "把当前章节总结成后续可复用的记忆。",
        toolId: "summarize_chapter",
        requiresConfirmation: false,
      },
      {
        id: "update-memory",
        label: getLanguage() === "en" ? "Update memory" : "更新记忆",
        detail: getLanguage() === "en" ? "Save the summary into the project memory store." : "把摘要保存到项目记忆中。",
        toolId: "update_memory",
        requiresConfirmation: false,
      },
    ];
  }
  if (action === "check-consistency") {
    return [
      commonContext,
      {
        id: "read-chapter",
        label: getLanguage() === "en" ? "Read chapter" : "读取章节",
        detail: getLanguage() === "en" ? "Load current chapter text for consistency analysis." : "读取当前章节正文用于一致性分析。",
        toolId: "read_chapter",
        requiresConfirmation: false,
      },
      {
        id: "generate-report",
        label: getLanguage() === "en" ? "Generate report" : "生成报告",
        detail: getLanguage() === "en" ? "Check contradictions, risks, and minimal fixes." : "检查冲突、风险和最小修改建议。",
        toolId: "consistency_check",
        requiresConfirmation: false,
      },
    ];
  }
  return [
    commonContext,
    {
      id: "plan-chapter",
      label: getLanguage() === "en" ? "Plan chapter" : "规划章节",
      detail: getLanguage() === "en" ? "Generate an actionable outline for the current chapter." : "为当前章节生成可执行小纲。",
      toolId: "generate_chapter_outline",
      requiresConfirmation: false,
    },
    {
      id: "update-outline",
      label: getLanguage() === "en" ? "Update outline panel" : "更新小纲面板",
      detail: getLanguage() === "en" ? "Write the generated outline into the chapter outline editor." : "把生成的小纲写入章节小纲编辑区。",
      toolId: "applyGeneratedOutline",
      requiresConfirmation: false,
    },
  ];
}

function renderAgentGoalDraft(draft) {
  if (!draft) {
    return `<small>${getLanguage() === "en" ? "Enter a goal and parse it before execution." : "输入目标后先解析，确认系统会走哪条流程。"}</small>`;
  }
  const trace = normalizeAgentExecutionTrace(draft.executionTrace || state.ui.agentExecutionTrace, draft.planSteps);
  const traceSteps = new Map(trace.steps.map((step) => [step.id, step]));
  return `
    <dl>
      <div><dt>${getLanguage() === "en" ? "Workflow" : "流程"}</dt><dd>${escapeHtml(draft.taskLabel)}</dd></div>
      <div><dt>${getLanguage() === "en" ? "Input" : "输入"}</dt><dd>${escapeHtml(draft.inputSource)}</dd></div>
      <div><dt>${getLanguage() === "en" ? "Output" : "产物"}</dt><dd>${escapeHtml(draft.expectedOutput)}</dd></div>
      <div><dt>${getLanguage() === "en" ? "Trace" : "轨迹"}</dt><dd>${escapeHtml(getAgentTraceStatusLabel(trace.status))}${trace.error ? ` · ${escapeHtml(trace.error)}` : ""}</dd></div>
    </dl>
    <ol class="agent-plan-list">
      ${draft.planSteps
        .map(
          (step, index) => {
            const tool = getAgentToolDefinition(step.toolId);
            const needsConfirmation = step.requiresConfirmation || tool.requiresConfirmation;
            const stepTrace = traceSteps.get(step.id) || { status: "queued", resultSummary: "" };
            const stepStatus = normalizeAgentStepStatus(stepTrace.status);
            return `
              <li class="agent-plan-step is-${escapeAttribute(stepStatus)}">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>${escapeHtml(step.label)} <b>${escapeHtml(getAgentStepStatusLabel(stepStatus))}</b></strong>
                  <small>${escapeHtml(step.detail)}</small>
                  <em>${escapeHtml(tool.label)} · ${escapeHtml(tool.inputSchema)} → ${escapeHtml(tool.outputSchema)}${needsConfirmation ? ` · ${getLanguage() === "en" ? "confirmation" : "需确认"}` : ""}</em>
                  ${stepTrace.resultSummary ? `<small>${escapeHtml(stepTrace.resultSummary)}</small>` : ""}
                </div>
              </li>
            `;
          },
        )
        .join("")}
    </ol>
    <small>${getLanguage() === "en" ? `Confidence ${Math.round(draft.confidence * 100)}%` : `识别置信度 ${Math.round(draft.confidence * 100)}%`}</small>
  `;
}

async function executeParsedAgentGoal(draft) {
  const normalized = normalizeAgentGoalDraft(draft);
  if (!normalized) return;
  const runningTrace = createAgentExecutionTrace(normalized, "running");
  state.ui.agentExecutionTrace = runningTrace;
  state.ui.agentGoalDraft = normalizeAgentGoalDraft({ ...normalized, executionTrace: runningTrace });
  updateAgentPanel(getCurrentChapter());
  persist();
  if (normalized.action === "develop-selected-project-materials") {
    const work = getCurrentWork();
    const selectedItems = getSelectedInspirationsForWork(work?.id);
    if (!work || selectedItems.length === 0) {
      const errorMessage = getLanguage() === "en"
        ? "Select one or more ideas in the Inspiration panel before running this goal."
        : "请先在灵感面板选择一条或多条灵感，再执行这个目标。";
      const errorTrace = updateAgentExecutionTrace(runningTrace, "error", {
        planSteps: normalized.planSteps,
        error: errorMessage,
      });
      state.ui.agentExecutionTrace = errorTrace;
      state.ui.agentGoalDraft = normalizeAgentGoalDraft({ ...normalized, executionTrace: errorTrace });
      openInfoModal(
        t("ai.title"),
        errorMessage,
      );
      updateAgentPanel(getCurrentChapter());
      persist();
      return;
    }
    const ok = await generateProjectMaterialsFromSelectedInspirations(work, normalized.userInstruction);
    const nextTrace = updateAgentExecutionTrace(runningTrace, ok ? "waiting_confirmation" : "error", {
      planSteps: normalized.planSteps,
      successSummary: getLanguage() === "en" ? "Completed." : "已完成。",
      confirmationSummary: getLanguage() === "en" ? "Preview opened. Confirm before writing files." : "已打开预览，确认后才会写入文件。",
      error: getLanguage() === "en" ? "Project-material workflow failed." : "项目资料流程失败。",
    });
    state.ui.agentExecutionTrace = nextTrace;
    state.ui.agentGoalDraft = normalizeAgentGoalDraft({ ...normalized, executionTrace: nextTrace });
    updateAgentPanel(getCurrentChapter());
    persist();
    return;
  }
  const ok = await handleAgentAction(normalized.action, { userInstruction: normalized.userInstruction });
  const successStatus = ok && shouldAgentWaitForConfirmation(normalized) ? "waiting_confirmation" : "success";
  const nextTrace = updateAgentExecutionTrace(runningTrace, ok ? successStatus : "error", {
    planSteps: normalized.planSteps,
    successSummary: getLanguage() === "en" ? "Workflow completed." : "流程已完成。",
    confirmationSummary: getLanguage() === "en" ? "Review the generated result before applying it." : "请先检查生成结果，再确认是否应用。",
    error: state.ui.agentStatus || (getLanguage() === "en" ? "Workflow failed." : "流程失败。"),
  });
  state.ui.agentExecutionTrace = nextTrace;
  state.ui.agentGoalDraft = normalizeAgentGoalDraft({ ...normalized, executionTrace: nextTrace });
  updateAgentPanel(getCurrentChapter());
  persist();
}

async function handleAgentAction(action, options = {}) {
  const chapter = getCurrentChapter();
  const work = getCurrentWork();
  if (!chapter || !work) return false;
  if (!desktopApi) {
    openInfoModal(t("ai.title"), t("ai.desktopRequired"));
    return false;
  }
  state.ui.agentActionPending = action;
  state.ui.agentStatus = "";
  updateWorkspace();
  try {
    if (action === "generate-outline") {
      const result = await requireAgentResult(
        desktopApi.generateChapterOutline?.(createNovelAgentPayload(chapter, {
          user_instruction: options.userInstruction || (getLanguage() === "en" ? "Generate a chapter outline for the current chapter." : "为当前章节生成章节小纲。"),
        })),
      );
      applyGeneratedOutline(chapter, result.outline);
      state.ui.agentStatus = t("ai.outlineUpdated");
    }
    if (action === "write-chapter") {
      const payload = createNovelAgentPayload(chapter, {
        user_instruction: options.userInstruction || chapter.outline || chapter.notes || (getLanguage() === "en" ? "Write the current chapter." : "写当前章节正文。"),
        cost_guard_confirmed: options.costGuardConfirmed === true,
      });
      const result = await requireAgentResult(
        desktopApi.writeChapterWithNovelAgent?.(payload),
      );
      state.ui.aiDraftsByChapter[chapter.id] = {
        content: String(result.content || ""),
        provider: "novel-agent",
        generatedAt: new Date().toISOString(),
        editorialSuggestionsFile: String(result.editorial_suggestions_file || ""),
        editorialSuggestionsStatus: String(result.generation_metadata?.editorial_suggestions_status || ""),
        editorialSuggestionsContent: "",
        editorialSuggestionsError: "",
      };
      state.ui.editorialSuggestionsOpen = false;
      state.ui.editorialSuggestionsError = "";
      state.ui.aiReviewMode = true;
      state.ui.agentStatus = result.needs_completion_review
        ? (getLanguage() === "en"
            ? `Draft generated, but the ending needs review: ${result.warning || "completion audit did not pass."}`
            : `草稿已生成，但结尾需要检查：${result.warning || "完成度审核未通过。"}`)
        : t("ai.chapterDraftReady");
    }
    if (action === "summarize-chapter") {
      const result = await requireAgentResult(
        desktopApi.summarizeCurrentChapter?.(createNovelAgentPayload(chapter, { content: chapter.content })),
      );
      state.ui.agentStatus = t("ai.summaryUpdated");
    }
    if (action === "check-consistency") {
      const result = await requireAgentResult(
        desktopApi.checkChapterConsistency?.(createNovelAgentPayload(chapter, { content: chapter.content })),
      );
      state.ui.agentStatus = t("ai.consistencyReady");
    }
    persist();
    return true;
  } catch (error) {
    console.error("Agent action failed", error);
    if (error?.result?.cost_guard_blocked === true && action === "write-chapter") {
      state.ui.agentStatus = formatCostGuardBlockedMessage(error.result, Boolean(state.ui.showCostDetails));
      openCostGuardConfirmationModal({
        result: error.result,
        action,
        options,
      });
      return false;
    }
    state.ui.agentStatus = formatAgentFailureMessage(error);
    openInfoModal(t("ai.title"), state.ui.agentStatus);
    return false;
  } finally {
    state.ui.agentActionPending = "";
    updateWorkspace();
  }
}

async function requireAgentResult(promise) {
  if (!promise) throw new Error(t("ai.desktopRequired"));
  const result = await promise;
  if (!result?.ok) {
    const message = result?.cost_guard_blocked
      ? formatCostGuardBlockedMessage(result, Boolean(state.ui.showCostDetails))
      : (result?.error || (getLanguage() === "en" ? "AI action failed." : "AI 操作失败。"));
    const error = new Error(message);
    error.result = result;
    throw error;
  }
  return result;
}

function formatAgentFailureMessage(error) {
  const result = error?.result || {};
  const rawMessage = String(error?.message || result.error || "").trim();
  const failedStep = String(result.failed_step || "").trim();
  const failedPrompt = String(result.failed_prompt_id || "").trim();
  const requestedMode = String(result.generation_mode || "").trim();
  const resolvedPath = String(result.writing_path || "").trim();
  const metadataFile = String(result.generation_metadata_file || "").trim();
  const completedCalls = Array.isArray(result.failed_llm_events) ? result.failed_llm_events.length : 0;
  const isNetworkFailure = /fetch failed|network request failed|network error|econn|enotfound|etimedout|socket|timeout/i.test(rawMessage);
  if (isNetworkFailure) {
    const parts = [
      getLanguage() === "en"
        ? "The AI provider request failed mid-generation. This is usually a network interruption, provider timeout, quota/rate-limit issue, or Base URL connectivity problem."
        : "AI 服务请求在生成中途失败。常见原因是网络中断、服务商超时、额度/限流，或 Base URL 连接异常。",
    ];
    if (failedStep) parts.push(`${getLanguage() === "en" ? "Failed step" : "失败步骤"}：${failedStep}`);
    if (failedPrompt) parts.push(`Prompt：${failedPrompt}`);
    if (requestedMode) parts.push(`${getLanguage() === "en" ? "Requested mode" : "请求模式"}：${requestedMode}`);
    if (resolvedPath) parts.push(`${getLanguage() === "en" ? "Resolved path" : "实际路径"}：${resolvedPath}`);
    parts.push(`${getLanguage() === "en" ? "Completed requests before failure" : "失败前已完成请求"}：${completedCalls}`);
    if (metadataFile) parts.push(`${getLanguage() === "en" ? "Debug report" : "调试报告"}：${metadataFile}`);
    if (state.ui.showCostDetails && rawMessage) parts.push(`${getLanguage() === "en" ? "Raw error" : "原始错误"}：${rawMessage}`);
    return parts.join("\n");
  }
  return rawMessage || (getLanguage() === "en" ? "AI action failed." : "AI 操作失败。");
}

function getCurrentAgentGenerationMode() {
  return agentGenerationModes.find((mode) => mode.id === state.ui.agentGenerationMode) ||
    agentGenerationModes.find((mode) => mode.id === defaultAgentGenerationMode) ||
    agentGenerationModes[0];
}

function createNovelAgentDefaultOptions() {
  const mode = getCurrentAgentGenerationMode();
  return {
    generation_mode: mode.generation_mode,
    enable_context_pack_for_summary: true,
    enable_context_pack_for_audit: false,
    enable_model_routing: false,
    show_cost_details: Boolean(state.ui.showCostDetails),
  };
}

function formatCostGuardBlockedMessage(result, showDetails = false) {
  if (!showDetails) return getLanguage() === "en"
    ? "This generation is relatively long and may use more resources. Try lowering the target length or switching to Fast Draft."
    : costGuardFriendlyBlockedMessage;
  const report = result?.budget_report || {};
  const details = [
    getLanguage() === "en" ? "Generation budget details:" : "生成预算详情：",
    `${getLanguage() === "en" ? "Estimated calls" : "预计调用次数"}：${formatPlainNumber(report.estimated_llm_calls)}`,
    `${getLanguage() === "en" ? "Estimated input" : "预计输入"}：${formatNumberRange(report.estimated_input_tokens_range)} tokens`,
    `${getLanguage() === "en" ? "Estimated output" : "预计输出"}：${formatNumberRange(report.estimated_output_tokens_range)} tokens`,
    `${getLanguage() === "en" ? "Estimated cost" : "预计费用"}：${formatMoneyRange(report.estimated_cost_usd_range)}`,
  ];
  const enabled = Array.isArray(report.enabled_steps) ? report.enabled_steps : [];
  const disabled = Array.isArray(report.disabled_steps) ? report.disabled_steps : [];
  const reasons = Array.isArray(result?.blocked_reasons) && result.blocked_reasons.length
    ? result.blocked_reasons
    : (Array.isArray(report.blocked_reasons) ? report.blocked_reasons : []);
  if (enabled.length) details.push(`${getLanguage() === "en" ? "Enabled steps" : "启用步骤"}：${enabled.map(formatCostGuardStepLabel).join("、")}`);
  if (disabled.length) details.push(`${getLanguage() === "en" ? "Skipped steps" : "跳过步骤"}：${disabled.map(formatCostGuardStepLabel).join("、")}`);
  if (reasons.length) {
    details.push(getLanguage() === "en" ? "Blocked because:" : "阻止原因：");
    details.push(...reasons.map((reason) => `- ${formatCostGuardBlockedReason(reason)}`));
  }
  return `${getLanguage() === "en" ? "This generation is relatively long and may use more resources. Try lowering the target length or switching to Fast Draft." : costGuardFriendlyBlockedMessage}\n\n${details.join("\n")}`;
}

function formatCostGuardBlockedDetails(result) {
  return formatCostGuardBlockedMessage(result, true);
}

function formatPlainNumber(value) {
  const number = Number(value) || 0;
  return number.toLocaleString(getLanguage() === "en" ? "en-US" : "zh-CN");
}

function formatNumberRange(range = {}) {
  const low = formatPlainNumber(range.low);
  const high = formatPlainNumber(range.high);
  return low === high ? low : `${low} - ${high}`;
}

function formatMoneyRange(range = {}) {
  const low = Number(range.low) || 0;
  const high = Number(range.high) || 0;
  const text = low === high ? low.toFixed(2) : `${low.toFixed(2)} - ${high.toFixed(2)}`;
  return `$${text}`;
}

function formatCostGuardStepLabel(step) {
  const labels = {
    planner: getLanguage() === "en" ? "Planning" : "规划",
    scene_outline: getLanguage() === "en" ? "Scene outline" : "场景大纲",
    scene_writing: getLanguage() === "en" ? "Scene writing" : "场景正文",
    completion_audit: getLanguage() === "en" ? "Completion audit" : "完成度检查",
    expand_compress: getLanguage() === "en" ? "Length adjustment" : "扩写/压缩",
    quality_review: getLanguage() === "en" ? "Quality review" : "质量审查",
    transition_review: getLanguage() === "en" ? "Transition review" : "衔接审查",
    editorial_suggestions: getLanguage() === "en" ? "Editorial suggestions" : "审稿建议",
    save: getLanguage() === "en" ? "Save chapter" : "保存章节",
    memory_summary: getLanguage() === "en" ? "Memory summary" : "记忆总结",
  };
  return labels[String(step || "")] || String(step || "");
}

function formatCostGuardBlockedReason(reason) {
  const text = String(reason || "");
  const number = (pattern) => {
    const match = text.match(pattern);
    return match ? formatPlainNumber(match[1]) : "";
  };
  if (/test_run_mode blocks target_word_count/.test(text)) {
    return getLanguage() === "en"
      ? `The target length is above the current test-run limit. Target ${number(/target_word_count (\d+)/)}, limit ${number(/max is (\d+)/)}.`
      : `当前目标字数超过测试运行上限。目标 ${number(/target_word_count (\d+)/)}，上限 ${number(/max is (\d+)/)}。`;
  }
  if (/estimated_llm_calls/.test(text)) {
    return getLanguage() === "en"
      ? `Estimated model calls are too high. Estimated ${number(/estimated_llm_calls (\d+)/)}, limit ${number(/max (\d+)/)}.`
      : `预计模型调用次数过高。预计 ${number(/estimated_llm_calls (\d+)/)} 次，上限 ${number(/max (\d+)/)} 次。`;
  }
  if (/estimated input tokens high/.test(text)) {
    return getLanguage() === "en"
      ? `Estimated input is too large. Estimated ${number(/high (\d+)/)} tokens, limit ${number(/max (\d+)/)}.`
      : `预计输入内容过长。预计 ${number(/high (\d+)/)} tokens，上限 ${number(/max (\d+)/)}。`;
  }
  if (/estimated output tokens high/.test(text)) {
    return getLanguage() === "en"
      ? `Estimated output is too large. Estimated ${number(/high (\d+)/)} tokens, limit ${number(/max (\d+)/)}.`
      : `预计输出内容过长。预计 ${number(/high (\d+)/)} tokens，上限 ${number(/max (\d+)/)}。`;
  }
  if (/estimated cost high/.test(text)) {
    const values = text.match(/\$(\d+(?:\.\d+)?)/g) || [];
    return getLanguage() === "en"
      ? `Estimated cost is above the configured limit. Estimated ${values[0] || "--"}, limit ${values[1] || "--"}.`
      : `预计费用超过后台保护上限。预计 ${values[0] || "--"}，上限 ${values[1] || "--"}。`;
  }
  if (/estimated single prompt input/.test(text)) {
    return getLanguage() === "en"
      ? `One prompt is estimated to be too large. Estimated ${number(/input (\d+)/)} tokens, limit ${number(/max (\d+)/)}.`
      : `单次提示词预计过长。预计 ${number(/input (\d+)/)} tokens，上限 ${number(/max (\d+)/)}。`;
  }
  return getLanguage() === "en"
    ? "The estimated generation budget exceeded the configured safety limit."
    : "本次生成预算超过后台保护上限。";
}

function createNovelAgentPayload(chapter, extra = {}) {
  const work = getCurrentWork();
  return {
    project_id: work?.id || "",
    chapter_number: getCurrentChapterNumber(chapter),
    title: chapter?.title || "",
    content: chapter?.content || "",
    target_word_count: Number(chapter?.wordGoal) || 0,
    ...createNovelAgentDefaultOptions(),
    ...extra,
  };
}

function getCurrentChapterNumber(chapter = getCurrentChapter()) {
  const work = getCurrentWork();
  if (!work || !chapter) return 1;
  const index = getWorkChapters(work.id).findIndex((item) => item.id === chapter.id);
  return index >= 0 ? index + 1 : 1;
}

function applyGeneratedOutline(chapter, outline) {
  const nextOutline = String(outline || "").trim();
  if (!chapter || !nextOutline) return;
  openOutlinePanel();
  handleOutlineChange(nextOutline, "agent");
}

async function runWritingAgentForChapter(chapter) {
  const payload = createWritingAgentPayload(chapter);
  if (desktopApi?.runWritingAgent) {
    const result = await desktopApi.runWritingAgent(payload);
    if (result?.content) {
      return {
        content: String(result.content),
        provider: String(result.provider || "desktop-mock"),
        generatedAt: String(result.generatedAt || new Date().toISOString()),
      };
    }
  }
  return {
    content: createMockAiDraft(chapter, getLanguage()),
    provider: "browser-mock",
    generatedAt: new Date().toISOString(),
  };
}

async function copyTextToClipboard(text) {
  const value = String(text ?? "");
  if (!value) return;
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch (_error) {
      // Use the fallback below when the embedded browser denies clipboard access.
    }
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function createWritingAgentPayload(chapter) {
  const work = getCurrentWork();
  return {
    language: getLanguage(),
    work: {
      id: work?.id ?? "",
      title: work?.title ?? "",
    },
    chapter: {
      id: chapter?.id ?? "",
      title: chapter?.title ?? "",
      content: chapter?.content ?? "",
      outline: chapter?.outline ?? "",
      notes: chapter?.notes ?? "",
    },
  };
}

function applyAiDraftToCurrentChapter(chapter, aiDraft) {
  const work = getCurrentWork();
  if (!chapter || !work || !aiDraft) return;
  const previousContent = chapter.content || "";
  if (previousContent === aiDraft) return;

  if (!chapter.versions[0] || chapter.versions[0].content !== previousContent) {
    chapter.versions.unshift(
      createAiPreApplyVersion(previousContent, getLanguage(), uid("version"), `${getLanguage() === "en" ? "Today" : "今天"} ${timeNow()}`),
    );
    chapter.versions = chapter.versions.slice(0, 20);
  }

  if (refs.documentEditor) {
    pushUndoSnapshot(chapter, refs.documentEditor.value, refs.documentEditor.selectionStart, refs.documentEditor.selectionEnd);
    refs.documentEditor.value = aiDraft;
    refs.documentEditor.selectionStart = aiDraft.length;
    refs.documentEditor.selectionEnd = aiDraft.length;
  }

  const updatedAt = new Date().toISOString();
  chapter.content = aiDraft;
  chapter.wordCount = countWords(aiDraft);
  chapter.updatedAt = updatedAt;
  chapter.dirty = chapter.content !== chapter.savedContent;
  chapter.saveStatus = state.ui.autosaveEnabled ? "保存中" : "未保存";
  chapter.saveTime = "刚刚修改";
  work.updatedAt = updatedAt;
  work.lastOpenedChapterId = chapter.id;
  state.account.syncStatus = "本地有未保存修改";
  state.ui.selectionStart = aiDraft.length;
  state.ui.selectionEnd = aiDraft.length;
  updateTopBar();
  updateWorkspace();
  persist();
  queueAutosave();
}

function createAiPreApplyVersion(content, language = "zh", id = "version-ai-before", timeLabel = "") {
  return {
    id,
    label: language === "en" ? "Before AI replacement" : "AI 覆盖前版本",
    time: timeLabel || (language === "en" ? "Before replacement" : "覆盖前"),
    content: String(content ?? ""),
  };
}

function createMockAiDraft(chapter, language = "zh") {
  const title = String(chapter?.title || "").trim();
  const content = String(chapter?.content || "").trim();
  const outline = String(chapter?.outline || "").trim();
  const notes = String(chapter?.notes || "").trim();
  const source = content || outline || notes;

  if (language === "en") {
    if (!source) {
      return "Mock AI version\n\nAdd body text, outline notes, or chapter notes first. A real AI provider will use that context in a later phase.";
    }
    return [
      `Mock AI version${title ? ` for ${title}` : ""}`,
      "",
      content || "No body text yet.",
      "",
      "Revision direction:",
      outline ? `- Follow the outline: ${outline}` : "- Preserve the current chapter direction.",
      notes ? `- Keep the chapter note in mind: ${notes}` : "- Tighten pacing and keep the scene focused.",
    ].join("\n");
  }

  if (!source) {
    return "模拟 AI 新版\n\n请先补充本章正文、大纲或备注。后续接入真实 AI 后，会基于这些上下文生成新版。";
  }
  return [
    `模拟 AI 新版${title ? `：${title}` : ""}`,
    "",
    content || "当前章节还没有正文。",
    "",
    "改写方向：",
    outline ? `- 参考本章大纲：${outline}` : "- 保留当前章节走向。",
    notes ? `- 结合章节备注：${notes}` : "- 收紧节奏，让场景推进更明确。",
  ].join("\n");
}

function syncOutlineStateWithCurrentChapter() {
  const chapter = getCurrentChapter();
  if (!chapter) {
    state.currentChapterOutline = "";
    state.outlineDirty = false;
    state.outlineSaveStatus = "已保存";
    state.outlineLastSavedAt = null;
    return;
  }
  state.currentChapterOutline = chapter.outline;
  state.outlineDirty = chapter.outline !== chapter.savedOutline;
  state.outlineSaveStatus = state.outlineDirty ? (state.ui.autosaveEnabled ? "保存中" : "未保存") : "已保存";
  state.outlineLastSavedAt = state.outlineDirty ? state.outlineLastSavedAt : normalizeIsoDate(chapter.updatedAt);
}

function syncOutlineEditors(source = null) {
  const value = state.currentChapterOutline;
  if (source !== "sidebar" && refs.chapterOutlineInput.value !== value) refs.chapterOutlineInput.value = value;
  if (source !== "panel" && refs.outlinePanelEditor.value !== value) refs.outlinePanelEditor.value = value;
}

function getOutlineStatusText() {
  if (!getCurrentChapter()) return t("status.noChapter");
  if (state.outlineDirty) return `${translateSaveStatus(state.outlineSaveStatus)} · ${t("status.justChanged")}`;
  const savedAt = formatOutlineSavedAt(state.outlineLastSavedAt);
  return savedAt ? `${t("status.saved")} · ${savedAt}` : t("status.saved");
}

function updateWordGoalPanel(chapter) {
  if (
    !refs.wordGoalInput ||
    !refs.wordGoalProgress ||
    !refs.wordGoalProgressBar ||
    !refs.wordGoalBalance ||
    !refs.workWordTotal ||
    !refs.workGoalTotal
  ) {
    return;
  }
  if (!chapter) {
    refs.wordGoalProgress.textContent = t("workspace.selectChapter");
    refs.wordGoalProgressBar.style.width = "0%";
    refs.wordGoalBalance.textContent = "--";
    refs.workWordTotal.textContent = "--";
    refs.workGoalTotal.textContent = "";
    return;
  }

  const stats = getWordGoalStats(chapter);
  refs.wordGoalProgress.textContent = t("workspace.wordGoalProgress", { count: stats.chapterWords, goal: stats.chapterGoal });
  refs.wordGoalProgressBar.style.width = `${stats.percent}%`;
  refs.wordGoalBalance.textContent = getWordGoalBalanceText(stats);
  refs.workWordTotal.textContent = t("library.wordCount", { count: stats.workWords });
  refs.workGoalTotal.textContent = t("workspace.workGoalTotal", { count: stats.workGoal });
}

function updateFocusTimerPanel() {
  if (refs.focusTimerValue) refs.focusTimerValue.textContent = formatDuration(getFocusSeconds());
  if (refs.focusTimerCompactButton) {
    const running = Boolean(state.ui.focusStartedAt);
    const title = running
      ? (getLanguage() === "en" ? "Click to pause. Hold to reset." : "点击暂停，长按重置")
      : (getLanguage() === "en" ? "Place the cursor in the editor to start. Hold to reset." : "将光标放入编辑区开始计时，长按重置");
    refs.focusTimerCompactButton.classList.toggle("is-running", running);
    refs.focusTimerCompactButton.title = title;
    refs.focusTimerCompactButton.setAttribute("aria-label", title);
  }
}

function getWordGoalStats(chapter) {
  const work = getWork(chapter.workId);
  const chapters = work ? getWorkChapters(work.id) : [chapter];
  const chapterWords = countWords(chapter.content);
  const chapterGoal = Math.max(0, Number(chapter.wordGoal) || 0);
  const workWords = chapters.reduce((sum, item) => sum + countWords(item.content), 0);
  const workGoal = chapters.reduce((sum, item) => sum + Math.max(0, Number(item.wordGoal) || 0), 0);
  const percent = chapterGoal > 0 ? Math.min(100, Math.round((chapterWords / chapterGoal) * 100)) : 0;
  return {
    chapterWords,
    chapterGoal,
    workWords,
    workGoal,
    remaining: Math.max(0, chapterGoal - chapterWords),
    over: Math.max(0, chapterWords - chapterGoal),
    percent,
  };
}

function getWordGoalBalanceText(stats) {
  if (stats.chapterGoal <= 0) return t("workspace.wordGoalUnset");
  if (stats.remaining > 0) return t("workspace.wordGoalRemaining", { count: stats.remaining });
  if (stats.over > 0) return t("workspace.wordGoalOver", { count: stats.over });
  return t("workspace.wordGoalReached");
}

function getSaveStatusText(chapter) {
  if (!chapter) return t("status.noChapter");
  if (chapter.dirty && state.outlineDirty) return t("status.bodyOutlinePending");
  if (state.outlineDirty) return t("status.outlinePending", { status: state.ui.autosaveEnabled ? t("status.saving") : t("status.unsaved") });
  if (chapter.saveStatus === "保存失败") return `${t("status.failed")} · ${translateSaveTime(chapter.saveTime)}`;
  if (state.account.syncStatus === "本地保存失败") return t("status.syncFailed");
  if (librarySyncPending) return t("status.syncing");
  return `${translateSaveStatus(chapter.saveStatus)} · ${translateSaveTime(chapter.saveTime)}`;
}

function getSaveStatusTone(chapter) {
  if (!chapter) return "unsaved";
  if (chapter.saveStatus === "保存失败" || state.account.syncStatus === "本地保存失败") return "error";
  if (chapter.dirty || state.outlineDirty || librarySyncPending) return state.ui.autosaveEnabled ? "saving" : "unsaved";
  return "saved";
}

function translateSaveStatus(value) {
  if (value === "已保存") return t("status.saved");
  if (value === "保存中") return t("status.saving");
  if (value === "未保存") return t("status.unsaved");
  if (value === "保存失败") return t("status.failed");
  return value;
}

function translateSaveTime(value) {
  if (value === "刚刚") return getLanguage() === "en" ? "Just now" : value;
  if (value === "刚刚修改") return t("status.justChanged");
  if (value === "回退到上次保存") return t("status.reverted");
  return value;
}

function translateAccountStatus(value) {
  if (value === "本地写作中") return t("status.local");
  if (value === "同步等待中") return t("status.syncing");
  if (value === "已连接云端，同步正常") return t("status.synced");
  if (value === "本地有未保存修改") return t("status.syncing");
  if (value === "本地已保存") return t("status.synced");
  if (value === "本地保存失败") return t("status.syncFailed");
  return value;
}

function refreshSaveIndicators() {
  if (!refs.saveStatusPill) return;
  updateTopBar();
  updateWorkspace();
  updateSettingsPanel();
}

function formatOutlineSavedAt(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function hasUnsavedChanges() {
  const chapter = getCurrentChapter();
  return Boolean(chapter?.dirty || state.outlineDirty);
}

function openOutlinePanel({ focus = false } = {}) {
  if (!getCurrentChapter()) return;
  state.ui.leftSidebarCollapsed = false;
  state.ui.sidebarSection = "outline";
  state.outlinePanelOpen = true;
  state.ui.focusTarget = focus ? "outline" : state.ui.focusTarget;
  updateSidebar();
  updateWorkspace();
  persist();
  if (focus) {
    requestAnimationFrame(() => refs.outlinePanelEditor.focus());
  }
}

async function closeOutlinePanel() {
  if (state.outlineDirty) await saveCurrentOutline();
  state.outlinePanelOpen = false;
  state.ui.focusTarget = "document";
  updateWorkspace();
  persist();
  requestAnimationFrame(() => refs.documentEditor.focus());
}

function syncOutlinePanelLayout() {
  if (!refs.editorMain) return;
  const height = getOutlinePanelHeightPx();
  const containerHeight = refs.editorMain?.clientHeight ?? 0;
  const ratio = containerHeight ? Math.round((height / containerHeight) * 100) : 20;
  refs.editorMain.style.setProperty("--outline-panel-height", `${height}px`);
  refs.outlinePanelSizeIndicator.textContent = `${ratio}%`;
}

function getOutlinePanelHeightPx() {
  const containerHeight = refs.editorMain?.clientHeight ?? 0;
  if (!containerHeight) return 160;
  const minHeight = 120;
  const maxHeight = Math.max(minHeight, containerHeight * 0.6);
  const preferred = containerHeight * clampOutlinePanelRatio(state.outlinePanelHeight);
  return Math.round(Math.max(minHeight, Math.min(maxHeight, preferred)));
}

function beginOutlineResize(event) {
  if (!state.outlinePanelOpen || !refs.editorMain) return;
  event.preventDefault();
  const panelHeight = getOutlinePanelHeightPx();
  outlineResizeState = {
    startY: event.clientY,
    startHeight: panelHeight,
    containerHeight: refs.editorMain.clientHeight,
  };
  document.body.classList.add("is-resizing-outline");
  refs.editorMain.classList.add("outline-resizing");
}

function handleOutlineResizeMove(event) {
  if (!outlineResizeState || !refs.editorMain) return;
  const deltaY = outlineResizeState.startY - event.clientY;
  const nextHeight = outlineResizeState.startHeight + deltaY;
  const minHeight = 120;
  const maxHeight = Math.max(minHeight, outlineResizeState.containerHeight * 0.6);
  const boundedHeight = Math.max(minHeight, Math.min(maxHeight, nextHeight));
  state.outlinePanelHeight = clampOutlinePanelRatio(boundedHeight / Math.max(outlineResizeState.containerHeight, 1));
  syncOutlinePanelLayout();
}

function endOutlineResize() {
  if (!outlineResizeState) return;
  outlineResizeState = null;
  document.body.classList.remove("is-resizing-outline");
  refs.editorMain.classList.remove("outline-resizing");
  persist();
}

function clampOutlinePanelRatio(value) {
  if (!Number.isFinite(value)) return 0.2;
  return Math.min(0.6, Math.max(0.05, value));
}

function beginSidebarResize(event, side) {
  if (side === "left" && state.ui.leftSidebarCollapsed) return;
  if (side === "right" && state.ui.rightSidebarCollapsed) return;
  event.preventDefault();
  sidebarResizeState = {
    side,
    startX: event.clientX,
    startWidth: side === "left" ? state.ui.leftSidebarWidth : state.ui.rightSidebarWidth,
  };
  document.body.classList.add("is-resizing-sidebar");
  refs.editorPage.classList.add("sidebar-resizing");
}

function handleSidebarResizeMove(event) {
  if (!sidebarResizeState) return;
  const deltaX = event.clientX - sidebarResizeState.startX;
  const nextWidth = sidebarResizeState.side === "left"
    ? sidebarResizeState.startWidth + deltaX
    : sidebarResizeState.startWidth - deltaX;
  sidebarResizeState.nextWidth = clampSidebarWidth(nextWidth);
  if (sidebarResizeFrame) return;
  sidebarResizeFrame = requestAnimationFrame(() => {
    sidebarResizeFrame = null;
    if (!sidebarResizeState) return;
    if (sidebarResizeState.side === "left") {
      state.ui.leftSidebarWidth = sidebarResizeState.nextWidth;
      refs.editorPage.style.setProperty("--left-sidebar-width", `${state.ui.leftSidebarWidth}px`);
    } else {
      state.ui.rightSidebarWidth = sidebarResizeState.nextWidth;
      refs.editorPage.style.setProperty("--right-sidebar-width", `${state.ui.rightSidebarWidth}px`);
    }
  });
}

function endSidebarResize() {
  if (!sidebarResizeState) return;
  if (sidebarResizeFrame) {
    cancelAnimationFrame(sidebarResizeFrame);
    sidebarResizeFrame = null;
  }
  if (Number.isFinite(sidebarResizeState.nextWidth)) {
    if (sidebarResizeState.side === "left") {
      state.ui.leftSidebarWidth = sidebarResizeState.nextWidth;
      updateSidebar();
    } else {
      state.ui.rightSidebarWidth = sidebarResizeState.nextWidth;
      updateWorkspace();
    }
  }
  sidebarResizeState = null;
  document.body.classList.remove("is-resizing-sidebar");
  refs.editorPage.classList.remove("sidebar-resizing");
  persist();
}

function clampSidebarWidth(value) {
  if (!Number.isFinite(value)) return 340;
  return Math.round(Math.min(560, Math.max(240, value)));
}

function updateSettingsPanel() {
  refs.accountCard.innerHTML = `
    <div class="account-main">
      <span class="avatar">${getLanguage() === "en" ? "L" : "本"}</span>
      <div>
        <strong>${getLanguage() === "en" ? "Local Writing Mode" : "本地写作模式"}</strong>
        <p>${escapeHtml(translateAccountStatus(state.account.syncStatus))}</p>
      </div>
    </div>
    <p>${getLanguage() === "en" ? "Drafts are stored on this device. Export a project file when you need a portable backup." : "草稿保存在当前设备。如需备份或迁移，请导出项目文件。"}</p>
    <div class="inline-actions">
      <button class="ghost-button compact-button" data-menu-action="import-project">${getLanguage() === "en" ? "Import Project" : "导入项目"}</button>
      <button class="ghost-button compact-button" data-menu-action="export-project">${getLanguage() === "en" ? "Export Project" : "导出项目"}</button>
    </div>
  `;

  updateAiSettingsPanel();

  refs.themeAccordionHint.textContent = state.ui.settingsThemeExpanded
    ? (getLanguage() === "en" ? "Click to collapse theme settings" : "点击收起主题设置")
    : (getLanguage() === "en" ? "Click to expand theme settings" : "点击展开主题设置");
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

}

function updateAiSettingsPanel() {
  if (!refs.aiProviderSelect) return;
  const settings = normalizePublicAiSettings(state.aiSettings);
  refs.aiProviderSelect.value = settings.provider;
  if (refs.aiModelSelect) {
    refs.aiModelSelect.innerHTML = renderAiModelOptions(settings.provider);
    refs.aiModelSelect.value = getAiModelOptions(settings.provider).includes(settings.model) ? settings.model : "";
  }
  refs.aiModelInput.value = settings.model || aiProviderDefaults[settings.provider] || "";
  refs.aiBaseUrlInput.value = settings.baseUrl;
  refs.aiApiKeyInput.value = "";
  if (refs.agentShowCostDetailsToggle) refs.agentShowCostDetailsToggle.checked = Boolean(state.ui.showCostDetails);
  const savedKeyText = settings.hasApiKey
    ? (getLanguage() === "en" ? `Saved key ${settings.apiKeyPreview}` : `已保存密钥 ${settings.apiKeyPreview}`)
    : (getLanguage() === "en" ? "No API key saved." : "尚未保存 API Key。");
  const savedAtText = settings.updatedAt ? ` · ${formatRelativeTime(settings.updatedAt)}` : "";
  refs.aiSettingsStatus.textContent = settings.saveStatus || `${savedKeyText}${savedAtText}`;
}

function handleAiProviderChange(event) {
  const provider = event.target.value;
  const previousProvider = state.aiSettings.provider;
  const previousPresetModels = getAiModelOptions(previousProvider);
  if (!refs.aiModelInput.value || previousPresetModels.includes(refs.aiModelInput.value)) {
    refs.aiModelInput.value = aiProviderDefaults[provider] || "";
  }
  if (refs.aiModelSelect) {
    refs.aiModelSelect.innerHTML = renderAiModelOptions(provider);
    refs.aiModelSelect.value = getAiModelOptions(provider).includes(refs.aiModelInput.value) ? refs.aiModelInput.value : "";
  }
}

function handleAiModelSelectChange(event) {
  const selectedModel = String(event.target.value || "").trim();
  if (!selectedModel) return;
  refs.aiModelInput.value = selectedModel;
}

function renderInspirationList() {
  const work = getCurrentWork();
  const categories = getAvailableInspirationCategories();
  const editingItem = state.ui.inspirationEditingId
    ? getInspirationById(work?.id, state.ui.inspirationEditingId) ?? null
    : null;
  refs.inspirationCategoryFilter.innerHTML = categories
    .map((item) => `<option value="${item}">${item === "all" ? (getLanguage() === "en" ? "All Categories" : "全部分类") : escapeHtml(item)}</option>`)
    .join("");
  refs.inspirationCategoryFilter.value = state.inspirations.activeCategory;
  refs.inspirationSearchInput.value = state.inspirations.search;
  refs.inspirationComposeTitle.textContent = editingItem ? (getLanguage() === "en" ? "Edit Idea" : "编辑灵感") : (getLanguage() === "en" ? "New Idea" : "新建灵感");
  refs.inspirationComposeHint.textContent = editingItem
    ? (getLanguage() === "en" ? "Changes update the current idea directly." : "修改后会直接更新当前灵感条目。")
    : (getLanguage() === "en" ? "Add content and categories, then save it to the idea list." : "填写内容和分类后保存到灵感列表。");
  refs.inspirationComposeCategory.innerHTML = categories
    .filter((item) => item !== "all")
    .map((item) => `<option value="${item}">${escapeHtml(item)}</option>`)
    .join("");
  const selectedComposeTag = state.ui.inspirationComposeTags[0] || "待补充";
  refs.inspirationComposeCategory.value = categories.includes(selectedComposeTag) ? selectedComposeTag : "待补充";
  refs.inspirationSelectedTags.innerHTML = state.ui.inspirationComposeTags
    .map(
      (tag) =>
        `<button class="bookmark-pill" data-inspiration-action="remove-tag" data-id="${escapeAttribute(tag)}">${escapeHtml(tag)} ×</button>`,
    )
    .join("");
  refs.inspirationSortButton.textContent = getLanguage() === "en"
    ? `Sort: ${state.inspirations.sort === "newest" ? "Newest" : state.inspirations.sort === "oldest" ? "Oldest" : "Favorites"}`
    : `排序：${state.inspirations.sort === "newest" ? "最新" : state.inspirations.sort === "oldest" ? "最早" : "收藏优先"}`;
  refs.saveInspirationButton.textContent = editingItem ? (getLanguage() === "en" ? "Save Changes" : "保存修改") : (getLanguage() === "en" ? "Save Idea" : "保存灵感");
  const items = getVisibleInspirations();
  const selectedItems = getSelectedInspirationsForWork(work?.id);
  const selectedCount = selectedItems.length;
  const bulkActionBar = work && selectedCount > 0
    ? `
      <div class="inspiration-bulk-bar">
        <span>${getLanguage() === "en" ? `${selectedCount} selected` : `已选择 ${selectedCount} 条灵感`}</span>
        <div>
          <button
            class="primary-button"
            data-inspiration-action="develop-selected-project-materials"
            ${state.ui.ideaProjectMaterialsPendingId ? "disabled" : ""}
          >${getLanguage() === "en" ? "Merge into Project Materials" : "整合发展成项目资料"}</button>
          <button class="ghost-button" data-inspiration-action="clear-selection">${getLanguage() === "en" ? "Clear" : "清空选择"}</button>
        </div>
      </div>
    `
    : "";
  refs.inspirationChatList.innerHTML =
    !work
      ? `<div class="empty-state">${getLanguage() === "en" ? "Open a work before viewing its ideas." : "请先打开一个作品，再查看该作品的灵感。"}</div>`
      : items.length === 0
      ? `<div class="empty-state">${getLanguage() === "en" ? "No matching ideas." : "没有符合条件的灵感。"}</div>`
      : `${bulkActionBar}${items
          .map(
            (item) => {
              const collapsed = state.ui.collapsedInspirationIds.includes(item.id);
              const selected = state.ui.selectedInspirationIds.includes(item.id);
              return `
              <article class="inspiration-card ${item.isPinned ? "pinned" : ""} ${collapsed ? "is-collapsed" : ""} ${selected ? "is-selected" : ""}">
                <header>
                  <span class="inspiration-select-toggle">
                    <input
                      id="inspiration-select-${escapeAttribute(item.id)}"
                      type="checkbox"
                      data-inspiration-action="toggle-select"
                      data-id="${item.id}"
                      ${selected ? "checked" : ""}
                    />
                    <label for="inspiration-select-${escapeAttribute(item.id)}">${getLanguage() === "en" ? "Select" : "选择"}</label>
                  </span>
                  <span class="inspiration-tag-row">${getInspirationItemCategories(item).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</span>
                  <div class="inspiration-card-meta">
                    ${item.isPinned ? `<span>${getLanguage() === "en" ? "Pinned" : "置顶"}</span>` : ""}
                    ${item.isFavorite ? `<span>${getLanguage() === "en" ? "Favorite" : "收藏"}</span>` : ""}
                    <time>${escapeHtml(formatInspirationTime(item.updatedAt || item.createdAt))}</time>
                  </div>
                </header>
                <p>${escapeHtml(item.content)}</p>
                <footer>
                  <button data-inspiration-action="toggle-collapse" data-id="${item.id}">${collapsed ? (getLanguage() === "en" ? "Expand" : "展开") : (getLanguage() === "en" ? "Collapse" : "收起")}</button>
                  <button data-inspiration-action="favorite" data-id="${item.id}">${item.isFavorite ? (getLanguage() === "en" ? "Unfavorite" : "取消收藏") : (getLanguage() === "en" ? "Favorite" : "收藏")}</button>
                  <button data-inspiration-action="pin" data-id="${item.id}">${item.isPinned ? (getLanguage() === "en" ? "Unpin" : "取消置顶") : (getLanguage() === "en" ? "Pin" : "置顶")}</button>
                  <button
                    class="${state.ui.ideaProjectMaterialsPendingId === item.id ? "is-loading" : ""}"
                    data-inspiration-action="develop-project-materials"
                    data-id="${item.id}"
                    ${state.ui.ideaProjectMaterialsPendingId ? "disabled" : ""}
                  >${t("ai.developIdea")}</button>
                  <button data-inspiration-action="insert" data-id="${item.id}">${getLanguage() === "en" ? "Insert" : "插入正文"}</button>
                  <button data-inspiration-action="edit" data-id="${item.id}">${getLanguage() === "en" ? "Edit" : "编辑"}</button>
                  <button data-inspiration-action="delete" data-id="${item.id}">${t("library.delete")}</button>
                </footer>
              </article>
            `;
            },
          )
          .join("")}`;
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
      <div class="modal-card surface ${modal.type === "shortcuts" ? "shortcut-modal" : ""} ${modal.type === "export-preview" || modal.type === "import-project-conflict" || modal.type === "idea-project-materials-preview" || modal.type === "import-txt-preview" ? "preview-modal" : ""}">
        <strong>${escapeHtml(modal.title)}</strong>
        ${modal.message ? `<pre class="modal-message">${escapeHtml(modal.message)}</pre>` : ""}
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
  if (action === "clear-library-search") {
    state.ui.librarySearch = "";
    updateLibraryHeader();
    renderLibraryPage();
    persist();
    return;
  }
  if (action === "open-create-folder") {
    openCreateFolderModal();
  }
  if (action === "open-create-work") {
    openCreateWorkModal();
  }
  if (action === "import-txt") {
    await importTxtToNewWork();
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
    if (action === "rename") openRenameModal("work", id);
    if (action === "delete") openDeleteWorkModal(id);
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
    title: t("library.createFolder"),
    body: `
      <div class="modal-form">
        <label>${getLanguage() === "en" ? "Folder Name" : "文件夹名称"}</label>
        <input id="modal-folder-name" type="text" placeholder="${escapeAttribute(getLanguage() === "en" ? "For example: Novel Series" : "例如：长篇连载")}" />
        <label>${getLanguage() === "en" ? "Parent Location" : "父级位置"}</label>
        <select id="modal-folder-parent">${renderFolderOptions(state.activeFolderId, true)}</select>
      </div>
    `,
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      { id: "submit-create-folder", label: getLanguage() === "en" ? "Create Folder" : "创建文件夹", primary: true },
    ],
  };
  updateModal();
}

function openCreateWorkModal() {
  state.ui.modal = {
    type: "create-work",
    title: t("library.createWork"),
    body: `
      <div class="modal-form">
        <label>${getLanguage() === "en" ? "Work Title" : "作品名称"}</label>
        <input id="modal-work-title" type="text" placeholder="${escapeAttribute(getLanguage() === "en" ? "Enter work title" : "输入作品名称")}" />
        <label>${getLanguage() === "en" ? "Description" : "作品简介"}</label>
        <textarea id="modal-work-description" rows="4" placeholder="${escapeAttribute(getLanguage() === "en" ? "Briefly describe this work" : "简要说明作品方向")}"></textarea>
        <label>${getLanguage() === "en" ? "Folder" : "所属文件夹"}</label>
        <select id="modal-work-folder">${renderFolderOptions(state.activeFolderId, true)}</select>
      </div>
    `,
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      { id: "submit-create-work", label: getLanguage() === "en" ? "Create Work" : "创建作品", primary: true },
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
    title: t("chapter.new"),
    body: `
      <div class="modal-form">
        <label>${getLanguage() === "en" ? "Chapter Title" : "章节标题"}</label>
        <input id="modal-chapter-title" type="text" placeholder="${escapeAttribute(getLanguage() === "en" ? "For example: Chapter 3: Night Sailing" : "例如：第三章：夜航")}" value="${escapeAttribute(generateDefaultChapterTitle(workId))}" />
        <label>${getLanguage() === "en" ? "Position" : "插入位置"}</label>
        <select id="modal-chapter-position">
          <option value="end" ${defaultMode === "end" ? "selected" : ""}>${getLanguage() === "en" ? "Create at End" : "在末尾新建"}</option>
          <option value="after-current" ${defaultMode === "after-current" ? "selected" : ""} ${hasCurrent ? "" : "disabled"}>${getLanguage() === "en" ? "Insert After Current" : "在当前章节后插入"}</option>
          <option value="before-current" ${defaultMode === "before-current" ? "selected" : ""} ${hasCurrent ? "" : "disabled"}>${getLanguage() === "en" ? "Insert Before Current" : "在当前章节前插入"}</option>
        </select>
      </div>
    `,
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      { id: "submit-create-chapter", label: getLanguage() === "en" ? "Create Chapter" : "创建章节", primary: true },
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
    title: entityType === "folder"
      ? (getLanguage() === "en" ? "Rename Folder" : "重命名文件夹")
      : entityType === "work"
        ? (getLanguage() === "en" ? "Rename Work" : "重命名作品")
        : (getLanguage() === "en" ? "Rename Chapter" : "重命名章节"),
    body: `
      <div class="modal-form">
        <label>${getLanguage() === "en" ? "Name" : "名称"}</label>
        <input id="modal-rename-value" type="text" value="${escapeAttribute(entity.name ?? entity.title)}" />
      </div>
    `,
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      { id: "submit-rename-entity", label: t("editor.save"), primary: true },
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
    title: getLanguage() === "en" ? "Delete Work" : "删除作品",
    message: getLanguage() === "en" ? `Delete "${work.title}"? All chapters in this work will also be deleted.` : `确认删除作品“${work.title}”？将同时删除该作品下的全部章节数据。`,
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      { id: "confirm-delete-work", label: getLanguage() === "en" ? "Delete Work" : "删除作品", primary: true },
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
    title: getLanguage() === "en" ? "Delete Chapter" : "删除章节",
    message: getLanguage() === "en" ? `Delete chapter "${chapter.title}"?` : `确认删除章节“${chapter.title}”？`,
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      { id: "confirm-delete-chapter", label: getLanguage() === "en" ? "Delete Chapter" : "删除章节", primary: true },
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
    title: getLanguage() === "en" ? "Delete Folder" : "删除文件夹",
    body: `
      <div class="modal-copy-block">
        <p>${getLanguage() === "en" ? `Folder "${escapeHtml(folder.name)}" affects ${descendantIds.length + 1} folders, ${affectedWorks.length} works, and ${affectedChapterCount} chapters.` : `当前文件夹“${escapeHtml(folder.name)}”下共影响 ${descendantIds.length + 1} 个文件夹、${affectedWorks.length} 个作品、${affectedChapterCount} 个章节。`}</p>
        <p>${getLanguage() === "en" ? "You can delete everything, or delete only the folder and move its contents up one level." : "你可以选择直接删除全部内容，或仅删除文件夹并将内部作品与子文件夹上移到上一级。"}</p>
      </div>
    `,
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      { id: "confirm-delete-folder-keep", label: getLanguage() === "en" ? "Delete Folder and Move Contents Up" : "删除文件夹并上移内容", primary: false },
      { id: "confirm-delete-folder-all", label: getLanguage() === "en" ? "Delete With Contents" : "连同内容一起删除", primary: true },
    ],
  };
  updateModal();
}

function openResetProjectModal() {
  state.ui.modal = {
    type: "reset-project",
    title: getLanguage() === "en" ? "Reset Sample Project" : "重置示例项目",
    message:
      getLanguage() === "en"
        ? "Reset the local library to the sample project? Current folders, works, chapters, and ideas will be replaced."
        : "确认将本地作品库重置为示例项目？当前文件夹、作品、章节和灵感都会被替换。",
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      { id: "confirm-reset-project", label: getLanguage() === "en" ? "Reset" : "确认重置", primary: true },
    ],
  };
  updateModal();
}

function openImportTextConflictModal(importedText) {
  const currentChapter = getCurrentChapter();
  state.ui.modal = {
    type: "import-text-conflict",
    payload: { importedText },
    title: getLanguage() === "en" ? "Import TXT" : "导入 TXT",
    message:
      getLanguage() === "en"
        ? `The current chapter${currentChapter?.title ? ` "${currentChapter.title}"` : ""} already has content. Choose how to import this text file.`
        : `当前章节${currentChapter?.title ? `“${currentChapter.title}”` : ""}已有正文，请选择如何导入这个 TXT 文件。`,
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      { id: "append-imported-text", label: getLanguage() === "en" ? "Append" : "追加到末尾", primary: false },
      { id: "replace-with-imported-text", label: getLanguage() === "en" ? "Replace" : "覆盖正文", primary: true },
    ],
  };
  updateModal();
}

function openImportTxtPreviewModal(payload) {
  const { parsed, sourceFileName, workTitle } = payload;
  const chapters = Array.isArray(parsed?.chapters) ? parsed.chapters : [];
  const recognized = Number(parsed?.recognizedCount || 0);
  const previewChapters = chapters.slice(0, 8);
  const appendWork = payload.appendWorkId ? getWork(payload.appendWorkId) : null;
  const ruleText = getLanguage() === "en"
    ? "Chapter headings: 第...章 / 第...卷 / 序章 / 1. Title / 一、Title / Chapter 1"
    : "章节标题：第...章 / 第...卷 / 序章 / 1. 标题 / 一、标题 / Chapter 1";
  state.ui.modal = {
    type: "import-txt-preview",
    payload,
    title: getLanguage() === "en" ? "Import TXT" : "导入 TXT",
    body: `
      <div class="import-preview-summary">
        <div>
          <span>${getLanguage() === "en" ? "Source" : "来源文件"}</span>
          <strong>${escapeHtml(sourceFileName)}</strong>
        </div>
        <div>
          <span>${getLanguage() === "en" ? "New work" : "新作品"}</span>
          <strong>${escapeHtml(workTitle)}</strong>
        </div>
        <div>
          <span>${getLanguage() === "en" ? "Chapter split" : "分章结果"}</span>
          <strong>${recognized > 0 ? (getLanguage() === "en" ? `${chapters.length} chapters` : `${chapters.length} 章`) : (getLanguage() === "en" ? "1 chapter" : "1 章")}</strong>
        </div>
      </div>
      <div class="import-preview-rule">
        <span>${getLanguage() === "en" ? "Primary rule" : "优先规则"}</span>
        <code>${escapeHtml(ruleText)}</code>
        <small>${recognized > 0
          ? (getLanguage() === "en" ? "The file will be split before each matched chapter heading." : "将按匹配到的章节标题自动分章。")
          : (getLanguage() === "en" ? "No chapter headings were found. The file will be imported as one chapter." : "未识别到章节标题，将作为单章导入。")
        }</small>
      </div>
      <div class="import-preview-list">
        ${previewChapters
          .map((chapter, index) => `
            <div class="import-preview-row">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <strong>${escapeHtml(chapter.title)}</strong>
              <small>${t("library.wordCount", { count: countWords(chapter.content) })}</small>
            </div>
          `)
          .join("")}
        ${chapters.length > previewChapters.length ? `<small class="empty-inline">${getLanguage() === "en" ? `${chapters.length - previewChapters.length} more chapters` : `还有 ${chapters.length - previewChapters.length} 章`}</small>` : ""}
      </div>
    `,
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      ...(appendWork ? [{ id: "confirm-import-txt-append-work", label: getLanguage() === "en" ? `Append to ${appendWork.title}` : `追加到《${appendWork.title}》`, primary: false }] : []),
      { id: "confirm-import-txt-new-work", label: getLanguage() === "en" ? "Import as New Work" : "导入为新作品", primary: true },
    ],
  };
  updateModal();
}

function openInfoModal(title, message) {
  state.ui.modal = {
    type: "info",
    title,
    message,
    actions: [{ id: "close-modal", label: getLanguage() === "en" ? "Close" : "关闭", primary: true }],
  };
  updateModal();
}

function openCostGuardConfirmationModal({ result, action, options }) {
  const message = formatCostGuardBlockedMessage(result, Boolean(state.ui.showCostDetails));
  state.ui.modal = {
    type: "cost-guard-confirmation",
    title: getLanguage() === "en" ? "Generation may use more API quota" : "本次生成可能消耗较多 API 用量",
    message,
    body: `
      <div class="modal-copy-block">
        <p>${escapeHtml(getLanguage() === "en"
          ? "You can cancel and adjust the target length or mode, or continue this write. Continuing will not show this warning again for the current attempt."
          : "你可以取消并调整目标字数或生成模式，也可以继续本次写作。继续后，本次写作不会再次显示这个提醒。")}</p>
      </div>
    `,
    payload: {
      action,
      options: {
        ...options,
        costGuardConfirmed: true,
      },
    },
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      { id: "confirm-cost-guard-continue", label: getLanguage() === "en" ? "Continue This Write" : "继续本次写作", primary: true },
    ],
  };
  updateModal();
}

function openWritingToolbarSettingsModal() {
  normalizeWritingToolLayout();
  state.ui.modal = {
    type: "writing-toolbar-settings",
    title: t("workspace.toolbarSettings"),
    message: t("workspace.toolbarSettingsHint"),
    body: renderWritingToolbarSettingsBody(),
    actions: [{ id: "close-modal", label: getLanguage() === "en" ? "Done" : "完成", primary: true }],
  };
  updateModal();
}

function renderWritingToolbarSettingsBody() {
  const moduleMap = new Map(writingToolModules.map((item) => [item.id, item]));
  return `
    <div class="toolbar-settings-list">
      ${state.ui.writingToolOrder
        .map((id, index, items) => {
          const module = moduleMap.get(id);
          if (!module) return "";
          const visible = state.ui.writingToolVisibility[id] !== false;
          return `
            <div class="toolbar-settings-row">
              <label>
                <input type="checkbox" ${visible ? "checked" : ""} data-modal-action="toggle-writing-tool:${escapeAttribute(id)}" />
                <span>${escapeHtml(t(module.labelKey))}</span>
              </label>
              <div class="inline-actions">
                <button class="ghost-button compact-button" data-modal-action="move-writing-tool-up:${escapeAttribute(id)}" ${index === 0 ? "disabled" : ""}>${t("workspace.moveUp")}</button>
                <button class="ghost-button compact-button" data-modal-action="move-writing-tool-down:${escapeAttribute(id)}" ${index === items.length - 1 ? "disabled" : ""}>${t("workspace.moveDown")}</button>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function openEmptyWorkModal(workId) {
  state.ui.modal = {
    type: "empty-work",
    payload: { workId },
    title: t("chapter.emptyWorkTitle"),
    message: t("chapter.emptyWorkCopy"),
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      { id: "create-chapter-from-empty-work", label: t("chapter.new"), primary: true },
    ],
  };
  updateModal();
}

function openChapterExportPreview() {
  const chapter = getCurrentChapter();
  const work = getCurrentWork();
  if (!chapter || !work) return;
  const fileName = `${slugify(chapter.title || "chapter")}.txt`;
  const escapedWorkTitle = escapeHtml(work.title);
  state.ui.modal = {
    type: "export-preview",
    title: t("export.chapterTitle"),
    body: `
      <div class="modal-copy-block modal-preview-intro">
        <p>${getLanguage() === "en" ? `This export contains the current chapter from “${escapedWorkTitle}”.` : `这次导出只包含“${escapedWorkTitle}”中的当前章节。`}</p>
      </div>
      ${renderPreviewStatGrid(getChapterExportStatRows(chapter))}
      ${renderExportPreviewBody([
        [t("export.fileName"), fileName],
        [t("export.format"), "TXT"],
      ])}
    `,
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      { id: "confirm-export-chapter", label: t("export.confirm"), primary: true },
    ],
  };
  updateModal();
}

function openProjectExportPreview() {
  const stats = getProjectExportStats();
  const fileName = `简纪项目-${new Date().toISOString().slice(0, 10)}.json`;
  state.ui.modal = {
    type: "export-preview",
    title: t("export.projectTitle"),
    body: `
      <div class="modal-copy-block modal-preview-intro">
        <p>${getLanguage() === "en" ? "This export contains the full local library." : "这次导出包含完整的本地作品库。"}</p>
      </div>
      ${renderPreviewStatGrid(getLibraryExportStatRows(stats))}
      ${renderExportPreviewBody([
        [t("export.fileName"), fileName],
        [t("export.format"), "JSON"],
      ])}
    `,
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      { id: "confirm-export-project", label: t("export.confirm"), primary: true },
    ],
  };
  updateModal();
}

function renderExportPreviewBody(rows) {
  return `
    <div class="export-preview-list">
      ${rows
        .map(
          ([label, value]) => `
            <div class="export-preview-row">
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(value)}</strong>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderPreviewStatGrid(rows) {
  return `
    <div class="modal-stat-grid">
      ${rows
        .map(
          ([label, value]) => `
            <div class="modal-stat">
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(value)}</strong>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function getLibraryExportStatRows(stats) {
  return [
    [t("export.folders"), String(stats.folderCount)],
    [t("export.works"), String(stats.workCount)],
    [t("export.chapters"), String(stats.chapterCount)],
    [t("export.words"), String(stats.wordCount)],
    [t("export.ideas"), String(stats.inspirationCount)],
  ];
}

function getChapterExportStatRows(chapter) {
  return [
    [t("export.scope"), t("export.currentChapter")],
    [t("export.chapters"), "1"],
    [t("export.words"), String(countWords(chapter.content))],
  ];
}

function getLibraryContentStats(library = null) {
  const source = library ?? getLibraryStatePayload();
  const folders = Array.isArray(source?.folders) ? source.folders : [];
  const works = Array.isArray(source?.works) ? source.works : [];
  const chapters = Array.isArray(source?.chapters) ? source.chapters : [];
  const inspirationItems =
    source?.inspirations && typeof source.inspirations === "object"
      ? Object.values(source.inspirations.itemsByWork ?? {}).reduce((sum, items) => sum + (Array.isArray(items) ? items.length : 0), 0)
      : 0;
  return {
    folderCount: folders.length,
    workCount: works.length,
    chapterCount: chapters.length,
    wordCount: chapters.reduce((sum, chapter) => sum + countWords(chapter?.content || ""), 0),
    inspirationCount: inspirationItems,
  };
}

function renderLibraryStatsText(stats) {
  const inspirationText =
    stats.inspirationCount > 0
      ? getLanguage() === "en"
        ? `, ${stats.inspirationCount} ideas`
        : `、${stats.inspirationCount} 条灵感`
      : "";
  return getLanguage() === "en"
    ? `${stats.folderCount} folders, ${stats.workCount} works, ${stats.chapterCount} chapters, ${stats.wordCount} words${inspirationText}`
    : `${stats.folderCount} 个文件夹、${stats.workCount} 个作品、${stats.chapterCount} 个章节、${stats.wordCount} 个字${inspirationText}`;
}

function openImportProjectConflictModal(importedLibrary) {
  const currentStats = getLibraryContentStats();
  const importedStats = getLibraryContentStats(importedLibrary);
  state.ui.modal = {
    type: "import-project-conflict",
    payload: { importedLibrary },
    title: getLanguage() === "en" ? "Import Project" : "导入项目",
    body: `
      <div class="modal-copy-block modal-preview-intro">
        <p>${getLanguage() === "en"
          ? "This will replace the current library with the imported project."
          : "这次导入会用文件中的项目替换当前作品库。"}</p>
      </div>
      <div class="modal-preview-compare">
        <div class="modal-preview-card">
          <strong>${getLanguage() === "en" ? "Current library" : "当前作品库"}</strong>
          <div class="modal-preview-subtitle">${getLanguage() === "en" ? "Will be replaced" : "将被替换"}</div>
          ${renderPreviewStatGrid(getLibraryExportStatRows(currentStats))}
        </div>
        <div class="modal-preview-card">
          <strong>${getLanguage() === "en" ? "Imported file" : "导入文件"}</strong>
          <div class="modal-preview-subtitle">${getLanguage() === "en" ? "Will become active" : "将成为当前内容"}</div>
          ${renderPreviewStatGrid(getLibraryExportStatRows(importedStats))}
        </div>
      </div>
    `,
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      { id: "confirm-import-project", label: getLanguage() === "en" ? "Replace Library" : "确认替换", primary: true },
    ],
  };
  updateModal();
}

function openInspirationCategoryRenameModal(categoryName) {
  state.ui.modal = {
    type: "rename-inspiration-category",
    payload: { categoryName },
    title: getLanguage() === "en" ? "Rename Category" : "重命名分类",
    body: `
      <div class="modal-form">
        <label>${getLanguage() === "en" ? "Category Name" : "分类名称"}</label>
        <input id="modal-inspiration-category-name" type="text" value="${escapeAttribute(categoryName)}" />
      </div>
    `,
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      { id: "submit-rename-inspiration-category", label: t("editor.save"), primary: true },
    ],
  };
  updateModal();
}

function openInspirationCategoryDeleteModal(categoryName) {
  const affectedCount = getInspirationCategoryUsageCount(categoryName);
  state.ui.modal = {
    type: "delete-inspiration-category",
    payload: { categoryName },
    title: getLanguage() === "en" ? "Delete Category" : "删除分类",
    message:
      getLanguage() === "en"
        ? `Delete category "${categoryName}"? This affects ${affectedCount} ideas. Existing ideas will remove this category tag.`
        : `确认删除分类“${categoryName}”？将影响 ${affectedCount} 条灵感，已有灵感会移除这个分类标签。`,
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      { id: "confirm-delete-inspiration-category", label: t("library.delete"), primary: true },
    ],
  };
  updateModal();
}

function openInspirationCategoryDuplicateModal(categoryName) {
  state.ui.modal = {
    type: "duplicate-inspiration-category",
    title: getLanguage() === "en" ? "Category Already Exists" : "分类已存在",
    message:
      getLanguage() === "en"
        ? `Category "${categoryName}" already exists. Use another name.`
        : `分类“${categoryName}”已经存在，请换一个名字。`,
    actions: [{ id: "close-modal", label: getLanguage() === "en" ? "Close" : "关闭", primary: true }],
  };
  updateModal();
}

function openIdeaProjectMaterialsPreviewModal(inspiration, materials) {
  state.ui.modal = {
    type: "idea-project-materials-preview",
    payload: {
      inspirationId: inspiration.id,
      materials,
    },
    title: t("ai.ideaMaterialsTitle"),
    message: t("ai.ideaMaterialsMessage"),
    body: renderProjectMaterialsDraftPreview(materials),
    actions: [
      { id: "cancel-modal", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
      { id: "confirm-write-idea-project-materials", label: t("ai.writeProjectMaterials"), primary: true },
    ],
  };
  updateModal();
}

function renderProjectMaterialsDraftPreview(materials = {}) {
  return `
    <div class="project-materials-preview-grid">
      ${projectMaterialTypes
        .map((item) => {
          const label = getLanguage() === "en" ? item.en : item.zh;
          return `
            <section class="project-materials-preview-card">
              <strong>${escapeHtml(label)}</strong>
              <pre>${escapeHtml(materials[item.id] || "")}</pre>
            </section>
          `;
        })
        .join("")}
    </div>
  `;
}

async function handleModalAction(action) {
  if (action.startsWith("toggle-writing-tool:")) {
    const moduleId = action.split(":")[1];
    toggleWritingToolModule(moduleId);
    openWritingToolbarSettingsModal();
    persist();
    renderAppShell();
    updateAll();
    return;
  }

  if (action.startsWith("move-writing-tool-up:") || action.startsWith("move-writing-tool-down:")) {
    const [operation, moduleId] = action.split(":");
    moveWritingToolModule(moduleId, operation.endsWith("up") ? -1 : 1);
    openWritingToolbarSettingsModal();
    persist();
    renderAppShell();
    updateAll();
    return;
  }

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

  if (action === "confirm-reset-project") {
    Object.assign(state, createSeedState());
    state.ui.modal = null;
    ensureStateIntegrity();
    await syncLibraryToDesktop();
    updateAll();
    return;
  }

  if (action === "replace-with-imported-text" || action === "append-imported-text") {
    const importedText = state.ui.modal?.payload?.importedText ?? "";
    state.ui.modal = null;
    applyImportedTextToCurrentChapter(importedText, action === "append-imported-text" ? "append" : "replace");
    updateModal();
    return;
  }

  if (action === "confirm-import-txt-new-work") {
    const payload = state.ui.modal?.payload;
    state.ui.modal = null;
    updateModal();
    await createImportedTxtWorkFromPreview(payload);
    return;
  }

  if (action === "confirm-import-txt-append-work") {
    const payload = state.ui.modal?.payload;
    state.ui.modal = null;
    updateModal();
    await appendImportedTxtToCurrentWorkFromPreview(payload);
    return;
  }

  if (action === "confirm-import-project") {
    const importedLibrary = state.ui.modal?.payload?.importedLibrary;
    state.ui.modal = null;
    applyLibraryState(importedLibrary);
    ensureStateIntegrity();
    await syncLibraryToDesktop();
    updateAll();
    return;
  }

  if (action === "confirm-export-chapter") {
    state.ui.modal = null;
    updateModal();
    exportCurrentChapter();
    return;
  }

  if (action === "confirm-export-project") {
    state.ui.modal = null;
    updateModal();
    await exportProjectFile();
    return;
  }

  if (action === "create-chapter-from-empty-work") {
    const workId = state.ui.modal?.payload?.workId;
    state.ui.modal = null;
    updateModal();
    openCreateChapterModal(workId);
    return;
  }

  if (action === "submit-rename-inspiration-category") {
    const from = state.ui.modal?.payload?.categoryName;
    const next = refs.modalRoot.querySelector("#modal-inspiration-category-name")?.value.trim();
    if (!from || !next || next === from) {
      state.ui.modal = null;
      updateModal();
      return;
    }
    if (hasDuplicateInspirationCategoryName(from, next)) {
      openInspirationCategoryDuplicateModal(next);
      return;
    }
    renameInspirationCategory(from, next);
    state.ui.modal = null;
    renderInspirationList();
    persist();
    updateModal();
    return;
  }

  if (action === "confirm-delete-inspiration-category") {
    const categoryName = state.ui.modal?.payload?.categoryName;
    if (!categoryName) return;
    deleteInspirationCategory(categoryName);
    state.ui.modal = null;
    renderInspirationList();
    persist();
    updateModal();
    return;
  }

  if (action === "confirm-write-idea-project-materials") {
    const materials = state.ui.modal?.payload?.materials;
    state.ui.modal = null;
    updateModal();
    const written = await writeProjectMaterialsDraft(materials);
    if (written) {
      completeCurrentAgentConfirmation(getLanguage() === "en" ? "Project materials written." : "项目资料已写入。");
    }
    return;
  }

  if (action === "confirm-cost-guard-continue") {
    const payload = state.ui.modal?.payload || {};
    state.ui.modal = null;
    updateModal();
    await handleAgentAction(payload.action, payload.options || {});
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
    chapter.outline = chapter.savedOutline;
    chapter.dirty = false;
    chapter.saveStatus = "已保存";
    chapter.saveTime = "回退到上次保存";
    state.currentChapterOutline = chapter.outline;
    state.outlineDirty = false;
    state.outlineSaveStatus = "已保存";
    hydrateEditor();
    state.route = "library";
    state.ui.modal = null;
    updateAll();
  }
}

function toggleWritingToolModule(moduleId) {
  normalizeWritingToolLayout();
  if (!state.ui.writingToolOrder.includes(moduleId)) return;
  state.ui.writingToolVisibility[moduleId] = state.ui.writingToolVisibility[moduleId] === false;
}

function moveWritingToolModule(moduleId, direction) {
  normalizeWritingToolLayout();
  const index = state.ui.writingToolOrder.indexOf(moduleId);
  if (index < 0) return;
  const nextIndex = Math.max(0, Math.min(state.ui.writingToolOrder.length - 1, index + direction));
  if (nextIndex === index) return;
  const nextOrder = [...state.ui.writingToolOrder];
  const [item] = nextOrder.splice(index, 1);
  nextOrder.splice(nextIndex, 0, item);
  state.ui.writingToolOrder = nextOrder;
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
    savedOutline: template.outline ?? "",
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
  if (!hasUnsavedChanges()) {
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
    title: getLanguage() === "en" ? "Return to Library?" : "返回文件管理页？",
    message: getLanguage() === "en" ? "The current chapter has unsaved changes. Choose how to handle them before returning." : "当前章节还有未保存修改，返回前请决定如何处理。",
    actions: [
      { id: "save-and-back", label: getLanguage() === "en" ? "Save and Return" : "保存并返回", primary: true },
      { id: "discard-and-back", label: getLanguage() === "en" ? "Return Without Saving" : "不保存直接返回", primary: false },
      { id: "cancel-back", label: getLanguage() === "en" ? "Cancel" : "取消", primary: false },
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
  state.ui.libraryWorkViewId = null;
  state.ui.libraryEntityMenu = null;
  state.ui.libraryScrollTop = 0;
  ensureActiveFolderTreeVisible();
  updateAll();
  persist();
}

function isFolderExpanded(folderId) {
  if (folderId === "root") return !state.ui.libraryExpandedFolders.includes("root-collapsed");
  return state.ui.libraryExpandedFolders.includes(String(folderId));
}

function toggleFolderExpanded(folderId) {
  const id = String(folderId);
  const expanded = isFolderExpanded(id);
  if (id === "root") {
    state.ui.libraryExpandedFolders = expanded
      ? [...state.ui.libraryExpandedFolders.filter((item) => item !== "root-collapsed"), "root-collapsed"]
      : state.ui.libraryExpandedFolders.filter((item) => item !== "root-collapsed");
  } else {
    state.ui.libraryExpandedFolders = expanded
      ? state.ui.libraryExpandedFolders.filter((item) => item !== id)
      : [...state.ui.libraryExpandedFolders, id];
  }
  renderLibraryPage();
  persist();
}

function ensureActiveFolderTreeVisible() {
  const activePath = getFolderPath(state.activeFolderId).map((item) => item.id).filter(Boolean);
  if (activePath.length > 0) {
    state.ui.libraryExpandedFolders = state.ui.libraryExpandedFolders.filter((item) => item !== "root-collapsed");
  }
  activePath.slice(0, -1).forEach((id) => {
    if (!state.ui.libraryExpandedFolders.includes(id)) state.ui.libraryExpandedFolders.push(id);
  });
}

async function openWorkDefault(workId) {
  const work = getWork(workId);
  if (!work) return;
  const targetChapterId = work.lastOpenedChapterId && work.chapterIds.includes(work.lastOpenedChapterId) ? work.lastOpenedChapterId : work.chapterIds[0];
  if (!targetChapterId) {
    openEmptyWorkModal(work.id);
    return;
  }
  await openChapter(work.id, targetChapterId);
}

async function openChapter(workId, chapterId) {
  const work = getWork(workId);
  const chapter = getChapter(chapterId);
  if (!work || !chapter || chapter.workId !== work.id || !work.chapterIds.includes(chapter.id)) {
    openInfoModal(t("error.openFailedTitle"), t("error.openChapterMissing"));
    return;
  }
  const previous = getCurrentChapter();
  if (previous && hasUnsavedChanges() && state.ui.autosaveEnabled) await saveCurrentChapter();
  state.ui.libraryScrollTop = refs.libraryList?.scrollTop ?? state.ui.libraryScrollTop;
  handleInspirationWorkChange(workId, state.activeWorkId);
  state.activeWorkId = workId;
  state.activeChapterId = chapterId;
  state.outlineDirty = false;
  state.outlineSaveStatus = "已保存";
  state.outlineLastSavedAt = null;
  state.route = "editor";
  state.activeTab = "writing";
  closeChapterMenus();
  state.ui.chapterPanelOpen = false;
  work.lastOpenedChapterId = chapterId;
  work.updatedAt = new Date().toISOString();
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
  state.account.syncStatus = "本地有未保存修改";
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

  if ((event.metaKey || event.ctrlKey) && !event.shiftKey && key === "s") {
    event.preventDefault();
    void saveCurrentChapter({ scope: "body" });
    return;
  }
  if ((event.metaKey || event.ctrlKey) && event.shiftKey && key === "o") {
    event.preventDefault();
    openChapterPanelForKeyboard();
    return;
  }
  if ((event.metaKey || event.ctrlKey) && key === "f") {
    event.preventDefault();
    openFindReplace();
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
  state.ui.focusTarget = "document";
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
  queueLibrarySyncToDesktop();
}

function handleOutlineInput(event) {
  handleOutlineChange(event.target.value, "sidebar");
}

function handleOutlinePanelInput(event) {
  handleOutlineChange(event.target.value, "panel");
}

function handleOutlineFocus() {
  state.ui.focusTarget = "outline";
  state.ui.lastFocused = true;
  startFocusTimer();
}

function handleOutlineBlur() {
  state.ui.lastFocused = false;
  stopFocusTimer();
}

function handleOutlineKeydown(event) {
  if ((event.metaKey || event.ctrlKey) && !event.shiftKey && event.key.toLowerCase() === "s") {
    event.preventDefault();
    void saveCurrentOutline();
  }
}

function handleOutlineChange(value, source) {
  const chapter = getCurrentChapter();
  const work = getCurrentWork();
  if (!chapter) return;
  chapter.outline = value;
  state.currentChapterOutline = value;
  state.outlineDirty = chapter.outline !== chapter.savedOutline;
  state.outlineSaveStatus = state.outlineDirty ? (state.ui.autosaveEnabled ? "保存中" : "未保存") : "已保存";
  chapter.updatedAt = new Date().toISOString();
  if (work) {
    work.updatedAt = chapter.updatedAt;
    work.lastOpenedChapterId = chapter.id;
  }
  syncOutlineEditors(source);
  updateTopBar();
  updateWorkspace();
  persist();
  queueAutosave();
}

function handleWordGoalInput(event) {
  const chapter = getCurrentChapter();
  if (!chapter) return;
  chapter.wordGoal = Number(event.target.value) || 0;
  updateWorkspace();
  persist();
  queueLibrarySyncToDesktop();
}

function handleWritingAction(action) {
  if (action === "toolbar-settings") {
    openWritingToolbarSettingsModal();
    return;
  }
  if (action === "divider") insertAtCursor("\n\n——\n\n");
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
    openOutlinePanel({ focus: true });
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
      title: t("menu.history"),
      message: getLanguage() === "en" ? "These are autosaved versions of the current chapter." : "以下是当前章节自动保存过的版本。",
      body: `<div class="history-list">${
        chapter.versions.length > 0
          ? chapter.versions.map((version) => `<div class="history-row"><strong>${escapeHtml(version.label)}</strong><span>${escapeHtml(version.time)}</span></div>`).join("")
          : `<div class="empty-inline">${getLanguage() === "en" ? "No version history yet" : "暂无历史版本"}</div>`
      }</div>`,
      actions: [{ id: "close-modal", label: getLanguage() === "en" ? "Close" : "关闭", primary: true }],
    };
    updateModal();
    return;
  }

  if (action === "shortcuts") {
    state.ui.modal = {
      type: "shortcuts",
      title: getLanguage() === "en" ? "Keyboard Shortcuts" : "快捷键说明",
      message: getLanguage() === "en" ? "These shortcuts cover writing, navigation, and project actions." : "这些快捷键覆盖写作、导航和项目操作。",
      body: renderShortcutHelpBody(),
      actions: [{ id: "close-modal", label: getLanguage() === "en" ? "Close" : "关闭", primary: true }],
    };
    updateModal();
    return;
  }

  if (action === "export") {
    openChapterExportPreview();
    return;
  }

  if (action === "import-project") {
    await importProjectFile();
    return;
  }

  if (action === "export-project") {
    openProjectExportPreview();
    return;
  }

  if (action === "import-text") {
    await importTxtToNewWork();
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

function renderShortcutHelpBody() {
  const groups = [
    {
      title: t("shortcuts.quickTitle"),
      items: [
        ["Ctrl / Cmd + S", getLanguage() === "en" ? "Save the current chapter" : "保存当前章节"],
        ["Ctrl / Cmd + F", getLanguage() === "en" ? "Find and replace" : "查找替换"],
        ["Ctrl / Cmd + Z", getLanguage() === "en" ? "Undo" : "撤销"],
      ],
    },
    {
      title: t("shortcuts.navigationTitle"),
      items: [
        ["Ctrl / Cmd + Shift + O", getLanguage() === "en" ? "Open chapter panel" : "打开章节面板"],
        ["↑ / ↓", getLanguage() === "en" ? "Move focus" : "移动焦点"],
        ["Enter", getLanguage() === "en" ? "Open focused chapter" : "打开当前章节"],
        ["Esc", getLanguage() === "en" ? "Close panel" : "关闭面板"],
      ],
    },
    {
      title: t("shortcuts.projectTitle"),
      items: [
        ["Ctrl / Cmd + O", getLanguage() === "en" ? "Import a project file" : "导入项目文件"],
        ["Ctrl / Cmd + Shift + S", getLanguage() === "en" ? "Export the full project" : "导出完整项目"],
        [getLanguage() === "en" ? "More menu > Export" : "更多菜单 > 导出", getLanguage() === "en" ? "Current chapter TXT" : "当前章节 TXT"],
      ],
    },
    {
      title: t("shortcuts.moreTitle"),
      items: [
        [getLanguage() === "en" ? "Drag chapter rows" : "拖拽章节行", getLanguage() === "en" ? "Reorder chapters" : "调整章节顺序"],
        [getLanguage() === "en" ? "More menu > History" : "更多菜单 > 历史", getLanguage() === "en" ? "Autosaved versions" : "自动保存版本"],
      ],
    },
  ];

  return `
    <div class="shortcut-help">
      <p class="shortcut-help-tip">${t("shortcuts.tip")}</p>
      <div class="shortcut-group-list">
        ${groups
          .map(
            (group) => `
              <section class="shortcut-group">
                <strong>${escapeHtml(group.title)}</strong>
                <div class="shortcut-list">
                  ${group.items
                    .map(
                      ([key, description]) => `
                        <div class="shortcut-row">
                          <kbd>${escapeHtml(key)}</kbd>
                          <span>${escapeHtml(description)}</span>
                        </div>
                      `,
                    )
                    .join("")}
                </div>
              </section>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

async function handleInspirationAction(action, id) {
  if (action === "remove-tag") {
    state.ui.inspirationComposeTags = state.ui.inspirationComposeTags.filter((tag) => tag !== id);
    if (state.ui.inspirationComposeTags.length === 0) state.ui.inspirationComposeTags = ["待补充"];
    renderInspirationList();
    persist();
    return;
  }
  const work = getCurrentWork();
  if (!work) return;
  if (action === "toggle-select") {
    toggleSelectedInspiration(id);
    return;
  }
  if (action === "clear-selection") {
    clearSelectedInspirations();
    return;
  }
  if (action === "develop-selected-project-materials") {
    await generateProjectMaterialsFromSelectedInspirations(work);
    return;
  }
  const item = getInspirationById(work.id, id);
  if (!item) return;
  if (action === "toggle-collapse") {
    const collapsed = new Set(state.ui.collapsedInspirationIds);
    if (collapsed.has(id)) {
      collapsed.delete(id);
    } else {
      collapsed.add(id);
    }
    state.ui.collapsedInspirationIds = [...collapsed];
    renderInspirationList();
    persist();
    return;
  }
  if (action === "favorite") item.isFavorite = !item.isFavorite;
  if (action === "pin") item.isPinned = !item.isPinned;
  if (action === "insert") insertAtCursor(item.content);
  if (action === "develop-project-materials") {
    await generateProjectMaterialsFromInspiration(work, item);
    return;
  }
  if (action === "edit") {
    openInspirationComposer(item.id);
    return;
  }
  if (action === "delete") {
    setInspirationsForWork(
      work.id,
      getInspirationsForWork(work.id).filter((entry) => entry.id !== id),
    );
    state.ui.collapsedInspirationIds = state.ui.collapsedInspirationIds.filter((entryId) => entryId !== id);
    state.ui.selectedInspirationIds = state.ui.selectedInspirationIds.filter((entryId) => entryId !== id);
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
    openInspirationCategoryRenameModal(categoryName);
    return;
  }

  if (action === "delete") {
    openInspirationCategoryDeleteModal(categoryName);
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
    state.account.syncStatus = chapter?.dirty ? "本地有未保存修改" : "本地已保存";
  }
  if (action === "third-party-login") {
    state.account.syncStatus = chapter?.dirty ? "本地有未保存修改" : "本地已保存";
  }
  if (action === "logout") {
    state.account.loggedIn = false;
    state.account.nickname = "本地模式";
    state.account.avatar = "本";
    state.account.syncStatus = chapter?.dirty ? "本地有未保存修改" : "本地已保存";
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

function openInspirationComposer(editingId = null) {
  const work = getCurrentWork();
  const editingItem = editingId && work ? getInspirationById(work.id, editingId) ?? null : null;
  state.ui.inspirationComposeOpen = true;
  state.ui.inspirationEditingId = editingItem?.id ?? null;
  state.ui.inspirationComposeTags = editingItem ? getInspirationItemCategories(editingItem) : ["待补充"];
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

function getSelectedInspirationsForWork(workId) {
  if (!workId) return [];
  const selected = new Set(state.ui.selectedInspirationIds);
  return getInspirationsForWork(workId).filter((item) => selected.has(item.id));
}

function toggleSelectedInspiration(inspirationId) {
  if (!inspirationId) return;
  const selected = new Set(state.ui.selectedInspirationIds);
  if (selected.has(inspirationId)) {
    selected.delete(inspirationId);
  } else {
    selected.add(inspirationId);
  }
  state.ui.selectedInspirationIds = [...selected];
  renderInspirationList();
  persist();
}

function clearSelectedInspirations() {
  state.ui.selectedInspirationIds = [];
  renderInspirationList();
  persist();
}

function buildCombinedIdeaFromInspirations(items = []) {
  return items
    .map((item, index) => {
      const tags = getInspirationItemCategories(item).join("、");
      return [
        `【灵感 ${index + 1}${tags ? `｜${tags}` : ""}】`,
        String(item.content || "").trim(),
      ].filter(Boolean).join("\n");
    })
    .join("\n\n");
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

async function applySelectionAction(action) {
  const chapter = getCurrentChapter();
  if (!chapter) return;
  const start = refs.documentEditor.selectionStart;
  const end = refs.documentEditor.selectionEnd;
  if (start === end) return;
  const selected = refs.documentEditor.value.slice(start, end);
  if (action === "ai-rewrite") {
    await rewriteSelectedTextWithAgent(chapter, selected, start, end);
    return;
  }
  if (action === "quote") {
    insertAtCursor(`“${selected}”`);
    return;
  }
  if (action === "divider") {
    insertAtCursor(`\n\n—— ${selected} ——\n\n`);
    return;
  }
}

async function rewriteSelectedTextWithAgent(chapter, selected, start, end) {
  if (!desktopApi?.rewriteSelectedText) {
    openInfoModal(t("ai.title"), t("ai.desktopRequired"));
    return;
  }
  state.ui.agentActionPending = "rewrite-selection";
  state.ui.agentStatus = "";
  updateWorkspace();
  try {
    const result = await requireAgentResult(
      desktopApi.rewriteSelectedText(
        createNovelAgentPayload(chapter, {
          text: selected,
          user_instruction: getLanguage() === "en" ? "Rewrite the selected text and preserve its meaning." : "改写选中文本，保留原意并提升表达。",
        }),
      ),
    );
    const rewritten = String(result.rewritten_text || "").trim();
    if (!rewritten) throw new Error(getLanguage() === "en" ? "The rewrite result is empty." : "改写结果为空。");
    refs.documentEditor.focus();
    pushUndoSnapshot(chapter, refs.documentEditor.value, start, end);
    refs.documentEditor.setSelectionRange(start, end);
    refs.documentEditor.setRangeText(rewritten, start, end, "end");
    handleEditorInput();
    state.ui.agentStatus = t("ai.selectionRewritten");
    persist();
  } catch (error) {
    console.error("Rewrite selected text failed", error);
    state.ui.agentStatus = error?.message || (getLanguage() === "en" ? "Rewrite failed." : "改写失败。");
    openInfoModal(t("ai.title"), state.ui.agentStatus);
  } finally {
    state.ui.agentActionPending = "";
    updateWorkspace();
  }
}

async function generateProjectMaterialsFromInspiration(work, inspiration) {
  if (!desktopApi?.generateProjectMaterialsFromIdea) {
    openInfoModal(t("ai.title"), t("ai.desktopRequired"));
    return false;
  }
  state.ui.agentActionPending = "idea-project-materials";
  state.ui.ideaProjectMaterialsPendingId = inspiration.id;
  renderInspirationList();
  updateWorkspace();
  try {
    const result = await requireAgentResult(
      desktopApi.generateProjectMaterialsFromIdea({
        project_id: work.id,
        idea: inspiration.content,
      }),
    );
    openIdeaProjectMaterialsPreviewModal(inspiration, normalizeProjectMaterialsFromAgent(result.materials));
    return true;
  } catch (error) {
    console.error("Generate project materials from idea failed", error);
    const rawPreview = String(error?.result?.raw_materials_preview || "").trim();
    const message = [
      error?.message || (getLanguage() === "en" ? "Failed to develop idea." : "灵感发展失败。"),
      rawPreview
        ? (getLanguage() === "en" ? `\n\nModel output preview:\n${rawPreview}` : `\n\n模型返回预览：\n${rawPreview}`)
        : "",
    ].join("");
    openInfoModal(t("ai.title"), message);
    return false;
  } finally {
    state.ui.agentActionPending = "";
    state.ui.ideaProjectMaterialsPendingId = null;
    renderInspirationList();
    updateWorkspace();
  }
}

async function generateProjectMaterialsFromSelectedInspirations(work, goalInstruction = "") {
  const selectedItems = getSelectedInspirationsForWork(work.id);
  if (selectedItems.length === 0) return false;
  const combinedIdea = buildCombinedIdeaFromInspirations(selectedItems);
  const extraInstruction = String(goalInstruction || "").trim();
  return generateProjectMaterialsFromInspiration(work, {
    id: "selected-inspirations",
    content: [
      getLanguage() === "en"
        ? "Please merge and reconcile the selected ideas, then develop them into project materials."
        : "请整合并消化以下多条灵感，把它们发展成统一的项目资料。",
      extraInstruction ? (getLanguage() === "en" ? `Goal: ${extraInstruction}` : `任务目标：${extraInstruction}`) : "",
      "",
      combinedIdea,
    ].filter(Boolean).join("\n"),
  });
}

function normalizeProjectMaterialsFromAgent(materials = {}) {
  return Object.fromEntries(projectMaterialTypes.map((item) => [item.id, String(materials[item.id] || "").trim()]));
}

async function writeProjectMaterialsDraft(materials) {
  const work = getCurrentWork();
  if (!work || !desktopApi?.saveProjectMaterial) {
    openInfoModal(t("ai.title"), t("ai.desktopRequired"));
    return false;
  }
  const normalized = normalizeProjectMaterialsFromAgent(materials);
  const entries = projectMaterialTypes.filter((item) => normalized[item.id]);
  if (entries.length === 0) return false;
  projectMaterialsState.saving = true;
  projectMaterialsState.status = getLanguage() === "en" ? "Writing project materials..." : "正在写入项目资料…";
  updateProjectMaterialsPanel(work);
  try {
    for (const item of entries) {
      await desktopApi.saveProjectMaterial({ workId: work.id, material: item.id, content: normalized[item.id] });
      projectMaterialsState.materials[item.id] = normalized[item.id];
    }
    projectMaterialsState.dirty = false;
    projectMaterialsState.status = t("ai.projectMaterialsWritten");
    state.ui.sidebarSection = "materials";
    state.activeTab = "writing";
    state.ui.leftSidebarCollapsed = false;
    updateAll();
    persist();
    return true;
  } catch (error) {
    console.error("Write project materials draft failed", error);
    projectMaterialsState.status = error?.message || (getLanguage() === "en" ? "Failed to write project materials." : "项目资料写入失败。");
    openInfoModal(t("ai.title"), projectMaterialsState.status);
    return false;
  } finally {
    projectMaterialsState.saving = false;
    updateProjectMaterialsPanel(getCurrentWork());
  }
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

function openFindReplace() {
  state.ui.replaceOpen = true;
  updateWorkspace();
  requestAnimationFrame(() => {
    refs.findQueryInput.focus();
    refs.findQueryInput.select();
  });
}

function closeFindReplace() {
  state.ui.replaceOpen = false;
  updateWorkspace();
  refs.documentEditor?.focus();
}

function focusEditorSearchMatch(query) {
  state.ui.findQuery = query;
  state.ui.replaceOpen = true;
  updateWorkspace();
  requestAnimationFrame(() => {
    refs.findQueryInput.value = query;
    refs.documentEditor.focus();
    selectEditorSearchMatch(query);
  });
}

function selectEditorSearchMatch(query) {
  const content = refs.documentEditor.value;
  const index = content.toLowerCase().indexOf(String(query).toLowerCase());
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
  if (!state.ui.autosaveEnabled || !hasUnsavedChanges()) return;
  autosaveTimer = setTimeout(() => {
    void saveCurrentChapter();
  }, 700);
}

async function saveCurrentChapter(options = {}) {
  clearTimeout(autosaveTimer);
  const chapter = getCurrentChapter();
  const work = getCurrentWork();
  if (!chapter || !work) return;
  const scope = options.scope ?? "all";
  const saveBody = scope === "all" || scope === "body";
  const saveOutline = scope === "all" || scope === "outline";
  const bodyDirty = chapter.dirty;
  const outlineDirty = state.outlineDirty;
  if ((!saveBody || !bodyDirty) && (!saveOutline || !outlineDirty)) return;
  const savedAt = new Date().toISOString();

  if (saveBody && bodyDirty) {
    chapter.savedContent = chapter.content;
    chapter.wordCount = countWords(chapter.content);
    chapter.dirty = false;
    chapter.saveStatus = "已保存";
    chapter.saveTime = timeNow();
  }
  if (saveOutline && outlineDirty) {
    chapter.savedOutline = chapter.outline;
    state.outlineDirty = false;
    state.outlineLastSavedAt = savedAt;
    state.outlineSaveStatus = "已保存";
  }
  chapter.updatedAt = savedAt;
  work.updatedAt = chapter.updatedAt;
  work.lastOpenedChapterId = chapter.id;
  if (saveBody && bodyDirty && (!chapter.versions[0] || chapter.versions[0].content !== chapter.content)) {
    chapter.versions.unshift({ id: uid("version"), label: "自动保存版本", time: `今天 ${timeNow()}`, content: chapter.content });
    chapter.versions = chapter.versions.slice(0, 20);
  }
  const synced = await syncLibraryToDesktop();
  if (!synced && saveBody) {
    chapter.saveStatus = "保存失败";
    chapter.saveTime = "刚刚修改";
  }
  updateTopBar();
  updateWorkspace();
  persist();
}

async function saveCurrentOutline() {
  await saveCurrentChapter({ scope: "outline" });
}

function startFocusTimer() {
  if (focusTimer) return;
  state.ui.focusStartedAt ??= Date.now();
  focusTimer = setInterval(() => {
    updateFocusTimerPanel();
  }, 1000);
  updateFocusTimerPanel();
  persist();
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

function resetFocusTimer() {
  clearInterval(focusTimer);
  focusTimer = null;
  state.ui.focusStartedAt = null;
  state.ui.focusAccumulated = 0;
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
  const copySuffix = getLanguage() === "en" ? " (Copy)" : "（副本）";
  const chapter = createChapterForWork(work.id, `${source.title}${copySuffix}`, {
    chapterTitle: `${source.title}${copySuffix}`,
    content: source.content,
    notes: source.notes,
    outline: source.outline,
  });
  chapter.savedContent = source.savedContent;
  chapter.savedOutline = source.savedOutline ?? source.outline;
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
  return getLanguage() === "en" ? `Chapter ${count + 1}` : `第 ${count + 1} 章`;
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

function handleLibrarySectionDragStart(event) {
  const handle = event.target.closest("[data-library-section-drag-handle]");
  const section = event.target.closest("[data-library-section]");
  if (!handle || !section) return;
  draggedLibrarySectionId = handle.dataset.librarySectionId || section.dataset.librarySection;
  refs.libraryList.classList.add("library-sections-drag-active");
  section.classList.add("dragging");
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedLibrarySectionId);
  }
}

function handleLibrarySectionDragOver(event) {
  const section = event.target.closest("[data-library-section]");
  if (!draggedLibrarySectionId || !section || section.dataset.librarySection === draggedLibrarySectionId) return;
  event.preventDefault();
  const rect = section.getBoundingClientRect();
  const position = event.clientY - rect.top < rect.height / 2 ? "before" : "after";
  refs.libraryList.querySelectorAll("[data-drop-position]").forEach((item) => item.removeAttribute("data-drop-position"));
  section.dataset.dropPosition = position;
}

async function handleLibrarySectionDrop(event) {
  const section = event.target.closest("[data-library-section]");
  if (!draggedLibrarySectionId || !section) return;
  event.preventDefault();
  const targetSectionId = section.dataset.librarySection;
  const rect = section.getBoundingClientRect();
  const placeAfter = event.clientY - rect.top >= rect.height / 2;
  clearLibrarySectionDragIndicators();
  if (targetSectionId === draggedLibrarySectionId) {
    draggedLibrarySectionId = null;
    return;
  }
  const order = getOrderedLibrarySectionIds();
  const sourceIndex = order.indexOf(draggedLibrarySectionId);
  const targetIndex = order.indexOf(targetSectionId);
  if (sourceIndex < 0 || targetIndex < 0) {
    draggedLibrarySectionId = null;
    return;
  }
  let nextIndex = placeAfter ? targetIndex + 1 : targetIndex;
  if (sourceIndex < nextIndex) nextIndex -= 1;
  const moved = moveLibrarySectionToIndex(draggedLibrarySectionId, nextIndex);
  draggedLibrarySectionId = null;
  if (!moved) return;
  updateAll();
  persist();
}

function handleLibrarySectionDragEnd() {
  draggedLibrarySectionId = null;
  clearLibrarySectionDragIndicators();
}

function clearLibrarySectionDragIndicators() {
  refs.libraryList.classList.remove("library-sections-drag-active");
  refs.libraryList.querySelectorAll(".dragging").forEach((item) => item.classList.remove("dragging"));
  refs.libraryList.querySelectorAll("[data-drop-position]").forEach((item) => item.removeAttribute("data-drop-position"));
}

function moveLibrarySectionToIndex(sectionId, targetIndex) {
  const order = getOrderedLibrarySectionIds();
  const currentIndex = order.indexOf(sectionId);
  if (currentIndex < 0) return false;
  const boundedIndex = Math.max(0, Math.min(order.length - 1, targetIndex));
  if (currentIndex === boundedIndex) return false;
  const [moved] = order.splice(currentIndex, 1);
  order.splice(boundedIndex, 0, moved);
  state.ui.librarySectionOrder = order;
  return true;
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
  state.ui.selectedInspirationIds = [];
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

function getFileNameFromPath(filePath) {
  const source = String(filePath || "");
  const normalized = source.split(/[\\/]/).pop() || "";
  return normalized.trim();
}

function getFileStem(fileName) {
  const name = String(fileName || "").trim();
  if (!name) return "";
  return name.replace(/\.[^.]+$/, "");
}

function normalizeTxtContent(text) {
  return String(text ?? "").replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
}

function trimTxtEdges(text) {
  return String(text ?? "").replace(/^\n+/, "").replace(/\n+$/, "");
}

function normalizeFullwidthDigits(value) {
  return String(value ?? "").replace(/[０-９]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xfee0));
}

function normalizeImportedTxtHeadingLine(line) {
  const trimmed = String(line ?? "").replace(/\u3000/g, " ").trim();
  if (!trimmed || trimmed.length > 120) return "";
  return trimmed
    .replace(/^[\s#>*=_\-—~·|｜【［\[\(（《<「『]+/, "")
    .replace(/[\s#>*=_\-—~·|｜】］\]\)）》>」』]+$/, "")
    .trim();
}

function cleanTxtChapterSuffix(value) {
  return String(value ?? "")
    .replace(/^[\s:：\-—~·,，。.!！?？、]+/, "")
    .replace(/[\s:：\-—~·,，。.!！?？、]+$/, "")
    .trim();
}

function isLikelyImportedTxtTitleLine(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed || trimmed.length > 90) return false;
  return !/[。！？!?；;]$/.test(trimmed);
}

function matchImportedTxtChapterHeading(line) {
  const trimmed = normalizeImportedTxtHeadingLine(line);
  if (!trimmed) return null;

  const titleNumberPattern = "([0-9０-９零一二三四五六七八九十百千万两〇○壹贰叁肆伍陆柒捌玖拾佰仟\\s]+)";
  const titleSeparatorPattern = "[\\s:：\\-—~·,，、]+";
  const chapterMatch = trimmed.match(new RegExp(`^第\\s*${titleNumberPattern}\\s*章(?:${titleSeparatorPattern}(.*))?$`));
  if (chapterMatch) {
    const number = normalizeFullwidthDigits(chapterMatch[1]).replace(/\s+/g, "");
    const suffix = cleanTxtChapterSuffix(chapterMatch[2] ?? "");
    if (suffix && !isLikelyImportedTxtTitleLine(suffix)) return null;
    return { title: buildImportedTxtChapterTitle(number, suffix, "章") };
  }

  const specialMatch = trimmed.match(/^(序章|楔子|引子|前言|后记|尾声|终章|番外(?:\s*[0-9０-９一二三四五六七八九十百千零〇两]+)?)(?:[\s:：\-—~·,，。.!！?？、]+(.+))?$/);
  if (specialMatch) {
    const prefix = specialMatch[1].replace(/\s+/g, "");
    const suffix = cleanTxtChapterSuffix(specialMatch[2] ?? "");
    if (suffix && !isLikelyImportedTxtTitleLine(suffix)) return null;
    return { title: suffix ? `${prefix} ${suffix}` : prefix };
  }

  const match = trimmed.match(new RegExp(`^第\\s*${titleNumberPattern}\\s*(回|节|卷|部|篇)(?:${titleSeparatorPattern}(.*))?$`));
  if (match) {
    const number = normalizeFullwidthDigits(match[1]).replace(/\s+/g, "");
    const marker = match[2];
    const suffix = cleanTxtChapterSuffix(match[3] ?? "");
    if (suffix && !isLikelyImportedTxtTitleLine(suffix)) return null;
    return { title: buildImportedTxtChapterTitle(number, suffix, marker) };
  }

  const markerFirstMatch = trimmed.match(new RegExp(`^(卷|部|篇|集)\\s*${titleNumberPattern}(?:${titleSeparatorPattern}(.*))?$`));
  if (markerFirstMatch) {
    const marker = markerFirstMatch[1];
    const number = normalizeFullwidthDigits(markerFirstMatch[2]).replace(/\s+/g, "");
    const suffix = cleanTxtChapterSuffix(markerFirstMatch[3] ?? "");
    if (suffix && !isLikelyImportedTxtTitleLine(suffix)) return null;
    return { title: suffix ? `${marker}${number} ${suffix}` : `${marker}${number}` };
  }

  const orderedTitleMatch = trimmed.match(/^([0-9０-９]{1,4}|[零一二三四五六七八九十百千万两〇○壹贰叁肆伍陆柒捌玖拾佰仟]{1,8})\s*[.．、)]\s*(.{1,80})$/);
  if (orderedTitleMatch) {
    const number = normalizeFullwidthDigits(orderedTitleMatch[1]).replace(/\s+/g, "");
    const suffix = cleanTxtChapterSuffix(orderedTitleMatch[2] ?? "");
    if (!suffix || !isLikelyImportedTxtTitleLine(suffix)) return null;
    return { title: buildImportedTxtChapterTitle(number, suffix, "章") };
  }

  const englishMatch = trimmed.match(/^chapter\s*([0-9０-９]+|[ivxlcdm]+)(?:[\s:：\-—~·,，。.!！?？、]+(.+))?$/i);
  if (!englishMatch) return null;
  const number = normalizeFullwidthDigits(englishMatch[1]).replace(/\s+/g, "");
  const suffix = cleanTxtChapterSuffix(englishMatch[2] ?? "");
  if (suffix && !isLikelyImportedTxtTitleLine(suffix)) return null;
  return { title: suffix ? `Chapter ${number} ${suffix}` : `Chapter ${number}` };
}

function buildImportedTxtChapterTitle(number, suffix, marker = "章") {
  const cleanNumber = String(number || "").trim();
  if (!cleanNumber) return getLanguage() === "en" ? "Chapter 1" : "第一章";
  return suffix ? `第${cleanNumber}${marker} ${suffix}` : `第${cleanNumber}${marker}`;
}

function parseImportedTxtChapters(rawText) {
  const normalized = normalizeTxtContent(rawText);
  if (!normalized.trim()) {
    return { chapters: [], recognizedCount: 0 };
  }

  const sections = [];
  const prefaceLines = [];
  let current = null;
  let recognizedCount = 0;

  for (const line of normalized.split("\n")) {
    const heading = matchImportedTxtChapterHeading(line);
    if (heading) {
      recognizedCount += 1;
      if (current) sections.push(current);
      current = { title: heading.title, lines: [] };
      continue;
    }

    if (current) {
      current.lines.push(line);
    } else {
      prefaceLines.push(line);
    }
  }

  if (current) sections.push(current);

  if (recognizedCount === 0) {
    return {
      chapters: [
        {
          title: getLanguage() === "en" ? "Chapter 1" : "第一章",
          content: trimTxtEdges(normalized),
        },
      ],
      recognizedCount: 0,
    };
  }

  const prefaceText = trimTxtEdges(prefaceLines.join("\n"));
  if (prefaceText && sections.length > 0) {
    sections[0].lines.unshift(prefaceText);
  }

  return {
    chapters: sections.map((section, index) => ({
      title: section.title || buildImportedTxtChapterTitle(String(index + 1), ""),
      content: trimTxtEdges(section.lines.join("\n")),
    })),
    recognizedCount,
  };
}

async function importTxtToNewWork() {
  if (!desktopApi?.openTextFile) {
    openInfoModal(getLanguage() === "en" ? "Import TXT" : "导入 TXT", t("error.importUnavailable"));
    return;
  }

  const result = await desktopApi.openTextFile();
  if (!result || result.canceled || result.content == null) return;

  const parsed = parseImportedTxtChapters(result.content);
  const sourceFileName = getFileNameFromPath(result.filePath) || "imported.txt";
  const workTitle = getFileStem(sourceFileName) || (getLanguage() === "en" ? "Imported TXT" : "TXT 导入");
  openImportTxtPreviewModal({
    result,
    parsed,
    sourceFileName,
    workTitle,
    targetFolderId: state.activeFolderId ?? null,
    appendWorkId: state.route === "editor" && getCurrentWork() ? state.activeWorkId : null,
  });
}

async function createImportedTxtWorkFromPreview(payload) {
  if (!payload?.parsed || !payload?.result) return;
  const { result, parsed, sourceFileName, workTitle } = payload;
  const workId = uid("work");
  const now = new Date().toISOString();
  const targetFolderId = payload.targetFolderId ?? state.activeFolderId ?? null;
  const createdChapters = parsed.chapters.map((chapterData) =>
    createChapterForWork(workId, chapterData.title, {
      content: chapterData.content,
      notes: "",
      outline: "",
    }),
  );

  state.works.unshift({
    id: workId,
    title: workTitle,
    description: getLanguage() === "en" ? `Imported from ${sourceFileName}` : `从 ${sourceFileName} 导入`,
    folderId: targetFolderId,
    chapterIds: createdChapters.map((chapter) => chapter.id),
    updatedAt: now,
    createdAt: now,
    lastOpenedChapterId: createdChapters[0]?.id ?? null,
  });

  state.ui.libraryWorkViewId = workId;
  state.activeWorkId = workId;
  state.activeChapterId = createdChapters[0]?.id ?? null;
  state.route = "editor";
  state.ui.chapterPanelOpen = false;
  state.ui.chapterPanelFocusedId = state.activeChapterId;
  persist();
  updateAll();

  const synced = await syncLibraryToDesktop();
  if (!synced) {
    openInfoModal(
      t("importTxt.successTitle"),
      getLanguage() === "en"
        ? "TXT import finished in the app, but saving it to the work folder failed."
        : "TXT 已在应用中导入完成，但保存到作品文件夹失败。",
    );
    return;
  }

  const copySucceeded = await copyImportedTxtToWork(result, workId, sourceFileName);
  const message = getImportedTxtResultMessage(sourceFileName, parsed, "new-work");
  openInfoModal(
    t("importTxt.successTitle"),
    copySucceeded ? message : `${message} ${t("importTxt.copyFailed")}`,
  );
}

async function appendImportedTxtToCurrentWorkFromPreview(payload) {
  if (!payload?.parsed || !payload?.result) return;
  const { result, parsed, sourceFileName } = payload;
  const work = getWork(payload.appendWorkId) || getCurrentWork();
  if (!work) return;
  const now = new Date().toISOString();
  const createdChapters = parsed.chapters.map((chapterData) =>
    createChapterForWork(work.id, chapterData.title, {
      content: chapterData.content,
      notes: "",
      outline: "",
    }),
  );
  work.chapterIds.push(...createdChapters.map((chapter) => chapter.id));
  work.updatedAt = now;
  work.lastOpenedChapterId = createdChapters[0]?.id ?? work.lastOpenedChapterId;
  state.ui.libraryWorkViewId = work.id;
  state.activeWorkId = work.id;
  state.activeChapterId = createdChapters[0]?.id ?? state.activeChapterId;
  state.route = "editor";
  state.ui.chapterPanelOpen = false;
  state.ui.chapterPanelFocusedId = state.activeChapterId;
  persist();
  updateAll();

  const synced = await syncLibraryToDesktop();
  if (!synced) {
    openInfoModal(
      t("importTxt.successTitle"),
      getLanguage() === "en"
        ? "TXT chapters were added in the app, but saving them to the work folder failed."
        : "TXT 章节已在应用中追加，但保存到作品文件夹失败。",
    );
    return;
  }

  const copySucceeded = await copyImportedTxtToWork(result, work.id, sourceFileName);
  const message = getImportedTxtResultMessage(sourceFileName, parsed, "append-work", work.title);
  openInfoModal(
    t("importTxt.successTitle"),
    copySucceeded ? message : `${message} ${t("importTxt.copyFailed")}`,
  );
}

async function copyImportedTxtToWork(result, workId, sourceFileName) {
  let copySucceeded = Boolean(desktopApi?.storeImportedTextFile);
  try {
    if (desktopApi?.storeImportedTextFile) {
      await desktopApi.storeImportedTextFile({
        sourcePath: result.filePath,
        workId,
        sourceName: sourceFileName,
      });
    }
  } catch (error) {
    copySucceeded = false;
    console.error("Failed to copy imported TXT", error);
  }
  return copySucceeded;
}

function getImportedTxtResultMessage(sourceFileName, parsed, mode, workTitle = "") {
  const chapterCount = parsed.chapters.length;
  if (mode === "append-work") {
    return parsed.recognizedCount > 0
      ? (getLanguage() === "en"
          ? `Imported from “${sourceFileName}”. Added ${chapterCount} chapters to “${workTitle}”, and copied the original TXT into the work folder.`
          : `已从“${sourceFileName}”导入，向《${workTitle}》追加 ${chapterCount} 章，原始 TXT 已复制到该作品文件夹。`)
      : (getLanguage() === "en"
          ? `Imported from “${sourceFileName}”. No chapter headings were found, so one chapter was added to “${workTitle}”. The original TXT was copied into the work folder.`
          : `已从“${sourceFileName}”导入，未识别到章节标题，已向《${workTitle}》追加 1 章，原始 TXT 已复制到该作品文件夹。`);
  }
  return parsed.recognizedCount > 0
    ? (getLanguage() === "en"
        ? `Imported from “${sourceFileName}”. Recognized ${chapterCount} chapters, and the original TXT was copied into the work folder.`
        : `已从“${sourceFileName}”导入，共识别到 ${chapterCount} 章，原始 TXT 已复制到该作品文件夹。`)
    : (getLanguage() === "en"
        ? `Imported from “${sourceFileName}”. No chapter headings were found, so the file was imported as one chapter. The original TXT was copied into the work folder.`
        : `已从“${sourceFileName}”导入，未识别到章节标题，已作为 1 章导入，原始 TXT 已复制到该作品文件夹。`);
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

async function importTextToCurrentChapter() {
  const chapter = getCurrentChapter();
  if (!chapter) return;
  if (!desktopApi?.openTextFile) {
    state.ui.modal = {
      type: "text-import-unavailable",
      title: getLanguage() === "en" ? "Import TXT" : "导入 TXT",
      message:
        getLanguage() === "en"
          ? "TXT import is available in the desktop app."
          : "TXT 导入功能仅在桌面应用中可用。",
      actions: [{ id: "close-modal", label: getLanguage() === "en" ? "Close" : "关闭", primary: true }],
    };
    updateModal();
    return;
  }

  const result = await desktopApi.openTextFile();
  if (!result || result.canceled || result.content == null) return;
  const importedText = String(result.content);
  if (chapter.content.trim()) {
    openImportTextConflictModal(importedText);
    return;
  }
  applyImportedTextToCurrentChapter(importedText, "replace");
}

function applyImportedTextToCurrentChapter(importedText, mode) {
  const chapter = getCurrentChapter();
  if (!chapter) return;
  const current = chapter.content || "";
  const separator = current && !current.endsWith("\n") ? "\n\n" : "";
  const nextContent = mode === "append" ? `${current}${separator}${importedText}` : importedText;
  refs.documentEditor.value = nextContent;
  refs.documentEditor.focus();
  refs.documentEditor.selectionStart = nextContent.length;
  refs.documentEditor.selectionEnd = nextContent.length;
  handleEditorInput();
  captureSelection();
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
  if (!desktopApi?.openProjectFile) {
    openInfoModal(getLanguage() === "en" ? "Import Project" : "导入项目", t("error.importUnavailable"));
    return;
  }
  const result = await desktopApi.openProjectFile();
  if (!result || result.canceled) return;
  if (!result.content) {
    openInfoModal(getLanguage() === "en" ? "Import Project" : "导入项目", getLanguage() === "en" ? "The selected project file is empty." : "选择的项目文件为空。");
    return;
  }
  try {
    const imported = JSON.parse(result.content);
    const importedStats = getLibraryContentStats(imported);
    const currentStats = getLibraryContentStats();
    if (importedStats.workCount + importedStats.chapterCount + importedStats.folderCount + importedStats.inspirationCount === 0) {
      openInfoModal(
        getLanguage() === "en" ? "Import Project" : "导入项目",
        getLanguage() === "en"
          ? "The selected project file does not contain any library data."
          : "选择的项目文件不包含可导入的作品库数据。",
      );
      return;
    }
    if (currentStats.folderCount + currentStats.workCount + currentStats.chapterCount + currentStats.inspirationCount > 0) {
      openImportProjectConflictModal(imported);
      return;
    }
    applyLibraryState(imported);
    ensureStateIntegrity();
    await syncLibraryToDesktop();
    updateAll();
  } catch (error) {
    console.error("Failed to import project file", error);
    state.ui.modal = {
      type: "import-error",
      title: getLanguage() === "en" ? "Import Failed" : "导入失败",
      message: getLanguage() === "en" ? "The project file format is not recognized. Make sure it is a valid exported Jian Ji file." : "项目文件格式无法识别，请确认它是有效的简纪导出文件。",
      actions: [{ id: "close-modal", label: getLanguage() === "en" ? "Close" : "关闭", primary: true }],
    };
    updateModal();
  }
}

async function handleDesktopMenuAction(action) {
  if (action === "import-text") {
    await importTxtToNewWork();
    return;
  }
  if (action === "import-project") {
    await importProjectFile();
    return;
  }
  if (action === "export-project") {
    openProjectExportPreview();
    return;
  }
  if (action === "reset-project") {
    openResetProjectModal();
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

function getRecentEditedChapters(limit = 4) {
  return state.chapters
    .map((chapter) => ({ chapter, work: getWork(chapter.workId) }))
    .filter(({ chapter, work }) => work && work.chapterIds.includes(chapter.id))
    .sort((left, right) => normalizeIsoDate(right.chapter.updatedAt).localeCompare(normalizeIsoDate(left.chapter.updatedAt)))
    .slice(0, limit);
}

function getFullTextSearchResults(query, limit = 12) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return [];
  return state.chapters
    .map((chapter) => {
      const work = getWork(chapter.workId);
      if (!work || !work.chapterIds.includes(chapter.id)) return null;
      const match = getChapterSearchMatch(chapter, work, keyword);
      if (!match) return null;
      return { chapter, work, ...match };
    })
    .filter(Boolean)
    .sort((left, right) => normalizeIsoDate(right.chapter.updatedAt).localeCompare(normalizeIsoDate(left.chapter.updatedAt)))
    .slice(0, limit);
}

function getChapterSearchMatch(chapter, work, keyword) {
  const fields = [
    { label: getLanguage() === "en" ? "Chapter" : "章节", value: chapter.title },
    { label: getLanguage() === "en" ? "Work" : "作品", value: work.title },
    { label: getLanguage() === "en" ? "Body" : "正文", value: chapter.content },
    { label: getLanguage() === "en" ? "Notes" : "备注", value: chapter.notes },
    { label: getLanguage() === "en" ? "Outline" : "大纲", value: chapter.outline },
  ];
  for (const field of fields) {
    const value = String(field.value || "");
    const index = value.toLowerCase().indexOf(keyword);
    if (index !== -1) {
      return {
        field: field.label,
        snippet: getSearchSnippet(value, index, keyword.length),
      };
    }
  }
  return null;
}

function getSearchSnippet(value, index, length) {
  const source = String(value || "").replace(/\s+/g, " ").trim();
  if (!source) return "";
  const normalizedIndex = source.toLowerCase().indexOf(String(value || "").slice(index, index + length).toLowerCase());
  const safeIndex = Math.max(0, Math.min(normalizedIndex === -1 ? index : normalizedIndex, source.length));
  const start = Math.max(0, safeIndex - 36);
  const end = Math.min(source.length, safeIndex + length + 56);
  return `${start > 0 ? "..." : ""}${source.slice(start, end)}${end < source.length ? "..." : ""}`;
}

function getWorkWordCount(workId) {
  return getWorkChapters(workId).reduce((sum, chapter) => sum + (chapter.wordCount || countWords(chapter.content)), 0);
}

function getProjectExportStats() {
  return {
    folderCount: state.folders.length,
    workCount: state.works.length,
    chapterCount: state.chapters.length,
    wordCount: state.chapters.reduce((sum, chapter) => sum + countWords(chapter.content), 0),
    inspirationCount: getAllInspirations().length,
  };
}

function getFolderPath(folderId) {
  const path = [{ id: null, name: t("library.allWorks") }];
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
    options.push(`<option value="">${t("library.root")}</option>`);
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
      "#modal-chapter-title, #modal-work-title, #modal-folder-name, #modal-rename-value, #modal-inspiration-category-name",
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
  if (Number.isNaN(time)) return getLanguage() === "en" ? "just now" : "刚刚";
  const diff = Date.now() - time;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return getLanguage() === "en" ? "just now" : "刚刚";
  if (minutes < 60) return getLanguage() === "en" ? `${minutes}m ago` : `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return getLanguage() === "en" ? `${hours}h ago` : `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  return getLanguage() === "en" ? `${days}d ago` : `${days} 天前`;
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
