import { useState } from "react";
import { DECISIONS, AUTHORITY } from "../workshop/seed";
import { consensus, trend, voteCounts } from "../statistics/stats";
import { AtelierDocLogo } from "../../assets/AtelierDocLogo";

function readUser() {
  try { return JSON.parse(localStorage.getItem("atelierdocV2User") || "null"); }
  catch { return null; }
}

export function Mobile({ state, api }) {
  const [user, setUser] = useState(readUser);
  const [remark, setRemark] = useState("");
  const [panel, setPanel] = useState("");
  const active = state.documents[state.meta.activeDocumentId] || Object.values(state.documents)[0];
  const counts = voteCounts(state, active.id);
  const current = user ? state.votes?.[`${active.id}_${user.id}`]?.value : "";

  function back() {
    const url = new URL(window.location.href);
    url.searchParams.delete("view");
    window.location.href = url.pathname;
  }

  async function join(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name")?.trim();
    if (!name) return;
    const p = { id:crypto.randomUUID(), name, function:fd.get("function") || "", role:"participant", joinedAt:new Date().toLocaleString("fr-FR") };
    localStorage.setItem("atelierdocV2User", JSON.stringify(p));
    setUser(p);
    await api.join(p);
  }

  if (!user) {
    return (
      <main className="mobileApp">
        <button className="mobileBack" onClick={back}>← Retour</button>
        <section className="mobileLogin">
          <AtelierDocLogo />
          <h1>Rejoindre l’atelier</h1>
          <p>Entrez votre nom pour participer aux décisions.</p>
          <form onSubmit={join}>
            <input name="name" placeholder="Nom / prénom" />
            <input name="function" placeholder="Fonction / service" />
            <button>Rejoindre</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="mobileApp">
      <button className="mobileBack" onClick={back}>← Retour</button>
      <header className="mobileTop"><AtelierDocLogo compact/><div><b>AtelierDoc</b><span>{state.meta.code}</span></div></header>
      <section className="mobileDoc">
        <span>Document projeté</span>
        <h1>{active.name}</h1>
        <p>{active.family} · {active.stage}</p>
      </section>

      <section className="mobileInsights">
        <div><span>Tendance</span><b>{trend(state, active.id)}</b></div>
        <div><span>Consensus</span><b>{consensus(state, active.id)}%</b></div>
        <div><span>Votes</span><b>{Object.values(counts).reduce((a,b)=>a+b,0)}</b></div>
      </section>

      <section className="mobilePanel">
        <label>Autorité parentale</label>
        <div className="mobileSegments">
          {AUTHORITY.map(a => <button key={a} className={active.authority===a ? "active" : ""} onClick={() => api.updateDocument(active.id, { authority:a })}>{a}</button>)}
        </div>
      </section>

      <section className="mobilePanel">
        <label>Votre qualification</label>
        <div className="mobileVotes">
          {DECISIONS.map(d => <button key={d} className={current===d ? "active" : ""} onClick={() => api.vote(active.id, user, d)}>{d}</button>)}
        </div>
      </section>

      <section className="mobileActions">
        <button onClick={() => setPanel(panel==="remark" ? "" : "remark")}>Remarque</button>
        <button onClick={() => api.parking(active.id, user.name)}>Parking</button>
      </section>

      {panel === "remark" && (
        <section className="mobilePanel">
          <textarea value={remark} onChange={e=>setRemark(e.target.value)} placeholder="Votre remarque..." />
          <button className="mobilePrimary" onClick={() => { if (remark.trim()) { api.comment(active.id, user.name, remark.trim()); setRemark(""); setPanel(""); }}}>Envoyer</button>
        </section>
      )}
      <footer>Connecté : <b>{user.name}</b></footer>
    </main>
  );
}
