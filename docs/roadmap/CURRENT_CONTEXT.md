# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff / Harness-Agnostic CLI Trust Layer Pivot.

`BANDIT-092` is the active work item. Stage 2 RED, Stage 3 implementation, and
aggregate Stage 4 review are recorded for the fourth `BANDIT-PRD-004`
implementation slice: Boundary Cell Movement Gate.

**Active work item:** `BANDIT-092` - Boundary Cell Movement Gate.

The current stage is Stage 6: closeout pending.

**Current next action:** Closeout Agent should record the `BANDIT-092`
retrospective, improvement disposition, roadmap/context/status refresh, and
final validation.

Do not continue PRD-005 implementation,
V0 Closeout Claude Code A/B Product-Value Trial implementation, Trust Verifier
cutover, merge, push, deploy, hosted service setup, paid reviewer/model
routing, public benchmark publication, local API work, State Index work,
guarded browser action execution, PR/CI/CD implementation, installed-copy
update-path implementation, or unrelated Phase 8 product work before
current Stage 6 closeout artifacts and final validation are recorded for
`BANDIT-092`.

No public package publishing is approved, no paid registry setup is approved,
no hosted update service is approved, no telemetry is approved, no automatic
self-update is approved, no credential handling is approved, no external repo
mutation is approved, no installed global skill mutation is approved, no
automation prompt mutation is approved, no merge/push/deploy authority is
approved, no Trust Verifier cutover is approved, no Trust Goal is selected for
cutover, no old gate path is replaced or wrapped, and no Pi/Aperture runtime
work is active.

Local Qwen is authorized only through `.bandit/reviewers/local-qwen.json` and
`bin/omlx-chat-completions.mjs` against the MLX OpenAI-compatible endpoint at
`http://127.0.0.1:8001/v1`. The direct `qwen` CLI is revoked for Bandit
reviewer routing.

## Required Operator Input

No operator-owned input is required for the next recorded action. The Local
Qwen endpoint now runs at `http://127.0.0.1:8001/v1`; the tools were updated
and a live adapter smoke passed. The operator approved prioritizing
`BANDIT-PRD-004` and `BANDIT-PRD-005` before `WIL-V0-TRIAL` on 2026-06-10.

Halt for operator input if a future step would expand landing autonomy, approve
Notify-And-Revert or Auto-Landing Scope for a new boundary cell, approve public package
publishing, approve paid registry setup, approve hosted update services,
approve telemetry, approve automatic self-update, approve credential handling,
approve external repo mutation, approve installed global skill mutation,
approve automation prompt mutation, approve merge/push/deploy authority,
approve Trust Verifier cutover policy, select a Trust Goal for cutover, replace
or wrap an older gate path, change product or UAT direction, approve business
tradeoffs, approve explicit cost/risk posture, approve paid or live
reviewer/model routing, or make another policy/product decision repo artifacts
cannot answer.

## Active Work

`BANDIT-092` current evidence:

- Source spec:
  `docs/specs/BANDIT-092-boundary-cell-movement-gate.json`.
- Brief: `docs/work/BANDIT-092/brief.md`.
- Local Qwen formation review:
  `docs/work/BANDIT-092/qwen-formation-review.md`.
- CodeRabbit formation timeout evidence:
  `docs/work/BANDIT-092/coderabbit-formation-review.md`.
- Aggregate formation review:
  `docs/work/BANDIT-092/formation-review.md`.
- Orchestration plan:
  `docs/work/BANDIT-092/orchestration-plan.md`.
- RED evidence:
  `docs/work/BANDIT-092/red-evidence.md`.
- Stage 3 dispatch:
  `docs/work/BANDIT-092/stage3-dispatch.md`.
- Writer report:
  `docs/work/BANDIT-092/writer-report.md`.
- Implementation evidence:
  `docs/work/BANDIT-092/implementation-evidence.md`.
- Stage 3 PM review:
  `docs/work/BANDIT-092/stage3-pm-review.md`.
