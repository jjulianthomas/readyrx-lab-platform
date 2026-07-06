import type { PatientId } from "../../domain/common/Identifiers";
import type { LabOrder } from "../../domain/orders/LabOrder";
import type { LabResult } from "../../domain/results/LabResult";
import type { LabOrderRepository } from "../../ports/repositories/LabOrderRepository";
import type { LabResultRepository } from "../../ports/repositories/LabResultRepository";
import type { PatientRepository } from "../../ports/repositories/PatientRepository";
import { notFound } from "../common/ApplicationError";

export interface PatientHistory {
  readonly patientId: PatientId;
  readonly orders: readonly LabOrder[];
  readonly results: readonly LabResult[];
}

export class GetPatientHistoryUseCase {
  public constructor(
    private readonly patients: PatientRepository,
    private readonly orders: LabOrderRepository,
    private readonly results: LabResultRepository
  ) {}

  public async execute(patientId: PatientId): Promise<PatientHistory> {
    const patient = await this.patients.findById(patientId);

    if (patient === undefined) {
      throw notFound("Patient", patientId);
    }

    return {
      patientId,
      orders: await this.orders.listByPatient(patientId),
      results: await this.results.listRecentByPatient(patientId)
    };
  }
}
