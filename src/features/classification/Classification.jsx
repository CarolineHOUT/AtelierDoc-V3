import { useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { list } from "../statistics/stats";

import { DocumentRail } from "./DocumentRail";
import { FolderTree } from "./FolderTree";
import { FolderProperties } from "./FolderProperties";

import "./classification.css";

function getFolderPath(folderId, folders) {
const folder = folders.find(f => f.id === folderId);
if (!folder) return "";

if (!folder.parentId) return folder.name;

return `${getFolderPath(folder.parentId, folders)} / ${folder.name}`;
}

export function Classification({ state, api, setPage }) {
const documents = useMemo(
() => list(state.documents).sort((a, b) => (a.order || 0) - (b.order || 0)),
[state.documents]
);

const folders = state.meta.classificationFolders || [];

const [selectedDocumentId, setSelectedDocumentId] = useState(
documents[0]?.id || ""
);

const [selectedFolderId, setSelectedFolderId] = useState("");

const activeDocument = state.documents[selectedDocumentId] || documents[0];
const activeFolder = folders.find(f => f.id === selectedFolderId) || null;

function assignDocumentToFolder() {
if (!activeDocument || !activeFolder) return;

api.updateDocument(activeDocument.id, {
classificationFolderId: activeFolder.id,
classificationPath: getFolderPath(activeFolder.id, folders)
});
}

if (!documents.length) {
return (
<div className="page">
<header className="pageHeader">
<div>
<span className="eyebrow">Plan de classement</span>
<h1>Plan de classement</h1>
<p>Commencez par définir les documents attendus.</p>
</div>
</header>
</div>
);
}

return (
<div className="page">
<header className="pageHeader">
<div>
<span className="eyebrow">Atelier ASE</span>
<h1>Plan de classement</h1>
<p>
Construisez progressivement l’arborescence à partir des documents
identifiés avec les équipes.
</p>
</div>

<Button
onClick={() => {
api.updateMeta({
projectionMode: "classification",
activeDocumentId: activeDocument.id
});
setPage("projection");
}}
>
Mode projection
</Button>
</header>

<section className="classificationWorkspace">
<DocumentRail
documents={documents}
activeDocument={activeDocument}
onSelect={setSelectedDocumentId}
/>

<FolderTree
folders={folders}
documents={documents}
activeFolder={activeFolder}
setActiveFolder={setSelectedFolderId}
activeDocument={activeDocument}
onAssignDocument={assignDocumentToFolder}
api={api}
/>

<FolderProperties folder={activeFolder} folders={folders} api={api} />
</section>
</div>
);
}
