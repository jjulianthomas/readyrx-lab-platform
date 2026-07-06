import { randomUUID } from "node:crypto";
import type { Request } from "express";
import type { AuditActorRole } from "../../../domain/audit/AuditEvent";
import type { RequestContext } from "../../../application/common/RequestContext";

const actorRoles: readonly AuditActorRole[] = [
  "patient",
  "provider",
  "admin",
  "system",
  "lab"
];

export function getRequestContext(req: Request): RequestContext {
  const actorId = boundedHeader(req, "x-actor-id") ?? "system";
  const roleHeader = boundedHeader(req, "x-actor-role") ?? "system";
  const correlationId = boundedHeader(req, "x-correlation-id") ?? randomUUID();

  return {
    actor: {
      id: actorId,
      role: isActorRole(roleHeader) ? roleHeader : "system"
    },
    correlationId
  };
}

function isActorRole(value: string): value is AuditActorRole {
  return actorRoles.includes(value as AuditActorRole);
}

function boundedHeader(req: Request, name: string): string | undefined {
  const value = req.header(name)?.trim();
  if (value === undefined || value === "") {
    return undefined;
  }

  return value.slice(0, 128);
}
