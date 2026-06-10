# BANDIT-091 Stage 3 MiniMax Fallback Dispatch

You are the Stage 3 Implementation Writer fallback for `BANDIT-091` in
`/Users/matthewflebbe/Bandit`.

Claude timed out after 20 minutes. It left source/template edits in the working
tree, but Stage 3 is not acceptable yet because typecheck fails and the required
writer artifacts are missing.

## Authority Boundary

You may edit only:

- `docs/templates/escape-candidate.md`
- `docs/templates/boundary-escape-disposition.md`
- `src/state/boundary-escape.ts`
- `src/commands/init.ts`
- `src/commands/validate.ts`
- `src/state/templates.ts`
- `docs/work/BANDIT-091/writer-report.md`
- `docs/work/BANDIT-091/implementation-evidence.md`

You must not edit:

- tests, test helpers, fixtures, RED evidence, acceptance mappings, formation
  evidence, review evidence, landing evidence, retrospective evidence, UAT
  evidence, policy acceptance criteria, roadmap/current-context/status routing,
  or unrelated source files.

The Test Writer owns `test/landing-gates.test.mjs` and
`docs/work/BANDIT-091/red-evidence.md`. Do not modify those files.

## Required Reads

Read:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-091/brief.md`
- `docs/work/BANDIT-091/red-evidence.md`
- `docs/work/BANDIT-091/stage3-dispatch.md`
- `docs/work/BANDIT-091/stage3-claude-timeout.md`
- `src/state/boundary-escape.ts`
- `src/state/templates.ts`
- `src/commands/validate.ts`

## Current Verification State

The orchestrator ran:

```sh
node --test --test-name-pattern "Escape|escape" test/landing-gates.test.mjs
```

Result: pass, 4 tests passing.

The orchestrator ran:

```sh
npm run typecheck
```

Result: fail.

Diagnostics:

```text
src/state/boundary-escape.ts(325,54): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
src/state/boundary-escape.ts(357,65): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
```

## Task

Repair only the Stage 3 implementation defects needed to make typecheck pass
while preserving the focused green behavior.

Expected fix shape: keep the same diagnostics and validation semantics, but make
the two first-error call sites type-safe. Avoid broad refactors.

## Required Verification

Run:

```sh
node --test --test-name-pattern "Escape|escape" test/landing-gates.test.mjs
npm run typecheck
```

If both pass, write:

- `docs/work/BANDIT-091/writer-report.md`
- `docs/work/BANDIT-091/implementation-evidence.md`

Both artifacts must honestly record:

- Claude timed out and MiniMax completed the fallback repair.
- Focused tests passed.
- Typecheck passed.
- Test Writer-owned files were not modified by MiniMax.

Do not advance Stage 4, review, landing, closeout, roadmap, context, or status.
