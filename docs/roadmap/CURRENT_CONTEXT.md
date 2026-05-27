# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff.

**State:** `BANDIT-016` landed as the bootstrap-gap chore for
`BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS`. Its landing verdict, local-record
landing action, retrospective, and gap-ledger disposition are recorded in
`docs/work/BANDIT-016/`. The operator ended the repeated Local Qwen
future-hardening loop, directed Codex PM to land `BANDIT-016` now, and required
the remaining Local Qwen findings to become the next chore.

`BANDIT-017` resolved `BANDIT-GAP-LANDING-GATE-COMPLEXITY-HARDENING`. Its
brief, RED evidence, implementation evidence, review evidence, landing verdict,
local-record landing action, retrospective, and gap-ledger disposition are
recorded in `docs/work/BANDIT-017/` and `.bandit/bootstrap-gaps.json`.

`BANDIT-018` resolved `BANDIT-GAP-LIVE-ESCALATED-REVIEWER`. Its brief is recorded in
`docs/work/BANDIT-018/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-018/red-evidence.md`, implementation evidence is recorded in
`docs/work/BANDIT-018/implementation-evidence.md`, reviewer routing evidence is
recorded in `docs/work/BANDIT-018/routing-decision.md`, Local Qwen evidence is
recorded in `docs/work/BANDIT-018/local-qwen-review.md`, escalated reviewer
evidence is recorded in `docs/work/BANDIT-018/escalated-review.md`,
side-by-side Qwen 3.6 / Sonnet 4.6 / Opus 4.7 comparison evidence is recorded
in `docs/work/BANDIT-018/model-comparison.md`, aggregate review evidence is
recorded in `docs/work/BANDIT-018/review-evidence.md`, focused repair / PM
disposition evidence for the repair-head non-blocking Stage 4 findings is
recorded in `docs/work/BANDIT-018/stage4-finding-disposition.md`, and focused
repair-head Qwen 3.6 / Opus 4.7 refresh evidence is recorded in
`docs/work/BANDIT-018/local-qwen-review.md`,
`docs/work/BANDIT-018/model-comparison.md`, and
`docs/work/BANDIT-018/review-evidence.md`. Landing verdict, local-record
landing action, retrospective, and gap-ledger disposition are recorded in
`docs/work/BANDIT-018/` and `.bandit/bootstrap-gaps.json`.

`BANDIT-019` resolved `BANDIT-GAP-REVIEW-SUBJECT-HASH-FRESHNESS`. Its brief,
RED evidence, implementation evidence, Local Qwen pass evidence, review
evidence with `review_subject_hash`, landing verdict, local-record landing
action, retrospective, and gap-ledger disposition are recorded in
`docs/work/BANDIT-019/` and `.bandit/bootstrap-gaps.json`. Future Stage 4
review evidence should record `review_subject_hash`; raw `source_head` remains
audit metadata and historical fallback, not the primary freshness identity when
a hash is present.

`BANDIT-020` resolved `BANDIT-GAP-WORK-ITEM-CREATE-COMMAND`. Its brief is
recorded in `docs/work/BANDIT-020/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-020/red-evidence.md`, implementation evidence is recorded in
`docs/work/BANDIT-020/implementation-evidence.md`, Local Qwen pass evidence is
recorded in `docs/work/BANDIT-020/local-qwen-review.md`, Stage 4 review
evidence with current `review_subject_hash` is recorded in
`docs/work/BANDIT-020/review-evidence.md`, Stage 5 landing verdict is recorded
in `docs/work/BANDIT-020/landing-verdict.md`, local-record landing action is
recorded in `docs/work/BANDIT-020/landing-action.md`, retrospective closeout is
recorded in `docs/work/BANDIT-020/retrospective.md`, and
`.bandit/bootstrap-gaps.json` marks the gap resolved.

`BANDIT-021` resolved
`BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND`. Its structured creation spec is
recorded in
`docs/specs/BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND.json`, its brief is
recorded in `docs/work/BANDIT-021/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-021/red-evidence.md`, implementation evidence is recorded in
`docs/work/BANDIT-021/implementation-evidence.md`, Local Qwen pass evidence is
recorded in `docs/work/BANDIT-021/local-qwen-review.md`, Stage 4 review
evidence with current `review_subject_hash` is recorded in
`docs/work/BANDIT-021/review-evidence.md`, Stage 5 landing verdict is recorded
in `docs/work/BANDIT-021/landing-verdict.md`, local-record landing action is
recorded in `docs/work/BANDIT-021/landing-action.md`, retrospective closeout is
recorded in `docs/work/BANDIT-021/retrospective.md`, and
`.bandit/bootstrap-gaps.json` marks the gap resolved.

`BANDIT-022` resolved `BANDIT-GAP-HEARTBEAT-CHORE-AGENT`. Its structured
creation spec is recorded in
`docs/specs/BANDIT-GAP-HEARTBEAT-CHORE-AGENT.json`, its brief is recorded in
`docs/work/BANDIT-022/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-022/red-evidence.md`, implementation evidence is recorded in
`docs/work/BANDIT-022/implementation-evidence.md`, Local Qwen Stage 4 evidence
is recorded in `docs/work/BANDIT-022/local-qwen-review.md`, aggregate Stage 4
review evidence with current `review_subject_hash` is recorded in
`docs/work/BANDIT-022/review-evidence.md`, Stage 5 landing verdict is recorded
in `docs/work/BANDIT-022/landing-verdict.md`, local-record landing action is
recorded in `docs/work/BANDIT-022/landing-action.md`, retrospective closeout is
recorded in `docs/work/BANDIT-022/retrospective.md`, follow-up hardening chore
candidates are recorded in `docs/work/BANDIT-022/follow-up-chores.md`, and
`.bandit/bootstrap-gaps.json` marks the gap resolved.

The operator reprioritized the `BANDIT-022` non-blocking Local Qwen hardening
findings ahead of the workflow-cockpit gap on 2026-05-25. `BANDIT-023`
resolved the bootstrap-gap improvement chore for
`BANDIT-GAP-NONBLOCKING-REVIEW-FINDING-ROUTING`. Its structured creation spec
is recorded in
`docs/specs/BANDIT-GAP-NONBLOCKING-REVIEW-FINDING-ROUTING.json`, its brief is
recorded in `docs/work/BANDIT-023/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-023/red-evidence.md`, implementation evidence is recorded in
`docs/work/BANDIT-023/implementation-evidence.md`, Local Qwen Stage 4 pass
evidence is recorded in `docs/work/BANDIT-023/local-qwen-review.md`, the RED
artifact input is recorded in `docs/specs/BANDIT-023-red-evidence.json`,
aggregate Stage 4 review evidence with current `review_subject_hash` is
recorded in `docs/work/BANDIT-023/review-evidence.md`, Stage 5 landing verdict
is recorded in `docs/work/BANDIT-023/landing-verdict.md`, local-record landing
action evidence is recorded in `docs/work/BANDIT-023/landing-action.md`,
retrospective closeout is recorded in
`docs/work/BANDIT-023/retrospective.md`, and `.bandit/bootstrap-gaps.json`
marks the gap resolved. This chore captures the policy that non-blocking
review findings should be routed to durable chores or explicit no-action
decisions instead of recursively delaying landing after required gates accept
the implementation.

`BANDIT-024` resolved `BANDIT-GAP-WORKFLOW-COCKPIT`. Its structured
creation spec is recorded in
`docs/specs/BANDIT-GAP-WORKFLOW-COCKPIT.json`, its brief is recorded in
`docs/work/BANDIT-024/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-024/red-evidence.md`, the workflow-cockpit boundary artifact
is recorded in `docs/design/workflow-cockpit-boundary.md`, implementation
evidence is recorded in `docs/work/BANDIT-024/implementation-evidence.md`,
Local Qwen Stage 4 pass evidence is recorded in
`docs/work/BANDIT-024/local-qwen-review.md`, aggregate Stage 4 review
evidence with current `review_subject_hash` is recorded in
`docs/work/BANDIT-024/review-evidence.md`, Stage 5 landing verdict is recorded
in `docs/work/BANDIT-024/landing-verdict.md`, local-record landing action
evidence is recorded in `docs/work/BANDIT-024/landing-action.md`,
retrospective closeout is recorded in
`docs/work/BANDIT-024/retrospective.md`, and `.bandit/bootstrap-gaps.json`
marks the gap resolved. The chore scoped the CLI-authoritative cockpit boundary
from existing repo artifacts before any Phase 8 web cockpit implementation
begins.

