# BANDIT-016 Local Qwen Finding Repair

## Status

`pass` - the persistent Local Qwen `non_blocking` findings were triaged and
repaired with focused landing-gate hardening.

## Findings

Local Qwen reported two non-blocking hardening concerns after the clean
rerun:

- `hasConcretePmRationale` used a broad `because|rationale` regex that could
  accept boilerplate or miss clearer explicit-rationale formats.
- `isReviewSourceStale` depended on `readGitChangedPaths` returning `null`
  for git diff errors, so the changed-path read needed a more explicit
  fail-closed path for unusual git states such as missing bases or detached
  heads.

## Repair

- `src/commands/land-check.ts` now requires a concrete explanation after an
  accepted rationale marker. Boilerplate markers such as `Rationale: pending`
  remain blocking, while explicit reasons such as `Accepted because ...`
  satisfy the PM-rationale gate.
- `src/state/git.ts` now reads changed paths with explicit git diff revision
  arguments, `--no-ext-diff`, a pathspec separator, and the same larger buffer
  used by other git helpers. If git cannot resolve the changed paths, landing
  readiness still fails closed as stale review evidence.
- `test/landing-gates.test.mjs` adds regression coverage for boilerplate PM
  rationale rejection, concrete PM rationale acceptance, and unresolved review
  changed-path bases failing closed.

## Verification

```sh
node --test test/landing-gates.test.mjs
```

Result: `pass` - 44/44.

## Clean-Code Check

`pass` - the repair is limited to the reviewed landing-readiness path, keeps
source freshness fail-closed, makes rationale validation easier to reason
about, and adds focused behavioral tests without adding hidden state or new
workflow authority.

## Next Required Action

After this repair is committed at a focused source head, rerun:

```sh
npm run bandit -- qwen-review BANDIT-016
```

The rerun must happen from a clean worktree before a valid `safe-to-land`
landing verdict can be recorded.
