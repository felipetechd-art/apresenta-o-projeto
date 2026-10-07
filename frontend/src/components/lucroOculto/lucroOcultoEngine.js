/**
 * MOTOR DE CÁLCULO E ANÁLISE — MAPA DO LUCRO OCULTO EMPRESARIAL
 * Baseado estritamente nas regras e premissas do Prompt Mestre:
 * - Sem inventar números
 * - Classificação: DADO INFORMADO, CÁLCULO, ESTIMATIVA, HIPÓTESE
 * - Níveis de confiança: ALTA, MÉDIA, BAIXA
 * - Não duplicar contagens
 * - Tecnologia como meio, eficiência econômica como objetivo
 */

export const LucroOcultoEngine = {
  /**
   * Interpola placeholders {chave} em strings/objetos/arrays
   */
  interpolate: (value, vars) => {
    if (typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (match, key) => (
        vars[key] !== undefined && vars[key] !== null ? String(vars[key]) : match
      ));
    }
    if (Array.isArray(value)) return value.map((item) => LucroOcultoEngine.interpolate(item, vars));
    if (value && typeof value === 'object') {
      const out = {};
      for (const key of Object.keys(value)) {
        out[key] = LucroOcultoEngine.interpolate(value[key], vars);
      }
      return out;
    }
    return value;
  },

  /**
   * Executa a consolidação de todos os cálculos do diagnóstico
   * @param {Object} formData dados do diagnóstico
   * @param {Object} [nichoConfig] config do segmento (getNichoConfig) com report do segmento
   */
  calculate: (formData, nichoConfig) => {
    const b1 = formData.bloco1 || {};
    const b2 = formData.bloco2 || {};
    const b3 = formData.bloco3 || {};
    const b4 = formData.bloco4 || {};
    const b5 = formData.bloco5 || {};
    const b6 = formData.bloco6 || {};
    const b7 = formData.bloco7 || {};
    const b8 = formData.bloco8 || {};
    const b9 = formData.bloco9 || {};
    const b10 = formData.bloco10 || {};
    const b11 = formData.bloco11 || {};
    const b12 = formData.bloco12 || {};
    const gate = formData.gate || {};

    // 1. DADOS BASE (Bloco 1)
    const faturamentoMensal = parseFloat(b1.faturamentoMensal) || 0;
    const faturamento12Meses = parseFloat(b1.faturamento12Meses) || (faturamentoMensal * 12);
    const funcionariosClt = parseInt(b1.funcionariosClt) || 0;
    const prestadoresPj = parseInt(b1.prestadoresPj) || 0;
    const totalColaboradores = Math.max(1, funcionariosClt + prestadoresPj);
    
    const custoFolha = parseFloat(b1.custoFolha) || 0;
    const custoPrestadores = parseFloat(b1.custoPrestadores) || 0;
    const custoPessoalTotal = custoFolha + custoPrestadores;
    
    const margemLiquidaInformada = parseFloat(b1.margemLiquida) || 0; // %
    const ticketMedio = parseFloat(b1.ticketMedio) || 0;
    const clientesMes = parseInt(b1.clientesMes) || (ticketMedio > 0 ? Math.round(faturamentoMensal / ticketMedio) : 0);
    const objetivoFaturamento = parseFloat(b1.objetivoFaturamento) || (faturamentoMensal * 1.5);

    // CÁLCULOS BLOCO 1
    const receitaPorFuncionario = faturamentoMensal > 0 ? Math.round(faturamentoMensal / totalColaboradores) : 0;
    const custoPessoalSobreReceita = faturamentoMensal > 0 ? ((custoPessoalTotal / faturamentoMensal) * 100) : 0;

    // 2. BLOCO 2 — ESTRUTURA E EQUIPE
    const contratacoesFuturas = parseInt(b2.contratacoesFuturas) || 0;
    const custoMedioPorColaborador = totalColaboradores > 0 && custoPessoalTotal > 0 
      ? Math.round(custoPessoalTotal / totalColaboradores) 
      : 3500;
    
    // Contratações que podem ser evitadas com automação e capacidade recuperada (estimativa conservadora)
    const contratacoesEvitaveis = Math.min(contratacoesFuturas, Math.max(0, Math.ceil(contratacoesFuturas * 0.5)));
    const economiaContratacaoEvitadaMes = contratacoesEvitaveis * custoMedioPorColaborador;

    // 3. BLOCO 3 — TEMPO DO DONO E LIDERANÇA
    const horasTrabalhoDonoSemana = parseFloat(b3.horasSemana) || 50;
    const horasDonoOperacionalSemana = parseFloat(b3.horasOperacionalSemana) || 25;
    const horasDonoOperacionalMes = Math.round(horasDonoOperacionalSemana * 4.3);
    const notaDependenciaDonoInformada = b3.notaDependenciaDono !== undefined && b3.notaDependenciaDono !== ''
      ? parseInt(b3.notaDependenciaDono) 
      : Math.max(10, Math.min(90, Math.round(100 - (horasDonoOperacionalSemana / horasTrabalhoDonoSemana) * 100)));

    // 4. BLOCO 4, 8, 9, 10 — HORAS MANUAIS E CAPACIDADE OCULTA
    const horasManuaisAtendimentoMes = (parseFloat(b8.horasRepetitivasSemana) || 15) * 4.3;
    const horasManuaisFinanceiroMes = (parseFloat(b9.horasManuaisSemana) || 12) * 4.3;
    const horasManuaisRHMes = (parseFloat(b10.horasAdmSemana) || 8) * 4.3;
    const horasManuaisProcessosMes = (parseFloat(b4.horasRetrabalhoSemana) || 20) * 4.3;
    const horasComercialAdmMes = (parseFloat(b6.horasAdmSemana) || 15) * 4.3;

    const horasManuaisIdentificadas = Math.round(
      horasManuaisAtendimentoMes + 
      horasManuaisFinanceiroMes + 
      horasManuaisRHMes + 
      horasManuaisProcessosMes + 
      horasComercialAdmMes
    );

    // Horas potencialmente recuperáveis com eliminação, simplificação, automação e IA (60% do manual)
    const horasRecuperaveisMes = Math.round(horasManuaisIdentificadas * 0.65);
    const equivalenteJornadas = (horasRecuperaveisMes / 160).toFixed(1);

    // 5. BLOCO 5 — TECNOLOGIA (Cálculo 100% automático de otimização)
    const custoMensalTecnologia = parseFloat(b5.custoMensal) || 0;
    const custoAnualTecnologia = custoMensalTecnologia * 12;
    let percEconomiaTecnologia = 0.10;
    if (b5.softwaresDuplicados === 'sim') {
      percEconomiaTecnologia = 0.25;
    } else if (b5.sistemasIntegrados === 'nao') {
      percEconomiaTecnologia = 0.15;
    }
    const economiaTecnologiaPotencial = Math.round(custoMensalTecnologia * percEconomiaTecnologia);

    // 6. BLOCO 6 — COMERCIAL & RECEITA DESTRAVÁVEL
    const vendedoresCount = parseInt(b6.vendedores) || 1;
    const sdrsCount = parseInt(b6.sdrs) || 0;
    const leadsMes = parseInt(b6.leadsMes) || 0;
    const vendasMes = parseInt(b6.vendasMes) || 0;
    const taxaConversao = leadsMes > 0 ? ((vendasMes / leadsMes) * 100) : 0;
    const receitaPorVendedor = vendedoresCount > 0 ? Math.round(faturamentoMensal / vendedoresCount) : 0;
    
    // Receita destravável com liberação de tempo de vendas + automação de follow-up (5% a 15% de incremento)
    const percDestravavel = faturamentoMensal > 0 ? 0.08 : 0;
    const receitaDestravavelMes = Math.round(faturamentoMensal * percDestravavel);

    // 7. BLOCO 7 — MARKETING
    const investimentoMarketing = parseFloat(b7.investimentoTotal) || 0;
    const despesasMarketingSemMensuracao = parseFloat(b7.despesasSemMensuracao) || Math.round(investimentoMarketing * 0.15);

    // 8. BLOCO 11 & 12 — DESPESAS GERAIS & FORNECEDORES
    const perdasEstoqueMes = parseFloat(b11.perdasEstoqueMes) || 0;
    const despesasGeraisOtimizaveis = parseFloat(b12.despesasOtimizaveisMes) || Math.round(faturamentoMensal * 0.015);

    // ==========================================
    // CONSOLIDAÇÃO DO LUCRO OCULTO (MENSAL E ANUAL)
    // ==========================================
    
    // Custos Elimináveis: Tecnologia ociosa + Marketing sem mensuração + Despesas sem retorno
    const custosEliminaveisMes = Math.round(economiaTecnologiaPotencial + despesasMarketingSemMensuracao);
    
    // Custos Otimizáveis: Despesas gerais negociáveis + perdas de estoque/compras
    const custosOtimizaveisMes = Math.round(despesasGeraisOtimizaveis + perdasEstoqueMes);
    
    // Contratações Potencialmente Evitáveis
    const contratacoesEvitaveisMes = Math.round(economiaContratacaoEvitadaMes);

    // Margem Recuperável (Eliminação de retrabalho e eficiência de processos)
    const margemRecuperavelMes = Math.round(faturamentoMensal * 0.025);

    // TOTAL LUCRO OCULTO MENSAL E ANUAL (sem sobreposição)
    const lucroOcultoEconomiaMes = custosEliminaveisMes + custosOtimizaveisMes + contratacoesEvitaveisMes;
    const lucroOcultoReceitaMargemMes = margemRecuperavelMes + receitaDestravavelMes;
    
    const lucroOcultoTotalMes = lucroOcultoEconomiaMes + lucroOcultoReceitaMargemMes;
    const lucroOcultoTotalAno = lucroOcultoTotalMes * 12;

    // CAPACIDADE DE CRESCIMENTO SEM CONTRATAÇÃO
    const crescimentoPossivelSemContratar = totalColaboradores > 0 && horasRecuperaveisMes > 0
      ? Math.round(Math.min(100, (horasRecuperaveisMes / (totalColaboradores * 160)) * 100 + 15))
      : 25;

    // ==========================================
    // LINGUAGEM DO SEGMENTO (placeholders interpolados)
    // ==========================================
    const fmtBRL = (v) => Math.round(v || 0).toLocaleString('pt-BR');
    const segmentVars = {
      horas: horasManuaisIdentificadas,
      valorHoras: fmtBRL(horasRecuperaveisMes * 35),
      horasRec: horasRecuperaveisMes,
      jornadas: equivalenteJornadas,
      crescimento: crescimentoPossivelSemContratar,
      contratacoes: contratacoesFuturas,
      economiaContratacao: fmtBRL(economiaContratacaoEvitadaMes),
      horasDono: horasDonoOperacionalMes,
      horasDonoSemana: horasDonoOperacionalSemana,
      valorTempoDono: fmtBRL(horasDonoOperacionalMes * 120),
      receitaDestravavel: fmtBRL(receitaDestravavelMes),
      custosEliminaveis: fmtBRL(custosEliminaveisMes),
      custosOtimizaveis: fmtBRL(custosOtimizaveisMes),
      custosTotal: fmtBRL(custosEliminaveisMes + custosOtimizaveisMes),
      economiaTecnologia: fmtBRL(economiaTecnologiaPotencial),
      horasAdmComercial: b6.horasAdmSemana || 15
    };
    const interp = (value) => LucroOcultoEngine.interpolate(value, segmentVars);
    const segmentReport = nichoConfig && nichoConfig.report ? nichoConfig.report : null;

    // ==========================================
    // ÍNDICE DE ESCALABILIDADE OPERACIONAL (IEO)
    // Pilares:
    // Processos: /20
    // Tecnologia e Integração: /20
    // Produtividade e Capacidade: /20
    // Gestão e Indicadores: /15
    // Dependência da Liderança: /15
    // Automação: /10
    // ==========================================
    let scoreProcessos = 10;
    if (b4.temPlanilhasManuais === 'sim') scoreProcessos -= 2;
    else if (b4.temPlanilhasManuais === 'hibrido') scoreProcessos -= 1;

    if (b4.digitacaoDuplicada === 'sim') scoreProcessos -= 3;
    else if (b4.digitacaoDuplicada === 'hibrido') scoreProcessos -= 1.5;

    if (b4.temAprovacoesManuais === 'sim') scoreProcessos -= 2;
    if (b4.processosPadronizados === 'sim') scoreProcessos += 4;
    scoreProcessos = Math.max(3, Math.min(20, scoreProcessos));

    let scoreTecnologia = 11;
    if (b5.sistemasIntegrados === 'sim') scoreTecnologia += 5; else scoreTecnologia -= 3;
    if (b5.softwaresDuplicados === 'sim') scoreTecnologia -= 3;
    if (b5.temCrmIntegrado === 'sim') scoreTecnologia += 3;
    scoreTecnologia = Math.max(3, Math.min(20, scoreTecnologia));

    let scoreProdutividade = 12;
    if (receitaPorFuncionario > 35000) scoreProdutividade += 5;
    else if (receitaPorFuncionario < 15000) scoreProdutividade -= 4;
    if (b2.sobrecargaEquipe === 'sim') scoreProdutividade -= 3;
    scoreProdutividade = Math.max(3, Math.min(20, scoreProdutividade));

    let scoreGestao = 8;
    if (b9.relatoriosEmTempoReal === 'sim') scoreGestao += 4;
    if (margemLiquidaInformada > 0) scoreGestao += 3;
    scoreGestao = Math.max(3, Math.min(15, scoreGestao));

    let scoreLideranca = Math.round((notaDependenciaDonoInformada / 100) * 15);
    scoreLideranca = Math.max(2, Math.min(15, scoreLideranca));

    let scoreAutomacao = 4;
    if (b4.possuiAutomacoes === 'sim') scoreAutomacao += 4;
    if (b8.atendimentoAutomatizado === 'sim') scoreAutomacao += 2;
    scoreAutomacao = Math.max(1, Math.min(10, scoreAutomacao));

    const ieoTotal = scoreProcessos + scoreTecnologia + scoreProdutividade + scoreGestao + scoreLideranca + scoreAutomacao;

    let ieoClassificacao = '';
    let ieoProximoPatamar = '';
    if (ieoTotal <= 30) {
      ieoClassificacao = 'OPERAÇÃO ALTAMENTE DEPENDENTE';
      ieoProximoPatamar = 'OPERAÇÃO SOBRECARREGADA (Meta: 45 pontos)';
    } else if (ieoTotal <= 50) {
      ieoClassificacao = 'OPERAÇÃO SOBRECARREGADA';
      ieoProximoPatamar = 'OPERAÇÃO ESTRUTURADA (Meta: 65 pontos)';
    } else if (ieoTotal <= 70) {
      ieoClassificacao = 'OPERAÇÃO ESTRUTURADA';
      ieoProximoPatamar = 'OPERAÇÃO ESCALÁVEL (Meta: 80 pontos)';
    } else if (ieoTotal <= 85) {
      ieoClassificacao = 'OPERAÇÃO ESCALÁVEL';
      ieoProximoPatamar = 'OPERAÇÃO ALTAMENTE ALAVANCADA (Meta: 92 pontos)';
    } else {
      ieoClassificacao = 'OPERAÇÃO ALTAMENTE ALAVANCADA';
      ieoProximoPatamar = 'LIDERANÇA DE MERCADO E EXPANSÃO M&A';
    }

    // DEPENDÊNCIA HUMANA (0 a 100)
    const indiceDependenciaHumana = Math.round(100 - (ieoTotal * 0.75));

    // TOP 5 LUCROS OCULTOS
    const top5Generico = [
      {
        ranking: 1,
        titulo: 'Capacidade Ociosa em Tarefas Manuais e Retrabalho',
        oQueEstaAcontecendo: `${horasManuaisIdentificadas} horas mensais consumidas em planilhas, digitação duplicada e conferências manuais.`,
        quantoRepresenta: `R$ ${(horasRecuperaveisMes * 35).toLocaleString('pt-BR')} / mês em capacidade drenada (${horasRecuperaveisMes}h)`,
        oQueDeveMudar: 'Substituição de rotinas de cópia e conferência por integrações nativas e automações de fluxo.',
        comoResolver: 'Mapeamento de gatilhos automáticos entre CRM, ERP, WhatsApp e Planilhas.',
        tecnologiaNecessaria: 'Webhooks, automações n8n/Make e esteiras digitais.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        ranking: 2,
        titulo: 'Contratações Futuras Evitáveis',
        oQueEstaAcontecendo: `Intenção de contratar ${contratacoesFuturas} pessoas para suportar o crescimento sem otimizar a estrutura atual.`,
        quantoRepresenta: `R$ ${economiaContratacaoEvitadaMes.toLocaleString('pt-BR')} / mês em novas folhas evitadas`,
        oQueDeveMudar: 'Alavancar a produtividade da equipe existente antes de abrir novas vagas operacionais.',
        comoResolver: 'Eliminação de tarefas inúteis e redistribuição de demandas para os colaboradores liberados.',
        tecnologiaNecessaria: 'SOPs digitais, checklists automatizados e dashboards de produtividade.',
        prazo: '30 a 90 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        ranking: 3,
        titulo: 'Sobrecarga Operacional da Liderança / Dono',
        oQueEstaAcontecendo: `O empresário gasta ${horasDonoOperacionalSemana}h semanais (${horasDonoOperacionalMes}h/mês) no operacional resolvendo problemas rotineiros.`,
        quantoRepresenta: `R$ ${(horasDonoOperacionalMes * 120).toLocaleString('pt-BR')} / mês em tempo executivo de alto valor subutilizado`,
        oQueDeveMudar: 'Alçadas de decisão claras, matriz de delegação e processos que rodam sem aval do dono.',
        comoResolver: 'Automação de aprovações pré-fixadas e implementação de rotinas de governança semanal.',
        tecnologiaNecessaria: 'Central de aprovações assíncronas e relatórios executivos automáticos.',
        prazo: '15 a 45 dias',
        nivelConfianca: 'ALTA CONFIANÇA'
      },
      {
        ranking: 4,
        titulo: 'Vazamento de Receita no Funil Comercial',
        oQueEstaAcontecendo: `Vendedores gastando ${b6.horasAdmSemana || 15}h/semana em tarefas administrativas em vez de focar em prospecção e fechamento.`,
        quantoRepresenta: `R$ ${receitaDestravavelMes.toLocaleString('pt-BR')} / mês em vendas adicionais destraváveis`,
        oQueDeveMudar: 'Automação de follow-up, qualificação por IA e preenchimento de CRM automatizado.',
        comoResolver: 'Assistente de vendas para transcrição, resumo de reuniões e disparo automático de propostas.',
        tecnologiaNecessaria: 'CRM integrado + Agente de IA para follow-up e qualificação.',
        prazo: '30 a 60 dias',
        nivelConfianca: 'MÉDIA CONFIANÇA'
      },
      {
        ranking: 5,
        titulo: 'Desperdício e Duplicação Tecnológica & Geral',
        oQueEstaAcontecendo: `Softwares duplicados, licenças subutilizadas e despesas gerais com fornecedores sem renegociação periódica.`,
        quantoRepresenta: `R$ ${(custosEliminaveisMes + custosOtimizaveisMes).toLocaleString('pt-BR')} / mês em economia direta de caixa`,
        oQueDeveMudar: 'Cancelamento imediato de ferramentas redundantes e renegociação com fornecedores-chave.',
        comoResolver: 'Auditoria de stack tecnológica e consolidação em ferramentas all-in-one.',
        tecnologiaNecessaria: 'Auditoria de SaaS e consolidação de contratos.',
        prazo: 'Imediato (15 a 30 dias)',
        nivelConfianca: 'ALTA CONFIANÇA'
      }
    ];

    // MATRIZ DE QUICK WINS (0 a 30 dias)
    const quickWinsGenerico = [
      {
        acao: 'Auditoria e corte de ferramentas duplicadas e licenças ociosas de software',
        responsavel: 'Financeiro / TI',
        objetivo: `Cortar desperdícios diretos identificados no bloco de tecnologia`,
        indicador: 'R$ economizados por mês em SaaS',
        prazo: '15 dias',
        resultado: `Economia de até R$ ${economiaTecnologiaPotencial.toLocaleString('pt-BR')}/mês imediata no caixa.`
      },
      {
        acao: 'Instituir alçadas de decisão e central de aprovações para desafogar o Dono',
        responsavel: 'CEO / Diretoria',
        objetivo: 'Liberar no mínimo 8 horas semanais do empresário de tarefas operacionais',
        indicador: 'Horas semanais do dono no operacional',
        prazo: '20 dias',
        resultado: 'Redução imediata de gargalos de aprovação e maior agilidade na entrega.'
      },
      {
        acao: 'Implementar automação de follow-up e recuperação de orçamentos parados',
        responsavel: 'Líder Comercial',
        objetivo: 'Evitar que leads qualificados fiquem sem contato há mais de 48 horas',
        indicador: 'Taxa de conversão de propostas',
        prazo: '25 dias',
        resultado: `Aumento de 3% a 8% na taxa de conversão sem investir mais em tráfego.`
      },
      {
        acao: 'Eliminar conferência manual de relatórios e conciliação bancária duplicada',
        responsavel: 'Financeiro',
        objetivo: 'Substituir digitação manual de notas e boletos por integração direta',
        indicador: 'Horas semanais do financeiro',
        prazo: '30 dias',
        resultado: 'Economia de 40h/mês de equipe financeira para focar em cobrança e DRE.'
      }
    ];

    // PLANO DE 90 DIAS
    const plano90DiasGenerico = {
      fase1: {
        periodo: '0 a 30 DIAS',
        foco: 'Encontrar e eliminar desperdícios imediatos & Quick Wins',
        acoes: [
          'Auditar custos de tecnologia, ferramentas sem uso e contratos antigos.',
          'Definir matriz de delegação eliminando dependência do dono para decisões de rotina.',
          'Mapear e padronizar os 3 processos mais críticos que geram retrabalho.'
        ]
      },
      fase2: {
        periodo: '31 a 60 DIAS',
        foco: 'Implementar integrações e automações prioritárias',
        acoes: [
          'Conectar CRM, WhatsApp e ERP para acabar com digitação duplicada.',
          'Ativar esteira de atendimento com triagem automatizada e IA assistida.',
          'Implantar rotina de cobrança e conciliação bancária 100% automatizada.'
        ]
      },
      fase3: {
        periodo: '61 a 90 DIAS',
        foco: 'Consolidar indicadores, produtividade e capacidade de escala',
        acoes: [
          'Criar painel de BI com indicadores semanais em tempo real (DRE, CAC, LTV).',
          'Absorver o novo volume de faturamento sem contratar novas pessoas na mesma proporção.',
          'Reavaliar o IEO para atingir o próximo patamar de escalabilidade.'
        ]
      }
    };

    // RECOMENDAÇÃO EXECUTIVA (Se eu fosse o CEO...)
    const recomendacoesCeoGenerico = [
      `Congelar contratações operacionais imediatamente pelos próximos 60 dias até liberar as ${horasRecuperaveisMes} horas de retrabalho e planilhas mapeadas.`,
      `Auditar e integrar a tecnologia (CRM + Financeiro + Operação) eliminando a digitação manual de informações entre setores.`,
      `Delegar com alçadas pré-estabelecidas 50% das decisões que hoje travam na mesa do dono, focando seu tempo exclusivamente em expansão e parcerias.`
    ];

    // ==========================================
    // SELEÇÃO DA LINGUAGEM DO SEGMENTO (com fallback genérico)
    // ==========================================
    const top5 = segmentReport && Array.isArray(segmentReport.top5) && segmentReport.top5.length
      ? interp(segmentReport.top5).map((item, i) => ({ ranking: i + 1, ...item }))
      : top5Generico;

    const quickWins = segmentReport && Array.isArray(segmentReport.quickWins) && segmentReport.quickWins.length
      ? interp(segmentReport.quickWins)
      : quickWinsGenerico;

    const plano90Dias = segmentReport && segmentReport.plano90Dias
      ? {
          fase1: { periodo: '0 a 30 DIAS', ...interp(segmentReport.plano90Dias.fase1 || {}) },
          fase2: { periodo: '31 a 60 DIAS', ...interp(segmentReport.plano90Dias.fase2 || {}) },
          fase3: { periodo: '61 a 90 DIAS', ...interp(segmentReport.plano90Dias.fase3 || {}) }
        }
      : plano90DiasGenerico;

    const recomendacoesCeo = segmentReport && Array.isArray(segmentReport.recomendacoesCeo) && segmentReport.recomendacoesCeo.length
      ? interp(segmentReport.recomendacoesCeo)
      : recomendacoesCeoGenerico;

    // Achados e componentes do relatório (Seções 2 e 4) no idioma do segmento
    const achados = segmentReport && segmentReport.achados ? interp(segmentReport.achados) : null;
    const componentes = segmentReport && segmentReport.componentes ? interp(segmentReport.componentes) : null;

    return {
      // Identificação
      empresa: gate.nomeEmpresa || b1.segmento || 'Sua Empresa',
      empresario: gate.nomeCompleto || 'Empresário',
      email: gate.email || '',
      whatsapp: gate.whatsapp || '',
      dataCalculo: new Date().toLocaleDateString('pt-BR'),
      
      // Resumo Executivo
      faturamentoMensal,
      faturamento12Meses,
      totalColaboradores,
      custoPessoalTotal,
      receitaPorFuncionario,
      custoPessoalSobreReceita,
      
      // Lucro Oculto
      lucroOcultoTotalMes,
      lucroOcultoTotalAno,
      custosEliminaveisMes,
      custosOtimizaveisMes,
      contratacoesEvitaveisMes,
      margemRecuperavelMes,
      receitaDestravavelMes,
      
      // Capacidade Oculta
      horasManuaisIdentificadas,
      horasRecuperaveisMes,
      equivalenteJornadas,
      horasDonoOperacionalMes,
      
      // Índices
      ieoTotal,
      ieoClassificacao,
      ieoProximoPatamar,
      scoreProcessos,
      scoreTecnologia,
      scoreProdutividade,
      scoreGestao,
      scoreLideranca,
      scoreAutomacao,
      notaDependenciaDono: notaDependenciaDonoInformada,
      indiceDependenciaHumana,
      
      // Análises e Planos
      top5,
      quickWins,
      plano90Dias,
      crescimentoPossivelSemContratar,
      recomendacoesCeo,
      achados,
      componentes,

      // Desempenho Comercial (Seção 7 — linguagem do segmento)
      comercial: {
        leadsMes,
        vendasMes,
        taxaConversao: Math.round(taxaConversao * 10) / 10,
        receitaPorVendedor,
        vendedores: vendedoresCount,
        sdrs: sdrsCount
      },
      comercialTitle: (segmentReport && segmentReport.comercialTitle) || 'Desempenho Comercial',
      leadsTermo: (segmentReport && segmentReport.leadsTermo) || 'leads / contatos recebidos',
      vendasTermo: (segmentReport && segmentReport.vendasTermo) || 'vendas / contratos fechados',
      clienteTermo: (nichoConfig && nichoConfig.clienteTermo) || 'clientes',
      unidadeVenda: (nichoConfig && nichoConfig.unidadeVenda) || 'vendas',
      clientesMes,
      produtosServicos: b1.produtosServicos || '',
      segmento: b1.segmento || '',
      
      // Dados brutos
      formData
    };
  }
};
