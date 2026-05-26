# BANDIT-033 Implementation Evidence

## Summary

Stage 3 implementation is recorded for Attention-First Cockpit Visual Shell.
The implementation adds a shallow presentation boundary over the existing
read-only cockpit status substrate without giving the UI canonical workflow
authority.

## Changes

- `src/state/cockpit-actions.ts` derives guarded action affordances for approved
  CLI-backed requests: validation, evidence inspection, review gate, landing
  readiness, and UAT recording.
- `src/state/cockpit-view-model.ts` maps derived cockpit status into an
  attention-first view model with operator-first category ordering, source
  confidence cues, gate-strip state, evidence drill-down sources, and explicit
  no-hidden-authority fields.
- `src/cockpit/render.ts` renders the first auditable cockpit shell contract
  from presentation data, including landmarks, attention navigation, guarded
  controls, keyboard order, responsive layout constraints, and evidence
  drill-down data.
- `src/state/cockpit-status.ts` now exports cockpit status types for the
  presentation boundary.

No local server/API mode, state-index persistence, scheduler execution,
worktree lifecycle, claim lease, work surface reservation, automatic
merge/push/deploy behavior, product UAT approval, actor identity policy,
PR/CI workflow, external service setup, policy change, business tradeoff,
cost/risk override, or unrelated feature behavior was introduced.

## Acceptance Criteria Mapping

| Acceptance criterion | Implementation evidence |
| --- | --- |
| First UI surface prioritizes operator-owned input, blocked or stale state, active work, landing readiness, improvement health, and queue/context. | `buildCockpitViewModel` emits the accepted Attention Category order and `renderCockpitShell` exposes matching navigation and primary attention state. |
| Presentation data is derived from typed view-model fixtures or CLI-derived status output. | The new modules consume `CockpitStatus`-shaped data and do not read repo files or mutate artifacts directly. |
| Every displayed workflow status includes a source, confidence cue, or fail-closed missing/blocked/stale state. | Gate strip, primary attention, status cues, links, and evidence drill-down include source paths or confidence state. |
| Guarded actions expose only approved CLI-backed requests and disabled reasons. | `deriveCockpitActionAffordances` emits only `bandit validate`, `bandit show`, `bandit qwen-review`, `bandit land-check`, and `bandit uat` families with enabled state and reasons. |
| Implementation separates view-model mapping, action eligibility, evidence normalization, and rendering. | Action derivation, view-model mapping, and shell rendering live in separate modules with no repo parsing in the render layer. |
| Tests cover priority, active work, blocked/stale display, landing readiness, improvement health, evidence drill-down, disabled reasons, responsive constraints, and no canonical browser/UI state. | Focused cockpit view-model and UI tests now pass. |
| Product UAT remains CLI-owned before landing if the delivered UI is operator-facing. | The presentation layer keeps UAT disabled with an explicit CLI Authority reason and does not approve UAT. |

## Clean-Code Self-Check

| Rubric | Verdict | Evidence |
| --- | --- | --- |
| Spec alignment | `pass` | The implementation targets only the Stage 2 RED presentation-boundary contract. |
| Small surface area | `pass` | The diff adds three focused presentation modules and exports existing status types. |
| Simple design | `pass` | Mapping, action eligibility, and rendering are separated and deterministic. |
| Explicit state | `pass` | The view model names its non-canonical authority, source links, disabled reasons, and prohibited authority surfaces. |
| No hidden authority | `pass` | The modules do not write repo artifacts, approve UAT, decide landing safety, create caches, or own workflow state. |
| Testable behavior | `pass` | Focused and full repository tests pass. |
| Failure clarity | `pass` | Missing gates remain visible as missing or blocked confidence cues rather than unexplained green state. |
| Role boundaries | `pass` | CLI Authority remains outside the visual component layer; guarded controls are requests, not direct workflow mutations. |

## Verification

| Command | Result |
| --- | --- |
| `node --test test/cockpit-view-model.test.mjs test/cockpit-ui.test.mjs` | pass: 8 tests |
| `npm test` | pass: 251 tests |
| `npm run typecheck` | pass |
| `npm run bandit -- cockpit status --json` | pass before context advance; derived status reported `BANDIT-033`, Stage 2 pass, Stage 3 missing, no blockers, and no bootstrap gaps |

## Stage-Rubric Evaluation

| Stage | Verdict | Rationale |
| --- | --- | --- |
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identified `BANDIT-033` as active and ready for Stage 3 implementation before code changes. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-033/brief.md` records scope, acceptance criteria, verification plan, clean-code evidence, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pass` | `docs/work/BANDIT-033/red-evidence.md` records focused failing tests before production presentation modules existed. |
| Stage 3: Implementation Clean-Code Rubric | `pass` | Focused/full tests and typecheck pass; the implementation is presentation-only, source-linked, and non-canonical. |

## Next Action

Run Stage 4 review and cross-model gates for `BANDIT-033`: pre-PR CodeRabbit
review when available, Local Qwen adversarial review, review-subject hash,
Codex PM disposition, and aggregate review evidence. Do not start landing,
product UAT, or retrospective closeout before current Stage 4 review evidence
exists.
