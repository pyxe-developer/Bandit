import { verifyTrustSnapshot, writeTrustReport } from "../state/trust-verify.js";
import type { TrustReport } from "../state/trust-verify.js";

const REFUSED_FLAGS: Record<string, string> = {
  "--replace-land-check":
    "trust verifier compatibility period: cannot replace existing gates",
  "--run-tests":
    "trust verifier is read-only: does not run tests",
};

export async function trust(repoRoot: string, args: string[]): Promise<{ output: string }> {
  const [subcommand, ...rest] = args;

  if (subcommand !== "verify") {
    throw new Error(
      "Usage: bandit trust verify <snapshot.json> [--json] [--report <path>]"
    );
  }

  return trustVerify(repoRoot, rest);
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
