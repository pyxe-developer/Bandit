# BANDIT-057 Claude Writer Dispatch

## Metadata

- Work item: `BANDIT-057` - Role Entry Points And Formation Gate
- Codex PM: Codex
- Claude Writer: `claude-sonnet-4-6`
- Repository: `<repo-root>`
- Branch: `main`
- Base SHA: `5e04acd0d188884b984438d83f1d23e655d6d7fa`
- Dispatch status: Stage 3 implementation requested

## Narrowed Process Adapter Instructions

This is a direct Stage 3 Writer dispatch. Do not perform meta-workflow
selection, subagent selection, workflow planning, or skill delegation. Do not
invoke `Task`, subagents, slash-command skills, or workflow-management tools.
Read the required files below, make the focused production implementation edits
allowed by this packet, run the required verification, write the required Writer
report, and stop.

If local runtime instructions force you to load a startup skill before work,
load only the minimum required startup skill, then immediately return to this
dispatch packet. Do not dispatch another agent or broaden the role taxonomy.

Codex authored the Stage 2 RED evidence for this work item. Stage 3
implementation must therefore be authored by Claude through this Process
Adapter path, and the Stage 3 Writer has zero authority over tests, test
helpers, fixtures, RED evidence artifacts/specs, or acceptance mappings.

## Required First Reads

Read these before editing:

