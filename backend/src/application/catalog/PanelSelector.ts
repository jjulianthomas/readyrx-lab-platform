import type { LabTestPanel } from "../../domain/catalog/LabTestPanel";
import type { TestPanelId } from "../../domain/common/Identifiers";
import type { Lab } from "../../domain/labs/Lab";
import type { TestCatalogRepository } from "../../ports/repositories/TestCatalogRepository";
import { validation } from "../common/ApplicationError";

export interface SelectedLabPanel {
  readonly panel: LabTestPanel;
  readonly labPanelCode: string;
}

export class PanelSelector {
  public constructor(private readonly catalog: TestCatalogRepository) {}

  public async selectForLab(
    lab: Lab,
    panelIds: readonly TestPanelId[]
  ): Promise<readonly SelectedLabPanel[]> {
    const uniqueIds = [...new Set(panelIds)];

    if (uniqueIds.length === 0) {
      throw validation("At least one test panel is required");
    }

    const panels = await this.catalog.findPanelsByIds(uniqueIds);
    const missing = uniqueIds.filter(
      (id) => !panels.some((panel) => panel.id === id)
    );

    if (missing.length > 0) {
      throw validation(`Unknown test panels: ${missing.join(", ")}`);
    }

    return panels.map((panel) => {
      const code = panel.labCodes.find((item) => item.labId === lab.id);
      const isSupported =
        lab.supportedPanelIds.includes(panel.id) &&
        panel.supportedLabIds.includes(lab.id) &&
        code !== undefined;

      if (!isSupported || code === undefined) {
        throw validation(`Lab '${lab.name}' does not support '${panel.name}'`);
      }

      return { panel, labPanelCode: code.code };
    });
  }
}
