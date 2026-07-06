import { describe, expect, it } from "vitest";
import { canTransitionOrderStatus } from "../src/domain/orders/LabOrderStatus";

describe("lab order status transitions", () => {
  it("allows the happy path from draft to final result", () => {
    expect(canTransitionOrderStatus("draft", "submitted")).toBe(true);
    expect(canTransitionOrderStatus("submitted", "accepted")).toBe(true);
    expect(canTransitionOrderStatus("accepted", "final_result")).toBe(true);
  });

  it("rejects reopening terminal states", () => {
    expect(canTransitionOrderStatus("cancelled", "submitted")).toBe(false);
    expect(canTransitionOrderStatus("failed", "accepted")).toBe(false);
  });
});
