# BANDIT-094 Stage 3 MiniMax Repair Dispatch

You are still the Stage 3 Implementation Writer for `BANDIT-094`.

The prior MiniMax attempt produced partial source edits but timed out before
writer evidence and left failing verification. Repair only the implementation.

## Hard Boundary

Do not edit any test file, test helper, RED evidence, orchestration plan,
brief, formation review, roadmap/status file, landing artifact, retrospective,
or PRD/source authority file.

Forbidden write surfaces include:

- `test/orchestrator-prompts.test.mjs`
- `test/work-create-controller.test.mjs`
- `test/helpers/**`
- `docs/work/BANDIT-094/red-evidence.md`
- `docs/work/BANDIT-094/orchestration-plan.md`
- `docs/work/BANDIT-094/brief.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `STATUS.md`

Allowed repair surfaces:

- `docs/templates/repo-pm-formation-prompt.md`
- `.bandit/policy/orchestrator-prompts.json`
- `src/state/orchestrator-prompts.ts`
- `src/state/work-create-controller.ts`
- `src/commands/repo-pm.ts`
- `src/commands/work-create-controller.ts`
- `src/commands/validate.ts`
- `src/commands/init.ts`
- `src/cli.ts`
- `docs/work/BANDIT-094/writer-report.md`
- `docs/work/BANDIT-094/implementation-evidence.md`

## Current Failures To Repair

Run this focused verification:

```sh
node --test test/orchestrator-prompts.test.mjs test/work-create-controller.test.mjs
npm run typecheck
```

Current failures:

- `src/state/work-create-controller.ts` has TypeScript syntax/name errors near
  the Local Qwen route message: arithmetic operand error, `reviewers is not
  defined`, `local is not defined`, `qwen is not defined`.
- First create-controller test fails because the command allocates `BANDIT-001`
  instead of honoring the explicit source spec work item id `BANDIT-094`.
- Operator-owned input test reaches allocation mismatch before the operator
  input refusal.
- Missing Local Qwen route test currently reports `reviewers is not defined`
  instead of a clear authorized-route refusal.

Expected behavior remains:

- `bandit repo-pm create-controller --json` resolves the roadmap/current-context
  target.
- If operator input is required, refuse before allocation with an
  operator-owned input message.
- If `.bandit/reviewers/local-qwen.json` is missing or unauthorized, refuse
  before allocation with a Local Qwen authorized-route message.
- If the explicit source spec has work item id `BANDIT-094`, create that work
  item id rather than allocating `BANDIT-001`.
- Stop at Stage 1 only.

## Required Evidence

Create or update:

- `docs/work/BANDIT-094/writer-report.md`
- `docs/work/BANDIT-094/implementation-evidence.md`

Both must include changed source files, verification command results,
clean-code posture, and confirmation that Test Writer-owned files were not
edited.
