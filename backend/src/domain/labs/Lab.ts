import type { AuditMetadata } from "../common/AuditMetadata";
import type { ComplianceMetadata } from "../common/ComplianceMetadata";
import type { FirestoreDocumentMetadata } from "../common/FirestoreDocument";
import type { InteroperabilityIdentifiers, LabId, TestPanelId } from "../common/Identifiers";

export const LAB_INTEGRATION_TYPES = ["FHIR", "HL7", "MOCK"] as const;
export type LabIntegrationType = (typeof LAB_INTEGRATION_TYPES)[number];
export type LabStatus = "active" | "inactive" | "maintenance";

export interface LabEndpointConfig {
  /** FHIR or REST base URL when the lab supports HTTP integration. */
  readonly baseUrl?: string;
  /** HL7 MSH.5 receiving application for outbound messages. */
  readonly receivingApplication?: string;
  /** HL7 MSH.6 receiving facility for outbound messages. */
  readonly receivingFacility?: string;
}

export interface Lab extends FirestoreDocumentMetadata {
  /** Firestore document id for labs/{id}. */
  readonly id: LabId;
  /** Lab display name, such as Quest Diagnostics or LabCorp. */
  readonly name: string;
  /** Integration protocol used by this lab. */
  readonly integrationType: LabIntegrationType;
  /** Legacy boolean used by simple filters. */
  readonly active: boolean;
  /** Explicit lifecycle status for routing and operations. */
  readonly status?: LabStatus;
  /** Panel ids this lab accepts. */
  readonly supportedPanelIds: readonly TestPanelId[];
  /** FHIR Organization identifiers, HL7 HD identifiers, CLIA, and local ids. */
  readonly identifiers?: InteroperabilityIdentifiers;
  /** Legacy/simple external identifiers retained for compatibility. */
  readonly externalIds: InteroperabilityIdentifiers["external"];
  /** Endpoint metadata for the lab adapter. */
  readonly endpoint: LabEndpointConfig;
  /** Optional audit metadata for lab configuration changes. */
  readonly audit?: AuditMetadata;
  /** Optional compliance metadata for lab configuration documents. */
  readonly compliance?: ComplianceMetadata;
}
