type RawRecord = Record<string, unknown>;

export type WorkSurfaceGraphSummary = {
  active_claims: number;
  candidate_claims: number;
  wait_for_edges: number;
  cycle_paths: string[][];
};

type WorkSurfaceClaim = {
  claimId: string;
  declaredWorkSurfaces: string[];
};

type WorkSurfaceEdge = {
  fromClaim: string;
  toClaim: string;
  surfaces: string[];
};

export function validateWorkSurfaceWaitForGraph(
  workItem: string,
  graph: unknown
): WorkSurfaceGraphSummary {
  const record = readRequiredRecord(
    { graph },
    "graph",
    `claim authority evidence for ${workItem}`
  );
  const strategy = readRequiredString(
    record,
    "strategy",
    `claim authority evidence for ${workItem} work_surface_wait_for_graph`
  );

  if (strategy !== "work_surface_wait_for_graph") {
    throw new Error(
      "claimability must build a Work-Surface Wait-For Graph; pairwise-only overlap checks are insufficient"
    );
  }

  const activeClaims = readClaims(record, "active_claims", workItem);
  const candidateClaims = readClaims(record, "candidate_claims", workItem);
  const edges = readEdges(record, workItem);
  const cyclePaths = readCyclePaths(record, workItem);

  if (cyclePaths.length > 0) {
    throw new Error(
      `Work-Surface Wait-For Graph cycle: ${cyclePaths[0]?.join(" -> ")}`
    );
  }

  for (const activeClaim of activeClaims) {
    for (const candidateClaim of candidateClaims) {
      const conflict = firstSharedSurface(activeClaim, candidateClaim);
      if (!conflict) {
        continue;
      }

      if (!hasWaitForEdge(edges, activeClaim, candidateClaim, conflict)) {
        throw new Error(
          `declared work surface conflict ${conflict} is missing a wait-for edge`
        );
      }
    }
  }

  return {
    active_claims: activeClaims.length,
    candidate_claims: candidateClaims.length,
    wait_for_edges: edges.length,
    cycle_paths: cyclePaths
  };
}

function readClaims(
  graph: RawRecord,
  field: string,
  workItem: string
): WorkSurfaceClaim[] {
  return readRequiredRecordList(
    graph,
    field,
    `claim authority evidence for ${workItem} work_surface_wait_for_graph`
  ).map((claim) => ({
    claimId: readRequiredString(
      claim,
      "claim_id",
      `claim authority evidence for ${workItem} ${field}`
    ),
    declaredWorkSurfaces: readRequiredStringList(
      claim,
      "declared_work_surfaces",
      `claim authority evidence for ${workItem} ${field}`
    )
  }));
}

function readEdges(graph: RawRecord, workItem: string): WorkSurfaceEdge[] {
  return readRequiredRecordList(
    graph,
    "wait_for_edges",
    `claim authority evidence for ${workItem} work_surface_wait_for_graph`
  ).map((edge) => ({
    fromClaim: readRequiredString(
      edge,
      "from_claim",
      `claim authority evidence for ${workItem} wait_for_edges`
    ),
    toClaim: readRequiredString(
      edge,
      "to_claim",
      `claim authority evidence for ${workItem} wait_for_edges`
    ),
    surfaces: readRequiredStringList(
      edge,
      "surfaces",
      `claim authority evidence for ${workItem} wait_for_edges`
    )
  }));
}

function readCyclePaths(graph: RawRecord, workItem: string) {
  const rawPaths = graph.cycle_paths;
  if (rawPaths === undefined) {
    return [];
  }

  if (!Array.isArray(rawPaths)) {
    throw new Error(
      `Malformed claim authority evidence for ${workItem}: cycle_paths must be a list`
    );
  }

  return rawPaths.map((pathValue) => {
    if (!Array.isArray(pathValue)) {
      throw new Error(
        `Malformed claim authority evidence for ${workItem}: cycle_paths entries must be lists`
      );
    }

    return pathValue.map((claimId) => {
      if (typeof claimId !== "string" || claimId.trim().length === 0) {
        throw new Error(
          `Malformed claim authority evidence for ${workItem}: cycle_paths entries must be non-empty strings`
        );
      }

      return claimId;
    });
  });
}

function firstSharedSurface(
  activeClaim: WorkSurfaceClaim,
  candidateClaim: WorkSurfaceClaim
) {
  const activeSurfaces = new Set(activeClaim.declaredWorkSurfaces);
  return candidateClaim.declaredWorkSurfaces.find((surface) =>
    activeSurfaces.has(surface)
  );
}

function hasWaitForEdge(
  edges: WorkSurfaceEdge[],
  activeClaim: WorkSurfaceClaim,
  candidateClaim: WorkSurfaceClaim,
  surface: string
) {
  return edges.some((edge) => {
    const connectsClaims =
      (edge.fromClaim === candidateClaim.claimId &&
        edge.toClaim === activeClaim.claimId) ||
      (edge.fromClaim === activeClaim.claimId &&
        edge.toClaim === candidateClaim.claimId);

    return connectsClaims && edge.surfaces.includes(surface);
  });
}

function readRequiredRecord(
  record: RawRecord,
  field: string,
  context: string
): RawRecord {
  const value = record[field];
  if (!isRecord(value)) {
    throw new Error(`Malformed ${context}: missing ${field}`);
  }

  return value;
}

function readRequiredRecordList(
  record: RawRecord,
  field: string,
  context: string
): RawRecord[] {
  const value = record[field];
  if (!Array.isArray(value) || value.some((entry) => !isRecord(entry))) {
    throw new Error(`Malformed ${context}: missing ${field}`);
  }

  return value as RawRecord[];
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

function isRecord(value: unknown): value is RawRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
