import type { BiomarkerId } from "../../domain/common/Identifiers";

export interface BiomarkerCodeMapping {
  readonly biomarkerId: BiomarkerId;
  readonly displayName: string;
}

const mappings: Record<string, BiomarkerCodeMapping> = {
  "2345-7": { biomarkerId: "biomarker_glucose", displayName: "Glucose" },
  "2093-3": {
    biomarkerId: "biomarker_total_cholesterol",
    displayName: "Total Cholesterol"
  },
  "18262-6": { biomarkerId: "biomarker_ldl", displayName: "LDL Cholesterol" },
  "2085-9": { biomarkerId: "biomarker_hdl", displayName: "HDL Cholesterol" },
  "2571-8": { biomarkerId: "biomarker_triglycerides", displayName: "Triglycerides" },
  "2986-8": { biomarkerId: "biomarker_testosterone", displayName: "Testosterone" }
};

export function resolveBiomarkerCode(
  code: string,
  fallbackDisplay: string
): BiomarkerCodeMapping {
  const mapping = mappings[code];
  return mapping ?? { biomarkerId: `external_${code}`, displayName: fallbackDisplay };
}
