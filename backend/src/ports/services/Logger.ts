import type { JsonObject } from "../../domain/common/JsonValue";

export interface Logger {
  info(message: string, metadata?: JsonObject): void;
  warn(message: string, metadata?: JsonObject): void;
  error(message: string, metadata?: JsonObject): void;
}
