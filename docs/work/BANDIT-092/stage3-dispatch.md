# BANDIT-092 Stage 3 Implementation Dispatch

You are the Stage 3 Implementation Writer for `BANDIT-092` in
`/Users/matthewflebbe/Bandit`.

## Role Boundary

You own source/template implementation and implementation evidence only.

Do not create, edit, delete, regenerate, format, or mechanically adjust:

- `test/landing-gates.test.mjs`
- `docs/work/BANDIT-092/red-evidence.md`
- acceptance mappings
- formation evidence
- review evidence
- landing evidence
- UAT evidence
- retrospective evidence
- policy acceptance criteria

Codex/Test Writer authored the RED tests. Treat them as fixed.

## Required Context

Read:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-092/brief.md`
- `docs/work/BANDIT-092/orchestration-plan.md`
- `docs/work/BANDIT-092/red-evidence.md`
- `src/state/boundary-autonomy.ts`
- `src/state/boundary-escape.ts`
- `src/commands/validate.ts`
- `src/commands/land-check.ts`
- `src/state/templates.ts`
- `src/commands/init.ts`

## Goal

Turn the `BANDIT-092` RED tests green by implementing the smallest
repo-native Boundary Cell Movement gate.

## Required Behavior

Implement:

- `docs/templates/boundary-cell-movement.md`
- template/init support for the new template
- `src/state/boundary-cell-movement.ts` or an equivalent small local module
- aggregate `bandit validate` integration for optional
  `docs/work/<ID>/boundary-cell-movement.json` artifacts
- validation that fails closed for malformed Boundary Cell Movement evidence:
  blank work item, malformed source head, missing contour path/version,
  unknown cell id, invalid autonomy levels, invalid movement direction, missing
  linked evidence, unsupported operator-decision status, and inconsistent
  direction semantics between from/to autonomy levels
- expansion guardrails requiring linked Workflow Trial evidence, predeclared
  decision criteria, metric/baseline, minimum-detectable-effect context or
  uncertainty, evaluation window, re-evaluation window, proxy-risk notes, and
  operator-reviewed Improvement Decision
- rejection of zero observed escapes alone as an expansion rationale
- land-check contraction enforcement: when confirmed Boundary Escape
  Disposition evidence exists for a cell and a future `notify_and_revert` or
  `auto_land` boundary-autonomy claim uses that cell, the claim must fail
  closed unless the active contour already contracts the cell or valid Boundary
  Cell Movement evidence records the required contraction

Preserve ordinary safe-to-land bootstrap flows when no boundary-autonomy claim
and no confirmed boundary escape evidence exists.

## Out Of Scope

Do not approve expanded landing autonomy, apply a contour update, move or
rewrite the active Boundary Contour, execute rollback behavior, run live
Workflow Trial evaluation, change reviewer routing, change risk/supply-chain
policy, implement PRD-005 command controllers, implement a model gateway,
touch telemetry, hosted services, cockpit UI, local API, State Index, paid
routing, package scripts, dependencies, lockfiles, CI/release workflows, merge,
push, deploy, or unrelated Phase 8 work.

## RED Command

Run:

```sh
node --test --test-name-pattern "Boundary Cell|boundary cell|autonomy expansion|zero escapes|confirmed boundary escape|ordinary safe-to-land" test/landing-gates.test.mjs
```

Expected after implementation: all focused tests pass.

Also run:

```sh
npm run typecheck
npm run bandit -- validate
```

Run `npm test` if shared validator or landing-gate behavior changes broadly.

## Evidence To Produce

Create:

- `docs/work/BANDIT-092/writer-report.md`
- `docs/work/BANDIT-092/implementation-evidence.md`

These must summarize:

- changed source/template files
- commands run and results
- clean-code posture
- role-boundary compliance
- any bootstrap gaps or blockers

Do not append coordination transitions; Codex PM will validate and record the
Stage 3 transition after reviewing your output.
