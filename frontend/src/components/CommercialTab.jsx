import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Users,
  Percent,
  Activity,
  Calendar,
  Clock,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Phone,
  FileText,
  Layers,
  ArrowRight,
  Info,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import HorizontalFunnel from './HorizontalFunnel';

const CommercialTab = ({ data, formatValue }) => {
  const [activeSubTab, setActiveSubTab] = useState('visao-geral');

  // Sub-tabs list
  const subTabs = [
    { id: 'visao-geral', label: 'Visão Geral' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'equipe', label: 'Equipe' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'insights-ia', label: 'Insights IA' }
  ];

  if (!data) return null;

  // Desestruturando os dados da API comercial
  const {
    kpis,
    funnel,
    generalConversionRate,
    targetConversionRate,
    pipelineFinancial,
    closersPerformance,
    closersTotals,
    sdrsPerformance,
    sdrsTotals,
    salesSources,
    conversionsByStage,
    lossReasons,
    upcomingRevenue,
    upcomingRevenueTotal,
    monthlyGoals,
    recentActivities,
    alerts,
    insights
  } = data;

  // 1. Pipeline Financial Bar Chart options
  const pipelineChartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      parentHeightOffset: 0
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '55%',
        distributed: true,
        borderRadius: 4
      }
    },
    colors: pipelineFinancial.colors,
    dataLabels: {
      enabled: true,
      textAnchor: 'end',
      formatter: (val) => formatValue(val, 'currency'),
      style: {
        fontSize: '9px',
        fontFamily: 'Inter',
        fontWeight: 'bold',
        colors: ['#fff']
      },
      offsetX: -4
    },
    xaxis: {
      categories: pipelineFinancial.stages,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '9px', fontFamily: 'Inter', fontWeight: 500 }
      }
    },
    grid: { show: false },
    legend: { show: false },
    tooltip: {
      theme: 'dark',
      y: { formatter: (val) => `R$ ${val.toLocaleString('pt-BR')}` }
    }
  };

  const pipelineChartSeries = [{
    data: pipelineFinancial.values
  }];

  // 2. Sales Sources Donut Chart
  const salesDonutOptions = {
    chart: { type: 'donut' },
    labels: salesSources.map(s => s.source),
    colors: salesSources.map(s => s.color),
    stroke: { colors: ['#0f172a'], width: 2 },
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          background: 'transparent',
          labels: {
            show: true,
            name: { show: true, fontSize: '10px', color: '#94a3b8', offsetY: -6, fontFamily: 'Inter' },
            value: { show: true, fontSize: '15px', fontWeight: 'bold', color: '#fff', offsetY: 6, fontFamily: 'Outfit', formatter: (val) => `${val}%` },
            total: {
              show: true,
              label: 'Receita',
              color: '#94a3b8',
              fontSize: '10px',
              fontFamily: 'Inter',
              formatter: () => 'R$ 1,280M'
            }
          }
        }
      }
    },
    tooltip: {
      theme: 'dark',
      y: { formatter: (val) => `${val}%` }
    }
  };

  const salesDonutSeries = salesSources.map(s => s.percentage);

  // 3. Conversions By Stage Bar Chart
  const conversionsChartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      parentHeightOffset: 0
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '62%',
        distributed: true,
        borderRadius: 3
      }
    },
    colors: conversionsByStage.colors,
    dataLabels: {
      enabled: true,
      textAnchor: 'end',
      formatter: (val, opt) => {
        const count = conversionsByStage.values[opt.dataPointIndex].toLocaleString('pt-BR');
        const pct = conversionsByStage.percentages[opt.dataPointIndex];
        return `${count} (${pct}%)`;
      },
      style: {
        fontSize: '9px',
        fontFamily: 'Inter',
        fontWeight: 'bold',
        colors: ['#fff']
      },
      offsetX: -4
    },
    xaxis: {
      categories: conversionsByStage.categories,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '9px', fontFamily: 'Inter', fontWeight: 500 }
      }
    },
    grid: { show: false },
    legend: { show: false },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val, opt) => `${conversionsByStage.values[opt.dataPointIndex]} leads (${conversionsByStage.percentages[opt.dataPointIndex]}%)`
      }
    }
  };

  const conversionsChartSeries = [{
    data: conversionsByStage.values
  }];

  return (
    <div className="flex flex-col gap-6">
      
      {/* SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-1 border-b border-dark-border pb-px">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`py-2 px-4 text-xs font-semibold uppercase tracking-wider relative transition-all duration-200 ${
              activeSubTab === tab.id
                ? 'text-brand-gold-start font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            {activeSubTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-gold-start to-brand-gold-end rounded-t-full shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
            )}
          </button>
        ))}
      </div>

      {/* Render placeholder for other subtabs */}
      {activeSubTab !== 'visao-geral' ? (
        <div className="glass-card p-12 rounded-xl text-center border-dashed border-dark-border">
          <Sparkles className="w-10 h-10 text-brand-gold-start mx-auto mb-3 animate-pulse" />
          <h4 className="text-white font-heading font-bold text-base mb-1">Módulo {subTabs.find(t => t.id === activeSubTab)?.label}</h4>
          <p className="text-gray-400 text-xs max-w-sm mx-auto mb-4">
            Esta seção está em desenvolvimento estruturado para o ecossistema de vendas da Axion.
          </p>
          <button
            onClick={() => setActiveSubTab('visao-geral')}
            className="btn-gold py-1.5 px-3 rounded-lg text-xs"
          >
            Voltar para Visão Geral
          </button>
        </div>
      ) : (
        <>
          {/* VISÃO GERAL CONTENT */}
          
          {/* 6 TOP KPI CARDS */}
          <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            
            {/* KPI 1: Receita Contratada */}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[96px]">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[9px] font-bold uppercase tracking-wider">Receita Contratada</span>
                <DollarSign className="w-4 h-4 text-status-blue" />
              </div>
              <div className="my-1.5">
                <span className="text-lg md:text-xl font-heading font-black text-white font-mono block">
                  {formatValue(kpis.receitaContratada.value, 'currency')}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-status-green font-bold">
                <span>▲ {kpis.receitaContratada.change}%</span>
                <span className="text-gray-500 font-medium normal-case">vs anterior</span>
              </div>
            </div>

            {/* KPI 2: Pipeline Ativo */}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[96px]">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[9px] font-bold uppercase tracking-wider">Pipeline Ativo</span>
                <Layers className="w-4 h-4 text-status-purple" />
              </div>
              <div className="my-1.5">
                <span className="text-lg md:text-xl font-heading font-black text-white font-mono block">
                  {formatValue(kpis.pipelineAtivo.value, 'currency')}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-status-green font-bold">
                <span>▲ {kpis.pipelineAtivo.change}%</span>
                <span className="text-gray-500 font-medium normal-case">vs anterior</span>
              </div>
            </div>

            {/* KPI 3: Taxa de Conversão */}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[96px]">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[9px] font-bold uppercase tracking-wider">Taxa de Conversão</span>
                <Percent className="w-4 h-4 text-status-green" />
              </div>
              <div className="my-1.5">
                <span className="text-lg md:text-xl font-heading font-black text-white font-mono block">
                  {kpis.taxaConversao.value}%
                </span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-status-green font-bold">
                <span>▲ {kpis.taxaConversao.change} p.p.</span>
                <span className="text-gray-500 font-medium normal-case">vs anterior</span>
              </div>
            </div>

            {/* KPI 4: Ticket Médio */}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[96px]">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[9px] font-bold uppercase tracking-wider">Ticket Médio</span>
                <Target className="w-4 h-4 text-status-yellow" />
              </div>
              <div className="my-1.5">
                <span className="text-lg md:text-xl font-heading font-black text-white font-mono block">
                  {formatValue(kpis.ticketMedio.value, 'currency')}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-status-green font-bold">
                <span>▲ {kpis.ticketMedio.change}%</span>
                <span className="text-gray-500 font-medium normal-case">vs anterior</span>
              </div>
            </div>

            {/* KPI 5: Entrada Média */}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[96px]">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[9px] font-bold uppercase tracking-wider">Entrada Média</span>
                <DollarSign className="w-4 h-4 text-status-cyan" />
              </div>
              <div className="my-1.5">
                <span className="text-lg md:text-xl font-heading font-black text-white font-mono block">
                  {formatValue(kpis.entradaMedia.value, 'currency')}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-status-green font-bold">
                <span>▲ {kpis.entradaMedia.change}%</span>
                <span className="text-gray-500 font-medium normal-case">vs anterior</span>
              </div>
            </div>

            {/* KPI 6: Ciclo Médio de Venda */}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[96px]">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[9px] font-bold uppercase tracking-wider">Ciclo Médio de Venda</span>
                <Clock className="w-4 h-4 text-status-yellow" />
              </div>
              <div className="my-1.5">
                <span className="text-lg md:text-xl font-heading font-black text-white font-mono block">
                  {kpis.cicloMedioVenda.value} dias
                </span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-status-green font-bold">
                <span>▼ {Math.abs(kpis.cicloMedioVenda.change)} dias</span>
                <span className="text-gray-500 font-medium normal-case">vs anterior</span>
              </div>
            </div>

          </section>

          {/* ROW 2: CHEVRON FUNNEL & PIPELINE VALUE GRID */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Funil Comercial (Chevron Style, 8/12 wide) */}
            <div className="glass-card p-5 rounded-xl xl:col-span-8 flex flex-col justify-between min-h-[220px]">
              <div className="border-b border-dark-border pb-2.5 mb-2.5">
                <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Funil Comercial</h3>
              </div>
              <div className="flex-grow flex items-center">
                <HorizontalFunnel
                  data={funnel}
                  generalConversionRate={generalConversionRate}
                  targetConversionRate={targetConversionRate}
                />
              </div>
            </div>

            {/* Pipeline Financeiro Valor (4/12 wide) */}
            <div className="glass-card p-5 rounded-xl xl:col-span-4 flex flex-col justify-between min-h-[220px]">
              <div className="border-b border-dark-border pb-2.5 mb-2.5">
                <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Pipeline Financeiro (Valor)</h3>
              </div>
              <div className="flex-grow flex items-center select-none">
                <div className="w-full h-[140px]">
                  <Chart
                    options={pipelineChartOptions}
                    series={pipelineChartSeries}
                    type="bar"
                    height="100%"
                    width="100%"
                  />
                </div>
              </div>
            </div>

          </section>

          {/* ROW 3: CLOSERS TABLE, SDR TABLE, SALES DONUT GRID */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Closers Performance Table (5/12 wide) */}
            <div className="glass-card p-4 rounded-xl xl:col-span-5 flex flex-col justify-between">
              <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
                <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Performance dos Closers</h3>
                <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver detalhes</button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                      <th className="py-2 px-1.5">Closer</th>
                      <th className="py-2 text-right">Reuniões</th>
                      <th className="py-2 text-right">Propostas</th>
                      <th className="py-2 text-right">Vendas</th>
                      <th className="py-2 text-right">Conversão</th>
                      <th className="py-2 text-right">Ticket Médio</th>
                      <th className="py-2 text-right px-1.5">Receita (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {closersPerformance.map((closer, idx) => (
                      <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                        <td className="py-2 px-1.5 font-medium text-white">{closer.name}</td>
                        <td className="py-2 text-right font-mono">{closer.meetings}</td>
                        <td className="py-2 text-right font-mono">{closer.proposals}</td>
                        <td className="py-2 text-right font-mono">{closer.sales}</td>
                        <td className="py-2 text-right font-mono font-bold text-white">{closer.conversion}%</td>
                        <td className="py-2 text-right font-mono">{formatValue(closer.ticket, 'currency')}</td>
                        <td className="py-2 text-right font-mono px-1.5 text-white font-semibold">
                          <span className="flex items-center justify-end gap-1">
                            {formatValue(closer.revenue, 'currency')}
                            <span className={closer.trend === 'up' ? 'text-status-green' : 'text-status-red'}>
                              {closer.trend === 'up' ? '▲' : '▼'}
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-black/25 font-bold border-t border-dark-border text-white uppercase tracking-wide">
                      <td className="py-2.5 px-1.5">Total / Média</td>
                      <td className="py-2.5 text-right font-mono">{closersTotals.meetings}</td>
                      <td className="py-2.5 text-right font-mono">{closersTotals.proposals}</td>
                      <td className="py-2.5 text-right font-mono">{closersTotals.sales}</td>
                      <td className="py-2.5 text-right font-mono text-brand-gold-start">{closersTotals.conversion}%</td>
                      <td className="py-2.5 text-right font-mono">{formatValue(closersTotals.ticket, 'currency')}</td>
                      <td className="py-2.5 text-right font-mono px-1.5 text-brand-gold-start">{formatValue(closersTotals.revenue, 'currency')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SDRs Performance Table (4/12 wide) */}
            <div className="glass-card p-4 rounded-xl xl:col-span-4 flex flex-col justify-between">
              <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
                <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Performance dos SDRs</h3>
                <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver detalhes</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                      <th className="py-2 px-1.5">SDR</th>
                      <th className="py-2 text-right">Leads</th>
                      <th className="py-2 text-right">Contatos</th>
                      <th className="py-2 text-right">Agend.</th>
                      <th className="py-2 text-right">Comprec.</th>
                      <th className="py-2 text-right">Tx. Comp.</th>
                      <th className="py-2 text-right px-1.5">Tempo 1º Cont.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sdrsPerformance.map((sdr, idx) => (
                      <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                        <td className="py-2 px-1.5 font-medium text-white">{sdr.name}</td>
                        <td className="py-2 text-right font-mono">{sdr.leads}</td>
                        <td className="py-2 text-right font-mono">{sdr.contacts}</td>
                        <td className="py-2 text-right font-mono">{sdr.meetings}</td>
                        <td className="py-2 text-right font-mono">{sdr.attendance}</td>
                        <td className="py-2 text-right font-mono font-bold text-white">{sdr.txComp}%</td>
                        <td className="py-2 text-right font-mono px-1.5 font-medium text-white">{sdr.time}</td>
                      </tr>
                    ))}
                    <tr className="bg-black/25 font-bold border-t border-dark-border text-white uppercase tracking-wide">
                      <td className="py-2.5 px-1.5">Total / Média</td>
                      <td className="py-2.5 text-right font-mono">{sdrsTotals.leads}</td>
                      <td className="py-2.5 text-right font-mono">{sdrsTotals.contacts}</td>
                      <td className="py-2.5 text-right font-mono">{sdrsTotals.meetings}</td>
                      <td className="py-2.5 text-right font-mono">{sdrsTotals.attendance}</td>
                      <td className="py-2.5 text-right font-mono text-brand-gold-start">{sdrsTotals.txComp}%</td>
                      <td className="py-2.5 text-right font-mono px-1.5 text-brand-gold-start">{sdrsTotals.time}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Origem das Vendas Donut (3/12 wide) */}
            <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between">
              <div className="border-b border-dark-border pb-2.5 mb-2.5">
                <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Origem das Vendas (Receita)</h3>
              </div>

              {/* Donut graphic */}
              <div className="w-full h-[125px] flex items-center justify-center relative select-none">
                <Chart
                  options={salesDonutOptions}
                  series={salesDonutSeries}
                  type="donut"
                  height="100%"
                  width="100%"
                />
              </div>

              {/* Legend details */}
              <div className="flex flex-col gap-1 mt-2 text-[9px]">
                {salesSources.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-dark-border/20 pb-0.5 last:border-0">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                      <span className="font-medium truncate max-w-[90px]">{item.source}</span>
                    </div>
                    <div className="flex gap-1.5 font-mono">
                      <span className="text-gray-500">{item.percentage}%</span>
                      <span className="text-white font-bold">{formatValue(item.amount, 'currency')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>

          {/* ROW 4: STAGE CONVERSIONS, LOSS REASONS, UPCOMING REVENUE, MONTHLY GOALS GRID */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
            {/* Conversões por Etapa horizontal bars */}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[290px]">
              <div className="border-b border-dark-border pb-2.5 mb-2.5">
                <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Conversões por Etapa</h3>
              </div>
              <div className="flex-grow flex items-center select-none">
                <div className="w-full h-[220px]">
                  <Chart
                    options={conversionsChartOptions}
                    series={conversionsChartSeries}
                    type="bar"
                    height="100%"
                    width="100%"
                  />
                </div>
              </div>
            </div>

            {/* Motivos de Perda list with progress meters */}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[290px]">
              <div className="border-b border-dark-border pb-2 mb-2 flex items-center justify-between">
                <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Motivos de Perda</h3>
                <span className="text-[9px] text-gray-500 font-mono">Motivo / Qtd / %</span>
              </div>
              
              <div className="flex-grow flex flex-col justify-between gap-1 mt-1 text-[10px]">
                {lossReasons.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between text-gray-400 font-medium">
                      <span>{item.reason}</span>
                      <div className="flex gap-2 font-mono">
                        <span>{item.count}</span>
                        <span className="text-white font-bold">{item.percentage}%</span>
                      </div>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden border border-dark-border/20">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Próximas Receitas (Alta Probabilidade) Table */}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[290px]">
              <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
                <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Próximas Receitas</h3>
                <span className="text-[8px] bg-status-green/10 text-status-green px-1.5 py-0.5 rounded font-mono font-bold">Alta Prob.</span>
              </div>
              
              <div className="overflow-x-auto flex-grow">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="border-b border-dark-border/60 text-gray-500 uppercase font-semibold">
                      <th className="py-2">Negócio</th>
                      <th className="py-2 text-right">Valor</th>
                      <th className="py-2 text-right">Probabilidade</th>
                      <th className="py-2 text-right">Previsão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingRevenue.map((item, idx) => (
                      <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                        <td className="py-2 font-medium text-white">{item.business}</td>
                        <td className="py-2 text-right font-mono font-semibold text-white">R$ {item.value.toLocaleString('pt-BR')}</td>
                        <td className="py-2 text-right font-mono">
                          <span className="bg-status-green/10 text-status-green py-0.5 px-1.5 rounded font-bold">
                            {item.probability}%
                          </span>
                        </td>
                        <td className="py-2 text-right font-mono text-gray-400">{item.forecast}</td>
                      </tr>
                    ))}
                    <tr className="bg-black/10 font-bold border-t border-dark-border text-white uppercase tracking-wide">
                      <td className="py-2.5">Total</td>
                      <td className="py-2.5 text-right font-mono text-brand-gold-start" colSpan={3}>
                        R$ {upcomingRevenueTotal.toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Metas do Mês list with meters */}
            <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[290px]">
              <div className="border-b border-dark-border pb-2 mb-2 flex items-center justify-between">
                <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Metas do Mês</h3>
                <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Editar metas</button>
              </div>

              <div className="flex-grow flex flex-col justify-between gap-1.5 text-[10px] mt-1">
                {monthlyGoals.map((goal, idx) => {
                  let valStr = '';
                  let tarStr = '';
                  
                  if (goal.isCurrency) {
                    valStr = formatValue(goal.current, 'currency');
                    tarStr = formatValue(goal.target, 'currency');
                  } else if (goal.isPercent) {
                    valStr = `${goal.current}%`;
                    tarStr = `${goal.target}%`;
                  } else {
                    valStr = goal.current;
                    tarStr = goal.target;
                  }

                  return (
                    <div key={idx} className="flex flex-col gap-0.5">
                      <div className="flex items-center justify-between text-gray-400 font-medium">
                        <span>{goal.label}</span>
                        <span className="text-white font-bold">{goal.percentage}%</span>
                      </div>
                      {/* Meter bar */}
                      <div className="w-full h-2.5 bg-black/35 rounded-full overflow-hidden border border-dark-border/20 flex items-center relative">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-status-blue to-status-green transition-all duration-500"
                          style={{ width: `${goal.percentage}%` }}
                        />
                        {/* Text numbers overlay (inside bar container or right side) */}
                      </div>
                      <div className="flex justify-between text-[8px] text-gray-500 font-mono mt-px">
                        <span>{valStr}</span>
                        <span>Meta: {tarStr}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </section>

          {/* ROW 5: RECENT ACTIVITIES, ALERTS, IA INSIGHTS */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Atividades Recentes List (5/12 wide) */}
            <div className="glass-card p-5 rounded-xl xl:col-span-5 flex flex-col justify-between min-h-[220px]">
              <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
                <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Atividades Recentes</h3>
                <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todas atividades</button>
              </div>

              <div className="flex flex-col gap-2.5 flex-grow">
                {recentActivities.map((act, idx) => {
                  let badgeColor = 'bg-status-blue/15 text-status-blue border-status-blue/30';
                  
                  if (act.status === 'success') {
                    badgeColor = 'bg-status-green/15 text-status-green border-status-green/30';
                  } else if (act.status === 'warning') {
                    badgeColor = 'bg-status-yellow/15 text-status-yellow border-status-yellow/30';
                  } else if (act.status === 'purple') {
                    badgeColor = 'bg-status-purple/15 text-status-purple border-status-purple/30';
                  } else if (act.status === 'orange') {
                    badgeColor = 'bg-status-yellow/15 text-status-yellow border-status-yellow/30'; // fallback
                  }

                  return (
                    <div key={idx} className="flex items-center justify-between text-[10px] border-b border-dark-border/20 pb-2 last:border-0">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="text-gray-500 font-mono font-medium shrink-0 mt-0.5">{act.time}</span>
                        <span className="text-gray-300 font-medium truncate max-w-[210px]">{act.label}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-2 py-0.5 rounded-full border text-[8px] font-bold uppercase tracking-wide ${badgeColor}`}>
                          {act.badge}
                        </span>
                        {act.detail && (
                          <span className="font-mono text-white font-bold">{act.detail}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Alertas Commercial (3/12 wide) */}
            <div className="glass-card p-5 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
                  <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Alertas</h3>
                  <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todos alertas</button>
                </div>

                <div className="flex flex-col gap-2">
                  {alerts.map((alert, idx) => {
                    let containerColor = 'border-status-blue/30 bg-status-blue/5 text-gray-300';
                    let flagColor = 'text-status-blue';
                    let valColor = 'text-status-blue';
                    
                    if (alert.type === 'danger') {
                      containerColor = 'border-status-red/30 bg-status-red/5 text-gray-300';
                      flagColor = 'text-status-red';
                      valColor = 'text-status-red';
                    } else if (alert.type === 'warning') {
                      containerColor = 'border-status-yellow/30 bg-status-yellow/5 text-gray-300';
                      flagColor = 'text-status-yellow';
                      valColor = 'text-status-yellow';
                    }

                    return (
                      <div
                        key={idx}
                        className={`flex items-start justify-between gap-3 p-2 rounded-lg border text-[10px] leading-snug hover:bg-white/5 cursor-pointer transition-colors ${containerColor}`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${flagColor} mt-0.5`} />
                          <span className="font-medium">{alert.text}</span>
                        </div>
                        <span className={`font-bold font-mono shrink-0 ${valColor}`}>{alert.detail}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Insights IA (4/12 wide) */}
            <div className="glass-card p-5 rounded-xl xl:col-span-4 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
                  <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Insights IA</h3>
                  <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver mais insights</button>
                </div>

                <div className="flex flex-col gap-2.5 text-[10px] leading-relaxed">
                  {insights.map((insight, idx) => {
                    let dotColor = 'bg-status-blue';
                    
                    if (insight.type === 'success') {
                      dotColor = 'bg-status-green';
                    } else if (insight.type === 'warning') {
                      dotColor = 'bg-status-yellow';
                    }

                    return (
                      <div key={idx} className="flex items-start gap-2.5">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor} mt-1.5 pulse-dot`}></span>
                        <p className="text-gray-300 font-medium">{insight.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </section>
        </>
      )}

    </div>
  );
};

export default CommercialTab;
