# BANDIT-087 Retrospective

## Outcome

`BANDIT-087` landed and closed the PR And CI/CD Landing Workflow Policy triage
chore. The recorded disposition defers PR/CI/CD landing implementation. Current
policy remains unchanged: `.bandit/policy/landing-agent.json` supports only
`local_record`, with merge, push, and deploy disabled. Any future remote
publication, GitHub PR workflow, CI provider configuration, branch protection,
credential handling, merge/push/deploy authority, deploy/canary behavior,
hosted service, paid routing, public benchmark publication, Trust Verifier
cutover, or local-record replacement must enter through a separately formed
work item with explicit operator-owned approvals where required.

## What Worked

- Work Item PM recorded plan-mode orchestration before RED evidence.
- Stage 2 used disposition-focused RED evidence, matching the policy-triage
  scope.
- Claude was attempted first for Stage 3 and failed before dispatch with a
  session-limit response; the attempt was recorded honestly before MiniMax-M3
  fallback.
- MiniMax completed Stage 3 inside the dispatch surface without editing tests,
  source code, routing, landing, closeout, or canonical policy files.
- CodeRabbit completed with terminal `review_completed` evidence and zero
  findings.
- Local Qwen used the authorized MLX adapter route and returned a pass with
  informational notes only.
- Risk classification, supply-chain gate, review-subject hash, land-check, and
  local-record landing completed before closeout.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| PR/CI/CD landing remains future work until remote authority, credentials, branch protection, CI provider policy, and deploy/canary policy are operator-approved. | deferred | `docs/work/BANDIT-087/pr-cicd-landing-policy-disposition.md` records trigger conditions and conditional future implementation scope. |
| Local-record landing remains sufficient for current bootstrap and Phase 8 triage work. | keep | `land-check` and `land --action local-record` passed with CodeRabbit, Local Qwen, risk, and supply-chain evidence. |
| CodeRabbit can complete successfully on a large evidence-only local diff. | no_action | The provider returned zero findings before the 600-second timeout; no routing change is needed. |
| The built-in Qwen review command currently refuses dirty worktrees even when Stage 4 must review unlanded evidence. | no_action | The authorized MLX adapter route is still valid and was used manually; future command behavior can be revisited only if this friction repeats as a blocker. |
| Source-head refresh after the evidence commit remains necessary before local-record landing. | keep | Review evidence and landing verdict were refreshed to `d93d5733cb5bccf2e02e1fbdb23055404a7392c8` before landing. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | Claude returned a session-limit response before Stage 3 dispatch; MiniMax fallback completed the work. | no_action - authorized fallback evidence captured |
| overreasoning | Stage 2 correctly avoided source tests for a disposition-only chore. | no_action - keep disposition-focused RED pattern |
| work-breakdown fit | PR/CI/CD landing is too broad for implementation without operator-owned remote and provider decisions; triage was the right work size. | deferred - future slices require trigger conditions |
| agent-scope fit | Stage ownership stayed clean: Codex/Test Writer for RED, MiniMax for Stage 3, CodeRabbit/Qwen for review, Landing Agent for landing. | keep |
| tool-use rule pressure | Built-in Qwen runner could not record dirty-worktree Stage 4 evidence; manual MLX adapter route preserved policy. | no_action - not a blocker this run |
| reviewer/model routing | CodeRabbit completed; Local Qwen passed; no escalated review was required. | no_action |
| tool invocation friction | Review-subject hash required staging new artifacts because the hash uses tracked paths. | keep - stage before hash remains the operating pattern |
| recurring inefficiency | Source-head/hash refresh after evidence commit remains a repeated local-record landing step. | no_action - current prompt already names the step |
| cost or latency signals | CodeRabbit consumed several minutes but completed inside the required 600-second window; no paid routing was used. | no_action |
| unresolved uncertainty | Future PR/CI/CD implementation depends on operator-owned choices for remote authority, credentials, CI provider, branch protection, and deploy/canary policy. | deferred - disposition names required approvals |

## Improvement Chores

No new improvement chore is created by `BANDIT-087`.

The material lesson is the `WIL-PR-CICD-LANDING` disposition itself: PR/CI/CD
landing work remains deferred until named trigger conditions and operator-owned
approvals exist. That disposition is durable in
`docs/work/BANDIT-087/pr-cicd-landing-policy-disposition.md`.

## Cross-Model Tension

No unresolved cross-model tension remains. Claude could not run Stage 3 due to
session limits; MiniMax authored the deferred disposition; CodeRabbit returned
zero findings; Local Qwen passed with informational notes only; Codex PM
accepted the Stage 3 and Stage 4 evidence before landing.

## Bootstrap Gaps Remaining

No open bootstrap gap remains after `BANDIT-087` closeout.

The next recorded action is Repo PM formation for the intake-derived
`WIL-INSTALLED-COPY-UPDATE` proposal, Installed-Copy Update Path, before the V0
Closeout Claude Code A/B Product-Value Trial or unrelated Phase 8 work.
