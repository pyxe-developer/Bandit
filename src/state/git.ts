import { execFile } from "node:child_process";

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
  return new Promise((resolve) => {
    execFile("git", ["status", "--short"], { cwd: repoRoot }, (error, stdout) => {
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
      ["show", "--stat", "--patch", "--find-renames", "--no-ext-diff", "--unified=80", revision],
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
