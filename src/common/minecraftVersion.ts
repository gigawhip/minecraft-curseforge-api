export type MinecraftVersion =
  | `${number}.${number}`
  | `${number}.${number}-${string}`
  | `${number}.${number}.${number}`;

export const MINECRAFT_VERSION_PATTERN = /^\d+\.\d+/;

export function isMinecraftVersion(input: string): input is MinecraftVersion {
  return MINECRAFT_VERSION_PATTERN.test(input);
}
