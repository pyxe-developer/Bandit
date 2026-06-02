# Pi/Aperture Agent Scope And Harness Spike Plan

**Date:** 2026-06-02
**Status:** Stage 0 spike plan
**Owner:** Codex PM
**Related decision:** `docs/decisions/2026-06-01-true-agent-harness-pivot.md`
**Blocking gap:** `BANDIT-GAP-ROLE-SCOPED-WORKFLOW-ORCHESTRATION`

## Purpose

This plan replaces the vague "agent brief" idea with a cold-start runnable plan
for scoping Bandit's authority-bearing agents on Pi with Aperture.

The spike must prove this invariant:

> A Work Item PM Orchestrator can keep one slice context alive and call scoped
> agents for test, implementation, review, landing, and closeout work without
> restarting the PM at every stage or relying on chat history.

If the spike cannot prove that invariant, Bandit does not have agents yet. It
still has Process Adapters, and normal adapter-loop bootstrap slices remain
paused.

## Source Grounding

The spike is grounded in current Pi and Aperture behavior, not wishful harness
language.

### Pi Facts Used By This Plan

Primary sources:

- `https://github.com/earendil-works/pi/blob/main/packages/coding-agent/README.md`
- `https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/sdk.md`
- `https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md`
- `https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/skills.md`
- `https://github.com/disler/pi-vs-claude-code`

Pi is a minimal terminal coding harness. It is extensible through TypeScript
extensions, skills, prompt templates, themes, packages, an SDK, JSON or print
mode, and RPC mode. Pi's normal default tool surface includes file and shell
tools such as read, write, edit, and bash; SDK sessions can also select a
narrower built-in tool set and custom tools.

Pi does not make Bandit's agents real by itself. Pi's own README says it skips
features like subagents and plan mode by default. Therefore this spike must
prove or build a Bandit Pi package/extension that creates scoped agent sessions,
dispatches work, records lifecycle events, and blocks out-of-scope tools and
writes. The `disler/pi-vs-claude-code` repository is useful source material for
custom Pi harnesses, safety auditing, hooks/events, and orchestration patterns;
it is not planning authority for Bandit.

Relevant Pi mechanisms:

- Skills: repo-local capability packages loaded on demand from locations such
  as `.pi/skills/` or `.agents/skills/`.
- Extensions: TypeScript modules that can register tools, commands, keyboard
  shortcuts, event handlers, and UI components.
- Tool hooks: extension `tool_call` handlers can inspect and block tool calls.
- Context hooks: extension `context` handlers can filter messages before model
  calls.
- Provider hooks: extension `before_provider_request` handlers can inspect or
  replace the serialized provider payload before the request leaves Pi.
- Runtime embedding: the SDK and RPC mode can create and drive sessions from a
  Bandit-owned process instead of only through an interactive terminal.

### Aperture Facts Used By This Plan

Primary sources:

- `https://tailscale.com/docs/aperture/how-aperture-works`
- `https://tailscale.com/docs/aperture/configuration`
- `https://tailscale.com/docs/aperture/guardrails`
- `https://tailscale.com/docs/aperture/how-to/set-up-guardrails`

Aperture is the model plane, not the harness. It routes AI requests through a
central proxy, uses Tailscale identity for attribution, exposes grants for
model access, captures telemetry and cost information, and can call hooks.
Aperture grants are deny-by-default: without a matching grant, a source cannot
access models.

Guardrails are synchronous `pre_request` hooks. They run before Aperture
forwards the request to the upstream provider. A guardrail endpoint returns
`allow`, `block`, or `modify`. Hook chains run in descending `preference` order,
with alphabetical order as the tiebreak. A `block` terminates the chain.

Mandatory enforcement hooks must use `fail_closed`. Advisory hooks can use
`fail_open`. Aperture integration hooks such as `entire_request` and
`tool_call_entire_request` are asynchronous and cannot block or modify the
in-flight request. Aperture does not provide post-response guardrails in the
first guardrails edition, so post-response review remains a Bandit/Pi/repo
responsibility.

## Architecture Split

Bandit owns workflow authority. Pi owns harness-plane execution. Aperture owns
model-plane routing and pre-provider enforcement.

