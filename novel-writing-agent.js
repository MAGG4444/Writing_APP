const {
  renderPlannerPrompt,
  renderSceneOutlinePrompt,
  renderWriterPrompt,
  renderSceneWriterPrompt,
  renderExpandScenePrompt,
  renderCompressScenePrompt,
  renderContinueChapterPrompt,
  renderChapterCompletionAuditPrompt,
  renderChapterCompletionRepairPrompt,
  renderSummarizerPrompt,
  renderConsistencyCheckerPrompt,
  renderQualityReviewPrompt,
  renderTransitionReviewPrompt,
  renderEditorialSuggestionsPrompt,
  renderEditorPrompt,
  renderProjectMaterialsPrompt,
} = require("./agent-prompts");
const { createSkillManager } = require("./skill-manager");
const { createCraftKnowledgeManager } = require("./craft-knowledge-manager");
const { buildChapterContextPack, buildContextPackEstimates } = require("./agent/context/chapter-context-pack");
const { buildChapterLengthPlan, compileWritingGoals } = require("./agent/goals/writing-goal-compiler");
const { createWritingPathRouter } = require("./agent/routing/writing-path-router");
const { createModelRouter } = require("./agent/routing/model-router");
const {
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
} = require("./agent/routing/writing-path-policy");

const CONSISTENCY_REPORT_KEYS = [
  "contradictions",
  "character_behavior_issues",
  "timeline_issues",
  "worldbuilding_issues",
  "unresolved_questions",
  "suggested_fixes",
];
const QUALITY_REVIEW_ARRAY_KEYS = ["scene_level_feedback", "issues", "suggested_fixes", "strengths"];
const TRANSITION_REVIEW_ARRAY_KEYS = ["scene_pair_feedback", "transition_issues", "suggested_bridge_sentences", "pacing_notes"];
const EDITORIAL_SUGGESTIONS_ARRAY_KEYS = [
  "priority_issues",
  "transition_suggestions",
  "character_motivation_suggestions",
  "dialogue_suggestions",
  "pacing_suggestions",
  "style_suggestions",
];
const CHAPTER_END_MARKER = "[CHAPTER_END]";
const MAX_CONTINUE_CHAPTER_ATTEMPTS = 3;
const FAST_DRAFT_OVER_TARGET_RATIO = 1.25;
const FAST_DRAFT_PROMPT_OVER_TARGET_RATIO = 1.2;
const FAST_DRAFT_MIN_OUTPUT_TOKENS = 256;
const FAST_DRAFT_MAX_OUTPUT_TOKENS_PER_CALL = 4096;

