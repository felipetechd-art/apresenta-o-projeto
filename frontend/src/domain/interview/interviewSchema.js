export const OPENING_TEXT =
  'Vamos entender sua empresa, o que você espera deste trabalho e onde podemos começar a gerar uma melhoria concreta. Vamos mapear os problemas e oportunidades e priorizar a execução ao longo dos seis meses.';

export const CLOSING_MESSAGE =
  'Este documento registra o que entendemos sobre sua empresa, os resultados que você busca e os pontos prioritários que deverão orientar nosso trabalho. Após confirmar esse entendimento, vamos elaborar o plano de execução, considerando as prioridades, as condições da empresa e o escopo contratado para os seis meses.';

export const INTERVIEW_STATUS = {
  DRAFT: 'em_preenchimento',
  ANALYSIS: 'analise_consultor',
  WAITING: 'aguardando_confirmacao',
  CHANGES: 'ajustes_solicitados',
  CONFIRMED: 'confirmado',
};

export const STATUS_LABELS = {
  [INTERVIEW_STATUS.DRAFT]: 'Em preenchimento',
  [INTERVIEW_STATUS.ANALYSIS]: 'Em análise pelo consultor',
  [INTERVIEW_STATUS.WAITING]: 'Aguardando confirmação do cliente',
  [INTERVIEW_STATUS.CHANGES]: 'Ajustes solicitados',
  [INTERVIEW_STATUS.CONFIRMED]: 'Entendimento confirmado',
};

export const STATUS_ORDER = [
  INTERVIEW_STATUS.DRAFT,
  INTERVIEW_STATUS.ANALYSIS,
  INTERVIEW_STATUS.WAITING,
  INTERVIEW_STATUS.CHANGES,
  INTERVIEW_STATUS.CONFIRMED,
];

export const CLASSIFICATIONS = {
  CLIENT_REPORT: 'Relato do cliente',
  HYPOTHESIS: 'Hipótese a confirmar',
  CONFIRMED: 'Confirmado pelo consultor',
};

export const CRITERIA = [
  {
    key: 'I',
    name: 'Impacto operacional',
    short: 'Impacto',
    scale: [
      'sem consequência identificada',
      'incômodo localizado',
      'afeta uma atividade, com alternativa simples',
      'provoca atraso ou retrabalho relevante',
      'afeta várias etapas ou prejudica o atendimento',
      'interrompe uma entrega importante ou paralisa a operação',
    ],
  },
  {
    key: 'F',
    name: 'Frequência do problema',
    short: 'Frequência',
    scale: [
      'não ocorreu no período observado',
      'menos de uma vez por mês',
      'mensalmente',
      'semanalmente',
      'várias vezes por semana',
      'diariamente',
    ],
  },
  {
    key: 'R',
    name: 'Relação com o resultado esperado',
    short: 'Relação',
    scale: [
      'sem relação identificada',
      'relação indireta pequena',
      'contribui parcialmente',
      'contribuição relevante',
      'ligação direta com o objetivo principal',
      'essencial ao objetivo principal e ao primeiro resultado desejado',
    ],
  },
  {
    key: 'V',
    name: 'Viabilidade de começar nas primeiras semanas',
    short: 'Viabilidade',
    scale: [
      'impedimento confirmado para começar',
      'depende de condição externa sem previsão',
      'depende de várias condições ainda não resolvidas',
      'executável após preparação ou aprovação identificada',
      'condições principais disponíveis, com uma pequena dependência',
      'responsável, acesso e disponibilidade confirmados para começar',
    ],
  },
];

const OPT = (value, label) => ({ value, label });

const AREAS = [
  OPT('comercial', 'Comercial'),
  OPT('atendimento', 'Atendimento'),
  OPT('operacoes', 'Operações'),
  OPT('administrativo', 'Administrativo'),
  OPT('tecnologia', 'Tecnologia'),
  OPT('outras', 'Outras'),
];

const MOTIVOS = [
  OPT('rotina_operacional', 'Rotina tomada pelo operacional.'),
  OPT('dependencia_dono', 'Equipe muito dependente do dono.'),
  OPT('desorganizacao', 'Desorganização, atrasos ou retrabalho.'),
  OPT('atendimento_vendas', 'Dificuldades no atendimento ou nas vendas.'),
  OPT('crescimento', 'Crescimento difícil de sustentar.'),
  OPT('outro', 'Outro.'),
];

