# BANDIT-076 Retrospective

## Outcome

`BANDIT-076` landed and closed out the Evidence Bundle Attestation bootstrap
chore. The work adds a repo-native read-only evidence bundle policy, deterministic
bundle hashing, a public `bandit evidence-bundle attest <WORK_ITEM> [--json]`
command, focused regression tests, Stage 4 review evidence, local-record landing
evidence, and closeout proof that the landed bundle attests successfully.

The implementation deliberately avoids Trust Verifier cutover, old-gate
replacement, reviewer promotion, paid routing, hosted services, telemetry,
merge, push, deploy, guarded browser action execution, or unrelated cockpit
product scope.

## What Worked

- Formation, plan-mode orchestration, Codex-authored RED evidence, Claude Stage
  3 implementation, PM acceptance, review, landing, and closeout stayed grounded
  in repo-native artifacts.
- Bootstrap Model-Family Separation held: Codex authored RED tests while Claude
  implemented Stage 3 source and policy surfaces only.
- The Stage 3 Writer did not edit Test Writer-owned tests, fixtures, RED
  evidence, acceptance mappings, review evidence, landing evidence, or
  retrospective evidence.
- Focused attestation tests covered deterministic output, missing/stale inputs,
  landing hash mismatch, unsupported verdicts, conditional UAT, authority
  expansion, and missing evidence types.
- The final landed bundle attestation passed with hash
  `af261250273c2a67fcc678180b371920523225b0cad3dce1fb62e0dca6692677`.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Evidence bundle attestation needs machine-readable landing action metadata. | resolved | `docs/work/BANDIT-076/landing-action.md` now includes a JSON evidence block with `freshness_state: current`, `action: local_record`, and landing-time commit metadata. |
| Bundle hashes must remain evidence, not gate authority. | resolved | The policy and tests enforce read-only behavior and reject authority expansion, Trust Verifier cutover replacement, review-routing mutation, and gap-status mutation. |
| CodeRabbit provider timeout can still surface useful state-sync findings. | explicit no-action decision | The timeout is recorded with no CodeRabbit pass claim, and both emitted findings were repaired and dispositioned. |
| Non-blocking Local Qwen findings need concrete PM routing. | explicit no-action decision | `docs/work/BANDIT-076/qwen-finding-disposition.md` records no-action routing for prompt diff truncation, CodeRabbit timeout boundary, and pending landing/closeout observations. |
| Bootstrap-gap resolution must wait for landing action and retrospective evidence. | resolved | The gap ledger remains active through Stage 5 and is resolved only by this closeout package. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | `bandit evidence-bundle attest BANDIT-076 --json` initially refused the human-only landing action artifact. | resolved - added machine-readable landing action metadata before resolving the gap |
| overreasoning | The work did not expand into Trust Verifier cutover, old-gate replacement, reviewer promotion, paid routing, hosted services, telemetry, merge, push, deploy, or unrelated cockpit product work. | explicit no-action decision - forbidden and queued scopes stayed out of this chore |
| work-breakdown fit | Evidence Bundle Attestation fit as one bounded bootstrap chore spanning policy, validator, CLI output, focused tests, review, landing, and closeout. | resolved - close the active gap through BANDIT-076 |
| agent-scope fit | Repo PM formation, Work Item PM orchestration, Test Writer RED, Claude Writer implementation, reviewers, Landing Agent, and Closeout Agent responsibilities stayed separated. | explicit no-action decision - role boundaries held |
| tool-use rule pressure | Local Qwen ran through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`; direct `qwen` CLI was not used as review proof. | resolved - the authorized route remains the only Local Qwen review path |
| reviewer/model routing | Codex-authored RED routed Stage 3 implementation to Claude, CodeRabbit timed out with repaired findings, and Local Qwen returned non-blocking observations that PM dispositioned. | explicit no-action decision - model-family separation held and reviewer outcomes have recorded replacement or disposition evidence |
| tool invocation friction | The CodeRabbit provider timed out after the full 600-second window. | explicit no-action decision - provider timeout is recorded as bootstrap replacement evidence with no CodeRabbit pass claim |
| recurring inefficiency | Closeout still requires manual synchronization across coordination, gap ledger, roadmap, status, retrospective, and disposition artifacts. | explicit no-action decision - current workflow policy expects Closeout Agent synchronization and validation checks verify the synchronized route state |
| cost or latency signals | No paid reviewer, dependency install, external service, hosted preview, merge, push, or deploy was introduced; Local Qwen and Claude Writer remained within local/session cost expectations. | explicit no-action decision - no cost-policy or supply-chain follow-up is required |
| unresolved uncertainty | The next queued verification-layer target is known but no next work item is formed yet. | deferred to Repo PM - create and form a bounded chore from `docs/specs/BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX.json` before unrelated Phase 8 product work |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

`BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` is resolved by `BANDIT-076` after
landing action, passing bundle attestation, and this Stage 6 closeout evidence.

`BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` is the next queued bootstrap
gap. The next recorded action is to create and form a bounded chore from
`docs/specs/BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX.json` before
proceeding to unrelated Phase 8 product work.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-076`. Claude source
implementation was accepted after RED coverage, PM review, focused tests, full
test suite, typecheck, aggregate Bandit validation, role-run validation, risk
classification, supply-chain gate validation, CodeRabbit bootstrap replacement
evidence with repaired findings, Local Qwen non-blocking disposition evidence,
review-subject hash evidence, landing checks, and final bundle attestation. No
source repair remains open.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` remains queued after
  Evidence Bundle Attestation closeout.
