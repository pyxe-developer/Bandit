# BANDIT-062 Stage 3 Manifest Repair Dispatch

## Role

You are the Claude Stage 3 Implementation Writer repairing your own
`BANDIT-062` Stage 3 evidence after Codex PM verification.

## Blocker

`npm run bandit -- role-runs validate BANDIT-062 --json` failed because
`docs/role-runs/BANDIT-062/stage3-implementation.json` does not match the
current role-run manifest schema.

Observed failure:

```text
role-run manifest stage3-implementation is missing required fields:
role_contract_ref.role_id and role_contract_ref.version,
capability_profile or subagent_identity, required_input_packet_ref,
validation_commands
```

## Required Repair

Update only the Stage 3 Writer-owned evidence needed to make the role-run
manifest valid:

- `docs/role-runs/BANDIT-062/stage3-implementation.json`
- `docs/work/BANDIT-062/implementation-evidence.md`
- `docs/work/BANDIT-062/writer-report.md`
- `docs/artifact-inputs/BANDIT-062-implementation-evidence.json`

Use `docs/role-runs/BANDIT-061/stage3-implementation.json` and
`docs/templates/role-run-manifest.md` as the schema examples. The repaired
manifest must include at least:

- `manifest_id`: `BANDIT-062-stage3-implementation`
- `work_item_id`: `BANDIT-062`
- `stage`: `stage3_implementation`
- `role_contract_ref.role_id`: `implementation_writer`
- `role_contract_ref.version`: `1.0.0`
- `capability_profile`: `claude-implementation-writer-stage3`
- `subagent_identity`: `claude-implementation-writer-stage3`
- `base_revision`: the repository base SHA before `BANDIT-062` work began
- `allowed_target_files`: the original allowed target files
- `observed_changed_files`: the actual Writer-changed files, including this
  repaired manifest and Writer evidence files
- `forbidden_file_patterns`: test, RED, brief, formation, coordination, review,
  landing, and retrospective surfaces
- `required_input_packet_ref`: `docs/work/BANDIT-062/dispatch.md`
- `required_summary_path`: `docs/work/BANDIT-062/implementation-evidence.md`
- `validation_commands`: commands actually run, including role-run validation
- `source_artifacts`: existing source artifacts read for the original
  implementation plus this repair dispatch
- `authority_boundary`: append-only evidence with no coordination, review,
  landing, UAT, or retrospective authority

Do not edit production source, tests, RED evidence, brief, formation evidence,
coordination history, review evidence, landing evidence, retrospective evidence,
roadmap/current-context/status files, `.bandit/bootstrap-gaps.json`, or
`.bandit/events.jsonl`.

## Required Verification

Run and report:

- `npm run bandit -- role-runs validate BANDIT-062 --json`
- `npm run bandit -- validate`
- `git diff --check`

Stop if the repair requires editing forbidden files.
