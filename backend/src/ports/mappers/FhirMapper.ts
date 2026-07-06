import type { LabTestPanel } from "../../domain/catalog/LabTestPanel";
import type { Lab } from "../../domain/labs/Lab";
import type { LabOrder } from "../../domain/orders/LabOrder";
import type { Patient } from "../../domain/patients/Patient";
import type { NormalizedLabResult } from "../integrations/NormalizedLabResult";

export interface FhirObservationPayload {
  readonly code: string;
  readonly display: string;
  readonly value: number;
  readonly unit: string;
  readonly flag: string;
  readonly observedAt: string;
  readonly referenceLow?: number;
  readonly referenceHigh?: number;
}

export interface FhirDiagnosticReportPayload {
  readonly resourceType: "DiagnosticReport";
  readonly id: string;
  readonly status: "partial" | "final" | "amended" | "cancelled";
  readonly patientId: string;
  readonly labOrderId: string;
  readonly labId: string;
  readonly accessionNumber: string;
  readonly collectedAt: string;
  readonly resultedAt: string;
  readonly observations: readonly FhirObservationPayload[];
}

export interface FhirServiceRequestPayload {
  readonly resourceType: "ServiceRequest";
  readonly identifier: string;
  readonly status: "active";
  readonly intent: "order";
  readonly subject: string;
  readonly requester: string;
  readonly performer: string;
  readonly codes: readonly string[];
}

export interface FhirMapper {
  toServiceRequest(
    order: LabOrder,
    patient: Patient,
    lab: Lab,
    panels: readonly LabTestPanel[]
  ): FhirServiceRequestPayload;
  fromDiagnosticReport(report: FhirDiagnosticReportPayload): NormalizedLabResult;
}
