import { FileText } from "lucide-react";

export function DocumentRail({

    documents,

    activeDocument,

    onSelect

}) {

    const classified = documents.filter(
        d => d.classificationFolderId
    ).length;

    return (

        <aside className="documentRail">

            <div className="railHeader">

                <div>

                    <h3>Documents</h3>

                    <small>

                        {classified} / {documents.length} classés

                    </small>

                </div>

            </div>

            <div className="railBody">

                {

                    documents.map(document => (

                        <button

                            key={document.id}

                            className={
                                activeDocument?.id === document.id
                                    ? "documentItem active"
                                    : "documentItem"
                            }

                            onClick={() => onSelect(document.id)}

                        >

                            <FileText size={18} />

                            <div className="documentInfos">

                                <strong>

                                    {document.name}

                                </strong>

                                <span>

                                    {

                                        document.classificationPath ||

                                        "Non classé"

                                    }

                                </span>

                            </div>

                        </button>

                    ))

                }

            </div>

        </aside>

    );

}