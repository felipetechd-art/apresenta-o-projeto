import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper generator for mock sparkline data
const genSparkline = (base, variance, count = 10) => {
  return Array.from({ length: count }, () => Math.round(base + (Math.random() - 0.5) * variance * 2));
};

// ==========================================
// 1. DATASETS FOR CEO DASHBOARD (BASELINE)
// ==========================================
const baseDashboardData = {
  period: "01/05/2025 - 16/05/2025",
  comparisonPeriod: "01/04/2025 - 16/04/2025",
  lastUpdate: "16/05/2025 09:45",
  kpis: {
    receitaContratada: { value: 1280000, change: 28.6, trend: "up" },
    receitaRecebida: { value: 860000, change: 24.1, trend: "up" },
    roiComercial: { value: 680, change: 62.0, trend: "up", isPp: true },
    cac: { value: 4350, change: -18.7, trend: "down", positiveDown: true },
    ticketMedio: { value: 28400, change: 16.8, trend: "up" },
    entradaMedia: { value: 12700, change: 22.4, trend: "up" },
    pipeline: { value: 2950000, change: 31.2, trend: "up" },
    metaMes: { current: 1280000, target: 2000000, percentage: 64 }
  },
  funnel: [
    { stage: "Leads", count: 1250, conversion: 100, color: "#3b82f6" },
    { stage: "Contato realizado", count: 820, conversion: 65.6, color: "#06b6d4" },
    { stage: "Qualificados", count: 520, conversion: 41.6, color: "#10b981" },
    { stage: "Reuniões agendadas", count: 320, conversion: 25.6, color: "#84cc16" },
    { stage: "Reuniões realizadas", count: 245, conversion: 19.6, color: "#eab308" },
    { stage: "Propostas enviadas", count: 98, conversion: 7.8, color: "#f97316" },
    { stage: "Vendas", count: 45, conversion: 3.6, color: "#ef4444" }
  ],
  generalConversionRate: 3.6,
  revenueEvolution: {
    dates: ["01/05", "04/05", "07/05", "10/05", "13/05", "16/05", "19/05", "22/05", "25/05", "28/05", "31/05"],
    receita: [400000, 520000, 680000, 790000, 920000, 1280000, null, null, null, null, null],
    meta: [500000, 650000, 800000, 980000, 1150000, 1300000, 1480000, 1650000, 1800000, 1920000, 2000000]
  },
  commercialHealth: {
    score: 78,
    change: 12,
    details: [
      { name: "Conversão Reunião → Venda", value: 75, status: "good" },
      { name: "Comparecimento às reuniões", value: 82, status: "good" },
      { name: "ROI Comercial", value: 90, status: "good" },
      { name: "Entrada Média", value: 78, status: "warning" },
      { name: "Tempo de resposta (SDR)", value: 65, status: "warning" }
    ]
  },
  payback: { months: 0.8, change: -0.3 },
  conversionMetrics: [
    { id: "lead_reuniao", title: "LEAD → REUNIÃO AGENDADA", value: 25.6, isPercent: true, change: 4.3, trend: "up", isPp: true, sparkline: [21.2, 22.5, 21.9, 23.4, 24.1, 23.8, 24.9, 25.6] },
    { id: "reuniao_realizada", title: "REUNIÃO AGENDADA → REALIZADA", value: 76.6, isPercent: true, change: 6.1, trend: "up", isPp: true, sparkline: [70.5, 71.8, 73.2, 72.1, 74.5, 75.0, 75.9, 76.6] },
    { id: "realizada_proposta", title: "REUNIÃO REALIZADA → PROPOSTA", value: 40.0, isPercent: true, change: 3.8, trend: "up", isPp: true, sparkline: [36.2, 37.5, 36.9, 38.4, 39.1, 38.8, 39.5, 40.0] },
    { id: "proposta_venda", title: "PROPOSTA → VENDA", value: 45.9, isPercent: true, change: 5.2, trend: "up", isPp: true, sparkline: [40.7, 41.5, 42.8, 43.1, 44.5, 43.9, 44.8, 45.9] },
    { id: "custo_lead", title: "CUSTO POR LEAD", value: 6.40, isCurrency: true, change: -12.3, trend: "down", positiveDown: true, sparkline: [7.30, 7.10, 6.95, 6.80, 6.70, 6.62, 6.50, 6.40] },
    { id: "custo_reuniao_agendada", title: "CUSTO POR REUNIÃO AGENDADA", value: 124.50, isCurrency: true, change: -8.7, trend: "down", positiveDown: true, sparkline: [136.4, 133.2, 131.0, 129.5, 128.0, 126.8, 125.5, 124.5] },
    { id: "custo_reuniao_realizada", title: "CUSTO POR REUNIÃO REALIZADA", value: 166.30, isCurrency: true, change: -4.2, trend: "down", positiveDown: true, sparkline: [173.6, 172.0, 170.5, 169.0, 168.2, 167.5, 167.0, 166.3] },
    { id: "custo_venda", title: "CUSTO POR VENDA", value: 2900.00, isCurrency: true, change: -15.1, trend: "down", positiveDown: true, sparkline: [3415, 3350, 3200, 3110, 3050, 2990, 2940, 2900] }
  ],
  leadSources: [
    { source: "Tráfego Pago", percentage: 58, count: 725, color: "#3b82f6" },
    { source: "Social Selling", percentage: 22, count: 275, color: "#06b6d4" },
    { source: "Indicações", percentage: 12, count: 150, color: "#10b981" },
    { source: "Orgânico", percentage: 6, count: 75, color: "#f97316" },
    { source: "Eventos", percentage: 2, count: 25, color: "#8b5cf6" }
  ],
  followUps: {
    total: 925,
    stages: [
      { stage: "Follow-up 1 (Novo)", count: 320, color: "#3b82f6" },
      { stage: "Follow-up 2 (Respondeu e sumiu)", count: 210, color: "#06b6d4" },
      { stage: "Follow-up 3 (Quer agendar)", count: 150, color: "#10b981" },
      { stage: "Follow-up 4 (No-show)", count: 80, color: "#eab308" },
      { stage: "Follow-up 5 (Proposta enviada)", count: 45, color: "#f97316" },
      { stage: "Follow-up 6 (Nutrição)", count: 120, color: "#8b5cf6" }
    ]
  },
  recentActivities: [
    { type: "venda", label: "Venda realizada", detail: "R$ 44.000", time: "Hoje, 09:15", status: "success" },
    { type: "reuniao", label: "Reunião agendada", detail: "João Silva", time: "Hoje, 10:30", status: "info" },
    { type: "proposta", label: "Proposta enviada", detail: "Clínica Premium", time: "Hoje, 11:45", status: "purple" },
    { type: "ligacao", label: "Ligação realizada", detail: "Empresa X", time: "Hoje, 15:20", status: "warning" },
    { type: "lead", label: "Novo lead", detail: "Indicação - Pedro", time: "Hoje, 16:05", status: "teal" }
  ],
  alerts: [
    { type: "danger", text: "12 reuniões confirmadas para os próximos 3 dias" },
    { type: "warning", text: "Taxa de no-show acima do ideal: 22% (meta < 15%)" },
    { type: "info", text: "35 propostas aguardando retorno há mais de 3 dias" }
  ]
};

// ==========================================
// 2. DATASETS FOR COMMERCIAL TAB (BASELINE)
// ==========================================
const baseCommercialData = {
  period: "01/05/2025 - 16/05/2025",
  comparisonPeriod: "01/04/2025 - 16/04/2025",
  lastUpdate: "16/05/2025 09:45",
  kpis: {
    receitaContratada: { value: 1280000, change: 18.3, trend: "up" },
    pipelineAtivo: { value: 3450000, change: 12.8, trend: "up" },
    taxaConversao: { value: 18.4, change: 2.1, trend: "up", isPp: true },
    ticketMedio: { value: 28400, change: 9.2, trend: "up" },
    entradaMedia: { value: 14800, change: 15.1, trend: "up" },
    cicloMedioVenda: { value: 12, change: -2, trend: "down", positiveDown: true }
  },
  funnel: [
    { stage: "Leads", count: 1250, conversion: 100.0, change: 0, trend: "none", color: "#1e3a8a" },
    { stage: "Qualificados", count: 520, conversion: 41.6, change: 3.2, trend: "up", color: "#0d9488" },
    { stage: "Agendados", count: 320, conversion: 61.5, change: 4.1, trend: "up", color: "#10b981" },
    { stage: "Compareceram", count: 245, conversion: 76.6, change: -1.3, trend: "down", color: "#84cc16" },
    { stage: "Propostas", count: 98, conversion: 40.0, change: 2.8, trend: "up", color: "#eab308" },
    { stage: "Negociação", count: 62, conversion: 63.3, change: 5.6, trend: "up", color: "#f97316" },
    { stage: "Fechados", count: 45, conversion: 72.6, change: 6.9, trend: "up", color: "#8b5cf6" }
  ],
  generalConversionRate: 3.6,
  targetConversionRate: 5.0,
  pipelineFinancial: {
    stages: ["Pipeline Total", "Propostas", "Negociação", "Alta Probabilidade", "Previsão de Fechamento"],
    values: [3450000, 1280000, 840000, 620000, 410000],
    colors: ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#8b5cf6"]
  },
  closersPerformance: [
    { name: "Felipe", meetings: 22, proposals: 18, sales: 10, conversion: 55, ticket: 32100, revenue: 321000, trend: "up" },
    { name: "Jackson", meetings: 18, proposals: 12, sales: 5, conversion: 41, ticket: 26400, revenue: 132000, trend: "up" },
    { name: "Maria", meetings: 15, proposals: 8, sales: 4, conversion: 50, ticket: 22700, revenue: 90000, trend: "down" },
    { name: "Pedro", meetings: 14, proposals: 6, sales: 2, conversion: 33, ticket: 24100, revenue: 48000, trend: "down" }
  ],
  closersTotals: { meetings: 69, proposals: 44, sales: 21, conversion: 48, ticket: 26400, revenue: 591000 },
  sdrsPerformance: [
    { name: "Nicolas", leads: 130, contacts: 92, meetings: 35, attendance: 28, txComp: 80, time: "8 min" },
    { name: "Ana", leads: 110, contacts: 74, meetings: 28, attendance: 19, txComp: 68, time: "12 min" },
    { name: "Lucas", leads: 95, contacts: 61, meetings: 21, attendance: 14, txComp: 67, time: "15 min" },
    { name: "Bruna", leads: 80, contacts: 48, meetings: 16, attendance: 11, txComp: 69, time: "11 min" }
  ],
  sdrsTotals: { leads: 415, contacts: 275, meetings: 100, attendance: 72, txComp: 72, time: "11 min" },
  salesSources: [
    { source: "Tráfego Pago", percentage: 42, amount: 538000, color: "#3b82f6" },
    { source: "Social Selling", percentage: 22, amount: 282000, color: "#06b6d4" },
    { source: "Indicações", percentage: 16, amount: 205000, color: "#10b981" },
    { source: "Outbound", percentage: 12, amount: 154000, color: "#eab308" },
    { source: "Eventos", percentage: 6, amount: 76000, color: "#8b5cf6" },
    { source: "Parceiros", percentage: 2, amount: 25000, color: "#f97316" }
  ],
  conversionsByStage: {
    categories: ["Leads", "Qualificados", "Agendados", "Compareceram", "Propostas", "Negociação", "Vendidos"],
    values: [1250, 520, 320, 245, 98, 62, 45],
    percentages: [100, 41.6, 25.6, 19.6, 7.8, 5.0, 3.6],
    colors: ["#3b82f6", "#06b6d4", "#10b981", "#84cc16", "#eab308", "#f97316", "#ef4444"]
  },
  lossReasons: [
    { reason: "Sem orçamento", count: 32, percentage: 24, color: "#ef4444" },
    { reason: "Sem sócio / Decisor", count: 14, percentage: 10, color: "#f97316" },
    { reason: "Vai pensar", count: 21, percentage: 16, color: "#eab308" },
    { reason: "Timing inadequado", count: 17, percentage: 13, color: "#10b981" },
    { reason: "Concorrente", count: 12, percentage: 9, color: "#06b6d4" },
    { reason: "Sem resposta", count: 26, percentage: 19, color: "#3b82f6" },
    { reason: "Outro", count: 10, percentage: 8, color: "#8b5cf6" }
  ],
  upcomingRevenue: [
    { business: "Empresa Alfa", value: 80000, probability: 90, forecast: "Hoje" },
    { business: "Empresa Beta", value: 44000, probability: 80, forecast: "Amanhã" },
    { business: "Empresa Gama", value: 120000, probability: 70, forecast: "19/05" },
    { business: "Empresa Delta", value: 60000, probability: 60, forecast: "22/05" },
    { business: "Empresa Ômega", value: 85000, probability: 60, forecast: "23/05" }
  ],
  upcomingRevenueTotal: 389000,
  monthlyGoals: [
    { label: "Receita Contratada", current: 1280000, target: 2000000, percentage: 64, isCurrency: true },
    { label: "Reuniões Realizadas", current: 320, target: 450, percentage: 72, isNumber: true },
    { label: "Taxa de Conversão", current: 18.4, target: 20.0, percentage: 92, isPercent: true },
    { label: "Entradas Recebidas", current: 580000, target: 1000000, percentage: 58, isCurrency: true },
    { label: "Ticket Médio", current: 28400, target: 30000, percentage: 93, isCurrency: true }
  ],
  recentActivities: [
    { time: "09:30", label: "Felipe realizou reunião com Empresa Alfa", status: "success", badge: "Venda Ganha", detail: "R$ 80.000" },
    { time: "09:41", label: "Jackson agendou reunião com Empresa Beta", status: "info", badge: "Agendado", detail: "19/05 14:00" },
    { time: "10:12", label: "Nicolas qualificou lead - Empresa Gama", status: "purple", badge: "Qualificado" },
    { time: "10:20", label: "Recebimento de entrada - Empresa Alfa", status: "warning", badge: "Pagamento", detail: "R$ 24.000" },
    { time: "10:45", label: "Proposta enviada - Empresa Delta", status: "orange", badge: "Proposta", detail: "R$ 60.000" }
  ],
  alerts: [
    { type: "danger", text: "Propostas paradas há mais de 7 dias", detail: "12 negócios" },
    { type: "warning", text: "Taxa de no-show acima da meta (meta < 15%)", detail: "21%" },
    { type: "danger", text: "Jackson abaixo da meta de conversão", detail: "41%" },
    { type: "info", text: "Pipeline caiu 22% nos últimos 7 dias", detail: "-22%" },
    { type: "danger", text: "Tempo de resposta do SDR acima de 15 min", detail: "Média: 18 min" }
  ],
  insights: [
    { type: "info", text: "A taxa de comparecimento caiu de 84% para 71% nos últimos 7 dias. O principal impacto veio dos leads de tráfego pago." },
    { type: "success", text: "Jackson está gerando mais reuniões que a média da equipe, porém com menor taxa de comparecimento. Revise o processo de qualificação." },
    { type: "success", text: "Propostas acima de R$ 80k têm conversão 22% maior quando a entrada é superior a 35% do contrato." },
    { type: "warning", text: "Existem R$ 640k em propostas abertas há mais de 5 dias sem follow-up registrado." }
  ]
};

