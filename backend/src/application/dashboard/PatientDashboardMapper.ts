import type { LabOrder } from "../../domain/orders/LabOrder";
import type { Patient } from "../../domain/patients/Patient";
import type { LabResult, ResultReferenceRange } from "../../domain/results/LabResult";
import type { Lab } from "../../domain/labs/Lab";
import type { LabTestPanel } from "../../domain/catalog/LabTestPanel";
import type { BiomarkerId } from "../../domain/common/Identifiers";
import type {
  DashboardBiomarkerTrend,
  DashboardLabOrder,
  DashboardLabResult,
  DashboardPatient
} from "./PatientDashboard";

export function toDashboardPatient(patient: Patient): DashboardPatient {
  return {
    id: patient.id,
    name: `${patient.name.given} ${patient.name.family}`,
    birthDate: patient.birthDate,
    sexAtBirth: patient.sexAtBirth,
    email: patient.contact.email
  };
}

export function toDashboardOrders(
  orders: readonly LabOrder[],
  labs: readonly Lab[],
  panels: readonly LabTestPanel[]
): readonly DashboardLabOrder[] {
  const labNames = new Map(labs.map((lab) => [lab.id, lab.name]));
  const panelNames = new Map(panels.map((panel) => [panel.id, panel.name]));
  return sortOrders(orders).map((order) => toDashboardOrder(order, labNames, panelNames));
}

export function toDashboardResults(
  results: readonly LabResult[],
  orders: readonly LabOrder[],
  labs: readonly Lab[],
  panels: readonly LabTestPanel[]
): readonly DashboardLabResult[] {
  const orderById = new Map(orders.map((order) => [order.id, order]));
  const labNames = new Map(labs.map((lab) => [lab.id, lab.name]));
  const panelNames = new Map(panels.map((panel) => [panel.id, panel.name]));
  return results.map((result) => toDashboardResult(result, orderById, labNames, panelNames));
}

export function toDashboardTrend(results: readonly LabResult[]): DashboardBiomarkerTrend {
  const biomarkerId = selectedBiomarkerId(results);
  if (biomarkerId === undefined) {
    return { biomarkerId: "", name: "Biomarker", referenceRange: "", points: [] };
  }
  const points = results
    .flatMap((result) =>
      result.biomarkers
        .filter((biomarker) => biomarker.biomarkerId === biomarkerId)
        .map((biomarker) => ({ result, biomarker }))
    )
    .sort((left, right) => left.biomarker.observedAt.localeCompare(right.biomarker.observedAt));
  const latest = points[points.length - 1]?.biomarker;

  return {
    biomarkerId,
    name: latest?.displayName ?? biomarkerId,
    referenceRange: latest === undefined ? "" : referenceRangeText(latest.referenceRange),
    points: points.map(({ result, biomarker }) => ({
      id: `${result.id}-${biomarker.biomarkerId}`,
      observedAt: biomarker.observedAt,
      value: biomarker.value,
      unit: biomarker.unit,
      flag: biomarker.flag
    }))
  };
}

function toDashboardOrder(
  order: LabOrder,
  labNames: ReadonlyMap<string, string>,
  panelNames: ReadonlyMap<string, string>
): DashboardLabOrder {
  const base = {
    id: order.id,
    labName: labNames.get(order.labId) ?? order.labId,
    panelName: panelName(order, panelNames),
    status: order.status,
    orderedAt: order.submittedAt ?? order.createdAt
  };
  return order.accessionNumber === undefined
    ? base
    : { ...base, accessionNumber: order.accessionNumber };
}

function toDashboardResult(
  result: LabResult,
  orders: ReadonlyMap<string, LabOrder>,
  labNames: ReadonlyMap<string, string>,
  panelNames: ReadonlyMap<string, string>
): DashboardLabResult {
  const order = orders.get(result.labOrderId);
  return {
    id: result.id,
    labName: labNames.get(result.labId) ?? result.labId,
    panelName: order === undefined ? "Unknown panel" : panelName(order, panelNames),
    status: result.status,
    resultedAt: result.resultedAt,
    biomarkers: result.biomarkers.map((biomarker) => ({
      biomarkerId: biomarker.biomarkerId,
      name: biomarker.displayName,
      value: biomarker.value,
      unit: biomarker.unit,
      flag: biomarker.flag,
      referenceRange: referenceRangeText(biomarker.referenceRange)
    }))
  };
}

function selectedBiomarkerId(results: readonly LabResult[]): BiomarkerId | undefined {
  const biomarkers = results.flatMap((result) => result.biomarkers);
  return biomarkers.find((item) => item.biomarkerId === "biomarker_ldl")?.biomarkerId
    ?? biomarkers[0]?.biomarkerId;
}

function sortOrders(orders: readonly LabOrder[]): readonly LabOrder[] {
  return [...orders].sort((left, right) =>
    (right.submittedAt ?? right.createdAt).localeCompare(left.submittedAt ?? left.createdAt)
  );
}

function panelName(order: LabOrder, panelNames: ReadonlyMap<string, string>): string {
  const panelId = order.items[0]?.panelId;
  return panelId === undefined ? "Unknown panel" : panelNames.get(panelId) ?? panelId;
}

function referenceRangeText(range: ResultReferenceRange): string {
  if (range.low !== undefined && range.high !== undefined) {
    return `${range.low}-${range.high} ${range.unit}`;
  }
  if (range.low !== undefined) {
    return `> ${range.low} ${range.unit}`;
  }
  if (range.high !== undefined) {
    return `< ${range.high} ${range.unit}`;
  }
  return range.text ?? range.unit;
}
