# Current Context

## Status

**Phase:** 4 - Review And Landing Gates.

**State:** `BANDIT-007` has landed as final implementation source head
`6375436e6be76415bdd9b6493f0f79fd997a1c81`. `docs/work/BANDIT-007/landing-action.md`
records the concrete landing action; `coderabbit-review.md` records the live
CodeRabbit polling bootstrap gap; `local-qwen-review.md` records the local Qwen
timeout bootstrap gap; `review-evidence.md`, `landing-verdict.md`, and
`retrospective.md` record closeout evidence and dispositions.

**Last completed milestone:** `BANDIT-007` delivered the first Phase 4
repo-native CodeRabbit state capture gate substrate.

**Current next action:** Create the next Phase 4 bootstrap work item for the
escalated adversarial reviewer placeholder. Do not create the next slice brief,
RED evidence, implementation branch, or active-work context until the
`BANDIT-007` closeout commit containing `landing-action.md`, `retrospective.md`,
and roadmap context has landed.

## Active Work

**Active work item:** none.

**Completed work items:** `BANDIT-001` - Repo-Native State And CLI Skeleton;
`BANDIT-002` - Work Artifact Templates And Validation; `BANDIT-003` -
PRD-To-Work Draft Command; `BANDIT-004` - Routing Decision And Smell Trigger
Catalog; `BANDIT-005` - Pre-Landing Review Loop; `BANDIT-006` - Local Qwen
Baseline Reviewer Gate; `BANDIT-007` - CodeRabbit State Capture.

**Expected next deliverable:** the next narrow Phase 4 review gate gap:

- create a `BANDIT-008` brief for the escalated adversarial reviewer
  placeholder only after confirming `BANDIT-007` is landed;
- define the smallest repo-native evidence contract needed to represent
  escalated review policy and unavailable reviewer behavior;
- add RED evidence before production implementation;
- preserve manager-owned routing and smell-trigger policy boundaries;
- do not broaden into final Landing Agent behavior, UAT artifacts, PR merge
  automation, live paid-model routing, workflow cockpit, or SQLite indexing.

BANDIT-004 landed as commit `a0b679217c93c3aeda6646806201d181cd26404c`.
`docs/work/BANDIT-004/landing-action.md` records the concrete landing action;
`landing-verdict.md` records the safe-to-land verdict and landing evidence;
`review-evidence.md` and `retrospective.md` record review gaps, bootstrap gaps,
and improvement dispositions. BANDIT-005 landed as commit
`17be6d6775f5c8f00b5130f5569c79f97a94751b`. `docs/work/BANDIT-005/brief.md`,
`red-evidence.md`, `implementation-evidence.md`, `review-evidence.md`,
`landing-verdict.md`, `landing-action.md`, and `retrospective.md` record the
complete slice evidence. BANDIT-006 landed as final implementation source head
`61279b0ffc9bade9e4eda1ee0b59e1874283a01b`; `docs/work/BANDIT-006/brief.md`,
`red-evidence.md`, `implementation-evidence.md`, `local-qwen-review.md`,
`review-evidence.md`, `landing-verdict.md`, `landing-action.md`, and
`retrospective.md` record the complete slice evidence. BANDIT-007 landed as
final implementation source head `6375436e6be76415bdd9b6493f0f79fd997a1c81`;
`brief.md`, `red-evidence.md`, `implementation-evidence.md`,
`coderabbit-review.md`, `local-qwen-review.md`, `review-evidence.md`,
`landing-verdict.md`, `landing-action.md`, and `retrospective.md` record the
complete slice evidence.

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- No Bandit work-item creation command.
- CodeRabbit state capture substrate exists, but live CodeRabbit API, GitHub
  API, PR comment polling, repair orchestration, and rerun automation remain
  unavailable.
- Local Qwen gate substrate exists, but the live local 35B Qwen review timed
  out during `BANDIT-006` and `BANDIT-007`; timeout behavior is recorded as an
  explicit bootstrap gap, not as a pass.
- No escalated adversarial review gate. This is the next Phase 4 gap.
- No Landing Agent.
- No general artifact creation command outside explicit PRD draft-work.
- No UAT artifact.
- No heartbeat chore-agent.
- No cockpit.

Bootstrap work must record these gaps honestly instead of pretending final
gates ran.

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

BANDIT-008 escalated adversarial reviewer placeholder.

BANDIT-005 started Phase 4 by adding pre-landing review evidence, landing
verdict contracts, source-drift checks, validation, and
`bandit land-check <work-item-id>`. BANDIT-006 added the local Qwen baseline
reviewer profile/evidence/command substrate and recorded live runtime timeout
as a bootstrap gap. BANDIT-007 added the CodeRabbit review evidence
template/parser/command substrate and `land-check` integration, while recording
live CodeRabbit polling as a bootstrap gap.

The next step is to create the next bootstrap work item brief for the
escalated adversarial reviewer placeholder after confirming the `BANDIT-007`
landing action and closeout artifacts are committed. Start by reading
`CLEAN_CODE.md` and `docs/verification/STAGE_RUBRICS.md`; shape the brief so
Stage 1, Stage 2, Stage 3, and Stage 4 evidence can be evaluated.

Keep `BANDIT-008` narrow. It should not build final Landing Agent behavior,
UAT artifacts, PR merge automation, workflow cockpit, SQLite indexing,
automated review repair, live CodeRabbit/GitHub polling, or paid-model reviewer
routing beyond a recorded placeholder policy and bootstrap-gap behavior.

## Required Operator Input

None before creating the `BANDIT-008` brief. Repo artifacts already define the
next technical routing decision: Phase 4 still lacks the escalated adversarial
reviewer placeholder, and Codex PM owns routine reviewer routing from policy
and smell-trigger evidence.
