import type { LabTestPanel } from "../src/domain/catalog/LabTestPanel";
import type { AuditEvent } from "../src/domain/audit/AuditEvent";
import type { Biomarker } from "../src/domain/catalog/Biomarker";
import type { BiomarkerId, LabId, PatientId, TestPanelId } from "../src/domain/common/Identifiers";
import type { Lab } from "../src/domain/labs/Lab";
import type { LabOrder } from "../src/domain/orders/LabOrder";
import type { Patient } from "../src/domain/patients/Patient";
import type { LabResult } from "../src/domain/results/LabResult";
import type { AuditRepository } from "../src/ports/repositories/AuditRepository";
import type { LabOrderRepository } from "../src/ports/repositories/LabOrderRepository";
import type { LabRepository } from "../src/ports/repositories/LabRepository";
import type { LabResultRepository } from "../src/ports/repositories/LabResultRepository";
import type { PatientRepository } from "../src/ports/repositories/PatientRepository";
import type { TestCatalogRepository } from "../src/ports/repositories/TestCatalogRepository";
import type { Clock } from "../src/ports/services/Clock";
import type { IdGenerator } from "../src/ports/services/IdGenerator";

export const now = "2026-07-06T10:00:00.000Z";

export class FixedClock implements Clock {
  public now(): string {
    return now;
  }
}

export class SequentialIds implements IdGenerator {
  private next = 1;

  public create(prefix: string): string {
    const id = `${prefix}_${this.next}`;
    this.next += 1;
    return id;
  }
}

export class MemoryAuditRepository implements AuditRepository {
  public readonly events: AuditEvent[] = [];

  public async append(event: AuditEvent): Promise<void> {
    this.events.push(event);
  }
}

export class MemoryPatients implements PatientRepository {
  public constructor(private readonly patients: readonly Patient[]) {}

  public async findById(id: PatientId): Promise<Patient | undefined> {
    return this.patients.find((patient) => patient.id === id);
  }

  public async save(): Promise<void> {}
}

export class MemoryLabs implements LabRepository {
  public constructor(private readonly labs: readonly Lab[]) {}

  public async findById(id: LabId): Promise<Lab | undefined> {
    return this.labs.find((lab) => lab.id === id);
  }

  public async listActive(): Promise<readonly Lab[]> {
    return this.labs.filter((lab) => lab.active);
  }
}

export class MemoryOrders implements LabOrderRepository {
  public saved = 0;

  public constructor(private readonly orders: Map<string, LabOrder>) {}

  public async findById(id: string): Promise<LabOrder | undefined> {
    return this.orders.get(id);
  }

  public async findByIdempotencyKey(key: string): Promise<LabOrder | undefined> {
    return [...this.orders.values()].find((order) => order.idempotencyKey === key);
  }

  public async listByPatient(patientId: string): Promise<readonly LabOrder[]> {
    return [...this.orders.values()].filter((order) => order.patientId === patientId);
  }

  public async save(order: LabOrder): Promise<void> {
    this.saved += 1;
    this.orders.set(order.id, order);
  }
}

export class MemoryResults implements LabResultRepository {
  public saved = 0;

  public constructor(private readonly results: Map<string, LabResult>) {}

  public async findBySourceMessageId(id: string): Promise<LabResult | undefined> {
    return [...this.results.values()].find((result) => result.sourceMessageId === id);
  }

  public async listRecentByPatient(patientId: PatientId): Promise<readonly LabResult[]> {
    return [...this.results.values()].filter((result) => result.patientId === patientId);
  }

  public async listByPatientAndBiomarker(
    patientId: PatientId,
    biomarkerId: BiomarkerId
  ): Promise<readonly LabResult[]> {
    return [...this.results.values()].filter(
      (result) =>
        result.patientId === patientId &&
        result.biomarkers.some((item) => item.biomarkerId === biomarkerId)
    );
  }

  public async save(result: LabResult): Promise<void> {
    this.saved += 1;
    this.results.set(result.id, result);
  }
}

export class MemoryCatalog implements TestCatalogRepository {
  public constructor(private readonly panels: readonly LabTestPanel[]) {}

  public async findPanelById(id: TestPanelId): Promise<LabTestPanel | undefined> {
    return this.panels.find((panel) => panel.id === id);
  }

  public async findBiomarkerById(): Promise<Biomarker | undefined> {
    return undefined;
  }

  public async listPanels(): Promise<readonly LabTestPanel[]> {
    return this.panels;
  }

  public async findPanelsByIds(ids: readonly TestPanelId[]): Promise<readonly LabTestPanel[]> {
    return this.panels.filter((panel) => ids.includes(panel.id));
  }

  public async findBiomarkersByIds(): Promise<readonly Biomarker[]> {
    return [];
  }
}
