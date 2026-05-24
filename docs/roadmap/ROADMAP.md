# Bandit Roadmap

## Purpose

This roadmap decomposes the founding PRD into phases the operator and Codex PM can follow without losing context.

It is not a full slice backlog. Slice briefs are created one at a time when a phase is ready to execute. This document answers:

- What are we building?
- What phase are we in?
- What is done?
- What is next?
- What context must never be lost?

## Current Position

**Current phase:** Phase 5 - UAT And Auto-Landing.

**Current next step:** Disposition the `BANDIT-016` Local Qwen `non_blocking`
findings and decide the narrow repair/rerun route from repo evidence. Local
Qwen and aggregate review evidence are now recorded for `BANDIT-016`; the
aggregate evidence records Codex PM no-action rationale for this chore, but
`land-check` still requires a passing Local Qwen reviewer verdict before
landing. Full verification passed, fixture-backed live CodeRabbit pass evidence
is recorded, and the escalated-review bootstrap disposition is recorded for the
implemented evidence-head contract. The narrow landing-readiness implementation
now lets terminal disposition-only Stage 4 evidence stop recursive rerun
blockers, requires concrete PM rationale for accepted Local Qwen findings, and
preserves fail-closed source drift after review.
`BANDIT-015` landed for `BANDIT-GAP-LIVE-CODERABBIT` with RED evidence
implementation evidence, CodeRabbit evidence, review evidence, and local Qwen
evidence recorded. Codex PM triaged and repaired the valid local Qwen
missing-PR-context finding; CodeRabbit and aggregate review evidence are now
refreshed at the repair head. Local Qwen was rerun at
`3b78a641fb6a2d01adbac457f9ee28115db1aa9d` and recorded two `non_blocking`
findings: align aggregate review evidence with local Qwen state before
closeout, and disposition the `redactSecrets` substring over-redaction
hardening concern. Codex PM disposition is recorded in
`docs/work/BANDIT-015/qwen-rerun-disposition.md`. Local Qwen was rerun again at
PM disposition head `068c4482ba156a158abd92faba2fcee2841f2288` and returned a
`blocker` verdict in `docs/work/BANDIT-015/local-qwen-review.md`. Codex PM
triage of those blocker findings is recorded in
`docs/work/BANDIT-015/qwen-blocker-disposition.md`. Local Qwen was rerun at
blocker-disposition head `4569c8f92eacf7df098f7f370bd8ac1c09d82b96` and
returned another `blocker` verdict. Codex PM triage is recorded in
`docs/work/BANDIT-015/qwen-latest-blocker-disposition.md`; the remaining
blocker was the missing `docs/work/BANDIT-015/escalated-review.md` artifact,
which is now recorded as the bootstrap-limited escalated-review disposition.
Local Qwen was rerun at escalated-review disposition head
`16e7ecac0f2d590f9413c8f30d8ed3f554ceb91a` and returned another `blocker`
verdict, now focused on procedural Stage 4 rerun state and stale or mismatched
source heads between local Qwen and CodeRabbit evidence. Codex PM triaged that
blocker in `docs/work/BANDIT-015/qwen-evidence-head-disposition.md`, refreshed
CodeRabbit evidence at source head
`c584fe3b06692632723aedad2f1f9d69db607602`, and committed the disposition at
`9248f34b104bc45eed91fb752a49eb0de987e470`. Local Qwen was rerun at that
evidence-head-disposition head and returned another `blocker` verdict: the
implementation behavior is accepted, but Stage 4 remains blocked on
self-referential rerun wording and divergent artifact source heads. The
operator ended that recursive loop, required it to be captured as follow-up
chore work after landing, and authorized landing now. `BANDIT-015` has landing
verdict, landing action, retrospective, gap-ledger disposition, and updated
context.
`BANDIT-016` is active as the Stage 4 evidence-head bootstrap-gap chore. Its
RED evidence is recorded in `docs/work/BANDIT-016/red-evidence.md`, and
implementation evidence is recorded in
`docs/work/BANDIT-016/implementation-evidence.md`, CodeRabbit evidence is
recorded in `docs/work/BANDIT-016/coderabbit-review.md`, escalated-review
bootstrap disposition is recorded in
`docs/work/BANDIT-016/escalated-review.md`, Local Qwen evidence is recorded in
`docs/work/BANDIT-016/local-qwen-review.md`, and aggregate review evidence is
recorded in `docs/work/BANDIT-016/review-evidence.md`. The next step is
disposition and repair/rerun routing for the Local Qwen `non_blocking` findings.
Open bootstrap gaps remain the work queue and must be addressed one at a time
before unrelated new work proceeds.

