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

**Current phase:** Phase 8 - Workflow Cockpit kickoff.

**Current next step:** Run Stage 4 pre-PR CodeRabbit review for `BANDIT-036` -
Structured Retrospective Mining. `BANDIT-036` has a Stage 1 brief at
`docs/work/BANDIT-036/brief.md`, Stage 2 RED evidence at
`docs/work/BANDIT-036/red-evidence.md`, and Stage 3 implementation evidence at
`docs/work/BANDIT-036/implementation-evidence.md`. It was created from
`docs/specs/BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING.json` and is linked as
the active chore for `BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING` in
`.bandit/bootstrap-gaps.json`. Do not start landing, retrospective closeout,
the next bootstrap-gap chore, or unrelated Phase 8 work until Stage 4
CodeRabbit, Local Qwen, and aggregate review evidence are recorded.

`BANDIT-034` is landed and closed out. Its scoped CodeRabbit provider rerun
passes with no findings, Local Qwen passes with no findings, aggregate Stage 4
review evidence is current, Stage 5 landing verdict and local-record landing
action evidence are recorded, and Stage 6 retrospective closeout evaluates
`BANDIT-033-COCKPIT-SHELL-HARDENING` as `effective` with decision `keep`.

`BANDIT-035` is landed and closed out as the bootstrap-gap chore for
`BANDIT-GAP-ARTIFACT-CREATE-LANDING-WORK-ITEM-FIELD`. Its structured creation
spec is recorded in
`docs/specs/BANDIT-GAP-ARTIFACT-CREATE-LANDING-WORK-ITEM-FIELD.json`, its Stage
1 brief is recorded in `docs/work/BANDIT-035/brief.md`, Stage 2 RED evidence is
recorded in `docs/work/BANDIT-035/red-evidence.md`, Stage 3 implementation
evidence is recorded in `docs/work/BANDIT-035/implementation-evidence.md`, and
`.bandit/bootstrap-gaps.json` marks the gap resolved by `BANDIT-035`.
Stage 4 pre-PR CodeRabbit pass evidence is recorded in
`docs/work/BANDIT-035/coderabbit-review.md` at source head
`cb0a7ba506f6e4d9119a807915408463375c3480` with no findings. CodeRabbit
finding repair/disposition evidence is recorded in
`docs/work/BANDIT-035/coderabbit-finding-disposition.md`. Local Qwen pass
evidence is recorded in `docs/work/BANDIT-035/local-qwen-review.md` at source
head `d432c8d7397292a6d8af09a51e0e08e69eaedc64`. Aggregate Stage 4 review
evidence is recorded in `docs/work/BANDIT-035/review-evidence.md`. Stage 5
landing verdict is recorded in `docs/work/BANDIT-035/landing-verdict.md`,
`npm run bandit -- land-check BANDIT-035` passes, local-record landing action
evidence is recorded in `docs/work/BANDIT-035/landing-action.md`, Stage 6
retrospective closeout is recorded in `docs/work/BANDIT-035/retrospective.md`,
and `.bandit/bootstrap-gaps.json` marks the gap resolved.

`BANDIT-036` is active as the bootstrap-gap chore for
`BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING`. Its structured creation spec is
recorded in
`docs/specs/BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING.json`, its Stage 1 brief
is recorded in `docs/work/BANDIT-036/brief.md`, Stage 2 RED evidence is
recorded in `docs/work/BANDIT-036/red-evidence.md`, Stage 3 implementation
evidence is recorded in `docs/work/BANDIT-036/implementation-evidence.md`,
`.bandit/events.jsonl` records the work-item creation, RED artifact creation,
and implementation-evidence artifact creation events, and
`.bandit/bootstrap-gaps.json` marks the gap `active_chore` linked to
`BANDIT-036`. The next required action is Stage 4 pre-PR CodeRabbit review,
followed by Local Qwen and aggregate Stage 4 review evidence.

`BANDIT-031` - Workflow Cockpit Status Foundation is
landed and closed out: the brief is recorded in `docs/work/BANDIT-031/brief.md`,
RED evidence is recorded in `docs/work/BANDIT-031/red-evidence.md`,
implementation evidence is recorded in
`docs/work/BANDIT-031/implementation-evidence.md`, Stage 4 review evidence is
recorded in `docs/work/BANDIT-031/coderabbit-review.md`,
`docs/work/BANDIT-031/local-qwen-review.md`,
`docs/work/BANDIT-031/qwen-finding-disposition.md`, and
`docs/work/BANDIT-031/review-evidence.md`, Stage 5 landing verdict is recorded
in `docs/work/BANDIT-031/landing-verdict.md`, `land-check` passes,
local-record landing action evidence is recorded in
`docs/work/BANDIT-031/landing-action.md`, and retrospective closeout is recorded
in `docs/work/BANDIT-031/retrospective.md`. Its routed follow-up candidate is
now evaluated through `BANDIT-032`. Phase 8 visual UI direction is recorded in
`docs/prds/BANDIT-PRD-003-attention-first-workflow-cockpit.md` and
`docs/design/workflow-cockpit/design-review.md`; local server/API mode,
state-index persistence, scheduler execution, worktree lifecycle, automatic
merge/push/deploy behavior, product UAT, actor identity policy, claim lease,
work surface reservation, PR/CI workflow, and unrelated feature work remain out
of scope unless a future work item explicitly authorizes them.

