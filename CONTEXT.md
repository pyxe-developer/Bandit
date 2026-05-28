# Bandit

Bandit defines a repo-native trust layer for AI-authored development workflows, with a learning loop for operator-reviewed workflow trials. This glossary keeps the product language precise while preserving the decisions and context that led from Sourmash to this fresh repository.

Sourmash is source material, evidence archive, terminology history, and prior-art context. It is not Bandit's planning authority. Bandit owns the current implementation direction.

## Language

**Trust Layer**:
A project-portable contract that constrains, observes, and verifies AI development work.
_Avoid_: task tracker, generic agent runner

**Cooperative Workflow Safety Claim**:
The Trust Layer scope that Bandit can assert for self-owned or policy-trusted development workflows: reducing operator slips, agent drift, stale approvals, missing review, workflow forgetfulness, and untrusted-input confusion without claiming adversarial security against compromised credentials, malicious maintainers, or forged repository history.
_Avoid_: adversarial security claim, hostile-repo guarantee, compromised-credential defense

**Untrusted Input Posture**:
The required Trust Layer stance that release-authorized agents must treat external contributor text, issue text, PR text, review text, dependency documentation, and generated instructions as untrusted unless policy marks the source trusted.
_Avoid_: cooperative-only security, prompt text as authority, hostile-repo security blanket

**Data-Only External Input**:
External contributor text, issue or PR metadata, review comments, dependency documentation, fetched third-party content, generated instructions, or similar untrusted content admitted only as quoted data for extraction, summarization, or evidence, not as instructions an agent may follow.
_Avoid_: prompt text as command, hidden system instruction, contributor-controlled agent behavior

**Input Quarantine Boundary**:
The structural boundary that keeps Data-Only External Input separated from release-authorized agent instructions, tool permissions, routing decisions, and landing authority until a Trusted Source Gate explicitly upgrades the source.
_Avoid_: reviewer-only mitigation, raw issue context dump, trusted-by-default PR text

**Trusted Source Gate**:
A policy and evidence gate that marks a source, artifact, or content class as trusted for a specific release-authorized purpose, with scope, owner, source identity, allowed uses, expiry or freshness rule, and revocation path.
_Avoid_: blanket trust, source reputation by vibes, permanent content upgrade

**Trusted Local Repo Mode**:
A scoped operating mode for self-owned repositories where Bandit may assume repo-local content is trusted until external contributor input or fetched third-party content enters a release-authorized path.
_Avoid_: universal trust, public-repo mode, security waiver

**Supply-Chain Sensitive Surface**:
A change surface that can alter what code, tools, prompts, actions, or executable dependencies enter the repo or agent runtime.
_Avoid_: normal implementation file, harmless package churn, broad malicious-repo claim

**Supply-Chain Gate**:
A pre-landing trust-layer gate for Supply-Chain Sensitive Surfaces that requires explicit evidence before the Landing Agent may treat the change as landable.
_Avoid_: broad security proof, optional dependency note, auto-land waiver

**Layered Risk Classification Gate**:
A pre-landing gate that classifies work using hard exclusions, blast-radius signals, static-analysis signals, source trust, supply-chain state, and smell triggers before deciding review depth, operator supervision, or auto-landing eligibility.
_Avoid_: smell-list-only safety, keyword-only escalation, optimistic auto-land

**Bounded Compensatory Trust Boundary**:
A Trust Layer posture where stronger independent evidence may reduce friction inside an already eligible risk band, but cannot move material-risk work or Never Auto-Landable Surfaces into Auto-Landing Scope.
_Avoid_: evidence bypass, reviewer-waived material risk, green-to-auto-land escalation

**Asymmetric Boundary Movement**:
The governance rule that landing autonomy may contract fail-closed on escape-threshold breach, unresolved attribution, or evidence-freshness failure, while autonomy expansion requires a Workflow Trial and operator-reviewed Improvement Decision.
_Avoid_: automatic loosening, symmetric ratchet, silent policy expansion

**Boundary Contour**:
The versioned risk-by-evidence policy shape that maps risk tier and Evidence Strength Tier to a Landing Autonomy Level under the Bounded Compensatory Trust Boundary.
_Avoid_: ad hoc override, hidden threshold, vendor-owned policy

**Initial Conservative Boundary Contour**:
The starting Boundary Contour that grants Auto-Landing Scope only to Trivial Risk Work with fresh independent evidence, grants Notify-And-Revert Landing only to Low-Reversible Risk Work with fresh independent evidence and a rollback path, and caps Material-Risk Work at Operator Supervision.
_Avoid_: data-free expansion, premature autonomy, inferred safe class

**Bandit-Owned Boundary Logic**:
The canonical workflow authority for Boundary Prediction Records, Escape Candidate classification, Confirmed Boundary Escape decisions, Boundary Contour changes, and Asymmetric Boundary Movement.
_Avoid_: outsourced escape decision, telemetry vendor as policy, gateway-owned contour

**Trivial Risk Work**:
Non-behavioral, evidence-only, or metadata-only work with negligible blast radius and no sensitive surface.
_Avoid_: small-looking behavior change, unreviewed policy change, hidden product impact

**Low-Reversible Risk Work**:
Bounded low-risk work with a clear rollback path, no sensitive surface, and no material product, workflow-authority, state, or user-facing impact.
_Avoid_: no-rollback auto-land, broad chore, sensitive-surface exception

**Material-Risk Work**:
Work with behavior, policy, workflow-authority, durable-state, user-facing, product, cost, or operational impact that requires Operator Supervision before landing authority can be granted.
_Avoid_: moderate auto-land, evidence bypass, routine chore framing

**Never Auto-Landable Surface**:
A change surface that cannot enter Auto-Landing Scope regardless of passing local tests or reviewer agreement. Initial examples include authentication, sessions, authorization, payment, billing, refunds, production data or schema migrations, secrets, credentials, CI or release workflow, dependency or fetched-prompt execution paths, privacy, telemetry, export, destructive operations, and external side-effecting automation.
_Avoid_: reviewer-waived auto-land, small-change exception, hidden material-risk landing

**Blast-Radius Signal**:
A structured risk input based on files touched, code ownership, import graph or dependency reach, runtime path, data access, external side effects, migration or deploy scope, and user or product impact.
_Avoid_: line-count-only risk, keyword-only smell, human intuition only

**Static Analysis Risk Signal**:
A machine-produced risk input from SAST, SCA, secrets scanning, IaC scanning, lint, type, or security tools that can raise review depth or block auto-landing without requiring smell-list concurrence.
_Avoid_: optional warning, reviewer substitute, greenwashed auto-land

**Workflow Learning Loop**:
The evidence-backed process that turns retrospectives, cross-model tension, review outcomes, incidents, and smell triggers into operator-reviewed workflow trials or explicit no-action decisions.
_Avoid_: statistical proof engine, retrospective theater, generic analytics dashboard

**Workflow Trial**:
A bounded change to Bandit's delivery workflow that records its rationale, expected effect, predeclared decision criteria, metric, baseline, uncertainty, Minimum Detectable Effect Context, evaluation window, Trial Re-Evaluation Window, and later keep, revise, revert, or double-down decision.
_Avoid_: causal experiment, permanent policy by inertia, dashboard metric target

**Predeclared Trial Decision Criteria**:
The before-the-run criteria that state what evidence would support keep, revise, revert, or double-down for a Workflow Trial.
_Avoid_: post-hoc threshold, HARKing, metric-shopping

**Minimum Detectable Effect Context**:
The explicit uncertainty note for a Workflow Trial that states the smallest effect the current sample, evidence window, or observation method can plausibly distinguish from noise.
_Avoid_: false precision, single-operator statistical proof, confident weak-signal claim

**Trial Re-Evaluation Window**:
The later check required after an Improvement Decision to confirm the workflow change did not create proxy gaming, hidden regressions, or reward-hacking side effects before it becomes or remains policy.
_Avoid_: one-and-done adoption, policy by inertia, unchecked proxy optimization

**True Agent**:
A harness-managed actor with bidirectional agent-to-agent communication, scoped permissions, controlled context, and observable lifecycle.
_Avoid_: subprocess prompt, one-shot reviewer, structured-output command

**Process Adapter**:
A compatibility bridge that invokes a model through a CLI or subprocess without making it a true agent.
_Avoid_: agent, subagent

**Bootstrap Orchestration Boundary**:
The bootstrap constraint that Codex can coordinate cross-model work only through Process Adapters, repo-native artifacts, and after-the-fact gates; it cannot provide True Agent behavior for other model sessions.
_Avoid_: true cross-model orchestration, live harness control plane, agent intercom

**Harness**:
The runtime that manages true agents, communication, permissions, context, and lifecycle events.
_Avoid_: CLI wrapper, script runner

**Harness Candidate**:
A runtime being evaluated for hosting the Bandit trust layer without locking Bandit to one model provider.
_Avoid_: preferred vendor, default CLI

**Provider-Agnostic Harness**:
A harness that can configure agents across multiple model providers through explicit per-agent settings.
_Avoid_: single-provider harness, proprietary lock-in

**Runtime Portability Gate**:
A hard exclusion rule requiring harness candidates to avoid proprietary lock-in and support provider-agnostic agent configuration.
_Avoid_: preference, nice-to-have

**Harness Spike**:
A prototype plan that tests harness candidates against sourmash gates using observed behavior.
_Avoid_: decision memo, architecture essay

**Harness Spike Plan**:
A source-material documentation artifact under `docs/spikes/` that defines evidence-producing harness evaluation work.
_Avoid_: ADR, decision record

**Fresh Harness Repo**:
Bandit: the new implementation home for the next trust-layer runtime, using Sourmash as source material rather than continuing the subprocess-first Sourmash architecture in place.
_Avoid_: Sourmash rewrite, fork-and-patch continuation

**CLI Authority**:
The rule that workflow state changes and enforcement decisions are performed by the command-line runtime, not by the web interface.
_Avoid_: UI-owned enforcement, dashboard-as-source-of-truth

**Workflow Cockpit**:
A lean web application that visualizes repo-backed workflow and coordination state and triggers approved CLI commands without becoming the enforcement layer.
_Avoid_: full agent IDE, autonomous factory, separate project tracker

**Attention-First Workflow Cockpit**:
A Workflow Cockpit UX framing that leads with operator-owned attention, blocked or stale workflow state, active work, and safe next actions, while keeping gate, evidence, coordination, and source-path detail available one level down.
_Avoid_: generic dashboard, attention inbox artifact, internal agent console

**Attention Category**:
A cockpit grouping based on why the operator or Codex PM should look at work now, such as required input, blocked state, active work, review readiness, landing readiness, or improvement follow-up.
_Avoid_: workflow phase, generic status label, priority guess

**Repo-Native Workflow State**:
Versioned project files that are the canonical record for PRDs, slices, chores, runs, reviews, lessons, follow-ups, approvals, UAT, bootstrap gaps, and improvement decisions.
_Avoid_: dashboard database truth, hidden app state

**Coordination Primitive**:
A repo-native contract that makes work-item position, next action, actor handoff, and blocked state explicit for agents and automation.
_Avoid_: chat context, GitHub issue thread, implied workflow state

**SDLC Microstep State Machine**:
A durable sequence of small workflow states that governs one work item from brief through closeout.
_Avoid_: artifact pile, coarse SDLC phase, checklist-only workflow

**Shared Core State Machine**:
The common SDLC microstep sequence used by both slices and chores before work-type-specific extensions apply.
_Avoid_: separate workflow per work type, duplicated stage model, feature-only lifecycle

**Typed State Extension**:
A work-type-specific addition to the shared core state machine, such as feature UAT or chore-specific no-action disposition.
_Avoid_: forked lifecycle, hidden exception, ad hoc state

**Retrospective Recorded State**:
A workflow state proving the work item's retrospective artifact exists.
_Avoid_: closed, done, all lessons dispositioned

**Closed Work Item**:
A work item whose required artifacts, dispositions, context updates, and follow-up routing are complete.
_Avoid_: landed, retro written, inactive

**Step Transition Ledger**:
The canonical repo-native record of a work item's workflow-state transitions.
_Avoid_: derived status only, prose progress note, checklist checkbox

