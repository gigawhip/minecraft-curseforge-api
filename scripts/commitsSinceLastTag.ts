import clipboard from "https://deno.land/x/clipboard@v0.0.2/mod.ts";

import { cmd } from "./utils/cmd.ts";

const tag = await cmd("git describe --tags --abbrev=0");

await cmd(`git log ${tag}..HEAD --oneline`)
  .then((output) => clipboard.writeText(output));

console.log(`Commits since ${tag} copied to clipboard`);
