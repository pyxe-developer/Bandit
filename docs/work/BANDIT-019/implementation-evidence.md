# BANDIT-019 Implementation Evidence

## Status

Implementation recorded after RED evidence for review-subject hash freshness.

## Implemented Behavior

- Added `bandit review-subject-hash <work-item-id>`.
- Added deterministic review-subject hashing over review-relevant source,
  tests, policy, reviewer profile, static governance files, and selected
  work-item contract artifacts.
- Excluded terminal evidence and closeout artifacts from the hash so
  evidence-only commits do not force repeated Stage 4 review loops.
- Added optional `review_subject_hash` parsing for review evidence while
  preserving historical compatibility for older artifacts.
- Updated landing readiness to prefer review-subject hash freshness when a
  review evidence artifact records `review_subject_hash`; older artifacts still
  use existing raw-head and terminal-disposition behavior.
- Updated individual reviewer evidence freshness so CodeRabbit, Local Qwen,
  and escalated-review raw heads are audit metadata when the aggregate
  `review_subject_hash` is present and current. Source, test, policy, reviewer
  profile, and work-contract drift still fail closed through the hash.
- Updated the review-evidence template to include `review_subject_hash`.

## Acceptance Criteria Mapping

| AC | Evidence |
|---|---|
| AC1 | `land-check accepts evidence-only head changes when review subject hash matches` passes. |
| AC2 | `land-check fails closed when review subject hash changes after source edits` passes. |
| AC3 | `land-check fails closed when review subject hash changes after policy edits` passes. |
| AC4 | `src/state/review-evidence.ts` parses optional `review_subject_hash`; `docs/templates/review-evidence.md` includes the field. |
| AC5 | `bandit review-subject-hash <work-item-id>` produces a deterministic SHA-256 hash from sorted review-subject paths. |
| AC6 | Full historical landing-gate tests pass. |
| AC7 | `BANDIT-019` review and landing evidence uses `review_subject_hash`; `land-check accepts reviewer evidence heads when final review subject hash matches` proves the closeout path does not repeat the raw-head loop. |
| AC8 | `CONTEXT.md` and roadmap closeout will record the new operating vocabulary before landing. |

## Clean-Code Check

- **Spec alignment:** The implementation addresses only Stage 4 freshness
  identity and does not change provider execution, remote landing, or cockpit
  scope.
- **Small surface area:** Changes are limited to a hash helper, a small CLI
  command, review-evidence parsing/template support, landing-readiness
  freshness logic, and focused tests.
- **Simple design:** The hash helper uses a fixed include/exclude policy and
  sorted tracked paths; it does not introduce a database or hidden cache.
- **Explicit state:** `review_subject_hash` becomes visible in review evidence.
- **Failure clarity:** Hash drift reports `Review subject hash is stale`.
- **Testable behavior:** Focused tests prove evidence-only commits pass while
  source and policy edits fail closed, and reviewer evidence raw-head drift does
  not override a current aggregate review-subject hash.

## Verification

```sh
node --test --test-name-pattern "review subject hash" test/landing-gates.test.mjs
```

Result: `pass` - 4 focused hash-freshness tests passed.

Closeout repair added one focused regression:

- `land-check accepts reviewer evidence heads when final review subject hash matches`

This prevents the exact BANDIT-019 self-closeout loop where Local Qwen evidence
was historically recorded at the reviewed implementation head, while final
review evidence was refreshed at the complete review-subject hash.

```sh
npm run typecheck
```

Result: `pass`.

```sh
npm test
```

Result: `pass` - 168 tests passed.

```sh
npm run bandit -- validate
```

Result: `pass`.

```sh
git diff --check
```

Result: `pass`.

## Stage-Rubric Check

| Stage | Verdict | Evidence |
|---|---|
| Stage 2: Test Design And RED Evidence | `pass` | `docs/work/BANDIT-019/red-evidence.md` records the expected failing test output. |
| Stage 3: Implementation Clean-Code Rubric | `pass` | Focused and full verification passed; implementation is narrow and fail-closed. |
| Stage 4: Review And Cross-Model Gates | `pass` | `BANDIT-019` review evidence records `review_subject_hash`; Local Qwen passed and reviewer raw-head drift is covered by the aggregate hash freshness test. |

## Next Step

Commit the reviewer-freshness repair, recompute the `BANDIT-019`
review-subject hash, and refresh review evidence using the final hash-based
freshness methodology.
