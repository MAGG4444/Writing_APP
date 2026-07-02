const fs = require("node:fs/promises");
const path = require("node:path");

const DEFAULT_RULES_ROOT = path.join(__dirname, "craft_knowledge");
const DEFAULT_CRAFT_INDEX_FILE = "CRAFT_INDEX.json";
const REQUIRED_RULE_FIELDS = ["id", "title", "category", "principle", "use_when", "checklist", "bad_patterns", "revision_strategy"];

function createCraftKnowledgeManager({ rulesRoot = DEFAULT_RULES_ROOT, indexFile = DEFAULT_CRAFT_INDEX_FILE } = {}) {
  if (!rulesRoot) throw new Error("rulesRoot is required");
  const resolvedRoot = path.resolve(rulesRoot);
  const resolvedIndexPath = path.resolve(resolvedRoot, indexFile);

  async function load_all_rules() {
    const files = await listRuleFiles(resolvedRoot);
    const rules = [];
    for (const filePath of files) {
      const loaded = await loadRulesFromFile(filePath);
      rules.push(...loaded);
    }
    return dedupeRules(rules.map(normalizeCraftRule).filter(Boolean));
  }

  async function load_rules_by_category(category) {
    const normalizedCategory = normalizeSearchText(category);
    if (!normalizedCategory) return [];
    const rules = await load_all_rules();
    return rules.filter((rule) => normalizeSearchText(rule.category) === normalizedCategory);
  }

  async function search_rules_by_keyword(keyword) {
    const query = normalizeSearchText(keyword);
    if (!query) return [];
    const rules = await load_all_rules();
    return rules.filter((rule) => getRuleSearchText(rule).includes(query));
  }

  async function select_rules_for_review(options = {}) {
    const rules = await load_all_rules();
    const categories = normalizeList(options.categories);
    const keywords = normalizeList(options.keywords);
    const reviewType = String(options.review_type ?? options.reviewType ?? "").trim();
    const inferredCategories = inferReviewCategories(reviewType);
    const selectedCategories = [...new Set([...categories, ...inferredCategories])];
    const limit = Math.max(1, Math.round(Number(options.limit) || 5));

    const scored = rules
      .map((rule) => ({
        rule,
        score: scoreRuleForReview(rule, selectedCategories, keywords),
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.rule.id.localeCompare(b.rule.id));

    return scored.slice(0, limit).map((entry) => entry.rule);
  }

  async function load_rule_index() {
    const raw = await fs.readFile(resolvedIndexPath, "utf8");
    return normalizeCraftIndex(JSON.parse(raw));
  }

  async function select_rule_index_entries(options = {}) {
    let loaded = null;
    try {
      loaded = await load_rule_index();
    } catch (_error) {
      return [];
    }
    const categories = normalizeList(options.categories).map(normalizeSearchText);
    const tags = normalizeList(options.tags).map(normalizeSearchText);
    const reviewType = normalizeSearchText(options.review_type ?? options.reviewType);
    const selectedPath = normalizeSearchText(options.path);
    const topK = Math.max(1, Math.round(Number(options.top_k ?? options.topK) || 5));
    return loaded.rules
      .map((entry) => ({
        entry,
        score: scoreCraftIndexEntry(entry, { categories, tags, reviewType, selectedPath }),
      }))
      .filter((item) => item.score > 0)
      .sort((left, right) => right.score - left.score || right.entry.priority - left.entry.priority || left.entry.id.localeCompare(right.entry.id))
      .slice(0, topK)
      .map((item) => ({ ...item.entry, tags: [...item.entry.tags], review_types: [...item.entry.review_types], paths: [...item.entry.paths] }));
  }

  return {
    load_all_rules,
    load_rules_by_category,
    search_rules_by_keyword,
    select_rules_for_review,
    load_rule_index,
    select_rule_index_entries,
  };
}

async function listRuleFiles(root) {
  let entries = [];
  try {
    entries = await fs.readdir(root, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listRuleFiles(entryPath)));
    } else if (/\.(json|md|markdown)$/i.test(entry.name)) {
      files.push(entryPath);
    }
  }
  return files.sort();
}

