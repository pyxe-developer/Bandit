# BANDIT-101 Retrospective

contract_version: 1
work_item: BANDIT-101
stage: Stage 6 Retrospective And Improvement Capture
status: closed
operator_input_status: none_required
landing_action: docs/work/BANDIT-101/landing-action.md
source_checkpoint_commit: 9f8635b37a044b70bd4dad2f6621828bebc128da
review_landing_checkpoint_commit: 3ef5cf201a09b2bc56e1c02d59ba60fa32668a0c

## Summary

BANDIT-101 delivered typed reviewer adapters with honest degradation. Local Qwen
is now represented as an `openai_compatible` reviewer adapter without changing
the authorized `.bandit/reviewers/local-qwen.json` /
`bin/omlx-chat-completions.mjs` route. `init --profile` scaffolds typed reviewer
adapter files, empty reviewer profiles record a no-reviewer bootstrap gap, and
`land-check` fails closed for open no-reviewer gaps, malformed human review
replacement evidence, and unsupported human-review source-drift states.

## What Worked

- Plan-mode, RED, implementation, review, landing, and closeout gates were all
  recorded in append-only coordination evidence.
- MiniMax-M3 performed Stage 3 implementation after Codex-authored RED, keeping
  model-family separation intact.
- Focused reviewer-adapter, Local Qwen, and landing-gate tests cover typed
  adapter validation, scaffold output, no-reviewer gap behavior, and human
  review replacement evidence.
- CodeRabbit found real coverage and evidence issues; material critical/major
  source findings were repaired or PM-dispositioned.
- Local Qwen completed through the authorized local route after the clean
  source/evidence checkpoint and returned only non-blocking procedural findings.
- Risk classification, supply-chain gate, aggregate review evidence,
  `land-check`, `auto-land-check`, and local-record landing completed before
  closeout.

## Friction

- The Stage 4 CodeRabbit loop became self-amplifying: evidence repairs changed
  the reviewed diff, causing new evidence/doc findings and repeated review
  refreshes.
- Several CodeRabbit runs surfaced critical/major wording findings in evidence
  files after source behavior was already covered, requiring PM judgment to stop
  artifact churn.
- Local Qwen returned `non_blocking` with a nonzero CLI exit even though the
  generated artifact recorded `run_status: completed`; PM disposition had to
  classify that as review findings requiring durable routing, not provider
  unavailability.
- Root risk and supply-chain policy indexes initially omitted `BANDIT-101`, so
  per-work-item evidence existed before release-authorized validation listed the
  work item.
- The landing action command records `landing-action.md` but Stage 6 still owns
  canonical `landed` and `closed` coordination transitions.

## Structured Improvement Mining

| Signal | Finding | Durable disposition |
| --- | --- | --- |
| Regression | Typed reviewer adapters were not first-class, forcing Local Qwen assumptions into review routing. | keep: reviewer adapters are now typed and scaffolded from profile config. |
| Role boundary | Stage 3 could not edit Test Writer-owned RED surfaces after Codex-authored RED. | keep: MiniMax-M3 was used for implementation; PM attributed Stage 4 repair fixtures explicitly. |
| Review loop | Re-running CodeRabbit after every evidence wording edit created an unbounded artifact-churn loop. | no_action_current_slice: PM froze the review subject, repaired true material findings, and dispositioned non-critical evidence churn; no new bootstrap gap is opened because existing review-subject hash and non-blocking routing gates already support this pattern. |
| Reviewer threshold | Minor/trivial reviewer findings can be real but not landing-blocking. | keep: `coderabbit-finding-disposition.md` and `review-evidence.md` record threshold-based PM disposition. |
| Evidence freshness | Stage 4/5 evidence must carry a current review-subject hash after risk/supply-chain registry updates. | keep: review-subject hash `3728cd6685e5ec636c2f175c2cd66ca3679095627af57d99109e7b7302a470e1` passed land-check after the evidence checkpoint commit. |
| Supply-chain | Per-work-item risk/supply evidence is insufficient until root policy indexes release-authorize the work item. | keep: root policy indexes now include `BANDIT-101`; validators list it as eligible. |
| Operator input | The operator clarified that only true critical/major CodeRabbit findings should block the loop. | keep: the clarification was applied as PM judgment without requesting further routine routing input. |
| Clean code | Reviewer adapter parsing, human evidence parsing, and landing checks stayed in named local modules. | keep: clean-code posture passed in landing verdict and review evidence. |
| Bootstrap gaps | No open bootstrap gap remained after landing. | no_action: CodeRabbit loop-control was recorded as a process lesson, not an active gap, because the needed controls were exercised through existing review-subject hash and PM disposition contracts. |
| Next slice | The next planned slice is harness-neutral AGENTS.md and generated harness shims. | route_to_repo_pm: Repo PM should form `BANDIT-102` only after confirming repo artifacts still authorize it and no new open bootstrap gap takes precedence. |

