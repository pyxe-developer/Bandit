import { validateReviewerCalibration } from "../state/reviewer-calibration.js";

export async function reviewerCalibration(repoRoot: string, args: string[]) {
  const [action, ...options] = args;

  if (action === "validate") {
    return validate(repoRoot, options);
  }

  throw new Error(reviewerCalibrationUsage());
}

async function validate(repoRoot: string, options: string[]) {
  const json = options.includes("--json");
  if (options.some((option) => option !== "--json")) {
    throw new Error("Usage: bandit reviewer-calibration validate [--json]");
  }

  const report = await validateReviewerCalibration(repoRoot);

  if (json) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return {
    output: `Reviewer calibration is valid (${report.packets.length} packet(s)).\n`
  };
}

function reviewerCalibrationUsage() {
  return "Usage: bandit reviewer-calibration <validate>";
}
