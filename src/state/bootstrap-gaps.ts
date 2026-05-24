import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { getBanditPaths } from "./paths.js";

export type BootstrapGap = {
  id: string;
  title: string;
  status: string;
  disposition: string;
  sourceWorkItem: string;
  sourceArtifacts: string[];
  linkedWorkItem: string | null;
  rationale: string;
  verificationTarget: string | null;
  nextAction: string;
};

export type BootstrapGapLedger = {
  version: 1;
  gaps: BootstrapGap[];
};

const BOOTSTRAP_GAPS_DISPLAY_PATH = ".bandit/bootstrap-gaps.json";
const SUPPORTED_STATUSES = new Set([
  "open",
  "blocking",
  "active",
  "resolved",
  "operator_input_blocked"
]);
const SUPPORTED_DISPOSITIONS = new Set([
  "active_chore",
  "queued_chore",
  "queued_chore_candidate",
  "resolved",
  "operator_input_blocker",
  "no_action"
]);

export async function readBootstrapGaps(repoRoot: string) {
  const paths = getBanditPaths(repoRoot);
  const content = await readRequiredLedger(paths.bootstrapGaps);

  return parseBootstrapGapLedger(content);
}

export async function writeDefaultBootstrapGapLedger(filePath: string) {
  const ledger = { version: 1, gaps: [] } satisfies BootstrapGapLedger;
  await writeFile(filePath, `${JSON.stringify(ledger, null, 2)}\n`, "utf8");
}

export async function validateBootstrapGaps(repoRoot: string) {
  const ledger = await readBootstrapGaps(repoRoot);

  for (const gap of ledger.gaps) {
    await validateGapReferences(repoRoot, gap);
  }
}

export function parseBootstrapGapLedger(content: string): BootstrapGapLedger {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Malformed bootstrap gap ledger: invalid JSON");
  }

  if (!isRecord(parsed) || parsed.version !== 1) {
    throw new Error("Malformed bootstrap gap ledger: missing version 1");
  }

  if (!Array.isArray(parsed.gaps)) {
    throw new Error("Malformed bootstrap gap ledger: missing gaps list");
  }

  const seenIds = new Set<string>();
  const gaps = parsed.gaps.map((rawGap, index) => {
    const gap = parseBootstrapGap(rawGap, index + 1);

    if (seenIds.has(gap.id)) {
      throw new Error(`Duplicate bootstrap gap ID: ${gap.id}`);
    }

    seenIds.add(gap.id);
    return gap;
  });

  return { version: 1, gaps };
}

async function validateGapReferences(repoRoot: string, gap: BootstrapGap) {
  for (const artifact of gap.sourceArtifacts) {
    await requireExistingPath(
      repoRoot,
      artifact,
      `Bootstrap gap ${gap.id} source artifact is missing: ${artifact}`
    );
  }

  if (gap.linkedWorkItem) {
    const briefPath = path.join("docs/work", gap.linkedWorkItem, "brief.md");
    await requireExistingPath(
      repoRoot,
      briefPath,
      `Bootstrap gap ${gap.id} links to missing work item brief: ${briefPath}`
    );
  }
}

function parseBootstrapGap(rawGap: unknown, gapNumber: number) {
  if (!isRecord(rawGap)) {
    throw new Error(`Malformed bootstrap gap at index ${gapNumber}`);
  }

  const id = requireString(rawGap, "id", gapNumber);
  const status = requireString(rawGap, "status", gapNumber);
  const disposition = requireGapString(rawGap, "disposition", id);
  const rationale = optionalString(rawGap.rationale);
  const linkedWorkItem = optionalString(rawGap.linked_work_item);
  const verificationTarget = optionalString(rawGap.verification_target);

  if (!SUPPORTED_STATUSES.has(status)) {
    throw new Error(`Bootstrap gap ${id} has unsupported status: ${status}`);
  }

  if (!SUPPORTED_DISPOSITIONS.has(disposition)) {
    throw new Error(
      `Bootstrap gap ${id} has unsupported disposition: ${disposition}`
    );
  }

  if (disposition === "no_action" && rationale.length === 0) {
    throw new Error(`Bootstrap gap ${id} no_action disposition requires rationale`);
  }

  if (disposition === "operator_input_blocker" && rationale.length === 0) {
    throw new Error(
      `Bootstrap gap ${id} operator_input_blocker disposition requires rationale`
    );
  }

  return {
    id,
    title: requireString(rawGap, "title", gapNumber),
    status,
    disposition,
    sourceWorkItem: requireString(rawGap, "source_work_item", gapNumber),
    sourceArtifacts: requireStringList(rawGap, "source_artifacts", gapNumber),
    linkedWorkItem,
    rationale,
    verificationTarget,
    nextAction: requireString(rawGap, "next_action", gapNumber)
  };
}

function requireGapString(
  record: Record<string, unknown>,
  field: string,
  gapId: string
) {
  const value = record[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Bootstrap gap ${gapId} missing required field: ${field}`);
  }

  return value.trim();
}

async function readRequiredLedger(filePath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing bootstrap gap ledger: ${BOOTSTRAP_GAPS_DISPLAY_PATH}`);
    }
    throw error;
  }
}

async function requireExistingPath(
  repoRoot: string,
  relativePath: string,
  message: string
) {
  try {
    await stat(path.join(repoRoot, relativePath));
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(message);
    }
    throw error;
  }
}

function requireString(
  record: Record<string, unknown>,
  field: string,
  gapNumber: number
) {
  const value = record[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Malformed bootstrap gap at index ${gapNumber}: missing required field: ${field}`
    );
  }

  return value.trim();
}

function requireStringList(
  record: Record<string, unknown>,
  field: string,
  gapNumber: number
) {
  const value = record[field];

  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every((item) => typeof item === "string" && item.trim().length > 0)
  ) {
    throw new Error(
      `Malformed bootstrap gap at index ${gapNumber}: missing required field: ${field}`
    );
  }

  return value.map((item) => item.trim());
}

function optionalString(value: unknown) {
  if (typeof value === "undefined" || value === null) {
    return "";
  }

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
