# BANDIT-055 Claude Writer Dispatch

## Metadata

- Work item: `BANDIT-055` - Token-Cost Failsafe
- Codex PM: Codex
- Claude Writer: `claude-sonnet-4-6`
- Repository: `/Users/matthewflebbe/Bandit`
- Branch: `main`
- Base SHA: `a2ea27d9361c73b3beef30930dfe348feebcb709`
- Dispatch status: Stage 3 implementation requested

## Narrowed Process Adapter Instructions

This is a direct Stage 3 Writer dispatch. Do not perform meta-workflow
selection, subagent selection, workflow planning, or skill delegation. Do not
invoke `Task`, subagents, slash-command skills, or workflow-management tools.
Read the required files below, make the focused production implementation edits
allowed by this packet, run the required verification, write the required Writer
report, and stop.

If local runtime instructions force you to load a startup skill before work,
load only the minimum required startup skill, then immediately return to this
dispatch packet. Do not dispatch another agent or broaden the role taxonomy.

## Required First Reads

Read these before editing:

- `AGENTS.md`
- `CONTEXT.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-055/brief.md`
- `docs/work/BANDIT-055/red-evidence.md`
- `docs/specs/BANDIT-055-red-evidence.json`
- `test/token-cost-failsafe.test.mjs`
- Existing command/state patterns in `src/cli.ts`,
  `src/commands/stage-capability-scope.ts`,
  `src/state/stage-capability-scope.ts`,
  `src/commands/agent-observability.ts`,
  `src/state/agent-observability.ts`,
  `src/commands/event-driven-wake-scheduler.ts`,
  `src/state/event-driven-wake-scheduler.ts`,
  `src/commands/work-item-create.ts`, `src/commands/validate.ts`, and related
  policy validators.

## Mission

Implement Stage 3 for `BANDIT-055` only: add a repo-native Token-Cost Failsafe
validation surface and work-item integration so the focused RED tests pass.

The expected command is:

```sh
bandit token-cost-failsafe validate --json
```

The implementation must validate `.bandit/policy/token-cost-failsafe.json`
fail-closed. It must accept a complete failsafe policy and reject stale or
missing provider-pricing evidence, missing benchmark/evaluation spend approval
or non-recurring routing disposition, recurring paid route policy without scoped
promotion and spend approval, tight hard caps disguised as soft budget bands,
failsafe trips without continuation decisions, and trace-backed cost signals
that claim canonical workflow authority.

Also update work-item creation so specs with `token_cost_failsafe` render a
`## Token-Cost Failsafe` section in generated briefs with the policy path, soft
budget bands, provider-pricing evidence, and stage capability profile linkage.

Keep token and cost budgets as generous abnormal-run failsafes, not tight caps
that force duplicate failed attempts. Do not create or approve paid reviewer
promotion, recurring paid routing policy, spend-class approval, external service
setup, live reviewer routing, scheduler execution, or Evidence SLO policy.

## Editable Production Paths

You may edit production implementation and Stage 3 evidence only:

- `src/cli.ts`
- `src/commands/token-cost-failsafe.ts`
- `src/state/token-cost-failsafe.ts`
- `src/commands/work-item-create.ts`
- `src/commands/validate.ts`
- `.bandit/policy/token-cost-failsafe.json`
- `docs/templates/token-cost-failsafe.md`
- `docs/work/BANDIT-055/implementation-evidence.md`
- `docs/work/BANDIT-055/writer-report.md`
- `docs/specs/BANDIT-055-implementation-evidence.json`

Use narrower edits if fewer files are enough. Preserve existing command,
parser, validator, and Markdown rendering patterns.

## Forbidden Paths And Actions

Do not edit:

- `test/token-cost-failsafe.test.mjs`
- any other test file, test helper, fixture, RED evidence artifact, RED evidence
  spec, or acceptance mapping for `BANDIT-055`
- `docs/work/BANDIT-055/red-evidence.md`
- `docs/specs/BANDIT-055-red-evidence.json`
- review, landing, landing-action, retrospective, CodeRabbit, or Local Qwen
  evidence
- installed global skills under `~/.codex/skills`
- dependencies or lockfiles

Do not implement Evidence SLO policy, full scheduler execution, full worktree
lifecycle work, claim lease creation or release, work-surface reservations,
cockpit UI/server/API work, state-index persistence, PR/CI workflow, automatic
merge/push/deploy behavior, product UAT approval, live reviewer routing changes,
paid reviewer route promotion, external service integration, installed global
skill edits, dependency or lockfile changes, or unrelated Phase 8 work.

If the RED test is wrong or requires broader scope, stop and record that in
`docs/work/BANDIT-055/writer-report.md`; do not change the tests.

## Verification Commands

Run at least:

```sh
node --test test/token-cost-failsafe.test.mjs
node --test test/work-item-create.test.mjs
npm run typecheck
npm run bandit -- validate
npm run bandit -- gaps list
git diff --check
```

Run broader tests if your implementation touches shared command routing,
validators, artifact renderers, work item parsing, templates, bootstrap gaps,
stage capability scope, agent observability traces, scheduler policy, risk
classification, supply-chain gates, input quarantine, operator boundaries, claim
authority, git mutation policy, cockpit status, coordination status, or policy
validation beyond the focused command.

## Required Writer Report

Write `docs/work/BANDIT-055/writer-report.md` with:

- summary of production files changed;
- verification commands and results;
- explicit statement that Test Ownership Boundary was preserved;
- explicit statement that Stage 3 was authored by Claude through the Process
  Adapter path;
- any stop conditions, bootstrap gaps, or follow-up concerns.
