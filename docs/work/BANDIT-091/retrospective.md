# BANDIT-091 Retrospective

## Outcome

`BANDIT-091` landed and closed the third `BANDIT-PRD-004` implementation
slice: Escape Candidate Workflow. The slice adds the Escape Candidate and
Boundary Escape Disposition templates, optional fail-closed artifact validation,
aggregate validation wiring, and tests for malformed evidence and ordinary
safe-to-land preservation.

The slice does not approve expanded landing autonomy, Notify-And-Revert
execution, Auto-Landing Scope, escape classification authority, boundary-cell
movement, PRD-005 command controllers, the V0 Closeout Claude Code A/B
Product-Value Trial, Trust Verifier cutover, attribution gateway work, cockpit
UI, local API, State Index, hosted services, telemetry, public benchmark
publication, paid routing, merge, push, deploy, credential handling,
dependency changes, package-script changes, CI/release workflow changes,
external repo mutation, or unrelated Phase 8 work.

## What Worked

- The PRD-004.1 and PRD-004.2 contracts gave PRD-004.3 a narrow place to record
  escape candidates without treating them as confirmed escapes.
- Stage 2 RED tests covered missing template checks, malformed candidate
  evidence hashes, inconsistent operator-input disposition state, and ordinary
  safe-to-land preservation before source implementation.
- Claude made useful initial source/template edits but timed out before writer
  evidence; MiniMax-M3 completed the fallback repair and evidence.
- The implementation keeps Escape Candidate and Boundary Escape Disposition
  artifacts optional, local, parser-sensitive, and fail-closed when present.
- Full-suite verification caught shared routing fixture drift before review.
  Codex PM/Test Writer repaired the fixture, and Stage 3 Writer boundaries
  stayed intact.
- Local Qwen used the authorized MLX adapter route and returned `pass` with no
  findings.
- CodeRabbit timed out after the required 600 seconds and the timeout was
  recorded honestly as `bootstrap_gap` replacement evidence without claiming a
  pass.
- Risk classification, supply-chain gate, release-authorized decision registry
  refresh, review-subject hash refresh, Bandit validation, land-check, and
  local-record landing completed before closeout.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Escape Candidate evidence must stay candidate-level until Codex PM attribution review confirms or rejects it. | keep | `src/state/boundary-escape.ts` validates candidate evidence shape but does not move boundary cells or classify an escape as proven. |
| Boundary Escape Disposition must fail closed when operator input is required but not explicitly recorded. | keep | The validator rejects `operator_input_required` without `required_operator_input_status: required`. |
| Ordinary safe-to-land bootstrap flows must remain unblocked when no escape workflow evidence exists. | keep | `test/landing-gates.test.mjs` covers this path, and missing optional artifacts are skipped. |
| Shared temp-repo template fixtures can drift when new required templates are added. | no_action | The full suite caught the drift before review; `test/routing.test.mjs` now includes the two required templates. Open a chore only if fixture drift recurs. |
| Landing policy release-authorized registries are required in addition to per-work-item risk and supply-chain files. | no_action | The first `bandit land` attempt failed closed, the registries were refreshed, validators then reported `BANDIT-091`, and review-subject hash evidence was refreshed before final landing. No separate gap is needed because the gate caught the missing registry state. |
| CodeRabbit can time out on bootstrap review packets. | no_action | Timeout evidence is recorded honestly, Local Qwen completed, and no CodeRabbit pass is claimed. Open a hardening chore only if provider timeout becomes a repeated blocker. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | Claude timed out after initial edits; CodeRabbit timed out during Stage 4; first `bandit land` attempt failed closed on missing release-authorized registry entries. | no_action - each failure has durable evidence and an accepted fallback or repair |
| overreasoning | The main risk was turning candidate evidence into hidden escape authority. | keep - final implementation validates evidence shape only and leaves attribution review/confirmed escape decisions to later slices |
| work-breakdown fit | PRD-004.3 was the right third slice after schema contracts and attribution join keys. | keep |
| agent-scope fit | Stage ownership held: Codex/Test Writer for RED and fixture repair, Claude then MiniMax for Stage 3 source, CodeRabbit/Qwen for review, Landing Agent for landing, Closeout Agent for Stage 6. | keep |
| tool-use rule pressure | Local Qwen required a clean source head, and landing required policy registry entries plus hash refresh. | no_action - the workflow gates caught the required sequencing |
| reviewer/model routing | Local Qwen completed through `.bandit/reviewers/local-qwen.json` and `node bin/omlx-chat-completions.mjs`; the direct `qwen` CLI was not used. | keep |
| recurring inefficiency | CodeRabbit timeout evidence and manual hash refresh still consume time. | no_action - PRD-005 command-controller work is already queued before the V0 trial |
| cost or latency signals | CodeRabbit consumed the full 600-second timeout; Claude consumed the Stage 3 fallback window; no paid reviewer escalation was used. | no_action |
| unresolved uncertainty | PRD-004 still needs Boundary Cell Movement Gate before PRD-005 implementation starts. | keep - `ROADMAP.md` keeps PRD-004.4 ahead of PRD-005 and the V0 trial |

## Improvement Chores

No new improvement chore is created by `BANDIT-091`.

The material lessons are already durable in:

- `docs/work/BANDIT-091/stage3-claude-timeout.md`
- `docs/work/BANDIT-091/stage3-pm-acceptance.md`
- `docs/work/BANDIT-091/coderabbit-review.md`
- `docs/work/BANDIT-091/local-qwen-review.md`
- `docs/work/BANDIT-091/review-evidence.md`
- `docs/work/BANDIT-091/landing-verdict.md`
- `docs/work/BANDIT-091/landing-action.md`
- `docs/prds/BANDIT-PRD-004-005-decomposition.md`
- `docs/roadmap/ROADMAP.md`

The shared fixture drift, landing registry refresh, Claude timeout, and
CodeRabbit timeout are explicit no-action decisions for this run, not open
bootstrap gaps.

## Cross-Model Tension

No unresolved cross-model tension remains. Claude timed out before final Stage 3
evidence; MiniMax repaired and completed the source/evidence package;
CodeRabbit timed out with no terminal review payload; Local Qwen passed with no
findings; Codex PM accepted the Stage 4 evidence and refreshed landing policy
registries before landing.

## Bootstrap Gaps Remaining

No open bootstrap gap remains after `BANDIT-091` closeout.

The next recorded action is Repo PM formation for PRD-004.4 Boundary Cell
Movement Gate as the next `BANDIT-PRD-004` slice.
