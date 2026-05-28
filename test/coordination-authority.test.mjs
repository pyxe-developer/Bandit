import assert from "node:assert/strict";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  createTempRepo,
  runBandit,
  writeLocalQwenProfile,
  writeWorkBrief
} from "./helpers/bandit-cli.mjs";

const thisFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(thisFile), "..");

const authorityPolicyPath = ".bandit/policy/coordination-authority.json";
const authorityTemplatePath = "docs/templates/coordination-authority.md";

test("validate fails closed when the coordination authority policy is missing", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteCoordinationAuthorityEvidence(repo, { omitPolicy: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required policy: \.bandit\/policy\/coordination-authority\.json/
  );
});

test("validate fails closed when the coordination authority template is missing", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteCoordinationAuthorityEvidence(repo, { omitTemplate: true });

  const result = await runBandit(repo, ["validate"]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required template: docs\/templates\/coordination-authority\.md/
  );
});

test("coordination authority validation rejects registered decisions without evidence", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteCoordinationAuthorityEvidence(repo, { omitEvidence: true });

  const result = await runBandit(repo, [
    "coordination-authority",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /Missing required coordination authority evidence: docs\/coordination-authority\/BANDIT-970-coordination-authority\.json/
  );
});

test("coordination authority rejects source-less projection surfaces", async () => {
  const repo = await createInitializedRepo();
  const authority = completeCoordinationAuthority();
  authority.projection_surfaces[0].source_history_refs = [];
  await writeCompleteCoordinationAuthorityEvidence(repo, { authority });

  const result = await runBandit(repo, [
    "coordination-authority",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /projection coordination_status requires source_history_refs or claim_authority_refs/
  );
});

test("coordination authority rejects direct projection workflow mutation", async () => {
  const repo = await createInitializedRepo();
  const authority = completeCoordinationAuthority();
  authority.projection_surfaces[0].mutation_path = "direct_projection_write";
  await writeCompleteCoordinationAuthorityEvidence(repo, { authority });

  const result = await runBandit(repo, [
    "coordination-authority",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /projection coordination_status cannot mutate release-authorized workflow state directly/
  );
});

test("coordination authority rejects projection and history disagreement", async () => {
  const repo = await createInitializedRepo();
  const authority = completeCoordinationAuthority();
  authority.history_replay.derived_current_state = "implementation_recorded";
  authority.projection_surfaces[0].reported_current_state =
    "implementation_recorded";
  await writeCompleteCoordinationAuthorityEvidence(repo, { authority });

  const result = await runBandit(repo, [
    "coordination-authority",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /projection coordination_status disagrees with append-only history for BANDIT-970/
  );
});

test("coordination authority rejects registry-granted writable claims without CAS authority", async () => {
  const repo = await createInitializedRepo();
  const authority = completeCoordinationAuthority();
  authority.projection_surfaces.push({
    name: "in_flight_registry",
    surface: "in_flight_registry",
    authority: "derived_non_canonical",
    source_history_refs: ["docs/work/BANDIT-970/coordination-log.jsonl"],
    claim_authority_refs: [],
    mutation_path: "rebuild_from_history",
    grants_release_authorized_claims: true,
    reported_current_state: "red_recorded"
  });
  await writeCompleteCoordinationAuthorityEvidence(repo, { authority });

  const result = await runBandit(repo, [
    "coordination-authority",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /in-flight registry cannot grant release-authorized writable claims without CAS claim-authority backing/
  );
});

test("coordination authority rejects .bandit claim files as independent claim authority", async () => {
  const repo = await createInitializedRepo();
  const authority = completeCoordinationAuthority();
  authority.claim_authority_exception = {
    status: "active",
    authority: ".bandit/claims.json",
    reference_paths: [".bandit/claims.json"],
    projections_may_grant_claims: true,
    rationale: ".bandit file owns writable claims."
  };
  await writeCompleteCoordinationAuthorityEvidence(repo, { authority });

  const result = await runBandit(repo, [
    "coordination-authority",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /\.bandit claim or registry files cannot be independent claim authority/
  );
});

test("coordination authority preserves actor-event non-authority", async () => {
  const repo = await createInitializedRepo();
  const authority = completeCoordinationAuthority();
  authority.actor_event_non_authority = {
    may_advance_workflow_state: true,
    may_satisfy_gates: true,
    may_emit_safe_triggers: true,
    evidence_path: "docs/work/BANDIT-970/coordination-log.jsonl"
  };
  await writeCompleteCoordinationAuthorityEvidence(repo, { authority });

  const result = await runBandit(repo, [
    "coordination-authority",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 1);
  assert.match(
    result.stderr,
    /actor coordination events cannot advance workflow stages, satisfy gates, or emit safe triggers/
  );
});

test("coordination authority accepts a complete low-risk projection-boundary record", async () => {
  const repo = await createInitializedRepo();
  await writeCompleteCoordinationAuthorityEvidence(repo);

  const result = await runBandit(repo, [
    "coordination-authority",
    "validate",
    "--json"
  ]);

  assert.equal(result.code, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    status: "pass",
    policy: authorityPolicyPath,
    decisions: ["BANDIT-970"],
    canonical_history: [
      "BANDIT-970:docs/work/BANDIT-970/coordination-log.jsonl"
    ],
    projections: ["BANDIT-970:coordination_status:derived_non_canonical"],
    claim_authority: ["BANDIT-970:future_scoped"]
  });
});

async function createInitializedRepo() {
  const repo = await createTempRepo();
  await runBandit(repo, ["init"]);
  await copyCommittedDirectory(repo, ".bandit/policy");
  await copyCommittedDirectory(repo, "docs/templates");
  await copyCommittedDirectory(repo, "docs/evaluation");
  await writeLocalQwenProfile(repo);
  return repo;
}

async function copyCommittedDirectory(repo, relativePath) {
  await cp(path.join(repoRoot, relativePath), path.join(repo, relativePath), {
    force: true,
    recursive: true
  });
}

async function writeCompleteCoordinationAuthorityEvidence(repo, options = {}) {
  if (options.omitTemplate) {
    await rm(path.join(repo, authorityTemplatePath), { force: true });
  } else {
    await writeCoordinationAuthorityTemplate(repo);
  }

  const workItemId = options.workItemId ?? "BANDIT-970";
  await writeWorkBrief(repo, workItemId, "Coordination Authority Fixture");
  await writeFileAt(
    repo,
    `docs/work/${workItemId}/red-evidence.md`,
    "# RED Evidence\n"
  );
  await writeCoordinationLog(repo, workItemId);

  const evidencePath = coordinationAuthorityEvidencePath(workItemId);
  const authority = options.authority ?? completeCoordinationAuthority(workItemId);

  if (!options.omitEvidence) {
    await writeJson(repo, evidencePath, authority);
  }

  if (options.omitPolicy) {
    await rm(path.join(repo, authorityPolicyPath), { force: true });
    return;
  }

  await writeJson(
    repo,
    authorityPolicyPath,
    options.policy ?? completeCoordinationAuthorityPolicy(workItemId, evidencePath)
  );
}

async function writeCoordinationAuthorityTemplate(repo) {
  await writeFileAt(
    repo,
    authorityTemplatePath,
    `# Coordination Event Log Authority Template

work_item:
canonical_history:
accepted_workflow_event_families:
actor_event_non_authority:
projection_surfaces:
allowed_mutation_paths:
history_replay:
projection_reconciliation:
claim_authority_exception:
rationale:
evidence_paths:
`
  );
}

function completeCoordinationAuthorityPolicy(workItemId, evidencePath, overrides = {}) {
  return {
    contract_version: 1,
    policy_id: "coordination-event-log-authority",
    canonical_history: "per_work_item_append_only_coordination_log",
    authoritative_event_families: ["step_transition"],
    actor_event_authority: "context_only",
    projection_surfaces: [
      "current_state_view",
      "cockpit_status",
      "state_index",
      "sqlite_cache",
      "in_flight_registry",
      "derived_status_report"
    ],
    allowed_projection_mutation_paths: [
      "rebuild_from_history",
      "cli_append_or_reconcile",
      "fail_closed_mechanical_repair"
    ],
    claim_authority_exception: {
      authority: "cas_claim_authority",
      status: "future_scoped"
    },
    release_authorized_decisions: [
      {
        work_item: workItemId,
        decision_kind: "projection_boundary",
        evidence_path: evidencePath
      }
    ],
    ...overrides
  };
}

function completeCoordinationAuthority(workItemId = "BANDIT-970", overrides = {}) {
  return {
    contract_version: 1,
    work_item: workItemId,
    canonical_history: {
      authority: "per_work_item_append_only_coordination_log",
      workflow_position_source: `docs/work/${workItemId}/coordination-log.jsonl`,
      accepted_coordination_context_source:
        `docs/work/${workItemId}/coordination-log.jsonl`
    },
    accepted_workflow_event_families: ["step_transition"],
    actor_event_non_authority: {
      may_advance_workflow_state: false,
      may_satisfy_gates: false,
      may_emit_safe_triggers: false,
      evidence_path: `docs/work/${workItemId}/coordination-log.jsonl`
    },
    projection_surfaces: [
      {
        name: "coordination_status",
        surface: "derived_status_report",
        authority: "derived_non_canonical",
        source_history_refs: [`docs/work/${workItemId}/coordination-log.jsonl`],
        claim_authority_refs: [],
        mutation_path: "rebuild_from_history",
        grants_release_authorized_claims: false,
        reported_current_state: "red_recorded"
      }
    ],
    allowed_mutation_paths: [
      "append_step_transition_to_coordination_history",
      "rebuild_projection_from_history",
      "cli_reconcile_projection_drift",
      "fail_closed_with_mechanical_repair_evidence"
    ],
    history_replay: {
      source_history: `docs/work/${workItemId}/coordination-log.jsonl`,
      derived_current_state: "red_recorded",
      derived_next_action: "Implement coordination authority contract"
    },
    projection_reconciliation: {
      disagreement_behavior: "fail_closed",
      derivable_projection_drift_owner: "Codex PM or CLI mechanical repair",
      operator_escalation: "only_operator_owned_gate"
    },
    claim_authority_exception: {
      status: "future_scoped",
      authority: "cas_claim_authority",
      reference_paths: [
        "docs/decisions/2026-05-27-git-refs-claim-authority-backend.md"
      ],
      projections_may_grant_claims: false,
      rationale:
        "Active writable claims are future-scoped to CAS claim authority; projections cannot grant claims."
    },
    rationale:
      "Projection state is trusted only when it is rebuildable from append-only coordination history or future CAS claim authority.",
    evidence_paths: [
      authorityPolicyPath,
      authorityTemplatePath,
      `docs/work/${workItemId}/red-evidence.md`,
      `docs/work/${workItemId}/coordination-log.jsonl`
    ],
    ...overrides
  };
}

function coordinationAuthorityEvidencePath(workItemId) {
  return `docs/coordination-authority/${workItemId}-coordination-authority.json`;
}

async function writeCoordinationLog(repo, workItemId) {
  await writeJsonLines(repo, `docs/work/${workItemId}/coordination-log.jsonl`, [
    stepTransition(workItemId, {
      state: "brief_created",
      evidence: [`docs/work/${workItemId}/brief.md`],
      next_action: "Write RED evidence",
      accountable_actor: "Test Writer"
    }),
    stepTransition(workItemId, {
      sequence: 2,
      state: "red_recorded",
      evidence: [`docs/work/${workItemId}/red-evidence.md`],
      next_action: "Implement coordination authority contract",
      accountable_actor: "Writer",
      safe_triggers: ["implementation_allowed"]
    }),
    actorEvent(workItemId, {
      sequence: 3,
      actor_event_type: "complete",
      summary: "Actor reports projection rebuilt from history.",
      evidence: [`docs/work/${workItemId}/brief.md`]
    })
  ]);
}

function stepTransition(workItemId, overrides = {}) {
  return {
    version: 1,
    event_type: "step_transition",
    work_item: workItemId,
    sequence: 1,
    timestamp: "2026-05-28T00:00:00.000Z",
    actor: "codex_pm",
    source: "test fixture",
    evidence: [],
    state: "brief_created",
    next_action: "Write RED evidence",
    accountable_actor: "Test Writer",
    safe_triggers: [],
    accepted_block: null,
    ...overrides
  };
}

function actorEvent(workItemId, overrides = {}) {
  return {
    version: 1,
    event_type: "actor_event",
    work_item: workItemId,
    sequence: 2,
    timestamp: "2026-05-28T00:00:00.000Z",
    actor: "codex_pm",
    source: "test fixture",
    evidence: [],
    actor_event_type: "claim",
    summary: "Actor context only.",
    ...overrides
  };
}

async function writeJson(repo, relativePath, value) {
  await writeFileAt(repo, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeJsonLines(repo, relativePath, values) {
  await writeFileAt(
    repo,
    relativePath,
    values.map((value) => JSON.stringify(value)).join("\n") + "\n"
  );
}

async function writeFileAt(repo, relativePath, content) {
  const destination = path.join(repo, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, content, "utf8");
}
