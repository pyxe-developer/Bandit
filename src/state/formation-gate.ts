import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { parseMetadataFields, readScalar } from "./metadata.js";

const REQUIRED_REVIEW_ARTIFACTS = [
  "qwen-formation-review.md",
  "coderabbit-formation-review.md",
  "formation-review.md"
] as const;

export function formationReviewArtifactPaths(workItemId: string) {
  return REQUIRED_REVIEW_ARTIFACTS.map(
    (artifact) => `docs/work/${workItemId}/${artifact}`
  );
}

export async function validateFormationBrief(
  repoRoot: string,
  workItemId: string
): Promise<void> {
  const briefPath = path.join(repoRoot, "docs/work", workItemId, "brief.md");
  let content: string;
  try {
    content = await readFile(briefPath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Formation validation failed: missing brief docs/work/${workItemId}/brief.md`);
    }
    throw error;
  }

  const errors = collectFormationErrors(content);
  if (errors.length > 0) {
    throw new Error(
      `Formation validation failed for docs/work/${workItemId}/brief.md: ${errors.join("; ")}`
    );
  }
}

export async function requireFormationReviewArtifacts(
  repoRoot: string,
  workItemId: string
): Promise<void> {
  const missing: string[] = [];

  for (const artifact of REQUIRED_REVIEW_ARTIFACTS) {
    const displayPath = `docs/work/${workItemId}/${artifact}`;
    try {
      await access(path.join(repoRoot, displayPath));
    } catch {
      missing.push(displayPath);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Formation approval requires missing review artifacts:\n${missing.map((p) => `  ${p}`).join("\n")}`
    );
  }
}

function collectFormationErrors(content: string): string[] {
  const errors: string[] = [];

  // Accept work_type field or Non-Product Work / Product Work section heading
  if (
    !/^work_type:\s*\S/m.test(content) &&
    !hasSectionWithContent(content, "Non-Product Work") &&
    !hasSectionWithContent(content, "Product Work")
  ) {
    errors.push("missing work type");
  }

  if (!hasSectionWithContent(content, "Origin")) {
    errors.push("missing source provenance");
  }

  if (!hasSectionWithContent(content, "Scope")) {
    errors.push("ambiguous or empty scope");
  }

  if (!hasSectionWithContent(content, "Acceptance Criteria")) {
    errors.push("unverifiable acceptance criteria");
  }

  // Accept Out Of Scope section or Stage Capability Scope (forbidden_actions = out-of-scope boundaries)
  if (
    !hasSectionWithContent(content, "Out Of Scope") &&
    !hasSectionWithContent(content, "Stage Capability Scope")
  ) {
    errors.push("missing out-of-scope boundaries");
  }

  if (!hasSectionWithContent(content, "Operator Input Status")) {
    errors.push("missing operator input status");
  }

  // Accept Role Boundary Evidence section or Stage Capability Scope (authority_roles = role boundaries)
  let roleBoundary = extractSectionContent(content, "Role Boundary Evidence");
  if (!roleBoundary.trim()) {
    roleBoundary = extractSectionContent(content, "Stage Capability Scope");
  }

  if (!roleBoundary.trim()) {
    errors.push("missing role boundary evidence");
  } else {
    if (!/Test Writer|test_writer/i.test(roleBoundary)) {
      errors.push("missing Test Writer boundary evidence");
    }
    if (!/Implementation Writer|implementation_writer/i.test(roleBoundary)) {
      errors.push("missing Implementation Writer boundary evidence");
    }
  }

  // Accept Write-Surface Families section or Expected Files (lists write surfaces by path family)
  if (
    !hasSectionWithContent(content, "Write-Surface Families") &&
    !hasSectionWithContent(content, "Expected Files")
  ) {
    errors.push("missing write-surface families");
  }

  if (!hasSectionWithContent(content, "Verification Plan")) {
    errors.push("missing execution readiness evidence");
  }

  return errors;
}

function extractSectionContent(content: string, sectionTitle: string): string {
  const pattern = new RegExp(
    `##\\s+${escapeRegExp(sectionTitle)}\\s*\\n([\\s\\S]*?)(?=\\n##|$)`,
    "i"
  );
  const match = content.match(pattern);
  return match ? (match[1] ?? "") : "";
}

