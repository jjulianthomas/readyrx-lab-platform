import type { IsoDateString } from "./Time";

export type SexApplicability = "female" | "male" | "intersex" | "unknown" | "all";

export interface UnitOfMeasure {
  /** UCUM unit code preferred for interoperability, such as mg/dL or ng/dL. */
  readonly code: string;
  /** Human-readable unit shown in the patient dashboard. */
  readonly display: string;
  /** Unit code system; UCUM is the expected default. */
  readonly system?: "UCUM" | "LOCAL";
}

export interface AgeRange {
  /** Inclusive lower age in years for this reference range. */
  readonly minYears?: number;
  /** Inclusive upper age in years for this reference range. */
  readonly maxYears?: number;
}

export interface ReferenceRange {
  /** Lower bound for normal range; absent means no lower bound applies. */
  readonly low?: number;
  /** Upper bound for normal range; absent means no upper bound applies. */
  readonly high?: number;
  /** Unit used by the numeric bounds. */
  readonly unit: string;
  /** Optional structured unit metadata for FHIR/UCUM mapping. */
  readonly unitOfMeasure?: UnitOfMeasure;
  /** Sex-at-birth applicability for clinical interpretation. */
  readonly appliesToSex?: SexApplicability;
  /** Age applicability for pediatric/adult ranges. */
  readonly appliesToAge?: AgeRange;
  /** Human-readable range text when numeric bounds are insufficient. */
  readonly text?: string;
  /** Date when this reference range became clinically valid. */
  readonly effectiveDate?: IsoDateString;
}

export interface LoincCoding {
  /** LOINC code used to normalize a biomarker across labs. */
  readonly code: string;
  /** Official or display-friendly LOINC name. */
  readonly display: string;
  /** LOINC system URI for FHIR Coding.system. */
  readonly system: "http://loinc.org";
}
