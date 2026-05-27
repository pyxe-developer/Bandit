# BANDIT-035 Retrospective

## Outcome

`BANDIT-035` landed and closed out the bootstrap-gap chore for
`BANDIT-GAP-ARTIFACT-CREATE-LANDING-WORK-ITEM-FIELD`.

The work repaired `bandit artifact create` so generated landing-verdict
artifacts include the parser-required `work_item` field, added focused
artifact-create tests for parser-compatible landing-verdict output, preserved
existing refusal behavior, and kept repo-native Markdown evidence as the
canonical landing source. Stage 4 pre-PR CodeRabbit and Local Qwen evidence pass
with no findings after the focused repair loop. Stage 5 landing verdict,
passing `land-check`, and local-record landing action evidence are recorded.

No local server/API mode, state-index persistence, scheduler execution,
worktree lifecycle, claim lease, work surface reservation, automatic merge,
push, deploy, product UAT approval, actor identity policy, PR/CI workflow,
external service setup, policy change, business tradeoff, cost/risk override,
dependency or lockfile change, supply-chain-sensitive surface, or unrelated
Phase 8 feature behavior was introduced.

## What Worked

- The bootstrap-gap source artifact named a concrete parser/renderer mismatch,
  which kept the repair narrow and testable.
- Focused RED coverage in `test/artifact-create.test.mjs` made the missing
  `work_item` field observable before the renderer change.
- The existing landing gate failed closed on malformed generated evidence, so
  the workflow caught the renderer defect before an invalid landing could pass.
- The pre-PR CodeRabbit path and Local Qwen gate both accepted the final repair
  without requiring an escalated reviewer or operator-owned input.

## Structured Improvement Mining Checklist

| Prompt | Finding | Disposition |
|---|---|---|
| Failed tool calls | No failed tool calls remained in the final closeout evidence. The earlier CodeRabbit repair loop produced actionable findings, not tool failure, and the final provider rerun plus normalized pre-PR evidence passed. | no_action |
| Overreasoning | The work stayed bounded to artifact-create landing-verdict rendering and closeout evidence; no speculative cockpit, scheduler, claim, or workflow-policy work was started. | no_action |
| Work-breakdown fit | The gap was well-sized as one bootstrap chore: one renderer defect, focused tests, review gates, landing action, and retrospective disposition. | no_action |
| Agent-scope fit | Codex PM owned routine routing, CodeRabbit and Local Qwen owned Stage 4 review, and Landing Agent owned Stage 5 evidence. No operator-owned product, UAT, policy, cost, or risk decision was crossed. | no_action |
| Tool-use rule pressure | The pre-PR CodeRabbit path required both live provider output and fixture normalization, but the established BANDIT-027 path handled it without a new workflow gap. | no_action |
| Reviewer/model routing | CodeRabbit initially surfaced focused repair work, then passed with no findings; Local Qwen passed with no findings; no model disagreement or smell trigger required escalation. | no_action |
| Tool invocation friction | `bandit artifact create` can still render retrospectives without the Stage 6 structured mining checklist, but this was already recorded as `BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING`. That queued gap is now the next bootstrap-gap chore. | existing_bootstrap_gap |
| Recurring inefficiency | Duplicate roadmap/current-context paragraphs can go stale across stage transitions, but `cockpit status --json`, `validate`, and targeted context updates remain sufficient for this closeout. No separate chore is created from this instance. | no_action |
| Cost or latency signals | No paid reviewer, recurring paid model route, or new high-token reviewer policy was introduced. | no_action |
| Unresolved uncertainty | The only unresolved workflow uncertainty is the already queued retrospective-mining artifact contract gap. It remains a bootstrap-gap chore, not a blocker for resolving the landing-verdict renderer gap. | existing_bootstrap_gap |

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
|---|---|---|
| Artifact renderers must preserve fields consumed by downstream gates; otherwise generated evidence can be invalid even when structured input is correct. | bootstrap_gap_resolved | `BANDIT-035` adds landing-verdict `work_item` rendering coverage and parser-compatible output evidence, and `.bandit/bootstrap-gaps.json` now marks `BANDIT-GAP-ARTIFACT-CREATE-LANDING-WORK-ITEM-FIELD` resolved. |
| Landing gates should continue to fail closed when generated evidence omits required parser fields. | no_action | `land-check` already blocked the malformed `BANDIT-034` landing verdict until Codex PM repaired it, and `BANDIT-035` did not weaken that behavior. |
| Stage 6 retrospective artifact creation still lacks enforced structured improvement mining. | existing_bootstrap_gap | `BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING` is already recorded with source artifacts, rationale, and next action; it becomes the next queued bootstrap-gap chore after this closeout. |

