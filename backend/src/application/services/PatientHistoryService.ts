import type { BiomarkerId, PatientId } from "../../domain/common/Identifiers";
import type { LabResult } from "../../domain/results/LabResult";
import type {
  BiomarkerHistory,
  GetPatientBiomarkerHistoryUseCase
} from "../results/GetPatientBiomarkerHistoryUseCase";
import type {
  GetPatientDashboardUseCase
} from "../dashboard/GetPatientDashboardUseCase";
import type { PatientDashboard } from "../dashboard/PatientDashboard";
import type {
  GetPatientHistoryUseCase,
  PatientHistory
} from "../results/GetPatientHistoryUseCase";
import type { GetRecentLabResultsUseCase } from "../results/GetRecentLabResultsUseCase";
import { resultFrom, type Result } from "../common/Result";

export class PatientHistoryService {
  public constructor(
    private readonly getHistory: GetPatientHistoryUseCase,
    private readonly getBiomarkerHistory: GetPatientBiomarkerHistoryUseCase,
    private readonly getRecentResults: GetRecentLabResultsUseCase,
    private readonly getDashboard: GetPatientDashboardUseCase
  ) {}

  public async fullHistory(patientId: PatientId): Promise<Result<PatientHistory>> {
    return resultFrom(() => this.getHistory.execute(patientId));
  }

  public async biomarkerHistory(
    patientId: PatientId,
    biomarkerId: BiomarkerId
  ): Promise<Result<BiomarkerHistory>> {
    return resultFrom(() => this.getBiomarkerHistory.execute(patientId, biomarkerId));
  }

  public async recentResults(patientId: PatientId): Promise<Result<readonly LabResult[]>> {
    return resultFrom(() => this.getRecentResults.execute(patientId));
  }

  public async dashboard(patientId: PatientId): Promise<Result<PatientDashboard>> {
    return resultFrom(() => this.getDashboard.execute(patientId));
  }
}
