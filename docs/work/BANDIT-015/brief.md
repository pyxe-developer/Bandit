# BANDIT-015: Live CodeRabbit Pre-Landing Loop

## Status

Bootstrap-gap chore brief created on 2026-05-24. RED evidence is the next
required action. Production implementation has not started.

## Goal

Convert `BANDIT-GAP-LIVE-CODERABBIT` from an open bootstrap gap into a durable
CLI-owned CodeRabbit pre-landing loop that can request or read live CodeRabbit
review state, classify actionable findings, record repo-native evidence, and
fail closed when live CodeRabbit or GitHub state cannot be verified.

## Non-Product Work

This is workflow-infrastructure hardening, not a user-facing feature slice.
`BANDIT-007` created the repo-native CodeRabbit evidence artifact and
artifact-backed `bandit coderabbit-review <work-item-id>` reporting path. This
chore addresses the remaining live integration gap without changing product
UAT, landing policy, escalated-review routing, or workflow cockpit scope.

## Origin

- `AGENTS.md` requires CodeRabbit to be requested or read through CLI
  automation before landing.
- `docs/work/BANDIT-007/retrospective.md` records live CodeRabbit polling,
  GitHub API access, PR comment repair orchestration, and rerun automation as a
  separate bootstrap gap from repo-native CodeRabbit state capture.
- `.bandit/bootstrap-gaps.json` tracks `BANDIT-GAP-LIVE-CODERABBIT` as the next
  open bootstrap-gap chore after `BANDIT-014`.
- `docs/roadmap/CURRENT_CONTEXT.md` and `docs/roadmap/ROADMAP.md` require one
  bootstrap-gap chore at a time and identify this gap as the current priority.
- `docs/work/BANDIT-014/landing-action.md` and
  `docs/work/BANDIT-014/retrospective.md` record the previous bootstrap-gap
  chore as landed and closed out, so the slice boundary allows this brief.

## Bootstrap-Gap Chore Metadata

source_work_item: BANDIT-014
source_gap: BANDIT-GAP-LIVE-CODERABBIT
source_artifacts:
  - AGENTS.md
  - .bandit/bootstrap-gaps.json
  - docs/work/BANDIT-007/retrospective.md
  - docs/work/BANDIT-007/coderabbit-review.md
  - docs/roadmap/CURRENT_CONTEXT.md
  - docs/roadmap/ROADMAP.md
  - docs/work/BANDIT-014/landing-action.md
lesson: Repo-native CodeRabbit evidence exists, but live CodeRabbit status remains manually substituted during bootstrap.
hypothesis: A narrow CLI-owned live CodeRabbit loop can normalize live review state into `coderabbit-review.md`, distinguish pass, request-changes, stale, unavailable, and operator-blocked states, and preserve fail-closed landing behavior without making chat, dashboards, or terminal scrollback authoritative.
metric: A work item with live CodeRabbit configuration can record current CodeRabbit evidence through the CLI, while missing credentials, missing PR context, unresolved actionable findings, stale state, and unavailable service states produce explicit blocker or operator-input-blocked evidence instead of a pass.
baseline: `bandit coderabbit-review <work-item-id>` can report existing repo-native evidence, but no command can request, poll, or normalize live CodeRabbit/GitHub review state.
expected_direction: Future landing checks use live CodeRabbit evidence when configured and continue to treat unavailable live review as `bootstrap_gap`, `blocker`, or `operator_input_blocked` rather than as clean review.
evaluation_window: Evaluate at `BANDIT-015` closeout and again before resolving the live escalated reviewer gap.
status: pending
outcome: pending

## Scope

- Define the live CodeRabbit loop contract: required inputs, configuration,
  credential boundaries, PR context, request/read behavior, polling limits,
  supported states, evidence output, and refusal paths.
- Add a deterministic CLI path that can request or read live CodeRabbit state
  for one work item when required repo and environment configuration are
  present.
- Keep secrets out of repo-native artifacts. Evidence may name which credential
  variable or provider configuration was required, but must not record tokens.
- Normalize live CodeRabbit/GitHub state into the existing
  `docs/work/<ID>/coderabbit-review.md` contract or a narrowly versioned
  extension of it.
- Distinguish clean review, request-changes, unresolved actionable comments,
  non-blocking findings, stale review, missing PR context, missing credentials,
  queue timeout, unavailable service, and operator-owned setup blockers.
- Preserve `land-check` fail-closed behavior: CodeRabbit pass claims require
  current evidence, unresolved actionable findings block, and unavailable live
  review cannot be treated as pass.
- Add tests with fixture or mocked CodeRabbit/GitHub clients. Automated tests
  must not require network access, real GitHub authentication, paid services,
  or operator approval.
- Record RED evidence, implementation evidence, CodeRabbit review evidence,
  review evidence, local Qwen review, escalated-review disposition, landing
  verdict, landing action, retrospective, and gap-ledger disposition before
  this chore can close.

## Out Of Scope