async function loadRulesFromFile(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  if (/\.json$/i.test(filePath)) return parseCraftRuleJson(raw);
  return [parseCraftRuleMarkdown(raw)].filter(Boolean);
}

function parseCraftRuleJson(raw) {
  const parsed = JSON.parse(String(raw || "").trim() || "[]");
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.rules)) return parsed.rules;
  return [parsed];
}

function parseCraftRuleMarkdown(markdown) {
  const source = String(markdown || "").trim();
  if (!source) return null;
  const { metadata, body } = parseFrontMatter(source);
  const title = metadata.title || parseMarkdownTitle(body);
  const sections = parseMarkdownSections(body);
  const category = metadata.category || parseInlineField(body, "category");
  return normalizeCraftRule({
    id: metadata.id || slugify(title),
    title,
    category,
    principle: sections.principle || "",
    use_when: sections.use_when || sections["use when"] || "",
    checklist: parseMarkdownList(sections.checklist),
    bad_patterns: parseMarkdownList(sections.bad_patterns || sections["bad patterns"]),
    revision_strategy: sections.revision_strategy || sections["revision strategy"] || "",
  });
}

function parseFrontMatter(source) {
  if (!source.startsWith("---")) return { metadata: {}, body: source };
  const end = source.indexOf("\n---", 3);
  if (end < 0) return { metadata: {}, body: source };
  const frontMatter = source.slice(3, end).trim();
  const body = source.slice(end + 4).trim();
  const metadata = {};
  for (const line of frontMatter.split(/\r?\n/)) {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) metadata[normalizeSectionKey(match[1])] = match[2].trim();
  }
  return { metadata, body };
}

function parseMarkdownTitle(body) {
  const match = String(body || "").match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

function parseInlineField(body, fieldName) {
  const pattern = new RegExp(`^${escapeRegExp(fieldName)}\\s*:\\s*(.+)$`, "im");
  const match = String(body || "").match(pattern);
  return match ? match[1].trim() : "";
}

function parseMarkdownSections(body) {
  const sections = {};
  let currentKey = "";
  for (const line of String(body || "").split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      currentKey = normalizeSectionKey(heading[1]);
      sections[currentKey] = [];
      continue;
    }
    if (currentKey) sections[currentKey].push(line);
  }
  return Object.fromEntries(Object.entries(sections).map(([key, lines]) => [key, lines.join("\n").trim()]));
}

function parseMarkdownList(value) {
  const text = String(value || "").trim();
  if (!text) return [];
  const items = text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-*]\s+/, "").trim())
    .filter(Boolean);
  return items.length > 0 ? items : [text];
}

function normalizeCraftRule(rule) {
  const source = rule && typeof rule === "object" && !Array.isArray(rule) ? rule : {};
  const normalized = {
    id: slugify(source.id || source.title),
    title: String(source.title || "").trim(),
    category: String(source.category || "").trim(),
    principle: String(source.principle || "").trim(),
    use_when: String(source.use_when ?? source.useWhen ?? "").trim(),
    checklist: normalizeList(source.checklist),
    bad_patterns: normalizeList(source.bad_patterns ?? source.badPatterns),
    revision_strategy: String(source.revision_strategy ?? source.revisionStrategy ?? "").trim(),
  };
  const missing = REQUIRED_RULE_FIELDS.filter((field) => {
    const value = normalized[field];
    return Array.isArray(value) ? value.length === 0 : !value;
  });
  if (missing.length > 0) return null;
  return normalized;
}

function dedupeRules(rules) {
  const seen = new Set();
  const deduped = [];
  for (const rule of rules) {
    if (seen.has(rule.id)) continue;
    seen.add(rule.id);
    deduped.push(rule);
  }
  return deduped.sort((a, b) => a.id.localeCompare(b.id));
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  const text = String(value || "").trim();
  if (!text) return [];
  return text.split(/[,\n;；、]/).map((item) => item.trim()).filter(Boolean);
}

