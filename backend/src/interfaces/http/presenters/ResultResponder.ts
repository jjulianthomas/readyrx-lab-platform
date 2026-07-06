import type { Response } from "express";
import type { Result } from "../../../application/common/Result";
import {
  statusForApplicationError,
  toErrorResponse
} from "../middleware/applicationErrorHttp";

export function sendResult<TValue>(
  res: Response,
  result: Result<TValue>,
  successStatus: number,
  mapValue: (value: TValue) => unknown
): void {
  if (result.ok) {
    res.status(successStatus).json({
      ok: true,
      data: mapValue(result.value)
    });
    return;
  }

  res.status(statusForApplicationError(result.error)).json({
    ok: false,
    error: toErrorResponse(result.error)
  });
}
