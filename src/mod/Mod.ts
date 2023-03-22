import type { CurseForgeMod } from "https://esm.sh/curseforge-api@1.0.2";

import type { ModCategoryName } from "../common/categories.ts";

import { MOD_STATUS_NAMES, ModStatusName } from "./modStatus.ts";

export type Mod = {
  id: number;
  name: string;
  slug: string;
  summary: string;
  links: {
    websiteUrl?: string;
    wikiUrl?: string;
    issuesUrl?: string;
    sourceUrl?: string;
  };
  status: ModStatusName;
  downloadCount: number;
  isFeatured: boolean;
  primaryCategory: ModCategoryName;
  categories: ModCategoryName[];
  authors: Array<{
    id: number;
    name: string;
    url: string;
  }>;
  logo: {
    url: string;
    thumbnailUrl: string;
  };
  screenshots: Array<{
    url: string;
    thumbnailUrl: string;
  }>;
  date: {
    created: Date;
    modified: Date;
    released: Date;
  };
  allowModDistribution?: boolean;
  isAvailable: boolean;
};

export function mod({
  id,
  name,
  slug,
  summary,
  links,
  status,
  downloadCount,
  isFeatured,
  primaryCategoryId,
  categories,
  authors,
  logo,
  screenshots,
  dateCreated,
  dateModified,
  dateReleased,
  allowModDistribution,
  isAvailable,
}: CurseForgeMod): Mod {
  const mod: Mod = {
    id,
    name,
    slug,
    summary,
    links: Object.fromEntries(
      Object.entries(links)
        .filter(([_, url]) => url),
    ),
    status: MOD_STATUS_NAMES[status],
    downloadCount,
    isFeatured,
    primaryCategory: categories.find((cat) => cat.id === primaryCategoryId)!
      .name as ModCategoryName,
    categories: categories.map((cat) => cat.name as ModCategoryName),
    authors,
    logo: {
      thumbnailUrl: logo.thumbnailUrl,
      url: logo.url,
    },
    screenshots: screenshots
      .map(({ thumbnailUrl, url }) => ({ thumbnailUrl, url })),
    date: {
      created: dateCreated,
      modified: dateModified,
      released: dateReleased,
    },
    isAvailable,
  };

  if (allowModDistribution !== undefined) {
    mod.allowModDistribution = allowModDistribution;
  }

  return mod;
}
