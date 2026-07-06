import { describe, expect, it } from "vitest";
import { CreateLabOrderUseCase } from "../src/application/orders/CreateLabOrderUseCase";
import { SubmitLabOrderUseCase } from "../src/application/orders/SubmitLabOrderUseCase";
import { ReceiveLabResultUseCase } from "../src/application/results/ReceiveLabResultUseCase";
import { SingleAdapterRegistry, StubLabAdapter } from "./integrationTestDoubles";
import { MemoryOrders, MemoryResults } from "./repositoryTestDoubles";
import {
  context,
  createNormalizedResult,
  createOrder,
  createResult,
  createSetup
} from "./useCaseFixtures";

describe("application use cases", () => {
  it("creates a lab order once for an idempotency key", async () => {
    const setup = createSetup();
    const useCase = new CreateLabOrderUseCase(
      setup.patients,
      setup.labs,
      setup.orders,
      setup.selector,
      setup.audit,
      setup.ids,
      setup.clock
    );

    const command = {
      patientId: setup.patient.id,
      labId: setup.lab.id,
      panelIds: [setup.panel.id],
      orderingProvider: { id: "provider_1", name: "Dr. Lee", npi: "1234567890" },
      billingType: "self_pay" as const,
      idempotencyKey: "idem_1",
      context
    };

    const first = await useCase.execute(command);
    const second = await useCase.execute(command);

    expect(first.id).toBe(second.id);
    expect(setup.orders.saved).toBe(1);
    expect(first.items).toEqual([{ panelId: setup.panel.id, labPanelCode: "LP-1" }]);
  });

  it("submits an order through the lab integration adapter", async () => {
    const setup = createSetup();
    const order = createOrder({ status: "draft" });
    const orders = new MemoryOrders(new Map([[order.id, order]]));
    const adapter = new StubLabAdapter();
    const useCase = new SubmitLabOrderUseCase(
      orders,
      setup.patients,
      setup.labs,
      setup.selector,
      new SingleAdapterRegistry(adapter),
      setup.audit,
      setup.clock
    );

    const submitted = await useCase.execute({ orderId: order.id, context });

    expect(adapter.submissions).toHaveLength(1);
    expect(adapter.submissions[0]?.panels[0]?.id).toBe(setup.panel.id);
    expect(submitted.status).toBe("accepted");
    expect(submitted.accessionNumber).toBe("ACC-1");
    expect(orders.saved).toBe(1);
  });

  it("returns an existing lab result when the source message was already received", async () => {
    const setup = createSetup();
    const order = createOrder({ status: "accepted" });
    const existing = createResult();
    const adapter = new StubLabAdapter(createNormalizedResult());
    const orders = new MemoryOrders(new Map([[order.id, order]]));
    const results = new MemoryResults(new Map([[existing.id, existing]]));
    const useCase = new ReceiveLabResultUseCase(
      setup.labs,
      orders,
      results,
      new SingleAdapterRegistry(adapter),
      setup.audit,
      setup.ids,
      setup.clock
    );

    const received = await useCase.execute({
      labId: setup.lab.id,
      payload: { kind: "MOCK", result: createNormalizedResult() },
      context
    });

    expect(received.id).toBe(existing.id);
    expect(results.saved).toBe(0);
    expect(orders.saved).toBe(0);
  });
});
