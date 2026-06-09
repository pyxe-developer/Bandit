# BANDIT-085: Repo-Wide Transition Index Disposition

## Disposition

**Decision: Deferred** — no repo-wide transition index is justified at current
scale and query pressure. Per-work-item coordination logs remain canonical.
Named trigger conditions and a derived-only rebuild contract are recorded for
future reference. No implementation is authorized by this work item.

---

## Source Citations

### WIL-REPO-WIDE-TRANSITION-INDEX

**Source:** `.bandit/work-intake-ledger.json`, entry `WIL-REPO-WIDE-TRANSITION-INDEX`

- Title: "Repo-Wide Transition Index Decision"
- Source anchor: "Consider Repo-Wide Transition Index" in `FOLLOWUPS.md`
- Origin date: 2026-06-09
- Intake outcome: `formed`; formed work item: `BANDIT-085`
- Suggested type: gap
- Risk/product scope: decision/triage only; no repo-wide index implementation,
  canonical shared transition authority, local API, State Index, scheduler,
  claim/worktree lifecycle, merge, push, deploy, paid routing, hosted service,
  public benchmark publication, Trust Verifier cutover, or unrelated product
  work authorized by formation

**Source:** `FOLLOWUPS.md`, section "Consider Repo-Wide Transition Index"

- Origin: Coordination primitive design discussion, 2026-05-24
- Current decision at intake: canonical Step Transition Ledgers are append-only
  and scoped per work item
- Follow-up question: should Bandit add a repo-wide derived transition index for
  faster cockpit queries, cross-work-item reporting, or heartbeat scheduling?
- Why later: a repo-wide canonical ledger creates a shared hot file and weakens
  review locality; a derived index may be useful once cockpit and heartbeat
  query needs are concrete
- Expected evaluation point: when cockpit, heartbeat, or cross-repo coordination
  work needs efficient queries across many work items

### Current Routing Evidence

**Source:** `docs/roadmap/CURRENT_CONTEXT.md` (last updated 2026-06-09)

- Active work item: `BANDIT-085` - Repo-Wide Transition Index Decision
- Stage 3 implementation dispatched; coordination log sequence 4 records
  `red_recorded` with `implementation_allowed` as safe trigger
- No bootstrap gap blocks this work item
- No operator-owned input required for the current action
- Halt conditions include: approving a canonical repo-wide transition ledger,
  State Index, local API, scheduler, claim/worktree lifecycle, guarded browser
  action execution, Trust Verifier cutover, merge/push/deploy, paid routing,
  or hosted services

**Source:** `docs/roadmap/ROADMAP.md`

- `BANDIT-085` is current gap: "determine whether a derived repo-wide
  transition index is justified for cockpit, heartbeat, or cross-work-item
  reporting; keep per-work-item ledgers canonical"
- `WIL-COORDINATION-PRIMITIVE`, `WIL-PR-CICD-LANDING`, `WIL-INSTALLED-COPY-UPDATE`
  remain proposal-only
- `WIL-V0-TRIAL` is deferred behind this lane and depends on
  `WIL-REPO-WIDE-TRANSITION-INDEX` being closed or dispositioned
- No blocking gaps in `.bandit/bootstrap-gaps.json`

**Source:** `STATUS.md` (last updated 2026-06-09)

- `BANDIT-085` is formation approved; required operator input: none_required

**Source:** `docs/work/BANDIT-085/brief.md`

- Work type: chore (decision/triage only); no implementation authorized

**Source:** `docs/work/BANDIT-085/orchestration-plan.md`

- Contract version 1; coordination state: `formation_approved`
- Stage 3 required artifacts: `repo-wide-transition-index-disposition.md`,
  `writer-report.md`, `implementation-evidence.md`
- No stage authorizes a canonical repo-wide transition ledger

### Recent Landed Coordination Log Evidence

**BANDIT-081** (`docs/work/BANDIT-081/coordination-log.jsonl`) — Operator Attention / Operator Inbox Surface

10 transitions: `brief_created` → `formation_approved` → `orchestration_plan_recorded`
→ `red_recorded` → `implementation_recorded` → `review_recorded` →
`feature_uat_approved` → `landing_verdict_recorded` → `landed` → `closed`.

