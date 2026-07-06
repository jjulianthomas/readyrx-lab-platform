import type { LabOrderId } from "../../domain/common/Identifiers";
import type { LabOrder } from "../../domain/orders/LabOrder";
import { canTransitionOrderStatus } from "../../domain/orders/LabOrderStatus";
import type { LabIntegrationRegistry } from "../../ports/integrations/LabIntegrationRegistry";
import type { LabRepository } from "../../ports/repositories/LabRepository";
import type { LabOrderRepository } from "../../ports/repositories/LabOrderRepository";
import type { PatientRepository } from "../../ports/repositories/PatientRepository";
import type { Clock } from "../../ports/services/Clock";
import type { AuditTrail } from "../audit/AuditTrail";
import type { PanelSelector } from "../catalog/PanelSelector";
import { conflict, notFound } from "../common/ApplicationError";
import type { RequestContext } from "../common/RequestContext";

export interface SubmitLabOrderCommand {
  readonly orderId: LabOrderId;
  readonly context: RequestContext;
}

export class SubmitLabOrderUseCase {
  public constructor(
    private readonly orders: LabOrderRepository,
    private readonly patients: PatientRepository,
    private readonly labs: LabRepository,
    private readonly panelSelector: PanelSelector,
    private readonly integrations: LabIntegrationRegistry,
    private readonly audit: AuditTrail,
    private readonly clock: Clock
  ) {}

  public async execute(command: SubmitLabOrderCommand): Promise<LabOrder> {
    const order = await this.orders.findById(command.orderId);
    if (order === undefined) {
      throw notFound("LabOrder", command.orderId);
    }

    if (!canTransitionOrderStatus(order.status, "submitted")) {
      throw conflict(`Order '${order.id}' cannot be submitted from '${order.status}'`);
    }

    const patient = await this.patients.findById(order.patientId);
    const lab = await this.labs.findById(order.labId);
    if (patient === undefined) {
      throw notFound("Patient", order.patientId);
    }
    if (lab === undefined) {
      throw notFound("Lab", order.labId);
    }

    const selected = await this.panelSelector.selectForLab(
      lab,
      order.items.map((item) => item.panelId)
    );
    const adapter = this.integrations.getForLab(lab);
    const submittedAt = this.clock.now();
    const submittedOrder: LabOrder = {
      ...order,
      status: "submitted",
      submittedAt,
      updatedAt: submittedAt
    };
    const labResponse = await adapter.submitOrder({
      order: submittedOrder,
      patient,
      lab,
      panels: selected.map((item) => item.panel)
    });
    const nextStatus = labResponse.accepted ? "accepted" : "failed";

    const updatedOrder: LabOrder = {
      ...submittedOrder,
      status: nextStatus,
      accessionNumber: labResponse.accessionNumber,
      externalOrderId: labResponse.externalOrderId,
      submittedAt: labResponse.submittedAt,
      updatedAt: this.clock.now()
    };

    await this.orders.save(updatedOrder);
    await this.audit.record({
      actor: command.context.actor,
      action: "lab_order.submitted",
      targetType: "LabOrder",
      targetId: updatedOrder.id,
      correlationId: command.context.correlationId,
      metadata: {
        labId: lab.id,
        integrationType: lab.integrationType,
        accepted: labResponse.accepted
      }
    });

    return updatedOrder;
  }
}
