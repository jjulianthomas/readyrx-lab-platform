import type { PatientId } from "../../domain/common/Identifiers";
import type { LabResult } from "../../domain/results/LabResult";
import type { PatientRepository } from "../../ports/repositories/PatientRepository";
import type { LabResultRepository } from "../../ports/repositories/LabResultRepository";
import { notFound } from "../common/ApplicationError";

export class GetRecentLabResultsUseCase {
  public constructor(
    private readonly patients: PatientRepository,
    private readonly results: LabResultRepository
  ) {}

  public async execute(patientId: PatientId): Promise<readonly LabResult[]> {
    const patient = await this.patients.findById(patientId);

    if (patient === undefined) {
      throw notFound("Patient", patientId);
    }

    return this.results.listRecentByPatient(patientId);
  }
}
