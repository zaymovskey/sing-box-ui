type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

const normalizeToJson = (value: unknown): JsonValue => {
  if (value === null) return null;

  if (Array.isArray(value)) {
    return value.map((v) => (v === undefined ? null : normalizeToJson(v)));
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const out: Record<string, JsonValue> = {};

    for (const key of Object.keys(obj).sort()) {
      const v = obj[key];
      if (v === undefined) continue; // ключ просто исчезает
      out[key] = normalizeToJson(v);
    }

    return out;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  return null;
};

export const isObjectsContentEqual = (a: unknown, b: unknown) => {
  return (
    JSON.stringify(normalizeToJson(a)) === JSON.stringify(normalizeToJson(b))
  );
};
