import type { AuditMetadata } from "../common/AuditMetadata";
import type { ComplianceMetadata } from "../common/ComplianceMetadata";
import type { FirestoreDocumentMetadata } from "../common/FirestoreDocument";
import type { InteroperabilityIdentifiers, PatientId } from "../common/Identifiers";
import type { IsoDateString } from "../common/Time";

export type SexAtBirth = "female" | "male" | "intersex" | "unknown";
export type PatientStatus = "active" | "inactive" | "deceased" | "merged";

export interface HumanName {
  /** Patient legal given name used for lab requisitions. */
  readonly given: string;
  /** Patient legal family name used for matching inbound results. */
  readonly family: string;
  /** Optional middle or additional names for identity matching. */
  readonly middle?: string;
}

export interface PatientContact {
  /** Email for patient notifications; PHI-safe messaging rules apply. */
  readonly email: string;
  /** Optional phone number in E.164 or display format. */
  readonly phone?: string;
}

export interface ConsentProfile {
  /** Patient consent to place lab orders. */
  readonly labOrdering: boolean;
  /** Patient consent to share lab results with authorized providers. */
  readonly resultSharing: boolean;
  /** Patient consent for clinical insight features. */
  readonly clinicalInsights: boolean;
}

export interface Patient extends FirestoreDocumentMetadata {
  /** Firestore document id for patients/{id}. */
  readonly id: PatientId;
  /** Legal patient name used by FHIR Patient.name and HL7 PID.5. */
  readonly name: HumanName;
  /** ISO birth date used for identity matching and reference ranges. */
  readonly birthDate: IsoDateString;
  /** Sex at birth used by lab reference ranges and HL7 PID.8. */
  readonly sexAtBirth: SexAtBirth;
  /** Current lifecycle status of the patient record. */
  readonly status?: PatientStatus;
  /** Contact channels for operational communication. */
  readonly contact: PatientContact;
  /** FHIR, HL7, and local identifiers for interoperability matching. */
  readonly identifiers?: InteroperabilityIdentifiers;
  /** Legacy/simple external identifiers retained for compatibility. */
  readonly externalIds: InteroperabilityIdentifiers["external"];
  /** Patient consent flags relevant to labs, results, and clinical insights. */
  readonly consent: ConsentProfile;
  /** Embedded audit metadata for Firestore document-level traceability. */
  readonly audit?: AuditMetadata;
  /** Embedded compliance metadata for access, retention, and PHI policy. */
  readonly compliance?: ComplianceMetadata;
}
