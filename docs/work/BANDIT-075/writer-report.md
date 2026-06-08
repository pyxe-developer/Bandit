# BANDIT-075 Stage 3 Writer Report

contract_version: 1
work_item: BANDIT-075
stage: stage3_implementation
writer: claude-family (claude-opus-4-8)
recorded_at: 2026-06-08T12:00:00Z

## Summary

Implemented the smallest source and policy change needed to satisfy the focused
RED suite `test/reviewer-calibration.test.mjs`: a new public command
`bandit reviewer-calibration validate [--json]` backed by a replay-only
calibration validator and deterministic scorer. The command validates
`.bandit/policy/reviewer-calibration.json` and the packet paths the policy names,
enforces the replay-only / no-live-routing boundaries, rejects direct `qwen` CLI
reviewer eligibility, requires repo-derived Bandit failure-mode packets and
gold-labeled seeded blockers/non-issues, and scores completed fixture reviewer
outputs with `blocker_recall` as the primary metric. Provider timeout/refusal/
inconclusive statuses are recorded as calibration evidence and never counted as a
detection or a pass.

PM acceptance tightened the focused RED suite to cover brief-required packet/seeded-case
schema behavior, growing it from 7 to 10 tests. This Stage 3 repair adds the smallest
source validation to satisfy the three new cases:

- A policy that names no packets is rejected (`reviewer calibration policy must name
  at least one packet`) instead of vacuously passing with an empty packet loop.
- A packet missing failure-mode provenance — empty `failure_mode_category` or empty
  `source_artifacts` — is rejected by id.
- A seeded case missing any policy-required gold-label field (driven by
  `packet_schema.required_seeded_case_fields`) is rejected by packet id, case id, and
  the first missing field.

## Files Changed

- `src/state/reviewer-calibration.ts` — new file. Reads the calibration policy and
  the packet paths it names; asserts replay-only/no-live-routing boundaries,
  blocker_recall-primary scorecard policy, reviewer-route eligibility (rejecting
  `direct_qwen_cli`/bare `qwen`), a non-empty named-packet set, repo-derived packet
  sources, failure-mode provenance (`failure_mode_category` + `source_artifacts`),
  policy-required seeded-case fields, and gold-labeled seeded blockers + non-issues;
  then scores only `completed` reviewer outputs
  (blocker recall, actionable precision, useful finding yield, false-positive rate,
  plus tool friction / latency / cost where supplied) and collects provider
  evidence statuses for non-completed outputs. Pure reader: no writes.
- `src/commands/reviewer-calibration.ts` — new file. Thin `validate [--json]`
  command wrapper that delegates to the state validator and renders the report.
- `src/cli.ts` — registered the `reviewer-calibration` command import, handler, and
  usage strings. No other command behavior changed.
- `.bandit/policy/reviewer-calibration.json` — new real-repo replay-only policy that
  names the Test Writer-owned packet
  `docs/reviewer-calibration-packets/BANDIT-075-reviewer-packet-001.json`, so the
  required `bandit reviewer-calibration validate --json` command passes against the
  real repository.

## Scope Decisions

- `src/commands/init.ts` and `src/commands/validate.ts` were allowed surfaces but
  were intentionally left untouched. Reviewer calibration is a replay-only
  benchmark surface that the brief keeps separated from live work and from the
  canonical `bandit validate` live-state gate. Its own `reviewer-calibration
  validate` command (a required Stage 3 validation command) is the gate for the
  calibration policy and packets, so the policy is not untested. Not wiring it into
  the live gate keeps the diff to the smallest surface area and preserves the
  replay-only / live separation the brief mandates.
- The validator fails closed: a missing or malformed policy/packet, an absent
  packet, a non-repo-derived packet source, missing gold labels, or any boundary
  violation throws a clear error and the command exits non-zero. Absence of a
  reviewer output is recorded as provider evidence, not treated as a pass.

## No Test-Edit Evidence

The Stage 3 Writer did not create, edit, delete, regenerate, format, or
mechanically adjust any of the following:

