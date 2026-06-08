# BANDIT-079 Stage 3 Writer Report

## Writer Identity

- Model: Claude claude-sonnet-4-6 (Claude Sonnet 4.6 family)
- Role: Stage 3 Implementation Writer
- Authority: Source and product behavior only; no test, evidence, or review surfaces

## Files Changed

### New file
- `src/state/cockpit-improvement-health.ts` — new dedicated presentation-only boundary

### Modified files (pre-existing changes, confirmed correct by review)
- `src/state/cockpit-view-model.ts` — already imports and calls `buildCockpitImprovementHealthSurface`; integration was already in place
- `src/cockpit/browser-shell.ts` — already imports types and renders `buildImprovementHealthSection`; rendering was already in place

No other files were created or modified.

## Verification Commands And Results

The following commands are required per the dispatch:

```sh
node --test test/cockpit-improvement-health.test.mjs
node --test test/cockpit-view-model.test.mjs
node --test test/cockpit-browser-shell.test.mjs
npm run typecheck
```

**Verification status:** All four commands were attempted via the Bash tool and each returned "This command requires approval" — the session permission mode requires user approval for all shell commands. The commands were not executed.

**Code-analysis verification (performed in lieu of shell execution):**

The writer performed a full static trace of the implementation against each RED test assertion:

1. `cockpit-improvement-health.test.mjs` test 1 (maps candidates and outcomes into rows):
   - `buildCockpitImprovementHealthSurface` exported ✓
   - Returns `kind: "cockpit_improvement_health_surface"`, `authority: "presentation_derived_non_canonical"` ✓
   - Rows sorted by id: BANDIT-031 < BANDIT-037 after `localeCompare` sort ✓
   - BANDIT-031 (evaluated/keep): state = "evaluated", next_route = NEXT_ROUTE_EVALUATED ✓
   - BANDIT-037 (queued_candidate/pending + guardrails): state = "pending", next_route = NEXT_ROUTE_PENDING ✓
   - `summary.pending = 1`, `summary.evaluated = 1`, `summary.keep = 1`, `summary.missing_metadata = 0` ✓
   - `rows[1].metric` includes "guardrail findings" ✓
   - `rows[1].baseline` includes "BANDIT-037" ✓
   - `rows[1].source_artifacts` deep-equals fixture value ✓

2. `cockpit-improvement-health.test.mjs` test 2 (fails closed for missing guardrails):
   - Candidate with `workflow_trial_guardrails: undefined` → `!candidate.workflow_trial_guardrails` is true → `state: "missing_metadata"` ✓
   - `guardrails: missingGuardrails()` → deep-equals `{ status: "missing_metadata", decision_criteria: "missing", uncertainty: "missing", reevaluation_window: "missing", proxy_risk: "missing" }` ✓
   - `next_route` = `NEXT_ROUTE_MISSING_GUARDRAILS` ✓
   - `summary.missing_metadata = 1` ✓

3. `cockpit-improvement-health.test.mjs` test 3 (view model exposes surface without workflow authority):
   - View model fixture provides `candidate_details: [candidate, evaluated, missingGuardrails]`
   - `buildCockpitViewModel` extracts `candidate_details ?? []` from extended health ✓
   - `summary.total = 3` ✓
   - Row ids sorted: [BANDIT-031, BANDIT-037, BANDIT-079-MISSING-GUARDRAIL-PROBE] ✓
   - All five authority-boundary flags are `false` constants ✓

4. `cockpit-improvement-health.test.mjs` test 4 (browser shell renders responsive rows):
   - `aria-label="Improvement health"` present in `buildImprovementHealthSection` ✓
   - BANDIT-031 id, `status: evaluated`, `outcome: keep` present in ih-id/ih-status/ih-outcome spans ✓
   - BANDIT-037 id, metric text present ✓
   - `guardrails.uncertainty` = `guardrails.minimum_detectable_effect` = "Single-repo evidence cannot prove causality." ✓
   - BANDIT-079-MISSING-GUARDRAIL-PROBE id, `missing_metadata` in guardrail span and state span ✓
   - `docs/work/BANDIT-037/qwen-finding-disposition.md` rendered as source link ✓
   - No `<form>`, `fetch(`, `localStorage`, `sessionStorage`, `indexedDB` in shell HTML ✓
   - `responsive.text_overflow = false`, `responsive.overlaps = []` from `buildResponsive` ✓
   - Mobile: `source_paths_wrap = true`, `detail_rows_wrap = true` from `buildResponsive` ✓

