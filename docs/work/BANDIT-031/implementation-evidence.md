# BANDIT-031 Implementation Evidence

## Status

`pass`

Stage 3 adds the narrow read-only Workflow Cockpit status foundation. The
implementation exposes `bandit cockpit status --json`, derives a
non-canonical status payload from repo-native artifacts, includes source paths
for displayed workflow state, and fails closed for missing or contradictory
source evidence without introducing UI, server mode, SQLite, scheduler,
worktree, claim, deploy, UAT, actor identity, PR/CI, or hidden cockpit state.

## Implementation Summary

- Added `src/state/cockpit-status.ts` to reconcile `CURRENT_CONTEXT.md`,
  `ROADMAP.md`, the active work-item brief, RED/implementation evidence,
  bootstrap gaps, improvement candidates, and coordination log state into a
  derived status payload.
- Added fail-closed checks for missing current context, current-context versus
  roadmap next-action disagreement, malformed active-work evidence, malformed
  bootstrap-gap JSON, and malformed coordination-log JSON.
- Repaired Stage 4 reviewer findings by replacing the hardcoded improvement
  candidate source with dynamic discovery across
  `docs/work/*/*-finding-disposition.md` artifacts while preserving source
  paths in the derived cockpit payload.
- Added `src/commands/cockpit.ts` and routed `bandit cockpit status --json`
  through `src/cli.ts`.
- Kept cockpit output explicitly rebuildable and non-canonical; the command
  reads repo artifacts only and does not write `.bandit` cockpit caches,
  SQLite indexes, generated status artifacts, or lifecycle events.

## Verification

- `node --test test/cockpit-status.test.mjs`
- `npm test`
- `npm run typecheck`
- `npm run bandit -- validate`
- `npm run bandit -- cockpit status --json`
- `git diff --check`
- Stage 4 repair verification: `node --test test/cockpit-status.test.mjs`

## Clean-Code Self-Check

| Rubric | Verdict | Evidence |
| --- | --- | --- |
| Spec alignment | `pass` | The command implements the Stage 2 RED contract for read-only status derivation, source links, refusal paths, and hidden-authority prevention. |
| Small surface area | `pass` | The change is limited to the cockpit command route, a focused cockpit state reader, and this Stage 3 evidence/context update. |
| Simple design | `pass` | Parsing, reconciliation, source checks, and output rendering are separated between the command module and state module. |
| Explicit state | `pass` | Every reported workflow field carries an artifact path or derives from named repo-native sources. |
| No hidden authority | `pass` | The command creates no cockpit cache, index, status artifact, server memory, event mutation, or canonical state. |
| Testable behavior | `pass` | Focused RED tests now pass and cover normal derivation, missing-source refusal, disagreement refusal, closed-active contradiction, source-linked summaries, dynamic improvement-candidate source discovery, and no hidden writes. |
| Failure clarity | `pass` | Refusal messages name the missing or contradictory cockpit source artifact instead of inventing status. |

## Next Action

Run Stage 4 review gates for `BANDIT-031`, including pre-PR CodeRabbit review,
Local Qwen adversarial review, aggregate review evidence with
`review_subject_hash`, and PM disposition of any findings.
