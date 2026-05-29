# BANDIT-051 Stage 3 Writer Report

## Writer Identity

- writer_identity: claude_process_adapter
- model_family: claude
- base_sha: 5678957168de8a0375760d72778b09d122e94c1f
- stage: Stage 3 Implementation

## Implementation Summary

Implemented `bandit worktree-bootstrap validate --json` to enforce the Worktree Bootstrap Contract. The implementation validates policy and evidence files, refuses secret material copy entries when no operator-supervised exception is authorized, and requires a non-empty bootstrap validation command before a worktree can be treated as runnable.

### What Was Built

1. `src/state/worktree-bootstrap.ts` - State validator that reads and validates the policy at `.bandit/policy/worktree-bootstrap.json`, the template at `docs/templates/worktree-bootstrap.md`, and evidence files declared by each release-authorized decision. Enforces fail-closed rules for secret copy entries and missing validation commands.

2. `src/commands/worktree-bootstrap.ts` - Command module exporting `worktreeBootstrap(repoRoot, args)`. Handles the `validate` subcommand with `--json` flag. Returns structured JSON on success or throws with a diagnostic message on failure.

3. `src/cli.ts` - Registered the `worktree-bootstrap` command following the existing dispatch pattern (import + if-branch + usage string update).

4. `docs/templates/worktree-bootstrap.md` - Template with required fields: `work_item`, `source_artifacts`, `allowed_copy_entries`, `allowed_link_entries`, `bootstrap_commands`, `environment_references`, `expected_runtime_dependencies`, `secret_handling_boundary`, `bootstrap_failure_evidence`, `runnable_gate`.

5. `.bandit/policy/worktree-bootstrap.json` - Initial policy file with `contract_version: 1`, `policy_id: "worktree-bootstrap-contract"`, and an empty `release_authorized_decisions` array (safe bootstrap default).

### Validation Rules Implemented

- Policy must have `contract_version: 1` and `policy_id: "worktree-bootstrap-contract"`.
- Template must exist with all required fields.
- Each decision's evidence file must have `contract_version: 1` and matching `work_item`.
- Any `allowed_copy_entries` entry with `classification: "secret_material"` is refused when `secret_copy_exception` is `"none"` on the policy decision.
- `bootstrap_commands.validation` must be a non-empty string.

### Success Report Shape

```json
{
  "status": "pass",
  "policy": ".bandit/policy/worktree-bootstrap.json",
  "template": "docs/templates/worktree-bootstrap.md",
  "decisions": ["<work_item>", ...],
  "evidence": ["<evidence_path>", ...]
}
```

## Files Changed by Writer

- `src/state/worktree-bootstrap.ts` (created)
- `src/commands/worktree-bootstrap.ts` (created)
- `src/cli.ts` (extended: import + command handler + usage string)
- `docs/templates/worktree-bootstrap.md` (created)
- `.bandit/policy/worktree-bootstrap.json` (created)
- `docs/work/BANDIT-051/writer-report.md` (this file)

## Forbidden Surfaces Not Touched

- No test files modified (test/**, red-evidence, fixtures, acceptance mappings)
- No claim authority files modified
- No git mutation serializer behavior added
- No worktree add/remove/lock/unlock/branch/ref operations
- No secret values recorded in any artifact
- Bootstrap validation output is evidence only; it does not create or modify claim authority
- No package.json, package-lock.json, or lockfile changes
- No docs/roadmap/CURRENT_CONTEXT.md, ROADMAP.md, or STATUS.md changes
- No .bandit/bootstrap-gaps.json or .bandit/events.jsonl changes

## Compliance Boundaries

- Git Mutation Serializer: not touched; no shared `.git` plumbing mutations.
- CAS Claim Authority: not touched; `.bandit` files are not treated as writable claim authority.
- Evidence Only: `validateWorktreeBootstrap` validates and reports; it does not create worktrees, modify claims, or grant runnable status.
- Secret Values: no actual secret values appear in any artifact, policy, evidence, stdout, or stderr output.
- Stage 4 evidence hygiene: the full-fidelity process stream was replaced with a minimal digest in `docs/work/BANDIT-051/claude-writer-stream.jsonl`; durable implementation evidence is `writer-report.md` plus `implementation-evidence.md`.

## Verification Commands to Run

```
node --test test/worktree-bootstrap.test.mjs
npm test
npm run typecheck
npm run bandit -- validate
npm run bandit -- gaps list
node ./bin/bandit.mjs worktree-bootstrap validate --json
```

## Test Results at Time of Submission

- `node --test test/worktree-bootstrap.test.mjs`: 3 pass, 0 fail
- `npm test`: 412 pass, 0 fail
- `npm run typecheck`: clean
