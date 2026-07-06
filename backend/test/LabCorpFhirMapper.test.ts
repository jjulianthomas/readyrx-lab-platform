import { describe, expect, it } from "vitest";
import { LabCorpFhirMapper } from "../src/infrastructure/integrations/labcorp-fhir/LabCorpFhirMapper";

describe("LabCorpFhirMapper", () => {
  it("normalizes DiagnosticReport observations into biomarker results", () => {
    const mapper = new LabCorpFhirMapper();
    const result = mapper.fromDiagnosticReport({
      resourceType: "DiagnosticReport",
      id: "fhir-report-1",
      status: "final",
      patientId: "patient_001",
      labOrderId: "order_001",
      labId: "lab_labcorp",
      accessionNumber: "LC-123",
      collectedAt: "2025-01-01T10:00:00.000Z",
      resultedAt: "2025-01-01T12:00:00.000Z",
      observations: [
        {
          code: "18262-6",
          display: "LDL Cholesterol",
          value: 121,
          unit: "mg/dL",
          flag: "H",
          observedAt: "2025-01-01T10:00:00.000Z",
          referenceHigh: 100
        }
      ]
    });

    expect(result.sourceMessageId).toBe("fhir-report-1");
    expect(result.biomarkers[0]?.biomarkerId).toBe("biomarker_ldl");
    expect(result.biomarkers[0]?.flag).toBe("high");
  });
});
