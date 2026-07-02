"use strict";

const PATH_POLICIES = {
  fast_draft: {
    adjustment: { enabled: false, severe_only: false },
    completion: {
      scene_audit_enabled: false,
      scene_repair_enabled: false,
      chapter_audit_enabled: true,
      max_chapter_repairs: 0,
      save_incomplete_with_warning: true,
    },
    reviews: { quality: false, transition: false, editorial: false },
  },
  standard_chapter: {
    adjustment: { enabled: false, severe_only: false },
    completion: {
      scene_audit_enabled: false,
      scene_repair_enabled: false,
      chapter_audit_enabled: true,
      max_chapter_repairs: 1,
      save_incomplete_with_warning: true,
    },
    reviews: { quality: false, transition: false, editorial: true },
  },
  polished_chapter: {
    adjustment: { enabled: true, severe_only: false },
    completion: {
      scene_audit_enabled: true,
      scene_repair_enabled: true,
      chapter_audit_enabled: true,
      max_chapter_repairs: 1,
      save_incomplete_with_warning: false,
    },
    reviews: { quality: true, transition: true, editorial: true },
  },
};

function buildWritingPathPolicy(pathId) {
  const normalizedPath = String(pathId || "polished_chapter").trim() || "polished_chapter";
  const source = PATH_POLICIES[normalizedPath] || PATH_POLICIES.polished_chapter;
  return {
    path_id: PATH_POLICIES[normalizedPath] ? normalizedPath : "polished_chapter",
    adjustment: {
      enabled: source.adjustment.enabled === true,
      severe_only: source.adjustment.severe_only === true,
    },
    completion: {
      scene_audit_enabled: source.completion?.scene_audit_enabled === true,
      scene_repair_enabled: source.completion?.scene_repair_enabled === true,
      chapter_audit_enabled: source.completion?.chapter_audit_enabled !== false,
      max_chapter_repairs: Number.isInteger(source.completion?.max_chapter_repairs) ? source.completion.max_chapter_repairs : 1,
      save_incomplete_with_warning: source.completion?.save_incomplete_with_warning === true,
    },
    reviews: {
      quality: source.reviews.quality === true,
      transition: source.reviews.transition === true,
      editorial: source.reviews.editorial === true,
    },
  };
}

function isSceneAdjustmentEnabled(policy) {
  return policy?.adjustment?.enabled === true;
}

function isSceneCompletionAuditEnabled(policy) {
  return policy?.completion?.scene_audit_enabled === true;
}

function isSceneCompletionRepairEnabled(policy) {
  return policy?.completion?.scene_repair_enabled === true;
}

function isChapterCompletionAuditEnabled(policy) {
  return policy?.completion?.chapter_audit_enabled !== false;
}

function getMaxChapterRepairAttempts(policy) {
  const attempts = Number(policy?.completion?.max_chapter_repairs);
  return Number.isInteger(attempts) && attempts >= 0 ? attempts : 1;
}

function shouldSaveIncompleteWithWarning(policy) {
  return policy?.completion?.save_incomplete_with_warning === true;
}

function isQualityReviewEnabled(policy) {
  return policy?.reviews?.quality === true;
}

function isTransitionReviewEnabled(policy) {
  return policy?.reviews?.transition === true;
}

function isEditorialSuggestionsEnabled(policy) {
  return policy?.reviews?.editorial === true;
}

module.exports = {
  buildWritingPathPolicy,
  isSceneAdjustmentEnabled,
  isSceneCompletionAuditEnabled,
  isSceneCompletionRepairEnabled,
  isChapterCompletionAuditEnabled,
  getMaxChapterRepairAttempts,
  shouldSaveIncompleteWithWarning,
  isQualityReviewEnabled,
  isTransitionReviewEnabled,
  isEditorialSuggestionsEnabled,
};
