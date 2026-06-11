# BANDIT-096 Retrospective

contract_version: 1
work_item: BANDIT-096
stage: Stage 6 Retrospective And Improvement Capture
status: closed
operator_input_status: none_required
landing_action: docs/work/BANDIT-096/landing-action.md
landing_commit: 061115a8ccc564a33096e93676e1be2064698588

## Summary

BANDIT-096 delivered the PRD-005.3 internal Work Item PM execute-controller
foundation. The slice added explicit route registry behavior, internal
`derived_non_canonical` role input packet assembly, provider/blocker evidence
helpers, and a minimal command stub without implementing the PRD-005.4 operator
adapter.

## What Worked

- Plan-mode orchestration was recorded before RED evidence.
- Test Writer-owned RED tests stayed separate from Stage 3 implementation.
- Claude delivered the implementation without editing tests.
- PM acceptance repaired the `.ts` source import mismatch before review.
- CodeRabbit timeout was recorded as bootstrap-gap evidence without claiming a
  pass.
- Local Qwen used only the authorized `.bandit/reviewers/local-qwen.json` route
  and all non-blocking findings received PM disposition.
- Risk classification, supply-chain gate, review-subject hash, land-check, and
  local-record landing all passed.

## Friction

- CodeRabbit again did not return terminal evidence during the required window.
- The local shell wrapper used `status` as a variable name, which zsh treats as
  read-only; the provider stream still supplied usable timeout evidence, but
  future wrappers should use a neutral name such as `exit_code`.
- Local Qwen reported an empty source diff even though the committed source,
  test, and evidence diff was present; PM disposition handled it as a
  non-blocking reviewer-packet limitation.

## Lessons And Dispositions

| Lesson | Disposition | Evidence |
| --- | --- | --- |
| Stage 4 policy evidence must be staged before computing the review-subject hash. | keep | `docs/work/BANDIT-096/review-evidence.md` records the hash after staged risk/supply evidence. |
| Non-blocking Local Qwen findings are landable only with concrete PM rationale and durable routing. | keep | `docs/work/BANDIT-096/local-qwen-finding-disposition.md` and `review-evidence.md` record each disposition. |
| CodeRabbit timeout evidence must remain explicitly non-pass. | keep | `docs/work/BANDIT-096/coderabbit-review.md` records `bootstrap_gap`. |
| The zsh `status` variable name should not be used in local reviewer wrappers. | no_action | This was an operator-side wrapper issue in the automation run, not repo code; record here as prompt/tooling guidance. |
| Local Qwen can misread a committed diff packet as empty. | no_action | PM verification supplied git diff evidence and review disposition; reopen only if repeated across future slices. |

## Verification

- `node --test test/work-execute-controller.test.mjs` - pass.
- `node --test test/stage-route-registry.test.mjs` - pass.
- `node --test test/role-input-packets.test.mjs` - pass.
- `node --test test/provider-blocker-evidence.test.mjs` - pass.
- `npm run typecheck` - pass.
- `npm test` - pass, 636/636.
- `node ./bin/bandit.mjs risk-classification validate --json` - pass.
- `node ./bin/bandit.mjs supply-chain-gate validate --json` - pass.
- `node ./bin/bandit.mjs land-check BANDIT-096` - pass.
- `node ./bin/bandit.mjs land BANDIT-096 --action local-record` - pass.

## Next Recorded Action

Repo PM should form the next work item for PRD-005.4 Operator Command Adapters.
Do not begin RED evidence or implementation for PRD-005.4 until that formation
exists and is approved.
