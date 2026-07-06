export interface DashboardPatientResponseDto {
  readonly id: string;
  readonly name: string;
  readonly birthDate: string;
  readonly sexAtBirth: string;
  readonly email: string;
}

export interface DashboardLabOrderResponseDto {
  readonly id: string;
  readonly labName: string;
  readonly panelName: string;
  readonly status: string;
  readonly orderedAt: string;
  readonly accessionNumber?: string;
}

export interface DashboardBiomarkerResultResponseDto {
  readonly biomarkerId: string;
  readonly name: string;
  readonly value: number;
  readonly unit: string;
  readonly flag: string;
  readonly referenceRange: string;
}

export interface DashboardLabResultResponseDto {
  readonly id: string;
  readonly labName: string;
  readonly panelName: string;
  readonly status: string;
  readonly resultedAt: string;
  readonly biomarkers: readonly DashboardBiomarkerResultResponseDto[];
}

export interface DashboardTrendPointResponseDto {
  readonly id: string;
  readonly observedAt: string;
  readonly value: number;
  readonly unit: string;
  readonly flag: string;
}

export interface DashboardBiomarkerTrendResponseDto {
  readonly biomarkerId: string;
  readonly name: string;
  readonly referenceRange: string;
  readonly points: readonly DashboardTrendPointResponseDto[];
}

export interface PatientDashboardResponseDto {
  readonly patient: DashboardPatientResponseDto;
  readonly recentOrders: readonly DashboardLabOrderResponseDto[];
  readonly recentResults: readonly DashboardLabResultResponseDto[];
  readonly trend: DashboardBiomarkerTrendResponseDto;
}
