# BANDIT-095 Retrospective

## Outcome

`BANDIT-095` landed the Repo PM Create Controller Closed Anchor Routing repair.

The slice teaches the roadmap target resolver to treat a closed current work
item as an explicit anchor for the next authorized ROADMAP target, and teaches
the Repo PM create controller to validate previous-slice boundary evidence
before creating the next work item. The controller now requires
`landing-action.md`, `retrospective.md`, `improvement-disposition.md`, and a
latest coordination state of `closed` for the closed anchor before it routes to
the next unformed item.

The work remains bounded to local workflow routing. It does not implement Work
Item PM execute-controller behavior, route registries, operator command
adapters, Trust Verifier cutover, cockpit UI, local API, State Index, hosted
services, telemetry, public benchmark publication, paid routing, merge, push,
deploy, credential handling, dependency changes, package scripts, CI/release
workflow changes, external repo mutation, or unrelated Phase 8 work.

## What Worked

- Plan-mode orchestration was recorded before RED evidence.
- RED evidence captured the exact regression: a closed current-work anchor
  should route to the next ROADMAP target, while incomplete previous-slice
  evidence must fail closed.
- Claude completed the Stage 3 source implementation within the allotted
  window and did not edit Test Writer-owned surfaces.
- Local Qwen completed through the authorized `.bandit/reviewers/local-qwen.json`
  route and returned pass with no findings.
- CodeRabbit timed out after the required 600-second window; the timeout was
  recorded honestly as `bootstrap_gap` replacement evidence without claiming a
  pass.
- `land-check` passed with CodeRabbit timeout evidence, Local Qwen pass
  evidence, risk classification, supply-chain gate, and landing verdict
  evidence.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Closed-anchor routing needs a hard previous-slice boundary check before next work creation. | keep | The implementation validates landing action, retrospective, improvement disposition, and closed coordination evidence before side effects. |
| Staging new policy evidence matters before review-subject hash refresh. | keep | The first hash omitted untracked BANDIT-095 risk/supply files; staging them produced the correct landing hash. |
| Local Qwen remains dependent on a clean source/evidence checkpoint. | keep | The source/evidence checkpoint commit made `qwen-review` eligible to stamp `source_head`. |
| CodeRabbit timeout replacement evidence is still enough only when the rest of Stage 4 is current and explicit. | keep | Review evidence records timeout as `bootstrap_gap`, Local Qwen pass, risk/supply gates, and current tests. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| bootstrap gap repair | Closed-anchor interstitial routing was not handled by the create controller. | resolved - BANDIT-095 implements and tests the closed-anchor route plus boundary evidence checks. |
| reviewer/provider timeout | CodeRabbit timed out after the full Stage 4 window. | no_action - provider timeout is recorded as replacement evidence; Local Qwen passed and no CodeRabbit findings were emitted. |
| workflow hygiene | Review-subject hash ignored untracked new policy evidence until staged. | keep - keep staging policy gate evidence before hash refresh as a Stage 4/5 operator habit. |
| role boundary | Stage 3 Writer source-only edit boundary held. | keep - Stage 3 Writer changed only implementation/evidence files; Test Writer-owned tests remained Codex-authored Stage 2 evidence. |

## Improvement Chores

No new improvement chore is created by `BANDIT-095`.

The material lesson from the active bootstrap gap is resolved by this slice and
is durable in:

- `src/state/roadmap-work-targets.ts`
- `src/state/work-create-controller.ts`
- `test/roadmap-work-targets.test.mjs`
- `test/work-create-controller.test.mjs`
- `docs/work/BANDIT-095/red-evidence.md`
- `docs/work/BANDIT-095/implementation-evidence.md`
- `docs/work/BANDIT-095/stage3-pm-acceptance.md`
- `docs/work/BANDIT-095/coderabbit-review.md`
- `docs/work/BANDIT-095/local-qwen-review.md`
- `docs/work/BANDIT-095/review-evidence.md`
- `docs/work/BANDIT-095/landing-verdict.md`
- `docs/work/BANDIT-095/landing-action.md`
- `.bandit/bootstrap-gaps.json`
- `.bandit/policy/risk-classification.json`
- `.bandit/policy/supply-chain-gate.json`
- `.bandit/policy/risk-classifications/BANDIT-095-risk-classification.json`
- `.bandit/policy/supply-chain-gates/BANDIT-095-supply-chain-gate.json`

## Cross-Model Tension

No unresolved cross-model tension remains. CodeRabbit timeout is not treated as
a pass; Local Qwen passed with no findings; PM acceptance and landing evidence
record the bounded risk and clean-code posture.

## Bootstrap Gaps Remaining

No open bootstrap gap remains after `BANDIT-095` closeout.

The next recorded action is Repo PM formation for PRD-005.3 Work Item PM
Execute Controller And Route Registry.
