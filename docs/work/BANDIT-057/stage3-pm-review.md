# BANDIT-057 Stage 3 PM Review

## Current Verdict

`pass`

Codex PM accepts the fourth-pass Claude Writer repair for Stage 3. The repair
clears the Formation Gate / generated brief contract mismatch: the active
`BANDIT-057` brief now passes deterministic formation validation and
`repo-pm approve-formation BANDIT-057` reaches the expected missing formation
review artifact gate instead of failing on brief shape.

Stage 3 may proceed to Stage 4 review. Do not land, close out, or begin another
work item before CodeRabbit, Local Qwen, aggregate review evidence,
risk-classification evidence, supply-chain evidence, landing verdict, landing
action, retrospective, and bootstrap-gap disposition are recorded.

## Verdict

`blocker`

Stage 3 implementation evidence is recorded, the focused RED suite passes, and
the Writer preserved the test-surface boundary. Codex PM does not accept the
Stage 3 implementation yet because the implementation does not satisfy the full
Formation Gate and Work Item PM readiness contract from the brief and accepted
design.

## Evidence Reviewed

- `docs/work/BANDIT-057/brief.md`
- `docs/work/BANDIT-057/red-evidence.md`
- `docs/work/BANDIT-057/dispatch.md`
- `docs/work/BANDIT-057/implementation-evidence.md`
- `docs/specs/BANDIT-057-implementation-evidence.json`
- `docs/work/BANDIT-057/writer-report.md`
- `docs/design/role-scoped-workflow-orchestration.md`
- `docs/decisions/2026-06-01-explicit-role-entrypoints-and-formation-gate.md`
- `src/commands/repo-pm.ts`
- `src/commands/work-item-pm.ts`
- `src/state/formation-gate.ts`
- `src/state/coordination-log.ts`
- `src/state/bootstrap-gaps.ts`
- `src/cli.ts`

## Passing Findings

- Writer identity evidence records `claude_process_adapter` and `model_family:
  claude`, preserving Bootstrap Model-Family Separation after Codex-authored RED
  tests.
- The dirty changed-path set stays within the Writer-dispatch production,
  template, and Stage 3 evidence surfaces plus PM-owned context synchronization.
- No test, test helper, fixture, RED evidence artifact, or acceptance mapping
  was changed by the Stage 3 Writer.
- `replaced` bootstrap-gap disposition support, bare role-required invocation
  refusal, `repo-pm create-work-item`, `formation_approved` coordination state,
  and basic Work Item PM readiness refusal are implemented narrowly enough for
  the focused RED suite.

## Blockers

1. `repo-pm approve-formation` only requires formation review artifact paths to
   exist. It does not inspect aggregate formation evidence for blocker findings
   or undispositioned non-blocking findings, even though the brief requires
   formation approval to fail closed until blockers are absent or repaired and
   non-blocking formation findings are dispositioned.

2. Deterministic formation validation does not enforce every required minimum
   from the dispatch packet and brief. It checks section presence for scope,
   acceptance criteria, operator input, role boundary evidence, and write
   surfaces, but it does not explicitly validate source provenance, Test Writer
   boundary evidence, Implementation Writer boundary evidence, or execution
   readiness.

3. `work-item-pm start` accepts readiness from the mere presence of a
   `formation_approved` transition. It does not re-check approved formation
   evidence, blocker formation findings, undispositioned non-blocking formation
   findings, missing operator-owned input, stale formation evidence, or
   contradictory formation evidence before reporting the work item ready.

## Clean-Code Rubric

The current implementation is small and readable, but the acceptance gaps above
are blocker-level failures under:

- Spec alignment: Formation Gate approval semantics are weaker than the
  accepted work-item contract.
- Failure clarity: approval/readiness can pass with unsupported formation review
  contents.
- Testable behavior: important formation-review and readiness refusal paths are
  not covered by the focused tests or separate bootstrap-gap evidence.
- No role erosion: Work Item PM readiness must not infer execution availability
  from an incomplete formation approval.

## Required Repair

Dispatch a Stage 3 repair to Claude Implementation Writer. The repair must stay
inside the existing Writer-owned production/template/evidence surfaces and must
not edit tests, test helpers, fixtures, RED evidence artifacts/specs, acceptance
mappings, review evidence, landing evidence, retrospective evidence, dependency
files, installed global skills, or unrelated Phase 8 cockpit work.

The repair should add fail-closed formation review content validation and Work
Item PM readiness checks for the blockers above, then refresh Stage 3
implementation evidence and Writer report. Codex PM should rerun focused Stage
3 verification before allowing Stage 4 review.

## Next Action

Stage 3 repair dispatch to Claude Implementation Writer for the blockers in
this review. Do not start Stage 4 CodeRabbit, Local Qwen, aggregate review,
landing, closeout, another work item, or unrelated Phase 8 work until repaired
Stage 3 evidence is recorded and accepted by Codex PM.

