const EXAMPLES_DIR = `${Deno.cwd()}/example`;

for (const entry of Deno.readDirSync(EXAMPLES_DIR)) {
  if (entry.isFile) {
    const filePath = `${EXAMPLES_DIR}/${entry.name}`;

    const process = Deno.run({
      cmd: ["deno", "run", "-A", filePath],
      stdout: "piped",
    });

    const status = await process.status();

    if (!status.success) {
      console.error(`FAIL: ${filePath}`);
    } else {
      console.log(`SUCCESS: ${filePath}`);
    }
  }
}
