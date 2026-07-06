import { Router } from "express";
import type { AppContainer } from "./container";
import { asyncHandler } from "../interfaces/http/middleware/asyncHandler";

export function createRoutes(container: AppContainer): Router {
  const router = Router();
  const catalog = container.catalogController;
  const orders = container.labOrderController;
  const patients = container.patientController;
  const webhooks = container.webhookController;

  router.get("/catalog/panels", asyncHandler(catalog.listPanels));
  router.post("/lab-orders", asyncHandler(orders.create));
  router.get("/lab-orders/:orderId", asyncHandler(orders.get));
  router.post("/lab-orders/:orderId/submit", asyncHandler(orders.submit));
  router.post(
    "/webhooks/labs/:labId/results",
    asyncHandler(webhooks.receiveLabResult)
  );
  router.post(
    "/labs/:labId/results",
    asyncHandler(webhooks.receiveLabResult)
  );
  router.get(
    "/patients/:patientId/dashboard",
    asyncHandler(patients.dashboard)
  );
  router.get(
    "/patients/:patientId/history",
    asyncHandler(patients.history)
  );
  router.get(
    "/patients/:patientId/results/recent",
    asyncHandler(patients.recentResults)
  );
  router.get(
    "/patients/:patientId/biomarkers/:biomarkerId/history",
    asyncHandler(patients.biomarkerHistory)
  );

  return router;
}
