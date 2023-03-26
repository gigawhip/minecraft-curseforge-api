import type { CurseForgeClient } from "https://esm.sh/curseforge-api@1.0.2";

import type { Cache } from "../Cache.ts";
import type { VersionAndModLoader } from "../common/types.ts";

import { getFiles } from "./getFiles.ts";

export type GetNewestFileOptions = VersionAndModLoader;

/** @private Use CurseForge.getNewestFile() instead. */
export async function getNewestFile(
  curseForge: CurseForgeClient,
  cache: Cache,
  modID: number,
  options?: GetNewestFileOptions,
) {
  const query = cache.queryString(modID, options);
  if (cache.newestFile[query]) return cache.newestFile[query];

  const { data } = await getFiles(curseForge, cache, modID, options);

  if (data.length === 0) return null;

  const result = data[0];

  cache.newestFile[query] = result;

  return result;
}
