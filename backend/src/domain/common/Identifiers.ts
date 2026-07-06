export type PatientId = string;
export type LabId = string;
export type LabOrderId = string;
export type LabResultId = string;
export type BiomarkerId = string;
export type TestPanelId = string;
export type LabPanelId = TestPanelId;
export type AuditEventId = string;
export type ProviderId = string;
export type PayerId = string;
export type AccessionNumber = string;

/** Generic external identifier for Firestore JSON documents. */
export interface ExternalIdentifier {
  /** Naming system, such as NPI, CLIA, MRN, LOINC, or a lab-specific namespace. */
  readonly system: string;
  /** Identifier value assigned by the naming system. */
  readonly value: string;
  /** Optional identifier use, aligned with FHIR Identifier.use when known. */
  readonly use?: "usual" | "official" | "temp" | "secondary" | "old";
}

export interface FhirIdentifier {
  /** FHIR Identifier.system URI, for example http://hl7.org/fhir/sid/us-npi. */
  readonly system: string;
  /** FHIR Identifier.value used to match records across systems. */
  readonly value: string;
  /** Optional FHIR Identifier.type coding code, such as MR, NPI, or PLAC. */
  readonly typeCode?: string;
  /** Optional FHIR Identifier.use value for operational semantics. */
  readonly use?: "usual" | "official" | "temp" | "secondary" | "old";
}

export interface Hl7Identifier {
  /** HL7 HD namespace ID, commonly the assigning application or facility. */
  readonly namespaceId: string;
  /** HL7 entity identifier, such as CX.1, EI.1, or placer/filler order value. */
  readonly entityId: string;
  /** Optional universal ID from HL7 HD.2. */
  readonly universalId?: string;
  /** Optional universal ID type from HL7 HD.3, such as ISO or UUID. */
  readonly universalIdType?: string;
}

export interface InteroperabilityIdentifiers {
  /** FHIR identifiers persisted exactly enough to rebuild external references. */
  readonly fhir: readonly FhirIdentifier[];
  /** HL7 identifiers persisted for v2 placer, filler, patient, and lab matching. */
  readonly hl7: readonly Hl7Identifier[];
  /** Other identifiers not cleanly represented by FHIR or HL7 structures. */
  readonly external: readonly ExternalIdentifier[];
}
