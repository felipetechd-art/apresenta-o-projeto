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
  Play,
  PlayCircle,
  Video,
  Star,
  MessageSquare
} from 'lucide-react';
import FunnelChart from './FunnelChart';

const CloserTab = ({ data, formatValue }) => {
  if (!data) return null;

  const {
    kpis,
    agenda,
    propostas,
    followUps,
    funnel,
    generalConversionRate,
    objections,
    receitaPessoal,
    ranking,
    callsGravadas,
    analiseIA,
    checklist,
    proximasOportunidades
  } = data;

  // 1. Donut chart: Objeções frequentes
  const donutOptions = {
    chart: { type: 'donut' },
    labels: objections.map(o => o.reason),
    colors: objections.map(o => o.color),
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
              label: 'Objeções',
              color: '#94a3b8',
              fontSize: '10px',
              fontFamily: 'Inter',
              formatter: () => '128'
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

  const donutSeries = objections.map(o => o.percentage);

  // 2. Radial bar: Meta pessoal
  const radialOptions = {
    chart: { type: 'radialBar', sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        hollow: { size: '60%' },
        dataLabels: {
          name: { show: false },
          value: { offsetY: 5, fontSize: '15px', color: '#fff', fontWeight: 'bold', fontFamily: 'Outfit', formatter: (val) => `${val}%` }
        },
        track: { background: '#111b27' }
      }
    },
    colors: ['#10b981'],
    stroke: { lineCap: 'round' }
  };

  // 3. Radial bar: Score da reunião IA
  const scoreRadialOptions = {
    chart: { type: 'radialBar', sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        startAngle: -120,
        endAngle: 120,
        hollow: { size: '65%' },
        dataLabels: {
          name: { show: false },
          value: { offsetY: 4, fontSize: '16px', color: '#fff', fontWeight: 'bold', fontFamily: 'Outfit', formatter: (val) => `${val}/100` }
        },
        track: { background: '#111b27' }
      }
    },
    colors: ['#10b981'],
    stroke: { lineCap: 'round' }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 8 TOP LEVEL KPI CARDS */}
      <section className="grid grid-cols-2 lg:grid-cols-8 gap-3.5">
        
        {/* KPI 1: Reuniões Hoje */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Reuniões Hoje</span>
            <Calendar className="w-3.5 h-3.5 text-status-blue" />
          </div>
          <div className="my-0.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.reunioesHoje.value}
            </span>
            <span className="text-[8px] text-gray-500 block font-mono">
              Meta: {kpis.reunioesHoje.target}
            </span>
          </div>
          <div className="w-full">
            <div className="w-full h-1 bg-black/35 rounded-full overflow-hidden border border-dark-border/20">
              <div className="h-full bg-status-blue rounded-full" style={{ width: `${kpis.reunioesHoje.percentage}%` }} />
            </div>
            <div className="flex justify-end text-[7px] text-gray-500 font-mono mt-0.5">
              <span>{kpis.reunioesHoje.percentage}%</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Comparecimento */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Comparecimento</span>
            <Users className="w-3.5 h-3.5 text-status-green" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.comparecimento.value}%
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.comparecimento.change} p.p.</span>
            <span className="text-gray-500 font-medium normal-case">vs ontem</span>
          </div>
        </div>

        {/* KPI 3: Propostas Abertas */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Propostas Abertas</span>
            <FileText className="w-3.5 h-3.5 text-status-orange" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.propostasAbertas.value}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.propostasAbertas.change}</span>
            <span className="text-gray-500 font-medium normal-case">vs ontem</span>
          </div>
        </div>

        {/* KPI 4: Vendas do Mês */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Vendas do Mês</span>
            <DollarSign className="w-3.5 h-3.5 text-status-green" />
          </div>
          <div className="my-0.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.vendasMes.value}
            </span>
            <span className="text-[8px] text-gray-500 block font-mono">
              Meta: {kpis.vendasMes.target}
            </span>
          </div>
          <div className="w-full">
            <div className="w-full h-1 bg-black/35 rounded-full overflow-hidden border border-dark-border/20">
              <div className="h-full bg-status-green rounded-full" style={{ width: `${kpis.vendasMes.percentage}%` }} />
            </div>
            <div className="flex justify-end text-[7px] text-gray-500 font-mono mt-0.5">
              <span>{kpis.vendasMes.percentage}%</span>
            </div>
          </div>
        </div>

        {/* KPI 5: Conversão */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Conversão</span>
            <Target className="w-3.5 h-3.5 text-status-purple" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.conversao.value}%
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.conversao.change} p.p.</span>
            <span className="text-gray-500 font-medium normal-case">vs mês passado</span>
          </div>
        </div>

        {/* KPI 6: Ticket Médio */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Ticket Médio</span>
            <Briefcase className="w-3.5 h-3.5 text-status-orange" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {formatValue(kpis.ticketMedio.value, 'currency')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.ticketMedio.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs mês passado</span>
          </div>
        </div>

        {/* KPI 7: Entrada Média */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Entrada Média</span>
            <Layers className="w-3.5 h-3.5 text-status-cyan" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {formatValue(kpis.entradaMedia.value, 'currency')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.entradaMedia.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs mês passado</span>
          </div>
        </div>

        {/* KPI 8: Receita Fechada */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Receita Fechada</span>
            <Activity className="w-3.5 h-3.5 text-status-green" />
          </div>
          <div className="my-0.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {formatValue(kpis.receitaFechada.value, 'currency')}
            </span>
            <span className="text-[8px] text-gray-500 block font-mono">
              Meta: {formatValue(kpis.receitaFechada.target, 'currency')}
            </span>
          </div>
          <div className="w-full">
            <div className="w-full h-1 bg-black/35 rounded-full overflow-hidden border border-dark-border/20">
              <div className="h-full bg-status-blue rounded-full animate-pulse" style={{ width: `${kpis.receitaFechada.percentage}%` }} />
            </div>
            <div className="flex justify-end text-[7px] text-gray-500 font-mono mt-0.5">
              <span>{kpis.receitaFechada.percentage}%</span>
            </div>
          </div>
        </div>

      </section>

      {/* ROW 2: MINHA AGENDA, PROPOSTAS EM ANDAMENTO, FOLLOW-UP GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Minha Agenda (4/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-4 flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Minha Agenda</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver calendário</button>
          </div>

          <div className="flex flex-col gap-2 flex-grow overflow-y-auto pr-1">
            {agenda.map((slot, idx) => {
              let circleColor = 'bg-status-blue text-status-blue border-status-blue/20';
              if (slot.type === 'warning') circleColor = 'bg-status-yellow text-status-yellow border-status-yellow/20';
              if (slot.type === 'danger') circleColor = 'bg-status-red text-status-red border-status-red/20';

              return (
                <div key={idx} className="flex items-center justify-between bg-black/20 p-2 px-3 rounded-lg border border-dark-border/40 text-[10px]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-gray-400 font-bold shrink-0">{slot.time}</span>
                    <div className="flex flex-col">
                      <span className="text-white font-bold">{slot.company}</span>
                      <span className="text-[8px] text-gray-500 mt-0.5">{slot.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Stars visual */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: slot.stars }).map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 text-brand-gold-start fill-brand-gold-start" />
                      ))}
                    </div>
                    {/* Value */}
                    <span className="font-mono text-white font-bold shrink-0">{formatValue(slot.value, 'currency')}</span>
                    {/* Action Icon */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 bg-white/5`}>
                      {slot.type === 'video' ? (
                        <Video className="w-3.5 h-3.5 text-status-blue" />
                      ) : (
                        <span className={`w-1.5 h-1.5 rounded-full ${slot.type === 'warning' ? 'bg-status-yellow' : 'bg-status-red'}`} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Propostas Em Andamento (5/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-5 flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Propostas em Andamento</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todas</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Empresa</th>
                  <th className="py-2 text-right">Valor</th>
                  <th className="py-2 text-right">Entrada</th>
                  <th className="py-2 text-right">Último Contato</th>
                  <th className="py-2 text-right">Próxima Ação</th>
                  <th className="py-2 text-right px-1">Prob.</th>
                </tr>
              </thead>
              <tbody>
                {propostas.map((prop, idx) => (
                  <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                    <td className="py-2 font-medium text-white">{prop.company}</td>
                    <td className="py-2 text-right font-mono">{formatValue(prop.value, 'currency')}</td>
                    <td className="py-2 text-right font-mono">{formatValue(prop.entry, 'currency')}</td>
                    <td className="py-2 text-right font-mono text-gray-500">{prop.lastContact}</td>
                    <td className="py-2 text-right text-status-green font-medium">{prop.nextAction}</td>
                    <td className={`py-2 text-right font-mono px-1 font-bold ${
                      prop.prob >= 70 ? 'text-status-green' : 'text-status-yellow'
                    }`}>
                      {prop.prob}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Follow-up Inteligente (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Follow-up Inteligente</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todos</button>
          </div>

          <div className="flex flex-col gap-2 flex-grow justify-between">
            {followUps.map((item, idx) => (
              <div key={idx} className="bg-black/20 p-2.5 rounded-lg border border-dark-border/40 flex items-center justify-between gap-3 text-[10px] hover:bg-white/5 cursor-pointer transition-all">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className={`text-[8px] font-bold uppercase tracking-wider block ${
                    idx === 1 ? 'text-status-yellow' : 'text-status-red'
                  }`}>
                    {item.label}
                  </span>
                  <span className="text-white font-bold truncate block">{item.company}</span>
                  <span className="text-gray-500 leading-tight block text-[9px] line-clamp-2">{item.detail}</span>
                  <span className="text-[8px] font-bold text-brand-gold-start mt-0.5">Probabilidade: {item.prob}%</span>
                </div>
                
                {/* Channel Action Button */}
                <div className="w-7 h-7 rounded bg-[#10b981]/15 text-[#10b981] flex items-center justify-center shrink-0 border border-[#10b981]/25 hover:bg-[#10b981]/25 transition-colors">
                  {item.type === 'phone' ? (
                    <Phone className="w-3.5 h-3.5" />
                  ) : (
                    <MessageSquare className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ROW 3: MINHAS CONVERSÕES, OBJEÇÕES, COMISSÃO, RANKING GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Minhas Conversões Funnel (3/12 wide) */}
        <div className="glass-card p-5 rounded-xl lg:col-span-3 flex flex-col justify-between min-h-[250px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Minhas Conversões</h3>
          </div>
          <div className="flex-grow">
            <FunnelChart data={funnel} generalConversionRate={generalConversionRate} />
          </div>
        </div>

        {/* Objeções Mais Frequentes Donut (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl lg:col-span-3 flex flex-col justify-between min-h-[250px]">
          <div className="border-b border-dark-border pb-2.5 mb-2 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Objeções Mais Frequentes</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todas</button>
          </div>

          <div className="w-full h-[120px] flex items-center justify-center relative select-none">
            <Chart options={donutOptions} series={donutSeries} type="donut" height="100%" width="100%" />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-2.5 gap-y-1 mt-2 text-[8px] leading-tight">
            {objections.slice(0, 5).map((item, idx) => (
              <div key={idx} className="flex items-center gap-1 text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="font-medium truncate max-w-[70px]">{item.reason} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Receita Pessoal Comissões Gauge (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl lg:col-span-3 flex flex-col justify-between min-h-[250px]">
          <div className="border-b border-dark-border pb-2.5 mb-2 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Receita Pessoal</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver metas</button>
          </div>

          <div className="flex items-center justify-between gap-2 flex-grow">
            <div className="w-[85px] h-[85px] shrink-0 relative overflow-hidden select-none">
              <Chart options={radialOptions} series={[receitaPessoal.percentage]} type="radialBar" height="100%" width="100%" />
            </div>
            
            <div className="flex-grow flex flex-col gap-1.5 text-[9px] pl-2 border-l border-dark-border/40">
              <div>
                <span className="text-gray-500 font-medium">Meta do mês</span>
                <span className="text-white font-bold block font-mono">{formatValue(receitaPessoal.target, 'currency-full')}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Realizado</span>
                <span className="text-status-green font-bold block font-mono">{formatValue(receitaPessoal.current, 'currency-full')}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Faltam</span>
                <span className="text-gray-400 font-bold block font-mono">{formatValue(receitaPessoal.remaining, 'currency-full')}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-dark-border/50 pt-2.5 mt-2 flex items-center justify-between text-[10px]">
            <span className="text-gray-400 font-medium">Comissão prevista:</span>
            <span className="text-brand-gold-start font-bold font-mono">{formatValue(receitaPessoal.commission, 'currency-full')}</span>
          </div>
        </div>

        {/* Ranking de Closers (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl lg:col-span-3 flex flex-col justify-between min-h-[250px]">
          <div className="border-b border-dark-border pb-2.5 mb-2 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Ranking de Closers</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver ranking</button>
          </div>

          <div className="flex flex-col gap-2 flex-grow justify-between">
            {ranking.map((closer, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between text-[9px] p-1.5 px-2 rounded-lg transition-colors border ${
                  closer.isSelf 
                    ? 'bg-brand-gold-start/10 border-brand-gold-start/20 text-brand-gold-end font-semibold' 
                    : 'bg-black/15 border-dark-border/40 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-gray-500 shrink-0 font-bold">
                    {closer.rank === 1 ? '🥇' : closer.rank === 2 ? '🥈' : closer.rank === 3 ? '🥉' : closer.rank}
                  </span>
                  <span className="truncate max-w-[70px]">{closer.name}</span>
                </div>
                
                <div className="flex gap-3 font-mono shrink-0">
                  <span className="text-gray-500">{closer.sales} vendas</span>
                  <span className="text-white font-bold">{formatValue(closer.revenue, 'currency')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ROW 4: CALLS GRAVADAS, ANÁLISE IA, CHECKLIST, PRÓXIMAS OPORTUNIDADES GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Calls Gravadas Table (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[290px]">
          <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Calls Gravadas</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todas</button>
          </div>

          <div className="flex flex-col gap-2 flex-grow overflow-y-auto pr-1">
            {callsGravadas.map((call, idx) => (
              <div key={idx} className="flex items-center justify-between bg-black/15 p-2 px-2.5 rounded-lg border border-dark-border/40 text-[10px]">
                <div className="flex flex-col">
                  <span className="text-white font-bold">{call.company}</span>
                  <span className="text-[8px] text-gray-500 font-mono mt-0.5">{call.date} • {call.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    call.status === 'Analisada' 
                      ? 'bg-status-purple/10 text-status-purple' 
                      : 'bg-status-yellow/10 text-status-yellow'
                  }`}>
                    {call.status}
                  </span>
                  <button className="w-5 h-5 rounded-full bg-white/5 border border-dark-border flex items-center justify-center hover:bg-white/10 active:scale-95 shrink-0 transition-transform">
                    <Play className="w-2.5 h-2.5 text-gray-400 fill-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Análise da IA (5/12 wide) */}
        <div className="glass-card p-5 rounded-xl xl:col-span-5 flex flex-col justify-between min-h-[290px]">
          <div>
            <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
              <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-brand-gold-start" />
                Análise da IA
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column: Score + Metrics list */}
              <div className="flex flex-col gap-2 border-r border-dark-border/40 pr-3 last:border-0">
                <div className="flex items-center gap-4 bg-black/20 p-2 rounded-lg border border-dark-border/40 shrink-0">
                  <div className="w-[54px] h-[54px] relative overflow-hidden select-none shrink-0">
                    <Chart options={scoreRadialOptions} series={[analiseIA.score]} type="radialBar" height="100%" width="100%" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] text-white font-bold">Score da reunião</span>
                    <span className="text-[8px] text-gray-500 font-mono mt-0.5">Analítico IA base</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-[9px] mt-1">
                  {analiseIA.metrics.slice(0, 5).map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-dark-border/30 pb-1 last:border-0">
                      <span className="text-gray-500 font-medium">{m.name}</span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-white font-bold">{m.value}</span>
                        <span className={`px-1 rounded-[3px] text-[7px] font-bold uppercase tracking-wider ${
                          m.type === 'success' 
                            ? 'bg-status-green/10 text-status-green' 
                            : 'bg-status-yellow/10 text-status-yellow'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Objeções + Sugestões */}
              <div className="flex flex-col justify-between gap-3 text-[9px]">
                
                {/* Objeções detectadas */}
                <div className="flex flex-col gap-1">
                  <span className="text-gray-400 font-bold uppercase text-[8px] tracking-wider">Objeções detectadas:</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {analiseIA.objectionsDetected.map((o, idx) => (
                      <span key={idx} className="bg-white/5 border border-dark-border/60 text-gray-300 py-0.5 px-2 rounded font-medium">
                        {o}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sugestões da IA */}
                <div className="flex flex-col gap-1 bg-[#10b981]/5 border border-[#10b981]/15 p-2 rounded-lg">
                  <span className="text-[#10b981] font-bold uppercase text-[8px] tracking-wider block">Sugestão da IA:</span>
                  <span className="text-white font-semibold block mt-0.5 leading-snug">Na próxima call, enfatize:</span>
                  <div className="flex flex-col gap-0.5 text-gray-300 mt-1 font-medium pl-1 text-[8.5px]">
                    {analiseIA.suggestions.map((s, idx) => (
                      <span key={idx}>• {s}</span>
                    ))}
                  </div>
                </div>

                {/* Playbook Button */}
                <button className="w-full bg-status-purple hover:bg-status-purple/80 text-white font-bold py-1.5 rounded-lg text-[9px] transition-colors active:scale-95">
                  Ver playbook sugerido
                </button>

              </div>

            </div>
          </div>

          {/* Probabilidade de fechamento progress bar */}
          <div className="border-t border-dark-border/40 pt-3.5 mt-3 text-[9px]">
            <div className="flex items-center justify-between text-gray-400 font-medium">
              <span>Probabilidade de fechamento</span>
              <span className="text-status-green font-bold font-mono">{analiseIA.closingProbability}%</span>
            </div>
            <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden border border-dark-border/20 mt-1">
              <div className="h-full bg-status-green rounded-full" style={{ width: `${analiseIA.closingProbability}%` }} />
            </div>
          </div>
        </div>

        {/* Checklist da Call (2/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-2 flex flex-col justify-between min-h-[290px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Checklist da Call</h3>
            <button className="text-[9px] text-gray-500 hover:text-brand-gold-start font-semibold">Editar</button>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto pr-0.5 flex-grow text-[9.5px]">
            {checklist.map((item, idx) => (
              <label key={idx} className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={item.checked}
                  readOnly
                  className="rounded border-dark-border bg-[#0d1726] text-status-green focus:ring-0 w-3.5 h-3.5 cursor-pointer shrink-0 accent-[#10b981]"
                />
                <span className="truncate">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Próximas Oportunidades Table (2/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-2 flex flex-col justify-between min-h-[290px]">
          <div className="border-b border-dark-border pb-2.5 mb-2 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider font-semibold">Oportunidades</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold font-bold">Ver todas</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Empresa</th>
                  <th className="py-2 text-right">Valor</th>
                  <th className="py-2 text-right px-1">Ação</th>
                </tr>
              </thead>
              <tbody>
                {proximasOportunidades.map((op, idx) => (
                  <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                    <td className="py-2 font-medium text-white truncate max-w-[60px]">{op.company}</td>
                    <td className="py-2 text-right font-mono font-bold text-white">{formatValue(op.value, 'currency')}</td>
                    <td className={`py-2 text-right font-medium px-1 text-[8.5px] ${
                      op.status === 'good' ? 'text-status-green' : op.status === 'warning' ? 'text-status-yellow' : 'text-gray-400'
                    }`}>
                      {op.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </section>

    </div>
  );
};

export default CloserTab;
