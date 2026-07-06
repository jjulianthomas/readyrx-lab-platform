import type { LabTestPanel } from "../../domain/catalog/LabTestPanel";
import type { Lab } from "../../domain/labs/Lab";
import type { LabOrder } from "../../domain/orders/LabOrder";
import type { Patient } from "../../domain/patients/Patient";
import type { NormalizedLabResult } from "../integrations/NormalizedLabResult";

export interface Hl7OrderMessage {
  readonly messageType: "ORM";
  readonly content: string;
}

export interface Hl7ResultMessage {
  readonly messageType: "ORU";
  readonly content: string;
}

export interface Hl7Mapper {
  toOrderMessage(
    order: LabOrder,
    patient: Patient,
    lab: Lab,
    panels: readonly LabTestPanel[]
  ): Hl7OrderMessage;
  fromResultMessage(message: Hl7ResultMessage): NormalizedLabResult;
}
