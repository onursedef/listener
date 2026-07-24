import type { CommandContext } from "../core/command-context.ts";

export interface ProjectsListOptions {
  json: boolean;
}

export interface ProjectsAddOptions {
  name?: string;
}

export interface ProjectsRemoveOptions {
  yes: boolean;
}

export async function handleProjectsList(
  context: CommandContext,
  options: ProjectsListOptions,
): Promise<void> {
  context.logger.info(
    JSON.stringify(
      {
        command: "projects:list",
        options,
      },
      null,
      2,
    ),
  );
}

export async function handleProjectsAdd(
  context: CommandContext,
  projectPath: string,
  options: ProjectsAddOptions,
): Promise<void> {
  context.logger.info(
    JSON.stringify(
      {
        command: "projects:add",
        projectPath,
        options,
      },
      null,
      2,
    ),
  );
}

export async function handleProjectsRemove(
  context: CommandContext,
  projectPath: string,
  options: ProjectsRemoveOptions,
): Promise<void> {
  context.logger.info(
    JSON.stringify(
      {
        command: "projects:remove",
        projectPath,
        options,
      },
      null,
      2,
    ),
  );
}
