# BANDIT-015 Retrospective

## Outcome

`BANDIT-015` is landed as a bootstrap workflow-infrastructure chore.

The chore converted `BANDIT-GAP-LIVE-CODERABBIT` from a passive open gap into a
repo-native, CLI-owned live CodeRabbit evidence path. The command records
current fixture-backed live CodeRabbit pass evidence, fails closed for missing
PR context, missing credentials, provider unavailability, stale source heads,
request-changes, unresolved actionable findings, and secret exposure, and keeps
landing checks bound to repo-native artifacts.

## What Worked

- The live CodeRabbit path reused the existing `coderabbit-review.md` artifact
  and `land-check` semantics instead of creating a second source of truth.
- Missing PR context and missing credential paths now write actionable
  repo-native evidence before failing closed.
- Tests cover clean live review, request-changes, missing PR context, missing
  credentials, provider errors, secret redaction, and landing-gate consumption.
- The CodeRabbit state remains CLI-owned and does not make chat, terminal
  scrollback, or dashboard state authoritative.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Live CodeRabbit evidence needs explicit provider-state normalization and refusal artifacts. | Durable artifact | Implemented `bandit coderabbit-review live <work-item-id> --pr <number> --fixture <path>` and refreshed `docs/work/BANDIT-015/coderabbit-review.md`. |
| Provider credentials and PR context are operator-owned setup, but refusal evidence is a CLI responsibility. | Durable artifact | Missing context and credential paths write repo-native blocker evidence before throwing. |
| Conservative over-redaction is preferable to exact-match-only redaction for untrusted provider diagnostics. | No-action decision for this chore | Recorded in `docs/work/BANDIT-015/qwen-rerun-disposition.md`; no code change required for this slice. |
| Iterative review artifacts need terminal evidence-head semantics. | Bootstrap-gap chore | Queued `BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS` from the Local Qwen evidence-head loop. |

## Improvement Chores

### BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS

source_work_item: BANDIT-015
source_artifacts:
  - docs/work/BANDIT-015/local-qwen-review.md
  - docs/work/BANDIT-015/qwen-evidence-head-disposition.md
  - docs/work/BANDIT-015/qwen-loop-operator-disposition.md
lesson: Iterative Stage 4 review dispositions can create a recursive evidence-head loop after implementation behavior is accepted.
hypothesis: A narrow Stage 4 evidence-head semantics contract can distinguish historical review artifacts from current landing-gate evidence, prevent recursive rerun loops, and preserve fail-closed stale-evidence checks for actual source changes.
metric: A future work item with iterative review dispositions can reach a terminal Stage 4 verdict in one closeout pass after PM disposition, while source-code changes after review still block landing.
baseline: `BANDIT-015` required repeated Local Qwen reruns and kept producing procedural blockers after implementation behavior was accepted.
evaluation_window: Run as the next bootstrap-gap chore after `BANDIT-015` lands.
status: queued
outcome: pending

## Cross-Model Tension

Local Qwen accepted the implementation behavior but continued to block landing
on recursive evidence-head semantics. Codex PM and the operator accepted the
procedural finding as real workflow debt, converted it into a queued
bootstrap-gap chore, and stopped treating it as a live `BANDIT-015`
implementation blocker.

## Bootstrap Gap Disposition

`BANDIT-GAP-LIVE-CODERABBIT` is resolved for the bootstrap fixture-backed live
CodeRabbit evidence scope. Live provider polling, PR comment repair
orchestration, and rerun automation remain future integration scope unless a
later work item explicitly resolves them.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS`.
- `BANDIT-GAP-LIVE-ESCALATED-REVIEWER`.
- `BANDIT-GAP-WORK-ITEM-CREATE-COMMAND`.
- `BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND`.
- `BANDIT-GAP-HEARTBEAT-CHORE-AGENT`.
- `BANDIT-GAP-WORKFLOW-COCKPIT`.
