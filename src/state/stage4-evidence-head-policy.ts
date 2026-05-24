import { readFile, writeFile } from "node:fs/promises";

export type Stage4EvidenceHeadPolicy = {
  version: 1;
  terminalDispositionOnlyPathPatterns: string[];
};

const STAGE4_EVIDENCE_HEAD_POLICY_DISPLAY_PATH =
  ".bandit/policy/stage4-evidence-head.json";

const DEFAULT_TERMINAL_DISPOSITION_ONLY_PATH_PATTERNS = [
  "docs/work/<work_item_id>/",
  "docs/roadmap/CURRENT_CONTEXT.md",
  "docs/roadmap/ROADMAP.md",
  ".bandit/bootstrap-gaps.json"
];

export async function writeDefaultStage4EvidenceHeadPolicy(filePath: string) {
  const policy: Stage4EvidenceHeadPolicy = {
    version: 1,
    terminalDispositionOnlyPathPatterns:
      DEFAULT_TERMINAL_DISPOSITION_ONLY_PATH_PATTERNS
  };

  await writeFile(filePath, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
}

export async function validateStage4EvidenceHeadPolicy(repoRoot: string) {
  await readStage4EvidenceHeadPolicy(repoRoot);
}

export async function readStage4EvidenceHeadPolicy(
  repoRoot: string
): Promise<Stage4EvidenceHeadPolicy> {
  const filePath = `${repoRoot}/${STAGE4_EVIDENCE_HEAD_POLICY_DISPLAY_PATH}`;
  let raw: string;

  try {
    raw = await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(
        `Missing required policy: ${STAGE4_EVIDENCE_HEAD_POLICY_DISPLAY_PATH}`
      );
    }
    throw error;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Malformed Stage 4 evidence-head policy: invalid JSON");
  }

  if (!isObject(parsed)) {
    throw new Error("Malformed Stage 4 evidence-head policy: expected object");
  }

  if (parsed.version !== 1) {
    throw new Error("Malformed Stage 4 evidence-head policy: missing version 1");
  }

  const allowedFields = new Set([
    "version",
    "terminalDispositionOnlyPathPatterns"
  ]);
  for (const field of Object.keys(parsed)) {
    if (!allowedFields.has(field)) {
      throw new Error(
        `Malformed Stage 4 evidence-head policy: unsupported field ${field}`
      );
    }
  }

  const patterns = parsed.terminalDispositionOnlyPathPatterns;
  if (!Array.isArray(patterns) || patterns.length === 0) {
    throw new Error(
      "Malformed Stage 4 evidence-head policy: terminalDispositionOnlyPathPatterns must be a non-empty array"
    );
  }

  for (const pattern of patterns) {
    if (typeof pattern !== "string" || pattern.trim().length === 0) {
      throw new Error(
        "Malformed Stage 4 evidence-head policy: path patterns must be non-empty strings"
      );
    }
  }

  return {
    version: 1,
    terminalDispositionOnlyPathPatterns: patterns
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
