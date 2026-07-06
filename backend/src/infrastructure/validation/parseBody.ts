import type { ZodType } from "zod";

export function parseBody<TOutput>(
  schema: ZodType<TOutput>,
  body: unknown
): TOutput {
  return schema.parse(body);
}
