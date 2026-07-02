"use strict";

const DEFAULT_COST_GUARD_CONFIG = Object.freeze({
  max_llm_calls_per_chapter: 12,
  max_input_tokens_per_chapter: 120000,
  max_output_tokens_per_chapter: 12000,
  max_estimated_cost_usd: 2.0,
  max_prompt_input_tokens: 25000,
  max_scene_count_for_test: 2,
  test_run_mode: true,
  test_defaults: {
    generation_mode: "fast_draft",
    max_target_word_count: 500,
  },
  price_per_1m_tokens: {
    input: 3,
    output: 12,
  },
  enabled: true,
  allow_test_bypass: false,
  environment: "",
});

const MODE_PROFILES = Object.freeze({
  fast_draft: {
    baseCalls: 4,
    callsPerScene: 1,
    enabledSteps: ["planner", "scene_outline", "scene_writing", "completion_audit", "save", "memory_summary"],
    disabledSteps: ["scene_completion_audit", "scene_completion_repair", "chapter_completion_repair", "expand_compress", "quality_review", "transition_review", "editorial_suggestions"],
    inputPerCall: 3500,
    outputPerCall: 400,
  },
  standard: {
    baseCalls: 6,
    callsPerScene: 1,
    enabledSteps: ["planner", "scene_outline", "scene_writing", "completion_audit", "save", "memory_summary", "editorial_suggestions"],
    disabledSteps: ["quality_review", "transition_review"],
    inputPerCall: 4800,
    outputPerCall: 450,
  },
  standard_chapter: {
    baseCalls: 6,
    callsPerScene: 1,
    enabledSteps: ["planner", "scene_outline", "scene_writing", "completion_audit", "save", "memory_summary", "editorial_suggestions"],
    disabledSteps: ["quality_review", "transition_review"],
    inputPerCall: 4800,
    outputPerCall: 450,
  },
  polished: {
    baseCalls: 10,
    callsPerScene: 5,
    enabledSteps: [
      "planner",
      "scene_outline",
      "scene_writing",
      "completion_audit",
      "expand_compress",
      "quality_review",
      "transition_review",
      "editorial_suggestions",
      "save",
      "memory_summary",
    ],
    disabledSteps: [],
    inputPerCall: 8000,
    outputPerCall: 1000,
  },
  polished_chapter: {
    baseCalls: 10,
    callsPerScene: 5,
    enabledSteps: [
      "planner",
      "scene_outline",
      "scene_writing",
      "completion_audit",
      "expand_compress",
      "quality_review",
      "transition_review",
      "editorial_suggestions",
      "save",
      "memory_summary",
    ],
    disabledSteps: [],
    inputPerCall: 8000,
    outputPerCall: 1000,
  },
});

