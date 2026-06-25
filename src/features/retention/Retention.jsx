import { useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { FINAL_DISPOSITIONS, RETENTION_TRIGGERS } from "../workshop/seed";
import { list } from "../statistics/stats";

const completeness = d => {
  const fields = [d.retentionDuration, d.retentionTrigger, d.administrativeDuration, d.finalDisposition, d.retentionJustification];
  return Math.round(fields.filter(Boolean).length / fields.length * 100);
};

export function Retention({ state, api, setPage }) {
  const docs = useMemo(() => list(state.documents).sort((a,b)=>(a.order||0)-(b.order||0)), [state.documents]);
  const [activeId, setActiveId] = useState(docs[0]?.id || "");
  const active = state.documents?.[activeId] || docs[0];
  const completed = docs.filter(d => completeness(d) >= 80).length;

  if (!docs.length) {
    return <div className="page"><header className="pageHeader"><div><span className="eyebrow">Conservation</span><h1>Durées de conservation</h1><p>Ajoutez d’abord des documents attendus.</p></div></header></div>;
  }

  const patch = (field, value) => api.updateDocument(active.id, { [field]: value });

  return (
    <div className="page">
      <header className="pageHeader">
        <div><span className="eyebrow">Tableau de gestion</span><h1>Durées de conservation</h1><p>Définissez DUA, événement déclencheur, durée administrative et sort final pour chaque document.</p></div>
        <div className="pageActions"><Button onClick={() => { api.updateMeta({ projectionMode:"retention", activeDocumentId:active.id }); setPage("projection"); }}>Mode projection</Button><div className="completionPill">{completed}/{docs.length} complets</div></div>
      </header>

      <section className="governanceLayout">
        <aside className="docRailPremium compactRail">
          <div className="railHeader"><b>Documents</b><span>{docs.length}</span></div>
          <div className="docListPremium">
            {docs.map(d => (
              <button key={d.id} className={d.id===active.id ? "active" : ""} onClick={() => setActiveId(d.id)}>
                <b>{d.name}</b>
                <span>{completeness(d)}% · {d.finalDisposition || "À qualifier"}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="governanceMain">
          <Card className="focusFormCard">
            <span className="eyebrow">Document</span>
            <h2>{active.name}</h2>
            <div className="chips"><span>{active.family}</span><span>{active.stage}</span><span>{active.sensitivity}</span></div>
            <div className="formGrid retentionGrid">
              <label><span>DUA / durée de conservation</span><input value={active.retentionDuration || ""} onChange={e=>patch("retentionDuration", e.target.value)} placeholder="Ex. 10 ans" /></label>
              <label><span>Point de départ</span><select value={active.retentionTrigger || "À expertiser"} onChange={e=>patch("retentionTrigger", e.target.value)}>{RETENTION_TRIGGERS.map(x => <option key={x}>{x}</option>)}</select></label>
              <label><span>Durée d’utilité courante</span><input value={active.administrativeDuration || ""} onChange={e=>patch("administrativeDuration", e.target.value)} placeholder="Ex. pendant le suivi actif" /></label>
              <label><span>Sort final</span><select value={active.finalDisposition || "À expertiser"} onChange={e=>patch("finalDisposition", e.target.value)}>{FINAL_DISPOSITIONS.map(x => <option key={x}>{x}</option>)}</select></label>
            </div>
            <label className="fullLabel"><span>Justification / source de la règle</span><textarea value={active.retentionJustification || ""} onChange={e=>patch("retentionJustification", e.target.value)} placeholder="Base réglementaire, arbitrage métier, commentaire archivistique..." /></label>
          </Card>

          <Card>
            <span className="eyebrow">Vue tableau</span>
            <div className="premiumTableWrap">
              <table className="premiumTable">
                <thead><tr><th>Document</th><th>DUA</th><th>Départ</th><th>DUC</th><th>Sort final</th></tr></thead>
                <tbody>{docs.map(d => <tr key={d.id}><td><b>{d.name}</b><small>{d.family}</small></td><td>{d.retentionDuration || "—"}</td><td>{d.retentionTrigger || "—"}</td><td>{d.administrativeDuration || "—"}</td><td><span className={`status ${d.finalDisposition && d.finalDisposition!=="À expertiser" ? "done" : ""}`}>{d.finalDisposition || "À expertiser"}</span></td></tr>)}</tbody>
              </table>
            </div>
          </Card>
        </main>
      </section>
    </div>
  );
}
