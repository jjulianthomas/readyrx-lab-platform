import type { ApplicationError } from "./ApplicationError";
import { toApplicationError } from "./ApplicationError";

export type Result<TValue> = Success<TValue> | Failure;

export interface Success<TValue> {
  readonly ok: true;
  readonly value: TValue;
}

export interface Failure {
  readonly ok: false;
  readonly error: ApplicationError;
}

export function success<TValue>(value: TValue): Result<TValue> {
  return { ok: true, value };
}

export function failure<TValue = never>(error: ApplicationError): Result<TValue> {
  return { ok: false, error };
}

export async function resultFrom<TValue>(
  action: () => Promise<TValue>
): Promise<Result<TValue>> {
  try {
    return success(await action());
  } catch (error: unknown) {
    return failure(toApplicationError(error));
  }
}
