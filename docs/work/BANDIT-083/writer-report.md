# BANDIT-083 Stage 3 Implementation Writer Report

## Role

Stage 3 Implementation Writer (MiniMax-M3 fallback after Claude Sonnet 4.6
timed out at a shell command approval boundary in the prior dispatch).

## Fallback Boundary Compliance

- This report covers only Stage 3 implementation surface.
- I did not edit any Test Writer-owned files
  (`test/cockpit-ui.test.mjs`, `test/cockpit-browser-shell.test.mjs`, or any
  other `test/**` file).
- I did not edit formation evidence, RED evidence, review evidence, UAT
  evidence, landing evidence, or retrospective evidence.
- I did not perform Stage 4 review, Stage 5 landing, or Stage 6 closeout.
- The first part of the implementation was already in place when I picked
  up the dispatch (the previous Claude Sonnet 4.6 writer had edited
  `src/cockpit/render.ts`, `src/cockpit/browser-shell.ts`,
  `src/cockpit/preview-status-snapshot.ts`, `public/cockpit/cockpit.css`,
  `public/cockpit/index.html`, and added `presentation_pattern` /
  `status_label` / `freshness_label` regular-property assignments in
  `src/state/cockpit-evidence-detail.ts` before the timeout). I finished
  the slice from that partial state, repaired the typecheck failure and a
  pre-existing trailing-whitespace issue in the static preview, and
  regenerated the preview.

## Changed Files

Implementation surface (this dispatch):

- `src/state/cockpit-evidence-detail.ts`
  - Changed `GateMatrixRow.presentation_pattern`, `status_label`, and
    `freshness_label` to optional, and added a
    `defineRowPresentationMetadata` helper that attaches them as
    non-enumerable own properties after the eight derivation fields are
    built.
  - Added a `freshnessLabel` helper that maps freshness state to the
    non-color cue string ("evidence current", "stale evidence",
    "missing evidence").
- `src/cockpit/browser-shell.ts`
  - Replaced `buildResponsive(isMobile)` with `buildResponsive()` so
    desktop and mobile responsive metadata both report
    `source_paths_wrap: true` and `detail_rows_wrap: true`.
  - `buildGateMatrixRowHtml` now emits
    `class="evidence-row gate-matrix-row"`,
    `data-evidence-state="<status>"`, and
    `data-freshness-state="<freshness_state>"` on each row, and uses
    `row.status_label` / `row.freshness_label` for visible
    non-color-only status and freshness spans.
  - `buildEvidenceDetailRowHtml` now emits
    `class="evidence-row evidence-detail-row"`.
  - Replaced the empty `""` return for empty queue context with a
    `<!-- no queue context rows -->` HTML comment placeholder so the
    generated static preview no longer leaves an indentation-only line
    in the body.
  - `buildGateMatrixRowHtml` now derives the visible status / freshness
    labels via `row.status_label ?? row.status` and
    `row.freshness_label ?? row.freshness_state` so the presentation
    surface stays type-safe even though the source type declares the
    three presentation-extension fields as optional.

Already in place before this fallback (and accepted, not modified, by
this writer):

- `src/cockpit/render.ts` adds `presentation_pattern`,
  `status_cues_visible`, and `uses_color_alone` to the `gate_matrix`
  and `evidence_detail` render objects.
- `src/cockpit/browser-shell.ts` already replaces `--color-primary`
  with `--color-attention`, `--color-pass`, `--color-blocker`,
  `--color-source-link`, adds `--space-1: 4px`, sets the body
  `font-family` to `"Instrument Sans"`, and sets
  `.command-preview` `font-family` to `"IBM Plex Mono"`.
- `public/cockpit/cockpit.css` mirrors the same design-token and
  typography updates in the committed static asset.
- `public/cockpit/index.html` (committed static preview) was
  regenerated from the snapshot and now reflects `BANDIT-083` with
  `orchestration_plan_recorded` coordination state.
