export const FILE_STATUS_NAMES = {
  1: "Processing",
  2: "ChangesRequired",
  3: "UnderReview",
  4: "Approved",
  5: "Rejected",
  6: "MalwareDetected",
  7: "Deleted",
  8: "Archived",
  9: "Testing",
  10: "Released",
  11: "ReadyForReview",
  12: "Deprecated",
  13: "Baking",
  14: "AwaitingPublishing",
  15: "FailedPublishing",
} as const;

type T = typeof FILE_STATUS_NAMES;

export type FileStatusName = T[keyof T];
