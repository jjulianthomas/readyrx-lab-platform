import { z } from "zod";

const fhirObservationSchema = z.object({
  code: z.string().min(1),
  display: z.string().min(1),
  value: z.number(),
  unit: z.string().min(1),
  flag: z.string(),
  observedAt: z.string().datetime(),
  referenceLow: z.number().optional(),
  referenceHigh: z.number().optional()
});

const fhirDiagnosticReportSchema = z.object({
  resourceType: z.literal("DiagnosticReport"),
  id: z.string().min(1),
  status: z.enum(["partial", "final", "amended", "cancelled"]),
  patientId: z.string().min(1),
  labOrderId: z.string().min(1),
  labId: z.string().min(1),
  accessionNumber: z.string().min(1),
  collectedAt: z.string().datetime(),
  resultedAt: z.string().datetime(),
  observations: z.array(fhirObservationSchema).min(1)
});

const normalizedBiomarkerSchema = z.object({
  biomarkerId: z.string().min(1),
  displayName: z.string().min(1),
  value: z.number(),
  unit: z.string().min(1),
  flag: z.enum(["low", "normal", "high", "critical", "unknown"]),
  sourceCode: z.string().min(1),
  observedAt: z.string().datetime(),
  referenceRange: z.object({
    low: z.number().optional(),
    high: z.number().optional(),
    unit: z.string().min(1)
  })
});

const normalizedResultSchema = z.object({
  labOrderId: z.string().min(1),
  patientId: z.string().min(1),
  labId: z.string().min(1),
  status: z.enum(["partial", "final", "amended", "cancelled"]),
  accessionNumber: z.string().min(1),
  sourceMessageId: z.string().min(1),
  collectedAt: z.string().datetime(),
  resultedAt: z.string().datetime(),
  biomarkers: z.array(normalizedBiomarkerSchema).min(1)
});

export const receiveLabResultRequestSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("FHIR"), report: fhirDiagnosticReportSchema }),
  z.object({
    kind: z.literal("HL7"),
    message: z.object({
      messageType: z.literal("ORU"),
      content: z.string().min(1)
    })
  }),
  z.object({ kind: z.literal("MOCK"), result: normalizedResultSchema })
]);

export type ReceiveLabResultRequestDto = z.infer<
  typeof receiveLabResultRequestSchema
>;

export interface BiomarkerResultResponseDto {
  readonly biomarkerId: string;
  readonly displayName: string;
  readonly value: number;
  readonly unit: string;
  readonly flag: string;
  readonly sourceCode: string;
  readonly observedAt: string;
  readonly referenceRange: {
    readonly low?: number;
    readonly high?: number;
    readonly unit: string;
  };
}

export interface LabResultResponseDto {
  readonly id: string;
  readonly labOrderId: string;
  readonly patientId: string;
  readonly labId: string;
  readonly status: string;
  readonly accessionNumber: string;
  readonly sourceMessageId: string;
  readonly collectedAt: string;
  readonly resultedAt: string;
  readonly receivedAt: string;
  readonly biomarkers: readonly BiomarkerResultResponseDto[];
}
