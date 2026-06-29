const {
  renderPlannerPrompt,
  renderWriterPrompt,
  renderSummarizerPrompt,
  renderConsistencyCheckerPrompt,
  renderEditorPrompt,
  renderProjectMaterialsPrompt,
} = require("./agent-prompts");
const { createSkillManager } = require("./skill-manager");

const CONSISTENCY_REPORT_KEYS = [
  "contradictions",
  "character_behavior_issues",
  "timeline_issues",
  "worldbuilding_issues",
  "unresolved_questions",
  "suggested_fixes",
];

function createNovelWritingAgent({ projectManager, memoryManager, tools, llmClient, skillManager = createSkillManager() }) {
  if (!projectManager) throw new Error("projectManager is required");
  if (!memoryManager) throw new Error("memoryManager is required");
  if (!tools) throw new Error("tools is required");
  if (!llmClient || typeof llmClient.generate !== "function") throw new Error("llmClient.generate is required");
  if (!skillManager || typeof skillManager.readSkill !== "function") throw new Error("skillManager.readSkill is required");

  async function write_chapter(input = {}) {
    const projectId = normalizeProjectId(input.project_id ?? input.projectId);
    const chapterNumber = normalizeChapterNumber(input.chapter_number ?? input.chapterNumber);
    const userInstruction = String(input.user_instruction ?? input.userInstruction ?? "").trim();
    if (!userInstruction) throw new Error("user_instruction is required");

    const steps = [];
    const chapterId = `chapter-${chapterNumber}`;
    const chapterFileName = createChapterFileName(chapterNumber);

    try {
      const context = await runStep(steps, "read_project_context", () => tools.read_project_context(projectId));
      const previous = await runStep(steps, "read_previous_chapter_summaries", () =>
        tools.get_previous_chapter_summaries(projectId, input.previous_limit ?? input.previousLimit ?? 3, chapterNumber),
      );
      const plannerSkills = await runStep(steps, "load_planning_skills", () =>
        loadSkillContext(["story-6w", "beat-sheet-pacing"]),
      );
      const variables = buildChapterPromptVariables(context, previous.summaries, userInstruction, {
        chapterNumber,
        title: input.title,
        writingSkills: plannerSkills,
      });

      const chapterOutline = await runStep(steps, "generate_chapter_outline", () =>
        generateWithPrompt("planner_prompt", renderPlannerPrompt(variables)),
      );
      const writerSkills = await runStep(steps, "load_drafting_skills", () =>
        loadSkillContext(["beat-sheet-pacing", "character-archetypes"]),
      );
      const chapterContent = await runStep(steps, "generate_chapter_content", () =>
        generateWithPrompt(
          "writer_prompt",
          renderWriterPrompt({
            ...variables,
            writing_skills: writerSkills,
            outline: mergeOutlineForWriter(variables.outline, chapterOutline),
            user_instruction: userInstruction,
          }),
        ),
      );
      const savedChapter = await runStep(steps, "save_chapter_file", () =>
        projectManager.saveProjectChapter(projectId, chapterFileName, chapterContent),
      );
      const summaryText = await runStep(steps, "summarize_chapter_memory", () =>
        generateWithPrompt(
          "summarizer_prompt",
          renderSummarizerPrompt({
            ...variables,
            outline: chapterOutline,
            user_instruction: ["请总结以下本章正文，供后续写作记忆使用。", "", chapterContent].join("\n"),
          }),
        ),
      );
      const memory = await runStep(steps, "update_memory", () =>
        memoryManager.updateChapterSummary(projectId, chapterId, summaryText, {
          title: String(input.title || `第 ${chapterNumber} 章`),
        }),
      );

      return {
        ok: true,
        project_id: projectId,
        chapter_number: chapterNumber,
        chapter_id: chapterId,
        chapter_file: savedChapter.fileName,
        chapter_outline: chapterOutline,
        content: chapterContent,
        summary: summaryText,
        memory,
        steps,
      };
    } catch (error) {
      return {
        ok: false,
        project_id: projectId,
        chapter_number: chapterNumber,
        error: error.message,
        failed_step: steps.find((step) => step.status === "failed")?.name || "",
        steps,
      };
    }
  }

  async function consistency_check(input = {}) {
    const projectId = normalizeProjectId(input.project_id ?? input.projectId);
    const chapterNumber = normalizeChapterNumber(input.chapter_number ?? input.chapterNumber);
    const chapterFileName = String(input.chapter_file ?? input.chapterFile ?? createChapterFileName(chapterNumber));
    const steps = [];

    try {
      const context = await runStep(steps, "read_project_context", () => tools.read_project_context(projectId));
      const writingSkills = await runStep(steps, "load_consistency_skills", () =>
        loadSkillContext(["story-6w", "character-archetypes"]),
      );
      const chapterContent = await runStep(steps, "read_current_chapter", () =>
        readCurrentChapterContent(projectId, chapterNumber, chapterFileName, input.content),
      );
      const variables = buildPromptVariables(
        {
          ...context,
          materials: {
            outline: "",
            characters: context.materials?.characters || "",
            world: context.materials?.world || "",
            style: context.materials?.style || "",
            goals: context.materials?.goals || "",
          },
        },
        Object.values(context.memory?.chapter_summaries || {}).slice(-5),
        buildConsistencyInstruction(chapterNumber, chapterContent),
        writingSkills,
      );
      const rawReport = await runStep(steps, "generate_consistency_report", () =>
        generateWithPrompt("consistency_checker_prompt", renderConsistencyCheckerPrompt(variables)),
      );
      const report = await runStep(steps, "normalize_consistency_report", () =>
        Promise.resolve(normalizeConsistencyReport(rawReport)),
      );
      const reportFileName = createConsistencyReportFileName(chapterNumber);
      const savedReport =
        input.save_report === false
          ? null
          : await runStep(steps, "save_consistency_report", () =>
              projectManager.saveProjectReport(projectId, reportFileName, renderConsistencyReportMarkdown(report, rawReport)),
            );

      return {
        ok: true,
        project_id: projectId,
        chapter_number: chapterNumber,
        chapter_file: chapterFileName,
        report_file: savedReport?.fileName || "",
        report,
        raw_report: rawReport,
        steps,
      };
    } catch (error) {
      return {
        ok: false,
        project_id: projectId,
        chapter_number: chapterNumber,
        error: error.message,
        failed_step: steps.find((step) => step.status === "failed")?.name || "",
        steps,
      };
    }
  }

  async function generate_chapter_outline(input = {}) {
    const projectId = normalizeProjectId(input.project_id ?? input.projectId);
    const chapterNumber = normalizeChapterNumber(input.chapter_number ?? input.chapterNumber);
    const userInstruction = String(input.user_instruction ?? input.userInstruction ?? "").trim();
    if (!userInstruction) throw new Error("user_instruction is required");
    const steps = [];
    try {
      const context = await runStep(steps, "read_project_context", () => tools.read_project_context(projectId));
      const previous = await runStep(steps, "read_previous_chapter_summaries", () =>
        tools.get_previous_chapter_summaries(projectId, input.previous_limit ?? input.previousLimit ?? 3, chapterNumber),
      );
      const writingSkills = await runStep(steps, "load_planning_skills", () =>
        loadSkillContext(["story-6w", "beat-sheet-pacing"]),
      );
      const outline = await runStep(steps, "generate_chapter_outline", () =>
        generateWithPrompt(
          "planner_prompt",
          renderPlannerPrompt(
            buildChapterPromptVariables(context, previous.summaries, userInstruction, {
              chapterNumber,
              title: input.title,
              writingSkills,
            }),
          ),
        ),
      );
      return { ok: true, project_id: projectId, chapter_number: chapterNumber, outline, steps };
    } catch (error) {
      return createFailedResult(projectId, chapterNumber, error, steps);
    }
  }

  async function summarize_chapter(input = {}) {
    const projectId = normalizeProjectId(input.project_id ?? input.projectId);
    const chapterNumber = normalizeChapterNumber(input.chapter_number ?? input.chapterNumber);
    const chapterFileName = String(input.chapter_file ?? input.chapterFile ?? createChapterFileName(chapterNumber));
    const steps = [];
    try {
      const context = await runStep(steps, "read_project_context", () => tools.read_project_context(projectId));
      const chapterContent = await runStep(steps, "read_current_chapter", () =>
        readCurrentChapterContent(projectId, chapterNumber, chapterFileName, input.content),
      );
      const summary = await runStep(steps, "summarize_chapter_memory", () =>
        generateWithPrompt(
          "summarizer_prompt",
          renderSummarizerPrompt({
            ...buildPromptVariables(context, Object.values(context.memory?.chapter_summaries || {}).slice(-5), ""),
            user_instruction: ["请总结以下本章正文，供后续写作记忆使用。", "", chapterContent].join("\n"),
          }),
        ),
      );
      const memory = await runStep(steps, "update_memory", () =>
        memoryManager.updateChapterSummary(projectId, `chapter-${chapterNumber}`, summary, {
          title: String(input.title || `第 ${chapterNumber} 章`),
        }),
      );
      return { ok: true, project_id: projectId, chapter_number: chapterNumber, summary, memory, steps };
    } catch (error) {
      return createFailedResult(projectId, chapterNumber, error, steps);
    }
  }

  async function rewrite_text(input = {}) {
    const projectId = normalizeProjectId(input.project_id ?? input.projectId);
    const chapterNumber = normalizeChapterNumber(input.chapter_number ?? input.chapterNumber);
    const selectedText = String(input.text ?? input.selected_text ?? input.selectedText ?? "").trim();
    if (!selectedText) throw new Error("selected text is required");
    const instruction = String(input.user_instruction ?? input.userInstruction ?? "").trim();
    const steps = [];
    try {
      const context = await runStep(steps, "read_project_context", () => tools.read_project_context(projectId));
      const writingSkills = await runStep(steps, "load_editing_skills", () =>
        loadSkillContext(["beat-sheet-pacing", "character-archetypes"]),
      );
      const rewritten_text = await runStep(steps, "rewrite_selected_text", () =>
        generateWithPrompt(
          "editor_prompt",
          renderEditorPrompt({
            ...buildPromptVariables(context, Object.values(context.memory?.chapter_summaries || {}).slice(-5), [
              instruction || "请改写选中文本，保留原意，提升表达。",
              "",
              "【选中文本】",
              selectedText,
            ].join("\n"), writingSkills),
          }),
        ),
      );
      return { ok: true, project_id: projectId, chapter_number: chapterNumber, rewritten_text, steps };
    } catch (error) {
      return createFailedResult(projectId, chapterNumber, error, steps);
    }
  }

  async function generate_project_materials_from_idea(input = {}) {
    const projectId = normalizeProjectId(input.project_id ?? input.projectId);
    const idea = String(input.idea ?? input.inspiration ?? "").trim();
    const materialTypes = normalizeProjectMaterialTypes(input.material_types ?? input.materialTypes);
    if (!idea) throw new Error("idea is required");
    const steps = [];
    let rawMaterials = "";
    try {
      const context = await runStep(steps, "read_project_context", () => tools.read_project_context(projectId));
      const writingSkills = await runStep(steps, "load_project_material_skills", () =>
        loadSkillContext(["story-6w", "character-archetypes", "beat-sheet-pacing"]),
      );
      rawMaterials = await runStep(steps, "generate_project_materials", () =>
        generateWithPrompt(
          "project_materials_prompt",
          renderProjectMaterialsPrompt({
            outline: context.materials?.outline || "",
            characters: context.materials?.characters || "",
            world: context.materials?.world || "",
            style: context.materials?.style || "",
            goals: context.materials?.goals || "",
            writing_skills: writingSkills,
            memory: context.memory || {},
            previous_summaries: [],
            user_instruction: buildProjectMaterialsInstruction(idea, materialTypes),
          }),
        ),
      );
      const materials = await runStep(steps, "normalize_project_materials", () =>
        Promise.resolve(normalizeProjectMaterialsDraft(rawMaterials, materialTypes)),
      );
      return { ok: true, project_id: projectId, materials, raw_materials: rawMaterials, steps };
    } catch (error) {
      const failedReport = rawMaterials
        ? await saveProjectMaterialsFailureReport(projectId, rawMaterials, error).catch(() => null)
        : null;
      return {
        ok: false,
        project_id: projectId,
        error: failedReport?.fileName
          ? `${error.message}; raw output saved to reports/${failedReport.fileName}`
          : error.message,
        raw_materials_preview: createTextPreview(rawMaterials),
        raw_materials_report_file: failedReport?.fileName || "",
        failed_step: steps.find((step) => step.status === "failed")?.name || "",
        steps,
      };
    }
  }

  async function readCurrentChapterContent(projectId, chapterNumber, chapterFileName, providedContent) {
    const directContent = String(providedContent ?? "").trim();
    if (directContent) return directContent;
    try {
      const chapter = await projectManager.readProjectChapter(projectId, chapterFileName);
      return chapter.content;
    } catch (error) {
      if (error.code && error.code !== "ENOENT") throw error;
      const libraryChapter = await tools.read_chapter(projectId, chapterNumber);
      return libraryChapter.content;
    }
  }

  async function generateWithPrompt(promptId, renderedPrompt) {
    const response = await llmClient.generate({
      prompt_id: promptId,
      system: renderedPrompt.system,
      user: renderedPrompt.user,
      messages: renderedPrompt.messages,
    });
    const text = extractGeneratedText(response);
    if (!text) throw new Error(`${promptId} returned empty content`);
    return text;
  }

  async function loadSkillContext(skillIds) {
    const skills = [];
    for (const skillId of skillIds) {
      const skill = await skillManager.readSkill(skillId);
      skills.push(formatSkillForPrompt(skill));
    }
    return skills.join("\n\n");
  }

  async function saveProjectMaterialsFailureReport(projectId, rawMaterials, error) {
    if (!projectManager || typeof projectManager.saveProjectReport !== "function") return null;
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+$/, "").replace("T", "_");
    return projectManager.saveProjectReport(
      projectId,
      `project_materials_failed_${stamp}.md`,
      [
        "# Project Materials Generation Failed",
        "",
        `Error: ${error.message}`,
        "",
        "## Raw Model Output",
        "",
        "```text",
        String(rawMaterials || "").trim(),
        "```",
        "",
      ].join("\n"),
    );
  }

  return {
    write_chapter,
    consistency_check,
    generate_chapter_outline,
    summarize_chapter,
    rewrite_text,
    generate_project_materials_from_idea,
  };
}

