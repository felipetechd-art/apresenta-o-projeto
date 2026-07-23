import React from 'react';
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
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Phone,
  FileText,
  Layers,
  ArrowRight,
  Info,
  ChevronDown,
  Sparkles,
  BarChart2,
  Download,
  Eye,
  ShieldCheck,
  TrendingUp as ROI
} from 'lucide-react';
import FunnelChart from './FunnelChart';

const MarketingTab = ({ data, formatValue }) => {
  if (!data) return null;

  const {
    kpis,
    dailyInvestmentVsRevenue,
    performanceByChannel,
    performanceByChannelTotals,
    creativesPerformance,
    campaignsPerformance,
    icpPerformance,
    marketingFunnel,
    marketingGeneralConversionRate,
    organicContent,
    socialSelling,
    contentSchedule,
    insights,
    alerts
  } = data;

  // 1. Mixed line/column chart config: Investimento x Receita (Diário)
  const mixedChartOptions = {
    chart: {
      type: 'line',
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false },
      parentHeightOffset: 0
    },
    colors: ['#10b981', '#3b82f6', '#8b5cf6', '#475569'], // Invest (Green), Receita (Blue), ROI (Purple), Meta (Grey)
    stroke: {
      width: [3, 0, 3, 1.5],
      dashArray: [0, 0, 0, 5],
      curve: 'smooth'
    },
    plotOptions: {
      bar: {
        columnWidth: '35%',
        borderRadius: 2
      }
    },
    markers: {
      size: [4, 0, 4, 0],
      colors: ['#10b981', '#3b82f6', '#8b5cf6'],
      strokeWidth: 2,
      strokeColors: '#060b13',
      hover: { size: 6 }
    },
    grid: {
      borderColor: 'rgba(27, 42, 63, 0.3)',
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    xaxis: {
      categories: dailyInvestmentVsRevenue.dates,
      labels: { style: { colors: '#94a3b8', fontSize: '9px', fontFamily: 'Inter' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: [
      {
        title: {
          text: 'Investimento & Receita (R$)',
          style: { color: '#94a3b8', fontSize: '9px', fontFamily: 'Inter', fontWeight: 500 }
        },
        labels: {
          style: { colors: '#94a3b8', fontSize: '9px', fontFamily: 'Inter' },
          formatter: (val) => val >= 1000 ? `R$ ${(val / 1000).toFixed(0)}K` : `R$ ${val}`
        }
      },
      {
        opposite: true,
        title: {
          text: 'ROI (%)',
          style: { color: '#8b5cf6', fontSize: '9px', fontFamily: 'Inter', fontWeight: 500 }
        },
        labels: {
          style: { colors: '#94a3b8', fontSize: '9px', fontFamily: 'Inter' },
          formatter: (val) => `${val}%`
        }
      }
    ],
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      offsetY: -5,
      labels: { colors: '#f3f4f6', fontFamily: 'Inter' },
      markers: { radius: 12 }
    },
    tooltip: {
      theme: 'dark',
      shared: true,
      intersect: false,
      y: {
        formatter: (val, opt) => {
          if (opt.seriesIndex === 2 || opt.seriesIndex === 3) return `${val}%`;
          return val ? `R$ ${val.toLocaleString('pt-BR')}` : 'N/A';
        }
      }
    }
  };

  const mixedChartSeries = [
    { name: 'Investimento', type: 'line', data: dailyInvestmentVsRevenue.investment },
    { name: 'Receita Gerada', type: 'column', data: dailyInvestmentVsRevenue.revenue },
    { name: 'ROI (%)', type: 'line', data: dailyInvestmentVsRevenue.roi },
    { name: 'Meta ROI (300%)', type: 'line', data: Array(8).fill(300) }
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* EXPORT BUTTON FLOATER */}
      <div className="flex justify-end -mb-4 -mt-2">
        <button className="flex items-center gap-1.5 bg-dark-card border border-dark-border text-gray-300 hover:text-white py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors active:scale-95">
          <Download className="w-3.5 h-3.5 text-brand-gold-start" />
          Exportar relatório
        </button>
      </div>

      {/* 8 TOP LEVEL KPI CARDS */}
      <section className="grid grid-cols-2 lg:grid-cols-8 gap-3.5">
        
        {/* KPI 1: Investimento Total */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Investimento Total</span>
            <Briefcase className="w-3.5 h-3.5 text-status-blue" />
          </div>
          <div className="my-1">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {formatValue(kpis.investimentoTotal.value, 'currency')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.investimentoTotal.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 2: Leads Gerados */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Leads Gerados</span>
            <Users className="w-3.5 h-3.5 text-status-blue" />
          </div>
          <div className="my-1">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.leadsGerados.value}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.leadsGerados.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 3: Leads Qualificados */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Leads Qualificados</span>
            <ShieldCheck className="w-3.5 h-3.5 text-status-green" />
          </div>
          <div className="my-0.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.leadsQualificados.value}
            </span>
            <span className="text-[8px] text-gray-500 block font-mono">
              {kpis.leadsQualificados.totalLeadRatio}% do total de leads
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.leadsQualificados.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 4: CPL */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">CPL</span>
            <DollarSign className="w-3.5 h-3.5 text-status-yellow" />
          </div>
          <div className="my-1">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {formatValue(kpis.cpl.value, 'currency-full')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▼ {Math.abs(kpis.cpl.change)}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 5: CPLQ */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">CPLQ</span>
            <Users className="w-3.5 h-3.5 text-status-purple" />
          </div>
          <div className="my-1">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {formatValue(kpis.cplq.value, 'currency-full')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▼ {Math.abs(kpis.cplq.change)}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 6: Custo Reunião Comparecida */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Custo p/ Reunião</span>
          </div>
          <div className="my-1">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {formatValue(kpis.custoReuniaoComparecida.value, 'currency-full')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▼ {Math.abs(kpis.custoReuniaoComparecida.change)}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 7: CAC */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">CAC</span>
            <Users className="w-3.5 h-3.5 text-status-cyan" />
          </div>
          <div className="my-1">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {formatValue(kpis.cac.value, 'currency-full')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▼ {Math.abs(kpis.cac.change)}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 8: ROI Marketing */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">ROI Marketing</span>
            <Activity className="w-3.5 h-3.5 text-status-green" />
          </div>
          <div className="my-1">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.roiMarketing.value}%
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.roiMarketing.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

      </section>

      {/* ROW 2: DAILY MIXED CHART, CHANNEL TABLE, CREATIVES TABLE GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Investimento x Receita Diário Chart (5/12 wide) */}
        <div className="glass-card p-5 rounded-xl xl:col-span-5 flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Investimento x Receita (Diário)</h3>
          </div>
          <div className="flex-grow flex items-center select-none">
            <div className="w-full h-[250px]">
              <Chart
                options={mixedChartOptions}
                series={mixedChartSeries}
                type="line"
                height="100%"
                width="100%"
              />
            </div>
          </div>
        </div>

        {/* Performance Por Canal Table (4/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-4 flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-dark-border pb-2.5 mb-3">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Performance por Canal</h3>
          </div>
          
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Canal</th>
                  <th className="py-2 text-right">Invest.</th>
                  <th className="py-2 text-right">Leads</th>
                  <th className="py-2 text-right">Qual.</th>
                  <th className="py-2 text-right">Reun.</th>
                  <th className="py-2 text-right">Vend.</th>
                  <th className="py-2 text-right">Receita</th>
                  <th className="py-2 text-right px-1">ROI</th>
                </tr>
              </thead>
              <tbody>
                {performanceByChannel.map((ch, idx) => (
                  <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                    <td className="py-2 font-medium text-white max-w-[80px] truncate">{ch.channel}</td>
                    <td className="py-2 text-right font-mono">{ch.investment > 0 ? formatValue(ch.investment, 'currency') : 'R$ 0'}</td>
                    <td className="py-2 text-right font-mono">{ch.leads}</td>
                    <td className="py-2 text-right font-mono">{ch.qual}</td>
                    <td className="py-2 text-right font-mono">{ch.meetings}</td>
                    <td className="py-2 text-right font-mono">{ch.sales}</td>
                    <td className="py-2 text-right font-mono font-semibold text-white">{formatValue(ch.revenue, 'currency')}</td>
                    <td className="py-2 text-right font-mono px-1 font-bold text-brand-gold-start">
                      {ch.roi ? `${ch.roi.toLocaleString('pt-BR')}%` : '—'}
                    </td>
                  </tr>
                ))}
                <tr className="bg-black/25 font-bold border-t border-dark-border text-white uppercase tracking-wide">
                  <td className="py-2.5">Total</td>
                  <td className="py-2.5 text-right font-mono text-brand-gold-start">{formatValue(performanceByChannelTotals.investment, 'currency')}</td>
                  <td className="py-2.5 text-right font-mono">{performanceByChannelTotals.leads}</td>
                  <td className="py-2.5 text-right font-mono">{performanceByChannelTotals.qual}</td>
                  <td className="py-2.5 text-right font-mono">{performanceByChannelTotals.meetings}</td>
                  <td className="py-2.5 text-right font-mono">{performanceByChannelTotals.sales}</td>
                  <td className="py-2.5 text-right font-mono text-brand-gold-start">{formatValue(performanceByChannelTotals.revenue, 'currency')}</td>
                  <td className="py-2.5 text-right font-mono px-1 text-brand-gold-start">{performanceByChannelTotals.roi}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Dos Criativos Table (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Performance dos Criativos</h3>
            <button className="text-[9px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todos criativos</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Criativo</th>
                  <th className="py-2 text-right">Impressões</th>
                  <th className="py-2 text-right">CTR</th>
                  <th className="py-2 text-right">Leads</th>
                  <th className="py-2 text-right">Qual.</th>
                  <th className="py-2 text-right">Reun.</th>
                  <th className="py-2 text-right">Vend.</th>
                  <th className="py-2 text-right px-1">Receita</th>
                </tr>
              </thead>
              <tbody>
                {creativesPerformance.map((cr, idx) => (
                  <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                    {/* Creative Avatar / Icon */}
                    <td className="py-2 flex items-center gap-1.5 font-medium text-white">
                      <div className="w-5 h-5 rounded bg-[#10b981]/15 text-[#10b981] flex items-center justify-center font-bold text-[8px] shrink-0 border border-[#10b981]/25">
                        {cr.id.split(' ')[1]}
                      </div>
                      <span className="truncate max-w-[60px]">{cr.id}</span>
                    </td>
                    <td className="py-2 text-right font-mono">{cr.impressions.toLocaleString('pt-BR')}</td>
                    <td className="py-2 text-right font-mono">{cr.ctr !== undefined && cr.ctr !== null ? `${cr.ctr.toLocaleString('pt-BR')}%` : '—'}</td>
                    <td className="py-2 text-right font-mono">{cr.leads}</td>
                    <td className="py-2 text-right font-mono">{cr.qual}</td>
                    <td className="py-2 text-right font-mono">{cr.meetings}</td>
                    <td className="py-2 text-right font-mono">{cr.sales}</td>
                    <td className="py-2 text-right font-mono px-1 font-bold text-white">{formatValue(cr.revenue, 'currency')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </section>

      {/* ROW 3: CAMPAIGNS, ICP, VERTICAL MARKETING FUNNEL GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Campaigns Performance Table (5/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-5 flex flex-col justify-between min-h-[300px]">
          <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Performance das Campanhas</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todas as campanhas</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Campanha</th>
                  <th className="py-2">Objetivo</th>
                  <th className="py-2">Público</th>
                  <th className="py-2 text-right">Invest.</th>
                  <th className="py-2 text-right">Leads</th>
                  <th className="py-2 text-right">CPLQ</th>
                  <th className="py-2 text-right">Reun.</th>
                  <th className="py-2 text-right">Vend.</th>
                  <th className="py-2 text-right">ROI</th>
                  <th className="py-2 text-right px-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaignsPerformance.map((cam, idx) => (
                  <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                    <td className="py-2 font-medium text-white truncate max-w-[85px]">{cam.name}</td>
                    <td className="py-2 text-gray-400 font-medium">{cam.goal}</td>
                    <td className="py-2 text-gray-400 font-medium">{cam.targetPublic}</td>
                    <td className="py-2 text-right font-mono">{formatValue(cam.investment, 'currency')}</td>
                    <td className="py-2 text-right font-mono">{cam.leads}</td>
                    <td className="py-2 text-right font-mono">{formatValue(cam.cplq, 'currency')}</td>
                    <td className="py-2 text-right font-mono">{cam.meetings}</td>
                    <td className="py-2 text-right font-mono">{cam.sales}</td>
                    <td className="py-2 text-right font-mono font-bold text-white">{cam.roi}%</td>
                    <td className="py-2 text-right px-1">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                        cam.status === 'Ativa'
                          ? 'bg-status-green/10 text-status-green'
                          : 'bg-status-yellow/10 text-status-yellow'
                      }`}>
                        {cam.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ICP Performance Table (4/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-4 flex flex-col justify-between min-h-[300px]">
          <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Público (ICP)</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver análise completa de públicos</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Público</th>
                  <th className="py-2 text-right">Leads</th>
                  <th className="py-2 text-right">CPL</th>
                  <th className="py-2 text-right">CPLQ</th>
                  <th className="py-2 text-right">Custo Reunião</th>
                  <th className="py-2 text-right">Conversão Venda</th>
                  <th className="py-2 text-right px-1">Ticket Médio</th>
                </tr>
              </thead>
              <tbody>
                {icpPerformance.map((icp, idx) => (
                  <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                    <td className="py-2 font-medium text-white truncate max-w-[80px]">{icp.publicGroup}</td>
                    <td className="py-2 text-right font-mono">{icp.leads}</td>
                    <td className="py-2 text-right font-mono">{formatValue(icp.cpl, 'currency')}</td>
                    <td className="py-2 text-right font-mono">{formatValue(icp.cplq, 'currency')}</td>
                    <td className="py-2 text-right font-mono">{formatValue(icp.meetingCost, 'currency')}</td>
                    <td className="py-2 text-right font-mono font-bold text-white">{icp.saleRatio}%</td>
                    <td className="py-2 text-right font-mono px-1 font-semibold text-brand-gold-start">{formatValue(icp.ticket, 'currency')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Funil de Marketing Geral (3/12 wide, using existing FunnelChart component) */}
        <div className="glass-card p-5 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[300px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Funil de Marketing (Geral)</h3>
          </div>
          <div className="flex-grow">
            <FunnelChart data={marketingFunnel} generalConversionRate={marketingGeneralConversionRate} />
          </div>
        </div>

      </section>

      {/* ROW 4: ORGANIC CONTENT, SOCIAL SELLING, CONTENT SCHEDULE GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Organic Content Table (5/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-5 flex flex-col justify-between min-h-[290px]">
          <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Conteúdo Orgânico</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todos os conteúdos</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Conteúdo</th>
                  <th className="py-2">Plataforma</th>
                  <th className="py-2 text-right">Visualizações</th>
                  <th className="py-2 text-right">Leads</th>
                  <th className="py-2 text-right">Reuniões</th>
                  <th className="py-2 text-right">Vendas</th>
                  <th className="py-2 text-right px-1">Receita</th>
                </tr>
              </thead>
              <tbody>
                {organicContent.map((item, idx) => (
                  <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                    <td className="py-2 font-medium text-white truncate max-w-[140px]" title={item.title}>
                      {item.title}
                    </td>
                    <td className="py-2 text-gray-400 font-medium">{item.platform}</td>
                    <td className="py-2 text-right font-mono">{item.views.toLocaleString('pt-BR')}</td>
                    <td className="py-2 text-right font-mono">{item.leads}</td>
                    <td className="py-2 text-right font-mono">{item.meetings}</td>
                    <td className="py-2 text-right font-mono">{item.sales}</td>
                    <td className="py-2 text-right font-mono px-1 font-semibold text-white">{formatValue(item.revenue, 'currency')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Social Selling Table (4/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-4 flex flex-col justify-between min-h-[290px]">
          <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Social Selling</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver relatório completo</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Vendedor</th>
                  <th className="py-2 text-right">Pessoas Abordadas</th>
                  <th className="py-2 text-right">Respostas</th>
                  <th className="py-2 text-right">Conversas</th>
                  <th className="py-2 text-right">Diagnósticos</th>
                  <th className="py-2 text-right">Reuniões</th>
                  <th className="py-2 text-right px-1">Vendas</th>
                </tr>
              </thead>
              <tbody>
                {socialSelling.map((seller, idx) => (
                  <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                    <td className="py-2 font-medium text-white truncate max-w-[80px]">{seller.seller}</td>
                    <td className="py-2 text-right font-mono">{seller.contacts}</td>
                    <td className="py-2 text-right font-mono">{seller.responses}</td>
                    <td className="py-2 text-right font-mono">{seller.conversations}</td>
                    <td className="py-2 text-right font-mono">{seller.diagnostics}</td>
                    <td className="py-2 text-right font-mono">{seller.meetings}</td>
                    <td className="py-2 text-right font-mono px-1 font-semibold text-white">{seller.sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content Agenda Schedule Grid (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[290px]">
          <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Agenda de Conteúdo</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver calendário completo</button>
          </div>

          <div className="flex flex-col gap-2 flex-grow justify-between">
            {contentSchedule.map((item, idx) => {
              let badgeColor = 'bg-gray-500/10 text-gray-400 border-gray-500/20';
              if (item.color === 'green') badgeColor = 'bg-status-green/10 text-status-green border-status-green/20';
              if (item.color === 'yellow') badgeColor = 'bg-status-yellow/10 text-status-yellow border-status-yellow/20';
              if (item.color === 'teal') badgeColor = 'bg-status-cyan/10 text-status-cyan border-status-cyan/20';
              if (item.color === 'blue') badgeColor = 'bg-status-blue/10 text-status-blue border-status-blue/20';
              if (item.color === 'red') badgeColor = 'bg-status-red/10 text-status-red border-status-red/20';

              return (
                <div key={idx} className="flex items-center justify-between bg-black/15 p-1.5 px-2.5 rounded-lg border border-dark-border/40 text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-400 font-bold shrink-0">{item.day}</span>
                    <span className="text-white font-bold font-mono bg-white/5 w-5 h-5 rounded-full flex items-center justify-center border border-dark-border/60 shrink-0">
                      {item.count}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded border text-[8px] font-bold uppercase tracking-wider ${badgeColor}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* ROW 5: AI INSIGHTS & ALERTS GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* AI Insights List (8/12 wide) */}
        <div className="glass-card p-5 rounded-xl xl:col-span-8 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
              <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-brand-gold-start" />
                Insights IA
              </h3>
              <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todos os insights gerados pela IA</button>
            </div>

            <div className="flex flex-col gap-2.5 text-[10px] leading-relaxed">
              {insights.map((insight, idx) => {
                let dotColor = 'bg-status-blue';
                if (insight.type === 'success') dotColor = 'bg-status-green';
                if (insight.type === 'warning') dotColor = 'bg-status-yellow';
                if (insight.type === 'danger') dotColor = 'bg-status-red';

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

        {/* Alertas Marketing (4/12 wide) */}
        <div className="glass-card p-5 rounded-xl xl:col-span-4 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
              <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Alertas</h3>
              <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todas as alertas</button>
            </div>

            <div className="flex flex-col gap-2">
              {alerts.map((alert, idx) => {
                let containerColor = 'border-status-blue/30 bg-status-blue/5 text-gray-300';
                let flagColor = 'text-status-blue';
                
                if (alert.type === 'danger') {
                  containerColor = 'border-status-red/30 bg-status-red/5 text-gray-300';
                  flagColor = 'text-status-red';
                } else if (alert.type === 'warning') {
                  containerColor = 'border-status-yellow/30 bg-status-yellow/5 text-gray-300';
                  flagColor = 'text-status-yellow';
                }

                return (
                  <div
                    key={idx}
                    className={`flex flex-col gap-1 p-2 rounded-lg border text-[10px] hover:bg-white/5 cursor-pointer transition-colors ${containerColor}`}
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${flagColor} mt-0.5`} />
                      <span className="font-semibold text-white">{alert.text}</span>
                    </div>
                    {(alert.goal || alert.current) && (
                      <div className="flex justify-between text-[8px] text-gray-500 font-mono pl-[18px]">
                        <span>{alert.goal}</span>
                        <span className="font-bold text-white">{alert.current}</span>
                      </div>
                    )}
                    {alert.action && (
                      <span className="text-[8px] text-brand-gold-start hover:underline font-bold pl-[18px] block">
                        {alert.action}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};

export default MarketingTab;
