# BANDIT-090 Retrospective

## Outcome

`BANDIT-090` landed and closed the second `BANDIT-PRD-004` implementation
slice: Attribution Join Key Wiring. The slice adds the Attribution Join Key
template, parser, deterministic lookup hash, validation integration, landing
verdict metadata parsing, and fail-closed land-check attribution enforcement
when a landing verdict explicitly claims `notify_and_revert` or `auto_land`
boundary autonomy.

The slice does not approve expanded landing autonomy, Notify-And-Revert
execution, Auto-Landing Scope, escape workflow, boundary-cell movement,
PRD-005 command controllers, the V0 Closeout Claude Code A/B Product-Value
Trial, Trust Verifier cutover, attribution gateway work, cockpit UI, local API,
State Index, hosted services, telemetry, public benchmark publication, paid
routing, merge, push, deploy, credential handling, dependency changes,
package-script changes, CI/release workflow changes, external repo mutation, or
unrelated Phase 8 work.

## What Worked

- The PRD-004.1 schema contracts gave PRD-004.2 a narrow place to attach
  landing attribution without expanding autonomy.
- Stage 2 RED tests covered malformed attribution hashes, missing attribution
  for autonomy claims, and Boundary Prediction Record mismatch behavior before
  source implementation.
- The implementation kept the structured tuple canonical and treated
  `attribution_join_hash` as derived lookup data only.
- `land-check` preserves ordinary `safe-to-land` bootstrap flows when the
  landing verdict does not claim boundary autonomy.
- Local Qwen used the authorized MLX adapter route and returned
  `non_blocking` findings that were dispositioned before landing.
- CodeRabbit timed out after the required 600 seconds and the timeout was
  recorded honestly as `bootstrap_gap` replacement evidence without claiming a
  pass.
- Risk classification, supply-chain gate, review-subject hash, Bandit
  validation, land-check, auto-land-check, and local-record landing completed
  before closeout.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Attribution Join Key evidence should be required only for explicit PRD-004 boundary-autonomy claims. | keep | `src/commands/land-check.ts` gates only `notify_and_revert` and `auto_land`, so ordinary bootstrap landing remains unblocked. |
| The structured Attribution Join Key tuple must remain canonical, with `attribution_join_hash` as derived lookup data only. | keep | `src/state/attribution-join-key.ts` derives the hash from stable tuple fields and validation reports tuple-level failures. |
| Codex PM performed a narrow source correction after the MiniMax repair pass. | no_action | The correction was documented in implementation evidence, covered by focused attribution tests and the full suite, and did not cross into Test Writer, reviewer, landing, UAT, retrospective, PRD, package, dependency, or future-slice surfaces. Prefer a bounded Writer repair when available in future runs, but no separate chore is opened from one documented bootstrap correction. |
| Native `bandit qwen-review` initially reviewed only the final policy-evidence commit after RED and implementation evidence first landed in the same source commit. | no_action | A supplemental Local Qwen full-packet review through the same authorized adapter covered the full `de7e485bfe8c9ff6ae3920e525dc5197fec84c1a..HEAD` diff and confirmed the implementation. Diff-base hardening is recorded as a PRD-005.3 route-registry consideration rather than a new blocking bootstrap gap. |
| A MiniMax fallback attempt timed out after partial source edits before repair. | no_action | The final source state was verified after repair, `stage3-minimax-attempt-timeout.md`, `writer-report.md`, and `stage3-pm-review.md` preserve the sequence, and no stale conflicting partial-edit artifact remains. Open a chore only if fallback cleanup evidence becomes repeated friction. |
| CodeRabbit can time out on large bootstrap review packets. | no_action | Timeout evidence is recorded honestly, Local Qwen completed, and no CodeRabbit pass is claimed. Open a hardening chore only if provider timeout becomes a repeated blocker. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | Claude was unavailable due provider session limit; the first MiniMax fallback timed out after partial source edits; CodeRabbit timed out during Stage 4. | no_action - each failure has durable evidence and an accepted fallback or replacement path |
| overreasoning | The main correction risk was over-expanding attribution into hidden authority. | keep - the final implementation keeps tuple evidence canonical and hash lookup derived |
| work-breakdown fit | PRD-004.2 was the right second slice after schema contracts: it wired attribution before escape classification or boundary movement policy. | keep |
| agent-scope fit | Stage ownership mostly held: Codex/Test Writer for RED, MiniMax for Stage 3 repair, CodeRabbit/Qwen for review, Landing Agent for landing, Closeout Agent for Stage 6. The PM source correction is recorded as non-blocking hygiene. | no_action - monitor for repetition |
| tool-use rule pressure | Review-subject hash and Local Qwen review quality depended on the correct diff base and committed policy evidence. | no_action - supplemental review repaired this run; PRD-005.3 should consider route packet diff-base hardening |
| reviewer/model routing | Local Qwen completed through `.bandit/reviewers/local-qwen.json` and `node bin/omlx-chat-completions.mjs`; the direct `qwen` CLI was not used. | keep |
| tool invocation friction | Native `bandit qwen-review` did not automatically include the full accumulated implementation diff for this commit shape. | no_action - recorded as PRD-005.3 controller/route-registry consideration, not a separate open gap |
| recurring inefficiency | Manual supplemental Qwen packet assembly and CodeRabbit timeout evidence remain slower than a hardened command path. | no_action - PRD-005 command work is already queued before the V0 trial |
| cost or latency signals | CodeRabbit consumed the full 600-second timeout; MiniMax required a repair pass; no paid reviewer escalation was used. | no_action |
| unresolved uncertainty | PRD-004 still needs escape candidate workflow and boundary-cell movement gate before PRD-005 implementation starts. | keep - `ROADMAP.md` and decomposition keep PRD-004.3 and PRD-004.4 ahead of PRD-005 and the V0 trial |

## Improvement Chores

No new improvement chore is created by `BANDIT-090`.

The material lessons are already durable in:

- `docs/work/BANDIT-090/qwen-finding-disposition.md`
- `docs/work/BANDIT-090/review-evidence.md`
- `docs/work/BANDIT-090/landing-verdict.md`
- `docs/work/BANDIT-090/landing-action.md`
- `docs/prds/BANDIT-PRD-004-005-decomposition.md`
- `docs/roadmap/ROADMAP.md`

The PM source-correction boundary, native Qwen diff-base issue, MiniMax
fallback timeout, and CodeRabbit timeout are explicit no-action decisions for
this run, not open bootstrap gaps. The qwen-review diff-base hardening lesson
is a PRD-005.3 route-registry consideration because PRD-005 is already queued
to harden work execution controllers before the V0 trial.

## Cross-Model Tension

No unresolved cross-model tension remains. Claude could not run Stage 3 due to
provider session limits; MiniMax repaired the implementation; CodeRabbit timed
out with no terminal review payload; Local Qwen returned non-blocking workflow
findings; Codex PM dispositioned those findings and accepted the Stage 4
evidence before landing.

## Bootstrap Gaps Remaining

No open bootstrap gap remains after `BANDIT-090` closeout.

The next recorded action is Repo PM formation for PRD-004.3 Escape Candidate
Workflow as the next `BANDIT-PRD-004` slice.
