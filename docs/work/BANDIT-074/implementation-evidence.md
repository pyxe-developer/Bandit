# BANDIT-074 Stage 3 Implementation Evidence

contract_version: 1
work_item: BANDIT-074
stage: stage3_implementation
owner: work_item_pm
recorded_at: 2026-06-08T03:30:31Z
verdict: pass

## Writer Evidence

- Implementation Writer: Claude-family (`claude-sonnet-4-6`) through the bootstrap Process Adapter path.
- Writer report: `docs/work/BANDIT-074/writer-report.md`.
- Role run manifest: `docs/role-runs/BANDIT-074/stage3-implementation.json`.
- Stage 3 runtime: approximately five and a half minutes; the required 15-minute allowance was not interrupted because the Writer exited successfully before the window elapsed.

## Source Delivery

| Surface | Evidence |
| --- | --- |
| `.bandit/policy/metamorphic-cross-projection-checks.json` | Defines canonical sources, covered projection IDs, trust-relevant fields, acceptable differences, and current empty real-repo projection/perturbation arrays. |
| `src/state/projection-consistency.ts` | Adds a read-only policy validator that compares covered projection claims, normalizes declared harmless differences, checks perturbations, and fails closed with field/projection diagnostics. |
| `src/commands/validate.ts` | Calls the projection-consistency validator from `bandit validate` and carries the report in the validation result. |
| `src/cli.ts` | Emits `metamorphic_cross_projection_checks` in `bandit validate --json`. |

## Acceptance Criteria Coverage

| Acceptance criterion | PM assessment |
| --- | --- |
| Policy artifact defines covered projections, canonical source artifacts, trust-relevant fields, harmless perturbations, and acceptable differences. | pass - the policy artifact exists and Stage 2 fixtures prove the schema with covered projections and perturbations. |
| Covered projections agree on active work item, stage, next action, blockers, required operator input, queued gaps, and gate verdict summaries. | pass - validator compares all configured `trust_relevant_fields`; Stage 2 fixtures cover active work item, stage, next action, required operator input, queued gaps, and gate verdicts. |
| Validation or focused checks fail closed when projections disagree on trust-relevant claims. | pass - disagreement throws a fail-closed error naming `Metamorphic cross-projection checks`, `projection disagreement`, projection ID, and field. |
| Metamorphic tests prove harmless input changes do not alter covered verdicts or trusted status. | pass - focused tests cover whitespace and JSON object key-order normalization through harmless perturbation and equivalent projection fixtures. |
| Projection consistency checks remain read-only against canonical workflow state. | pass - validator reads only `.bandit/policy/metamorphic-cross-projection-checks.json`; no canonical workflow mutation path was added. |
| Preserve CLI authority, repo-native canonical artifacts, projection boundaries, operator fail-closed boundary, layered risk classification, supply-chain gate expectations, Permanent Test Ownership Boundary, and Bootstrap Model-Family Separation. | pass - `bandit validate` remains the public gate, projections stay non-canonical, and Stage 3 used Claude after Codex-authored RED evidence with no test-surface edits. |

## Verification

| Command | Result |
| --- | --- |
| `node --test test/metamorphic-cross-projection-checks.test.mjs` | pass - 2 tests passed, 0 failed. |
| `npm run typecheck` | pass. |
| `npm run bandit -- validate` | pass - `Bandit state is valid.` |
| `npm test` | pass - 551 tests passed, 0 failed. |
| `node ./bin/bandit.mjs cockpit status --json` | pass - derived status reports Stage 2 RED evidence present and Stage 3 implementation evidence missing before this artifact was recorded. |
| `node ./bin/bandit.mjs session-context current --json` | pass - derived packet still reflected Stage 1 routing before context synchronization; Stage 4 routing will be synchronized after `implementation_recorded`. |
| `git diff --check` | pass. |

## Clean-Code PM Acceptance

- Spec alignment: pass - implementation satisfies the approved policy/validator/report surface without approving Trust Verifier cutover or replacing any old gate.
- Small surface area: pass - source changes are limited to one new validator, validate wiring, CLI JSON output, and the policy artifact.
- Simple design: pass - parsing, projection agreement, harmless perturbation comparison, and normalization are separated in `projection-consistency.ts`.
- Explicit state: pass - policy file is named in the report; projections remain derived/non-canonical.
- No hidden authority: pass - no projection, UI, cache, or helper became canonical workflow authority.
- Testable behavior: pass - focused public CLI tests cover pass and fail-closed paths; full test suite passed.
- Readable flow: pass - validation errors identify the check, projection, field, and compared values.
- Locality: pass - no unrelated refactor.
- Failure clarity: pass - disagreement fails closed with actionable diagnostics.
- No role erosion: pass - Stage 3 Writer did not edit `test/metamorphic-cross-projection-checks.test.mjs`, RED evidence, artifact-input RED evidence, test helpers, fixtures, acceptance mappings, perturbation fixtures, expected-output mappings, or source-artifact mappings.
- Improvement capture: pass - no new Stage 3 lesson requires a separate improvement chore before Stage 4.

## PM Verdict

Stage 3 implementation is accepted. Proceed to Stage 4 review with CodeRabbit
or provider-timeout evidence, Local Qwen through `.bandit/reviewers/local-qwen.json`
and `bin/omlx-chat-completions.mjs`, risk classification, supply-chain gate,
review-subject hash, aggregate review evidence, and finding dispositions.
