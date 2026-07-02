const assert = require("node:assert/strict");

const {
  PROMPT_VARIABLE_KEYS,
  getAgentPrompt,
  listAgentPrompts,
  normalizePromptVariables,
  renderAgentPrompt,
  renderConsistencyCheckerPrompt,
  renderEditorPrompt,
  renderChapterCompletionAuditPrompt,
  renderChapterCompletionRepairPrompt,
  renderContinueChapterPrompt,
  renderCompressScenePrompt,
  renderExpandScenePrompt,
  renderProjectMaterialsPrompt,
  renderPlannerPrompt,
  renderSceneOutlinePrompt,
  renderSceneWriterPrompt,
  renderSummarizerPrompt,
  renderEditorialSuggestionsPrompt,
  renderTransitionReviewPrompt,
  renderWriterPrompt,
} = require("../agent-prompts");

const SAMPLE_VARIABLES = {
  outline: "第一章：林秋抵达旧港，发现姐姐留下的旅馆账本。",
  characters: "林秋：寻找失踪姐姐的主角。\n陈墨：旧港旅馆老板。",
  world: "旧港常年有雾，码头停航是重要设定。",
  style: "第三人称有限视角，克制、悬疑。",
  goals: "预计 30 章，每章 3000 字，节奏偏悬疑连载。",
  writing_skills: "Beat Sheet Pacing：单章只推进一个小变化。",
  memory: {
    project_summary: "林秋在旧港寻找姐姐。",
    unresolved_threads: ["姐姐为何失踪"],
  },
  previous_summaries: [
    { title: "序章", summary: "林秋收到姐姐的空白明信片。" },
    { title: "第一章", summary: "林秋抵达旧港。" },
  ],
  user_instruction: "为下一章生成三段式小纲，结尾留下账本暗号。",
};

{
  const prompts = listAgentPrompts();
  assert.deepEqual(
    prompts.map((prompt) => prompt.id),
    [
      "planner_prompt",
      "scene_outline_prompt",
      "writer_prompt",
      "scene_writer_prompt",
      "expand_scene_prompt",
      "compress_scene_prompt",
      "continue_chapter_prompt",
      "chapter_completion_auditor_prompt",
      "chapter_completion_repair_prompt",
      "editor_prompt",
      "summarizer_prompt",
      "consistency_checker_prompt",
      "quality_review_prompt",
      "transition_review_prompt",
      "editorial_suggestions_prompt",
      "project_materials_prompt",
    ],
  );
  assert.equal(prompts.every((prompt) => prompt.name && prompt.purpose), true);
}

{
  for (const promptId of [
    "planner_prompt",
    "scene_outline_prompt",
    "writer_prompt",
    "scene_writer_prompt",
    "expand_scene_prompt",
    "compress_scene_prompt",
    "continue_chapter_prompt",
    "chapter_completion_auditor_prompt",
    "chapter_completion_repair_prompt",
    "editor_prompt",
    "summarizer_prompt",
    "consistency_checker_prompt",
    "quality_review_prompt",
    "transition_review_prompt",
    "editorial_suggestions_prompt",
    "project_materials_prompt",
  ]) {
    const prompt = getAgentPrompt(promptId);
    assert.equal(prompt.id, promptId);
    assert.equal(typeof prompt.system, "string");
    assert.equal(typeof prompt.instruction, "string");

    const rendered = renderAgentPrompt(promptId, SAMPLE_VARIABLES);
    assert.equal(rendered.prompt_id, promptId);
    assert.equal(rendered.messages.length, 2);
    assert.equal(rendered.messages[0].role, "system");
    assert.equal(rendered.messages[1].role, "user");
    assert.match(rendered.user, /【项目大纲】/);
    assert.match(rendered.user, /【人物资料】/);
    assert.match(rendered.user, /【世界观资料】/);
    assert.match(rendered.user, /【风格要求】/);
    assert.match(rendered.user, /【写作目标】/);
    assert.match(rendered.user, /【写作技巧】/);
    assert.match(rendered.user, /【项目记忆】/);
    assert.match(rendered.user, /【前文章节摘要】/);
    assert.match(rendered.user, /【用户指令】/);
    assert.match(rendered.user, /林秋抵达旧港/);
    assert.match(rendered.user, /陈墨/);
    assert.match(rendered.user, /码头停航/);
    assert.match(rendered.user, /第三人称有限视角/);
    assert.match(rendered.user, /每章 3000 字/);
    assert.match(rendered.user, /Beat Sheet Pacing/);
    assert.match(rendered.user, /project_summary/);
    assert.match(rendered.user, /序章/);
    assert.match(rendered.user, /三段式小纲/);
  }
}