## Repair Review - 2026-06-01T14:13:54Z

### Verdict

`blocker`

The operator ran the bounded Claude Writer repair manually and reported it took
9 minutes. Codex PM reviewed the refreshed Writer evidence in
`docs/work/BANDIT-057/writer-report.md`,
`docs/work/BANDIT-057/implementation-evidence.md`, and
`docs/specs/BANDIT-057-implementation-evidence.json`, then inspected the
repaired implementation.

### Passing Findings

- The repair stayed inside the allowed Writer-owned source and Stage 3 evidence
  surfaces.
- No tests, test helpers, fixtures, RED evidence artifacts/specs, PM review,
  roadmap/status/context, review, landing, or retrospective evidence were edited
  by the Writer.
- Deterministic formation validation now checks source provenance, execution
  readiness, and explicit Test Writer / Implementation Writer boundary evidence.
- `work-item-pm start` now re-reads `formation_approved` evidence paths and
  rechecks formation evidence before reporting readiness.

### Remaining Blocker

`inspectFormationReviewContent` is still not fail-closed enough for formation
findings. It only blocks when `findings_status` contains `blocker` or
`findings_disposition` contains `undispositioned`. A formation artifact with
`findings_status: non_blocking` and an empty `findings_disposition` passes, even
though the brief requires non-blocking formation findings to be dispositioned.
Likewise, an artifact with `verdict: blocker`, `findings_status: open`, and an
empty disposition passes approval inspection.

This leaves `repo-pm approve-formation` able to approve unsupported review
metadata shapes that still represent unresolved findings. The behavior was
confirmed with a throwaway runtime probe against `inspectFormationReviewContent`.

### Required Repair

Dispatch a narrow Stage 3 repair to Claude Implementation Writer. Keep the
repair inside `src/state/formation-gate.ts` and refreshed Stage 3 Writer
evidence unless the Writer proves another allowed path is required. The repair
must fail closed when formation review metadata is missing, empty, contradictory,
or indicates open/non-blocking/blocker findings without an explicit acceptable
disposition. Do not edit tests, RED evidence, PM review, roadmap/status/context,
review, landing, retrospective, dependencies, lockfiles, or unrelated Phase 8
work.

### Verification Run By Codex PM

- `node --test test/role-entrypoints-formation.test.mjs` - pass
- `node --test test/bootstrap-gaps.test.mjs` - pass
- `node --test test/work-item-create.test.mjs` - pass
- `node --test test/coordination-log.test.mjs test/coordination-status.test.mjs` - pass
- `npm run typecheck` - pass
- `npm run bandit -- validate` - pass
- `node ./bin/bandit.mjs cockpit status --json` - pass
- `node ./bin/bandit.mjs session-context current --json` - pass
- `git diff --check` - pass

### Next Action

Bounded Claude Implementation Writer repair for the remaining
formation-review metadata fail-closed gap. Do not start Stage 4 review, landing,
closeout, another work item, or unrelated Phase 8 work until repaired Stage 3
evidence is recorded and accepted by Codex PM.

## Second-Pass Repair Review - 2026-06-01T14:41:32Z

### Verdict

`blocker`

Codex PM reviewed the second-pass Claude Writer evidence and inspected
`src/state/formation-gate.ts` against `CLEAN_CODE.md` and the Stage 3
Implementation Clean-Code rubric. The repair is narrower and fixes the
previously identified missing `findings_status`, unsupported status,
`findings_status: open`, and `findings_status: non_blocking` without
disposition cases. Stage 3 is still not accepted because contradictory
formation-review metadata can still pass approval inspection.

### Passing Findings

- The second-pass repair stayed inside `src/state/formation-gate.ts` and
  refreshed Stage 3 Writer evidence.
- The Writer preserved the test-surface boundary: no tests, test helpers,
  fixtures, RED evidence artifacts/specs, acceptance mappings, PM review,
  roadmap/status/context, review, landing, or retrospective evidence were
  edited by the Writer.
- Writer identity evidence remains `claude_process_adapter` and `model_family:
  claude`, preserving Bootstrap Model-Family Separation after Codex-authored RED
  evidence.
- `inspectFormationReviewContent` now fails closed for missing
  `findings_status`, unsupported `findings_status`, `findings_status: open`,
  `findings_status: blocker`, `findings_status: non_blocking` with empty or
  undispositioned `findings_disposition`, and explicit
  `findings_disposition: undispositioned`.

### Remaining Blocker

Formation review artifacts still carry both `verdict` and `findings_status`
metadata, but approval inspection only treats `findings_status` as authoritative
inside a single artifact. A review artifact with `verdict: blocker`,
`findings_status: none`, and `findings_disposition: no unresolved findings`
passes `inspectFormationReviewContent`, even though the brief and accepted
design require blocker formation findings to be absent or repaired before
formation approval.

