import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

const REVIEW_SUBJECT_POLICY_VERSION = 1;

const STATIC_REVIEW_SUBJECT_PATHS = new Set([
  "AGENTS.md",
  "CONTEXT.md",
  "CLEAN_CODE.md",
  "docs/verification/STAGE_RUBRICS.md",
  "package.json",
  "tsconfig.json"
]);

const REVIEW_RELEVANT_WORK_ARTIFACTS = new Set([
  "brief.md",
  "red-evidence.md",
  "implementation-evidence.md",
  "ac10-repair-evidence.md"
]);

export async function computeReviewSubjectHash(
  repoRoot: string,
  workItemId: string
) {
  const trackedPaths = await readTrackedPaths(repoRoot);
  const reviewSubjectPaths = trackedPaths
    .filter((trackedPath) => isReviewSubjectPath(trackedPath, workItemId))
    .sort();
  const hash = createHash("sha256");

  hash.update(`bandit-review-subject-v${REVIEW_SUBJECT_POLICY_VERSION}\0`);
  hash.update(`work-item:${workItemId}\0`);

  for (const subjectPath of reviewSubjectPaths) {
    const content = await readFile(path.join(repoRoot, subjectPath));
    hash.update(subjectPath);
    hash.update("\0");
    hash.update(content);
    hash.update("\0");
  }

  return {
    algorithm: "sha256",
    policyVersion: REVIEW_SUBJECT_POLICY_VERSION,
    hash: hash.digest("hex"),
    paths: reviewSubjectPaths
  };
}

export function isReviewSubjectPath(trackedPath: string, workItemId: string) {
  if (trackedPath.startsWith("src/") || trackedPath.startsWith("test/")) {
    return true;
  }

  if (
    trackedPath.startsWith(".bandit/policy/") ||
    trackedPath.startsWith(".bandit/reviewers/")
  ) {
    return true;
  }

  if (STATIC_REVIEW_SUBJECT_PATHS.has(trackedPath)) {
    return true;
  }

  const workItemPrefix = `docs/work/${workItemId}/`;
  if (trackedPath.startsWith(workItemPrefix)) {
    return REVIEW_RELEVANT_WORK_ARTIFACTS.has(
      trackedPath.slice(workItemPrefix.length)
    );
  }

  return false;
}

function readTrackedPaths(repoRoot: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    execFile(
      "git",
      ["ls-files", "-z"],
      { cwd: repoRoot, maxBuffer: 1024 * 1024 },
      (error, stdout) => {
        if (error) {
          reject(new Error("Unable to compute review subject hash: git ls-files failed"));
          return;
        }

        resolve(stdout.split("\0").filter((entry) => entry.length > 0));
      }
    );
  });
}
