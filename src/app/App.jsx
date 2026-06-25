import { useState } from "react";
import { Shell } from "../components/layout/Shell";
import { useAtelier } from "../features/workshop/useAtelier";
import { Home } from "../features/home/Home";
import { Dashboard } from "../features/dashboard/Dashboard";
import { Workshop } from "../features/workshop/Workshop";
import { Projection } from "../features/projection/Projection";
import { Mobile } from "../features/mobile/Mobile";
import { Documents } from "../features/documents/Documents";
import { Statistics } from "../features/statistics/Statistics";
import { Deliverables } from "../features/deliverables/Deliverables";
import { Retention } from "../features/retention/Retention";
import { Classification } from "../features/classification/Classification";
import { Participants } from "../features/participants/Participants";
import { Archives } from "../features/archives/Archives";
import { Settings } from "../features/settings/Settings";

function initialPage() {
  const view = new URLSearchParams(window.location.search).get("view");
  if (view === "projection") return "projection";
  if (view === "mobile") return "mobile";
  return "home";
}

export default function App() {
  const { state, ready, api } = useAtelier();
  const [page, setPage] = useState(initialPage);

  if (!ready || !state) {
    return (
      <div className="loading">
        <div className="loaderMark">◆</div>
        <h1>AtelierDoc</h1>
        <p>Connexion à l’atelier…</p>
      </div>
    );
  }

  if (page === "projection") return <Projection state={state} api={api} />;
  if (page === "mobile") return <Mobile state={state} api={api} />;

  const common = { state, api, setPage };

  const pages = {
    home: <Home {...common} />,
    dashboard: <Dashboard {...common} />,
    workshop: <Workshop {...common} />,
    documents: <Documents {...common} />,
    participants: <Participants {...common} />,
    retention: <Retention {...common} />,
    classification: <Classification {...common} />,
    stats: <Statistics {...common} />,
    deliverables: <Deliverables {...common} />,
    archives: <Archives {...common} />,
    settings: <Settings {...common} />
  };

  return (
    <Shell page={page} setPage={setPage}>
      {pages[page] || pages.home}
    </Shell>
  );
}