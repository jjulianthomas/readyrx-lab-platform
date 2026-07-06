import type { Request, Response } from "express";
import type { LabResultService } from "../../../application/services/LabResultService";
import { parseBody } from "../../../infrastructure/validation/parseBody";
import { toLabResultPayload } from "../dtos/LabResultPayloadMapper";
import { receiveLabResultRequestSchema } from "../dtos/LabResultDtos";
import { getRequestContext } from "../middleware/requestContext";
import { requiredParam } from "../middleware/requiredParam";
import { toLabResultResponse } from "../presenters/LabResultPresenter";
import { sendResult } from "../presenters/ResultResponder";

export class WebhookController {
  public constructor(private readonly results: LabResultService) {}

  public receiveLabResult = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const labId = requiredParam(req, "labId");
    const body = parseBody(receiveLabResultRequestSchema, req.body as unknown);
    const result = await this.results.receive({
      labId,
      payload: toLabResultPayload(body),
      context: getRequestContext(req)
    });

    sendResult(res, result, 202, toLabResultResponse);
  };
}
