const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const { createCostGuard } = require("../agent/cost/cost-guard");
const { createMemoryManager } = require("../memory-manager");
const { createNovelWritingAgent } = require("../novel-writing-agent");
const { createProjectManager } = require("../project-manager");
const { createToolManager } = require("../tool-manager");

async function main() {
  const guard = createCostGuard();

  const longTestEstimate = guard.shouldBlockRun(
    guard.estimateChapterRun({
      generation_mode: "standard",
      target_word_count: 2000,
      scene_count: 4,
    }),
  );
  assert.equal(longTestEstimate.blocked, true);
  assert.equal(longTestEstimate.blocked_reasons.some((reason) => reason.includes("test_run_mode blocks target_word_count 2000")), true);

  const fastDraftEstimate = guard.shouldBlockRun(
    guard.estimateChapterRun({
      generation_mode: "fast_draft",
      target_word_count: 500,
      scene_count: 1,
    }),
  );
  assert.equal(fastDraftEstimate.blocked, false);
  assert.equal(fastDraftEstimate.estimated_llm_calls, 5);
  assert.equal(fastDraftEstimate.disabled_steps.includes("scene_completion_audit"), true);
  assert.equal(fastDraftEstimate.disabled_steps.includes("scene_completion_repair"), true);

  const standardEstimate = guard.shouldBlockRun(
    guard.estimateChapterRun({
      generation_mode: "standard",
      target_word_count: 2000,
      scene_count: 3,
    }),
  );
  assert.equal(standardEstimate.blocked, true);
  assert.equal(standardEstimate.estimated_llm_calls <= 12, true);
  assert.equal(standardEstimate.blocked_reasons.some((reason) => reason.includes("estimated_llm_calls")), false);
  assert.equal(standardEstimate.blocked_reasons.some((reason) => reason.includes("test_run_mode")), true);

  const productGuard = createCostGuard({ test_run_mode: false });
  const productFastDraftEstimate = productGuard.shouldBlockRun(
    productGuard.estimateChapterRun({
      generation_mode: "fast_draft",
      target_word_count: 2000,
      scene_count: 3,
    }),
  );
  assert.equal(productFastDraftEstimate.blocked, false);

  const productStandardEstimate = productGuard.shouldBlockRun(
    productGuard.estimateChapterRun({
      generation_mode: "standard_chapter",
      target_word_count: 2000,
      scene_count: 3,
    }),
  );
  assert.equal(productStandardEstimate.blocked, false);

  const desktopRuntimeGuard = createCostGuard({
    test_run_mode: false,
    max_llm_calls_per_chapter: 30,
    max_input_tokens_per_chapter: 600000,
    max_output_tokens_per_chapter: 70000,
    max_estimated_cost_usd: 3.0,
  });
  const desktopPolishedEstimate = desktopRuntimeGuard.shouldBlockRun(
    desktopRuntimeGuard.estimateChapterRun({
      generation_mode: "polished_chapter",
      target_word_count: 2000,
      scene_count: 3,
    }),
  );
  assert.equal(desktopPolishedEstimate.blocked, false);

  const desktopFastLongEstimate = desktopRuntimeGuard.shouldBlockRun(
    desktopRuntimeGuard.estimateChapterRun({
      generation_mode: "fast_draft",
      target_word_count: 3200,
      scene_count: 5,
    }),
  );
  assert.equal(desktopFastLongEstimate.blocked, false);
  assert.equal(desktopFastLongEstimate.estimated_llm_calls, 9);
  assert.equal(desktopFastLongEstimate.estimated_output_tokens_range.high < 10000, true);
  assert.equal(desktopFastLongEstimate.estimated_max_output_tokens, desktopFastLongEstimate.estimated_output_tokens_range.high);

  const desktopStandardLongEstimate = desktopRuntimeGuard.shouldBlockRun(
    desktopRuntimeGuard.estimateChapterRun({
      generation_mode: "standard_chapter",
      target_word_count: 3200,
      scene_count: 5,
    }),
  );
  assert.equal(desktopStandardLongEstimate.blocked, false);

  const callLimitedGuard = createCostGuard({ test_run_mode: false, max_llm_calls_per_chapter: 3 });
  const callLimited = callLimitedGuard.shouldBlockRun(
    callLimitedGuard.estimateChapterRun({
      generation_mode: "fast_draft",
      target_word_count: 300,
      scene_count: 1,
    }),
  );
  assert.equal(callLimited.blocked, true);
  assert.equal(callLimited.blocked_reasons.some((reason) => reason.includes("estimated_llm_calls")), true);

  const costLimitedGuard = createCostGuard({ test_run_mode: false, max_estimated_cost_usd: 0.01 });
  const costLimited = costLimitedGuard.shouldBlockRun(
    costLimitedGuard.estimateChapterRun({
      generation_mode: "standard",
      target_word_count: 1000,
      scene_count: 2,
    }),
  );
  assert.equal(costLimited.blocked, true);
  assert.equal(costLimited.blocked_reasons.some((reason) => reason.includes("estimated cost")), true);

  const report = guard.buildBudgetReport(longTestEstimate);
  assert.equal(report.blocked, true);
  assert.equal(Array.isArray(report.blocked_reasons), true);
  assert.equal(typeof report.estimated_llm_calls, "number");

  await testAgentBlocksBeforeLlmCall();
  await testAgentBypassOnlyInTestEnvironment();
  await testAgentUserConfirmedCostGuardContinues();
  await testAgentNetworkFailureIncludesTrace();

  console.log("Cost guard tests passed");
}

