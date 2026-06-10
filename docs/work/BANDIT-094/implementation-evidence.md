# BANDIT-094 Stage 3 MiniMax Repair Implementation Evidence

work_item: BANDIT-094
stage: Stage 3 Implementation
writer_model: MiniMax-M3 (headless pi, repair dispatch)
dispatch_packet: docs/work/BANDIT-094/stage3-minimax-repair-dispatch.md
prior_dispatch: docs/work/BANDIT-094/stage3-minimax-dispatch.md
timestamp: 2026-06-10
verdict: pass_implementation_recorded

## Scope Of This Repair

The first MiniMax Stage 3 attempt produced partial source edits but
timed out before Stage 3 writer evidence and left the focused
create-controller test suite failing. Claude Sonnet 4.6 had already
been attempted first and recorded in
`docs/work/BANDIT-094/stage3-claude-attempt.md` (timeout after 20
minutes with no source edits). Per the orchestration plan, Stage 3
fell back to MiniMax-M3 through headless `pi`.

This repair addresses only the three concrete bugs the repair
dispatch named. It does not redesign the implementation, alter
public CLI surface, edit tests, edit RED evidence, edit formation or
review artifacts, edit roadmap/current-context/status files, or
introduce any Stage 2 / 3 / 4 / 5 / 6 evidence.

## Bugs Repaired

| # | Surface | Symptom | Fix |
| --- | --- | --- | --- |
| 1 | `src/state/work-create-controller.ts` Local Qwen route diagnostic | Unescaped backticks inside the multi-line template literal caused the parser to interpret `.bandit/reviewers/local-qwen.json` as a property-access / arithmetic chain; runtime raised `ReferenceError: reviewers is not defined` and the missing-Local-Qwen-route test saw only the raw stack trace. | Rewrote the diagnostic as a clean two-line template-literal concatenation. The new message reads "Local Qwen authorized route is missing or invalid: <detail>. Refused to create controller without .bandit/reviewers/local-qwen.json pointing at node bin/omlx-chat-completions.mjs." |
| 2 | `src/state/work-create-controller.ts` `extractSectionContent` | Non-global regex with non-greedy body returned the first `## Required Operator Input` section. When `CURRENT_CONTEXT.md` appended a second override section, the controller still saw `none_required.` and proceeded to allocation, so the operator-owned-input test failed at the allocation-mismatch assertion. | Switched the regex to global and returned the last match. The change is scoped to the work-create-controller's own helper; the formation-gate's separately defined helper is intentionally untouched. |
| 3 | `src/commands/work-item-create.ts` work item id allocation | `createWorkItem` always invoked `allocateNextWorkItemId`, which scans `docs/work` and returns the next sequential id. For the `BANDIT-094-...json` spec the allocator returned `BANDIT-001`, and the create-controller's id-match guard rejected it. The first create-controller test failed with "allocated work item id BANDIT-001 does not match source spec work item id BANDIT-094." | Added an optional `options: { explicitId?: string }` parameter to `createWorkItem` (defaulting to `{}` so the CLI signature is unchanged) plus a `requireExplicitWorkItemId` helper that validates the explicit id against the configured `${workItemPrefix}-NNN` format. The work-create-controller state now passes `{ explicitId: explicitSource.workItemId }` so the spec-derived id is honored. |

## Source Files Changed

- `src/state/work-create-controller.ts` — repaired the Local Qwen
  route diagnostic (unescaped backticks removed and message reworded
  for clarity) and switched `extractSectionContent` to return the
  last match so an operator-input override section is honored. No
  other behavior changed; `runRepoPmCreateController`,
  `handleCurrentTarget`, `handleNextTarget`,
  `findExplicitSourceSpec`, `appendBriefCreatedStepTransition`,
  `isCoordinationLogFormationApproved`, and the explicit-source id
  match guard are untouched.
- `src/commands/work-item-create.ts` — added the
  `options: { explicitId? }` parameter to `createWorkItem` plus
  the `requireExplicitWorkItemId` helper. The public CLI surface
  (`bandit work-item create <spec-path>`) is unchanged because the
  parameter defaults to `{}`. `allocateNextWorkItemId`,
  `planWorkItem`, `assertOutputPathIsFree`, and `writePlannedWorkItem`
  are untouched.

## Pre-Existing Surfaces (Not Repaired By This Dispatch)

The prior MiniMax attempt's pre-existing surfaces already satisfy
the brief and the focused tests, and were intentionally not modified
by this repair:

- `docs/templates/repo-pm-formation-prompt.md` — Bandit-native Repo
  PM prompt template with the required `Required Reads`, `Context
  And Boundary`, `Target Resolution`, `Formation Flow`, `Review
  Evidence`, `Operator Input Boundaries`, `Stop Conditions`, and
  `Forbidden Actions` sections.