function createFailedResult(projectId, chapterNumber, error, steps) {
  return {
    ok: false,
    project_id: projectId,
    chapter_number: chapterNumber,
    error: error.message,
    failed_step: steps.find((step) => step.status === "failed")?.name || "",
    steps,
  };
}

async function runStep(steps, name, operation) {
  const step = { name, status: "running" };
  steps.push(step);
  try {
    const result = await operation();
    step.status = "completed";
    return result;
  } catch (error) {
    step.status = "failed";
    step.error = error.message;
    throw error;
  }
}

function buildPromptVariables(context, previousSummaries, userInstruction, writingSkills = "") {
  const materials = context.materials || {};
  return {
    outline: materials.outline || "",
    characters: materials.characters || "",
    world: materials.world || "",
    style: materials.style || "",
    goals: materials.goals || "",
    writing_skills: writingSkills,
    memory: context.memory || {},
    previous_summaries: Array.isArray(previousSummaries) ? previousSummaries : [],
    user_instruction: userInstruction,
  };
}

function buildChapterPromptVariables(context, previousSummaries, userInstruction, chapter = {}) {
  const chapterNumber = normalizeChapterNumber(chapter.chapterNumber);
  const title = String(chapter.title || "").trim();
  const writingSkills = String(chapter.writingSkills || "");
  const scopedMemory = {
    ...(context.memory || {}),
    chapter_summaries: Object.fromEntries(
      (Array.isArray(previousSummaries) ? previousSummaries : [])
        .map((summary, index) => {
          const key = summary?.chapter_id || `previous-${index + 1}`;
          return [key, summary];
        }),
    ),
  };
  return buildPromptVariables(
    { ...context, memory: scopedMemory },
    previousSummaries,
    [
      `当前目标章节：第 ${chapterNumber} 章${title ? `《${title}》` : ""}。`,
      "只生成这一章的小纲或正文，不要把后续章节当作已发生内容。",
      "如果前文章节摘要为空，说明这是第一章或前文尚未写入记忆，请从第一章的进入场景开始。",
      "",
      userInstruction,
    ].join("\n"),
    writingSkills,
  );
}

