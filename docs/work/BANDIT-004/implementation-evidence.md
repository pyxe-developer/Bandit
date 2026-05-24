# BANDIT-004 Implementation Evidence

## Status

GREEN implementation complete on 2026-05-24.

Next required action: record review evidence, clean-code/stage-rubric disposition, and landing verdict before any landing action.

## Implemented Scope

- Added canonical Smell Trigger Catalog seed at `.bandit/policy/smell-triggers.json`.
- Added routing decision template at `docs/templates/routing-decision.md`.
- Added catalog parsing and validation in `src/state/smell-triggers.ts`.
- Added routing decision parsing and validation in `src/state/routing-decisions.ts`.
- Extended `bandit validate` to require the smell catalog, routing template, and valid routing-decision artifacts when present.
- Added `bandit route <work-item-id>` in `src/commands/route.ts` and `src/cli.ts`.
- Added `docs/work/BANDIT-004/routing-decision.md` as the first recorded routing decision.
- Updated tests to seed the catalog when validating temp repos under the new required policy.

## Acceptance Criteria Coverage

| Criteria | Evidence |
|---|---|
| AC1, AC2 | `.bandit/policy/smell-triggers.json` contains stable IDs and covers workflow gates, UAT, evidence freshness, CodeRabbit, adversarial review, security/privacy/auth, data integrity, schema/migration, infra/deploy/release/billing, parsers, validators, JSONL logs, registries, indexes, generated schemas, large scope, orchestration, test boundaries, missing coverage, repair loops, context pressure, unavailable agents, malformed evidence, and policy drift. |
| AC3 | `src/state/smell-triggers.ts` validates required fields, duplicate IDs, severity, action, and evidence fields. |
| AC4 | `docs/templates/routing-decision.md` and `src/state/templates.ts` define the required routing contract. |
| AC5, AC6 | `src/state/routing-decisions.ts` validates recorded workflow/skill/agent/reviewer/escalation decisions, known smell IDs, required fields, and resolved operator-input status. |
| AC7, AC8 | `bandit route <work-item-id>` reports recorded route, smells, escalation outcome, evidence, operator input, bootstrap gaps, and final decision. |
| AC9-AC12 | `test/routing.test.mjs` covers omitted ID, unknown work item, missing artifact, malformed/unknown smell IDs, and hidden operator-input refusal. |
| AC13, AC14 | The command reads recorded artifacts only; no prose inference, generated index, SQLite authority, or cockpit state was introduced. |
| AC15, AC16 | Focused and full verification passed. |

## Verification

Commands run:

```sh
node --test test/routing.test.mjs
npm test
npm run typecheck
npm run bandit -- validate
npm run bandit -- route BANDIT-004
git diff --check
```

Results:

- `node --test test/routing.test.mjs`: pass, 11/11 tests.
- `npm test`: pass, 47/47 tests.
- `npm run typecheck`: pass.
- `npm run bandit -- validate`: pass, `Bandit state is valid.`
- `npm run bandit -- route BANDIT-004`: pass, reports `tdd-green-implementation`, four applicable smell IDs, `bootstrap_manual_evidence`, and `operator_input_status: none_required`.
- `git diff --check`: pass.

## Clean-Code Self-Check

| Rubric Item | Verdict | Evidence |
|---|---|---|
| Spec alignment | `pass` | Implementation follows the `BANDIT-004` brief and RED tests without broadening into smell inference or reviewer automation. |
| Small surface area | `pass` | Changes are limited to policy seed, routing template/artifact, validation helpers, one route command, and focused tests. |
| Simple design | `pass` | Uses direct JSON and Markdown metadata parsers; no schema framework, database, DSL, generated index, or cockpit authority. |
| Explicit state | `pass` | Catalog and routing decisions are named repo-native artifacts. |
| No hidden authority | `pass` | Validation and route output read canonical repo artifacts only. |
| Testable behavior | `pass` | Success and refusal paths are covered by focused routing tests plus full suite. |
| Readable flow | `pass` | Catalog validation, routing-decision validation, and route output are separate modules/functions. |
| Locality | `pass` | Routing logic is near state validation and command handling; unrelated refactors were excluded. |
| Failure clarity | `pass` | Missing policy/template/artifact, duplicates, unsupported actions, unknown smells, omitted ID, unknown work item, and unresolved operator input fail closed with explicit messages. |
| No role erosion | `pass` | Codex PM owns routing decisions; operator-owned input remains surfaced as a blocker rather than guessed. |
| Improvement capture | `pass` | No new material workflow lesson requires a chore yet; bootstrap gaps are recorded for unavailable final gates. |

## Remaining Bootstrap Gaps Before Landing

- CodeRabbit automation unavailable during bootstrap.
- Local Qwen adversarial gate unavailable during bootstrap.
- Escalated adversarial review gate unavailable during bootstrap.
- Landing Agent unavailable during bootstrap.
- UAT artifact unavailable, but expected `not_applicable` for this workflow-infrastructure slice.

These must be recorded in review evidence and landing verdict before landing.
