# BANDIT-083 Stage 3 Review Affordance Repair Dispatch

## Role And Boundary

You are the Stage 3 Implementation Writer repairing one PM acceptance concern for `BANDIT-083`.

The fallback implementation wrote `docs/work/BANDIT-083/writer-report.md`, but PM inspection found the generated `BANDIT-083` static preview enables the "Review gate" request while `stage_3_implementation` is still `missing`. That contradicts the action's own `role_gate: reviewer_after_implementation` and the unavailable route text: "Record RED and implementation evidence before requesting review."

Repair only this source behavior. Do not perform review, UAT, landing, or closeout.

## Required Reads

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-083/brief.md`
- `docs/work/BANDIT-083/red-evidence.md`
- `docs/work/BANDIT-083/writer-report.md`
- `src/state/cockpit-actions.ts`
- `src/cockpit/preview-status-snapshot.ts`
- `public/cockpit/index.html`

## Test Ownership Boundary

Do not edit any `test/**` file or RED evidence. If a test edit seems necessary, stop and record a blocker in `docs/work/BANDIT-083/writer-report.md`.

Do not create unrelated scratch files such as `TODOS.md`.

## Authorized Files

You may edit only:

- `src/state/cockpit-actions.ts`
- `public/cockpit/index.html`, by running the generator only
- `docs/work/BANDIT-083/writer-report.md`, to append the repair summary and verification results

If the repair requires another file, stop and record a blocker in the Writer report.

## Required Repair

- `run_review_gate` must be enabled only when both `stage_2_red_evidence` and `stage_3_implementation` are `pass`.
- When Stage 2 is missing, keep the existing reason: `Stage 2 RED evidence is missing.`
- When Stage 2 passes but Stage 3 is missing or non-pass, the reason must explicitly name missing implementation evidence before review.
- Regenerate `public/cockpit/index.html` with:

```sh
node --import tsx/esm src/cockpit/generate-cockpit-preview.ts
```

The regenerated `BANDIT-083` preview should keep the Review gate disabled while `stage_3_implementation` is missing.

## Verification

Run and append results to `docs/work/BANDIT-083/writer-report.md`:

```sh
node --test test/cockpit-actions.test.mjs
node --test test/cockpit-browser-shell.test.mjs
npm run typecheck
git diff --check
```
