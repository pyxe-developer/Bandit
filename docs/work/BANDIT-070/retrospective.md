# BANDIT-070 Retrospective

## Outcome

`BANDIT-070` landed and closed out the Verification Oracle Provenance Gate bootstrap chore. The work adds a repo-native oracle-provenance policy, evidence template, validator, CLI command, init wiring, and `land-check` enforcement so covered high-risk safe-to-land claims cannot land without current, independent, non-circular oracle provenance evidence. The implementation preserves historical aggregate validation compatibility, Trust Verifier cutover boundaries, and the Permanent Test Ownership Boundary.

## What Worked

- Formation, plan-mode orchestration, Codex-authored RED evidence, Claude Stage 3 implementation, PM acceptance, Stage 4 review, landing, and closeout stayed grounded in repo-native artifacts.
- Bootstrap Model-Family Separation held: Codex authored RED tests and Claude implemented Stage 3 source/chore surfaces only.
- The Stage 3 Writer did not edit Test Writer-owned tests, fixtures, RED evidence, acceptance mappings, review evidence, landing evidence, or retrospective evidence.
- Focused RED coverage caught the missing `verification-oracle-provenance` command, missing policy/template/validator integration, circular self-attestation acceptance, self-reported trust claims, and missing `land-check` fail-closed behavior.
- Local Qwen ran through the authorized MLX adapter path and produced non-blocking findings that were dispositioned explicitly.
- A supplemental Local Qwen source-diff review through `bin/omlx-chat-completions.mjs` corrected the evidence-only diff limitation from the first local review run.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Oracle-provenance evidence can be enforced through a risk-tiered dedicated validator and landing gate without making historical aggregate validation brittle. | resolved | `verification-oracle-provenance validate <ID>` and `land-check` enforce the accepted gate for current covered high-risk claims while `npm run bandit -- validate` remains compatible with historical artifacts. |
| Codex-authored RED plus Claude implementation remains workable for verification-layer bootstrap gate chores. | explicit no-action decision | Role boundaries held, Claude stayed off Test Writer surfaces, and deterministic tests plus PM review covered the implementation. |
| CodeRabbit provider availability remains intermittent for local pre-PR review. | explicit no-action decision | The timeout is recorded as bootstrap replacement evidence with no CodeRabbit pass claim; Local Qwen, supplemental source-diff review, and deterministic verification covered this bounded chore. |
| Local Qwen can review the wrong subject when the latest tracked diff is evidence-only. | explicit no-action decision | The first review's non-blocking source-diff concern was resolved by supplemental source-diff review through the authorized adapter, and the review-subject hash plus landing gate kept freshness explicit. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | CodeRabbit timed out without terminal findings; the first `bandit land` attempt refused a dirty worktree because artifact creation had appended `.bandit/events.jsonl`. | explicit no-action decision - timeout has bootstrap replacement evidence and dirty-worktree refusal was expected landing-agent protection |
| overreasoning | The work did not expand into Trust Verifier cutover, product UI, private install/update work, replay corpus work, guarded action execution, merge, push, or deploy. | explicit no-action decision - forbidden and queued scopes stayed out of this chore |
| work-breakdown fit | The oracle-provenance gate fit as a bounded bootstrap gap with policy, validator, CLI command, template, and landing-gate integration. | resolved - close the active gap through BANDIT-070 |
| agent-scope fit | Repo PM formation, Work Item PM orchestration, Test Writer RED, Claude Writer implementation, reviewers, Landing Agent, and Closeout Agent responsibilities stayed separated. | explicit no-action decision - role boundaries held |
| tool-use rule pressure | Review-subject hash had to be refreshed after committing Stage 4 policy evidence so landing would not rely on a stale hash. | explicit no-action decision - the refreshed hash is recorded in Stage 4 and landing evidence |
| reviewer/model routing | Local Qwen returned non-blocking findings and CodeRabbit timed out without terminal findings. | explicit no-action decision - non-blocking findings have durable no-action or supplemental-review routing and CodeRabbit has bootstrap replacement evidence |
| tool invocation friction | Artifact creation appended `.bandit/events.jsonl`, requiring a separate event-ledger commit before local-record landing. | explicit no-action decision - the event was committed separately before landing |
| recurring inefficiency | Parser-sensitive next-action text still requires exact synchronization between `CURRENT_CONTEXT.md` and `ROADMAP.md`. | explicit no-action decision - routing docs were synchronized and validation now catches disagreement |
| cost or latency signals | No paid reviewer, dependency install, external service, hosted preview, merge, push, or deploy was introduced; CodeRabbit timeout cost was bounded by the 300-second command. | explicit no-action decision - no cost-policy or supply-chain follow-up is required |
| unresolved uncertainty | The next queued target is known but no next work item is formed yet. | deferred to Repo PM - create a bounded chore from `docs/specs/BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL.json` before unrelated Phase 8 product work |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

`BANDIT-GAP-VERIFICATION-ORACLE-PROVENANCE-GATE` is resolved by `BANDIT-070` after landing action and this Stage 6 closeout evidence.

`BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` is the next queued bootstrap gap. The next recorded action is to create a bounded chore from `docs/specs/BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL.json` before proceeding to unrelated Phase 8 product work.

Local Qwen's source-diff limitation was resolved inside Stage 4 by supplemental source-diff review rather than creating a duplicate gap.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-070`. Claude source implementation was accepted after PM review, focused tests, full test suite, typecheck, aggregate Bandit validation, dedicated oracle-provenance validation, Local Qwen non-blocking review, supplemental Local Qwen source-diff pass, CodeRabbit bootstrap replacement evidence, risk classification, supply-chain gate, and landing checks. Local Qwen findings are routed as no-action or resolved-by-supplemental-review for this bounded chore.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-PRIVATE-INSTALL-UPDATE-CHANNEL` is the next queued bootstrap gap.
- `BANDIT-GAP-REPLAY-REGRESSION-CORPUS` remains queued behind the private install/update channel.
- Gate Determinism And Flake Gate, Metamorphic Cross-Projection Checks, Reviewer Calibration With Seeded Defects, Evidence Bundle Attestation, and Spec-To-Evidence Traceability Matrix remain queued behind the replay corpus.