// ==========================================
// 3. DATASETS FOR MARKETING TAB (BASELINE)
// ==========================================
const baseMarketingData = {
  period: "01/05/2025 - 16/05/2025",
  comparisonPeriod: "01/04/2025 - 16/04/2025",
  lastUpdate: "16/05/2025 09:45",
  kpis: {
    investimentoTotal: { value: 41250, change: 12.6, trend: "up" },
    leadsGerados: { value: 620, change: 18.3, trend: "up" },
    leadsQualificados: { value: 280, change: 21.7, trend: "up", totalLeadRatio: 45.2 },
    cpl: { value: 66.53, change: -6.3, trend: "down", positiveDown: true },
    cplq: { value: 147.32, change: -8.1, trend: "down", positiveDown: true },
    custoReuniaoComparecida: { value: 284.83, change: -9.4, trend: "down", positiveDown: true },
    cac: { value: 1331.61, change: -11.7, trend: "down", positiveDown: true },
    roiMarketing: { value: 3102, change: 24.8, trend: "up" }
  },
  dailyInvestmentVsRevenue: {
    dates: ["01/05", "03/05", "05/05", "07/05", "09/05", "11/05", "13/05", "15/05"],
    investment: [1500, 2200, 1800, 2500, 2100, 2900, 3100, 3250],
    revenue: [4800, 7100, 5600, 9200, 7900, 11200, 10500, 12400],
    roi: [320, 322, 311, 368, 376, 386, 338, 381]
  },
  performanceByChannel: [
    { channel: "Meta Ads", investment: 25000, leads: 420, qual: 180, meetings: 95, sales: 18, revenue: 620000, roi: 2380 },
    { channel: "Google Ads", investment: 12000, leads: 160, qual: 110, meetings: 70, sales: 16, revenue: 540000, roi: 4400 },
    { channel: "Social Selling", investment: 4000, leads: 95, qual: 70, meetings: 48, sales: 12, revenue: 360000, roi: 8900 },
    { channel: "Orgânico (Instagram)", investment: 0, leads: 72, qual: 35, meetings: 20, sales: 6, revenue: 180000, roi: null },
    { channel: "Indicação", investment: 0, leads: 28, qual: 26, meetings: 22, sales: 9, revenue: 290000, roi: null },
    { channel: "YouTube", investment: 250, leads: 15, qual: 8, meetings: 5, sales: 2, revenue: 60000, roi: 1100 }
  ],
  performanceByChannelTotals: { investment: 41250, leads: 790, qual: 429, meetings: 260, sales: 63, revenue: 2050000, roi: 3102 },
  creativesPerformance: [
    { id: "Criativo 08", impressions: 42000, ctr: 3.4, leads: 82, qual: 45, meetings: 20, sales: 6, revenue: 210000 },
    { id: "Criativo 05", impressions: 35000, ctr: 2.9, leads: 75, qual: 28, meetings: 10, sales: 2, revenue: 58000 },
    { id: "Criativo 03", impressions: 38000, ctr: 2.4, leads: 68, qual: 22, meetings: 8, sales: 1, revenue: 29000 },
    { id: "Criativo 02", impressions: 25000, ctr: 1.8, leads: 34, qual: 12, meetings: 4, sales: 0, revenue: 0 },
    { id: "Criativo 01", impressions: 18000, ctr: 1.2, leads: 16, qual: 5, meetings: 2, sales: 0, revenue: 0 }
  ],
  campaignsPerformance: [
    { name: "Empresários 01", goal: "Leads", targetPublic: "Empresários", investment: 18000, leads: 250, cplq: 72.00, meetings: 72, sales: 14, roi: 620, status: "Ativa" },
    { name: "Clínicas 01", goal: "Leads", targetPublic: "Clínicas", investment: 10000, leads: 180, cplq: 55.00, meetings: 40, sales: 6, roi: 310, status: "Ativa" },
    { name: "Dentistas 01", goal: "Leads", targetPublic: "Dentistas", investment: 8500, leads: 120, cplq: 45.00, meetings: 38, sales: 9, roi: 670, status: "Ativa" },
    { name: "Especialistas 01", goal: "Leads", targetPublic: "Especialistas", investment: 4500, leads: 65, cplq: 121.30, meetings: 15, sales: 2, roi: 120, status: "Pausada" }
  ],
  icpPerformance: [
    { publicGroup: "Empresários", leads: 250, cpl: 72.00, cplq: 152.00, meetingCost: 250.00, saleRatio: 22, ticket: 44300 },
    { publicGroup: "Clínicas", leads: 180, cpl: 55.00, cplq: 120.00, meetingCost: 280.00, saleRatio: 16, ticket: 29100 },
    { publicGroup: "Dentistas", leads: 120, cpl: 45.00, cplq: 86.00, meetingCost: 260.00, saleRatio: 12, ticket: 18600 },
    { publicGroup: "Especialistas", leads: 65, cpl: 69.00, cplq: 143.00, meetingCost: 310.00, saleRatio: 8, ticket: 15200 }
  ],
  marketingFunnel: [
    { stage: "Impressões", count: 2100000, conversion: 100.0, color: "#1e3a8a" },
    { stage: "Cliques", count: 18000, conversion: 0.86, color: "#0d9488" },
    { stage: "Leads", count: 620, conversion: 3.44, color: "#10b981" },
    { stage: "Leads Qualificados", count: 280, conversion: 45.16, color: "#84cc16" },
    { stage: "Reuniões Agendadas", count: 185, conversion: 66.07, color: "#eab308" },
    { stage: "Reuniões Comparecidas", count: 145, conversion: 78.38, color: "#f97316" },
    { stage: "Vendas", count: 31, conversion: 21.38, color: "#ef4444" }
  ],
  marketingGeneralConversionRate: 5.00,
  organicContent: [
    { title: "O maior gargalo da empresa", platform: "Instagram", views: 25400, leads: 32, meetings: 12, sales: 3, revenue: 96000 },
    { title: "Delegar não é perder controle", platform: "Instagram", views: 18900, leads: 22, meetings: 8, sales: 1, revenue: 28000 },
    { title: "História de Getro e Moisés", platform: "YouTube", views: 12700, leads: 18, meetings: 6, sales: 2, revenue: 58000 },
    { title: "3 passos para sair da operação", platform: "Instagram", views: 15300, leads: 16, meetings: 5, sales: 1, revenue: 24000 },
    { title: "Case: De 30k para 120k/mês", platform: "YouTube", views: 9800, leads: 14, meetings: 4, sales: 1, revenue: 18000 }
  ],
  socialSelling: [
    { seller: "Jackson", contacts: 120, responses: 38, conversations: 22, diagnostics: 16, meetings: 9, sales: 3 },
    { seller: "Nicolas", contacts: 95, responses: 31, conversations: 18, diagnostics: 12, meetings: 6, sales: 2 },
    { seller: "Felipe", contacts: 60, responses: 25, conversations: 15, diagnostics: 9, meetings: 5, sales: 1 }
  ],
  contentSchedule: [
    { day: "Seg 12/05", count: 3, label: "Gravado", color: "green" },
    { day: "Ter 13/05", count: 2, label: "Editando", color: "yellow" },
    { day: "Qua 14/05", count: 2, label: "Agendado", color: "teal" },
    { day: "Qui 15/05", count: 3, label: "Agendado", color: "blue" },
    { day: "Sex 16/05", count: 1, label: "Atrasado", color: "red" },
    { day: "Sáb 17/05", count: 1, label: "Sem conteúdo", color: "grey" },
    { day: "Dom 18/05", count: 0, label: "Sem conteúdo", color: "grey" }
  ],
  insights: [
    { type: "info", text: "Os anúncios para empresários possuem CPL 22% maior, porém convertem 2,8x mais em vendas e geram ticket médio 52% superior." },
    { type: "success", text: "O Criativo 08 gerou menos leads que o Criativo 03, mas faturou 4x mais. Priorize investimentos nele." },
    { type: "success", text: "Os leads oriundos do Google Ads apresentam ticket médio 38% superior e maior taxa de fechamento." },
    { type: "danger", text: "A campanha \"Especialistas 01\" está com ROI abaixo da meta. Considere ajustar o público ou criativo." },
    { type: "warning", text: "Leads gerados aos finais de semana têm 27% menos comparecimento. Revise estratégia de agendamento." }
  ],
  alerts: [
    { type: "danger", text: "ROI de Meta Ads caiu 18% nos últimos 7 dias", goal: "Meta: > 300%", current: "Atual: 246%" },
    { type: "danger", text: "CPLQ da campanha \"Clínicas 01\" acima do limite definido", goal: "Limite: R$ 100,00", current: "Atual: R$ 120,00" },
    { type: "warning", text: "3 campanhas sem vendas nos últimos 7 dias", action: "Ver campanhas" },
    { type: "danger", text: "Taxa de comparecimento das reuniões abaixo da meta", goal: "Meta: > 75%", current: "Atual: 68%" },
    { type: "warning", text: "Orçamento diário da campanha \"Empresários 01\" esgotado", goal: "R$ 18.000", current: "R$ 18.000" }
  ]
};

