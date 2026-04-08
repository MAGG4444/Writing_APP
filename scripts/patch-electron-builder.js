const fs = require("node:fs/promises");
const path = require("node:path");

const targetFile = path.join(
  __dirname,
  "..",
  "node_modules",
  "app-builder-lib",
  "out",
  "node-module-collector",
  "nodeModulesCollector.js",
);

const shellFrom =
  '                shell: true, // `true`` is now required: https://github.com/electron-userland/electron-builder/issues/9488';
const shellTo =
  '                shell: process.platform === "win32", // keep shell wrapping only for the upstream Windows workaround';

const collectorNeedle = `    async getNodeModules({ packageName }) {
        const tree = await this.getDependenciesTree(this.installOptions.manager);`;

const collectorPatch = `    async getNodeModules({ packageName }) {
        const packageJsonPath = path.join(this.rootDir, "package.json");
        if (await (0, builder_util_1.exists)(packageJsonPath)) {
            const packageJson = await fs.readJson(packageJsonPath);
            const hasRuntimeDependencies = Object.keys({
                ...(packageJson.dependencies || {}),
                ...(packageJson.optionalDependencies || {}),
            }).length > 0;
            if (!hasRuntimeDependencies) {
                builder_util_1.log.debug({ packageName }, "no runtime dependencies declared, skipping node modules collection");
                return { nodeModules: [], logSummary: this.cache.logSummary };
            }
        }
        const tree = await this.getDependenciesTree(this.installOptions.manager);`;

async function main() {
  let source = await fs.readFile(targetFile, "utf8");

  if (source.includes(shellFrom)) {
    source = source.replace(shellFrom, shellTo);
  }

  if (!source.includes("no runtime dependencies declared, skipping node modules collection")) {
    if (!source.includes(collectorNeedle)) {
      throw new Error("electron-builder collector patch target not found");
    }
    source = source.replace(collectorNeedle, collectorPatch);
  }

  await fs.writeFile(targetFile, source, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
