# BANDIT-005 Implementation Evidence

## Status

GREEN implementation complete on 2026-05-24 and landed as bootstrap
implementation commit `17be6d6775f5c8f00b5130f5569c79f97a94751b`.

Stage 4 review evidence, Stage 5 landing verdict, landing action evidence, and
retrospective closeout are recorded in this work item.

## Implemented Scope

- Added `docs/templates/review-evidence.md` as the repo-native pre-landing
  review evidence contract.
- Added `docs/templates/landing-verdict.md` as the repo-native landing verdict
  contract.
- Extended template validation to require the new review evidence and landing
  verdict templates.
- Added small Markdown metadata parsing helpers for new-contract artifacts.
- Added review evidence parser and validator support for shared verdict values,
  review gate states, bootstrap-gap replacement evidence, resolved
  operator-input status, and source-drift status.
- Added landing verdict parser and validator support for final verdict values,
  landing gate states, UAT, source drift, operator input, Landing Agent state,
  and Landing Agent bootstrap-gap replacement evidence.
- Added a Git-head helper that reports the current repository head when
  available and returns unavailable metadata explicitly when Git metadata cannot
  be read.
- Added `bandit land-check <work-item-id>` to read recorded review evidence and
  landing verdict artifacts, report gate state, and fail closed for missing,
  malformed, stale, blocked, or unsafe `safe-to-land` evidence.
- Repaired the safe-to-land gate during review so tests and verification must
  be recorded as `pass`; unavailable external review gates may use explicit
  bootstrap gaps, but test execution cannot.
- Preserved historical work item compatibility by validating old manual
  `review-evidence.md` and `landing-verdict.md` files only when they opt into
  the new contract with `contract_version:`.
- Updated older test fixtures only where the newly required committed templates
  made previous temp-repo setup incomplete.

## Acceptance Criteria Coverage

| Criteria | Evidence |
|---|---|
| AC1 | `docs/templates/review-evidence.md`, `docs/templates/landing-verdict.md`, and `src/state/templates.ts` define required fields for work item, source head, verification, review gates, PM disposition, bootstrap gaps, UAT, clean-code, source drift, landing agent state, and final verdict. |
| AC2 | `src/state/review-evidence.ts` validates CodeRabbit, local Qwen, and escalated review states against the shared verdict values. `test/landing-gates.test.mjs` covers unsupported gate values. |
| AC3 | `src/state/landing-verdicts.ts` restricts final verdicts to `safe-to-land`, `needs-repair`, `blocked`, and `requires operator approval`. |
| AC4-AC7 | `src/commands/land-check.ts` reports work item, source head, current head, source drift, review gates, bootstrap gaps, UAT, clean-code, and final verdict; tests cover omitted ID, unknown work item, missing review evidence, and missing landing verdict. |
| AC8-AC10 | Review and landing parsers fail closed for missing fields, unsupported values, unresolved operator input, and missing bootstrap-gap replacement evidence; land-check allows explicit bootstrap gaps with replacement evidence during bootstrap. |
| AC11-AC12 | `src/state/git.ts` and `src/commands/land-check.ts` compare recorded heads to current Git head when available, fail closed for stale `safe-to-land` evidence, and report unavailable current head explicitly when Git metadata is absent. |
| AC13 | Historical manual artifacts without `contract_version:` are skipped by new-contract validation; `validate preserves compatibility for historical work items without new-contract landing artifacts` covers the compatibility path. |
| AC14 | The implementation keeps repo-native Markdown artifacts and Git head checks as the only authority. No database, generated index, cockpit state, or hidden cache was added. |
| AC15 | `test/landing-gates.test.mjs` covers success output, missing argument, unknown work item, missing evidence, malformed evidence, missing gates, test bootstrap-gap refusal, explicit review bootstrap gaps, stale evidence, unavailable Git metadata, and historical compatibility. |
| AC16 | Focused and full GREEN verification passed for implementation. `bandit land-check BANDIT-005` passed at landed implementation commit `17be6d6775f5c8f00b5130f5569c79f97a94751b` after review evidence and landing verdict source heads were updated. |

## Verification

Commands run:

```sh
node --test test/landing-gates.test.mjs
npm test
npm run typecheck
npm run bandit -- validate
```

Results:

- `node --test test/landing-gates.test.mjs`: pass, 15/15 tests.
- `npm test`: pass, 64/64 tests.
- `npm run typecheck`: pass.
- `npm run bandit -- validate`: pass, `Bandit state is valid.`

## Clean-Code Self-Check

| Rubric Item | Verdict | Evidence |
|---|---|---|
| Spec alignment | `pass` | Implementation follows the BANDIT-005 brief and RED tests without adding reviewer automation, UAT approval, merge automation, cockpit state, or SQLite indexing. |
| Small surface area | `pass` | Diff is limited to two templates, small parser/validator helpers, one Git-head helper, one `land-check` command, focused tests, evidence, and context updates. |
| Simple design | `pass` | Uses direct metadata parsing and explicit validators; no schema framework, policy engine, database, generated index, or broad Landing Agent was introduced. |
| Explicit state | `pass` | Review gates, source heads, bootstrap gaps, UAT status, clean-code status, and landing decisions live in named repo-native artifacts. |
| No hidden authority | `pass` | `land-check` reads repo artifacts and Git head only; no UI, cache, or generated state owns landing readiness. |
| Testable behavior | `pass` | Success and refusal paths are covered by the focused landing-gates suite and full test suite. |
| Readable flow | `pass` | Template validation, metadata parsing, review evidence parsing, landing verdict parsing, Git head lookup, and command output are separated into named modules. |
| Locality | `pass` | Landing-gate behavior lives under `src/state/**` and `src/commands/land-check.ts`; unrelated production refactors were excluded. |
| Failure clarity | `pass` | Missing templates, missing artifacts, malformed fields, unsupported values, missing bootstrap evidence, stale source evidence, omitted IDs, and unknown work items fail closed with clear messages. |
| No role erosion | `pass` | The command checks recorded evidence; it does not infer product approval, waive missing UAT, run reviewers, or ask the operator for routine code-safety decisions. |
| Improvement capture | `pass` | No new material workflow lesson requires a chore yet. Unavailable CodeRabbit, Qwen, escalated review, and Landing Agent gates remain explicit bootstrap gaps for closeout evidence. |

## Remaining Bootstrap Gaps Before Landing

- CodeRabbit automation is unavailable during bootstrap and must be recorded as
  `bootstrap_gap` with replacement evidence.
- Local Qwen adversarial review is unavailable during bootstrap and must be
  recorded as `bootstrap_gap` with replacement evidence.
- Escalated adversarial review automation is unavailable during bootstrap; this
  parser/validator and landing-gate slice should record the unavailable
  escalation gate honestly.
- Landing Agent is unavailable during bootstrap; the landing verdict must record
  the manual replacement evidence.
- CLI-owned UAT artifacts remain Phase 5 and are `not_applicable` for this
  workflow-infrastructure slice.
