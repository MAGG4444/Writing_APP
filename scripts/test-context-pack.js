const assert = require("node:assert/strict");

const { buildChapterContextPack, buildContextPackEstimates, buildRelevantMemoryPack } = require("../agent/context/chapter-context-pack");

const project = {
  materials: {
    outline: "# Outline\n\n主角调查旧港。",
    characters: "# Characters\n\n林秋：寻找姐姐。",
    world: "# World\n\n旧港常年有雾。",
    style: "# Style\n\n克制悬疑。",
  },
};

const sceneOutline = [
  {
    scene_title: "查账本",
    scene_goal: "找到姐姐名字",
    characters: ["林秋"],
    conflict: "账本被藏起",
    expected_turning_point: "名字出现",
    target_word_count: 500,
  },
];

const previousSummaries = [
  { chapter_id: "chapter-1", title: "第一章", summary: "林秋抵达旧港。" },
  { chapter_id: "chapter-2", title: "第二章", summary: "林秋找到旅馆。" },
  { chapter_id: "chapter-3", title: "第三章", summary: "林秋听见姐姐名字。" },
  { chapter_id: "chapter-4", title: "第四章", summary: "林秋发现账本。" },
];

const memory = {
  project_summary: "长篇项目摘要：林秋正在旧港追查姐姐失踪案。",
  chapter_summaries: {
    "chapter-1": { chapter_id: "chapter-1", title: "第一章", summary: "林秋抵达旧港。" },
  },
  foreshadowing: ["姐姐留下的红线尚未解释", "旅馆账本的缺页反复出现"],
  unresolved_threads: ["姐姐失踪真相", "陈墨为何隐瞒账本"],
  characters_state: {
    "林秋": { goal: "寻找姐姐", emotion: "克制但焦虑" },
    "陈墨": "表面帮忙，真实立场未知",
  },
  world_facts: ["旧港常年有雾", "码头账本记录暗线"],
  reports: { should_not: "appear" },
  metadata: { should_not: "appear" },
  llm_events: [{ should_not: "appear" }],
  craft_rules: [{ should_not: "appear" }],
};

