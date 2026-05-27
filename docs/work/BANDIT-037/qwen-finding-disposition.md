# BANDIT-037 Local Qwen Finding Repair And Disposition

recorded_time_utc: 2026-05-27T20:09:18Z
work_item: BANDIT-037
base_head: 14e1991
disposition_state: focused_repair_recorded

## Source Evidence

- `docs/work/BANDIT-037/local-qwen-review.md`
- `docs/work/BANDIT-037/implementation-evidence.md`
- `docs/work/BANDIT-037/brief.md`

Local Qwen returned a `non_blocking` Stage 4 verdict for `BANDIT-037` at
source head `229b09405249f932388adaab8af601c75cae03db` with two substantive
findings and one positive fail-closed observation.

## Focused Repair

- Removed the unreachable `origin === "workflow_trial"` branch from
  `isPolicyChangingWorkflowTrial` in `src/state/improvements.ts`. Workflow
  Trial policy-changing candidates are identified through the explicit
  `workflow_trial: true`, `policy_change: true`, or `policy_changing: true`
  metadata fields.

## PM Disposition

| Finding | Verdict | Rationale | Durable routing |
| --- | --- | --- | --- |
| `isPolicyChangingWorkflowTrial` checks `origin === "workflow_trial"`, which conflicts with the schema's boolean `workflow_trial` metadata field. | `repaired` | The branch was unreachable for the current metadata contract and created unnecessary future ambiguity. Removing it keeps policy-changing detection explicit and schema-aligned. | None. Repaired in this step. |
| The brief expected cockpit or reporting surfaces to expose guardrail completeness, but the implementation extended only `improvements candidates --json`. | `no_action` for source repair | `improvements candidates --json` is the repo-native CLI reporting surface for improvement health in this slice. It now exposes `workflow_trial_guardrails` for policy-changing candidates without creating hidden cockpit state or policy authority. Updating `src/state/cockpit-status.ts` or `src/state/cockpit-view-model.ts` would widen this Stage 4 repair beyond the accepted reporting-surface implementation. | None for `BANDIT-037`. Future cockpit slices may present the derived report, but no source repair is required here. |
| Fail-closed validation enforces missing decision criteria, uncertainty or minimum-detectable-effect context, re-evaluation window, and proxy-risk disposition. | `pass` | The finding confirms the implementation satisfies the core guardrail behavior and does not require repair. | None. |

## Stage-Rubric Check

| Stage | Verdict | Evidence |
| --- | --- | --- |
| Stage 3: Implementation Clean-Code Rubric | `pass` | The repair is limited to removing dead policy-changing detection logic and recording PM disposition for the reporting-surface question. It preserves the repo-native Markdown source of truth, keeps derived reports non-canonical, and does not add unrelated cockpit, scheduler, UAT, claim, worktree, CI, dependency, or paid-reviewer scope. |
| Stage 4: Review And Cross-Model Gates | `pending` | Source code and Stage 4 disposition evidence changed after the recorded CodeRabbit and Local Qwen reviews. The next step is to refresh Stage 4 review evidence at the repair/disposition head before aggregate review evidence. |

## Verification

Required verification for this focused repair:

- `node --test test/improvements.test.mjs`
- `npm run typecheck`
- `npm run bandit -- validate`
- `npm run bandit -- gaps list`
- `node ./bin/bandit.mjs cockpit status --json`
- `git diff --check`

## Next Action

Refresh Stage 4 review evidence for `BANDIT-037` at the repair/disposition
head, starting with pre-PR CodeRabbit evidence because source changed after the
existing CodeRabbit pass. Do not create aggregate review evidence, landing
verdict, landing action, retrospective, or unrelated Phase 8 work until current
CodeRabbit and Local Qwen evidence is recorded.
