import { CurseForgeClient } from "https://esm.sh/curseforge-api@1.0.2";

import { API_KEY } from "./utils/apiKey.ts";
import { getWorldCategories } from "../src/common/categories.ts";

const client = new CurseForgeClient(API_KEY);

console.log(await getWorldCategories(client));
