# BANDIT-049 Implementation Evidence

## Status

`pass` for Stage 3: Implementation Clean-Code Rubric.

All 9 focused tests pass. TypeScript compiles cleanly. Bandit validation passes.
The `bandit session-context current --json` command now recovers the
closed-work/no-active-gap interstitial state and emits a well-formed
`focused_session_context_packet` with `authority: "derived_non_canonical"`.

## Test Command

```sh
node --test test/focused-session-context.test.mjs
```

## Observed Output (GREEN)

```text
tests 9
pass 9
fail 0
```

Prior RED state (Stage 2): 9 tests, 6 pass, 3 fail.

## Writer Identity And Model-Family Separation

- Writer: `claude_process_adapter`
- Model family: `claude`
- Stage 2 RED evidence was authored by Codex PM / Test Writer (Codex model
  family). Stage 3 implementation was therefore assigned to Claude through the
  bootstrap Process Adapter path, satisfying Bootstrap Model-Family Separation.
- The Stage 3 Writer made zero edits to test-owned surfaces.

## Files Changed By The Writer

1. `src/state/focused-session-context.ts` — primary implementation
2. `src/commands/session-context.ts` — null-safety fix for markdown rendering

## Interstitial Detection Logic

`isInterstitialState(currentContext)` reads the raw CURRENT_CONTEXT.md content
and matches the `**Active work item:**` label. If the value normalizes to
`"none"` or `"none."`, the function returns `true`. This check executes before
`requireActiveWorkItem`, so the interstitial recovery path takes priority over
the error that previously blocked the command.

## Interstitial Packet Fields And Sources

| Field | Source |
| --- | --- |
| `kind` | Hard-coded `"focused_session_context_packet"` |
| `authority` | Hard-coded `"derived_non_canonical"` |
| `active_work_item` | `null` — interstitial state has no runnable active work |
| `active_bootstrap_gap` | `null` — interstitial state has no linked active gap |
| `last_closed_work_item.id` | `linked_work_item` from the last resolved gap in `.bandit/bootstrap-gaps.json` |
| `last_closed_work_item.status` | `"closed"` |
| `last_closed_work_item.source` | Gap's `verification_target` if present, else `docs/work/{id}/retrospective.md` |
| `next_queued_bootstrap_gap.id` | First gap with `status !== "resolved"` and `linked_work_item === null` |
| `next_queued_bootstrap_gap.title` | Gap `title` field |
| `next_queued_bootstrap_gap.status` | Gap `status` field |
| `next_queued_bootstrap_gap.disposition` | Gap `disposition` field |
| `next_queued_bootstrap_gap.source_artifacts` | Gap `source_artifacts` field |
| `exact_next_action` | `CURRENT_CONTEXT.md` next-action text (verified against `ROADMAP.md`) |
| `required_operator_input` | `"none_required"` when source artifacts agree no operator input is needed |
| `forbidden_actions` | Extracted from CURRENT_CONTEXT.md forbidden-actions section |
| `allowed_actions` | Derived from CURRENT_CONTEXT.md allowed-actions section |
| `blockers` | Derived from CURRENT_CONTEXT.md blockers section |
| `source_artifacts` | AGENTS.md, CLEAN_CODE.md, CURRENT_CONTEXT.md, ROADMAP.md, STAGE_RUBRICS.md, .bandit/bootstrap-gaps.json |
| `source_hierarchy` | `buildSourceHierarchy()` — same named helper as active-work path |
| `required_evidence_paths` | `buildRequiredEvidencePaths(nextWorkItemId)` — Stage 1–6 paths under `docs/work/BANDIT-049/` for the current interstitial recovery target |
| `deep_read_pointers` | `buildDeepReadPointers()` — same named helper as active-work path |

## How CURRENT_CONTEXT.md And ROADMAP.md Agreement Is Checked

The existing `nextActionsAgree` function was updated to accept
`workItemId: string | null`. When `null` (interstitial), only the
text-normalization equality and substring checks are applied. The work-item-ID
and stage-number checks are skipped because no active work item ID exists in the
interstitial state. If the two sources disagree on next action text, the
function returns `false` and the command fails closed with:

```text
Session context blocked: CURRENT_CONTEXT.md and ROADMAP.md disagree on next action
```

This satisfies the interstitial disagreement subtest that was RED in Stage 2.

## How `last_closed_work_item` Is Populated

`findLastResolvedGapWithLinkedItem(gaps)` scans the raw gap list from the end
(most recent first) and returns the first gap where `status === "resolved"` and
`linked_work_item` is non-null. For the current repo state, this correctly
identifies BANDIT-048 via `BANDIT-GAP-FOCUSED-SESSION-CONTEXT`, whose
`verification_target` is `docs/work/BANDIT-048/retrospective.md`. If no
resolved linked gap exists, the command fails closed.

