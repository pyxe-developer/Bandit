# BANDIT-057 Stage 3 Repair Dispatch

## Metadata

- Work item: `BANDIT-057` - Role Entry Points And Formation Gate
- Dispatch kind: Stage 3 implementation repair
- Codex PM: Codex
- Claude Writer: `claude-sonnet-4-6`
- Repository: `<repo-root>`
- Branch: `main`
- Base SHA: `5e04acd0d188884b984438d83f1d23e655d6d7fa`
- Dispatch time: `2026-06-01T12:58:45Z`
- Dispatch status: repair requested

## Mission

Repair the Stage 3 implementation blockers recorded in
`docs/work/BANDIT-057/stage3-pm-review.md`. The focused RED suite already
passes, but Codex PM did not accept Stage 3 because the implementation is
weaker than the full brief and accepted role-scoped workflow design.

This is a bounded repair to the existing Claude Writer Stage 3 implementation.
Do not run Stage 4 review, landing, closeout, a new work item, or unrelated
Phase 8 work.

## Required First Reads

Read these before editing:

- `AGENTS.md`
- `CONTEXT.md`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `docs/work/BANDIT-057/brief.md`
- `docs/work/BANDIT-057/red-evidence.md`
- `docs/work/BANDIT-057/dispatch.md`
- `docs/work/BANDIT-057/stage3-pm-review.md`
- `docs/design/role-scoped-workflow-orchestration.md`
- `docs/decisions/2026-06-01-explicit-role-entrypoints-and-formation-gate.md`
- `docs/specs/BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION.json`
- `docs/specs/BANDIT-057-red-evidence.json`
- `docs/specs/BANDIT-057-implementation-evidence.json`
- `test/role-entrypoints-formation.test.mjs`

## Required Repairs

Repair exactly these blocker families:

1. `repo-pm approve-formation` must inspect aggregate formation evidence, not
   only artifact existence. It must fail closed when formation evidence records
   blocker findings or undispositioned non-blocking findings.
2. Deterministic formation validation must explicitly enforce the minimum
   formation contract from the brief and dispatch packet: source provenance,
   Test Writer boundary evidence, Implementation Writer boundary evidence, and
   execution readiness, in addition to the checks already present.
3. `work-item-pm start` must re-check approved formation evidence before
   reporting readiness. It must fail closed for missing approved formation
   evidence, blocker formation findings, undispositioned non-blocking formation
   findings, missing operator-owned input status, stale formation evidence, or
   contradictory formation evidence.

Keep the implementation narrow. Prefer explicit helpers and clear refusal
messages over generic parsing.

## Editable Paths

You may edit only these focused implementation/template/evidence paths:

- `src/commands/repo-pm.ts`
- `src/commands/work-item-pm.ts`
- `src/state/formation-gate.ts`
- `src/state/coordination-log.ts`
- `src/state/bootstrap-gaps.ts`
- `src/cli.ts`
- `docs/templates/formation-review.md`
- `docs/templates/bootstrap-gap-disposition.md`
- `docs/work/BANDIT-057/implementation-evidence.md`
- `docs/specs/BANDIT-057-implementation-evidence.json`
- `docs/work/BANDIT-057/writer-report.md`

Only edit `CONTEXT.md` if a narrow glossary correction is strictly required
by the repair. Do not edit roadmap or status files; Codex PM owns those.

## Forbidden Paths And Actions

Do not create, edit, delete, regenerate, format, or mechanically adjust:

- any test file, test helper, or fixture
- `docs/work/BANDIT-057/red-evidence.md`
- `docs/specs/BANDIT-057-red-evidence.json`
- `docs/work/BANDIT-057/brief.md`
- `docs/specs/BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION.json`
- `docs/work/BANDIT-057/dispatch.md`
- `docs/work/BANDIT-057/stage3-pm-review.md`
- this dispatch file
- roadmap, current-context, or status files
- review, landing, landing-action, retrospective, CodeRabbit, Local Qwen, or
  formation-review evidence for `BANDIT-057`
- dependencies, lockfiles, installed global skills, or external service config

Do not implement full role contracts, Role Run Manifests, execution packets
beyond minimal readiness checks, diff-based write validation, same-agent repair
continuation, landing/closeout packets, scheduler execution, worktree
lifecycle, claim leases, work-surface reservations, PR/CI workflow, automatic
merge/push/deploy behavior, product UAT approval, local server/API mode, or
unrelated Phase 8 cockpit work.

If the repair requires a forbidden edit or broader scope, stop and write the
blocker in `docs/work/BANDIT-057/writer-report.md`; do not cross the boundary.

## Verification Commands

Run the focused command first:

```sh
node --test test/role-entrypoints-formation.test.mjs
```

Then run relevant Stage 3 checks:

```sh
node --test test/bootstrap-gaps.test.mjs
node --test test/work-item-create.test.mjs
node --test test/coordination-log.test.mjs test/coordination-status.test.mjs
npm run typecheck
npm run bandit -- validate
node ./bin/bandit.mjs cockpit status --json
node ./bin/bandit.mjs session-context current --json
git diff --check
```

Run broader validation if your repair touches shared validators or command
routing beyond the focused formation/readiness path.

## Required Writer Evidence Refresh

Refresh:

- `docs/work/BANDIT-057/implementation-evidence.md`
- `docs/specs/BANDIT-057-implementation-evidence.json`
- `docs/work/BANDIT-057/writer-report.md`

The refreshed Writer report must include:

- repair summary;
- exact files changed by the Writer;
- confirmation that no tests, test helpers, fixtures, RED evidence
  artifacts/specs, acceptance mappings, PM review, dispatch, roadmap, status,
  review, landing, or retrospective evidence were edited;
- verification commands run with pass/fail results;
- clean-code self-check notes against `CLEAN_CODE.md`;
- any remaining blocker, stop condition, or test-change request.

Do not commit. Leave the working tree for Codex PM review.