`BANDIT-025` is the first Phase 6 Coordination Primitive slice. Its structured
creation spec is recorded in
`docs/specs/BANDIT-025-coordination-log-foundation.json`, and its brief is
recorded in `docs/work/BANDIT-025/brief.md`. RED evidence is recorded in
`docs/work/BANDIT-025/red-evidence.md`, with focused tests in
`test/coordination-log.test.mjs` and `test/coordination-status.test.mjs`.
Implementation evidence is recorded in
`docs/work/BANDIT-025/implementation-evidence.md`. The implemented slice adds
the per-work-item append-only coordination log foundation, shared core state
sequence, actor-event non-authority boundary, fail-closed validation, and a
read-only derived `bandit coordination validate/status` report.
Local Qwen Stage 4 evidence is recorded in
`docs/work/BANDIT-025/local-qwen-review.md` at source head
`46455616e3c579ebbd05f92f8d87f80053de55bb` with a `non_blocking` verdict and
three open hardening findings. Codex PM disposition and durable routing for
those findings is recorded in
`docs/work/BANDIT-025/qwen-finding-disposition.md`. Aggregate Stage 4 review
evidence is recorded in `docs/work/BANDIT-025/review-evidence.md` with current
`review_subject_hash`
`747e4bbb35589b08fb042b46f911fd43f50597594c894e0a5fa9916c5704f16b`,
CodeRabbit bootstrap replacement evidence, Local Qwen `non_blocking` state,
PM disposition, and durable `non_blocking_findings_routing` entries.
Stage 5 landing verdict is recorded in
`docs/work/BANDIT-025/landing-verdict.md` with final verdict `safe-to-land`.
Local-record landing action evidence is recorded in
`docs/work/BANDIT-025/landing-action.md`. Retrospective closeout is recorded in
`docs/work/BANDIT-025/retrospective.md`, and the per-work-item coordination log
is advanced through `retrospective_recorded` to `closed`.

`BANDIT-026` is landed and closed out as the Phase 6 Coordination Primitive
slice for typed state extensions. Its structured creation spec is recorded in
`docs/specs/BANDIT-026-typed-state-extensions.json`, its brief is recorded in
`docs/work/BANDIT-026/brief.md`, and its per-work-item coordination log is
recorded in `docs/work/BANDIT-026/coordination-log.jsonl` at `closed`. RED
evidence is recorded in `docs/work/BANDIT-026/red-evidence.md`, with focused tests in
`test/coordination-log.test.mjs` and `test/coordination-status.test.mjs`.
Implementation evidence is recorded in
`docs/work/BANDIT-026/implementation-evidence.md`. The implemented slice
adds typed extension checkpoints for feature UAT and chore disposition while
preserving the shared core coordination state machine and actor-event
non-authority boundary. Local Qwen Stage 4 evidence is recorded in
`docs/work/BANDIT-026/local-qwen-review.md` with `reviewer_verdict: pass` at
source head `985d149e7105969bc775b39c9488f9b5ba7122b9`. Aggregate Stage 4
review evidence is recorded in `docs/work/BANDIT-026/review-evidence.md` with
current `review_subject_hash`
`967ffc2c61bffa0dcf4b7ef1d843dc827769c17055576178c94adde4359612f4`, honest
CodeRabbit bootstrap replacement status, Local Qwen pass evidence, and Codex PM
Stage 4 disposition. No branch, product UAT approval, claim lease, scheduler,
worktree lifecycle, Phase 7 Improvement Engine work, or Phase 8 Workflow
Cockpit implementation has started. Stage 5 landing verdict is recorded in
`docs/work/BANDIT-026/landing-verdict.md` with final verdict `safe-to-land`.
Local-record landing action evidence is recorded in
`docs/work/BANDIT-026/landing-action.md`, retrospective closeout is recorded in
`docs/work/BANDIT-026/retrospective.md`, and the coordination log is advanced
through `retrospective_recorded` to `closed`.

`BANDIT-027` is landed and closed out as the bootstrap-gap improvement chore for
`BANDIT-GAP-CODERABBIT-PRE-PR-CLI-REVIEW`. Its structured creation spec is
recorded in
`docs/specs/BANDIT-GAP-CODERABBIT-PRE-PR-CLI-REVIEW.json`, its brief is
recorded in `docs/work/BANDIT-027/brief.md`, and its per-work-item
coordination log is recorded in `docs/work/BANDIT-027/coordination-log.jsonl`
at `closed`. RED evidence is recorded in
`docs/work/BANDIT-027/red-evidence.md`, with focused tests in
`test/coderabbit-state.test.mjs`. The tests define the missing pre-PR
CodeRabbit command surface, deterministic fixture-backed provider behavior,
missing CLI/auth refusal paths, timeout refusal, actionable finding refusal,
info-only non-blocking disposition, stale-source refusal, and preservation of
the existing PR-backed `coderabbit-review live` path. The chore exists to
repair the CodeRabbit pre-landing loop so Stage 4 can run
`coderabbit review --agent` against local diffs before PR creation, record real
CodeRabbit evidence, and avoid treating no PR as an automatic bootstrap gap
when pre-PR CLI review should be available. Implementation evidence is recorded
in `docs/work/BANDIT-027/implementation-evidence.md`; the implementation adds
the fixture-backed `bandit coderabbit-review pre-pr <ID> --base <revision>
--fixture <path>` path, fail-closed pre-PR refusal evidence, and preserves the
existing PR-backed `coderabbit-review live` path. Pre-PR CodeRabbit Stage 4
evidence is recorded in `docs/work/BANDIT-027/coderabbit-review.md` with
provider `coderabbit-agent-pre-pr`, review target `local-diff:origin/main`,
source head `e4b2c0010832fb49d26889a8694beb471645a402`, verdict `pass`, and
no findings. Local Qwen Stage 4 evidence is recorded in
`docs/work/BANDIT-027/local-qwen-review.md` with source head
`9bee51b8bf5978b8dee98bf1a829cc449f3d2686`, reviewer verdict `pass`, and no
findings. Aggregate Stage 4 review evidence is recorded in
`docs/work/BANDIT-027/review-evidence.md` with current
`review_subject_hash`
`a06a265a7319fd5f6b39440c201e0fd4a87dfa1c3fb578abdcc138efb10c7d7a`,
CodeRabbit pre-PR pass evidence, Local Qwen pass evidence, Codex PM Stage 4
disposition, and no open bootstrap gaps. Stage 5 landing verdict is recorded
in `docs/work/BANDIT-027/landing-verdict.md` with final verdict
`safe-to-land`. Local-record landing action evidence is recorded in
`docs/work/BANDIT-027/landing-action.md`, chore-disposition evidence is
recorded in `docs/work/BANDIT-027/chore-disposition.md`, retrospective
closeout is recorded in `docs/work/BANDIT-027/retrospective.md`, and
`.bandit/bootstrap-gaps.json` marks
`BANDIT-GAP-CODERABBIT-PRE-PR-CLI-REVIEW` resolved.