function createNovelWritingAgent({
  projectManager,
  memoryManager,
  tools,
  llmClient,
  skillManager = createSkillManager(),
  craftKnowledgeManager = createCraftKnowledgeManager(),
  writingPathRouter = createWritingPathRouter(),
  modelRouter = createModelRouter(),
  costGuard = null,
}) {
  if (!projectManager) throw new Error("projectManager is required");
  if (!memoryManager) throw new Error("memoryManager is required");
  if (!tools) throw new Error("tools is required");
  if (!llmClient || typeof llmClient.generate !== "function") throw new Error("llmClient.generate is required");
  if (!skillManager || typeof skillManager.readSkill !== "function") throw new Error("skillManager.readSkill is required");
  if (!craftKnowledgeManager || typeof craftKnowledgeManager.select_rules_for_review !== "function") {
    throw new Error("craftKnowledgeManager.select_rules_for_review is required");
  }
  if (
    !writingPathRouter ||
    typeof writingPathRouter.resolveWritingPath !== "function" ||
    typeof writingPathRouter.buildExecutionPlan !== "function"
  ) {
    throw new Error("writingPathRouter.resolveWritingPath and buildExecutionPlan are required");
  }
  if (
    !modelRouter ||
    typeof modelRouter.resolveModelForStep !== "function" ||
    typeof modelRouter.getDefaultModelPolicy !== "function"
  ) {
    throw new Error("modelRouter.resolveModelForStep and getDefaultModelPolicy are required");
  }

  async function write_chapter(input = {}) {
    const projectId = normalizeProjectId(input.project_id ?? input.projectId);
    const chapterNumber = normalizeChapterNumber(input.chapter_number ?? input.chapterNumber);
    const userInstruction = String(input.user_instruction ?? input.userInstruction ?? "").trim();
    if (!userInstruction) throw new Error("user_instruction is required");

    const steps = [];
    const generationEvents = [];
    const chapterId = `chapter-${chapterNumber}`;
    const chapterFileName = createChapterFileName(chapterNumber);
    let writingPathResolution = null;
    let executionPlan = null;
    let writingPathPolicy = null;

    try {
      writingPathResolution = await writingPathRouter.resolveWritingPath(input);
      executionPlan = await writingPathRouter.buildExecutionPlan(writingPathResolution.writing_path);
      writingPathPolicy = buildWritingPathPolicy(writingPathResolution.writing_path);
      generationEvents.modelRoutingContext = {
        writing_path: writingPathResolution.writing_path,
        generation_mode: writingPathResolution.generation_mode,
        enable_model_routing: input.enable_model_routing ?? input.enableModelRouting,
        model_routing: input.model_routing ?? input.modelRouting,
      };
      generationEvents.modelPolicy = modelRouter.getDefaultModelPolicy({
        enable_model_routing: generationEvents.modelRoutingContext.enable_model_routing,
        model_routing: generationEvents.modelRoutingContext.model_routing,
      });
      const costGuardResult = runCostGuardBeforeGeneration({
        costGuard,
        input,
        writingPathResolution,
        writingPathPolicy,
      });
      generationEvents.costGuard = costGuardResult.metadata;
      if (costGuardResult.blocked) {
        steps.push({
          name: "cost_guard",
          status: "failed",
          error: costGuardResult.blocked_reasons.join("; "),
        });
        return {
          ok: false,
          project_id: projectId,
          chapter_number: chapterNumber,
          error: "CostGuard blocked chapter generation before any LLM call.",
          failed_step: "cost_guard",
          cost_guard_blocked: true,
          blocked_reasons: costGuardResult.blocked_reasons,
          budget_report: costGuardResult.budget_report,
          steps,
        };
      }
      const context = await runStep(steps, "read_project_context", () => tools.read_project_context(projectId));
      const previous = await runStep(steps, "read_previous_chapter_summaries", () =>
        tools.get_previous_chapter_summaries(projectId, input.previous_limit ?? input.previousLimit ?? 3, chapterNumber),
      );
      const plannerSkills = await runStep(steps, "load_planning_skills", () =>
        loadSkillContext(["story-6w", "beat-sheet-pacing"]),
      );
      const requestedWordCount = getRequestedWordCount(input, context);
      const writingGoalContract = compileWritingGoals({
        goals_md: context.materials?.goals || "",
        ui_target_word_count: requestedWordCount,
        chapter_number: chapterNumber,
        generation_mode: writingPathResolution.generation_mode || writingPathResolution.writing_path,
      });
      const chapterLengthPlan = buildChapterLengthPlan(writingGoalContract);
      const variables = buildChapterPromptVariables(context, previous.summaries, userInstruction, {
        chapterNumber,
        title: input.title,
        writingSkills: plannerSkills,
        writingGoalContract,
        chapterLengthPlan,
      });

      const chapterOutline = await runStep(steps, "generate_chapter_outline", () =>
        generateWithPrompt("planner_prompt", renderPlannerPrompt(variables), generationEvents),
      );
      const writerSkills = await runStep(steps, "load_drafting_skills", () =>
        loadSkillContext(["beat-sheet-pacing", "character-archetypes"]),
      );
      const rawSceneOutline = await runStep(steps, "generate_scene_outline", () =>
        generateWithPrompt(
          "scene_outline_prompt",
          renderSceneOutlinePrompt({
            ...variables,
            outline: mergeOutlineForWriter(variables.outline, chapterOutline),
            user_instruction: buildSceneOutlineInstruction(chapterOutline, requestedWordCount, {
              writingGoalContract,
              chapterLengthPlan,
            }),
          }),
          generationEvents,
        ),
      );
      const sceneOutline = normalizeSceneOutline(rawSceneOutline, requestedWordCount, chapterLengthPlan);
      const sceneOutlineBudget = createSceneOutlineBudgetMetadata(rawSceneOutline);
      const lengthPlan = createRuntimeLengthPlan({
        writingPath: writingPathResolution.writing_path,
        requestedWordCount,
        sceneOutline,
        chapterLengthPlan,
      });
      const sceneResults = [];
      for (const [sceneIndex, scene] of sceneOutline.entries()) {
        const sceneEventStart = generationEvents.length;
        const sceneLengthLimit = getSceneOutputTokenLimit(lengthPlan, scene);
        let sceneContent = await runStep(steps, `generate_scene_content_${sceneIndex + 1}`, () =>
          generateWithPrompt(
            "scene_writer_prompt",
            renderSceneWriterPrompt({
              ...variables,
              writing_skills: writerSkills,
              outline: mergeOutlineForWriter(variables.outline, chapterOutline),
              user_instruction: buildSceneWriterInstruction(scene, sceneIndex, sceneOutline.length, sceneResults, lengthPlan),
            }),
            generationEvents,
            { maxOutputTokens: sceneLengthLimit },
          ),
        );
        let continueAttempts = 0;
        let continueBlockedByLength = false;
        let continueBlockedReason = "";
        while (true) {
          const continueDecision = getContinueChapterDecision({
            sceneContent,
            generationEvents,
            scene,
            lengthPlan,
            continueAttempts,
          });
          if (!continueDecision.should_continue) {
            continueBlockedByLength = continueDecision.blocked_by_length;
            continueBlockedReason = continueDecision.blocked_reason;
            break;
          }
          const continueLimit = getContinuationOutputTokenLimit(lengthPlan, scene, sceneContent);
          const continuation = await runStep(steps, "continue_chapter", () =>
            generateWithPrompt(
              "continue_chapter_prompt",
              renderContinueChapterPrompt({
                ...variables,
                outline: mergeOutlineForWriter(variables.outline, chapterOutline),
                user_instruction: buildContinueChapterInstruction({
                  chapterContent: sceneContent,
                  requestedWordCount: scene.target_word_count,
                  lengthPlan,
                }),
              }),
              generationEvents,
              { maxOutputTokens: continueLimit },
            ),
          );
          sceneContent = appendChapterContinuation(sceneContent, continuation);
          continueAttempts += 1;
        }
        const cleanSceneContent = removeChapterEndMarker(sceneContent);
        let sceneAudit = isSceneCompletionAuditEnabled(writingPathPolicy)
          ? await runStep(steps, `audit_scene_completion_${sceneIndex + 1}`, () =>
              auditChapterCompletion(variables, chapterOutline, cleanSceneContent, generationEvents),
            )
          : createSkippedCompletionAudit(createPathDisabledReason("scene_completion_audit", writingPathPolicy.path_id));
        if (!sceneAudit.is_complete && isSceneCompletionRepairEnabled(writingPathPolicy)) {
          const repairedScene = await runStep(steps, `repair_scene_completion_${sceneIndex + 1}`, () =>
            generateWithPrompt(
              "chapter_completion_repair_prompt",
              renderChapterCompletionRepairPrompt({
                ...variables,
                outline: chapterOutline,
                user_instruction: buildChapterCompletionRepairInstruction(cleanSceneContent, sceneAudit),
              }),
              generationEvents,
            ),
          );
          sceneContent = repairedScene;
          sceneAudit = await runStep(steps, `audit_repaired_scene_completion_${sceneIndex + 1}`, () =>
            auditChapterCompletion(variables, chapterOutline, removeChapterEndMarker(sceneContent), generationEvents),
          );
        } else if (!sceneAudit.is_complete && !isSceneCompletionRepairEnabled(writingPathPolicy)) {
          sceneAudit = {
            ...sceneAudit,
            repair_skipped: true,
            repair_skipped_reason: createPathDisabledReason("scene_completion_repair", writingPathPolicy.path_id),
          };
        }
        let adjustment = createSceneAdjustmentMetadata("none", cleanSceneContent, scene.target_word_count);
        const sceneContentBeforeAdjustment = removeChapterEndMarker(sceneContent);
        const adjustmentType = getSceneAdjustmentType(removeChapterEndMarker(sceneContent), scene.target_word_count);
        if (!isSceneAdjustmentEnabled(writingPathPolicy)) {
          adjustment = createSceneAdjustmentMetadata(adjustmentType === "none" ? "none" : adjustmentType, sceneContentBeforeAdjustment, scene.target_word_count, {
            adjustmentSkipped: true,
            adjustmentSkippedReason: createPathDisabledReason("expand_compress", writingPathPolicy.path_id),
          });
        } else if (adjustmentType !== "none") {
          const adjustmentResult = await runSceneAdjustment({
            steps,
            variables,
            chapterOutline,
            scene,
            sceneIndex,
            sceneContent: removeChapterEndMarker(sceneContent),
            adjustmentType,
            generationEvents,
          });
          adjustment = adjustmentResult.adjustment;
          if (adjustmentResult.content) {
            sceneContent = adjustmentResult.content;
            sceneAudit = await runStep(steps, `audit_adjusted_scene_completion_${sceneIndex + 1}`, () =>
              auditChapterCompletion(variables, chapterOutline, removeChapterEndMarker(sceneContent), generationEvents),
            );
          }
        }
        sceneResults.push({
          scene,
          content: removeChapterEndMarker(sceneContent),
          contentBeforeAdjustment: sceneContentBeforeAdjustment,
          hasEndMarker: hasChapterEndMarker(sceneContent),
          completionAudit: sceneAudit,
          adjustment,
          events: generationEvents.slice(sceneEventStart),
          continueBlockedByLength,
          continueBlockedReason,
          continueAttempts,
        });
      }
      let chapterContent = sceneResults.map((result) => result.content).filter(Boolean).join("\n\n");
      const hasEndMarker = sceneResults.length > 0 && sceneResults.every((result) => result.hasEndMarker);
      const cleanChapterContent = chapterContent.trim();
      let completionAudit = isChapterCompletionAuditEnabled(writingPathPolicy)
        ? await runStep(steps, "audit_chapter_completion", () =>
            auditChapterCompletion(variables, chapterOutline, cleanChapterContent, generationEvents, {
              input,
              context,
              sceneOutline,
              chapterTitle: String(input.title || `第 ${chapterNumber} 章`),
              userInstruction,
              requestedWordCount,
              auditScope: "chapter",
            }),
          )
        : createSkippedCompletionAudit(createPathDisabledReason("chapter_completion_audit", writingPathPolicy.path_id));
      let chapterRepairAttempts = 0;
      const maxChapterRepairAttempts = getMaxChapterRepairAttempts(writingPathPolicy);
      if (!completionAudit.is_complete && chapterRepairAttempts < maxChapterRepairAttempts) {
        const repairedContent = await runStep(steps, "repair_chapter_completion", () =>
          generateWithPrompt(
            "chapter_completion_repair_prompt",
            renderChapterCompletionRepairPrompt({
              ...variables,
              outline: chapterOutline,
              user_instruction: buildChapterCompletionRepairInstruction(cleanChapterContent, completionAudit),
            }),
            generationEvents,
          ),
        );
        chapterContent = repairedContent;
        chapterRepairAttempts += 1;
        completionAudit = await runStep(steps, "audit_repaired_chapter_completion", () =>
          auditChapterCompletion(variables, chapterOutline, removeChapterEndMarker(chapterContent), generationEvents, {
            input,
            context,
            sceneOutline,
            chapterTitle: String(input.title || `第 ${chapterNumber} 章`),
            userInstruction,
            requestedWordCount,
            auditScope: "chapter_repaired",
            previousTail: cleanChapterContent.slice(-1200),
          }),
        );
      }
      const completionRepairLimitReached = !completionAudit.is_complete && chapterRepairAttempts >= maxChapterRepairAttempts;
      const completionWarning = completionRepairLimitReached && shouldSaveIncompleteWithWarning(writingPathPolicy)
        ? "章节完成度审核仍未完全通过，standard_chapter 已保存当前正文并停止继续修复。"
        : "";
      const finalChapterContent = removeChapterEndMarker(chapterContent);
      const allowReviewOnIncomplete = !completionAudit.is_complete && shouldSaveIncompleteWithWarning(writingPathPolicy);
      const qualityReview = completionAudit.is_complete && isQualityReviewEnabled(writingPathPolicy)
        ? await runWritingQualityReview({
            steps,
            projectId,
            chapterNumber,
            variables: {
              ...variables,
              memory: context.memory || {},
            },
            chapterContent: finalChapterContent,
            sceneOutline,
            sceneMetadata: createSceneMetadata(sceneResults),
            userInstruction,
            generationEvents,
          })
        : createSkippedQualityReview(
            completionAudit.is_complete ? createPathDisabledReason("quality_review", writingPathPolicy.path_id) : "",
          );
      const transitionReview = completionAudit.is_complete && isTransitionReviewEnabled(writingPathPolicy)
        ? await runSceneTransitionReview({
            steps,
            projectId,
            chapterNumber,
            variables: {
              ...variables,
              memory: context.memory || {},
            },
            chapterContent: finalChapterContent,
            sceneOutline,
            sceneMetadata: createSceneMetadata(sceneResults),
            userInstruction,
            generationEvents,
          })
        : createSkippedTransitionReview(
            completionAudit.is_complete ? createPathDisabledReason("transition_review", writingPathPolicy.path_id) : "",
          );
      const editorialSuggestions = (completionAudit.is_complete || allowReviewOnIncomplete) && isEditorialSuggestionsEnabled(writingPathPolicy)
        ? await runEditorialSuggestionsReview({
            steps,
            projectId,
            chapterNumber,
            variables: {
              ...variables,
              memory: context.memory || {},
            },
            chapterContent: finalChapterContent,
            qualityReview,
            transitionReview,
            userInstruction,
            generationEvents,
          })
        : createSkippedEditorialSuggestions(
            completionAudit.is_complete ? createPathDisabledReason("editorial_suggestions", writingPathPolicy.path_id) : "",
          );
      const contextPackEstimates = createChapterContextPackEstimates({
        context,
        previousSummaries: previous.summaries,
        userInstruction,
        chapterNumber,
        title: input.title,
        requestedWordCount,
        writingPathResolution,
        sceneOutline,
        chapterContent: finalChapterContent,
      });
      const generationMetadata = createChapterGenerationMetadata({
        projectId,
        chapterId,
        chapterNumber,
        requestedWordCount,
        content: finalChapterContent,
        chapterContentBeforeAdjustments: sceneResults.map((result) => result.contentBeforeAdjustment || result.content).filter(Boolean).join("\n\n"),
        hasChapterEndMarker: hasEndMarker || hasChapterEndMarker(chapterContent),
        completionAudit,
        completionWarning,
        chapterRepairAttempts,
        completionRepairLimitReached,
        generationEvents,
        sceneMetadata: createSceneMetadata(sceneResults),
        qualityReview,
        transitionReview,
        editorialSuggestions,
        contextPackEstimates,
        writingPath: writingPathResolution,
        executionPlan,
        writingPathPolicy,
        lengthPlan,
        writingGoalContract,
        chapterLengthPlan,
        sceneOutlineBudget,
      });
      if (!completionAudit.is_complete && !shouldSaveIncompleteWithWarning(writingPathPolicy)) {
        const metadataReport = await runStep(steps, "save_generation_metadata", () =>
          saveChapterGenerationMetadata(projectManager, projectId, chapterNumber, generationMetadata),
        );
        return {
          ok: true,
          project_id: projectId,
          chapter_number: chapterNumber,
          chapter_id: chapterId,
          chapter_file: "",
          chapter_outline: chapterOutline,
          scene_outline: sceneOutline,
          completion_audit: completionAudit,
        generation_metadata: generationMetadata,
        generation_metadata_file: metadataReport?.fileName || "",
        quality_review_file: qualityReview.fileName || "",
        transition_review_file: transitionReview.fileName || "",
        editorial_suggestions_file: editorialSuggestions.fileName || "",
        needs_completion_review: true,
        warning: completionAudit.issues.join("; ") || completionAudit.ending_status || "章节结尾未通过完成度审核。",
          content: finalChapterContent,
          summary: "",
          memory: null,
          steps,
        };
      }
      const savedChapter = await runStep(steps, "save_chapter_file", () =>
        projectManager.saveProjectChapter(projectId, chapterFileName, finalChapterContent),
      );
      const summaryPromptPlan = createSummarizerPromptPlan({
        input,
        variables,
        context,
        previousSummaries: previous.summaries,
        chapterOutline,
        chapterContent: finalChapterContent,
        chapterTitle: String(input.title || `第 ${chapterNumber} 章`),
        userInstruction,
        requestedWordCount,
        writingPathResolution,
      });
      const summaryText = await runStep(steps, "summarize_chapter_memory", () =>
        generateWithPrompt("summarizer_prompt", summaryPromptPlan.prompt, generationEvents),
      );
      const memorySummaryCleanResult = cleanMemorySummary(summaryText);
      const memory = await runStep(steps, "update_memory", () =>
        memoryManager.updateChapterSummary(projectId, chapterId, memorySummaryCleanResult.summary, {
          title: String(input.title || `第 ${chapterNumber} 章`),
        }),
      );
      generationMetadata.memory_summary_cleaned = memorySummaryCleanResult.cleaned;
      generationMetadata.memory_summary_clean_reason = memorySummaryCleanResult.reason;
      generationMetadata.memory_summary_clean_warning = memorySummaryCleanResult.warning;
      generationMetadata.context_pack_summary_enabled = summaryPromptPlan.contextPackEnabled;
      generationMetadata.summarizer_prompt_input_chars_before = summaryPromptPlan.inputCharsBefore;
      generationMetadata.summarizer_prompt_input_chars_after = summaryPromptPlan.inputCharsAfter;
      generationMetadata.summarizer_context_estimated_tokens = summaryPromptPlan.summarizerContextEstimatedTokens;
      generationMetadata.summarizer_context_omitted_sections = summaryPromptPlan.summarizerContextOmittedSections;
      generationMetadata.summarizer_memory_sections_included = summaryPromptPlan.summarizerMemorySectionsIncluded;
      generationMetadata.model_tier_usage = createModelTierUsage(generationEvents);
      generationMetadata.actual_model_sent_usage = createActualModelSentUsage(generationEvents);
      generationMetadata.model_routing_warnings = createModelRoutingWarnings(generationEvents);
      const metadataReport = await runStep(steps, "save_generation_metadata", () =>
        saveChapterGenerationMetadata(projectManager, projectId, chapterNumber, generationMetadata),
      );

      return {
        ok: true,
        project_id: projectId,
        chapter_number: chapterNumber,
        chapter_id: chapterId,
        chapter_file: savedChapter.fileName,
        chapter_outline: chapterOutline,
        scene_outline: sceneOutline,
        completion_audit: completionAudit,
        generation_metadata: generationMetadata,
        generation_metadata_file: metadataReport?.fileName || "",
        quality_review_file: qualityReview.fileName || "",
        transition_review_file: transitionReview.fileName || "",
        editorial_suggestions_file: editorialSuggestions.fileName || "",
        quality_review: qualityReview.report || null,
        transition_review: transitionReview.report || null,
        editorial_suggestions: editorialSuggestions.report || null,
        warning: generationMetadata.length_warning || undefined,
        content: finalChapterContent,
        summary: memorySummaryCleanResult.summary,
        memory,
        steps,
      };
    } catch (error) {
      const failedStep = steps.find((step) => step.status === "failed")?.name || "";
      const failureMetadata = createChapterFailureMetadata({
        projectId,
        chapterId,
        chapterNumber,
        input,
        error,
        failedStep,
        generationEvents,
        steps,
        writingPathResolution,
        executionPlan,
        writingPathPolicy,
      });
      let metadataReport = null;
      try {
        metadataReport = await saveChapterGenerationMetadata(projectManager, projectId, chapterNumber, failureMetadata);
      } catch (_metadataError) {
        metadataReport = null;
      }
      return {
        ok: false,
        project_id: projectId,
        chapter_number: chapterNumber,
        error: error.message,
        failed_step: failedStep,
        failed_prompt_id: String(error.prompt_id || ""),
        failed_llm_events: Array.isArray(generationEvents) ? generationEvents : [],
        generation_mode: String(input.generation_mode ?? input.generationMode ?? ""),
        writing_path: String(writingPathResolution?.writing_path || ""),
        generation_metadata_file: metadataReport?.fileName || "",
        steps,
      };
    }
  }

  async function auditChapterCompletion(variables, chapterOutline, chapterContent, generationEvents = null, options = {}) {
    const renderedPrompt = renderChapterCompletionAuditPrompt({
      ...variables,
      outline: chapterOutline,
      user_instruction: buildChapterCompletionAuditInstruction(chapterContent),
    });
    const auditContextEnabled = options?.input?.enable_context_pack_for_audit === true || options?.input?.enableContextPackForAudit === true;
    const promptPlan = auditContextEnabled
      ? createAuditPromptPlan({
          oldPrompt: renderedPrompt,
          chapterContent,
          context: options.context,
          sceneOutline: options.sceneOutline,
          chapterTitle: options.chapterTitle,
          userInstruction: options.userInstruction,
          requestedWordCount: options.requestedWordCount,
          previousTail: options.previousTail,
        })
      : null;
    if (auditContextEnabled) {
      const rawContextAudit = await generateWithPrompt("chapter_completion_auditor_prompt", promptPlan.prompt, generationEvents);
      const contextAudit = normalizeChapterCompletionAudit(rawContextAudit);
      const contextFallbackReason = getAuditContextFallbackReason(rawContextAudit);
      if (!contextFallbackReason && !contextAudit.json_parse_failed) {
        recordAuditContextEvent(generationEvents, {
          auditScope: options.auditScope || "chapter",
          inputCharsBefore: promptPlan.inputCharsBefore,
          inputCharsAfter: promptPlan.inputCharsAfter,
          estimatedTokens: promptPlan.estimatedTokens,
          omittedSections: promptPlan.omittedSections,
          fallbackTriggered: false,
          fallbackReason: "",
        });
        return {
          ...contextAudit,
          context_pack_audit_enabled: true,
          audit_context_fallback_triggered: false,
          audit_context_fallback_reason: "",
        };
      }

      const fallbackRawAudit = await generateWithPrompt(
        "chapter_completion_auditor_prompt",
        renderedPrompt,
        generationEvents,
        { forceDefaultModel: true, modelRoutingWarning: "audit context fallback used default client model" },
      );
      const fallbackAudit = normalizeChapterCompletionAudit(fallbackRawAudit);
      recordAuditContextEvent(generationEvents, {
        auditScope: options.auditScope || "chapter",
        inputCharsBefore: promptPlan.inputCharsBefore,
        inputCharsAfter: promptPlan.inputCharsAfter,
        estimatedTokens: promptPlan.estimatedTokens,
        omittedSections: promptPlan.omittedSections,
        fallbackTriggered: true,
        fallbackReason: contextFallbackReason || "json_parse_failed",
      });
      if (!fallbackAudit.json_parse_failed && !getAuditContextFallbackReason(fallbackRawAudit)) {
        return {
          ...fallbackAudit,
          context_pack_audit_enabled: true,
          audit_context_fallback_triggered: true,
          audit_context_fallback_reason: contextFallbackReason || "json_parse_failed",
          audit_fallback_triggered: true,
          audit_fallback_reason: contextFallbackReason || "json_parse_failed",
          audit_fallback_prompt_id: "chapter_completion_auditor_prompt",
          audit_fallback_used_default_model: true,
          initial_raw_audit: contextAudit.raw_audit,
        };
      }
      return {
        is_complete: false,
        ending_status: "completion audit failed",
        issues: ["JSON parse failed after fallback."],
        suggested_fix: "请补完章节结尾，并人工复查。",
        raw_audit: String(fallbackRawAudit || "").trim(),
        initial_raw_audit: contextAudit.raw_audit,
        json_parse_failed: true,
        context_pack_audit_enabled: true,
        audit_context_fallback_triggered: true,
        audit_context_fallback_reason: contextFallbackReason || "json_parse_failed",
        audit_fallback_triggered: true,
        audit_fallback_reason: contextFallbackReason || "json_parse_failed",
        audit_fallback_prompt_id: "chapter_completion_auditor_prompt",
        audit_fallback_used_default_model: true,
      };
    }
    const rawAudit = await generateWithPrompt("chapter_completion_auditor_prompt", renderedPrompt, generationEvents);
    const audit = normalizeChapterCompletionAudit(rawAudit);
    if (!audit.json_parse_failed) return audit;

    const fallbackRawAudit = await generateWithPrompt(
      "chapter_completion_auditor_prompt",
      renderedPrompt,
      generationEvents,
      { forceDefaultModel: true, modelRoutingWarning: "completion audit fallback used default client model" },
    );
    const fallbackAudit = normalizeChapterCompletionAudit(fallbackRawAudit);
    if (!fallbackAudit.json_parse_failed) {
      return {
        ...fallbackAudit,
        audit_fallback_triggered: true,
        audit_fallback_reason: "json_parse_failed",
        audit_fallback_prompt_id: "chapter_completion_auditor_prompt",
        audit_fallback_used_default_model: true,
        initial_raw_audit: audit.raw_audit,
      };
    }
    return {
      is_complete: false,
      ending_status: "completion audit failed",
      issues: ["JSON parse failed after fallback."],
      suggested_fix: "请补完章节结尾，并人工复查。",
      raw_audit: String(fallbackRawAudit || "").trim(),
      initial_raw_audit: audit.raw_audit,
      json_parse_failed: true,
      audit_fallback_triggered: true,
      audit_fallback_reason: "json_parse_failed",
      audit_fallback_prompt_id: "chapter_completion_auditor_prompt",
      audit_fallback_used_default_model: true,
    };
  }

  async function runSceneAdjustment({
    steps,
    variables,
    chapterOutline,
    scene,
    sceneIndex,
    sceneContent,
    adjustmentType,
    generationEvents,
  }) {
    const promptId = adjustmentType === "expand" ? "expand_scene_prompt" : "compress_scene_prompt";
    const renderPrompt = adjustmentType === "expand" ? renderExpandScenePrompt : renderCompressScenePrompt;
    const beforeContent = String(sceneContent || "").trim();
    const adjustmentEventsStart = generationEvents.length;
    const step = { name: `${adjustmentType}_scene_${sceneIndex + 1}`, status: "running" };
    steps.push(step);
    try {
      const adjusted = await generateWithPrompt(
        promptId,
        renderPrompt({
          ...variables,
          outline: chapterOutline,
          user_instruction: buildSceneAdjustmentInstruction(scene, beforeContent, adjustmentType),
        }),
        generationEvents,
      );
      step.status = "completed";
      const adjustmentEvents = generationEvents.slice(adjustmentEventsStart);
      const adjustedContent = removeChapterEndMarker(adjusted);
      const beforeDistance = getWordCountDistance(beforeContent, scene.target_word_count);
      const afterDistance = getWordCountDistance(adjustedContent, scene.target_word_count);
      const accepted = adjustedContent.trim().length > 0 && afterDistance < beforeDistance;
      return {
        content: accepted ? adjusted : "",
        adjustment: createSceneAdjustmentMetadata(adjustmentType, beforeContent, scene.target_word_count, {
          afterContent: adjustedContent,
          adjustmentEvents,
          adjustmentAccepted: accepted,
          adjustmentRejectedReason: accepted ? "" : "adjustment result is not closer to target word count",
        }),
      };
    } catch (error) {
      step.status = "completed";
      step.warning = error.message;
      return {
        content: "",
        adjustment: createSceneAdjustmentMetadata(adjustmentType, beforeContent, scene.target_word_count, {
          afterContent: beforeContent,
          adjustmentError: error.message,
          adjustmentAccepted: false,
          adjustmentRejectedReason: "adjustment failed",
          adjustmentEvents: generationEvents.slice(adjustmentEventsStart),
        }),
      };
    }
  }

  async function runWritingQualityReview({
    steps,
    projectId,
    chapterNumber,
    variables,
    chapterContent,
    sceneOutline,
    sceneMetadata,
    userInstruction,
    generationEvents,
  }) {
    const craftKnowledge = await loadCraftRulesForReview({
      reviewType: "quality",
      categories: ["scene", "character", "dialogue", "pacing", "style", "revision"],
      keywords: ["scene", "character", "dialogue", "pacing", "style", "revision", "冲突", "动机", "对白", "节奏"],
    });
    return runSoftReview({
      steps,
      stepName: "review_writing_quality",
      promptId: "quality_review_prompt",
      generationEvents,
      renderPrompt: () =>
        renderQualityReviewPrompt({
          ...variables,
          user_instruction: buildQualityReviewInstruction(buildQualityReviewPayload({
            chapterNumber,
            chapterContent,
            sceneOutline,
            sceneMetadata,
            characters: variables.characters,
            world: variables.world,
            style: variables.style,
            memory: variables.memory,
            userInstruction,
            craftRules: craftKnowledge.rules,
          })),
        }),
      normalizeReport: normalizeQualityReviewReport,
      createReportFileName: () => createQualityReviewReportFileName(chapterNumber),
      renderReportMarkdown: renderQualityReviewMarkdown,
      projectId,
      warning: craftKnowledge.warning,
      craftRuleIds: craftKnowledge.ruleIds,
      craftRules: craftKnowledge.rules,
    });
  }

  async function runSceneTransitionReview({
    steps,
    projectId,
    chapterNumber,
    variables,
    chapterContent,
    sceneOutline,
    sceneMetadata,
    userInstruction,
    generationEvents,
  }) {
    const craftKnowledge = await loadCraftRulesForReview({
      reviewType: "transition",
      categories: ["transition", "pacing", "scene"],
      keywords: ["transition", "pacing", "scene", "过渡", "拼接", "衔接", "节奏"],
    });
    return runSoftReview({
      steps,
      stepName: "review_scene_transitions",
      promptId: "transition_review_prompt",
      generationEvents,
      renderPrompt: () =>
        renderTransitionReviewPrompt({
          ...variables,
          user_instruction: buildTransitionReviewInstruction(buildTransitionReviewPayload({
            chapterNumber,
            chapterContent,
            sceneOutline,
            sceneMetadata,
            characters: variables.characters,
            world: variables.world,
            style: variables.style,
            memory: variables.memory,
            userInstruction,
            craftRules: craftKnowledge.rules,
          })),
        }),
      normalizeReport: normalizeTransitionReviewReport,
      createReportFileName: () => createTransitionReviewReportFileName(chapterNumber),
      renderReportMarkdown: renderTransitionReviewMarkdown,
      projectId,
      warning: craftKnowledge.warning,
      craftRuleIds: craftKnowledge.ruleIds,
      craftRules: craftKnowledge.rules,
    });
  }

  async function runEditorialSuggestionsReview({
    steps,
    projectId,
    chapterNumber,
    variables,
    chapterContent,
    qualityReview,
    transitionReview,
    userInstruction,
    generationEvents,
  }) {
    const selectedCraftRules = summarizeSelectedCraftRules([
      ...(qualityReview?.craftRules || []),
      ...(transitionReview?.craftRules || []),
    ]);
    return runSoftReview({
      steps,
      stepName: "generate_editorial_suggestions",
      promptId: "editorial_suggestions_prompt",
      generationEvents,
      renderPrompt: () =>
        renderEditorialSuggestionsPrompt({
          ...variables,
          user_instruction: buildEditorialSuggestionsInstruction(buildEditorialSuggestionsPayload({
            chapterContent,
            qualityReviewReport: qualityReview?.report || null,
            transitionReviewReport: transitionReview?.report || null,
            style: variables.style,
            userInstruction,
            selectedCraftRules,
          })),
        }),
      normalizeReport: normalizeEditorialSuggestionsReport,
      createReportFileName: () => createEditorialSuggestionsReportFileName(chapterNumber),
      renderReportMarkdown: renderEditorialSuggestionsMarkdown,
      projectId,
    });
  }

  async function loadCraftRulesForReview({ reviewType, categories, keywords }) {
    try {
      const rules = await craftKnowledgeManager.select_rules_for_review({
        review_type: reviewType,
        categories,
        keywords,
        limit: 8,
      });
      const filteredRules = filterCraftRulesByCategory(rules, categories);
      return {
        rules: filteredRules,
        ruleIds: getCraftRuleIds(filteredRules),
        warning: "",
      };
    } catch (error) {
      return {
        rules: [],
        ruleIds: [],
        warning: `craft knowledge unavailable: ${error.message}`,
      };
    }
  }

  function filterCraftRulesByCategory(rules, categories) {
    const normalizedCategories = (Array.isArray(categories) ? categories : [])
      .map((category) => String(category || "").toLowerCase().trim())
      .filter(Boolean);
    const normalizedRules = Array.isArray(rules) ? rules : [];
    if (normalizedCategories.length === 0) return normalizedRules;
    return normalizedRules.filter((rule) => {
      const ruleCategory = String(rule?.category || "").toLowerCase().trim();
      return normalizedCategories.some(
        (category) => ruleCategory === category || ruleCategory.includes(category) || category.includes(ruleCategory),
      );
    });
  }

  async function runSoftReview({
    steps,
    stepName,
    promptId,
    generationEvents,
    renderPrompt,
    normalizeReport,
    createReportFileName,
    renderReportMarkdown,
    projectId,
    warning = "",
    craftRuleIds = [],
    craftRules = [],
  }) {
    const step = { name: stepName, status: "running" };
    steps.push(step);
    try {
      const rawReport = await generateWithPrompt(promptId, renderPrompt(), generationEvents);
      const report = normalizeReport(rawReport);
      const savedReport = await projectManager.saveProjectReport(
        projectId,
        createReportFileName(),
        renderReportMarkdown(report, rawReport),
      );
      step.status = "completed";
      return {
        status: "completed",
        fileName: savedReport?.fileName || "",
        report,
        error: "",
        warning: String(warning || ""),
        craftRuleIds: getCraftRuleIds(craftRuleIds),
        craftRules: normalizeCraftRulesForPayload(craftRules),
      };
    } catch (error) {
      step.status = "completed";
      step.warning = error.message;
      return {
        status: "soft_failed",
        fileName: "",
        report: null,
        error: error.message,
        warning: String(warning || ""),
        craftRuleIds: getCraftRuleIds(craftRuleIds),
        craftRules: normalizeCraftRulesForPayload(craftRules),
      };
    }
  }

  async function consistency_check(input = {}) {
    const projectId = normalizeProjectId(input.project_id ?? input.projectId);
    const chapterNumber = normalizeChapterNumber(input.chapter_number ?? input.chapterNumber);
    const chapterFileName = String(input.chapter_file ?? input.chapterFile ?? createChapterFileName(chapterNumber));
    const steps = [];

    try {
      const context = await runStep(steps, "read_project_context", () => tools.read_project_context(projectId));
      const writingSkills = await runStep(steps, "load_consistency_skills", () =>
        loadSkillContext(["story-6w", "character-archetypes"]),
      );
      const chapterContent = await runStep(steps, "read_current_chapter", () =>
        readCurrentChapterContent(projectId, chapterNumber, chapterFileName, input.content),
      );
      const variables = buildPromptVariables(
        {
          ...context,
          materials: {
            outline: "",
            characters: context.materials?.characters || "",
            world: context.materials?.world || "",
            style: context.materials?.style || "",
            goals: context.materials?.goals || "",
          },
        },
        Object.values(context.memory?.chapter_summaries || {}).slice(-5),
        buildConsistencyInstruction(chapterNumber, chapterContent),
        writingSkills,
      );
      const rawReport = await runStep(steps, "generate_consistency_report", () =>
        generateWithPrompt("consistency_checker_prompt", renderConsistencyCheckerPrompt(variables)),
      );
      const report = await runStep(steps, "normalize_consistency_report", () =>
        Promise.resolve(normalizeConsistencyReport(rawReport)),
      );
      const reportFileName = createConsistencyReportFileName(chapterNumber);
      const savedReport =
        input.save_report === false
          ? null
          : await runStep(steps, "save_consistency_report", () =>
              projectManager.saveProjectReport(projectId, reportFileName, renderConsistencyReportMarkdown(report, rawReport)),
            );

      return {
        ok: true,
        project_id: projectId,
        chapter_number: chapterNumber,
        chapter_file: chapterFileName,
        report_file: savedReport?.fileName || "",
        report,
        raw_report: rawReport,
        steps,
      };
    } catch (error) {
      return {
        ok: false,
        project_id: projectId,
        chapter_number: chapterNumber,
        error: error.message,
        failed_step: steps.find((step) => step.status === "failed")?.name || "",
        steps,
      };
    }
  }

  async function generate_chapter_outline(input = {}) {
    const projectId = normalizeProjectId(input.project_id ?? input.projectId);
    const chapterNumber = normalizeChapterNumber(input.chapter_number ?? input.chapterNumber);
    const userInstruction = String(input.user_instruction ?? input.userInstruction ?? "").trim();
    if (!userInstruction) throw new Error("user_instruction is required");
    const steps = [];
    try {
      const context = await runStep(steps, "read_project_context", () => tools.read_project_context(projectId));
      const previous = await runStep(steps, "read_previous_chapter_summaries", () =>
        tools.get_previous_chapter_summaries(projectId, input.previous_limit ?? input.previousLimit ?? 3, chapterNumber),
      );
      const writingSkills = await runStep(steps, "load_planning_skills", () =>
        loadSkillContext(["story-6w", "beat-sheet-pacing"]),
      );
      const outline = await runStep(steps, "generate_chapter_outline", () =>
        generateWithPrompt(
          "planner_prompt",
          renderPlannerPrompt(
            buildChapterPromptVariables(context, previous.summaries, userInstruction, {
              chapterNumber,
              title: input.title,
              writingSkills,
            }),
          ),
        ),
      );
      return { ok: true, project_id: projectId, chapter_number: chapterNumber, outline, steps };
    } catch (error) {
      return createFailedResult(projectId, chapterNumber, error, steps);
    }
  }

  async function summarize_chapter(input = {}) {
    const projectId = normalizeProjectId(input.project_id ?? input.projectId);
    const chapterNumber = normalizeChapterNumber(input.chapter_number ?? input.chapterNumber);
    const chapterFileName = String(input.chapter_file ?? input.chapterFile ?? createChapterFileName(chapterNumber));
    const steps = [];
    try {
      const context = await runStep(steps, "read_project_context", () => tools.read_project_context(projectId));
      const chapterContent = await runStep(steps, "read_current_chapter", () =>
        readCurrentChapterContent(projectId, chapterNumber, chapterFileName, input.content),
      );
      const promptVariables = buildPromptVariables(context, Object.values(context.memory?.chapter_summaries || {}).slice(-5), "");
      const summaryPromptPlan = createSummarizerPromptPlan({
        input,
        variables: promptVariables,
        context,
        previousSummaries: Object.values(context.memory?.chapter_summaries || {}).slice(-5),
        chapterOutline: promptVariables.outline,
        chapterContent,
        chapterTitle: String(input.title || `第 ${chapterNumber} 章`),
        userInstruction: String(input.user_instruction ?? input.userInstruction ?? ""),
        requestedWordCount: input.target_word_count ?? input.targetWordCount ?? null,
        writingPathResolution: null,
      });
      const summary = await runStep(steps, "summarize_chapter_memory", () =>
        generateWithPrompt("summarizer_prompt", summaryPromptPlan.prompt),
      );
      const memorySummaryCleanResult = cleanMemorySummary(summary);
      const memory = await runStep(steps, "update_memory", () =>
        memoryManager.updateChapterSummary(projectId, `chapter-${chapterNumber}`, memorySummaryCleanResult.summary, {
          title: String(input.title || `第 ${chapterNumber} 章`),
        }),
      );
      return { ok: true, project_id: projectId, chapter_number: chapterNumber, summary: memorySummaryCleanResult.summary, memory, steps };
    } catch (error) {
      return createFailedResult(projectId, chapterNumber, error, steps);
    }
  }

  async function rewrite_text(input = {}) {
    const projectId = normalizeProjectId(input.project_id ?? input.projectId);
    const chapterNumber = normalizeChapterNumber(input.chapter_number ?? input.chapterNumber);
    const selectedText = String(input.text ?? input.selected_text ?? input.selectedText ?? "").trim();
    if (!selectedText) throw new Error("selected text is required");
    const instruction = String(input.user_instruction ?? input.userInstruction ?? "").trim();
    const steps = [];
    try {
      const context = await runStep(steps, "read_project_context", () => tools.read_project_context(projectId));
      const writingSkills = await runStep(steps, "load_editing_skills", () =>
        loadSkillContext(["beat-sheet-pacing", "character-archetypes"]),
      );
      const rewritten_text = await runStep(steps, "rewrite_selected_text", () =>
        generateWithPrompt(
          "editor_prompt",
          renderEditorPrompt({
            ...buildPromptVariables(context, Object.values(context.memory?.chapter_summaries || {}).slice(-5), [
              instruction || "请改写选中文本，保留原意，提升表达。",
              "",
              "【选中文本】",
              selectedText,
            ].join("\n"), writingSkills),
          }),
        ),
      );
      return { ok: true, project_id: projectId, chapter_number: chapterNumber, rewritten_text, steps };
    } catch (error) {
      return createFailedResult(projectId, chapterNumber, error, steps);
    }
  }

  async function generate_project_materials_from_idea(input = {}) {
    const projectId = normalizeProjectId(input.project_id ?? input.projectId);
    const idea = String(input.idea ?? input.inspiration ?? "").trim();
    const materialTypes = normalizeProjectMaterialTypes(input.material_types ?? input.materialTypes);
    if (!idea) throw new Error("idea is required");
    const steps = [];
    let rawMaterials = "";
    try {
      const context = await runStep(steps, "read_project_context", () => tools.read_project_context(projectId));
      const writingSkills = await runStep(steps, "load_project_material_skills", () =>
        loadSkillContext(["story-6w", "character-archetypes", "beat-sheet-pacing"]),
      );
      rawMaterials = await runStep(steps, "generate_project_materials", () =>
        generateWithPrompt(
          "project_materials_prompt",
          renderProjectMaterialsPrompt({
            outline: context.materials?.outline || "",
            characters: context.materials?.characters || "",
            world: context.materials?.world || "",
            style: context.materials?.style || "",
            goals: context.materials?.goals || "",
            writing_skills: writingSkills,
            memory: context.memory || {},
            previous_summaries: [],
            user_instruction: buildProjectMaterialsInstruction(idea, materialTypes),
          }),
        ),
      );
      const materials = await runStep(steps, "normalize_project_materials", () =>
        Promise.resolve(normalizeProjectMaterialsDraft(rawMaterials, materialTypes)),
      );
      return { ok: true, project_id: projectId, materials, raw_materials: rawMaterials, steps };
    } catch (error) {
      const failedReport = rawMaterials
        ? await saveProjectMaterialsFailureReport(projectId, rawMaterials, error).catch(() => null)
        : null;
      return {
        ok: false,
        project_id: projectId,
        error: failedReport?.fileName
          ? `${error.message}; raw output saved to reports/${failedReport.fileName}`
          : error.message,
        raw_materials_preview: createTextPreview(rawMaterials),
        raw_materials_report_file: failedReport?.fileName || "",
        failed_step: steps.find((step) => step.status === "failed")?.name || "",
        steps,
      };
    }
  }

  async function readCurrentChapterContent(projectId, chapterNumber, chapterFileName, providedContent) {
    const directContent = String(providedContent ?? "").trim();
    if (directContent) return directContent;
    try {
      const chapter = await projectManager.readProjectChapter(projectId, chapterFileName);
      return chapter.content;
    } catch (error) {
      if (error.code && error.code !== "ENOENT") throw error;
      const libraryChapter = await tools.read_chapter(projectId, chapterNumber);
      return libraryChapter.content;
    }
  }

  async function generateWithPrompt(promptId, renderedPrompt, generationEvents = null, options = {}) {
    const modelResolution = Array.isArray(generationEvents) ? resolveModelMetadataForPrompt(promptId, generationEvents, options) : null;
    const request = {
      prompt_id: promptId,
      system: renderedPrompt.system,
      user: renderedPrompt.user,
      messages: renderedPrompt.messages,
    };
    if (modelResolution?.should_send_model === true && modelResolution.actual_model_sent && options.forceDefaultModel !== true) {
      request.model = modelResolution.actual_model_sent;
    }
    const maxOutputTokens = normalizeOutputTokenLimit(options.maxOutputTokens ?? options.max_output_tokens);
    if (maxOutputTokens) {
      request.max_output_tokens = maxOutputTokens;
      request.max_tokens = maxOutputTokens;
    }
    let response;
    try {
      response = await llmClient.generate(request);
    } catch (error) {
      error.prompt_id = promptId;
      throw error;
    }
    const text = extractGeneratedText(response);
    if (!text) throw new Error(`${promptId} returned empty content`);
    if (Array.isArray(generationEvents)) {
      generationEvents.push({
        prompt_id: promptId,
        provider: String(response?.provider || ""),
        generated_at: String(response?.generatedAt || response?.generated_at || ""),
        model_tier: modelResolution.model_tier,
        resolved_model: modelResolution.resolved_model,
        actual_model_sent: modelResolution.actual_model_sent,
        model_policy_source: modelResolution.model_policy_source,
        model_routing_enabled: modelResolution.model_routing_enabled === true,
        model_routing_warning: modelResolution.model_routing_warning,
        metadata: normalizeLlmMetadata(response?.metadata),
      });
    }
    return text;
  }

  function resolveModelMetadataForPrompt(promptId, generationEvents, options = {}) {
    const context = generationEvents?.modelRoutingContext || {};
    const resolution = modelRouter.resolveModelForStep({
      prompt_id: promptId,
      step_id: "",
      writing_path: context.writing_path || "",
      generation_mode: context.generation_mode || "",
      enable_model_routing: context.enable_model_routing,
      model_routing: context.model_routing,
    });
    if (options.forceDefaultModel === true) {
      return {
        ...resolution,
        actual_model_sent: "",
        should_send_model: false,
        model_routing_enabled: false,
        routing_enabled: false,
        model_routing_warning: options.modelRoutingWarning || "model routing disabled for fallback",
      };
    }
    return resolution;
  }

  async function loadSkillContext(skillIds) {
    const skills = [];
    for (const skillId of skillIds) {
      const skill = await skillManager.readSkill(skillId);
      skills.push(formatSkillForPrompt(skill));
    }
    return skills.join("\n\n");
  }

  async function saveProjectMaterialsFailureReport(projectId, rawMaterials, error) {
    if (!projectManager || typeof projectManager.saveProjectReport !== "function") return null;
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+$/, "").replace("T", "_");
    return projectManager.saveProjectReport(
      projectId,
      `project_materials_failed_${stamp}.md`,
      [
        "# Project Materials Generation Failed",
        "",
        `Error: ${error.message}`,
        "",
        "## Raw Model Output",
        "",
        "```text",
        String(rawMaterials || "").trim(),
        "```",
        "",
      ].join("\n"),
    );
  }

  return {
    write_chapter,
    consistency_check,
    generate_chapter_outline,
    summarize_chapter,
    rewrite_text,
    generate_project_materials_from_idea,
  };
}

