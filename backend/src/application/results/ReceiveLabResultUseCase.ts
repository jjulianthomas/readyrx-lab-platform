import type { LabId } from "../../domain/common/Identifiers";
import type { LabOrderStatus } from "../../domain/orders/LabOrderStatus";
import { canTransitionOrderStatus } from "../../domain/orders/LabOrderStatus";
import type { LabResult, LabResultStatus } from "../../domain/results/LabResult";
import type { LabResultPayload } from "../../ports/integrations/LabIntegrationPort";
import type { LabIntegrationRegistry } from "../../ports/integrations/LabIntegrationRegistry";
import type { LabRepository } from "../../ports/repositories/LabRepository";
import type { LabOrderRepository } from "../../ports/repositories/LabOrderRepository";
import type { LabResultRepository } from "../../ports/repositories/LabResultRepository";
import type { Clock } from "../../ports/services/Clock";
import type { IdGenerator } from "../../ports/services/IdGenerator";
import type { AuditTrail } from "../audit/AuditTrail";
import { conflict, notFound, validation } from "../common/ApplicationError";
import type { RequestContext } from "../common/RequestContext";
import { validateNormalizedLabResult } from "./NormalizedLabResultValidator";

export interface ReceiveLabResultCommand {
  readonly labId: LabId;
  readonly payload: LabResultPayload;
  readonly context: RequestContext;
}

export class ReceiveLabResultUseCase {
  public constructor(
    private readonly labs: LabRepository,
    private readonly orders: LabOrderRepository,
    private readonly results: LabResultRepository,
    private readonly integrations: LabIntegrationRegistry,
    private readonly audit: AuditTrail,
    private readonly ids: IdGenerator,
    private readonly clock: Clock
  ) {}

  public async execute(command: ReceiveLabResultCommand): Promise<LabResult> {
    const lab = await this.labs.findById(command.labId);
    if (lab === undefined) {
      throw notFound("Lab", command.labId);
    }

    const adapter = this.integrations.getForLab(lab);
    const normalized = await adapter.parseResult(command.payload);
    validateNormalizedLabResult(normalized);

    if (normalized.labId !== lab.id) {
      throw validation("Inbound result lab id does not match webhook lab id");
    }

    const existing = await this.results.findBySourceMessageId(
      normalized.sourceMessageId
    );
    if (existing !== undefined) {
      return existing;
    }

    const order = await this.orders.findById(normalized.labOrderId);
    if (order === undefined) {
      throw notFound("LabOrder", normalized.labOrderId);
    }
    if (order.patientId !== normalized.patientId) {
      throw validation("Inbound result patient does not match lab order patient");
    }

    const now = this.clock.now();
    const result: LabResult = {
      id: this.ids.create("result"),
      ...normalized,
      receivedAt: now,
      createdAt: now,
      updatedAt: now
    };

    const nextOrderStatus = toOrderStatus(result.status);
    if (!canTransitionOrderStatus(order.status, nextOrderStatus)) {
      throw conflict(
        `Order '${order.id}' cannot move from '${order.status}' to '${nextOrderStatus}'`
      );
    }

    await this.results.save(result);
    await this.orders.save({
      ...order,
      status: nextOrderStatus,
      accessionNumber: result.accessionNumber,
      updatedAt: now
    });
    await this.audit.record({
      actor: command.context.actor,
      action: "lab_result.received",
      targetType: "LabResult",
      targetId: result.id,
      correlationId: command.context.correlationId,
      metadata: {
        labId: lab.id,
        labOrderId: order.id,
        biomarkerCount: result.biomarkers.length
      }
    });

    return result;
  }
}

function toOrderStatus(status: LabResultStatus): LabOrderStatus {
  if (status === "partial") {
    return "partial_result";
  }
  if (status === "amended") {
    return "amended";
  }
  if (status === "cancelled") {
    return "cancelled";
  }
  return "final_result";
}