async function testAgentNetworkFailureIncludesTrace() {
  const setup = await createTestAgent({
    costGuard: createCostGuard({
      test_run_mode: false,
      max_llm_calls_per_chapter: 30,
      max_input_tokens_per_chapter: 600000,
      max_output_tokens_per_chapter: 70000,
      max_estimated_cost_usd: 3.0,
    }),
    llmClient: {
      async generate(request) {
        if (request.prompt_id === "planner_prompt") {
          return {
            content: "章节大纲。",
            metadata: { finish_reason: "stop", status: "completed", input_token_usage: 10, output_token_usage: 5 },
          };
        }
        throw new Error("fetch failed");
      },
    },
  });
  try {
    const result = await setup.agent.write_chapter({
      project_id: "work-1",
      chapter_number: 905,
      user_instruction: "测试中途网络失败。",
      target_word_count: 1000,
      generation_mode: "polished_chapter",
    });
    assert.equal(result.ok, false);
    assert.equal(result.failed_step, "generate_scene_outline");
    assert.equal(result.failed_prompt_id, "scene_outline_prompt");
    assert.equal(result.generation_mode, "polished_chapter");
    assert.equal(result.writing_path, "polished_chapter");
    assert.match(result.generation_metadata_file, /generation_metadata_chapter_905_/);
    assert.equal(result.failed_llm_events.length, 1);
    assert.equal(result.failed_llm_events[0].prompt_id, "planner_prompt");
    const report = await fs.readFile(path.join(setup.root, "work-1", "reports", result.generation_metadata_file), "utf8");
    assert.match(report, /"failed": true/);
    assert.match(report, /"requested_generation_mode": "polished_chapter"/);
    assert.match(report, /"writing_path": "polished_chapter"/);
  } finally {
    await setup.cleanup();
  }
}

async function testAgentUserConfirmedCostGuardContinues() {
  const setup = await createTestAgent({
    costGuard: createCostGuard({ test_run_mode: false, max_llm_calls_per_chapter: 1 }),
  });
  try {
    const result = await setup.agent.write_chapter({
      project_id: "work-1",
      chapter_number: 904,
      user_instruction: "测试用户确认后继续。",
      target_word_count: 2000,
      generation_mode: "polished_chapter",
      cost_guard_confirmed: true,
    });
    assert.equal(result.ok, true);
    assert.equal(result.generation_metadata.cost_guard_enabled, true);
    assert.equal(result.generation_metadata.cost_guard_confirmed, true);
    assert.equal(setup.getCallCount() > 0, true);
  } finally {
    await setup.cleanup();
  }
}

async function testAgentBlocksBeforeLlmCall() {
  const { agent, getCallCount, cleanup } = await createTestAgent({
    costGuard: createCostGuard(),
  });
  try {
    const result = await agent.write_chapter({
      project_id: "work-1",
      chapter_number: 901,
      user_instruction: "测试成本保护。",
      target_word_count: 2000,
      generation_mode: "standard",
    });

    assert.equal(result.ok, false);
    assert.equal(result.cost_guard_blocked, true);
    assert.equal(result.failed_step, "cost_guard");
    assert.equal(result.blocked_reasons.some((reason) => reason.includes("test_run_mode")), true);
    assert.equal(getCallCount(), 0);
  } finally {
    await cleanup();
  }
}

