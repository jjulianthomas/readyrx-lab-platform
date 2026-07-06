import type {
  BiomarkerId,
  TestPanelId
} from "../../../domain/common/Identifiers";
import type { Biomarker } from "../../../domain/catalog/Biomarker";
import type { LabTestPanel } from "../../../domain/catalog/LabTestPanel";
import type { TestCatalogRepository } from "../../../ports/repositories/TestCatalogRepository";
import type { JsonCollection } from "./JsonCollection";

export class JsonTestCatalogRepository implements TestCatalogRepository {
  public constructor(
    private readonly panels: JsonCollection<LabTestPanel>,
    private readonly biomarkers: JsonCollection<Biomarker>
  ) {}

  public async findPanelById(id: TestPanelId): Promise<LabTestPanel | undefined> {
    return this.panels.findById(id);
  }

  public async findBiomarkerById(id: BiomarkerId): Promise<Biomarker | undefined> {
    return this.biomarkers.findById(id);
  }

  public async listPanels(): Promise<readonly LabTestPanel[]> {
    return this.panels.all();
  }

  public async findPanelsByIds(ids: readonly TestPanelId[]): Promise<readonly LabTestPanel[]> {
    const panels = await this.panels.all();
    return panels.filter((panel) => ids.includes(panel.id));
  }

  public async findBiomarkersByIds(ids: readonly BiomarkerId[]): Promise<readonly Biomarker[]> {
    const biomarkers = await this.biomarkers.all();
    return biomarkers.filter((biomarker) => ids.includes(biomarker.id));
  }
}
