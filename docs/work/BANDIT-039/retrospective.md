# BANDIT-039 Retrospective

## Outcome

`BANDIT-039` landed and closed out the bootstrap-gap chore for `BANDIT-GAP-AGENT-EVALUATION-HARNESS`. The work adds a replay-only Agent Evaluation Harness policy, packet and result templates, visible calibration and versioned locked-holdout packet evidence, repo-derived gold-labeled reviewer packet metadata, fail-closed harness validation, `bandit agent-evaluation validate [--json]`, and `bandit validate` integration without changing live work, reviewer routing, model routing, skill policy, cost policy, paid reviewer policy, scheduler behavior, claim or worktree authority, or cockpit UI scope. Stage 4 pre-PR CodeRabbit and Local Qwen evidence both pass with no findings, Stage 5 landing verdict and local-record landing action evidence are recorded, and no product, UAT, policy override, business tradeoff, explicit cost/risk override, supply-chain, server, PR/CI, external-service, live-routing, installed-global-skill edit, dependency, lockfile, or unrelated Phase 8 scope was introduced.

## What Worked

- The strategic-review source artifact and operator-confirmed scope identified the agent evaluation gap before reviewer-routing or agent-routing policy changes depended on unevaluated evidence.
- Focused RED tests captured the replay-only boundary, calibration versus locked-holdout separation, gold-labeled reviewer packets, scorecard metrics, paid-reviewer benchmark spend boundary, recurring promotion thresholds, and Skill Lifecycle Contract subject identity.
- The implementation kept the first harness evidence-only and repo-native while preserving the rule that benchmark results cannot automatically mutate live routing, policy, or spend behavior.
- CodeRabbit and Local Qwen both accepted the bounded implementation with pass verdicts and no unresolved findings.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Agent, reviewer, model, skill, and component comparisons need a replay-only harness before they can influence policy decisions. | bootstrap_gap_resolved | `BANDIT-039` adds fixed packet/result templates, calibration and locked-holdout evidence classes, reviewer packet metadata, scorecard metrics, promotion-threshold metadata, and fail-closed validation, and `.bandit/bootstrap-gaps.json` marks `BANDIT-GAP-AGENT-EVALUATION-HARNESS` resolved during closeout. |
| Benchmark evidence must separate visible calibration packets from locked holdout packets and use repo-derived gold labels before promotion decisions. | explicit no-action decision | The harness policy and validator now require calibration versus locked-holdout separation, reviewer packet gold labels, seeded blockers, seeded non-issues, expected observations, scoring labels, and holdout-backed promotion thresholds; no additional follow-up is needed for this contract. |
| Agent evaluation must not become stealth live routing, paid reviewer policy, or cost-policy authorization. | explicit no-action decision | The validator fails closed for live-routing effects, automatic policy mutation, one-off paid reviewer benchmark calls without pricing and approval evidence, and recurring paid-reviewer promotion thresholds without scoped holdout, false-positive, expected-cost, and spend-approval evidence. |
| External and third-party text still needs structural quarantine before release-authorized paths can safely process it. | queued_bootstrap_gap | `BANDIT-GAP-INPUT-QUARANTINE-GATE` remains queued behind this closeout and is the next bootstrap-gap chore before unrelated Phase 8 work. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | No failed tool calls remained in the final `BANDIT-039` closeout evidence. CodeRabbit, Local Qwen, landing, validation, gap listing, agent-evaluation validation, skill-lifecycle validation, and cockpit status commands completed successfully in the recorded evidence. | explicit no-action decision - no follow-up required |
| overreasoning | The work stayed bounded to replay-only agent evaluation contracts, repo-native packet/result templates, policy, fixed packet evidence, validation, focused tests, and required evidence updates. | explicit no-action decision - no unrelated input quarantine, layered risk, supply-chain, coordination authority, scheduler, claim, worktree, cockpit UI, live-routing, dependency, external-service, or paid-reviewer route work started |
| work-breakdown fit | The gap was well-sized as one bootstrap chore: write RED tests, implement the harness contract surfaces and validator, run Stage 4 review, record Stage 5 landing, then close out Stage 6. | explicit no-action decision - no follow-up required |
| agent-scope fit | Codex PM owned technical routing, Test Writer evidence was focused in agent-evaluation tests, Writer work stayed within scoped artifacts and validation code, CodeRabbit and Local Qwen owned Stage 4 review, and Landing Agent evidence owned Stage 5. | explicit no-action decision - no operator-owned routing question or agent-boundary follow-up remains |
| tool-use rule pressure | The closeout used the established artifact-create retrospective path plus manual gap-ledger and roadmap synchronization; no new tool pressure appeared beyond the current supported Stage 6 boundary. | explicit no-action decision - existing context, gap-ledger, and cockpit status validation remain sufficient for this closeout |
| reviewer/model routing | CodeRabbit passed with no findings, Local Qwen passed with no findings, and the recorded smell/risk rationale did not require escalated reviewer routing. | explicit no-action decision - no unresolved cross-model tension or reviewer-routing follow-up remains |
| tool invocation friction | The pre-PR CodeRabbit path, Local Qwen review command, review-subject hash command, agent-evaluation validation command, skill-lifecycle validation command, land-check, land command, and retrospective artifact-create path all had established invocation patterns for this chore. | explicit no-action decision - no new invocation-friction bootstrap gap required |
| recurring inefficiency | Roadmap, current-context, and bootstrap-gap ledger closeout still require repeated prose edits, but this instance is expected Stage 6 synchronization and cockpit status validation covers the resulting state. | explicit no-action decision - existing context and cockpit status validation remain sufficient for this closeout |
| cost or latency signals | No paid reviewer call, recurring paid model route, spend-class approval, high-token reviewer policy, benchmark spend, or live provider route was introduced. Provider-pricing-backed expected-cost fields are contract metadata only. | explicit no-action decision - no cost or latency follow-up required |
| unresolved uncertainty | No uncertainty remains for the Agent Evaluation Harness gap after tests, review evidence, landing verdict, landing action, validation evidence, and closeout. The next known trust-boundary uncertainty is already queued as `BANDIT-GAP-INPUT-QUARANTINE-GATE`. | queued bootstrap gap - BANDIT-GAP-INPUT-QUARANTINE-GATE |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