| Layer | Owns | Does not own |
| --- | --- | --- |
| Bandit repo | canonical agent scopes, role contracts, stage gates, artifacts, landing and closeout state | provider credentials, live model routing |
| Pi harness plane | agent session identity, dispatch, local tool execution, local write/tool enforcement, lifecycle traces | landing authority, canonical workflow state, provider credential custody |
| Aperture model plane | provider routing, key custody, identity-bound model calls, grants, quotas, cost telemetry, pre-request guardrails, request-time tool declaration/capability blocking | filesystem permissions, local tool execution, stage verdicts, repo state |

Aperture telemetry is evidence. It cannot satisfy a Bandit stage gate by
itself. Pi tool blocking is enforcement. It still must reconcile into
repo-native Bandit artifacts.

## Tool Blocking Boundary

"Aperture blocks tools" means Aperture can block or modify the LLM request that
declares tools before that request reaches the upstream provider. It does not
mean Aperture owns local filesystem, shell, repo, or child-agent side effects.

Bandit must enforce three separate tool boundaries:

| Boundary | Enforcer | What is blocked | Evidence |
| --- | --- | --- | --- |
| Model-plane tool declaration | Aperture `pre_request` guardrail | Unauthorized tool schemas, tool names, or capability requests in `request_body` or `tools` before provider submission | Aperture guardrail log plus Bandit model-call envelope |
| Local tool execution | Pi extension/tool hook | Unauthorized `read`, `write`, `edit`, `bash`, custom Bandit tools, child-agent dispatch, or repo mutation before side effect | Pi lifecycle trace plus role-run manifest validation |
| Post-run reconciliation | Bandit CLI | Any actual diff or artifact that exceeds the role-run manifest | Bandit validation result and role-run attempt evidence |

Aperture `tool_call_entire_request` hooks are not tool execution blockers. They
are asynchronous integration hooks for observation, authorization records, or
audit logging after the response completes.

## Canonical Scope Artifacts

The first implementation step in the spike must add these repo-native artifacts.

| Artifact | Authority | Purpose |
| --- | --- | --- |
| `.bandit/policy/agent-scopes.json` | canonical | Versioned scope for each authority-bearing agent. |
| `.bandit/policy/agent-scope.schema.json` | canonical | Machine validation for the scope file. |
| `.bandit/policy/pi-aperture-projection.json` | canonical projection policy | Declares which fields compile into Pi skills, Pi extension config, and Aperture config fragments. |
| `docs/spikes/pi-aperture/generated/pi/` | derived | Generated Pi skill and extension configuration examples. |
| `docs/spikes/pi-aperture/generated/aperture/` | derived | Generated Aperture grant and hook fragments. |
| `docs/spikes/pi-aperture/proof-runs/<run-id>/` | evidence | One spike run's cold-start packet, traces, summaries, guardrail logs, and verdicts. |

Generated Pi and Aperture files are projections. They must never become the
source of truth for Bandit authority.

## Required Agent Scope Fields

Each entry in `.bandit/policy/agent-scopes.json` must include:

- `role_id`
- `version`
- `owner`
- `role_contract_ref`
- `pi_identity`
- `pi_skill_projection`
- `pi_extension_profile`
- `model_profile`
- `allowed_parent_roles`
- `allowed_child_roles`
- `allowed_a2a_channels`
- `lifecycle_events_required`
- `required_inputs`
- `required_outputs`
- `required_summary_schema`
- `allowed_read_surfaces`
- `allowed_write_surfaces`
- `forbidden_write_surfaces`
- `allowed_model_tool_declarations`
- `allowed_local_tools`
- `allowed_command_families`
- `forbidden_actions`
- `aperture_grant_profile`
- `mandatory_pre_request_guardrails`
- `advisory_hooks`
- `telemetry_join_keys`
- `validation_commands`
- `failure_behavior`
- `escalation_paths`

The scope file must be validated before any Pi session starts. Missing or
invalid scope is a hard block.

## Bandit Model-Call Envelope

Pi must attach a small Bandit model-call envelope to every model request before
it reaches Aperture. The envelope is not workflow authority; it is attribution
and correlation data that Aperture guardrails can inspect.

Minimum fields:

- `bandit_trace_id`
- `work_item_id`
- `stage`
- `role_id`
- `role_run_id`
- `pi_session_id`
- `pi_parent_session_id`
- `agent_scope_version`
- `role_contract_version`
- `allowed_model_tool_names`
- `allowed_local_tool_names`
- `declared_write_surfaces`
- `model_profile`
- `cost_budget_band`

