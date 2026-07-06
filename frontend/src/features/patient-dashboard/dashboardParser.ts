import type {
  BiomarkerResult,
  BiomarkerTrend,
  DashboardData,
  LabOrder,
  LabResult,
  OrderStatus,
  Patient,
  ResultFlag,
  ResultStatus,
  TrendPoint
} from "./types";
import {
  optionalString,
  parseArray,
  requireEnum,
  requireNumber,
  requireRecord,
  requireString
} from "./dashboardGuards";

const orderStatuses = [
  "draft",
  "submitted",
  "accepted",
  "in_progress",
  "partial_result",
  "final_result",
  "amended",
  "failed",
  "cancelled"
] as const satisfies readonly OrderStatus[];

const resultStatuses = [
  "partial",
  "final",
  "amended",
  "cancelled"
] as const satisfies readonly ResultStatus[];

const resultFlags = [
  "low",
  "normal",
  "high",
  "critical",
  "unknown"
] as const satisfies readonly ResultFlag[];

export function parseDashboardData(value: unknown): DashboardData {
  const record = requireRecord(value, "dashboard");

  return {
    patient: parsePatient(record.patient, "patient"),
    recentOrders: parseArray(record.recentOrders, "recentOrders", parseLabOrder),
    recentResults: parseArray(record.recentResults, "recentResults", parseLabResult),
    trend: parseTrend(record.trend, "trend")
  };
}

function parsePatient(value: unknown, path: string): Patient {
  const record = requireRecord(value, path);
  return {
    id: requireString(record.id, `${path}.id`),
    name: requireString(record.name, `${path}.name`),
    birthDate: requireString(record.birthDate, `${path}.birthDate`),
    sexAtBirth: requireString(record.sexAtBirth, `${path}.sexAtBirth`),
    email: requireString(record.email, `${path}.email`)
  };
}

function parseLabOrder(value: unknown, path: string): LabOrder {
  const record = requireRecord(value, path);
  const base = {
    id: requireString(record.id, `${path}.id`),
    labName: requireString(record.labName, `${path}.labName`),
    panelName: requireString(record.panelName, `${path}.panelName`),
    status: requireEnum(record.status, `${path}.status`, orderStatuses),
    orderedAt: requireString(record.orderedAt, `${path}.orderedAt`)
  };
  const accessionNumber = optionalString(record.accessionNumber, `${path}.accessionNumber`);
  return accessionNumber === undefined ? base : { ...base, accessionNumber };
}

function parseLabResult(value: unknown, path: string): LabResult {
  const record = requireRecord(value, path);
  return {
    id: requireString(record.id, `${path}.id`),
    labName: requireString(record.labName, `${path}.labName`),
    panelName: requireString(record.panelName, `${path}.panelName`),
    status: requireEnum(record.status, `${path}.status`, resultStatuses),
    resultedAt: requireString(record.resultedAt, `${path}.resultedAt`),
    biomarkers: parseArray(record.biomarkers, `${path}.biomarkers`, parseBiomarker)
  };
}

function parseBiomarker(value: unknown, path: string): BiomarkerResult {
  const record = requireRecord(value, path);
  return {
    biomarkerId: requireString(record.biomarkerId, `${path}.biomarkerId`),
    name: requireString(record.name, `${path}.name`),
    value: requireNumber(record.value, `${path}.value`),
    unit: requireString(record.unit, `${path}.unit`),
    flag: requireEnum(record.flag, `${path}.flag`, resultFlags),
    referenceRange: requireString(record.referenceRange, `${path}.referenceRange`)
  };
}

function parseTrend(value: unknown, path: string): BiomarkerTrend {
  const record = requireRecord(value, path);
  return {
    biomarkerId: requireString(record.biomarkerId, `${path}.biomarkerId`),
    name: requireString(record.name, `${path}.name`),
    referenceRange: requireString(record.referenceRange, `${path}.referenceRange`),
    points: parseArray(record.points, `${path}.points`, parseTrendPoint)
  };
}

function parseTrendPoint(value: unknown, path: string): TrendPoint {
  const record = requireRecord(value, path);
  return {
    id: requireString(record.id, `${path}.id`),
    observedAt: requireString(record.observedAt, `${path}.observedAt`),
    value: requireNumber(record.value, `${path}.value`),
    unit: requireString(record.unit, `${path}.unit`),
    flag: requireEnum(record.flag, `${path}.flag`, resultFlags)
  };
}
