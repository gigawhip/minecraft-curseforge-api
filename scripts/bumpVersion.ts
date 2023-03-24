import { walk } from "https://deno.land/std@0.181.0/fs/walk.ts";
import clipboard from "https://deno.land/x/clipboard@v0.0.2/mod.ts";

if (!Deno.args.length) {
  console.log("A SemVer version number is required.");
  Deno.exit(1);
}

const VERSION_PATTERN_STRING = "\\d+\\.\\d+\\.\\d+";
const VERSION_PATTERN = new RegExp(`^${VERSION_PATTERN_STRING}$`);

const version = Deno.args[0];

if (!VERSION_PATTERN.test(version)) {
  console.log(`"${version}" is not a valid SemVer version number.`);
  Deno.exit(1);
}

const URL_BASE = "https://deno.land/x/minecraft_curseforge_api@";
const URL_PATTERN = new RegExp(`${URL_BASE}${VERSION_PATTERN_STRING}`, "g");

for await (const { path } of walk(Deno.cwd(), { exts: [".ts", ".md"] })) {
  const contents = await Deno.readTextFile(path);

  if (URL_PATTERN.test(contents)) {
    await Deno.writeTextFile(
      path,
      contents.replaceAll(URL_PATTERN, `${URL_BASE}${version}`),
    );
    console.log(`Updated ${path}`);
  }
}

clipboard.writeText(`chore: bump version to ${version}`);
console.log(`Commit message copied to clipboard.`);
