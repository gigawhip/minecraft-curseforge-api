# Minecraft CurseForge API

An ergonomic Deno wrapper around the NPM package [curseforge-api](https://github.com/Smiley43210/curseforge-api/), tailored just for Minecraft.

## Usage Documentation

Located in [/src/readme.md](/src/readme.md) so that it can be surfaced on the [deno.land/x/]("https://deno.land/x/minecraft_curseforge_api") page.

## Local Development

With [Deno](https://deno.land/) installed:

```sh
deno run -A example/<pick one>  # run one of the example scripts; expects a .env file
deno test -A --watch .          # run unit tests (only tests for imports)
```

You'll probably want to get a CurseForge API key [here](https://docs.curseforge.com/#authentication), then create a `.env` file that exports it as `CF_API_KEY`:

```env
# .env at the root of the repo
CF_API_KEY = ABC123DEF567
```
