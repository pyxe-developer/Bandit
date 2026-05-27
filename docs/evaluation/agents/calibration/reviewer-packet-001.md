# Reviewer Packet 001

packet_id: BANDIT-039-reviewer-packet-001
packet_source: docs/work/BANDIT-038/review-evidence.md
benchmark_mode: replay_only
benchmark_subject: local-qwen-baseline
expected_observations: Reviewer flags missing stable skill lifecycle version evidence.
gold_labels: blocker:missing_skill_version
seeded_blockers: missing stable skill lifecycle version
seeded_non_issues: template wording preference
scoring_labels: blocker_recall, false_positive_rate
result_artifact_path: docs/evaluation/agents/results/reviewer-calibration-qwen.md

## Scenario

A reviewer evaluates a repo-derived Bandit failure mode where a load-bearing
skill is used without stable lifecycle identity and version evidence.
