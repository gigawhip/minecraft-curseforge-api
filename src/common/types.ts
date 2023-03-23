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