function createCostGuard(config = {}) {
  const normalizedConfig = normalizeCostGuardConfig(config);

  function estimateChapterRun(input = {}) {
    const generationMode = String(input.generation_mode || input.generationMode || normalizedConfig.test_defaults.generation_mode || "").trim();
    const writingPath = String(input.writing_path || input.writingPath || "").trim();
    const targetWordCount = normalizePositiveNumber(input.target_word_count ?? input.targetWordCount, 0);
    const sceneCount = Math.max(1, Math.ceil(normalizePositiveNumber(input.scene_count ?? input.sceneCount, estimateSceneCount(targetWordCount))));
    const enabledReviews = normalizeStringArray(input.enabled_reviews ?? input.enabledReviews);
    const enabledTiers = normalizeStringArray(input.enabled_tiers ?? input.enabledTiers);
    const profileKey = selectProfileKey(generationMode, writingPath);
    const profile = MODE_PROFILES[profileKey] || MODE_PROFILES.polished_chapter;
    const reviewCallCount = estimateReviewCallCount(enabledReviews, profile);
    const routingOverhead = enabledTiers.length > 0 ? 1 : 0;
    const estimatedCalls = Math.ceil(profile.baseCalls + profile.callsPerScene * sceneCount + reviewCallCount + routingOverhead);
    const wordScale = targetWordCount > 0 ? Math.max(0.7, targetWordCount / 1000) : 1;
    const inputLow = Math.ceil(estimatedCalls * profile.inputPerCall * Math.min(1, wordScale));
    const inputHigh = Math.ceil(estimatedCalls * profile.inputPerCall * Math.max(1, wordScale) * 1.35);
    const outputEstimate = estimateOutputTokenRange({ profileKey, targetWordCount, estimatedCalls, profile, wordScale });
    const outputLow = outputEstimate.low;
    const outputHigh = outputEstimate.high;
    const maxPromptInputTokens = Math.ceil(profile.inputPerCall * Math.max(1, wordScale) * 1.35);
    const costLow = estimateCostUsd(inputLow, outputLow, normalizedConfig.price_per_1m_tokens);
    const costHigh = estimateCostUsd(inputHigh, outputHigh, normalizedConfig.price_per_1m_tokens);
    const warnings = [];

    if (normalizedConfig.test_run_mode) {
      warnings.push(`test_run_mode enabled: target_word_count should be <= ${normalizedConfig.test_defaults.max_target_word_count}`);
      if (sceneCount > normalizedConfig.max_scene_count_for_test) {
        warnings.push(`scene_count ${sceneCount} exceeds test max ${normalizedConfig.max_scene_count_for_test}`);
      }
    }

    return {
      blocked: false,
      blocked_reasons: [],
      generation_mode: generationMode,
      writing_path: writingPath,
      target_word_count: targetWordCount,
      scene_count: sceneCount,
      enabled_reviews: enabledReviews,
      enabled_tiers: enabledTiers,
      estimated_llm_calls: estimatedCalls,
      estimated_input_tokens_range: { low: inputLow, high: inputHigh },
      estimated_output_tokens_range: { low: outputLow, high: outputHigh },
      estimated_max_output_tokens: outputHigh,
      estimated_cost_usd_range: { low: roundMoney(costLow), high: roundMoney(costHigh) },
      estimated_max_prompt_input_tokens: maxPromptInputTokens,
      enabled_steps: [...profile.enabledSteps],
      disabled_steps: [...profile.disabledSteps],
      warnings,
    };
  }

  function shouldBlockRun(estimate = {}) {
    const reasons = [];
    const targetWordCount = normalizePositiveNumber(estimate.target_word_count, 0);
    const inputRange = estimate.estimated_input_tokens_range || {};
    const outputRange = estimate.estimated_output_tokens_range || {};
    const costRange = estimate.estimated_cost_usd_range || {};
    const maxPromptInputTokens = normalizePositiveNumber(estimate.estimated_max_prompt_input_tokens, 0);

    if (normalizedConfig.test_run_mode && targetWordCount > normalizedConfig.test_defaults.max_target_word_count) {
      reasons.push(`test_run_mode blocks target_word_count ${targetWordCount}; max is ${normalizedConfig.test_defaults.max_target_word_count}`);
    }
    if (normalizePositiveNumber(estimate.estimated_llm_calls, 0) > normalizedConfig.max_llm_calls_per_chapter) {
      reasons.push(`estimated_llm_calls ${estimate.estimated_llm_calls} exceeds max ${normalizedConfig.max_llm_calls_per_chapter}`);
    }
    if (normalizePositiveNumber(inputRange.high, 0) > normalizedConfig.max_input_tokens_per_chapter) {
      reasons.push(`estimated input tokens high ${inputRange.high} exceeds max ${normalizedConfig.max_input_tokens_per_chapter}`);
    }
    if (normalizePositiveNumber(outputRange.high, 0) > normalizedConfig.max_output_tokens_per_chapter) {
      reasons.push(`estimated output tokens high ${outputRange.high} exceeds max ${normalizedConfig.max_output_tokens_per_chapter}`);
    }
    if (normalizePositiveNumber(costRange.high, 0) > normalizedConfig.max_estimated_cost_usd) {
      reasons.push(`estimated cost high $${costRange.high} exceeds max $${normalizedConfig.max_estimated_cost_usd}`);
    }
    if (maxPromptInputTokens > normalizedConfig.max_prompt_input_tokens) {
      reasons.push(`estimated single prompt input ${maxPromptInputTokens} exceeds max ${normalizedConfig.max_prompt_input_tokens}`);
    }

    return {
      ...estimate,
      blocked: reasons.length > 0,
      blocked_reasons: reasons,
    };
  }

  function buildBudgetReport(estimate = {}) {
    const checked = estimate.blocked_reasons ? estimate : shouldBlockRun(estimate);
    return {
      blocked: Boolean(checked.blocked),
      blocked_reasons: [...(checked.blocked_reasons || [])],
      estimated_llm_calls: normalizePositiveNumber(checked.estimated_llm_calls, 0),
      estimated_input_tokens_range: checked.estimated_input_tokens_range || { low: 0, high: 0 },
      estimated_output_tokens_range: checked.estimated_output_tokens_range || { low: 0, high: 0 },
      estimated_max_output_tokens: normalizePositiveNumber(checked.estimated_max_output_tokens, 0),
      estimated_cost_usd_range: checked.estimated_cost_usd_range || { low: 0, high: 0 },
      enabled_steps: [...(checked.enabled_steps || [])],
      disabled_steps: [...(checked.disabled_steps || [])],
      warnings: [...(checked.warnings || [])],
    };
  }

  function canBypass(input = {}) {
    if (!input || input.bypass_cost_guard !== true) return false;
    return normalizedConfig.allow_test_bypass === true && isTestEnvironment(normalizedConfig.environment);
  }

  return {
    config: normalizedConfig,
    estimateChapterRun,
    shouldBlockRun,
    buildBudgetReport,
    canBypass,
    isEnabled() {
      return normalizedConfig.enabled !== false;
    },
  };
}

