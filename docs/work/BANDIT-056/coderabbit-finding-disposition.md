# BANDIT-056 CodeRabbit Finding Disposition

recorded_time_utc: 2026-05-31T21:41:00Z
work_item: BANDIT-056
latest_review_head: 2f8564ce88f9c0d7be2521a9cf638087c428865d
disposition_state: partial_findings_classified

## Source Evidence

- `docs/work/BANDIT-056/coderabbit-review.md`
- `docs/specs/BANDIT-056-coderabbit-review-output.json`
- `.bandit/policy/evidence-freshness-slos.json`
- `docs/templates/evidence-freshness-slos.md`
- `src/state/cockpit-status.ts`
- `src/state/writer-stream-sanitizer.ts`
- `test/evidence-freshness-slos.test.mjs`
- `test/cockpit-status.test.mjs`
- `test/writer-stream-sanitizer.test.mjs`

The focused CodeRabbit refresh completed at source head
`2f8564ce88f9c0d7be2521a9cf638087c428865d` and returned six open findings.
Codex PM classified the findings instead of repairing all of them.

## PM Disposition

| Finding | Verdict | Rationale | Durable routing |
| --- | --- | --- | --- |
| Add explicit documentation explaining why `derived_projection_rules` for `cockpit_status` and `session_context` are `derived_non_canonical`, propagate stale dependencies, and cannot upgrade missing dependencies to trusted. | `accepted_non_blocking` | Current validation already enforces `propagate_missing_or_stale_dependencies: true` and `cannot_upgrade_missing_dependency_to_trusted: true`; focused evidence freshness, cockpit status, and session-context tests pass. The finding is valid documentation hardening, but repo evidence does not show a current validation break. | Queue follow-up candidate `BANDIT-056-DERIVED-PROJECTION-RATIONALE` for a future policy/documentation hardening slice; no source repair is required before repairing the two blockers. |
| Make `artifact_types` and `trust_signal_requirements` use a consistent `source_artifact` / `source_artifacts` key name so form-fillers are not confused. | `repair_required` | The template is a source artifact for future Evidence SLO forms. The singular/plural mismatch creates avoidable authoring ambiguity even though current validation accepts the implemented policy. | Repair the template wording before another focused CodeRabbit refresh, Local Qwen, aggregate Stage 4 review, landing, or closeout. |
| Extract the repeated evidence artifact path object shape into a single shared type alias for cockpit-status trust-signal and gate-matrix helpers. | `accepted_non_blocking` | Current cockpit status tests and derived cockpit status output pass. The suggestion is maintainability hardening, not a current validator or runtime break. | Queue follow-up candidate `BANDIT-056-COCKPIT-EVIDENCE-PATH-ALIAS` for a future cockpit-status maintenance slice if this file changes again; no source repair is required before repairing the two blockers. |
| Update `isRecord` so arrays are not treated as record objects before parsed `type` access. | `repair_required` | Arrays are JSON objects in JavaScript but not record-like event objects for the sanitizer's `parsed.type` path. This is a real boundary-condition defect and should fail closed explicitly. | Repair `src/state/writer-stream-sanitizer.ts` and focused sanitizer coverage before another focused CodeRabbit refresh, Local Qwen, aggregate Stage 4 review, landing, or closeout. |
| Extract duplicated raw stream line-splitting/trimming count logic into a shared helper. | `no_action_opportunistic` | The current duplication is local, small, and covered by focused sanitizer tests. Extracting a helper would be an opportunistic cleanup, not required for this Stage 4 gate. | No standalone repair and no CodeRabbit refresh solely for this stylistic finding. Consider opportunistically if the sanitizer is already being edited for the repair-required `isRecord` defect. |
| Use a `Set` for redacted-field-name membership checks instead of repeated linear search. | `no_action` | The list is short, constant, and not a current performance or correctness issue. A `Set` conversion would not materially change the Evidence SLO slice outcome. | No source repair and no CodeRabbit refresh solely for this stylistic finding. |

