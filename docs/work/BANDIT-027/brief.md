# BANDIT-027: Pre-PR CodeRabbit CLI Review

## Status

Brief Created

work_type: improvement_chore

## Non-Product Work

Repair Bandit's CodeRabbit review workflow so Stage 4 can run CodeRabbit CLI against local diffs before PR creation instead of treating no PR as an automatic bootstrap gap.

## Origin

BANDIT-026 retrospective and operator direction after discovering the current CodeRabbit command models PR-context live review but not the faster pre-PR CLI review path.

origin: retrospective
source_work_item: BANDIT-026
source_artifacts:
  - docs/work/BANDIT-026/retrospective.md
  - docs/work/BANDIT-026/review-evidence.md
  - docs/decisions/2026-05-24-required-prelanding-review-gates.md
  - CONTEXT.md
lesson: Bandit's implemented CodeRabbit path modeled PR-context live review but missed the pre-PR CodeRabbit CLI review loop intended to reduce GitHub CodeRabbit queue waste.
hypothesis: If Stage 4 runs CodeRabbit CLI before PR creation and records current repo-native evidence, later GitHub CodeRabbit review should surface fewer actionable issues and consume less queue/wait time.
metric: github_coderabbit_actionable_findings_after_pr_open plus review_queue_wait_seconds for the next PR-backed Bandit work items.
baseline: BANDIT-026 recorded CodeRabbit as a no-PR bootstrap gap even though the intended workflow is pre-PR CLI review before GitHub CodeRabbit enters the queue.
expected_direction: Decrease GitHub CodeRabbit actionable findings and queue-driven repair churn after this chore lands.
evaluation_window: Evaluate over the next three Bandit work items that reach Stage 4 and the first later PR-backed Bandit landing.
status: planned
outcome: pending

## Scope

- Add a CLI-owned pre-PR CodeRabbit review path for one work item that invokes or models `coderabbit review --agent` against the local diff before a pull request exists.
- Support deterministic tests through fixture or injected-runner behavior so the test suite does not require network, CodeRabbit service access, GitHub authentication, or paid credentials.
- Record real pre-PR CodeRabbit evidence in `docs/work/BANDIT-027/coderabbit-review.md` with provider, review target, current source identity, verdict, findings disposition, executable evidence, and operator-input status.
- Fail closed with explicit evidence when the CodeRabbit CLI is missing, authentication is missing, the provider returns errors, the review times out, or actionable findings remain unresolved.
- Update Stage 4 review and landing expectations so local-record work uses pre-PR CodeRabbit CLI evidence when configured, while preserving the existing PR-backed live review path for PR confirmation.
- Update documentation and policy vocabulary so CodeRabbit pre-landing loop means pre-PR CLI review first, not GitHub-only waiting.

## Acceptance Criteria

- A Bandit command path exists for pre-PR CodeRabbit CLI review and does not require PR context.
- The pre-PR path can target a local review subject against an explicit base branch or base commit without opening a pull request.
- CodeRabbit agent output is normalized into repo-native CodeRabbit evidence using the existing shared verdict vocabulary: `pass`, `blocker`, `non_blocking`, or `bootstrap_gap` only when a true bootstrap gap remains.
- Critical or warning/actionable CodeRabbit issues block landing until repaired or explicitly dispositioned; info-only issues may be recorded as non-blocking only with durable routing or no-action rationale.
- Missing CLI installation, missing authentication, provider failure, timeout, malformed output, or source drift fails closed with clear operator-input or blocker evidence and does not fall back to manual review.
- Stage 4 aggregate review evidence and `land-check` accept current pre-PR CodeRabbit CLI evidence for local-record work without requiring a GitHub PR.
- The existing PR-backed `coderabbit-review live` behavior remains available for PR confirmation and fixture-backed tests.
- Tests cover successful pre-PR evidence capture, missing CLI/auth refusal, provider error/timeout refusal, actionable finding refusal, info-only non-blocking disposition, stale source refusal, and preservation of the PR-backed live path.
- No automatic PR creation, merge, push, deploy, product UAT approval, paid-provider routing, broad GitHub workflow implementation, or CodeRabbit autofix behavior is introduced by this chore.

## Verification Plan

- Write RED tests in the CodeRabbit state/command test area for pre-PR CLI review without PR context.
- Write RED tests for missing CLI/auth, provider error or timeout, actionable findings, info-only findings, stale source, and PR-backed live-path preservation.
- Run the focused CodeRabbit test file after implementation.
- Run npm test.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- qwen-review BANDIT-027 before Stage 4 closeout.
- Run npm run bandit -- land-check BANDIT-027 before landing.
- Run git diff --check.

## Expected Files

- docs/specs/BANDIT-GAP-CODERABBIT-PRE-PR-CLI-REVIEW.json
- docs/work/BANDIT-027/brief.md
- docs/work/BANDIT-027/coordination-log.jsonl
- docs/work/BANDIT-027/red-evidence.md
- docs/work/BANDIT-027/implementation-evidence.md
- docs/work/BANDIT-027/coderabbit-review.md
- docs/work/BANDIT-027/local-qwen-review.md
- docs/work/BANDIT-027/review-evidence.md
- docs/work/BANDIT-027/landing-verdict.md
- docs/work/BANDIT-027/landing-action.md
- docs/work/BANDIT-027/retrospective.md
- .bandit/bootstrap-gaps.json
- .bandit/policy/coderabbit-live.json
- src/commands/coderabbit-review.ts
- src/state/coderabbit-review.ts
- test/coderabbit-state.test.mjs
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md

## Required Evidence

- docs/work/BANDIT-027/brief.md
- docs/work/BANDIT-027/red-evidence.md
- docs/work/BANDIT-027/implementation-evidence.md
- docs/work/BANDIT-027/coderabbit-review.md
- docs/work/BANDIT-027/local-qwen-review.md
- docs/work/BANDIT-027/review-evidence.md
- docs/work/BANDIT-027/landing-verdict.md
- docs/work/BANDIT-027/landing-action.md
- docs/work/BANDIT-027/retrospective.md

## Operator Input Status

No operator-owned input is required to create the work item because the operator has already directed this CodeRabbit workflow correction to be next. Implementation must halt for operator input only if live CodeRabbit CLI authentication, external service access, cost/risk override, policy change beyond pre-PR CLI review, or PR/merge/push/deploy authority is required.
