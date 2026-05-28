# BANDIT-041 Landing Blocker

## Status

`needs-repair`

## Failed Command

```sh
npm run bandit -- land BANDIT-041 --action local-record
```

## Observed Result

```text
Landing blocked: missing layered risk-classification evidence for BANDIT-041
```

## Repo Evidence

- Current head at failure: `ababdd11334842db227eb38617c89c34df61173b`.
- `docs/work/BANDIT-041/landing-verdict.md` records `final_verdict: safe-to-land`.
- `docs/work/BANDIT-041/landing-action.md` is still missing.
- `.bandit/policy/landing-agent.json` has `require_auto_land_eligible: true`.
- `.bandit/policy/risk-classification.json` has no `release_authorized_decisions` entry for `BANDIT-041`.
- `npm run bandit -- land-check BANDIT-041` passes, but `bandit land` calls `auto-land-check` before writing local-record landing evidence.

## Next Repair Action

Repair the Stage 5 landing blocker before retrying local-record landing:

1. Register explicit layered risk-classification evidence for `BANDIT-041`.
2. Refresh Stage 4 and Stage 5 evidence if the risk-classification policy change changes the review-subject hash.
3. Rerun `npm run bandit -- land BANDIT-041 --action local-record`.

Do not start retrospective closeout, resolve `BANDIT-GAP-LAYERED-RISK-CLASSIFICATION`,
create the next bootstrap-gap chore, or start unrelated Phase 8 work until
landing action evidence is recorded.
