import type { BadgeTone, OrderStatus, ResultFlag, ResultStatus } from "./types";

export function orderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    draft: "Draft",
    submitted: "Submitted",
    accepted: "Accepted",
    in_progress: "In progress",
    partial_result: "Partial result",
    final_result: "Final result",
    amended: "Amended",
    failed: "Failed",
    cancelled: "Cancelled"
  };
  return labels[status];
}

export function resultStatusLabel(status: ResultStatus): string {
  const labels: Record<ResultStatus, string> = {
    partial: "Partial",
    final: "Final",
    amended: "Amended",
    cancelled: "Cancelled"
  };
  return labels[status];
}

export function orderStatusTone(status: OrderStatus): BadgeTone {
  if (status === "final_result") {
    return "success";
  }
  if (status === "accepted") {
    return "info";
  }
  if (status === "failed" || status === "cancelled") {
    return "danger";
  }
  return status === "submitted" || status === "in_progress" || status === "partial_result"
    ? "warning"
    : "neutral";
}

export function resultStatusTone(status: ResultStatus): BadgeTone {
  if (status === "final") {
    return "success";
  }
  return status === "cancelled" ? "danger" : "warning";
}

export function flagTone(flag: ResultFlag): BadgeTone {
  if (flag === "critical") {
    return "danger";
  }
  if (flag === "high" || flag === "low") {
    return "warning";
  }
  return "success";
}
