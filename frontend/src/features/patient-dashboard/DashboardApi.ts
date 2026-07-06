import { apiClient, type ApiClient } from "../../api/ApiClient";
import { parseDashboardData } from "./dashboardParser";
import type { DashboardData } from "./types";

export interface DashboardService {
  getDashboard(patientId: string): Promise<DashboardData>;
}

export class HttpDashboardService implements DashboardService {
  public constructor(private readonly client: ApiClient) {}

  public async getDashboard(patientId: string): Promise<DashboardData> {
    const encodedPatientId = encodeURIComponent(patientId);
    return this.client.get(
      `/patients/${encodedPatientId}/dashboard`,
      parseDashboardData
    );
  }
}

export const dashboardService = new HttpDashboardService(apiClient);
