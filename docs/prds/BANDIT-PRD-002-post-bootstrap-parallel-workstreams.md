# BANDIT-PRD-002: Post-Bootstrap Parallel Workstreams

## Status

Draft. Ready for post-bootstrap agent decomposition after the active bootstrap-gap
lane is resolved, blocked, or explicitly dispositioned.

Triage label: ready-for-agent after bootstrap.

## Problem

Bandit currently runs work as a single active stream. This is correct during
bootstrap because the repository is still converting missing gates into durable
commands, policies, and artifacts. After bootstrap, the operator wants multiple
agent sessions to move faster by working on different non-overlapping work
items at the same time.

The present "Bandit Next Work Item" heartbeat can start a new Codex run every
15 minutes, but the workflow does not yet have a strict, machine-enforced way
to prove which work items are already in flight, which stage each item is in,
which surfaces are reserved, which worktree owns the work, and whether the
next heartbeat should start work or do nothing. Without that contract, the worst
failure mode is duplicative work on the same item or colliding edits across
worktrees.

The operator also identified a role gap: there is no PM heartbeat agent. Codex
currently acts as PM, worker, triager, reviewer router, and operator liaison in
each invocation. Parallel workstreams require a control-plane role that keeps
work unblocked, writes briefs, triages follow-ups, maintains operator
escalations, and pauses wasted heartbeats when no work is available.

## User

Primary user: the operator managing Bandit-governed repositories.

Primary agent user: Codex PM running as a PM heartbeat agent.

Secondary agent users: workstream agents, landing agents, future PR-resolution
agents, and future cockpit views that need reliable repo-native coordination
state.

## Goals

- Allow multiple non-overlapping workstreams to run after bootstrap without
  duplicate claims on the same work item or stage.
- Make in-flight work independently authoritative and reconciled with each
  work item's canonical coordination state before any work starts.
- Require every write-capable workstream to claim one stage and declared work
  surface before creating an ephemeral worktree.
- Let a heartbeat activation decide whether to recover existing work, continue
  an open stage, claim new unblocked work, claim an eligible chore, or do
  nothing.
- Introduce a PM heartbeat protocol that can unblock work, create briefs,
  prioritize, triage follow-ups, maintain PM-owned context, escalate to the
  operator, and pause heartbeats when all work is blocked.
- Preserve role boundaries: PM orchestrates, workstream agents implement,
  landing agents decide landing, and the operator owns product direction, UAT,
  policy changes, business tradeoffs, and explicit cost or risk overrides.
- Keep all coordination repo-native and CLI-authoritative. A database or cockpit
  may index or visualize state later, but it must not become hidden authority.
- Keep worktrees ephemeral. Workstream agents mark work cleanup-ready; PM
  verifies transfer and deletes worktrees.
- Make the protocol reusable across projects through a global PM heartbeat skill
  with Bandit-specific adapters.

## Solution

Bandit will add a post-bootstrap coordination feature that combines an
Authoritative In-Flight Registry, atomic work claim leases, declared work
surface reservations, PM heartbeat governance, and workstream heartbeat
execution.

The Authoritative In-Flight Registry is canonical for active claims and
reservations. Per-work-item coordination state remains canonical for workflow
stage and evidence. The CLI must reconcile both sources before creating,
renewing, releasing, recovering, or completing a claim. If the registry and
work-item state disagree, the CLI fails closed and routes the discrepancy to PM
repair. Agents must never resolve the disagreement by editing the registry or
work item manually.

Every write-capable workstream follows claim-first worktree start:

1. Reconcile work-item state, registry state, active leases, and declared work
   surfaces.
2. Atomically claim exactly one runnable stage and its work surface reservation.
3. Create an ephemeral worktree only after the claim succeeds.
4. Execute the stage, renewing the claim lease as needed.
5. Record stage evidence and a PM-consumable handoff summary.
6. Mark the claim cleanup-ready or blocked; do not delete the worktree.
7. PM verifies that work was transferred correctly, handles integration or
   routing, releases the claim, and deletes the worktree.

