import "https://deno.land/std@0.180.0/dotenv/load.ts";

const KEY = Deno.env.get("CF_API_KEY");

if (!KEY) {
  console.log("required env var: CF_API_KEY");
  Deno.exit(1);
}

export const API_KEY = KEY;