`BANDIT-032` - Cockpit Status Coverage Hardening is landed and closed out:
the structured creation spec is recorded in
`docs/specs/BANDIT-032-cockpit-status-coverage-hardening.json`, the brief is
recorded in `docs/work/BANDIT-032/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-032/red-evidence.md`, and the source
`BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING` candidate is linked to
`BANDIT-032` in `docs/work/BANDIT-031/qwen-finding-disposition.md`.
Implementation evidence is recorded in
`docs/work/BANDIT-032/implementation-evidence.md`; the implementation keeps
cockpit status read-only and source-linked while adding blocker summaries,
Stage 0 through Stage 6 gate summaries, same-work-item/stage next-action
agreement, and stale review/landing evidence reporting. CodeRabbit pass
evidence is recorded in `docs/work/BANDIT-032/coderabbit-review.md` at source
head `d7e456be2df6d61c3989a6b9698335026351035a` with 0 findings. Local Qwen
pass evidence is recorded in `docs/work/BANDIT-032/local-qwen-review.md` at
source head `4991a0f8c0885119499fdf42016dc4543dfd3e3e` with no findings. The
aggregate Stage 4 review evidence is recorded in
`docs/work/BANDIT-032/review-evidence.md` with current `review_subject_hash`
`97bb34c9926713b0228c9971a4ef44fd08fe2af722b15fec81ee3c2e22951861`,
CodeRabbit pass evidence, Local Qwen pass evidence, and Codex PM Stage 4
disposition. Stage 5 landing verdict is recorded in
`docs/work/BANDIT-032/landing-verdict.md`, and `npm run bandit -- land-check
BANDIT-032` passes. Local-record landing action evidence is recorded in
`docs/work/BANDIT-032/landing-action.md`. Retrospective closeout and improvement
disposition are recorded in `docs/work/BANDIT-032/retrospective.md`, and the
source `BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING` candidate is evaluated as
`effective` with decision `keep`. The missing design-review blocker for the
next visual UI step is resolved by `docs/design/workflow-cockpit/design-review.md`
and its linked design artifacts. Do not start local server/API mode,
state-index persistence, scheduler execution, worktree lifecycle, automatic
merge/push/deploy behavior, product UAT, actor identity policy, claim lease,
work surface reservation, PR/CI workflow, or unrelated feature work unless a
future work item explicitly scopes that authority.

`BANDIT-033` - Attention-First Cockpit Visual Shell is landed and closed out as
the first Phase 8 visual UI slice. Its structured creation spec is recorded in
`docs/specs/BANDIT-033-attention-first-cockpit-visual-shell.json`, its Stage 1
brief is recorded in `docs/work/BANDIT-033/brief.md`, and its Stage 2 RED
evidence is recorded in `docs/work/BANDIT-033/red-evidence.md` with focused
tests in `test/cockpit-view-model.test.mjs` and `test/cockpit-ui.test.mjs`.
Stage 3 implementation evidence is recorded in
`docs/work/BANDIT-033/implementation-evidence.md`; the implementation adds the
focused view-model, guarded-action, and render-contract modules. Stage 4 review
evidence is recorded in `docs/work/BANDIT-033/coderabbit-review.md`,
`docs/work/BANDIT-033/local-qwen-review.md`,
`docs/work/BANDIT-033/qwen-finding-disposition.md`, and
`docs/work/BANDIT-033/review-evidence.md`. CodeRabbit completed with minor
prototype-source findings dispositioned as no-action, Local Qwen returned a
`non_blocking` verdict, and the remaining hardening candidate is routed as
`BANDIT-033-COCKPIT-SHELL-HARDENING`. Stage 5 landing verdict is recorded in
`docs/work/BANDIT-033/landing-verdict.md` with final verdict `safe-to-land`
and `uat_status: not_applicable` because this slice records a
presentation/render contract, not a browser-clickable operator surface.
`npm run bandit -- land-check BANDIT-033` passes. Local-record landing action
evidence is recorded in `docs/work/BANDIT-033/landing-action.md`. Stage 6
retrospective closeout and improvement disposition are recorded in
`docs/work/BANDIT-033/retrospective.md`; the routed follow-up candidate is
`BANDIT-033-COCKPIT-SHELL-HARDENING`. Local
server/API mode, state-index persistence, scheduler execution, worktree
lifecycle, automatic merge/push/deploy behavior, product UAT, actor identity
policy, claim lease, work surface reservation, PR/CI workflow, and unrelated
feature work remain out of scope unless a future work item explicitly
authorizes them.

