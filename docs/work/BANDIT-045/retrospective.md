# BANDIT-045 Retrospective

## Outcome

`BANDIT-045` landed and closed out the bootstrap-gap chore for `BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY`. The work adds a repo-native Claim Authority Primitive contract using `refs/bandit/*` and `git update-ref --stdin` compare-and-swap transaction semantics, keeps `.bandit/claims/`, in-flight registries, cockpit status, and state indexes as projection surfaces, requires expected-state checks, fencing-token proof, idempotency keys, reconciliation evidence, declared write surfaces, Work-Surface Wait-For Graph cycle refusal, and deterministic Claim Safety Invariant simulation. Stage 4 pre-PR CodeRabbit evidence passed with no findings, Local Qwen returned `non_blocking` maintainability findings with Codex PM disposition and durable follow-up candidates, Stage 5 landing verdict and local-record landing action evidence are recorded, explicit layered risk-classification and supply-chain gate evidence passed, and no true parallel writable workstream enablement, Git Mutation Serializer implementation, Worktree Bootstrap Contract, scheduler execution, worktree lifecycle, product UAT approval, cockpit UI/server/API work, PR/CI execution, merge, push, deploy, paid reviewer routing, live routing change, dependency or lockfile change, installed global skill edit, external service integration, or unrelated Phase 8 work was introduced.

## What Worked

- The accepted PRD-002 research review, Git refs backend decision, and queued bootstrap-gap ledger gave this chore a narrow authority contract before worktree lifecycle, scheduler execution, or cockpit state-index work could start.
- Focused RED tests and deterministic simulation covered duplicate claim refusal, CAS mismatch, stale expected state, stale fencing tokens, idempotency replay and conflict, projection edits, reconciliation disagreement, wait-for graph cycles, failed serializer or worktree-lock cleanup invariants, and recovery-required behavior.
- The implementation separated claim-authority validation, claim projection checks, work-surface graph logic, and claim-safety simulation into local modules instead of creating a broad hidden workflow runner.
- Stage 4 review stayed bounded: CodeRabbit passed, Local Qwen identified two non-blocking maintainability concerns, and Codex PM routed both to durable candidates without reopening a source-repair loop after the implementation gates accepted the behavior.
- The Stage 5 gates proved that the newer layered risk-classification and supply-chain evidence paths can authorize a low-risk local-record landing while keeping true parallel writable workstreams blocked behind later gates.

## Lessons And Dispositions

| Lesson | Disposition | Rationale |
| --- | --- | --- |
| Release-authorized writable claim authority must use Git refs CAS semantics, fencing tokens, idempotency keys, projection non-authority, reconciliation checks, wait-for graph cycle refusal, and Claim Safety Invariant simulation before parallel writable workstreams proceed. | bootstrap_gap_resolved | `BANDIT-045` adds the claim-authority policy, template, validator, CLI command, deterministic simulation, Work-Surface Wait-For Graph checks, init/validate wiring, focused tests, Stage 4 review evidence, Stage 5 landing verdict, local-record landing action, and retrospective closeout; `.bandit/bootstrap-gaps.json` marks `BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY` resolved during closeout. |
| Claim projection files, in-flight registries, cockpit status, and state indexes can explain claim state, but they cannot grant, renew, release, complete, fail, block, recover, or reconcile claims without the Git refs claim authority boundary. | explicit no-action decision | The claim-authority policy, template, validation path, projection checks, and focused tests now enforce projection non-authority and drift refusal without requiring a separate follow-up for this bounded contract. |
| The first claim-safety simulation is sufficient for CAS, fencing, idempotency, projection, wait-for graph, and recovery invariants, but future simulation expansion should avoid a brittle scenario router if later work adds materially more scenarios. | durable follow-up candidate | `docs/work/BANDIT-045/qwen-finding-disposition.md` records `BANDIT-045-CLAIM-SIMULATION-SCENARIO-REGISTRY` with hypothesis, metric, baseline, expected direction, evaluation window, status, and pending outcome. |
| Claim-authority validation helpers are intentionally local for the first contract, but duplicated record and primitive-field readers should be reevaluated before the next substantial claim-authority policy expansion. | durable follow-up candidate | `docs/work/BANDIT-045/qwen-finding-disposition.md` records `BANDIT-045-CLAIM-VALIDATION-HELPER-EXTRACTION` with hypothesis, metric, baseline, expected direction, evaluation window, status, and pending outcome. |
| Git refs CAS claim authority does not serialize shared `.git` worktree or repository plumbing mutations. | queued_bootstrap_gap | `BANDIT-045` intentionally does not implement the Git Mutation Serializer. `BANDIT-GAP-GIT-MUTATION-SERIALIZER` is now the next queued bootstrap gap and must define the shared `.git` mutation allow-list, CLI-owned single-writer guard, worktree lock behavior, stale-lock or timeout behavior, non-serialized mutation refusals, and trace/evidence output before parallel worktrees are release-authorized. |

