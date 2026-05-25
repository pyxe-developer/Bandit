# BANDIT-025 Local Qwen Finding Disposition

## Status

`pass` for the Stage 4 PM disposition and durable routing step on 2026-05-25.

## Source Evidence

- `docs/work/BANDIT-025/local-qwen-review.md`
- `docs/work/BANDIT-025/implementation-evidence.md`
- `docs/work/BANDIT-025/brief.md`

Local Qwen returned `non_blocking` at source head
`46455616e3c579ebbd05f92f8d87f80053de55bb`. Codex PM accepts the findings as
real hardening concerns, not current landing blockers, because the implemented
foundation preserves the slice contract: coordination state is repo-native and
CLI-authoritative, actor events do not advance workflow state, evidence
references fail closed on missing paths, and no claim lease, scheduler,
worktree, cockpit, UAT, merge, push, deploy, or Phase 7 behavior was
introduced.

## PM Disposition

| Finding | Verdict | Rationale | Durable routing |
| --- | --- | --- | --- |
| Coordination log events include a template timestamp, but parser validation does not validate or parse `timestamp`. | `non_blocking` | The current parser already validates version, event type, work item, sequence, actor, source, state, evidence references, and transition ordering. Missing timestamp validation weakens audit fidelity, but it does not let malformed workflow authority, unsafe evidence, missing evidence, actor-event completion, or illegal regressions pass. | Chore candidate: `BANDIT-025-TIMESTAMP-VALIDATION`. |
| `readWorkType` derives slice/chore type by regex from work item Markdown. | `non_blocking` | The helper is isolated to read-only coordination status, defaults conservatively to `slice`, and does not write canonical state. It is fragile against future Markdown format changes, but it does not alter the coordination log authority contract. | Chore candidate: `BANDIT-025-WORK-TYPE-PARSING`. |
| Evidence reconciliation checks path existence with `access()` but does not verify content or hashes. | `non_blocking` | Existence checking is sufficient for this foundation slice's accepted evidence-reference contract and fail-closed missing-path behavior. Content/hash reconciliation is a deeper integrity layer and should be scoped deliberately so it does not redefine Stage 4 review-subject hash behavior. | Chore candidate: `BANDIT-025-EVIDENCE-INTEGRITY`. |

## Durable Chore Candidates

These candidates are durable routing for the accepted non-blocking findings.
They do not reopen Stage 3 or Stage 4 for `BANDIT-025`; they should be
considered when the relevant coordination parser, work-item reader, or evidence
integrity path is next touched.

### Chore Candidate: `BANDIT-025-TIMESTAMP-VALIDATION`

origin: Local Qwen non-blocking hardening finding from `BANDIT-025`.
source_work_item: BANDIT-025
source_artifacts:
  - docs/work/BANDIT-025/local-qwen-review.md
  - docs/work/BANDIT-025/qwen-finding-disposition.md
lesson: Coordination log timestamp fields should eventually be validated as
  well-formed timestamps instead of only being documented in the template.
hypothesis: Timestamp validation will improve audit fidelity and reduce
  repeated reviewer concern without changing workflow-state authority.
metric: Future Stage 4 reviews of coordination-log parser work do not repeat
  the missing timestamp validation finding.
baseline: `BANDIT-025` lands with fail-closed authority checks but without
  timestamp parsing or validation.
expected_direction: Review concern about coordination event audit metadata
  decreases while parser refusal behavior remains clear.
evaluation_window: Evaluate when coordination-log event parsing or the
  coordination-log template is next changed.
status: queued_candidate
linked_work_item: none_yet
outcome: pending

### Chore Candidate: `BANDIT-025-WORK-TYPE-PARSING`

origin: Local Qwen non-blocking hardening finding from `BANDIT-025`.
source_work_item: BANDIT-025
source_artifacts:
  - docs/work/BANDIT-025/local-qwen-review.md
  - docs/work/BANDIT-025/qwen-finding-disposition.md
lesson: Coordination status should eventually derive work-item type from a
  structured work-item field instead of a raw Markdown regex.
hypothesis: Structured work-type parsing will reduce fragility when work-item
  Markdown changes while preserving read-only coordination status behavior.
metric: Future Stage 4 reviews of work-item reader or coordination-status work
  do not repeat the regex-derived work type finding.
baseline: `BANDIT-025` status reporting defaults safely to `slice` when no
  work_type field is found, but the helper still depends on Markdown shape.
expected_direction: Markdown-format drift risk decreases without adding a new
  source of truth.
evaluation_window: Evaluate when `src/state/work-items.ts` or coordination
  status work-type reporting is next changed.
status: queued_candidate
linked_work_item: none_yet
outcome: pending

### Chore Candidate: `BANDIT-025-EVIDENCE-INTEGRITY`

origin: Local Qwen non-blocking hardening finding from `BANDIT-025`.
source_work_item: BANDIT-025
source_artifacts:
  - docs/work/BANDIT-025/local-qwen-review.md
  - docs/work/BANDIT-025/qwen-finding-disposition.md
lesson: Coordination evidence reconciliation may eventually need content or
  hash validation instead of path-existence checks alone.
hypothesis: A scoped evidence-integrity contract will make coordination
  transitions more auditable without confusing coordination evidence with
  Stage 4 review-subject freshness.
metric: Future Stage 4 reviews of coordination evidence reconciliation do not
  repeat the path-existence-only finding, and land-check review-subject hash
  semantics remain fail-closed.
baseline: `BANDIT-025` validates safe relative paths and missing evidence
  references, but does not verify evidence contents or hashes.
expected_direction: Evidence confidence increases without creating hidden
  source-of-truth behavior.
evaluation_window: Evaluate when coordination evidence reconciliation or
  review-subject hash policy is next changed.
status: queued_candidate
linked_work_item: none_yet
outcome: pending

## Stage-Rubric Check

- Stage 4 Review And Cross-Model Gates: `pass` for PM disposition and durable
  routing. Local Qwen evidence is current for the implementation source head,
  findings are accepted with concrete rationale, and all three findings are
  routed to durable chore candidates.
- Operator input: `none_required`. The findings are routine hardening and
  technical routing decisions under Codex PM ownership.
- Bootstrap gaps: `none`. No missing final gate is being claimed as passed by
  this disposition artifact.

## Next Action

Record aggregate Stage 4 review evidence for `BANDIT-025` with current
`review_subject_hash`, CodeRabbit bootstrap replacement evidence, Local Qwen
`non_blocking` state, this PM disposition, and
`non_blocking_findings_routing` entries for the three durable chore candidates.