**Current implementation status:** `BANDIT-001` delivered the repo-native CLI skeleton and initialized `.bandit/` state. `BANDIT-002` delivered work artifact templates, template validation, local verification, review evidence, landing verdict, and retrospective. `BANDIT-003` delivered the remaining Phase 2 PRD-to-work draft command with RED evidence, implementation evidence, review evidence, landing verdict, retrospective, landing action evidence, and passing verification. `BANDIT-004` delivered the Smell Trigger Catalog seed, routing decision artifact contract, validation path, route command, review evidence, landing verdict, landing action evidence, and retrospective. `BANDIT-005` delivered the first Phase 4 pre-landing review loop substrate with review evidence and landing verdict contracts, source-drift checks, `bandit land-check <work-item-id>`, landing action evidence, and retrospective closeout. `BANDIT-006` delivered the Local Qwen Baseline Reviewer Gate substrate with profile/evidence validation, `bandit qwen-review <work-item-id>`, dirty-worktree refusal, review-packet construction, land-check integration, review evidence, landing verdict, landing action evidence, and retrospective closeout. `BANDIT-007` delivered the CodeRabbit State Capture substrate with a CodeRabbit evidence template, parser/validator, `bandit coderabbit-review <work-item-id>`, `land-check` integration for claimed CodeRabbit pass state, closeout evidence, and retrospective. Live CodeRabbit polling remains a bootstrap gap, not a pass. `BANDIT-008` repaired Local Qwen reviewer runtime drift away from Qwen Code/Ollama. `BANDIT-009` repaired local Qwen full-packet reliability by preserving structured findings, switching the live harness path to direct local oMLX, fixing review-packet diff-base selection, and recording passing live local Qwen evidence for a real Bandit packet. `BANDIT-010` delivered the escalated adversarial reviewer placeholder contract and routing-aware `land-check` enforcement. `BANDIT-011` delivered bootstrap-gap chore tracking and routing with `.bandit/bootstrap-gaps.json`, default ledger creation during `bandit init`, fail-closed validation, `bandit gaps list`, review evidence, local Qwen review, escalated-review bootstrap disposition, landing verdict, retrospective, and landing action evidence. `BANDIT-012` delivered CLI-owned UAT approval artifacts, `bandit uat approve`, UAT metadata validation, stale-UAT `land-check` enforcement, review evidence, local Qwen review, escalated-review bootstrap disposition, landing verdict, retrospective, and landing action evidence. `BANDIT-013` delivered the auto-landing eligibility policy artifact, validation path, default init state, shared landing-readiness integration, read-only `bandit auto-land-check <work-item-id>` command, review evidence, landing verdict, retrospective, and landing action evidence. `BANDIT-014` delivered the repo-native Landing Agent contract, validation path, local-record `bandit land <work-item-id> --action local-record` command, review evidence, local Qwen review, escalated-review disposition, landing verdict, landing action evidence, retrospective, and gap-ledger resolution. `BANDIT-015` delivered the fixture-backed live CodeRabbit pre-landing evidence path, fail-closed provider refusal evidence, CodeRabbit landing-gate integration, landing verdict, landing action evidence, retrospective, and gap-ledger disposition.

## Phase Map

