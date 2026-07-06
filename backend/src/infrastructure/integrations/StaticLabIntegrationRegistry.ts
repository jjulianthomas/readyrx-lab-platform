import type { Lab } from "../../domain/labs/Lab";
import { IntegrationFailure } from "../../ports/integrations/IntegrationFailure";
import type { LabIntegrationPort } from "../../ports/integrations/LabIntegrationPort";
import type { LabIntegrationRegistry } from "../../ports/integrations/LabIntegrationRegistry";

export class StaticLabIntegrationRegistry implements LabIntegrationRegistry {
  public constructor(
    private readonly adapters: readonly LabIntegrationPort[]
  ) {}

  public getForLab(lab: Lab): LabIntegrationPort {
    const adapter = this.adapters.find(
      (candidate) => candidate.integrationType === lab.integrationType
    );

    if (adapter === undefined) {
      throw new IntegrationFailure(`No adapter registered for '${lab.integrationType}'`);
    }

    return adapter;
  }
}
