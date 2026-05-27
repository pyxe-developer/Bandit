# BANDIT-035 RED Evidence

## Summary

Stage 2 RED evidence is recorded for Artifact Create Landing Work Item Field
before production implementation. The focused test defines the missing
`landing_verdict` renderer contract: generated landing verdict Markdown must
include `work_item` metadata matching the target work item and remain parseable
by Bandit's existing landing-verdict validation path.

Production code is intentionally unchanged in this step. The new test fails
because `renderLandingVerdict` renders `contract_version` and the remaining
landing fields but omits the required `work_item` metadata field.

## Test Added

- `test/artifact-create.test.mjs`
  - `artifact create renders landing verdict work_item metadata for parser compatibility`
    creates a landing-verdict artifact from explicit structured input, requires
    the generated Markdown to include `work_item: BANDIT-001`, and then runs
    `bandit validate` to prove parser compatibility once the renderer is
    repaired.

## RED Run

Command:

```sh
node --test test/artifact-create.test.mjs
```

Result: expected failure.

```text
tests 8
pass 7
fail 1
```

Representative failure:

```text
artifact create renders landing verdict work_item metadata for parser compatibility
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /^work_item: BANDIT-001$/m.
```

The rendered artifact currently begins with:

```text
# BANDIT-001 Landing Verdict

contract_version: 1
source_head: abc123
review_evidence: docs/work/BANDIT-001/review-evidence.md
```

The failure proves the missing behavior: `bandit artifact create` accepts a
`work_item` value in the structured spec but does not render that value into the
canonical `landing-verdict.md` artifact, so a generated landing verdict cannot
satisfy the existing landing-verdict parser's required scalar fields.

## Acceptance Criteria Mapping

| Acceptance criterion | RED evidence |
| --- | --- |
| artifact create renders landing_verdict artifacts with a work_item field whose value matches the spec target work item. | The new focused test requires `^work_item: BANDIT-001$` in the generated landing verdict and fails before implementation because the field is absent. |
| Focused tests fail before implementation and pass after implementation for the missing work_item field. | `node --test test/artifact-create.test.mjs` now has one expected failure and seven passing tests with production code unchanged. |
| Focused tests cover that the generated landing verdict remains compatible with landing-verdict parsing or land-check validation. | After checking the rendered `work_item` metadata, the new test runs `bandit validate`; this will exercise the existing landing-verdict parser once the missing field is rendered. |
| The implementation does not weaken required landing verdict fields, stale evidence checks, review gates, clean-code checks, UAT handling, or final verdict semantics. | The RED test adds one required field assertion and reuses the existing validation path; it does not change production code or loosen any gate expectations. |
| The implementation preserves artifact-create refusal behavior for malformed specs, unsupported kinds, unknown work items, occupied paths, and out-of-repo paths. | Existing refusal-path tests in `test/artifact-create.test.mjs` remain in the focused run and still pass. |
| No local server/API mode, state-index persistence, scheduler execution, worktree lifecycle, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, claim leases, work surface reservations, PR/CI workflow, or unrelated Phase 8 work is introduced. | The RED step changes only `test/artifact-create.test.mjs` and this Stage 2 evidence artifact; no product, cockpit, scheduler, claim, worktree, PR/CI, or server/API surface is touched. |

## Stage-Rubric Evaluation

| Stage | Verdict | Rationale |
| --- | --- | --- |
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md` and `ROADMAP.md` identify `BANDIT-035` as active, `BANDIT-034` is landed and closed out, and Stage 2 RED evidence is the current recorded action before this artifact. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-035/brief.md` records the bootstrap-gap origin, scope, acceptance criteria, verification plan, expected files, operator-input status, and CLEAN_CODE.md read evidence. |
| Stage 2: Test Design And RED Evidence | `pass` | The focused test expresses the landing-verdict `work_item` metadata contract and fails before production implementation because the renderer omits that required field. Production code is unchanged. |

## Next Action

Implement the focused `landing_verdict` renderer repair in
`src/commands/artifact-create-renderers.ts` so generated landing verdicts
include `work_item: <ID>` and the focused artifact-create test passes. Preserve
existing structured input validation, safe path checks, no-overwrite behavior,
lifecycle event writes, repo-native Markdown authority, landing-gate semantics,
UAT handling, clean-code gate semantics, final-verdict validation, and the
explicit exclusion of local server/API mode, state-index persistence, scheduler
execution, worktree lifecycle, automatic merge/push/deploy, product UAT
approval, actor identity policy, claim leases, work surface reservations,
PR/CI workflow, policy changes, business tradeoffs, cost/risk overrides, and
unrelated Phase 8 work.
