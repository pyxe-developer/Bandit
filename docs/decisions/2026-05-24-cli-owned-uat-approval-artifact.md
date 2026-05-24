# CLI-Owned UAT Approval Artifact

## Decision

Approved UAT should be recorded as a CLI-owned repo-native artifact.

The Workflow Cockpit may expose an approval button, but that button invokes the CLI. The CLI writes the canonical UAT approval record into the repository state. GitHub labels, PR reviews, or comments may mirror the state for convenience, but they are not the source of truth.

## Rationale

The Landing Agent needs a deterministic local record before it can auto-land a feature slice. Keeping UAT approval repo-native preserves auditability, keeps the web app from becoming hidden workflow truth, and separates product acceptance from code-safety judgment.

## Policy Direction

- The artifact should identify the feature PRD, slice, PR, commit, environment, approver, timestamp, and acceptance scope.
- The approval command should be owner/operator-gated.
- The Landing Agent reads the artifact before producing a `safe-to-land` verdict for feature slices.
- Any branch code change after approval makes UAT stale for v0.
- Cockpit state is derived from the artifact and may be rebuilt.

## Not Decided

- Exact command name.
- Exact artifact path and schema.
- Whether UAT approval can be amended or must be revoked and recreated.
- How v1 should classify non-product-impacting post-UAT changes.
