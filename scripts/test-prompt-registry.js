const assert = require("node:assert/strict");

const { AGENT_PROMPTS } = require("../agent-prompts");
const { createPromptRegistry } = require("../agent/registries/prompt-registry");

async function main() {
  const registry = createPromptRegistry();
  const index = await registry.loadIndex();
  assert.equal(index.version, 1);
  assert.equal(Array.isArray(index.prompts), true);

  const prompts = await registry.listPrompts();
  assert.equal(prompts.length > 0, true);
  assert.equal(new Set(prompts.map((prompt) => prompt.id)).size, prompts.length);

  const indexedIds = new Set(prompts.map((prompt) => prompt.id));
  for (const promptId of Object.keys(AGENT_PROMPTS)) {
    assert.equal(indexedIds.has(promptId), true, `missing prompt index entry for ${promptId}`);
  }

  const sceneWriter = await registry.getPromptMeta("scene_writer_prompt");
  assert.equal(sceneWriter.stage, "generation");
  assert.equal(sceneWriter.paths.includes("polished_chapter"), true);
  assert.equal(sceneWriter.tags.includes("scene"), true);

  const polishedPrompts = await registry.selectPrompts({ path: "polished_chapter" });
  const polishedIds = new Set(polishedPrompts.map((prompt) => prompt.id));
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
    assert.equal(polishedIds.has(promptId), true, `polished path missing ${promptId}`);
  }

  const reviewPrompts = await registry.selectPrompts({
    path: "polished_chapter",
    stage: "review",
    tags: ["review"],
    maxCostLevel: "medium",
  });
  assert.equal(reviewPrompts.some((prompt) => prompt.id === "quality_review_prompt"), true);
  assert.equal(reviewPrompts.some((prompt) => prompt.id === "transition_review_prompt"), true);
  assert.equal(reviewPrompts.every((prompt) => prompt.stage === "review"), true);

  await assert.rejects(() => registry.getPromptMeta("missing_prompt"), /Unknown prompt/);
}

main()
  .then(() => {
    console.log("Prompt registry tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
