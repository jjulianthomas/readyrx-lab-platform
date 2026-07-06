import type { LabTestPanel } from "../../../domain/catalog/LabTestPanel";
import type { Lab } from "../../../domain/labs/Lab";
import type { LabOrder } from "../../../domain/orders/LabOrder";
import type { Patient } from "../../../domain/patients/Patient";
import type { NormalizedLabResult } from "../../../ports/integrations/NormalizedLabResult";
import type {
  Hl7Mapper,
  Hl7OrderMessage,
  Hl7ResultMessage
} from "../../../ports/mappers/Hl7Mapper";
import { resolveBiomarkerCode } from "../BiomarkerCodeMap";
import { makeReferenceRange, normalizeResultFlag } from "../ResultFlagNormalizer";

export class QuestHl7Mapper implements Hl7Mapper {
  public toOrderMessage(
    order: LabOrder,
    patient: Patient,
    lab: Lab,
    panels: readonly LabTestPanel[]
  ): Hl7OrderMessage {
    const timestamp = compactDate(order.submittedAt ?? order.updatedAt);
    const msh = `MSH|^~\\&|LABPLATFORM|LABPLATFORM|QUEST|${lab.id}|${timestamp}||ORM^O01|${order.id}|P|2.5.1`;
    const pid = `PID|||${patient.id}||${patient.name.family}^${patient.name.given}||${patient.birthDate}|${toHl7Sex(patient.sexAtBirth)}`;
    const orc = `ORC|NW|${order.id}|||SC||||||||${order.orderingProvider.npi}^${order.orderingProvider.name}`;
    const obrSegments = panels.map((panel, index) => {
      const code = panel.labCodes.find((item) => item.labId === lab.id)?.code ?? panel.id;
      return `OBR|${index + 1}|${order.id}||${code}^${panel.name}`;
    });

    return { messageType: "ORM", content: [msh, pid, orc, ...obrSegments].join("\r") };
  }

  public fromResultMessage(message: Hl7ResultMessage): NormalizedLabResult {
    const segments = parseSegments(message.content);
    const msh = requireSegment(segments, "MSH");
    const pid = requireSegment(segments, "PID");
    const orc = requireSegment(segments, "ORC");
    const obr = requireSegment(segments, "OBR");
    const observations = segments.filter((segment) => segment[0] === "OBX");
    if (observations.length === 0) {
      throw new Error("HL7 ORU result must contain at least one OBX segment");
    }

    return {
      labOrderId: field(orc, 2),
      patientId: field(pid, 3),
      labId: field(msh, 3),
      status: field(obr, 25) === "P" ? "partial" : "final",
      accessionNumber: field(obr, 3),
      sourceMessageId: field(msh, 9),
      collectedAt: field(obr, 7),
      resultedAt: field(obr, 22),
      biomarkers: observations.map(toBiomarkerResult)
    };
  }
}

function toBiomarkerResult(segment: readonly string[]) {
  const [code, display] = splitComponent(field(segment, 3));
  const [low, high] = splitRange(field(segment, 7));
  const mapping = resolveBiomarkerCode(code, display);
  const value = toRequiredNumber(field(segment, 5), display);

  return {
    biomarkerId: mapping.biomarkerId,
    displayName: mapping.displayName,
    value,
    unit: field(segment, 6),
    flag: normalizeResultFlag(field(segment, 8)),
    sourceCode: code,
    observedAt: field(segment, 14),
    referenceRange: makeReferenceRange(field(segment, 6), low, high)
  };
}

function toRequiredNumber(value: string, display: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`OBX value for '${display}' must be numeric`);
  }
  return parsed;
}

function parseSegments(content: string): readonly (readonly string[])[] {
  return content.split(/\r?\n|\r/u).filter(Boolean).map((line) => line.split("|"));
}

function requireSegment(
  segments: readonly (readonly string[])[],
  name: string
): readonly string[] {
  const segment = segments.find((item) => item[0] === name);
  if (segment === undefined) {
    throw new Error(`HL7 segment '${name}' is required`);
  }
  return segment;
}

function field(segment: readonly string[], index: number): string {
  return segment[index] ?? "";
}

function splitComponent(value: string): readonly [string, string] {
  const [code = "", display = code] = value.split("^");
  return [code, display];
}

function splitRange(value: string): readonly [number | undefined, number | undefined] {
  const [lowRaw, highRaw] = value.split("-");
  return [toNumber(lowRaw), toNumber(highRaw)];
}

function toNumber(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function compactDate(value: string): string {
  return value.replace(/[-:TZ.]/gu, "").slice(0, 14);
}

function toHl7Sex(value: Patient["sexAtBirth"]): string {
  return value === "female" ? "F" : value === "male" ? "M" : "U";
}
