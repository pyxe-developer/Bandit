# BANDIT-068 Retrospective

## Outcome

`BANDIT-068` landed and closed out the Evidence Drilldown And Gate Matrix
product slice. The work extends the cockpit presentation layer so the browser
shell renders a source-linked Stage gate matrix and Evidence detail rows from
the CLI cockpit-status payload, while preserving CLI authority and
non-canonical browser presentation state.

The implementation adds `src/state/cockpit-evidence-detail.ts`, integrates its
derived presentation data through `src/state/cockpit-view-model.ts`, renders it
through `src/cockpit/render.ts` and `src/cockpit/browser-shell.ts`, refreshes
the static preview in `public/cockpit/index.html`, and adds focused tests for
gate matrix, evidence detail, desktop/mobile rendering, fail-closed states, and
source-link traceability. It does not add browser storage, JavaScript mutation
behavior, local API calls, State Index work, guarded action execution,
scheduler behavior, claim/worktree execution, merge, push, deploy, dependency
changes, package-script changes, external services, or Trust Verifier cutover.

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
- Focused RED tests caught the missing evidence-detail mapper, missing gate
  matrix data, missing shell gate matrix region, and missing static HTML
  landmark before implementation.
- Local Qwen ran through the authorized MLX adapter route and returned a pass
  with two non-blocking findings, both dispositioned explicitly.
- Browser smoke reached the static cockpit preview over a local HTTP server and
  verified the authority note, Stage gate matrix, Evidence detail region, and
  mobile viewport.
- Landing gates caught stale source-head metadata after the
  implementation/evidence commit and required a current refresh before
  local-record landing.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| The cockpit can expose dense gate/evidence drilldown without becoming workflow authority. | explicit no-action decision | The implementation keeps CLI artifacts canonical, labels browser output as presentation-only, escapes generated values, and adds no browser mutation path. |
| Codex-authored RED plus Claude implementation remains workable for cockpit product slices. | explicit no-action decision | Role boundaries held, Claude avoided Test Writer-owned surfaces, and PM acceptance plus deterministic tests covered the implementation. |
| CodeRabbit provider availability remains a bootstrap review limitation. | explicit no-action decision | The repo wrapper required a fixture, the direct provider timed out, and review evidence records a bootstrap gap without claiming a pass. |
| Local Qwen can run through the authorized MLX adapter when the dirty-worktree wrapper path is blocked. | explicit no-action decision | The approved `.bandit/reviewers/local-qwen.json` plus `bin/omlx-chat-completions.mjs` path returned a terminal pass and concrete findings. |
| Static browser smoke needs HTTP serving rather than `file://` in the current Browser tool. | explicit no-action decision | The fallback local static server verified the approved preview and was shut down after use; no product server or local API was introduced. |
| Terminal evidence must be refreshed after the implementation/evidence commit. | explicit no-action decision | Review, reviewer, UAT, and landing source-head fields were refreshed to `87b62d120fd0f5d5ee0f5ffb86ca4063f2cb559f` before local-record landing. |
| The next Phase 8 cockpit slice should add guarded CLI action request affordances, not expand this slice into live action execution. | explicit no-action decision | Guarded CLI Action Requests remains the next roadmap target and must go through normal Repo PM Stage 1 formation before RED evidence. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | CodeRabbit direct provider review timed out, the repo CodeRabbit wrapper required fixture input, the local Qwen wrapper refused the dirty source/evidence worktree, and Browser `file://` access was blocked. | explicit no-action decision - each limitation has bounded replacement evidence; the authorized Local Qwen adapter and HTTP browser smoke covered this slice without creating a new bootstrap gap |
| overreasoning | The work did not implement guarded browser actions, local API endpoints, State Index, scheduler, claim/worktree lifecycle, PR/CI behavior, merge, push, deploy, Trust Verifier cutover, or unrelated Phase 8 features. | explicit no-action decision - forbidden scope stayed out of the implementation and closeout |
| work-breakdown fit | Evidence detail mapping, source-linked gate matrix rendering, focused tests, browser smoke, UAT, and landing formed a bounded follow-on cockpit product slice. | explicit no-action decision - guarded CLI action requests remains a separate next slice |
| agent-scope fit | Repo PM, Work Item PM, Test Writer, Claude Implementation Writer, reviewers, Landing Agent, operator UAT, and Closeout Agent responsibilities stayed separated. | explicit no-action decision - role boundaries held |
| tool-use rule pressure | Local-record landing required committing the implementation/evidence package, refreshing terminal evidence, then recording landing action. | explicit no-action decision - the existing gates caught stale evidence and gave actionable diagnostics |
| reviewer/model routing | CodeRabbit did not return terminal findings, while Local Qwen returned a pass with two non-blocking findings. | explicit no-action decision - CodeRabbit is recorded as bootstrap_gap, Local Qwen findings have no-action dispositions, and no unresolved finding remains |
| tool invocation friction | The only new browser friction was `file://` access; serving `public/cockpit` over a temporary local HTTP server worked. | explicit no-action decision - no product local server or CLI authority path is introduced |
| recurring inefficiency | Parser-sensitive UAT status and source-head refresh remained easy to get wrong in intermediate evidence. | explicit no-action decision - `validate` and `land-check` already fail closed and caught the issues before landing |
| cost or latency signals | No paid reviewer route, paid model route, provider-pricing approval, spend-class approval, dependency install, external service setup, hosted preview, merge, push, or deploy was introduced. | explicit no-action decision - no cost-policy or supply-chain follow-up is required |
| unresolved uncertainty | The next target is known as Guarded CLI Action Requests, but no next Work Item ID is formed yet. | explicit no-action decision - create the next Phase 8 work item through normal Repo PM Stage 1 formation before RED evidence |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

The actionable issues from `BANDIT-068` were handled before landing:

- `review-evidence.md` uses parser-supported shared verdict values.
- Review, reviewer, UAT, and landing verdict source-head metadata were
  refreshed to `87b62d120fd0f5d5ee0f5ffb86ca4063f2cb559f` before local-record
  landing.
- Risk classification and supply-chain gate decisions for `BANDIT-068` are
  registered in the repo policy files and validated.
- Local Qwen non-blocking findings are dispositioned in
  `docs/work/BANDIT-068/review-evidence.md`.

Provider-review and browser-tool limitations are durable bootstrap replacement
evidence for this work item, not a new unresolved workflow-policy gap.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-068`. Claude source
implementation was accepted after PM review, focused tests, full test suite,
typecheck, clean-code review, Local Qwen review, browser smoke, UAT, risk
classification, supply-chain gate, and landing checks. Local Qwen returned two
non-blocking findings; both are accepted no-action dispositions. CodeRabbit did
not produce terminal findings and is recorded as bootstrap replacement evidence
rather than pass evidence.

## Bootstrap Gaps Remaining

No open bootstrap gap blocks Phase 8 cockpit product work. The next recorded
action is to create the Phase 8 Guarded CLI Action Requests slice through Repo
PM Stage 1 formation before RED evidence.
