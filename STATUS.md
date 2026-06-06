# Current Context

## Last Updated: 2026-06-06

## Current Work Item: BANDIT-059

## Current Status

Bandit is in Phase 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust
Layer Pivot.

`BANDIT-059` is active. Repo PM created the Trust Verify Snapshot Foundation
work item from `docs/specs/BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION.json`
and linked `BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION` as the active
bootstrap chore.

`BANDIT-058` is closed. It delivered the Role Contracts And Run Manifests slice
under `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`, including role contract
policy evidence, role-run manifest evidence, CLI validation, fail-closed
authority and path-containment checks, focused tests, Stage 4 review evidence,
Stage 5 landing evidence, local-record landing action, and Stage 6
retrospective/improvement/gap disposition.

The Pi/Aperture harness-specific path is superseded by
`docs/decisions/2026-06-05-harness-agnostic-cli-trust-layer.md`.

Current stage: Stage 4 CodeRabbit timeout continuation required after accepted
Claude Stage 3 implementation.

Latest Stage 3 verification: 2026-06-06; `node --test
test/trust-verify.test.mjs` passed 8/8, `npm run typecheck` passed,
`npm run bandit -- validate` passed, `npm run bandit -- role-runs validate
BANDIT-059 --json` passed, and `git diff --check` passed.

Latest Stage 4 CodeRabbit evidence: 2026-06-06; `coderabbit review --agent
--base origin/main --no-color` reached provider setup/summarizing but produced
no terminal verdict for more than five minutes before SIGTERM. Bandit rendered
the fail-closed timeout artifact at
`docs/work/BANDIT-059/coderabbit-review.md`.

Next action: Run a focused Stage 4 CodeRabbit pre-PR retry for BANDIT-059
against the implementation delta, or record a provider-timeout disposition if
the retry again produces no terminal verdict; do not run Local Qwen or
aggregate review evidence until CodeRabbit timeout/finding disposition is
recorded.

The prior Stage 3 operator unblock is satisfied: the operator approved using
the ready `claude -p` Process Adapter profile, and Claude recorded
`docs/work/BANDIT-059/implementation-evidence.md`,
`docs/work/BANDIT-059/writer-report.md`, and
`docs/specs/BANDIT-059-implementation-evidence.json`. Codex PM acceptance is
recorded at `docs/work/BANDIT-059/stage3-pm-review.md`.

`BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` is queued as a cleanup candidate to
separate artifact-renderer JSON inputs and reviewer captures from work/gap specs
in `docs/specs/`. Promote it before Trust Verify Snapshot Foundation only if
artifact-input path clarity blocks the verifier/report contract.

## Recently Completed / In Progress

Last 5 items only:

- `BANDIT-059` - Trust Verify Snapshot Foundation (Stage 4 CodeRabbit timeout continuation required)
- `BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION` - active bootstrap chore for read-only verifier foundation
- `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` - source material for harness-agnostic trust-layer pivot
- `BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` - queued cleanup candidate for overloaded `docs/specs/`
- `BANDIT-058` - Role Contracts And Run Manifests (closed)
