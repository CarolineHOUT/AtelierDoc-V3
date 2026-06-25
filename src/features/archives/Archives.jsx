import { Card } from "../../components/ui/Card";
import { list } from "../statistics/stats";

export function Archives({ state }) {
  const docs = list(state.documents).sort((a,b)=>(a.classificationCode||"").localeCompare(b.classificationCode||""));
  return (
    <div className="page">
      <header className="pageHeader"><div><span className="eyebrow">Archives</span><h1>Préparation archivage</h1><p>Vue consolidée conservation + classement pour anticiper le dossier final.</p></div></header>
      <Card>
        <div className="premiumTableWrap"><table className="premiumTable"><thead><tr><th>Code</th><th>Document</th><th>Chemin</th><th>DUA</th><th>Sort final</th></tr></thead><tbody>
          {docs.map(d => <tr key={d.id}><td>{d.classificationCode || "—"}</td><td><b>{d.name}</b><small>{d.family}</small></td><td>{d.classificationPath || "—"}</td><td>{d.retentionDuration || d.retention || "—"}</td><td><span className={`status ${d.finalDisposition && d.finalDisposition!=="À expertiser" ? "done" : ""}`}>{d.finalDisposition || "À expertiser"}</span></td></tr>)}
        </tbody></table></div>
      </Card>
    </div>
  );
}
