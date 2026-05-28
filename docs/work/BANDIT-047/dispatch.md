# BANDIT-047 Writer Dispatch

work_item: BANDIT-047
codex_pm: Codex
claude_writer: Claude Process Adapter
branch: main
base_sha: d5f83e6a3a23645c89053ebb9192c4bc79afcbd0
dispatch_status: ready_for_writer

## Required First Reads

- AGENTS.md
- CONTEXT.md
- CLEAN_CODE.md
- docs/verification/STAGE_RUBRICS.md
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- docs/work/BANDIT-047/brief.md
- docs/work/BANDIT-047/red-evidence.md
- docs/specs/BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION.json
- docs/specs/BANDIT-047-red-evidence.json
- test/model-family-separation.test.mjs

## Mission

Implement only the Stage 3 production repair for BANDIT-047 Bootstrap
Model-Family Separation. Codex authored the Stage 2 RED evidence, so this
Stage 3 implementation must be authored by Claude through this Process Adapter
handoff.

Make `node --test test/model-family-separation.test.mjs` pass by adding
repo-native model-family separation policy, template, evidence validation, and
Bandit validation wiring. Preserve the Bootstrap Orchestration Boundary: this
is artifact and diff-gate enforcement around Process Adapter runs, not live
true-agent orchestration.

## RED Command

```sh
node --test test/model-family-separation.test.mjs
```

Current expected RED state from Stage 2: 10 tests, 1 pass, 9 fail. The failing
tests show that `bandit validate` currently accepts missing model-family policy,
missing model-family template, missing policy-registered evidence, missing
Stage 2 ownership fields, same-family RED/GREEN routing, non-Claude bootstrap
Writer routing, Stage 3 Writer test-surface edits, partial repair after
contaminated Writer attempts, and Claude self-escalation.

## Editable Production And Evidence Paths

You may edit production implementation and Stage 3 implementation evidence
needed for this work item, limited to:

- .bandit/policy/model-family-separation.json
- docs/templates/model-family-separation.md
- docs/model-family-separation/BANDIT-047-model-family-separation.json
- docs/specs/BANDIT-047-implementation-evidence.json
- docs/work/BANDIT-047/implementation-evidence.md
- docs/work/BANDIT-047/writer-report.md
- src/state/model-family-separation.ts
- src/state/templates.ts
- src/commands/validate.ts
- src/commands/cockpit.ts
- src/commands/land-check.ts
- src/cli.ts
- src/state/paths.ts
- src/commands/init.ts

If a necessary production path is not listed, stop and record the needed path
and rationale in docs/work/BANDIT-047/writer-report.md instead of widening the
diff silently.

## Forbidden Writer Surfaces

Do not create, edit, delete, regenerate, format, or mechanically adjust:

- test/**
- test/helpers/**
- docs/work/BANDIT-047/red-evidence.md
- docs/specs/BANDIT-047-red-evidence.json
- docs/work/BANDIT-047/brief.md
- docs/specs/BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION.json
- docs/work/BANDIT-047/dispatch.md
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- acceptance mappings or Stage 2 RED evidence for BANDIT-047

Any test-owned surface touch invalidates the whole Stage 3 attempt. If you
believe a RED test or acceptance mapping is wrong, stop and write a test-change
request in docs/work/BANDIT-047/writer-report.md. Do not repair the test.

## Implementation Boundaries

- Enforce Bootstrap Model-Family Separation for policy-registered work-item
  decisions.
- Require the committed model-family policy and template during `bandit
  validate`.
- Validate model-family evidence records with explicit Stage 2 Test Writer
  ownership fields and Stage 3 zero test-edit authority.
- Reject same-family RED and Stage 3 implementation when Codex authored or
  materially edited RED tests.
- During bootstrap, require Claude through the Process Adapter path after
  Codex-authored or Codex-materially-edited RED evidence.
- Reject Stage 3 Writer touches to test-owned surfaces, including tests, test
  helpers, fixtures, RED evidence, and acceptance mappings.
- Require complete Stage 3 attempt invalidation and complete revert evidence
  before rerun after any Writer test-surface contamination.
- Route Claude-authored implementation escalation to Codex PM, not Claude.
- Keep cockpit status derived and non-canonical if you expose gate state there.
- Do not implement Focused Session Context Packets, Worktree Bootstrap Contract
  behavior, scheduler execution, worktree lifecycle enablement, local
  server/API mode, cockpit UI/server/API, state-index persistence, automatic
  merge/push/deploy, product UAT, actor identity policy, PR/CI workflow, live
  reviewer routing changes, paid reviewer routing, external services,
  dependency or lockfile changes, installed global skill edits, or later
  bootstrap gaps.

## Verification Commands

Run the focused RED/GREEN command first:

```sh
node --test test/model-family-separation.test.mjs
```

Then run the relevant Stage 3 checks for touched validator/template surfaces:

```sh
npm run typecheck
npm run bandit -- validate
```

Run `npm test` if the validator, template registry, command routing, cockpit,
or land-check changes have broad shared effects. Always run:

```sh
git diff --check
```

## Required Writer Report

Create docs/work/BANDIT-047/writer-report.md with:

- writer_identity: claude_process_adapter
- model_family: claude
- base_sha
- implementation summary
- exact files changed by the Writer
- confirmation that no forbidden test-owned surfaces were edited
- focused and broader verification commands run, with pass/fail results
- clean-code self-check notes
- any stop condition, test-change request, or unresolved risk

Do not commit. Leave the working tree for Codex PM review.
