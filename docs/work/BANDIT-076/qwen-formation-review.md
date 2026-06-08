# Qwen Formation Review - BANDIT-076

contract_version: 1
work_item: BANDIT-076
reviewer: local-qwen-baseline
review_type: qwen_formation_review
verdict: blocker
findings_status: blocker
findings_disposition: Local Qwen baseline unavailable; formation approval is blocked until the authorized MLX adapter route returns a pass or dispositioned non-blocking findings
source_head: fd16437
reviewed_at: 2026-06-08T14:32:42Z

## Operator Routing Correction

The direct `qwen` CLI is revoked as a Bandit reviewer path. It was not used as
formation evidence for this work item.

The only authorized Local Qwen route on this machine is the MLX
OpenAI-compatible endpoint at `http://127.0.0.1:8000/v1` through the repo
adapter `bin/omlx-chat-completions.mjs`, as configured by
`.bandit/reviewers/local-qwen.json`.

## Scope Check

- non-product work present: not_applicable - Local Qwen did not run because the authorized endpoint is unavailable.
- source provenance clear: not_applicable - Local Qwen did not run because the authorized endpoint is unavailable.
- scope is narrow and bounded: not_applicable - Local Qwen did not run because the authorized endpoint is unavailable.
- acceptance criteria are verifiable: not_applicable - Local Qwen did not run because the authorized endpoint is unavailable.
- verification plan present: not_applicable - Local Qwen did not run because the authorized endpoint is unavailable.
- CLEAN_CODE.md read evidence present: not_applicable - Local Qwen did not run because the authorized endpoint is unavailable.
- bootstrap gap disposition present: not_applicable - Local Qwen did not run because the authorized endpoint is unavailable.
- expected files and required evidence present: not_applicable - Local Qwen did not run because the authorized endpoint is unavailable.
- stage capability scope present: not_applicable - Local Qwen did not run because the authorized endpoint is unavailable.
- operator input status recorded: not_applicable - Local Qwen did not run because the authorized endpoint is unavailable.
- Permanent Test Ownership Boundary preserved: not_applicable - Local Qwen did not run because the authorized endpoint is unavailable.
- Bootstrap Model-Family Separation preserved: not_applicable - Local Qwen did not run because the authorized endpoint is unavailable.
- Formation Gate preserved: pass - `brief_created` coordination evidence exists and Work Item PM, RED, and implementation remain blocked until `formation_approved`.
- evidence bundle attestation boundary preserved: not_applicable - Local Qwen did not run because the authorized endpoint is unavailable.
- Local Qwen route preserved: pass - no direct `qwen` CLI evidence is used; the failure is recorded against the authorized MLX adapter route.

## Command Evidence

Endpoint preflight:

```sh
curl -sS --max-time 5 http://127.0.0.1:8000/v1/models
```

Result:

```text
curl: (7) Failed to connect to 127.0.0.1 port 8000 after 0 ms: Couldn't connect to server
```

Attempted provider restoration with the configured baseline model:

```sh
mlx_lm.server --host 127.0.0.1 --port 8000 --model unsloth/Qwen3.6-35B-A3B-MLX-8bit --max-tokens 2048
```

Result: the command began fetching the multi-shard 35B model instead of loading
a complete local snapshot. The run was interrupted rather than treating a large
model download as reviewer evidence.

Local cache inspection:

```sh
find ~/.cache/huggingface/hub/models--unsloth--Qwen3.6-35B-A3B-MLX-8bit -maxdepth 4 -type f
du -sh ~/.cache/huggingface/hub/models--unsloth--Qwen3.6-35B-A3B-MLX-8bit
```

Result: the cache contains multiple `.incomplete` blob files and is not a
complete runnable snapshot for the configured baseline route.

Attempted provider restoration with the complete local MLX community snapshot:

```sh
mlx_lm.server --host 127.0.0.1 --port 8000 --model /Users/matthewflebbe/.cache/huggingface/hub/models--mlx-community--Qwen3.6-35B-A3B-8bit/snapshots/e06a74e6236a60c8367e1a3214e83d8b61b637b0 --max-tokens 2048
```

Result:

```text
Model type qwen3_5_moe not supported.
ModuleNotFoundError: No module named 'mlx_lm.models.qwen3_5_moe'
ValueError: Model type qwen3_5_moe not supported.
```

The installed server package is `mlx-lm 0.26.0` with `mlx 0.26.1`. No global
Python package update was performed in this Stage 1 run.

## Findings

### F1 - Authorized Local Qwen Provider Unavailable

verdict: blocker

The authorized endpoint at `http://127.0.0.1:8000/v1` is not running, the
configured baseline `unsloth/Qwen3.6-35B-A3B-MLX-8bit` cache is incomplete, and
the complete local `mlx-community/Qwen3.6-35B-A3B-8bit` snapshot cannot be
loaded by the installed MLX server because the `qwen3_5_moe` architecture is
unsupported.

Disposition: formation approval is blocked. Repo PM must not claim a Local Qwen
pass, must not use direct `qwen` CLI evidence, and must not approve formation
until the authorized MLX adapter route returns a pass or dispositioned
non-blocking findings for `BANDIT-076`.

## Summary

Local Qwen formation review for `BANDIT-076` did not run to a reviewer verdict.
The blocker is provider availability for the only authorized Bandit Local Qwen
route: `.bandit/reviewers/local-qwen.json` -> `node
bin/omlx-chat-completions.mjs` -> `http://127.0.0.1:8000/v1`. No direct `qwen`
CLI evidence is claimed or allowed.
