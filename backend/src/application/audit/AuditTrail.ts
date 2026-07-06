import type { AuditActor } from "../../domain/audit/AuditEvent";
import type { JsonObject } from "../../domain/common/JsonValue";
import type { AuditRepository } from "../../ports/repositories/AuditRepository";
import type { Clock } from "../../ports/services/Clock";
import type { IdGenerator } from "../../ports/services/IdGenerator";

export interface AuditRecordInput {
  readonly actor: AuditActor;
  readonly action: string;
  readonly targetType: string;
  readonly targetId: string;
  readonly correlationId: string;
  readonly metadata: JsonObject;
}

export class AuditTrail {
  public constructor(
    private readonly audits: AuditRepository,
    private readonly ids: IdGenerator,
    private readonly clock: Clock
  ) {}

  public async record(input: AuditRecordInput): Promise<void> {
    await this.audits.append({
      id: this.ids.create("audit"),
      actor: input.actor,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      occurredAt: this.clock.now(),
      correlationId: input.correlationId,
      metadata: input.metadata
    });
  }
}
