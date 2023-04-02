import type { CurseForgeClient } from "https://esm.sh/curseforge-api@1.0.2";

import type { Cache } from "../Cache.ts";

import { CLASSES } from "../common/categories.ts";
import { GAME_ID } from "../common/constants.ts";
import { mod } from "./Mod.ts";
import { NotFoundError } from "../errors.ts";

async function getModByID(
  curseForge: CurseForgeClient,
  cache: Cache,
  id: number,
) {
  if (cache.mod[id]) return cache.mod[id];

  const result = mod(await curseForge.getMod(id));

  return cache.set("mod", result.slug, result);
}

async function getModBySlug(
  curseForge: CurseForgeClient,
  cache: Cache,
  slug: string,
) {
  if (cache.mod[slug]) return cache.mod[slug];

  const { data } = await curseForge
    .searchMods(GAME_ID, { slug, classId: CLASSES.Mods });

  if (data.length === 0) {
    throw new NotFoundError(`No mod found for slug: ${slug}`);
  }

  return cache.set("mod", slug, mod(data[0]));
}

/**
 * @private Use CurseForge.getMod() instead.
 *
 * @throws {CurseForgeResponseError} when the request fails.
 *
 * @throws {NotFoundError} if the request succeeds but no mods are found.
 */
export async function getMod(
  curseForge: CurseForgeClient,
  cache: Cache,
  slugOrID: string | number,
) {
  return typeof slugOrID === "number"
    ? await getModByID(curseForge, cache, slugOrID)
    : await getModBySlug(curseForge, cache, slugOrID);
}
