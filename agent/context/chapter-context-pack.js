"use strict";

const DEFAULT_LIMITS = Object.freeze({
  outline: 4000,
  characters: 2500,
  world: 2500,
  style: 1800,
  chapterContent: 12000,
  auditContent: 8000,
  summary: 1200,
  projectSummary: 1200,
  memoryItem: 500,
  sceneOutline: 3000,
});

const DEFAULT_MEMORY_LIMITS = Object.freeze({
  recentChapterSummaries: 5,
  activeForeshadowing: 10,
  unresolvedThreads: 10,
  characterStates: 10,
  worldFacts: 10,
});

function buildChapterContextPack(input = {}) {
  const step = normalizeStep(input.step);
  if (step === "planner") return buildPlannerContext(input);
  if (step === "scene_writer") return buildSceneWriterContext(input);
  if (step === "audit") return buildAuditContext(input);
  if (step === "reviewer") return buildReviewerContext(input);
  if (step === "summarizer") return buildSummarizerContext(input);
  return finalizePack("unknown_context", {}, [], ["unknown step"]);
}

function buildPlannerContext(input) {
  const project = normalizeProject(input.project);
  const sections = {
    outline: truncateText(project.outline, DEFAULT_LIMITS.outline),
    recent_chapter_summaries: normalizePreviousSummaries(input.previousSummaries, 3),
    chapter_goal: String(input.chapterGoal || ""),
    chapter_title: String(input.chapterTitle || ""),
    target_word_count: input.targetWordCount || null,
  };
  return finalizePack("planner_context", sections, ["characters", "world", "style", "full_memory"]);
}

function buildSceneWriterContext(input) {
  const project = normalizeProject(input.project);
  const sections = {
    current_scene: simplifyScene(input.scene),
    scene_outline: simplifySceneOutline(input.sceneOutline),
    characters: truncateText(project.characters, DEFAULT_LIMITS.characters),
    world: truncateText(project.world, DEFAULT_LIMITS.world),
    recent_chapter_summaries: normalizePreviousSummaries(input.previousSummaries, 3),
    style: truncateText(project.style, DEFAULT_LIMITS.style),
  };
  return finalizePack("scene_writer_context", sections, ["full_memory", "reports", "llm_events"]);
}

function buildAuditContext(input) {
  const sections = {
    content_to_audit: truncateText(input.chapterContent || input.content || "", DEFAULT_LIMITS.auditContent),
    chapter_title: String(input.chapterTitle || ""),
    user_chapter_goal: String(input.chapterGoal || ""),
    scene_outline: simplifySceneOutline(input.sceneOutline),
    target_word_count: input.targetWordCount || null,
    completion_criteria: normalizeCompletionCriteria(input.completionCriteria),
    previous_tail: truncateText(input.previousTail || "", 1200),
    expected_ending: String(input.expectedEnding || ""),
  };
  return finalizePack("audit_context", sections, [
    "full_memory",
    "full_world",
    "full_characters",
    "full_style",
    "reports",
    "metadata",
    "llm_events",
    "craft_rules",
    "full_chapter_history",
  ]);
}

function buildReviewerContext(input) {
  const project = normalizeProject(input.project);
  const sections = {
    chapter_content: String(input.chapterContent || input.content || ""),
    scene_outline: simplifySceneOutline(input.sceneOutline),
    characters: truncateText(project.characters, DEFAULT_LIMITS.characters),
    world: truncateText(project.world, DEFAULT_LIMITS.world),
    style: truncateText(project.style, DEFAULT_LIMITS.style),
    chapter_goal: String(input.chapterGoal || ""),
  };
  return finalizePack("reviewer_context", sections, ["full_memory", "llm_events", "metadata", "reports"]);
}

function buildSummarizerContext(input) {
  const relevantMemory = buildRelevantMemoryPack({
    memory: input.memory,
    previousSummaries: input.previousSummaries,
  });
  const sections = {
    final_chapter_content: String(input.chapterContent || input.content || ""),
    chapter_title: String(input.chapterTitle || ""),
    user_chapter_goal: String(input.chapterGoal || ""),
    relevant_memory: relevantMemory.content,
  };
  const pack = finalizePack("summarizer_context", sections, [
    "full_memory",
    "reports",
    "metadata",
    "llm_events",
    "craft_rules",
    "full_outline",
    "full_characters",
    "full_world",
    "full_style",
  ]);
  return {
    ...pack,
    relevant_memory_pack: relevantMemory,
  };
}

