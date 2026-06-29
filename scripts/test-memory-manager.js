const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const { createMemoryManager, normalizeMemory } = require("../memory-manager");

async function main() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "jian-ji-memory-manager-"));
  try {
    const manager = createMemoryManager({ projectsRoot: root });
    const memory = await manager.loadMemory("work-1");
    assert.equal(memory.version, 1);
    assert.equal(memory.project_summary, "");
    assert.deepEqual(memory.chapter_summaries, {});
    assert.deepEqual(memory.characters_state, {});
    assert.deepEqual(memory.world_facts, []);
    assert.deepEqual(memory.foreshadowing, []);
    assert.deepEqual(memory.unresolved_threads, []);
    assert.deepEqual(memory.style_notes, []);

    const migrated = normalizeMemory({
      summary: "旧项目概要",
      characters: ["林秋：主角"],
      world: ["旧港有雾"],
      preferences: ["克制叙述"],
    });
    assert.equal(migrated.project_summary, "旧项目概要");
    assert.equal(migrated.characters_state["legacy-1"].notes, "林秋：主角");
    assert.deepEqual(migrated.world_facts, ["旧港有雾"]);
    assert.deepEqual(migrated.style_notes, ["克制叙述"]);

    await manager.saveMemory("work-1", {
      project_summary: "寻找失踪姐姐的长篇故事。",
      characters_state: { lin_qiu: { name: "林秋", goal: "寻找姐姐" } },
      world_facts: ["旧港常年大雾"],
      foreshadowing: ["旅馆灯会在关键时刻熄灭"],
      unresolved_threads: ["姐姐为何失踪"],
      style_notes: ["第三人称有限视角"],
    });
    await manager.updateChapterSummary("work-1", "chapter-1", "林秋抵达旧港。", { title: "第一章" });
    await manager.updateChapterSummary("work-1", "chapter-2", "林秋发现旅馆账本。", { title: "第二章" });

    const updated = await manager.loadMemory("work-1");
    assert.equal(updated.project_summary, "寻找失踪姐姐的长篇故事。");
    assert.equal(updated.chapter_summaries["chapter-1"].title, "第一章");
    assert.equal(updated.chapter_summaries["chapter-2"].summary, "林秋发现旅馆账本。");

    const context = await manager.getContextForChapter("work-1", "chapter-2");
    assert.equal(context.project_summary, "寻找失踪姐姐的长篇故事。");
    assert.equal(context.current_chapter_summary.summary, "林秋发现旅馆账本。");
    assert.equal(context.previous_chapter_summaries.length, 1);
    assert.equal(context.previous_chapter_summaries[0].summary, "林秋抵达旧港。");
    assert.equal(context.characters_state.lin_qiu.goal, "寻找姐姐");
    assert.deepEqual(context.world_facts, ["旧港常年大雾"]);

    await assert.rejects(() => manager.loadMemory("../outside"), /Invalid workId/);
    await assert.rejects(() => manager.updateChapterSummary("work-1", "", ""), /chapterId is required/);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
}

main()
  .then(() => {
    console.log("Memory manager tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
