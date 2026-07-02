"use strict";

const fs = require("node:fs");
const path = require("node:path");

const MODEL_TIERS = ["cheap", "mid", "writing", "review", "summary"];
const REAL_ROUTING_ALLOWED_TIERS = ["cheap", "summary", "review"];
const PLACEHOLDER_MODELS = new Set(["cheap-default", "mid-default", "writing-default", "review-default", "summary-default"]);
const DEFAULT_POLICY_PATH = path.join(__dirname, "model-policy.json");

function createModelRouter({ policyPath = DEFAULT_POLICY_PATH } = {}) {
  let policyDocument = null;

  function loadPolicyDocument() {
    if (policyDocument) return policyDocument;
    const raw = fs.readFileSync(policyPath, "utf8");
    policyDocument = JSON.parse(raw);
    validatePolicyDocument(policyDocument);
    return policyDocument;
  }

  function getDefaultModelPolicy({ enable_model_routing, model_routing } = {}) {
    const document = loadPolicyDocument();
    const policyId = String(document.default_policy || "default");
    const policy = document.policies?.[policyId];
    if (!policy) throw new Error(`Default model policy not found: ${policyId}`);
    const basePolicy = {
      policy_id: String(policy.policy_id || policyId),
      version: Number(document.version) || 1,
      routing_enabled: policy.routing_enabled === true,
      allow_fast_draft_planning_routing: policy.allow_fast_draft_planning_routing === true,
      allowed_routing_tiers: normalizeTierList(policy.allowed_routing_tiers, REAL_ROUTING_ALLOWED_TIERS),
      tiers: policy.tiers,
      prompt_tiers: policy.prompt_tiers,
      path_overrides: policy.path_overrides || {},
      mode_overrides: policy.mode_overrides || {},
    };
    const runtimeConfig = resolveRuntimeConfig({
      policy: basePolicy,
      enableModelRouting: enable_model_routing,
      modelRouting: model_routing,
    });
    return {
      ...basePolicy,
      routing_enabled: runtimeConfig.enabled,
      allow_fast_draft_planning_routing: runtimeConfig.allowFastDraftPlanningRouting,
      enabled_tiers: runtimeConfig.enabledTiers,
      tier_models: runtimeConfig.tierModels,
    };
  }

  function resolveModelForStep({
    prompt_id,
    step_id,
    writing_path,
    generation_mode,
    enable_model_routing,
    model_routing,
  } = {}) {
    const promptId = String(prompt_id || "").trim();
    const stepId = String(step_id || "").trim();
    const writingPath = String(writing_path || "").trim();
    const generationMode = String(generation_mode || "").trim();
    const policy = getDefaultModelPolicy({ enable_model_routing, model_routing });
    const modeTier = policy.mode_overrides?.[generationMode]?.[promptId];
    const pathTier = policy.path_overrides?.[writingPath]?.[promptId];
    const promptTier = policy.prompt_tiers?.[promptId];
    const tier = normalizeTier(modeTier || pathTier || promptTier || "mid");
    const source = createPolicySource({ modeTier, pathTier, promptTier, generationMode, writingPath, promptId });
    const resolvedModel = String(policy.tier_models?.[tier] || policy.tiers?.[tier]?.model || "");
    const routingDecision = resolveActualModel({
      enabled: policy.routing_enabled,
      enabledTiers: policy.enabled_tiers,
      tier,
      resolvedModel,
      promptId,
      writingPath,
      generationMode,
      allowFastDraftPlanningRouting: policy.allow_fast_draft_planning_routing,
    });
    return {
      prompt_id: promptId,
      step_id: stepId,
      writing_path: writingPath,
      generation_mode: generationMode,
      model_tier: tier,
      resolved_model: resolvedModel,
      actual_model_sent: routingDecision.actualModelSent,
      model_policy_source: source,
      model_routing_enabled: policy.routing_enabled,
      routing_enabled: policy.routing_enabled,
      model_routing_warning: routingDecision.warning,
      should_send_model: routingDecision.shouldSendModel,
    };
  }

  return {
    getDefaultModelPolicy,
    resolveModelForStep,
  };
}

function resolveRuntimeConfig({ policy, enableModelRouting, modelRouting }) {
  const envConfig = readEnvModelRoutingConfig();
  const policyTierModels = createPolicyTierModels(policy);
  const envTierModels = envConfig.tierModels;
  const inputTierModels = modelRouting && typeof modelRouting === "object" ? normalizeTierModels(modelRouting.tier_models || modelRouting.tierModels) : {};
  const inputEnabled = normalizeOptionalBoolean(enableModelRouting);
  const enabled = inputEnabled ?? envConfig.enabled ?? policy.routing_enabled === true;
  const inputAllowFastDraftPlanning = modelRouting && typeof modelRouting === "object"
    ? normalizeOptionalBoolean(modelRouting.allow_fast_draft_planning_routing ?? modelRouting.allowFastDraftPlanningRouting)
    : null;
  const allowFastDraftPlanningRouting =
    inputAllowFastDraftPlanning ?? envConfig.allowFastDraftPlanningRouting ?? policy.allow_fast_draft_planning_routing === true;
  const inputEnabledTiers = modelRouting && typeof modelRouting === "object"
    ? normalizeTierList(modelRouting.enabled_tiers || modelRouting.enabledTiers, [])
    : [];
  const enabledTiers = inputEnabledTiers.length
    ? inputEnabledTiers
    : envConfig.enabledTiers.length
      ? envConfig.enabledTiers
      : normalizeTierList(policy.allowed_routing_tiers, REAL_ROUTING_ALLOWED_TIERS);
  return {
    enabled,
    allowFastDraftPlanningRouting,
    enabledTiers,
    tierModels: {
      ...policyTierModels,
      ...envTierModels,
      ...inputTierModels,
    },
  };
}

