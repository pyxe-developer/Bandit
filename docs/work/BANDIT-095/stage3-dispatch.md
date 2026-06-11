# BANDIT-095 Stage 3 Implementation Dispatch

contract_version: 1
work_item: BANDIT-095
stage: Stage 3 implementation
dispatcher: work_item_pm
created_at: 2026-06-11T11:18:30Z
route: claude-sonnet-4-6

## Role

You are the Stage 3 Implementation Writer for `BANDIT-095`. Implement the
smallest source change needed to satisfy the recorded RED tests and approved
brief. You own source/chore delivery and implementation evidence only.

## Required Reads

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-095/brief.md`
- `docs/work/BANDIT-095/orchestration-plan.md`
- `docs/work/BANDIT-095/red-evidence.md`
- `docs/work/BANDIT-095/coordination-log.jsonl`
- `src/state/roadmap-work-targets.ts`
- `src/state/work-create-controller.ts`
- `test/work-create-controller.test.mjs`
- `test/roadmap-work-targets.test.mjs`

## Task

Repair Repo PM create-controller target selection so a valid closed current
work item retained as a derived-status anchor can route to the authorized next
unformed roadmap/current-context target.

The RED tests currently fail because:

- `roadmap-work-targets resolve --json` returns `BANDIT-094` when ROADMAP.md
  has `BANDIT-094` as `Stage 6: closed; retained as the derived-status anchor`
  and also has a `TBD` PRD-005.3 next work item.
- `repo-pm create-controller --json` then refuses with
  `Current work item BANDIT-094 is not formation_approved`.
- When closed-anchor evidence is incomplete, the create controller should fail
  closed with a diagnostic naming the closed current work item and missing
  slice-boundary evidence such as `landing-action.md`.

## Acceptance Criteria

- Closed-anchor current work plus authorized next unformed target resolves to
  the next target.
- Closed-anchor routing is allowed only when the retained current Work Item has
  complete slice-boundary evidence:
  - `docs/work/<ID>/landing-action.md`
  - `docs/work/<ID>/retrospective.md`
  - `docs/work/<ID>/improvement-disposition.md`
  - latest coordination transition `closed`
- Incomplete closed-anchor evidence fails closed before creating the next work
  item and names the missing evidence.
- Active or formation-approved current Work Items preserve current idempotency.
- Unclosed, stale, or contradictory current Work Items cannot silently route to
  the next target.
- Existing creation safety remains intact for explicit source specs,
  operator-owned input, authorized Local Qwen route, duplicate allocation, and
  no Stage 2 artifact creation.
- Work Intake Ledger, PRDs, specs, prompt contracts, cockpit status, and
  session-context packets remain provenance/projection surfaces, not priority
  authority.

## Forbidden Actions

Do not edit tests, test helpers, fixtures, RED evidence, acceptance mappings,
formation evidence, review evidence, landing evidence, UAT evidence,
retrospective evidence, roadmap/current-context/status routing, bootstrap-gap
ledger, package scripts, dependencies, lockfiles, CI/release workflow, PRD-005.3
execute-controller behavior, route registry, role input packet assembly,
provider/blocker recorder, PRD-005.4 adapters, Trust Verifier cutover, old-gate
replacement or wrapping, cockpit action execution, local API, State Index,
hosted services, telemetry, merge, push, deploy, or unrelated Phase 8 work.

If a test is ambiguous or appears wrong, stop and report the ambiguity in your
writer report instead of changing any test surface.

## Required Output

Create:

- `docs/work/BANDIT-095/writer-report.md`
- `docs/work/BANDIT-095/implementation-evidence.md`

The report/evidence must include:

- files changed
- implementation summary
- acceptance mapping
- clean-code self-check
- test commands and results
- confirmation that no tests, test helpers, fixtures, RED evidence, or
  acceptance mappings were edited by Stage 3
- confirmation that Stage 3 was authored by Claude after Codex-authored RED

## Verification Commands

Run at minimum:

```sh
node --test test/work-create-controller.test.mjs
node --test test/roadmap-work-targets.test.mjs
node --test test/role-entrypoints-formation.test.mjs
npm run typecheck
```

Run broader tests if your source changes touch shared validation, formation,
coordination, cockpit/session-context, policy, or CLI routing beyond the
focused create-controller/resolver behavior.
