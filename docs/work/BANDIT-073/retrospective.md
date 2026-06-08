# BANDIT-073 Retrospective

## Outcome

`BANDIT-073` landed and closed out the Gate Determinism And Flake Gate bootstrap chore. The work adds a repo-native determinism policy, deterministic `validate --json` output, canonical JSON hashing, repeat-run hash comparison, provider-dependent evidence metadata checks, nondeterminism disposition checks, direct-Qwen-CLI refusal for Local Qwen proof, init seeding, and focused regression tests. The implementation deliberately avoids Trust Verifier cutover, old-gate replacement, reviewer promotion, paid routing, hosted services, telemetry, merge, push, deploy, guarded browser action execution, or unrelated cockpit product scope.

## What Worked

- Formation, plan-mode orchestration, Codex-authored RED evidence, Claude Stage 3 implementation, PM acceptance, Stage 4 review, landing, and closeout stayed grounded in repo-native artifacts.
- Bootstrap Model-Family Separation held: Codex authored RED tests while Claude implemented Stage 3 source and chore surfaces only.
- The Stage 3 Writer did not edit Test Writer-owned tests, fixtures, RED evidence, acceptance mappings, review evidence, landing evidence, or retrospective evidence.
- Focused determinism tests covered stable JSON output, unstable hash drift, undispositioned nondeterminism, provider-dependent metadata gaps, provider evidence replacing local proof, and direct-Qwen-CLI rejection.
- Local Qwen was executed through the authorized oMLX adapter route, and the direct `qwen` CLI route remains rejected by validation.
- The review-subject hash let evidence-only commits proceed through landing without forcing repeated reviewer loops.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Deterministic gates need canonical JSON hashing, not only stable human-readable command output. | resolved | The implementation hashes canonical JSON with sorted object keys and preserves array order so repeat-run drift fails closed. |
| Provider-dependent evidence needs explicit freshness and availability metadata before it can participate in trusted gates. | resolved | The policy validator rejects provider-dependent evidence without `captured_at`, `freshness.expires_at`, `availability_disposition`, and replacement-proof limits. |
| Local Qwen reviewer routing must be pinned to the oMLX adapter path. | resolved | The gate rejects direct `qwen` CLI evidence and names `.bandit/reviewers/local-qwen.json` plus `bin/omlx-chat-completions.mjs` as the authorized route. |
| Brief status is formation evidence, not the live workflow state authority. | explicit no-action decision | Live state is derived from coordination, roadmap, status, cockpit, and session-context artifacts, so the accepted brief was not mutated mid-review. |
| CodeRabbit provider availability remains unreliable for the local live pre-PR path. | explicit no-action decision | The timeout/blocker provider result is recorded with no pass claim; Local Qwen, deterministic tests, risk classification, supply-chain gate, PM review, and landing checks covered this bounded chore. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | CodeRabbit live pre-PR review emitted reviewing heartbeats but timed out after 600 seconds without terminal findings. | explicit no-action decision - provider timeout is recorded as bootstrap replacement evidence with no CodeRabbit pass claim |
| overreasoning | The work did not expand into Trust Verifier cutover, old-gate replacement, reviewer promotion, paid routing, hosted services, telemetry, merge, push, deploy, or unrelated cockpit product work. | explicit no-action decision - forbidden and queued scopes stayed out of this chore |
| work-breakdown fit | The determinism gate fit as one bounded bootstrap chore spanning policy, validator, CLI JSON output, init seeding, focused tests, review, landing, and closeout. | resolved - close the active gap through BANDIT-073 |
| agent-scope fit | Repo PM formation, Work Item PM orchestration, Test Writer RED, Claude Writer implementation, reviewers, Landing Agent, and Closeout Agent responsibilities stayed separated. | explicit no-action decision - role boundaries held |
| tool-use rule pressure | Local Qwen must use the oMLX adapter path; the active process was `node bin/omlx-chat-completions.mjs -` against the oMLX server. | resolved - the run and validator both preserve the authorized oMLX route |
| reviewer/model routing | Codex-authored RED routed Stage 3 implementation to Claude, CodeRabbit timed out, and Local Qwen returned non-blocking process observations that PM dispositioned. | explicit no-action decision - model-family separation held and reviewer outcomes have recorded replacement or disposition evidence |
| tool invocation friction | `coderabbit-review pre-pr` in the local CLI currently requires fixture-normalized input, while the live provider run used the CodeRabbit CLI directly and timed out. | explicit no-action decision - the timeout is recorded honestly; future prompt wording should distinguish fixture-normalized CLI review from live CodeRabbit CLI fallback |
| recurring inefficiency | Closeout still requires manual synchronization across coordination, gap ledger, roadmap, status, retrospective, and disposition artifacts. | explicit no-action decision - current workflow policy expects Closeout Agent synchronization and validation checks verify the synchronized route state |
| cost or latency signals | No paid reviewer, dependency install, external service, hosted preview, merge, push, or deploy was introduced; Local Qwen and Claude Writer remained within local/session cost expectations. | explicit no-action decision - no cost-policy or supply-chain follow-up is required |
| unresolved uncertainty | The next queued target is known but no next work item is formed yet. | deferred to Repo PM - create a bounded chore from `docs/specs/BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS.json` before unrelated Phase 8 product work |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

`BANDIT-GAP-GATE-DETERMINISM-FLAKE-GATE` is resolved by `BANDIT-073` after landing action and this Stage 6 closeout evidence.

`BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS` is the next queued bootstrap gap. The next recorded action is to create a bounded chore from `docs/specs/BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS.json` before proceeding to unrelated Phase 8 product work.

The Local Qwen non-blocking observations were dispositioned inside Stage 4 and Stage 6 rather than creating a duplicate gap.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-073`. Claude source implementation was accepted after RED coverage, PM review, focused tests, full test suite, typecheck, aggregate Bandit validation, role-run validation, risk classification, supply-chain gate validation, Local Qwen non-blocking disposition evidence, CodeRabbit bootstrap replacement evidence, review-subject hash evidence, and landing checks. No source repair remains open.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS` is the next queued bootstrap gap.
- `BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS` remains queued behind the metamorphic checks.
- `BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` remains queued behind reviewer calibration.
- `BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` remains queued behind evidence bundle attestation.
