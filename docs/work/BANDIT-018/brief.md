# BANDIT-018: Live Escalated Reviewer Routing

## Status

Bootstrap-gap chore brief created on 2026-05-24 after `BANDIT-017` closeout.
Production implementation, RED evidence, review evidence, landing verdict,
landing action, and retrospective have not started.

## Goal

Convert `BANDIT-GAP-LIVE-ESCALATED-REVIEWER` from an open bootstrap gap into a
durable CLI-owned escalated adversarial reviewer routing path that can select,
run or refuse a stronger reviewer from repo policy, record current evidence,
and fail closed when live reviewer execution is unavailable.

## Non-Product Work

This is workflow-infrastructure hardening, not a user-facing feature slice.
`BANDIT-010` created the escalated-review placeholder gate so landing checks can
honestly record that live stronger-reviewer routing is unavailable. This chore
addresses that remaining live-routing gap without changing product UAT,
auto-landing policy, CodeRabbit orchestration, PR merge behavior, or cockpit
scope.

## Origin

- `AGENTS.md` requires stronger or second reviewers to be selected by policy
  smells, not operator choice.
- `CONTEXT.md` defines adversarial escalation as a policy path that adds or
  replaces the baseline reviewer for complex or high-risk PRs.
- `docs/work/BANDIT-010/landing-action.md` records the placeholder gate as
  landed.
- `docs/work/BANDIT-017/retrospective.md` lists
  `BANDIT-GAP-LIVE-ESCALATED-REVIEWER` as the next open bootstrap gap.
- `.bandit/bootstrap-gaps.json`, `docs/roadmap/CURRENT_CONTEXT.md`, and
  `docs/roadmap/ROADMAP.md` route this gap as the next work queue item.
- `docs/work/BANDIT-017/landing-action.md` and
  `docs/work/BANDIT-017/retrospective.md` record the previous chore as landed
  and closed out, so the slice boundary allows this brief.

## Bootstrap-Gap Chore Metadata

source_work_item: BANDIT-010
source_gap: BANDIT-GAP-LIVE-ESCALATED-REVIEWER
source_artifacts:
  - AGENTS.md
  - CONTEXT.md
  - .bandit/bootstrap-gaps.json
  - .bandit/reviewers/escalated-placeholder.json
  - docs/work/BANDIT-010/brief.md
  - docs/work/BANDIT-010/escalated-review.md
  - docs/work/BANDIT-010/landing-action.md
  - docs/work/BANDIT-017/retrospective.md
  - docs/roadmap/CURRENT_CONTEXT.md
  - docs/roadmap/ROADMAP.md
lesson: Bandit can require and validate escalated-review placeholder evidence, but it cannot yet route a live stronger reviewer from repo policy or record live escalated-review evidence through CLI authority.
hypothesis: A narrow CLI-owned escalated-review command and policy contract can select configured reviewer profiles from smell/routing evidence, produce current repo-native evidence, and preserve fail-closed behavior for missing credentials, unsupported providers, paid-service setup, unavailable reviewers, and stale source heads.
metric: A work item with escalation-required routing can record current escalated-review evidence through the CLI when a configured reviewer or fixture-backed provider is available, while missing setup, unsupported provider state, stale output, or reviewer blockers prevent landing instead of becoming placeholder pass evidence.
baseline: `BANDIT-010` enforces escalated-review placeholder artifacts, and later work items use bootstrap-limited `escalated-review.md` dispositions when smell triggers require stronger review.
expected_direction: Future landing checks rely on live or explicitly blocked escalated-review evidence for escalation-required work, and placeholder-only evidence is no longer the normal route once configured reviewer execution is available.
evaluation_window: Evaluate during `BANDIT-018` closeout and again on the next smell-triggered work item that requires escalated review.
status: pending
outcome: pending

## Scope

- Define the live escalated-review routing contract: policy inputs, smell or
  routing triggers, reviewer profile selection, provider configuration,
  credential boundaries, cost-safety defaults, supported verdict states,
  evidence output, and refusal paths.
- Add a CLI-owned path for one work item that can run or read escalated
  adversarial reviewer output through configured reviewer profiles without
  making chat, dashboard state, or terminal scrollback authoritative.
- Support deterministic fixture or mock execution for tests and bootstrap
  verification; automated tests must not require network access, paid-model
  credentials, or operator approval.
- Keep live paid-model or external-provider execution disabled unless explicit
  repo configuration and required environment variables are present.
- Record exact operator-owned setup blockers when credentials, provider access,
  cost approval, or app installation are missing; do not infer or silently
  substitute those inputs.
- Normalize reviewer output into `docs/work/<ID>/escalated-review.md` or a
  narrowly versioned extension of that artifact while preserving existing
  `land-check` consumption.
- Preserve fail-closed landing behavior for missing required escalation,
  request-changes or blocker reviewer findings, stale source heads, malformed
  provider output, unavailable provider state, and unsupported reviewer
  profiles.
