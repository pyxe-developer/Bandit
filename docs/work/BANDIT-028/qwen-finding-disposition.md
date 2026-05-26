# BANDIT-028 Local Qwen Finding Disposition

## Status

`pass` for the Stage 4 Codex PM disposition and durable routing step on
2026-05-26.

## Source Evidence

- `docs/work/BANDIT-028/local-qwen-review.md`
- `docs/work/BANDIT-028/coderabbit-review.md`
- `docs/work/BANDIT-028/implementation-evidence.md`
- `docs/work/BANDIT-028/brief.md`
- `test/coordination-log.test.mjs`
- `src/commands/coordination.ts`
- `src/state/coordination-log.ts`

Local Qwen returned `non_blocking` at source head
`65af75cd5cf4397ad66afe05285452e8dd5ec915`. The finding says the
implementation does not validate invalid actors or missing evidence paths before
appending actor coordination events.

## PM Disposition

| Finding component | Verdict | Rationale | Durable routing |
| --- | --- | --- | --- |
| Missing evidence path validation for actor events. | `not_applicable` | Repo evidence shows this concern is already covered. `complete` events require at least one `--evidence` reference, `parseCoordinationEvents` validates candidate log evidence before append, and `test/coordination-log.test.mjs` proves a missing evidence reference refuses before writing. | No follow-up required for missing evidence path validation in this slice. |
| Invalid actor validation. | `non_blocking` | The command requires non-empty `--actor`, `--source`, and `--summary`, and parsed logs require string actor fields. The brief asks for invalid actor refusal, but the repo does not yet define a canonical actor identity policy, actor registry, or actor syntax beyond non-empty string validation. Adding one during Stage 4 disposition would invent policy and broaden this slice. The risk is acceptable for `BANDIT-028` because actor coordination events remain advisory: they do not advance workflow state, emit safe triggers, satisfy typed extension checkpoints, or satisfy review, landing, UAT, chore-disposition, or closeout gates. | Chore candidate: `BANDIT-028-ACTOR-IDENTITY-VALIDATION`. |

## Durable Chore Candidate

### Chore Candidate: `BANDIT-028-ACTOR-IDENTITY-VALIDATION`

origin: Local Qwen non-blocking hardening finding from `BANDIT-028`.
source_work_item: BANDIT-028
source_artifacts:
  - docs/work/BANDIT-028/local-qwen-review.md
  - docs/work/BANDIT-028/qwen-finding-disposition.md
lesson: Coordination event commands need a durable actor identity contract before
  they can reject semantically invalid actors rather than only missing or
  non-string actor fields.
hypothesis: Defining and enforcing actor identity syntax or registry rules will
  reduce ambiguous coordination-event authorship without giving actor events
  workflow-state authority.
metric: Future Stage 4 reviews of coordination event command work do not repeat
  invalid actor validation as an open finding.
baseline: `BANDIT-028` requires non-empty actor strings and preserves
  actor-event non-authority, but does not enforce a canonical actor identity
  policy.
expected_direction: Actor attribution becomes more consistent while step
  transitions remain the only workflow-state authority.
evaluation_window: Evaluate when actor identity policy, coordination event
  validation, claim leases, or work surface reservation work is next touched.
status: queued_candidate
linked_work_item: none_yet
outcome: pending

## Stage-Rubric Check

- Stage 4 Review And Cross-Model Gates: `pass` for PM disposition and durable
  routing. Local Qwen evidence is current for the reviewed source head, the
  missing evidence path concern is rejected from repo evidence, and the real
  actor identity validation concern is accepted as non-blocking with durable
  routing.
- Operator input: `none_required`. The finding is a routine technical routing
  and hardening decision under Codex PM ownership.
- Bootstrap gaps: `none`. This is a follow-up validation candidate, not a
  missing final Bandit gate.
- Clean-code status: `pass`. No code was changed; the disposition preserves
  small slice scope, explicit state authority, failure clarity, and improvement
  capture.

## Next Action

Record aggregate Stage 4 review evidence for `BANDIT-028` with current
`review_subject_hash`, CodeRabbit pre-PR pass evidence, Local Qwen
`non_blocking` state, this PM disposition, and
`non_blocking_findings_routing` for `BANDIT-028-ACTOR-IDENTITY-VALIDATION`.
