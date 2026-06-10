# BANDIT-091 Stage 3 Implementation Writer Report

contract_version: 1
work_item: BANDIT-091
stage: Stage 3 implementation
author: implementation_writer (MiniMax-M3 fallback)
timestamp: 2026-06-10
verdict: safe-to-land-stage-3

## Model Routing Note

Codex authored the Stage 2 RED tests in `test/landing-gates.test.mjs`.
Under the Bootstrap Model-Family Separation rule, Stage 3 implementation
was first routed to Claude. Claude made source and template edits but
timed out at the 20-minute mark (exit code 124) before writing the
required writer artifacts, leaving Stage 3 in a state where the focused
tests passed but `npm run typecheck` failed with two TypeScript
diagnostics in `src/state/boundary-escape.ts`.

Per `docs/work/BANDIT-091/stage3-claude-timeout.md` and
`docs/work/BANDIT-091/stage3-minimax-dispatch.md`, the Work Item PM
routed the Stage 3 fallback repair to MiniMax-M3 via headless `pi`.

This writer-report records the MiniMax-M3 fallback repair only. Claude
made the original source/template additions; MiniMax-M3 made the
narrow typecheck repair.

## Authority Boundary Observed

MiniMax-M3 edited only the file explicitly authorized for the fallback
repair:

- `src/state/boundary-escape.ts` (typecheck repair only)

MiniMax-M3 did not edit:

- `test/landing-gates.test.mjs` (Test Writer-owned)
- `docs/work/BANDIT-091/red-evidence.md` (Test Writer-owned)
- `docs/templates/escape-candidate.md`
- `docs/templates/boundary-escape-disposition.md`
- `src/commands/init.ts`
- `src/commands/validate.ts`
- `src/state/templates.ts`
- `docs/work/BANDIT-091/writer-report.md` (this file, only added)
- `docs/work/BANDIT-091/implementation-evidence.md` (this file, only added)
- formation evidence, review evidence, landing evidence, UAT evidence,
  retrospective evidence, policy acceptance criteria, roadmap,
  current-context, or status routing.

The two commit-side writers files are added by this fallback report.
Claude's pre-timeout additions to the other authorized source and
template files are preserved unchanged.

## What Was Repaired

`src/state/boundary-escape.ts` failed typecheck with two
`TS2345: Argument of type 'string | undefined' is not assignable to
parameter of type 'string'` diagnostics. Both originated from passing
`errors[0]` to a `stripPrefix(value: string, prefix: string): string`
helper. `tsconfig.json` enables `noUncheckedIndexedAccess: true`, so
`errors[0]` is typed as `string | undefined` even though the guarded
`errors.length > 0` check makes it defined at runtime.

The fix narrows the type at both first-error call sites by capturing
the first error into a typed local variable and using an explicit
`!== undefined` guard:

Before:

```ts
const errors = validateEscapeCandidateFields(raw, displayPath, workItemId);
if (errors.length > 0) {
  const prefix = `${displayPath}: `;
  throw new Error(`Escape Candidate: ${stripPrefix(errors[0], prefix)}`);
}
```

After:

```ts
const errors = validateEscapeCandidateFields(raw, displayPath, workItemId);
const firstError = errors[0];
if (firstError !== undefined) {
  const prefix = `${displayPath}: `;
  throw new Error(`Escape Candidate: ${stripPrefix(firstError, prefix)}`);
}
```

The same shape was applied to
`validateBoundaryEscapeDispositionForWorkItem` for the
`Boundary Escape Disposition: ...` error path.

## Why This Fix Shape

- `errors[0]` and `errors.length > 0` both already check the same
  invariant. The change just makes the type narrowing explicit so
  `noUncheckedIndexedAccess` accepts the `stripPrefix` call.
- No non-null assertion (`!`) is used. The fix relies on a normal
  `!== undefined` narrowing check that future readers can follow.
- No diagnostic string changed. The error message format is identical
  to the pre-timeout Claude output, so the RED expectations
  (`Escape Candidate: evidence_artifacts[0].hash must be a sha256 hex digest`
  and
  `Boundary Escape Disposition: operator_input_required requires required_operator_input_status required`)
  continue to match.