- Stage 4 CodeRabbit timeout evidence:
  `docs/work/BANDIT-092/coderabbit-review.md`.
- Local Qwen blocker resolution:
  `docs/work/BANDIT-092/local-qwen-blocker.md`.
- Stage 4 Local Qwen review:
  `docs/work/BANDIT-092/local-qwen-review.md`.
- Local Qwen finding disposition:
  `docs/work/BANDIT-092/qwen-finding-disposition.md`.
- Stage 4 risk/supply-chain gate evidence:
  `.bandit/policy/risk-classifications/BANDIT-092-risk-classification.json`
  and `.bandit/policy/supply-chain-gates/BANDIT-092-supply-chain-gate.json`.
- Aggregate Stage 4 review evidence:
  `docs/work/BANDIT-092/review-evidence.md`.
- Landing verdict and local landing action:
  `docs/work/BANDIT-092/landing-verdict.md` and
  `docs/work/BANDIT-092/landing-action.md`.
- Coordination log: `docs/work/BANDIT-092/coordination-log.jsonl`, current
  state `landed`.

`BANDIT-091` closed evidence:

- Source spec:
  `docs/specs/BANDIT-091-escape-candidate-workflow.json`.
- Brief: `docs/work/BANDIT-091/brief.md`.
- Local Qwen formation review:
  `docs/work/BANDIT-091/qwen-formation-review.md`.
- CodeRabbit formation timeout evidence:
  `docs/work/BANDIT-091/coderabbit-formation-review.md`.
- Aggregate formation review:
  `docs/work/BANDIT-091/formation-review.md`.
- Orchestration plan:
  `docs/work/BANDIT-091/orchestration-plan.md`.
- RED evidence: `docs/work/BANDIT-091/red-evidence.md`.
- Stage 3 dispatch: `docs/work/BANDIT-091/stage3-dispatch.md`.
- Claude timeout evidence: `docs/work/BANDIT-091/stage3-claude-timeout.md`.
- MiniMax fallback dispatch: `docs/work/BANDIT-091/stage3-minimax-dispatch.md`.
- Writer report: `docs/work/BANDIT-091/writer-report.md`.
- Implementation evidence: `docs/work/BANDIT-091/implementation-evidence.md`.
- Stage 3 PM acceptance: `docs/work/BANDIT-091/stage3-pm-acceptance.md`.
- Stage 4 CodeRabbit timeout evidence:
  `docs/work/BANDIT-091/coderabbit-review.md`.
- Stage 4 Local Qwen review:
  `docs/work/BANDIT-091/local-qwen-review.md`.
- Stage 4 risk/supply-chain gate evidence:
  `.bandit/policy/risk-classifications/BANDIT-091-risk-classification.json`
  and `.bandit/policy/supply-chain-gates/BANDIT-091-supply-chain-gate.json`.
- Aggregate Stage 4 review evidence:
  `docs/work/BANDIT-091/review-evidence.md`.
- Landing verdict: `docs/work/BANDIT-091/landing-verdict.md`.
- Landing action: `docs/work/BANDIT-091/landing-action.md`.
- Retrospective and improvement disposition:
  `docs/work/BANDIT-091/retrospective.md` and
  `docs/work/BANDIT-091/improvement-disposition.md`.
- Coordination log: `docs/work/BANDIT-091/coordination-log.jsonl`, current
  state `closed`.

`BANDIT-090` closed evidence:

- Source spec:
  `docs/specs/BANDIT-090-attribution-join-key-wiring.json`.
- Brief: `docs/work/BANDIT-090/brief.md`.
- Local Qwen formation review:
  `docs/work/BANDIT-090/qwen-formation-review.md`.
- CodeRabbit formation timeout evidence:
  `docs/work/BANDIT-090/coderabbit-formation-review.md`.
- Aggregate formation review:
  `docs/work/BANDIT-090/formation-review.md`.
