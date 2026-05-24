# Auto-Land Chores And UAT-Approved Slices

## Decision

The Landing Agent may auto-land both chores and feature slices.

Chores may be auto-landed after the required mechanical gates are green and the chore stays within the approved risk class. Feature slices may be auto-landed only after the required mechanical gates are green and Approved UAT is already recorded.

## Rationale

The operator should not need to merge PRs manually or judge code-safety warnings. At the same time, the Landing Agent must not replace product acceptance. For feature slices, UAT is the human/product gate; landing is the mechanical release action after that gate is satisfied.

## Consequences

- The workflow needs an explicit UAT approval artifact that the Landing Agent can read.
- The Landing Agent can be useful for both maintenance work and product delivery.
- The workflow cockpit should make UAT readiness and landing status visible as separate states.
- A feature PR with green tests but no Approved UAT is blocked, not safe-to-land.

## Not Decided

- The exact UAT approval command name and artifact fields.
- Whether any feature slice types can bypass UAT because they are internal-only.
- The default deployment/canary policy after merge.
