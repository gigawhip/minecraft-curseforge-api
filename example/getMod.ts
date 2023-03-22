import { CurseForge } from "../src/mod.ts";
import { API_KEY } from "./utils/apiKey.ts";

const result = await new CurseForge(API_KEY)
  .getMod("jei");

console.log(result);
