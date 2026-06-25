import { useEffect, useMemo, useState } from "react";
import { onValue, push, ref, remove, set, update } from "firebase/database";
import { db } from "../../services/firebase/firebase";
import { seed } from "./seed";

const WORKSHOP_ID = "atelierdoc-v2-ase-2026";
const root = `atelierdocV2/workshops/${WORKSHOP_ID}`;

const now = () => new Date().toLocaleString("fr-FR");
const clone = x => JSON.parse(JSON.stringify(x));

export function useAtelier() {
  const [state, setState] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onValue(ref(db, root), async snap => {
      if (!snap.exists()) {
        const s = clone(seed);
        s.meta.createdAt = now();
        await set(ref(db, root), s);
        return;
      }
      setState(snap.val());
      setReady(true);
    });
    return () => unsub();
  }, []);

  const api = useMemo(() => {
    async function log(type, text, detail="") {
      const r = push(ref(db, `${root}/activity`));
      await set(r, { id:r.key, type, text, detail, at:now() });
    }

    return {
      log,
      setActiveDocument: id => update(ref(db, `${root}/meta`), { activeDocumentId:id }),
      setPublicUrl: publicUrl => update(ref(db, `${root}/meta`), { publicUrl }),
      updateMeta: patch => update(ref(db, `${root}/meta`), patch),

      async join(participant) {
        await set(ref(db, `${root}/participants/${participant.id}`), participant);
        await log("participant", `${participant.name} a rejoint l’atelier`);
      },

      async vote(documentId, participant, value) {
        const id = `${documentId}_${participant.id}`;
        await set(ref(db, `${root}/votes/${id}`), { id, documentId, participantId:participant.id, participantName:participant.name, value, at:now() });
        await log("vote", `${participant.name} vote : ${value}`);
      },

      async comment(documentId, author, text) {
        const r = push(ref(db, `${root}/comments`));
        await set(r, { id:r.key, documentId, author, text, at:now() });
        await log("comment", `${author} ajoute une remarque`, text);
      },

      async parking(documentId, author, reason="À arbitrer") {
        const r = push(ref(db, `${root}/parking`));
        await set(r, { id:r.key, documentId, author, reason, at:now() });
        await log("parking", `${author} envoie au parking`);
      },

      async createDocument(doc) {
        const r = push(ref(db, `${root}/documents`));
        const payload = {
          id:r.key, order: Date.now(), name:doc.name || "Nouveau document",
          family:doc.family || "À qualifier", stage:doc.stage || "À qualifier",
          authority:doc.authority || "À expertiser", sensitivity:doc.sensitivity || "À qualifier",
          decision:"", justification:"", retention:doc.retention || "À qualifier", access:doc.access || "À qualifier",
          retentionDuration:doc.retentionDuration || "", retentionTrigger:doc.retentionTrigger || "À expertiser",
          administrativeDuration:doc.administrativeDuration || "", finalDisposition:doc.finalDisposition || "À expertiser",
          retentionJustification:doc.retentionJustification || "", classificationCode:doc.classificationCode || "",
          classificationPath:doc.classificationPath || "", keywords:doc.keywords || "",
          createdAt:now()
        };
        await set(r, payload);
        await log("document", `Document ajouté : ${payload.name}`);
      },

      async updateDocument(id, patch) {
        await update(ref(db, `${root}/documents/${id}`), { ...patch, updatedAt:now() });
        await log("document", `Document modifié`);
      },

      async deleteDocument(id) {
        await remove(ref(db, `${root}/documents/${id}`));
        await log("document", `Document supprimé`);
      },

      async decide(documentId, decision, justification="") {
        await update(ref(db, `${root}/documents/${documentId}`), { decision, justification, decidedAt:now() });
        await log("decision", `Décision validée : ${decision}`);
      },

      async resetContributions() {
        await set(ref(db, `${root}/participants`), {});
        await set(ref(db, `${root}/votes`), {});
        await set(ref(db, `${root}/comments`), {});
        await set(ref(db, `${root}/parking`), {});
        await log("reset", "Participants et contributions réinitialisés");
      },

      async close() {
        await update(ref(db, `${root}/meta`), { status:"closed", closedAt:now() });
        await log("close", "Atelier clôturé");
      }
    };
  }, []);

  return { state, ready, api };
}
