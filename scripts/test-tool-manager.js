const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const { createProjectManager } = require("../project-manager");
const { createToolManager } = require("../tool-manager");

async function main() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "jian-ji-tool-manager-"));
  try {
    let library = {
      folders: [],
      works: [
        {
          id: "work-1",
          title: "旧港来信",
          description: "寻找失踪姐姐的长篇故事。",
          chapterIds: ["chapter-1", "chapter-2"],
          updatedAt: "2026-01-01T00:00:00.000Z",
          createdAt: "2026-01-01T00:00:00.000Z",
          lastOpenedChapterId: "chapter-1",
        },
      ],
      chapters: [
        {
          id: "chapter-1",
          workId: "work-1",
          title: "第一章 雾港",
          content: "林秋抵达旧港。",
          savedContent: "林秋抵达旧港。",
          notes: "主角抵达旧港，寻找姐姐。",
          outline: "抵达，遇见旅馆老板。",
          wordCount: 7,
          updatedAt: "2026-01-01T00:00:00.000Z",
          createdAt: "2026-01-01T00:00:00.000Z",
          dirty: false,
          saveStatus: "已保存",
          saveTime: "刚刚",
        },
        {
          id: "chapter-2",
          workId: "work-1",
          title: "第二章 账本",
          content: "她发现一本旧账本。",
          savedContent: "她发现一本旧账本。",
          notes: "账本暗示姐姐曾经住在这里。",
          outline: "调查旅馆。",
          wordCount: 9,
          updatedAt: "2026-01-01T00:00:00.000Z",
          createdAt: "2026-01-01T00:00:00.000Z",
          dirty: false,
          saveStatus: "已保存",
          saveTime: "刚刚",
        },
      ],
      inspirations: { categoryOrder: [], itemsByWork: {} },
    };

    const projectManager = createProjectManager({ projectsRoot: root });
    await projectManager.ensureProject("work-1");
    await projectManager.saveProjectMaterial("work-1", "world", "# World\n\n旧港常年有雾。\n");
    await projectManager.saveProjectMaterial("work-1", "goals", "# Goals\n\n预计 30 章，每章 3000 字。\n");

    const manager = createToolManager({
      projectsRoot: root,
      loadLibrary: async () => library,
      saveLibrary: async (nextLibrary) => {
        library = nextLibrary;
      },
    });

    const chapters = await manager.list_chapters("work-1");
    assert.equal(chapters.project_id, "work-1");
    assert.equal(chapters.chapters.length, 2);
    assert.equal(chapters.chapters[0].chapter_number, 1);
    assert.equal(chapters.chapters[0].title, "第一章 雾港");

    const chapter = await manager.read_chapter("work-1", 2);
    assert.equal(chapter.chapter_id, "chapter-2");
    assert.equal(chapter.content, "她发现一本旧账本。");
    assert.equal(chapter.notes, "账本暗示姐姐曾经住在这里。");

    const saved = await manager.save_chapter("work-1", 2, "她翻开账本，看见姐姐的名字。");
    assert.equal(saved.chapter_id, "chapter-2");
    assert.equal(library.chapters[1].content, "她翻开账本，看见姐姐的名字。");
    assert.equal(library.chapters[1].savedContent, "她翻开账本，看见姐姐的名字。");
    assert.equal(library.chapters[1].dirty, false);
    assert.equal(library.works[0].lastOpenedChapterId, "chapter-2");

    const notesSearch = await manager.search_project_notes("work-1", "姐姐");
    assert.ok(notesSearch.results.some((result) => result.source_type === "chapter_notes"));
    assert.ok(notesSearch.results.some((result) => result.snippet.includes("姐姐")));

    const worldSearch = await manager.search_project_notes("work-1", "旧港");
    assert.ok(worldSearch.results.some((result) => result.source_type === "project_material" && result.material === "world"));

    const memory = await manager.update_memory("work-1", {
      project_summary: "林秋在旧港寻找姐姐。",
      chapter_summaries: {
        "chapter-1": { title: "第一章 雾港", summary: "林秋抵达旧港。", updated_at: "2026-01-01T00:00:00.000Z" },
        "chapter-2": { title: "第二章 账本", summary: "林秋发现账本线索。", updated_at: "2026-01-02T00:00:00.000Z" },
      },
      style_notes: ["克制叙述"],
    });
    assert.equal(memory.project_summary, "林秋在旧港寻找姐姐。");
    assert.equal(memory.chapter_summaries["chapter-2"].summary, "林秋发现账本线索。");

    const mergedMemory = await manager.update_memory("work-1", {
      chapter_summaries: {
        "chapter-3": { title: "第三章 暗号", summary: "林秋发现新的暗号。", updated_at: "2026-01-03T00:00:00.000Z" },
      },
    });
    assert.equal(mergedMemory.chapter_summaries["chapter-1"].summary, "林秋抵达旧港。");
    assert.equal(mergedMemory.chapter_summaries["chapter-3"].summary, "林秋发现新的暗号。");
    assert.equal(mergedMemory.project_summary, "林秋在旧港寻找姐姐。");

    const previous = await manager.get_previous_chapter_summaries("work-1", 1);
    assert.equal(previous.project_id, "work-1");
    assert.equal(previous.summaries.length, 1);
    assert.equal(previous.summaries[0].summary, "林秋发现账本线索。");

    const previousBeforeFirst = await manager.get_previous_chapter_summaries("work-1", 3, 1);
    assert.equal(previousBeforeFirst.before_chapter_number, 1);
    assert.equal(previousBeforeFirst.summaries.length, 0);

    const previousBeforeSecond = await manager.get_previous_chapter_summaries("work-1", 3, 2);
    assert.equal(previousBeforeSecond.before_chapter_number, 2);
    assert.equal(previousBeforeSecond.summaries.length, 1);
    assert.equal(previousBeforeSecond.summaries[0].summary, "林秋抵达旧港。");

    const context = await manager.read_project_context("work-1");
    assert.equal(context.title, "旧港来信");
    assert.equal(context.description, "寻找失踪姐姐的长篇故事。");
    assert.match(context.materials.world, /旧港常年有雾/);
    assert.match(context.materials.goals, /每章 3000 字/);
    assert.equal(context.memory.project_summary, "林秋在旧港寻找姐姐。");
    assert.equal(context.chapters.length, 2);

    await assert.rejects(() => manager.read_chapter("work-1", 0), /chapter_number must be a positive integer/);
    await assert.rejects(() => manager.read_project_context("missing"), /Project not found/);
    await assert.rejects(() => manager.update_memory("missing", { project_summary: "孤立记忆" }), /Project not found/);
    await assert.rejects(() => manager.get_previous_chapter_summaries("missing"), /Project not found/);
    await assert.rejects(() => manager.search_project_notes("work-1", ""), /keyword is required/);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
}

main()
  .then(() => {
    console.log("Tool manager tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
