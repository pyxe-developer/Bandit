# BANDIT-089 Retrospective

## Outcome

`BANDIT-089` landed and closed the first `BANDIT-PRD-004` implementation
slice: Trust Boundary Evidence Schema Contracts. The slice adds schema-only,
fail-closed Boundary Contour, Boundary Prediction Record, and
Notify-And-Revert Artifact validation and requires boundary-autonomy evidence
only when a landing verdict explicitly claims `notify_and_revert` or
`auto_land`.

The slice does not approve expanded landing autonomy, Notify-And-Revert
execution, Auto-Landing Scope for a new boundary cell, PRD-005 command
controllers, the V0 Closeout Claude Code A/B Product-Value Trial, Trust
Verifier cutover, attribution gateway work, escape workflow, boundary-cell
movement, cockpit UI, local API, State Index, hosted services, telemetry,
public benchmark publication, paid routing, merge, push, deploy, credential
handling, dependency changes, package-script changes, CI/release workflow
changes, external repo mutation, or unrelated Phase 8 work.

## What Worked

- PRD-004 and PRD-005 were decomposed before implementation, and V0 trial work
  stayed deferred behind the operator-prioritized PRD lanes.
- Stage 2 RED tests described the boundary evidence gates before production
  code existed.
- Claude was attempted first for Stage 3 and failed before dispatch with a
  session-limit response; the attempt was recorded honestly before MiniMax
  fallback.
- MiniMax fallback repaired the Stage 3 implementation without editing tests or
  Test Writer-owned evidence.
- CodeRabbit was allowed the required 600 seconds and timed out; the provider
  timeout was recorded as bootstrap-gap replacement evidence without claiming a
  pass.
- Local Qwen used the authorized MLX adapter route and returned only
  non-blocking findings, which Codex PM dispositioned before landing.
- Risk classification, supply-chain gate, review-subject hash, Bandit
  validation, land-check, auto-land-check, and local-record landing completed
  before closeout.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Boundary-autonomy evidence should be required only when a landing verdict explicitly claims `notify_and_revert` or `auto_land`. | keep | `src/commands/land-check.ts` gates only those autonomy levels, preserving ordinary safe-to-land bootstrap flows. |
| The existing `auto-land-check` local-record preflight and PRD-004 `auto_land` autonomy vocabulary can be confused. | no_action | `docs/work/BANDIT-089/review-evidence.md`, `landing-verdict.md`, and risk classification now distinguish repo-native local-record preflight eligibility from a PRD-004 `landing_autonomy_level` claim. Future PRD-004 slices can refine terminology if it becomes a repeated blocker. |
| CodeRabbit can time out on large bootstrap review packets. | no_action | Timeout evidence is recorded honestly and Local Qwen completed; no CodeRabbit pass is claimed. Open a hardening chore only if provider timeout becomes a repeated blocker. |
| Local Qwen's parser-boundary and template-seeding maintainability notes do not block this slice. | no_action | The snake_case JSON to camelCase TypeScript boundary is localized, and fresh-repo template defaults match existing init seeding behavior. |
| PRD-004 requires more slices before PRD-005 and the V0 trial can start. | keep | `docs/prds/BANDIT-PRD-004-005-decomposition.md` and `ROADMAP.md` record PRD-004.2, PRD-004.3, and PRD-004.4 before PRD-005. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | Claude returned a session-limit response before Stage 3 dispatch; the first MiniMax attempt timed out; CodeRabbit timed out during Stage 4. | no_action - each failure has durable evidence and an accepted fallback or replacement path |
| overreasoning | The initial risk-classification wording over-separated existing local-record preflight eligibility from PRD-004 `auto_land` autonomy. | no_action - evidence was corrected before landing and no source behavior changed |
| work-breakdown fit | PRD-004.1 was the right first slice: schema contracts and fail-closed validation before attribution, escape workflow, or movement policy. | keep |
| agent-scope fit | Stage ownership stayed clean: Codex/Test Writer for RED, MiniMax for Stage 3, CodeRabbit/Qwen for review, Landing Agent for landing, Closeout Agent for Stage 6. | keep |
| tool-use rule pressure | Review-subject hash required staging the full review subject before hash computation. | keep - this remains the repo pattern |
| reviewer/model routing | Local Qwen completed through the authorized MLX route; no direct `qwen` CLI was used. | keep |
| recurring inefficiency | Manual CodeRabbit timeout evidence and manual Qwen packet assembly remain slower than an eventual hardened command path. | no_action - accepted bootstrap friction; PRD-005 command work is already queued |
| cost or latency signals | CodeRabbit consumed the full 600-second timeout; MiniMax repair completed without paid reviewer escalation. | no_action |
| unresolved uncertainty | Future PRD-004 slices still need attribution joins, escape candidate workflow, and boundary-cell movement gates before PRD-005 implementation starts. | keep - roadmap and decomposition record the next slices |

## Improvement Chores

No new improvement chore is created by `BANDIT-089`.

The material lessons are already durable in:

- `docs/work/BANDIT-089/review-evidence.md`
- `docs/work/BANDIT-089/landing-verdict.md`
- `docs/prds/BANDIT-PRD-004-005-decomposition.md`
- `.bandit/work-intake-ledger.json`

The CodeRabbit timeout and Local Qwen non-blocking findings are explicit
no-action decisions for this run, not open bootstrap gaps.

## Cross-Model Tension

No unresolved cross-model tension remains. Claude could not run Stage 3 due to
session limits; MiniMax authored and repaired the implementation; CodeRabbit
timed out with no findings returned; Local Qwen returned non-blocking findings;
Codex PM dispositioned those findings and accepted the Stage 4 evidence before
landing.

## Bootstrap Gaps Remaining

No open bootstrap gap remains after `BANDIT-089` closeout.

The next recorded action is Repo PM formation for PRD-004.2 Attribution Join
Key Wiring as the next `BANDIT-PRD-004` slice.
