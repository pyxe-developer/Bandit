import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { createTempRepo, runBandit } from "./helpers/bandit-cli.mjs";

test("init --profile validates openai-compatible reviewer adapter fields", async () => {
  const repo = await createTempRepo();
  await writeProfile(repo, "profile.json", {
    reviewers: [
      {
        id: "acme-qwen",
        type: "openai_compatible",
        provider: "omlx-openai-compatible",
        required: true,
        model: "Qwen3.6-35B-A3B-MLX-8bit",
        command: {
          executable: "node",
          args: ["bin/omlx-chat-completions.mjs", "{{prompt_stdin}}"]
        }
      }
    ]
  });

  const result = await runBandit(repo, ["init", "--profile", "profile.json"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /reviewers\[0\]\.provider_base_url|reviewers\[0\]\.endpoint/
  );
});

test("init --profile rejects reviewer adapters without a type", async () => {
  const repo = await createTempRepo();
  await writeProfile(repo, "profile.json", {
    reviewers: [
      {
        id: "acme-qwen",
        provider: "omlx-openai-compatible",
        required: true,
        provider_base_url: "http://127.0.0.1:8001/v1",
        model: "Qwen3.6-35B-A3B-MLX-8bit",
        command: {
          executable: "node",
          args: ["bin/omlx-chat-completions.mjs", "{{prompt_stdin}}"]
        }
      }
    ]
  });

  const result = await runBandit(repo, ["init", "--profile", "profile.json"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /reviewers\[0\]\.type/);
});

test("init --profile rejects malformed reviewer arrays", async () => {
  const repo = await createTempRepo();
  await writeProfile(repo, "profile.json", {
    reviewers: {
      id: "acme-qwen",
      type: "openai_compatible"
    }
  });

  const result = await runBandit(repo, ["init", "--profile", "profile.json"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /reviewers.*array/);
});

test("init --profile rejects malformed openai-compatible reviewer URLs", async () => {
  const repo = await createTempRepo();
  await writeProfile(repo, "profile.json", {
    reviewers: [
      {
        id: "acme-qwen",
        type: "openai_compatible",
        provider: "omlx-openai-compatible",
        required: true,
        provider_base_url: "https://",
        model: "Qwen3.6-35B-A3B-MLX-8bit",
        command: {
          executable: "node",
          args: ["bin/omlx-chat-completions.mjs", "{{prompt_stdin}}"]
        }
      }
    ]
  });

  const result = await runBandit(repo, ["init", "--profile", "profile.json"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /reviewers\[0\]\.provider_base_url/);
});

test("init --profile rejects noncanonical human reviewer evidence paths", async () => {
  const repo = await createTempRepo();
  await writeProfile(repo, "profile.json", {
    reviewers: [
      {
        id: "staff-review",
        type: "human",
        provider: "human",
        required: true,
        evidence_path: "docs/work/<ID>/review.md"
      }
    ]
  });

  const result = await runBandit(repo, ["init", "--profile", "profile.json"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /reviewers\[0\]\.evidence_path.*human-review\.md/
  );
});

test("init --profile rejects non-string human reviewer provider values", async () => {
  const repo = await createTempRepo();
  await writeProfile(repo, "profile.json", {
    reviewers: [
      {
        id: "staff-review",
        type: "human",
        provider: { name: "human" },
        required: true,
        evidence_path: "docs/work/<ID>/human-review.md"
      }
    ]
  });

  const result = await runBandit(repo, ["init", "--profile", "profile.json"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /reviewers\[0\]\.provider/);
});

test("init --profile scaffolds typed reviewer adapters under .bandit/reviewers", async () => {
  const repo = await createTempRepo();
  await writeProfile(repo, "profile.json", {
    reviewers: [
      {
        id: "acme-qwen",
        type: "openai_compatible",
        provider: "omlx-openai-compatible",
        required: true,
        provider_base_url: "http://127.0.0.1:8001/v1",
        model: "Qwen3.6-35B-A3B-MLX-8bit",
        command: {
          executable: "node",
          args: ["bin/omlx-chat-completions.mjs", "{{prompt_stdin}}"]
        }
      },
      {
        id: "acme-cli",
        type: "cli_command",
        provider: "custom-cli",
        required: false,
        command: {
          executable: "node",
          args: ["tools/review.mjs", "{{work_item_id}}"]
        }
      },
      {
        id: "staff-review",
        type: "human",
        provider: "human",
        required: true,
        evidence_path: "docs/work/<ID>/human-review.md"
      }
    ]
  });

  const result = await runBandit(repo, ["init", "--profile", "profile.json"]);

  assert.equal(result.code, 0, result.stderr);

  const qwen = JSON.parse(
    await readFile(path.join(repo, ".bandit/reviewers/acme-qwen.json"), "utf8")
  );
  assert.equal(qwen.type, "openai_compatible");
  assert.equal(qwen.provider_base_url, "http://127.0.0.1:8001/v1");
  assert.equal(qwen.command.executable, "node");

  const cli = JSON.parse(
    await readFile(path.join(repo, ".bandit/reviewers/acme-cli.json"), "utf8")
  );
  assert.equal(cli.type, "cli_command");
  assert.equal(cli.provider, "custom-cli");
  assert.equal(cli.required, false);
  assert.deepEqual(cli.command, {
    executable: "node",
    args: ["tools/review.mjs", "{{work_item_id}}"]
  });

  const human = JSON.parse(
    await readFile(path.join(repo, ".bandit/reviewers/staff-review.json"), "utf8")
  );
  assert.equal(human.type, "human");
  assert.equal(human.evidence_path, "docs/work/<ID>/human-review.md");
});

test("init --profile records an open no-reviewer gap when reviewers are empty", async () => {
  const repo = await createTempRepo();
  await writeProfile(repo, "profile.json", { reviewers: [] });

  const result = await runBandit(repo, ["init", "--profile", "profile.json"]);

  assert.equal(result.code, 0, result.stderr);

  const ledger = JSON.parse(
    await readFile(path.join(repo, ".bandit/bootstrap-gaps.json"), "utf8")
  );
  const gap = ledger.gaps.find(
    (entry) => entry.id === "BANDIT-GAP-NO-REVIEWER-CONFIGURED"
  );
  assert.ok(gap, "expected a no-reviewer bootstrap gap");
  assert.equal(gap.status, "open");
  assert.equal(gap.disposition, "queued_chore");
  assert.equal(
    gap.next_action,
    "Configure a reviewer adapter or explicitly disposition the no-reviewer gap before landing."
  );
});

test("init --profile reopens terminal no-reviewer gaps when reviewers are empty", async () => {
  const repo = await createTempRepo();
  await mkdir(path.join(repo, ".bandit"), { recursive: true });
  await writeFile(
    path.join(repo, ".bandit/bootstrap-gaps.json"),
    `${JSON.stringify(
      {
        version: 1,
        gaps: [
          {
            id: "BANDIT-GAP-NO-REVIEWER-CONFIGURED",
            title: "No reviewer adapter configured",
            status: "resolved",
            disposition: "resolved",
            source_work_item: "ACME-000",
            source_artifacts: ["docs/work/ACME-000/brief.md"],
            linked_work_item: null,
            rationale: "Previously dispositioned.",
            verification_target: null,
            next_action: "No action required."
          }
        ]
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  await writeProfile(repo, "profile.json", { reviewers: [] });

  const result = await runBandit(repo, ["init", "--profile", "profile.json"]);

  assert.equal(result.code, 0, result.stderr);

  const ledger = JSON.parse(
    await readFile(path.join(repo, ".bandit/bootstrap-gaps.json"), "utf8")
  );
  const gap = ledger.gaps.find(
    (entry) => entry.id === "BANDIT-GAP-NO-REVIEWER-CONFIGURED"
  );
  assert.equal(gap.status, "open");
  assert.equal(gap.disposition, "queued_chore");
  assert.equal(gap.source_work_item, "ACME-001");
});

test("init --profile fails closed when the bootstrap gap ledger is malformed", async () => {
  const repo = await createTempRepo();
  await mkdir(path.join(repo, ".bandit"), { recursive: true });
  await writeFile(
    path.join(repo, ".bandit/bootstrap-gaps.json"),
    `${JSON.stringify({ version: 1, gaps: {} }, null, 2)}\n`,
    "utf8"
  );
  await writeProfile(repo, "profile.json", { reviewers: [] });

  const result = await runBandit(repo, ["init", "--profile", "profile.json"]);

  assert.equal(result.code, 1);
  assert.match(result.stderr, /Malformed bootstrap gap ledger.*gaps must be an array/);
});

test("Local Qwen profile fixture remains an openai-compatible reviewer adapter", async () => {
  const repo = await createTempRepo();
  const initResult = await runBandit(repo, ["init"]);
  assert.equal(initResult.code, 0, initResult.stderr);

  const profilePath = path.join(repo, ".bandit/reviewers/local-qwen-baseline.json");
  await mkdir(path.dirname(profilePath), { recursive: true });
  const originalAdapter = {
    type: "openai_compatible",
    id: "local-qwen-baseline",
    provider: "omlx-openai-compatible",
    provider_base_url: "http://127.0.0.1:8001/v1",
    model: "Qwen3.6-35B-A3B-MLX-8bit",
    command: {
      executable: "node",
      args: ["bin/omlx-chat-completions.mjs", "{{prompt_stdin}}"]
    },
    required: true
  };
  await writeFile(
    profilePath,
    `${JSON.stringify(originalAdapter, null, 2)}\n`,
    "utf8"
  );
  await writeProfile(repo, "profile.json", {
    reviewers: [
      {
        id: "local-qwen-baseline",
        type: "openai_compatible",
        provider: "different-provider",
        required: true,
        provider_base_url: "http://127.0.0.1:9999/v1",
        model: "Different-Model",
        command: {
          executable: "different-node",
          args: ["different-adapter.mjs"]
        }
      }
    ]
  });

  const skippedResult = await runBandit(repo, ["init", "--profile", "profile.json"]);
  assert.equal(skippedResult.code, 0, skippedResult.stderr);
  assert.match(skippedResult.stdout, /already initialized/i);

  const profile = JSON.parse(
    await readFile(profilePath, "utf8")
  );

  assert.equal(profile.type, "openai_compatible");
  assert.equal(profile.provider, "omlx-openai-compatible");
  assert.equal(profile.provider_base_url, "http://127.0.0.1:8001/v1");
  assert.equal(profile.command.executable, "node");
  assert.deepEqual(profile.command.args, [
    "bin/omlx-chat-completions.mjs",
    "{{prompt_stdin}}"
  ]);
});

async function writeProfile(repo, relativePath, overrides = {}) {
  const profile = {
    contract_version: 1,
    name: "ACME Product",
    work_item_prefix: "ACME",
    starter_work_item: {
      number: 1,
      title: "Consumer Onboarding Starter",
      current_stage: "Stage 1: starter_ready",
      next_action: "Complete Stage 1 brief formation for ACME-001."
    },
    roadmap_seed: {
      current_phase: "ACME Bootstrap",
      planned_work: [
        {
          kind: "slice",
          id: "ACME-002",
          title: "First Delivery Slice"
        }
      ]
    },
    reviewers: [
      {
        id: "local-qwen-baseline",
        type: "openai_compatible",
        provider: "omlx-openai-compatible",
        required: true,
        provider_base_url: "http://127.0.0.1:8001/v1",
        model: "Qwen3.6-35B-A3B-MLX-8bit",
        command: {
          executable: "node",
          args: ["bin/omlx-chat-completions.mjs", "{{prompt_stdin}}"]
        }
      }
    ],
    policy_tiers: ["core"],
    harnesses: ["codex"],
    ...overrides
  };

  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(profile, null, 2)}\n`, "utf8");
}
