# BANDIT-029 RED Evidence

## Summary

Stage 2 RED evidence is recorded for the Phase 7 improvement evaluation
foundation before production implementation. The focused improvement tests now
define the expected CLI-owned discovery and evaluation command surface,
required metadata refusal behavior, source artifact validation, explicit Stage 7
result and improvement-routing decision vocabulary, and the boundary that
derived reports must not create hidden canonical cache state.

Production code is intentionally unchanged in this step. The tests fail because
`bandit improvements` does not exist yet.

## Tests Added

- `test/improvements.test.mjs`
  - Discover one complete repo-native improvement candidate from existing
    work-item-style metadata.
  - Fail closed when required candidate metadata such as `metric` is missing.
  - Fail closed when a candidate cites a missing source artifact.
  - Validate one evaluation evidence artifact with metric evidence, baseline
    comparison, Stage 7 result, routing decision, rationale, and routing action.
  - Refuse unsupported Stage 7 result values and unsupported
    keep/revise/revert/double_down routing decisions.
  - Prove candidate reports remain derived and do not create hidden canonical
    `.bandit` improvement index state.

## Proposed Command Surface

- `bandit improvements candidates --json`
  - Read repo-native improvement metadata from work-item artifacts.
  - Return a derived report of pending, queued, evaluated, and routed
    candidates without creating canonical cache state.
  - Fail closed for missing required metadata or missing source artifacts.
- `bandit improvements evaluate <candidate-id> --evidence <path> [--json]`
  - Validate one evaluation evidence artifact for the named candidate.
  - Require observed metric evidence, baseline comparison, result, decision,
    rationale, source artifacts, and next routing action.
  - Keep Stage 7 result values separate from improvement-routing decisions.

## RED Run

Command:

```sh
node --test test/improvements.test.mjs
```

Result: expected failure.

```text
tests 6
pass 0
fail 6
```

Representative failures:

```text
Unknown command: improvements
Usage: bandit <init|validate|list|show|draft-work|work-item|artifact|route|land-check|land|auto-land-check|qwen-review|review-subject-hash|coderabbit-review|escalated-review|heartbeat|uat|gaps|coordination>
expected: /missing required improvement metadata: metric/
actual: 'Unknown command: improvements\nUsage: bandit <...>\n'
expected: /Missing improvement source artifact: docs\/work\/BANDIT-028\/missing-disposition\.md/
actual: 'Unknown command: improvements\nUsage: bandit <...>\n'
expected: /Unsupported improvement result: helpful/
actual: 'Unknown command: improvements\nUsage: bandit <...>\n'
```

The failures prove the slice has not been implemented yet:

- `src/cli.ts` has no `improvements` command route.
- `src/commands/improvements.ts` does not exist.
- `src/state/improvements.ts` does not exist.
- No parser discovers retrospective-derived improvement candidates from
  repo-native artifacts.
- No evaluator validates improvement evaluation evidence, source artifacts,
  metric evidence, baseline comparison, result vocabulary, or decision
  vocabulary.

## Acceptance Criteria Mapping

| Acceptance criterion | RED evidence |
| --- | --- |
| The implementation can discover pending improvement candidates from existing repo-native artifacts that include source metadata, hypothesis, metric, baseline, expected direction, evaluation window, status, and outcome. | `improvements candidates discovers complete repo-native improvement metadata` expects one derived candidate from a work-item disposition artifact with all required metadata. |
| The implementation can record or validate one evaluation evidence artifact for a selected candidate with observed metric evidence, baseline comparison, result, decision, rationale, source artifacts, and next routing action. | `improvements evaluate validates one evidence artifact with explicit result and decision` expects `effective` plus `keep` evidence to validate and return the candidate result and routing action. |
| Evaluation refuses candidates with missing required metadata, missing source artifacts, unsupported result or decision values, missing metric evidence, or outcome decisions that do not cite sufficient evidence. | Refusal tests cover missing `metric`, missing source artifact, unsupported result, and unsupported decision. Missing metric evidence and insufficient outcome evidence are represented by the evaluation evidence contract and should be enforced during GREEN. |
| The implementation distinguishes Stage 7 result values from improvement-routing decisions and maps them explicitly instead of conflating evidence status with policy action. | Evaluation tests use separate `result: effective` and `decision: keep` fields, and invalid-value tests expect separate refusal messages for result and decision. |
| Derived reports may summarize due, pending, evaluated, inconclusive, and routed candidates, but canonical state remains in repo-native artifacts. | `improvements candidates report stays derived and does not create canonical cache state` asserts no hidden `.bandit` improvement index files are created by the report. |
| Tests cover candidate discovery from existing fixture artifacts, metadata refusal paths, evaluation evidence validation or creation, result/decision vocabulary validation, missing-source refusal, and no hidden cockpit/index authority. | `test/improvements.test.mjs` contains six focused RED tests covering those paths. |
| No Phase 8 cockpit, scheduler execution, automatic evaluation, claim lease, worktree lifecycle, cross-repo coordination, automatic merge/push/deploy, product UAT, actor identity policy, or unrelated coordination behavior is introduced by this slice. | RED tests exercise only local `improvements candidates` and `improvements evaluate` behavior against repo-native files in temporary repositories. |

## Stage-Rubric Evaluation

| Stage | Verdict | Rationale |
| --- | --- | --- |
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify `BANDIT-029` as active, `BANDIT-028` is landed and closed, no bootstrap gaps are open, and Stage 2 RED evidence is the current step before this artifact. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-029/brief.md` is present with goal, scope, out of scope, acceptance criteria, test plan, clean-code evidence, bootstrap gaps, expected files, implementation order, smell triggers, and operator-input status. |
| Stage 2: Test Design And RED Evidence | `pass` | Focused tests express the improvement candidate discovery and evaluation evidence contract and fail before production implementation because the command and state helpers are missing. |

## Next Action

Implement the narrow improvement evaluation foundation in
`src/commands/improvements.ts`, `src/state/improvements.ts`, and `src/cli.ts`
so the focused RED tests pass. Preserve repo-native artifacts as canonical
state, keep derived reports read-only, fail closed for incomplete evidence, and
do not introduce cockpit UI, scheduler execution, automatic evaluation, claim
leases, worktree lifecycle, cross-repo coordination, automatic merge/push/deploy
behavior, product UAT, actor identity policy, or unrelated coordination work.
