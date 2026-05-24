# BANDIT-006: Local Qwen Baseline Reviewer Gate

## Status

Brief created on 2026-05-24. RED evidence was created on 2026-05-24 in
`docs/work/BANDIT-006/red-evidence.md`. Production implementation has not
started.

## Goal

Create the first executable local Qwen baseline reviewer gate so Bandit can run
or explicitly account for the default no-paid-key adversarial reviewer before a
work item is marked safe to land.

This slice should reduce the `local_qwen_state: bootstrap_gap` left by
`BANDIT-005` without broadening into CodeRabbit automation, paid reviewer
escalation, UAT, final Landing Agent behavior, or workflow cockpit work.

## Scope

- Define a repo-native local Qwen baseline reviewer profile contract.
- Add a profile seed for `local-qwen-baseline` under repo-native Bandit state.
- Define a local Qwen review evidence artifact contract for
  `docs/work/<ID>/local-qwen-review.md` or an equally narrow local pattern
  chosen during RED evidence.
- Extend validation so the local Qwen reviewer profile and any present local
  Qwen review evidence fail closed when missing required fields, using
  unsupported values, referencing the wrong work item, hiding unresolved
  operator input, or treating an unavailable runtime as a pass.
- Add a narrow CLI command, tentatively
  `bandit qwen-review <work-item-id>`, that reads the configured local profile
  and records or reports the local Qwen baseline review state for one work
  item.
- Make the local Qwen command fail closed when the work item is missing, the
  profile is missing or malformed, the configured runtime is unavailable, the
  reviewer exits nonzero, the reviewer output is inconclusive, or the source
  head is stale.
- Preserve deterministic automated tests by using fixture reviewer commands or
  isolated subprocess doubles; automated tests must not depend on a live model,
  network, paid key, or operator approval.
- Extend `land-check` only as much as needed to recognize a current local Qwen
  review evidence artifact as the replacement for the current local-Qwen
  bootstrap gap.
- Create `BANDIT-006` RED evidence before implementation, then later create
  implementation evidence, local Qwen review evidence, review evidence,
  landing verdict, landing action, retrospective, and context updates.

## Out Of Scope

- CodeRabbit CLI automation, polling, comment repair, or GitHub API access.
- Paid-model reviewer routing, stronger reviewer execution, or explicit
  cost/risk overrides.
- Final Landing Agent implementation.
- CLI-owned UAT approval artifacts or stale UAT refresh workflow.
- PR merge automation, branch landing automation, or auto-landing.
- Workflow Cockpit UI.
- SQLite indexing or any cache/index as canonical reviewer state.
- Automated review finding repair.
- Automated smell detection from diffs, PR text, or chat history.
- Retrofitting every historical work item to require a local Qwen review
  artifact.
- Allowing the operator to pick routine reviewer routing for this slice.
- Letting the local Qwen reviewer edit files, approve tools, or become a
  hidden implementation agent.

## Acceptance Criteria

1. The repository contains a repo-native local Qwen baseline reviewer profile
   contract with required fields for profile ID, version, runtime or command,
   model or model source, prompt contract, timeout, permissions, output
   contract, and unavailable-runtime behavior.
2. The seeded profile identifies the default route as `local-qwen-baseline`
   and keeps the reviewer read-only for v0.
3. `bandit validate` fails closed when the local Qwen profile is missing,
   malformed, uses an unsupported runtime, omits the prompt or output
   contract, omits timeout/permission posture, or hides unavailable-runtime
   behavior.
4. A local Qwen review evidence template or contract exists with required
   fields for work item ID, source head, profile ID, runtime/model, run status,
   reviewer verdict, findings/disposition, operator-input status,
   source-drift status, and bootstrap gaps.
5. `bandit validate` validates any present local Qwen review evidence artifact
   and fails closed when it references the wrong work item, omits required
   fields, uses unsupported verdict values, records unresolved operator input,
   or claims a pass without executable reviewer evidence.
6. The CLI exposes `bandit qwen-review <work-item-id>` or an equivalently
   narrow command name chosen during RED evidence.
7. The local Qwen command reports a clear usage error when the work item ID is
   omitted.
8. The local Qwen command fails closed when the work item does not exist.
9. The local Qwen command fails closed when the local Qwen profile is missing
   or malformed.
10. The local Qwen command fails closed when the configured runtime is
    unavailable, exits nonzero, times out, or produces inconclusive output
    unless the artifact records an explicit `bootstrap_gap` with replacement
    evidence.
11. The local Qwen command records or reports the current source head and does
    not treat stale local Qwen evidence as current.
12. Reviewer output is summarized into repo-native evidence; chat history,
    terminal scrollback, hidden Qwen session state, or model-local memory is
    not canonical.
