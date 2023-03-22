export const MOD_LOADERS = [
  "Any",
  "Forge",
  "Cauldron",
  "LiteLoader",
  "Fabric",
  "Quilt",
] as const;

export type ModLoader = typeof MOD_LOADERS[number];

export function isModLoader(input: unknown): input is ModLoader {
  return MOD_LOADERS.includes(input as ModLoader);
}