// ==========================================
// 4. DATASETS FOR PRÉ-VENDAS (SDR) TAB (BASELINE)
// ==========================================
const basePreVendasData = {
  period: "01/05/2025 - 16/05/2025",
  comparisonPeriod: "01/04/2025 - 16/04/2025",
  lastUpdate: "16/05/2025 09:45",
  kpis: {
    leadsNovos: { value: 1250, change: 18.3, trend: "up" },
    contatosRealizados: { value: 1020, change: 15.4, trend: "up" },
    taxaContato: { value: 81.6, change: 2.8, trend: "up", isPp: true },
    respostas: { value: 785, change: 12.7, trend: "up" },
    taxaResposta: { value: 62.8, change: 2.1, trend: "up", isPp: true },
    leadsQualificados: { value: 520, change: 14.6, trend: "up" },
    taxaQualificacao: { value: 66.2, change: 3.4, trend: "up", isPp: true },
    reunioesAgendadas: { value: 320, change: 14.7, trend: "up" },
    comparecimento: { value: 245, change: 11.4, trend: "up", showRatio: 76.6 }
  },
  funnel: [
    { stage: "Leads Novos", count: 1250, conversion: 100.0, color: "#3b82f6" },
    { stage: "Contatos Realizados", count: 1020, conversion: 81.6, color: "#06b6d4" },
    { stage: "Respostas", count: 785, conversion: 62.8, color: "#10b981" },
    { stage: "Qualificados", count: 520, conversion: 41.6, color: "#84cc16" },
    { stage: "Agendados", count: 320, conversion: 25.6, color: "#eab308" },
    { stage: "Compareceram", count: 245, conversion: 19.6, color: "#f97316" }
  ],
  generalConversionRate: 19.6,
  bookingEvolution: {
    dates: ["01/05", "03/05", "05/05", "07/05", "09/05", "11/05", "13/05", "15/05"],
    leadsNovos: [110, 135, 120, 145, 130, 150, 160, 165],
    agendamentos: [25, 34, 28, 38, 31, 40, 42, 45],
    comparecimentoRatio: [72, 74, 73, 76, 75, 77, 76, 76.6]
  },
  sdrsPerformance: [
    { name: "Nicolas", leads: 130, qual: 58, meetings: 42, attendance: 32, txAgenda: 32.3, txShow: 76.2 },
    { name: "Ana", leads: 110, qual: 47, meetings: 35, attendance: 27, txAgenda: 31.8, txShow: 77.1 },
    { name: "Lucas", leads: 95, qual: 39, meetings: 28, attendance: 21, txAgenda: 29.5, txShow: 75.0 },
    { name: "Bruna", leads: 80, qual: 31, meetings: 24, attendance: 19, txAgenda: 30.0, txShow: 79.2 }
  ],
  sdrsTotals: { leads: 415, qual: 175, meetings: 129, attendance: 99, txAgenda: 31.1, txShow: 76.7 },
  productivity: {
    firstContactTime: { value: 8, change: -32, trend: "down", positiveDown: true, meta: 15 },
    noShow: { value: 23.4, change: -3.2, trend: "down", positiveDown: true, meta: 20 },
    leadsFollowUp: { value: 186, change: 6.3, trend: "up" },
    delayedTasks: { value: 12, change: -25, trend: "down", positiveDown: true, meta: 0 }
  },
  leadsStatus: [
    { stage: "Sem contato", count: 72, percentage: 32, color: "#3b82f6" },
    { stage: "Contato realizado", count: 48, percentage: 22, color: "#06b6d4" },
    { stage: "Aguardando resposta", count: 38, percentage: 18, color: "#10b981" },
    { stage: "Qualificado", count: 28, percentage: 12, color: "#eab308" },
    { stage: "Agendado", count: 24, percentage: 10, color: "#f97316" },
    { stage: "Follow-up", count: 186, percentage: 84, color: "#8b5cf6" }
  ],
  leadOrigins: [
    { source: "Meta Ads", percentage: 48, count: 600, color: "#3b82f6" },
    { source: "Google Ads", percentage: 18, count: 225, color: "#06b6d4" },
    { source: "Social Selling", percentage: 14, count: 175, color: "#10b981" },
    { source: "Indicação", percentage: 10, count: 125, color: "#f97316" },
    { source: "Orgânico", percentage: 6, count: 75, color: "#8b5cf6" },
    { source: "Outros", percentage: 4, count: 50, color: "#64748b" }
  ],
  featuredLeads: [
    { name: "João Silva", source: "Meta Ads", stage: "Qualificado", lastContact: "Hoje 08:30", nextAction: "Ligar 10:00", actionType: "phone", responsible: "Nicolas", status: "Em dia" },
    { name: "Empresa X", source: "Indicação", stage: "Aguard. resposta", lastContact: "Ontem 16:20", nextAction: "WhatsApp 14:00", actionType: "chat", responsible: "Ana", status: "Em dia" },
    { name: "Clínica Premium", source: "Google Ads", stage: "Agendado", lastContact: "Hoje 09:10", nextAction: "Confirmar 17:00", actionType: "calendar", responsible: "Lucas", status: "Em dia" },
    { name: "Pedro Costa", source: "Social Selling", stage: "Follow-up", lastContact: "Ontem 10:45", nextAction: "Ligar amanhã", actionType: "phone", responsible: "Bruna", status: "Atenção" },
    { name: "Empresa Y", source: "Meta Ads", stage: "Sem contato", lastContact: "Hoje 07:30", nextAction: "Ligar 11:00", actionType: "phone", responsible: "Nicolas", status: "Atrasado" }
  ],
  recentActivities: [
    { time: "09:32", text: "Nicolas agendou reunião - João Silva", badge: "Agendado", status: "info" },
    { time: "09:15", text: "Ana qualificou lead - Clínica Premium", badge: "Qualificado", status: "success" },
    { time: "08:50", text: "Lucas realizou contato - Empresa X", badge: "Contato", status: "teal" },
    { time: "08:30", text: "Bruna reagendou reunião - Pedro Costa", badge: "Reagendado", status: "purple" },
    { time: "08:12", text: "Nicolas adicionou novo lead - Meta Ads", badge: "Novo Lead", status: "info" }
  ],
  alerts: [
    { type: "danger", text: "12 leads sem contato há mais de 30 min" },
    { type: "warning", text: "No-show acima da meta em Meta Ads (28%)" },
    { type: "danger", text: "Nicolas com 5 tarefas atrasadas" },
    { type: "info", text: "Leads qualificados caíram 18% no Google Ads" }
  ],
  insights: [
    { type: "success", text: "Seu tempo médio de primeiro contato está 47% melhor que a média do mercado." },
    { type: "success", text: "Leads de Google Ads têm 28% mais chance de comparecer à reunião." },
    { type: "success", text: "A taxa de qualificação da Ana está 22% acima da média da equipe." },
    { type: "success", text: "23% dos no-shows ocorrem quando a confirmação é feita com mais de 6h de antecedência." },
    { type: "success", text: "Leads de Social Selling têm o maior ticket médio: R$ 36,4K (42% acima da média)." }
  ],
  recommendation: {
    title: "Recomendação",
    text: "Implemente confirmação automática por WhatsApp 2h antes da reunião"
  },
  monthlyGoals: [
    { label: "Leads Qualificados", current: 520, target: 600, percentage: 87 },
    { label: "Reuniões Agendadas", current: 320, target: 400, percentage: 80 },
    { label: "Taxa de Show", current: 76.6, target: 80.0, percentage: 96, isPercent: true }
  ]
};

// ==========================================
// 5. DATASETS FOR CLOSER COCKPIT (BASELINE)
// ==========================================
const baseCloserData = {
  period: "16/05/2025",
  comparisonPeriod: "15/05/2025",
  lastUpdate: "16/05/2025 09:45",
  kpis: {
    reunioesHoje: { value: 8, target: 10, percentage: 80 },
    comparecimento: { value: 87, change: 6, trend: "up", isPp: true },
    propostasAbertas: { value: 23, change: 5, trend: "up" },
    vendasMes: { value: 12, target: 20, percentage: 60 },
    conversao: { value: 41, change: 5, trend: "up", isPp: true },
    ticketMedio: { value: 44000, change: 12, trend: "up" },
    entradaMedia: { value: 18500, change: 15, trend: "up" },
    receitaFechada: { value: 528000, target: 800000, percentage: 66 }
  },
  agenda: [
    { time: "09:00", company: "Empresa Alpha", status: "Confirmada", stars: 5, value: 80000, type: "video" },
    { time: "10:30", company: "Empresa Beta", status: "Aguardando confirmação", stars: 5, value: 45000, type: "warning" },
    { time: "14:00", company: "Empresa Gama", status: "Confirmada", stars: 5, value: 60000, type: "video" },
    { time: "15:30", company: "Empresa Delta", status: "Confirmada", stars: 5, value: 35000, type: "video" },
    { time: "17:00", company: "Empresa Ômega", status: "No Show", stars: 5, value: 25000, type: "danger" }
  ],
  propostas: [
    { company: "Empresa Alpha", value: 80000, entry: 30000, lastContact: "15/05 16:32", nextAction: "Ligar hoje", prob: 91, status: "good" },
    { company: "Empresa Beta", value: 45000, entry: 15000, lastContact: "14/05 11:20", nextAction: "WhatsApp", prob: 87, status: "good" },
    { company: "Empresa Gama", value: 60000, entry: 20000, lastContact: "13/05 17:45", nextAction: "Ligar hoje", prob: 73, status: "good" },
    { company: "Empresa Delta", value: 35000, entry: 10000, lastContact: "12/05 10:15", nextAction: "Enviar case", prob: 65, status: "good" },
    { company: "Empresa Ômega", value: 25000, entry: 8000, lastContact: "10/05 09:50", nextAction: "Aguardar", prob: 40, status: "warning" }
  ],
  followUps: [
    { type: "phone", label: "LIGUE AGORA", company: "Empresa Alpha", detail: "Proposta enviada há 5 dias. Sem retorno.", prob: 91 },
    { type: "chat", label: "WHATSAPP", company: "Empresa Beta", detail: "Pediu para falar sexta. Hoje é sexta.", prob: 87 },
    { type: "phone", label: "URGENTE", company: "Empresa Gama", detail: "Condição comercial vence hoje às 23:59.", prob: 73 }
  ],
  funnel: [
    { stage: "Reuniões realizadas", count: 40, conversion: 100.0, color: "#3b82f6" },
    { stage: "Diagnósticos feitos", count: 30, conversion: 75.0, color: "#0d9488" },
    { stage: "Propostas enviadas", count: 18, conversion: 60.0, color: "#10b981" },
    { stage: "Negociações", count: 10, conversion: 33.3, color: "#f59e0b" },
    { stage: "Vendas", count: 7, conversion: 23.3, color: "#ef4444" }
  ],
  generalConversionRate: 17.5,
  objections: [
    { reason: "Sem orçamento", percentage: 32, count: 41, color: "#3b82f6" },
    { reason: "Vai pensar", percentage: 18, count: 23, color: "#06b6d4" },
    { reason: "Sócio / Decisor", percentage: 15, count: 19, color: "#10b981" },
    { reason: "Esposa / Família", percentage: 10, count: 13, color: "#ec4899" },
    { reason: "Tempo", percentage: 9, count: 12, color: "#f59e0b" },
    { reason: "Concorrente", percentage: 8, count: 10, color: "#06b6d4" },
    { reason: "Outro", percentage: 8, count: 10, color: "#8b5cf6" }
  ],
  receitaPessoal: {
    percentage: 65,
    target: 800000,
    current: 528000,
    remaining: 272000,
    commission: 52800
  },
  ranking: [
    { rank: 1, name: "Felipe Damasceno", sales: 12, revenue: 528000, isSelf: true },
    { rank: 2, name: "Jackson Silva", sales: 8, revenue: 312000 },
    { rank: 3, name: "Pedro Lima", sales: 6, revenue: 210000 },
    { rank: 4, name: "Maria Eduarda", sales: 4, revenue: 148000 },
    { rank: 5, name: "Lucas Costa", sales: 3, revenue: 98000 }
  ],
  callsGravadas: [
    { company: "Empresa Alpha", date: "15/05 09:00", duration: "52 min", status: "Analisada" },
    { company: "Empresa Beta", date: "14/05 10:30", duration: "45 min", status: "Analisada" },
    { company: "Empresa Gama", date: "14/05 14:00", duration: "32 min", status: "Pendente" },
    { company: "Empresa Delta", date: "13/05 15:30", duration: "41 min", status: "Analisada" }
  ],
  analiseIA: {
    score: 91,
    metrics: [
      { name: "Tempo falando (Você)", value: "38%", status: "Excelente", type: "success" },
      { name: "Perguntas feitas", value: "14", meta: "Meta: 18+", status: "Excelente", type: "success" },
      { name: "Rapport", value: "92%", status: "Excelente", type: "success" },
      { name: "Dor descoberta", value: "Sim", status: "Excelente", type: "success" },
      { name: "Urgência criada", value: "Não", status: "Melhorar", type: "warning" },
      { name: "Tomador de decisão", value: "Sim", status: "Excelente", type: "success" },
      { name: "Próximo passo", value: "Definido", status: "Excelente", type: "success" }
    ],
    closingProbability: 87,
    objectionsDetected: ["Sem orçamento", "Falta de tempo", "Delegação"],
    suggestions: ["Tempo livre e qualidade de vida", "Delegação e escala", "ROI do investimento"]
  },
  checklist: [
    { label: "Tomador de decisão presente", checked: true },
    { label: "Pesquisa da empresa feita", checked: true },
    { label: "Instagram analisado", checked: true },
    { label: "Linkedin analisado", checked: true },
    { label: "Pain points mapeados", checked: true },
    { label: "Script de diagnóstico", checked: true },
    { label: "Apresentação aberta", checked: true },
    { label: "Proposta personalizada", checked: true },
    { label: "Gravação iniciada", checked: true },
    { label: "CRM atualizado", checked: true }
  ],
  proximasOportunidades: [
    { company: "Empresa Alpha", value: 80000, prob: 92, action: "Contato hoje", status: "good" },
    { company: "Empresa Beta", value: 45000, prob: 87, action: "Contato hoje", status: "good" },
    { company: "Empresa Gama", value: 60000, prob: 80, action: "Amanhã", status: "warning" },
    { company: "Empresa Delta", value: 35000, prob: 65, action: "Amanhã", status: "warning" },
    { company: "Empresa Ômega", value: 25000, prob: 40, action: "Em 2 dias", status: "neutral" }
  ]
};

