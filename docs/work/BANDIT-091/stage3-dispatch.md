# BANDIT-091 Stage 3 Claude Implementation Dispatch

You are the Stage 3 Implementation Writer for `BANDIT-091` in
`/Users/matthewflebbe/Bandit`.

## Authority Boundary

Implement only the source/template changes needed for the approved
`BANDIT-091` Escape Candidate Workflow slice.

You may edit:

- `docs/templates/escape-candidate.md`
- `docs/templates/boundary-escape-disposition.md`
- `src/state/boundary-escape.ts`
- `src/commands/init.ts`
- `src/commands/validate.ts`
- `src/state/templates.ts`
- implementation evidence/report files under `docs/work/BANDIT-091/`

You must not edit:

- tests, test helpers, fixtures, RED evidence, acceptance mappings, formation
  evidence, review evidence, landing evidence, retrospective evidence, UAT
  evidence, policy acceptance criteria, roadmap/current-context/status routing,
  or unrelated source files.

The Test Writer owns `test/landing-gates.test.mjs` and
`docs/work/BANDIT-091/red-evidence.md`. Do not modify those files.

## Source Authority

Read before editing:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/work/BANDIT-091/brief.md`
- `docs/work/BANDIT-091/orchestration-plan.md`
- `docs/work/BANDIT-091/red-evidence.md`
- `src/state/attribution-join-key.ts`
- `src/state/boundary-autonomy.ts`
- `src/state/templates.ts`
- `src/commands/init.ts`
- `src/commands/validate.ts`

## Implementation Target

Add a small `boundary-escape` state module that validates optional repo-native
work-item artifacts:

- `docs/work/<ID>/escape-candidate.json`
- `docs/work/<ID>/boundary-escape-disposition.json`

If those artifacts are absent, ordinary safe-to-land and bootstrap validation
must remain unblocked.

When present, Escape Candidate validation must fail closed for at least:

- unsupported `contract_version`
- blank or mismatched `work_item`
- malformed `source_head`
- malformed `review_subject_hash`
- missing or malformed `evidence_artifacts`
- malformed evidence artifact hash
- unsupported `candidate_status`
- unsupported `escape_signal`
- missing or invalid `touched_surface`
- invalid `boundary_prediction_record` reference when supplied
- invalid `attribution_join_key` reference when supplied

When present, Boundary Escape Disposition validation must fail closed for at
least:

- unsupported `contract_version`
- blank or mismatched `work_item`
- missing `candidate`
- unsupported `attribution_status`
- unsupported `disposition_verdict`
- missing Codex PM rationale
- missing `required_operator_input_status`
- missing `evidence_reviewed`
- `operator_input_required` with any required-operator-input status other than
  `required`
- non-`operator_input_required` verdicts with `required_operator_input_status:
  required`
- `result` that disagrees with `disposition_verdict`

Supported disposition verdicts must include `confirmed_escape`, `no_escape`,
`needs_repair`, and `operator_input_required`.

## Template And Init Support

Add committed templates for:

- `docs/templates/escape-candidate.md`
- `docs/templates/boundary-escape-disposition.md`

Wire template validation in `src/state/templates.ts`, and seed the templates
from `bandit init` in `src/commands/init.ts` for fresh repos.

## Aggregate Validation

Wire the new artifact validation into `npm run bandit -- validate` through
`src/commands/validate.ts`.

Diagnostics must be explicit enough for the RED assertions:

- `Missing required template: docs/templates/escape-candidate.md`
- `Escape Candidate: evidence_artifacts[0].hash must be a sha256 hex digest`
- `Boundary Escape Disposition: operator_input_required requires required_operator_input_status required`

## Verification

Run:

```sh
node --test --test-name-pattern "Escape|escape" test/landing-gates.test.mjs
npm run typecheck
```

If shared validation behavior changes more broadly, also run:

```sh
npm test
npm run bandit -- validate
```

## Required Output Artifacts

Write:

- `docs/work/BANDIT-091/writer-report.md`
- `docs/work/BANDIT-091/implementation-evidence.md`

Both files must record:

- files changed
- verification commands and results
- confirmation that no Test Writer-owned surfaces were edited
- clean-code self-check against `CLEAN_CODE.md`
- no boundary-cell movement, autonomy expansion, Notify-And-Revert execution,
  rollback execution, model gateway, PRD-005 controller, cockpit UI, local API,
  State Index, telemetry, hosted service, paid route, merge, push, deploy, or
  unrelated Phase 8 work
