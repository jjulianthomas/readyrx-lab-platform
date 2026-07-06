import type { IsoDateString } from "./Time";

export type DataClassification = "phi" | "pii" | "operational" | "deidentified";

export interface ComplianceMetadata {
  /** Classification used for access controls and logging decisions. */
  readonly dataClassification: DataClassification;
  /** Whether HIPAA-regulated PHI is present in this document. */
  readonly containsPhi: boolean;
  /** Whether patient consent exists for lab ordering. */
  readonly labOrderingConsent: boolean;
  /** Whether patient consent exists for result sharing. */
  readonly resultSharingConsent: boolean;
  /** Whether patient consent exists for clinical insight features. */
  readonly clinicalInsightsConsent: boolean;
  /** Retention policy key, such as clinical-record-7-years. */
  readonly retentionPolicy: string;
  /** Optional legal hold flag that prevents deletion workflows. */
  readonly legalHold?: boolean;
  /** Date when consent/compliance metadata was last reviewed. */
  readonly reviewedOn?: IsoDateString;
}
