import type { AuditMetadata } from "../common/AuditMetadata";
import type { LoincCoding, ReferenceRange, UnitOfMeasure } from "../common/ClinicalCoding";
import type { ComplianceMetadata } from "../common/ComplianceMetadata";
import type { FirestoreDocumentMetadata } from "../common/FirestoreDocument";
import type { BiomarkerId } from "../common/Identifiers";

export type ResultUnit = string;
export type BiomarkerStatus = "active" | "deprecated" | "lab_only";
export type { ReferenceRange };

export interface Biomarker extends FirestoreDocumentMetadata {
  /** Firestore document id for biomarkers/{id}. */
  readonly id: BiomarkerId;
  /** Patient/provider display name, such as LDL Cholesterol. */
  readonly displayName: string;
  /** Legacy LOINC code string retained for simple lookups. */
  readonly loincCode?: string;
  /** Structured LOINC coding for FHIR Observation.code. */
  readonly loinc?: LoincCoding;
  /** Legacy unit string retained for dashboard and compatibility. */
  readonly defaultUnit: ResultUnit;
  /** Structured unit metadata, preferably UCUM. */
  readonly unitOfMeasure?: UnitOfMeasure;
  /** Clinical category used for grouping and dashboard filtering. */
  readonly category: string;
  /** Current catalog lifecycle status. */
  readonly status?: BiomarkerStatus;
  /** Normal/abnormal interpretation ranges by sex, age, and unit. */
  readonly referenceRanges: readonly ReferenceRange[];
  /** Lab-specific aliases or local codes that map to this biomarker. */
  readonly sourceCodes?: readonly string[];
  /** Audit metadata for catalog governance. */
  readonly audit?: AuditMetadata;
  /** Compliance metadata for catalog records. */
  readonly compliance?: ComplianceMetadata;
}
