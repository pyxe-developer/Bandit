# BANDIT-100 Stage 3 Claude Implementation Dispatch

work_item: BANDIT-100
stage: Stage 3 Implementation
dispatcher: work_item_pm
implementation_writer: claude_sonnet_4_6
model_family: claude
created_at: 2026-06-12T17:00:00Z

## Mission

Implement the approved Stage 3 scope for `BANDIT-100`: a versioned
project-profile contract and identity-clean `bandit init --profile <file>` path,
plus configured-prefix PRD parsing in `draft-work`.

## Required Reads

Read these before editing:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-100/brief.md`
- `docs/work/BANDIT-100/orchestration-plan.md`
- `docs/work/BANDIT-100/red-evidence.md`
- `src/commands/init.ts`
- `src/commands/draft-work.ts`
- `src/cli.ts`
- `src/state/config.ts`

## Test Writer-Owned Surfaces: Do Not Edit

Codex authored the Stage 2 RED tests and evidence. You must not edit, format,
regenerate, or mechanically adjust:

- `test/init.test.mjs`
- `test/draft-work.test.mjs`
- `docs/work/BANDIT-100/red-evidence.md`
- any test helper, fixture, acceptance mapping, formation evidence, review
  evidence, landing evidence, UAT evidence, retrospective evidence,
  roadmap/status file, or PRD/source authority file.

If a test seems wrong, stop and write the concern in `docs/work/BANDIT-100/writer-report.md`
without editing the test.

## Allowed Implementation Surfaces

Use the smallest implementation that satisfies the approved contract. Expected
source/doc surfaces include:

- `src/commands/init.ts`
- `src/commands/draft-work.ts`
- `src/cli.ts`
- `src/state/config.ts`
- a new focused profile module such as `src/state/project-profile.ts`
- `docs/templates/project-profile.md`
- profile interview guidance if needed to satisfy the brief
- `docs/work/BANDIT-100/writer-report.md`
- `docs/work/BANDIT-100/implementation-evidence.md`

Do not add dependencies, lockfile changes, public npm publish automation,
credential handling, hosted services, telemetry, automatic self-update,
external repo mutation, installed global skill mutation, automation prompt
mutation, merge/push/deploy authority, Trust Verifier cutover, old-gate
replacement/wrapping, local API work, State Index work, guarded browser action
execution, `BANDIT-101` through `BANDIT-103`, V0 trial work, or unrelated
Phase 8 scope.

## Expected Behavior

- `bandit init --profile <file>` reads a JSON profile, validates it, and fails
  malformed profiles with diagnostics naming the offending field.
- The profile supports at least:
  - `contract_version: 1`
  - `name`
  - `work_item_prefix`
  - `starter_work_item`
  - `roadmap_seed`
  - `reviewers`
  - `policy_tiers`
  - `harnesses`
- A valid ACME profile writes `.bandit/config.toml` with
  `work_item_prefix = "ACME"`, creates `docs/work/ACME-001/brief.md`, and keeps
  current context, roadmap, and status aligned to ACME identity.
- ACME profile scaffolding must not emit `BANDIT-001`,
  `Phase 0 - Consumer Onboarding`, `Bandit's active work history`, or
  `internal roadmap queue` in the starter routing/work artifacts asserted by
  RED evidence.
- `bandit validate` passes in a fresh profile-initialized repo.
- `draft-work` accepts `# ACME-PRD-1:` when `.bandit/config.toml` has
  `work_item_prefix = "ACME"`.
- `draft-work` still accepts `BANDIT-PRD-*` source documents for compatibility
  and allocates new work item IDs using the configured work item prefix.
- Existing unprofiled `bandit init` behavior remains compatible with the
  current test suite.

## Verification Commands

Run focused verification first:

```sh
node --test test/init.test.mjs
node --test test/draft-work.test.mjs
npm run typecheck
```

If those pass, run:

```sh
npm test
npm run bandit -- validate
git diff --check
```

If full-suite verification is too slow for the 20-minute window, record exactly
what ran and what remains in `implementation-evidence.md`.

## Required Output Artifacts

Create:

- `docs/work/BANDIT-100/writer-report.md`
- `docs/work/BANDIT-100/implementation-evidence.md`

Both artifacts must record:

- `CLEAN_CODE.md` read evidence
- model family: `claude`
- source files changed
- verification commands and results
- confirmation that no Test Writer-owned surface was edited
- any unresolved concern or bootstrap gap

## Final Reminder

Do not edit tests or RED evidence. The Stage 3 Writer owns implementation only.
