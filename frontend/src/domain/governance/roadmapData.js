// @ts-check

/**
 * Retorna as tarefas obrigatórias padrão do programa Governo Empresarial.
 * @returns {import("./types").RoadmapTask[]}
 */
export function getDefaultRoadmapTasks() {
  const tasks = [];

  // Função utilitária para gerar id simples para demonstração
  let idCounter = 1;
  const t = (/** @type {Partial<import("./types").RoadmapTask>} */ params) => {
    tasks.push({
      id: `task-${idCounter++}`,
      title: params.title || "",
      description: params.description || "",
      month: params.month || 1,
      phaseId: params.phaseId || "fundacao",
      methodStage: params.methodStage || "diagnosticar",
      pillar: params.pillar || "governance",
      type: params.type || "mandatory",
      weight: params.weight || 1,
      status: params.status || "not_started",
      ownerId: params.ownerId || "owner",
      impactedMetricIds: params.impactedMetricIds || [],
      definitionOfDone: params.definitionOfDone || [],
      evidences: []
    });
  };

  // MÊS 1 — DIAGNÓSTICO
  t({ month: 1, phaseId: "fundacao", pillar: "governance", title: "Realizar diagnóstico IDE." });
  t({ month: 1, phaseId: "fundacao", pillar: "governance", title: "Realizar diagnóstico CLO." });
  t({ month: 1, phaseId: "fundacao", pillar: "people", title: "Mapear a agenda do empresário." });
  t({ month: 1, phaseId: "fundacao", pillar: "delegation", title: "Criar registro de decisões que chegam ao empresário." });
  t({ month: 1, phaseId: "fundacao", pillar: "governance", title: "Definir a linha de base dos indicadores." });
  t({ month: 1, phaseId: "fundacao", pillar: "processes", title: "Identificar áreas mais dependentes do fundador." });

  // MÊS 2 — ORGANIZAÇÃO
  t({ month: 2, phaseId: "fundacao", pillar: "processes", title: "Mapear as áreas da empresa." });
  t({ month: 2, phaseId: "fundacao", pillar: "people", title: "Construir organograma atual." });
  t({ month: 2, phaseId: "fundacao", pillar: "people", title: "Construir organograma de transição." });
  t({ month: 2, phaseId: "fundacao", pillar: "delegation", title: "Identificar responsabilidades sem dono." });
  t({ month: 2, phaseId: "fundacao", pillar: "processes", title: "Mapear processos críticos." });
  t({ month: 2, phaseId: "fundacao", pillar: "people", title: "Identificar conhecimentos concentrados no fundador." });

  // MÊS 3 — PRIMEIRA DESCENTRALIZAÇÃO
  t({ month: 3, phaseId: "fundacao", pillar: "delegation", title: "Construir matriz RACI inicial." });
  t({ month: 3, phaseId: "fundacao", pillar: "delegation", title: "Definir alçadas de decisão." });
  t({ month: 3, phaseId: "fundacao", pillar: "delegation", title: "Selecionar responsabilidades que sairão da mão do empresário." });
  t({ month: 3, phaseId: "fundacao", pillar: "delegation", title: "Transferir as primeiras responsabilidades." });
  t({ month: 3, phaseId: "fundacao", pillar: "governance", title: "Implantar reunião semanal de execução." });
  t({ month: 3, phaseId: "fundacao", pillar: "governance", title: "Implantar reunião mensal de indicadores." });
  t({ month: 3, phaseId: "fundacao", pillar: "governance", title: "Aprovar roadmap dos próximos 90 dias." });

  // MÊS 4 — LIDERANÇA
  t({ month: 4, phaseId: "padronizacao", pillar: "people", title: "Definir responsável para cada área prioritária." });
  t({ month: 4, phaseId: "padronizacao", pillar: "people", title: "Criar scorecard das lideranças." });
  t({ month: 4, phaseId: "padronizacao", pillar: "people", title: "Definir entregas e indicadores por líder." });
  t({ month: 4, phaseId: "padronizacao", pillar: "delegation", title: "Criar plano de delegação." });
  t({ month: 4, phaseId: "padronizacao", pillar: "people", title: "Treinar lideranças para tomada de decisão." });
  t({ month: 4, phaseId: "padronizacao", pillar: "delegation", title: "Definir critérios de prestação de contas." });

  // MÊS 5 — PADRONIZAÇÃO
  t({ month: 5, phaseId: "padronizacao", pillar: "processes", title: "Documentar processos prioritários." });
  t({ month: 5, phaseId: "padronizacao", pillar: "processes", title: "Criar POPs." });
  t({ month: 5, phaseId: "padronizacao", pillar: "processes", title: "Criar checklists." });
  t({ month: 5, phaseId: "padronizacao", pillar: "processes", title: "Definir SLAs." });
  t({ month: 5, phaseId: "padronizacao", pillar: "processes", title: "Definir critérios de qualidade." });
  t({ month: 5, phaseId: "padronizacao", pillar: "processes", title: "Definir fonte única de informação." });
  t({ month: 5, phaseId: "padronizacao", pillar: "automation", title: "Padronizar registro de dados no CRM ou sistema principal." });

  // MÊS 6 — DELEGAÇÃO CONSOLIDADA
  t({ month: 6, phaseId: "padronizacao", pillar: "governance", title: "Implantar reunião semanal de lideranças." });
  t({ month: 6, phaseId: "padronizacao", pillar: "delegation", title: "Criar registro de recentralização." });
  t({ month: 6, phaseId: "padronizacao", pillar: "delegation", title: "Medir decisões devolvidas ao empresário." });
  t({ month: 6, phaseId: "padronizacao", pillar: "delegation", title: "Realizar teste de autonomia de três a cinco dias." });
  t({ month: 6, phaseId: "padronizacao", pillar: "processes", title: "Identificar falhas do teste." });
  t({ month: 6, phaseId: "padronizacao", pillar: "processes", title: "Criar plano de correção." });
  t({ month: 6, phaseId: "padronizacao", pillar: "delegation", title: "Validar responsabilidades transferidas." });

  // MÊS 7 — AUTOMAÇÃO
  t({ month: 7, phaseId: "escala", pillar: "automation", title: "Criar backlog de automação." });
  t({ month: 7, phaseId: "escala", pillar: "automation", title: "Mapear atividades manuais e repetitivas." });
  t({ month: 7, phaseId: "escala", pillar: "automation", title: "Priorizar automações por impacto." });
  t({ month: 7, phaseId: "escala", pillar: "automation", title: "Definir metas de horas economizadas." });
  t({ month: 7, phaseId: "escala", pillar: "automation", title: "Implantar as primeiras automações." });
  t({ month: 7, phaseId: "escala", pillar: "automation", title: "Medir redução de erros e tempo." });

  // MÊS 8 — DADOS
  t({ month: 8, phaseId: "escala", pillar: "governance", title: "Implantar dashboard executivo." });
  t({ month: 8, phaseId: "escala", pillar: "governance", title: "Definir indicadores obrigatórios por área." });
  t({ month: 8, phaseId: "escala", pillar: "governance", title: "Definir responsáveis pelos indicadores." });
  t({ month: 8, phaseId: "escala", pillar: "governance", title: "Criar rotina de atualização." });
  t({ month: 8, phaseId: "escala", pillar: "governance", title: "Implantar alertas." });
  t({ month: 8, phaseId: "escala", pillar: "governance", title: "Validar qualidade dos dados." });
  t({ month: 8, phaseId: "escala", pillar: "automation", title: "Medir aderência ao CRM ou sistema principal." });

  // MÊS 9 — GOVERNANÇA
  t({ month: 9, phaseId: "escala", pillar: "governance", title: "Implantar Conselho Executivo Mensal." });
  t({ month: 9, phaseId: "escala", pillar: "governance", title: "Criar pauta padrão do conselho." });
  t({ month: 9, phaseId: "escala", pillar: "governance", title: "Implantar rotina trimestral de estratégia." });
  t({ month: 9, phaseId: "escala", pillar: "governance", title: "Criar registro de decisões estratégicas." });
  t({ month: 9, phaseId: "escala", pillar: "governance", title: "Medir execução dos planos de ação." });
  t({ month: 9, phaseId: "escala", pillar: "governance", title: "Revisar metas e indicadores." });

  // MÊS 10 — ESCALA
  t({ month: 10, phaseId: "escala", pillar: "governance", title: "Definir projeto estratégico de crescimento." });
  t({ month: 10, phaseId: "escala", pillar: "processes", title: "Validar capacidade operacional." });
  t({ month: 10, phaseId: "escala", pillar: "people", title: "Definir líder responsável pelo projeto." });
  t({ month: 10, phaseId: "escala", pillar: "governance", title: "Criar indicadores do projeto." });
  t({ month: 10, phaseId: "escala", pillar: "processes", title: "Executar crescimento sem aumentar a dependência do empresário." });
  t({ month: 10, phaseId: "escala", pillar: "governance", title: "Medir impacto em receita, margem, capacidade e retrabalho." });

  // MÊS 11 — CONTINUIDADE
  t({ month: 11, phaseId: "escala", pillar: "people", title: "Mapear pessoas-chave." });
  t({ month: 11, phaseId: "escala", pillar: "people", title: "Mapear conhecimentos críticos." });
  t({ month: 11, phaseId: "escala", pillar: "people", title: "Identificar funções sem substituto." });
  t({ month: 11, phaseId: "escala", pillar: "processes", title: "Criar plano de continuidade." });
  t({ month: 11, phaseId: "escala", pillar: "people", title: "Criar plano de sucessão." });
  t({ month: 11, phaseId: "escala", pillar: "delegation", title: "Realizar teste de ausência entre sete e quinze dias." });
  t({ month: 11, phaseId: "escala", pillar: "processes", title: "Corrigir falhas identificadas." });

  // MÊS 12 — CONSOLIDAÇÃO
  t({ month: 12, phaseId: "escala", pillar: "governance", title: "Refazer diagnóstico IDE." });
  t({ month: 12, phaseId: "escala", pillar: "governance", title: "Refazer diagnóstico CLO." });
  t({ month: 12, phaseId: "escala", pillar: "governance", title: "Calcular IGE final." });
  t({ month: 12, phaseId: "escala", pillar: "governance", title: "Comparar linha de base com resultado final." });
  t({ month: 12, phaseId: "escala", pillar: "governance", title: "Calcular horas liberadas." });
  t({ month: 12, phaseId: "escala", pillar: "governance", title: "Calcular redução do retrabalho." });
  t({ month: 12, phaseId: "escala", pillar: "governance", title: "Calcular custos evitados." });
  t({ month: 12, phaseId: "escala", pillar: "governance", title: "Registrar crescimento e margem." });
  t({ month: 12, phaseId: "escala", pillar: "governance", title: "Validar nível de maturidade." });
  t({ month: 12, phaseId: "escala", pillar: "governance", title: "Criar próximo roadmap de 12 meses." });

  return tasks;
}
