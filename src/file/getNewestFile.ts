import type { CurseForgeClient } from "https://esm.sh/curseforge-api@1.0.2";

import type { Cache } from "../Cache.ts";
import type { VersionAndModLoader } from "../common/types.ts";

import { NotFoundError } from "../errors.ts";
import { getFiles } from "./getFiles.ts";

export type GetNewestFileOptions = VersionAndModLoader;

/**
 * @private Use CurseForge.getNewestFile() instead.
 *
 * @throws {CurseForgeResponseError} when the request fails.
 *
 * @throws {NotFoundError} if the request succeeds but no files are found.
 */
export async function getNewestFile(
  curseForge: CurseForgeClient,
  cache: Cache,
  modID: number,
  options?: GetNewestFileOptions,
) {
  const query = cache.queryString(modID, options);
  if (cache.newestFile[query]) return cache.newestFile[query];

  const { data } = await getFiles(curseForge, cache, modID, options);

  if (data.length === 0) {
    throw new NotFoundError(`No files found for query: ${query}`);
  }

  return cache.set("newestFile", query, data[0]);
}
