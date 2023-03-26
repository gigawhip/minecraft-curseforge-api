/** Run a terminal command then return stdout, trimmed, as a string. */
export async function cmd(command: string): Promise<string> {
  return await Deno.run({ cmd: command.split(" "), stdout: "piped" })
    .output()
    .then((output) => new TextDecoder().decode(output).trim());
}