## How `next_queued_bootstrap_gap` Is Populated

`findNextQueuedGap(gaps)` finds the first gap (in list order) where
`status !== "resolved"` and `linked_work_item === null`. The `RawGap` type was
extended to include optional `verification_target` and `source_artifacts`
fields; `parseBootstrapGapsRaw` now parses them using a new
`optionalGapStringList` helper. The gap's `id`, `title`, `status`,
`disposition`, and `source_artifacts` are included directly in the packet. If
no such gap exists, the command fails closed.

## How Required Evidence Paths Are Computed

`deriveNextWorkItemId(lastClosedId)` increments the numeric suffix of the last
closed work item ID. In the current interstitial fixture, `BANDIT-048` derives
the expected next work item `BANDIT-049`. `buildRequiredEvidencePaths(nextWorkItemId)`
produces the standard Stage 1–6 paths under `docs/work/{nextWorkItemId}/`
without requiring that work item to exist.

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| `bandit session-context current --json` recovers the closed-work/no-active-gap interstitial state | 9/9 focused tests pass. `session-context current --json` emits `kind: "focused_session_context_packet"` with `active_work_item: null` and `active_bootstrap_gap: null` |
| Packet distinguishes last closed work item from active work item | `last_closed_work_item.id: "BANDIT-048"` present; `active_work_item: null`; closed work is not reported as runnable |
| Packet reports next queued bootstrap gap, exact next action, and `none_required` operator-input status | `next_queued_bootstrap_gap.id: "BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY"`, `exact_next_action` from CURRENT_CONTEXT.md, `required_operator_input: "none_required"` |
| Packet reports forbidden actions | `forbidden_actions` list includes Worktree Bootstrap Contract work and unrelated Phase 8 work |
| Packet source artifacts and source hierarchy identify required authority sources | `source_hierarchy` and `source_artifacts` include AGENTS.md, CLEAN_CODE.md, CURRENT_CONTEXT.md, ROADMAP.md, STAGE_RUBRICS.md, .bandit/bootstrap-gaps.json |
| Required evidence paths point at future work item Stage 1–6 evidence | `required_evidence_paths` includes `docs/work/BANDIT-049/brief.md`, `docs/work/BANDIT-049/red-evidence.md`, `docs/work/BANDIT-049/retrospective.md` |
| Missing or contradictory artifacts fail closed | Interstitial disagreement subtest passes: ROADMAP.md disagreement produces `"CURRENT_CONTEXT.md and ROADMAP.md disagree on next action"` |
| Cold-start evaluation packet covers interstitial recovery path | Focused tests cover the path; cold-start evaluation packet test continues to pass |
| Bootstrap Model-Family Separation | Stage 2 RED tests: Codex (Test Writer). Stage 3 implementation: Claude (Process Adapter). |
| Test Ownership Boundary | Stage 3 Writer edited zero test-owned surfaces |
| No out-of-scope surfaces introduced | No Worktree Bootstrap Contract, scheduler, cockpit UI/server/API, state-index, auto-merge/push/deploy, claim leases, work surface reservations, paid reviewer routing, external services, dependency/lockfile changes, or Phase 8 work |

## Verification Commands And Results

| Command | Result |
| --- | --- |
| `node --test test/focused-session-context.test.mjs` | PASS — 9/9 |
| `npm run typecheck` | PASS — clean |
| `npm run bandit -- validate` | PASS — `Bandit state is valid.` |
| `npm run bandit -- gaps list` | PASS — full gap list; `BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY` listed as `active | active_chore` |
| `node ./bin/bandit.mjs cockpit status --json` | PASS — `kind: "workflow_cockpit_status"`, `active_work_item.id: "BANDIT-049"`, `next_action.agreement.status: "pass"` |
| `node ./bin/bandit.mjs session-context current --json` | PASS — `kind: "focused_session_context_packet"`, `authority: "derived_non_canonical"`, `stale_or_missing_evidence: []` |
| `git diff --check` | PASS — no whitespace errors |

## Clean-Code Self-Check

CLEAN_CODE.md was read at Stage 1 as required by the brief.

- Each helper has a single named responsibility.
- Shared logic was extracted into named helpers used by both the active-work and
  interstitial paths, eliminating duplication.
- No flag arguments hide distinct behavior; `workItemId: string | null` signals
  interstitial vs. active by type.
- Fail-closed behavior is preserved for missing resolved gaps, missing queued
  gaps, and source disagreement.
- No hidden state, cache, or state-index file is written.
- `npm run typecheck` exits cleanly.
- Diff is limited to the two editable production paths; no unrelated refactors.
