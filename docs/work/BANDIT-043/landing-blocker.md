# BANDIT-043 Landing Blocker

## Status

`needs-repair`

## Failed Command

```sh
npm run bandit -- auto-land-check BANDIT-043
```

## Observed Result

```text
Auto-landing blocked: missing layered risk-classification evidence for BANDIT-043
missing supply-chain gate evidence for BANDIT-043
```

## Repo Evidence

- Current head at failure: `2adc21f53db26d6da5cc4445851e64742de617d5`.
- `docs/work/BANDIT-043/landing-verdict.md` records `final_verdict: safe-to-land`.
- `npm run bandit -- land-check BANDIT-043` passes.
- `docs/work/BANDIT-043/landing-action.md` is still missing.
- `.bandit/policy/landing-agent.json` requires auto-land eligibility before local-record landing action.
- `.bandit/policy/risk-classification.json` has no `release_authorized_decisions` entry for `BANDIT-043`.
- `.bandit/policy/supply-chain-gate.json` has no `release_authorized_decisions` entry for `BANDIT-043`.

## Next Repair Action

Repair the Stage 5 auto-landing blocker before retrying local-record landing:

1. Register explicit layered risk-classification evidence for `BANDIT-043`.
2. Register explicit supply-chain gate evidence for `BANDIT-043`.
3. Refresh Stage 4 and Stage 5 evidence if the policy changes alter the review-subject hash.
4. Rerun `npm run bandit -- auto-land-check BANDIT-043`.
5. Rerun `npm run bandit -- land BANDIT-043 --action local-record`.

Do not start retrospective closeout, resolve
`BANDIT-GAP-COORDINATION-EVENT-LOG-AUTHORITY`, create the next bootstrap-gap
chore, or start unrelated Phase 8 work until landing action evidence is
recorded.
