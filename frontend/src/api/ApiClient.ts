type Decode<TValue> = (value: unknown) => TValue;

export class ApiError extends Error {
  public constructor(
    message: string,
    public readonly status: number,
    public readonly code: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiClient {
  public constructor(private readonly baseUrl: string) {}

  public async get<TValue>(path: string, decode: Decode<TValue>): Promise<TValue> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: { Accept: "application/json" }
    });
    const body: unknown = await response.json();
    const envelope = parseEnvelope(body);

    if (!response.ok || !envelope.ok) {
      const fallback = `Request failed with status ${response.status}`;
      const error = envelope.ok
        ? { code: "http_error", message: fallback }
        : envelope.error;
      throw new ApiError(error.message, response.status, error.code);
    }

    return decode(envelope.data);
  }
}

export const apiClient = new ApiClient(
  import.meta.env.VITE_LAB_PLATFORM_API_BASE_URL ?? "http://localhost:4000/api"
);

type ApiEnvelope =
  | { readonly ok: true; readonly data: unknown }
  | { readonly ok: false; readonly error: ApiErrorBody };

interface ApiErrorBody {
  readonly code: string;
  readonly message: string;
}

function parseEnvelope(value: unknown): ApiEnvelope {
  const record = requireRecord(value, "response");
  if (record.ok === true) {
    return { ok: true, data: record.data };
  }
  if (record.ok === false) {
    return { ok: false, error: parseError(record.error) };
  }
  throw new ApiError("Unexpected API response", 0, "invalid_response");
}

function parseError(value: unknown): ApiErrorBody {
  const record = requireRecord(value, "error");
  return {
    code: requireString(record.code, "error.code"),
    message: requireString(record.message, "error.message")
  };
}

function requireRecord(value: unknown, path: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiError(`Expected '${path}' to be an object`, 0, "invalid_response");
  }
  return value as Record<string, unknown>;
}

function requireString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ApiError(`Expected '${path}' to be a non-empty string`, 0, "invalid_response");
  }
  return value;
}