- Orchestration plan:
  `docs/work/BANDIT-090/orchestration-plan.md`.
- RED evidence:
  `docs/work/BANDIT-090/red-evidence.md`.
- RED tests:
  `test/landing-gates.test.mjs`.
- Claude attempt evidence:
  `docs/work/BANDIT-090/stage3-claude-attempt.md`.
- MiniMax timeout evidence:
  `docs/work/BANDIT-090/stage3-minimax-attempt-timeout.md`.
- Stage 3 PM review:
  `docs/work/BANDIT-090/stage3-pm-review.md`.
- Stage 3 writer report:
  `docs/work/BANDIT-090/writer-report.md`.
- Stage 3 implementation evidence:
  `docs/work/BANDIT-090/implementation-evidence.md`.
- Stage 4 CodeRabbit timeout evidence:
  `docs/work/BANDIT-090/coderabbit-review.md`.
- Stage 4 Local Qwen review:
  `docs/work/BANDIT-090/local-qwen-review.md`.
- Supplemental Local Qwen full-packet review:
  `docs/work/BANDIT-090/local-qwen-full-packet-review.md`.
- Local Qwen finding disposition:
  `docs/work/BANDIT-090/qwen-finding-disposition.md`.
- Stage 4 risk/supply-chain gate evidence:
  `.bandit/policy/risk-classifications/BANDIT-090-risk-classification.json`
  and `.bandit/policy/supply-chain-gates/BANDIT-090-supply-chain-gate.json`.
- Aggregate Stage 4 review evidence:
  `docs/work/BANDIT-090/review-evidence.md`.
- Landing verdict and local landing action:
  `docs/work/BANDIT-090/landing-verdict.md` and
  `docs/work/BANDIT-090/landing-action.md`.
- Retrospective and improvement disposition:
  `docs/work/BANDIT-090/retrospective.md` and
  `docs/work/BANDIT-090/improvement-disposition.md`.
- Attribution Join Key implementation:
  `docs/templates/attribution-join-key.md`,
  `src/state/attribution-join-key.ts`, `src/commands/init.ts`,
  `src/commands/validate.ts`, `src/commands/land-check.ts`,
  `src/state/landing-verdicts.ts`, and `src/state/templates.ts`.
- Coordination log: `docs/work/BANDIT-090/coordination-log.jsonl`, current
  state `closed`.

`BANDIT-089` closed evidence:

- Source spec:
  `docs/specs/BANDIT-089-trust-boundary-evidence-schema-contracts.json`.
- Brief: `docs/work/BANDIT-089/brief.md`.
- Orchestration plan: `docs/work/BANDIT-089/orchestration-plan.md`.
- RED evidence: `docs/work/BANDIT-089/red-evidence.md`.
- RED tests: `test/landing-gates.test.mjs`.
- Claude attempt evidence: `docs/work/BANDIT-089/stage3-claude-attempt.md`.
- MiniMax timeout evidence:
  `docs/work/BANDIT-089/stage3-minimax-attempt-timeout.md`.
- Stage 3 PM review: `docs/work/BANDIT-089/stage3-pm-review.md`.
- Stage 3 writer report: `docs/work/BANDIT-089/writer-report.md`.
- Stage 3 implementation evidence:
  `docs/work/BANDIT-089/implementation-evidence.md`.
- Boundary Contour policy: `.bandit/policy/boundary-contour.json`.
- Boundary evidence templates:
  `docs/templates/boundary-prediction-record.md` and
  `docs/templates/notify-and-revert-artifact.md`.
- Boundary autonomy implementation: `src/state/boundary-autonomy.ts`,
  `src/commands/init.ts`, `src/commands/validate.ts`,
  `src/commands/land-check.ts`, `src/state/landing-verdicts.ts`,
  `src/state/paths.ts`, and `src/state/templates.ts`.
- Local Qwen formation review:
  `docs/work/BANDIT-089/qwen-formation-review.md`.