A PM heartbeat becomes the control plane. It reads required PM surfaces,
maintains `CURRENT_CONTEXT.md`, triages `FOLLOWUPS.md`, maintains a single
Tagged Chore Ledger, creates or updates briefs within approved product scope,
prioritizes available work, escalates operator-owned blockers in `OPERATOR.md`,
and controls Workstream Agent heartbeat pause/resume behavior. The PM heartbeat
may pause itself only when there are no active claims, no recovery-required
leases, no unarchived completed worktrees, no runnable non-overlapping work,
and no remaining coordination duties. The operator is the only actor allowed to
unpause heartbeats.

The workstream heartbeat remains a worker lane. Each activation may claim at
most one runnable stage. If no claim is available, it records or emits a no-op
status and exits. The operator can tune heartbeat frequency based on how much
work is likely available without risking duplicate execution.

## Non-Goals

- Do not interrupt the active bootstrap-gap lane or start parallel execution
  before bootstrap is complete.
- Do not allow two active claims for the same work item in v0.
- Do not implement product-scope changes without a grill-with-docs session and
  a resulting PRD, documented change, or work item.
- Do not make the PM heartbeat an implementation agent.
- Do not give workstream agents landing authority.
- Do not let workstream agents delete worktrees.
- Do not make `OPERATOR.md` general agent context.
- Do not introduce a database, GUI cockpit, centralized external source of
  truth, or cross-repo scheduler in v0.
- Do not implement dynamic per-stage model routing in v0. The model and
  reasoning profile are set when the relevant automation is created.
- Do not solve PR issue resolution or PR-safe landing governance in this PRD.
  That requires a later dedicated agent and policy.
- Do not require every future repo to be Bandit-specific. The PM heartbeat
  protocol should be global, with Bandit-specific integration layered on top.

## Stories Or Workflows

1. As the operator, I want multiple non-overlapping workstreams to run at the
   same time, so that Bandit can move faster after bootstrap without creating
   duplicate work.
2. As the operator, I want the shared in-flight document to be authoritative for
   active work, so that agents do not choose work from stale chat or an advisory
   dashboard.
3. As the operator, I want in-flight state and work-item state to confirm each
   other before work starts, so that disagreement becomes a repair condition
   instead of a hidden race.
4. As the operator, I want duplicate work on the same item prevented by a
   claim-first protocol, so that parallel sessions cannot waste time or corrupt
   evidence.
5. As the operator, I want each heartbeat to decide whether useful work exists,
   so that I can tune heartbeat frequency while active or AFK.
6. As the operator, I want a heartbeat to no-op cleanly when no work is
   available, so that idle automations do not create churn.
7. As the operator, I want one PM heartbeat to keep work unblocked, so that
   each worker run does not need to rediscover priorities and blockers.
8. As the operator, I want PM escalations in an operator-facing inbox, so that I
   can answer work stoppages without reading every agent artifact.
9. As the operator, I want the PM to consume my `OPERATOR.md` responses, so that
   operator decisions become durable work artifacts.
10. As the operator, I want the PM heartbeat to pause worker heartbeats when all
    work is blocked, so that repeated worker runs are not wasted.
11. As the operator, I want the PM heartbeat to pause itself only after writing
    the exact re-engagement requirement, so that I can restart work
    intentionally.
12. As the operator, I want only the operator to unpause heartbeats, so that
    agents cannot silently resume blocked work.
13. As Codex PM, I want a global PM heartbeat skill with a checklist and
    protocol, so that PM orchestration is repeatable across projects.
14. As Codex PM, I want a Bandit adapter for the global PM heartbeat skill, so
    that Bandit-specific artifacts and commands are used without making the
    global protocol Bandit-only.
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
19. As Codex PM, I want one Tagged Chore Ledger instead of multiple chore logs,
    so that chore type, risk, origin, eligibility, and blocker state are
    represented as metadata.
20. As Codex PM, I want to triage `FOLLOWUPS.md` into documented scope,
    follow-up chores, no-action decisions, or operator escalations, so that
    follow-ups do not become unowned backlog.
21. As Codex PM, I want to create chores and feature slices only when product
    scope is already documented, so that PM does not create product direction
    without the operator's grill-with-docs process.
22. As Codex PM, I want every runnable item to declare expected write surfaces,
    so that the claim operation can detect collisions before work begins.
23. As Codex PM, I want the scheduler to prefer recovery, active continuation,
    highest-priority unblocked work, then eligible chores, so that the next
    heartbeat follows a deterministic priority order.
