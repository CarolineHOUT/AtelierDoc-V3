import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const resetOptions = [
  ["votes", "Votes"],
  ["comments", "Commentaires"],
  ["participants", "Participants"],
  ["parking", "Parking / arbitrages"],
  ["ranking", "Ordre / classement"],
  ["classification", "Plan de classement"],
  ["decisions", "Décisions validées"],
  ["documents", "Documents"],
  ["all", "Tout l’atelier"]
];

export function Settings({ state, api }) {
  const [reset, setReset] = useState({ votes:true, comments:true, participants:true, parking:true });
  const [confirmText, setConfirmText] = useState("");
  const [copyTitle, setCopyTitle] = useState(`${state.meta.title || "Atelier"} - copie`);

  const selected = Object.entries(reset).filter(([, value]) => value).map(([key]) => key);
  const canReset = selected.length > 0 && confirmText.trim().toUpperCase() === "RESET";

  function toggle(key) {
    if (key === "all") {
      const next = !reset.all;
      setReset(Object.fromEntries(resetOptions.map(([option]) => [option, next])));
      return;
    }
    setReset({ ...reset, [key]: !reset[key], all:false });
  }

  async function handleReset() {
    if (!canReset) return;
    await api.resetWorkshop(reset);
    setConfirmText("");
  }

  async function handleDuplicate() {
    const title = copyTitle.trim() || `${state.meta.title || "Atelier"} - copie`;
    if (!confirm(`Créer une copie de travail "${title}" ?\n\nLes documents et paramètres sont conservés. Les votes, commentaires, participants et décisions sont remis à zéro.`)) return;
    await api.duplicateWorkshop(title);
  }

  return (
    <div className="page">
      <header className="pageHeader"><div><span className="eyebrow">Paramètres</span><h1>Atelier</h1><p>Informations générales, lien public et administration de l’atelier.</p></div></header>
      <Card className="formCard">
        <div className="formGrid">
          <label><span>Titre</span><input value={state.meta.title || ""} onChange={e=>api.updateMeta({ title:e.target.value })} /></label>
          <label><span>Code</span><input value={state.meta.code || ""} onChange={e=>api.updateMeta({ code:e.target.value })} /></label>
          <label className="span2"><span>Lien public</span><input value={state.meta.publicUrl || ""} onChange={e=>api.setPublicUrl(e.target.value)} placeholder="URL envoyée aux participants" /></label>
          <label><span>Statut</span><input value={state.meta.status || "active"} readOnly /></label>
          <label><span>Créé le</span><input value={state.meta.createdAt || "—"} readOnly /></label>
        </div>
      </Card>

      <section className="settingsGrid">
        <Card className="formCard dangerZone">
          <span className="eyebrow">Action sensible</span>
          <h2>Réinitialiser l’atelier</h2>
          <p className="muted">Choisissez précisément ce que vous souhaitez remettre à zéro. Les documents peuvent être conservés.</p>

          <div className="resetChecklist">
            {resetOptions.map(([key, label]) => (
              <label key={key} className={key === "all" ? "resetAll" : ""}>
                <input type="checkbox" checked={!!reset[key]} onChange={() => toggle(key)} />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <label className="fullLabel">
            <span>Confirmation</span>
            <input value={confirmText} onChange={e=>setConfirmText(e.target.value)} placeholder="Tapez RESET pour confirmer" />
          </label>

          <div className="inlineActions">
            <Button variant="danger" onClick={handleReset} disabled={!canReset}>Réinitialiser</Button>
            <small className="muted">Sélection : {selected.length ? selected.join(", ") : "aucune"}</small>
          </div>
        </Card>

        <Card className="formCard">
          <span className="eyebrow">Copie de travail</span>
          <h2>Dupliquer l’atelier</h2>
          <p className="muted">Conserve les documents, catégories et paramètres. Remet à zéro votes, commentaires, participants, parking et décisions.</p>

          <label className="fullLabel">
            <span>Nom de la copie</span>
            <input value={copyTitle} onChange={e=>setCopyTitle(e.target.value)} />
          </label>

          <div className="inlineActions">
            <Button variant="primary" onClick={handleDuplicate}>Créer la copie</Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