{
  assert.match(renderPlannerPrompt(SAMPLE_VARIABLES).system, /章节规划师/);
  assert.match(renderPlannerPrompt(SAMPLE_VARIABLES).user, /只规划当前这一章/);
  assert.match(renderPlannerPrompt(SAMPLE_VARIABLES).user, /不要提前解决后续章节/);
  assert.match(renderPlannerPrompt(SAMPLE_VARIABLES).user, /一个主场景/);
  assert.match(renderPlannerPrompt(SAMPLE_VARIABLES).user, /2-3 个小节拍/);
  assert.doesNotMatch(renderPlannerPrompt(SAMPLE_VARIABLES).user, /3-6 个场景/);
  assert.match(renderSceneOutlinePrompt(SAMPLE_VARIABLES).system, /场景规划师/);
  assert.match(renderSceneOutlinePrompt(SAMPLE_VARIABLES).user, /scene_title/);
  assert.match(renderSceneOutlinePrompt(SAMPLE_VARIABLES).user, /target_word_count/);
  assert.match(renderWriterPrompt(SAMPLE_VARIABLES).system, /正文写手/);
  assert.match(renderWriterPrompt(SAMPLE_VARIABLES).user, /必须写到本章自然收束/);
  assert.match(renderWriterPrompt(SAMPLE_VARIABLES).user, /最后一句必须是完整句子/);
  assert.match(renderWriterPrompt(SAMPLE_VARIABLES).user, /\[CHAPTER_END\]/);
  assert.match(renderSceneWriterPrompt(SAMPLE_VARIABLES).system, /场景正文写手/);
  assert.match(renderSceneWriterPrompt(SAMPLE_VARIABLES).user, /只写当前场景/);
  assert.match(renderSceneWriterPrompt(SAMPLE_VARIABLES).user, /\[CHAPTER_END\]/);
  assert.match(renderExpandScenePrompt(SAMPLE_VARIABLES).system, /场景扩写编辑/);
  assert.match(renderExpandScenePrompt(SAMPLE_VARIABLES).user, /不允许改变剧情/);
  assert.match(renderCompressScenePrompt(SAMPLE_VARIABLES).system, /场景压缩编辑/);
  assert.match(renderCompressScenePrompt(SAMPLE_VARIABLES).user, /不允许删除关键剧情/);
  assert.match(renderContinueChapterPrompt(SAMPLE_VARIABLES).system, /章节续写员/);
  assert.match(renderContinueChapterPrompt(SAMPLE_VARIABLES).user, /不要重写前文/);
  assert.match(renderContinueChapterPrompt(SAMPLE_VARIABLES).user, /保持同一叙事视角/);
  assert.match(renderContinueChapterPrompt(SAMPLE_VARIABLES).user, /\[CHAPTER_END\]/);
  assert.match(renderChapterCompletionAuditPrompt(SAMPLE_VARIABLES).system, /完成度审核员/);
  assert.match(renderChapterCompletionAuditPrompt(SAMPLE_VARIABLES).user, /is_complete:boolean/);
  assert.match(renderChapterCompletionAuditPrompt(SAMPLE_VARIABLES).user, /像被 token 截断/);
  assert.match(renderChapterCompletionRepairPrompt(SAMPLE_VARIABLES).system, /章节结尾修复员/);
  assert.match(renderChapterCompletionRepairPrompt(SAMPLE_VARIABLES).user, /只补完必要的结尾段落/);
  assert.match(renderEditorPrompt(SAMPLE_VARIABLES).system, /改稿编辑/);
  assert.match(renderSummarizerPrompt(SAMPLE_VARIABLES).system, /记忆整理员/);
  assert.match(renderSummarizerPrompt(SAMPLE_VARIABLES).user, /不要寒暄/);
  assert.match(renderSummarizerPrompt(SAMPLE_VARIABLES).user, /不要说“好的”/);
  assert.match(renderSummarizerPrompt(SAMPLE_VARIABLES).user, /不要说“以下是”/);
  assert.match(renderSummarizerPrompt(SAMPLE_VARIABLES).user, /直接输出结构化章节记忆/);
  assert.match(renderConsistencyCheckerPrompt(SAMPLE_VARIABLES).system, /一致性检查员/);
  assert.match(renderEditorialSuggestionsPrompt(SAMPLE_VARIABLES).system, /审稿建议编辑/);
  assert.match(renderEditorialSuggestionsPrompt(SAMPLE_VARIABLES).user, /priority_issues/);
  assert.match(renderEditorialSuggestionsPrompt(SAMPLE_VARIABLES).user, /不要自动修改正文/);
  assert.match(renderProjectMaterialsPrompt(SAMPLE_VARIABLES).system, /项目资料规划师/);
  assert.match(renderProjectMaterialsPrompt(SAMPLE_VARIABLES).user, /目标章节数/);
  assert.match(renderProjectMaterialsPrompt(SAMPLE_VARIABLES).user, /每章目标字数/);
  assert.match(renderProjectMaterialsPrompt(SAMPLE_VARIABLES).user, /优先继承已有设定和写作目标/);
  assert.match(renderProjectMaterialsPrompt(SAMPLE_VARIABLES).user, /不能随意覆盖/);
  assert.match(renderProjectMaterialsPrompt(SAMPLE_VARIABLES).user, /待确认冲突/);
  assert.match(renderProjectMaterialsPrompt(SAMPLE_VARIABLES).user, /不要写成抽象口号/);
}

{
  const variables = normalizePromptVariables({
    outline: "  大纲  ",
    previous_summaries: ["第一章摘要", "第二章摘要"],
    memory: {},
  });
  assert.deepEqual(Object.keys(variables), PROMPT_VARIABLE_KEYS);
  assert.equal(variables.outline, "大纲");
  assert.equal(variables.previous_summaries, "- 第一章摘要\n- 第二章摘要");
  assert.equal(variables.memory, "（未提供）");
  assert.equal(variables.characters, "（未提供）");
  assert.equal(variables.goals, "（未提供）");
  assert.equal(variables.writing_skills, "（未提供）");
}

{
  assert.throws(() => getAgentPrompt("unknown_prompt"), /Unsupported agent prompt/);
  assert.throws(() => renderAgentPrompt("", SAMPLE_VARIABLES), /Unsupported agent prompt/);
}

console.log("Agent prompts tests passed");
