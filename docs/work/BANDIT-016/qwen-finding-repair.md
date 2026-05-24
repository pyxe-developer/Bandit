# BANDIT-016 Local Qwen Finding Repair

## Status

`pass` - the persistent Local Qwen `non_blocking` findings were triaged and
repaired with focused landing-gate hardening. A second targeted hardening pass
addresses the latest narrowed Local Qwen findings for concise PM rationale and
git changed-path diagnostics.

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

## Post-Repair Rerun

The clean-worktree Local Qwen rerun at repair head
`81f603e653654558b67a32e1d2fc36201c2523c6` completed and returned a
`non_blocking` verdict. The remaining findings are narrowed to future hardening
for concrete-rationale minimum-length diagnostics and git error categorization.

## Follow-Up Repair

The clean-worktree Local Qwen rerun at repair head
`81f603e653654558b67a32e1d2fc36201c2523c6` returned a `non_blocking` verdict
with two narrowed future-hardening findings:

- Hardcoded concrete-rationale minimum-length diagnostics could reject concise
  but valid PM rationales.
- Git error categorization for review-source stale diagnostics could be clearer
  when changed-path comparison cannot resolve a review source head.

Codex PM chose targeted repair rather than no-action disposition because both
findings map to existing landing-gate refusal clarity without widening the
slice.

Repair:

- `src/commands/land-check.ts` no longer uses a fixed character-count cutoff
  for PM rationale. It rejects empty or placeholder rationale text while
  allowing concise concrete reasons such as `Accepted because docs only.`
- `src/state/git.ts` now returns categorized changed-path read failures
  instead of a bare null result. `land-check` preserves fail-closed stale
  evidence behavior and reports the failure category in the landing-gate
  diagnostics.
- `test/landing-gates.test.mjs` adds regression coverage for concise PM
  rationale and missing review-base diagnostics.

Verification:

```sh
node --test test/landing-gates.test.mjs
```

Result: `pass` - 45/45.

```sh
npm run typecheck
```

Result: `pass`.

Clean-code check: `pass` - the repair stays inside the landing-readiness and
git-helper boundary, removes a brittle heuristic, improves failure clarity,
and preserves fail-closed review-source drift behavior.

## Next Required Action

The clean-worktree Local Qwen rerun at follow-up repair head
`954a8efddfb8fa77d0fa4e0a61ed516a5f8e705f` completed and returned a
`non_blocking` verdict. The latest findings are narrowed to future hardening
for structured PM disposition fields, expanded changed-path error categories
for shallow clone or partial fetch cases, and future glob or regex
policy-pattern support if needed.

Next, perform targeted repair or explicit PM disposition hardening, then rerun:

```sh
npm run bandit -- qwen-review BANDIT-016
```

The rerun must produce a passing Local Qwen reviewer verdict before a valid
`safe-to-land` landing verdict can be recorded.
