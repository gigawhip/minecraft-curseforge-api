import type { File } from "../file/File.ts";
import type { Mod } from "../mod/Mod.ts";
import type { DependencyTypeName } from "../file/dependencyType.ts";

export type FileOrMod = {
  file: File;
  mod?: Mod;
} | {
  file?: File;
  mod: Mod;
};

export type IncludeOrExclude =
  | { include?: DependencyTypeName[]; exclude?: never }
  | { exclude?: DependencyTypeName[]; include?: never };
