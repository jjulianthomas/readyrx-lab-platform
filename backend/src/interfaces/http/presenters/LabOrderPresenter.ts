import type { LabOrder } from "../../../domain/orders/LabOrder";
import type { LabOrderResponseDto } from "../dtos/LabOrderDtos";

export function toLabOrderResponse(order: LabOrder): LabOrderResponseDto {
  return {
    id: order.id,
    patientId: order.patientId,
    labId: order.labId,
    status: order.status,
    items: order.items.map((item) => ({
      panelId: item.panelId,
      labPanelCode: item.labPanelCode
    })),
    billingType: order.billingType,
    ...optional("accessionNumber", order.accessionNumber),
    ...optional("externalOrderId", order.externalOrderId),
    ...optional("submittedAt", order.submittedAt),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
}

function optional<TKey extends string>(
  key: TKey,
  value: string | undefined
): Partial<Record<TKey, string>> {
  return value === undefined ? {} : { [key]: value } as Record<TKey, string>;
}
