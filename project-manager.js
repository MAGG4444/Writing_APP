const path = require("node:path");
const fs = require("node:fs/promises");

const PROJECT_MATERIAL_FILES = {
  outline: "outline.md",
  characters: "characters.md",
  world: "world.md",
  style: "style.md",
};

const DEFAULT_MATERIAL_CONTENT = {
  outline: "# Outline\n\n",
  characters: "# Characters\n\n",
  world: "# World\n\n",
  style: "# Style\n\n",
};

const DEFAULT_MEMORY = {
  version: 1,
  summary: "",
  characters: [],
  world: [],
  preferences: [],
  updatedAt: "",
};

function createProjectManager({ projectsRoot }) {
  if (!projectsRoot) throw new Error("projectsRoot is required");
  const resolvedRoot = path.resolve(projectsRoot);

  function getProjectDirectory(workId) {
    const id = String(workId || "").trim();
    if (!id) throw new Error("workId is required");
    if (id === "." || id === ".." || id.includes("/") || id.includes("\\")) {
      throw new Error("Invalid workId");
    }
    const directory = path.resolve(resolvedRoot, id);
    if (!directory.startsWith(`${resolvedRoot}${path.sep}`)) {
      throw new Error("Invalid workId");
    }
    return directory;
  }

  function getMaterialPath(workId, material) {
    const fileName = PROJECT_MATERIAL_FILES[material];
    if (!fileName) throw new Error(`Unsupported project material: ${material}`);
    return path.join(getProjectDirectory(workId), fileName);
  }

  async function ensureProject(workId) {
    const directory = getProjectDirectory(workId);
    await fs.mkdir(directory, { recursive: true });
    await fs.mkdir(path.join(directory, "chapters"), { recursive: true });

    await Promise.all(
      Object.entries(PROJECT_MATERIAL_FILES).map(async ([material, fileName]) => {
        const filePath = path.join(directory, fileName);
        try {
          await fs.access(filePath);
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
          await fs.writeFile(filePath, DEFAULT_MATERIAL_CONTENT[material] ?? "", "utf8");
        }
      }),
    );

    const memoryPath = path.join(directory, "memory.json");
    try {
      await fs.access(memoryPath);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      await fs.writeFile(memoryPath, JSON.stringify(DEFAULT_MEMORY, null, 2), "utf8");
    }

    return { workId: String(workId), directory };
  }

  async function readProject(workId) {
    await ensureProject(workId);
    const directory = getProjectDirectory(workId);
    const materialEntries = await Promise.all(
      Object.keys(PROJECT_MATERIAL_FILES).map(async (material) => [material, await fs.readFile(getMaterialPath(workId, material), "utf8")]),
    );

    let memory = { ...DEFAULT_MEMORY };
    try {
      memory = { ...DEFAULT_MEMORY, ...JSON.parse(await fs.readFile(path.join(directory, "memory.json"), "utf8")) };
    } catch (error) {
      if (error.code !== "ENOENT" && !(error instanceof SyntaxError)) throw error;
    }

    return {
      workId: String(workId),
      directory,
      materials: Object.fromEntries(materialEntries),
      memory,
      chapters: await listProjectChapters(workId),
    };
  }

  async function saveProjectMaterial(workId, material, content) {
    await ensureProject(workId);
    const filePath = getMaterialPath(workId, material);
    await fs.writeFile(filePath, String(content ?? ""), "utf8");
    return { workId: String(workId), material, fileName: PROJECT_MATERIAL_FILES[material] };
  }

  async function listProjectChapters(workId) {
    await ensureProject(workId);
    const chaptersDirectory = path.join(getProjectDirectory(workId), "chapters");
    const entries = await fs.readdir(chaptersDirectory, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => /\.(md|txt)$/i.test(fileName))
      .sort((left, right) => left.localeCompare(right, "zh-Hans-CN", { numeric: true }));
  }

  return {
    ensureProject,
    readProject,
    saveProjectMaterial,
    listProjectChapters,
  };
}

module.exports = {
  PROJECT_MATERIAL_FILES,
  DEFAULT_MEMORY,
  createProjectManager,
};
