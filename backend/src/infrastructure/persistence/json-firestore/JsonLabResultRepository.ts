import type {
  BiomarkerId,
  PatientId
} from "../../../domain/common/Identifiers";
import type { LabResult } from "../../../domain/results/LabResult";
import type { LabResultRepository } from "../../../ports/repositories/LabResultRepository";
import type { JsonCollection } from "./JsonCollection";

export class JsonLabResultRepository implements LabResultRepository {
  public constructor(private readonly results: JsonCollection<LabResult>) {}

  public async findBySourceMessageId(
    sourceMessageId: string
  ): Promise<LabResult | undefined> {
    const results = await this.results.all();
    return results.find((result) => result.sourceMessageId === sourceMessageId);
  }

  public async listRecentByPatient(patientId: PatientId): Promise<readonly LabResult[]> {
    const results = await this.results.all();
    return results
      .filter((result) => result.patientId === patientId)
      .sort((left, right) => right.resultedAt.localeCompare(left.resultedAt));
  }

  public async listByPatientAndBiomarker(
    patientId: PatientId,
    biomarkerId: BiomarkerId
  ): Promise<readonly LabResult[]> {
    const results = await this.results.all();
    return results.filter(
      (result) =>
        result.patientId === patientId &&
        result.biomarkers.some((item) => item.biomarkerId === biomarkerId)
    );
  }

  public async save(result: LabResult): Promise<void> {
    await this.results.upsert(result);
  }
}
