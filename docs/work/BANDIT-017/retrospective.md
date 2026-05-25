# BANDIT-017 Retrospective

## Outcome

`BANDIT-017` is landed as a bootstrap workflow-infrastructure chore.

The chore resolved `BANDIT-GAP-LANDING-GATE-COMPLEXITY-HARDENING` by extracting
Stage 4 landing-readiness logic from the CLI orchestration path and by reusing
git repository-state diagnostics within one landing-readiness evaluation. The
result keeps Stage 4 evidence-head semantics fail-closed while reducing the
complexity and repeated probe behavior identified during `BANDIT-016` closeout.

## What Worked

- The RED test made repeated shallow/promisor repository-state probes visible
  and verifiable before implementation.
- `src/state/landing-stage4.ts` now owns Stage 4 stale-evaluation and
  PM-rationale checks, leaving `src/commands/land-check.ts` focused on command
  orchestration.
- `src/state/git.ts` now provides a per-evaluation changed-path reader cache,
  so equivalent changed-path failures reuse repository-state diagnostics without
  persisting derived authority.
- Local Qwen returned `pass` with no findings after the implementation, which
  confirms the follow-up chore addressed the prior reviewer concern without
  starting another hardening loop.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Reviewer-surfaced complexity findings work best when converted into a narrow bootstrap-gap chore after the original behavior lands. | Durable artifact | `BANDIT-017` was scoped from `BANDIT-016` review findings and carried source metadata, hypothesis, metric, baseline, and evaluation window in its brief. |
| Landing-readiness orchestration should delegate policy-heavy Stage 4 checks to focused state helpers. | Durable artifact | `src/state/landing-stage4.ts` now owns the extracted stale-evaluation and PM-rationale logic. |
| Changed-path diagnostics should avoid repeated repository-state probes inside one readiness evaluation. | Durable artifact | `createCachedGitChangedPathsReader` reuses shallow/promisor diagnostics per evaluation while preserving fail-closed missing-base behavior. |
| CodeRabbit remains unavailable for local-record bootstrap chores without PR context. | Existing bootstrap replacement evidence | `docs/work/BANDIT-017/review-evidence.md` records explicit no-pass CodeRabbit bootstrap evidence; no new gap is needed because `BANDIT-GAP-LIVE-CODERABBIT` is already resolved for the fixture-backed live evidence contract. |

## Improvement Chores

No new improvement chore is created from `BANDIT-017`.

The prior improvement hypothesis is resolved:

source_work_item: BANDIT-016
source_gap: BANDIT-GAP-LANDING-GATE-COMPLEXITY-HARDENING
linked_work_item: BANDIT-017
hypothesis: Extracting Stage 4 stale-evaluation/rationale logic and caching or deferring git repository state checks will reduce landing-gate complexity without weakening fail-closed stale-evidence behavior.
metric: Existing landing-gate behavior remains covered by tests while Stage 4 stale-evaluation/rationale logic moves behind clearer module boundaries and failed changed-path classification avoids repeated shallow/promisor state probes.
baseline: `BANDIT-016` ended with Local Qwen reporting `land-check.ts` size/complexity and async git state checks as persistent `non_blocking` findings after implementation behavior was accepted.
evaluation_window: `BANDIT-017` closeout.
status: resolved
outcome: keep
outcome_evidence:
  - `docs/work/BANDIT-017/red-evidence.md` records the repeated-probe failure mode.
  - `docs/work/BANDIT-017/implementation-evidence.md` maps the implementation to acceptance criteria and clean-code compliance.
  - `docs/work/BANDIT-017/local-qwen-review.md` records a `pass` verdict with no findings.
  - `docs/work/BANDIT-017/landing-action.md` records the local-record landing action.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-017`.

Local Qwen passed the completed implementation with no findings. CodeRabbit
was not available because this bootstrap chore had no PR context; the review
evidence records that as explicit replacement evidence rather than claiming a
CodeRabbit pass.

## Bootstrap Gap Disposition

`BANDIT-GAP-LANDING-GATE-COMPLEXITY-HARDENING` is resolved for the bootstrap
scope.

Use the `BANDIT-017` helper boundaries and cached changed-path diagnostics for
future landing-readiness work. Any later broader landing-gate redesign should
be scoped from fresh evidence, not from the resolved `BANDIT-016` Local Qwen
follow-up.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-LIVE-ESCALATED-REVIEWER`.
- `BANDIT-GAP-WORK-ITEM-CREATE-COMMAND`.
- `BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND`.
- `BANDIT-GAP-HEARTBEAT-CHORE-AGENT`.
- `BANDIT-GAP-WORKFLOW-COCKPIT`.