function createFailedResult(projectId, chapterNumber, error, steps) {
  return {
    ok: false,
    project_id: projectId,
    chapter_number: chapterNumber,
    error: error.message,
    failed_step: steps.find((step) => step.status === "failed")?.name || "",
    steps,
  };
}

async function runStep(steps, name, operation) {
  const step = { name, status: "running" };
  steps.push(step);
  try {
    const result = await operation();
    step.status = "completed";
    return result;
  } catch (error) {
    step.status = "failed";
    step.error = error.message;
    throw error;
  }
}

function buildPromptVariables(context, previousSummaries, userInstruction, writingSkills = "") {
  const materials = context.materials || {};
  return {
    outline: materials.outline || "",
    characters: materials.characters || "",
    world: materials.world || "",
    style: materials.style || "",
    goals: materials.goals || "",
    writing_skills: writingSkills,
    memory: context.memory || {},
    previous_summaries: Array.isArray(previousSummaries) ? previousSummaries : [],
    user_instruction: userInstruction,
  };
}

function buildChapterPromptVariables(context, previousSummaries, userInstruction, chapter = {}) {
  const chapterNumber = normalizeChapterNumber(chapter.chapterNumber);
  const title = String(chapter.title || "").trim();
  const writingSkills = String(chapter.writingSkills || "");
  const writingGoalContract = chapter.writingGoalContract || null;
  const chapterLengthPlan = chapter.chapterLengthPlan || null;
  const scopedMemory = {
    ...(context.memory || {}),
    chapter_summaries: Object.fromEntries(
      (Array.isArray(previousSummaries) ? previousSummaries : [])
        .map((summary, index) => {
          const key = summary?.chapter_id || `previous-${index + 1}`;
          return [key, summary];
        }),
    ),
  };
  return buildPromptVariables(
    { ...context, memory: scopedMemory },
    previousSummaries,
    [
      `当前目标章节：第 ${chapterNumber} 章${title ? `《${title}》` : ""}。`,
      "只生成这一章的小纲或正文，不要把后续章节当作已发生内容。",
      "如果前文章节摘要为空，说明这是第一章或前文尚未写入记忆，请从第一章的进入场景开始。",
      "",
      writingGoalContract || chapterLengthPlan
        ? [
            "【结构化写作目标合同】",
            JSON.stringify({
              writing_goal_contract: writingGoalContract,
              chapter_length_plan: chapterLengthPlan,
            }, null, 2),
            "以上合同优先级高于剧情完整性；预算写不完的剧情必须推迟到后续章节。",
            "",
          ].join("\n")
        : "",
      userInstruction,
    ].join("\n"),
    writingSkills,
  );
}

