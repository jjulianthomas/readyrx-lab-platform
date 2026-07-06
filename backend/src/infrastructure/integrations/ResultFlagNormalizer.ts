import type { ResultFlag, ResultReferenceRange } from "../../domain/results/LabResult";

export function normalizeResultFlag(flag: string): ResultFlag {
  const normalized = flag.trim().toUpperCase();

  if (normalized === "L" || normalized === "LOW") {
    return "low";
  }
  if (normalized === "H" || normalized === "HIGH") {
    return "high";
  }
  if (normalized === "HH" || normalized === "LL" || normalized === "CRITICAL") {
    return "critical";
  }
  if (normalized === "N" || normalized === "NORMAL" || normalized === "") {
    return "normal";
  }

  return "unknown";
}

export function makeReferenceRange(
  unit: string,
  low?: number,
  high?: number
): ResultReferenceRange {
  const range: ResultReferenceRange = { unit };

  if (low !== undefined) {
    return high !== undefined ? { unit, low, high } : { unit, low };
  }

  return high !== undefined ? { unit, high } : range;
}
