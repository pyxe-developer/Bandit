# Adversarial Escalation Smell Defaults

## Decision

Adversarial escalation should be triggered by policy smells, not operator choice.

Local Qwen remains the baseline reviewer for every PR. Codex PM must add a stronger or second adversarial reviewer when the PR shows one or more escalation smells.

## Default Escalation Smells

- Auth, permissions, security, privacy, data integrity, schema, migration, infra, deploy, release, billing, or external-service code.
- Workflow gates, owner approval, landing, CodeRabbit waiver, UAT approval, evidence freshness, or state-machine changes.
- Parsers, validators, JSONL append-only logs, registry/index writers, generated schemas, or source-of-truth synchronization.
- Large or complex scope: more than 15 files, more than 5 new modules, more than 25 acceptance criteria, roughly more than 700 net lines, or an orchestrator over about 150 lines.
- Orchestrators crossing three or more phases: input validation, subprocess invocation, output parsing, artifact writes, state transitions.
- Failed, inconclusive, unavailable, or low-confidence Qwen result.
- CodeRabbit request-changes, unresolved actionable comments, or repeated false-positive/disposition tension.
- Any post-review source change, stale review, stale UAT, or source-drift condition.
- Repeated repair loops: two or more PM/Writer repair cycles, any CodeRabbit repair cycle on high-risk code, or evidence that tests pass but the diff still changed materially.
- Writer attempts to modify Test Writer-owned tests, weaken assertions, or request acceptance-criteria changes.
- Low coverage, missing regression tests on load-bearing paths, or tests unable to run in the Writer environment.
- Context-pressure or phantom-work signs: long reasoning without tool calls, partial implementation, skipped enumerated steps, or oversized slice signals.
- Dispatched role unavailable, malformed structured output, schema mismatch, or missing evidence artifact.
- Spec/doc drift touching load-bearing workflow policy.

## Rationale

These triggers are derived from sourmash patterns: CodeRabbit found bugs in lifecycle/schema work; PM found ordering and parser bugs after earlier repair; large orchestrators required decomposition; Writer/test-boundary problems caused extra loops; stale review/source-drift handling became its own slice; and retrospective artifacts were needed because chat memory did not preserve decisions reliably.

The operator should not need to spot these smells. Codex PM should.

## Not Decided

- Exact numeric thresholds for all languages and repo sizes.
- Which stronger reviewer profile runs first.
- Whether some smells require two reviewers rather than one stronger reviewer.
