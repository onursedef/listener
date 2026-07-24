import { Command } from "commander";

import type { CommandContext } from "../core/command-context.ts";
import {
  handleDoctor,
  type DoctorOptions,
} from "../handlers/doctor.handler.ts";

export function createDoctorCommand(
  context: CommandContext,
): Command {
  return new Command("doctor")
    .description(
      "Diagnose installation, configuration, and integration issues.",
    )
    .option(
      "--cwd <path>",
      "Repository or working directory.",
    )
    .option(
      "--global",
      "Check the global installation.",
      false,
    )
    .option(
      "--json",
      "Print machine-readable output.",
      false,
    )
    .option(
      "--fix",
      "Repair safe, deterministic problems.",
      false,
    )
    .action(async (options: DoctorOptions) => {
      await handleDoctor(context, options);
    });
}