`BANDIT-034` - Cockpit Shell Hardening is landed and closed out as the Phase 8
improvement chore for `BANDIT-033-COCKPIT-SHELL-HARDENING`. Its structured
creation spec is recorded in
`docs/specs/BANDIT-034-cockpit-shell-hardening.json`, its Stage 1 brief is
recorded in `docs/work/BANDIT-034/brief.md`, and the source candidate is linked
to `BANDIT-034` in `docs/work/BANDIT-033/qwen-finding-disposition.md`. Stage 2
RED evidence is recorded in `docs/work/BANDIT-034/red-evidence.md`, Stage 3
implementation evidence is recorded in
`docs/work/BANDIT-034/implementation-evidence.md`, Stage 4 CodeRabbit and Local
Qwen pass evidence is recorded in `docs/work/BANDIT-034/coderabbit-review.md`
and `docs/work/BANDIT-034/local-qwen-review.md`, aggregate Stage 4 review
evidence is current in `docs/work/BANDIT-034/review-evidence.md`, Stage 5
landing verdict is recorded in `docs/work/BANDIT-034/landing-verdict.md`,
local-record landing action evidence is recorded in
`docs/work/BANDIT-034/landing-action.md`, and Stage 6 retrospective closeout is
recorded in `docs/work/BANDIT-034/retrospective.md`. The source
`BANDIT-033-COCKPIT-SHELL-HARDENING` candidate is evaluated as `effective` with
decision `keep`. Do not start local server/API mode, state-index persistence,
scheduler execution, worktree lifecycle, automatic merge/push/deploy behavior,
product UAT, actor identity policy, claim lease, work surface reservation,
PR/CI workflow, or unrelated feature work before the current bootstrap-gap queue
is resolved, blocked on operator-owned input, or explicitly dispositioned.

`BANDIT-035` - Artifact Create Landing Work Item Field is landed and closed out as the
bootstrap-gap chore for `BANDIT-GAP-ARTIFACT-CREATE-LANDING-WORK-ITEM-FIELD`.
Its structured creation spec is recorded in
`docs/specs/BANDIT-GAP-ARTIFACT-CREATE-LANDING-WORK-ITEM-FIELD.json`, its Stage
1 brief is recorded in `docs/work/BANDIT-035/brief.md`, Stage 2 RED evidence is
recorded in `docs/work/BANDIT-035/red-evidence.md`, Stage 3 implementation
evidence is recorded in `docs/work/BANDIT-035/implementation-evidence.md`, and
`.bandit/bootstrap-gaps.json` marks the gap resolved by `BANDIT-035`.
Stage 4 pre-PR CodeRabbit pass evidence is recorded in
`docs/work/BANDIT-035/coderabbit-review.md` at source head
`cb0a7ba506f6e4d9119a807915408463375c3480` with no findings. CodeRabbit
finding repair/disposition evidence is recorded in
`docs/work/BANDIT-035/coderabbit-finding-disposition.md`. Local Qwen pass
evidence is recorded in `docs/work/BANDIT-035/local-qwen-review.md` at source
head `d432c8d7397292a6d8af09a51e0e08e69eaedc64`. Aggregate Stage 4 review
evidence is recorded in `docs/work/BANDIT-035/review-evidence.md`. Stage 5
landing verdict is recorded in `docs/work/BANDIT-035/landing-verdict.md`,
`npm run bandit -- land-check BANDIT-035` passes, local-record landing action
evidence is recorded in `docs/work/BANDIT-035/landing-action.md`, Stage 6
retrospective closeout is recorded in `docs/work/BANDIT-035/retrospective.md`,
and `.bandit/bootstrap-gaps.json` marks the gap resolved.

`BANDIT-036` - Structured Retrospective Mining is active as the
bootstrap-gap chore for `BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING`. Its
structured creation spec is recorded in
`docs/specs/BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING.json`, its Stage 1 brief
is recorded in `docs/work/BANDIT-036/brief.md`, Stage 2 RED evidence is
recorded in `docs/work/BANDIT-036/red-evidence.md`, Stage 3 implementation
evidence is recorded in `docs/work/BANDIT-036/implementation-evidence.md`,
`.bandit/events.jsonl` records the work-item creation, RED artifact creation,
and implementation-evidence artifact creation events, and
`.bandit/bootstrap-gaps.json` marks the gap `active_chore` linked to
`BANDIT-036`. The next required action is Stage 4 pre-PR CodeRabbit review,
followed by Local Qwen and aggregate Stage 4 review evidence; do not start
landing, the next bootstrap-gap chore, or unrelated Phase 8 work first.

`BANDIT-025` is closed out as the first Phase 6 Coordination Primitive slice.
`BANDIT-026` is landed and closed out for typed state extensions. Its structured creation
spec is recorded in
`docs/specs/BANDIT-026-typed-state-extensions.json`, its brief is recorded in
`docs/work/BANDIT-026/brief.md`, and its per-work-item coordination log is
recorded in `docs/work/BANDIT-026/coordination-log.jsonl` at `closed`.
RED evidence, implementation evidence, Local Qwen Stage 4 pass evidence,
aggregate Stage 4 review evidence with current `review_subject_hash`, Stage 5
landing verdict, local-record landing action, and retrospective closeout are
recorded in `docs/work/BANDIT-026/`.

