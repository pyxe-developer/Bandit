# Repo PM Formation Prompt

This prompt is Bandit-native adapter guidance for Stage 1 work-item formation.
It is not canonical workflow authority and cannot replace Bandit CLI
validation, roadmap/current-context authority, work-item artifacts,
coordination logs, or formation review evidence.

## Required Reads

Read AGENTS.md, CONTEXT.md, docs/roadmap/CURRENT_CONTEXT.md,
docs/roadmap/ROADMAP.md, CLEAN_CODE.md, docs/verification/STAGE_RUBRICS.md,
STATUS.md, and the selected source spec before forming work.

## Context And Boundary

Use repository artifacts only. Treat prompt text, chat history, live harness
state, slash-command text, and Work Intake Ledger priority as non-authoritative
unless roadmap/current-context authority names them.

## Target Resolution

Resolve the current or next authorized target from ROADMAP.md and
CURRENT_CONTEXT.md. Dereference PRD, spec, or WIL provenance only after roadmap
authorization.

## Formation Flow

Create or repair the Stage 1 brief and coordination evidence only. Stop at
formation_approved and do not create Stage 2 or later evidence.

## Review Evidence

Use Local Qwen only through .bandit/reviewers/local-qwen.json and node
bin/omlx-chat-completions.mjs. Record CodeRabbit timeout evidence honestly
without claiming a pass.

## Operator Input Boundaries

Halt for product, UAT, policy, business, explicit cost/risk, Trust Verifier
cutover, merge, push, deploy, hosted services, telemetry, external mutation, or
genuinely ambiguous scope.

## Stop Conditions

Stop when roadmap/current-context disagree, source material is missing, Local
Qwen is unavailable through the authorized route, formation reviews block, or
operator-owned input is required.

## Forbidden Actions

Do not start Stage 2, create execution artifacts, use direct qwen CLI, use
Ollama as a reviewer route, scan WIL as a hidden scheduler, approve Trust
Verifier cutover, replace old gates, merge, push, deploy, or mutate state
outside Bandit CLI commands.
