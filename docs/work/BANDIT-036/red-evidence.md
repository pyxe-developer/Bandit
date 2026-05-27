# BANDIT-036 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused tests define the retrospective structured improvement-mining contract before production implementation. They fail because artifact create currently accepts retrospective specs without structured_improvement_mining, ignores incomplete mining rows, and renders no Structured Improvement Mining section for valid retrospective specs.

## Test Command

```sh
node --test test/artifact-create.test.mjs
```

## Observed Output

```text
tests 13
pass 10
fail 3
artifact create refuses retrospective specs without structured improvement mining failed: expected exit code 1, received 0
artifact create refuses retrospective mining entries without durable disposition failed: expected exit code 1, received 0
artifact create renders retrospective structured mining evidence failed: missing /^## Structured Improvement Mining$/m in rendered retrospective
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| artifact create refuses retrospective specs that omit structured improvement-mining checklist evidence. | The new missing-checklist test expects artifact create to fail closed before writing docs/work/BANDIT-001/retrospective.md, but the current command exits 0. |
| artifact create refuses retrospective checklist entries that omit the signal, finding, or disposition needed for durable mining evidence. | The new incomplete-row test supplies a structured_improvement_mining row with signal and finding but no disposition; current artifact create exits 0 instead of rejecting the row. |
| artifact create renders retrospective structured mining evidence with the required signals. | The new render test supplies all required signals and expects a Structured Improvement Mining section containing each signal; the current renderer omits the section entirely. |
| The recurring tool invocation friction signal explicitly covers CodeRabbit or other required gate invocation uncertainty. | The render test requires the tool invocation friction row to mention CodeRabbit invocation uncertainty and the durable bootstrap-gap disposition. |
| The rendered retrospective makes every material mining finding disposition visible as a durable follow-up route or explicit no-action decision. | The RED checklist uses explicit no-action decisions for non-material signals and a bootstrap-gap route for the material CodeRabbit invocation-friction finding. |
| Existing retrospective creation behavior remains compatible for valid specs, including lifecycle event append, safe path checks, no-overwrite behavior, unknown work-item refusal, unsupported kind refusal, and out-of-repo spec refusal. | The existing durable-dispositions retrospective test now includes a valid structured_improvement_mining checklist and continues to pass before implementation; existing unsupported-kind, occupied-path, and out-of-repo refusal tests still pass. |
| No local server/API mode, state-index persistence, scheduler execution, worktree lifecycle, automatic merge/push/deploy behavior, product UAT approval, actor identity policy, claim leases, work surface reservations, PR/CI workflow, policy change, paid reviewer route, external service integration, or unrelated Phase 8 work is introduced. | This RED step changes only focused artifact-create tests, the Stage 2 evidence spec/artifact, and roadmap/current-context routing. It adds no production implementation or broader workflow surface. |

## Next Action

Implement the narrow retrospective artifact-create repair in src/commands/artifact-create-renderers.ts so retrospective specs require structured_improvement_mining rows with signal, finding, and disposition, valid retrospectives render a Structured Improvement Mining section with the required signals including CodeRabbit invocation uncertainty, and the focused artifact-create tests pass without broadening into unrelated Phase 8, policy, supply-chain, UAT, PR/CI, scheduler, claim, worktree, server/API, paid reviewer, or external-service work.
