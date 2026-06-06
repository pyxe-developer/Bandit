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

Current stage: Stage 5 landing verdict required after accepted aggregate Stage 4
review evidence for the Claude Stage 3 implementation, CodeRabbit
provider-timeout disposition, and Local Qwen pass evidence.

Latest Stage 3 verification: 2026-06-06; `node --test
test/trust-verify.test.mjs` passed 8/8, `npm run typecheck` passed,
`npm run bandit -- validate` passed, `npm run bandit -- role-runs validate
BANDIT-059 --json` passed, and `git diff --check` passed.

Latest Stage 4 CodeRabbit evidence: 2026-06-06; two `coderabbit review --agent
--base origin/main --no-color` attempts reached provider setup, sandbox
preparation, and summarizing but produced no terminal verdict. Codex PM
recorded provider-refusal/bootstrap_gap disposition at
`docs/work/BANDIT-059/coderabbit-timeout-disposition.md`; CodeRabbit is not
treated as pass evidence.

Latest Stage 4 Local Qwen evidence: 2026-06-06; `npm run bandit -- qwen-review
BANDIT-059` passed at source head
`83d889cb9c2816840303bd06907099a7efe4f402` with zero findings and wrote
`docs/work/BANDIT-059/local-qwen-review.md`.

Next action: Record Stage 5 landing-gate evidence and landing verdict for
BANDIT-059 before any landing action.

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

- `BANDIT-059` - Trust Verify Snapshot Foundation (Stage 5 landing verdict required)
- `BANDIT-GAP-TRUST-VERIFY-SNAPSHOT-FOUNDATION` - active bootstrap chore for read-only verifier foundation
- `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` - source material for harness-agnostic trust-layer pivot
- `BANDIT-GAP-ARTIFACT-INPUT-DIRECTORY-SPLIT` - queued cleanup candidate for overloaded `docs/specs/`
- `BANDIT-058` - Role Contracts And Run Manifests (closed)