`BANDIT-027` is landed and closed out as the bootstrap-gap improvement chore for
`BANDIT-GAP-CODERABBIT-PRE-PR-CLI-REVIEW`. Its structured creation spec is
recorded in
`docs/specs/BANDIT-GAP-CODERABBIT-PRE-PR-CLI-REVIEW.json`, its brief is
recorded in `docs/work/BANDIT-027/brief.md`, and its coordination log is
recorded in `docs/work/BANDIT-027/coordination-log.jsonl` at `closed`.
RED evidence is recorded in `docs/work/BANDIT-027/red-evidence.md`, with
focused tests in `test/coderabbit-state.test.mjs` proving the current CLI has
no pre-PR local-diff CodeRabbit review path. Implementation evidence is
recorded in `docs/work/BANDIT-027/implementation-evidence.md`; the implemented
path adds `bandit coderabbit-review pre-pr <ID> --base <revision> --fixture
<path>`, records fixture-backed `coderabbit review --agent` evidence, fails
closed for missing CLI/auth, provider timeout, malformed output, stale source,
and actionable findings, and preserves the existing PR-backed
`coderabbit-review live` path. Pre-PR CodeRabbit evidence is recorded in
`docs/work/BANDIT-027/coderabbit-review.md` with provider
`coderabbit-agent-pre-pr`, review target `local-diff:origin/main`, source head
`e4b2c0010832fb49d26889a8694beb471645a402`, verdict `pass`, and no findings.
Local Qwen evidence is recorded in
`docs/work/BANDIT-027/local-qwen-review.md` with source head
`9bee51b8bf5978b8dee98bf1a829cc449f3d2686`, reviewer verdict `pass`, and no
findings. Aggregate Stage 4 review evidence is recorded in
`docs/work/BANDIT-027/review-evidence.md` with current `review_subject_hash`
`a06a265a7319fd5f6b39440c201e0fd4a87dfa1c3fb578abdcc138efb10c7d7a`,
CodeRabbit pre-PR pass evidence, Local Qwen pass evidence, Codex PM Stage 4
disposition, and no open bootstrap gaps. Stage 5 landing verdict is recorded
in `docs/work/BANDIT-027/landing-verdict.md` with final verdict
`safe-to-land`. Local-record landing action evidence is recorded in
`docs/work/BANDIT-027/landing-action.md`, chore-disposition evidence is
recorded in `docs/work/BANDIT-027/chore-disposition.md`, retrospective
closeout is recorded in `docs/work/BANDIT-027/retrospective.md`, and
`.bandit/bootstrap-gaps.json` marks the gap resolved.

`BANDIT-028` is landed and closed out as the final Phase 6 Coordination
Primitive slice. Its
structured creation spec is recorded in
`docs/specs/BANDIT-028-agent-coordination-event-commands.json`, its brief is
recorded in `docs/work/BANDIT-028/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-028/red-evidence.md`, implementation evidence is recorded in
`docs/work/BANDIT-028/implementation-evidence.md`, and its coordination log is
recorded in `docs/work/BANDIT-028/coordination-log.jsonl` at
`closed`. The implemented command surface appends
runtime-agnostic actor coordination events for claim, handoff, block, complete,
repair-request, and resume without turning actor events into workflow-state
authority. Stage 4 review evidence is recorded in
`docs/work/BANDIT-028/review-evidence.md` with pre-PR CodeRabbit, Local Qwen,
and aggregate review evidence at current `review_subject_hash`. Stage 5 landing
verdict is recorded in `docs/work/BANDIT-028/landing-verdict.md` with final
verdict `safe-to-land`; local-record landing action evidence is recorded in
`docs/work/BANDIT-028/landing-action.md`, retrospective closeout is recorded in
`docs/work/BANDIT-028/retrospective.md`, and the accepted Local Qwen
non-blocking actor identity validation concern is durably routed in
`docs/work/BANDIT-028/qwen-finding-disposition.md`.

`BANDIT-029` is landed and closed out as the first Phase 7 Improvement Engine
slice. Its structured
creation spec is recorded in
`docs/specs/BANDIT-029-improvement-evaluation-foundation.json`, and its brief
is recorded in `docs/work/BANDIT-029/brief.md`. RED evidence is recorded in
`docs/work/BANDIT-029/red-evidence.md`, with focused tests in
`test/improvements.test.mjs`. Implementation evidence is recorded in
`docs/work/BANDIT-029/implementation-evidence.md`; the implemented command
surface adds read-only improvement candidate discovery and single-candidate
evaluation evidence validation. Stage 4 review evidence is recorded in
`docs/work/BANDIT-029/coderabbit-review.md`,
`docs/work/BANDIT-029/local-qwen-review.md`,
`docs/work/BANDIT-029/qwen-finding-disposition.md`, and
`docs/work/BANDIT-029/review-evidence.md` with current review subject hash
`588217e3f8df9bef06076ceec28815cb41ccc9dcb35ff80e5d7635af897f876c`.
CodeRabbit completed with findings 0, Local Qwen returned a `non_blocking`
verdict, and Codex PM accepted/routed the non-blocking hardening findings.
Stage 5 landing verdict is recorded in
`docs/work/BANDIT-029/landing-verdict.md` with final verdict `safe-to-land`,
and `npm run bandit -- land-check BANDIT-029` passes. Local-record landing
action evidence is recorded in `docs/work/BANDIT-029/landing-action.md`.
Retrospective and improvement disposition are recorded in
`docs/work/BANDIT-029/retrospective.md`.

