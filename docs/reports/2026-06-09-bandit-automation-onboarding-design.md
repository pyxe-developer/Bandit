# Bandit — Automation, Configurable Roles & Onboarding Design

**Date:** 2026-06-09
**Type:** Forward design (companion to `2026-06-09-bandit-gates-workflow-strategic-review.md`)
**Status:** Proposal for operator review — not yet a slice brief.

> Read-only design document. Defines a target architecture; it does not modify any
> gate, policy, command, or workflow-state artifact.

## 0. The Idea (operator's words, restated)

Make Bandit *fully automatable* while letting each operator set **every gate** to either
**AFK** (autonomous, agent-owned) or **HITL** (human-in-the-loop). Prompts and skills fire
through **hooks** that call the right agent at the right time. Keep every role
**model/family-agnostic and configurable**. At install, the CLI **walks the operator
through every choice** — including model-family separation — then **installs all skills and
hooks**. Add a skill that has Claude or Codex **align an existing codebase with the
doctrine**. **Bake `CLEAN_CODE.md` and the rubrics into the CLI** instead of leaving them as
loose files. Hook-driven prompts/scripts/skills = "magical."

## 1. Why this is mostly composition, not new foundations

Bandit already has the hard parts. This design is a **configuration + trigger + install**
layer over existing primitives:

| Vision element | Existing primitive to build on |
|---|---|
| Configurable role → model binding | `src/state/reviewer-profiles.ts`, `.bandit/reviewers/*.json` (already provider/model/runtime/endpoint/credential-env) |
| Model-family separation | `src/state/model-family-separation.ts`, `.bandit/policy/model-family-separation.json` |
| Per-gate AFK/HITL | `.bandit/policy/operator-boundary.json` (`operator_blocking_gates`) + `auto-landing.json` + `risk-classification` |
| Hooks firing the right agent | `src/state/event-driven-wake-scheduler.ts`, `agent-observability.ts`, `role-run-manifests.ts` |
| Role authority + stage scope | `role-contracts.ts`, `stage-capability-scope.ts`, `skill-lifecycle-contracts.ts` |
| Cost safety for autonomous loops | `token-cost-failsafe.ts`, idempotency keys, CAS claim authority |
| Versioned distribution / drift | `update-channel.ts`, `bandit update-check` |

The current `init` (`src/commands/init.ts`) is pure file-seeding — no interactive
onboarding, no skill/hook install. That is the main missing piece.

## 2. Configurable Roles (model/family-agnostic)

### 2.1 Role registry

Generalize `reviewer-profiles` from *reviewers only* to **all roles**. New file
`.bandit/config/roles.json` (projection-backed, validated by a `role-bindings` gate):

```json
{
  "contract_version": 1,
  "families": {
    "A": { "provider": "anthropic", "default_model": "claude-opus-4-8" },
    "B": { "provider": "openai",    "default_model": "o4-mini" },
    "L": { "provider": "omlx-openai-compatible", "default_model": "Qwen3.6-35B-A3B-MLX-8bit",
           "endpoint": "http://127.0.0.1:8000/v1", "runtime": "command",
           "command": "node bin/omlx-chat-completions.mjs" }
  },
  "roles": {
    "repo-pm":              { "family": "A", "prompt": "doctrine://prompts/repo-pm-formation" },
    "work-item-pm":         { "family": "A", "prompt": "doctrine://prompts/work-item-pm-orchestrator" },
    "test-writer":          { "family": "B", "prompt": "doctrine://prompts/test-writer-red" },
    "implementation-writer":{ "family": "A", "prompt": "doctrine://prompts/impl-writer" },
    "reviewer-baseline":    { "family": "L", "prompt": "doctrine://prompts/qwen-stage4-reviewer" },
    "reviewer-escalated":   { "family": "B", "prompt": "doctrine://prompts/escalated-security-reviewer",
                              "credential_env": "BANDIT_ESCALATED_REVIEWER_API_KEY", "default_state": "disabled" },
    "landing-agent":        { "family": "A", "prompt": "doctrine://prompts/landing-verdict" },
    "closeout-agent":       { "family": "A", "prompt": "doctrine://prompts/retrospective-mining" },
    "improvement-analyst":  { "family": "A", "prompt": "doctrine://prompts/improvement-evaluation" },
    "doctrine-aligner":     { "family": "A", "prompt": "doctrine://prompts/doctrine-align" }
  }
}
```

**Agnostic by construction:** roles reference a *family key*, never a hard-coded vendor. The
only hard rule is **separation, not identity** (§2.2). `doctrine://` prompt refs resolve to
baked CLI prompt templates (§6), so swapping a model never loses the role's contract.

### 2.2 Model-family separation as a derived constraint

Today's policy already forbids the RED author's family from writing the implementation, and
forbids Claude self-review of Claude-authored code. Promote it to a **validator over the
role registry** (`bandit roles validate`):

