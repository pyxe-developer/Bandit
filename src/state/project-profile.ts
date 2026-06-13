import { readFile } from "node:fs/promises";

export type StarterWorkItemSpec = {
  number: number;
  title: string;
  currentStage: string;
  nextAction: string;
};

export type RoadmapEntry = {
  kind: string;
  id: string;
  title: string;
};

export type RoadmapSeed = {
  currentPhase: string;
  plannedWork: RoadmapEntry[];
};

export type ReviewerDeclaration = {
  id: string;
  provider: string;
  required: boolean;
};

export type ProjectProfile = {
  contractVersion: 1;
  name: string;
  workItemPrefix: string;
  starterWorkItem: StarterWorkItemSpec;
  roadmapSeed: RoadmapSeed;
  reviewers: ReviewerDeclaration[];
  policyTiers: string[];
  harnesses: string[];
};

export type ProjectProfileWithRawReviewers = {
  profile: ProjectProfile;
  rawReviewerEntries: unknown[];
};

const VALID_PREFIX_PATTERN = /^[A-Z][A-Z0-9]*$/;

export async function readProjectProfile(filePath: string): Promise<ProjectProfile> {
  return parseProjectProfile(await readProfileJson(filePath));
}

export async function readProjectProfileWithRawReviewers(
  filePath: string
): Promise<ProjectProfileWithRawReviewers> {
  const raw = await readProfileJson(filePath);
  return {
    profile: parseProjectProfile(raw),
    rawReviewerEntries: readRawReviewerEntries(raw),
  };
}

async function readProfileJson(filePath: string): Promise<unknown> {
  let raw: unknown;
  try {
    const text = await readFile(filePath, "utf8");
    raw = JSON.parse(text);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Profile is not valid JSON: ${filePath}`);
    }
    throw error;
  }
  return raw;
}

export function parseProjectProfile(raw: unknown): ProjectProfile {
  if (!isRecord(raw)) {
    throw new Error("Profile must be a JSON object");
  }

  if (raw.contract_version !== 1) {
    throw new Error("Invalid profile field: contract_version (must be 1)");
  }

  requireNonEmptyString(raw, "name");
  requireValidPrefix(raw);
  requireStarterWorkItem(raw);
  requireRoadmapSeed(raw);
  requireReviewers(raw);
  requireStringArray(raw, "policy_tiers");
  requireStringArray(raw, "harnesses");

  const starterRaw = raw.starter_work_item as Record<string, unknown>;
  const seedRaw = raw.roadmap_seed as Record<string, unknown>;
  const reviewersRaw = raw.reviewers as unknown[];

  return {
    contractVersion: 1,
    name: raw.name as string,
    workItemPrefix: raw.work_item_prefix as string,
    starterWorkItem: {
      number:
        "number" in starterRaw && starterRaw.number !== undefined
          ? (starterRaw.number as number)
          : 1,
      title: starterRaw.title as string,
      currentStage:
        "current_stage" in starterRaw && starterRaw.current_stage !== undefined
          ? (starterRaw.current_stage as string)
          : "Stage 1: starter_ready",
      nextAction:
        "next_action" in starterRaw && starterRaw.next_action !== undefined
          ? (starterRaw.next_action as string)
          : "Complete Stage 1 brief formation.",
    },
    roadmapSeed: {
      currentPhase: seedRaw.current_phase as string,
      plannedWork: parsePlannedWork(seedRaw.planned_work),
    },
    reviewers: reviewersRaw.map(parseReviewer),
    policyTiers: raw.policy_tiers as string[],
    harnesses: raw.harnesses as string[],
  };
}

function requireNonEmptyString(obj: Record<string, unknown>, field: string) {
  const value = obj[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid profile field: ${field}`);
  }
}

function requireValidPrefix(obj: Record<string, unknown>) {
  const value = obj.work_item_prefix;
  if (typeof value !== "string" || !VALID_PREFIX_PATTERN.test(value)) {
    throw new Error(
      "Invalid profile field: work_item_prefix (must be uppercase letters and digits, starting with a letter)"
    );
  }
}

