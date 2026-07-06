import type {
  BiomarkerId,
  LabId,
  LabOrderId,
  PatientId
} from "../../domain/common/Identifiers";
import type { IsoDateTimeString } from "../../domain/common/Time";
import type {
  BiomarkerResult,
  LabResultStatus
} from "../../domain/results/LabResult";

export interface NormalizedBiomarkerResult extends BiomarkerResult {
  readonly biomarkerId: BiomarkerId;
}

export interface NormalizedLabResult {
  readonly labOrderId: LabOrderId;
  readonly patientId: PatientId;
  readonly labId: LabId;
  readonly status: LabResultStatus;
  readonly accessionNumber: string;
  readonly sourceMessageId: string;
  readonly collectedAt: IsoDateTimeString;
  readonly resultedAt: IsoDateTimeString;
  readonly biomarkers: readonly NormalizedBiomarkerResult[];
}
