import type { Lab } from "../../domain/labs/Lab";
import type { LabIntegrationPort } from "./LabIntegrationPort";

export interface LabIntegrationRegistry {
  getForLab(lab: Lab): LabIntegrationPort;
}
