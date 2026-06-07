import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildCockpitViewModel } from "../state/cockpit-view-model.ts";
import { renderBrowserCockpitShell } from "./browser-shell.ts";
import { previewCockpitStatusSnapshot } from "./preview-status-snapshot.ts";

const PREVIEW_VIEWPORT = { width: 1440, height: 900 };
const PREVIEW_OUTPUT_PATH = "public/cockpit/index.html";
const STATIC_PREVIEW_BODY =
  '<body data-canonical-state-owner="repo_native_artifacts_via_bandit_cli">';
const STATIC_PREVIEW_NOTICE =
  '<div class="static-preview-notice" role="note">Static preview — workflow authority lives in repo-native artifacts via the Bandit CLI, not in browser state.</div>';

// Render the static browser preview from the deterministic saved status
// snapshot so the committed HTML stays rebuildable presentation state, never a
// canonical workflow source.
export function buildStaticPreviewHtml(): string {
  const viewModel = buildCockpitViewModel(previewCockpitStatusSnapshot());
  const shell = renderBrowserCockpitShell(viewModel, PREVIEW_VIEWPORT);
  return withStaticPreviewNotice(shell.html);
}

function withStaticPreviewNotice(html: string): string {
  return html.replace(
    STATIC_PREVIEW_BODY,
    `${STATIC_PREVIEW_BODY}\n  ${STATIC_PREVIEW_NOTICE}`
  );
}

async function writeStaticPreview(): Promise<void> {
  const repoRoot = path.resolve(fileURLToPath(import.meta.url), "../../..");
  await writeFile(
    path.join(repoRoot, PREVIEW_OUTPUT_PATH),
    `${buildStaticPreviewHtml()}\n`,
    "utf8"
  );
}

const invokedPath = process.argv[1];
const isMainModule =
  invokedPath !== undefined &&
  path.resolve(invokedPath) === fileURLToPath(import.meta.url);

if (isMainModule) {
  writeStaticPreview().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