| Phase | Name | Outcome | Status |
|---|---|---|---|
| 0 | Foundation | Product intent, architecture, methodology, roadmap, and current-context discipline exist. | Complete |
| 1 | Repo-Native CLI Skeleton | Bandit can initialize, validate, list, show, and record lifecycle events in repo-native state. | Complete |
| 2 | Work Artifacts | Bandit can create PRDs, slices, chores, and retrospective-derived improvement chores. | Complete |
| 3 | Routing And Smell Detection | Codex PM can record manager-owned routing decisions and escalate review from a smell catalog. | Complete |
| 4 | Review And Landing Gates | Bandit can produce pre-landing evidence, CodeRabbit state, Qwen review state, and Landing Verdicts. | Complete |
| 5 | UAT And Auto-Landing | Bandit can record UAT approval, detect stale UAT, and auto-land eligible PRs under policy. | Active |
| 6 | Coordination Primitive | Bandit can expose explicit per-work-item coordination state, actor events, next actions, and safe trigger points. | Not started |
| 7 | Improvement Engine | Bandit can evaluate improvement chores and produce keep/revise/revert/double-down decisions. | Not started |
| 8 | Workflow Cockpit | Bandit has a lean UI for status, next actions, gates, UAT, coordination state, and improvement health. | Not started |
| 9 | Dogfood And Hardening | Bandit uses its own workflow to build and improve itself reliably. | Not started |

## Phase 0: Foundation

Goal: Make sure the project has enough context to begin without drifting.

Completed:

- Fresh repo created.
- Founding PRD drafted.
- Founding architecture drafted.
- V0 plan drafted.
- Bootstrap methodology drafted.
- Metrics and retrospective-derived chore schema drafted.
- Roadmap and current-context checkpoint created.
- First bootstrap work item for Phase 1 created.

Remaining:

- None.

Exit criteria:

- A new Codex session can open `README.md`, this roadmap, and `CURRENT_CONTEXT.md` and know exactly what to do next.

## Phase 1: Repo-Native CLI Skeleton

Goal: Create the smallest CLI and state system that lets Bandit own durable context.

Active work:

- none.

Completed work:

- `BANDIT-001` - Repo-Native State And CLI Skeleton.
- Brief: `docs/work/BANDIT-001/brief.md`.
- Evidence: `docs/work/BANDIT-001/red-evidence.md`, `implementation-evidence.md`, `landing-verdict.md`, and `retrospective.md`.

Expected capabilities:

- `bandit init`
- `.bandit/config.toml`
- `bandit validate`
- `bandit list`
- `bandit show`
- lifecycle event JSONL writer
- work item prefix support
- basic schema validation

Why this comes first:

Bandit cannot improve workflows until it can create and validate durable workflow state.

Exit criteria:

- A repo can be initialized and validated.
- State changes are recorded in repo-native files.
- Bootstrap gaps are explicitly recorded.

Status:

- Complete.

## Phase 2: Work Artifacts

Goal: Make work visible and structured.

Active work:

- none. Phase 2 is complete.

Completed work:

- `BANDIT-002` - Work Artifact Templates And Validation.
- `BANDIT-003` - PRD-To-Work Draft Command.

Expected capabilities:

- Feature PRD template. Complete in `BANDIT-002`.
- Slice template. Complete in `BANDIT-002`.
- Chore template. Complete in `BANDIT-002`.
- Retrospective-derived chore metadata. Complete in `BANDIT-002`.
- PRD-to-work draft command. Complete in `BANDIT-003`.

Exit criteria:

- A PRD can be decomposed into slices and chores.
- Chores can carry origin, hypothesis, metric, baseline, and evaluation window.

Status:

- Complete.

## Phase 3: Routing And Smell Detection

Goal: Let Codex PM manage technical decisions from policy.

Active work:

- none.

Expected capabilities:

- Smell Trigger Catalog.
- Routing decision artifact.
- Escalation policy.
- Command or report explaining why a workflow, model, skill, or reviewer was selected.

Exit criteria:

- Codex PM can make manager-owned routing decisions without asking routine technical questions.

Completed work:

- `BANDIT-004` - Routing Decision And Smell Trigger Catalog.

Status:

- Complete.

## Phase 4: Review And Landing Gates

Goal: Make safe landing evidence-driven.

Active work:

- none. The live CodeRabbit gap is active in the Bootstrap Gap Resolution Lane
  as `BANDIT-015`.

Expected capabilities:

- Pre-landing review loop artifact. Complete in `BANDIT-005`.
- Landing Verdict. Complete in `BANDIT-005`.
- stale review/source-drift checks. Complete in `BANDIT-005`.
- CodeRabbit state capture. Complete in `BANDIT-007` as a repo-native gate substrate; live CodeRabbit polling remains an explicit bootstrap gap.
- Local Qwen adversarial review artifact. Complete in `BANDIT-006` as a repo-native gate substrate; `BANDIT-008` repaired runtime drift and `BANDIT-009` repaired full-packet reliability through direct local oMLX.
- Escalation reviewer placeholder. Complete in `BANDIT-010` as a bootstrap
  placeholder contract; live escalated reviewer routing remains a later gap.

