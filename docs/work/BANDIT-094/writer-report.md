# BANDIT-094 Stage 3 MiniMax Repair Writer Report

work_item: BANDIT-094
stage: Stage 3 Implementation Writer (MiniMax repair dispatch)
dispatch_packet: docs/work/BANDIT-094/stage3-minimax-repair-dispatch.md
prior_dispatch: docs/work/BANDIT-094/stage3-minimax-dispatch.md
writer_model: MiniMax-M3 (headless pi)
timestamp: 2026-06-10
verdict: safe-to-land

## Dispatch Context

Codex PM routed a bounded repair to the MiniMax fallback after the first
MiniMax Stage 3 attempt produced partial source edits but timed out before
Stage 3 writer evidence and left the focused create-controller test suite
failing. Claude Sonnet 4.6 had already been attempted first and recorded in
`docs/work/BANDIT-094/stage3-claude-attempt.md` (timeout after 20 minutes
with no source edits).

The repair writer was constrained to source-only edits and Stage 3 writer
evidence. The repair touched the three concrete bugs the dispatch named
and made no other changes. Test files, test helpers, fixtures, RED
evidence, acceptance mappings, formation evidence, review evidence,
landing evidence, retrospective evidence, roadmap/current-context/status
files, and PRD/source authority files remained off-limits.

## Bugs Repaired

1. **`src/state/work-create-controller.ts` Local Qwen route message
   syntax error.** The previous attempt had unescaped backticks around
   `.bandit/reviewers/local-qwen.json` inside a multi-line template
   literal, so the TypeScript parser split the string into three
   template-literal segments and evaluated `.bandit/reviewers/local`
   as a property-access / arithmetic chain. At runtime this raised
   `ReferenceError: reviewers is not defined` and the test surfaced
   the raw stack trace as `stderr`. The repair rewrites the diagnostic
   as a clean two-line template literal concatenation without inline
   backticks and rewords the message so it satisfies the test's
   `Local Qwen.*authorized route` and `.bandit/reviewers/local-qwen.json`
   matchers. The phrasing is "Local Qwen authorized route is missing
   or invalid: <detail>. Refused to create controller without
   .bandit/reviewers/local-qwen.json pointing at node
   bin/omlx-chat-completions.mjs."

2. **`src/state/work-create-controller.ts` operator-input section
   matcher returned the first match instead of the most recent.** The
   previous attempt used a non-global regex with a non-greedy body
   that captured the first `## Required Operator Input` section
   regardless of overrides. The repair switches to a global regex and
   returns the last match, so a `CURRENT_CONTEXT.md` file that
   appends a second `## Required Operator Input` section to override
   the original `none_required.` value is honored. The change is
   scoped to the work-create-controller's own
   `extractSectionContent` helper; the formation-gate's separately
   defined helper is intentionally not touched.

3. **`createWorkItem` did not honor an explicit work item id.** The
   previous attempt passed the source-spec work item id to
   `createWorkItem` only via its `args` string, but `createWorkItem`
   always invoked `allocateNextWorkItemId`, which scans `docs/work`
   and returns the next unused sequential id. For the
   `BANDIT-094-repo-pm-create-controller-and-prompt-contract.json`
   spec the allocator returned `BANDIT-001` because the only existing
   work dir was `BANDIT-093`. The repair adds an `options: { explicitId? }`
   parameter to `createWorkItem` (defaulting to `{}` so the public
   CLI signature is unchanged) plus a `requireExplicitWorkItemId`
   helper that validates the explicit id against the configured
   `${workItemPrefix}-NNN` format. The repair then passes
   `{ explicitId: explicitSource.workItemId }` from the
   `work-create-controller` state, so a spec at
   `docs/specs/BANDIT-094-...json` creates the work item directory
   `docs/work/BANDIT-094/` instead of `docs/work/BANDIT-001/`.

No other source files required changes. The pre-existing surface
already implemented and used by the prior MiniMax attempt satisfies
the rest of the brief and continues to pass all focused tests:

- `docs/templates/repo-pm-formation-prompt.md` — Bandit-native Repo
  PM prompt template with the required sections.
- `docs/templates/work-item-pm-orchestrator-prompt.md` — Work Item
  PM prompt template, untouched.
