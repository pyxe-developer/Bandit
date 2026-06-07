# BANDIT-065 Stage 3 Claude Implementation Dispatch

## Role

You are the Stage 3 Implementation Writer for `BANDIT-065`. Codex authored
Stage 2 RED tests, so Bootstrap Model-Family Separation requires Claude to own
source implementation.

## Required Reads

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-065/brief.md`
- `docs/work/BANDIT-065/orchestration-plan.md`
- `docs/work/BANDIT-065/red-evidence.md`
- `test/orchestrator-prompts.test.mjs`

## Task

Implement the missing public validation path for a harness-portable Work Item PM
orchestrator prompt contract.

Expected implementation surfaces:

- `.bandit/policy/orchestrator-prompts.json`
- `docs/templates/work-item-pm-orchestrator-prompt.md`
- `src/state/orchestrator-prompts.ts`
- `src/commands/orchestrator-prompts.ts`
- `src/state/paths.ts`
- `src/commands/init.ts`
- `src/commands/validate.ts`
- `src/cli.ts`
- `docs/work/BANDIT-065/writer-report.md`
- `docs/work/BANDIT-065/implementation-evidence.md`

Implement only the smallest surface needed to satisfy the approved brief and
focused RED tests.

## Required Behavior

- `bandit orchestrator-prompts validate [--json]` validates
  `.bandit/policy/orchestrator-prompts.json` and
  `docs/templates/work-item-pm-orchestrator-prompt.md`.
- A compliant policy/template returns JSON with `verdict: "pass"`,
  `policy: ".bandit/policy/orchestrator-prompts.json"`,
  `prompt_contracts: ["work-item-pm"]`, and
  `cli_authority_preserved: true`.
- Validation fails closed when required template sections are missing.
- Validation fails closed when a prompt contract claims canonical workflow
  authority, replaces canonical sources, mutates state outside CLI commands,
  skips required gates, allows Stage 3 Writer test edits, omits Codex-RED to
  Claude Stage 3 separation, or permits forbidden authority claims such as
  `trust_verifier_cutover`, `replace_old_gate`, or `wrap_old_gate`.
- Repo-wide `bandit validate` includes the new policy/template validator.
- `bandit init` seeds the default policy and template.
- The prompt contract remains non-authoritative adapter guidance and cannot
  replace canonical Bandit CLI or artifact authority.

## Forbidden Actions

- Do not edit `test/orchestrator-prompts.test.mjs` or any other test file.
- Do not edit test helpers, fixtures, RED evidence, acceptance mappings,
  formation evidence, review evidence, landing evidence, or retrospective
  evidence.
- Do not approve Trust Verifier cutover, replace or wrap old gates, generate
  role input packets, generate execution packets, implement live A2A, implement
  True Agent lifecycle, restart Pi/Aperture runtime work, touch dependency or
  lock files, set up external services, merge, push, deploy, or change product
  scope.

## Verification

Run at minimum:

```sh
node --test test/orchestrator-prompts.test.mjs
npm run typecheck
npm run bandit -- validate
git diff --check
```

If you touch broader shared validation or CLI routing, run focused adjacent
tests as needed.

## Evidence To Write

Write:

- `docs/work/BANDIT-065/writer-report.md`
- `docs/work/BANDIT-065/implementation-evidence.md`

The evidence must list files changed, verification commands/results, and affirm
zero test-surface edits.
