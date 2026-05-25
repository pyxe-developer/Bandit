# BANDIT-019: Review Subject Hash Evidence Freshness

## Status

Brief created after `BANDIT-018` landing-action evidence and retrospective
closeout were recorded.

## Goal

Replace raw git `HEAD` as the primary Stage 4 review freshness identity with a
deterministic review-subject hash so evidence-only commits do not force
repeated review loops.

## Source Gap

source_gap: BANDIT-GAP-REVIEW-SUBJECT-HASH-FRESHNESS
source_work_item: BANDIT-018

## Scope

- Add a deterministic review-subject hash for Stage 4 review freshness.
- Compute the hash from review-relevant source, tests, policies, reviewer
  inputs, and work-item contract artifacts.
- Exclude terminal evidence and closeout artifacts from the hash.
- Extend review evidence and landing readiness so a raw `source_head` mismatch
  caused only by evidence artifacts does not block landing when the
  review-subject hash matches.
- Preserve fail-closed stale evidence when implementation, test, policy,
  routing, reviewer-profile, or work-contract inputs change.
- Update templates and docs so future work items use the hash-based freshness
  methodology after `BANDIT-019` lands.

## Out Of Scope

- Reworking CodeRabbit, Local Qwen, or escalated-review provider execution.
- Changing remote merge, push, deployment, or cockpit behavior.
- Fixing the Landing Agent dirty-path refusal observed during `BANDIT-018`
  unless a focused test proves it is necessary for this hash-freshness slice.
- Broad workflow state-machine or coordination primitive work.

## Acceptance Criteria

1. `land-check` accepts current Stage 4 review evidence when raw git `HEAD`
   changed only because terminal evidence, landing, retrospective, roadmap, or
   bootstrap-ledger artifacts changed and the review-subject hash is unchanged.
2. `land-check` fails closed when implementation source changes after review
   evidence even if terminal evidence artifacts are current.
3. `land-check` fails closed when review-relevant policy or reviewer-profile
   files change after review evidence.
4. Review evidence records `review_subject_hash` and identifies the hash
   inputs or policy used to compute it.
5. The hash is deterministic across repeated runs with unchanged inputs.
6. Existing Stage 4 terminal-disposition-only path behavior remains compatible
   for historical artifacts that do not yet include `review_subject_hash`.
7. `BANDIT-019` itself closes without requiring another raw-HEAD review refresh
   after evidence-only commits; its landing evidence must use the new
   hash-based freshness methodology.
8. Future work items after `BANDIT-019` use hash-based evidence freshness by
   default.

## Test Plan

- Add RED tests in `test/landing-gates.test.mjs` for unchanged
  review-subject hash with evidence-only commits.
- Add RED tests for implementation source changes invalidating the hash.
- Add RED tests for policy/reviewer-profile changes invalidating the hash.
- Add parser/validation coverage for `review_subject_hash`.
- Run `node --test --test-name-pattern "review subject hash|Stage 4"`
  focused tests.
- Run `npm test`, `npm run typecheck`, `npm run bandit -- validate`,
  `npm run bandit -- land-check BANDIT-019`, and `git diff --check` before
  landing.

## CLEAN_CODE.md Read Evidence

Codex PM read `CLEAN_CODE.md` before creating this brief on 2026-05-25. The
slice is scoped to a narrow Stage 4 freshness contract and must keep source of
truth explicit, preserve fail-closed behavior, and avoid broad landing-gate
refactors.

## Stage-Rubric Checklist

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `BANDIT-018` has landing verdict, landing action, retrospective, gap disposition, and updated context. `.bandit/bootstrap-gaps.json` links `BANDIT-GAP-REVIEW-SUBJECT-HASH-FRESHNESS` to `BANDIT-019`. |
| Stage 1: Work-Item Brief And Spec | `pass` | This brief defines goal, scope, out of scope, acceptance criteria, test plan, clean-code evidence, bootstrap gaps, expected files, implementation order, and escalation plan. |
| Stage 2: Test Design And RED Evidence | `pending` | Create `docs/work/BANDIT-019/red-evidence.md` before production implementation. |
| Stage 3: Implementation Clean-Code Rubric | `pending` | Implementation must be narrow, deterministic, and fail-closed. |
| Stage 4: Review And Cross-Model Gates | `pending` | Use hash-based freshness for `BANDIT-019` closeout after implementation. |
| Stage 5: Landing And UAT | `pending` | Chore; UAT is not applicable. |
| Stage 6: Retrospective And Improvement Capture | `pending` | Required before closing the work item. |

## Bootstrap Gaps

- CodeRabbit PR-backed review may remain unavailable for this local-record
  bootstrap chore if no PR exists; record explicit replacement evidence rather
  than claiming a CodeRabbit pass.
- Live paid-provider review may use operator-approved headless reviewer
  replacement evidence if a configured provider route is unavailable.

## Expected Files

- `src/state/review-subject-hash.ts`
- `src/state/review-evidence.ts`
- `src/state/landing-stage4.ts`
- `src/commands/land-check.ts`
- `docs/templates/review-evidence.md`
- `test/landing-gates.test.mjs`
- `docs/work/BANDIT-019/red-evidence.md`
- `docs/work/BANDIT-019/implementation-evidence.md`
- `docs/work/BANDIT-019/review-evidence.md`
- `docs/work/BANDIT-019/landing-verdict.md`
- `docs/work/BANDIT-019/landing-action.md`
- `docs/work/BANDIT-019/retrospective.md`

## Implementation Order

1. Add RED tests that prove evidence-only commits no longer stale review
   evidence when the review-subject hash matches.
2. Add RED tests that prove implementation, policy, and reviewer-profile
   changes still fail closed.
3. Implement a small review-subject hash helper with explicit include/exclude
   policy.
4. Extend review-evidence parsing/writing to allow `review_subject_hash` while
   preserving historical compatibility.
5. Update landing readiness to prefer hash comparison when review evidence has
   a hash, falling back to existing Stage 4 evidence-head behavior for older
   artifacts.
6. Update templates and `CONTEXT.md` vocabulary if the hash term becomes part
   of Bandit's operating language.
7. Record implementation evidence, review evidence, landing verdict, landing
   action, retrospective, and gap disposition using the new methodology.

## Smell Triggers And Escalation Plan

- `BANDIT-SMELL-POLICY-DRIFT`: Changing freshness authority requires focused
  review.
- `BANDIT-SMELL-PARSER-VALIDATOR`: Review-evidence parser changes require
  focused tests.
- `BANDIT-SMELL-MALFORMED-EVIDENCE`: Hash fields must validate
  deterministically.
- `BANDIT-SMELL-ADVERSARIAL-REVIEW`: Run Local Qwen and use escalated review or
  explicit replacement evidence before landing.