function formatSkillForPrompt(skill) {
  return [
    `# ${skill.name || skill.id}`,
    skill.description ? `用途：${skill.description}` : "",
    String(skill.body || "").trim(),
  ]
    .filter(Boolean)
    .join("\n");
}

function mergeOutlineForWriter(projectOutline, chapterOutline) {
  return [
    "项目大纲：",
    projectOutline || "（未提供）",
    "",
    "本章小纲：",
    chapterOutline || "（未提供）",
  ].join("\n");
}

function extractGeneratedText(response) {
  if (typeof response === "string") return response.trim();
  if (typeof response?.content === "string") return response.content.trim();
  if (typeof response?.text === "string") return response.text.trim();
  return "";
}

function createTextPreview(text, limit = 1200) {
  const source = String(text || "").trim();
  if (!source) return "";
  return source.length > limit ? `${source.slice(0, limit)}...` : source;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeProjectId(value) {
  const id = String(value || "").trim();
  if (!id) throw new Error("project_id is required");
  return id;
}

function normalizeChapterNumber(value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) throw new Error("chapter_number must be a positive integer");
  return number;
}

function createChapterFileName(chapterNumber) {
  return `chapter_${String(chapterNumber).padStart(3, "0")}.md`;
}

function createConsistencyReportFileName(chapterNumber) {
  return `consistency_chapter_${String(chapterNumber).padStart(3, "0")}.md`;
}

function createQualityReviewReportFileName(chapterNumber) {
  return `quality_chapter_${String(chapterNumber).padStart(3, "0")}.md`;
}

function createTransitionReviewReportFileName(chapterNumber) {
  return `transition_chapter_${String(chapterNumber).padStart(3, "0")}.md`;
}

function createEditorialSuggestionsReportFileName(chapterNumber) {
  return `editorial_suggestions_chapter_${String(chapterNumber).padStart(3, "0")}.md`;
}

function buildConsistencyInstruction(chapterNumber, chapterContent) {
  return [
    `请检查第 ${chapterNumber} 章正文是否和项目人物设定、世界观设定、memory.json、前文记忆冲突。`,
    "不要修改正文，只输出严格 JSON，不要 Markdown 代码块。",
    "JSON 必须包含这些数组字段：contradictions, character_behavior_issues, timeline_issues, worldbuilding_issues, unresolved_questions, suggested_fixes。",
    "每个数组项应是短句或对象，能让作者定位问题和修改方向。",
    "",
    "【当前章节正文】",
    chapterContent,
  ].join("\n");
}

function buildQualityReviewPayload({
  chapterNumber,
  chapterContent,
  sceneOutline,
  sceneMetadata,
  characters,
  world,
  style,
  memory,
  userInstruction,
  craftRules,
}) {
  return {
    chapter_number: Number(chapterNumber) || null,
    chapter_content: String(chapterContent || ""),
    scene_outline: Array.isArray(sceneOutline) ? sceneOutline : [],
    scene_metadata: Array.isArray(sceneMetadata) ? sceneMetadata : [],
    characters: String(characters || ""),
    world: String(world || ""),
    style: String(style || ""),
    memory: memory && typeof memory === "object" ? memory : {},
    user_chapter_goal: String(userInstruction || ""),
    craft_rules: normalizeCraftRulesForPayload(craftRules),
  };
}

function buildQualityReviewInstruction(payload) {
  return [
    `请审查第 ${payload.chapter_number || "当前"} 章的小说写作质量。`,
    "只输出报告，不要修改正文，不要代写正文。",
    "craft_rules 只作为审查标准；不要逐字复述规则；不要引用书籍原文；输出具体、可执行的反馈。",
    "",
    "【quality_review_payload】",
    JSON.stringify(payload || {}, null, 2),
  ].join("\n");
}

function buildTransitionReviewPayload({
  chapterNumber,
  chapterContent,
  sceneOutline,
  sceneMetadata,
  characters,
  world,
  style,
  memory,
  userInstruction,
  craftRules,
}) {
  return {
    chapter_number: Number(chapterNumber) || null,
    chapter_content: String(chapterContent || ""),
    scene_outline: Array.isArray(sceneOutline) ? sceneOutline : [],
    scene_metadata: Array.isArray(sceneMetadata) ? sceneMetadata : [],
    characters: String(characters || ""),
    world: String(world || ""),
    style: String(style || ""),
    memory: memory && typeof memory === "object" ? memory : {},
    user_chapter_goal: String(userInstruction || ""),
    craft_rules: normalizeCraftRulesForPayload(craftRules),
  };
}

function buildTransitionReviewInstruction(payload) {
  return [
    `请审查第 ${payload.chapter_number || "当前"} 章的场景衔接质量。`,
    "只输出报告，不要修改正文，不要代写正文。",
    "craft_rules 只作为审查标准；不要逐字复述规则；不要引用书籍原文；输出具体、可执行的反馈。",
    "",
    "【transition_review_payload】",
    JSON.stringify(payload || {}, null, 2),
  ].join("\n");
}

function buildEditorialSuggestionsPayload({
  chapterContent,
  qualityReviewReport,
  transitionReviewReport,
  style,
  userInstruction,
  selectedCraftRules,
}) {
  return {
    chapter_content: String(chapterContent || ""),
    quality_review_report: qualityReviewReport && typeof qualityReviewReport === "object" ? qualityReviewReport : null,
    transition_review_report: transitionReviewReport && typeof transitionReviewReport === "object" ? transitionReviewReport : null,
    style: String(style || ""),
    user_chapter_goal: String(userInstruction || ""),
    selected_craft_rules: normalizeSelectedCraftRuleSummaries(selectedCraftRules),
  };
}

function buildEditorialSuggestionsInstruction(payload) {
  return [
    "请把以下审查结果整合成面向作者的审稿建议。",
    "不要自动修改正文，不要展示底层 scene_metadata、llm_events、metadata 或 craft_rule_ids。",
    "selected_craft_rules 只作为判断标准摘要，不要逐字复述规则。",
    "",
    "【editorial_suggestions_payload】",
    JSON.stringify(payload || {}, null, 2),
  ].join("\n");
}

function normalizeCraftRulesForPayload(rules) {
  return (Array.isArray(rules) ? rules : []).map((rule) => ({
    id: String(rule?.id || ""),
    title: String(rule?.title || ""),
    category: String(rule?.category || ""),
    principle: String(rule?.principle || ""),
    use_when: String(rule?.use_when || ""),
    checklist: Array.isArray(rule?.checklist) ? rule.checklist.map((item) => String(item || "")).filter(Boolean) : [],
    bad_patterns: Array.isArray(rule?.bad_patterns) ? rule.bad_patterns.map((item) => String(item || "")).filter(Boolean) : [],
    revision_strategy: String(rule?.revision_strategy || ""),
  })).filter((rule) => rule.id);
}

function getCraftRuleIds(rulesOrIds) {
  return (Array.isArray(rulesOrIds) ? rulesOrIds : [])
    .map((ruleOrId) => String(typeof ruleOrId === "string" ? ruleOrId : ruleOrId?.id || "").trim())
    .filter(Boolean);
}

function summarizeSelectedCraftRules(rules) {
  const seen = new Set();
  return normalizeCraftRulesForPayload(rules)
    .filter((rule) => {
      if (seen.has(rule.id)) return false;
      seen.add(rule.id);
      return true;
    })
    .map((rule) => ({
      title: rule.title,
      category: rule.category,
      principle_summary: truncateText(rule.principle, 120),
    }));
}

function normalizeSelectedCraftRuleSummaries(rules) {
  return (Array.isArray(rules) ? rules : [])
    .map((rule) => ({
      title: String(rule?.title || "").trim(),
      category: String(rule?.category || "").trim(),
      principle_summary: truncateText(rule?.principle_summary ?? rule?.principle, 120),
    }))
    .filter((rule) => rule.title || rule.category || rule.principle_summary);
}