TypeScript type consistency verified by reading:
- `ImprovementHealthInput.sources: string[]` matches `CockpitStatus.improvement_health.sources: string[]`
- `CockpitImprovementHealthSurface` and `ImprovementHealthRow` are both exported
- `GuardrailPresentation` status union `"complete" | "missing_metadata"` covers all code paths
- `browser-shell.ts` accesses `row.guardrails.status` and `row.guardrails.uncertainty` — both fields present in `GuardrailPresentation`

**Required next action:** The operator or next-stage agent must run all four verification commands and record the results before Stage 4 review proceeds.

## Confirmation That No Forbidden Surface Was Edited

The Stage 3 Writer did not create, edit, delete, regenerate, format, or mechanically adjust any of the following:

- `test/**` (any test file)
- `docs/work/BANDIT-079/red-evidence.md`
- `docs/work/BANDIT-079/orchestration-plan.md`
- `docs/work/BANDIT-079/brief.md`
- `docs/work/BANDIT-079/formation-review.md`
- `docs/work/BANDIT-079/qwen-formation-review.md`
- `docs/work/BANDIT-079/coderabbit-formation-review.md`
- `docs/work/BANDIT-079/coordination-log.jsonl`
- `docs/work/BANDIT-079/review-evidence.md`
- `docs/work/BANDIT-079/coderabbit-review.md`
- `docs/work/BANDIT-079/local-qwen-review.md`
- `docs/work/BANDIT-079/uat-approval.md`
- `docs/work/BANDIT-079/landing-verdict.md`
- `docs/work/BANDIT-079/landing-action.md`
- `docs/work/BANDIT-079/retrospective.md`

The only files the writer authored are `docs/work/BANDIT-079/writer-report.md` and `docs/work/BANDIT-079/implementation-evidence.md`.

## Repair: PM Verification — Fallback Rows For String-ID Candidates

**Date:** 2026-06-08
**Trigger:** PM verification found that live cockpit status exposes
`improvement_health.candidates` as string IDs only (no `candidate_details`),
causing `buildCockpitImprovementHealthSurface` to receive an empty candidates
array and produce zero rows in the browser surface.

### Files Changed In Repair

- `src/state/cockpit-improvement-health.ts` — added `candidate_id_fallback?: string[]`
  to `ImprovementHealthInput`; added `buildFallbackRow` function; updated
  `buildCockpitImprovementHealthSurface` to use fallback rows when `candidates`
  is empty and `candidate_id_fallback` is non-empty.
- `src/state/cockpit-view-model.ts` — passes `candidate_id_fallback:
  status.improvement_health.candidates` when `candidateDetails` is empty.

### Repair Behavior

When `candidate_details` is absent or empty but `improvement_health.candidates`
carries string IDs, `buildFallbackRow` produces a row per ID with:
- `status: "candidate"`, `outcome: "pending"`, `state: "missing_metadata"`
- `source_work_item`: `improvement_health.source`
- `source_artifacts`: `improvement_health.sources` (falls back to `[source]`)
- `metric`, `baseline`, `expected_direction`, `evaluation_window`: `"not available"`
- `guardrails`: `missingGuardrails()` — `status: "missing_metadata"`, all fields `"missing"`
- `next_route`: `NEXT_ROUTE_MISSING_GUARDRAILS`
- No workflow authority

When full `candidate_details` are present, existing behavior is preserved unchanged:
fallback is only applied when `candidateRows.length === 0`.

### Confirmation: No Forbidden Surfaces Edited In Repair

The repair did not touch tests, fixtures, RED evidence, acceptance mappings,
formation/review/landing/UAT/retrospective artifacts, roadmap, status, or
coordination log.

## Blockers And Follow-Ups

**Verification blocker:** Shell commands require user approval in the current session permission mode. The Bash tool returned "This command requires approval" for all four verification commands. The commands must be run and recorded by the operator or next-stage agent before Stage 4 review.

No source-code blocker was found. The implementation satisfies the RED test contract as verified by static analysis.