Aperture guardrails must block if the envelope is missing, malformed, outside
the matching repo-native scope, or inconsistent with the grant profile. The
guardrail may not fabricate missing attribution.

## Pi Package And Extension Scope

The spike must produce or pin a Bandit Pi package. A third-party package may be
used only if it is pinned and reviewed as a supply-chain-sensitive surface.

The Bandit Pi package must provide:

- `bandit_dispatch_agent`: create a scoped child session from a role scope and
  role input packet.
- `bandit_agent_send`: send a scoped A2A message to a child agent.
- `bandit_agent_await`: wait for a child summary or blocker request.
- `bandit_append_coordination`: append allowed coordination messages through
  Bandit CLI authority.
- `bandit_validate_scope`: validate the active role scope and generated
  projections before a run starts.
- `bandit_validate_diff`: compare actual writes against the role-run manifest.
- `bandit_emit_trace`: record Pi lifecycle and tool events into the proof run.

The extension must enforce:

- Local tool execution allowlists at Pi `tool_call`.
- Bash command-family allowlists before execution.
- Write-surface and forbidden-surface checks before `write` or `edit`.
- Context filtering before model calls.
- Bandit model-call envelope insertion before provider request.
- Lifecycle tracing for session start/end, agent start/end, turn start/end,
  tool execution, model calls, dispatch, blocker escalation, and closeout.

## Aperture Guardrail Chain

Mandatory `pre_request` hooks must run before advisory hooks.

| Hook | Preference | Failure policy | Action surface |
| --- | ---: | --- | --- |
| `bandit-attribution-required` | 100 | `fail_closed` | Blocks missing or invalid Bandit model-call envelope. |
| `bandit-agent-scope` | 90 | `fail_closed` | Blocks role, stage, model, context, or parent/child mismatch against `.bandit/policy/agent-scopes.json`. |
| `bandit-tool-declaration-allowlist` | 80 | `fail_closed` | Blocks unauthorized model-plane tool declarations, tool schemas, or capability requests in the request body. |
| `bandit-secret-pii` | 70 | `fail_closed` | Blocks credentials/secrets/PII that cannot be deterministically scrubbed; modifies only deterministic scrub cases. |
| `bandit-model-policy` | 60 | `fail_closed` | Blocks unauthorized provider/model routing for the role and stage. |
| `bandit-budget-quota` | 50 | `fail_closed` | Blocks requests over hard budget, quota, or missing cost attribution. |
| `bandit-cost-observer` | 10 | `fail_open` | Advisory cost and usage metadata capture. |

Example generated Aperture fragment:

```json
{
  "hooks": {
    "bandit-attribution-required": {
      "url": "http://bandit-guardrails.example.ts.net:8080/attribution",
      "fail_policy": "fail_closed",
      "timeout": "500ms",
      "preference": 100
    },
    "bandit-cost-observer": {
      "url": "http://bandit-guardrails.example.ts.net:8080/cost-observer",
      "fail_policy": "fail_open",
      "timeout": "500ms",
      "preference": 10
    }
  },
  "grants": [
    {
      "src": ["tag:bandit-harness"],
      "app": {
        "tailscale.com/cap/aperture": [
          { "models": "anthropic/claude-sonnet*" },
          {
            "send_hooks": [
              {
                "name": "bandit-attribution-required",
                "events": ["pre_request"],
                "send": ["request_body", "user_message", "tools", "estimated_cost", "grants"]
              },
              {
                "name": "bandit-cost-observer",
                "events": ["tool_call_entire_request"],
                "send": ["tools", "user_message", "estimated_cost", "grants"]
              }
            ]
          }
        ]
      }
    }
  ]
}
```

The actual generated fragment must include all mandatory hooks. This example
shows the shape only.

## Agent Scopes

### Repo PM Coordinator

**Purpose:** formation, repo-level routing, gap queue reconciliation, and final
closure.

**Inputs:**

- `docs/roadmap/CURRENT_CONTEXT.md`
- `docs/roadmap/ROADMAP.md`
- `STATUS.md`
- `.bandit/bootstrap-gaps.json`
- `CLEAN_CODE.md`
- `docs/verification/STAGE_RUBRICS.md`
- approved product/spec source when creating a work item

