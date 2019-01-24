import * as fs from "fs";
import * as path from "path";
import { listupFiles } from "./utils/listupFiles";

import program from "commander";
const taskLogPrefix = "addMetaAndPolyfill：";

program
  .usage("-src path_to_target")
  .option("--src <value>", "対象フォルダー")
  .option("--polyfill <value>", "ポリフィルのパス")
  .parse(process.argv);

const addMeta = (htmlCode: string): string => {
  const metaTag = `<meta http-equiv="X-UA-Compatible" content="ie=edge"/>`;

  if (htmlCode.includes("X-UA-Compatible") === true) {
    return htmlCode;
  }
  return htmlCode.replace(/(\<head\>)/, `$1\n  ${metaTag}`);
};

const addPolyfill = (htmlCode: string): string => {
  const polyfillPath: string | unknown = program.polyfill;

  if (polyfillPath == null || polyfillPath === "") {
    console.log(`${taskLogPrefix}ポリフィルの指定なし`);
    return htmlCode;
  }

  const polyfillTag = `<script src="${polyfillPath}" defer></script>`;
  if (htmlCode.includes(polyfillTag) === true) {
    console.log(`${taskLogPrefix}指定のポリフィルは設定済みです`);
    return htmlCode;
  }
  console.log(`${taskLogPrefix}ポリフィルを設定しました`);
  return htmlCode.replace(/(.*<\/head>)/, `  ${polyfillTag}\n$1`);
};

export const modifyCodes = async (targetFileList: string[]): Promise<void> => {
  for (const file of targetFileList) {
    let htmlCode = fs.readFileSync(file, "utf8");
    htmlCode = addMeta(htmlCode);
    htmlCode = addPolyfill(htmlCode);
    fs.writeFileSync(file, htmlCode, { encoding: "utf-8" });
  }
};

export const addMetaAndPolyfill = () => {
  console.log(`${taskLogPrefix}IE11向けにHTMLコードを編集します`);
  //  const targetFolder = process.env.npm_package_config_src;

  const targetFolder: string | unknown = program.src;

  if (typeof targetFolder !== "string" || targetFolder === "") {
    console.warn(`${taskLogPrefix}対象フォルダーが設定されていません`);
    console.warn(`${taskLogPrefix}処理を終了します`);
    return;
  }

  const sourceFolder = `${path.resolve(process.cwd(), targetFolder)}`;

  if (fs.existsSync(sourceFolder) === false) {
    console.warn(
      `${taskLogPrefix}対象フォルダーの「${sourceFolder}」が見つかりませんでした
    `
    );
    console.warn(`${taskLogPrefix}処理を終了します`);
    return;
  }

  const targetFileList = listupFiles(sourceFolder);
  modifyCodes(targetFileList);

  console.log(`${taskLogPrefix}処理が終了しました`);
};

addMetaAndPolyfill();
