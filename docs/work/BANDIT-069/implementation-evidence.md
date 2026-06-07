# BANDIT-069 Implementation Evidence

work_item: BANDIT-069
stage: Stage 3 implementation
role: implementation_writer
model_family: claude
result: pass

## Files Changed By The Stage 3 Writer

Created:

- `src/state/test-strength-gate.ts`
- `src/commands/test-strength-gate.ts`
- `.bandit/policy/test-strength-gate.json`
- `docs/templates/test-strength-evidence.md`
- `docs/templates/red-evidence.md`
- `docs/work/BANDIT-069/writer-report.md`
- `docs/work/BANDIT-069/implementation-evidence.md`

Modified:

- `src/cli.ts`
- `src/commands/init.ts`
- `src/commands/land-check.ts`
- `src/state/paths.ts`

Not changed by the Writer (pre-existing modifications recorded in the
session-start git snapshot, untouched here):

- `.bandit/events.jsonl`
- `docs/work/BANDIT-069/coordination-log.jsonl`

## Verification Run

| Command | Result |
| --- | --- |
| `node --test test/test-strength-gate.test.mjs` | 4 tests, 4 pass, 0 fail |
| `npm run typecheck` | clean, no errors |
| `npm test` | 529 tests, 529 pass, 0 fail |

### Target test output (summary)

```
ok 1 - test-strength-gate validate rejects covered surfaces without a strategy or disposition
ok 2 - test-strength-gate validate accepts mutation evidence with required adequacy fields
ok 3 - test-strength-gate validate rejects Stage 2 RED evidence without intended failure and assertion adequacy
ok 4 - land-check fails closed when a covered high-risk surface lacks current test-strength evidence
# pass 4
# fail 0
```

## Acceptance Criteria Coverage

| Criterion | Implementation |
| --- | --- |
| Repo-native policy defines covered surfaces, evidence modes, required fields, disposition rules. | `.bandit/policy/test-strength-gate.json` + `parseTestStrengthPolicy` and per-mode field tables in `src/state/test-strength-gate.ts`. |
| Stage 1 covered surfaces require strategy or explicit disposition. | `validateWorkItem` fails closed when `test_strength_strategy` is empty. |
| Mutation evidence records target surface, command, score, threshold, surviving/excluded mutant disposition, freshness. | `EVIDENCE_MODE_REQUIRED_SCALARS.mutation` + `wrong_behaviors_rejected` list. |
| Property/fault-injection and table-driven adversarial modes validated. | Mode-specific required scalar/list tables for `property_fault_injection` and `table_driven_adversarial`. |
| Stage 2 RED evidence requires intended_failure_reason and assertion_adequacy_mapping. | `redEvidenceProblems`. |
| land-check fails closed for covered high-risk surfaces lacking current evidence. | `landingTestStrengthProblems` wired into `readLandingReadiness` for `safe-to-land` verdicts. |
| Risk-tiered; no blanket coverage / universal mutation / paid tooling / merge-push-deploy / cockpit scope. | `gateApplies` engages only for `risk_tier: high` with declared covered surfaces; no other surfaces touched. |

## Skipped Checks

- Gate not added to the aggregate `bandit validate` (`validateBandit`) to avoid
  breaking the fixed template/policy set asserted by `test/validate.test.mjs`
  and `test/templates.test.mjs`; enforcement is via the dedicated command and
  `land-check`, which is what the RED tests require.
- No git-head drift comparison for test-strength evidence freshness; "current"
  is enforced by requiring a non-empty `freshness_source`. Out of RED scope.

## Test-Surface Edit Confirmation

The Stage 3 Writer made zero edits to tests, test helpers, fixtures, RED
evidence, mutation evidence, assertion-adequacy mappings, adversarial-case
mappings, acceptance mappings, formation evidence, orchestration plan evidence,
review evidence, landing evidence, UAT evidence, or retrospective evidence.
`git diff --stat -- test/` reports no changes. `test/test-strength-gate.test.mjs`
remains the Stage 2 Test Writer's untouched, untracked artifact.
