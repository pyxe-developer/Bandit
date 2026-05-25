# BANDIT-018 Stage 4 Finding Repair And Disposition

recorded_time_utc: 2026-05-25T15:59:30Z
work_item: BANDIT-018
base_head: f066191c7d30
disposition_state: focused_repair_verified

## Source Findings

The AC10 repair-head Stage 4 refresh recorded `non_blocking` findings in
`docs/work/BANDIT-018/local-qwen-review.md`,
`docs/work/BANDIT-018/model-comparison.md`, and
`docs/work/BANDIT-018/review-evidence.md`.

## Focused Repairs

- Removed unreachable fallback handling for fixture summaries in
  `src/commands/escalated-review.ts`. Fixture output is now validated before
  the command reads required verdict, findings, or summary fields.
- Added an explicit selected-route guard before escalated reviewer profile
  lookup in `src/commands/escalated-review.ts`, preserving fail-closed command
  behavior if routing evidence is malformed.
- Aligned the focused escalated-review test work-item IDs in
  `test/landing-gates.test.mjs` so the AC10 extension cases progress from the
  RED evidence IDs instead of appearing out of sequence.

## Explicit Dispositions

- Write-before-throw evidence on blocker, stale, timeout, unavailable, and
  paid-provider refusal paths is accepted as intentional audit evidence. The
  command still exits nonzero and `land-check` rejects stale or non-pass
  escalated-review evidence, so this does not create a fail-open path.
- `docs/work/BANDIT-018/escalated-review.md` remains the CLI-owned configured
  paid-provider refusal artifact for the `security-reviewer-paid` route. The
  separate operator-approved Opus 4.7 headless comparison is recorded in
  `docs/work/BANDIT-018/model-comparison.md` and summarized in aggregate
  `docs/work/BANDIT-018/review-evidence.md`; it does not silently rewrite the
  configured CLI provider profile or credential policy.

## Stage-Rubric Check

| Stage | Verdict | Evidence |
|---|---|---|
| Stage 3: Implementation Clean-Code Rubric | `pass` | The repair is limited to escalated-review command validation order, selected-route clarity, and test evidence traceability. Focused and full deterministic verification passed. |
| Stage 4: Review And Cross-Model Gates | `pending` | Source code and test evidence changed after the AC10 repair-head review refresh. The next step is to refresh Stage 4 review evidence at the committed repair head before landing verdict. |

## Verification

```sh
node --test --test-name-pattern "escalated-review" test/landing-gates.test.mjs
```

Result: `pass` - 8 focused escalated-review tests passed.

```sh
npm run typecheck
```

Result: `pass`.

```sh
npm test
```

Result: `pass` - 164 tests passed.

```sh
npm run bandit -- validate
```

Result: `pass`.

```sh
npm run bandit -- gaps list
```

Result: `pass` - `BANDIT-GAP-LIVE-ESCALATED-REVIEWER` remains active as
`BANDIT-018` and routes to Stage 4 review refresh.

```sh
npm run bandit -- land-check BANDIT-018
```

Result: expected `blocker` - `docs/work/BANDIT-018/landing-verdict.md` does
not exist yet. No landing verdict should be created before refreshed Stage 4
review evidence.

```sh
git diff --check
```

Result: `pass`.

## Next Step

Refresh `BANDIT-018` Stage 4 review evidence at the committed repair head. Do
not create landing verdict, landing action, retrospective, or the next
bootstrap-gap chore until refreshed review evidence is current and resolved.
