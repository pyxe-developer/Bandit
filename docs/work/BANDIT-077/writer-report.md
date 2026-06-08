# BANDIT-077 Stage 3 Writer Report

contract_version: 1
work_item: BANDIT-077
stage: stage3_implementation
implementation_writer: claude-implementation-writer-stage3
model_family: claude
recorded_at: 2026-06-08T16:54:00Z
verdict: pass

## Summary

Implemented the Spec-To-Evidence Traceability Matrix gate as the smallest
source/policy/template slice that satisfies the Codex-authored RED evidence in
`docs/work/BANDIT-077/red-evidence.md` and
`test/spec-to-evidence-traceability.test.mjs`. The gate adds the public command
`bandit spec-to-evidence validate <WORK_ITEM> [--json]`, a scoped policy
artifact, a human-readable matrix template, derived validation logic, and
review-template language so Stage 4 reviewers inspect traceability quality.

The gate is derived, read-only evidence. It does not mutate acceptance criteria,
reviewer routing, model routing, landing authority, UAT authority, gap status,
coordination history, workflow policy, old-gate authority, or Trust Verifier
authority.

## Changed Surfaces (Allowed Only)

- `.bandit/policy/spec-to-evidence-traceability.json` (new): scoped policy
  defining traceability entry schema, supported evidence types, disposition
  values, required fields, covered risk tiers, and read-only authority flags.
- `docs/templates/spec-to-evidence-traceability.md` (new): human-readable matrix
  template and field reference; derived guidance only, not workflow authority.
- `src/state/spec-to-evidence-traceability.ts` (new): policy/brief/matrix
  loaders, evidence and disposition classification, fail-closed diagnostics, and
  a deterministic read-only report builder.
- `src/commands/spec-to-evidence.ts` (new): `spec-to-evidence validate`
  command surface, argument parsing, JSON/human rendering, and fail-closed exit
  codes.
- `src/cli.ts` (modified): dispatch for the `spec-to-evidence` command and
  usage-string registration.
- `docs/templates/review-evidence.md` (modified): added `traceability_state`,
  `traceability_quality`, and `traceability_disposition` fields so Stage 4 asks
  whether mapped tests and artifacts prove the stated behavior, not just that
  they exist.

## Surfaces Intentionally Not Touched

- `src/commands/init.ts` and `src/commands/validate.ts` were allowed but left
  unchanged to keep the slice minimal. The committed policy artifact is read
  directly by the command, so no init seeding or `bandit validate` wiring is
  required for the approved RED behavior. A fresh `bandit init` consumer repo
  that lacks the policy simply fails closed with a clear `missing traceability
  policy` diagnostic, which is the intended fail-closed posture.
- No Test-Writer-owned surface was created, edited, deleted, or reformatted:
  `test/**`, RED evidence, fixtures, helpers, traceability acceptance mappings,
  source-artifact mappings, and the per-work-item BANDIT-077 traceability matrix
  remain untouched.
- The pre-existing working-tree modifications to `.bandit/bootstrap-gaps.json`,
  `STATUS.md`, `docs/roadmap/CURRENT_CONTEXT.md`, `docs/roadmap/ROADMAP.md`, and
  `docs/work/BANDIT-077/coordination-log.jsonl` existed before this Stage 3 run
  and were not modified by the implementation writer.

## Stage 3 Repair (recorded_at: 2026-06-08T17:32:00Z)

Codex PM found a real acceptance gap after the initial Stage 3 slice: the gate
passed the `BANDIT-999` RED fixture but failed closed against the existing
Bandit brief shape. Real Bandit chore briefs (including BANDIT-077) use
`work_type: chore` with prose acceptance bullets rather than an explicit
`risk_tier:` line and `ACn:` identifiers. Test Writer added one focused repair
test — `spec-to-evidence validate supports existing chore briefs with prose
acceptance bullets` — whose RED failure was `missing risk_tier in brief`.

The repair is the smallest source change in
`src/state/spec-to-evidence-traceability.ts`, with no new allowed surfaces
touched:

- `readRiskTier` now infers the covered `bootstrap_chore` tier from
  `work_type: chore` when an explicit `risk_tier:` line is absent. An explicit
  `risk_tier:` still wins when present.
- `readAcceptanceCriteria` now synthesizes deterministic `AC1`/`AC2`/… ids in
  bullet order for prose acceptance bullets that lack `ACn:` labels. Explicit
  `ACn:` labels are still honored when present, and ordinal numbering stays
  aligned across mixed briefs.

The change preserves derived, read-only authority: it only reads the brief and
never mutates acceptance criteria, landing authority, Trust Verifier authority,
reviewer/model routing, or gap status.

## Validation Results (post-repair)

- `node --test test/spec-to-evidence-traceability.test.mjs` — pass (7/7,
  including the new chore-brief repair test).
- `npm run typecheck` — pass.
- `npm run bandit -- validate` — pass (`Bandit state is valid.`).
- `node ./bin/bandit.mjs coordination validate BANDIT-077` — pass
  (`Coordination log is valid: BANDIT-077`).
- `npm test` — pass (574/574).
- `git diff --check` — pass (no whitespace errors).
- `node ./bin/bandit.mjs spec-to-evidence validate BANDIT-077 --json` — now
  passes: `status: pass`, `covered_risk_tier: bootstrap_chore`, with the real
  BANDIT-077 prose acceptance bullets synthesized to `AC1`–`AC6` and mapped to
  the Test-Writer-owned `docs/work/BANDIT-077/spec-to-evidence-traceability.json`
  matrix. The brief and matrix remain unedited; the gate now reads the existing
  chore-brief shape directly.

## Behavior Coverage Against RED Evidence

- Deterministic read-only output: two identical runs produce byte-identical
  stdout, leave source and brief sentinels unchanged, and emit policy version,
  covered risk tier, per-criterion evidence types/dispositions, and read-only
  authority flags.
- Missing mappings fail closed with `missing traceability mapping: <id>`.
- Vague evidence fails closed with `vague traceability evidence: <id>`.
- Unsupported evidence types fail closed with `unsupported evidence type:
  <type>` (for example `line_coverage`).
- Implementation-detail evidence used as behavior proof without explicit
  rationale fails closed with `implementation-detail evidence cannot prove
  behavior without explicit rationale: <id>`.
- Vague dispositions fail closed with `disposition rationale is too vague:
  <id>`.
- The review-evidence template now requires traceability state, quality, and
  disposition fields.

## Blockers

None. No operator-owned decision was required. No Trust Verifier cutover,
old-gate replacement/wrapping, paid/external routing, merge, push, or deploy was
performed or requested.
