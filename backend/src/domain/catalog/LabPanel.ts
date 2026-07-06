import type { AuditMetadata } from "../common/AuditMetadata";
import type { ComplianceMetadata } from "../common/ComplianceMetadata";
import type { FirestoreDocumentMetadata } from "../common/FirestoreDocument";
import type { BiomarkerId, LabId, LabPanelId } from "../common/Identifiers";

export type LabPanelStatus = "active" | "inactive" | "deprecated";

export interface LabPanelCode {
  /** Lab that owns this orderable code. */
  readonly labId: LabId;
  /** Lab-specific order code, used in FHIR ServiceRequest or HL7 OBR.4. */
  readonly code: string;
  /** Human-readable lab order code display. */
  readonly display: string;
  /** Optional FHIR CodeSystem URI for ServiceRequest.code. */
  readonly system?: string;
}

export interface SpecimenRequirement {
  /** Specimen type expected by the lab. */
  readonly specimenType: "blood" | "saliva" | "urine";
  /** Whether fasting is required before collection. */
  readonly fastingRequired: boolean;
  /** Optional collection container instructions. */
  readonly container?: string;
}

export interface LabPanel extends FirestoreDocumentMetadata {
  /** Firestore document id for labPanels/{id}. */
  readonly id: LabPanelId;
  /** Display name, such as Lipid Panel. */
  readonly name: string;
  /** Business description of what the panel measures. */
  readonly description: string;
  /** Catalog biomarker ids included in the panel. */
  readonly biomarkerIds: readonly BiomarkerId[];
  /** Labs that can perform this panel. */
  readonly supportedLabIds: readonly LabId[];
  /** Per-lab order codes because Quest and LabCorp differ. */
  readonly labCodes: readonly LabPanelCode[];
  /** Collection and fasting requirements for ordering UX. */
  readonly specimen: SpecimenRequirement;
  /** Current catalog lifecycle status. */
  readonly status?: LabPanelStatus;
  /** Audit metadata for panel catalog governance. */
  readonly audit?: AuditMetadata;
  /** Compliance metadata for catalog records. */
  readonly compliance?: ComplianceMetadata;
}
