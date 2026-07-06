import type { LabIntegrationPort, LabOrderSubmission, LabResultPayload, LabSubmissionResult } from "../../../ports/integrations/LabIntegrationPort";
import type { NormalizedLabResult } from "../../../ports/integrations/NormalizedLabResult";
import type { Hl7Mapper } from "../../../ports/mappers/Hl7Mapper";
import { IntegrationFailure } from "../../../ports/integrations/IntegrationFailure";
import type { Clock } from "../../../ports/services/Clock";

export class QuestHl7Adapter implements LabIntegrationPort {
  public readonly integrationType = "HL7" as const;

  public constructor(
    private readonly mapper: Hl7Mapper,
    private readonly clock: Clock
  ) {}

  public async submitOrder(
    submission: LabOrderSubmission
  ): Promise<LabSubmissionResult> {
    const message = this.mapper.toOrderMessage(
      submission.order,
      submission.patient,
      submission.lab,
      submission.panels
    );

    return {
      accepted: true,
      externalOrderId: `quest-${message.content.length}-${submission.order.id}`,
      accessionNumber: `Q-${submission.order.id.slice(-8)}`,
      submittedAt: this.clock.now()
    };
  }

  public async parseResult(payload: LabResultPayload): Promise<NormalizedLabResult> {
    if (payload.kind !== "HL7") {
      throw new IntegrationFailure("Quest adapter requires HL7 payload");
    }

    return this.mapResult(payload);
  }

  private mapResult(payload: Extract<LabResultPayload, { readonly kind: "HL7" }>) {
    try {
      return this.mapper.fromResultMessage(payload.message);
    } catch (error: unknown) {
      throw new IntegrationFailure(toMessage("Invalid HL7 result message", error));
    }
  }
}

function toMessage(prefix: string, error: unknown): string {
  return error instanceof Error ? `${prefix}: ${error.message}` : prefix;
}
