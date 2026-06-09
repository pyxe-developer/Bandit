# Qwen Formation Review - BANDIT-085

contract_version: 1
work_item: BANDIT-085
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: pass
findings_status: no_findings
findings_disposition: informational_notes_only
source_head: 1f836d9
reviewed_at: 2026-06-09T19:10:53Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was not used as
formation evidence for this work item.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- non-product work present: pass - the brief records `work_type: chore` and
  defines a bounded Repo-Wide Transition Index Decision chore.
- source provenance clear: pass - source authority traces to current
  roadmap/context, `.bandit/work-intake-ledger.json` entry
  `WIL-REPO-WIDE-TRANSITION-INDEX`, `FOLLOWUPS.md`, `CLEAN_CODE.md`, and Stage
  Rubrics.
- scope is narrow and bounded: pass - the work is limited to evidence review,
  decision recording, follow-up scope, no-action, or deferred disposition.
- out-of-scope boundaries explicit: pass - repo-wide index implementation,
  local API, State Index, scheduler, heartbeat mutation, claim/worktree
  lifecycle, browser mutation authority, PR/CI workflow, merge, push, deploy,
  paid routing, hosted services, public benchmark publication, Trust Verifier
  cutover, and unrelated Phase 8 work are excluded.
- acceptance criteria are verifiable: pass - criteria cover source-cited
  evidence review, canonical per-work-item coordination-log preservation,
  derived-only boundary, operator-owned approval halts, and future-scope
  requirements if implementation is recommended.
- verification plan present: pass - Stage 1 validation and later RED,
  coordination, cockpit/session-context, work-intake, operator-boundary,
  typecheck, Bandit, derived-status, review, landing, and closeout checks are
  listed.
- CLEAN_CODE.md read evidence present: pass - read evidence is recorded for
  2026-06-09 and makes clean-code compliance evaluable.
- bootstrap gap disposition present: pass - no open bootstrap gap blocks this
  intake-derived decision chore; WIL-REPO-WIDE-TRANSITION-INDEX is identified
  as Work Intake Ledger proposal state rather than a bootstrap-gap ledger
  entry.
- expected files and required evidence present: pass - the brief lists Stage 1
  evidence and future-stage artifact families while forbidding creation of
  future-stage artifacts in this run.
- stage capability scope present: pass - authority roles, required skills,
  token-cost failsafe, and forbidden actions are declared.
- operator input status recorded: pass - no operator-owned input is required
  for Stage 1 formation, while canonical repo-wide transition authority, State
  Index timing, local API, scheduler, claim/worktree, Trust Verifier,
  merge/push/deploy, paid routing, hosted service, public benchmark, product,
  policy, business, cost/risk, and ambiguous-scope decisions remain halt
  conditions.
- Permanent Test Ownership Boundary preserved: pass - Stage 3 Writers cannot
  edit Test Writer-owned surfaces or policy acceptance criteria.
- Bootstrap Model-Family Separation preserved: pass - Codex-authored RED
  evidence requires different-model-family Stage 3 implementation unless an
  operator-approved policy exception is recorded.
- source-of-truth boundary preserved: pass - per-work-item coordination logs
  remain canonical append-only transition history, and any future repo-wide
  index must be derived, rebuildable, and non-authoritative.
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
<BANDIT-085 Stage 1 formation packet assembled from docs/specs/BANDIT-085-repo-wide-transition-index-decision.json, docs/work/BANDIT-085/brief.md, and docs/work/BANDIT-085/coordination-log.jsonl> | timeout 240 node bin/omlx-chat-completions.mjs -
```

Result:

```json
{
  "verdict": "pass",
  "findings": [
    {
      "severity": "info",
      "title": "Stage 1 Scope and Non-Product Work Alignment"
    },
    {
      "severity": "info",
      "title": "Source-of-Truth and Projection Boundary Preserved"
    },
    {
      "severity": "info",
      "title": "Bootstrap Gaps and Local Qwen Authorization"
    },
    {
      "severity": "info",
      "title": "Test Ownership and Model-Family Separation"
    },
    {
      "severity": "info",
      "title": "Downstream Artifact Prohibition"
    }
  ],
  "summary": "Stage 1 formation for BANDIT-085 is fully compliant. The brief correctly scopes the work as a non-product decision chore, preserves canonical coordination-log authority, defines clear out-of-scope boundaries, and adheres to all bootstrap, ownership, routing, and artifact-prohibition rules. No blockers or gaps identified."
}
```

## Findings

Local Qwen reported informational notes only. No Stage 1 formation blockers or
non-blocking findings were reported.

## Summary

Local Qwen formation review for `BANDIT-085` passed through the only authorized
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct
`qwen` CLI evidence is claimed or allowed.
