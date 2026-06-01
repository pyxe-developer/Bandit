---
work_item: BANDIT-057
stage: Stage 4 repair
assignee: claude_implementation_writer
created_at: 2026-06-01T17:00:00Z
repair_target: major finding – no-command usage text in src/cli.ts
---

# Stage 4 Major CodeRabbit Repair – Writer Report

## Finding Addressed

**Severity:** major  
**File:** `src/cli.ts`  
**Finding:** Clarify no-command usage text so explicit role entry points and legacy commands are both represented.

## Change Made

Updated the `if (!command)` branch in `src/cli.ts` (previously lines 45–53). The old message read only:

```
Role-required: bandit must be invoked with an explicit authority role.
  bandit repo-pm <create-work-item|approve-formation> [args]
  bandit work-item-pm <start> <work-item-id>
```

The new message reads:

```
Usage: bandit <command>

Role entry points:
  bandit repo-pm <create-work-item|approve-formation> [args]
  bandit work-item-pm <start> <work-item-id>

Commands:
  bandit <init|validate|list|show|draft-work|work-item|artifact|route|land-check|land|auto-land-check|agent-evaluation|agent-observability|qwen-review|review-subject-hash|coderabbit-review|escalated-review|skill-lifecycle|stage-capability-scope|heartbeat|git-mutation|improvements|input-quarantine|risk-classification|supply-chain-gate|operator-boundary|uat|gaps|coordination|coordination-authority|claim|cockpit|session-context|worktree-bootstrap|event-driven-wake-scheduler|token-cost-failsafe|evidence-freshness-slos>
```

`process.exitCode = 1` behavior is unchanged.

The Commands list was derived directly from the existing usage string at line 296 of `src/cli.ts` (the unknown-command path), ensuring both paths are consistent.

## Verification

| Command | Result |
|---|---|
| `npm run typecheck` | passed (exit 0, no output) |
| `npm run bandit -- validate` | passed – "Bandit state is valid." |
| `git diff --check` | passed (exit 0, no output) |

## Scope Compliance

- Only `src/cli.ts` was modified.
- No tests, fixtures, dependency files, lockfiles, or non-major findings were touched.
- No CodeRabbit, Local Qwen, aggregate Stage 4 review, landing, or closeout was run.
