import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SUPPORTED_TRUST_GOALS = new Set([
  "stage_transition",
  "landing",
  "closeout",
  "evidence_refresh",
]);

type TrustVerdict = "trusted" | "needs_repair" | "blocked" | "requires_operator";

type EvidenceRef = { id: string; path: string; digest: string };

type ReviewerFinding = {
  reviewer: string;
  finding_id: string;
  severity: string;
  actionable: boolean;
  status?: string;
  disposition?: string;
  rationale?: string;
};

type RequiredOperatorInput = { gate: string; prompt: string };

type WorkItemSnapshot = {
  schema_version: number;
  trust_goal: string;
  work_item: { id: string; stable_id: string };
  repo: Record<string, string>;
  declared_intent: string;
  changed_surfaces: unknown[];
  policy_context: unknown[];
  evidence: EvidenceRef[];
  reviewer_findings: ReviewerFinding[];
  required_operator_input: RequiredOperatorInput[];
};

type EvidenceVerificationDetail = { id: string; path: string; verified: boolean };

type ReviewerFindingRouting = {
  finding_id: string;
  reviewer: string;
  disposition: string;
};

export type TrustReport = {
  trust_goal: string;
  verdict: TrustVerdict;
  snapshot_hash: string;
  passed_checks: string[];
  failed_checks: string[];
  evidence_verification: EvidenceVerificationDetail[];
  reviewer_finding_routing: ReviewerFindingRouting[];
  required_operator_input: RequiredOperatorInput[];
};

function sortedJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(sortedJson).join(",")}]`;
  const obj = value as Record<string, unknown>;
  const pairs = Object.keys(obj)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${sortedJson(obj[k])}`);
  return `{${pairs.join(",")}}`;
}

function canonicalSnapshotHash(snapshot: WorkItemSnapshot): string {
  return `sha256:${createHash("sha256").update(sortedJson(snapshot)).digest("hex")}`;
}

function validateSnapshotSchema(raw: unknown): WorkItemSnapshot {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("snapshot must be a JSON object");
  }
  const obj = raw as Record<string, unknown>;

  if (obj["schema_version"] === undefined || obj["schema_version"] === null) {
    throw new Error("snapshot missing required field: schema_version");
  }
  if (
    typeof obj["trust_goal"] !== "string" ||
    !SUPPORTED_TRUST_GOALS.has(obj["trust_goal"])
  ) {
    const goal = obj["trust_goal"] ?? "(missing)";
    throw new Error(`unsupported trust_goal: ${goal}`);
  }
  if (typeof obj["declared_intent"] !== "string" || !obj["declared_intent"]) {
    throw new Error("snapshot missing required field: declared_intent");
  }
  if (!obj["work_item"] || typeof obj["work_item"] !== "object") {
    throw new Error("snapshot missing required field: work_item");
  }
  if (!obj["repo"] || typeof obj["repo"] !== "object") {
    throw new Error("snapshot missing required field: repo");
  }
  if (!Array.isArray(obj["changed_surfaces"])) {
    throw new Error("snapshot missing required field: changed_surfaces");
  }
  if (!Array.isArray(obj["policy_context"])) {
    throw new Error("snapshot missing required field: policy_context");
  }
  if (!Array.isArray(obj["evidence"])) {
    throw new Error("snapshot missing required field: evidence");
  }
  if (!Array.isArray(obj["reviewer_findings"])) {
    throw new Error("snapshot missing required field: reviewer_findings");
  }
  if (!Array.isArray(obj["required_operator_input"])) {
    throw new Error("snapshot missing required field: required_operator_input");
  }

  return obj as unknown as WorkItemSnapshot;
}

function isUnsafeEvidencePath(p: string, repoRoot: string): boolean {
  if (path.isAbsolute(p)) return true;
  const normalized = path.normalize(p);
  if (normalized.startsWith("..")) return true;
  const resolved = path.resolve(repoRoot, p);
  return !resolved.startsWith(repoRoot + path.sep) && resolved !== repoRoot;
}

async function verifyEvidenceRefs(
  repoRoot: string,
  evidenceRefs: EvidenceRef[]
): Promise<EvidenceVerificationDetail[]> {
  const details: EvidenceVerificationDetail[] = [];

  for (const ref of evidenceRefs) {
    if (isUnsafeEvidencePath(ref.path, repoRoot)) {
      throw new Error(`unsafe evidence path: ${ref.path}`);
    }
    const absolutePath = path.resolve(repoRoot, ref.path);

    let content: Buffer;
    try {
      content = await readFile(absolutePath);
    } catch {
      throw new Error(`missing evidence file: ${ref.path}`);
    }

    const actualDigest = `sha256:${createHash("sha256").update(content).digest("hex")}`;
    if (actualDigest !== ref.digest) {
      throw new Error(`digest mismatch for evidence ${ref.id}: expected ${ref.digest}, got ${actualDigest}`);
    }

    details.push({ id: ref.id, path: ref.path, verified: true });
  }

  return details;
}

