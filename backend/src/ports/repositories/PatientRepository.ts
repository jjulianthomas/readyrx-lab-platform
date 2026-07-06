import type { PatientId } from "../../domain/common/Identifiers";
import type { Patient } from "../../domain/patients/Patient";

export interface PatientRepository {
  findById(id: PatientId): Promise<Patient | undefined>;
  save(patient: Patient): Promise<void>;
}