function truncateText(value, maxLength) {
  const text = String(value || "").trim();
  const limit = Math.max(0, Math.floor(Number(maxLength) || 0));
  if (!limit || text.length <= limit) return text;
  return `${text.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

function buildProjectMaterialsInstruction(idea, materialTypes = null) {
  const selectedTypes = normalizeProjectMaterialTypes(materialTypes);
  const selectedText = selectedTypes.join(", ");
  return [
    "请把以下灵感发展成项目资料草稿。",
    "只输出严格 JSON，不要 Markdown 代码块。",
    `JSON 必须包含这些字符串字段：${selectedText}。不要输出未被要求的字段。`,
    `内容要适合直接写入这些项目资料文件：${selectedTypes.map((type) => `${type}.md`).join(", ")}。`,
    "如果已有项目资料已提供，必须在此基础上补充和细化，不要从零重写。",
    "已有 goals 中的目标章节数、每章目标字数、节奏规则优先级最高，除非原始灵感明确要求修改。",
    "如果原始灵感与已有资料冲突，保留已有资料，并在对应字段里写明“待确认冲突”。",
    selectedTypes.includes("outline") ? "outline 要包含阶段目标、主要矛盾链和前 3-5 章的具体落地点。" : "",
    selectedTypes.includes("characters") ? "characters 要写人物欲望、阻碍和关系变化。" : "",
    selectedTypes.includes("world") ? "world 要写规则、限制和代价。" : "",
    selectedTypes.includes("style") ? "style 要写叙事视角、节奏和语言禁忌。" : "",
    selectedTypes.includes("goals") ? "goals 必须包含目标章节数、每章目标字数、单章推进密度和慢速展开规则。" : "",
    "每个字段控制在 300 到 600 个中文字符以内，先给作者可继续扩展的第一版，不要追求完整长篇设定。",
    "",
    "【原始灵感】",
    idea,
  ].filter(Boolean).join("\n");
}

function buildSceneOutlineInstruction(chapterOutline, requestedWordCount, options = {}) {
  const writingGoalContract = options.writingGoalContract || null;
  const chapterLengthPlan = options.chapterLengthPlan || null;
  return [
    "请把本章小纲拆成可逐段生成的场景列表。",
    `章节目标字数：${requestedWordCount || "未指定，请按本章内容合理分配"}。`,
    writingGoalContract || chapterLengthPlan
      ? [
          "必须遵守以下 writing_goal_contract 和 chapter_length_plan。",
          JSON.stringify({
            writing_goal_contract: writingGoalContract,
            chapter_length_plan: chapterLengthPlan,
          }, null, 2),
          "要求：1. 本章最多规划 writing_goal_contract.outline_budget_policy 指定数量的主线节点和感情线细节；2. 超出目标字数或推进密度的剧情放入 deferred_plot_points；3. 不要为了完成项目资料里的伏笔而塞进本章；4. 预算优先于剧情完整性；5. scene 数量不得超过 chapter_length_plan.max_scene_count。",
        ].join("\n")
      : "",
    "只输出严格 JSON，不要 Markdown 代码块。",
    "JSON 可以是数组，或包含 scenes 数组。",
    "每个 scene 必须包含：scene_title, scene_goal, characters, conflict, expected_turning_point, target_word_count。",
    "如果输出对象，必须额外包含：covered_main_plot_nodes, covered_relationship_details, deferred_plot_points, why_fits_word_budget, scene_word_budgets。",
    "",
    "【本章小纲】",
    String(chapterOutline || "").trim(),
  ].filter(Boolean).join("\n");
}

function createRuntimeLengthPlan({ writingPath, requestedWordCount, sceneOutline, chapterLengthPlan }) {
  const target = normalizeChineseTargetWordCount(chapterLengthPlan?.effective_target_word_count || requestedWordCount);
  const enabled = String(writingPath || "") === "fast_draft" && target > 0;
  const scenes = Array.isArray(sceneOutline) ? sceneOutline : [];
  return {
    enabled,
    target_word_count: target || null,
    soft_max_word_count: normalizeChineseTargetWordCount(chapterLengthPlan?.soft_max_word_count) || Math.round(target * FAST_DRAFT_PROMPT_OVER_TARGET_RATIO),
    hard_max_word_count: normalizeChineseTargetWordCount(chapterLengthPlan?.hard_max_word_count) || Math.round(target * FAST_DRAFT_OVER_TARGET_RATIO),
    over_target_threshold: normalizeChineseTargetWordCount(chapterLengthPlan?.hard_max_word_count) || Math.round(target * FAST_DRAFT_OVER_TARGET_RATIO),
    prompt_over_target_threshold: normalizeChineseTargetWordCount(chapterLengthPlan?.soft_max_word_count) || Math.round(target * FAST_DRAFT_PROMPT_OVER_TARGET_RATIO),
    max_chapter_output_tokens: enabled ? estimateChineseOutputTokenLimit(target, 1.35, 256) : null,
    scene_count: scenes.length,
  };
}

function getSceneOutputTokenLimit(lengthPlan, scene) {
  if (!lengthPlan?.enabled) return null;
  const sceneTarget = normalizeChineseTargetWordCount(scene?.target_word_count);
  if (!sceneTarget) return null;
  return clampOutputTokenLimit(estimateChineseOutputTokenLimit(sceneTarget, 1.35, 192));
}

function getContinuationOutputTokenLimit(lengthPlan, scene, chapterContent) {
  if (!lengthPlan?.enabled) return null;
  const sceneTarget = normalizeChineseTargetWordCount(scene?.target_word_count);
  if (!sceneTarget) return null;
  const actual = countNovelWords(removeChapterEndMarker(chapterContent));
  const remaining = Math.max(80, Math.round(sceneTarget * FAST_DRAFT_PROMPT_OVER_TARGET_RATIO) - actual);
  return clampOutputTokenLimit(estimateChineseOutputTokenLimit(remaining, 1.25, 128));
}

function createFastDraftLengthMetadata(content, requestedWordCount, lengthPlan) {
  const target = normalizeChineseTargetWordCount(lengthPlan?.target_word_count || requestedWordCount);
  const actual = countNovelWords(content);
  const ratio = target ? actual / target : null;
  const overTarget = target ? actual > target * FAST_DRAFT_OVER_TARGET_RATIO : false;
  return {
    target_word_count: target || null,
    actual_word_count: actual,
    over_target_ratio: ratio == null ? null : Number(ratio.toFixed(4)),
    over_target: overTarget,
    length_warning: overTarget ? "本次草稿偏长，可选择精简。" : "",
    max_chapter_output_tokens: lengthPlan?.enabled ? lengthPlan.max_chapter_output_tokens : null,
  };
}

function estimateChineseOutputTokenLimit(targetWordCount, ratio, buffer) {
  const target = normalizeChineseTargetWordCount(targetWordCount);
  if (!target) return null;
  return Math.ceil(target * ratio + buffer);
}

function clampOutputTokenLimit(value) {
  const limit = normalizeOutputTokenLimit(value);
  if (!limit) return null;
  return Math.min(FAST_DRAFT_MAX_OUTPUT_TOKENS_PER_CALL, Math.max(FAST_DRAFT_MIN_OUTPUT_TOKENS, limit));
}

function normalizeOutputTokenLimit(value) {
  const limit = Math.round(Number(value) || 0);
  return Number.isFinite(limit) && limit > 0 ? limit : null;
}

function normalizeChineseTargetWordCount(value) {
  const target = Math.round(Number(value) || 0);
  return Number.isFinite(target) && target > 0 ? target : 0;
}

function buildSceneWriterInstruction(scene, sceneIndex, totalScenes, previousSceneResults = [], lengthPlan = null) {
  const previousScenes = previousSceneResults
    .map((result, index) => `场景 ${index + 1}：${result.scene.scene_title}\n${createTextPreview(result.content, 500)}`)
    .join("\n\n");
  const fastDraftLines = lengthPlan?.enabled
    ? [
        `快速草稿长度约束：本章目标约 ${lengthPlan.target_word_count} 个中文字，当前场景目标约 ${Number(scene.target_word_count) || 0} 个中文字。`,
        scene.word_budget
          ? `当前场景 word_budget：target=${scene.word_budget.target_word_count}, soft_max=${scene.word_budget.soft_max_word_count}, hard_max=${scene.word_budget.hard_max_word_count}。hard_max 高于 [CHAPTER_END] 和剧情完整性。`
          : "",
        `当前场景不要超过目标字数的 ${Math.round((FAST_DRAFT_PROMPT_OVER_TARGET_RATIO - 1) * 100)}%。`,
        "接近当前场景目标字数时必须收束，不要继续铺陈细节；场景完成后立即单独输出一行 [CHAPTER_END]。",
      ].filter(Boolean)
    : [];
  return [
    `当前场景序号：${sceneIndex + 1}/${totalScenes}。`,
    "请只写当前场景正文，不要重写已完成场景，不要提前写后续场景。",
    ...fastDraftLines,
    "当前场景真正完成后，最后单独输出一行 [CHAPTER_END]。",
    "",
    "【当前场景】",
    JSON.stringify(scene, null, 2),
    "",
    "【已完成场景摘要】",
    previousScenes || "（无）",
  ].join("\n");
}

function buildSceneAdjustmentInstruction(scene, sceneContent, adjustmentType) {
  const contract = createWordCountContract(sceneContent, scene.target_word_count);
  const isExpand = adjustmentType === "expand";
  return [
    isExpand ? "请扩写以下场景正文。" : "请压缩以下场景正文。",
    `修正类型：${adjustmentType}。`,
    `目标字数：${scene.target_word_count}。`,
    `当前字数：${contract.actual_word_count}。`,
    isExpand
      ? "不允许改变剧情，只能增强场景描写、人物动作、心理活动、对话张力和氛围细节。"
      : "不允许删除关键剧情，只能减少重复表达、解释性废话和冗长描写。",
    "修正后最后单独输出一行 [CHAPTER_END]。",
    "",
    "【当前场景】",
    JSON.stringify(scene, null, 2),
    "",
    "【待修正正文】",
    String(sceneContent || "").trim(),
  ].join("\n");
}

function buildChapterCompletionAuditInstruction(chapterContent) {
  return [
    "请判断以下本章正文是否已经写完。",
    "重点检查最后一句是否完整、本章当前场景是否有最小收束、是否像输出被截断。",
    "只输出严格 JSON，不要 Markdown 代码块。",
    "",
    "【待审核正文】",
    String(chapterContent || "").trim(),
  ].join("\n");
}

function buildChapterCompletionRepairInstruction(chapterContent, audit) {
  const normalizedAudit = audit && typeof audit === "object" ? audit : {};
  return [
    "请补完以下未完成章节，让它成为完整章节。",
    "不要从头重写，不要总结，不要解释，只输出修复后的完整章节正文。",
    "",
    "【审核发现】",
    normalizedAudit.issues?.length ? normalizedAudit.issues.join("\n") : normalizedAudit.ending_status || "章节结尾未收束。",
    "",
    "【修复建议】",
    normalizedAudit.suggested_fix || "补完最后动作、对白或收束段落。",
    "",
    "【原始正文】",
    String(chapterContent || "").trim(),
  ].join("\n");
}

function buildContinueChapterInstruction({ chapterContent, requestedWordCount, lengthPlan = null }) {
  const cleanContent = removeChapterEndMarker(chapterContent);
  const actualWordCount = countNovelWords(cleanContent);
  const remainingWordCount = Math.max(0, (Number(requestedWordCount) || 0) - actualWordCount);
  const fastDraftLines = lengthPlan?.enabled
    ? [
        `快速草稿长度约束：本章目标约 ${lengthPlan.target_word_count} 个中文字，不要超过目标字数的 ${Math.round((FAST_DRAFT_PROMPT_OVER_TARGET_RATIO - 1) * 100)}%。`,
        "如果已经接近目标字数，必须用最短必要段落收束并输出 [CHAPTER_END]。",
      ]
    : [];
  return [
    "请从下面正文断点之后继续写，直到本章自然完成。",
    "不要重写前文，不要总结，不要解释。",
    "续写必须保持同一叙事视角、语气、节奏和文风。",
    `剩余目标字数：${remainingWordCount || "未指定，请以完成章节为准"}。`,
    ...fastDraftLines,
    "完成章节后，最后单独输出一行 [CHAPTER_END]。",
    "",
    "【已生成正文末尾】",
    getContinuationExcerpt(cleanContent),
  ].join("\n");
}

function getContinueChapterDecision({ sceneContent, generationEvents = [], scene = {}, lengthPlan = null, continueAttempts = 0 }) {
  if (!shouldContinueChapter(sceneContent, generationEvents)) {
    return { should_continue: false, blocked_by_length: false, blocked_reason: "" };
  }
  if (continueAttempts >= MAX_CONTINUE_CHAPTER_ATTEMPTS) {
    return { should_continue: false, blocked_by_length: false, blocked_reason: "max_continue_attempts_reached" };
  }

  const effectiveTarget = normalizeChineseTargetWordCount(lengthPlan?.target_word_count);
  if (effectiveTarget > 0 && effectiveTarget < 800) {
    return { should_continue: true, blocked_by_length: false, blocked_reason: "" };
  }

  const actual = countNovelWords(removeChapterEndMarker(sceneContent));
  const budget = scene?.word_budget || {};
  const hardMax = normalizeChineseTargetWordCount(budget.hard_max_word_count);
  const softMax = normalizeChineseTargetWordCount(budget.soft_max_word_count);
  if (hardMax && actual >= hardMax) {
    return {
      should_continue: false,
      blocked_by_length: true,
      blocked_reason: "scene_hard_word_limit_reached",
    };
  }
  if (lengthPlan?.hard_max_word_count && actual >= Number(lengthPlan.hard_max_word_count)) {
    return {
      should_continue: false,
      blocked_by_length: true,
      blocked_reason: "chapter_hard_word_limit_reached",
    };
  }
  if (softMax && actual >= softMax && continueAttempts > 0) {
    return {
      should_continue: false,
      blocked_by_length: true,
      blocked_reason: "scene_soft_word_limit_reached_after_short_closure",
    };
  }
  return { should_continue: true, blocked_by_length: false, blocked_reason: "" };
}

function shouldContinueChapter(chapterContent, generationEvents = []) {
  return !hasChapterEndMarker(chapterContent) || isLatestContentGenerationTruncated(generationEvents);
}

function isLatestContentGenerationTruncated(generationEvents = []) {
  const contentEvent = [...(Array.isArray(generationEvents) ? generationEvents : [])]
    .reverse()
    .find((event) => ["writer_prompt", "scene_writer_prompt", "continue_chapter_prompt"].includes(event.prompt_id));
  return contentEvent ? isLlmMetadataTruncated(contentEvent.metadata) : false;
}

function getContinuationExcerpt(content, maxLength = 1200, minLength = 800) {
  const text = String(content || "").trim();
  if (text.length <= maxLength) return text;
  const excerpt = text.slice(-maxLength);
  const paragraphBreak = excerpt.indexOf("\n\n");
  if (paragraphBreak >= 0 && excerpt.length - paragraphBreak >= minLength) {
    return excerpt.slice(paragraphBreak).trim();
  }
  return excerpt.trim();
}

function appendChapterContinuation(existingContent, continuation) {
  const existing = removeChapterEndMarker(existingContent).trimEnd();
  const next = String(continuation || "").trimStart();
  if (!existing) return next.trim();
  if (!next) return existing.trim();
  return `${existing}\n\n${next}`.trim();
}

function getSceneAdjustmentType(sceneContent, targetWordCount) {
  const target = Number(targetWordCount) || 0;
  if (!target) return "none";
  const actual = countNovelWords(sceneContent);
  if (actual < target * 0.85) return "expand";
  if (actual > target * 1.2) return "compress";
  return "none";
}

function createSceneAdjustmentMetadata(adjustmentType, beforeContent, targetWordCount, options = {}) {
  const beforeWordCount = countNovelWords(beforeContent);
  const afterContent = options.afterContent == null ? beforeContent : options.afterContent;
  const afterWordCount = countNovelWords(afterContent);
  const adjustmentTriggered = adjustmentType !== "none";
  const adjustmentAccepted = adjustmentTriggered ? options.adjustmentAccepted === true : false;
  const beforeDistance = getWordCountDistance(beforeContent, targetWordCount);
  const afterDistance = getWordCountDistance(afterContent, targetWordCount);
  const adjustmentEvents = Array.isArray(options.adjustmentEvents) ? options.adjustmentEvents : [];
  const finalAdjustmentEvent = adjustmentEvents
    .filter((event) => ["expand_scene_prompt", "compress_scene_prompt"].includes(event.prompt_id))
    .at(-1);
  return {
    adjustment_type: adjustmentType,
    before_word_count: beforeWordCount,
    after_word_count: afterWordCount,
    target_word_count: Number(targetWordCount) || null,
    adjustment_reason: getSceneAdjustmentReason(adjustmentType, beforeWordCount, targetWordCount),
    adjustment_triggered: adjustmentTriggered,
    adjustment_accepted: adjustmentAccepted,
    adjustment_rejected_reason: String(options.adjustmentRejectedReason || ""),
    before_distance_to_target: beforeDistance,
    after_distance_to_target: afterDistance,
    adjustment_was_truncated: finalAdjustmentEvent ? isLlmMetadataTruncated(finalAdjustmentEvent.metadata) : false,
    adjustment_error: String(options.adjustmentError || ""),
    adjustment_skipped: options.adjustmentSkipped === true,
    adjustment_skipped_reason: String(options.adjustmentSkippedReason || ""),
  };
}

function getWordCountDistance(content, targetWordCount) {
  const target = Number(targetWordCount) || 0;
  if (!target) return null;
  return Math.abs(countNovelWords(content) - target);
}

function getSceneAdjustmentReason(adjustmentType, beforeWordCount, targetWordCount) {
  const target = Number(targetWordCount) || 0;
  if (adjustmentType === "expand") return `${beforeWordCount} < ${Math.round(target * 0.85)}`;
  if (adjustmentType === "compress") return `${beforeWordCount} > ${Math.round(target * 1.2)}`;
  return "";
}

function normalizeSceneOutline(rawSceneOutline, requestedWordCount, chapterLengthPlan = null) {
  const parsed = parseJsonObject(rawSceneOutline);
  const rawScenes = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.scenes) ? parsed.scenes : [];
  if (rawScenes.length === 0) throw new Error("scene_outline_prompt must return at least one scene");
  const maxSceneCount = normalizeChineseTargetWordCount(chapterLengthPlan?.max_scene_count);
  const effectiveTarget = normalizeChineseTargetWordCount(chapterLengthPlan?.effective_target_word_count);
  const shouldCapScenes = effectiveTarget >= 800 && maxSceneCount > 0;
  const cappedScenes = shouldCapScenes ? rawScenes.slice(0, maxSceneCount) : rawScenes;
  const scenes = cappedScenes.map((scene, index) => normalizeScene(scene, index));
  return applySceneWordBudgets(distributeSceneWordCounts(scenes, requestedWordCount), chapterLengthPlan);
}

function applySceneWordBudgets(scenes, chapterLengthPlan) {
  const sourceBudgets = Array.isArray(chapterLengthPlan?.scene_word_budgets) ? chapterLengthPlan.scene_word_budgets : [];
  const budgets = sourceBudgets.length === scenes.length
    ? sourceBudgets
    : createSceneBudgetsForCount(chapterLengthPlan?.effective_target_word_count, scenes.length);
  return scenes.map((scene, index) => {
    const budget = budgets[index] || null;
    if (!budget) return scene;
    return {
      ...scene,
      target_word_count: normalizeChineseTargetWordCount(budget.target_word_count) || scene.target_word_count,
      word_budget: {
        target_word_count: normalizeChineseTargetWordCount(budget.target_word_count) || scene.target_word_count,
        soft_max_word_count: normalizeChineseTargetWordCount(budget.soft_max_word_count) || Math.round(scene.target_word_count * 1.2),
        hard_max_word_count: normalizeChineseTargetWordCount(budget.hard_max_word_count) || Math.round(scene.target_word_count * 1.25),
      },
    };
  });
}

function createSceneBudgetsForCount(targetWordCount, sceneCount) {
  const target = normalizeChineseTargetWordCount(targetWordCount);
  const count = Math.max(1, normalizeChineseTargetWordCount(sceneCount) || 1);
  if (!target) return [];
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

function createSceneOutlineBudgetMetadata(rawSceneOutline) {
  const parsed = parseJsonObject(rawSceneOutline);
  const source = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  return {
    planned_main_plot_nodes: normalizeReportItems(source.covered_main_plot_nodes ?? source.coveredMainPlotNodes),
    planned_relationship_details: normalizeReportItems(source.covered_relationship_details ?? source.coveredRelationshipDetails),
    deferred_plot_points: normalizeReportItems(source.deferred_plot_points ?? source.deferredPlotPoints),
    why_fits_word_budget: String(source.why_fits_word_budget || source.whyFitsWordBudget || "").trim(),
    scene_word_budgets: Array.isArray(source.scene_word_budgets ?? source.sceneWordBudgets) ? (source.scene_word_budgets ?? source.sceneWordBudgets) : [],
    outline_budget_warnings: normalizeReportItems(source.outline_budget_warnings ?? source.outlineBudgetWarnings),
  };
}

function normalizeScene(scene, index) {
  const source = scene && typeof scene === "object" && !Array.isArray(scene) ? scene : {};
  return {
    scene_title: String(source.scene_title || source.sceneTitle || source.title || `场景 ${index + 1}`).trim(),
    scene_goal: String(source.scene_goal || source.sceneGoal || source.goal || "").trim(),
    characters: normalizeSceneCharacters(source.characters),
    conflict: String(source.conflict || "").trim(),
    expected_turning_point: String(source.expected_turning_point || source.expectedTurningPoint || source.turning_point || "").trim(),
    target_word_count: Math.max(1, Math.round(Number(source.target_word_count ?? source.targetWordCount) || 0)),
  };
}

function normalizeSceneCharacters(characters) {
  if (Array.isArray(characters)) {
    return characters.map((character) => String(character || "").trim()).filter(Boolean);
  }
  const text = String(characters || "").trim();
  if (!text) return [];
  return text.split(/[、,，;；]/).map((character) => character.trim()).filter(Boolean);
}

function distributeSceneWordCounts(scenes, requestedWordCount) {
  const total = Math.round(Number(requestedWordCount) || 0);
  if (!total || scenes.length === 0) return scenes;
  const currentTotal = scenes.reduce((sum, scene) => sum + (Number(scene.target_word_count) || 0), 0);
  if (!currentTotal) {
    const base = Math.floor(total / scenes.length);
    let remainder = total - base * scenes.length;
    return scenes.map((scene) => ({
      ...scene,
      target_word_count: base + (remainder-- > 0 ? 1 : 0),
    }));
  }
  let allocatedTotal = 0;
  const allocated = scenes.map((scene, index) => {
    const isLast = index === scenes.length - 1;
    const count = isLast
      ? Math.max(1, total - allocatedTotal)
      : Math.max(1, Math.round((scene.target_word_count / currentTotal) * total));
    allocatedTotal += count;
    return { ...scene, target_word_count: count };
  });
  const diff = total - allocated.reduce((sum, scene) => sum + scene.target_word_count, 0);
  if (diff !== 0) allocated[allocated.length - 1].target_word_count = Math.max(1, allocated.at(-1).target_word_count + diff);
  return allocated;
}

function createSceneMetadata(sceneResults = []) {
  return sceneResults.map((result, index) => {
    const contract = createWordCountContract(result.content, result.scene.target_word_count);
    const contentEvents = (Array.isArray(result.events) ? result.events : []).filter((event) =>
      [
        "scene_writer_prompt",
        "continue_chapter_prompt",
        "expand_scene_prompt",
        "compress_scene_prompt",
        "chapter_completion_repair_prompt",
      ].includes(event.prompt_id),
    );
    const primaryMetadata = normalizeLlmMetadata((contentEvents.at(-1) || { metadata: {} }).metadata);
    const truncationStates = contentEvents.map((event) => isLlmMetadataTruncated(event.metadata));
    const firstTruncatedIndex = truncationStates.findIndex(Boolean);
    const adjustment = result.adjustment || createSceneAdjustmentMetadata("none", result.content, result.scene.target_word_count);
    return {
      scene_index: index + 1,
      scene_title: result.scene.scene_title,
      scene_goal: result.scene.scene_goal,
      characters: result.scene.characters,
      conflict: result.scene.conflict,
      expected_turning_point: result.scene.expected_turning_point,
      word_budget: result.scene.word_budget || null,
      target_word_count: contract.requested_word_count,
      actual_word_count: contract.actual_word_count,
      word_count_ratio: contract.word_count_ratio,
      needs_expansion: contract.needs_expansion,
      needs_compression: contract.needs_compression,
      finish_reason: primaryMetadata.finish_reason || "",
      status: primaryMetadata.status || "",
      was_truncated: isLlmMetadataTruncated(primaryMetadata),
      final_was_truncated: isLlmMetadataTruncated(primaryMetadata),
      ever_truncated: truncationStates.some(Boolean),
      continued_after_truncation:
        firstTruncatedIndex >= 0 &&
        contentEvents.slice(firstTruncatedIndex + 1).some((event) => event.prompt_id === "continue_chapter_prompt"),
      continue_attempts: Number(result.continueAttempts) || 0,
      continue_blocked_by_length: result.continueBlockedByLength === true,
      continue_blocked_reason: String(result.continueBlockedReason || ""),
      adjustment_type: adjustment.adjustment_type,
      before_word_count: adjustment.before_word_count,
      after_word_count: adjustment.after_word_count,
      adjustment_target_word_count: adjustment.target_word_count,
      adjustment_reason: adjustment.adjustment_reason,
      adjustment_triggered: adjustment.adjustment_triggered,
      adjustment_accepted: adjustment.adjustment_accepted,
      adjustment_rejected_reason: adjustment.adjustment_rejected_reason,
      before_distance_to_target: adjustment.before_distance_to_target,
      after_distance_to_target: adjustment.after_distance_to_target,
      adjustment_was_truncated: adjustment.adjustment_was_truncated,
      adjustment_error: adjustment.adjustment_error,
      adjustment_skipped: adjustment.adjustment_skipped,
      adjustment_skipped_reason: adjustment.adjustment_skipped_reason,
      has_scene_end_marker: Boolean(result.hasEndMarker),
      completion_audit: result.completionAudit || null,
      llm_events: result.events || [],
    };
  });
}

async function saveChapterGenerationMetadata(projectManager, projectId, chapterNumber, metadata) {
  if (!projectManager || typeof projectManager.saveProjectReport !== "function") return null;
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+$/, "").replace("T", "_");
  return projectManager.saveProjectReport(
    projectId,
    `generation_metadata_chapter_${String(chapterNumber).padStart(3, "0")}_${stamp}.md`,
    [
      "# Chapter Generation Metadata",
      "",
      "```json",
      JSON.stringify(metadata, null, 2),
      "```",
      "",
    ].join("\n"),
  );
}

