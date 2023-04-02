export type { CurseForgeResponseErrorOptions } from "https://esm.sh/curseforge-api@1.0.2/v1/Client.js";

export { CurseForgeResponseError } from "https://esm.sh/curseforge-api@1.0.2";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileNotFoundError";
  }
}
