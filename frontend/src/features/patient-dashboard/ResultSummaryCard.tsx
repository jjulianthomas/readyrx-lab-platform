import { flagLabel, formatValue } from "./format";
import { flagTone } from "./status";
import { StatusBadge } from "./StatusBadge";
import type { BiomarkerResult } from "./types";

interface ResultSummaryCardProps {
  readonly biomarker: BiomarkerResult;
}

export function ResultSummaryCard({
  biomarker
}: ResultSummaryCardProps): JSX.Element {
  return (
    <article className="result-card">
      <div>
        <p className="eyebrow">{biomarker.name}</p>
        <strong>{formatValue(biomarker.value, biomarker.unit)}</strong>
        <small>Ref {biomarker.referenceRange}</small>
      </div>
      <StatusBadge label={flagLabel(biomarker.flag)} tone={flagTone(biomarker.flag)} />
    </article>
  );
}