Exit criteria:

- A PR cannot be marked safe-to-land without required evidence.

Completed work:

- `BANDIT-005` - Pre-Landing Review Loop.
- `BANDIT-006` - Local Qwen Baseline Reviewer Gate.
- `BANDIT-007` - CodeRabbit State Capture.
- `BANDIT-008` - Local Reviewer Runtime Drift Repair.
- `BANDIT-009` - Local Qwen Full-Packet Reliability.
- `BANDIT-010` - Escalated Adversarial Reviewer Placeholder.
- `BANDIT-011` - Bootstrap Gap Chore Tracking And Routing.

Active hardening:

- none.

Queued next:

- none.

## Phase 5: UAT And Auto-Landing

Goal: Separate product acceptance from code-safety judgment.

Active work:

- `BANDIT-016` - Stage 4 Evidence-Head Semantics, tracked in the Bootstrap Gap
  Resolution Lane.

Completed work:

- `BANDIT-012` - CLI-Owned UAT Approval Artifact And Stale-UAT Detection.
- `BANDIT-013` - Auto-Landing Eligibility Policy And Check.
- `BANDIT-014` - Landing Agent Bootstrap Gap Resolution.
- `BANDIT-015` - Live CodeRabbit Pre-Landing Loop.

Queued next:

- Local Qwen review and aggregate review evidence for `BANDIT-016`.

Expected capabilities:

- CLI-owned UAT approval artifact. Complete in `BANDIT-012`.
- Stale UAT detection after code changes. Complete in `BANDIT-012`.
- Auto-landing eligibility policy. Complete in `BANDIT-013`.
- Local-record Landing Agent contract and command. Complete in `BANDIT-014`.
- Fixture-backed live CodeRabbit evidence path. Complete in `BANDIT-015`.

Exit criteria:

- Feature slices with green code gates but missing or stale UAT are blocked.
- Eligible chores and UAT-approved feature slices can be auto-landed under policy.

## Bootstrap Gap Resolution Lane

Goal: Convert open bootstrap gaps into durable commands, validators, agent
contracts, explicit operator-blocked items, or no-action decisions before
unrelated new work proceeds.

Current rule:

- This lane is active because `BANDIT-014` has landing action evidence,
  retrospective closeout, updated context, and a resolved
  `BANDIT-GAP-LANDING-AGENT` ledger disposition.
- `BANDIT-GAP-LIVE-CODERABBIT` is resolved by `BANDIT-015`; RED evidence,
  implementation evidence, CodeRabbit evidence, review evidence, and local
  Qwen evidence are recorded. The valid local Qwen `non_blocking` finding is
  repaired in `docs/work/BANDIT-015/qwen-finding-repair.md`; CodeRabbit and
  aggregate review evidence are refreshed at the repair head. The prior local
  Qwen rerun findings are dispositioned in
  `docs/work/BANDIT-015/qwen-rerun-disposition.md`. The current local Qwen
  rerun at PM disposition head `068c4482ba156a158abd92faba2fcee2841f2288`
  returned a `blocker` verdict; its findings are triaged in
  `docs/work/BANDIT-015/qwen-blocker-disposition.md`. The Local Qwen rerun at
  blocker-disposition head `4569c8f92eacf7df098f7f370bd8ac1c09d82b96`
  returned another `blocker` verdict. Codex PM triage is recorded in
  `docs/work/BANDIT-015/qwen-latest-blocker-disposition.md`; the remaining
  blocker was the missing `docs/work/BANDIT-015/escalated-review.md` artifact,
  which is now recorded as the bootstrap-limited escalated-review disposition.
  Local Qwen rerun at escalated-review disposition head
  `16e7ecac0f2d590f9413c8f30d8ed3f554ceb91a` returned another `blocker`
  verdict; Codex PM triaged that blocker in
  `docs/work/BANDIT-015/qwen-evidence-head-disposition.md` and refreshed
  CodeRabbit evidence at source head
  `c584fe3b06692632723aedad2f1f9d69db607602`. Local Qwen rerun at
  evidence-head-disposition head `9248f34b104bc45eed91fb752a49eb0de987e470`
  returned another `blocker` verdict. The operator ended that recursive loop,
  authorized landing now, and required the issue to be queued as
  `BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS`. `BANDIT-015` has landing
  verdict, landing action evidence, retrospective closeout, and resolved
  gap-ledger disposition.