## Durable Follow-Up Candidates

### Chore Candidate: `BANDIT-056-DERIVED-PROJECTION-RATIONALE`

candidate_id: BANDIT-056-DERIVED-PROJECTION-RATIONALE
origin: CodeRabbit non-blocking Stage 4 finding from `BANDIT-056`.
source_work_item: BANDIT-056
source_artifacts:
  - docs/work/BANDIT-056/coderabbit-review.md
  - docs/work/BANDIT-056/coderabbit-finding-disposition.md
lesson: Derived cockpit and session-context projections should state why they
  are non-canonical and cannot upgrade missing or stale dependencies to trusted.
hypothesis: Future Stage 4 reviews of Evidence SLO policy or projection status
  work will be less likely to repeat projection-authority documentation
  findings when the rationale is recorded near the policy.
metric: Future CodeRabbit or Local Qwen reviews of Evidence SLO projection
  policy do not repeat the missing derived-projection rationale finding.
baseline: Current validation enforces stale/missing propagation and missing
  dependency non-upgrade behavior, but the policy artifact has sparse rationale.
expected_direction: Projection authority remains easier to audit without
  weakening CLI-derived non-canonical status.
evaluation_window: Evaluate when a future work item changes
  `.bandit/policy/evidence-freshness-slos.json`, `src/state/cockpit-status.ts`,
  or focused session-context trust-signal behavior.
status: candidate
outcome: pending

### Chore Candidate: `BANDIT-056-COCKPIT-EVIDENCE-PATH-ALIAS`

candidate_id: BANDIT-056-COCKPIT-EVIDENCE-PATH-ALIAS
origin: CodeRabbit non-blocking Stage 4 finding from `BANDIT-056`.
source_work_item: BANDIT-056
source_artifacts:
  - docs/work/BANDIT-056/coderabbit-review.md
  - docs/work/BANDIT-056/coderabbit-finding-disposition.md
lesson: Cockpit status helper paths are repeated in multiple helper parameter
  shapes and could benefit from a shared type alias during future maintenance.
hypothesis: A shared alias will reduce review noise if cockpit trust-signal or
  gate-matrix helper inputs expand again.
metric: Future cockpit-status reviews do not repeat the evidence-path alias
  extraction finding after the next substantial edit.
baseline: Current cockpit-status behavior passes focused tests and derived
  output, but repeated path object shapes remain visible in helper signatures.
expected_direction: Cockpit status helper changes remain localized and easier
  to review.
evaluation_window: Evaluate the next time a work item materially changes
  `src/state/cockpit-status.ts` trust-signal or gate-matrix path helpers.
status: candidate
outcome: pending

## Stage-Rubric Check

| Stage | Verdict | Evidence |
| --- | --- | --- |
| Stage 3: Implementation Clean-Code Rubric | `blocker` | The `isRecord` array handling defect and template key mismatch require focused repair before Stage 4 can advance. |
| Stage 4: Review And Cross-Model Gates | `blocker` | CodeRabbit remains `blocker` with two repair-required findings. Two findings are accepted non-blocking follow-ups and two stylistic findings are no-action/opportunistic only. |

## Verification

- `npm run bandit -- evidence-freshness-slos validate --json` passed and shows the current Evidence SLO policy, trust-signal requirements, and derived projections are valid.
- `node --test test/evidence-freshness-slos.test.mjs test/cockpit-status.test.mjs test/writer-stream-sanitizer.test.mjs` passed with 30 tests.

## Next Action

Repair the two repair-required findings: the Evidence SLO template key mismatch
and `writer-stream-sanitizer` `isRecord` array rejection. Do not run another
CodeRabbit refresh solely for the derived-projection rationale, cockpit
evidence-path alias, line-count helper extraction, or redacted-field `Set`
suggestions.
