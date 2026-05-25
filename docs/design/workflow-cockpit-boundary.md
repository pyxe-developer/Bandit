# Workflow Cockpit Boundary

## Status

Boundary contract for `BANDIT-024` - Workflow Cockpit Boundary Scope.

This artifact defines what the future Workflow Cockpit may read, display, and
invoke without becoming canonical workflow authority. It is a scoping contract,
not a Phase 8 web implementation plan.

## Source Material

- `README.md`
- `CONTEXT.md`
- `docs/architecture/founding-architecture.md`
- `docs/plans/V0_PLAN.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `docs/prds/BANDIT-PRD-001-founding-product.md`
- `docs/decisions/2026-05-24-cli-authority-workflow-cockpit.md`
- `docs/decisions/2026-05-24-repo-native-state-index.md`
- `docs/decisions/2026-05-24-cli-owned-uat-approval-artifact.md`
- `docs/decisions/2026-05-24-auto-land-chores-and-uat-approved-slices.md`
- `docs/decisions/2026-05-24-coordination-primitive-state-ledger.md`
- `docs/decisions/2026-05-24-workflow-improvement-engine.md`

## Authority Rules

1. The CLI owns workflow state transitions, repo mutations, quality gates,
   permission enforcement, model and review integrations, evidence writes, UAT
   artifact writes, and landing verdicts.
2. Repo-native artifacts are canonical. Cockpit process memory, browser
   storage, local API caches, SQLite rows, labels, comments, and GitHub mirrors
   are derived or convenience state only.
3. A State Index may exist for filtering, search, responsiveness, and dashboard
   queries, but it must be rebuildable from repo artifacts and may be deleted
   without losing canonical workflow state.
4. The cockpit may display state and request approved CLI actions. The CLI must
   validate and perform the action, then write any canonical artifact.
5. The cockpit must fail closed when required repo evidence is missing,
   contradictory, stale, or blocked by operator-owned input.
6. The cockpit must not infer product UAT approval, merge readiness, deploy
   safety, business tradeoffs, policy changes, cost approval, or explicit risk
   overrides.
7. Future server mode, local API mode, or cross-repo aggregation must preserve
   the same repo-artifact authority boundary.

## Read Boundary

The cockpit may read canonical repo artifacts directly or through a local API
that serves reconciled CLI-derived state. Either path must expose source
artifact paths and validation status so an operator can trace every displayed
state back to the repository.

| Cockpit surface | Current source artifacts | Status |
| --- | --- | --- |
| Current phase and next action | `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md` | Available now. |
| Active work item | `docs/roadmap/CURRENT_CONTEXT.md`, `docs/work/<ID>/brief.md`, `.bandit/bootstrap-gaps.json` for gap-linked chores | Available now. |
| Work item brief and scope | `docs/work/<ID>/brief.md`, `docs/specs/*.json` when created by CLI commands | Available now. |
| RED, implementation, review, landing, and retrospective evidence | `docs/work/<ID>/*.md` evidence artifacts | Available now when recorded by the current stage. |
| Bootstrap gap queue and status | `.bandit/bootstrap-gaps.json`, `bandit gaps list` output | Available now. |
| CLI validation status | `bandit validate`, focused command outputs, and recorded verification evidence | Available now as command-derived state. |
| Landing readiness and landing verdicts | `docs/work/<ID>/review-evidence.md`, `docs/work/<ID>/landing-verdict.md`, `bandit land-check <ID>` | Available now for implemented gates. |
| UAT status | CLI-owned UAT artifacts from `BANDIT-012`; stale-UAT checks from landing gates | Available now when a feature slice has UAT evidence. |
| Auto-landing eligibility | `bandit auto-land-check <ID>`, landing policy artifacts, landing verdicts | Available now for implemented local-record auto-landing checks. |
| Review state | CodeRabbit evidence, Local Qwen evidence, escalated review evidence, aggregate review evidence under `docs/work/<ID>/` | Available now when Stage 4 evidence exists. |
| Improvement health | Retrospectives, follow-up chores, improvement metadata, metrics catalog, future improvement ledger | Partially available now; full evaluation views depend on Phase 7. |
| Coordination state and actor handoff | Existing work artifacts and current-context files | Deferred to Phase 6 for canonical step transition ledger and actor coordination events. |
| Safe trigger points | Validated step transitions from the future coordination ledger | Deferred to Phase 6; raw actor events must not trigger automation in v0. |
| Cross-repo coordination | Self-governing repo-local Bandit state | Deferred; no central cockpit authority exists in this chore. |

## Display Boundary

The first cockpit information architecture should be minimal and evidence-led:

1. Current context: phase, active work item, next action, blockers, and required
   operator-owned input.
2. Work queue: PRDs, slices, chores, bootstrap gaps, and linked work-item
   artifacts.
3. Gate status: test, validation, review, UAT, landing, retrospective, and
   improvement-capture state, with source artifact links.
4. Landing status: code-safety verdict, UAT status for feature slices,
   auto-landing eligibility, stale evidence, and missing gate blockers.
5. Improvement health: open improvement chores, due evaluations, adopted or
   reverted workflow changes, repeated smells, and cross-model tension patterns
   as those artifacts become available.
6. Coordination status: after Phase 6, current workflow state, active claims,
   blocks, handoffs, repair requests, and safe trigger points from the
   canonical coordination ledger.

The cockpit must show unknown, unavailable, blocked, or deferred state as such.
It must not hide gaps by synthesizing status from incomplete artifact presence.

## Action Boundary

The cockpit may expose an action only when the action maps to an approved CLI
command family and the CLI remains responsible for validation, mutation, and
evidence writes.

| Requested action | CLI authority boundary | Cockpit status |
| --- | --- | --- |
| Validate repository state | `bandit validate` | Allowed. |
| List or inspect work items | `bandit list`, `bandit show <ID>` | Allowed. |
| Inspect bootstrap gaps | `bandit gaps list` | Allowed. |
| Create work from an approved spec | `bandit work-item create <spec-path>` or `bandit draft-work <feature-prd-path>` | Allowed when operator/product scope is already approved. |
| Create supported artifacts | `bandit artifact create ...` command family | Allowed when artifact type and work item are valid. |
| Record routing decisions | Existing or future routing CLI command family | Allowed only through CLI-owned artifacts. |
| Run review gates | `bandit qwen-review <ID>` and future CodeRabbit/escalated reviewer commands | Allowed when required provider setup and cost policy are satisfied. |
| Check landing readiness | `bandit land-check <ID>` and `bandit auto-land-check <ID>` | Allowed as read-only readiness checks. |
| Record UAT approval | Future or existing CLI-owned UAT approval command | Allowed only when invoked by the authorized operator; cockpit storage is not canonical. |
| Land eligible work | Landing Agent CLI command family | Deferred until the landing command and policy are explicit for the target repository. |
| Refresh a State Index | Future index refresh command | Allowed only as rebuildable derived state. |
| Evaluate improvement chores | Future Phase 7 evaluation command | Deferred until Phase 7 defines command and artifact contracts. |
| Claim, hand off, block, or complete a work step | Future Phase 6 coordination CLI commands | Deferred until Phase 6 defines ledger and event contracts. |

## Explicitly Out Of Scope

- Phase 8 web cockpit implementation, UI stack selection, local API shape, or
  component design.
- Product UAT approval by Codex PM or by the cockpit.
- Automatic merge, push, deploy, production canary, or destructive production
  action without explicit Landing Agent and deployment policy.
- Cross-repo coordination authority or central workflow source of truth.
- Coordination primitive implementation before Phase 6.
- Improvement evaluation engine implementation before Phase 7.
- Hidden writes to canonical workflow state from browser storage, SQLite, local
  server memory, GitHub labels, or GitHub comments.

## Defer And No-Action Decisions

| Topic | Decision | Reason |
| --- | --- | --- |
| Exact cockpit screens | Defer. | Repo artifacts define required surfaces, but product/UI tradeoffs belong to Phase 8. |
| Cockpit stack and packaging | Defer. | Existing decisions intentionally leave Vite/React versus alternatives undecided. |
| Direct file reads versus local API | Defer. | Both are allowed if CLI authority and source traceability are preserved. |
| State Index timing | Defer. | SQLite is allowed only as rebuildable derived state; first index should wait until cockpit query needs are concrete. |
| Cross-repo coordination model | Defer. | Phase 6 and later cross-repo work must define repo registration and aggregation boundaries. |
| UI-owned policy exceptions | No action. | Cockpit must not own policy exceptions; operator-owned policy changes must be recorded through repo artifacts. |

## Acceptance Checklist

- CLI Authority is explicit.
- Repo-native artifacts remain canonical.
- SQLite or any State Index is rebuildable only.
- Each planned cockpit surface maps to current source artifacts or a deferred
  phase dependency.
- Each allowed cockpit action maps to CLI authority or is deferred.
- UAT remains operator-owned and CLI-recorded.
- Landing, merge, push, deploy, and risk overrides remain outside cockpit
  authority unless future CLI policy explicitly allows them.
- Phase 8 web implementation remains blocked until this boundary passes Bandit
  review and landing gates.
