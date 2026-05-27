# BANDIT-PRD-002: Post-Bootstrap Parallel Workstreams

## Status

Draft. Blocked on claim-authority and shared Git mutation serialization
corrections before any release-authorized parallel writable workstreams may be
decomposed or implemented.

Triage label: blocked-by-bootstrap-gap after bootstrap.

The 2026-05-26 research review found that the PRD's earlier file-backed
"atomic CLI operation" language was not enough for concurrent writable claims.
True parallel writable workstreams now require a CAS-backed claim authority,
fencing tokens, idempotency keys, stale-agent rejection, and concurrency
validation before they can leave advisory or read-only coordination mode.

The same review found that default LLM polling heartbeats would create avoidable
token spend. The operator accepted event-driven scheduling only if work still
wakes reliably when it becomes available, so the scheduler must provide a Work
Availability Wake Guarantee through event-driven triggers plus deterministic
non-LLM sweeping.

The operator also confirmed that OpenTelemetry-style agent traces should be a
first-class observability surface. Traces explain runtime behavior, token spend,
tool friction, wakeups, reviewer runs, claim operations, and failures; repo
artifacts remain canonical workflow state.

The operator also confirmed that append-only workflow/event history should be
the only canonical coordination history. Current-state files, in-flight
registries, state indexes, and cockpit views are projections. The exception is
active writable claim authority: a CAS-backed claim authority primitive is the
only surface that may grant or refuse release-authorized writable claims.

On 2026-05-27, the operator accepted the first concrete Claim Authority
Primitive backend: a repo-native Git refs transaction backend using
`refs/bandit/*` and `git update-ref --stdin` compare-and-swap semantics.
Human-readable `.bandit` claim files remain projections.

The operator also confirmed that every state-changing claim operation and
external side-effecting operation under a claim needs both the current fencing
token and an idempotency key, so retries, reruns, and scheduler wakeups cannot
duplicate effects or let stale agents mutate state.

The operator also confirmed that claimability must include wait-for graph cycle
detection for work-surface reservations. Pairwise overlap checks remain
required, but they are not sufficient to prevent deadlocked reservations.

The operator also confirmed that parallel worktrees need a repo-level Git
Mutation Serializer before release authorization. Git refs CAS provides claim
authority, but it does not serialize every shared `.git` plumbing mutation.
Codex PM owns Git implementation mechanics from repo evidence; the accepted
worktree rule is that every claim-owned worktree is `git worktree lock`ed with
a stable claim-specific reason immediately after creation and unlocked only by
the Repo PM Coordinator after handoff verification and cleanup.

The operator later clarified that Codex PM may answer all technical questions.
This PRD therefore treats technical routing, implementation mechanics,
worktree bootstrap mechanics, test strategy, skill/tool scoping, and artifact
structure as Codex PM-owned unless the decision crosses product, UAT, policy,
business, cost/risk, irreversible operational-risk, or genuinely ambiguous
scope boundaries. Codex PM has accepted that every Bandit-created worktree must
validate a repo-native Worktree Bootstrap Contract before worker execution
treats it as runnable.

## Problem

Bandit currently runs work as a single active stream. This is correct during
bootstrap because the repository is still converting missing gates into durable
commands, policies, and artifacts. After bootstrap, the operator wants multiple
agent sessions to move faster by working on different non-overlapping work
items at the same time.

The present "Bandit Next Work Item" heartbeat can start a new Codex run every
15 minutes, but periodic LLM polling is an expensive way to discover no-op
state. The workflow also does not yet have a strict, machine-enforced way to
prove which work items are already in flight, which stage each item is in, which
surfaces are reserved, which worktree owns the work, and whether new work is
available. Without that contract, the worst failure mode is duplicative work on
the same item or colliding edits across worktrees; without a wake guarantee, the
opposite failure mode is available work sitting idle.

The operator also identified a role gap: there is no Repo PM Coordinator. Codex
currently acts as PM, worker, triager, reviewer router, and operator liaison in
each invocation. Parallel workstreams require a control-plane role that keeps
work unblocked, supervises Work Item PM Orchestrators, writes briefs, triages
follow-ups, maintains operator escalations, and pauses wasted heartbeats when no
work is available.

## User

Primary user: the operator managing Bandit-governed repositories.

Primary agent user: Codex PM running as the Repo PM Coordinator.

Secondary agent users: workstream agents, landing agents, future PR-resolution
agents, and future cockpit views that need reliable repo-native coordination
state.

## Goals

- Allow multiple non-overlapping workstreams to run after bootstrap without
  duplicate claims on the same work item or stage.
- Keep true parallel writable workstreams disabled until claim authority has
  compare-and-swap semantics, fencing tokens, idempotency keys, and
  stale-agent rejection.
- Use a Git refs transaction backend as the first concrete Claim Authority
  Primitive, with `refs/bandit/*` as the authority namespace and `.bandit`
  claim files as projections.
- Require state-changing claim operations and external side effects under a
  claim to carry both the current fencing token and a claim idempotency key.
- Detect Work-Surface Wait-For Graph cycles during claimability checks so
  deadlocked reservations are blocked explicitly.
- Require a CLI-owned Git Mutation Serializer for shared `.git` plumbing
  mutations before parallel worktrees are release-authorized.
- Distinguish advisory or read-only coordination events from release-authorized
  parallel writes.
- Make in-flight work independently authoritative only through a claim authority
  primitive that is reconciled with each work item's canonical coordination
  state before any work starts.
- Treat append-only per-work-item coordination history as the canonical
  workflow history and make current-state views, registries, cockpit views, and
  indexes rebuildable projections except for CAS claim authority over active
  writable claims.
- Require every write-capable workstream to claim one stage and declared work
  surface before creating an ephemeral worktree.
- Require every Bandit-created worktree to validate a Worktree Bootstrap
  Contract before worker execution treats it as runnable.
- Replace default LLM polling for no-op discovery with event-driven work
  triggers plus a deterministic non-LLM sweeper.
- Preserve a Work Availability Wake Guarantee so runnable work, recovery work,
  and newly unblocked work wake the appropriate scheduler or agent path.
- Let a woken single-claim activation decide whether to recover existing work,
  continue an open stage, claim new unblocked work, claim an eligible chore, or
  do nothing after deterministic reconciliation.
- Keep improvement-evaluation wakeups and policy-routing updates bounded by the
  Workflow Trial guardrails: predeclared decision criteria, uncertainty or
  minimum-detectable-effect context, re-evaluation window, and explicit
  keep/revise/revert/double-down decision evidence before policy changes.
- Emit OTel-compatible agent traces for claims, wakeups, sweeps, tool calls,
  reviewer runs, model calls, token spend, retries, failures, and outcomes.
- Treat token and cost budgets as generous abnormal-run failsafes for scheduler,
  agent, reviewer, and long-running execution rather than brittle caps that
  force duplicate attempts.
- Require paid scheduler, agent, reviewer, and long-running execution to carry
  current provider-pricing evidence and spend-class approval before recurring
  paid routing is treated as available.
- Treat one-off paid reviewer or model calls before policy promotion as
  benchmark/evaluation spend that requires per-run approval or active
  spend-class approval and cannot silently create recurring routing policy.
- Keep traces and observability projections non-canonical; repo artifacts remain
  authoritative for workflow state, gates, decisions, UAT, landing, and closeout.
- Mark coordination and observability projection freshness through
  artifact-specific Evidence SLOs instead of generic confidence.
- Introduce a Repo PM Coordinator protocol that can unblock work, create briefs,
  prioritize, triage follow-ups, maintain PM-owned context, supervise Work Item
  PM Orchestrators, escalate to the operator, and pause heartbeats when all work
  is blocked.
- Preserve role boundaries: PM orchestrates, workstream agents implement,
  landing agents decide landing, and the operator owns product direction, UAT,
  policy changes, business tradeoffs, and explicit cost or risk overrides.
- Reserve operator-blocking fail-closed behavior for safety, product, UAT,
  policy, business, cost, irreversible-risk, and genuinely ambiguous scope
  gates; route derivable operational drift to CLI-owned mechanical repair.
- Require claimability, review-depth, and auto-landing surfaces to consume
  layered risk-classification output rather than treating smell triggers as the
  only safety signal.
- Keep never-auto-landable surfaces outside auto-landing and unattended
  workstream landing paths regardless of passing tests or reviewer agreement.
- Keep the role taxonomy authority-based; stage-specific skills, tools,
  reviewer depth, and prompts belong in Stage Capability Scope or Capability
  Profiles unless governed authority differs.
- Require claimable stages to name the required skills, allowed tools, inputs,
  outputs, evidence, and forbidden actions before execution starts.
- Require any load-bearing skill referenced by Stage Capability Scope to have
  a lifecycle contract with owner, version, changelog, intended stages,
  required tools, forbidden actions, evaluation packets, and rollback criteria.
- Keep all coordination repo-native and CLI-authoritative. A database or cockpit
  may index or visualize state later, but it must not become hidden authority.
- Keep worktrees ephemeral. Workstream agents mark work cleanup-ready; the Work
  Item PM Orchestrator verifies handoff and evidence transfer, and the Repo PM
  Coordinator handles claim release, integration routing, and worktree deletion.
- Make the protocol reusable across projects through a global Repo PM
  Coordinator skill with Bandit-specific adapters.

## Solution

Bandit will add a post-bootstrap coordination feature that combines a
Git refs-backed claim authority primitive, an Authoritative In-Flight Registry,
fenced work claim leases, idempotent claim operations, declared work surface
reservations, a Git Mutation Serializer, event-driven work triggers, a
deterministic work sweeper, OTel-compatible agent traces, Repo PM Coordinator
governance, and workstream execution.

The Authoritative In-Flight Registry reports active claims and reservations,
but it cannot be a plain-file canonical lock source for concurrent writable
claims. For release-authorized parallel writes, the registry must either be a
projection from the Git refs claim authority primitive or be protected by that
primitive. The first authority backend uses `refs/bandit/*` and
`git update-ref --stdin` transactions; `.bandit` claim files are
human-readable projections and cannot grant, renew, release, or recover claims.
Append-only per-work-item coordination history remains canonical for workflow
stage, evidence, accepted blocks, and safe trigger points. Derived current-state
views, cockpit status, state indexes, and registries are projections. The CLI
must reconcile claim authority, registry projection, and append-only work-item
history before creating, renewing, releasing, recovering, or completing a
claim. If those sources disagree, the CLI fails closed and routes the
discrepancy to PM repair. Agents must never resolve the disagreement by editing
the registry, current-state view, cockpit projection, or work item manually.

The Parallel Write Authorization Gate blocks true parallel writable workstreams
until the claim primitive supports compare-and-swap claim creation or update,
monotonic fencing tokens, stale-agent rejection for state-changing and external
side-effecting operations, idempotency keys for retries and reruns, and
declared Claim Safety Invariants proven through deterministic fault-injecting
or property-style simulation, including wait-for graph cycle detection for
work-surface reservations. Parallel worktrees are also blocked until shared
`.git` plumbing mutations go through the Git Mutation Serializer. Advisory
coordination, read-only inspection, and single-writer workflow improvements may
continue before that gate exists, but they must not be represented as safe
parallel writable execution.

The Git Mutation Serializer is a CLI-owned single-writer guard for repository
plumbing operations that mutate shared `.git` state. It covers worktree
creation, worktree removal, pruning, worktree lock or unlock operations,
branch/ref maintenance outside the claim CAS boundary, and packed-refs-affecting
maintenance. It does not replace `refs/bandit/*` claim CAS semantics and cannot
grant claim authority.

Every claim-owned worktree is locked immediately after creation through the
serializer. The `git worktree lock` reason names the Bandit claim ID, Work Item
ID, and stage, but not the fencing token. Worktree creation is incomplete until
that lock succeeds; if locking fails, the serializer-owned flow records failure
evidence and releases or marks the claim failed.

Worktree locking is necessary but not sufficient for worker execution. A
Bandit-created worktree becomes runnable only after a Worktree Bootstrap
Contract validates the allowed copied or linked files, setup commands,
validation command, environment-variable references, secret-handling boundary,
expected runtime dependencies, and bootstrap failure evidence. The first
CLI-readable policy artifact should be repo-native, such as
`.bandit/policy/worktree-bootstrap.json`, with optional `.worktreeinclude`-style
allow-list support for projects that need it. Secret material is not copied by
default; worktrees reference approved secret sources unless an existing
operator-supervised policy explicitly authorizes a narrower exception.

Every write-capable workstream follows claim-first worktree start:

1. Reconcile append-only work-item history, registry projection, active leases,
   declared work surfaces, and the Work-Surface Wait-For Graph.
2. Claim exactly one runnable stage and its work surface reservation through the
   CAS-backed claim authority.
3. Create and `git worktree lock` an ephemeral worktree through the Git
   Mutation Serializer only after the claim succeeds.
4. Validate the Worktree Bootstrap Contract; if bootstrap fails, record failure
   evidence and route the claim to failed, blocked, or recovery-required state.
5. Execute the stage with the current fencing token and idempotency keys for
   claim-gated side effects, renewing the claim lease as needed.
6. Record stage evidence and a Work Item PM Orchestrator-consumable handoff summary.
7. Mark the claim cleanup-ready or blocked; do not delete the worktree.
8. The Work Item PM Orchestrator verifies that work was transferred correctly;
   the Repo PM Coordinator handles shared-resource integration routing, unlocks
   and deletes the worktree through the Git Mutation Serializer, then releases
   the claim.

