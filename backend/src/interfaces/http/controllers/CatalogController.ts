import type { Request, Response } from "express";
import type { GetAvailablePanelsUseCase } from "../../../application/catalog/GetAvailablePanelsUseCase";

export class CatalogController {
  public constructor(private readonly getPanels: GetAvailablePanelsUseCase) {}

  public listPanels = async (_req: Request, res: Response): Promise<void> => {
    const panels = await this.getPanels.execute();
    res.status(200).json({ panels });
  };
}