function formatSkillForPrompt(skill) {
  return [
    `# ${skill.name || skill.id}`,
    skill.description ? `用途：${skill.description}` : "",
    String(skill.body || "").trim(),
  ]
    .filter(Boolean)
    .join("\n");
}

function mergeOutlineForWriter(projectOutline, chapterOutline) {
  return [
    "项目大纲：",
    projectOutline || "（未提供）",
    "",
    "本章小纲：",
    chapterOutline || "（未提供）",
  ].join("\n");
}

function extractGeneratedText(response) {
  if (typeof response === "string") return response.trim();
  if (typeof response?.content === "string") return response.content.trim();
  if (typeof response?.text === "string") return response.text.trim();
  return "";
}

function createTextPreview(text, limit = 1200) {
  const source = String(text || "").trim();
  if (!source) return "";
  return source.length > limit ? `${source.slice(0, limit)}...` : source;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeProjectId(value) {
  const id = String(value || "").trim();
  if (!id) throw new Error("project_id is required");
  return id;
}

function normalizeChapterNumber(value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) throw new Error("chapter_number must be a positive integer");
  return number;
}

function createChapterFileName(chapterNumber) {
  return `chapter_${String(chapterNumber).padStart(3, "0")}.md`;
}

function createConsistencyReportFileName(chapterNumber) {
  return `consistency_chapter_${String(chapterNumber).padStart(3, "0")}.md`;
}

