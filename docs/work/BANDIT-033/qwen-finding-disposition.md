# BANDIT-033 Local Qwen Finding Disposition

## Summary

Local Qwen returned a `non_blocking` Stage 4 verdict for `BANDIT-033` at
source head `39d3d0c5ae4408953504176d7157757e7b2699fd`.

Codex PM accepts the implementation for Stage 4. CodeRabbit completed the real
pre-PR agent review against `origin/main` and returned five minor findings
limited to the archived prototype/design-source artifacts. Those CodeRabbit
findings are dispositioned as no-action for this slice because the production
implementation lives in the typed cockpit view-model, guarded-action, and
render-contract modules, and this slice does not adopt, serve, or ship the
standalone prototype source.

The Local Qwen findings are real hardening observations, but they do not block
Stage 4 because the current implementation remains presentation-only,
source-linked, CLI-authoritative, and covered by focused view-model and render
contract tests. The findings are routed as a durable follow-up candidate before
landing.

## Findings

### Render-Layer Action Derivation

**Finding:** `src/cockpit/render.ts` duplicates action eligibility logic through
`deriveCockpitActionAffordancesFromViewModel` instead of consuming pre-derived
action affordances from `src/state/cockpit-actions.ts` or the view model.

**Disposition:** `non_blocking` follow-up candidate.

**Rationale:** The duplicate logic is intentionally shallow and deterministic in
this first visual shell, and it does not grant hidden workflow authority or
mutate repo state. Consolidating action affordances into one presentation
boundary would reduce future drift, but doing that now would widen the slice
after Stage 3 passed and is safe to route as the next cockpit shell hardening
candidate.

### Queue Context Mapping Explicitness

**Finding:** `src/state/cockpit-view-model.ts` maps `queue_context` through
`status.bootstrap_gaps.status` and `status.bootstrap_gaps.source` without an
explicit light queue context branch.

**Disposition:** `non_blocking` follow-up candidate.

**Rationale:** The current mapping is safe for the recorded repo state and keeps
the first visual shell read-only and source-linked. The brief intentionally
scopes "light queue/context" without implementing a full intake, scheduler,
claimability, or workstream queue. A clearer explicit queue-context mapping is
useful hardening for the next visual shell iteration, but it is not a blocker
for this slice.

## Durable Routing

### Chore Candidate: `BANDIT-033-COCKPIT-SHELL-HARDENING`

origin: Local Qwen non-blocking Stage 4 findings from `BANDIT-033`.
source_work_item: BANDIT-033
source_artifacts:
  - docs/work/BANDIT-033/local-qwen-review.md
  - docs/work/BANDIT-033/qwen-finding-disposition.md
lesson: The first attention-first cockpit shell should consolidate action
  affordance derivation and make light queue/context mapping explicit before
  the cockpit UI grows beyond the initial presentation shell.
hypothesis: Cockpit shell maintenance risk will decrease if guarded action
  affordances have one derived source and queue/context categories have explicit
  source-linked mapping before later cockpit slices add more views or actions.
metric: Future Stage 4 reviews of cockpit visual shell work do not repeat action
  derivation duplication or implicit queue-context mapping findings.
baseline: `BANDIT-033` establishes the first presentation-only visual shell with
  source-linked attention categories, guarded controls, and no hidden workflow
  authority, while keeping action affordance derivation shallow and queue
  context lightweight.
expected_direction: Visual shell changes remain easier to audit as cockpit
  surfaces expand.
evaluation_window: Evaluate when the next cockpit visual shell, guarded action,
  queue/context, or evidence-drilldown slice changes these surfaces.
status: queued_candidate
linked_work_item: none_yet
outcome: pending
