# BANDIT-005: Pre-Landing Review Loop

## Status

Brief created. RED evidence, GREEN implementation evidence, review evidence,
and a safe-to-land landing verdict have been created. Retrospective and landing
action remain pending.

## Goal

Create the first Phase 4 pre-landing review loop substrate so Bandit can
record review evidence, detect stale source or review evidence, and refuse a
`safe-to-land` verdict when required review gates are missing, stale, or only
implied by prose.

This slice should convert the current manual bootstrap landing discipline into
repo-native artifact contracts and a narrow CLI check. It must keep CLI
authority, preserve explicit bootstrap gaps for unavailable external gates, and
avoid building the final Landing Agent, UAT system, or Workflow Cockpit early.

## Scope

- Define a pre-landing review evidence artifact contract for
  `docs/work/<ID>/review-evidence.md`.
- Define a landing verdict artifact contract for
  `docs/work/<ID>/landing-verdict.md`.
- Add templates for the review evidence and landing verdict contracts.
- Add parser and validator helpers for new-contract review evidence and landing
  verdict artifacts.
- Add stale source or review evidence checks using recorded source head values
  and the current repository head when available.
- Add a narrow CLI command, `bandit land-check <work-item-id>`, that reads the
  recorded review evidence and landing verdict for a work item and reports the
  landing gate state.
- Make `bandit land-check <work-item-id>` fail closed when required evidence is
  missing, malformed, stale, unresolved, or incompatible with a `safe-to-land`
  verdict.
- Record CodeRabbit, local Qwen, and escalated reviewer states as explicit gate
  fields that can be `pass`, `blocker`, `non_blocking`, `not_applicable`, or
  `bootstrap_gap` with replacement evidence.
- Require the landing verdict to distinguish `safe-to-land`, `needs-repair`,
  `blocked`, and `requires operator approval`.
- Preserve existing historical work items by avoiding a broad migration or a
  retroactive requirement that old manual artifacts match the new contract.
- Add focused tests for the artifact contracts, stale evidence behavior,
  bootstrap-gap handling, and land-check refusal paths.
- Create `BANDIT-005` review evidence, landing verdict, landing action, and
  retrospective evidence during later stages of this slice.

## Out Of Scope

- CodeRabbit CLI automation, polling, comment repair, or GitHub API access.
- Installing or running a local Qwen model.
- Running a stronger paid reviewer or implementing paid-model routing.
- Final Landing Agent implementation.
- PR merge automation or branch landing automation.
- CLI-owned UAT approval artifacts or stale UAT refresh workflow.
- Feature-slice UAT approval decisions.
- Workflow Cockpit UI.
- SQLite indexing.
- Automated review finding repair.
- Automated smell detection from diffs, PR text, or chat history.
- Retrofitting every historical `landing-verdict.md` or `review-evidence.md`
  file to the new contract.
- Treating a dashboard, cache, generated index, or hidden helper as canonical
  landing authority.

## Acceptance Criteria

1. The repository contains templates for pre-landing review evidence and landing
   verdict artifacts with required fields for work item ID, source head,
   test/verification state, CodeRabbit state, local Qwen state, escalated
   reviewer state, PM disposition, bootstrap gaps, UAT status, clean-code
   status, final verdict, and source-drift status.
2. New-contract review evidence can record CodeRabbit, local Qwen, and
   escalated reviewer outcomes using only the shared verdict values `pass`,
   `blocker`, `non_blocking`, `not_applicable`, and `bootstrap_gap`.
3. New-contract landing verdicts can record only `safe-to-land`,
   `needs-repair`, `blocked`, or `requires operator approval` as final landing
   decisions.
4. `bandit land-check <work-item-id>` reports the recorded review gate state,
   landing verdict, source head, current head when available, bootstrap gaps,
   UAT status, clean-code status, and final landing decision.
5. `bandit land-check <work-item-id>` reports a clear usage error when the work
   item ID is omitted.
6. `bandit land-check <work-item-id>` fails closed when the work item does not
   exist.
7. `bandit land-check <work-item-id>` fails closed when the work item lacks
   required new-contract review evidence or landing verdict evidence.
8. `bandit land-check <work-item-id>` fails closed when required review fields
   are missing, use unsupported values, hide unresolved operator input, or omit
   bootstrap-gap rationale for unavailable gates.
9. `bandit land-check <work-item-id>` fails closed when a `safe-to-land`
   verdict is claimed while tests, clean-code status, CodeRabbit state, local
   Qwen state, required escalated review state, or source-drift status is
   missing, stale, blocked, or unresolved.
