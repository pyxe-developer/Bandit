# BANDIT-074 Retrospective

## Outcome

`BANDIT-074` landed and closed out the Metamorphic Cross-Projection Checks
bootstrap chore. The work adds a repo-native projection consistency policy,
read-only validation for trust-relevant projection fields, harmless
perturbation checks, `validate --json` reporting, focused regression tests, and
Stage 4/5 evidence for local landing. The implementation deliberately avoids
Trust Verifier cutover, old-gate replacement, reviewer promotion, paid routing,
hosted services, telemetry, merge, push, deploy, guarded browser action
execution, or unrelated cockpit product scope.

## What Worked

- Formation, plan-mode orchestration, Codex-authored RED evidence, Claude Stage
  3 implementation, PM acceptance, review, landing, and closeout stayed grounded
  in repo-native artifacts.
- Bootstrap Model-Family Separation held: Codex authored RED tests while Claude
  implemented Stage 3 source and chore surfaces only.
- The Stage 3 Writer did not edit Test Writer-owned tests, fixtures, RED
  evidence, acceptance mappings, review evidence, landing evidence, or
  retrospective evidence.
- Focused metamorphic tests covered agreement across covered projections,
  harmless perturbation preservation, and fail-closed trust-relevant
  disagreement diagnostics.
- The review-subject hash let evidence-only Stage 4 and landing artifacts land
  without forcing repeated reviewer loops.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Projection consistency needs explicit trust-relevant field lists, not broad output equality. | resolved | The policy names active work item, current stage, next action, required operator input, blockers, and gate verdict summaries as trust-relevant fields. |
| Harmless perturbations must be narrow and named. | resolved | The policy permits whitespace and JSON object key ordering normalization without treating semantic drift as harmless. |
| CodeRabbit provider availability remains unreliable for the local live pre-PR path. | explicit no-action decision | The timeout/blocker provider result is recorded with no pass claim; Local Qwen, deterministic tests, risk classification, supply-chain gate, PM review, and landing checks covered this bounded chore. |
| Role-run manifests can lag work-item-specific policy artifacts. | explicit no-action decision | The manifest records the policy write in `files_changed` and a deviation note while listing only contract-accepted `allowed_target_files`; validation now passes without hiding the Stage 3 policy artifact from PM review evidence. |
| Bootstrap-gap resolution must wait for landing action and retrospective evidence. | resolved | The gap ledger remains active through Stage 5 and is resolved only by this closeout package. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | CodeRabbit live pre-PR review emitted reviewing heartbeats but timed out after 600 seconds without terminal findings. | explicit no-action decision - provider timeout is recorded as bootstrap replacement evidence with no CodeRabbit pass claim |
| overreasoning | The work did not expand into Trust Verifier cutover, old-gate replacement, reviewer promotion, paid routing, hosted services, telemetry, merge, push, deploy, or unrelated cockpit product work. | explicit no-action decision - forbidden and queued scopes stayed out of this chore |
| work-breakdown fit | The projection consistency gate fit as one bounded bootstrap chore spanning policy, validator, CLI JSON output, focused tests, review, landing, and closeout. | resolved - close the active gap through BANDIT-074 |
| agent-scope fit | Repo PM formation, Work Item PM orchestration, Test Writer RED, Claude Writer implementation, reviewers, Landing Agent, and Closeout Agent responsibilities stayed separated. | explicit no-action decision - role boundaries held |
| tool-use rule pressure | Local Qwen ran through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`; direct `qwen` CLI was not used as review proof. | resolved - the authorized route remains the only Local Qwen review path |
| reviewer/model routing | Codex-authored RED routed Stage 3 implementation to Claude, CodeRabbit timed out, and Local Qwen returned non-blocking observations that PM dispositioned. | explicit no-action decision - model-family separation held and reviewer outcomes have recorded replacement or disposition evidence |
| tool invocation friction | `role-runs validate` failed until the Stage 3 dispatch packet and manifest contract fields were repaired. | explicit no-action decision - the repair is recorded in `docs/work/BANDIT-074/stage3-dispatch.md` and `docs/role-runs/BANDIT-074/stage3-implementation.json` |
| recurring inefficiency | Closeout still requires manual synchronization across coordination, gap ledger, roadmap, status, retrospective, and disposition artifacts. | explicit no-action decision - current workflow policy expects Closeout Agent synchronization and validation checks verify the synchronized route state |
| cost or latency signals | No paid reviewer, dependency install, external service, hosted preview, merge, push, or deploy was introduced; Local Qwen and Claude Writer remained within local/session cost expectations. | explicit no-action decision - no cost-policy or supply-chain follow-up is required |
| unresolved uncertainty | The next queued target is known but no next work item is formed yet. | deferred to Repo PM - create a bounded chore from `docs/specs/BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS.json` before unrelated Phase 8 product work |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

`BANDIT-GAP-METAMORPHIC-CROSS-PROJECTION-CHECKS` is resolved by `BANDIT-074`
after landing action and this Stage 6 closeout evidence.

`BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS` is the next queued bootstrap
gap. The next recorded action is to create a bounded chore from
`docs/specs/BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS.json` before
proceeding to unrelated Phase 8 product work.

The Local Qwen non-blocking observations were dispositioned inside Stage 4 and
Stage 6 rather than creating a duplicate gap.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-074`. Claude source
implementation was accepted after RED coverage, PM review, focused tests, full
test suite, typecheck, aggregate Bandit validation, role-run validation, risk
classification, supply-chain gate validation, Local Qwen non-blocking
disposition evidence, CodeRabbit bootstrap replacement evidence,
review-subject hash evidence, and landing checks. No source repair remains
open.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS` is the next queued bootstrap
  gap.
- `BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` remains queued behind reviewer
  calibration.
- `BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` remains queued behind
  evidence bundle attestation.
