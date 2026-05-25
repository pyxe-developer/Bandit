# BANDIT-022 RED Evidence

## Status

`pass` for Stage 2 RED evidence on 2026-05-25.

Production implementation has not started. The focused tests define the desired
heartbeat chore-agent policy and command behavior and fail because the CLI has
no heartbeat command yet.

## Test Writer Scope

Added `test/heartbeat-chore-agent.test.mjs` before any production code for
`BANDIT-022`. The tests cover the command contract from
`docs/work/BANDIT-022/brief.md`:

- inspect eligible active bootstrap-gap chores without mutating repo state;
- report due retrospective-derived improvement evaluations;
- mark feature slices requiring operator-owned UAT as ineligible;
- report operator-input blocked chores without guessing;
- refuse unsupported automation actions such as landing before touching state;
- fail closed when the heartbeat policy would allow hidden workflow authority.

The selected command surface is intentionally narrow:
`bandit heartbeat inspect --json`, with `--as-of <date>` available for
deterministic improvement-evaluation checks. Unsupported heartbeat actions must
fail closed rather than becoming an alternate Landing Agent, product-UAT path,
merge/push/deploy tool, or feature implementation runner.

## Command

```sh
node --test test/heartbeat-chore-agent.test.mjs
```

## Observed RED Output

```text
tests 6
pass 0
fail 6
```

Representative failures:

```text
Unknown command: heartbeat
Usage: bandit <init|validate|list|show|draft-work|work-item|artifact|route|land-check|land|auto-land-check|qwen-review|review-subject-hash|coderabbit-review|escalated-review|uat|gaps>

AssertionError [ERR_ASSERTION]:
1 !== 0
```

Refusal-path tests also fail for the expected RED reason: the CLI rejects the
top-level `heartbeat` command before it can validate unsupported actions or
malformed heartbeat policy.

## Acceptance Criteria Mapping

| Acceptance Criteria | RED Evidence |
|---|---|
| AC1: chore brief exists and links to the bootstrap gap | `docs/work/BANDIT-022/brief.md` exists and links `BANDIT-GAP-HEARTBEAT-CHORE-AGENT`. |
| AC2: future implementation defines a narrow heartbeat policy contract | Tests define `.bandit/policy/heartbeat-chore-agent.json` with allowed inspection/preparation actions and forbidden landing, merge, push, deploy, feature implementation, and UAT actions. |
| AC3: CLI exposes one bounded heartbeat command or family | Tests define `bandit heartbeat inspect --json` as the bounded inspection surface. |
| AC4: command refuses unsupported automation actions, feature slices requiring UAT, blocked operator input, and malformed policy | Tests cover unsupported `heartbeat land`, feature-slice UAT ineligibility, operator-input blocked gaps, and hidden-authority policy refusal. |
| AC5: focused tests cover eligible chores, ineligible chores, due improvement evaluations, blocked operator input, malformed policy, and fail-closed refusal paths | `test/heartbeat-chore-agent.test.mjs` covers all required categories. |
| AC6: heartbeat output records enough evidence for future continuation | Tests assert JSON output includes status, reason, allowed next action, required input when blocked, and evidence paths. |
| AC7: no cockpit, cross-repo coordination, paid provider routing, automatic merge/push/deploy, or feature workflow is introduced | Tests exercise only CLI-owned inspection and explicit fail-closed refusal of unsupported actions. |

## Stage-Rubric Evaluation

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 0: Context Readiness | `pass` | `CURRENT_CONTEXT.md`, `ROADMAP.md`, and `bandit gaps list` route `BANDIT-022` to RED evidence. |
| Stage 1: Work-Item Brief And Spec | `pass` | `docs/work/BANDIT-022/brief.md` defines scope, acceptance criteria, verification plan, and operator-input boundary. |
| Stage 2: Test Design And RED Evidence | `pass` | Focused tests exist and fail before production implementation because the heartbeat command is missing. |

## Next Action

Implement the narrow heartbeat chore-agent policy parser and
`bandit heartbeat inspect` command needed to make
`test/heartbeat-chore-agent.test.mjs` pass. Do not broaden into cockpit,
coordination primitives, paid reviewer routing, automatic landing, feature
implementation, merge/push/deploy behavior, or product UAT approval.
