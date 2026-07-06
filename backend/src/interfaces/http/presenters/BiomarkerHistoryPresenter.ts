import type { BiomarkerHistory } from "../../../application/results/GetPatientBiomarkerHistoryUseCase";
import type { BiomarkerHistoryResponseDto } from "../dtos/BiomarkerHistoryDtos";

export function toBiomarkerHistoryResponse(
  history: BiomarkerHistory
): BiomarkerHistoryResponseDto {
  return {
    patientId: history.patientId,
    biomarkerId: history.biomarkerId,
    displayName: history.displayName,
    points: history.points
  };
}
