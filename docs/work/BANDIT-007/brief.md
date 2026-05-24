# BANDIT-007: CodeRabbit State Capture

## Status

Brief and RED test file created on 2026-05-24. RED evidence is recorded in
`docs/work/BANDIT-007/red-evidence.md`. Production implementation has not
started.

## Goal

Create the first repo-native CodeRabbit state capture gate so Bandit can tell
the difference between a current CodeRabbit pass, a stale or blocked
CodeRabbit state, and an accepted bootstrap gap before a work item is marked
safe to land.

This slice reduces the `coderabbit_state: bootstrap_gap` left by `BANDIT-005`
and `BANDIT-006` without broadening into final CodeRabbit polling, GitHub API
automation, automated repair, UAT, final Landing Agent behavior, or Workflow
Cockpit work.

## Scope

- Define a repo-native CodeRabbit review evidence artifact contract for
  `docs/work/<ID>/coderabbit-review.md`.
- Add `docs/templates/coderabbit-review.md` with required fields for work item,
  source head, provider, review target, review state, CodeRabbit verdict,
  findings status/disposition, operator-input status, source-drift status,
  executable evidence, and bootstrap gaps.
- Add validation for any present CodeRabbit review evidence artifact. It must
  fail closed when required fields are missing, the work item is wrong,
  unsupported values are used, unresolved operator-owned input is hidden, a pass
  lacks executable evidence, or unavailable review is treated as a pass.
- Add a narrow CLI command, tentatively
  `bandit coderabbit-review <work-item-id>`, that can report or capture
  CodeRabbit state for one work item and fail closed for missing or unknown work
  items.
- Keep automated tests deterministic. Fixture CodeRabbit state may be used; no
  test may require live CodeRabbit service access, GitHub authentication,
  network access, paid API keys, or operator approval.
- Extend `land-check` only as much as needed to require current
  `coderabbit-review.md` evidence when aggregate review or landing evidence
  claims `coderabbit_state: pass`.
- Preserve the existing bootstrap allowance for `coderabbit_state:
  bootstrap_gap` only when replacement evidence is explicit.
- Create implementation evidence, CodeRabbit review evidence, review evidence,
  landing verdict, landing action, retrospective, and context updates during
  later stages of this slice.

## Out Of Scope

- Live CodeRabbit API, GitHub API, or PR comment polling.
- CodeRabbit comment repair, autofix, or rerun orchestration.
- CodeRabbit GitHub App setup or credential management.
- Paid-model reviewer routing or cost/risk overrides.
- Local Qwen review runtime tuning.
- Escalated reviewer implementation.
- Final Landing Agent implementation.
- CLI-owned UAT approval artifacts or stale UAT refresh workflow.
- PR merge automation, branch landing automation, or auto-landing.
- Workflow Cockpit UI.
- SQLite indexing or any cache/index as canonical reviewer state.
- Retrofitting historical work items to require CodeRabbit artifacts.
- Treating terminal scrollback, chat, dashboard state, or CodeRabbit aggregate
  badges as canonical landing evidence.

## Acceptance Criteria

1. The repository contains `docs/templates/coderabbit-review.md` with required
   metadata for CodeRabbit review evidence.
2. `bandit validate` fails closed when the CodeRabbit review template is
   missing or malformed.
3. A CodeRabbit review evidence artifact contract exists for
   `docs/work/<ID>/coderabbit-review.md`.
4. `bandit validate` validates any present CodeRabbit review evidence artifact
   and fails closed when `work_item` does not match the containing work item.
5. CodeRabbit review evidence supports only the shared verdict values for
   `coderabbit_verdict`: `pass`, `blocker`, `non_blocking`, `not_applicable`,
   and `bootstrap_gap`.
6. CodeRabbit review evidence fails closed when `operator_input_status`
   records unresolved operator-owned input.
7. CodeRabbit review evidence fails closed when `coderabbit_verdict: pass`
   lacks executable evidence identifying how the state was captured.