- No new branches, no new helpers, no broad refactor. The behavior of
  the existing pre-timeout Claude implementation is preserved exactly.

## Files Changed By This Fallback

- `src/state/boundary-escape.ts` — narrow typecheck repair at the two
  first-error call sites.
- `docs/work/BANDIT-091/writer-report.md` — this file (added).
- `docs/work/BANDIT-091/implementation-evidence.md` — companion
  evidence file (added).

## Clean-Code Self-Check Against `CLEAN_CODE.md`

1. **Spec alignment** — the typecheck fix does not change the
   diagnostics or validation semantics. The `Escape Candidate:
   evidence_artifacts[0].hash must be a sha256 hex digest` and
   `Boundary Escape Disposition: operator_input_required requires
   required_operator_input_status required` messages preserved by the
   fix are the same diagnostics required by the Stage 2 RED tests and
   the Stage 3 implementation target.
2. **Small surface area** — the diff is two small, symmetric edits in
   one file. No unrelated code was touched.
3. **Simple design** — the fix uses the simplest structure that
   satisfies the strict TypeScript narrowing. No new helpers, no
   refactors, no early returns added.
4. **Explicit state** — no new state, no new module-level constants,
   no new exports. The fix is local to the two existing throw sites.
5. **No hidden authority** — the validator surface, prefix shape, and
   error message format are unchanged.
6. **Testable behavior** — the focused Stage 2 RED tests cover both
   call sites and continue to pass after the fix.
7. **Readable flow** — the new `firstError !== undefined` check reads
   identically to the previous `errors.length > 0` guard, just with
   the value already in hand.
8. **Locality** — both edits are in the same file and in the same
   validate-and-throw block where the original Claude implementation
   lives.
9. **Failure clarity** — the error message format is byte-identical
   to the pre-timeout Claude implementation, so fail-closed
   diagnostics remain explicit.
10. **No role erosion** — MiniMax-M3 did not edit the Test
    Writer-owned `test/landing-gates.test.mjs` or
    `red-evidence.md`. The writer report and implementation evidence
    files are explicitly authorized for Stage 3 implementation writers.
11. **Improvement capture** — the Claude-timeout fallback is recorded
    as part of this writer report so the Stage 6 retrospective can
    decide whether to keep, revise, or revert the model-family
    separation policy. No improvement disposition is created from this
    Stage 3 fallback; that is a Stage 6 Closeout Agent responsibility.

## Scope Boundary Self-Check

The fallback repair did not introduce, change, or expand:

- Boundary Contour movement policy
- Notify-And-Revert execution
- Rollback execution
- Operator attention delivery
- Boundary cell expansion or contraction
- Model gateway, model-call capture, or telemetry
- PRD-005 controller work
- Cockpit UI, local API, or State Index authority
- Hosted services or paid routing
- Merge, push, deploy, or external repo mutation
- Lockfile, package-script, or CI/release workflow changes
- UAT, product, business, policy, or explicit cost/risk posture
  changes

The fix is a local type-safety repair and does not alter the Stage 3
source authority recorded in `docs/work/BANDIT-091/brief.md` and
`docs/work/BANDIT-091/stage3-dispatch.md`.

## Operator Input Status

No operator-owned input is required for the Stage 3 typecheck repair.
All decisions taken (narrow the two first-error call sites, use
`!== undefined` narrowing, preserve all diagnostic strings) are
ordinary technical-routing decisions Codex PM can make from repo
evidence and the Stage 2 RED expectations.

## Handoff To Next Stage

Stage 3 implementation is now in a state where:

- focused Stage 2 RED tests pass,
- `npm run typecheck` passes,
- the Test Writer-owned files were not modified by MiniMax-M3,
- the Stage 3 source authority (`docs/work/BANDIT-091/brief.md`,
  `docs/work/BANDIT-091/stage3-dispatch.md`) is satisfied.

The next stage is Stage 4 review. MiniMax-M3 did not run any reviewer
or write any review, landing, UAT, retrospective, or closeout
artifact. The Stage 4 review loop remains the responsibility of the
Reviewers, Landing Agent, and Closeout Agent per
`docs/work/BANDIT-091/brief.md`.
