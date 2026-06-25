import { DECISIONS, FINAL_DISPOSITIONS } from "../workshop/seed";
import { consensus, list, trend, voteCounts, commentsFor } from "../statistics/stats";

function back() {
  const url = new URL(window.location.href);
  url.searchParams.delete("view");
  window.location.href = url.pathname;
}

const modes = [
  ["decision", "Qualification"],
  ["retention", "Conservation"],
  ["classification", "Classement"]
];

const retentionComplete = d => {
  const fields = [d.retentionDuration, d.retentionTrigger, d.administrativeDuration, d.finalDisposition, d.retentionJustification];
  return Math.round(fields.filter(Boolean).length / fields.length * 100);
};

function folderPath(folder) {
  return folder?.path || "Sans classement";
}

export function Projection({ state, api }) {
  const docs = list(state.documents);
  const active = state.documents[state.meta.activeDocumentId] || docs[0];
  const mode = state.meta.projectionMode || "decision";

  if (!active) {
    return (
      <main className="projectionStage">
        <ProjectionHeader state={state} api={api} mode={mode} />
        <section className="stageDocument"><span>Atelier</span><h1>Aucun document</h1><p>Ajoutez d’abord des documents attendus.</p></section>
      </main>
    );
  }

  if (mode === "retention") return <RetentionProjection state={state} api={api} docs={docs} active={active} />;
  if (mode === "classification") return <ClassificationProjection state={state} api={api} docs={docs} active={active} />;
  return <DecisionProjection state={state} api={api} active={active} />;
}

function ProjectionHeader({ state, api, mode }) {
  return (
    <header className="projectionTopbar">
      <button className="projectionBack" onClick={back}>← Retour</button>
      <div className="projectionBrand"><span>AtelierDoc</span><b>{state.meta.title}</b></div>
      <nav className="projectionModePicker" aria-label="Choisir le mode de projection">
        {modes.map(([id, label]) => (
          <button key={id} className={mode === id ? "active" : ""} onClick={() => api?.updateMeta({ projectionMode:id })}>{label}</button>
        ))}
      </nav>
    </header>
  );
}

function DecisionProjection({ state, api, active }) {
  const counts = voteCounts(state, active.id);
  const comments = commentsFor(state, active.id).reverse().slice(0,3);
  return (
    <main className="projectionStage">
      <ProjectionHeader state={state} api={api} mode="decision" />
      <section className="stageMain">
        <div className="stageDocument">
          <span>Document projeté</span>
          <h1>{active.name}</h1>
          <p>{active.family} · {active.stage} · {active.authority}</p>
        </div>
        <aside>
          <span>Consensus</span>
          <strong>{consensus(state, active.id)}%</strong>
          <p>{trend(state, active.id)}</p>
        </aside>
      </section>
      <section className="stageVotes">
        {DECISIONS.map(d => <article key={d}><span>{d}</span><b>{counts[d]}</b></article>)}
      </section>
      <section className="stageComments">
        {comments.map(c => <article key={c.id}><b>{c.author}</b><p>{c.text}</p></article>)}
        {!comments.length && <p>Aucune remarque pour le moment.</p>}
      </section>
    </main>
  );
}

function RetentionProjection({ state, api, docs, active }) {
  const complete = docs.filter(d => retentionComplete(d) >= 80).length;
  const dispositionCounts = FINAL_DISPOSITIONS.reduce((acc, x) => ({ ...acc, [x]: docs.filter(d => (d.finalDisposition || "À expertiser") === x).length }), {});
  return (
    <main className="projectionStage governanceProjection">
      <ProjectionHeader state={state} api={api} mode="retention" />
      <section className="stageMain">
        <div className="stageDocument">
          <span>Atelier conservation</span>
          <h1>{active.name}</h1>
          <p>{active.family} · {active.stage} · {active.sensitivity}</p>
        </div>
        <aside>
          <span>Complétude</span>
          <strong>{retentionComplete(active)}%</strong>
          <p>{complete}/{docs.length} documents complets</p>
        </aside>
      </section>
      <section className="stageVotes retentionStats">
        <article><span>DUA</span><b>{active.retentionDuration || "—"}</b></article>
        <article><span>Point de départ</span><b>{active.retentionTrigger || "—"}</b></article>
        <article><span>DUC</span><b>{active.administrativeDuration || "—"}</b></article>
        <article><span>Sort final</span><b>{active.finalDisposition || "À expertiser"}</b></article>
      </section>
      <section className="stageComments projectionTable">
        {FINAL_DISPOSITIONS.map(x => <article key={x}><b>{x}</b><p>{dispositionCounts[x] || 0} document(s)</p></article>)}
      </section>
    </main>
  );
}

function ClassificationProjection({ state, api, docs, active }) {
  const folders = state.meta.classificationFolders || [];
  const classified = docs.filter(d => d.classificationCode && d.classificationPath).length;
  const roots = folders.filter(f => !f.parentId).slice(0,4);
  return (
    <main className="projectionStage governanceProjection">
      <ProjectionHeader state={state} api={api} mode="classification" />
      <section className="stageMain">
        <div className="stageDocument">
          <span>Atelier plan de classement</span>
          <h1>{active.name}</h1>
          <p>{active.classificationPath || "À classer"}</p>
        </div>
        <aside>
          <span>Classement</span>
          <strong>{classified}/{docs.length}</strong>
          <p>documents classés</p>
        </aside>
      </section>
      <section className="stageVotes retentionStats">
        <article><span>Code</span><b>{active.classificationCode || "—"}</b></article>
        <article className="wideStat"><span>Chemin</span><b>{active.classificationPath || "À définir"}</b></article>
        <article><span>Nommage</span><b>{state.meta.documentFormalism?.namingPattern || "À définir"}</b></article>
      </section>
      <section className="stageComments projectionTable">
        {roots.map(root => <article key={root.id}><b>{folderPath(root)}</b><p>{docs.filter(d => (d.classificationPath || "").startsWith(root.path)).length} document(s)</p></article>)}
      </section>
    </main>
  );
}
