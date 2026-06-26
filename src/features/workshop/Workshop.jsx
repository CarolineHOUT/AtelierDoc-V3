import { useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { DECISIONS, AUTHORITY } from "./seed";
import { commentsFor, consensus, list, trend, voteCounts } from "../statistics/stats";

export function Workshop({ state, api }) {
  const [search, setSearch] = useState("");
  const [remark, setRemark] = useState("");
  const [justification, setJustification] = useState("");
  const docs = useMemo(() => list(state.documents).sort((a,b)=>(a.order||0)-(b.order||0)), [state.documents]);
  const active = state.documents?.[state.meta.activeDocumentId] || docs[0];
  const filtered = docs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  if (!active) {
    return (
      <div className="page">
        <header className="pageHeader">
          <div><span className="eyebrow">Animation atelier</span><h1>Aucun document</h1><p>Ajoutez des documents avant de lancer l’animation.</p></div>
        </header>
        <Card className="emptyState"><b>Atelier vide</b>Créez un document ou importez une liste de noms dans l’onglet Documents.</Card>
      </div>
    );
  }

  const counts = voteCounts(state, active.id);
  const comments = commentsFor(state, active.id).reverse();

  return (
    <div className="workshopScreen">
      <aside className="docRailPremium">
        <div className="railHeader"><b>Référentiel</b><span>{filtered.length}</span></div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." />
        <div className="docListPremium">
          {filtered.map(d => (
            <button key={d.id} className={d.id===active.id ? "active" : ""} onClick={() => api.setActiveDocument(d.id)}>
              <b>{d.name}</b>
              <span>{d.decision || "À traiter"}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="conduite">
        <header className="documentFocus">
          <span className="eyebrow">Document en discussion</span>
          <h1>{active.name}</h1>
          <div className="chips">
            <span>{active.family}</span><span>{active.stage}</span><span>{active.sensitivity}</span><span>{active.authority}</span>
          </div>
        </header>

        <section className="decisionLayout">
          <Card className="decisionCard">
            <span className="eyebrow">Décision collective</span>
            <div className="consensusHero">
              <strong>{consensus(state, active.id)}%</strong>
              <span>Consensus · tendance {trend(state, active.id)}</span>
            </div>
            <div className="voteBars">
              {DECISIONS.map(d => (
                <button key={d} onClick={() => api.decide(active.id, d, justification)}>
                  <span>{d}</span><b>{counts[d]}</b>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <span className="eyebrow">Autorité parentale</span>
            <div className="segmentPremium">
              {AUTHORITY.map(a => <button key={a} className={active.authority===a ? "selected" : ""} onClick={() => api.updateDocument(active.id, { authority:a })}>{a}</button>)}
            </div>
            <textarea value={justification} onChange={e=>setJustification(e.target.value)} placeholder="Justification officielle..." />
          </Card>

          <Card>
            <span className="eyebrow">Remarques</span>
            <textarea value={remark} onChange={e=>setRemark(e.target.value)} placeholder="Ajouter une remarque..." />
            <div className="inlineActions">
              <Button variant="primary" onClick={() => { if (remark.trim()) { api.comment(active.id, "Animateur", remark.trim()); setRemark(""); }}}>Ajouter</Button>
              <Button onClick={() => api.parking(active.id, "Animateur")}>Parking</Button>
            </div>
          </Card>

          <Card>
            <span className="eyebrow">Commentaires récents</span>
            <div className="commentList">
              {comments.slice(0,5).map(c => <article key={c.id}><b>{c.author}</b><p>{c.text}</p><time>{c.at}</time></article>)}
              {!comments.length && <p className="muted">Aucun commentaire.</p>}
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
