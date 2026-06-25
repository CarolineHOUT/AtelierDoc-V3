import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Metric } from "../../components/ui/Metric";
import { stats } from "../statistics/stats";
import { exportExcel, exportPDF, exportWord, exportZip } from "../../services/exporters/exporters";

export function Deliverables({ state, api }) {
  const s = stats(state);
  return (
    <div className="page">
      <header className="pageHeader">
        <div><span className="eyebrow">Dossier final</span><h1>Clôture & livrables</h1><p>Produisez les fichiers de sortie sans ressaisie.</p></div>
        <Button variant="primary" onClick={() => confirm("Clôturer l’atelier ?") && api.close()}>Clôturer l’atelier</Button>
      </header>
      <section className="metricsRibbon">
        <Metric label="Avancement" value={`${s.progress}%`} />
        <Metric label="Qualité" value={`${s.quality}%`} tone="gold" />
        <Metric label="Documents restants" value={s.remaining} />
      </section>
      <Card>
        <div className="deliverablesGrid">
          <button onClick={() => exportWord(state)}><b>Word</b><span>Rapport complet</span></button>
          <button onClick={() => exportPDF(state)}><b>PDF</b><span>Version officielle</span></button>
          <button onClick={() => exportExcel(state)}><b>Excel</b><span>Référentiel enrichi</span></button>
          <button onClick={() => exportZip(state)}><b>ZIP</b><span>Archive complète</span></button>
        </div>
      </Card>
    </div>
  );
}