**Outputs:**

- `docs/work/<ID>/brief.md`
- `docs/work/<ID>/formation-review.md`
- `docs/work/<ID>/repo_pm-summary.md`
- `docs/work/<ID>/coordination-log.jsonl`
- status/roadmap/gap-ledger updates

**Pi skill projection:** `.agents/skills/bandit-repo-pm/SKILL.md`

**Local tools:**

- Built-in: `read`, `grep`, `find`, `ls`, `bash`, `write`, `edit`
- Custom: `bandit_validate_scope`, `bandit_append_coordination`,
  `bandit_emit_trace`

**Model-plane tool declarations:** none by default. Any model-visible tools
must be generated from the repo-native scope and approved by the Aperture
guardrail chain.

**Command families:** `node`, `npm`, `bandit`, `git status`, `git diff`

**Forbidden:** merge, push, deploy, edit global installed skills, write
implementation/test changes for a formed work item.

**Aperture:** mandatory attribution, scope, model-plane tool declaration,
model, and budget guardrails; advisory cost observer.

### Work Item PM Orchestrator

**Purpose:** one durable session that orchestrates a single formation-approved
work item through Stage 2 through Stage 6.

**Inputs:**

- generated Work Item Execution Packet
- current role contracts and agent scopes
- stage rubrics
- role-run manifests
- current coordination state
- child agent summaries and blocker requests

**Outputs:**

- `docs/work/<ID>/work_item_pm-summary.md`
- `docs/work/<ID>/coordination-log.jsonl`
- child dispatch records in `docs/spikes/pi-aperture/proof-runs/<run-id>/`
- status/roadmap updates only when allowed by current scope

**Pi skill projection:** `.agents/skills/bandit-work-item-pm/SKILL.md`

**Local tools:**

- Built-in: `read`, `grep`, `find`, `ls`, `bash`
- Custom: `bandit_dispatch_agent`, `bandit_agent_send`,
  `bandit_agent_await`, `bandit_append_coordination`,
  `bandit_validate_scope`, `bandit_validate_diff`, `bandit_emit_trace`

**Model-plane tool declarations:** only the Bandit dispatch and coordination
tools required for the active Work Item PM scope.

**Command families:** `node`, `npm`, `bandit`, `git status`, `git diff`

**Forbidden:** write tests, implementation, reviewer findings, landing
verdicts, landing actions, retrospective content, merge, push, deploy.

**A2A:** may call Test Writer, Implementation Writer or Execution Worker,
Reviewer, Landing Agent, Closeout Agent, and Repo PM for formation/scope
blockers. It may not call arbitrary agents.

**Aperture:** mandatory attribution, scope, model-plane tool declaration,
model, and budget guardrails; advisory cost observer. Guardrails must verify
that Work Item PM is the parent session for child role runs.

### Test Writer

**Purpose:** write RED tests and RED evidence from approved scope.

**Inputs:**

- Role Input Packet
- Role Run Manifest
- approved brief or execution-packet excerpt
- Stage 2 rubric
- clean-code constraints relevant to tests

**Outputs:**

- `test/**`
- `docs/work/<ID>/red-evidence.md`
- `docs/specs/*red-evidence*.json`
- `docs/work/<ID>/test_writer-summary.md`

**Pi skill projection:** `.agents/skills/bandit-test-writer/SKILL.md`

**Local tools:**

- Built-in: `read`, `grep`, `find`, `ls`, `bash`, `write`, `edit`
- Custom: `bandit_validate_scope`, `bandit_emit_trace`

**Model-plane tool declarations:** no child dispatch tools. Only local
test/evidence tools generated from the Test Writer scope may be exposed to the
model.

**Command families:** `node`, `npm`, `bandit`, focused test commands

**Forbidden:** implementation files, landing/review/closeout artifacts, merge,
push, deploy.

**A2A:** may ask Work Item PM for scope clarification or brief amendment. It
may not directly ask Implementation Writer to change code.

**Aperture:** mandatory guardrails; model profile must differ from Stage 3
Implementation Writer when Bandit model-family separation requires it.

### Implementation Writer / Execution Worker

**Purpose:** implement against RED evidence without editing tests or acceptance
evidence.

**Inputs:**

