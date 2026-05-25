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

**Current phase:** Phase 6 - Coordination Primitive.

**Current next step:** Create the first Phase 6 Coordination Primitive work
item brief. Do not create RED evidence, implementation code, active-work
branches, Phase 7 improvement engine work, Phase 8 web cockpit implementation,
product UAT approval, automatic merge/push/deploy behavior, or unrelated
feature work until the Phase 6 brief is recorded and accepted through the
normal Bandit stage gates.
`BANDIT-023` - Non-Blocking Review Finding Chore Routing is
closed out:
RED evidence is recorded in
`docs/work/BANDIT-023/red-evidence.md`, implementation evidence is recorded in
`docs/work/BANDIT-023/implementation-evidence.md`, Local Qwen Stage 4 pass
evidence is recorded in `docs/work/BANDIT-023/local-qwen-review.md`, aggregate
Stage 4 review evidence with current `review_subject_hash` is recorded in
`docs/work/BANDIT-023/review-evidence.md`, and Stage 5 landing verdict is
recorded in `docs/work/BANDIT-023/landing-verdict.md`. Local-record landing
action evidence is recorded in `docs/work/BANDIT-023/landing-action.md`,
retrospective closeout is recorded in
`docs/work/BANDIT-023/retrospective.md`, and `.bandit/bootstrap-gaps.json`
marks the gap resolved. The
operator explicitly reprioritized the `BANDIT-022` non-blocking Local Qwen
hardening findings ahead of `BANDIT-GAP-WORKFLOW-COCKPIT` on 2026-05-25. All
future Stage 4 review evidence should use `review_subject_hash`.

`BANDIT-016` landed for `BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS`. It added
the Stage 4 evidence-head policy, structured PM disposition rationale,
shallow/partial changed-path diagnostics, and typed policy patterns. Local Qwen
accepted implementation behavior but continued surfacing non-blocking
future-hardening findings. The operator ended that loop, authorized landing
now, and required the remaining findings to become the next chore.

