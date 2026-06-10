# BANDIT-092 Retrospective

## Outcome

`BANDIT-092` landed and closed the fourth `BANDIT-PRD-004` implementation
slice: Boundary Cell Movement Gate. The slice adds the Boundary Cell Movement
template, optional fail-closed artifact validation, aggregate validation and
land-check wiring, and tests for malformed evidence, contradictory movement
direction, unsafe expansion evidence, zero-escape expansion, and missing
contraction evidence after confirmed escapes.

The slice does not move any boundary cell, approve expanded landing autonomy,
execute Notify-And-Revert, implement PRD-005 command controllers, start the V0
Closeout Claude Code A/B Product-Value Trial, cut over Trust Verifier, add
cockpit UI, add a local API, create State Index behavior, add hosted services
or telemetry, approve public benchmark publication, approve paid routing,
merge, push, deploy, handle credentials, change dependencies, change lockfiles,
change package scripts, change CI/release workflow, mutate external repos, or
start unrelated Phase 8 work.

## What Worked

- The PRD-004 sequence landed in a coherent order: Trust Boundary Evidence,
  Attribution Join Key Wiring, Escape Candidate Workflow, and finally Boundary
  Cell Movement Gate.
- Stage 2 RED covered the movement-specific safety rules before implementation:
  source-head shape, direction/autonomy consistency, expansion guardrails,
  zero-escape misuse, and contraction after confirmed escapes.
- Claude completed the Stage 3 source implementation without touching
  Test Writer-owned surfaces.
- Local Qwen completed through the authorized oMLX route after the operator
  identified the new endpoint at `http://127.0.0.1:8001/v1`.
- The Local Qwen non-blocking findings were concrete procedural pressure, not
  hidden source defects, and Codex PM dispositioned them before landing.
- CodeRabbit reached the reviewing phase on the refresh and then timed out
  after the full 600-second gate window; the timeout was recorded honestly as
  `bootstrap_gap` replacement evidence without claiming a pass.
- Risk classification, supply-chain gate, review-subject hash, Bandit
  validation, land-check, auto-land-check, and local-record landing completed
  before closeout.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Boundary Cell Movement evidence must stay evidentiary until a later controller explicitly consumes it. | keep | `src/state/boundary-cell-movement.ts` validates optional evidence shape and safety constraints without moving the active contour. |
| Autonomy expansion needs trial guardrails and cannot rely on zero escapes alone. | keep | The validator rejects expansion without Workflow Trial guardrails and rejects zero-escape-only expansion evidence. |
| Confirmed escapes require contraction evidence before autonomy claims can proceed. | keep | `land-check` now requires contraction evidence after confirmed escape disposition when a landing claim relies on boundary autonomy. |
| Historical blocked coordination transitions should be closed by current typed transitions, not erased. | no_action | The old `blocked` transition remains as history, and sequence 7/8/9 records review, landing, and closeout progress. Reopen only if cockpit/session-context cannot derive the current state from the typed transitions. |
| Local reviewer endpoint changes can be necessary Stage 4 tooling repairs. | no_action | The 8001 endpoint repair was operator-directed and local to the authorized reviewer path. No product-scope expansion or dependency/supply-chain risk was introduced. |
| CodeRabbit can time out on review refreshes even after prior implementation-pass evidence. | no_action | Timeout evidence is recorded as `bootstrap_gap` replacement evidence, Local Qwen completed, and no CodeRabbit pass is claimed for the refreshed head. Open a hardening chore only if provider timeout becomes a repeated blocker. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | Initial Local Qwen review was blocked by endpoint drift; later CodeRabbit refresh timed out after 600 seconds. | no_action - endpoint drift was repaired in tooling, CodeRabbit timeout has durable replacement evidence |
| overreasoning | The main risk was treating movement evidence as actual boundary movement authority. | keep - final implementation validates evidence only and does not mutate policy contours |
| work-breakdown fit | PRD-004.4 was the right final PRD-004 slice before PRD-005 controller work. | keep |
| agent-scope fit | Codex/Test Writer owned RED and PM evidence, Claude owned Stage 3 source, Qwen and CodeRabbit handled Stage 4 review evidence, Landing Agent handled landing, and Closeout Agent handled retrospective. | keep |
| tool-use rule pressure | Local Qwen required a clean source head and authorized route; CodeRabbit required a full wait window before timeout disposition. | no_action - both constraints were followed and recorded |
| reviewer/model routing | Local Qwen completed through `.bandit/reviewers/local-qwen.json` and `node bin/omlx-chat-completions.mjs`; the direct `qwen` CLI was not used. | keep |
| recurring inefficiency | CodeRabbit timeout and manual risk/supply/hash refresh still consume time. | no_action - PRD-005 controller work is next and should reduce manual orchestration overhead |
| cost or latency signals | CodeRabbit consumed the full 600-second timeout; no paid reviewer escalation was used. | no_action |
| unresolved uncertainty | PRD-004 is complete; PRD-005.1 must now resolve roadmap/current-context work targets before deeper controller implementation. | keep - `ROADMAP.md` names PRD-005.1 as the next formation target |

## Improvement Chores

No new improvement chore is created by `BANDIT-092`.

The material lessons are already durable in:

- `docs/work/BANDIT-092/local-qwen-blocker.md`
- `docs/work/BANDIT-092/qwen-finding-disposition.md`
- `docs/work/BANDIT-092/coderabbit-review.md`
- `docs/work/BANDIT-092/local-qwen-review.md`
- `docs/work/BANDIT-092/review-evidence.md`
- `docs/work/BANDIT-092/landing-verdict.md`
- `docs/work/BANDIT-092/landing-action.md`
- `.bandit/policy/risk-classifications/BANDIT-092-risk-classification.json`
- `.bandit/policy/supply-chain-gates/BANDIT-092-supply-chain-gate.json`
- `docs/prds/BANDIT-PRD-004-005-decomposition.md`
- `docs/roadmap/ROADMAP.md`

The Local Qwen endpoint repair, historical blocked coordination transition, and
CodeRabbit timeout are explicit no-action decisions for this run, not open
bootstrap gaps.

## Cross-Model Tension

No unresolved cross-model tension remains. Claude implemented the source slice
within the Stage 3 boundary. Local Qwen accepted the implementation behavior and
returned two non-blocking procedural findings, both dispositioned by Codex PM.
CodeRabbit timed out on the current refresh, and that timeout is recorded as
replacement evidence without claiming a pass.

## Bootstrap Gaps Remaining

No open bootstrap gap remains after `BANDIT-092` closeout.

The next recorded action is Repo PM formation for PRD-005.1 Roadmap Work Target
Resolver as the first `BANDIT-PRD-005` slice.