- Preserve the existing Local Qwen baseline reviewer, CodeRabbit evidence,
  Stage 4 evidence-head policy, Landing Agent local-record behavior, and
  CLI-owned UAT boundaries.
- Record RED evidence, implementation evidence, live or fixture-backed
  escalated-review evidence, aggregate review evidence, Local Qwen review,
  landing verdict, landing action, retrospective, and gap-ledger disposition
  before this chore can close.

## Out Of Scope

- Operator product UAT or product acceptance.
- Operator approval of routine technical reviewer routing.
- Silently enabling paid-model calls, creating paid-service accounts, or
  storing paid-service credentials.
- Changing the default Local Qwen baseline reviewer route.
- Live CodeRabbit/GitHub polling or repair orchestration beyond the existing
  `BANDIT-015` path.
- PR merge, push, deploy, or remote landing behavior beyond existing Landing
  Agent local-record policy.
- Auto-fixing escalated-review findings without a separate repair contract.
- General work-item creation, general artifact creation, heartbeat chore-agent,
  workflow cockpit, state index, or broader coordination primitive work.

## Acceptance Criteria

1. RED evidence demonstrates that escalation-required work still relies on
   placeholder escalated-review evidence because no CLI-owned live reviewer
   routing path exists.
2. A durable live escalated-review routing contract exists and defines policy
   inputs, trigger sources, reviewer profile selection, provider configuration,
   credential boundaries, cost-safety defaults, verdict states, evidence
   output, and fail-closed refusal paths.
3. The CLI exposes a narrow escalated-review path for one work item selected
   from repo policy and work-item evidence, without requiring chat context or
   operator technical routing decisions.
4. Deterministic tests can exercise the live-routing path through fixture or
   mock providers without network access, real credentials, or paid calls.
5. The command records current escalated-review evidence when configured
   reviewer output is complete, current, and non-blocking.
6. Missing credentials, missing explicit paid-provider setup, unsupported
   provider configuration, unavailable provider state, queue timeout,
   malformed output, reviewer blocker verdicts, and stale source heads fail
   closed with actionable evidence.
7. Operator-owned blockers are surfaced as exact missing inputs for provider
   setup, credentials, cost/risk approval, product direction, or UAT; they are
   not converted into technical passes.
8. `land-check` no longer treats placeholder-only escalated-review evidence as
   sufficient when live escalated-review routing is configured and required,
   while preserving honest `bootstrap_gap` behavior for unsupported bootstrap
   contexts.
9. Existing Local Qwen, CodeRabbit, review evidence, escalated-review
   placeholder validation, Stage 4, UAT, auto-landing, Landing Agent, and
   bootstrap-gap behavior continue to pass.
10. Focused tests cover configured pass evidence, reviewer blockers, stale
    source heads, missing credentials, missing explicit cost/setup approval,
    unavailable or timed-out providers, malformed output, and land-check
    integration.
11. `npm test`, `npm run typecheck`, `npm run bandit -- validate`, relevant
    escalated-review command checks, `npm run bandit -- land-check
    BANDIT-018`, and `git diff --check` pass before landing.
12. Closeout artifacts explicitly evaluate `CLEAN_CODE.md` and
    `docs/verification/STAGE_RUBRICS.md` before any safe-to-land verdict.

## Verification Plan

- Add focused RED tests in the nearest reviewer profile, routing,
  escalated-review, or landing-gate test file for:
  - missing live escalated-review command or routing contract;
  - configured fixture-backed escalated-review pass evidence;
  - reviewer blocker or request-changes evidence;
  - stale source-head refusal;
  - missing credentials or provider setup as operator-owned blockers;
  - unavailable or timed-out provider state;
  - malformed reviewer output;
  - `land-check` consumption of live escalated-review evidence.
- Run focused RED tests and record failing output in
  `docs/work/BANDIT-018/red-evidence.md` before production implementation.
- Implement the narrowest policy artifact, provider boundary, fixture-backed
  client, command behavior, evidence writer, and landing-gate integration that
  satisfy the acceptance criteria.
- Run focused and full verification, including `npm test`,
  `npm run typecheck`, `npm run bandit -- validate`, representative
  escalated-review command checks, `npm run bandit -- land-check BANDIT-018`,
  and `git diff --check`.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating this work item. The
acceptance criteria make clean-code compliance evaluable through narrow scope,
explicit source-of-truth boundaries, fail-closed reviewer routing, secret and
cost hygiene, deterministic tests, and preserved Codex PM, reviewer, Landing
Agent, UAT, policy, business, cost, and risk boundaries.

