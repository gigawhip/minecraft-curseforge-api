import { CurseForge } from "../src/mod.ts";
import { API_KEY } from "./utils/apiKey.ts";

// This mod has a missing dependency for this Minecraft version number, which is
// useful for this example.
const SLUG = "cultural-delights";
const minecraftVersion = "1.19.2";
const modLoader = "Forge";

const curseForge = await new CurseForge(API_KEY);
const mod = await curseForge.getMod(SLUG);

if (!mod) {
  console.log(`Couldn't find a mod with slug "${SLUG}"`);
  Deno.exit(1);
}

const file = await curseForge.getNewestFile(mod.id, {
  minecraftVersion,
  modLoader,
});

if (!file) {
  console.log(
    `Couldn't find a file for ${mod.name}} (${minecraftVersion} ${modLoader})`,
  );
  Deno.exit(1);
}

const crawler = curseForge.dependencies({ file, minecraftVersion, modLoader });

for await (const { modID, file } of crawler) {
  if (file === null) {
    console.log(
      `Couldn't find a file for mod with ID ${modID} (${minecraftVersion} ${modLoader})`,
    );
  } else {
    console.log(`Found file: ${file.displayName} (Mod ID ${modID})`);
  }
}