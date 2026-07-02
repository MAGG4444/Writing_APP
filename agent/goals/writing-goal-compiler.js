"use strict";

const DEFAULT_TARGET_WORD_COUNT = 3000;
const DEFAULT_MAIN_PLOT_NODES = 1;
const DEFAULT_RELATIONSHIP_DETAILS = 1;

function compileWritingGoals({
  goals_md,
  goalsMd,
  ui_target_word_count,
  uiTargetWordCount,
  chapter_number,
  chapterNumber,
  generation_mode,
  generationMode,
} = {}) {
  const goalsText = String(goals_md ?? goalsMd ?? "").trim();
  const warnings = [];
  const parsedRange = parseTargetWordCountRange(goalsText);
  const requestedTarget = normalizePositiveInteger(ui_target_word_count ?? uiTargetWordCount, 0);
  const effectiveTarget = selectEffectiveTargetWordCount({ requestedTarget, parsedRange, warnings });
  const density = parseChapterDensity(goalsText, warnings);
  const slowBurnRules = parseSlowBurnRules(goalsText, normalizePositiveInteger(chapter_number ?? chapterNumber, 0), warnings);

  return {
    source: "project_materials.goals",
    project_target_word_count_range: parsedRange || null,
    requested_target_word_count: requestedTarget || null,
    effective_target_word_count: effectiveTarget,
    chapter_density: density,
    slow_burn_rules: slowBurnRules,
    outline_budget_policy: {
      max_major_plot_nodes: density.main_plot_nodes,
      max_relationship_beats: density.relationship_details,
      defer_extra_plot: true,
    },
    generation_mode: String(generation_mode ?? generationMode ?? "").trim(),
    warnings,
  };
}

function buildChapterLengthPlan(contract = {}) {
  const target = normalizePositiveInteger(contract.effective_target_word_count, DEFAULT_TARGET_WORD_COUNT);
  const scenePolicy = deriveSceneCountPolicy(target);
  const softMax = Math.round(target * 1.2);
  const hardMax = Math.round(target * 1.25);
  return {
    source: "writing_goal_contract",
    effective_target_word_count: target,
    soft_max_word_count: softMax,
    hard_max_word_count: hardMax,
    recommended_scene_count: scenePolicy.recommended_scene_count,
    max_scene_count: scenePolicy.max_scene_count,
    scene_word_budgets: distributeSceneBudgets(target, scenePolicy.recommended_scene_count),
    length_priority: "hard_limit_over_completion_marker",
    defer_remaining_plot: true,
  };
}

function parseTargetWordCountRange(text) {
  const source = normalizeDigits(text);
  const patterns = [
    /每章(?:目标)?字数[：:\s]*([0-9]{3,6})\s*[-~～—至到]\s*([0-9]{3,6})\s*[字詞词]?/,
    /([0-9]{3,6})\s*(?:到|至)\s*([0-9]{3,6})\s*[字詞词]/,
    /([0-9]{3,6})\s*[-~～—]\s*([0-9]{3,6})\s*[字詞词]/,
    /每章(?:目标)?字数[：:\s]*([0-9]{3,6})\s*[字詞词]/,
  ];
  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (!match) continue;
    const first = normalizePositiveInteger(match[1], 0);
    const second = normalizePositiveInteger(match[2], first);
    if (!first) continue;
    return {
      min: Math.min(first, second),
      max: Math.max(first, second),
    };
  }
  return null;
}

