# project-profile.md

Project profile template for Bandit-governed repositories.
Copy this file, fill in the fields, save as JSON, and pass it to `bandit init --profile <file>`.

## Usage

```sh
bandit init --profile my-project-profile.json
```

## Template

Save the JSON below as `<your-project>-profile.json` before running init.

```json
{
  "contract_version": 1,
  "name": "Your Project Name",
  "work_item_prefix": "PROJ",
  "starter_work_item": {
    "number": 1,
    "title": "Consumer Onboarding Starter",
    "current_stage": "Stage 1: starter_ready",
    "next_action": "Complete Stage 1 brief formation for PROJ-001."
  },
  "roadmap_seed": {
    "current_phase": "Project Bootstrap",
    "planned_work": [
      { "kind": "slice", "id": "PROJ-002", "title": "First Delivery Slice" }
    ]
  },
  "reviewers": [
    {
      "id": "local-qwen-baseline",
      "type": "openai_compatible",
      "provider": "omlx-openai-compatible",
      "required": true,
      "provider_base_url": "http://127.0.0.1:8001/v1",
      "model": "Qwen3.6-35B-A3B-MLX-8bit",
      "command": {
        "executable": "node",
        "args": ["bin/omlx-chat-completions.mjs", "{{prompt_stdin}}"]
      }
    }
  ],
  "policy_tiers": ["core"],
  "harnesses": ["codex"]
}
```

## Fields

- `contract_version`: Must be `1`. Reserved for future schema evolution.
- `name`: Human-readable project name. Non-empty string.
- `work_item_prefix`: Uppercase letters and digits, starting with a letter (e.g. `PROJ`, `MYCO2`). Used as the prefix for all work item IDs in this repo.
- `starter_work_item`: Seed data for the project's first work item brief. Must include `title`. `number` defaults to `1`.
- `roadmap_seed`: Seed data for `docs/roadmap/ROADMAP.md`. Must include `current_phase`.
- `reviewers`: Array of reviewer declarations. Each entry must have `id`, `type`, `provider`, and `required`, plus type-specific fields such as `provider_base_url` for `openai_compatible`.
- `policy_tiers`: Array of strings naming the policy tiers active for this project (e.g. `["core"]`).
- `harnesses`: Array of strings naming the test harnesses in use (e.g. `["codex"]`).

## Validation

Bandit validates the profile before scaffolding. Validation errors name the offending field:

```
Invalid profile field: work_item_prefix (must be uppercase letters and digits, starting with a letter)
```
