# BANDIT-075 Retrospective

## Outcome

`BANDIT-075` landed the Reviewer Calibration With Seeded Defects bootstrap chore. The work adds a repo-native replay-only calibration policy, one seeded reviewer packet derived from Bandit workflow failure modes, a public `bandit reviewer-calibration validate [--json]` command, deterministic scoring, provider-timeout evidence surfacing, focused regression tests, Stage 4 review evidence, and local-record landing evidence. The implementation deliberately avoids live reviewer/model routing changes, reviewer promotion, Trust Verifier cutover, old-gate replacement or wrapping, paid routing, hosted replay services, public benchmark publication, telemetry, merge, push, deploy, guarded browser action execution, or unrelated cockpit product scope.

## What Worked

- Formation, plan-mode orchestration, Codex-authored RED evidence, Claude Stage 3 implementation, PM acceptance, review, landing, and closeout stayed grounded in repo-native artifacts.
- Bootstrap Model-Family Separation held: Codex authored RED tests and evidence while Claude implemented Stage 3 source and policy surfaces only.
- The Stage 3 Writer did not edit Test Writer-owned tests, seeded packets, gold labels, RED evidence, acceptance mappings, review evidence, landing evidence, or retrospective evidence.
- Focused calibration tests covered pass behavior, replay-only boundaries, repo-derived packet requirements, gold labels, required seeded-case fields, direct-Qwen refusal, primary metric selection, and read-only behavior.
- The review-subject hash let Stage 4 and landing evidence commits proceed without forcing repeated reviewer loops after evidence-only changes.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Reviewer calibration must start with repo-derived workflow failure modes, not generic benchmark tasks. | resolved | The policy and seeded packet require `repo_derived_bandit_failure_mode`, failure-mode provenance, and source artifacts for first-harness acceptance. |
| Calibration output must not become live reviewer-routing authority. | resolved | The validator is pure-read, checks replay-only/no-live-routing boundaries, and tests prove reviewer and landing policy artifacts remain unchanged. |
| Provider timeout or absence belongs in calibration evidence, not in score metrics or pass claims. | resolved | The scorecard counts only completed reviewer outputs and surfaces `provider_timeout` separately in `provider_evidence_statuses`. |
| CodeRabbit completed but returned minor findings that required PM disposition rather than a pass claim. | explicit no-action decision | Both CodeRabbit findings were dispositioned without source repair: the missing-action path already returns usage, and the lifecycle event correctly records the generated artifact path. |
| Bootstrap-gap resolution must wait for landing action and retrospective evidence. | resolved | The gap ledger remains active through landing and is resolved only by this closeout package. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | `bandit land BANDIT-075 --action local-record` initially refused a dirty worktree after landing verdict rendering. | explicit no-action decision - the local-record contract correctly required a clean landing-verdict evidence commit before landing action |
| overreasoning | The work did not expand into reviewer promotion, paid routing, public benchmark publication, hosted replay services, Trust Verifier cutover, merge, push, deploy, or unrelated cockpit product work. | explicit no-action decision - forbidden and queued scopes stayed out of this chore |
| work-breakdown fit | Reviewer calibration fit as one bounded bootstrap chore spanning policy, seeded packet, command, validator, tests, review, landing, and closeout. | resolved - close the active gap through BANDIT-075 |
| agent-scope fit | Repo PM formation, Work Item PM orchestration, Test Writer RED, Claude Writer implementation, reviewers, Landing Agent, and Closeout Agent responsibilities stayed separated. | explicit no-action decision - role boundaries held |
| tool-use rule pressure | Local Qwen ran through `.bandit/reviewers/local-qwen.json` and `bin/omlx-chat-completions.mjs`; direct `qwen` CLI was rejected by tests and not used as review proof. | resolved - the authorized route remains the only Local Qwen review path |
| reviewer/model routing | Codex-authored RED routed Stage 3 implementation to Claude, CodeRabbit returned non-blocking findings, and Local Qwen passed through the authorized oMLX route. | explicit no-action decision - model-family separation held and reviewer outcomes have recorded pass, replacement, or disposition evidence |
| tool invocation friction | The repo CodeRabbit wrapper still requires fixture input, so live CodeRabbit pre-PR evidence used the direct provider command and manual evidence capture. | explicit no-action decision - current Stage 4 evidence records the provider command and no CodeRabbit pass claim |
| recurring inefficiency | Closeout still requires manual synchronization across coordination, gap ledger, roadmap, status, retrospective, and disposition artifacts. | explicit no-action decision - current workflow policy expects Closeout Agent synchronization and validation checks verify the synchronized route state |
| cost or latency signals | No paid reviewer, dependency install, external service, hosted preview, merge, push, or deploy was introduced; CodeRabbit provider execution returned within the 600-second window and Local Qwen completed locally. | explicit no-action decision - no cost-policy or supply-chain follow-up is required |
| unresolved uncertainty | The next queued target is known but no next work item is formed yet. | deferred to Repo PM - create a bounded chore from `docs/specs/BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION.json` before unrelated Phase 8 product work |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

`BANDIT-GAP-REVIEWER-CALIBRATION-SEEDED-DEFECTS` is resolved by `BANDIT-075` after landing action and this Stage 6 closeout evidence.

`BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` is the next queued bootstrap gap. The next recorded action is to create and form a bounded chore from `docs/specs/BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION.json` before proceeding to unrelated Phase 8 product work.

`BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` remains queued behind evidence bundle attestation.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-075`. Claude source implementation was accepted after RED coverage, PM review, focused tests, full test suite, typecheck, aggregate Bandit validation, role-run validation, risk classification, supply-chain gate validation, completed CodeRabbit provider evidence with dispositioned minor findings, Local Qwen pass evidence, review-subject hash evidence, and landing checks. No source repair remains open.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-EVIDENCE-BUNDLE-ATTESTATION` is the next queued bootstrap gap.
- `BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` remains queued behind evidence bundle attestation.
