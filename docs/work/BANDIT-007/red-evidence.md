# BANDIT-007 RED Evidence

## Status

RED evidence created on 2026-05-24 before production implementation.

## Baseline

Bandit currently has aggregate `coderabbit_state` fields in review and landing
evidence, but no repo-native CodeRabbit review artifact, no
`docs/templates/coderabbit-review.md`, no CodeRabbit evidence parser, no
`coderabbit-review` command, and no `land-check` requirement for current
CodeRabbit evidence when `coderabbit_state: pass` is recorded.

`BANDIT-005` and `BANDIT-006` both recorded CodeRabbit as an explicit
bootstrap gap. `BANDIT-007` should reduce that gap by defining and enforcing
the CodeRabbit evidence contract.

## Source Artifacts Read

- `AGENTS.md`
- `CONTEXT.md`
- `CLEAN_CODE.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `docs/plans/BOOTSTRAP_METHODOLOGY.md`
- `docs/plans/V0_PLAN.md`
- `docs/verification/STAGE_RUBRICS.md`
- `.bandit/policy/smell-triggers.json`
- `docs/work/BANDIT-005/brief.md`
- `docs/work/BANDIT-005/review-evidence.md`
- `docs/work/BANDIT-006/brief.md`
- `docs/work/BANDIT-006/review-evidence.md`
- `docs/work/BANDIT-006/landing-action.md`
- `docs/work/BANDIT-006/retrospective.md`

## Test File

- `test/coderabbit-state.test.mjs`

The behavior assertions in this file are Test Writer-owned for this slice. A
Writer may add helper setup or adjust fixture mechanics during GREEN
implementation, but must not weaken assertions, remove refusal coverage, or
change expected source-of-truth boundaries without a recorded test-change
rationale.

## Acceptance-Criteria Mapping

| Acceptance Criteria | RED Tests |
|---|---|
| AC1-AC2 | `validate fails closed when the CodeRabbit review template is missing`. |
| AC3-AC4 | `validate fails closed when CodeRabbit evidence references the wrong work item`. |
| AC5 | `validate fails closed when CodeRabbit evidence uses an unsupported verdict`. |
| AC7 | `validate fails closed when a CodeRabbit pass lacks executable evidence`. |
| AC9-AC10 | `coderabbit-review reports usage when the work item ID is omitted`. |
| AC11 | `coderabbit-review fails closed when the work item is unknown`. |
| AC12 | Test fixtures use local repo artifacts only; no test depends on live CodeRabbit, GitHub, network, paid keys, or operator approval. |
| AC13 | `land-check fails closed when CodeRabbit pass lacks current CodeRabbit evidence`. |
| AC14 | `land-check reports the current CodeRabbit pass and evidence artifact`. |
| AC15 | `land-check fails closed when CodeRabbit evidence is stale`. |
| AC16 | Temp-repo historical compatibility is preserved unless new CodeRabbit evidence is present or aggregate CodeRabbit pass is claimed. |
| AC17 | Tests constrain implementation to template validation, evidence validation, one narrow command, and `land-check` integration. |
| AC18 | Full verification is not expected to pass during RED. It must pass before landing after GREEN implementation and closeout evidence. |

## RED Command

```sh
node --test test/coderabbit-state.test.mjs
```

## RED Result

Expected RED failure was observed.

```text
tests 9
pass 0
fail 9
duration_ms 2769.787583
```

Representative failures:

```text
validate fails closed when the CodeRabbit review template is missing
0 !== 1

validate fails closed when CodeRabbit evidence references the wrong work item
0 !== 1

validate fails closed when CodeRabbit evidence uses an unsupported verdict
0 !== 1

validate fails closed when a CodeRabbit pass lacks executable evidence
0 !== 1

coderabbit-review reports usage when the work item ID is omitted
Unknown command: coderabbit-review
Usage: bandit <init|validate|list|show|draft-work|route|land-check|qwen-review>

coderabbit-review fails closed when the work item is unknown
Unknown command: coderabbit-review
Usage: bandit <init|validate|list|show|draft-work|route|land-check|qwen-review>

land-check fails closed when CodeRabbit pass lacks current CodeRabbit evidence
0 !== 1

land-check reports the current CodeRabbit pass and evidence artifact
CodeRabbit output omits docs/work/BANDIT-974/coderabbit-review.md

land-check fails closed when CodeRabbit evidence is stale
0 !== 1
```

## Interpretation

The RED suite is executable and fails for the intended missing Phase 4
CodeRabbit behavior:

- `bandit validate` does not require or validate a CodeRabbit review template.
- `bandit validate` ignores `docs/work/<ID>/coderabbit-review.md`.
- `bandit coderabbit-review <work-item-id>` does not exist.
- `bandit land-check <work-item-id>` accepts `coderabbit_state: pass` without
  requiring current CodeRabbit evidence.
- `bandit land-check <work-item-id>` does not detect stale CodeRabbit evidence.
- `bandit land-check <work-item-id>` does not report the CodeRabbit evidence
  artifact or provider.

## Stage 2 Rubric Check

| Requirement | Verdict | Evidence |
|---|---|---|
| Tests or explicit bootstrap verification plan | `pass` | `test/coderabbit-state.test.mjs` contains nine focused RED tests for CodeRabbit template, evidence, command, and `land-check` behavior. |
| RED evidence where feasible | `pass` | `node --test test/coderabbit-state.test.mjs` fails 9/9 before production implementation. |
| Mapping from tests to acceptance criteria | `pass` | Acceptance-criteria mapping table is recorded above. |
| Test Writer-owned tests distinguished from Writer-editable code | `pass` | Test ownership boundary is recorded above. |
| Tests would fail against missing behavior | `pass` | Current failures show missing template validation, evidence validation, command surface, and landing integration. |
| Important refusal paths and state transitions covered | `pass` | Wrong work item, unsupported verdict, pass without executable evidence, missing command argument, unknown work item, missing current evidence, current evidence report, and stale evidence are covered. |

## Bootstrap Gaps

- Live CodeRabbit service access is not required for RED tests.
- CodeRabbit GitHub App, PR polling, review repair, and rerun orchestration are
  intentionally out of scope.
- Escalated reviewers and final Landing Agent behavior remain unavailable and
  must be recorded as bootstrap gaps before landing.

## Next GREEN Requirements

Implementation must:

- add `docs/templates/coderabbit-review.md`;
- add CodeRabbit review evidence parsing and validation;
- validate any present `docs/work/<ID>/coderabbit-review.md`;
- add `bandit coderabbit-review <work-item-id>` or an equally narrow command
  that satisfies the usage and unknown-work-item refusal contract;
- update `land-check` to require current CodeRabbit evidence when aggregate
  review or landing evidence claims `coderabbit_state: pass`;
- fail closed for stale, blocked, unresolved, malformed, or unavailable
  CodeRabbit evidence unless an explicit bootstrap gap is recorded;
- avoid live CodeRabbit/GitHub dependencies in automated tests;
- avoid UAT, Landing Agent, PR merge automation, cockpit, SQLite, paid model,
  and automated repair scope.