13. `land-check` can distinguish a real current local Qwen pass from an
    accepted local-Qwen bootstrap gap and continues to fail closed for blocked,
    stale, inconclusive, unavailable, or malformed local Qwen evidence.
14. Tests cover profile validation, evidence validation, command usage,
    unknown work item, missing/malformed profile, unavailable runtime,
    nonzero reviewer exit, inconclusive reviewer output, stale source head,
    successful fixture review evidence, and `land-check` integration.
15. The implementation keeps the surface small: profile parsing, evidence
    parsing, one narrow command, small `land-check` integration, focused tests,
    and required evidence/context updates only.
16. `npm test`, `npm run typecheck`, `npm run bandit -- validate`,
    `npm run bandit -- qwen-review BANDIT-006` or the final chosen command,
    `npm run bandit -- land-check BANDIT-006`, and `git diff --check` pass
    before landing, unless a runtime-specific command is recorded as a
    bootstrap gap with replacement evidence.

## Test Plan

- Start with RED evidence before production implementation.
- Add focused tests, likely `test/local-qwen-review.test.mjs`, using temp
  repos through `test/helpers/bandit-cli.mjs`.
- Use a fixture reviewer command or subprocess double so tests are fast,
  repeatable, and independent of the actual local Qwen installation.
- Cover reviewer profile validation:
  - valid seeded local Qwen profile passes;
  - missing profile fails;
  - missing required fields fail;
  - unsupported runtime or command shape fails;
  - missing prompt, timeout, permissions, output contract, or unavailable
    behavior fails.
- Cover local Qwen review evidence validation:
  - valid current evidence passes;
  - wrong work item fails;
  - missing source head fails;
  - unsupported verdict values fail;
  - unresolved operator input fails;
  - pass without executable evidence fails;
  - explicit unavailable-runtime `bootstrap_gap` requires replacement
    evidence.
- Cover command behavior:
  - missing work item argument exits nonzero with usage;
  - unknown work item exits nonzero;
  - missing or malformed profile exits nonzero;
  - unavailable runtime exits nonzero or records explicit bootstrap gap as
    specified by the contract;
  - nonzero reviewer exit exits nonzero;
  - inconclusive reviewer output exits nonzero;
  - fixture pass writes or reports local Qwen review evidence with source head;
  - stale local Qwen evidence is not accepted as current.
- Cover `land-check` integration:
  - current local Qwen pass satisfies the local Qwen gate;
  - stale, blocked, inconclusive, unavailable, or malformed local Qwen evidence
    blocks `safe-to-land`;
  - historical work items without local Qwen artifacts remain compatible unless
    they opt into the new contract.
- Keep assertions on behavior, refusal messages, source-of-truth boundaries,
  and stable fields rather than incidental Markdown formatting.
- Run focused RED tests first and record expected failures in
  `docs/work/BANDIT-006/red-evidence.md`.

## CLEAN_CODE.md Read Evidence

- Codex PM read `CLEAN_CODE.md` on 2026-05-24 before creating this slice brief.
- The spec and acceptance criteria make clean-code compliance evaluable through
  small surface area, explicit reviewer state, no hidden authority, readable
  subprocess and artifact boundaries, failure clarity, locality, testable
  behavior, and preserved role boundaries.

## Clean-Code Landing Rubric

Before landing, Codex PM must evaluate:

| Rubric Item | Required Evidence |
|---|---|
| Spec alignment | Implementation maps directly to this brief's acceptance criteria without redefining reviewer, UAT, landing, or escalation policy. |
| Small surface area | Diff contains only the local Qwen profile/evidence contract, one narrow command, validation, focused tests, evidence, and required context updates. |
| Simple design | Uses repo-native profile and evidence artifacts with direct validation; no database, generated schema framework, broad policy engine, reviewer repair loop, or cockpit authority. |
| Explicit state | Reviewer profile, source head, run status, findings, bootstrap gaps, and PM dispositions live in named repo artifacts. |
| No hidden authority | CLI checks read repo artifacts, configured command/profile data, and Git head; Qwen session state, chat, UI, cache, or generated index state does not own review readiness. |
| Testable behavior | Profile parsing, evidence parsing, subprocess failure paths, unavailable-runtime behavior, stale evidence, and land-check integration are covered by tests or explicit bootstrap gaps. |
| Readable flow | Reviewer profile loading, command execution, output interpretation, evidence writing, and land-check consumption have clear boundaries. |
| Locality | Local Qwen behavior stays near reviewer/profile state helpers and the narrow command; unrelated refactors are excluded. |
| Failure clarity | Missing, malformed, unavailable, nonzero, timed out, inconclusive, stale, blocked, or unresolved evidence fails closed with clear messages. |
| No role erosion | Local Qwen is a read-only adversarial reviewer; it does not become Writer, Landing Agent, operator, or hidden product decision maker. |
| Improvement capture | Any material workflow lesson becomes a tagged improvement chore, smell catalog update, cross-model tension entry, or explicit no-action decision. |