**Append-Only Transition Log**:
A Step Transition Ledger shape where every workflow-state change is recorded as a new immutable transition entry.
_Avoid_: current-state-only file, overwritten progress, mutable audit trail

**Per-Work-Item Transition Log**:
An append-only transition log scoped to one work item.
_Avoid_: repo-wide canonical ledger, shared hot file, global mutable queue

**Per-Work-Item Coordination Log**:
A unified append-only work-item log containing typed workflow transitions and actor coordination events.
_Avoid_: split timeline, actor-only source of truth, workflow-only audit trail

**Canonical Coordination History**:
The append-only coordination history that records accepted workflow transitions and accepted coordination events for a work item.
_Avoid_: current-state cache, in-flight registry, cockpit status, overwriteable summary

**Derived Current State View**:
A rebuildable view of the latest accepted workflow state computed from the append-only transition log.
_Avoid_: canonical state, hidden cache, dashboard truth

**Coordination Projection**:
A rebuildable read model derived from Canonical Coordination History, the Claim Authority Primitive, or both.
_Avoid_: source of truth, direct mutation surface, independent workflow state

**Authoritative In-Flight Registry**:
A repo-native coordination artifact that reports currently claimed or runnable work. For release-authorized parallel writes, it is authoritative only when derived from or protected by the Claim Authority Primitive and reconciled with the relevant Canonical Coordination History.
_Avoid_: advisory dashboard, chat queue, stale status summary

**Work Surface Reservation**:
An exclusive coordination claim over the files, artifacts, or repo resources a work stage may write while it is in flight.
_Avoid_: best-effort note, read-only interest, implied ownership

**Declared Work Surface**:
The files, path patterns, or named repo resources a work item or chore is allowed to write during a claimable stage.
_Avoid_: inferred edit area, unlimited repo access, post-hoc collision check

**Work-Surface Wait-For Graph**:
A repo-native graph of active reservations and claim candidates where an edge means one work item or stage is waiting for a work surface currently held or required by another.
_Avoid_: pairwise-only overlap list, informal dependency guess, chat-level blocked note

**Work-Surface Deadlock**:
A cycle in the Work-Surface Wait-For Graph that would allow two or more claims to wait on each other without a deterministic release, recovery, or rescheduling decision.
_Avoid_: harmless conflict, operator puzzle, retry-until-clear loop

**Single-Claim Heartbeat**:
A recurring automation activation that may claim and start at most one runnable work stage after reconciling coordination state and work surface reservations.
_Avoid_: batch runner, queue drainer, multi-claim activation

**LLM Polling Heartbeat**:
A recurring activation that wakes an LLM primarily to ask whether work exists.
_Avoid_: default scheduler, cheap sweeper, event-driven wake

**Event-Driven Work Trigger**:
A trigger that wakes scheduling or agent work because repo state, CI state, review state, or operator action made work available or changed a blocker.
_Avoid_: polling interval, arbitrary wake, trigger as authority

**Deterministic Work Sweeper**:
A non-LLM process that periodically inspects repo-native coordination state for stale claims, missed triggers, due evaluations, or blocked/unblocked transitions.
_Avoid_: agent judgment, model heartbeat, hidden scheduler authority

**Work Availability Wake Guarantee**:
The scheduling contract that Bandit must wake the appropriate scheduler or agent path when runnable work, recovery work, or newly unblocked work becomes available.
_Avoid_: silent available work, manual babysitting, cost-only no-op suppression

**Work Claim Lease**:
A time-bound exclusive claim over one work stage and its work surface reservation, with renewal required during long-running work, a Fencing Token and Claim Idempotency Key required for release-authorized mutation, and recovery required before clearing expired claims with unmerged changes.
_Avoid_: permanent lock, blind timeout cleanup, chat-owned ownership, permission without fencing

**Claim-First Worktree Start**:
The rule that a session must record an exclusive work claim lease before creating an ephemeral worktree for that stage.
_Avoid_: speculative worktree, claim-after-start, parallel unclaimed setup

**Worktree Bootstrap Contract**:
A repo-native contract that defines how a Bandit-created worktree becomes runnable: allowed copied or linked files, required setup commands, validation command, environment-variable references, secret-handling boundary, expected runtime dependencies, and failure evidence.
_Avoid_: assume main worktree environment, copy secrets by convention, runnable because worktree exists

**Runnable Worktree**:
A claim-owned worktree whose Claim-Owned Worktree Lock and Worktree Bootstrap Contract validation have both succeeded.
_Avoid_: locked but unbootstrapped worktree, shell happens to work locally, hidden setup debt

**Git Mutation Serializer**:
A CLI-owned single-writer guard for shared `.git` plumbing mutations that can contend across parallel worktrees, such as worktree add, worktree remove, worktree prune, worktree lock or unlock, branch/ref maintenance outside the claim CAS boundary, and packed-refs-affecting operations.
_Avoid_: every agent runs git plumbing directly, best-effort retry, hidden daemon authority

**Claim-Owned Worktree Lock**:
A `git worktree lock` state applied through the Git Mutation Serializer immediately after a claim-owned worktree is created, with a stable reason that names the Bandit claim ID, Work Item ID, and stage. It is removed only by the Repo PM Coordinator after Work Item PM Orchestrator handoff verification and cleanup.
_Avoid_: unlocked claimed worktree, lock reason without claim identity, worker-owned unlock, fencing token in lock reason

**Claim Safety Invariant**:
A property that must always hold across claim authority, projections, append-only coordination history, work-surface reservations, and claim-gated side-effect envelopes. Examples include at most one active claim for a declared work surface, stale fencing tokens cannot mutate state, same-key same-input retries cannot duplicate side effects, same-key different-input retries are refused, work-surface wait-for cycles cannot be claimable, and failed worktree locking cannot leave a false active claim.
_Avoid_: example-only race proof, informal concurrency confidence, hand-picked duplicate-claim case

**Fault-Injecting Claim Simulation**:
A deterministic or property-style test harness that explores Claim Operation interleavings and injected failures such as pauses, stale reads, CAS mismatch, stale fencing tokens, idempotency replay or conflict, projection drift, history disagreement, wait-for cycles, serializer contention, and worktree lock failure.
_Avoid_: one duplicate-claim unit test, happy-path retry test, manual race demonstration

**Atomic Work Claim**:
A CLI-owned claim operation that reconciles current work-item state and in-flight reservations, then either records one exclusive work claim lease through a Compare-And-Swap Claim or fails without starting work.
_Avoid_: manual registry edit, advisory claim, best-effort lock, file-only check-then-write

**Claim Authority Primitive**:
The mechanism that grants or refuses exclusive writable claim authority. It must provide compare-and-swap semantics before any Parallel Writable Workstream can be release-authorized. The first approved backend is the Git Refs Claim Authority Backend.
_Avoid_: convention, plain status file, after-the-fact conflict detector

**Git Refs Claim Authority Backend**:
The repo-native backend for the first Claim Authority Primitive: active claim records live in a `refs/bandit/*` namespace and state changes use `git update-ref --stdin` compare-and-swap transactions as the writer authority boundary.
_Avoid_: file-only lock, JSON registry authority, hidden database lock, check-then-write claim

**Claim Projection Artifact**:
A human-readable `.bandit` file or cockpit/read-model artifact derived from the Git Refs Claim Authority Backend, Canonical Coordination History, or both. It can explain active claims, but it cannot grant, renew, release, or recover claims.
_Avoid_: lock source, manual claim edit, projection-as-authority

**Compare-And-Swap Claim**:
A claim operation that succeeds only when the observed claim state still matches the expected claim state at the authority boundary.
_Avoid_: check-then-write claim, optimistic prose, next-operation conflict detection

**Fencing Token**:
A monotonic token issued with a work claim lease and required on state-changing or external side-effecting operations so stale leaseholders can be rejected.
_Avoid_: lease timestamp, best-effort renewal, stale-agent honor system

**Claim Idempotency Key**:
A stable operation identity supplied with a Claim Operation or Claim-Gated Side Effect so a retry or rerun can be recognized as the same intended action instead of duplicated.
_Avoid_: random retry token, timestamp-only uniqueness, best-effort duplicate check

**Idempotent Claim Operation**:
A Claim Operation that requires the current Fencing Token after token issuance plus a Claim Idempotency Key, treats a same-key same-input retry as the same intended operation, and refuses same-key conflicting input.
_Avoid_: duplicate claim mutation, replay without identity, key reuse with changed payload

**Claim Operation**:
A CLI-authorized action that creates, renews, releases, blocks, completes, or recovers a Work Claim Lease.
_Avoid_: manual claim edit, chat approval, tool call without authority

**Claim-Gated Side Effect**:
An external side effect performed under a Work Claim Lease. It requires the current Fencing Token and Claim Idempotency Key so stale leaseholders are rejected and retries cannot duplicate the effect.
_Avoid_: side effect by convention, unfenced tool mutation, retryable external write without idempotency

**One Active Claim Per Work Item**:
The v0 coordination rule that a work item may have no more than one active work claim lease at a time, even when multiple stages appear theoretically available.
_Avoid_: same-item parallel stages, split ownership inside one work item, evidence race

**Post-Bootstrap Parallel Workstreams**:
Bandit's future ability to run multiple non-overlapping work items at the same time after the active bootstrap-gap lane is resolved, blocked, or explicitly dispositioned.
_Avoid_: bootstrap shortcut, one-gap-at-a-time bypass, uncontrolled concurrency

**Parallel Writable Workstream**:
A workstream that can mutate repo state, worktrees, workflow artifacts, or external side effects while another workstream is active.
_Avoid_: read-only inspection, advisory planning lane, status-only heartbeat

**Parallel Write Authorization Gate**:
The release gate that keeps Parallel Writable Workstreams disabled until claim authority, fencing-token enforcement, claim idempotency, stale-agent rejection, work-surface deadlock refusal, Git mutation serialization, and Claim Safety Invariants are proven through focused tests plus Fault-Injecting Claim Simulation.
_Avoid_: scheduler preference, operator reminder, non-binding warning, example-only validation

**Agent Coordination Contract**:
A repo-native protocol for agents to claim, hand off, block, complete, request repair, and resume bounded work.
_Avoid_: informal delegation, chat-only handoff, human task board

**Agent Coordination Event**:
A repo-native actor action recorded against a work item and, when relevant, a current workflow state.
_Avoid_: workflow state transition, chat update, unstructured status note

**Accepted Block**:
A validated coordination state meaning a work item cannot legally advance until the recorded resume condition is satisfied.
_Avoid_: actor opinion, warning, advisory concern

**Block Event**:
An Agent Coordination Event where an actor reports a blocking condition, owner, required input, and resume condition.
_Avoid_: accepted workflow state, vague concern, hidden blocker

**Safe Trigger Point**:
A CLI-confirmed workflow transition where automation may observe or begin a bounded follow-up action.
_Avoid_: webhook as authority, arbitrary event trigger, UI-owned trigger

**Trigger Signal**:
A non-authoritative coordination event that may prompt inspection but cannot start automation until reconciled into a Safe Trigger Point.
_Avoid_: safe trigger point, automation authority, accepted workflow state

**Runtime-Agnostic Coordination**:
The rule that Bandit coordinates bounded work steps without owning the runtime that executes those steps.
_Avoid_: VM-first architecture, swarm platform, provider-specific orchestration

**Bandit-Governed Repository**:
A repository whose agentic workflow is coordinated by Bandit's shared contracts, gates, and evidence model.
_Avoid_: bespoke repo workflow, local convention, one-off automation

**Self-Governing Repository**:
A Bandit-governed repository that retains canonical authority over its own workflow state and evidence.
_Avoid_: centrally owned repo state, external source of truth, dashboard-controlled workflow

**Cross-Repo Coordination**:
Bandit's ability to coordinate consistent workflow states and safe trigger points across multiple Bandit-governed repositories.
_Avoid_: fleet runtime, shared dashboard only, multi-repo script

**State Index**:
A rebuildable local cache, likely SQLite, that helps the Workflow Cockpit query and filter Repo-Native Workflow State without becoming canonical.
_Avoid_: source of truth, primary workflow database

