import type { CurseForgeClient } from "https://esm.sh/curseforge-api@1.0.2";

import type { VersionAndModLoader } from "../common/types.ts";
import type { DependencyTypeName } from "../file/dependencyType.ts";
import type { File } from "../file/File.ts";
import type { Mod } from "../mod/Mod.ts";
import type {
  FileOrMod,
  IncludeOrExclude,
  ModSlugsByDepType,
} from "./types.ts";

import { getNewestFile } from "../file/getNewestFile.ts";
import { getMod } from "../mod/getMod.ts";

type DependencyEntries = Array<[DependencyTypeName, number[]]>;

type RawNodesByModID = Record<number, {
  mod: Mod;
  file?: File;
  depEntries?: DependencyEntries;
}>;

export declare namespace getDependenciesDeep {
  export type Options =
    & Required<VersionAndModLoader>
    & FileOrMod
    & IncludeOrExclude;

  export type DependencyGraphNode = {
    mod: Mod;
    /**
     * When `undefined` or omitted, a file could not be found for the specified
     * Minecraft version and mod loader
     */
    file?: File;
    /**
     * When `undefined` or omitted, a file could not be found for the specified
     * Minecraft version and mod loader
     */
    dependencies?: ModSlugsByDepType;
  };

  export type DependencyDict = {
    [ModSlug: string]: DependencyGraphNode;
  };

  export type Result = {
    root: Required<DependencyGraphNode>;
    dependencyGraphNodes: DependencyDict;
  };
}

function makeInclusionFilter(
  include?: DependencyTypeName[],
  exclude?: DependencyTypeName[],
) {
  return include
    ? ([depType]: [DependencyTypeName, number[]]) => include.includes(depType)
    : exclude
    ? ([depType]: [DependencyTypeName, number[]]) => !exclude.includes(depType)
    : (_: [DependencyTypeName, number[]]) => true;
}

function getModIDs(depEntries: DependencyEntries): number[] {
  return depEntries.map(([_, modIDs]) => modIDs).flat();
}

function getDepEntries(
  file: File,
  shouldInclude: ([depType]: [DependencyTypeName, number[]]) => boolean,
): DependencyEntries {
  const entries = Object.entries(file.dependencies) as DependencyEntries;

  return entries.filter(shouldInclude);
}

async function getNodesByModID(
  rootMod: Mod,
  rootFile: File,
  rootDepEntries: DependencyEntries,
  curseForge: CurseForgeClient,
  shouldInclude: ([depType]: [DependencyTypeName, number[]]) => boolean,
  { minecraftVersion, modLoader }: VersionAndModLoader,
) {
  const nodesByModID: RawNodesByModID = {
    [rootMod.id]: { mod: rootMod, file: rootFile, depEntries: rootDepEntries },
  };

  const depModIDs = getModIDs(rootDepEntries);

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

    const depEntries = getDepEntries(file, shouldInclude);
    depModIDs.push(...getModIDs(depEntries));

    nodesByModID[mod.id] = { mod, file, depEntries };
  }

  return nodesByModID;
}

function makeDependencies(
  entries: DependencyEntries,
  nodesByModID: RawNodesByModID,
) {
  return Object.fromEntries(entries
    .map(([depType, modIDs]) => [
      depType,
      modIDs.map((modID) => nodesByModID[modID].mod.slug),
    ]));
}

function getDependencyGraphNodes(nodesByModID: RawNodesByModID, rootMod: Mod) {
  const dependencyGraphNodes: getDependenciesDeep.DependencyDict = {};

  const nonRootRawNodes = Object
    .values(nodesByModID)
    .filter((node) => node.mod.id !== rootMod.id);

  for (const { mod, file, depEntries } of nonRootRawNodes) {
    dependencyGraphNodes[mod.slug] = { mod };

    if (!file) continue;
    dependencyGraphNodes[mod.slug].file = file;

    dependencyGraphNodes[mod.slug]
      .dependencies = makeDependencies(depEntries!, nodesByModID);
  }

  return dependencyGraphNodes;
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
  { file, mod, minecraftVersion, modLoader, include, exclude }:
    getDependenciesDeep.Options,
): Promise<getDependenciesDeep.Result | undefined> {
  if (mod && file && mod.id !== file.modID) return;

  mod ??= (await getMod(curseForge, file!.modID))!;

  file ??= await getNewestFile(curseForge, mod.id, {
    minecraftVersion,
    modLoader,
  });

  if (!file) return;

  const shouldInclude = makeInclusionFilter(include, exclude);
  const rootDepEntries = getDepEntries(file, shouldInclude);

  const nodesByModID = await getNodesByModID(
    mod,
    file,
    rootDepEntries,
    curseForge,
    shouldInclude,
    { minecraftVersion, modLoader },
  );

  return {
    root: {
      mod,
      file,
      dependencies: makeDependencies(rootDepEntries!, nodesByModID),
    },
    dependencyGraphNodes: getDependencyGraphNodes(nodesByModID, mod),
  };
}
