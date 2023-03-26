# Minecraft CurseForge API

[![deno module](https://shield.deno.dev/x/minecraft_curseforge_api)](https://deno.land/x/minecraft_curseforge_api)

An ergonomic Deno wrapper around the NPM package [curseforge-api](https://github.com/Smiley43210/curseforge-api/), tailored just for Minecraft.

## Usage Documentation

Located in [/src/readme.md](/src/readme.md) so that it can be surfaced on the [deno.land/x/](https://deno.land/x/minecraft_curseforge_api) page.

## Local Development

With [Deno](https://deno.land/) installed:

```sh
deno run -A example/<pick one>  # expects a .env file

deno test -A # run unit tests (only tests that imports are correct, no network)

deno run -A scripts/runAllExamples.ts # expects a .env file
deno run -A scripts/createReleaseNotes.ts # generated from git history
deno run -A scripts/bumpVersion.ts <semver> # bump version in all files
```

You'll probably want to get a CurseForge API key [here](https://docs.curseforge.com/#authentication), then create a `.env` file that exports it as `CF_API_KEY`:

```env
# .env at the root of the repo
CF_API_KEY = ABC123DEF567
```
