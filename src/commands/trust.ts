import { verifyTrustSnapshot, writeTrustReport } from "../state/trust-verify.js";
import type { TrustReport } from "../state/trust-verify.js";
import {
  validateTrustVerifierCutoverGates,
  type TrustVerifierCutoverGateReport
} from "../state/trust-verifier-cutover-gates.js";

const REFUSED_FLAGS: Record<string, string> = {
  "--replace-land-check":
    "trust verifier compatibility period: cannot replace existing gates",
  "--run-tests":
    "trust verifier is read-only: does not run tests",
};

export async function trust(repoRoot: string, args: string[]): Promise<{ output: string }> {
  const [subcommand, ...rest] = args;

  if (subcommand === "verify") {
    return trustVerify(repoRoot, rest);
  }

  if (subcommand === "cutover-gates") {
    return trustCutoverGates(repoRoot, rest);
  }

  throw new Error(
    "Usage: bandit trust <verify|cutover-gates> ...\n" +
      "  bandit trust verify <snapshot.json> [--json] [--report <path>]\n" +
      "  bandit trust cutover-gates validate [--json]"
  );
}

async function trustCutoverGates(
  repoRoot: string,
  args: string[]
): Promise<{ output: string }> {
  const [action, ...options] = args;

  if (action !== "validate" || options.some((option) => option !== "--json")) {
    throw new Error("Usage: bandit trust cutover-gates validate [--json]");
  }

  const report = await validateTrustVerifierCutoverGates(repoRoot);

  if (options.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: formatCutoverGateReport(report) };
}

function formatCutoverGateReport(
  report: TrustVerifierCutoverGateReport
): string {
  const lines = [
    `verdict: ${report.verdict}`,
    `compatibility_period: ${report.compatibility_period}`,
    `old_gates_authoritative: ${report.old_gates_authoritative}`,
    `approved_trust_goals: ${
      report.approved_trust_goals.length > 0
        ? report.approved_trust_goals.join(", ")
        : "(none)"
    }`,
  ];
  return lines.join("\n") + "\n";
}

async function trustVerify(
  repoRoot: string,
  args: string[]
): Promise<{ output: string }> {
  for (const flag of Object.keys(REFUSED_FLAGS)) {
    if (args.includes(flag)) {
      throw new Error(REFUSED_FLAGS[flag]);
    }
  }

  const snapshotPath = args[0];
  if (!snapshotPath || snapshotPath.startsWith("--")) {
    throw new Error(
      "Usage: bandit trust verify <snapshot.json> [--json] [--report <path>]"
    );
  }

  const wantsJson = args.includes("--json");
  const reportFlagIndex = args.indexOf("--report");
  const reportPath =
    reportFlagIndex !== -1 ? args[reportFlagIndex + 1] : undefined;

  const report = await verifyTrustSnapshot(repoRoot, snapshotPath);

  if (reportPath !== undefined) {
    await writeTrustReport(repoRoot, reportPath, report);
  }

  if (report.verdict !== "trusted") {
    process.exitCode = 1;
  }

  if (wantsJson) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return { output: formatTextReport(report) };
}

function formatTextReport(report: TrustReport): string {
  const lines = [
    `trust_goal: ${report.trust_goal}`,
    `verdict: ${report.verdict}`,
    `snapshot_hash: ${report.snapshot_hash}`,
  ];
  if (report.failed_checks.length > 0) {
    lines.push("failed_checks:");
    for (const check of report.failed_checks) {
      lines.push(`  - ${check}`);
    }
  }
  return lines.join("\n") + "\n";
}
