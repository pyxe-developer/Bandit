# BANDIT-066 Retrospective

## Outcome

`BANDIT-066` landed and closed out the Browser-Served Cockpit App Shell
product slice. The work creates a presentation-only browser shell module at
`src/cockpit/browser-shell.ts`, a static local preview at
`public/cockpit/index.html` with `public/cockpit/cockpit.css`, focused browser
shell tests, and the supporting review, UAT, landing, risk, and supply-chain
evidence for the first Phase 8 operator-facing cockpit surface.

The browser shell remains non-canonical. It consumes typed cockpit presentation
data, exposes source-linked evidence and disabled guarded action affordances,
and does not parse repo artifacts directly, call the CLI, use browser storage,
create mutation forms, implement a live API, choose State Index timing, approve
UAT, grant landing authority, merge, push, deploy, or replace Bandit CLI
authority.

## What Worked

- Formation, plan-mode orchestration, RED evidence, Claude Stage 3
  implementation, PM acceptance, Stage 4 review, UAT, landing, and closeout
  stayed grounded in repo-native evidence.
- Bootstrap Model-Family Separation held: Codex authored Stage 2 RED evidence
  and Claude implemented Stage 3 source only.
- The Stage 3 Writer did not edit Test Writer-owned tests, helpers, fixtures,
  RED evidence, acceptance mappings, review evidence, landing evidence, UAT
  evidence, or retrospective evidence.
- Static preview polish found and repaired a favicon lookup and visible
  non-canonical authority cue before landing.
- Focused regressions repaired two mechanical blockers found during landing:
  active product-slice session-context projection and git-status dirty-path
  parsing for allowed work-item package evidence.
- CLI-owned UAT was recorded before landing the operator-facing shell.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| The first browser-served cockpit shell can be useful without becoming workflow authority. | explicit no-action decision | The implementation keeps the browser layer presentation-only, source-linked, static-preview capable, and free of browser storage, mutation forms, live API calls, CLI execution, merge, push, deploy, or hidden approval authority. |
| Product slices are legitimate active work items even when no bootstrap gap is linked. | explicit no-action decision | The session-context product-slice projection blocker was repaired with focused regression coverage before landing; no follow-up chore remains. |
| Landing Agent dirty-path handling depends on preserving leading git-status columns. | explicit no-action decision | The dirty-path parsing blocker was repaired with focused regression coverage before landing; no follow-up chore remains. |
| CodeRabbit and Local Qwen provider availability remains unreliable during bootstrap review. | explicit no-action decision | `coderabbit-review.md`, `local-qwen-review.md`, and aggregate review evidence record bootstrap replacement evidence without claiming independent reviewer passes; no new invocation-contract gap is opened by this slice. |
| The next Phase 8 cockpit slice should use the app shell as presentation substrate, not expand this slice into live status ingestion. | explicit no-action decision | Live Cockpit Status View From CLI Payload remains the next bounded slice and must go through normal Stage 1 formation before RED evidence. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | CodeRabbit provider review timed out and Local Qwen was unavailable through both wrapper and direct non-interactive paths; `session-context current --json` and `bandit land` also exposed mechanical blockers during landing continuation. | explicit no-action decision - provider limitations are recorded as bootstrap replacement evidence, while both mechanical blockers were repaired with focused regressions before landing |
| overreasoning | The work did not implement live CLI invocation, local API endpoints, State Index, guarded action execution, scheduler, claim/worktree lifecycle, PR/CI behavior, merge, push, deploy, Trust Verifier cutover, or unrelated Phase 8 features. | explicit no-action decision - forbidden scope stayed out of the implementation and closeout |
| work-breakdown fit | A browser shell module, static preview, focused tests, UAT, and landing evidence formed a bounded first cockpit product slice. | explicit no-action decision - the next cockpit feature remains a separately formed slice |
| agent-scope fit | Repo PM, Work Item PM, Test Writer, Claude Implementation Writer, reviewers, Landing Agent, operator UAT, and Closeout Agent responsibilities stayed separated. | explicit no-action decision - role boundaries held |
| tool-use rule pressure | Stage 4 and Stage 5 required extra evidence refresh after PM-found mechanical repairs, but the stage boundaries were recorded honestly. | explicit no-action decision - review evidence was refreshed after source/test repairs before UAT and landing |
| reviewer/model routing | CodeRabbit and Local Qwen did not return terminal review findings; PM review used deterministic tests, typecheck, browser smoke, risk classification, supply-chain gate, and clean-code review as replacement evidence. | explicit no-action decision - no reviewer finding remains unresolved and no reviewer pass is claimed |
| tool invocation friction | Review provider invocation remains the only recurring friction; cockpit, session-context, land-check, auto-land-check, land, validate, focused tests, and typecheck had established invocations. | explicit no-action decision - no new invocation chore is created because existing artifacts already record provider timeout/unavailability honestly |
| recurring inefficiency | Landing continuation exposed that derived projections and git-status parsing can block otherwise valid landed-work evidence. | explicit no-action decision - both issues are already fixed in the landed commit with tests |
| cost or latency signals | No paid reviewer route, paid model route, provider-pricing approval, spend-class approval, dependency install, external service setup, merge, push, deploy, or hosted preview was introduced. | explicit no-action decision - no cost-policy or supply-chain follow-up is required |
| unresolved uncertainty | The next cockpit slice is known at the roadmap level, but no next Work Item ID is formed yet. | explicit no-action decision - create the next Phase 8 work item through normal Repo PM Stage 1 formation before RED evidence |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

The actionable mechanical lessons from `BANDIT-066` were repaired before
landing and covered by focused regressions:

- `test/focused-session-context.test.mjs` covers active product slices with no
  linked bootstrap gap.
- `test/landing-gates.test.mjs` covers allowed dirty work-item package evidence
  without stripping leading git-status columns.

Provider-review limitations are durable bootstrap replacement evidence for
this work item, not a new unresolved workflow-policy gap.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-066`. Claude source
implementation was accepted after PM review, static preview repair, focused
tests, typecheck, browser smoke, and clean-code review. CodeRabbit and Local
Qwen did not produce terminal findings; their limitations are recorded as
bootstrap replacement evidence rather than pass evidence.

## Bootstrap Gaps Remaining

No open bootstrap gap blocks Phase 8 cockpit product work. The remaining
role-scoped workflow orchestration source material is already dispositioned
`no_action`, and no new bootstrap gap is opened by this closeout.