- `.bandit/policy/orchestrator-prompts.json` — orchestrator prompts
  policy with role-specific required sections, required gates,
  `forbidden_foreign_sources`, and `local_qwen_route` block, untouched.
- `src/state/orchestrator-prompts.ts` — role-aware prompt-contract
  validation, foreign-source leakage checks, and authorized
  Local Qwen routing checks, untouched.
- `src/commands/repo-pm.ts` — `create-work-item`, `approve-formation`,
  and `create-controller` dispatch, untouched.
- `src/commands/work-create-controller.ts` — `--json` flag handling
  and stdout/stderr/exit-code shaping, untouched.
- `src/commands/init.ts` — wiring for the new Repo PM prompt
  template and orchestrator prompts policy, untouched.
- `src/cli.ts` — role-aware command dispatch, untouched.

## Files Changed

- `src/state/work-create-controller.ts` — repaired the Local Qwen
  route diagnostic (unescaped backticks removed) and switched
  `extractSectionContent` to return the last match so an
  operator-input override section is honored.
- `src/commands/work-item-create.ts` — added the `options: { explicitId? }`
  parameter to `createWorkItem` plus the `requireExplicitWorkItemId`
  helper. The public CLI surface (`bandit work-item create
  <spec-path>`) is unchanged because the parameter defaults to `{}`.

## Tests / Commands Run

- `node --test test/orchestrator-prompts.test.mjs test/work-create-controller.test.mjs`
  → 9/9 pass (Work Item PM + Repo PM prompt acceptance, missing
  section refusal, canonical-authority refusal, foreign Repo PM
  prompt leakage refusal, next-roadmap-authorized source spec
  creation, idempotent already-formed behavior, missing source spec
  refusal, operator-owned input refusal, missing Local Qwen
  authorized route refusal).
- `npm run typecheck` → pass, no diagnostics emitted.
- `npm test` → 624/624 pass (full suite remains green).
- `node ./bin/bandit.mjs validate` → `Bandit state is valid.`
- `git diff --check` → clean (no whitespace or line-ending issues).

## Clean-Code Posture

- The repaired `extractSectionContent` is a single, well-named helper
  that returns the last `## <Title>` match. The shift from first
  match to last match is a small, named change that respects the
  brief's "if operator input is required, refuse before allocation"
  requirement and avoids introducing a parallel "find last section"
  helper alongside the existing one.
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

- `test/orchestrator-prompts.test.mjs` or any `test/**` file.
- `test/helpers/**` files.
- `docs/work/BANDIT-094/red-evidence.md` or any
  `docs/work/BANDIT-094/coordination-log.jsonl` entry.
- `docs/work/BANDIT-094/brief.md`,
  `docs/work/BANDIT-094/orchestration-plan.md`, or any prior
  formation/review/landing/retrospective artifact.
- `docs/work/BANDIT-094/stage3-claude-attempt.md` or
  `docs/work/BANDIT-094/stage3-minimax-dispatch.md` (read-only
  references).
- `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, or
  root `STATUS.md`.
- `.bandit/work-intake-ledger.json` or other intake / bootstrap-gap
  ledgers.
- Package metadata, lockfiles, dependencies, CI/release workflows,
  hosted services, telemetry, merge/push/deploy behavior, or
  unrelated Phase 8 work.

The only writes performed by this repair were:

- The targeted diagnostic and section-matcher repair in
  `src/state/work-create-controller.ts`.
- The targeted `explicitId` parameter addition and helper in
  `src/commands/work-item-create.ts`.
- This writer-report.md plus
  `docs/work/BANDIT-094/implementation-evidence.md`.

## Verdict

`safe-to-land` for the source-side Stage 3 evidence. The three named
bugs are repaired; the focused prompt-contract and create-controller
test suites pass; the strict TypeScript build is clean; the full test
suite remains green; the Bandit validator is green; and `git diff
--check` is clean. Stage 4 review (Local Qwen, CodeRabbit or honest
provider-timeout/refusal evidence, aggregate review, review-subject
hash, risk classification, supply chain), Stage 5 landing verdict and
action, and Stage 6 retrospective remain the responsibility of their
owning agents.
