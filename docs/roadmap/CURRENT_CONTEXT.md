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

**Last completed milestone:** `BANDIT-050` - Cockpit Status Interstitial
Recovery is landed and closed out as the bootstrap-gap chore for
`BANDIT-GAP-COCKPIT-STATUS-INTERSTITIAL-RECOVERY`. Its structured creation
spec, Stage 1 brief, Stage 2 RED evidence, Stage 3 implementation evidence,
scoped pre-PR CodeRabbit pass evidence, Local Qwen non-blocking evidence and PM
disposition, aggregate Stage 4 review evidence, explicit risk-classification
and supply-chain evidence, Stage 5 landing verdict evidence, local-record
landing action evidence, Stage 6 retrospective closeout, and bootstrap-gap
disposition are recorded in `docs/work/BANDIT-050/`, `docs/specs/`,
`.bandit/policy/`, and `.bandit/bootstrap-gaps.json`.

**Current active work:** `BANDIT-051` - Worktree Bootstrap Contract.

The current stage is Stage 5: Landing verdict.

**Current next action:** Record `BANDIT-051` layered risk-classification and
supply-chain gate evidence, then write the Stage 5 landing verdict and run
`npm run bandit -- land-check BANDIT-051`. Stage 3 implementation evidence is recorded in
`docs/specs/BANDIT-051-implementation-evidence.json`,
`docs/work/BANDIT-051/implementation-evidence.md`, and
`docs/work/BANDIT-051/writer-report.md`. Stage 4 CodeRabbit pass evidence is
recorded in `docs/work/BANDIT-051/coderabbit-review.md` with normalized provider
output in `docs/specs/BANDIT-051-coderabbit-review-output.json`. Local Qwen
Stage 4 evidence is recorded in `docs/work/BANDIT-051/local-qwen-review.md`
with reviewer verdict `non_blocking`; Codex PM disposition and durable routing
for the environment/runtime dependency validation, markdown template parsing,
and future evidence freshness findings are recorded in
`docs/work/BANDIT-051/qwen-finding-disposition.md`. Aggregate Stage 4 review
evidence is recorded in `docs/work/BANDIT-051/review-evidence.md` with current
review subject hash
`5cb368b9aba6c768f8796dd5bc6b2b49137f61dbcda765403612f5190ab3d847`. Keep
scheduler execution, full worktree lifecycle, claim lease creation or release,
work-surface reservations, cockpit UI/server/API work, PR/CI workflow,
automatic merge/push/deploy, product UAT scope, and unrelated Phase 8 work out
of scope.

`BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` is active and linked to
`BANDIT-051`. The Stage 1 brief is recorded in
`docs/work/BANDIT-051/brief.md`, generated from
`docs/specs/BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT.json`. The chore defines
the runnable environment contract for Bandit-created worktrees, including
allowed copied or linked files, setup commands, validation command,
environment-variable reference validation, secret-handling boundary, expected
runtime dependencies, and bootstrap failure evidence before worker execution
treats a claim-owned worktree as runnable.
Stage 2 RED evidence is recorded in `docs/specs/BANDIT-051-red-evidence.json`,
`docs/work/BANDIT-051/red-evidence.md`, and
`test/worktree-bootstrap.test.mjs`.
Stage 3 implementation evidence is recorded in
`docs/specs/BANDIT-051-implementation-evidence.json`,
`docs/work/BANDIT-051/implementation-evidence.md`, and
`docs/work/BANDIT-051/writer-report.md`.

`BANDIT-049` - Session Context Interstitial Recovery is landed and closed out
as the bootstrap-gap chore for
`BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY`. Its structured creation
spec is recorded in
`docs/specs/BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY.json`, Stage 1
brief evidence is recorded in `docs/work/BANDIT-049/brief.md`, Stage 2 RED
evidence is recorded in `docs/specs/BANDIT-049-red-evidence.json`,
`docs/work/BANDIT-049/red-evidence.md`, and
`test/focused-session-context.test.mjs`, lifecycle event evidence is recorded
in `.bandit/events.jsonl`, and `.bandit/bootstrap-gaps.json` marks the gap
resolved with linked work item `BANDIT-049`. Stage 3 Claude Writer dispatch
and implementation evidence are recorded in `docs/work/BANDIT-049/dispatch.md`,
`docs/work/BANDIT-049/writer-report.md`,
`docs/work/BANDIT-049/implementation-evidence.md`,
`docs/specs/BANDIT-049-implementation-evidence.json`,
`src/state/focused-session-context.ts`, and
`src/commands/session-context.ts`. Scoped pre-PR CodeRabbit pass evidence is
recorded in `docs/work/BANDIT-049/coderabbit-review.md` and
`docs/specs/BANDIT-049-coderabbit-review-output.json`. Local Qwen
`non_blocking` evidence is recorded in
`docs/work/BANDIT-049/local-qwen-review.md`, Codex PM finding disposition is
recorded in `docs/work/BANDIT-049/qwen-finding-disposition.md`, layered
risk-classification evidence is recorded in
`.bandit/policy/risk-classifications/BANDIT-049-risk-classification.json`,
supply-chain gate evidence is recorded in
`.bandit/policy/supply-chain-gates/BANDIT-049-supply-chain-gate.json`, and
aggregate Stage 4 review evidence is recorded in
`docs/work/BANDIT-049/review-evidence.md` with current `review_subject_hash`
`531a5ec223b4fa8b431d6dec9070e8ccbc53ff91ad4625fb41261c31db0aa447`. Stage 5
landing verdict evidence is recorded in
`docs/specs/BANDIT-049-landing-verdict.json` and
`docs/work/BANDIT-049/landing-verdict.md` with final verdict `safe-to-land`;
post-verdict `npm run bandit -- land-check BANDIT-049` passes. Local-record
landing action evidence is recorded in
`docs/work/BANDIT-049/landing-action.md` with current head
`2ff75119d9e187d89d72ab9a3cb4989dd06b5c70`. Stage 6 retrospective closeout is
recorded in `docs/specs/BANDIT-049-retrospective.json` and
`docs/work/BANDIT-049/retrospective.md`, and `.bandit/bootstrap-gaps.json`
marks `BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY` resolved. Stage 6
verification recorded `BANDIT-GAP-COCKPIT-STATUS-INTERSTITIAL-RECOVERY`
because `node ./bin/bandit.mjs cockpit status --json` still fails in the valid
no-active-work interstitial state while `node ./bin/bandit.mjs session-context
current --json` recovers correctly. The next required action is to create the
Cockpit Status Interstitial Recovery work item before Worktree Bootstrap
Contract work or unrelated Phase 8 work.

