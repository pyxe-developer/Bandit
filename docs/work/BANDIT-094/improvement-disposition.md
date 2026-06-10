# BANDIT-094 Improvement Disposition

contract_version: 1
work_item: BANDIT-094
stage: Stage 6 closeout
source_artifacts:
  - docs/work/BANDIT-094/retrospective.md
  - docs/work/BANDIT-094/stage3-claude-attempt.md
  - docs/work/BANDIT-094/stage3-minimax-dispatch.md
  - docs/work/BANDIT-094/stage3-minimax-repair-dispatch.md
  - docs/work/BANDIT-094/writer-report.md
  - docs/work/BANDIT-094/implementation-evidence.md
  - docs/work/BANDIT-094/stage3-pm-acceptance.md
  - docs/work/BANDIT-094/coderabbit-review.md
  - docs/work/BANDIT-094/coderabbit-finding-disposition.md
  - docs/work/BANDIT-094/local-qwen-review.md
  - docs/work/BANDIT-094/review-evidence.md
  - docs/work/BANDIT-094/landing-verdict.md
  - docs/work/BANDIT-094/landing-action.md

## Disposition

No new improvement chore is created by `BANDIT-094`.

## Lessons

| Lesson | Outcome | Durable disposition |
| --- | --- | --- |
| Create-controller review requires a clean source/evidence checkpoint before Local Qwen. | keep | Local Qwen refusal on dirty worktree forced commit `354b2474c7c04669ee04234bf3873327cfdf7a90` before review. |
| CodeRabbit partial findings during timeout still need repair or PM disposition. | keep | `docs/work/BANDIT-094/coderabbit-finding-disposition.md` records each finding outcome. |
| Operator-specific absolute paths should not be committed as prompt-policy markers when a generic marker works. | keep | `.bandit/policy/orchestrator-prompts.json` uses generic forbidden sources and tests still detect leakage. |
| Non-blocking Local Qwen findings need concrete PM rationale and durable routing. | keep | `docs/work/BANDIT-094/review-evidence.md` records no-action dispositions and reopen triggers. |
| Risk/supply-chain registry entries are release prerequisites, not optional notes. | keep | `.bandit/policy/risk-classification.json` and `.bandit/policy/supply-chain-gate.json` include BANDIT-094. |

## Follow-Up Candidates Not Opened

| Candidate | Source | Current disposition | Trigger to reopen |
| --- | --- | --- | --- |
| Hard-code extra forbidden-intent assertions for create-controller. | Local Qwen non-blocking finding. | Not opened because the command has no intent input surface and tests assert no Stage 2+ artifacts are created. | Reopen if PRD-005.4 adapters pass free-form operator intent into create-controller. |
| Improve Local Qwen packet diff visibility. | Local Qwen non-blocking finding. | Not opened because PM verification supplied independent code-level evidence and the qwen-review command is outside this slice. | Reopen if Local Qwen repeatedly returns non-blocking findings due to missing diff content. |
| CodeRabbit timeout reliability hardening. | CodeRabbit Stage 4 repeated timeout. | Not opened because timeout replacement evidence is accepted and partial findings were handled. | Reopen if CodeRabbit timeout prevents landing without replacement evidence. |

## Metrics And Baselines

No new metric-bearing improvement chore is opened. Existing validators remain
the baseline:

- `node ./bin/bandit.mjs coordination validate BANDIT-094`
- `node ./bin/bandit.mjs land-check BANDIT-094`
- `node ./bin/bandit.mjs risk-classification validate --json`
- `node ./bin/bandit.mjs supply-chain-gate validate --json`
- `npm run bandit -- validate`

## Next Action

Repo PM should form PRD-005.3 Work Item PM Execute Controller And Route
Registry.
