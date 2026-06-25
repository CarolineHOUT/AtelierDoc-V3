import { Card } from "../../components/ui/Card";

export function FolderProperties({

    folder,

    folders,

    api

}) {

    if (!folder) {

        return (

            <aside className="folderProperties">

                <Card>

                    <span className="eyebrow">

                        Propriétés

                    </span>

                    <h2>

                        Aucun dossier sélectionné

                    </h2>

                    <p>

                        Sélectionnez un dossier dans l'arborescence ou créez-en un nouveau.

                    </p>

                </Card>

            </aside>

        );

    }

   function update(field, value) {

    api.updateMeta({

        classificationFolders: folders.map(f =>

            f.id === folder.id

                ? {

                    ...f,

                    [field]: value

                }

                : f

        )

    });

}

    return (

        <aside className="folderProperties">

            <Card>

                <span className="eyebrow">

                    Dossier sélectionné

                </span>

                <h2>

                    {folder.name}

                </h2>

                <div className="folderForm">

                    <label>

                        <span>Nom du dossier</span>

                        <input

                            value={folder.name || ""}

                            onChange={(e) =>

                                update("name", e.target.value)

                            }

                        />

                    </label>

                    <label>

                        <span>Description</span>

                        <textarea

                            rows="4"

                            value={folder.description || ""}

                            onChange={(e) =>

                                update("description", e.target.value)

                            }

                        />

                    </label>

                    <label>

                        <span>Responsable</span>

                        <input

                            value={folder.owner || ""}

                            onChange={(e) =>

                                update("owner", e.target.value)

                            }

                        />

                    </label>

                    <label>

                        <span>Observations</span>

                        <textarea

                            rows="5"

                            value={folder.notes || ""}

                            onChange={(e) =>

                                update("notes", e.target.value)

                            }

                        />

                    </label>

                </div>

            </Card>

        </aside>

    );

}

/* ------------------------------- */

