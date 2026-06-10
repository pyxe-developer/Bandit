# BANDIT-PRD-004 / BANDIT-PRD-005 Decomposition

## Status

Repo PM decomposition recorded on 2026-06-10 after operator direction to
implement `BANDIT-PRD-004` and `BANDIT-PRD-005` before the V0 Closeout Claude
Code A/B Product-Value Trial.

## Source Authority

- `docs/prds/BANDIT-PRD-004-trust-boundary-autonomy.md` is accepted product
  and policy direction.
- `docs/prds/BANDIT-PRD-005-bandit-work-commands.md` is approved for
  implementation by the operator's 2026-06-10 direction.
- `CLEAN_CODE.md` and `docs/verification/STAGE_RUBRICS.md` were read before
  this decomposition.
- `.bandit/work-intake-ledger.json`, `docs/roadmap/CURRENT_CONTEXT.md`,
  `docs/roadmap/ROADMAP.md`, and `STATUS.md` remain the routing surfaces.

## Queue Decision

`BANDIT-PRD-004` and `BANDIT-PRD-005` move ahead of `WIL-V0-TRIAL`. The V0
trial remains deferred until every PRD-004/005 implementation slice is landed,
closed, blocked on operator-owned input, or explicitly dispositioned.

No operator-owned input is currently missing for the first PRD-004 slice.
Halt for operator input if later work would expand landing autonomy, approve
Notify-And-Revert or Auto-Landing Scope for a new cell, change UAT policy,
approve paid/live reviewer or model routing, approve public benchmark claims,
approve merge/push/deploy authority, or resolve ambiguous product/business
scope.

## PRD-004 Slices

1. `PRD-004.1` - Trust Boundary Evidence Schema Contracts.
   Add schema-only fail-closed Boundary Contour, Boundary Prediction Record,
   and Notify-And-Revert Artifact contracts plus validation coverage. Existing
   bootstrap `safe-to-land` flows must remain unblocked unless they claim
   `notify_and_revert` or `auto_land`.
2. `PRD-004.2` - Attribution Join Key Wiring.
   Add the structured attribution tuple to landing/model/tool/escape evidence
   surfaces that can know the fields directly, without introducing a model
   gateway dependency.
3. `PRD-004.3` - Escape Candidate Workflow.
   Add Escape Candidate and Confirmed Boundary Escape artifacts and Codex PM
   attribution-review validation with operator-input refusal for ambiguous
   product, UAT, business, policy, or explicit risk judgment.
4. `PRD-004.4` - Boundary Cell Movement Gate.
   Add Workflow Trial-backed boundary-cell movement evidence and fail-closed
   contraction behavior for confirmed escapes, without policy expansion from
   zero observed escapes.

## PRD-005 Slices

1. `PRD-005.1` - Roadmap Work Target Resolver.
   Add the deterministic current/next target resolver over `ROADMAP.md` and
   `CURRENT_CONTEXT.md`, with WIL/PRD/spec provenance dereferenced only after
   roadmap authorization.
2. `PRD-005.2` - Repo PM Create Controller And Prompt Contract.
   Add Bandit-native Repo PM prompt contract and create controller behavior
   that forms work through `formation_approved` and stops before Stage 2.
3. `PRD-005.3` - Work Item PM Execute Controller And Route Registry.
   Add execution orchestration boundaries, authorized route registry, internal
   role input packet assembly, and honest provider/blocker evidence recording.
4. `PRD-005.4` - Operator Command Adapters.
   Add thin `/bandit-work-create` and `/bandit-work-execute` adapters or their
   CLI-equivalent invocation layer after the deep controllers are tested.

## Boundary Notes

- Each slice must land before the next one begins.
- Future slice IDs are not allocated by this decomposition. Work Item IDs are
  allocated only by the normal Repo PM creation path.
- `BANDIT-PRD-004` does not authorize broader auto-landing or
  Notify-And-Revert execution in the first slice.
- `BANDIT-PRD-005` does not turn Work Intake Ledger entries into hidden
  scheduler authority and does not create a public `bandit context <stage>`
  workflow command.
