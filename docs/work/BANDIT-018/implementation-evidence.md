# BANDIT-018 Implementation Evidence

## Status

Implementation recorded on 2026-05-25 after RED evidence head
`30d03cda553d47d34e15dc03f8ba19282f06fe14`. AC10 repair evidence is recorded
in `docs/work/BANDIT-018/ac10-repair-evidence.md`.

## Implemented Behavior

- Added `bandit escalated-review run <work-item-id>` as the CLI-owned live
  escalated reviewer routing path.
- Added `.bandit/policy/escalated-review-routing.json` to record the routing
  contract, source-of-truth artifact, profile source, trigger inputs,
  supported providers, cost-safety defaults, and fail-closed states.
- Added `.bandit/reviewers/escalated-reviewers.json` as the durable configured
  stronger-reviewer profile source.
- Added escalated reviewer profile parsing for
  `.bandit/reviewers/escalated-reviewers.json`.
- Added escalated-review evidence writing for
  `docs/work/<ID>/escalated-review.md`.
- Implemented fixture-backed escalated-review execution for deterministic tests
  without network access, paid credentials, or operator approval.
- Implemented fail-closed paid-provider refusal that records blocking evidence
  and names missing operator-owned provider setup, credentials, and cost
  approval.
- Hardened `land-check` so placeholder-only escalated-review evidence is not
  sufficient when routing selects a configured non-placeholder reviewer.

## Acceptance Criteria Mapping

| AC | Evidence |
|---|---|
| AC2 | `.bandit/policy/escalated-review-routing.json`, `.bandit/reviewers/escalated-reviewers.json`, `src/state/escalated-reviewer-profiles.ts`, and `src/commands/escalated-review.ts` define policy inputs, profile selection, provider boundaries, credential/cost blockers, evidence output, and refusal states. |
| AC3 | `src/cli.ts` exposes `bandit escalated-review run <work-item-id>`. |
| AC4 | Fixture-backed execution is tested without network, paid credentials, or operator approval. |
| AC5 | `writeEscalatedReview` records current fixture-backed pass evidence in `docs/work/<ID>/escalated-review.md`. |
| AC6, AC7 | Non-fixture provider execution fails closed with blocking evidence and exact operator-owned setup/credential/cost approval blockers. |
| AC8 | `land-check` rejects configured live routes that still present placeholder-only bootstrap evidence. |
| AC9 | Existing Local Qwen, CodeRabbit, Stage 4, UAT, auto-landing, Landing Agent, and bootstrap-gap tests pass. |
| AC10 | Focused tests now cover fixture pass, paid-provider setup refusal, reviewer blocker verdicts, stale source heads, unavailable fixture/provider state, timed-out provider state, malformed reviewer output, land-check live-pass integration, and land-check configured-route placeholder rejection. |

## Clean-Code Check

- **Spec alignment:** The implementation follows the `BANDIT-018` brief without
  adding provider network calls, account setup, PR merge behavior, cockpit
  scope, or auto-fix behavior.
- **Small surface area:** Changes are limited to the CLI entrypoint,
  escalated-review command, escalated-review state writer, reviewer-profile
  parser, landing gate enforcement, policy/profile artifacts, tests, and
  work/context evidence.
- **Simple design:** Fixture execution and paid-provider refusal are separated
  by provider type. External provider execution remains disabled unless future
  scoped work adds explicit setup.
- **Explicit state:** Reviewer route, profile, source head, availability,
  verdict, source drift, and blocker rationale are recorded in repo-native
  artifacts.
- **Failure clarity:** Missing paid-provider setup fails closed and names the
  operator-owned setup, credential, and cost approval inputs.
- **Role boundaries:** Codex PM owns technical reviewer routing. Operator-owned
  provider setup, credentials, cost/risk approval, product direction, and UAT
  are not inferred.

## Verification

```sh
node --test --test-name-pattern "escalated-review" test/landing-gates.test.mjs
```

Result: `pass` - 8 focused tests passed after AC10 repair.

```sh
npm test
```

Result: `pass` - 164 tests passed after AC10 repair.

```sh
npm run typecheck
```

Result: `pass`.

```sh
npm run bandit -- validate
```

Result: `pass` - Bandit state is valid.

## Stage-Rubric Check

| Stage | Verdict | Evidence |
|---|---|
| Stage 3: Implementation Clean-Code Rubric | `pass` | Focused and full tests pass; implementation uses explicit repo-native state, narrow command routing, fail-closed refusal paths, and no hidden provider authority. AC10 repair broadened deterministic refusal-path coverage without widening scope. |
| Stage 4: Review And Cross-Model Gates | `pending` | Review evidence must be refreshed at the AC10 repair head before landing verdict or landing action. |

## Next Step

Refresh `BANDIT-018` review evidence at the AC10 repair head before any landing
verdict or landing action.
