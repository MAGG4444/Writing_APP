const fs = require("node:fs/promises");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const buildDir = path.join(rootDir, ".app-build");

const runtimeFiles = ["app.js", "index.html", "main.js", "preload.js", "styles.css"];

async function main() {
  await fs.rm(buildDir, { recursive: true, force: true });
  await fs.mkdir(buildDir, { recursive: true });

  for (const file of runtimeFiles) {
    await fs.copyFile(path.join(rootDir, file), path.join(buildDir, file));
  }

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
