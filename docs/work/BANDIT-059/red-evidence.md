# BANDIT-059 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused Test Writer-owned tests define the Trust Verify Snapshot Foundation
surface before implementation. The suite fails because Bandit currently has no
`trust` command and therefore no public `bandit trust verify <snapshot.json>`
path for Work Item Snapshot schema validation, canonical snapshot hashing,
local evidence digest verification, reviewer-finding routing validation, Trust
Verdict derivation, deterministic JSON report output, explicit report writing,
or compatibility-period read-only refusal behavior.

## Test Command

```sh
node --test test/trust-verify.test.mjs
```

## Observed Output

```text
tests 8
pass 0
fail 8
trust verify accepts a complete stage-transition snapshot and emits a deterministic report failed because `bandit trust verify <snapshot.json> --json` returns `Unknown command: trust`.
trust verify fails closed for unsupported trust goals and missing schema fields failed before expected schema diagnostics because `trust` is not registered.
trust verify rejects changed evidence and unsafe evidence paths failed before expected digest/path diagnostics because `trust` is not registered.
trust verify derives needs_repair for unresolved actionable reviewer findings failed before expected JSON report output because `trust` is not registered.
trust verify derives blocked for malformed non-blocking finding dispositions failed before expected JSON report output because `trust` is not registered.
trust verify derives requires_operator when captured routing requires operator input failed before expected JSON report output because `trust` is not registered.
trust verify is read-only by default and writes reports only when requested failed because the default verifier command is missing.
trust verify rejects compatibility-period gate replacement or live execution flags failed before expected fail-closed diagnostics because `trust` is not registered.
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| Focused RED evidence proves Bandit currently lacks `bandit trust verify <snapshot.json>`, Work Item Snapshot schema validation, canonical snapshot hashing, evidence digest verification, reviewer-finding routing validation, Trust Verdict derivation, deterministic JSON report output, and explicit `--report` write behavior. | `test/trust-verify.test.mjs` uses the public CLI surface and fails 8/8 before production implementation because `trust` is not registered. |
| The snapshot schema fails closed for missing schema_version, unsupported trust_goal, missing stable work identifier, missing repo base/head refs or hashes, missing declared intent, malformed changed surfaces, missing policy context references when required by the trust goal, missing evidence digests, unsafe paths, malformed reviewer findings, and unsupported dispositions. | `trust verify fails closed for unsupported trust goals and missing schema fields` expects unsupported `safe_to_land` and missing `schema_version` diagnostics before a snapshot can be trusted. |
| Snapshot hashing is deterministic across equivalent normalized JSON input and independent of object key order, whitespace, wall-clock time, live provider state, auth state, queue state, active harness memory, or evidence file read order. | `trust verify accepts a complete stage-transition snapshot and emits a deterministic report` runs the same snapshot twice and expects byte-identical JSON output with a `sha256:` snapshot hash and no timestamp field. |
| Evidence verification reads only local repo-contained evidence references, compares content digests to expected snapshot digests, and fails closed on missing files, directory references, out-of-repo paths, digest mismatch, or changed evidence content. | `trust verify rejects changed evidence and unsafe evidence paths` mutates an evidence file after snapshot capture and also supplies `../outside.md`; it expects digest mismatch and unsafe-path refusals. |
| Reviewer-finding routing validation fails closed for unresolved blockers, unresolved actionable findings, missing non-blocking disposition, accepted findings without rationale, required operator input without requires_operator verdict, or review evidence present without corresponding captured routing data. | `trust verify derives needs_repair for unresolved actionable reviewer findings` captures unresolved `CR-1`; `trust verify derives blocked for malformed non-blocking finding dispositions` captures accepted `QWEN-1` without rationale. |
| Trust Verdict derivation emits only trusted, needs_repair, blocked, or requires_operator and separates generic trust verdicts from landing-specific interpretations such as safe-to-land. | The focused tests expect `trusted`, `needs_repair`, `blocked`, and `requires_operator` verdicts from public JSON reports and deliberately reject `safe_to_land` as a trust_goal. |
| JSON report output is reproducible and includes snapshot_hash, trust_goal, verdict, passed_checks, failed_checks, evidence verification details, reviewer-finding routing state, required operator input, and optional trust-goal-specific interpretation without nondeterministic timestamps. | The deterministic-report test parses JSON report output, checks core fields and passed checks, verifies no failed checks in the trusted case, and verifies identical output across repeated runs. |
| `bandit trust verify <snapshot.json>` is read-only by default; `--report <path>` writes only the requested report file after safe path validation and never mutates queues, active work, coordination logs, routing docs, evidence artifacts, landing artifacts, closeout artifacts, or bootstrap-gap state. | `trust verify is read-only by default and writes reports only when requested` snapshots `.bandit/events.jsonl` and `docs/work/BANDIT-059/coordination-log.jsonl`, expects default verification not to create a report, and expects `--report reports/trust/BANDIT-059.json` to write only the report while preserving workflow state. |
| The first implementation slice does not replace land-check, review evidence validation, closeout validation, coordination checks, artifact creation, test execution, reviewer invocation, model calls, work-item creation, routing, landing, or queue mutation; any cutover remains blocked on a later per-trust-goal cutover decision with reproducible parity evidence. | `trust verify rejects compatibility-period gate replacement or live execution flags` expects fail-closed refusals for `--replace-land-check` and `--run-tests`. |
| The implementation preserves Permanent Test Ownership Boundary and Bootstrap Model-Family Separation: if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation goes to Claude, and the Stage 3 Writer cannot edit tests, test helpers, fixtures, RED evidence, snapshot fixtures, or acceptance mappings. | This RED evidence, `test/trust-verify.test.mjs`, and the acceptance mapping are Codex PM/Test Writer-authored. Stage 3 must run through Claude via the bootstrap Process Adapter path, and the Stage 3 Writer has zero authority to edit tests, test helpers, fixtures, RED evidence artifacts/specs, snapshot fixtures, or acceptance mappings for `BANDIT-059`. |
| No Trust Verifier cutover, old gate replacement, live evidence capture helper, test execution, reviewer execution, model call, harness queue, auth or provider routing, live status, agent lifecycle, role input packet, execution packet, Pi/Aperture agent-scope schema/projection work, artifact input directory split, state-index persistence, local server/API mode, scheduler, worktree lifecycle, claim lease, work-surface reservation, PR/CI workflow, automatic merge/push/deploy, product UAT approval, dependency or lockfile change, installed global skill edit, external service integration, or unrelated Phase 8 cockpit feature work is introduced. | This Stage 2 step adds only focused Test Writer-owned RED tests and RED evidence artifacts. It does not add production implementation, cutover behavior, gate replacement, live execution, external services, dependency changes, installed skill edits, or unrelated cockpit work. |

## Test Ownership Boundary

This RED evidence and `test/trust-verify.test.mjs` are Codex PM/Test
Writer-authored. Codex materially edited Stage 2 RED tests and acceptance
mappings.

Stage 3 implementation must be routed to Claude through the bootstrap Process
Adapter path. The Stage 3 Writer has no authority to create, edit, delete,
format, regenerate, or mechanically adjust tests, test helpers, fixtures,
snapshot fixtures, RED evidence artifacts/specs, or acceptance mappings for
`BANDIT-059`.

## Next Action

Dispatch Stage 3 implementation for `BANDIT-059` to Claude through the
bootstrap Process Adapter path: implement the narrow read-only
`bandit trust verify <snapshot.json> [--json] [--report <path>]` compatibility
surface needed to make `test/trust-verify.test.mjs` pass. Add the `trust`
command routing, Work Item Snapshot schema validation, canonical snapshot
hashing, repo-contained evidence digest verification, reviewer-finding routing
validation, Trust Verdict derivation, deterministic JSON report output, safe
explicit report writing, and compatibility-period refusals only as needed for
this bounded slice. Keep the Stage 3 Writer away from tests, test helpers,
fixtures, snapshot fixtures, RED evidence artifacts/specs, acceptance mappings,
Trust Verifier cutover, old gate replacement, live evidence capture, test or
reviewer execution, model calls, harness queues, auth/provider routing, live
status, agent lifecycle, role input packets, execution packets,
Pi/Aperture agent-scope work, artifact input directory split, state-index
persistence, server/API mode, scheduler/worktree/claim/work-surface lifecycle,
PR/CI workflow, automatic merge/push/deploy behavior, product UAT approval,
dependency or lockfile changes, installed global skill edits, external service
integration, and unrelated Phase 8 cockpit feature work.
