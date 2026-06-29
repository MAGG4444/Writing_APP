const path = require("node:path");
const fs = require("node:fs/promises");

const DEFAULT_MEMORY = {
  version: 1,
  project_summary: "",
  chapter_summaries: {},
  characters_state: {},
  world_facts: [],
  foreshadowing: [],
  unresolved_threads: [],
  style_notes: [],
  updated_at: "",
};

function createMemoryManager({ projectsRoot }) {
  if (!projectsRoot) throw new Error("projectsRoot is required");
  const resolvedRoot = path.resolve(projectsRoot);

  function getProjectDirectory(workId) {
    const id = String(workId || "").trim();
    if (!id) throw new Error("workId is required");
    if (id === "." || id === ".." || id.includes("/") || id.includes("\\")) {
      throw new Error("Invalid workId");
    }
    const directory = path.resolve(resolvedRoot, id);
    if (!directory.startsWith(`${resolvedRoot}${path.sep}`)) {
      throw new Error("Invalid workId");
    }
    return directory;
  }

  function getMemoryPath(workId) {
    return path.join(getProjectDirectory(workId), "memory.json");
  }

  async function ensureMemoryFile(workId) {
    const directory = getProjectDirectory(workId);
    await fs.mkdir(directory, { recursive: true });
    const memoryPath = getMemoryPath(workId);
    try {
      await fs.access(memoryPath);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      await fs.writeFile(memoryPath, JSON.stringify(DEFAULT_MEMORY, null, 2), "utf8");
    }
  }

  async function loadMemory(workId) {
    await ensureMemoryFile(workId);
    try {
      const raw = await fs.readFile(getMemoryPath(workId), "utf8");
      return normalizeMemory(JSON.parse(raw));
    } catch (error) {
      if (error instanceof SyntaxError) return { ...DEFAULT_MEMORY };
      throw error;
    }
  }

  async function saveMemory(workId, memory) {
    await ensureMemoryFile(workId);
    const normalized = {
      ...normalizeMemory(memory),
      updated_at: new Date().toISOString(),
    };
    await fs.writeFile(getMemoryPath(workId), JSON.stringify(normalized, null, 2), "utf8");
    return normalized;
  }

  async function updateChapterSummary(workId, chapterId, summary, meta = {}) {
    const id = String(chapterId || "").trim();
    if (!id) throw new Error("chapterId is required");
    const memory = await loadMemory(workId);
    memory.chapter_summaries[id] = {
      chapter_id: id,
      title: String(meta.title || memory.chapter_summaries[id]?.title || ""),
      summary: String(summary || ""),
      updated_at: new Date().toISOString(),
    };
    return saveMemory(workId, memory);
  }

  async function getContextForChapter(workId, chapterId, options = {}) {
    const memory = await loadMemory(workId);
    const id = String(chapterId || "").trim();
    const limit = Number(options.previousLimit) > 0 ? Number(options.previousLimit) : 5;
    const chapterEntries = Object.entries(memory.chapter_summaries);
    const currentIndex = chapterEntries.findIndex(([entryId]) => entryId === id);
    const previousEntries = currentIndex >= 0 ? chapterEntries.slice(Math.max(0, currentIndex - limit), currentIndex) : chapterEntries.slice(-limit);
    return {
      project_summary: memory.project_summary,
      current_chapter_summary: id ? memory.chapter_summaries[id] ?? null : null,
      previous_chapter_summaries: previousEntries.map(([, value]) => value),
      characters_state: memory.characters_state,
      world_facts: memory.world_facts,
      foreshadowing: memory.foreshadowing,
      unresolved_threads: memory.unresolved_threads,
      style_notes: memory.style_notes,
    };
  }

  return {
    loadMemory,
    saveMemory,
    updateChapterSummary,
    getContextForChapter,
  };
}

function normalizeStringArray(value) {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];
}

function normalizeRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeChapterSummaries(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).map(([chapterId, item]) => {
      if (typeof item === "string") {
        return [chapterId, { chapter_id: chapterId, title: "", summary: item, updated_at: "" }];
      }
      const source = normalizeRecord(item);
      return [
        chapterId,
        {
          chapter_id: String(source.chapter_id || chapterId),
          title: String(source.title || ""),
          summary: String(source.summary || ""),
          updated_at: String(source.updated_at || source.updatedAt || ""),
        },
      ];
    }),
  );
}

function normalizeMemory(value) {
  const source = normalizeRecord(value);
  const legacyCharacters = Array.isArray(source.characters)
    ? Object.fromEntries(source.characters.map((item, index) => [`legacy-${index + 1}`, { notes: String(item) }]))
    : {};
  return {
    version: 1,
    project_summary: String(source.project_summary ?? source.summary ?? ""),
    chapter_summaries: normalizeChapterSummaries(source.chapter_summaries),
    characters_state: Object.keys(normalizeRecord(source.characters_state)).length > 0 ? normalizeRecord(source.characters_state) : legacyCharacters,
    world_facts: normalizeStringArray(source.world_facts ?? source.world),
    foreshadowing: normalizeStringArray(source.foreshadowing),
    unresolved_threads: normalizeStringArray(source.unresolved_threads),
    style_notes: normalizeStringArray(source.style_notes ?? source.preferences),
    updated_at: String(source.updated_at ?? source.updatedAt ?? ""),
  };
}

module.exports = {
  DEFAULT_MEMORY,
  createMemoryManager,
  normalizeMemory,
};
