# BANDIT-029 Local Qwen Finding Disposition

## Summary

Local Qwen returned a `non_blocking` Stage 4 verdict for `BANDIT-029` at
source head `a5b840b57dd825d03d71ab7b00e217384cf7d3fa`.

Codex PM accepts the implementation for Stage 4. The findings are real
hardening observations, but they do not block landing because the slice is
bounded to the first deterministic Phase 7 foundation, the command surface is
read-only for candidate discovery, evaluation validation is fail-closed, and
repo-native artifacts remain canonical.

## Findings

### Markdown scan memory pressure

**Finding:** `readWorkMarkdownArtifacts` loads all Markdown files under
`docs/work/**/*.md` into memory before candidate filtering.

**Disposition:** `non_blocking` follow-up candidate.

**Rationale:** The current repo-scale candidate report completes successfully
and this slice intentionally avoids scheduler, index, cache, or cockpit
authority. Streaming or earlier filtering is a useful scale hardening option
when improvement candidate discovery is next expanded, but changing it now
would widen the slice after Stage 3 passed.

### Required hypothesis metadata

**Finding:** `REQUIRED_CANDIDATE_FIELDS` requires `hypothesis`; historical
retrospective artifacts without this field will fail closed.

**Disposition:** `non_blocking` no-action for this slice.

**Rationale:** Fail-closed metadata is the intended foundation behavior. The
real repo candidate report currently discovers `BANDIT-025` and `BANDIT-028`
candidates with complete metadata, and incomplete legacy candidates should not
be silently promoted into evaluable improvement work. Future migration or
backfill work can add compatibility rules if the operator chooses to evaluate
older incomplete artifacts.

### Continuation indentation strictness

**Finding:** `parseMetadataFields` continuation parsing assumes two or more
spaces of indentation.

**Disposition:** `non_blocking` follow-up candidate.

**Rationale:** Current templates and artifacts use this metadata style, and
the tests cover the intended continuation contract. Parser hardening is
appropriate when artifact metadata format support broadens, but it is not a
blocker for this narrow Phase 7 foundation.

## Durable Routing

### Chore Candidate: `BANDIT-029-IMPROVEMENT-SCALING-AND-PARSER-HARDENING`

origin: Local Qwen non-blocking hardening findings from `BANDIT-029`.
source_work_item: BANDIT-029
source_artifacts:
  - docs/work/BANDIT-029/local-qwen-review.md
  - docs/work/BANDIT-029/qwen-finding-disposition.md
lesson: Improvement candidate discovery should eventually harden repository
  scanning and metadata continuation parsing before Bandit relies on this path
  at larger scale.
hypothesis: Improvement candidate discovery will remain easier to trust at larger repo scale if Markdown scanning and metadata continuation handling are hardened without introducing hidden index authority.
metric: Future Stage 4 reviews of improvement candidate discovery or metadata parsing do not repeat memory pressure or strict continuation parsing findings.
baseline: `BANDIT-029` discovers current repo candidates successfully with read-only full-Markdown scanning and a documented two-space continuation metadata parser.
expected_direction: Candidate discovery remains repo-native and fail-closed while scale and metadata-format concerns decrease.
evaluation_window: Evaluate when improvement candidate discovery, metadata parsing, or artifact format compatibility is next changed.
status: queued_candidate
linked_work_item: none_yet
outcome: pending
