import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import {
AlertTriangle,
BarChart3,
FileText,
Monitor,
Play,
QrCode,
RefreshCcw,
Settings,
Smartphone,
Users
} from "lucide-react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { list, stats } from "../statistics/stats";
import "../../styles/dashboard-v3.css";

export function Dashboard({ state, api, setPage }) {
const s = stats(state);
const [showQr, setShowQr] = useState(false);
const [url, setUrl] = useState(state.meta.publicUrl || "");

const base = (state.meta.publicUrl || window.location.origin).replace(/\/$/, "");
const phoneUrl = `${base}/?view=mobile`;
const events = list(state.activity).reverse().slice(0, 5);

function updateQr() {
api.setPublicUrl(url);
}

return (
<div className="dashboardCommand">
<header className="commandHeader">
<div>
<span className="eyebrow">Centre de pilotage</span>
<h1>{state.meta.title}</h1>
<p>{state.meta.subtitle}</p>
</div>

<div className="commandActions">
<Button icon={<QrCode size={17} />} onClick={() => setShowQr(true)}>
QR Code
</Button>
<Button icon={<Monitor size={17} />} onClick={() => setPage("projection")}>
Projection
</Button>
<Button variant="primary" icon={<Play size={17} />} onClick={() => setPage("workshop")}>
Animer
</Button>
</div>
</header>

<section className="commandStats">
<article>
<FileText size={20} />
<small>Documents</small>
<strong>{s.docs}</strong>
</article>

<article>
<Users size={20} />
<small>Participants</small>
<strong>{s.participants}</strong>
</article>

<article>
<BarChart3 size={20} />
<small>Avancement</small>
<strong>{s.progress}%</strong>
</article>

<article>
<AlertTriangle size={20} />
<small>À traiter</small>
<strong>{s.remaining}</strong>
</article>
</section>

<section className="commandGrid">
<main className="commandMain">
<Card className="commandPanel heroPanel">
<span className="eyebrow">Progression atelier</span>
<div className="heroProgress">
<div>
<h2>Décisions documentaires</h2>
<p>{s.decided} décision(s) validée(s) sur {s.docs}</p>
</div>
<strong>{s.progress}%</strong>
</div>

<div className="commandProgress">
<i style={{ width: `${s.progress}%` }} />
</div>

<div className="statusRow">
<span>{s.remaining} restant(s)</span>
<span>{s.arbitration} arbitrage(s)</span>
<span>{s.parking} parking</span>
</div>
</Card>

<Card className="commandPanel">
<span className="eyebrow">Assistant AtelierDoc</span>
<h2>À faire maintenant</h2>

<div className="assistantCommand">
{s.remaining > 0 && (
<p className="warn">Qualifier les {s.remaining} document(s) restant(s).</p>
)}

{s.arbitration > 0 && (
<p className="warn">Traiter {s.arbitration} arbitrage(s).</p>
)}

{s.parking > 0 && (
<p className="warn">Reprendre {s.parking} sujet(s) au parking.</p>
)}

{s.remaining === 0 && s.arbitration === 0 && (
<p className="ok">L’atelier de qualification est complet.</p>
)}
</div>
</Card>

<Card className="commandPanel">
<span className="eyebrow">Activité récente</span>
<h2>Fil de l’atelier</h2>

<div className="commandFeed">
{events.map(event => (
<article key={event.id}>
<time>{event.at}</time>
<b>{event.text}</b>
{event.detail && <p>{event.detail}</p>}
</article>
))}

{!events.length && <p className="muted">Aucune activité récente.</p>}
</div>
</Card>
</main>

<aside className="commandSide">
<Card className="commandPanel actionPanel">
<span className="eyebrow">Actions rapides</span>

<Button fullWidth variant="primary" icon={<Play size={17} />} onClick={() => setPage("workshop")}>
Démarrer / reprendre
</Button>

<Button fullWidth icon={<Monitor size={17} />} onClick={() => setPage("projection")}>
Ouvrir la projection
</Button>

<Button fullWidth icon={<Smartphone size={17} />} onClick={() => setShowQr(true)}>
Connexion participants
</Button>

<Button fullWidth icon={<FileText size={17} />} onClick={() => setPage("documents")}>
Documents attendus
</Button>

<Button fullWidth icon={<Settings size={17} />} onClick={() => setPage("settings")}>
Paramètres
</Button>
</Card>

<Card className="commandPanel">
<span className="eyebrow">Connexion téléphone</span>

<div className="smallQr" onClick={() => setShowQr(true)}>
<QRCodeCanvas value={phoneUrl} size={118} includeMargin level="H" />
</div>

<p className="muted">
Les participants se connectent ici pour voter et commenter.
</p>
</Card>
</aside>
</section>

{showQr && (
<div className="qrModalOverlay">
<div className="qrModalBox">
<button className="qrModalClose" onClick={() => setShowQr(false)}>×</button>

<h2>Connexion participants</h2>
<p>Scannez ce QR Code avec un téléphone.</p>

<QRCodeCanvas value={phoneUrl} size={240} includeMargin level="H" />

<input
value={url}
onChange={(e) => setUrl(e.target.value)}
placeholder="URL publique"
/>

<div className="qrModalActions">
<Button onClick={() => navigator.clipboard?.writeText(phoneUrl)}>
Copier le lien
</Button>

<Button variant="primary" icon={<RefreshCcw size={17} />} onClick={updateQr}>
Mettre à jour
</Button>
</div>

<small>{phoneUrl}</small>
</div>
</div>
)}
</div>
);
}
