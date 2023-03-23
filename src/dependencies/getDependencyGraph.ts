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

import { getMod } from "../mod/getMod.ts";
import { getDependenciesDeep } from "./getDependenciesDeep.ts";

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
   *
   * @example
   * { required: {
   *    someModSlug: { mod: ..., file: ..., dependencies: {} }
   * } }
   */
  dependencies?: Partial<
    Record<
      DependencyTypeName,
      Record<string, DependencyGraphNode>
    >
  >;
};

/** Indexed by mod slug */
type NormalizedGraph = Record<string, DependencyGraphNode>;

export declare namespace getDependencyGraph {
  export type Options =
    & Required<VersionAndModLoader>
    & FileOrMod
    & IncludeOrExclude;
}

function wireDependencyNodes(
  nodesBySlug: NormalizedGraph,
  dependencies: ModSlugsByDepType,
): DependencyGraphNode["dependencies"] {
  const result: DependencyGraphNode["dependencies"] = {};

  const entries = Object
    .entries(dependencies) as Array<[DependencyTypeName, string[]]>;

  for (const [depType, modSlugs] of entries) {
    result[depType] = Object.fromEntries(
      modSlugs
        .map((slug) => [slug, nodesBySlug[slug]]),
    );
  }

  return result;
}

/**
 * @private Use CurseForge.getDependencyGraph() instead.
 *
 * Constructs a complete dependency graph. Unlike
 * `getDependenciesDeep()`, the returned data structure may contain
 * circular references and so cannot be safely serialized or iterated over.
 *
 * Dependency graphs require both `File` and `Mod` objects - it is advisable to
 * provide both, otherwise one will be retrieved using information from the
 * other.
 *
 * @returns `undefined` if an appropriate file cannot be found for your mod loader and Minecraft version, or if both `File` and `Mod` are provided but their mod IDs don't match.
 */
export async function getDependencyGraph(
  curseForge: CurseForgeClient,
  options: getDependencyGraph.Options,
) {
  options.mod ??= (await getMod(curseForge, options.file!.modID))!;

  const dependencyDict = await getDependenciesDeep(curseForge, options);
  if (!dependencyDict) return;

  // initializing each result object so that we can wire them to each other
  const result: Record<string, DependencyGraphNode> = Object
    .fromEntries(
      Object.entries(dependencyDict).map(([slug, { mod }]) => [slug, { mod }]),
    );

  for (const { mod, file, dependencies } of Object.values(dependencyDict)) {
    if (!dependencies) continue;
    result[mod.slug].file = file;

    result[mod.slug].dependencies = wireDependencyNodes(result, dependencies);
  }

  const rootNode = result[options.mod.slug];

  return rootNode as Required<DependencyGraphNode>;
}
