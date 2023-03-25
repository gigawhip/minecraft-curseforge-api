import { CurseForge } from "../src/mod.ts";
import { API_KEY } from "./utils/apiKey.ts";

const slug = "quark";
const minecraftVersion = "1.19.2";
const modLoader = "Forge";

const curseForge = await new CurseForge(API_KEY);
const mod = await curseForge.getMod(slug);

if (!mod) {
  console.log(`Couldn't find a mod with slug "${slug}"`);
  Deno.exit(1);
}

const file = await curseForge.getNewestFile(
  mod.id,
  { minecraftVersion, modLoader },
);

if (!file) {
  console.log(
    `Couldn't find a file for ${mod.name}} (${minecraftVersion} ${modLoader})`,
  );
  Deno.exit(1);
}

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
  await curseForge
    .dependencies({ file, minecraftVersion, modLoader })
    .toMap(),
);

logDeps(
  "include required",
  await curseForge
    .dependencies({ file, minecraftVersion, modLoader, include: ["required"] })
    .toMap(),
);

logDeps(
  "exclude required",
  await curseForge
    .dependencies({ file, minecraftVersion, modLoader, exclude: ["required"] })
    .toMap(),
);
