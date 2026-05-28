type RawRecord = Record<string, unknown>;

export type ProjectionSummary = {
  path: string;
  authority: string;
};

export function validateProjectionArtifacts(
  workItem: string,
  projections: unknown
): ProjectionSummary[] {
  if (
    !Array.isArray(projections) ||
    projections.some((projection) => !isRecord(projection))
  ) {
    throw new Error(
      `Malformed claim authority evidence for ${workItem}: missing projection_artifacts`
    );
  }

  return (projections as RawRecord[]).map((projection) => {
    const displayPath = readRequiredString(
      projection,
      "path",
      `claim authority evidence for ${workItem} projection_artifacts`
    );
    const authority = readRequiredString(
      projection,
      "authority",
      `claim authority evidence for ${workItem} projection_artifacts`
    );
    const rebuiltFrom = readRequiredStringList(
      projection,
      "rebuilt_from",
      `claim authority evidence for ${workItem} projection_artifacts`
    );
    const manualEditsMayGrantClaims = readRequiredBoolean(
      projection,
      "manual_edits_may_grant_claims",
      `claim authority evidence for ${workItem} projection_artifacts`
    );

    if (manualEditsMayGrantClaims) {
      throw new Error(
        ".bandit claim projections cannot grant, renew, release, complete, block, fail, or recover writable claims"
      );
    }

    if (authority !== "projection") {
      throw new Error(
        `claim projection ${displayPath} must remain a projection artifact`
      );
    }

    if (
      !rebuiltFrom.some((source) => source.startsWith("refs/bandit/")) &&
      !rebuiltFrom.includes("refs/bandit/*")
    ) {
      throw new Error(
        `claim projection ${displayPath} must be rebuilt from refs/bandit/* claim authority`
      );
    }

    return {
      path: displayPath,
      authority
    };
  });
}

function readRequiredString(
  record: RawRecord,
  field: string,
  context: string
) {
  const value = record[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Malformed ${context}: missing ${field}`);
  }

  return value;
}

function readRequiredStringList(
  record: RawRecord,
  field: string,
  context: string
) {
  const value = record[field];
  if (
    !Array.isArray(value) ||
    value.some((entry) => typeof entry !== "string" || entry.trim().length === 0)
  ) {
    throw new Error(`Malformed ${context}: missing ${field}`);
  }

  return value as string[];
}

function readRequiredBoolean(
  record: RawRecord,
  field: string,
  context: string
) {
  const value = record[field];
  if (typeof value !== "boolean") {
    throw new Error(`Malformed ${context}: missing ${field}`);
  }

  return value;
}

function isRecord(value: unknown): value is RawRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
