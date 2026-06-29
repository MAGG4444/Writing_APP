const { createProjectManager } = require("./project-manager");
const { createMemoryManager, normalizeMemory } = require("./memory-manager");

function createToolManager({ projectsRoot, loadLibrary, saveLibrary }) {
  if (!projectsRoot) throw new Error("projectsRoot is required");
  if (typeof loadLibrary !== "function") throw new Error("loadLibrary is required");
  if (typeof saveLibrary !== "function") throw new Error("saveLibrary is required");

  const projectManager = createProjectManager({ projectsRoot });
  const memoryManager = createMemoryManager({ projectsRoot });

  function normalizeProjectId(projectId) {
    const id = String(projectId || "").trim();
    if (!id) throw new Error("project_id is required");
    return id;
  }

  function normalizeChapterNumber(chapterNumber) {
    const number = Number(chapterNumber);
    if (!Number.isInteger(number) || number < 1) {
      throw new Error("chapter_number must be a positive integer");
    }
    return number;
  }

  async function getLibraryProject(projectId) {
    const id = normalizeProjectId(projectId);
    const library = await loadLibrary();
    const work = (library.works || []).find((item) => item.id === id);
    if (!work) throw new Error(`Project not found: ${id}`);
    const chapterMap = new Map((library.chapters || []).map((chapter) => [chapter.id, chapter]));
    const chapters = (work.chapterIds || [])
      .map((chapterId) => chapterMap.get(chapterId))
      .filter(Boolean);
    return { id, library, work, chapters };
  }

  async function getChapterByNumber(projectId, chapterNumber) {
    const project = await getLibraryProject(projectId);
    const number = normalizeChapterNumber(chapterNumber);
    const chapter = project.chapters[number - 1];
    if (!chapter) throw new Error(`Chapter not found: ${number}`);
    return { ...project, chapterNumber: number, chapter };
  }

  function summarizeChapter(chapter, index) {
    return {
      chapter_number: index + 1,
      chapter_id: chapter.id,
      title: chapter.title,
      word_count: countWords(chapter.content),
      updated_at: chapter.updatedAt || "",
    };
  }

  async function read_project_context(projectId) {
    const project = await getLibraryProject(projectId);
    await projectManager.ensureProject(project.id);
    const materialsProject = await projectManager.readProject(project.id);
    const memory = await memoryManager.loadMemory(project.id);
    return {
      project_id: project.id,
      title: project.work.title || "",
      description: project.work.description || "",
      materials: materialsProject.materials,
      memory,
      chapters: project.chapters.map(summarizeChapter),
      material_chapter_files: materialsProject.chapters,
    };
  }

  async function read_chapter(projectId, chapterNumber) {
    const project = await getChapterByNumber(projectId, chapterNumber);
    return {
      project_id: project.id,
      chapter_number: project.chapterNumber,
      chapter_id: project.chapter.id,
      title: project.chapter.title || "",
      content: project.chapter.content || "",
      notes: project.chapter.notes || "",
      outline: project.chapter.outline || "",
      word_count: countWords(project.chapter.content),
      updated_at: project.chapter.updatedAt || "",
    };
  }

  async function save_chapter(projectId, chapterNumber, content) {
    const project = await getChapterByNumber(projectId, chapterNumber);
    const nextContent = String(content ?? "");
    const updatedAt = new Date().toISOString();
    const updatedChapter = {
      ...project.chapter,
      content: nextContent,
      savedContent: nextContent,
      wordCount: countWords(nextContent),
      updatedAt,
      dirty: false,
      saveStatus: "已保存",
      saveTime: "刚刚",
    };
    const chapters = (project.library.chapters || []).map((chapter) =>
      chapter.id === updatedChapter.id ? updatedChapter : chapter,
    );
    const works = (project.library.works || []).map((work) =>
      work.id === project.id ? { ...work, updatedAt, lastOpenedChapterId: updatedChapter.id } : work,
    );
    await saveLibrary({ ...project.library, works, chapters });
    return {
      project_id: project.id,
      chapter_number: project.chapterNumber,
      chapter_id: updatedChapter.id,
      title: updatedChapter.title || "",
      word_count: updatedChapter.wordCount,
      updated_at: updatedAt,
    };
  }

  async function list_chapters(projectId) {
    const project = await getLibraryProject(projectId);
    return {
      project_id: project.id,
      chapters: project.chapters.map(summarizeChapter),
    };
  }

  async function search_project_notes(projectId, keyword) {
    const project = await getLibraryProject(projectId);
    const term = String(keyword || "").trim();
    if (!term) throw new Error("keyword is required");
    await projectManager.ensureProject(project.id);
    const materialsProject = await projectManager.readProject(project.id);
    const results = [];

    project.chapters.forEach((chapter, index) => {
      addSearchResult(results, {
        source_type: "chapter_title",
        text: chapter.title,
        keyword: term,
        project_id: project.id,
        chapter_number: index + 1,
        chapter_id: chapter.id,
        title: chapter.title || "",
      });
      addSearchResult(results, {
        source_type: "chapter_notes",
        text: chapter.notes,
        keyword: term,
        project_id: project.id,
        chapter_number: index + 1,
        chapter_id: chapter.id,
        title: chapter.title || "",
      });
      addSearchResult(results, {
        source_type: "chapter_outline",
        text: chapter.outline,
        keyword: term,
        project_id: project.id,
        chapter_number: index + 1,
        chapter_id: chapter.id,
        title: chapter.title || "",
      });
    });

    Object.entries(materialsProject.materials || {}).forEach(([material, text]) => {
      addSearchResult(results, {
        source_type: "project_material",
        text,
        keyword: term,
        project_id: project.id,
        material,
      });
    });

    return {
      project_id: project.id,
      keyword: term,
      results,
    };
  }

  async function update_memory(projectId, data) {
    const project = await getLibraryProject(projectId);
    await projectManager.ensureProject(project.id);
    const existing = await memoryManager.loadMemory(project.id);
    const source = data && typeof data === "object" && !Array.isArray(data) ? data : {};
    return memoryManager.saveMemory(project.id, mergeMemoryUpdate(existing, source));
  }

  async function get_previous_chapter_summaries(projectId, limit = 3, beforeChapterNumber = null) {
    const project = await getLibraryProject(projectId);
    await projectManager.ensureProject(project.id);
    const memory = await memoryManager.loadMemory(project.id);
    const max = Number(limit) > 0 ? Math.floor(Number(limit)) : 3;
    const beforeNumber = Number(beforeChapterNumber);
    const hasBeforeNumber = Number.isInteger(beforeNumber) && beforeNumber > 0;
    const chapterLimit = hasBeforeNumber ? Math.max(0, beforeNumber - 1) : project.chapters.length;
    const orderedSummaries = project.chapters
      .slice(0, chapterLimit)
      .map((chapter, index) => memory.chapter_summaries?.[chapter.id] || memory.chapter_summaries?.[`chapter-${index + 1}`])
      .filter(Boolean);
    return {
      project_id: project.id,
      limit: max,
      before_chapter_number: hasBeforeNumber ? beforeNumber : null,
      summaries: orderedSummaries.slice(-max),
    };
  }

  return {
    read_project_context,
    read_chapter,
    save_chapter,
    list_chapters,
    search_project_notes,
    update_memory,
    get_previous_chapter_summaries,
  };
}

