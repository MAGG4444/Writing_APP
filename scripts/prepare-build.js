const fs = require("node:fs/promises");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const buildDir = path.join(rootDir, ".app-build");
const buildAssetsDir = path.join(buildDir, "assets");

const runtimeFiles = [
  "agent-prompts.js",
  "app.js",
  "index.html",
  "main.js",
  "memory-manager.js",
  "novel-writing-agent.js",
  "preload.js",
  "project-manager.js",
  "skill-manager.js",
  "styles.css",
  "tool-manager.js",
];
const runtimeImages = ["fold_image.png", "file_image.png"];
const runtimeDirectories = ["agent-skills"];

async function main() {
  await fs.rm(buildDir, { recursive: true, force: true });
  await fs.mkdir(buildDir, { recursive: true });
  await fs.mkdir(buildAssetsDir, { recursive: true });

  for (const file of runtimeFiles) {
    await fs.copyFile(path.join(rootDir, file), path.join(buildDir, file));
  }

  for (const file of runtimeImages) {
    await fs.copyFile(path.join(rootDir, file), path.join(buildDir, file));
  }

  for (const directory of runtimeDirectories) {
    await fs.cp(path.join(rootDir, directory), path.join(buildDir, directory), {
      recursive: true,
    });
  }

  await fs.cp(path.join(rootDir, "assets", "fonts"), path.join(buildAssetsDir, "fonts"), {
    recursive: true,
  });

  const rootPackage = JSON.parse(await fs.readFile(path.join(rootDir, "package.json"), "utf8"));
  const appPackage = {
    name: rootPackage.name,
    productName: rootPackage.productName,
    version: rootPackage.version,
    description: rootPackage.description,
    author: rootPackage.author,
    license: rootPackage.license,
    main: "main.js",
  };

  await fs.writeFile(
    path.join(buildDir, "package.json"),
    `${JSON.stringify(appPackage, null, 2)}\n`,
    "utf8",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
