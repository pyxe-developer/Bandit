# Workflow Cockpit Design Review

## Status

`pass` as a Phase 8 design starting point.

This review records that the supplied Claude Design artifacts are sufficient to
unblock the next Workflow Cockpit UI work item. It does not approve production
implementation details, local API shape, State Index timing, scheduler behavior,
worktree lifecycle behavior, merge/push/deploy behavior, or any UI-owned
workflow authority.

## Source Artifacts

- `docs/prds/BANDIT-PRD-003-attention-first-workflow-cockpit.md`
- `docs/design/workflow-cockpit/design-system.md`
- `docs/design/workflow-cockpit/attention-first-workflow-cockpit-prototype.html`
- `docs/design/workflow-cockpit/prototype-source/`
- `docs/design/workflow-cockpit/screenshots/home-artboard.png`
- `docs/design/workflow-cockpit/screenshots/evidence-drilldown-artboard.png`
- `docs/design/workflow-cockpit-boundary.md`
- `docs/decisions/2026-05-24-cli-authority-workflow-cockpit.md`
- `docs/decisions/2026-05-24-repo-native-state-index.md`
- `docs/decisions/2026-05-24-cli-owned-uat-approval-artifact.md`

## Visual Review Evidence

The original standalone prototype was served locally at
`http://127.0.0.1:8765/Bandit%20Cockpit%20_standalone_.html`, then the
repo-owned extracted source prototype was served at
`http://127.0.0.1:8766/docs/design/workflow-cockpit/prototype-source/index.html`
after provenance and current-context labels were normalized. Both were
inspected with Playwright on 2026-05-26.

Observed runtime state:

- Page loaded with title `Bandit — Attention-First Workflow Cockpit`.
- The prototype rendered multiple cockpit artboards and drill-down pattern
  screens.
- Console output contained the expected React DevTools info message, the
  expected in-browser Babel warning for a design prototype, and non-blocking
  `404` entries for optional design-canvas or browser chrome resources.
- No prototype-blocking JavaScript error was observed.

## Fit Against PRD

| Criterion | Verdict | Evidence |
| --- | --- | --- |
| Attention-first framing | `pass` | The home artboard leads with current next action, PM-owned work creation, operator input patterns, blocked or stale work, active work, and landing readiness. |
| Mission-control depth | `pass` | Drill-down artboards expose source traceability, review hash drift, policy context, gate evidence, and guarded review/landing actions. |
| Calm guided style | `pass` | The visual system uses deep matte surfaces, sparse coral emphasis, compact mono evidence, and restrained state chips. |
| CLI Authority boundary | `pass` | Primary actions are framed as CLI-backed requests such as work-item creation, validation, review gate, landing readiness, and UAT recording. |
| Repo-native traceability | `pass` | Cards and detail views show source artifacts, work IDs, hashes, evidence files, and coordination logs. |
| Operator-first mental model | `pass` | Work Items and Attention Categories are primary; agent/reviewer details are secondary evidence. |
| Improvement cockpit direction | `pass` | The artifact set includes improvement-health patterns and keeps workflow-learning visibility in scope. |
| Production implementation readiness | `non_blocking` | The HTML is a bundled design-canvas prototype, not production source. It should inform UI implementation, not be adopted as app code. |
| Responsive implementation evidence | `non_blocking` | The supplied artifact is desktop/artboard oriented. The first implementation slice must include responsive verification. |

## Accepted Direction

- Use the design system tokens as the initial Bandit cockpit visual baseline.
- Use the standalone prototype as the first visual reference for Phase 8 UI
  decomposition.
- Use the extracted prototype source bundle for component, fixture, and token
  reference only; its sample data is illustrative and does not replace current
  repo state.
- Preserve the Attention Category ordering established in the PRD.
- Keep guided actions limited to CLI-authorized requests.
- Keep source traceability visible inline through confidence cues and one level
  down through explicit artifact paths and evidence details.
- Keep the Operator Inbox as a repo-native artifact; the cockpit may display or
  link to it but does not replace it with UI-only notification state.
- Keep the prototype's annotated implementation guidance as design input for
  future view-model, action-eligibility, and evidence-detail modules.

## Required Follow-Up For Implementation

- Replace prototype-only sample data with a typed, testable view model derived
  from CLI output and repo-native artifacts.
- Do not use the bundled standalone HTML as the production implementation.
- Define responsive behavior before landing the first visual UI slice.
- Verify text fit, source-path wrapping, disabled-action states, and dense
  detail panels at desktop and mobile widths.
- Keep browser storage, local app state, SQLite, and generated reports
  non-canonical.

## Decision

The missing design-review blocker is resolved for planning purposes. The next
Phase 8 work item may be created from the PRD, design-system artifact,
standalone prototype, extracted prototype source, and this review.