`BANDIT-028` is landed and closed out as the Phase 6 Coordination Primitive
slice for agent coordination event commands. Its structured creation spec is
recorded in
`docs/specs/BANDIT-028-agent-coordination-event-commands.json`, its brief is
recorded in `docs/work/BANDIT-028/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-028/red-evidence.md`, implementation evidence is recorded in
`docs/work/BANDIT-028/implementation-evidence.md`, pre-PR CodeRabbit Stage 4
evidence is recorded in `docs/work/BANDIT-028/coderabbit-review.md`, Local
Qwen Stage 4 evidence and PM disposition are recorded in
`docs/work/BANDIT-028/local-qwen-review.md` and
`docs/work/BANDIT-028/qwen-finding-disposition.md`, aggregate Stage 4 review
evidence is recorded in `docs/work/BANDIT-028/review-evidence.md`, Stage 5
landing verdict is recorded in `docs/work/BANDIT-028/landing-verdict.md`,
local-record landing action evidence is recorded in
`docs/work/BANDIT-028/landing-action.md`, retrospective closeout is recorded in
`docs/work/BANDIT-028/retrospective.md`, and its per-work-item coordination log
is advanced through `retrospective_recorded` to `closed`. The implemented
slice adds a CLI-owned way to append runtime-agnostic actor events for claim,
handoff, block, complete, repair-request, and resume while preserving the rule
that actor events do not advance workflow state, emit safe triggers, or satisfy
landing/review/UAT gates without accepted step transitions. The accepted Local
Qwen non-blocking actor identity validation concern is durably routed as
`BANDIT-028-ACTOR-IDENTITY-VALIDATION` in
`docs/work/BANDIT-028/qwen-finding-disposition.md`; it is a queued candidate
for the next actor identity policy, coordination validation, claim lease, or
work surface reservation slice, not an active work item.

`BANDIT-029` is landed and closed out as the first Phase 7 Improvement Engine
slice. Its structured
creation spec is recorded in
`docs/specs/BANDIT-029-improvement-evaluation-foundation.json`, and its brief
is recorded in `docs/work/BANDIT-029/brief.md`. RED evidence is recorded in
`docs/work/BANDIT-029/red-evidence.md`, with focused tests in
`test/improvements.test.mjs`. Implementation evidence is recorded in
`docs/work/BANDIT-029/implementation-evidence.md`; the implemented command
surface adds read-only improvement candidate discovery and single-candidate
evaluation evidence validation while preserving repo-native artifacts as
canonical state. Stage 4 review evidence is recorded in
`docs/work/BANDIT-029/coderabbit-review.md`,
`docs/work/BANDIT-029/local-qwen-review.md`,
`docs/work/BANDIT-029/qwen-finding-disposition.md`, and
`docs/work/BANDIT-029/review-evidence.md` with current review subject hash
`588217e3f8df9bef06076ceec28815cb41ccc9dcb35ff80e5d7635af897f876c`.
CodeRabbit completed with findings 0, Local Qwen returned a `non_blocking`
verdict, and Codex PM accepted/routed the non-blocking hardening findings.
Stage 5 landing verdict is recorded in
`docs/work/BANDIT-029/landing-verdict.md` with final verdict `safe-to-land`;
`npm run bandit -- land-check BANDIT-029` passes at current head
`bbcfa90c91a8c92588835e410be17f1935601c11`. Local-record landing action
evidence is recorded in `docs/work/BANDIT-029/landing-action.md`.
Retrospective and improvement disposition are recorded in
`docs/work/BANDIT-029/retrospective.md`. The slice is scoped to the
smallest repo-native improvement evaluation foundation
from existing retrospective-derived improvement metadata. It must not start
Phase 8 Workflow Cockpit implementation, scheduler execution, worktree
lifecycle, exclusive claim leases, work surface reservations, automatic
merge/push/deploy behavior, product UAT approval, actor identity policy, or
unrelated coordination work.

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
`docs/work/BANDIT-030/implementation-evidence.md`. The Stage 7 improvement
evaluation is recorded in `docs/work/BANDIT-030/improvement-evaluation.md` with
result `effective` and decision `keep` for the `BANDIT-023` routing policy.
Stage 4 review evidence is recorded in
`docs/work/BANDIT-030/coderabbit-review.md`,
`docs/work/BANDIT-030/local-qwen-review.md`, and
`docs/work/BANDIT-030/review-evidence.md` with current review subject hash
`de76b40fe2344fe697ccfe92f0f8daa050eb12997bd2a1f7f3d09758d3712e45`.
CodeRabbit pass evidence is recorded with the only remaining minor finding
dispositioned as resolved/no-action after `git diff --check` and EOF-newline
inspection; Local Qwen passed with no findings. Stage 5 landing verdict is
recorded in `docs/work/BANDIT-030/landing-verdict.md` with final verdict
`safe-to-land`, and `npm run bandit -- land-check BANDIT-030` passes.
Local-record landing action evidence is recorded in
`docs/work/BANDIT-030/landing-action.md`.
Retrospective closeout is recorded in
`docs/work/BANDIT-030/retrospective.md`, and the evaluated `BANDIT-023`
retrospective metadata now records `status: evaluated` and `outcome: keep`.
The work item evaluates the `BANDIT-023` hypothesis against Stage 4 outcomes
from `BANDIT-025`, `BANDIT-028`, and `BANDIT-029` before Phase 8 cockpit,
scheduler, worktree lifecycle, automatic merge/push/deploy, product UAT, actor
identity policy, claim lease, work surface reservation, or unrelated work
starts.

`BANDIT-031` is landed and closed out as the first Phase 8 Workflow Cockpit
slice for a read-only Workflow Cockpit Status Foundation. Its structured creation spec is
recorded in
`docs/specs/BANDIT-031-workflow-cockpit-status-foundation.json`, its Stage
1 brief is recorded in `docs/work/BANDIT-031/brief.md`, and Stage 2 RED
evidence is recorded in `docs/work/BANDIT-031/red-evidence.md` with focused
tests in `test/cockpit-status.test.mjs`. Stage 3 implementation evidence is
recorded in `docs/work/BANDIT-031/implementation-evidence.md`. The implemented
slice adds `bandit cockpit status --json` and a CLI-authoritative, derived
cockpit status payload that reads repo-native artifacts, exposes source paths,
fails closed for missing or contradictory evidence, and creates no hidden
canonical cockpit state. Stage 4 review evidence is recorded in
`docs/work/BANDIT-031/coderabbit-review.md`,
`docs/work/BANDIT-031/local-qwen-review.md`,
`docs/work/BANDIT-031/qwen-finding-disposition.md`, and
`docs/work/BANDIT-031/review-evidence.md` with current review subject hash
`a8d0ef01630c34f8c30d3f007c0a46e812edaa11cffe2d48a29a220687de03d2`.
CodeRabbit passed after the focused dynamic improvement-candidate source repair.
Local Qwen returned a `non_blocking` verdict; Codex PM accepted the remaining
blocker-summary, gate-summary, next-action heuristic, and stale-marker findings
as safe to defer and routed them to
`BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING` in
`docs/work/BANDIT-031/qwen-finding-disposition.md`. Stage 5 landing verdict is
recorded in `docs/work/BANDIT-031/landing-verdict.md` with final verdict
`safe-to-land`; `npm run bandit -- land-check BANDIT-031` passes. Local-record
landing action evidence is recorded in
`docs/work/BANDIT-031/landing-action.md`. Retrospective closeout and improvement
disposition are recorded in `docs/work/BANDIT-031/retrospective.md`; the routed
follow-up candidate is
`BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING`. No visual UI, server/API mode,
state-index persistence, scheduler execution, worktree lifecycle, claim leases,
work surface reservations, automatic merge/push/deploy, product UAT approval,
actor identity policy, PR/CI workflow, or unrelated work has started.