`BANDIT-048` - Focused Session Context Packets is landed and closed out as the
bootstrap-gap chore for `BANDIT-GAP-FOCUSED-SESSION-CONTEXT`. Its structured
creation spec is
recorded in `docs/specs/BANDIT-GAP-FOCUSED-SESSION-CONTEXT.json`, Stage 1 brief
evidence is recorded in `docs/work/BANDIT-048/brief.md`, Stage 2 RED evidence
is recorded in `docs/specs/BANDIT-048-red-evidence.json`,
`docs/work/BANDIT-048/red-evidence.md`, and
`test/focused-session-context.test.mjs`, lifecycle event evidence is recorded
in `.bandit/events.jsonl`, and `.bandit/bootstrap-gaps.json` marks the gap
resolved with linked work item `BANDIT-048`. Stage 3 Claude Writer dispatch and
implementation evidence are recorded in `docs/work/BANDIT-048/dispatch.md`,
`docs/work/BANDIT-048/writer-report.md`,
`docs/work/BANDIT-048/implementation-evidence.md`,
`docs/specs/BANDIT-048-implementation-evidence.json`,
`src/state/focused-session-context.ts`, `src/commands/session-context.ts`,
`src/cli.ts`, and `docs/evaluation/skills/bandit-cold-start.md`. Two
Stage 4 pre-PR CodeRabbit provider attempts timed out without a terminal verdict;
timeout evidence is recorded in
`docs/specs/BANDIT-048-coderabbit-review-output.json` and
`docs/work/BANDIT-048/coderabbit-review.md`. Codex PM timeout disposition is
recorded in `docs/work/BANDIT-048/coderabbit-timeout-disposition.md`. Local
Qwen Stage 4 evidence is recorded in
`docs/work/BANDIT-048/local-qwen-review.md` with `reviewer_verdict:
non_blocking`, `findings_status: open`, and three findings. Codex PM
disposition of those findings is recorded in
`docs/work/BANDIT-048/qwen-finding-disposition.md`. Aggregate Stage 4 review
evidence is recorded in `docs/work/BANDIT-048/review-evidence.md` with current
`review_subject_hash`
`49efaa6e358d88efb24a9a48a4feeefddd7c2d797ed13e3bf7ba3083c8d1ba6d`,
CodeRabbit provider-refusal/bootstrap_gap replacement evidence, Local Qwen
`non_blocking` evidence, PM disposition evidence, and durable routing for all
non-blocking findings. Stage 5 landing verdict evidence is recorded in
`docs/specs/BANDIT-048-landing-verdict.json` and
`docs/work/BANDIT-048/landing-verdict.md` with final verdict `safe-to-land`;
explicit layered risk-classification and supply-chain gate evidence is recorded
in `.bandit/policy/`; post-verdict `npm run bandit -- land-check BANDIT-048`
passes; and local-record landing action evidence is recorded in
`docs/work/BANDIT-048/landing-action.md` with current head
`48f156969586e01df52b6be2506ad6be838078fa`. Stage 6 retrospective closeout is
recorded in `docs/specs/BANDIT-048-retrospective.json` and
`docs/work/BANDIT-048/retrospective.md`, and `.bandit/bootstrap-gaps.json` marks
`BANDIT-GAP-FOCUSED-SESSION-CONTEXT` resolved. Stage 6 verification recorded
`BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY` for the closed-work-item
session-context recovery gap; that gap is now resolved by `BANDIT-049`.

`BANDIT-047` - Bootstrap Model-Family Separation is landed and closed out as
the bootstrap-gap chore for
`BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION`. Its structured creation spec is
recorded in `docs/specs/BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION.json`,
Stage 1 brief is recorded in `docs/work/BANDIT-047/brief.md`, Stage 2 RED
evidence is recorded in `docs/specs/BANDIT-047-red-evidence.json`,
`docs/work/BANDIT-047/red-evidence.md`, and
`test/model-family-separation.test.mjs`, Stage 3 implementation evidence is
recorded in `docs/specs/BANDIT-047-implementation-evidence.json`,
`docs/work/BANDIT-047/implementation-evidence.md`,
`docs/work/BANDIT-047/writer-report.md`, the model-family policy/template and
evidence artifacts, and the implementation source. Stage 4 CodeRabbit pass
evidence is recorded in `docs/work/BANDIT-047/coderabbit-review.md`, Stage 4
Local Qwen pass evidence is recorded in
`docs/work/BANDIT-047/local-qwen-review.md`, aggregate Stage 4 review evidence
is recorded in `docs/work/BANDIT-047/review-evidence.md`, Stage 5 landing
verdict evidence is recorded in `docs/work/BANDIT-047/landing-verdict.md`,
local-record landing action evidence is recorded in
`docs/work/BANDIT-047/landing-action.md`, Stage 6 retrospective closeout is
recorded in `docs/work/BANDIT-047/retrospective.md`, and
`.bandit/bootstrap-gaps.json` marks the gap resolved.

`BANDIT-046` - Git Mutation Serializer is landed and closed out as the
bootstrap-gap chore for `BANDIT-GAP-GIT-MUTATION-SERIALIZER`. Its structured
creation spec is recorded
in `docs/specs/BANDIT-GAP-GIT-MUTATION-SERIALIZER.json`, its Stage 1 brief is
recorded in `docs/work/BANDIT-046/brief.md`, Stage 2 RED evidence is recorded
in `docs/specs/BANDIT-046-red-evidence.json`,
`docs/work/BANDIT-046/red-evidence.md`,
`test/git-mutation-serializer.test.mjs`,
`test/helpers/git-mutation-fixture.mjs`, and
`test/claim-safety-simulation.test.mjs`, Stage 3 implementation evidence is
recorded in `docs/specs/BANDIT-046-implementation-evidence.json`,
`docs/work/BANDIT-046/implementation-evidence.md`,
`src/state/git-mutations.ts`, `src/commands/git-mutation.ts`,
`.bandit/policy/git-mutations.json`,
`docs/templates/git-mutation-serializer.md`,
`docs/git-mutations/BANDIT-046-git-mutation-serializer.json`, and the
focused implementation diff, `.bandit/events.jsonl` records the
work-item-created, red-evidence artifact-created, implementation-evidence
artifact-created, and retrospective artifact-created events, and
`.bandit/bootstrap-gaps.json` links the gap to `BANDIT-046` with status
`resolved`. Stage 4 pre-PR CodeRabbit pass evidence is recorded in
`docs/work/BANDIT-046/coderabbit-review.md`, Stage 4 Local Qwen pass evidence
is recorded in `docs/work/BANDIT-046/local-qwen-review.md`, explicit
risk-classification and supply-chain gate evidence is recorded in
`.bandit/policy/`, aggregate Stage 4 review evidence is recorded in
`docs/work/BANDIT-046/review-evidence.md` with current review subject hash
`d8ac9ba628f36a2bc4e80703eb09bb52416b1e5aa7e66dc0b83727b8edf043d3`, Stage 5
landing verdict evidence is recorded in
`docs/specs/BANDIT-046-landing-verdict.json` and
`docs/work/BANDIT-046/landing-verdict.md` with final verdict `safe-to-land`.
Local-record landing action evidence is recorded in
`docs/work/BANDIT-046/landing-action.md`, Stage 6 retrospective closeout is
recorded in `docs/work/BANDIT-046/retrospective.md`, and
`.bandit/bootstrap-gaps.json` marks the gap resolved. The next required work is
the queued Bootstrap Model-Family Separation and Test Ownership Boundary gap.

