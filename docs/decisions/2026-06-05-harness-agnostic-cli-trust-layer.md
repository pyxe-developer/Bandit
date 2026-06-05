# Harness-Agnostic CLI Trust Layer

**Date:** 2026-06-05
**Status:** Accepted
**Participants:** Matt Flebbe, Codex
**Supersedes:** `docs/decisions/2026-06-01-true-agent-harness-pivot.md`, `docs/decisions/2026-06-02-pi-config-canonical-agent-taxonomy.md`

## Decision

Bandit will focus on being the deterministic CLI trust layer for agentic software delivery.

Bandit's load-bearing product job is deterministic trust verification. The CLI owns the boring, local, repeatable parts:

- validate the work item snapshot;
- hash the snapshot;
- verify repo evidence;
- enforce reviewer-finding routing;
- produce a verdict;
- produce a reproducible report.

Workflow state, trust contracts, evidence, gates, reviewer requirements, risk policy, landing readiness, closeout, and improvement-learning records must support that deterministic verification boundary.

Bandit will not make harness selection, agent taxonomy, live orchestration, work queues, auth, credential custody, provider routing, or live status its core product boundary. Those concerns may belong to Codex, Claude Code, Pi, another harness, an external queue, or a future coordination system, as long as they can call the Bandit CLI and produce evidence that Bandit can validate.

Work item snapshots must contain only local, normalized, reproducible inputs. They may reference repo files, git refs or hashes, changed surfaces, declared intent, policy context, captured test output, captured reviewer output, and finding dispositions. They must not depend on live network state, auth state, queue state, active harness memory, or provider dashboards. If those facts matter, the orchestrator must first materialize them as local evidence, then Bandit verifies that evidence.

Every work item snapshot must declare a `trust_goal`, initially one of `stage_transition`, `landing`, `closeout`, or `evidence_refresh`. The trust goal determines which evidence requirements apply and prevents `trusted` from meaning trusted for every possible workflow action.

Core deterministic trust verification verifies captured evidence only. It does not launch long-running test suites, invoke network reviewers, call models, or depend on provider state. Bandit may expose separate helper commands that capture test output, reviewer output, or external facts as local reproducible evidence, but those capture helpers are not the trust verifier itself.

The core verifier verdicts are `trusted`, `needs_repair`, `blocked`, and `requires_operator`. Landing-specific wording such as `safe-to-land` may appear in a reproducible report as an interpretation for a landing gate, but it is not the generic trust verdict.

Deterministic trust verification is read-only by default. It may write a reproducible report only when given an explicit output path or report-writing flag. Producing that report must not update queues, active work, coordination state, routing state, or other repo workflow state by itself. External orchestrators consume the verdict and choose their next action.

An orchestrator prompt may define how a harness should run a coherent work session, including single-session orchestration and subagent calls. That prompt is guidance for the runtime, not Bandit authority. The CLI remains the source of truth for whether the resulting work is trusted.

## First Implementation Slice

The first implementation slice should build the smallest read-only trust verifier:

- `bandit trust verify <snapshot.json> [--json] [--report <path>]`
- a Work Item Snapshot schema;
- deterministic snapshot hashing;
- local evidence-reference validation;
- reviewer-finding routing validation;
- Trust Verdict derivation;
- deterministic JSON report output.

The initial snapshot schema should require:

- `schema_version`;
- `trust_goal`;
- a stable work identifier supplied by the orchestrator;
- repo state such as base and head git refs or hashes;
- declared intent;
- changed surfaces;
- policy context references;
- captured evidence references with expected content digests;
- reviewer findings and dispositions when review evidence is present.

The snapshot hash should be computed from a canonical normalized snapshot document. Referenced evidence content should be represented by expected digests in the snapshot and verified against local files during verification. If evidence content changes after snapshot creation, verification should fail rather than silently changing the snapshot hash.

The reproducible report should include the snapshot hash, trust goal, verdict, failed and passed checks, local evidence digest verification, reviewer-finding routing state, required operator input if any, and optional trust-goal-specific interpretation such as landing readiness. It should avoid wall-clock timestamps or live provider state in the deterministic body.

The first slice must not run tests, invoke reviewers, call models, create work items, route work, update coordination state, perform landing, mutate queues, or write reports unless `--report <path>` is explicitly supplied.

## Cutover Rule

`bandit trust verify` starts in a compatibility period. During that period, existing commands such as `land-check`, review evidence validation, closeout validation, and coordination checks remain authoritative.

Cutover must be explicit and per trust goal. A later cutover slice or decision must name:

- the `trust_goal` being cut over;
- the old command path being replaced or wrapped;
- the new `bandit trust verify` invocation and snapshot shape;
- reproducible parity evidence from representative completed work or locked fixtures;
- any intentionally stricter failure behavior;
- the report fields that become canonical for that trust goal;
- the rollback or fallback rule if parity fails later.

The first implementation slice must not perform cutover. It proves the snapshot contract and report determinism only. The earliest cutover candidate is a later slice after `bandit trust verify` can reproduce or strictly improve the old gate result for at least one trust goal without weakening fail-closed behavior.

## Rationale

The Pi/Aperture direction tried to make Bandit prove a specific true-agent harness path before continuing product work. That made the harness and agent model too load-bearing. The cleaner boundary is to let existing harnesses own orchestration while Bandit owns deterministic trust verification.

This keeps Bandit portable across Codex, Claude Code, Pi, and future runtimes. It also gives Bandit one primary job: answer whether a local work item snapshot has satisfied the evidence and policy contract required to proceed or land.

## Consequences

- Pi and Aperture remain source material or optional integration targets, not the required next architecture path.
- The next implementation queue should pivot away from Pi/Aperture agent-scope schema and toward the smallest CLI-verifiable trust contract that an orchestrator prompt can use from any harness.
- Single-session orchestration remains desirable, but it belongs in the harness/orchestrator layer and must reconcile into Bandit CLI evidence rather than becoming Bandit's runtime responsibility.
- Work queues, live coordination, agent lifecycle, auth, live status, and provider routing are integration concerns outside Bandit's load-bearing product boundary.
- Bandit should expose stable CLI commands, schemas, and verdicts that external orchestrators can call without duplicating trust policy.
- Network, auth, live orchestration, work queues, and live status should be represented only as local evidence inputs when they affect trust verification.
- Report writes are explicit outputs of verification, not implicit workflow-state transitions.
- Evidence capture and trust verification are separate CLI concerns.
- The first implementation slice should introduce `bandit trust verify` alongside the existing workflow commands rather than replacing `land-check`, `route`, reviewer capture, or coordination commands in the same slice.
- Cutover from existing gate commands to `bandit trust verify` requires a later explicit per-trust-goal cutover decision backed by reproducible parity evidence.