- Installing or configuring the CodeRabbit GitHub App for the operator.
- Creating, storing, or exposing GitHub, CodeRabbit, OpenAI, Anthropic, or other
  paid-service credentials.
- Auto-fixing CodeRabbit findings without an explicit repair contract.
- Live escalated adversarial reviewer routing.
- Product UAT execution or acceptance by an agent.
- PR merge, push, deploy, or remote landing behavior beyond existing Landing
  Agent local-record policy.
- General GitHub issue, PR, or CI orchestration unrelated to CodeRabbit review
  state.
- Workflow Cockpit UI, state index, or heartbeat chore-agent behavior.
- Resolving later bootstrap gaps such as work-item creation, general artifact
  creation, heartbeat chore-agent, or cockpit.

## Acceptance Criteria

1. RED evidence demonstrates that Bandit cannot currently request, poll, read,
   or normalize live CodeRabbit/GitHub review state through CLI authority.
2. A live CodeRabbit loop contract exists and defines configuration, credential
   boundaries, PR context, request/read behavior, polling limits, supported
   states, evidence output, and fail-closed refusal paths.
3. The CLI exposes a narrow live CodeRabbit path selected during RED/GREEN
   planning without requiring chat context.
4. The command reuses the existing repo-native CodeRabbit evidence parser and
   `land-check` semantics instead of creating a second source of truth.
5. The command can record current passing CodeRabbit evidence when fixture or
   mocked live state says review is complete, current, and clean.
6. Request-changes, unresolved actionable comments, malformed provider
   responses, stale source heads, missing PR context, missing credentials,
   queue timeout, and unavailable service states fail closed with actionable
   evidence.
7. Missing operator-owned setup, such as a required GitHub/CodeRabbit
   credential or app installation, is recorded as `operator_input_blocked` or a
   blocker artifact with the exact missing input; it is not guessed or treated
   as a technical pass.
8. Evidence artifacts never contain secret token values.
9. The implementation does not perform unsupported autofix, merge, push,
   deploy, UAT, or paid-model routing actions.
10. `land-check` remains blocked when aggregate review or landing evidence
    claims CodeRabbit pass but current live-normalized CodeRabbit evidence is
    missing, stale, blocked, or inconclusive.
11. Focused tests cover clean live review, request-changes, unresolved
    actionable comments, stale review, missing PR context, missing credentials,
    timeout or unavailable provider state, secret redaction, and `land-check`
    integration.
12. Existing validation, review, local Qwen, CodeRabbit artifact, escalated
    review, UAT, bootstrap-gap, landing-gate, auto-landing, and Landing Agent
    tests continue to pass.
13. `npm test`, `npm run typecheck`, `npm run bandit -- validate`,
    representative live-CodeRabbit command checks using fixtures or mocks,
    `npm run bandit -- land-check BANDIT-015`, and `git diff --check` pass
    before landing.
14. Closeout artifacts explicitly evaluate `CLEAN_CODE.md` and
    `docs/verification/STAGE_RUBRICS.md` before any safe-to-land verdict.

## Verification Plan

- Add focused RED tests in a new or existing CodeRabbit test file for:
  - missing live CodeRabbit command or contract;
  - clean live review evidence capture;
  - request-changes and unresolved actionable comments;
  - stale source head refusal;
  - missing PR context refusal;
  - missing credential or app setup as an operator-input blocker;
  - provider timeout or unavailable state;
  - token redaction in evidence and errors;
  - `land-check` consumption of live-normalized evidence.
- Run focused RED tests and record output in
  `docs/work/BANDIT-015/red-evidence.md` before production implementation.
- Implement the narrowest contract, provider boundary, fixture-backed client,
  command behavior, evidence writer, and landing-gate integration that satisfy
  the acceptance criteria.
- Run focused and full verification, including `npm test`,
  `npm run typecheck`, `npm run bandit -- validate`, representative
  fixture-backed live CodeRabbit checks, `npm run bandit -- land-check
  BANDIT-015`, and `git diff --check`.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating this work item. The
acceptance criteria make clean-code compliance evaluable through narrow scope,
explicit source-of-truth boundaries, secret hygiene, fail-closed provider
states, deterministic tests, and preserved CodeRabbit, Landing Agent, UAT,
policy, business, cost, and risk boundaries.

