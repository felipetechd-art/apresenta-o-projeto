/**
 * Índice de prioridade de execução — regra interna proposta.
 *
 * Não é avaliação científica, prova de causalidade ou promessa de resultado.
 * Os pesos são escolhas iniciais da ferramenta e ficam registrados em
 * "Como calculamos", com a versão utilizada em cada entrevista.
 */

export const WEIGHTS_VERSION = 'v1';

export const DEFAULT_WEIGHTS = {
  version: WEIGHTS_VERSION,
  importance: { I: 0.6, F: 0.2, R: 0.2 },
  priority: { I: 0.35, F: 0.2, R: 0.25, V: 0.2 },
  importanceThreshold: 60,
  editableBy: 'admin',
};

export const NOTE_STATUS = {
  PENDING: 'pending',
  SET: 'set',
  UNKNOWN: 'unknown',
};

export const UNKNOWN_LABEL = 'Ainda não sabemos';

export function createEmptyNotes() {
  return {
    I: { status: NOTE_STATUS.PENDING, value: null, evidence: '', source: '', needsReview: false },
    F: { status: NOTE_STATUS.PENDING, value: null, evidence: '', source: '', needsReview: false },
    R: { status: NOTE_STATUS.PENDING, value: null, evidence: '', source: '', needsReview: false },
    V: { status: NOTE_STATUS.PENDING, value: null, evidence: '', source: '', needsReview: false },
  };
}

function normalizeNotes(candidate) {
  const base = createEmptyNotes();
  const notes = candidate.notes || {};
  Object.keys(base).forEach((key) => {
    const incoming = notes[key];
    if (!incoming) return;
    base[key] = {
      status: incoming.status || (Number.isInteger(incoming.value) ? NOTE_STATUS.SET : NOTE_STATUS.PENDING),
      value: Number.isInteger(incoming.value) ? incoming.value : null,
      evidence: incoming.evidence || '',
      source: incoming.source || '',
      suggestion: incoming.suggestion || null,
      suggestionEvidence: incoming.suggestionEvidence || '',
      confirmed: incoming.confirmed === true,
      needsReview: incoming.needsReview === true,
      author: incoming.author || '',
      at: incoming.at || null,
    };
  });
  return base;
}

function numericValue(note) {
  if (!note || note.status !== NOTE_STATUS.SET) return null;
  if (!Number.isInteger(note.value)) return null;
  if (note.value < 0 || note.value > 5) return null;
  return note.value;
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function hasCompleteNotes(notes, keys) {
  return keys.every((key) => numericValue(notes[key]) !== null);
}

/**
 * Importância = 100 × [(0,60 × I + 0,20 × F + 0,20 × R) ÷ 5]
 * Retorna null quando qualquer um dos critérios está ausente.
 */
export function calcImportance(candidate, weights = DEFAULT_WEIGHTS) {
  const notes = normalizeNotes(candidate);
  const values = {
    I: numericValue(notes.I),
    F: numericValue(notes.F),
    R: numericValue(notes.R),
  };
  if (values.I === null || values.F === null || values.R === null) return null;
  const w = weights.importance || DEFAULT_WEIGHTS.importance;
  const weighted = w.I * values.I + w.F * values.F + w.R * values.R;
  return round1(100 * (weighted / 5));
}

/**
 * Prioridade de execução = 100 × [(0,35 × I + 0,20 × F + 0,25 × R + 0,20 × V) ÷ 5]
 * Retorna null quando qualquer um dos quatro critérios está ausente.
 */
export function calcPriority(candidate, weights = DEFAULT_WEIGHTS) {
  const notes = normalizeNotes(candidate);
  const values = {
    I: numericValue(notes.I),
    F: numericValue(notes.F),
    R: numericValue(notes.R),
    V: numericValue(notes.V),
  };
  if (Object.values(values).some((v) => v === null)) return null;
  const w = weights.priority || DEFAULT_WEIGHTS.priority;
  const weighted = w.I * values.I + w.F * values.F + w.R * values.R + w.V * values.V;
  return round1(100 * (weighted / 5));
}

export function getNoteValue(candidate, key) {
  return numericValue(normalizeNotes(candidate)[key]);
}

export function noteIsUnknown(candidate, key) {
  return normalizeNotes(candidate)[key].status === NOTE_STATUS.UNKNOWN;
}

export function scoreCandidate(candidate, weights = DEFAULT_WEIGHTS) {
  const notes = normalizeNotes(candidate);
  return {
    notes,
    importance: calcImportance(candidate, weights),
    priority: calcPriority(candidate, weights),
  };
}

/**
 * Elegibilidade para entrar no ranking dos cinco pontos:
 * - notas completas (os quatro critérios);
 * - viabilidade igual ou superior a 3;
 * - ausência de bloqueio que impeça a ação;
 * - vínculo com uma resposta ou evidência registrada.
 */
export function eligibility(candidate) {
  const notes = normalizeNotes(candidate);
  const complete = hasCompleteNotes(notes, ['I', 'F', 'R', 'V']);
  const V = numericValue(notes.V);
  const blocked = candidate.blocked === true;
  const linked =
    Boolean(candidate.sourceQuestion) &&
    (Boolean(candidate.sourceAnswer) || Boolean(candidate.sourceContext) || Boolean(candidate.evidence));

  const reasons = [];
  if (!complete) reasons.push('Notas incompletas.');
  if (V !== null && V < 3) reasons.push('Viabilidade abaixo de 3.');
  if (V === null) reasons.push('Viabilidade ainda não definida.');
  if (blocked) reasons.push(candidate.blockAction || 'Bloqueio registrado que impede a ação proposta.');
  if (!linked) reasons.push('Sem vínculo com resposta ou evidência registrada.');

  return {
    eligible: complete && V !== null && V >= 3 && !blocked && linked,
    complete,
    viable: V !== null && V >= 3,
    blocked,
    linked,
    reasons,
  };
}

export function isImportantButDependent(candidate, weights = DEFAULT_WEIGHTS) {
  const status = eligibility(candidate);
  if (status.eligible) return false;
  const importance = calcImportance(candidate, weights);
  if (importance === null) return false;
  return importance >= (weights.importanceThreshold ?? DEFAULT_WEIGHTS.importanceThreshold);
}

/**
 * Ordenação do ranking:
 * 1. prioridade de execução (desc)
 * 2. maior importância
 * 3. maior relação com o objetivo (R)
 * 4. maior viabilidade (V)
 * 5. decisão do consultor (manualOrder)
 */
export function compareCandidates(a, b, weights = DEFAULT_WEIGHTS, manualOrder = []) {
  const sa = scoreCandidate(a, weights);
  const sb = scoreCandidate(b, weights);

  const pa = sa.priority ?? -1;
  const pb = sb.priority ?? -1;
  if (pa !== pb) return pb - pa;

  const ia = sa.importance ?? -1;
  const ib = sb.importance ?? -1;
  if (ia !== ib) return ib - ia;

  const ra = getNoteValue(a, 'R');
  const rb = getNoteValue(b, 'R');
  if ((ra ?? -1) !== (rb ?? -1)) return (rb ?? -1) - (ra ?? -1);

  const va = getNoteValue(a, 'V');
  const vb = getNoteValue(b, 'V');
  if ((va ?? -1) !== (vb ?? -1)) return (vb ?? -1) - (va ?? -1);

  const oa = manualOrder.indexOf(a.id);
  const ob = manualOrder.indexOf(b.id);
  const ra2 = oa === -1 ? Number.MAX_SAFE_INTEGER : oa;
  const rb2 = ob === -1 ? Number.MAX_SAFE_INTEGER : ob;
  if (ra2 !== rb2) return ra2 - rb2;

  return String(a.title || '').localeCompare(String(b.title || ''), 'pt-BR');
}

export function buildRanking(interview, weights = null) {
  const activeWeights = weights || interview.weights || DEFAULT_WEIGHTS;
  const candidates = (interview.candidates || []).map((candidate) => {
    const scored = scoreCandidate(candidate, activeWeights);
    const status = eligibility(candidate);
    return {
      ...candidate,
      importance: scored.importance,
      priority: scored.priority,
      eligibility: status,
      importantButDependent: isImportantButDependent(candidate, activeWeights),
    };
  });

  const eligible = candidates
    .filter((c) => c.eligibility.eligible)
    .sort((a, b) => compareCandidates(a, b, activeWeights, interview.manualOrder || []));

  const blocked = candidates
    .filter((c) => c.eligibility.blocked)
    .sort((a, b) => compareCandidates(a, b, activeWeights, interview.manualOrder || []));

  const preparation = candidates
    .filter((c) => !c.eligibility.eligible && !c.eligibility.blocked && c.importantButDependent)
    .sort((a, b) => compareCandidates(a, b, activeWeights, interview.manualOrder || []));

  const pending = candidates.filter(
    (c) => !c.eligibility.eligible && !c.eligibility.blocked && !c.importantButDependent
  );

  const top = eligible.slice(0, 5);

  const calculatedOrder = top.map((c) => c.id);
  const approved = approvedOrder(interview, top);

  return {
    weights: activeWeights,
    candidates,
    eligible,
    top,
    blocked,
    preparation,
    pending,
    calculatedOrder,
    approved,
    hasFewerThanFive: top.length < 5,
    missingDataNote:
      top.length < 5
        ? `Somente ${top.length} ponto(s) sustentado(s) pelos dados registrados. Faltam informações para identificar outros.`
        : '',
  };
}

export function approvedOrder(interview, top) {
  const manual = interview.manualOrder || [];
  const calculated = top.map((c) => c.id);
  const byId = Object.fromEntries(top.map((c) => [c.id, c]));

  const manualPresent = calculated
    .filter((id) => manual.includes(id))
    .sort((a, b) => manual.indexOf(a) - manual.indexOf(b));
  const rest = calculated.filter((id) => !manual.includes(id));
  const approvedIds = [...manualPresent, ...rest];

  return approvedIds.map((id, index) => {
    const calculatedPosition = calculated.indexOf(id) + 1;
    const position = index + 1;
    return {
      ...byId[id],
      position,
      calculatedPosition,
      overridden: position !== calculatedPosition,
    };
  });
}

export function describeWeights(weights = DEFAULT_WEIGHTS) {
  const w = weights || DEFAULT_WEIGHTS;
  const fmt = (n) => String(n).replace('.', ',');
  return {
    version: w.version,
    lines: [
      `Importância = 100 × [(${fmt(w.importance.I)} × I + ${fmt(w.importance.F)} × F + ${fmt(w.importance.R)} × R) ÷ 5]`,
      `Prioridade de execução = 100 × [(${fmt(w.priority.I)} × I + ${fmt(w.priority.F)} × F + ${fmt(w.priority.R)} × R + ${fmt(w.priority.V)} × V) ÷ 5]`,
    ],
    eligibility: [
      'Notas completas nos quatro critérios.',
      'Viabilidade igual ou superior a 3.',
      'Ausência de bloqueio que impeça a ação proposta.',
      'Vínculo com uma resposta ou evidência registrada.',
    ],
    tiebreak: [
      'Maior importância.',
      'Maior relação com o objetivo.',
      'Maior viabilidade.',
      'Em empate persistente, decisão do consultor.',
    ],
  };
}

export function newVersionedWeights(nextWeights, previous = DEFAULT_WEIGHTS) {
  const base = previous || DEFAULT_WEIGHTS;
  const version = `v${(parseInt(String(base.version || 'v1').replace('v', ''), 10) || 1) + 1}`;
  return {
    version,
    importance: { ...base.importance, ...(nextWeights.importance || {}) },
    priority: { ...base.priority, ...(nextWeights.priority || {}) },
    importanceThreshold: nextWeights.importanceThreshold ?? base.importanceThreshold,
    editableBy: 'admin',
    updatedAt: new Date().toISOString(),
  };
}

export function markNotesForReview(interview, changedQuestionIds) {
  const changed = new Set(changedQuestionIds);
  if (changed.size === 0) return { interview, count: 0 };
  let count = 0;
  const candidates = (interview.candidates || []).map((candidate) => {
    if (!candidate.sourceQuestion || !changed.has(candidate.sourceQuestion)) return candidate;
    const notes = normalizeNotes(candidate);
    let touched = false;
    Object.keys(notes).forEach((key) => {
      if (notes[key].status !== NOTE_STATUS.PENDING) {
        notes[key] = { ...notes[key], needsReview: true };
        touched = true;
      }
    });
    if (touched) count += 1;
    return { ...candidate, notes };
  });
  return { interview: { ...interview, candidates }, count };
}
