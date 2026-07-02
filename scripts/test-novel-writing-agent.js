const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const { buildWritingPathPolicy } = require("../agent/routing/writing-path-policy");
const { createMemoryManager } = require("../memory-manager");
const { cleanMemorySummary, createNovelWritingAgent } = require("../novel-writing-agent");
const { createProjectManager } = require("../project-manager");
const { createToolManager } = require("../tool-manager");

function assertIncludesAll(actual, expected) {
  for (const item of expected) assert.equal(actual.includes(item), true, `expected ${JSON.stringify(actual)} to include ${item}`);
}

async function main() {
  const fastDraftPolicy = buildWritingPathPolicy("fast_draft");
  assert.equal(fastDraftPolicy.completion.scene_audit_enabled, false);
  assert.equal(fastDraftPolicy.completion.scene_repair_enabled, false);
  assert.equal(fastDraftPolicy.completion.chapter_audit_enabled, true);
  assert.equal(fastDraftPolicy.completion.max_chapter_repairs, 0);
  assert.equal(fastDraftPolicy.completion.save_incomplete_with_warning, true);

  assert.equal(
    cleanMemorySummary("好的，以下是本章整理的结构化记忆：\n\n## 本章摘要\n\n林秋发现线索。").summary,
    "## 本章摘要\n\n林秋发现线索。",
  );
  assert.equal(
    cleanMemorySummary("当然可以，以下是本章记忆：\n\n本章摘要\n林秋发现线索。").summary,
    "本章摘要\n林秋发现线索。",
  );
  assert.equal(cleanMemorySummary("## 本章摘要\n\n林秋发现线索。").summary, "## 本章摘要\n\n林秋发现线索。");
  const emptyCleanResult = cleanMemorySummary("好的，以下是本章整理的结构化记忆：");
  assert.equal(emptyCleanResult.summary, "好的，以下是本章整理的结构化记忆：");
  assert.equal(emptyCleanResult.warning.length > 0, true);

  const root = await fs.mkdtemp(path.join(os.tmpdir(), "jian-ji-novel-agent-"));
  try {
    const library = {
      folders: [],
      works: [
        {
          id: "work-1",
          title: "旧港来信",
          description: "寻找失踪姐姐的长篇故事。",
          chapterIds: ["chapter-1"],
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
          notes: "主角抵达旧港。",
          outline: "抵达旧港。",
          wordCount: 7,
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
    const memoryManager = createMemoryManager({ projectsRoot: root });
    await projectManager.ensureProject("work-1");
    await projectManager.saveProjectMaterial("work-1", "outline", "# Outline\n\n第二章调查旅馆账本。\n");
    await projectManager.saveProjectMaterial("work-1", "characters", "# Characters\n\n林秋：寻找姐姐。\n");
    await projectManager.saveProjectMaterial("work-1", "world", "# World\n\n旧港常年有雾。\n");
    await projectManager.saveProjectMaterial("work-1", "style", "# Style\n\n克制悬疑。\n");
    await projectManager.saveProjectMaterial("work-1", "goals", "# Goals\n\n预计 30 章，每章 3000 字。\n");
    await memoryManager.updateChapterSummary("work-1", "chapter-1", "林秋抵达旧港。", { title: "第一章" });

    const tools = createToolManager({
      projectsRoot: root,
      loadLibrary: async () => library,
      saveLibrary: async () => {},
    });

    const calls = [];
    const llmClient = {
      async generate(request) {
        assert.equal(Object.prototype.hasOwnProperty.call(request, "model"), false);
        calls.push(request);
        if (request.prompt_id === "planner_prompt") {
          assert.match(request.user, /第二章调查旅馆账本/);
          assert.match(request.user, /当前目标章节：第 2 章/);
          assert.match(request.user, /林秋抵达旧港/);
          assert.match(request.user, /Story 6W/);
          assert.match(request.user, /Beat Sheet Pacing/);
          return { content: "1. 林秋检查旅馆账本。\n2. 账本出现姐姐名字。\n3. 结尾发现暗号。" };
        }
        if (request.prompt_id === "scene_outline_prompt") {
          assert.match(request.user, /scene_title/);
          assert.match(request.user, /target_word_count/);
          assert.match(request.user, /章节目标字数：3000/);
          return {
            content: JSON.stringify([
              {
                scene_title: "查账本",
                scene_goal: "林秋找到姐姐名字",
                characters: ["林秋"],
                conflict: "账本被灰尘和旧记录遮掩",
                expected_turning_point: "姐姐名字出现",
                target_word_count: 1500,
              },
              {
                scene_title: "见暗号",
                scene_goal: "林秋意识到名字旁有暗号",
                characters: ["林秋"],
                conflict: "暗号含义不明",
                expected_turning_point: "暗号指向旧港秘密",
                target_word_count: 1500,
              },
            ]),
          };
        }
        if (request.prompt_id === "scene_writer_prompt") {
          assert.match(request.user, /本章小纲/);
          assert.match(request.user, /当前场景/);
          assert.match(request.user, /每章 3000 字/);
          assert.match(request.user, /Character Archetypes/);
          assert.match(request.user, /Beat Sheet Pacing/);
          assert.match(request.user, /最后一句必须是完整句子/);
          if (request.user.includes("查账本")) {
            return {
              content: "林秋翻开账本，灰尘在灯下浮动。她看见姐姐的名字，指尖停在泛黄纸页上。\n\n[CHAPTER_END]",
              provider: "test-provider",
              generatedAt: "2026-01-01T00:00:00.000Z",
              metadata: {
                model: "test-scene-model",
                max_tokens: 4096,
                finish_reason: "stop",
                status: "completed",
                incomplete_details: null,
                input_token_usage: 1200,
                output_token_usage: 120,
              },
            };
          }
          return {
            content: "名字旁边画着陌生暗号，像被人故意压在墨迹深处。林秋合上账本，知道今晚不能声张。\n\n[CHAPTER_END]",
            provider: "test-provider",
            generatedAt: "2026-01-01T00:00:00.000Z",
            metadata: {
              model: "test-scene-model",
              max_tokens: 4096,
              finish_reason: "stop",
              status: "completed",
              incomplete_details: null,
              input_token_usage: 1200,
              output_token_usage: 240,
            },
          };
        }
        if (request.prompt_id === "expand_scene_prompt") {
          return {
            content: request.user.includes("查账本")
              ? "林秋翻开账本，灰尘在灯下浮动。她看见姐姐的名字，指尖停在泛黄纸页上。\n\n[CHAPTER_END]"
              : "名字旁边画着陌生暗号，像被人故意压在墨迹深处。林秋合上账本，知道今晚不能声张。\n\n[CHAPTER_END]",
            metadata: {
              model: "test-expand-model",
              finish_reason: "stop",
              status: "completed",
            },
          };
        }
        if (request.prompt_id === "chapter_completion_auditor_prompt") {
          assert.match(request.user, /待审核正文/);
          return {
            content: JSON.stringify({
              is_complete: true,
              ending_status: "本章当前场景已收束，最后一句完整。",
              issues: [],
              suggested_fix: "",
            }),
          };
        }
        if (request.prompt_id === "summarizer_prompt") {
          assert.match(request.user, /林秋翻开账本/);
          assert.match(request.user, /旧港常年有雾/);
          assert.match(request.user, /林秋：寻找姐姐/);
          return { content: "好的，以下是本章整理的结构化记忆：\n\n## 本章摘要\n\n林秋在旅馆账本中发现姐姐名字和陌生暗号。" };
        }
        if (request.prompt_id === "quality_review_prompt") {
          assert.match(request.user, /"chapter_content"/);
          assert.match(request.user, /"scene_outline"/);
          assert.match(request.user, /"scene_metadata"/);
          assert.match(request.user, /"characters"/);
          assert.match(request.user, /"world"/);
          assert.match(request.user, /"style"/);
          assert.match(request.user, /"memory"/);
          assert.match(request.user, /"user_chapter_goal"/);
          assert.match(request.user, /"craft_rules"/);
          assert.match(request.user, /scene-conflict-pressure|dialogue-naturalness|pacing-beat-change/);
          assert.match(request.user, /style-sentence-texture/);
          assert.match(request.user, /revision-focused-pass/);
          assert.match(request.user, /林秋翻开账本/);
          assert.match(request.user, /旧港常年有雾/);
          assert.match(request.user, /写第二章，重点是账本和暗号/);
          return {
            content: JSON.stringify({
              quality_score: 82,
              scene_level_feedback: [{ scene_title: "查账本", feedback: "场景目标明确，冲突偏内在。" }],
              issues: ["第二个 scene 的对白张力还可以加强。"],
              suggested_fixes: ["增加老板一句含糊回避的对白。"],
              strengths: ["结尾有推进。"],
              overall_feedback: "章节质量稳定，适合作为下一章铺垫。",
            }),
          };
        }
        if (request.prompt_id === "transition_review_prompt") {
          assert.match(request.user, /"chapter_content"/);
          assert.match(request.user, /"scene_outline"/);
          assert.match(request.user, /"scene_metadata"/);
          assert.match(request.user, /"characters"/);
          assert.match(request.user, /"world"/);
          assert.match(request.user, /"style"/);
          assert.match(request.user, /"memory"/);
          assert.match(request.user, /"user_chapter_goal"/);
          assert.match(request.user, /"craft_rules"/);
          assert.match(request.user, /scene-transition|pacing-beat-change/);
          assert.match(request.user, /林秋翻开账本/);
          assert.match(request.user, /写第二章，重点是账本和暗号/);
          return {
            content: JSON.stringify({
              transition_score: 86,
              scene_pair_feedback: [{ from_scene: "查账本", to_scene: "暗号", feedback: "衔接自然。" }],
              transition_issues: [],
              suggested_bridge_sentences: ["她没有立刻合上账本，而是顺着名字旁边的墨迹继续看下去。"],
              pacing_notes: ["两段推进清楚。"],
              overall_feedback: "场景之间没有明显拼接感。",
            }),
          };
        }
        if (request.prompt_id === "editorial_suggestions_prompt") {
          assert.match(request.user, /"chapter_content"/);
          assert.match(request.user, /"quality_review_report"/);
          assert.match(request.user, /"transition_review_report"/);
          assert.match(request.user, /"style"/);
          assert.match(request.user, /"user_chapter_goal"/);
          assert.match(request.user, /"selected_craft_rules"/);
          assert.match(request.user, /林秋翻开账本/);
          if (!request.user.includes('"quality_review_report": null')) assert.match(request.user, /章节质量稳定/);
          if (!request.user.includes('"transition_review_report": null')) assert.match(request.user, /场景之间没有明显拼接感/);
          if (!request.user.includes('"selected_craft_rules": []')) assert.match(request.user, /"principle_summary"/);
          assert.doesNotMatch(request.user, /"id"/);
          assert.doesNotMatch(request.user, /"principle"/);
          assert.doesNotMatch(request.user, /"checklist"/);
          assert.doesNotMatch(request.user, /"bad_patterns"/);
          assert.doesNotMatch(request.user, /"revision_strategy"/);
          assert.doesNotMatch(request.user, /"scene_metadata"/);
          assert.doesNotMatch(request.user, /"llm_events"/);
          assert.doesNotMatch(request.user, /"quality_review_craft_rule_ids"/);
          return {
            content: JSON.stringify({
              overall_evaluation: "本章线索推进清楚，悬疑感稳定。",
              priority_issues: [
                {
                  title: "对白张力不足",
                  problem: "老板的回避还不够具体。",
                  why_it_matters: "会削弱读者对暗号危险性的感知。",
                  suggestion: "给老板增加一句含糊但带压力的回应。",
                  optional_example_revision: "老板把账本往回拉了半寸，只说今晚风大。",
                },
              ],
              transition_suggestions: ["两个场景之间可以保留账本动作作为衔接。"],
              character_motivation_suggestions: ["林秋继续追查的动机清楚。"],
              dialogue_suggestions: ["对白可增加回避和停顿。"],
              pacing_suggestions: ["节奏基本稳定。"],
              style_suggestions: ["保持克制悬疑语气。"],
              recommend_optimized_version: { recommended: true, reason: "局部对白和衔接可进一步增强。" },
              closing_note: "建议先改对白张力。",
            }),
          };
        }
        if (request.prompt_id === "consistency_checker_prompt") {
          assert.match(request.user, /当前章节正文/);
          assert.match(request.user, /旧港常年有雾/);
          return {
            content: JSON.stringify({
              contradictions: ["姐姐名字出现过早，可能削弱第一卷悬念。"],
              character_behavior_issues: ["林秋直接翻账本需要补一个合理机会。"],
              timeline_issues: [],
              worldbuilding_issues: ["旧港停航设定未在本章体现。"],
              unresolved_questions: ["暗号是谁留下的？"],
              suggested_fixes: ["增加旅馆老板离场的动作，让林秋有时间查看账本。"],
            }),
          };
        }
        if (request.prompt_id === "editor_prompt") {
          assert.match(request.user, /选中文本/);
          assert.match(request.user, /灰尘在灯下浮动/);
          return { content: "林秋翻开账本，灯下的灰尘缓慢浮起。" };
        }
        if (request.prompt_id === "project_materials_prompt") {
          assert.match(request.user, /失眠的女孩/);
          assert.match(request.user, /第二章调查旅馆账本/);
          assert.match(request.user, /林秋：寻找姐姐/);
          assert.match(request.user, /旧港常年有雾/);
          assert.match(request.user, /预计 30 章，每章 3000 字/);
          return {
            content: JSON.stringify({
              outline: "# 项目大纲\n\n失眠女孩发现梦境能改变现实。",
              characters: "# 角色设定\n\n女主：长期失眠，害怕遗忘亲人。",
              world: "# 世界观\n\n梦境改写现实，但会夺走记忆。",
              style: "# 风格偏好\n\n悬疑、克制、带都市奇幻感。",
              goals: "# 写作目标\n\n预计 24 章，每章 2500 字。",
            }),
          };
        }
        throw new Error(`Unexpected prompt: ${request.prompt_id}`);
      },
    };

    const agent = createNovelWritingAgent({ projectManager, memoryManager, tools, llmClient });
    const result = await agent.write_chapter({
      project_id: "work-1",
      chapter_number: 2,
      title: "第二章 账本",
      user_instruction: "写第二章，重点是账本和暗号。",
    });

    assert.equal(result.ok, true);
    assert.equal(result.chapter_file, "chapter_002.md");
    assert.equal(result.chapter_id, "chapter-2");
    assert.equal(result.steps.every((step) => step.status === "completed"), true);
    assert.equal(result.completion_audit.is_complete, true);
    assert.equal(result.generation_metadata.chapter_id, "chapter-2");
    assert.equal(result.generation_metadata.writing_path, "polished_chapter");
    assert.equal(result.generation_metadata.generation_mode, "");
    assert.equal(result.generation_metadata.writing_path_warning, "");
    assert.equal(result.generation_metadata.execution_plan.path_id, "polished_chapter");
    assert.equal(result.generation_metadata.execution_plan.steps.some((step) => step.prompt_id === "scene_writer_prompt"), true);
    assert.equal(result.generation_metadata.execution_plan.steps.some((step) => step.prompt_id === "editorial_suggestions_prompt"), true);
    assert.deepEqual(result.generation_metadata.model_policy, {
      policy_id: "default",
      version: 2,
      routing_enabled: false,
      enabled_tiers: ["cheap", "summary", "review"],
    });
    assert.equal(result.generation_metadata.requested_word_count, 3000);
    assert.equal(result.generation_metadata.finish_reason, "stop");
    assert.equal(result.generation_metadata.was_truncated, false);
    assert.equal(result.generation_metadata.has_chapter_end_marker, true);
    assert.equal(result.generation_metadata.audit_fallback_triggered, false);
    assert.equal(result.generation_metadata.audit_fallback_used_default_model, false);
    assert.equal(result.generation_metadata.actual_word_count > 0, true);
    assert.equal(result.generation_metadata.word_count_ratio > 0, true);
    assert.equal(result.generation_metadata.word_count_ratio < 0.85, true);
    assert.equal(result.generation_metadata.needs_expansion, true);
    assert.equal(result.generation_metadata.needs_compression, false);
    assert.equal(result.generation_metadata.quality_review_status, "completed");
    assert.match(result.generation_metadata.quality_review_file, /quality_chapter_002\.md/);
    assertIncludesAll(result.generation_metadata.quality_review_craft_rule_ids, [
      "scene-conflict-pressure",
      "character-motivation",
      "dialogue-naturalness",
      "pacing-beat-change",
      "style-sentence-texture",
      "revision-focused-pass",
    ]);
    assert.equal(result.generation_metadata.quality_review_craft_rule_ids.includes("scene-transition"), false);
    assert.equal(result.generation_metadata.transition_review_status, "completed");
    assert.match(result.generation_metadata.transition_review_file, /transition_chapter_002\.md/);
    assertIncludesAll(result.generation_metadata.transition_review_craft_rule_ids, [
      "scene-conflict-pressure",
      "pacing-beat-change",
      "scene-transition",
    ]);
    assert.equal(result.generation_metadata.editorial_suggestions_status, "completed");
    assert.match(result.generation_metadata.editorial_suggestions_file, /editorial_suggestions_chapter_002\.md/);
    assert.equal(result.generation_metadata.editorial_suggestions_error, "");
    assert.equal(result.generation_metadata.model_tier_usage.cheap > 0, true);
    assert.equal(result.generation_metadata.model_tier_usage.mid > 0, true);
    assert.equal(result.generation_metadata.model_tier_usage.writing > 0, true);
    assert.equal(result.generation_metadata.model_tier_usage.review > 0, true);
    assert.equal(result.generation_metadata.model_tier_usage.summary, 1);
    assert.equal(result.generation_metadata.retry_count, 0);
    assert.equal(result.generation_metadata.llm_events.some((event) => event.prompt_id === "scene_writer_prompt"), true);
    assert.equal(result.generation_metadata.llm_events.every((event) => event.model_routing_enabled === false), true);
    assert.equal(result.generation_metadata.llm_events.every((event) => event.model_tier && event.resolved_model && event.model_policy_source), true);
    assert.equal(result.generation_metadata.llm_events.every((event) => event.actual_model_sent === ""), true);
    assert.equal(result.generation_metadata.actual_model_sent_usage.__default_client_model__, result.generation_metadata.llm_events.length);
    assert.deepEqual(result.generation_metadata.model_routing_warnings, []);
    assert.equal(result.generation_metadata.memory_summary_cleaned, true);
    assert.match(result.generation_metadata.memory_summary_clean_reason, /chatty_prefix/);
    assert.equal(result.generation_metadata.memory_summary_clean_warning, "");
    assert.equal(result.generation_metadata.context_pack_estimates.planner_context_chars > 0, true);
    assert.equal(result.generation_metadata.context_pack_estimates.scene_writer_context_chars > 0, true);
    assert.equal(result.generation_metadata.context_pack_estimates.audit_context_chars > 0, true);
    assert.equal(result.generation_metadata.context_pack_estimates.reviewer_context_chars > 0, true);
    assert.equal(result.generation_metadata.context_pack_estimates.summarizer_context_chars > 0, true);
    assert.equal(result.generation_metadata.context_pack_estimates.estimated_total_context_tokens > 0, true);
    assert.match(result.generation_metadata.context_pack_estimates.potential_savings_note, /observation only/);
    assert.equal(result.generation_metadata.context_pack_summary_enabled, false);
    assert.equal(result.generation_metadata.summarizer_prompt_input_chars_before, result.generation_metadata.summarizer_prompt_input_chars_after);
    assert.equal(
      result.generation_metadata.llm_events.find((event) => event.prompt_id === "scene_writer_prompt").model_tier,
      "writing",
    );
    assert.equal(
      result.generation_metadata.llm_events.find((event) => event.prompt_id === "chapter_completion_auditor_prompt").model_tier,
      "cheap",
    );
    assert.equal(result.generation_metadata.scene_metadata.length, 2);
    assert.equal(result.generation_metadata.scene_metadata[0].scene_title, "查账本");
    assert.equal(result.generation_metadata.scene_metadata[0].target_word_count, 1500);
    assert.equal(result.generation_metadata.scene_metadata[0].has_scene_end_marker, true);
    assert.equal(result.generation_metadata.scene_metadata[0].actual_word_count > 0, true);
    assert.equal(result.generation_metadata.scene_metadata[0].ever_truncated, false);
    assert.equal(result.generation_metadata.scene_metadata[0].continued_after_truncation, false);
    assert.equal(result.generation_metadata.scene_metadata[0].final_was_truncated, false);
    assert.equal(result.scene_outline.length, 2);
    assert.match(result.generation_metadata_file, /generation_metadata_chapter_002_/);
    assert.equal(result.steps.some((step) => step.name === "generate_scene_outline"), true);
    assert.equal(result.steps.some((step) => step.name === "generate_scene_content_1"), true);
    assert.equal(result.steps.some((step) => step.name === "generate_scene_content_2"), true);
    assert.equal(result.steps.some((step) => step.name === "audit_scene_completion_1"), true);
    assert.equal(result.steps.some((step) => step.name === "audit_scene_completion_2"), true);
    assert.equal(calls.some((call) => call.prompt_id === "scene_outline_prompt"), true);
    assert.equal(calls.filter((call) => call.prompt_id === "scene_writer_prompt").length, 2);
    assert.equal(calls.some((call) => call.prompt_id === "expand_scene_prompt"), true);
    assert.equal(calls.some((call) => call.prompt_id === "quality_review_prompt"), true);
    assert.equal(calls.some((call) => call.prompt_id === "transition_review_prompt"), true);
    assert.equal(calls.some((call) => call.prompt_id === "editorial_suggestions_prompt"), true);
    assert.equal(calls.at(-1).prompt_id, "summarizer_prompt");
    assert.doesNotMatch(result.content, /\[CHAPTER_END\]/);

    const savedChapter = await fs.readFile(path.join(root, "work-1", "chapters", "chapter_002.md"), "utf8");
    assert.match(savedChapter, /姐姐的名字/);
    assert.doesNotMatch(savedChapter, /\[CHAPTER_END\]/);
    const savedMetadata = await fs.readFile(path.join(root, "work-1", "reports", result.generation_metadata_file), "utf8");
    assert.match(savedMetadata, /"chapter_id": "chapter-2"/);
    assert.match(savedMetadata, /"writing_path": "polished_chapter"/);
    assert.match(savedMetadata, /"execution_plan"/);
    assert.match(savedMetadata, /"actual_word_count"/);
    assert.match(savedMetadata, /"scene_metadata"/);
    assert.match(savedMetadata, /"word_count_ratio"/);
    assert.match(savedMetadata, /"needs_expansion": true/);
    assert.match(savedMetadata, /"needs_compression": false/);
    assert.match(savedMetadata, /"quality_review_status": "completed"/);
    assert.match(savedMetadata, /"transition_review_status": "completed"/);
    assert.match(savedMetadata, /"editorial_suggestions_status": "completed"/);
    const savedQualityReport = await fs.readFile(path.join(root, "work-1", "reports", result.quality_review_file), "utf8");
    assert.match(savedQualityReport, /# Writing Quality Review/);
    assert.match(savedQualityReport, /quality_score/);
    assert.match(savedQualityReport, /章节质量稳定/);
    const savedTransitionReport = await fs.readFile(path.join(root, "work-1", "reports", result.transition_review_file), "utf8");
    assert.match(savedTransitionReport, /# Scene Transition Review/);
    assert.match(savedTransitionReport, /transition_score/);
    assert.match(savedTransitionReport, /没有明显拼接感/);
    const savedEditorialSuggestions = await fs.readFile(path.join(root, "work-1", "reports", result.editorial_suggestions_file), "utf8");
    assert.match(savedEditorialSuggestions, /# Editorial Suggestions/);
    assert.match(savedEditorialSuggestions, /本章线索推进清楚/);
    assert.doesNotMatch(savedEditorialSuggestions, /raw_report/);
    assert.doesNotMatch(savedEditorialSuggestions, /"overall_evaluation"/);
    assert.doesNotMatch(savedEditorialSuggestions, /scene_metadata|llm_events|craft_rule_ids|finish_reason/);

    const fastDraftCallStart = calls.length;
    const fastDraftResult = await agent.write_chapter({
      project_id: "work-1",
      chapter_number: 2,
      title: "第三章 快速路径元数据",
      user_instruction: "写第二章，重点是账本和暗号",
      target_word_count: 3000,
      generation_mode: "fast_draft",
    });
    const fastDraftCalls = calls.slice(fastDraftCallStart);
    assert.equal(fastDraftResult.ok, true);
    assert.equal(fastDraftResult.generation_metadata.writing_path, "fast_draft");
    assert.equal(fastDraftResult.generation_metadata.generation_mode, "fast_draft");
    assert.equal(fastDraftResult.generation_metadata.execution_plan.path_id, "fast_draft");
    assert.equal(fastDraftResult.generation_metadata.writing_path_warning, "");
    assert.equal(fastDraftResult.generation_metadata.path_policy.scene_audit_enabled, false);
    assert.equal(fastDraftResult.generation_metadata.path_policy.scene_repair_enabled, false);
    assert.equal(fastDraftResult.generation_metadata.path_policy.max_chapter_repairs, 0);
    assert.equal(fastDraftResult.steps.some((step) => /^audit_scene_completion_/.test(step.name)), false);
    assert.equal(fastDraftResult.steps.some((step) => /^repair_scene_completion_/.test(step.name)), false);
    assert.equal(
      fastDraftResult.generation_metadata.llm_events.find((event) => event.prompt_id === "planner_prompt").model_tier,
      "cheap",
    );
    assert.equal(
      fastDraftResult.generation_metadata.llm_events.find((event) => event.prompt_id === "scene_outline_prompt").model_tier,
      "cheap",
    );
    assert.equal(
      fastDraftResult.generation_metadata.llm_events.some((event) =>
        ["quality_review_prompt", "transition_review_prompt", "editorial_suggestions_prompt"].includes(event.prompt_id),
      ),
      false,
    );
    assert.equal(fastDraftResult.generation_metadata.model_tier_usage.review, 0);
    assert.equal(fastDraftResult.generation_metadata.model_policy.routing_enabled, false);
    assert.equal(fastDraftCalls.some((call) => call.prompt_id === "scene_outline_prompt"), true);
    assert.equal(fastDraftCalls.some((call) => call.prompt_id === "scene_writer_prompt"), true);
    assert.equal(fastDraftCalls.some((call) => call.prompt_id === "chapter_completion_auditor_prompt"), true);
    assert.equal(fastDraftCalls.some((call) => call.prompt_id === "summarizer_prompt"), true);
    assert.equal(fastDraftCalls.some((call) => call.prompt_id === "chapter_completion_repair_prompt"), false);
    assert.equal(fastDraftCalls.some((call) => call.prompt_id === "expand_scene_prompt"), false);
    assert.equal(fastDraftCalls.some((call) => call.prompt_id === "compress_scene_prompt"), false);
    assert.equal(fastDraftCalls.some((call) => call.prompt_id === "quality_review_prompt"), false);
    assert.equal(fastDraftCalls.some((call) => call.prompt_id === "transition_review_prompt"), false);
    assert.equal(fastDraftCalls.some((call) => call.prompt_id === "editorial_suggestions_prompt"), false);
    assert.equal(fastDraftResult.chapter_file, "chapter_002.md");
    assert.equal(fastDraftResult.memory.chapter_summaries["chapter-2"].summary, "## 本章摘要\n\n林秋在旅馆账本中发现姐姐名字和陌生暗号。");
    assert.equal(fastDraftResult.generation_metadata.quality_review_status, "skipped");
    assert.equal(fastDraftResult.generation_metadata.transition_review_status, "skipped");
    assert.equal(fastDraftResult.generation_metadata.editorial_suggestions_status, "skipped");
    assert.equal(fastDraftResult.generation_metadata.scene_metadata[0].adjustment_skipped, true);
    assert.match(fastDraftResult.generation_metadata.scene_metadata[0].adjustment_skipped_reason, /fast_draft/);
    assert.equal(fastDraftResult.generation_metadata.skipped_steps.some((step) => step.step === "quality_review" && step.status === "skipped"), true);
    assert.equal(fastDraftResult.generation_metadata.skipped_steps.some((step) => step.step === "transition_review" && step.status === "skipped"), true);
    assert.equal(fastDraftResult.generation_metadata.skipped_steps.some((step) => step.step === "editorial_suggestions" && step.status === "skipped"), true);
    assert.equal(fastDraftResult.generation_metadata.skipped_steps.some((step) => step.step === "expand_compress" && step.status === "skipped"), true);

    const standardCallStart = calls.length;
    const standardResult = await agent.write_chapter({
      project_id: "work-1",
      chapter_number: 2,
      title: "第三章 标准路径",
      user_instruction: "写第二章，重点是账本和暗号",
      target_word_count: 3000,
      generation_mode: "standard",
    });
    const standardCalls = calls.slice(standardCallStart);
    assert.equal(standardResult.ok, true);
    assert.equal(standardResult.generation_metadata.writing_path, "standard_chapter");
    assert.equal(standardResult.generation_metadata.generation_mode, "standard");
    assert.equal(standardResult.generation_metadata.quality_review_status, "skipped");
    assert.equal(standardResult.generation_metadata.transition_review_status, "skipped");
    assert.equal(standardResult.generation_metadata.editorial_suggestions_status, "completed");
    assert.equal(standardCalls.length <= 12, true);
    assert.equal(standardCalls.some((call) => call.prompt_id === "expand_scene_prompt"), false);
    assert.equal(standardCalls.some((call) => call.prompt_id === "compress_scene_prompt"), false);
    assert.equal(standardCalls.filter((call) => call.prompt_id === "chapter_completion_repair_prompt").length <= 1, true);
    assert.equal(standardCalls.some((call) => call.prompt_id === "quality_review_prompt"), false);
    assert.equal(standardCalls.some((call) => call.prompt_id === "transition_review_prompt"), false);
    assert.equal(standardCalls.some((call) => call.prompt_id === "editorial_suggestions_prompt"), true);
    assert.equal(standardCalls.some((call) => call.prompt_id === "summarizer_prompt"), true);
    assert.equal(standardResult.chapter_file, "chapter_002.md");
    assert.equal(standardResult.memory.chapter_summaries["chapter-2"].summary, "## 本章摘要\n\n林秋在旅馆账本中发现姐姐名字和陌生暗号。");
    assert.equal(standardResult.generation_metadata.standard_mode_limited_repair, true);
    assert.equal(standardResult.generation_metadata.standard_mode_limited_adjustment, true);
    assert.equal(standardResult.generation_metadata.scene_metadata[0].adjustment_skipped, true);
    assert.match(standardResult.generation_metadata.scene_metadata[0].adjustment_skipped_reason, /standard_chapter/);
    assert.equal(standardResult.generation_metadata.skipped_steps.some((step) => step.step === "expand_compress" && step.status === "skipped"), true);
    assert.equal(standardResult.generation_metadata.skipped_steps.some((step) => step.step === "scene_completion_audit" && step.status === "skipped"), true);
    assert.equal(standardResult.generation_metadata.skipped_steps.some((step) => step.step === "scene_completion_repair" && step.status === "skipped"), true);
    assert.equal(standardResult.generation_metadata.skipped_steps.some((step) => step.step === "quality_review" && step.status === "skipped"), true);
    assert.equal(standardResult.generation_metadata.skipped_steps.some((step) => step.step === "transition_review" && step.status === "skipped"), true);

    const standardIncompleteCalls = [];
    const standardIncompleteAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          standardIncompleteCalls.push(request);
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋发现线索。2. 林秋暂时停下。" };
          if (request.prompt_id === "scene_outline_prompt") {
            return {
              content: JSON.stringify([
                {
                  scene_title: "未收束场景",
                  scene_goal: "林秋发现线索",
                  characters: ["林秋"],
                  conflict: "线索尚未解释",
                  expected_turning_point: "发现暗号",
                  target_word_count: 300,
                },
              ]),
            };
          }
          if (request.prompt_id === "scene_writer_prompt") return { content: "林秋发现了暗号。\n\n[CHAPTER_END]" };
          if (request.prompt_id === "chapter_completion_repair_prompt") return { content: "林秋发现了暗号，但仍未完全收束。" };
          if (request.prompt_id === "chapter_completion_auditor_prompt") {
            return {
              content: JSON.stringify({
                is_complete: false,
                ending_status: "仍未完整收束。",
                issues: ["结尾仍需要补完。"],
                suggested_fix: "补完结尾。",
              }),
            };
          }
          if (request.prompt_id === "editorial_suggestions_prompt") {
            return {
              content: JSON.stringify({
                overall_evaluation: "当前稿可作为未完成草稿参考。",
                priority_issues: ["结尾需要补完"],
                transition_suggestions: [],
                character_motivation_suggestions: [],
                dialogue_suggestions: [],
                pacing_suggestions: [],
                style_suggestions: [],
                recommend_optimized_version: { recommended: true, reason: "结尾未收束" },
                closing_note: "建议人工复查。",
              }),
            };
          }
          if (request.prompt_id === "summarizer_prompt") return { content: "林秋发现暗号，但结尾仍需复查。" };
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const standardIncomplete = await standardIncompleteAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 22,
      title: "第二十二章 标准未完成",
      user_instruction: "写一个未完全收束的标准模式章节。",
      target_word_count: 300,
      generation_mode: "standard",
    });
    assert.equal(standardIncomplete.ok, true);
    assert.equal(standardIncomplete.chapter_file, "chapter_022.md");
    assert.equal(standardIncomplete.memory.chapter_summaries["chapter-22"].summary, "林秋发现暗号，但结尾仍需复查。");
    assert.match(standardIncomplete.generation_metadata.completion_warning, /standard_chapter 已保存当前正文/);
    assert.equal(standardIncomplete.generation_metadata.completion_repair_attempts, 1);
    assert.equal(standardIncomplete.generation_metadata.completion_repair_limit_reached, true);
    assert.equal(standardIncompleteCalls.filter((call) => call.prompt_id === "chapter_completion_repair_prompt").length, 1);
    assert.equal(standardIncompleteCalls.some((call) => call.prompt_id === "quality_review_prompt"), false);
    assert.equal(standardIncompleteCalls.some((call) => call.prompt_id === "transition_review_prompt"), false);
    assert.equal(standardIncompleteCalls.some((call) => call.prompt_id === "editorial_suggestions_prompt"), true);
    assert.equal(standardIncompleteCalls.some((call) => call.prompt_id === "summarizer_prompt"), true);
    assert.equal(standardIncompleteCalls.length <= 12, true);

    await memoryManager.saveMemory("work-1", {
      project_summary: "林秋在旧港追查姐姐失踪，线索牵向旅馆账本。",
      chapter_summaries: {
        "chapter-1": { chapter_id: "chapter-1", title: "第一章", summary: "林秋抵达旧港。" },
        "chapter-2": { chapter_id: "chapter-2", title: "第二章", summary: "林秋找到旅馆。" },
      },
      foreshadowing: ["姐姐留下的红线尚未解释"],
      unresolved_threads: ["姐姐失踪真相仍未揭开"],
      characters_state: { "林秋": { goal: "寻找姐姐", emotion: "克制焦虑" } },
      world_facts: ["码头账本记录暗线"],
      reports: { should_not: "appear" },
      metadata: { should_not: "appear" },
      llm_events: [{ should_not: "appear" }],
      craft_rules: [{ should_not: "appear" }],
    });
    const summaryContextPackCalls = [];
    const summaryContextPackAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          summaryContextPackCalls.push(request);
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋查账本。2. 林秋发现暗线。" };
          if (request.prompt_id === "scene_outline_prompt") {
            return {
              content: JSON.stringify([
                {
                  scene_title: "查账本",
                  scene_goal: "林秋发现暗线",
                  characters: ["林秋"],
                  conflict: "账本被藏起",
                  expected_turning_point: "暗线出现",
                  target_word_count: 300,
                },
              ]),
            };
          }
          if (request.prompt_id === "scene_writer_prompt") return { content: "林秋翻开账本，看见姐姐名字旁的暗线。\n\n[CHAPTER_END]" };
          if (request.prompt_id === "chapter_completion_auditor_prompt") {
            return {
              content: JSON.stringify({ is_complete: true, ending_status: "完整", issues: [], suggested_fix: "" }),
            };
          }
          if (request.prompt_id === "summarizer_prompt") {
            assert.match(request.user, /summarizer_context/);
            assert.match(request.user, /final_chapter_content/);
            assert.match(request.user, /recent_chapter_summaries/);
            assert.match(request.user, /active_foreshadowing/);
            assert.match(request.user, /姐姐留下的红线尚未解释/);
            assert.match(request.user, /unresolved_threads/);
            assert.match(request.user, /姐姐失踪真相仍未揭开/);
            assert.match(request.user, /relevant_character_states/);
            assert.match(request.user, /relevant_world_facts/);
            assert.doesNotMatch(request.user, /# Characters/);
            assert.doesNotMatch(request.user, /# World/);
            assert.doesNotMatch(request.user, /# Style/);
            assert.doesNotMatch(request.user, /llm_events/);
            assert.doesNotMatch(request.user, /craft_rules/);
            assert.doesNotMatch(request.user, /should_not/);
            return { content: "好的，以下是本章整理的结构化记忆：\n\n## 本章摘要\n\n林秋发现姐姐名字旁的暗线。" };
          }
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const summaryContextPackResult = await summaryContextPackAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 23,
      title: "第二十三章 摘要上下文包",
      user_instruction: "写一章发现暗线的测试章节。",
      target_word_count: 300,
      generation_mode: "fast_draft",
      enable_context_pack_for_summary: true,
    });
    const summaryContextPackSummarizerCall = summaryContextPackCalls.find((call) => call.prompt_id === "summarizer_prompt");
    assert.equal(summaryContextPackResult.ok, true);
    assert.equal(summaryContextPackResult.generation_metadata.context_pack_summary_enabled, true);
    assert.equal(summaryContextPackResult.generation_metadata.summarizer_prompt_input_chars_before > summaryContextPackResult.generation_metadata.summarizer_prompt_input_chars_after, true);
    assert.equal(summaryContextPackResult.generation_metadata.summarizer_context_estimated_tokens > 0, true);
    assert.equal(summaryContextPackResult.generation_metadata.summarizer_context_omitted_sections.includes("full_memory"), true);
    assert.equal(summaryContextPackResult.generation_metadata.summarizer_memory_sections_included.includes("active_foreshadowing"), true);
    assert.equal(summaryContextPackResult.memory.chapter_summaries["chapter-23"].summary, "## 本章摘要\n\n林秋发现姐姐名字旁的暗线。");
    assert.equal(summaryContextPackResult.generation_metadata.memory_summary_cleaned, true);
    assert.equal(Boolean(summaryContextPackSummarizerCall), true);
    await memoryManager.updateChapterSummary("work-1", "chapter-2", "## 本章摘要\n\n林秋在旅馆账本中发现姐姐名字和陌生暗号。", {
      title: "第二章 账本",
    });

    const auditContextCalls = [];
    const auditContextAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          auditContextCalls.push(request);
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋查账本。2. 林秋收束线索。" };
          if (request.prompt_id === "scene_outline_prompt") {
            return {
              content: JSON.stringify([
                {
                  scene_title: "查账本",
                  scene_goal: "林秋确认暗线",
                  characters: ["林秋"],
                  conflict: "账本被藏",
                  expected_turning_point: "暗线出现",
                  target_word_count: 300,
                },
              ]),
            };
          }
          if (request.prompt_id === "scene_writer_prompt") return { content: "林秋翻开账本，看见姐姐名字旁的暗线。\n\n[CHAPTER_END]" };
          if (request.prompt_id === "chapter_completion_auditor_prompt") {
            if (request.user.includes("audit_context")) {
              assert.match(request.user, /content_to_audit/);
              assert.match(request.user, /user_chapter_goal/);
              assert.match(request.user, /scene_outline/);
              assert.match(request.user, /target_word_count/);
              assert.match(request.user, /completion_criteria/);
              assert.doesNotMatch(request.user, /llm_events|craft_rules|metadata|reports/);
              assert.doesNotMatch(request.user, /# Characters|# World|# Style/);
            } else {
              assert.match(request.user, /待审核正文/);
            }
            return {
              content: JSON.stringify({
                is_complete: true,
                ending_status: "完整",
                issues: [],
                suggested_fix: "",
              }),
            };
          }
          if (request.prompt_id === "quality_review_prompt") return { content: JSON.stringify({ quality_score: 90, scene_level_feedback: [], issues: [], suggested_fixes: [], strengths: [], overall_feedback: "ok" }) };
          if (request.prompt_id === "transition_review_prompt") return { content: JSON.stringify({ transition_score: 90, scene_pair_feedback: [], transition_issues: [], suggested_bridge_sentences: [], pacing_notes: [], overall_feedback: "ok" }) };
          if (request.prompt_id === "editorial_suggestions_prompt") return { content: JSON.stringify({ overall_evaluation: "ok", priority_issues: [], transition_suggestions: [], character_motivation_suggestions: [], dialogue_suggestions: [], pacing_suggestions: [], style_suggestions: [], recommend_optimized_version: { recommended: false, reason: "" }, closing_note: "" }) };
          if (request.prompt_id === "summarizer_prompt") return { content: "## 本章摘要\n\n林秋确认暗线。" };
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const auditContextResult = await auditContextAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 24,
      title: "第二十四章 审核上下文包",
      user_instruction: "写一章确认暗线。",
      target_word_count: 300,
      enable_context_pack_for_audit: true,
    });
    const auditPromptCalls = auditContextCalls.filter((call) => call.prompt_id === "chapter_completion_auditor_prompt");
    assert.equal(auditContextResult.ok, true);
    assert.equal(auditPromptCalls.length >= 2, true);
    assert.equal(auditPromptCalls[0].user.includes("audit_context"), false);
    assert.equal(auditPromptCalls.some((call) => call.user.includes("audit_context")), true);
    assert.equal(auditContextResult.generation_metadata.context_pack_audit_enabled, true);
    assert.equal(auditContextResult.generation_metadata.audit_prompt_input_chars_before > auditContextResult.generation_metadata.audit_prompt_input_chars_after, true);
    assert.equal(auditContextResult.generation_metadata.audit_context_estimated_tokens > 0, true);
    assert.equal(auditContextResult.generation_metadata.audit_context_omitted_sections.includes("full_memory"), true);
    assert.equal(auditContextResult.generation_metadata.audit_context_fallback_triggered, false);

    const auditContextFallbackCalls = [];
    let auditContextCallCount = 0;
    const auditContextFallbackAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          auditContextFallbackCalls.push(request);
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋查账本。" };
          if (request.prompt_id === "scene_outline_prompt") return { content: JSON.stringify([{ scene_title: "查账本", scene_goal: "确认暗线", characters: ["林秋"], conflict: "账本被藏", expected_turning_point: "暗线出现", target_word_count: 300 }]) };
          if (request.prompt_id === "scene_writer_prompt") return { content: "林秋翻开账本。\n\n[CHAPTER_END]" };
          if (request.prompt_id === "chapter_completion_auditor_prompt") {
            if (request.user.includes("audit_context")) {
              auditContextCallCount += 1;
              return { content: JSON.stringify({ is_complete: true }) };
            }
            assert.equal(Object.prototype.hasOwnProperty.call(request, "model"), false);
            return { content: JSON.stringify({ is_complete: true, ending_status: "fallback complete", issues: [], suggested_fix: "" }) };
          }
          if (request.prompt_id === "quality_review_prompt") return { content: JSON.stringify({ quality_score: 90, scene_level_feedback: [], issues: [], suggested_fixes: [], strengths: [], overall_feedback: "ok" }) };
          if (request.prompt_id === "transition_review_prompt") return { content: JSON.stringify({ transition_score: 90, scene_pair_feedback: [], transition_issues: [], suggested_bridge_sentences: [], pacing_notes: [], overall_feedback: "ok" }) };
          if (request.prompt_id === "editorial_suggestions_prompt") return { content: JSON.stringify({ overall_evaluation: "ok", priority_issues: [], transition_suggestions: [], character_motivation_suggestions: [], dialogue_suggestions: [], pacing_suggestions: [], style_suggestions: [], recommend_optimized_version: { recommended: false, reason: "" }, closing_note: "" }) };
          if (request.prompt_id === "summarizer_prompt") return { content: "## 本章摘要\n\nfallback 后完成。" };
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const auditContextFallbackResult = await auditContextFallbackAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 25,
      title: "第二十五章 审核 fallback",
      user_instruction: "写一章测试 audit fallback。",
      target_word_count: 300,
      enable_context_pack_for_audit: true,
    });
    assert.equal(auditContextFallbackResult.ok, true);
    assert.equal(auditContextFallbackResult.generation_metadata.audit_context_fallback_triggered, true);
    assert.match(auditContextFallbackResult.generation_metadata.audit_context_fallback_reason, /json_parse_failed|missing_required_fields/);
    assert.equal(auditContextFallbackCalls.some((call) => call.prompt_id === "chapter_completion_auditor_prompt" && call.user.includes("audit_context")), true);
    assert.equal(auditContextFallbackCalls.some((call) => call.prompt_id === "chapter_completion_auditor_prompt" && !call.user.includes("audit_context") && !Object.prototype.hasOwnProperty.call(call, "model")), true);

    const auditContextFailureCalls = [];
    const auditContextFailureAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          auditContextFailureCalls.push(request);
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋查账本。" };
          if (request.prompt_id === "scene_outline_prompt") return { content: JSON.stringify([{ scene_title: "查账本", scene_goal: "确认暗线", characters: ["林秋"], conflict: "账本被藏", expected_turning_point: "暗线出现", target_word_count: 300 }]) };
          if (request.prompt_id === "scene_writer_prompt") return { content: "林秋翻开账本。\n\n[CHAPTER_END]" };
          if (request.prompt_id === "chapter_completion_auditor_prompt") return { content: request.user.includes("audit_context") ? "not json" : "{ bad json" };
          if (request.prompt_id === "chapter_completion_repair_prompt") return { content: "林秋翻开账本，但结尾仍未确认。" };
          if (request.prompt_id === "editorial_suggestions_prompt") return { content: JSON.stringify({ overall_evaluation: "结尾需复查", priority_issues: [], transition_suggestions: [], character_motivation_suggestions: [], dialogue_suggestions: [], pacing_suggestions: [], style_suggestions: [], recommend_optimized_version: { recommended: true, reason: "audit failed" }, closing_note: "" }) };
          if (request.prompt_id === "summarizer_prompt") return { content: "## 本章摘要\n\n审核失败后保存当前稿。" };
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const auditContextFailure = await auditContextFailureAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 26,
      title: "第二十六章 审核失败",
      user_instruction: "写一章测试 audit fallback 失败。",
      target_word_count: 300,
      generation_mode: "standard",
      enable_context_pack_for_audit: true,
    });
    assert.equal(auditContextFailure.ok, true);
    assert.equal(auditContextFailure.completion_audit.is_complete, false);
    assert.equal(auditContextFailure.generation_metadata.audit_context_fallback_triggered, true);
    assert.equal(auditContextFailure.generation_metadata.completion_repair_attempts, 1);
    assert.equal(auditContextFailureCalls.filter((call) => call.prompt_id === "chapter_completion_repair_prompt").length, 1);

    const unknownModeCallStart = calls.length;
    const unknownModeResult = await agent.write_chapter({
      project_id: "work-1",
      chapter_number: 2,
      title: "第四章 未知模式",
      user_instruction: "写第二章，重点是账本和暗号",
      target_word_count: 3000,
      generation_mode: "unknown_mode",
    });
    assert.equal(unknownModeResult.ok, true);
    assert.equal(unknownModeResult.generation_metadata.writing_path, "polished_chapter");
    assert.equal(unknownModeResult.generation_metadata.generation_mode, "unknown_mode");
    assert.equal(unknownModeResult.generation_metadata.execution_plan.path_id, "polished_chapter");
    assert.match(unknownModeResult.generation_metadata.writing_path_warning, /Unknown generation_mode/);
    const unknownModeCalls = calls.slice(unknownModeCallStart);
    assert.equal(unknownModeCalls.some((call) => call.prompt_id === "quality_review_prompt"), true);
    assert.equal(unknownModeCalls.some((call) => call.prompt_id === "transition_review_prompt"), true);
    assert.equal(unknownModeCalls.some((call) => call.prompt_id === "editorial_suggestions_prompt"), true);

    const routedCalls = [];
    let routedAuditCount = 0;
    const routedAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          routedCalls.push(request);
          if (["planner_prompt", "scene_outline_prompt", "scene_writer_prompt", "continue_chapter_prompt", "chapter_completion_repair_prompt"].includes(request.prompt_id)) {
            assert.equal(Object.prototype.hasOwnProperty.call(request, "model"), false, `${request.prompt_id} should not receive model`);
          }
          if (request.prompt_id === "chapter_completion_auditor_prompt") assert.equal(request.model, "test-cheap-model");
          if (["quality_review_prompt", "transition_review_prompt", "editorial_suggestions_prompt"].includes(request.prompt_id)) {
            assert.equal(request.model, "test-review-model");
          }
          if (request.prompt_id === "summarizer_prompt") assert.equal(request.model, "test-summary-model");
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋听见门内提到姐姐。" };
          if (request.prompt_id === "scene_outline_prompt") {
            return {
              content: JSON.stringify([
                {
                  scene_title: "门外",
                  scene_goal: "林秋确认门内谈话",
                  characters: ["林秋"],
                  conflict: "门内声音很低",
                  expected_turning_point: "她听见姐姐名字",
                  target_word_count: 40,
                },
              ]),
            };
          }
          if (request.prompt_id === "scene_writer_prompt") {
            return { content: "林秋停在门口，听见门内有人压低声音", metadata: { finish_reason: "length", status: "completed" } };
          }
          if (request.prompt_id === "continue_chapter_prompt") {
            return { content: "提到姐姐的名字。她没有推门，只把这句话记进心里。\n\n[CHAPTER_END]", metadata: { finish_reason: "stop", status: "completed" } };
          }
          if (request.prompt_id === "chapter_completion_auditor_prompt") {
            routedAuditCount += 1;
            if (routedAuditCount === 1) {
              return { content: JSON.stringify({ is_complete: false, ending_status: "还缺少收束动作", issues: ["结尾动作不足"], suggested_fix: "补一个收束动作。" }) };
            }
            return { content: JSON.stringify({ is_complete: true, ending_status: "完成", issues: [], suggested_fix: "" }) };
          }
          if (request.prompt_id === "chapter_completion_repair_prompt") {
            return { content: "林秋停在门口，听见门内有人压低声音提到姐姐的名字。她没有推门，只把这句话记进心里，然后转身离开。\n\n[CHAPTER_END]", metadata: { finish_reason: "stop", status: "completed" } };
          }
          if (request.prompt_id === "quality_review_prompt") {
            return {
              content: JSON.stringify({
                quality_score: 80,
                scene_level_feedback: [],
                issues: [],
                suggested_fixes: [],
                strengths: ["场景完成。"],
                overall_feedback: "质量稳定。",
              }),
            };
          }
          if (request.prompt_id === "transition_review_prompt") {
            return {
              content: JSON.stringify({
                transition_score: 80,
                scene_pair_feedback: [],
                transition_issues: [],
                suggested_bridge_sentences: [],
                pacing_notes: [],
                overall_feedback: "衔接稳定。",
              }),
            };
          }
          if (request.prompt_id === "editorial_suggestions_prompt") {
            return {
              content: JSON.stringify({
                overall_evaluation: "本章可读。",
                priority_issues: [],
                transition_suggestions: [],
                character_motivation_suggestions: [],
                dialogue_suggestions: [],
                pacing_suggestions: [],
                style_suggestions: [],
                recommend_optimized_version: { recommended: false, reason: "无需。" },
                closing_note: "保持。",
              }),
            };
          }
          if (request.prompt_id === "summarizer_prompt") return { content: "林秋在门外听见姐姐名字后离开。" };
          if (request.prompt_id === "expand_scene_prompt" || request.prompt_id === "compress_scene_prompt") {
            assert.equal(Object.prototype.hasOwnProperty.call(request, "model"), false);
            return { content: "林秋停在门口，听见门内有人压低声音提到姐姐的名字。她没有推门，只把这句话记进心里，然后转身离开。\n\n[CHAPTER_END]" };
          }
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const routedResult = await routedAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 12,
      title: "第十二章 路由",
      user_instruction: "写第十二章，测试模型路由。",
      target_word_count: 40,
      enable_model_routing: true,
      model_routing: {
        tier_models: {
          cheap: "test-cheap-model",
          summary: "test-summary-model",
          review: "test-review-model",
          writing: "test-writing-model",
          mid: "test-mid-model",
        },
      },
    });
    assert.equal(routedResult.ok, true);
    assert.equal(routedResult.generation_metadata.model_policy.routing_enabled, true);
    assert.deepEqual(routedResult.generation_metadata.model_policy.enabled_tiers, ["cheap", "summary", "review"]);
    assert.equal(routedResult.generation_metadata.llm_events.every((event) => event.model_routing_enabled === true), true);
    assert.equal(routedCalls.find((call) => call.prompt_id === "chapter_completion_auditor_prompt").model, "test-cheap-model");
    assert.equal(routedCalls.find((call) => call.prompt_id === "summarizer_prompt").model, "test-summary-model");
    assert.equal(routedCalls.find((call) => call.prompt_id === "quality_review_prompt").model, "test-review-model");
    assert.equal(routedCalls.find((call) => call.prompt_id === "transition_review_prompt").model, "test-review-model");
    assert.equal(routedCalls.find((call) => call.prompt_id === "editorial_suggestions_prompt").model, "test-review-model");
    assert.equal(Object.prototype.hasOwnProperty.call(routedCalls.find((call) => call.prompt_id === "scene_writer_prompt"), "model"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(routedCalls.find((call) => call.prompt_id === "continue_chapter_prompt"), "model"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(routedCalls.find((call) => call.prompt_id === "chapter_completion_repair_prompt"), "model"), false);
    assert.equal(routedResult.generation_metadata.actual_model_sent_usage["test-cheap-model"] > 0, true);
    assert.equal(routedResult.generation_metadata.actual_model_sent_usage["test-summary-model"], 1);
    assert.equal(routedResult.generation_metadata.actual_model_sent_usage["test-review-model"], 3);
    assert.equal(routedResult.generation_metadata.actual_model_sent_usage.__default_client_model__ > 0, true);
    assert.equal(routedResult.generation_metadata.model_routing_warnings.some((warning) => /scene_writer_prompt: tier writing is not allowed/.test(warning)), true);
    assert.equal(routedResult.generation_metadata.model_routing_warnings.some((warning) => /planner_prompt: tier mid is not allowed/.test(warning)), true);

    const fastDraftRoutingCalls = [];
    const fastDraftRoutingAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          fastDraftRoutingCalls.push(request);
          if (["planner_prompt", "scene_outline_prompt", "scene_writer_prompt"].includes(request.prompt_id)) {
            assert.equal(Object.prototype.hasOwnProperty.call(request, "model"), false, `${request.prompt_id} should not receive model`);
          }
          if (request.prompt_id === "chapter_completion_auditor_prompt") assert.equal(request.model, "test-cheap-model");
          if (request.prompt_id === "summarizer_prompt") assert.equal(request.model, "test-summary-model");
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋快速确认账本暗号。" };
          if (request.prompt_id === "scene_outline_prompt") {
            return {
              content: JSON.stringify([
                {
                  scene_title: "快速查验",
                  scene_goal: "林秋确认暗号",
                  characters: ["林秋"],
                  conflict: "时间很紧",
                  expected_turning_point: "暗号重复出现",
                  target_word_count: 40,
                },
              ]),
            };
          }
          if (request.prompt_id === "scene_writer_prompt") {
            return { content: "林秋快速翻到账本末页，确认暗号重复出现。\n\n[CHAPTER_END]", metadata: { finish_reason: "stop", status: "completed" } };
          }
          if (request.prompt_id === "chapter_completion_auditor_prompt") {
            return { content: JSON.stringify({ is_complete: true, ending_status: "完成", issues: [], suggested_fix: "" }) };
          }
          if (request.prompt_id === "summarizer_prompt") return { content: "林秋确认账本暗号重复出现。" };
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const fastDraftRoutingResult = await fastDraftRoutingAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 13,
      title: "第十三章 快速路由",
      user_instruction: "写第十三章，测试 fast draft planning routing。",
      target_word_count: 40,
      generation_mode: "fast_draft",
      enable_model_routing: true,
      model_routing: {
        tier_models: {
          cheap: "test-cheap-model",
          summary: "test-summary-model",
        },
      },
    });
    assert.equal(fastDraftRoutingResult.ok, true);
    assert.equal(Object.prototype.hasOwnProperty.call(fastDraftRoutingCalls.find((call) => call.prompt_id === "planner_prompt"), "model"), false);
    assert.equal(Object.prototype.hasOwnProperty.call(fastDraftRoutingCalls.find((call) => call.prompt_id === "scene_outline_prompt"), "model"), false);
    assert.equal(fastDraftRoutingCalls.find((call) => call.prompt_id === "chapter_completion_auditor_prompt").model, "test-cheap-model");
    assert.equal(fastDraftRoutingCalls.find((call) => call.prompt_id === "summarizer_prompt").model, "test-summary-model");
    assert.equal(
      fastDraftRoutingResult.generation_metadata.model_routing_warnings.some((warning) =>
        /planner_prompt: fast_draft planning routing disabled/.test(warning),
      ),
      true,
    );
    assert.equal(
      fastDraftRoutingResult.generation_metadata.model_routing_warnings.some((warning) =>
        /scene_outline_prompt: fast_draft planning routing disabled/.test(warning),
      ),
      true,
    );

    const auditFallbackCalls = [];
    const auditFallbackAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          auditFallbackCalls.push(request);
          if (["planner_prompt", "scene_outline_prompt", "scene_writer_prompt"].includes(request.prompt_id)) {
            assert.equal(Object.prototype.hasOwnProperty.call(request, "model"), false);
          }
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋复核账本。" };
          if (request.prompt_id === "scene_outline_prompt") {
            return {
              content: JSON.stringify([
                {
                  scene_title: "复核账本",
                  scene_goal: "林秋复核账本",
                  characters: ["林秋"],
                  conflict: "记录前后矛盾",
                  expected_turning_point: "她确认账页被换过",
                  target_word_count: 40,
                },
              ]),
            };
          }
          if (request.prompt_id === "scene_writer_prompt") {
            return { content: "林秋把账本前后页对齐，确认有一页被人换过。\n\n[CHAPTER_END]", metadata: { finish_reason: "stop", status: "completed" } };
          }
          if (request.prompt_id === "chapter_completion_auditor_prompt") {
            if (request.model === "test-cheap-model") return { content: "not json" };
            assert.equal(Object.prototype.hasOwnProperty.call(request, "model"), false);
            return { content: JSON.stringify({ is_complete: true, ending_status: "fallback 完成", issues: [], suggested_fix: "" }) };
          }
          if (request.prompt_id === "quality_review_prompt") {
            return { content: JSON.stringify({ quality_score: 80, scene_level_feedback: [], issues: [], suggested_fixes: [], strengths: [], overall_feedback: "ok" }) };
          }
          if (request.prompt_id === "transition_review_prompt") {
            return { content: JSON.stringify({ transition_score: 80, scene_pair_feedback: [], transition_issues: [], suggested_bridge_sentences: [], pacing_notes: [], overall_feedback: "ok" }) };
          }
          if (request.prompt_id === "editorial_suggestions_prompt") {
            return {
              content: JSON.stringify({
                overall_evaluation: "ok",
                priority_issues: [],
                transition_suggestions: [],
                character_motivation_suggestions: [],
                dialogue_suggestions: [],
                pacing_suggestions: [],
                style_suggestions: [],
                recommend_optimized_version: { recommended: false, reason: "" },
                closing_note: "",
              }),
            };
          }
          if (request.prompt_id === "summarizer_prompt") return { content: "林秋确认账页被换过。" };
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const auditFallbackResult = await auditFallbackAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 14,
      title: "第十四章 审核回退",
      user_instruction: "写第十四章，测试审核回退。",
      target_word_count: 40,
      enable_model_routing: true,
      model_routing: {
        tier_models: {
          cheap: "test-cheap-model",
          summary: "test-summary-model",
          review: "test-review-model",
        },
      },
    });
    assert.equal(auditFallbackResult.ok, true);
    assert.equal(auditFallbackResult.completion_audit.is_complete, true);
    assert.equal(auditFallbackResult.completion_audit.audit_fallback_triggered, true);
    assert.equal(auditFallbackResult.generation_metadata.audit_fallback_triggered, true);
    assert.equal(auditFallbackResult.generation_metadata.audit_fallback_reason, "json_parse_failed");
    assert.equal(auditFallbackResult.generation_metadata.audit_fallback_prompt_id, "chapter_completion_auditor_prompt");
    assert.equal(auditFallbackResult.generation_metadata.audit_fallback_used_default_model, true);
    assert.equal(auditFallbackCalls.filter((call) => call.prompt_id === "chapter_completion_auditor_prompt" && call.model === "test-cheap-model").length > 0, true);
    assert.equal(auditFallbackCalls.filter((call) => call.prompt_id === "chapter_completion_auditor_prompt" && !Object.prototype.hasOwnProperty.call(call, "model")).length > 0, true);
    assert.equal(
      auditFallbackResult.generation_metadata.llm_events.some((event) =>
        event.prompt_id === "chapter_completion_auditor_prompt" &&
        event.model_routing_enabled === false &&
        /fallback used default/.test(event.model_routing_warning),
      ),
      true,
    );

    const auditFallbackFailureCalls = [];
    const auditFallbackFailureAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          auditFallbackFailureCalls.push(request);
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋复核门锁。" };
          if (request.prompt_id === "scene_outline_prompt") {
            return {
              content: JSON.stringify([
                {
                  scene_title: "复核门锁",
                  scene_goal: "林秋复核门锁",
                  characters: ["林秋"],
                  conflict: "门锁有旧痕",
                  expected_turning_point: "她发现锁芯被换过",
                  target_word_count: 40,
                },
              ]),
            };
          }
          if (request.prompt_id === "scene_writer_prompt") {
            return { content: "林秋蹲下查看门锁，发现锁芯被人换过。\n\n[CHAPTER_END]", metadata: { finish_reason: "stop", status: "completed" } };
          }
          if (request.prompt_id === "chapter_completion_auditor_prompt") return { content: "still not json" };
          if (request.prompt_id === "chapter_completion_repair_prompt") {
            assert.equal(Object.prototype.hasOwnProperty.call(request, "model"), false);
            return { content: "林秋蹲下查看门锁，发现锁芯被人换过。她把痕迹记下，决定暂时离开。\n\n[CHAPTER_END]" };
          }
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const auditFallbackFailure = await auditFallbackFailureAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 15,
      title: "第十五章 审核失败",
      user_instruction: "写第十五章，测试审核失败。",
      target_word_count: 40,
      enable_model_routing: true,
      model_routing: {
        tier_models: {
          cheap: "test-cheap-model",
        },
      },
    });
    assert.equal(auditFallbackFailure.ok, true);
    assert.equal(auditFallbackFailure.needs_completion_review, true);
    assert.equal(auditFallbackFailure.completion_audit.is_complete, false);
    assert.equal(auditFallbackFailure.completion_audit.ending_status, "completion audit failed");
    assert.equal(auditFallbackFailure.completion_audit.issues.some((issue) => /JSON parse failed after fallback/.test(issue)), true);
    assert.equal(auditFallbackFailure.generation_metadata.audit_fallback_triggered, true);
    assert.equal(auditFallbackFailure.generation_metadata.audit_fallback_used_default_model, true);
    assert.equal(auditFallbackFailureCalls.filter((call) => call.prompt_id === "chapter_completion_auditor_prompt" && !Object.prototype.hasOwnProperty.call(call, "model")).length > 0, true);

    const qualityFailureCalls = [];
    const qualityFailureAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          qualityFailureCalls.push(request);
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋确认账本暗号。" };
          if (request.prompt_id === "scene_outline_prompt") {
            return {
              content: JSON.stringify([
                {
                  scene_title: "确认暗号",
                  scene_goal: "林秋确认账本暗号",
                  characters: ["林秋"],
                  conflict: "暗号含义不明",
                  expected_turning_point: "她找到重复符号",
                  target_word_count: 40,
                },
              ]),
            };
          }
          if (request.prompt_id === "scene_writer_prompt") {
            return {
              content: "林秋把账本翻到最后一页，终于确认暗号重复出现。\n\n[CHAPTER_END]",
              metadata: { finish_reason: "stop", status: "completed" },
            };
          }
          if (request.prompt_id === "chapter_completion_auditor_prompt") {
            return { content: JSON.stringify({ is_complete: true, ending_status: "完成", issues: [], suggested_fix: "" }) };
          }
          if (request.prompt_id === "quality_review_prompt") throw new Error("quality reviewer unavailable");
          if (request.prompt_id === "summarizer_prompt") return { content: "林秋确认账本暗号重复出现。" };
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const qualitySoftFailed = await qualityFailureAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 9,
      title: "第九章 暗号",
      user_instruction: "写第九章，确认暗号。",
      target_word_count: 40,
    });
    assert.equal(qualitySoftFailed.ok, true);
    assert.equal(qualitySoftFailed.chapter_file, "chapter_009.md");
    assert.equal(qualitySoftFailed.generation_metadata.quality_review_status, "soft_failed");
    assert.equal(qualitySoftFailed.quality_review_file, "");
    assert.match(qualitySoftFailed.generation_metadata.quality_review_error, /quality reviewer unavailable/);
    assert.equal(qualityFailureCalls.some((call) => call.prompt_id === "quality_review_prompt"), true);
    const qualitySoftFailedChapter = await fs.readFile(path.join(root, "work-1", "chapters", "chapter_009.md"), "utf8");
    assert.match(qualitySoftFailedChapter, /暗号重复出现/);
    const qualitySoftFailedMemory = JSON.parse(await fs.readFile(path.join(root, "work-1", "memory.json"), "utf8"));
    assert.equal(qualitySoftFailedMemory.chapter_summaries["chapter-9"].summary, "林秋确认账本暗号重复出现。");

    const transitionFailureCalls = [];
    const transitionFailureAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          transitionFailureCalls.push(request);
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋走过旅馆长廊。2. 她在门口停下。" };
          if (request.prompt_id === "scene_outline_prompt") {
            return {
              content: JSON.stringify([
                {
                  scene_title: "长廊",
                  scene_goal: "林秋穿过旅馆长廊",
                  characters: ["林秋"],
                  conflict: "长廊太暗",
                  expected_turning_point: "她看见门缝透光",
                  target_word_count: 30,
                },
                {
                  scene_title: "门口",
                  scene_goal: "林秋在门口停下",
                  characters: ["林秋"],
                  conflict: "门内有人低声说话",
                  expected_turning_point: "她听见姐姐名字",
                  target_word_count: 30,
                },
              ]),
            };
          }
          if (request.prompt_id === "scene_writer_prompt") {
            if (request.user.includes('"scene_title": "长廊"')) {
              return { content: "林秋穿过旅馆长廊，看见尽头那扇门下透出一线灯光。\n\n[CHAPTER_END]", metadata: { finish_reason: "stop", status: "completed" } };
            }
            return { content: "她在门口停下，听见门内有人压低声音提到姐姐的名字。\n\n[CHAPTER_END]", metadata: { finish_reason: "stop", status: "completed" } };
          }
          if (request.prompt_id === "chapter_completion_auditor_prompt") {
            return { content: JSON.stringify({ is_complete: true, ending_status: "完成", issues: [], suggested_fix: "" }) };
          }
          if (request.prompt_id === "quality_review_prompt") {
            return {
              content: JSON.stringify({
                quality_score: 81,
                scene_level_feedback: [],
                issues: [],
                suggested_fixes: [],
                strengths: ["场景目标明确。"],
                overall_feedback: "质量审查通过。",
              }),
            };
          }
          if (request.prompt_id === "transition_review_prompt") throw new Error("transition reviewer unavailable");
          if (request.prompt_id === "editorial_suggestions_prompt") throw new Error("editorial suggestions unavailable");
          if (request.prompt_id === "summarizer_prompt") return { content: "林秋穿过长廊，在门口听见姐姐的名字。" };
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const transitionSoftFailed = await transitionFailureAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 10,
      title: "第十章 门口",
      user_instruction: "写第十章，检查长廊和门口的衔接。",
      target_word_count: 60,
    });
    assert.equal(transitionSoftFailed.ok, true);
    assert.equal(transitionSoftFailed.chapter_file, "chapter_010.md");
    assert.equal(transitionSoftFailed.generation_metadata.quality_review_status, "completed");
    assert.equal(transitionSoftFailed.generation_metadata.transition_review_status, "soft_failed");
    assert.equal(transitionSoftFailed.generation_metadata.editorial_suggestions_status, "soft_failed");
    assert.equal(transitionSoftFailed.transition_review_file, "");
    assert.match(transitionSoftFailed.generation_metadata.transition_review_error, /transition reviewer unavailable/);
    assert.equal(transitionSoftFailed.editorial_suggestions_file, "");
    assert.match(transitionSoftFailed.generation_metadata.editorial_suggestions_error, /editorial suggestions unavailable/);
    assert.equal(transitionFailureCalls.some((call) => call.prompt_id === "quality_review_prompt"), true);
    assert.equal(transitionFailureCalls.some((call) => call.prompt_id === "transition_review_prompt"), true);
    assert.equal(transitionFailureCalls.some((call) => call.prompt_id === "editorial_suggestions_prompt"), true);
    const transitionSoftFailedChapter = await fs.readFile(path.join(root, "work-1", "chapters", "chapter_010.md"), "utf8");
    assert.match(transitionSoftFailedChapter, /姐姐的名字/);
    const transitionSoftFailedMemory = JSON.parse(await fs.readFile(path.join(root, "work-1", "memory.json"), "utf8"));
    assert.equal(transitionSoftFailedMemory.chapter_summaries["chapter-10"].summary, "林秋穿过长廊，在门口听见姐姐的名字。");

    const editorialOnlyFailureCalls = [];
    const editorialOnlyFailureAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          editorialOnlyFailureCalls.push(request);
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋回到窗边。2. 她发现纸条背面的日期。" };
          if (request.prompt_id === "scene_outline_prompt") {
            return {
              content: JSON.stringify([
                {
                  scene_title: "窗边",
                  scene_goal: "林秋发现纸条背面的日期",
                  characters: ["林秋"],
                  conflict: "日期和姐姐失踪时间不一致",
                  expected_turning_point: "她意识到纸条不是当晚留下的",
                  target_word_count: 50,
                },
              ]),
            };
          }
          if (request.prompt_id === "scene_writer_prompt") {
            return { content: "林秋回到窗边，把纸条翻到背面，看见日期早于姐姐失踪的那天。\n\n[CHAPTER_END]", metadata: { finish_reason: "stop", status: "completed" } };
          }
          if (request.prompt_id === "chapter_completion_auditor_prompt") {
            return { content: JSON.stringify({ is_complete: true, ending_status: "完成", issues: [], suggested_fix: "" }) };
          }
          if (request.prompt_id === "quality_review_prompt") {
            return {
              content: JSON.stringify({
                quality_score: 84,
                scene_level_feedback: [],
                issues: [],
                suggested_fixes: [],
                strengths: ["线索推进明确。"],
                overall_feedback: "质量审查通过。",
              }),
            };
          }
          if (request.prompt_id === "transition_review_prompt") {
            return {
              content: JSON.stringify({
                transition_score: 82,
                scene_pair_feedback: [],
                transition_issues: [],
                suggested_bridge_sentences: [],
                pacing_notes: ["单场景节奏稳定。"],
                overall_feedback: "衔接审查通过。",
              }),
            };
          }
          if (request.prompt_id === "editorial_suggestions_prompt") throw new Error("editorial only unavailable");
          if (request.prompt_id === "summarizer_prompt") return { content: "林秋发现纸条背面的日期早于姐姐失踪当天。" };
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const editorialOnlySoftFailed = await editorialOnlyFailureAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 12,
      title: "第十二章 日期",
      user_instruction: "写第十二章，发现纸条日期。",
      target_word_count: 50,
    });
    assert.equal(editorialOnlySoftFailed.ok, true);
    assert.equal(editorialOnlySoftFailed.generation_metadata.quality_review_status, "completed");
    assert.equal(editorialOnlySoftFailed.generation_metadata.transition_review_status, "completed");
    assert.equal(editorialOnlySoftFailed.generation_metadata.editorial_suggestions_status, "soft_failed");
    assert.match(editorialOnlySoftFailed.generation_metadata.editorial_suggestions_error, /editorial only unavailable/);
    assert.equal(editorialOnlySoftFailed.editorial_suggestions_file, "");
    assert.equal(editorialOnlyFailureCalls.some((call) => call.prompt_id === "quality_review_prompt"), true);
    assert.equal(editorialOnlyFailureCalls.some((call) => call.prompt_id === "transition_review_prompt"), true);
    assert.equal(editorialOnlyFailureCalls.some((call) => call.prompt_id === "editorial_suggestions_prompt"), true);
    const editorialOnlySoftFailedChapter = await fs.readFile(path.join(root, "work-1", "chapters", "chapter_012.md"), "utf8");
    assert.match(editorialOnlySoftFailedChapter, /早于姐姐失踪/);
    const editorialOnlySoftFailedMemory = JSON.parse(await fs.readFile(path.join(root, "work-1", "memory.json"), "utf8"));
    assert.equal(editorialOnlySoftFailedMemory.chapter_summaries["chapter-12"].summary, "林秋发现纸条背面的日期早于姐姐失踪当天。");

    const craftKnowledgeFailureCalls = [];
    const craftKnowledgeFailureAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      craftKnowledgeManager: {
        async select_rules_for_review() {
          throw new Error("craft knowledge unavailable");
        },
      },
      llmClient: {
        async generate(request) {
          craftKnowledgeFailureCalls.push(request);
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋回到柜台。2. 她发现账页被换过。" };
          if (request.prompt_id === "scene_outline_prompt") {
            return {
              content: JSON.stringify([
                {
                  scene_title: "柜台",
                  scene_goal: "林秋确认账页变化",
                  characters: ["林秋"],
                  conflict: "账页被人换过",
                  expected_turning_point: "她发现新纸边缘",
                  target_word_count: 45,
                },
              ]),
            };
          }
          if (request.prompt_id === "scene_writer_prompt") {
            return { content: "林秋回到柜台，发现账本最后一页的纸边比之前新。\n\n[CHAPTER_END]", metadata: { finish_reason: "stop", status: "completed" } };
          }
          if (request.prompt_id === "chapter_completion_auditor_prompt") {
            return { content: JSON.stringify({ is_complete: true, ending_status: "完成", issues: [], suggested_fix: "" }) };
          }
          if (request.prompt_id === "quality_review_prompt") {
            assert.match(request.user, /"craft_rules": \[\]/);
            return {
              content: JSON.stringify({
                quality_score: 79,
                scene_level_feedback: [],
                issues: [],
                suggested_fixes: [],
                strengths: ["线索推进清楚。"],
                overall_feedback: "质量审查在无 craft rules 时仍可运行。",
              }),
            };
          }
          if (request.prompt_id === "transition_review_prompt") {
            assert.match(request.user, /"craft_rules": \[\]/);
            return {
              content: JSON.stringify({
                transition_score: 76,
                scene_pair_feedback: [],
                transition_issues: [],
                suggested_bridge_sentences: [],
                pacing_notes: ["单场景无需额外桥接。"],
                overall_feedback: "衔接审查在无 craft rules 时仍可运行。",
              }),
            };
          }
          if (request.prompt_id === "summarizer_prompt") return { content: "林秋发现账本最后一页被换过。" };
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const craftSoftFallback = await craftKnowledgeFailureAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 11,
      title: "第十一章 新纸",
      user_instruction: "写第十一章，发现账页被换过。",
      target_word_count: 45,
    });
    assert.equal(craftSoftFallback.ok, true);
    assert.equal(craftSoftFallback.generation_metadata.quality_review_status, "completed");
    assert.equal(craftSoftFallback.generation_metadata.transition_review_status, "completed");
    assert.deepEqual(craftSoftFallback.generation_metadata.quality_review_craft_rule_ids, []);
    assert.deepEqual(craftSoftFallback.generation_metadata.transition_review_craft_rule_ids, []);
    assert.match(craftSoftFallback.generation_metadata.quality_review_warning, /craft knowledge unavailable/);
    assert.match(craftSoftFallback.generation_metadata.transition_review_warning, /craft knowledge unavailable/);
    assert.match(craftSoftFallback.quality_review_file, /quality_chapter_011\.md/);
    assert.match(craftSoftFallback.transition_review_file, /transition_chapter_011\.md/);
    assert.equal(craftKnowledgeFailureCalls.some((call) => call.prompt_id === "quality_review_prompt"), true);
    assert.equal(craftKnowledgeFailureCalls.some((call) => call.prompt_id === "transition_review_prompt"), true);
    const craftSoftFallbackChapter = await fs.readFile(path.join(root, "work-1", "chapters", "chapter_011.md"), "utf8");
    assert.match(craftSoftFallbackChapter, /纸边比之前新/);

    const incompleteCalls = [];
    const incompleteAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        auditCalls: 0,
        async generate(request) {
          incompleteCalls.push(request);
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋进入旅馆。\n2. 她发现账本。" };
          if (request.prompt_id === "scene_outline_prompt") {
            return {
              content: JSON.stringify([
                {
                  scene_title: "门外",
                  scene_goal: "林秋看见门外人物",
                  characters: ["林秋", "陈墨"],
                  conflict: "门外来人打断查账",
                  expected_turning_point: "陈墨出现",
                  target_word_count: 20,
                },
              ]),
            };
          }
          if (request.prompt_id === "scene_writer_prompt") {
            return {
              content: "林秋抬起头，看见门外站着",
              metadata: {
                model: "writer-model",
                max_output_tokens: 4096,
                finish_reason: "length",
                status: "completed",
                input_token_usage: 1200,
                output_token_usage: 120,
              },
            };
          }
          if (request.prompt_id === "continue_chapter_prompt") {
            assert.match(request.user, /不要重写前文/);
            assert.match(request.user, /不要总结/);
            assert.match(request.user, /剩余目标字数/);
            assert.match(request.user, /【已生成正文末尾】/);
            assert.match(request.user, /林秋抬起头，看见门外站着/);
            return {
              content: "陈墨。风从他身后卷进来，账本上的灰尘轻轻一颤，她终于知道今晚不能再问下去了。\n\n[CHAPTER_END]",
              metadata: {
                model: "continue-model",
                max_output_tokens: 4096,
                finish_reason: "stop",
                status: "completed",
                input_token_usage: 900,
                output_token_usage: 180,
              },
            };
          }
          if (request.prompt_id === "chapter_completion_auditor_prompt") {
            this.auditCalls += 1;
            return {
              content: JSON.stringify({
                is_complete: true,
                ending_status: "续写后最后一句完整，本章场景已有最小收束。",
                issues: [],
                suggested_fix: "",
              }),
            };
          }
          if (request.prompt_id === "quality_review_prompt") {
            return {
              content: JSON.stringify({
                quality_score: 78,
                scene_level_feedback: [],
                issues: [],
                suggested_fixes: [],
                strengths: ["续写后结尾完整。"],
                overall_feedback: "可用。",
              }),
            };
          }
          if (request.prompt_id === "summarizer_prompt") return { content: "林秋看见陈墨站在门外，决定暂时停止追问。" };
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const incomplete = await incompleteAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 5,
      title: "第五章 门外",
      user_instruction: "写第五章。",
      target_word_count: 45,
    });
    assert.equal(incomplete.ok, true);
    assert.equal(incomplete.needs_completion_review, undefined);
    assert.match(incomplete.content, /今晚不能再问下去了。/);
    assert.doesNotMatch(incomplete.content, /\[CHAPTER_END\]/);
    assert.equal(incomplete.completion_audit.is_complete, true);
    assert.equal(incomplete.generation_metadata.retry_count, 1);
    assert.equal(incomplete.generation_metadata.requested_word_count, 45);
    assert.equal(incomplete.generation_metadata.actual_word_count > 20, true);
    assert.equal(incomplete.generation_metadata.word_count_ratio < 1.2, true);
    assert.equal(incomplete.generation_metadata.needs_expansion, false);
    assert.equal(incomplete.generation_metadata.needs_compression, false);
    assert.equal(incomplete.generation_metadata.finish_reason, "stop");
    assert.equal(incomplete.generation_metadata.was_truncated, false);
    assert.equal(incomplete.generation_metadata.has_chapter_end_marker, true);
    assert.equal(incomplete.generation_metadata.scene_metadata.length, 1);
    assert.equal(incomplete.generation_metadata.scene_metadata[0].adjustment_type, "none");
    assert.equal(incomplete.generation_metadata.llm_events.some((event) => event.prompt_id === "continue_chapter_prompt"), true);
    assert.equal(incomplete.steps.some((step) => step.name === "continue_chapter"), true);
    assert.equal(incomplete.steps.some((step) => step.name === "repair_chapter_completion"), false);
    assert.equal(incomplete.steps.some((step) => step.name === "audit_repaired_chapter_completion"), false);
    assert.equal(incomplete.steps.some((step) => step.name === "save_generation_metadata"), true);
    assert.equal(incomplete.steps.some((step) => step.name === "save_chapter_file"), true);
    assert.equal(
      incompleteCalls.map((call) => call.prompt_id).join(","),
      "planner_prompt,scene_outline_prompt,scene_writer_prompt,continue_chapter_prompt,chapter_completion_auditor_prompt,chapter_completion_auditor_prompt,quality_review_prompt,transition_review_prompt,editorial_suggestions_prompt,summarizer_prompt",
    );

    const truncatedMarkerCalls = [];
    const truncatedMarkerAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          truncatedMarkerCalls.push(request);
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋发现账本暗格。" };
          if (request.prompt_id === "scene_outline_prompt") {
            return {
              content: JSON.stringify([
                {
                  scene_title: "暗格",
                  scene_goal: "林秋发现暗格里的纸条",
                  characters: ["林秋"],
                  conflict: "暗格卡住，纸条只露出一角",
                  expected_turning_point: "纸条指向姐姐留下的地点",
                  target_word_count: 30,
                },
              ]),
            };
          }
          if (request.prompt_id === "scene_writer_prompt") {
            return {
              content: "林秋撬开暗格，纸条边缘露出姐姐熟悉的字迹。\n\n[CHAPTER_END]",
              metadata: {
                model: "scene-length-model",
                max_output_tokens: 1024,
                finish_reason: "length",
                status: "completed",
                input_token_usage: 800,
                output_token_usage: 1024,
              },
            };
          }
          if (request.prompt_id === "continue_chapter_prompt") {
            assert.match(request.user, /纸条边缘露出姐姐熟悉的字迹/);
            return {
              content: "她把纸条完整抽出来，看见背面还有一行更小的字：别相信旅馆里第一个开灯的人。\n\n[CHAPTER_END]",
              metadata: {
                model: "continue-model",
                max_output_tokens: 1024,
                finish_reason: "stop",
                status: "completed",
                input_token_usage: 900,
                output_token_usage: 120,
              },
            };
          }
          if (request.prompt_id === "chapter_completion_auditor_prompt") {
            return {
              content: JSON.stringify({
                is_complete: true,
                ending_status: "场景和章节均已自然收束。",
                issues: [],
                suggested_fix: "",
              }),
            };
          }
          if (request.prompt_id === "quality_review_prompt") {
            return {
              content: JSON.stringify({
                quality_score: 80,
                scene_level_feedback: [],
                issues: [],
                suggested_fixes: [],
                strengths: ["截断后续写成功。"],
                overall_feedback: "可用。",
              }),
            };
          }
          if (request.prompt_id === "summarizer_prompt") return { content: "林秋发现暗格纸条，并看到新的警告。" };
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const truncatedMarker = await truncatedMarkerAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 6,
      title: "第六章 暗格",
      user_instruction: "写第六章。",
      target_word_count: 50,
    });
    assert.equal(truncatedMarker.ok, true);
    assert.match(truncatedMarker.content, /别相信旅馆里第一个开灯的人/);
    assert.doesNotMatch(truncatedMarker.content, /\[CHAPTER_END\]/);
    assert.equal(truncatedMarker.generation_metadata.retry_count, 1);
    assert.equal(truncatedMarker.generation_metadata.scene_metadata[0].llm_events[0].metadata.finish_reason, "length");
    assert.equal(truncatedMarker.generation_metadata.scene_metadata[0].llm_events.some((event) => event.prompt_id === "continue_chapter_prompt"), true);
    assert.equal(truncatedMarker.generation_metadata.scene_metadata[0].ever_truncated, true);
    assert.equal(truncatedMarker.generation_metadata.scene_metadata[0].continued_after_truncation, true);
    assert.equal(truncatedMarker.generation_metadata.scene_metadata[0].final_was_truncated, false);
    assert.equal(
      truncatedMarkerCalls.map((call) => call.prompt_id).join(","),
      "planner_prompt,scene_outline_prompt,scene_writer_prompt,continue_chapter_prompt,chapter_completion_auditor_prompt,chapter_completion_auditor_prompt,quality_review_prompt,transition_review_prompt,editorial_suggestions_prompt,summarizer_prompt",
    );

    const stillTruncatedCalls = [];
    const stillTruncatedAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        continueCalls: 0,
        async generate(request) {
          stillTruncatedCalls.push(request);
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋追到码头。" };
          if (request.prompt_id === "scene_outline_prompt") {
            return {
              content: JSON.stringify([
                {
                  scene_title: "码头",
                  scene_goal: "林秋追到码头尽头",
                  characters: ["林秋"],
                  conflict: "雾太浓，看不清人影",
                  expected_turning_point: "她听见姐姐的声音",
                  target_word_count: 30,
                },
              ]),
            };
          }
          if (request.prompt_id === "scene_writer_prompt") {
            return {
              content: "林秋追到码头尽头，雾里传来姐姐的声音",
              metadata: {
                model: "scene-length-model",
                max_output_tokens: 32,
                finish_reason: "length",
                status: "completed",
              },
            };
          }
          if (request.prompt_id === "continue_chapter_prompt") {
            this.continueCalls += 1;
            return {
              content: `她向前一步，却只看见第 ${this.continueCalls} 层雾后还有更深的影子`,
              metadata: {
                model: "continue-length-model",
                max_output_tokens: 32,
                finish_reason: "length",
                status: this.continueCalls >= 3 ? "incomplete" : "completed",
              },
            };
          }
          if (request.prompt_id === "chapter_completion_auditor_prompt") {
            return {
              content: JSON.stringify({
                is_complete: true,
                ending_status: "测试用审核通过。",
                issues: [],
                suggested_fix: "",
              }),
            };
          }
          if (request.prompt_id === "summarizer_prompt") return { content: "林秋在码头雾中追寻姐姐的声音。" };
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const stillTruncated = await stillTruncatedAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 7,
      title: "第七章 码头",
      user_instruction: "写第七章。",
      target_word_count: 30,
    });
    assert.equal(stillTruncated.ok, true);
    assert.equal(stillTruncated.generation_metadata.scene_metadata[0].ever_truncated, true);
    assert.equal(stillTruncated.generation_metadata.scene_metadata[0].continued_after_truncation, true);
    assert.equal(stillTruncated.generation_metadata.scene_metadata[0].final_was_truncated, true);
    assert.equal(stillTruncatedCalls.filter((call) => call.prompt_id === "continue_chapter_prompt").length, 3);

    const adjustedCalls = [];
    const adjustedAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          adjustedCalls.push(request);
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋看见灯。2. 林秋删去赘述。3. 林秋保留原句。" };
          if (request.prompt_id === "scene_outline_prompt") {
            return {
              content: JSON.stringify([
                {
                  scene_title: "短场景",
                  scene_goal: "林秋看见灯",
                  characters: ["林秋"],
                  conflict: "走廊太暗",
                  expected_turning_point: "灯忽然亮起",
                  target_word_count: 20,
                },
                {
                  scene_title: "长场景",
                  scene_goal: "林秋删去赘述",
                  characters: ["林秋"],
                  conflict: "描述过度拖慢节奏",
                  expected_turning_point: "保留关键发现",
                  target_word_count: 20,
                },
                {
                  scene_title: "失败场景",
                  scene_goal: "林秋保留原句",
                  characters: ["林秋"],
                  conflict: "扩写服务失败",
                  expected_turning_point: "原文仍可使用",
                  target_word_count: 20,
                },
                {
                  scene_title: "更差场景",
                  scene_goal: "林秋听见门响",
                  characters: ["林秋"],
                  conflict: "扩写结果偏离字数目标",
                  expected_turning_point: "门外声响出现",
                  target_word_count: 20,
                },
              ]),
            };
          }
          if (request.prompt_id === "scene_writer_prompt") {
            if (request.user.includes('"scene_title": "短场景"')) return { content: "灯亮。\n\n[CHAPTER_END]", metadata: { finish_reason: "stop", status: "completed" } };
            if (request.user.includes('"scene_title": "长场景"')) {
              return {
                content:
                  "林秋沿着走廊走了很久很久，墙上的水痕一层又一层地反复出现，脚步声也一遍又一遍回到耳边，直到她终于看见门缝里的纸条。\n\n[CHAPTER_END]",
                metadata: { finish_reason: "stop", status: "completed" },
              };
            }
            if (request.user.includes('"scene_title": "更差场景"')) return { content: "门响。\n\n[CHAPTER_END]", metadata: { finish_reason: "stop", status: "completed" } };
            return { content: "原句。\n\n[CHAPTER_END]", metadata: { finish_reason: "stop", status: "completed" } };
          }
          if (request.prompt_id === "expand_scene_prompt") {
            if (request.user.includes("失败场景")) throw new Error("expand unavailable");
            assert.match(request.user, /不允许改变剧情/);
            if (request.user.includes("更差场景")) {
              return {
                content:
                  "门响了又响，林秋在原地听了很久，走廊、墙面、窗缝、地板和远处潮声都被一层一层写得越来越长，直到这个场景明显超过目标字数。\n\n[CHAPTER_END]",
                metadata: { finish_reason: "stop", status: "completed" },
              };
            }
            return {
              content: "灯亮起来时，林秋停在门口，指尖贴着冰冷门把，听见房里有人轻轻吸气。\n\n[CHAPTER_END]",
              metadata: { finish_reason: "length", status: "completed" },
            };
          }
          if (request.prompt_id === "compress_scene_prompt") {
            assert.match(request.user, /不允许删除关键剧情/);
            return {
              content: "林秋穿过潮湿走廊，在门缝里看见那张纸条。\n\n[CHAPTER_END]",
              metadata: { finish_reason: "stop", status: "completed" },
            };
          }
          if (request.prompt_id === "chapter_completion_auditor_prompt") {
            return {
              content: JSON.stringify({
                is_complete: true,
                ending_status: "场景已完成。",
                issues: [],
                suggested_fix: "",
              }),
            };
          }
          if (request.prompt_id === "summarizer_prompt") return { content: "林秋看见灯、纸条，并保留了失败扩写的原句。" };
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const adjusted = await adjustedAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 8,
      title: "第八章 修正",
      user_instruction: "写第八章。",
      target_word_count: 80,
    });
    assert.equal(adjusted.ok, true);
    assert.match(adjusted.content, /听见房里有人轻轻吸气/);
    assert.match(adjusted.content, /在门缝里看见那张纸条/);
    assert.match(adjusted.content, /原句。/);
    assert.match(adjusted.content, /门响。/);
    assert.doesNotMatch(adjusted.content, /明显超过目标字数/);
    assert.doesNotMatch(adjusted.content, /\[CHAPTER_END\]/);
    assert.equal(adjusted.generation_metadata.chapter_word_count_before_adjustments > 0, true);
    assert.equal(adjusted.generation_metadata.chapter_word_count_after_adjustments, adjusted.generation_metadata.actual_word_count);
    assert.equal(adjusted.generation_metadata.chapter_target_word_count, 80);
    assert.equal(
      adjusted.generation_metadata.chapter_distance_before_adjustments,
      Math.abs(adjusted.generation_metadata.chapter_word_count_before_adjustments - 80),
    );
    assert.equal(
      adjusted.generation_metadata.chapter_distance_after_adjustments,
      Math.abs(adjusted.generation_metadata.chapter_word_count_after_adjustments - 80),
    );
    assert.equal(
      adjusted.generation_metadata.chapter_adjustments_improved_total,
      adjusted.generation_metadata.chapter_distance_after_adjustments < adjusted.generation_metadata.chapter_distance_before_adjustments,
    );
    assert.equal(adjusted.generation_metadata.scene_metadata[0].adjustment_type, "expand");
    assert.equal(adjusted.generation_metadata.scene_metadata[0].adjustment_triggered, true);
    assert.equal(adjusted.generation_metadata.scene_metadata[0].adjustment_accepted, true);
    assert.equal(adjusted.generation_metadata.scene_metadata[0].adjustment_was_truncated, true);
    assert.equal(adjusted.generation_metadata.scene_metadata[0].after_distance_to_target < adjusted.generation_metadata.scene_metadata[0].before_distance_to_target, true);
    assert.equal(adjusted.generation_metadata.scene_metadata[0].before_word_count < 17, true);
    assert.equal(adjusted.generation_metadata.scene_metadata[0].after_word_count > adjusted.generation_metadata.scene_metadata[0].before_word_count, true);
    assert.equal(adjusted.generation_metadata.scene_metadata[1].adjustment_type, "compress");
    assert.equal(adjusted.generation_metadata.scene_metadata[1].adjustment_accepted, true);
    assert.equal(adjusted.generation_metadata.scene_metadata[1].after_word_count < adjusted.generation_metadata.scene_metadata[1].before_word_count, true);
    assert.equal(adjusted.generation_metadata.scene_metadata[2].adjustment_type, "expand");
    assert.equal(adjusted.generation_metadata.scene_metadata[2].adjustment_triggered, true);
    assert.equal(adjusted.generation_metadata.scene_metadata[2].adjustment_accepted, false);
    assert.match(adjusted.generation_metadata.scene_metadata[2].adjustment_error, /expand unavailable/);
    assert.equal(adjusted.generation_metadata.scene_metadata[2].after_word_count, adjusted.generation_metadata.scene_metadata[2].before_word_count);
    assert.equal(adjusted.generation_metadata.scene_metadata[3].adjustment_type, "expand");
    assert.equal(adjusted.generation_metadata.scene_metadata[3].adjustment_triggered, true);
    assert.equal(adjusted.generation_metadata.scene_metadata[3].adjustment_accepted, false);
    assert.match(adjusted.generation_metadata.scene_metadata[3].adjustment_rejected_reason, /not closer/i);
    assert.equal(
      adjusted.generation_metadata.scene_metadata[3].after_distance_to_target >= adjusted.generation_metadata.scene_metadata[3].before_distance_to_target,
      true,
    );
    assert.equal(adjustedCalls.some((call) => call.prompt_id === "expand_scene_prompt"), true);
    assert.equal(adjustedCalls.some((call) => call.prompt_id === "compress_scene_prompt"), true);

    const memory = await memoryManager.loadMemory("work-1");
    assert.equal(memory.chapter_summaries["chapter-1"].summary, "林秋抵达旧港。");
    assert.equal(memory.chapter_summaries["chapter-2"].summary, "## 本章摘要\n\n林秋在旅馆账本中发现姐姐名字和陌生暗号。");

    const consistency = await agent.consistency_check({
      project_id: "work-1",
      chapter_number: 2,
    });
    assert.equal(consistency.ok, true);
    assert.equal(consistency.chapter_file, "chapter_002.md");
    assert.equal(consistency.report_file, "consistency_chapter_002.md");
    assert.deepEqual(consistency.report.timeline_issues, []);
    assert.equal(consistency.report.contradictions[0], "姐姐名字出现过早，可能削弱第一卷悬念。");
    assert.equal(consistency.report.suggested_fixes[0], "增加旅馆老板离场的动作，让林秋有时间查看账本。");
    const savedReport = await fs.readFile(path.join(root, "work-1", "reports", "consistency_chapter_002.md"), "utf8");
    assert.match(savedReport, /# Consistency Report/);
    assert.match(savedReport, /character_behavior_issues/);
    assert.match(savedReport, /旅馆老板离场/);
    assert.equal(calls.at(-1).prompt_id, "consistency_checker_prompt");

    const outlineOnly = await agent.generate_chapter_outline({
      project_id: "work-1",
      chapter_number: 2,
      user_instruction: "只生成第二章小纲。",
    });
    assert.equal(outlineOnly.ok, true);
    assert.match(outlineOnly.outline, /林秋检查旅馆账本/);

    const summaryOnly = await agent.summarize_chapter({
      project_id: "work-1",
      chapter_number: 2,
      title: "第二章 账本",
    });
    assert.equal(summaryOnly.ok, true);
    assert.match(summaryOnly.summary, /林秋在旅馆账本/);

    const standaloneSummaryCalls = [];
    const standaloneSummaryAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          standaloneSummaryCalls.push(request);
          assert.equal(request.prompt_id, "summarizer_prompt");
          assert.match(request.user, /summarizer_context/);
          assert.match(request.user, /final_chapter_content/);
          assert.match(request.user, /recent_chapter_summaries/);
          assert.doesNotMatch(request.user, /# Characters/);
          assert.doesNotMatch(request.user, /# World/);
          return { content: "## 本章摘要\n\n独立摘要入口使用上下文包。" };
        },
      },
    });
    const standaloneSummary = await standaloneSummaryAgent.summarize_chapter({
      project_id: "work-1",
      chapter_number: 2,
      title: "第二章 账本",
      enable_context_pack_for_summary: true,
      user_instruction: "独立总结测试。",
    });
    assert.equal(standaloneSummary.ok, true);
    assert.equal(standaloneSummary.summary, "## 本章摘要\n\n独立摘要入口使用上下文包。");
    assert.equal(standaloneSummaryCalls.length, 1);

    const rewritten = await agent.rewrite_text({
      project_id: "work-1",
      chapter_number: 2,
      text: "灰尘在灯下浮动。",
    });
    assert.equal(rewritten.ok, true);
    assert.equal(rewritten.rewritten_text, "林秋翻开账本，灯下的灰尘缓慢浮起。");

    const projectMaterials = await agent.generate_project_materials_from_idea({
      project_id: "work-1",
      idea: "一个失眠的女孩在旧城区发现梦境能改变现实，但每改变一次都会忘记一个亲人。",
    });
    assert.equal(projectMaterials.ok, true);
    assert.match(projectMaterials.materials.outline, /失眠女孩/);
    assert.match(projectMaterials.materials.characters, /女主/);
    assert.match(projectMaterials.materials.world, /梦境改写现实/);
    assert.match(projectMaterials.materials.style, /都市奇幻/);
    assert.match(projectMaterials.materials.goals, /24 章/);
    assert.deepEqual(
      projectMaterials.steps.map((step) => step.name),
      ["read_project_context", "load_project_material_skills", "generate_project_materials", "normalize_project_materials"],
    );

    const selectedMaterialsAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          assert.equal(request.prompt_id, "project_materials_prompt");
          assert.match(request.user, /JSON 必须包含这些字符串字段：outline, goals/);
          return {
            content: JSON.stringify({
              outline: "只发展这条灵感对应的主线推进。",
              goals: "目标 24 章，每章 2800 字，保持慢速展开。",
            }),
          };
        },
      },
    });

    const selectedMaterials = await selectedMaterialsAgent.generate_project_materials_from_idea({
      project_id: "work-1",
      idea: "只想先扩展主线和写作目标。",
      material_types: ["outline", "goals"],
    });
    assert.equal(selectedMaterials.ok, true, selectedMaterials.error);
    assert.deepEqual(Object.keys(selectedMaterials.materials), ["outline", "goals"]);
    assert.match(selectedMaterials.materials.outline, /主线推进/);
    assert.match(selectedMaterials.materials.goals, /24 章/);

    const markdownMaterialsAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          assert.equal(request.prompt_id, "project_materials_prompt");
          return {
            content: [
              "# 项目大纲",
              "失眠女孩在旧城区发现梦境会改写现实。",
              "",
              "# 角色设定",
              "女主长期失眠，害怕忘记亲人。",
              "",
              "# 世界观",
              "梦境改写现实，但会夺走记忆。",
              "",
              "# 风格偏好",
              "悬疑、克制、慢节奏。",
              "",
              "# 写作目标",
              "预计 24 章，每章 2500 字，单章只推进一个小变化。",
            ].join("\n"),
          };
        },
      },
    });
    const markdownMaterials = await markdownMaterialsAgent.generate_project_materials_from_idea({
      project_id: "work-1",
      idea: "一个失眠女孩的故事。",
    });
    assert.equal(markdownMaterials.ok, true);
    assert.match(markdownMaterials.materials.outline, /旧城区/);
    assert.match(markdownMaterials.materials.characters, /长期失眠/);
    assert.match(markdownMaterials.materials.world, /夺走记忆/);
    assert.match(markdownMaterials.materials.style, /慢节奏/);
    assert.match(markdownMaterials.materials.goals, /2500 字/);

    const inlineHeadingMaterialsAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          assert.equal(request.prompt_id, "project_materials_prompt");
          return {
            content: [
              "1. 项目大纲：第一章从失眠女孩发现旧钟停摆开始，慢慢引出梦境规则。",
              "2. 角色设定：女主害怕遗忘亲人，外表冷静但会反复确认细节。",
              "3. 世界观：梦境能改写现实，但每次改写都会夺走一段亲密记忆。",
              "4. 风格偏好：慢节奏悬疑，重视感官细节和心理压迫。",
              "5. 写作目标：预计 36 章，每章 3000 字，每章只推进一个核心变化。",
            ].join("\n"),
          };
        },
      },
    });
    const inlineHeadingMaterials = await inlineHeadingMaterialsAgent.generate_project_materials_from_idea({
      project_id: "work-1",
      idea: "预计 36 章，每章 3000 字，一个失眠女孩的故事。",
    });
    assert.equal(inlineHeadingMaterials.ok, true);
    assert.match(inlineHeadingMaterials.materials.outline, /旧钟停摆/);
    assert.match(inlineHeadingMaterials.materials.characters, /遗忘亲人/);
    assert.match(inlineHeadingMaterials.materials.world, /梦境能改写现实/);
    assert.match(inlineHeadingMaterials.materials.style, /慢节奏悬疑/);
    assert.match(inlineHeadingMaterials.materials.goals, /36 章/);

    const chineseJsonMaterialsAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          assert.equal(request.prompt_id, "project_materials_prompt");
          return {
            content: JSON.stringify({
              materials: {
                项目大纲: "第一章从目标章节数和章字数反推慢节奏开篇。",
                角色设定: "女主对计划失控极其敏感，因此会把灵感记录当作秩序来源。",
                世界观: "创作系统会把灵感、记忆和章节资料分层保存。",
                风格偏好: "克制、慢热、避免一章内完成多个大转折。",
                写作目标: "预计 40 章，每章 2800 字。",
              },
            }),
          };
        },
      },
    });
    const chineseJsonMaterials = await chineseJsonMaterialsAgent.generate_project_materials_from_idea({
      project_id: "work-1",
      idea: "预计 40 章，每章 2800 字。",
    });
    assert.equal(chineseJsonMaterials.ok, true);
    assert.match(chineseJsonMaterials.materials.outline, /慢节奏开篇/);
    assert.match(chineseJsonMaterials.materials.characters, /计划失控/);
    assert.match(chineseJsonMaterials.materials.world, /分层保存/);
    assert.match(chineseJsonMaterials.materials.style, /慢热/);
    assert.match(chineseJsonMaterials.materials.goals, /40 章/);

    const arrayMaterialsAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          assert.equal(request.prompt_id, "project_materials_prompt");
          return {
            content: JSON.stringify([
              { title: "项目大纲", content: "第一章只写主角发现计划表被改动。" },
              { title: "角色设定", content: "主角重视秩序，害怕失控。" },
              { title: "世界观", content: "灵感会被整理成项目资料和记忆。" },
              { title: "风格偏好", content: "慢节奏，少场景切换。" },
              { title: "写作目标", content: "预计 32 章，每章 2600 字。" },
            ]),
          };
        },
      },
    });
    const arrayMaterials = await arrayMaterialsAgent.generate_project_materials_from_idea({
      project_id: "work-1",
      idea: "预计 32 章，每章 2600 字。",
    });
    assert.equal(arrayMaterials.ok, true);
    assert.match(arrayMaterials.materials.outline, /计划表/);
    assert.match(arrayMaterials.materials.goals, /32 章/);

    const looseLabelMaterialsAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          assert.equal(request.prompt_id, "project_materials_prompt");
          return {
            content:
              "项目大纲：第一章只展开一个进入场景。角色设定：主角谨慎，习惯反复确认。世界观：资料、章节和记忆互相独立保存。风格偏好：克制、悬疑。写作目标：预计 28 章，每章 2400 字。",
          };
        },
      },
    });
    const looseLabelMaterials = await looseLabelMaterialsAgent.generate_project_materials_from_idea({
      project_id: "work-1",
      idea: "预计 28 章，每章 2400 字。",
    });
    assert.equal(looseLabelMaterials.ok, true);
    assert.match(looseLabelMaterials.materials.outline, /进入场景/);
    assert.match(looseLabelMaterials.materials.characters, /反复确认/);
    assert.match(looseLabelMaterials.materials.world, /互相独立保存/);
    assert.match(looseLabelMaterials.materials.style, /克制/);
    assert.match(looseLabelMaterials.materials.goals, /28 章/);

    const malformedMaterialsAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          assert.equal(request.prompt_id, "project_materials_prompt");
          return { content: "这是一个没有任何项目资料字段的说明文本。" };
        },
      },
    });
    const malformedMaterials = await malformedMaterialsAgent.generate_project_materials_from_idea({
      project_id: "work-1",
      idea: "格式错误测试。",
    });
    assert.equal(malformedMaterials.ok, false);
    assert.equal(malformedMaterials.failed_step, "normalize_project_materials");
    assert.match(malformedMaterials.raw_materials_preview, /没有任何项目资料字段/);
    assert.match(malformedMaterials.raw_materials_report_file, /project_materials_failed_/);
    const failedReport = await fs.readFile(path.join(root, "work-1", "reports", malformedMaterials.raw_materials_report_file), "utf8");
    assert.match(failedReport, /Raw Model Output/);
    assert.match(failedReport, /没有任何项目资料字段/);

    const fastDraftLengthCalls = [];
    await projectManager.saveProjectMaterial(
      "work-1",
      "goals",
      [
        "# Goals",
        "",
        "目标章节数：200章（正传）+ 5章番外。",
        "每章目标字数：3000-4000字。",
        "单章推进密度：每章至少推进主线剧情1个节点，同时推进感情线1个细节。",
        "慢速展开规则：前5章专注于开篇冲突与人物关系确立，不急于展开世界全貌；",
      ].join("\n"),
    );
    const fastDraftLengthAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          fastDraftLengthCalls.push(request);
          if (request.prompt_id === "planner_prompt") {
            assert.match(request.user, /writing_goal_contract/);
            assert.match(request.user, /chapter_length_plan/);
            assert.match(request.user, /预算写不完的剧情必须推迟到后续章节/);
            return { content: "1. 林秋快速确认账本异常。2. 她带走线索。" };
          }
          if (request.prompt_id === "scene_outline_prompt") {
            assert.match(request.user, /writing_goal_contract/);
            assert.match(request.user, /chapter_length_plan/);
            assert.match(request.user, /deferred_plot_points/);
            assert.match(request.user, /scene_word_budgets/);
            return {
              content: JSON.stringify({
                covered_main_plot_nodes: ["确认账本异常"],
                covered_relationship_details: ["林秋对同伴保留一句解释"],
                deferred_plot_points: ["带走线索后的追查推迟到下一章"],
                why_fits_word_budget: "只保留一个主线节点和一个关系细节。",
                scene_word_budgets: [],
                scenes: Array.from({ length: 5 }, (_, index) => ({
                  scene_title: `快速场景${index + 1}`,
                  scene_goal: "推进账本线索",
                  characters: ["林秋"],
                  conflict: "时间不够",
                  expected_turning_point: "线索出现",
                  target_word_count: 640,
                })),
              }),
            };
          }
          if (request.prompt_id === "scene_writer_prompt") {
            assert.match(request.user, /快速草稿长度约束/);
            assert.match(request.user, /本章目标约 3200 个中文字/);
            assert.match(request.user, /不要超过目标字数的 20%/);
            assert.equal(request.max_output_tokens <= 1700, true);
            assert.equal(request.max_tokens, request.max_output_tokens);
            return {
              content: `${"林".repeat(2500)}\n\n[CHAPTER_END]`,
              metadata: {
                finish_reason: "stop",
                status: "completed",
                max_output_tokens: request.max_output_tokens,
                output_token_usage: request.max_output_tokens,
              },
            };
          }
          if (request.prompt_id === "chapter_completion_auditor_prompt") {
            return {
              content: JSON.stringify({
                is_complete: true,
                ending_status: "完整",
                issues: [],
                suggested_fix: "",
              }),
            };
          }
          if (request.prompt_id === "summarizer_prompt") return { content: "林秋快速确认账本异常并带走线索。" };
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const fastDraftLength = await fastDraftLengthAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 6,
      title: "第六章 快速草稿",
      user_instruction: "写第六章快速草稿。",
      target_word_count: 3200,
      generation_mode: "fast_draft",
    });
    assert.equal(fastDraftLength.ok, true);
    assert.equal(fastDraftLength.generation_metadata.writing_path, "fast_draft");
    assert.equal(fastDraftLength.generation_metadata.target_word_count, 3200);
    assert.equal(fastDraftLength.generation_metadata.actual_word_count, 7500);
    assert.equal(fastDraftLength.generation_metadata.over_target, true);
    assert.equal(fastDraftLength.generation_metadata.over_target_ratio, 2.3438);
    assert.equal(fastDraftLength.generation_metadata.length_warning, "本次草稿偏长，可选择精简。");
    assert.equal(fastDraftLength.warning, "本次草稿偏长，可选择精简。");
    assert.equal(fastDraftLength.generation_metadata.writing_goal_contract_source, "project_materials.goals");
    assert.deepEqual(fastDraftLength.generation_metadata.project_target_word_count_range, { min: 3000, max: 4000 });
    assert.equal(fastDraftLength.generation_metadata.effective_target_word_count, 3200);
    assert.equal(fastDraftLength.generation_metadata.chapter_length_plan.max_scene_count, 3);
    assert.deepEqual(fastDraftLength.generation_metadata.planned_main_plot_nodes, ["确认账本异常"]);
    assert.deepEqual(fastDraftLength.generation_metadata.planned_relationship_details, ["林秋对同伴保留一句解释"]);
    assert.deepEqual(fastDraftLength.generation_metadata.deferred_plot_points, ["带走线索后的追查推迟到下一章"]);
    assert.equal(fastDraftLength.generation_metadata.needs_compression, true);
    assert.equal(fastDraftLength.generation_metadata.skipped_steps.some((step) => step.step === "expand_compress"), true);
    assert.equal(fastDraftLengthCalls.filter((call) => call.prompt_id === "scene_writer_prompt").length, 3);
    assert.equal(fastDraftLengthCalls.some((call) => call.prompt_id === "compress_scene_prompt"), false);
    assert.equal(fastDraftLengthCalls.some((call) => call.prompt_id === "chapter_completion_repair_prompt"), false);
    assert.equal(
      fastDraftLengthCalls
        .filter((call) => call.prompt_id === "scene_writer_prompt")
        .reduce((sum, call) => sum + call.max_output_tokens, 0) < 10000,
      true,
    );

    const hardLimitCalls = [];
    const hardLimitAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate(request) {
          hardLimitCalls.push(request);
          if (request.prompt_id === "planner_prompt") return { content: "1. 林秋发现账本异常。" };
          if (request.prompt_id === "scene_outline_prompt") {
            return {
              content: JSON.stringify({
                covered_main_plot_nodes: ["发现账本异常"],
                covered_relationship_details: ["压下情绪"],
                deferred_plot_points: ["后续追查"],
                why_fits_word_budget: "单场景短章。",
                scene_word_budgets: [{ scene_index: 1, target_word_count: 1000, soft_max_word_count: 1200, hard_max_word_count: 1250 }],
                scenes: [{
                  scene_title: "账本",
                  scene_goal: "发现账本异常",
                  characters: ["林秋"],
                  conflict: "账本被藏",
                  expected_turning_point: "异常出现",
                  target_word_count: 1000,
                }],
              }),
            };
          }
          if (request.prompt_id === "scene_writer_prompt") {
            return {
              content: "林".repeat(1300),
              metadata: { finish_reason: "length", status: "completed", output_token_usage: 1000 },
            };
          }
          if (request.prompt_id === "chapter_completion_auditor_prompt") {
            return { content: JSON.stringify({ is_complete: true, ending_status: "保存超长草稿。", issues: [], suggested_fix: "" }) };
          }
          if (request.prompt_id === "summarizer_prompt") return { content: "林秋发现账本异常。" };
          throw new Error(`Unexpected prompt: ${request.prompt_id}`);
        },
      },
    });
    const hardLimitResult = await hardLimitAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 7,
      title: "第七章 硬上限",
      user_instruction: "写一个短章。",
      target_word_count: 1000,
      generation_mode: "fast_draft",
    });
    assert.equal(hardLimitResult.ok, true);
    assert.equal(hardLimitCalls.some((call) => call.prompt_id === "continue_chapter_prompt"), false);
    assert.equal(hardLimitResult.generation_metadata.continue_blocked_by_length, true);
    assert.equal(hardLimitResult.generation_metadata.continue_blocked_reason, "scene_hard_word_limit_reached");
    assert.equal(hardLimitResult.generation_metadata.scene_metadata[0].continue_blocked_by_length, true);

    const failingAgent = createNovelWritingAgent({
      projectManager,
      memoryManager,
      tools,
      llmClient: {
        async generate() {
          throw new Error("LLM unavailable");
        },
      },
    });
    const failed = await failingAgent.write_chapter({
      project_id: "work-1",
      chapter_number: 3,
      user_instruction: "写第三章。",
    });
    assert.equal(failed.ok, false);
    assert.equal(failed.failed_step, "generate_chapter_outline");
    assert.match(failed.error, /LLM unavailable/);

    assert.throws(
      () => createNovelWritingAgent({ projectManager, memoryManager, tools, llmClient: {} }),
      /llmClient.generate is required/,
    );
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
}

main()
  .then(() => {
    console.log("Novel writing agent tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