`BANDIT-032` is landed and closed out as the Phase 8 improvement chore for
Cockpit Status Coverage Hardening. Its structured creation spec is recorded in
`docs/specs/BANDIT-032-cockpit-status-coverage-hardening.json`, and its Stage 1
brief is recorded in `docs/work/BANDIT-032/brief.md`. The source
`BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING` candidate is linked to
`BANDIT-032` in `docs/work/BANDIT-031/qwen-finding-disposition.md`. Stage 2
RED evidence is recorded in `docs/work/BANDIT-032/red-evidence.md`, with
focused failing tests in `test/cockpit-status.test.mjs` for blocker breadth,
Stage 0 through Stage 6 gate breadth, next-action agreement hardening, and
stale-evidence reporting. Stage 3 implementation evidence is recorded in
`docs/work/BANDIT-032/implementation-evidence.md`; the implementation keeps
cockpit status read-only and source-linked while adding blocker summaries,
Stage 0 through Stage 6 gate summaries, same-work-item/stage next-action
agreement, and stale review/landing evidence reporting. Stage 4 CodeRabbit
pre-PR pass evidence is recorded in `docs/work/BANDIT-032/coderabbit-review.md`
at source head `d7e456be2df6d61c3989a6b9698335026351035a` with 0 findings.
Local Qwen Stage 4 pass evidence is recorded in
`docs/work/BANDIT-032/local-qwen-review.md` at source head
`4991a0f8c0885119499fdf42016dc4543dfd3e3e` with no findings. Aggregate
Stage 4 review evidence is recorded in
`docs/work/BANDIT-032/review-evidence.md` with current `review_subject_hash`
`97bb34c9926713b0228c9971a4ef44fd08fe2af722b15fec81ee3c2e22951861`,
CodeRabbit pass evidence, Local Qwen pass evidence, Codex PM Stage 4
disposition, and no open bootstrap gaps. Stage 5 landing verdict is recorded in
`docs/work/BANDIT-032/landing-verdict.md`, and `npm run bandit -- land-check
BANDIT-032` passes. Local-record landing action evidence is recorded in
`docs/work/BANDIT-032/landing-action.md`. Retrospective closeout and improvement
disposition are recorded in `docs/work/BANDIT-032/retrospective.md`; the source
`BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING` candidate is evaluated as
`effective` with decision `keep`.

**Last completed milestone:** `BANDIT-033` retrospective closeout and
improvement disposition are recorded. The Phase 8 attention-first cockpit PRD
and design review are recorded as the accepted visual UI starting point.
`BANDIT-033` was created as the next Phase 8 visual UI slice; its
structured spec is recorded in
`docs/specs/BANDIT-033-attention-first-cockpit-visual-shell.json`, its Stage 1
brief is recorded in `docs/work/BANDIT-033/brief.md`, and its Stage 2 RED
evidence is recorded in `docs/work/BANDIT-033/red-evidence.md` with focused
tests in `test/cockpit-view-model.test.mjs` and `test/cockpit-ui.test.mjs`.
Stage 3 implementation evidence is recorded in
`docs/work/BANDIT-033/implementation-evidence.md`; the implementation adds the
focused attention-first view-model, guarded action, and render-contract modules
without adding local server/API mode, state-index persistence, scheduler,
worktree, claim, work surface, deploy, UAT approval, actor identity, PR/CI, or
unrelated feature behavior. Stage 4 review evidence is recorded in
`docs/work/BANDIT-033/coderabbit-review.md`,
`docs/work/BANDIT-033/local-qwen-review.md`,
`docs/work/BANDIT-033/qwen-finding-disposition.md`, and
`docs/work/BANDIT-033/review-evidence.md`; CodeRabbit completed with minor
prototype-source findings dispositioned as no-action, Local Qwen returned a
`non_blocking` verdict, and the remaining cockpit-shell hardening candidate is
routed as `BANDIT-033-COCKPIT-SHELL-HARDENING`. Stage 5 landing verdict is
recorded in `docs/work/BANDIT-033/landing-verdict.md` with final verdict
`safe-to-land` and `uat_status: not_applicable`; this slice records a
presentation/render contract, not a browser-clickable operator surface, so
browser UAT is deferred to the future slice that serves an actual cockpit page.
`npm run bandit -- land-check BANDIT-033` passes with `UAT: not_applicable`.
Local-record landing action evidence is recorded in
`docs/work/BANDIT-033/landing-action.md`. Stage 6 retrospective closeout and
improvement disposition are recorded in
`docs/work/BANDIT-033/retrospective.md`; the routed follow-up candidate is
`BANDIT-033-COCKPIT-SHELL-HARDENING`.

**Current next action:** Run Stage 4 review gates for `BANDIT-038` - Skill
Lifecycle Contract. `BANDIT-038` was created as the bootstrap-gap chore for
`BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT`: the structured creation spec is recorded
in `docs/specs/BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT.json`, the Stage 1 brief is
recorded in `docs/work/BANDIT-038/brief.md`, Stage 2 RED evidence is recorded
in `docs/work/BANDIT-038/red-evidence.md`, Stage 3 implementation evidence is
recorded in `docs/work/BANDIT-038/implementation-evidence.md`,
`.bandit/events.jsonl` records the work-item and artifact creation events, and
`.bandit/bootstrap-gaps.json` marks the gap active and linked to `BANDIT-038`.
Do not create landing evidence, retrospective evidence, the next bootstrap-gap
chore, or unrelated Phase 8 work before Stage 4 review evidence exists.

`BANDIT-036` - Structured Retrospective Mining is landed and closed out: Stage
1 brief, Stage 2 RED evidence, Stage 3 implementation evidence, Stage 4 pre-PR
CodeRabbit pass evidence, Stage 4 Local Qwen pass evidence, aggregate Stage 4
review evidence with review subject hash
`863ae9550ee31285c8ae09ec1623b0a0ea7b6366b6b1729e0b3ca09d93c37cb0`, Stage 5
landing verdict, local-record landing action, Stage 6 retrospective closeout,
and bootstrap-gap disposition are recorded in `docs/work/BANDIT-036/` and
`.bandit/bootstrap-gaps.json`.

`BANDIT-034` is landed and closed out. Its Stage 4 CodeRabbit and Local Qwen
evidence pass, aggregate review evidence is current, Stage 5 landing verdict
and local-record landing action evidence are recorded, and Stage 6
retrospective closeout evaluates `BANDIT-033-COCKPIT-SHELL-HARDENING` as
`effective` with decision `keep`.

`BANDIT-035` is landed and closed out as the bootstrap-gap chore for
`BANDIT-GAP-ARTIFACT-CREATE-LANDING-WORK-ITEM-FIELD`. Its structured creation
spec is recorded in
`docs/specs/BANDIT-GAP-ARTIFACT-CREATE-LANDING-WORK-ITEM-FIELD.json`, its
Stage 1 brief is recorded in `docs/work/BANDIT-035/brief.md`, Stage 2 RED
evidence is recorded in `docs/work/BANDIT-035/red-evidence.md`, Stage 3
implementation evidence is recorded in
`docs/work/BANDIT-035/implementation-evidence.md`, and `.bandit/bootstrap-gaps.json`
marks the gap resolved by `BANDIT-035`. Stage 4 pre-PR CodeRabbit pass
evidence is recorded in `docs/work/BANDIT-035/coderabbit-review.md` at source
head `cb0a7ba506f6e4d9119a807915408463375c3480` with no findings. CodeRabbit
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

