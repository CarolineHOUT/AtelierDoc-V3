import "../../styles/sidebar-v3.css";
import {
  Archive,
  BarChart3,
  ClipboardList,
  FileText,
  FolderTree,
  Home,
  Hourglass,
  Library,
  Monitor,
  PackageCheck,
  Settings,
  Smartphone,
  Users,
  ShieldCheck
} from "lucide-react";

import { AtelierDocLogo } from "../../assets/AtelierDocLogo";

const groups = [
  {
    title: "Projet",
    items: [
      ["home", "Accueil", Home],
      ["dashboard", "Tableau de bord", BarChart3]
    ]
  },

  {
    title: "Préparation",
    items: [
      ["documents", "Documents attendus", FileText],
      ["participants", "Participants", Users],
      ["workshop", "Animation atelier", ClipboardList]
    ]
  },

  {
    title: "Gouvernance",
    items: [
      ["retention", "Conservation", Hourglass],
      ["classification", "Plan de classement", FolderTree],
      ["stats", "Capitalisation", BarChart3]
    ]
  },

  {
    title: "Livrables",
    items: [
      ["projection", "Projection", Monitor],
      ["mobile", "Téléphone", Smartphone],
      ["deliverables", "Exports", PackageCheck],
      ["archives", "Bibliothèque", Library]
    ]
  },

  {
    title: "Administration",
    items: [
      ["settings", "Paramètres", Settings]
    ]
  }
];

export function Shell({ page, setPage, children }) {
  return (
    <div className="shell">

      <aside className="sidebar">

        <div className="sidebarHeader">
          <AtelierDocLogo />

          <div className="projectResume">
            <h3>AtelierDoc</h3>
            <small>Gouvernance documentaire</small>

            <div className="progressMini">
              <div className="progressMiniBar" />
            </div>

            <span>Projet en cours</span>
          </div>
        </div>

        <nav>

          {groups.map((group) => (
            <section key={group.title} className="navGroup">

              <p className="groupTitle">{group.title}</p>

              {group.items.map(([id, label, Icon]) => (

                <button
                  key={id}
                  onClick={() => setPage(id)}
                  className={page === id ? "active" : ""}
                >

                  <Icon size={18} />

                  <span>{label}</span>

                </button>

              ))}

            </section>
          ))}

        </nav>

        <div className="sidebarFooter">

          <div className="qualityBox">

            <ShieldCheck size={18} />

            <div>

              <strong>Référentiel</strong>

              <small>Version 3.0</small>

            </div>

          </div>

        </div>

      </aside>

      <main className="main">

        {children}

      </main>

    </div>
  );
}