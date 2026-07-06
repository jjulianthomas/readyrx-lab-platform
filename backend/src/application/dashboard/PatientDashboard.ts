export interface PatientDashboard {
  readonly patient: DashboardPatient;
  readonly recentOrders: readonly DashboardLabOrder[];
  readonly recentResults: readonly DashboardLabResult[];
  readonly trend: DashboardBiomarkerTrend;
}

export interface DashboardPatient {
  readonly id: string;
  readonly name: string;
  readonly birthDate: string;
  readonly sexAtBirth: string;
  readonly email: string;
}

export interface DashboardLabOrder {
  readonly id: string;
  readonly labName: string;
  readonly panelName: string;
  readonly status: string;
  readonly orderedAt: string;
  readonly accessionNumber?: string;
}

export interface DashboardBiomarkerResult {
  readonly biomarkerId: string;
  readonly name: string;
  readonly value: number;
  readonly unit: string;
  readonly flag: string;
  readonly referenceRange: string;
}

export interface DashboardLabResult {
  readonly id: string;
  readonly labName: string;
  readonly panelName: string;
  readonly status: string;
  readonly resultedAt: string;
  readonly biomarkers: readonly DashboardBiomarkerResult[];
}

export interface DashboardTrendPoint {
  readonly id: string;
  readonly observedAt: string;
  readonly value: number;
  readonly unit: string;
  readonly flag: string;
}

export interface DashboardBiomarkerTrend {
  readonly biomarkerId: string;
  readonly name: string;
  readonly referenceRange: string;
  readonly points: readonly DashboardTrendPoint[];
}
