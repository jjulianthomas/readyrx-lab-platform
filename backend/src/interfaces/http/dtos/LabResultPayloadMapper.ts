import type { ResultReferenceRange } from "../../../domain/results/LabResult";
import type { LabResultPayload } from "../../../ports/integrations/LabIntegrationPort";
import type { FhirObservationPayload } from "../../../ports/mappers/FhirMapper";
import type { ReceiveLabResultRequestDto } from "./LabResultDtos";

type FhirResultDto = Extract<
  ReceiveLabResultRequestDto,
  { readonly kind: "FHIR" }
>;

type MockResultDto = Extract<
  ReceiveLabResultRequestDto,
  { readonly kind: "MOCK" }
>;

type FhirObservationDto = FhirResultDto["report"]["observations"][number];
type MockBiomarkerDto = MockResultDto["result"]["biomarkers"][number];

export function toLabResultPayload(
  dto: ReceiveLabResultRequestDto
): LabResultPayload {
  if (dto.kind === "FHIR") {
    return {
      kind: "FHIR",
      report: {
        ...dto.report,
        observations: dto.report.observations.map(toFhirObservation)
      }
    };
  }

  if (dto.kind === "MOCK") {
    return {
      kind: "MOCK",
      result: {
        ...dto.result,
        biomarkers: dto.result.biomarkers.map((biomarker) => ({
          ...biomarker,
          referenceRange: toReferenceRange(biomarker.referenceRange)
        }))
      }
    };
  }

  return dto;
}

function toFhirObservation(dto: FhirObservationDto): FhirObservationPayload {
  return {
    code: dto.code,
    display: dto.display,
    value: dto.value,
    unit: dto.unit,
    flag: dto.flag,
    observedAt: dto.observedAt,
    ...optionalNumber("referenceLow", dto.referenceLow),
    ...optionalNumber("referenceHigh", dto.referenceHigh)
  };
}

function toReferenceRange(
  dto: MockBiomarkerDto["referenceRange"]
): ResultReferenceRange {
  return {
    unit: dto.unit,
    ...optionalNumber("low", dto.low),
    ...optionalNumber("high", dto.high)
  };
}

function optionalNumber<TKey extends string>(
  key: TKey,
  value: number | undefined
): Partial<Record<TKey, number>> {
  return value === undefined ? {} : ({ [key]: value } as Record<TKey, number>);
}