function runCostGuardBeforeGeneration({ costGuard, input, writingPathResolution, writingPathPolicy }) {
  if (!costGuard || typeof costGuard.isEnabled !== "function" || costGuard.isEnabled() !== true) {
    return {
      blocked: false,
      blocked_reasons: [],
      budget_report: null,
      metadata: {
        enabled: false,
        bypassed: false,
        estimate: null,
        warnings: [],
      },
    };
  }

  const estimate = costGuard.estimateChapterRun({
    generation_mode: writingPathResolution?.generation_mode || input.generation_mode || input.generationMode || "",
    writing_path: writingPathResolution?.writing_path || input.writing_path || input.writingPath || "",
    target_word_count: input.target_word_count ?? input.targetWordCount ?? 0,
    scene_count: input.scene_count ?? input.sceneCount,
    enabled_reviews: getEnabledReviewStepsForCostGuard(writingPathPolicy),
    enabled_tiers: input.model_routing?.enabled_tiers || input.modelRouting?.enabled_tiers || [],
  });
  const checkedEstimate = costGuard.shouldBlockRun(estimate);
  const budgetReport = costGuard.buildBudgetReport(checkedEstimate);
  const bypassed = typeof costGuard.canBypass === "function" && costGuard.canBypass(input);
  const userConfirmed = input.cost_guard_confirmed === true || input.costGuardConfirmed === true;
  const warnings = Array.isArray(budgetReport.warnings) ? [...budgetReport.warnings] : [];
  if (bypassed) warnings.push("cost guard bypassed in test environment");
  if (checkedEstimate.blocked === true && userConfirmed) warnings.push("cost guard confirmed by user");

  return {
    blocked: checkedEstimate.blocked === true && !bypassed && !userConfirmed,
    blocked_reasons: bypassed || userConfirmed ? [] : checkedEstimate.blocked_reasons || [],
    budget_report: budgetReport,
    metadata: {
      enabled: true,
      bypassed,
      user_confirmed: userConfirmed,
      estimate: budgetReport,
      warnings,
    },
  };
}

function getEnabledReviewStepsForCostGuard(writingPathPolicy) {
  const reviews = [];
  if (writingPathPolicy?.reviews?.quality === true) reviews.push("quality_review");
  if (writingPathPolicy?.reviews?.transition === true) reviews.push("transition_review");
  if (writingPathPolicy?.reviews?.editorial === true) reviews.push("editorial_suggestions");
  return reviews;
}

function createChapterContextPackEstimates({
  context,
  previousSummaries,
  userInstruction,
  chapterNumber,
  title,
  requestedWordCount,
  writingPathResolution,
  sceneOutline,
  chapterContent,
}) {
  const common = {
    project: context,
    memory: context?.memory || {},
    chapterGoal: String(userInstruction || ""),
    chapterTitle: String(title || `第 ${chapterNumber} 章`),
    targetWordCount: requestedWordCount,
    writingPath: writingPathResolution?.writing_path || "",
    generationMode: writingPathResolution?.generation_mode || "",
    sceneOutline,
    previousSummaries,
    chapterContent,
  };
  const packs = [
    buildChapterContextPack({ ...common, step: "planner" }),
    buildChapterContextPack({ ...common, step: "scene_writer", scene: Array.isArray(sceneOutline) ? sceneOutline[0] : null }),
    buildChapterContextPack({ ...common, step: "audit" }),
    buildChapterContextPack({ ...common, step: "reviewer" }),
    buildChapterContextPack({ ...common, step: "summarizer" }),
  ];
  return buildContextPackEstimates(packs);
}

function createSummarizerPromptPlan({
  input,
  variables,
  context,
  previousSummaries,
  chapterOutline,
  chapterContent,
  chapterTitle,
  userInstruction,
  requestedWordCount,
  writingPathResolution,
}) {
  const oldPrompt = renderSummarizerPrompt({
    ...variables,
    outline: chapterOutline,
    user_instruction: ["请总结以下本章正文，供后续写作记忆使用。", "", chapterContent].join("\n"),
  });
  const contextPackEnabled = input.enable_context_pack_for_summary === true || input.enableContextPackForSummary === true;
  if (!contextPackEnabled) {
    return {
      prompt: oldPrompt,
      contextPackEnabled: false,
      inputCharsBefore: getPromptInputCharCount(oldPrompt),
      inputCharsAfter: getPromptInputCharCount(oldPrompt),
      summarizerContextEstimatedTokens: 0,
      summarizerContextOmittedSections: [],
      summarizerMemorySectionsIncluded: [],
    };
  }

  const summarizerPack = buildChapterContextPack({
    project: context,
    memory: context?.memory || {},
    previousSummaries,
    chapterGoal: String(userInstruction || ""),
    chapterTitle,
    targetWordCount: requestedWordCount,
    writingPath: writingPathResolution?.writing_path || "",
    generationMode: writingPathResolution?.generation_mode || "",
    step: "summarizer",
    chapterContent,
  });
  const contextPayload = {
    summarizer_context: summarizerPack.content,
  };
  const newPrompt = renderSummarizerPrompt({
    outline: "",
    characters: "",
    world: "",
    style: "",
    goals: "",
    writing_skills: "",
    memory: "",
    previous_summaries: [],
    user_instruction: [
      "请基于以下 summarizer_context 总结本章正文，供后续写作记忆使用。",
      "只使用 summarizer_context 中的信息，不要假设未提供的完整 memory 或项目资料。",
      "",
      JSON.stringify(contextPayload, null, 2),
    ].join("\n"),
  });
  return {
    prompt: newPrompt,
    contextPackEnabled: true,
    inputCharsBefore: getPromptInputCharCount(oldPrompt),
    inputCharsAfter: getPromptInputCharCount(newPrompt),
    summarizerContextEstimatedTokens: summarizerPack.estimated_tokens,
    summarizerContextOmittedSections: summarizerPack.omitted_sections,
    summarizerMemorySectionsIncluded: summarizerPack.relevant_memory_pack?.sections_included || [],
  };
}

function createAuditPromptPlan({
  oldPrompt,
  chapterContent,
  context,
  sceneOutline,
  chapterTitle,
  userInstruction,
  requestedWordCount,
  previousTail,
}) {
  const auditPack = buildChapterContextPack({
    project: context,
    memory: context?.memory || {},
    chapterGoal: String(userInstruction || ""),
    chapterTitle,
    targetWordCount: requestedWordCount,
    step: "audit",
    sceneOutline,
    chapterContent,
    previousTail,
  });
  const prompt = renderChapterCompletionAuditPrompt({
    outline: "",
    characters: "",
    world: "",
    style: "",
    goals: "",
    writing_skills: "",
    memory: "",
    previous_summaries: [],
    user_instruction: [
      "请基于以下 audit_context 审核正文是否完整收束。",
      "只使用 audit_context 中的信息，不要假设未提供的完整 memory 或项目资料。",
      "",
      JSON.stringify({ audit_context: auditPack.content }, null, 2),
    ].join("\n"),
  });
  return {
    prompt,
    inputCharsBefore: getPromptInputCharCount(oldPrompt),
    inputCharsAfter: getPromptInputCharCount(prompt),
    estimatedTokens: auditPack.estimated_tokens,
    omittedSections: auditPack.omitted_sections,
  };
}

function getPromptInputCharCount(prompt) {
  return String(prompt?.user || "").length + String(prompt?.system || "").length;
}

function getAuditContextFallbackReason(rawAudit) {
  const raw = String(rawAudit || "").trim();
  if (!raw) return "empty_response";
  const parsed = parseJsonObject(raw);
  if (!parsed) return "json_parse_failed";
  const hasBooleanComplete = typeof parsed.is_complete === "boolean" || typeof parsed.isComplete === "boolean";
  const endingStatus = parsed.ending_status ?? parsed.endingStatus;
  const suggestedFix = parsed.suggested_fix ?? parsed.suggestedFix;
  if (!hasBooleanComplete) return "missing_required_fields";
  if (typeof endingStatus !== "string") return "missing_required_fields";
  if (!Array.isArray(parsed.issues)) return "missing_required_fields";
  if (typeof suggestedFix !== "string") return "missing_required_fields";
  const isComplete = parsed.is_complete === true || parsed.isComplete === true;
  if (!isComplete && parsed.issues.length === 0 && suggestedFix.trim() === "") return "invalid_audit_shape";
  return "";
}

function recordAuditContextEvent(generationEvents, event) {
  if (!generationEvents) return;
  if (!Array.isArray(generationEvents.auditContextEvents)) generationEvents.auditContextEvents = [];
  generationEvents.auditContextEvents.push({
    audit_scope: String(event.auditScope || "chapter"),
    input_chars_before: Number(event.inputCharsBefore) || 0,
    input_chars_after: Number(event.inputCharsAfter) || 0,
    audit_context_estimated_tokens: Number(event.estimatedTokens) || 0,
    audit_context_omitted_sections: Array.isArray(event.omittedSections) ? event.omittedSections : [],
    fallback_triggered: event.fallbackTriggered === true,
    fallback_reason: String(event.fallbackReason || ""),
  });
}

function createAuditContextMetadata(generationEvents) {
  const events = Array.isArray(generationEvents?.auditContextEvents) ? generationEvents.auditContextEvents : [];
  const first = events[0] || {};
  return {
    context_pack_audit_enabled: events.length > 0,
    audit_prompt_input_chars_before: Number(first.input_chars_before) || 0,
    audit_prompt_input_chars_after: Number(first.input_chars_after) || 0,
    audit_context_estimated_tokens: Number(first.audit_context_estimated_tokens) || 0,
    audit_context_omitted_sections: Array.isArray(first.audit_context_omitted_sections) ? first.audit_context_omitted_sections : [],
    audit_context_fallback_triggered: events.some((event) => event.fallback_triggered === true),
    audit_context_fallback_reason: String(events.find((event) => event.fallback_reason)?.fallback_reason || ""),
    audit_context_events: events,
  };
}

function createChapterGenerationMetadata({
  projectId,
  chapterId,
  chapterNumber,
  requestedWordCount,
  content,
  chapterContentBeforeAdjustments,
  hasChapterEndMarker,
  completionAudit,
  completionWarning,
  chapterRepairAttempts,
  completionRepairLimitReached,
  generationEvents,
  sceneMetadata,
  qualityReview,
  transitionReview,
  editorialSuggestions,
  contextPackEstimates,
  writingPath,
  executionPlan,
  writingPathPolicy,
  lengthPlan,
  writingGoalContract,
  chapterLengthPlan,
  sceneOutlineBudget,
}) {
  const events = Array.isArray(generationEvents) ? generationEvents : [];
  const contentEvents = events.filter((event) =>
    ["writer_prompt", "scene_writer_prompt", "continue_chapter_prompt", "chapter_completion_repair_prompt"].includes(event.prompt_id),
  );
  const primaryEvent = contentEvents.at(-1) || events.at(-1) || { metadata: {} };
  const primaryMetadata = normalizeLlmMetadata(primaryEvent.metadata);
  const wordCountContract = createWordCountContract(content, requestedWordCount);
  const fastDraftLength = createFastDraftLengthMetadata(content, requestedWordCount, lengthPlan);
  const chapterAdjustmentContract = createChapterAdjustmentContract(chapterContentBeforeAdjustments, content, requestedWordCount);
  const auditContextMetadata = createAuditContextMetadata(generationEvents);
  const sceneItems = Array.isArray(sceneMetadata) ? sceneMetadata : [];
  const lengthBlockedScene = sceneItems.find((scene) => scene?.continue_blocked_by_length === true);
  return {
    project_id: String(projectId || ""),
    chapter_id: String(chapterId || ""),
    chapter_number: Number(chapterNumber) || null,
    writing_path: String(writingPath?.writing_path || "polished_chapter"),
    generation_mode: String(writingPath?.generation_mode || ""),
    execution_plan: normalizeExecutionPlanForMetadata(executionPlan),
    path_policy: normalizeWritingPathPolicyForMetadata(writingPathPolicy),
    writing_goal_contract: writingGoalContract || null,
    writing_goal_contract_source: String(writingGoalContract?.source || ""),
    project_target_word_count_range: writingGoalContract?.project_target_word_count_range || null,
    effective_target_word_count: Number(writingGoalContract?.effective_target_word_count) || null,
    chapter_length_plan: chapterLengthPlan || null,
    planned_main_plot_nodes: Array.isArray(sceneOutlineBudget?.planned_main_plot_nodes) ? sceneOutlineBudget.planned_main_plot_nodes : [],
    planned_relationship_details: Array.isArray(sceneOutlineBudget?.planned_relationship_details) ? sceneOutlineBudget.planned_relationship_details : [],
    deferred_plot_points: Array.isArray(sceneOutlineBudget?.deferred_plot_points) ? sceneOutlineBudget.deferred_plot_points : [],
    outline_budget_warnings: [
      ...(Array.isArray(writingGoalContract?.warnings) ? writingGoalContract.warnings : []),
      ...(Array.isArray(sceneOutlineBudget?.outline_budget_warnings) ? sceneOutlineBudget.outline_budget_warnings : []),
    ],
    scene_word_budgets: sceneItems
      .map((scene) => scene?.word_budget)
      .filter(Boolean),
    length_priority: String(chapterLengthPlan?.length_priority || ""),
    continue_blocked_by_length: Boolean(lengthBlockedScene),
    continue_blocked_reason: String(lengthBlockedScene?.continue_blocked_reason || ""),
    standard_mode_limited_repair: writingPathPolicy?.path_id === "standard_chapter",
    standard_mode_limited_adjustment: writingPathPolicy?.path_id === "standard_chapter",
    completion_warning: String(completionWarning || ""),
    completion_repair_attempts: Number(chapterRepairAttempts) || 0,
    completion_repair_limit_reached: completionRepairLimitReached === true,
    memory_summary_cleaned: false,
    memory_summary_clean_reason: "",
    memory_summary_clean_warning: "",
    context_pack_estimates: contextPackEstimates || null,
    context_pack_summary_enabled: false,
    summarizer_prompt_input_chars_before: 0,
    summarizer_prompt_input_chars_after: 0,
    summarizer_context_estimated_tokens: 0,
    summarizer_context_omitted_sections: [],
    summarizer_memory_sections_included: [],
    context_pack_audit_enabled: auditContextMetadata.context_pack_audit_enabled,
    audit_prompt_input_chars_before: auditContextMetadata.audit_prompt_input_chars_before,
    audit_prompt_input_chars_after: auditContextMetadata.audit_prompt_input_chars_after,
    audit_context_estimated_tokens: auditContextMetadata.audit_context_estimated_tokens,
    audit_context_omitted_sections: auditContextMetadata.audit_context_omitted_sections,
    audit_context_fallback_triggered: auditContextMetadata.audit_context_fallback_triggered,
    audit_context_fallback_reason: auditContextMetadata.audit_context_fallback_reason,
    audit_context_events: auditContextMetadata.audit_context_events,
    cost_guard_enabled: generationEvents.costGuard?.enabled === true,
    cost_guard_bypassed: generationEvents.costGuard?.bypassed === true,
    cost_guard_confirmed: generationEvents.costGuard?.user_confirmed === true,
    cost_guard_estimate: generationEvents.costGuard?.estimate || null,
    cost_guard_warnings: Array.isArray(generationEvents.costGuard?.warnings) ? generationEvents.costGuard.warnings : [],
    model_policy: normalizeModelPolicyForMetadata(generationEvents.modelPolicy),
    model_tier_usage: createModelTierUsage(events),
    actual_model_sent_usage: createActualModelSentUsage(events),
    model_routing_warnings: createModelRoutingWarnings(events),
    writing_path_warning: String(writingPath?.warning || ""),
    skipped_steps: createSkippedStepsMetadata({ sceneMetadata, qualityReview, transitionReview, editorialSuggestions }),
    requested_word_count: wordCountContract.requested_word_count,
    target_word_count: fastDraftLength.target_word_count,
    actual_word_count: wordCountContract.actual_word_count,
    word_count_ratio: wordCountContract.word_count_ratio,
    over_target_ratio: fastDraftLength.over_target_ratio,
    over_target: fastDraftLength.over_target,
    length_warning: fastDraftLength.length_warning,
    max_chapter_output_tokens: fastDraftLength.max_chapter_output_tokens,
    needs_expansion: wordCountContract.needs_expansion,
    needs_compression: wordCountContract.needs_compression,
    chapter_word_count_before_adjustments: chapterAdjustmentContract.chapter_word_count_before_adjustments,
    chapter_word_count_after_adjustments: chapterAdjustmentContract.chapter_word_count_after_adjustments,
    chapter_target_word_count: chapterAdjustmentContract.chapter_target_word_count,
    chapter_distance_before_adjustments: chapterAdjustmentContract.chapter_distance_before_adjustments,
    chapter_distance_after_adjustments: chapterAdjustmentContract.chapter_distance_after_adjustments,
    chapter_adjustments_improved_total: chapterAdjustmentContract.chapter_adjustments_improved_total,
    finish_reason: primaryMetadata.finish_reason || "",
    status: primaryMetadata.status || "",
    incomplete_details: primaryMetadata.incomplete_details,
    was_truncated: isLlmMetadataTruncated(primaryMetadata),
    has_chapter_end_marker: Boolean(hasChapterEndMarker),
    retry_count: events.filter((event) => ["continue_chapter_prompt", "chapter_completion_repair_prompt"].includes(event.prompt_id)).length,
    completion_audit: completionAudit || null,
    audit_fallback_triggered: completionAudit?.audit_fallback_triggered === true,
    audit_fallback_reason: String(completionAudit?.audit_fallback_reason || ""),
    audit_fallback_prompt_id: String(completionAudit?.audit_fallback_prompt_id || ""),
    audit_fallback_used_default_model: completionAudit?.audit_fallback_used_default_model === true,
    quality_review_status: normalizeQualityReviewStatus(qualityReview?.status),
    quality_review_file: String(qualityReview?.fileName || ""),
    quality_review_error: String(qualityReview?.error || ""),
    quality_review_warning: String(qualityReview?.warning || ""),
    quality_review_craft_rule_ids: getCraftRuleIds(qualityReview?.craftRuleIds),
    transition_review_status: normalizeTransitionReviewStatus(transitionReview?.status),
    transition_review_file: String(transitionReview?.fileName || ""),
    transition_review_error: String(transitionReview?.error || ""),
    transition_review_warning: String(transitionReview?.warning || ""),
    transition_review_craft_rule_ids: getCraftRuleIds(transitionReview?.craftRuleIds),
    editorial_suggestions_status: normalizeEditorialSuggestionsStatus(editorialSuggestions?.status),
    editorial_suggestions_file: String(editorialSuggestions?.fileName || ""),
    editorial_suggestions_error: String(editorialSuggestions?.error || ""),
    scene_metadata: Array.isArray(sceneMetadata) ? sceneMetadata : [],
    llm_events: events,
  };
}

