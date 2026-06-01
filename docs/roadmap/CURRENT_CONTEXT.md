# Current Context

## Status

**Phase:** 8 - Workflow Cockpit kickoff.

`BANDIT-058` is active as the next bounded role-scoped workflow orchestration
chore for `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`. Repo PM created the
Stage 1 brief at `docs/work/BANDIT-058/brief.md` from
`docs/specs/BANDIT-GAP-ROLE-CONTRACTS-RUN-MANIFESTS.json`, linked the queued
gap as active, recorded the initial `brief_created` coordination state, and
recorded the `formation_approved` transition in
`docs/work/BANDIT-058/coordination-log.jsonl` after Qwen, CodeRabbit, and
aggregate formation review evidence. Test Writer recorded Stage 2 RED evidence
at `docs/work/BANDIT-058/red-evidence.md` and
`docs/specs/BANDIT-058-red-evidence.json`, with `red_recorded` appended to the
coordination log. Claude Implementation Writer recorded Stage 3 implementation
evidence at `docs/work/BANDIT-058/implementation-evidence.md`,
`docs/work/BANDIT-058/writer-report.md`, and
`docs/specs/BANDIT-058-implementation-evidence.json`, with
`implementation_recorded` appended to the coordination log. Claude
Implementation Writer then recorded bounded Stage 3 repair evidence for
role-run manifest required-field validation in those same Stage 3 evidence
artifacts, with an `implementation_recorded` repair transition appended to the
coordination log. Claude Implementation Writer then recorded bounded Stage 3
repair 2 evidence for role-run manifest non-empty array element validation in
those same Stage 3 evidence artifacts, with an `implementation_recorded` repair
2 transition appended to the coordination log. Codex PM accepted the repaired
Stage 3 implementation at `docs/work/BANDIT-058/stage3-pm-review.md`.
CodeRabbit Stage 4 pre-PR review completed at
`docs/work/BANDIT-058/coderabbit-review.md` with open source-level findings.
Claude Implementation Writer recorded the bounded CodeRabbit source repair in
`docs/work/BANDIT-058/implementation-evidence.md`,
`docs/work/BANDIT-058/writer-report.md`, and
`docs/specs/BANDIT-058-implementation-evidence.json`, with focused tests,
role validators, Bandit validation, cockpit/session-context recovery checks,
`git diff --check`, and 15 fail-closed probes passing. Codex PM accepted the
CodeRabbit source repair at
`docs/work/BANDIT-058/stage4-repair-acceptance.md` after focused tests,
validators, derived status checks, and isolated fail-closed PM probes passed.
Codex PM attempted the recorded Local Qwen Stage 4 review command, but
`npm run bandit -- qwen-review BANDIT-058` failed before invoking Local Qwen
because the active worktree was dirty and the command requires a clean
source-head baseline. The blocker is recorded at
`docs/work/BANDIT-058/local-qwen-review-blocker.md`. Codex PM prepared the
focused `BANDIT-058` implementation/evidence checkpoint baseline in the
current commit so Local Qwen can run against source-head evidence.

`BANDIT-057` remains landed and closed out. Its Stage 1 through Stage 6 evidence
and the formal replacement of
`BANDIT-GAP-STAGE4-REPAIR-OWNERSHIP-ENFORCEMENT` are recorded in
`docs/work/BANDIT-057/`, `docs/specs/`, `.bandit/policy/`, and
`.bandit/bootstrap-gaps.json`.

**Active work item:** `BANDIT-058` - Role Contracts And Run Manifests.

**Current next action:** Run Local Qwen adversarial review for the current `BANDIT-058` source before aggregate Stage 4 review evidence.

The current stage is Stage 4: CodeRabbit source repair accepted; Local Qwen is
the next required independent reviewer gate before aggregate review evidence.

Do not record aggregate Stage 4 review evidence, land, close out, begin another
work item, or begin unrelated Phase 8 cockpit product work until Local Qwen and
aggregate Stage 4 review evidence are recorded, and any findings are explicitly
dispositioned.
The Stage 3 Writer had no authority to edit tests, test helpers, fixtures, RED
evidence, or acceptance mappings; Codex PM confirmed no such edits occurred.

## Active Work

**Active work item:** `BANDIT-058` - Role Contracts And Run Manifests.

`BANDIT-058` has Stage 1 brief evidence, Qwen formation review, CodeRabbit
formation review, aggregate formation review, a `formation_approved`
coordination transition, Test Writer-owned RED evidence, and Claude
Implementation Writer Stage 3 evidence. Codex PM recorded a Stage 3 acceptance
blocker at `docs/work/BANDIT-058/stage3-pm-review.md`, then Claude
Implementation Writer recorded bounded repair evidence that adds fail-closed
required-field validation for role-run manifests. Codex PM acceptance review
found a remaining blocker: required role-run manifest arrays can contain blank
entries and still validate. Claude Implementation Writer recorded bounded
repair 2 evidence that rejects blank required array entries and prevents blank
source artifacts from resolving to the repository root or directories. Codex PM
accepted repaired Stage 3 implementation evidence after focused tests, role
validators, Bandit validation, cockpit/session-context recovery checks, and
throwaway PM probes passed. CodeRabbit Stage 4 review then found source-level
fail-closed validation gaps in role-run path containment, role-run manifest
authority-boundary checks, and role-contract empty required-field handling. The
RED suites are `test/role-contracts.test.mjs` and
`test/role-run-manifests.test.mjs`; both are Codex-authored Test Writer
surfaces, so the Stage 4 source repair must route through Claude Implementation
Writer and preserve the test ownership boundary. Claude Implementation Writer
recorded the bounded CodeRabbit source repair and preserved the Test Ownership
Boundary; Codex PM accepted the repair. The Local Qwen command then failed
closed before reviewer invocation because the worktree was dirty, so Codex PM
prepared a focused implementation/evidence checkpoint baseline for
`BANDIT-058`. The next step is to run Local Qwen against the current
source-head evidence.

Do not start local server/API mode, state-index persistence, scheduler
execution, worktree lifecycle, claim leases, work surface reservations,
automatic merge/push/deploy, product UAT approval, actor identity policy,
PR/CI workflow, or unrelated Phase 8 work while `BANDIT-058` is active.

## Priority

1. Run Local Qwen adversarial review for the current `BANDIT-058` source.
2. Then record aggregate Stage 4 review evidence after Local Qwen completes or
   an honest provider/refusal replacement artifact is recorded.
3. Keep the review bounded to the accepted Role Contracts And Run Manifests
   implementation, including the CodeRabbit source repair and Test Ownership
   Boundary.
4. Keep the work bounded to Role Contracts And Run Manifests.
5. Keep unrelated Phase 8 cockpit product work blocked while any bootstrap gap
   remains queued or active.

## Required Operator Input

No operator-owned input is required for the next recorded action. The next step
is the required Local Qwen reviewer gate for a repo-derived bootstrap-gap chore,
not a product, UAT, policy, business, cost, or scope decision.
