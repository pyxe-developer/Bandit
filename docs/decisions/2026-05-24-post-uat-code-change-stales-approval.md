# Post-UAT Code Change Stales Approval

## Decision

For v0, any branch code change after UAT approval makes the approval stale.

The Landing Agent must block auto-landing of a feature slice when the branch has code changes after the recorded UAT approval commit. The feature slice needs renewed UAT approval before it can receive a `safe-to-land` verdict.

## Rationale

The harness should not ask the operator to decide whether a post-UAT code change is safe. It should also not ask the Landing Agent to infer product impact in v0. The conservative rule is simple, auditable, and easy for the Workflow Cockpit to display.

## Consequences

- Small repair commits after UAT may require repeat UAT.
- The workflow has a clear incentive to finish mechanical repair before asking for UAT.
- The Landing Agent only needs to compare the UAT approval commit with the current PR head and changed file classes.
- The v0 rule favors trust over merge convenience.

## Not Decided

- The exact code-file classifier.
- Whether docs-only, test-only, or generated-artifact-only changes can preserve UAT in v1.
- Whether renewed UAT can be narrower than the original UAT scope.
