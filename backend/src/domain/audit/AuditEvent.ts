import type { AuditEventId } from "../common/Identifiers";
import type { JsonObject } from "../common/JsonValue";
import type { IsoDateTimeString } from "../common/Time";

export type AuditActorRole = "patient" | "provider" | "admin" | "system" | "lab";

export interface AuditActor {
  /** Actor id from auth, provider record, patient record, or integration name. */
  readonly id: string;
  /** Actor role used for compliance reports and access review. */
  readonly role: AuditActorRole;
}

export interface AuditEvent {
  /** Firestore document id for auditEvents/{id}. */
  readonly id: AuditEventId;
  /** Actor responsible for the audited action. */
  readonly actor: AuditActor;
  /** Action name, such as lab_order.created or lab_result.received. */
  readonly action: string;
  /** Entity type affected by the action. */
  readonly targetType: string;
  /** Entity id affected by the action. */
  readonly targetId: string;
  /** ISO timestamp when the action occurred. */
  readonly occurredAt: IsoDateTimeString;
  /** Request or message correlation id for tracing distributed work. */
  readonly correlationId: string;
  /** Firestore record version after the change, when applicable. */
  readonly targetRecordVersion?: number;
  /** Structured, PHI-minimized context for debugging and compliance. */
  readonly metadata: JsonObject;
}
