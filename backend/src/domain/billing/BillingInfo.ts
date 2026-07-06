import type { PayerId } from "../common/Identifiers";

export type BillingType = "insurance" | "self_pay" | "employer";
export type BillingStatus = "pending" | "verified" | "submitted" | "paid" | "denied";

export interface InsuranceSubscriber {
  /** Subscriber name used by payer eligibility systems. */
  readonly name: string;
  /** Subscriber date of birth as ISO date. */
  readonly birthDate: string;
  /** Relationship between patient and subscriber. */
  readonly relationshipToPatient: "self" | "spouse" | "child" | "other";
}

export interface BillingInfo {
  /** Payment responsibility model for the order. */
  readonly type: BillingType;
  /** Current billing workflow status. */
  readonly status: BillingStatus;
  /** Optional payer id for insurance or employer billing. */
  readonly payerId?: PayerId;
  /** Payer display name, useful for denormalized Firestore reads. */
  readonly payerName?: string;
  /** Insurance member id; omit for self-pay. */
  readonly memberId?: string;
  /** Insurance group number; omit when not supplied. */
  readonly groupNumber?: string;
  /** Subscriber details when payer requires subscriber identity. */
  readonly subscriber?: InsuranceSubscriber;
  /** Whether benefits or payment responsibility were verified. */
  readonly verified: boolean;
}
