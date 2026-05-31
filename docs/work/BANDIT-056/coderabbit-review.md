# CodeRabbit Review: BANDIT-056

contract_version: 1
work_item: BANDIT-056
source_head: 2f8564ce88f9c0d7be2521a9cf638087c428865d
source_head_meaning: latest completed CodeRabbit-reviewed source head.
provider: coderabbit-agent-pre-pr
review_target: local-diff:c5eb2700502237e3269a82818edd994a4006d878
review_state: completed
coderabbit_verdict: blocker
findings_status: open
findings_disposition: Codex PM classified the six latest focused CodeRabbit findings in docs/work/BANDIT-056/coderabbit-finding-disposition.md. Two findings are repair-required: the Evidence SLO template key mismatch and writer-stream-sanitizer isRecord array rejection. Two findings are accepted non-blocking follow-up candidates because current validation passes. Two stylistic findings are no-action/opportunistic only. Repair the two repair-required findings before another focused refresh, Local Qwen, aggregate Stage 4 review, landing, or closeout; do not run another CodeRabbit refresh solely for the stylistic findings.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - coderabbit --version returned 0.4.1.
  - coderabbit auth status --agent returned authenticated for GitHub user pyxe-developer.
  - coderabbit review --agent --base-commit c5eb2700502237e3269a82818edd994a4006d878 -c AGENTS.md --no-color completed with 2 findings at source head c00a86cdfa61f0d1de00c27a8d7b63add5ce4d23.
  - 5a8a3d5ee762cd6f1544b91efc8653d82fd4937c repairs the two focused CodeRabbit evidence-artifact findings locally.
  - coderabbit review --agent --base-commit c5eb2700502237e3269a82818edd994a4006d878 --files <focused BANDIT-056 file list> -c AGENTS.md --no-color completed with 2 findings at source head b5e549ec6031fd2eba45b5ed4d3ccfa09da4e02c.
  - 5dfc90bb3d0790ef1c2078124f16d30e35f69973 repairs the two focused CodeRabbit findings locally.
  - node --test test/evidence-freshness-slos.test.mjs passed after the local repair.
  - npm run typecheck passed after the local repair.
  - coderabbit review --agent --base-commit c5eb2700502237e3269a82818edd994a4006d878 --files <focused BANDIT-056 file list> -c AGENTS.md --no-color completed with 5 findings at source head 7a30a4716d33cb319098976ad6467a60d61beef3.
  - 23fd3e8d470c9afd7a7f51d7c6fef3046e60c931 repairs the four remaining focused CodeRabbit findings locally.
  - node --test test/evidence-freshness-slos.test.mjs passed after the local repair.
  - npm run typecheck passed after the local repair.
  - npm run bandit -- evidence-freshness-slos validate --json passed after the local repair.
  - coderabbit review --agent --base-commit c5eb2700502237e3269a82818edd994a4006d878 --files <focused BANDIT-056 file list> -c AGENTS.md --no-color completed with 4 findings at source head d2b422695ebba83429f5564570b762e517ebe2ec.
  - b33eb482173fa67a0e77fa20636d72c0cf810963 repairs the four latest focused CodeRabbit findings locally.
  - coderabbit review --agent --base-commit c5eb2700502237e3269a82818edd994a4006d878 --files <focused BANDIT-056 file list> -c AGENTS.md --no-color completed with 3 findings at source head bbd48de80d204fe556440893c162eb93ea4747ef.
  - claude -p <docs/work/BANDIT-056/coderabbit-repair-dispatch.md> --model claude-sonnet-4-6 --effort xhigh --verbose --output-format stream-json reached end_turn and wrote docs/work/BANDIT-056/coderabbit-repair-writer-report.md.
  - 5c8b8c9f735afc3496eebba7e825ec50da65c29d repairs the two implementation-source findings through the Claude Writer path.
  - Codex PM corrected attempt 17 endedAt to 2026-05-31T20:05:00Z so it is in UTC Z format and chronologically between attempts 16 and 18.
  - node --test test/evidence-freshness-slos.test.mjs passed after the source repair.
  - node --test test/focused-session-context.test.mjs passed after the source repair.
  - npm run typecheck passed after the source repair.
  - npm run bandit -- evidence-freshness-slos validate --json passed after the source repair.
  - git diff --check passed after the source repair.
  - coderabbit review --agent --base-commit c5eb2700502237e3269a82818edd994a4006d878 --files src/state/evidence-freshness-slos.ts --files src/state/focused-session-context.ts --files docs/work/BANDIT-056/coderabbit-review.md --files docs/specs/BANDIT-056-coderabbit-review-output.json --files docs/work/BANDIT-056/coderabbit-repair-dispatch.md --files docs/work/BANDIT-056/coderabbit-repair-writer-report.md --files docs/roadmap/CURRENT_CONTEXT.md --files docs/roadmap/ROADMAP.md --files STATUS.md -c AGENTS.md --no-color completed with 3 findings at source head 9db9b0a89212ca1fc9f671ecba703ce1c906174d.
  - 2688c3187cb4ee3c15e4320e5378fb0877a8d889 repairs the three latest focused CodeRabbit findings locally.
  - node --test test/writer-stream-sanitizer.test.mjs passed after the local repair.
  - node --test test/focused-session-context.test.mjs passed after the local repair.
  - node --test test/evidence-freshness-slos.test.mjs passed after the local repair.
  - npm run typecheck passed after the local repair.
  - npm run bandit -- evidence-freshness-slos validate --json passed after the local repair.
  - git diff --check passed after the local repair.
  - coderabbit review --agent --base-commit c5eb2700502237e3269a82818edd994a4006d878 --files <focused BANDIT-056 repair refresh file list> -c AGENTS.md --no-color completed with 6 findings at source head 2f8564ce88f9c0d7be2521a9cf638087c428865d.
  - Codex PM classified the six latest findings in docs/work/BANDIT-056/coderabbit-finding-disposition.md instead of repairing all of them.
  - npm run bandit -- evidence-freshness-slos validate --json passed before classifying the derived-projection rationale and cockpit evidence-path alias findings as non-blocking follow-ups.
  - node --test test/evidence-freshness-slos.test.mjs test/cockpit-status.test.mjs test/writer-stream-sanitizer.test.mjs passed with 30 tests before classifying the latest six findings.
