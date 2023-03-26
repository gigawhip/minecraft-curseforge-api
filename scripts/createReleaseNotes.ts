import clipboard from "https://deno.land/x/clipboard@v0.0.2/mod.ts";

import { cmd } from "./utils/cmd.ts";

const EXCLUDE_TYPES = ["chore", "refactor"];

const mostRecentTag = await cmd("git describe --tags --abbrev=0");

const commits = await cmd(`git log ${mostRecentTag}..HEAD --oneline`)
  .then((output) =>
    output.split("\n")
      .map((line) => {
        const [hash, type] = line.split(" ", 2);

        return { hash, type: type.substring(0, type.length - 1) };
      })
  );

type CommitDescription = {
  hash: string;
  type: string;
  subject: string;
  body: string;
  breakingChange: boolean;
};

const commitDescriptions = await Promise.all(
  commits
    .filter(({ type }) => !EXCLUDE_TYPES.includes(type))
    .map(({ hash }) =>
      cmd(`git log -1 --pretty=%B ${hash}`)
        .then<CommitDescription>((message) => {
          const [firstLine, ...otherLines] = message.split("\n");
          let [type, subject] = firstLine.split(": ", 2);
          const body = otherLines.filter((line) => line).join("\n");
          let breakingChange = false;

          if (type.endsWith("!")) {
            breakingChange = true;
            type = type.substring(0, type.length - 1);
          }

          return { hash, type, subject, body, breakingChange };
        })
    ),
);

function asListItem(
  { hash, subject, body, breakingChange }: CommitDescription,
) {
  let markdown = "* ";

  if (breakingChange) markdown += "**Breaking Change**: ";

  markdown += `${subject} (${hash})`;

  if (body) {
    markdown += `\n\n  ${body}`;
  }

  return markdown;
}

function asUnorderedList(commitDescriptions: CommitDescription[]) {
  return commitDescriptions.map(asListItem).join("\n\n");
}

const features = commitDescriptions
  .filter(({ type }) => type === "feat")
  .sort((a) => a.breakingChange ? -1 : 1);

const fixes = commitDescriptions
  .filter(({ type }) => type === "fix")
  .sort((a) => a.breakingChange ? -1 : 1);

const markdown = `## Features

${asUnorderedList(features)}

## Fixes

${asUnorderedList(fixes)}
`;

clipboard.writeText(markdown);
console.log(`Release notes copied to clipboard.`);