const ESCOPO_ENTREGA = [
  OPT('diagnostico', 'Diagnóstico e plano de ação.'),
  OPT('processos', 'Organização de processos e responsabilidades.'),
  OPT('implementacao', 'Implementação pela consultoria.'),
  OPT('treinamento', 'Treinamento da equipe.'),
  OPT('tecnologia', 'Configuração ou implantação de tecnologia.'),
  OPT('acompanhamento', 'Acompanhamento da execução.'),
  OPT('sem_clareza', 'Ainda não tenho clareza.'),
  OPT('outra', 'Outra entrega.'),
];

const ESCALA_DEPENDENCIA = [
  OPT('0', '0 — A rotina segue sem minha participação.'),
  OPT('1', '1 — Sou acionado apenas em exceções.'),
  OPT('2', '2 — Participo de algumas atividades ou decisões recorrentes.'),
  OPT('3', '3 — Várias etapas precisam de mim diariamente.'),
  OPT('4', '4 — Grande parte da operação espera por mim.'),
  OPT('5', '5 — A operação praticamente para sem mim.'),
  OPT('nao_avaliar', 'Não consigo avaliar.'),
];

const MOTIVOS_DEPENDENCIA = [
  OPT('so_eu', 'Apenas eu sei fazer.'),
  OPT('falta_orientacao', 'Falta orientação.'),
  OPT('falta_ferramenta', 'Falta acesso ou ferramenta.'),
  OPT('responsabilidade', 'Não está claro quem é responsável.'),
  OPT('aprovacao_interna', 'Aprovação por regra interna.'),
  OPT('aprovacao_externa', 'Aprovação por exigência externa.'),
  OPT('ainda_entender', 'Ainda precisamos entender.'),
  OPT('outro', 'Outro.'),
];

const PROBLEMA_RECORRENTE = [
  OPT('espera_decisao', 'Espera por decisão ou aprovação.'),
  OPT('falta_informacao', 'Falta de informação.'),
  OPT('erros_retrabalho', 'Erros e retrabalho.'),
  OPT('responsabilidades', 'Falta de clareza sobre responsabilidades.'),
  OPT('pendencias', 'Pendências esquecidas ou atrasadas.'),
  OPT('manual_duplicado', 'Trabalho manual ou informação duplicada.'),
  OPT('nenhum', 'Nenhum identificado.'),
  OPT('outro', 'Outro.'),
];

const ORIENTACAO = [
  OPT('claros', 'Responsáveis e instruções claros.'),
  OPT('parcial', 'Parte das atividades está clara.'),
  OPT('verbal', 'Orientação principalmente verbal.'),
  OPT('dono', 'Equipe consulta o dono na maioria das situações.'),
  OPT('nao_sei', 'Não sei informar.'),
];

const ACOMPANHAMENTO = [
  OPT('sistema', 'Sistema ou quadro compartilhado e atualizado.'),
  OPT('planilha', 'Planilha compartilhada e atualizada.'),
  OPT('mensagens', 'Mensagens e conversas.'),
  OPT('individual', 'Controle individual.'),
  OPT('nenhum', 'Sem acompanhamento regular.'),
  OPT('outro', 'Outro.'),
];

const TENTATIVAS = [
  OPT('ja_tentamos', 'Já tentamos'),
  OPT('nao_tentamos', 'Ainda não tentamos'),
  OPT('nao_sei', 'Não sei informar'),
];

const DISPONIBILIDADE = [
  OPT('ate_1h', 'até 1 hora'),
  OPT('1_3h', 'de 1 a 3 horas'),
  OPT('mais_3h', 'mais de 3 horas'),
  OPT('nao_definida', 'Ainda não definida'),
];

const TREINAMENTOS = [
  OPT('sim', 'Sim'),
  OPT('parcial', 'Parcialmente'),
  OPT('nao', 'Não'),
  OPT('nao_definido', 'Ainda não definido'),
];

const INVESTIMENTO = [
  OPT('aprovacao', 'Sim, mediante aprovação'),
  OPT('avaliar', 'Precisamos avaliar'),
  OPT('nao_agora', 'Não neste momento'),
];

const ABREANGENCIA = [
  OPT('uma', 'Uma empresa'),
  OPT('multiplas', 'Mais de uma empresa'),
  OPT('a_definir', 'Ainda precisamos definir'),
];

const PROMESSA_TIPO = [
  OPT('sem_promessa', 'Não houve promessa específica'),
  OPT('nao_lembra', 'Não lembra'),
  OPT('registrada', 'Houve promessa descrita'),
];

