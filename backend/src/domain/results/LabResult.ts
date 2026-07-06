import type { AuditMetadata } from "../common/AuditMetadata";
import type { LoincCoding, UnitOfMeasure } from "../common/ClinicalCoding";
import type { ComplianceMetadata } from "../common/ComplianceMetadata";
import type { FirestoreDocumentMetadata } from "../common/FirestoreDocument";
import type {
  AccessionNumber,
  BiomarkerId,
  LabId,
  LabOrderId,
  LabResultId,
  PatientId
} from "../common/Identifiers";
import type { InteroperabilityIdentifiers } from "../common/Identifiers";
import type { IsoDateTimeString } from "../common/Time";

export type ResultFlag = "low" | "normal" | "high" | "critical" | "unknown";
export type LabResultStatus = "partial" | "final" | "amended" | "cancelled";
export type ObservationStatus = "preliminary" | "final" | "amended" | "cancelled";

export interface ResultReferenceRange {
  /** Lower normal bound for this specific reported observation. */
  readonly low?: number;
  /** Upper normal bound for this specific reported observation. */
  readonly high?: number;
  /** Unit used by low/high bounds. */
  readonly unit: string;
  /** Optional structured unit metadata, preferably UCUM. */
  readonly unitOfMeasure?: UnitOfMeasure;
  /** Human-readable lab range text when bounds are not numeric. */
  readonly text?: string;
}

export interface BiomarkerResult {
  /** Internal biomarker catalog id. */
  readonly biomarkerId: BiomarkerId;
  /** Display name sent to UI and audit summaries. */
  readonly displayName: string;
  /** Numeric result value after normalization. */
  readonly value: number;
  /** Reported unit, such as mg/dL. */
  readonly unit: string;
  /** Structured unit metadata for FHIR Quantity.system/code. */
  readonly unitOfMeasure?: UnitOfMeasure;
  /** Normal/abnormal interpretation normalized from FHIR/HL7. */
  readonly flag: ResultFlag;
  /** Lab source code, often LOINC or a lab-local code. */
  readonly sourceCode: string;
  /** LOINC code when known for this observation. */
  readonly loincCode?: string;
  /** Structured LOINC coding for FHIR Observation.code. */
  readonly loinc?: LoincCoding;
  /** FHIR Observation.id, HL7 OBX set id, or other observation id. */
  readonly sourceObservationId?: string;
  /** Status of this individual observation. */
  readonly status?: ObservationStatus;
  /** ISO timestamp when the specimen/result was observed. */
  readonly observedAt: IsoDateTimeString;
  /** Reference range used by the lab for this result. */
  readonly referenceRange: ResultReferenceRange;
}

export interface ResultAccession {
  /** Accession number associated with this result report. */
  readonly value: AccessionNumber;
  /** Lab that assigned the accession number. */
  readonly labId: LabId;
}

export interface LabResult extends FirestoreDocumentMetadata {
  /** Firestore document id for labResults/{id}. */
  readonly id: LabResultId;
  /** Lab order this result fulfills or amends. */
  readonly labOrderId: LabOrderId;
  /** Patient id for history and authorization queries. */
  readonly patientId: PatientId;
  /** Performing lab that produced the result. */
  readonly labId: LabId;
  /** Overall report status: partial, final, amended, or cancelled. */
  readonly status: LabResultStatus;
  /** Legacy primary accession number for simple queries. */
  readonly accessionNumber: string;
  /** All accession numbers present in the inbound report. */
  readonly accessionNumbers?: readonly ResultAccession[];
  /** Unique external message id used for idempotent result ingestion. */
  readonly sourceMessageId: string;
  /** FHIR DiagnosticReport/Observation ids, HL7 MSH/OBR ids, and local ids. */
  readonly identifiers?: InteroperabilityIdentifiers;
  /** ISO timestamp when specimen was collected. */
  readonly collectedAt: IsoDateTimeString;
  /** ISO timestamp when lab finalized or emitted the result. */
  readonly resultedAt: IsoDateTimeString;
  /** ISO timestamp when the platform received the result. */
  readonly receivedAt: IsoDateTimeString;
  /** Normalized biomarker observations contained in the report. */
  readonly biomarkers: readonly BiomarkerResult[];
  /** Optional prior result id when this result amends another result. */
  readonly amendedResultId?: LabResultId;
  /** Embedded audit metadata for result document changes. */
  readonly audit?: AuditMetadata;
  /** Compliance metadata for PHI, retention, and consent policy. */
  readonly compliance?: ComplianceMetadata;
}