function parseChapterDensity(text, warnings) {
  const source = normalizeDigits(text);
  const mainMatch = source.match(/(?:每章[^。；;\n]*?)?(?:推进)?主线(?:剧情)?\s*([0-9]{1,2})\s*个?(?:节点|事件|情节点)?/);
  const relationshipMatch = source.match(/(?:推进)?(?:感情线|情感线|关系线)\s*([0-9]{1,2})\s*个?(?:细节|节点|beat|片段)?/i);
  const main = mainMatch ? normalizePositiveInteger(mainMatch[1], DEFAULT_MAIN_PLOT_NODES) : DEFAULT_MAIN_PLOT_NODES;
  const relationship = relationshipMatch ? normalizePositiveInteger(relationshipMatch[1], DEFAULT_RELATIONSHIP_DETAILS) : DEFAULT_RELATIONSHIP_DETAILS;
  if (!mainMatch) warnings.push("Could not parse main plot node density from goals.md; using default 1.");
  if (!relationshipMatch) warnings.push("Could not parse relationship detail density from goals.md; using default 1.");
  return {
    main_plot_nodes: main,
    relationship_details: relationship,
  };
}

function parseSlowBurnRules(text, chapterNumber, warnings) {
  const lines = String(text || "")
    .split(/[。；;\\n]/)
    .map((line) => line.trim())
    .filter(Boolean);
  const rules = [];
  for (const line of lines) {
    if (/前\s*\d+\s*章/.test(line)) rules.push(line);
    if (/不急于|不急着|慢速展开|慢热|世界全貌/.test(line)) rules.push(line);
  }
  const unique = [...new Set(rules)];
  if (!unique.length) warnings.push("Could not parse slow-burn rules from goals.md; using no explicit slow-burn rule.");
  if (chapterNumber > 0) {
    return unique.filter((rule) => {
      const match = normalizeDigits(rule).match(/前\s*([0-9]+)\s*章/);
      return !match || chapterNumber <= Number(match[1]);
    });
  }
  return unique;
}

function selectEffectiveTargetWordCount({ requestedTarget, parsedRange, warnings }) {
  if (requestedTarget > 0) {
    if (parsedRange && (requestedTarget < parsedRange.min || requestedTarget > parsedRange.max)) {
      warnings.push(`UI target_word_count ${requestedTarget} is outside project target range ${parsedRange.min}-${parsedRange.max}.`);
    }
    return requestedTarget;
  }
  if (parsedRange) return Math.round((parsedRange.min + parsedRange.max) / 2);
  warnings.push(`Could not parse project target word count; using default ${DEFAULT_TARGET_WORD_COUNT}.`);
  return DEFAULT_TARGET_WORD_COUNT;
}

function deriveSceneCountPolicy(targetWordCount) {
  const target = normalizePositiveInteger(targetWordCount, DEFAULT_TARGET_WORD_COUNT);
  if (target <= 1800) return { recommended_scene_count: 1, max_scene_count: 1 };
  if (target <= 3500) return { recommended_scene_count: 2, max_scene_count: 3 };
  if (target <= 5500) return { recommended_scene_count: 3, max_scene_count: 4 };
  if (target <= 8000) return { recommended_scene_count: 4, max_scene_count: 5 };
  return { recommended_scene_count: Math.ceil(target / 2000), max_scene_count: Math.ceil(target / 1600) };
}

function distributeSceneBudgets(targetWordCount, sceneCount) {
  const target = normalizePositiveInteger(targetWordCount, DEFAULT_TARGET_WORD_COUNT);
  const count = Math.max(1, normalizePositiveInteger(sceneCount, 1));
  const base = Math.floor(target / count);
  let remainder = target - base * count;
  return Array.from({ length: count }, (_, index) => {
    const sceneTarget = base + (remainder-- > 0 ? 1 : 0);
    return {
      scene_index: index + 1,
      target_word_count: sceneTarget,
      soft_max_word_count: Math.round(sceneTarget * 1.2),
      hard_max_word_count: Math.round(sceneTarget * 1.25),
    };
  });
}

function normalizeDigits(value) {
  return String(value || "").replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0));
}

function normalizePositiveInteger(value, fallback) {
  const number = Math.round(Number(normalizeDigits(value)));
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

module.exports = {
  compileWritingGoals,
  buildChapterLengthPlan,
  parseTargetWordCountRange,
  deriveSceneCountPolicy,
};
