import type { Command } from "commander";

export interface CapturedCommandOutput {
  stdout: string[];
  stderr: string[];
}

export function prepareCommand(
  command: Command,
): CapturedCommandOutput {
  const output: CapturedCommandOutput = {
    stdout: [],
    stderr: [],
  };

  command.exitOverride();

  command.configureOutput({
    writeOut(value) {
      output.stdout.push(value);
    },

    writeErr(value) {
      output.stderr.push(value);
    },
  });

  return output;
}

export async function parseCommand(
  command: Command,
  args: string[],
): Promise<void> {
  await command.parseAsync(args, {
    from: "user",
  });
}