A Repo PM Coordinator becomes the control plane. It reads required PM surfaces,
maintains `CURRENT_CONTEXT.md`, maintains the Work Intake Ledger, creates or
updates briefs within approved product scope, prioritizes available work,
supervises Work Item PM Orchestrators, escalates operator-owned blockers in the
Operator Inbox, and controls Workstream Agent heartbeat pause/resume behavior.
The Repo PM Coordinator may pause its own recurring automation only when there
are no active claims, no recovery-required leases, no unarchived completed
worktrees, no runnable non-overlapping work, and no remaining coordination
duties. The operator is the only actor allowed to unpause heartbeats. In the
file-based era, operator-visible coordination messages are written to the
Operator Inbox rather than delivered as proactive notifications. Richer
notification or interruption behavior is deferred to future GUI or cockpit work.

Work Item PM Orchestrators may propose follow-up Work Items and `spawns`
dependency edges from their owned orchestration surfaces, but they do not make
those proposals globally claimable. The Repo PM Coordinator accepts,
prioritizes, rejects, or escalates proposed follow-ups before they enter the
repo-level queue.

The Work Intake Ledger becomes the single pre-queue surface for all proposed
work: chores, retrospective improvement candidates, feature ideas, reviewer
follow-ups, operator requests, spawned work, deferred cleanup, and product
questions. Superseded proposal surfaces such as `FOLLOWUPS.md`, work-item
follow-up candidate files, and the prior chore-only ledger plan must be migrated
into the Work Intake Ledger, marked deprecated during migration, and removed
after validation proves every item has an intake outcome. In v0, the ledger is
agent-maintained from guided operator workflows rather than direct operator
editing. Entries expose mutable current state for scanning and claimability
checks, while transition history preserves who or what changed each entry, when,
why, and the prior and next states. Future storage or database work may improve
the representation, but transition history remains the authoritative decision
record and current state remains a derived scanning surface.

Work Intake Ledger entries are triaged with a Work Intake Triage Skill. The
skill ranks entries before presentation, walks the operator through selected
entries one at a time, presents evidence and opportunity, asks clarifying
questions, and records consensus outcomes: `accepted_to_queue`,
`accepted_deferred`, `needs_more_info`, `needs_operator`, `declined`,
`duplicate`, or `superseded`. `accepted_to_queue` is the triage decision; the
Repo PM Coordinator materializes it through the CLI-authoritative path by
allocating a real Work Item ID, creating the initial artifact shell, linking back
to the proposal, and making the work eligible for queueing and claimability
checks. If one agent session performs both steps, it must record the triage
consensus before acting as Repo PM Coordinator for materialization.
Materialization queues the Work Item but does not make it automatically
claimable. Claimability still requires no `recovery_required_claim` or
`expired_claim`, unblocked dependency graph state, declared write surfaces, valid
scope and acceptance criteria, no conflicting active claim, no work-surface
wait-for cycle, and any required product, operator, or policy approval. A queued Work
Item that is not claimable remains in `queued` state with a Claimability Report
of `claimability: blocked`; the report must list all known blockers and name a
deterministic `primary_blocker` rather than moving the Work Item into a separate
queue. Initial blocker values are `missing_policy_approval`,
`missing_product_or_operator_approval`, `recovery_required_claim`,
`expired_claim`, `conflicting_active_claim`, `work_surface_deadlock`,
`dependency`, `invalid_scope_or_acceptance`, and `missing_declared_write_surface`. Primary
blocker priority follows that order, placing claim recovery state ahead of
ordinary dependency blockers. The Repo PM Coordinator may automatically repair
mechanical blockers, such as missing declared write surfaces or normalized scope
and acceptance metadata, only when the answer is derivable from already approved
PRDs, briefs, or work artifacts. This fail-closed path should stop execution for
Codex PM or CLI repair, not ask the operator, unless the blocker is an
operator-owned gate. `recovery_required_claim` is not mechanically
repairable and always routes through claim/recovery protocol. `expired_claim` is
mechanically repairable only when repo evidence proves there is no unmerged work
and policy allows release. Required evidence is the claim record, worktree path
and branch, clean worktree status, no untracked or staged changes, no commits
ahead of the integration base unless already transferred, and policy allowing
release. The generated human-readable release rationale belongs in the
mechanical-repair transition-history entry and is derived from the evidence, such
as "lease expired; worktree clean; branch has no untransferred commits; policy
allows release." The Claimability Report may reference that transition-history
entry ID after repair; it does not own a separate release-rationale artifact. If
any evidence is missing or ambiguous, `expired_claim` converts to
`recovery_required_claim` instead of being released. It must not invent product
scope, grant approvals, override policy, break dependencies, or force-resolve
conflicting claims. Non-mechanical repairs become a Work Item Proposal or
Operator Inbox entry. Ordinary operational drift such as missing derivable
metadata, malformed supported artifacts, projection mismatch, or ledger
bookkeeping drift should become CLI-owned mechanical repair instead of operator
toil when approved artifacts prove the intended state. Every automatic
mechanical repair is one atomic
CLI-authoritative operation: it applies the state change, appends transition
history with actor, source evidence, fields changed, before and after values,
and the blocker cleared, assigns and returns the stable transition-history entry
ID, recomputes the Claimability Report once, and fails without partial state if
any step cannot complete. The operation requires expected-current-state inputs:
the observed Claimability Report ID or hash, observed blocker state, and observed
target Work Item state. If current repo state differs, the CLI refuses without
changes and requires the Repo PM Coordinator to reread and recompute before
trying again. The Repo PM Coordinator submits proposed transition content and
evidence, but agents must not author stable transition IDs directly.
Mechanical-repair transition-history entries are immutable once written.
Corrections append a new transition or amendment entry that references the
original transition-history entry ID, rather than mutating the original entry. If
blockers remain after recompute, the Work Item stays queued with the updated
report. If recompute clears blockers for new queued work, the Repo PM
Coordinator marks the Work Item claimable and leaves selection to the regular
Single-Claim Heartbeat scheduler; it must not immediately assign the work or wake
a worker lane for that new work. A Work Item counts as already in progress only
when it has an existing Work Item PM Orchestrator context and prior non-terminal
lifecycle evidence, such as an active claim, blocked stage, cleanup-ready
handoff, review-feedback loop, or equivalent non-terminal state. A newly
materialized queued Work Item is not in progress. If an in-progress Work Item
cannot be resumed, it remains blocked. `recovery_required_claim` or
`expired_claim` prevents Work Item PM Orchestrator wake. If recompute clears
every blocker for an in-progress Work Item, the Repo PM Coordinator may wake that
Work Item PM Orchestrator to resume orchestration, but it must not acquire a Work
Claim Lease or start execution. The wake payload must include Work Item ID,
cleared blocker, updated Claimability Report ID or hash, resume reason, and
timestamp. The Work Item PM Orchestrator must not clear leases, recover
worktrees, or claim replacement work. The Repo PM Coordinator must not run
repeated repair-and-recompute loops in one activation.

Auto-landing eligibility remains separate from claimability. Before any
workstream or Landing Agent treats a change as auto-landable, the layered
risk-classification gate must record hard-exclusion checks, never-auto-landable
surface status, blast-radius signals, static-analysis signals, source-trust and
input-quarantine state, supply-chain state, smell-trigger inputs, selected
review depth, and operator-supervision requirements. A single high-risk signal
can block auto-landing or raise review depth without a matching smell trigger.
`accepted_deferred` remains in the Work Intake Ledger until a later promotion
decision. Each triage session prioritizes low-effort/high-impact opportunities,
handles prioritized new or untriaged entries first, then presents a list of
`accepted_deferred` entries and asks the operator whether any should be revisited
in that session. The skill may end a session without exhausting the list, but
every skipped or unresolved presented entry must keep or receive an explicit
state such as untriaged, `needs_more_info`, or `needs_operator`. Promotion from
`accepted_deferred` to `accepted_to_queue` requires presenting the prior
decision, current evidence, changed context, and operator confirmation;
previously deferred entries should be emphasized when earlier work makes them
materially lower effort or higher impact. Ranking is advisory: the skill should
explain the suggested order and may briefly challenge an override, but an
explicit operator choice to address a different item must be honored and
recorded. Lightweight override metadata may be captured when it falls out of the
triage flow, but missing structured learning fields must not block intake
triage; if richer ranking-learning instrumentation would add workflow
complexity, it should be proposed as a later Work Item Proposal.

Any operator-facing request to review the Work Intake Ledger invokes the Work
Intake Triage Skill. The Repo PM Coordinator and Work Intake Triage Skill are
the only authorities that may mutate Work Intake Ledger triage state. Work Item
PM Orchestrators, workers, reviewers, retrospectives, and other agents may
propose entries or proposed transitions, but they cannot mark proposals
accepted, deferred, declined, superseded, or claimable. Read-only listing,
validation, and reporting commands may inspect the ledger for evidence, but they
do not satisfy a review request and must not mutate triage state.

The workstream activation remains a worker lane. Each activation may claim at
most one runnable stage. It should be woken by event-driven work triggers or by
the deterministic sweeper after work becomes available, not by default LLM
polling for no-op discovery. If no claim is available after reconciliation, it
records or emits a no-op status and exits. The scheduler contract must prove the
Work Availability Wake Guarantee before removing any fallback that currently
keeps work from sitting idle.

Due improvement evaluations are runnable work only when the underlying Workflow
Trial has the required policy-change guardrails: predeclared decision criteria,
metric and baseline evidence, uncertainty or minimum-detectable-effect context,
evaluation window, re-evaluation window, and a target decision vocabulary of
keep, revise, revert, or double_down. A scheduler or worker may surface missing
guardrail evidence as repair work, but it must not promote workflow policy from
an evaluation that lacks those fields.

## Non-Goals

- Do not interrupt the active bootstrap-gap lane or start parallel execution
  before bootstrap is complete.
- Do not enable true parallel writable workstreams before the Parallel Write
  Authorization Gate proves CAS-backed claim authority, fencing-token
  enforcement, idempotency-key handling, stale-agent rejection, and concurrency
  validation.
- Do not treat plain-file registry writes or fail-closed-on-next-conflict logic
  as sufficient atomic authority for concurrent writable claims.
- Do not make LLM polling the default scheduler for no-op discovery once
  event-driven triggers and deterministic sweeping can satisfy the Work
  Availability Wake Guarantee.
- Do not allow two active claims for the same work item in v0.
- Do not implement product-scope changes without a grill-with-docs session and
  a resulting PRD, documented change, or work item.
- Do not make the Repo PM Coordinator an implementation agent.
- Do not allow the Repo PM Coordinator to acquire work claims or start
  execution.
- Do not give workstream agents landing authority.
- Do not let workstream agents delete worktrees.
- Do not let any agent perform another role's governed action for convenience.
- Do not make the Operator Inbox general agent context.
- Do not introduce a database, GUI cockpit, centralized external source of
  truth, or cross-repo scheduler in v0.
- Do not implement dynamic per-stage model routing in v0. The model and
  reasoning profile are set when the relevant automation is created.
- Do not solve PR issue resolution or PR-safe landing governance in this PRD.
  That requires a later dedicated agent and policy, plus the input quarantine
  boundary for issue/PR metadata, comments, and review text.
- Do not require every future repo to be Bandit-specific. The Repo PM
  Coordinator protocol should be global, with Bandit-specific integration
  layered on top.

## Stories Or Workflows

1. As the operator, I want multiple non-overlapping workstreams to run at the
   same time, so that Bandit can move faster after bootstrap without creating
   duplicate work.
2. As the operator, I want active writable claims granted only through CAS claim
   authority, so that agents do not choose work from stale chat, projection
   drift, or an advisory dashboard.
3. As the operator, I want in-flight projections, claim authority, and
   append-only work-item history to confirm each other before work starts, so
   that disagreement becomes a repair condition instead of a hidden race.
4. As the operator, I want duplicate work on the same item prevented by a
   claim-first protocol, so that parallel sessions cannot waste time or corrupt
   evidence.
5. As the operator, I want each heartbeat to decide whether useful work exists,
   so that I can tune heartbeat frequency while active or AFK.
6. As the operator, I want a heartbeat to no-op cleanly when no work is
   available, so that idle automations do not create churn.
7. As the operator, I want one Repo PM Coordinator to keep work unblocked, so
   that each worker run does not need to rediscover priorities and blockers.
8. As the operator, I want PM escalations in an Operator Inbox, so that I can
   answer work stoppages without reading every agent artifact.
9. As the operator, I want the Repo PM Coordinator to consume my Operator Inbox
   responses, so that operator decisions become durable work artifacts.
10. As the operator, I want the Repo PM Coordinator to pause worker heartbeats
    when all work is blocked, so that repeated worker runs are not wasted.
11. As the operator, I want the Repo PM Coordinator to pause its own recurring
    automation only after writing the exact re-engagement requirement, so that I
    can restart work intentionally.
12. As the operator, I want only the operator to unpause heartbeats, so that
    agents cannot silently resume blocked work.
13. As Codex PM, I want a global Repo PM Coordinator skill with a checklist and
    protocol, so that PM orchestration is repeatable across projects.
