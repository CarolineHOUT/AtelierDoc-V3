import { Card } from "../../components/ui/Card";
import { Metric } from "../../components/ui/Metric";
import { stats } from "./stats";

export function Statistics({ state }) {
  const s = stats(state);
  return (
    <div className="page">
      <header className="pageHeader"><div><span className="eyebrow">Capitaliser</span><h1>Statistiques</h1><p>Indicateurs calculés automatiquement.</p></div></header>
      <section className="metricsRibbon">
        <Metric label="Qualité atelier" value={`${s.quality}%`} tone="gold"/>
        <Metric label="Consensus moyen" value={`${s.avgConsensus}%`} />
        <Metric label="À arbitrer" value={s.arbitration} />
        <Metric label="Parking" value={s.parking} />
      </section>
      <Card>
        <span className="eyebrow">Répartition des décisions</span>
        <div className="barList">
          {Object.entries(s.distribution).map(([k,v]) => (
            <div key={k}><span>{k}</span><b>{v}</b><i style={{width:`${s.docs ? Math.round(v/s.docs*100) : 0}%`}} /></div>
          ))}
        </div>
      </Card>
    </div>
  );
}