Implementation evidence (sequence 5) shows `src/state/cockpit-status.ts`,
`src/state/cockpit-view-model.ts`, `src/cockpit/browser-shell.ts`, and
`public/cockpit/cockpit.css` as cockpit-projection artifacts. These derived-state
consumers read per-work-item coordination logs; they do not aggregate transitions
into a shared canonical ledger. Cockpit status reads the current work item's
log and CURRENT_CONTEXT.md. No cross-work-item index was needed or created.
Closed cleanly.

**BANDIT-082** (`docs/work/BANDIT-082/coordination-log.jsonl`) — Work Intake Ledger And Followups Migration

9 transitions: `brief_created` → `formation_approved` → `orchestration_plan_recorded`
→ `red_recorded` → `implementation_recorded` → `review_recorded` →
`landing_verdict_recorded` → `landed` → `closed`.

Implementation evidence (sequence 5) shows `.bandit/work-intake-ledger.json`,
`src/state/work-intake-ledger.ts`, and `src/commands/work-intake.ts`. The Work
Intake Ledger is a separate derived projection for intake proposal lifecycle
state — not transition history. No cross-work-item transition aggregation was
needed. Closed cleanly.

**BANDIT-083** (`docs/work/BANDIT-083/coordination-log.jsonl`) — Bandit Cockpit UI Polish From Attached Design

10 transitions including product UAT: `brief_created` → `formation_approved` →
`orchestration_plan_recorded` → `red_recorded` → `implementation_recorded` →
`review_recorded` → `feature_uat_approved` → `landing_verdict_recorded` →
`landed` → `closed`.

Implementation evidence (sequence 5) shows `src/state/cockpit-evidence-detail.ts`,
`src/state/cockpit-actions.ts`, `src/cockpit/render.ts`, `src/cockpit/browser-shell.ts`,
`src/cockpit/preview-status-snapshot.ts`. Cockpit UI polish consumed per-work-item
log state through existing derived projections — no cross-work-item transition
aggregation was needed. Closed cleanly.

**BANDIT-084** (`docs/work/BANDIT-084/coordination-log.jsonl`) — Claim-First Transition Policy Triage

9 transitions: `brief_created` → `formation_approved` → `orchestration_plan_recorded`
→ `red_recorded` → `implementation_recorded` → `review_recorded` →
`landing_verdict_recorded` → `landed` → `closed`.

This was also a decision/triage chore (pattern matches BANDIT-085). Stage 3
produced `claim-first-transition-disposition.md`, `writer-report.md`, and
`implementation-evidence.md`. Closed with a deferred disposition for universal
claim-first policy. No cross-work-item transition aggregation was needed for
the triage. Closeout next-action (sequence 9) names `WIL-REPO-WIDE-TRANSITION-INDEX`
as the authorized next gap before Coordination Primitive Completion Triage.

**Pattern across BANDIT-081 through BANDIT-084:**

All four work items completed their full lifecycle through per-work-item
coordination logs without any cross-work-item index. Each cockpit or
projection surface that was added read from per-work-item logs and
CURRENT_CONTEXT.md. No concrete query pressure for a repo-wide index was
observed or recorded during any of these work items.

### Existing Derived Projection Surfaces

The following surfaces already satisfy known aggregation and query needs. None
is canonical transition history; all are derived, rebuildable, and
non-authoritative.

| Surface | Source artifacts | Query satisfied | CLI route |
| --- | --- | --- | --- |
| Cockpit status | `CURRENT_CONTEXT.md`, active work-item `coordination-log.jsonl` | Current active work-item state | `bandit cockpit status` |
| Session-context packet | `CURRENT_CONTEXT.md`, `ROADMAP.md`, `STATUS.md` | Focused per-session state for dispatch | `bandit session-context current` |
| Work-intake validate/listing | `.bandit/work-intake-ledger.json` | Intake proposal lifecycle state | `bandit work-intake validate` |
| Queue/context | `ROADMAP.md`, intake ledger | Next-action queue | `bandit queue` |
| Improvement health | `docs/work/*/improvement-disposition.md` | Improvement chore status | `bandit improvement-health` |
| Coordination validation | Per-work-item `coordination-log.jsonl` | Single work-item transition validity | `bandit coordination validate <ID>` |
| Heartbeat | Per-work-item logs, `CURRENT_CONTEXT.md` | Bootstrap-gap next-action, UAT status | `bandit heartbeat` |