`BANDIT-017` resolved
`BANDIT-GAP-LANDING-GATE-COMPLEXITY-HARDENING`. Its brief is recorded in
`docs/work/BANDIT-017/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-017/red-evidence.md`, implementation evidence is recorded in
`docs/work/BANDIT-017/implementation-evidence.md`, review evidence is recorded
in `docs/work/BANDIT-017/review-evidence.md`, landing verdict is recorded in
`docs/work/BANDIT-017/landing-verdict.md`, local-record landing action is
recorded in `docs/work/BANDIT-017/landing-action.md`, and retrospective plus
gap-ledger closeout are recorded in `docs/work/BANDIT-017/retrospective.md`.
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
`BANDIT-016` and `BANDIT-017` have landing verdicts, landing actions,
retrospectives, gap-ledger dispositions, and updated context. `BANDIT-018`
resolved `BANDIT-GAP-LIVE-ESCALATED-REVIEWER`; its brief is recorded in
`docs/work/BANDIT-018/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-018/red-evidence.md`, implementation evidence is recorded in
`docs/work/BANDIT-018/implementation-evidence.md`, reviewer routing evidence is
recorded in `docs/work/BANDIT-018/routing-decision.md`, Local Qwen evidence is
recorded in `docs/work/BANDIT-018/local-qwen-review.md`, and escalated reviewer
evidence is recorded in `docs/work/BANDIT-018/escalated-review.md`.
Side-by-side Qwen 3.6 / Sonnet 4.6 / Opus 4.7 comparison evidence is recorded
in `docs/work/BANDIT-018/model-comparison.md`, and aggregate review evidence is
recorded in `docs/work/BANDIT-018/review-evidence.md`. AC10 repair evidence is
recorded in `docs/work/BANDIT-018/ac10-repair-evidence.md`. Repair-head Stage
4 review refresh evidence is recorded in
`docs/work/BANDIT-018/local-qwen-review.md`,
`docs/work/BANDIT-018/model-comparison.md`, and
`docs/work/BANDIT-018/review-evidence.md`. Landing verdict, landing action,
retrospective, and gap-ledger disposition are recorded for `BANDIT-018`.
`BANDIT-GAP-REVIEW-SUBJECT-HASH-FRESHNESS` is resolved by `BANDIT-019`; future
work uses hash-based evidence freshness when review evidence records
`review_subject_hash`.
`BANDIT-GAP-WORK-ITEM-CREATE-COMMAND` is resolved by `BANDIT-020`; its brief is
recorded in `docs/work/BANDIT-020/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-020/red-evidence.md`, implementation evidence is recorded in
`docs/work/BANDIT-020/implementation-evidence.md`, Local Qwen pass evidence is
recorded in `docs/work/BANDIT-020/local-qwen-review.md`, Stage 4 review
evidence with current `review_subject_hash` is recorded in
`docs/work/BANDIT-020/review-evidence.md`, Stage 5 landing verdict is recorded
in `docs/work/BANDIT-020/landing-verdict.md`, local-record landing action is
recorded in `docs/work/BANDIT-020/landing-action.md`, and retrospective plus
gap-ledger disposition are recorded. Open bootstrap gaps remain the work queue
and must be addressed one at a time before unrelated new work proceeds.
`BANDIT-021` resolved `BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND`; its
structured creation spec is recorded in
`docs/specs/BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND.json`, its brief is
recorded in `docs/work/BANDIT-021/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-021/red-evidence.md`, implementation evidence is recorded in
`docs/work/BANDIT-021/implementation-evidence.md`, Local Qwen pass evidence is
recorded in `docs/work/BANDIT-021/local-qwen-review.md`, Stage 4 review
evidence is recorded in `docs/work/BANDIT-021/review-evidence.md`, landing
verdict and landing action are recorded, retrospective closeout is recorded,
and `.bandit/bootstrap-gaps.json` marks the gap resolved.
`BANDIT-022` resolved `BANDIT-GAP-HEARTBEAT-CHORE-AGENT`; its structured
creation spec is recorded in
`docs/specs/BANDIT-GAP-HEARTBEAT-CHORE-AGENT.json`, its brief is recorded in
`docs/work/BANDIT-022/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-022/red-evidence.md`, implementation evidence is recorded in
`docs/work/BANDIT-022/implementation-evidence.md`, Local Qwen Stage 4 evidence
is recorded in `docs/work/BANDIT-022/local-qwen-review.md`, aggregate Stage 4
review evidence is recorded in `docs/work/BANDIT-022/review-evidence.md`,
landing verdict and local-record landing action are recorded, retrospective
closeout is recorded, follow-up hardening chore candidates are recorded in
`docs/work/BANDIT-022/follow-up-chores.md`, and `.bandit/bootstrap-gaps.json`
marks the gap resolved.
`BANDIT-023` resolved
`BANDIT-GAP-NONBLOCKING-REVIEW-FINDING-ROUTING`; its structured creation spec
is recorded in
`docs/specs/BANDIT-GAP-NONBLOCKING-REVIEW-FINDING-ROUTING.json`, its brief is
recorded in `docs/work/BANDIT-023/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-023/red-evidence.md`, implementation evidence is recorded in
`docs/work/BANDIT-023/implementation-evidence.md`, Local Qwen Stage 4 pass
evidence is recorded in `docs/work/BANDIT-023/local-qwen-review.md`, aggregate
Stage 4 review evidence is recorded in
`docs/work/BANDIT-023/review-evidence.md`, Stage 5 landing verdict is recorded
in `docs/work/BANDIT-023/landing-verdict.md`, local-record landing action
evidence is recorded in `docs/work/BANDIT-023/landing-action.md`,
retrospective closeout is recorded in
`docs/work/BANDIT-023/retrospective.md`, and `.bandit/bootstrap-gaps.json`
marks the gap resolved and linked to `BANDIT-023`.
This chore exists to make
non-blocking review findings durable without recursively delaying landing when
required gates accept the implementation.
`BANDIT-024` resolved `BANDIT-GAP-WORKFLOW-COCKPIT`. Its structured
creation spec is recorded in
`docs/specs/BANDIT-GAP-WORKFLOW-COCKPIT.json`, its brief is recorded in
`docs/work/BANDIT-024/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-024/red-evidence.md`, the durable cockpit boundary contract
is recorded in `docs/design/workflow-cockpit-boundary.md`, implementation
evidence is recorded in `docs/work/BANDIT-024/implementation-evidence.md`,
Local Qwen Stage 4 pass evidence is recorded in
`docs/work/BANDIT-024/local-qwen-review.md`, aggregate Stage 4 review evidence
with current `review_subject_hash` is recorded in
`docs/work/BANDIT-024/review-evidence.md`, Stage 5 landing verdict is recorded
in `docs/work/BANDIT-024/landing-verdict.md`, local-record landing action
evidence is recorded in `docs/work/BANDIT-024/landing-action.md`,
retrospective closeout is recorded in
`docs/work/BANDIT-024/retrospective.md`, and `.bandit/bootstrap-gaps.json`
marks the gap resolved.

**Current implementation status:** `BANDIT-001` through `BANDIT-020` are
landed and closed out. `BANDIT-021` is landed and closed out. `BANDIT-022` is
landed and closed out. `BANDIT-023` is landed and closed out. `BANDIT-024` has
local-record landing action evidence, retrospective closeout, and gap-ledger
disposition. No bootstrap gap is currently recorded as open or active.

## Phase Map

| Phase | Name | Outcome | Status |
|---|---|---|---|
| 0 | Foundation | Product intent, architecture, methodology, roadmap, and current-context discipline exist. | Complete |
| 1 | Repo-Native CLI Skeleton | Bandit can initialize, validate, list, show, and record lifecycle events in repo-native state. | Complete |
| 2 | Work Artifacts | Bandit can create PRDs, slices, chores, and retrospective-derived improvement chores. | Complete |
| 3 | Routing And Smell Detection | Codex PM can record manager-owned routing decisions and escalate review from a smell catalog. | Complete |
| 4 | Review And Landing Gates | Bandit can produce pre-landing evidence, CodeRabbit state, Qwen review state, and Landing Verdicts. | Complete |
| 5 | UAT And Auto-Landing | Bandit can record UAT approval, detect stale UAT, and auto-land eligible PRs under policy. | Complete |
| 6 | Coordination Primitive | Bandit can expose explicit per-work-item coordination state, actor events, next actions, and safe trigger points. | Active |
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

