import { resolve } from "node:path";
import { AuditTrail } from "../application/audit/AuditTrail";
import { GetAvailablePanelsUseCase } from "../application/catalog/GetAvailablePanelsUseCase";
import { PanelSelector } from "../application/catalog/PanelSelector";
import { GetPatientDashboardUseCase } from "../application/dashboard/GetPatientDashboardUseCase";
import { CreateLabOrderUseCase } from "../application/orders/CreateLabOrderUseCase";
import { GetLabOrderUseCase } from "../application/orders/GetLabOrderUseCase";
import { SubmitLabOrderUseCase } from "../application/orders/SubmitLabOrderUseCase";
import { GetPatientBiomarkerHistoryUseCase } from "../application/results/GetPatientBiomarkerHistoryUseCase";
import { GetPatientHistoryUseCase } from "../application/results/GetPatientHistoryUseCase";
import { GetRecentLabResultsUseCase } from "../application/results/GetRecentLabResultsUseCase";
import { ReceiveLabResultUseCase } from "../application/results/ReceiveLabResultUseCase";
import { LabOrderService } from "../application/services/LabOrderService";
import { LabResultService } from "../application/services/LabResultService";
import { PatientHistoryService } from "../application/services/PatientHistoryService";
import type { AuditEvent } from "../domain/audit/AuditEvent";
import type { Biomarker } from "../domain/catalog/Biomarker";
import type { LabTestPanel } from "../domain/catalog/LabTestPanel";
import type { Lab } from "../domain/labs/Lab";
import type { LabOrder } from "../domain/orders/LabOrder";
import type { Patient } from "../domain/patients/Patient";
import type { LabResult } from "../domain/results/LabResult";
import { LabCorpFhirAdapter } from "../infrastructure/integrations/labcorp-fhir/LabCorpFhirAdapter";
import { LabCorpFhirMapper } from "../infrastructure/integrations/labcorp-fhir/LabCorpFhirMapper";
import { MockLabAdapter } from "../infrastructure/integrations/mock/MockLabAdapter";
import { QuestHl7Adapter } from "../infrastructure/integrations/quest-hl7/QuestHl7Adapter";
import { QuestHl7Mapper } from "../infrastructure/integrations/quest-hl7/QuestHl7Mapper";
import { StaticLabIntegrationRegistry } from "../infrastructure/integrations/StaticLabIntegrationRegistry";
import { ConsoleLogger } from "../infrastructure/observability/ConsoleLogger";
import { CryptoIdGenerator } from "../infrastructure/observability/CryptoIdGenerator";
import { SystemClock } from "../infrastructure/observability/SystemClock";
import { JsonAuditRepository } from "../infrastructure/persistence/json-firestore/JsonAuditRepository";
import { JsonCollection } from "../infrastructure/persistence/json-firestore/JsonCollection";
import { JsonLabOrderRepository } from "../infrastructure/persistence/json-firestore/JsonLabOrderRepository";
import { JsonLabRepository } from "../infrastructure/persistence/json-firestore/JsonLabRepository";
import { JsonLabResultRepository } from "../infrastructure/persistence/json-firestore/JsonLabResultRepository";
import { JsonPatientRepository } from "../infrastructure/persistence/json-firestore/JsonPatientRepository";
import { JsonTestCatalogRepository } from "../infrastructure/persistence/json-firestore/JsonTestCatalogRepository";
import { CatalogController } from "../interfaces/http/controllers/CatalogController";
import { LabOrderController } from "../interfaces/http/controllers/LabOrderController";
import { PatientController } from "../interfaces/http/controllers/PatientController";
import { WebhookController } from "../interfaces/http/controllers/WebhookController";
import type { Logger } from "../ports/services/Logger";

export interface AppContainer {
  readonly logger: Logger;
  readonly catalogController: CatalogController;
  readonly labOrderController: LabOrderController;
  readonly patientController: PatientController;
  readonly webhookController: WebhookController;
}

export function buildContainer(): AppContainer {
  const dataDir = process.env.LAB_PLATFORM_DATA_DIR ?? seedDataDir();
  const logger = new ConsoleLogger();
  const clock = new SystemClock();
  const ids = new CryptoIdGenerator();

  const patients = new JsonPatientRepository(collection<Patient>(dataDir, "patients"));
  const labs = new JsonLabRepository(collection<Lab>(dataDir, "labs"));
  const catalog = new JsonTestCatalogRepository(
    collection<LabTestPanel>(dataDir, "testPanels"),
    collection<Biomarker>(dataDir, "biomarkers")
  );
  const orders = new JsonLabOrderRepository(collection<LabOrder>(dataDir, "labOrders"));
  const results = new JsonLabResultRepository(
    collection<LabResult>(dataDir, "labResults")
  );
  const audits = new JsonAuditRepository(
    collection<AuditEvent>(dataDir, "auditEvents")
  );

  const auditTrail = new AuditTrail(audits, ids, clock);
  const panelSelector = new PanelSelector(catalog);
  const integrations = new StaticLabIntegrationRegistry([
    new LabCorpFhirAdapter(new LabCorpFhirMapper(), clock),
    new QuestHl7Adapter(new QuestHl7Mapper(), clock),
    new MockLabAdapter(clock)
  ]);

  return {
    logger,
    catalogController: new CatalogController(new GetAvailablePanelsUseCase(catalog)),
    labOrderController: new LabOrderController(
      new LabOrderService(
        new CreateLabOrderUseCase(
          patients,
          labs,
          orders,
          panelSelector,
          auditTrail,
          ids,
          clock
        ),
        new SubmitLabOrderUseCase(
          orders,
          patients,
          labs,
          panelSelector,
          integrations,
          auditTrail,
          clock
        ),
        new GetLabOrderUseCase(orders)
      )
    ),
    patientController: new PatientController(
      new PatientHistoryService(
        new GetPatientHistoryUseCase(patients, orders, results),
        new GetPatientBiomarkerHistoryUseCase(results, catalog),
        new GetRecentLabResultsUseCase(patients, results),
        new GetPatientDashboardUseCase(patients, orders, results, labs, catalog)
      )
    ),
    webhookController: new WebhookController(
      new LabResultService(
        new ReceiveLabResultUseCase(
          labs,
          orders,
          results,
          integrations,
          auditTrail,
          ids,
          clock
        )
      )
    )
  };
}

function seedDataDir(): string {
  return resolve(process.cwd(), "src/infrastructure/persistence/json-firestore/data");
}

function collection<TDocument extends { readonly id: string }>(
  dataDir: string,
  name: string
): JsonCollection<TDocument> {
  return new JsonCollection<TDocument>(resolve(dataDir, `${name}.json`));
}
