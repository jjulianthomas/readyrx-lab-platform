import type {
  BiomarkerId,
  PatientId
} from "../../domain/common/Identifiers";
import type { LabResult } from "../../domain/results/LabResult";

export interface LabResultRepository {
  findBySourceMessageId(sourceMessageId: string): Promise<LabResult | undefined>;
  listRecentByPatient(patientId: PatientId): Promise<readonly LabResult[]>;
  listByPatientAndBiomarker(
    patientId: PatientId,
    biomarkerId: BiomarkerId
  ): Promise<readonly LabResult[]>;
  save(result: LabResult): Promise<void>;
}
