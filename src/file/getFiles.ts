import {
  CurseForgeClient,
  CurseForgeModLoaderType,
} from "https://esm.sh/curseforge-api@1.0.2";

import type { Pagination, VersionAndModLoader } from "../common/types.ts";

import { removeUndefinedProperties } from "../common/utils.ts";
import { file } from "./File.ts";

export type GetFilesOptions = Pagination & VersionAndModLoader;

/** @private Use CurseForge.getFiles() instead. */
export async function getFiles(
  curseForge: CurseForgeClient,
  modID: number,
  options: GetFilesOptions = {},
) {
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

  return { pagination, data: _data.map(file) };
}
