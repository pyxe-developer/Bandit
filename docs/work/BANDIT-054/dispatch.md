# BANDIT-054 Claude Writer Dispatch

## Metadata

- Work item: `BANDIT-054` - Stage Capability Scope
- Codex PM: Codex
- Claude Writer: `claude-sonnet-4-6`
- Repository: `/Users/matthewflebbe/Bandit`
- Branch: `main`
- Base SHA: `9003891`
- Dispatch status: Stage 3 implementation requested

## Narrowed Process Adapter Instructions

This is a direct Stage 3 Writer dispatch. Do not perform meta-workflow
selection, subagent selection, workflow planning, or skill delegation. Do not
invoke `Task`, subagents, slash-command skills, or workflow-management tools.
Read the required files below, make the focused production implementation
edits allowed by this packet, run the required verification, write the required
Writer report, and stop.

If local runtime instructions force you to load a startup skill before work,
load only the minimum required startup skill, then immediately return to this
dispatch packet. Do not dispatch another agent or broaden the role taxonomy.

## Required First Reads

Read these before editing:

- `AGENTS.md`
- `CONTEXT.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-054/brief.md`
- `docs/work/BANDIT-054/red-evidence.md`
- `docs/specs/BANDIT-054-red-evidence.json`
- `test/stage-capability-scope.test.mjs`
- Existing command/state patterns in `src/cli.ts`, `src/commands/skill-lifecycle.ts`, `src/state/skill-lifecycle-contracts.ts`, `src/commands/work-item-create.ts`, `src/commands/validate.ts`, and related policy validators.

## Mission

Implement Stage 3 for `BANDIT-054` only: add a repo-native Stage Capability Scope validation surface and work-item integration so the focused RED tests pass.

The expected command is:

```sh
bandit stage-capability-scope validate --json
```

The implementation must validate `.bandit/policy/stage-capability-scope.json` fail-closed. It must accept complete stage declarations and reject missing required stage fields, missing lifecycle contract references for load-bearing required skills, and Stage 3 Writer authority over test-owned surfaces.

Also update work-item creation so specs require `stage_capability_scope` and generated briefs render a `## Stage Capability Scope` section with the policy path, stage IDs, authority roles, required skill references, and forbidden actions.

Keep optional soft budget bands as metadata only. Do not create provider-pricing evidence, spend-class approvals, paid routing policy, or abnormal-run continuation policy.

## Editable Production Paths

You may edit production implementation and Stage 3 evidence only:

- `src/cli.ts`
- `src/commands/stage-capability-scope.ts`
- `src/state/stage-capability-scope.ts`
- `src/commands/work-item-create.ts`
- `src/commands/validate.ts`
- `.bandit/policy/stage-capability-scope.json`
- `docs/templates/stage-capability-scope.md`
- `docs/work/BANDIT-054/implementation-evidence.md`
- `docs/work/BANDIT-054/writer-report.md`
- `docs/specs/BANDIT-054-implementation-evidence.json`

Use narrower edits if fewer files are enough. Preserve existing command, parser, validator, and Markdown rendering patterns.

## Forbidden Paths And Actions

Do not edit:

- `test/stage-capability-scope.test.mjs`
- `test/work-item-create.test.mjs`
- any other test file, test helper, fixture, RED evidence artifact, RED evidence spec, or acceptance mapping for `BANDIT-054`
- `docs/work/BANDIT-054/red-evidence.md`
- `docs/specs/BANDIT-054-red-evidence.json`
- review, landing, landing-action, retrospective, CodeRabbit, or Local Qwen evidence
- installed global skills under `~/.codex/skills`
- dependencies or lockfiles

Do not implement token-cost failsafe policy, provider-pricing evidence, spend-class approvals, Evidence SLO policy, full scheduler execution, full worktree lifecycle work, claim lease creation or release, work-surface reservations, cockpit UI/server/API work, state-index persistence, PR/CI workflow, automatic merge/push/deploy behavior, product UAT approval, live reviewer routing changes, paid reviewer routes, external service integration, installed global skill edits, dependency or lockfile changes, or unrelated Phase 8 work.

If the RED test is wrong or requires broader scope, stop and record that in `docs/work/BANDIT-054/writer-report.md`; do not change the tests.

## Verification Commands

Run at least:

```sh
node --test test/stage-capability-scope.test.mjs
node --test test/work-item-create.test.mjs
npm run typecheck
npm run bandit -- validate
git diff --check
```

Run broader tests if your implementation touches shared command routing, validators, artifact renderers, work item parsing, templates, bootstrap gaps, or policy validation beyond the focused command.

## Required Writer Report

Write `docs/work/BANDIT-054/writer-report.md` with:

- summary of production files changed;
- verification commands and results;
- explicit statement that Test Ownership Boundary was preserved;
- explicit statement that Stage 3 was authored by Claude through the Process Adapter path;
- any stop conditions, bootstrap gaps, or follow-up concerns.
