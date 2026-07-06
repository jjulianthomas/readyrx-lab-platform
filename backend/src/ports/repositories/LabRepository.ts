import type { LabId } from "../../domain/common/Identifiers";
import type { Lab } from "../../domain/labs/Lab";

export interface LabRepository {
  findById(id: LabId): Promise<Lab | undefined>;
  listActive(): Promise<readonly Lab[]>;
}
