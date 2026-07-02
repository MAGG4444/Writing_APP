const assert = require("node:assert/strict");

const {
  buildChapterLengthPlan,
  compileWritingGoals,
  deriveSceneCountPolicy,
  parseTargetWordCountRange,
} = require("../agent/goals/writing-goal-compiler");

const GOALS = [
  "目标章节数：200章（正传）+ 5章番外。",
  "每章目标字数：3000-4000字。",
  "单章推进密度：每章至少推进主线剧情1个节点（如事件/心理/计谋），同时推进感情线1个细节。",
  "慢速展开规则：前5章专注于开篇冲突与人物关系确立，不急于展开世界全貌；",
].join("\n");

{
  assert.deepEqual(parseTargetWordCountRange("每章目标字数：3000-4000字"), { min: 3000, max: 4000 });
  assert.deepEqual(parseTargetWordCountRange("每章目标字数：3000 到 4000 字"), { min: 3000, max: 4000 });
  assert.deepEqual(parseTargetWordCountRange("3000~4000字"), { min: 3000, max: 4000 });
}

{
  const contract = compileWritingGoals({
    goals_md: GOALS,
    ui_target_word_count: 3200,
    chapter_number: 4,
    generation_mode: "fast_draft",
  });
  assert.equal(contract.source, "project_materials.goals");
  assert.deepEqual(contract.project_target_word_count_range, { min: 3000, max: 4000 });
  assert.equal(contract.requested_target_word_count, 3200);
  assert.equal(contract.effective_target_word_count, 3200);
  assert.equal(contract.chapter_density.main_plot_nodes, 1);
  assert.equal(contract.chapter_density.relationship_details, 1);
  assert.equal(contract.outline_budget_policy.max_major_plot_nodes, 1);
  assert.equal(contract.outline_budget_policy.max_relationship_beats, 1);
  assert.equal(contract.outline_budget_policy.defer_extra_plot, true);
  assert.equal(contract.slow_burn_rules.some((rule) => /前5章/.test(rule)), true);
  assert.equal(contract.slow_burn_rules.some((rule) => /不急于展开世界全貌/.test(rule)), true);
}

{
  const contract = compileWritingGoals({
    goals_md: GOALS,
    ui_target_word_count: 5000,
    chapter_number: 6,
    generation_mode: "standard_chapter",
  });
  assert.equal(contract.effective_target_word_count, 5000);
  assert.equal(contract.warnings.some((warning) => /outside project target range 3000-4000/.test(warning)), true);
}

{
  const polishedShort = compileWritingGoals({
    goals_md: "每章目标字数：800-1200字。每章至少推进主线剧情1个节点，同时推进感情线1个细节。",
    ui_target_word_count: 1000,
    chapter_number: 10,
    generation_mode: "polished_chapter",
  });
  const plan = buildChapterLengthPlan(polishedShort);
  assert.equal(plan.recommended_scene_count, 1);
  assert.equal(plan.max_scene_count, 1);
  assert.equal(plan.length_priority, "hard_limit_over_completion_marker");
}

{
  const plan = buildChapterLengthPlan(compileWritingGoals({ goals_md: GOALS, ui_target_word_count: 3200 }));
  assert.equal(plan.recommended_scene_count >= 2 && plan.recommended_scene_count <= 3, true);
  assert.equal(plan.max_scene_count, 3);
  assert.equal(plan.scene_word_budgets.length, plan.recommended_scene_count);
}

{
  assert.deepEqual(deriveSceneCountPolicy(1000), { recommended_scene_count: 1, max_scene_count: 1 });
  assert.deepEqual(deriveSceneCountPolicy(3200), { recommended_scene_count: 2, max_scene_count: 3 });
}

console.log("Writing goal compiler tests passed");