10. `bandit land-check <work-item-id>` permits explicit `bootstrap_gap` for
    CodeRabbit, Qwen, escalated review, and Landing Agent gates during
    bootstrap only when replacement evidence and rationale are recorded.
11. Stale evidence checks compare recorded source or review head values to the
    current repository head when Git metadata is available, and fail closed for
    a `safe-to-land` verdict when evidence is stale.
12. If Git metadata is unavailable in a test fixture, the behavior is explicit
    and test-covered rather than silently treating evidence as current.
13. `bandit validate` continues to pass for existing historical work items and
    does not force old manual artifacts through the new contract unless the
    artifact opts into the new contract or this slice explicitly creates it.
14. The implementation keeps repo-native artifacts canonical and does not add
    hidden state, database authority, cockpit-owned state, or generated indexes.
15. Tests cover successful land-check output, missing argument, unknown work
    item, missing evidence, malformed verdict values, stale evidence,
    safe-to-land with missing gates, explicit bootstrap gaps, and historical
    artifact compatibility.
16. `npm test`, `npm run typecheck`, `npm run bandit -- validate`,
    `npm run bandit -- land-check BANDIT-005`, and `git diff --check` pass
    before landing.

## Test Plan

- Start with RED evidence before production implementation.
- Add focused tests, likely `test/landing-gates.test.mjs`, using temp repos
  through `test/helpers/bandit-cli.mjs`.
- Add helper support for Git-backed temp repos when testing source-drift checks.
- Cover template validation:
  - required pre-landing review template exists;
  - required landing verdict template exists;
  - missing templates fail validation only when the template is part of this
    slice's required contract.
- Cover review evidence validation:
  - valid review evidence with explicit bootstrap gaps passes;
  - missing CodeRabbit state fails;
  - missing Qwen state fails;
  - missing escalated review state fails when smell triggers require escalation;
  - unsupported verdict values fail;
  - bootstrap gaps without replacement evidence fail.
- Cover landing verdict validation:
  - valid `safe-to-land` verdict with current evidence passes;
  - `safe-to-land` with missing tests fails;
  - `safe-to-land` with stale source head fails;
  - `safe-to-land` with unresolved operator input fails;
  - unsupported landing decisions fail.
- Cover `bandit land-check` behavior:
  - prints work item, review gates, current/stale status, bootstrap gaps, UAT
    status, clean-code status, and final decision for valid evidence;
  - missing work item argument exits nonzero with usage;
  - unknown work item exits nonzero;
  - missing review evidence exits nonzero;
  - missing landing verdict exits nonzero;
  - malformed artifacts exit nonzero with clear messages.
- Keep assertions on behavior, refusal messages, source-of-truth boundaries, and
  stable fields rather than incidental Markdown formatting.
- Record RED evidence before adding implementation.
- Run `npm test`, `npm run typecheck`, `npm run bandit -- validate`,
  `npm run bandit -- land-check BANDIT-005`, and `git diff --check` before
  landing.

## CLEAN_CODE.md Read Evidence

- Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating this slice brief.
- The spec and acceptance criteria make clean-code compliance evaluable through
  small surface area, explicit state, no hidden authority, readable parser and
  command boundaries, failure clarity, locality, testable behavior, and
  preserved role boundaries.

## Clean-Code Landing Rubric

Before landing, Codex PM must evaluate:

| Rubric Item | Required Evidence |
|---|---|
| Spec alignment | Implementation maps directly to this brief's acceptance criteria without redefining landing, review, UAT, or bootstrap-gap policy. |
| Small surface area | Diff contains only review and landing artifact templates, parser/validator helpers, one narrow land-check command, tests, evidence, and required context updates. |
| Simple design | Uses small repo-native artifact contracts and direct validation; no database, generated schema framework, broad policy engine, reviewer automation, or cockpit authority. |
| Explicit state | Review gates, source heads, bootstrap gaps, PM dispositions, UAT status, clean-code status, and landing decisions live in named repo artifacts. |
| No hidden authority | CLI checks read repo artifacts and Git head; caches, UI, generated files, and unrecorded model choices do not own landing readiness. |
| Testable behavior | Gate parsing, stale evidence checks, safe-to-land refusal paths, bootstrap-gap handling, and command output are covered by tests or explicit bootstrap gaps. |
| Readable flow | Review evidence parsing, landing verdict parsing, source-drift checks, and command output have clear boundaries. |
| Locality | Landing-gate logic stays near validation and command helpers; unrelated refactors are excluded. |
| Failure clarity | Missing, stale, malformed, blocked, unavailable, or operator-owned inputs fail closed with clear messages. |
| No role erosion | Codex PM owns code-safety routing; operator-owned product direction, UAT approval, policy changes, business tradeoffs, and explicit cost/risk overrides remain surfaced rather than guessed. |
| Improvement capture | Any material workflow lesson becomes a tagged improvement chore, smell catalog update, cross-model tension entry, or explicit no-action decision. |

