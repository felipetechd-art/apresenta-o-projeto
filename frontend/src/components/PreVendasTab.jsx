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
  Sparkles,
  MessageSquare,
  HelpCircle,
  PlayCircle
} from 'lucide-react';
import FunnelChart from './FunnelChart';

const PreVendasTab = ({ data, formatValue }) => {
  if (!data) return null;

  const {
    kpis,
    funnel,
    generalConversionRate,
    bookingEvolution,
    sdrsPerformance,
    sdrsTotals,
    productivity,
    leadsStatus,
    leadOrigins,
    featuredLeads,
    recentActivities,
    alerts,
    insights,
    recommendation,
    monthlyGoals
  } = data;

  // 1. Mixed line/column chart config: Evolução dos Agendamentos
  const mixedChartOptions = {
    chart: {
      type: 'line',
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false },
      parentHeightOffset: 0
    },
    colors: ['#3b82f6', '#10b981', '#8b5cf6'], // Leads Novos (Blue), Agendamentos (Green), Comparecimento % (Purple)
    stroke: {
      width: [0, 3, 3],
      curve: 'smooth'
    },
    plotOptions: {
      bar: {
        columnWidth: '35%',
        borderRadius: 2
      }
    },
    markers: {
      size: [0, 4, 4],
      colors: ['#3b82f6', '#10b981', '#8b5cf6'],
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
      categories: bookingEvolution.dates,
      labels: { style: { colors: '#94a3b8', fontSize: '9px', fontFamily: 'Inter' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: [
      {
        title: {
          text: 'Quantidade',
          style: { color: '#94a3b8', fontSize: '9px', fontFamily: 'Inter', fontWeight: 500 }
        },
        labels: {
          style: { colors: '#94a3b8', fontSize: '9px', fontFamily: 'Inter' }
        }
      },
      {
        opposite: true,
        title: {
          text: 'Taxa de Show (%)',
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
          if (opt.seriesIndex === 2) return `${val}%`;
          return val;
        }
      }
    },
    annotations: {
      points: [
        {
          x: '15/05',
          y: 76.6,
          yAxisIndex: 1,
          marker: { size: 6, fillColor: '#8b5cf6', strokeColor: '#fff' },
          label: {
            borderColor: '#8b5cf6',
            borderWidth: 1,
            style: { color: '#fff', background: '#8b5cf6', fontSize: '9px', fontWeight: 'bold' },
            text: '76,6%'
          }
        }
      ]
    }
  };

  const mixedChartSeries = [
    { name: 'Leads Novos', type: 'column', data: bookingEvolution.leadsNovos },
    { name: 'Agendamentos', type: 'line', data: bookingEvolution.agendamentos },
    { name: 'Comparecimento %', type: 'line', data: bookingEvolution.comparecimentoRatio }
  ];

  // 2. Lead Origins Donut
  const donutOptions = {
    chart: { type: 'donut' },
    labels: leadOrigins.map(o => o.source),
    colors: leadOrigins.map(o => o.color),
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
              label: 'Leads',
              color: '#94a3b8',
              fontSize: '10px',
              fontFamily: 'Inter',
              formatter: () => '1.250'
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

  const donutSeries = leadOrigins.map(o => o.percentage);

  return (
    <div className="flex flex-col gap-6">
      
      {/* 9 TOP LEVEL KPI CARDS */}
      <section className="grid grid-cols-2 lg:grid-cols-9 gap-3">
        
        {/* KPI 1: Leads Novos */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Leads Novos</span>
            <Users className="w-3.5 h-3.5 text-status-blue" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.leadsNovos.value.toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.leadsNovos.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 2: Contatos Realizados */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Contatos Realizados</span>
            <Phone className="w-3.5 h-3.5 text-status-blue" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.contatosRealizados.value.toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.contatosRealizados.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 3: Taxa de Contato */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Taxa de Contato</span>
            <Percent className="w-3.5 h-3.5 text-status-green" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.taxaContato.value}%
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.taxaContato.change} p.p.</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 4: Respostas */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Respostas</span>
            <MessageSquare className="w-3.5 h-3.5 text-status-purple" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.respostas.value}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.respostas.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 5: Taxa de Resposta */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Taxa de Resposta</span>
            <Percent className="w-3.5 h-3.5 text-status-green" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.taxaResposta.value}%
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.taxaResposta.change} p.p.</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 6: Leads Qualificados */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Leads Qualificados</span>
            <Users className="w-3.5 h-3.5 text-status-green" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.leadsQualificados.value}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.leadsQualificados.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 7: Taxa de Qualificação */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Taxa Qualificação</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-status-green" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.taxaQualificacao.value}%
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.taxaQualificacao.change} p.p.</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 8: Reuniões Agendadas */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Reuniões Agendadas</span>
            <Calendar className="w-3.5 h-3.5 text-status-blue" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.reunioesAgendadas.value}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.reunioesAgendadas.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 9: Comparecimento */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Comparecimento</span>
            <Users className="w-3.5 h-3.5 text-status-blue" />
          </div>
          <div className="my-0.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.comparecimento.value}
            </span>
            <span className="text-[8px] text-gray-500 block font-mono">
              {kpis.comparecimento.showRatio}% Taxa de show
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.comparecimento.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

      </section>

      {/* ROW 2: FUNNEL, BOOKINGS EVOLUTION, SDR TABLE GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Funil de Pré-vendas (3/12 wide, using existing FunnelChart) */}
        <div className="glass-card p-5 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Funil de Pré-vendas</h3>
          </div>
          <div className="flex-grow">
            <FunnelChart data={funnel} generalConversionRate={generalConversionRate} />
          </div>
        </div>

        {/* Evolução dos Agendamentos Chart (5/12 wide) */}
        <div className="glass-card p-5 rounded-xl xl:col-span-5 flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Evolução dos Agendamentos</h3>
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

        {/* Performance dos SDRs Table (4/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-4 flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Performance dos SDRs</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver ranking</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2 px-1">SDR</th>
                  <th className="py-2 text-right">Leads</th>
                  <th className="py-2 text-right">Qualificados</th>
                  <th className="py-2 text-right">Agendados</th>
                  <th className="py-2 text-right">Comparec.</th>
                  <th className="py-2 text-right">Tx. Agenda</th>
                  <th className="py-2 text-right px-1">Tx. Show</th>
                </tr>
              </thead>
              <tbody>
                {sdrsPerformance.map((sdr, idx) => (
                  <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                    {/* SDR Avatar & Name */}
                    <td className="py-2 px-1 flex items-center gap-1.5 font-medium text-white">
                      <div className="w-5 h-5 rounded bg-brand-gold-start/15 text-brand-gold-start flex items-center justify-center font-bold text-[8px] shrink-0 border border-brand-gold-start/20">
                        {sdr.name[0]}
                      </div>
                      <span className="truncate max-w-[65px]">{sdr.name}</span>
                    </td>
                    <td className="py-2 text-right font-mono">{sdr.leads}</td>
                    <td className="py-2 text-right font-mono">{sdr.qual}</td>
                    <td className="py-2 text-right font-mono">{sdr.meetings}</td>
                    <td className="py-2 text-right font-mono">{sdr.attendance}</td>
                    <td className="py-2 text-right font-mono font-bold text-white">{sdr.txAgenda}%</td>
                    <td className="py-2 text-right font-mono px-1 font-bold text-brand-gold-start">{sdr.txShow}%</td>
                  </tr>
                ))}
                <tr className="bg-black/25 font-bold border-t border-dark-border text-white uppercase tracking-wide">
                  <td className="py-2.5 px-1">Total / Média</td>
                  <td className="py-2.5 text-right font-mono">{sdrsTotals.leads}</td>
                  <td className="py-2.5 text-right font-mono">{sdrsTotals.qual}</td>
                  <td className="py-2.5 text-right font-mono">{sdrsTotals.meetings}</td>
                  <td className="py-2.5 text-right font-mono">{sdrsTotals.attendance}</td>
                  <td className="py-2.5 text-right font-mono text-brand-gold-start">{sdrsTotals.txAgenda}%</td>
                  <td className="py-2.5 text-right font-mono px-1 text-brand-gold-start">{sdrsTotals.txShow}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </section>

      {/* ROW 3: 4 MINI KPI WIDGETS, STATUS LEADS METER, ORIGIN DONUT GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 4 Mini Productivity KPI cards (4/12 wide) */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          
          {/* Card 1: Tempo primeiro contato */}
          <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[110px]">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[9px] font-bold uppercase tracking-wider">Tempo 1º Contato</span>
              <Clock className="w-4 h-4 text-status-blue" />
            </div>
            <div className="my-1">
              <span className="text-xl font-heading font-black text-white font-mono block">
                {productivity.firstContactTime.value} min
              </span>
            </div>
            <div className="flex flex-col gap-0.5 text-[8px]">
              <span className="text-status-green font-bold">▼ {Math.abs(productivity.firstContactTime.change)}% vs anterior</span>
              <span className="text-gray-500 font-mono">Meta: &lt;= {productivity.firstContactTime.meta} min</span>
            </div>
          </div>

          {/* Card 2: No Show */}
          <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[110px]">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[9px] font-bold uppercase tracking-wider">No-Show</span>
              <Users className="w-4 h-4 text-status-yellow" />
            </div>
            <div className="my-1">
              <span className="text-xl font-heading font-black text-white font-mono block">
                {productivity.noShow.value}%
              </span>
            </div>
            <div className="flex flex-col gap-0.5 text-[8px]">
              <span className="text-status-green font-bold">▼ {Math.abs(productivity.noShow.change)} p.p. vs anterior</span>
              <span className="text-gray-500 font-mono">Meta: &lt; {productivity.noShow.meta}%</span>
            </div>
          </div>

          {/* Card 3: Leads em Follow-up */}
          <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[110px]">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[9px] font-bold uppercase tracking-wider">Leads em Follow-up</span>
              <MessageSquare className="w-4 h-4 text-status-cyan" />
            </div>
            <div className="my-1.5">
              <span className="text-xl font-heading font-black text-white font-mono block">
                {productivity.leadsFollowUp.value}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[8px] text-status-green font-bold">
              <span>▲ {productivity.leadsFollowUp.change}%</span>
              <span className="text-gray-500 font-medium normal-case">vs anterior</span>
            </div>
          </div>

          {/* Card 4: Tarefas Atrasadas */}
          <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[110px] border-status-red/20">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[9px] font-bold uppercase tracking-wider">Tarefas Atrasadas</span>
              <AlertTriangle className="w-4 h-4 text-status-red" />
            </div>
            <div className="my-1">
              <span className="text-xl font-heading font-black text-status-red font-mono block">
                {productivity.delayedTasks.value}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 text-[8px]">
              <span className="text-status-green font-bold">▼ {Math.abs(productivity.delayedTasks.change)}% vs anterior</span>
              <span className="text-gray-500 font-mono">Meta: {productivity.delayedTasks.meta}</span>
            </div>
          </div>

        </div>

        {/* Status dos Leads no Funil progress list (5/12 wide) */}
        <div className="glass-card p-4 rounded-xl lg:col-span-5 flex flex-col justify-between min-h-[235px]">
          <div className="border-b border-dark-border pb-2.5 mb-2">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Status dos Leads no Funil</h3>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] flex-grow mt-1">
            {leadsStatus.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-0.5 justify-center">
                <div className="flex items-center justify-between text-gray-400 font-medium">
                  <span>{item.stage}</span>
                  <span className="text-white font-bold font-mono">{item.count}</span>
                </div>
                <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden border border-dark-border/20">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, item.percentage)}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Origem dos Leads Donut (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl lg:col-span-3 flex flex-col justify-between min-h-[235px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Origem dos Leads</h3>
          </div>

          <div className="w-full h-[120px] flex items-center justify-center relative select-none">
            <Chart
              options={donutOptions}
              series={donutSeries}
              type="donut"
              height="100%"
              width="100%"
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[9px]">
            {leadOrigins.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="font-medium truncate max-w-[65px]">{item.source} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ROW 4: FEATURED LEADS, RECENT ACTIVITIES, ALERTS GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Leads em Destaque Table (6/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-6 flex flex-col justify-between min-h-[280px]">
          <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Leads em Destaque (Próximas Ações)</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todos</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Lead</th>
                  <th className="py-2">Origem</th>
                  <th className="py-2">Etapa</th>
                  <th className="py-2">Último Contato</th>
                  <th className="py-2">Próxima Ação</th>
                  <th className="py-2">Responsável</th>
                  <th className="py-2 px-1 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {featuredLeads.map((lead, idx) => {
                  let statusBadgeColor = 'bg-status-green/10 text-status-green';
                  if (lead.status === 'Atenção') statusBadgeColor = 'bg-status-yellow/10 text-status-yellow';
                  if (lead.status === 'Atrasado') statusBadgeColor = 'bg-status-red/10 text-status-red';

                  return (
                    <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                      <td className="py-2 font-medium text-white">{lead.name}</td>
                      <td className="py-2 text-gray-400">{lead.source}</td>
                      <td className="py-2 text-gray-400 font-medium">{lead.stage}</td>
                      <td className="py-2 font-mono text-gray-500">{lead.lastContact}</td>
                      
                      {/* Action cell with icon mapping */}
                      <td className="py-2 font-medium text-white flex items-center gap-1 mt-0.5">
                        {lead.actionType === 'phone' ? (
                          <Phone className="w-3 h-3 text-brand-gold-start" />
                        ) : lead.actionType === 'chat' ? (
                          <MessageSquare className="w-3 h-3 text-status-cyan" />
                        ) : (
                          <Calendar className="w-3 h-3 text-status-blue" />
                        )}
                        <span className="truncate max-w-[100px]">{lead.nextAction}</span>
                      </td>

                      <td className="py-2 text-gray-400 font-medium">{lead.responsible}</td>
                      <td className="py-2 px-1 text-right">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${statusBadgeColor}`}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Atividades Recentes SDR (3/12 wide) */}
        <div className="glass-card p-5 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[280px]">
          <div>
            <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
              <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Atividades Recentes</h3>
              <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todas as atividades</button>
            </div>

            <div className="flex flex-col gap-2 flex-grow">
              {recentActivities.map((act, idx) => {
                let badgeColor = 'bg-status-blue/15 text-status-blue border-status-blue/20';
                if (act.status === 'success') badgeColor = 'bg-status-green/15 text-status-green border-status-green/20';
                if (act.status === 'teal') badgeColor = 'bg-status-cyan/15 text-status-cyan border-status-cyan/20';
                if (act.status === 'purple') badgeColor = 'bg-status-purple/15 text-status-purple border-status-purple/20';

                return (
                  <div key={idx} className="flex items-center justify-between text-[10px] border-b border-dark-border/20 pb-2 last:border-0">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="text-gray-500 font-mono font-medium shrink-0 mt-0.5">{act.time}</span>
                      <span className="text-gray-300 font-medium truncate max-w-[120px]">{act.text}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded border text-[8px] font-bold shrink-0 ${badgeColor}`}>
                      {act.badge}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alertas SDR (3/12 wide) */}
        <div className="glass-card p-5 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[280px]">
          <div>
            <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
              <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Alertas</h3>
              <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todos</button>
            </div>

            <div className="flex flex-col gap-2">
              {alerts.map((alert, idx) => {
                let alertClass = 'border-status-blue/30 bg-status-blue/5 text-gray-300';
                let iconColor = 'text-status-blue';
                if (idx === 0 || idx === 2) {
                  alertClass = 'border-status-red/30 bg-status-red/5 text-gray-300';
                  iconColor = 'text-status-red';
                } else if (idx === 1) {
                  alertClass = 'border-status-yellow/30 bg-status-yellow/5 text-gray-300';
                  iconColor = 'text-status-yellow';
                }

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border text-[10px] leading-snug hover:bg-white/5 cursor-pointer transition-colors ${alertClass}`}
                  >
                    <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${iconColor} mt-0.5`} />
                    <span className="font-medium">{alert.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </section>

      {/* ROW 5: AI INSIGHTS, RECOMMENDATION CARD, MONTHLY GOALS GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* IA Insights (6/12 wide) */}
        <div className="glass-card p-5 rounded-xl xl:col-span-6 flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="border-b border-dark-border pb-2.5 mb-2.5">
              <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-brand-gold-start" />
                Insights da IA
              </h3>
            </div>

            <div className="flex flex-col gap-2.5 text-[10px] leading-relaxed">
              {insights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-status-green mt-1.5 pulse-dot"></span>
                  <p className="text-gray-300 font-medium">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendation Card (3/12 wide, styled blue overlay) */}
        <div className="bg-gradient-to-br from-status-blue/20 to-[#0c182d] border border-status-blue/35 p-5 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[200px] hover:border-status-blue/50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-status-blue shrink-0 animate-pulse" />
            <span className="text-[10px] text-status-blue font-bold uppercase tracking-wider">{recommendation.title}</span>
          </div>
          
          <div className="my-3">
            <p className="text-xs font-semibold text-white leading-relaxed group-hover:text-brand-gold-start transition-colors">
              {recommendation.text}
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] text-status-blue font-bold border-t border-status-blue/20 pt-3">
            <span>Ativar automação</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Metas do Mês - Pré-vendas (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[200px]">
          <div className="border-b border-dark-border pb-2.5 mb-2 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Metas do Mês - Pré-vendas</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Editar metas</button>
          </div>

          <div className="flex-grow flex flex-col justify-around gap-1.5 text-[10px]">
            {monthlyGoals.map((goal, idx) => {
              let currentVal = goal.current;
              let targetVal = goal.target;
              if (goal.isPercent) {
                currentVal = `${goal.current}%`;
                targetVal = `${goal.target}%`;
              }

              return (
                <div key={idx} className="flex flex-col gap-0.5">
                  <div className="flex items-center justify-between text-gray-400 font-medium">
                    <span>{goal.label}</span>
                    <span className="text-white font-bold">{goal.percentage}%</span>
                  </div>
                  {/* Progress bar container */}
                  <div className="w-full h-2 bg-black/35 rounded-full overflow-hidden border border-dark-border/20">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-status-blue to-status-green transition-all duration-500"
                      style={{ width: `${goal.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[8px] text-gray-500 font-mono mt-px">
                    <span>{currentVal}</span>
                    <span>Meta: {targetVal}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>

    </div>
  );
};

export default PreVendasTab;
