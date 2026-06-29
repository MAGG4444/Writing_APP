const PROMPT_VARIABLE_KEYS = [
  "outline",
  "characters",
  "world",
  "style",
  "goals",
  "writing_skills",
  "memory",
  "previous_summaries",
  "user_instruction",
];

const EMPTY_VALUE = "（未提供）";

const AGENT_PROMPTS = {
  planner_prompt: {
    id: "planner_prompt",
    name: "章节规划师",
    purpose: "生成章节小纲",
    system:
      "你是一名慢节奏小说章节规划师。你的任务是基于已有大纲、人物、世界观、风格、写作目标和记忆，生成当前章节可执行的小纲。不要写正文，不要总结全书。",
    instruction:
      "请生成章节小纲。要求：1. 只规划当前这一章，不要提前解决后续章节、后续卷或全书主线；2. 慢节奏章节优先使用一个主场景，必要时拆成 2-3 个小节拍，而不是频繁切换场景；3. 每个小节拍只写人物当下行动、感知、对话目标、阻力和一个很小的信息增量；4. 禁止用概述句快进剧情，禁止在本章完成重大真相揭示或大跨度转场；5. 结尾只留下本章钩子或一个未解决问题；6. 不要输出正文。",
  },
  writer_prompt: {
    id: "writer_prompt",
    name: "正文写手",
    purpose: "根据上下文写正文",
    system:
      "你是一名小说正文写手。你的任务是根据项目资料、记忆和用户指令写出连续正文，保留既有风格与人物动机。",
    instruction:
      "请写出本章正文。要求：1. 使用具体场景推进；2. 保持人物行动和设定一致；3. 遵循风格要求；4. 不要解释写作思路，只输出正文。",
  },
  editor_prompt: {
    id: "editor_prompt",
    name: "改稿编辑",
    purpose: "润色正文",
    system:
      "你是一名谨慎的小说改稿编辑。你的任务是在不改变核心情节和人物动机的前提下，提升文字表现、节奏和可读性。",
    instruction:
      "请润色用户提供的正文。要求：1. 保留原意和关键事实；2. 避免改写成完全不同的情节；3. 强化场景感、节奏和语言准确性；4. 只输出修改后的正文。",
  },
  summarizer_prompt: {
    id: "summarizer_prompt",
    name: "章节记忆总结员",
    purpose: "总结章节记忆",
    system:
      "你是一名小说项目记忆整理员。你的任务是把章节内容整理成后续写作可复用的结构化记忆。",
    instruction:
      "请总结本章记忆。要求包含：1. 本章摘要；2. 人物状态变化；3. 新增世界观事实；4. 伏笔；5. 未解决线索；6. 风格或叙事注意事项。",
  },
  consistency_checker_prompt: {
    id: "consistency_checker_prompt",
    name: "设定一致性检查员",
    purpose: "检查设定冲突",
    system:
      "你是一名小说设定一致性检查员。你的任务是找出当前写作计划或正文与既有资料、记忆之间的冲突和风险。",
    instruction:
      "请检查设定冲突。要求：1. 列出明确冲突；2. 标出可能冲突但证据不足的风险；3. 给出最小修改建议；4. 不要代写正文。",
  },
  project_materials_prompt: {
    id: "project_materials_prompt",
    name: "项目资料规划师",
    purpose: "从灵感生成项目资料草稿",
    system:
      "你是一名小说项目资料规划师。你的任务是把用户的一条原始灵感整理成可写入项目资料的草稿，不要写正文。",
    instruction:
      "请根据用户灵感生成项目资料草稿。只输出严格 JSON，不要 Markdown 代码块。JSON 必须包含字符串字段：outline, characters, world, style, goals。每个字段可以使用 Markdown 内容。如果已有项目资料不是“未提供”，必须优先继承已有设定和写作目标；尤其 goals 中已有的目标章节数、每章字数、节奏规则不能随意覆盖。新灵感只能补充、细化或扩展已有资料；如果和已有资料冲突，保留已有资料，并在相关字段中标注“待确认冲突”。要求：outline 要包含阶段目标、主要矛盾链和前 3-5 章的落地点；characters 要写人物欲望、阻碍和关系变化；world 要写规则、限制和代价；style 要写叙事视角、节奏和语言禁忌；goals 必须包含目标章节数、每章目标字数、单章推进密度和慢速展开规则。不要写成抽象口号。",
  },
};