## Lessons And Dispositions

| Lesson | Disposition | Evidence |
| --- | --- | --- |
| Stage 4 reviewer loops need a frozen review subject once source behavior is repaired and evidence churn becomes self-amplifying. | no_action_current_slice | `docs/work/BANDIT-101/coderabbit-review.md`, `docs/work/BANDIT-101/coderabbit-finding-disposition.md`, `docs/work/BANDIT-101/review-evidence.md` |
| CodeRabbit findings below true critical/major severity should be dispositioned when they only expand evidence wording without improving the slice materially. | keep | `docs/work/BANDIT-101/coderabbit-finding-disposition.md` |
| Local Qwen `non_blocking` findings still need concrete PM rationale and durable routing before safe-to-land. | keep | `docs/work/BANDIT-101/qwen-finding-disposition.md`, `docs/work/BANDIT-101/review-evidence.md` |
| Release-authorized risk and supply-chain validation depends on both per-work-item evidence and root policy index entries. | keep | `.bandit/policy/risk-classification.json`, `.bandit/policy/supply-chain-gate.json` |
| Local-record landing evidence and canonical coordination transitions remain separate. | no_action | `docs/work/BANDIT-101/landing-action.md`, `docs/work/BANDIT-101/coordination-log.jsonl` |

## Verification

- `node --test test/reviewer-adapters.test.mjs` - pass, 11 tests.
- `node --test test/local-qwen-review.test.mjs` - pass, 33 tests.
- `node --test test/landing-gates.test.mjs` - pass, 94 tests.
- `npm run typecheck` - pass.
- `npm test` - pass, 684 tests.
- `node ./bin/bandit.mjs qwen-review BANDIT-101` - completed through authorized Local Qwen route with `reviewer_verdict: non_blocking`.
- `node ./bin/bandit.mjs risk-classification validate --json` - pass and lists `BANDIT-101:eligible`.
- `node ./bin/bandit.mjs supply-chain-gate validate --json` - pass and lists `BANDIT-101:eligible`.
- `node ./bin/bandit.mjs review-subject-hash BANDIT-101` - pass with hash `3728cd6685e5ec636c2f175c2cd66ca3679095627af57d99109e7b7302a470e1`.
- `node ./bin/bandit.mjs land-check BANDIT-101` - pass after the review/landing evidence checkpoint commit.
- `node ./bin/bandit.mjs auto-land-check BANDIT-101` - pass.
- `node ./bin/bandit.mjs land BANDIT-101 --action local-record` - pass.
- `npm run bandit -- validate` - pass before closeout.
- `node ./bin/bandit.mjs coordination validate BANDIT-101` - pass before closeout.
- `git diff --check` - pass before closeout.

## Next Recorded Action

Repo PM should form `BANDIT-102` - Harness-neutral AGENTS.md and generated
harness shims - only after confirming repo artifacts still authorize that slice
and no new open bootstrap gap takes precedence.