function buildConsistencyInstruction(chapterNumber, chapterContent) {
  return [
    `请检查第 ${chapterNumber} 章正文是否和项目人物设定、世界观设定、memory.json、前文记忆冲突。`,
    "不要修改正文，只输出严格 JSON，不要 Markdown 代码块。",
    "JSON 必须包含这些数组字段：contradictions, character_behavior_issues, timeline_issues, worldbuilding_issues, unresolved_questions, suggested_fixes。",
    "每个数组项应是短句或对象，能让作者定位问题和修改方向。",
    "",
    "【当前章节正文】",
    chapterContent,
  ].join("\n");
}

function buildProjectMaterialsInstruction(idea, materialTypes = null) {
  const selectedTypes = normalizeProjectMaterialTypes(materialTypes);
  const selectedText = selectedTypes.join(", ");
  return [
    "请把以下灵感发展成项目资料草稿。",
    "只输出严格 JSON，不要 Markdown 代码块。",
    `JSON 必须包含这些字符串字段：${selectedText}。不要输出未被要求的字段。`,
    `内容要适合直接写入这些项目资料文件：${selectedTypes.map((type) => `${type}.md`).join(", ")}。`,
    "如果已有项目资料已提供，必须在此基础上补充和细化，不要从零重写。",
    "已有 goals 中的目标章节数、每章目标字数、节奏规则优先级最高，除非原始灵感明确要求修改。",
    "如果原始灵感与已有资料冲突，保留已有资料，并在对应字段里写明“待确认冲突”。",
    selectedTypes.includes("outline") ? "outline 要包含阶段目标、主要矛盾链和前 3-5 章的具体落地点。" : "",
    selectedTypes.includes("characters") ? "characters 要写人物欲望、阻碍和关系变化。" : "",
    selectedTypes.includes("world") ? "world 要写规则、限制和代价。" : "",
    selectedTypes.includes("style") ? "style 要写叙事视角、节奏和语言禁忌。" : "",
    selectedTypes.includes("goals") ? "goals 必须包含目标章节数、每章目标字数、单章推进密度和慢速展开规则。" : "",
    "每个字段控制在 300 到 600 个中文字符以内，先给作者可继续扩展的第一版，不要追求完整长篇设定。",
    "",
    "【原始灵感】",
    idea,
  ].filter(Boolean).join("\n");
}

