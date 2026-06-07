# BANDIT-067 Retrospective

## Outcome

`BANDIT-067` landed and closed out the Live Cockpit Status View From CLI
Payload product slice. The work extends the cockpit presentation layer so the
browser shell renders source-linked first-screen cues and the full Stage 0-6
gate strip from the CLI cockpit-status payload, while preserving CLI authority
and non-canonical browser presentation state.

The implementation adds deterministic live-status presentation mapping in
`src/state/cockpit-view-model.ts`, exposes status cues and gates through
`src/cockpit/render.ts`, renders them in `src/cockpit/browser-shell.ts`, and
adds a saved static preview snapshot/generator for
`public/cockpit/index.html`. It does not add browser storage, JavaScript
mutation behavior, local API calls, State Index work, guarded action execution,
scheduler behavior, claim/worktree execution, merge, push, deploy, or Trust
Verifier cutover.

## What Worked

- Formation, plan-mode orchestration, RED evidence, Claude Stage 3
  implementation, PM acceptance, Stage 4 review, UAT, landing, and closeout
  stayed grounded in repo-native artifacts.
- Bootstrap Model-Family Separation held: Codex authored Stage 2 RED evidence
  and Claude implemented Stage 3 source only.
- The Stage 3 Writer stayed within source/chore delivery surfaces and did not
  edit Test Writer-owned tests, helpers, fixtures, RED evidence, acceptance
  mappings, review evidence, landing evidence, UAT evidence, or retrospective
  evidence.
- The focused RED tests correctly caught missing live-status cues, missing full
  Stage 0-6 gates, and stale static preview content before implementation.
- Landing gates caught a parser-invalid `uat_status` value before landing and
  required a current source-head refresh after the implementation/evidence
  commit.
- CLI-owned UAT was recorded before landing the operator-facing live status
  view.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| The cockpit browser shell can render live CLI payload fields without becoming workflow authority. | explicit no-action decision | The implementation keeps CLI artifacts canonical, labels browser output as presentation-only, escapes generated values, and adds no browser mutation path. |
| Landing Agent dirty-path enforcement requires a committed source/evidence package before local-record landing. | explicit no-action decision | The landing command correctly blocked while source and policy files were dirty; the route was to commit the implementation/evidence package, refresh terminal evidence, then record landing action. |
| Terminal evidence must be refreshed after the implementation/evidence commit, not only before it. | explicit no-action decision | `land-check` caught stale review hash and UAT source-head metadata after commit; those fields were refreshed before landing. |
| CodeRabbit, Local Qwen, and Playwright MCP availability remain unreliable during bootstrap review/QA. | explicit no-action decision | The work item records provider/browser-tool bootstrap replacement evidence without claiming independent reviewer or browser-smoke passes; deterministic tests and policy gates covered the approved scope. |
| The next Phase 8 cockpit slice should deepen evidence drilldown rather than expanding this slice into actions or local APIs. | explicit no-action decision | Evidence Drilldown And Gate Matrix remains the next bounded slice and must go through normal Repo PM Stage 1 formation before RED evidence. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | CodeRabbit provider review timed out, Local Qwen was unavailable through wrapper and direct non-interactive routes, Playwright MCP browser smoke was profile-locked, and initial landing checks rejected a parser-invalid UAT metadata value plus stale post-commit source evidence. | explicit no-action decision - provider/browser limitations are recorded as bootstrap replacement evidence, while parser/source-head issues were repaired before landing |
| overreasoning | The work did not implement local API endpoints, State Index, guarded browser action execution, scheduler, claim/worktree lifecycle, PR/CI behavior, merge, push, deploy, Trust Verifier cutover, or unrelated Phase 8 features. | explicit no-action decision - forbidden scope stayed out of the implementation and closeout |
| work-breakdown fit | Live cockpit payload presentation, static preview refresh, focused tests, UAT, and landing evidence formed a bounded follow-on cockpit product slice. | explicit no-action decision - the next cockpit feature remains a separately formed slice |
| agent-scope fit | Repo PM, Work Item PM, Test Writer, Claude Implementation Writer, reviewers, Landing Agent, operator UAT, and Closeout Agent responsibilities stayed separated. | explicit no-action decision - role boundaries held |
| tool-use rule pressure | Landing continuation required committing implementation evidence before local-record landing and then refreshing terminal evidence to the committed head. | explicit no-action decision - the existing gates caught the unsafe state and no new workflow-policy gap is needed |
| reviewer/model routing | CodeRabbit and Local Qwen did not return terminal review findings; PM review used deterministic tests, typecheck, risk classification, supply-chain gate, and clean-code review as replacement evidence. | explicit no-action decision - no reviewer finding remains unresolved and no reviewer pass is claimed |
| tool invocation friction | Review provider and browser MCP availability were the only recurring friction; cockpit, session-context, land-check, auto-land-check, land, validate, tests, and typecheck had established invocations. | explicit no-action decision - no new invocation chore is created because existing artifacts record provider timeout/unavailability honestly |
| recurring inefficiency | Review-subject hash and UAT source-head refresh after implementation commit is easy to miss. | explicit no-action decision - the current landing gates already fail closed and produced actionable diagnostics |
| cost or latency signals | No paid reviewer route, paid model route, provider-pricing approval, spend-class approval, dependency install, external service setup, merge, push, deploy, or hosted preview was introduced. | explicit no-action decision - no cost-policy or supply-chain follow-up is required |
| unresolved uncertainty | The next cockpit slice is known at the roadmap level, but no next Work Item ID is formed yet. | explicit no-action decision - create the next Phase 8 work item through normal Repo PM Stage 1 formation before RED evidence |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

The actionable issues from `BANDIT-067` were handled before landing:

- `review-evidence.md` now uses the accepted terminal UAT value `pass`.
- Stage 4, UAT, and landing verdict source-head metadata were refreshed to the
  committed implementation source head before local-record landing.
- Risk classification and supply-chain gate decisions for `BANDIT-067` are
  registered in the repo policy files and validated.

Provider-review and browser-MCP limitations are durable bootstrap replacement
evidence for this work item, not a new unresolved workflow-policy gap.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-067`. Claude source
implementation was accepted after PM review, focused tests, full test suite,
typecheck, clean-code review, UAT, risk classification, supply-chain gate, and
landing checks. CodeRabbit and Local Qwen did not produce terminal findings;
their limitations are recorded as bootstrap replacement evidence rather than
pass evidence.

## Bootstrap Gaps Remaining

No open bootstrap gap blocks Phase 8 cockpit product work. The next recorded
action is to create the Phase 8 Evidence Drilldown And Gate Matrix slice
through Repo PM Stage 1 formation before RED evidence.
