import type { IsoDateTimeString } from "./Time";

export type AuditActorType = "patient" | "provider" | "admin" | "system" | "lab";

export interface AuditMetadata {
  /** Actor id that created the document. */
  readonly createdBy: string;
  /** Actor type that created the document. */
  readonly createdByType: AuditActorType;
  /** Actor id that last updated the document. */
  readonly updatedBy: string;
  /** Actor type that last updated the document. */
  readonly updatedByType: AuditActorType;
  /** Request correlation id that created or last changed the document. */
  readonly correlationId: string;
  /** Source IP or integration source when available and safe to store. */
  readonly sourceIp?: string;
  /** Timestamp when this audit metadata was recorded. */
  readonly recordedAt: IsoDateTimeString;
}
