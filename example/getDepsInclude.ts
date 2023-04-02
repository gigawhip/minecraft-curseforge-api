import { CurseForge } from "../src/mod.ts";
import { API_KEY } from "./utils/apiKey.ts";

const slug = "quark";
const minecraftVersion = "1.19.2";
const modLoader = "Forge";
const options = { minecraftVersion, modLoader } as const;

const curseForge = new CurseForge(API_KEY, options);
const mod = await curseForge.getMod(slug);
const file = await curseForge.getNewestFile(mod.id);

function logDeps(msg: string, depMap: Map<number, CurseForge.File | null>) {
  console.log(
    msg,
    [...depMap.values()]
      .filter((file): file is CurseForge.File => file !== null)
      .map((file) => file!.displayName),
  );
}

logDeps(
  "all deps",
  await curseForge.dependencies(file).toMap(),
);

logDeps(
  "include required",
  await curseForge.dependencies(file, { include: ["required"] }).toMap(),
);

logDeps(
  "exclude required",
  await curseForge.dependencies(file, { exclude: ["required"] }).toMap(),
);
