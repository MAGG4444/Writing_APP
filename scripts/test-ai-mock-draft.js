const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appPath = path.join(__dirname, "..", "app.js");
const mainPath = path.join(__dirname, "..", "main.js");
const source = fs.readFileSync(appPath, "utf8");
const mainSource = fs.readFileSync(mainPath, "utf8");

function extractFunctionFrom(text, name) {
  const start = text.indexOf(`function ${name}`);
  if (start < 0) throw new Error(`Missing function ${name}`);

  const bodyStart = text.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < text.length; index += 1) {
    const char = text[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return text.slice(start, index + 1);
    }
  }

  throw new Error(`Could not extract function ${name}`);
}

function extractAppFunction(name) {
  return extractFunctionFrom(source, name);
}

function extractMainFunction(name) {
  return extractFunctionFrom(mainSource, name);
}

function extractMainConst(name) {
  const start = mainSource.indexOf(`const ${name} =`);
  if (start < 0) throw new Error(`Missing const ${name}`);
  const end = mainSource.indexOf("};", start);
  if (end < 0) throw new Error(`Could not extract const ${name}`);
  return mainSource.slice(start, end + 2);
}

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext([extractAppFunction("createMockAiDraft"), extractAppFunction("createAiPreApplyVersion")].join("\n"), sandbox);

const mainSandbox = {};
vm.createContext(mainSandbox);
vm.runInContext(
  [
    extractMainConst("AI_PROVIDER_DEFAULTS"),
    extractMainConst("AI_PROVIDER_BASE_URLS"),
    "const AI_MAX_OUTPUT_TOKENS = 4096;",
    "const AI_PROMPT_REQUEST_TIMEOUT_MS = 120000;",
    "const AI_PROMPT_MAX_OUTPUT_TOKENS = 2048;",
    extractMainFunction("normalizeAiSettings"),
    extractMainFunction("getPublicAiSettings"),
    extractMainFunction("mergeAiSettingsForSave"),
    extractMainFunction("normalizeWritingAgentPayload"),
    extractMainFunction("createMockWritingAgentDraft"),
    extractMainFunction("buildWritingAgentPrompt"),
    extractMainFunction("buildOpenAiResponseRequest"),
    extractMainFunction("extractOpenAiOutputText"),
    extractMainFunction("normalizeBaseUrl"),
    extractMainFunction("buildProviderEndpoint"),
    extractMainFunction("getWritingAgentSystemPrompt"),
    extractMainFunction("buildOpenAiCompatibleChatRequest"),
    extractMainFunction("extractChatCompletionOutputText"),
    extractMainFunction("buildClaudeMessagesRequest"),
    extractMainFunction("extractClaudeOutputText"),
    extractMainFunction("normalizePromptAgentRequest"),
    extractMainFunction("buildOpenAiPromptResponseRequest"),
    extractMainFunction("buildOpenAiCompatiblePromptChatRequest"),
    extractMainFunction("buildClaudePromptMessagesRequest"),
  ].join("\n"),
  mainSandbox,
);

{
  const draft = sandbox.createMockAiDraft(
    {
      title: "第一章",
      content: "旧版正文",
      outline: "进入场景",
      notes: "保持悬念",
    },
    "zh",
  );
  assert.match(draft, /模拟 AI 新版：第一章/);
  assert.match(draft, /旧版正文/);
  assert.match(draft, /进入场景/);
  assert.match(draft, /保持悬念/);
}

{
  const draft = sandbox.createMockAiDraft({ title: "", content: "", outline: "冲突升级", notes: "" }, "zh");
  assert.match(draft, /当前章节还没有正文/);
  assert.match(draft, /冲突升级/);
}

{
  const draft = sandbox.createMockAiDraft({ title: "", content: "", outline: "", notes: "" }, "en");
  assert.match(draft, /Mock AI version/);
  assert.match(draft, /Add body text/);
}

{
  const version = sandbox.createAiPreApplyVersion("旧版正文", "zh", "version-test", "今天 10:30");
  assert.equal(version.id, "version-test");
  assert.equal(version.label, "AI 覆盖前版本");
  assert.equal(version.time, "今天 10:30");
  assert.equal(version.content, "旧版正文");
}

