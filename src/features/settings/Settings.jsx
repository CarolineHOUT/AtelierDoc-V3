import { Card } from "../../components/ui/Card";

export function Settings({ state, api }) {
  return (
    <div className="page">
      <header className="pageHeader"><div><span className="eyebrow">Paramètres</span><h1>Atelier</h1><p>Informations générales et lien public de participation.</p></div></header>
      <Card className="formCard">
        <div className="formGrid">
          <label><span>Titre</span><input value={state.meta.title || ""} onChange={e=>api.updateMeta({ title:e.target.value })} /></label>
          <label><span>Code</span><input value={state.meta.code || ""} onChange={e=>api.updateMeta({ code:e.target.value })} /></label>
          <label className="span2"><span>Lien public</span><input value={state.meta.publicUrl || ""} onChange={e=>api.setPublicUrl(e.target.value)} placeholder="URL envoyée aux participants" /></label>
          <label><span>Statut</span><input value={state.meta.status || "active"} readOnly /></label>
          <label><span>Créé le</span><input value={state.meta.createdAt || "—"} readOnly /></label>
        </div>
      </Card>
    </div>
  );
}
