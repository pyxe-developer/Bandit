# Qwen Formation Review - BANDIT-087

contract_version: 1
work_item: BANDIT-087
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: no_findings
findings_disposition: informational_notes_only
source_head: 9badfe0
reviewed_at: 2026-06-10T00:15:41Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was not used as
formation evidence for this work item.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- non-product work present: pass - the brief records `work_type: chore` and
  defines a bounded PR And CI/CD Landing Workflow Policy triage chore.
- source provenance clear: pass - source authority traces to
  `CURRENT_CONTEXT.md`, `ROADMAP.md`, `.bandit/work-intake-ledger.json`,
  `FOLLOWUPS.md`, `.bandit/policy/landing-agent.json`, the accepted
  agent-owned safe-landing decision, `CLEAN_CODE.md`, and Stage Rubrics.
- scope is narrow and bounded: pass - the work is limited to evidence review,
  policy recommendation, follow-up scoping, no-action, deferred disposition, or
  operator-owned approval question.
- out-of-scope boundaries explicit: pass - PR creation, CI orchestration,
  merge, push, deploy, credentials, branch-protection changes, hosted services,
  public benchmark publication, paid routing, Trust Verifier cutover, local
  API, State Index, scheduler, claim/worktree behavior, guarded browser action
  execution, and unrelated Phase 8 work are excluded.
- acceptance criteria are verifiable: pass - criteria cover source-cited
  evidence review, preservation of current local-record landing policy,
  operator-owned approval halts, data-only external input handling, and future
  implementation-scope requirements if implementation is recommended.
- verification plan present: pass - Stage 1 validation and later RED,
  landing-agent, input-quarantine, operator-boundary, supply-chain, work-intake,
  typecheck, Bandit, derived-status, review, landing, and closeout checks are
  listed.
- CLEAN_CODE.md read evidence present: pass - read evidence is recorded for
  2026-06-10 and makes clean-code compliance evaluable.
- bootstrap gap disposition present: pass - no open bootstrap gap blocks this
  intake-derived policy triage chore; WIL-PR-CICD-LANDING is identified as Work
  Intake Ledger proposal state rather than a bootstrap-gap ledger entry.
- expected files and required evidence present: pass - the brief lists Stage 1
  evidence and future-stage artifact families while forbidding creation of
  future-stage artifacts in this run.
- stage capability scope present: pass - authority roles, required skills,
  token-cost failsafe, and forbidden actions are declared.
- operator input status recorded: pass - no operator-owned input is required
  for Stage 1 formation, while PR/CI/CD policy, credentials, branch protection,
  CI provider setup, merge/push/deploy, hosted services, public benchmark
  publication, paid routing, Trust Verifier cutover, product/UAT direction,
  business, cost/risk, and ambiguous-scope decisions remain halt conditions.
- Permanent Test Ownership Boundary preserved: pass - Stage 3 Writers cannot
  edit Test Writer-owned surfaces or policy acceptance criteria.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED
  evidence requires different-model-family Stage 3 implementation unless an
  operator-approved policy exception is recorded.
- source-of-truth boundary preserved: pass - `.bandit/policy/landing-agent.json`
  remains the current Landing Agent source of truth, with local-record as the
  only supported action and push/merge/deploy disabled.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists
  and Work Item PM, RED, implementation, review, landing, UAT, and closeout
  remain blocked until `formation_approved`.
- Local Qwen route preserved: pass - the review used
  `.bandit/reviewers/local-qwen.json` through
  `bin/omlx-chat-completions.mjs`; no direct `qwen` CLI evidence is used.

## Command Evidence

Endpoint preflight:

```sh
node -e "const http=require('http');const req=http.get('http://127.0.0.1:8000/v1/models',res=>{console.log(res.statusCode);res.resume();});req.on('error',err=>{console.error(err.message);process.exit(2);});req.setTimeout(5000,()=>{console.error('timeout');req.destroy();process.exit(3);});"
```

Result: endpoint returned HTTP `200`.

Formation review command:

```sh
{
  printf '%s\n' 'Review BANDIT-087 Stage 1 formation evidence as the Local Qwen baseline reviewer. Return only JSON with fields: verdict (pass, blocker, non_blocking, bootstrap_gap), findings (array with severity, title, evidence, recommendation), summary. Use blocker if Stage 1 is too broad, lacks source authority, lacks clean-code evidence, erodes role/test ownership, uses unauthorized Qwen routing, approves future implementation/authority, lacks operator-boundary handling, approves PR/CI/CD policy or remote actions, replaces local-record landing, or misses required formation evidence. Treat CodeRabbit separately; do not require CodeRabbit output for this Local Qwen verdict. Context follows.'
  printf '\n--- SPEC ---\n'
  sed -n '1,260p' docs/specs/BANDIT-087-pr-and-cicd-landing-workflow-policy.json
  printf '\n--- BRIEF ---\n'
  sed -n '1,520p' docs/work/BANDIT-087/brief.md
  printf '\n--- COORDINATION LOG ---\n'
  sed -n '1,40p' docs/work/BANDIT-087/coordination-log.jsonl
  printf '\n--- ROUTING RULE ---\nLocal Qwen is authorized only through .bandit/reviewers/local-qwen.json via node bin/omlx-chat-completions.mjs against http://127.0.0.1:8000/v1. Direct qwen CLI is revoked. Stage 1 scope stops at formation_approved.\n'
} | timeout 240 node bin/omlx-chat-completions.mjs -
```

Result:

```json
{
  "verdict": "pass",
  "findings": [
    {
      "severity": "info",
      "title": "Bounded Scope and Explicit Out-of-Scope Boundaries",
      "evidence": "Brief explicitly lists forbidden actions (PR creation, CI orchestration, merge, push, deploy, credentials) and preserves local-record landing.",
      "recommendation": "None required; scope is appropriately constrained for Stage 1 triage."
    },
    {
      "severity": "info",
      "title": "Source Authority and Origin",
      "evidence": "Origin cites CURRENT_CONTEXT.md, ROADMAP.md, FOLLOWUPS.md, landing-agent.json, and WIL-PR-CICD-LANDING intake proposal.",
      "recommendation": "None required; source authority is clear."
    },
    {
      "severity": "info",
      "title": "Operator Boundary and Approval Gates",
      "evidence": "Acceptance criteria and operator_input_status explicitly require halting for operator-owned policy, credential, or remote-action decisions.",
      "recommendation": "None required; operator boundaries are enforced."
    },
    {
      "severity": "info",
      "title": "Clean-Code and Role Ownership",
      "evidence": "CLEAN_CODE.md read evidence is recorded; role boundaries (Repo PM, Work Item PM, Test Writer, etc.) are explicitly defined and preserved.",
      "recommendation": "None required; clean-code and ownership boundaries are maintained."
    }
  ],
  "summary": "Stage 1 formation evidence for BANDIT-087 is well-scoped, explicitly avoids remote actions and PR/CI/CD policy approval, preserves the local-record landing contract, and enforces operator boundaries. No blockers, non-blocking issues, or bootstrap gaps were identified. The brief is ready for formation review and approval."
}
```

## Findings

Local Qwen reported informational notes only. No Stage 1 formation blockers or
actionable non-blocking findings were reported.

## Summary

Local Qwen formation review for `BANDIT-087` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
