import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { AUTHORITY, DOCUMENT_FAMILIES, FINAL_DISPOSITIONS, RETENTION_TRIGGERS } from "../workshop/seed";
import { list } from "../statistics/stats";

const empty = { name:"", family:"À qualifier", stage:"", authority:"À expertiser", sensitivity:"", retention:"", access:"", retentionDuration:"", retentionTrigger:"À expertiser", administrativeDuration:"", finalDisposition:"À expertiser", retentionJustification:"", classificationCode:"", classificationPath:"", keywords:"" };

export function Documents({ state, api }) {
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState("");
  const [open, setOpen] = useState(false);
  const docs = list(state.documents).sort((a,b)=>(a.order||0)-(b.order||0));

  function startEdit(d) {
    setEditing(d.id);
    setForm({ ...empty, ...d });
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) return;
    if (editing) await api.updateDocument(editing, form);
    else await api.createDocument(form);
    setForm(empty); setEditing(""); setOpen(false);
  }

  return (
    <div className="page">
      <header className="pageHeader">
        <div><span className="eyebrow">Référentiel documentaire</span><h1>Documents</h1><p>Ajoutez, modifiez ou supprimez les documents de l’atelier.</p></div>
        <Button variant="primary" onClick={() => { setOpen(!open); setEditing(""); setForm(empty); }}>+ Nouveau document</Button>
      </header>

      {open && (
        <Card className="formCard">
          <div className="formGrid">
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Nom du document" />
            <select value={form.family} onChange={e=>setForm({...form,family:e.target.value})}>{DOCUMENT_FAMILIES.map(f => <option key={f}>{f}</option>)}</select>
            <input value={form.stage} onChange={e=>setForm({...form,stage:e.target.value})} placeholder="Étape" />
            <select value={form.authority} onChange={e=>setForm({...form,authority:e.target.value})}>{AUTHORITY.map(a => <option key={a}>{a}</option>)}</select>
            <input value={form.sensitivity} onChange={e=>setForm({...form,sensitivity:e.target.value})} placeholder="Sensibilité" />
            <input value={form.retention} onChange={e=>setForm({...form,retention:e.target.value})} placeholder="Conservation" />
            <input value={form.access} onChange={e=>setForm({...form,access:e.target.value})} placeholder="Consultabilité" />
            <input value={form.retentionDuration} onChange={e=>setForm({...form,retentionDuration:e.target.value})} placeholder="DUA / durée de conservation" />
            <select value={form.retentionTrigger} onChange={e=>setForm({...form,retentionTrigger:e.target.value})}>{RETENTION_TRIGGERS.map(x => <option key={x}>{x}</option>)}</select>
            <input value={form.administrativeDuration} onChange={e=>setForm({...form,administrativeDuration:e.target.value})} placeholder="DUC / utilité courante" />
            <select value={form.finalDisposition} onChange={e=>setForm({...form,finalDisposition:e.target.value})}>{FINAL_DISPOSITIONS.map(x => <option key={x}>{x}</option>)}</select>
            <input value={form.classificationCode} onChange={e=>setForm({...form,classificationCode:e.target.value})} placeholder="Code classement" />
            <input value={form.classificationPath} onChange={e=>setForm({...form,classificationPath:e.target.value})} placeholder="Chemin classement" />
          </div>
          <div className="inlineActions">
            <Button variant="primary" onClick={save}>{editing ? "Enregistrer" : "Créer le document"}</Button>
            <Button onClick={() => { setOpen(false); setEditing(""); setForm(empty); }}>Annuler</Button>
          </div>
        </Card>
      )}

      <Card>
        <div className="premiumTableWrap">
          <table className="premiumTable">
            <thead><tr><th>Document</th><th>Famille</th><th>Autorité</th><th>Conservation</th><th>Classement</th><th>Décision</th><th>Actions</th></tr></thead>
            <tbody>
              {docs.map(d => (
                <tr key={d.id}>
                  <td><b>{d.name}</b><small>{d.stage}</small></td>
                  <td>{d.family}</td>
                  <td>{d.authority}</td>
                  <td>{d.retentionDuration || d.retention || "—"}<small>{d.finalDisposition || "À expertiser"}</small></td>
                  <td>{d.classificationCode || "—"}<small>{d.classificationPath || ""}</small></td>
                  <td><span className={`status ${d.decision ? "done" : ""}`}>{d.decision || "À traiter"}</span></td>
                  <td className="tableActions">
                    <button onClick={() => startEdit(d)}>Modifier</button>
                    <button onClick={() => confirm("Supprimer ce document ?") && api.deleteDocument(d.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
