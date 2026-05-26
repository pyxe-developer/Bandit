export type ParsedFields = Map<string, ParsedField>;

export type ParsedField = {
  scalar: string;
  list: string[];
};

export function parseMetadataFields(content: string): ParsedFields {
  const fields: ParsedFields = new Map();
  let currentListField: string | null = null;
  let currentScalarField: string | null = null;

  for (const line of content.split(/\r?\n/)) {
    const scalarMatch = line.match(/^([a-z_]+):\s*(.*)$/);
    if (scalarMatch) {
      const field = scalarMatch[1];
      const scalar = scalarMatch[2]?.trim() ?? "";

      if (!field) {
        continue;
      }

      fields.set(field, { scalar, list: [] });
      currentListField = scalar.length === 0 ? field : null;
      currentScalarField = scalar.length > 0 ? field : null;
      continue;
    }

    const listMatch = line.match(/^\s*-\s+(.+)$/);
    if (listMatch && currentListField) {
      fields.get(currentListField)?.list.push(listMatch[1]?.trim() ?? "");
      currentScalarField = null;
      continue;
    }

    const continuationMatch = line.match(/^\s{2,}(\S.*)$/);
    if (continuationMatch && currentScalarField) {
      const field = fields.get(currentScalarField);
      if (field) {
        field.scalar = `${field.scalar} ${continuationMatch[1]?.trim() ?? ""}`.trim();
      }
      continue;
    }

    if (line.trim().length === 0 || !line.startsWith(" ")) {
      currentListField = null;
      currentScalarField = null;
    }
  }

  return fields;
}

export function hasMetadataField(content: string, field: string) {
  return new RegExp(`^${escapeRegExp(field)}:`, "m").test(content);
}

export function readScalar(fields: ParsedFields, field: string) {
  return fields.get(field)?.scalar.trim() ?? "";
}

export function readList(fields: ParsedFields, field: string) {
  return (
    fields
      .get(field)
      ?.list.map((item) => item.trim())
      .filter((item) => item.length > 0) ?? []
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
