import { execFile } from "node:child_process";

export type GitChangedPathsErrorReason =
  | "missing_base_revision"
  | "missing_base_revision_partial_clone"
  | "missing_base_revision_shallow_repository"
  | "missing_head_revision"
  | "missing_revision"
  | "not_git_repository"
  | "git_diff_failed";

export type GitChangedPathsResult =
  | {
      status: "ok";
      paths: string[];
    }
  | {
      status: "error";
      reason: GitChangedPathsErrorReason;
      message: string;
    };

export function readCurrentGitHead(repoRoot: string): Promise<string | null> {
  return new Promise((resolve) => {
    execFile("git", ["rev-parse", "HEAD"], { cwd: repoRoot }, (error, stdout) => {
      if (error) {
        resolve(null);
        return;
      }

      const head = stdout.trim();
      resolve(head.length > 0 ? head : null);
    });
  });
}

export function readGitStatusShort(repoRoot: string): Promise<string | null> {
  return readGitStatus(repoRoot, ["status", "--short"]);
}

export function readGitStatusShortIncludingUntrackedFiles(
  repoRoot: string
): Promise<string | null> {
  return readGitStatus(repoRoot, [
    "status",
    "--short",
    "--untracked-files=all"
  ]);
}

function readGitStatus(
  repoRoot: string,
  args: string[]
): Promise<string | null> {
  return new Promise((resolve) => {
    execFile("git", args, { cwd: repoRoot }, (error, stdout) => {
      if (error) {
        resolve(null);
        return;
      }

      resolve(stdout.trim());
    });
  });
}

export function readGitShow(repoRoot: string, revision = "HEAD"): Promise<string | null> {
  return new Promise((resolve) => {
    execFile(
      "git",
      ["show", "--stat", "--patch", "--find-renames", "--no-ext-diff", "--unified=20", revision],
      {
        cwd: repoRoot,
        maxBuffer: 1024 * 1024 * 4
      },
      (error, stdout) => {
        if (error) {
          resolve(null);
          return;
        }

        resolve(stdout.trim());
      }
    );
  });
}

export function readGitDiff(
  repoRoot: string,
  baseRevision: string,
  headRevision = "HEAD"
): Promise<string | null> {
  return new Promise((resolve) => {
    execFile(
      "git",
      [
        "diff",
        "--stat",
        "--patch",
        "--find-renames",
        "--no-ext-diff",
        "--unified=20",
        `${baseRevision}..${headRevision}`
      ],
      {
        cwd: repoRoot,
        maxBuffer: 1024 * 1024 * 4
      },
      (error, stdout) => {
        if (error) {
          resolve(null);
          return;
        }

        resolve(stdout.trim());
      }
    );
  });
}

export function readGitChangedPaths(
  repoRoot: string,
  baseRevision: string,
  headRevision = "HEAD"
): Promise<GitChangedPathsResult> {
  return new Promise((resolve) => {
    execFile(
      "git",
      [
        "diff",
        "--name-only",
        "--no-ext-diff",
        baseRevision,
        headRevision,
        "--"
      ],
      {
        cwd: repoRoot,
        maxBuffer: 1024 * 1024 * 4
      },
      async (error, stdout, stderr) => {
        if (error) {
          resolve({
            status: "error",
            ...(await classifyGitChangedPathsError(
              repoRoot,
              stderr,
              baseRevision,
              headRevision
            ))
          });
          return;
        }

        resolve({
          status: "ok",
          paths: stdout.split("\n").map((line) => line.trim()).filter(Boolean)
        });
      }
    );
  });
}

export function createCachedGitChangedPathsReader() {
  const cache = new Map<string, Promise<GitChangedPathsResult>>();

  return (
    repoRoot: string,
    baseRevision: string,
    headRevision = "HEAD"
  ): Promise<GitChangedPathsResult> => {
    const cacheKey = `${repoRoot}\0${baseRevision}\0${headRevision}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = readGitChangedPaths(repoRoot, baseRevision, headRevision);
    cache.set(cacheKey, result);
    return result;
  };
}

async function classifyGitChangedPathsError(
  repoRoot: string,
  stderr: string,
  baseRevision: string,
  headRevision: string
): Promise<{ reason: GitChangedPathsErrorReason; message: string }> {
  const message = stderr.trim() || "git diff changed-path read failed";
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("not a git repository")) {
    return { reason: "not_git_repository", message };
  }

  if (
    lowerMessage.includes("bad object") ||
    lowerMessage.includes("bad revision") ||
    lowerMessage.includes("unknown revision") ||
    lowerMessage.includes("ambiguous argument")
  ) {
    if (message.includes(baseRevision)) {
      if (await hasPromisorRemote(repoRoot)) {
        return {
          reason: "missing_base_revision_partial_clone",
          message
        };
      }

      if (await isShallowRepository(repoRoot)) {
        return {
          reason: "missing_base_revision_shallow_repository",
          message
        };
      }

      return { reason: "missing_base_revision", message };
    }

    if (message.includes(headRevision)) {
      return { reason: "missing_head_revision", message };
    }

    if (headRevision === "HEAD") {
      return { reason: "missing_base_revision", message };
    }

    return { reason: "missing_revision", message };
  }

  return { reason: "git_diff_failed", message };
}

function isShallowRepository(repoRoot: string): Promise<boolean> {
  return new Promise((resolve) => {
    execFile(
      "git",
      ["rev-parse", "--is-shallow-repository"],
      { cwd: repoRoot },
      (error, stdout) => {
        if (error) {
          resolve(false);
          return;
        }

        resolve(stdout.trim() === "true");
      }
    );
  });
}

function hasPromisorRemote(repoRoot: string): Promise<boolean> {
  return new Promise((resolve) => {
    execFile(
      "git",
      ["config", "--get-regexp", "^remote\\..*\\.promisor$"],
      { cwd: repoRoot },
      (error, stdout) => {
        if (error) {
          resolve(false);
          return;
        }

        resolve(stdout.trim().length > 0);
      }
    );
  });
}

export function readLatestCommitForPath(
  repoRoot: string,
  relativePath: string
): Promise<string | null> {
  return new Promise((resolve) => {
    execFile(
      "git",
      ["rev-list", "-1", "HEAD", "--", relativePath],
      { cwd: repoRoot },
      (error, stdout) => {
        if (error) {
          resolve(null);
          return;
        }

        const commit = stdout.trim();
        resolve(commit.length > 0 ? commit : null);
      }
    );
  });
}
