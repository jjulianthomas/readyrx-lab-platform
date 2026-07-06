import type { NormalizedLabResult } from "../../ports/integrations/NormalizedLabResult";
import { validation } from "../common/ApplicationError";

export function validateNormalizedLabResult(result: NormalizedLabResult): void {
  requireText(result.labOrderId, "labOrderId");
  requireText(result.patientId, "patientId");
  requireText(result.labId, "labId");
  requireText(result.accessionNumber, "accessionNumber");
  requireText(result.sourceMessageId, "sourceMessageId");
  requireDate(result.collectedAt, "collectedAt");
  requireDate(result.resultedAt, "resultedAt");

  if (Date.parse(result.collectedAt) > Date.parse(result.resultedAt)) {
    throw validation("Result collection timestamp cannot be after result timestamp");
  }
  if (result.biomarkers.length === 0) {
    throw validation("Inbound result must include at least one biomarker");
  }

  result.biomarkers.forEach((biomarker) => {
    requireText(biomarker.biomarkerId, "biomarkerId");
    requireText(biomarker.displayName, "displayName");
    requireText(biomarker.unit, "unit");
    requireText(biomarker.sourceCode, "sourceCode");
    requireDate(biomarker.observedAt, "observedAt");
    if (!Number.isFinite(biomarker.value)) {
      throw validation(`Biomarker '${biomarker.displayName}' value must be numeric`);
    }
  });
}

function requireText(value: string, field: string): void {
  if (value.trim() === "") {
    throw validation(`Inbound result field '${field}' is required`);
  }
}

function requireDate(value: string, field: string): void {
  if (Number.isNaN(Date.parse(value))) {
    throw validation(`Inbound result field '${field}' must be an ISO date`);
  }
}
