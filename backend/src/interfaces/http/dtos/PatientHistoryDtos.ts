import type { LabOrderResponseDto } from "./LabOrderDtos";
import type { LabResultResponseDto } from "./LabResultDtos";

export interface PatientHistoryResponseDto {
  readonly patientId: string;
  readonly orders: readonly LabOrderResponseDto[];
  readonly results: readonly LabResultResponseDto[];
}
