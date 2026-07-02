const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { createModelRouter, MODEL_TIERS } = require("../agent/routing/model-router");

const policyPath = path.join(__dirname, "..", "agent", "routing", "model-policy.json");

const KNOWN_PROMPTS = [
  "planner_prompt",
  "scene_outline_prompt",
  "scene_writer_prompt",
  "writer_prompt",
  "continue_chapter_prompt",
  "chapter_completion_repair_prompt",
  "expand_scene_prompt",
  "compress_scene_prompt",
  "chapter_completion_auditor_prompt",
  "quality_review_prompt",
  "transition_review_prompt",
  "editorial_suggestions_prompt",
  "consistency_checker_prompt",
  "summarizer_prompt",
  "editor_prompt",
  "project_materials_prompt",
];

function main() {
  const parsedPolicy = JSON.parse(fs.readFileSync(policyPath, "utf8"));
  assert.equal(parsedPolicy.version, 2);
  assert.equal(parsedPolicy.default_policy, "default");
  assert.deepEqual(parsedPolicy.policies.default.allowed_routing_tiers, ["cheap", "summary", "review"]);

  const router = createModelRouter({ policyPath });
  const policy = router.getDefaultModelPolicy();
  assert.equal(policy.policy_id, "default");
  assert.equal(policy.routing_enabled, false);
  assert.deepEqual(policy.allowed_routing_tiers, ["cheap", "summary", "review"]);
  for (const tier of MODEL_TIERS) assert.ok(policy.tiers[tier], `missing tier ${tier}`);
  for (const promptId of KNOWN_PROMPTS) {
    assert.ok(policy.prompt_tiers[promptId], `missing prompt tier for ${promptId}`);
  }

  const sceneWriter = router.resolveModelForStep({
    prompt_id: "scene_writer_prompt",
    step_id: "generate_scene_content_1",
    writing_path: "polished_chapter",
    generation_mode: "",
  });
  assert.equal(sceneWriter.model_tier, "writing");
  assert.equal(sceneWriter.resolved_model, "writing-default");
  assert.equal(sceneWriter.model_policy_source, "prompt_tiers.scene_writer_prompt");
  assert.equal(sceneWriter.routing_enabled, false);
  assert.equal(sceneWriter.model_routing_enabled, false);
  assert.equal(sceneWriter.actual_model_sent, "");
  assert.equal(sceneWriter.should_send_model, false);

  const completionAudit = router.resolveModelForStep({
    prompt_id: "chapter_completion_auditor_prompt",
    step_id: "audit_chapter_completion",
    writing_path: "polished_chapter",
    generation_mode: "",
  });
  assert.equal(completionAudit.model_tier, "cheap");
  assert.equal(completionAudit.resolved_model, "cheap-default");
  assert.equal(completionAudit.actual_model_sent, "");
  assert.equal(completionAudit.should_send_model, false);

  const fastDraftPlanner = router.resolveModelForStep({
    prompt_id: "planner_prompt",
    step_id: "generate_chapter_outline",
    writing_path: "fast_draft",
    generation_mode: "fast_draft",
  });
  assert.equal(fastDraftPlanner.model_tier, "cheap");
  assert.equal(fastDraftPlanner.resolved_model, "cheap-default");
  assert.equal(fastDraftPlanner.model_policy_source, "mode_overrides.fast_draft.planner_prompt");
  assert.equal(fastDraftPlanner.actual_model_sent, "");

  const fastDraftSceneOutlineByPath = router.resolveModelForStep({
    prompt_id: "scene_outline_prompt",
    step_id: "generate_scene_outline",
    writing_path: "fast_draft",
    generation_mode: "",
  });
  assert.equal(fastDraftSceneOutlineByPath.model_tier, "cheap");
  assert.equal(fastDraftSceneOutlineByPath.model_policy_source, "path_overrides.fast_draft.scene_outline_prompt");

  const unknownPrompt = router.resolveModelForStep({
    prompt_id: "unknown_prompt",
    step_id: "unknown_step",
    writing_path: "polished_chapter",
    generation_mode: "",
  });
  assert.equal(unknownPrompt.model_tier, "mid");
  assert.equal(unknownPrompt.resolved_model, "mid-default");
  assert.equal(unknownPrompt.model_policy_source, "fallback.mid");
  assert.equal(unknownPrompt.routing_enabled, false);
  assert.equal(unknownPrompt.actual_model_sent, "");
  assert.equal(unknownPrompt.should_send_model, false);

  const enabledCheap = router.resolveModelForStep({
    prompt_id: "chapter_completion_auditor_prompt",
    step_id: "audit_chapter_completion",
    writing_path: "polished_chapter",
    generation_mode: "",
    enable_model_routing: true,
    model_routing: {
      tier_models: {
        cheap: "test-cheap-model",
        summary: "test-summary-model",
        review: "test-review-model",
        writing: "test-writing-model",
        mid: "test-mid-model",
      },
    },
  });
  assert.equal(enabledCheap.model_tier, "cheap");
  assert.equal(enabledCheap.resolved_model, "test-cheap-model");
  assert.equal(enabledCheap.actual_model_sent, "test-cheap-model");
  assert.equal(enabledCheap.should_send_model, true);
  assert.equal(enabledCheap.model_routing_enabled, true);
  assert.equal(enabledCheap.model_routing_warning, "");

  const fastDraftPlanningBlocked = router.resolveModelForStep({
    prompt_id: "planner_prompt",
    writing_path: "fast_draft",
    generation_mode: "fast_draft",
    enable_model_routing: true,
    model_routing: {
      tier_models: { cheap: "test-cheap-model" },
    },
  });
  assert.equal(fastDraftPlanningBlocked.model_tier, "cheap");
  assert.equal(fastDraftPlanningBlocked.resolved_model, "test-cheap-model");
  assert.equal(fastDraftPlanningBlocked.actual_model_sent, "");
  assert.equal(fastDraftPlanningBlocked.should_send_model, false);
  assert.match(fastDraftPlanningBlocked.model_routing_warning, /fast_draft planning routing disabled/);

  const fastDraftPlanningAllowed = router.resolveModelForStep({
    prompt_id: "scene_outline_prompt",
    writing_path: "fast_draft",
    generation_mode: "fast_draft",
    enable_model_routing: true,
    model_routing: {
      allow_fast_draft_planning_routing: true,
      tier_models: { cheap: "test-cheap-model" },
    },
  });
  assert.equal(fastDraftPlanningAllowed.model_tier, "cheap");
  assert.equal(fastDraftPlanningAllowed.actual_model_sent, "test-cheap-model");
  assert.equal(fastDraftPlanningAllowed.should_send_model, true);

  const enabledSummary = router.resolveModelForStep({
    prompt_id: "summarizer_prompt",
    enable_model_routing: true,
    model_routing: { tier_models: { summary: "test-summary-model" } },
  });
  assert.equal(enabledSummary.model_tier, "summary");
  assert.equal(enabledSummary.actual_model_sent, "test-summary-model");
  assert.equal(enabledSummary.should_send_model, true);

  const enabledReview = router.resolveModelForStep({
    prompt_id: "quality_review_prompt",
    enable_model_routing: true,
    model_routing: { tier_models: { review: "test-review-model" } },
  });
  assert.equal(enabledReview.model_tier, "review");
  assert.equal(enabledReview.actual_model_sent, "test-review-model");
  assert.equal(enabledReview.should_send_model, true);

  const enabledWriting = router.resolveModelForStep({
    prompt_id: "scene_writer_prompt",
    enable_model_routing: true,
    model_routing: { tier_models: { writing: "test-writing-model" } },
  });
  assert.equal(enabledWriting.model_tier, "writing");
  assert.equal(enabledWriting.resolved_model, "test-writing-model");
  assert.equal(enabledWriting.actual_model_sent, "");
  assert.equal(enabledWriting.should_send_model, false);
  assert.match(enabledWriting.model_routing_warning, /writing is not allowed/);

  const enabledMid = router.resolveModelForStep({
    prompt_id: "planner_prompt",
    enable_model_routing: true,
    model_routing: { tier_models: { mid: "test-mid-model" } },
  });
  assert.equal(enabledMid.model_tier, "mid");
  assert.equal(enabledMid.actual_model_sent, "");
  assert.equal(enabledMid.should_send_model, false);
  assert.match(enabledMid.model_routing_warning, /mid is not allowed/);

  const placeholderCheap = router.resolveModelForStep({
    prompt_id: "chapter_completion_auditor_prompt",
    enable_model_routing: true,
    model_routing: { tier_models: { cheap: "cheap-default" } },
  });
  assert.equal(placeholderCheap.actual_model_sent, "");
  assert.equal(placeholderCheap.should_send_model, false);
  assert.match(placeholderCheap.model_routing_warning, /placeholder model/);

  const missingSummary = router.resolveModelForStep({
    prompt_id: "summarizer_prompt",
    enable_model_routing: true,
    model_routing: { tier_models: { summary: "" } },
  });
  assert.equal(missingSummary.actual_model_sent, "");
  assert.equal(missingSummary.should_send_model, false);
  assert.match(missingSummary.model_routing_warning, /placeholder model|no real model/);

  const unknownPromptEnabled = router.resolveModelForStep({
    prompt_id: "unknown_prompt",
    enable_model_routing: true,
    model_routing: { tier_models: { mid: "test-mid-model" } },
  });
  assert.equal(unknownPromptEnabled.model_tier, "mid");
  assert.equal(unknownPromptEnabled.actual_model_sent, "");
  assert.equal(unknownPromptEnabled.should_send_model, false);

  const previousEnv = {
    ENABLE_MODEL_ROUTING: process.env.ENABLE_MODEL_ROUTING,
    MODEL_TIER_CHEAP: process.env.MODEL_TIER_CHEAP,
    MODEL_ROUTING_ENABLED_TIERS: process.env.MODEL_ROUTING_ENABLED_TIERS,
  };
  try {
    process.env.ENABLE_MODEL_ROUTING = "true";
    process.env.MODEL_TIER_CHEAP = "env-cheap-model";
    process.env.MODEL_ROUTING_ENABLED_TIERS = "cheap";
    const envRouter = createModelRouter({ policyPath });
    const envCheap = envRouter.resolveModelForStep({ prompt_id: "chapter_completion_auditor_prompt" });
    assert.equal(envCheap.actual_model_sent, "env-cheap-model");
    const inputOverridesEnv = envRouter.resolveModelForStep({
      prompt_id: "chapter_completion_auditor_prompt",
      enable_model_routing: false,
      model_routing: { tier_models: { cheap: "input-cheap-model" } },
    });
    assert.equal(inputOverridesEnv.actual_model_sent, "");
    assert.equal(inputOverridesEnv.should_send_model, false);
  } finally {
    for (const [key, value] of Object.entries(previousEnv)) {
      if (value == null) delete process.env[key];
      else process.env[key] = value;
    }
  }

  console.log("Model router tests passed");
}

main();