- Role Input Packet
- Role Run Manifest
- approved brief or execution-packet excerpt
- RED evidence
- Stage 3 rubric
- allowed write surfaces

**Outputs:**

- allowed `src/**`, template, and policy files named by the manifest
- `docs/work/<ID>/implementation-evidence.md`
- `docs/work/<ID>/writer-report.md`
- `docs/specs/*implementation-evidence*.json`
- `docs/work/<ID>/implementation_writer-summary.md`

**Pi skill projection:** `.agents/skills/bandit-implementation-writer/SKILL.md`

**Local tools:**

- Built-in: `read`, `grep`, `find`, `ls`, `bash`, `write`, `edit`
- Custom: `bandit_validate_scope`, `bandit_validate_diff`,
  `bandit_emit_trace`

**Model-plane tool declarations:** no test-writing, review, landing, or
closeout tools. Only implementation-scope local tools may be exposed to the
model.

**Command families:** `node`, `npm`, `bandit`, focused test commands,
typecheck commands

**Forbidden:** tests, test helpers, fixtures, RED evidence, acceptance
mappings, reviewer findings, landing/closeout artifacts, merge, push, deploy.

**A2A:** may ask Work Item PM for blocker routing. It may not directly ask Test
Writer to change tests.

**Aperture:** mandatory guardrails; model/profile must match the role scope and
model-family separation policy.

### Reviewer

**Purpose:** adversarial review and evidence normalization.

**Inputs:**

- review packet
- current diff summary
- source head and review-subject hash
- role summaries
- Stage 4 rubric
- CodeRabbit/Qwen provider inputs as allowed by policy

**Outputs:**

- `docs/work/<ID>/coderabbit-review.md`
- `docs/work/<ID>/local-qwen-review.md`
- `docs/work/<ID>/review-evidence.md`
- `docs/specs/*coderabbit-review-output*.json`
- `docs/work/<ID>/reviewer-summary.md`

**Pi skill projection:** `.agents/skills/bandit-reviewer/SKILL.md`

**Local tools:**

- Built-in: `read`, `grep`, `find`, `ls`, `bash`, `write`, `edit`
- Custom: `bandit_validate_scope`, `bandit_emit_trace`

**Model-plane tool declarations:** reviewer and evidence-normalization tools
only. No implementation, test-writing, landing-action, or dispatch tools.

**Command families:** `node`, `npm`, `bandit`, `coderabbit`, local reviewer
runtime commands, `git diff`

**Forbidden:** implementation repair, test repair, landing action, merge, push,
deploy.

**A2A:** sends findings to Work Item PM. It does not route repairs directly to
writers.

**Aperture:** mandatory guardrails plus advisory cost observer. Paid or
high-token reviewers require provider-pricing evidence and active spend-class
approval in the Bandit scope.

### Landing Agent

**Purpose:** decide landability and record landing verdict/action evidence.

**Inputs:**

- landing packet
- Stage 5 rubric
- review evidence
- risk classification and supply-chain gate evidence
- clean-code evaluation evidence
- UAT evidence when required

**Outputs:**

- `docs/work/<ID>/landing-verdict.md`
- `docs/work/<ID>/landing-action.md`
- `docs/specs/*landing-verdict*.json`
- `.bandit/policy/risk-classifications/**`
- `.bandit/policy/supply-chain-gates/**`
- `docs/work/<ID>/landing_agent-summary.md`

**Pi skill projection:** `.agents/skills/bandit-landing-agent/SKILL.md`

**Local tools:**

- Built-in: `read`, `grep`, `find`, `ls`, `bash`, `write`, `edit`
- Custom: `bandit_validate_scope`, `bandit_validate_diff`,
  `bandit_emit_trace`

**Model-plane tool declarations:** landing-verdict and supported local-record
landing tools only. No implementation, test-writing, review-rewriting, merge,
push, or deploy tools.

**Command families:** `node`, `npm`, `bandit`, `git status`, `git diff`,
supported local-record landing commands

**Forbidden:** unsupported merge, push, deploy, implementation/test repair,
editing reviewer evidence.

**A2A:** returns `safe-to-land`, `needs-repair`, `blocked`, or `requires
operator approval` to Work Item PM.

**Aperture:** mandatory guardrails; landing verdict remains Bandit-owned and
cannot be replaced by Aperture telemetry.

### Closeout / Retrospective Agent

