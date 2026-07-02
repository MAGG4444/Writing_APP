const { createWorkflowRegistry } = require("../registries/workflow-registry");

const GENERATION_MODE_TO_PATH = {
  fast_draft: "fast_draft",
  standard_chapter: "standard_chapter",
  standard: "standard_chapter",
  polished_chapter: "polished_chapter",
  full_review: "polished_chapter",
  polished: "polished_chapter",
};

function createWritingPathRouter({ workflowRegistry = createWorkflowRegistry() } = {}) {
  if (!workflowRegistry || typeof workflowRegistry.getDefaultPath !== "function") {
    throw new Error("workflowRegistry.getDefaultPath is required");
  }
  if (typeof workflowRegistry.listWorkflows !== "function") {
    throw new Error("workflowRegistry.listWorkflows is required");
  }
  if (typeof workflowRegistry.getWorkflow !== "function") {
    throw new Error("workflowRegistry.getWorkflow is required");
  }

  async function getDefaultPath() {
    return workflowRegistry.getDefaultPath();
  }

  async function resolveWritingPath(input = {}) {
    const defaultPath = await getDefaultPath();
    const workflows = await workflowRegistry.listWorkflows();
    const knownPaths = new Set(workflows.map((workflow) => workflow.id));
    const rawPath = String(input.writing_path ?? input.writingPath ?? "").trim();
    const rawMode = String(input.generation_mode ?? input.generationMode ?? "").trim();
    const mappedModePath = rawMode ? GENERATION_MODE_TO_PATH[rawMode] : "";
    const requestedPath = rawPath || mappedModePath || defaultPath;
    const warnings = [];

    if (rawPath && !knownPaths.has(rawPath)) {
      warnings.push(`Unknown writing_path "${rawPath}", falling back to ${defaultPath}.`);
    }
    if (!rawPath && rawMode && !mappedModePath) {
      warnings.push(`Unknown generation_mode "${rawMode}", falling back to ${defaultPath}.`);
    }
    if (rawPath && rawMode && mappedModePath && rawPath !== mappedModePath) {
      warnings.push(`writing_path "${rawPath}" overrides generation_mode "${rawMode}".`);
    }

    const pathId = knownPaths.has(requestedPath) ? requestedPath : defaultPath;
    return {
      writing_path: pathId,
      generation_mode: rawMode,
      warning: warnings.join(" "),
    };
  }

  async function buildExecutionPlan(pathId) {
    const defaultPath = await getDefaultPath();
    const workflow = await workflowRegistry.getWorkflow(pathId || defaultPath);
    return {
      path_id: workflow.id,
      label: workflow.label,
      cost_level: workflow.cost_level,
      context_level: workflow.context_level,
      word_count_strictness: workflow.word_count_strictness,
      reviewer_level: workflow.reviewer_level,
      steps: workflow.steps.map((step) => ({
        id: step.id,
        prompt_id: step.prompt_id,
        stage: step.stage,
        required: step.required,
        model_tier: step.model_tier,
      })),
    };
  }

  return {
    resolveWritingPath,
    buildExecutionPlan,
    getDefaultPath,
  };
}

module.exports = {
  GENERATION_MODE_TO_PATH,
  createWritingPathRouter,
};
