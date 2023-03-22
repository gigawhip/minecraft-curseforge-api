import type { CurseForgeClient } from "https://esm.sh/curseforge-api@1.0.2";

import type { FileOrMod, VersionAndModLoader } from "../common/types.ts";
import type { File } from "../file/File.ts";
import type { Mod } from "../mod/Mod.ts";
import type { DependencyTypeName } from "./dependencyType.ts";

import { getNewestFile } from "../file/getNewestFile.ts";
import { getMod } from "../mod/getMod.ts";

export type DependencyDict = {
  [ModSlug: string]: {
    mod: Mod;
    /**
     * When `undefined` or omitted, a file could not be found for the specified
     * Minecraft version and mod loader
     */
    file?: File;
    /**
     * Maps dependency types (like "required") to an array of mod slugs.
     *
     * When `undefined` or omitted, a file could not be found for the specified
     * Minecraft version and mod loader
     */
    dependencies?: Partial<Record<DependencyTypeName, string[]>>;
  };
};

export declare namespace getDependenciesDeep {
  export type Options = Required<VersionAndModLoader> & FileOrMod;
}

/**
 * @private Use CurseForge.getDependenciesDeep() instead.
 *
 * Constructs a complete dependency graph in a normalized structure, which has
 * no circular references and so can be safely serialized and iterated over.
 *
 * Dependency graphs require both `File` and `Mod` objects - it is advisable to
 * provide both, otherwise one will be retrieved using information from the
 * other.
 *
 * @returns `undefined` if an appropriate file cannot be found for your mod loader and Minecraft version, or if both `File` and `Mod` are provided but their mod IDs don't match.
 */
export async function getDependenciesDeep(
  curseForge: CurseForgeClient,
  { file, mod, minecraftVersion, modLoader }: getDependenciesDeep.Options,
) {
  if (mod && file && mod.id !== file.modID) return;

  mod ??= (await getMod(curseForge, file!.modID))!;

  file ??= await getNewestFile(curseForge, mod.id, {
    minecraftVersion,
    modLoader,
  });

  if (!file) return;

  const nodesByModID: Record<number, { mod: Mod; file?: File }> = {
    [mod.id]: { mod, file },
  };

  const depModIDs = Object.values(file.dependencies).flat();

  while (depModIDs.length) {
    const modID = depModIDs.shift()!;

    if (modID in nodesByModID) continue; // prevent circular lookups

    const mod = (await getMod(curseForge, modID))!;
    const file = await getNewestFile(curseForge, mod.id, {
      minecraftVersion,
      modLoader,
    });

    if (!file) {
      nodesByModID[mod.id] = { mod };
      continue;
    }

    depModIDs.push(...Object.values(file.dependencies).flat());

    nodesByModID[mod.id] = { mod, file };
  }

  const result: DependencyDict = {};

  for (const { mod, file } of Object.values(nodesByModID)) {
    result[mod.slug] = { mod };

    if (!file) continue;
    result[mod.slug].file = file;

    result[mod.slug].dependencies = Object
      .fromEntries(
        Object
          .entries(file.dependencies)
          .map(([depType, modIDs]) => [
            depType,
            modIDs!.map((modID) => nodesByModID[modID].mod.slug),
          ]),
      );
  }

  return result;
}