**Repo PM Coordinator**:
The durable repo-level coordination role that supervises Work Item PM Orchestrators, reconciles claims, dependency graph state, queues, stale or blocked work, and operator escalations, and controls worker-heartbeat pause or resume behavior without becoming an implementation worker or claiming work.
_Avoid_: operator liaison, worker heartbeat, portfolio chat

**Role Authority Boundary**:
The rule that each agent acts only within its assigned role authority for the current step. A role may hand off, request, propose, verify, or trigger another role's workflow, but it must not perform another role's governed action itself.
_Avoid_: convenience escalation, borrowed authority, same-session role blur

**Bootstrap Model-Family Separation**:
The bootstrap rule that Codex authors Stage 2 RED tests, Claude authors Stage 3 implementation without any test-edit authority, and verification escalation returns to Codex because Claude authored the code.
_Avoid_: same-family RED/GREEN, Claude self-escalation, Claude test edits, Codex implementation after Codex-authored tests

**Test Ownership Boundary**:
The permanent rule that a Writer must never create, edit, delete, regenerate, format, or mechanically adjust tests, test helpers, fixtures, RED evidence, or acceptance mappings for the Work Item it implements; any violation invalidates the Stage 3 attempt.
_Avoid_: writer-editable tests, mechanical test fix, implementation-owned test update

**Work Item**:
The durable repo-native execution unit Bandit manages through coordination state, lifecycle evidence, review, landing, retrospective, and closeout. Slices and Chores are Work Item types.
_Avoid_: tracker task, agent session, pull request

**In-Progress Work Item**:
A Work Item with an existing Work Item PM Orchestrator context and prior non-terminal lifecycle evidence, such as an active claim, blocked stage, cleanup-ready handoff, review-feedback loop, or equivalent non-terminal state. A newly materialized queued Work Item is not in progress.
_Avoid_: newly queued work, priority hint, claimable item

**Claimability Report**:
A repo-native explanation for whether a queued Work Item can be claimed now. When claimability is blocked, it lists all known blockers and names a deterministic primary blocker. Initial blocker values include `missing_policy_approval`, `missing_product_or_operator_approval`, `recovery_required_claim`, `expired_claim`, `conflicting_active_claim`, `work_surface_deadlock`, `dependency`, `invalid_scope_or_acceptance`, and `missing_declared_write_surface`. Primary blocker priority follows that order. The Repo PM Coordinator may mechanically repair blockers only when the fix is derivable from already approved artifacts, every automatic repair must be one atomic CLI operation that applies the repair, appends the immutable transition-history entry, assigns and returns the entry ID, and recomputes claimability once, or applies nothing. A repair request must include the observed current state so the CLI can fail closed if repo state changed before apply. `recovery_required_claim` is not mechanically repairable.
_Avoid_: separate queue, hidden scheduler judgment, informal blocker note

**Expired Claim Release Evidence**:
The required evidence packet before the Repo PM Coordinator may mechanically release an `expired_claim`: claim record, worktree path and branch, clean worktree status, no untracked or staged changes, no commits ahead of the integration base unless already transferred, and policy allowing release. The generated human-readable release rationale belongs in the mechanical-repair transition-history entry. Missing or ambiguous evidence converts the blocker to `recovery_required_claim`.
_Avoid_: blind timeout cleanup, assumed clean worktree, destructive stale release

**Work Item Proposal**:
A proposed unit of work that records source, rationale, suggested Work Item type, proposed dependency edges, scope, risk, and product-scope status before the Repo PM Coordinator triages it. It is not claimable work; `accepted_to_queue` records consensus for queueing, while `accepted_deferred` remains a non-claimable proposal until later promotion and materialization.
_Avoid_: active work item, hidden follow-up, informal idea

**Work Intake Ledger**:
The single repo-native triage surface for Work Item Proposals from any source, including chores, retrospective improvement candidates, feature ideas, reviewer follow-ups, operator requests, spawned work, deferred cleanup, and product questions. It exposes each entry's current state while preserving decision history. Intake entries are not claimable until the Repo PM Coordinator materializes an `accepted_to_queue` decision into a real Work Item and the Work Item passes claimability checks.
_Avoid_: follow-up file, chore-only backlog, hidden idea bucket

**Work Intake Triage Skill**:
A guided operator-review workflow that ranks Work Intake Ledger entries, walks the operator through selected entries one at a time, presents the opportunity and evidence, asks clarifying questions, and records consensus outcomes without turning proposed work into claimable work by default. It is invoked for any operator-facing request to review the Work Intake Ledger. It prioritizes low-effort/high-impact opportunities, triages new or untriaged entries first, and then offers accepted-deferred entries for optional revisit when earlier work changes their effort or impact. Its ranking is advisory; the operator may override the suggested order. It may record lightweight override learning signals when available, but those signals are not required for triage to proceed.
_Avoid_: batch backlog grooming, silent auto-acceptance, freeform chat triage

**Work Item PM Orchestrator**:
A durable orchestration role attached to one Work Item that preserves lifecycle context, routes specialized agents, maintains evidence continuity, records blockers, writes only its owned orchestration surfaces, proposes Work Item Proposals, and drives the Work Item toward closed state without becoming an implementation worker, reviewer, landing authority, claim recovery authority, or repo-level queue owner.
_Avoid_: coder, landing agent, live-session memory owner

**Work Item A2A Channel**:
A bidirectional agent-to-agent communication channel scoped to one Work Item that lets specialized agents ask the Work Item PM Orchestrator for clarification, blocker escalation, dependency checks, scope checks, review-finding disposition, or stop/split/routing decisions. Messages are interaction records, not canonical workflow state unless reconciled into repo-native artifacts by CLI Authority or the owning role.
_Avoid_: global agent chat, hidden session authority, tracker thread

**Work Item Dependency Graph**:
The explicit relationship model that records which Work Items must precede, block, unblock, or spawn other Work Items while preserving each Work Item as the durable managed unit.
_Avoid_: external tracker hierarchy, ad hoc priority note, parallel session queue

**Typed Dependency Edge**:
A directed relationship between Work Items whose type determines whether it affects claimability, provenance, replacement, or context. The initial edge types are blocks, spawns, supersedes, and informs.
_Avoid_: generic related link, implicit blocker, hidden parent-child meaning

**Feature PRD**:
A planning artifact that captures the product problem, solution, user stories, implementation decisions, testing decisions, and explicit out-of-scope boundaries before implementation is split into work.
_Avoid_: ticket, vague feature request, implementation prompt

**Slice**:
A bounded implementation unit for product or behavior-changing work that should move through planning, TDD, quality gates, review, and UAT.
_Avoid_: generic task, chore

**Chore**:
A bounded non-product work unit for trust-layer maintenance, tooling, documentation, state repair, evidence refresh, cleanup, or continuous-improvement work.
_Avoid_: slice, feature, backlog junk drawer

**Tagged Chore Ledger**:
A chore-only queue concept superseded by the Work Intake Ledger for proposal triage and by Work Item metadata for accepted chores.
_Avoid_: separate chore logs, hidden follow-up bucket, untyped maintenance backlog

**Bootstrap Gap**:
A missing final workflow capability identified while Bandit is still bootstrapping. A gap may be recorded only to avoid pretending a gate ran, and it must become executable gap-resolution work at this stage of the project unless an operator-owned product or policy decision blocks that work. After the current active slice lands, open bootstrap gaps are addressed one at a time before unrelated new work proceeds.
_Avoid_: deferred forever, passive known issue, hidden missing gate

**Bootstrap-Gap Chore**:
A chore whose purpose is to convert one Bootstrap Gap into a durable artifact, CLI command, validator, agent contract, or explicit no-action policy decision.
_Avoid_: feature slice, vague cleanup, future note

**Heartbeat Chore Agent**:
A recurring automation that can inspect eligible chores and run approved low-risk maintenance workflows under CLI Authority.
_Avoid_: autonomous product implementer, unattended feature builder

**Landing Agent**:
A CLI-authorized release worker that evaluates PR readiness, interprets mechanical gates, repairs safe release issues, and performs approved landing mechanics without requiring the operator to make code-safety or release-mechanics judgments.
_Avoid_: human rubber-stamp, direct-main chore runner, operator-as-release-engineer

**Landing Verdict**:
A recorded decision that classifies a PR as safe-to-land, blocked, needs-repair, or requires operator approval, backed by CI, tests, CodeRabbit, adversarial review, review freshness, PR accuracy, policy evidence, and any Boundary Prediction Record that authorized the landing.
_Avoid_: warning dump, looks-good summary, user gut check

**Boundary Prediction Record**:
The standalone repo-native falsifiable Trust Layer claim referenced by a Landing Verdict: risk tier, Evidence Strength Tier, Landing Autonomy Level, Review Subject Hash, relied-on evidence artifacts, authorizing boundary cell, and predicted safety outcome.
_Avoid_: post-hoc rationale, confidence prose, unjoinable landing note

**Escape Candidate**:
A later corrective signal, such as a revert, hotfix, downstream failure, incident, post-land human flag, or repair, that may indicate a Boundary Prediction Record was wrong but is not yet counted in boundary metrics.
_Avoid_: every follow-up edit, normal iteration, unlinked defect count

**Confirmed Boundary Escape**:
An Escape Candidate with a recorded causal link and rationale tying the corrective signal back to the Boundary Prediction Record that should have caught or prevented the defect.
_Avoid_: unattributed escaped defect, suspicion as metric, post-hoc blame

**Pre-Landing Review Loop**:
A CLI-driven quality loop that runs required external and cross-model review gates before the Landing Agent can produce a safe-to-land verdict.
_Avoid_: post-merge cleanup, optional advisory scan

**Non-Blocking Review Finding**:
A real reviewer finding that is safe to defer only after Codex PM records rationale and routes it to a tagged chore, improvement chore, or explicit no-action decision. It must not be treated as a landing blocker, and it must not weaken blocker-level review, stale-evidence, or request-changes gates.
_Avoid_: nitpick blocker, recursive review churn, ignored warning

**Stage 4 Evidence-Head Semantics**:
The contract that distinguishes historical review artifacts from current landing-gate evidence during iterative review and disposition loops. The contract must keep actual source-code drift fail-closed without requiring every historical review artifact to share one final source head.
_Avoid_: recursive rerun loop, stale-evidence waiver, reviewer-by-inertia

**Review Subject Hash**:
A deterministic hash of the review-relevant subject for a work item: implementation source, tests, policy, reviewer profiles, governance files, and selected work-item contract artifacts. It separates "what was reviewed" from "which commit contains terminal evidence," so evidence-only commits do not force repeated Stage 4 review loops while source, test, policy, and reviewer-input changes still fail closed.
_Avoid_: raw HEAD as review identity, evidence artifact commit as source freshness

**Hash-Based Evidence Freshness**:
The Stage 4 freshness method introduced by `BANDIT-019`: when review evidence records `review_subject_hash`, landing readiness compares the current review-subject hash instead of treating every raw git HEAD mismatch as stale. Historical artifacts without `review_subject_hash` keep the previous Stage 4 fallback behavior.
_Avoid_: current-head refresh loop, self-invalidating evidence write

**Evidence Independence**:
The degree to which evidence was produced by a source, timing, model family, toolchain, or artifact path with failure modes decorrelated from the authoring path, without relying on the author's rationale.
_Avoid_: duplicate confirmation, same-model self-review, rationale echo

**Evidence Strength Tier**:
The Trust Layer ordering of evidence by independence, freshness, and scope fit; author assertion and author-controlled checks are weaker than pre-existing red/green tests, static checks, independent review or tool evidence, decorrelated adversarial review, and operator-supervised or proven same-class track record.
_Avoid_: artifact count, stale proof, unrelated green check

**CodeRabbit Pre-Landing Loop**:
A CLI-driven CodeRabbit cycle that requests or reads review, repairs actionable findings, waits for reruns when needed, and records the final CodeRabbit state before landing.
_Avoid_: GitHub-only waiting, after-merge review, unchecked queue delay

**Adversarial Review Gate**:
A required pre-landing cross-model review for every PR, using a configurable reviewer profile to look for failures, edge cases, and trust-boundary problems.
_Avoid_: same-model self-review, optional critique, compliments