`BANDIT-036` is landed and closed out as the bootstrap-gap chore for
`BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING`. Its structured creation spec is
recorded in
`docs/specs/BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING.json`, its Stage 1 brief
is recorded in `docs/work/BANDIT-036/brief.md`, Stage 2 RED evidence is
recorded in `docs/work/BANDIT-036/red-evidence.md`, Stage 3 implementation
evidence is recorded in `docs/work/BANDIT-036/implementation-evidence.md`,
`.bandit/events.jsonl` records the work-item and artifact creation events, and
`.bandit/bootstrap-gaps.json` marks the gap resolved by `BANDIT-036`. Stage 4
pre-PR CodeRabbit pass evidence is recorded in
`docs/work/BANDIT-036/coderabbit-review.md` at source head
`8e3c7d8b6b64bb8800fc68e289147defb094aade` with no findings. Stage 4 Local
Qwen pass evidence is recorded in `docs/work/BANDIT-036/local-qwen-review.md`
at source head `346f7306c983b9ef290b1c2fe736a7a1fbdb514c` with no findings.
Aggregate Stage 4 review evidence is recorded in
`docs/work/BANDIT-036/review-evidence.md` with current review subject hash
`863ae9550ee31285c8ae09ec1623b0a0ea7b6366b6b1729e0b3ca09d93c37cb0`. Stage 5
landing verdict evidence is recorded in
`docs/work/BANDIT-036/landing-verdict.md` with final verdict `safe-to-land`.
Local-record landing action evidence is recorded in
`docs/work/BANDIT-036/landing-action.md`. Stage 6 retrospective closeout and
bootstrap-gap disposition are recorded in
`docs/work/BANDIT-036/retrospective.md` and `.bandit/bootstrap-gaps.json`.

Do not start local server/API mode, state-index persistence, scheduler
execution, worktree lifecycle, claim leases, work surface reservations,
automatic merge/push/deploy, product UAT approval, actor identity policy,
PR/CI workflow, or unrelated work unless a future work item explicitly scopes
that authority.

## Active Work

**Active work item:** `BANDIT-038` - Skill Lifecycle Contract. Stage 3 is
complete: the structured creation spec is recorded in
`docs/specs/BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT.json`, the brief is recorded in
`docs/work/BANDIT-038/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-038/red-evidence.md`, implementation evidence is recorded in
`docs/work/BANDIT-038/implementation-evidence.md`, and
`.bandit/bootstrap-gaps.json` links `BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT` to
the active chore. The next action is to run Stage 4 review gates for
`BANDIT-038`; do not start landing, retrospective, the next bootstrap-gap
chore, or unrelated Phase 8 work first.
`BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING` is resolved by `BANDIT-036`.
`BANDIT-GAP-WORKFLOW-TRIAL-DECISION-GUARDRAILS` is resolved by `BANDIT-037`.
`BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT` is active and linked to `BANDIT-038`.
`BANDIT-GAP-AGENT-EVALUATION-HARNESS`,
`BANDIT-GAP-INPUT-QUARANTINE-GATE`,
`BANDIT-GAP-LAYERED-RISK-CLASSIFICATION`,
`BANDIT-GAP-SUPPLY-CHAIN-GATE`,
`BANDIT-GAP-COORDINATION-EVENT-LOG-AUTHORITY`,
`BANDIT-GAP-OPERATOR-FAIL-CLOSED-BOUNDARY`, and
`BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY` are queued behind the skill-lifecycle
lane in that order. `BANDIT-GAP-GIT-MUTATION-SERIALIZER` is queued behind the
CAS/fenced-claim authority gap. `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` is
queued behind the Git mutation serializer gap.
`BANDIT-GAP-EVENT-DRIVEN-WAKE-SCHEDULER` is queued behind the worktree bootstrap
contract gap.
`BANDIT-GAP-AGENT-OBSERVABILITY-TRACES` is queued behind the event-driven wake
scheduler gap. `BANDIT-GAP-STAGE-CAPABILITY-SCOPE` is queued behind the agent
observability traces gap. `BANDIT-GAP-TOKEN-COST-FAILSAFE` is queued behind
the stage capability scope gap. `BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS` is queued
behind the token-cost failsafe gap.
`BANDIT-032` - Cockpit Status Coverage Hardening is landed and closed out.
`BANDIT-035` - Artifact Create Landing Work Item Field is landed and closed out.
`BANDIT-036` - Structured Retrospective Mining is landed and closed out.
`BANDIT-037` - Workflow Trial Decision Guardrails is landed and closed out.
`BANDIT-038` - Skill Lifecycle Contract is active with Stage 3 implementation
evidence recorded and Stage 4 review gates next.

**Completed work items:** `BANDIT-001` - Repo-Native State And CLI Skeleton;
`BANDIT-002` - Work Artifact Templates And Validation; `BANDIT-003` -
PRD-To-Work Draft Command; `BANDIT-004` - Routing Decision And Smell Trigger
Catalog; `BANDIT-005` - Pre-Landing Review Loop; `BANDIT-006` - Local Qwen
Baseline Reviewer Gate; `BANDIT-007` - CodeRabbit State Capture; `BANDIT-008`
- Local Reviewer Runtime Drift Repair; `BANDIT-009` - Local Qwen Full-Packet
Reliability; `BANDIT-010` - Escalated Adversarial Reviewer Placeholder;
`BANDIT-011` - Bootstrap Gap Chore Tracking And Routing; `BANDIT-012` -
CLI-Owned UAT Approval Artifact And Stale-UAT Detection; `BANDIT-013` -
Auto-Landing Eligibility Policy And Check; `BANDIT-014` - Landing Agent
Bootstrap Gap Resolution; `BANDIT-015` - Live CodeRabbit Pre-Landing Loop;
`BANDIT-016` - Stage 4 Evidence-Head Semantics; `BANDIT-017` - Landing Gate
Complexity And Git Diagnostics Hardening; `BANDIT-018` - Live Escalated
Reviewer Routing; `BANDIT-019` - Review Subject Hash Evidence Freshness;
`BANDIT-020` - Work Item Create Command; `BANDIT-021` - General Artifact
Create Command; `BANDIT-022` - Heartbeat Chore Agent Contract; `BANDIT-023` -
Non-Blocking Review Finding Chore Routing; `BANDIT-024` - Workflow Cockpit
Boundary Scope; `BANDIT-025` - Coordination Log Foundation; `BANDIT-026` -
Typed State Extensions; `BANDIT-027` - Pre-PR CodeRabbit CLI Review;
`BANDIT-028` - Agent Coordination Event Commands; `BANDIT-029` - Improvement
Evaluation Foundation; `BANDIT-030` - Evaluate Non-Blocking Review Finding
Routing; `BANDIT-031` - Workflow Cockpit Status Foundation; `BANDIT-032` -
Cockpit Status Coverage Hardening; `BANDIT-033` - Attention-First Cockpit
Visual Shell; `BANDIT-034` - Cockpit Shell Hardening; `BANDIT-035` - Artifact
Create Landing Work Item Field; `BANDIT-036` - Structured Retrospective Mining;
`BANDIT-037` - Workflow Trial Decision Guardrails.

**Expected next deliverable:** Stage 4 review evidence for `BANDIT-038` -
Skill Lifecycle Contract, before landing, retrospective, the next
bootstrap-gap chore, or unrelated Phase 8 work.

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- `BANDIT-GAP-ARTIFACT-CREATE-LANDING-WORK-ITEM-FIELD` is resolved by
  `BANDIT-035`: `bandit artifact create` now renders landing verdicts with the
  required `work_item` metadata field, focused artifact-create tests cover the
  parser-compatible output, Stage 4 review evidence passes, Stage 5 landing
  verdict and local-record landing action evidence are recorded, Stage 6
  retrospective closeout is recorded, and `.bandit/bootstrap-gaps.json` marks
  the gap resolved.
- `BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING` is resolved by `BANDIT-036`:
  `bandit artifact create` now requires structured improvement-mining evidence
  before rendering retrospectives, requires all ten Stage 6 mining signals,
  requires each mining row to include signal, finding, and disposition, and
  renders the checklist in repo-native Markdown. Stage 1 through Stage 6
  evidence is recorded in `docs/work/BANDIT-036/`, and
  `.bandit/bootstrap-gaps.json` marks the gap resolved.
