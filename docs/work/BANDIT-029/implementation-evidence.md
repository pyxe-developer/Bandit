# BANDIT-029 Implementation Evidence

## Summary

Stage 3 implementation is recorded for the Phase 7 improvement evaluation
foundation.

The implementation adds the narrow `bandit improvements` command surface:

- `bandit improvements candidates [--json]`
- `bandit improvements evaluate <candidate-id> --evidence <path> [--json]`

Candidate discovery reads existing repo-native work artifacts and returns a
derived report of durable chore candidates with source work item, status,
outcome, metric, baseline, expected direction, evaluation window, and source
artifacts. Evaluation validates one existing evidence artifact for a candidate
with metric evidence, baseline comparison, Stage 7 result, routing decision,
rationale, source artifacts, and routing action.

No cockpit UI, scheduler execution, automatic evaluation, claim lease,
worktree lifecycle, cross-repo coordination, automatic merge/push/deploy,
product UAT, actor identity policy, or hidden improvement index was introduced.

## Files Changed

- `src/cli.ts`
- `src/commands/improvements.ts`
- `src/state/improvements.ts`
- `src/state/metadata.ts`
- `docs/work/BANDIT-029/implementation-evidence.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`

## Acceptance Criteria Mapping

| Acceptance criterion | Implementation evidence |
| --- | --- |
| Discover pending improvement candidates from repo-native artifacts. | `readImprovementCandidates` scans `docs/work/*/*.md` for explicit `### Chore Candidate` sections and returns a derived candidate report. |
| Validate one evaluation evidence artifact for a selected candidate. | `validateImprovementEvaluation` validates the named candidate and existing evidence artifact without writing canonical state. |
| Refuse missing metadata, missing source artifacts, unsupported results, unsupported decisions, or evidence without support. | Candidate and evaluation validation fail closed with explicit errors for required metadata, missing source artifacts, unsupported Stage 7 results, and unsupported routing decisions. |
| Distinguish Stage 7 result values from improvement-routing decisions. | Result values are validated against `effective`, `ineffective`, `inconclusive`, `reverted`, and `double_down`; decisions are separately validated against `keep`, `revise`, `revert`, and `double_down`. |
| Keep canonical state repo-native and reports derived. | The candidates command reads source artifacts and does not create `.bandit/improvements.json`, `.bandit/improvement-index.json`, or `.bandit/improvement-candidates.json`. |
| Avoid unrelated Phase 8, scheduler, claim, worktree, UAT, merge/push/deploy, actor identity, or coordination work. | The diff is limited to improvement command routing, improvement state validation, metadata continuation parsing, and Stage 3 documentation/context updates. |

## Clean-Code Check

- Spec alignment: `pass` - implementation follows the `BANDIT-029` brief and RED evidence without redefining the Phase 7 contract.
- Small surface area: `pass` - the command is limited to candidate discovery and single-evidence validation.
- Simple design: `pass` - parsing and command orchestration are separated into `src/state/improvements.ts` and `src/commands/improvements.ts`.
- Explicit state: `pass` - canonical state remains in repo artifacts; reports are derived.
- Testable behavior: `pass` - focused tests cover discovery, refusal paths, evidence validation, vocabulary separation, and hidden-index absence.
- Failure clarity: `pass` - missing metadata, missing source artifacts, and unsupported values fail closed with actionable messages.
- No role erosion: `pass` - no reviewer, landing, UAT, cockpit, scheduler, or automation authority was introduced.

## Verification

Commands run:

```sh
node --test test/improvements.test.mjs
npm run typecheck
npm test
npm run bandit -- improvements candidates --json
```

Results:

- Focused improvement tests: `pass` - 6 tests passed.
- Typecheck: `pass`.
- Full test suite: `pass` - 229 tests passed.
- Real repo candidate report: `pass` - discovered durable candidates from `BANDIT-025` and `BANDIT-028` without creating hidden improvement index state.

## Stage-Rubric Evaluation

| Stage | Verdict | Rationale |
| --- | --- | --- |
| Stage 2: Test Design And RED Evidence | `pass` | The focused RED tests failed before implementation and now pass without changing Test Writer-owned expectations. |
| Stage 3: Implementation Clean-Code Rubric | `pass` | The implementation is narrow, repo-native, deterministic, fail-closed, and covered by focused plus full verification. |
| Stage 4: Review And Cross-Model Gates | `required_next` | Pre-landing review evidence has not been recorded yet. |

## Next Action

Run Stage 4 review for `BANDIT-029`: pre-PR CodeRabbit review when available,
Local Qwen adversarial review, any required escalated-review routing, and
aggregate review evidence with the current review subject hash.