**Adversarial Reviewer Profile**:
The configured model, prompt, tools, cost budget, timeout, and blocking policy for the Adversarial Review Gate.
_Avoid_: hard-coded model choice, hidden prompt, permanent default

**Load-Bearing Agent Component**:
A core agent-architecture surface whose quality materially affects task performance, reviewer quality, cost, and workflow safety.
_Avoid_: implementation detail, incidental prompt, optional optimization

**Goal Definition Component**:
The load-bearing agent component that states the intended outcome, success boundary, and stopping condition for a task.
_Avoid_: vague task, motivational prompt, hidden objective

**Perception And Input Component**:
The load-bearing agent component that determines which evidence, files, and external signals are admitted for agent use.
_Avoid_: raw context dump, accidental input, untrusted text as instruction

**Context Component**:
The load-bearing agent component that shapes the active working packet, framing, constraints, and source hierarchy an agent uses for a task.
_Avoid_: long-term memory, raw input set, chat transcript

**Focused Session Context Packet**:
A CLI-derived task-scoped working packet that gives an agent only the role rules, current Work Item or gap, current stage, exact next action, allowed and forbidden actions, required evidence paths, blocker state, and source hierarchy needed for one activation, with pointers to deeper history instead of replaying it.
_Avoid_: full roadmap history, whole-project replay, glossary dump, chat transcript substitute

**Memory Component**:
The load-bearing agent component that preserves relevant prior state, decisions, and evidence across tasks without overriding current repo authority.
_Avoid_: chat history as truth, stale recollection, hidden state

**Reasoning And Planning Component**:
The load-bearing agent component that decomposes work, chooses approach, evaluates tradeoffs, and decides when to ask for input.
_Avoid_: chain-of-thought artifact, vibes, unbounded planning

**Tool Execution Component**:
The load-bearing agent component that governs which actions an agent may take, with what permissions, preconditions, and evidence.
_Avoid_: unrestricted tool use, manual button pushing, implicit authority

**Orchestration And Coordination Component**:
The load-bearing agent component that governs role boundaries, handoffs, claims, sequencing, and conflict avoidance across agents.
_Avoid_: chat-only coordination, role blur, hidden scheduler

**Feedback And Observability Component**:
The load-bearing agent component that captures outcomes, traces, costs, failures, reviewer disagreement, and learning signals.
_Avoid_: retrospective theater, invisible costs, untraceable agent behavior

**OTel-Compatible Agent Trace**:
A structured, vendor-portable runtime trace for one agent session or workflow activation, covering wakeups, claims, tool calls, reviewer runs, model calls, token spend, failures, retries, and outcomes.
_Avoid_: canonical workflow state, chat transcript, retrospective replacement

**Agent Operation Span**:
A bounded observability record for one operation inside an agent trace, such as a claim operation, tool call, reviewer run, wake decision, or model call.
_Avoid_: work-item artifact, workflow verdict, hidden log line

**Attribution Join Key**:
The shared human-readable identity tuple carried across model calls, tool calls, landing decisions, and escape evidence so outcomes can be traced to actor identity, model version, profile hash, work item, Review Subject Hash, evidence artifacts, touched surface, Boundary Prediction Record, and authorizing boundary cell. A derived hash may index the tuple, but does not replace it as canonical evidence.
_Avoid_: log correlation by timestamp, opaque-only ID, unjoinable telemetry, anonymous evidence

**Model-Call Boundary Adapter**:
A swappable implementation of the model-call capture and cost-control boundary that may be an external gateway, local proxy, wrapper, or future provider integration, provided it emits the Attribution Join Key and preserves repo-reconstructable evidence.
_Avoid_: product dependency, vendor lock-in, uninstrumented sidecar

**Observability Projection**:
A queryable non-canonical view built from agent traces to explain cost, latency, failure patterns, tool friction, and runtime behavior.
_Avoid_: source of truth, approval artifact, hidden authority

**Canonical Workflow Artifact**:
A repo-native artifact that records workflow state, gate evidence, PM disposition, landing verdict, UAT status, or retrospective decisions.
_Avoid_: telemetry span, dashboard cache, memory note

**Evidence SLO**:
An artifact-type-specific freshness contract that defines when evidence is current, stale, missing, expired, derived, or blocked.
_Avoid_: generic confidence badge, vague green status, one freshness rule for all artifacts

**Artifact Freshness Budget**:
The allowed age, source drift, hash drift, provider-state drift, or projection lag for one evidence artifact type before it must be refreshed or marked stale.
_Avoid_: arbitrary timeout, hidden cache age, source-agnostic freshness

**Evidence Trust Signal**:
A cockpit or CLI cue backed by an Evidence SLO that shows artifact type, source, owner, freshness state, and staleness or refresh reason.
_Avoid_: unexplained status chip, confidence theater, decorative badge

**Staleness Reason**:
The explicit reason an Evidence Trust Signal cannot be treated as current, such as source drift, missing hash, expired provider state, stale UAT, outdated landing verdict, missing artifact, or projection lag.
_Avoid_: red badge only, unknown failure, hidden freshness rule

**Structured Improvement Mining**:
A continuous, evidence-backed practice that inspects each work item for workflow improvement signals during execution and retrospective closeout.
_Avoid_: waiting for agents to volunteer suggestions, freeform lesson dump, after-the-fact vibes

**Retrospective Mining Checklist**:
The required Stage 6 checklist that records whether specific agent and workflow signals occurred, their evidence, disposition, and follow-up or no-action decision.
_Avoid_: unstructured retrospective prompt, optional suggestions, checklist without dispositions

**Agent Execution Smell**:
An evidence-backed sign that a Load-Bearing Agent Component made work less safe, clear, cheap, or effective, such as failed tool calls, overreasoning, poor work breakdown, wrong agent scope, tool-use rule pressure, or recurring inefficiency.
_Avoid_: personality critique, vague frustration, isolated harmless typo

**Tool Invocation Friction**:
An Agent Execution Smell where an agent repeatedly struggles to choose, call, or interpret an approved tool or review path, even if the final work eventually succeeds.
_Avoid_: one-off typo, unsupported tool request, private operator workaround

**Load-Bearing Skill**:
A maintained instruction artifact that shapes one or more Load-Bearing Agent Components and must be governed by a Skill Lifecycle Contract before it becomes required stage policy.
_Avoid_: prompt afterthought, optional wrapper, generic checklist

**Skill Lifecycle Contract**:
The first-class governance record for a Load-Bearing Skill: owner, version, changelog, intended stages, required tools, forbidden actions, evaluation packets, and rollback criteria.
_Avoid_: loose prompt snippet, hidden local skill drift, undocumented skill variant

**Agent Component Benchmark**:
An evidence set comparing Load-Bearing Agent Component variants on the same task packets before adopting them as workflow policy.
_Avoid_: vibes-based prompt tuning, one-off instruction tweak, unmeasured architecture change

**Agent Evaluation Harness**:
A repo-native evaluation capability that replays fixed task or review packets against agent profiles, reviewer profiles, skills, models, and load-bearing component variants to produce comparable capability, cost, latency, and failure evidence. Its first supported mode is a Replay-Only Agent Benchmark.
_Avoid_: improvement-chore evaluation, one-off anecdote, self-approval loop

**Replay-Only Agent Benchmark**:
A benchmark-only Agent Evaluation Harness run that uses fixed packets in offline or replay mode and records comparable observations without touching live work, reviewer routing, model routing, skill policy, or cost policy.
_Avoid_: live A/B routing, automatic reviewer policy, production paid-reviewer trial

**Agent Evaluation Packet**:
A fixed input-and-expected-observation bundle used by the Agent Evaluation Harness to compare agents or reviewer profiles on the same work.
_Avoid_: live work item, chat transcript, vague benchmark prompt

**Calibration Packet Set**:
A visible Agent Evaluation Packet set used while developing skills, reviewer prompts, scoring logic, and harness behavior.
_Avoid_: policy-promotion proof, hidden test, final benchmark

**Locked Holdout Packet Set**:
A versioned Agent Evaluation Packet set withheld from skill or reviewer-prompt tuning and used to decide policy promotion, rollback, or reviewer-routing changes.
_Avoid_: visible calibration sample, mutable benchmark, post-hoc pass set

**Gold-Labeled Reviewer Packet**:
An Agent Evaluation Packet for reviewer benchmarking that contains seeded blockers, seeded non-issues, expected observations, and scoring labels known before the reviewer run.
_Avoid_: unlabeled review sample, live PR, raw historical transcript

**Failure-Mode Stratified Packet Set**:
A repo-derived benchmark packet set organized around Bandit's observed workflow failure modes, such as evidence freshness loops, malformed artifacts, CodeRabbit invocation friction, stage capability or skill scope mistakes, supply-chain-sensitive changes, stale UAT or landing evidence, and false-positive review churn.
_Avoid_: generic coding benchmark, random historical sample, unbalanced review set

**Seeded Blocker**:
A deliberately embedded issue that should block landing if a reviewer is performing well.
_Avoid_: nitpick, stylistic preference, ambiguous concern

**Seeded Non-Issue**:
A deliberately safe or acceptable construct used to measure whether a reviewer over-reports false positives.
_Avoid_: hidden blocker, trick prompt, undefined expectation

**Reviewer Benchmark Scorecard**:
The scoring surface for a Reviewer Capability Benchmark. It prioritizes blocker recall over raw finding count and also records actionable precision, useful finding yield, false-positive rate, tool friction, latency, and cost.
_Avoid_: comment volume, model preference, unweighted finding list

**Paid Reviewer Promotion Threshold**:
A predeclared policy threshold that a recurring paid reviewer route must satisfy within a specific Reviewer Promotion Scope before becoming automatic: locked-holdout blocker-recall improvement over Local Qwen, false-positive ceiling, Provider Pricing Evidence-backed expected-cost ceiling, and operator-supervised Spend Class Approval.
_Avoid_: one good comparison run, model prestige, unbounded paid default

**Reviewer Promotion Scope**:
The risk class or Stage Capability Profile a Paid Reviewer Promotion Threshold applies to, such as supply-chain-sensitive changes, architecture changes, evidence-freshness logic, or low-risk chores.
_Avoid_: global model preference, all-PR reviewer default, one-size-fits-all escalation

**Reviewer Capability Benchmark**:
An evidence set comparing Local Qwen, Claude or paid reviewer profiles, and Load-Bearing Agent Component variants on Gold-Labeled Reviewer Packets before reviewer-routing policy changes.
_Avoid_: anecdotal model preference, single-reviewer assumption, architecture-blind escalation

**Provider Pricing Evidence**:
A versioned pricing record for a paid model, reviewer provider, or paid execution path: provider, model or profile, source URL or source artifact, captured date, effective date, freshness or expiry rule, unit prices, expected per-run cost, spend class, and approval owner.
_Avoid_: stale pricing memory, hidden API spend, plan entitlement assumption

**Spend Class Approval**:
Operator-supervised approval for a bounded class of paid execution tied to Provider Pricing Evidence, Reviewer Promotion Scope, expected per-run cost, freshness or expiry, and approval owner.
_Avoid_: blanket paid approval, per-run surprise billing, open-ended spend

**Benchmark/Evaluation Spend**:
Paid execution used to collect benchmark or evaluation evidence before a route, model, reviewer profile, skill, or component variant is promoted to recurring policy. It requires current Provider Pricing Evidence plus either per-run approval or an active Spend Class Approval, and it does not authorize recurring routing.
_Avoid_: stealth recurring spend, policy by experiment, approval-free trial

**Paid Reviewer Evaluation Run**:
A one-off paid reviewer call used to gather Reviewer Capability Benchmark evidence before a Paid Reviewer Promotion Threshold is satisfied for a Reviewer Promotion Scope.
_Avoid_: recurring reviewer route, emergency default, hidden paid escalation

**Reviewer Cost Confidence**:
The operator-supervised confidence that paid reviewer use is justified for the relevant Reviewer Promotion Scope by capability evidence, current Provider Pricing Evidence, expected per-run cost, freshness or expiry, Spend Class Approval, and a satisfied Paid Reviewer Promotion Threshold before becoming automatic policy.
_Avoid_: default paid escalation, hidden token spend, model prestige

