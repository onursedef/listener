import {
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import {
  dirname,
  join,
} from "node:path";

import type {
  AgentTarget,
  InstallationPreset,
} from "./option-parsers.ts";
import {
  selectPolicyModules,
  type PolicyModule,
} from "./policy-catalog.ts";

const START = "<!-- listener:start -->";
const END = "<!-- listener:end -->";

export interface GenerateInstructionsInput {
  cwd: string;
  agents: readonly AgentTarget[];
  preset: InstallationPreset;
  modules: readonly string[];
  integrations: readonly string[];
  dryRun: boolean;
  force: boolean;
}

export interface GenerationResult {
  preset: InstallationPreset;
  modules: string[];
  files: string[];
  dryRun: boolean;
}

export async function generateInstructions(
  input: GenerateInstructionsInput,
): Promise<GenerationResult> {
  const selected = selectPolicyModules(
    input.preset,
    input.integrations.length > 0
      ? [...input.modules, "tool-plugins"]
      : input.modules,
  );
  const writes = new Map<string, string>();

  for (const module of selected) {
    writes.set(modulePath(input.cwd, module), renderModule(module));
  }

  for (const agent of input.agents) {
    const target = agentInstructionPath(input.cwd, agent);
    writes.set(target, await mergeManagedSection(
      target,
      renderAgentInstructions(input.preset, selected, input.integrations),
    ));
  }

  const files = [...writes.keys()].sort();
  if (!input.dryRun) {
    for (const [path, content] of writes) {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, content, "utf8");
    }
  }

  return {
    preset: input.preset,
    modules: selected.map((module) => module.name),
    files,
    dryRun: input.dryRun,
  };
}

function modulePath(cwd: string, module: PolicyModule): string {
  if (module.kind === "skill") {
    return join(cwd, ".agents", "skills", module.name, "SKILL.md");
  }

  return join(cwd, ".agents", `${module.kind}s`, `${module.name}.md`);
}

function renderModule(module: PolicyModule): string {
  if (module.kind !== "skill") {
    return `${module.content.trim()}\n`;
  }

  return `---\nname: ${module.name}\ndescription: ${module.description}\n---\n\n${module.content.trim()}\n`;
}

function agentInstructionPath(cwd: string, agent: AgentTarget): string {
  switch (agent) {
    case "claude":
      return join(cwd, "CLAUDE.md");
    case "cursor":
      return join(cwd, ".cursor", "rules", "listener.mdc");
    case "gemini":
      return join(cwd, "GEMINI.md");
    case "codex":
    case "generic":
      return join(cwd, "AGENTS.md");
  }
}

function renderAgentInstructions(
  preset: InstallationPreset,
  modules: readonly PolicyModule[],
  integrations: readonly string[],
): string {
  const grouped = new Map<string, PolicyModule[]>();
  for (const module of modules) {
    const entries = grouped.get(module.kind) ?? [];
    entries.push(module);
    grouped.set(module.kind, entries);
  }

  const sections = ["rule", "hook", "skill", "plugin"].flatMap((kind) => {
    const entries = grouped.get(kind) ?? [];
    if (entries.length === 0) return [];
    return [
      `## ${kind[0]!.toUpperCase()}${kind.slice(1)}s`,
      ...entries.map((module) => `- \`${relativeModulePath(module)}\`: ${module.description}`),
    ].join("\n");
  });

  const selectedIntegrations = integrations.length === 0
    ? "none"
    : integrations.map((value) => `\`${value}\``).join(", ");

  return `${START}
# Listener agent contract

Preset: **${preset}**. Selected integrations: ${selectedIntegrations}.

## Mandatory enforcement

1. Before every task, read every enabled rule and hook listed below.
2. Run pre-task hook before edits and completion hook before final response.
3. Inspect every enabled skill description; read full SKILL.md and use every applicable skill. Explicitly named skills are mandatory.
4. Inspect selected plugin capabilities. Use them when installed, relevant, callable, and permitted. Missing tools trigger documented fallback, never fabricated usage.
5. Re-run selection when scope changes. Higher-precedence instructions win conflicts; never silently combine conflicts.
6. Do not use GitNexus unless user selected it and GitNexus tools are currently available.

${sections.join("\n\n")}
${END}`;
}

function relativeModulePath(module: PolicyModule): string {
  if (module.kind === "skill") {
    return `.agents/skills/${module.name}/SKILL.md`;
  }
  return `.agents/${module.kind}s/${module.name}.md`;
}

async function mergeManagedSection(
  path: string,
  managed: string,
): Promise<string> {
  let current = "";
  try {
    current = await readFile(path, "utf8");
  } catch (error) {
    if (!isMissingFile(error)) throw error;
  }

  const start = current.indexOf(START);
  const end = current.indexOf(END);
  if (start >= 0 && end >= start) {
    return `${current.slice(0, start)}${managed}${current.slice(end + END.length)}`;
  }

  if (current.trim()) {
    return `${current.trimEnd()}\n\n${managed}\n`;
  }

  return `${managed}\n`;
}

function isMissingFile(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
