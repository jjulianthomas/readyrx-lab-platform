import type {
  LabOrderId,
  PatientId
} from "../../domain/common/Identifiers";
import type { LabOrder } from "../../domain/orders/LabOrder";

export interface LabOrderRepository {
  findById(id: LabOrderId): Promise<LabOrder | undefined>;
  findByIdempotencyKey(key: string): Promise<LabOrder | undefined>;
  listByPatient(patientId: PatientId): Promise<readonly LabOrder[]>;
  save(order: LabOrder): Promise<void>;
}
