import { Card } from "../../components/ui/Card";
import { list } from "../statistics/stats";

export function Participants({ state }) {
  const participants = list(state.participants).sort((a,b)=>(a.name||"").localeCompare(b.name||""));
  return (
    <div className="page">
      <header className="pageHeader"><div><span className="eyebrow">Contributeurs</span><h1>Participants</h1><p>Suivez les personnes connectées à l’atelier mobile.</p></div></header>
      <Card>
        <div className="premiumTableWrap"><table className="premiumTable"><thead><tr><th>Nom</th><th>Fonction</th><th>Rôle</th><th>Arrivée</th></tr></thead><tbody>
          {participants.map(p => <tr key={p.id}><td><b>{p.name}</b></td><td>{p.function || "—"}</td><td>{p.role || "participant"}</td><td>{p.joinedAt || "—"}</td></tr>)}
          {!participants.length && <tr><td colSpan="4" className="muted">Aucun participant connecté.</td></tr>}
        </tbody></table></div>
      </Card>
    </div>
  );
}