`BANDIT-GAP-AGENT-EVALUATION-HARNESS` is resolved by `BANDIT-039`. The next queued bootstrap gap is `BANDIT-GAP-INPUT-QUARANTINE-GATE`, which should become the next work item before unrelated Phase 8 work.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-039`. CodeRabbit pre-PR review passed with no findings, Local Qwen passed with no findings, both reviewers accepted the replay-only benchmark harness boundary, and no escalated reviewer route was required by the recorded risk and smell-trigger rationale.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-INPUT-QUARANTINE-GATE` is open and queued as the next bootstrap-gap chore.
- `BANDIT-GAP-LAYERED-RISK-CLASSIFICATION` remains queued behind the input quarantine gate.
- The remaining strategic-review bootstrap gaps remain queued in the order recorded in `.bandit/bootstrap-gaps.json`.

## Bootstrap-Gap Disposition

`BANDIT-GAP-AGENT-EVALUATION-HARNESS` is resolved.

The resolution evidence is:

- `docs/work/BANDIT-039/brief.md`
- `docs/work/BANDIT-039/red-evidence.md`
- `docs/work/BANDIT-039/implementation-evidence.md`
- `docs/work/BANDIT-039/coderabbit-review.md`
- `docs/work/BANDIT-039/local-qwen-review.md`
- `docs/work/BANDIT-039/review-evidence.md`
- `docs/work/BANDIT-039/landing-verdict.md`
- `docs/work/BANDIT-039/landing-action.md`
- `docs/work/BANDIT-039/retrospective.md`
- `.bandit/bootstrap-gaps.json`

`BANDIT-GAP-INPUT-QUARANTINE-GATE` remains open and queued. The next Bandit
step is to create exactly one bootstrap-gap chore for that gap; do not start
unrelated Phase 8 work first.

## Stage 6 Verification

- Retrospective: `pass` - this artifact records closeout for `BANDIT-039`.
- Structured improvement mining: `pass` - the checklist explicitly covers
  failed tool calls, overreasoning, work-breakdown fit, agent-scope fit,
  tool-use rule pressure, reviewer/model routing, tool invocation friction,
  recurring inefficiency, cost or latency signals, and unresolved uncertainty.
- Lesson disposition: `pass` - material lessons are classified as resolved
  bootstrap gap, queued bootstrap gap, or explicit no-action decision.
- Improvement disposition: `pass` - no new improvement chore is created; the
  resolved agent evaluation harness gap carries this closeout, and the next
  queued input quarantine gap carries the remaining trust-boundary follow-up.
- Bootstrap-gap disposition: `pass` -
  `BANDIT-GAP-AGENT-EVALUATION-HARNESS` is marked resolved in
  `.bandit/bootstrap-gaps.json`.
- Current context update: `pass` - `docs/roadmap/CURRENT_CONTEXT.md` and
  `docs/roadmap/ROADMAP.md` are updated during this closeout.
- Coordination closeout: `not_applicable` - `BANDIT-039` has no
  `docs/work/BANDIT-039/coordination-log.jsonl`, and this closeout does not add
  coordination state.