`BANDIT-030` is landed and closed out as the Phase 7 improvement evaluation work
item for the now-due `BANDIT-023` non-blocking review-finding routing outcome.
Its
structured creation spec is recorded in
`docs/specs/BANDIT-030-nonblocking-review-routing-evaluation.json`, and its
brief is recorded in `docs/work/BANDIT-030/brief.md`. Stage 2
RED/evaluation-design evidence is recorded in
`docs/specs/BANDIT-030-red-evidence.json` and
`docs/work/BANDIT-030/red-evidence.md`. Stage 3 implementation evidence is
recorded in `docs/specs/BANDIT-030-implementation-evidence.json` and
`docs/work/BANDIT-030/implementation-evidence.md`. Stage 7 evaluation evidence
is recorded in `docs/work/BANDIT-030/improvement-evaluation.md` with result
`effective` and decision `keep`. Stage 4 review evidence is recorded in
`docs/work/BANDIT-030/coderabbit-review.md`,
`docs/work/BANDIT-030/local-qwen-review.md`, and
`docs/work/BANDIT-030/review-evidence.md` with current review subject hash
`de76b40fe2344fe697ccfe92f0f8daa050eb12997bd2a1f7f3d09758d3712e45`.
CodeRabbit pass evidence is recorded with its remaining minor EOF-newline
finding dispositioned as resolved/no-action, and Local Qwen passed with no
findings. Stage 5 landing verdict is recorded in
`docs/work/BANDIT-030/landing-verdict.md` with final verdict `safe-to-land`,
and `npm run bandit -- land-check BANDIT-030` passes. Local-record landing
action evidence is recorded in `docs/work/BANDIT-030/landing-action.md`.
Retrospective closeout is recorded in `docs/work/BANDIT-030/retrospective.md`,
and the evaluated `BANDIT-023` retrospective metadata now records
`status: evaluated` and `outcome: keep`.

