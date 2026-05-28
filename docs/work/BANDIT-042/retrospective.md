# BANDIT-042 Retrospective

## Outcome

`BANDIT-042` landed and closed out the bootstrap-gap chore for `BANDIT-GAP-SUPPLY-CHAIN-GATE`. The work adds a repo-native Supply-Chain Gate policy, supply-chain evidence template, focused validation, `bandit supply-chain-gate validate [--json]`, `bandit validate` integration, and auto-land-check consumption so dependency manifests, lockfiles, package-manager scripts, CI or release workflows, agent skills, fetched prompts, external tool-install paths, executable generated content, and unknown supply-chain surfaces require explicit evidence before release-authorized auto-landing. Stage 4 pre-PR CodeRabbit evidence passed with no findings, Local Qwen returned non_blocking findings with PM disposition, Stage 5 landing verdict and local-record landing action evidence are recorded, the landing blocker was repaired with explicit layered risk-classification and supply-chain gate evidence, and no product, UAT, policy override, business tradeoff, explicit cost/risk override, dependency installation, lockfile change, live SCA provider, paid reviewer routing, scheduler authority, claim/worktree authority, installed global skill edit, external service integration, PR/CI execution, merge, push, deploy, or cockpit UI scope was introduced.

## What Worked

- The resolved Input Quarantine Gate and Layered Risk Classification Gate gave this chore the right dependency order before supply-chain state became an independent auto-landing input.
- Focused RED tests captured missing supply-chain evidence, dependency changes without SCA or unavailable-tool disposition, lockfile drift without manifest rationale, package-manager script risk, CI/release workflow auto-landing refusal, fetched prompt and external tool-install evidence, unknown surface refusal, operator-supervision requirements, and complete accepted low-risk evidence.
- The implementation kept supply-chain trust explicit in repo-native policy, templates, evidence files, validation, and auto-land-check consumption rather than moving authority into reviewers, generated context, cockpit state, scheduler behavior, or model routing.
- The Stage 5 repair proved the new gate fails closed: auto-land-check refused `BANDIT-042` until explicit layered risk-classification and supply-chain gate evidence were registered, then passed after the evidence and review subject hash were refreshed.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Supply-chain-sensitive surfaces need a dedicated gate instead of being treated as ordinary implementation files or smell-trigger-only risk. | bootstrap_gap_resolved | `BANDIT-042` adds the Supply-Chain Gate policy, template, validator, CLI command, validation wiring, auto-land-check consumption, focused tests, review evidence, landing verdict, landing action, and retrospective closeout; `.bandit/bootstrap-gaps.json` marks `BANDIT-GAP-SUPPLY-CHAIN-GATE` resolved during closeout. |
| Auto-landing eligibility must require explicit supply-chain evidence when touched surfaces include dependency, lockfile, script, CI/release, agent-skill, fetched-prompt, external tool-install, executable generated content, or unknown supply-chain paths. | explicit no-action decision | The supply-chain validator and auto-land-check integration now fail closed for missing, invalid, elevated, stale-by-policy, unknown, or operator-supervision-pending supply-chain state, and `BANDIT-042` records explicit eligible evidence before landing. |
| Fetched prompts, dependency documentation, generated instructions, and external tool metadata must stay data-only unless Input Quarantine and Trusted Source Gate evidence authorizes instruction-bearing use. | explicit no-action decision | The Supply-Chain Gate consumes input-quarantine and trusted-source references for fetched or instruction-bearing supply-chain content without redefining those boundaries inside this chore. |
| Artifact-specific stale-evidence semantics should be defined by the queued Evidence Freshness SLO gap rather than invented ad hoc inside this supply-chain gate. | queued_bootstrap_gap | Local Qwen's accepted non-blocking freshness finding is routed into existing queued `BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS`; `BANDIT-042` remains correct because it fails closed for missing, invalid, elevated, and operator-supervision-pending supply-chain evidence. |
| The first supply-chain validator is acceptable for this gate, but future changes should split the state module before it accumulates more behavior. | queued_follow_up_candidate | Local Qwen's accepted non-blocking maintainability finding is recorded as `BANDIT-042-SUPPLY-CHAIN-VALIDATOR-SPLIT` in `docs/work/BANDIT-042/qwen-finding-disposition.md`; no source repair is required for this closeout. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | The Stage 5 auto-land-check failure was intentional fail-closed behavior caused by missing explicit layered risk-classification and supply-chain gate evidence for `BANDIT-042`; the blocker was repaired with policy evidence and rerun successfully. Final CodeRabbit, Local Qwen, landing, validation, gap listing, risk-classification validation, supply-chain validation, input-quarantine validation, auto-land-check, land-check, and cockpit status evidence passed. | explicit no-action decision - the failure validated the gate and no new invocation-friction gap is required |
| overreasoning | The work stayed bounded to supply-chain gate policy, template, validation, command wiring, auto-land-check consumption, focused tests, review evidence, landing evidence, and closeout artifacts. | explicit no-action decision - no dependency automation, live SCA provider, scheduler, claim, worktree, cockpit UI, live-routing, paid-reviewer route, external-service, PR/CI execution, merge, push, or deploy work started |
| work-breakdown fit | The gap was well-sized as one bootstrap chore: write RED tests, implement the supply-chain gate contract and validator, run Stage 4 review, repair Stage 5 evidence registration, land locally, then close out Stage 6. | explicit no-action decision - no follow-up required for slice size |
| agent-scope fit | Codex PM owned technical routing, Test Writer evidence was focused in supply-chain and landing-gate tests, Writer work stayed within policy/template/validator/command and auto-land-check surfaces, CodeRabbit and Local Qwen owned Stage 4 review, and Landing Agent evidence owned Stage 5. | explicit no-action decision - no operator-owned routing question or agent-boundary follow-up remains |
| tool-use rule pressure | The closeout used the established artifact-create retrospective path plus manual gap-ledger and roadmap synchronization; the remaining pressure is expected Stage 6 prose synchronization across canonical routing surfaces. | explicit no-action decision - existing context, gap-ledger, and cockpit status validation remain sufficient for this closeout |
| reviewer/model routing | CodeRabbit passed with no findings, Local Qwen returned non_blocking findings with PM disposition, and the recorded risk rationale did not require escalated reviewer routing after the accepted findings were routed to durable follow-up destinations. | explicit no-action decision - no unresolved cross-model tension or reviewer-routing follow-up remains |
| tool invocation friction | The focused pre-PR CodeRabbit invocation, Local Qwen review command, review-subject hash command, supply-chain validation command, risk-classification validation command, input-quarantine validation command, land-check, auto-land-check, land command, and retrospective artifact-create path all had established invocation patterns by closeout. | explicit no-action decision - no new invocation-friction bootstrap gap required |
| recurring inefficiency | Roadmap, current-context, and bootstrap-gap ledger closeout still require repeated prose edits, but this instance is expected Stage 6 synchronization and cockpit status validation covers the resulting state. | explicit no-action decision - existing context and cockpit status validation remain sufficient for this closeout |
| cost or latency signals | No paid reviewer call, recurring paid model route, spend-class approval, high-token reviewer policy, benchmark spend, live SCA provider, dependency install, or live provider route was introduced. CodeRabbit and Local Qwen evidence used existing Stage 4 reviewer paths. | explicit no-action decision - no cost or latency follow-up required |
| unresolved uncertainty | No uncertainty remains for the Supply-Chain Gate gap after tests, review evidence, landing verdict, local-record landing action, explicit risk-classification and supply-chain evidence registration, validation evidence, and closeout. The next known trust-layer gap is already queued as `BANDIT-GAP-COORDINATION-EVENT-LOG-AUTHORITY`. | queued bootstrap gap - BANDIT-GAP-COORDINATION-EVENT-LOG-AUTHORITY |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

