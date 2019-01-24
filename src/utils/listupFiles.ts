import * as fs from "fs";
import * as path from "path";

export const listupFiles = (dirPath: string) => {
  const ret: string[] = [];
  const directoryList = fs.readdirSync(dirPath);

  for (const directory of directoryList) {
    const target = `${dirPath}/${directory}`;

    const stat = fs.statSync(target);

    if (stat.isFile()) {
      if (path.extname(target) !== ".html") {
        continue;
      }

      if (target === "debug.html") {
        continue;
      }

      ret.push(target);
      continue;
    }

    if (stat.isDirectory()) {
      ret.push(...listupFiles(target));
    }
  }

  return ret;
};
