import type { LabIntegrationPort, LabOrderSubmission, LabResultPayload, LabSubmissionResult } from "../../../ports/integrations/LabIntegrationPort";
import type { NormalizedLabResult } from "../../../ports/integrations/NormalizedLabResult";
import type { FhirMapper } from "../../../ports/mappers/FhirMapper";
import { IntegrationFailure } from "../../../ports/integrations/IntegrationFailure";
import type { Clock } from "../../../ports/services/Clock";

export class LabCorpFhirAdapter implements LabIntegrationPort {
  public readonly integrationType = "FHIR" as const;

  public constructor(
    private readonly mapper: FhirMapper,
    private readonly clock: Clock
  ) {}

  public async submitOrder(
    submission: LabOrderSubmission
  ): Promise<LabSubmissionResult> {
    const serviceRequest = this.mapper.toServiceRequest(
      submission.order,
      submission.patient,
      submission.lab,
      submission.panels
    );

    return {
      accepted: true,
      externalOrderId: `labcorp-${serviceRequest.identifier}`,
      accessionNumber: `LC-${serviceRequest.identifier.slice(-8)}`,
      submittedAt: this.clock.now()
    };
  }

  public async parseResult(payload: LabResultPayload): Promise<NormalizedLabResult> {
    if (payload.kind !== "FHIR") {
      throw new IntegrationFailure("LabCorp adapter requires FHIR payload");
    }

    return this.mapResult(payload);
  }

  private mapResult(payload: Extract<LabResultPayload, { readonly kind: "FHIR" }>) {
    try {
      return this.mapper.fromDiagnosticReport(payload.report);
    } catch (error: unknown) {
      throw new IntegrationFailure(toMessage("Invalid FHIR result payload", error));
    }
  }
}

function toMessage(prefix: string, error: unknown): string {
  return error instanceof Error ? `${prefix}: ${error.message}` : prefix;
}
