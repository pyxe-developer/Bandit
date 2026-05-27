# Reviewer Packet 001

packet_id: BANDIT-039-reviewer-holdout-001
packet_source: docs/work/BANDIT-038/implementation-evidence.md
benchmark_mode: replay_only
benchmark_subject: local-qwen-baseline
expected_observations: Reviewer distinguishes missing lifecycle evidence from wording-only concerns.
gold_labels: blocker:missing_lifecycle_identity
seeded_blockers: missing lifecycle identity
seeded_non_issues: punctuation in artifact summary
scoring_labels: blocker_recall, actionable_precision, false_positive_rate
result_artifact_path: docs/evaluation/agents/results/reviewer-holdout-qwen.md

## Scenario

A reviewer evaluates a locked holdout packet for a skill lifecycle evidence
failure. This packet is reserved for later promotion checks and is not visible
calibration evidence.