function createChapterFailureMetadata({
  projectId,
  chapterId,
  chapterNumber,
  input,
  error,
  failedStep,
  generationEvents,
  steps,
  writingPathResolution,
  executionPlan,
  writingPathPolicy,
}) {
  const events = Array.isArray(generationEvents) ? generationEvents : [];
  return {
    project_id: String(projectId || ""),
    chapter_id: String(chapterId || ""),
    chapter_number: Number(chapterNumber) || null,
    failed: true,
    error: String(error?.message || error || ""),
    failed_step: String(failedStep || ""),
    failed_prompt_id: String(error?.prompt_id || ""),
    requested_generation_mode: String(input?.generation_mode ?? input?.generationMode ?? ""),
    requested_writing_path: String(input?.writing_path ?? input?.writingPath ?? ""),
    writing_path: String(writingPathResolution?.writing_path || ""),
    generation_mode: String(writingPathResolution?.generation_mode || ""),
    execution_plan: normalizeExecutionPlanForMetadata(executionPlan),
    path_policy: normalizeWritingPathPolicyForMetadata(writingPathPolicy),
    llm_events: events,
    completed_llm_calls_before_failure: events.length,
    cost_guard_enabled: generationEvents?.costGuard?.enabled === true,
    cost_guard_bypassed: generationEvents?.costGuard?.bypassed === true,
    cost_guard_confirmed: generationEvents?.costGuard?.user_confirmed === true,
    cost_guard_estimate: generationEvents?.costGuard?.estimate || null,
    cost_guard_warnings: Array.isArray(generationEvents?.costGuard?.warnings) ? generationEvents.costGuard.warnings : [],
    model_policy: normalizeModelPolicyForMetadata(generationEvents?.modelPolicy),
    model_routing_context: normalizeModelRoutingContextForFailure(generationEvents?.modelRoutingContext),
    model_tier_usage: createModelTierUsage(events),
    actual_model_sent_usage: createActualModelSentUsage(events),
    model_routing_warnings: createModelRoutingWarnings(events),
    steps: Array.isArray(steps) ? steps : [],
  };
}

function normalizeModelRoutingContextForFailure(context) {
  const source = context && typeof context === "object" && !Array.isArray(context) ? context : {};
  return {
    writing_path: String(source.writing_path || ""),
    generation_mode: String(source.generation_mode || ""),
    enable_model_routing: source.enable_model_routing === true,
  };
}

function normalizeExecutionPlanForMetadata(plan) {
  const source = plan && typeof plan === "object" && !Array.isArray(plan) ? plan : {};
  return {
    path_id: String(source.path_id || ""),
    label: String(source.label || ""),
    cost_level: String(source.cost_level || ""),
    context_level: String(source.context_level || ""),
    word_count_strictness: String(source.word_count_strictness || ""),
    reviewer_level: String(source.reviewer_level || ""),
    steps: (Array.isArray(source.steps) ? source.steps : []).map((step) => ({
      id: String(step?.id || ""),
      prompt_id: String(step?.prompt_id || ""),
      stage: String(step?.stage || ""),
      required: Boolean(step?.required),
      model_tier: String(step?.model_tier || ""),
    })).filter((step) => step.id || step.prompt_id),
  };
}

function normalizeWritingPathPolicyForMetadata(policy) {
  const source = policy && typeof policy === "object" && !Array.isArray(policy) ? policy : {};
  return {
    path_id: String(source.path_id || "polished_chapter"),
    adjustment_enabled: source.adjustment?.enabled === true,
    adjustment_severe_only: source.adjustment?.severe_only === true,
    scene_audit_enabled: source.completion?.scene_audit_enabled === true,
    scene_repair_enabled: source.completion?.scene_repair_enabled === true,
    chapter_audit_enabled: source.completion?.chapter_audit_enabled !== false,
    max_chapter_repairs: Number(source.completion?.max_chapter_repairs) || 0,
    save_incomplete_with_warning: source.completion?.save_incomplete_with_warning === true,
    quality_review_enabled: source.reviews?.quality === true,
    transition_review_enabled: source.reviews?.transition === true,
    editorial_suggestions_enabled: source.reviews?.editorial === true,
  };
}

function normalizeModelPolicyForMetadata(policy) {
  const source = policy && typeof policy === "object" && !Array.isArray(policy) ? policy : {};
  return {
    policy_id: String(source.policy_id || "default"),
    version: Number(source.version) || 1,
    routing_enabled: source.routing_enabled === true,
    enabled_tiers: normalizeModelTierListForMetadata(source.enabled_tiers),
  };
}

function createModelTierUsage(events) {
  const usage = { cheap: 0, mid: 0, writing: 0, review: 0, summary: 0 };
  for (const event of Array.isArray(events) ? events : []) {
    const tier = String(event?.model_tier || "").trim();
    if (Object.prototype.hasOwnProperty.call(usage, tier)) usage[tier] += 1;
  }
  return usage;
}

function createActualModelSentUsage(events) {
  const usage = {};
  for (const event of Array.isArray(events) ? events : []) {
    const model = String(event?.actual_model_sent || "").trim() || "__default_client_model__";
    usage[model] = (usage[model] || 0) + 1;
  }
  return usage;
}

function createModelRoutingWarnings(events) {
  const warnings = [];
  for (const event of Array.isArray(events) ? events : []) {
    const warning = String(event?.model_routing_warning || "").trim();
    if (!warning || warning === "model routing disabled") continue;
    warnings.push(`${String(event?.prompt_id || "unknown_prompt")}: ${warning}`);
  }
  return [...new Set(warnings)];
}

function normalizeModelTierListForMetadata(tiers) {
  const allowed = new Set(["cheap", "mid", "writing", "review", "summary"]);
  return (Array.isArray(tiers) ? tiers : [])
    .map((tier) => String(tier || "").trim())
    .filter((tier, index, array) => allowed.has(tier) && array.indexOf(tier) === index);
}

function createSkippedStepsMetadata({ sceneMetadata, qualityReview, transitionReview, editorialSuggestions }) {
  const skipped = [];
  const sceneItems = Array.isArray(sceneMetadata) ? sceneMetadata : [];
  if (sceneItems.some((scene) => scene?.adjustment_skipped === true)) {
    skipped.push({
      step: "expand_compress",
      status: "skipped",
      reason: String(sceneItems.find((scene) => scene?.adjustment_skipped_reason)?.adjustment_skipped_reason || ""),
    });
  }
  if (sceneItems.some((scene) => scene?.completion_audit?.skipped === true)) {
    skipped.push({
      step: "scene_completion_audit",
      status: "skipped",
      reason: String(sceneItems.find((scene) => scene?.completion_audit?.skipped_reason)?.completion_audit?.skipped_reason || ""),
    });
  }
  if (sceneItems.some((scene) => scene?.completion_audit?.repair_skipped === true)) {
    skipped.push({
      step: "scene_completion_repair",
      status: "skipped",
      reason: String(sceneItems.find((scene) => scene?.completion_audit?.repair_skipped_reason)?.completion_audit?.repair_skipped_reason || ""),
    });
  }
  if (qualityReview?.status === "skipped") {
    skipped.push({ step: "quality_review", status: "skipped", reason: String(qualityReview.warning || "") });
  }
  if (transitionReview?.status === "skipped") {
    skipped.push({ step: "transition_review", status: "skipped", reason: String(transitionReview.warning || "") });
  }
  if (editorialSuggestions?.status === "skipped") {
    skipped.push({ step: "editorial_suggestions", status: "skipped", reason: String(editorialSuggestions.warning || "") });
  }
  return skipped;
}

function createPathDisabledReason(stepName, pathId) {
  return `${stepName} disabled by writing_path ${String(pathId || "polished_chapter")}`;
}

function createSkippedQualityReview(warning = "") {
  return {
    status: "skipped",
    fileName: "",
    report: null,
    error: "",
    warning: String(warning || ""),
    craftRuleIds: [],
  };
}

function normalizeQualityReviewStatus(status) {
  const value = String(status || "").trim();
  return ["skipped", "completed", "soft_failed"].includes(value) ? value : "skipped";
}

function createSkippedTransitionReview(warning = "") {
  return {
    status: "skipped",
    fileName: "",
    report: null,
    error: "",
    warning: String(warning || ""),
    craftRuleIds: [],
  };
}

function normalizeTransitionReviewStatus(status) {
  const value = String(status || "").trim();
  return ["skipped", "completed", "soft_failed"].includes(value) ? value : "skipped";
}

function createSkippedEditorialSuggestions(warning = "") {
  return {
    status: "skipped",
    fileName: "",
    report: null,
    error: "",
    warning: String(warning || ""),
  };
}

function normalizeEditorialSuggestionsStatus(status) {
  const value = String(status || "").trim();
  return ["skipped", "completed", "soft_failed"].includes(value) ? value : "skipped";
}

function normalizeLlmMetadata(metadata) {
  const source = metadata && typeof metadata === "object" && !Array.isArray(metadata) ? metadata : {};
  return {
    provider: String(source.provider || ""),
    model: String(source.model || ""),
    max_tokens: Number(source.max_tokens) || null,
    max_output_tokens: Number(source.max_output_tokens) || null,
    finish_reason: String(source.finish_reason || ""),
    status: String(source.status || ""),
    incomplete_details: source.incomplete_details && typeof source.incomplete_details === "object" ? source.incomplete_details : null,
    was_truncated: source.was_truncated === true || source.wasTruncated === true,
    output_token_usage: Number(source.output_token_usage) || null,
    input_token_usage: Number(source.input_token_usage) || null,
  };
}

function isLlmMetadataTruncated(metadata) {
  const source = normalizeLlmMetadata(metadata);
  if (source.was_truncated || source.incomplete_details) return true;
  const reason = `${source.finish_reason} ${source.status} ${source.incomplete_details?.reason || ""}`.toLowerCase();
  return /\b(length|max_tokens|max_output_tokens|incomplete)\b/.test(reason);
}

function hasChapterEndMarker(content) {
  return String(content || "").includes(CHAPTER_END_MARKER);
}

function removeChapterEndMarker(content) {
  return String(content || "").replaceAll(CHAPTER_END_MARKER, "").trim();
}

function getRequestedWordCount(input = {}, context = {}) {
  const direct = input.word_count ?? input.wordCount ?? input.word_goal ?? input.wordGoal ?? input.target_word_count ?? input.targetWordCount;
  const directNumber = Number(direct);
  if (Number.isFinite(directNumber) && directNumber > 0) return Math.round(directNumber);
  const goals = String(context?.materials?.goals || "");
  const match = goals.match(/每章\s*(?:目标)?\s*(\d{3,5})\s*[字詞词]/);
  return match ? Number(match[1]) : null;
}

function createWordCountContract(content, requestedWordCount) {
  const requested = Number(requestedWordCount) || null;
  const actual = countNovelWords(content);
  const ratio = requested ? actual / requested : null;
  return {
    requested_word_count: requested,
    actual_word_count: actual,
    word_count_ratio: ratio == null ? null : Number(ratio.toFixed(4)),
    needs_expansion: requested ? actual < requested * 0.85 : false,
    needs_compression: requested ? actual > requested * 1.2 : false,
  };
}

function createChapterAdjustmentContract(beforeContent, afterContent, targetWordCount) {
  const target = Number(targetWordCount) || null;
  const before = countNovelWords(beforeContent);
  const after = countNovelWords(afterContent);
  const beforeDistance = target ? Math.abs(before - target) : null;
  const afterDistance = target ? Math.abs(after - target) : null;
  return {
    chapter_word_count_before_adjustments: before,
    chapter_word_count_after_adjustments: after,
    chapter_target_word_count: target,
    chapter_distance_before_adjustments: beforeDistance,
    chapter_distance_after_adjustments: afterDistance,
    chapter_adjustments_improved_total: target ? afterDistance < beforeDistance : false,
  };
}

function countNovelWords(text) {
  const source = String(text || "").trim();
  if (!source) return 0;
  const latinWords = source.match(/[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*/g) || [];
  const cjkChars = source.match(/[\u3400-\u9fff\uf900-\ufaff]/g) || [];
  return latinWords.length + cjkChars.length;
}

const PROJECT_MATERIAL_SECTION_ALIASES = {
  outline: ["outline", "项目大纲", "故事大纲", "大纲"],
  characters: ["characters", "character", "角色设定", "人物设定", "人物资料", "角色", "人物"],
  world: ["world", "worldbuilding", "世界观", "世界设定"],
  style: ["style", "风格偏好", "叙事风格", "文风", "风格"],
  goals: ["goals", "goal", "写作目标", "写作规格", "目标", "篇幅", "规格"],
};

function normalizeProjectMaterialTypes(value) {
  const keys = Object.keys(PROJECT_MATERIAL_SECTION_ALIASES);
  const selected = Array.isArray(value)
    ? [...new Set(value.map((item) => String(item)).filter((item) => keys.includes(item)))]
    : [];
  return selected.length > 0 ? selected : keys;
}

function normalizeProjectMaterialsDraft(rawMaterials, materialTypes = null) {
  const selectedTypes = normalizeProjectMaterialTypes(materialTypes);
  const parsed = parseJsonObject(rawMaterials);
  const source =
    parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed)
        ? parseProjectMaterialsArray(parsed)
        : parseProjectMaterialsMarkdown(rawMaterials);

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    throw new Error("project_materials_prompt must return JSON or Markdown sections");
  }
  const materials = normalizeProjectMaterialFields(source, selectedTypes);
  const missing = Object.entries(materials)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length > 0) {
    throw new Error(`project_materials_prompt missing fields: ${missing.join(", ")}`);
  }
  return materials;
}

