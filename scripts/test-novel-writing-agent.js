const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const { createMemoryManager } = require("../memory-manager");
const { createNovelWritingAgent } = require("../novel-writing-agent");
const { createProjectManager } = require("../project-manager");
const { createToolManager } = require("../tool-manager");

async function main() {
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
        calls.push(request);
        if (request.prompt_id === "planner_prompt") {
          assert.match(request.user, /第二章调查旅馆账本/);
          assert.match(request.user, /当前目标章节：第 2 章/);
          assert.match(request.user, /林秋抵达旧港/);
          assert.match(request.user, /Story 6W/);
          assert.match(request.user, /Beat Sheet Pacing/);
          return { content: "1. 林秋检查旅馆账本。\n2. 账本出现姐姐名字。\n3. 结尾发现暗号。" };
        }
        if (request.prompt_id === "writer_prompt") {
          assert.match(request.user, /本章小纲/);
          assert.match(request.user, /账本出现姐姐名字/);
          assert.match(request.user, /每章 3000 字/);
          assert.match(request.user, /Character Archetypes/);
          assert.match(request.user, /Beat Sheet Pacing/);
          return { content: "林秋翻开账本，灰尘在灯下浮动。她看见姐姐的名字，旁边画着陌生暗号。" };
        }
        if (request.prompt_id === "summarizer_prompt") {
          assert.match(request.user, /林秋翻开账本/);
          return { content: "林秋在旅馆账本中发现姐姐名字和陌生暗号。" };
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
    assert.equal(result.steps.length, 9);
    assert.equal(result.steps.every((step) => step.status === "completed"), true);
    assert.deepEqual(
      result.steps.map((step) => step.name),
      [
        "read_project_context",
        "read_previous_chapter_summaries",
        "load_planning_skills",
        "generate_chapter_outline",
        "load_drafting_skills",
        "generate_chapter_content",
        "save_chapter_file",
        "summarize_chapter_memory",
        "update_memory",
      ],
    );
    assert.equal(calls.map((call) => call.prompt_id).join(","), "planner_prompt,writer_prompt,summarizer_prompt");

    const savedChapter = await fs.readFile(path.join(root, "work-1", "chapters", "chapter_002.md"), "utf8");
    assert.match(savedChapter, /姐姐的名字/);

    const memory = await memoryManager.loadMemory("work-1");
    assert.equal(memory.chapter_summaries["chapter-1"].summary, "林秋抵达旧港。");
    assert.equal(memory.chapter_summaries["chapter-2"].summary, "林秋在旅馆账本中发现姐姐名字和陌生暗号。");

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
