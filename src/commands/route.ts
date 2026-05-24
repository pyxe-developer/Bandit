import { readRoutingDecision } from "../state/routing-decisions.js";
import { readSmellCatalog } from "../state/smell-triggers.js";

export async function routeWorkItem(repoRoot: string, workItemId?: string) {
  if (!workItemId) {
    throw new Error("Usage: bandit route <work-item-id>");
  }

  const catalog = await readSmellCatalog(repoRoot);
  const decision = await readRoutingDecision(
    repoRoot,
    workItemId,
    catalog.smellIds
  );

  return {
    output: [
      `Work item: ${decision.workItem}`,
      `Decision kind: ${decision.decisionKind}`,
      `Selected route: ${decision.selectedRoute}`,
      "Applicable smell IDs:",
      ...decision.applicableSmellIds.map((smellId) => `  - ${smellId}`),
      `Escalation outcome: ${decision.escalationOutcome}`,
      "Evidence used:",
      ...decision.evidenceUsed.map((evidence) => `  - ${evidence}`),
      `Operator input: ${decision.operatorInputStatus}`,
      "Bootstrap gaps:",
      ...decision.bootstrapGaps.map((gap) => `  - ${gap}`),
      `Final decision: ${decision.finalDecision}`
    ].join("\n").concat("\n")
  };
}
