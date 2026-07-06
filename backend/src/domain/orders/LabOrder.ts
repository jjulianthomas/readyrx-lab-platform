import type { BillingInfo, BillingType } from "../billing/BillingInfo";
import type { AuditMetadata } from "../common/AuditMetadata";
import type { ComplianceMetadata } from "../common/ComplianceMetadata";
import type { FirestoreDocumentMetadata } from "../common/FirestoreDocument";
import type {
  AccessionNumber,
  LabId,
  LabOrderId,
  PatientId,
  ProviderId,
  TestPanelId
} from "../common/Identifiers";
import type { InteroperabilityIdentifiers } from "../common/Identifiers";
import type { IsoDateTimeString } from "../common/Time";
import type { LabOrderStatus } from "./LabOrderStatus";

export type { BillingType };

export interface OrderingProvider {
  /** Provider Firestore id used for authorization and joins. */
  readonly id: ProviderId;
  /** Provider display name snapshotted at order time. */
  readonly name: string;
  /** National Provider Identifier used in FHIR and HL7 order messages. */
  readonly npi: string;
}

export interface LabOrderItem {
  /** Internal panel catalog id requested by the provider. */
  readonly panelId: TestPanelId;
  /** Lab-specific panel/order code sent to the performing lab. */
  readonly labPanelCode: string;
  /** Optional lab-specific display text for requisitions. */
  readonly labPanelDisplay?: string;
}

export interface LabOrderStatusChange {
  /** Status after this transition. */
  readonly status: LabOrderStatus;
  /** ISO timestamp when the status changed. */
  readonly changedAt: IsoDateTimeString;
  /** Actor id, integration name, or system process that changed status. */
  readonly changedBy: string;
  /** Human-readable reason, useful for failed or cancelled orders. */
  readonly reason?: string;
}

export interface LabOrderAccession {
  /** Accession number assigned by the performing lab. */
  readonly value: AccessionNumber;
  /** Lab that assigned this accession number. */
  readonly labId: LabId;
  /** ISO timestamp when the platform learned the accession number. */
  readonly assignedAt: IsoDateTimeString;
}

export interface LabOrder extends FirestoreDocumentMetadata {
  /** Firestore document id for labOrders/{id}. */
  readonly id: LabOrderId;
  /** Patient id receiving the lab order. */
  readonly patientId: PatientId;
  /** Performing lab id used to route the order. */
  readonly labId: LabId;
  /** Current order lifecycle status. */
  readonly status: LabOrderStatus;
  /** Ordered panels with lab-specific codes. */
  readonly items: readonly LabOrderItem[];
  /** Provider snapshot for legally traceable ordering. */
  readonly orderingProvider: OrderingProvider;
  /** Legacy billing type retained for compatibility and simple reads. */
  readonly billingType: BillingType;
  /** Structured billing metadata for payer and self-pay workflows. */
  readonly billingInfo?: BillingInfo;
  /** Client-generated key that prevents duplicate order creation. */
  readonly idempotencyKey: string;
  /** Legacy primary accession number for simple lookups. */
  readonly accessionNumber?: string;
  /** All accession numbers associated with the order. */
  readonly accessionNumbers?: readonly LabOrderAccession[];
  /** External order id returned by the lab integration. */
  readonly externalOrderId?: string;
  /** FHIR identifiers, HL7 placer/filler ids, and local external ids. */
  readonly identifiers?: InteroperabilityIdentifiers;
  /** ISO timestamp when the order was submitted to the lab. */
  readonly submittedAt?: IsoDateTimeString;
  /** Complete status transition history for auditability. */
  readonly statusHistory?: readonly LabOrderStatusChange[];
  /** Embedded audit metadata for document changes. */
  readonly audit?: AuditMetadata;
  /** Compliance metadata for PHI, consent, and retention policy. */
  readonly compliance?: ComplianceMetadata;
}
