#!/usr/bin/env node
import { agentEvaluation } from "./commands/agent-evaluation.js";
import { agentObservability } from "./commands/agent-observability.js";
import { initBandit } from "./commands/init.js";
import { artifactInputs } from "./commands/artifact-inputs.js";
import { createArtifact } from "./commands/artifact-create.js";
import { autoLandCheck } from "./commands/auto-land-check.js";
import { claim } from "./commands/claim.js";
import { cockpit } from "./commands/cockpit.js";
import { coderabbitReview } from "./commands/coderabbit-review.js";
import { coordination } from "./commands/coordination.js";
import { coordinationAuthority } from "./commands/coordination-authority.js";
import { draftWork } from "./commands/draft-work.js";
import { escalatedReview } from "./commands/escalated-review.js";
import { gitMutation } from "./commands/git-mutation.js";
import { heartbeat } from "./commands/heartbeat.js";
import { improvements } from "./commands/improvements.js";
import { inputQuarantine } from "./commands/input-quarantine.js";
import { land } from "./commands/land.js";
import { listBootstrapGaps } from "./commands/gaps.js";
import { landCheck } from "./commands/land-check.js";
import { listWorkItems } from "./commands/list.js";
import { operatorBoundary } from "./commands/operator-boundary.js";
import { orchestratorPrompts } from "./commands/orchestrator-prompts.js";
import { qwenReview } from "./commands/qwen-review.js";
import { reviewSubjectHash } from "./commands/review-subject-hash.js";
import { riskClassification } from "./commands/risk-classification.js";
import { routeWorkItem } from "./commands/route.js";
import { showWorkItem } from "./commands/show.js";
import { skillLifecycle } from "./commands/skill-lifecycle.js";
import { stageCapabilityScope } from "./commands/stage-capability-scope.js";
import { supplyChainGate } from "./commands/supply-chain-gate.js";
import { testStrengthGate } from "./commands/test-strength-gate.js";
import { evidenceFreshnessSlos } from "./commands/evidence-freshness-slos.js";
import { tokenCostFailsafe } from "./commands/token-cost-failsafe.js";
import { uat } from "./commands/uat.js";
import { sessionContext } from "./commands/session-context.js";
import { updateCheck } from "./commands/update-check.js";
import { emitCachedUpdateAlert } from "./state/update-channel.js";
import { validateBandit } from "./commands/validate.js";
import { canonicalJson } from "./state/gate-determinism.js";
import { replayRegressionCorpus } from "./commands/replay-regression-corpus.js";
import { verificationOracleProvenance } from "./commands/verification-oracle-provenance.js";
import { eventDrivenWakeScheduler } from "./commands/event-driven-wake-scheduler.js";
import { repoPm } from "./commands/repo-pm.js";
import { roleContracts } from "./commands/role-contracts.js";
import { roleRuns } from "./commands/role-runs.js";
import { trust } from "./commands/trust.js";
import { workItemPm } from "./commands/work-item-pm.js";
import { worktreeBootstrap } from "./commands/worktree-bootstrap.js";
import { createWorkItem } from "./commands/work-item-create.js";

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (command && command !== "update-check") {
    await emitCachedUpdateAlert(process.cwd(), process.stderr);
  }

  if (!command) {
    console.error(
      "role-required: specify a role entry point to invoke the workflow\n\n" +
        "Usage: bandit <command>\n\n" +
        "Role entry points:\n" +
        "  bandit repo-pm <create-work-item|approve-formation> [args]\n" +
        "  bandit work-item-pm <start> <work-item-id>\n\n" +
        "Commands:\n" +
        "  bandit <init|validate|update-check|list|show|draft-work|work-item|artifact-inputs|artifact|route|land-check|land|auto-land-check|agent-evaluation|agent-observability|qwen-review|review-subject-hash|coderabbit-review|escalated-review|skill-lifecycle|stage-capability-scope|heartbeat|git-mutation|improvements|input-quarantine|risk-classification|supply-chain-gate|test-strength-gate|operator-boundary|orchestrator-prompts|uat|gaps|coordination|coordination-authority|claim|cockpit|session-context|worktree-bootstrap|event-driven-wake-scheduler|token-cost-failsafe|evidence-freshness-slos|role-contracts|role-runs|trust|verification-oracle-provenance>"
    );
    process.exitCode = 1;
    return;
  }

  if (command === "repo-pm") {
    const result = await repoPm(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "work-item-pm") {
    const result = await workItemPm(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "init") {
    const result = await initBandit(process.cwd());
    console.log(result.message);
    return;
  }

  if (command === "validate") {
    const result = await validateBandit(process.cwd());
    if (args.includes("--json")) {
      process.stdout.write(
        `${canonicalJson({
          status: "pass",
          gate_determinism_flake_gate: result.gateDeterminismFlakeGate,
          metamorphic_cross_projection_checks:
            result.metamorphicCrossProjectionChecks
        })}\n`
      );
      return;
    }
    console.log(result.message);
    return;
  }

  if (command === "update-check") {
    const result = await updateCheck(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "list") {
    const result = await listWorkItems(process.cwd());
    process.stdout.write(result.output);
    return;
  }

  if (command === "gaps") {
    if (args[0] !== "list") {
      console.error("Usage: bandit gaps <list>");
      process.exitCode = 1;
      return;
    }

    const result = await listBootstrapGaps(process.cwd());
    process.stdout.write(result.output);
    return;
  }

  if (command === "heartbeat") {
    const result = await heartbeat(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "git-mutation") {
    const result = await gitMutation(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "improvements") {
    const result = await improvements(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "input-quarantine") {
    const result = await inputQuarantine(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "risk-classification") {
    const result = await riskClassification(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "supply-chain-gate") {
    const result = await supplyChainGate(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "test-strength-gate") {
    const result = await testStrengthGate(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "operator-boundary") {
    const result = await operatorBoundary(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "orchestrator-prompts") {
    const result = await orchestratorPrompts(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "draft-work") {
    const result = await draftWork(process.cwd(), args[0]);
    process.stdout.write(result.output);
    return;
  }

  if (command === "work-item") {
    const result = await createWorkItem(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "artifact-inputs") {
    const result = await artifactInputs(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "artifact") {
    const result = await createArtifact(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "show") {
    const result = await showWorkItem(process.cwd(), args[0]);
    process.stdout.write(result.output);
    return;
  }

  if (command === "route") {
    const result = await routeWorkItem(process.cwd(), args[0]);
    process.stdout.write(result.output);
    return;
  }

  if (command === "land-check") {
    const result = await landCheck(process.cwd(), args[0]);
    process.stdout.write(result.output);
    return;
  }

  if (command === "land") {
    const result = await land(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "auto-land-check") {
    const result = await autoLandCheck(process.cwd(), args[0]);
    process.stdout.write(result.output);
    return;
  }

  if (command === "agent-evaluation") {
    const result = await agentEvaluation(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "agent-observability") {
    const result = await agentObservability(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "uat") {
    const result = await uat(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "qwen-review") {
    const result = await qwenReview(process.cwd(), args[0]);
    process.stdout.write(result.output);
    return;
  }

  if (command === "review-subject-hash") {
    const result = await reviewSubjectHash(process.cwd(), args[0]);
    process.stdout.write(result.output);
    return;
  }

  if (command === "coderabbit-review") {
    const result = await coderabbitReview(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "escalated-review") {
    const result = await escalatedReview(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "skill-lifecycle") {
    const result = await skillLifecycle(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "stage-capability-scope") {
    const result = await stageCapabilityScope(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "coordination") {
    const result = await coordination(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "coordination-authority") {
    const result = await coordinationAuthority(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "claim") {
    const result = await claim(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "cockpit") {
    const result = await cockpit(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "session-context") {
    const result = await sessionContext(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "worktree-bootstrap") {
    const result = await worktreeBootstrap(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "event-driven-wake-scheduler") {
    const result = await eventDrivenWakeScheduler(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "token-cost-failsafe") {
    const result = await tokenCostFailsafe(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "evidence-freshness-slos") {
    const result = await evidenceFreshnessSlos(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "role-contracts") {
    const result = await roleContracts(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "role-runs") {
    const result = await roleRuns(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "trust") {
    const result = await trust(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "replay-regression-corpus") {
    const result = await replayRegressionCorpus(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  if (command === "verification-oracle-provenance") {
    const result = await verificationOracleProvenance(process.cwd(), args);
    process.stdout.write(result.output);
    return;
  }

  const commandText = command ? `Unknown command: ${command}` : "Missing command";
  console.error(`${commandText}\nUsage: bandit <init|validate|update-check|list|show|draft-work|work-item|artifact-inputs|artifact|route|land-check|land|auto-land-check|agent-evaluation|agent-observability|qwen-review|review-subject-hash|coderabbit-review|escalated-review|skill-lifecycle|stage-capability-scope|heartbeat|git-mutation|improvements|input-quarantine|risk-classification|supply-chain-gate|test-strength-gate|operator-boundary|orchestrator-prompts|uat|gaps|coordination|coordination-authority|claim|cockpit|session-context|worktree-bootstrap|event-driven-wake-scheduler|token-cost-failsafe|evidence-freshness-slos|role-contracts|role-runs|trust|verification-oracle-provenance>`);
  process.exitCode = 1;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
