import { readFile } from "node:fs/promises";
import path from "node:path";

const POLICY_DISPLAY_PATH =
  ".bandit/policy/metamorphic-cross-projection-checks.json" as const;

export type MetamorphicCrossProjectionReport = {
  status: "pass";
  policy: typeof POLICY_DISPLAY_PATH;
  covered_projection_count: number;
  harmless_perturbation_count: number;
  trust_relevant_fields: string[];
};

type RawRecord = Record<string, unknown>;
type Claims = Record<string, unknown>;

type ParsedProjection = {
  id: string;
  claims: Claims;
};

type ParsedPerturbation = {
  id: string;
  sourceProjectionId: string;
  perturbationType: string;
  claims: Claims;
};

type ParsedAcceptableDifference = {
  field: string;
  difference: string;
};

type ParsedPolicy = {
  trustRelevantFields: string[];
  acceptableDifferences: ParsedAcceptableDifference[];
  coveredProjections: ParsedProjection[];
  harmlessPerturbations: ParsedPerturbation[];
};

export async function validateProjectionConsistency(
  repoRoot: string
): Promise<MetamorphicCrossProjectionReport> {
  const policyPath = path.join(repoRoot, POLICY_DISPLAY_PATH);
  let content: string;
  try {
    content = await readFile(policyPath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      return emptyReport();
    }
    throw error;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(
      "Malformed metamorphic cross-projection policy: invalid JSON"
    );
  }

  const policy = parsePolicy(parsed);
  const problems: string[] = [];

  checkProjectionAgreement(policy, problems);
  checkHarmlessPerturbations(policy, problems);

  if (problems.length > 0) {
    throw new Error(
      `Metamorphic cross-projection checks: projection disagreement detected\n${problems.join("\n")}`
    );
  }

  return {
    status: "pass",
    policy: POLICY_DISPLAY_PATH,
    covered_projection_count: policy.coveredProjections.length,
    harmless_perturbation_count: policy.harmlessPerturbations.length,
    trust_relevant_fields: policy.trustRelevantFields
  };
}

function checkProjectionAgreement(
  policy: ParsedPolicy,
  problems: string[]
): void {
  const { coveredProjections, trustRelevantFields, acceptableDifferences } =
    policy;
  if (coveredProjections.length < 2) return;

  const [reference, ...others] = coveredProjections;
  if (!reference) return;
  for (const other of others) {
    for (const field of trustRelevantFields) {
      const refNorm = normalizeField(
        reference.claims[field],
        field,
        acceptableDifferences,
        "none"
      );
      const otherNorm = normalizeField(
        other.claims[field],
        field,
        acceptableDifferences,
        "none"
      );
      if (!deepEqual(refNorm, otherNorm)) {
        problems.push(
          `projection disagreement: ${other.id}.${field} disagrees with ${reference.id}\n` +
            `  ${reference.id}: ${JSON.stringify(reference.claims[field])}\n` +
            `  ${other.id}: ${JSON.stringify(other.claims[field])}`
        );
      }
    }
  }
}

function checkHarmlessPerturbations(
  policy: ParsedPolicy,
  problems: string[]
): void {
  const {
    harmlessPerturbations,
    coveredProjections,
    trustRelevantFields,
    acceptableDifferences
  } = policy;

  for (const perturbation of harmlessPerturbations) {
    const source = coveredProjections.find(
      (p) => p.id === perturbation.sourceProjectionId
    );
    if (!source) {
      problems.push(
        `harmless perturbation ${perturbation.id}: source projection ${perturbation.sourceProjectionId} not found`
      );
      continue;
    }

    for (const field of trustRelevantFields) {
      if (!(field in perturbation.claims)) continue;
      const sourceNorm = normalizeField(
        source.claims[field],
        field,
        acceptableDifferences,
        perturbation.perturbationType
      );
      const perturbedNorm = normalizeField(
        perturbation.claims[field],
        field,
        acceptableDifferences,
        perturbation.perturbationType
      );
      if (!deepEqual(sourceNorm, perturbedNorm)) {
        problems.push(
          `harmless perturbation ${perturbation.id}: ${field} changed after normalization (not harmless)\n` +
            `  source: ${JSON.stringify(source.claims[field])}\n` +
            `  perturbed: ${JSON.stringify(perturbation.claims[field])}`
        );
      }
    }
  }
}

function normalizeField(
  value: unknown,
  field: string,
  acceptableDifferences: ParsedAcceptableDifference[],
  perturbationType: string
): unknown {
  const fieldDifferences = acceptableDifferences
    .filter((d) => d.field === field)
    .map((d) => d.difference);
  return normalizeValue(value, perturbationType, fieldDifferences);
}

function normalizeValue(
  value: unknown,
  perturbationType: string,
  differences: string[]
): unknown {
  if (typeof value === "string") {
    if (differences.includes("whitespace") || perturbationType === "whitespace") {
      return value.trim().replace(/\s+/g, " ");
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item, perturbationType, differences));
  }
  if (isRecord(value)) {
    const keys = differences.includes("json_object_key_order")
      ? Object.keys(value).sort()
      : Object.keys(value);
    const normalized: RawRecord = {};
    for (const key of keys) {
      normalized[key] = normalizeValue(value[key], perturbationType, differences);
    }
    return normalized;
  }
  return value;
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function emptyReport(): MetamorphicCrossProjectionReport {
  return {
    status: "pass",
    policy: POLICY_DISPLAY_PATH,
    covered_projection_count: 0,
    harmless_perturbation_count: 0,
    trust_relevant_fields: []
  };
}

function parsePolicy(value: unknown): ParsedPolicy {
  if (!isRecord(value)) {
    throw new Error(
      "Malformed metamorphic cross-projection policy: expected object"
    );
  }
  return {
    trustRelevantFields: asStringArray(value.trust_relevant_fields),
    acceptableDifferences: parseAcceptableDifferences(
      value.acceptable_differences
    ),
    coveredProjections: parseCoveredProjections(value.covered_projections),
    harmlessPerturbations: parsePerturbations(value.harmless_perturbations)
  };
}

function parseAcceptableDifferences(
  value: unknown
): ParsedAcceptableDifference[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord).map((raw) => ({
    field: asString(raw.field),
    difference: asString(raw.difference)
  }));
}

function parseCoveredProjections(value: unknown): ParsedProjection[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord).map((raw) => ({
    id: asString(raw.id),
    claims: isRecord(raw.claims) ? (raw.claims as Claims) : {}
  }));
}

function parsePerturbations(value: unknown): ParsedPerturbation[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord).map((raw) => ({
    id: asString(raw.id),
    sourceProjectionId: asString(raw.source_projection),
    perturbationType: asString(raw.perturbation_type),
    claims: isRecord(raw.claims) ? (raw.claims as Claims) : {}
  }));
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isMissingPathError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === "ENOENT"
  );
}
