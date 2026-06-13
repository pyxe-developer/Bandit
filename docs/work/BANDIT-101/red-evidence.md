# BANDIT-101 RED Evidence

contract_version: 1
work_item: BANDIT-101
stage: Stage 2 RED
owner: codex_test_writer
created_at: 2026-06-13T13:36:04Z
coordination_state: red_recorded_pending
stage3_writer_route: MiniMax-M3
stage3_test_edit_authority: none

## Summary

Stage 2 Test Writer added failing behavioral tests for typed reviewer adapter
validation, profile-driven reviewer scaffolding, Local Qwen adapter
back-compat, no-reviewer landing blockade, and human-review replacement
evidence validation. These tests intentionally fail against current production
code, proving the missing behavior before Stage 3 implementation.

Codex authored the RED tests, so Stage 3 implementation must route to a
different model family. The current Work Item PM automation prompt requires
MiniMax-M3 as the Stage 3 Writer. The Stage 3 Writer must not edit tests, test
helpers, fixtures, this RED evidence, or acceptance mappings.

## Test Writer-Owned Changes

- Added `test/reviewer-adapters.test.mjs`.
- Added no-reviewer and human-review replacement evidence cases to
  `test/landing-gates.test.mjs`.
- Extended `test/landing-gates.test.mjs` fixture helpers only to express the
  new RED inputs.

## Test Commands And RED Output

```sh
node --test test/reviewer-adapters.test.mjs
```

Observed RED result:

```text
tests 4
pass 0
fail 4

not ok 1 - init --profile validates openai-compatible reviewer adapter fields
Expected result.code 1, actual 0.

not ok 2 - init --profile scaffolds typed reviewer adapters under .bandit/reviewers
ENOENT reading .bandit/reviewers/acme-qwen.json.

not ok 3 - init --profile records an open no-reviewer gap when reviewers are empty
expected a no-reviewer bootstrap gap.

not ok 4 - committed Local Qwen profile remains an openai-compatible reviewer adapter
profile.type was undefined, expected openai_compatible.
```

```sh
node --test test/landing-gates.test.mjs
```

Observed RED result:

```text
tests 85
pass 82
fail 3

not ok 34 - land-check blocks safe-to-land while the no-reviewer bootstrap gap is open
Expected result.code 1, actual 0.

not ok 35 - land-check validates human review replacement evidence before landing
Expected result.code 1, actual 0.

not ok 36 - land-check accepts current human review evidence without model-review claims
Expected stdout to include Human review evidence: docs/work/BANDIT-982/human-review.md.
```

## Acceptance Criteria Mapping

| Acceptance criterion | RED evidence |
| --- | --- |
| Each adapter type validates at init or profile/config load with type-specific required fields and diagnostics naming the offending field. | `test/reviewer-adapters.test.mjs` `init --profile validates openai-compatible reviewer adapter fields` expects a missing `provider_base_url` or `endpoint` diagnostic and currently fails because init accepts the malformed adapter. |
| Existing Local Qwen flow runs unchanged as an `openai_compatible` instance through `.bandit/reviewers/local-qwen.json` and `node bin/omlx-chat-completions.mjs`. | `test/reviewer-adapters.test.mjs` `committed Local Qwen profile remains an openai-compatible reviewer adapter` expects `type: openai_compatible` while preserving the current provider, endpoint, and command route; it currently fails because the profile has no adapter type. Existing `test/local-qwen-review.test.mjs` continues to cover the command route. |
| Empty reviewer configuration yields an open no-reviewer gap or equivalent explicit state that blocks `land-check` until dispositioned. | `test/reviewer-adapters.test.mjs` expects `init --profile` with `reviewers: []` to record a no-reviewer bootstrap gap. `test/landing-gates.test.mjs` expects an open no-reviewer gap to block `land-check`. Both currently fail. |
| A `human` adapter produces or validates a review-evidence path that satisfies the same gate contract without claiming Local Qwen, CodeRabbit, or another model reviewer ran. | `test/reviewer-adapters.test.mjs` expects human adapter scaffolding with `evidence_path`. `test/landing-gates.test.mjs` expects malformed human replacement evidence to fail closed and valid human evidence to appear in `land-check` output without a Local Qwen model-review artifact. These currently fail. |
| Reviewer adapter config and generated `.bandit/reviewers/` files are data/config surfaces, not hidden workflow authority. | Tests exercise public CLI behavior through `init --profile` and `land-check`; they do not grant landing by config alone. Review evidence or gap disposition remains required for landing. |
| Focused tests cover adapter validation, scaffold output, Local Qwen regression routing, empty-reviewer landing blockade, disposition unblock behavior, and human-reviewer evidence validation. | `test/reviewer-adapters.test.mjs`, `test/landing-gates.test.mjs`, and existing `test/local-qwen-review.test.mjs` cover these paths. Disposition unblock behavior is represented by the existing bootstrap replacement evidence pass test plus new no-reviewer blocking behavior. |
| The slice preserves CLI Authority, repo-native source-of-truth boundaries, Permanent Test Ownership Boundary, Bootstrap Model-Family Separation, authorized Local Qwen routing, and fail-closed reviewer evidence semantics. | RED tests use public CLI commands and repo-native artifacts. Stage 3 Writer route is MiniMax-M3 because Codex authored RED tests. Stage 3 Writer has zero test-edit authority. |

