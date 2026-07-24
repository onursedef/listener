<div align="center">

# Listener

### One setup. Consistent agent behavior across every project.

Listener is a Bun-powered CLI for installing, generating, and maintaining reusable instructions and skills for AI coding agents.

Configure Codex, Claude Code, and other agents from one place without manually copying massive `AGENTS.md` or `CLAUDE.md` files between repositories.

[![npm version](https://img.shields.io/npm/v/@sedef/listener?style=flat-square)](https://www.npmjs.com/package/@sedef/listener)
[![Bun](https://img.shields.io/badge/runtime-Bun-f9f1e1?style=flat-square\&logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-3178c6?style=flat-square\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/npm/l/@sedef/listener?style=flat-square)](LICENSE)

</div>

---

## Why Listener?

AI coding agents work best when they understand:

* how your repository is structured;
* which commands and tools they should use;
* how they should investigate before editing;
* how they should validate their work;
* which workflows require planning or approval;
* which rules apply globally and which are project-specific.

Maintaining these instructions manually becomes difficult as the number of projects and agents grows.

Listener turns agent configuration into a repeatable installation process.

```text
Reusable policies
       +
Selected agents
       +
Installation preset
       +
Project configuration
       ↓
Generated agent instructions and skills
```

---

## Features

* Install agent configuration globally or per project.
* Configure multiple coding agents from one command.
* Choose between minimal, full, and custom installations.
* Copy or symlink globally managed instructions into projects.
* Generate agent-specific instruction files.
* Install reusable agent skills.
* Preserve externally managed sections such as GitNexus blocks.
* Detect stale or conflicting generated files.
* Explain which instructions apply to a specific path.
* Validate installations locally and in CI.
* Built with Bun and TypeScript.

---

## Supported Agents

Listener is designed around adapters, allowing every agent to receive instructions in the format and location it expects.

| Agent       | Project instructions  | Global instructions   | Skills                |
| ----------- | --------------------- | --------------------- | --------------------- |
| Codex       | `AGENTS.md`           | `~/.codex/AGENTS.md`  | `.agents/skills`      |
| Claude Code | `CLAUDE.md`           | `~/.claude/CLAUDE.md` | `.claude/skills`      |
| Gemini CLI  | Agent-specific output | Agent-specific output | Agent-specific skills |
| Cursor      | Project rules         | Global rules          | Project rules         |
| Generic     | `AGENTS.md`           | —                     | `.agents/skills`      |

Agent availability may expand as new adapters are added.

---

## Requirements

* [Bun](https://bun.sh) `1.3.0` or newer

Verify your installation:

```bash
bun --version
```

---

## Installation

### Global CLI

Install Listener once and use it in any repository:

```bash
bun add --global @sedef/listener
```

Verify that the executable is available:

```bash
listener --version
listener --help
```

### Project-scoped CLI

Pin Listener to a specific version inside a repository:

```bash
bun add --dev @sedef/listener
```

Run it through `bunx`:

```bash
bunx listener --help
```

Project-scoped installation is recommended for shared repositories because every contributor and CI environment uses the same Listener version.

---

## Quick Start

Run the interactive setup wizard:

```bash
listener setup
```

Listener will ask:

```text
Where should Listener be installed?

❯ Global
  Current project
```

```text
How should projects consume the global installation?

❯ Copy generated files
  Create symlinks
```

```text
Which agents should be configured?

◉ Codex
◉ Claude Code
◯ Gemini CLI
◯ Cursor
◯ Generic AGENTS.md
```

```text
Which installation type should be used?

❯ Minimal
  Full
  Custom
```

After reviewing the selected configuration, Listener generates the required instruction files and skills.

---

## Installation Scopes

### Global

Global setup installs reusable configuration in your home directory.

```bash
listener setup --scope global
```

Example global structure:

```text
~/.listener/
├── config.yaml
├── policies/
├── profiles/
├── skills/
└── registry.yaml
```

Agent-specific files may also be created:

```text
~/.codex/AGENTS.md
~/.agents/skills/
~/.claude/CLAUDE.md
```

Global installation is useful when:

* you use the same operating model across many repositories;
* repositories are primarily personal;
* you want policies and skills updated centrally.

### Project

Project setup installs configuration into the current repository.

```bash
listener setup --scope project
```

Example structure:

```text
.listener/
├── config.yaml
├── overrides/
└── state.json

AGENTS.md
CLAUDE.md
.agents/skills/
.claude/skills/
```

Project installation is useful when:

* the repository is shared;
* agent behavior must be version-controlled;
* CI should validate generated instructions;
* project rules must work on other machines and cloud environments.

---

## Global Consumption Modes

When using a global installation, Listener can connect projects to it in different ways.

### Copy

```bash
listener setup \
  --scope global \
  --mode copy
```

Listener copies generated instructions into the repository.

Advantages:

* works in CI and containers;
* works on other machines;
* generated files can be committed;
* changes are visible in Git.

Copied files can be refreshed with:

```bash
listener sync
```

### Symlink

```bash
listener setup \
  --scope global \
  --mode symlink
```

Listener creates project links to globally managed files.

Advantages:

* global updates become immediately available;
* no duplicated instruction files.

Limitations:

* links may break on another machine;
* cloud environments may not resolve local paths;
* project behavior can change without a repository diff;
* not recommended for shared repositories.

Symlink mode is best suited to personal local projects.

---

## Installation Presets

### Minimal

```bash
listener setup --preset minimal
```

Minimal installation includes the essential behavior needed for safe coding assistance:

* instruction precedence;
* repository inspection;
* focused changes;
* verification truthfulness;
* skill discovery;
* Git safety;
* completion criteria.

Use Minimal for small repositories and straightforward development tasks.

### Full

```bash
listener setup --preset full
```

Full installation enables the complete workflow:

* ramble and unstructured intent intake;
* adversarial intent reconstruction;
* task classification;
* autonomous supervisor loop;
* hypothesis-driven investigation;
* uncertainty management;
* specification and design workflows;
* persistent task sessions;
* multi-agent coordination;
* layered verification;
* repair and replanning loops;
* red-team review;
* strict completion gates.

Use Full for complex repositories, long-running tasks, architecture work, and multi-agent development.

### Custom

```bash
listener setup \
  --preset custom \
  --module supervisor-loop \
  --module red-team-review
```

Custom installation lets you enable only the modules you need.

Example modules:

```text
core
ramble-intake
adversarial-intent
task-classification
supervisor-loop
specification
persistent-sessions
context-packets
multi-agent
scope-pressure
red-team-review
```

---

## Commands

### `listener setup`

Configure Listener globally or inside the current project.

```bash
listener setup
```

Non-interactive example:

```bash
listener setup \
  --scope project \
  --agent codex \
  --agent claude \
  --preset full \
  --yes
```

Available options:

```text
--scope <global|project>
--mode <copy|symlink>
--agent <agent>
--preset <minimal|full|custom>
--module <module>
--profile <profile>
--integration <integration>
--cwd <path>
--dry-run
--force
--yes
```

Repeat `--agent`, `--module`, `--profile`, or `--integration` to select multiple values.

---

### `listener sync`

Regenerate configured agent instructions and skills.

```bash
listener sync
```

Synchronize one agent:

```bash
listener sync --agent codex
```

Preview changes without writing files:

```bash
listener sync --dry-run
```

Synchronize all globally registered projects:

```bash
listener sync --all
```

---

### `listener check`

Verify that generated instructions match the current configuration.

```bash
listener check
```

Use strict mode to treat warnings as failures:

```bash
listener check --strict
```

This command is designed for CI:

```json
{
  "scripts": {
    "agents:check": "listener check --strict"
  }
}
```

---

### `listener doctor`

Diagnose installation and configuration problems.

```bash
listener doctor
```

Check the global installation:

```bash
listener doctor --global
```

Return machine-readable output:

```bash
listener doctor --json
```

Repair safe and deterministic issues:

```bash
listener doctor --fix
```

---

### `listener explain`

Explain which instructions apply to a file or directory.

```bash
listener explain src/modules/users/service.ts
```

Limit the explanation to one agent:

```bash
listener explain src/modules/users/service.ts \
  --agent codex
```

Example output:

```text
Applicable instructions:

1. ~/.codex/AGENTS.md
2. ./AGENTS.md
3. ./src/modules/AGENTS.md

Active modules:

- core
- supervisor-loop
- red-team-review

Active profiles:

- bun
- typescript
- backend

Effective rules were resolved from the nearest applicable
instruction files and selected project configuration.
```

---

### `listener projects`

Manage repositories registered with a global Listener installation.

List projects:

```bash
listener projects list
```

Register a project:

```bash
listener projects add ~/Projects/example
```

Register it with a display name:

```bash
listener projects add ~/Projects/example \
  --name "Example Project"
```

Remove a project:

```bash
listener projects remove ~/Projects/example
```

The shorter alias is also supported:

```bash
listener projects rm ~/Projects/example
```

---

## Project Configuration

Listener stores repository configuration under:

```text
.listener/config.yaml
```

Example:

```yaml
version: 1

installation:
  scope: project
  preset: full

targets:
  - codex
  - claude

profiles:
  - bun
  - typescript
  - monorepo

modules:
  ramble_intake: true
  adversarial_intent: true
  supervisor_loop: true
  specifications: true
  persistent_sessions: true
  red_team_review: true
  multi_agent: true

integrations:
  gitnexus:
    enabled: true
    ownership: external
    preserve_markers: true

generation:
  commit_generated_files: true
  include_header: true
  include_checksum: true

paths:
  overrides: .listener/overrides
  state: .listener/state.json
```

---

## External Managed Sections

Listener can preserve sections owned by other tools.

For example, GitNexus manages blocks using:

```md
<!-- gitnexus:start -->

GitNexus-generated instructions...

<!-- gitnexus:end -->
```

Listener only replaces its own managed section and preserves foreign sections unchanged.

```md
<!-- listener:generated:start -->

Listener-generated instructions...

<!-- listener:generated:end -->

<!-- gitnexus:start -->

GitNexus-generated instructions...

<!-- gitnexus:end -->
```

This allows multiple agent tools to safely coexist in the same instruction file.

---

## Generated Files

Generated instruction files contain a warning header:

```md
<!--
GENERATED BY LISTENER
DO NOT EDIT THIS SECTION DIRECTLY

Configuration: .listener/config.yaml
Listener version: 0.1.0
-->
```

Repository-specific additions should be placed in:

```text
.listener/overrides/
```

Listener merges these overrides during synchronization.

---

## Package Scripts

Add convenient commands to your project:

```json
{
  "scripts": {
    "agents:setup": "listener setup",
    "agents:sync": "listener sync",
    "agents:check": "listener check",
    "agents:doctor": "listener doctor"
  }
}
```

Run them with Bun:

```bash
bun run agents:sync
bun run agents:check
```

---

## CI Example

```yaml
name: Agent Instructions

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  validate-agent-instructions:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Validate generated instructions
        run: bunx listener check --strict
```

---

## Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/onursedef/listener.git
cd listener
bun install
```

Run the CLI from source:

```bash
bun run dev -- --help
```

Run type checking:

```bash
bun run typecheck
```

Run tests:

```bash
bun test
```

Run tests in watch mode:

```bash
bun test --watch
```

Generate coverage:

```bash
bun test --coverage
```

Build the executable:

```bash
bun run build
```

Test the compiled CLI:

```bash
bun dist/cli.js --help
```

---

## Publishing

Authenticate with npm:

```bash
bunx npm login
bun pm whoami
```

Run validation and build:

```bash
bun run check
bun run build
```

Inspect the package:

```bash
bun publish --dry-run
bun pm pack
```

Publish the scoped public package:

```bash
bun publish --access public
```

---

## Design Principles

Listener follows several core principles.

### Explicit over magical

Installation changes are previewable, reviewable, and initiated by an explicit command.

### Generated, but auditable

Generated files can be committed so the effective agent behavior remains visible in Git.

### Global where reusable

Reusable policies and skills can be shared across projects.

### Local where specific

Repository architecture, commands, constraints, and exceptions remain project-owned.

### Compatible by design

Listener preserves instruction sections managed by external tools.

### Verification over confidence

Agents should report evidence from commands and tests rather than making unsupported completion claims.

---

## Roadmap

### CLI foundation

* [x] Bun and Commander CLI foundation
* [x] `setup` command contract
* [x] `sync` command contract
* [x] `check` command contract
* [x] `doctor` command contract
* [x] `explain` command contract
* [x] `projects` command contract
* [x] Typed command options and validation
* [x] Command and handler test coverage

### Setup

* [ ] Interactive `setup` wizard
* [ ] Global installation
* [ ] Project installation
* [ ] Copy mode
* [ ] Symlink mode
* [ ] Installation previews and confirmation
* [ ] Safe overwrite and conflict handling

### Agent adapters

* [ ] Codex adapter
* [ ] Claude Code adapter
* [ ] Gemini CLI adapter
* [ ] Cursor adapter
* [ ] Generic `AGENTS.md` adapter

### Policies and presets

* [ ] Minimal preset
* [ ] Full preset
* [ ] Custom module selection
* [ ] Policy compiler
* [ ] Repository-specific overrides
* [ ] Nested instruction-file generation
* [ ] Managed instruction sections
* [ ] GitNexus section preservation

### Synchronization and validation

* [ ] Generate files with `listener sync`
* [ ] Detect stale files with `listener check`
* [ ] Strict CI validation
* [ ] Dry-run diff previews
* [ ] Checksums and generation metadata

### Global project management

* [ ] Global project registry
* [ ] `listener projects list`
* [ ] `listener projects add`
* [ ] `listener projects remove`
* [ ] Synchronize all registered projects

### Diagnostics

* [ ] `listener doctor` diagnostics
* [ ] Safe automatic repairs
* [ ] `listener explain` policy resolution
* [ ] JSON output for automation

### Future

* [ ] Automatic project-profile detection
* [ ] Reusable skill installation
* [ ] Remote policy packages
* [ ] Additional agent integrations


---

## Contributing

Contributions are welcome.

Before opening a pull request:

```bash
bun install
bun run typecheck
bun test
bun run build
```

Keep changes focused, include tests for new behavior, and update documentation when the public CLI contract changes.

---

## License

Listener is released under the [MIT License](LICENSE).

---

<div align="center">

Built with Bun, TypeScript, and an unreasonable interest in making coding agents behave consistently.

</div>
