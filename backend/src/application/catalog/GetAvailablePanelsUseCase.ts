import type { LabTestPanel } from "../../domain/catalog/LabTestPanel";
import type { TestCatalogRepository } from "../../ports/repositories/TestCatalogRepository";

export class GetAvailablePanelsUseCase {
  public constructor(private readonly catalog: TestCatalogRepository) {}

  public async execute(): Promise<readonly LabTestPanel[]> {
    return this.catalog.listPanels();
  }
}
