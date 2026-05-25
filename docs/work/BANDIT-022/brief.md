# BANDIT-022: Heartbeat Chore Agent Contract

## Status

Brief Created

## Non-Product Work

Resolve the bootstrap gap for a CLI-governed heartbeat chore-agent that can inspect eligible low-risk chore work without becoming hidden workflow authority.

## Origin

Bootstrap gap BANDIT-GAP-HEARTBEAT-CHORE-AGENT is the next queued open gap after BANDIT-021 resolved the general artifact creation command.

## Scope

- Define the narrow heartbeat chore-agent authority envelope from existing Bandit policy and decision artifacts.
- Add a CLI-owned heartbeat inspection path that reports eligible low-risk chores or due improvement evaluations from repo-native state.
- Record why a chore is eligible, ineligible, blocked, or waiting for operator-owned input without starting feature work or bypassing gates.
- Preserve CLI Authority, repo-native source of truth, Landing Agent separation, UAT boundaries, and safe trigger point constraints.
- Fail closed when the heartbeat policy is missing, malformed, attempts unsupported write or landing actions, or cannot prove work-item eligibility from repo artifacts.

## Acceptance Criteria

- The chore brief exists at docs/work/BANDIT-022/brief.md and links to BANDIT-GAP-HEARTBEAT-CHORE-AGENT.
- The future implementation defines a narrow heartbeat chore-agent policy contract that separates inspection, preparation, landing, product UAT, and operator-owned policy decisions.
- The CLI exposes one bounded heartbeat command or command family that derives candidate status from repo-native work items, bootstrap gaps, improvement metadata, and policy artifacts.
- The command refuses unsupported automation actions, feature slices requiring UAT, ambiguous policy, dirty or stale workflow state, and missing required evidence before taking action.
- The implementation includes focused tests for eligible chores, ineligible chores, due improvement evaluations, blocked operator-input cases, malformed policy, and fail-closed refusal paths.
- Heartbeat output records enough evidence for Codex PM or a future automation to continue without relying on chat history.
- No cockpit, cross-repo coordination, paid provider routing, automatic merge/push/deploy, or feature implementation workflow is introduced by this chore.

## Verification Plan

- Run focused tests for the heartbeat chore-agent policy and command behavior.
- Run npm test if implementation touches shared command routing, work-item parsing, improvement metadata, bootstrap gaps, policy loading, or validators.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- gaps list.
- Run npm run bandit -- qwen-review BANDIT-022 before Stage 4 closeout.
- Run npm run bandit -- land-check BANDIT-022 before landing.
- Run git diff --check.

## Expected Files

- docs/work/BANDIT-022/brief.md
- docs/work/BANDIT-022/red-evidence.md
- docs/work/BANDIT-022/implementation-evidence.md
- docs/work/BANDIT-022/local-qwen-review.md
- docs/work/BANDIT-022/review-evidence.md
- docs/work/BANDIT-022/landing-verdict.md
- docs/work/BANDIT-022/landing-action.md
- docs/work/BANDIT-022/retrospective.md
- .bandit/policy/heartbeat-chore-agent.json
- src/commands/heartbeat.ts
- src/state/heartbeat-policy.ts
- src/cli.ts
- test/heartbeat-chore-agent.test.mjs

## Required Evidence

- docs/work/BANDIT-022/brief.md
- docs/work/BANDIT-022/red-evidence.md
- docs/work/BANDIT-022/implementation-evidence.md
- docs/work/BANDIT-022/local-qwen-review.md
- docs/work/BANDIT-022/review-evidence.md
- docs/work/BANDIT-022/landing-verdict.md
- docs/work/BANDIT-022/landing-action.md
- docs/work/BANDIT-022/retrospective.md

## Operator Input Status

No operator-owned input is required before creating this chore brief or RED evidence. If implementation cannot derive the heartbeat permission envelope from existing repo policy and decision artifacts, it must halt and ask for the exact policy input instead of guessing.