8. CodeRabbit review evidence fails closed when unavailable or bootstrap-gap
   review state lacks explicit bootstrap-gap evidence.
9. The CLI exposes `bandit coderabbit-review <work-item-id>` or a narrower
   equivalent command name chosen during GREEN implementation.
10. The CodeRabbit command reports a clear usage error when the work item ID is
    omitted.
11. The CodeRabbit command fails closed when the work item does not exist.
12. The CodeRabbit command does not require live CodeRabbit, GitHub, network,
    or paid credentials for automated tests.
13. `land-check` fails closed when aggregate review or landing evidence claims
    `coderabbit_state: pass` but current CodeRabbit review evidence is missing.
14. `land-check` reports the current CodeRabbit evidence artifact and provider
    when CodeRabbit evidence is current and passing.
15. `land-check` fails closed when CodeRabbit review evidence is stale, blocked,
    inconclusive, unavailable without bootstrap-gap evidence, malformed, or
    points at the wrong work item.
16. Existing historical work items remain compatible unless they opt into the
    new CodeRabbit review contract.
17. The implementation keeps the surface small: one template, one evidence
    parser/writer, one narrow command, small `validate` and `land-check`
    integration, focused tests, and required evidence/context updates.
18. `node --test test/coderabbit-state.test.mjs`, `npm test`,
    `npm run typecheck`, `npm run bandit -- validate`,
    `npm run bandit -- land-check BANDIT-007`, and `git diff --check` pass
    before landing, with any live CodeRabbit unavailability recorded as a
    bootstrap gap rather than a pass.

## Test Plan

- Start with RED evidence before production implementation.
- Add focused tests in `test/coderabbit-state.test.mjs` using temp repos and
  fixture CodeRabbit artifacts.
- Cover template validation:
  - missing `docs/templates/coderabbit-review.md` fails validation;
  - malformed template fields fail validation after template wiring exists.
- Cover CodeRabbit evidence validation:
  - wrong work item fails;
  - unsupported verdict fails;
  - unresolved operator input fails;
  - pass without executable evidence fails;
  - unavailable or bootstrap-gap review state requires bootstrap-gap evidence.
- Cover command behavior:
  - omitted work item ID exits nonzero with usage;
  - unknown work item exits nonzero;
  - fixture or artifact-backed pass records or reports repo-native evidence
    without live CodeRabbit dependency.
- Cover `land-check` integration:
  - CodeRabbit pass requires current `coderabbit-review.md`;
  - current CodeRabbit pass is reported with evidence artifact and provider;
  - stale CodeRabbit evidence blocks landing;
  - existing bootstrap-gap behavior remains available only with replacement
    evidence.
- Keep assertions on behavior, refusal messages, source-of-truth boundaries,
  and stable metadata rather than incidental Markdown formatting.

## CLEAN_CODE.md Read Evidence

- Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating this slice brief.
- The spec and acceptance criteria make clean-code compliance evaluable through
  small surface area, explicit CodeRabbit state, no hidden authority, readable
  parser/command boundaries, failure clarity, locality, testable behavior, and
  preserved role boundaries.

## Clean-Code Landing Rubric

Before landing, Codex PM must evaluate:

| Rubric Item | Required Evidence |
|---|---|
| Spec alignment | Implementation maps directly to this brief's acceptance criteria without redefining CodeRabbit, UAT, landing, or escalation policy. |
| Small surface area | Diff contains only the CodeRabbit evidence contract, one narrow command, validation, `land-check` integration, focused tests, evidence, and required context updates. |
| Simple design | Uses repo-native artifacts and direct validation; no database, generated schema framework, broad policy engine, review repair loop, or cockpit authority. |
| Explicit state | CodeRabbit source head, provider, review state, verdict, findings disposition, bootstrap gaps, and PM dispositions live in named repo artifacts. |
| No hidden authority | CLI checks read repo artifacts and Git head; chat, terminal scrollback, dashboards, badges, or caches do not own review readiness. |
| Testable behavior | Template parsing, evidence parsing, command refusal paths, stale evidence, and `land-check` integration are covered by tests or explicit bootstrap gaps. |
| Readable flow | Template validation, evidence parsing, command behavior, and landing consumption have clear boundaries. |
| Locality | CodeRabbit behavior stays near review-state helpers and the narrow command; unrelated refactors are excluded. |
| Failure clarity | Missing, malformed, unavailable, stale, blocked, unresolved, or inconclusive evidence fails closed with clear messages. |
| No role erosion | CodeRabbit evidence cannot become Writer, Landing Agent, UAT approver, or hidden product decision maker. |
| Improvement capture | Any material workflow lesson becomes a tagged improvement chore, smell catalog update, cross-model tension entry, or explicit no-action decision. |

## Stage-Rubric Checklist

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identified Phase 4 and the next action as `BANDIT-007` CodeRabbit state capture. `docs/work/BANDIT-006/landing-action.md` records final implementation source head `61279b0ffc9bade9e4eda1ee0b59e1874283a01b` before this slice became active. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, test plan, clean-code evidence, bootstrap gaps, expected files, implementation order, smell triggers, escalation plan, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pass` | `docs/work/BANDIT-007/red-evidence.md` records nine focused RED tests, accepted failures before implementation, acceptance-criteria mapping, and Test Writer-owned assertions. |
| Stage 3: Implementation Clean-Code Rubric | `not_applicable` | No production implementation code in this step. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | Live CodeRabbit automation, escalated reviewers, and final Landing Agent behavior remain unavailable. This slice is scoped to reduce the CodeRabbit evidence bootstrap gap. |
| Stage 5: Landing And UAT | `bootstrap_gap` | Landing Agent and CLI-owned UAT artifacts do not exist yet; UAT is not applicable to this workflow-infrastructure slice. |
| Stage 6: Retrospective And Improvement Capture | `not_applicable` | Required after the implementation slice completes. |

## Bootstrap Gaps

- No repo-native CodeRabbit review evidence template exists yet.
- No CodeRabbit review evidence parser or validator exists yet.
- No Bandit CLI command can capture or report CodeRabbit state yet.
- `land-check` currently accepts `coderabbit_state: pass` without requiring a
  current CodeRabbit evidence artifact.
- Live CodeRabbit API/CLI polling is not implemented and must remain a
  recorded bootstrap gap if unavailable.
- Escalated adversarial review gate is not implemented yet.
- Landing Agent is not implemented yet.
- CLI-owned UAT artifact is not implemented yet.
- Heartbeat chore-agent is not implemented yet.
- Workflow Cockpit is not implemented yet.

These are accepted bootstrap gaps for this work item only if replacement manual
evidence is recorded honestly and the final verdict does not collapse missing
review into a pass.

## Routing Decision

decision_kind: reviewer
selected_route: coderabbit-state-capture
applicable_smell_ids:
  - BANDIT-SMELL-CODERABBIT-WAIVER
  - BANDIT-SMELL-EVIDENCE-FRESHNESS
  - BANDIT-SMELL-PARSER-VALIDATOR
  - BANDIT-SMELL-MISSING-COVERAGE
  - BANDIT-SMELL-MALFORMED-EVIDENCE
  - BANDIT-SMELL-POLICY-DRIFT
  - BANDIT-SMELL-UNAVAILABLE-AGENT
evidence_used:
  - AGENTS.md requires CodeRabbit to be requested/read through CLI automation before PR landing.
  - CONTEXT.md defines CodeRabbit Pre-Landing Loop, Landing Verdict, Manager-Owned Routing, and repo-native workflow state.
  - ROADMAP.md identifies Phase 4 CodeRabbit state capture as the next remaining review-gate gap.
  - docs/work/BANDIT-005/review-evidence.md and docs/work/BANDIT-006/review-evidence.md both record CodeRabbit as an explicit bootstrap gap.
operator_input_status: none_required
bootstrap_gaps:
  - Live CodeRabbit automation does not exist yet.
  - Final escalated reviewer and Landing Agent gates remain unavailable.
escalation_outcome: Implement the CodeRabbit evidence artifact and fail-closed landing integration first; do not ask the operator for routine reviewer routing.
final_decision: Proceed with TDD for repo-native CodeRabbit evidence, a narrow command surface, validation, and `land-check` integration without live CodeRabbit or GitHub dependencies in automated tests.

## Required Operator Input

None before implementation starts.

Repo artifacts already define the product direction for this slice: Phase 4
must make safe landing evidence-driven, CodeRabbit state is a required
pre-landing gate, and Codex PM owns routine review-routing decisions.

## Expected Files

Likely implementation files:

- `docs/templates/coderabbit-review.md`
- `src/commands/coderabbit-review.ts`
- `src/commands/land-check.ts`
- `src/commands/validate.ts`
- `src/cli.ts`
- `src/state/coderabbit-review.ts`
- `src/state/templates.ts`
- focused tests under `test/coderabbit-state.test.mjs`

Likely evidence files:

- `docs/work/BANDIT-007/red-evidence.md`
- `docs/work/BANDIT-007/implementation-evidence.md`
- `docs/work/BANDIT-007/coderabbit-review.md`
- `docs/work/BANDIT-007/review-evidence.md`
- `docs/work/BANDIT-007/landing-verdict.md`
- `docs/work/BANDIT-007/landing-action.md`
- `docs/work/BANDIT-007/retrospective.md`

Context files expected to change:

- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`