- `BANDIT-GAP-WORKFLOW-TRIAL-DECISION-GUARDRAILS` is resolved by
  `BANDIT-037` from the 2026-05-26 strategic review: Workflow Trials and
  workflow-policy changes now require predeclared decision criteria, explicit
  uncertainty or minimum-detectable-effect context, proxy-risk disposition, and
  a later re-evaluation window before keep, revise, revert, or double_down
  decisions can change policy. Stage 2 RED evidence is recorded in
  `docs/work/BANDIT-037/red-evidence.md`, Stage 3 implementation evidence is
  recorded in `docs/work/BANDIT-037/implementation-evidence.md`, Stage 4
  pre-PR CodeRabbit pass evidence is recorded in
  `docs/work/BANDIT-037/coderabbit-review.md`, and Stage 4 Local Qwen
  `non_blocking` evidence is recorded in
  `docs/work/BANDIT-037/local-qwen-review.md` at source head
  `355dea8cadf2ec4a28cfd5e24cebc6dc2280e983`. Focused repair and PM
  disposition of the earlier and refreshed Local Qwen findings is recorded in
  `docs/work/BANDIT-037/qwen-finding-disposition.md`. Aggregate Stage 4 review
  evidence is recorded in `docs/work/BANDIT-037/review-evidence.md`; Stage 5
  landing verdict is recorded in `docs/work/BANDIT-037/landing-verdict.md` with
  final verdict `safe-to-land`; local-record landing action is recorded in
  `docs/work/BANDIT-037/landing-action.md`; Stage 6 retrospective closeout is
  recorded in `docs/work/BANDIT-037/retrospective.md`; and
  `.bandit/bootstrap-gaps.json` marks the gap resolved.
- `BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT` is active and linked to `BANDIT-038`
  from the 2026-05-26 strategic review: load-bearing skills now need a
  first-class lifecycle contract with owner, version, changelog, intended
  stages, required tools, forbidden actions, evaluation packets, and rollback
  criteria before they become required stage policy or benchmark variants.
  Stage 1 brief evidence is recorded in `docs/work/BANDIT-038/brief.md`,
  Stage 2 RED evidence is recorded in `docs/work/BANDIT-038/red-evidence.md`,
  and Stage 3 implementation evidence is recorded in
  `docs/work/BANDIT-038/implementation-evidence.md`; the next step is Stage 4
  pre-landing review.
- `BANDIT-GAP-AGENT-EVALUATION-HARNESS` is open and queued from the 2026-05-26
  strategic review: Bandit has improvement-evaluation tooling, but no harness
  that replays fixed packets against agents, reviewer profiles, skills, models,
  or load-bearing component variants. The first harness must be benchmark-only
  and offline/replay-based: fixed packets for Qwen, Claude or paid reviewers,
  skill variants, reviewer profiles, and component variants, with repo-derived
  failure-mode stratification, visible calibration packets, versioned locked
  holdout packets for policy promotion, gold-labeled reviewer packets, seeded
  blockers, seeded non-issues, blocker-recall scoring priority, actionable
  precision, useful finding yield, false-positive rate, tool friction, latency,
  provider-pricing-backed expected cost, pricing freshness or expiry,
  spend-class approval, scoped paid reviewer promotion thresholds per risk class
  or stage capability profile, and no automatic live-routing or policy changes.
  Provider Pricing Evidence for paid reviewers must include pricing source,
  captured date, effective date, freshness or expiry rule, expected per-run
  cost, spend class, and approval owner. One-off paid reviewer calls before
  threshold promotion are benchmark/evaluation spend that require per-run
  approval or active spend-class approval and cannot count as recurring
  reviewer routing policy. It is queued behind
  `BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT`.
- `BANDIT-GAP-INPUT-QUARANTINE-GATE` is open and queued from the 2026-05-26
  strategic review: Bandit now treats external contributor text, issue or PR
  metadata, review comments, dependency documentation, fetched third-party
  content, generated instructions, and fetched prompts as data-only input by
  default. Release-authorized agents need an input quarantine boundary and a
  trusted-source gate before any such content can affect instructions, tool
  permissions, routing, or landing authority. It is queued behind
  `BANDIT-GAP-AGENT-EVALUATION-HARNESS`.
- `BANDIT-GAP-LAYERED-RISK-CLASSIFICATION` is open and queued from the
  2026-05-26 strategic review: Bandit now treats smell-list-only review-depth
  and auto-landing decisions as too brittle. Auto-landing and review depth need
  a layered gate with hard never-auto-landable exclusions, blast-radius signals,
  static-analysis signals, source trust and input-quarantine state,
  supply-chain state, smell-trigger inputs, selected review depth,
  operator-supervision routing, and validation that any single high-risk signal
  can block auto-landing without smell-list concurrence. It is queued behind
  `BANDIT-GAP-INPUT-QUARANTINE-GATE`.
- `BANDIT-GAP-SUPPLY-CHAIN-GATE` is open and queued from the 2026-05-26
  strategic review: Bandit now treats supply-chain-sensitive changes as a
  blocker-level smell, but no CLI-owned gate records dependency, lockfile,
  package-manager script, CI/release workflow, agent-skill, fetched-prompt, or
  external tool-install evidence. It is queued behind
  `BANDIT-GAP-LAYERED-RISK-CLASSIFICATION`.
- `BANDIT-GAP-COORDINATION-EVENT-LOG-AUTHORITY` is open and queued from the
  2026-05-26 strategic review: PRD-002 now treats append-only workflow/event
  history as the only canonical coordination history, while current-state
  views, registries, state indexes, and cockpit status remain rebuildable
  projections except for CAS claim authority over active writable claims. It is
  queued behind `BANDIT-GAP-SUPPLY-CHAIN-GATE`.
- `BANDIT-GAP-OPERATOR-FAIL-CLOSED-BOUNDARY` is open and queued from the
  2026-05-26 strategic review: PRD-002 now reserves operator-blocking
  fail-closed behavior for safety, product, UAT, policy, business, cost,
  irreversible-risk, and genuinely ambiguous scope gates. Derivable operational
  drift such as missing metadata, malformed supported artifacts, projection
  mismatch, ledger drift, or workflow bookkeeping drift should route to
  CLI-owned mechanical repair with approved source artifacts,
  expected-current-state checks, and immutable transition history. It is queued
  behind `BANDIT-GAP-COORDINATION-EVENT-LOG-AUTHORITY`.
- `BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY` is open and queued from the
  2026-05-26 strategic review: PRD-002 now blocks true parallel writable
  workstreams until Bandit has CAS-backed claim authority, fencing-token
  enforcement, stale-agent rejection, idempotency keys for claim operations and
  external side effects, Work-Surface Wait-For Graph cycle detection, and
  declared Claim Safety Invariants backed by deterministic fault-injecting or
  property-style simulation, not example-only duplicate-claim tests. The
  2026-05-27 accepted backend decision requires the first Claim Authority
  Primitive to use `refs/bandit/*` and `git update-ref --stdin` compare-and-swap
  transactions, with `.bandit` claim files as projections rather than lock
  authority. It is queued behind
  `BANDIT-GAP-OPERATOR-FAIL-CLOSED-BOUNDARY`.
- `BANDIT-GAP-GIT-MUTATION-SERIALIZER` is open and queued from the
  2026-05-26 strategic review plus 2026-05-27 operator decision: Git refs CAS
  provides claim authority, but shared `.git` worktree and repository plumbing
  mutations still require a CLI-owned Git Mutation Serializer before parallel
  worktrees are release-authorized. Codex PM owns Git mechanics when repo
  evidence is sufficient; claim-owned worktrees are now required to be
  `git worktree lock`ed immediately with a stable reason naming claim ID, Work
  Item ID, and stage, and unlocked only by Repo PM Coordinator cleanup after
  handoff verification. It is queued behind
  `BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY`.
- `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` is open and queued from the
  2026-05-26 strategic review plus 2026-05-27 technical delegation decision:
  Codex PM owns routine technical questions, and every Bandit-created worktree
  now requires a repo-native Worktree Bootstrap Contract before worker execution
  treats it as runnable. The contract must cover allowed copied or linked files,
  setup commands, validation command, environment-variable references,
  secret-handling boundary, expected runtime dependencies, and bootstrap failure
  evidence. Secret material is not copied by default unless existing
  operator-supervised policy explicitly authorizes a narrower exception. It is
  queued behind `BANDIT-GAP-GIT-MUTATION-SERIALIZER`.