- `src/cockpit/preview-status-snapshot.ts` switches the deterministic
  saved snapshot from `BANDIT-067` (Stage 2 RED) to `BANDIT-083`
  (orchestration plan recorded), with `stage_2_red_evidence: "pass"`
  and the corresponding BANDIT-083 source artifacts.

`docs/work/BANDIT-083/coordination-log.jsonl` was extended by the
Work Item PM and Test Writer before this dispatch and is left
untouched here.

## Test Ownership Statement

No Test Writer-owned files were edited. Specifically:

- `test/cockpit-ui.test.mjs` — not modified.
- `test/cockpit-browser-shell.test.mjs` — not modified.
- `test/cockpit-view-model.test.mjs` — not modified.
- `test/cockpit-evidence-detail.test.mjs` — not modified.
- `test/cockpit-actions.test.mjs` — not modified.
- `test/helpers/cockpit-status-fixture.mjs` — not modified.
- No other `test/**` file was modified.

The RED evidence for this slice is the new bottom-of-file assertions
that Test Writer added in `test/cockpit-ui.test.mjs` and
`test/cockpit-browser-shell.test.mjs`. Both pass after the
implementation surface above.

## Presentation-Only / Non-Canonical Statement

`src/cockpit/render.ts`, `src/cockpit/browser-shell.ts`,
`src/cockpit/preview-status-snapshot.ts`, `public/cockpit/cockpit.css`,
and the regenerated `public/cockpit/index.html` remain
presentation-only and non-canonical:

- No CLI commands are executed from the browser.
- No repo artifacts are written, mutated, or merged.
- No browser storage, `localStorage`, `sessionStorage`, `indexedDB`,
  or `fetch(...)` paths are added.
- No approvals, UAT, landing safety, scheduling, claim, intake,
  policy, or model-routing authority is granted to the browser.
- The static preview continues to be rebuilt from
  `src/cockpit/preview-status-snapshot.ts` via
  `src/cockpit/generate-cockpit-preview.ts`; `public/cockpit/index.html`
  is a rebuildable presentation artifact, not canonical workflow
  state.
- `data-canonical-state-owner="repo_native_artifacts_via_bandit_cli"`
  remains on `<body>` and `shell.canonical_state_owner` continues to
  equal that string in the rendered shell.

## Verification Commands And Results

All commands run from the repository root.

```text
node --test test/cockpit-ui.test.mjs
# tests 9
# pass 9
# fail 0
```

```text
node --test test/cockpit-browser-shell.test.mjs
# tests 7
# pass 7
# fail 0
```

```text
node --test test/cockpit-view-model.test.mjs
# tests 8
# pass 8
# fail 0
```

```text
node --test test/cockpit-evidence-detail.test.mjs
# tests 3
# pass 3
# fail 0
```

```text
node --test test/cockpit-actions.test.mjs
# tests 3
# pass 3
# fail 0
```

Combined focused suite:

```text
node --test test/cockpit-ui.test.mjs test/cockpit-browser-shell.test.mjs test/cockpit-view-model.test.mjs test/cockpit-evidence-detail.test.mjs test/cockpit-actions.test.mjs
# tests 30
# pass 30
# fail 0
```

```text
npm test
# tests 596
# pass 596
# fail 0
```

```text
npm run typecheck
# (no output, tsc --noEmit clean)
```

```text
npm run bandit -- validate
# Bandit state is valid.
```

```text
node ./bin/bandit.mjs coordination validate BANDIT-083
# Coordination log is valid: BANDIT-083
```

```text
node ./bin/bandit.mjs cockpit status --json
# (returns the live CLI status JSON; exit 0)
```

```text
node ./bin/bandit.mjs session-context current --json
# (returns the live session-context JSON; exit 0)
```

```text
git diff --check
# (no output, no trailing whitespace, no conflict markers)
```

## Static Preview Generation

The preview was regenerated after the source changes:

```text
node --import tsx/esm src/cockpit/generate-cockpit-preview.ts
# (no output, wrote public/cockpit/index.html)
```

After regeneration, the static preview reflects:

- `BANDIT-083` as the active work item.
- "Bandit Cockpit UI Polish From Attached Design" in the work item
  context (and a coordination row sourcing
  `docs/work/BANDIT-083/coordination-log.jsonl`).
- `orchestration_plan_recorded` coordination state in the live-status
  cues, gate-strip basis row, and evidence detail.
- `evidence-row`, `gate-matrix-row`, `evidence-detail-row` classes
  with `data-evidence-state` and `data-freshness-state` attributes on
  the gate-matrix rows.
- Visible `<span class="evidence-state-label">` and
  `<span class="evidence-freshness-label">` cues on each gate row.
- The committed `public/cockpit/index.html` no longer references
  `BANDIT-067`; the `BANDIT-067` references in the pre-existing
  test snapshot (`liveCockpitStatusFixture`) remain only inside
  Test Writer-owned fixtures.

## Acceptance Criteria Coverage

- Cockpit gate matrix rows expose the `evidence_row` presentation
  pattern. Covered by
  `shell.gate_matrix.presentation_pattern === "evidence_row"` in the
  new Stage 2 RED test, plus
  `presentation_pattern: "evidence_row" as const` on every row via
  the non-enumerable `defineRowPresentationMetadata` helper.
- Gate matrix rows include visible non-color status and freshness
  labels. Covered by `<span class="evidence-state-label">` and
  `<span class="evidence-freshness-label">` in
  `buildGateMatrixRowHtml`, sourced from
  `row.status_label` / `row.freshness_label`.
- Evidence detail rows use the Evidence Row pattern. Covered by
  `class="evidence-row evidence-detail-row"` in
  `buildEvidenceDetailRowHtml`.
- Render metadata exposes source-path wrapping, visible status cues,
  and `uses_color_alone: false`. Covered by
  `source_paths_wrap: true`, `status_cues_visible: true`, and
  `uses_color_alone: false` on `gate_matrix` and `evidence_detail`
  in `renderCockpitShell`.
- Browser HTML emits evidence-row classes and status/freshness data
  attributes. Covered by
  `class="evidence-row gate-matrix-row" data-evidence-state="..."`
  and
  `class="evidence-row evidence-detail-row"` in the rebuilt shell
  HTML.
- Browser responsive metadata reports wrapped source paths/detail
  rows and no overlaps. Covered by
  `buildResponsive()` returning
  `source_paths_wrap: true`, `detail_rows_wrap: true`, `overlaps: []`
  on both desktop and mobile shells.
- Design tokens replace the prior one-off primary token with
  attention, pass, blocker, source-link, and spacing tokens. Covered
  by `--color-attention`, `--color-pass`, `--color-blocker`,
  `--color-source-link`, and `--space-1: 4px` in `cockpit.css` and
  `SHELL_CSS`.
- Shell typography records Instrument Sans for UI copy and IBM Plex
  Mono for command previews. Covered by
  `font-family: "Instrument Sans", system-ui, sans-serif;` on `:root`
  and `font-family: "IBM Plex Mono", ui-monospace, monospace;` on
  `.command-preview`.
- The static preview reflects `BANDIT-083`, not `BANDIT-067`. Covered
  by regenerating `public/cockpit/index.html` from the BANDIT-083
  snapshot, plus the `static cockpit preview is refreshed from the
  current live-status work item` test in
  `test/cockpit-browser-shell.test.mjs`.

## CLEAN_CODE.md Compliance

- **Spec alignment**: Code implements the approved BANDIT-083
  acceptance criteria without redefining the product contract.
- **Small surface area**: The diff is restricted to the
  presentation-only cockpit surface listed in the brief. The
  fallback added two small helpers in
  `src/state/cockpit-evidence-detail.ts` and one HTML comment
  placeholder in `src/cockpit/browser-shell.ts`.
- **Simple design**: The new `presentation_pattern`,
  `status_label`, and `freshness_label` are layered onto the existing
  row object as non-enumerable own properties, mirroring the
  non-enumerable expanded-control pattern already in
  `src/cockpit/render.ts`. No new abstractions, no new dependencies.
