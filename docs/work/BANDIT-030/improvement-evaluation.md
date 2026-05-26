# BANDIT-030 Improvement Evaluation

candidate_id: BANDIT-023
source_artifacts:
  - docs/work/BANDIT-023/retrospective.md
  - docs/work/BANDIT-023/review-evidence.md
  - docs/work/BANDIT-025/review-evidence.md
  - docs/work/BANDIT-025/qwen-finding-disposition.md
  - docs/work/BANDIT-028/review-evidence.md
  - docs/work/BANDIT-028/qwen-finding-disposition.md
  - docs/work/BANDIT-029/review-evidence.md
  - docs/work/BANDIT-029/qwen-finding-disposition.md
metric: adversarial_repair_count
baseline: BANDIT-015 required multiple Local Qwen reruns before the operator ended a recursive Stage 4 loop; BANDIT-022 landed with two Local Qwen non_blocking hardening findings queued as chore candidates.
observed_metric_evidence: BANDIT-025, BANDIT-028, and BANDIT-029 each reached Stage 4 with Local Qwen non_blocking findings, recorded PM disposition plus durable routing or no-action rationale, and proceeded without repeated Local Qwen reruns caused only by future-hardening findings. No CodeRabbit request-changes, stale review-subject hash, missing PM disposition, or blocker Local Qwen behavior was relaxed.
comparison_to_baseline: The baseline included recursive or unresolved non-blocking-review churn; the observed window routed five later Local Qwen hardening findings and one explicit no-action decision through repo-native artifacts without reopening accepted implementation behavior solely for non-blocking future hardening.
result: effective
decision: keep
rationale: Repo evidence supports keeping the BANDIT-023 non-blocking review-finding routing policy. The policy reduced repeated adversarial-review loops for safe-to-defer hardening findings while preserving fail-closed behavior for blocker findings, stale evidence, CodeRabbit request-changes, and missing PM disposition.
routing_action: keep the current non-blocking review-finding routing policy; continue requiring concrete PM disposition plus durable follow-up chore, improvement candidate, or explicit no-action decision before Stage 4 can pass

## Observed Stage 4 Outcomes

| Work item | Local Qwen outcome | Routing outcome | Repair churn |
| --- | --- | --- | --- |
| BANDIT-025 | `non_blocking` with timestamp validation, work-type parsing, and evidence-integrity findings. | Three durable candidates are recorded in `docs/work/BANDIT-025/qwen-finding-disposition.md`; aggregate review evidence records PM disposition and non-blocking routing. | No repeated Local Qwen loop caused only by those future-hardening findings. |
| BANDIT-028 | `non_blocking` with actor identity validation finding. | `BANDIT-028-ACTOR-IDENTITY-VALIDATION` is recorded in `docs/work/BANDIT-028/qwen-finding-disposition.md`; aggregate review evidence records PM disposition. | No repeated Local Qwen loop caused only by that future-hardening finding. |
| BANDIT-029 | `non_blocking` with improvement scaling/parser hardening plus a required-hypothesis compatibility concern. | `BANDIT-029-IMPROVEMENT-SCALING-AND-PARSER-HARDENING` is recorded as a durable candidate; required-hypothesis compatibility is an explicit no-action decision. | No repeated Local Qwen loop caused only by those future-hardening findings. |

## Boundary Check

- CodeRabbit request-changes and unresolved actionable findings remain blockers.
- Local Qwen blocker verdicts remain blockers unless repaired, escalated, or explicitly resolved by the existing landing policy.
- Missing PM disposition or missing durable routing for non-blocking findings remains fail-closed.
- Stale review-subject hash behavior remains fail-closed.
- No Phase 8 cockpit, scheduler, claim lease, worktree lifecycle, product UAT, merge, push, deploy, actor identity policy, or unrelated coordination hardening work is introduced by this evaluation.