The final implementation may adjust file names only if tests and local
structure prove a simpler pattern while preserving this brief's acceptance
criteria and source-of-truth boundaries.

## First Implementation Order

1. Preserve `test/coderabbit-state.test.mjs` as the RED contract.
2. Add `docs/templates/coderabbit-review.md` and template validation.
3. Add CodeRabbit review evidence parsing and validation.
4. Wire `bandit validate` to validate any present CodeRabbit review evidence.
5. Add the narrow `bandit coderabbit-review <work-item-id>` command surface.
6. Wire `land-check` to consume current `coderabbit-review.md` evidence when
   `coderabbit_state: pass` is recorded.
7. Run `node --test test/coderabbit-state.test.mjs` until it passes, then run
   full verification.
8. Produce implementation evidence, CodeRabbit review evidence, clean-code
   check, review evidence, landing verdict, retrospective, landing action
   evidence, and context updates before landing.

## Smell Triggers

- `BANDIT-SMELL-CODERABBIT-WAIVER`: blocker if CodeRabbit request-changes,
  unresolved actionable findings, stale state, or waiver posture is accepted
  without PM disposition.
- `BANDIT-SMELL-EVIDENCE-FRESHNESS`: blocker if stale CodeRabbit evidence can
  satisfy landing.
- `BANDIT-SMELL-PARSER-VALIDATOR`: blocker if artifact parsing or validation
  changes lack focused tests.
- `BANDIT-SMELL-MISSING-COVERAGE`: blocker if command, validation, stale
  evidence, or `land-check` refusal paths lack tests or explicit bootstrap
  gaps.
- `BANDIT-SMELL-MALFORMED-EVIDENCE`: blocker if malformed CodeRabbit evidence
  is ignored.
- `BANDIT-SMELL-POLICY-DRIFT`: blocker if the implementation diverges from
  AGENTS.md, CONTEXT.md, CLEAN_CODE.md, or stage rubrics.
- `BANDIT-SMELL-UNAVAILABLE-AGENT`: bootstrap gap for live CodeRabbit,
  escalated reviewers, and Landing Agent behavior until those gates exist.

## Operator Input Status

No operator-owned input is missing for this step. If implementation later needs
live service credentials, policy changes, UAT, business tradeoffs, or explicit
cost/risk overrides, Codex PM must stop and ask directly rather than guessing.