- `test-writer.family != implementation-writer.family` (per work item).
- `reviewer-*.family != implementation-writer.family` (no self-review).
- Escalation target of any role ≠ that role's own family.
- **Onboarding refuses a config with fewer than two distinct families** — single-family
  setups silently destroy cross-model tension (a core Bandit artifact). The wizard explains
  this and requires at least one free second family (e.g. a second local model via the same
  OpenAI-compatible adapter).

## 3. Per-Gate AFK ↔ HITL

### 3.1 The mode resolver (safety-preserving)

New file `.bandit/config/gate-modes.json` maps each gate to `afk | hitl | policy_default`.
The **effective mode is computed**, never taken raw:

```
effective_mode(gate) = max_supervision( operator_setting(gate),
                                        policy_floor(gate),
                                        risk_classification(work_item) )
```

Where `max_supervision(afk, hitl) = hitl` (more oversight always wins). Two invariants:

1. **Hard HITL floor (cannot be lowered to AFK).** Exactly the gates already enumerated in
   `operator-boundary.json → operator_blocking_gates`: `product_direction`,
   `uat_approval_or_stale_uat`, `policy_change`, `business_tradeoff`,
   `explicit_cost_or_risk_approval`, `irreversible_operational_risk_approval`,
   `safety_critical_release_authorization`, `genuinely_ambiguous_scope`. Plus every
   **never-auto-landable surface** from `smell-triggers.json`
   (`BANDIT-SMELL-NEVER-AUTO-LANDABLE-SURFACE`: auth, payments, secrets, prod
   data/migrations, CI/release, dependency/fetched-prompt execution, destructive ops). The
   CLI **refuses** `gate set <auth-gate> --afk` and prints the controlling policy line.
2. **Soft ceiling (always allowed).** Any operator may raise *any* gate to HITL. AFK is a
   privilege the operator grants per gate, bounded by the floor.

This reconciles "fully automated" with Bandit's deliberate operator-supervision posture:
**you can AFK the mechanical gates and the low-risk lanes; you can never AFK a
payment/auth/secrets change.** The risk-classification gate can also *temporarily* force a
normally-AFK gate to HITL when a blast-radius/static-analysis/supply-chain signal fires.

### 3.2 CLI surface

```sh
bandit gate-modes show --json                 # effective mode per gate, with the controlling source
bandit gate set reviewer-baseline --afk       # lower to autonomous (allowed)
bandit gate set landing-feature-slice --hitl  # raise supervision (always allowed)
bandit gate set uat --afk                      # REFUSED → prints operator-boundary floor
```

## 4. Hook-Driven Orchestration (harness-agnostic)

### 4.1 The dispatcher

One internal verb, `bandit hook <event> --work-item <id>`, is the single entry point every
harness calls. It: resolves the current stage → looks up the next role binding → loads the
baked prompt + skill → checks the effective gate mode → then either **invokes the configured
agent (AFK)** or **emits an approval request (HITL)**. All of this already has a home:
`event-driven-wake-scheduler` decides *when*, `role-run-manifests` records *what ran*,
`agent-observability` traces it, `token-cost-failsafe` bounds it.

### 4.2 Adapters per harness (the agnostic layer)

- **Claude Code:** write `.claude/settings.json` hooks → `SessionStart` (restore context via
  the `bandit` skill), `Stop`/`PostToolUse` (detect a stage transition → `bandit hook
  stage-advanced`), `PreToolUse` (enforce operator-boundary / forbidden surfaces).
- **Codex:** equivalent hook config + the orchestrator prompt contract.
- **Fallback (`bandit watch`):** a daemon driven by `event-driven-wake-scheduler` for
  harnesses without hooks — same dispatcher, no harness coupling.

Because hooks only ever call `bandit hook …`, **the magic is harness-portable**: the CLI,
not the harness, owns when/which-agent/what-prompt.

### 4.3 The AFK safety rails (already built — reuse, don't reinvent)

Autonomous hook loops are where cost/runaway risk lives. Bandit already has the controls:
event-driven (not polling) wakeups, `token-cost-failsafe` soft budget + abnormal-run
failsafe, CAS-fenced claims + **idempotency keys** so a re-fired hook can't duplicate a side
effect, and fail-closed-or-bootstrap-gap on any unavailable agent. The design's only new
requirement: every hook-invoked role run carries an **idempotency key = `(work_item,
stage, role, subject_hash)`** so retries are safe.

## 5. Installation Onboarding Wizard

Replace today's silent file-seed with `bandit init --interactive` (alias `bandit onboard`,
idempotently re-runnable). It walks, validates, then installs:

1. **Project basics** — prefix, harness (Claude / Codex / other), landing mode
   (local-record now; PR/CI when that follow-up lands).
2. **Role → family bindings** (§2) — enforces ≥2 families and the separation validator
   *before* writing config.
