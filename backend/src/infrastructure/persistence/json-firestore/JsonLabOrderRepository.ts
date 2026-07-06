import type {
  LabOrderId,
  PatientId
} from "../../../domain/common/Identifiers";
import type { LabOrder } from "../../../domain/orders/LabOrder";
import type { LabOrderRepository } from "../../../ports/repositories/LabOrderRepository";
import type { JsonCollection } from "./JsonCollection";

export class JsonLabOrderRepository implements LabOrderRepository {
  public constructor(private readonly orders: JsonCollection<LabOrder>) {}

  public async findById(id: LabOrderId): Promise<LabOrder | undefined> {
    return this.orders.findById(id);
  }

  public async findByIdempotencyKey(key: string): Promise<LabOrder | undefined> {
    const orders = await this.orders.all();
    return orders.find((order) => order.idempotencyKey === key);
  }

  public async listByPatient(patientId: PatientId): Promise<readonly LabOrder[]> {
    const orders = await this.orders.all();
    return orders.filter((order) => order.patientId === patientId);
  }

  public async save(order: LabOrder): Promise<void> {
    await this.orders.upsert(order);
  }
}
