# BANDIT-054 RED Evidence

## Status

`pass` for Stage 2: Test Design And RED Evidence.

Focused Test Writer-owned tests define the Stage Capability Scope validation and work-item integration surface before implementation. The suite fails because Bandit currently has no `stage-capability-scope` command, work-item creation does not require `stage_capability_scope`, and generated briefs do not render stage capability scope evidence.

## Test Command

```sh
node --test test/stage-capability-scope.test.mjs
```

## Observed Output

```text
tests 6
pass 0
fail 6
stage capability scope validation accepts complete stage declarations failed: Unknown command: stage-capability-scope
stage capability scope validation rejects missing required stage fields failed because the command is missing
stage capability scope validation rejects load-bearing skills without lifecycle contracts failed because the command is missing
stage capability scope validation rejects Stage 3 writer test-surface authority failed because the command is missing
work-item create refuses specs without stage capability scope evidence failed because current work-item creation accepted a spec without stage_capability_scope
work-item create renders stage capability scope into generated briefs failed because the generated brief omitted the Stage Capability Scope section
```

## Acceptance Criteria Mapping

| Criterion | Evidence |
| --- | --- |
| Focused RED evidence proves Bandit currently lacks enforced Stage Capability Scope policy validation. | `test/stage-capability-scope.test.mjs` runs `bandit stage-capability-scope validate --json` against a complete policy; it fails with `Unknown command: stage-capability-scope`, proving no runnable validation surface exists yet. |
| The Stage Capability Scope policy validates authority role, required skills, allowed tools, inputs, outputs, evidence, forbidden actions, lifecycle contract references for load-bearing skills, and optional soft budget band references for each supported stage declaration. | The malformed-stage, missing-lifecycle-contract, and Stage 3 test-surface authority tests mutate focused policy fixtures and expect fail-closed diagnostics; all currently fail before policy validation because the command is missing. |
| Work-item creation specs and generated briefs require or render enough Stage Capability Scope data for Stage 1 verification without relying on chat context. | The missing `stage_capability_scope` work-item test expects `bandit work-item create` to refuse the spec, but the current command accepts it, proving the required field is not enforced. |
| Generated briefs render Stage Capability Scope data for future agents and validators. | The brief-rendering test creates a spec with `stage_capability_scope` and expects a `## Stage Capability Scope` section with policy, stages, and forbidden actions; the current generated brief omits that section. |
| Allowed-tool and forbidden-action declarations prevent Stage 3 Writers from editing tests, fixtures, RED evidence, or acceptance mappings and prevent merge, push, deploy, installed global skill edits, paid routing, external service setup, or broader authority changes unless a future scoped work item authorizes them. | The Stage 3 writer test makes `edit_tests` allowed and removes it from forbidden actions, then expects fail-closed validation; the current command is missing, so this authority boundary is not enforceable yet. |
| Optional soft budget band fields remain stage-scope metadata and do not create provider-pricing evidence, spend-class approval, paid routing policy, or continuation-decision authority. | The complete policy fixture includes `soft_budget_band: normal_long_running_stage` as metadata only and expects validation output to report the reference without approving paid or recurring routing. |
| RED coverage stays scoped to Stage Capability Scope and avoids unrelated implementation surfaces. | This Stage 2 step adds only `test/stage-capability-scope.test.mjs`, `docs/specs/BANDIT-054-red-evidence.json`, `docs/work/BANDIT-054/red-evidence.md`, lifecycle event evidence, and status/context routing. It adds no Stage 3 implementation, policy artifact, template, command, state parser, dependency, lockfile, live routing, paid route, installed global skill edit, merge, push, deploy, or unrelated Phase 8 work. |
| Stage 2 RED evidence preserves the Permanent Test Ownership Boundary and bootstrap model-family separation. | This RED evidence and tests are Codex PM/Test Writer-authored. Stage 3 implementation must be routed to Claude through the bootstrap Process Adapter path, and the Stage 3 Writer must not edit tests, test helpers, fixtures, RED evidence artifacts/specs, or acceptance mappings for `BANDIT-054`. |

## Next Action

Dispatch Stage 3 implementation for `BANDIT-054` to Claude through the bootstrap Process Adapter path: implement the narrow Stage Capability Scope repair by adding `.bandit/policy/stage-capability-scope.json`, `docs/templates/stage-capability-scope.md`, `bandit stage-capability-scope validate --json`, `bandit validate` integration, work-item spec validation and brief rendering for `stage_capability_scope`, required stage-field checks, authority-role checks, load-bearing skill lifecycle contract reference checks, allowed-tool and forbidden-action checks, Stage 3 Writer test-surface refusals, optional soft budget band metadata validation, and focused verification needed to make the RED tests pass. Keep the Stage 3 Writer away from tests, test helpers, fixtures, RED evidence artifacts/specs, acceptance mappings, token-cost failsafe policy, provider-pricing evidence, spend-class approval, Evidence SLO policy, full scheduler execution, full worktree lifecycle work, claim lease creation or release, work-surface reservations, cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy behavior, product UAT approval, live reviewer routing changes, paid reviewer routes, external service integration, installed global skill edits, dependency or lockfile changes, and unrelated Phase 8 work.
