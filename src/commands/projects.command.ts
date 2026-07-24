import { Command } from "commander";

import type { CommandContext } from "../core/command-context.ts";
import {
  handleProjectsAdd,
  handleProjectsList,
  handleProjectsRemove,
  type ProjectsAddOptions,
  type ProjectsListOptions,
  type ProjectsRemoveOptions,
} from "../handlers/projects.handler.ts";

export function createProjectsCommand(
  context: CommandContext,
): Command {
  const projects = new Command("projects")
    .description(
      "Manage projects registered with a global installation.",
    );

  projects
    .command("list")
    .description("List registered projects.")
    .option(
      "--json",
      "Print machine-readable output.",
      false,
    )
    .action(async (options: ProjectsListOptions) => {
      await handleProjectsList(context, options);
    });

  projects
    .command("add")
    .description("Register a project.")
    .argument("<path>", "Project directory.")
    .option(
      "--name <name>",
      "Optional project display name.",
    )
    .action(
      async (
        projectPath: string,
        options: ProjectsAddOptions,
      ) => {
        await handleProjectsAdd(
          context,
          projectPath,
          options,
        );
      },
    );

  projects
    .command("remove")
    .alias("rm")
    .description("Remove a project from the registry.")
    .argument("<path>", "Registered project directory.")
    .option(
      "-y, --yes",
      "Skip confirmation.",
      false,
    )
    .action(
      async (
        projectPath: string,
        options: ProjectsRemoveOptions,
      ) => {
        await handleProjectsRemove(
          context,
          projectPath,
          options,
        );
      },
    );

  return projects;
}