## Improvement Chores

No new improvement chore is created by this retrospective.

The relevant follow-up is the existing bootstrap gap
`BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING`, which should become the next
bootstrap-gap chore before unrelated Phase 8 work.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-035`.

CodeRabbit initially found focused test-fixture and evidence-routing issues
during Stage 4. Codex PM accepted the actionable findings, repaired or
dispositioned them in `docs/work/BANDIT-035/coderabbit-finding-disposition.md`,
reran the provider review, and recorded final CodeRabbit pass evidence. Local
Qwen then passed with no findings. No escalated reviewer route was required by
the recorded risk and smell-trigger rationale.

## Bootstrap-Gap Disposition

`BANDIT-GAP-ARTIFACT-CREATE-LANDING-WORK-ITEM-FIELD` is resolved.

The resolution evidence is:

- `docs/work/BANDIT-035/brief.md`
- `docs/work/BANDIT-035/red-evidence.md`
- `docs/work/BANDIT-035/implementation-evidence.md`
- `docs/work/BANDIT-035/coderabbit-review.md`
- `docs/work/BANDIT-035/coderabbit-finding-disposition.md`
- `docs/work/BANDIT-035/local-qwen-review.md`
- `docs/work/BANDIT-035/review-evidence.md`
- `docs/work/BANDIT-035/landing-verdict.md`
- `docs/work/BANDIT-035/landing-action.md`
- `.bandit/bootstrap-gaps.json`

`BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING` remains open and queued. The next
Bandit step is to create exactly one bootstrap-gap chore for that gap; do not
start unrelated Phase 8 work first.

## Stage 6 Verification

- Retrospective: `pass` - this artifact records closeout for `BANDIT-035`.
- Structured improvement mining: `pass` - the checklist explicitly covers
  failed tool calls, overreasoning, work-breakdown fit, agent-scope fit,
  tool-use rule pressure, reviewer/model routing, tool invocation friction,
  recurring inefficiency, cost or latency signals, and unresolved uncertainty.
- Lesson disposition: `pass` - material lessons are classified as resolved
  bootstrap gap, no-action, or existing bootstrap gap.
- Improvement disposition: `pass` - no new improvement chore is created; the
  existing structured-retrospective-mining bootstrap gap carries the remaining
  follow-up.
- Bootstrap-gap disposition: `pass` -
  `BANDIT-GAP-ARTIFACT-CREATE-LANDING-WORK-ITEM-FIELD` is marked resolved in
  `.bandit/bootstrap-gaps.json`.
- Current context update: `pass` - `docs/roadmap/CURRENT_CONTEXT.md` and
  `docs/roadmap/ROADMAP.md` are updated during this closeout.
- Coordination closeout: `not_applicable` - `BANDIT-035` has no
  `docs/work/BANDIT-035/coordination-log.jsonl`, and this closeout does not add
  coordination state.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING` is open and queued. The next
  Bandit step is to create its bootstrap-gap chore before unrelated Phase 8
  work.
- `BANDIT-GAP-WORKFLOW-TRIAL-DECISION-GUARDRAILS` remains queued behind
  structured retrospective mining.
- `BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT` remains queued behind workflow-trial
  decision guardrails.
