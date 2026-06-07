# Local Qwen Review - BANDIT-066

contract_version: 1
work_item: BANDIT-066
source_head: eaee411928fa508a04906deb4b9873710be865fe
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
review_subject_hash: f3ef89ae07d91ee679ef662e7ff9218e0b7b98891f11a96fb4cb5b966b2e8511
reviewed_at: 2026-06-07T17:41:00Z

## Command Evidence

The repo-native Qwen review command was attempted first:

```sh
npm run bandit -- qwen-review BANDIT-066
```

Result:

```text
Local Qwen review requires a clean worktree before source-head evidence can be recorded
```

Because the Stage 4 subject is an unlanded bootstrap worktree, direct
non-interactive Qwen was attempted with an explicit review packet:

```sh
timeout 240 qwen --bare --approval-mode plan --output-format text "Review BANDIT-066 Stage 4. Read AGENTS.md, CLEAN_CODE.md, docs/work/BANDIT-066/brief.md, docs/work/BANDIT-066/red-evidence.md, docs/work/BANDIT-066/implementation-evidence.md, docs/work/BANDIT-066/stage3-pm-review.md, test/cockpit-browser-shell.test.mjs, src/cockpit/browser-shell.ts, public/cockpit/index.html, public/cockpit/cockpit.css. Return blocker/non_blocking/pass findings only. Focus on hidden workflow authority, browser state becoming canonical, XSS/escaping, static preview misleading current state, accessibility/responsive issues, and test ownership boundary."
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
Local Qwen as pass evidence for `BANDIT-066`.