// ==========================================
// 6. DATASETS FOR FINANCEIRO TAB (BASELINE)
// ==========================================
const baseFinanceiroData = {
  period: "01/05/2025 - 16/05/2025",
  comparisonPeriod: "01/04/2025 - 16/04/2025",
  lastUpdate: "16/05/2025 09:45",
  kpis: {
    caixaAtual: { value: 482000, change: 8.2, trend: "up" },
    receitaRecebida: { value: 1280000, change: 13.7, trend: "up" },
    receitaContratada: { value: 2040000, change: 22.4, trend: "up" },
    contasReceber: { value: 1760000, change: 12.6, trend: "up" },
    contasPagar: { value: 620000, change: -5.3, trend: "down", positiveDown: true },
    fluxoProjetado: { value: 1100000, change: 16.8, trend: "up" },
    margemOperacional: { value: 34.8, change: 4.1, trend: "up", isPp: true },
    lucroLiquido: { value: 385000, change: 21.2, trend: "up" }
  },
  fluxoDeCaixa: {
    dates: ["01/05", "04/05", "07/05", "10/05", "13/05", "16/05", "19/05", "22/05", "25/05", "28/05", "31/05", "03/06", "06/06", "09/06", "12/06"],
    entradas: [95200, 110000, 85000, 120000, 95000, 95200, 105000, 115000, 88000, 92000, 130000, 110000, 95000, 100000, 125000],
    saidas: [-72400, -65000, -82000, -70000, -68000, -72400, -75000, -80000, -78000, -65000, -90000, -85000, -70000, -72000, -80000],
    saldo: [410000, 425000, 412000, 435000, 442000, 482000, 492000, 508000, 502000, 515000, 532000, 545000, 558000, 571000, 592000]
  },
  projecoes: {
    today: 482000,
    d30: 610000,
    d60: 790000,
    d90: 1100000
  },
  recebimentos: [
    { date: "16/05", desc: "Empresa Alpha", value: 18000, origin: "Mentoria", status: "Hoje", type: "info" },
    { date: "17/05", desc: "Empresa Beta", value: 42000, origin: "VND Expert", status: "Amanhã", type: "success" },
    { date: "19/05", desc: "Empresa Gama", value: 95000, origin: "PGC", status: "Sexta", type: "success" },
    { date: "21/05", desc: "Empresa Delta", value: 75000, origin: "Mentoria", status: "Próx. semana", type: "warning" },
    { date: "23/05", desc: "Empresa Ômega", value: 120000, origin: "VND Expert", status: "Próx. semana", type: "warning" }
  ],
  recebimentosTotalPrevisto: 350000,
  contasPagarProximas: [
    { due: "16/05", desc: "Meta Ads", value: 18000, status: "Hoje", type: "danger" },
    { due: "16/05", desc: "Servidores AWS", value: 4200, status: "Hoje", type: "danger" },
    { due: "17/05", desc: "Folha de Pagamento", value: 52000, status: "Amanhã", type: "warning" },
    { due: "18/05", desc: "Comissões", value: 28000, status: "Amanhã", type: "warning" },
    { due: "20/05", desc: "Fornecedores", value: 12500, status: "3 dias", type: "success" }
  ],
  contasPagarTotal: 114700,
  receitaProduto: [
    { name: "VND Expert", contracted: 620000, received: 280000, toReceive: 340000, percentage: 45 },
    { name: "PGC (Recorrente)", contracted: 240000, received: 210000, toReceive: 30000, percentage: 88 },
    { name: "Mentoria", contracted: 380000, received: 190000, toReceive: 190000, percentage: 50 },
    { name: "Desenvolvimento", contracted: 300000, received: 120000, toReceive: 180000, percentage: 40 },
    { name: "Outros", contracted: 500000, received: 280000, toReceive: 220000, percentage: 56 }
  ],
  receitaProdutoTotal: { contracted: 2040000, received: 1080000, toReceive: 960000, percentage: 53 },
  dre: {
    receitaBruta: { value: 1680000, percentage: 100 },
    impostos: { value: -168000, percentage: -10.0 },
    receitaLiquida: { value: 1512000, percentage: 90.0 },
    custosVariaveis: { value: -420000, percentage: -25.0 },
    margemContribuicao: { value: 1092000, percentage: 65.0 },
    custosFixos: { value: -560000, percentage: -33.3 },
    ebitda: { value: 532000, percentage: 31.7 },
    despesasFinanceiras: { value: -32000, percentage: -1.9 },
    lucroLiquido: { value: 385000, percentage: 22.9 }
  },
  mrr: {
    value: 240000,
    change: 12.5,
    sparkline: [195000, 205000, 210000, 222000, 228000, 235000, 240000],
    details: {
      novasAssinaturas: 48000,
      cancelamentos: -8000,
      upgrades: 18000,
      downgrades: -4000,
      churn: 3.2
    }
  },
  despesas: [
    { name: "Equipe", percentage: 35, value: 392000, color: "#3b82f6" },
    { name: "Marketing", percentage: 25, value: 280000, color: "#06b6d4" },
    { name: "Tecnologia", percentage: 18, value: 202000, color: "#f59e0b" },
    { name: "Comissões", percentage: 13, value: 146000, color: "#ec4899" },
    { name: "Infraestrutura", percentage: 9, value: 100000, color: "#ef4444" }
  ],
  despesasTotal: 1120000,
  inadimplencia: [
    { range: "Em dia", count: 142, value: 1320000, percentage: 75 },
    { range: "A vencer (até 7 dias)", count: 19, value: 190000, percentage: 11 },
    { range: "7 a 15 dias", count: 9, value: 94000, percentage: 5 },
    { range: "15 a 30 dias", count: 6, value: 62000, percentage: 4 },
    { range: "30 a 60 dias", count: 4, value: 48000, percentage: 3 },
    { range: "60+ dias", count: 3, value: 46000, percentage: 2 }
  ],
  inadimplenciaTotal: { count: 183, value: 1760000, percentage: 100 },
  rentabilidade: [
    { product: "PGC (Recorrente)", revenue: 240000, cost: -74000, margin: 69 },
    { product: "VND Expert", revenue: 620000, cost: -260000, margin: 58 },
    { product: "Mentoria", revenue: 380000, cost: -136000, margin: 64 },
    { product: "Desenvolvimento", revenue: 300000, cost: -177000, margin: 41 },
    { product: "Outros", productCost: 140000, cost: -80000, margin: 43 } // Wait, let's name it 'revenue' instead of productCost
  ],
  rentabilidadeTotal: { revenue: 1680000, cost: -727000, margin: 57 },
  roiArea: [
    { area: "Marketing", investment: 92000, returnVal: 720000, roi: 783 },
    { area: "Comercial", investment: 120000, returnVal: 680000, roi: 567 },
    { area: "Produto", investment: 180000, returnVal: 840000, roi: 467 }
  ],
  roiAreaTotal: { investment: 392000, returnVal: 2240000, roi: 571 },
  cenariosCaixa: {
    dates: ["Hoje", "30 dias", "60 dias", "90 dias"],
    realista: [482000, 610000, 790000, 1100000],
    otimista: [482000, 750000, 980000, 1420000],
    pessimista: [482000, 420000, 550000, 680000]
  },
  metasFinanceiras: [
    { label: "Receita Recebida", target: 1500000, current: 1280000, projection: 1620000, percentage: 85 },
    { label: "Lucro Líquido", target: 400000, current: 385000, projection: 430000, percentage: 96 },
    { label: "Caixa", target: 600000, current: 482000, projection: 610000, percentage: 80 },
    { label: "Margem Operacional", target: 30, current: 34.8, projection: 33, percentage: 116, isPercent: true }
  ],
  alerts: [
    { type: "danger", text: "Caixa projetado abaixo de R$ 500 mil em 45 dias (cenário pessimista)." },
    { type: "warning", text: "Inadimplência acima de 8% do total a receber." },
    { type: "danger", text: "Despesas com Marketing cresceram 18% nos últimos 30 dias." },
    { type: "warning", text: "Margem do produto \"Desenvolvimento\" abaixo de 45%." },
    { type: "danger", text: "3 clientes com mais de 30 dias de atraso somam R$ 46.000." }
  ],
  insights: [
    { type: "success", text: "Seu caixa suporta aproximadamente 4,8 meses da operação atual." },
    { type: "success", text: "O custo com Marketing cresceu 12%, porém a receita aumentou apenas 4%." },
    { type: "success", text: "A receita recorrente representa 18,7% da receita total. Continue investindo em recorrência." },
    { type: "success", text: "Se 80% das propostas em negociação forem convertidas, o caixa em 60 dias será de R$ 1,24M." },
    { type: "success", text: "A margem operacional está 4,1 p.p. acima do período anterior. Excelente evolução!" }
  ]
};
// ==========================================
// 7. DATASETS FOR OPERAÇÃO TAB (BASELINE)
// ==========================================
const baseOperacaoData = {
  period: "01/05/2025 - 16/05/2025",
  comparisonPeriod: "01/04/2025 - 16/04/2025",
  lastUpdate: "16/05/2025 09:45",
  kpis: {
    clientesAtivos: { value: 128, change: 12, trend: "up" },
    emImplantacao: { value: 22, change: 10, trend: "up" },
    operacoesSaudaveis: { value: 91, change: 7, trend: "up", isPp: true },
    operacoesEmRisco: { value: 11, change: -2, trend: "down", positiveDown: true },
    tempoMedioImplantacao: { value: 34, change: -6, trend: "down", positiveDown: true },
    slaCumprido: { value: 93, change: 5, trend: "up", isPp: true },
    npsGeral: { value: 82, change: 6, trend: "up" },
    gargalosAtivos: { value: 8, change: -1, trend: "down", positiveDown: true }
  },
  jornadaCliente: [
    { stage: "Venda", clients: 18, avgTime: "—", maxTime: "—", delayed: 0, color: "text-[#3b82f6]" },
    { stage: "Kickoff", clients: 22, avgTime: "1 dia", maxTime: "3 dias", delayed: 0, color: "text-[#06b6d4]" },
    { stage: "Diagnóstico", clients: 16, avgTime: "2 dias", maxTime: "5 dias", delayed: 1, color: "text-[#f59e0b]" },
    { stage: "Planejamento", clients: 20, avgTime: "5 dias", maxTime: "9 dias", delayed: 2, color: "text-[#f97316]" },
    { stage: "Implementação", clients: 28, avgTime: "19 dias", maxTime: "7 dias", delayed: 1, color: "text-[#3b82f6]" },
    { stage: "Treinamento", clients: 14, avgTime: "5 dias", maxTime: "40 dias", delayed: 6, color: "text-[#8b5cf6]" },
    { stage: "Go Live", clients: 8, avgTime: "3 dias", maxTime: "10 dias", delayed: 0, color: "text-[#ec4899]" },
    { stage: "Acompanhamento", clients: 14, avgTime: "15 dias", maxTime: "30 dias", delayed: 0, color: "text-[#10b981]" },
    { stage: "Sucesso", clients: 6, avgTime: "30 dias", maxTime: "45 dias", delayed: 0, color: "text-[#10b981]" }
  ],
  saudeCarteira: [
    { client: "Empresa Alpha", health: 94, stage: "Implementação", owner: "Carlos Silva", nextDelivery: "Hoje", status: "info" },
    { client: "Empresa Beta", health: 71, stage: "Treinamento", owner: "João Mendes", nextDelivery: "Amanhã", status: "success" },
    { client: "Empresa Gama", health: 42, stage: "Implementação", owner: "Carlos Silva", nextDelivery: "Atrasado", status: "danger" },
    { client: "Clinica Delta", health: 88, stage: "Go Live", owner: "Ana Beatriz", nextDelivery: "Hoje", status: "info" },
    { client: "Empresa Ômega", health: 65, stage: "Planejamento", owner: "João Mendes", nextDelivery: "2 dias", status: "success" },
    { client: "Empresa Zeta", health: 38, stage: "Diagnóstico", owner: "Ana Beatriz", nextDelivery: "Atrasado", status: "danger" },
    { client: "Empresa Sigma", health: 90, stage: "Acompanhamento", owner: "Carlos Silva", nextDelivery: "3 dias", status: "success" }
  ],
  capacidadeEquipe: [
    { name: "Carlos Silva", clients: 38, capacity: 50, percent: 76, color: "green" },
    { name: "João Mendes", clients: 44, capacity: 50, percent: 88, color: "orange" },
    { name: "Ana Beatriz", clients: 21, capacity: 40, percent: 52, color: "green" },
    { name: "Mariana Costa", clients: 15, capacity: 30, percent: 50, color: "green" },
    { name: "Pedro Henrique", clients: 12, capacity: 30, percent: 40, color: "green" }
  ],
  entregasSemana: [
    { day: "Hoje", count: 15 },
    { day: "Ter 17/05", count: 9 },
    { day: "Qua 18/05", count: 18 },
    { day: "Qui 19/05", count: 7 },
    { day: "Sex 20/05", count: 12 }
  ],
  gargalos: [
    { title: "Configuração de CRM", count: 4, label: "clientes atrasados", type: "danger" },
    { title: "Área de Membros", count: 2, label: "aguardando", type: "warning" },
    { title: "Funis e Automações", count: 6, label: "aguardando", type: "warning" },
    { title: "Produção de Criativos", count: 5, label: "pendentes", type: "success" },
    { title: "Integrações", count: 3, label: "pendentes", type: "orange" }
  ],
  slaProcesso: [
    { process: "Kickoff", limit: "48h", current: "32h", status: "success" },
    { process: "Diagnóstico", limit: "7 dias", current: "5 dias", status: "success" },
    { process: "Planejamento", limit: "7 dias", current: "6 dias", status: "success" },
    { process: "Implementação", limit: "30 dias", current: "38 dias", status: "danger" },
    { process: "Treinamento", limit: "7 dias", current: "5 dias", status: "success" },
    { process: "Go Live", limit: "7 dias", current: "4 dias", status: "success" }
  ],
  kanban: {
    todo: {
      count: 8,
      items: [
        { title: "Configurar automação Empresa Alpha", tag: "CRM", tagColor: "#10b981" },
        { title: "Criar página de vendas Empresa Beta", tag: "Funis", tagColor: "#3b82f6" },
        { title: "Integração WhatsApp Clinica Delta", tag: "Integrações", tagColor: "#8b5cf6" },
        { title: "Criar sequência de e-mails Empresa Sigma", tag: "Automações", tagColor: "#f59e0b" }
      ]
    },
    doing: {
      count: 15,
      items: [
        { title: "Implantação CRM Empresa Gama", tag: "CRM", tagColor: "#10b981" },
        { title: "Área de membros Empresa Ômega", tag: "Membros", tagColor: "#ec4899" },
        { title: "Treinamento equipe Empresa Zeta", tag: "Treinamento", tagColor: "#f97316" },
        { title: "Configuração de funil Empresa Lambda", tag: "Funis", tagColor: "#3b82f6" }
      ]
    },
    review: {
      count: 6,
      items: [
        { title: "Website institucional Empresa Beta", tag: "Website", tagColor: "#ec4899" },
        { title: "Relatórios personalizados Empresa Alpha", tag: "Relatórios", tagColor: "#06b6d4" },
        { title: "Automação de cobrança Clinica Delta", tag: "Automações", tagColor: "#f59e0b" }
      ]
    },
    done: {
      count: 12,
      items: [
        { title: "Kickoff realizado Empresa Sigma", checked: true },
        { title: "Diagnóstico concluído Empresa Ômega", checked: true },
        { title: "CRM configurado Empresa Zeta", checked: true },
        { title: "Funil publicado Empresa Lambda", checked: true }
      ]
    }
  },
  projetosEmAndamento: [
    { project: "Empresa Alpha", progress: 82, deadline: "25/05/2025", health: "good" },
    { project: "Empresa Beta", progress: 46, deadline: "22/05/2025", health: "warning" },
    { project: "Empresa Gama", progress: 12, deadline: "15/05/2025", health: "danger" },
    { project: "Clinica Delta", progress: 67, deadline: "30/05/2025", health: "good" },
    { project: "Empresa Ômega", progress: 91, deadline: "28/05/2025", health: "good" }
  ],
  proximasEntregas: [
    { period: "Hoje", time: "09:00", task: "Kickoff - Empresa Alpha", owner: "Carlos Silva" },
    { period: "Hoje", time: "14:00", task: "Entrega CRM - Empresa Beta", owner: "João Mendes" },
    { period: "Amanhã", time: "10:00", task: "Área de Membros - Empresa Gama", owner: "Ana Beatriz" },
    { period: "Amanhã", time: "15:00", task: "Treinamento - Clinica Delta", owner: "João Mendes" },
    { period: "Qua 18/05", time: "09:00", task: "Funil de Vendas - Empresa Ômega", owner: "Carlos Silva" }
  ],
  npsOperacao: {
    score: 82,
    team: [
      { name: "Carlos Silva", value: 84 },
      { name: "João Mendes", value: 81 },
      { name: "Ana Beatriz", value: 79 },
      { name: "Mariana Costa", value: 78 },
      { name: "Pedro Henrique", value: 76 }
    ]
  },
  alerts: [
    { type: "warning", text: "3 clientes com SLA vencido", time: "2h" },
    { type: "warning", text: "5 clientes sem contato há mais de 7 dias", time: "4h" },
    { type: "danger", text: "Capacidade da equipe acima de 90%", time: "1h" },
    { type: "warning", text: "4 entregas críticas previstas para hoje", time: "30m" },
    { type: "danger", text: "NPS caiu 6 pontos nos últimos 15 dias", time: "3h" }
  ]
};


