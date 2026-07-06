import type { LabOrderId } from "../../domain/common/Identifiers";
import type { LabOrder } from "../../domain/orders/LabOrder";
import type { LabOrderRepository } from "../../ports/repositories/LabOrderRepository";
import { notFound } from "../common/ApplicationError";

export class GetLabOrderUseCase {
  public constructor(private readonly orders: LabOrderRepository) {}

  public async execute(orderId: LabOrderId): Promise<LabOrder> {
    const order = await this.orders.findById(orderId);

    if (order === undefined) {
      throw notFound("LabOrder", orderId);
    }

    return order;
  }
}
