export const DECISIONS = ["Obligatoire", "Conditionnel", "Exclu", "À expertiser"];
export const AUTHORITY = ["Acte usuel", "Acte non usuel", "À expertiser"];

export const DOCUMENT_FAMILIES = [
  "Protection enfance", "Évaluation", "Judiciaire", "Vie quotidienne", "Santé",
  "Administratif", "Finances", "RH", "Communication", "Technique", "À qualifier"
];

export const RETENTION_TRIGGERS = [
  "Création du document", "Clôture du dossier", "Fin de prise en charge", "Majorité de l'enfant",
  "Fin de validité", "Décision définitive", "Dernière action", "À expertiser"
];

export const FINAL_DISPOSITIONS = ["Destruction", "Conservation définitive", "Tri", "À expertiser"];

export const CLASSIFICATION_ROOTS = [
  "01_Gouvernance",
  "02_Protection_enfance",
  "03_Evaluation_et_instruction",
  "04_Decisions_juridiques",
  "05_Suivi_et_accompagnement",
  "06_Sante",
  "07_Vie_quotidienne",
  "08_Archives"
];

export const seed = {
  meta: {
    product: "AtelierDoc",
    code: "ASE-2026",
    title: "Atelier documentaire ASE",
    subtitle: "Protection de l’enfance",
    status: "active",
    activeDocumentId: "",
    publicUrl: "",
    projectionMode: "decision",
    classificationFolders: [
      { id:"f-01", code:"01", name:"Gouvernance", parentId:"", path:"01_Gouvernance" },
      { id:"f-02", code:"02", name:"Protection enfance", parentId:"", path:"02_Protection_enfance" },
      { id:"f-0201", code:"02.01", name:"Informations préoccupantes", parentId:"f-02", path:"02_Protection_enfance/02.01_Informations_preoccupantes" },
      { id:"f-03", code:"03", name:"Évaluation et instruction", parentId:"", path:"03_Evaluation_et_instruction" },
      { id:"f-04", code:"04", name:"Décisions juridiques", parentId:"", path:"04_Decisions_juridiques" }
    ],
    documentFormalism: {
      namingPattern: "{code_classement}_{date}_{type_document}_{objet}_v{version}",
      dateFormat: "AAAA-MM-JJ",
      versionRule: "v0.1 brouillon · v1.0 validé · incrément majeur après validation",
      mandatoryMetadata: "code classement, titre, famille, responsable, confidentialité, durée de conservation, sort final",
      fileFormats: "PDF/A pour conservation, DOCX pour travail, XLSX pour tableaux",
      example: "02.01_2026-06-25_information-preoccupante_dupont_v1.0.pdf"
    },
    createdAt: "",
    closedAt: ""
  },
  documents: {},
  participants: {},
  votes: {},
  comments: {},
  parking: {},
  activity: {}
};