**Note on CLI command evidence:** Verification commands `bandit cockpit status --json`,
`bandit session-context current --json`, and `bandit work-intake validate --json`
required user approval during this Stage 3 execution and could not be run.
Current state is derived from the static file evidence listed above and the
coordination-log.jsonl sequences. Verification commands are recorded as required
post-write checks in the writer report.

No surface above requires a repo-wide canonical transition index. Each reads the
data it needs from per-work-item logs or CURRENT_CONTEXT.md and produces a
non-authoritative projection.

---

## Source-Of-Truth Policy: Unchanged

Per-work-item `docs/work/<work-item-id>/coordination-log.jsonl` files remain
canonical append-only Step Transition Ledgers.

Cockpit status, session-context packets, intake ledger entries, queue/context
projections, heartbeat/improvement-health reports, roadmap text, generated
summaries, static previews, browser state, caches, databases, and any future
repo-wide index are projections. They cannot grant workflow authority, claim
authority, scheduling authority, Work Item allocation, UAT approval, landing
approval, or merge/push/deploy authority.

This policy is unchanged by this triage. Any future operator-approved policy
that grants canonical authority to a repo-wide index would require a separate
operator-owned gate and explicit policy artifact — this disposition does not
approve, recommend, or authorize that change.

---

## Benefits vs. Risks Analysis

### Benefits of a Rebuildable Derived Transition Index

1. **Faster cockpit queries.** A pre-built index avoids scanning every
   `docs/work/*/coordination-log.jsonl` on each cockpit status request. At
   85 work items this is fast; at 500+ it may matter.

2. **Cross-work-item reporting.** An index enables queries like "all work items
   in `review_recorded` state" without iterating every per-work-item log.

3. **Heartbeat and scheduler pressure.** A scheduler fanning out across many
   active work items could use an index for O(1) lookups instead of O(n) scans.

4. **Cross-model tension tracking.** Aggregating reviewer findings across work
   items could expose recurring code smells without manual log inspection.

### Risks of a Repo-Wide Canonical Hot File

1. **Duplicate source-of-truth.** If the index drifts from per-work-item logs
   it silently lies. Downstream trust degrades without visible failure.

2. **Stale projection trust.** Consumers may trust an index last rebuilt several
   work items ago. Without fail-closed freshness enforcement, staleness is
   invisible.

3. **Hidden workflow authority.** Any routing, scheduling, or gate decision that
   reads the index instead of the canonical per-work-item log makes the index
   de facto authoritative without an explicit operator-approved policy change.

4. **Review-locality loss.** A repo-wide index is reviewed as a diff against
   itself; reviewers lose the per-item context needed to catch transition errors.

5. **Unnecessary coupling.** Building an index ahead of any concrete
   scheduler or cockpit need creates a build-order dependency and a surface that
   must be kept valid even during bootstrap.

6. **Concurrent write risk.** Multiple agent worktrees could conflict on a shared
   index file. Per-work-item logs are isolated by construction; a shared index
   is not.

### Assessment at Current Scale (BANDIT-085)

At 85 work items each coordination log has 9–10 lines. Scanning all of them
on demand is sub-second. No current cockpit surface, heartbeat, or scheduler
requires cross-work-item aggregation at a cadence or scale that would stress
a filesystem scan. The benefits of an index are speculative; the structural
risks are immediate. Deferred is the correct outcome.

---

## Disposition: Deferred With Named Trigger Conditions And Conditional Scope

### Decision

**Deferred.** No repo-wide transition index is implemented or authorized by
this work item. The decision is deferred until one or more named trigger
conditions are observed and a concrete query need is documented.

Per-work-item `docs/work/<work-item-id>/coordination-log.jsonl` files remain
canonical. All existing derived projection surfaces remain non-authoritative.

### Named Trigger Conditions For Reconsideration

Reconsider when any of the following is observed:

1. **Scale pressure.** Cockpit or improvement-health queries must scan more than
   100 work-item directories in a hot path and latency is operationally
   noticeable.

2. **Scheduler aggregation need.** A scheduler or heartbeat surface needs
   current transition state across all active work items faster than a directory
   scan allows.

