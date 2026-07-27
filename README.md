<div align="center">

# Listener

Generate enforceable agent rules, hooks, skills, and plugin policies from one CLI.

[![npm version](https://img.shields.io/npm/v/@irukaga/listener?style=flat-square)](https://www.npmjs.com/package/@irukaga/listener)
[![Bun](https://img.shields.io/badge/runtime-Bun-f9f1e1?style=flat-square&logo=bun)](https://bun.sh)
[![License](https://img.shields.io/npm/l/@irukaga/listener?style=flat-square)](LICENSE)

</div>

## What Listener generates

Listener turns selected policy presets into agent-readable files:

```text
AGENTS.md                         # mandatory contract and policy registry
.agents/rules/*.md               # always-on behavior and safety rules
.agents/hooks/*.md               # pre-task and completion gates
.agents/skills/*/SKILL.md        # trigger-based workflows
.agents/plugins/*.md             # availability-gated integrations
```

Supported instruction targets:

| Target | Generated instruction file |
| --- | --- |
| Codex | `AGENTS.md` |
| Claude Code | `CLAUDE.md` |
| Gemini CLI | `GEMINI.md` |
| Cursor | `.cursor/rules/listener.mdc` |
| Generic | `AGENTS.md` |

Existing instruction content remains intact. Listener owns only content between `<!-- listener:start -->` and `<!-- listener:end -->`.

## Requirements

- [Bun](https://bun.sh) 1.3.0 or newer

## Install

Global installation:

```bash
bun add --global @irukaga/listener
listener --version
```

Project installation:

```bash
bun add --dev @irukaga/listener
bunx listener --help
```

## Quick start

Generate full Codex configuration in current project:

```bash
listener setup \
  --scope project \
  --agent codex \
  --preset full \
  --yes
```

Preview generated paths without writing:

```bash
listener setup \
  --scope project \
  --agent codex \
  --preset full \
  --yes \
  --dry-run
```

Generate configuration for multiple agents:

```bash
listener setup \
  --scope project \
  --agent codex \
  --agent claude \
  --preset full \
  --yes
```

`setup` currently uses explicit flags. Interactive setup remains planned.

## Presets

### Minimal

Core safety contract:

- instruction precedence;
- automatic skill activation;
- pre-task inspection;
- truthful layered verification;
- strict completion gate.

```bash
listener setup --scope project --agent codex --preset minimal --yes
```

### Full

Everything in Minimal plus:

- ramble and adversarial intent reconstruction;
- task classification;
- code intelligence and memory fallbacks;
- autonomous supervisor loop;
- specification and investigation workflows;
- scope pressure testing;
- persistent task sessions and context packets;
- multi-agent coordination;
- implementation safety and red-team review;
- availability-gated plugin policy.

```bash
listener setup --scope project --agent codex --preset full --yes
```

### Custom

Custom mode always includes core rules and lifecycle gates. Add workflow modules with repeatable `--module` flags:

```bash
listener setup \
  --scope project \
  --agent codex \
  --preset custom \
  --module supervisor-loop \
  --module red-team-review \
  --yes
```

Available modules:

```text
core
skill-activation
pre-task
verification
completion
ramble-intake
adversarial-intent
task-classification
code-intelligence
supervisor-loop
specification
investigation
scope-pressure
persistent-sessions
context-packets
multi-agent
implementation
red-team-review
tool-plugins
```

Unknown custom modules fail validation.

## Plugin behavior

Selected integrations add availability-gated plugin instructions. Agents use integration tools only when installed, callable, relevant, and permitted. Missing tools trigger repository-native fallback.

GitNexus is never required. Listener does not install, invoke, or refresh GitNexus unless user selected it and matching tools are available.

```bash
listener setup \
  --scope project \
  --agent codex \
  --preset custom \
  --integration code-graph \
  --yes
```

## Setup options

```text
--scope <global|project>
--mode <copy|symlink>
--agent <codex|claude|gemini|cursor|generic>
--preset <minimal|full|custom>
--module <module>
--profile <profile>
--integration <integration>
--cwd <path>
--yes
--dry-run
--force
```

`--agent`, `--module`, `--profile`, and `--integration` are repeatable.

## Current release scope

Version 0.2.0 implements policy catalog selection and setup generation. `sync`, `check`, `doctor`, `explain`, global installation modes, and project registry commands expose CLI contracts but do not yet perform full workflows. Avoid relying on them for automation until implemented.

## Development

```bash
bun install
bun run check
bun run build
bun dist/cli.js --help
```

## Publish

Validate release and inspect exact npm payload:

```bash
bun run check
bun run build
npm pack --dry-run
```

Authenticate and publish scoped public package:

```bash
npm login
npm whoami
bun run publish:npm
```

Publishing is intentionally manual. Package installation runs no setup or postinstall mutation.

## Roadmap

- Interactive setup
- Global copy and symlink installation
- Agent-specific skill directories
- Configuration persistence and `sync`
- Generated-state validation through `check`
- Diagnostics and policy explanation
- Global project registry

## License

[MIT](LICENSE)