`BANDIT-GAP-SUPPLY-CHAIN-GATE` is resolved by `BANDIT-042`. Local Qwen's accepted freshness finding remains routed to existing queued `BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS`, and the maintainability follow-up candidate `BANDIT-042-SUPPLY-CHAIN-VALIDATOR-SPLIT` remains recorded in `docs/work/BANDIT-042/qwen-finding-disposition.md`. The next queued bootstrap gap is `BANDIT-GAP-COORDINATION-EVENT-LOG-AUTHORITY`, which should become the next work item before unrelated Phase 8 work.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-042`. Focused pre-PR CodeRabbit review passed with no findings, Local Qwen returned non_blocking findings with concrete PM disposition, the freshness finding is routed to the queued Evidence Freshness SLO gap, the validator split finding is routed as a future follow-up candidate, and no escalated reviewer route was required by the recorded risk and smell-trigger rationale.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-COORDINATION-EVENT-LOG-AUTHORITY` is open and queued as the next bootstrap-gap chore.
- `BANDIT-GAP-OPERATOR-FAIL-CLOSED-BOUNDARY` remains queued behind coordination event-log authority.
- The remaining strategic-review bootstrap gaps remain queued in the order recorded in `.bandit/bootstrap-gaps.json`.

## Bootstrap-Gap Disposition

