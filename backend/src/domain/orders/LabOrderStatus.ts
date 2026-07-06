export const LAB_ORDER_STATUSES = [
  "draft",
  "submitted",
  "accepted",
  "in_progress",
  "partial_result",
  "final_result",
  "amended",
  "failed",
  "cancelled"
] as const;

export type LabOrderStatus = (typeof LAB_ORDER_STATUSES)[number];

const allowedTransitions: Record<LabOrderStatus, readonly LabOrderStatus[]> = {
  draft: ["submitted", "cancelled"],
  submitted: ["accepted", "failed", "cancelled"],
  accepted: ["in_progress", "partial_result", "final_result", "failed", "cancelled"],
  in_progress: ["partial_result", "final_result", "failed", "cancelled"],
  partial_result: ["final_result", "amended"],
  final_result: ["amended"],
  amended: ["amended"],
  failed: [],
  cancelled: []
};

export function canTransitionOrderStatus(
  from: LabOrderStatus,
  to: LabOrderStatus
): boolean {
  return allowedTransitions[from].includes(to);
}
