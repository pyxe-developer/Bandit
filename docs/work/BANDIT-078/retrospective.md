# BANDIT-078 Retrospective

## Outcome

`BANDIT-078` landed and closed the Guarded CLI Action Requests Phase 8 product
slice. The work adds request-only guarded action metadata to the cockpit state
projection, renders command previews, source links, authority owners, role and
operator gates, unavailable routes, and disabled reasons in the browser shell,
and keeps CLI/repo artifacts as the only workflow authority.

The slice deliberately avoids browser-side CLI execution, local API authority,
browser storage, artifact writes, UAT approval authority, landing-safety
authority, merge, push, deploy, Trust Verifier cutover, live guarded action
execution, dependency changes, paid reviewer routing, hosted services,
telemetry, or unrelated Phase 8 product work.

## What Worked

- The Work Item PM plan, RED evidence, implementation evidence, review
  evidence, UAT, landing action, and closeout stayed grounded in repo-native
  artifacts.
- MiniMax-M3 through headless `pi` delivered the broad Stage 3 source surface
  after Claude-family dispatches timed out, and Claude completed the focused
  label repair through `claude -p`.
- Stage 3 writers did not edit Test Writer-owned tests, fixtures, RED evidence,
  acceptance mappings, formation evidence, review evidence, landing evidence,
  UAT evidence, or retrospective evidence.
- Focused tests covered action derivation, browser-shell authority boundaries,
  render output, view-model behavior, responsive static preview behavior, and
  legacy compatibility.
- Stage 4 stayed honest: CodeRabbit timed out after the required 600-second
  window with no pass claimed, while Local Qwen completed through the
  authorized MLX adapter route and returned non-blocking maintainability
  findings that were dispositioned.
- Browser smoke verified the static preview at desktop and mobile widths while
  preserving the distinction between deterministic preview output and canonical
  CLI status.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Headless model dispatch needs explicit file/stdin print-mode formats when prompt packets are large. | explicit no-action decision | The corrected forms are `claude -p` with piped stdin or a short positional prompt, and `pi -p @prompt-file.md "short instruction"` or piped stdin. This is prompt/automation guidance, not repo source scope for this slice. |
| MiniMax-M3 is a valid Stage 3 fallback when Claude is unreliable and the operator prompt authorizes it. | resolved | Stage 3 evidence records MiniMax as the broad implementation writer and Claude as the focused repair writer, with PM verification covering the commands Claude could not run in-session. |
| Static preview evidence must remain non-canonical. | resolved | Browser smoke records the preview as deterministic presentation evidence only; cockpit status and session-context CLI outputs remain the source of truth for live work state. |
| Local Qwen's maintainability findings were real but not authority or correctness risks. | explicit no-action decision | The compatibility shims are localized and preserve legacy action shapes while exposing guarded metadata; no follow-up chore is justified unless future action slices broaden the pattern. |
| CodeRabbit provider timeout remains recurring Stage 4 latency friction. | explicit no-action decision | The timeout is recorded as bootstrap replacement evidence with no pass claimed; Local Qwen, PM review, risk classification, supply-chain gate, browser smoke, and full verification were sufficient for this slice. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | Claude implementation dispatches timed out, and earlier large-prompt routing needed correction to proper `claude -p` and `pi -p @file` forms. | explicit no-action decision - prompt guidance is recorded outside repo source scope, and this work item completed through the authorized fallback route |
| overreasoning | The slice could have drifted into browser execution, local API work, state-index work, Trust Verifier cutover, or action execution. | explicit no-action decision - the landed implementation stays request-only and source-linked |
| work-breakdown fit | The slice was large enough to require MiniMax broad implementation plus Claude repair, but still stayed within one product surface. | no_action - no split is needed after landing because verification and review evidence passed |
| agent-scope fit | Codex authored RED and PM evidence; Stage 3 source went to different model families. | resolved - model-family separation and the Permanent Test Ownership Boundary held |
| tool-use rule pressure | Stage 6 required manual synchronization across landing artifacts, coordination log, roadmap, current context, status, retrospective, and improvement disposition. | explicit no-action decision - this remains the supported closeout boundary and final validation verifies agreement |
| reviewer/model routing | CodeRabbit timed out; Local Qwen returned non-blocking findings; escalated review was not required by risk policy. | explicit no-action decision - every finding is dispositioned and review evidence is current for the review subject |
| tool invocation friction | Proper one-shot commands are `claude -p ... < packet.md` or `printf ... \| claude -p`, and `pi -p @packet.md "short instruction"` or piped stdin with `--no-session` for automation. | external prompt improvement - include these exact forms in future operator prompts and automation memory |
| recurring inefficiency | Review subject hash had to be refreshed after policy evidence became tracked. | explicit no-action decision - the existing hash gate caught the drift and the Stage 4 evidence was amended before landing |
| cost or latency signals | No dependency, hosted service, paid reviewer, paid model route, merge, push, or deploy was introduced. CodeRabbit and Claude timeouts consumed wall time but did not create new cost policy scope. | explicit no-action decision - no provider-pricing or spend-class follow-up is required |
| unresolved uncertainty | No open bootstrap gap remains, and the next product target is already named in the roadmap as Improvement Health Surface. | deferred to Repo PM - form the next product slice only if roadmap/product direction is sufficient |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

The only material prompt/process lesson is the headless model invocation format.
That belongs in automation/operator prompt guidance rather than a Bandit source
chore because the repository already supports the resulting evidence path and
the work item landed without changing model-dispatch tooling.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-078`. MiniMax-M3
implemented the broad source surface, Claude completed the focused repair,
Codex PM verified acceptance and clean-code posture, CodeRabbit timed out with
no pass claimed, and Local Qwen findings were dispositioned as non-blocking
no-action decisions.

## Bootstrap Gaps Remaining

No open bootstrap gaps remain after `BANDIT-078` closeout. The next recorded
target is Repo PM triage and formation for the next Phase 8 product queue item,
currently Improvement Health Surface, only if roadmap/product direction is
sufficient.
