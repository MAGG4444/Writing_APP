const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { createWorkflowRegistry } = require("../agent/registries/workflow-registry");

async function main() {
  const registry = createWorkflowRegistry();
  const index = await registry.loadIndex();
  assert.equal(index.version, 1);

  assert.equal(await registry.getDefaultPath(), "polished_chapter");

  const workflows = await registry.listWorkflows();
  const workflowIds = new Set(workflows.map((workflow) => workflow.id));
  assert.deepEqual([...workflowIds].sort(), ["fast_draft", "polished_chapter", "standard_chapter"]);

  const polishedSteps = await registry.listWorkflowSteps("polished_chapter");
  const polishedPromptIds = new Set(polishedSteps.map((step) => step.prompt_id));
  for (const promptId of [
    "planner_prompt",
    "scene_outline_prompt",
    "scene_writer_prompt",
    "continue_chapter_prompt",
    "chapter_completion_auditor_prompt",
    "chapter_completion_repair_prompt",
    "expand_scene_prompt",
    "compress_scene_prompt",
    "quality_review_prompt",
    "transition_review_prompt",
    "editorial_suggestions_prompt",
    "summarizer_prompt",
  ]) {
    assert.equal(polishedPromptIds.has(promptId), true, `polished workflow missing ${promptId}`);
  }

  const fastSteps = await registry.listWorkflowSteps("fast_draft");
  const fastPromptIds = new Set(fastSteps.map((step) => step.prompt_id));
  assert.equal(fastPromptIds.has("quality_review_prompt"), false);
  assert.equal(fastPromptIds.has("transition_review_prompt"), false);
  assert.equal(fastPromptIds.has("editorial_suggestions_prompt"), false);
  const fastWorkflow = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "agent", "workflows", "fast_draft.json"), "utf8"));
  assert.equal(fastWorkflow.fast_limits.scene_completion_audit, "disabled");
  assert.equal(fastWorkflow.fast_limits.scene_completion_repair, "disabled");
  assert.equal(fastWorkflow.fast_limits.chapter_completion_repair.max_attempts, 0);
  assert.equal(fastWorkflow.fast_limits.save_incomplete_with_warning, true);

  const standardSteps = await registry.listWorkflowSteps("standard_chapter");
  const qualityStep = standardSteps.find((step) => step.prompt_id === "quality_review_prompt");
  const transitionStep = standardSteps.find((step) => step.prompt_id === "transition_review_prompt");
  assert.equal(qualityStep?.required, false);
  assert.equal(transitionStep?.required, false);

  const polished = await registry.getWorkflow("polished_chapter");
  assert.equal(polished.reviewer_level, "full");
  assert.equal(polished.word_count_strictness, "strict");

  await assert.rejects(() => registry.getWorkflow("missing_path"), /Unknown workflow path/);
}

main()
  .then(() => {
    console.log("Workflow registry tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