## Stage-Rubric Checklist

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify Phase 4, active work `BANDIT-006`, and RED evidence as the next action after this brief. `docs/work/BANDIT-005/landing-action.md` records landed commit `17be6d6775f5c8f00b5130f5569c79f97a94751b` before this slice became active. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief records goal, scope, out of scope, acceptance criteria, test plan, clean-code evidence, bootstrap gaps, expected files, implementation order, routing decision, smell triggers, escalation plan, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pass` | `docs/work/BANDIT-006/red-evidence.md` records 20 focused RED tests, 19 expected failures before implementation, acceptance-criteria mapping, and Test Writer-owned assertions. |
| Stage 3: Implementation Clean-Code Rubric | `not_applicable` | No implementation code in this step. |
| Stage 4: Review And Cross-Model Gates | `bootstrap_gap` | CodeRabbit, final escalated reviewer, and Landing Agent gates still do not exist. This slice is scoped to reduce the local Qwen bootstrap gap. |
| Stage 5: Landing And UAT | `bootstrap_gap` | Landing Agent and CLI-owned UAT artifacts do not exist yet; this is workflow infrastructure, not a feature UAT step. |
| Stage 6: Retrospective And Improvement Capture | `not_applicable` | Required after the implementation slice completes. |

## Bootstrap Gaps

- No repo-native local Qwen reviewer profile exists yet.
- No local Qwen review evidence artifact contract exists yet.
- No Bandit CLI command can run or record local Qwen baseline review yet.
- `land-check` can currently accept local Qwen as an explicit
  `bootstrap_gap`; this slice must narrow that allowance for new-contract local
  Qwen evidence.
- CodeRabbit pre-landing loop is not automated yet.
- Escalated adversarial review gate is not implemented yet.
- Landing Agent is not implemented yet.
- CLI-owned UAT artifact is not implemented yet.
- Heartbeat chore-agent is not implemented yet.
- Workflow Cockpit is not implemented yet.

Local environment check on 2026-05-24 found `/opt/homebrew/bin/qwen` version
`0.16.0`, `/opt/homebrew/bin/ollama`, and installed Ollama Qwen-family models.
That does not create repo-native reviewer authority by itself. The
implementation must use only recorded profile/configuration and must fail
closed or record a precise bootstrap gap if the configured runtime is not
usable.

These are accepted bootstrap gaps for this work item only if replacement manual
evidence is recorded honestly and the final verdict does not collapse missing
review into a pass.

## Routing Decision

decision_kind: reviewer
selected_route: local-qwen-baseline
applicable_smell_ids:
  - BANDIT-SMELL-ADVERSARIAL-REVIEW
  - BANDIT-SMELL-EVIDENCE-FRESHNESS
  - BANDIT-SMELL-PARSER-VALIDATOR
  - BANDIT-SMELL-MISSING-COVERAGE
  - BANDIT-SMELL-MALFORMED-EVIDENCE
  - BANDIT-SMELL-POLICY-DRIFT
  - BANDIT-SMELL-UNAVAILABLE-AGENT
evidence_used:
  - AGENTS.md requires local Qwen as the baseline adversarial reviewer for every PR.
  - CONTEXT.md defines Local Qwen Baseline Reviewer and manager-owned routing.
  - ROADMAP.md identifies Phase 4 local Qwen review state as the next gap.
  - docs/work/BANDIT-005/retrospective.md says the next Phase 4 work item should reduce the local Qwen gate gap.
  - Local command check found qwen 0.16.0 and Ollama Qwen-family models, but no repo-native profile or command exists.
operator_input_status: none_required
bootstrap_gaps:
  - Exact profile implementation does not exist yet.
  - Final CodeRabbit, escalated reviewer, and Landing Agent gates remain unavailable.
escalation_outcome: Implement the baseline local Qwen route first; stronger or second reviewers remain out of scope unless later smell-trigger evidence requires recorded escalation.
final_decision: Proceed with TDD for a repo-native local Qwen baseline reviewer profile, evidence contract, narrow CLI command, and land-check integration without asking the operator for routine reviewer routing.

## Required Operator Input

None before RED evidence or implementation starts.

Repo artifacts already define the product direction for this slice: Local Qwen
is the default no-paid-key adversarial reviewer, Codex PM owns routine
reviewer routing, and missing product direction, UAT, policy changes, business
tradeoffs, or explicit cost/risk overrides must be surfaced only if they
become relevant.

## Expected Files

Likely implementation files:

- `.bandit/reviewers/local-qwen.json`
- `docs/templates/local-qwen-review.md`
- `src/commands/qwen-review.ts`
- `src/cli.ts`
- `src/commands/validate.ts`
- `src/commands/land-check.ts`
- `src/state/reviewer-profiles.ts`
- `src/state/local-qwen-review.ts`
- `src/state/git.ts`
- focused test files under `test/`

Likely evidence files:

- `docs/work/BANDIT-006/red-evidence.md`
- `docs/work/BANDIT-006/implementation-evidence.md`
- `docs/work/BANDIT-006/local-qwen-review.md`
- `docs/work/BANDIT-006/review-evidence.md`
- `docs/work/BANDIT-006/routing-decision.md`
- `docs/work/BANDIT-006/landing-verdict.md`
- `docs/work/BANDIT-006/landing-action.md`
- `docs/work/BANDIT-006/retrospective.md`

Context files expected to change:

- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`