function resolveActualModel({
  enabled,
  enabledTiers,
  tier,
  resolvedModel,
  promptId,
  writingPath,
  generationMode,
  allowFastDraftPlanningRouting,
}) {
  if (!enabled) {
    return { actualModelSent: "", shouldSendModel: false, warning: "model routing disabled" };
  }
  if (!REAL_ROUTING_ALLOWED_TIERS.includes(tier)) {
    return { actualModelSent: "", shouldSendModel: false, warning: `tier ${tier} is not allowed for real model routing` };
  }
  if (!enabledTiers.includes(tier)) {
    return { actualModelSent: "", shouldSendModel: false, warning: `tier ${tier} is not enabled for real model routing` };
  }
  if (isFastDraftPlanningPrompt({ promptId, writingPath, generationMode }) && allowFastDraftPlanningRouting !== true) {
    return {
      actualModelSent: "",
      shouldSendModel: false,
      warning: "fast_draft planning routing disabled; set allow_fast_draft_planning_routing=true to send cheap model",
    };
  }
  if (!resolvedModel) {
    return { actualModelSent: "", shouldSendModel: false, warning: `no real model configured for tier ${tier}` };
  }
  if (isPlaceholderModel(resolvedModel)) {
    return { actualModelSent: "", shouldSendModel: false, warning: `placeholder model ${resolvedModel} was not sent` };
  }
  return { actualModelSent: resolvedModel, shouldSendModel: true, warning: "" };
}

function createPolicyTierModels(policy) {
  const models = {};
  for (const tier of MODEL_TIERS) models[tier] = String(policy.tiers?.[tier]?.model || "");
  return models;
}

function readEnvModelRoutingConfig() {
  return {
    enabled: normalizeOptionalBoolean(process.env.ENABLE_MODEL_ROUTING),
    allowFastDraftPlanningRouting: normalizeOptionalBoolean(process.env.MODEL_ROUTING_ALLOW_FAST_DRAFT_PLANNING),
    enabledTiers: normalizeTierList(process.env.MODEL_ROUTING_ENABLED_TIERS, []),
    tierModels: normalizeTierModels({
      cheap: process.env.MODEL_TIER_CHEAP,
      summary: process.env.MODEL_TIER_SUMMARY,
      review: process.env.MODEL_TIER_REVIEW,
    }),
  };
}

function isFastDraftPlanningPrompt({ promptId, writingPath, generationMode }) {
  return (
    ["planner_prompt", "scene_outline_prompt"].includes(String(promptId || "")) &&
    (String(writingPath || "") === "fast_draft" || String(generationMode || "") === "fast_draft")
  );
}

function normalizeTierModels(source) {
  const result = {};
  const input = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  for (const tier of MODEL_TIERS) {
    const value = String(input[tier] || "").trim();
    if (value) result[tier] = value;
  }
  return result;
}

function normalizeTierList(value, fallback) {
  const rawItems = Array.isArray(value)
    ? value
    : String(value || "")
        .split(",")
        .map((item) => item.trim());
  const items = rawItems
    .map((item) => String(item || "").trim())
    .filter((item, index, array) => MODEL_TIERS.includes(item) && array.indexOf(item) === index);
  return items.length ? items : [...fallback];
}

function normalizeOptionalBoolean(value) {
  if (typeof value === "boolean") return value;
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return null;
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return null;
}

function isPlaceholderModel(model) {
  return PLACEHOLDER_MODELS.has(String(model || "").trim());
}

function createPolicySource({ modeTier, pathTier, promptTier, generationMode, writingPath, promptId }) {
  if (modeTier) return `mode_overrides.${generationMode}.${promptId}`;
  if (pathTier) return `path_overrides.${writingPath}.${promptId}`;
  if (promptTier) return `prompt_tiers.${promptId}`;
  return "fallback.mid";
}

function validatePolicyDocument(document) {
  if (!document || typeof document !== "object" || Array.isArray(document)) {
    throw new Error("model policy must be an object");
  }
  const policyId = String(document.default_policy || "default");
  const policy = document.policies?.[policyId];
  if (!policy) throw new Error(`Default model policy not found: ${policyId}`);
  for (const tier of MODEL_TIERS) {
    if (!policy.tiers?.[tier]) throw new Error(`Missing model tier: ${tier}`);
  }
  if (!policy.prompt_tiers || typeof policy.prompt_tiers !== "object") {
    throw new Error("model policy prompt_tiers is required");
  }
}

function normalizeTier(tier) {
  const value = String(tier || "").trim();
  return MODEL_TIERS.includes(value) ? value : "mid";
}

module.exports = {
  MODEL_TIERS,
  REAL_ROUTING_ALLOWED_TIERS,
  PLACEHOLDER_MODELS,
  createModelRouter,
};
