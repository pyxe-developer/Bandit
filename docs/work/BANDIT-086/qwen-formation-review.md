# Qwen Formation Review - BANDIT-086

contract_version: 1
work_item: BANDIT-086
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: no_findings
findings_disposition: informational_notes_only
source_head: ff2bd42
reviewed_at: 2026-06-09T21:22:05Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was not used as
formation evidence for this work item.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- non-product work present: pass - the brief records `work_type: chore` and
  defines a bounded Coordination Primitive Completion Triage chore.
- source provenance clear: pass - source authority traces to
  `CURRENT_CONTEXT.md`, `ROADMAP.md`, `.bandit/work-intake-ledger.json`,
  `FOLLOWUPS.md`, the 2026-05-24 coordination primitive decision,
  `CLEAN_CODE.md`, and Stage Rubrics.
- scope is narrow and bounded: pass - the work is limited to evidence review,
  decision recording, missing-slice scoping, no-action, or deferred
  disposition.
- out-of-scope boundaries explicit: pass - new coordination implementation,
  local API, State Index, scheduler, heartbeat mutation, claim/worktree
  lifecycle, browser mutation authority, PR/CI workflow, merge, push, deploy,
  paid routing, hosted services, public benchmark publication, Trust Verifier
  cutover, cross-repo runtime work, and unrelated Phase 8 work are excluded.
- acceptance criteria are verifiable: pass - criteria cover source-cited
  evidence review, canonical per-work-item coordination-log preservation,
  actor-event non-authority, derived projection boundaries, operator-owned
  approval halts, and future-scope requirements if implementation is
  recommended.
- verification plan present: pass - Stage 1 validation and later RED,
  coordination, cockpit/session-context, work-intake, operator-boundary,
  typecheck, Bandit, derived-status, review, landing, and closeout checks are
  listed.
- CLEAN_CODE.md read evidence present: pass - read evidence is recorded for
  2026-06-09 and makes clean-code compliance evaluable.
- bootstrap gap disposition present: pass - no open bootstrap gap blocks this
  intake-derived triage chore; WIL-COORDINATION-PRIMITIVE is identified as Work
  Intake Ledger proposal state rather than a bootstrap-gap ledger entry.
- expected files and required evidence present: pass - the brief lists Stage 1
  evidence and future-stage artifact families while forbidding creation of
  future-stage artifacts in this run.
- stage capability scope present: pass - authority roles, required skills,
  token-cost failsafe, and forbidden actions are declared.
- operator input status recorded: pass - no operator-owned input is required
  for Stage 1 formation, while product, policy, State Index, local API,
  scheduler, claim/worktree, Trust Verifier, PR/CI/CD, merge/push/deploy, paid
  routing, hosted service, public benchmark, cross-repo runtime, business,
  cost/risk, and ambiguous-scope decisions remain halt conditions.
- Permanent Test Ownership Boundary preserved: pass - Stage 3 Writers cannot
  edit Test Writer-owned surfaces or policy acceptance criteria.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED
  evidence requires different-model-family Stage 3 implementation unless an
  operator-approved policy exception is recorded.
- source-of-truth boundary preserved: pass - per-work-item coordination logs
  remain canonical append-only coordination history; actor coordination events
  remain advisory unless accepted into workflow state by CLI validation or
  Codex PM policy; derived projections remain non-authoritative.
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
  printf '%s\n' 'Review BANDIT-086 Stage 1 formation evidence as the Local Qwen baseline reviewer. Return only JSON with fields: verdict (pass, blocker, non_blocking, bootstrap_gap), findings (array with severity, title, evidence, recommendation), summary. Use blocker if Stage 1 is too broad, lacks source authority, lacks clean-code evidence, erodes role/test ownership, uses unauthorized Qwen routing, approves future implementation/authority, lacks operator-boundary handling, or misses required formation evidence. Treat CodeRabbit separately; do not require CodeRabbit output for this Local Qwen verdict. Context follows.'
  printf '\n--- SPEC ---\n'
  sed -n '1,260p' docs/specs/BANDIT-086-coordination-primitive-completion-triage.json
  printf '\n--- BRIEF ---\n'
  sed -n '1,420p' docs/work/BANDIT-086/brief.md
  printf '\n--- COORDINATION LOG ---\n'
  sed -n '1,40p' docs/work/BANDIT-086/coordination-log.jsonl
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
      "title": "Stage 1 Formation Compliance",
      "evidence": "Brief contains all mandated sections. Scope is explicitly bounded to triage/disposition only. Role boundaries and operator gates are clearly defined. CLEAN_CODE.md read evidence is recorded. No unauthorized Qwen routing or future implementation approval is present.",
      "recommendation": "Approve Stage 1 formation. Proceed to formation review routing."
    }
  ],
  "summary": "BANDIT-086 Stage 1 brief is fully compliant with the spec. It correctly bounds the scope to a non-product triage chore, preserves canonical coordination logs and role boundaries, records CLEAN_CODE.md read evidence, and explicitly avoids unauthorized routing, future implementation approval, or operator-boundary erosion. All required formation sections are present and aligned with the acceptance criteria. Ready for formation review."
}
```

## Findings

Local Qwen reported informational notes only. No Stage 1 formation blockers or
actionable non-blocking findings were reported.

## Summary

Local Qwen formation review for `BANDIT-086` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
