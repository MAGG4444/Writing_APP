const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const { createCraftKnowledgeManager, parseCraftRuleMarkdown } = require("../craft-knowledge-manager");

async function main() {
  const manager = createCraftKnowledgeManager();
  const allRules = await manager.load_all_rules();
  assert.equal(allRules.length >= 5, true);
  assert.equal(allRules.every((rule) => rule.id && rule.title && rule.category), true);
  assert.equal(allRules.every((rule) => rule.principle && rule.use_when && rule.revision_strategy), true);
  assert.equal(allRules.every((rule) => Array.isArray(rule.checklist)), true);
  assert.equal(allRules.every((rule) => Array.isArray(rule.bad_patterns)), true);
  assert.equal(new Set(allRules.map((rule) => rule.id)).size, allRules.length);

  const conflictRules = await manager.load_rules_by_category("scene conflict");
  assert.equal(conflictRules.length >= 1, true);
  assert.equal(conflictRules.every((rule) => rule.category === "scene conflict"), true);

  const dialogueRules = await manager.search_rules_by_keyword("对白");
  assert.equal(dialogueRules.some((rule) => rule.id === "dialogue-naturalness"), true);

  const selectedForTransition = await manager.select_rules_for_review({
    categories: ["transition"],
    keywords: ["拼接", "过渡"],
    limit: 3,
  });
  assert.equal(selectedForTransition.length >= 1, true);
  assert.equal(selectedForTransition[0].id, "scene-transition");
  assert.equal(selectedForTransition.length <= 3, true);

  const selectedForQuality = await manager.select_rules_for_review({
    review_type: "quality",
    keywords: ["动机", "冲突", "节奏"],
  });
  assert.equal(selectedForQuality.some((rule) => rule.id === "character-motivation"), true);
  assert.equal(selectedForQuality.some((rule) => rule.id === "scene-conflict-pressure"), true);

  const ruleIndex = await manager.load_rule_index();
  assert.equal(ruleIndex.version, 1);
  assert.equal(ruleIndex.rules.length >= 5, true);
  const ruleIds = new Set(allRules.map((rule) => rule.id));
  for (const entry of ruleIndex.rules) {
    assert.equal(ruleIds.has(entry.id), true, `craft index entry has no matching rule: ${entry.id}`);
  }

  const selectedIndexEntries = await manager.select_rule_index_entries({
    categories: ["scene"],
    tags: ["conflict"],
    path: "polished_chapter",
    top_k: 2,
  });
  assert.equal(selectedIndexEntries.length <= 2, true);
  assert.equal(selectedIndexEntries.some((entry) => entry.id === "scene-conflict-pressure"), true);

  const selectedTransitionIndexEntries = await manager.select_rule_index_entries({
    review_type: "transition",
    tags: ["continuity"],
    top_k: 1,
  });
  assert.equal(selectedTransitionIndexEntries.length, 1);
  assert.equal(selectedTransitionIndexEntries[0].id, "scene-transition");

  const root = await fs.mkdtemp(path.join(os.tmpdir(), "jian-ji-craft-"));
  try {
    await fs.writeFile(
      path.join(root, "custom-rule.md"),
      [
        "---",
        "id: custom-tension",
        "title: Custom Tension",
        "category: scene conflict",
        "---",
        "",
        "## principle",
        "A scene should make the character choose under pressure.",
        "",
        "## use_when",
        "Use when a scene feels flat.",
        "",
        "## checklist",
        "- There is a visible obstacle.",
        "- The character wants something now.",
        "",
        "## bad_patterns",
        "- Description replaces pressure.",
        "",
        "## revision_strategy",
        "Add a concrete obstacle before adding prose polish.",
      ].join("\n"),
      "utf8",
    );
    const customManager = createCraftKnowledgeManager({ rulesRoot: root });
    const customRules = await customManager.load_all_rules();
    assert.equal(customRules.length, 1);
    assert.equal(customRules[0].id, "custom-tension");
    assert.deepEqual(customRules[0].checklist, ["There is a visible obstacle.", "The character wants something now."]);

    const missingIndexEntries = await customManager.select_rule_index_entries({
      categories: ["scene"],
      top_k: 3,
    });
    assert.deepEqual(missingIndexEntries, []);
    const legacySelection = await customManager.select_rules_for_review({
      categories: ["scene"],
      keywords: ["pressure"],
    });
    assert.equal(legacySelection.length, 1);
    assert.equal(legacySelection[0].id, "custom-tension");
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }

  const parsed = parseCraftRuleMarkdown([
    "# Fallback Title",
    "",
    "Category: pacing",
    "",
    "## principle",
    "Keep pressure visible between beats.",
    "",
    "## use_when",
    "Use when scenes sag.",
    "",
    "## checklist",
    "- Beat changes the situation.",
    "",
    "## bad_patterns",
    "- Repeating the same emotional note.",
    "",
    "## revision_strategy",
    "Cut beats that do not change the situation.",
  ].join("\n"));
  assert.equal(parsed.title, "Fallback Title");
  assert.equal(parsed.category, "pacing");
  assert.equal(parsed.id, "fallback-title");

  assert.throws(() => createCraftKnowledgeManager({ rulesRoot: "" }), /rulesRoot is required/);
}

main()
  .then(() => {
    console.log("Craft knowledge manager tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
