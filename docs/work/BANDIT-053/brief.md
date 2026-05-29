# BANDIT-053: Agent Observability Traces

## Status

Brief Created

## Non-Product Work

Resolve the bootstrap gap where Bandit lacks first-class OTel-compatible traces for agent runtime behavior, cost, latency, failures, reviewer runs, wakeups, claims, tool calls, and outcomes while preserving repo artifacts as canonical workflow state.

## Origin

The PRD-002 research review identified OpenTelemetry-style agent spans as missing observability, and the operator confirmed traces should be first-class for claims, tool calls, reviewer runs, token spend, wakeups, and failures while repo artifacts remain canonical workflow state. `BANDIT-GAP-AGENT-OBSERVABILITY-TRACES` is now the first queued bootstrap gap after `BANDIT-052` resolved the Event-Driven Wake Scheduler.

## Scope

- Define a repo-native Agent Observability Trace policy artifact, expected first at `.bandit/policy/agent-observability.json`, that records trace shape, operation span shape, required correlation IDs, operation taxonomy, projection boundary, and validation rules.
- Define OTel-compatible agent traces for one agent session or workflow activation, covering wakeups, sweeps, claims, renewals, releases, tool calls, reviewer runs, model calls, token spend, retries, failures, and outcomes.
- Define Agent Operation Spans for bounded operations inside a trace, including claim operations, wake decisions, sweeper decisions, tool calls, reviewer runs, model calls, validation gates, retries, failures, and closeout outcomes.
- Require correlation fields that connect trace records to work item ID, stage, claim ID or wake decision, actor identity, model or reviewer profile, review subject hash, evidence artifacts, touched surface, risk classification, supply-chain state, and authorizing boundary where applicable.
- Expose an observability projection boundary for cost, latency, failure patterns, retry loops, tool friction, reviewer runtime, repeated wake/no-op patterns, and trace-backed cost signals without making traces, projections, dashboards, or generated indexes canonical workflow authority.
- Add focused RED evidence before implementation for missing trace shape validation, missing operation-span correlation, missing observability projections, and missing fail-closed authority-boundary checks.
- Implement representative CLI-owned trace emission or recording narrowly enough to prove the contract for claim, wake, reviewer, tool, model-call, validation, and failure operations without turning all workflow commands into a full telemetry backend.
- Preserve the Claim Authority, Git Mutation Serializer, Worktree Bootstrap Contract, Event-Driven Wake Scheduler, Work-Surface Wait-For Graph, Coordination Event Log Authority, Operator Fail-Closed Boundary, Input Quarantine Gate, Layered Risk Classification, Supply-Chain Gate, Stage Capability Scope queue, Token-Cost Failsafe queue, Evidence Freshness SLO queue, and review-subject-hash boundaries.
- Record CLEAN_CODE.md read evidence in Stage 1; CLEAN_CODE.md was read on 2026-05-29 before creating this brief, and clean-code compliance must be evaluated before landing.
- Stage capability scope: Codex PM owns Stage 1 brief creation, Stage 2 RED evidence, routine technical routing, and context-artifact synchronization; if Codex authors or materially edits Stage 2 RED tests, Stage 3 implementation is assigned to Claude through the bootstrap Process Adapter path; the Stage 3 Writer has no authority to edit tests, test helpers, fixtures, RED evidence, or acceptance mappings; CodeRabbit and Local Qwen own Stage 4 review evidence; Landing Agent owns Stage 5 verdict/action evidence.
- Token-cost failsafe boundary: this chore may define trace-backed token, cost, latency, retry, and repeated wake/no-op signals, but it must not approve paid, high-token, recurring reviewer, broader provider-pricing, spend-class, or continuation-decision policy changes; `BANDIT-GAP-TOKEN-COST-FAILSAFE` remains queued for the full cost-policy contract.
- Future-work scope: this chore must not implement full telemetry backend ingestion, hosted observability service integration, broad dashboard UI, Evidence SLO policy, token-cost failsafe policy, Stage Capability Scope enforcement, full scheduler execution, full worktree lifecycle work, claim lease creation or release, work-surface reservations, cockpit UI/server/API work, PR/CI workflow, automatic merge/push/deploy behavior, product UAT approval, live reviewer routing changes, paid reviewer routes, external service integration, installed global skill edits, dependency or lockfile changes, or unrelated Phase 8 work.

## Acceptance Criteria

