const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appPath = path.join(__dirname, "..", "app.js");
const source = fs.readFileSync(appPath, "utf8");

function extractFunction(name) {
  const start = source.indexOf(`function ${name}`);
  if (start < 0) throw new Error(`Missing function ${name}`);

  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }

  throw new Error(`Could not extract function ${name}`);
}

const functionNames = [
  "normalizeTxtContent",
  "trimTxtEdges",
  "normalizeFullwidthDigits",
  "normalizeImportedTxtHeadingLine",
  "cleanTxtChapterSuffix",
  "matchImportedTxtChapterHeading",
  "buildImportedTxtChapterTitle",
  "parseImportedTxtChapters",
];

const sandbox = {
  getLanguage: () => "zh",
};

vm.createContext(sandbox);
vm.runInContext(`${functionNames.map(extractFunction).join("\n")}`, sandbox);

const parse = sandbox.parseImportedTxtChapters;

function titlesOf(result) {
  return Array.from(result.chapters, (chapter) => chapter.title);
}

{
  const result = parse("序章：风起\n序章内容\n\n第一章 夜雨\n正文一\n\n第２回、旧事\n正文二");
  assert.equal(result.recognizedCount, 3);
  assert.deepEqual(titlesOf(result), ["序章 风起", "第一章 夜雨", "第2回 旧事"]);
  assert.equal(result.chapters[1].content, "正文一");
}

{
  const result = parse("第 ○ 一 章  被优先识别\n正文\n\n第十万章：终局\n更多正文");
  assert.equal(result.recognizedCount, 2);
  assert.deepEqual(titlesOf(result), ["第○一章 被优先识别", "第十万章 终局"]);
}

{
  const result = parse("### 第 一 章：标题 ###\n内容\n\n===== 第002节 小节 =====\n更多内容");
  assert.equal(result.recognizedCount, 2);
  assert.deepEqual(titlesOf(result), ["第一章 标题", "第002节 小节"]);
}

{
  const result = parse("Chapter 1: Opening\nBody\n\nCHAPTER 02 Return\nMore");
  assert.equal(result.recognizedCount, 2);
  assert.deepEqual(titlesOf(result), ["Chapter 1 Opening", "Chapter 02 Return"]);
}

{
  const result = parse("不是章节标题\n正文内容");
  assert.equal(result.recognizedCount, 0);
  assert.equal(result.chapters.length, 1);
  assert.equal(result.chapters[0].content, "不是章节标题\n正文内容");
}

console.log("TXT import parser tests passed");