## Stage-Rubric Checklist

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `.bandit/bootstrap-gaps.json`, and `bandit gaps list` identify `BANDIT-GAP-LIVE-CODERABBIT` as the next queued gap. `BANDIT-014` has landing-action evidence, retrospective closeout, and a resolved gap-ledger disposition. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, verification plan, clean-code read evidence, bootstrap gaps, expected files, implementation order, smell triggers, required evidence, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pending` | RED tests and `docs/work/BANDIT-015/red-evidence.md` are the next required action. |
| Stage 3: Implementation Clean-Code Rubric | `not_applicable` | No production implementation in this step. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | This chore exists to replace the live CodeRabbit bootstrap gap. Live escalated reviewer routing remains bootstrap-limited and replacement evidence is required during closeout. |
| Stage 5: Landing And UAT | `bootstrap_gap` | UAT is not required for this non-product workflow-infrastructure chore. Landing action evidence is required before the next gap chore can begin. |
| Stage 6: Retrospective And Improvement Capture | `pending` | Required after implementation and closeout. |

## Relevant Smell Triggers And Routing Plan

- **CodeRabbit waiver or request changes:** request-changes and unresolved
  actionable findings must block landing or require explicit PM disposition in
  evidence.
- **Evidence freshness:** source drift after live CodeRabbit review must block
  pass claims.
- **Unavailable agent:** provider queue timeout, missing credentials, or missing
  app setup must be recorded honestly, not collapsed into pass.
- **Hidden authority:** CodeRabbit dashboard state, chat, terminal scrollback,
  caches, or UI state cannot become canonical readiness evidence.
- **Parser/validator mismatch:** live-normalized evidence, the artifact parser,
  and `land-check` must share supported values.
- **Secret exposure:** provider credentials must never be written to
  repo-native artifacts or test output.
- **Role erosion:** the CodeRabbit loop may normalize review findings, but it
  cannot provide product UAT, landing approval, or policy/cost overrides.
- **Escalation plan:** Codex PM owns the technical route. Operator input is
  required only for actual CodeRabbit/GitHub setup, credential provision,
  product UAT, policy changes, explicit cost/risk overrides, or business
  tradeoffs.

## Bootstrap Gaps

- Live CodeRabbit polling, GitHub API access, PR comment repair orchestration,
  and rerun automation are unavailable until this chore replaces or explicitly
  blocks them.
- Live escalated adversarial reviewer routing remains unavailable.
- No general work-item creation command exists yet.
- No general artifact creation command exists yet.
- Heartbeat chore-agent, workflow cockpit, and state index remain unavailable.

## Expected Files

- `docs/work/BANDIT-015/brief.md`
- `docs/work/BANDIT-015/red-evidence.md`
- `docs/work/BANDIT-015/implementation-evidence.md`
- `docs/work/BANDIT-015/coderabbit-review.md`
- `docs/work/BANDIT-015/review-evidence.md`
- `docs/work/BANDIT-015/local-qwen-review.md`
- `docs/work/BANDIT-015/escalated-review.md`
- `docs/work/BANDIT-015/landing-verdict.md`
- `docs/work/BANDIT-015/landing-action.md`
- `docs/work/BANDIT-015/retrospective.md`
- `.bandit/bootstrap-gaps.json`
- A live CodeRabbit loop contract or policy artifact under `.bandit/policy/`
  or the nearest existing integration policy location.
- A narrow command implementation under `src/commands/`.
- A provider boundary or state helper under `src/state/` or a similarly local
  module if needed.
- Focused tests for live CodeRabbit loop behavior, using fixtures or mocks.
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`

## First Implementation Order

1. Inspect existing `coderabbit-review`, `land-check`, review-evidence,
   landing-verdict, bootstrap-gap, git-state, and validation helpers.
2. Add focused RED tests for missing live CodeRabbit loop behavior and the
   required fail-closed states.
3. Run focused RED tests and record evidence.
4. Define the live CodeRabbit loop contract and secret/credential boundaries.
5. Implement the narrow CLI path and provider boundary with fixture or mocked
   test coverage.
6. Write live-normalized `coderabbit-review.md` evidence through the existing
   artifact contract or a narrowly versioned extension.
7. Preserve or extend `land-check` so it consumes current live-normalized
   evidence without allowing unavailable live review to pass.
8. Run focused and full verification.
9. Record implementation, CodeRabbit, review, landing, retrospective,
   gap-ledger, and context evidence.

## Required Evidence

- `docs/work/BANDIT-015/red-evidence.md`
- `docs/work/BANDIT-015/implementation-evidence.md`
- `docs/work/BANDIT-015/coderabbit-review.md`
- `docs/work/BANDIT-015/review-evidence.md`
- `docs/work/BANDIT-015/local-qwen-review.md`
- `docs/work/BANDIT-015/escalated-review.md` when routing requires a placeholder
  or records `not_applicable`
- `docs/work/BANDIT-015/landing-verdict.md`
- `docs/work/BANDIT-015/landing-action.md`
- `docs/work/BANDIT-015/retrospective.md`
- Updated `.bandit/bootstrap-gaps.json`
- Updated `docs/roadmap/CURRENT_CONTEXT.md`
- Updated `docs/roadmap/ROADMAP.md`

## Operator Input Status

No operator input is required before RED evidence. Repo artifacts define the
routing decision: create the live CodeRabbit bootstrap-gap chore and start with
a deterministic spec and RED tests.

Actual live CodeRabbit or GitHub setup remains operator-owned if implementation
evidence proves credentials, app installation, paid-service enablement, policy
changes, business tradeoffs, or explicit cost/risk overrides are required. If
that happens, the chore must halt the blocked action, record the exact missing
input, and keep the gap open, blocked, or explicitly dispositioned rather than
guessing.
