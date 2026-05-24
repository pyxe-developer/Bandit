import { execFile } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "../..");
const binPath = path.join(repoRoot, "bin/bandit.mjs");

export async function createTempRepo() {
  return mkdtemp(path.join(tmpdir(), "bandit-test-"));
}

export function runBandit(cwd, args) {
  return new Promise((resolve) => {
    execFile(
      process.execPath,
      [binPath, ...args],
      { cwd },
      (error, stdout, stderr) => {
        resolve({
          code: typeof error?.code === "number" ? error.code : 0,
          stdout,
          stderr
        });
      }
    );
  });
}

export async function writeWorkBrief(repo, id, title, status = "Ready") {
  const workDir = path.join(repo, "docs/work", id);
  await mkdir(workDir, { recursive: true });
  await writeFile(
    path.join(workDir, "brief.md"),
    `# ${id}: ${title}

## Status

${status}

## Goal

Test work item.
`,
    "utf8"
  );
}

export const localQwenTemplate = `# Local Qwen Review Template

contract_version:
work_item:
source_head:
profile_id:
runtime:
model:
run_status:
reviewer_verdict:
findings_status:
findings_disposition:
operator_input_status:
source_drift_status:
executable_evidence:
bootstrap_gaps:
`;

export const coderabbitTemplate = `# CodeRabbit Review Template

contract_version:
work_item:
source_head:
provider:
review_target:
review_state:
coderabbit_verdict:
findings_status:
findings_disposition:
operator_input_status:
source_drift_status:
executable_evidence:
bootstrap_gaps:
`;

export async function writeLocalQwenProfile(repo, overrides = {}) {
  const profile = {
    contract_version: 1,
    profile_id: "local-qwen-baseline",
    version: 1,
    runtime: "command",
    command: {
      executable: process.execPath,
      args: ["qwen-fixture.mjs"]
    },
    model: "fixture-qwen",
    prompt_contract: {
      role: "read_only_adversarial_reviewer",
      required_outputs: ["verdict", "findings", "summary"]
    },
    timeout_ms: 30000,
    permissions: {
      filesystem: "read_only",
      network: "disabled",
      can_edit_files: false,
      can_request_tools: false
    },
    output_contract: {
      format: "json",
      required_fields: ["verdict", "findings", "summary"]
    },
    unavailable_runtime_behavior: "fail_closed_or_bootstrap_gap",
    ...overrides
  };

  const destination = path.join(repo, ".bandit/reviewers/local-qwen.json");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(profile, null, 2)}\n`, "utf8");
}
