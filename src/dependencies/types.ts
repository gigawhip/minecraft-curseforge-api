import type { File } from "../file/File.ts";
import type { Mod } from "../mod/Mod.ts";

export type FileOrMod = {
  file: File;
  mod?: Mod;
} | {
  file?: File;
  mod: Mod;
};