- `BANDIT-GAP-EVENT-DRIVEN-WAKE-SCHEDULER` is open and queued from the
  2026-05-26 strategic review: PRD-002 now rejects default LLM polling for
  ordinary no-op discovery, but the operator required work to still wake when
  available. Bandit needs event-driven triggers, a deterministic non-LLM
  sweeper, wake-guarantee tests, and token-cost failsafes before scheduler
  execution can rely on this path. It is queued behind
  `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT`.
- `BANDIT-GAP-AGENT-OBSERVABILITY-TRACES` is open and queued from the
  2026-05-26 strategic review: Bandit now treats OTel-compatible agent traces
  as first-class observability for claims, tool calls, reviewer runs, token
  spend, wakeups, retries, failures, and outcomes while repo artifacts remain
  canonical workflow state. It is queued behind
  `BANDIT-GAP-EVENT-DRIVEN-WAKE-SCHEDULER`.
- `BANDIT-GAP-STAGE-CAPABILITY-SCOPE` is open and queued from the 2026-05-26
  strategic review: Bandit now keeps roles authority-based and treats
  stage-specific skills, tools, reviewer depth, prompts, inputs, outputs,
  evidence, forbidden actions, and skill lifecycle contract references as Stage
  Capability Scope, but work-item specs and validation do not yet enforce that
  scope. It is queued behind
  `BANDIT-GAP-AGENT-OBSERVABILITY-TRACES`.
- `BANDIT-GAP-TOKEN-COST-FAILSAFE` is open and queued from the 2026-05-26
  strategic review: Bandit now treats token and cost budgets as abnormal-run
  failsafes for paid, high-token, reviewer, scheduler, or long-running work,
  not tight caps that can force repeated failed attempts. Paid routes also need
  provider-pricing evidence, pricing freshness or expiry, expected per-run cost,
  and spend-class approval before they are treated as available recurring
  routing; one-off paid reviewer or model calls before promotion are
  benchmark/evaluation spend that require per-run approval or active
  spend-class approval. It is queued behind
  `BANDIT-GAP-STAGE-CAPABILITY-SCOPE`.
- `BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS` is open and queued from the 2026-05-26
  strategic review: cockpit trust signals now need artifact-specific Evidence
  SLOs and freshness budgets for tests, CodeRabbit, Local Qwen, escalated
  review, UAT, landing verdicts, retrospectives, and projections instead of
  generic confidence badges. It is queued behind
  `BANDIT-GAP-TOKEN-COST-FAILSAFE`.

- The missing Bandit work-item creation command is resolved by `BANDIT-020`.
  Future one-off work-item starts should use
  `bandit work-item create <spec-path>` when not decomposing a Feature PRD
  through `draft-work`.
- Bootstrap-gap tracking artifact, listing command, and validation path are
  implemented and landed in `BANDIT-011`.
- CodeRabbit state capture substrate exists, `BANDIT-015` added a PR-context
  live review path, and `BANDIT-027` resolved the missing pre-PR CodeRabbit CLI
  review path for local diffs before PR creation.
- Local Qwen gate substrate exists, and `BANDIT-009` repaired full-packet
  reliability by routing through direct local oMLX while preserving structured
  findings.
- Escalated adversarial review placeholder gate exists; live escalated reviewer
  routing remains unavailable.
- Landing Agent gap is resolved by `BANDIT-014`; a durable local-record Landing
  Agent contract, command, review evidence, landing verdict, landing action
  evidence, retrospective, and gap-ledger disposition exist.
- General artifact creation command gap is resolved by `BANDIT-021`; landing
  verdict, landing action, retrospective, and gap-ledger disposition are
  recorded.
- CLI-owned UAT approval artifacts and stale-UAT detection are implemented and
  landed in `BANDIT-012`.
- `BANDIT-GAP-HEARTBEAT-CHORE-AGENT` is resolved by `BANDIT-022`; landing
  verdict, landing action, retrospective, and gap-ledger disposition are
  recorded.
- `BANDIT-GAP-NONBLOCKING-REVIEW-FINDING-ROUTING` is resolved by
  `BANDIT-023`; its brief, RED evidence, implementation evidence, Local Qwen
  Stage 4 pass evidence, aggregate Stage 4 review evidence, Stage 5 landing
  verdict, local-record landing action evidence, retrospective closeout, and
  gap-ledger disposition are recorded.
- `BANDIT-GAP-WORKFLOW-COCKPIT` is resolved by `BANDIT-024`; the cockpit
  boundary scoping brief, RED evidence, workflow-cockpit boundary artifact,
  implementation evidence, Local Qwen Stage 4 pass evidence, aggregate
  Stage 4 review evidence, Stage 5 landing verdict, and local-record landing
  action evidence, retrospective, and gap-ledger disposition are recorded. No
  Phase 8 web cockpit implementation exists yet.
- `BANDIT-GAP-CODERABBIT-PRE-PR-CLI-REVIEW` is resolved by `BANDIT-027`. This
  gap corrects the mismatch between the intended CodeRabbit pre-landing loop
  and the prior PR-context-only CodeRabbit command path. Stage 3 implementation
  evidence, Stage 4 review evidence, and Stage 5 landing verdict are recorded;
  local-record landing action, chore-disposition evidence, retrospective, and
  gap-ledger disposition are recorded.

Bootstrap work must record these gaps honestly instead of pretending final
gates ran. Currently recorded open bootstrap gaps are the work queue before
unrelated feature, cockpit, or dogfood work proceeds.
`BANDIT-GAP-WORK-ITEM-CREATE-COMMAND` is resolved by
`BANDIT-020`; landing verdict, landing action, retrospective, and gap-ledger
disposition are recorded.
`BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS` is resolved by `BANDIT-016`.
`BANDIT-GAP-LANDING-GATE-COMPLEXITY-HARDENING` is resolved by
`BANDIT-017`. `BANDIT-GAP-LIVE-ESCALATED-REVIEWER` is resolved by
`BANDIT-018`; landing verdict, landing action, retrospective, and gap-ledger
disposition are recorded. `BANDIT-GAP-REVIEW-SUBJECT-HASH-FRESHNESS` is
resolved by `BANDIT-019`; landing verdict, landing action, retrospective, and
gap-ledger disposition are recorded.
`BANDIT-GAP-LIVE-CODERABBIT` is resolved by `BANDIT-015`;
implementation evidence, CodeRabbit evidence, review evidence, and local Qwen
evidence are recorded. The local Qwen finding repair is recorded in
`docs/work/BANDIT-015/qwen-finding-repair.md`; CodeRabbit and aggregate review
evidence are refreshed at the repair head. The prior local Qwen rerun findings
are dispositioned in `docs/work/BANDIT-015/qwen-rerun-disposition.md`. The
current local Qwen rerun at PM disposition head
`068c4482ba156a158abd92faba2fcee2841f2288` returned a `blocker` verdict; its
findings are triaged in
`docs/work/BANDIT-015/qwen-blocker-disposition.md`. The Local Qwen rerun at
blocker-disposition head `4569c8f92eacf7df098f7f370bd8ac1c09d82b96` returned
another `blocker` verdict; its findings are triaged in
`docs/work/BANDIT-015/qwen-latest-blocker-disposition.md`. The remaining
blocker was the missing `docs/work/BANDIT-015/escalated-review.md` artifact,
which is now recorded. Local Qwen rerun at escalated-review disposition head
`16e7ecac0f2d590f9413c8f30d8ed3f554ceb91a` returned a new `blocker` verdict;
Codex PM triaged that blocker in
`docs/work/BANDIT-015/qwen-evidence-head-disposition.md` and refreshed
CodeRabbit evidence at source head
`c584fe3b06692632723aedad2f1f9d69db607602`. Local Qwen rerun at
evidence-head-disposition head `9248f34b104bc45eed91fb752a49eb0de987e470`
returned another `blocker` verdict. The operator ended that recursive loop,
authorized landing, and required the issue to be queued as
`BANDIT-GAP-STAGE4-EVIDENCE-HEAD-SEMANTICS`. `BANDIT-015` has landing action
evidence and retrospective closeout.

