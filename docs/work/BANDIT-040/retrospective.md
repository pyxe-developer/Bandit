# BANDIT-040 Retrospective

## Outcome

`BANDIT-040` landed and closed out the bootstrap-gap chore for `BANDIT-GAP-INPUT-QUARANTINE-GATE`. The work adds a repo-native Input Quarantine Gate policy, input-quarantine and Trusted Source Gate templates, source-class validation, Data-Only External Input handling checks, quarantine boundary evidence checks, bounded Trusted Source Gate metadata validation, Trusted Local Repo Mode limits, `bandit input-quarantine validate [--json]`, `bandit validate` integration, and focused tests without implementing layered risk classification, supply-chain policy, dependency or lockfile policy, live reviewer routing, paid reviewer routing, scheduler authority, claim/worktree authority, installed global skill edits, external services, PR/CI workflow, or cockpit UI scope. Stage 4 pre-PR CodeRabbit and Local Qwen evidence both pass with no findings, Stage 5 landing verdict and local-record landing action evidence are recorded, and no product, UAT, policy override, business tradeoff, explicit cost/risk override, supply-chain-sensitive execution path, or unrelated Phase 8 work was introduced.

## What Worked

- The strategic-review source artifact and Bandit vocabulary already identified Data-Only External Input, Input Quarantine Boundary, Trusted Source Gate, and Trusted Local Repo Mode, which kept the repair bounded to a concrete trust-layer gap.
- Focused RED tests captured missing source classification, non-data-only external handling, missing quarantine evidence, instruction-bearing use without a Trusted Source Gate, malformed gate metadata, Trusted Local Repo Mode overreach, unknown source refusal, and complete bounded acceptance.
- The implementation kept source trust explicit in repo-native policy, templates, and validation rather than moving authority into reviewers, generated context, cockpit state, scheduler behavior, or model routing.
- CodeRabbit and Local Qwen both accepted the bounded input-quarantine implementation with pass verdicts and no unresolved findings.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Release-authorized paths need structural input quarantine before external or third-party content can be inspected safely. | bootstrap_gap_resolved | `BANDIT-040` adds the Input Quarantine Gate policy, templates, validation command, default repo policy, evidence examples, and focused tests, and `.bandit/bootstrap-gaps.json` marks `BANDIT-GAP-INPUT-QUARANTINE-GATE` resolved during closeout. |
| Trusted Local Repo Mode must terminate at external contributor, fetched third-party, generated instruction, fetched prompt, dependency documentation, issue metadata, PR metadata, and review-comment boundaries. | explicit no-action decision | The input quarantine policy and validator now require source classes and local-mode terminators, reject unknown source classes, and fail closed when external or third-party content is not data-only before release-authorized handling. |
| Trusted Source Gate upgrades must be bounded, fresh, owned, revocable, evidence-backed, and specific to allowed uses. | explicit no-action decision | The validator rejects missing source identity, scope, allowed uses, owner, freshness or expiry rule, revocation path, trust rationale, evidence artifact, blanket trust, permanent trust, source-reputation-only trust, and hidden instruction-bearing fields. |
| Input quarantine state is now available as an input to later review-depth and auto-landing policy, but it is not itself a layered risk-classification gate. | queued_bootstrap_gap | `BANDIT-GAP-LAYERED-RISK-CLASSIFICATION` remains queued behind this closeout and is the next bootstrap-gap chore before unrelated Phase 8 work. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | The broad CodeRabbit origin/main run reached provider analysis but did not produce terminal evidence before it was stopped; the closeout recorded no pass from that run and used focused pre-PR CodeRabbit evidence at the Stage 3 implementation delta instead. Final CodeRabbit, Local Qwen, landing, validation, gap listing, input-quarantine validation, agent-evaluation validation, skill-lifecycle validation, and cockpit status evidence passed. | explicit no-action decision - the focused pre-PR CodeRabbit path produced terminal pass evidence and no new invocation-friction gap is required |
| overreasoning | The work stayed bounded to input quarantine policy, templates, validation, evidence examples, focused tests, review evidence, landing evidence, and closeout artifacts. | explicit no-action decision - no unrelated layered risk, supply-chain, coordination authority, scheduler, claim, worktree, cockpit UI, live-routing, dependency, lockfile, external-service, or paid-reviewer route work started |
| work-breakdown fit | The gap was well-sized as one bootstrap chore: write RED tests, implement the input quarantine contract and validator, run Stage 4 review, record Stage 5 landing, then close out Stage 6. | explicit no-action decision - no follow-up required for slice size |
| agent-scope fit | Codex PM owned technical routing, Test Writer evidence was focused in input-quarantine tests, Writer work stayed within policy/template/validator/command surfaces, CodeRabbit and Local Qwen owned Stage 4 review, and Landing Agent evidence owned Stage 5. | explicit no-action decision - no operator-owned routing question or agent-boundary follow-up remains |
| tool-use rule pressure | The closeout used the established artifact-create retrospective path plus manual gap-ledger and roadmap synchronization; no new tool pressure appeared beyond the current supported Stage 6 boundary. | explicit no-action decision - existing context, gap-ledger, and cockpit status validation remain sufficient for this closeout |
| reviewer/model routing | CodeRabbit passed with no findings, Local Qwen passed with no findings, and the recorded smell/risk rationale did not require escalated reviewer routing. | explicit no-action decision - no unresolved cross-model tension or reviewer-routing follow-up remains |
| tool invocation friction | The broad CodeRabbit attempt produced no terminal evidence, but the repo-supported focused pre-PR CodeRabbit invocation, Local Qwen review command, review-subject hash command, input-quarantine validation, land-check, land command, and retrospective artifact-create path all had established invocation patterns. | explicit no-action decision - no new invocation-friction bootstrap gap required |
| recurring inefficiency | Roadmap, current-context, and bootstrap-gap ledger closeout still require repeated prose edits, but this instance is expected Stage 6 synchronization and cockpit status validation covers the resulting state. | explicit no-action decision - existing context and cockpit status validation remain sufficient for this closeout |
| cost or latency signals | No paid reviewer call, recurring paid model route, spend-class approval, high-token reviewer policy, benchmark spend, or live provider route was introduced. CodeRabbit and Local Qwen evidence used existing Stage 4 reviewer paths. | explicit no-action decision - no cost or latency follow-up required |
| unresolved uncertainty | No uncertainty remains for the Input Quarantine Gate gap after tests, review evidence, landing verdict, landing action, validation evidence, and closeout. The next known trust-layer policy gap is already queued as `BANDIT-GAP-LAYERED-RISK-CLASSIFICATION`. | queued bootstrap gap - BANDIT-GAP-LAYERED-RISK-CLASSIFICATION |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

