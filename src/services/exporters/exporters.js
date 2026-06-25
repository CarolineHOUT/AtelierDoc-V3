import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, HeadingLevel } from "docx";
import { list, stats } from "../../features/statistics/stats";

export function exportExcel(state) {
  const docs = list(state.documents).map(d => ({
    Document:d.name, Famille:d.family, Etape:d.stage, Autorite:d.authority,
    Sensibilite:d.sensitivity, Decision:d.decision, Justification:d.justification,
    Conservation:d.retention, DUA:d.retentionDuration, Depart_DUA:d.retentionTrigger,
    DUC:d.administrativeDuration, Sort_final:d.finalDisposition, Justification_conservation:d.retentionJustification,
    Code_classement:d.classificationCode, Chemin_classement:d.classificationPath, Mots_cles:d.keywords, Consultabilite:d.access
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(docs), "Documents");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(docs.map(d => ({ Document:d.Document, DUA:d.DUA, Depart_DUA:d.Depart_DUA, DUC:d.DUC, Sort_final:d.Sort_final, Justification:d.Justification_conservation }))), "Conservation");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(docs.map(d => ({ Code:d.Code_classement, Document:d.Document, Chemin:d.Chemin_classement, Mots_cles:d.Mots_cles }))), "Plan de classement");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.meta.classificationFolders || []), "Dossiers");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([state.meta.documentFormalism || {}]), "Formalisme");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(list(state.votes)), "Votes");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(list(state.comments)), "Commentaires");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([stats(state)]), "Statistiques");
  XLSX.writeFile(wb, "atelierdoc-referentiel.xlsx");
}

export function exportPDF(state) {
  const s = stats(state);
  const pdf = new jsPDF();
  pdf.setFontSize(22);
  pdf.text("AtelierDoc", 16, 22);
  pdf.setFontSize(12);
  pdf.text("Rapport d'atelier documentaire", 16, 32);
  pdf.text(`Atelier : ${state.meta.title}`, 16, 46);
  pdf.text(`Avancement : ${s.progress}%`, 16, 54);
  pdf.text(`Qualité : ${s.quality}%`, 16, 62);
  pdf.text("Référentiel enrichi : conservation + plan de classement", 16, 70);
  let y = 84;
  list(state.documents).forEach(d => {
    pdf.text(`• ${d.name} — ${d.decision || "À traiter"} — DUA: ${d.retentionDuration || d.retention || "—"} — ${d.classificationCode || "—"}`, 16, y);
    y += 7;
    if (y > 282) { pdf.addPage(); y = 20; }
  });
  pdf.save("atelierdoc-rapport.pdf");
}

export async function exportWord(state) {
  const s = stats(state);
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ text:"AtelierDoc", heading:HeadingLevel.TITLE }),
        new Paragraph("Rapport d’atelier documentaire"),
        new Paragraph(`Atelier : ${state.meta.title}`),
        new Paragraph(`Avancement : ${s.progress}%`),
        new Paragraph(`Qualité atelier : ${s.quality}%`),
        new Paragraph({ text:"Décisions", heading:HeadingLevel.HEADING_1 }),
        ...list(state.documents).map(d => new Paragraph(`${d.name} — ${d.decision || "À traiter"}`)),
        new Paragraph({ text:"Tableau de gestion", heading:HeadingLevel.HEADING_1 }),
        ...list(state.documents).map(d => new Paragraph(`${d.name} — DUA : ${d.retentionDuration || d.retention || "—"} — Départ : ${d.retentionTrigger || "—"} — Sort final : ${d.finalDisposition || "—"}`)),
        new Paragraph({ text:"Plan de classement", heading:HeadingLevel.HEADING_1 }),
        ...((state.meta.classificationFolders || []).map(f => new Paragraph(`${f.code || "—"} — ${f.path || f.name}`))),
        ...list(state.documents).map(d => new Paragraph(`${d.classificationCode || "—"} — ${d.name} — ${d.classificationPath || "—"}`)),
        new Paragraph({ text:"Formalisme documentaire", heading:HeadingLevel.HEADING_1 }),
        new Paragraph(`Nommage : ${state.meta.documentFormalism?.namingPattern || "—"}`),
        new Paragraph(`Versioning : ${state.meta.documentFormalism?.versionRule || "—"}`),
        new Paragraph(`Métadonnées : ${state.meta.documentFormalism?.mandatoryMetadata || "—"}`)
      ]
    }]
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, "atelierdoc-rapport.docx");
}

export async function exportZip(state) {
  const zip = new JSZip();
  zip.file("atelierdoc-archive.json", JSON.stringify(state, null, 2));
  zip.file("tableau-gestion.json", JSON.stringify(list(state.documents).map(d => ({ id:d.id, name:d.name, retentionDuration:d.retentionDuration, retentionTrigger:d.retentionTrigger, administrativeDuration:d.administrativeDuration, finalDisposition:d.finalDisposition, retentionJustification:d.retentionJustification })), null, 2));
  zip.file("plan-classement.json", JSON.stringify(list(state.documents).map(d => ({ id:d.id, code:d.classificationCode, name:d.name, path:d.classificationPath, keywords:d.keywords })), null, 2));
  zip.file("dossiers-classement.json", JSON.stringify(state.meta.classificationFolders || [], null, 2));
  zip.file("formalisme-documentaire.json", JSON.stringify(state.meta.documentFormalism || {}, null, 2));
  zip.file("README.txt", "Archive AtelierDoc V2 - référentiel, tableau de gestion, plan de classement, dossiers et formalisme documentaire");
  const blob = await zip.generateAsync({ type:"blob" });
  saveAs(blob, "atelierdoc-archive.zip");
}
