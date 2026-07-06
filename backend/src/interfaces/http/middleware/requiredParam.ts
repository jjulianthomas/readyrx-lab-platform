import type { Request } from "express";
import { validation } from "../../../application/common/ApplicationError";

export function requiredParam(req: Request, name: string): string {
  const value = req.params[name];

  if (value === undefined || value.trim() === "") {
    throw validation(`Route parameter '${name}' is required`);
  }

  return value;
}
