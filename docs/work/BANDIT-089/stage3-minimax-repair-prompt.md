# BANDIT-089 MiniMax Stage 3 Repair Prompt

You are MiniMax, the Stage 3 Implementation Writer fallback for
`BANDIT-089` in `/Users/matthewflebbe/Bandit`.

## Context

Claude was attempted first for Stage 3 and was unavailable due to provider
session limit. A prior MiniMax Stage 3 attempt timed out after source edits and
left no writer report or implementation evidence. Codex PM independently ran
verification and then recorded a `needs_repair` PM review in
`docs/work/BANDIT-089/stage3-pm-review.md`.

Read these before editing:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-089/brief.md`
- `docs/work/BANDIT-089/red-evidence.md`
- `docs/work/BANDIT-089/stage3-claude-attempt.md`
- `docs/work/BANDIT-089/stage3-minimax-attempt-timeout.md`
- `docs/work/BANDIT-089/stage3-pm-review.md`
- `src/state/boundary-autonomy.ts`

## Allowed Edits

Edit only:

- `src/state/boundary-autonomy.ts`
- `docs/work/BANDIT-089/writer-report.md`
- `docs/work/BANDIT-089/implementation-evidence.md`
- `docs/work/BANDIT-089/writer-blocker.md` only if verification fails

Do not edit tests, test helpers, fixtures, RED evidence, acceptance mappings,
formation evidence, review evidence, landing evidence, UAT evidence,
retrospective evidence, roadmap/current-context/status files, intake ledger
state, PRDs, package files, lockfiles, dependencies, policies, templates,
commands, or unrelated source.

## Required Source Repair

Repair `src/state/boundary-autonomy.ts` so Boundary Prediction Record
validation fails closed for:

- missing or blank `boundary_contour_path`;
- missing or blank `predicted_safety_outcome`;
- missing or blank `operator_supervision_status`;
- missing or blank `rationale`;
- missing or empty `risk_classification_evidence`;
- blank entries in `risk_classification_evidence`;
- empty `relied_on_evidence_artifacts`;
- relied-on evidence artifacts missing nonblank `path`, `hash`, or
  `freshness_state`;
- `boundary_contour_version` that does not match the loaded contour's
  `contourVersion`;
- `boundary_contour_path` that is not `.bandit/policy/boundary-contour.json`;
- `risk_tier` that does not match the authorizing boundary cell;
- `evidence_strength_tier` weaker than the authorizing boundary cell's
  `minimumEvidenceStrengthTier`;
- `landing_autonomy_level` stronger than the authorizing boundary cell's
  `landingAutonomyLevel`.

Repair Notify-And-Revert Artifact validation so land-check fails closed when:

- `boundary_prediction_record` is missing or blank;
- `boundary_prediction_record` does not equal
  `docs/work/<work_item>/boundary-prediction.json`;
- the linked Boundary Prediction Record for the same work item is missing or
  invalid.

Preserve the existing behavior that ordinary safe-to-land bootstrap flows are
not blocked when landing verdicts do not claim `notify_and_revert` or
`auto_land`.

## Evidence Requirements

Create `docs/work/BANDIT-089/writer-report.md` with:

- writer identity/model family: MiniMax fallback via `pi`;
- Claude unavailable due session limit;
- prior MiniMax attempt timed out after partial source edits;
- source evidence read;
- files changed;
- zero test-surface edits;
- no forbidden surface edits;
- no operator-owned input required;
- verification commands run and results.

Create `docs/work/BANDIT-089/implementation-evidence.md` with:

- `pass` only if verification passes;
- summary of the boundary-autonomy implementation;
- acceptance criteria mapping to source and evidence;
- clean-code check against `CLEAN_CODE.md`;
- model-family separation and fallback evidence;
- zero test-surface edit confirmation.

Do not edit `docs/work/BANDIT-089/coordination-log.jsonl`; Codex PM will record
the coordination transition after independent verification.

## Verification

Run at least:

```sh
node --test --test-name-pattern "boundary|auto-land autonomy|notify-and-revert" test/landing-gates.test.mjs
node --test test/landing-gates.test.mjs
npm run typecheck
npm run bandit -- validate
git diff --check
```

If any command fails, write `docs/work/BANDIT-089/writer-blocker.md` instead
of `implementation-evidence.md` and do not claim Stage 3 pass.
