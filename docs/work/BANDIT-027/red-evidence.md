# BANDIT-027 RED Evidence

## Summary

Stage 2 RED evidence is recorded for pre-PR CodeRabbit CLI review before
production implementation. The focused CodeRabbit tests now define the expected
local-diff review path, fixture-backed deterministic behavior, refusal paths,
non-blocking info-only disposition, stale-source detection, and preservation of
the existing PR-backed live path.

Production code is intentionally unchanged in this step. The tests fail because
`bandit coderabbit-review` currently treats `pre-pr` as a work item ID and has
no `coderabbit-review pre-pr <work-item-id>` command path.

## Tests Added

- `test/coderabbit-state.test.mjs`
  - Capture clean current pre-PR local-diff CodeRabbit evidence without PR
    context, GitHub credentials, network access, or paid provider access.
  - Fail closed and write blocker evidence when the CodeRabbit CLI is missing.
  - Fail closed and write operator-input-blocked evidence when CodeRabbit
    authentication is missing.
  - Fail closed for provider timeout evidence.
  - Fail closed for unresolved actionable CodeRabbit findings.
  - Record info-only findings as `non_blocking` only with durable disposition.
  - Fail closed when pre-PR evidence is stale after source drift.

Existing CodeRabbit validation, landing-gate consumption, stale evidence, and
PR-backed `coderabbit-review live` tests remain in the focused suite to preserve
the current PR confirmation path.

## RED Run

Command:

```sh
node --test test/coderabbit-state.test.mjs
```

Result: expected failure.

```text
tests 23
pass 16
fail 7
```

Representative failures:

```text
Work item not found: pre-pr
AssertionError [ERR_ASSERTION]:
1 !== 0
expected: /CodeRabbit pre-PR review unavailable: CodeRabbit CLI missing/
actual: 'Work item not found: pre-pr\n'
expected: /Missing required operator input: CodeRabbit authentication/
actual: 'Work item not found: pre-pr\n'
expected: /CodeRabbit pre-PR review has unresolved actionable findings/
actual: 'Work item not found: pre-pr\n'
```

The failures prove the chore has not been implemented yet:

- `src/commands/coderabbit-review.ts` recognizes only the PR-backed `live`
  subcommand and the existing read-only evidence report path.
- The CLI has no pre-PR local-diff review target, base revision option,
  fixture-backed provider normalization, missing CLI/auth refusal, timeout
  refusal, info-only disposition, or stale-source handling for pre-PR review.

## Acceptance Criteria Mapping

| Acceptance criterion | RED evidence |
| --- | --- |
| A Bandit command path exists for pre-PR CodeRabbit CLI review and does not require PR context. | New tests call `bandit coderabbit-review pre-pr <ID> --base main --fixture <path>` without PR context or credentials and expect current evidence. |
| The pre-PR path can target a local review subject against an explicit base branch or base commit without opening a pull request. | The clean-path test expects `review_target: local-diff:main` and executable evidence containing `coderabbit review --agent --base main`. |
| CodeRabbit agent output is normalized into repo-native CodeRabbit evidence using shared verdict values. | Tests expect `pass`, `blocker`, and `non_blocking` verdicts in `docs/work/<ID>/coderabbit-review.md`. |
| Critical or warning/actionable CodeRabbit issues block landing until repaired or explicitly dispositioned; info-only issues may be recorded as non-blocking only with durable routing or no-action rationale. | Actionable finding tests expect a blocker and unresolved findings; info-only tests expect `non_blocking`, `resolved`, and a no-action rationale. |
| Missing CLI installation, missing authentication, provider failure, timeout, malformed output, or source drift fails closed with clear operator-input or blocker evidence and does not fall back to manual review. | New tests cover missing CLI, missing auth, timeout, and stale source. Malformed output should be added during GREEN if fixture parsing introduces a distinct refusal branch. |
| Stage 4 aggregate review evidence and `land-check` accept current pre-PR CodeRabbit CLI evidence for local-record work without requiring a GitHub PR. | Existing `land-check consumes live-normalized CodeRabbit pass evidence` remains; implementation should extend the same evidence contract to `coderabbit-agent-pre-pr` evidence. |
| The existing PR-backed `coderabbit-review live` behavior remains available for PR confirmation and fixture-backed tests. | Existing `coderabbit-review live` tests remain in the focused suite and still pass in the RED run. |
| Tests cover successful pre-PR evidence capture, missing CLI/auth refusal, provider error/timeout refusal, actionable finding refusal, info-only non-blocking disposition, stale source refusal, and preservation of the PR-backed live path. | `test/coderabbit-state.test.mjs` now contains focused tests for each listed path. |
| No automatic PR creation, merge, push, deploy, product UAT approval, paid-provider routing, broad GitHub workflow implementation, or CodeRabbit autofix behavior is introduced by this chore. | RED tests exercise only local fixture-backed `coderabbit-review pre-pr` behavior and existing local evidence files. |

## Stage-Rubric Evaluation

| Stage | Verdict | Rationale |
| --- | --- | --- |
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify `BANDIT-027` as active and RED evidence as the current next step before this artifact. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-027/brief.md` is present with scope, acceptance criteria, test plan, clean-code evidence, operator-input boundaries, improvement metadata, and expected files. |
| Stage 2: Test Design And RED Evidence | `pass` | Focused tests express the pre-PR CodeRabbit CLI review contract and fail before production implementation because the pre-PR command surface is missing. |

## Next Action

Implement the narrow pre-PR CodeRabbit CLI review path in
`src/commands/coderabbit-review.ts` and `src/state/coderabbit-review.ts` so the
focused RED tests pass. Preserve the existing PR-backed `coderabbit-review live`
path and do not introduce automatic PR creation, merge, push, deploy, product
UAT approval, paid-provider routing, broad GitHub workflow implementation, or
CodeRabbit autofix behavior.
