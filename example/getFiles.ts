import { CurseForge } from "../src/mod.ts";
import { API_KEY } from "./utils/apiKey.ts";

const modID = 419699; // Architectury

const result = await new CurseForge(API_KEY)
  .getFiles(modID, {
    minecraftVersion: "1.19.2",
    modLoader: "Quilt",
  });

console.log(result);
