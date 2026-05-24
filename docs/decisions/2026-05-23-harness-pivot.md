# Sourmash Harness Pivot — Decision Record

**Date:** 2026-05-23
**Status:** Superseded by observed spike evidence
**Participants:** Matt Flebbe, Claude Opus 4.7

> Superseded on 2026-05-24 by `docs/spikes/harness-evaluation/verdict.md`.
> This memo remains useful background, but it is not planning authority.
> The observed spike found: Mastra-family partial, Pi failed the True Agent and
> SeekWins Transferability gates, and OpenCode failed the observed True Agent and
> SeekWins Transferability gates. Treat any stronger claims below as unproven
> until a future evidence bundle demonstrates them.

---

## Problem Statement

Sourmash has 15 shipped slices of infrastructure (13 agents, 233 tests, CLI, hooks, JSONL lifecycle events) but zero lines of SeekWins product code. The project drifted because the agent enforcement model was wrong from the start — rules are enforced via prose instructions and adversarial review loops instead of mechanical constraints at the harness level. This burns millions of tokens per slice and repeats the same mistakes every time.

Additionally, Anthropic will begin separately billing `claude -p` sessions starting June 2026, making the current Writer dispatch model cost-prohibitive.

## Root Cause

Sourmash tells Claude "don't edit test files" in AGENTS.md prose. Claude edits test files anyway. An adversarial reviewer catches it. PM loops Writer back to fix it. Writer re-does the work. PM compacts context and loses track. A 2-loop task becomes 5+. This pattern repeats for every instruction-based rule across every slice.

**Mechanical enforcement eliminates this entirely.** If the harness blocks writes to `test/` at the tool level, the violation never happens. No reviewer needed. No loop. No tokens burned. Matt asked for this approach from day 1 and was argued into the prose-based approach instead.

## What Sourmash Actually Is

A **trust verification layer** that no harness ships natively:

- Hooks that catch rule-breaking before it happens
- Evidence trail that proves what agents actually did
- Cross-modal checks that expose single-model blind spots
- Agent roles with scoped tool access and file permissions
- Contracts encoded as tests

The agent definitions — which agents exist, what each one sees, how they check each other — are the real value. The Node CLI, JSONL plumbing, and hook wiring are commodity infrastructure any harness can replace.

## Harness Candidates Evaluated

### Pi (github.com/disler/pi-vs-claude-code)

Open-source coding agent by Mario Zechner.

- **Subagent dispatch (`/sub`):** PM spawns agents with scoped tools and file access per agent
- **Agent comms:** 4-tool protocol (`list`, `send`, `get`, `await`) — peer-to-peer via Unix sockets or HTTP+SSE
- **Multi-provider:** OpenAI, Anthropic, Google, OpenRouter, Qwen, Gemma4, DeepSeek — any model per agent
- **Safety:** `damage-control` extension for regex command blocking and path-based access control
- **Extension composition:** `-e` flags compose behavior stacks per agent launch
- **Key advantage:** PM stays alive with full context while subagents work (no subprocess context loss)

### Mastra (mastra.ai)

Agent framework — SeekWins is already being built on Mastra.

- **Supervisor agents:** PM dispatches subagents as tool calls, keeps context, gets structured results
- **Per-agent model selection:** each subagent gets its own provider/model
- **Delegation hooks:** `onDelegationStart` (modify/reject), `onDelegationComplete` (inspect/bail), `onIterationComplete` (control loop)
- **Message filtering:** control what context subagents receive
- **Memory isolation:** full context flows forward, only delegation pairs persist
- **A2A protocol:** cross-framework agent-to-agent communication (open standard)
- **Key advantage:** SeekWins destination is Mastra — same ecosystem, one less system to maintain

## Decisions Made

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | All agents are subagents of PM | PM is the only long-lived agent. No peer pool, no idle agents. PM dispatches, gets results, decides. |
| 2 | Enforcement must be mechanical, not instructional | Writer can't edit `test/` because the harness blocks it — not because prose says "don't." Eliminates review-loop token burn. |
| 3 | Cross-modal split is a parameter, not an infrastructure boundary | One harness routing to different providers per agent is simpler than two separate agent runtimes (Codex + Claude Code). |
| 4 | Artifact trail persists regardless of harness | Agent-to-agent comms are a transport layer. Committed artifacts (evidence, audit logs) still get written. |
| 5 | Sourmash's value is the agent definitions and contracts, not the CLI | Roles, scopes, constraints, and test contracts port to any harness. The Node CLI and JSONL plumbing are replaceable. |
| 6 | `claude -p` dispatch is not sustainable | Separate billing in June + subprocess context loss + verbose streaming workarounds = wrong architecture. |

## Open Questions

- **Which harness?** Pi gives immediate mechanical enforcement. Mastra is the SeekWins ecosystem. Could be both (Pi for dev process, Mastra for product).
- **How much carries forward?** 233 tests encode the right contracts — they could serve as acceptance criteria for a port. The CLI and hooks likely get replaced.
- **Standalone tool vs config library?** Does sourmash remain a CLI, or does it become agent definitions that compile down to harness-native config?
- **Mastra Code maturity:** Docs were thin on Mastra Code's hook/sandbox capabilities. Needs hands-on evaluation.

## Anti-Patterns to Avoid Going Forward

1. **Over-engineering:** Building process infrastructure instead of shipping product. 15 slices of ceremony, zero product.
2. **Instruction-based enforcement:** If a constraint can be enforced mechanically, enforce it mechanically. Period.
3. **Arguing past the user:** When the user says "this is too complex" or "I want it done this way," that's the answer. Don't construct counter-arguments.
4. **Context-destroying dispatch:** Any pattern where the orchestrator loses its reasoning state to invoke a subagent is wrong.

## Next Steps

To be determined based on team discussion. The forcing function is June 2026 `claude -p` billing changes.
