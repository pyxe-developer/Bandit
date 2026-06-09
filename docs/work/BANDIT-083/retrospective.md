# BANDIT-083 Retrospective

## Outcome

`BANDIT-083` landed and closed the Bandit Cockpit UI Polish From Attached
Design product slice. The work adapts the browser-served Workflow Cockpit
toward the attached dense three-pane Evidence Row direction while preserving
CLI authority, repo-native source links, read-only browser behavior, and normal
review, UAT, landing, and closeout gates.

The slice deliberately keeps browser shell HTML, CSS, deterministic static
preview output, generated UI state, and live render output as presentation-only
projections. They do not execute CLI commands, write repo artifacts, approve
UAT, decide landing safety, mutate intake, schedule work, claim work, merge,
push, deploy, route models, or change policy.

## What Worked

- The Work Item PM plan-mode gate created an explicit stage checklist before
  RED evidence and implementation.
- Codex authored RED tests and evidence; Claude Sonnet 4.6 received the first
  Stage 3 implementation dispatch and MiniMax-M3 completed the fallback only
  after the required 15-minute Claude timeout.
- The implementation kept Evidence Row state in the evidence-detail projection,
  review-gate availability in action affordances, and visual polish in
  render/browser-shell/CSS/static-preview surfaces.
- PM inspection caught the static-preview review-gate availability mismatch
  before review, and the targeted MiniMax repair restored the fail-closed
  review gate.
- CodeRabbit completed with findings rather than timing out; the two
  current-slice test-strength findings were repaired and verified.
- Local Qwen used the authorized MLX adapter route and returned only
  non-blocking maintainability/process observations, both dispositioned before
  landing.
- Local headless Chrome smoke covered desktop `1440x900` and mobile `390x844`
  static-preview behavior, and live render smoke confirmed the current
  CLI-derived cockpit output remains responsive and non-authoritative.
- CLI-owned UAT, landing verdict, land-check, auto-land-check, and local-record
  landing action all completed before closeout.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Review-gate availability must be checked against the actual stage evidence in static previews. | resolved | PM inspection found the mismatch and the Stage 3 repair made review requests fail closed until implementation evidence exists. |
| RED tests for visual-token acceptance should pin exact design tokens and status/freshness label mappings up front. | no_action | The current-slice tests were repaired after CodeRabbit review; future PM/Test Writer practice is recorded here and in `docs/work/BANDIT-083/improvement-disposition.md` without creating a separate work item. |
| Non-enumerable Evidence Row metadata preserves legacy gate-row compatibility but is a tradeoff. | no_action | Local Qwen identified the maintainability concern; PM accepted it as a bounded compatibility choice and recorded the rationale in `docs/work/BANDIT-083/qwen-finding-disposition.md`. |
| CodeRabbit can produce terminal non-pass evidence against a branch-wide diff even when current-slice findings are repaired. | no_action | The aggregate review records CodeRabbit as bootstrap replacement evidence with no pass claimed and dispositions older-report and unrelated `.codex` findings out of scope. |
| Local generated preview/browser smoke should stay explicitly non-canonical. | resolved | Browser smoke and review evidence distinguish deterministic static preview from live CLI/render smoke. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| PM inspection | Static preview initially exposed Review gate as enabled before implementation evidence. | resolved - repaired before Stage 4 review |
| CodeRabbit | Test assertions should pin exact design-token hex values and label mappings. | resolved - tests repaired and verified |
| CodeRabbit | Older `docs/reports/...` findings appeared in the branch-wide review. | no_action - outside `BANDIT-083` scope and not repaired to preserve slice boundary |
| CodeRabbit | Untracked `.codex/environments/environment.toml` was reported during refresh. | no_action - unrelated Codex Desktop local file, intentionally uncommitted |
| Local Qwen | Non-enumerable metadata may affect long-term maintainability. | no_action - accepted compatibility tradeoff for this slice |
| Local Qwen | RED visual-token assertions should be stronger earlier. | no_action - recorded as future Test Writer practice, not new repo scope |
| cost or latency signals | No dependency, hosted service, paid reviewer, paid model route, merge, push, or deploy was introduced. | no_action - no provider-pricing or spend-class follow-up is required |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

The material lessons were resolved inside the slice or recorded as explicit
no-action decisions. The next queue item is already present in
`.bandit/work-intake-ledger.json` as `WIL-CLAIM-FIRST`; it is not a
retrospective-generated chore.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-083`. Claude timed out
after the required allowance, MiniMax completed the Stage 3 source work and
repair without editing RED tests, CodeRabbit returned terminal non-pass
evidence with all current-slice findings repaired or dispositioned, Local Qwen
returned non-blocking observations, and Codex PM accepted or dispositioned
those observations before landing.

## Bootstrap Gaps Remaining

No open bootstrap gaps remain after `BANDIT-083` closeout. The next recorded
action is Repo PM triage and formation for the intake-derived
`WIL-CLAIM-FIRST` proposal, Claim-First Transition Policy Triage. The V0
Closeout Claude Code A/B Product-Value Trial remains deferred behind the
pre-Claude-bakeoff intake lane.