`BANDIT-045` - CAS Fenced Claim Authority is landed and closed out as the
bootstrap-gap chore for `BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY`. Its structured
creation spec and Stage 1 brief are recorded in
`docs/specs/BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY.json` and
`docs/work/BANDIT-045/brief.md`. Stage 2 RED evidence is recorded in
`docs/work/BANDIT-045/red-evidence.md`, Stage 3 implementation evidence is
recorded in `docs/work/BANDIT-045/implementation-evidence.md`, Stage 4
pre-PR CodeRabbit pass evidence is recorded in
`docs/work/BANDIT-045/coderabbit-review.md`, Stage 4 Local Qwen
`non_blocking` evidence is recorded in
`docs/work/BANDIT-045/local-qwen-review.md`, Codex PM disposition of the
Local Qwen findings is recorded in
`docs/work/BANDIT-045/qwen-finding-disposition.md`, explicit layered
risk-classification and supply-chain gate evidence is recorded in
`.bandit/policy/`, and aggregate Stage 4 review evidence is recorded in
`docs/work/BANDIT-045/review-evidence.md` with current review subject hash
`8909bcf05f22489693876232412561b360af9b6aeb8c516b1b4d2833d9ca0051`. Stage 5
landing verdict evidence is recorded in
`docs/work/BANDIT-045/landing-verdict.md` with final verdict `safe-to-land`;
local-record landing action evidence is recorded in
`docs/work/BANDIT-045/landing-action.md`; Stage 6 retrospective closeout and
bootstrap-gap disposition are recorded in
`docs/work/BANDIT-045/retrospective.md` and `.bandit/bootstrap-gaps.json`.
True parallel writable workstreams remain blocked until the next queued Git
Mutation Serializer active chore and later Worktree Bootstrap Contract gap are
resolved or explicitly dispositioned.

`BANDIT-044` - Operator Fail-Closed Boundary is landed and closed out as the
bootstrap-gap chore for `BANDIT-GAP-OPERATOR-FAIL-CLOSED-BOUNDARY`. Its
structured creation spec, Stage 1 brief, Stage 2 RED evidence, Stage 3
implementation evidence, Stage 4 pre-PR CodeRabbit pass evidence, Stage 4
Local Qwen pass evidence, aggregate Stage 4 review evidence, Stage 5 landing
verdict evidence, explicit risk-classification and supply-chain landing repair
evidence, local-record landing action evidence, Stage 6 retrospective closeout,
and bootstrap-gap disposition are recorded in `docs/work/BANDIT-044/`,
`.bandit/policy/`, and `.bandit/bootstrap-gaps.json`. The implemented repair
keeps operator-blocking gates reserved for product, UAT, policy, business,
explicit cost/risk, irreversible operational-risk, safety-critical release
authorization, and genuinely ambiguous scope decisions while derivable
operational drift routes to Codex PM or CLI-owned mechanical repair.

`BANDIT-043` - Coordination Event Log Authority is landed and closed out. The
implemented repair keeps append-only coordination history as canonical
coordination history for workflow position and accepted coordination context,
keeps current-state views, cockpit status, state indexes, SQLite caches,
in-flight registries, and derived reports as rebuildable non-authoritative
projections, preserves actor-event non-authority, and keeps the CAS
claim-authority exception future-scoped without implementing claim leases,
fencing tokens, idempotency keys, work-surface reservations, Git Mutation
Serializer behavior, worktree lifecycle, scheduler execution, state-index
persistence, local server/API mode, cockpit UI behavior, PR/CI execution,
merge/push/deploy behavior, paid reviewer routing, live routing changes,
installed global skill edits, external service integration, product UAT scope,
or unrelated Phase 8 work.

`BANDIT-041` - Layered Risk Classification is landed and closed out as the
bootstrap-gap chore for `BANDIT-GAP-LAYERED-RISK-CLASSIFICATION`. Its
structured creation spec is recorded in
`docs/specs/BANDIT-GAP-LAYERED-RISK-CLASSIFICATION.json`, its Stage 1 brief is
recorded in `docs/work/BANDIT-041/brief.md`, Stage 2 RED evidence is recorded
in `docs/work/BANDIT-041/red-evidence.md`, Stage 3 implementation evidence is
recorded in `docs/work/BANDIT-041/implementation-evidence.md`,
Stage 4 pre-PR CodeRabbit pass evidence is recorded in
`docs/work/BANDIT-041/coderabbit-review.md`, Stage 4 Local Qwen
`non_blocking` evidence and PM disposition are recorded in
`docs/work/BANDIT-041/local-qwen-review.md` and
`docs/work/BANDIT-041/qwen-finding-disposition.md`, aggregate Stage 4 review
evidence with current review subject hash
`f7a152e98427226be0ff70dce9f2830ad17d8e433ce750f6ed3e5c612971a994` is
recorded in `docs/work/BANDIT-041/review-evidence.md`, Stage 5 landing verdict
evidence is recorded in `docs/work/BANDIT-041/landing-verdict.md` with final
verdict `safe-to-land`, Stage 5 landing blocker evidence is recorded in
`docs/work/BANDIT-041/landing-blocker.md`, explicit layered risk-classification
landing repair evidence is recorded in
`.bandit/policy/risk-classifications/BANDIT-041-risk-classification.json`, and local-record
landing action evidence is recorded in `docs/work/BANDIT-041/landing-action.md`.
Stage 6 retrospective closeout is recorded in
`docs/work/BANDIT-041/retrospective.md`, and `.bandit/bootstrap-gaps.json`
marks `BANDIT-GAP-LAYERED-RISK-CLASSIFICATION` resolved.
`.bandit/events.jsonl` records the work-item-created, red-evidence artifact,
implementation-evidence artifact, landing-verdict artifact, and retrospective
artifact events.

`BANDIT-042` - Supply-Chain Gate is landed and closed out as the bootstrap-gap
chore for
`BANDIT-GAP-SUPPLY-CHAIN-GATE`. Its structured creation spec is recorded in
`docs/specs/BANDIT-GAP-SUPPLY-CHAIN-GATE.json`, its Stage 1 brief is recorded
in `docs/work/BANDIT-042/brief.md`, `.bandit/bootstrap-gaps.json` marks the gap
resolved by `BANDIT-042`, and `.bandit/events.jsonl` records the
work-item-created and artifact-created events. Stage 2 RED evidence is recorded in
`docs/work/BANDIT-042/red-evidence.md`, with focused tests in
`test/supply-chain-gate.test.mjs`. Stage 3 implementation evidence is recorded
in `docs/work/BANDIT-042/implementation-evidence.md`. Stage 4 pre-PR
CodeRabbit pass evidence is recorded in
`docs/work/BANDIT-042/coderabbit-review.md`; Stage 4 Local Qwen
`non_blocking` evidence and PM disposition are recorded in
`docs/work/BANDIT-042/local-qwen-review.md` and
`docs/work/BANDIT-042/qwen-finding-disposition.md`; aggregate Stage 4 review
evidence with current review subject hash
`459f24448eccddd5682a424fff4b76c3adf23a562dc709027dc7fdf44e35ecf6`
is recorded in `docs/work/BANDIT-042/review-evidence.md`. Stage 5 landing
verdict evidence is recorded in `docs/work/BANDIT-042/landing-verdict.md` with
final verdict `safe-to-land`, explicit layered risk-classification and
supply-chain gate landing repair evidence is recorded in
`.bandit/policy/risk-classifications/BANDIT-042-risk-classification.json` and
`.bandit/policy/supply-chain-gates/BANDIT-042-supply-chain-gate.json`, and
local-record landing action evidence is recorded in
`docs/work/BANDIT-042/landing-action.md`. Stage 6 retrospective closeout is
recorded in `docs/work/BANDIT-042/retrospective.md`, and
`.bandit/bootstrap-gaps.json` marks `BANDIT-GAP-SUPPLY-CHAIN-GATE` resolved.

