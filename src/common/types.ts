import type { File } from "../file/File.ts";
import type { Mod } from "../mod/Mod.ts";
import type { MinecraftVersion } from "./minecraftVersion.ts";
import type { ModLoader } from "./modLoader.ts";

export type VersionAndModLoader = {
  minecraftVersion?: MinecraftVersion;
  modLoader?: ModLoader;
};

export type Pagination = {
  index?: number;
  pageSize?: number;
};

export type FileOrMod = {
  file: File;
  mod?: Mod;
} | {
  file?: File;
  mod: Mod;
};
