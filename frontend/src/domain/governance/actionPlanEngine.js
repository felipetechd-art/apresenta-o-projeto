import { DiagnosticEngine } from './diagnosticEngine';

export const ActionPlanEngine = {
  
  /**
   * Analisa as respostas do Mapa 360 e gera o Plano de Governo de 90 Dias estruturado.
   */
  generatePlan(diagnostic, allAnswers, templates, results) {
    const scores = results?.scores || {};
    const kickoff = diagnostic?.kickoffData || diagnostic?.fullData?.diagnosticData || {};
    
    // Calcula IPG e filtra problemas (Simulado para a demonstração com base nas métricas reais)
    const isDependent = scores.dependencia > 50;
    const isAutonomyLow = scores.autonomia < 50;
    const isClarityLow = scores.clareza < 60;
    const isExecutionLow = scores.execucao < 50;

    const summary = {
      scoreGeral: Math.round((scores.clareza + scores.autonomia + (100 - (scores.dependencia || 0)) + scores.operacao) / 4) || 0,
      principalConclusao: this.getPrincipalConclusao(scores),
      top3Gargalos: this.getTop3Gargalos(scores, kickoff),
      principalRisco: isDependent ? "O crescimento da empresa continuará aumentando diretamente a carga mental e operacional do fundador." : "Desalinhamento estratégico que pode gerar perda de mercado e ineficiência operacional.",
      principalOportunidade: "Descentralizar a tomada de decisão para recuperar de 10h a 20h operacionais semanais do dono.",
      metaCentral: "Reduzir a dependência operacional do fundador e instalar um sistema de gestão por responsáveis e indicadores."
    };

    const initiatives = [];

    // Movimento 1 (01-15 dias)
    if (isClarityLow || isExecutionLow || !isClarityLow) { // Adicionando como default para sempre ter plano
      initiatives.push({
        movimento: "DIAS 01 A 15",
        fase: "ESTANCAR E DAR CLAREZA",
        titulo: "Redesenho de Papéis e Transferência de Omissões",
        achado: "A equipe não possui clareza absoluta sobre prioridades, resultando em retrabalho e problemas não assumidos.",
        causa: "Ausência de clareza estratégica e responsabilidades não formalizadas em um sistema de cobrança.",
        acao: "Implantar acordo de resultados, estabelecer RACI simplificado e realizar workshop de 'Choque de Realidade' com lideranças.",
        responsavel: "Dono e Diretoria",
        indicador: "Percentual de colaboradores com 3 principais entregas claramente definidas.",
        baseline: "A levantar",
        meta: "100% da equipe com metas/entregas mapeadas.",
        gap: "Clareza + Papel"
      });
    }

    // Movimento 2 (16-30 dias)
    if (isDependent || scores.operacao < 60 || !isDependent) {
      initiatives.push({
        movimento: "DIAS 16 A 30",
        fase: "ESTRUTURAR O SISTEMA",
        titulo: "Matriz de Alçadas e Engenharia de Processos Críticos",
        achado: "Decisões simples e problemas de nível 1 estão chegando à diretoria, causando lentidão.",
        causa: "Falta de regras de aprovação documentadas e manuais de resolução de exceções para a operação.",
        acao: "Construir a Matriz de Decisões, definindo limites financeiros e operacionais para que os gestores possam decidir sem acionar o fundador.",
        responsavel: "Dono e Sócios",
        indicador: "Decisões semanais escaladas para o fundador.",
        baseline: "Alto (evidência do Mapa 360)",
        meta: "Redução de 70% nas escaladas operacionais.",
        gap: "Sistema + Autonomia"
      });
    }

    // Movimento 3 (31-60 dias)
    if (isAutonomyLow || isDependent || !isAutonomyLow) {
      initiatives.push({
        movimento: "DIAS 31 A 60",
        fase: "TRANSFERIR E CAPACITAR",
        titulo: "Transferência de Gestão e Criação de Rituais (Cadência)",
        achado: "O fundador gasta grande parte do tempo executando e fiscalizando a operação em vez de governar.",
        causa: "Líderes atuando como operadores seniores; ausência de rotinas estruturadas de gestão.",
        acao: "Implementar rituais de Daily/Weekly, capacitar gestores para acompanhar indicadores e remover o dono da fiscalização micro.",
        responsavel: "Lideranças",
        indicador: "Horas do dono dedicadas à operação micro/apagar incêndios.",
        baseline: "Evidenciado excesso no Mapa",
        meta: "Devolver 15h semanais ao fundador.",
        gap: "Capacidade + Execução"
      });
    }

    // Movimento 4 (61-90 dias)
    initiatives.push({
      movimento: "DIAS 61 A 90",
      fase: "GOVERNAR E CONSOLIDAR",
      titulo: "Implantação do Painel Executivo e Conselho Consultivo",
      achado: "Falta visão executiva dos números. O acompanhamento é feito no 'feeling'.",
      causa: "Ausência de dashboards integrados e falta de rotina formal de apresentação de resultados pelos líderes.",
      acao: "Criar o Dashboard Executivo, definir as reuniões mensais de fechamento por área e instituir o modelo de 'Accountability' da liderança.",
      responsavel: "Dono",
      indicador: "Número de áreas apresentando DRE/Indicadores formalmente.",
      baseline: "A Levantar",
      meta: "100% das áreas",
      gap: "Sistema + Execução"
    });

    return {
      summary,
      initiatives
    };
  },

  getPrincipalConclusao(scores) {
    if (scores.dependencia > 60) return "A empresa gira em torno do fundador. Apesar de existir capacidade operacional, a tomada de decisão está severamente centralizada, criando um teto de crescimento imediato.";
    if (scores.clareza < 50) return "Falta forte alinhamento estratégico. A equipe executa por esforço, mas há muito desperdício humano e retrabalho por falta de direção e indicadores.";
    return "A estrutura possui maturidade inicial, mas precisa consolidar o modelo de governança para que a diretoria possa focar na estratégia e não na operação diária.";
  },

  getTop3Gargalos(scores, kickoff) {
    const gargalos = [];
    if (scores.dependencia > 50) gargalos.push("Alta dependência operacional e decisões centralizadas na direção.");
    if (scores.clareza < 60) gargalos.push("Equipe não possui clareza exata de metas, papéis e indicadores de sucesso.");
    if (scores.autonomia < 60) gargalos.push("Baixa autonomia da liderança intermediária para resolver problemas.");
    if (gargalos.length < 3) gargalos.push("Ausência de processos institucionais blindados contra a saída de talentos.");
    if (gargalos.length < 3) gargalos.push(`Dificuldade de tracionar a meta de: ${kickoff.visao_futuro || 'crescimento'}`);
    return gargalos.slice(0, 3);
  }
};
