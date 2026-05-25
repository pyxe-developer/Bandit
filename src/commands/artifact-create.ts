import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { appendLifecycleEvent } from "../state/events.js";
import { getBanditPaths } from "../state/paths.js";
import {
  OUTPUT_FILES,
  renderArtifact,
  SUPPORTED_KINDS,
  type ArtifactKind
} from "./artifact-create-renderers.js";

type ArtifactSpec = {
  kind: ArtifactKind;
  workItem: string;
  content: string;
  outputFile: string;
};

export async function createArtifact(repoRoot: string, args: string[]) {
  if (args[0] !== "create" || !args[1] || args.length !== 2) {
    throw new Error("Usage: bandit artifact create <spec-path>");
  }

  const specLocation = resolveRepoPath(repoRoot, args[1]);
  const rawSpec = await readSpec(specLocation.absolutePath, specLocation.displayPath);
  const spec = validateSpec(rawSpec);
  const workDir = path.join(repoRoot, "docs/work", spec.workItem);
  const artifactPath = path.join(workDir, spec.outputFile);
  const artifactDisplayPath = normalizeDisplayPath(
    path.relative(repoRoot, artifactPath)
  );

  await assertWorkItemExists(workDir, spec.workItem);
  await assertArtifactPathIsFree(artifactPath, artifactDisplayPath);
  await mkdir(workDir, { recursive: true });
  await writeFile(artifactPath, spec.content, { flag: "wx" });
  try {
    await appendLifecycleEvent(getBanditPaths(repoRoot).events, {
      type: "artifact_created",
      work_item: spec.workItem,
      message: `Created ${spec.kind} artifact at ${artifactDisplayPath}`
    });
  } catch (error) {
    await rm(artifactPath, { force: true });
    throw error;
  }

  return {
    output: `Created artifact: ${artifactDisplayPath}\n`
  };
}

function resolveRepoPath(repoRoot: string, inputPath: string) {
  const absolutePath = path.isAbsolute(inputPath)
    ? path.normalize(inputPath)
    : path.resolve(repoRoot, inputPath);
  const relativePath = path.relative(repoRoot, absolutePath);

  if (isOutsideRepo(relativePath)) {
    throw new Error(`Artifact spec path must stay within repository: ${inputPath}`);
  }

  return {
    absolutePath,
    displayPath: normalizeDisplayPath(relativePath)
  };
}

async function readSpec(filePath: string, displayPath: string) {
  let content: string;
  try {
    content = await readFile(filePath, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Artifact spec not found: ${displayPath}`);
    }
    throw error;
  }

  try {
    return JSON.parse(content) as unknown;
  } catch {
    throw new Error(`Malformed artifact spec JSON: ${displayPath}`);
  }
}

function validateSpec(rawSpec: unknown): ArtifactSpec {
  if (!isRecord(rawSpec)) {
    throw new Error("Artifact spec must be an object");
  }

  const kind = requireKind(rawSpec);
  const workItem = requireString(rawSpec, "work_item");

  return {
    kind,
    workItem,
    outputFile: OUTPUT_FILES[kind],
    content: renderArtifact(workItem, kind, rawSpec)
  };
}

function requireKind(spec: Record<string, unknown>) {
  const kind = requireString(spec, "kind");

  if (!SUPPORTED_KINDS.has(kind)) {
    throw new Error(`Unsupported artifact spec kind: ${kind}`);
  }

  return kind as ArtifactKind;
}

async function assertWorkItemExists(workDir: string, workItem: string) {
  if (!(await pathExists(path.join(workDir, "brief.md")))) {
    throw new Error(`Unknown work item: ${workItem}`);
  }
}

async function assertArtifactPathIsFree(
  artifactPath: string,
  artifactDisplayPath: string
) {
  if (await pathExists(artifactPath)) {
    throw new Error(
      `Refusing to overwrite existing artifact path: ${artifactDisplayPath}`
    );
  }
}

function requireString(spec: Record<string, unknown>, field: string) {
  const value = spec[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Artifact spec missing required field: ${field}`);
  }

  return value;
}

function normalizeDisplayPath(filePath: string) {
  return filePath.split(path.sep).join("/");
}

function isOutsideRepo(relativePath: string) {
  return (
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  );
}

async function pathExists(filePath: string) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (isMissingPathError(error)) {
      return false;
    }
    throw error;
  }
}

function isMissingPathError(error: unknown) {
  return (
    error instanceof Error &&
    "code" in error &&
    (error.code === "ENOENT" || error.code === "ENOTDIR")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