## Stage-Rubric Checklist

| Stage | Current Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify Phase 4 and the next action. `docs/work/BANDIT-004/landing-action.md` records landed commit `a0b679217c93c3aeda6646806201d181cd26404c` before this slice became active. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, test plan, clean-code evidence, bootstrap gaps, expected files, implementation order, smell triggers, escalation plan, and operator input status. |
| Stage 2: Test Design And RED Evidence | `pass` | `docs/work/BANDIT-005/red-evidence.md` records the initial 14 focused RED tests, accepted RED failures before implementation, acceptance-criteria mapping, and Test Writer-owned assertions. |
| Stage 3: Implementation Clean-Code Rubric | `pass` | `docs/work/BANDIT-005/implementation-evidence.md` records GREEN implementation scope, acceptance-criteria coverage, focused/full verification, and clean-code self-check. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | Final CodeRabbit, Qwen, escalated adversarial review, and Landing Agent gates are still unavailable during bootstrap; this slice exists to make those gaps explicit and checkable. |
| Stage 5: Landing And UAT | `not_applicable` | Landing has not started. UAT approval artifacts are Phase 5 and are not implemented in this slice. |
| Stage 6: Retrospective And Improvement Capture | `not_applicable` | Retrospective is required before landing but has not started. |

## Bootstrap Gaps

- CodeRabbit pre-landing loop is not automated yet; this slice records and
  validates CodeRabbit state or explicit `bootstrap_gap` evidence.
- Local Qwen adversarial gate is not implemented yet; this slice records and
  validates Qwen state or explicit `bootstrap_gap` evidence.
- Escalated adversarial review gate is not implemented yet; this slice records
  and validates escalated review state or explicit `bootstrap_gap` evidence when
  smell triggers require escalation.
- Landing Agent is not implemented yet; this slice adds a land-check command
  but does not implement agent-owned landing.
- CLI-owned UAT artifact is not implemented yet; feature-slice UAT approval
  remains Phase 5.
- CodeRabbit, Qwen, and paid reviewer credentials or runtimes are not assumed.
- Heartbeat chore-agent is not implemented yet.
- Workflow Cockpit is not implemented yet.

These are accepted bootstrap gaps for this work item only if replacement manual
evidence is recorded honestly and the final verdict does not collapse missing
gates into a pass.

## Required Operator Input

None before RED evidence or implementation starts.

Repo artifacts already define the product direction for this slice: Phase 4
must make safe landing evidence-driven, final external review gates remain
bootstrap gaps until implemented, and Codex PM owns routine code-safety routing.

## Expected Files

Likely implementation files:

- `docs/templates/review-evidence.md`
- `docs/templates/landing-verdict.md`
- `src/commands/land-check.ts`
- `src/cli.ts`
- `src/commands/validate.ts`
- `src/state/review-evidence.ts`
- `src/state/landing-verdicts.ts`
- `src/state/git.ts`
- focused test files under `test/`

Likely evidence files:

- `docs/work/BANDIT-005/red-evidence.md`
- `docs/work/BANDIT-005/implementation-evidence.md`
- `docs/work/BANDIT-005/review-evidence.md`
- `docs/work/BANDIT-005/routing-decision.md`
- `docs/work/BANDIT-005/landing-verdict.md`
- `docs/work/BANDIT-005/landing-action.md`
- `docs/work/BANDIT-005/retrospective.md`

Context files expected to change:

- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`

The final implementation may adjust file names if tests and local structure
prove a simpler pattern, but it must preserve this brief's acceptance criteria
and source-of-truth boundaries.

## First Implementation Order

1. Create `docs/work/BANDIT-005/red-evidence.md` mapping acceptance criteria to
   focused tests.
2. Add failing tests for review evidence artifact parsing and missing gate
   refusal paths.
3. Add failing tests for landing verdict artifact parsing and unsupported final
   decisions.
4. Add failing tests for source-drift checks, including stale review evidence
   and missing Git metadata behavior.
5. Add failing tests for `bandit land-check` usage, success output, missing
   work item, missing evidence, malformed evidence, stale evidence, and
   `safe-to-land` with missing required gates.
6. Add review evidence and landing verdict templates.
7. Add small parser/validator helpers for the new contracts.
8. Add source-head/current-head helper behavior without making Git metadata a
   hidden source of truth.
9. Wire `bandit land-check <work-item-id>` to report recorded landing readiness
   and fail closed for unsafe `safe-to-land` claims.
10. Create `docs/work/BANDIT-005/routing-decision.md` using the existing routing
    decision contract if smell-trigger routing needs a durable record before
    landing.
11. Create `BANDIT-005` implementation evidence, review evidence, landing
    verdict, retrospective, landing action evidence, and context updates.
12. Run focused tests and confirm RED-to-green behavior.
13. Run `npm test`, `npm run typecheck`, `npm run bandit -- validate`,
    `npm run bandit -- land-check BANDIT-005`, and `git diff --check`.

## Smell Triggers

- `BANDIT-SMELL-WORKFLOW-GATE-MISSING`: blocker if this slice allows
  `safe-to-land` without required stage, review, verdict, or landing evidence.
- `BANDIT-SMELL-EVIDENCE-FRESHNESS`: blocker if stale review, test, or source
  evidence can be treated as current.
- `BANDIT-SMELL-CODERABBIT-WAIVER`: blocker if CodeRabbit request-changes,
  stale state, or missing state can be hidden behind prose.
- `BANDIT-SMELL-ADVERSARIAL-REVIEW`: blocker if local Qwen or escalated review
  state is omitted without an explicit bootstrap gap.
- `BANDIT-SMELL-UAT-APPROVAL`: blocker if feature-slice UAT status can be
  ignored or collapsed into code-safety review.
- `BANDIT-SMELL-PARSER-VALIDATOR`: blocker because this slice changes artifact
  parsers, validators, and refusal paths.
- `BANDIT-SMELL-SCHEMA-MIGRATION`: blocker if persisted artifact contracts are
  changed without versioning or migration/no-migration rationale.
- `BANDIT-SMELL-REGISTRY-INDEX-AUTHORITY`: blocker if a cache, index, or UI
  becomes hidden landing authority.
- `BANDIT-SMELL-MISSING-COVERAGE`: blocker if safe-to-land refusal paths or
  stale evidence checks lack tests or explicit bootstrap gaps.
- `BANDIT-SMELL-MALFORMED-EVIDENCE`: blocker if malformed review or landing
  artifacts are accepted.
- `BANDIT-SMELL-POLICY-DRIFT`: blocker if templates, validation, or command
  output diverge from `AGENTS.md`, `CONTEXT.md`, `CLEAN_CODE.md`, or stage
  rubrics.
- `BANDIT-SMELL-UNAVAILABLE-AGENT`: bootstrap gap for CodeRabbit, Qwen,
  escalated review, and Landing Agent until those final gates exist.

## Escalation Plan

- Codex PM owns workflow, skill, command, reviewer, and escalation routing for
  this slice.
- Test Writer behavior is required for parser, validator, stale evidence, and
  safe-to-land refusal paths before implementation.
- CodeRabbit, local Qwen, escalated reviewer, and Landing Agent gates are
  recorded as `bootstrap_gap` until their implementations exist.
- Any missing product direction, UAT approval, policy change, business tradeoff,
  or explicit cost/risk override must halt the blocked action and ask the
  operator directly.
- No operator input is required for routine technical routing in this slice.

## Required Evidence

- `docs/work/BANDIT-005/red-evidence.md`
- `docs/work/BANDIT-005/implementation-evidence.md`
- `docs/work/BANDIT-005/review-evidence.md`
- `docs/work/BANDIT-005/routing-decision.md`, if routing needs a durable record
  before landing
- `docs/work/BANDIT-005/landing-verdict.md`
- `docs/work/BANDIT-005/landing-action.md`
- `docs/work/BANDIT-005/retrospective.md`
- Updated `docs/roadmap/CURRENT_CONTEXT.md` when the next action changes.
- Updated `docs/roadmap/ROADMAP.md` when phase or active-work status changes.

## Operator Input Status

No required operator-owned input is missing for RED evidence or implementation.

The implementation must fail closed and surface the missing input if review or
landing evidence requires product direction, UAT approval, a business tradeoff,
a policy change, or an explicit cost/risk override that repo artifacts cannot
answer.