- The chore brief exists at docs/work/BANDIT-053/brief.md and links to BANDIT-GAP-AGENT-OBSERVABILITY-TRACES.
- Stage 1 brief evidence records CLEAN_CODE.md read evidence, Stage capability scope, Codex-owned technical decisions, source hierarchy, OTel-compatible trace boundary, operation-span correlation boundary, observability projection boundary, token-cost signal boundary, and canonical-artifact authority boundary.
- Focused RED evidence proves Bandit currently lacks enforced Agent Observability Trace shape, Operation Span correlation, observability projection output, and authority-boundary validation.
- The Agent Observability Trace policy validates required trace fields, operation span fields, operation kinds, correlation IDs, actor/model/reviewer identity fields, work item and stage fields, source artifact references, and outcome/failure fields.
- Representative CLI-owned operations can emit or record trace data for claim, wake, sweeper, reviewer, tool, model-call, validation, retry, failure, and outcome paths without replacing canonical workflow artifacts.
- Trace data links to work item ID, stage, claim ID or wake decision, reviewer evidence where applicable, model or reviewer profile where applicable, review subject hash where applicable, and canonical artifact IDs where applicable.
- Token spend, latency, retry count, failure type, tool friction, reviewer runtime, and repeated wake/no-op patterns are queryable from a non-canonical observability projection.
- Validation and gate checks refuse to treat trace data, observability projections, telemetry backends, cockpit views, generated indexes, or dashboard state as substitutes for required canonical repo artifacts.
- Trace shape and projection output preserve input-quarantine boundaries by treating external or third-party text as data-only payload references, not instruction-bearing trace content.
- Trace shape and projection output preserve supply-chain and risk-classification boundaries for executable tools, generated content, external integrations, and sensitive surfaces.
- Trace-backed token and cost signals are recorded as observability evidence only; broader provider-pricing, paid-reviewer, spend-class, and abnormal-run continuation policy remains queued for BANDIT-GAP-TOKEN-COST-FAILSAFE.
- Stage 4 review evidence uses pre-PR CodeRabbit and Local Qwen at the current review subject hash unless honest provider refusal or bootstrap-gap evidence is recorded.
- Layered risk-classification and supply-chain gate evidence are recorded before landing because this chore touches workflow observability, trace policy validation, generated schemas or templates, command routing, and potential executable trace surfaces.
- Clean-code compliance is evaluated before landing; any accepted non-blocking concern becomes a tagged follow-up or explicit no-action decision.
- BANDIT-GAP-AGENT-OBSERVABILITY-TRACES is resolved or explicitly dispositioned in .bandit/bootstrap-gaps.json only after landing action and retrospective closeout evidence exist.
- No full telemetry backend ingestion, hosted observability service integration, broad dashboard UI, Evidence SLO policy, token-cost failsafe policy, Stage Capability Scope enforcement, full scheduler execution, full worktree lifecycle work, claim lease creation or release, work-surface reservation implementation, automatic merge/push/deploy behavior, product UAT approval, cockpit UI/server/API work, PR/CI workflow, live reviewer routing change, paid reviewer route, external service integration, installed global skill edit, dependency or lockfile change, or unrelated Phase 8 work is introduced.

## Verification Plan

