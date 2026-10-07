/**
 * Motor Analítico - Mapa 360 de Governo Empresarial
 * Responsável por cruzar respostas, identificar gaps de percepção e gerar os índices.
 */

// =====================================
// CONTAGENS E CATEGORIAS MATEMÁTICAS
// =====================================

/**
 * Filtra respostas por público
 */
function filterAnswersByRole(answersArray, role) {
  return answersArray.filter(a => a.roleId === role);
}

/**
 * Calcula média ponderada de uma categoria específica
 * @param {Array} roleAnswers - Array de respostas de um determinado público
 * @param {Array} templateQuestions - Perguntas do template referentes àquele público
 * @param {String} category - Categoria alvo (ex: CLAREZA, AUTONOMIA)
 */
function calculateCategoryScore(roleAnswers, templateQuestions, category) {
  let totalScore = 0;
  let totalWeight = 0;

  const categoryQuestions = templateQuestions.filter(q => q.category === category && q.type === 'escala_0_10');

  // Para cada usuário que respondeu...
  roleAnswers.forEach(userAnswerData => {
    const responses = userAnswerData.responses || {};
    
    categoryQuestions.forEach(q => {
      if (responses[q.id] !== undefined) {
        // Normalizar nota para 0-100 (se a resposta for 0-10, multiplica por 10)
        const val = Number(responses[q.id]) * 10;
        const w = Number(q.weight) || 1;
        totalScore += (val * w);
        totalWeight += w;
      }
    });
  });

  return totalWeight > 0 ? (totalScore / totalWeight) : null;
}

// =====================================
// ÍNDICES PRINCIPAIS
// =====================================

export const DiagnosticEngine = {
  
  /**
   * Calcula todos os índices globais do mapa 360
   * @param {Array} allAnswers - Todas as respostas brutas do banco de dados (coleção answers)
   * @param {Array} allTemplates - Todos os templates ativos no momento
   * @param {Object} weightsConfig - Pesos de ponderação entre os índices para o Score Final
   */
  calculateAllScores(allAnswers, allTemplates, weightsConfig = null) {
    // Default weights se não forem passados (conforme solicitado pelo usuário)
    const weights = weightsConfig || {
      clareza: 0.15,
      visibilidade: 0.15,
      autonomia: 0.20,
      operacao: 0.15,
      decisoes: 0.15,
      dependencia: 0.20
    };

    // 1. Separar templates por role
    const donoTemplate = allTemplates.find(t => t.targetRole === 'DONO')?.questions || [];
    const socioTemplate = allTemplates.find(t => t.targetRole === 'SOCIO')?.questions || [];
    const liderTemplate = allTemplates.find(t => t.targetRole === 'LIDERANCA')?.questions || [];
    const opTemplate = allTemplates.find(t => t.targetRole === 'OPERACAO')?.questions || [];

    // 2. Separar respostas por role
    const donoAnswers = filterAnswersByRole(allAnswers, 'DONO');
    const socioAnswers = filterAnswersByRole(allAnswers, 'SOCIO');
    const liderAnswers = filterAnswersByRole(allAnswers, 'LIDERANCA');
    const opAnswers = filterAnswersByRole(allAnswers, 'OPERACAO');

    // 3. Cálculos de Índices Específicos (0 - 100)
    // Extraímos a média ponderada global baseada no cruzamento (Regra de Ouro)

    // A) Clareza Organizacional
    const clarezaDono = calculateCategoryScore(donoAnswers, donoTemplate, 'CLAREZA');
    const clarezaLider = calculateCategoryScore(liderAnswers, liderTemplate, 'CLAREZA');
    const clarezaOp = calculateCategoryScore(opAnswers, opTemplate, 'CLAREZA');
    const scoreClareza = averageScores([clarezaLider, clarezaOp]); // O que importa é a equipe

    // B) Autonomia da Liderança
    const autoDono = calculateCategoryScore(donoAnswers, donoTemplate, 'AUTONOMIA');
    const autoLider = calculateCategoryScore(liderAnswers, liderTemplate, 'AUTONOMIA');
    const scoreAutonomia = averageScores([autoLider]); // A percepção real da liderança

    // C) Maturidade Operacional
    const opScore = calculateCategoryScore(opAnswers, opTemplate, 'OPERACOES');
    
    // D) Visibilidade Gerencial
    const visibScore = calculateCategoryScore(donoAnswers, donoTemplate, 'INDICADORES');
    
    // E) Dependência do Empresário (Maior = Pior, então é invertido na composição do Global)
    const depScore = calculateCategoryScore(donoAnswers, donoTemplate, 'DEPENDENCIA');

    // F) Alinhamento Estratégico (Somente Sócios x Dono)
    let scoreAlinhamento = 100;
    if (socioAnswers.length > 0) {
      const alinDono = calculateCategoryScore(donoAnswers, donoTemplate, 'ESTRATEGIA');
      const alinSocio = calculateCategoryScore(socioAnswers, socioTemplate, 'ESTRATEGIA');
      if (alinDono !== null && alinSocio !== null) {
        // Gap penalty: se a diferença for alta, o alinhamento cai.
        const gap = Math.abs(alinDono - alinSocio);
        scoreAlinhamento = Math.max(0, 100 - gap);
      }
    }

    // 4. SCORE DE GOVERNABILIDADE (0-100)
    // Usar os pesos configurados, invertendo a dependência
    const rawScores = {
      clareza: scoreClareza || 0,
      visibilidade: visibScore || 0,
      autonomia: scoreAutonomia || 0,
      operacao: opScore || 0,
      // Se centralização não tem template ainda, usar inverso da autonomia temporariamente
      decisoes: scoreAutonomia || 0, 
      // Dependência: Quanto maior a dependência, pior a governabilidade. (100 - dependência)
      dependencia: 100 - (depScore || 0) 
    };

    const finalScore = (
      (rawScores.clareza * weights.clareza) +
      (rawScores.visibilidade * weights.visibilidade) +
      (rawScores.autonomia * weights.autonomia) +
      (rawScores.operacao * weights.operacao) +
      (rawScores.decisoes * weights.decisoes) +
      (rawScores.dependencia * weights.dependencia)
    );

    // 5. Motor de Triangulação (Gaps)
    const gaps = generateGapsOfPerception({
      clareza: { dono: clarezaDono, time: clarezaLider },
      autonomia: { dono: autoDono, time: autoLider }
    });

    return {
      scores: {
        governabilidade: Math.round(finalScore),
        clareza: Math.round(rawScores.clareza),
        autonomia: Math.round(rawScores.autonomia),
        maturidade_operacional: Math.round(rawScores.operacao),
        visibilidade: Math.round(rawScores.visibilidade),
        dependencia: Math.round(depScore || 0),
        alinhamento_estrategico: Math.round(scoreAlinhamento),
        centralizacao_decisoria: Math.round(100 - rawScores.decisoes)
      },
      classification: getClassificationLabel(finalScore),
      gapsIdentificados: gaps
    };
  },

  /**
   * Cálculo específico do Índice de Centralização (Mapa de Decisões)
   * Formula solicitada: (decisões no dono * frequência * importância) / Total
   */
  calculateCentralizationIndex(decisionMap) {
    if (!decisionMap || decisionMap.length === 0) return 0;
    
    let totalScore = 0;
    let maxPossibleScore = 0;

    decisionMap.forEach(dec => {
      // Impacto de 1 a 3
      const weight = (dec.impacto || 1) * (dec.frequencia || 1);
      maxPossibleScore += (3 * 3); // max weight possible per decision
      
      if (dec.decisorAtual === 'DONO') {
        totalScore += weight;
      }
    });

    return Math.round((totalScore / maxPossibleScore) * 100);
  },

  /**
   * Motor Causa Raiz: Avalia se um problema é causa ou sintoma.
   */
  evaluateRootCause(evidenceMap) {
    // framework de validação
    const { prioridade, prazo, responsavel, processo, indicador } = evidenceMap;
    const isSymptom = (!prioridade || !responsavel || !processo);
    
    return {
      type: isSymptom ? 'SINTOMA' : 'CAUSA_RAIZ',
      recommendation: isSymptom 
        ? "Ausência de Sistema de Responsabilização. A causa provável é a falta de regras, e não de vontade técnica."
        : "Problema estrutural isolado. A regra existe mas a execução está falhando."
    };
  }

};

