import {
  CurseForgeClient,
  CurseForgeModLoaderType,
} from "https://esm.sh/curseforge-api@1.0.2";

import type { Cache } from "../Cache.ts";
import type { Pagination, VersionAndModLoader } from "../common/types.ts";

import { removeUndefinedProperties } from "../common/utils.ts";
import { file } from "./File.ts";

export type GetFilesOptions = Pagination & VersionAndModLoader;

/**
 * @private Use CurseForge.getFiles() instead.
 *
 * @throws {CurseForgeResponseError} when the request fails.
 */
export async function getFiles(
  curseForge: CurseForgeClient,
  cache: Cache,
  modID: number,
  options: GetFilesOptions = {},
) {
  const query = cache.queryString(modID, options);
  if (cache.files[query]) return cache.files[query];

  const { minecraftVersion, modLoader, index, pageSize } = options;

  const { pagination, data: _data } = await curseForge.getModFiles(
    modID,
    removeUndefinedProperties({
      gameVersion: minecraftVersion,
      modLoaderType: modLoader && CurseForgeModLoaderType[modLoader],
      index,
      pageSize,
    }),
  );

  const result = { pagination, data: _data.map(file) };

  cache.files[query] = result;

  return result;
}
