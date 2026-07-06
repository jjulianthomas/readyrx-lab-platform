import type { AuditActor } from "../../domain/audit/AuditEvent";

export interface RequestContext {
  readonly actor: AuditActor;
  readonly correlationId: string;
}
