# Implementation Evidence - BANDIT-064

contract_version: 1
work_item: BANDIT-064
stage: stage3_implementation
owner: implementation_writer
writer_model_family: claude
verdict: pass
recorded_at: 2026-06-07T14:21:04Z

## Summary

Claude implemented the smallest GREEN path for Trust Verifier Cutover Gate
triage:

- added `.bandit/policy/trust-verifier-cutover-gates.json` with
  `compatibility_period: true`, `old_gates_authoritative: true`,
  `approved_trust_goals: []`, and `cutover_gates: []`;
- added `src/state/trust-verifier-cutover-gates.ts` as a narrow fail-closed
  validator for future cutover proposals;
- exposed `bandit trust cutover-gates validate [--json]` as a read-only command;
- included the validator in `npm run bandit -- validate`;
- seeded the default policy during `bandit init` so initialized repos remain
  valid while real repo validation fails closed if the policy is removed.

No Trust Verifier cutover is approved. No Trust Goal is selected. Existing old
gate command semantics remain authoritative.

## Files Changed

- `.bandit/policy/trust-verifier-cutover-gates.json`
- `src/state/trust-verifier-cutover-gates.ts`
- `src/commands/trust.ts`
- `src/commands/validate.ts`
- `src/commands/init.ts`
- `src/state/paths.ts`
- `docs/work/BANDIT-064/writer-report.md`

## Acceptance Mapping

| Acceptance criterion | Evidence |
| --- | --- |
| Repo-native gate policy records no approved cutover status and old gates remain authoritative. | `.bandit/policy/trust-verifier-cutover-gates.json` records compatibility period, old-gate authority, no approved Trust Goals, and no cutover gates. |
| Gate contract requires future cutover fields. | `src/state/trust-verifier-cutover-gates.ts` requires trust goal, old gate path, proposed trust-verifier path, parity evidence, stricter-failure behavior, report format, rollback/fallback rule, evidence freshness boundary, reviewer-finding routing boundary, and operator approval status for proposal objects. |
| Validation fails closed for missing or unsupported contract state. | `node --test test/trust-verifier-cutover-gate.test.mjs` passes after proving incomplete proposal diagnostics. |
| Validation rejects implicit canonical/wrapper/replacement claims without operator-approved cutover evidence. | `src/state/trust-verifier-cutover-gates.ts` rejects canonical/wrapper/replaced status and replace/wrap behavior unless operator approval status is approved with evidence; focused test passes. |
| Existing authoritative gate commands keep their current behavior. | `node --test test/trust-verify.test.mjs` passes; implementation adds a separate read-only `trust cutover-gates validate` path. |
| Repo validation includes the gate. | `src/commands/validate.ts` calls `validateTrustVerifierCutoverGates`; `npm run bandit -- validate` passes with the policy present. |

## Verification

Commands rerun by Codex PM after Writer completion:

```sh
node --test test/trust-verifier-cutover-gate.test.mjs
node --test test/trust-verify.test.mjs
npm run typecheck
node --test test/validate.test.mjs
```

Results:

- `test/trust-verifier-cutover-gate.test.mjs`: pass, 3/3.
- `test/trust-verify.test.mjs`: pass, 8/8.
- `npm run typecheck`: pass.
- `test/validate.test.mjs`: pass, 22/22.

## Role Boundary Evidence

- Codex authored the Stage 2 RED tests; Stage 3 implementation was dispatched to
  Claude through the bootstrap Process Adapter path.
- Stage 3 Writer did not edit `test/trust-verifier-cutover-gate.test.mjs`,
  RED evidence, artifact-input RED evidence, test helpers, fixtures, or
  acceptance mappings.
- Stage 3 Writer did not edit formation, review, landing, or retrospective
  evidence.

## Boundary Notes

`src/commands/init.ts` and `src/state/paths.ts` were edited only to locate and
seed the new repo-native policy so repo validation can include the validator
without breaking fresh `bandit init` repositories. This is accepted as necessary
mechanical support for the brief requirement to add/update a repo-native policy
artifact and validator.
