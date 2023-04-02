import { CurseForge } from "../src/mod.ts";
import { API_KEY } from "./utils/apiKey.ts";

// This mod has a missing dependency for this Minecraft version number, which is
// useful for this example.
const SLUG = "cultural-delights";
const minecraftVersion = "1.19.2";
const modLoader = "Forge";
const options = { minecraftVersion, modLoader } as const;

const curseForge = new CurseForge(API_KEY, options);
const mod = await curseForge.getMod(SLUG);
const file = await curseForge.getNewestFile(mod.id);
const dependencies = curseForge.dependencies(file);

for await (const [modID, file] of dependencies) {
  if (file === null) {
    console.log(
      `Couldn't find a file for mod with ID ${modID} (${minecraftVersion} ${modLoader})`,
    );
  } else {
    console.log(`Found file: ${file.displayName} (Mod ID ${modID})`);
  }
}
