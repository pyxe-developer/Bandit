import { readFile } from "node:fs/promises";
import path from "node:path";

type TemplateContract = {
  displayPath: string;
  requirements: TemplateRequirement[];
};

type TemplateRequirement = {
  label: string;
  pattern: RegExp;
};

const TEMPLATE_CONTRACTS: TemplateContract[] = [
  {
    displayPath: "docs/templates/feature-prd.md",
    requirements: [
      heading("problem", "Problem"),
      heading("user", "User"),
      heading("goals", "Goals"),
      heading("non-goals", "Non-Goals"),
      heading("stories or workflows", "Stories Or Workflows"),
      heading("acceptance criteria", "Acceptance Criteria"),
      heading("out-of-scope boundaries", "Out Of Scope"),
      heading("test or verification strategy", "Test Or Verification Strategy"),
      heading("decomposition notes", "Decomposition Notes")
    ]
  },
  {
    displayPath: "docs/templates/slice.md",
    requirements: [
      heading("goal", "Goal"),
      heading("scope", "Scope"),
      heading("out of scope", "Out Of Scope"),
      heading("acceptance criteria", "Acceptance Criteria"),
      heading("test plan", "Test Plan"),
      heading("CLEAN_CODE.md read evidence", "CLEAN_CODE.md Read Evidence"),
      heading("stage-rubric checklist", "Stage-Rubric Checklist"),
      heading("bootstrap gaps", "Bootstrap Gaps"),
      heading("expected files", "Expected Files"),
      heading("implementation order", "First Implementation Order"),
      heading("smell triggers", "Smell Triggers"),
      heading("required evidence", "Required Evidence"),
      heading("operator input status", "Operator Input Status")
    ]
  },
  {
    displayPath: "docs/templates/chore.md",
    requirements: [
      heading("non-product work", "Non-Product Work"),
      heading("origin", "Origin"),
      heading("scope", "Scope"),
      heading("acceptance criteria", "Acceptance Criteria"),
      heading("verification plan", "Verification Plan"),
      heading("expected files", "Expected Files"),
      heading("required evidence", "Required Evidence"),
      heading("operator input status", "Operator Input Status")
    ]
  },
  {
    displayPath: "docs/templates/improvement-chore.md",
    requirements: [
      metadata("source metadata", /^source_(work_item|artifacts):/im),
      metadata("lesson", /^lesson:/im),
      metadata("hypothesis", /^hypothesis:/im),
      metadata("metric", /^metric:/im),
      metadata("baseline", /^baseline:/im),
      metadata("expected_direction", /^expected_direction:/im),
      metadata("evaluation_window", /^evaluation_window:/im),
      metadata("status", /^status:/im),
      metadata("outcome", /^outcome:/im)
    ]
  }
];

export async function validateTemplates(repoRoot: string) {
  for (const contract of TEMPLATE_CONTRACTS) {
    const content = await readTemplate(repoRoot, contract.displayPath);
    const missingRequirements = contract.requirements.filter(
      (requirement) => !requirement.pattern.test(content)
    );

    if (missingRequirements.length > 0) {
      throw new Error(formatMalformedTemplate(contract, missingRequirements));
    }
  }
}

async function readTemplate(repoRoot: string, displayPath: string) {
  try {
    return await readFile(path.join(repoRoot, displayPath), "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      throw new Error(`Missing required template: ${displayPath}`);
    }
    throw error;
  }
}

function formatMalformedTemplate(
  contract: TemplateContract,
  missingRequirements: TemplateRequirement[]
) {
  const missingFields = missingRequirements
    .map((requirement) => `missing required field: ${requirement.label}`)
    .join("; ");

  return `Malformed template: ${contract.displayPath}; ${missingFields}`;
}

function heading(label: string, headingText: string) {
  return metadata(label, new RegExp(`^## ${escapeRegExp(headingText)}$`, "im"));
}

function metadata(label: string, pattern: RegExp): TemplateRequirement {
  return { label, pattern };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isMissingPathError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
