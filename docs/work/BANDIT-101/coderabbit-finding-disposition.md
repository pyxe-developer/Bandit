# BANDIT-101 CodeRabbit Finding Disposition

contract_version: 1
work_item: BANDIT-101
stage: Stage 4 Review And Cross-Model Gates
recorded_at: 2026-06-13T21:08:14Z
reviewer: coderabbit
review_output: docs/work/BANDIT-101/coderabbit-run-logs/BANDIT-101-coderabbit-refresh-final-10-retry-9.log
disposition_status: critical_major_resolved_or_pm_dispositioned
stage_status: coderabbit_terminal_frozen_subject
operator_input_status: none_required

CodeRabbit completed multiple Stage 4 uncommitted-diff reviews. The loop became self-amplifying as evidence repairs changed the reviewed diff, so PM froze the review subject after the final completed post-repair run. All material critical/major findings on source behavior and acceptance coverage have been repaired. Evidence-wording, dispatch-documentation, and dead-code cleanup findings are dispositioned without further CodeRabbit runs under the operator instruction to avoid artifact churn.

## Findings

| Severity | File | Disposition | Evidence |
| --- | --- | --- | --- |
| major | `docs/work/BANDIT-101/writer-report.md` | repaired | The `npm test` evidence block now includes the current Node test-run summary, including `1..664`, `# tests 684`, `# pass 684`, and `# fail 0`, plus an explanatory note that Node TAP plan count and nested summary count differ by design. |
| major | `docs/work/BANDIT-101/writer-report.md` | repaired | The unconditional "this continuation did not change" sentence was replaced with an accurate report-scoped statement. PM attribution remains in `docs/work/BANDIT-101/stage3-pm-acceptance.md`. |
| major | `src/commands/init.ts` | repaired | `validateTypedProfileReviewers` now fails closed when parsed reviewer entries and raw reviewer entries diverge instead of silently returning an unsafe cast. |
| minor | `src/state/reviewer-adapters.ts` | repaired | `recordNoReviewerBootstrapGap` now returns `recorded: false` and skips rewriting the ledger when the no-reviewer gap is already present. |
| trivial | `src/state/project-profile.ts` | repaired | Profile JSON is parsed once; `readProjectProfileWithRawReviewers` exposes the typed profile plus raw reviewer entries without a second synchronous file read. |
| minor | `docs/work/BANDIT-101/writer-report.md` | repaired | The clean-code self-check now references the approved work-item acceptance criteria instead of Stage 1 acceptance criteria. |
| major | `test/landing-gates.test.mjs` / `src/commands/land-check.ts` | repaired | Added blocker and stale human-review replacement evidence tests, and made `land-check` fail closed when human review replacement evidence has `reviewer_verdict: blocker` or non-current `source_drift_status`. |
| major | `src/commands/init.ts` | repaired | Normalized reviewer `id`, `type`, `provider`, and `required` now win over raw spread fields before typed adapter validation. |
| trivial | `src/state/reviewer-adapters.ts` | repaired | Human reviewer `evidence_path` now rejects bare `docs/work/` paths and requires a concrete docs/work path when no placeholder is present. |
| trivial | `src/state/reviewer-adapters.ts` | repaired | `validateTypedReviewerAdapter` now has explicit documentation describing legacy untyped reviewer behavior. |
| trivial | `src/state/reviewer-adapters.ts` | repaired | The no-reviewer gap push and persistence now share one `if (!alreadyRecorded)` block. |
| trivial | `src/state/paths.ts` / `src/state/reviewer-adapters.ts` | repaired | `getBanditPaths` now exposes `reviewersDir`, and adapter scaffolding uses that explicit path. |
| trivial | `.bandit/policy/supply-chain-gate.json` | repaired | Policy release-authorized decisions are sorted by numeric work item ID so `BANDIT-101` precedes `BANDIT-104`. |
| minor | `src/commands/init.ts` / `src/state/reviewer-adapters.ts` | repaired | Reviewer adapters without a non-empty `type` now fail closed with a `reviewers[index].type` diagnostic, and init scaffolding no longer silently skips falsy reviewer types. |
| major | `src/state/project-profile.ts` | repaired | `readRawReviewerEntries` still returns an empty list when `reviewers` is absent, but throws a descriptive profile error when `reviewers` is present and not an array. |
| critical | `.bandit/policy/supply-chain-gates/BANDIT-101-supply-chain-gate.json` | repaired | Added `docs/work/BANDIT-101/coderabbit-review.md`, the CodeRabbit evidence artifact referenced by the supply-chain gate. |
| trivial | `src/state/reviewer-adapters.ts` | repaired | `provider_base_url` validation now uses `new URL(...)` and accepts only parsed `http:` or `https:` URLs with a non-empty hostname. |
| major | `src/state/reviewer-adapters.ts` / `src/commands/land-check.ts` | repaired | Human reviewer adapter `evidence_path` now requires the canonical `human-review.md` filename and a work-item placeholder, matching `land-check` replacement discovery. |
| critical | `src/commands/land-check.ts` | repaired | `hasOpenNoReviewerGap` is null-safe and treats a missing bootstrap-gap ledger as no open no-reviewer gap. |
| minor | `docs/work/BANDIT-101/stage3-pm-acceptance.md` | repaired | PM verification now records concrete terminal summaries for reviewer-adapter, Local Qwen, landing-gate, and typecheck commands, plus RED-to-GREEN status for the seven original RED tests. |
| major | `src/state/reviewer-adapters.ts` | repaired | `readJsonOrEmptyLedger` now throws on shape-invalid bootstrap-gap ledger JSON instead of treating malformed data as an empty ledger. |
| major | `test/landing-gates.test.mjs` / `src/commands/land-check.ts` | repaired | Added a complementary test for a declared no-reviewer gap with a missing ledger entry, and made `hasOpenNoReviewerGap` treat declared-but-missing no-reviewer gaps as open. |
| major | `test/init.test.mjs` / `docs/work/BANDIT-101/red-evidence.md` / `docs/work/BANDIT-101/stage3-pm-acceptance.md` | repaired | The ACME profile fixture is documented as a Stage 4 Work Item PM reviewer repair and now uses the approved typed `openai_compatible` adapter shape instead of the legacy untyped reviewer entry. |
| minor | `docs/work/BANDIT-101/implementation-evidence.md` | repaired | The Source And Config Changes list now includes `src/state/paths.ts`, matching the reviewersDir path exposure. |
| major | `src/state/reviewer-adapters.ts` | repaired | Human reviewer `evidence_path` validation now accepts only the exact `docs/work/<ID>/human-review.md` or `docs/work/{work_item_id}/human-review.md` templates, blocking traversal-shaped templates. |
| minor | `src/state/reviewer-adapters.ts` | repaired | `readJsonOrEmptyLedger` now validates ledger version and each gap entry's core shape before returning typed gap data. |
| minor | `docs/work/BANDIT-101/coderabbit-finding-disposition.md` / `docs/work/BANDIT-101/writer-report.md` | repaired | Stage 4 evidence now consistently reports the current `npm test` summary with `1..664`, `# tests 684`, and `# pass 684`. |
| major | `src/commands/land-check.ts` | repaired | `hasOpenNoReviewerGap` now preserves `status: "open"` as blocking even if a malformed entry also claims `disposition: "resolved"`. |
| major | `src/commands/init.ts` | repaired | Typed reviewer validation now receives the raw `id`, `type`, `provider`, and `required` values without `String(...)` or `Boolean(...)` coercion. |
| minor | `test/reviewer-adapters.test.mjs` | repaired | The no-reviewer bootstrap-gap test now asserts exact canonical gap id, status, disposition, and next-action contract values. |
| trivial | `src/commands/land-check.ts` | repaired | Added short comments documenting missing-ledger fallback, terminal status precedence, and open/disposition blocking semantics in `hasOpenNoReviewerGap`. |
| trivial | `src/commands/init.ts` | repaired | Added a short comment documenting the `readProjectProfileWithRawReviewers` / `validateTypedProfileReviewers` index-alignment contract. |
| trivial | `src/state/bootstrap-gaps.ts` | repaired | Added a doc comment clarifying when `readOptionalBootstrapGaps` is appropriate versus fail-closed `readBootstrapGaps`. |
| major | `test/reviewer-adapters.test.mjs` | repaired | The duplicate Local Qwen adapter-shape test now uses an isolated temp fixture; the committed baseline remains covered by `test/local-qwen-review.test.mjs`. |
| trivial | `test/reviewer-adapters.test.mjs` | repaired | The noncanonical human-review path test now asserts the canonical `human-review.md` validation message. |
| major | `docs/work/BANDIT-101/coordination-log.jsonl` / `docs/work/BANDIT-101/coderabbit-review.md` | repaired | A follow-up coordination actor event records that CodeRabbit refresh-final-4 returned findings and Stage 4 remained pending; `coderabbit-review.md` now explains that sequence 6 was a PM repair event, not Stage 4 closure. |
| trivial | `src/commands/init.ts` | repaired | Removed the `profilePath as string` assertion by carrying a narrowed `profileSourcePath`. |
| trivial | `src/commands/init.ts` | repaired | Replaced separate declared/raw arrays with explicit typed reviewer pairs before validation. |
| critical | `docs/work/BANDIT-101/coderabbit-review.md` | repaired | CodeRabbit executable evidence now references committed work-item log copies under `docs/work/BANDIT-101/coderabbit-run-logs/` instead of ignored `.bandit/tmp` paths. |
| major | `src/state/reviewer-adapters.ts` | repaired | `recordNoReviewerBootstrapGap` now reopens terminal no-reviewer gap entries when a new empty-reviewer profile is initialized. |
| trivial | `test/landing-gates.test.mjs` | repaired | Added a terminal-ledger disposition regression proving a valid no-reviewer disposition unblocks older declared no-reviewer evidence. |
| major | `src/commands/land-check.ts` | dispositioned_no_source_change | Rejected the contradictory requested inversion that declared no-reviewer evidence must always override terminal ledger disposition. `brief.md` requires land-check to unblock after valid disposition, and the new terminal-ledger regression preserves that contract. |
| trivial | `src/commands/land-check.ts` | repaired | `firstHumanReviewReplacementPath` now accepts `Array<unknown>` and documents that malformed review-evidence replacement entries are skipped defensively. |
| critical | `docs/work/BANDIT-101/coderabbit-review.md` / `.bandit/policy/risk-classification.json` / `.bandit/policy/supply-chain-gate.json` | repaired | Stage 4 evidence now records the latest blocking CodeRabbit run and temporarily marks/removes BANDIT-101 auto-landing authorization until CodeRabbit and Local Qwen evidence are terminal/current. |
| trivial | `docs/work/BANDIT-101/coderabbit-finding-disposition.md` | repaired | `disposition_status` is now `findings_addressed_pending_rerun` with separate `stage_status: pending_verification`, so finding repair state cannot be read as Stage 4 closure. |
| trivial | `docs/work/BANDIT-101/coordination-log.jsonl` | repaired | Coordination sequence 6 keeps the schema-supported `actor_event_type: complete` value but adds `stage_status: pending_review`, clarifying that the actor event is not a Stage 4 closure transition. |
| major | `docs/work/BANDIT-101/stage3-pm-acceptance.md` | repaired | Stage 3 PM acceptance now describes only the original Stage 2 RED-to-GREEN evidence and points Stage 4 reviewer repairs to this disposition artifact. |
| major | `src/state/reviewer-adapters.ts` | repaired | The typed no-reviewer bootstrap-gap ledger reader now restricts status to `open`, `resolved`, or `replaced` and reports malformed status values with ledger path and gap index. |
| major | `test/landing-gates.test.mjs` | repaired | Added a regression proving `land-check` fails closed when the no-reviewer gap has an unknown status even if its disposition says `resolved`. |
| major | `src/commands/land-check.ts` | repaired | `hasOpenNoReviewerGap` now treats only `resolved` and `replaced` statuses as terminal; any other status remains blocking regardless of disposition text. |
| minor | `docs/work/BANDIT-101/coderabbit-review.md` | repaired | `bootstrap_gaps` is now recorded as an empty array instead of a single `none` string entry. |
| trivial | `src/commands/land-check.ts` / `src/state/human-review.ts` | repaired | `tryReadHumanReview` now uses async `readFile`, and `land-check` awaits it in the existing async readiness flow. |
| trivial | `src/state/human-review.ts` | repaired | Missing required human-review scalar errors now include the artifact display path. |
| minor | `src/commands/init.ts` | repaired | Raw profile reviewer entries are validated into concrete `id`, `type`, `provider`, and `required` values before constructing a typed `ReviewerAdapterInput`; the unchecked cast is removed. |
| major | `src/commands/init.ts` | repaired | Profile reviewer validation, no-reviewer gap recording, and reviewer adapter scaffolding now run only after the existing initialized-repo skip guard, so `init --profile` cannot rewrite reviewer adapters in an initialized repo. |
| major | `test/reviewer-adapters.test.mjs` | repaired | The Local Qwen adapter regression now invokes `bandit init --profile` against an initialized temp repo and verifies the existing adapter file remains unchanged. |
| major | `docs/work/BANDIT-101/coderabbit-review.md` | repaired | The CodeRabbit evidence artifact now records the latest terminal run, no unresolved critical/major source findings, and PM disposition instead of the prior pending-refresh blocker state. |
| trivial | `docs/work/BANDIT-101/writer-report.md` | repaired | The Test-Surface Edit Boundary section now defers final attribution and policy disposition to Work Item PM acceptance instead of listing writer-authored suggested dispositions. |
| trivial | `docs/work/BANDIT-101/implementation-evidence.md` | dispositioned_operator_threshold | Cross-reference enrichment is non-critical/non-major documentation cleanup. Per operator instruction, PM moved on after critical and major findings were handled. |
| trivial | `docs/work/BANDIT-101/coderabbit-review.md` | repaired | Metadata `findings_disposition` now points to this external disposition document instead of carrying a long free-text summary. |
| major | `src/commands/land-check.ts` | repaired | Human review replacement detection now accepts only the exact canonical current-work-item path from `humanReviewDisplayPath(workItemId)` rather than any string ending in `human-review.md`. |
| critical | `docs/work/BANDIT-101/stage3-minimax-dispatch.md` | repaired | Acceptance slice 4 now enumerates the concrete no-reviewer gap statuses `open`, `resolved`, and `replaced`, removing vague equivalent-state wording. |
| minor | `docs/work/BANDIT-101/coderabbit-review.md` | repaired | Auto-landing ineligibility is phrased as current policy state due to pending Stage 4 evidence rather than as a review-artifact directive. |
| major | `src/commands/land-check.ts` | repaired | `safeToLandProblems` now treats an open no-reviewer gap as blocking regardless of whether human-review replacement evidence is also present. |
| major | `test/landing-gates.test.mjs` | repaired | Added a regression proving an open no-reviewer gap blocks landing even when current human-review replacement evidence exists. |
| major | `docs/work/BANDIT-101/coordination-log.jsonl` | repaired | Coordination sequences 8 through 16 now record CodeRabbit refresh-final-5 through refresh-final-10-retry-3, including the provider timeout and the current pending-review blocks. |
| critical | `.bandit/reviewers/local-qwen.json` / `src/state/reviewer-profiles.ts` | repaired | Local Qwen profile validation now treats `type: "openai_compatible"` as a first-class required field and returns it in the typed profile, matching the committed profile and typed adapter contract. |
| minor | `docs/work/BANDIT-101/stage3-pm-acceptance.md` | repaired | PM verification now includes an explicit source-drift statement tied to the Stage 3 source head and the recorded Stage 2/Stage 3 worktree diff. |
| major | `docs/work/BANDIT-101/stage3-pm-acceptance.md` | repaired | The Stage 3 PM acceptance metadata now records source_head `a0d03e6e671b94d013af6f22ce349313abf134d5`. |
| critical | `src/commands/land-check.ts` / `src/state/bootstrap-gaps.ts` | repaired | Landing readiness now uses required `readBootstrapGaps`, so a missing canonical bootstrap-gap ledger fails closed instead of being treated as an empty optional ledger. |
| major | `src/commands/land-check.ts` | repaired | `hasOpenNoReviewerGap` now evaluates every `BANDIT-GAP-NO-REVIEWER-CONFIGURED` ledger entry and blocks landing if any duplicate entry has a non-terminal status. |
| major | `src/commands/init.ts` | repaired | The generated `PROJECT_PROFILE_TEMPLATE` now emits a typed `openai_compatible` Local Qwen reviewer with `provider_base_url`, matching the typed reviewer validator. |
| trivial | `src/state/reviewer-adapters.ts` | dispositioned_operator_threshold | The duplicated type check inside `validateTypedReviewerAdapter` is a non-critical/non-major refactor suggestion; per operator instruction, PM moved on while preserving current passing behavior. |
| major | `test/reviewer-adapters.test.mjs` | repaired | The Local Qwen preservation regression now seeds `.bandit/reviewers/local-qwen-baseline.json`, matching the reviewer id used by the profile fixture. |
| critical | `.bandit/policy/supply-chain-gates/BANDIT-101-supply-chain-gate.json` | repaired | The supply-chain gate evidence paths now include `src/state/reviewer-profiles.ts`, `src/commands/validate.ts`, `src/commands/qwen-review.ts`, and `test/work-create-controller.test.mjs` for reviewer-profile usage coverage. |
| minor | `docs/work/BANDIT-101/stage3-minimax-continuation-2.md` | dispositioned_operator_threshold | Writer wrong-test escalation wording is non-critical/non-major documentation cleanup; per operator instruction, PM moved on. |
| minor | `docs/templates/project-profile.md` | repaired | The project-profile template now uses the canonical `omlx-openai-compatible` provider string. |
| critical | `docs/templates/project-profile.md` / `src/commands/init.ts` | repaired | The project-profile template and emitted `PROJECT_PROFILE_TEMPLATE` now include required `model` and `command` fields for the example `openai_compatible` reviewer. |
| trivial | `docs/work/BANDIT-101/stage3-pm-acceptance.md` | dispositioned_operator_threshold | The Stage 4 pointer in Stage 3 PM acceptance is non-critical/non-major evidence wording; per operator instruction, PM moved on. |
| trivial | `src/commands/init.ts` | dispositioned_operator_threshold | The redundant `profile && profileSourcePath` conditional is a non-critical/non-major refactor suggestion; per operator instruction, PM moved on. |
| major | `src/state/reviewer-adapters.ts` | repaired | Human reviewer adapter validation now rejects a present non-string `provider` field before adapter scaffolding or persistence. |
| major | `test/landing-gates.test.mjs` | repaired | The declared no-reviewer missing-entry regression now keeps the bootstrap-gap ledger present with a different gap id, exercising the specific missing-entry path instead of the global missing-ledger path. |
| trivial | `src/state/human-review.ts` | dispositioned_operator_threshold | Direct-read optimization for optional human-review evidence is non-critical/non-major cleanup; per operator instruction, PM moved on. |
| major | `docs/work/BANDIT-101/implementation-evidence.md` | repaired | Implementation evidence now records `source_head: a0d03e6e671b94d013af6f22ce349313abf134d5+uncommitted-stage4-review-subject` and states which verification commands ran against that precise review subject. |
| major | `docs/work/BANDIT-101/implementation-evidence.md` | repaired | PM disposition now explicitly classifies the dirty test-surface risk as an uncommitted Stage 4 review subject and records that a clean source/evidence commit is required before Local Qwen and landing. |
| trivial | `docs/work/BANDIT-101/stage3-minimax-dispatch.md` | dispositioned_operator_threshold | Writer-report template enrichment is non-critical/non-major dispatch documentation cleanup; per operator instruction, PM moved on. |
| trivial | `docs/work/BANDIT-101/implementation-evidence.md` | dispositioned_operator_threshold | Acceptance-mapping table enrichment is non-critical/non-major documentation cleanup; per operator instruction, PM moved on. |
| trivial | `docs/work/BANDIT-101/stage3-minimax-continuation-2.md` | dispositioned_operator_threshold | Partial-surface status-note enrichment is non-critical/non-major dispatch documentation cleanup; per operator instruction, PM moved on. |
| trivial | `src/state/human-review.ts` | dispositioned_operator_threshold | Repeated direct-read optimization suggestion remains non-critical/non-major cleanup; per operator instruction, PM moved on. |
| minor | `docs/work/BANDIT-101/stage3-minimax-continuation-2.md` | dispositioned_operator_threshold | Dispatch scope narrowing is non-critical/non-major documentation cleanup; per operator instruction, PM moved on. |
| minor | `docs/work/BANDIT-101/stage3-minimax-continuation-2.md` | dispositioned_operator_threshold | Adding `CLEAN_CODE.md` to the continuation read list is non-critical/non-major dispatch cleanup; per operator instruction, PM moved on. |
| major | `docs/work/BANDIT-101/stage3-pm-acceptance.md` | repaired | Stage 3 PM acceptance now includes explicit implementation-files, RED-failure mapping, command/result, and test-surface authority sections. |
| major | `docs/work/BANDIT-101/writer-report.md` | repaired | Writer report now states current `land-check` behavior fails closed when the bootstrap-gap ledger is missing and ties the correction to stale evidence logic. |
| major | `docs/work/BANDIT-101/coordination-log.jsonl` / `docs/work/BANDIT-101/coderabbit-review.md` | repaired | CodeRabbit provider-timeout evidence now references the durable copied log at `docs/work/BANDIT-101/coderabbit-run-logs/BANDIT-101-coderabbit-refresh-final-10-provider-timeout.log`. |
| major | `src/state/human-review.ts` | repaired | Human-review evidence readers now validate work item ids, resolve paths beneath `docs/work`, and read the exact `human-review.md` file without directory traversal exposure. |
| major | `test/landing-gates.test.mjs` / `src/state/human-review.ts` | repaired | Added a regression proving unsupported human-review `source_drift_status` values fail closed with an explicit parser error. |
| trivial | `src/state/human-review.ts` | repaired | `readOptionalHumanReview` now reads the target file directly and handles missing files without a preliminary directory listing. |
| major | `test/reviewer-adapters.test.mjs` | repaired | The typed adapter scaffolding regression now includes a `cli_command` reviewer and verifies `.bandit/reviewers/acme-cli.json` is written with the expected typed shape. |
| minor | `src/state/bootstrap-gaps.ts` | dispositioned_operator_threshold | `readOptionalBootstrapGaps` dead-code cleanup is non-critical/non-major and outside the frozen review subject; PM moved on under operator instruction. |
| major | `docs/work/BANDIT-101/stage3-minimax-dispatch.md` | pm_disposition_no_change | The unsupported no-reviewer status behavior is already enforced by source validation and landing-gate tests; changing dispatch wording would expand the evidence diff without materially improving the slice. PM dispositioned this as non-blocking for the frozen subject. |

## Repair Verification

```sh
node --test test/reviewer-adapters.test.mjs
```

Result: pass, 11 tests.

```sh
node --test test/local-qwen-review.test.mjs
```

Result: pass, 33 tests.

```sh
node --test test/landing-gates.test.mjs
```

Result: pass, 94 tests.

```sh
node --test test/init.test.mjs
```

Result: pass, 9 tests.

```sh
npm run typecheck
```

Result: pass.

```sh
npm test
```

Result: pass, 684 tests; `1..664`, `# pass 684`, `# fail 0`, `# duration_ms 68738.276291`.

## Next Action

Create the clean source/evidence commit for the frozen review subject, then run
the required Local Qwen gate. Do not run another CodeRabbit refresh for this
subject.