14. As Codex PM, I want a Bandit adapter for the global Repo PM Coordinator
    skill, so that Bandit-specific artifacts and commands are used without
    making the global protocol Bandit-only.
15. As Codex PM, I want required `MEMORY.md` fields for each automation, so that
    the heartbeat can retain operational audit context until a database exists.
16. As Codex PM, I want PM decisions that affect canonical repo state written to
    repo artifacts, so that automation memory does not become hidden authority.
17. As Codex PM, I want `CURRENT_CONTEXT.md` as PM-owned operational context, so
    that next-action routing can be updated freely without treating
    grill-with-docs context as scratch space.
18. As Codex PM, I want `CONTEXT.md` reserved for durable product vocabulary and
    grill-with-docs artifacts, so that routine PM status does not dilute the
    domain glossary.
19. As Codex PM, I want one Work Intake Ledger instead of scattered follow-up,
    chore, retrospective, feature, and review candidate surfaces, so that every
    proposed Work Item has one triage path.
20. As Codex PM, I want a Work Intake Triage Skill that walks the operator
    through proposed work one item at a time, so that each decision has shared
    context and recorded consensus.
21. As Codex PM, I want all superseded intake surfaces migrated, deprecated, and
    removed after validation, so that old follow-up files do not remain parallel
    sources of truth.
22. As Codex PM, I want Work Item PM Orchestrators to propose follow-up Work
    Items without making them globally claimable, so that local Work Item
    context is captured without creating queue chaos.
23. As Codex PM, I want the Repo PM Coordinator to accept and prioritize
    proposed follow-ups only when product scope is already documented, so that PM
    does not create product direction without the operator's grill-with-docs
    process.
24. As Codex PM, I want every runnable item to declare expected write surfaces,
    so that the claim operation can detect collisions and wait-for cycles before
    work begins.
25. As Codex PM, I want the scheduler to prefer recovery, active continuation,
    highest-priority unblocked work, then eligible chores, so that the next
    heartbeat follows a deterministic priority order.
26. As Codex PM, I want expired claims with unmerged changes to enter
    recovery-required state, so that no agent auto-deletes useful work.
27. As Codex PM, I want claim creation to be atomic and CLI-owned, so that two
    simultaneous sessions cannot both believe they own the same stage.
28. As Codex PM, I want claim creation to happen before worktree creation, so
    that speculative worktrees do not create hidden work.
29. As Codex PM, I want failed worktree creation to release or mark the claim
    failed, so that registry state does not falsely block future work.
30. As Codex PM, I want the Repo PM Coordinator to delete worktrees only after
    Work Item PM Orchestrator verification, so that completed work is not lost
    before integration or transfer.
31. As a workstream agent, I want to claim one runnable stage at a time, so that
    my scope and write authority are explicit.
32. As a workstream agent, I want a lease renewal command, so that long-running
    stages remain visibly owned.
33. As a workstream agent, I want collision and deadlock refusal messages that
    name the conflicting work surface, owner, and cycle path when applicable, so
    that I can stop without guessing.
34. As a workstream agent, I want to run read-only inspection without a claim, so
    that status checks do not create unnecessary locks.
35. As a workstream agent, I want any write, mutating command, reviewer
    evidence, or worktree creation to require a claim, so that meaningful side
    effects are governed.
36. As a workstream agent, I want to commit focused work on an ephemeral branch,
    so that my output can be reviewed, integrated, or abandoned cleanly.
37. As a workstream agent, I want to hand off stage completion with changed
    files, verification, blockers, next recommended stage, and cleanup readiness,
    so that PM can route the work without chat context.
38. As a landing agent, I want PM to route only policy-eligible work after gates
    pass, so that landing remains a specialized governed decision.
39. As a future PR-resolution agent, I want PR issue resolution and safe landing
    governance kept separate, so that this concurrency feature does not blur
    landing authority.
40. As a future PR-resolution agent, I want issue titles, PR descriptions,
    comments, reviews, and fetched references to enter as data-only external
    input, so that contributor-controlled text cannot become my instructions.
41. As a future cockpit, I want to read derived state from CLI-reconciled
    artifacts, so that the UI can visualize work without owning authority.
41. As a future cross-repo operator, I want the Repo PM Coordinator protocol to
    be reusable across projects, so that Bandit practices can spread after the
    CLI can update installed copies.
42. As a reviewer, I want all claim, recovery, PM, and worktree behavior tested
    through external command outcomes, so that coordination safety is not
    asserted only by implementation structure.

## Acceptance Criteria

- The feature is not enabled until the bootstrap-gap lane is complete, blocked,
  or explicitly dispositioned.
- True parallel writable workstreams remain disabled until the Parallel Write
  Authorization Gate passes.
- Default LLM polling for no-op discovery is rejected once event-driven triggers
  and deterministic sweeping satisfy the Work Availability Wake Guarantee.
- Runnable work, recovery-required work, and newly unblocked work wake the
  appropriate scheduler or agent path without operator babysitting.
- Claims, wakeups, sweeps, tool calls, reviewer runs, model calls, token spend,
  retries, failures, and outcomes emit or record OTel-compatible trace data.
- Paid, high-token, reviewer, scheduler, and long-running work carries a soft
  budget band, current provider-pricing evidence when paid, spend-class
  approval when paid, plus an abnormal-run token-cost failsafe, and any
  continuation after a failsafe trip is explicitly recorded.
- One-off paid reviewer or model calls before recurring policy promotion are
  recorded as benchmark/evaluation spend with per-run approval or active
  spend-class approval.
- Trace records correlate to work item ID, claim ID or wake decision, reviewer
  evidence, and relevant canonical artifact IDs where applicable.
- Trace data and observability projections cannot satisfy workflow gates or
  replace canonical repo artifacts.
- Projection freshness is reported through artifact-specific Evidence SLOs with
  source, owner, freshness state, and staleness reason.
- Append-only coordination history is the only canonical workflow history for a
  work item; derived current-state views, cockpit status, state indexes, and
  registries are rebuildable projections.
- A claim authority primitive exists for release-authorized writable claims and
  provides compare-and-swap semantics through the Git refs claim authority
  backend.
- An Authoritative In-Flight Registry exists for active claims and reservations
  as a projection from, or a CAS-protected view of, claim authority.
- Claim authority uses a `refs/bandit/*` namespace and `git update-ref --stdin`
  transactions for active writable claim state.
- `.bandit` claim files, in-flight registries, cockpit views, and indexes are
  projections and cannot grant or release claims.
- Append-only work-item history, claim authority, and registry projection must
  confirm each other before a claim is accepted.
- Any disagreement between claim authority, registry state, current-state view,
  and append-only work-item history fails closed into PM or CLI-owned mechanical
  repair or recovery workflow, and reaches the operator only when an
  operator-owned gate is actually missing.
- The CLI exposes a CAS-backed claim operation that either records one exclusive
  Work Claim Lease with a fencing token or fails without starting work.
- A claim reserves both work item plus stage and declared write surfaces.
- v0 allows at most one active claim per work item.
- Every runnable work item or chore declares expected write surfaces before it
  is claimable.
- The scheduler refuses claims with overlapping work surface reservations.
- Claimability builds a Work-Surface Wait-For Graph and refuses claims that
  would create or continue a cycle.
- A woken workstream activation can claim at most one runnable stage.
- Read-only inspection can run without a claim.
- Any write, mutation, reviewer-evidence write, handoff write, or worktree
  creation requires an active claim.
- Worktree creation happens only after a successful claim.
- Shared `.git` plumbing mutations for worktree and repository lifecycle go
  through the Git Mutation Serializer.
- Non-serialized shared `.git` plumbing mutation is refused by CLI policy.
- Claim-owned worktrees are `git worktree lock`ed immediately with a stable
  reason naming claim ID, Work Item ID, and stage.
- Worktree creation is incomplete until the lock succeeds.
- Worker execution starts only after Worktree Bootstrap Contract validation
  succeeds; a locked but unbootstrapped worktree is not runnable.
- The Worktree Bootstrap Contract records allowed copied or linked files, setup
  commands, validation command, environment-variable references,
  secret-handling boundary, expected runtime dependencies, and failure evidence.
- Secret material is not copied into worktrees by default; bootstrap uses
  references to approved secret sources unless existing operator-supervised
  policy authorizes a narrower exception.
- Only the Repo PM Coordinator unlocks claim-owned worktrees after handoff
  verification and cleanup routing.
- If worktree creation fails, the claim is released or marked failed with a
  PM-visible reason.
- Work Claim Leases include owner/session, work item, stage, declared surface,
  fencing token, worktree path when created, branch, claimed timestamp,
  expiration timestamp, renewal timestamp, status, and recovery metadata.
- State-changing claim operations require expected claim state, the current
  fencing token when one has been issued, and a claim idempotency key.
- External side-effecting operations performed under a claim record and verify
  the current fencing token plus an idempotency key so stale agents are
  rejected and retries cannot duplicate the effect.
- A same-key same-input retry returns the existing claim-operation result or an
  equivalent no-op result; a same-key different-input retry is refused.
- Declared Claim Safety Invariants cover claim, release, reconcile, stale
  expected state, stale fencing tokens, idempotency replay/conflict,
  projection/history disagreement, work-surface cycles, and failed serializer
  or worktree-lock cleanup under deterministic fault-injecting or
  property-style simulation.
- Two concurrent claim attempts for the same work item, stage, or declared write
  surface cannot both succeed under that simulation harness.
- Expired claims without unmerged work may be released by policy.
- Expired claims with unmerged changes become recovery-required and are not
  auto-deleted.
- Workstream agents can renew, complete, block, fail, and mark cleanup-ready,
  but cannot land or delete worktrees.
- Work Item PM Orchestrator verifies completed work was transferred correctly
  before shared-resource cleanup begins.
- Repo PM Coordinator controls integration routing, claim release, and worktree
  deletion, and can route eligible work to Landing Agent after gates pass.
- Landing Agent owns the landing verdict and action; workstream agents do not.
- The scheduler priority order is recovery-required claims, continuable active
  work, highest-priority unblocked queued work, deterministic tie-breakers, then
  eligible low-risk chores.
- The deterministic sweeper can detect stale claims, missed triggers, due
  evaluations, and blocker-state changes without waking an LLM for ordinary
  no-op checks.
- The project uses a single Work Intake Ledger for all proposed work, including
  chores, retrospective improvement candidates, feature ideas, reviewer
  follow-ups, operator requests, spawned work, deferred cleanup, and product
  questions.
- Work Intake Ledger entries record source, rationale, suggested Work Item type,
  dependency edges, scope, risk, product-scope status, and triage outcome.
- Work Intake Ledger entries expose current state for scanning and preserve
  transition history for decision provenance.
- Work Intake Ledger entries are maintained through agent-mediated operator
  workflows such as Work Intake Triage Skill and grill-with-docs; the operator
  is not expected to edit intake entries directly.
- Operator-facing Work Intake Ledger review requests invoke the Work Intake
  Triage Skill.
- Only Repo PM Coordinator and Work Intake Triage Skill mutate Work Intake
  Ledger triage state; other roles may propose entries or transitions.
- Work Intake Triage Skill records `accepted_to_queue` consensus; Repo PM
  Coordinator materializes it through the CLI-authoritative path by allocating a
  real Work Item ID, creating the initial artifact shell, linking it back to the
  proposal, and making it eligible for queueing and claimability checks.
- A single agent session may perform triage and materialization sequentially only
  if it records the triage decision before acting under Repo PM Coordinator
  authority.
- Materialization queues a Work Item but does not make it automatically
  claimable; dependency, declared-surface, scope, claim-conflict,
  work-surface-deadlock, and required approval gates still apply.
- A queued Work Item that is not claimable remains queued with a Claimability
  Report of `claimability: blocked` that lists all known blockers and names a
  deterministic `primary_blocker`.
- Claimability Report blockers include `missing_policy_approval`,
  `missing_product_or_operator_approval`, `recovery_required_claim`,
  `expired_claim`, `conflicting_active_claim`, `work_surface_deadlock`,
  `dependency`, `invalid_scope_or_acceptance`, and
  `missing_declared_write_surface`.
- Claimability Report primary blocker priority follows that same deterministic
  order, placing claim recovery state ahead of ordinary dependency blockers.
- Repo PM Coordinator may automatically repair mechanical claimability blockers
  only when approved artifacts already prove the answer.
- Operator-blocking fail-closed behavior is reserved for safety, product, UAT,
  policy, business, cost, irreversible-risk, and genuinely ambiguous scope
  gates; derivable operational drift is a CLI-owned mechanical repair path.
- `recovery_required_claim` is not mechanically repairable and always routes
  through claim/recovery protocol.
- `expired_claim` is mechanically repairable only when repo evidence proves
  there is no unmerged work and policy allows release.
- Expired claim release evidence includes claim record, worktree path and branch,
  clean worktree status, no untracked or staged changes, no commits ahead of the
  integration base unless already transferred, and policy allowing release.
- The expired claim release rationale is generated from evidence, briefly states
  why release is safe, and is recorded in the mechanical-repair
  transition-history entry.
- The Claimability Report may reference the mechanical-repair transition-history
  entry ID; it does not own a separate release-rationale artifact.
- Missing or ambiguous expired claim release evidence converts `expired_claim` to
  `recovery_required_claim` instead of releasing it.