- none.

Completed work:

- `BANDIT-012` - CLI-Owned UAT Approval Artifact And Stale-UAT Detection.
- `BANDIT-013` - Auto-Landing Eligibility Policy And Check.
- `BANDIT-014` - Landing Agent Bootstrap Gap Resolution.
- `BANDIT-015` - Live CodeRabbit Pre-Landing Loop.
- `BANDIT-016` - Stage 4 Evidence-Head Semantics.
- `BANDIT-017` - Landing Gate Complexity And Git Diagnostics Hardening.
- `BANDIT-018` - Live Escalated Reviewer Routing.
- `BANDIT-019` - Review Subject Hash Evidence Freshness.
- `BANDIT-020` - Work Item Create Command.
- `BANDIT-021` - General Artifact Create Command.
- `BANDIT-022` - Heartbeat Chore Agent Contract.
- `BANDIT-023` - Non-Blocking Review Finding Chore Routing.

Active work:

- `BANDIT-024` - Workflow Cockpit Boundary Scope.

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
- `BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS` is resolved by `BANDIT-016`.
- `BANDIT-GAP-LANDING-GATE-COMPLEXITY-HARDENING` is resolved by `BANDIT-017`;
  RED evidence, implementation evidence, review evidence, landing verdict,
  local-record landing action, retrospective, and gap-ledger closeout are
  recorded.
- `BANDIT-GAP-LIVE-ESCALATED-REVIEWER` is resolved by `BANDIT-018`; the brief is
  recorded in `docs/work/BANDIT-018/brief.md`, RED evidence is recorded in
  `docs/work/BANDIT-018/red-evidence.md`, implementation evidence is recorded
  in `docs/work/BANDIT-018/implementation-evidence.md`, side-by-side reviewer
  comparison evidence is recorded in
  `docs/work/BANDIT-018/model-comparison.md`, aggregate review evidence is
  recorded in `docs/work/BANDIT-018/review-evidence.md`, AC10 repair evidence
  is recorded in `docs/work/BANDIT-018/ac10-repair-evidence.md`, and
  repair-head Stage 4 review refresh evidence is recorded. Focused repair / PM
  disposition for the remaining non-blocking Stage 4 findings is recorded in
  `docs/work/BANDIT-018/stage4-finding-disposition.md`. Focused repair-head
  Stage 4 review evidence is refreshed at
  `e80ddbe635bd68e8cdbf04d7a2dca8aff719a0c5`. Landing verdict, landing action,
  retrospective, and gap-ledger disposition are recorded.
- `BANDIT-GAP-REVIEW-SUBJECT-HASH-FRESHNESS` is resolved by `BANDIT-019`;
  review-subject hash evidence freshness is now the required Stage 4 method for
  future work items.
- `BANDIT-GAP-WORK-ITEM-CREATE-COMMAND` is resolved by `BANDIT-020`; its brief,
  RED evidence, implementation evidence, Stage 4 review evidence with
  `review_subject_hash`, Stage 5 landing verdict, local-record landing action,
  retrospective, and gap-ledger disposition are recorded.
- `BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND` is resolved by `BANDIT-021`;
  landing verdict, landing action, retrospective, and gap-ledger disposition
  are recorded.
- `BANDIT-GAP-HEARTBEAT-CHORE-AGENT` is resolved by `BANDIT-022`; landing
  verdict, landing action, retrospective, follow-up hardening chore
  candidates, and gap-ledger disposition are recorded.
- `BANDIT-GAP-NONBLOCKING-REVIEW-FINDING-ROUTING` is resolved by
  `BANDIT-023`; landing verdict, landing action, retrospective, and
  gap-ledger disposition are recorded.
- `BANDIT-GAP-WORKFLOW-COCKPIT` is resolved by `BANDIT-024`; landing verdict,
  landing action, retrospective, workflow-cockpit boundary artifact, and
  gap-ledger disposition are recorded.
- Use `bandit gaps list` and `.bandit/bootstrap-gaps.json` as the routing
  source.
- Create exactly one gap chore at a time.
- Do not create the next gap chore until the previous gap chore has landing
  action evidence, retrospective closeout, and a resolved, operator-blocked, or
  no-action ledger disposition.
- Do not begin Phase 6 Coordination Primitive, Phase 7 Improvement Engine,
  Phase 8 Workflow Cockpit, Phase 9 dogfood, feature work, or unrelated cockpit
  work while any open bootstrap gap remains queued or active.

Current priority:

1. Create the first Phase 6 Coordination Primitive work item brief.
2. Stop at the brief; do not create RED evidence, implementation code, or an
   active-work branch until the brief is recorded and accepted through the
   normal Bandit stage gates.

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
