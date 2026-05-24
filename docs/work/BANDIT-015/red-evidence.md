# BANDIT-015 RED Evidence

## Status

`pass` - RED evidence is recorded. The focused tests fail because the current
`bandit coderabbit-review` command only reads repo-native
`coderabbit-review.md` evidence and has no `live` subcommand, live CodeRabbit
contract, fixture-backed provider boundary, credential/PR-context refusal path,
secret redaction, or live-normalized evidence writer.

## Test Command

```sh
node --test test/coderabbit-state.test.mjs
```

## Result

```text
tests 16
pass 9
fail 7
```

Failing tests:

1. `coderabbit-review live reports usage when the work item ID is omitted`
   - Expected usage for `bandit coderabbit-review live <work-item-id>`.
   - Actual result: `Work item not found: live`, proving no live subcommand
     routing exists.
2. `coderabbit-review live captures clean current review evidence from a fixture`
   - Expected a fixture-backed live pass to write
     `docs/work/BANDIT-976/coderabbit-review.md`.
   - Actual result: `Work item not found: live`.
3. `coderabbit-review live records request changes as blocking evidence`
   - Expected unresolved actionable findings to write blocker CodeRabbit
     evidence and exit non-zero.
   - Actual result: `Work item not found: live`.
4. `coderabbit-review live fails closed when PR context is missing`
   - Expected a missing-PR-context refusal.
   - Actual result: `Work item not found: live`.
5. `coderabbit-review live records missing credentials as operator input blocked evidence`
   - Expected `GITHUB_TOKEN` setup to be recorded as operator-owned blocked
     input without storing a token value.
   - Actual result: `Work item not found: live`.
6. `coderabbit-review live redacts credential values from provider errors`
   - Expected provider errors to redact secret values in terminal output and
     repo-native evidence.
   - Actual result: `Work item not found: live`.
7. `land-check consumes live-normalized CodeRabbit pass evidence`
   - Expected live-normalized CodeRabbit pass evidence to satisfy the existing
     `land-check` CodeRabbit pass path.
   - Actual result: `Work item not found: live`.

## Acceptance Criteria Mapping

| Acceptance Criteria | RED Evidence |
|---|---|
| AC1 | The focused run proves Bandit cannot request, read, poll, or normalize live CodeRabbit/GitHub review state through CLI authority. |
| AC2 | The tests define the missing live CodeRabbit loop contract: PR context, provider input, supported review states, evidence output, and refusal paths. |
| AC3 | The tests select the narrow CLI surface: `bandit coderabbit-review live <work-item-id> --pr <number> --fixture <path>`. |
| AC4 | `land-check consumes live-normalized CodeRabbit pass evidence` requires live output to reuse the existing CodeRabbit evidence artifact and landing semantics. |
| AC5 | Clean fixture-backed review requires current passing CodeRabbit evidence. |
| AC6 | Request changes, unresolved findings, missing PR context, missing credentials, and unavailable provider states are all fail-closed RED cases. |
| AC7 | Missing credentials are specified as operator-owned setup input, not inferred as a technical pass. |
| AC8 | Clean and provider-error tests require secret token values to stay out of terminal output and repo-native evidence. |
| AC9 | The command tests do not allow autofix, merge, push, deploy, UAT, or paid-model routing behavior. |
| AC10 | The land-check test requires current live-normalized CodeRabbit evidence before aggregate CodeRabbit pass claims can land. |
| AC11 | Focused tests cover clean review, request-changes, unresolved findings, missing PR context, missing credentials, unavailable provider state, secret redaction, and land-check integration. |

## Stage-Rubric Check

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 2: Test Design And RED Evidence | `pass` | Tests express live CodeRabbit loop behavior before production implementation. The failures are due to the missing live subcommand and provider boundary, not syntax or fixture setup errors. |
| Stage 3: Implementation Clean-Code Rubric | `pending` | Production implementation has not started. |

## Next Step

Implement the smallest live CodeRabbit loop contract, fixture-backed provider
boundary, evidence writer, credential/PR-context refusal paths, redaction, and
landing-gate integration needed to make the focused tests pass. Do not add live
remote merge, push, deploy, autofix, UAT, escalated-review routing, or cockpit
behavior in this slice.
