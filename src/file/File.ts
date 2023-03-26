import type { CurseForgeFile } from "https://esm.sh/curseforge-api@1.0.2";

import {
  isMinecraftVersion,
  MinecraftVersion,
} from "../common/minecraftVersion.ts";
import { isModLoader, ModLoader } from "../common/modLoader.ts";
import { DEPENDENCY_TYPES, DependencyType } from "./dependencyType.ts";
import { FILE_STATUSES, FileStatus } from "./fileStatus.ts";
import { RELEASE_TYPES, ReleaseType } from "./release.ts";

export type File = {
  id: number;
  modID: number;
  isAvailable: boolean;
  /** The name that appears in the CurseForge UI */
  displayName: string;
  /** The name of the file on the file system */
  fileName: string;
  date: Date;
  /** number of bytes */
  length: number;
  downloadCount: number;
  downloadUrl: string;
  modLoaders: ModLoader[];
  minecraftVersions: MinecraftVersion[];
  client?: true;
  server?: true;
  fileFingerprint: number;
  /** Maps dependency types to modIDs. */
  dependencies: { [K in DependencyType]?: number[] };
  hashes: { sha1: string; md5: string };
  releaseType: ReleaseType;
  fileStatus: FileStatus;
  modules: Record<string, number>;
};

export function file(
  {
    id,
    modId,
    isAvailable,
    dependencies,
    displayName,
    downloadCount,
    downloadUrl,
    fileName,
    fileDate: date,
    fileLength: length,
    fileFingerprint,
    releaseType,
    fileStatus,
    gameVersions,
    hashes,
    modules,
  }: CurseForgeFile,
): File {
  const file: File = {
    id,
    modID: modId,
    displayName,
    fileName,
    date,
    isAvailable,
    downloadCount,
    downloadUrl,
    length,
    fileFingerprint,
    hashes: { sha1: hashes[0].value, md5: hashes[1].value },
    releaseType: RELEASE_TYPES[releaseType],
    dependencies: dependencies.reduce((depMap, { modId, relationType }) => {
      const relationTypeName = DEPENDENCY_TYPES[relationType];

      if (!(relationTypeName in depMap)) depMap[relationTypeName] = [];

      depMap[relationTypeName]?.push(modId);

      return depMap;
    }, {} as File["dependencies"]),
    fileStatus: FILE_STATUSES[fileStatus],
    modules: Object.fromEntries(modules.map((m) => [m.name, m.fingerprint])),
    minecraftVersions: gameVersions.filter(isMinecraftVersion),
    modLoaders: gameVersions.filter(isModLoader) || ["Any"],
  };

  if (gameVersions.includes("Client")) file.client = true;
  if (gameVersions.includes("Server")) file.server = true;

  return file;
}