**Purpose:** close out learning, retrospective, and improvement disposition.

**Inputs:**

- closeout packet
- Stage 6 rubric
- role summaries
- review findings and dispositions
- landing action evidence
- gap ledger context

**Outputs:**

- `docs/work/<ID>/retrospective.md`
- `docs/specs/*retrospective*.json`
- `.bandit/bootstrap-gaps.json`
- roadmap/status updates when allowed
- `docs/work/<ID>/closeout_agent-summary.md`

**Pi skill projection:** `.agents/skills/bandit-closeout-agent/SKILL.md`

**Local tools:**

- Built-in: `read`, `grep`, `find`, `ls`, `bash`, `write`, `edit`
- Custom: `bandit_validate_scope`, `bandit_emit_trace`

**Model-plane tool declarations:** retrospective and improvement-disposition
tools only. No implementation, test-writing, review, landing, merge, push, or
deploy tools.

**Command families:** `node`, `npm`, `bandit`, `git status`, `git diff`

**Forbidden:** implementation/test repair, review rewriting, landing action
mutation, merge, push, deploy.

**A2A:** returns retrospective summary, improvement chores, and explicit
no-action decisions to Work Item PM; Repo PM owns final closed transition.

**Aperture:** mandatory guardrails and advisory cost observer.

### Heartbeat Chore Agent

**Purpose:** low-risk recurring inspection of due chores and stale workflow
signals.

**Inputs:**

- heartbeat policy
- due improvement evaluations
- gap ledger
- current context
- status/roadmap summaries

**Outputs:**

- heartbeat inspection report
- advisory coordination message
- no canonical workflow transition unless reconciled by Repo PM or CLI

**Pi skill projection:** `.agents/skills/bandit-heartbeat-chore-agent/SKILL.md`

**Local tools:**

- Built-in: `read`, `grep`, `find`, `ls`, `bash`
- Custom: `bandit_validate_scope`, `bandit_emit_trace`

**Model-plane tool declarations:** heartbeat inspection tools only. No
preparation, landing, product UAT, merge, push, deploy, or policy override
tools.

**Command families:** `node`, `npm`, `bandit heartbeat inspect`, `git status`

**Forbidden:** writes except its explicit inspection report, preparation,
landing, product UAT, merge, push, deploy, policy override.

**A2A:** may notify Repo PM. It may not dispatch work directly.

**Aperture:** fail-open advisory hooks are acceptable for cost/analytics, but
missing attribution still blocks.

## Cold-Start Input Packet

The Work Item PM must start from a generated cold-start packet, not from chat.

Minimum packet path:

`docs/spikes/pi-aperture/proof-runs/<run-id>/work-item-pm-cold-start-packet.md`

Required sections:

- work item or proof ID
- current stage
- exact next action
- active scope version
- source artifacts
- approved goal, scope, out-of-scope
- acceptance criteria
- test plan
- role-run sequence
- allowed role dispatches
- required child inputs
- expected child outputs
- validation commands
- Aperture guardrail profile
- Pi projection profile
- telemetry join keys
- blocker and escalation policy
- stop conditions

The packet must be sufficient for a new Work Item PM session to resume without
reading this chat, a full roadmap history, or raw prior agent transcripts.

## Minimum Whole-Slice Harness Proof

The proof must be tiny and non-product, but it must exercise the whole
orchestration path.

Suggested proof ID: `HARNESS-PROOF-001`.

Suggested proof behavior:

1. Repo PM records a tiny proof work item whose only behavior is to produce a
   structured proof artifact under `docs/spikes/pi-aperture/proof-runs/<run-id>/`.
2. Work Item PM starts one durable Pi session from the cold-start packet.
3. Work Item PM dispatches Test Writer.
4. Test Writer writes a focused failing test or validator expecting a proof
   artifact with required stage, trace, and guardrail fields.
5. Work Item PM validates RED evidence, then dispatches Implementation Writer.
6. Implementation Writer writes the proof artifact and minimal validator support
   without touching tests.
7. Work Item PM dispatches Reviewer.
8. Reviewer checks the diff, role summaries, traces, and guardrail logs.
9. Work Item PM dispatches Landing Agent.
10. Landing Agent writes a landing verdict and local-record landing action.
11. Work Item PM dispatches Closeout Agent.
12. Closeout Agent writes retrospective/improvement disposition.
13. Work Item PM records final orchestration summary and hands Repo PM a compact
    closeout packet.

