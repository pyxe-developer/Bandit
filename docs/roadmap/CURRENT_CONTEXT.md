# Current Context

## Status

**Phase:** 5 - UAT And Auto-Landing.

**State:** `BANDIT-015` is active as the bootstrap-gap chore for
`BANDIT-GAP-LIVE-CODERABBIT`. Its brief, RED evidence, implementation
evidence, CodeRabbit evidence, review evidence, and local Qwen evidence are
recorded. Local Qwen completed with a `non_blocking` finding about
fail-closed refusal paths not always writing actionable repo-native evidence
before throwing. Codex PM triaged and repaired the valid missing-PR-context
evidence path; source changed after the existing review artifacts.

**Last completed milestone:** `BANDIT-014` converted the Landing Agent
bootstrap gap into a repo-native contract, validation path, and local-record
landing command.

**Current next action:** Refresh `BANDIT-015` CodeRabbit and aggregate review
evidence at the repair head, then rerun `npm run bandit -- qwen-review
BANDIT-015`. Because source changed after the prior review artifacts, do not
write the escalated-review disposition, landing verdict, landing action,
retrospective, gap-ledger disposition, or final context updates until required
review evidence is current and local Qwen passes or records an explicit
bootstrap gap. Do not begin another bootstrap-gap chore, Phase 6, Phase 7,
feature work, or broader cockpit work until `BANDIT-015` has landing action
evidence, retrospective closeout, and a resolved, operator-blocked, or
no-action gap-ledger disposition.

## Active Work

**Active work item:** `BANDIT-015` - Live CodeRabbit Pre-Landing Loop.

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
Bootstrap Gap Resolution.

**Expected next deliverable:** Current repair-head CodeRabbit/review evidence
for `BANDIT-015`, followed by a rerun local Qwen review, escalated-review
disposition, landing verdict, landing action, retrospective, and gap-ledger
disposition.

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- No Bandit work-item creation command.
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
- No general artifact creation command outside explicit PRD draft-work.
- CLI-owned UAT approval artifacts and stale-UAT detection are implemented and
  landed in `BANDIT-012`.
- No heartbeat chore-agent.
- No cockpit.

Bootstrap work must record these gaps honestly instead of pretending final
gates ran. Open bootstrap gaps are the current work queue; do not start
unrelated Phase 6, Phase 7, feature, or cockpit work while any open gap remains
queued or active. `BANDIT-GAP-LIVE-CODERABBIT` is active as `BANDIT-015`;
implementation evidence, CodeRabbit evidence, review evidence, and local Qwen
evidence are recorded. The local Qwen finding repair is recorded in
`docs/work/BANDIT-015/qwen-finding-repair.md`; review evidence must be
refreshed at the repair head before closeout continues.

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

1. `BANDIT-GAP-LIVE-CODERABBIT` - active as `BANDIT-015`; repair-head CodeRabbit/review evidence refresh, local Qwen rerun, and remaining landing-gate closeout next.
2. `BANDIT-GAP-LIVE-ESCALATED-REVIEWER`.
3. `BANDIT-GAP-WORK-ITEM-CREATE-COMMAND`.
4. `BANDIT-GAP-GENERAL-ARTIFACT-CREATE-COMMAND`.
5. `BANDIT-GAP-HEARTBEAT-CHORE-AGENT`.
6. `BANDIT-GAP-WORKFLOW-COCKPIT`.

Create exactly one next gap chore at a time. Do not create any gap chore after
`BANDIT-015` until it has landing action evidence, retrospective closeout, and
a resolved, operator-blocked, or no-action ledger disposition.

## Required Operator Input

None recorded for the next routing step. Repo artifacts define the `BANDIT-015`
review and landing-gate closeout sequence as the next action.

Actual product UAT approval for future feature slices remains operator-owned
and must not be inferred by Codex PM or implementation agents.
