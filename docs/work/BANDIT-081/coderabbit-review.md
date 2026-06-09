# CodeRabbit Review: BANDIT-081

contract_version: 1
work_item: BANDIT-081
source_head: 7bb4f55445a3145fa71b5a4432280e739dedac3b
provider: coderabbit-cli
review_target: origin/main..HEAD
review_state: timeout
coderabbit_verdict: bootstrap_gap
findings_status: resolved
findings_disposition: CodeRabbit did not emit a terminal review verdict before the required 600 second wait elapsed, so no CodeRabbit pass is claimed. The partial provider output emitted three findings; the two null-guard findings were repaired, and the duplicate responsive finding was partially repaired by computing responsive metadata once while preserving the legacy top-level responsive contract required by existing tests.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - timeout 600 coderabbit review --agent --base origin/main -c AGENTS.md -c CLEAN_CODE.md -c docs/verification/STAGE_RUBRICS.md -c docs/plans/BOOTSTRAP_METHODOLOGY.md -c docs/work/BANDIT-081/brief.md -c docs/work/BANDIT-081/red-evidence.md -c docs/work/BANDIT-081/implementation-evidence.md -c docs/work/BANDIT-081/stage3-pm-review.md
  - Captured output is stored under .bandit/tmp/BANDIT-081-coderabbit-review/.
  - The bounded run exited with code 124 after 600 seconds.
  - Output reached review_context, setup, analyzing, reviewing, two heartbeat states, and three finding events, but did not emit review_completed.
  - Focused repair verification passed: node --test test/cockpit-operator-attention.test.mjs; node --test test/cockpit-browser-shell.test.mjs; node --test test/cockpit-view-model.test.mjs; npm run typecheck.
bootstrap_gaps:
  - coderabbit_timeout_without_terminal_review

## Provider Output Before Timeout

```jsonl
{"type":"review_context","reviewType":"all","currentBranch":"main","baseBranch":"origin/main","workingDirectory":"/Users/matthewflebbe/Bandit"}
{"type":"status","phase":"connecting","status":"connecting_to_review_service"}
{"type":"status","phase":"setup","status":"setting_up"}
{"type":"status","phase":"setup","status":"preparing_sandbox"}
{"type":"status","phase":"analyzing","status":"summarizing"}
{"type":"status","phase":"analyzing","status":"reviewing"}
{"type":"heartbeat","status":"reviewing"}
{"type":"finding","severity":"trivial","fileName":"src/cockpit/browser-shell.ts","codegenInstructions":"Verify each finding against current code. Fix only still-valid issues, skip the rest with a brief reason, keep changes minimal, and validate. In @src/cockpit/browser-shell.ts around lines 245 - 253, The object currently assigns responsive twice (top-level responsive and layout.responsive using buildResponsive(isMobile)); remove the redundant top-level property and keep layout: { responsive: buildResponsive(isMobile) } (or vice versa if the type requires the top-level field - be consistent), ensuring any callers/consumers expect the single location; update occurrences referencing the removed field accordingly and keep the buildResponsive(isMobile) call only once.","suggestions":[]}
{"type":"finding","severity":"critical","fileName":"src/cockpit/browser-shell.ts","codegenInstructions":"Verify each finding against current code. Fix only still-valid issues, skip the rest with a brief reason, keep changes minimal, and validate. In @src/cockpit/browser-shell.ts around lines 529 - 541, buildOperatorAttentionSection currently calls operatorAttention.rows.map(...) without guarding for null/undefined; mirror the safe pattern used in buildQueueContextSection by checking operatorAttention.rows before mapping so the function will not throw when rows is missing.","suggestions":[]}
{"type":"finding","severity":"critical","fileName":"src/cockpit/browser-shell.ts","codegenInstructions":"Verify each finding against current code. Fix only still-valid issues, skip the rest with a brief reason, keep changes minimal, and validate. In @src/cockpit/browser-shell.ts around lines 557 - 568, buildOperatorInboxSection currently calls operatorInbox.messages.map(...) without guarding for null/undefined which can throw; update buildOperatorInboxSection to handle a missing messages array by either returning an empty inbox section or treating messages as an empty array before mapping.","suggestions":[]}
{"type":"heartbeat","status":"reviewing"}
{"type":"heartbeat","status":"reviewing"}
```

## Finding Disposition

| Finding | Verdict | Disposition |
|---|---|---|
| `buildOperatorAttentionSection` maps `operatorAttention.rows` without a fallback. | `repaired` | `src/cockpit/browser-shell.ts` now treats missing rows as an empty list before rendering. |
| `buildOperatorInboxSection` maps `operatorInbox.messages` without a fallback. | `repaired` | `src/cockpit/browser-shell.ts` now treats missing messages as an empty list before rendering. |
| `responsive` metadata is computed twice for top-level and layout contracts. | `partially_repaired` | `src/cockpit/browser-shell.ts` now computes responsive metadata once and reuses it for both fields. The top-level field is retained because existing shell consumers and tests still require it. |

## Findings

CodeRabbit did not return a terminal review. The partial finding events are
resolved by local repair evidence; this artifact is accepted only as
provider-timeout/bootstrap-gap replacement evidence for the CodeRabbit Stage 4
gate.
