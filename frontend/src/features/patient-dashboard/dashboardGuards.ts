export type UnknownRecord = Record<string, unknown>;

export function parseArray<TValue>(
  value: unknown,
  path: string,
  parser: (item: unknown, path: string) => TValue
): readonly TValue[] {
  if (!Array.isArray(value)) {
    throw new Error(`Expected '${path}' to be an array`);
  }
  return value.map((item, index) => parser(item, `${path}.${index}`));
}

export function requireRecord(value: unknown, path: string): UnknownRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Expected '${path}' to be an object`);
  }
  return value as UnknownRecord;
}

export function requireString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Expected '${path}' to be a non-empty string`);
  }
  return value;
}

export function optionalString(value: unknown, path: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return requireString(value, path);
}

export function requireNumber(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Expected '${path}' to be a finite number`);
  }
  return value;
}

export function requireEnum<TValue extends string>(
  value: unknown,
  path: string,
  allowed: readonly TValue[]
): TValue {
  if (typeof value !== "string" || !allowed.includes(value as TValue)) {
    throw new Error(`Expected '${path}' to be one of: ${allowed.join(", ")}`);
  }
  return value as TValue;
}
