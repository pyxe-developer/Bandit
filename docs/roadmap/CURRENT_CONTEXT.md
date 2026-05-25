# Current Context

## Status

**Phase:** 5 - UAT And Auto-Landing.

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
findings ahead of the workflow-cockpit gap on 2026-05-25. `BANDIT-023` is now
the active bootstrap-gap improvement chore for
`BANDIT-GAP-NONBLOCKING-REVIEW-FINDING-ROUTING`. Its structured creation spec
is recorded in
`docs/specs/BANDIT-GAP-NONBLOCKING-REVIEW-FINDING-ROUTING.json`, its brief is
recorded in `docs/work/BANDIT-023/brief.md`, and
`.bandit/bootstrap-gaps.json` links the gap to `BANDIT-023` as the active
chore. This chore captures the policy that non-blocking review findings should
be routed to durable chores or explicit no-action decisions instead of
recursively delaying landing after required gates accept the implementation.

**Last completed milestone:** `BANDIT-022` resolved the heartbeat chore-agent
bootstrap gap and landed with local-record landing evidence.

**Current next action:** Create RED evidence for `BANDIT-023` and execute the
non-blocking review finding routing chore through the normal bootstrap
workflow. Do not broaden into
Phase 6 Coordination Primitive, Phase 7 Improvement Engine, Phase 8 Workflow
Cockpit, Phase 9 dogfood, feature work, automatic merge/push/deploy behavior,
or product UAT approval before `BANDIT-023` lands and the workflow-cockpit gap
is explicitly scoped or dispositioned.

## Active Work

**Active work item:** `BANDIT-023` - Non-Blocking Review Finding Chore Routing.

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
Create Command; `BANDIT-022` - Heartbeat Chore Agent Contract.

**Expected next deliverable:** `BANDIT-023` RED evidence that maps the chore
acceptance criteria to failing or explicitly planned tests before
implementation begins.

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- The missing Bandit work-item creation command is resolved by `BANDIT-020`.
  Future one-off work-item starts should use
  `bandit work-item create <spec-path>` when not decomposing a Feature PRD
  through `draft-work`.
- Bootstrap-gap tracking artifact, listing command, and validation path are
  implemented and landed in `BANDIT-011`.
- CodeRabbit state capture substrate exists, but live CodeRabbit API, GitHub
  API, PR comment polling, repair orchestration, and rerun automation remain
  unavailable.
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
- `BANDIT-GAP-NONBLOCKING-REVIEW-FINDING-ROUTING` is active in `BANDIT-023`;
  its brief is recorded and RED evidence is next.
- No cockpit.

Bootstrap work must record these gaps honestly instead of pretending final
gates ran. Open bootstrap gaps are the current work queue; do not start
Phase 6 Coordination Primitive, Phase 7 Improvement Engine, Phase 8 Workflow
Cockpit, Phase 9 dogfood, feature, or cockpit work while any open gap remains
queued or active. `BANDIT-GAP-WORK-ITEM-CREATE-COMMAND` is resolved by
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

Phase 5 UAT and auto-landing boundary.

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

Use `bandit gaps list` as the routing source and complete exactly one
bootstrap-gap chore at a time. Current priority is:

1. Create RED evidence for `BANDIT-023`, then complete the
   `BANDIT-GAP-NONBLOCKING-REVIEW-FINDING-ROUTING` chore through review,
   landing, retrospective, and gap-ledger disposition.
2. Return to `BANDIT-GAP-WORKFLOW-COCKPIT` only after `BANDIT-023` lands or is
   explicitly blocked/dispositioned.

`BANDIT-021` resolved the general artifact creation command gap and is closed
out. Future Stage 4 review evidence must use `review_subject_hash` to avoid
raw-HEAD evidence loops.

## Required Operator Input

No operator-owned input is required before creating RED evidence for
`BANDIT-023`. The operator policy direction is provided: non-blocking
future-hardening findings should move to chores or no-action dispositions and
landing should proceed when required gates accept the implementation. If a
future implementation would change which findings count as blockers, halt and
ask for explicit policy input.

Actual product UAT approval for future feature slices remains operator-owned
and must not be inferred by Codex PM or implementation agents.
