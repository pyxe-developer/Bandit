# BANDIT-084 Stage 3 Dispatch

## Metadata

- Work item: `BANDIT-084` - Claim-First Transition Policy Triage
- Dispatch owner: Codex Work Item PM
- Implementation Writer: Claude Writer `claude-sonnet-4-6`
- Repository: Bandit context root (`/Users/matthewflebbe/Bandit`)
- Created at: 2026-06-09T18:00:29Z
- Current coordination state: `red_recorded`

## Required First Reads

Read these before editing:

- `AGENTS.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/work/BANDIT-084/brief.md`
- `docs/work/BANDIT-084/orchestration-plan.md`
- `docs/work/BANDIT-084/red-evidence.md`
- `docs/work/BANDIT-084/coordination-log.jsonl`
- `.bandit/work-intake-ledger.json`
- `FOLLOWUPS.md`
- `docs/decisions/2026-05-27-git-refs-claim-authority-backend.md`
- `.bandit/policy/claim-authority.json`
- `.bandit/claims/README.md`
- `docs/templates/claim-authority.md`
- Recent landed coordination logs for evidence:
  - `docs/work/BANDIT-083/coordination-log.jsonl`
  - `docs/work/BANDIT-082/coordination-log.jsonl`
  - `docs/work/BANDIT-081/coordination-log.jsonl`

## Mission

Produce the bounded Stage 3 triage delivery for `BANDIT-084`.

This work item is triage only. Your delivery must record a policy
recommendation, follow-up scope, explicit no-action decision, or deferred
disposition for the claim-first transition proposal. Do not approve universal
claim-first policy, change claim authority, create claims, release claims,
reconcile claims, create worktrees, start scheduler behavior, change merge,
push, deploy, paid routing, hosted services, public benchmark publication, or
unrelated Phase 8 product work.

## Editable Paths

You may create or edit only:

- `docs/work/BANDIT-084/claim-first-transition-disposition.md`
- `docs/work/BANDIT-084/writer-report.md`
- `docs/work/BANDIT-084/implementation-evidence.md`

## Required Delivery

Create `docs/work/BANDIT-084/claim-first-transition-disposition.md` with:

- source evidence reviewed;
- current policy summary;
- coordination-history findings from recent landed work-item logs;
- claim-authority findings from the accepted Git refs CAS claim-authority
  evidence;
- classification of transition contexts already covered by accountable actor
  evidence, delegated/asynchronous claim requirements, Git refs CAS claim
  authority, or append-only coordination history;
- recommendation, follow-up scope, explicit no-action decision, or deferred
  disposition;
- exact operator-owned policy gate if universal claim-first approval would be
  required;
- future implementation scope only if warranted, including narrow artifacts,
  validators, RED test targets, claim safety invariants or non-applicability
  rationale, stage capability boundaries, and non-goals.

Create `docs/work/BANDIT-084/writer-report.md` with:

- files created or changed;
- evidence sources read;
- delivery summary;
- verification commands run and results;
- explicit statement that Test Ownership Boundary was preserved;
- explicit statement that Claude Writer authored Stage 3 through the Process
  Adapter path;
- clean-code self-check against `CLEAN_CODE.md`;
- remaining gaps, if any.

Create `docs/work/BANDIT-084/implementation-evidence.md` with:

- Stage 3 status;
- summary of the delivered recommendation/disposition;
- acceptance criteria mapping;
- verification evidence;
- clean-code compliance check;
- role-boundary evidence;
- source/delivery paths;
- next action for Stage 4 review.

## Required Verification

Run at least:

```sh
node ./bin/bandit.mjs coordination validate BANDIT-084
node ./bin/bandit.mjs work-intake validate --json
git diff --check
```

If you touch source code, tests, command routing, policy validators, claim
authority, coordination validation, operator-boundary behavior, work-intake
state, package scripts, dependencies, or lockfiles, stop: those surfaces are
outside this Stage 3 dispatch.

## Forbidden Paths And Actions

Do not edit:

- tests, test helpers, fixtures, RED evidence, or acceptance mappings;
- `docs/work/BANDIT-084/red-evidence.md`;
- formation evidence;
- review evidence;
- landing evidence;
- UAT evidence;
- retrospective or improvement-disposition evidence;
- `docs/work/BANDIT-084/coordination-log.jsonl`;
- `.bandit/work-intake-ledger.json`;
- `.bandit/bootstrap-gaps.json`;
- `.bandit/policy/claim-authority.json`;
- `.bandit/claims/**`;
- source code;
- package files or lockfiles;
- roadmap, current-context, or root status files.

Do not approve universal claim-first policy, change claim authority, create
claims, release claims, reconcile claims, create worktrees, start scheduler
behavior, execute guarded browser actions, approve Trust Verifier cutover,
merge, push, deploy, approve paid routing, approve hosted services, publish
benchmarks, or start unrelated Phase 8 work.

If completing the triage requires an operator-owned policy decision, write the
blocker in the allowed Stage 3 delivery files and stop without guessing.