function finalizePack(contextType, sections, omittedSections, warnings = []) {
  const includedSections = Object.keys(sections).filter((key) => hasContent(sections[key]));
  const serialized = JSON.stringify(sections);
  const charCount = serialized.length;
  return {
    context_type: contextType,
    included_sections: includedSections,
    content: sections,
    char_count: charCount,
    estimated_tokens: Math.ceil(charCount * 0.8),
    omitted_sections: omittedSections,
    warnings,
  };
}

function buildContextPackEstimates(packs) {
  const list = (Array.isArray(packs) ? packs : []).filter(Boolean);
  const byType = Object.fromEntries(list.map((pack) => [pack.context_type, pack]));
  const largest = list.reduce((current, pack) => (!current || pack.char_count > current.char_count ? pack : current), null);
  const totalTokens = list.reduce((sum, pack) => sum + (Number(pack.estimated_tokens) || 0), 0);
  return {
    planner_context_chars: byType.planner_context?.char_count || 0,
    scene_writer_context_chars: byType.scene_writer_context?.char_count || 0,
    audit_context_chars: byType.audit_context?.char_count || 0,
    reviewer_context_chars: byType.reviewer_context?.char_count || 0,
    summarizer_context_chars: byType.summarizer_context?.char_count || 0,
    summarizer_context_estimated_tokens: byType.summarizer_context?.estimated_tokens || 0,
    summarizer_context_omitted_sections: byType.summarizer_context?.omitted_sections || [],
    summarizer_memory_sections_included: byType.summarizer_context?.relevant_memory_pack?.sections_included || [],
    summarizer_recent_summary_count: byType.summarizer_context?.relevant_memory_pack?.counts?.recent_chapter_summaries || 0,
    summarizer_foreshadowing_count: byType.summarizer_context?.relevant_memory_pack?.counts?.active_foreshadowing || 0,
    summarizer_unresolved_thread_count: byType.summarizer_context?.relevant_memory_pack?.counts?.unresolved_threads || 0,
    summarizer_character_state_count: byType.summarizer_context?.relevant_memory_pack?.counts?.relevant_character_states || 0,
    summarizer_world_fact_count: byType.summarizer_context?.relevant_memory_pack?.counts?.relevant_world_facts || 0,
    estimated_total_context_tokens: totalTokens,
    largest_context_pack: largest
      ? {
          context_type: largest.context_type,
          char_count: largest.char_count,
          estimated_tokens: largest.estimated_tokens,
        }
      : null,
    potential_savings_note: "Context pack is recorded for observation only and is not used in LLM prompts yet.",
  };
}

function buildRelevantMemoryPack(input = {}) {
  const memory = normalizeMemoryObject(input.memory);
  const recentChapterSummaries = normalizePreviousSummaries(
    input.previousSummaries && input.previousSummaries.length ? input.previousSummaries : Object.values(memory.chapter_summaries || {}),
    DEFAULT_MEMORY_LIMITS.recentChapterSummaries,
  );
  const content = {
    recent_chapter_summaries: recentChapterSummaries,
    active_foreshadowing: normalizeMemoryItems(memory.foreshadowing, DEFAULT_MEMORY_LIMITS.activeForeshadowing),
    unresolved_threads: normalizeMemoryItems(memory.unresolved_threads, DEFAULT_MEMORY_LIMITS.unresolvedThreads),
    relevant_character_states: normalizeRecordItems(memory.characters_state, DEFAULT_MEMORY_LIMITS.characterStates),
    relevant_world_facts: normalizeMemoryItems(memory.world_facts, DEFAULT_MEMORY_LIMITS.worldFacts),
    existing_project_summary: truncateText(memory.project_summary, DEFAULT_LIMITS.projectSummary),
  };
  const sectionsIncluded = Object.keys(content).filter((key) => hasContent(content[key]));
  const sectionStats = Object.fromEntries(
    Object.entries(content).map(([key, value]) => {
      const charCount = JSON.stringify(value).length;
      return [key, { char_count: charCount, estimated_tokens: Math.ceil(charCount * 0.8) }];
    }),
  );
  return {
    content,
    sections_included: sectionsIncluded,
    counts: {
      recent_chapter_summaries: content.recent_chapter_summaries.length,
      active_foreshadowing: content.active_foreshadowing.length,
      unresolved_threads: content.unresolved_threads.length,
      relevant_character_states: content.relevant_character_states.length,
      relevant_world_facts: content.relevant_world_facts.length,
    },
    section_stats: sectionStats,
  };
}

