# BANDIT-069 Stage 3 Writer Report

role: implementation_writer
model_family: claude
work_item: BANDIT-069
verdict: implementation_complete

## Summary

Implemented the smallest source-only Test Strength / Mutation Adequacy Gate
required to turn the Stage 2 RED tests green. The gate is risk-tiered: it only
engages for high-risk work items that declare covered test-strength surfaces in
their brief. It does not add blanket line coverage, universal mutation scoring,
every-file mutation, paid/external tooling, product/UAT, merge/push/deploy, or
unrelated cockpit scope.

## Behavior Implemented

- New CLI command `bandit test-strength-gate validate [work-item-id]`.
- Repo-native policy `.bandit/policy/test-strength-gate.json` naming covered
  surfaces, acceptable evidence modes, and high-risk evidence requirement.
- Stage 1 validation: a covered high-risk surface must declare a test-strength
  strategy or explicit disposition before proceeding; otherwise the gate fails
  closed with `missing test-strength strategy or explicit disposition`.
- Stage 2 validation: when `docs/work/<ID>/red-evidence.md` exists for a covered
  surface, it must record `intended_failure_reason` and
  `assertion_adequacy_mapping`; missing fields fail closed.
- Evidence-mode validation for `mutation`, `property_fault_injection`,
  `table_driven_adversarial`, and `explicit_disposition` modes via
  `docs/work/<ID>/test-strength-evidence.md` field requirements.
- `land-check` fails closed for covered high-risk surfaces when current adequate
  test-strength evidence (matching the surface, with a freshness source) is
  missing: `safe-to-land requires current test-strength evidence for covered
  surface <surface>`.

## Files Changed

Created:

- `src/state/test-strength-gate.ts` — policy reader, brief surface parser,
  Stage 1 / Stage 2 / evidence-mode validators, land-check problem source.
- `src/commands/test-strength-gate.ts` — `validate` command wiring.
- `.bandit/policy/test-strength-gate.json` — repo-native default policy.
- `docs/templates/test-strength-evidence.md` — evidence template (all modes).
- `docs/templates/red-evidence.md` — Stage 2 RED evidence template.
- `docs/work/BANDIT-069/writer-report.md` — this report.
- `docs/work/BANDIT-069/implementation-evidence.md` — implementation evidence.

Modified:

- `src/cli.ts` — route `test-strength-gate` and update usage strings.
- `src/commands/init.ts` — write the default policy on `bandit init`.
- `src/commands/land-check.ts` — append test-strength fail-closed problems for
  `safe-to-land` verdicts.
- `src/state/paths.ts` — `testStrengthGatePolicy` path entry.

## Verification Run

- `node --test test/test-strength-gate.test.mjs` — 4 pass, 0 fail.
- `npm run typecheck` — clean (no errors).
- `npm test` (full suite) — 529 pass, 0 fail (regression guard).

## Skipped Checks

- Did not wire the gate into the global `bandit validate` aggregate (`validateBandit`).
  Reason: the existing `validate` template/regression tests assert a fixed
  template/policy set; adding a new required validation surface there would break
  unrelated tests and exceed the RED test scope. The gate is enforced through its
  own command and through `land-check`, as the RED tests require.
- No git-head freshness comparison for test-strength evidence; "current" is
  enforced by requiring a `freshness_source` field. The RED tests do not exercise
  head-drift for this evidence, and adding git plumbing would exceed scope.

## Test-Surface Edit Confirmation

Zero edits to tests, test helpers, fixtures, RED evidence, mutation evidence,
assertion-adequacy mappings, adversarial-case mappings, acceptance mappings,
formation evidence, review evidence, landing evidence, UAT evidence, or
retrospective evidence by the Stage 3 Writer. `test/test-strength-gate.test.mjs`
was not modified.
