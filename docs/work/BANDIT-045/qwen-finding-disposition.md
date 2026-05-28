# BANDIT-045 Local Qwen Finding Disposition

recorded_time_utc: 2026-05-28T18:12:44Z
work_item: BANDIT-045
latest_review_head: 146f36d970f5a7e40a7b06f1d4aae365d985207b
current_review_subject_hash: b72f2c8ef205d82d94226df8a124583239a9414e40a003917ee7c46edd5d4ab4
disposition_state: findings_disposition_recorded

## Source Evidence

- `docs/work/BANDIT-045/local-qwen-review.md`
- `docs/work/BANDIT-045/implementation-evidence.md`
- `docs/work/BANDIT-045/brief.md`

Local Qwen returned a `non_blocking` Stage 4 verdict for `BANDIT-045` at
source head `146f36d970f5a7e40a7b06f1d4aae365d985207b`.

## PM Disposition

| Finding | Verdict | Rationale | Durable routing |
| --- | --- | --- | --- |
| `src/state/claim-authority.ts`, `src/state/claim-projections.ts`, `src/state/claim-safety-simulation.ts`, and `src/state/work-surface-graph.ts` duplicate validation helper functions. | `accepted_non_blocking` | The duplication is real clean-code debt, but the current implementation is still readable, local to the first claim-authority validator surfaces, and covered by focused tests. Extracting the helpers now would touch multiple fail-closed validation modules after Stage 3 without changing the accepted CAS/fencing/idempotency/graph behavior. | Queue follow-up candidate `BANDIT-045-CLAIM-VALIDATION-HELPER-EXTRACTION`; no source repair for `BANDIT-045`. |
| `src/state/claim-safety-simulation.ts` uses string-based conditional routing for scenario evaluation rather than a scenario registry or strategy map. | `accepted_non_blocking` | The current explicit routing is small, deterministic, and sufficient for the declared Claim Safety Invariants in this chore. A registry will become useful if later claim, serializer, or worktree-bootstrap simulations add more scenarios, but it is not required to accept the current simulation evidence. | Queue follow-up candidate `BANDIT-045-CLAIM-SIMULATION-SCENARIO-REGISTRY`; no source repair for `BANDIT-045`. |

## Durable Follow-Up Candidates

### Chore Candidate: `BANDIT-045-CLAIM-VALIDATION-HELPER-EXTRACTION`

candidate_id: BANDIT-045-CLAIM-VALIDATION-HELPER-EXTRACTION
origin: Local Qwen non-blocking Stage 4 finding from `BANDIT-045`.
source_work_item: BANDIT-045
source_artifacts:
  - docs/work/BANDIT-045/local-qwen-review.md
  - docs/work/BANDIT-045/qwen-finding-disposition.md
lesson: Claim-authority validation modules repeat record and primitive-field
  readers that can become harder to keep consistent as claim authority expands.
hypothesis: Extracting shared validation readers before the next substantial
  claim-authority policy expansion will reduce duplicated failure-path logic
  without changing source-of-truth boundaries.
metric: Future Stage 4 reviews of claim-authority, projection, simulation, or
  work-surface graph work do not repeat the duplicated validation-helper
  finding.
baseline: `BANDIT-045` keeps repeated helper functions inside four focused
  modules while the first claim-authority contract is still stabilizing.
expected_direction: Claim-authority maintenance becomes easier to audit without
  weakening fail-closed diagnostics.
evaluation_window: Evaluate when a future work item changes any of
  `src/state/claim-authority.ts`, `src/state/claim-projections.ts`,
  `src/state/claim-safety-simulation.ts`, or `src/state/work-surface-graph.ts`.
status: candidate
outcome: pending

### Chore Candidate: `BANDIT-045-CLAIM-SIMULATION-SCENARIO-REGISTRY`

candidate_id: BANDIT-045-CLAIM-SIMULATION-SCENARIO-REGISTRY
origin: Local Qwen non-blocking Stage 4 finding from `BANDIT-045`.
source_work_item: BANDIT-045
source_artifacts:
  - docs/work/BANDIT-045/local-qwen-review.md
  - docs/work/BANDIT-045/qwen-finding-disposition.md
lesson: Claim Safety Invariant simulation currently routes scenarios through
  explicit string conditionals, which is acceptable for the first scenario set
  but can become harder to extend.
hypothesis: A scenario registry or strategy map will be worth extracting if
  future Git Mutation Serializer or Worktree Bootstrap Contract simulations add
  materially more scenario types.
metric: Future claim-safety simulation extensions can add scenarios without
  growing a brittle conditional chain or repeating this Local Qwen finding.
baseline: `BANDIT-045` implements a small deterministic scenario router for the
  first CAS/fencing/idempotency/worktree-lock invariant set.
expected_direction: Simulation extensibility improves only when scenario count
  or scenario ownership justifies the extra abstraction.
evaluation_window: Evaluate during `BANDIT-GAP-GIT-MUTATION-SERIALIZER`,
  `BANDIT-GAP-WORKTREE-BOOTSTRAP-CONTRACT`, or the next work item that changes
  `src/state/claim-safety-simulation.ts`.
status: candidate
outcome: pending

## Stage-Rubric Check

| Stage | Verdict | Evidence |
| --- | --- | --- |
| Stage 3: Implementation Clean-Code Rubric | `pass` | The accepted Qwen findings are maintainability hardening, not blockers. The implementation remains scoped to claim-authority contract validation, projection checks, Work-Surface Wait-For Graph behavior, deterministic simulation, focused tests, and required repo evidence. |
| Stage 4: Review And Cross-Model Gates | `non_blocking` | CodeRabbit passed with no findings. Local Qwen returned non-blocking findings with no operator input required, and this artifact records concrete PM disposition plus durable follow-up routing. |

## Verification

Required verification for this disposition:

- `node --test test/claim-authority.test.mjs test/claim-safety-simulation.test.mjs test/work-surface-graph.test.mjs`
- `npm run typecheck`
- `npm run bandit -- claim validate --json`
- `npm run bandit -- validate`
- `npm run bandit -- gaps list`
- `node ./bin/bandit.mjs review-subject-hash BANDIT-045`
- `node ./bin/bandit.mjs cockpit status --json`
- `git diff --check`

## Next Action

Record aggregate Stage 4 review evidence for `BANDIT-045` using CodeRabbit pass
evidence, Local Qwen `non_blocking` evidence, this PM disposition, required
risk/supply-chain evidence, and the current review-subject hash. Do not create
landing verdict, landing action, retrospective, the next bootstrap-gap chore,
or unrelated Phase 8 work until aggregate Stage 4 review evidence is recorded.
