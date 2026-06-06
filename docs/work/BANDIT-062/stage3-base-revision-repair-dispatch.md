# BANDIT-062 Stage 3 Base Revision Repair Dispatch

## Role

You are the Claude Stage 3 Implementation Writer repairing your own
`BANDIT-062` Stage 3 role-run evidence after Codex PM verification.

## Blocker

The repaired role-run manifest is schema-valid, but its `base_revision` is
semantically stale. `BANDIT-062` began from:

```text
7eb298e736f9a8aa160be0002a00c4fb9adbf9d0 Queue Work Item PM plan-mode chore
```

The manifest currently records the older `BANDIT-061` closeout commit.

## Required Repair

Update only Stage 3 Writer-owned evidence:

- `docs/role-runs/BANDIT-062/stage3-implementation.json`
- `docs/work/BANDIT-062/implementation-evidence.md`
- `docs/work/BANDIT-062/writer-report.md`
- `docs/artifact-inputs/BANDIT-062-implementation-evidence.json`

Set `base_revision` to:

```text
7eb298e736f9a8aa160be0002a00c4fb9adbf9d0
```

Update `source_artifacts` in the role-run manifest to include both repair
dispatches:

- `docs/work/BANDIT-062/stage3-manifest-repair-dispatch.md`
- `docs/work/BANDIT-062/stage3-base-revision-repair-dispatch.md`

Update the Writer report or implementation evidence only if needed to keep the
verification summary honest.

Do not edit production source, tests, RED evidence, brief, formation evidence,
coordination history, review evidence, landing evidence, retrospective evidence,
roadmap/current-context/status files, `.bandit/bootstrap-gaps.json`, or
`.bandit/events.jsonl`.

## Required Verification

Run and report:

- `npm run bandit -- role-runs validate BANDIT-062 --json`
- `npm run bandit -- validate`
- `git diff --check`
