import assert from "node:assert/strict";
import test from "node:test";
import { evidenceDrilldownStatusFixture } from "./helpers/cockpit-status-fixture.mjs";

async function loadEvidenceDetailModule() {
  return import("../src/state/cockpit-evidence-detail.ts");
}

test("cockpit evidence detail builds a Stage 0 through Stage 6 gate matrix with freshness and repair routes", async () => {
  const { buildCockpitEvidenceDetail } = await loadEvidenceDetailModule();

  const detail = buildCockpitEvidenceDetail(evidenceDrilldownStatusFixture());

  assert.equal(detail.kind, "cockpit_evidence_detail");
  assert.equal(detail.authority, "presentation_derived_non_canonical");
  assert.deepEqual(
    detail.gate_matrix.map((row) => row.id),
    [
      "stage_0_context_readiness",
      "stage_1_brief",
      "stage_2_red_evidence",
      "stage_3_implementation",
      "stage_4_review",
      "stage_5_landing",
      "stage_6_retrospective"
    ]
  );
  assert.deepEqual(detail.gate_matrix.find((row) => row.id === "stage_2_red_evidence"), {
    id: "stage_2_red_evidence",
    label: "Stage 2 RED evidence",
    status: "missing",
    owner_or_authority_role: "test_writer",
    sources: ["docs/work/BANDIT-068/red-evidence.md"],
    freshness_state: "missing",
    reason: "missing_required_stage_evidence",
    next_repair_route: "Record Test Writer-owned RED evidence before implementation."
  });
  assert.deepEqual(detail.gate_matrix.find((row) => row.id === "stage_4_review"), {
    id: "stage_4_review",
    label: "Stage 4 review",
    status: "missing",
    owner_or_authority_role: "reviewer",
    sources: ["docs/work/BANDIT-068/review-evidence.md"],
    freshness_state: "stale",
    reason: "review_subject_hash_drift",
    next_repair_route: "Refresh review evidence for the current review subject."
  });
});

test("cockpit evidence detail exposes review, landing, UAT, coordination, bootstrap-gap, and trust-signal rows", async () => {
  const { buildCockpitEvidenceDetail } = await loadEvidenceDetailModule();

  const detail = buildCockpitEvidenceDetail(evidenceDrilldownStatusFixture());

  assert.deepEqual(
    detail.detail_rows.map((row) => row.id),
    [
      "review_evidence",
      "landing_readiness",
      "uat",
      "coordination",
      "bootstrap_gaps",
      "stale_evidence",
      "evidence_trust_signals"
    ]
  );
  assert.deepEqual(detail.detail_rows.find((row) => row.id === "landing_readiness"), {
    id: "landing_readiness",
    label: "Landing readiness",
    status: "not_ready",
    sources: ["docs/work/BANDIT-068/implementation-evidence.md"],
    reason: "implementation evidence is not recorded"
  });
  assert.deepEqual(detail.detail_rows.find((row) => row.id === "uat"), {
    id: "uat",
    label: "UAT",
    status: "not_applicable",
    sources: ["docs/work/BANDIT-068/brief.md"],
    reason: "Feature UAT is required before landing once implementation exists."
  });
  assert.deepEqual(detail.detail_rows.find((row) => row.id === "bootstrap_gaps"), {
    id: "bootstrap_gaps",
    label: "Bootstrap gaps",
    status: "open",
    sources: [
      ".bandit/bootstrap-gaps.json",
      "docs/work/BANDIT-068/coderabbit-formation-review.md"
    ],
    reason: "BANDIT-GAP-LIVE-CODERABBIT: Record provider-timeout replacement evidence when CodeRabbit is unavailable."
  });
  assert.equal(
    detail.detail_rows.find((row) => row.id === "evidence_trust_signals").reason,
    "Artifact-specific Evidence Trust Signals are available for 6 stage gates."
  );
});

test("cockpit evidence detail preserves fail-closed and non-authority boundaries", async () => {
  const { buildCockpitEvidenceDetail } = await loadEvidenceDetailModule();

  const detail = buildCockpitEvidenceDetail(evidenceDrilldownStatusFixture());

  assert.equal(detail.writes_repo_artifacts, false);
  assert.equal(detail.approves_uat, false);
  assert.equal(detail.decides_landing_safety, false);
  assert.deepEqual(detail.mutation_forms, []);
  assert.equal(
    detail.gate_matrix.some((row) => row.status === "missing" && row.reason),
    true
  );
  assert.equal(
    detail.detail_rows.some((row) => row.status === "stale" && row.sources.includes("docs/work/BANDIT-068/review-evidence.md")),
    true
  );
});
