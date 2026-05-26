import {
  readImprovementCandidates,
  validateImprovementEvaluation
} from "../state/improvements.js";

export async function improvements(repoRoot: string, args: string[]) {
  const [action, ...actionArgs] = args;

  if (action === "candidates") {
    return candidates(repoRoot, actionArgs);
  }

  if (action === "evaluate") {
    return evaluate(repoRoot, actionArgs);
  }

  throw new Error(improvementsUsage());
}

async function candidates(repoRoot: string, args: string[]) {
  if (args.some((arg) => arg !== "--json")) {
    throw new Error("Usage: bandit improvements candidates [--json]");
  }

  const report = {
    candidates: await readImprovementCandidates(repoRoot)
  };

  if (args.includes("--json")) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return {
    output:
      report.candidates.length === 0
        ? "No improvement candidates found.\n"
        : report.candidates
            .map((candidate) => `${candidate.id}: ${candidate.status}`)
            .join("\n")
            .concat("\n")
  };
}

async function evaluate(repoRoot: string, args: string[]) {
  const { candidateId, evidencePath, json } = parseEvaluateArgs(args);
  const report = await validateImprovementEvaluation(
    repoRoot,
    candidateId,
    evidencePath
  );

  if (json) {
    return { output: `${JSON.stringify(report, null, 2)}\n` };
  }

  return {
    output: [
      `Improvement evaluation: ${report.result}`,
      `Decision: ${report.decision}`,
      `Routing action: ${report.routing_action}`
    ].join("\n").concat("\n")
  };
}

function parseEvaluateArgs(args: string[]) {
  const [candidateId, ...options] = args;
  let evidencePath = "";
  let json = false;

  if (!candidateId) {
    throw new Error(evaluateUsage());
  }

  for (let index = 0; index < options.length; index += 1) {
    const option = options[index];

    if (option === "--json") {
      json = true;
      continue;
    }

    if (option === "--evidence") {
      const value = options[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(evaluateUsage());
      }
      evidencePath = value;
      index += 1;
      continue;
    }

    throw new Error(evaluateUsage());
  }

  if (!evidencePath) {
    throw new Error(evaluateUsage());
  }

  return { candidateId, evidencePath, json };
}

function improvementsUsage() {
  return "Usage: bandit improvements <candidates|evaluate>";
}

function evaluateUsage() {
  return "Usage: bandit improvements evaluate <candidate-id> --evidence <path> [--json]";
}
