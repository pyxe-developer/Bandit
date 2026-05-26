# BANDIT-031 Local Qwen Finding Disposition

## Summary

Local Qwen returned a `non_blocking` Stage 4 verdict for `BANDIT-031` at source
head `c2ae27c52d838927cfe0172fe7e98adf142ead11`.

Codex PM accepts the implementation for Stage 4. CodeRabbit passed with zero
findings after the dynamic improvement-candidate source repair. The remaining
Qwen findings are real foundation hardening observations, but they do not block
landing because the current slice is intentionally the smallest read-only
cockpit status foundation, exposes explicit source paths, fails closed for
missing and contradictory required artifacts, creates no hidden cockpit
authority, and introduces no visual UI, server mode, scheduler, worktree,
claim, deploy, UAT, actor identity, PR/CI, or state-index behavior.

## Findings

### Blocker Summary Breadth

**Finding:** `blockers` currently reports an empty list instead of parsing every
possible blocker from repo-native artifacts.

**Disposition:** `non_blocking` follow-up candidate.

**Rationale:** Current repo artifacts record no operator-owned input blocker and
no active bootstrap gap blocker for `BANDIT-031`. Returning an empty blocker list
for the current clean state is accurate for this foundation slice. Broader
blocker extraction across future claimability, UAT, scheduler, and worktree
states should be added when those surfaces exist.

### Gate Summary Breadth

**Finding:** Gate reporting is narrow and currently exposes Stage 2 RED evidence
plus nearby readiness summaries rather than a complete Stage 0 through Stage 6
gate dashboard.

**Disposition:** `non_blocking` follow-up candidate.

**Rationale:** The accepted slice boundary was a minimal read-only status
foundation, not the full cockpit gate matrix. The payload already reports
bootstrap gaps, landing readiness, UAT status, improvement health, coordination
state, source links, and Stage 2 evidence. A fuller gate matrix is appropriate
for the next cockpit status expansion.

### Next-Action Agreement Heuristic

**Finding:** `matchingActionTopic` uses hardcoded topic terms to accept
semantically equivalent `CURRENT_CONTEXT.md` and `ROADMAP.md` next-action text.

**Disposition:** `non_blocking` follow-up candidate.

**Rationale:** The heuristic is bounded to current known Phase 8 wording and
still fails closed when neither exact text nor known work-item/topic agreement
is present. Generalizing this into structured context state is useful but would
widen the current foundation slice after Stage 3 and the focused Stage 4 repair.

### Explicit Stale Marker Handling

**Finding:** The command fails closed for missing or contradictory required
artifacts but does not add explicit timestamp or stale-marker evaluation.

**Disposition:** `non_blocking` follow-up candidate.

**Rationale:** Existing Bandit landing gates own review-source freshness and
review-subject hash checks. The cockpit foundation should display those
repo-native gate states before it invents a separate staleness model. Extending
the status payload to summarize explicit stale gate evidence belongs in the next
cockpit gate-matrix hardening slice.

## Durable Routing

### Chore Candidate: `BANDIT-031-COCKPIT-STATUS-COVERAGE-HARDENING`

origin: Local Qwen non-blocking Stage 4 findings from `BANDIT-031`.
source_work_item: BANDIT-031
source_artifacts:
  - docs/work/BANDIT-031/local-qwen-review.md
  - docs/work/BANDIT-031/qwen-finding-disposition.md
lesson: Workflow cockpit status should expand beyond the first read-only
  foundation to summarize blocker, gate, next-action agreement, and stale
  evidence states from structured repo-native sources.
hypothesis: The cockpit will be more useful and less brittle if future status
  work replaces bounded Markdown heuristics with broader structured gate and
  blocker summaries while preserving CLI authority.
metric: Future Stage 4 reviews of cockpit status work do not repeat blocker
  breadth, gate breadth, next-action heuristic, or stale-marker findings.
baseline: `BANDIT-031` provides the first read-only status payload with source
  links, fail-closed missing/contradictory source checks, and dynamic
  improvement-candidate source discovery, but keeps full gate and blocker
  breadth out of scope.
expected_direction: Cockpit status remains repo-native and fail-closed while
  reviewer findings about status breadth and brittle Markdown heuristics
  decrease.
evaluation_window: Evaluate when the next cockpit status, gate matrix, blocker
  summary, claimability, or structured current-context slice is changed.
status: planned
linked_work_item: BANDIT-032
outcome: pending
