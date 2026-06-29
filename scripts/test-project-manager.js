const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const { createProjectManager } = require("../project-manager");

async function main() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "jian-ji-project-manager-"));
  try {
    const manager = createProjectManager({ projectsRoot: root });
    const project = await manager.ensureProject("work-1");

    assert.equal(project.workId, "work-1");
    assert.equal(project.directory, path.join(root, "work-1"));

    for (const fileName of ["outline.md", "characters.md", "world.md", "style.md", "goals.md", "memory.json"]) {
      const stat = await fs.stat(path.join(root, "work-1", fileName));
      assert.equal(stat.isFile(), true);
    }
    assert.equal((await fs.stat(path.join(root, "work-1", "chapters"))).isDirectory(), true);

    await manager.saveProjectMaterial("work-1", "characters", "# Characters\n\n- 林秋\n");
    const readProject = await manager.readProject("work-1");
    assert.match(readProject.materials.outline, /# Outline/);
    assert.match(readProject.materials.characters, /林秋/);
    assert.match(readProject.materials.goals, /# Goals/);
    assert.equal(readProject.memory.version, 1);

    await fs.writeFile(path.join(root, "work-1", "chapters", "第1章.md"), "正文", "utf8");
    await fs.writeFile(path.join(root, "work-1", "chapters", "notes.json"), "{}", "utf8");
    assert.deepEqual(await manager.listProjectChapters("work-1"), ["第1章.md"]);

    const savedChapter = await manager.saveProjectChapter("work-1", "chapter 002.md", "第二章正文");
    assert.equal(savedChapter.fileName, "chapter_002.md");
    assert.equal(await fs.readFile(path.join(root, "work-1", "chapters", "chapter_002.md"), "utf8"), "第二章正文");
    assert.equal((await manager.readProjectChapter("work-1", "chapter_002.md")).content, "第二章正文");

    const savedReport = await manager.saveProjectReport("work-1", "consistency chapter 002.md", "# Report");
    assert.equal(savedReport.fileName, "consistency_chapter_002.md");
    assert.equal(await fs.readFile(path.join(root, "work-1", "reports", "consistency_chapter_002.md"), "utf8"), "# Report");

    assert.throws(() => createProjectManager({ projectsRoot: "" }), /projectsRoot is required/);
    await assert.rejects(() => manager.ensureProject("."), /Invalid workId/);
    await assert.rejects(() => manager.ensureProject("../outside"), /Invalid workId/);
    await assert.rejects(() => manager.saveProjectMaterial("work-1", "unknown", ""), /Unsupported project material/);
    await assert.rejects(() => manager.saveProjectChapter("work-1", "../outside.md", ""), /Invalid chapter fileName/);
    await assert.rejects(() => manager.saveProjectChapter("work-1", "chapter.json", ""), /chapter fileName must end with .md or .txt/);
    await assert.rejects(() => manager.saveProjectReport("work-1", "../outside.md", ""), /Invalid report fileName/);
    await assert.rejects(() => manager.saveProjectReport("work-1", "report.txt", ""), /report fileName must end with .md/);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
}

main()
  .then(() => {
    console.log("Project manager tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
