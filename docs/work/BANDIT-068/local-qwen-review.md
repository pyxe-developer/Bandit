# Local Qwen Review - BANDIT-068

contract_version: 1
work_item: BANDIT-068
source_head: 9ca6442cf2729fb47d9e374f14b4875bf0a75746
profile_id: local-qwen-baseline
runtime: omlx-openai-compatible-adapter
model: Qwen3.6-35B-A3B-MLX-8bit
run_status: completed
reviewer_verdict: pass
reviewer: local-qwen-baseline
review_type: local_qwen_adversarial_review
verdict: pass
findings_status: non_blocking
findings_disposition: two non-blocking findings dispositioned as no-action; no blocker remains
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - Repo-native `qwen-review` wrapper refused the dirty bootstrap worktree before source-head evidence could be recorded.
  - Authorized direct adapter route `.bandit/reviewers/local-qwen.json` -> `node bin/omlx-chat-completions.mjs` completed through the MLX OpenAI-compatible endpoint.
structured_findings_json:
  - {"severity":"non_blocking","issue":"Type assertion on gates payload","evidence":"src/state/cockpit-evidence-detail.ts casts status.gates through unknown to Record<string, RawGate>","pm_disposition":"no_action","rationale":"The source payload is already typed as CockpitStatus at the public boundary, the projection is presentation-only, and the focused tests cover missing/stale/pass gate behavior. A future runtime schema hardening slice can revisit this if cockpit payloads become external input."}
  - {"severity":"non_blocking","issue":"Static preview snapshot references prior work item","evidence":"public/cockpit/index.html and preview-status-snapshot.ts show BANDIT-067 content","pm_disposition":"no_action","rationale":"The static preview is explicitly labeled non-canonical and notes workflow authority lives in repo-native artifacts via Bandit CLI. BANDIT-068 adds the matrix/detail layer to that rebuildable preview without claiming live polling or current CLI execution. Browser smoke verified the authority note and matrix/detail rendering."}
bootstrap_gaps: []
review_subject_hash: d5c45e40e61492611ea70e0b32458062c661775fbfab9b97750457c63a49b471
reviewed_at: 2026-06-07T19:46:09Z

## Command Evidence

The repo-native Qwen review command was attempted first:

```sh
npm run bandit -- qwen-review BANDIT-068
```

Result:

```text
Local Qwen review requires a clean worktree before source-head evidence can be recorded
```

The authorized Local Qwen route for this machine is not the direct `qwen` CLI.
The MLX adapter endpoint was preflighted:

```sh
curl -sS --max-time 5 http://127.0.0.1:8000/v1/models
```

Result: endpoint returned `Qwen3.6-35B-A3B-MLX-8bit`.

The review packet was then sent through:

```sh
node -e '<build BANDIT-068 Stage 4 review packet from repo artifacts and diff>' | timeout 240 node bin/omlx-chat-completions.mjs
```

The adapter returned:

```json
{
  "verdict": "pass",
  "findings": [
    {
      "severity": "non_blocking",
      "issue": "Type assertion on gates payload",
      "evidence": "src/state/cockpit-evidence-detail.ts: status.gates as unknown as Record<string, RawGate>",
      "recommendation": "Consider a dedicated GatePayload type or runtime validation if the CLI payload schema evolves, but acceptable for the current slice scope."
    },
    {
      "severity": "non_blocking",
      "issue": "Static preview snapshot references prior work item",
      "evidence": "public/cockpit/index.html shows BANDIT-067 work item and next action",
      "recommendation": "Ensure the preview regeneration step is automated or explicitly noted in the landing checklist to avoid stale snapshot drift, though it is correctly marked non-canonical and rebuildable."
    }
  ],
  "summary": "Stage 4 review passes. The implementation correctly introduces the evidence drilldown and gate matrix without shifting workflow authority into the browser. Fail-closed semantics for missing/stale/not_applicable states are preserved, source links are traceable, and XSS escaping is applied to all dynamic HTML generation. Responsive and accessibility requirements are met via CSS media queries and ARIA attributes. Test ownership boundaries are respected, with the Stage 3 Writer making zero edits to test surfaces. The diff is tightly scoped to the cockpit presentation layer, avoiding scope creep into local APIs, polling, or State Index. The slice is safe to land pending standard landing actions."
}
```

## Findings And Disposition

### Type Assertion On Gates Payload

verdict: non_blocking

Disposition: no-action. The public input is already a typed `CockpitStatus`,
the mapper is presentation-only, and focused tests cover pass, missing, stale,
role, source, reason, and repair-route behavior. Runtime schema hardening is
not required for this bounded cockpit slice.

### Static Preview Snapshot References Prior Work Item

verdict: non_blocking

Disposition: no-action. The preview is explicitly labeled as static and
non-canonical, and `src/cockpit/preview-status-snapshot.ts` states workflow
authority remains in repo-native artifacts via the Bandit CLI. Browser smoke
verified the authority note plus matrix/detail rendering. No live polling or
current CLI execution is claimed by browser state.

## Summary

Local Qwen passed through the only authorized route:
`.bandit/reviewers/local-qwen.json` -> `node bin/omlx-chat-completions.mjs` ->
`http://127.0.0.1:8000/v1`. No direct `qwen` CLI evidence is claimed or
allowed. Two non-blocking findings are dispositioned with no source repair
required.
