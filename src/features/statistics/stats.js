import { DECISIONS } from "../workshop/seed";

export const list = obj => Object.values(obj || {});

export function votesFor(state, documentId) {
  return list(state.votes).filter(v => v.documentId === documentId);
}

export function commentsFor(state, documentId) {
  return list(state.comments).filter(c => c.documentId === documentId);
}

export function voteCounts(state, documentId) {
  const counts = Object.fromEntries(DECISIONS.map(d => [d, 0]));
  votesFor(state, documentId).forEach(v => { if (counts[v.value] !== undefined) counts[v.value] += 1; });
  return counts;
}

export function consensus(state, documentId) {
  const counts = voteCounts(state, documentId);
  const total = Object.values(counts).reduce((a,b)=>a+b,0);
  if (!total) return 0;
  return Math.round(Math.max(...Object.values(counts)) / total * 100);
}

export function trend(state, documentId) {
  const entries = Object.entries(voteCounts(state, documentId)).sort((a,b)=>b[1]-a[1]);
  return entries[0]?.[1] ? entries[0][0] : "En cours";
}

export function stats(state) {
  const docs = list(state.documents);
  const participants = list(state.participants);
  const votes = list(state.votes);
  const comments = list(state.comments);
  const parking = list(state.parking);
  const decided = docs.filter(d => d.decision).length;
  const consensusValues = docs.map(d => consensus(state, d.id)).filter(Boolean);
  const avgConsensus = consensusValues.length ? Math.round(consensusValues.reduce((a,b)=>a+b,0)/consensusValues.length) : 0;
  const arbitration = docs.filter(d => votesFor(state,d.id).length && consensus(state,d.id) < 60).length;
  const quality = Math.round(
    (docs.length ? decided/docs.length : 0)*45 +
    (avgConsensus/100)*30 +
    (parking.length ? Math.max(0, 15 - parking.length*3) : 15) +
    (arbitration ? Math.max(0, 10 - arbitration*2) : 10)
  );
  return {
    docs: docs.length,
    participants: participants.length,
    votes: votes.length,
    comments: comments.length,
    parking: parking.length,
    decided,
    progress: docs.length ? Math.round(decided/docs.length*100) : 0,
    avgConsensus,
    arbitration,
    quality,
    remaining: docs.length - decided,
    distribution: Object.fromEntries(DECISIONS.map(d => [d, docs.filter(x => x.decision === d).length]))
  };
}
