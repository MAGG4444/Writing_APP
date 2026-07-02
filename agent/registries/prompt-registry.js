const fs = require("node:fs/promises");
const path = require("node:path");

const DEFAULT_PROMPTS_ROOT = path.join(__dirname, "..", "prompts");
const DEFAULT_PROMPT_INDEX_FILE = "PROMPT_INDEX.json";
const COST_ORDER = ["low", "medium", "high"];

function createPromptRegistry({ promptsRoot = DEFAULT_PROMPTS_ROOT, indexFile = DEFAULT_PROMPT_INDEX_FILE } = {}) {
  const resolvedRoot = path.resolve(promptsRoot);
  const resolvedIndexPath = path.resolve(resolvedRoot, indexFile);
  let index = null;

  async function loadIndex() {
    const raw = await fs.readFile(resolvedIndexPath, "utf8");
    index = normalizePromptIndex(JSON.parse(raw));
    return index;
  }

  async function ensureIndex() {
    if (!index) await loadIndex();
    return index;
  }

  async function listPrompts() {
    const loaded = await ensureIndex();
    return loaded.prompts.map(clonePromptMeta);
  }

  async function getPromptMeta(promptId) {
    const id = String(promptId || "").trim();
    if (!id) throw new Error("promptId is required");
    const loaded = await ensureIndex();
    const prompt = loaded.prompts.find((entry) => entry.id === id);
    if (!prompt) throw new Error(`Unknown prompt: ${id}`);
    return clonePromptMeta(prompt);
  }

  async function selectPrompts({ path: pathId, stage, tags, maxCostLevel } = {}) {
    const loaded = await ensureIndex();
    const selectedPath = String(pathId || "").trim();
    const selectedStage = String(stage || "").trim();
    const selectedTags = normalizeList(tags).map(normalizeSearchText);
    const maxCost = String(maxCostLevel || "").trim();
    return loaded.prompts
      .filter((prompt) => !selectedPath || prompt.paths.includes(selectedPath))
      .filter((prompt) => !selectedStage || prompt.stage === selectedStage)
      .filter((prompt) => selectedTags.length === 0 || selectedTags.every((tag) => prompt.tags.map(normalizeSearchText).includes(tag)))
      .filter((prompt) => !maxCost || compareCost(prompt.cost_level, maxCost) <= 0)
      .map(clonePromptMeta);
  }

  return {
    loadIndex,
    listPrompts,
    getPromptMeta,
    selectPrompts,
  };
}

function normalizePromptIndex(source) {
  const prompts = Array.isArray(source?.prompts) ? source.prompts.map(normalizePromptMeta).filter(Boolean) : [];
  assertUniqueIds(prompts, "prompt");
  return {
    version: Number(source?.version) || 1,
    prompts,
  };
}

function normalizePromptMeta(source) {
  if (!source || typeof source !== "object" || Array.isArray(source)) return null;
  const id = String(source.id || "").trim();
  if (!id) return null;
  return {
    id,
    file: source.file == null ? null : String(source.file).trim(),
    stage: String(source.stage || "").trim(),
    paths: normalizeList(source.paths),
    cost_level: normalizeCostLevel(source.cost_level),
    model_tier: String(source.model_tier || "").trim(),
    use_when: normalizeList(source.use_when),
    avoid_when: normalizeList(source.avoid_when),
    required_inputs: normalizeList(source.required_inputs),
    outputs: normalizeList(source.outputs),
    tags: normalizeList(source.tags),
    enabled: source.enabled !== false,
  };
}

function clonePromptMeta(prompt) {
  return {
    ...prompt,
    paths: [...prompt.paths],
    use_when: [...prompt.use_when],
    avoid_when: [...prompt.avoid_when],
    required_inputs: [...prompt.required_inputs],
    outputs: [...prompt.outputs],
    tags: [...prompt.tags],
  };
}

function assertUniqueIds(items, label) {
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.id)) throw new Error(`Duplicate ${label} id: ${item.id}`);
    seen.add(item.id);
  }
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  const text = String(value || "").trim();
  if (!text) return [];
  return text.split(/[,\n;；、]/).map((item) => item.trim()).filter(Boolean);
}

function normalizeCostLevel(value) {
  const normalized = String(value || "").trim();
  return COST_ORDER.includes(normalized) ? normalized : "medium";
}

function compareCost(left, right) {
  return COST_ORDER.indexOf(normalizeCostLevel(left)) - COST_ORDER.indexOf(normalizeCostLevel(right));
}

function normalizeSearchText(value) {
  return String(value || "").toLowerCase().trim();
}

module.exports = {
  DEFAULT_PROMPTS_ROOT,
  createPromptRegistry,
};