// =====================================
// HELPER FUNCTIONS
// =====================================

function averageScores(scoreArray) {
  const valid = scoreArray.filter(s => s !== null && !isNaN(s));
  if (valid.length === 0) return 0;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

function getClassificationLabel(score) {
  if (score <= 20) return "EMPRESÁRIO É O SISTEMA";
  if (score <= 40) return "EMPRESA CENTRALIZADA";
  if (score <= 60) return "EMPRESA EM ORGANIZAÇÃO";
  if (score <= 80) return "EMPRESA COM AUTONOMIA";
  return "EMPRESA GOVERNÁVEL";
}

function generateGapsOfPerception(comparisons) {
  const gaps = [];
  
  if (comparisons.clareza.dono !== null && comparisons.clareza.time !== null) {
    const diff = comparisons.clareza.dono - comparisons.clareza.time;
    if (diff > 20) {
      gaps.push({
        title: "Gap de Clareza Estratégica",
        donoView: Math.round(comparisons.clareza.dono),
        teamView: Math.round(comparisons.clareza.time),
        description: "O empresário acredita que as prioridades e metas estão muito mais claras do que a equipe de fato percebe."
      });
    }
  }

  if (comparisons.autonomia.dono !== null && comparisons.autonomia.time !== null) {
    const diff = comparisons.autonomia.dono - comparisons.autonomia.time;
    if (diff > 20) {
      gaps.push({
        title: "Gap de Autonomia",
        donoView: Math.round(comparisons.autonomia.dono),
        teamView: Math.round(comparisons.autonomia.time),
        description: "Existe uma ilusão de delegação. O dono acredita que confere autonomia, mas a equipe sente que precisa pedir permissão frequentemente."
      });
    }
  }

  return gaps;
}