{
  const version = sandbox.createAiPreApplyVersion("Original body", "en", "version-test", "Today 10:30");
  assert.equal(version.label, "Before AI replacement");
  assert.equal(version.content, "Original body");
}

{
  const normalized = mainSandbox.normalizeWritingAgentPayload({
    language: "en",
    work: { id: 123, title: "Novel" },
    chapter: { id: 456, title: "Opening", content: "Body", outline: "Beat", notes: "Note" },
    extra: "ignored",
  });
  assert.equal(normalized.language, "en");
  assert.equal(normalized.work.id, "123");
  assert.equal(normalized.chapter.id, "456");
  assert.equal(normalized.chapter.content, "Body");
  assert.equal(normalized.extra, undefined);
}

{
  const draft = mainSandbox.createMockWritingAgentDraft({
    language: "zh",
    work: { title: "长篇" },
    chapter: { title: "第一章", content: "正文", outline: "大纲", notes: "备注" },
  });
  assert.match(draft, /模拟 AI 新版：第一章/);
  assert.match(draft, /作品：长篇/);
  assert.match(draft, /正文/);
  assert.match(draft, /大纲/);
  assert.match(draft, /备注/);
}

{
  const settings = mainSandbox.normalizeAiSettings({
    provider: "deepseek",
    model: "deepseek-v4-flash",
    apiKey: "sk-test-secret",
    baseUrl: "https://api.deepseek.com",
    extra: "ignored",
  });
  assert.equal(settings.provider, "deepseek");
  assert.equal(settings.model, "deepseek-v4-flash");
  assert.equal(settings.apiKey, "sk-test-secret");
  assert.equal(settings.extra, undefined);
}

{
  const publicSettings = mainSandbox.getPublicAiSettings({
    provider: "openai",
    model: "gpt-5.5",
    apiKey: "sk-abcdef123456",
  });
  assert.equal(publicSettings.hasApiKey, true);
  assert.equal(publicSettings.apiKeyPreview, "...3456");
  assert.equal(publicSettings.apiKey, undefined);
}

{
  const settings = mainSandbox.mergeAiSettingsForSave(
    { provider: "openai", model: "gpt-5.5", apiKey: "sk-existing", updatedAt: "old" },
    { provider: "claude", model: "claude-sonnet-4-5", apiKey: "", baseUrl: "" },
    "now",
  );
  assert.equal(settings.provider, "claude");
  assert.equal(settings.model, "claude-sonnet-4-5");
  assert.equal(settings.apiKey, "sk-existing");
  assert.equal(settings.updatedAt, "now");
}

{
  const settings = mainSandbox.mergeAiSettingsForSave(
    { provider: "openai", model: "gpt-4.1-mini", apiKey: "sk-existing" },
    { provider: "openai", model: "gpt-4.1", apiKey: "sk-new" },
    "now",
  );
  assert.equal(settings.apiKey, "sk-new");
}

{
  const request = mainSandbox.buildOpenAiResponseRequest(
    { provider: "openai", model: "gpt-5.5", apiKey: "sk-test" },
    {
      language: "zh",
      work: { title: "长篇" },
      chapter: { title: "第一章", content: "正文", outline: "大纲", notes: "备注" },
    },
  );
  assert.equal(request.model, "gpt-5.5");
  assert.match(request.instructions, /小说写作编辑/);
  assert.match(request.input, /作品：长篇/);
  assert.match(request.input, /当前章节正文/);
}

{
  assert.equal(mainSandbox.extractOpenAiOutputText({ output_text: "直接文本" }), "直接文本");
  assert.equal(
    mainSandbox.extractOpenAiOutputText({
      output: [
        {
          content: [
            { text: "第一段" },
            { text: "第二段" },
          ],
        },
      ],
    }),
    "第一段\n第二段",
  );
}

