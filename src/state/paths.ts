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
    landingAgentContract: path.join(policyRoot, "landing-agent.json"),
    smellTriggers: path.join(policyRoot, "smell-triggers.json")
  };
}