- `AGENTS.md`
- `CONTEXT.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `docs/work/BANDIT-057/brief.md`
- `docs/work/BANDIT-057/red-evidence.md`
- `docs/specs/BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION.json`
- `docs/specs/BANDIT-057-red-evidence.json`
- `docs/design/role-scoped-workflow-orchestration.md`
- `docs/decisions/2026-06-01-explicit-role-entrypoints-and-formation-gate.md`
- `test/role-entrypoints-formation.test.mjs`
- Existing command/state patterns in `src/cli.ts`,
  `src/commands/work-item-create.ts`, `src/commands/gaps.ts`,
  `src/commands/coordination.ts`, `src/commands/validate.ts`,
  `src/state/bootstrap-gaps.ts`, `src/state/coordination-log.ts`, and nearby
  command/state modules.

## Mission

Implement Stage 3 for `BANDIT-057` only: add the first bounded role entrypoint
and Formation Gate implementation so the focused RED suite passes.

The required focused command is:

```sh
node --test test/role-entrypoints-formation.test.mjs
```

Current expected RED state from Stage 2: 7 tests, 0 pass, 7 fail. The failures
show that Bandit currently rejects `replaced` bootstrap-gap dispositions,
returns a generic missing-command usage message for bare invocation, lacks
`repo-pm` and `work-item-pm` command surfaces, and rejects
`formation_approved` as a coordination state.

## Editable Production And Evidence Paths

You may edit focused production implementation, glossary/template surfaces, and
Stage 3 evidence needed for this work item:

- `src/cli.ts`
- `src/commands/work-item-create.ts`
- `src/commands/gaps.ts`
- `src/commands/coordination.ts`
- `src/commands/validate.ts`
- `src/commands/repo-pm.ts`
- `src/commands/work-item-pm.ts`
- `src/state/bootstrap-gaps.ts`
- `src/state/coordination-log.ts`
- `src/state/formation-gate.ts`
- `docs/templates/bootstrap-gap-disposition.md`
- `docs/templates/formation-review.md`
- `CONTEXT.md` for narrow glossary additions only
- `docs/work/BANDIT-057/implementation-evidence.md`
- `docs/work/BANDIT-057/writer-report.md`
- `docs/specs/BANDIT-057-implementation-evidence.json`

You may add a new focused command or state module if it keeps the implementation
smaller than expanding an unrelated module. Document any added path and
rationale in `docs/work/BANDIT-057/writer-report.md`.

## Forbidden Paths And Actions

Do not create, edit, delete, regenerate, format, or mechanically adjust:

- `test/role-entrypoints-formation.test.mjs`
- any other test file, test helper, or fixture
- `docs/work/BANDIT-057/red-evidence.md`
- `docs/specs/BANDIT-057-red-evidence.json`
- `docs/work/BANDIT-057/brief.md`
- `docs/specs/BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION.json`
- acceptance mappings for `BANDIT-057`
- `docs/work/BANDIT-057/dispatch.md`
- review, landing, landing-action, retrospective, CodeRabbit, Local Qwen, or
  formation-review evidence for `BANDIT-057`
- installed global skills under `~/.codex/skills`
- dependencies or lockfiles

Do not implement full PRD decomposition, broad claimability or unblocking
repair, full role contracts, Role Run Manifests, execution packets beyond
minimal readiness checks, role input packets, diff-based write validation,
same-agent repair continuation, landing subagent packets, closeout packets,
full monolithic rubric migration, state-index persistence, local server/API
mode, scheduler execution, worktree lifecycle execution, claim lease creation
or release, work-surface reservation implementation, PR/CI workflow, automatic
merge/push/deploy behavior, product UAT approval, dependency or lockfile
changes, installed global skill edits, external service integration, or
unrelated Phase 8 cockpit feature work.

If the RED test is wrong or requires broader scope, stop and record the
test-change request or scope blocker in `docs/work/BANDIT-057/writer-report.md`;
do not change the tests.

## Implementation Boundaries

- Add supported `replaced` bootstrap-gap disposition semantics. Validation must
  require source gap identity, replacement gap identity, replacement work item or
  artifact evidence, rationale, and verification target. A replaced gap is not
  resolved implementation work and is not a no-action decision.
- Make bare `bandit` invocation fail closed with a concise role-required
  message naming `repo-pm` and `work-item-pm`. This refusal must happen before
  hydrating roadmap, gap, or work-item context.
- Add `repo-pm create-work-item <spec-path>` as a role-specific entrypoint that
  preserves the existing `work-item create <spec-path>` safety and artifact
  behavior.
- Add `repo-pm approve-formation <work-item-id>`. It must run deterministic
  formation validation first, require Qwen, CodeRabbit, and aggregate formation
  review artifacts, reject blocker or undispositioned non-blocking formation
  findings when represented in the aggregate evidence, and append a
  `formation_approved` step transition only after approval passes.
- Add deterministic formation validation for formed work items using the brief
  and formation evidence. At minimum, fail closed for missing brief, missing
  work type, missing source provenance, ambiguous or empty scope, unverifiable
  acceptance criteria, missing out-of-scope boundaries, missing operator input
  status, missing role boundary evidence, missing write-surface families, and
  missing Test Writer or Implementation Writer boundary evidence.
- Accept `formation_approved` as append-only coordination history between
  `brief_created` and `red_recorded`. Do not store it as a mutable flag or infer
  it from artifact presence alone.
- Add `work-item-pm start <work-item-id>` readiness checks that refuse unknown,
  missing, unformed, blocked, stale, or contradictory work items and name the
  missing `formation_approved` transition plus formation review evidence when
  absent.
- Keep source-of-truth boundaries intact: `.bandit/bootstrap-gaps.json`,
  per-work-item coordination history, work-item artifacts, roadmap/context
  files, and root status remain canonical as already defined. New command
  payloads and projections remain derived.
- Keep command routing and validators explicit and small. Prefer local helpers
  with clear failure messages over broad generic parsing.

## Verification Commands

Run the focused RED/GREEN command first:

```sh
node --test test/role-entrypoints-formation.test.mjs
```

Then run relevant Stage 3 checks for touched command, bootstrap-gap,
coordination, formation, template, and validation surfaces:

```sh
node --test test/bootstrap-gaps.test.mjs
node --test test/work-item-create.test.mjs
node --test test/coordination-log.test.mjs test/coordination-status.test.mjs
npm run typecheck
npm run bandit -- validate
npm run bandit -- gaps list
npm run bandit -- stage-capability-scope validate --json
npm run bandit -- token-cost-failsafe validate --json
npm run bandit -- evidence-freshness-slos validate --json
npm run bandit -- risk-classification validate --json
npm run bandit -- supply-chain-gate validate --json
npm run bandit -- input-quarantine validate --json
npm run bandit -- operator-boundary validate --json
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
git diff --check
```

Run `npm test` if the implementation touches shared command routing,
validators, artifact renderers, work-item parsing, templates, bootstrap gaps,
coordination history, cockpit status, session-context packets, risk
classification, supply-chain gates, input quarantine, operator boundaries,
token-cost failsafes, or policy validation beyond the focused role-entrypoint
behavior.

## Required Writer Report

Write `docs/work/BANDIT-057/writer-report.md` with:

- writer_identity: `claude_process_adapter`
- model_family: `claude`
- base_sha: `5e04acd0d188884b984438d83f1d23e655d6d7fa`
- implementation summary
- exact files changed by the Writer
- confirmation that no tests, test helpers, fixtures, RED evidence
  artifacts/specs, or acceptance mappings were edited
- explicit statement that Stage 3 was authored by Claude through the Process
  Adapter path
- verification commands run, with pass/fail results
- clean-code self-check notes against `CLEAN_CODE.md`
- any stop condition, test-change request, bootstrap gap, or unresolved risk

Do not commit. Leave the working tree for Codex PM review.
