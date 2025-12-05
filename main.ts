import { program } from "@commander-js/extra-typings";
import * as path from "@std/path/posix";
import * as fs from "@std/fs";
import * as changeCase from "change-case";

const extensions = [".wav", "mp3"];

if (import.meta.main) {
  main();
}

function main() {
  const parser = program.name("strudelfy").argument(
    "<path>",
    "The path to folder you want to strudelfy. Use . for the current folder.",
  ).argument(
    "<base>",
    "This should be the URL to your github repo.",
  ).description("Create a strudel.json file for the specified path.")
    .addHelpText(
      "after",
      "\nExample:" +
        "\n\tstrudelfy . https://github.com/Username/Repo" +
        "\n\tstrudelfy mySampleFolder https://github.com/UserName/Repo",
    );

  const cli = parser.parse();

  const [dirPath, base] = cli.args;

  main_cli(dirPath, base);
}

function main_cli(dirPath: string, base: string) {
  const strudelFilePath = path.join(dirPath, "strudel.json");
  if (fs.existsSync(strudelFilePath)) {
    if (!prompt("You are about to overwrite strudel.json. Are you sure?")) {
      return;
    }
  }

  const output = createStrudelFile(
    Array.from(fs.walkSync(dirPath)).map((x) => x.path),
    dirPath,
    base,
  );

  const json = JSON.stringify(output, undefined, 2);

  Deno.writeTextFileSync(strudelFilePath, json);

  console.log("Done");
}

export function getSlugForFile(filePath: string) {
  const baseName = path.basename(filePath);
  const ext = path.extname(filePath);
  const withoutExtensions = baseName.replace(ext, "");
  return changeCase.snakeCase(withoutExtensions);
}

export function createStrudelFile(
  filePaths: string[],
  dirPath: string,
  base: string,
) {
  filePaths = filePaths.map(path.normalize).map((x) => x.replaceAll("\\", "/"));
  dirPath = dirPath.replaceAll("\\", "/");
  const result: { [key: string]: string[] } = {};

  function getArr(file: string) {
    if (!(file in result)) {
      result[file] = [];
    }
    return result[file];
  }

  for (const file of filePaths) {
    const ext = path.extname(file);
    if (!extensions.includes(ext)) {
      continue;
    }
    const slug = getSlugForFile(file);

    const sampleRegex = /(.*)(\d+)$/gm;
    const match = sampleRegex.exec(slug);

    const relative = path.relative(dirPath, file);

    if (match) {
      const name = match[1] ?? "";

      getArr(name).push(relative);
    } else {
      getArr(slug).push(relative);
    }
  }

  const output = { ...result, _base: base };

  return output;
}