## Context Guardrails

- In a cold session, invoke `$bandit` or type `/bandit` to restore context from repo artifacts.
- `CONTEXT.md` is a required first-read file for cold sessions.
- Before each slice, read `CLEAN_CODE.md`.
- Before writing code, create or update the current work item brief.
- If required operator-owned input is missing, call it out directly and halt the blocked action.
- Before landing any slice, record whether it complies with `CLEAN_CODE.md` and `docs/verification/STAGE_RUBRICS.md`.
- After each completed step, update this file if the next action changed.
- If the Bandit skill or operating vocabulary changes, update `CONTEXT.md` in the same turn.
- If Codex cannot answer "what is next?" from this file and `ROADMAP.md`, stop and repair context.
- The operator should not need to reconstruct status from chat.

## Next Step Details

Phase 8 Workflow Cockpit kickoff.

BANDIT-005 started Phase 4 by adding pre-landing review evidence, landing
verdict contracts, source-drift checks, validation, and
`bandit land-check <work-item-id>`. BANDIT-006 added the local Qwen baseline
reviewer profile/evidence/command substrate. BANDIT-007 added the CodeRabbit
review evidence template/parser/command substrate and `land-check` integration,
while recording live CodeRabbit polling as a bootstrap gap. BANDIT-008 repaired
the local Qwen baseline reviewer runtime route away from Qwen Code/Ollama
drift. BANDIT-009 repaired full-packet local Qwen reliability and proved the
baseline can return structured output for real Bandit packets. BANDIT-010 added
the escalated adversarial reviewer placeholder gate and completed the Phase 4
placeholder set.

`BANDIT-011` landed the bootstrap-gap ledger, validation path, and list command.
Future cold starts should use `bandit gaps list` and `bandit validate` when
checking whether bootstrap gaps are active, queued, resolved, or blocked.

`BANDIT-012` completed the first Phase 5 capability: CLI-owned UAT approval
artifacts and stale-UAT detection.

`BANDIT-013` implemented, reviewed, marked safe-to-land, and landed the
auto-landing eligibility policy. Verification passed with `npm test`, `npm run
typecheck`, `npm run bandit -- validate`, `npm run bandit -- land-check
BANDIT-013`, `npm run bandit -- auto-land-check BANDIT-013`, `npm run bandit
-- gaps list`, and `git diff --check`.

`BANDIT-014` implemented, reviewed, marked safe-to-land, locally recorded its
Landing Agent landing action, and closed out the Landing Agent bootstrap gap.
Verification passed with `node --test test/landing-gates.test.mjs`, `npm test`,
`npm run typecheck`, `npm run bandit -- validate`, `npm run bandit -- land-check
BANDIT-014`, `npm run bandit -- auto-land-check BANDIT-014`, `npm run bandit
-- gaps list`, and `git diff --check`.

Use `bandit gaps list` as the routing source before starting new work. All
currently recorded bootstrap gaps are resolved through `BANDIT-027`, and
`BANDIT-028` is closed out as the final Phase 6 Coordination Primitive slice.
`BANDIT-029` has a structured spec, Stage 1 brief, Stage 2 RED evidence,
Stage 3 implementation evidence, Stage 4 review evidence, Stage 5 landing
verdict/readiness evidence, local-record landing action evidence, and Stage 6
retrospective/improvement disposition. `BANDIT-030` has a structured spec,
Stage 1 brief, Stage 2 RED/evaluation-design evidence, Stage 3 implementation
evidence, Stage 7 improvement-evaluation evidence, Stage 4 review evidence,
Stage 5 landing verdict/readiness evidence, local-record landing action
evidence, Stage 6 retrospective closeout, and evaluated `BANDIT-023`
improvement disposition. `BANDIT-031` is landed and closed out as the first
Phase 8 Workflow Cockpit Status Foundation. `BANDIT-032` has a structured spec,
Stage 1 brief, Stage 2 RED evidence, Stage 3 implementation evidence, Stage 4
CodeRabbit pass evidence, Stage 4 Local Qwen pass evidence, aggregate Stage 4
review evidence with current review subject hash, Stage 5 landing verdict,
passing `land-check`, local-record landing action evidence, and Stage 6
retrospective/improvement disposition for cockpit status coverage hardening.
`BANDIT-033` has Stage 5 landing verdict/readiness evidence, local-record
landing action evidence, and Stage 6 retrospective/improvement disposition
recorded. `BANDIT-034` is landed and closed out as the
`BANDIT-033-COCKPIT-SHELL-HARDENING` improvement chore, with Stage 1 through
Stage 6 evidence recorded in `docs/work/BANDIT-034/` and source-candidate
evaluation recorded in `docs/work/BANDIT-033/qwen-finding-disposition.md`,
`docs/work/BANDIT-033/retrospective.md`, and
`docs/work/BANDIT-034/retrospective.md`.
The current priority is:

1. Run Stage 4 review gates for `BANDIT-038` - Skill Lifecycle Contract now
   that implementation evidence exists for
   `BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT`. Do not start landing,
   retrospective, the next bootstrap-gap chore, or unrelated Phase 8 work
   first.
2. Keep local server/API mode, state-index persistence, scheduler execution,
   worktree lifecycle, automatic merge/push/deploy behavior, product UAT,
   actor identity policy, claim leases, work surface reservations, PR/CI
   workflow, and unrelated feature work out of scope unless explicitly
   authorized by a future work item.
3. Keep unrelated Phase 8 work blocked while any open bootstrap gap remains
   queued or active. `BANDIT-GAP-WORKFLOW-TRIAL-DECISION-GUARDRAILS` is
   resolved by `BANDIT-037`. `BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT` is active as
   `BANDIT-038`. `BANDIT-GAP-AGENT-EVALUATION-HARNESS`
   is queued behind the skill lifecycle contract. `BANDIT-GAP-INPUT-QUARANTINE-GATE` is queued
   behind the agent evaluation harness. `BANDIT-GAP-LAYERED-RISK-CLASSIFICATION`
   is queued behind the input quarantine gate. `BANDIT-GAP-SUPPLY-CHAIN-GATE` is
   queued behind the layered risk-classification gap. `BANDIT-GAP-COORDINATION-EVENT-LOG-AUTHORITY`
   is queued behind the supply-chain gate. `BANDIT-GAP-OPERATOR-FAIL-CLOSED-BOUNDARY`
   is queued behind the coordination event-log authority gap.
   `BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY` is queued behind the
   operator fail-closed boundary gap.
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

`BANDIT-021` resolved the general artifact creation command gap and is closed
out. Future Stage 4 review evidence must use `review_subject_hash` to avoid
raw-HEAD evidence loops.

## Required Operator Input

No operator-owned input is required before running Stage 4 review gates for
`BANDIT-038`. Repo artifacts identify the source gap, queue order, source
artifacts, implementation evidence, and required lifecycle-contract scope. Halt
only if the next step would change product direction, UAT policy, workflow
policy beyond the already queued skill lifecycle contract, business tradeoffs,
cost/risk posture, external service setup, paid reviewer routing, live routing,
scheduler authority, claim/worktree authority, installed global skill contents,
dependency or lockfile policy, or broader workflow scope.

If the next step would expand beyond the recorded PRD/design-review scope,
choose local server/API mode, choose state-index persistence timing, require
product UAT, change policy, approve cost/risk, enable PR/merge/push/deploy
authority, select an external service, or resolve genuinely ambiguous scope,
halt and ask for that input directly.

Actual product UAT approval for future feature slices remains operator-owned
and must not be inferred by Codex PM or implementation agents.
