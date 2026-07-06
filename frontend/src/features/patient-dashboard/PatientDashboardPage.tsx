import { useEffect, useState } from "react";
import { BiomarkerTrendChart } from "./BiomarkerTrendChart";
import { ClinicalSuggestionPanel } from "./ClinicalSuggestionPanel";
import { dashboardService } from "./DashboardApi";
import { PatientSummary } from "./PatientSummary";
import { RecentOrdersPanel } from "./RecentOrdersPanel";
import { RecentResultsPanel } from "./RecentResultsPanel";
import type { DashboardData } from "./types";

const patientId = import.meta.env.VITE_LAB_PLATFORM_PATIENT_ID ?? "patient_001";

type DashboardState =
  | { readonly status: "loading" }
  | { readonly status: "loaded"; readonly data: DashboardData }
  | { readonly status: "error"; readonly message: string };

export function PatientDashboardPage(): JSX.Element {
  const [state, setState] = useState<DashboardState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });

    dashboardService
      .getDashboard(patientId)
      .then((data) => {
        if (active) {
          setState({ status: "loaded", data });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Unable to load dashboard"
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Lab platform</p>
          <h1>Patient lab dashboard</h1>
        </div>
      </header>
      {renderDashboardState(state)}
    </main>
  );
}

function renderDashboardState(state: DashboardState): JSX.Element {
  if (state.status === "loading") {
    return <section className="panel dashboard-state">Loading dashboard...</section>;
  }

  if (state.status === "error") {
    return (
      <section className="panel dashboard-state dashboard-error">
        {state.message}
      </section>
    );
  }

  return (
    <div className="dashboard-grid">
      <PatientSummary patient={state.data.patient} />
      <BiomarkerTrendChart trend={state.data.trend} />
      <RecentOrdersPanel orders={state.data.recentOrders} />
      <RecentResultsPanel results={state.data.recentResults} />
      <ClinicalSuggestionPanel
        results={state.data.recentResults}
        trend={state.data.trend}
      />
    </div>
  );
}
