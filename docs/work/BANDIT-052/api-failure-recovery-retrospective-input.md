# BANDIT-052 API Failure Recovery Retrospective Input

recorded_time_utc: 2026-05-29T18:34:00Z
work_item: BANDIT-052
source_artifacts:
  - docs/specs/BANDIT-052-coderabbit-review-output.json
  - docs/work/BANDIT-052/coderabbit-review.md
  - docs/roadmap/CURRENT_CONTEXT.md
disposition_owner: Codex PM
operator_input_status: none_required

## Retrospective Lesson

API failures should recover gracefully before stopping the workflow.

When a reviewer, model, or external API fails, Codex PM should:

1. Diagnose the failure from available local and provider evidence.
2. Recover if the failure has a safe mechanical recovery path, such as waiting
   through a provider rate-limit window and retrying the same focused command.
3. Stop only after the same API operation has been retried three times without
   recovery.
4. Escalate to the operator immediately when the failure is not diagnosable from
   available evidence or when the failure is an authentication, credential,
   account, billing, or permission issue.

Stopping completely is reserved for exhausted retry budget, non-diagnosable
provider failure, or operator-owned auth/account input. Routine provider
latency, transient rate limits, and recoverable timeouts should be recorded,
waited out, and retried without changing scope or advancing unrelated gates.

## BANDIT-052 Evidence

During Stage 4 focused pre-PR CodeRabbit review, the broad initial review
entered provider analysis without a terminal verdict, then focused retries hit
recoverable CodeRabbit provider rate limits. Codex PM diagnosed the failures
from the structured CLI output, waited through the provider-reported windows,
retried the same focused review command, repaired one valid context-drift
finding, and reran the repair-head review to `findings: 0`.

This was recoverable without operator input because:

- CodeRabbit auth was valid.
- The provider emitted diagnosable `rate_limit` failures with wait times.
- The retry target was stable and focused.
- No product, policy, business, cost, credential, account, or permission
  decision was required.

The Stage 6 `BANDIT-052` retrospective should include this lesson and either
route it into the queued token-cost/retry-failsafe work or record an explicit
no-action decision if that later gap already covers the policy.

