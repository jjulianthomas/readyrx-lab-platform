import type { LabTestPanel } from "../../domain/catalog/LabTestPanel";
import type { Lab } from "../../domain/labs/Lab";
import type { LabOrder } from "../../domain/orders/LabOrder";
import type { Patient } from "../../domain/patients/Patient";
import type { FhirDiagnosticReportPayload } from "../mappers/FhirMapper";
import type { Hl7ResultMessage } from "../mappers/Hl7Mapper";
import type { NormalizedLabResult } from "./NormalizedLabResult";

export type LabResultPayload =
  | { readonly kind: "FHIR"; readonly report: FhirDiagnosticReportPayload }
  | { readonly kind: "HL7"; readonly message: Hl7ResultMessage }
  | { readonly kind: "MOCK"; readonly result: NormalizedLabResult };

export interface LabOrderSubmission {
  readonly order: LabOrder;
  readonly patient: Patient;
  readonly lab: Lab;
  readonly panels: readonly LabTestPanel[];
}

export interface LabSubmissionResult {
  readonly accepted: boolean;
  readonly externalOrderId: string;
  readonly accessionNumber: string;
  readonly submittedAt: string;
}

export interface LabIntegrationPort {
  readonly integrationType: Lab["integrationType"];
  submitOrder(submission: LabOrderSubmission): Promise<LabSubmissionResult>;
  parseResult(payload: LabResultPayload): Promise<NormalizedLabResult>;
}