function normalizeProjectMaterialFields(source, materialTypes = null) {
  const object = source && typeof source === "object" && !Array.isArray(source) ? source : {};
  const nested = object.materials && typeof object.materials === "object" && !Array.isArray(object.materials) ? object.materials : null;
  const target = nested || object;
  const selectedTypes = normalizeProjectMaterialTypes(materialTypes);
  return Object.fromEntries(
    selectedTypes.map((key) => [key, getProjectMaterialValue(target, key)]),
  );
}

function parseProjectMaterialsArray(items) {
  const sections = {};
  for (const item of items) {
    if (typeof item === "string") {
      Object.assign(sections, parseProjectMaterialsMarkdown(item));
      continue;
    }
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const key = getProjectMaterialKeyFromHeading(item.key || item.name || item.title || item.type || item.section || item.material || "");
    const value = item.value ?? item.content ?? item.text ?? item.body ?? item.markdown ?? "";
    if (key && value) sections[key] = String(value).trim();
  }
  return sections;
}

function getProjectMaterialValue(source, key) {
  if (source[key] != null) return String(source[key]).trim();
  const aliases = PROJECT_MATERIAL_SECTION_ALIASES[key] || [];
  const entry = Object.entries(source).find(([sourceKey]) =>
    aliases.some((alias) => normalizeProjectMaterialsHeading(sourceKey).includes(normalizeProjectMaterialsHeading(alias))),
  );
  return entry ? String(entry[1] ?? "").trim() : "";
}

function parseProjectMaterialsMarkdown(text) {
  const sections = {};
  let currentKey = "";
  for (const line of String(text || "").split(/\r?\n/)) {
    const headingLine = parseProjectMaterialsHeadingLine(line);
    if (headingLine.heading) {
      const nextKey = getProjectMaterialKeyFromHeading(headingLine.heading);
      if (nextKey) {
        currentKey = nextKey;
        sections[currentKey] ||= [];
        if (headingLine.content) sections[currentKey].push(headingLine.content);
        continue;
      }
    }
    if (currentKey) sections[currentKey].push(line);
  }

  const parsedSections = Object.fromEntries(
    Object.entries(sections).map(([key, value]) => [key, value.join("\n").trim()]),
  );
  const labeledSections = parseProjectMaterialsLabeledText(text);
  return {
    ...Object.fromEntries(Object.entries(parsedSections).filter(([, value]) => value)),
    ...labeledSections,
  };
}

function parseProjectMaterialsLabeledText(text) {
  const source = String(text || "").trim();
  if (!source) return {};
  const labels = [];
  for (const [key, aliases] of Object.entries(PROJECT_MATERIAL_SECTION_ALIASES)) {
    for (const alias of aliases) {
      const escaped = escapeRegExp(alias);
      const pattern = new RegExp(`(?:^|\\n|[\\s。；;，,])(?:[-*+]|\\d+[.)、．]|[一二三四五六七八九十]+[、．.])?\\s*(?:\\*\\*)?${escaped}(?:\\*\\*)?\\s*[：:]`, "gi");
      let match;
      while ((match = pattern.exec(source))) {
        labels.push({ key, start: match.index, contentStart: pattern.lastIndex });
      }
    }
  }
  labels.sort((a, b) => a.start - b.start);
  const uniqueLabels = labels.filter((label, index) => index === 0 || label.start !== labels[index - 1].start);
  const sections = {};
  uniqueLabels.forEach((label, index) => {
    const next = uniqueLabels[index + 1];
    const content = source.slice(label.contentStart, next ? next.start : source.length).trim();
    if (content && !sections[label.key]) sections[label.key] = content;
  });
  return sections;
}

function parseProjectMaterialsHeadingLine(line) {
  const source = String(line || "").trim();
  if (!source) return { heading: "", content: "" };

  const normalized = source
    .replace(/^\s{0,3}#{1,4}\s+/, "")
    .replace(/^\s*(?:[-*+]|\d+[.)、．]|[一二三四五六七八九十]+[、．.])\s*/, "")
    .replace(/^\*\*(.+?)\*\*\s*/, "$1 ");

  const headingOnly = normalized.match(
    /^(outline|characters?|world(?:building)?|style|goals?|项目大纲|故事大纲|大纲|角色设定|人物设定|人物资料|角色|人物|世界观|世界设定|风格偏好|叙事风格|文风|写作目标|写作规格|目标章节|章字数|目标字数|目标|篇幅|规格)\s*$/i,
  );
  if (headingOnly) return { heading: headingOnly[1], content: "" };

  const headingWithContent = normalized.match(
    /^(outline|characters?|world(?:building)?|style|goals?|项目大纲|故事大纲|大纲|角色设定|人物设定|人物资料|角色|人物|世界观|世界设定|风格偏好|叙事风格|文风|写作目标|写作规格|目标章节|章字数|目标字数|目标|篇幅|规格)\s*[：:]\s*(.*)$/i,
  );
  if (headingWithContent) {
    return {
      heading: headingWithContent[1],
      content: headingWithContent[2].trim(),
    };
  }

  return { heading: "", content: "" };
}

function getProjectMaterialKeyFromHeading(heading) {
  const normalized = normalizeProjectMaterialsHeading(heading);
  for (const [key, aliases] of Object.entries(PROJECT_MATERIAL_SECTION_ALIASES)) {
    if (aliases.some((alias) => normalized.includes(normalizeProjectMaterialsHeading(alias)))) {
      return key;
    }
  }
  return "";
}

function normalizeProjectMaterialsHeading(heading) {
  return String(heading || "")
    .toLowerCase()
    .replace(/^#+\s*/, "")
    .replace(/\*\*/g, "")
    .replace(/[：:]/g, "")
    .trim();
}

function normalizeConsistencyReport(rawReport) {
  const parsed = parseJsonObject(rawReport);
  const source = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  const report = Object.fromEntries(CONSISTENCY_REPORT_KEYS.map((key) => [key, normalizeReportItems(source[key])]));
  if (!parsed) {
    report.unresolved_questions = [
      ...report.unresolved_questions,
      "LLM 未返回可解析 JSON；请查看 raw_report。",
    ];
  }
  return report;
}

function normalizeQualityReviewReport(rawReport) {
  const parsed = parseJsonObject(rawReport);
  const source = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  const report = {
    quality_score: normalizeQualityScore(source.quality_score ?? source.qualityScore),
    scene_level_feedback: normalizeReportItems(source.scene_level_feedback ?? source.sceneLevelFeedback),
    issues: normalizeReportItems(source.issues),
    suggested_fixes: normalizeReportItems(source.suggested_fixes ?? source.suggestedFixes),
    strengths: normalizeReportItems(source.strengths),
    overall_feedback: String(source.overall_feedback || source.overallFeedback || "").trim(),
  };
  if (!parsed) {
    report.issues = [...report.issues, "LLM 未返回可解析 JSON；请查看 raw_report。"];
    report.overall_feedback = report.overall_feedback || "质量审查结果不可解析。";
  }
  return report;
}

function normalizeTransitionReviewReport(rawReport) {
  const parsed = parseJsonObject(rawReport);
  const source = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  const report = {
    transition_score: normalizeQualityScore(source.transition_score ?? source.transitionScore),
    scene_pair_feedback: normalizeReportItems(source.scene_pair_feedback ?? source.scenePairFeedback),
    transition_issues: normalizeReportItems(source.transition_issues ?? source.transitionIssues),
    suggested_bridge_sentences: normalizeReportItems(source.suggested_bridge_sentences ?? source.suggestedBridgeSentences),
    pacing_notes: normalizeReportItems(source.pacing_notes ?? source.pacingNotes),
    overall_feedback: String(source.overall_feedback || source.overallFeedback || "").trim(),
  };
  if (!parsed) {
    report.transition_issues = [...report.transition_issues, "LLM 未返回可解析 JSON；请查看 raw_report。"];
    report.overall_feedback = report.overall_feedback || "场景衔接审查结果不可解析。";
  }
  return report;
}

function normalizeEditorialSuggestionsReport(rawReport) {
  const parsed = parseJsonObject(rawReport);
  const source = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  const report = {
    overall_evaluation: String(source.overall_evaluation || source.overallEvaluation || "").trim(),
    priority_issues: normalizeReportItems(source.priority_issues ?? source.priorityIssues),
    transition_suggestions: normalizeReportItems(source.transition_suggestions ?? source.transitionSuggestions),
    character_motivation_suggestions: normalizeReportItems(source.character_motivation_suggestions ?? source.characterMotivationSuggestions),
    dialogue_suggestions: normalizeReportItems(source.dialogue_suggestions ?? source.dialogueSuggestions),
    pacing_suggestions: normalizeReportItems(source.pacing_suggestions ?? source.pacingSuggestions),
    style_suggestions: normalizeReportItems(source.style_suggestions ?? source.styleSuggestions),
    recommend_optimized_version: normalizeOptimizedVersionRecommendation(source.recommend_optimized_version ?? source.recommendOptimizedVersion),
    closing_note: String(source.closing_note || source.closingNote || "").trim(),
  };
  if (!parsed) {
    report.priority_issues = [...report.priority_issues, "LLM 未返回可解析 JSON；请查看 raw_report。"];
    report.overall_evaluation = report.overall_evaluation || "审稿建议结果不可解析。";
  }
  return report;
}

function normalizeQualityScore(value) {
  const score = Number(value);
  if (!Number.isFinite(score)) return null;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalizeOptimizedVersionRecommendation(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    recommended: Boolean(source.recommended),
    reason: String(source.reason || "").trim(),
  };
}

function normalizeChapterCompletionAudit(rawAudit) {
  const parsed = parseJsonObject(rawAudit);
  const source = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  const issues = normalizeReportItems(source.issues);
  const endingStatus = String(source.ending_status || source.endingStatus || "").trim();
  const isComplete = source.is_complete === true || source.isComplete === true;
  if (!parsed) {
    return {
      is_complete: false,
      ending_status: "LLM 未返回可解析 JSON。",
      issues: ["章节完成度审核结果不可解析。"],
      suggested_fix: "请重新生成本章正文，并确保最后一句完整收束。",
      raw_audit: String(rawAudit || "").trim(),
      json_parse_failed: true,
    };
  }
  return {
    is_complete: isComplete,
    ending_status: endingStatus || (isComplete ? "complete" : "incomplete"),
    issues: issues.length > 0 ? issues : isComplete ? [] : ["章节结尾未通过完成度审核。"],
    suggested_fix: String(source.suggested_fix || source.suggestedFix || "").trim(),
    raw_audit: String(rawAudit || "").trim(),
    json_parse_failed: false,
  };
}

function createSkippedCompletionAudit(reason = "") {
  return {
    is_complete: true,
    ending_status: String(reason || "completion audit skipped"),
    issues: [],
    suggested_fix: "",
    raw_audit: "",
    json_parse_failed: false,
    skipped: true,
    skipped_reason: String(reason || ""),
    repair_skipped: true,
    repair_skipped_reason: String(reason || ""),
  };
}

function cleanMemorySummary(text) {
  const original = String(text || "").trim();
  if (!original) {
    return { summary: original, cleaned: false, reason: "", warning: "" };
  }

  const withoutLeadingSeparators = original.replace(/^\s*(?:[-*_]{3,}\s*)+/u, "").trimStart();
  const chattyPrefixPattern =
    /^(?:好的|当然可以|可以|没问题|已为你整理|我已为你整理|下面是|以下是)[，,。\s]*(?:以下是|本章|当前章节|这一章|第.+?章|为你整理的|整理的|章节)?[^#\n一\d]{0,80}(?:结构化记忆|章节记忆|本章记忆|记忆总结|摘要|总结)?[：:\n\s-]*/u;
  const prefixMatch = withoutLeadingSeparators.match(chattyPrefixPattern);
  const candidate = prefixMatch ? withoutLeadingSeparators.slice(prefixMatch[0].length).trimStart() : withoutLeadingSeparators;
  const structureIndex = findMemorySummaryStructureIndex(candidate);

  if (!prefixMatch && structureIndex === 0 && candidate === original) {
    return { summary: original, cleaned: false, reason: "", warning: "" };
  }

  const cleaned = structureIndex >= 0 ? candidate.slice(structureIndex).replace(/^\s*(?:[-*_]{3,}\s*)+/u, "").trim() : candidate.trim();
  if (!cleaned) {
    return {
      summary: original,
      cleaned: false,
      reason: prefixMatch ? "chatty_prefix_empty_after_clean" : "",
      warning: "memory summary clean result was empty; kept original summary",
    };
  }

  const changed = cleaned !== original;
  return {
    summary: changed ? cleaned : original,
    cleaned: changed,
    reason: changed ? (prefixMatch ? "chatty_prefix" : "leading_non_memory_text") : "",
    warning: "",
  };
}

function findMemorySummaryStructureIndex(text) {
  const source = String(text || "");
  const patterns = [
    /(^|\n)\s*#{1,6}\s+/u,
    /(^|\n)\s*\d+[.．、]\s*/u,
    /(^|\n)\s*[一二三四五六七八九十]+、\s*/u,
    /(^|\n)\s*(?:本章摘要|章节摘要)/u,
  ];
  const indexes = patterns
    .map((pattern) => {
      const match = source.match(pattern);
      if (!match || match.index == null) return -1;
      return match.index + (match[1] ? match[1].length : 0);
    })
    .filter((index) => index >= 0);
  return indexes.length ? Math.min(...indexes) : -1;
}

function parseJsonObject(text) {
  const raw = String(text || "").trim();
  if (!raw) return null;
  const unfenced = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  try {
    return JSON.parse(unfenced);
  } catch (_error) {
    const start = unfenced.indexOf("{");
    const end = unfenced.lastIndexOf("}");
    if (start < 0 || end <= start) return null;
    try {
      return JSON.parse(unfenced.slice(start, end + 1));
    } catch (_nestedError) {
      return null;
    }
  }
}

function normalizeReportItems(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (item == null) return "";
      if (typeof item === "string") return item.trim();
      if (typeof item === "object") return JSON.stringify(item);
      return String(item);
    })
    .filter(Boolean);
}

function renderConsistencyReportMarkdown(report, rawReport) {
  return [
    "# Consistency Report",
    "",
    ...CONSISTENCY_REPORT_KEYS.flatMap((key) => [`## ${key}`, "", renderReportList(report[key]), ""]),
    "## raw_report",
    "",
    String(rawReport || "").trim(),
    "",
  ].join("\n");
}

function renderQualityReviewMarkdown(report, rawReport) {
  return [
    "# Writing Quality Review",
    "",
    "## quality_score",
    "",
    report.quality_score == null ? "（未提供）" : String(report.quality_score),
    "",
    ...QUALITY_REVIEW_ARRAY_KEYS.flatMap((key) => [`## ${key}`, "", renderReportList(report[key]), ""]),
    "## overall_feedback",
    "",
    report.overall_feedback || "（无）",
    "",
    "## raw_report",
    "",
    String(rawReport || "").trim(),
    "",
  ].join("\n");
}

function renderTransitionReviewMarkdown(report, rawReport) {
  return [
    "# Scene Transition Review",
    "",
    "## transition_score",
    "",
    report.transition_score == null ? "（未提供）" : String(report.transition_score),
    "",
    ...TRANSITION_REVIEW_ARRAY_KEYS.flatMap((key) => [`## ${key}`, "", renderReportList(report[key]), ""]),
    "## overall_feedback",
    "",
    report.overall_feedback || "（无）",
    "",
    "## raw_report",
    "",
    String(rawReport || "").trim(),
    "",
  ].join("\n");
}

function renderEditorialSuggestionsMarkdown(report, rawReport) {
  return [
    "# Editorial Suggestions",
    "",
    "## 本章整体评价",
    "",
    report.overall_evaluation || "（无）",
    "",
    ...EDITORIAL_SUGGESTIONS_ARRAY_KEYS.flatMap((key) => [`## ${renderEditorialSuggestionsHeading(key)}`, "", renderReportList(report[key]), ""]),
    "## 是否建议生成优化版",
    "",
    report.recommend_optimized_version?.recommended ? "建议" : "暂不建议",
    "",
    report.recommend_optimized_version?.reason || "（无）",
    "",
    "## 结语",
    "",
    report.closing_note || "（无）",
    "",
  ].join("\n");
}

function renderEditorialSuggestionsHeading(key) {
  return {
    priority_issues: "优先修改问题",
    transition_suggestions: "场景衔接建议",
    character_motivation_suggestions: "人物动机建议",
    dialogue_suggestions: "对白建议",
    pacing_suggestions: "节奏建议",
    style_suggestions: "文风建议",
  }[key] || key;
}

function renderReportList(items) {
  return Array.isArray(items) && items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : "（无）";
}

module.exports = {
  createNovelWritingAgent,
  buildPromptVariables,
  cleanMemorySummary,
  createChapterFileName,
  createConsistencyReportFileName,
  normalizeConsistencyReport,
};
