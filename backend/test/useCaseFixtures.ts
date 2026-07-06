import { AuditTrail } from "../src/application/audit/AuditTrail";
import { PanelSelector } from "../src/application/catalog/PanelSelector";
import type { LabTestPanel } from "../src/domain/catalog/LabTestPanel";
import type { Lab } from "../src/domain/labs/Lab";
import type { LabOrder } from "../src/domain/orders/LabOrder";
import type { Patient } from "../src/domain/patients/Patient";
import type { LabResult } from "../src/domain/results/LabResult";
import type { NormalizedLabResult } from "../src/ports/integrations/NormalizedLabResult";
import {
  FixedClock,
  MemoryAuditRepository,
  MemoryCatalog,
  MemoryLabs,
  MemoryOrders,
  MemoryPatients,
  SequentialIds,
  now
} from "./repositoryTestDoubles";

export const context = {
  actor: { id: "provider_1", role: "provider" as const },
  correlationId: "corr_1"
};

export function createSetup() {
  const ids = new SequentialIds();
  const clock = new FixedClock();
  const patient = createPatient();
  const lab = createLab();
  const panel = createPanel();
  const catalog = new MemoryCatalog([panel]);
  return {
    ids,
    clock,
    patient,
    lab,
    panel,
    patients: new MemoryPatients([patient]),
    labs: new MemoryLabs([lab]),
    orders: new MemoryOrders(new Map()),
    selector: new PanelSelector(catalog),
    audit: new AuditTrail(new MemoryAuditRepository(), ids, clock)
  };
}

export function createPatient(): Patient {
  return {
    id: "patient_1",
    name: { given: "Ava", family: "Nguyen" },
    birthDate: "1988-01-01",
    sexAtBirth: "female",
    contact: { email: "ava@example.com" },
    externalIds: [],
    consent: { labOrdering: true, resultSharing: true, clinicalInsights: true },
    createdAt: now,
    updatedAt: now
  };
}

export function createLab(): Lab {
  return {
    id: "lab_1",
    name: "Lab One",
    integrationType: "FHIR",
    active: true,
    supportedPanelIds: ["panel_lipid"],
    externalIds: [],
    endpoint: { baseUrl: "https://lab.example.test" },
    createdAt: now,
    updatedAt: now
  };
}

export function createPanel(): LabTestPanel {
  return {
    id: "panel_lipid",
    name: "Lipid Panel",
    description: "Lipid markers",
    biomarkerIds: ["biomarker_ldl"],
    supportedLabIds: ["lab_1"],
    labCodes: [{ labId: "lab_1", code: "LP-1", display: "Lipid Panel" }],
    specimen: { specimenType: "blood", fastingRequired: true },
    createdAt: now,
    updatedAt: now
  };
}

export function createOrder(input: Pick<LabOrder, "status">): LabOrder {
  return {
    id: "order_1",
    patientId: "patient_1",
    labId: "lab_1",
    status: input.status,
    items: [{ panelId: "panel_lipid", labPanelCode: "LP-1" }],
    orderingProvider: { id: "provider_1", name: "Dr. Lee", npi: "1234567890" },
    billingType: "self_pay",
    idempotencyKey: "idem_order_1",
    createdAt: now,
    updatedAt: now
  };
}

export function createNormalizedResult(): NormalizedLabResult {
  return {
    labOrderId: "order_1",
    patientId: "patient_1",
    labId: "lab_1",
    status: "final",
    accessionNumber: "ACC-1",
    sourceMessageId: "message_1",
    collectedAt: now,
    resultedAt: now,
    biomarkers: [createBiomarkerResult()]
  };
}

export function createResult(): LabResult {
  return {
    id: "result_1",
    ...createNormalizedResult(),
    receivedAt: now,
    createdAt: now,
    updatedAt: now
  };
}

function createBiomarkerResult() {
  return {
    biomarkerId: "biomarker_ldl",
    displayName: "LDL Cholesterol",
    value: 121,
    unit: "mg/dL",
    flag: "high" as const,
    sourceCode: "18262-6",
    loincCode: "18262-6",
    observedAt: now,
    referenceRange: { high: 100, unit: "mg/dL" }
  };
}
