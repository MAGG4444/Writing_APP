const fs = require("node:fs/promises");
const path = require("node:path");

const DEFAULT_WORKFLOWS_ROOT = path.join(__dirname, "..", "workflows");
const DEFAULT_WORKFLOW_INDEX_FILE = "WORKFLOW_INDEX.json";

function createWorkflowRegistry({ workflowsRoot = DEFAULT_WORKFLOWS_ROOT, indexFile = DEFAULT_WORKFLOW_INDEX_FILE } = {}) {
  const resolvedRoot = path.resolve(workflowsRoot);
  const resolvedIndexPath = path.resolve(resolvedRoot, indexFile);
  let index = null;
  const workflowCache = new Map();

  async function loadIndex() {
    const raw = await fs.readFile(resolvedIndexPath, "utf8");
    index = normalizeWorkflowIndex(JSON.parse(raw));
    workflowCache.clear();
    return index;
  }

  async function ensureIndex() {
    if (!index) await loadIndex();
    return index;
  }

  async function getDefaultPath() {
    const loaded = await ensureIndex();
    return loaded.default_path;
  }

  async function listWorkflows() {
    const loaded = await ensureIndex();
    return loaded.paths.map(cloneWorkflowIndexEntry);
  }

  async function getWorkflow(pathId) {
    const id = String(pathId || "").trim();
    if (!id) throw new Error("pathId is required");
    const loaded = await ensureIndex();
    const entry = loaded.paths.find((item) => item.id === id);
    if (!entry) throw new Error(`Unknown workflow path: ${id}`);
    if (workflowCache.has(id)) return cloneWorkflow(workflowCache.get(id));
    const workflowPath = path.resolve(resolvedRoot, entry.file);
    if (!workflowPath.startsWith(`${resolvedRoot}${path.sep}`)) throw new Error(`Invalid workflow file: ${entry.file}`);
    const workflow = normalizeWorkflow(JSON.parse(await fs.readFile(workflowPath, "utf8")), id);
    workflowCache.set(id, workflow);
    return cloneWorkflow(workflow);
  }

  async function listWorkflowSteps(pathId) {
    const workflow = await getWorkflow(pathId);
    return workflow.steps.map(cloneWorkflowStep);
  }

  return {
    loadIndex,
    getDefaultPath,
    listWorkflows,
    getWorkflow,
    listWorkflowSteps,
  };
}

function normalizeWorkflowIndex(source) {
  const paths = Array.isArray(source?.paths) ? source.paths.map(normalizeWorkflowIndexEntry).filter(Boolean) : [];
  assertUniqueIds(paths, "workflow path");
  const defaultPath = String(source?.default_path || "").trim();
  if (!defaultPath) throw new Error("default_path is required");
  if (!paths.some((entry) => entry.id === defaultPath)) throw new Error(`default_path is not listed: ${defaultPath}`);
  return {
    version: Number(source?.version) || 1,
    default_path: defaultPath,
    paths,
  };
}

function normalizeWorkflowIndexEntry(source) {
  if (!source || typeof source !== "object" || Array.isArray(source)) return null;
  const id = String(source.id || "").trim();
  const file = String(source.file || "").trim();
  if (!id || !file) return null;
  return {
    id,
    file,
    cost_level: String(source.cost_level || "").trim(),
    description: String(source.description || "").trim(),
  };
}

function normalizeWorkflow(source, expectedId) {
  const id = String(source?.id || "").trim();
  if (!id) throw new Error("workflow id is required");
  if (expectedId && id !== expectedId) throw new Error(`workflow id mismatch: expected ${expectedId}, got ${id}`);
  const steps = Array.isArray(source?.steps) ? source.steps.map(normalizeWorkflowStep).filter(Boolean) : [];
  assertUniqueIds(steps, "workflow step");
  return {
    id,
    label: String(source?.label || id).trim(),
    cost_level: String(source?.cost_level || "").trim(),
    context_level: String(source?.context_level || "").trim(),
    word_count_strictness: String(source?.word_count_strictness || "").trim(),
    reviewer_level: String(source?.reviewer_level || "").trim(),
    steps,
    craft_rule_policy: source?.craft_rule_policy && typeof source.craft_rule_policy === "object" ? { ...source.craft_rule_policy } : {},
  };
}

function normalizeWorkflowStep(source) {
  if (!source || typeof source !== "object" || Array.isArray(source)) return null;
  const id = String(source.id || "").trim();
  const promptId = String(source.prompt_id || "").trim();
  if (!id || !promptId) return null;
  return {
    id,
    prompt_id: promptId,
    stage: String(source.stage || "").trim(),
    required: Boolean(source.required),
    model_tier: String(source.model_tier || "").trim(),
  };
}

function cloneWorkflowIndexEntry(entry) {
  return { ...entry };
}

function cloneWorkflow(workflow) {
  return {
    ...workflow,
    steps: workflow.steps.map(cloneWorkflowStep),
    craft_rule_policy: { ...workflow.craft_rule_policy },
  };
}

function cloneWorkflowStep(step) {
  return { ...step };
}

function assertUniqueIds(items, label) {
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.id)) throw new Error(`Duplicate ${label} id: ${item.id}`);
    seen.add(item.id);
  }
}

module.exports = {
  DEFAULT_WORKFLOWS_ROOT,
  createWorkflowRegistry,
};