function requireStarterWorkItem(obj: Record<string, unknown>) {
  const value = obj.starter_work_item;
  if (!isRecord(value)) {
    throw new Error("Invalid profile field: starter_work_item");
  }
  if (typeof value.title !== "string" || value.title.trim().length === 0) {
    throw new Error("Invalid profile field: starter_work_item.title");
  }
  if (
    "number" in value &&
    value.number !== undefined &&
    !(typeof value.number === "number" && Number.isInteger(value.number) && value.number > 0)
  ) {
    throw new Error(
      "Invalid profile field: starter_work_item.number (must be a positive integer)"
    );
  }
  if (
    "current_stage" in value &&
    value.current_stage !== undefined &&
    (typeof value.current_stage !== "string" ||
      value.current_stage.trim().length === 0)
  ) {
    throw new Error(
      "Invalid profile field: starter_work_item.current_stage (must be a non-empty string)"
    );
  }
  if (
    "next_action" in value &&
    value.next_action !== undefined &&
    (typeof value.next_action !== "string" ||
      value.next_action.trim().length === 0)
  ) {
    throw new Error(
      "Invalid profile field: starter_work_item.next_action (must be a non-empty string)"
    );
  }
}

function requireRoadmapSeed(obj: Record<string, unknown>) {
  const value = obj.roadmap_seed;
  if (!isRecord(value)) {
    throw new Error("Invalid profile field: roadmap_seed");
  }
  if (
    typeof value.current_phase !== "string" ||
    value.current_phase.trim().length === 0
  ) {
    throw new Error("Invalid profile field: roadmap_seed.current_phase");
  }
  if ("planned_work" in value && value.planned_work !== undefined) {
    if (!Array.isArray(value.planned_work)) {
      throw new Error(
        "Invalid profile field: roadmap_seed.planned_work (must be an array of objects with non-empty kind, id, and title)"
      );
    }
    for (const [index, entry] of value.planned_work.entries()) {
      if (!isRecord(entry)) {
        throw new Error(
          `Invalid profile field: roadmap_seed.planned_work[${index}] (must be an object with non-empty kind, id, and title)`
        );
      }
      for (const required of ["kind", "id", "title"] as const) {
        const v = entry[required];
        if (typeof v !== "string" || v.trim().length === 0) {
          throw new Error(
            `Invalid profile field: roadmap_seed.planned_work[${index}].${required} (must be a non-empty string)`
          );
        }
      }
    }
  }
}

function requireReviewers(obj: Record<string, unknown>) {
  if (!Array.isArray(obj.reviewers)) {
    throw new Error("Invalid profile field: reviewers (must be an array)");
  }
  for (const [index, entry] of obj.reviewers.entries()) {
    if (!isRecord(entry)) {
      throw new Error(
        `Invalid profile field: reviewers[${index}] (must be an object with non-empty id and provider plus boolean required)`
      );
    }
    for (const required of ["id", "provider"] as const) {
      const v = entry[required];
      if (typeof v !== "string" || v.trim().length === 0) {
        throw new Error(
          `Invalid profile field: reviewers[${index}].${required} (must be a non-empty string)`
        );
      }
    }
    if (typeof entry.required !== "boolean") {
      throw new Error(
        `Invalid profile field: reviewers[${index}].required (must be a boolean)`
      );
    }
  }
}

function requireStringArray(obj: Record<string, unknown>, field: string) {
  const value = obj[field];
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    throw new Error(`Invalid profile field: ${field}`);
  }
}

function parsePlannedWork(value: unknown): RoadmapEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isRecord).map((entry) => ({
    kind: String(entry.kind ?? "slice"),
    id: String(entry.id ?? ""),
    title: String(entry.title ?? ""),
  }));
}

function parseReviewer(value: unknown): ReviewerDeclaration {
  if (!isRecord(value)) {
    return { id: "", provider: "", required: false };
  }
  return {
    id: String(value.id ?? ""),
    provider: String(value.provider ?? ""),
    required: Boolean(value.required),
  };
}

export function readRawReviewerEntries(raw: unknown): unknown[] {
  if (!isRecord(raw) || !("reviewers" in raw)) {
    return [];
  }
  if (!Array.isArray(raw.reviewers)) {
    throw new Error("Invalid profile field: reviewers (must be an array)");
  }

  return raw.reviewers;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
