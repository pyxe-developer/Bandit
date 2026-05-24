# BANDIT-010 RED Evidence

## Status

`red` on 2026-05-24 before production implementation changes.

## Command

```sh
node --test test/landing-gates.test.mjs
```

## Result

The focused landing-gate suite failed as expected after adding tests for the
escalated adversarial reviewer placeholder contract.

Summary:

```text
tests 19
pass 16
fail 3
```

Expected failing behaviors:

- `land-check fails closed when routing requires escalated review with no placeholder artifact`
  - Expected exit code `1`.
  - Actual exit code `0`.
  - This proves `land-check` does not yet require a standalone
    `escalated-review.md` artifact when routing/smell evidence requires
    escalated review.
- `land-check accepts current escalated review bootstrap-gap placeholder evidence`
  - Expected output to include
    `Escalated review evidence: docs/work/BANDIT-912/escalated-review.md`.
  - Actual output only printed `Escalated review: bootstrap_gap`.
  - This proves `land-check` does not yet parse or report placeholder evidence.
- `land-check fails closed when escalated review placeholder evidence is stale`
  - Expected error to include `Escalated review evidence is stale`.
  - Actual error only reported stale review evidence and landing verdict
    evidence.
  - This proves escalated-review placeholder source freshness is not yet
    checked.

## Acceptance Criteria Mapping

- AC1: Demonstrated. Required escalated review is not enforced by
  `land-check`.
- AC3: Failing. Missing placeholder evidence is not yet blocking.
- AC4: Failing. Current explicit bootstrap-gap placeholder evidence is not yet
  parsed or reported.
- AC5: Failing. Stale placeholder evidence is not yet rejected.
- AC7: RED tests now cover missing evidence, bootstrap-gap acceptance, stale
  placeholder rejection, and `not_applicable` behavior.
