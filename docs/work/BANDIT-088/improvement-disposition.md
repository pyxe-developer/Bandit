# BANDIT-088 Improvement Disposition

contract_version: 1
work_item: BANDIT-088
stage: Stage 6 closeout
source_artifacts:
  - docs/work/BANDIT-088/installed-copy-update-path-disposition.md
  - docs/work/BANDIT-088/retrospective.md
  - docs/work/BANDIT-088/review-evidence.md
  - docs/work/BANDIT-088/landing-action.md

## Disposition

No new improvement chore is created by `BANDIT-088`.

## Lessons

| Lesson | Outcome | Durable disposition |
| --- | --- | --- |
| Installed-copy update implementation is not authorized yet. | deferred | `docs/work/BANDIT-088/installed-copy-update-path-disposition.md` records named trigger conditions, conditional future scope, required approvals, refusal paths, and explicit non-goals. |
| Private Git tag or tarball install plus manual non-blocking `bandit update-check` remains the current supported installed-copy channel. | keep | `.bandit/policy/private-install-update-channel.json` remains unchanged and continues to prohibit public publishing, paid registry setup, hosted update services, telemetry, automatic self-update, and merge/push/deploy automation. |
| Installed global skills and automation prompts are derived projections, not canonical Bandit authority. | keep | `.bandit/policy/skill-lifecycle-contracts.json` remains unchanged and forbids installed global skill mutation from this work item. |
| Public publishing, paid registry, hosted service, telemetry, self-update, credential, consumer-repo mutation, installed global skill mutation, automation prompt mutation, external mutation, merge/push/deploy, old-gate replacement, and Trust Verifier cutover decisions are operator-owned. | keep | `docs/work/BANDIT-088/installed-copy-update-path-disposition.md` lists the required future operator-owned decisions. |
| CodeRabbit timed out during Stage 4. | no_action | `docs/work/BANDIT-088/coderabbit-review.md` records provider-timeout replacement evidence; Local Qwen passed and no repo-enforceable gap is opened from a single provider timeout. |

## Metrics And Baselines

No new metric-bearing improvement chore is opened. Existing validators remain
the baseline:

- `node ./bin/bandit.mjs coordination validate BANDIT-088`
- `node ./bin/bandit.mjs work-intake validate --json`
- `node ./bin/bandit.mjs risk-classification validate --json`
- `node ./bin/bandit.mjs supply-chain-gate validate --json`
- `node ./bin/bandit.mjs land-check BANDIT-088`
- `npm run bandit -- validate`

## Next Action

Repo PM should form the next intake-derived slice target,
`WIL-V0-TRIAL` - V0 Closeout Claude Code A/B Product-Value Trial, or record an
explicit Repo PM disposition if formation finds missing operator-owned product
direction.
