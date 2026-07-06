import type { ResultFlag } from "./types";

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export function formatValue(value: number, unit: string): string {
  return `${value.toLocaleString("en-US")} ${unit}`;
}

export function flagLabel(flag: ResultFlag): string {
  if (flag === "critical") {
    return "Critical";
  }
  if (flag === "high") {
    return "High";
  }
  if (flag === "low") {
    return "Low";
  }
  if (flag === "unknown") {
    return "Unknown";
  }
  return "Normal";
}
