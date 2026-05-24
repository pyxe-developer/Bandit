# Agent-Owned Safe Landing

## Decision

The fresh harness should include a Landing Agent distinct from the Heartbeat Chore Agent.

The Heartbeat Chore Agent may prepare eligible low-risk chores on branches and PRs. The Landing Agent owns the code-safety verdict for landing PRs under explicit policy. The operator should not be asked to decide whether warnings like stale reviews, low coverage, CodeRabbit findings, or test gaps are acceptable unless the question is a product, UAT, policy, or business-risk decision.

Auto-landing scope includes both chores and feature slices. Chores may land after policy gates are green. Feature slices may land after policy gates are green and Approved UAT has already been recorded.

## Rationale

The operator is not expected to be a coder. A workflow that asks "merge anyway?" after presenting code-safety warnings creates a fake human gate: it transfers engineering judgment to the person least equipped to validate it.

The useful pattern from the gstack `ship` workflow is PR hardening: fresh verification, coverage checks, regression tests, PR-body accuracy, pre-landing review, and adversarial review. The useful pattern from `land-and-deploy` is release execution: CI review, merge readiness, merge queue handling, deploy detection, and post-merge verification. The fresh harness should keep those responsibilities, but turn the final readiness gate into an agent-owned Landing Verdict rather than a human warning override.

## Policy Direction

- Green mechanical gates plus an eligible risk class may produce a `safe-to-land` verdict.
- Feature slices require recorded Approved UAT before the Landing Agent can produce a `safe-to-land` verdict.
- CodeRabbit review and required adversarial review must complete before the Landing Agent can produce a `safe-to-land` verdict.
- Auto-fixable mechanical issues may be repaired by the Landing Agent, then all affected checks must be rerun.
- Test failures, unresolved CodeRabbit request-changes findings, stale reviews after code changes, coverage below policy, security/auth/data/schema changes outside the chore envelope, merge conflicts, and deploy health failures block landing.
- The operator is asked for approval on product direction, UAT, ambiguous business tradeoffs, policy changes, explicit risk overrides, external costs, and destructive production actions.
- A blocked Landing Verdict should name the specific evidence and the next agent-owned action, not ask the operator to make a code judgment.

## Not Decided

- Exact risk classes and gate thresholds.
- How CodeRabbit, GitHub, adversarial review, and CI evidence are normalized into the Landing Verdict.
- Whether deploy/canary handling is built into v0 or only enabled for deployable application repos.
