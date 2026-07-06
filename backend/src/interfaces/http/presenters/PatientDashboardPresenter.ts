import type { PatientDashboard } from "../../../application/dashboard/PatientDashboard";
import type { PatientDashboardResponseDto } from "../dtos/PatientDashboardDtos";

export function toPatientDashboardResponse(
  dashboard: PatientDashboard
): PatientDashboardResponseDto {
  return {
    patient: dashboard.patient,
    recentOrders: dashboard.recentOrders,
    recentResults: dashboard.recentResults,
    trend: dashboard.trend
  };
}
