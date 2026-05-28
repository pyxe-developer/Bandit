# BANDIT-047 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused Test Writer-owned tests define the Bootstrap Model-Family Separation and permanent Test Ownership Boundary contract before production implementation. They fail because Bandit validate does not yet require model-family separation policy/template/evidence, does not reject missing Stage 2 ownership fields, does not enforce Claude Process Adapter routing after Codex-authored RED evidence, does not reject Stage 3 Writer test-surface edits, does not require full invalidation and revert evidence after contaminated Writer attempts, and does not route Claude-authored escalation back to Codex PM.

## Test Command

```sh
node --test test/model-family-separation.test.mjs
```

## Observed Output

```text
tests 10
pass 1
fail 9
validate fails closed when the model-family separation policy is missing failed: expected exit code 1, received 0
validate fails closed when the model-family separation template is missing failed: expected exit code 1, received 0
validate rejects registered model-family decisions without evidence failed: expected exit code 1, received 0
validate rejects missing Stage 2 Test Writer ownership fields failed: expected exit code 1, received 0
validate rejects same-family RED and Stage 3 implementation routing failed: expected exit code 1, received 0
validate rejects non-Claude bootstrap Writer routing after Codex RED evidence failed: expected exit code 1, received 0
validate rejects Stage 3 Writer edits to test-owned surfaces failed: expected exit code 1, received 0
validate requires full invalidation and revert before rerun after Writer test edits failed: expected exit code 1, received 0
validate rejects Claude self-escalation for Claude-authored implementation failed: expected exit code 1, received 0
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| Stage 2 RED evidence requires explicit Test Writer identity, RED author model family, material test-edit status, acceptance-mapping ownership, and a statement that Stage 3 has zero test-edit surfaces. | test/model-family-separation.test.mjs writes model-family evidence with Stage 2 ownership fields and mutates the fixture to omit test_writer_identity; the focused test expects validate to fail closed with a Stage 2 ownership diagnostic. |
| Stage 2 or validation fails closed if Codex authored or materially edited RED tests and Stage 3 is not routed to a different model family; during bootstrap the accepted Stage 3 Writer path is Claude through the Process Adapter. | test/model-family-separation.test.mjs mutates the Stage 3 writer to codex and separately mutates bootstrap routing to qwen_process_adapter; both RED tests expect validate to fail closed. |
| Stage 3 implementation evidence requires Writer identity, model family, allowed production write surfaces, forbidden test surfaces, implementation diff file list, and evidence that no test, test helper, fixture, RED evidence, or acceptance-mapping surface was touched by the Writer. | The complete model-family fixture records writer_identity, model_family, allowed_write_surfaces, forbidden_write_surfaces, implementation_diff_files, writer_touched_test_surfaces, writer_touched_acceptance_mappings, and test_surface_edit_status before future implementation may claim the gate. |
| Validation or focused tests fail closed when Stage 3 implementation is authored by the same model family that authored or materially edited Stage 2 RED tests. | test/model-family-separation.test.mjs changes Stage 3 model_family to codex after Codex-authored RED evidence and expects validate to reject same-family RED/GREEN routing. |
| Validation or focused tests fail closed when the Stage 3 Writer touches tests, test helpers, fixtures, RED evidence, or acceptance mappings, even if the edit is formatting, regeneration, fixture adjustment, or mechanical repair. | test/model-family-separation.test.mjs adds test/model-family-separation.test.mjs to implementation_diff_files and writer_touched_test_surfaces, then expects validate to reject the Writer-owned test-surface touch. |
| Validation or focused tests require complete Stage 3 attempt invalidation and revert evidence before any rerun when a Writer test-surface edit occurs; partial repair around the contaminated diff is refused. | test/model-family-separation.test.mjs marks a Writer touch to docs/work/BANDIT-990/red-evidence.md as partial_repair with no complete_revert_evidence and expects validate to fail closed. |
| Review and escalation evidence routes Claude-authored implementation escalation to Codex PM rather than Claude, and records any PM disposition of test ownership, model-family, or writer-surface findings. | test/model-family-separation.test.mjs changes claude_authored_escalation_target to claude and allows Claude self-review; the focused test expects validate to reject Claude self-escalation. |
| Templates or artifact renderers guide future work items to record model-family separation and test-ownership evidence in briefs, RED evidence, implementation evidence, and review evidence. | test/model-family-separation.test.mjs requires docs/templates/model-family-separation.md in complete fixtures and expects validate to fail when the template is missing. |
| The implementation records that Bootstrap Orchestration Boundary enforcement is artifact and diff-gate based around Process Adapter runs, not live True Agent orchestration. | The complete fixture records bootstrap_orchestration_boundary.enforcement as artifact_and_diff_gate, process_adapter_path true, and live_true_agent_orchestration_claimed false. |
| The implementation does not create RED, implementation, review, landing, or retrospective evidence beyond the current stage until the prior stage gate is satisfied. | This Stage 2 step adds only focused tests, the RED evidence spec/artifact, lifecycle event evidence, and roadmap/current-context routing. It adds no production implementation, review evidence, landing evidence, retrospective, next-gap work, live routing, paid reviewer route, dependency or lockfile change, scheduler, claim/worktree authority, external service integration, installed global skill edit, or cockpit UI surface. |

## Next Action

Implement the narrow Bootstrap Model-Family Separation repair: add repo-native model-family separation policy/template/evidence validation, integrate the gate into bandit validate, require Stage 2 Test Writer ownership fields and Stage 3 zero test-edit authority, enforce Claude Process Adapter routing after Codex-authored RED evidence during bootstrap, reject same-family RED/GREEN routing, classify and reject Writer touches to tests, test helpers, fixtures, RED evidence, and acceptance mappings, require full Stage 3 attempt invalidation plus complete revert evidence before rerun after contamination, route Claude-authored implementation escalation to Codex PM, and expose any missing or failed model-family/test-ownership gate through derived status without enabling Focused Session Context, Worktree Bootstrap Contract, scheduler execution, true parallel writable workstreams, cockpit UI/server/API, state-index persistence, automatic merge/push/deploy behavior, product UAT, actor identity policy, PR/CI workflow, live routing changes, paid reviewer routes, external services, installed global skills, dependency/lockfile changes, or later bootstrap gaps.