3. **Cross-work-item reporting need.** A concrete feature requires queries like
   "all work items in state X" at a cadence that makes filesystem scanning
   impractical.

4. **Coordination Primitive Completion Triage finding.** WIL-COORDINATION-PRIMITIVE
   produces a recommendation identifying aggregation patterns that per-work-item
   logs and existing derived projections cannot satisfy.

5. **V0 Trial blocking gap.** The V0 Closeout Claude Code A/B Product-Value
   Trial explicitly requires cross-work-item transition reporting that the
   current projection surfaces cannot provide.

### Conditional Future Implementation Scope (Not Authorized Here)

If a trigger condition is observed, a future work item may implement a
derived-only index under the following contract. This is recorded for reference;
no implementation is authorized by this disposition.

**Derived-Only Rebuild Contract:**

- **Source artifacts:** All `docs/work/*/coordination-log.jsonl` files at
  rebuild time. The set expands as work items are created.
- **Index location:** `.bandit/derived/transition-index.json` or equivalent;
  never inside `docs/work/*/`; never a database or SQLite store without
  separate operator approval.
- **Authority:** Non-authoritative. Read-only cache. Must never be the primary
  source for any workflow gate, claim, scheduling, UAT, landing, or
  merge/push/deploy decision.
- **Rebuild trigger:** On-demand only (e.g., `bandit transition-index rebuild`).
  No live polling, no background write, no scheduler-driven auto-rebuild.
- **Freshness rules:** Index must record its build timestamp and source file
  set. Consumers must check freshness before trusting results.
- **Staleness definition:** The index is stale if any `coordination-log.jsonl`
  has been modified since the index was built. A validator must detect this.
- **Failure behavior:** A stale or unavailable index must fail closed (emit a
  clear error) rather than silently return stale data. Surfaces must fall back
  to per-work-item log scanning when the index is unavailable or stale.
- **Expected RED tests (for future Test Writer):**
  - Rebuilding from a known log set produces a correct aggregated view.
  - The index records its build timestamp and source file set.
  - A stale index fails closed with a clear error message.
  - The index is never consulted for workflow gate, claim, or scheduling
    decisions; any surface that attempts to grant authority from the index
    must fail validation.
  - Deleting the index does not break any canonical coordination-log command.
- **Review gates:** Normal Stage 2 RED evidence, Stage 3 implementation, Stage 4
  Local Qwen and CodeRabbit review, risk classification, supply-chain gate, and
  Stage 5 landing verdict/action — before any cockpit or scheduler surface uses
  the index.
- **Explicit non-goals:** The index must never become canonical; never grant
  claim, scheduling, UAT, landing, or merge/push/deploy authority; never replace
  per-work-item append-only logs; never run live polling or background writes;
  never be a SQLite store, database, or hosted service without separate operator
  approval; never be shared across repos or published externally.

### Operator-Owned Decisions (If Future Implementation Is Sought)

If a future work item proposes to implement a repo-wide transition index, the
following decisions require explicit operator approval and must not be guessed:

- Approving a canonical (non-derived) repo-wide transition ledger that gains
  workflow authority.
- Approving a State Index with claim, scheduling, or UAT authority.
- Approving a local API or hosted service for the index.
- Approving a background scheduler or live polling rebuild route.
- Approving a SQLite store or database for transition history.
- Approving merge/push/deploy behavior tied to the index.
- Approving paid routing or public benchmark publication of index outputs.

None of these are approved or recommended by this disposition.

---

## Summary

| Dimension | Verdict |
| --- | --- |
| Is a repo-wide transition index justified now? | No |
| Does per-work-item log scanning meet current needs? | Yes |
| Does any existing derived surface require a repo-wide index? | No |
| Are trigger conditions named for future reconsideration? | Yes |
| Is implementation authorized by this work item? | No |
| Does source-of-truth policy change? | No |
| Is operator approval needed for this deferred disposition? | No |
| What would require operator approval? | Any proposal to make a repo-wide index canonical, grant it workflow authority, or implement it as a database/API/scheduler |

**Disposition: Deferred.** Land and close this work item. Reconsider when a
named trigger condition is observed and a concrete implementation need is
documented.