// ==========================================

// ==========================================
// 8. DATASETS FOR CLIENTES TAB (BASELINE)
// ==========================================
const baseClientesData = {
  period: "01/05/2025 - 16/05/2025",
  comparisonPeriod: "01/04/2025 - 16/04/2025",
  lastUpdate: "16/05/2025 09:45",
  kpis: {
    clientesAtivos: { value: 128, change: 12, trend: "up" },
    novosClientes: { value: 15, change: 7, trend: "up" },
    clientesSaudaveis: { value: 92, change: 5, trend: "up", isPp: true },
    clientesEmRisco: { value: 8, change: -2, trend: "down", positiveDown: true },
    npsMedio: { value: 84, change: 6, trend: "up" },
    mrr: { value: 240000, change: 18, trend: "up" },
    churn: { value: 1.8, change: -0.6, trend: "down", positiveDown: true },
    ltv: { value: 18600, change: 9, trend: "up" }
  },
  jornadaCliente: [
    { stage: "Venda", clients: 322, conversion: 100, color: "bg-[#3b82f6]" },
    { stage: "Kickoff", clients: 280, conversion: 87, label: "Tempo médio 1 dia", color: "bg-[#3b82f6]" },
    { stage: "Diagnóstico", clients: 270, conversion: 96, label: "2 dias", color: "bg-[#10b981]" },
    { stage: "Implementação", clients: 218, conversion: 81, label: "19 dias", delayed: 4, color: "bg-[#f59e0b]" },
    { stage: "Treinamento", clients: 195, conversion: 73, label: "5 dias", delayed: 2, color: "bg-[#f59e0b]" },
    { stage: "Go Live", clients: 150, conversion: 56, label: "3 dias", color: "bg-[#f59e0b]" },
    { stage: "Sucesso", clients: 210, conversion: 78, label: "15 dias", color: "bg-[#10b981]" },
    { stage: "Renovação", clients: 0, conversion: 0, label: "30 dias", color: "bg-gray-700" },
    { stage: "Advocacia", clients: 0, conversion: 0, color: "bg-gray-700" }
  ],
  saudeCarteira: [
    { id: "empresa-alpha", client: "Empresa Alpha", health: 96, stage: "Implementação", lastContact: "Ontem", nextAction: "Treinamento", owner: "Carlos Silva", avatar: "C", status: "Saudável" },
    { id: "empresa-omega", client: "Empresa Ômega", health: 91, stage: "Go Live", lastContact: "Anteontem", nextAction: "Acompanhamento", owner: "Ana Beatriz", avatar: "A", status: "Saudável" },
    { id: "empresa-delta", client: "Empresa Delta", health: 88, stage: "Treinamento", lastContact: "Ontem", nextAction: "Entrega de funil", owner: "João Mendes", avatar: "J", status: "Saudável" },
    { id: "clinica-prime", client: "Clinica Prime", health: 74, stage: "Implementação", lastContact: "5 dias atrás", nextAction: "Follow-up", owner: "Mariana Costa", avatar: "M", status: "Atenção" },
    { id: "empresa-beta", client: "Empresa Beta", health: 63, stage: "Implementação", lastContact: "5 dias atrás", nextAction: "Follow-up", owner: "Carlos Silva", avatar: "C", status: "Atenção" },
    { id: "empresa-sigma", client: "Empresa Sigma", health: 42, stage: "Treinamento", lastContact: "12 dias atrás", nextAction: "Contato urgente", owner: "João Mendes", avatar: "J", status: "Risco", urgent: true },
    { id: "empresa-gama", client: "Empresa Gama", health: 38, stage: "Implementação", lastContact: "12 dias atrás", nextAction: "Reunião urgente", owner: "Ana Beatriz", avatar: "A", status: "Risco", urgent: true },
    { id: "instituto-veritas", client: "Instituto Veritas", health: 22, stage: "Implantação pausada", lastContact: "18 dias atrás", nextAction: "Reativar cliente", owner: "Mariana Costa", avatar: "M", status: "Risco", urgent: true, paused: true }
  ],
  clientesEmRisco: [
    { id: "empresa-beta", client: "Empresa Beta", reason: "18 dias sem acessar plataforma", health: 63 },
    { id: "empresa-gama", client: "Empresa Gama", reason: "12 dias sem contato", health: 38 },
    { id: "empresa-sigma", client: "Empresa Sigma", reason: "11 dias entregas atrasadas", health: 42 },
    { id: "instituto-veritas", client: "Instituto Veritas", reason: "18 dias pagamento em atraso", health: 22 }
  ],
  renovacoes: [
    { id: "empresa-alpha", client: "Empresa Alpha", date: "20/06/2025", value: 12000, status: "Alta probabilidade", prob: 92 },
    { id: "clinica-prime", client: "Clinica Prime", date: "05/07/2025", value: 6000, status: "Alta probabilidade", prob: 87 },
    { id: "empresa-delta", client: "Empresa Delta", date: "18/07/2025", value: 14000, status: "Média probabilidade", prob: 68 }
  ],
  details: {
    "empresa-beta": {
      client: "Empresa Beta",
      segment: "Educação",
      size: "Médio",
      city: "São Paulo - SP",
      since: "18/02/2025 (3 meses)",
      owner: "Carlos Silva",
      role: "Gestor de Sucesso",
      health: 63,
      status: "Atenção",
      healthBreakdown: {
        platform: 60,
        deliveries: 70,
        meetings: 50,
        payment: 40,
        engagement: 60,
        nps: 75
      },
      aiSummary: "O cliente está com baixo engajamento na plataforma há 18 dias, possui 2 entregas atrasadas e não participou dos últimos treinamentos. Existe risco moderado de cancelamento. Recomenda-se contato imediato para alinhamento e reativação.",
      nextActions: [
        { title: "Contato por WhatsApp", date: "Hoje", type: "whatsapp" },
        { title: "Reunião de alinhamento", date: "20/05 às 14:00", type: "meeting" },
        { title: "Entrega: Funil de Vendas", date: "22/05", type: "delivery" },
        { title: "Treinamento: Automações", date: "27/05", type: "training" }
      ],
      timeline: [
        { date: "18/02/2025", title: "Venda realizada", desc: "Contrato assinado", status: "success" },
        { date: "20/02/2025", title: "Kickoff realizado", desc: "Reunião com responsável", status: "success" },
        { date: "24/02/2025", title: "Diagnóstico concluído", desc: "Documentação entregue", status: "success" },
        { date: "05/03/2025", title: "Implementação iniciada", desc: "Configuração do CRM", status: "info" },
        { date: "02/05/2025", title: "Treinamento agendado", desc: "Aguardando confirmação", status: "warning", calendar: true }
      ],
      evolution: {
        dates: ["17/02", "03/03", "17/03", "31/03", "14/04", "28/04", "12/05"],
        engagement: [45, 48, 47, 43, 40, 35, 30],
        deliveries: [72, 75, 71, 78, 74, 81, 76],
        nps: [15, 18, 16, 21, 19, 14, 10]
      },
      indicators: {
        logins: { value: 12, change: -40 },
        deliveries: { value: 60, change: -15, isPp: true },
        training: { value: "2/6", change: -2, isAbs: true },
        nps: { value: 75, change: -10 }
      },
      financial: {
        total: 42000,
        received: 21000,
        remaining: 21000,
        nextDue: "20/05/2025",
        status: "Em dia"
      },
      products: ["PGC Plataforma", "CRM & Automações", "Funis de Vendas", "Área de Membros", "IA Comercial"]
    },
    "empresa-alpha": {
      client: "Empresa Alpha",
      segment: "Tecnologia",
      size: "Grande",
      city: "Belo Horizonte - MG",
      since: "10/01/2025 (4 meses)",
      owner: "Carlos Silva",
      role: "Gestor de Sucesso",
      health: 96,
      status: "Saudável",
      healthBreakdown: {
        platform: 95,
        deliveries: 98,
        meetings: 90,
        payment: 100,
        engagement: 94,
        nps: 92
      },
      aiSummary: "Cliente altamente ativo com todas as metas de produção atingidas. O engajamento com a IA Comercial gerou insights que aumentaram a performance operacional em 25%. Excelente fit com o produto.",
      nextActions: [
        { title: "Revisão trimestral de resultados", date: "24/05 às 10:00", type: "meeting" },
        { title: "Treinamento avançado de APIs", date: "30/05", type: "training" }
      ],
      timeline: [
        { date: "10/01/2025", title: "Venda realizada", desc: "Contrato assinado", status: "success" },
        { date: "12/01/2025", title: "Kickoff concluído", desc: "Escopo definido", status: "success" },
        { date: "15/01/2025", title: "Implementação iniciada", desc: "Integrações ativadas", status: "success" },
        { date: "12/02/2025", title: "Go Live", desc: "Lançamento em produção", status: "success" },
        { date: "10/04/2025", title: "Sucesso atingido", desc: "Meta de ROI batida", status: "success" }
      ],
      evolution: {
        dates: ["17/02", "03/03", "17/03", "31/03", "14/04", "28/04", "12/05"],
        engagement: [85, 88, 90, 92, 91, 94, 96],
        deliveries: [90, 92, 95, 96, 95, 98, 98],
        nps: [80, 82, 85, 88, 90, 92, 92]
      },
      indicators: {
        logins: { value: 142, change: 25 },
        deliveries: { value: 98, change: 8, isPp: true },
        training: { value: "6/6", change: 0, isAbs: true },
        nps: { value: 92, change: 12 }
      },
      financial: {
        total: 120000,
        received: 60000,
        remaining: 60000,
        nextDue: "20/06/2025",
        status: "Em dia"
      },
      products: ["PGC Plataforma", "CRM & Automações", "Funis de Vendas", "IA Comercial", "Suporte VIP"]
    }
  }
};