`BANDIT-039` - Agent Evaluation Harness
is landed and closed out: Stage 1 brief, Stage 2 RED evidence, Stage 3
implementation evidence, Stage 4 pre-PR CodeRabbit pass evidence, Stage 4
Local Qwen pass evidence, aggregate Stage 4 review evidence with current
review subject hash
`d74ec2b37161cc3fe5a497d07fd27f4f721205f6fd1d7f6bbef6ff1c70fa6511`, Stage 5
landing verdict, local-record landing action, Stage 6 retrospective closeout,
and bootstrap-gap disposition are recorded in `docs/work/BANDIT-039/` and
`.bandit/bootstrap-gaps.json`.

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

**Active work item:** `BANDIT-051`.

`BANDIT-051` is active as the bootstrap-gap chore for
`BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT`. Stage 1 brief evidence is recorded in
`docs/work/BANDIT-051/brief.md`, Stage 2 RED evidence is recorded in
`docs/specs/BANDIT-051-red-evidence.json`,
`docs/work/BANDIT-051/red-evidence.md`, and
`test/worktree-bootstrap.test.mjs`. Stage 3 implementation evidence is recorded
in `docs/specs/BANDIT-051-implementation-evidence.json`,
`docs/work/BANDIT-051/implementation-evidence.md`, and
`docs/work/BANDIT-051/writer-report.md`, and `.bandit/bootstrap-gaps.json`
links the gap to `BANDIT-051` with disposition `active_chore`. The next action
is to run Stage 4 review gates only; do not start branch/worktree execution,
scheduler execution, full worktree lifecycle, claim lease creation or release,
work-surface reservations, cockpit UI/server/API work, PR/CI workflow,
automatic merge/push/deploy, product UAT scope, or unrelated Phase 8 work.

`BANDIT-048` is landed and closed out as the bootstrap-gap chore for
`BANDIT-GAP-FOCUSED-SESSION-CONTEXT`; its Stage 1 through Stage 6 evidence,
landing action, retrospective closeout, and gap-ledger disposition are recorded
in `docs/work/BANDIT-048/`, `docs/specs/`, `.bandit/policy/`, and
`.bandit/bootstrap-gaps.json`.

`BANDIT-047` is landed and closed out. It has structured creation spec evidence
in `docs/specs/BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION.json`, Stage 1
brief evidence in `docs/work/BANDIT-047/brief.md`, lifecycle event evidence in
`.bandit/events.jsonl`, and resolved bootstrap-gap linkage in
`.bandit/bootstrap-gaps.json`. Stage 2 RED evidence is recorded in
`docs/specs/BANDIT-047-red-evidence.json`, `docs/work/BANDIT-047/red-evidence.md`,
and `test/model-family-separation.test.mjs`. Stage 3 implementation evidence is
recorded in `docs/specs/BANDIT-047-implementation-evidence.json`,
`docs/work/BANDIT-047/implementation-evidence.md`, `docs/work/BANDIT-047/writer-report.md`,
the model-family policy/template and evidence artifacts, and the implementation
source. Stage 4 CodeRabbit evidence is recorded in
`docs/work/BANDIT-047/coderabbit-review.md` with a completed pass verdict and
zero findings after repair. Stage 4 Local Qwen evidence is recorded in
`docs/work/BANDIT-047/local-qwen-review.md` with a pass verdict and no findings.
Aggregate Stage 4 review evidence is recorded in
`docs/work/BANDIT-047/review-evidence.md` with current review subject hash
`23f7342ddea065d6b7730a74301723214e6a7e888776f78d9794a083ffbd1e78`. Stage 5
landing verdict evidence is recorded in `docs/work/BANDIT-047/landing-verdict.md`
with final verdict `safe-to-land`, UAT `not_applicable`, clean-code `pass`, and
explicit layered risk-classification and supply-chain gate evidence.
Local-record landing action evidence is recorded in
`docs/work/BANDIT-047/landing-action.md`. Stage 6 retrospective closeout is
recorded in `docs/work/BANDIT-047/retrospective.md`.

`BANDIT-046` has Stage 1 brief evidence in
`docs/work/BANDIT-046/brief.md`, structured creation spec evidence in
`docs/specs/BANDIT-GAP-GIT-MUTATION-SERIALIZER.json`, Stage 2 RED evidence in
`docs/work/BANDIT-046/red-evidence.md`, focused RED tests in
`test/git-mutation-serializer.test.mjs` and
`test/claim-safety-simulation.test.mjs`, a serializer fixture helper in
`test/helpers/git-mutation-fixture.mjs`, lifecycle event evidence in
`.bandit/events.jsonl`, and resolved bootstrap-gap linkage in
`.bandit/bootstrap-gaps.json`. The RED tests define the git-mutations policy
and template requirement, `bandit git-mutation validate --json`, shared `.git`
mutation allow-list validation, release-authorized bypass refusal, exclusive
single-writer contention behavior, claim-authority separation, claim-owned
worktree lock reason and unlock authority, lock-failure cleanup, timeout and
stale-lock fail-closed behavior, and serializer-failure cleanup simulation.
Stage 3 implementation evidence is recorded in
`docs/work/BANDIT-046/implementation-evidence.md`, with repo-native
git-mutation policy/template/evidence surfaces, CLI validation wiring,
`bandit validate` integration, and serializer-failure simulation behavior.
Stage 4 review evidence is recorded in
`docs/work/BANDIT-046/coderabbit-review.md`,
`docs/work/BANDIT-046/local-qwen-review.md`,
`.bandit/policy/risk-classifications/BANDIT-046-risk-classification.json`,
`.bandit/policy/supply-chain-gates/BANDIT-046-supply-chain-gate.json`, and
`docs/work/BANDIT-046/review-evidence.md`, Stage 5 landing verdict evidence
is recorded in `docs/work/BANDIT-046/landing-verdict.md`, local-record landing
action evidence is recorded in `docs/work/BANDIT-046/landing-action.md`, Stage
6 retrospective closeout is recorded in
`docs/work/BANDIT-046/retrospective.md`, and `.bandit/bootstrap-gaps.json`
marks `BANDIT-GAP-GIT-MUTATION-SERIALIZER` resolved. The follow-up
Bootstrap Model-Family Separation gap is resolved by `BANDIT-047`.

