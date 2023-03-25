import type {
  CurseForgeClient,
  CurseForgeMod,
} from "https://esm.sh/curseforge-api@1.0.2";

import { CLASS_NAMES } from "../common/categories.ts";
import { GAME_ID } from "../common/constants.ts";
import { mod } from "./Mod.ts";

async function getModByID(
  curseForge: CurseForgeClient,
  id: number,
) {
  const result: undefined | CurseForgeMod = await curseForge.getMod(id);

  return result && mod(result);
}

async function getModBySlug(
  curseForge: CurseForgeClient,
  slug: string,
) {
  const { data } = await curseForge
    .searchMods(GAME_ID, {
      slug,
      classId: CLASS_NAMES.Mods,
    });

  if (data.length !== 1) return;

  return mod(data[0]);
}

/** @private Use CurseForge.getMod() instead. */
export async function getMod(
  curseForge: CurseForgeClient,
  slugOrID: string | number,
) {
  return typeof slugOrID === "number"
    ? await getModByID(curseForge, slugOrID)
    : await getModBySlug(curseForge, slugOrID);
}