- Every automatic mechanical claimability repair is one atomic
  CLI-authoritative operation: apply the state change, append transition
  history, assign and return the transition-history entry ID, recompute the
  Claimability Report once, or apply nothing.
- Atomic mechanical claimability repair requires expected-current-state inputs:
  observed Claimability Report ID or hash, observed blocker state, and observed
  target Work Item state; stale-state mismatch refuses without changes and
  requires reread and recompute.
- Every automatic mechanical claimability repair records transition history with
  actor, source evidence, fields changed, before and after values, and the
  blocker cleared.
- Mechanical-repair transition-history entry IDs are assigned atomically by the
  CLI-authoritative append operation and returned for references; agents do not
  author stable transition IDs directly.
- Mechanical-repair transition-history entries are immutable once written;
  corrections append a new transition or amendment entry referencing the
  original transition-history entry ID.
- After an automatic mechanical claimability repair, Repo PM Coordinator
  recomputes the Claimability Report once.
- If blockers remain after the recompute, the Work Item stays queued with the
  updated Claimability Report.
- If blockers clear after the recompute for new queued work, Repo PM Coordinator
  marks the Work Item claimable and leaves selection to the regular Single-Claim
  Heartbeat scheduler.
- Repo PM Coordinator does not immediately assign new claimable work or wake a
  worker lane for that new work.
- A Work Item is already in progress only if it has an existing Work Item PM
  Orchestrator context and prior non-terminal lifecycle evidence.
- In-progress lifecycle evidence includes active claim, blocked stage,
  cleanup-ready handoff, review-feedback loop, or equivalent non-terminal state.
- Newly materialized queued work is not in progress.
- If an in-progress Work Item cannot be resumed, it remains blocked.
- `recovery_required_claim` or `expired_claim` prevents Work Item PM Orchestrator
  wake.
- If blockers clear for an in-progress Work Item, Repo PM Coordinator may wake
  that Work Item PM Orchestrator to resume orchestration, but it does not acquire
  a Work Claim Lease or start execution.
- Work Item PM wake payload includes Work Item ID, cleared blocker, updated
  Claimability Report ID or hash, resume reason, and timestamp.
- Work Item PM Orchestrator does not clear leases, recover worktrees, or claim
  replacement work.
- Repo PM Coordinator does not run repeated repair-and-recompute loops in one
  activation.
- Repo PM Coordinator must not invent product scope, grant approvals, override
  policy, break dependencies, or force-resolve conflicting claims to make queued
  work claimable.
- Non-mechanical claimability repairs become a Work Item Proposal or Operator
  Inbox entry.
- `accepted_deferred` entries remain non-claimable Work Item Proposals until a
  later promotion decision records `accepted_to_queue`.
- Work Intake Triage Skill exists and guides operator review one item at a time,
  with clarifying questions and recorded consensus outcomes.
- Work Intake Triage Skill ranks entries before presentation using effort,
  impact, risk, dependencies, operator-boundary status, and changed-context
  signals.
- Low-effort/high-impact proposals float to the top unless stronger risk,
  dependency, or operator-boundary evidence says otherwise.
- Triage ranking is advisory and records rationale; explicit operator overrides
  are honored after brief challenge or clarification when useful.
- Lightweight override learning signals may be recorded when cheap, but missing
  override telemetry does not block triage.
- Work Intake Triage Skill processes prioritized new or untriaged entries before
  offering a deferred-item revisit list.
- Work Intake Triage Skill may end before the full list is exhausted, but no
  presented item is silently skipped.
- Work Intake Triage Skill emphasizes accepted-deferred entries when earlier
  work makes them materially lower effort or higher impact.
- Promoting `accepted_deferred` to `accepted_to_queue` requires operator
  confirmation after presenting the prior decision, current evidence, and
  changed context.
- Superseded intake surfaces are imported into the Work Intake Ledger, marked
  deprecated during migration, and removed after validation proves no item was
  lost.
- Repo PM Coordinator protocol exists as a global skill with a clear checklist,
  authority envelope, required reads, allowed writes, pause rules, escalation
  rules, and handoff obligations.
- Bandit-specific Repo PM Coordinator integration is layered as a repo adapter,
  not as the global protocol itself.
- Repo PM Coordinator may edit PM-owned operational surfaces and coordination
  artifacts but may not write production code or implement product changes.
- Repo PM Coordinator may mark work claimable, pause or resume worker heartbeats,
  and wake Work Item PM Orchestrators for unblocked in-progress work, but must
  never acquire work claims, execute work, or immediately assign new work.
- Role authority boundaries apply to every agent role. Coordination roles do not
  implement or claim, worker roles do not govern intake or landing, reviewer
  roles do not land, and landing roles do not invent missing product or policy
  approval.
- Bandit's default authority roles are Operator, PM or Coordinator, Worker,
  Reviewer, and Landing; capability differences are configured through
  per-stage skill/tool scopes and capability profiles unless a different
  authority boundary is required.
- Claimable stages declare their Stage Capability Scope before worker or
  reviewer execution begins.
- Repo PM Coordinator can pause/resume Workstream Agent heartbeat through
  explicit automation control paths.
- Repo PM Coordinator may pause its own recurring automation only when all
  self-pause preconditions are met and an Operator Inbox entry records why it
  paused, what input is needed, which heartbeats are paused, and how the
  operator re-engages.
- Only the operator may unpause paused heartbeats.
- The Operator Inbox is strictly PM-to-operator and operator-to-PM. Workstream
  agents do not read it.
- In the file-based era, Repo PM Coordinator writes operator-visible
  coordination messages to the Operator Inbox instead of using a separate
  proactive notification channel.
- Repo PM Coordinator translates operator decisions into work artifacts and
  removes or archives resolved Operator Inbox entries.
- Work Item PM Orchestrators may propose follow-up Work Items and `spawns`
  dependency edges from owned orchestration surfaces, but those proposals are
  not globally claimable until accepted by the Repo PM Coordinator.
- Automation `MEMORY.md` required fields are defined for Repo PM Coordinator and
  Workstream automations.
- Canonical decisions affecting repo state are written to repo artifacts even
  when automation memory records the reasoning.
- Product-scope changes require grill-with-docs before work items are created.
- The implementation fails closed when policy, registry projection, append-only
  work-item history, claim authority, automation status, declared surfaces, or
  worktree state cannot be reconciled, but the destination is PM/CLI repair for
  derivable operational drift and operator input only for operator-owned gates.

## Implementation Decisions

- Build the feature after bootstrap. This PRD is planning output only and must
  not reroute the current active bootstrap work.
- Preserve CLI Authority. Agents, skills, automations, cockpit views, and
  indexes call or read the CLI contract; they do not manually mutate canonical
  coordination state.
- Treat append-only per-work-item coordination history as the canonical
  workflow history and reject hidden authority in derived current-state views,
  cockpit status, state indexes, or registries.
- Treat the claim authority primitive as the release-authorized write path for
  exclusive writable claims.
- Implement the first claim authority primitive as the Git refs claim authority
  backend described in
  `docs/decisions/2026-05-27-git-refs-claim-authority-backend.md`.
- Store active claim authority in `refs/bandit/*` and perform claim state
  changes through `git update-ref --stdin` compare-and-swap transactions.
- Treat the Authoritative In-Flight Registry as a projection from, or a
  CAS-protected view of, claim authority for active claims and reservations.
- Treat `.bandit` in-flight or claim files as Claim Projection Artifacts:
  readable, rebuildable, and invalid as authority for granting claims.
- Treat per-work-item coordination projections as derived from append-only
  history unless the CAS claim authority primitive is actively granting or
  refusing a writable claim.
- Require claim reconciliation to confirm claim authority, registry projection,
  and append-only per-work-item coordination history before work starts.
- Require each successful writable claim to issue a monotonic fencing token.
- Require state-changing claim operations and external side-effecting operations
  under a claim to prove the current fencing token and provide a claim
  idempotency key so stale agents are rejected and retries cannot duplicate
  effects.
- Define Claim Safety Invariants for claim, release, reconcile, worktree-lock,
  and claim-gated side-effect correctness, and require deterministic
  fault-injecting or property-style simulation before release authorization.
- Use a deep claim coordination module with a small public interface for claim,
  renew, release, fail, block, complete, recover, and inspect operations.
- Use a deep work-surface reservation module to normalize declared surfaces,
  detect overlap, detect wait-for graph cycles, and explain collisions or
  deadlocks.
- Use a Git Mutation Serializer module for shared `.git` plumbing mutations
  needed by worktree lifecycle and repository maintenance.
- Use claim-owned worktree locks for every created claim worktree, with lock
  failure treated as worktree creation failure.
- Use a Worktree Bootstrap Contract module or policy adapter so a locked
  Bandit-created worktree is not considered runnable until setup and validation
  succeed.
- Use a deterministic scheduler module that ranks candidates from reconciled
  state and returns at most one claimable stage.
- Use event-driven work triggers for ordinary work availability wakeups and a
  deterministic non-LLM sweeper for stale claims, missed triggers, due
  evaluations, and blocker-state changes.
- Treat LLM polling for no-op discovery as a fallback only until the Work
  Availability Wake Guarantee is proven.
- Emit OTel-compatible agent traces from CLI-owned claim, scheduler, reviewer,
  tool-execution, and workstream operations.
- Treat observability projections as analysis and debugging surfaces, not as
  workflow authority.
- Use a Repo PM Coordinator protocol module or skill boundary separate from worker
  execution logic.
- Use a heartbeat automation control adapter for pause/resume/status rather than
  letting PM write raw automation internals ad hoc.
- Use a worktree lifecycle module that enforces claim-first worktree creation,
  Work Item PM Orchestrator handoff verification, and Repo PM Coordinator-only
  cleanup.
- Use explicit state values for claims, including active, renewing, blocked,
  failed, completed, cleanup-ready, recovery-required, released, and expired.
- Do not make stale timeout cleanup destructive. Recovery-required work must be
  surfaced to PM.
- Keep `OPERATOR.md` as the compact file-backed Operator Inbox in the file-based
  era. It is not an append-only board and is not part of workstream context.
- Defer richer operator notification and interruption behavior to future GUI or
  cockpit work; v0 records messages in the Operator Inbox.
- Keep `CURRENT_CONTEXT.md` as PM-owned operational context. PM may edit it
  freely to preserve next-action routing.
- Keep `CONTEXT.md` for durable vocabulary and grill-with-docs artifacts.
  Routine Repo PM Coordinator state does not belong there.
- Use automation `MEMORY.md` as v0 audit and memory surface. Required fields
  should include repo, automation role, allowed reads, allowed writes, pause
  authority, last claim or PM decision, open operator escalations, and blocked
  state summary.
- Keep model reasoning choices at automation creation time for v0. Repo PM
  Coordinator uses high reasoning because it analyzes and routes; delegated
  implementation uses the reasoning profile configured for its own heartbeat.
- Allow Work Item PM Orchestrators to propose follow-up Work Items only into the
  Work Intake Ledger or their owned orchestration surfaces that feed it.
- Allow Repo PM Coordinator to accept Work Intake Ledger entries as chores or
  feature slices only when product scope is already documented. New product-scope
  direction requires grill-with-docs.
- Allow PM to pick up the next eligible chore when no runnable work item exists.
- Require Bandit CLI installation/update support before relying on the global
  Repo PM Coordinator skill across multiple repositories.
- Scope v0 to one Bandit-governed repository at a time. Cross-repo coordination
  is future work.

## Testing Decisions

- Tests should verify observable CLI behavior, artifact state, refusal paths,
  reconciliation results, scheduler decisions, and worktree lifecycle effects.
  They should not assert incidental parser or helper internals.
- Test the claim coordination module with successful claims, duplicate claims,
  CAS mismatch refusal, fencing-token issuance, stale-token rejection,
  idempotent replay, idempotency-key mismatch refusal, conflicting
  registry/history state, lease renewal, release, completion, blocking,
  failure, expiration, and recovery-required behavior.
- Add deterministic fault-injecting or property-style claim authority tests that
  assert Claim Safety Invariants across concurrent claims, release, reconcile,
  stale reads, pauses, CAS mismatch, stale fencing tokens, idempotency replay
  and conflict, projection/history disagreement, wait-for cycles, serializer
  contention, and worktree lock failure.
- Test the work-surface reservation module with exact path conflicts, ancestor
  and descendant conflicts, named resource conflicts, non-overlapping claims,
  wait-for graph cycles, normalized path equivalence, and readable conflict or
  deadlock messages.
- Test the Git Mutation Serializer with contending worktree and repository
  plumbing operations, refusal of non-serialized shared `.git` mutations, stale
  lock or timeout behavior, and failure cleanup.
- Test claim-owned worktree locking with reason contents, lock failure cleanup,
  Repo PM Coordinator-only unlock, and refusal of worker-owned unlock.
- Test Worktree Bootstrap Contract behavior for allowed copy/link entries,
  setup command execution, validation command execution, environment-variable
  references, secret-copy refusal, bootstrap failure evidence, and refusal to
  execute worker mutations in a locked but unbootstrapped worktree.
- Test scheduler behavior with recovery-first ordering, continuation ordering,
  unblocked priority ordering, deterministic tie-breakers, eligible chore
  fallback, no-op behavior, and fail-closed ambiguous state.
- Test Work Availability Wake Guarantee behavior for newly claimable work,
  recovery-required work, newly unblocked in-progress work, missed trigger
  recovery, and deterministic no-op sweeps without LLM execution.
