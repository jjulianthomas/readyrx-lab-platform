import { IntegrationFailure } from "../../ports/integrations/IntegrationFailure";

export type ApplicationErrorKind =
  | "not_found"
  | "conflict"
  | "validation"
  | "integration"
  | "unexpected";

export class ApplicationError extends Error {
  public constructor(
    public readonly kind: ApplicationErrorKind,
    message: string
  ) {
    super(message);
    this.name = "ApplicationError";
  }
}

export function notFound(entity: string, id: string): ApplicationError {
  return new ApplicationError("not_found", `${entity} '${id}' was not found`);
}

export function conflict(message: string): ApplicationError {
  return new ApplicationError("conflict", message);
}

export function validation(message: string): ApplicationError {
  return new ApplicationError("validation", message);
}

export function unexpected(message: string): ApplicationError {
  return new ApplicationError("unexpected", message);
}

export function toApplicationError(error: unknown): ApplicationError {
  if (error instanceof ApplicationError) {
    return error;
  }

  if (error instanceof IntegrationFailure) {
    return new ApplicationError("integration", error.message);
  }

  if (error instanceof Error) {
    return unexpected(error.message);
  }

  return unexpected("Unexpected application error");
}
