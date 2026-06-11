# BANDIT-097 Implementation Evidence

contract_version: 1
work_item: BANDIT-097
stage: Stage 3 Implementation
author: minimax_fallback_writer
timestamp: 2026-06-11T15:10:00Z
verdict: pass
stage3_route: claude_then_minimax_fallback

## Authorship Route

- Primary Stage 3 implementation writer: Claude through the bootstrap
  Process Adapter path. Claude authored the source diff for the three
  files listed below before its headless command exited with code 124.
- Fallback Stage 3 writer: MiniMax-M3 through headless `pi`. The fallback
  recorded the writer evidence only; it did not edit source files.
- Bootstrap Model-Family Separation: Codex authored the Stage 2 RED tests,
  and the Stage 3 implementation was authored by Claude (with MiniMax-M3
  fallback) under the bootstrap rule that the Stage 3 Writer must be a
  different model family from the Test Writer.

## Source Files Changed

The Stage 3 implementation is limited to the following three source files:

- `src/commands/bandit-work-create.ts` - thin operator adapter that
  delegates to `runRepoPmCreateController` and renders concise
  `bandit_work_create_result` JSON.
- `src/commands/bandit-work-execute.ts` - thin operator adapter that reads
  the active Work Item from `CURRENT_CONTEXT.md`, scans the coordination
  log for `formation_approved`, and delegates route decisions to
  `resolveWorkExecuteControllerAction`.
- `src/cli.ts` - routed `bandit work-create` and `bandit work-execute` to
  their adapter modules; no nested `bandit work create` namespace or public
  `bandit context <stage>` command was added.

No other source, test, controller, state, route-registry, role-packet,
provider-evidence, formation, review, landing, closeout, coordination,
roadmap, status, package-manifest, lockfile, or CI/release files were
edited by the Stage 3 Writer.

## Verification Commands And Results

Run in the PM shell after Claude exited:

| Command | Result |
| --- | --- |
| `node --test test/bandit-work-command-adapters.test.mjs` | pass, 7/7 |
| `node --test test/work-create-controller.test.mjs` | pass, 7/7 |
| `node --test test/work-execute-controller.test.mjs` | pass, 3/3 |
| `npm run typecheck` | pass |

The focused adapter suite is GREEN, the create-controller suite is GREEN,
the execute-controller suite is GREEN, and the TypeScript project
typechecks.

## Acceptance Criteria Mapping

| Acceptance criterion | Evidence |
| --- | --- |
| Create adapter invokes the existing Repo PM create-controller path. | `src/commands/bandit-work-create.ts` calls `runRepoPmCreateController` and never parses roadmap, WIL, or Work Item artifacts directly. |
| Create adapter stops before Stage 2 and never creates Stage 2+ artifacts. | Focused test `work-create adapter delegates to Repo PM create controller and stops before Stage 2` asserts `stage2_started: false` and that no `orchestration-plan.md`, RED, implementation, review, landing, or retrospective artifact is written. |
| Create adapter reports `already_formed` idempotently. | Focused test `work-create adapter reports already formed work idempotently` asserts `status: "already_formed"`, `stage_reached: "Stage 1: formation_approved"`, and `next_safe_command: "bandit work-execute"`. |
| Create adapter refuses on missing source authority. | Focused test `work-create adapter preserves controller refusal for missing source authority` asserts `status: "blocked"`, `blocker: /missing explicit source spec/i`, and that no `brief.md` is written. |
| Execute adapter delegates to the existing Work Item PM execute-controller path. | `src/commands/bandit-work-execute.ts` calls `resolveWorkExecuteControllerAction` and never constructs routes outside the controller helper. |
| Execute adapter refuses before `formation_approved`. | Focused test `work-execute adapter refuses before formation_approved and never creates new work` asserts `blocker: /formation_approved/i` and that no new Work Item is created. |
| Execute adapter reports the plan-mode gate before RED evidence. | Focused test `work-execute adapter reports the plan-mode gate before RED evidence` asserts `blocker: "missing_plan_mode"`, the required evidence list, and `next_safe_command: "node ./bin/bandit.mjs work-item-pm start BANDIT-097"`. |
| Execute adapter delegates to the Stage 2 route after plan-mode evidence. | Focused test `work-execute adapter delegates to the Stage 2 route after plan-mode evidence` asserts `route.stage: "stage_2_red"`, `route.authority_role: "test_writer"`, `canonical_state_owner: "repo_native_artifacts"`, and `role_input_packet.authority: "derived_non_canonical"`. |
| Adapter output is concise and operator-facing. | Both adapters emit structured JSON with `kind`, `delegate`, `status`, `work_item`, `stage_reached`, `evidence_written` or `evidence_required`, `blocker`, `required_operator_input`, and `next_safe_command` fields. |
| `bandit work create` and `bandit context <stage>` remain unavailable. | Focused test `operator adapters keep command separation and do not expose public context command` asserts both forms return `Unknown command` and exit non-zero. |
| CLI Authority preserved. | Adapter JSON payloads are non-canonical; canonical state remains in `docs/work/<ID>/` packages, the coordination log, and the roadmap/current-context files. |
| Local Qwen route is preserved. | Adapters do not invoke reviewers directly; the existing create-controller Local Qwen profile check remains the only reviewer gate touched by this slice. |

