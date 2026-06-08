# BANDIT-075 Stage 3 PM Acceptance Review

verdict: pass
work_item: BANDIT-075
reviewer: codex_pm
reviewed_at: 2026-06-08T11:47:28Z

## Scope And Role Boundary

Codex authored the Stage 2 RED tests, seeded packet, and RED evidence, so Stage
3 was routed to a Claude-family implementation writer through the bootstrap
Process Adapter path.

The implementation writer changed source and Writer-owned evidence surfaces:

- `src/state/reviewer-calibration.ts`
- `src/commands/reviewer-calibration.ts`
- `src/cli.ts`
- `.bandit/policy/reviewer-calibration.json`
- `docs/work/BANDIT-075/writer-report.md`
- `docs/role-runs/BANDIT-075/stage3-implementation.json`

The Stage 3 Writer did not edit Test Writer-owned surfaces:

- `test/reviewer-calibration.test.mjs`
- `docs/reviewer-calibration-packets/BANDIT-075-reviewer-packet-001.json`
- `docs/artifact-inputs/BANDIT-075-red-evidence.json`
- `docs/work/BANDIT-075/red-evidence.md`

Codex PM tightened the RED suite before accepting Stage 3 because the initial
GREEN path did not yet prove brief-required non-empty packet lists, failure-mode
provenance fields, or required seeded-case gold-label fields. Those Test
Writer-owned changes invalidated the first implementation pass and were routed
back to Claude as bounded source repair. The repaired implementation satisfies
the expanded 10-test RED suite.

## Acceptance Criteria Check

| Criterion | Verdict | Evidence |
| --- | --- | --- |
| Public reviewer calibration validation command | pass | `bandit reviewer-calibration validate [--json]` is registered through `src/commands/reviewer-calibration.ts` and `src/cli.ts`. |
| Replay-only calibration policy and packet validation | pass | `.bandit/policy/reviewer-calibration.json` names `docs/reviewer-calibration-packets/BANDIT-075-reviewer-packet-001.json`; the validator reads and validates both. |
| No live reviewer or landing authority mutation | pass | Validator is pure-read and the focused read-only test verifies `.bandit/reviewers/local-qwen.json` and `.bandit/policy/landing-agent.json` are byte-identical before and after validation. |
| Direct Qwen CLI route is rejected | pass | Focused negative test rejects `direct_qwen_cli`; implementation also rejects a bare `qwen` command. |
| Repo-derived Bandit failure-mode packets required | pass | Negative packet test rejects generic benchmark source; PM-tightened case rejects empty `failure_mode_category` and `source_artifacts`. |
| Seeded blockers and non-issues required | pass | Focused negative test rejects packets without both gold-labeled blocker and non-issue seeded cases. |
| Required seeded-case fields enforced | pass | PM-tightened case rejects seeded cases missing policy-required fields such as `expected_finding_class`. |
| Deterministic scorecard with blocker recall primary | pass | JSON report returns primary metric `blocker_recall`, blocker recall 1, actionable precision 1, useful finding yield 1, false positive rate 0, and provider timeout status separated from scoring. |
| Provider timeout/refusal/inconclusive evidence is not treated as a pass | pass | `provider_evidence_statuses` contains `provider_timeout`; only completed reviewer outputs count toward score metrics. |

## Clean-Code Review

- Spec alignment: pass - implementation delivers the approved replay-only
  calibration command and does not promote calibration output into live routing.
- Small surface area: pass - changes are limited to one state validator, one
  command wrapper, CLI wiring, and one policy artifact.
- Simple design: pass - policy loading, boundary validation, packet validation,
  seeded-case schema validation, and scoring are separate named paths.
- Explicit state: pass - the policy and packet paths are repo-native artifacts
  named in the validator report.
- No hidden authority: pass - no reviewer profile, landing policy, model routing,
  gate verdict, projection, Trust Verifier, or workflow policy authority changed.
- Failure clarity: pass - boundary and schema failures name the violated policy,
  packet id, case id, or missing field.
- Testability: pass - focused RED tests cover pass, fail-closed, scoring, direct
  Qwen rejection, schema, and read-only behavior; full regression passes.
- Role boundary: pass - Stage 3 used Claude-family implementation after
  Codex-authored RED and records zero Writer test-surface edits.

## Verification

- `node --test test/reviewer-calibration.test.mjs` - pass, 10/10.
- `npm run typecheck` - pass.
- `npm run bandit -- validate` - pass.
- `npm run bandit -- reviewer-calibration validate --json` - pass with
  `provider_timeout` separated from score metrics.
- `node ./bin/bandit.mjs role-runs validate BANDIT-075 --json` - pass.
- `node ./bin/bandit.mjs coordination validate BANDIT-075` - pass before this
  review was written.
- `npm test` - pass, 561/561.
- `git diff --check` - pass.

## Next Action

Record `implementation_recorded`, then proceed to Stage 4 review with
CodeRabbit or provider-timeout evidence, Local Qwen through the authorized
`.bandit/reviewers/local-qwen.json` route, risk classification, supply-chain
gate evidence, review-subject hash, aggregate review evidence, and finding
dispositions.