export const INTERVIEW_BLOCKS = [
  {
    id: 1,
    key: 'contexto_expectativas',
    title: 'Bloco 1 — Contexto e expectativas',
    shortTitle: 'Contexto e expectativas',
    questions: [
      {
        id: 'q1',
        number: 1,
        title: 'Qual empresa será o foco inicial?',
        why: 'Definir o alcance do trabalho.',
        fields: [
          { id: 'q1_empresaNome', label: 'Nome da empresa', type: 'text', required: true },
          { id: 'q1_entrevistadoNome', label: 'Nome do entrevistado', type: 'text', required: true },
          { id: 'q1_entrevistadoFuncao', label: 'Função do entrevistado', type: 'text' },
          { id: 'q1_principalServico', label: 'Principal serviço', type: 'text' },
          { id: 'q1_principalCliente', label: 'Principal perfil de cliente', type: 'text' },
          {
            id: 'q1_equipe',
            label: 'Quantidade de pessoas na equipe, incluindo o dono',
            type: 'number',
            context: true,
            help: 'Informe um número aproximado. Não é necessário detalhar cargos.',
          },
          {
            id: 'q1_areas',
            label: 'Áreas existentes',
            type: 'multi',
            options: AREAS,
            context: true,
          },
          {
            id: 'q1_abrangencia',
            label: 'Abrangência',
            type: 'single',
            options: ABREANGENCIA,
            context: true,
          },
          {
            id: 'q1_empresasNomes',
            label: 'Nomes das empresas envolvidas',
            type: 'text',
            context: true,
            showIf: { field: 'q1_abrangencia', includes: 'multiplas' },
            help: 'Não presumimos que todos os negócios entram no contrato.',
          },
          {
            id: 'q1_empresaPrioritaria',
            label: 'Empresa prioritária',
            type: 'text',
            showIf: { field: 'q1_abrangencia', includes: 'multiplas' },
          },
        ],
      },
      {
        id: 'q2',
        number: 2,
        title: 'Qual foi o principal motivo para procurar a mentoria agora?',
        why: 'Identificar a necessidade que motivou a contratação.',
        fields: [
          { id: 'q2_motivo', label: 'Motivo principal', type: 'single', options: MOTIVOS, context: true },
          {
            id: 'q2_episodio',
            label: 'Conte um episódio recente que represente esse problema',
            type: 'textarea',
            required: true,
            guidance: 'Peça um caso concreto e recente, com o que aconteceu de fato.',
          },
        ],
      },
      {
        id: 'q3',
        number: 3,
        title: 'O que você entendeu que está incluído na nossa entrega?',
        why: 'Alinhar expectativa e escopo.',
        fields: [
          {
            id: 'q3_escopo',
            label: 'Entendimento do que está incluído',
            type: 'multi',
            options: ESCOPO_ENTREGA,
            context: true,
            otherOption: true,
            otherLabel: 'Outra entrega',
          },
          {
            id: 'q3_promessaTipo',
            label: 'Qual promessa ou resultado específico foi apresentado?',
            type: 'single',
            options: PROMESSA_TIPO,
            context: true,
          },
          {
            id: 'q3_promessaTexto',
            label: 'Descreva a promessa ou resultado apresentado',
            type: 'textarea',
            showIf: { field: 'q3_promessaTipo', includes: 'registrada' },
          },
          {
            id: 'q3_situacaoContrato',
            label: 'Situação da expectativa frente ao contrato',
            type: 'single',
            consultantOnly: true,
            options: [
              OPT('alinhada', 'Expectativa alinhada ao contrato'),
              OPT('esclarecer', 'Precisa de esclarecimento'),
              OPT('nao_conferida', 'Ainda não conferida'),
            ],
            context: true,
          },
        ],
      },
      {
        id: 'q4',
        number: 4,
        title: 'Qual é a principal mudança esperada ao final dos seis meses?',
        why: 'Definir o resultado que orientará a execução.',
        guidance: 'Peça uma mudança observável. Não sugira metas numéricas.',
        fields: [
          {
            id: 'q4_mudanca',
            label: 'Mudança esperada',
            type: 'textarea',
            required: true,
            help: 'Descreva algo que possa ser percebido na rotina da empresa.',
          },
          { id: 'q4_verificacao', label: 'Como verificaremos que aconteceu', type: 'textarea', quickOptions: ['Ainda não definido'] },
        ],
      },
    ],
  },
  {
    id: 2,
    key: 'operacao_gargalos',
    title: 'Bloco 2 — Operação e gargalos',
    shortTitle: 'Operação e gargalos',
    questions: [
      {
        id: 'q5',
        number: 5,
        title: 'Quanto a operação depende de você para continuar?',
        why: 'Identificar concentração de atividades e decisões.',
        guidance: 'A escala descreve a dependência atual. Ela não define por si só impacto, frequência ou viabilidade.',
        fields: [
          { id: 'q5_escala', label: 'Nível de dependência', type: 'scale', options: ESCALA_DEPENDENCIA, context: true },
          {
            id: 'q5_atividadeTempo',
            label: 'Atividade que mais consumiu seu tempo na última semana',
            type: 'textarea',
            quickOptions: ['Não sei informar'],
          },
          {
            id: 'q5_atividadeEspera',
            label: 'Atividade ou decisão que costuma esperar por você',
            type: 'textarea',
            quickOptions: ['Não sei informar'],
          },
          {
            id: 'q5_motivos',
            label: 'Motivos da dependência',
            type: 'multi',
            options: MOTIVOS_DEPENDENCIA,
            context: true,
            otherOption: true,
            otherLabel: 'Outro',
            help: 'Aprovações externas devem ser mantidas até avaliação específica.',
          },
        ],
      },
      {
        id: 'q6',
        number: 6,
        title: 'Como aconteceu um atendimento recente, do primeiro contato à conclusão?',
        why: 'Entender o fluxo real.',
        guidance: 'Registre o fluxo real relatado. Não identifique o cliente e não preencha um fluxo presumido.',
        fields: [
          {
            id: 'q6_etapas',
            label: 'Etapas do atendimento',
            type: 'list',
            itemFields: [
              { id: 'oQueAconteceu', label: 'O que aconteceu', type: 'textarea' },
              { id: 'quemExecutou', label: 'Quem executou', type: 'text' },
              { id: 'espera', label: 'Espera ou dificuldade encontrada', type: 'textarea' },
            ],
          },
        ],
      },
      {
        id: 'q7',
        number: 7,
        title: 'Qual problema operacional mais se repete?',
        why: 'Identificar um problema recorrente.',
        fields: [
          { id: 'q7_problema', label: 'Problema recorrente', type: 'single', options: PROBLEMA_RECORRENTE, context: true },
          {
            id: 'q7_ultimoExemplo',
            label: 'Último exemplo',
            type: 'textarea',
            required: false,
            showIfNot: { field: 'q7_problema', includes: 'nenhum' },
          },
          {
            id: 'q7_consequencia',
            label: 'Consequência para cliente, equipe ou dono',
            type: 'textarea',
            showIfNot: { field: 'q7_problema', includes: 'nenhum' },
          },
        ],
      },
      {
        id: 'q8',
        number: 8,
        title: 'Como a equipe recebe orientação e acompanha as pendências?',
        why: 'Entender organização e visibilidade.',
        fields: [
          {
            id: 'q8_orientacao',
            label: 'A. Orientação e responsabilidades',
            type: 'single',
            options: ORIENTACAO,
            context: true,
          },
          {
            id: 'q8_acompanhamento',
            label: 'B. Acompanhamento',
            type: 'single',
            options: ACOMPANHAMENTO,
            context: true,
            otherOption: true,
            otherLabel: 'Outro',
          },
          {
            id: 'q8_ferramentas',
            label: 'Ferramentas utilizadas',
            type: 'text',
            optionalLabel: true,
            showIf: { field: 'q8_acompanhamento', includes: 'outro' },
          },
        ],
      },
    ],
  },
  {
    id: 3,
    key: 'condicoes_execucao',
    title: 'Bloco 3 — Condições de execução',
    shortTitle: 'Condições de execução',
    questions: [
      {
        id: 'q9',
        number: 9,
        title: 'O que já foi tentado para melhorar?',
        why: 'Aproveitar aprendizados.',
        fields: [
          { id: 'q9_tentativa', label: 'Tentativas anteriores', type: 'single', options: TENTATIVAS, context: true },
          {
            id: 'q9_feito',
            label: 'O que foi feito',
            type: 'textarea',
            showIf: { field: 'q9_tentativa', includes: 'ja_tentamos' },
          },
          {
            id: 'q9_funcionou',
            label: 'O que funcionou',
            type: 'textarea',
            showIf: { field: 'q9_tentativa', includes: 'ja_tentamos' },
          },
          {
            id: 'q9_dificultou',
            label: 'O que dificultou a continuidade',
            type: 'textarea',
            showIf: { field: 'q9_tentativa', includes: 'ja_tentamos' },
          },
        ],
      },
      {
        id: 'q10',
        number: 10,
        title: 'Com quem e com quais recursos podemos contar?',
        why: 'Construir um plano executável.',
        fields: [
          {
            id: 'q10_responsavelStatus',
            label: 'Responsável interno',
            type: 'single',
            options: [OPT('definido', 'Nome e função definidos'), OPT('nao_definido', 'Ainda não definido')],
            context: true,
          },
          {
            id: 'q10_responsavel',
            label: 'Nome e função do responsável',
            type: 'text',
            showIf: { field: 'q10_responsavelStatus', includes: 'definido' },
          },
          {
            id: 'q10_disponibilidade',
            label: 'Disponibilidade semanal',
            type: 'single',
            options: DISPONIBILIDADE,
            context: true,
          },
          {
            id: 'q10_treinamentos',
            label: 'Equipe poderá participar de treinamentos e testes?',
            type: 'single',
            options: TREINAMENTOS,
            context: true,
          },
          {
            id: 'q10_investimento',
            label: 'Possibilidade de investir em ferramentas ou serviços?',
            type: 'single',
            options: INVESTIMENTO,
            context: true,
          },
          {
            id: 'q10_limites',
            label: 'Limites e condições a respeitar',
            type: 'textarea',
            optionalLabel: true,
            quickOptions: ['Não se aplica'],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    key: 'primeiro_resultado',
    title: 'Bloco 4 — Primeiro resultado',
    shortTitle: 'Primeiro resultado',
    questions: [
      {
        id: 'q11',
        number: 11,
        title: 'Qual mudança nas primeiras semanas faria você perceber que o trabalho começou a valer a pena?',
        why: 'Escolher uma primeira entrega relevante.',
        guidance: 'Não prometa viabilidade ou prazo antes de avaliar dependências.',
        fields: [
          { id: 'q11_mudanca', label: 'Primeira mudança desejada', type: 'textarea', required: true },
          { id: 'q11_evidencia', label: 'Evidência que demonstraria a melhoria', type: 'textarea', quickOptions: ['Ainda não definido'] },
        ],
      },
    ],
  },
];

export const QUESTION_LIST = INTERVIEW_BLOCKS.flatMap((block) =>
  block.questions.map((question) => ({ ...question, blockId: block.id, blockKey: block.key }))
);

export const QUESTION_MAP = Object.fromEntries(QUESTION_LIST.map((q) => [q.id, q]));

export const FIELD_MAP = {};
QUESTION_LIST.forEach((question) => {
  question.fields.forEach((field) => {
    FIELD_MAP[field.id] = { ...field, questionId: question.id, questionTitle: question.title };
  });
});

export function createEmptyInterview({ consultantEmail, consultantName } = {}) {
  const now = new Date().toISOString();
  return {
    id: null,
    schemaVersion: 1,
    status: INTERVIEW_STATUS.DRAFT,
    consultantEmail: consultantEmail || '',
    consultantName: consultantName || '',
    companyKey: '',
    createdAt: now,
    updatedAt: now,
    currentBlock: 1,
    answers: {},
    contexts: {},
    contextFlags: {},
    candidates: [],
    summary: null,
    confirmation: {
      answers: {},
      contexts: {},
      contextFlags: {},
      corrections: '',
      extra: '',
      clientName: '',
      mode: '',
      confirmedAt: null,
      presentedVersion: null,
    },
    manualOrder: [],
    weights: null,
    history: [],
  };
}

export function showField(field, answers) {
  if (field.showIf) {
    const value = answers[field.showIf.field];
    const list = Array.isArray(value) ? value : [value];
    if (!list.filter(Boolean).includes(field.showIf.includes)) return false;
  }
  if (field.showIfNot) {
    const value = answers[field.showIfNot.field];
    const list = Array.isArray(value) ? value : [value];
    if (list.filter(Boolean).includes(field.showIfNot.includes)) return false;
  }
  return true;
}

export function isEmptyValue(value) {
  if (value === undefined || value === null || value === '') return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export function fieldHasContext(field) {
  return field.context === true;
}

export function questionIsAnswered(interview, question) {
  return question.fields.some((field) => {
    if (!showField(field, interview.answers || {})) return false;
    if (!isEmptyValue(interview.answers?.[field.id])) return true;
    if (fieldHasContext(field) && !isEmptyValue(interview.contexts?.[field.id])) return true;
    return false;
  });
}

export function getProgress(interview) {
  const answered = QUESTION_LIST.filter((q) => questionIsAnswered(interview, q)).length;
  return {
    answered,
    total: QUESTION_LIST.length,
    percent: Math.round((answered / QUESTION_LIST.length) * 100),
  };
}

function labelForOption(field, value) {
  const option = (field.options || []).find((o) => o.value === value);
  return option ? option.label : value;
}

export function formatAnswer(field, value) {
  if (isEmptyValue(value)) return null;
  if (field.type === 'multi') {
    const values = Array.isArray(value) ? value : [value];
    return values.map((v) => labelForOption(field, v)).join('; ');
  }
  if (field.type === 'single' || field.type === 'scale') {
    return labelForOption(field, value);
  }
  if (field.type === 'list') {
    return value
      .map((item, index) => {
        const parts = (field.itemFields || [])
          .map((itemField) => {
            const text = item[itemField.id];
            return text ? `${itemField.label}: ${text}` : null;
          })
          .filter(Boolean);
        return parts.length ? `${index + 1}. ${parts.join(' | ')}` : null;
      })
      .filter(Boolean)
      .join('\n');
  }
  if (field.type === 'number') return String(value);
  return String(value);
}

export function listAnswers(interview, { consultantOnly = false } = {}) {
  const rows = [];
  INTERVIEW_BLOCKS.forEach((block) => {
    block.questions.forEach((question) => {
      question.fields.forEach((field) => {
        if ((field.consultantOnly || false) !== consultantOnly) return;
        const value = interview.answers?.[field.id];
        const text = formatAnswer(field, value);
        const context = interview.contexts?.[field.id];
        if (text === null && isEmptyValue(context)) return;
        rows.push({
          blockId: block.id,
          blockTitle: block.title,
          questionId: question.id,
          questionTitle: question.title,
          fieldId: field.id,
          label: field.label,
          text,
          context: !isEmptyValue(context) ? context : null,
          contextEnabled: interview.contextFlags?.[field.id] === true,
        });
      });
    });
  });
  return rows;
}

const REQUIRED_FIELDS = QUESTION_LIST.flatMap((q) =>
  q.fields.filter((f) => f.required).map((f) => ({ ...f, questionTitle: q.title }))
);

export function getPendingInfo(interview) {
  const pending = [];
  REQUIRED_FIELDS.forEach((field) => {
    if (!showField(field, interview.answers || {})) return;
    if (isEmptyValue(interview.answers?.[field.id])) {
      pending.push(`${field.questionTitle} — ${field.label}`);
    }
  });

  if (interview.status !== INTERVIEW_STATUS.DRAFT) {
    if (!interview.summary || !interview.summary.text) {
      pending.push('Resumo do entendimento ainda não preenchido.');
    }
    if (!interview.candidates || interview.candidates.length === 0) {
      pending.push('Nenhum problema ou oportunidade cadastrado.');
    }
  }

  if (interview.status === INTERVIEW_STATUS.WAITING || interview.status === INTERVIEW_STATUS.CONFIRMED) {
    if (!interview.confirmation?.confirmedAt) {
      pending.push('Confirmação do cliente ainda não registrada.');
    }
  }

  const divergent = getConfirmationDivergences(interview);
  if (divergent.length > 0) {
    pending.push(`Correções abertas na confirmação: ${divergent.length} pergunta(s).`);
  }

  return pending;
}

export const CONFIRMATION_QUESTIONS = [
  {
    id: 'q1',
    text: 'Este resumo representa corretamente a situação da sua empresa?',
  },
  {
    id: 'q2',
    text: 'O resultado descrito corresponde ao que você busca com a mentoria?',
  },
  {
    id: 'q3',
    text: 'As prioridades apresentadas representam os principais pontos que precisamos trabalhar?',
  },
];

export const CONFIRMATION_OPTIONS = [
  { value: 'sim', label: 'Sim' },
  { value: 'em_parte', label: 'Em parte' },
  { value: 'nao', label: 'Não' },
];

export function getConfirmationDivergences(interview) {
  const confirmation = interview.confirmation || { answers: {} };
  return CONFIRMATION_QUESTIONS.filter((question) => {
    const answer = confirmation.answers?.[question.id];
    if (answer === 'em_parte' || answer === 'nao') {
      return !confirmation.corrections?.trim();
    }
    return false;
  });
}

export function companyKeyOf(interview) {
  const name = interview.answers?.q1_empresaNome || interview.companyKey || '';
  return String(name).trim().toLowerCase();
}
