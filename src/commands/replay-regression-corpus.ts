import { validateReplayRegressionCorpus } from "../state/replay-regression-corpus.js";

export async function replayRegressionCorpus(
  repoRoot: string,
  args: string[]
) {
  const [action, ...rest] = args;

  if (action === "validate") {
    return validate(repoRoot, rest);
  }

  throw new Error(
    "Usage: bandit replay-regression-corpus <validate> [--json]"
  );
}

async function validate(repoRoot: string, args: string[]) {
  let json = false;
  for (const arg of args) {
    if (arg === "--json") {
      json = true;
      continue;
    }
    throw new Error(
      "Usage: bandit replay-regression-corpus validate [--json]"
    );
  }

  const report = await validateReplayRegressionCorpus(repoRoot);

  if (json) {
    return { output: `${JSON.stringify(report)}\n` };
  }

  return {
    output:
      `Replay regression corpus: ${report.status}\n` +
      `Packets validated: ${report.packet_count}\n`
  };
}