const PROJECT_MATERIAL_SECTION_ALIASES = {
  outline: ["outline", "项目大纲", "故事大纲", "大纲"],
  characters: ["characters", "character", "角色设定", "人物设定", "人物资料", "角色", "人物"],
  world: ["world", "worldbuilding", "世界观", "世界设定"],
  style: ["style", "风格偏好", "叙事风格", "文风", "风格"],
  goals: ["goals", "goal", "写作目标", "写作规格", "目标", "篇幅", "规格"],
};

function normalizeProjectMaterialTypes(value) {
  const keys = Object.keys(PROJECT_MATERIAL_SECTION_ALIASES);
  const selected = Array.isArray(value)
    ? [...new Set(value.map((item) => String(item)).filter((item) => keys.includes(item)))]
    : [];
  return selected.length > 0 ? selected : keys;
}

function normalizeProjectMaterialsDraft(rawMaterials, materialTypes = null) {
  const selectedTypes = normalizeProjectMaterialTypes(materialTypes);
  const parsed = parseJsonObject(rawMaterials);
  const source =
    parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed)
        ? parseProjectMaterialsArray(parsed)
        : parseProjectMaterialsMarkdown(rawMaterials);

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    throw new Error("project_materials_prompt must return JSON or Markdown sections");
  }
  const materials = normalizeProjectMaterialFields(source, selectedTypes);
  const missing = Object.entries(materials)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length > 0) {
    throw new Error(`project_materials_prompt missing fields: ${missing.join(", ")}`);
  }
  return materials;
}

