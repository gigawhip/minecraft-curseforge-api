export const DEPENDENCY_TYPES = {
  1: "embeddedLibrary",
  2: "optional",
  3: "required",
  4: "tool",
  5: "incompatible",
  6: "include",
} as const;

type T = typeof DEPENDENCY_TYPES;

export type DependencyType = T[keyof T];
