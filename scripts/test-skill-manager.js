const assert = require("node:assert/strict");

const { createSkillManager, parseSkillMarkdown } = require("../skill-manager");

async function main() {
  const manager = createSkillManager();
  const skills = await manager.listSkills();
  assert.ok(skills.length >= 3);
  assert.ok(skills.some((skill) => skill.id === "story-6w"));
  assert.ok(skills.some((skill) => skill.id === "character-archetypes"));
  assert.ok(skills.some((skill) => skill.id === "beat-sheet-pacing"));

  const storySkill = await manager.readSkill("story-6w");
  assert.equal(storySkill.name, "story-6w");
  assert.ok(storySkill.tags.includes("project-materials"));
  assert.match(storySkill.body, /What If/);

  const selectedForOutline = await manager.selectSkillsForTask({
    action: "generate outline",
    tags: ["planner", "chapter"],
  });
  assert.ok(selectedForOutline.some((skill) => skill.id === "beat-sheet-pacing"));

  const parsed = parseSkillMarkdown("---\nname: demo\ntags:\n  - one\n  - two\n---\nBody");
  assert.equal(parsed.frontmatter.name, "demo");
  assert.deepEqual(parsed.frontmatter.tags, ["one", "two"]);
  assert.equal(parsed.body, "Body");

  await assert.rejects(() => manager.readSkill("../bad"), /Invalid skill name/);
}

main()
  .then(() => {
    console.log("Skill manager tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
