import type {
  CurseForgeClient,
  CurseForgeMod,
} from "https://esm.sh/curseforge-api@1.0.2";

import type { Cache } from "../Cache.ts";

import { CLASSES } from "../common/categories.ts";
import { GAME_ID } from "../common/constants.ts";
import { mod } from "./Mod.ts";

async function getModByID(
  curseForge: CurseForgeClient,
  cache: Cache,
  id: number,
) {
  if (cache.mod[id]) return cache.mod[id];

  const raw: undefined | CurseForgeMod = await curseForge.getMod(id);

  const result = raw ? mod(raw) : null;

  cache.mod[id] = result;
  if (result) cache.mod[result.slug] = result;

  return result;
}

async function getModBySlug(
  curseForge: CurseForgeClient,
  cache: Cache,
  slug: string,
) {
  if (cache.mod[slug]) return cache.mod[slug];

  const { data } = await curseForge
    .searchMods(GAME_ID, {
      slug,
      classId: CLASSES.Mods,
    });

  const result = data.length === 1 ? mod(data[0]) : null;

  cache.mod[slug] = result;
  if (result) cache.mod[result.id] = result;

  return result;
}

/** @private Use CurseForge.getMod() instead. */
export async function getMod(
  curseForge: CurseForgeClient,
  cache: Cache,
  slugOrID: string | number,
) {
  return typeof slugOrID === "number"
    ? await getModByID(curseForge, cache, slugOrID)
    : await getModBySlug(curseForge, cache, slugOrID);
}
