// @ts-check

/**
 * Retorna as tarefas obrigatórias padrão do programa Governo Empresarial.
 * @returns {import("./types").RoadmapTask[]}
 */
export function getDefaultRoadmapTasks() {
  const tasks = [];

  const t = (/** @type {Partial<import("./types").RoadmapTask>} */ params) => {
    tasks.push({
      id: params.id || `task-${Math.random().toString(36).substring(7)}`,
      title: params.title || "",
      description: params.description || "",
      month: params.month || 1,
      phase: params.phase || 1,
      stage: params.stage || "Diagnosticar",
      pillar: params.pillar || "governance",
      type: params.type || "mandatory",
      weight: params.weight || 1,
      status: params.status || "not_started",
      responsible: params.responsible || "Empreendedor",
      impactedMetricIds: params.impactedMetricIds || [],
      definitionOfDone: params.definitionOfDone || [],
      evidences: []
    });
  };

  // MÊS 1 — DIAGNÓSTICO (FASE 1)
  t({ id: "seed-m1-t1", month: 1, phase: 1, stage: "Diagnosticar", pillar: "governance", title: "Realizar diagnóstico IDE." });
  t({ id: "seed-m1-t2", month: 1, phase: 1, stage: "Diagnosticar", pillar: "governance", title: "Realizar diagnóstico CLO." });
  t({ id: "seed-m1-t3", month: 1, phase: 1, stage: "Diagnosticar", pillar: "people", title: "Mapear a agenda do empresário." });
  t({ id: "seed-m1-t4", month: 1, phase: 1, stage: "Diagnosticar", pillar: "delegation", title: "Criar registro de decisões que chegam ao empresário." });
  t({ id: "seed-m1-t5", month: 1, phase: 1, stage: "Organizar", pillar: "governance", title: "Definir a linha de base dos indicadores." });
  t({ id: "seed-m1-t6", month: 1, phase: 1, stage: "Diagnosticar", pillar: "processes", title: "Identificar áreas mais dependentes do fundador." });

  // MÊS 2 — ORGANIZAÇÃO (FASE 1)
  t({ id: "seed-m2-t1", month: 2, phase: 1, stage: "Organizar", pillar: "processes", title: "Mapear as áreas da empresa." });
  t({ id: "seed-m2-t2", month: 2, phase: 1, stage: "Organizar", pillar: "people", title: "Construir organograma atual." });
  t({ id: "seed-m2-t3", month: 2, phase: 1, stage: "Organizar", pillar: "people", title: "Construir organograma de transição." });
  t({ id: "seed-m2-t4", month: 2, phase: 1, stage: "Organizar", pillar: "delegation", title: "Identificar responsabilidades sem dono." });
  t({ id: "seed-m2-t5", month: 2, phase: 1, stage: "Organizar", pillar: "processes", title: "Mapear processos críticos." });
  t({ id: "seed-m2-t6", month: 2, phase: 1, stage: "Diagnosticar", pillar: "people", title: "Identificar conhecimentos concentrados no fundador." });

  // MÊS 3 — PRIMEIRA DESCENTRALIZAÇÃO (FASE 1)
  t({ id: "seed-m3-t1", month: 3, phase: 1, stage: "Organizar", pillar: "delegation", title: "Construir matriz RACI inicial." });
  t({ id: "seed-m3-t2", month: 3, phase: 1, stage: "Delegar", pillar: "delegation", title: "Definir alçadas de decisão.", responsible: "Liderança" });
  t({ id: "seed-m3-t3", month: 3, phase: 1, stage: "Delegar", pillar: "delegation", title: "Selecionar responsabilidades que sairão da mão do empresário." });
  t({ id: "seed-m3-t4", month: 3, phase: 1, stage: "Delegar", pillar: "delegation", title: "Transferir as primeiras responsabilidades.", responsible: "Liderança" });
  t({ id: "seed-m3-t5", month: 3, phase: 1, stage: "Governar", pillar: "governance", title: "Implantar reunião semanal de execução." });
  t({ id: "seed-m3-t6", month: 3, phase: 1, stage: "Governar", pillar: "governance", title: "Implantar reunião mensal de indicadores." });
  t({ id: "seed-m3-t7", month: 3, phase: 1, stage: "Governar", pillar: "governance", title: "Aprovar roadmap dos próximos 90 dias." });

  // MÊS 4 — LIDERANÇA (FASE 2)
  t({ id: "seed-m4-t1", month: 4, phase: 2, stage: "Organizar", pillar: "people", title: "Definir responsável para cada área prioritária.", responsible: "Liderança" });
  t({ id: "seed-m4-t2", month: 4, phase: 2, stage: "Governar", pillar: "people", title: "Criar scorecard das lideranças." });
  t({ id: "seed-m4-t3", month: 4, phase: 2, stage: "Governar", pillar: "people", title: "Definir entregas e indicadores por líder.", responsible: "Liderança" });
  t({ id: "seed-m4-t4", month: 4, phase: 2, stage: "Delegar", pillar: "delegation", title: "Criar plano de delegação." });
  t({ id: "seed-m4-t5", month: 4, phase: 2, stage: "Delegar", pillar: "people", title: "Treinar lideranças para tomada de decisão.", responsible: "Liderança" });
  t({ id: "seed-m4-t6", month: 4, phase: 2, stage: "Governar", pillar: "delegation", title: "Definir critérios de prestação de contas." });

  // MÊS 5 — PADRONIZAÇÃO (FASE 2)
  t({ id: "seed-m5-t1", month: 5, phase: 2, stage: "Organizar", pillar: "processes", title: "Documentar processos prioritários.", responsible: "Time" });
  t({ id: "seed-m5-t2", month: 5, phase: 2, stage: "Organizar", pillar: "processes", title: "Criar POPs.", responsible: "Time" });
  t({ id: "seed-m5-t3", month: 5, phase: 2, stage: "Organizar", pillar: "processes", title: "Criar checklists.", responsible: "Time" });
  t({ id: "seed-m5-t4", month: 5, phase: 2, stage: "Organizar", pillar: "processes", title: "Definir SLAs.", responsible: "Liderança" });
  t({ id: "seed-m5-t5", month: 5, phase: 2, stage: "Organizar", pillar: "processes", title: "Definir critérios de qualidade.", responsible: "Liderança" });
  t({ id: "seed-m5-t6", month: 5, phase: 2, stage: "Automatizar", pillar: "processes", title: "Definir fonte única de informação." });
  t({ id: "seed-m5-t7", month: 5, phase: 2, stage: "Automatizar", pillar: "automation", title: "Padronizar registro de dados no CRM ou sistema principal.", responsible: "Time" });

  // MÊS 6 — DELEGAÇÃO CONSOLIDADA (FASE 2)
  t({ id: "seed-m6-t1", month: 6, phase: 2, stage: "Governar", pillar: "governance", title: "Implantar reunião semanal de lideranças.", responsible: "Liderança" });
  t({ id: "seed-m6-t2", month: 6, phase: 2, stage: "Delegar", pillar: "delegation", title: "Criar registro de recentralização." });
  t({ id: "seed-m6-t3", month: 6, phase: 2, stage: "Delegar", pillar: "delegation", title: "Medir decisões devolvidas ao empresário." });
  t({ id: "seed-m6-t4", month: 6, phase: 2, stage: "Delegar", pillar: "delegation", title: "Realizar teste de autonomia de três a cinco dias." });
  t({ id: "seed-m6-t5", month: 6, phase: 2, stage: "Diagnosticar", pillar: "processes", title: "Identificar falhas do teste.", responsible: "Liderança" });
  t({ id: "seed-m6-t6", month: 6, phase: 2, stage: "Organizar", pillar: "processes", title: "Criar plano de correção.", responsible: "Liderança" });
  t({ id: "seed-m6-t7", month: 6, phase: 2, stage: "Delegar", pillar: "delegation", title: "Validar responsabilidades transferidas." });

  // MÊS 7 — AUTOMAÇÃO (FASE 3)
  t({ id: "seed-m7-t1", month: 7, phase: 3, stage: "Automatizar", pillar: "automation", title: "Criar backlog de automação.", responsible: "Liderança" });
  t({ id: "seed-m7-t2", month: 7, phase: 3, stage: "Diagnosticar", pillar: "automation", title: "Mapear atividades manuais e repetitivas.", responsible: "Time" });
  t({ id: "seed-m7-t3", month: 7, phase: 3, stage: "Organizar", pillar: "automation", title: "Priorizar automações por impacto." });
  t({ id: "seed-m7-t4", month: 7, phase: 3, stage: "Governar", pillar: "automation", title: "Definir metas de horas economizadas.", responsible: "Liderança" });
  t({ id: "seed-m7-t5", month: 7, phase: 3, stage: "Automatizar", pillar: "automation", title: "Implantar as primeiras automações.", responsible: "Liderança" });
  t({ id: "seed-m7-t6", month: 7, phase: 3, stage: "Governar", pillar: "automation", title: "Medir redução de erros e tempo." });

  // MÊS 8 — DADOS (FASE 3)
  t({ id: "seed-m8-t1", month: 8, phase: 3, stage: "Governar", pillar: "governance", title: "Implantar dashboard executivo." });
  t({ id: "seed-m8-t2", month: 8, phase: 3, stage: "Governar", pillar: "governance", title: "Definir indicadores obrigatórios por área.", responsible: "Liderança" });
  t({ id: "seed-m8-t3", month: 8, phase: 3, stage: "Delegar", pillar: "governance", title: "Definir responsáveis pelos indicadores.", responsible: "Liderança" });
  t({ id: "seed-m8-t4", month: 8, phase: 3, stage: "Automatizar", pillar: "governance", title: "Criar rotina de atualização.", responsible: "Time" });
  t({ id: "seed-m8-t5", month: 8, phase: 3, stage: "Automatizar", pillar: "governance", title: "Implantar alertas.", responsible: "Liderança" });
  t({ id: "seed-m8-t6", month: 8, phase: 3, stage: "Governar", pillar: "governance", title: "Validar qualidade dos dados.", responsible: "Liderança" });
  t({ id: "seed-m8-t7", month: 8, phase: 3, stage: "Governar", pillar: "automation", title: "Medir aderência ao CRM ou sistema principal." });

  // MÊS 9 — GOVERNANÇA (FASE 3)
  t({ id: "seed-m9-t1", month: 9, phase: 3, stage: "Governar", pillar: "governance", title: "Implantar Conselho Executivo Mensal." });
  t({ id: "seed-m9-t2", month: 9, phase: 3, stage: "Governar", pillar: "governance", title: "Criar pauta padrão do conselho." });
  t({ id: "seed-m9-t3", month: 9, phase: 3, stage: "Governar", pillar: "governance", title: "Implantar rotina trimestral de estratégia." });
  t({ id: "seed-m9-t4", month: 9, phase: 3, stage: "Organizar", pillar: "governance", title: "Criar registro de decisões estratégicas." });
  t({ id: "seed-m9-t5", month: 9, phase: 3, stage: "Governar", pillar: "governance", title: "Medir execução dos planos de ação." });
  t({ id: "seed-m9-t6", month: 9, phase: 3, stage: "Governar", pillar: "governance", title: "Revisar metas e indicadores." });

  // MÊS 10 — ESCALA (FASE 3)
  t({ id: "seed-m10-t1", month: 10, phase: 3, stage: "Organizar", pillar: "governance", title: "Definir projeto estratégico de crescimento." });
  t({ id: "seed-m10-t2", month: 10, phase: 3, stage: "Governar", pillar: "processes", title: "Validar capacidade operacional.", responsible: "Liderança" });
  t({ id: "seed-m10-t3", month: 10, phase: 3, stage: "Delegar", pillar: "people", title: "Definir líder responsável pelo projeto." });
  t({ id: "seed-m10-t4", month: 10, phase: 3, stage: "Governar", pillar: "governance", title: "Criar indicadores do projeto." });
  t({ id: "seed-m10-t5", month: 10, phase: 3, stage: "Delegar", pillar: "processes", title: "Executar crescimento sem aumentar a dependência do empresário.", responsible: "Liderança" });
  t({ id: "seed-m10-t6", month: 10, phase: 3, stage: "Governar", pillar: "governance", title: "Medir impacto em receita, margem, capacidade e retrabalho." });

  // MÊS 11 — CONTINUIDADE (FASE 3)
  t({ id: "seed-m11-t1", month: 11, phase: 3, stage: "Diagnosticar", pillar: "people", title: "Mapear pessoas-chave.", responsible: "Liderança" });
  t({ id: "seed-m11-t2", month: 11, phase: 3, stage: "Diagnosticar", pillar: "people", title: "Mapear conhecimentos críticos.", responsible: "Liderança" });
  t({ id: "seed-m11-t3", month: 11, phase: 3, stage: "Diagnosticar", pillar: "people", title: "Identificar funções sem substituto.", responsible: "Liderança" });
  t({ id: "seed-m11-t4", month: 11, phase: 3, stage: "Organizar", pillar: "processes", title: "Criar plano de continuidade.", responsible: "Liderança" });
  t({ id: "seed-m11-t5", month: 11, phase: 3, stage: "Organizar", pillar: "people", title: "Criar plano de sucessão." });
  t({ id: "seed-m11-t6", month: 11, phase: 3, stage: "Delegar", pillar: "delegation", title: "Realizar teste de ausência entre sete e quinze dias." });
  t({ id: "seed-m11-t7", month: 11, phase: 3, stage: "Governar", pillar: "processes", title: "Corrigir falhas identificadas.", responsible: "Liderança" });

  // MÊS 12 — CONSOLIDAÇÃO (FASE 3)
  t({ id: "seed-m12-t1", month: 12, phase: 3, stage: "Diagnosticar", pillar: "governance", title: "Refazer diagnóstico IDE." });
  t({ id: "seed-m12-t2", month: 12, phase: 3, stage: "Diagnosticar", pillar: "governance", title: "Refazer diagnóstico CLO." });
  t({ id: "seed-m12-t3", month: 12, phase: 3, stage: "Governar", pillar: "governance", title: "Calcular IGE final." });
  t({ id: "seed-m12-t4", month: 12, phase: 3, stage: "Governar", pillar: "governance", title: "Comparar linha de base com resultado final." });
  t({ id: "seed-m12-t5", month: 12, phase: 3, stage: "Governar", pillar: "governance", title: "Calcular horas liberadas." });
  t({ id: "seed-m12-t6", month: 12, phase: 3, stage: "Governar", pillar: "governance", title: "Calcular redução do retrabalho." });
  t({ id: "seed-m12-t7", month: 12, phase: 3, stage: "Governar", pillar: "governance", title: "Calcular custos evitados." });
  t({ id: "seed-m12-t8", month: 12, phase: 3, stage: "Governar", pillar: "governance", title: "Registrar crescimento e margem." });
  t({ id: "seed-m12-t9", month: 12, phase: 3, stage: "Governar", pillar: "governance", title: "Validar nível de maturidade." });
  t({ id: "seed-m12-t10", month: 12, phase: 3, stage: "Governar", pillar: "governance", title: "Criar próximo roadmap de 12 meses." });

  return tasks;
}
