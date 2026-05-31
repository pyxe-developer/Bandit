# CodeRabbit Review: BANDIT-056

contract_version: 1
work_item: BANDIT-056
source_head: 1089c6b86e7f912a4e285fc11ef4845b68ab4504
provider: coderabbit-agent-pre-pr
review_target: local-diff:c5eb2700502237e3269a82818edd994a4006d878
review_state: completed
coderabbit_verdict: blocker
findings_status: locally_resolved_pending_refresh
findings_disposition: Codex PM locally repaired both focused CodeRabbit findings. Focused session-context stage evidence metadata is now defined once and reused for required evidence paths and trust-signal dependency evaluation. Session-context now mirrors cockpit status for stale Stage 4 review evidence by exposing a review_evidence dependency with review_subject_hash_drift provenance. CodeRabbit evidence is stale until a focused refresh runs on the repaired source; do not proceed to Local Qwen, aggregate Stage 4 review, landing, retrospective, another work item, or unrelated Phase 8 work before that refresh or explicit provider-refusal/bootstrap-gap replacement evidence.
operator_input_status: none_required
source_drift_status: stale
executable_evidence:
  - coderabbit auth status --agent returned authenticated for GitHub user pyxe-developer.
  - coderabbit review --agent --base-commit c5eb2700502237e3269a82818edd994a4006d878 -c AGENTS.md --no-color completed with 2 findings.
  - node --test test/evidence-freshness-slos.test.mjs passed after the local repair.
  - npm run typecheck passed after the local repair.
  - npm run bandit -- validate passed after the local repair.
  - git diff --check passed after the local repair.
resolved_or_dispositioned_findings:
  - severity: trivial
    file: src/state/focused-session-context.ts
    finding: STAGE_EVIDENCE_INFOS duplicates the stage-to-filename data also encoded in buildRequiredEvidencePaths; consolidate into a single shared stage evidence definition.
    disposition: Repaired locally by adding a shared stage evidence definition with stage label and filename metadata, and by deriving required evidence paths from that definition.
  - severity: minor
    file: test/evidence-freshness-slos.test.mjs
    finding: Add session-context stale stage_4_review parity coverage mirroring cockpit stale review evidence trust signals.
    disposition: Repaired locally with Stage 4 session-context regression coverage for stale review evidence, including review_subject_hash_drift reason, reviewer owner, source path, and SLO policy path.
bootstrap_gaps:
  - none
