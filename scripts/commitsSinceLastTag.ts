import clipboard from "https://deno.land/x/clipboard@v0.0.2/mod.ts";

const tag = await Deno.run({
  cmd: ["git", "describe", "--tags", "--abbrev=0"],
  stdout: "piped",
}).output()
  .then((output) => new TextDecoder().decode(output).trim());

await Deno.run({
  cmd: ["git", "log", `${tag}..HEAD`, "--oneline"],
  stdout: "piped",
}).output()
  .then((output) => new TextDecoder().decode(output))
  .then((output) => clipboard.writeText(output));

console.log(`Commits since ${tag} copied to clipboard`);
