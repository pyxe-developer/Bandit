# Local Qwen Review - BANDIT-067

contract_version: 1
work_item: BANDIT-067
source_head: ca00d21decd4fdea2723382bd6d6807472111105
profile_id: local-qwen-baseline
runtime: qwen-cli
model: local-qwen
run_status: unavailable
reviewer_verdict: bootstrap_gap
reviewer: local-qwen-baseline
review_type: local_qwen_adversarial_review
verdict: bootstrap_gap
findings_status: unavailable
findings_disposition: qwen unavailable in automation; no Qwen pass claimed
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - Repo-native wrapper refused because source-head evidence requires a clean worktree.
  - Direct non-interactive qwen exited with no configured auth type.
structured_findings_json: []
bootstrap_gaps:
  - local_qwen_unavailable
review_subject_hash: 99db60f5fd36f8fc3b0b4d87d3dad0c4ab17d3a9b9ebdd18d3c664a8b1361d04
reviewed_at: 2026-06-07T18:47:00Z

## Command Evidence

The repo-native Qwen review command was attempted first:

```sh
npm run bandit -- qwen-review BANDIT-067
```

Result:

```text
Local Qwen review requires a clean worktree before source-head evidence can be recorded
```

Because the Stage 4 subject is an unlanded bootstrap worktree, direct
non-interactive Qwen was attempted with an explicit review packet:

```sh
timeout 240 qwen --bare --approval-mode plan --output-format text "Review BANDIT-067 Stage 4. Read AGENTS.md, CLEAN_CODE.md, docs/work/BANDIT-067/brief.md, docs/work/BANDIT-067/red-evidence.md, docs/work/BANDIT-067/implementation-evidence.md, docs/work/BANDIT-067/stage3-pm-review.md, test/cockpit-view-model.test.mjs, test/cockpit-browser-shell.test.mjs, test/helpers/cockpit-status-fixture.mjs, src/state/cockpit-view-model.ts, src/cockpit/render.ts, src/cockpit/browser-shell.ts, src/cockpit/preview-status-snapshot.ts, src/cockpit/generate-cockpit-preview.ts, public/cockpit/index.html. Return blocker/non_blocking/pass findings only. Focus on hidden workflow authority, browser state becoming canonical, XSS/escaping, static preview misleading current state, accessibility/responsive issues, full Stage 0-6 gate semantics, and test ownership boundary."
```

Result:

```text
No auth type is selected. Please configure an auth type (e.g. via settings or `--auth-type`) before running in non-interactive mode.
```

Exit code: `1`.

## Findings

No Local Qwen findings are claimed because Qwen did not run a terminal review.

## Disposition

This artifact is bootstrap replacement evidence only. Stage 4 must not treat
Local Qwen as pass evidence for `BANDIT-067`.
