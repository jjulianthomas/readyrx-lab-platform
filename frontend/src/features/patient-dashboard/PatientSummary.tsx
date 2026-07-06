import { formatDate } from "./format";
import type { Patient } from "./types";

interface PatientSummaryProps {
  readonly patient: Patient;
}

export function PatientSummary({ patient }: PatientSummaryProps): JSX.Element {
  return (
    <section className="panel patient-panel">
      <p className="eyebrow">Patient</p>
      <h1>{patient.name}</h1>
      <dl className="detail-list">
        <div>
          <dt>Date of birth</dt>
          <dd>{formatDate(patient.birthDate)}</dd>
        </div>
        <div>
          <dt>Sex at birth</dt>
          <dd>{patient.sexAtBirth}</dd>
        </div>
        <div>
          <dt>Patient ID</dt>
          <dd>{patient.id}</dd>
        </div>
      </dl>
    </section>
  );
}