type FindingVerdictKind = "needs_repair" | "blocked";
type FindingFailure = { message: string; kind: FindingVerdictKind };

function validateReviewerFindingRouting(findings: ReviewerFinding[]): {
  failures: FindingFailure[];
  routing: ReviewerFindingRouting[];
} {
  const failures: FindingFailure[] = [];
  const routing: ReviewerFindingRouting[] = [];

  for (const finding of findings) {
    if (finding.actionable === true && finding.status === "unresolved") {
      failures.push({
        message: `unresolved actionable reviewer finding: ${finding.finding_id}`,
        kind: "needs_repair",
      });
      routing.push({
        finding_id: finding.finding_id,
        reviewer: finding.reviewer,
        disposition: "unresolved",
      });
    } else if (
      finding.actionable === true &&
      finding.disposition === "accepted" &&
      !finding.rationale
    ) {
      failures.push({
        message: `accepted non-blocking finding requires rationale: ${finding.finding_id}`,
        kind: "blocked",
      });
      routing.push({
        finding_id: finding.finding_id,
        reviewer: finding.reviewer,
        disposition: "accepted_without_rationale",
      });
    } else {
      routing.push({
        finding_id: finding.finding_id,
        reviewer: finding.reviewer,
        disposition: finding.disposition ?? finding.status ?? "ok",
      });
    }
  }

  return { failures, routing };
}

function deriveVerdict(
  routingFailures: FindingFailure[],
  hasOperatorInput: boolean
): TrustVerdict {
  if (hasOperatorInput) return "requires_operator";
  if (routingFailures.some((f) => f.kind === "blocked")) return "blocked";
  if (routingFailures.some((f) => f.kind === "needs_repair")) return "needs_repair";
  return "trusted";
}

export async function verifyTrustSnapshot(
  repoRoot: string,
  snapshotPath: string
): Promise<TrustReport> {
  const absoluteSnapshotPath = path.resolve(repoRoot, snapshotPath);

  let rawContent: string;
  try {
    rawContent = await readFile(absoluteSnapshotPath, "utf8");
  } catch {
    throw new Error(`cannot read snapshot: ${snapshotPath}`);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(rawContent);
  } catch {
    throw new Error(`snapshot is not valid JSON: ${snapshotPath}`);
  }

  const snapshot = validateSnapshotSchema(raw);
  const snapshotHash = canonicalSnapshotHash(snapshot);
  const passedChecks: string[] = ["snapshot_schema", "canonical_snapshot_hash"];

  const evidenceDetails = await verifyEvidenceRefs(repoRoot, snapshot.evidence);
  passedChecks.push("evidence_digests");

  const routingResult = validateReviewerFindingRouting(snapshot.reviewer_findings);
  const failedChecks = routingResult.failures.map((f) => f.message);

  if (routingResult.failures.length === 0) {
    passedChecks.push("reviewer_finding_routing");
  }

  const verdict = deriveVerdict(
    routingResult.failures,
    snapshot.required_operator_input.length > 0
  );

  return {
    trust_goal: snapshot.trust_goal,
    verdict,
    snapshot_hash: snapshotHash,
    passed_checks: passedChecks,
    failed_checks: failedChecks,
    evidence_verification: evidenceDetails,
    reviewer_finding_routing: routingResult.routing,
    required_operator_input: snapshot.required_operator_input,
  };
}

export async function writeTrustReport(
  repoRoot: string,
  reportPath: string,
  report: TrustReport
): Promise<void> {
  if (path.isAbsolute(reportPath) || path.normalize(reportPath).startsWith("..")) {
    throw new Error(`unsafe report path: ${reportPath}`);
  }
  const absoluteReportPath = path.resolve(repoRoot, reportPath);
  if (
    !absoluteReportPath.startsWith(repoRoot + path.sep) &&
    absoluteReportPath !== repoRoot
  ) {
    throw new Error(`unsafe report path: ${reportPath}`);
  }
  await mkdir(path.dirname(absoluteReportPath), { recursive: true });
  await writeFile(absoluteReportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}
