# Local Qwen Review: BANDIT-008

contract_version: 1
work_item: BANDIT-008
source_head: 9edab178bad9c9cafa9e939f724b86faec261e35
profile_id: local-qwen-baseline
runtime: command
model: omlx-local/Qwen3.6-35B-A3B-MLX-8bit
run_status: inconclusive
reviewer_verdict: blocker
findings_status: inconclusive
findings_disposition: Live Bandit reviewer command reached Mastra Code/oMLX but did not return valid reviewer JSON for the full BANDIT-008 review packet.
operator_input_status: none_required
source_drift_status: current
executable_evidence:
  - `npm run bandit -- qwen-review BANDIT-008` exited nonzero with `Local Qwen reviewer output was inconclusive` at source head `9edab178bad9c9cafa9e939f724b86faec261e35`.
  - Direct subprocess capture with `.bandit/reviewers/mastracode-local-qwen.settings.json` showed Mastra Code selected `omlx-local/Qwen3.6-35B-A3B-MLX-8bit`, avoided the prior Google-key OM abort, exited 0, and returned an empty JSON envelope for the full review packet.
  - Direct small-prompt smoke with the same settings and model returned a valid JSON envelope, proving the corrected local oMLX route is reachable.
bootstrap_gaps:
  - Full-packet Mastra Code/oMLX review remains inconclusive for BANDIT-008 and is not treated as a pass.
  - The previous Google-key OM dependency was removed from the Bandit reviewer profile by using repo-local Mastra Code settings rather than adding `GOOGLE_GENERATIVE_AI_API_KEY`.