The final implementation may adjust file names if tests and local structure
prove a simpler pattern, but it must preserve this brief's acceptance criteria
and source-of-truth boundaries.

## First Implementation Order

1. Create `docs/work/BANDIT-006/red-evidence.md` mapping acceptance criteria to
   focused tests.
2. Add failing tests for local Qwen profile validation and malformed profile
   refusal paths.
3. Add failing tests for local Qwen review evidence validation and wrong work
   item, missing source head, unsupported verdict, unresolved operator input,
   and unavailable-runtime refusal paths.
4. Add failing tests for the local Qwen command usage, unknown work item,
   missing/malformed profile, unavailable runtime, nonzero reviewer exit,
   inconclusive output, successful fixture output, and stale evidence.
5. Add failing tests for `land-check` integration with current local Qwen pass,
   stale local Qwen evidence, blocked local Qwen evidence, and historical
   compatibility.
6. Add the repo-native local Qwen reviewer profile seed.
7. Add the local Qwen review evidence template or contract.
8. Add small profile and local-review evidence parser/validator helpers.
9. Wire `bandit validate` to validate the profile and any present local Qwen
   review evidence.
10. Wire the narrow local Qwen command to execute only the configured read-only
    reviewer profile and record or report evidence.
11. Wire `land-check` to consume current local Qwen evidence without weakening
    existing CodeRabbit, escalated review, clean-code, test, UAT, or source
    drift checks.
12. Create `docs/work/BANDIT-006/routing-decision.md` using the existing
    routing decision contract if the new gate needs a separate durable routing
    artifact before landing.
13. Run focused tests and confirm RED-to-green behavior.
14. Run `npm test`, `npm run typecheck`, `npm run bandit -- validate`, the
    final local Qwen command for `BANDIT-006`, `npm run bandit -- land-check
    BANDIT-006`, and `git diff --check`.
15. Produce implementation evidence, local Qwen review evidence, clean-code
    check, review evidence, landing verdict, retrospective, landing action
    evidence, and updated context.

## Smell Triggers And Escalation Plan

- `BANDIT-SMELL-ADVERSARIAL-REVIEW`: blocker if the local Qwen gate is omitted,
  optional, or treated as passing without current evidence.
- `BANDIT-SMELL-EVIDENCE-FRESHNESS`: blocker if stale local Qwen evidence can
  satisfy landing.
- `BANDIT-SMELL-PARSER-VALIDATOR`: blocker because this slice adds profile and
  evidence parsers, validators, and refusal paths.
- `BANDIT-SMELL-MISSING-COVERAGE`: blocker if reviewer profile, evidence,
  subprocess, stale evidence, or land-check paths lack tests or explicit
  bootstrap gaps.
- `BANDIT-SMELL-MALFORMED-EVIDENCE`: blocker if malformed local Qwen evidence
  is accepted.
- `BANDIT-SMELL-POLICY-DRIFT`: blocker if the profile, command, templates, or
  evidence diverge from `AGENTS.md`, `CONTEXT.md`, `CLEAN_CODE.md`, stage
  rubrics, or `BANDIT-005` landing-gate contracts.
- `BANDIT-SMELL-UNAVAILABLE-AGENT`: bootstrap gap only when the configured
  local runtime is genuinely unavailable and replacement evidence is recorded.
- `BANDIT-SMELL-LARGE-SCOPE`: blocker if this slice expands into CodeRabbit,
  paid escalation, UAT, Landing Agent, cockpit, auto-repair, or PR merge work.
- `BANDIT-SMELL-MULTI-PHASE-ORCHESTRATION`: blocker if one large path mixes
  profile parsing, subprocess execution, output interpretation, artifact
  writing, land-check, and landing decisions without clear boundaries.

Codex PM owns these routing and escalation decisions. No operator input is
needed for routine reviewer selection, model routing, or code-safety judgment
in this slice.
