# Retrospective-Derived Chore Analytics

## Decision

Chores created from retrospective lessons should be tagged and measured.

A chore that exists because of a retrospective should carry source metadata tying it back to the slice, lesson, smell, decision, and expected improvement. The harness should use that metadata to evaluate whether the chore was effective, ineffective, inconclusive, or worth expanding.

## Required Metadata Direction

- `origin`: `retrospective`, `cross_model_tension`, `coderabbit`, `incident`, `smell_trigger`, or `operator_observation`.
- `source_work_item`: the slice, chore, PRD, or PR that produced the lesson.
- `source_artifacts`: retrospective, PM review, CodeRabbit disposition, tension entry, landing verdict, or ops record.
- `hypothesis`: what should improve if this chore works.
- `metric`: repair-loop count, CodeRabbit repair count, false-positive rate, review latency, time-to-land, escaped defect count, stale-review count, UAT stale rate, operator interrupts, cost, or another explicit metric.
- `baseline`: previous observed value or comparison period.
- `evaluation_window`: when to judge the change.
- `outcome`: pending, effective, ineffective, inconclusive, reverted, or double_down.

## Rationale

Lessons are only valuable if they change future behavior and are later judged against evidence. Tagging retrospective-derived chores keeps the causal chain visible: lesson -> chore -> workflow change -> outcome. That lets the operator and Codex PM revert bad workflow decisions and invest more in good ones.

## Not Decided

- Exact field names.
- Whether this lives in chore frontmatter, JSON sidecars, or a shared improvement ledger.
- Which metrics are required for v0 versus optional.
