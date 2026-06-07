# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-065` is landed and closed out. It delivered the Harness-Portable
Orchestrator Prompt Contract under
`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`.

Repo PM reviewed the remaining
`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` source material on 2026-06-07
and recorded explicit no-action in `.bandit/bootstrap-gaps.json`. The
trust-layer-compatible role-scoped pieces are already landed through
`BANDIT-057`, `BANDIT-058`, and `BANDIT-065`; the remaining role input packet,
execution packet, live A2A, queue, scheduler, claim/worktree, repair
continuation, and landing/closeout handoff ideas are runtime/harness source
material outside Bandit's load-bearing deterministic CLI Trust Layer unless a
future product or trust-layer decision scopes them.

`BANDIT-066` is landed and closed out. It delivered the first browser-served
Workflow Cockpit app shell and static preview while preserving CLI authority
and presentation-only browser state.

`BANDIT-067` is landed and closed out. It delivered the Live Cockpit Status
View From CLI Payload slice, including source-linked first-screen cues and a
full Stage 0-6 gate strip in the browser shell while preserving CLI authority
and presentation-only browser state.

`BANDIT-068` is landed and closed out. It delivered the Evidence Drilldown And
Gate Matrix slice, including source-linked Stage gate matrix rows and Evidence
detail rows in the browser shell while preserving CLI authority and
presentation-only browser state.

`BANDIT-GAP-TEST-STRENGTH-MUTATION-ADEQUACY-GATE` is queued from operator
direction on 2026-06-07. It should become the next bootstrap-gap chore after
the active `BANDIT-068` slice lands and closes out; do not start it before the
current slice boundary is satisfied.

`BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE` is also queued from operator
direction on 2026-06-07. It is ordered behind the test-strength gate and should
not start until `BANDIT-068` is landed/closed and the test-strength gate is
resolved, blocked, or explicitly dispositioned.

`BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` is queued from operator direction
on 2026-06-07. It records the private, non-public distribution posture: Bandit
should be installable in multiple private repos and the CLI should alert when a
newer private update is available. It is ordered behind the oracle-provenance
gate unless the operator explicitly reprioritizes the bootstrap-gap queue.

The remaining verification-layer opportunities from the 2026-06-07 review are
recorded as queued bootstrap gaps behind the private install/update channel:
Replay Regression Corpus, Gate Determinism And Flake Gate, Metamorphic
Cross-Projection Checks, Reviewer Calibration With Seeded Defects, Evidence
Bundle Attestation, and Spec-To-Evidence Traceability Matrix. They must not
start before `BANDIT-068` is landed/closed and earlier queued gaps are resolved,
blocked, or explicitly dispositioned.

**Active work item:** `BANDIT-068` (formation approved).
**Active work item:** `BANDIT-068` (closed).

The current stage is Stage 6: closed.

**Current next action:** Create the next Phase 8 Guarded CLI Action Requests
slice through Repo PM Stage 1 formation before RED evidence.

No Trust Verifier cutover is approved, no Trust Goal is selected for cutover,
no old gate path is replaced or wrapped, no Pi/Aperture runtime work is active,
and no merge/push/deploy behavior is authorized.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8000/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action. CLI-owned product UAT for
`BANDIT-068` is recorded under `docs/work/BANDIT-068/uat-approval.md`, the
landing verdict is recorded under `docs/work/BANDIT-068/landing-verdict.md`,
and local-record landing evidence is recorded under
`docs/work/BANDIT-068/landing-action.md`. Stage 6 retrospective and
improvement disposition are recorded under `docs/work/BANDIT-068/`.
Halt for operator input if a future step would approve Trust Verifier cutover
policy, select a Trust Goal for cutover, replace or wrap an older gate path,
merge/push/deploy, change product or UAT direction, approve business tradeoffs,
approve explicit cost/risk posture, choose local API shape, approve State Index
timing, approve guarded action execution authority, approve external service
setup, or make another policy/product decision repo artifacts cannot answer.

## Active Work

`BANDIT-066` is landed and closed out. Its Stage 1 through Stage 6 evidence is
recorded under `docs/work/BANDIT-066/`, and local-record landing action
evidence is recorded at `docs/work/BANDIT-066/landing-action.md`.

`BANDIT-067` is landed and closed out. Its Stage 1 through Stage 6 evidence is
recorded under `docs/work/BANDIT-067/`, and local-record landing action
evidence is recorded at `docs/work/BANDIT-067/landing-action.md`.

`BANDIT-068` has Stage 1 formation, Work Item PM orchestration, Stage 2 RED,
Stage 3 Claude implementation, Stage 4 review evidence, CLI-owned product UAT,
Stage 5 landing verdict evidence, local-record landing action evidence,
retrospective, and improvement disposition recorded under
`docs/work/BANDIT-068/`.

The next allowed action is Repo PM Stage 1 formation for the Guarded CLI Action
Requests slice. Do not start RED evidence, implementation, merge, push, deploy,
Trust Verifier cutover, guarded browser action execution, local API work, State
Index work, scheduler execution, claim execution, worktree execution, or
unrelated Phase 8 scope before the next work item is formed and approved.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` is resolved with disposition
`no_action`. `BANDIT-GAP-TEST-STRENGTH-MUTATION-ADEQUACY-GATE` is queued after
the active `BANDIT-068` slice and before the next unrelated Phase 8 cockpit
product slice. `BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE` is queued
behind the test-strength gate as the next verification-layer hardening gap.
`BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` is queued behind the
oracle-provenance gate as the private install/update-channel hardening gap.
`BANDIT-GAP-REPLAY-REGRESSION-CORPUS`,
`BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE`,
`BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS`,
`BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS`,
`BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION`, and
`BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` are queued after the private
install/update channel as the remaining verification-layer hardening backlog.

`BANDIT-065` is landed and closed out. Its Stage 1 through Stage 6 evidence is
recorded under `docs/work/BANDIT-065/`, and local-record landing action
evidence is recorded at `docs/work/BANDIT-065/landing-action.md`.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION-ORCHESTRATOR-PROMPT` is resolved
by `BANDIT-065`; the gap ledger points to
`docs/work/BANDIT-065/retrospective.md`.

`BANDIT-064` is landed and closed out. It resolved
`BANDIT-GAP-TRUST-VERIFIER-CUTOVER-GATE-TRIAGE`.

`BANDIT-063` is landed and closed out. It resolved
`BANDIT-GAP-WORK-ITEM-PM-PLAN-MODE-ORCHESTRATION`.
