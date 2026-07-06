import { z } from "zod";

export const createLabOrderRequestSchema = z.object({
  patientId: z.string().min(1),
  labId: z.string().min(1),
  panelIds: z.array(z.string().min(1)).min(1),
  orderingProvider: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    npi: z.string().regex(/^\d{10}$/u, "NPI must be exactly 10 digits")
  }),
  billingType: z.enum(["insurance", "self_pay", "employer"]),
  idempotencyKey: z.string().min(8).max(128)
});

export type CreateLabOrderRequestDto = z.infer<
  typeof createLabOrderRequestSchema
>;

export interface LabOrderItemResponseDto {
  readonly panelId: string;
  readonly labPanelCode: string;
}

export interface LabOrderResponseDto {
  readonly id: string;
  readonly patientId: string;
  readonly labId: string;
  readonly status: string;
  readonly items: readonly LabOrderItemResponseDto[];
  readonly billingType: string;
  readonly accessionNumber?: string;
  readonly externalOrderId?: string;
  readonly submittedAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
