import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { readWorkItem, readWorkItems } from "./work-items.js";

export type RoutingDecision = {
  workItem: string;
  decisionKind: string;
  selectedRoute: string;
  applicableSmellIds: string[];
  evidenceUsed: string[];
  operatorInputStatus: string;
  bootstrapGaps: string[];
  escalationOutcome: string;
  finalDecision: string;
};

type ParsedFields = Map<string, ParsedField>;

type ParsedField = {
  scalar: string;
  list: string[];
};

const ROUTING_DECISION_FILE = "routing-decision.md";

const RESOLVED_OPERATOR_INPUT_STATUSES = new Set([
  "none_required",
  "provided",
  "not_applicable"
]);

export async function validateRoutingDecisions(
  repoRoot: string,
  knownSmellIds: Set<string>
) {
  const workItems = await readWorkItems(repoRoot);

  for (const workItem of workItems) {
    const artifact = await readOptionalRoutingDecision(repoRoot, workItem.id);

    if (artifact) {
      parseRoutingDecision(
        artifact.content,
        artifact.displayPath,
        knownSmellIds,
        workItem.id
      );
    }
  }
}

export async function readRoutingDecision(
  repoRoot: string,
  workItemId: string,
  knownSmellIds: Set<string>
) {
  await readWorkItem(repoRoot, workItemId);

  const displayPath = routingDecisionDisplayPath(workItemId);
  const content = await readRequiredRoutingDecision(
    repoRoot,
    workItemId,
    displayPath
  );

  return parseRoutingDecision(
    content,
    displayPath,
    knownSmellIds,
    workItemId
  );
}

function parseRoutingDecision(
  content: string,
  displayPath: string,
  knownSmellIds: Set<string>,
  expectedWorkItemId: string
): RoutingDecision {
  const fields = parseFields(content);
  const workItem = requireScalar(fields, "work_item", displayPath);

  if (workItem !== expectedWorkItemId) {
    throw new Error(
      `Malformed routing decision: ${displayPath}; work_item does not match ${expectedWorkItemId}`
    );
  }

  const applicableSmellIds = requireList(
    fields,
    "applicable_smell_ids",
    displayPath
  );

  for (const smellId of applicableSmellIds) {
    if (!knownSmellIds.has(smellId)) {
      throw new Error(
        `Unknown smell trigger ID in routing decision: ${smellId}`
      );
    }
  }

  const operatorInputStatus = requireScalar(
    fields,
    "operator_input_status",
    displayPath
  );
  if (!RESOLVED_OPERATOR_INPUT_STATUSES.has(operatorInputStatus)) {
    throw new Error(
      `Routing decision has unresolved operator-owned input: ${workItem}`
    );
  }

  return {
    workItem,
    decisionKind: requireScalar(fields, "decision_kind", displayPath),
    selectedRoute: requireScalar(fields, "selected_route", displayPath),
    applicableSmellIds,
    evidenceUsed: requireList(fields, "evidence_used", displayPath),
    operatorInputStatus,
    bootstrapGaps: requireList(fields, "bootstrap_gaps", displayPath),
    escalationOutcome: requireScalar(fields, "escalation_outcome", displayPath),
    finalDecision: requireScalar(fields, "final_decision", displayPath)
  };
}

async function readOptionalRoutingDecision(
  repoRoot: string,
  workItemId: string
) {
  const workDir = path.join(repoRoot, "docs/work", workItemId);

  try {
    const entries = await readdir(workDir);
    if (!entries.includes(ROUTING_DECISION_FILE)) {
      return null;
    }

    return {
      content: await readFile(path.join(workDir, ROUTING_DECISION_FILE), "utf8"),
      displayPath: routingDecisionDisplayPath(workItemId)
    };
  } catch (error) {
    if (isMissingPathError(error)) {
      return null;
    }
    throw error;
  }
}

async function readRequiredRoutingDecision(
  repoRoot: string,
  workItemId: string,
  displayPath: string
) {
  try {
    return await readFile(
      path.join(repoRoot, "docs/work", workItemId, ROUTING_DECISION_FILE),
      "utf8"
    );
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing routing decision artifact: ${displayPath}`);
    }
    throw error;
  }
}

function parseFields(content: string): ParsedFields {
  const fields: ParsedFields = new Map();
  let currentListField: string | null = null;

  for (const line of content.split(/\r?\n/)) {
    const scalarMatch = line.match(/^([a-z_]+):\s*(.*)$/);
    if (scalarMatch) {
      const field = scalarMatch[1];
      const scalar = scalarMatch[2]?.trim() ?? "";

      if (!field) {
        continue;
      }

      fields.set(field, { scalar, list: [] });
      currentListField = scalar.length === 0 ? field : null;
      continue;
    }

    const listMatch = line.match(/^\s*-\s+(.+)$/);
    if (listMatch && currentListField) {
      fields.get(currentListField)?.list.push(listMatch[1]?.trim() ?? "");
    }
  }

  return fields;
}

function requireScalar(
  fields: ParsedFields,
  field: string,
  displayPath: string
) {
  const value = fields.get(field)?.scalar.trim();

  if (!value) {
    throw new Error(
      `Malformed routing decision: ${displayPath}; missing required field: ${field}`
    );
  }

  return value;
}

function requireList(fields: ParsedFields, field: string, displayPath: string) {
  const value = fields
    .get(field)
    ?.list.map((item) => item.trim())
    .filter((item) => item.length > 0);

  if (!value || value.length === 0) {
    throw new Error(
      `Malformed routing decision: ${displayPath}; missing required field: ${field}`
    );
  }

  return value;
}

function routingDecisionDisplayPath(workItemId: string) {
  return `docs/work/${workItemId}/routing-decision.md`;
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
