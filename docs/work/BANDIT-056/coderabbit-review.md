# CodeRabbit Review: BANDIT-056

contract_version: 1
work_item: BANDIT-056
source_head: b31c336167918bb5a114e78a813458182e320dc9
source_head_meaning: latest completed CodeRabbit-reviewed source head; local repair evidence is recorded separately and still requires focused provider refresh.
repair_commit: e91081a57076120b236e0ba0fd48dd906ee2504e
provider: coderabbit-agent-pre-pr
review_target: local-diff:c5eb2700502237e3269a82818edd994a4006d878
review_state: completed
coderabbit_verdict: blocker
findings_status: locally_resolved_pending_refresh
findings_disposition: Codex PM locally repaired the seven focused CodeRabbit findings. Source-head metadata now documents that source_head is the latest completed CodeRabbit-reviewed source head and repair_commit is the local repair commit. The no-bootstrap-gap list is normalized as an empty bootstrap_gaps field. Evidence Freshness SLO validation now fails closed for missing artifact_types, required trust signal fields, malformed derived projection rules, and missing cannot_upgrade_missing_dependency_to_trusted. The production template now scaffolds cannot_upgrade_missing_dependency_to_trusted. Cockpit status computes review and landing evidence existence once and reuses those flags for stale-evidence and trust-signal generation. CodeRabbit evidence is stale until a focused refresh runs on the repaired source; do not proceed to Local Qwen, aggregate Stage 4 review, landing, retrospective, another work item, or unrelated Phase 8 work before that refresh or explicit provider-refusal/bootstrap-gap replacement evidence.
operator_input_status: none_required
source_drift_status: stale
executable_evidence:
  - coderabbit --version returned 0.4.1.
  - coderabbit auth status --agent returned authenticated for GitHub user pyxe-developer.
  - coderabbit review --agent --base-commit c5eb2700502237e3269a82818edd994a4006d878 -c AGENTS.md --no-color completed with 7 findings at source head b31c336167918bb5a114e78a813458182e320dc9.
  - e91081a57076120b236e0ba0fd48dd906ee2504e repairs the seven focused CodeRabbit findings locally.
  - node --test test/evidence-freshness-slos.test.mjs passed after the local repair.
  - node --test test/cockpit-status.test.mjs passed after the local repair.
  - node --test test/focused-session-context.test.mjs passed after the local repair.
  - npm run typecheck passed after the local repair.
  - npm test passed after the local repair.
  - npm run bandit -- evidence-freshness-slos validate --json passed after the local repair.
  - npm run bandit -- coderabbit-review BANDIT-056 passed after the local repair with findings_status locally_resolved_pending_refresh.
  - npm run bandit -- validate passed after the local repair.
  - node ./bin/bandit.mjs cockpit status --json passed after the local repair and reports focused CodeRabbit refresh as the next action.
  - node ./bin/bandit.mjs session-context current --json passed after the local repair and reports focused CodeRabbit refresh as the allowed action.
  - git diff --check passed after the local repair.
resolved_or_dispositioned_findings:
  - severity: minor
    file: docs/specs/BANDIT-056-coderabbit-review-output.json
    finding: Top-level sourceHead is inconsistent with the most recent repair attempt; verify whether it should represent the original review target or latest repaired state.
    disposition: Repaired locally by documenting that top-level sourceHead is the latest completed CodeRabbit-reviewed source head and adding latestRepairHead for the local repair head in the normalized provider output.
  - severity: minor
    file: docs/work/BANDIT-056/coderabbit-review.md
    finding: Metadata is ambiguous about whether source_head refers to the reviewed commit or repaired commit; add a clear repair_commit field or document the source_head rule.
    disposition: Repaired locally by adding source_head_meaning and repair_commit metadata fields.
  - severity: trivial
    file: docs/work/BANDIT-056/coderabbit-review.md
    finding: bootstrap_gaps uses a list containing none while related JSON artifacts use an empty array; normalize or document the semantic difference.
    disposition: Repaired locally by normalizing bootstrap_gaps to an empty list in this artifact.
  - severity: minor
    file: src/state/evidence-freshness-slos.ts
    finding: Policy validation fails open when artifact_types or trust-signal requirements are missing; enforce required artifact_types and trust signals fail-closed.
    disposition: Repaired locally by requiring artifact_types and trust_signal_requirements arrays and their required Evidence Freshness SLO entries.
  - severity: trivial
    file: src/state/cockpit-status.ts
    finding: reviewEvidencePath and landingVerdictPath existence checks are duplicated between readStaleEvidence and buildCockpitTrustSignals; compute them once or return the flags.
    disposition: Repaired locally by computing evidence artifact existence once and reusing the flags in stale-evidence and trust-signal generation.
  - severity: minor
    file: src/state/evidence-freshness-slos.ts
    finding: validateDerivedProjectionRules should enforce both propagate_missing_or_stale_dependencies and cannot_upgrade_missing_dependency_to_trusted as true.
    disposition: Repaired locally by requiring both derived projection guardrails to be true.
  - severity: minor
    file: docs/templates/evidence-freshness-slos.md
    finding: derived_projection_rules scaffold is missing cannot_upgrade_missing_dependency_to_trusted.
    disposition: Repaired locally by adding cannot_upgrade_missing_dependency_to_trusted to the template scaffold.
bootstrap_gaps:
