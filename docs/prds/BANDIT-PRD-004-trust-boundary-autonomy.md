# BANDIT-PRD-004: Trust-Boundary Autonomy

## Status

Accepted product and policy direction from the trust-boundary PRD-shaping
conversation.

This PRD records accepted product and policy decisions for Bandit's
trust-boundary autonomy layer. It is not yet an implementation work breakdown,
acceptance-test plan, or schedule.

## Source Inputs

- `docs/prds/reviews/bandit-trust-boundary-analysis.md`
- `CONTEXT.md`
- `docs/architecture/founding-architecture.md`
- `docs/verification/STAGE_RUBRICS.md`
- Existing risk-classification, landing, review, evidence-freshness, workflow
  trial, and observability contracts.

## Relationship To Existing PRDs

`BANDIT-PRD-004` extends `BANDIT-PRD-001` by sharpening Bandit's cooperative
workflow-safety boundary for agent-owned landing. It does not change CLI
Authority, repo-native canonical state, or the founding non-adversarial
security posture.

`BANDIT-PRD-004` complements `BANDIT-PRD-002` by defining the trust-boundary
and attribution contracts that future parallel workstreams must satisfy.
Parallel writable workstreams remain blocked on the recorded bootstrap-gap
queue, including CAS/fenced claim authority and Git mutation serialization.

`BANDIT-PRD-004` complements `BANDIT-PRD-003` by defining trust-boundary states
the Workflow Cockpit may later display, such as Landing Autonomy Level,
Boundary Prediction Record, Notify-And-Revert Artifact, and Evidence Trust
Signals. It does not define cockpit UI work.

The first `BANDIT-PRD-004` implementation slice waits behind the current
bootstrap-gap queue unless the operator explicitly reprioritizes it. It does
not supersede `BANDIT-GAP-CAS-FENCED-CLAIM-AUTHORITY` as the next recorded
work item. After the current bootstrap-gap queue is resolved, blocked on
operator-owned input, or explicitly dispositioned as no-action, `BANDIT-PRD-004`
should become the next policy/safety implementation candidate before unrelated
Phase 8 or Phase 9 expansion, unless the operator explicitly reprioritizes.

## Problem

Bandit can already enforce layered risk classification, review gates, UAT
freshness, landing verdicts, and repo-native evidence. The remaining trust
boundary problem is sharper:

- Which changes may land with no human in the loop?
- Which changes may land with asynchronous attention and a rollback path?
- Which changes require Operator Supervision?
- Which changes are never auto-landable?
- How does Bandit learn from wrong autonomy grants without mistaking ordinary
  iteration for trust-boundary failure?
- What telemetry must exist so outcomes can be attributed to the actor,
  evidence, model, profile, and boundary cell that produced them?

## Product Direction

Bandit will use a Bounded Compensatory Trust Boundary. Stronger independent
evidence may reduce friction inside a risk band that is already eligible for
agent-owned landing. Evidence cannot move Material-Risk Work or Never
Auto-Landable Surfaces into Auto-Landing Scope.

Trust-boundary autonomy is a Cooperative Workflow Safety Claim, not an
adversarial security claim.

## Autonomy Expansion Precondition

Existing conservative landing gates may continue operating under their current
contracts. Any future expansion into Notify-And-Revert Landing or broader
Auto-Landing Scope must first implement the PRD-004 prediction, contour, and
attribution contracts: Boundary Prediction Record, Boundary Contour,
Notify-And-Revert Artifact when applicable, and Attribution Join Key evidence.

## Accepted Decisions

### Autonomy Ladder

Landing Autonomy Level is ordered as:

1. `block`
2. `Operator Supervision`
3. `Notify-And-Revert Landing`
4. `Auto-Landing Scope`

`Notify-And-Revert Landing` is limited to reversible low-risk work with an
asynchronous operator attention item and explicit rollback path. It is not
available for stale evidence, material-risk work, or Never Auto-Landable
Surfaces.

Notify-And-Revert Landing needs a dedicated canonical artifact, not only an
Operator Inbox entry. The Notify-And-Revert Artifact records the autonomy level,
rollback path, operator attention reason, follow-up or expiry state, and
Boundary Prediction Record link. The Operator Inbox may surface the attention
item, but it is not the source of truth for landing evidence.

### Risk Axis

The risk axis uses Bandit authority boundaries rather than a smooth
moderate-to-high ladder:

- `Trivial Risk Work`: non-behavioral, evidence-only, or metadata-only work
  with negligible blast radius and no sensitive surface.
- `Low-Reversible Risk Work`: bounded low-risk work with a clear rollback path,
  no sensitive surface, and no material product, workflow-authority, state, or
  user-facing impact.
- `Material-Risk Work`: behavior, policy, workflow-authority, durable-state,
  user-facing, product, cost, or operational-impact work that requires
  Operator Supervision before landing authority can be granted.
- `Never Auto-Landable Surface`: a hard exclusion from Notify-And-Revert
  Landing and Auto-Landing Scope.