`BANDIT-031` is landed and closed out as the first Phase 8 Workflow Cockpit
slice. Its structured creation spec is recorded in
`docs/specs/BANDIT-031-workflow-cockpit-status-foundation.json`, its Stage
1 brief is recorded in `docs/work/BANDIT-031/brief.md`, and Stage 2 RED
evidence is recorded in `docs/work/BANDIT-031/red-evidence.md` with focused
tests in `test/cockpit-status.test.mjs`. Stage 3 implementation evidence is
recorded in `docs/work/BANDIT-031/implementation-evidence.md`; the
implementation adds `bandit cockpit status --json` as a CLI-authoritative,
read-only cockpit status foundation that derives status from repo-native
artifacts, exposes source paths, fails closed for missing or contradictory
evidence, and creates no hidden canonical state. Stage 4 review evidence is
recorded in `docs/work/BANDIT-031/coderabbit-review.md`,
`docs/work/BANDIT-031/local-qwen-review.md`,
`docs/work/BANDIT-031/qwen-finding-disposition.md`, and
`docs/work/BANDIT-031/review-evidence.md`; CodeRabbit passed after the focused
dynamic improvement-candidate source repair, and Local Qwen non-blocking
findings are durably routed as
`BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING`. Stage 5 landing verdict is
recorded in `docs/work/BANDIT-031/landing-verdict.md` with final verdict
`safe-to-land`, `npm run bandit -- land-check BANDIT-031` passes, and
local-record landing action evidence is recorded in
`docs/work/BANDIT-031/landing-action.md`. Retrospective closeout and
improvement disposition are recorded in
`docs/work/BANDIT-031/retrospective.md`. The routed
`BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING` follow-up is evaluated through
`BANDIT-032`, which is landed and closed out. `BANDIT-033` is landed and
closed out as the first Phase 8 visual UI slice with Stage 2 RED evidence,
Stage 3 implementation evidence, Stage 4 review evidence, Stage 5
landing-action evidence, and Stage 6 retrospective/improvement disposition
recorded. `BANDIT-034` is landed and closed out as the
`BANDIT-033-COCKPIT-SHELL-HARDENING` improvement chore, with Stage 1 through
Stage 6 evidence recorded in `docs/work/BANDIT-034/` and source-candidate
evaluation recorded in `docs/work/BANDIT-033/qwen-finding-disposition.md`,
`docs/work/BANDIT-033/retrospective.md`, and
`docs/work/BANDIT-034/retrospective.md`. `BANDIT-035` is landed and closed out
for `BANDIT-GAP-ARTIFACT-CREATE-LANDING-WORK-ITEM-FIELD`. The next required
action is to create the bootstrap-gap chore for
`BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING`.
`BANDIT-GAP-WORKFLOW-TRIAL-DECISION-GUARDRAILS` is queued behind structured
retrospective mining and requires predeclared decision criteria, uncertainty or
minimum-detectable-effect context, proxy-risk disposition, and re-evaluation
windows before Workflow Trial outcomes can change policy.
`BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT` is queued behind workflow-trial decision
guardrails and requires owner, version, changelog, intended stages, required
tools, forbidden actions, evaluation packets, and rollback criteria for
load-bearing skills. `BANDIT-GAP-AGENT-EVALUATION-HARNESS` is constrained to a benchmark-only
offline/replay harness with fixed Qwen, Claude or paid-reviewer, skill,
reviewer-profile, and component packets, repo-derived failure-mode
stratification before generic coding tasks, visible calibration packets,
versioned locked holdout packets for policy promotion, gold-labeled reviewer
packets with seeded blockers and seeded non-issues, blocker-recall-first
scoring, precision, useful-yield, false-positive, tool-friction, latency, and
provider-pricing-backed expected-cost metrics, pricing freshness or expiry,
spend-class approval, scoped paid reviewer promotion thresholds per risk class
or stage capability profile, and no automatic live-routing or policy mutation.
Provider Pricing Evidence for paid reviewer routes must name pricing source,
captured date, effective date, freshness or expiry rule, expected per-run cost,
spend class, and approval owner. One-off paid reviewer calls before threshold
promotion are benchmark/evaluation spend requiring per-run approval or active
spend-class approval, and cannot count as recurring reviewer routing policy.
`BANDIT-GAP-INPUT-QUARANTINE-GATE` requires external contributor text, issue or
PR metadata, review comments, dependency documentation, fetched third-party
content, generated instructions, and fetched prompts to remain data-only unless
a trusted-source gate upgrades them for a bounded release-authorized purpose.
`BANDIT-GAP-WORKFLOW-TRIAL-DECISION-GUARDRAILS` requires Workflow Trial and
workflow-policy changes to carry predeclared criteria, uncertainty or
minimum-detectable-effect context, proxy-risk disposition, and re-evaluation
windows before keep/revise/revert/double_down decisions can become policy.
`BANDIT-GAP-LAYERED-RISK-CLASSIFICATION` requires auto-landing and review-depth
decisions to use hard never-auto-landable exclusions, blast-radius signals,
static-analysis signals, source trust and input-quarantine state, supply-chain
state, and smell-trigger inputs rather than smell-list-only safety.
`BANDIT-GAP-INPUT-QUARANTINE-GATE`,
`BANDIT-GAP-LAYERED-RISK-CLASSIFICATION`,
`BANDIT-GAP-SUPPLY-CHAIN-GATE`,
`BANDIT-GAP-COORDINATION-EVENT-LOG-AUTHORITY`,
`BANDIT-GAP-OPERATOR-FAIL-CLOSED-BOUNDARY`,
`BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY`,
`BANDIT-GAP-GIT-MUTATION-SERIALIZER`,
`BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT`,
`BANDIT-GAP-EVENT-DRIVEN-WAKE-SCHEDULER`,
`BANDIT-GAP-AGENT-OBSERVABILITY-TRACES`,
`BANDIT-GAP-STAGE-CAPABILITY-SCOPE`,
`BANDIT-GAP-TOKEN-COST-FAILSAFE`, and
`BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS` are queued behind the skill lifecycle
lane in that order.
`BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY` is constrained by the accepted
2026-05-27 Git refs backend decision: the first Claim Authority Primitive uses
`refs/bandit/*` and `git update-ref --stdin` compare-and-swap transactions, and
`.bandit` claim files remain projections rather than writable claim authority.
State-changing claim operations and external side effects under claims also
require the current fencing token and an idempotency key. Work-surface
claimability must detect wait-for graph cycles, not just pairwise overlap.
Claim, release, reconcile, worktree-lock, and claim-gated side-effect
correctness must be backed by declared Claim Safety Invariants plus
deterministic fault-injecting or property-style simulation; example-only
duplicate-claim tests do not satisfy the gate.
`BANDIT-GAP-GIT-MUTATION-SERIALIZER` is constrained by the accepted
2026-05-27 Git mutation serializer decision: shared `.git` worktree and
repository plumbing mutations require a CLI-owned single-writer guard, while
claim CAS remains separate authority. Claim-owned worktrees must be
`git worktree lock`ed immediately with a stable reason naming claim ID, Work
Item ID, and stage, and unlocked only by Repo PM Coordinator cleanup after
handoff verification.
`BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` is constrained by the 2026-05-27
technical delegation decision: Codex PM owns routine technical questions, and a
Bandit-created worktree is not runnable until a repo-native Worktree Bootstrap
Contract validates allowed copied or linked files, setup commands, validation
command, environment references, secret-handling boundary, runtime dependencies,
and failure evidence. Secret material is not copied by default; any exception
requires existing operator-supervised policy authorization.
`BANDIT-GAP-OPERATOR-FAIL-CLOSED-BOUNDARY` reserves operator-blocking
fail-closed behavior for safety, product, UAT, policy, business, cost,
irreversible-risk, and genuinely ambiguous scope gates, while routing derivable
operational drift to CLI-owned mechanical repair.
Do not create unrelated
active-work branches, local server/API mode, state-index persistence, scheduler
execution, worktree lifecycle, exclusive claim leases, work surface
reservations, product UAT approval, automatic merge/push/deploy behavior, actor
identity policy, PR/CI workflow, or unrelated feature work before the next work
item explicitly scopes that authority.

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
disposition. `BANDIT-025` is landed and closed out with its Phase 6
Coordination Primitive brief, RED evidence, implementation evidence, Local Qwen
review, PM finding disposition, aggregate review evidence, landing verdict,
local-record landing action evidence, retrospective closeout, and terminal
coordination-log state recorded. `BANDIT-026` is landed and closed out with
typed-state-extensions spec, brief, RED evidence, focused tests,
implementation evidence, Local Qwen Stage 4 pass evidence, aggregate Stage 4
review evidence, Stage 5 landing verdict, landing action, retrospective, and
terminal coordination-log state recorded. `BANDIT-GAP-CODERABBIT-PRE-PR-CLI-REVIEW`
is resolved by `BANDIT-027`; implementation evidence, pre-PR CodeRabbit Stage
4 pass evidence, Local Qwen Stage 4 pass evidence, aggregate Stage 4 review
evidence with current `review_subject_hash`, Stage 5 landing verdict,
local-record landing action evidence, chore-disposition evidence,
retrospective closeout, and gap-ledger disposition are recorded.
`BANDIT-028` has its Phase 6 agent coordination event command spec, brief,
Stage 2 RED evidence, Stage 3 implementation evidence, and Stage 4 aggregate
review evidence recorded. Pre-PR CodeRabbit evidence is recorded in
`docs/work/BANDIT-028/coderabbit-review.md` with
verdict `pass` and no findings after the focused repair recorded in
`docs/work/BANDIT-028/coderabbit-finding-repair.md`. Local Qwen Stage 4
evidence is recorded in `docs/work/BANDIT-028/local-qwen-review.md` with
`reviewer_verdict: non_blocking`, one open finding about actor and evidence
reference validation, and no required operator input. Codex PM disposition and
durable routing for the Local Qwen finding is recorded in
`docs/work/BANDIT-028/qwen-finding-disposition.md`. Aggregate review evidence
is recorded in `docs/work/BANDIT-028/review-evidence.md` with current
`review_subject_hash`
`ca580771b305a102cac661b4049766587c0729cf4fe7352a113c66ed881a4627`. Stage 5
landing verdict is recorded in `docs/work/BANDIT-028/landing-verdict.md` with
final verdict `safe-to-land`. Local-record landing action evidence is recorded
in `docs/work/BANDIT-028/landing-action.md`; retrospective closeout is recorded
in `docs/work/BANDIT-028/retrospective.md`; and the coordination log is closed.
`BANDIT-029` is landed and closed out with its Phase 7 Improvement Engine
structured spec, Stage 1 brief,
Stage 2 RED evidence, Stage 3 implementation evidence, and Stage 4 review
evidence recorded in
`docs/specs/BANDIT-029-improvement-evaluation-foundation.json` and
`docs/work/BANDIT-029/`. Stage 5 landing verdict and landing readiness
verification are recorded. Local-record landing action evidence and Stage 6
retrospective/improvement disposition are recorded. `BANDIT-030` has a
structured spec, Stage 1 brief, Stage 2 RED/evaluation-design evidence, Stage 3
implementation evidence, Stage 7 improvement-evaluation evidence for
`BANDIT-023` improvement outcome evaluation, Stage 4 review evidence, and
Stage 5 landing verdict/readiness evidence, and local-record landing action
evidence. Retrospective closeout is recorded, and the `BANDIT-023`
improvement metadata is updated to `outcome: keep`. `BANDIT-031` is landed and
closed out as the first Phase 8 Workflow Cockpit slice. `BANDIT-032` is landed
and closed out as the cockpit status coverage hardening improvement chore. The
operator-provided attention-first cockpit direction and design review are now
recorded. `BANDIT-033` is landed and closed out as the first Phase 8 Workflow
Cockpit visual UI slice with Stage 2 RED evidence, Stage 3 implementation
evidence, Stage 4 review evidence, Stage 5 landing verdict/readiness evidence,
local-record landing action evidence, and Stage 6 retrospective/improvement
disposition recorded. `BANDIT-034` has been created as the
`BANDIT-033-COCKPIT-SHELL-HARDENING` improvement chore work item and is active
at Stage 4 with scoped CodeRabbit pass evidence and Local Qwen pass evidence
recorded; aggregate Stage 4 review evidence still needs a current
review-subject hash and PM disposition.