function countWords(text) {
  const source = String(text || "").trim();
  if (!source) return 0;
  const cjkCount = (source.match(/[\u3400-\u9fff]/g) || []).length;
  const latinCount = source
    .replace(/[\u3400-\u9fff]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return cjkCount + latinCount;
}

function addSearchResult(results, { text, keyword, ...meta }) {
  const source = String(text || "");
  const index = source.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase());
  if (index < 0) return;
  results.push({
    ...meta,
    snippet: createSnippet(source, index, keyword.length),
  });
}

function createSnippet(text, index, length) {
  const start = Math.max(0, index - 30);
  const end = Math.min(text.length, index + length + 30);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < text.length ? "..." : "";
  return `${prefix}${text.slice(start, end)}${suffix}`;
}

function mergeMemoryUpdate(existing, update) {
  const normalizedExisting = normalizeMemory(existing);
  const normalizedUpdate = normalizeMemory(update);
  return normalizeMemory({
    ...normalizedExisting,
    ...normalizedUpdate,
    project_summary:
      Object.hasOwn(update, "project_summary") || Object.hasOwn(update, "summary")
        ? normalizedUpdate.project_summary
        : normalizedExisting.project_summary,
    chapter_summaries: {
      ...normalizedExisting.chapter_summaries,
      ...normalizedUpdate.chapter_summaries,
    },
    characters_state: {
      ...normalizedExisting.characters_state,
      ...normalizedUpdate.characters_state,
    },
    world_facts: Object.hasOwn(update, "world_facts") || Object.hasOwn(update, "world")
      ? normalizedUpdate.world_facts
      : normalizedExisting.world_facts,
    foreshadowing: Object.hasOwn(update, "foreshadowing")
      ? normalizedUpdate.foreshadowing
      : normalizedExisting.foreshadowing,
    unresolved_threads: Object.hasOwn(update, "unresolved_threads")
      ? normalizedUpdate.unresolved_threads
      : normalizedExisting.unresolved_threads,
    style_notes: Object.hasOwn(update, "style_notes") || Object.hasOwn(update, "preferences")
      ? normalizedUpdate.style_notes
      : normalizedExisting.style_notes,
  });
}

module.exports = {
  createToolManager,
};