`BANDIT-GAP-SUPPLY-CHAIN-GATE` is resolved.

The resolution evidence is:

- `docs/work/BANDIT-042/brief.md`
- `docs/work/BANDIT-042/red-evidence.md`
- `docs/work/BANDIT-042/implementation-evidence.md`
- `docs/work/BANDIT-042/coderabbit-review.md`
- `docs/work/BANDIT-042/local-qwen-review.md`
- `docs/work/BANDIT-042/qwen-finding-disposition.md`
- `docs/work/BANDIT-042/review-evidence.md`
- `docs/work/BANDIT-042/landing-verdict.md`
- `.bandit/policy/risk-classifications/BANDIT-042-risk-classification.json`
- `.bandit/policy/supply-chain-gates/BANDIT-042-supply-chain-gate.json`
- `docs/work/BANDIT-042/landing-action.md`
- `docs/work/BANDIT-042/retrospective.md`
- `.bandit/bootstrap-gaps.json`

`BANDIT-GAP-COORDINATION-EVENT-LOG-AUTHORITY` remains open and queued. The next
Bandit step is to create exactly one bootstrap-gap chore for that gap; do not
start unrelated Phase 8 work first.

## Stage 6 Verification

- Retrospective: `pass` - this artifact records closeout for `BANDIT-042`.
- Structured improvement mining: `pass` - the checklist explicitly covers
  failed tool calls, overreasoning, work-breakdown fit, agent-scope fit,
  tool-use rule pressure, reviewer/model routing, tool invocation friction,
  recurring inefficiency, cost or latency signals, and unresolved uncertainty.
- Lesson disposition: `pass` - material lessons are classified as resolved
  bootstrap gap, queued bootstrap gap, queued follow-up candidate, or explicit
  no-action decision.
- Improvement disposition: `pass` - no new retrospective-derived improvement
  chore is created; accepted Local Qwen findings are routed to the existing
  Evidence Freshness SLO gap and `BANDIT-042-SUPPLY-CHAIN-VALIDATOR-SPLIT`.
- Bootstrap-gap disposition: `pass` - `BANDIT-GAP-SUPPLY-CHAIN-GATE` is marked
  resolved in `.bandit/bootstrap-gaps.json`.
- Current context update: `pass` - `docs/roadmap/CURRENT_CONTEXT.md` and
  `docs/roadmap/ROADMAP.md` are updated during this closeout.
- Coordination closeout: `not_applicable` - `BANDIT-042` has no
  `docs/work/BANDIT-042/coordination-log.jsonl`, and this closeout does not add
  coordination state.
