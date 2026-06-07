# BANDIT-065 Retrospective

## Outcome

`BANDIT-065` landed and closed out the Harness-Portable Orchestrator Prompt
Contract bootstrap-policy chore. The work records a repo-native orchestrator
prompt policy at `.bandit/policy/orchestrator-prompts.json`, a
`docs/templates/work-item-pm-orchestrator-prompt.md` adapter-facing prompt
template, a fail-closed validator and `bandit orchestrator-prompts validate`
command, validation/init/path wiring, and focused tests in
`test/orchestrator-prompts.test.mjs`.

The prompt contract is explicitly non-authoritative. It guides a harness or
Process Adapter to preserve Stage 2 through Stage 6 evidence, but it cannot
replace Bandit CLI authority, coordination history, review evidence, landing
evidence, retrospective evidence, bootstrap-gap state, or Trust Verifier
authority. No Trust Verifier cutover, role input packet, execution packet,
Pi/Aperture runtime work, live agent-to-agent channel, queue, scheduler, claim
authority, worktree lifecycle, dependency change, external service, merge,
push, deploy, installed global skill edit, or product-scope change was
introduced.

## What Worked

- Formation, Work Item PM plan-mode, RED, implementation, review, landing, and
  closeout routing remained anchored in repo evidence rather than chat memory.
- Bootstrap Model-Family Separation held: Codex authored RED evidence and
  Claude completed Stage 3 source implementation.
- Stage 3 preserved the Permanent Test Ownership Boundary; Claude did not edit
  Test Writer-owned tests, fixtures, RED evidence, or acceptance mappings.
- CodeRabbit provider timeout was recorded honestly as bootstrap-gap
  replacement evidence, with no CodeRabbit pass claimed.
- Local Qwen non-blocking findings were evidence-completeness findings. They
  were repaired before aggregate review and routed to no-action because no
  follow-up source or policy chore remained.
- Review-subject hash semantics let evidence-only Stage 4/5 commits proceed
  without forcing repeated reviewer loops while preserving current source
  freshness.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| A harness-portable orchestrator prompt can help a runtime execute a coherent session, but it must not become workflow authority. | bootstrap_gap_resolved | `BANDIT-065` adds a policy/template/validator path that requires CLI authority, repo-derived evidence, role boundaries, stop conditions, and forbidden actions. |
| Remaining role-scoped runtime ideas should not become active work merely because they exist as source material. | queued candidate | The accepted harness-agnostic trust-layer decision moved live orchestration, queues, harness lifecycle, Pi/Aperture runtime work, and provider routing outside Bandit's load-bearing product boundary; Repo PM must either scope a bounded trust-layer-compatible work item or record explicit no-action. |
| Reviewer wording can create recursive evidence requests when a generated review artifact says findings are still open after the repair is already recorded. | explicit no-action decision | `review-evidence.md` records concrete PM rationale and durable no-action routing for the Qwen findings; no source repair or new validator behavior was needed. |
| CodeRabbit provider timeout remains a recurring bootstrap limitation for pre-PR review. | explicit no-action decision | The timeout was recorded as `coderabbit_provider_timeout` replacement evidence with no pass claimed; Local Qwen, PM disposition, risk classification, supply-chain gate, and deterministic verification covered the landing decision. |
| The local-record landing command writes landing-action evidence but not full closeout transitions. | explicit no-action decision | Codex PM manually records retrospective and closed coordination transitions during Stage 6; this remains an accepted bootstrap closeout boundary. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | Repo-native `coderabbit-review pre-pr` required a fixture path, so direct CodeRabbit CLI was used and timed out after reaching provider analysis. | explicit no-action decision - provider timeout evidence is recorded; no CLI repair is required inside this chore because direct timeout replacement evidence is accepted |
| overreasoning | The work did not implement role input packets, execution packets, live A2A, Pi/Aperture runtime, queues, scheduler, claim/worktree lifecycle, Trust Verifier cutover, or cockpit product work. | explicit no-action decision - forbidden scope stayed out of the implementation and closeout |
| work-breakdown fit | The prompt policy, template, validator, CLI command, and focused tests formed a bounded trust-layer-compatible chore. | bootstrap_gap_resolved - `BANDIT-065` completes the orchestrator-prompt slice of the role-scoped umbrella |
| agent-scope fit | Codex PM handled orchestration and evidence; Codex Test Writer authored RED; Claude implemented source only; reviewers owned Stage 4 evidence; Landing Agent owned landing evidence. | explicit no-action decision - authority boundaries held |
| reviewer/model routing | CodeRabbit timed out; Local Qwen returned non-blocking evidence-completeness findings that were repaired and dispositioned. | explicit no-action decision - no unresolved reviewer finding or durable follow-up chore remains |
| cost or latency signals | No dependency install, paid-provider setup, merge, push, deploy, external credential setup, or new paid routing policy was introduced. | explicit no-action decision - no cost-policy or supply-chain follow-up is required |
| unresolved uncertainty | Remaining role-scoped runtime ideas are source material, not active Bandit bootstrap work. | queued candidate - future reconsideration requires a separate product or trust-layer decision and bounded work item, or explicit Repo PM no-action |
| clean-code signal | Validator state, prompt authority, forbidden actions, and role boundaries are explicit structured fields; no hidden authority was introduced. | explicit no-action decision - clean-code compliance passed before landing |
| operator-boundary signal | No operator-owned product, UAT, policy, business, cost, risk, merge, push, deploy, or cutover decision was needed. | explicit no-action decision - closeout is grounded in existing repo decisions |
| bootstrap-gap signal | `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` has now delivered role entrypoints/formation, role contracts/run manifests, and the harness-portable orchestrator prompt contract. | queued candidate - remaining runtime/harness ideas are explicitly not active bootstrap work after the CLI trust-layer pivot |

## Improvement Chores

No new immediate retrospective-derived improvement chore is created by this
closeout.

`BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION-ORCHESTRATOR-PROMPT` is resolved
by `BANDIT-065`. The broader `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`
umbrella remains an unlinked queued candidate for Repo PM to either promote
into a bounded trust-layer-compatible work item or disposition as no-action.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-065`. Claude source
implementation was accepted after focused and repo-wide verification. Local
Qwen's non-blocking evidence-completeness findings were repaired and
PM-dispositioned. CodeRabbit timeout is recorded as provider-timeout/bootstrap
gap replacement evidence rather than pass evidence.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION-ORCHESTRATOR-PROMPT` is
  resolved by `BANDIT-065` closeout evidence.
- `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION` remains an unlinked queued
  candidate for remaining runtime/harness source material.
- Phase 8 cockpit product work remains blocked until Repo PM promotes the queued
  candidate into a bounded work item or records explicit no-action.