function main() {
  const planner = buildChapterContextPack({
    project,
    previousSummaries,
    chapterGoal: "写一章调查账本。",
    chapterTitle: "第五章",
    targetWordCount: 500,
    step: "planner",
  });
  assert.equal(planner.context_type, "planner_context");
  assert.equal(planner.included_sections.includes("outline"), true);
  assert.equal(planner.content.recent_chapter_summaries.length, 3);
  assert.equal(planner.estimated_tokens, Math.ceil(planner.char_count * 0.8));

  const sceneWriter = buildChapterContextPack({
    project,
    previousSummaries,
    scene: sceneOutline[0],
    sceneOutline,
    step: "scene_writer",
  });
  assert.equal(sceneWriter.context_type, "scene_writer_context");
  assert.equal(sceneWriter.included_sections.includes("current_scene"), true);
  assert.equal(sceneWriter.included_sections.includes("characters"), true);
  assert.equal(sceneWriter.omitted_sections.includes("full_memory"), true);

  const audit = buildChapterContextPack({
    chapterContent: "林秋翻开账本，看见姐姐名字。",
    chapterGoal: "检查是否收束。",
    chapterTitle: "第五章",
    targetWordCount: 500,
    sceneOutline,
    step: "audit",
  });
  assert.equal(audit.context_type, "audit_context");
  assert.equal(audit.content.content_to_audit, "林秋翻开账本，看见姐姐名字。");
  assert.equal(audit.content.user_chapter_goal, "检查是否收束。");
  assert.equal(audit.content.target_word_count, 500);
  assert.equal(Array.isArray(audit.content.completion_criteria), true);
  assert.equal(audit.omitted_sections.includes("full_memory"), true);
  assert.equal(audit.omitted_sections.includes("llm_events"), true);

  const reviewer = buildChapterContextPack({
    project,
    chapterContent: "林秋翻开账本，看见姐姐名字。",
    chapterGoal: "检查质量。",
    sceneOutline,
    step: "reviewer",
  });
  assert.equal(reviewer.context_type, "reviewer_context");
  assert.equal(reviewer.omitted_sections.includes("llm_events"), true);
  assert.equal(JSON.stringify(reviewer).includes("llm_events"), true);
  assert.equal(JSON.stringify(reviewer.content).includes("llm_events"), false);

  const summarizer = buildChapterContextPack({
    memory,
    previousSummaries,
    chapterContent: "林秋翻开账本，看见姐姐名字。",
    chapterTitle: "第五章",
    chapterGoal: "总结本章。",
    step: "summarizer",
  });
  assert.equal(summarizer.context_type, "summarizer_context");
  assert.equal(summarizer.omitted_sections.includes("metadata"), true);
  assert.equal(summarizer.omitted_sections.includes("reports"), true);
  assert.equal(summarizer.omitted_sections.includes("craft_rules"), true);
  assert.equal(summarizer.content.final_chapter_content, "林秋翻开账本，看见姐姐名字。");
  assert.equal(summarizer.content.chapter_title, "第五章");
  assert.equal(summarizer.content.user_chapter_goal, "总结本章。");
  assert.equal(summarizer.content.relevant_memory.recent_chapter_summaries.length, 4);
  assert.equal(summarizer.content.relevant_memory.active_foreshadowing.length, 2);
  assert.equal(summarizer.content.relevant_memory.unresolved_threads.length, 2);
  assert.equal(summarizer.content.relevant_memory.relevant_character_states.length, 2);
  assert.equal(summarizer.content.relevant_memory.relevant_world_facts.length, 2);
  assert.match(summarizer.content.relevant_memory.existing_project_summary, /长篇项目摘要/);
  assert.equal(JSON.stringify(summarizer.content).includes("metadata"), false);
  assert.equal(JSON.stringify(summarizer.content).includes("reports"), false);
  assert.equal(JSON.stringify(summarizer.content).includes("craft_rules"), false);
  assert.equal(JSON.stringify(summarizer.content).includes("llm_events"), false);
  assert.equal(JSON.stringify(summarizer.content).includes("should_not"), false);

  const missingMemorySummarizer = buildChapterContextPack({
    chapterContent: "林秋翻开账本。",
    chapterTitle: "第五章",
    chapterGoal: "总结本章。",
    step: "summarizer",
  });
  assert.deepEqual(missingMemorySummarizer.content.relevant_memory.active_foreshadowing, []);
  assert.deepEqual(missingMemorySummarizer.content.relevant_memory.unresolved_threads, []);

  const relevantMemory = buildRelevantMemoryPack({ memory, previousSummaries });
  assert.equal(relevantMemory.sections_included.includes("active_foreshadowing"), true);
  assert.equal(relevantMemory.section_stats.active_foreshadowing.char_count > 0, true);

  const estimates = buildContextPackEstimates([planner, sceneWriter, audit, reviewer, summarizer]);
  assert.equal(estimates.planner_context_chars, planner.char_count);
  assert.equal(estimates.scene_writer_context_chars, sceneWriter.char_count);
  assert.equal(estimates.audit_context_chars, audit.char_count);
  assert.equal(estimates.reviewer_context_chars, reviewer.char_count);
  assert.equal(estimates.summarizer_context_chars, summarizer.char_count);
  assert.equal(estimates.summarizer_context_estimated_tokens, summarizer.estimated_tokens);
  assert.equal(estimates.summarizer_context_omitted_sections.includes("full_memory"), true);
  assert.equal(estimates.summarizer_memory_sections_included.includes("recent_chapter_summaries"), true);
  assert.equal(estimates.summarizer_recent_summary_count, 4);
  assert.equal(estimates.summarizer_foreshadowing_count, 2);
  assert.equal(estimates.summarizer_unresolved_thread_count, 2);
  assert.equal(estimates.summarizer_character_state_count, 2);
  assert.equal(estimates.summarizer_world_fact_count, 2);
  assert.equal(estimates.estimated_total_context_tokens > 0, true);
  assert.equal(Boolean(estimates.largest_context_pack?.context_type), true);

  console.log("Context pack tests passed");
}

main();
