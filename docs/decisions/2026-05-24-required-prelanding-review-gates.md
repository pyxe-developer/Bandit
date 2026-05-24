# Required Pre-Landing Review Gates

## Decision

Every PR requires a pre-landing review loop before the Landing Agent can produce a `safe-to-land` verdict.

The required loop includes CodeRabbit review through the CLI, repair of actionable findings, rerun of affected checks after repair, and at least one adversarial cross-model review. These gates happen before landing, not after merge.

## Rationale

CodeRabbit can have long queue times for GitHub work. Running the CodeRabbit loop before landing lets agents absorb the wait time, repair findings, and avoid expensive post-merge cleanup loops. The operator should see a verdict, not manage review queues.

Required adversarial review preserves cross-model tension. The implementation path and the landing path should not depend only on the same model family validating itself.

## Policy Direction

- CodeRabbit review is part of the pre-landing loop, not a post-landing cleanup step.
- The loop should use CLI automation where available so the agent can poll, repair, and rerun without requiring the operator to watch GitHub.
- Request-changes or unresolved actionable findings block landing.
- If the PR changes after review repair, stale review checks must be rerun before landing.
- At least one adversarial review is required for every PR.

## Not Decided

- Exact CodeRabbit CLI command integration.
- Timeout and retry policy for long CodeRabbit queues.
- Whether multiple adversarial reviews are required by default or only for higher-complexity PRs.
