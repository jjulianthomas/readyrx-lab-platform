import type { LabResult } from "../../../domain/results/LabResult";
import type { LabResultResponseDto } from "../dtos/LabResultDtos";

export function toLabResultResponse(result: LabResult): LabResultResponseDto {
  return {
    id: result.id,
    labOrderId: result.labOrderId,
    patientId: result.patientId,
    labId: result.labId,
    status: result.status,
    accessionNumber: result.accessionNumber,
    sourceMessageId: result.sourceMessageId,
    collectedAt: result.collectedAt,
    resultedAt: result.resultedAt,
    receivedAt: result.receivedAt,
    biomarkers: result.biomarkers
  };
}