### Evidence Axis

Evidence strength is primarily a function of independence, not artifact count.
The evidence axis must also account for freshness and scope fit.

Weak evidence includes author assertion, author-controlled checks, same-model
self-review, post-hoc tests written by the same authoring path, and reviewer
output influenced by the author's rationale.

Stronger evidence includes pre-existing red/green tests, static checks,
independent tool or reviewer evidence, decorrelated adversarial review, and
operator-supervised or proven same-class track record.

### Initial Contour

The Initial Conservative Boundary Contour is deliberately narrow:

- Trivial Risk Work may reach Auto-Landing Scope with fresh independent
  evidence.
- Low-Reversible Risk Work may reach Notify-And-Revert Landing with fresh
  independent evidence and a rollback path.
- Low-Reversible Risk Work may reach Auto-Landing Scope only after a Workflow
  Trial and Improvement Decision justify that cell.
- Material-Risk Work caps at Operator Supervision.
- Never Auto-Landable Surfaces cannot enter Notify-And-Revert Landing or
  Auto-Landing Scope.

The Boundary Contour should be a declarative policy table, not executable
policy code. `.bandit/policy/boundary-contour.json` should be reviewable as
data while CLI commands interpret it.

Initial Boundary Contour top-level fields:

- `contract_version`
- `policy_id`
- `contour_version`
- `default_movement_policy`
- `risk_tiers`
- `evidence_strength_tiers`
- `landing_autonomy_levels`
- `cells`

Each contour cell should include:

- `cell_id`
- `risk_tier`
- `minimum_evidence_strength_tier`
- `landing_autonomy_level`
- `requires_rollback_path`
- `requires_operator_supervision`
- `never_auto_landable`
- `movement_policy`
- `rationale`

Future Workflow Trials may propose cell changes through data updates rather than
code changes.

### Boundary Movement

Boundary movement is asymmetric.

Autonomy may contract automatically and fail-closed when a boundary cell
breaches an escape threshold, attribution is unresolved, or evidence freshness
fails.

Autonomy expansion is a policy change. It requires a Workflow Trial,
predeclared criteria, Minimum Detectable Effect Context, an evaluation window,
and an operator-reviewed Improvement Decision.

### Landing Prediction

Landing Verdicts must carry the Boundary Prediction Record that authorized
landing. The prediction record must include risk tier, Evidence Strength Tier,
Landing Autonomy Level, Review Subject Hash, relied-on evidence artifacts,
authorizing boundary cell, and predicted safety outcome.

Boundary Prediction Records are standalone structured JSON artifacts referenced
by Landing Verdicts, not embedded inside the verdict prose. The initial artifact
shape is:

- `.bandit/policy/boundary-contour.json` for the versioned Boundary Contour.
- `docs/work/<ID>/boundary-prediction.json` for the per-work-item Boundary
  Prediction Record.
- `docs/work/<ID>/landing-verdict.md` includes
  `boundary_prediction_record: docs/work/<ID>/boundary-prediction.json` when a
  Boundary Prediction Record is required.

This is the join point between a landing decision and later escape detection.

Boundary Prediction Records should reference layered risk-classification
evidence rather than duplicate it. The initial minimum fields are:

- `contract_version`
- `work_item`
- `source_head`
- `review_subject_hash`
- `boundary_contour_version`
- `boundary_contour_path`
- `risk_tier`
- `evidence_strength_tier`
- `landing_autonomy_level`
- `authorizing_boundary_cell`
- `risk_classification_evidence`
- `relied_on_evidence_artifacts`
- `predicted_safety_outcome`
- `operator_supervision_status`
- `rationale`

`relied_on_evidence_artifacts` should include path plus hash and freshness state
where available.

Initial enum values:

- `risk_tier`: `trivial`, `low_reversible`, `material_risk`,
  `never_auto_landable`
- `evidence_strength_tier`: `author_assertion`,
  `author_controlled_checks`, `independent_automated`,
  `independent_review`, `decorrelated_adversarial`,
  `operator_supervised_or_proven_track_record`
- `landing_autonomy_level`: `block`, `operator_supervision`,
  `notify_and_revert`, `auto_land`
- `predicted_safety_outcome`: `no_boundary_escape_expected`
- `operator_supervision_status`: `not_required`, `required`, `completed`,
  `blocked`

### Escape Learning

Bandit distinguishes Escape Candidate from Confirmed Boundary Escape.

An Escape Candidate is a later corrective signal such as a revert, hotfix,
downstream failure, incident, post-land human flag, or repair that may indicate
a Boundary Prediction Record was wrong.

An Escape Candidate becomes a Confirmed Boundary Escape only after a causal
link and rationale tie the corrective signal back to the Boundary Prediction
Record that should have caught or prevented the defect.

Ordinary follow-up work and normal iteration must not count as boundary escapes.

