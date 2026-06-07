# BANDIT-065 Stage 3 Writer Report

contract_version: 1
work_item: BANDIT-065
stage: stage3_implementation
owner: implementation_writer
authored_by: claude
created_at: 2026-06-07T16:30:00Z
verdict: pass

## Summary

Implemented the missing public validation path for a harness-portable Work Item
PM orchestrator prompt contract. Codex authored the Stage 2 RED tests, so per the
Permanent Test Ownership Boundary and Bootstrap Model-Family Separation, Stage 3
source implementation was routed to Claude. This report records the source-only
delivery that turns the RED tests in `test/orchestrator-prompts.test.mjs` GREEN
without editing any test surface.

## Model-Family Separation

- Stage 2 RED author: Codex (see `docs/work/BANDIT-065/red-evidence.md`).
- Stage 3 implementation author: Claude (this report).
- Different model families, satisfying Bootstrap Model-Family Separation.

## Behavior Delivered

- `bandit orchestrator-prompts validate [--json]` validates
  `.bandit/policy/orchestrator-prompts.json` and the prompt template referenced
  by each contract (`docs/templates/work-item-pm-orchestrator-prompt.md`).
- A compliant policy/template returns JSON with `verdict: "pass"`,
  `policy: ".bandit/policy/orchestrator-prompts.json"`,
  `prompt_contracts: ["work-item-pm"]`, and `cli_authority_preserved: true`.
- Validation fails closed when required template sections are missing.
- Validation fails closed when a contract claims canonical workflow authority,
  replaces canonical sources, mutates state outside CLI commands, omits required
  gates, allows Stage 3 Writer test edits, omits Codex-RED to Claude Stage 3
  separation, or permits forbidden authority claims (`trust_verifier_cutover`,
  `replace_old_gate`, `wrap_old_gate`).
- Repo-wide `bandit validate` now includes the lenient policy/template validator,
  and `bandit init` seeds the default policy and template.
- The prompt contract remains non-authoritative adapter guidance and cannot
  replace canonical Bandit CLI or artifact authority.

## Files Changed

New source/policy/template surfaces:

- `src/state/orchestrator-prompts.ts` — validation, default policy writer, and
  default template writer.
- `src/commands/orchestrator-prompts.ts` — `orchestrator-prompts validate`
  command with optional `--json` output.
- `.bandit/policy/orchestrator-prompts.json` — seeded default prompt policy.
- `docs/templates/work-item-pm-orchestrator-prompt.md` — seeded default
  non-authoritative orchestrator prompt template.

Modified wiring:

- `src/state/paths.ts` — added `orchestratorPromptsPolicy` path.
- `src/commands/init.ts` — seeds the default policy and template when missing.
- `src/commands/validate.ts` — calls `validateOrchestratorPromptsPolicy`.
- `src/cli.ts` — routes the `orchestrator-prompts` command and updates usage.

Stage 3 evidence:

- `docs/work/BANDIT-065/writer-report.md` (this file).
- `docs/work/BANDIT-065/implementation-evidence.md`.

## Test-Surface Affirmation

Zero test-surface edits were made. `test/orchestrator-prompts.test.mjs`, test
helpers, fixtures, RED evidence, and acceptance mappings were read only and left
unchanged. No formation, review, landing, or retrospective evidence was edited.

## Clean-Code Posture

The implementation mirrors existing policy/template validators
(`stage-capability-scope`, `token-cost-failsafe`, `supply-chain-gate`): small
focused functions, named constants for required sections/gates/forbidden claims,
fail-closed problem collection, and a lenient repo-wide validator that defers to
the strict command path. No unrelated refactors were introduced.
