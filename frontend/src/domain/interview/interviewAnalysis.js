import {
  INTERVIEW_BLOCKS,
  QUESTION_MAP,
  FIELD_MAP,
  formatAnswer,
  getPendingInfo,
  CLASSIFICATIONS,
} from './interviewSchema.js';

const FREQ_RULES = [
  { value: 5, pattern: /todos os dias|todo dia|diariamente|dia após dia|todo dia útil/i },
  { value: 4, pattern: /várias vezes por semana|varias vezes por semana|duas vezes por semana|três vezes por semana|tres vezes por semana|quase todo dia|quase diariamente/i },
  { value: 3, pattern: /semanalmente|toda semana|uma vez por semana|toda segunda|toda sexta|todo fim de semana/i },
  { value: 2, pattern: /mensalmente|todo mês|toda vez por mês|uma vez por mês/i },
  { value: 1, pattern: /menos de uma vez por mês|raramente|de vez em quando|pontualmente|aconteceu só uma vez|uma única vez/i },
  { value: 0, pattern: /nunca ocorreu|não chegou a ocorrer|não ocorre/i },
];

const IMPACT_RULES = [
  { value: 5, pattern: /paralisa|paralisou|parou a operação|interrompeu|interrompe a entrega|não entregamos|deixamos de entregar|perdemos um cliente|cliente cancelou/i },
  { value: 4, pattern: /afeta várias etapas|várias etapas|vários setores|prejudica o atendimento|atendimento parado|reclamação do cliente|cliente reclamou|perdemos prazo/i },
  { value: 3, pattern: /atraso|atrasou|atrasos|retrabalho|refazer|refizemos|perda de tempo|horas perdidas/i },
  { value: 2, pattern: /atrapalha|afeta a atividade|dificulta o trabalho|complica/i },
  { value: 1, pattern: /incômodo|incomoda|desconforto|pequeno incômodo/i },
];

function findMatch(text, rules) {
  if (!text) return null;
  for (const rule of rules) {
    const match = text.match(rule.pattern);
    if (match) {
      const start = Math.max(0, match.index - 60);
      const end = Math.min(text.length, match.index + match[0].length + 60);
      const snippet = (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '');
      return { value: rule.value, evidence: snippet };
    }
  }
  return null;
}

function clean(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join('; ');
  return typeof value === 'string' ? value.trim() : value === undefined || value === null ? '' : String(value);
}

function textOf(interview, fieldId) {
  const field = FIELD_MAP[fieldId];
  const raw = interview.answers?.[fieldId];
  if (!field) return clean(raw);
  return clean(formatAnswer(field, raw) ?? '');
}

function contextOf(interview, fieldId) {
  return clean(interview.contexts?.[fieldId] || '');
}