Codex PM confirmed the failure mode with a throwaway runtime probe against
`inspectFormationReviewContent`: three formation-review artifacts containing
`verdict: blocker` plus `findings_status: none` returned success instead of a
fail-closed diagnostic. This is a Stage 3 blocker under:

- Spec alignment: blocker formation-review verdicts can still approve
  formation.
- Failure clarity: contradictory review metadata is not rejected at the artifact
  boundary.
- Testable behavior: the current focused RED suite does not directly exercise
  artifact-internal verdict/status contradictions, and no bootstrap gap evidence
  records that as acceptable.

### Required Repair

Dispatch a narrow Stage 3 repair to Claude Implementation Writer. Keep the
repair inside `src/state/formation-gate.ts` and refreshed Stage 3 Writer
evidence unless the Writer proves another allowed path is required. The repair
must make formation review metadata internally consistent before approval:
block or fail closed when `verdict` is missing or unsupported, when `verdict`
is `blocker` or `fail`, when `verdict` contradicts `findings_status`, or when
`findings_status`/`findings_disposition` indicate unresolved or
undispositioned findings. Do not edit tests, RED evidence, PM review,
roadmap/status/context, review, landing, retrospective, dependencies, lockfiles,
or unrelated Phase 8 work.

### Verification Run By Codex PM

- Throwaway runtime probe against `inspectFormationReviewContent` - blocker
  reproduced; contradictory `verdict: blocker` plus `findings_status: none`
  passed unexpectedly.

### Next Action

Bounded Claude Implementation Writer repair for formation-review metadata
internal consistency. Do not start Stage 4 review, landing, closeout, another
work item, or unrelated Phase 8 work until repaired Stage 3 evidence is
recorded and accepted by Codex PM.

## Third-Pass Repair Review - 2026-06-01T15:22:00Z

### Verdict

`blocker`

Codex PM reviewed the third-pass Claude Writer evidence against `CLEAN_CODE.md`
and the Stage 3 Implementation Clean-Code rubric. The third-pass repair fixes
the previously identified formation-review metadata contradiction: `verdict:
blocker` plus `findings_status: none` now fails closed, and missing or
unsupported verdict values are rejected before approval.

Stage 3 is still not accepted because the Formation Gate contract is not
aligned with Bandit's own generated work-item briefs or the active `BANDIT-057`
brief. `repo-pm approve-formation BANDIT-057` fails before review-artifact
inspection with:

```text
Formation validation failed for docs/work/BANDIT-057/brief.md: missing work type; missing out-of-scope boundaries; missing role boundary evidence; missing write-surface families
```

This means the new Formation Gate cannot approve the current work item it is
being built under, and `repo-pm create-work-item` still creates chore briefs
that omit the metadata sections the gate now requires (`work_type`, explicit
role-boundary evidence, write-surface families, and the exact out-of-scope
section name). That is a Stage 3 blocker under spec alignment, failure clarity,
and source-of-truth consistency: the CLI-owned creation path and CLI-owned
formation-validation path disagree on what a formed Bandit work item is.

### Passing Findings

- The third-pass repair stayed inside `src/state/formation-gate.ts` and
  refreshed Stage 3 Writer evidence.
- The Writer preserved the test-surface boundary: no tests, test helpers,
  fixtures, RED evidence artifacts/specs, acceptance mappings, PM review,
  roadmap/status/context, review, landing, or retrospective evidence were
  edited by the Writer.
- Writer identity evidence remains `claude_process_adapter` and `model_family:
  claude`, preserving Bootstrap Model-Family Separation after Codex-authored RED
  evidence.
- `inspectFormationReviewContent` now fails closed for missing verdict,
  unsupported verdict, `verdict: blocker`, `verdict: fail`, missing
  `findings_status`, unsupported `findings_status`, `findings_status: open`,
  `findings_status: blocker`, `findings_status: non_blocking` without an
  acceptable disposition, and explicit `findings_disposition: undispositioned`.

### Remaining Blocker

Formation validation now requires brief fields and section names that are not
produced by the existing work-item creation path and are not present in the
active `BANDIT-057` brief. The accepted design requires Repo PM creation and
Formation Gate validation to work as one contract: Repo PM-created work items
must include enough formation metadata for deterministic validation, and
formation validation must consume the repo-native brief shape instead of
requiring ad hoc fixture-only metadata.

### Required Repair

Dispatch a narrow Stage 3 repair to Claude Implementation Writer. Keep the
repair inside Writer-owned production/template/evidence surfaces unless the
Writer proves another allowed path is required. The repair must align
`repo-pm create-work-item` / work-item brief rendering with
`validateFormationBrief`, or make `validateFormationBrief` consume the existing
repo-native brief sections correctly, so the active `BANDIT-057` brief and
future Repo PM-created briefs can reach review-artifact validation when their
formation metadata is otherwise complete.

