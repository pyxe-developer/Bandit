export type RoleInputPacket = {
  kind: "role_input_packet";
  authority: "derived_non_canonical";
  work_item: string;
  stage: string;
  public_workflow_command: null;
  source_hierarchy: string[];
  allowed_writes: string[];
  forbidden_writes: string[];
  evidence_paths: string[];
  operator_input_boundary: string;
  stop_conditions: string[];
  clean_code_expectations: string[];
};

type AssembleParams = {
  workItemId: string;
  stage: string;
  briefPath: string;
  stageRubricPath: string;
  cleanCodePath: string;
  currentEvidence?: string[];
  publicWorkflowCommand?: string;
};

const STAGE_3_ALLOWED_WRITES = [
  "src/state/work-execute-controller.ts",
  "src/state/stage-route-registry.ts",
  "src/state/role-input-packets.ts",
  "src/state/provider-blocker-evidence.ts",
  "src/commands/work-execute-controller.ts",
  "src/commands/work-item-pm.ts",
  "src/commands/validate.ts",
  "src/cli.ts"
];

const STAGE_3_TEST_FILES = [
  "test/work-execute-controller.test.mjs",
  "test/stage-route-registry.test.mjs",
  "test/role-input-packets.test.mjs",
  "test/provider-blocker-evidence.test.mjs"
];

const STOP_CONDITIONS = [
  "provider_timeout",
  "provider_error",
  "malformed_provider_output",
  "unavailable_route",
  "missing_operator_owned_input",
  "stale_evidence",
  "review_blocker",
  "gate_failure"
];

const CLEAN_CODE_EXPECTATIONS = [
  "Keep functions small and explicit; avoid broad orchestration functions.",
  "Separate route lookup, packet assembly, evidence recording, and diagnostics.",
  "Fail closed for missing routes, unauthorized paths, and unresolved blockers.",
  "No hidden workflow authority in helpers, indexes, or command output."
];

function getAllowedWrites(stage: string, workItemId: string): string[] {
  if (stage === "stage_3_implementation") {
    return [
      ...STAGE_3_ALLOWED_WRITES,
      `docs/work/${workItemId}/implementation-evidence.md`,
      `docs/work/${workItemId}/writer-report.md`
    ];
  }
  return [];
}

function getForbiddenWrites(stage: string, workItemId: string): string[] {
  if (stage === "stage_3_implementation") {
    return [
      ...STAGE_3_TEST_FILES,
      `docs/work/${workItemId}/red-evidence.md`,
      `docs/work/${workItemId}/orchestration-plan.md`,
      `docs/work/${workItemId}/formation-review.md`,
      `docs/work/${workItemId}/coordination-log.jsonl`,
      `docs/work/${workItemId}/coderabbit-formation-review.md`,
      `docs/work/${workItemId}/qwen-formation-review.md`
    ];
  }
  return [];
}

export function assembleRoleInputPacket(params: AssembleParams): RoleInputPacket {
  if (params.publicWorkflowCommand) {
    throw new Error(
      `public context command exposure is forbidden: ` +
        `role input packets must not expose a public workflow command ` +
        `such as "bandit context <stage>"; ` +
        `received: ${params.publicWorkflowCommand}`
    );
  }

  const sourceHierarchy = [
    "AGENTS.md",
    "docs/roadmap/CURRENT_CONTEXT.md",
    params.briefPath,
    params.stageRubricPath,
    params.cleanCodePath,
    ...(params.currentEvidence ?? [])
  ];

  const allowedWrites = getAllowedWrites(params.stage, params.workItemId);
  const forbiddenWrites = getForbiddenWrites(params.stage, params.workItemId);

  return {
    kind: "role_input_packet",
    authority: "derived_non_canonical",
    work_item: params.workItemId,
    stage: params.stage,
    public_workflow_command: null,
    source_hierarchy: sourceHierarchy,
    allowed_writes: allowedWrites,
    forbidden_writes: forbiddenWrites,
    evidence_paths: params.currentEvidence ?? [],
    operator_input_boundary:
      "Halt for operator input on product direction, UAT, policy, " +
      "paid/live routing, landing autonomy, or Trust Verifier cutover.",
    stop_conditions: STOP_CONDITIONS,
    clean_code_expectations: CLEAN_CODE_EXPECTATIONS
  };
}