function normalizeProjectMaterialFields(source, materialTypes = null) {
  const object = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  const nested = object.materials && typeof object.materials === "object" && !Array.isArray(object.materials) ? object.materials : null;
  const target = nested || object;
  const selectedTypes = normalizeProjectMaterialTypes(materialTypes);
  return Object.fromEntries(
    selectedTypes.map((key) => [key, getProjectMaterialValue(target, key)]),
  );
}

function parseProjectMaterialsArray(items) {
  const sections = {};
  for (const item of items) {
    if (typeof item === "string") {
      Object.assign(sections, parseProjectMaterialsMarkdown(item));
      continue;
    }
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const key = getProjectMaterialKeyFromHeading(item.key || item.name || item.title || item.type || item.section || item.material || "");
    const value = item.value ?? item.content ?? item.text ?? item.body ?? item.markdown ?? "";
    if (key && value) sections[key] = String(value).trim();
  }
  return sections;
}

function getProjectMaterialValue(source, key) {
  if (source[key] != null) return String(source[key]).trim();
  const aliases = PROJECT_MATERIAL_SECTION_ALIASES[key] || [];
  const entry = Object.entries(source).find(([sourceKey]) =>
    aliases.some((alias) => normalizeProjectMaterialsHeading(sourceKey).includes(normalizeProjectMaterialsHeading(alias))),
  );
  return entry ? String(entry[1] ?? "").trim() : "";
}

function parseProjectMaterialsMarkdown(text) {
  const sections = {};
  let currentKey = "";
  for (const line of String(text || "").split(/\r?\n/)) {
    const headingLine = parseProjectMaterialsHeadingLine(line);
    if (headingLine.heading) {
      const nextKey = getProjectMaterialKeyFromHeading(headingLine.heading);
      if (nextKey) {
        currentKey = nextKey;
        sections[currentKey] ||= [];
        if (headingLine.content) sections[currentKey].push(headingLine.content);
        continue;
      }
    }
    if (currentKey) sections[currentKey].push(line);
  }

  const parsedSections = Object.fromEntries(
    Object.entries(sections).map(([key, value]) => [key, value.join("\n").trim()]),
  );
  const labeledSections = parseProjectMaterialsLabeledText(text);
  return {
    ...Object.fromEntries(Object.entries(parsedSections).filter(([, value]) => value)),
    ...labeledSections,
  };
}

function parseProjectMaterialsLabeledText(text) {
  const source = String(text || "").trim();
  if (!source) return {};
  const labels = [];
  for (const [key, aliases] of Object.entries(PROJECT_MATERIAL_SECTION_ALIASES)) {
    for (const alias of aliases) {
      const escaped = escapeRegExp(alias);
      const pattern = new RegExp(`(?:^|\\n|[\\s。；;，,])(?:[-*+]|\\d+[.)、．]|[一二三四五六七八九十]+[、．.])?\\s*(?:\\*\\*)?${escaped}(?:\\*\\*)?\\s*[：:]`, "gi");
      let match;
      while ((match = pattern.exec(source))) {
        labels.push({ key, start: match.index, contentStart: pattern.lastIndex });
      }
    }
  }
  labels.sort((a, b) => a.start - b.start);
  const uniqueLabels = labels.filter((label, index) => index === 0 || label.start !== labels[index - 1].start);
  const sections = {};
  uniqueLabels.forEach((label, index) => {
    const next = uniqueLabels[index + 1];
    const content = source.slice(label.contentStart, next ? next.start : source.length).trim();
    if (content && !sections[label.key]) sections[label.key] = content;
  });
  return sections;
}