Do not edit tests, RED evidence, PM review, roadmap/status/context, review,
landing, retrospective, dependencies, lockfiles, installed global skills, or
unrelated Phase 8 work.

### Verification Run By Codex PM

- `node ./bin/bandit.mjs repo-pm approve-formation BANDIT-057` - blocker
  reproduced; active brief fails deterministic formation validation before
  review-artifact checks.
- `node --test test/role-entrypoints-formation.test.mjs` - pass
- `node --test test/bootstrap-gaps.test.mjs test/work-item-create.test.mjs test/coordination-log.test.mjs test/coordination-status.test.mjs` - pass
- `npm run typecheck` - pass

### Next Action

Bounded Claude Implementation Writer repair for the Formation Gate / generated
brief contract mismatch. Do not start Stage 4 review, landing, closeout,
another work item, or unrelated Phase 8 work until repaired Stage 3 evidence is
recorded and accepted by Codex PM.

## Fourth-Pass Acceptance Review - 2026-06-01T15:44:30Z

### Verdict

`pass`

Codex PM reviewed the fourth-pass Claude Writer repair against `CLEAN_CODE.md`
and the Stage 3 Implementation Clean-Code rubric. The fourth-pass repair is
accepted.

### Passing Findings

- `repo-pm approve-formation BANDIT-057` now passes deterministic brief
  validation and fails only at the expected missing review-artifact gate:
  `docs/work/BANDIT-057/qwen-formation-review.md`,
  `docs/work/BANDIT-057/coderabbit-formation-review.md`, and
  `docs/work/BANDIT-057/formation-review.md`.
- Runtime probes confirmed the prior fail-open formation review metadata cases
  now fail closed: missing `verdict`, `verdict: blocker` with
  `findings_status: none`, `findings_status: open`, and
  `findings_status: non_blocking` with empty disposition.
- The focused RED suite and supporting suites pass.
- `npm run typecheck`, `npm run bandit -- validate`, cockpit status,
  session-context current, and `git diff --check` pass.
- The Writer preserved the test-surface boundary: no tests, test helpers,
  fixtures, RED evidence artifacts/specs, acceptance mappings, review evidence,
  landing evidence, or retrospective evidence were edited by the Stage 3
  Writer.
- Writer identity remains `claude_process_adapter` with `model_family: claude`,
  preserving Bootstrap Model-Family Separation after Codex-authored Stage 2 RED
  evidence.

### Clean-Code Rubric

- Spec alignment: pass. The implementation satisfies the accepted Formation
  Gate and Work Item PM readiness contract without broadening the slice.
- Small surface area: pass. Repairs stayed in the declared production and Stage
  3 evidence surfaces.
- Simple design and readable flow: pass. Formation validation remains explicit,
  fail-closed, and localized in `src/state/formation-gate.ts`.
- Explicit state and no hidden authority: pass. Formation approval remains an
  append-only coordination transition backed by review artifact evidence.
- Testable behavior: pass with PM runtime probe coverage for the previously
  hidden metadata contradictions and the existing focused/supporting suites.
- Failure clarity: pass. Unsupported, missing, contradictory, blocker, open, and
  undispositioned formation review states produce explicit refusal messages.
- No role erosion: pass. Stage 3 remained Claude-authored and did not modify
  Test Writer-owned surfaces.
- Improvement capture: pass. No new bootstrap gap is required from this Stage 3
  acceptance review.

### Verification Run By Codex PM

- `node ./bin/bandit.mjs repo-pm approve-formation BANDIT-057` - expected
  missing review-artifact refusal; no deterministic brief-validation failure.
- `npx tsx --eval <formation metadata probe>` - pass.
- `node --test test/role-entrypoints-formation.test.mjs` - pass.
- `node --test test/bootstrap-gaps.test.mjs` - pass.
- `node --test test/work-item-create.test.mjs` - pass.
- `node --test test/coordination-log.test.mjs test/coordination-status.test.mjs`
  - pass.
- `npm run typecheck` - pass.
- `npm run bandit -- validate` - pass.
- `node ./bin/bandit.mjs cockpit status --json` - pass before context update.
- `node ./bin/bandit.mjs session-context current --json` - pass before context
  update.
- `git diff --check` - pass.

### Next Action

Run focused pre-PR CodeRabbit review for `BANDIT-057` at the accepted Stage 3
implementation head. Do not run Local Qwen, aggregate Stage 4 review, landing,
closeout, another work item, or unrelated Phase 8 work until CodeRabbit
evidence is recorded or an honest provider-refusal/continuation artifact is
recorded.