## Phase Map

| Phase | Name | Outcome | Status |
|---|---|---|---|
| 0 | Foundation | Product intent, architecture, methodology, roadmap, and current-context discipline exist. | Complete |
| 1 | Repo-Native CLI Skeleton | Bandit can initialize, validate, list, show, and record lifecycle events in repo-native state. | Complete |
| 2 | Work Artifacts | Bandit can create PRDs, slices, chores, and retrospective-derived improvement chores. | Complete |
| 3 | Routing And Smell Detection | Codex PM can record manager-owned routing decisions and escalate review from a smell catalog. | Complete |
| 4 | Review And Landing Gates | Bandit can produce pre-landing evidence, CodeRabbit state, Qwen review state, and Landing Verdicts. | Complete |
| 5 | UAT And Auto-Landing | Bandit can record UAT approval, detect stale UAT, and auto-land eligible PRs under policy. | Complete |
| 6 | Coordination Primitive | Bandit can expose explicit per-work-item coordination state, actor events, next actions, and safe trigger points. | Complete |
| 7 | Improvement Engine | Bandit can evaluate improvement chores and produce keep/revise/revert/double-down decisions. | Complete |
| 8 | Workflow Cockpit | Bandit has a lean UI for status, next actions, gates, UAT, coordination state, and improvement health. | Next |
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
- Chores can carry origin, hypothesis, metric, baseline, decision criteria,
  uncertainty or minimum-detectable-effect context, evaluation window, and
  re-evaluation window.

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

