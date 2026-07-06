import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApplicationError } from "../../../application/common/ApplicationError";
import type { Logger } from "../../../ports/services/Logger";
import {
  statusForApplicationError,
  toErrorResponse
} from "./applicationErrorHttp";

export function createErrorHandler(logger: Logger) {
  return (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void => {
    if (error instanceof ZodError) {
      res.status(400).json({
        ok: false,
        error: {
          code: "validation",
          message: "Request validation failed",
          issues: error.issues
        }
      });
      return;
    }

    if (error instanceof ApplicationError) {
      res.status(statusForApplicationError(error)).json({
        ok: false,
        error: toErrorResponse(error)
      });
      return;
    }

    logger.error("Unhandled request error", {
      message: error instanceof Error ? error.message : "Unknown error"
    });
    res.status(500).json({
      ok: false,
      error: {
        code: "internal",
        message: "Unexpected server error"
      }
    });
  };
}