// ==========================================
// 9. DATASETS FOR CONFIGURAÇÕES TAB (BASELINE)
// ==========================================
const baseConfiguracoesData = {
  period: "01/05/2025 - 16/05/2025",
  comparisonPeriod: "01/04/2025 - 16/04/2025",
  lastUpdate: "16/05/2025 09:45",
  kpis: {
    integracoesConectadas: { value: 18, total: 32, percentage: 56 },
    sincronizacoesHoje: { value: 152, lastTime: "2 min" },
    dadosSincronizados: { value: "1,2M", change: 18 },
    integracoesErro: { value: 2 },
    proximaSincronizacao: { value: "Em 3 min", targets: "WhatsApp e Google Ads" }
  },
  integracoes: [
    { id: "whatsapp", name: "WhatsApp Business", connected: true, description: "Mensagens, contatos e atendimentos", lastSync: "Há 2 minutos", syncCount: 256842, provider: "360Dialog", connectedAt: "12/05/2025 14:32", status: "Ativo", checklist: ["Conversas e mensagens", "Contatos", "Atendimentos", "Etiquetas", "Mídias e anexos"], stats: { todayMsg: 1842, todayChats: 256, totalSync: 12847, lastError: "Nenhum" } },
    { id: "google-ads", name: "Google Ads", connected: true, description: "Campanhas, grupos de anúncios e métricas", lastSync: "Há 5 minutos", syncCount: 45673, provider: "Google Ads API", connectedAt: "10/05/2025 11:15", status: "Ativo", checklist: ["Campanhas e anúncios", "Métricas de cliques", "Conversões", "Custos de mídia"], stats: { todayMsg: 412, todayChats: 0, totalSync: 45673, lastError: "Nenhum" } },
    { id: "asaas", name: "Asaas", connected: true, description: "Pagamentos, boletos, assinaturas e cobranças", lastSync: "Há 1 minuto", syncCount: 12847, provider: "Asaas API", connectedAt: "08/05/2025 09:20", status: "Ativo", checklist: ["Boletos gerados", "Transações de cartão", "Assinaturas recorrentes", "Cobranças atrasadas"], stats: { todayMsg: 95, todayChats: 88, totalSync: 12847, lastError: "Nenhum" } },
    { id: "google-calendar", name: "Google Calendar", connected: true, description: "Eventos, reuniões e compromissos", lastSync: "Há 8 minutos", syncCount: 8931, provider: "Google OAuth", connectedAt: "05/05/2025 10:00", status: "Ativo", checklist: ["Eventos da agenda", "Salas de reunião", "Participantes e convites"], stats: { todayMsg: 12, todayChats: 12, totalSync: 8931, lastError: "Nenhum" } },
    { id: "meta-ads", name: "Meta Ads", connected: true, description: "Campanhas, conjuntos, anúncios e métricas", lastSync: "Há 2 minutos", syncCount: 78901, provider: "Facebook Graph API", connectedAt: "04/05/2025 14:00", status: "Ativo", checklist: ["Campanhas e criativos", "Métricas CTR e CPC", "Leads instantâneos"], stats: { todayMsg: 980, todayChats: 0, totalSync: 78901, lastError: "Nenhum" } },
    { id: "gmail", name: "Gmail", connected: true, description: "E-mails, contatos e etiquetas", lastSync: "Há 4 minutos", syncCount: 154233, provider: "Google OAuth", connectedAt: "01/05/2025 08:30", status: "Ativo", checklist: ["E-mails recebidos", "Etiquetas de status", "Contatos atualizados"], stats: { todayMsg: 120, todayChats: 45, totalSync: 154233, lastError: "Nenhum" } },
    { id: "openai", name: "OpenAI", connected: true, description: "IA para geração de conteúdo e automações", lastSync: "Há 6 minutos", syncCount: 2134, provider: "OpenAI API", connectedAt: "28/04/2025 16:50", status: "Ativo", checklist: ["Geração de mensagens", "Resumos de reuniões", "Classificação de leads"], stats: { todayMsg: 220, todayChats: 180, totalSync: 2134, lastError: "Nenhum" } },
    { id: "google-drive", name: "Google Drive", connected: false, warning: true, description: "Arquivos, pastas e documentos", lastSync: "Há 2 horas", syncCount: 3421, provider: "Google OAuth", connectedAt: "25/04/2025 13:10", status: "Atenção", checklist: ["Upload de arquivos", "Estrutura de pastas", "Compartilhamento"], stats: { todayMsg: 0, todayChats: 0, totalSync: 3421, lastError: "Token expirado" } },
    { id: "stripe", name: "Stripe", connected: true, description: "Pagamentos, assinaturas e transações", lastSync: "Há 10 minutos", syncCount: 9561, provider: "Stripe API Key", connectedAt: "22/04/2025 15:30", status: "Ativo", checklist: ["Transações em cartão", "Cobranças recorrentes", "Reembolsos"], stats: { todayMsg: 45, todayChats: 45, totalSync: 9561, lastError: "Nenhum" } },
    { id: "conta-azul", name: "Conta Azul", connected: true, description: "Notas fiscais, despesas e lançamentos", lastSync: "Há 3 horas", syncCount: 15733, provider: "Conta Azul API", connectedAt: "20/04/2025 12:45", status: "Ativo", checklist: ["Notas fiscais emitidas", "Lançamentos financeiros", "Conciliação bancária"], stats: { todayMsg: 2, todayChats: 0, totalSync: 15733, lastError: "Nenhum" } },
    { id: "slack", name: "Slack", connected: false, error: true, description: "Mensagens, canais e notificações", lastSync: "Falhou há 15 min", syncCount: 0, provider: "Slack API", connectedAt: "15/04/2025 10:15", status: "Erro", checklist: ["Envio de alertas", "Canais de notificação", "Mapeamento de usuários"], stats: { todayMsg: 0, todayChats: 0, totalSync: 0, lastError: "502 Bad Gateway" } },
    { id: "tiktok-ads", name: "TikTok Ads", connected: false, available: true, description: "Integre para sincronizar dados automaticamente", lastSync: "Nunca", syncCount: 0, provider: "TikTok Ads API", connectedAt: "—", status: "Disponível", checklist: ["Métricas de anúncios", "Campanhas de vídeo"], stats: { todayMsg: 0, todayChats: 0, totalSync: 0, lastError: "Nenhum" } }
  ]
};

// 7. API ENDPOINTS
// ==========================================

