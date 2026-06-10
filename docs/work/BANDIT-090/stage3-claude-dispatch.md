# BANDIT-090 Stage 3 Claude Implementation Dispatch

You are the Stage 3 Implementation Writer for `BANDIT-090` in
`/Users/matthewflebbe/Bandit`.

## Role Boundary

You are a non-Codex model-family Implementation Writer. Codex authored the
Stage 2 RED tests, so Bootstrap Model-Family Separation requires you to handle
Stage 3 implementation.

Do not edit Test Writer-owned or future-stage files:

- `test/landing-gates.test.mjs`
- `docs/work/BANDIT-090/red-evidence.md`
- formation evidence
- review evidence
- landing evidence
- retrospective evidence
- acceptance criteria or policy-scope text

You may edit only implementation-owned surfaces needed for the RED tests:

- `docs/templates/attribution-join-key.md`
- `src/state/attribution-join-key.ts`
- `src/state/landing-verdicts.ts`
- `src/state/templates.ts`
- `src/state/paths.ts` only if a stable path helper is needed
- `src/commands/init.ts`
- `src/commands/validate.ts`
- `src/commands/land-check.ts`
- `docs/work/BANDIT-090/writer-report.md`
- `docs/work/BANDIT-090/implementation-evidence.md`

## Source Authority

Read these before editing:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-090/brief.md`
- `docs/work/BANDIT-090/orchestration-plan.md`
- `docs/work/BANDIT-090/red-evidence.md`
- `test/landing-gates.test.mjs`
- `src/state/boundary-autonomy.ts`
- `src/state/landing-verdicts.ts`
- `src/commands/land-check.ts`
- `src/commands/validate.ts`
- `src/commands/init.ts`
- `src/state/templates.ts`

## Required Implementation

Implement the minimal repo-native Attribution Join Key contract needed to make
the RED tests pass:

- Add a structured Attribution Join Key validator.
- Treat the structured tuple as canonical evidence and
  `attribution_join_hash` as derived lookup data only.
- Validate `docs/work/<WORK_ITEM>/landing-attribution-join-key.json` when it is
  present.
- Reject malformed attribution tuple fields, including malformed SHA-256
  evidence artifact hashes.
- Parse optional `attribution_join_key:` from landing verdict metadata.
- In `land-check`, require a valid landing Attribution Join Key when a landing
  verdict claims `auto_land` or `notify_and_revert`, or references a Boundary
  Prediction Record.
- Fail closed if the landing Attribution Join Key mismatches the Boundary
  Prediction Record's `work_item`, `review_subject_hash`,
  `boundary_prediction_record`, `authorizing_boundary_cell`, or
  `landing_autonomy_level`.
- Preserve ordinary safe-to-land bootstrap flows when no PRD-004
  boundary-autonomy evidence or Attribution Join Key evidence is claimed.
- Add `docs/templates/attribution-join-key.md` and template validation/init
  wiring.
- Keep parser/hash derivation, landing integration, and template validation
  small and explicit. Do not implement model gateway, telemetry, live
  model-call capture, escape workflow, boundary movement, PRD-005, cockpit UI,
  local API, State Index, hosted services, paid routing, merge, push, or deploy
  behavior.

## Required Checks

Run these after implementation:

```sh
node --test --test-name-pattern "Attribution|attribution" test/landing-gates.test.mjs
npm run typecheck
```

Run `node --test test/landing-gates.test.mjs` if the focused tests pass and the
changes are local enough to justify the broader file check.

## Evidence To Write

Write:

- `docs/work/BANDIT-090/writer-report.md`
- `docs/work/BANDIT-090/implementation-evidence.md`

Include files changed, verification commands and results, and any residual
risks or blocked checks. Do not create Stage 4, Stage 5, Stage 6, PRD-004.3,
PRD-004.4, PRD-005, or V0 trial artifacts.
