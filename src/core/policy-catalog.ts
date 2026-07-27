import type {
  InstallationPreset,
} from "./option-parsers.ts";

export type PolicyKind =
  | "rule"
  | "hook"
  | "skill"
  | "plugin";

export interface PolicyModule {
  name: string;
  kind: PolicyKind;
  title: string;
  description: string;
  content: string;
  minimal?: boolean;
}

const modules: readonly PolicyModule[] = [
  {
    name: "core",
    kind: "rule",
    title: "Core repository rules",
    description: "Instruction precedence, safe edits, truthful reporting, and tooling rules.",
    minimal: true,
    content: `# Core repository rules

- Follow system, developer, and direct user instructions first; then closest AGENTS.override.md, closest AGENTS.md, parent instructions, activated skills, and repository conventions.
- Inspect before editing. Check Git status before and after changes.
- Make smallest complete change. Preserve existing behavior unless request changes it.
- Reuse existing patterns. Never invent scripts, APIs, paths, environment variables, permissions, or configuration.
- Preserve user-authored and unrelated changes. Never reset, restore, stash, amend, rebase, commit, push, force-push, open pull requests, or change branches unless requested.
- Use repository package manager and existing scripts. Read relevant package manifests before choosing commands.
- Never claim verification passed unless command ran successfully. Report skipped, blocked, partial, and inferred results.
- Never expose secrets, credentials, tokens, production data, or unnecessary personal data.
- Do not leave fake implementations, silent fallbacks, placeholders, or TODOs unless scaffolding was requested.
`,
  },
  {
    name: "skill-activation",
    kind: "rule",
    title: "Automatic skill activation",
    description: "Discover and enforce every applicable installed skill.",
    minimal: true,
    content: `# Automatic skill activation

At task start, classify intent, files, technologies, named tools, and output. Review available skill descriptions. Activate every clearly applicable mandatory skill and smallest sufficient non-overlapping optional set. Read each selected SKILL.md fully before governed work. Follow prerequisites, workflow, tool restrictions, and validation. Re-evaluate when scope changes.

Never invent skills or claim unavailable skills were used. If relevant skill is unavailable or broken, continue with repository workflow and report limitation. Skill never overrides higher-precedence instruction.
`,
  },
  {
    name: "pre-task",
    kind: "hook",
    title: "Pre-task hook",
    description: "Mandatory inspection and task classification before edits.",
    minimal: true,
    content: `# Pre-task hook

Run before material work:

1. Read applicable instruction files and Git status.
2. Activate applicable skills.
3. Inspect scripts, configuration, implementation, tests, and adjacent patterns.
4. Search for existing abstractions and affected contracts.
5. Classify task as trivial, standard, or large/high-risk.
6. Choose verification scope and execution mode from user wording.
`,
  },
  {
    name: "verification",
    kind: "rule",
    title: "Layered verification",
    description: "Narrow-to-broad factual validation and Git safety.",
    minimal: true,
    content: `# Layered verification

Run verification from narrowest to broadest: changed behavior, affected tests, typecheck, lint/format, architecture checks, broader checks when justified, final diff. Use existing scripts. Run final checks after final changes. Distinguish unrelated baseline failures from introduced failures.

Record PASS, FAIL with reason, or NOT RUN with reason. Authorization needs allowed and denied tests; tenancy needs isolation tests; time logic needs boundaries/timezones; jobs need idempotency/duplicates; migrations need isolated verification.
`,
  },
  {
    name: "completion",
    kind: "hook",
    title: "Completion gate hook",
    description: "Blocks completion until behavior, verification, and scope gates pass.",
    minimal: true,
    content: `# Completion gate

Before declaring completion, confirm requested behavior exists, acceptance criteria pass, no known introduced failures remain, security/data/contracts remain intact, final diff is scoped, and limitations are reported. Never mark complete from intention, unrun tests, or agent-local claims.
`,
  },
  {
    name: "ramble-intake",
    kind: "skill",
    title: "Ramble intake",
    description: "Use for incomplete, repetitive, contradictory, or stream-of-consciousness requests.",
    content: `# Workflow

Reconstruct ramble into Goal, Current Problem, Desired Behavior, Motivation, Explicit Requirements, Preferences, Constraints, Rejected Approaches, Uncertainties, Scope, Acceptance Criteria, Assumptions, and Proposed Next Action. Label material claims EXPLICIT, REPOSITORY_CONFIRMED, STRONGLY_INFERRED, WEAKLY_INFERRED, CONFLICTING, or UNKNOWN. Resolve contradictions using later corrections, concrete examples, constraints, acceptance criteria, then repository evidence. Do not implement while material product conflicts remain.

# Completion criteria

- Repetition and abandoned thoughts removed.
- Material uncertainty preserved.
- Bounded working contract produced before implementation.
`,
  },
  {
    name: "adversarial-intent",
    kind: "skill",
    title: "Adversarial intent reconstruction",
    description: "Use for vague, strategic, high-impact, or ambiguous requests.",
    content: `# Workflow

Expand plausible interpretations. Investigate repository evidence. Challenge unsupported assumptions, added scope, conflicting current behavior, and high-impact guesses. Synthesize Goal, Problem, Confirmed Requirements, Repository Constraints, Inferred Requirements, Non-Goals, Open Decisions, Acceptance Criteria, and Next Action. Maximum two challenge/revision rounds. Ask user only when plausible interpretations create materially different behavior or affect security, money, privacy, destructive changes, public contracts, or irreversible migrations.
`,
  },
  {
    name: "supervisor-loop",
    kind: "skill",
    title: "Autonomous supervisor loop",
    description: "Use for standard and large implementation tasks.",
    content: `# Workflow

Cycle OBSERVE -> DECIDE -> EXECUTE -> VALIDATE -> REVIEW -> COMPLETE, REPAIR, REPLAN, or BLOCK. Choose one bounded action each iteration: INVESTIGATE, PLAN, IMPLEMENT, VALIDATE, REPAIR, REVIEW, REPLAN, INTEGRATE, COMPLETE, BLOCK. Track objective, inputs, files, constraints, expected output, verification, and stop condition. Maximum three repair attempts; stop after two identical failures without new evidence. Task size alone is never blocker.
`,
  },
  {
    name: "task-classification",
    kind: "rule",
    title: "Task classification",
    description: "Select proportionate workflow for trivial, standard, and large/high-risk tasks.",
    content: `# Task classification

Classify before editing. Trivial work gets direct implementation and smallest check. Standard work gets short plan, recorded decisions, direct implementation, and scoped verification. Large/high-risk work includes cross-package behavior, migrations, auth, privacy, payments, public contracts, multi-tenancy, distributed workflows, architectural changes, ambiguous product behavior, or more than about five material files; investigate, specify, design, task, implement, and verify in layers. User-requested review stays read-only. User-requested planning stops before production edits.
`,
  },
  {
    name: "code-intelligence",
    kind: "rule",
    title: "Code intelligence and memory",
    description: "Capability-based graph discovery, impact mapping, history checks, and manual fallbacks.",
    content: `# Code intelligence and memory

For standard, large, debugging, refactoring, architecture, or unfamiliar-code work, use available code graph tools to find entry points, definitions, callers, callees, contracts, routes, jobs, schemas, persistence, and tests. Check index freshness; confirm important graph edges in source. Use persistent memory when prior decisions or attempts may matter, then verify memory against current repository. If tools are missing, trace search results, imports, references, tests, configuration, and Git history manually. Missing tools never justify fabricated evidence or blocking.
`,
  },
  {
    name: "specification",
    kind: "skill",
    title: "Specification workflow",
    description: "Use for large/high-risk work or explicit planning requests.",
    content: `# Workflow

Create .listener/specs/<task>/spec.md, design.md, and tasks.md when task is large/high-risk or user asks for planning. Spec defines testable SHALL behavior and GIVEN/WHEN/THEN scenarios. Design references real files, current state, decisions, contracts, security, failure handling, migration, verification, and risks. Tasks remain unchecked until implementation and required verification pass. Never silently weaken requirements or substitute behavior.
`,
  },
  {
    name: "investigation",
    kind: "skill",
    title: "Hypothesis-driven investigation",
    description: "Use for bugs, unfamiliar code, architecture, or uncertain behavior.",
    content: `# Workflow

State question, hypothesis, why it matters, evidence needed, likely files, result, and plan consequence. Trace entry points, calls, contracts, configuration, persistence, permissions, and tests. Prefer source and tests over assumptions. Stop collecting context when evidence answers decision. Find root cause; reproduce concrete failure and add regression test when practical. Pressure-test scope: required, optional, speculative, deferred.
`,
  },
  {
    name: "scope-pressure",
    kind: "rule",
    title: "Scope pressure test",
    description: "Reject speculative abstractions, dependencies, cleanup, and future-proofing.",
    content: `# Scope pressure test

Before accepting plan, separate directly required changes, optional convenience, speculative future-proofing, and deferrable work. Require evidence for new abstractions and dependencies. Remove work that does not improve requested correctness, safety, or explicit acceptance criteria.
`,
  },
  {
    name: "persistent-sessions",
    kind: "skill",
    title: "Persistent task sessions",
    description: "Use for standard or large tasks likely to span interactions or agent invocations.",
    content: `# Workflow

Store normalized state under .listener/sessions/<task-slug>/ using intent.md, state.md, tasks.md, attempts.md, decisions.md, and changes.md. Record only meaningful state, executions, durable decisions, and concise file summaries; never raw conversations, full diffs, secrets, or every tool call. On resume, compare intent/state/task records with Git status and actual diff, rerun unresolved failures when useful, and continue from evidence.
`,
  },
  {
    name: "context-packets",
    kind: "rule",
    title: "Context packet compilation",
    description: "Give implementation and review agents smallest sufficient bounded context.",
    content: `# Context packet compilation

Before invoking implementation or review agent, provide Goal, Current Task, Acceptance Criteria, repository evidence with paths, constraints, in-scope and out-of-scope files, risks, relevant attempts, required verification, and expected output. Do not send entire conversation, repository, plan, or unrelated tool output when bounded packet suffices.
`,
  },
  {
    name: "multi-agent",
    kind: "rule",
    title: "Multi-agent coordination",
    description: "Safe parallel investigation and disjoint implementation ownership.",
    content: `# Multi-agent coordination

Use multiple agents only when work is independent and coordination cost is lower. Freeze shared contracts before parallel implementation. Assign disjoint files/modules, explicit outputs, and verification. Coordinator owns shared contracts, integration, final diff, and final checks. Never parallelize same files, undecided contracts, migration ordering, lockfiles, or final integration. Agent-local passing tests do not prove integrated feature passes.
`,
  },
  {
    name: "implementation",
    kind: "rule",
    title: "Implementation safety",
    description: "Architecture, persistence, auth, frontend, and job safeguards.",
    content: `# Implementation safety

Match local style. Preserve public contracts unless required. Validate boundaries. Reuse error, logging, transaction, tenant, localization, and design-system patterns. Respect dependency boundaries.

Treat migrations as high risk; consider existing data, nullability, backfill, locks, indexes, rollback, and isolated verification. Enforce ownership/tenant scope in owning use case, not only middleware. Treat client tenant IDs as untrusted. Jobs must be idempotent, duplicate-safe, retry-aware, and carry tenant/correlation context. Frontends must cover loading, empty, error, denied, success, accessibility, query invalidation, and translation.
`,
  },
  {
    name: "red-team-review",
    kind: "skill",
    title: "Red-team review",
    description: "Use after standard/large implementation before completion.",
    content: `# Workflow

Try to reject implementation using concrete evidence: partial acceptance criteria, auth/tenant failure, unsupported assumption, regression, weak test, migration/concurrency/idempotency/time hazard, swallowed error, documentation drift, or unnecessary scope. Classify finding REPAIR, REPLAN, DOCUMENT_LIMITATION, or BLOCK. Include severity, file/line, failure scenario, impact, and smallest safe correction. Resolve high-severity findings before completion.
`,
  },
  {
    name: "tool-plugins",
    kind: "plugin",
    title: "Optional tool plugins",
    description: "Capability-based plugin activation without hard dependency on GitNexus.",
    content: `# Optional tool plugins

At task start, inspect tools currently available. Use every selected integration only when its tool is installed, callable, relevant, and permitted. Match capability, not exact product name: code graph for symbols/callers, memory for prior decisions, browser for runtime UI, issue tracker for requested ticket work. Repository source and tests remain authoritative.

GitNexus is never required. Do not install, invoke, refresh, or mention it unless user selected it and its tools are currently available. Missing plugins must not block work; use repository search, language tools, source, tests, Git history, or manual tracing and report limitation.
`,
  },
];

export const policyModules = modules;

export function selectPolicyModules(
  preset: InstallationPreset,
  selectedNames: readonly string[],
): readonly PolicyModule[] {
  if (preset === "minimal") {
    const requested = new Set(selectedNames);
    return modules.filter((module) => module.minimal || requested.has(module.name));
  }

  if (preset === "full") {
    return modules;
  }

  const requested = new Set([
    "core",
    "skill-activation",
    "pre-task",
    "verification",
    "completion",
    ...selectedNames,
  ]);

  return modules.filter((module) => requested.has(module.name));
}

export function unknownPolicyModules(
  selectedNames: readonly string[],
): string[] {
  const known = new Set(modules.map((module) => module.name));
  return selectedNames.filter((name) => !known.has(name));
}