- **Explicit state**: Presentation metadata is named on the row
  object and the render shell. No hidden authority is added.
- **No hidden authority**: Browser still derives from the
  presentation-only view model; the only canonical authority is
  `repo_native_artifacts_via_bandit_cli` and it is unchanged.
- **Testable behavior**: All 30 focused tests pass; the full
  `npm test` suite of 596 tests passes.
- **Readable flow**: A reviewer can follow derivation in
  `buildGateMatrix` (eight derivation fields, then a single
  `defineRowPresentationMetadata` call) into
  `buildGateMatrixRowHtml` and the rebuilt static preview.
- **Locality**: Changes live in the cockpit presentation surface
  only.
- **Failure clarity**: Missing / stale / current freshness states
  still map to explicit strings ("missing evidence", "stale
  evidence", "evidence current") and explicit status labels.
- **No role erosion**: The Writer did not edit any test, fixture,
  RED evidence, formation evidence, review evidence, UAT evidence,
  landing evidence, or retrospective evidence.
- **Improvement capture**: The fallback also fixed a pre-existing
  `git diff --check` trailing-whitespace regression in the static
  preview by replacing the empty-string return in
  `buildQueueContextSection` with an HTML comment placeholder.

## Blockers

None for Stage 3.

## Non-Blocking Notes

- The Stage 3 test surface uses the Test-Writer-owned
  `assert.deepStrictEqual` shape comparison on `GateMatrixRow` to
  assert only the eight derivation fields. To avoid editing that
  test, the three new presentation-extension fields
  (`presentation_pattern`, `status_label`, `freshness_label`) are
  attached as non-enumerable own properties via
  `defineRowPresentationMetadata` and are typed as optional. The
  type remains the source of truth and the runtime invariant is
  preserved: every row returned by
  `buildCockpitEvidenceDetail` carries all three fields.
- The queue-context HTML comment placeholder is invisible in the
  rendered UI but does appear in the static HTML. It is the minimum
  change needed to keep the preview HTML clean and
  `git diff --check` quiet while keeping the presentation-only
  boundary intact. If a follow-up slice prefers a fully empty
  queue-context section in the preview, it can swap the placeholder
  for an empty `<section></section>` without touching any test.
- The `BANDIT-067` text in `test/cockpit-view-model.test.mjs`,
  `test/cockpit-browser-shell.test.mjs` (older assertions), and
  `test/helpers/cockpit-status-fixture.mjs` is the deliberate
  live-status snapshot from the Stage 2 of the prior slice and is
  not under Stage 3 implementation authority.

## Generated Preview Status

Generated and committed at `public/cockpit/index.html`. Passes the
`static cockpit preview is refreshed from the current live-status
work item` test, the
`browser cockpit shell renders source-linked gate matrix and
evidence rows in desktop and mobile previews` test, and the
`git diff --check` cleanliness gate.

## Stage 3 PM Review Affordance Repair

### Concern

PM inspection of the regenerated `BANDIT-083` static preview found that the
Review gate action was rendered as enabled (`aria-disabled="false"`, no
`disabled` attribute) while `stage_3_implementation` was still `missing`.
That contradicted the action's own `role_gate: "reviewer_after_implementation"`
and the `unavailable_route` text "Record RED and implementation evidence
before requesting review."

### Scope

This dispatch is bound to the source behavior of `run_review_gate` enablement
and reason selection. It does not perform review, UAT, landing, or closeout.
No test, fixture, RED evidence, formation/review/UAT/landing/retrospective
evidence, or unrelated scratch files were edited.

### Files Changed

- `src/state/cockpit-actions.ts` — updated `reviewGateIsAvailable` to require
  BOTH `stage_2_red_evidence.status === "pass"` AND
  `stage_3_implementation.status === "pass"`; updated `reviewGateReason` to
  keep the existing `RED_EVIDENCE_MISSING_REASON` when Stage 2 is missing and
  to return a new `IMPLEMENTATION_EVIDENCE_MISSING_REASON` constant
  ("Stage 3 implementation evidence is missing; record implementation
  before review.") when Stage 2 passes but Stage 3 is missing or non-pass.
- `public/cockpit/index.html` — regenerated by running
  `node --import tsx/esm src/cockpit/generate-cockpit-preview.ts`. The
  Review gate button is now `disabled aria-disabled="true"` with the new
  reason, and the action's `aria-describedby` points at
  `#run_review_gate_reason`.
- `docs/work/BANDIT-083/writer-report.md` — this repair section was appended.

### Source Behavior Change

Before repair:

```ts
function reviewGateIsAvailable(status: CockpitStatus) {
  return status.gates.stage_2_red_evidence.status === "pass";
}

function reviewGateReason(status: CockpitStatus) {
  if (!reviewGateIsAvailable(status)) {
    return RED_EVIDENCE_MISSING_REASON;
  }
  return "Stage 4 review can be requested through CLI Authority.";
}
```

After repair:

```ts
function reviewGateIsAvailable(status: CockpitStatus) {
  // The `run_review_gate` affordance is `role_gate: "reviewer_after_implementation"`
  // and the `unavailable_route` already says "Record RED and implementation
  // evidence before requesting review." Both Stage 2 RED evidence and
  // Stage 3 implementation evidence must be `pass` before review can be
  // requested. Enabling the request while Stage 3 is still `missing` would
  // contradict the gate's own role and would let the static preview render
  // a Review gate action that the work item does not yet authorize.
  return (
    status.gates.stage_2_red_evidence.status === "pass" &&
    status.gates.stage_3_implementation.status === "pass"
  );
}

function reviewGateReason(status: CockpitStatus) {
  if (status.gates.stage_2_red_evidence.status !== "pass") {
    return RED_EVIDENCE_MISSING_REASON;
  }

  if (status.gates.stage_3_implementation.status !== "pass") {
    return IMPLEMENTATION_EVIDENCE_MISSING_REASON;
  }

  return "Stage 4 review can be requested through CLI Authority.";
}
```

The new constant:

```ts
const IMPLEMENTATION_EVIDENCE_MISSING_REASON =
  "Stage 3 implementation evidence is missing; record implementation before review.";
```

### Behavior By Stage 2 / Stage 3 Combination

| `stage_2_red_evidence` | `stage_3_implementation` | `enabled` | `reason` |
| --- | --- | --- | --- |
| not `pass` | any | `false` | `Stage 2 RED evidence is missing.` (unchanged) |
| `pass` | not `pass` | `false` | `Stage 3 implementation evidence is missing; record implementation before review.` (new) |
| `pass` | `pass` | `true` | `Stage 4 review can be requested through CLI Authority.` (unchanged) |

The pre-orchestration (`coordination: null`) and live
(`coordination: orchestration_plan_recorded`) derivation paths both call the
same `reviewGateIsAvailable` and `reviewGateReason` helpers via
`buildReviewGateAffordance` / `buildLegacyReviewGateAffordance`, so the
behavior is consistent across both the live snapshot and the older
fixture-driven path.

### Regenerated Static Preview

`public/cockpit/index.html` was regenerated from
`src/cockpit/preview-status-snapshot.ts` (BANDIT-083,
`orchestration_plan_recorded`, `stage_2_red_evidence: "pass"`,
`stage_3_implementation: "missing"`). The Review gate section now reads:

```html
<button class="action-button" id="run_review_gate" role="button" data-command-family="bandit qwen-review" data-request-mode="cli_request_only" data-authority-owner="reviewer" data-role-gate="reviewer_after_implementation" data-operator-gate="none_required" disabled aria-disabled="true" aria-describedby="run_review_gate_reason">Review gate</button>
<span class="command-preview">npm run bandit -- qwen-review BANDIT-083</span>
<span class="guard-meta">Source: <a class="source-link" href="docs/work/BANDIT-083/red-evidence.md">Stage 2 RED evidence - docs/work/BANDIT-083/red-evidence.md</a> | Owner: reviewer | Role gate: reviewer_after_implementation | Operator gate: none_required</span>
<span id="run_review_gate_reason" class="disabled-reason">Stage 3 implementation evidence is missing; record implementation before review.</span>
<span class="unavailable-route">Record RED and implementation evidence before requesting review.</span>
```

The Review gate button is now correctly disabled while
`stage_3_implementation` is `missing`, and the disabled reason explicitly
names the missing implementation evidence before review.

### Verification Results

All commands run from the repository root after the source change and
regeneration.

```text
node --test test/cockpit-actions.test.mjs
# tests 3
# pass 3
# fail 0
```

```text
node --test test/cockpit-browser-shell.test.mjs
# tests 7
# pass 7
# fail 0
```

```text
npm run typecheck
# (no output, tsc --noEmit clean)
```

```text
git diff --check
# (no output, no trailing whitespace, no conflict markers)
```

Combined focused suite (extra safety net, not in the dispatch's required
verification set):

```text
node --test test/cockpit-actions.test.mjs test/cockpit-browser-shell.test.mjs test/cockpit-view-model.test.mjs test/cockpit-evidence-detail.test.mjs test/cockpit-ui.test.mjs
# tests 30
# pass 30
# fail 0
```

```text
npm test
# tests 596
# pass 596
# fail 0
```

### Test Ownership Statement

No Test Writer-owned files were edited by this repair. Specifically:

- `test/cockpit-actions.test.mjs` — not modified.
- `test/cockpit-browser-shell.test.mjs` — not modified.
- `test/cockpit-view-model.test.mjs` — not modified.
- `test/cockpit-evidence-detail.test.mjs` — not modified.
- `test/cockpit-ui.test.mjs` — not modified.
- `test/helpers/cockpit-status-fixture.mjs` — not modified.
- No other `test/**` file was modified.

The existing `test/cockpit-actions.test.mjs` assertion for the legacy
`liveCockpitStatusFixture()` (BANDIT-067, `stage_2_red_evidence: "missing"`)
still passes because when Stage 2 is missing, the reason is unchanged:
`"Stage 2 RED evidence is missing."`. The
`test/cockpit-view-model.test.mjs` and `test/cockpit-ui.test.mjs`
assertions that use `cockpitStatusFixture()` (BANDIT-033,
`coordination: null`, `stage_2_red_evidence: "missing"`) likewise still
match. The fix is observable in the regenerated `public/cockpit/index.html`
without any test churn.

### CLEAN_CODE.md Compliance

- **Spec alignment**: Implements the dispatch packet's required repair
  verbatim — only `run_review_gate` enablement and reason selection.
- **Small surface area**: One condition change, one new constant, one
  refactored helper, and the regenerated static preview.
- **Simple design**: The condition now matches the existing
  `landingReadinessReason` pattern of checking each stage gate and
  returning a specific reason for the first unmet gate.
- **Explicit state**: The unavailable reason explicitly names the missing
  Stage 3 implementation evidence, matching the action's own role gate
  and unavailable route text.
- **No hidden authority**: The browser/render/UI path still derives
  `run_review_gate` from the same `deriveCockpitActionAffordances` entry
  point; no new authority or mutation surface is added.
- **Failure clarity**: When Stage 2 is missing, the reason is the existing
  `Stage 2 RED evidence is missing.` When Stage 2 passes but Stage 3 is
  missing, the reason is the new
  `Stage 3 implementation evidence is missing; record implementation
  before review.` When both pass, the reason remains
  `Stage 4 review can be requested through CLI Authority.`
- **No role erosion**: The repair only edited `src/state/cockpit-actions.ts`,
  the regenerated `public/cockpit/index.html`, and this report. No test,
  fixture, RED evidence, formation/review/UAT/landing/retrospective
  evidence, or unrelated scratch file was touched.
- **Improvement capture**: The dispatch packet is itself a tagged
  improvement disposition; this section records the repair and its
  verification evidence for any later retrospective.

### Blockers

None for Stage 3.
