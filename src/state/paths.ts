import path from "node:path";

export function getBanditPaths(repoRoot: string) {
  const stateRoot = path.join(repoRoot, ".bandit");
  const policyRoot = path.join(stateRoot, "policy");

  return {
    stateRoot,
    policyRoot,
    config: path.join(stateRoot, "config.toml"),
    events: path.join(stateRoot, "events.jsonl"),
    bootstrapGaps: path.join(stateRoot, "bootstrap-gaps.json"),
    autoLandingPolicy: path.join(policyRoot, "auto-landing.json"),
    heartbeatPolicy: path.join(policyRoot, "heartbeat-chore-agent.json"),
    landingAgentContract: path.join(policyRoot, "landing-agent.json"),
    stage4EvidenceHeadPolicy: path.join(policyRoot, "stage4-evidence-head.json"),
    smellTriggers: path.join(policyRoot, "smell-triggers.json")
  };
}
