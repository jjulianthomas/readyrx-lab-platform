import type { PatientHistory } from "../../../application/results/GetPatientHistoryUseCase";
import type { PatientHistoryResponseDto } from "../dtos/PatientHistoryDtos";
import { toLabOrderResponse } from "./LabOrderPresenter";
import { toLabResultResponse } from "./LabResultPresenter";

export function toPatientHistoryResponse(
  history: PatientHistory
): PatientHistoryResponseDto {
  return {
    patientId: history.patientId,
    orders: history.orders.map(toLabOrderResponse),
    results: history.results.map(toLabResultResponse)
  };
}