function makeDraft(partial) {
  return {
    id: `cand-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: '',
    description: '',
    understood: '',
    sourceQuestion: '',
    sourceField: '',
    sourceAnswer: '',
    sourceContext: '',
    evidence: '',
    consequence: '',
    relatedOutcome: '',
    whyAttention: '',
    openQuestions: '',
    classification: CLASSIFICATIONS.HYPOTHESIS,
    blocked: false,
    blockAction: '',
    notes: {},
    createdAt: new Date().toISOString(),
    ...partial,
  };
}

/**
 * Gera sugestões de candidatos com vínculo explícito às respostas de origem.
 * Sem IA disponível no projeto: a sugestão é feita por regras sobre o texto
 * gravado e precisa ser aceita e revisada pelo consultor. Nunca preenche
 * posições vazias apenas para completar cinco pontos.
 */
export function suggestCandidates(interview) {
  const drafts = [];
  const add = (partial) => drafts.push(makeDraft(partial));

  const motivo = textOf(interview, 'q2_motivo');
  const episodio = textOf(interview, 'q2_episodio');
  if (episodio) {
    add({
      title: motivo ? `Motivo da contratação: ${motivo}` : 'Motivo relatado para procurar a mentoria',
      description: episodio,
      understood: 'Cliente relata este episódio como o gatilho da contratação.',
      sourceQuestion: 'q2',
      sourceField: 'q2_episodio',
      sourceAnswer: episodio,
      sourceContext: contextOf(interview, 'q2_episodio'),
      evidence: episodio,
      consequence: contextOf(interview, 'q2_episodio'),
      classification: CLASSIFICATIONS.CLIENT_REPORT,
    });
  }

  const espera = textOf(interview, 'q5_atividadeEspera');
  if (espera) {
    add({
      title: 'Decisões e atividades que concentram no dono',
      description: espera,
      understood: 'Há atividades ou decisões que aguardam especificamente o entrevistado.',
      sourceQuestion: 'q5',
      sourceField: 'q5_atividadeEspera',
      sourceAnswer: espera,
      sourceContext: contextOf(interview, 'q5_atividadeEspera'),
      evidence: espera,
      classification: CLASSIFICATIONS.CLIENT_REPORT,
    });
  }

  const tempo = textOf(interview, 'q5_atividadeTempo');
  if (tempo) {
    add({
      title: 'Uso de tempo do dono em atividade operacional',
      description: tempo,
      understood: 'O entrevistado aponta esta atividade como a de maior consumo de tempo na última semana.',
      sourceQuestion: 'q5',
      sourceField: 'q5_atividadeTempo',
      sourceAnswer: tempo,
      sourceContext: contextOf(interview, 'q5_atividadeTempo'),
      evidence: tempo,
      classification: CLASSIFICATIONS.CLIENT_REPORT,
    });
  }

  const problema = textOf(interview, 'q7_problema');
  const exemplo = textOf(interview, 'q7_ultimoExemplo');
  const consequencia = textOf(interview, 'q7_consequencia');
  if (problema && problema !== 'Nenhum identificado.') {
    add({
      title: `Problema recorrente: ${problema.replace(/\.$/, '')}`,
      description: [exemplo, consequencia].filter(Boolean).join(' — '),
      understood: 'Problema apontado pelo cliente como o mais repetido na operação.',
      sourceQuestion: 'q7',
      sourceField: 'q7_ultimoExemplo',
      sourceAnswer: exemplo || problema,
      sourceContext: contextOf(interview, 'q7_problema'),
      evidence: [exemplo, consequencia].filter(Boolean).join(' | '),
      consequence: consequencia,
      classification: exemplarClassification(exemplo),
    });
  }

  const etapas = interview.answers?.q6_etapas || [];
  etapas.forEach((etapa, index) => {
    const esperaEtapa = clean(etapa.espera);
    if (!esperaEtapa) return;
    add({
      title: `Espera ou dificuldade na etapa ${index + 1} do atendimento`,
      description: [clean(etapa.oQueAconteceu), clean(etapa.quemExecutou)].filter(Boolean).join(' — '),
      understood: 'Dificuldade registrada no fluxo real de um atendimento recente.',
      sourceQuestion: 'q6',
      sourceField: 'q6_etapas',
      sourceAnswer: esperaEtapa,
      sourceContext: clean(etapa.oQueAconteceu),
      evidence: esperaEtapa,
      classification: CLASSIFICATIONS.CLIENT_REPORT,
    });
  });

  const dificultou = textOf(interview, 'q9_dificultou');
  if (dificultou) {
    add({
      title: 'O que dificultou a continuidade de melhorias anteriores',
      description: dificultou,
      understood: 'Tentativa anterior registrada, com obstáculo à continuidade.',
      sourceQuestion: 'q9',
      sourceField: 'q9_dificultou',
      sourceAnswer: dificultou,
      sourceContext: contextOf(interview, 'q9_dificultou'),
      evidence: dificultou,
      classification: CLASSIFICATIONS.CLIENT_REPORT,
    });
  }

  const orientacaoValor = interview.answers?.q8_orientacao;
  const orientacao = textOf(interview, 'q8_orientacao');
  if (orientacaoValor === 'verbal' || orientacaoValor === 'dono') {
    add({
      title: 'Orientação da equipe sem registro permanente',
      description: `Resposta registrada: ${orientacao}`,
      understood: 'Orientação e responsabilidades podem não estar registradas de forma durável.',
      sourceQuestion: 'q8',
      sourceField: 'q8_orientacao',
      sourceAnswer: orientacao,
      sourceContext: contextOf(interview, 'q8_orientacao'),
      evidence: [orientacao, contextOf(interview, 'q8_orientacao')].filter(Boolean).join(' | '),
      classification: CLASSIFICATIONS.HYPOTHESIS,
    });
  }

  const acompanhamento = textOf(interview, 'q8_acompanhamento');
  if (interview.answers?.q8_acompanhamento === 'nenhum') {
    add({
      title: 'Ausência de acompanhamento regular de pendências',
      description: 'Resposta registrada: Sem acompanhamento regular.',
      understood: 'Não há rotina definida de acompanhamento de pendências.',
      sourceQuestion: 'q8',
      sourceField: 'q8_acompanhamento',
      sourceAnswer: acompanhamento,
      sourceContext: contextOf(interview, 'q8_acompanhamento'),
      evidence: [acompanhamento, contextOf(interview, 'q8_acompanhamento')].filter(Boolean).join(' | '),
      classification: CLASSIFICATIONS.HYPOTHESIS,
    });
  }

  const limites = textOf(interview, 'q10_limites');
  if (limites) {
    add({
      title: 'Limites e condições declarados pela empresa',
      description: limites,
      understood: 'Condições que precisam ser respeitadas na execução.',
      sourceQuestion: 'q10',
      sourceField: 'q10_limites',
      sourceAnswer: limites,
      sourceContext: contextOf(interview, 'q10_limites'),
      evidence: limites,
      classification: CLASSIFICATIONS.CLIENT_REPORT,
    });
  }

  const existing = new Set(
    (interview.candidates || []).map((c) => `${c.sourceQuestion}|${c.sourceField}|${c.title}`.toLowerCase())
  );

  return drafts
    .filter((draft) => !existing.has(`${draft.sourceQuestion}|${draft.sourceField}|${draft.title}`.toLowerCase()))
    .map((draft) => {
      const notes = suggestNotes(draft);
      return { ...draft, notes };
    });
}

function exemplarClassification(text) {
  return text ? CLASSIFICATIONS.CLIENT_REPORT : CLASSIFICATIONS.HYPOTHESIS;
}

/**
 * Sugere notas apenas quando o texto gravado sustenta a leitura.
 * A sugestão é sempre acompanhada da evidência e precisa de confirmação.
 * Relação com o objetivo (R) e viabilidade (V) não são sugeridas: são
 * registros do consultor.
 */
export function suggestNotes(candidate) {
  const source = [candidate.sourceAnswer, candidate.sourceContext].filter(Boolean).join(' ');
  const notes = { ...(candidate.notes || {}) };

  const freq = findMatch(source, FREQ_RULES);
  if (freq && (!notes.F || notes.F.status === 'pending')) {
    notes.F = {
      status: 'pending',
      value: null,
      suggestion: freq.value,
      suggestionEvidence: freq.evidence,
      source: 'sugestao_resposta',
      needsReview: false,
    };
  }

  const impact = findMatch(source, IMPACT_RULES);
  if (impact && (!notes.I || notes.I.status === 'pending')) {
    notes.I = {
      status: 'pending',
      value: null,
      suggestion: impact.value,
      suggestionEvidence: impact.evidence,
      source: 'sugestao_resposta',
      needsReview: false,
    };
  }

  return notes;
}

export function suggestNoteFor(candidate, interview, key) {
  const scratch = suggestNotes({ ...candidate, notes: {} }, interview);
  return scratch[key] || null;
}

const SUMMARY_SECTIONS = [
  { id: 'alcance', label: 'Empresa e alcance inicial do trabalho' },
  { id: 'motivo', label: 'Motivo da contratação' },
  { id: 'expectativas', label: 'Expectativas sobre a mentoria' },
  { id: 'dificuldades', label: 'Principais dificuldades relatadas' },
  { id: 'dependencia', label: 'Dependência do dono e consequências para a operação' },
  { id: 'resultado6m', label: 'Resultado esperado ao final dos seis meses' },
  { id: 'primeirasSemanas', label: 'Mudança que o cliente deseja perceber nas primeiras semanas' },
  { id: 'pendentes', label: 'Informações que ainda precisam ser confirmadas' },
];

export { SUMMARY_SECTIONS };

function joinList(values) {
  const items = values.filter(Boolean);
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join('; ')} e ${items[items.length - 1]}.`;
}

/**
 * Monta o rascunho do resumo do entendimento a partir das respostas,
 * dos contextos e do estado da entrevista. O texto é editável pelo consultor
 * e separa relato do cliente de hipótese ainda não verificada.
 */
export function buildSummary(interview) {
  const a = interview.answers || {};
  const abrangencia = textOf(interview, 'q1_abrangencia');
  const multiplas = a.q1_abrangencia === 'multiplas';

  const alcanceParts = [];
  if (textOf(interview, 'q1_empresaNome')) alcanceParts.push(`empresa ${textOf(interview, 'q1_empresaNome')}`);
  if (multiplas) {
    const nomes = textOf(interview, 'q1_empresasNomes');
    const prioritaria = textOf(interview, 'q1_empresaPrioritaria');
    alcanceParts.push(
      `abrangência "${abrangencia}"${nomes ? ` (${nomes})` : ''}${prioritaria ? `, com foco inicial em ${prioritaria}` : ''}`
    );
  } else if (abrangencia) {
    alcanceParts.push(`abrangência "${abrangencia}"`);
  }
  const areas = (a.q1_areas || []).map((v) => FIELD_MAP.q1_areas?.options?.find((o) => o.value === v)?.label || v);
  if (areas.length) alcanceParts.push(`áreas: ${areas.join(', ')}`);
  if (textOf(interview, 'q1_equipe')) alcanceParts.push(`equipe de ${textOf(interview, 'q1_equipe')} pessoas`);

  const motivo = textOf(interview, 'q2_motivo');
  const episodio = textOf(interview, 'q2_episodio');
  const escopo = (a.q3_escopo || []).map(
    (v) => FIELD_MAP.q3_escopo?.options?.find((o) => o.value === v)?.label || v
  );

  const escala = a.q5_escala;
  const dependenciaLabel =
    FIELD_MAP.q5_escala?.options?.find((o) => o.value === escala)?.label || '';

  const pendentes = getPendingInfo(interview);

  return {
    generatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'alcance',
        label: SUMMARY_SECTIONS[0].label,
        basis: 'relato',
        text: alcanceParts.length
          ? `Foco inicial: ${alcanceParts.join('; ')}.`
          : 'Ainda não registrada. Confirmar empresa e alcance antes de fechar o entendimento.',
      },
      {
        id: 'motivo',
        label: SUMMARY_SECTIONS[1].label,
        basis: episodio ? 'relato' : 'pendente',
        text: [motivo ? `Motivo declarado: ${motivo}` : '', episodio ? `Episódio relatado: ${episodio}` : '']
          .filter(Boolean)
          .join(' ') || 'Não registrado na entrevista.',
      },
      {
        id: 'expectativas',
        label: SUMMARY_SECTIONS[2].label,
        basis: escopo.length ? 'relato' : 'pendente',
        text: [
          escopo.length ? `O que o cliente entende como incluído: ${joinList(escopo)}.` : '',
          textOf(interview, 'q3_promessaTipo')
            ? `Promessa apresentada: ${textOf(interview, 'q3_promessaTipo')}${
                textOf(interview, 'q3_promessaTexto') ? ` — ${textOf(interview, 'q3_promessaTexto')}` : ''
              }.`
            : '',
          textOf(interview, 'q3_situacaoContrato')
            ? `Conferência interna: ${textOf(interview, 'q3_situacaoContrato')}.`
            : '',
        ]
          .filter(Boolean)
          .join(' ') || 'Não registrado na entrevista.',
      },
      {
        id: 'dificuldades',
        label: SUMMARY_SECTIONS[3].label,
        basis: 'relato',
        text: [
          textOf(interview, 'q7_problema') ? `Problema mais repetido: ${textOf(interview, 'q7_problema')}` : '',
          textOf(interview, 'q7_ultimoExemplo') ? `Último exemplo: ${textOf(interview, 'q7_ultimoExemplo')}` : '',
          textOf(interview, 'q7_consequencia') ? `Consequência relatada: ${textOf(interview, 'q7_consequencia')}` : '',
          textOf(interview, 'q9_dificultou') ? `Continuidade de tentativas anteriores: ${textOf(interview, 'q9_dificultou')}` : '',
        ]
          .filter(Boolean)
          .join(' ') || 'Não registrado na entrevista.',
      },
      {
        id: 'dependencia',
        label: SUMMARY_SECTIONS[4].label,
        basis: 'relato',
        text: [
          dependenciaLabel ? `Nível declarado de dependência do dono: ${dependenciaLabel}` : '',
          textOf(interview, 'q5_atividadeTempo') ? `Maior consumo de tempo: ${textOf(interview, 'q5_atividadeTempo')}` : '',
          textOf(interview, 'q5_atividadeEspera') ? `O que espera por ele: ${textOf(interview, 'q5_atividadeEspera')}` : '',
        ]
          .filter(Boolean)
          .join(' ') || 'Não registrado na entrevista.',
      },
      {
        id: 'resultado6m',
        label: SUMMARY_SECTIONS[5].label,
        basis: 'relato',
        text:
          [textOf(interview, 'q4_mudanca'), textOf(interview, 'q4_verificacao')]
            .filter(Boolean)
            .join(' Como verificar: ') || 'Não registrado na entrevista.',
      },
      {
        id: 'primeirasSemanas',
        label: SUMMARY_SECTIONS[6].label,
        basis: 'relato',
        text:
          [textOf(interview, 'q11_mudanca'), textOf(interview, 'q11_evidencia')]
            .filter(Boolean)
            .join(' Evidência esperada: ') || 'Não registrado na entrevista.',
      },
      {
        id: 'pendentes',
        label: SUMMARY_SECTIONS[7].label,
        basis: 'pendente',
        text: pendentes.length ? pendentes.map((p) => `• ${p}`).join('\n') : 'Nenhuma pendência de informação registrada.',
      },
    ],
  };
}