- Test trace emission and correlation for claim operations, wake decisions,
  deterministic sweeps, tool calls, reviewer runs, model calls, token spend,
  failures, retries, and outcome records.
- Test that trace data cannot replace required canonical workflow artifacts or
  satisfy landing gates.
- Test Repo PM Coordinator behavior through command outcomes or skill protocol
  fixtures: required reads, allowed writes, operator escalation, self-pause
  preconditions, Workstream heartbeat pause/resume, refusal to claim work, and
  refusal to implement product scope.
- Test role authority boundaries across coordinator, worker, reviewer, and
  landing fixtures.
- Test Workstream Agent behavior with claim-first worktree start, failed
  worktree creation or lock cleanup, lease renewal, Work Item PM Orchestrator
  handoff summary, cleanup-ready marking, and refusal to land, unlock, or delete
  worktrees.
- Test Operator Inbox contract behavior through Repo PM Coordinator protocol
  tests that consume operator responses and translate decisions into work
  artifacts.
- Test automation `MEMORY.md` setup requirements without treating memory as
  canonical repo state.
- Reuse existing Bandit command tests, validator tests, work-item tests, landing
  gate tests, auto-land policy tests, and artifact creation tests as prior art.
- Add validation tests that detect claim authority/registry/history
  disagreement, duplicate active claims, undeclared work surfaces, overlapping
  reservations, work-surface wait-for cycles, stale leases, stale fencing
  tokens, missing or conflicting idempotency keys, non-serialized shared `.git`
  mutations, unlocked claim-owned worktrees, and cleanup-ready worktrees
  awaiting Work Item PM Orchestrator verification.
- Run focused tests for each slice, then `npm test`, `npm run typecheck`,
  `npm run bandit -- validate`, relevant claim/scheduler validation commands,
  relevant landing checks, and `git diff --check`.

## Out Of Scope

- Current bootstrap implementation work.
- Any direct implementation of this feature before the bootstrap queue allows
  it.
- Database-backed coordination storage.
- GUI/cockpit work surface.
- Cross-repo scheduling.
- Centralized authority over self-governing repositories.
- Dynamic model/reasoning selection by PM per delegated stage.
- Paid provider routing changes.
- Automatic PR resolution.
- Remote merge, push, deploy, or CI/CD governance.
- Workstream-owned landing.
- Workstream-owned worktree deletion.
- Product-scope creation without grill-with-docs.
- General agent access to the Operator Inbox.

## Test Or Verification Strategy

The implementation should be decomposed into slices that each produce RED
evidence before production code. The safest first slice is the global Repo PM
Coordinator protocol and Operator Inbox contract because parallel claims depend
on a control-plane role that can safely pause, recover, and escalate work.

Verification should combine:

- Unit-level command tests for claim, scheduler, registry, and worktree behavior.
- Validator tests for conflicting canonical state.
- Protocol tests for Repo PM Coordinator and Workstream Agent boundaries.
- Fixture-based tests for `OPERATOR.md` Operator Inbox, `CURRENT_CONTEXT.md`, automation
  `MEMORY.md`, and handoff summaries.
- Integration, property, or deterministic simulation tests that exercise Claim
  Safety Invariants across concurrent claims, release, reconcile, retries,
  pauses, stale tokens, idempotency replay/conflict, projection disagreement,
  wait-for cycles, and worktree/serializer failure paths.
- Manual dry runs only for automation platform pause/resume behavior until that
  path has a deterministic local test harness.

## Decomposition Notes

Implementation should wait until the active bootstrap-gap lane is complete,
blocked, or explicitly dispositioned. The first slice should define the Repo PM
Coordinator protocol and Operator Inbox contract before enabling parallel
workstreams.

Major modules to build or modify:

- Repo PM Coordinator global skill and Bandit adapter.
- Operator Inbox contract.
- Automation memory setup contract.
- Work Intake Ledger.
- Work Intake Triage Skill.
- Work item declared-surface metadata.
- Authoritative In-Flight Registry.
- Claim reconciliation and lease operations.
- Work surface reservation overlap and wait-for cycle detection.
- Git Mutation Serializer.
- Scheduler candidate selection.
- Claim-first worktree lifecycle.
- Workstream handoff summary contract.
- Work Item PM Orchestrator handoff verification.
- Repo PM Coordinator cleanup and integration routing.
- Automation pause/resume adapter.
- Validation and reporting commands.

Proposed work draft:

