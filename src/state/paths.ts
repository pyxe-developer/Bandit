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
    updateChannel: path.join(stateRoot, "update-channel.json"),
    updateChannelCache: path.join(stateRoot, "update-channel-cache.json"),
    agentEvaluationPolicy: path.join(
      policyRoot,
      "agent-evaluation-harness.json"
    ),
    autoLandingPolicy: path.join(policyRoot, "auto-landing.json"),
    claimAuthorityPolicy: path.join(policyRoot, "claim-authority.json"),
    coordinationAuthorityPolicy: path.join(
      policyRoot,
      "coordination-authority.json"
    ),
    heartbeatPolicy: path.join(policyRoot, "heartbeat-chore-agent.json"),
    gitMutationPolicy: path.join(policyRoot, "git-mutations.json"),
    inputQuarantinePolicy: path.join(policyRoot, "input-quarantine.json"),
    landingAgentContract: path.join(policyRoot, "landing-agent.json"),
    operatorBoundaryPolicy: path.join(policyRoot, "operator-boundary.json"),
    orchestratorPromptsPolicy: path.join(
      policyRoot,
      "orchestrator-prompts.json"
    ),
    riskClassificationPolicy: path.join(policyRoot, "risk-classification.json"),
    skillLifecyclePolicy: path.join(policyRoot, "skill-lifecycle-contracts.json"),
    stage4EvidenceHeadPolicy: path.join(policyRoot, "stage4-evidence-head.json"),
    supplyChainPolicy: path.join(policyRoot, "supply-chain-gate.json"),
    testStrengthGatePolicy: path.join(policyRoot, "test-strength-gate.json"),
    verificationOracleProvenancePolicy: path.join(
      policyRoot,
      "verification-oracle-provenance.json"
    ),
    trustVerifierCutoverGatesPolicy: path.join(
      policyRoot,
      "trust-verifier-cutover-gates.json"
    ),
    replayRegressionCorpusPolicy: path.join(
      policyRoot,
      "replay-regression-corpus.json"
    ),
    smellTriggers: path.join(policyRoot, "smell-triggers.json"),
    eventDrivenWakeSchedulerPolicy: path.join(
      policyRoot,
      "event-driven-wake-scheduler.json"
    )
  };
}