function listAgentPrompts() {
  return Object.values(AGENT_PROMPTS).map(({ id, name, purpose }) => ({ id, name, purpose }));
}

function getAgentPrompt(promptId) {
  const id = String(promptId || "").trim();
  const prompt = AGENT_PROMPTS[id];
  if (!prompt) throw new Error(`Unsupported agent prompt: ${id || "(empty)"}`);
  return prompt;
}

function renderAgentPrompt(promptId, variables = {}) {
  const prompt = getAgentPrompt(promptId);
  const normalized = normalizePromptVariables(variables);
  const user = [
    prompt.instruction,
    "",
    "【项目大纲】",
    normalized.outline,
    "",
    "【人物资料】",
    normalized.characters,
    "",
    "【世界观资料】",
    normalized.world,
    "",
    "【风格要求】",
    normalized.style,
    "",
    "【写作目标】",
    normalized.goals,
    "",
    "【写作技巧】",
    normalized.writing_skills,
    "",
    "【项目记忆】",
    normalized.memory,
    "",
    "【前文章节摘要】",
    normalized.previous_summaries,
    "",
    "【用户指令】",
    normalized.user_instruction,
  ].join("\n");

  return {
    prompt_id: prompt.id,
    name: prompt.name,
    purpose: prompt.purpose,
    system: prompt.system,
    user,
    messages: [
      { role: "system", content: prompt.system },
      { role: "user", content: user },
    ],
    variables: normalized,
  };
}

function renderPlannerPrompt(variables = {}) {
  return renderAgentPrompt("planner_prompt", variables);
}

function renderWriterPrompt(variables = {}) {
  return renderAgentPrompt("writer_prompt", variables);
}

function renderEditorPrompt(variables = {}) {
  return renderAgentPrompt("editor_prompt", variables);
}

function renderSummarizerPrompt(variables = {}) {
  return renderAgentPrompt("summarizer_prompt", variables);
}

function renderConsistencyCheckerPrompt(variables = {}) {
  return renderAgentPrompt("consistency_checker_prompt", variables);
}

function renderProjectMaterialsPrompt(variables = {}) {
  return renderAgentPrompt("project_materials_prompt", variables);
}

function normalizePromptVariables(variables = {}) {
  const source = variables && typeof variables === "object" ? variables : {};
  return Object.fromEntries(PROMPT_VARIABLE_KEYS.map((key) => [key, formatPromptValue(source[key])]));
}

function formatPromptValue(value) {
  if (value == null) return EMPTY_VALUE;
  if (typeof value === "string") return value.trim() || EMPTY_VALUE;
  if (Array.isArray(value)) {
    const items = value.map(formatArrayItem).filter(Boolean);
    return items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : EMPTY_VALUE;
  }
  if (typeof value === "object") {
    const json = JSON.stringify(value, null, 2);
    return json === "{}" ? EMPTY_VALUE : json;
  }
  return String(value);
}

function formatArrayItem(item) {
  if (item == null) return "";
  if (typeof item === "string") return item.trim();
  if (typeof item === "object") return JSON.stringify(item);
  return String(item);
}

module.exports = {
  AGENT_PROMPTS,
  PROMPT_VARIABLE_KEYS,
  listAgentPrompts,
  getAgentPrompt,
  renderAgentPrompt,
  renderPlannerPrompt,
  renderWriterPrompt,
  renderEditorPrompt,
  renderSummarizerPrompt,
  renderConsistencyCheckerPrompt,
  renderProjectMaterialsPrompt,
  normalizePromptVariables,
};
