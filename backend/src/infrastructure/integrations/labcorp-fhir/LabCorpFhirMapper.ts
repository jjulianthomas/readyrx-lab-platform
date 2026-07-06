import type { LabTestPanel } from "../../../domain/catalog/LabTestPanel";
import type { Lab } from "../../../domain/labs/Lab";
import type { LabOrder } from "../../../domain/orders/LabOrder";
import type { Patient } from "../../../domain/patients/Patient";
import type {
  FhirDiagnosticReportPayload,
  FhirMapper,
  FhirServiceRequestPayload
} from "../../../ports/mappers/FhirMapper";
import type { NormalizedLabResult } from "../../../ports/integrations/NormalizedLabResult";
import { resolveBiomarkerCode } from "../BiomarkerCodeMap";
import { makeReferenceRange, normalizeResultFlag } from "../ResultFlagNormalizer";

export class LabCorpFhirMapper implements FhirMapper {
  public toServiceRequest(
    order: LabOrder,
    patient: Patient,
    lab: Lab,
    panels: readonly LabTestPanel[]
  ): FhirServiceRequestPayload {
    return {
      resourceType: "ServiceRequest",
      identifier: order.id,
      status: "active",
      intent: "order",
      subject: patient.id,
      requester: order.orderingProvider.npi,
      performer: lab.id,
      codes: panels.map((panel) => getPanelCode(panel, lab))
    };
  }

  public fromDiagnosticReport(
    report: FhirDiagnosticReportPayload
  ): NormalizedLabResult {
    return {
      labOrderId: report.labOrderId,
      patientId: report.patientId,
      labId: report.labId,
      status: report.status,
      accessionNumber: report.accessionNumber,
      sourceMessageId: report.id,
      collectedAt: report.collectedAt,
      resultedAt: report.resultedAt,
      biomarkers: report.observations.map((observation) => {
        const mapping = resolveBiomarkerCode(observation.code, observation.display);

        return {
          biomarkerId: mapping.biomarkerId,
          displayName: mapping.displayName,
          value: observation.value,
          unit: observation.unit,
          flag: normalizeResultFlag(observation.flag),
          sourceCode: observation.code,
          observedAt: observation.observedAt,
          referenceRange: makeReferenceRange(
            observation.unit,
            observation.referenceLow,
            observation.referenceHigh
          )
        };
      })
    };
  }
}

function getPanelCode(panel: LabTestPanel, lab: Lab): string {
  return panel.labCodes.find((code) => code.labId === lab.id)?.code ?? panel.id;
}
