# BANDIT-088 Retrospective

## Outcome

`BANDIT-088` landed and closed the Installed-Copy Update Path triage chore.
The recorded disposition defers installed-copy update-path implementation.
Current policy remains unchanged: Bandit supports the private Git tag or
tarball install path plus manual, non-blocking `bandit update-check` advisory
behavior from `BANDIT-071`. Any future public publishing, paid private
registry setup, hosted update service, telemetry, automatic self-update,
credential handling, consumer-repo mutation, installed global skill mutation,
automation prompt mutation, repo-integration file mutation, merge, push,
deploy, Trust Verifier cutover, old-gate replacement, local API, State Index,
scheduler behavior, claim/worktree lifecycle, guarded browser action, or V0
product trial work must enter through a separately formed work item with
explicit operator-owned approvals where required.

## What Worked

- Work Item PM recorded plan-mode orchestration before RED evidence.
- Stage 2 used disposition-focused RED evidence, matching the decision/triage
  scope.
- Claude was attempted first for Stage 3 and failed before dispatch with a
  session-limit response; the attempt was recorded honestly before MiniMax-M3
  fallback.
- MiniMax completed Stage 3 inside the dispatch surface without editing tests,
  source code, validators, routing, canonical policy contracts, landing,
  closeout, installed global skills, automation prompts, or consumer repos.
- CodeRabbit was allowed the required 600 seconds and timed out; the provider
  timeout was recorded as bootstrap-gap replacement evidence without claiming a
  pass.
- Local Qwen used the authorized MLX adapter route and returned a pass with
  non-blocking no-action notes only.
- Risk classification, supply-chain gate, review-subject hash, land-check, and
  local-record landing completed before closeout.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Installed-copy update implementation is not authorized yet. | deferred | `docs/work/BANDIT-088/installed-copy-update-path-disposition.md` records trigger conditions, conditional future scope, required approvals, refusal paths, and explicit non-goals. |
| Private Git tag or tarball install plus manual non-blocking `bandit update-check` remains sufficient for the current bootstrap lane. | keep | `.bandit/policy/private-install-update-channel.json` remains unchanged and no apply/update mutation path was added. |
| Installed global skills and automation prompts remain derived projections, not canonical workflow authority. | keep | `.bandit/policy/skill-lifecycle-contracts.json` remains unchanged and forbids installed global skill mutation from this work item. |
| CodeRabbit can time out after reaching review heartbeat on a large evidence-only diff. | no_action | The timeout was recorded honestly, Local Qwen passed, and this single provider timeout did not identify a repo-enforceable missing contract. Reconsider only if provider timeouts repeat as blockers. |
| Source-head refresh after the source/evidence commit remains necessary before local-record landing. | keep | Review evidence and landing verdict were refreshed to `b021b7f01fda60f934a112cb36ec9348e53196fc` before landing. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | Claude returned a session-limit response before Stage 3 dispatch; MiniMax fallback completed the work. | no_action - authorized fallback evidence captured |
| provider reliability | CodeRabbit timed out after the full required 600-second window. | no_action - provider-timeout replacement evidence captured; open a hardening chore only if this repeats as a blocker |
| overreasoning | Stage 2 correctly avoided source tests for a disposition-only chore. | no_action - keep disposition-focused RED pattern |
| work-breakdown fit | Installed-copy apply/update behavior is too broad without operator-owned supply-chain, credential, external-mutation, and product-policy decisions. | deferred - future slices require trigger conditions and approvals |
| agent-scope fit | Stage ownership stayed clean: Codex/Test Writer for RED, MiniMax for Stage 3, CodeRabbit/Qwen for review, Landing Agent for landing. | keep |
| reviewer/model routing | Local Qwen passed; no escalated review was required because no source, package, dependency, credential, hosted service, external mutation, or product surface changed. | no_action |
| tool invocation friction | Review-subject hash required staging new artifacts before hash computation. | keep - stage before hash remains the operating pattern |
| cost or latency signals | CodeRabbit consumed the full 600-second timeout and no paid routing was used. | no_action |
| unresolved uncertainty | Future installed-copy update implementation depends on operator-owned choices for publishing, registry, hosted services, telemetry, self-update, credentials, installed skills, automation prompts, external mutation, and Trust Verifier cutover. | deferred - disposition names required approvals |

## Improvement Chores

No new improvement chore is created by `BANDIT-088`.

The material lesson is the `WIL-INSTALLED-COPY-UPDATE` disposition itself:
installed-copy update-path work remains deferred until named trigger conditions
and operator-owned approvals exist. That disposition is durable in
`docs/work/BANDIT-088/installed-copy-update-path-disposition.md`.

The CodeRabbit timeout is an explicit no-action decision for this run, not an
open bootstrap gap. It is recorded as provider-timeout replacement evidence in
`docs/work/BANDIT-088/coderabbit-review.md`; a future chore should be opened
only if provider timeouts repeat as blockers.

## Cross-Model Tension

No unresolved cross-model tension remains. Claude could not run Stage 3 due to
session limits; MiniMax authored the deferred disposition; CodeRabbit timed out
with no findings returned; Local Qwen passed with non-blocking no-action notes;
Codex PM accepted the Stage 3 and Stage 4 evidence before landing.

## Bootstrap Gaps Remaining

No open bootstrap gap remains after `BANDIT-088` closeout.

The next recorded action is Repo PM formation for the intake-derived
`WIL-V0-TRIAL` proposal, V0 Closeout Claude Code A/B Product-Value Trial, or an
explicit Repo PM disposition if formation finds missing operator-owned product
direction.
