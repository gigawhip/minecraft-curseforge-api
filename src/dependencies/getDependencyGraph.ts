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

export declare namespace getDependencyGraph {
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
    dependencies?: {
      [K in DependencyTypeName]?: { [ModSlug: string]: DependencyGraphNode };
    };
  };

  export type Result = Required<DependencyGraphNode>;
}

type SubGraphNodesByDepType = Exclude<
  getDependencyGraph.DependencyGraphNode["dependencies"],
  undefined
>;

function wireDependencyNodes(
  nodesBySlug: { [ModSlug: string]: getDependencyGraph.DependencyGraphNode },
  dependencies: ModSlugsByDepType,
): SubGraphNodesByDepType {
  const result: SubGraphNodesByDepType = {};

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
): Promise<getDependencyGraph.Result | undefined> {
  options.mod ??= (await getMod(curseForge, options.file!.modID))!;

  const results = await getDependenciesDeep(curseForge, options);
  if (!results) return;

  const { root, dependencyGraphNodes } = results;

  // initializing each result object so that we can wire them to each other
  const nodes: Record<string, getDependencyGraph.DependencyGraphNode> = Object
    .fromEntries(
      Object
        .entries(dependencyGraphNodes)
        .map(([slug, { mod }]) => [slug, { mod }])
        .concat([[root.mod.slug, { mod: root.mod }]]),
    );

  for (
    const { mod, file, dependencies } of Object.values(dependencyGraphNodes)
  ) {
    if (!dependencies) continue;
    nodes[mod.slug].file = file;
    nodes[mod.slug].dependencies = wireDependencyNodes(nodes, dependencies);
  }

  return {
    mod: root.mod,
    file: root.file,
    dependencies: wireDependencyNodes(nodes, root.dependencies),
  };
}
