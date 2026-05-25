import { computeReviewSubjectHash } from "../state/review-subject-hash.js";
import { readWorkItem } from "../state/work-items.js";

export async function reviewSubjectHash(repoRoot: string, workItemId?: string) {
  if (!workItemId) {
    throw new Error("Usage: bandit review-subject-hash <work-item-id>");
  }

  await readWorkItem(repoRoot, workItemId);
  const subject = await computeReviewSubjectHash(repoRoot, workItemId);

  return {
    output: [
      `Work item: ${workItemId}`,
      `Review subject hash: ${subject.hash}`,
      `Review subject policy: v${subject.policyVersion}`,
      "Review subject paths:",
      ...subject.paths.map((subjectPath) => `  - ${subjectPath}`)
    ].join("\n").concat("\n")
  };
}
