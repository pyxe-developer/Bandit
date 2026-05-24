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