findings:
  - severity: trivial
    file: .bandit/policy/evidence-freshness-slos.json
    finding: Add explicit documentation explaining why derived_projection_rules for cockpit_status and session_context are derived_non_canonical, propagate stale dependencies, and cannot upgrade missing dependencies to trusted.
    disposition: accepted_non_blocking; current validation and focused tests pass, so route to BANDIT-056-DERIVED-PROJECTION-RATIONALE follow-up instead of blocking the next repair step.
  - severity: minor
    file: docs/templates/evidence-freshness-slos.md
    finding: Make artifact_types and trust_signal_requirements use a consistent source_artifact/source_artifacts key name so form-fillers are not confused.
    disposition: repair_required; repair the template key mismatch before another focused refresh, Local Qwen, aggregate Stage 4 review, landing, or closeout.
  - severity: trivial
    file: src/state/cockpit-status.ts
    finding: Extract the repeated evidence artifact path object shape into a single shared type alias for cockpit-status trust-signal and gate-matrix helpers.
    disposition: accepted_non_blocking; current cockpit status validation and focused tests pass, so route to BANDIT-056-COCKPIT-EVIDENCE-PATH-ALIAS follow-up instead of blocking the next repair step.
  - severity: minor
    file: src/state/writer-stream-sanitizer.ts
    finding: Update isRecord so arrays are not treated as record objects before parsed.type access.
    disposition: repair_required; repair array rejection in isRecord before another focused refresh, Local Qwen, aggregate Stage 4 review, landing, or closeout.
  - severity: trivial
    file: src/state/writer-stream-sanitizer.ts
    finding: Extract duplicated raw stream line-splitting/trimming count logic into a shared helper.
    disposition: no_action_opportunistic; no standalone repair and no CodeRabbit refresh solely for this stylistic finding.
  - severity: trivial
    file: src/state/writer-stream-sanitizer.ts
    finding: Use a Set for redacted-field-name membership checks instead of repeated linear search.
    disposition: no_action; no source repair and no CodeRabbit refresh solely for this stylistic finding.
bootstrap_gaps: []