- `docs/templates/work-item-pm-orchestrator-prompt.md` — Work Item
  PM prompt template, untouched.
- `.bandit/policy/orchestrator-prompts.json` — orchestrator prompts
  policy with role-specific `required_sections`, `required_gates`,
  `forbidden_foreign_sources`, and `local_qwen_route` blocks, untouched.
- `src/state/orchestrator-prompts.ts` — role-aware prompt-contract
  validation, foreign-source leakage checks, and authorized Local
  Qwen routing checks, untouched.
- `src/commands/repo-pm.ts` — `create-work-item`, `approve-formation`,
  and `create-controller` dispatch, untouched.
- `src/commands/work-create-controller.ts` — `--json` flag handling
  and stdout/stderr/exit-code shaping, untouched.
- `src/commands/init.ts` — wiring for the new Repo PM prompt
  template and orchestrator prompts policy, untouched.
- `src/cli.ts` — role-aware command dispatch, untouched.

## Commands Run And Results

| Command | Result |
| --- | --- |
| `node --test test/orchestrator-prompts.test.mjs test/work-create-controller.test.mjs` | pass, 9/9 |
| `npm run typecheck` | pass, no diagnostics emitted |
| `npm test` | pass, 624/624 |
| `node ./bin/bandit.mjs validate` | pass, `Bandit state is valid.` |
| `git diff --check` | clean |

The focused test suite covers every acceptance criterion that
`red-evidence.md` mapped to it. The full test suite stays green so
the source change did not regress shared prompt policy, roadmap
target resolution, validation, coordination, cockpit, or
session-context behavior. `bandit validate` and `git diff --check`
remain green.

## Acceptance Criteria Mapping

| Acceptance criterion | Evidence |
| --- | --- |
| `bandit repo-pm create-controller --json` resolves the roadmap/current-context target. | Test 5 (`Repo PM create controller creates the next roadmap-authorized source spec and stops before Stage 2`) calls the command and asserts `payload.status === "brief_created"`, `payload.target.relationship === "next"`, and `payload.target.title === "PRD-005.2 Repo PM Create Controller And Prompt Contract"`. |
| If operator input is required, refuse before allocation with an operator-owned input message. | Test 8 (`Repo PM create controller refuses operator-owned input instead of guessing`) appends a second `## Required Operator Input` section containing `Product direction required before creating this target.`, asserts exit code 1, and matches `/operator-owned input required/i` and `/Product direction required/i`. The fix to `extractSectionContent` makes the controller return the LAST section so the override is honored. |
| If `.bandit/reviewers/local-qwen.json` is missing or unauthorized, refuse before allocation with a Local Qwen authorized-route message. | Test 9 (`Repo PM create controller refuses missing authorized Local Qwen route`) calls the command without a Local Qwen profile, asserts exit code 1, and matches `/Local Qwen.*authorized route/i` and `/\.bandit\/reviewers\/local-qwen\.json/`. The fix removes the unescaped backticks so the diagnostic renders and the wording satisfies both matchers. |
| If the explicit source spec has work item id `BANDIT-094`, create that work item id rather than allocating `BANDIT-001`. | Test 5 (`Repo PM create controller creates the next roadmap-authorized source spec and stops before Stage 2`) writes `docs/specs/BANDIT-094-repo-pm-create-controller-and-prompt-contract.json`, asserts `payload.work_item === "BANDIT-094"`, asserts the `docs/work/BANDIT-094/brief.md` and `docs/work/BANDIT-094/coordination-log.jsonl` files exist, and asserts that `BANDIT-001` was not created. The new `options.explicitId` parameter passes the spec-derived id to `createWorkItem` so the allocation matches. |
| Stop at Stage 1 only. | Test 5 asserts `payload.stage2_started === false` and that `docs/work/BANDIT-094/orchestration-plan.md`, `red-evidence.md`, `implementation-evidence.md`, `review-evidence.md`, `landing-verdict.md`, and `retrospective.md` are NOT created. The coordination log entry's `state` is `brief_created` and does not contain `red_recorded`, `implementation_recorded`, `review_recorded`, `landed`, or `closed`. |
| Repo PM prompt contract validation accepts Work Item PM + Repo PM contracts, fails closed on missing sections, rejects canonical-authority claims, and rejects foreign Repo PM prompt leakage. | Tests 1, 2, 3, and 4 in `test/orchestrator-prompts.test.mjs` pass. The pre-existing orchestrator-prompts source surface already implements the required behavior and was not modified by this repair. |
| Idempotent already-formed behavior for an existing `formation_approved` work item. | Test 6 (`Repo PM create controller reports already formed work idempotently`) calls the command with a pre-formed BANDIT-094 coordination log, asserts `payload.status === "already_formed"`, asserts `payload.work_item === "BANDIT-094"`, asserts the next-action text points to Work Item PM plan-mode orchestration, and asserts that `BANDIT-095/brief.md` was NOT created. |
| Refuse when the roadmap target has no explicit source spec. | Test 7 (`Repo PM create controller refuses when roadmap target has no explicit source spec`) calls the command without a spec, asserts exit code 1, and matches `/missing explicit source spec/i` and `/BANDIT-PRD-005\.2|Repo PM Create Controller/i`. |

## Clean-Code Compliance

- The repaired `extractSectionContent` is a single, well-named
  helper that returns the last `## <Title>` match. The shift from
  first match to last match is a small, named change that respects
  the brief's "if operator input is required, refuse before
  allocation" requirement and avoids introducing a parallel
  "find last section" helper alongside the existing one.
- The repaired Local Qwen route diagnostic is one continuous
  diagnostic message, built with two clean template-literal
  segments. It no longer embeds raw JavaScript-evaluated token
  sequences inside a string. The phrasing names the authorized
  artifact and the authorized adapter so the failure is self-
  explanatory.
- The added `options: { explicitId? }` parameter to `createWorkItem`
  is an optional, opt-in capability. The default-empty-object
  pattern keeps the CLI-facing caller (`src/cli.ts`) and the
  `repo-pm create-work-item` caller working without change. The new
  `requireExplicitWorkItemId` helper is a single-purpose validator
  that mirrors the structure of the existing
  `allocateNextWorkItemId` helper.
- The controller's flow is unchanged: `runRepoPmCreateController`
  still resolves the target, fails closed on missing source
  spec, fails closed on operator-owned input, fails closed on a
  missing or unauthorized Local Qwen profile, and only then
  delegates to `createWorkItem` with the explicit id derived from
  the spec path. The "stop before Stage 2" behavior, the
  coordination-log `brief_created` evidence, and the
  already-formed idempotent branch are all preserved.

## Role Boundary Confirmation

The repair writer did not create, edit, delete, regenerate, format,
or mechanically adjust any of the following:

- `test/orchestrator-prompts.test.mjs`, `test/work-create-controller.test.mjs`,
  or any other `test/**` file or `test/helpers/**` file.
- `docs/work/BANDIT-094/red-evidence.md`,
  `docs/work/BANDIT-094/brief.md`,
  `docs/work/BANDIT-094/orchestration-plan.md`,
  `docs/work/BANDIT-094/qwen-formation-review.md`,
  `docs/work/BANDIT-094/coderabbit-formation-review.md`,
  `docs/work/BANDIT-094/formation-review.md`,
  `docs/work/BANDIT-094/coderabbit-review.md`,
  `docs/work/BANDIT-094/local-qwen-review.md`,
  `docs/work/BANDIT-094/review-evidence.md`,
  `docs/work/BANDIT-094/landing-verdict.md`,
  `docs/work/BANDIT-094/landing-action.md`,
  `docs/work/BANDIT-094/retrospective.md`,
  `docs/work/BANDIT-094/improvement-disposition.md`,
  `docs/work/BANDIT-094/stage3-claude-attempt.md`,
  `docs/work/BANDIT-094/stage3-minimax-dispatch.md`,
  `docs/work/BANDIT-094/stage3-dispatch.md`, or any entry in
  `docs/work/BANDIT-094/coordination-log.jsonl`.
- `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, or
  root `STATUS.md`.
- `.bandit/work-intake-ledger.json` or any other intake or
  bootstrap-gap ledger.
- Package metadata, lockfiles, dependencies, CI/release workflows,
  hosted services, telemetry, merge/push/deploy behavior, or
  unrelated Phase 8 work.

The only writes performed by this repair were:

- The targeted diagnostic and section-matcher repair in
  `src/state/work-create-controller.ts`.
- The targeted `explicitId` parameter addition and helper in
  `src/commands/work-item-create.ts`.
- This `docs/work/BANDIT-094/implementation-evidence.md` file and
  the matching `docs/work/BANDIT-094/writer-report.md` file.

## Verdict

`pass_implementation_recorded` for Stage 3. The three named bugs are
repaired; the focused prompt-contract and create-controller test
suites pass (9/9); the strict TypeScript build is clean; the full
test suite remains green (624/624); the Bandit validator is green;
and `git diff --check` is clean. Stage 4 review, Stage 5 landing,
and Stage 6 retrospective remain the responsibility of their owning
agents.
