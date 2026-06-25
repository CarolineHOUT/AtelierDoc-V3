import { useState } from "react";
import { Button } from "../../components/ui/Button";

export function FolderTree({
folders,
documents,
activeFolder,
setActiveFolder,
activeDocument,
onAssignDocument,
api
}) {
const [showDialog, setShowDialog] = useState(false);
const [parentForNewFolder, setParentForNewFolder] = useState("");
const [newFolder, setNewFolder] = useState("");

function openRootDialog() {
setParentForNewFolder("");
setNewFolder("");
setShowDialog(true);
}

function openSubFolderDialog() {
if (!activeFolder) return;
setParentForNewFolder(activeFolder.id);
setNewFolder("");
setShowDialog(true);
}

function closeDialog() {
setShowDialog(false);
setParentForNewFolder("");
setNewFolder("");
}

function createFolder() {
if (!newFolder.trim()) return;

const folder = {
id: crypto.randomUUID(),
name: newFolder.trim(),
parentId: parentForNewFolder,
description: "",
owner: "",
notes: ""
};

api.updateMeta({
classificationFolders: [...folders, folder]
});

setActiveFolder(folder.id);
closeDialog();
}

function removeFolder(id) {
const hasChildren = folders.some(f => f.parentId === id);
const hasDocuments = documents.some(d => d.classificationFolderId === id);

if (hasChildren) {
alert("Supprimez d'abord les sous-dossiers.");
return;
}

if (hasDocuments) {
alert("Des documents sont encore affectés à ce dossier.");
return;
}

api.updateMeta({
classificationFolders: folders.filter(f => f.id !== id)
});

if (activeFolder?.id === id) setActiveFolder("");
}

function countDocuments(folderId) {
return documents.filter(d => d.classificationFolderId === folderId).length;
}

function getParentName(parentId) {
if (!parentId) return "racine";
return folders.find(f => f.id === parentId)?.name || "dossier sélectionné";
}

function renderNode(parentId = "") {
return folders
.filter(folder => folder.parentId === parentId)
.map(folder => (
<div key={folder.id} className="treeNode">
<div
className={activeFolder?.id === folder.id ? "treeItem active" : "treeItem"}
onClick={() => setActiveFolder(folder.id)}
>
<span>📁</span>
<strong>{folder.name}</strong>
<small>{countDocuments(folder.id)}</small>

<button
className="deleteFolder"
onClick={(e) => {
e.stopPropagation();
removeFolder(folder.id);
}}
title="Supprimer le dossier"
>
✕
</button>
</div>

<div className="treeChildren">{renderNode(folder.id)}</div>
</div>
));
}

return (
<section className="folderTree">
<header className="treeHeader">
<div>
<h3>Plan de classement ASE</h3>
<small>Créez uniquement les dossiers validés pendant l'atelier.</small>
</div>
</header>

<div className="treeToolbar">
<Button variant="primary" onClick={openRootDialog}>
+ Nouveau dossier
</Button>

{activeFolder && (
<Button onClick={openSubFolderDialog}>
+ Sous-dossier
</Button>
)}

{activeFolder && activeDocument && (
<Button onClick={onAssignDocument}>
Affecter le document
</Button>
)}
</div>

{activeFolder && activeDocument && (
<div className="assignmentHint">
<span>Document sélectionné :</span>
<strong>{activeDocument.name}</strong>
<span>→ Dossier :</span>
<strong>{activeFolder.name}</strong>
</div>
)}

{showDialog && (
<div className="folderDialog">
<div className="folderDialogContent">
<h3>{parentForNewFolder ? "Nouveau sous-dossier" : "Nouveau dossier"}</h3>

<p className="muted">
Création dans : <strong>{getParentName(parentForNewFolder)}</strong>
</p>

<input
autoFocus
placeholder="Nom du dossier"
value={newFolder}
onChange={(e) => setNewFolder(e.target.value)}
onKeyDown={(e) => {
if (e.key === "Enter") createFolder();
if (e.key === "Escape") closeDialog();
}}
/>

<div className="dialogButtons">
<Button onClick={closeDialog}>Annuler</Button>
<Button variant="primary" onClick={createFolder}>Créer</Button>
</div>
</div>
</div>
)}

<div className="treeBody">
{folders.length === 0 ? (
<div className="treeEmpty">
<h3>Aucun dossier</h3>
<p>Commencez par créer le premier dossier validé avec les équipes.</p>
</div>
) : (
renderNode()
)}
</div>
</section>
);
}
