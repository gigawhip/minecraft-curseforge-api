import type { CurseForgeMod } from "https://esm.sh/curseforge-api@1.0.2";

import type { ModCategory } from "../common/categories.ts";

import { MOD_STATUSES, ModStatus } from "./modStatus.ts";

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
  status: ModStatus;
  downloadCount: number;
  isFeatured: boolean;
  primaryCategory: ModCategory;
  categories: ModCategory[];
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
    status: MOD_STATUSES[status],
    downloadCount,
    isFeatured,
    primaryCategory: categories.find((cat) => cat.id === primaryCategoryId)!
      .name as ModCategory,
    categories: categories.map((cat) => cat.name as ModCategory),
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
