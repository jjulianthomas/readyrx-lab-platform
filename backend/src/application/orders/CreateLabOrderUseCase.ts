import type { BillingType, LabOrder, OrderingProvider } from "../../domain/orders/LabOrder";
import type { LabId, PatientId, TestPanelId } from "../../domain/common/Identifiers";
import type { LabRepository } from "../../ports/repositories/LabRepository";
import type { LabOrderRepository } from "../../ports/repositories/LabOrderRepository";
import type { PatientRepository } from "../../ports/repositories/PatientRepository";
import type { Clock } from "../../ports/services/Clock";
import type { IdGenerator } from "../../ports/services/IdGenerator";
import type { AuditTrail } from "../audit/AuditTrail";
import type { RequestContext } from "../common/RequestContext";
import type { PanelSelector } from "../catalog/PanelSelector";
import { notFound, validation } from "../common/ApplicationError";

export interface CreateLabOrderCommand {
  readonly patientId: PatientId;
  readonly labId: LabId;
  readonly panelIds: readonly TestPanelId[];
  readonly orderingProvider: OrderingProvider;
  readonly billingType: BillingType;
  readonly idempotencyKey: string;
  readonly context: RequestContext;
}

export class CreateLabOrderUseCase {
  public constructor(
    private readonly patients: PatientRepository,
    private readonly labs: LabRepository,
    private readonly orders: LabOrderRepository,
    private readonly panelSelector: PanelSelector,
    private readonly audit: AuditTrail,
    private readonly ids: IdGenerator,
    private readonly clock: Clock
  ) {}

  public async execute(command: CreateLabOrderCommand): Promise<LabOrder> {
    const existing = await this.orders.findByIdempotencyKey(command.idempotencyKey);
    if (existing !== undefined) {
      return existing;
    }

    const patient = await this.patients.findById(command.patientId);
    if (patient === undefined) {
      throw notFound("Patient", command.patientId);
    }

    const lab = await this.labs.findById(command.labId);
    if (lab === undefined) {
      throw notFound("Lab", command.labId);
    }

    if (!lab.active) {
      throw validation(`Lab '${lab.name}' is not accepting new orders`);
    }

    const selected = await this.panelSelector.selectForLab(lab, command.panelIds);
    const now = this.clock.now();
    const order: LabOrder = {
      id: this.ids.create("order"),
      patientId: patient.id,
      labId: lab.id,
      status: "draft",
      items: selected.map((item) => ({
        panelId: item.panel.id,
        labPanelCode: item.labPanelCode
      })),
      orderingProvider: command.orderingProvider,
      billingType: command.billingType,
      idempotencyKey: command.idempotencyKey,
      createdAt: now,
      updatedAt: now
    };

    await this.orders.save(order);
    await this.audit.record({
      actor: command.context.actor,
      action: "lab_order.created",
      targetType: "LabOrder",
      targetId: order.id,
      correlationId: command.context.correlationId,
      metadata: { labId: lab.id, panelCount: order.items.length }
    });

    return order;
  }
}