24. As Codex PM, I want expired claims with unmerged changes to enter
    recovery-required state, so that no agent auto-deletes useful work.
25. As Codex PM, I want claim creation to be atomic and CLI-owned, so that two
    simultaneous sessions cannot both believe they own the same stage.
26. As Codex PM, I want claim creation to happen before worktree creation, so
    that speculative worktrees do not create hidden work.
27. As Codex PM, I want failed worktree creation to release or mark the claim
    failed, so that registry state does not falsely block future work.
28. As Codex PM, I want PM to delete worktrees only after verification, so that
    completed work is not lost before integration or transfer.
29. As a workstream agent, I want to claim one runnable stage at a time, so that
    my scope and write authority are explicit.
30. As a workstream agent, I want a lease renewal command, so that long-running
    stages remain visibly owned.
31. As a workstream agent, I want collision refusal messages that name the
    conflicting work surface and owner, so that I can stop without guessing.
32. As a workstream agent, I want to run read-only inspection without a claim, so
    that status checks do not create unnecessary locks.
33. As a workstream agent, I want any write, mutating command, reviewer
    evidence, or worktree creation to require a claim, so that meaningful side
    effects are governed.
34. As a workstream agent, I want to commit focused work on an ephemeral branch,
    so that my output can be reviewed, integrated, or abandoned cleanly.
35. As a workstream agent, I want to hand off stage completion with changed
    files, verification, blockers, next recommended stage, and cleanup readiness,
    so that PM can route the work without chat context.
36. As a landing agent, I want PM to route only policy-eligible work after gates
    pass, so that landing remains a specialized governed decision.
37. As a future PR-resolution agent, I want PR issue resolution and safe landing
    governance kept separate, so that this concurrency feature does not blur
    landing authority.
38. As a future cockpit, I want to read derived state from CLI-reconciled
    artifacts, so that the UI can visualize work without owning authority.
39. As a future cross-repo operator, I want the PM heartbeat protocol to be
    reusable across projects, so that Bandit practices can spread after the CLI
    can update installed copies.
40. As a reviewer, I want all claim, recovery, PM, and worktree behavior tested
    through external command outcomes, so that coordination safety is not
    asserted only by implementation structure.

## Acceptance Criteria

- The feature is not enabled until the bootstrap-gap lane is complete, blocked,
  or explicitly dispositioned.
- An Authoritative In-Flight Registry exists for active claims and reservations.
- Work-item coordination state and the registry are independently authoritative
  in their domains and must confirm each other before a claim is accepted.
- Any disagreement between registry state and work-item state fails closed into
  PM repair or recovery workflow.
- The CLI exposes an atomic claim operation that either records one exclusive
  Work Claim Lease or fails without starting work.
- A claim reserves both work item plus stage and declared write surfaces.
- v0 allows at most one active claim per work item.
- Every runnable work item or chore declares expected write surfaces before it
  is claimable.
- The scheduler refuses claims with overlapping work surface reservations.
- A heartbeat activation can claim at most one runnable stage.
- Read-only inspection can run without a claim.
- Any write, mutation, reviewer-evidence write, handoff write, or worktree
  creation requires an active claim.
- Worktree creation happens only after a successful claim.
- If worktree creation fails, the claim is released or marked failed with a
  PM-visible reason.
- Work Claim Leases include owner/session, work item, stage, declared surface,
  worktree path when created, branch, claimed timestamp, expiration timestamp,
  renewal timestamp, status, and recovery metadata.
- Expired claims without unmerged work may be released by policy.
- Expired claims with unmerged changes become recovery-required and are not
  auto-deleted.
- Workstream agents can renew, complete, block, fail, and mark cleanup-ready,
  but cannot land or delete worktrees.
- PM verifies completed work was transferred correctly before releasing claims
  and deleting worktrees.
- PM controls integration routing and can route eligible work to Landing Agent
  after gates pass.
- Landing Agent owns the landing verdict and action; workstream agents do not.
- The scheduler priority order is recovery-required claims, continuable active
  work, highest-priority unblocked queued work, deterministic tie-breakers, then
  eligible low-risk chores.
- The project uses a single Tagged Chore Ledger with metadata for type, origin,
  risk, eligibility, blocker state, and improvement fields.
- PM heartbeat protocol exists as a global skill with a clear checklist,
  authority envelope, required reads, allowed writes, pause rules, escalation
  rules, and handoff obligations.
