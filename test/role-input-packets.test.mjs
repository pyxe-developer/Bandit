import assert from "node:assert/strict";
import test from "node:test";
import { assembleRoleInputPacket } from "../src/state/role-input-packets.ts";

test("role input packet is internal derived support with scoped stage context", () => {
  const packet = assembleRoleInputPacket({
    workItemId: "BANDIT-096",
    stage: "stage_3_implementation",
    briefPath: "docs/work/BANDIT-096/brief.md",
    stageRubricPath: "docs/verification/STAGE_RUBRICS.md",
    cleanCodePath: "CLEAN_CODE.md",
    currentEvidence: [
      "docs/work/BANDIT-096/orchestration-plan.md",
      "docs/work/BANDIT-096/red-evidence.md"
    ]
  });

  assert.equal(packet.kind, "role_input_packet");
  assert.equal(packet.authority, "derived_non_canonical");
  assert.equal(packet.work_item, "BANDIT-096");
  assert.equal(packet.stage, "stage_3_implementation");
  assert.equal(packet.public_workflow_command, null);
  assert.deepEqual(packet.source_hierarchy.slice(0, 4), [
    "AGENTS.md",
    "docs/roadmap/CURRENT_CONTEXT.md",
    "docs/work/BANDIT-096/brief.md",
    "docs/verification/STAGE_RUBRICS.md"
  ]);
  assert.deepEqual(packet.allowed_writes, [
    "src/state/work-execute-controller.ts",
    "src/state/stage-route-registry.ts",
    "src/state/role-input-packets.ts",
    "src/state/provider-blocker-evidence.ts",
    "src/commands/work-execute-controller.ts",
    "src/commands/work-item-pm.ts",
    "src/commands/validate.ts",
    "src/cli.ts",
    "docs/work/BANDIT-096/implementation-evidence.md",
    "docs/work/BANDIT-096/writer-report.md"
  ]);
  assert.ok(packet.forbidden_writes.includes("test/work-execute-controller.test.mjs"));
  assert.ok(packet.forbidden_writes.includes("docs/work/BANDIT-096/red-evidence.md"));
  assert.ok(packet.stop_conditions.includes("provider_timeout"));
  assert.ok(packet.stop_conditions.includes("missing_operator_owned_input"));
  assert.match(packet.clean_code_expectations.join("\n"), /small.*explicit/i);
});

test("role input packet assembler refuses public context workflow command exposure", () => {
  assert.throws(
    () =>
      assembleRoleInputPacket({
        workItemId: "BANDIT-096",
        stage: "stage_2_red",
        briefPath: "docs/work/BANDIT-096/brief.md",
        stageRubricPath: "docs/verification/STAGE_RUBRICS.md",
        cleanCodePath: "CLEAN_CODE.md",
        publicWorkflowCommand: "bandit context stage_2_red"
      }),
    /public.*context.*command/i
  );
});
