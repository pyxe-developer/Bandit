import { readCodeRabbitReview } from "../state/coderabbit-review.js";
import { readWorkItem } from "../state/work-items.js";

export async function coderabbitReview(repoRoot: string, workItemId?: string) {
  if (!workItemId) {
    throw new Error("Usage: bandit coderabbit-review <work-item-id>");
  }

  await readWorkItem(repoRoot, workItemId);

  const evidence = await readCodeRabbitReview(repoRoot, workItemId);

  return {
    output: [
      `CodeRabbit review: ${evidence.coderabbitVerdict}`,
      `Evidence: ${evidence.displayPath}`,
      `Provider: ${evidence.provider}`,
      `Review state: ${evidence.reviewState}`,
      `Findings: ${evidence.findingsStatus}`
    ].join("\n").concat("\n")
  };
}
