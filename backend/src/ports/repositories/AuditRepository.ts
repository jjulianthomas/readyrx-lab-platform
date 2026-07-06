import type { AuditEvent } from "../../domain/audit/AuditEvent";

export interface AuditRepository {
  append(event: AuditEvent): Promise<void>;
}