**Soft Budget Band**:
A planning and observability range for expected token, cost, latency, or retry behavior during agent or reviewer execution.
_Avoid_: hard spending cap, landing verdict, brittle estimate

**Token-Cost Failsafe**:
A generous guardrail that pauses or escalates abnormal agent or reviewer execution when token spend, monetary cost, latency, retry behavior, or no-op work patterns exceed expected bounds.
_Avoid_: tight budget, cheapest possible run, repeated failed rerun

**Abnormal Run**:
An agent, reviewer, or scheduler activation whose cost, token usage, latency, retries, failed tool calls, or no-op pattern indicates likely mis-scoping, misrouting, runaway execution, or provider/tool failure.
_Avoid_: normal variance, useful deep review, one-off slow command

**Budget Continuation Decision**:
A recorded decision to continue, reroute, stop, or seek operator approval after a Token-Cost Failsafe trips.
_Avoid_: silent overrun, automatic retry loop, unrecorded cost override

**Operator-Blocking Gate**:
A fail-closed stop that requires operator input because product direction, UAT, policy change, business tradeoff, explicit cost or risk approval, irreversible operational risk, or genuinely ambiguous scope cannot be resolved from approved repo artifacts.
_Avoid_: routine metadata repair, ordinary workflow drift, operator-as-release-engineer

**Codex-Owned Technical Decision**:
A routine technical routing, implementation-mechanics, agent/tool selection, skill-scoping, review-depth, test-design, or artifact-structure decision that Codex PM answers from repo evidence and accepted policy without asking the operator.
_Avoid_: operator-as-engineering-manager, technical polling question, routine model-routing vote

**Operational Drift**:
A workflow, metadata, projection, optional-field, malformed-artifact, or bookkeeping mismatch where approved repo artifacts already determine the intended state and no product, UAT, policy, business, cost, or irreversible-risk decision is required.
_Avoid_: product ambiguity, policy exception, unsafe claim recovery

**CLI-Owned Mechanical Repair**:
An atomic CLI-authorized repair of Operational Drift using approved source artifacts and expected-current-state checks, with immutable transition history for the fields changed and blocker cleared.
_Avoid_: manual file patch, approval grant, policy override, invented scope

**Local Qwen Baseline Reviewer**:
The default no-paid-key adversarial reviewer that runs on every PR before landing. The bootstrap runtime routes through the repo-local oMLX OpenAI-compatible endpoint and must not silently fall back to Qwen Code CLI, Ollama, global Mastra Code settings, or paid-key sidecars.
_Avoid_: best reviewer forever, optional local check, hidden provider drift

**Adversarial Escalation**:
The policy path that adds or replaces the baseline reviewer with a stronger or second reviewer when risk, Reviewer Capability Benchmark evidence, and Reviewer Cost Confidence justify it.
_Avoid_: manual panic review, permanent expensive default, unbenchmarked paid reviewer

**Manager-Owned Routing**:
The rule that Codex PM selects the right workflow, skill, agent, reviewer, and escalation path from recorded policy and repo evidence instead of asking the operator to make technical routing decisions.
_Avoid_: operator-as-engineering-manager, every-choice questionnaire

**Operator Input Boundary**:
The rule that Codex PM must call out missing operator-owned input only when repo artifacts cannot answer an Operator-Blocking Gate.
_Avoid_: guessing user intent, burying uncertainty, asking the operator routine technical routing questions

**Operator Supervision**:
The operator-owned oversight of product direction, UAT, policy, business tradeoffs, explicit cost or risk approvals, and irreversible operational-risk decisions without owning routine code-safety, release-mechanics, git-recovery, or Operational Drift repair work.
_Avoid_: human button-pusher, release engineer, code-safety judge

**Landing Autonomy Level**:
The policy outcome that states how much agent-owned landing authority remains after risk, evidence, and freshness gates are evaluated: block, Operator Supervision, Notify-And-Revert Landing, or Auto-Landing Scope.
_Avoid_: confidence score, generic review status, hidden approval

**Notify-And-Revert Landing**:
A narrow Landing Agent path for reversible low-risk work that may land under policy while creating an asynchronous operator attention item and an explicit rollback path.
_Avoid_: auto-land with courtesy ping, delayed approval, human rubber stamp

**Notify-And-Revert Artifact**:
The canonical landing evidence for a Notify-And-Revert Landing, recording the Landing Autonomy Level, rollback path, operator attention reason, follow-up or expiry state, and Boundary Prediction Record link. The Operator Inbox may summarize it, but does not replace it.
_Avoid_: inbox-only landing evidence, courtesy message as source of truth, missing rollback record

**Operator Inbox**:
The compact repo-native communication surface where the Repo PM Coordinator records operator-owned questions, blocked decisions, required inputs, operator responses, and resolution status. In the file-based era, operator-visible coordination messages are written here rather than delivered through proactive notifications. It is not general worker context.
_Avoid_: agent scratchpad, general chat, hidden approval store, GUI notification

**Smell Trigger Catalog**:
A repo-native policy list of risk signals that require stronger review, narrower slice planning, mechanical enforcement, or halt-and-surface behavior.
_Avoid_: gut feel, buried retrospective lesson, ad hoc escalation

**Authority-Based Agent Role**:
A small governed role category defined by authority, permitted actions, forbidden actions, required inputs, and required outputs.
_Avoid_: capability label, model tier, skill name, one-role-per-task pattern

**Stage Capability Scope**:
The per-stage declaration of required skills, allowed tools, authority role, inputs, outputs, evidence, and forbidden actions for a Work Item stage.
_Avoid_: generic agent prompt, implicit tool access, role proliferation, unscoped skill use

**Capability Profile**:
A reusable bundle of skills, tools, prompts, model settings, reviewer settings, or runtime constraints applied inside an Authority-Based Agent Role.
_Avoid_: separate role, permanent agent identity, hidden routing preference

**Specialized Agent Role**:
A legacy shorthand for repeated capability specialization. Prefer Authority-Based Agent Role plus Stage Capability Scope unless the specialization requires different governed authority.
_Avoid_: broad role taxonomy, capability as authority, one-off agent title

**Cross-Model Tension Log**:
A repo-native record of substantive disagreements between implementation, review, CodeRabbit, and adversarial models, including the decision made and whether later evidence validated it.
_Avoid_: forgotten chat disagreement, untracked model preference

**Retrospective-Derived Chore**:
A Chore proposed from Structured Improvement Mining, a retrospective lesson, or another learning signal and handled as a Workflow Trial or explicit no-action decision.
_Avoid_: untracked follow-up, vague process note

**Improvement Analytics**:
Contextual indicators that help interpret a Workflow Trial without claiming statistical causality, including metric observations, baselines, uncertainty, proxy-risk notes, and Minimum Detectable Effect Context.
_Avoid_: causal proof, vanity charts, activity counts without outcome signal

**Improvement Decision**:
An operator-reviewed keep, revise, revert, or double-down decision made after interpreting a Workflow Trial or cross-model tension decision against Predeclared Trial Decision Criteria, uncertainty, and Trial Re-Evaluation Window evidence.
_Avoid_: causal verdict, permanent default by inertia, forgotten experiment

**Approved UAT**:
An operator-recorded acceptance that a feature slice satisfies its product and user-facing contract in the relevant test environment.
_Avoid_: test pass, code review, assumed acceptance

**UAT Approval Artifact**:
A repo-native record written by CLI Authority when the operator accepts a feature slice in a named environment.
_Avoid_: hidden UI flag, PR comment as source of truth, verbal approval

**Stale UAT**:
A previously recorded UAT approval that no longer authorizes landing because branch code changed after approval.
_Avoid_: assumed-valid acceptance, agent-classified product impact

**Auto-Landing Scope**:
The narrow policy boundary allowing the Landing Agent to complete bounded low-risk landing actions only after the Layered Risk Classification Gate, required approvals, and mechanical gates are green.
_Avoid_: broad direct-to-main automation, product acceptance by agent, operator-as-release-engineer

**Mini SeekWins Delivery Loop**:
A spike proof that starts or observes a governed run from a control plane, keeps PM context alive, separates Test Writer, Writer, and Reviewer agent profiles, records agent-to-agent evidence, mechanically blocks a forbidden action, and leaves Mastra-readable or Mastra-reconfigurable state.
_Avoid_: agent chat demo, subprocess smoke test

**SeekWins Transferability Gate**:
A hard exclusion rule requiring a harness candidate to leave a demonstrated path for building SeekWins on top of, or directly reconfiguring into, the chosen agent workflow.
_Avoid_: bonus criterion, later integration

**Mastra**:
The application agent framework used by SeekWins.
_Avoid_: Mastra Code

**Mastra Code**:
The coding-agent harness related to, but distinct from, Mastra.
_Avoid_: Mastra

**Planning Authority**:
The actor allowed to define product direction, architecture direction, acceptance contracts, and go/no-go decisions.
_Avoid_: implementation helper, reviewer

**Execution Worker**:
A bounded agent that implements or checks a pre-approved contract without redefining the plan.
_Avoid_: planner, architect

## Relationships

