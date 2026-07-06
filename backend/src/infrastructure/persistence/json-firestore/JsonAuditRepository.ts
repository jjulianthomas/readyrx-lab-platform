import type { AuditEvent } from "../../../domain/audit/AuditEvent";
import type { AuditRepository } from "../../../ports/repositories/AuditRepository";
import type { JsonCollection } from "./JsonCollection";

export class JsonAuditRepository implements AuditRepository {
  public constructor(private readonly audits: JsonCollection<AuditEvent>) {}

  public async append(event: AuditEvent): Promise<void> {
    await this.audits.upsert(event);
  }
}