- `BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS` is active as `BANDIT-016`; its
  brief is recorded and RED evidence is next.
- Use `bandit gaps list` and `.bandit/bootstrap-gaps.json` as the routing
  source.
- Create exactly one gap chore at a time.
- Do not create the next gap chore until the previous gap chore has landing
  action evidence, retrospective closeout, and a resolved, operator-blocked, or
  no-action ledger disposition.
- Do not begin Phase 6 Coordination Primitive, Phase 7 Improvement Engine,
  Phase 8 Workflow Cockpit, Phase 9 dogfood, feature work, or unrelated cockpit
  work while any open bootstrap gap remains queued or active.

Current priority after `BANDIT-015` lands:

1. `BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS` - active as `BANDIT-016`; create RED evidence next.
2. `BANDIT-GAP-LIVE-ESCALATED-REVIEWER`.
3. `BANDIT-GAP-WORK-ITEM-CREATE-COMMAND`.
4. `BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND`.
5. `BANDIT-GAP-HEARTBEAT-CHORE-AGENT`.
6. `BANDIT-GAP-WORKFLOW-COCKPIT`.

## Phase 6: Coordination Primitive

Goal: Make workflow progress and agent coordination explicit instead of inferred
from chat or artifact presence.

Expected capabilities:

- Per-work-item append-only coordination log.
- Shared core state machine for slices and chores.
- Typed state extensions for feature UAT and chore-specific disposition.
- Step transition events and actor coordination events in the same work-item log.
- Derived current-state and next-action reports.
- Safe trigger points emitted only from validated step transitions.
- Runtime-agnostic agent coordination actions: claim, handoff, block, complete,
  repair-request, and resume.

Sequencing:

- Do not begin this phase while the active bootstrap-gap lane still has queued
  or active gaps, unless a queued gap directly requires the coordination
  primitive.
- `FOLLOWUPS.md` tracks the post-bootstrap claim requirement and possible
  repo-wide derived transition index questions.

Exit criteria:

- A work item can answer current state, next action, accountable actor, accepted
  block state, and safe trigger points from repo-native coordination state.
- The cockpit and future heartbeat work can read coordination state without
  owning it.
- Cross-repo coordination can rely on self-governing repositories that share the
  same core coordination contracts.

## Phase 7: Improvement Engine

Goal: Prove Bandit's differentiator.

Expected capabilities:

- Retrospective artifact.
- Cross-model tension log.
- Improvement chore ledger.
- Improvement analytics report.
- Evaluation command for due improvement chores.
- Outcomes: `keep`, `revise`, `revert`, `double_down`.

Exit criteria:

- A retrospective lesson becomes a tagged improvement chore.
- That chore can later be evaluated against a metric and outcome.

## Phase 8: Workflow Cockpit

Goal: Give the operator a clear status surface without moving authority out of the CLI.

Expected views:

- Current context.
- Coordination state.
- Safe trigger points.
- PRDs.
- Slices.
- Chores.
- Landing verdicts.
- UAT status.
- Improvement health.
- Next action.

Exit criteria:

- The operator can answer “where are we and what is next?” from the cockpit.
- Cockpit state is derived from repo-native state.

## Phase 9: Dogfood And Hardening

Goal: Use Bandit to improve Bandit.

Expected capabilities:

- Bandit work items use Bandit gates.
- Retrospective-derived chores are evaluated.
- Routing decisions are updated from evidence.
- Bad workflow decisions can be reverted.
- Good workflow decisions can be doubled down.

Exit criteria:

- Bandit has a visible record of improving its own workflow.

## Always-Known Context Rule

At all times, the repo must answer:

- Current phase.
- Current active work item.
- Current next action.
- Current blockers.
- Current bootstrap gaps.
- Last completed milestone.
- What changed since the last checkpoint.

If those answers are unclear, the next task is to repair context before writing code.
