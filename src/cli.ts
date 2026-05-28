#!/usr/bin/env node
import { agentEvaluation } from "./commands/agent-evaluation.js";
import { initBandit } from "./commands/init.js";
import { createArtifact } from "./commands/artifact-create.js";
import { autoLandCheck } from "./commands/auto-land-check.js";
import { claim } from "./commands/claim.js";
import { cockpit } from "./commands/cockpit.js";
import { coderabbitReview } from "./commands/coderabbit-review.js";
import { coordination } from "./commands/coordination.js";
import { coordinationAuthority } from "./commands/coordination-authority.js";
import { draftWork } from "./commands/draft-work.js";
import { escalatedReview } from "./commands/escalated-review.js";
import { heartbeat } from "./commands/heartbeat.js";
import { improvements } from "./commands/improvements.js";
import { inputQuarantine } from "./commands/input-quarantine.js";
import { land } from "./commands/land.js";
import { listBootstrapGaps } from "./commands/gaps.js";
import { landCheck } from "./commands/land-check.js";
import { listWorkItems } from "./commands/list.js";
import { operatorBoundary } from "./commands/operator-boundary.js";
import { qwenReview } from "./commands/qwen-review.js";
import { reviewSubjectHash } from "./commands/review-subject-hash.js";
import { riskClassification } from "./commands/risk-classification.js";
import { routeWorkItem } from "./commands/route.js";
import { showWorkItem } from "./commands/show.js";
import { skillLifecycle } from "./commands/skill-lifecycle.js";
import { supplyChainGate } from "./commands/supply-chain-gate.js";
import { uat } from "./commands/uat.js";
import { validateBandit } from "./commands/validate.js";
import { createWorkItem } from "./commands/work-item-create.js";

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (command === "init") {
    const result = await initBandit(process.cwd());
    console.log(result.message);
    return;
  }

  if (command === "validate") {
    const result = await validateBandit(process.cwd());
    console.log(result.message);
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

  if (command === "operator-boundary") {
    const result = await operatorBoundary(process.cwd(), args);
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

  const commandText = command ? `Unknown command: ${command}` : "Missing command";
  console.error(`${commandText}\nUsage: bandit <init|validate|list|show|draft-work|work-item|artifact|route|land-check|land|auto-land-check|agent-evaluation|qwen-review|review-subject-hash|coderabbit-review|escalated-review|skill-lifecycle|heartbeat|improvements|input-quarantine|risk-classification|supply-chain-gate|operator-boundary|uat|gaps|coordination|coordination-authority|claim|cockpit>`);
  process.exitCode = 1;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
