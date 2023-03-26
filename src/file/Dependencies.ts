import type { CurseForgeClient } from "https://esm.sh/curseforge-api@1.0.2";

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

type IncludeOrExclude =
  | { include?: DependencyType[]; exclude?: never }
  | { exclude?: DependencyType[]; include?: never };

export type DependenciesOptions =
  & VersionAndModLoader
  & IncludeOrExclude
  & { file: File };

export type DependencyGraphNode = {
  file: File;
  dependencies: {
    [K in DependencyType]?: {
      [modID: number]: DependencyGraphNode | null;
    };
  };
};

export class Dependencies {
  #inclusionFilter: InclusionFilter;

  /** @private Use CurseForge.dependencies() instead. */
  constructor(
    private curseForge: CurseForgeClient,
    public readonly options: DependenciesOptions,
  ) {
    this.#inclusionFilter = makeInclusionFilter(
      options.include,
      options.exclude,
    );
  }

  async toEntries() {
    const entries: [number, File | null][] = [];

    for await (const { modID, file } of this) {
      entries.push([modID, file]);
    }

    return entries;
  }

  async toObject() {
    const obj: Record<number, File | null> = {};

    for await (const { modID, file } of this) {
      obj[modID] = file;
    }

    return obj;
  }

  async toMap() {
    const map = new Map<number, File | null>();

    for await (const { modID, file } of this) {
      map.set(modID, file);
    }

    return map;
  }

  async toFiles() {
    const files: File[] = [];

    for await (const { file } of this) {
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
    const rootNode: DependencyGraphNode = {
      file: this.options.file,
      dependencies: {},
    };

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
    const queue = getModIDs(this.options.file, this.#inclusionFilter);

    while (queue.length) {
      const modID = queue.shift()!;
      seen.add(modID);

      const file = await getNewestFile(
        this.curseForge,
        modID,
        {
          minecraftVersion: this.options.minecraftVersion,
          modLoader: this.options.modLoader,
        },
      );

      if (!file) {
        yield { modID, file: null };
        continue;
      }

      yield { modID, file };

      queue.push(...getModIDs(file, this.#inclusionFilter, seen));
    }
  }
}
