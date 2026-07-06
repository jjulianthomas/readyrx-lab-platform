import type { PatientId } from "../../domain/common/Identifiers";
import type { LabOrderRepository } from "../../ports/repositories/LabOrderRepository";
import type { LabRepository } from "../../ports/repositories/LabRepository";
import type { LabResultRepository } from "../../ports/repositories/LabResultRepository";
import type { PatientRepository } from "../../ports/repositories/PatientRepository";
import type { TestCatalogRepository } from "../../ports/repositories/TestCatalogRepository";
import { notFound } from "../common/ApplicationError";
import {
  toDashboardOrders,
  toDashboardPatient,
  toDashboardResults,
  toDashboardTrend
} from "./PatientDashboardMapper";
import type { PatientDashboard } from "./PatientDashboard";

export class GetPatientDashboardUseCase {
  public constructor(
    private readonly patients: PatientRepository,
    private readonly orders: LabOrderRepository,
    private readonly results: LabResultRepository,
    private readonly labs: LabRepository,
    private readonly catalog: TestCatalogRepository
  ) {}

  public async execute(patientId: PatientId): Promise<PatientDashboard> {
    const patient = await this.patients.findById(patientId);
    if (patient === undefined) {
      throw notFound("Patient", patientId);
    }

    const [orders, results, labs, panels] = await Promise.all([
      this.orders.listByPatient(patientId),
      this.results.listRecentByPatient(patientId),
      this.labs.listActive(),
      this.catalog.listPanels()
    ]);

    return {
      patient: toDashboardPatient(patient),
      recentOrders: toDashboardOrders(orders, labs, panels),
      recentResults: toDashboardResults(results, orders, labs, panels),
      trend: toDashboardTrend(results)
    };
  }
}
