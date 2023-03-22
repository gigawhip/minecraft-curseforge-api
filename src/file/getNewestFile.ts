import type { CurseForgeClient } from "https://esm.sh/curseforge-api@1.0.2";

import type { VersionAndModLoader } from "../common/types.ts";

import { getFiles } from "./getFiles.ts";

export declare namespace getNewestFile {
  export type Options = VersionAndModLoader;
}

/** @private Use CurseForge.getNewestFile() instead. */
export async function getNewestFile(
  curseForge: CurseForgeClient,
  modID: number,
  options?: getNewestFile.Options,
) {
  const result = await getFiles(curseForge, modID, options);

  if (result.data.length === 0) return;

  return result.data[0];
}
