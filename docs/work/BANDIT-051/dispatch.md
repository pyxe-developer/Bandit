# BANDIT-051 Writer Dispatch

work_item: BANDIT-051
codex_pm: Codex
claude_writer: Claude Process Adapter
branch: main
base_sha: 5678957168de8a0375760d72778b09d122e94c1f
dispatch_status: ready_for_writer

## Required First Reads

- AGENTS.md
- CONTEXT.md
- CLEAN_CODE.md
- docs/verification/STAGE_RUBRICS.md
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- docs/work/BANDIT-051/brief.md
- docs/work/BANDIT-051/red-evidence.md
- docs/specs/BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT.json
- docs/specs/BANDIT-051-red-evidence.json
- docs/decisions/2026-05-27-worktree-bootstrap-contract.md
- test/worktree-bootstrap.test.mjs

## Mission

Implement only the Stage 3 production repair for BANDIT-051 Worktree Bootstrap
Contract. Codex authored the Stage 2 RED evidence, so this Stage 3
implementation must be authored by Claude through this Process Adapter handoff.

Make `node --test test/worktree-bootstrap.test.mjs` pass by adding the narrow
`bandit worktree-bootstrap validate --json` command. The command must validate
the CLI-readable Worktree Bootstrap Contract policy/evidence surface, refuse
secret-copy entries by default, require bootstrap validation command wiring
before runnable status, and preserve the rule that bootstrap validation is
evidence only, not claim authority.

## RED Command

```sh
node --test test/worktree-bootstrap.test.mjs
```

Current expected RED state from Stage 2: 3 tests, 0 pass, 3 fail. The failing
tests show `Unknown command: worktree-bootstrap`, so no validation surface,
secret-copy refusal, or bootstrap-validation-command enforcement exists yet.

## Editable Production And Evidence Paths

You may edit production implementation and Stage 3 implementation evidence
needed for this work item, limited to:

- docs/specs/BANDIT-051-implementation-evidence.json
- docs/work/BANDIT-051/implementation-evidence.md
- docs/work/BANDIT-051/writer-report.md
- docs/templates/worktree-bootstrap.md
- .bandit/policy/worktree-bootstrap.json
- src/state/worktree-bootstrap.ts
- src/commands/worktree-bootstrap.ts
- src/commands/validate.ts
- src/cli.ts

If a necessary production path is not listed, stop and record the needed path
and rationale in `docs/work/BANDIT-051/writer-report.md` instead of widening
the diff silently.

## Forbidden Writer Surfaces

Do not create, edit, delete, regenerate, format, or mechanically adjust:

- test/**
- test/helpers/**
- docs/work/BANDIT-051/red-evidence.md
- docs/specs/BANDIT-051-red-evidence.json
- docs/work/BANDIT-051/brief.md
- docs/specs/BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT.json
- docs/work/BANDIT-051/dispatch.md
- docs/decisions/2026-05-27-worktree-bootstrap-contract.md
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- package.json
- package-lock.json
- acceptance mappings or Stage 2 RED evidence for BANDIT-051

Any test-owned surface touch invalidates the whole Stage 3 attempt. If you
believe a RED test or acceptance mapping is wrong, stop and write a test-change
request in `docs/work/BANDIT-051/writer-report.md`. Do not repair the test.

## Implementation Boundaries

- Add `bandit worktree-bootstrap validate --json`.
- Validate `.bandit/policy/worktree-bootstrap.json` and each referenced
  evidence artifact from repo-local files.
- Return structured JSON on success with `status: "pass"`, `policy`, `template`,
  `decisions`, and `evidence` fields matching Stage 2 expectations.
- Fail closed with clear stderr diagnostics and non-zero exit when required
  policy/evidence fields are missing, malformed, or contradictory.
- Refuse any `allowed_copy_entries` item classified as `secret_material` unless
  existing operator-supervised policy explicitly authorizes a narrower exception;
  the current accepted policy uses `secret_copy_exception: "none"`.
- Treat environment requirements as references only; do not record or require
  secret values in policy, evidence, stdout, stderr, or generated artifacts.
- Require `bootstrap_commands.validation` before any worktree can be treated as
  runnable.
- Preserve the Git Mutation Serializer boundary: do not add direct worktree
  add, remove, prune, lock, unlock, branch/ref maintenance, or packed-refs
  behavior.
- Preserve CAS Claim Authority: do not treat `.bandit` files, filesystem locks,
  worktree markers, cockpit status, or bootstrap validation output as writable
  claim authority.
- Keep cockpit views, worker prompts, caches, and generated projections
  non-canonical.
- Do not implement event-driven scheduler execution, full worktree lifecycle
  enablement, true parallel writable workstreams, claim lease creation or
  release, claim authority changes, work-surface reservations, automatic
  merge/push/deploy behavior, product UAT approval, cockpit UI/server/API work,
  state-index persistence, actor identity policy, PR/CI workflow execution,
  live reviewer routing changes, paid reviewer routes, external service
  integration, installed global skill edits, dependency or lockfile changes, or
  unrelated Phase 8 work.

## Verification Commands

Run the focused RED/GREEN command first:

```sh
node --test test/worktree-bootstrap.test.mjs
```

Then run the relevant Stage 3 checks for touched command, policy, and validation
surfaces:

```sh
npm run typecheck
npm run bandit -- validate
npm run bandit -- gaps list
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
npm run bandit -- supply-chain-gate validate --json
npm run bandit -- risk-classification validate --json
npm run bandit -- input-quarantine validate --json
npm run bandit -- operator-boundary validate --json
npm run bandit -- coordination-authority validate --json
```

Run `npm test` if the implementation touches shared command routing,
validators, artifact renderers, work item parsing, templates, bootstrap gaps,
risk classification, supply-chain gates, claim authority, git mutation policy,
cockpit status, or policy validation beyond focused worktree-bootstrap
behavior. Always run:

```sh
git diff --check
```

## Required Writer Report

Create `docs/work/BANDIT-051/writer-report.md` with:

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