- Bandit-specific PM heartbeat integration is layered as a repo adapter, not as
  the global protocol itself.
- PM heartbeat may edit PM-owned operational surfaces and coordination artifacts
  but may not write production code or implement product changes.
- PM heartbeat can pause/resume Workstream Agent heartbeat through explicit
  automation control paths.
- PM heartbeat may pause itself only when all self-pause preconditions are met
  and an `OPERATOR.md` entry records why it paused, what input is needed, which
  heartbeats are paused, and how the operator re-engages.
- Only the operator may unpause paused heartbeats.
- `OPERATOR.md` is strictly PM-to-operator and operator-to-PM. Workstream agents
  do not read it.
- PM translates operator decisions into work artifacts and removes or archives
  resolved `OPERATOR.md` entries.
- Automation `MEMORY.md` required fields are defined for PM and Workstream
  automations.
- Canonical decisions affecting repo state are written to repo artifacts even
  when automation memory records the reasoning.
- Product-scope changes require grill-with-docs before work items are created.
- The implementation fails closed when policy, registry, work-item state,
  automation status, declared surfaces, or worktree state cannot be reconciled.

## Implementation Decisions

- Build the feature after bootstrap. This PRD is planning output only and must
  not reroute the current active bootstrap work.
- Preserve CLI Authority. Agents, skills, automations, cockpit views, and
  indexes call or read the CLI contract; they do not manually mutate canonical
  coordination state.
- Treat the Authoritative In-Flight Registry as canonical for active claims and
  reservations, not as a derived status page.
- Treat per-work-item coordination state as canonical for workflow state,
  evidence state, accepted blocks, and safe trigger points.
- Require claim reconciliation to confirm both authoritative sources before
  work starts.
- Use a deep claim coordination module with a small public interface for claim,
  renew, release, fail, block, complete, recover, and inspect operations.
- Use a deep work-surface reservation module to normalize declared surfaces,
  detect overlap, and explain collisions.
- Use a deterministic scheduler module that ranks candidates from reconciled
  state and returns at most one claimable stage.
- Use a PM heartbeat protocol module or skill boundary separate from worker
  execution logic.
- Use a heartbeat automation control adapter for pause/resume/status rather than
  letting PM write raw automation internals ad hoc.
- Use a worktree lifecycle module that enforces claim-first worktree creation
  and PM-only cleanup.
- Use explicit state values for claims, including active, renewing, blocked,
  failed, completed, cleanup-ready, recovery-required, released, and expired.
- Do not make stale timeout cleanup destructive. Recovery-required work must be
  surfaced to PM.
- Keep `OPERATOR.md` as a compact current inbox in the file-based era. It is not
  an append-only board and is not part of workstream context.
- Keep `CURRENT_CONTEXT.md` as PM-owned operational context. PM may edit it
  freely to preserve next-action routing.
- Keep `CONTEXT.md` for durable vocabulary and grill-with-docs artifacts.
  Routine PM heartbeat state does not belong there.
- Use automation `MEMORY.md` as v0 audit and memory surface. Required fields
  should include repo, automation role, allowed reads, allowed writes, pause
  authority, last claim or PM decision, open operator escalations, and blocked
  state summary.
- Keep model reasoning choices at automation creation time for v0. PM heartbeat
  uses high reasoning because it analyzes and routes; delegated implementation
  uses the reasoning profile configured for its own heartbeat.
- Allow PM to create chores and feature slices only when product scope is
  already documented. New product-scope direction requires grill-with-docs.
- Allow PM to pick up the next eligible chore when no runnable work item exists.
- Require Bandit CLI installation/update support before relying on the global PM
  heartbeat skill across multiple repositories.
- Scope v0 to one Bandit-governed repository at a time. Cross-repo coordination
  is future work.

## Testing Decisions

- Tests should verify observable CLI behavior, artifact state, refusal paths,
  reconciliation results, scheduler decisions, and worktree lifecycle effects.
  They should not assert incidental parser or helper internals.
- Test the claim coordination module with successful claims, duplicate claims,
  stale state, conflicting registry/work-item state, lease renewal, release,
  completion, blocking, failure, expiration, and recovery-required behavior.
