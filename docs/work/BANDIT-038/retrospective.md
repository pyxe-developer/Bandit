# BANDIT-038 Retrospective

## Outcome

`BANDIT-038` landed and closed out the bootstrap-gap chore for `BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT`. The work adds a repo-native Skill Lifecycle Contract template, policy artifact, evaluation packets, installed-skill drift evidence, fail-closed lifecycle validation, `bandit skill-lifecycle validate [--json]`, and `bandit validate` integration without making installed global skill files canonical Bandit state. Stage 4 pre-PR CodeRabbit and Local Qwen evidence both pass with no findings, Stage 5 landing verdict and local-record landing action evidence are recorded, and no product, UAT, policy override, cost, supply-chain, server, scheduler, claim, worktree, PR/CI, external-service, paid-reviewer, live-routing, installed-global-skill edit, dependency, lockfile, or unrelated Phase 8 scope was introduced.

## What Worked

- The strategic-review source artifact and operator direction identified the load-bearing skill governance gap before skill policy became required stage authority.
- Focused lifecycle tests captured missing policy/template surfaces, malformed contracts, missing lifecycle fields, missing evaluation packets, and complete contract acceptance.
- The implementation kept canonical state repo-native while treating installed global skills as external evidence checked through explicit drift metadata.
- CodeRabbit and Local Qwen both accepted the bounded implementation with pass verdicts and no unresolved findings.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Load-bearing skills need explicit lifecycle contracts before they become required stage policy or benchmark variants. | bootstrap_gap_resolved | `BANDIT-038` adds the Skill Lifecycle Contract template, policy, validation command, evaluation packet references, rollback criteria, and installed-skill drift evidence, and `.bandit/bootstrap-gaps.json` marks `BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT` resolved during closeout. |
| Installed global skill files should be evidence inputs, not canonical Bandit workflow state. | explicit no-action decision | The lifecycle policy records `installed_skills_are_canonical: false`, keeps the contract in `.bandit/policy/skill-lifecycle-contracts.json`, and uses drift evidence to detect unreviewed installed-skill changes without moving source-of-truth authority out of the repo. |
| Stable skill identity and version evidence are prerequisites for meaningful agent, reviewer, model, skill, and component benchmarks. | queued_bootstrap_gap | `BANDIT-GAP-AGENT-EVALUATION-HARNESS` remains queued behind this closeout and can now depend on stable skill lifecycle identity instead of benchmarking against unversioned skill behavior. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | No failed tool calls remained in the final `BANDIT-038` closeout evidence. CodeRabbit, Local Qwen, landing, validation, gap listing, and cockpit status commands completed successfully in the recorded evidence. | explicit no-action decision - no follow-up required |
| overreasoning | The work stayed bounded to lifecycle contract docs/templates, repo-native policy, evaluation/drift evidence, validation, focused tests, and required evidence updates. | explicit no-action decision - no unrelated cockpit, scheduler, claim, worktree, live-routing, installed-skill edit, dependency, or external-service work started |
| work-breakdown fit | The gap was well-sized as one bootstrap chore: write RED tests, implement the lifecycle contract surfaces and validator, run Stage 4 review, record Stage 5 landing, then close out Stage 6. | explicit no-action decision - no follow-up required |
| agent-scope fit | Codex PM owned technical routing, Test Writer evidence was focused in lifecycle tests, CodeRabbit and Local Qwen owned Stage 4 review, and Landing Agent evidence owned Stage 5. | explicit no-action decision - no operator-owned routing question or agent-boundary follow-up remains |
| tool-use rule pressure | The closeout used the established artifact-create retrospective path plus manual ledger and context synchronization; no new tool pressure appeared beyond the current supported Stage 6 boundary. | explicit no-action decision - existing context, gap-ledger, and cockpit status validation remain sufficient for this closeout |
| reviewer/model routing | CodeRabbit passed with no findings, Local Qwen passed with no findings, and the recorded smell/risk rationale did not require escalated reviewer routing. | explicit no-action decision - no unresolved cross-model tension or reviewer-routing follow-up remains |
| tool invocation friction | The pre-PR CodeRabbit path, Local Qwen review command, review-subject hash command, skill-lifecycle validation command, land-check, land command, and retrospective artifact-create path all had established invocation patterns for this chore. | explicit no-action decision - no new invocation-friction bootstrap gap required |
| recurring inefficiency | Roadmap, current-context, and bootstrap-gap ledger closeout still require repeated prose edits, but this instance is expected Stage 6 synchronization and cockpit status validation covers the resulting state. | explicit no-action decision - existing context and cockpit status validation remain sufficient for this closeout |
| cost or latency signals | No paid reviewer, recurring paid model route, provider-pricing evidence, spend-class approval, high-token reviewer policy, or benchmark/evaluation spend was introduced. | explicit no-action decision - no cost or latency follow-up required |
| unresolved uncertainty | No uncertainty remains for the skill lifecycle contract gap after tests, review evidence, landing verdict, landing action, validation evidence, and closeout. The next known benchmark uncertainty is already queued as `BANDIT-GAP-AGENT-EVALUATION-HARNESS`. | queued bootstrap gap - BANDIT-GAP-AGENT-EVALUATION-HARNESS |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

`BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT` is resolved by `BANDIT-038`. The next queued bootstrap gap is `BANDIT-GAP-AGENT-EVALUATION-HARNESS`, which should become the next work item before unrelated Phase 8 work.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-038`. CodeRabbit pre-PR review passed with no findings, Local Qwen passed with no findings, both reviewers accepted the repo-native lifecycle contract boundary, and no escalated reviewer route was required by the recorded risk and smell-trigger rationale.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-AGENT-EVALUATION-HARNESS` is open and queued as the next bootstrap-gap chore.
- `BANDIT-GAP-INPUT-QUARANTINE-GATE` remains queued behind the agent evaluation harness.
- The remaining strategic-review bootstrap gaps remain queued in the order recorded in `.bandit/bootstrap-gaps.json`.

## Bootstrap-Gap Disposition

`BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT` is resolved.

The resolution evidence is:

- `docs/work/BANDIT-038/brief.md`
- `docs/work/BANDIT-038/red-evidence.md`
- `docs/work/BANDIT-038/implementation-evidence.md`
- `docs/work/BANDIT-038/coderabbit-review.md`
- `docs/work/BANDIT-038/local-qwen-review.md`
- `docs/work/BANDIT-038/review-evidence.md`
- `docs/work/BANDIT-038/landing-verdict.md`
- `docs/work/BANDIT-038/landing-action.md`
- `docs/work/BANDIT-038/retrospective.md`
- `.bandit/bootstrap-gaps.json`

`BANDIT-GAP-AGENT-EVALUATION-HARNESS` remains open and queued. The next Bandit
step is to create exactly one bootstrap-gap chore for that gap; do not start
unrelated Phase 8 work first.

## Stage 6 Verification

- Retrospective: `pass` - this artifact records closeout for `BANDIT-038`.
- Structured improvement mining: `pass` - the checklist explicitly covers
  failed tool calls, overreasoning, work-breakdown fit, agent-scope fit,
  tool-use rule pressure, reviewer/model routing, tool invocation friction,
  recurring inefficiency, cost or latency signals, and unresolved uncertainty.
- Lesson disposition: `pass` - material lessons are classified as resolved
  bootstrap gap, queued bootstrap gap, or explicit no-action decision.
- Improvement disposition: `pass` - no new improvement chore is created; the
  resolved skill lifecycle contract gap carries this closeout, and the next
  queued agent evaluation harness gap carries the remaining benchmark follow-up.
- Bootstrap-gap disposition: `pass` -
  `BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT` is marked resolved in
  `.bandit/bootstrap-gaps.json`.
- Current context update: `pass` - `docs/roadmap/CURRENT_CONTEXT.md` and
  `docs/roadmap/ROADMAP.md` are updated during this closeout.
- Coordination closeout: `not_applicable` - `BANDIT-038` has no
  `docs/work/BANDIT-038/coordination-log.jsonl`, and this closeout does not add
  coordination state.
