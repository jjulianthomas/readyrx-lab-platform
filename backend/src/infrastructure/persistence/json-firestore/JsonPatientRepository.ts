import type { PatientId } from "../../../domain/common/Identifiers";
import type { Patient } from "../../../domain/patients/Patient";
import type { PatientRepository } from "../../../ports/repositories/PatientRepository";
import type { JsonCollection } from "./JsonCollection";

export class JsonPatientRepository implements PatientRepository {
  public constructor(private readonly patients: JsonCollection<Patient>) {}

  public async findById(id: PatientId): Promise<Patient | undefined> {
    return this.patients.findById(id);
  }

  public async save(patient: Patient): Promise<void> {
    await this.patients.upsert(patient);
  }
}
