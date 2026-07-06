import type { LabIntegrationPort, LabOrderSubmission, LabResultPayload, LabSubmissionResult } from "../../../ports/integrations/LabIntegrationPort";
import type { NormalizedLabResult } from "../../../ports/integrations/NormalizedLabResult";
import { IntegrationFailure } from "../../../ports/integrations/IntegrationFailure";
import type { Clock } from "../../../ports/services/Clock";

export class MockLabAdapter implements LabIntegrationPort {
  public readonly integrationType = "MOCK" as const;

  public constructor(private readonly clock: Clock) {}

  public async submitOrder(
    submission: LabOrderSubmission
  ): Promise<LabSubmissionResult> {
    return {
      accepted: true,
      externalOrderId: `mock-${submission.order.id}`,
      accessionNumber: `MOCK-${submission.order.id.slice(-8)}`,
      submittedAt: this.clock.now()
    };
  }

  public async parseResult(payload: LabResultPayload): Promise<NormalizedLabResult> {
    if (payload.kind !== "MOCK") {
      throw new IntegrationFailure("Mock adapter requires mock payload");
    }

    return payload.result;
  }
}
