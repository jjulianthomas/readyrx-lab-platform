import { randomUUID } from "node:crypto";
import type { IdGenerator } from "../../ports/services/IdGenerator";

export class CryptoIdGenerator implements IdGenerator {
  public create(prefix: string): string {
    return `${prefix}_${randomUUID()}`;
  }
}
