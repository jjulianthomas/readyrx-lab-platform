import type {
  BiomarkerId,
  PatientId
} from "../../domain/common/Identifiers";
import type { ResultFlag } from "../../domain/results/LabResult";
import type { LabResultRepository } from "../../ports/repositories/LabResultRepository";
import type { TestCatalogRepository } from "../../ports/repositories/TestCatalogRepository";
import { notFound } from "../common/ApplicationError";

export interface BiomarkerHistoryPoint {
  readonly observedAt: string;
  readonly value: number;
  readonly unit: string;
  readonly flag: ResultFlag;
  readonly labResultId: string;
}

export interface BiomarkerHistory {
  readonly patientId: PatientId;
  readonly biomarkerId: BiomarkerId;
  readonly displayName: string;
  readonly points: readonly BiomarkerHistoryPoint[];
}

export class GetPatientBiomarkerHistoryUseCase {
  public constructor(
    private readonly results: LabResultRepository,
    private readonly catalog: TestCatalogRepository
  ) {}

  public async execute(
    patientId: PatientId,
    biomarkerId: BiomarkerId
  ): Promise<BiomarkerHistory> {
    const biomarker = await this.catalog.findBiomarkerById(biomarkerId);
    if (biomarker === undefined) {
      throw notFound("Biomarker", biomarkerId);
    }

    const labResults = await this.results.listByPatientAndBiomarker(
      patientId,
      biomarkerId
    );
    const points = labResults
      .flatMap((result) =>
        result.biomarkers
          .filter((item) => item.biomarkerId === biomarkerId)
          .map((item) => ({
            observedAt: item.observedAt,
            value: item.value,
            unit: item.unit,
            flag: item.flag,
            labResultId: result.id
          }))
      )
      .sort((left, right) => left.observedAt.localeCompare(right.observedAt));

    return {
      patientId,
      biomarkerId,
      displayName: biomarker.displayName,
      points
    };
  }
}