`BANDIT-045` has Stage 1 brief evidence in `docs/work/BANDIT-045/brief.md`,
structured creation spec evidence in
`docs/specs/BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY.json`, lifecycle event
evidence in `.bandit/events.jsonl`, and active bootstrap-gap linkage in
`.bandit/bootstrap-gaps.json`. Stage 2 RED evidence is recorded in
`docs/work/BANDIT-045/red-evidence.md`, with focused RED tests in
`test/claim-authority.test.mjs`, `test/claim-safety-simulation.test.mjs`, and
`test/work-surface-graph.test.mjs`. Stage 3 implementation evidence is
recorded in `docs/work/BANDIT-045/implementation-evidence.md`. Stage 4 pre-PR
CodeRabbit pass evidence is recorded in
`docs/work/BANDIT-045/coderabbit-review.md`, and Stage 4 Local Qwen
`non_blocking` evidence is recorded in
`docs/work/BANDIT-045/local-qwen-review.md`. Codex PM disposition of the open
Local Qwen findings is recorded in
`docs/work/BANDIT-045/qwen-finding-disposition.md`. Explicit layered
risk-classification and supply-chain gate evidence is recorded in
`.bandit/policy/`, aggregate Stage 4 review evidence is recorded in
`docs/work/BANDIT-045/review-evidence.md` with current review subject hash
`8909bcf05f22489693876232412561b360af9b6aeb8c516b1b4d2833d9ca0051`, and Stage
5 landing verdict evidence is recorded in
`docs/work/BANDIT-045/landing-verdict.md` with final verdict `safe-to-land`.
Local-record landing action evidence is recorded in
`docs/work/BANDIT-045/landing-action.md`. Stage 6 retrospective closeout and
bootstrap-gap disposition are recorded in
`docs/work/BANDIT-045/retrospective.md` and `.bandit/bootstrap-gaps.json`.
`BANDIT-GAP-GIT-MUTATION-SERIALIZER` is resolved by `BANDIT-046`;
`BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION` is resolved by `BANDIT-047` for
model-family separation and test ownership enforcement. This is bootstrap
artifact/diff-gate enforcement around Process Adapter runs, not a claim that
Codex can provide live cross-model orchestration.

`BANDIT-044` has Stage 1 brief evidence in `docs/work/BANDIT-044/brief.md`,
structured creation spec evidence in
`docs/specs/BANDIT-GAP-OPERATOR-FAIL-CLOSED-BOUNDARY.json`, lifecycle event
evidence in `.bandit/events.jsonl`, Stage 2 RED evidence in
`docs/work/BANDIT-044/red-evidence.md`, focused tests in
`test/operator-boundary.test.mjs`, Stage 3 implementation evidence in
`docs/work/BANDIT-044/implementation-evidence.md`, Stage 4 pre-PR CodeRabbit
pass evidence in `docs/work/BANDIT-044/coderabbit-review.md`, Stage 4 Local
Qwen pass evidence in `docs/work/BANDIT-044/local-qwen-review.md`, aggregate
Stage 4 review evidence in `docs/work/BANDIT-044/review-evidence.md` with
current `review_subject_hash`
`16767c5f4c5612ed4f86ef367005292cc115f7b3b3d077a42948e1313b31c7b8`, Stage 5
landing verdict evidence in `docs/work/BANDIT-044/landing-verdict.md`,
explicit layered risk-classification and supply-chain gate evidence in
`.bandit/policy/risk-classifications/BANDIT-044-risk-classification.json` and
`.bandit/policy/supply-chain-gates/BANDIT-044-supply-chain-gate.json`,
local-record landing action evidence in
`docs/work/BANDIT-044/landing-action.md`, Stage 6 retrospective closeout in
`docs/work/BANDIT-044/retrospective.md`, and bootstrap-gap disposition in
`.bandit/bootstrap-gaps.json`.

`BANDIT-043` has Stage 1 brief evidence in `docs/work/BANDIT-043/brief.md`,
structured spec evidence in
`docs/specs/BANDIT-GAP-COORDINATION-EVENT-LOG-AUTHORITY.json`, Stage 2 RED
evidence in `docs/work/BANDIT-043/red-evidence.md`, focused RED tests in
`test/coordination-authority.test.mjs`, Stage 3 implementation evidence in
`docs/work/BANDIT-043/implementation-evidence.md`, Stage 4 pre-PR CodeRabbit
pass evidence in `docs/work/BANDIT-043/coderabbit-review.md`, Stage 4 Local
Qwen pass evidence in `docs/work/BANDIT-043/local-qwen-review.md`, aggregate
Stage 4 review evidence with current `review_subject_hash` in
`docs/work/BANDIT-043/review-evidence.md`, Stage 5 landing verdict evidence in
`docs/work/BANDIT-043/landing-verdict.md`, Stage 5 blocker evidence in
`docs/work/BANDIT-043/landing-blocker.md`, explicit risk-classification and
supply-chain landing repair evidence in `.bandit/policy/`, local-record landing
action evidence in `docs/work/BANDIT-043/landing-action.md`, Stage 6
retrospective closeout in `docs/work/BANDIT-043/retrospective.md`, and
bootstrap-gap disposition in `.bandit/bootstrap-gaps.json`.

`BANDIT-042` has Stage 1 brief evidence in `docs/work/BANDIT-042/brief.md`,
Stage 2 RED evidence in `docs/work/BANDIT-042/red-evidence.md`, focused RED
tests in `test/supply-chain-gate.test.mjs`, structured spec evidence in
`docs/specs/BANDIT-GAP-SUPPLY-CHAIN-GATE.json`, and gap-ledger routing in
`.bandit/bootstrap-gaps.json`. Stage 3 implementation evidence is recorded in
`docs/work/BANDIT-042/implementation-evidence.md`. Stage 4 CodeRabbit,
Local Qwen, PM disposition, and aggregate review evidence are recorded in
`docs/work/BANDIT-042/`. Stage 5 landing verdict evidence is recorded in
`docs/work/BANDIT-042/landing-verdict.md` with final verdict `safe-to-land`;
explicit layered risk-classification and supply-chain gate landing repair
evidence is recorded in
`.bandit/policy/risk-classifications/BANDIT-042-risk-classification.json` and
`.bandit/policy/supply-chain-gates/BANDIT-042-supply-chain-gate.json`; and
local-record landing action evidence is recorded in
`docs/work/BANDIT-042/landing-action.md`. Stage 6 retrospective closeout is
recorded in `docs/work/BANDIT-042/retrospective.md`, and
`.bandit/bootstrap-gaps.json` marks `BANDIT-GAP-SUPPLY-CHAIN-GATE` resolved.