export function summaryText(summary) {
  if (!summary) return '';
  if (summary.text) return summary.text;
  return (summary.sections || []).map((s) => `${s.label}\n${s.text}`).join('\n\n');
}

/**
 * Prioridades em linguagem para o cliente: sem fórmulas, pesos ou notas.
 */
export function buildClientPriorities(interview, ranking) {
  return (ranking.approved || []).map((item) => ({
    position: item.position,
    title: item.title,
    understood: item.understood || item.description || '',
    evidence: [item.sourceAnswer, item.sourceContext].filter(Boolean).join(' '),
    consequence: item.consequence || '',
    whyAttention: item.whyAttention || '',
    relatedOutcome: item.relatedOutcome || '',
    openQuestions: item.openQuestions || '',
    classification: item.classification,
  }));
}

export function criteriaExplainedPlain() {
  return [
    'Impacto na operação: o quanto o problema atrapalha o dia a dia da empresa.',
    'Frequência do problema: com que regularidade ele aparece.',
    'Relação com o resultado que o cliente busca: o quanto o tema contribui para o que ele quer alcançar.',
    'Condições para começar a tratar o tema: se já existem responsável, acesso e disponibilidade.',
  ];
}

export function countByClassification(interview) {
  const counts = {};
  Object.values(CLASSIFICATIONS).forEach((c) => {
    counts[c] = 0;
  });
  (interview.candidates || []).forEach((c) => {
    const key = c.classification || CLASSIFICATIONS.HYPOTHESIS;
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

export function textSummary(value, max = 140) {
  const text = clean(value);
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
}

export function listQuestionHeadings() {
  return INTERVIEW_BLOCKS.map((block) => ({
    id: block.id,
    title: block.title,
    questions: block.questions.map((q) => ({ id: q.id, title: q.title, why: q.why })),
  }));
}

export function getQuestionTitle(questionId) {
  return QUESTION_MAP[questionId]?.title || questionId;
}
