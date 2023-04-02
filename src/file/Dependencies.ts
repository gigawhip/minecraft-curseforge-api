import type { CurseForgeClient } from "https://esm.sh/curseforge-api@1.0.2";

import type { Cache } from "../Cache.ts";
import type { VersionAndModLoader } from "../common/types.ts";
import type { DependencyType } from "../file/dependencyType.ts";
import type { File } from "../file/File.ts";

import { getNewestFile } from "../file/getNewestFile.ts";

type InclusionFilter = (depType: DependencyType) => boolean;

function makeInclusionFilter(
  include?: DependencyType[],
  exclude?: DependencyType[],
): InclusionFilter {
  return include
    ? (depType: DependencyType) => include.includes(depType)
    : exclude
    ? (depType: DependencyType) => !exclude.includes(depType)
    : (_: DependencyType) => true;
}

function getModIDs(
  file: File,
  shouldInclude: InclusionFilter,
  seen?: Set<number>,
): number[] {
  const result: number[] = [];

  for (const key in file.dependencies) {
    const depType = key as DependencyType;
    if (!shouldInclude(depType)) continue;

    const modIDs = file.dependencies[depType] || [];
    const filteredModIDs = seen
      ? modIDs.filter((modID) => !seen.has(modID))
      : modIDs;

    result.push(...filteredModIDs);
  }

  return result;
}

export type DependenciesOptions =
  & Required<VersionAndModLoader>
  & (
    | { include?: DependencyType[]; exclude?: never }
    | { exclude?: DependencyType[]; include?: never }
  );

export type DependencyGraphNode = {
  file: File;
  dependencies: {
    [K in DependencyType]?: {
      [modID: number]: DependencyGraphNode | null;
    };
  };
};

/**
 * When `file` is `null`, a file could not be found matching the minecraft
 * version and mod loader
 */
export type DependencyEntry = [
  modID: number,
  file: File | null,
];

export class Dependencies {
  #inclusionFilter: InclusionFilter;

  /** @private Use CurseForge.dependencies() instead. */
  constructor(
    private curseForge: CurseForgeClient,
    private cache: Cache,
    private file: File,
    private options: DependenciesOptions,
  ) {
    const { include, exclude } = options;
    this.#inclusionFilter = makeInclusionFilter(include, exclude);
  }

  async toEntries() {
    const entries: DependencyEntry[] = [];

    for await (const entry of this) {
      entries.push(entry);
    }

    return entries;
  }

  async toObject() {
    const obj: Record<number, File | null> = {};

    for await (const [modID, file] of this) {
      obj[modID] = file;
    }

    return obj;
  }

  async toMap() {
    const map = new Map<number, File | null>();

    for await (const [modID, file] of this) {
      map.set(modID, file);
    }

    return map;
  }

  async toFiles() {
    const files: File[] = [];

    for await (const [_, file] of this) {
      if (file) files.push(file);
    }

    return files;
  }

  async #graphNodesByModID(rootNode: DependencyGraphNode) {
    const filesByModID = await this.toObject();

    const nodesByModID: Record<number, DependencyGraphNode | null> = {};

    for (const key in filesByModID) {
      const modID = Number(key);
      const file = filesByModID[modID];

      nodesByModID[modID] = file && {
        file,
        dependencies: {},
      };
    }

    nodesByModID[rootNode.file.modID] = rootNode;

    return nodesByModID;
  }

  async toGraph() {
    const rootNode: DependencyGraphNode = { file: this.file, dependencies: {} };

    const nodesByModID = await this.#graphNodesByModID(rootNode);

    for (const key in nodesByModID) {
      const modID = Number(key);
      const node = nodesByModID[modID];

      if (!node) continue;

      for (const key in node.file.dependencies) {
        const depType = key as DependencyType;

        const depModIDs = node.file.dependencies[depType];
        if (!depModIDs) continue;

        if (!(depType in node.dependencies)) node.dependencies[depType] = {};

        for (const depModID of depModIDs) {
          node.dependencies[depType]![depModID] = nodesByModID[depModID];
        }
      }
    }

    return rootNode;
  }

  async *[Symbol.asyncIterator]() {
    const seen = new Set<number>();
    const queue = getModIDs(this.file, this.#inclusionFilter);
    const { cache, curseForge, options } = this;

    while (queue.length) {
      const modID = queue.shift()!;
      seen.add(modID);

      const file = await getNewestFile(curseForge, cache, modID, options);

      yield [modID, file] as DependencyEntry;

      if (file) queue.push(...getModIDs(file, this.#inclusionFilter, seen));
    }
  }
}
