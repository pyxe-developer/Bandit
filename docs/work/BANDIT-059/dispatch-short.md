# BANDIT-059 Short Claude Writer Dispatch

## Metadata

- Work item: `BANDIT-059` - Trust Verify Snapshot Foundation
- Codex PM: Codex
- Claude Writer: `claude-sonnet-4-6`
- Repository: `/Users/matthewflebbe/Bandit`
- Branch: `main`
- Base SHA: `4c35721`
- Created: 2026-06-06T00:02:36Z
- Dispatch status: Stage 3 implementation retry requested after two stalled full-packet attempts

## Direct Writer Instructions

This is a direct Stage 3 Implementation Writer retry. Do not perform
meta-workflow selection, subagent selection, workflow planning, or skill
delegation. Do not invoke `Task`, subagents, slash-command skills, or
workflow-management tools.

The previous full-packet dispatch attempts stalled in source-reading and
thinking without edits. Use this shorter packet as the authority for the retry:
read the named files, implement the narrow production behavior, run the
verification commands, write the required evidence, and stop.

## Hard Boundaries

Stage 2 RED tests and acceptance mapping were authored by Codex PM/Test Writer.
Stage 3 must be authored by Claude through this Process Adapter path.

Do not create, edit, format, delete, regenerate, or mechanically adjust:

- `test/**`
- test helpers, fixtures, or snapshot fixtures
- `docs/work/BANDIT-059/red-evidence.md`
- `docs/specs/BANDIT-059-red-evidence.json`
- `docs/work/BANDIT-059/brief.md`
- review, landing, landing-action, retrospective, CodeRabbit, or Local Qwen evidence
- dependencies, lockfiles, installed global skills, or unrelated workflow docs

If the RED test is wrong or requires broader scope, stop and record the blocker
in `docs/work/BANDIT-059/writer-report.md`; do not edit the test.

## Required Reads

Read only what is needed from these files before editing:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-059/brief.md`
- `docs/work/BANDIT-059/red-evidence.md`
- `docs/specs/BANDIT-059-red-evidence.json`
- `test/trust-verify.test.mjs`
- `src/cli.ts`
- command/state patterns in `src/commands/role-runs.ts`,
  `src/state/role-run-manifests.ts`, `src/commands/evidence-freshness-slos.ts`,
  and `src/state/evidence-freshness-slos.ts`

## Mission

Make `node --test test/trust-verify.test.mjs` pass by adding the first
compatibility-mode read-only trust verifier surface:

```sh
bandit trust verify <snapshot.json> [--json] [--report <path>]
```

Implement only the behavior exercised by the RED tests and the accepted brief:

- register `trust verify` in `src/cli.ts`;
- validate the snapshot schema fail-closed for required fields used by the
  tests;
- allow only `stage_transition`, `landing`, `closeout`, and
  `evidence_refresh` trust goals;
- compute a deterministic `sha256:` hash from canonicalized snapshot JSON
  independent of object key order and whitespace;
- verify local repo-contained evidence paths and expected `sha256:` content
  digests;
- reject missing files, directories, out-of-repo paths, unsafe `..` evidence
  paths, and digest mismatches with clear diagnostics;
- validate reviewer finding routing for unresolved actionable findings,
  accepted non-blocking findings without rationale, and required operator
  input;
- derive only `trusted`, `needs_repair`, `blocked`, or `requires_operator`;
- emit deterministic JSON reports with no timestamps or live provider/auth/
  queue state;
- keep default verification read-only;
- write a report only when `--report <path>` is explicitly supplied and the
  destination is repo-contained;
- refuse compatibility-period replacement/live-execution flags such as
  `--replace-land-check` and `--run-tests`.

Do not implement Trust Verifier cutover, old gate replacement, test execution,
reviewer execution, model calls, harness queues, auth/provider routing, live
status, artifact creation, workflow routing, landing, closeout, state-index
persistence, server/API mode, scheduler/worktree/claim behavior, dependency
changes, or unrelated cockpit work.

## Editable Paths

Production implementation:

- `src/cli.ts`
- `src/commands/trust.ts`
- `src/state/trust-verify.ts`

Stage 3 evidence:

- `docs/work/BANDIT-059/implementation-evidence.md`
- `docs/work/BANDIT-059/writer-report.md`
- `docs/specs/BANDIT-059-implementation-evidence.json`

Use fewer files if possible. Preserve existing command and state-module style.

## Implementation Order

1. Add a `trust` command router with usage diagnostics for unsupported forms.
2. Add a state module for parsing, canonical hashing, evidence verification,
   reviewer routing validation, verdict derivation, and report writing.
3. Keep report generation deterministic: sort object keys for hashing and do
   not include timestamps.
4. Run focused tests and fix only production code.
5. Write Writer report and implementation evidence.

## Required Verification

Run at least:

```sh
node --test test/trust-verify.test.mjs
npm run typecheck
npm run bandit -- validate
npm run bandit -- role-runs validate BANDIT-059 --json
git diff --check
```

Run broader validation only if your production edits touch shared validators or
workflow-state behavior beyond command registration and the trust verifier.

## Required Writer Evidence

Write `docs/work/BANDIT-059/writer-report.md` with:

- production files changed;
- verification commands and results;
- explicit Test Ownership Boundary statement;
- explicit statement that Stage 3 was authored by Claude through the Process
  Adapter path;
- stop conditions, bootstrap gaps, or follow-up concerns.

Write `docs/work/BANDIT-059/implementation-evidence.md` and
`docs/specs/BANDIT-059-implementation-evidence.json` with:

- Stage 3 status;
- production files changed;
- acceptance coverage;
- verification commands and results;
- clean-code self-check;
- Test Ownership Boundary evidence;
- Bootstrap Model-Family Separation evidence;
- statement that `bandit trust verify` remains read-only compatibility evidence
  and does not replace existing workflow gates or mutate workflow state by
  default;
- bootstrap gaps or follow-up concerns.