- Run focused Agent Observability Trace RED/GREEN tests for trace policy parsing, required trace fields, required operation span fields, operation taxonomy, work item/stage correlation, claim or wake correlation, actor identity, reviewer/model profile correlation, review subject hash correlation, source artifact links, outcome fields, failure fields, retry fields, token/cost fields, and authority-boundary refusals.
- Run focused projection tests proving cost, latency, tool friction, reviewer runtime, repeated wake/no-op patterns, retry patterns, and failure patterns are queryable from non-canonical observability output.
- Run focused tests proving trace data cannot satisfy or replace required workflow gates, work-item artifacts, claim authority, coordination history, roadmap/current-context, landing evidence, UAT evidence, or retrospective evidence.
- Run focused tests proving external or third-party text inside trace payload references remains data-only and cannot affect release-authorized instructions, tools, routing, or landing authority.
- Run focused tests proving trace-backed token and cost signals remain observability data and do not create paid reviewer routing, spend-class approval, provider-pricing evidence, or continuation-decision policy.
- Run node --test test/agent-observability.test.mjs.
- Run node --test test/validate.test.mjs if repo validation behavior is touched.
- Run node --test test/cockpit-status.test.mjs if derived cockpit status exposes observability trace or projection state.
- Run node --test test/event-driven-wake-scheduler.test.mjs if wake scheduler trace behavior is touched.
- Run node --test test/worktree-bootstrap.test.mjs if worktree bootstrap trace behavior is touched.
- Run node --test test/work-item-create.test.mjs if work-item brief rendering or parsing is touched.
- Run npm test if implementation touches shared command routing, validators, artifact renderers, work item parsing, templates, bootstrap gaps, risk classification, supply-chain gates, input quarantine, claim authority, git mutation policy, cockpit status, coordination status, event-driven wake scheduler, worktree bootstrap behavior, or policy validation beyond focused tests.
- Run npm run typecheck.
- Run npm run bandit -- validate.
- Run npm run bandit -- gaps list.
- Run node ./bin/bandit.mjs cockpit status --json.
- Run node ./bin/bandit.mjs session-context current --json.
- Run npm run bandit -- coordination-authority validate --json.
- Run npm run bandit -- input-quarantine validate --json.
- Run npm run bandit -- risk-classification validate --json.
- Run npm run bandit -- supply-chain-gate validate --json because trace policy can affect generated schemas or templates, command routing, executable tool metadata, and external integration surfaces.
- Run npm run bandit -- operator-boundary validate --json.
- Run npm run bandit -- claim validate --json if claim authority, claim state, fencing token, or claim projection behavior is touched.
- Run npm run bandit -- git-mutation validate --json if worktree-related shared `.git` mutation policy is touched.
- Run npm run bandit -- event-driven-wake-scheduler validate --json if scheduler wake or sweeper trace behavior is touched.
- Run node ./bin/bandit.mjs review-subject-hash BANDIT-053 for aggregate review evidence freshness.
- Run npm run bandit -- coderabbit-review pre-pr BANDIT-053 --base origin/main before Stage 4 closeout, unless provider refusal evidence is recorded.
- Run npm run bandit -- qwen-review BANDIT-053 before Stage 4 closeout.
- Run npm run bandit -- land-check BANDIT-053 before landing.
- Run git diff --check.

## Expected Files

- docs/specs/BANDIT-GAP-AGENT-OBSERVABILITY-TRACES.json
- docs/work/BANDIT-053/brief.md
- docs/work/BANDIT-053/red-evidence.md
- docs/work/BANDIT-053/implementation-evidence.md
- docs/work/BANDIT-053/coderabbit-review.md
- docs/work/BANDIT-053/local-qwen-review.md
- docs/work/BANDIT-053/review-evidence.md
- docs/work/BANDIT-053/landing-verdict.md
- docs/work/BANDIT-053/landing-action.md
- docs/work/BANDIT-053/retrospective.md
- docs/specs/BANDIT-053-red-evidence.json
- docs/specs/BANDIT-053-implementation-evidence.json
- docs/specs/BANDIT-053-landing-verdict.json
- docs/specs/BANDIT-053-retrospective.json
- .bandit/policy/agent-observability.json
- docs/templates/agent-observability.md
- src/state/agent-observability.ts
- src/commands/agent-observability.ts
- src/cli.ts
- src/commands/validate.ts
- test/agent-observability.test.mjs
- test/validate.test.mjs
- test/cockpit-status.test.mjs
- test/event-driven-wake-scheduler.test.mjs
- .bandit/bootstrap-gaps.json
- .bandit/events.jsonl
- docs/roadmap/CURRENT_CONTEXT.md
- docs/roadmap/ROADMAP.md
- STATUS.md

## Required Evidence

- docs/work/BANDIT-053/brief.md
- docs/work/BANDIT-053/red-evidence.md
- docs/work/BANDIT-053/implementation-evidence.md
- docs/work/BANDIT-053/coderabbit-review.md
- docs/work/BANDIT-053/local-qwen-review.md
- docs/work/BANDIT-053/review-evidence.md
- docs/work/BANDIT-053/landing-verdict.md
- docs/work/BANDIT-053/landing-action.md
- docs/work/BANDIT-053/retrospective.md

## Operator Input Status

No operator-owned input is required before creating this bootstrap-gap chore or writing RED evidence. Repo artifacts identify the queued gap, source artifacts, accepted first-class trace boundary, current Stage Rubric requirements, Clean-Code authority, canonical-artifact authority boundary, Claim Authority boundary, Git Mutation Serializer boundary, Event-Driven Wake Scheduler boundary, Input Quarantine Gate, Layered Risk Classification, Supply-Chain Gate, Operator Fail-Closed Boundary, and Codex PM boundary that observability trace mechanics are routine technical decisions when repo evidence and policy are sufficient. Halt only if implementation would change product direction, UAT policy, workflow policy beyond enforcing the accepted agent observability trace gap, business tradeoffs, explicit cost/risk posture, external hosted observability setup, paid reviewer spend approval, paid reviewer routing, recurring cost policy, live routing, claim authority, worktree lifecycle authority, installed global skill contents, dependency or lockfile policy, merge/push/deploy authority, or broader workflow scope.
