import { readFile } from "node:fs/promises";
import path from "node:path";

export type EscalatedReviewerProfile = {
  profileId: string;
  provider: string;
  model: string;
  role: "escalated_adversarial_reviewer";
  runtime: string;
  fixturePath?: string;
  requireExplicitSetup: boolean;
  credentialEnvVar?: string;
};

const ESCALATED_REVIEWERS_PATH = ".bandit/reviewers/escalated-reviewers.json";

export async function readEscalatedReviewerProfile(
  repoRoot: string,
  profileId: string
) {
  const content = await readRequiredProfiles(repoRoot);
  const parsed = parseProfilesJson(content);
  const profile = parsed.profiles.find((candidate) => candidate.profileId === profileId);

  if (!profile) {
    throw new Error(`Missing escalated reviewer profile: ${profileId}`);
  }

  return profile;
}

function parseProfilesJson(content: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Malformed escalated reviewer profiles: invalid JSON");
  }

  if (!isRecord(parsed) || parsed.version !== 1) {
    throw new Error("Malformed escalated reviewer profiles: missing version 1");
  }

  if (!Array.isArray(parsed.profiles) || parsed.profiles.length === 0) {
    throw new Error("Malformed escalated reviewer profiles: missing profiles");
  }

  return {
    profiles: parsed.profiles.map(parseProfile)
  };
}

function parseProfile(rawProfile: unknown): EscalatedReviewerProfile {
  if (!isRecord(rawProfile)) {
    throw new Error("Malformed escalated reviewer profile: expected object");
  }

  const profileId = requireString(rawProfile.profile_id, "profile_id");
  const provider = requireString(rawProfile.provider, "provider");
  const model = requireString(rawProfile.model, "model");
  const role = requireString(rawProfile.role, "role");
  const runtime = requireString(rawProfile.runtime, "runtime");

  if (role !== "escalated_adversarial_reviewer") {
    throw new Error("Escalated reviewer profile role must be escalated_adversarial_reviewer");
  }

  return {
    profileId,
    provider,
    model,
    role,
    runtime,
    fixturePath: optionalString(rawProfile.fixture_path),
    requireExplicitSetup: rawProfile.require_explicit_setup === true,
    credentialEnvVar: optionalString(rawProfile.credential_env_var)
  };
}

async function readRequiredProfiles(repoRoot: string) {
  try {
    return await readFile(path.join(repoRoot, ESCALATED_REVIEWERS_PATH), "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing escalated reviewer profiles: ${ESCALATED_REVIEWERS_PATH}`);
    }
    throw error;
  }
}

function requireString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Escalated reviewer profile field ${field} must be a non-empty string`);
  }

  return value;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