- Test the work-surface reservation module with exact path conflicts, ancestor
  and descendant conflicts, named resource conflicts, non-overlapping claims,
  normalized path equivalence, and readable conflict messages.
- Test scheduler behavior with recovery-first ordering, continuation ordering,
  unblocked priority ordering, deterministic tie-breakers, eligible chore
  fallback, no-op behavior, and fail-closed ambiguous state.
- Test PM heartbeat behavior through command outcomes or skill protocol fixtures:
  required reads, allowed writes, operator escalation, self-pause preconditions,
  Workstream heartbeat pause/resume, and refusal to implement product scope.
- Test Workstream Agent behavior with claim-first worktree start, failed
  worktree creation cleanup, lease renewal, PM handoff summary, cleanup-ready
  marking, and refusal to land or delete worktrees.
- Test `OPERATOR.md` contract behavior through PM protocol tests that consume
  operator responses and translate decisions into work artifacts.
- Test automation `MEMORY.md` setup requirements without treating memory as
  canonical repo state.
- Reuse existing Bandit command tests, validator tests, work-item tests, landing
  gate tests, auto-land policy tests, and artifact creation tests as prior art.
- Add validation tests that detect registry/work-item disagreement, duplicate
  active claims, undeclared work surfaces, overlapping reservations, stale
  leases, and cleanup-ready worktrees awaiting PM verification.
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
- General agent access to `OPERATOR.md`.

## Test Or Verification Strategy

The implementation should be decomposed into slices that each produce RED
evidence before production code. The safest first slice is the global PM
heartbeat protocol and `OPERATOR.md` contract because parallel claims depend on
a control-plane role that can safely pause, recover, and escalate work.

Verification should combine:

- Unit-level command tests for claim, scheduler, registry, and worktree behavior.
- Validator tests for conflicting canonical state.
- Protocol tests for PM heartbeat and Workstream Agent boundaries.
- Fixture-based tests for `OPERATOR.md`, `CURRENT_CONTEXT.md`, automation
  `MEMORY.md`, and handoff summaries.
- Integration tests that simulate two concurrent claim attempts and prove only
  one can win.
- Manual dry runs only for automation platform pause/resume behavior until that
  path has a deterministic local test harness.

## Decomposition Notes

Implementation should wait until the active bootstrap-gap lane is complete,
blocked, or explicitly dispositioned. The first slice should define the PM
heartbeat protocol and operator escalation contract before enabling parallel
workstreams.

Major modules to build or modify:

- PM heartbeat global skill and Bandit adapter.
- Operator escalation inbox contract.
- Automation memory setup contract.
- Tagged Chore Ledger.
- Work item declared-surface metadata.
- Authoritative In-Flight Registry.
- Claim reconciliation and lease operations.
- Work surface reservation overlap detection.
- Scheduler candidate selection.
- Claim-first worktree lifecycle.
- Workstream handoff summary contract.
- PM cleanup and integration routing.
- Automation pause/resume adapter.
- Validation and reporting commands.

Proposed work draft:

```bandit-work-draft
{
  "items": [
    {
      "kind": "slice",
      "title": "PM Heartbeat Protocol And Operator Inbox",
      "goal": "Define the global PM heartbeat protocol, Bandit adapter, OPERATOR.md contract, and automation memory setup requirements before parallel execution begins.",
      "scope": [
        "Create the PM heartbeat authority envelope, required reads, allowed writes, pause rules, self-pause preconditions, and operator escalation workflow.",
        "Define OPERATOR.md as a compact PM-to-operator inbox with operator response handling and resolution rules.",
        "Define required automation MEMORY.md fields for PM and Workstream automations.",
        "Record Bandit adapter responsibilities without making the global PM heartbeat skill Bandit-only."
      ],
      "out_of_scope": [
        "Do not implement claim leases, worktree creation, or scheduler execution.",
        "Do not write production code outside protocol and validation surfaces.",
        "Do not create product-scope work without documented product scope."
      ],
      "acceptance_criteria": [
        "PM heartbeat protocol names required reads, allowed writes, forbidden actions, pause authority, self-pause preconditions, and escalation duties.",
        "OPERATOR.md contract is strictly operator-facing and excludes Workstream Agent context.",
        "Resolved operator entries have a required artifact translation and archive or removal rule.",
        "Automation MEMORY.md required fields are defined without becoming canonical workflow state.",
        "The protocol refuses product-scope creation without grill-with-docs output."
      ],
      "test_plan": [
        "Run focused validation tests for PM protocol required fields and forbidden actions.",
        "Run fixture tests for OPERATOR.md entries, operator responses, and resolution flow.",
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
        "PM heartbeat must not become implementation agent.",
        "OPERATOR.md must not become general agent context.",
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
      "title": "Tagged Chore Ledger And PM Triage",
      "goal": "Replace multiple chore surfaces with one tagged chore ledger and PM triage behavior for eligible low-risk fallback work.",
      "scope": [
        "Define a single Tagged Chore Ledger schema with type, origin, risk, heartbeat eligibility, blocker state, improvement metadata, and priority tags.",
        "Add PM triage behavior for FOLLOWUPS.md entries, documented chores, no-action decisions, and operator escalations.",
        "Expose read-only listing and validation for chore eligibility."
      ],
      "out_of_scope": [
        "Do not run chores automatically.",
        "Do not implement work claim leases.",
        "Do not change product scope without documented PRD input."
      ],
      "acceptance_criteria": [
        "Chores are represented in one ledger with tags or required fields rather than separate chore logs.",
        "The ledger can distinguish low-risk heartbeat-eligible chores from blocked or product-scope work.",
        "FOLLOWUPS.md triage produces chore, no-action, documented-scope, or OPERATOR.md escalation outcomes.",
        "Validation fails closed on missing risk, origin, eligibility, blocker, or improvement metadata."
      ],
      "test_plan": [
        "Run focused ledger parser and validator tests.",
        "Run PM triage fixture tests for follow-up conversion and no-action decisions.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; the ledger must keep explicit state and avoid hidden authority.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Ledger eligibility and validation refusal tests must exist before implementation."
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
        "docs/templates/tagged-chore.md"
      ],
      "first_implementation_order": [
        "Write failing validation tests for chore metadata.",
        "Add ledger schema and fixtures.",
        "Add read-only listing and PM triage behavior.",
        "Run validation and update evidence."
      ],
      "smell_triggers": [
        "Separate chore logs reappearing as parallel sources of truth.",
        "Heartbeat eligibility inferred from prose instead of metadata."
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
      "title": "In-Flight Registry And Atomic Claim Leases",
      "goal": "Create the CLI-owned Authoritative In-Flight Registry and atomic Work Claim Lease operations that prevent duplicate work.",
      "scope": [
        "Define registry schema for active claims, leases, owners, stages, surfaces, timestamps, worktree path, branch, renewal, and recovery metadata.",
        "Implement atomic claim, inspect, renew, release, fail, block, complete, and recover operations.",
        "Reconcile registry state with per-work-item coordination state before accepting claims.",
        "Fail closed on duplicate active claims, stale state, malformed registry, or registry/work-item disagreement."
      ],
      "out_of_scope": [
        "Do not create worktrees.",
        "Do not schedule candidate work.",
        "Do not integrate or land completed work."
      ],
      "acceptance_criteria": [
        "Two simultaneous claim attempts for the same work item and stage cannot both succeed.",
        "v0 permits at most one active claim per work item.",
        "Registry/work-item disagreement creates PM repair or recovery output.",
        "Expired claims with unmerged work become recovery-required rather than auto-deleted.",
        "Manual registry edits are detected by validation when they break reconciliation."
      ],
      "test_plan": [
        "Run focused claim tests for duplicate, stale, renewal, release, block, fail, complete, expiration, and recovery paths.",
        "Run fixture tests for registry/work-item disagreement.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; claim operations must keep state explicit and failure paths clear.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Duplicate-claim and reconciliation tests must fail before implementation."
        },
        {
          "stage": "Stage 3: Implementation Clean-Code Rubric",
          "verdict": "required",
          "evidence": "Atomic claim logic must be a deep module with a narrow interface."
        }
      ],
      "bootstrap_gaps": [
        "True cross-process locking semantics may need platform-specific verification."
      ],
      "expected_files": [
        "docs/work/<ID>/brief.md",
        "docs/work/<ID>/red-evidence.md",
        "docs/work/<ID>/implementation-evidence.md",
        "docs/work/<ID>/review-evidence.md",
        "docs/work/<ID>/landing-verdict.md",
        "docs/work/<ID>/landing-action.md",
        "docs/work/<ID>/retrospective.md",
        ".bandit/in-flight.json",
        ".bandit/policy/work-claims.json"
      ],
      "first_implementation_order": [
        "Write duplicate-claim and reconciliation RED tests.",
        "Define registry schema and claim state values.",
        "Implement atomic claim operations.",
        "Add validation and evidence."
      ],
      "smell_triggers": [
        "Any advisory-only lock behavior.",
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
      "operator_input_status": "No operator input is required for v0 claim semantics already captured in the PRD."
    },
    {
      "kind": "slice",
      "title": "Declared Work Surfaces And Collision Detection",
      "goal": "Require claimable work to declare expected write surfaces and refuse overlapping reservations before work starts.",
      "scope": [
        "Add declared work surface metadata for work items and chores.",
        "Normalize path patterns and named repo resources for collision checks.",
        "Detect exact, ancestor, descendant, and named-resource conflicts.",
        "Explain collision refusals with owner, work item, stage, and reserved surface."
      ],
      "out_of_scope": [
        "Do not infer unlimited write access from missing declarations.",
        "Do not implement full static analysis of all possible file writes.",
        "Do not allow product-scope claims without documented scope."
      ],
      "acceptance_criteria": [
        "A runnable work item without declared write surfaces is not claimable.",
        "Overlapping declared surfaces cannot be claimed concurrently.",
        "Non-overlapping surfaces can be claimed concurrently when work-item rules allow.",
        "Collision refusal messages identify the conflicting reservation and owner.",
        "Validation reports missing or malformed declared surfaces."
      ],
      "test_plan": [
        "Run focused overlap detection tests.",
        "Run claim integration tests with overlapping and non-overlapping surfaces.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; collision detection should be isolated and testable.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Surface collision tests must fail before implementation."
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
        "Write RED tests for missing, malformed, overlapping, and non-overlapping surfaces.",
        "Implement normalization and overlap checks.",
        "Integrate surfaces into claim validation.",
        "Update validation and evidence."
      ],
      "smell_triggers": [
        "Implicit write surfaces.",
        "Collision checks implemented as ad hoc string matching.",
        "Refusals that do not name the conflicting claim."
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
      "title": "Parallel Work Scheduler",
      "goal": "Select at most one runnable claim candidate per heartbeat using deterministic post-bootstrap priority rules.",
      "scope": [
        "Rank recovery-required claims first, then continuable active work, then highest-priority unblocked queued work, then eligible low-risk chores.",
        "Use roadmap or backlog order and work item ID as deterministic tie-breakers.",
        "Return no-op output when no work is claimable.",
        "Refuse ambiguous or unreconciled state instead of guessing."
      ],
      "out_of_scope": [
        "Do not run implementation work.",
        "Do not create worktrees.",
        "Do not schedule across multiple repositories."
      ],
      "acceptance_criteria": [
        "A heartbeat activation can select at most one claimable stage.",
        "Scheduler output explains why selected work was chosen.",
        "Scheduler output explains why blocked, overlapping, or ineligible work was skipped.",
        "Eligible chores are selected only when no higher-priority runnable work exists.",
        "No runnable work produces a clean no-op."
      ],
      "test_plan": [
        "Run scheduler priority fixture tests.",
        "Run no-op and ambiguous-state refusal tests.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; scheduler ranking must be deterministic and explainable.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Priority ordering tests must fail before implementation."
        }
      ],
      "bootstrap_gaps": [
        "Heartbeat platform frequency controls remain outside the repo; scheduler behavior is repo-native."
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
        "Write RED tests for priority ranking and no-op behavior.",
        "Implement candidate collection from reconciled repo state.",
        "Implement one-claim scheduling output.",
        "Integrate with claim operations and validation."
      ],
      "smell_triggers": [
        "Batch queue draining.",
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
      "operator_input_status": "No operator input is required for scheduler priority because this PRD records the v0 priority order."
    },
    {
      "kind": "slice",
      "title": "Claim-First Worktree Lifecycle",
      "goal": "Create ephemeral worktrees only after successful claims and reserve PM-only cleanup after transfer verification.",
      "scope": [
        "Add worktree creation after successful claim and record worktree path and branch in the lease.",
        "Handle worktree creation failure by releasing or marking the claim failed.",
        "Add workstream handoff summary requirements for completion, verification, blockers, next stage, and cleanup readiness.",
        "Add PM cleanup verification and deletion flow."
      ],
      "out_of_scope": [
        "Do not give workstream agents landing authority.",
        "Do not allow workstream agents to delete worktrees.",
        "Do not implement PR-based landing governance."
      ],
      "acceptance_criteria": [
        "Worktree creation is refused without an active claim.",
        "A failed worktree creation does not leave an active false claim.",
        "Completed work includes a PM-consumable handoff summary before claim release.",
        "Only PM cleanup flow deletes worktrees after verifying transfer.",
        "Recovery-required worktrees are never auto-deleted."
      ],
      "test_plan": [
        "Run worktree lifecycle tests with successful creation, failed creation, handoff, cleanup-ready, and recovery paths.",
        "Run command tests proving workstream cannot land or delete worktrees.",
        "Run npm test, npm run typecheck, npm run bandit -- validate, and git diff --check."
      ],
      "clean_code_read_evidence": "CLEAN_CODE.md must be read before this slice; lifecycle side effects must be explicit and reversible where possible.",
      "stage_rubric_checklist": [
        {
          "stage": "Stage 2: Test Design And RED Evidence",
          "verdict": "required",
          "evidence": "Claim-first worktree tests must fail before implementation."
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
        "docs/templates/workstream-handoff.md"
      ],
      "first_implementation_order": [
        "Write RED tests for claim-first worktree behavior.",
        "Implement worktree creation and failure handling.",
        "Implement handoff summary and cleanup-ready state.",
        "Implement PM cleanup verification."
      ],
      "smell_triggers": [
        "Speculative worktree creation.",
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
      "operator_input_status": "No operator input is required for v0 worktree lifecycle boundaries."
    },
    {
      "kind": "slice",
      "title": "Workstream Heartbeat Execution Contract",
      "goal": "Connect single-claim scheduling to worker heartbeat execution while preserving no-op behavior and role boundaries.",
      "scope": [
        "Define Workstream Agent required reads, claim attempt flow, allowed actions, forbidden actions, and no-op behavior.",
        "Connect scheduler output to claim acquisition and claim-first worktree start.",
        "Require lease renewal for long-running work.",
        "Require completion, block, failure, and cleanup-ready outputs that PM can consume."
      ],
      "out_of_scope": [
        "Do not implement PM heartbeat governance in the worker.",
        "Do not implement landing or PR resolution.",
        "Do not delete worktrees from workstream execution."
      ],
      "acceptance_criteria": [
        "Each Workstream heartbeat activation claims at most one stage.",
        "No available claim produces a clean no-op.",
        "Worker actions without a claim are refused when they mutate state.",
        "Lease renewal and stale lease behavior are visible in registry state.",
        "Worker output is sufficient for PM to continue without chat context."
      ],
      "test_plan": [
        "Run worker protocol tests for no-op, claim success, claim refusal, renewal, block, failure, and completion.",
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
        "Write RED tests for Workstream heartbeat single-claim behavior.",
        "Implement protocol checks and no-op output.",
        "Integrate scheduler, claim, and worktree lifecycle.",
        "Record evidence and validation."
      ],
      "smell_triggers": [
        "Worker takes PM decisions.",
        "Worker lands or deletes worktrees.",
        "Heartbeat drains multiple items."
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
      "origin": "Post-bootstrap parallel workstream rollout dependency recorded in FOLLOWUPS.md.",
      "scope": [
        "Define how Bandit detects installed global skills, automation prompts, and repo integration files that need updates.",
        "Define how updates are previewed, applied, verified, and rolled back or repaired.",
        "Document rollout requirements before PM heartbeat is used across multiple projects."
      ],
      "acceptance_criteria": [
        "The update path has an explicit source of truth and does not overwrite user-local changes silently.",
        "Installed-copy drift can be reported before applying updates.",
        "The global PM heartbeat skill and Bandit adapter can be distributed consistently.",
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

The first executable implementation should be the PM heartbeat protocol and
operator inbox contract. Parallel workstreams need a control plane before they
need more worker lanes.

Once Bandit moves to PR-based workflows, PR issue resolution and safe landing
should become a separate governed agent capability with its own PRD, policy,
and skill. This PRD only preserves that boundary.
