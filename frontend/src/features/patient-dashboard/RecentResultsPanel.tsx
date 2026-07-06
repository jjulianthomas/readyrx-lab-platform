import { formatDate } from "./format";
import { ResultSummaryCard } from "./ResultSummaryCard";
import { SectionHeader } from "./SectionHeader";
import { StatusBadge } from "./StatusBadge";
import { resultStatusLabel, resultStatusTone } from "./status";
import type { LabResult } from "./types";

interface RecentResultsPanelProps {
  readonly results: readonly LabResult[];
}

export function RecentResultsPanel({
  results
}: RecentResultsPanelProps): JSX.Element {
  if (results.length === 0) {
    return <section className="panel">No recent results available.</section>;
  }

  const latest = results[0];
  if (latest === undefined) {
    return <section className="panel">No recent results available.</section>;
  }

  return (
    <section className="panel">
      <SectionHeader
        eyebrow="Results"
        title="Recent lab results"
        aside={
          <StatusBadge
            label={resultStatusLabel(latest.status)}
            tone={resultStatusTone(latest.status)}
          />
        }
      />
      <p className="panel-note">
        {latest.panelName} · {latest.labName} · {formatDate(latest.resultedAt)}
      </p>
      <div className="result-grid">
        {latest.biomarkers.map((biomarker) => (
          <ResultSummaryCard
            key={`${latest.id}-${biomarker.biomarkerId}`}
            biomarker={biomarker}
          />
        ))}
      </div>
    </section>
  );
}