- none.

Expected capabilities:

- Pre-landing review loop artifact. Complete in `BANDIT-005`.
- Landing Verdict. Complete in `BANDIT-005`.
- stale review/source-drift checks. Complete in `BANDIT-005`.
- CodeRabbit state capture. Complete in `BANDIT-007` as a repo-native gate
  substrate; `BANDIT-015` added the PR-context live evidence path, and
  `BANDIT-027` added the missing pre-PR CLI review path.
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
- `BANDIT-024` - Workflow Cockpit Boundary Scope.

Active work:

- none.

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
- `BANDIT-GAP-CODERABBIT-PRE-PR-CLI-REVIEW` is resolved by `BANDIT-027`; the
  brief, RED evidence, implementation evidence, pre-PR CodeRabbit Stage 4 pass
  evidence, Local Qwen Stage 4 pass evidence, and aggregate Stage 4 review
  evidence are recorded. Stage 5 landing verdict, local-record landing action,
  chore-disposition evidence, retrospective, and gap-ledger disposition are
  recorded.
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

1. Run Stage 4 pre-PR CodeRabbit review for `BANDIT-036` - Structured
   Retrospective Mining, now that Stage 3 implementation evidence exists and
   `BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING` is active. After CodeRabbit is
   resolved or honestly blocked, run Local Qwen and aggregate Stage 4 review
   evidence before landing, the next bootstrap-gap chore, or unrelated Phase 8
   work.
2. Keep local server/API mode, state-index persistence, scheduler execution,
   worktree lifecycle, automatic merge/push/deploy behavior, product UAT,
   actor identity policy, claim leases, work surface reservations, PR/CI
   workflow, and unrelated feature work out of scope unless explicitly
   authorized by a future work item.
3. Keep unrelated Phase 8 work blocked while any open bootstrap gap remains
   queued or active. `BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING` is active in
   `BANDIT-036`, and `BANDIT-GAP-WORKFLOW-TRIAL-DECISION-GUARDRAILS` is queued
   behind structured retrospective mining. `BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT` is queued behind
   the workflow-trial decision guardrails. `BANDIT-GAP-AGENT-EVALUATION-HARNESS`
   is queued behind the skill lifecycle contract. `BANDIT-GAP-INPUT-QUARANTINE-GATE` is queued
   behind the agent evaluation harness. `BANDIT-GAP-LAYERED-RISK-CLASSIFICATION`
   is queued behind the input quarantine gate. `BANDIT-GAP-SUPPLY-CHAIN-GATE` is
   queued behind the layered risk-classification gap. `BANDIT-GAP-COORDINATION-EVENT-LOG-AUTHORITY`
   is queued behind the supply-chain gate. `BANDIT-GAP-OPERATOR-FAIL-CLOSED-BOUNDARY`
   is queued behind the coordination event-log authority gap.
   `BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY` is queued behind the
   operator fail-closed boundary gap and must use the accepted Git refs claim
   authority backend.
   `BANDIT-GAP-GIT-MUTATION-SERIALIZER` is queued behind CAS/fenced claim
   authority.
   `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` is queued behind Git mutation
   serialization.
   `BANDIT-GAP-EVENT-DRIVEN-WAKE-SCHEDULER` is queued behind the worktree
   bootstrap contract.
   `BANDIT-GAP-AGENT-OBSERVABILITY-TRACES` is queued behind the event-driven
   wake scheduler gap. `BANDIT-GAP-STAGE-CAPABILITY-SCOPE` is queued behind
   agent observability traces. `BANDIT-GAP-TOKEN-COST-FAILSAFE` is queued
   behind stage capability scope. `BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS` is
   queued behind token-cost failsafe.

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
- Workflow Trial guardrails: predeclared decision criteria, uncertainty or
  minimum-detectable-effect context, proxy-risk disposition, and re-evaluation
  windows.
- Outcomes: `keep`, `revise`, `revert`, `double_down`.

Exit criteria:

- A retrospective lesson becomes a tagged improvement chore.
- That chore can later be evaluated against a metric, baseline, predeclared
  criteria, uncertainty context, re-evaluation window, and outcome.

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