`BANDIT-041` - Layered Risk Classification is landed and closed out as the
bootstrap-gap chore for `BANDIT-GAP-LAYERED-RISK-CLASSIFICATION`. Its
structured creation spec is recorded in
`docs/specs/BANDIT-GAP-LAYERED-RISK-CLASSIFICATION.json`, its brief is
recorded in `docs/work/BANDIT-041/brief.md`, RED evidence is recorded in
`docs/work/BANDIT-041/red-evidence.md`, implementation evidence is recorded in
`docs/work/BANDIT-041/implementation-evidence.md`, CodeRabbit review evidence
is recorded in `docs/work/BANDIT-041/coderabbit-review.md`, Local Qwen review
evidence and PM disposition are recorded in
`docs/work/BANDIT-041/local-qwen-review.md` and
`docs/work/BANDIT-041/qwen-finding-disposition.md`, aggregate Stage 4 review
evidence is recorded in `docs/work/BANDIT-041/review-evidence.md` with current
review subject hash
`f7a152e98427226be0ff70dce9f2830ad17d8e433ce750f6ed3e5c612971a994`, Stage 5
landing verdict evidence is recorded in
`docs/work/BANDIT-041/landing-verdict.md` with final verdict `safe-to-land`,
Stage 5 landing blocker evidence is recorded in
`docs/work/BANDIT-041/landing-blocker.md`, explicit layered risk-classification
landing repair evidence is recorded in
`.bandit/policy/risk-classifications/BANDIT-041-risk-classification.json`,
local-record landing action evidence is recorded in
`docs/work/BANDIT-041/landing-action.md`, Stage 6 retrospective closeout is
recorded in `docs/work/BANDIT-041/retrospective.md`, and
`.bandit/bootstrap-gaps.json` marks `BANDIT-GAP-LAYERED-RISK-CLASSIFICATION`
resolved.
`BANDIT-GAP-STRUCTURED-RETROSPECTIVE-MINING` is resolved by `BANDIT-036`.
`BANDIT-GAP-WORKFLOW-TRIAL-DECISION-GUARDRAILS` is resolved by `BANDIT-037`.
`BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT` is resolved by `BANDIT-038`.
`BANDIT-GAP-AGENT-EVALUATION-HARNESS` is resolved by `BANDIT-039`.
`BANDIT-GAP-INPUT-QUARANTINE-GATE` is resolved by `BANDIT-040`.
`BANDIT-GAP-LAYERED-RISK-CLASSIFICATION` is resolved by `BANDIT-041`.
`BANDIT-GAP-SUPPLY-CHAIN-GATE` is resolved by `BANDIT-042`.
`BANDIT-GAP-COORDINATION-EVENT-LOG-AUTHORITY` is resolved by `BANDIT-043`.
`BANDIT-GAP-OPERATOR-FAIL-CLOSED-BOUNDARY` is resolved by `BANDIT-044`.
`BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY` is resolved by `BANDIT-045`.
`BANDIT-GAP-GIT-MUTATION-SERIALIZER` is resolved by `BANDIT-046`.
`BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION` is resolved by `BANDIT-047`.
`BANDIT-GAP-FOCUSED-SESSION-CONTEXT` is resolved by `BANDIT-048`.
`BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY` is resolved by
`BANDIT-049`.
`BANDIT-GAP-COCKPIT-STATUS-INTERSTITIAL-RECOVERY` is resolved by `BANDIT-050`.
`BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` is active as `BANDIT-051`.
`BANDIT-GAP-EVENT-DRIVEN-WAKE-SCHEDULER` is queued behind the worktree
bootstrap contract gap.
`BANDIT-GAP-AGENT-OBSERVABILITY-TRACES` is queued behind the event-driven wake
scheduler gap. `BANDIT-GAP-STAGE-CAPABILITY-SCOPE` is queued behind the agent
observability traces gap. `BANDIT-GAP-TOKEN-COST-FAILSAFE` is queued behind
the stage capability scope gap. `BANDIT-GAP-EVIDENCE-FRESHNESS-SLOS` is queued
behind the token-cost failsafe gap.
`BANDIT-032` - Cockpit Status Coverage Hardening is landed and closed out.
`BANDIT-035` - Artifact Create Landing Work Item Field is landed and closed out.
`BANDIT-036` - Structured Retrospective Mining is landed and closed out.
`BANDIT-037` - Workflow Trial Decision Guardrails is landed and closed out.
`BANDIT-038` - Skill Lifecycle Contract is landed and closed out.
`BANDIT-039` - Agent Evaluation Harness is landed and closed out.
`BANDIT-040` - Input Quarantine Gate is landed and closed out.
`BANDIT-041` - Layered Risk Classification is landed and closed out.
`BANDIT-042` - Supply-Chain Gate is landed and closed out.
`BANDIT-043` - Coordination Event Log Authority is landed and closed out.
`BANDIT-044` - Operator Fail-Closed Boundary is landed and closed out.

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
`BANDIT-037` - Workflow Trial Decision Guardrails; `BANDIT-038` - Skill
Lifecycle Contract; `BANDIT-039` - Agent Evaluation Harness; `BANDIT-040` -
Input Quarantine Gate; `BANDIT-041` - Layered Risk Classification;
`BANDIT-042` - Supply-Chain Gate; `BANDIT-043` - Coordination Event Log
Authority; `BANDIT-044` - Operator Fail-Closed Boundary; `BANDIT-045` - CAS
Fenced Claim Authority; `BANDIT-046` - Git Mutation Serializer; `BANDIT-047` -
Bootstrap Model-Family Separation; `BANDIT-048` - Focused Session Context
Packets.

**Expected next deliverable:** Stage 4 review evidence for `BANDIT-051`
covering the Worktree Bootstrap Contract validation/refusal implementation,
without starting scheduler execution, full worktree lifecycle implementation,
claim lease creation or release, cockpit UI/server/API work, PR/CI workflow,
automatic merge/push/deploy behavior, product UAT scope,
or unrelated Phase 8 work.

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
- `BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT` is resolved by `BANDIT-038` from the
  2026-05-26 strategic review: load-bearing skills now need a
  first-class lifecycle contract with owner, version, changelog, intended
  stages, required tools, forbidden actions, evaluation packets, and rollback
  criteria before they become required stage policy or benchmark variants.
  Stage 1 brief evidence is recorded in `docs/work/BANDIT-038/brief.md`,
  Stage 2 RED evidence is recorded in `docs/work/BANDIT-038/red-evidence.md`,
  and Stage 3 implementation evidence is recorded in
  `docs/work/BANDIT-038/implementation-evidence.md`. Stage 4 CodeRabbit pass
  evidence, Local Qwen pass evidence, aggregate review evidence, and Stage 5
  landing verdict evidence, local-record landing action evidence, Stage 6
  retrospective closeout, and gap-ledger disposition are recorded in
  `docs/work/BANDIT-038/` and `.bandit/bootstrap-gaps.json`.
- `BANDIT-GAP-AGENT-EVALUATION-HARNESS` is resolved by `BANDIT-039` from the
  2026-05-26 strategic review: Bandit now has a replay-only harness contract
  that replays fixed packets against agents, reviewer profiles, skills, models,
  or load-bearing component variants without automatic live-routing or policy
  changes. Stage 1 brief evidence is recorded in
  `docs/work/BANDIT-039/brief.md`, Stage 2 RED evidence is recorded in
  `docs/work/BANDIT-039/red-evidence.md`, Stage 3 implementation evidence is
  recorded in `docs/work/BANDIT-039/implementation-evidence.md`, Stage 4 pre-PR
  CodeRabbit pass evidence, Local Qwen pass evidence, and aggregate review
  evidence are recorded in `docs/work/BANDIT-039/`, Stage 5 landing verdict
  evidence is recorded in `docs/work/BANDIT-039/landing-verdict.md` with final
  verdict `safe-to-land`, local-record landing action evidence is recorded in
  `docs/work/BANDIT-039/landing-action.md`, and Stage 6 retrospective closeout
  and bootstrap-gap disposition are recorded in
  `docs/work/BANDIT-039/retrospective.md` and `.bandit/bootstrap-gaps.json`.
  Future model, reviewer, skill, or component comparison evidence should use
  the replay-only Agent Evaluation Harness contract and holdout-backed evidence
  before it is treated as policy input.