// Route to get dashboard CEO metrics
app.get('/api/dashboard', (req, res) => {
  const { period, compareWith } = req.query;
  if (period && period !== "01/05/2025 - 16/05/2025") {
    const seed = period.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mod = (val, pct) => Math.round(val * (1 + ((seed % 10) - 5) / 100 * pct));
    const modFloat = (val, pct) => Number((val * (1 + ((seed % 10) - 5) / 100 * pct)).toFixed(2));
    
    const modifiedData = {
      ...baseDashboardData,
      period: period,
      comparisonPeriod: compareWith || "Período anterior",
      lastUpdate: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      kpis: {
        receitaContratada: { value: mod(1280000, 1.5), change: modFloat(28.6, 0.4), trend: "up" },
        receitaRecebida: { value: mod(860000, 1.2), change: modFloat(24.1, 0.3), trend: "up" },
        roiComercial: { value: mod(680, 0.8), change: modFloat(62.0, 0.5), trend: "up", isPp: true },
        cac: { value: mod(4350, -1), change: modFloat(-18.7, 0.5), trend: "down", positiveDown: true },
        ticketMedio: { value: mod(28400, 0.5), change: modFloat(16.8, 0.2), trend: "up" },
        entradaMedia: { value: mod(12700, 0.6), change: modFloat(22.4, 0.3), trend: "up" },
        pipeline: { value: mod(2950000, 2), change: modFloat(31.2, 0.4), trend: "up" },
        metaMes: {
          current: mod(1280000, 1.5),
          target: 2000000,
          percentage: Math.round((mod(1280000, 1.5) / 2000000) * 100)
        }
      },
      funnel: baseDashboardData.funnel.map((item, idx) => {
        const factor = 1 - idx * 0.05;
        const newCount = mod(item.count, factor);
        return {
          ...item,
          count: newCount,
          conversion: idx === 0 ? 100 : Number(((newCount / mod(1250, 1)) * 100).toFixed(1))
        };
      }),
      commercialHealth: {
        score: Math.min(100, Math.max(0, mod(78, 0.5))),
        change: modFloat(12, 0.3),
        details: baseDashboardData.commercialHealth.details.map(d => ({
          ...d,
          value: Math.min(100, Math.max(0, mod(d.value, 0.4)))
        }))
      },
      payback: {
        months: modFloat(0.8, -0.2),
        change: modFloat(-0.3, 0.1)
      }
    };
    modifiedData.generalConversionRate = modifiedData.funnel[modifiedData.funnel.length - 1].conversion;
    return res.json(modifiedData);
  }
  return res.json(baseDashboardData);
});

// Route to get Commercial Tab metrics
app.get('/api/comercial', (req, res) => {
  const { period, compareWith } = req.query;
  if (period && period !== "01/05/2025 - 16/05/2025") {
    const seed = period.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mod = (val, pct) => Math.round(val * (1 + ((seed % 10) - 5) / 100 * pct));
    const modFloat = (val, pct) => Number((val * (1 + ((seed % 10) - 5) / 100 * pct)).toFixed(2));

    const modifiedData = {
      ...baseCommercialData,
      period: period,
      comparisonPeriod: compareWith || "Período anterior",
      lastUpdate: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      kpis: {
        receitaContratada: { value: mod(1280000, 1.2), change: modFloat(18.3, 0.3), trend: "up" },
        pipelineAtivo: { value: mod(3450000, 1.5), change: modFloat(12.8, 0.4), trend: "up" },
        taxaConversao: { value: modFloat(18.4, 0.2), change: modFloat(2.1, 0.1), trend: "up", isPp: true },
        ticketMedio: { value: mod(28400, 0.5), change: modFloat(9.2, 0.2), trend: "up" },
        entradaMedia: { value: mod(14800, 0.8), change: modFloat(15.1, 0.3), trend: "up" },
        cicloMedioVenda: { value: Math.max(1, mod(12, -0.5)), change: modFloat(-2, 0.2), trend: "down", positiveDown: true }
      },
      closersPerformance: baseCommercialData.closersPerformance.map(closer => {
        const meetings = mod(closer.meetings, 0.5);
        const proposals = mod(closer.proposals, 0.5);
        const sales = Math.min(proposals, mod(closer.sales, 0.5));
        const conversion = Math.round((sales / meetings) * 100) || 0;
        const revenue = sales * closer.ticket;
        return { ...closer, meetings, proposals, sales, conversion, revenue };
      }),
      sdrsPerformance: baseCommercialData.sdrsPerformance.map(sdr => {
        const leads = mod(sdr.leads, 0.6);
        const contacts = Math.min(leads, mod(sdr.contacts, 0.6));
        const meetings = Math.min(contacts, mod(sdr.meetings, 0.6));
        const attendance = Math.min(meetings, mod(sdr.attendance, 0.6));
        const textComp = Math.round((attendance / meetings) * 100) || 0;
        return { ...sdr, leads, contacts, meetings, attendance, txComp: textComp };
      }),
      pipelineFinancial: {
        ...baseCommercialData.pipelineFinancial,
        values: baseCommercialData.pipelineFinancial.values.map(val => mod(val, 1.5))
      },
      upcomingRevenue: baseCommercialData.upcomingRevenue.map(item => ({
        ...item,
        value: mod(item.value, 0.8)
      }))
    };

    modifiedData.closersTotals = {
      meetings: modifiedData.closersPerformance.reduce((acc, c) => acc + c.meetings, 0),
      proposals: modifiedData.closersPerformance.reduce((acc, c) => acc + c.proposals, 0),
      sales: modifiedData.closersPerformance.reduce((acc, c) => acc + c.sales, 0),
      revenue: modifiedData.closersPerformance.reduce((acc, c) => acc + c.revenue, 0),
      ticket: Math.round(modifiedData.closersPerformance.reduce((acc, c) => acc + c.revenue, 0) / modifiedData.closersPerformance.reduce((acc, c) => acc + c.sales, 0)) || 0,
      conversion: Math.round((modifiedData.closersPerformance.reduce((acc, c) => acc + c.sales, 0) / modifiedData.closersPerformance.reduce((acc, c) => acc + c.meetings, 0)) * 100) || 0
    };

    modifiedData.sdrsTotals = {
      leads: modifiedData.sdrsPerformance.reduce((acc, s) => acc + s.leads, 0),
      contacts: modifiedData.sdrsPerformance.reduce((acc, s) => acc + s.contacts, 0),
      meetings: modifiedData.sdrsPerformance.reduce((acc, s) => acc + s.meetings, 0),
      attendance: modifiedData.sdrsPerformance.reduce((acc, s) => acc + s.attendance, 0),
      txComp: Math.round((modifiedData.sdrsPerformance.reduce((acc, s) => acc + s.attendance, 0) / modifiedData.sdrsPerformance.reduce((acc, s) => acc + s.meetings, 0)) * 100) || 0,
      time: "11 min"
    };

    modifiedData.upcomingRevenueTotal = modifiedData.upcomingRevenue.reduce((acc, item) => acc + item.value, 0);

    return res.json(modifiedData);
  }
  return res.json(baseCommercialData);
});

// Route to get Marketing Tab metrics
app.get('/api/marketing', (req, res) => {
  const { period, compareWith } = req.query;
  if (period && period !== "01/05/2025 - 16/05/2025") {
    const seed = period.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mod = (val, pct) => Math.round(val * (1 + ((seed % 10) - 5) / 100 * pct));
    const modFloat = (val, pct) => Number((val * (1 + ((seed % 10) - 5) / 100 * pct)).toFixed(2));

    const modifiedData = {
      ...baseMarketingData,
      period: period,
      comparisonPeriod: compareWith || "Período anterior",
      lastUpdate: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      kpis: {
        investimentoTotal: { value: mod(41250, 1.2), change: modFloat(12.6, 0.3), trend: "up" },
        leadsGerados: { value: mod(620, 1.1), change: modFloat(18.3, 0.4), trend: "up" },
        leadsQualificados: {
          value: mod(280, 1.3),
          change: modFloat(21.7, 0.5),
          trend: "up",
          totalLeadRatio: Number(((mod(280, 1.3) / mod(620, 1.1)) * 100).toFixed(1))
        },
        cpl: { value: modFloat(66.53, -0.5), change: modFloat(-6.3, 0.3), trend: "down", positiveDown: true },
        cplq: { value: modFloat(147.32, -0.6), change: modFloat(-8.1, 0.4), trend: "down", positiveDown: true },
        custoReuniaoComparecida: { value: modFloat(284.83, -0.4), change: modFloat(-9.4, 0.3), trend: "down", positiveDown: true },
        cac: { value: modFloat(1331.61, -0.8), change: modFloat(-11.7, 0.5), trend: "down", positiveDown: true },
        roiMarketing: { value: mod(3102, 1.5), change: modFloat(24.8, 0.4), trend: "up" }
      },
      performanceByChannel: baseMarketingData.performanceByChannel.map(ch => {
        const investment = mod(ch.investment, 0.8);
        const leads = mod(ch.leads, 0.8);
        const qual = mod(ch.qual, 0.8);
        const meetings = mod(ch.meetings, 0.8);
        const sales = mod(ch.sales, 0.8);
        const revenue = mod(ch.revenue, 1.2);
        const roi = investment > 0 ? Math.round((revenue / investment) * 100) : null;
        return { ...ch, investment, leads, qual, meetings, sales, revenue, roi };
      }),
      campaignsPerformance: baseMarketingData.campaignsPerformance.map(cam => {
        const investment = mod(cam.investment, 0.8);
        const leads = mod(cam.leads, 0.8);
        const cplq = leads > 0 ? Number(((investment / leads) * 1.5).toFixed(2)) : 0;
        const meetings = mod(cam.meetings, 0.8);
        const sales = mod(cam.sales, 0.8);
        const roi = mod(cam.roi, 1.1);
        return { ...cam, investment, leads, cplq, meetings, sales, roi };
      }),
      icpPerformance: baseMarketingData.icpPerformance.map(item => {
        const leads = mod(item.leads, 0.8);
        const cpl = modFloat(item.cpl, -0.4);
        const cplq = modFloat(item.cplq, -0.4);
        const meetingCost = modFloat(item.meetingCost, -0.3);
        const saleRatio = Math.min(100, Math.max(1, mod(item.saleRatio, 0.2)));
        const ticket = mod(item.ticket, 0.5);
        return { ...item, leads, cpl, cplq, meetingCost, saleRatio, ticket };
      })
    };

    modifiedData.performanceByChannelTotals = {
      investment: modifiedData.performanceByChannel.reduce((acc, c) => acc + c.investment, 0),
      leads: modifiedData.performanceByChannel.reduce((acc, c) => acc + c.leads, 0),
      qual: modifiedData.performanceByChannel.reduce((acc, c) => acc + c.qual, 0),
      meetings: modifiedData.performanceByChannel.reduce((acc, c) => acc + c.meetings, 0),
      sales: modifiedData.performanceByChannel.reduce((acc, c) => acc + c.sales, 0),
      revenue: modifiedData.performanceByChannel.reduce((acc, c) => acc + c.revenue, 0),
      roi: Math.round(modifiedData.performanceByChannel.reduce((acc, c) => acc + c.revenue, 0) / modifiedData.performanceByChannel.reduce((acc, c) => acc + c.investment, 0) * 100)
    };

    return res.json(modifiedData);
  }
  return res.json(baseMarketingData);
});

