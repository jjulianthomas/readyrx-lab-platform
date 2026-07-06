import type { Request, Response } from "express";
import type { LabOrderService } from "../../../application/services/LabOrderService";
import { parseBody } from "../../../infrastructure/validation/parseBody";
import { createLabOrderRequestSchema } from "../dtos/LabOrderDtos";
import { getRequestContext } from "../middleware/requestContext";
import { requiredParam } from "../middleware/requiredParam";
import { toLabOrderResponse } from "../presenters/LabOrderPresenter";
import { sendResult } from "../presenters/ResultResponder";

export class LabOrderController {
  public constructor(private readonly orders: LabOrderService) {}

  public create = async (req: Request, res: Response): Promise<void> => {
    const body = parseBody(createLabOrderRequestSchema, req.body as unknown);
    const result = await this.orders.create({
      ...body,
      context: getRequestContext(req)
    });

    sendResult(res, result, 201, toLabOrderResponse);
  };

  public submit = async (req: Request, res: Response): Promise<void> => {
    const orderId = requiredParam(req, "orderId");
    const result = await this.orders.submit({
      orderId,
      context: getRequestContext(req)
    });

    sendResult(res, result, 200, toLabOrderResponse);
  };

  public get = async (req: Request, res: Response): Promise<void> => {
    const orderId = requiredParam(req, "orderId");
    const result = await this.orders.get(orderId);
    sendResult(res, result, 200, toLabOrderResponse);
  };
}
