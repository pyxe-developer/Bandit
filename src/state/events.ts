import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export type LifecycleEvent = {
  type: string;
  work_item: string | null;
  message: string;
};

export async function appendLifecycleEvent(
  eventsPath: string,
  event: LifecycleEvent
) {
  await mkdir(path.dirname(eventsPath), { recursive: true });
  await appendFile(eventsPath, `${JSON.stringify(event)}\n`, "utf8");
}

export function validateEventLog(eventLog: string) {
  const lines = eventLog.split("\n").filter((line) => line.trim().length > 0);

  for (const [index, line] of lines.entries()) {
    try {
      const parsed = JSON.parse(line) as Partial<LifecycleEvent>;
      validateEvent(index + 1, parsed);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Malformed event log at line ${index + 1}`);
      }
      throw error;
    }
  }
}

function validateEvent(lineNumber: number, event: Partial<LifecycleEvent>) {
  if (
    typeof event.type !== "string" ||
    !("work_item" in event) ||
    typeof event.message !== "string"
  ) {
    throw new Error(`Malformed event log at line ${lineNumber}`);
  }
}
