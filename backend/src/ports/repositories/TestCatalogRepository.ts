import type {
  BiomarkerId,
  TestPanelId
} from "../../domain/common/Identifiers";
import type { Biomarker } from "../../domain/catalog/Biomarker";
import type { LabTestPanel } from "../../domain/catalog/LabTestPanel";

export interface TestCatalogRepository {
  findPanelById(id: TestPanelId): Promise<LabTestPanel | undefined>;
  findBiomarkerById(id: BiomarkerId): Promise<Biomarker | undefined>;
  listPanels(): Promise<readonly LabTestPanel[]>;
  findPanelsByIds(ids: readonly TestPanelId[]): Promise<readonly LabTestPanel[]>;
  findBiomarkersByIds(ids: readonly BiomarkerId[]): Promise<readonly Biomarker[]>;
}
