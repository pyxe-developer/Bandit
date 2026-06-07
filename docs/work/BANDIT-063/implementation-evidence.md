# BANDIT-063 Implementation Evidence

## Stage 3 Status

`pass`

## Authorship

Stage 3 implementation authored by Claude (claude-opus-4-8) through the bootstrap
Process Adapter path. Codex authored the Stage 2 RED tests and RED evidence.
Bootstrap Model-Family Separation is satisfied: the model family that authored
the RED tests (Codex) is different from the model family that authored this
implementation (Claude).

## Production Files Changed

- `src/state/work-item-pm-plan.ts` (new) — `orchestrationPlanPath` and
  `requireOrchestrationPlan`: deterministic plan-mode artifact contract that
  fails closed on a missing artifact and on any missing required section
  (Current Repo State, Stage Sequence, Required Evidence, Role Boundaries,
  Verification Commands, Known Blockers, Stop Conditions, Forbidden Actions),
  each of which must contain non-empty content.
- `src/state/coordination-log.ts` — added `orchestration_plan_recorded` to the
  `CoordinationState` union and to `STATE_ORDER` between `formation_approved` and
  `red_recorded`; added `appendOrchestrationPlanRecordedStepTransition` and
  `hasOrchestrationPlanRecordedTransition`.
- `src/commands/work-item-pm.ts` — `checkStartReadiness`: after formation
  approval and formation-evidence recheck, requires the orchestration plan and
  records the append-only `orchestration_plan_recorded` transition when absent.
- `docs/templates/work-item-pm-plan.md` (new) — authoring template for the
  advisory plan-mode artifact.

## Acceptance Coverage

| Acceptance Criterion | Status | Evidence |
| --- | --- | --- |
| RED proves orchestration could proceed without a durable plan-mode artifact | pass | `requireOrchestrationPlan` now refuses when `docs/work/<ID>/orchestration-plan.md` is missing; `work-item-pm start` subtest "refuses orchestration before plan-mode evidence exists" is GREEN (role-entrypoints-formation 9/9). |
| Missing/under-scoped plan artifacts fail closed before Stage 2 RED or dispatch | pass | `requireOrchestrationPlan` enumerates and reports missing required sections; subtest "refuses under-scoped plan-mode evidence" is GREEN. |
| A deterministic plan-mode artifact contract exists with all required sections | pass | `REQUIRED_PLAN_SECTIONS` in `src/state/work-item-pm-plan.ts` enforces repo-state grounding, stage sequence, required evidence, role boundaries, verification commands, known blockers, stop conditions, and forbidden actions; documented in `docs/templates/work-item-pm-plan.md`. |
| Work Item PM refuses orchestration when the gate is unsatisfied and names the missing evidence | pass | Refusal messages name `docs/work/<ID>/orchestration-plan.md` and the specific missing plan-mode sections. |
| Coordination log records the satisfied gate as append-only evidence between formation and RED | pass | `appendOrchestrationPlanRecordedStepTransition` records a `work_item_pm` transition with `safe_triggers: ["red_evidence_required"]`; `orchestration_plan_recorded` is ordered between `formation_approved` and `red_recorded`; coordination-log subtest is GREEN (13/13). |
| Plan artifact is advisory and cannot replace canonical authority | pass | The plan is recorded only as an append-only coordination transition plus a template; the brief, coordination history, RED evidence, and later-stage artifacts remain canonical. Template states this explicitly. |
| Preserves Bootstrap Model-Family Separation and Permanent Test Ownership Boundary | pass | Claude (claude-opus-4-8) authored Stage 3 after Codex authored Stage 2 RED tests; Writer changed zero test surfaces. |
| No unrelated workflow/product surfaces introduced | pass | Diff is limited to the plan gate, coordination-state vocabulary, the command call site, and the template. No Trust Verifier cutover, role/execution packets, claim authority, worktree/scheduler execution, cockpit, dependency, or UAT scope. |

## Verification Commands And Results

```
node --test test/role-entrypoints-formation.test.mjs
```
tests 9 / pass 9 / fail 0 (RED was pass 7 / fail 2)

```
node --test test/coordination-log.test.mjs
```
tests 13 / pass 13 / fail 0 (RED was pass 12 / fail 1)

```
node --test test/coordination-status.test.mjs
```
tests 8 / pass 8 / fail 0

```
npm run typecheck
```
Clean.

```
npm run bandit -- validate
```
Bandit state is valid.

```
npm run bandit -- role-runs validate BANDIT-063 --json
```
pass.

```
git diff --check
```
Clean.

## Clean-Code Self-Check

1. **Spec alignment**: Implements exactly the dispatch's plan-mode gate; no
   product contract change.
2. **Small surface area**: One new focused module, one new state value plus its
   two helpers, one command call site, one template.
3. **Simple design**: Plan validation is a section-presence check over a named
   constant list; the command reads top-to-bottom (formation → recheck → plan →
   record → ready).
4. **Explicit state**: The planning gate is a named coordination state
   (`orchestration_plan_recorded`) and a named transition recorder, not a hidden
   side effect.
5. **No hidden authority**: The coordination log remains canonical workflow
   history; the plan artifact is advisory. No projection or template owns state.
6. **Testable behavior**: Refusal paths and the append-only transition are
   covered by the focused Stage 2 tests.
7. **Readable flow**: `checkStartReadiness` is a short linear sequence; refusal
   messages name the exact missing artifact and sections.
8. **Locality**: Plan-contract logic lives in `work-item-pm-plan.ts`;
   coordination-state logic lives in `coordination-log.ts`; the command only
   orchestrates.
9. **Failure clarity**: Missing and under-scoped plans fail closed with explicit
   messages naming the artifact path and missing sections.
10. **No role erosion**: Writer made zero test-surface edits; the plan-mode gate
    does not grant the Work Item PM authority to write tests, implement source,
    approve review, land, or close out.
11. **Improvement capture**: No new lessons; no-action.

## Test Ownership Boundary Evidence

The Stage 3 Writer changed only `src/commands/work-item-pm.ts`,
`src/state/coordination-log.ts`, `src/state/work-item-pm-plan.ts`, and
`docs/templates/work-item-pm-plan.md`. No test file, test helper, fixture, RED
evidence artifact, acceptance mapping, formation evidence, coordination history,
review evidence, landing evidence, or retrospective evidence was touched.

## Bootstrap Model-Family Separation Evidence

Codex (GPT-family) authored the Stage 2 RED tests, RED evidence, and acceptance
mappings. Stage 3 implementation was dispatched to and authored by Claude
(claude-opus-4-8) through the bootstrap Process Adapter path, satisfying the
Bootstrap Model-Family Separation requirement from the brief and Stage Rubrics.

## Plan Artifact Authority Statement

The orchestration plan recorded by this gate is append-only advisory
orchestration evidence. It cannot satisfy or replace canonical workflow-state,
coordination history, review, landing, UAT, or retrospective authority. Those
remain owned by the coordination log and the respective stage artifacts under
`docs/work/BANDIT-063/`. The plan-mode gate only sequences orchestration; it
grants no new write authority to the Work Item PM.

## Bootstrap Gaps

None.

## Follow-Up Concerns

None. The plan-mode gate is fully covered by the focused tests, fails closed on
missing or under-scoped plans, and keeps the plan artifact strictly advisory.