- `BANDIT-GAP-INPUT-QUARANTINE-GATE` is resolved by `BANDIT-040` from the
  2026-05-26 strategic review: Bandit now has a repo-native Input Quarantine
  Gate policy, input quarantine and Trusted Source Gate templates, source-class
  validation, Data-Only External Input handling checks, quarantine boundary
  evidence checks, bounded Trusted Source Gate metadata validation, Trusted
  Local Repo Mode limits, `bandit input-quarantine validate [--json]`, and
  `bandit validate` integration. Stage 1 through Stage 6 evidence is recorded
  in `docs/work/BANDIT-040/`, and `.bandit/bootstrap-gaps.json` marks the gap
  resolved.
- `BANDIT-GAP-LAYERED-RISK-CLASSIFICATION` is resolved by `BANDIT-041` from the
  2026-05-26 strategic review: Bandit now treats smell-list-only review-depth
  and auto-landing decisions as too brittle. Auto-landing and review depth need
  a layered gate with hard never-auto-landable exclusions, blast-radius signals,
  static-analysis signals, source trust and input-quarantine state,
  supply-chain state, smell-trigger inputs, selected review depth,
  operator-supervision routing, and validation that any single high-risk signal
  can block auto-landing without smell-list concurrence. Stage 1 brief evidence
  is recorded in `docs/work/BANDIT-041/brief.md`, Stage 2 RED evidence is
  recorded in `docs/work/BANDIT-041/red-evidence.md`, Stage 3 implementation
  evidence is recorded in `docs/work/BANDIT-041/implementation-evidence.md`,
  Stage 4 review evidence is recorded in `docs/work/BANDIT-041/review-evidence.md`,
  Stage 5 landing verdict, local-record landing action, Stage 6 retrospective
  closeout, and bootstrap-gap disposition are recorded in
  `docs/work/BANDIT-041/` and `.bandit/bootstrap-gaps.json`.
- `BANDIT-GAP-SUPPLY-CHAIN-GATE` is resolved by `BANDIT-042` from the
  2026-05-26 strategic review: Bandit now has Stage 1 brief, Stage 2 RED,
  Stage 3 implementation evidence, Stage 4 review evidence, Stage 5 landing
  verdict, explicit layered risk-classification and supply-chain gate landing
  repair evidence, local-record landing action evidence, Stage 6 retrospective
  closeout, and gap-ledger disposition for a CLI-owned gate that records
  dependency, lockfile, package-manager script, CI/release workflow,
  agent-skill, fetched-prompt, external tool-install, executable generated
  content, and unknown supply-chain surface evidence before auto-landing.
- `BANDIT-GAP-COORDINATION-EVENT-LOG-AUTHORITY` is resolved by `BANDIT-043`
  from the 2026-05-26 strategic review: Bandit now has Stage 1 brief, Stage 2
  RED, Stage 3 implementation evidence, Stage 4 review evidence, Stage 5
  landing verdict, explicit layered risk-classification and supply-chain gate
  landing repair evidence, local-record landing action evidence, Stage 6
  retrospective closeout, and gap-ledger disposition for a CLI-owned
  Coordination Event Log Authority contract that keeps append-only
  workflow/event history canonical and current-state views, registries, state
  indexes, cockpit status, SQLite caches, and derived reports as rebuildable
  projections except for the future-scoped CAS claim-authority exception.
- `BANDIT-GAP-OPERATOR-FAIL-CLOSED-BOUNDARY` is resolved by `BANDIT-044` from
  the 2026-05-26 strategic review: PRD-002 now reserves operator-blocking
  fail-closed behavior for safety, product, UAT, policy, business, cost,
  irreversible-risk, and genuinely ambiguous scope gates. Derivable operational
  drift such as missing metadata, malformed supported artifacts, projection
  mismatch, ledger drift, or workflow bookkeeping drift routes to CLI-owned
  mechanical repair with approved source artifacts, expected-current-state
  checks, immutable evidence, and post-repair validation. Stage 1 through Stage
  6 evidence is recorded in `docs/work/BANDIT-044/`, explicit layered
  risk-classification and supply-chain gate evidence is registered in
  `.bandit/policy/`, and `.bandit/bootstrap-gaps.json` marks the gap resolved.
- `BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY` is resolved by `BANDIT-045` from the
  2026-05-26 strategic review: PRD-002 now blocks true parallel writable
  workstreams until Bandit has CAS-backed claim authority, fencing-token
  enforcement, stale-agent rejection, idempotency keys for claim operations and
  external side effects, Work-Surface Wait-For Graph cycle detection, and
  declared Claim Safety Invariants backed by deterministic fault-injecting or
  property-style simulation, not example-only duplicate-claim tests. The
  2026-05-27 accepted backend decision requires the first Claim Authority
  Primitive to use `refs/bandit/*` and `git update-ref --stdin` compare-and-swap
  transactions, with `.bandit` claim files as projections rather than lock
  authority. Stage 1 spec, brief evidence, and Stage 2 RED evidence are
  recorded in `docs/specs/BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY.json`,
  `docs/work/BANDIT-045/brief.md`, `docs/work/BANDIT-045/red-evidence.md`,
  `docs/work/BANDIT-045/implementation-evidence.md`,
  `docs/work/BANDIT-045/coderabbit-review.md`,
  `docs/work/BANDIT-045/local-qwen-review.md`,
  `docs/work/BANDIT-045/qwen-finding-disposition.md`,
  `docs/work/BANDIT-045/review-evidence.md`,
  `docs/work/BANDIT-045/landing-verdict.md`,
  `docs/work/BANDIT-045/landing-action.md`, and
  `docs/work/BANDIT-045/retrospective.md`; `.bandit/bootstrap-gaps.json`
  marks the gap resolved.
- `BANDIT-GAP-GIT-MUTATION-SERIALIZER` is resolved by `BANDIT-046` from the
  2026-05-26 strategic review plus 2026-05-27 operator decision: Git refs CAS
  provides claim authority, but shared `.git` worktree and repository plumbing
  mutations still require a CLI-owned Git Mutation Serializer before parallel
  worktrees are release-authorized. Codex PM owns Git mechanics when repo
  evidence is sufficient; claim-owned worktrees are now required to be
  `git worktree lock`ed immediately with a stable reason naming claim ID, Work
  Item ID, and stage, and unlocked only by Repo PM Coordinator cleanup after
  handoff verification. Its Stage 1 spec and brief are recorded in
  `docs/specs/BANDIT-GAP-GIT-MUTATION-SERIALIZER.json` and
  `docs/work/BANDIT-046/brief.md`; Stage 2 RED evidence, Stage 3
  implementation evidence, Stage 4 review evidence, Stage 5 landing verdict,
  local-record landing action evidence, Stage 6 retrospective closeout, and
  bootstrap-gap disposition are recorded in `docs/work/BANDIT-046/` and
  `.bandit/bootstrap-gaps.json`.
