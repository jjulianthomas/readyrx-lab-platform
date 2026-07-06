# Domain Model Guide

The domain models are Firestore-friendly JSON documents. Dates are ISO strings,
references are document ids, and version fields support migrations and optimistic
concurrency without relying on database-specific runtime types.

## Shared Fields

| Field | Explanation |
| --- | --- |
| `id` | Firestore document id duplicated in the document body for JSON export and tests. |
| `schemaVersion` | Version of the document shape for future migrations. |
| `recordVersion` | Monotonic version for optimistic concurrency and audit diffs. |
| `createdAt` | ISO timestamp when the document was created. |
| `updatedAt` | ISO timestamp when the document was last updated. |
| `deletedAt` | Optional soft-delete timestamp; absent means active. |
| `identifiers.fhir` | FHIR `Identifier` values used to rebuild external references. |
| `identifiers.hl7` | HL7 v2 identifiers such as CX, EI, placer, and filler ids. |
| `identifiers.external` | Other identifiers such as CLIA, MRN, NPI, or lab-local ids. |
| `audit` | Embedded document-level audit metadata. |
| `compliance` | PHI, consent, retention, and legal-hold metadata. |

## Patient

Stored as `patients/{patientId}`.

| Field | Explanation |
| --- | --- |
| `name` | Legal name for FHIR `Patient.name` and HL7 `PID.5`. |
| `birthDate` | ISO date for identity matching and reference range selection. |
| `sexAtBirth` | Clinical sex used by lab reference ranges and HL7 `PID.8`. |
| `status` | Patient lifecycle: active, inactive, deceased, or merged. |
| `contact` | Email and optional phone for operational communication. |
| `externalIds` | Legacy flat identifiers retained for compatibility. |
| `consent` | Lab ordering, result sharing, and clinical insight consent flags. |

## Provider

Stored as `providers/{providerId}`.

| Field | Explanation |
| --- | --- |
| `name` | Provider name used in requisitions and audit trails. |
| `npi` | National Provider Identifier for FHIR requester and HL7 `ORC.12`. |
| `status` | Whether the provider is eligible to order. |
| `credentials` | Licenses or credentials such as MD, DO, NP, PA, or PharmD. |
| `organizationId` | Optional clinic or organization under which the provider orders. |

## Lab

Stored as `labs/{labId}`.

| Field | Explanation |
| --- | --- |
| `name` | Lab display name such as LabCorp or Quest Diagnostics. |
| `integrationType` | Protocol used by the lab: FHIR, HL7, or MOCK. |
| `active` | Simple compatibility flag for accepting orders. |
| `status` | Operational lifecycle: active, inactive, or maintenance. |
| `supportedPanelIds` | Lab panels this lab can perform. |
| `endpoint` | FHIR base URL or HL7 receiving application/facility metadata. |

## LabPanel

Stored as `labPanels/{labPanelId}`.

| Field | Explanation |
| --- | --- |
| `name` | Display name such as Lipid Panel. |
| `description` | Human-readable purpose of the panel. |
| `biomarkerIds` | Biomarkers measured by this panel. |
| `supportedLabIds` | Labs that can perform this panel. |
| `labCodes` | Lab-specific order codes for FHIR `ServiceRequest.code` or HL7 `OBR.4`. |
| `specimen` | Specimen type, fasting requirement, and optional container. |
| `status` | Catalog lifecycle: active, inactive, or deprecated. |

## Biomarker

Stored as `biomarkers/{biomarkerId}`.

| Field | Explanation |
| --- | --- |
| `displayName` | Name shown to providers and patients. |
| `loincCode` | Legacy LOINC string for quick lookup. |
| `loinc` | Structured LOINC coding for FHIR `Observation.code`. |
| `defaultUnit` | Default display unit such as `mg/dL`. |
| `unitOfMeasure` | Structured UCUM/local unit metadata. |
| `category` | Clinical group such as lipid, hormone, or metabolic. |
| `status` | Catalog lifecycle status. |
| `referenceRanges` | Normal ranges by unit, age, sex, text, and effective date. |
| `sourceCodes` | Lab-local aliases that normalize to this biomarker. |

## LabOrder

Stored as `labOrders/{labOrderId}`.

| Field | Explanation |
| --- | --- |
| `patientId` | Patient receiving the order. |
| `labId` | Performing lab used for routing. |
| `status` | Current order state from draft through final result/cancelled/failed. |
| `items` | Requested panels and lab-specific panel codes. |
| `orderingProvider` | Provider snapshot including NPI at order time. |
| `billingType` | Legacy simple billing type. |
| `billingInfo` | Structured payer, member, subscriber, and verification data. |
| `idempotencyKey` | Client key that prevents duplicate order creation. |
| `accessionNumber` | Legacy primary accession number. |
| `accessionNumbers` | All accession numbers assigned by labs. |
| `externalOrderId` | Lab-returned order id. |
| `submittedAt` | ISO timestamp when the order was sent to the lab. |
| `statusHistory` | Append-only status transition history. |

## LabResult

Stored as `labResults/{labResultId}`.

| Field | Explanation |
| --- | --- |
| `labOrderId` | Order fulfilled or amended by this result. |
| `patientId` | Patient used for result authorization and history queries. |
| `labId` | Performing lab that emitted the result. |
| `status` | Partial, final, amended, or cancelled report status. |
| `accessionNumber` | Primary accession number. |
| `accessionNumbers` | All accession numbers present in the report. |
| `sourceMessageId` | External FHIR/HL7 message id for idempotent ingestion. |
| `collectedAt` | ISO specimen collection timestamp. |
| `resultedAt` | ISO lab result timestamp. |
| `receivedAt` | ISO timestamp when the platform received the result. |
| `biomarkers` | Normalized observation values, units, LOINC, flags, and ranges. |
| `amendedResultId` | Prior result document amended by this result. |

## AuditMetadata, BillingInfo, ComplianceMetadata

| Model | Explanation |
| --- | --- |
| `AuditMetadata` | Tracks who created/updated a document, actor type, correlation id, source IP, and recorded timestamp. |
| `BillingInfo` | Captures payment type, billing status, payer/member details, subscriber details, and verification flag. |
| `ComplianceMetadata` | Captures PHI classification, consent state, retention policy, legal hold, and review date. |