The proof must include at least three negative checks:

- Implementation Writer attempts or is simulated to attempt a forbidden test
  write, and Pi blocks it before filesystem mutation.
- A model request without a valid Bandit model-call envelope reaches Aperture,
  and the mandatory attribution guardrail blocks it.
- A request with an unauthorized model-plane tool declaration or model profile
  reaches Aperture, and the mandatory scope/tool-declaration/model guardrail
  blocks it.
- A model output or local session attempts an unauthorized local tool execution,
  and Pi blocks it before side effect.

## Telemetry And Evidence Joins

Every role run must join these IDs:

- `trace_id`
- `work_item_id`
- `stage`
- `role_id`
- `role_run_id`
- `pi_session_id`
- `pi_parent_session_id`
- `aperture_request_id`
- `aperture_session_id`
- `tailscale_login_name`
- `model_provider`
- `model_name`
- `source_revision`
- `review_subject_hash` when applicable

Pi traces must satisfy `.bandit/policy/agent-observability.json`. Aperture
request IDs and session IDs are model-plane correlation fields; they cannot
replace Bandit trace IDs or role-run artifacts.

## Spike Implementation Order

1. Add `.bandit/policy/agent-scope.schema.json` and
   `.bandit/policy/agent-scopes.json`.
2. Add a validator command for agent scopes and projection drift.
3. Generate Pi skill and extension profiles from repo-native scopes.
4. Generate Aperture grant and hook fragments from repo-native scopes.
5. Build the Bandit Pi package/extension with dispatch, tool enforcement,
   context filtering, model-call envelope insertion, and trace capture.
6. Build the Aperture guardrail endpoint with mandatory and advisory handlers.
7. Run `HARNESS-PROOF-001`.
8. Record proof evidence under `docs/spikes/pi-aperture/proof-runs/<run-id>/`.
9. Write a spike verdict: `pass`, `needs-repair`, or `failed-harness`.

## Acceptance Criteria

The spike passes only if all criteria are met:

- A cold-started operator or agent can find the plan, scope artifacts,
  generated projections, proof packet, and next action from repo files alone.
- All authority-bearing agents have repo-native scope entries before the proof
  starts.
- Pi child sessions are created from scoped roles, not ad hoc prompts.
- Work Item PM remains the durable parent orchestrator for the whole proof.
- Every child role receives an explicit input packet and role-run manifest.
- Every child role writes only its allowed outputs.
- Pi blocks forbidden local tool execution and writes before mutation.
- Aperture blocks malformed model requests and unauthorized model-plane tool
  declarations before provider submission.
- Aperture telemetry records provider/model, cost, request ID, session ID, and
  Tailscale identity for model calls.
- Integration hooks are used only for observation.
- Guardrail telemetry is reconciled into Bandit proof artifacts.
- Stage verdicts remain Bandit-owned.
- `npm run bandit -- validate` passes after documentation/state changes.
- The final spike verdict states whether Bandit can continue on Pi with
  Aperture or must repair/replace the harness path.

## Failure Conditions

Any of these fail the spike:

- Pi dispatch is only a subprocess prompt and does not preserve parent session
  orchestration.
- Child agents are scoped only by prose instructions.
- A generated Pi or Aperture config becomes canonical authority.
- Work Item PM cold-starts each stage instead of preserving one durable session.
- Implementation Writer can edit tests.
- Aperture guardrails are advisory only or fail open for mandatory scope.
- Aperture telemetry is treated as a landing verdict.
- The proof skips any of Test Writer, Implementation Writer, Reviewer, Landing
  Agent, or Closeout Agent.
- The result depends on this chat history.

## Non-Goals

- Full migration of Bandit to Pi.
- Building the Workflow Cockpit UI.
- Replacing all existing Bandit CLI state immediately.
- Selecting paid reviewer policy.
- Shipping product functionality.
- Proving adversarial security against compromised credentials or malicious
  maintainers.

## Immediate Next Action

Implement the first spike step:

> Add repo-native agent scope schema/policy plus projection validation for Pi
> and Aperture, using this plan as the source artifact. Do not start the proof
> run until all authority-bearing agents have valid scopes and generated
> projections.
