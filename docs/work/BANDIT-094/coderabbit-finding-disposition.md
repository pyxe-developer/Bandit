# BANDIT-094 CodeRabbit Finding Disposition

work_item: BANDIT-094
stage: Stage 4 review
reviewer: coderabbit
timestamp: 2026-06-10T23:27:23Z
verdict: pass

## Provider Attempts

- Initial run: `timeout 600 coderabbit review --agent --type uncommitted`
  - Capture: `.bandit/tmp/BANDIT-094-coderabbit/output.jsonl`
  - Result: timeout exit `124`; emitted three trivial findings before timeout.
- Refresh after first repairs:
  - Capture: `.bandit/tmp/BANDIT-094-coderabbit-refresh/output.jsonl`
  - Result: timeout exit `124`; emitted two trivial findings and one
    contradictory critical policy-path finding before timeout.
- Final refresh after second repairs:
  - Capture: `.bandit/tmp/BANDIT-094-coderabbit-final/output.jsonl`
  - Result: timeout exit `124`; emitted one minor, one major, and one critical
    finding before timeout.
- Post-repair refresh:
  - Capture: `.bandit/tmp/BANDIT-094-coderabbit-postrepair/output.jsonl`
  - Result: timeout exit `124`; emitted only review context/setup/analyzing
    events before timeout and no current findings payload.

## Repaired Findings

| Finding | Disposition | Evidence |
| --- | --- | --- |
| `CreateControllerCommandResult.code` should be mandatory. | repaired | `src/commands/work-create-controller.ts` now declares `code: number`; focused tests and typecheck pass. |
| Remove operator-specific `/Users/matthewflebbe/seekwins` from committed policy. | repaired | `.bandit/policy/orchestrator-prompts.json` and the default Repo PM prompt contract now keep generic `SeekWins`, `WI-00`, and `Ollama` source markers only. |
| Markdown context scan should account for markdown code constructs. | repaired | `src/state/orchestrator-prompts.ts` now skips fenced/inline code and uses markdown block boundaries for headers, lists, and tables. |
| `isInsideCodeFence` should allow indented fences and language identifiers. | repaired | `src/state/orchestrator-prompts.ts` now scans `^\\s*```.*$` fence lines and counts fence positions before the token index. |
| Source-spec title matching should not use substring matching. | repaired | `src/state/work-create-controller.ts` now compares normalized title equality and uses PRD fallback matching only after source text normalization. |
| Dead ternary in target descriptor. | repaired | `src/state/work-create-controller.ts` no longer includes the redundant `${prdSubId ? "" : ""}` expression. |
| `isCoordinationLogFormationApproved` should use latest transition state. | repaired | `src/state/work-create-controller.ts` now scans all step transitions, tracks the highest sequence, and returns true only when the latest state is `formation_approved`. |
| `isOperatorInputNoneRequired` should avoid substring fail-open. | repaired | `src/state/work-create-controller.ts` now accepts only whole-status or full-line `none_required` / `none required` values after normalization. |

## Rejected Finding

| Finding | Disposition | Rationale |
| --- | --- | --- |
| Re-add `/Users/matthewflebbe/seekwins` to committed `forbidden_foreign_sources`. | rejected_false_positive | This directly contradicts the earlier portability finding and would bake an operator-specific absolute path into committed policy. The generic `SeekWins` marker still detects the current leakage fixture and keeps the policy cross-operator. |

## Verification

- `node --test test/orchestrator-prompts.test.mjs test/work-create-controller.test.mjs`
  - Result: pass, 9/9.
- `npm run typecheck`
  - Result: pass.
- `git diff --check`
  - Result: pass.

## PM Disposition

All actionable CodeRabbit findings emitted before timeout were either repaired
or explicitly rejected with concrete rationale. The current post-repair
CodeRabbit attempt timed out before emitting findings, so no CodeRabbit pass is
claimed. Stage 4 may proceed only with CodeRabbit provider-timeout
`bootstrap_gap` evidence plus this finding disposition.