## Stage-Rubric Checklist

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `.bandit/bootstrap-gaps.json`, and `bandit gaps list` identify `BANDIT-GAP-LIVE-ESCALATED-REVIEWER` as active `BANDIT-018` work. `BANDIT-017` has landing-action evidence, retrospective closeout, and a resolved gap-ledger disposition. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, verification plan, clean-code read evidence, bootstrap gaps, expected files, implementation order, smell triggers, required evidence, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pending` | Required before production implementation. |
| Stage 3: Implementation Clean-Code Rubric | `not_applicable` | No production implementation in this step. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | This work item is scoped to replace the live escalated-reviewer bootstrap gap with CLI-owned routing; CodeRabbit is available only through the existing fixture-backed live path when applicable. |
| Stage 5: Landing And UAT | `pending` | UAT is not required for this non-product workflow-infrastructure chore. Landing verdict and landing action evidence are required before the next gap chore can begin. |
| Stage 6: Retrospective And Improvement Capture | `pending` | Required after implementation and closeout. |

## Relevant Smell Triggers And Routing Plan

- **Escalated review required:** Policy/routing evidence must select stronger
  review when smell triggers require it.
- **Unavailable agent:** Missing provider setup, credentials, cost approval,
  queue timeout, or unsupported reviewer configuration must be recorded
  honestly, not collapsed into pass.
- **Hidden authority:** Reviewer selection and evidence freshness must be
  explicit in repo-native policy and artifacts.
- **Weak refusal path:** Missing, stale, malformed, or blocker reviewer
  evidence must fail closed.
- **Secret and cost exposure:** Credentials and paid-provider details must not
  be written to repo artifacts; paid calls require explicit configured setup.
- **Cross-model tension:** Material disagreement between baseline Local Qwen,
  CodeRabbit, and escalated reviewer findings must be dispositioned with PM
  rationale and tension evidence when required.
- **Role erosion:** Codex PM owns reviewer routing from policy, but cannot
  provide product UAT, policy changes, business tradeoffs, or explicit cost/risk
  overrides.
- **Escalation plan:** Codex PM owns technical routing. Operator input is
  required only for actual provider setup, credentials, explicit paid-service
  approval, product UAT, policy changes, business tradeoffs, or genuinely
  ambiguous scope.

## Bootstrap Gaps

- Live escalated adversarial reviewer routing is unavailable until this chore
  resolves, blocks on operator-owned setup, or explicitly records a no-action
  policy decision.
- No general Bandit work-item creation command exists yet.
- No general artifact creation command exists yet.
- Heartbeat chore-agent, workflow cockpit, and state index remain unavailable.

## Expected Files

- `docs/work/BANDIT-018/brief.md`
- `docs/work/BANDIT-018/red-evidence.md`
- `docs/work/BANDIT-018/implementation-evidence.md`
- `docs/work/BANDIT-018/escalated-review.md`
- `docs/work/BANDIT-018/review-evidence.md`
- `docs/work/BANDIT-018/local-qwen-review.md`
- `docs/work/BANDIT-018/landing-verdict.md`
- `docs/work/BANDIT-018/landing-action.md`
- `docs/work/BANDIT-018/retrospective.md`
- `.bandit/bootstrap-gaps.json`
- `.bandit/reviewers/escalated-placeholder.json` or a new configured
  escalated reviewer profile.
- A live escalated-review routing contract or policy artifact under
  `.bandit/policy/` or the nearest existing reviewer policy location.
- `src/commands/` command module for escalated reviewer routing if needed.
- `src/state/reviewer-profiles.ts`, `src/state/escalated-review.ts`,
  `src/state/routing-decisions.ts`, or the nearest existing state module.
- Focused tests in the nearest reviewer profile, routing, escalated-review, or
  landing-gate test file.

## Required Evidence

- RED evidence proving the current gap.
- Implementation evidence mapping code paths to acceptance criteria and
  `CLEAN_CODE.md`.
- Live or fixture-backed escalated-review evidence, or exact operator-owned
  blocker evidence if live setup is unavailable.
- CodeRabbit/review evidence.
- Local Qwen review evidence.
- Landing verdict and landing action evidence.
- Retrospective with improvement dispositions and gap-ledger closeout.
- Updated `CURRENT_CONTEXT.md` and `ROADMAP.md`.

## Operator Input Status

No operator-owned input is required for the next RED-evidence step. Repo
artifacts define the technical routing decision: replace placeholder-only
escalated-review evidence with CLI-owned reviewer routing that fails closed
when live provider setup, credentials, or explicit cost/risk approval are
missing. Operator input remains required before any paid-provider credential,
cost/risk override, product UAT, business tradeoff, policy change beyond this
brief, or genuinely ambiguous scope.

## First Implementation Order

1. Inspect the existing escalated-review placeholder artifact, reviewer-profile
   parser, routing/smell catalog, Local Qwen command, live CodeRabbit fixture
   path, and landing-readiness checks.
2. Add focused RED tests for missing live routing, fixture-backed pass,
   reviewer blocker, stale source, missing setup/credentials, unavailable
   provider, malformed output, and land-check integration.
3. Run the focused RED tests and record evidence in
   `docs/work/BANDIT-018/red-evidence.md`.
4. Implement the narrow live escalated-review routing contract and CLI path.
5. Wire evidence into validation and landing readiness without introducing a
   second source of truth.
6. Run focused tests, full verification, review gates, landing checks, and
   closeout evidence before landing.
