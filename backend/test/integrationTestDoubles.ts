import type { LabIntegrationPort, LabOrderSubmission, LabResultPayload, LabSubmissionResult } from "../src/ports/integrations/LabIntegrationPort";
import type { LabIntegrationRegistry } from "../src/ports/integrations/LabIntegrationRegistry";
import type { NormalizedLabResult } from "../src/ports/integrations/NormalizedLabResult";
import { now } from "./repositoryTestDoubles";

export class StubLabAdapter implements LabIntegrationPort {
  public readonly integrationType = "FHIR";
  public submissions: LabOrderSubmission[] = [];

  public constructor(private readonly normalized?: NormalizedLabResult) {}

  public async submitOrder(submission: LabOrderSubmission): Promise<LabSubmissionResult> {
    this.submissions.push(submission);
    return {
      accepted: true,
      externalOrderId: "external_1",
      accessionNumber: "ACC-1",
      submittedAt: now
    };
  }

  public async parseResult(_payload: LabResultPayload): Promise<NormalizedLabResult> {
    if (this.normalized === undefined) {
      throw new Error("No normalized result configured");
    }
    return this.normalized;
  }
}

export class SingleAdapterRegistry implements LabIntegrationRegistry {
  public constructor(private readonly adapter: LabIntegrationPort) {}

  public getForLab(): LabIntegrationPort {
    return this.adapter;
  }
}
