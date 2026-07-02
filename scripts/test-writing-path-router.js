const assert = require("node:assert/strict");

const { createWritingPathRouter } = require("../agent/routing/writing-path-router");

async function main() {
  const router = createWritingPathRouter();
  assert.equal(await router.getDefaultPath(), "polished_chapter");

  const defaultResolved = await router.resolveWritingPath({});
  assert.equal(defaultResolved.writing_path, "polished_chapter");
  assert.equal(defaultResolved.generation_mode, "");
  assert.equal(defaultResolved.warning, "");

  const fastResolved = await router.resolveWritingPath({ generation_mode: "fast_draft" });
  assert.equal(fastResolved.writing_path, "fast_draft");
  assert.equal(fastResolved.generation_mode, "fast_draft");
  assert.equal(fastResolved.warning, "");

  const standardResolved = await router.resolveWritingPath({ generationMode: "standard" });
  assert.equal(standardResolved.writing_path, "standard_chapter");

  const directStandardResolved = await router.resolveWritingPath({ generation_mode: "standard_chapter" });
  assert.equal(directStandardResolved.writing_path, "standard_chapter");
  assert.equal(directStandardResolved.warning, "");

  const polishedResolved = await router.resolveWritingPath({ generation_mode: "full_review" });
  assert.equal(polishedResolved.writing_path, "polished_chapter");

  const directPolishedResolved = await router.resolveWritingPath({ generation_mode: "polished_chapter" });
  assert.equal(directPolishedResolved.writing_path, "polished_chapter");
  assert.equal(directPolishedResolved.warning, "");

  const unknownResolved = await router.resolveWritingPath({ generation_mode: "cheap-but-perfect" });
  assert.equal(unknownResolved.writing_path, "polished_chapter");
  assert.match(unknownResolved.warning, /Unknown generation_mode/);

  const pathOverride = await router.resolveWritingPath({
    writing_path: "standard_chapter",
    generation_mode: "fast_draft",
  });
  assert.equal(pathOverride.writing_path, "standard_chapter");
  assert.match(pathOverride.warning, /overrides generation_mode/);

  const plan = await router.buildExecutionPlan("polished_chapter");
  assert.equal(plan.path_id, "polished_chapter");
  assert.equal(plan.steps.length > 0, true);
  assert.equal(plan.steps.some((step) => step.prompt_id === "scene_writer_prompt"), true);
  assert.equal(plan.steps.some((step) => step.prompt_id === "editorial_suggestions_prompt"), true);
}

main()
  .then(() => {
    console.log("Writing path router tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