- A **Trust Layer** can run on one or more **Harnesses**.
- Trust-boundary autonomy is a **Cooperative Workflow Safety Claim**, not an adversarial security claim.
- **Untrusted Input Posture** is required before **Landing Agent** authority can process external contributor input, fetched third-party content, or generated instructions.
- **Data-Only External Input** must cross an **Input Quarantine Boundary** before release-authorized agents may inspect it; it remains quoted evidence, not executable instruction, unless a **Trusted Source Gate** explicitly upgrades the source for a bounded purpose.
- **Trusted Local Repo Mode** is narrower than a security waiver; it ends at the boundary where untrusted input enters a release-authorized path.
- A **Trusted Source Gate** does not make an entire repository, contributor, dependency, or future content stream trusted; it records source identity, scope, allowed uses, freshness or expiry, owner, and revocation.
- A **Supply-Chain Sensitive Surface** includes dependency manifests, lockfiles, package-manager scripts, CI or release workflows, agent skills, fetched prompts, external tool install paths, and similar inputs to executable or agent behavior.
- A **Layered Risk Classification Gate** is required before **Auto-Landing Scope**, reviewer depth, or operator-supervision decisions are finalized.
- **Smell Trigger Catalog** entries are one input to the **Layered Risk Classification Gate**; they are not the only authority for review depth or auto-landing eligibility.
- The **Bounded Compensatory Trust Boundary** risk axis uses **Trivial Risk Work**, **Low-Reversible Risk Work**, **Material-Risk Work**, and **Never Auto-Landable Surface** rather than a smooth moderate-to-high autonomy ladder.
- A **Landing Autonomy Level** is ordered from block to **Operator Supervision** to **Notify-And-Revert Landing** to **Auto-Landing Scope**.
- The **Initial Conservative Boundary Contour** is the default until a **Workflow Trial** and **Improvement Decision** justify a narrower or broader cell.
- A **Bounded Compensatory Trust Boundary** may reduce friction only inside risk bands already eligible for agent-owned landing; it cannot override **Never Auto-Landable Surfaces** or material-risk **Operator Supervision**.
- **Asymmetric Boundary Movement** allows fast automatic contraction but only trial-governed expansion.
- **Notify-And-Revert Landing** is unavailable for material-risk work, stale evidence, and **Never Auto-Landable Surfaces**.
- A **Notify-And-Revert Artifact** is canonical for Notify-And-Revert Landing evidence; **Operator Inbox** exposure is only an attention surface.
- **Never Auto-Landable Surfaces** cannot enter **Auto-Landing Scope** even when tests, CodeRabbit, Qwen, or escalated reviewers pass.
- **Blast-Radius Signals**, **Static Analysis Risk Signals**, source-trust state, input-quarantine state, and supply-chain state can independently raise review depth, require operator supervision, or block auto-landing without requiring a matching smell trigger.
- A **Supply-Chain Gate** is required before **Auto-Landing Scope** can include any **Supply-Chain Sensitive Surface**; until then those changes require blocker disposition, operator supervision, or an explicit bootstrap gap.
- A **Harness** manages one or more **True Agents**.
- A **Harness Candidate** must pass the **Runtime Portability Gate**.
- A **Provider-Agnostic Harness** satisfies one part of the **Runtime Portability Gate**.
- A **Harness Spike** evaluates **Harness Candidates** before any replacement architecture is adopted.
- A **Harness Spike** may be specified by a **Harness Spike Plan** imported from Sourmash source material.
- **Bandit** preserves Sourmash's **Trust Layer** contracts while replacing Sourmash's deprecated subprocess-first architecture.
- **CLI Authority** keeps the **Trust Layer** enforceable while the **Workflow Cockpit** keeps slices, chores, reviews, lessons, follow-ups, and UAT readiness visible.
- **Repo-Native Workflow State** is canonical; a **State Index** may be rebuilt from it for cockpit speed and filtering.
- A **Coordination Primitive** is part of **Repo-Native Workflow State**.
- An **SDLC Microstep State Machine** is recorded in a **Step Transition Ledger** so work-item progress is explicit instead of inferred from artifacts alone.
- A **Shared Core State Machine** governs both **Slices** and **Chores**, with **Typed State Extensions** for work-type-specific requirements.
- A **Retrospective Recorded State** is not the same as a **Closed Work Item**.
- A **Step Transition Ledger** lives inside a **Per-Work-Item Coordination Log** as typed workflow transition events.
- **Canonical Coordination History** is the authoritative workflow history for a work item; current-state files, cockpit status, state indexes, and registries are **Coordination Projections** unless the **Claim Authority Primitive** is actively granting or refusing a writable claim.
- A **Derived Current State View** may summarize a **Step Transition Ledger**, but it is not canonical.
- An **Agent Coordination Contract** uses **Runtime-Agnostic Coordination** so Codex, Claude, Qwen, CI jobs, Owner VMs, or future harnesses can execute bounded steps without becoming Bandit's planning authority.
- An **Agent Coordination Event** lives inside a **Per-Work-Item Coordination Log** without becoming workflow state itself.
- A **Block Event** becomes an **Accepted Block** only when accepted by CLI validation or Codex PM policy.
- A **Safe Trigger Point** is exposed by **CLI Authority** from validated step transitions and displayed by the **Workflow Cockpit**.
- An **Agent Coordination Event** may be a **Trigger Signal**, but it is not a **Safe Trigger Point** until validated into workflow state.
- **Cross-Repo Coordination** depends on **Self-Governing Repositories** that share the same core coordination contracts while retaining repo-local canonical state.
- A **Repo PM Coordinator** supervises **Work Item PM Orchestrators**, reconciles repo-level coordination state, and uses the **Operator Inbox** for operator-owned decisions.
- Until a GUI or cockpit notification surface exists, the **Repo PM Coordinator** records operator-visible coordination messages in the **Operator Inbox** rather than interrupting through a separate channel.
- A **Feature PRD** is split into **Work Items** so product delivery and maintenance can use different workflows through **Slices** and **Chores**.
- **Slices** and **Chores** are **Work Item** types.
- A **Work Intake Ledger** holds **Work Item Proposals** before they become active work, approved deferred work, operator escalations, declined entries, or duplicate/superseded entries.
- A **Work Intake Triage Skill** is the operator-facing path for resolving **Work Intake Ledger** entries into consensus outcomes.
- Any operator-facing request to review the **Work Intake Ledger** invokes the **Work Intake Triage Skill** rather than direct ledger editing or ad hoc backlog review.
- A **Work Intake Ledger** is maintained from agent-mediated operator workflows such as **Work Intake Triage Skill** and **grill-with-docs**; the operator is not expected to edit intake entries directly.
- A **Work Intake Ledger** combines mutable current entry state with preserved transition history so agents can scan the current queue without losing decision provenance.
- Only the **Repo PM Coordinator** and **Work Intake Triage Skill** may mutate **Work Intake Ledger** triage state. **Work Item PM Orchestrators**, workers, reviewers, retrospectives, and other agents may propose entries or transitions, but cannot mark proposals accepted, deferred, declined, superseded, or claimable.
- The **Work Intake Triage Skill** may record `accepted_to_queue` consensus, but the **Repo PM Coordinator** materializes the accepted proposal by allocating a real Work Item ID, creating the initial artifact shell, linking it back to the proposal, and making it eligible for queueing and claimability checks.
- A **Work Item Proposal** is not a **Work Item** until the **Repo PM Coordinator** completes materialization of an `accepted_to_queue` decision.
- A materialized **Work Item** is queued, not automatically claimable; claimability still requires no `recovery_required_claim` or `expired_claim`, unblocked dependencies, declared write surfaces, valid scope and acceptance criteria, no conflicting active claim, no **Work-Surface Deadlock**, and any required product, operator, or policy approval.
- A queued **Work Item** that is not claimable stays queued with a **Claimability Report** of `claimability: blocked`; it does not move to a separate blocked-work queue.
- A **Claimability Report** lists all known blockers so the **Repo PM Coordinator** can batch repairs and names a deterministic `primary_blocker` so scheduler and future cockpit surfaces can explain why queued work cannot run.
- An **Authoritative In-Flight Registry** may support advisory or read-only coordination without full write authority, but release-authorized parallel writes require it to be a **Coordination Projection** derived from, or a CAS-protected view of, the **Claim Authority Primitive**.
- The **Claim Authority Primitive** is the only authority that may grant or refuse an active release-authorized writable claim; **Canonical Coordination History** records and reconciles claim lifecycle events but does not replace compare-and-swap claim authority.
- The first **Claim Authority Primitive** backend is the **Git Refs Claim Authority Backend**; `refs/bandit/*` plus `git update-ref --stdin` transactions provide the claim writer boundary, while `.bandit` claim files remain **Claim Projection Artifacts**.
- The **Git Refs Claim Authority Backend** does not replace the **Git Mutation Serializer**; claim refs use compare-and-swap authority, while shared `.git` worktree and maintenance mutations require serialized CLI execution before parallel worktrees are release-authorized.
- A claim-owned worktree is not fully created until the **Claim-Owned Worktree Lock** succeeds; lock failure routes through serializer cleanup and claim failure or release evidence.
- A Bandit-created worktree is not a **Runnable Worktree** until the **Worktree Bootstrap Contract** is validated; bootstrap failure routes to claim failure, block, or recovery evidence rather than silent worker retry.
- An **Atomic Work Claim** is only atomic for **Parallel Writable Workstreams** when backed by a **Compare-And-Swap Claim** at the **Claim Authority Primitive**.
- A **Claim Projection Artifact** may be rebuilt from **Canonical Coordination History** and the **Git Refs Claim Authority Backend**, but manual edits to that projection cannot grant or release claim authority.
- A **Work Claim Lease** is not sufficient authority for release-authorized mutation unless state-changing **Claim Operations** and **Claim-Gated Side Effects** require the current **Fencing Token** and a **Claim Idempotency Key**.
- An **Idempotent Claim Operation** treats same-key same-input retry as the same intended operation, but same-key conflicting input is refused as unsafe replay.
- Pairwise **Work Surface Reservation** overlap checks are necessary but not sufficient; claimability must also detect **Work-Surface Deadlocks** through the **Work-Surface Wait-For Graph**.
- **Post-Bootstrap Parallel Workstreams** may start as advisory, read-only, or single-writer coordination, but **Parallel Writable Workstreams** remain blocked until the **Parallel Write Authorization Gate** passes.
- **LLM Polling Heartbeat** is not the default scheduler for **Post-Bootstrap Parallel Workstreams**.
- **Event-Driven Work Triggers** and a **Deterministic Work Sweeper** must satisfy the **Work Availability Wake Guarantee** before LLM polling can be removed from a workflow.
- A **Single-Claim Heartbeat** may remain as a worker activation shape, but it should be woken by available work rather than by default model polling for no-op discovery.
- The **Repo PM Coordinator** may automatically repair mechanical **Claimability Report** blockers such as missing declared write surfaces or normalized scope and acceptance metadata only when approved PRDs, briefs, or work artifacts already prove the answer.
- Fail-closed behavior routes to an **Operator-Blocking Gate** only for product, UAT, policy, business, cost, irreversible-risk, or genuinely ambiguous scope decisions; ordinary **Operational Drift** should route to **CLI-Owned Mechanical Repair** when the fix is derivable from approved artifacts.
- The **Repo PM Coordinator** may mechanically repair `expired_claim` only when **Expired Claim Release Evidence** proves there is no unmerged work and policy allows release.
- Missing or ambiguous **Expired Claim Release Evidence** converts `expired_claim` to `recovery_required_claim` instead of releasing it.
- An `expired_claim` mechanical release rationale is generated from evidence, briefly states why release is safe, and lives in the mechanical-repair transition-history entry.
- The **Repo PM Coordinator** must route `recovery_required_claim` through claim/recovery protocol; it is not mechanically repairable.
- Every automatic mechanical claimability repair must record transition history with actor, source evidence, fields changed, before and after values, and the blocker cleared.
- A mechanical claimability repair is one atomic CLI operation: it applies the state change, appends the immutable transition-history entry, assigns and returns the transition-history entry ID, recomputes the **Claimability Report** once, and fails without partial state if any step cannot complete.
- A mechanical claimability repair request must include expected current state: observed **Claimability Report** ID or hash, observed blocker state, and observed target **Work Item** state. If current repo state differs, the CLI refuses without changes and requires reread and recompute.
- A mechanical-repair transition-history entry ID is assigned atomically by that CLI operation; agents submit proposed transition content and must not author stable transition IDs directly.
- A mechanical-repair transition-history entry is immutable once written; corrections append a new transition or amendment entry that references the original transition-history entry ID.
- A **Claimability Report** may reference the CLI-returned mechanical-repair transition-history entry ID after a blocker is cleared; it does not own a separate release-rationale artifact.
- After an automatic mechanical claimability repair, the **Repo PM Coordinator** recomputes the **Claimability Report** once; if blockers remain, the **Work Item** stays queued with the updated report.
- If recompute clears blockers for new queued work, the **Repo PM Coordinator** marks the **Work Item** claimable and leaves selection to the normal **Single-Claim Heartbeat** scheduler; it must not immediately assign the work or wake a worker lane for that new work.
- If recompute clears every blocker for an **In-Progress Work Item**, the **Repo PM Coordinator** may wake that **Work Item PM Orchestrator** to resume orchestration, but it must not acquire a **Work Claim Lease** or start execution.
- If an **In-Progress Work Item** cannot be resumed, it remains blocked; `recovery_required_claim` or `expired_claim` prevents **Work Item PM Orchestrator** wake.
- Waking a **Work Item PM Orchestrator** for an unblocked **In-Progress Work Item** requires a payload with Work Item ID, cleared blocker, updated Claimability Report ID or hash, resume reason, and timestamp.
- A **Work Item PM Orchestrator** must not clear leases, recover worktrees, or claim replacement work.
- The **Repo PM Coordinator** must not run repeated repair-and-recompute loops in one activation.
- The **Repo PM Coordinator** must not repair claimability by inventing product scope, granting approvals, overriding policy, breaking dependencies, or force-resolving conflicting claims; non-mechanical repairs become a **Work Item Proposal** or **Operator Inbox** entry.
- A missing field, projection mismatch, malformed artifact, ledger drift, or bookkeeping issue must not become an **Operator Inbox** entry when a **CLI-Owned Mechanical Repair** can derive the intended state from approved repo artifacts.
- A **Role Authority Boundary** applies to every agent role: coordination roles do not implement or claim, worker roles do not govern intake or landing, reviewer roles do not land, and landing roles do not invent missing product or policy approval.
- Bandit's default **Authority-Based Agent Roles** are Operator, PM or Coordinator, Worker, Reviewer, and Landing; capability differences belong in **Capability Profiles** or **Stage Capability Scope** unless they require different governed authority.
- Every claimable Work Item stage should declare a **Stage Capability Scope** so the assigned role has the right skills and tools without expanding the agent-role taxonomy.
- The **Bootstrap Orchestration Boundary** means bootstrap enforcement is artifact and diff-gate based; live worker interruption, bidirectional A2A clarification, scoped tool permissions, and persistent cross-model context require a **Harness**, not a **Process Adapter**.
- During bootstrap, **Bootstrap Model-Family Separation** binds Codex to Stage 2 RED test authorship, Claude to Stage 3 implementation through a **Process Adapter**, and Qwen plus CodeRabbit to verification.
- The **Test Ownership Boundary** is permanent across bootstrap, true agents, future harnesses, and future providers: the Stage 3 Writer's test-edit authority is always empty, and a test problem found during implementation routes to Codex PM for a test-change decision or blocker disposition.
- If the Stage 3 Writer edits any test surface, the recovery path is to revert the entire Stage 3 attempt and rerun Stage 3 clean from unchanged Stage 2 RED evidence.
- If verification of Claude-authored code needs escalation, escalation returns to Codex PM rather than Claude because Claude is not independent evidence for its own implementation.
- A **Work Item Proposal** with `accepted_deferred` remains in the **Work Intake Ledger** until later promotion; it is approved scope but not active queue work.
- A **Work Intake Triage Skill** ranks entries before presentation; low-effort/high-impact proposals float to the top unless stronger risk, dependency, or operator-boundary evidence says otherwise.
- A **Work Intake Triage Skill** may challenge an operator override with brief rationale, but must honor an explicit operator choice to address a different intake item.
- A **Work Intake Triage Skill** may record lightweight operator-override learning signals, but missing override telemetry must not block the operator's triage decision.
- A **Work Intake Triage Skill** processes prioritized new or untriaged proposals before asking whether any `accepted_deferred` proposals should be revisited in the current triage session.
- A **Work Intake Triage Skill** may end a session without exhausting the list, but every skipped or unresolved presented entry must keep or receive an explicit state such as untriaged, needs_more_info, or needs_operator.
- A **Work Intake Triage Skill** should emphasize previously deferred proposals when earlier work makes them materially lower effort or higher impact.
- Promoting `accepted_deferred` to `accepted_to_queue` requires the **Work Intake Triage Skill** to present the prior decision, current evidence, changed context, and operator confirmation.
- A **Work Item PM Orchestrator** manages one **Work Item**'s context and agent routing, while implementation remains with **Execution Workers**, review evidence remains with reviewers, and landing remains with the **Landing Agent**.
- A **Work Item PM Orchestrator** verifies Work Item handoffs and evidence transfer; the **Repo PM Coordinator** owns repo-level claim release, integration routing, and worktree deletion after that verification.
- A **Work Item PM Orchestrator** may create **Work Item Proposals** and proposed `spawns` edges from its owned surfaces; the **Repo PM Coordinator** accepts, prioritizes, defers, declines, or escalates those proposals.
- A **Work Item A2A Channel** gives specialized agents a real-time path to the **Work Item PM Orchestrator** without making chat messages canonical workflow state.
- A **Work Item Dependency Graph** relates **Work Items** so Bandit can distinguish blocked work from claimable work without treating tracker hierarchy or chat priority as authority.
- A **Work Item Dependency Graph** is composed of **Typed Dependency Edges** so Bandit can distinguish blocking dependency, provenance, replacement, and contextual relationships.
- A **Bootstrap Gap** discovered at this stage becomes the next **Bootstrap-Gap Chore** before unrelated feature or slice work proceeds.
- A **Heartbeat Chore Agent** may run selected **Chores**, but it does not get the same authority as a feature implementation workflow.
- A **Heartbeat Chore Agent** prepares eligible work; a **Landing Agent** decides whether a PR can land under policy.
- A **Landing Verdict** replaces asking the operator to judge routine code-safety warnings or perform routine release mechanics.
- A **Landing Verdict** requires a completed **Pre-Landing Review Loop**.
- A **Boundary Prediction Record** is the join point between a landing decision and later escape detection or boundary-cell evaluation.
- An **Escape Candidate** becomes a **Confirmed Boundary Escape** only after a causal link to a **Boundary Prediction Record** is recorded.
- Codex PM may confirm an **Escape Candidate** from explicit repo evidence; ambiguous product, UAT, business, policy, or explicit risk judgments require an **Operator-Blocking Gate**.
- **Stage 4 Evidence-Head Semantics** keeps iterative review closeout from becoming recursive while preserving fail-closed behavior for actual source drift.
- A **CodeRabbit Pre-Landing Loop** runs before landing so review queues and repair loops do not happen after merge.
- An **Adversarial Review Gate** is required for every PR and is configured by an **Adversarial Reviewer Profile**.
- The **Local Qwen Baseline Reviewer** remains the no-paid-key default until **Reviewer Capability Benchmark** evidence and **Reviewer Cost Confidence** justify automatic paid escalation.
- **Adversarial Escalation** may add a stronger or second reviewer when policy risk requires it, but recurring paid use needs benchmark evidence, current **Provider Pricing Evidence**, and **Spend Class Approval**.
- **Evidence Independence** contributes to an **Evidence Strength Tier** only when the evidence is current under the relevant **Evidence SLO** and covers the **Review Subject Hash** scope.
- Same-model self-review, post-hoc author-controlled tests, and reviewer output influenced by the author's rationale are weak evidence for **Bounded Compensatory Trust Boundary** decisions.
- **Load-Bearing Agent Components** include **Goal Definition Component**, **Perception And Input Component**, **Context Component**, **Memory Component**, **Reasoning And Planning Component**, **Tool Execution Component**, **Orchestration And Coordination Component**, and **Feedback And Observability Component**.
- The **Feedback And Observability Component** uses **OTel-Compatible Agent Traces** and **Agent Operation Spans** to explain runtime behavior, cost, latency, failures, reviewer runs, wakeups, claims, and tool friction.
- An **Attribution Join Key** must connect model calls, tool calls, landing decisions, and escape evidence before telemetry can govern **Bounded Compensatory Trust Boundary** decisions.
- A **Model-Call Boundary Adapter** is replaceable infrastructure; Bandit's durable product contract is the **Attribution Join Key**, repo-reconstructable evidence, and **Runtime Portability Gate** compliance.
- **Bandit-Owned Boundary Logic** cannot be delegated to a **Model-Call Boundary Adapter**; adapters may supply capture, identity, cost, and trace evidence, but not canonical escape decisions or Boundary Contour changes.
- **OTel-Compatible Agent Traces** and **Observability Projections** are evidence for analysis; **Canonical Workflow Artifacts** remain authoritative for workflow state, gates, decisions, UAT, landing, and closeout.
- **Evidence SLOs** are artifact-type-specific: CI/test output, CodeRabbit evidence, Local Qwen evidence, escalated review, UAT approval, landing verdicts, retrospectives, and **Coordination Projections** can have different **Artifact Freshness Budgets**.
- The **Workflow Cockpit** should display **Evidence Trust Signals** with source, owner, freshness state, and **Staleness Reason** instead of generic confidence badges.
- A **Landing Verdict** depends on the upstream **Evidence SLOs** for tests, review, UAT when applicable, policy gates, and source-drift checks.
- A **Soft Budget Band** helps detect cost and token drift, but it is not a hard landing gate by itself.
- A **Token-Cost Failsafe** should stop **Abnormal Runs** without making normal deep review brittle or forcing duplicate failed attempts that cost more than the original work.
- A tripped **Token-Cost Failsafe** requires a **Budget Continuation Decision** before further paid, high-token, or repeated reviewer execution continues.
- A **Focused Session Context Packet** is the default **Context Component** for one activation; historical roadmap narrative, old closeout evidence, full glossary text, and deep source material are on-demand references unless the packet or current task requires them.
- Choosing the **Focused Session Context Packet** generation strategy is a **Codex-Owned Technical Decision**; the default is CLI-derived state with optional Markdown rendering, not a hand-maintained packet that can drift from repo authority.
- **Load-Bearing Skills** shape one or more **Load-Bearing Agent Components**; each required skill needs a **Skill Lifecycle Contract** before it can become stage policy.
- A **Skill Lifecycle Contract** supplies stable skill identity, version, intended-stage fit, required tools, forbidden actions, benchmark packets, and rollback criteria for **Stage Capability Scope** and **Replay-Only Agent Benchmarks**.
- **Agent Component Benchmark** evidence can change model-routing, reviewer-routing, skill policy, and cost decisions only through the approved policy path.
- An **Agent Evaluation Harness** runs **Agent Evaluation Packets** so **Reviewer Capability Benchmark** and **Agent Component Benchmark** evidence is comparable across models, skills, reviewer profiles, and component variants.
- The first **Agent Evaluation Harness** implementation runs **Replay-Only Agent Benchmarks** with fixed packets for Local Qwen, Claude or paid reviewers, skill variants, reviewer profiles, and load-bearing component variants.
- **Replay-Only Agent Benchmarks** separate visible **Calibration Packet Sets** from versioned **Locked Holdout Packet Sets** so skills, prompts, and reviewer profiles are not promoted solely because they overfit the visible benchmark.
- Policy promotion from an **Agent Evaluation Harness** requires **Locked Holdout Packet Set** evidence; **Calibration Packet Set** evidence is development feedback, not sufficient proof.
- **Reviewer Capability Benchmarks** use **Gold-Labeled Reviewer Packets** with **Seeded Blockers** and **Seeded Non-Issues** so the **Reviewer Benchmark Scorecard** can measure blocker recall and false positives instead of raw finding count.
- The first reviewer benchmark packet set should be a **Failure-Mode Stratified Packet Set** derived from Bandit's actual workflow risks before generic coding benchmarks are used as supplemental coverage.
- A **Reviewer Benchmark Scorecard** prioritizes blocker recall, then actionable precision, useful finding yield, false-positive rate, tool friction, latency, and Provider Pricing Evidence-backed expected cost when comparing Local Qwen against Claude or another paid reviewer.
- A **Paid Reviewer Evaluation Run** before threshold promotion is **Benchmark/Evaluation Spend**: it requires current **Provider Pricing Evidence** plus per-run approval or active **Spend Class Approval**, and it never counts as recurring reviewer routing policy.
- A recurring paid reviewer route requires a **Paid Reviewer Promotion Threshold** for its **Reviewer Promotion Scope** before it becomes automatic policy.
- A **Paid Reviewer Promotion Threshold** must include locked-holdout blocker-recall improvement over **Local Qwen Baseline Reviewer**, false-positive ceiling, Provider Pricing Evidence-backed expected-cost ceiling, and operator-supervised **Spend Class Approval**.
- **Reviewer Cost Confidence** expires when **Provider Pricing Evidence** is missing, stale, past its freshness or expiry rule, no longer matches provider billing terms, or no longer supports the approved spend class for the **Reviewer Promotion Scope**.
- A paid reviewer route promoted for one **Reviewer Promotion Scope** does not authorize recurring paid routing for unrelated risk classes, stages, or **Capability Profiles**.
- An **Agent Evaluation Harness** informs policy decisions, but it does not automatically change model routing, reviewer routing, skill policy, or cost policy without Codex PM and operator-supervised approval where required.
- **Structured Improvement Mining** runs in parallel with normal work and is reconciled in **Stage 6**, rather than waiting for an agent to volunteer lessons at closeout.
- A **Retrospective Mining Checklist** examines **Load-Bearing Agent Components** for **Agent Execution Smells** including failed tool calls, overreasoning, work-breakdown fit, agent-scope fit, tool-use rule pressure, reviewer/model routing issues, **Tool Invocation Friction**, recurring inefficiency, and cost or latency signals.
- Repeated confusion about how to invoke CodeRabbit, Local Qwen, or another required gate is **Tool Invocation Friction** and must be routed to a skill, command, documentation, policy repair, Workflow Trial, or explicit no-action decision.
- **Manager-Owned Routing** means Codex PM applies the **Smell Trigger Catalog** to choose skills, agents, review depth, model escalation, test strategy, implementation mechanics, and artifact structure without asking the operator to make routine technical calls.
- All technical questions are **Codex-Owned Technical Decisions** unless they require product direction, UAT, policy change, business tradeoff, explicit cost/risk approval, irreversible operational risk approval, or genuinely ambiguous scope.
- **Capability Profiles** and **Stage Capability Scope** are preferred over new **Specialized Agent Roles** when the difference is skill, tool, model, reviewer depth, or prompt behavior rather than governed authority.
- **Stage Capability Scope** may include the **Soft Budget Band**, **Token-Cost Failsafe**, and **Budget Continuation Decision** required for paid, high-token, reviewer, or long-running work.
- **Cross-Model Tension Log** entries keep disputed model judgments visible for later evaluation.
- The **Trust Layer** is Bandit's primary product category; its **Workflow Learning Loop** preserves lessons as **Workflow Trials**, no-action decisions, or later **Improvement Decisions**.
- **Workflow Trials** cannot change workflow policy from metric observation alone; they require **Predeclared Trial Decision Criteria**, **Minimum Detectable Effect Context**, a **Trial Re-Evaluation Window**, and a keep, revise, revert, or double-down **Improvement Decision**.
- **Retrospective-Derived Chores** and cross-model tension follow-ups must come from structured mining, review outcomes, incidents, smell triggers, or explicit operator/reviewer evidence and be tagged so the cockpit and CLI can track whether they were kept, revised, reverted, doubled down, or left as no-action decisions.
- **Auto-Landing Scope** is limited to bounded low-risk work; feature **Slices** and material-risk changes require **Operator Supervision** before the **Landing Agent** performs landing mechanics.
- **Auto-Landing Scope** depends on the **Layered Risk Classification Gate**; hard exclusions and any single high-risk signal can block auto-landing even when the smell catalog does not match.
- **Approved UAT** is represented by a **UAT Approval Artifact** written by **CLI Authority**; the **Workflow Cockpit** may trigger that command, but does not store acceptance as canonical state.
- Any branch code change after a **UAT Approval Artifact** creates **Stale UAT** for v0; feature **Slices** require renewed **Approved UAT** before auto-landing.
- A **Harness Candidate** must pass the **SeekWins Transferability Gate** by demonstrating a **Mini SeekWins Delivery Loop**.
- A **Process Adapter** may call a model, but it is not a **True Agent**.
- **Planning Authority** belongs to the operator and Codex PM unless explicitly delegated.
- Claude, Codex, or another model may act as an **Execution Worker**, but planning authority remains with the operator and Codex PM unless explicitly delegated.

