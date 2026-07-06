import type { LabOrderId } from "../../domain/common/Identifiers";
import type { LabOrder } from "../../domain/orders/LabOrder";
import type {
  CreateLabOrderCommand,
  CreateLabOrderUseCase
} from "../orders/CreateLabOrderUseCase";
import type { GetLabOrderUseCase } from "../orders/GetLabOrderUseCase";
import type {
  SubmitLabOrderCommand,
  SubmitLabOrderUseCase
} from "../orders/SubmitLabOrderUseCase";
import { resultFrom, type Result } from "../common/Result";

export class LabOrderService {
  public constructor(
    private readonly createOrder: CreateLabOrderUseCase,
    private readonly submitOrder: SubmitLabOrderUseCase,
    private readonly getOrder: GetLabOrderUseCase
  ) {}

  public async create(command: CreateLabOrderCommand): Promise<Result<LabOrder>> {
    return resultFrom(() => this.createOrder.execute(command));
  }

  public async submit(command: SubmitLabOrderCommand): Promise<Result<LabOrder>> {
    return resultFrom(() => this.submitOrder.execute(command));
  }

  public async get(orderId: LabOrderId): Promise<Result<LabOrder>> {
    return resultFrom(() => this.getOrder.execute(orderId));
  }
}