// Route to get Pré-vendas (SDR) Tab metrics
app.get('/api/prevendas', (req, res) => {
  const { period, compareWith } = req.query;

  if (period && period !== "01/05/2025 - 16/05/2025") {
    const seed = period.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mod = (val, pct) => Math.round(val * (1 + ((seed % 10) - 5) / 100 * pct));
    const modFloat = (val, pct) => Number((val * (1 + ((seed % 10) - 5) / 100 * pct)).toFixed(2));

    const modifiedData = {
      ...basePreVendasData,
      period: period,
      comparisonPeriod: compareWith || "Período anterior",
      lastUpdate: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      kpis: {
        leadsNovos: { value: mod(1250, 1.2), change: modFloat(18.3, 0.4), trend: "up" },
        contatosRealizados: { value: mod(1020, 1.0), change: modFloat(15.4, 0.3), trend: "up" },
        taxaContato: { value: modFloat(81.6, 0.1), change: modFloat(2.8, 0.2), trend: "up", isPp: true },
        respostas: { value: mod(785, 1.1), change: modFloat(12.7, 0.4), trend: "up" },
        taxaResposta: { value: modFloat(62.8, 0.2), change: modFloat(2.1, 0.1), trend: "up", isPp: true },
        leadsQualificados: { value: mod(520, 1.3), change: modFloat(14.6, 0.3), trend: "up" },
        taxaQualificacao: { value: modFloat(66.2, 0.2), change: modFloat(3.4, 0.2), trend: "up", isPp: true },
        reunioesAgendadas: { value: mod(320, 1.4), change: modFloat(14.7, 0.4), trend: "up" },
        comparecimento: {
          value: mod(245, 1.2),
          change: modFloat(11.4, 0.3),
          trend: "up",
          showRatio: Number(((mod(245, 1.2) / mod(320, 1.4)) * 100).toFixed(1))
        }
      },
      sdrsPerformance: basePreVendasData.sdrsPerformance.map(sdr => {
        const leads = mod(sdr.leads, 0.8);
        const qual = mod(sdr.qual, 0.8);
        const meetings = mod(sdr.meetings, 0.8);
        const attendance = Math.min(meetings, mod(sdr.attendance, 0.8));
        const txAgenda = Number(((meetings / leads) * 100).toFixed(1));
        const txShow = Number(((attendance / meetings) * 100).toFixed(1));
        return { ...sdr, leads, qual, meetings, attendance, txAgenda, txShow };
      }),
      productivity: {
        firstContactTime: { value: Math.max(1, mod(8, -0.6)), change: modFloat(-32, 0.2), trend: "down", positiveDown: true, meta: 15 },
        noShow: { value: modFloat(23.4, -0.2), change: modFloat(-3.2, 0.1), trend: "down", positiveDown: true, meta: 20 },
        leadsFollowUp: { value: mod(186, 0.8), change: modFloat(6.3, 0.2), trend: "up" },
        delayedTasks: { value: Math.max(0, mod(12, -1)), change: modFloat(-25, 0.3), trend: "down", positiveDown: true, meta: 0 }
      }
    };

    modifiedData.sdrsTotals = {
      leads: modifiedData.sdrsPerformance.reduce((acc, s) => acc + s.leads, 0),
      qual: modifiedData.sdrsPerformance.reduce((acc, s) => acc + s.qual, 0),
      meetings: modifiedData.sdrsPerformance.reduce((acc, s) => acc + s.meetings, 0),
      attendance: modifiedData.sdrsPerformance.reduce((acc, s) => acc + s.attendance, 0),
      txAgenda: Number(((modifiedData.sdrsPerformance.reduce((acc, s) => acc + s.meetings, 0) / modifiedData.sdrsPerformance.reduce((acc, s) => acc + s.leads, 0)) * 100).toFixed(1)),
      txShow: Number(((modifiedData.sdrsPerformance.reduce((acc, s) => acc + s.attendance, 0) / modifiedData.sdrsPerformance.reduce((acc, s) => acc + s.meetings, 0)) * 100).toFixed(1))
    };

    return res.json(modifiedData);
  }

  return res.json(basePreVendasData);
});

// Route to get Closer Cockpit metrics
app.get('/api/closer', (req, res) => {
  const { period, compareWith } = req.query;

  if (period && period !== "16/05/2025") {
    const seed = period.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mod = (val, pct) => Math.round(val * (1 + ((seed % 10) - 5) / 100 * pct));
    const modFloat = (val, pct) => Number((val * (1 + ((seed % 10) - 5) / 100 * pct)).toFixed(2));

    const modifiedData = {
      ...baseCloserData,
      period: period,
      comparisonPeriod: compareWith || "Período anterior",
      lastUpdate: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      kpis: {
        reunioesHoje: { value: Math.max(0, mod(8, 0.4)), target: 10, percentage: Math.round((Math.max(0, mod(8, 0.4)) / 10) * 100) },
        comparecimento: { value: Math.min(100, Math.max(0, mod(87, 0.15))), change: modFloat(6, 0.15), trend: "up", isPp: true },
        propostasAbertas: { value: mod(23, 0.3), change: modFloat(5, 0.2), trend: "up" },
        vendasMes: { value: mod(12, 0.5), target: 20, percentage: Math.round((mod(12, 0.5) / 20) * 100) },
        conversao: { value: Math.min(100, Math.max(0, mod(41, 0.2))), change: modFloat(5, 0.1), trend: "up", isPp: true },
        ticketMedio: { value: mod(44000, 0.4), change: modFloat(12, 0.2), trend: "up" },
        entradaMedia: { value: mod(18500, 0.3), change: modFloat(15, 0.2), trend: "up" },
        receitaFechada: { value: mod(528000, 0.8), target: 800000, percentage: Math.round((mod(528000, 0.8) / 800000) * 100) }
      },
      receitaPessoal: {
        percentage: Math.round((mod(528000, 0.8) / 800000) * 100),
        target: 800000,
        current: mod(528000, 0.8),
        remaining: Math.max(0, 800000 - mod(528000, 0.8)),
        commission: Math.round(mod(528000, 0.8) * 0.1)
      },
      propostas: baseCloserData.propostas.map(p => {
        const value = mod(p.value, 0.5);
        const entry = Math.round(value * 0.375);
        const prob = Math.min(100, Math.max(0, mod(p.prob, 0.2)));
        return { ...p, value, entry, prob };
      }),
      proximasOportunidades: baseCloserData.proximasOportunidades.map(o => {
        const value = mod(o.value, 0.5);
        const prob = Math.min(100, Math.max(0, mod(o.prob, 0.2)));
        return { ...o, value, prob };
      })
    };

    return res.json(modifiedData);
  }

  return res.json(baseCloserData);
});

// Route to get Financeiro Tab metrics
app.get('/api/financeiro', (req, res) => {
  const { period, compareWith } = req.query;

  if (period && period !== "01/05/2025 - 16/05/2025") {
    const seed = period.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mod = (val, pct) => Math.round(val * (1 + ((seed % 10) - 5) / 100 * pct));
    const modFloat = (val, pct) => Number((val * (1 + ((seed % 10) - 5) / 100 * pct)).toFixed(2));

    const modifiedData = {
      ...baseFinanceiroData,
      period: period,
      comparisonPeriod: compareWith || "Período anterior",
      lastUpdate: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      kpis: {
        caixaAtual: { value: mod(482000, 1.0), change: modFloat(8.2, 0.2), trend: "up" },
        receitaRecebida: { value: mod(1280000, 1.2), change: modFloat(13.7, 0.3), trend: "up" },
        receitaContratada: { value: mod(2040000, 1.5), change: modFloat(22.4, 0.4), trend: "up" },
        contasReceber: { value: mod(1760000, 1.2), change: modFloat(12.6, 0.3), trend: "up" },
        contasPagar: { value: mod(620000, 0.8), change: modFloat(-5.3, 0.2), trend: "down", positiveDown: true },
        fluxoProjetado: { value: mod(1100000, 1.4), change: modFloat(16.8, 0.3), trend: "up" },
        margemOperacional: { value: modFloat(34.8, 0.1), change: modFloat(4.1, 0.2), trend: "up", isPp: true },
        lucroLiquido: { value: mod(385000, 1.2), change: modFloat(21.2, 0.3), trend: "up" }
      },
      receitaProduto: baseFinanceiroData.receitaProduto.map(p => {
        const contracted = mod(p.contracted, 0.8);
        const received = mod(p.received, 0.8);
        const toReceive = contracted - received;
        const percentage = Math.round((received / contracted) * 100);
        return { ...p, contracted, received, toReceive, percentage };
      }),
      rentabilidade: baseFinanceiroData.rentabilidade.map(item => {
        const revenue = mod(item.revenue || item.productCost || 140000, 0.8);
        const cost = mod(item.cost, 0.8);
        const margin = Math.round(((revenue + cost) / revenue) * 100);
        return { ...item, revenue, cost, margin };
      })
    };

    modifiedData.receitaProdutoTotal = {
      contracted: modifiedData.receitaProduto.reduce((acc, p) => acc + p.contracted, 0),
      received: modifiedData.receitaProduto.reduce((acc, p) => acc + p.received, 0),
      toReceive: modifiedData.receitaProduto.reduce((acc, p) => acc + p.toReceive, 0),
      percentage: Math.round((modifiedData.receitaProduto.reduce((acc, p) => acc + p.received, 0) / modifiedData.receitaProduto.reduce((acc, p) => acc + p.contracted, 0)) * 100)
    };

    modifiedData.rentabilidadeTotal = {
      revenue: modifiedData.rentabilidade.reduce((acc, r) => acc + (r.revenue || 0), 0),
      cost: modifiedData.rentabilidade.reduce((acc, r) => acc + (r.cost || 0), 0),
      margin: Math.round(((modifiedData.rentabilidade.reduce((acc, r) => acc + (r.revenue || 0), 0) + modifiedData.rentabilidade.reduce((acc, r) => acc + (r.cost || 0), 0)) / modifiedData.rentabilidade.reduce((acc, r) => acc + (r.revenue || 0), 0)) * 100)
    };

    return res.json(modifiedData);
  }

  return res.json(baseFinanceiroData);
});


// Route to get Operação Tab metrics
app.get('/api/operacao', (req, res) => {
  const { period, compareWith } = req.query;

  if (period && period !== "01/05/2025 - 16/05/2025") {
    const seed = period.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mod = (val, pct) => Math.round(val * (1 + ((seed % 10) - 5) / 100 * pct));
    const modFloat = (val, pct) => Number((val * (1 + ((seed % 10) - 5) / 100 * pct)).toFixed(2));

    const modifiedData = {
      ...baseOperacaoData,
      period: period,
      comparisonPeriod: compareWith || "Período anterior",
      lastUpdate: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      kpis: {
        clientesAtivos: { value: mod(128, 1.0), change: modFloat(12, 0.2), trend: "up" },
        emImplantacao: { value: mod(22, 0.8), change: modFloat(10, 0.2), trend: "up" },
        operacoesSaudaveis: { value: Math.min(100, Math.max(0, mod(91, 0.1))), change: modFloat(7, 0.2), trend: "up", isPp: true },
        operacoesEmRisco: { value: Math.max(0, mod(11, -0.6)), change: modFloat(-2, 0.1), trend: "down", positiveDown: true },
        tempoMedioImplantacao: { value: Math.max(1, mod(34, -0.4)), change: modFloat(-6, 0.1), trend: "down", positiveDown: true },
        slaCumprido: { value: Math.min(100, Math.max(0, mod(93, 0.1))), change: modFloat(5, 0.2), trend: "up", isPp: true },
        npsGeral: { value: Math.min(100, Math.max(-100, mod(82, 0.2))), change: modFloat(6, 0.2), trend: "up" },
        gargalosAtivos: { value: Math.max(0, mod(8, -0.5)), change: modFloat(-1, 0.1), trend: "down", positiveDown: true }
      },
      projetosEmAndamento: baseOperacaoData.projetosEmAndamento.map(p => {
        const progress = Math.min(100, Math.max(0, mod(p.progress, 0.3)));
        return { ...p, progress };
      })
    };
    return res.json(modifiedData);
  }

  return res.json(baseOperacaoData);
});


// Route to get Clientes metrics
app.get('/api/clientes', (req, res) => {
  const { period, compareWith, clientId } = req.query;

  if (clientId) {
    const detail = baseClientesData.details[clientId] || baseClientesData.details["empresa-beta"];
    return res.json(detail);
  }

  if (period && period !== "01/05/2025 - 16/05/2025") {
    const seed = period.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mod = (val, pct) => Math.round(val * (1 + ((seed % 10) - 5) / 100 * pct));
    const modFloat = (val, pct) => Number((val * (1 + ((seed % 10) - 5) / 100 * pct)).toFixed(2));

    const modifiedData = {
      ...baseClientesData,
      period: period,
      comparisonPeriod: compareWith || "Período anterior",
      lastUpdate: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      kpis: {
        clientesAtivos: { value: mod(128, 1.0), change: modFloat(12, 0.2), trend: "up" },
        novosClientes: { value: mod(15, 0.8), change: modFloat(7, 0.2), trend: "up" },
        clientesSaudaveis: { value: Math.min(100, Math.max(0, mod(92, 0.1))), change: modFloat(5, 0.2), trend: "up", isPp: true },
        clientesEmRisco: { value: Math.max(0, mod(8, -0.5)), change: modFloat(-2, 0.1), trend: "down", positiveDown: true },
        npsMedio: { value: Math.min(100, Math.max(0, mod(84, 0.2))), change: modFloat(6, 0.2), trend: "up" },
        mrr: { value: mod(240000, 1.2), change: modFloat(18, 0.3), trend: "up" },
        churn: { value: modFloat(1.8, -0.4), change: modFloat(-0.6, 0.1), trend: "down", positiveDown: true },
        ltv: { value: mod(18600, 0.8), change: modFloat(9, 0.2), trend: "up" }
      }
    };
    return res.json(modifiedData);
  }

  return res.json(baseClientesData);
});

// Route to get Configurações / Integrações metrics
app.get('/api/configuracoes', (req, res) => {
  return res.json(baseConfiguracoesData);
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