- `test/reviewer-calibration.test.mjs`
- `docs/reviewer-calibration-packets/BANDIT-075-reviewer-packet-001.json`
- `docs/work/BANDIT-075/red-evidence.md`
- `docs/artifact-inputs/BANDIT-075-red-evidence.json`
- Any test helpers, fixtures, seeded calibration packets, gold labels,
  reviewer-score acceptance mappings, source-artifact mappings, or acceptance
  mappings.

The pre-existing `M` state of `.bandit/events.jsonl` and
`docs/work/BANDIT-075/coordination-log.jsonl` predates this Stage 3 run (Stage 1/2
formation, orchestration, and RED-evidence events). The Writer did not modify those
append-only coordination/event artifacts.

## Commands Run

```
node --test test/reviewer-calibration.test.mjs
# pass 10 / fail 0

npm run typecheck
# exit 0

npm run bandit -- reviewer-calibration validate --json
# status pass; packets ["BANDIT-075-reviewer-packet-001"];
# scorecard primary_metric blocker_recall, blocker_recall 1, actionable_precision 1,
# useful_finding_yield 1, false_positive_rate 0;
# provider_evidence_statuses ["provider_timeout"];
# boundaries replay_only true, no_live_routing true

node ./bin/bandit.mjs role-runs validate BANDIT-075 --json
# status pass; manifests ["docs/role-runs/BANDIT-075/stage3-implementation.json"]

npm test
# pass 561 / fail 0

git diff --check
# exit 0 (no whitespace errors)
```

## Acceptance Criteria Coverage

| Criterion | Coverage |
| --- | --- |
| Public `bandit reviewer-calibration validate [--json]` | `src/commands/reviewer-calibration.ts` + `src/cli.ts` handler |
| Validate policy and the packet paths it names | `validateReviewerCalibration` reads `.bandit/policy/reviewer-calibration.json` and each repo-relative packet path |
| Enforce replay-only / no-live-routing | `assertReplayOnlyBoundaries` requires replay_only, no_live_routing, no automatic routing changes, and no live-routing/landing mutation boundaries |
| Reject direct `qwen` CLI eligibility | `assertReviewerEligibility` rejects any allowed route using `direct_qwen_cli` or a bare `qwen` command |
| Repo-derived packets before generic benchmark tasks | `assertPacketSourcePolicy` + `assertRepoDerivedPacket` require `repo_derived_bandit_failure_mode` packet sources |
| Policy must name at least one packet | `assertNamedPackets` rejects an empty `packets` list before scoring |
| Packet failure-mode provenance required | `assertFailureModeProvenance` rejects empty `failure_mode_category` or empty `source_artifacts` by packet id |
| Seeded cases carry required gold-label fields | `assertSeededCaseFields` rejects any seeded case missing a `packet_schema.required_seeded_case_fields` value, naming the packet, case, and first missing field |
| Gold-labeled seeded blockers and non-issues | `assertGoldLabeledSeededCases` requires at least one `blocker` and one `non_issue` per packet |
| Deterministic scoring with `blocker_recall` primary | `scoreCalibration` scores only `completed` outputs; primary metric is `blocker_recall` |
| Provider timeout/refusal/inconclusive recorded, never a pass | non-completed statuses are excluded from scoring and surfaced in `provider_evidence_statuses` |
| No mutation of live reviewer/landing/routing authority | validator is a pure reader; read-only test confirms `.bandit/reviewers/local-qwen.json` and `.bandit/policy/landing-agent.json` are byte-identical before/after |

## Clean-Code Self-Check

- Small surface area: three source files + one real-repo policy; init/validate left
  untouched.
- Simple design: parsing, boundary assertions, packet assertions, and scoring are
  separate single-purpose functions.
- No hidden authority: validator only reads; the named policy and packet paths are
  explicit; no projection or cache gains canonical status.
- Failure clarity: every refusal throws a specific message naming the violated
  boundary, packet id, or missing file; absence is recorded as provider evidence.
- No role erosion: zero test-surface edits.

## Bootstrap Model-Family Separation

Codex authored Stage 2 RED evidence; this Stage 3 implementation used the
Claude-family implementation-writer path as required. Verification escalation
returns to Codex PM because Claude authored the implementation.

## Blockers

None.