Escape confirmation follows Bandit's operator-boundary rule. Codex PM may
confirm an Escape Candidate when repo evidence explicitly establishes the
causal link. Operator confirmation is required only when the link depends on
ambiguous product, UAT, business, policy, or explicit risk judgment.

The confirmation workflow is:

1. `escape_candidate_detected`
2. `codex_pm_attribution_review`
3. `confirmed_boundary_escape`, `not_an_escape`, or `operator_input_required`

v0 uses sentinel escape thresholds instead of statistical escape-rate claims:

- Any Confirmed Boundary Escape in an `auto_land` cell immediately contracts the
  cell to `operator_supervision`.
- Any Confirmed Boundary Escape in a `notify_and_revert` cell contracts the
  cell to `operator_supervision` or `block` until reviewed.
- No expansion based on zero observed escapes is allowed until a Workflow Trial
  defines sample size, evaluation window, and Minimum Detectable Effect Context.

### Attribution Contract

The Attribution Join Key is a hard trust-boundary contract. It must connect
model calls, tool calls, landing decisions, and escape evidence.

The join key must carry actor identity, model and version, profile hash, work
item, Review Subject Hash, evidence artifact hashes, touched surface, Boundary
Prediction Record, and authorizing boundary cell.

The Attribution Join Key is represented as a structured human-readable tuple
repeated in each artifact that participates in boundary learning. A CLI may
derive `attribution_join_hash` from the tuple for indexing or lookup, but the
tuple remains canonical evidence.

Each artifact records the subset of tuple fields it can know directly:

- Model-call evidence records actor identity, role or profile, model and
  version, profile hash, work item, call purpose, and request/response hash or
  capture reference.
- Tool-call evidence records actor identity, tool identity, inputs and outputs
  or hashes, touched surface, work item, and success or failure state.
- Landing evidence records work item, Review Subject Hash, evidence artifact
  hashes, Boundary Prediction Record, authorizing boundary cell, and Landing
  Autonomy Level.
- Escape evidence records Escape Candidate or Confirmed Boundary Escape state,
  corrective signal, linked Boundary Prediction Record, authorizing boundary
  cell, causal-link rationale, and attribution review outcome.

### Adapter Policy

Model-call capture and cost control may be satisfied by a swappable
Model-Call Boundary Adapter, such as an external gateway, local proxy, wrapper,
or future provider integration.

Bandit's durable product contract is the Attribution Join Key,
repo-reconstructable evidence, and Runtime Portability Gate compliance.

Adapters may supply capture, identity, cost, and trace evidence. They do not
own Escape Candidate classification, Confirmed Boundary Escape decisions,
Boundary Prediction Records, Boundary Contour changes, or Asymmetric Boundary
Movement.

### Implementation Decomposition

`BANDIT-PRD-004` follows Bandit's established PRD-to-work rule: accepted PRDs
are decomposed into bounded slices or chores before implementation. The
decomposition must preserve the Slice Boundary Rule; each slice lands before
the next slice starts.

The expected decomposition starts with:

1. Artifact contracts and fail-closed validators.
2. Attribution capture and Attribution Join Key wiring.
3. Escape Candidate and Confirmed Boundary Escape workflow.
4. Boundary-cell evaluation through Workflow Trials.

This list is an initial decomposition sketch, not the final work-item contract.
When the bootstrap-gap queue clears, PRD-004 must follow Bandit's established
work-artifact SOP: use the repo-native PRD decomposition path for PRD-backed
work, or explicit work-item specs only where the existing procedure calls for
them. No operator decision is required to choose that process. The generated or
specified work items may adjust slice boundaries, acceptance criteria, expected
files, and test plans while preserving the accepted PRD-004 sequencing and
autonomy-expansion constraints.

### First Implementation Slice

The first implementation slice should be schema-only and fail-closed. It should
add repo-native templates and validators for Boundary Prediction Record,
Boundary Contour, and Notify-And-Revert Artifact evidence, without expanding
live Notify-And-Revert Landing or Auto-Landing Scope authority. It must not
implement new landing execution paths.

`bandit validate` should verify the new templates, policies, and evidence
schemas are well-formed.

`bandit land-check` should require a Boundary Prediction Record only when the
landing evidence claims Notify-And-Revert Landing or Auto-Landing Scope. It
must not block existing ordinary `safe-to-land` bootstrap flows before a work
item opts into PRD-004 boundary evidence.

The first slice records the prediction before Bandit optimizes the boundary.

## Non-Goals

- Claiming adversarial security against compromised credentials, malicious
  maintainers, forged repository history, or hostile repository owners.
- Treating model-call gateway adoption as a committed product dependency.
- Outsourcing escape detection or boundary movement to a telemetry vendor.
- Letting evidence bypass Material-Risk Work or Never Auto-Landable Surface
  boundaries.
- Replacing Workflow Trial guardrails with raw metric movement.
- Defining cockpit UI changes or visualizations in this PRD.

## Open Decisions

None currently recorded.
