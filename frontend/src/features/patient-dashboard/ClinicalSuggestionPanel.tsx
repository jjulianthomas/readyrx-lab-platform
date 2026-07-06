import { flagLabel } from "./format";
import { flagTone } from "./status";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";
import type { BiomarkerTrend, LabResult } from "./types";

interface ClinicalSuggestionPanelProps {
  readonly results: readonly LabResult[];
  readonly trend: BiomarkerTrend;
}

export function ClinicalSuggestionPanel({
  results,
  trend
}: ClinicalSuggestionPanelProps): JSX.Element {
  const latest = trend.points[trend.points.length - 1];
  const abnormalCount = results.reduce(
    (count, result) =>
      count +
      result.biomarkers.filter(
        (biomarker) =>
          biomarker.flag === "high" ||
          biomarker.flag === "low" ||
          biomarker.flag === "critical"
      ).length,
    0
  );

  return (
    <section className="panel suggestion-panel">
      <SectionHeader
        eyebrow="Review"
        title="Clinical decision support"
        aside={
          latest !== undefined ? (
            <StatusBadge label={flagLabel(latest.flag)} tone={flagTone(latest.flag)} />
          ) : undefined
        }
      />
      <p className="panel-note">
        Suggestions are for clinician review only and are not a diagnosis or
        treatment decision.
      </p>
      <ul className="suggestion-list">
        <li>Review the latest {trend.name} value against the reference range.</li>
        <li>Consider recent abnormal markers before approving medication changes.</li>
        <li>Confirm lab timing, symptoms, and patient history before follow-up.</li>
      </ul>
      <p className="panel-note">
        Recent abnormal markers: <strong>{abnormalCount}</strong>
      </p>
    </section>
  );
}
