# BANDIT-060 Claude Writer Dispatch

## Metadata

- Work item: `BANDIT-060` - Artifact Input Directory Split
- Codex PM: Codex
- Claude Writer: `claude-sonnet-4-6`
- Repository: `/Users/matthewflebbe/Bandit`
- Branch: `main`
- Base SHA: `a5b3bb7868d74aa7bcdfd431941968ae7ad81e8d`
- Created: 2026-06-06T17:09:00Z
- Dispatch status: Stage 3 implementation requested

## Direct Writer Instructions

This is a direct Stage 3 Implementation Writer dispatch. Do not perform
meta-workflow selection, subagent selection, workflow planning, or skill
delegation. Do not invoke `Task`, subagents, slash-command skills, or
workflow-management tools.

Read the named files, implement the narrow production behavior, run the
required verification, write the required Writer report and implementation
evidence, and stop. If local runtime instructions force you to load a startup
skill before work, load only the minimum required startup skill and immediately
return to this packet.

## Hard Boundaries

Stage 2 RED tests and acceptance mappings were authored by Codex PM/Test
Writer. Stage 3 must be authored by Claude through this Process Adapter path.

Do not create, edit, format, delete, regenerate, or mechanically adjust:

- `test/**`
- test helpers, fixtures, or snapshot fixtures
- `docs/work/BANDIT-060/red-evidence.md`
- `docs/specs/BANDIT-060-red-evidence.json`
- `docs/work/BANDIT-060/brief.md`
- formation, review, landing, landing-action, retrospective, CodeRabbit, or
  Local Qwen evidence
- canonical historical work evidence under `docs/work/BANDIT-001` through
  `docs/work/BANDIT-059`
- roadmap, current-context, root status, bootstrap-gap ledger, or coordination
  history unless the implementation evidence itself requires a narrow
  Stage 3-owned append-only update
- dependencies, lockfiles, installed global skills, external service setup, or
  unrelated workflow docs

If the RED test is wrong or requires broader scope, stop and record the blocker
in `docs/work/BANDIT-060/writer-report.md`; do not edit tests.

## Required Reads

