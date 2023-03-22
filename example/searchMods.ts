import { CurseForge } from "../src/mod.ts";
import { API_KEY } from "./utils/apiKey.ts";

const query = "JEI";

const result = await new CurseForge(API_KEY)
  .searchMods(query, {
    minecraftVersion: "1.19.2",
    modLoader: "Forge",
  });

console.log(result);