3. **Endpoints & credentials** — local model endpoint (default
   `http://127.0.0.1:8000/v1`), escalated provider key env var, CodeRabbit token; a
   `bandit doctor` preflight pings each.
4. **Per-gate AFK/HITL** (§3) — presented as a checklist; floor gates shown locked with the
   reason.
5. **Cost guardrails** — spend-class approvals, provider-pricing evidence capture, soft
   budget bands (feeds `token-cost-failsafe`).
6. **Install** — only after validation passes: write configs → `bandit install-skills` →
   `bandit install-hooks` → `bandit validate`.

`bandit doctor` (proposed in the prior report) becomes the wizard's validation engine and a
standalone health check.

## 6. Bake Doctrine Into the CLI

Today `CLEAN_CODE.md` and `STAGE_RUBRICS.md` are loose files agents must remember to read —
the SKILL itself lists "Required First Reads." That is exactly the **projection-as-authority
smell Bandit warns against**. Invert it:

- **Doctrine becomes embedded CLI modules** (single source, versioned `doctrine_version`):
  clean-code rubric, stage rubrics, smell catalog, verdict vocabulary, role contracts.
- **The repo files become generated projections**, not the source:
  ```sh
  bandit doctrine show clean-code | rubrics | smells | roles
  bandit doctrine check <path>          # lint a diff/file against the embedded rubric
  bandit doctrine export                # (re)materialize CLEAN_CODE.md / STAGE_RUBRICS.md as derived docs
  bandit doctrine version               # pinned doctrine_version + drift vs installed CLI
  ```
- Consumer repos **pin a `doctrine_version`**; `bandit update-check` surfaces doctrine drift
  the same way it surfaces package updates. An operator override extension point
  (`.bandit/doctrine.overrides.json`) keeps it customizable without forking the engine.

This makes the rubric **always-on and machine-enforced** at every gate instead of
depending on an agent choosing to open a markdown file.

## 7. Doctrine-Alignment Skill (the legacy-repo on-ramp)

Add a `doctrine-aligner` role + `bandit align` command + a `bandit-align` skill. Point Claude
or Codex (operator's choice — agnostic) at an *existing* non-Bandit codebase; it reads the
**baked** doctrine and produces:

- a gap report mapping the codebase against the clean-code rubric and smell catalog,
- each gap written into the **bootstrap-gap ledger** (reusing the existing mechanism),
- suggested improvement chores / slice briefs to close them,
- optionally, a draft PR with low-risk mechanical alignments (clean worktree boundary, same
  landing-agent constraints — no merge/push/deploy).

This is the **adoption wedge**: a new team runs `bandit align` and immediately sees Bandit's
value applied to *their* code, not a toy.

## 8. Suggested build order (each a normal Bandit slice)

1. **Doctrine bake** (§6) — `doctrine show/check/export/version` + embedded modules. Unlocks
   everything else and is self-contained.
2. **Role registry + separation validator** (§2) — generalize reviewer-profiles.
3. **Gate-mode resolver** (§3) — the AFK/HITL floor/ceiling computation + `gate set`.
4. **Hook dispatcher + Claude adapter** (§4) — `bandit hook`, then `install-hooks`.
5. **Interactive onboarding** (§5) — `init --interactive` + `bandit doctor` + `install-skills`.
6. **Doctrine-alignment skill** (§7) — `bandit align`.

Each lands under the existing stage rubrics, with skill-lifecycle contracts for every new
skill and model-family-separation evidence baked into the role registry.

## 9. Honest risks & how the design absorbs them

- **AFK vs Bandit's conservative posture** → resolved by the hard HITL floor (§3.1); you
  cannot automate an operator-owned or never-auto-landable gate.
- **Runaway hook loops / cost** → event-driven (not polling) + token-cost-failsafe +
  idempotency keys (§4.3); these already exist.
- **Baking doctrine vs repo-native principle** → doctrine is *engine code*, not *workflow
  state*; baking the rubric is correct, and `doctrine.overrides.json` preserves
  customization. Workflow state stays repo-native and canonical.
- **"Agnostic" claim eroding** → enforced by construction: roles bind to family *keys*,
  prompts are `doctrine://` refs, and the only constraint is separation. A vendor swap is a
  one-line config edit re-validated by `bandit roles validate`.
- **Onboarding cliff** → the wizard + graduated `init --profile lite|standard|strict`
  (prior report §6) make the rigor opt-in by depth.

## 10. Why this is the differentiator

Spec-driven tools stop at planning; orchestrators race toward unconditional autonomy. This
design gives operators a **dial, not a switch**: *automate everything you trust, supervise
everything you must, swap any model into any role, and let an existing codebase be aligned to
the doctrine on day one* — all on top of gates that are deterministic, evidence-fresh, and
self-improving. That combination is Bandit's white space, and §1 shows most of the machinery
to deliver it already exists.
</content>