```bandit-work-draft
{
  "items": [
    {
      "kind": "slice",
      "title": "Repo PM Coordinator Protocol And Operator Inbox",
      "goal": "Define the global Repo PM Coordinator protocol, Bandit adapter, OPERATOR.md Operator Inbox contract, and automation memory setup requirements before parallel execution begins.",
      "scope": [
        "Create the Repo PM Coordinator authority envelope, required reads, allowed writes, pause rules, self-pause preconditions, and operator escalation workflow.",
        "Define role authority boundaries so the Repo PM Coordinator can mark work claimable and notify or trigger worker lanes but cannot acquire claims, execute work, review as reviewer, or land.",
        "Define the small authority-role set and the rule that stage-specific skills and tools are Stage Capability Scope, not separate agent roles.",
        "Define how Stage Capability Scope references load-bearing skills by lifecycle contract and version.",
        "Allow Stage Capability Scope to declare soft budget bands, token-cost failsafes, provider-pricing evidence requirements, benchmark/evaluation spend approvals, spend-class approvals, and continuation paths for paid, high-token, reviewer, or long-running stages.",
        "Define OPERATOR.md as a compact Operator Inbox with operator response handling and resolution rules.",
        "Define file-era operator-visible coordination as Operator Inbox messages, with richer notification behavior deferred to future GUI or cockpit work.",
        "Define required automation MEMORY.md fields for Repo PM Coordinator and Workstream automations.",
        "Record Bandit adapter responsibilities without making the global Repo PM Coordinator skill Bandit-only."
      ],
      "out_of_scope": [
        "Do not implement claim leases, worktree creation, or scheduler execution.",
        "Do not write production code outside protocol and validation surfaces.",
        "Do not create product-scope work without documented product scope."
      ],
      "acceptance_criteria": [
        "Repo PM Coordinator protocol names required reads, allowed writes, forbidden actions, pause authority, self-pause preconditions, and escalation duties.",
        "Repo PM Coordinator is forbidden from acquiring work claims, starting execution, acting as reviewer, or landing work.",
        "Role authority boundary tests prove coordinator, worker, reviewer, and landing roles cannot perform each other's governed actions.",
        "The protocol rejects new role names that only express skills, tools, reviewer depth, model tier, or prompt behavior.",
        "Claimable-stage examples show skills and tools scoped through Stage Capability Scope.",
        "Claimable-stage examples reference load-bearing skills by lifecycle contract and version.",
        "Claimable-stage examples show budget failsafes as abnormal-run guardrails rather than tight execution caps.",
        "Operator Inbox contract is strictly operator-facing and excludes Workstream Agent context.",
        "Repo PM Coordinator writes operator-visible coordination messages to the Operator Inbox rather than a separate notification channel in v0.",
        "Resolved operator entries have a required artifact translation and archive or removal rule.",
        "Automation MEMORY.md required fields are defined without becoming canonical workflow state.",
        "The protocol refuses product-scope creation without grill-with-docs output."
      ],
      "test_plan": [
        "Run focused validation tests for Repo PM Coordinator protocol required fields, forbidden actions, refusal to claim work, role authority boundaries, small authority-role set, and stage capability scoping.",
        "Run fixture tests for Operator Inbox entries, file-era coordination messages, operator responses, and resolution flow.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; the protocol must preserve explicit authority, failure clarity, and no role erosion.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 1: Work-Item Brief And Spec",
          "verdict": "pass",
          "evidence": "The slice defines PM authority, operator escalation, and no-implementation boundaries before code."
        },
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Protocol fixtures and validation tests must fail before implementation."
        }
      ],
      "bootstrap_gaps": [
        "Parallel workstream execution remains disabled until bootstrap is complete.",
        "Automation pause/resume may require manual dry-run evidence until locally testable."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        "OPERATOR.md",
        "docs/templates/operator-inbox.md",
        "docs/templates/automation-memory.md"
      ],
      "first_implementation_order": [
        "Write protocol and inbox fixture tests.",
        "Add templates and validation rules.",
        "Document global skill requirements and Bandit adapter responsibilities.",
        "Record implementation evidence and run validation."
      ],
      "smell_triggers": [
        "Repo PM Coordinator must not become implementation agent.",
        "Any agent performing another role's governed action for convenience.",
        "A new agent role introduced only to express a skill, tool, reviewer depth, model tier, or prompt behavior.",
        "A claimable stage without scoped skills and tools.",
        "A required load-bearing skill without lifecycle contract, version, evaluation packets, or rollback criteria.",
        "A claimable paid or high-token stage without current provider-pricing evidence, per-run approval or active spend-class approval for benchmark/evaluation spend, or an abnormal-run token-cost failsafe.",
        "Operator Inbox must not become general agent context.",
        "Automation MEMORY.md must not become hidden canonical state."
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "No operator input is required if this PRD is accepted; product-scope questions must route through grill-with-docs."
    },
    {
      "kind": "slice",
      "title": "Work Intake Ledger And Triage Skill",
      "goal": "Replace scattered follow-up, chore, retrospective, feature, review, and deferred-work proposal surfaces with one Work Intake Ledger and an operator-guided triage skill.",
      "scope": [
        "Define a single Work Intake Ledger schema with source, rationale, suggested Work Item type, proposed dependency edges, scope, risk, product-scope status, current triage outcome, and transition history.",
        "Define accepted_to_queue, accepted_deferred, needs_more_info, needs_operator, declined, duplicate, and superseded outcomes.",
        "Make the v0 ledger agent-maintained from guided operator workflows rather than requiring direct operator edits.",
        "Require operator-facing Work Intake Ledger review requests to invoke the Work Intake Triage Skill.",
        "Restrict Work Intake Ledger triage-state mutation to the Repo PM Coordinator and Work Intake Triage Skill; other roles may only propose entries or proposed transitions.",
        "Define the boundary where Work Intake Triage Skill records accepted_to_queue consensus and Repo PM Coordinator materializes the accepted proposal through the CLI-authoritative path.",
        "Separate Work Item materialization from claimability; materialized Work Items must still satisfy dependency, declared-surface, scope, claim-conflict, and required-approval gates before claim.",
        "Define Claimability Report output for queued Work Items that are not claimable, including claimability: blocked, all known blockers, explicit blocker values, deterministic primary_blocker, and no separate blocked queue.",
        "Define the operator-blocking fail-closed boundary: product, UAT, policy, business, cost, irreversible-risk, and genuinely ambiguous scope gates go to the operator; derivable operational drift goes to CLI-owned mechanical repair.",
        "Allow Repo PM Coordinator to repair mechanical claimability blockers only when approved artifacts already prove the fix; route non-mechanical repairs to Work Item Proposal or Operator Inbox.",
        "Route recovery_required_claim through claim/recovery protocol; allow expired_claim mechanical repair only when repo evidence proves no unmerged work and policy allows release.",
        "Require expired_claim release evidence: claim record, worktree path and branch, clean worktree status, no untracked or staged changes, no commits ahead of integration base unless already transferred, and policy allowing release.",
        "Record generated expired_claim release rationale in the mechanical-repair transition-history entry without requiring operator-authored text.",
        "Allow Claimability Report to reference the mechanical-repair transition-history entry ID rather than owning a separate release-rationale artifact.",
        "Convert expired_claim to recovery_required_claim when expired-claim release evidence is missing or ambiguous.",
        "Require every automatic mechanical claimability repair to run as one atomic CLI-authoritative operation that applies the state change, appends transition history, assigns and returns the transition-history entry ID, recomputes Claimability Report once, or applies nothing.",
        "Require atomic mechanical repair requests to include expected current state: observed Claimability Report ID or hash, observed blocker state, and observed target Work Item state.",
        "Require every automatic mechanical claimability repair to record transition history with actor, source evidence, fields changed, before and after values, and blocker cleared.",
        "Assign mechanical-repair transition-history entry IDs through the CLI-authoritative append operation and return them for Claimability Report references.",
        "Make mechanical-repair transition-history entries immutable; corrections append a transition or amendment entry referencing the original transition-history entry ID.",
        "After automatic mechanical repair, recompute Claimability Report once and leave remaining blockers queued with the updated report; do not loop repair/recompute in one activation.",
        "When recompute clears blockers for new queued work, mark the Work Item claimable and leave selection to regular Single-Claim Heartbeat scheduling rather than immediate assignment or worker wake.",
        "Define in-progress Work Item as existing Work Item PM Orchestrator context plus non-terminal lifecycle evidence; newly materialized queued work is excluded.",
        "Define non-resumable in-progress work as still blocked; recovery_required_claim or expired_claim prevents Work Item PM wake.",
        "When recompute clears every blocker for an in-progress Work Item, allow Repo PM Coordinator to wake that Work Item PM Orchestrator to resume orchestration without acquiring a claim or starting execution.",
        "Define Work Item PM wake payload with Work Item ID, cleared blocker, updated Claimability Report ID or hash, resume reason, and timestamp.",
        "Forbid Work Item PM Orchestrator from clearing leases, recovering worktrees, or claiming replacement work.",
        "Add a Work Intake Triage Skill that ranks entries before presentation, floats low-effort/high-impact opportunities, walks the operator through prioritized new or untriaged entries first, presents evidence, asks clarifying questions, records consensus, then offers accepted_deferred entries for optional revisit.",
        "Make triage ranking advisory: the skill records ranking rationale, may briefly challenge an override, and honors explicit operator choice.",
        "Capture only lightweight override metadata that is already available from the triage flow; defer richer ranking-learning instrumentation to a later Work Item Proposal if it adds workflow complexity.",
        "Allow triage sessions to end before the full list is exhausted, while preserving explicit state for skipped or unresolved entries.",
        "Emphasize accepted_deferred entries when earlier work makes them materially lower effort or higher impact.",
        "Define migration from FOLLOWUPS.md, work-item follow-up candidate files, and the prior chore-only ledger plan into the Work Intake Ledger.",
        "Deprecate superseded intake surfaces during migration and remove them after validation proves every item has an intake outcome.",
        "Expose read-only listing and validation for intake status and claimability boundaries."
      ],
      "out_of_scope": [
        "Do not run accepted work automatically.",
        "Do not implement work claim leases.",
        "Do not change product scope without documented PRD input."
      ],
      "acceptance_criteria": [
        "All proposed work types are represented in one Work Intake Ledger rather than separate proposal surfaces.",
        "The ledger can distinguish untriaged proposals, active-queue acceptances, approved deferred items, needs_more_info items, operator-needed items, declined items, duplicates, and superseded items.",
        "The ledger exposes current entry state while preserving transition history with actor, timestamp, rationale, from state, and to state.",
        "Operator-originated feature ideas and issues can enter through grill-with-docs or Work Intake Triage Skill without direct operator edits to ledger files.",
        "An operator-facing request to review the Work Intake Ledger starts the Work Intake Triage Skill rather than ad hoc raw-ledger review.",
        "Validation rejects triage-state mutations from roles other than Repo PM Coordinator or Work Intake Triage Skill.",
        "accepted_to_queue is recorded as triage consensus before the Repo PM Coordinator allocates a real Work Item ID, creates an initial artifact shell, links back to the proposal, and makes the Work Item eligible for queueing and claimability checks.",
        "If one agent session performs both triage and materialization, evidence preserves the role boundary and ordering.",
        "A materialized Work Item is not claimable until recovery_required_claim, expired_claim, dependency graph, declared-surface, scope and acceptance criteria, active-claim conflict, work-surface-deadlock, and required-approval checks pass.",
        "A materialized Work Item that fails claimability remains queued with claimability: blocked, blockers, and primary_blocker, not a separate blocked queue.",
        "Claimability Report blockers cover missing_policy_approval, missing_product_or_operator_approval, recovery_required_claim, expired_claim, conflicting_active_claim, work_surface_deadlock, dependency, invalid_scope_or_acceptance, and missing_declared_write_surface.",
        "Claimability Report primary_blocker is selected deterministically in that priority order, with recovery_required_claim and expired_claim ahead of ordinary dependency blockers.",
        "Repo PM Coordinator can repair missing declared write surfaces or normalize scope and acceptance metadata only when approved PRDs, briefs, or work artifacts prove the answer.",
        "Derivable operational drift is repaired through CLI-owned mechanical repair or PM disposition, not routed to the Operator Inbox as missing operator input.",
        "Repo PM Coordinator cannot mechanically repair recovery_required_claim.",
        "Repo PM Coordinator can mechanically repair expired_claim only when repo evidence proves no unmerged work and policy allows release.",
        "expired_claim mechanical release requires claim record, worktree path and branch, clean worktree status, no untracked or staged changes, no commits ahead of integration base unless already transferred, and policy allowing release.",
        "expired_claim release rationale is generated from evidence, briefly explains why release is safe, and is recorded in the mechanical-repair transition-history entry.",
        "Claimability Report references the mechanical-repair transition-history entry ID instead of owning a separate release-rationale artifact.",
        "Missing or ambiguous expired_claim release evidence converts the blocker to recovery_required_claim.",
        "Automatic mechanical claimability repair is all-or-nothing: no repaired state without transition history, no transition history without repaired state, and no stale Claimability Report after a successful repair.",
        "Atomic mechanical repair fails closed with no changes when expected current state differs from repo state, and the Repo PM Coordinator must reread and recompute before retrying.",
        "Automatic mechanical claimability repairs record actor, source evidence, fields changed, before and after values, and blocker cleared in transition history.",
        "Repo PM Coordinator submits proposed mechanical-repair transition content, while the CLI append operation assigns the stable transition-history entry ID atomically and returns it for references.",
        "Validation rejects agent-authored stable transition-history entry IDs for mechanical repairs.",
        "Mechanical-repair transition-history entries are immutable once written; corrections append a new transition or amendment entry referencing the original transition-history entry ID.",
        "After an automatic mechanical repair, Claimability Report is recomputed exactly once and remaining blockers keep the Work Item queued with an updated report.",
        "If recompute clears blockers for new queued work, Repo PM Coordinator marks the Work Item claimable and normal Single-Claim Heartbeat scheduling decides whether it is the next highest-priority claim.",
        "Repo PM Coordinator does not immediately assign new claimable work or wake a worker lane for that new work.",
        "A Work Item is in progress only with existing Work Item PM Orchestrator context and prior non-terminal lifecycle evidence.",
        "Newly materialized queued Work Items are not in progress.",
        "An in-progress Work Item that cannot be resumed remains blocked.",
        "recovery_required_claim or expired_claim prevents Work Item PM wake.",
        "If recompute clears every blocker for an in-progress Work Item, Repo PM Coordinator may wake that Work Item PM Orchestrator to resume orchestration without claiming or executing the work.",
        "Work Item PM wake payload contains Work Item ID, cleared blocker, updated Claimability Report ID or hash, resume reason, and timestamp.",
        "Work Item PM Orchestrator cannot clear leases, recover worktrees, or claim replacement work.",
        "Validation rejects repeated repair-and-recompute loops in one Repo PM Coordinator activation.",
        "Repo PM Coordinator cannot invent product scope, grant approvals, override policy, break dependencies, or force-resolve conflicting claims to clear claimability.",
        "Validation flags operator escalations for derivable operational drift and mechanical repairs that attempt to cross an operator-owned gate.",
        "Claimability blockers that are not mechanically repairable produce a Work Item Proposal or Operator Inbox entry.",
        "accepted_deferred remains a non-claimable Work Item Proposal until later promotion.",
        "Work Intake Triage Skill records operator consensus and clarifying-question answers before a proposal becomes claimable.",
        "Work Intake Triage Skill ranks entries and floats low-effort/high-impact opportunities before presenting them.",
        "Operator can override the suggested triage order; the skill records the override and continues without blocking.",
        "Missing optional override-learning metadata does not block a triage outcome.",
        "Work Intake Triage Skill processes prioritized new or untriaged entries before offering an accepted_deferred revisit list.",
        "Work Intake Triage Skill may end without exhausting the full list, but presented entries are never silently skipped.",
        "Work Intake Triage Skill emphasizes accepted_deferred entries when changed context makes them materially lower effort or higher impact.",
        "accepted_deferred promotion requires the prior decision, current evidence, changed context, and operator confirmation.",
        "Imported FOLLOWUPS.md entries, work-item follow-up candidate files, and chore-only candidates have preserved source metadata and intake outcomes.",
        "Superseded intake surfaces are marked deprecated and removed after migration validation.",
        "Validation fails closed on missing source, rationale, scope, risk, product-scope status, or triage outcome."
      ],
      "test_plan": [
        "Run focused Work Intake Ledger parser, transition-history, role-authority, materialized-but-not-claimable, Claimability Report explicit blocker values, multi-blocker and primary_blocker priority, recovery_required_claim non-mechanical routing, expired_claim release evidence, expired_claim transition-history rationale, expired_claim safe mechanical repair, expired_claim missing-evidence conversion, mechanical repair transition history, atomic repair rollback, expected-current-state mismatch refusal, CLI-assigned repair-transition IDs, immutable repair-transition amendment behavior, Claimability Report repair-transition reference, recompute-once behavior, new-work waits for normal heartbeat scheduling, in-progress detection, blocked-state prevents PM wake, Work Item PM wake payload, Work Item PM recovery-action refusal, coordinator-refuses-claim behavior, non-mechanical repair routing, and validator tests.",
        "Run Work Intake Triage Skill fixture tests for review-request routing, ranking, low-effort/high-impact ordering, operator order override, override without optional learning metadata, new-first ordering, partial-session stop behavior, clarifying questions, consensus capture, accepted_to_queue consensus before coordinator materialization, accepted_deferred, deferred revisit prompts, deferred promotion confirmation, changed-context deferred emphasis, needs_more_info, needs_operator, declined, duplicate, and superseded outcomes.",
        "Run migration fixture tests for FOLLOWUPS.md and work-item follow-up candidate imports.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; the intake ledger must keep explicit state and avoid hidden authority.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Intake eligibility, triage, migration, and validation refusal tests must exist before implementation."
        }
      ],
      "bootstrap_gaps": [
        "Parallel workstream execution remains disabled until claim and worktree slices land."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        "docs/templates/work-intake-entry.md",
        "docs/templates/work-intake-triage.md"
      ],
      "first_implementation_order": [
        "Write failing validation tests for intake metadata and migration.",
        "Add intake ledger schema and fixtures.",
        "Add read-only listing and Work Intake Triage Skill behavior.",
        "Run validation and update evidence."
      ],
      "smell_triggers": [
        "Separate proposal surfaces reappearing as parallel sources of truth.",
        "Claimability inferred from prose instead of intake outcome."
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "No operator input is required for ledger mechanics; product-scope triage must escalate when needed."
    },
    {
      "kind": "slice",
      "title": "Coordination Event Log Authority",
      "goal": "Make append-only coordination history the canonical workflow history and keep current-state, registry, cockpit, and index surfaces rebuildable projections except for CAS claim authority.",
      "scope": [
        "Define canonical coordination history as append-only per-work-item workflow and accepted coordination events.",
        "Define derived current-state views, cockpit status, state indexes, and ordinary registry reads as rebuildable projections.",
        "Define the CAS claim authority primitive as the only active writable-claim authority.",
        "Define reconciliation rules between append-only history, projections, and claim authority.",
        "Reject direct mutation paths that make a projection independent workflow authority."
      ],
      "out_of_scope": [
        "Do not implement CAS claim operations.",
        "Do not implement scheduler execution.",
        "Do not introduce a database or hosted event store."
      ],
      "acceptance_criteria": [
        "A work item's workflow state can be rebuilt from append-only coordination history.",
        "Current-state views, cockpit status, state indexes, and registry reads identify their source history or claim-authority input.",
        "Projection-only mutation paths are rejected or routed through CLI append/reconciliation.",
        "The registry cannot grant release-authorized writable claims unless backed by the CAS claim authority primitive.",
        "Disagreement between append-only history, projections, and claim authority fails closed into PM or CLI-owned mechanical repair unless an operator-owned gate is missing."
      ],
      "test_plan": [
        "Run replay tests that rebuild current-state views from append-only history.",
        "Run projection authority tests proving cockpit, index, current-state, and registry projection writes cannot become workflow authority.",
        "Run reconciliation tests for history/projection/claim-authority disagreement.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; source-of-truth boundaries must be explicit and enforced by narrow interfaces.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Replay, projection-authority, and reconciliation tests must fail before implementation."
        }
      ],
      "bootstrap_gaps": [
        "Parallel writable workstreams remain disabled until projection authority and CAS claim authority are proven."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        ".bandit/policy/coordination-authority.json"
      ],
      "first_implementation_order": [
        "Write RED replay, projection-authority, and reconciliation tests.",
        "Define source-of-truth/projection policy.",
        "Add validation for projection-only mutation refusal.",
        "Record evidence and update PRD-002 claim-authority inputs."
      ],
      "smell_triggers": [
        "Current-state view treated as canonical.",
        "Registry grants claims without CAS claim authority.",
        "Cockpit or state index mutates workflow state directly.",
        "Projection disagreement resolved by manual edit.",
        "Projection disagreement escalated to the operator despite a derivable mechanical repair path."
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "No operator input is required for the source-of-truth boundary because the operator confirmed append-only workflow/event history is canonical and projections are derived."
    },
    {
      "kind": "slice",
      "title": "Claim Authority And Fenced Claim Leases",
      "goal": "Create the CLI-owned claim authority primitive, registry projection, and fenced idempotent Work Claim Lease operations that prevent duplicate writable work and duplicate side effects.",
      "scope": [
        "Define Git refs claim authority semantics for active claims, leases, owners, stages, surfaces, fencing tokens, idempotency keys, timestamps, worktree path, branch, renewal, and recovery metadata.",
        "Define the Authoritative In-Flight Registry as a projection from, or CAS-protected view of, the Git refs claim authority backend.",
        "Implement CAS-backed claim, inspect, renew, release, fail, block, complete, and recover operations using refs/bandit/*, git update-ref --stdin transactions, fencing-token checks, and idempotency-key handling.",
        "Require expected claim state, current fencing token, and claim idempotency key for state-changing claim operations after token issuance.",
        "Require external side-effecting operations under a claim to carry the current fencing token and an idempotency key.",
        "Build and validate the Work-Surface Wait-For Graph before accepting writable claims.",
        "Reconcile claim authority, registry projection, and append-only per-work-item coordination history before accepting claims.",
        "Define Claim Safety Invariants and the deterministic fault-injecting or property-style simulation harness required to prove them.",
        "Fail closed on duplicate active claims, stale expected state, stale fencing tokens, missing or conflicting idempotency keys, work-surface wait-for cycles, malformed registry, or claim authority/registry/history disagreement, with operator escalation only for operator-owned gates."
      ],
      "out_of_scope": [
        "Do not create worktrees.",
        "Do not schedule candidate work.",
        "Do not integrate or land completed work.",
        "Do not enable true parallel writable workstreams beyond claim-authority validation."
      ],
      "acceptance_criteria": [
        "Declared Claim Safety Invariants cover duplicate claims, release, reconcile, stale expected state, stale fencing tokens, idempotency replay/conflict, projection/history disagreement, work-surface cycles, and failed serializer or worktree-lock cleanup.",
        "Deterministic fault-injecting or property-style simulation proves the Claim Safety Invariants; example-only duplicate-claim tests do not satisfy the gate.",
        "Two simultaneous claim attempts for the same work item, stage, or declared write surface cannot both succeed under the simulation harness.",
        "Every successful writable claim receives a monotonic fencing token.",
        "Active claim authority is written through refs/bandit/* and git update-ref --stdin transactions, not through plain .bandit file edits.",
        ".bandit in-flight claim state is a projection and manual edits cannot grant, renew, release, complete, or recover claims.",
        "State-changing claim operations reject stale or missing fencing tokens after token issuance.",
        "State-changing claim operations and external side-effecting operations under a claim require an idempotency key after token issuance.",
        "A same-key same-input retry returns the prior result or an equivalent no-op result, while same-key different-input reuse is refused.",
        "Claimability refuses any claim that would create or continue a Work-Surface Wait-For Graph cycle.",
        "v0 permits at most one active claim per work item.",
        "Claim authority/registry/history disagreement creates PM repair, CLI-owned mechanical repair, or recovery output rather than default operator escalation.",
        "Expired claims with unmerged work become recovery-required rather than auto-deleted.",
        "Manual registry edits are detected by validation when they break reconciliation.",
        "The feature records that true parallel writable workstreams remain blocked until the full Parallel Write Authorization Gate passes."
      ],
      "test_plan": [
        "Run focused claim tests for duplicate, CAS mismatch, fencing-token issuance, stale-token rejection, idempotent retry, idempotency-key conflict, renewal, release, block, fail, complete, expiration, and recovery paths.",
        "Run focused claim-gated side-effect tests for current fencing token and idempotency-key requirements.",
        "Run focused Work-Surface Wait-For Graph cycle tests.",
        "Run deterministic fault-injecting or property-style Claim Safety Invariant simulation covering races, retries, pauses, stale expected state, stale fencing tokens, idempotency replay/conflict, projection/history disagreement, wait-for cycles, and failed serializer or worktree-lock cleanup.",
        "Run fixture tests for claim authority/registry/history disagreement.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; claim operations must keep state explicit and failure paths clear.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Claim Safety Invariant simulation plus duplicate-claim, CAS mismatch, fencing-token, stale-agent, idempotency-key, work-surface-cycle, and reconciliation tests must fail before implementation."
        },
        {
          "stage": "Stage 3: Implementation Clean-Code Rubric",
          "verdict": "required",
          "evidence": "Claim authority, fencing-token, idempotency-key, and wait-for graph logic must be deep modules with narrow interfaces."
        }
      ],
      "bootstrap_gaps": [
        "Claim authority primitive must prove compare-and-swap semantics before true parallel writable workstreams are enabled.",
        "Fencing-token rejection and idempotency-key behavior must be proven for stale agents and retries before external side effects are allowed under parallel claims.",
        "Work-Surface Wait-For Graph cycle detection must be proven before parallel writable claims are enabled.",
        "Claim Safety Invariants must be proven by deterministic fault-injecting or property-style simulation before release-authorized writable claims are enabled."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        "docs/decisions/2026-05-27-git-refs-claim-authority-backend.md",
        "refs/bandit/*",
        ".bandit/in-flight.json projection",
        ".bandit/policy/work-claims.json"
      ],
      "first_implementation_order": [
        "Write Claim Safety Invariant simulation plus duplicate-claim, CAS mismatch, fencing-token, stale-agent, idempotency-key, work-surface-cycle, and reconciliation RED tests.",
        "Define refs/bandit/* claim authority semantics, registry projection schema, idempotency-key behavior, Work-Surface Wait-For Graph behavior, and claim state values.",
        "Implement CAS-backed claim operations through git update-ref --stdin transactions.",
        "Implement fencing-token issuance and rejection plus idempotency-key replay and mismatch refusal.",
        "Implement Work-Surface Wait-For Graph cycle detection and refusal diagnostics.",
        "Add validation and evidence."
      ],
      "smell_triggers": [
        "Any advisory-only lock behavior.",
        "Any file-only check-then-write claim behavior.",
        "Any .bandit projection file treated as active claim authority.",
        "Any state-changing operation without expected claim state, fencing-token verification, or idempotency-key handling.",
        "Any claim-gated external side effect without current fencing-token and idempotency-key verification.",
        "Any pairwise-only work-surface check without wait-for graph cycle detection.",
        "Any claim, release, reconcile, or side-effect correctness claim backed only by hand-picked examples without Claim Safety Invariant simulation.",
        "Any manual registry mutation path.",
        "Any fail-open stale-state behavior."
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "No operator input is required for the CAS/fencing/idempotency/deadlock gate because the operator confirmed that true parallel writable workstreams must remain blocked until claim authority has CAS semantics, fencing tokens, idempotency keys, and Work-Surface Wait-For Graph cycle detection."
    },
    {
      "kind": "slice",
      "title": "Declared Work Surfaces And Deadlock Detection",
      "goal": "Require claimable work to declare expected write surfaces and refuse overlapping or deadlocked reservations before work starts.",
      "scope": [
        "Add declared work surface metadata for work items and chores.",
        "Normalize path patterns and named repo resources for collision checks.",
        "Detect exact, ancestor, descendant, and named-resource conflicts.",
        "Build a Work-Surface Wait-For Graph from active reservations and claim candidates.",
        "Detect wait-for graph cycles that would deadlock reservations.",
        "Explain collision and deadlock refusals with owner, work item, stage, reserved surface, and cycle path."
      ],
      "out_of_scope": [
        "Do not infer unlimited write access from missing declarations.",
        "Do not implement full static analysis of all possible file writes.",
        "Do not allow product-scope claims without documented scope."
      ],
      "acceptance_criteria": [
        "A runnable work item without declared write surfaces is not claimable.",
        "Overlapping declared surfaces cannot be claimed concurrently.",
        "A claim that would create or continue a Work-Surface Wait-For Graph cycle is not claimable.",
        "Non-overlapping surfaces can be claimed concurrently when work-item rules allow.",
        "Collision and deadlock refusal messages identify the conflicting reservation, owner, and cycle path where applicable.",
        "Validation reports missing or malformed declared surfaces."
      ],
      "test_plan": [
        "Run focused overlap detection tests.",
        "Run focused wait-for graph cycle detection tests.",
        "Run claim integration tests with overlapping and non-overlapping surfaces.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; collision detection should be isolated and testable.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Surface collision and wait-for graph cycle tests must fail before implementation."
        }
      ],
      "bootstrap_gaps": [
        "Perfect write prediction is out of scope; declared surfaces are the v0 contract."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        "docs/templates/work-surface.md"
      ],
      "first_implementation_order": [
        "Write RED tests for missing, malformed, overlapping, non-overlapping, and wait-for-cycle surfaces.",
        "Implement normalization, overlap checks, and wait-for graph cycle detection.",
        "Integrate surfaces into claim validation.",
        "Update validation and evidence."
      ],
      "smell_triggers": [
        "Implicit write surfaces.",
        "Collision checks implemented as ad hoc string matching.",
        "Pairwise overlap checks without wait-for graph cycle detection.",
        "Refusals that do not name the conflicting claim or cycle path."
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "No operator input is required for the declared-surface contract."
    },
    {
      "kind": "slice",
      "title": "Event-Driven Work Scheduler",
      "goal": "Wake the scheduler when work is available and select at most one runnable claim candidate using deterministic post-bootstrap priority rules.",
      "scope": [
        "Define event-driven work triggers for newly claimable work, recovery-required work, newly unblocked in-progress work, and operator-resolved blockers.",
        "Define a deterministic non-LLM sweeper for stale claims, missed triggers, due evaluations, and blocker-state changes.",
        "Prove the Work Availability Wake Guarantee before removing fallback polling behavior.",
        "Rank recovery-required claims first, then continuable active work, then highest-priority unblocked queued work, then eligible low-risk chores.",
        "Use roadmap or backlog order and work item ID as deterministic tie-breakers.",
        "Return no-op output from deterministic sweeps when no work is claimable.",
        "Refuse ambiguous or unreconciled state instead of guessing."
      ],
      "out_of_scope": [
        "Do not run implementation work.",
        "Do not create worktrees.",
        "Do not wake an LLM only to discover ordinary no-op state once the wake guarantee is proven.",
        "Do not schedule across multiple repositories."
      ],
      "acceptance_criteria": [
        "Newly claimable work, recovery-required work, newly unblocked in-progress work, and operator-resolved blockers wake the appropriate scheduler or agent path.",
        "The deterministic sweeper can recover missed triggers and detect stale claims without LLM execution.",
        "A woken scheduler activation can select at most one claimable stage.",
        "Scheduler output explains why selected work was chosen.",
        "Scheduler output explains why blocked, overlapping, or ineligible work was skipped.",
        "Eligible chores are selected only when no higher-priority runnable work exists.",
        "No runnable work produces a clean deterministic no-op."
      ],
      "test_plan": [
        "Run wake-guarantee tests for newly claimable work, recovery-required work, newly unblocked in-progress work, and operator-resolved blockers.",
        "Run deterministic sweeper tests for stale claims, missed triggers, due evaluations, blocker-state changes, and no-op behavior without LLM execution.",
        "Run scheduler priority fixture tests.",
        "Run no-op and ambiguous-state refusal tests.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; scheduler ranking must be deterministic and explainable.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Wake-guarantee, deterministic sweeper, and priority ordering tests must fail before implementation."
        }
      ],
      "bootstrap_gaps": [
        "Fallback polling must stay available until event-driven triggers and deterministic sweeping prove that available work wakes reliably."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        ".bandit/policy/workstream-scheduler.json"
      ],
      "first_implementation_order": [
        "Write RED tests for work-availability wakeups, deterministic sweeping, priority ranking, and no-op behavior.",
        "Implement event-driven trigger inputs.",
        "Implement deterministic non-LLM sweeper output.",
        "Implement candidate collection from reconciled repo state.",
        "Implement one-claim scheduling output.",
        "Integrate with claim operations and validation."
      ],
      "smell_triggers": [
        "Batch queue draining.",
        "LLM polling used for ordinary no-op discovery.",
        "Available work not waking a scheduler or agent path.",
        "Priority derived from chat.",
        "Silent skip decisions."
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "No operator input is required for scheduler priority or the wake guarantee because the operator accepted event-driven scheduling as long as work still wakes when available."
    },
    {
      "kind": "slice",
      "title": "Agent Observability Traces",
      "goal": "Emit OTel-compatible traces for agent runtime behavior without making telemetry canonical workflow state.",
      "scope": [
        "Define trace and span requirements for wakeups, sweeps, claims, renewals, releases, tool calls, reviewer runs, model calls, token spend, retries, failures, and outcomes.",
        "Correlate trace records with work item ID, claim ID or wake decision, reviewer evidence, and canonical artifact IDs where applicable.",
        "Expose observability projections for cost, latency, tool friction, failed tool calls, reviewer runtime, and repeated wake/no-op patterns.",
        "Define soft budget bands, provider-pricing evidence requirements, benchmark/evaluation spend approvals, spend-class approvals, and token-cost failsafe signals for paid, high-token, reviewer, scheduler, and long-running execution.",
        "Preserve repo-native artifacts as canonical workflow state, gate evidence, UAT, landing, and closeout authority."
      ],
      "out_of_scope": [
        "Do not use telemetry to satisfy landing gates.",
        "Do not make an observability backend a workflow source of truth.",
        "Do not require a hosted tracing service for local v0."
      ],
      "acceptance_criteria": [
        "Claim, scheduler, reviewer, tool-execution, model-call, and workstream operations emit or record trace data.",
        "Trace records include correlation IDs for work item and operation context.",
        "Token spend, latency, failure, retry, and tool-friction signals are queryable from an observability projection.",
        "Abnormal token, cost, latency, retry, or no-op patterns can trip a failsafe without treating ordinary deep review as failure.",
        "Failsafe continuation records whether execution continued, rerouted, stopped, or required operator-owned cost/risk approval, and names the provider-pricing evidence plus per-run or spend-class approval when paid execution continues.",
        "Validation or gate checks refuse to treat trace data as a substitute for canonical repo artifacts."
      ],
      "test_plan": [
        "Run trace-shape tests for claim, wake, sweeper, tool, reviewer, model-call, and failure spans.",
        "Run projection tests for token spend, latency, tool friction, failures, retries, and repeated wake/no-op patterns.",
        "Run token-cost failsafe tests for abnormal spend, normal deep-review variance, and recorded continuation decisions.",
        "Run authority-boundary tests proving traces cannot replace required workflow artifacts.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; trace emission must keep observability concerns explicit without smearing workflow authority.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Trace-shape, projection, and authority-boundary tests must fail before implementation."
        }
      ],
      "bootstrap_gaps": [
        "Agent observability trace support does not exist yet; telemetry must be added without replacing repo-native workflow artifacts."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        ".bandit/policy/agent-observability.json"
      ],
      "first_implementation_order": [
        "Write RED tests for trace shape, correlation, projection, and authority boundaries.",
        "Define trace schema and correlation fields.",
        "Add trace emission to representative CLI-owned operations.",
        "Add observability projection output.",
        "Add validation and evidence."
      ],
      "smell_triggers": [
        "Runtime behavior without traces.",
        "Token spend hidden from observability.",
        "Token-cost failsafe, provider-pricing evidence, or per-run/spend-class approval missing for paid or high-token execution.",
        "Budget cap too strict and likely to force repeated failed attempts.",
        "Telemetry used as workflow authority.",
        "Trace records missing work item or operation correlation."
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "No operator input is required for the observability boundary because the operator confirmed traces should be first-class while repo artifacts remain canonical."
    },
    {
      "kind": "slice",
      "title": "Git Mutation Serializer",
      "goal": "Serialize shared `.git` plumbing mutations before parallel worktrees are release-authorized.",
      "scope": [
        "Define the shared `.git` mutation allow-list that must run through the serializer.",
        "Implement a CLI-owned single-writer guard for worktree add, remove, prune, lock or unlock, branch/ref maintenance outside the claim CAS boundary, and packed-refs-affecting maintenance.",
        "Lock every claim-owned worktree immediately after creation with a stable claim-specific reason that names claim ID, Work Item ID, and stage.",
        "Treat lock failure after creation as worktree creation failure that records evidence and releases or marks the claim failed.",
        "Allow only Repo PM Coordinator cleanup to unlock claim-owned worktrees after handoff verification.",
        "Refuse or flag shared `.git` plumbing mutations that bypass the serializer in release-authorized paths.",
        "Record serializer evidence and operation traces for contention, timeout, failure, and cleanup behavior."
      ],
      "out_of_scope": [
        "Do not replace refs/bandit/* claim authority or git update-ref CAS semantics.",
        "Do not grant claim ownership through the serializer."
      ],
      "acceptance_criteria": [
        "Parallel worktree lifecycle operations that mutate shared `.git` state run through the serializer.",
        "Claim-owned worktrees are locked immediately after creation with a stable reason naming claim ID, Work Item ID, and stage.",
        "Two contending shared `.git` plumbing operations cannot execute concurrently through Bandit CLI paths.",
        "Non-serialized shared `.git` mutation paths are refused or fail validation for release-authorized work.",
        "A created worktree whose lock fails is cleaned up through serializer-owned failure handling and does not leave a false active claim.",
        "Worker-owned unlock of a claim-owned worktree is refused.",
        "Serializer timeout, stale-lock, and failure cleanup behavior is explicit and tested.",
        "Claim authority remains owned by refs/bandit/* CAS semantics, not by the serializer."
      ],
      "test_plan": [
        "Run focused serializer contention tests.",
        "Run claim-owned worktree lock reason, lock failure, and unlock authority tests.",
        "Run non-serialized mutation refusal tests.",
        "Run stale-lock, timeout, and failure cleanup tests.",
        "Run claim-authority separation tests proving the serializer cannot grant claims.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; shared git mutation side effects must be explicit and tightly isolated.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Serializer contention, worktree-lock, bypass-refusal, timeout, and claim-authority separation tests must fail before implementation."
        }
      ],
      "bootstrap_gaps": [
        "Release-authorized parallel worktrees remain blocked until shared .git mutation serialization is proven."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        "docs/decisions/2026-05-27-git-mutation-serializer.md",
        ".bandit/policy/git-mutations.json"
      ],
      "first_implementation_order": [
        "Write serializer contention, worktree-lock, bypass-refusal, timeout, stale-lock, and authority-separation RED tests.",
        "Define the shared .git mutation allow-list and serializer state.",
        "Implement the CLI-owned single-writer guard.",
        "Integrate worktree lifecycle plumbing and claim-owned worktree locking with the serializer.",
        "Add validation and evidence."
      ],
      "smell_triggers": [
        "Parallel worktree lifecycle calls git plumbing directly.",
        "Claim-owned worktree is created without git worktree lock.",
        "Worker unlocks a claim-owned worktree.",
        "Serializer grants claim authority.",
        "Shared .git mutation bypass has no refusal or validation.",
        "Timeout or stale-lock behavior is implicit."
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "No operator input is required for the Git mutation serializer because the operator confirmed it is required before parallel worktrees are release-authorized."
    },
    {
      "kind": "slice",
      "title": "Claim-First Worktree Lifecycle",
      "goal": "Create, lock, and bootstrap ephemeral worktrees through governed CLI paths only after successful claims, require Work Item PM Orchestrator handoff verification, and reserve shared-resource cleanup for the Repo PM Coordinator.",
      "scope": [
        "Add worktree creation and immediate git worktree lock through the Git Mutation Serializer after successful claim and record worktree path and branch in the lease.",
        "Use a stable worktree lock reason naming claim ID, Work Item ID, and stage.",
        "Handle worktree creation or lock failure by releasing or marking the claim failed.",
        "Define a Worktree Bootstrap Contract policy artifact such as .bandit/policy/worktree-bootstrap.json with optional .worktreeinclude-style allow-list support.",
        "Require allowed copy/link entries, setup command, validation command, environment-variable references, secret-handling boundary, expected runtime dependencies, and bootstrap failure evidence before worker execution.",
        "Refuse copying secret material into worktrees unless existing operator-supervised policy explicitly authorizes a narrower exception.",
        "Add workstream handoff summary requirements for completion, verification, blockers, next stage, and cleanup readiness.",
        "Add Work Item PM Orchestrator handoff verification before cleanup.",
        "Add Repo PM Coordinator claim release, integration routing, unlock, and serializer-backed deletion flow."
      ],
      "out_of_scope": [
        "Do not give workstream agents landing authority.",
        "Do not allow workstream agents to delete worktrees.",
        "Do not implement PR-based landing governance."
      ],
      "acceptance_criteria": [
        "Worktree creation is refused without an active claim.",
        "Worktree creation, lock, unlock, and deletion use the Git Mutation Serializer.",
        "A failed worktree creation or lock does not leave an active false claim.",
        "A locked worktree is not runnable until Worktree Bootstrap Contract validation passes.",
        "Bootstrap failure records PM-visible evidence and routes the claim to failed, blocked, or recovery-required state.",
        "Secret material is not copied into worktrees by default.",
        "Worker-owned unlock is refused.",
        "Completed work includes a Work Item PM Orchestrator-consumable handoff summary before claim release.",
        "Work Item PM Orchestrator verifies handoff and evidence transfer before cleanup.",
        "Only Repo PM Coordinator cleanup flow releases claims, unlocks, and deletes worktrees through the serializer after verification.",
        "Recovery-required worktrees are never auto-deleted."
      ],
      "test_plan": [
        "Run worktree lifecycle tests with successful serializer-backed creation and lock, failed creation, failed lock, handoff, cleanup-ready, and recovery paths.",
        "Run Worktree Bootstrap Contract tests for allowed copy/link entries, setup command, validation command, environment references, secret-copy refusal, bootstrap failure evidence, and worker execution refusal before bootstrap passes.",
        "Run serializer-integration tests for worktree creation, lock, unlock, and deletion.",
        "Run command tests proving workstream cannot land, unlock, or delete worktrees.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; lifecycle side effects must be explicit and reversible where possible.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Claim-first worktree creation, lock, bootstrap contract, and cleanup tests must fail before implementation."
        }
      ],
      "bootstrap_gaps": [
        "PR-based integration changes are future work."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        "docs/decisions/2026-05-27-worktree-bootstrap-contract.md",
        ".bandit/policy/worktree-bootstrap.json",
        "docs/templates/workstream-handoff.md"
      ],
      "first_implementation_order": [
        "Write RED tests for claim-first serializer-backed worktree creation, lock, unlock authority, and failure behavior.",
        "Write RED tests for Worktree Bootstrap Contract validation and worker-execution refusal before bootstrap passes.",
        "Implement serializer-backed worktree creation, locking, and failure handling.",
        "Implement Worktree Bootstrap Contract setup, validation, secret-copy refusal, and failure evidence.",
        "Implement handoff summary and cleanup-ready state.",
        "Implement Work Item PM Orchestrator handoff verification.",
        "Implement Repo PM Coordinator claim release and cleanup."
      ],
      "smell_triggers": [
        "Speculative worktree creation.",
        "Worktree lifecycle bypasses the Git Mutation Serializer.",
        "Claim-owned worktree is left unlocked.",
        "Worker execution starts in a locked but unbootstrapped worktree.",
        "Worktree bootstrap copies secret material without existing operator-supervised policy approval.",
        "Worker unlocks a claim-owned worktree.",
        "Worker cleanup of unverified work.",
        "Landing behavior embedded in worker lifecycle."
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "No operator input is required for v0 worktree lifecycle or bootstrap mechanics because the operator delegated technical questions to Codex PM. Any future secret-copy exception or policy change remains operator-owned."
    },
    {
      "kind": "slice",
      "title": "Workstream Wake Execution Contract",
      "goal": "Connect event-driven single-claim scheduling to worker execution while preserving no-op behavior and role boundaries.",
      "scope": [
        "Define Workstream Agent required reads, wake inputs, claim attempt flow, allowed actions, forbidden actions, and no-op behavior.",
        "Connect scheduler output to claim acquisition and claim-first worktree start.",
        "Require lease renewal for long-running work.",
        "Require completion, block, failure, and cleanup-ready outputs that Work Item PM Orchestrator can consume."
      ],
      "out_of_scope": [
        "Do not implement Repo PM Coordinator governance in the worker.",
        "Do not implement landing or PR resolution.",
        "Do not delete worktrees from workstream execution."
      ],
      "acceptance_criteria": [
        "Each Workstream wake activation claims at most one stage.",
        "No available claim after reconciliation produces a clean no-op.",
        "Worker actions without a claim are refused when they mutate state.",
        "Lease renewal and stale lease behavior are visible in registry state.",
        "Worker output is sufficient for PM to continue without chat context."
      ],
      "test_plan": [
        "Run worker protocol tests for event-driven wake input, no-op, claim success, claim refusal, renewal, block, failure, and completion.",
        "Run integration tests with scheduler and claim registry fixtures.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; worker execution must keep role boundaries explicit.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Worker protocol tests must fail before implementation."
        }
      ],
      "bootstrap_gaps": [
        "Dynamic model routing remains future work."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        ".bandit/policy/workstream-agent.json"
      ],
      "first_implementation_order": [
        "Write RED tests for Workstream wake single-claim behavior.",
        "Implement protocol checks and no-op output.",
        "Integrate scheduler, claim, and worktree lifecycle.",
        "Record evidence and validation."
      ],
      "smell_triggers": [
        "Worker takes PM decisions.",
        "Worker lands or deletes worktrees.",
        "Wake activation drains multiple items.",
        "Worker wakes repeatedly without claimable work."
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "No operator input is required for worker role boundaries captured in the PRD."
    },
    {
      "kind": "chore",
      "title": "Bandit Installed-Copy Update Path",
      "non_product_work": "Define the CLI-supported distribution path for pushing Bandit global skill, automation prompt, and integration updates to installed copies.",
      "origin": "Post-bootstrap parallel workstream rollout dependency currently recorded in FOLLOWUPS.md and expected to migrate into the Work Intake Ledger.",
      "scope": [
        "Define how Bandit detects installed global skills, automation prompts, and repo integration files that need updates.",
        "Define how updates are previewed, applied, verified, and rolled back or repaired.",
        "Document rollout requirements before Repo PM Coordinator is used across multiple projects."
      ],
      "acceptance_criteria": [
        "The update path has an explicit source of truth and does not overwrite user-local changes silently.",
        "Installed-copy drift can be reported before applying updates.",
        "The global Repo PM Coordinator skill and Bandit adapter can be distributed consistently.",
        "Verification proves installed copies match the intended version or reports exact drift."
      ],
      "verification_plan": [
        "Run update-path design validation against installed skill fixtures.",
        "Run command tests for preview, apply, verify, and refusal paths when implemented.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "required_evidence": [
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md"
      ],
      "operator_input_status": "Operator input may be required before modifying installed copies outside the repository."
    }
  ]
}
```

## Further Notes

This PRD intentionally lands as future planning while `BANDIT-022` remains the
active bootstrap-gap chore. It should not update the current work queue or
start Phase 6 until the current bootstrap rules allow that transition.

The first executable implementation should be the Repo PM Coordinator protocol
and Operator Inbox contract. Parallel workstreams need a control plane before
they need more worker lanes.

Once Bandit moves to PR-based workflows, PR issue resolution and safe landing
should become a separate governed agent capability with its own PRD, policy,
skill, and input quarantine/trusted-source gates. This PRD only preserves that
boundary.