## Example Dialogue

> **Dev:** "Can we call `claude -p` the Writer agent?"
> **Domain expert:** "No. That is a **Process Adapter** unless the harness gives it bidirectional communication, scoped permissions, controlled context, and lifecycle visibility."
>
> **Dev:** "If Codex writes the RED tests during bootstrap, can Codex also write the implementation?"
> **Domain expert:** "No. **Bootstrap Model-Family Separation** makes Claude the Stage 3 Writer path, the **Test Ownership Boundary** gives Claude zero test-edit authority, and Qwen plus CodeRabbit verify."
>
> **Dev:** "What if Claude edits tests during Stage 3?"
> **Domain expert:** "Revert the Stage 3 attempt and rerun Stage 3 clean; do not repair around a contaminated diff."

## Flagged Ambiguities

- "subagent" was used to mean both **True Agent** and **Process Adapter**; resolved: Bandit requires bidirectional agent-to-agent communication for true agents.
- "Claude" was used as both planner and worker; resolved: model workers are not Bandit planning authority by default.
- "Codex can write tests when needed" conflicted with Stage 2/Stage 3 independence; resolved: during bootstrap Codex writes RED tests, Claude writes implementation, Claude never edits tests, Qwen and CodeRabbit verify, and escalation returns to Codex.
- "Writer-editable tests" implied a permission that does not exist; resolved: the Stage 3 Writer's test-edit authority is permanently empty, including mechanical fixture, helper, formatting, or RED evidence changes.
- "test edit recovery" could mean accepting a partial fix; resolved: any Stage 3 Writer test edit invalidates the Stage 3 attempt, so the attempt is reverted and Stage 3 reruns clean.
- "`CURRENT_CONTEXT.md`" was used as both current-state projection and historical ledger; resolved: an activation should consume a **Focused Session Context Packet** first, and use full roadmap or historical closeout narrative only by pointer when the current task requires it.
- "focused context packet format" could be treated as operator preference; resolved: packet generation is a **Codex-Owned Technical Decision** and should be CLI-derived with optional Markdown rendering.
- "Mastra" was used as shorthand for multiple related surfaces; resolved: **Mastra** and **Mastra Code** are distinct harness candidates and must be evaluated separately.
- "software factory" overlaps Bandit's coordination problem but is not the primary product category; resolved: Bandit is a **Trust Layer** whose **Coordination Primitive** can support software-factory use cases.
- "measurable improvement engine" overstated Bandit's ability to prove causal workflow improvement at single-operator scale; resolved: use **Workflow Learning Loop** and **Workflow Trial** for evidence-backed, operator-reviewed changes.
- "workflow metric improved" could become reward-hacking pressure or post-hoc justification; resolved: **Workflow Trials** need **Predeclared Trial Decision Criteria**, **Minimum Detectable Effect Context**, and a **Trial Re-Evaluation Window** before keep, revise, revert, or double-down decisions can change policy.
- "adversarial-grade security" was too broad; resolved: Bandit does not claim malicious-repository-owner security, but **Untrusted Input Posture** is required before release-authorized agent paths handle external or third-party content.
- "cooperative-only security" was unsafe for landing agents; resolved: external contributor text and fetched third-party content enter as **Data-Only External Input** behind an **Input Quarantine Boundary** and cannot become instructions without a **Trusted Source Gate**.
- "security" was too broad for dependency and tool-install risk; resolved: use **Supply-Chain Gate** for supply-chain-sensitive changes without claiming broad malicious-repository-owner security.
- "smell list" was too brittle as a safety mechanism; resolved: use a **Layered Risk Classification Gate** with hard **Never Auto-Landable Surface** exclusions, **Blast-Radius Signals**, **Static Analysis Risk Signals**, source trust, input quarantine, supply-chain state, and smell triggers as one input.
- "paid reviewer escalation" was used as if stronger automatically meant worth the spend; resolved: paid reviewer policy needs **Reviewer Capability Benchmark** evidence and **Reviewer Cost Confidence** before it becomes automatic.
- "skills" were treated as incidental prompts; resolved: **Load-Bearing Skills** are product-critical artifacts because they shape **Load-Bearing Agent Components** and can materially change Qwen, Claude, and reviewer-routing performance. Required skills need a **Skill Lifecycle Contract** with owner, version, changelog, intended stages, required tools, forbidden actions, evaluation packets, and rollback criteria.
- "context" and "memory" were used too loosely; resolved: **Context Component** is the active task packet and framing, while **Memory Component** is durable prior state.
- "agent capability" was used as if it were only model choice; resolved: Bandit evaluates goal definition, perception/input, context, memory, reasoning/planning, tool execution/action, orchestration/coordination, and feedback/observability as load-bearing architecture components.
- "evaluation" was used for both workflow-trial interpretation and agent capability testing; resolved: **Improvement Evaluation** interprets workflow trials, while an **Agent Evaluation Harness** compares agents, skills, models, reviewer profiles, and component variants on fixed packets.
- "benchmark" could imply live A/B routing or automatic policy mutation; resolved: the first agent benchmark mode is a **Replay-Only Agent Benchmark** that records evidence without changing live routing or policy.
- "fixed packet" could still be overfit; resolved: use visible **Calibration Packet Sets** for development and versioned **Locked Holdout Packet Sets** for policy promotion.
- "better reviewer" could mean more comments; resolved: use **Gold-Labeled Reviewer Packets** and a **Reviewer Benchmark Scorecard** that prioritizes blocker recall over raw finding count.
- "paid reviewer worked once" could become permanent spend by inertia; resolved: recurring paid routing requires a predeclared **Paid Reviewer Promotion Threshold**, current **Provider Pricing Evidence**, and operator-supervised **Spend Class Approval**.
- "one-off paid reviewer call" could become stealth recurring spend; resolved: classify it as **Benchmark/Evaluation Spend** with per-run approval or active **Spend Class Approval**, and forbid treating it as recurring reviewer routing policy until the scoped promotion threshold is satisfied.
- "Claude is better than Qwen" could be mistaken for a global paid-routing policy; resolved: paid reviewer promotion is scoped by **Reviewer Promotion Scope**, not by model identity alone.
- "current provider billing terms" was too vague for paid-reviewer policy; resolved: use **Provider Pricing Evidence** with source, captured date, effective date, freshness or expiry rule, expected per-run cost, spend class, and **Spend Class Approval**.
- "reviewer benchmark packet" could mean generic code-review tasks; resolved: the first reviewer benchmark set is a **Failure-Mode Stratified Packet Set** derived from Bandit's real workflow failure modes.
- "retrospective" was treated as a freeform lesson surface; resolved: **Structured Improvement Mining** and the **Retrospective Mining Checklist** must actively mine each work item for **Agent Execution Smells** instead of waiting for voluntary suggestions.
- "fencing token" could still allow duplicate effects during retries; resolved: state-changing **Claim Operations** and **Claim-Gated Side Effects** also require a **Claim Idempotency Key**.
- "work-surface collision" was too narrow; resolved: claimability requires pairwise overlap checks plus **Work-Surface Wait-For Graph** cycle detection so deadlocked reservations are blocked explicitly.
- "Git refs CAS" could be mistaken for complete git-concurrency safety; resolved: a **Git Mutation Serializer** is required for shared `.git` plumbing mutations before parallel worktrees are release-authorized.
- "worktree lock reason" is Codex PM-owned Git mechanics; resolved: **Claim-Owned Worktree Locks** use a stable claim-specific reason and do not include renewing fencing tokens.
- "observability" was treated as if repo artifacts, automation memory, and runtime telemetry were interchangeable; resolved: **OTel-Compatible Agent Traces** explain runtime behavior, while **Canonical Workflow Artifacts** remain workflow authority.
- "confidence badge" was too vague for cockpit trust; resolved: cockpit trust uses **Evidence SLOs** and **Evidence Trust Signals** that expose source, owner, freshness state, and **Staleness Reason** per artifact type.
- "registry" and "current state" were used as if derived coordination views could become independent authority; resolved: **Canonical Coordination History** is the workflow source of truth, **Coordination Projections** are rebuildable views, and only the **Claim Authority Primitive** may grant active writable claims.
- "fail closed" was used as if every operational mismatch should halt on the operator; resolved: reserve **Operator-Blocking Gates** for real operator-owned decisions and route derivable **Operational Drift** through **CLI-Owned Mechanical Repair**.
- "technical question" was used as if the operator should decide implementation mechanics; resolved: all routine technical questions are **Codex-Owned Technical Decisions** unless they cross an **Operator-Blocking Gate**.
- "agent role" was used for both authority boundaries and capability specialization; resolved: keep a small **Authority-Based Agent Role** set and put stage-specific skills, tools, model settings, reviewer depth, and prompts in **Stage Capability Scope** or **Capability Profiles**.
- "budget" was used as if every agent or reviewer execution needed a tight refusal cap; resolved: use **Soft Budget Band** for planning and observability, and **Token-Cost Failsafe** for abnormal-run protection without creating costly duplicate attempts.
- "atomic" was used for fail-closed multi-file operations; resolved: release-authorized **Parallel Writable Workstreams** require a **Claim Authority Primitive** with **Compare-And-Swap Claim** semantics and **Fencing Token** enforcement.
- "CAS-backed claim authority" was still too abstract; resolved: the first **Claim Authority Primitive** backend uses the **Git Refs Claim Authority Backend** with `refs/bandit/*` and `git update-ref --stdin` transactions, while `.bandit` files are projections.
- "worktree exists" could be mistaken for "worktree is runnable"; resolved: Bandit-created worktrees require a **Worktree Bootstrap Contract** and must validate as **Runnable Worktrees** before worker execution starts.
- "heartbeat" was used as if periodic LLM polling were the default way to discover work; resolved: **Event-Driven Work Triggers** plus a **Deterministic Work Sweeper** should provide a **Work Availability Wake Guarantee** before default LLM no-op polling is removed.
- "swarm" and "fleet" describe runtime scaling patterns; resolved: Bandit adopts **Runtime-Agnostic Coordination**, not a VM, fleet, or swarm architecture.

## Imported Decision Context

The decision records in `docs/decisions/` were imported from Sourmash on 2026-05-24 because they contain the discussion context that led to Bandit. They are provenance and source material. Current Bandit planning authority lives in `AGENTS.md`, `CONTEXT.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, active work-item artifacts, and accepted Bandit decision records.