## Clean-Code Self-Check

Aligned with `CLEAN_CODE.md`:

- Spec alignment - the diff implements the approved PRD-005.4 spec and
  acceptance criteria; no product contract was redefined.
- Small surface area - only three source files changed; no unrelated
  refactors.
- Simple design - each adapter is a thin function that delegates to one
  controller helper and renders one structured payload.
- Explicit state - workflow state, gate results, and side effects are
  visible in the named fields of the structured JSON output.
- No hidden authority - adapters do not own canonical state; they
  delegate to the existing Repo PM create-controller and Work Item PM
  execute-controller helpers.
- Testable behavior - the focused test suite covers delegation,
  refusal, idempotency, command separation, and plan-mode reporting.
- Readable flow - a reviewer can follow the adapter call path from CLI
  routing to controller delegation to structured payload.
- Locality - related code lives together in each adapter file; the
  controller helpers already exist in their own modules.
- Failure clarity - refusals are fail-closed with structured JSON
  diagnostics, non-zero exit, and a documented next safe command.
- No role erosion - the Stage 3 Writer did not edit tests, RED evidence,
  acceptance mappings, formation artifacts, review artifacts, landing
  artifacts, retrospective artifacts, or roadmap/status files.

## Test Surface Evidence

- No Stage 3 Writer edits to `test/bandit-work-command-adapters.test.mjs`
  or any other `test/**` file.
- No Stage 3 Writer edits to test helpers, fixtures, RED evidence, or
  acceptance mappings.
- The Permanent Test Ownership Boundary is preserved.

## Forbidden Action Check

- No new `bandit context <stage>` command.
- No nested `bandit work create` namespace.
- No new Work Item creation from the execute adapter.
- No direct `qwen` CLI, Ollama, or ad hoc reviewer invocation from the
  adapters.
- No dependency, lockfile, package-script, CI/release workflow,
  installed global skill, automation prompt, or external repo mutation.
- No Trust Verifier cutover, old-gate replacement, local API, State
  Index, cockpit action, hosted service, telemetry, or paid route work.
- No expansion of landing autonomy or merge/push/deploy authority.

## Repository State At Evidence Time

- `git status --short --branch` reported `## main...origin/main [ahead 1]`
  with the Stage 3 source files untracked or modified in the working
  tree; no Stage 3 Writer commit was authored. Commit authority belongs
  to the Landing Agent during Stage 5.
- The HEAD commit `a093eb3 Form BANDIT-097 operator command adapters` is
  the Repo PM formation commit recorded before Stage 3 dispatch.

## Next Stage

Codex PM should run Stage 3 PM acceptance, then route the slice to
Stage 4 review (Local Qwen through the authorized MLX route, CodeRabbit
or honest provider-timeout/refusal evidence, aggregate review evidence,
review-subject hash, and applicable risk-classification and
supply-chain-gate evidence).
