# BANDIT-004 Review Evidence

## Scope

This evidence covers Stage 4: Review And Cross-Model Gates for Routing Decision
And Smell Trigger Catalog.

The review applies to the current uncommitted `BANDIT-004` implementation and
its work-item evidence.

## Reviewed Source

- `.bandit/policy/smell-triggers.json`
- `docs/templates/routing-decision.md`
- `docs/work/BANDIT-004/brief.md`
- `docs/work/BANDIT-004/red-evidence.md`
- `docs/work/BANDIT-004/implementation-evidence.md`
- `docs/work/BANDIT-004/routing-decision.md`
- `src/cli.ts`
- `src/commands/route.ts`
- `src/commands/validate.ts`
- `src/state/paths.ts`
- `src/state/templates.ts`
- `src/state/smell-triggers.ts`
- `src/state/routing-decisions.ts`
- `test/routing.test.mjs`
- `test/validate.test.mjs`
- `test/draft-work.test.mjs`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`

## Review Gates

| Gate | Verdict | Evidence |
|---|---|---|
| Codex PM source review | `pass` | Reviewed the current diff for spec alignment, source-of-truth boundaries, catalog validation, routing-decision validation, route-command refusal paths, operator-input boundary handling, and clean-code blockers. No blocker-level finding was found. |
| Clean-code review | `pass` | The implementation is limited to a policy seed, a routing template/artifact, small parser/validator helpers, one narrow command, and focused tests. No hidden authority, broad policy engine, generated schema framework, database, or cockpit state was introduced. |
| CodeRabbit pre-landing loop | `bootstrap_gap` | Bandit does not yet have CodeRabbit CLI automation or a PR-backed pre-landing loop. This missing final gate is recorded honestly rather than treated as clean review. |
| Local Qwen adversarial review | `bootstrap_gap` | Bandit does not yet have a configured local Qwen reviewer profile or command. This missing final gate is recorded honestly rather than treated as clean review. |
| Escalated adversarial review | `bootstrap_gap` | This slice touches parser/validator behavior, coverage-sensitive refusal paths, and policy drift-sensitive artifacts. The escalated review gate does not exist yet, so this is recorded as a bootstrap gap. |
| Cross-model tension | `not_applicable` | No independent model review ran, so no reviewer disagreement exists to log. |

## PM Findings

| Finding | Disposition |
|---|---|
| The Smell Trigger Catalog is structured repo-native state under `.bandit/policy/smell-triggers.json`, and validation requires version, non-empty smells, unique IDs, supported severities/actions, escalation targets, and required evidence. | Accepted as compliant with CLI Authority, explicit state, and fail-closed validation requirements. |
| The routing-decision parser requires `work_item` to match the requested work item, requires all contract fields, rejects unknown smell IDs, and rejects unresolved operator-owned input statuses. | Accepted as compliant with the Operator Input Boundary and recorded-decision-only requirements. |
| `bandit route <work-item-id>` reports the recorded route, smells, escalation outcome, evidence, operator-input status, bootstrap gaps, and final decision without inferring new product direction, UAT, policy changes, or cost/risk overrides. | Accepted as compliant with manager-owned routing and no-role-erosion requirements. |
| Focused tests cover missing catalog, missing template, duplicate smell IDs, unsupported actions, unknown smell IDs, unresolved operator input, route success output, omitted ID, unknown work item, missing routing decision artifact, and malformed route artifacts. | Accepted as sufficient Stage 2 and Stage 3 coverage for this slice. |
| Existing temp-repo tests now seed the committed policy artifact when they need `bandit validate` to pass under the new required policy. | Accepted as a scoped test update required by the new validation contract, not an unrelated refactor. |
| CodeRabbit, Qwen, escalated adversarial review, and Landing Agent gates are still unavailable during bootstrap. | Accepted only as explicit `bootstrap_gap` evidence; these gaps are not treated as passing final review gates. |

## Verification Run

Date: 2026-05-24.

| Command | Result |
|---|---|
| `node --test test/routing.test.mjs` | `pass` - 11 tests passed. |
| `npm test` | `pass` - 47 tests passed. |
| `npm run typecheck` | `pass`. |
| `npm run bandit -- validate` | `pass` - `Bandit state is valid.` |
| `npm run bandit -- route BANDIT-004` | `pass` - reports `tdd-green-implementation`, four applicable smell IDs, `bootstrap_manual_evidence`, and `operator_input_status: none_required`. |
| `git diff --check` | `pass`. |

## Clean-Code Landing Check

| Rubric Item | Verdict | Evidence |
|---|---|---|
| Spec alignment | `pass` | Implementation maps directly to `brief.md` acceptance criteria and `red-evidence.md` tests. |
| Small surface area | `pass` | Diff is limited to routing policy/artifacts, validation helpers, one route command, tests, evidence, and required context updates. |
| Simple design | `pass` | Uses direct JSON and Markdown metadata parsing; no schema framework, broad DSL, database, generated index, or cockpit authority was added. |
| Explicit state | `pass` | Smells and routing decisions live in named repo-native artifacts. |
| No hidden authority | `pass` | Validation and route output read canonical repo artifacts only. |
| Testable behavior | `pass` | Success and refusal paths are covered by focused routing tests and full-suite validation. |
| Readable flow | `pass` | Catalog validation, routing-decision validation, command output, and CLI wiring are separated into small modules. |
| Locality | `pass` | Routing policy logic stays near state validation and route command handling; unrelated production refactors were excluded. |
| Failure clarity | `pass` | Missing policy/template/artifact, duplicates, unsupported values, unknown smells, omitted IDs, unknown work items, and unresolved operator input fail closed with clear messages. |
| No role erosion | `pass` | Codex PM owns technical routing; operator-owned input remains product direction, UAT, policy changes, business tradeoffs, and explicit cost/risk overrides. |
| Improvement capture | `pass` | No new material workflow lesson requires a chore in this review step; unavailable final gates remain explicit bootstrap gaps owned by later roadmap phases. |

## Stage-Rubric Disposition

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify Phase 3, `BANDIT-004`, and the next action. |
| Stage 1: Work-Item Brief And Spec | `pass` | `brief.md` records goal, scope, out of scope, acceptance criteria, test plan, clean-code evidence, bootstrap gaps, expected files, implementation order, smell triggers, escalation plan, and operator input status. |
| Stage 2: Test Design And RED Evidence | `pass` | `red-evidence.md` maps acceptance criteria to focused tests and records the 11/11 failing RED run before implementation. |
| Stage 3: Implementation Clean-Code Rubric | `pass` | `implementation-evidence.md` maps the implementation to acceptance criteria and records passing focused/full verification and clean-code self-check. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | Manual PM review passed, but final CodeRabbit, Qwen, and escalated adversarial gates are unavailable during bootstrap. |
| Stage 5: Landing And UAT | `blocker` | A safe-to-land verdict may be recorded, but landing action evidence does not exist yet. The slice is ready-to-land, not landed. UAT is `not_applicable` because this is workflow infrastructure, not a feature slice. |
| Stage 6: Retrospective And Improvement Capture | `not_applicable` | Retrospective is required before closeout, after the landing action is performed and recorded. |

## Stage 4 Verdict

`bootstrap_gap`

Reason: manual PM review found no blocker-level code issue and verification is
current, but final CodeRabbit, Qwen, and escalated adversarial review gates are
unavailable during bootstrap and are recorded as explicit gaps.
