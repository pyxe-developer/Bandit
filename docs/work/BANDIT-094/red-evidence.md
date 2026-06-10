# BANDIT-094 RED Evidence

contract_version: 1
work_item: BANDIT-094
stage: Stage 2 RED
actor: test_writer
created_at: 2026-06-10T21:51:20Z
verdict: pass
findings_status: no_findings
findings_disposition: no_action_required

## Scope

Stage 2 RED evidence covers the approved `BANDIT-094` brief for the Repo PM
Create Controller And Prompt Contract slice. Codex authored the RED tests, so
Stage 3 must route implementation to a different model family. During
bootstrap, Stage 3 routes to Claude first and may fall back to MiniMax-M3 only
after the required timeout or immediate Claude authentication failure.

## Test Ownership Boundary

Test Writer owns:

- `test/orchestrator-prompts.test.mjs`
- `test/work-create-controller.test.mjs`
- this RED evidence and acceptance mapping

The Stage 3 Implementation Writer has zero authority to edit tests, test
helpers, fixtures, RED evidence, or acceptance mappings for `BANDIT-094`.

## RED Tests Added

| Test surface | Acceptance criteria mapped |
| --- | --- |
| `test/orchestrator-prompts.test.mjs` accepts Work Item PM and Repo PM prompt contracts | Bandit-native Repo PM prompt contract exists; prompt validation supports non-authoritative role-specific guidance. |
| `test/orchestrator-prompts.test.mjs` rejects foreign Repo PM prompt leakage | Prompt validation fails closed on SeekWins paths, SeekWins/WI-00 policy leakage, direct qwen CLI, Ollama, and unauthorized Local Qwen routing. |
| `test/work-create-controller.test.mjs` creates next roadmap-authorized source spec | Create controller uses roadmap/current-context target resolution, creates only from explicit source spec, and stops before Stage 2. |
| `test/work-create-controller.test.mjs` reports already formed work idempotently | Controller reports existing `formation_approved` work and does not allocate a duplicate Work Item. |
| `test/work-create-controller.test.mjs` refuses missing explicit source spec | Controller fails closed instead of scanning WIL as a hidden scheduler or inventing product scope. |
| `test/work-create-controller.test.mjs` refuses operator-owned input | Controller does not guess on product, UAT, policy, business, explicit cost/risk, or ambiguous scope. |
| `test/work-create-controller.test.mjs` refuses missing Local Qwen route | Controller preserves the authorized `.bandit/reviewers/local-qwen.json` Local Qwen route and does not substitute direct `qwen`, Ollama, or another reviewer route. |

## Command Evidence

```sh
node --test test/orchestrator-prompts.test.mjs test/work-create-controller.test.mjs
```

Result: `fail` as expected for RED.

Observed failures:

- `orchestrator prompt validation accepts harness-portable guidance contracts`
  failed because the current validator applies Work Item PM section and gate
  requirements to the new Repo PM contract instead of supporting
  role-specific prompt contracts.
- `orchestrator prompt validation rejects foreign Repo PM prompt leakage`
  failed before reaching leakage diagnostics because the current validator has
  no Repo PM foreign-source or authorized-reviewer-route checks.
- All `repo-pm create-controller --json` tests failed because the command does
  not exist yet and `repo-pm` currently accepts only `create-work-item` and
  `approve-formation`.

Two pre-existing Work Item PM prompt validation tests continued to pass.

## Acceptance Mapping

The RED suite requires Stage 3 implementation to add:

- Repo PM prompt contract policy/template support without making prompts
  canonical workflow authority.
- Prompt-contract validation for role-specific required sections and required
  gates.
- Foreign prompt-source leakage refusal for SeekWins paths, WI-00 policy,
  Ollama, direct `qwen` CLI, and unauthorized Local Qwen routing.
- `repo-pm create-controller --json` behavior that resolves roadmap/current
  context through the existing resolver, creates work only from explicit source
  specs, fails closed on missing source material, refuses operator-owned input,
  validates the authorized Local Qwen route, and stops before Stage 2.
- Idempotent already-formed behavior for existing `formation_approved` work.

## Stage 3 Route

Because Codex authored the RED tests and acceptance mapping, Stage 3
implementation must be performed by Claude first, preserving the Permanent Test
Ownership Boundary. If Claude authentication fails immediately or Claude times
out after the required 20-minute window, Stage 3 may fall back to MiniMax-M3
through headless `pi`.