function inferReviewCategories(reviewType) {
  const normalized = normalizeSearchText(reviewType);
  if (normalized === "quality") {
    return ["scene conflict", "character motivation", "dialogue naturalness", "pacing"];
  }
  if (normalized === "transition") return ["transition", "pacing"];
  return [];
}

function scoreRuleForReview(rule, categories, keywords) {
  const ruleCategory = normalizeSearchText(rule.category);
  const categoryScore = categories.some((category) => categoryMatches(ruleCategory, normalizeSearchText(category))) ? 10 : 0;
  const searchText = getRuleSearchText(rule);
  const keywordScore = keywords.reduce((score, keyword) => {
    const normalizedKeyword = normalizeSearchText(keyword);
    return normalizedKeyword && searchText.includes(normalizedKeyword) ? score + 1 : score;
  }, 0);
  return categoryScore + keywordScore;
}

function categoryMatches(ruleCategory, requestedCategory) {
  if (!ruleCategory || !requestedCategory) return false;
  return ruleCategory === requestedCategory || ruleCategory.includes(requestedCategory) || requestedCategory.includes(ruleCategory);
}

function getRuleSearchText(rule) {
  return normalizeSearchText([
    rule.id,
    rule.title,
    rule.category,
    rule.principle,
    rule.use_when,
    ...(rule.checklist || []),
    ...(rule.bad_patterns || []),
    rule.revision_strategy,
  ].join(" "));
}

function normalizeCraftIndex(source) {
  const rules = Array.isArray(source?.rules) ? source.rules.map(normalizeCraftIndexEntry).filter(Boolean) : [];
  const seen = new Set();
  for (const rule of rules) {
    if (seen.has(rule.id)) throw new Error(`Duplicate craft index id: ${rule.id}`);
    seen.add(rule.id);
  }
  return {
    version: Number(source?.version) || 1,
    rules,
  };
}

function normalizeCraftIndexEntry(source) {
  if (!source || typeof source !== "object" || Array.isArray(source)) return null;
  const id = String(source.id || "").trim();
  if (!id) return null;
  return {
    id,
    source: String(source.source || "").trim(),
    category: String(source.category || "").trim(),
    tags: normalizeList(source.tags),
    review_types: normalizeList(source.review_types ?? source.reviewTypes),
    paths: normalizeList(source.paths),
    cost_level: String(source.cost_level ?? source.costLevel ?? "").trim(),
    priority: Number.isFinite(Number(source.priority)) ? Number(source.priority) : 0,
    summary: String(source.summary || "").trim(),
  };
}

function scoreCraftIndexEntry(entry, { categories, tags, reviewType, selectedPath }) {
  const entryCategory = normalizeSearchText(entry.category);
  const entryTags = entry.tags.map(normalizeSearchText);
  const entryReviewTypes = entry.review_types.map(normalizeSearchText);
  const entryPaths = entry.paths.map(normalizeSearchText);
  let score = 0;
  if (categories.length > 0 && categories.some((category) => categoryMatches(entryCategory, category))) score += 20;
  if (tags.length > 0) score += tags.filter((tag) => entryTags.includes(tag)).length * 5;
  if (reviewType && entryReviewTypes.includes(reviewType)) score += 10;
  if (selectedPath && entryPaths.includes(selectedPath)) score += 4;
  if (categories.length === 0 && tags.length === 0 && !reviewType && !selectedPath) score += 1;
  return score;
}

function normalizeSearchText(value) {
  return String(value || "").toLowerCase().trim();
}

function normalizeSectionKey(value) {
  return String(value || "").toLowerCase().trim().replace(/\s+/g, "_").replace(/-/g, "_");
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u3400-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = {
  DEFAULT_RULES_ROOT,
  DEFAULT_CRAFT_INDEX_FILE,
  createCraftKnowledgeManager,
  parseCraftRuleMarkdown,
  normalizeCraftRule,
};
