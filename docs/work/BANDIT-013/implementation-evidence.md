# Implementation Evidence: BANDIT-013

## Status

Production implementation completed on 2026-05-24. Review, landing verdict,
landing action, and retrospective evidence are still required before this work
item can land.

## Implemented Scope

- Added the versioned repo-native auto-landing policy artifact at
  `.bandit/policy/auto-landing.json`.
- Added policy parsing and validation in `src/state/auto-landing-policy.ts`.
- Added default policy creation during `bandit init`.
- Added policy validation to `bandit validate`.
- Added read-only `bandit auto-land-check <work-item-id>`.
- Reused the existing landing-readiness path from `land-check` so
  auto-landing eligibility is evaluated over the same review, landing verdict,
  source freshness, reviewer, and UAT evidence.
- Kept merge, push, deploy, commit, repair orchestration, and Landing Agent
  behavior out of scope.

## Acceptance Criteria Mapping

| Acceptance criteria | Evidence |
|---|---|
| 2 | `.bandit/policy/auto-landing.json` records version, safe-to-land, current-source, chore, feature-slice-with-UAT, and no-merge switches. |
| 3 | `src/commands/init.ts` writes the default auto-landing policy when missing. |
| 4 | `src/state/auto-landing-policy.ts` fails closed on unsupported versions, non-boolean switches, unsupported fields, disabled required safety switches, or enabled merge behavior. |
| 5 | Focused test covers eligible chore/workflow-infrastructure work with UAT not applicable. |
| 6 | Focused test covers eligible feature-slice work with current UAT approval. |
| 7 | Focused test covers feature-slice UAT claimed as pass with missing current approval evidence. |
| 8 | `auto-land-check` calls the shared landing-readiness path used by `land-check`. |
| 9 | The command formats an eligibility report only; no merge, commit, push, deploy, or remote action exists in the implementation. |
| 10 | Output names work item, eligibility, class, UAT requirement, policy artifact, and blocking reasons. |
| 11 | Focused tests cover eligible chore, eligible UAT-approved feature slice, missing UAT block, missing command usage, unknown work item refusal, no-mutation behavior, and malformed policy validation. |
| 12 | Full test suite passes. |
| 13 | Focused tests, full tests, typecheck, Bandit validation, and whitespace checks pass. |

## Verification

```text
node --test test/landing-gates.test.mjs
tests 32
pass 32
fail 0
```

```text
npm test
tests 131
pass 131
fail 0
```

```text
npm run typecheck
tsc --noEmit
pass
```

```text
npm run bandit -- validate
Bandit state is valid.
```

```text
git diff --check
pass
```

## Clean-Code Self-Check

Stage 3: Implementation Clean-Code Rubric: `pass`.

- Spec alignment: implementation follows the approved `BANDIT-013` brief and
  does not add merge or production Landing Agent behavior.
- Small surface area: changes are limited to the policy state, init/validate,
  shared landing-readiness access, CLI routing, focused tests, and the default
  policy artifact.
- Explicit state: auto-landing policy lives in a named repo-native artifact.
- No hidden authority: eligibility is derived from repo-native gate artifacts
  and policy state, not chat, UI state, cache, or remote status.
- Testable behavior: focused and full tests cover the new command, missing
  command usage, unknown work item refusal, read-only behavior, and malformed
  policy refusal path.
- Failure clarity: missing UAT and malformed policy paths fail closed with
  actionable messages.
- Role preservation: the command reports eligibility but does not approve UAT,
  override product acceptance, or perform a landing action.

## Bootstrap Gaps

- Landing Agent remains unavailable.
- Live CodeRabbit polling and repair orchestration remain unavailable.
- Live escalated adversarial reviewer routing remains unavailable.
- Heartbeat chore-agent, workflow cockpit, and state index remain unavailable.

## Next Action

Run and record Stage 4 review evidence for `BANDIT-013`, including CodeRabbit
bootstrap disposition, local Qwen review evidence, escalated-review disposition
if required, PM disposition, and then a landing verdict.
