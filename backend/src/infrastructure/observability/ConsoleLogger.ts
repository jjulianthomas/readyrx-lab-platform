import type { JsonObject } from "../../domain/common/JsonValue";
import type { Logger } from "../../ports/services/Logger";

export class ConsoleLogger implements Logger {
  public info(message: string, metadata: JsonObject = {}): void {
    console.info(JSON.stringify({ level: "info", message, ...metadata }));
  }

  public warn(message: string, metadata: JsonObject = {}): void {
    console.warn(JSON.stringify({ level: "warn", message, ...metadata }));
  }

  public error(message: string, metadata: JsonObject = {}): void {
    console.error(JSON.stringify({ level: "error", message, ...metadata }));
  }
}
