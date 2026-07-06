export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";
export type OrderStatus =
  | "draft"
  | "submitted"
  | "accepted"
  | "in_progress"
  | "partial_result"
  | "final_result"
  | "amended"
  | "failed"
  | "cancelled";
export type ResultStatus = "partial" | "final" | "amended" | "cancelled";
export type ResultFlag = "low" | "normal" | "high" | "critical" | "unknown";

export interface Patient {
  readonly id: string;
  readonly name: string;
  readonly birthDate: string;
  readonly sexAtBirth: string;
  readonly email: string;
}

export interface LabOrder {
  readonly id: string;
  readonly labName: string;
  readonly panelName: string;
  readonly status: OrderStatus;
  readonly orderedAt: string;
  readonly accessionNumber?: string;
}

export interface BiomarkerResult {
  readonly biomarkerId: string;
  readonly name: string;
  readonly value: number;
  readonly unit: string;
  readonly flag: ResultFlag;
  readonly referenceRange: string;
}

export interface LabResult {
  readonly id: string;
  readonly labName: string;
  readonly panelName: string;
  readonly status: ResultStatus;
  readonly resultedAt: string;
  readonly biomarkers: readonly BiomarkerResult[];
}

export interface TrendPoint {
  readonly id: string;
  readonly observedAt: string;
  readonly value: number;
  readonly unit: string;
  readonly flag: ResultFlag;
}

export interface BiomarkerTrend {
  readonly biomarkerId: string;
  readonly name: string;
  readonly referenceRange: string;
  readonly points: readonly TrendPoint[];
}

export interface DashboardData {
  readonly patient: Patient;
  readonly recentOrders: readonly LabOrder[];
  readonly recentResults: readonly LabResult[];
  readonly trend: BiomarkerTrend;
}