async function testAgentBypassOnlyInTestEnvironment() {
  const blockedSetup = await createTestAgent({
    costGuard: createCostGuard({ allow_test_bypass: true, environment: "production" }),
  });
  try {
    const blocked = await blockedSetup.agent.write_chapter({
      project_id: "work-1",
      chapter_number: 902,
      user_instruction: "测试成本保护。",
      target_word_count: 2000,
      generation_mode: "standard",
      bypass_cost_guard: true,
    });
    assert.equal(blocked.ok, false);
    assert.equal(blocked.cost_guard_blocked, true);
    assert.equal(blockedSetup.getCallCount(), 0);
  } finally {
    await blockedSetup.cleanup();
  }

  const bypassSetup = await createTestAgent({
    costGuard: createCostGuard({ allow_test_bypass: true, environment: "test" }),
  });
  try {
    const allowed = await bypassSetup.agent.write_chapter({
      project_id: "work-1",
      chapter_number: 903,
      user_instruction: "测试成本保护。",
      target_word_count: 2000,
      generation_mode: "standard",
      bypass_cost_guard: true,
    });
    assert.equal(allowed.ok, true);
    assert.equal(allowed.generation_metadata.cost_guard_enabled, true);
    assert.equal(allowed.generation_metadata.cost_guard_bypassed, true);
    assert.equal(bypassSetup.getCallCount() > 0, true);
  } finally {
    await bypassSetup.cleanup();
  }
}

async function createTestAgent({ costGuard, llmClient: injectedLlmClient = null }) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "jian-ji-cost-guard-"));
  const library = {
    folders: [],
    works: [
      {
        id: "work-1",
        title: "测试项目",
        description: "",
        chapterIds: [],
        updatedAt: "2026-01-01T00:00:00.000Z",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ],
    chapters: [],
    inspirations: { categoryOrder: [], itemsByWork: {} },
  };
  const projectManager = createProjectManager({ projectsRoot: root });
  const memoryManager = createMemoryManager({ projectsRoot: root });
  await projectManager.ensureProject("work-1");
  await projectManager.saveProjectMaterial("work-1", "outline", "# Outline\n\n测试大纲。\n");
  await projectManager.saveProjectMaterial("work-1", "characters", "# Characters\n\n主角：测试。\n");
  await projectManager.saveProjectMaterial("work-1", "world", "# World\n\n测试世界。\n");
  await projectManager.saveProjectMaterial("work-1", "style", "# Style\n\n克制。\n");
  await projectManager.saveProjectMaterial("work-1", "goals", "# Goals\n\n测试。\n");
  const tools = createToolManager({
    projectsRoot: root,
    loadLibrary: async () => library,
    saveLibrary: async () => {},
  });

  const calls = [];
  const llmClient = injectedLlmClient || {
    async generate(request) {
      calls.push(request);
      if (request.prompt_id === "planner_prompt") return { content: "章节大纲。" };
      if (request.prompt_id === "scene_outline_prompt") {
        return {
          content: JSON.stringify([
            {
              scene_title: "测试场景",
              scene_goal: "完成测试",
              characters: ["主角"],
              conflict: "成本限制",
              expected_turning_point: "通过",
              target_word_count: 500,
            },
          ]),
        };
      }
      if (request.prompt_id === "scene_writer_prompt") {
        return {
          content: "主角完成了测试，并自然收束。\n\n[CHAPTER_END]",
          metadata: { finish_reason: "stop", status: "completed", input_token_usage: 100, output_token_usage: 50 },
        };
      }
      if (request.prompt_id === "chapter_completion_auditor_prompt") {
        return {
          content: JSON.stringify({
            is_complete: true,
            ending_status: "完整",
            issues: [],
            suggested_fix: "",
          }),
          metadata: { finish_reason: "stop", status: "completed", input_token_usage: 100, output_token_usage: 50 },
        };
      }
      if (request.prompt_id === "editorial_suggestions_prompt") {
        return {
          content: JSON.stringify({
            overall_evaluation: "可读。",
            priority_issues: [],
            transition_suggestions: [],
            character_motivation_suggestions: [],
            dialogue_suggestions: [],
            pacing_suggestions: [],
            style_suggestions: [],
            recommend_optimized_version: { recommended: false, reason: "" },
            closing_note: "",
          }),
          metadata: { finish_reason: "stop", status: "completed", input_token_usage: 100, output_token_usage: 50 },
        };
      }
      if (request.prompt_id === "summarizer_prompt") {
        return { content: "## 本章摘要\n\n完成测试。", metadata: { finish_reason: "stop", status: "completed", input_token_usage: 100, output_token_usage: 50 } };
      }
      throw new Error(`Unexpected prompt: ${request.prompt_id}`);
    },
  };

  return {
    agent: createNovelWritingAgent({ projectManager, memoryManager, tools, llmClient, costGuard }),
    root,
    getCallCount: () => calls.length,
    cleanup: () => fs.rm(root, { recursive: true, force: true }),
  };
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
