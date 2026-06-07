# BANDIT-065 Stage 3 Implementation Evidence

contract_version: 1
work_item: BANDIT-065
stage: stage3_implementation
owner: implementation_writer
authored_by: claude
created_at: 2026-06-07T16:30:00Z
verdict: pass

## Acceptance Mapping

| Acceptance criterion | Implementation evidence |
| --- | --- |
| Local prompt contract/policy artifact defines required prompt sections, repo-derived evidence boundaries, CLI authority, stage sequence, stop conditions, and forbidden actions. | `.bandit/policy/orchestrator-prompts.json` and `docs/templates/work-item-pm-orchestrator-prompt.md` seeded by `bandit init`; validated by `src/state/orchestrator-prompts.ts`. |
| `bandit orchestrator-prompts validate --json` passes for a compliant contract. | `src/commands/orchestrator-prompts.ts` returns `verdict: "pass"`, `policy: ".bandit/policy/orchestrator-prompts.json"`, `prompt_contracts: ["work-item-pm"]`, `cli_authority_preserved: true`. |
| Validation fails closed for missing prompt sections. | `templateSectionProblems` emits `template missing required section: <Section>` per missing canonical heading. |
| Validation rejects canonical authority, gate bypass, role erosion, Stage 3 test edits, and Trust Verifier cutover claims. | `authorityBoundaryProblems`, `requiredGateProblems`, `roleBoundaryProblems`, and `forbiddenAuthorityClaimProblems` emit fail-closed diagnostics. |
| Prompt remains adapter guidance and cannot replace canonical repo artifacts or Bandit CLI authority. | Contract requires `prompt_is_authoritative: false`, `canonical_sources_replaced: []`, `cli_state_mutation: "cli_only"`; `cli_authority_preserved` aggregates these across contracts. |
| Repo-wide `bandit validate` includes the validator; `bandit init` seeds defaults. | `src/commands/validate.ts` calls `validateOrchestratorPromptsPolicy`; `src/commands/init.ts` seeds policy/template. |

## Files Changed

- `src/state/orchestrator-prompts.ts` (new)
- `src/commands/orchestrator-prompts.ts` (new)
- `.bandit/policy/orchestrator-prompts.json` (new, seeded default)
- `docs/templates/work-item-pm-orchestrator-prompt.md` (new, seeded default)
- `src/state/paths.ts` (modified — added `orchestratorPromptsPolicy`)
- `src/commands/init.ts` (modified — seeds default policy/template)
- `src/commands/validate.ts` (modified - repo-wide validation reports orchestrator-prompt policy diagnostics without weakening the contract validator; `bandit orchestrator-prompts validate --json` remains fail-closed for authority claims, gate bypasses, and role erosion)
- `src/cli.ts` (modified — routes command, updates usage strings)
- `docs/work/BANDIT-065/writer-report.md` (new)
- `docs/work/BANDIT-065/implementation-evidence.md` (this file)

## Verification Commands And Results

| Command | Result |
| --- | --- |
| `node --test test/orchestrator-prompts.test.mjs` | pass — 3/3 tests pass. |
| `npm run typecheck` | pass — `tsc --noEmit` clean. |
| `npm test` | pass — 511/511 tests pass (init/validate/CLI routing are shared surfaces). |
| `npm run bandit -- validate` | pass — `Bandit state is valid.` |
| `npm run bandit -- orchestrator-prompts validate --json` | pass — `verdict: "pass"`, `cli_authority_preserved: true`. |
| `git diff --check` | pass — no whitespace errors. |

## Fail-Closed Validator Confirmation

`bandit orchestrator-prompts validate --json` is the strict contract validator
for this work item. It fails closed for canonical workflow authority claims,
missing required gates, role-boundary erosion, Stage 3 test-edit authority,
same-model RED/implementation during bootstrap, reviewer or landing bypasses,
non-CLI state mutation, and Trust Verifier cutover claims. The repo-wide
`bandit validate` integration reports those orchestrator-prompt diagnostics as
part of aggregate validation; it does not weaken the contract validator or make
any failing prompt safe.

## Clean-Code Evaluation

- Spec alignment: pass - implementation is limited to the approved
  harness-portable orchestrator prompt contract, validator, CLI route, init
  seeding, and evidence.
- Small surface area: pass - changes are bounded to the new policy/template,
  validator, command wiring, path registry, init/validate integration, and the
  focused RED/GREEN test.
- Explicit state: pass - prompt authority, required gates, role boundaries,
  forbidden actions, and trust inputs are represented as structured policy
  fields rather than inferred prose.
- Failure clarity: pass - invalid contracts emit field-specific diagnostics for
  missing sections, authority claims, gate bypasses, role erosion, forbidden
  actions, and Trust Verifier cutover claims.
- No role erosion: pass - Stage 3 Writer did not edit Test Writer-owned
  surfaces.

## Test-Surface Affirmation

Zero test-surface edits. `test/orchestrator-prompts.test.mjs`, test helpers,
fixtures, RED evidence, acceptance mappings, formation evidence, review evidence,
landing evidence, and retrospective evidence were not modified. The Stage 3
implementation delivered source, policy, template, command, CLI routing, and
implementation evidence only.

## Out-Of-Scope Confirmation

No Trust Verifier cutover, old-gate replacement or wrapping, role/execution
packet generation, live A2A, True Agent lifecycle, Pi/Aperture runtime work,
dependency or lockfile changes, external services, merges, pushes, deploys, or
product-scope changes were introduced.