- CodeRabbit formation review:
  `docs/work/BANDIT-089/coderabbit-formation-review.md`.
- Aggregate formation review:
  `docs/work/BANDIT-089/formation-review.md`.
- Stage 4 CodeRabbit timeout evidence:
  `docs/work/BANDIT-089/coderabbit-review.md`.
- Stage 4 Local Qwen review:
  `docs/work/BANDIT-089/local-qwen-review.md`.
- Stage 4 risk/supply-chain gate evidence:
  `.bandit/policy/risk-classifications/BANDIT-089-risk-classification.json`
  and `.bandit/policy/supply-chain-gates/BANDIT-089-supply-chain-gate.json`.
- Aggregate Stage 4 review evidence:
  `docs/work/BANDIT-089/review-evidence.md`.
- Landing verdict and local landing action:
  `docs/work/BANDIT-089/landing-verdict.md` and
  `docs/work/BANDIT-089/landing-action.md`.
- Retrospective and improvement disposition:
  `docs/work/BANDIT-089/retrospective.md` and
  `docs/work/BANDIT-089/improvement-disposition.md`.
- Coordination log: `docs/work/BANDIT-089/coordination-log.jsonl`, current
  state `closed`.
- PRD decomposition:
  `docs/prds/BANDIT-PRD-004-005-decomposition.md`.
- Work Intake Ledger: `.bandit/work-intake-ledger.json` records
  `WIL-INSTALLED-COPY-UPDATE` closed as `BANDIT-088`, plus PRD-backed
  `PRD-004-TRUST-BOUNDARY-AUTONOMY` and
  `PRD-005-BANDIT-WORK-COMMANDS` accepted ahead of `WIL-V0-TRIAL`.

No open bootstrap gap remains in `.bandit/bootstrap-gaps.json`.

`BANDIT-089` implementation adds schema-only fail-closed trust-boundary
evidence contracts and does not approve expanded landing autonomy,
Notify-And-Revert or Auto-Landing Scope, Trust Verifier cutover, PRD-005
implementation, the V0 Closeout Claude Code A/B Product-Value Trial, or
unrelated Phase 8 product work.

`BANDIT-090` implementation adds fail-closed Attribution Join Key contracts,
validation, template/init support, landing-verdict metadata parsing, aggregate
validation integration, and land-check attribution requirements only when a
landing verdict explicitly claims `notify_and_revert` or `auto_land` boundary
autonomy. It does not approve expanded landing autonomy, escape workflow,
boundary-cell movement, PRD-005 implementation, the V0 Closeout Claude Code
A/B Product-Value Trial, or unrelated Phase 8 product work.

`BANDIT-092` formation defines a bounded movement-gate slice for
Workflow Trial-backed Boundary Cell Movement evidence and confirmed-escape
contraction checks. It does not approve expanded landing autonomy, apply a
Boundary Contour update, execute Notify-And-Revert, execute rollback, approve
Auto-Landing Scope, implement PRD-005, the V0 Closeout Claude Code A/B
Product-Value Trial, Trust Verifier cutover, attribution gateway work, cockpit
UI, local API, State Index, hosted services, telemetry, public benchmark
publication, paid routing, merge, push, deploy, credential handling,
dependency changes, package-script changes, CI/release workflow changes,
external repo mutation, or unrelated Phase 8 work.

`BANDIT-091` implementation adds fail-closed Escape Candidate and Boundary
Escape Disposition evidence contracts, template support, aggregate validation
integration, and tests while preserving ordinary safe-to-land bootstrap flows
when no escape workflow evidence exists. It does not approve expanded landing
autonomy, Notify-And-Revert execution, Auto-Landing Scope, escape
classification authority, boundary-cell movement, PRD-005 implementation, the
V0 Closeout Claude Code A/B Product-Value Trial, or unrelated Phase 8 product
work.

The next recorded action is Work Item PM plan-mode orchestration for
`BANDIT-092` before RED evidence.
