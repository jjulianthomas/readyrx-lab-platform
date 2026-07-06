import type { ApplicationError } from "../../../application/common/ApplicationError";

export interface ErrorResponseBody {
  readonly code: string;
  readonly message: string;
}

export function statusForApplicationError(error: ApplicationError): number {
  if (error.kind === "not_found") {
    return 404;
  }
  if (error.kind === "conflict") {
    return 409;
  }
  if (error.kind === "validation") {
    return 400;
  }
  if (error.kind === "integration") {
    return 502;
  }
  return 500;
}

export function toErrorResponse(error: ApplicationError): ErrorResponseBody {
  return {
    code: error.kind,
    message: error.message
  };
}