function normalizeCostGuardConfig(config = {}) {
  return {
    ...DEFAULT_COST_GUARD_CONFIG,
    ...config,
    test_defaults: {
      ...DEFAULT_COST_GUARD_CONFIG.test_defaults,
      ...(config.test_defaults || {}),
    },
    price_per_1m_tokens: {
      ...DEFAULT_COST_GUARD_CONFIG.price_per_1m_tokens,
      ...(config.price_per_1m_tokens || {}),
    },
  };
}

function selectProfileKey(generationMode, writingPath) {
  if (generationMode && MODE_PROFILES[generationMode]) return generationMode;
  if (writingPath && MODE_PROFILES[writingPath]) return writingPath;
  if (generationMode === "full_review") return "polished_chapter";
  if (generationMode === "standard") return "standard";
  if (generationMode === "fast_draft") return "fast_draft";
  return "polished_chapter";
}

function estimateSceneCount(targetWordCount) {
  if (!targetWordCount) return 3;
  return Math.max(1, Math.ceil(targetWordCount / 700));
}

function estimateReviewCallCount(enabledReviews, profile) {
  if (!enabledReviews.length) return 0;
  const profileSteps = new Set(profile.enabledSteps || []);
  return enabledReviews.filter((review) => profileSteps.has(review) || review.endsWith("_review") || review === "editorial_suggestions").length;
}

function estimateOutputTokenRange({ profileKey, targetWordCount, estimatedCalls, profile, wordScale }) {
  if (profileKey === "fast_draft" && targetWordCount > 0) {
    return {
      low: Math.ceil(targetWordCount * 0.85 + estimatedCalls * 120),
      high: Math.ceil(targetWordCount * 1.45 + estimatedCalls * 220),
    };
  }
  return {
    low: Math.ceil(estimatedCalls * profile.outputPerCall * Math.min(1, wordScale)),
    high: Math.ceil(estimatedCalls * profile.outputPerCall * Math.max(1, wordScale) * 1.35),
  };
}

function estimateCostUsd(inputTokens, outputTokens, prices) {
  const inputPrice = normalizePositiveNumber(prices?.input, 0);
  const outputPrice = normalizePositiveNumber(prices?.output, 0);
  return (inputTokens / 1000000) * inputPrice + (outputTokens / 1000000) * outputPrice;
}

function normalizePositiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item || "").trim()).filter(Boolean);
}

function roundMoney(value) {
  return Math.round(Number(value || 0) * 10000) / 10000;
}

function isTestEnvironment(environment) {
  const value = String(environment || process.env.NODE_ENV || "").toLowerCase();
  return value === "test" || value === "testing";
}

module.exports = {
  DEFAULT_COST_GUARD_CONFIG,
  createCostGuard,
};
