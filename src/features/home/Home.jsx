import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Progress } from "../../components/ui/Progress";
import { stats } from "../statistics/stats";

export function Home({ state, setPage }) {
  const s = stats(state);
  return (
    <div className="page homePage">
      <section className="heroPremium">
        <div>
          <span className="eyebrow">AtelierDoc</span>
          <h1>Des documents aux décisions.</h1>
          <p>Préparez, conduisez et clôturez vos ateliers documentaires sans ressaisie.</p>
          <div className="heroActions">
            <Button variant="primary" onClick={() => setPage("workshop")}>Continuer l’atelier</Button>
            <Button onClick={() => setPage("documents")}>Ajouter un document</Button>
          </div>
        </div>
        <Card className="heroAtelierCard">
          <span>Atelier en cours</span>
          <h2>{state.meta.title}</h2>
          <p>{state.meta.subtitle}</p>
          <Progress value={s.progress} label="Progression" />
        </Card>
      </section>

      <section className="homeGrid">
        <Card>
          <span className="eyebrow">À surveiller</span>
          <h3>{s.arbitration} document(s) à arbitrer</h3>
          <p>Consensus inférieur à 60 % ou votes dispersés.</p>
        </Card>
        <Card>
          <span className="eyebrow">Contributions</span>
          <h3>{s.participants} participant(s)</h3>
          <p>{s.votes} votes et {s.comments} remarques enregistrés.</p>
        </Card>
        <Card>
          <span className="eyebrow">Clôture</span>
          <h3>{s.quality}% de qualité atelier</h3>
          <p>Score calculé selon décisions, consensus et parking.</p>
        </Card>
      </section>
    </div>
  );
}