## Structured Improvement Mining

| Signal | Finding | Disposition |
| --- | --- | --- |
| failed tool calls | The Stage 6 closeout run had one harmless command-discovery miss: `npm run bandit -- --help` refused with the CLI usage text because top-level `--help` is not a supported command. Required evidence creation and verification used the established artifact-create, validation, gaps list, cockpit status, land-check, auto-land-check, and diff-hygiene paths. | explicit no-action decision - the usage refusal exposed no repeated workflow blocker and the supported command surface was clear from repo output and source inspection |
| overreasoning | The work stayed bounded to claim-authority policy/template surfaces, validation, command routing, projection checks, wait-for graph behavior, deterministic simulation, focused tests, review evidence, landing evidence, and closeout artifacts. | explicit no-action decision - no Git Mutation Serializer, Worktree Bootstrap Contract, scheduler, worktree lifecycle, cockpit UI/server/API, state-index persistence, live routing, paid-reviewer route, external-service integration, PR/CI execution, merge, push, deploy, or unrelated Phase 8 work started |
| work-breakdown fit | The gap was well-sized as one bootstrap chore: write RED tests and simulation expectations, implement the claim-authority contract and validator, run Stage 4 review, register risk and supply-chain evidence, land locally, then close out Stage 6. | explicit no-action decision - the remaining Git Mutation Serializer and Worktree Bootstrap Contract work stays queued as separate bootstrap gaps |
| agent-scope fit | Codex PM owned technical routing and finding disposition, Test Writer evidence was focused on claim authority, claim-safety simulation, and work-surface graph behavior, Writer work stayed within claim-authority command/state/policy/template surfaces, CodeRabbit and Local Qwen owned Stage 4 review, and Landing Agent evidence owned Stage 5. | explicit no-action decision - no operator-owned routing question or agent-boundary follow-up remains |
| tool-use rule pressure | The closeout used the established generated retrospective path plus manual gap-ledger and roadmap synchronization. The remaining pressure is expected Stage 6 bookkeeping across canonical routing surfaces, not missing product or policy input. | explicit no-action decision - existing artifact-create, validate, gaps list, and cockpit status checks remain sufficient for this closeout |
| reviewer/model routing | CodeRabbit passed with no findings. Local Qwen returned non-blocking maintainability findings, and Codex PM accepted and routed both findings to durable follow-up candidates. The recorded layered risk and smell-trigger rationale did not require escalated reviewer routing. | explicit no-action decision - no unresolved cross-model tension or reviewer-routing follow-up remains for BANDIT-045 |
| tool invocation friction | The focused pre-PR CodeRabbit invocation, Local Qwen review command, review-subject hash command, claim-authority validation and simulation paths, supply-chain validation command, risk-classification validation command, input-quarantine validation command, operator-boundary validation command, coordination-authority validation command, land-check, auto-land-check, land command, and retrospective artifact-create path all had established invocation patterns by closeout. | explicit no-action decision - no new invocation-friction bootstrap gap required |
| recurring inefficiency | Roadmap, current-context, and bootstrap-gap ledger closeout still require repeated prose edits after generated retrospective creation, but this is expected Stage 6 synchronization and cockpit status validation covers the resulting state. | explicit no-action decision - existing context and cockpit status validation remain sufficient for this closeout |
| cost or latency signals | No paid reviewer call, recurring paid model route, spend-class approval, high-token reviewer policy, benchmark spend, live provider route, live external service, dependency install, or live SCA provider was introduced. CodeRabbit and Local Qwen evidence used existing Stage 4 reviewer paths. | explicit no-action decision - no cost or latency follow-up required |
| unresolved uncertainty | No uncertainty remains for the CAS Fenced Claim Authority gap after focused tests, deterministic simulation, review evidence, Codex PM finding disposition, landing verdict, local-record landing action, explicit risk-classification and supply-chain evidence registration, validation evidence, and closeout. The next known bootstrap gap is `BANDIT-GAP-GIT-MUTATION-SERIALIZER`. | queued bootstrap gap - BANDIT-GAP-GIT-MUTATION-SERIALIZER |

