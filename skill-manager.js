const fs = require("node:fs/promises");
const path = require("node:path");

const DEFAULT_SKILLS_ROOT = path.join(__dirname, "agent-skills");

function createSkillManager({ skillsRoot = DEFAULT_SKILLS_ROOT } = {}) {
  const resolvedRoot = path.resolve(skillsRoot);

  async function listSkills() {
    const entries = await fs.readdir(resolvedRoot, { withFileTypes: true });
    const skills = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const skill = await readSkill(entry.name);
      skills.push(toSkillSummary(skill));
    }
    return skills.sort((a, b) => a.name.localeCompare(b.name));
  }

  async function readSkill(skillName) {
    const name = normalizeSkillName(skillName);
    const skillPath = getSkillPath(resolvedRoot, name);
    const raw = await fs.readFile(skillPath, "utf8");
    const parsed = parseSkillMarkdown(raw);
    return {
      id: name,
      path: skillPath,
      name: parsed.frontmatter.name || name,
      description: parsed.frontmatter.description || "",
      tags: Array.isArray(parsed.frontmatter.tags) ? parsed.frontmatter.tags : [],
      body: parsed.body,
      raw,
    };
  }

  async function selectSkillsForTask(task = {}, options = {}) {
    const limit = Number(options.limit) > 0 ? Math.floor(Number(options.limit)) : 3;
    const query = normalizeTaskQuery(task);
    const skills = await listSkills();
    return skills
      .map((skill) => ({ ...skill, score: scoreSkill(skill, query) }))
      .filter((skill) => skill.score > 0)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, limit);
  }

  return {
    listSkills,
    readSkill,
    selectSkillsForTask,
  };
}

function toSkillSummary(skill) {
  return {
    id: skill.id,
    name: skill.name,
    description: skill.description,
    tags: skill.tags,
  };
}

function getSkillPath(root, skillName) {
  const skillPath = path.resolve(root, skillName, "SKILL.md");
  if (!skillPath.startsWith(`${root}${path.sep}`)) throw new Error("Invalid skill name");
  return skillPath;
}

function normalizeSkillName(value) {
  const name = String(value || "").trim();
  if (!name) throw new Error("skill name is required");
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error("Invalid skill name");
  return name;
}

function parseSkillMarkdown(raw) {
  const text = String(raw || "");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: text.trim() };
  }
  return {
    frontmatter: parseFrontmatter(match[1]),
    body: match[2].trim(),
  };
}

function parseFrontmatter(text) {
  const result = {};
  let activeListKey = "";
  for (const line of String(text || "").split(/\r?\n/)) {
    const listMatch = line.match(/^\s*-\s+(.+?)\s*$/);
    if (activeListKey && listMatch) {
      result[activeListKey].push(unquoteFrontmatterValue(listMatch[1]));
      continue;
    }

    const keyValueMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*?)\s*$/);
    if (!keyValueMatch) continue;
    const [, key, value] = keyValueMatch;
    if (!value) {
      result[key] = [];
      activeListKey = key;
      continue;
    }
    result[key] = unquoteFrontmatterValue(value);
    activeListKey = "";
  }
  return result;
}

function unquoteFrontmatterValue(value) {
  return String(value || "")
    .replace(/^["']|["']$/g, "")
    .trim();
}

function normalizeTaskQuery(task) {
  if (typeof task === "string") return task.toLowerCase();
  if (!task || typeof task !== "object") return "";
  return Object.values(task)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .map((value) => String(value || "").toLowerCase())
    .join(" ");
}

function scoreSkill(skill, query) {
  const haystack = [skill.id, skill.name, skill.description, ...(skill.tags || [])].join(" ").toLowerCase();
  return query
    .split(/\s+/)
    .filter(Boolean)
    .reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
}

module.exports = {
  DEFAULT_SKILLS_ROOT,
  createSkillManager,
  parseSkillMarkdown,
};

