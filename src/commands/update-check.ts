import { runUpdateCheck, type UpdateCheckResult } from "../state/update-channel.js";

export async function updateCheck(repoRoot: string, args: string[]) {
  const json = args.includes("--json");
  const result = await runUpdateCheck(repoRoot);

  return {
    output: json
      ? `${JSON.stringify(result, null, 2)}\n`
      : formatHumanReadable(result)
  };
}

function formatHumanReadable(result: UpdateCheckResult): string {
  const lines = [`Bandit update check: ${result.status}`];

  if (result.status === "update_available") {
    lines.push(
      `Installed ${result.installed_version} -> available ${result.latest_version}`
    );
    if (result.update_command) {
      lines.push(`Run: ${result.update_command}`);
    }
  } else if (result.status === "current") {
    lines.push(`Installed version ${result.installed_version} is up to date.`);
  } else if (result.status === "unconfigured") {
    lines.push(
      "No .bandit/update-channel.json configured; update checking is off."
    );
  } else if (result.status === "disabled") {
    lines.push("Update checking is disabled for this repo.");
  } else if (result.status === "unreachable") {
    lines.push("Configured private update source is unreachable.");
  }

  return `${lines.join("\n")}\n`;
}