- `BANDIT-GAP-FOCUSED-SESSION-CONTEXT` is resolved by `BANDIT-048`:
  `bandit session-context current --json|--markdown` now emits a
  CLI-derived, non-canonical Focused Session Context Packet with current phase,
  active work item and gap, current stage, exact next action, operator-input
  status, blocker state, allowed and forbidden actions, required evidence paths,
  source hierarchy, and deep-read pointers while preserving repo artifacts as
  authority. Stage 6 closeout and gap disposition are recorded in
  `docs/work/BANDIT-048/retrospective.md` and `.bandit/bootstrap-gaps.json`.
- `BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY` is resolved by
  `BANDIT-049`: `bandit session-context current --json` now recovers the valid
  interstitial state after a work item is closed and before the next work item
  exists, reporting the last closed work item, next queued bootstrap gap, exact
  next action, operator-input status, blockers, source hierarchy, and deep-read
  pointers without inventing active work or making the packet canonical.
- `BANDIT-GAP-COCKPIT-STATUS-INTERSTITIAL-RECOVERY` is resolved by
  `BANDIT-050`: `bandit cockpit status --json` now recovers the valid
  interstitial state after a work item is closed and before the next work item
  exists, reporting last closed work, next queued bootstrap gap, exact next
  action, operator-input status, blockers, gate status, source hierarchy, and
  bootstrap gaps without inventing active work or making cockpit status
  canonical.
- `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` is active as `BANDIT-051` from the
  2026-05-26 strategic review plus 2026-05-27 technical delegation decision:
  Codex PM owns routine technical questions, and every Bandit-created worktree
  now requires a repo-native Worktree Bootstrap Contract before worker execution
  treats it as runnable. The contract must cover allowed copied or linked files,
  setup commands, validation command, environment-variable references,
  secret-handling boundary, expected runtime dependencies, and bootstrap failure
  evidence. Secret material is not copied by default unless existing
  operator-supervised policy explicitly authorizes a narrower exception. Stage
  1 brief evidence is recorded in `docs/work/BANDIT-051/brief.md`, Stage 2
  RED evidence is recorded in `docs/work/BANDIT-051/red-evidence.md`, and Stage
  3 implementation evidence is recorded in
  `docs/work/BANDIT-051/implementation-evidence.md`; the next action is Stage 4
  review gates.
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
- Before ending any Bandit work session, update root `STATUS.md` if the current
  work item, current status, next action, required operator input, or last-five
  recent items changed. Keep `STATUS.md` concise; it is not a complete project
  history.
- Keep `ROADMAP.md` concise: current work, next work, planned work, and
  completed work with short descriptions only. Label current, next, and planned
  entries as `[Gap]` or `[Slice]` so bootstrap-gap repairs remain visually
  distinct from original PRD slices. If bootstrap gaps block PRD/product work,
  separate blocking gaps from deferred slices so deferred product work remains
  visible without adding detailed history. Do not copy work-item evidence or
  retrospective history into the roadmap.
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

1. Record `BANDIT-051` layered risk-classification and supply-chain gate
   evidence, then write the Stage 5 landing verdict and run
   `npm run bandit -- land-check BANDIT-051` for
   `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT`. Stage 1 brief evidence, Stage 2
   RED evidence, Stage 3 implementation evidence, CodeRabbit pass evidence,
   Local Qwen non-blocking evidence, Codex PM finding disposition, and aggregate
   Stage 4 review evidence are recorded in `docs/work/BANDIT-051/`, and the gap
   ledger marks the gap active.
2. Keep local server/API mode, state-index persistence, scheduler execution,
   worktree lifecycle, automatic merge/push/deploy behavior, product UAT,
   actor identity policy, claim leases, work surface reservations, PR/CI
   workflow, and unrelated feature work out of scope unless explicitly
   authorized by a future work item.
3. Keep unrelated Phase 8 work blocked while any open bootstrap gap remains
   queued or active. `BANDIT-GAP-WORKFLOW-TRIAL-DECISION-GUARDRAILS` is
   resolved by `BANDIT-037`. `BANDIT-GAP-SKILL-LIFECYCLE-CONTRACT` is resolved
   by `BANDIT-038`. `BANDIT-GAP-AGENT-EVALUATION-HARNESS` is resolved by
   `BANDIT-039`. `BANDIT-GAP-INPUT-QUARANTINE-GATE` is resolved by
   `BANDIT-040`. `BANDIT-GAP-LAYERED-RISK-CLASSIFICATION` is resolved by
   `BANDIT-041`. `BANDIT-GAP-SUPPLY-CHAIN-GATE` is resolved by `BANDIT-042`.
   `BANDIT-GAP-COORDINATION-EVENT-LOG-AUTHORITY` is resolved by `BANDIT-043`.
   `BANDIT-GAP-OPERATOR-FAIL-CLOSED-BOUNDARY` is resolved by `BANDIT-044`.
   `BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY` is resolved by `BANDIT-045`.
   `BANDIT-GAP-GIT-MUTATION-SERIALIZER` is resolved by `BANDIT-046`.
   `BANDIT-GAP-BOOTSTRAP-MODEL-FAMILY-SEPARATION` is resolved by `BANDIT-047`.
   `BANDIT-GAP-FOCUSED-SESSION-CONTEXT` is resolved by `BANDIT-048`.
   `BANDIT-GAP-SESSION-CONTEXT-INTERSTITIAL-RECOVERY` is resolved by
   `BANDIT-049`. `BANDIT-GAP-COCKPIT-STATUS-INTERSTITIAL-RECOVERY` is resolved
   by `BANDIT-050`. `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT` is active as
   `BANDIT-051`, and
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

No operator-owned input is required for the next recorded action. `BANDIT-051`
has Stage 1 brief evidence, Stage 2 RED evidence, Stage 3 implementation
evidence, CodeRabbit pass evidence, Local Qwen non-blocking evidence, Codex PM
finding disposition, and aggregate Stage 4 review evidence for
`BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT`; the next action is Stage 5 landing
verdict preparation and `land-check`. This is routine technical routing, not an
operator-owned product, UAT, policy, business, cost, or scope decision unless
the landing verdict would expand beyond the recorded Worktree Bootstrap
Contract gap.
`BANDIT-044` resolved the operator fail-closed boundary: operator-blocking
fail-closed behavior is reserved for safety, product, UAT, policy, business,
cost, irreversible-risk, and genuinely ambiguous scope gates, while derivable
operational drift should route to
CLI-owned mechanical repair with approved source artifacts,
expected-current-state checks, and immutable transition history. Halt only if
the next step would change product direction, UAT policy, workflow policy beyond
the queued gap scope, business tradeoffs, cost/risk posture, external service
setup, paid reviewer routing, live routing, scheduler authority,
claim/worktree authority, installed global skill contents, merge/push/deploy
authority, or broader workflow scope.

If the next step would expand beyond the recorded PRD/design-review scope,
choose local server/API mode, choose state-index persistence timing, require
product UAT, change policy, approve cost/risk, enable PR/merge/push/deploy
authority, select an external service, or resolve genuinely ambiguous scope,
halt and ask for that input directly.

Actual product UAT approval for future feature slices remains operator-owned
and must not be inferred by Codex PM or implementation agents.