function parseProjectMaterialsHeadingLine(line) {
  const source = String(line || "").trim();
  if (!source) return { heading: "", content: "" };

  const normalized = source
    .replace(/^\s{0,3}#{1,4}\s+/, "")
    .replace(/^\s*(?:[-*+]|\d+[.)、．]|[一二三四五六七八九十]+[、．.])\s*/, "")
    .replace(/^\*\*(.+?)\*\*\s*/, "$1 ");

  const headingOnly = normalized.match(
    /^(outline|characters?|world(?:building)?|style|goals?|项目大纲|故事大纲|大纲|角色设定|人物设定|人物资料|角色|人物|世界观|世界设定|风格偏好|叙事风格|文风|写作目标|写作规格|目标章节|章字数|目标字数|目标|篇幅|规格)\s*$/i,
  );
  if (headingOnly) return { heading: headingOnly[1], content: "" };

  const headingWithContent = normalized.match(
    /^(outline|characters?|world(?:building)?|style|goals?|项目大纲|故事大纲|大纲|角色设定|人物设定|人物资料|角色|人物|世界观|世界设定|风格偏好|叙事风格|文风|写作目标|写作规格|目标章节|章字数|目标字数|目标|篇幅|规格)\s*[：:]\s*(.*)$/i,
  );
  if (headingWithContent) {
    return {
      heading: headingWithContent[1],
      content: headingWithContent[2].trim(),
    };
  }

  return { heading: "", content: "" };
}

function getProjectMaterialKeyFromHeading(heading) {
  const normalized = normalizeProjectMaterialsHeading(heading);
  for (const [key, aliases] of Object.entries(PROJECT_MATERIAL_SECTION_ALIASES)) {
    if (aliases.some((alias) => normalized.includes(normalizeProjectMaterialsHeading(alias)))) {
      return key;
    }
  }
  return "";
}

function normalizeProjectMaterialsHeading(heading) {
  return String(heading || "")
    .toLowerCase()
    .replace(/^#+\s*/, "")
    .replace(/\*\*/g, "")
    .replace(/[：:]/g, "")
    .trim();
}

function normalizeConsistencyReport(rawReport) {
  const parsed = parseJsonObject(rawReport);
  const source = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  const report = Object.fromEntries(CONSISTENCY_REPORT_KEYS.map((key) => [key, normalizeReportItems(source[key])]));
  if (!parsed) {
    report.unresolved_questions = [
      ...report.unresolved_questions,
      "LLM 未返回可解析 JSON；请查看 raw_report。",
    ];
  }
  return report;
}

function parseJsonObject(text) {
  const raw = String(text || "").trim();
  if (!raw) return null;
  const unfenced = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  try {
    return JSON.parse(unfenced);
  } catch (_error) {
    const start = unfenced.indexOf("{");
    const end = unfenced.lastIndexOf("}");
    if (start < 0 || end <= start) return null;
    try {
      return JSON.parse(unfenced.slice(start, end + 1));
    } catch (_nestedError) {
      return null;
    }
  }
}

function normalizeReportItems(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (item == null) return "";
      if (typeof item === "string") return item.trim();
      if (typeof item === "object") return JSON.stringify(item);
      return String(item);
    })
    .filter(Boolean);
}

function renderConsistencyReportMarkdown(report, rawReport) {
  return [
    "# Consistency Report",
    "",
    ...CONSISTENCY_REPORT_KEYS.flatMap((key) => [`## ${key}`, "", renderReportList(report[key]), ""]),
    "## raw_report",
    "",
    String(rawReport || "").trim(),
    "",
  ].join("\n");
}

function renderReportList(items) {
  return Array.isArray(items) && items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : "（无）";
}

module.exports = {
  createNovelWritingAgent,
  buildPromptVariables,
  createChapterFileName,
  createConsistencyReportFileName,
  normalizeConsistencyReport,
};