`BANDIT-GAP-INPUT-QUARANTINE-GATE` is resolved by `BANDIT-040`. The next queued bootstrap gap is `BANDIT-GAP-LAYERED-RISK-CLASSIFICATION`, which should become the next work item before unrelated Phase 8 work.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-040`. Focused pre-PR CodeRabbit review passed with no findings, Local Qwen passed with no findings, both reviewers accepted the data-only input quarantine and Trusted Source Gate boundary, and no escalated reviewer route was required by the recorded risk and smell-trigger rationale.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-LAYERED-RISK-CLASSIFICATION` is open and queued as the next bootstrap-gap chore.
- `BANDIT-GAP-SUPPLY-CHAIN-GATE` remains queued behind layered risk classification.
- The remaining strategic-review bootstrap gaps remain queued in the order recorded in `.bandit/bootstrap-gaps.json`.

## Bootstrap-Gap Disposition

`BANDIT-GAP-INPUT-QUARANTINE-GATE` is resolved.

The resolution evidence is:

- `docs/work/BANDIT-040/brief.md`
- `docs/work/BANDIT-040/red-evidence.md`
- `docs/work/BANDIT-040/implementation-evidence.md`
- `docs/work/BANDIT-040/coderabbit-review.md`
- `docs/work/BANDIT-040/local-qwen-review.md`
- `docs/work/BANDIT-040/review-evidence.md`
- `docs/work/BANDIT-040/landing-verdict.md`
- `docs/work/BANDIT-040/landing-action.md`
- `docs/work/BANDIT-040/retrospective.md`
- `.bandit/bootstrap-gaps.json`

`BANDIT-GAP-LAYERED-RISK-CLASSIFICATION` remains open and queued. The next
Bandit step is to create exactly one bootstrap-gap chore for that gap; do not
start unrelated Phase 8 work first.

## Stage 6 Verification

- Retrospective: `pass` - this artifact records closeout for `BANDIT-040`.
- Structured improvement mining: `pass` - the checklist explicitly covers
  failed tool calls, overreasoning, work-breakdown fit, agent-scope fit,
  tool-use rule pressure, reviewer/model routing, tool invocation friction,
  recurring inefficiency, cost or latency signals, and unresolved uncertainty.
- Lesson disposition: `pass` - material lessons are classified as resolved
  bootstrap gap, queued bootstrap gap, or explicit no-action decision.
- Improvement disposition: `pass` - no new improvement chore is created; the
  resolved input quarantine gate carries this closeout, and the next queued
  layered risk-classification gap carries the remaining review-depth and
  auto-landing policy follow-up.
- Bootstrap-gap disposition: `pass` -
  `BANDIT-GAP-INPUT-QUARANTINE-GATE` is marked resolved in
  `.bandit/bootstrap-gaps.json`.
- Current context update: `pass` - `docs/roadmap/CURRENT_CONTEXT.md` and
  `docs/roadmap/ROADMAP.md` are updated during this closeout.
- Coordination closeout: `not_applicable` - `BANDIT-040` has no
  `docs/work/BANDIT-040/coordination-log.jsonl`, and this closeout does not add
  coordination state.