{
  assert.equal(mainSandbox.normalizeBaseUrl("https://api.example.com/v1///"), "https://api.example.com/v1");
  assert.equal(
    mainSandbox.buildProviderEndpoint({ provider: "openai", model: "gpt-5.5", apiKey: "sk-test" }, "responses"),
    "https://api.openai.com/v1/responses",
  );
  assert.equal(
    mainSandbox.buildProviderEndpoint({ provider: "deepseek", model: "deepseek-v4-flash", apiKey: "sk-test" }, "chat/completions"),
    "https://api.deepseek.com/chat/completions",
  );
  assert.equal(
    mainSandbox.buildProviderEndpoint({ provider: "custom", model: "custom-model", apiKey: "sk-test", baseUrl: "https://proxy.example/v1" }, "/chat/completions"),
    "https://proxy.example/v1/chat/completions",
  );
}

{
  const request = mainSandbox.buildOpenAiCompatibleChatRequest(
    { provider: "deepseek", model: "deepseek-v4-flash", apiKey: "sk-test" },
    {
      language: "zh",
      work: { title: "长篇" },
      chapter: { title: "第一章", content: "正文", outline: "大纲", notes: "备注" },
    },
  );
  assert.equal(request.model, "deepseek-v4-flash");
  assert.equal(request.stream, false);
  assert.equal(request.messages[0].role, "system");
  assert.equal(request.messages[1].role, "user");
  assert.match(request.messages[1].content, /当前章节正文/);
}

{
  assert.equal(
    mainSandbox.extractChatCompletionOutputText({
      choices: [{ message: { content: "chat 文本" } }],
    }),
    "chat 文本",
  );
}

{
  const request = mainSandbox.buildClaudeMessagesRequest(
    { provider: "claude", model: "claude-sonnet-4-5", apiKey: "sk-ant-test" },
    {
      language: "zh",
      work: { title: "长篇" },
      chapter: { title: "第一章", content: "正文", outline: "大纲", notes: "备注" },
    },
  );
  assert.equal(request.model, "claude-sonnet-4-5");
  assert.equal(request.max_tokens, 4096);
  assert.equal(request.messages[0].role, "user");
  assert.match(request.system, /小说写作编辑/);
}

{
  assert.equal(
    mainSandbox.extractClaudeOutputText({
      content: [{ type: "text", text: "Claude 第一段" }, { type: "text", text: "Claude 第二段" }],
    }),
    "Claude 第一段\nClaude 第二段",
  );
}

{
  const promptRequest = mainSandbox.normalizePromptAgentRequest({
    prompt_id: "writer_prompt",
    system: "系统提示",
    user: "用户提示",
  });
  assert.equal(promptRequest.prompt_id, "writer_prompt");
  assert.equal(promptRequest.messages[0].content, "系统提示");
  assert.equal(promptRequest.messages[1].content, "用户提示");

  const openAiRequest = mainSandbox.buildOpenAiPromptResponseRequest(
    { provider: "openai", model: "gpt-5.5", apiKey: "sk-test" },
    promptRequest,
  );
  assert.equal(openAiRequest.model, "gpt-5.5");
  assert.equal(openAiRequest.instructions, "系统提示");
  assert.equal(openAiRequest.input, "用户提示");
  assert.equal(openAiRequest.max_output_tokens, 2048);

  const chatRequest = mainSandbox.buildOpenAiCompatiblePromptChatRequest(
    { provider: "deepseek", model: "deepseek-v4-flash", apiKey: "sk-test" },
    promptRequest,
  );
  assert.equal(chatRequest.model, "deepseek-v4-flash");
  assert.equal(chatRequest.max_tokens, 2048);
  assert.equal(chatRequest.stream, false);
  assert.equal(chatRequest.messages[0].role, "system");
  assert.equal(chatRequest.messages[1].role, "user");

  const claudePromptRequest = mainSandbox.buildClaudePromptMessagesRequest(
    { provider: "claude", model: "claude-sonnet-4-5", apiKey: "sk-test" },
    promptRequest,
  );
  assert.equal(claudePromptRequest.max_tokens, 2048);
  assert.equal(claudePromptRequest.system, "系统提示");

  const claudeRequest = mainSandbox.buildClaudePromptMessagesRequest(
    { provider: "claude", model: "claude-sonnet-4-5", apiKey: "sk-test" },
    promptRequest,
  );
  assert.equal(claudeRequest.system, "系统提示");
  assert.equal(claudeRequest.messages[0].content, "用户提示");
}

console.log("AI mock draft tests passed");