## Improvement Chores

No new retrospective-derived improvement chore is created by this closeout.

The two accepted Local Qwen maintainability findings remain durable follow-up candidates in `docs/work/BANDIT-045/qwen-finding-disposition.md`: `BANDIT-045-CLAIM-VALIDATION-HELPER-EXTRACTION` and `BANDIT-045-CLAIM-SIMULATION-SCENARIO-REGISTRY`.

`BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY` is resolved by `BANDIT-045`. The next queued bootstrap gap is `BANDIT-GAP-GIT-MUTATION-SERIALIZER`, which should become the next work item before unrelated Phase 8 work.

## Cross-Model Tension

No unresolved cross-model tension remains for `BANDIT-045`. Focused pre-PR CodeRabbit review passed with no findings, Local Qwen returned `non_blocking` maintainability findings, and Codex PM accepted/routed those findings without disputing the implementation's Stage 4 landability.

## Bootstrap Gaps Remaining

- `BANDIT-GAP-GIT-MUTATION-SERIALIZER` is open and queued as the next bootstrap-gap chore.
- `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` remains queued behind the Git mutation serializer gap.
- `BANDIT-GAP-EVENT-DRIVEN-WAKE-SCHEDULER` remains queued behind the worktree bootstrap contract.
- The remaining strategic-review bootstrap gaps remain queued in the order recorded in `.bandit/bootstrap-gaps.json`.

## Bootstrap-Gap Disposition

`BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY` is resolved.

The resolution evidence is:

- `docs/specs/BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY.json`
- `docs/work/BANDIT-045/brief.md`
- `docs/work/BANDIT-045/red-evidence.md`
- `docs/work/BANDIT-045/implementation-evidence.md`
- `docs/work/BANDIT-045/coderabbit-review.md`
- `docs/work/BANDIT-045/local-qwen-review.md`
- `docs/work/BANDIT-045/qwen-finding-disposition.md`
- `docs/work/BANDIT-045/review-evidence.md`
- `docs/work/BANDIT-045/landing-verdict.md`
- `.bandit/policy/risk-classifications/BANDIT-045-risk-classification.json`
- `.bandit/policy/supply-chain-gates/BANDIT-045-supply-chain-gate.json`
- `.bandit/policy/claim-authority.json`
- `docs/templates/claim-authority.md`
- `.bandit/claims/README.md`
- `docs/work/BANDIT-045/landing-action.md`
- `docs/work/BANDIT-045/retrospective.md`
- `.bandit/bootstrap-gaps.json`

`BANDIT-GAP-GIT-MUTATION-SERIALIZER` remains open and is now the next queued
bootstrap-gap chore. The next Bandit step is to create exactly one work item for
that gap; do not start Worktree Bootstrap Contract, scheduler, worktree
lifecycle, cockpit UI/server/API, merge/push/deploy behavior, PR/CI workflow,
or unrelated Phase 8 work first.

## Stage 6 Verification

- Retrospective: `pass` - this artifact records closeout for `BANDIT-045`.
- Structured improvement mining: `pass` - the checklist explicitly covers
  failed tool calls, overreasoning, work-breakdown fit, agent-scope fit,
  tool-use rule pressure, reviewer/model routing, tool invocation friction,
  recurring inefficiency, cost or latency signals, and unresolved uncertainty.
- Lesson disposition: `pass` - material lessons are classified as resolved
  bootstrap gap, durable follow-up candidates, queued bootstrap gap, or
  explicit no-action decisions.
- Improvement disposition: `pass` - no new retrospective-derived improvement
  chore is created; the two accepted Local Qwen follow-up candidates remain
  recorded in `docs/work/BANDIT-045/qwen-finding-disposition.md`.
- Bootstrap-gap disposition: `pass` - `BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY`
  is marked resolved in `.bandit/bootstrap-gaps.json`.
- Current context update: `pass` - `docs/roadmap/CURRENT_CONTEXT.md` and
  `docs/roadmap/ROADMAP.md` are updated during this closeout.
- Coordination closeout: `not_applicable` - `BANDIT-045` has no
  `docs/work/BANDIT-045/coordination-log.jsonl`, and this closeout does not add
  coordination state.