function hasSectionWithContent(briefContent: string, sectionTitle: string): boolean {
  return extractSectionContent(briefContent, sectionTitle).trim().length > 0;
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const SUPPORTED_FINDINGS_STATUSES = new Set([
  "none",
  "no_findings",
  "resolved",
  "non_blocking",
  "open",
  "blocker"
]);

const SUPPORTED_VERDICTS = new Set([
  "pass",
  "fail",
  "blocker",
  "non_blocking",
  "not_applicable",
  "bootstrap_gap"
]);

function hasAcceptableDisposition(disposition: string): boolean {
  return disposition.length > 0 && disposition !== "undispositioned";
}

export async function inspectFormationReviewContent(
  repoRoot: string,
  artifactPaths: string[]
): Promise<void> {
  const errors: string[] = [];

  for (const artifactPath of artifactPaths) {
    let content: string;
    try {
      content = await readFile(path.join(repoRoot, artifactPath), "utf8");
    } catch {
      errors.push(`missing formation review artifact: ${artifactPath}`);
      continue;
    }

    const fields = parseMetadataFields(content);
    const verdict = readScalar(fields, "verdict").toLowerCase().trim();
    const findingsStatus = readScalar(fields, "findings_status").toLowerCase().trim();
    const findingsDisposition = readScalar(fields, "findings_disposition").toLowerCase().trim();

    if (!verdict) {
      errors.push(`missing verdict in ${artifactPath}: formation review must declare a verdict`);
      continue;
    }

    if (!SUPPORTED_VERDICTS.has(verdict)) {
      errors.push(`unsupported verdict "${verdict}" in ${artifactPath}`);
      continue;
    }

    if (verdict === "blocker" || verdict === "fail") {
      errors.push(`formation review verdict is "${verdict}" in ${artifactPath}`);
      continue;
    }

    if (!findingsStatus) {
      errors.push(`missing findings_status in ${artifactPath}: cannot assess formation review findings`);
      continue;
    }

    if (!SUPPORTED_FINDINGS_STATUSES.has(findingsStatus)) {
      errors.push(`unsupported findings_status "${findingsStatus}" in ${artifactPath}`);
      continue;
    }

    if (findingsStatus === "blocker" || findingsStatus === "open") {
      errors.push(
        `contradictory formation review in ${artifactPath}: verdict is "${verdict}" but findings_status is "${findingsStatus}"`
      );
      continue;
    }

    if (findingsStatus === "non_blocking" && !hasAcceptableDisposition(findingsDisposition)) {
      errors.push(
        `non-blocking findings in ${artifactPath} require an explicit acceptable disposition; ` +
        `findings_disposition is ${findingsDisposition || "empty"}`
      );
    } else if (findingsDisposition === "undispositioned") {
      errors.push(`undispositioned findings in ${artifactPath}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Formation approval blocked by review findings:\n${errors.map((e) => `  ${e}`).join("\n")}`
    );
  }
}

export async function recheckFormationEvidenceForStart(
  repoRoot: string,
  workItemId: string,
  evidencePaths: string[]
): Promise<void> {
  const stale: string[] = [];
  for (const evidencePath of evidencePaths) {
    try {
      await access(path.join(repoRoot, evidencePath));
    } catch {
      stale.push(evidencePath);
    }
  }
  if (stale.length > 0) {
    throw new Error(
      `Stale formation evidence for ${workItemId}:\n${stale.map((p) => `  ${p}`).join("\n")}`
    );
  }

  await inspectFormationReviewContent(repoRoot, evidencePaths);
  await recheckOperatorInputStatus(repoRoot, workItemId);
}

async function recheckOperatorInputStatus(
  repoRoot: string,
  workItemId: string
): Promise<void> {
  const briefPath = path.join(repoRoot, "docs/work", workItemId, "brief.md");
  let content: string;
  try {
    content = await readFile(briefPath, "utf8");
  } catch {
    throw new Error(`Missing operator input status: brief not found for ${workItemId}`);
  }

  const sectionContent = extractSectionContent(content, "Operator Input Status");
  if (!sectionContent.trim()) {
    throw new Error(
      `Missing operator input status in brief for ${workItemId}`
    );
  }

  if (/^\s*blocked\b/i.test(sectionContent)) {
    throw new Error(
      `Work item ${workItemId} has unresolved operator-owned input: operator input is blocked`
    );
  }
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
