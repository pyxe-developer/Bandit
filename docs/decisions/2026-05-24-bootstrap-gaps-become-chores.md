# Bootstrap Gaps Become Chores

## Decision

At this stage of Bandit, bootstrap gaps must become executable gap-resolution
work. A newly identified bootstrap gap must become the next work item, and that
work item should be a chore. After the current active slice lands, already
recorded open gaps become the work queue and must be addressed one at a time
before unrelated new work proceeds.

The chore should correct the gap directly, convert it into an enforced
artifact/command/validator/agent contract, or record an explicit no-action
policy decision. The gap should not remain as passive context while unrelated
slice or feature work continues.

## Rationale

Bandit exists to make agentic workflows measurably better over time. A passive
gap list preserves honesty, but it does not improve the workflow by itself. If
the project identifies a missing gate, missing artifact, missing command, or
missing enforcement path during bootstrap, the next useful action is to close
that loop.

This also preserves the original Sourmash lesson: important workflow context
and decisions must become durable repo-native artifacts, not chat memory or
background assumptions.

## Policy Direction

- Bootstrap gaps may be recorded only to avoid pretending a final gate ran.
- A newly identified bootstrap gap should route the next work item to a chore.
- After the current active slice lands, open ledger gaps should route the next
  work items one at a time until every gap is resolved, blocked on
  operator-owned input, or explicitly dispositioned as no-action.
- Each chore should have source metadata naming the gap, source artifact,
  hypothesis, expected improvement, metric or verification target, and closeout
  criteria.
- Unrelated feature or slice work should wait until the gap is corrected,
  enforced, or explicitly dispositioned.
- If closing the gap needs product direction, UAT, business tradeoff, policy
  change, or explicit cost/risk override, Codex PM should halt and ask the
  operator for that input.

## Consequences

- After `BANDIT-013` lands, the next work item changes from Phase 5
  auto-landing work to the bootstrap-gap resolution lane.
- Future retrospectives and closeout artifacts should not add meaningful gaps
  without either creating the next chore or recording why no action is required.