## Stage 3 Dispatch Requirements

Stage 3 Writer must implement only source/config behavior needed to satisfy the
RED tests and approved brief:

- Add a typed reviewer adapter contract with `openai_compatible`,
  `cli_command`, and `human` validation.
- Scaffold typed reviewer adapter files under `.bandit/reviewers/` from
  profile configuration.
- Preserve the existing Local Qwen route as an `openai_compatible` adapter
  through `.bandit/reviewers/local-qwen.json` and
  `node bin/omlx-chat-completions.mjs`.
- Record an explicit open no-reviewer gap or equivalent state when
  `reviewers: []` and make `land-check` fail closed while that gap is open.
- Validate human-review replacement evidence and print accepted human evidence
  in `land-check` output without claiming a model review ran.

Forbidden Stage 3 actions:

- Do not edit `test/**`, fixtures, `docs/work/BANDIT-101/red-evidence.md`, or
  acceptance mappings.
- Do not change paid/live reviewer routing, reviewer benchmark policy,
  harness shims, policy tiers, Trust Verifier cutover, dependencies, lockfiles,
  package scripts, CI/release workflows, merge, push, deploy, public publishing,
  external repos, installed global skills, automation prompts, claim authority,
  worktree lifecycle, State Index, local API, or unrelated Phase 8 work.

## Next Action

Append `red_recorded` to `docs/work/BANDIT-101/coordination-log.jsonl`, then
dispatch Stage 3 implementation to MiniMax-M3 with this RED evidence and the
orchestration plan as read-only inputs.

## Stage 4 Test-Surface Repair Addendum

This addendum was recorded during Stage 4 reviewer repair, not during Stage 2
RED authoring and not by the Stage 3 Implementation Writer.

CodeRabbit identified that `test/init.test.mjs` still carried the pre-BANDIT-101
ACME profile reviewer fixture:

```json
{
  "id": "local-qwen-baseline",
  "provider": "local_qwen",
  "required": true
}
```

Work Item PM authorized updating that fixture to the approved typed adapter
shape because BANDIT-101 intentionally fails closed when reviewer adapters omit
`type`:

```json
{
  "id": "local-qwen-baseline",
  "type": "openai_compatible",
  "provider": "omlx-openai-compatible",
  "required": true,
  "provider_base_url": "http://127.0.0.1:8001/v1",
  "model": "Qwen3.6-35B-A3B-MLX-8bit",
  "command": {
    "executable": "node",
    "args": ["bin/omlx-chat-completions.mjs", "{{prompt_stdin}}"]
  }
}
```

Justification: preserving the legacy untyped fixture would weaken the
acceptance criterion that typed reviewer adapter config validates at profile
load. The repair keeps existing consumer-init coverage while making the fixture
conform to the new typed adapter contract.
