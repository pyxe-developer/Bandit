# BANDIT-077 Retrospective

## Outcome

`BANDIT-077` landed and closed out the Spec-To-Evidence Traceability Matrix
bootstrap chore. The work adds a repo-native read-only traceability policy, a
matrix template, a public `bandit spec-to-evidence validate <WORK_ITEM>
[--json]` command, focused fail-closed tests, review-evidence template fields
for traceability quality, Stage 4 review evidence, and local-record landing
evidence.

The implementation deliberately avoids Trust Verifier cutover, old-gate
replacement, reviewer promotion, paid routing, hosted services, telemetry,
merge, push, deploy, guarded browser action execution, coverage mandates,
mutation-score mandates, or unrelated cockpit product scope.

## What Worked

- Formation, plan-mode orchestration, Codex-authored RED evidence, Claude Stage
  3 implementation, PM acceptance, review, landing, and closeout stayed
  grounded in repo-native artifacts.
- Bootstrap Model-Family Separation held: Codex authored RED tests while Claude
  implemented Stage 3 source and policy surfaces only.
- The Stage 3 Writer did not edit Test Writer-owned tests, fixtures, RED
  evidence, acceptance mappings, review evidence, landing evidence, or
  retrospective evidence.
- The repair loop found a real compatibility gap in existing chore briefs:
  prose acceptance bullets and `work_type: chore` risk-tier inference needed to
  be supported before the validator could pass against live Bandit work.
- Focused traceability tests covered missing mappings, vague evidence,
  unsupported evidence types, implementation-detail rationale requirements,
  explicit disposition rationale, reviewer-template fields, and live
  `BANDIT-077` matrix validation.
- Stage 4 reviewer routing stayed honest: CodeRabbit timed out after the full
  600-second window with no pass claimed, while Local Qwen returned pass through
  the authorized MLX adapter route.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Existing Bandit chore briefs may use prose acceptance bullets rather than explicit AC labels. | resolved | The validator now synthesizes deterministic `AC1`, `AC2`, etc. labels while preserving explicit labels when present. |
| Risk-tier evidence should not require rewriting older live chore briefs. | resolved | The validator infers `bootstrap_chore` from `work_type: chore` when `risk_tier` is absent, while explicit risk tiers still win. |
| Traceability must prove behavior, not artifact existence. | resolved | Policy, focused tests, and review-template fields distinguish behavior evidence from implementation-detail evidence and require rationale for weak dispositions. |
| Closeout-only acceptance criteria should remain explicit until closeout evidence exists. | resolved | AC6 remained dispositioned as a bootstrap gap through landing and is updated at closeout with landing action, retrospective, and gap-ledger evidence. |
| CodeRabbit provider timeout remains a recurring Stage 4 latency issue. | explicit no-action decision | The timeout is recorded with no CodeRabbit pass claim; Local Qwen pass plus PM review, risk classification, supply-chain gate, and full verification satisfy this slice without a new chore. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed validation | Initial implementation passed fixture tests but failed against the real `BANDIT-077` brief shape. | resolved - added RED repair coverage and Claude source repair for prose acceptance bullets and work-type risk inference |
| reviewer/tool friction | CodeRabbit timed out after the full 600-second window. | explicit no-action decision - provider-timeout evidence is recorded as bootstrap replacement evidence with no pass claim |
| model-family separation | Codex-authored RED required Claude-family Stage 3 implementation. | resolved - Claude implemented source only and Codex PM performed acceptance/review/closeout |
| role-boundary pressure | The live traceability matrix was Test Writer-owned evidence, not Stage 3 Writer-owned source. | resolved - Claude did not edit the Test Writer-owned matrix or tests |
| scope-control pressure | The chore could have drifted into coverage mandates or Trust Verifier cutover. | explicit no-action decision - those surfaces remain out of scope and unauthorized |
| cost or latency signals | No paid reviewer, dependency install, external service, hosted preview, merge, push, or deploy was introduced. | explicit no-action decision - no cost-policy or supply-chain follow-up is required |
| unresolved uncertainty | No open bootstrap gaps remain after this closeout. | deferred to Repo PM - form the next Phase 8 product slice only from roadmap authority and ask the operator if product direction is insufficient |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

`BANDIT-GAP-SPEC-TO-EVIDENCE-TRACEABILITY-MATRIX` is resolved by `BANDIT-077`
after landing action, traceability validation, and this Stage 6 closeout
evidence.

No open bootstrap gap remains in the ledger after this closeout. The next
recorded target is Repo PM formation/triage for the next Phase 8 product queue
item, currently Guarded CLI Action Requests, without starting that slice from
this Work Item PM run.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-077`. Claude source
implementation was accepted after RED repair coverage, PM review, focused tests,
full test suite, typecheck, aggregate Bandit validation, coordination
validation, risk classification, supply-chain gate validation, CodeRabbit
bootstrap replacement evidence, Local Qwen pass evidence, review-subject hash
evidence, landing checks, and final traceability validation. No source repair
remains open.

## Bootstrap Gaps Remaining

No open bootstrap gaps remain after `BANDIT-077` closeout.
