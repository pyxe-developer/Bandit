# BANDIT-090 Stage 3 MiniMax Repair Prompt

You are the non-Codex Stage 3 repair Implementation Writer for
`/Users/matthewflebbe/Bandit`.

Read:

- `docs/work/BANDIT-090/stage3-pm-review.md`
- `docs/work/BANDIT-090/red-evidence.md`
- `src/state/attribution-join-key.ts`
- `src/commands/land-check.ts`
- `src/state/landing-verdicts.ts`

Repair only the PM blockers in `docs/work/BANDIT-090/stage3-pm-review.md`.

Allowed files:

- `src/state/attribution-join-key.ts`
- `src/commands/land-check.ts`
- `docs/work/BANDIT-090/writer-report.md`
- `docs/work/BANDIT-090/implementation-evidence.md`

Forbidden files:

- all tests and test helpers
- `docs/work/BANDIT-090/red-evidence.md`
- formation/review/landing/retrospective evidence
- roadmap/current-context/status
- PRDs/specs
- package files, lockfiles, dependencies
- unrelated source

Specific repair requirements:

1. For `artifact_kind: landing`, require non-blank `artifact_path`,
   `role_or_profile`, `touched_surface`, `boundary_prediction_record`,
   `purpose`, and `artifact_state`.
2. Reject unsupported `artifact_kind`; support `landing`, `model_call`,
   `tool_call`, and `escape`.
3. Cross-check landing Attribution Join Key against the Boundary Prediction
   Record for `work_item`, `review_subject_hash`, `boundary_prediction_record`,
   `authorizing_boundary_cell`, and `landing_autonomy_level`.
4. Honor `landingVerdict.attributionJoinKey` when present; otherwise use
   `docs/work/<WORK_ITEM>/landing-attribution-join-key.json`.
5. Keep `attribution_join_hash` derived lookup data only. Do not make the hash
   canonical evidence. Fix the misleading helper comment.
6. Write `writer-report.md` and `implementation-evidence.md` with files
   changed and verification results.

Run:

```sh
node --test --test-name-pattern "Attribution|attribution" test/landing-gates.test.mjs
npm run typecheck
```

If those pass, also run:

```sh
node --test test/landing-gates.test.mjs
```

Do not run or start Stage 4, landing, closeout, PRD-004.3, PRD-004.4, PRD-005,
or V0 trial work.