Read only what is needed from these files before editing:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-060/brief.md`
- `docs/work/BANDIT-060/red-evidence.md`
- `docs/specs/BANDIT-060-red-evidence.json`
- `test/artifact-inputs.test.mjs`
- `src/cli.ts`
- `src/commands/artifact-create.ts`
- `src/commands/validate.ts`
- command/state validation patterns in `src/commands/trust.ts`,
  `src/state/trust-verify.ts`, `src/commands/role-runs.ts`,
  `src/state/role-run-manifests.ts`, `src/commands/evidence-freshness-slos.ts`,
  and `src/state/evidence-freshness-slos.ts`

## Mission

Make `node --test test/artifact-inputs.test.mjs` pass by adding the narrow
Artifact Input Directory Split behavior:

```sh
bandit artifact-inputs validate --json
```

Implement only the behavior exercised by the RED tests and accepted brief:

- register `artifact-inputs validate --json` in `src/cli.ts`;
- validate `.bandit/policy/artifact-inputs.json` fail-closed;
- report supported classes in deterministic order:
  `work_or_gap_spec`, `artifact_renderer_input`, `reviewer_capture`, and
  `trust_snapshot_fixture`;
- report preferred directories for those classes:
  `docs/specs`, `docs/artifact-inputs`, `docs/reviewer-captures`, and
  `docs/trust-snapshot-fixtures`;
- reject unsafe paths, absolute paths, and paths escaping the repository;
- reject future `artifact_renderer_input` use under `docs/specs/` with a clear
  diagnostic that future artifact-renderer inputs must use
  `docs/artifact-inputs`;
- keep historical `docs/specs/*-red-evidence.json`,
  `docs/specs/*-implementation-evidence.json`,
  `docs/specs/*-landing-verdict.json`,
  `docs/specs/*-retrospective.json`,
  `docs/specs/*coderabbit-review-output*.json`, and
  `docs/specs/snapshots/*.json` readable as legacy inputs when marked legacy;
- reject class/name or class/directory mismatches, including an
  `artifact_renderer_input` declared under `docs/reviewer-captures/`;
- update `bandit artifact create <spec-path>` so future artifact-renderer
  inputs under `docs/specs/` fail closed and dedicated
  `docs/artifact-inputs/` specs work while preserving repo-contained path
  checks, no-overwrite behavior, lifecycle event append behavior, and rollback
  behavior.

Do not implement Trust Verifier cutover, old gate replacement, live evidence
capture, reviewer execution, model calls, harness queues, auth/provider
routing, live status, agent lifecycle, role input packets, execution packets,
Pi/Aperture agent-scope work, state-index persistence, server/API mode,
scheduler/worktree/claim/work-surface lifecycle, PR/CI workflow, automatic
merge/push/deploy behavior, product UAT approval, dependency or lockfile
changes, installed global skill edits, external service integration, or
unrelated Phase 8 cockpit feature work.

## Editable Paths

Production implementation:

- `src/cli.ts`
- `src/commands/artifact-inputs.ts`
- `src/commands/artifact-create.ts`
- `src/commands/validate.ts`
- `src/state/artifact-inputs.ts`
- `.bandit/policy/artifact-inputs.json`

Stage 3 evidence:

- `docs/work/BANDIT-060/implementation-evidence.md`
- `docs/work/BANDIT-060/writer-report.md`
- `docs/specs/BANDIT-060-implementation-evidence.json`
- `docs/role-runs/BANDIT-060/stage3-implementation.json`

Use fewer files if possible. Preserve existing command, parser, validator,
policy, and Markdown evidence style.

## Implementation Order

1. Add the artifact-input taxonomy state validator.
2. Add the `artifact-inputs validate --json` command and CLI registration.
3. Add or update the repo policy artifact only as needed for this taxonomy.
4. Enforce `artifact create` input-path routing for future artifact-renderer
   inputs while preserving existing artifact rendering behavior.
5. Run focused tests and fix only production code.
6. Write Writer report, implementation evidence, implementation evidence JSON,
   and the Stage 3 role-run manifest.

## Required Verification

Run at least:

```sh
node --test test/artifact-inputs.test.mjs
npm run typecheck
npm run bandit -- artifact-inputs validate --json
npm run bandit -- validate
npm run bandit -- role-runs validate BANDIT-060 --json
git diff --check
```

Run broader validation only if production edits touch shared validators,
artifact rendering beyond path routing, workflow-state behavior, role contracts,
model-family separation, or policy validation beyond the artifact-input
taxonomy.

## Required Writer Evidence

Write `docs/work/BANDIT-060/writer-report.md` with:

- production files changed;
- verification commands and results;
- explicit Test Ownership Boundary statement;
- explicit statement that Stage 3 was authored by Claude through the Process
  Adapter path;
- stop conditions, bootstrap gaps, or follow-up concerns.

Write `docs/work/BANDIT-060/implementation-evidence.md` and
`docs/specs/BANDIT-060-implementation-evidence.json` with:

- Stage 3 status;
- production files changed;
- acceptance coverage;
- verification commands and results;
- clean-code self-check;
- Test Ownership Boundary evidence;
- Bootstrap Model-Family Separation evidence;
- statement that JSON taxonomy inputs do not replace canonical Markdown
  evidence, roadmap/current-context authority, append-only coordination history,
  review evidence, landing evidence, retrospective evidence, or trust-verifier
  reports;
- statement that Trust Verifier cutover remains out of scope;
- bootstrap gaps or follow-up concerns.

Write `docs/role-runs/BANDIT-060/stage3-implementation.json` with:

- `work_item_id`: `BANDIT-060`;
- `stage`: `stage3_implementation`;
- role contract `implementation_writer` version `1.0.0`;
- capability/subagent identity for `claude-implementation-writer-stage3`;
- base revision `a5b3bb7868d74aa7bcdfd431941968ae7ad81e8d`;
- allowed target files matching this packet;
- forbidden file patterns for tests, RED evidence, brief, formation evidence,
  coordination history, review evidence, landing evidence, and retrospective
  evidence;
- required input packet `docs/work/BANDIT-060/dispatch.md`;
- required summary path `docs/work/BANDIT-060/implementation-evidence.md`;
- validation commands run;
- source artifacts read;
- authority boundary showing role-run evidence is append-only evidence and
  cannot satisfy coordination history, review, landing, UAT, or retrospective
  authority.
