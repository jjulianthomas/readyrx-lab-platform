import type { Request, Response } from "express";
import type { PatientHistoryService } from "../../../application/services/PatientHistoryService";
import { requiredParam } from "../middleware/requiredParam";
import { toBiomarkerHistoryResponse } from "../presenters/BiomarkerHistoryPresenter";
import { toLabResultResponse } from "../presenters/LabResultPresenter";
import { toPatientDashboardResponse } from "../presenters/PatientDashboardPresenter";
import { toPatientHistoryResponse } from "../presenters/PatientHistoryPresenter";
import { sendResult } from "../presenters/ResultResponder";

export class PatientController {
  public constructor(private readonly historyService: PatientHistoryService) {}

  public history = async (req: Request, res: Response): Promise<void> => {
    const patientId = requiredParam(req, "patientId");
    const result = await this.historyService.fullHistory(patientId);
    sendResult(res, result, 200, toPatientHistoryResponse);
  };

  public dashboard = async (req: Request, res: Response): Promise<void> => {
    const patientId = requiredParam(req, "patientId");
    const result = await this.historyService.dashboard(patientId);
    sendResult(res, result, 200, toPatientDashboardResponse);
  };

  public biomarkerHistory = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const patientId = requiredParam(req, "patientId");
    const biomarkerId = requiredParam(req, "biomarkerId");
    const result = await this.historyService.biomarkerHistory(
      patientId,
      biomarkerId
    );
    sendResult(res, result, 200, toBiomarkerHistoryResponse);
  };

  public recentResults = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const patientId = requiredParam(req, "patientId");
    const result = await this.historyService.recentResults(patientId);
    sendResult(res, result, 200, (results) => ({
      results: results.map(toLabResultResponse)
    }));
  };
}
