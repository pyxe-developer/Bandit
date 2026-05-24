# Current Context

## Status

**Phase:** 4 - Review And Landing Gates.

**State:** `BANDIT-009` is active for Stage 2 RED evidence. `BANDIT-008`
landed as final implementation source head
`9edab178bad9c9cafa9e939f724b86faec261e35`. `docs/work/BANDIT-008/landing-action.md`
records the concrete landing action; `local-qwen-review.md` records the
Mastra Code/oMLX full-packet inconclusive bootstrap gap; `review-evidence.md`,
`landing-verdict.md`, and `retrospective.md` record closeout evidence and
dispositions.

**Last completed milestone:** `BANDIT-008` repaired the local Qwen baseline
reviewer runtime route from Qwen Code/Ollama drift to repo-configured Mastra
Code/oMLX.

**Current next action:** Add RED evidence for `BANDIT-009` local Qwen
full-packet reliability before production implementation. Do not proceed to
the escalated adversarial reviewer placeholder while the baseline local
reviewer still returns inconclusive output for real Bandit review packets.

## Active Work

**Active work item:** `BANDIT-009` - Local Qwen Full-Packet Reliability.

**Completed work items:** `BANDIT-001` - Repo-Native State And CLI Skeleton;
`BANDIT-002` - Work Artifact Templates And Validation; `BANDIT-003` -
PRD-To-Work Draft Command; `BANDIT-004` - Routing Decision And Smell Trigger
Catalog; `BANDIT-005` - Pre-Landing Review Loop; `BANDIT-006` - Local Qwen
Baseline Reviewer Gate; `BANDIT-007` - CodeRabbit State Capture; `BANDIT-008`
- Local Reviewer Runtime Drift Repair.

**Expected next deliverable:** RED evidence for the narrow Phase 4
baseline-reviewer reliability gap:

- add RED evidence before production implementation;
- define the smallest change needed for `bandit qwen-review <work-item-id>` to
  return structured reviewer JSON for real Bandit packets, or prove Mastra
  Code is the wrong harness substrate while keeping oMLX as the local model
  endpoint;
- preserve the Mastra Code/oMLX source-of-truth route unless evidence proves
  the harness path must change;
- do not broaden into final Landing Agent behavior, UAT artifacts, PR merge
  automation, live paid-model routing, workflow cockpit, SQLite indexing, or
  escalated reviewer placeholder behavior.

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
complete slice evidence. BANDIT-008 landed as final implementation source head
`9edab178bad9c9cafa9e939f724b86faec261e35`; `brief.md`, `red-evidence.md`,
`implementation-evidence.md`, `local-qwen-review.md`, `review-evidence.md`,
`landing-verdict.md`, `landing-action.md`, and `retrospective.md` record the
complete repair-chore evidence.

## Known Bootstrap Gaps

These are expected because Bandit does not exist yet:

- No Bandit work-item creation command.
- CodeRabbit state capture substrate exists, but live CodeRabbit API, GitHub
  API, PR comment polling, repair orchestration, and rerun automation remain
  unavailable.
- Local Qwen gate substrate exists, and `BANDIT-008` repaired its runtime route
  to Mastra Code over the local oMLX OpenAI-compatible endpoint. Small-prompt
  smoke works, but the full review packet remains inconclusive. This is now
  the next blocking Phase 4 gap because the baseline adversarial reviewer must
  work on real packets before escalation policy is useful.
- No escalated adversarial review gate. This remains a Phase 4 gap, but it is
  queued behind local Qwen full-packet reliability.
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

BANDIT-009 local Qwen full-packet reliability.

BANDIT-005 started Phase 4 by adding pre-landing review evidence, landing
verdict contracts, source-drift checks, validation, and
`bandit land-check <work-item-id>`. BANDIT-006 added the local Qwen baseline
reviewer profile/evidence/command substrate and recorded live runtime timeout
as a bootstrap gap. BANDIT-007 added the CodeRabbit review evidence
template/parser/command substrate and `land-check` integration, while recording
live CodeRabbit polling as a bootstrap gap. BANDIT-008 repaired the local Qwen
baseline reviewer runtime route to Mastra Code/oMLX, removed hidden Qwen
Code/Ollama and Google-key dependencies from the baseline profile, added stdin
prompt transport, and tightened reviewer-output parsing. Full-packet live local
Qwen review remains inconclusive and is recorded as a bootstrap gap. Because
local Qwen is the baseline adversarial reviewer for every PR, this gap takes
priority over new escalated-review placeholder work.

The next step is to add Stage 2 RED evidence for the local Qwen full-packet
reliability repair. The `BANDIT-009` brief exists at
`docs/work/BANDIT-009/brief.md` and records `CLEAN_CODE.md` read evidence plus
Stage 1 rubric evidence. Production implementation must not start until RED
evidence is recorded.

Keep `BANDIT-009` narrow. It should diagnose and repair the full-packet local
review path, including packet sizing, output transport, Mastra Code invocation,
or an alternate harness path if evidence proves Mastra Code cannot support the
needed contract. It should not build final Landing Agent behavior, UAT
artifacts, PR merge automation, workflow cockpit, SQLite indexing, automated
review repair, live CodeRabbit/GitHub polling, paid-model reviewer routing, or
the escalated reviewer placeholder.

## Required Operator Input

None before RED evidence or implementation. Repo artifacts already define the
next technical routing decision: the baseline local Qwen reviewer reaches
Mastra Code/oMLX but fails on real review packets, and that must be repaired
or explicitly rerouted before adding escalated-review placeholder work.
