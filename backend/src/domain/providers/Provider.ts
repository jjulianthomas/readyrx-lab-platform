import type { AuditMetadata } from "../common/AuditMetadata";
import type { ComplianceMetadata } from "../common/ComplianceMetadata";
import type { FirestoreDocumentMetadata } from "../common/FirestoreDocument";
import type { InteroperabilityIdentifiers, ProviderId } from "../common/Identifiers";

export type ProviderStatus = "active" | "inactive" | "suspended";

export interface ProviderCredential {
  /** Credential type, such as MD, DO, NP, PA, or PharmD. */
  readonly type: string;
  /** State or authority issuing the credential. */
  readonly issuer: string;
  /** License or credential number. */
  readonly value: string;
}

export interface Provider extends FirestoreDocumentMetadata {
  /** Firestore document id for providers/{id}. */
  readonly id: ProviderId;
  /** Provider display/legal name for orders and audit trails. */
  readonly name: string;
  /** National Provider Identifier used in FHIR requester and HL7 ORC.12. */
  readonly npi: string;
  /** Current lifecycle status for ordering eligibility. */
  readonly status: ProviderStatus;
  /** Ordering credentials and licenses. */
  readonly credentials: readonly ProviderCredential[];
  /** FHIR Practitioner identifiers, HL7 XCN identifiers, and local ids. */
  readonly identifiers: InteroperabilityIdentifiers;
  /** Optional organization or clinic id the provider orders under. */
  readonly organizationId?: string;
  /** Firestore-friendly audit metadata. */
  readonly audit?: AuditMetadata;
  /** Compliance metadata for provider-related PHI or PII. */
  readonly compliance?: ComplianceMetadata;
}