function normalizeProject(project) {
  const source = project && typeof project === "object" && !Array.isArray(project) ? project : {};
  const materials = source.materials && typeof source.materials === "object" && !Array.isArray(source.materials) ? source.materials : source;
  return {
    outline: String(materials.outline || ""),
    characters: String(materials.characters || ""),
    world: String(materials.world || ""),
    style: String(materials.style || ""),
  };
}

function normalizePreviousSummaries(previousSummaries, maxItems) {
  return (Array.isArray(previousSummaries) ? previousSummaries : [])
    .slice(-maxItems)
    .map((summary) => {
      if (typeof summary === "string") return truncateText(summary, DEFAULT_LIMITS.summary);
      const source = summary && typeof summary === "object" && !Array.isArray(summary) ? summary : {};
      return {
        chapter_id: String(source.chapter_id || source.id || ""),
        title: String(source.title || ""),
        summary: truncateText(source.summary || source.content || "", DEFAULT_LIMITS.summary),
      };
    });
}

function normalizeMemoryObject(memory) {
  const source = memory && typeof memory === "object" && !Array.isArray(memory) ? memory : {};
  return {
    project_summary: String(source.project_summary || source.summary || ""),
    chapter_summaries: source.chapter_summaries && typeof source.chapter_summaries === "object" && !Array.isArray(source.chapter_summaries)
      ? source.chapter_summaries
      : {},
    characters_state: source.characters_state && typeof source.characters_state === "object" && !Array.isArray(source.characters_state)
      ? source.characters_state
      : {},
    world_facts: Array.isArray(source.world_facts) ? source.world_facts : [],
    foreshadowing: Array.isArray(source.foreshadowing) ? source.foreshadowing : [],
    unresolved_threads: Array.isArray(source.unresolved_threads) ? source.unresolved_threads : [],
  };
}

function normalizeMemoryItems(items, maxItems) {
  return (Array.isArray(items) ? items : [])
    .slice(0, maxItems)
    .map((item) => truncateText(typeof item === "string" ? item : JSON.stringify(item), DEFAULT_LIMITS.memoryItem))
    .filter(Boolean);
}

function normalizeRecordItems(record, maxItems) {
  const source = record && typeof record === "object" && !Array.isArray(record) ? record : {};
  return Object.entries(source)
    .slice(0, maxItems)
    .map(([key, value]) => ({
      id: String(key),
      state: truncateText(typeof value === "string" ? value : JSON.stringify(value), DEFAULT_LIMITS.memoryItem),
    }));
}

function simplifyScene(scene) {
  const source = scene && typeof scene === "object" && !Array.isArray(scene) ? scene : {};
  return {
    scene_title: String(source.scene_title || source.title || ""),
    scene_goal: String(source.scene_goal || source.goal || ""),
    characters: Array.isArray(source.characters) ? source.characters.map(String) : [],
    conflict: String(source.conflict || ""),
    expected_turning_point: String(source.expected_turning_point || source.turning_point || ""),
    target_word_count: Number(source.target_word_count || source.targetWordCount) || null,
  };
}

function simplifySceneOutline(sceneOutline) {
  return (Array.isArray(sceneOutline) ? sceneOutline : [])
    .map(simplifyScene)
    .slice(0, 8);
}

function normalizeCompletionCriteria(criteria) {
  if (Array.isArray(criteria) && criteria.length) return criteria.map(String).filter(Boolean);
  return [
    "最后一句必须是完整句子",
    "不能像 token 截断",
    "当前章节必须形成最小闭环",
    "可以留下悬念，但不能停在半句话",
  ];
}

function truncateText(text, limit) {
  const source = String(text || "");
  if (source.length <= limit) return source;
  return `${source.slice(0, limit)}\n[truncated ${source.length - limit} chars]`;
}

function normalizeStep(step) {
  const value = String(step || "").trim();
  return {
    planner_context: "planner",
    scene_writer_context: "scene_writer",
    audit_context: "audit",
    reviewer_context: "reviewer",
    summarizer_context: "summarizer",
  }[value] || value;
}

function hasContent(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.values(value).some(hasContent);
  return value != null && String(value).length > 0;
}

module.exports = {
  buildChapterContextPack,
  buildContextPackEstimates,
  buildRelevantMemoryPack,
};
