# BANDIT-072 Retrospective

## Outcome

`BANDIT-072` landed and closed out the Replay Regression Corpus bootstrap chore. The work adds a repo-native replay regression policy, three replay packet fixtures for historical workflow failure modes, a deterministic read-only `replay-regression-corpus validate` command, schema authority-field validation, policy taxonomy validation, required-mode coverage checks, init seeding, and focused regression tests. The implementation deliberately avoids live routing mutation, policy promotion from replay results, reviewer replacement, landing replacement, hosted replay services, telemetry, merge, push, deploy, and Trust Verifier cutover.

## What Worked

- Formation, plan-mode orchestration, Codex-authored RED evidence, Claude Stage 3 implementation, PM acceptance, Stage 4 review, landing, and closeout stayed grounded in repo-native artifacts.
- Bootstrap Model-Family Separation held: Codex authored and repaired RED tests while Claude implemented Stage 3 source and chore surfaces only.
- The Stage 3 Writer did not edit Test Writer-owned tests, fixtures, RED evidence, acceptance mappings, review evidence, landing evidence, or retrospective evidence.
- The repair RED caught missing packet authority fields and missing taxonomy enforcement before Stage 3 acceptance.
- Focused replay tests covered deterministic output, read-only live-state preservation, malformed packets, missing authority fields, outside-taxonomy values, missed expected blockers, and missing required failure-mode coverage.
- Risk and supply-chain artifacts were committed before the final review-subject hash, and Local Qwen was refreshed at the policy-inclusive source head.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Replay packets need authority-field and taxonomy validation, not only required-mode coverage. | resolved | The repaired RED and implementation now fail closed on missing `failure_mode`, `expected_gate`, `expected_verdict`, `command_version`, replay-only metadata, and values outside policy taxonomy. |
| Replay evidence must stay supplemental and read-only until a future trust-verifier-compatible cutover is explicitly approved. | resolved | The command validates local fixtures and emits deterministic output without mutating coordination, gap, roadmap, review, landing, UAT, or routing state. |
| Risk and supply-chain policy artifacts are review-subject inputs and should be committed before the final Local Qwen refresh. | explicit no-action decision | The final review-subject hash included the `BANDIT-072` risk and supply-chain evidence before aggregate review and landing. |
| CodeRabbit provider availability remains unavailable for this local fixture-normalized pre-PR path. | explicit no-action decision | The timeout/blocker provider result is recorded with no pass claim; Local Qwen, deterministic tests, risk classification, supply-chain gate, PM review, and landing checks covered this bounded chore. |
| Local Qwen may flag prompt packet truncation and pending future-stage artifacts as non-blocking process observations. | explicit no-action decision | PM inspected the actual TypeScript source, recorded no-action routing, and completed Stage 5 and Stage 6 before closing the gap. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | CodeRabbit pre-PR normalization returned timeout/blocker evidence without terminal findings, and the first unrefreshed CodeRabbit command failed usage because the current CLI requires an explicit fixture path. | explicit no-action decision - provider unavailability is recorded as bootstrap replacement evidence with no pass claim |
| overreasoning | The work did not expand into hosted replay services, telemetry, Trust Verifier cutover, reviewer replacement, landing replacement, public benchmark publication, merge, push, deploy, or unrelated cockpit work. | explicit no-action decision - forbidden and queued scopes stayed out of this chore |
| work-breakdown fit | The replay corpus foundation fit as one bounded bootstrap chore spanning policy, packet fixtures, command routing, validation logic, init seeding, focused tests, review, landing, and closeout. | resolved - close the active gap through BANDIT-072 |
| agent-scope fit | Repo PM formation, Work Item PM orchestration, Test Writer RED, Claude Writer implementation, reviewers, Landing Agent, and Closeout Agent responsibilities stayed separated. | explicit no-action decision - role boundaries held |
| tool-use rule pressure | Risk and supply-chain evidence changed the review subject, so Local Qwen needed a refresh after those artifacts were committed. | explicit no-action decision - refreshed Qwen evidence and aggregate review hash are recorded |
| reviewer/model routing | Codex-authored RED routed Stage 3 implementation to Claude, CodeRabbit timed out, and Local Qwen returned non-blocking process observations that PM dispositioned. | explicit no-action decision - model-family separation held and reviewer outcomes have recorded replacement or disposition evidence |
| tool invocation friction | `coderabbit-review pre-pr` now requires an explicit fixture path, while the orchestration prompt still listed the older no-fixture command form. | explicit no-action decision - the prompt should mention the current fixture-normalized CodeRabbit contract when no live provider path is available |
| recurring inefficiency | Closeout still requires manual coordination, roadmap, status, gap-ledger, and retrospective synchronization. | explicit no-action decision - current workflow policy expects Closeout Agent synchronization and validation checks verify the synchronized route state |
| cost or latency signals | No paid reviewer, dependency install, external service, hosted preview, merge, push, or deploy was introduced; Local Qwen and Claude writer runs completed within bounded local/session cost expectations. | explicit no-action decision - no cost-policy or supply-chain follow-up is required |
| unresolved uncertainty | The next queued target is known but no next work item is formed yet. | deferred to Repo PM - create a bounded chore from `docs/specs/BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE.json` before unrelated Phase 8 product work |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

`BANDIT-GAP-REPLAY-REGRESSION-CORPUS` is resolved by `BANDIT-072` after landing action and this Stage 6 closeout evidence.

`BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE` is the next queued bootstrap gap. The next recorded action is to create a bounded chore from `docs/specs/BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE.json` before proceeding to unrelated Phase 8 product work.

The Local Qwen non-blocking observations were dispositioned inside Stage 4 and Stage 6 rather than creating a duplicate gap.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-072`. Claude source implementation was accepted after repaired RED coverage, PM review, focused tests, full test suite, typecheck, aggregate Bandit validation, replay validation, risk classification, supply-chain gate validation, refreshed Local Qwen non-blocking disposition evidence, CodeRabbit bootstrap replacement evidence, and landing checks. No source repair remains open.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE` is the next queued bootstrap gap.
- `BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS` remains queued behind the determinism gate.
- Reviewer Calibration With Seeded Defects, Evidence Bundle Attestation, and Spec-To-Evidence Traceability Matrix remain queued behind the metamorphic and reviewer-calibration work.
