# BANDIT-097 Retrospective

contract_version: 1
work_item: BANDIT-097
stage: Stage 6 Retrospective And Improvement Capture
status: closed
operator_input_status: none_required
landing_action: docs/work/BANDIT-097/landing-action.md
landing_commit: 7ac73a1a7cca3c554ec5c630c8aac9140b161f35

## Summary

BANDIT-097 delivered the PRD-005.4 Operator Command Adapters slice. The slice
added local operator-facing `bandit work-create` and `bandit work-execute`
adapters that delegate to the repo-native controllers, expose derived
non-canonical payloads, and preserve the nested work namespace and public
context command as unavailable surfaces.

## What Worked

- Plan-mode orchestration was recorded before RED evidence.
- Test Writer-owned RED tests stayed separate from Stage 3 source delivery.
- Claude delivered the source implementation without editing test-owned files.
- MiniMax fallback produced evidence after the Claude headless run timed out.
- PM acceptance corrected evidence wording before review and verified spec
  alignment, clean-code posture, focused tests, controller regressions, and
  typecheck.
- CodeRabbit timeout was recorded as bootstrap-gap evidence without claiming a
  pass.
- Local Qwen used only the authorized `.bandit/reviewers/local-qwen.json` route
  and the non-blocking review-packet finding received PM disposition.
- Risk classification, supply-chain gate, review-subject hash, UAT,
  land-check, and local-record landing all passed.

## Friction

- Claude completed source edits but timed out before durable implementation
  evidence was written.
- CodeRabbit again did not return terminal evidence during the required
  provider window.
- Local Qwen again reported that the review prompt lacked source diff content
  after the focused source/evidence commit.
- UAT evidence became stale after the Stage 4/5 evidence checkpoint commit and
  had to be refreshed before local-record landing.

## Lessons And Dispositions

| Lesson | Disposition | Evidence |
| --- | --- | --- |
| Operator adapters should delegate to controllers and keep repo-native artifacts canonical. | keep | `src/commands/bandit-work-create.ts`, `src/commands/bandit-work-execute.ts`, and `docs/work/BANDIT-097/implementation-evidence.md`. |
| Stage 3 fallback can be evidence-only when the primary writer delivered source but timed out before reporting. | keep | `docs/work/BANDIT-097/writer-report.md` and `docs/work/BANDIT-097/stage3-pm-acceptance.md`. |
| CodeRabbit timeout evidence must remain explicitly non-pass. | keep | `docs/work/BANDIT-097/coderabbit-review.md` records `bootstrap_gap`. |
| Non-blocking Local Qwen review-packet findings are landable only with concrete PM rationale and durable routing. | keep | `docs/work/BANDIT-097/local-qwen-finding-disposition.md` and `review-evidence.md`. |
| UAT must be refreshed after the final evidence checkpoint commit when branch artifacts changed after the earlier UAT approval. | keep | `docs/work/BANDIT-097/uat-approval.md` and `docs/work/BANDIT-097/landing-action.md`. |
| Local Qwen can misread a committed source checkpoint as missing source diff. | no_action | The focused source commit, PM acceptance, test evidence, and reviewer disposition covered the limitation for this slice; reopen only if repeated evidence requires a reviewer-packet repair item. |

## Verification

- `node --test test/bandit-work-command-adapters.test.mjs` - pass.
- `node --test test/work-create-controller.test.mjs` - pass.
- `node --test test/work-execute-controller.test.mjs` - pass.
- `npm run typecheck` - pass.
- `node ./bin/bandit.mjs risk-classification validate --json` - pass.
- `node ./bin/bandit.mjs supply-chain-gate validate --json` - pass.
- `node ./bin/bandit.mjs land-check BANDIT-097` - pass before local-record landing.
- `node ./bin/bandit.mjs land BANDIT-097 --action local-record` - pass.

## Next Recorded Action

Repo PM should form the next work item for the V0 Closeout Claude Code A/B
Product-Value Trial only after accepting that PRD-004/005 implementation lanes
are landed, closed, blocked on operator-owned input, or explicitly
dispositioned. Do not begin RED evidence or implementation for that deferred
product slice until formation exists and is approved.
