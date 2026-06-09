# BANDIT-085: CodeRabbit Review Evidence

## Verdict

`bootstrap_gap` - CodeRabbit did not return a completed review within the
required 600-second provider window.

No CodeRabbit pass is claimed.

## Command Evidence

Command:

```sh
timeout 600 coderabbit review --agent --type uncommitted > .bandit/tmp/BANDIT-085-coderabbit-review/output.log 2>&1
```

Exit code: `124`

Run completed: `2026-06-09T19:44:12Z`

Captured log:

- `.bandit/tmp/BANDIT-085-coderabbit-review/output.log`

Observed provider phases in the captured log:

- `connecting_to_review_service`
- `setting_up`
- `preparing_sandbox`
- `summarizing`

## Finding Disposition

No actionable CodeRabbit findings were returned before timeout. Stage 4 review
must rely on the recorded provider-timeout evidence plus Local Qwen and PM
aggregate review. This timeout is evidence of provider unavailability for this
review window, not a clean CodeRabbit review.
