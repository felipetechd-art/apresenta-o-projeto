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
  Rocket,
  ShieldCheck,
  Star,
  Settings,
  Clock,
  Heart,
  XCircle,
  FolderDot
} from 'lucide-react';

const OperacaoTab = ({ data, formatValue }) => {
  if (!data) return null;

  const {
    kpis,
    jornadaCliente,
    saudeCarteira,
    capacidadeEquipe,
    entregasSemana,
    gargalos,
    slaProcesso,
    kanban,
    projetosEmAndamento,
    proximasEntregas,
    npsOperacao,
    alerts
  } = data;

  // 1. ApexCharts: NPS Gauge Config
  const npsGaugeOptions = {
    chart: {
      type: 'radialBar',
      sparkline: { enabled: true }
    },
    plotOptions: {
      radialBar: {
        startAngle: -100,
        endAngle: 100,
        hollow: { size: '70%' },
        track: {
          background: 'rgba(27, 42, 63, 0.4)',
          strokeWidth: '97%',
          margin: 5
        },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: -5,
            fontSize: '18px',
            color: '#fff',
            fontWeight: 'bold',
            fontFamily: 'Outfit',
            formatter: () => '82'
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        gradientToColors: ['#10b981'],
        stops: [0, 100]
      }
    },
    colors: ['#06b6d4'],
    stroke: { lineCap: 'round' }
  };

  const npsGaugeSeries = [82];

  return (
    <div className="flex flex-col gap-6">
      
      {/* 8 TOP LEVEL KPI CARDS */}
      <section className="grid grid-cols-2 lg:grid-cols-8 gap-3.5">
        
        {/* KPI 1: Clientes Ativos */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Clientes Ativos</span>
            <Users className="w-3.5 h-3.5 text-status-blue" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.clientesAtivos.value}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.clientesAtivos.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs mês anterior</span>
          </div>
        </div>

        {/* KPI 2: Em Implantação */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Em Implantação</span>
            <Rocket className="w-3.5 h-3.5 text-status-purple" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.emImplantacao.value}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.emImplantacao.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs mês anterior</span>
          </div>
        </div>

        {/* KPI 3: Operações Saudáveis */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Operações Saudáveis</span>
            <ShieldCheck className="w-3.5 h-3.5 text-status-green" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.operacoesSaudaveis.value}%
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.operacoesSaudaveis.change} p.p.</span>
            <span className="text-gray-500 font-medium normal-case">vs mês anterior</span>
          </div>
        </div>

        {/* KPI 4: Operações em Risco */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Operações em Risco</span>
            <AlertTriangle className="w-3.5 h-3.5 text-status-red" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.operacoesEmRisco.value}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▼ {Math.abs(kpis.operacoesEmRisco.change)}</span>
            <span className="text-gray-500 font-medium normal-case">vs mês anterior</span>
          </div>
        </div>

        {/* KPI 5: Tempo Médio Implantação */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Tempo Médio Impl.</span>
            <Clock className="w-3.5 h-3.5 text-status-cyan" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.tempoMedioImplantacao.value} dias
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▼ {Math.abs(kpis.tempoMedioImplantacao.change)} dias</span>
            <span className="text-gray-500 font-medium normal-case">vs mês anterior</span>
          </div>
        </div>

        {/* KPI 6: SLA Cumprido */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">SLA Cumprido</span>
            <ShieldCheck className="w-3.5 h-3.5 text-status-blue" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.slaCumprido.value}%
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.slaCumprido.change} p.p.</span>
            <span className="text-gray-500 font-medium normal-case">vs mês anterior</span>
          </div>
        </div>

        {/* KPI 7: NPS Geral */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">NPS Geral</span>
            <Star className="w-3.5 h-3.5 text-status-yellow" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.npsGeral.value}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.npsGeral.change}</span>
            <span className="text-gray-500 font-medium normal-case">vs mês anterior</span>
          </div>
        </div>

        {/* KPI 8: Gargalos Ativos */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Gargalos Ativos</span>
            <Settings className="w-3.5 h-3.5 text-status-red" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.gargalosAtivos.value}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▼ {Math.abs(kpis.gargalosAtivos.change)}</span>
            <span className="text-gray-500 font-medium normal-case">vs mês anterior</span>
          </div>
        </div>

      </section>

      {/* ROW 2: CLIENT JOURNEY, CLIENT HEALTH, TEAM CAPACITY */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Jornada do Cliente (5/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-5 flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Jornada do Cliente</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver funil completo</button>
          </div>
          
          <div className="overflow-x-auto flex-grow flex items-center py-2">
            <div className="flex xl:grid xl:grid-cols-9 gap-1.5 w-full min-w-[650px] xl:min-w-0">
              {jornadaCliente.map((step, idx) => {
                let borderCol = 'border-[#3b82f6]/20 bg-[#3b82f6]/5';
                let iconCol = 'text-[#3b82f6]';
                if (idx === 1 || idx === 7 || idx === 8) { borderCol = 'border-[#10b981]/20 bg-[#10b981]/5'; iconCol = 'text-[#10b981]'; }
                else if (idx === 2) { borderCol = 'border-[#f59e0b]/20 bg-[#f59e0b]/5'; iconCol = 'text-[#f59e0b]'; }
                else if (idx === 3) { borderCol = 'border-[#f97316]/20 bg-[#f97316]/5'; iconCol = 'text-[#f97316]'; }
                else if (idx === 5) { borderCol = 'border-[#8b5cf6]/20 bg-[#8b5cf6]/5'; iconCol = 'text-[#8b5cf6]'; }
                else if (idx === 6) { borderCol = 'border-[#ec4899]/20 bg-[#ec4899]/5'; iconCol = 'text-[#ec4899]'; }

                return (
                  <div key={idx} className={`border rounded-lg p-2 flex flex-col justify-between text-[9px] min-h-[190px] xl:min-h-0 select-none ${borderCol}`}>
                    <div className="border-b border-dark-border/20 pb-1 flex flex-col">
                      <span className={`font-bold uppercase tracking-wider text-[8px] truncate ${iconCol}`}>{step.stage}</span>
                      <span className="text-white font-black font-mono text-xs mt-1 block">{step.clients} <span className="text-[8px] font-normal text-gray-400">clientes</span></span>
                    </div>
                    <div className="flex flex-col gap-1.5 py-1.5 text-gray-400 font-medium">
                      <div>
                        <span className="text-[7.5px] text-gray-500 block leading-tight">Tempo médio</span>
                        <span className="text-white font-bold font-mono">{step.avgTime}</span>
                      </div>
                      <div>
                        <span className="text-[7.5px] text-gray-500 block leading-tight">Tempo máx.</span>
                        <span className="text-white font-bold font-mono">{step.maxTime}</span>
                      </div>
                    </div>
                    <div className="border-t border-dark-border/20 pt-1 flex items-center justify-between">
                      <span className="text-gray-500 text-[8px]">Atrasados</span>
                      <span className={`font-bold font-mono ${step.delayed > 0 ? 'text-status-red' : 'text-gray-400'}`}>
                        {step.delayed}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Saúde da Carteira (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Saúde da Carteira</h3>
            <button className="text-[9px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todas</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[9.5px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Cliente</th>
                  <th className="py-2 text-center">Saúde</th>
                  <th className="py-2">Etapa</th>
                  <th className="py-2">Responsável</th>
                  <th className="py-2 px-1 text-right">Próxima</th>
                </tr>
              </thead>
              <tbody>
                {saudeCarteira.map((item, idx) => {
                  let healthIcon = '💚';
                  let healthColor = 'text-status-green';
                  if (item.health < 50) { healthIcon = '💔'; healthColor = 'text-status-red'; }
                  else if (item.health < 80) { healthIcon = '💛'; healthColor = 'text-status-yellow'; }

                  let badgeClass = 'bg-status-green/10 text-status-green border-status-green/20';
                  if (item.nextDelivery === 'Hoje') badgeClass = 'bg-status-blue/10 text-status-blue border-status-blue/20';
                  if (item.nextDelivery === 'Atrasado') badgeClass = 'bg-status-red/10 text-status-red border-status-red/20';
                  if (item.nextDelivery === '2 dias') badgeClass = 'bg-status-yellow/10 text-status-yellow border-status-yellow/20';

                  return (
                    <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                      <td className="py-1.5 font-medium text-white max-w-[65px] truncate">{item.client}</td>
                      <td className="py-1.5 text-center font-mono font-bold">
                        <span className="flex items-center justify-center gap-0.5">
                          <span className="text-[10px]">{healthIcon}</span>
                          <span className={healthColor}>{item.health}</span>
                        </span>
                      </td>
                      <td className="py-1.5 text-gray-400 font-medium truncate max-w-[60px]">{item.stage}</td>
                      <td className="py-1.5 text-gray-400">{item.owner.split(' ')[0]}</td>
                      <td className="py-1.5 px-1 text-right">
                        <span className={`px-1 rounded-[3px] text-[7.5px] font-bold uppercase tracking-wider border ${badgeClass}`}>
                          {item.nextDelivery}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Capacidade da Equipe (4/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-4 flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Capacidade da Equipe</h3>
            <button className="text-[9px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver detalhes</button>
          </div>

          <div className="overflow-x-auto flex-grow flex flex-col justify-around py-1">
            <table className="w-full text-left border-collapse text-[9.5px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Colaborador</th>
                  <th className="py-2 text-center">Clientes</th>
                  <th className="py-2 text-center">Capacidade</th>
                  <th className="py-2 px-1 text-right">Ocupação</th>
                </tr>
              </thead>
              <tbody>
                {capacidadeEquipe.map((item, idx) => {
                  let progressColor = 'bg-status-green';
                  let textColor = 'text-white';
                  if (item.percent >= 85) { progressColor = 'bg-status-red'; textColor = 'text-status-red'; }
                  else if (item.percent >= 70) { progressColor = 'bg-status-yellow'; textColor = 'text-status-yellow'; }

                  return (
                    <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                      <td className="py-2 font-medium text-white flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-white/10 text-white flex items-center justify-center font-bold text-[8px] border border-dark-border/40 shrink-0">
                          {item.name.charAt(0)}
                        </div>
                        <span className="truncate max-w-[80px]">{item.name}</span>
                      </td>
                      <td className="py-2 text-center font-mono">{item.clients}</td>
                      <td className="py-2 text-center font-mono text-gray-500">{item.capacity}</td>
                      <td className="py-2 px-1 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="w-8 h-1 bg-black/35 rounded-full overflow-hidden shrink-0 border border-dark-border/20">
                            <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${item.percent}%` }} />
                          </div>
                          <span className={`font-mono font-bold shrink-0 ${textColor}`}>{item.percent}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </section>

      {/* ROW 3: ENTREGAS SEMANA, GARGALOS, SLA PROCESSO, KANBAN BOARD GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Entregas da Semana (2.5/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-2 flex flex-col justify-between min-h-[300px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Entregas da Semana</h3>
          </div>

          <div className="flex items-end justify-between gap-1 h-[170px] select-none py-2 px-1 border-b border-dark-border/20">
            {entregasSemana.map((day, idx) => {
              const maxVal = Math.max(...entregasSemana.map(d => d.count));
              const heightPct = Math.round((day.count / maxVal) * 100);
              let barColor = 'bg-[#3b82f6]/40 hover:bg-[#3b82f6]';
              if (idx === 0) barColor = 'bg-brand-gold-start hover:bg-brand-gold-end';

              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 flex-grow h-full justify-end">
                  <span className="font-mono text-[9px] font-bold text-white leading-none">{day.count}</span>
                  <div className="w-full rounded-t overflow-hidden bg-black/25 flex items-end h-[100px] border border-dark-border/20">
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${barColor}`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[7.5px] font-bold text-gray-500 uppercase tracking-tight text-center leading-none mt-1 truncate max-w-[32px]">{day.day.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>

          <button className="text-[9.5px] text-gray-400 hover:text-brand-gold-start transition-colors font-semibold border-t border-dark-border/40 pt-2.5 mt-2 flex items-center justify-between w-full">
            <span>Ver agenda completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Gargalos Operacionais (2/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-2 flex flex-col justify-between min-h-[300px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Gargalos Operacionais</h3>
            <button className="text-[9px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todos</button>
          </div>

          <div className="flex flex-col gap-2 flex-grow justify-around py-1 text-[9.5px]">
            {gargalos.map((g, idx) => {
              let circleColor = 'bg-status-red/15 text-status-red border-status-red/25';
              if (g.type === 'warning') circleColor = 'bg-status-yellow/15 text-status-yellow border-status-yellow/25';
              if (g.type === 'success') circleColor = 'bg-status-green/15 text-status-green border-status-green/25';
              if (g.type === 'orange') circleColor = 'bg-[#f97316]/15 text-[#f97316] border-[#f97316]/25';

              return (
                <div key={idx} className="flex items-center gap-2 hover:bg-white/5 p-1 rounded transition-colors">
                  <div className={`w-6 h-6 rounded-md border flex items-center justify-center font-bold text-[10px] shrink-0 font-mono ${circleColor}`}>
                    {g.count}
                  </div>
                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="text-white font-bold truncate">{g.title}</span>
                    <span className="text-[7.5px] text-gray-500 font-medium uppercase tracking-tight">{g.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SLA por Processo (2.5/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[300px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">SLA por Processo</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver relatório</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[9.5px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Processo</th>
                  <th className="py-2 text-right">Meta</th>
                  <th className="py-2 text-right">Atual</th>
                  <th className="py-2 px-1 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {slaProcesso.map((item, idx) => (
                  <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                    <td className="py-1.5 font-medium text-white">{item.process}</td>
                    <td className="py-1.5 text-right font-mono text-gray-500">{item.limit}</td>
                    <td className={`py-1.5 text-right font-mono font-bold ${item.status === 'danger' ? 'text-status-red' : 'text-white'}`}>{item.current}</td>
                    <td className="py-1.5 px-1 text-center">
                      <span className="flex items-center justify-center">
                        {item.status === 'success' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-status-green" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-status-red animate-pulse" />
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kanban da Operação (5.5/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-5 flex flex-col justify-between min-h-[300px]">
          <div className="border-b border-dark-border pb-2 mb-2 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Kanban da Operação</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver quadro completo</button>
          </div>

          <div className="grid grid-cols-4 gap-2 flex-grow py-1 text-[8.5px] select-none overflow-x-auto min-h-[220px]">
            
            {/* A Fazer Column */}
            <div className="bg-black/20 rounded-lg p-1.5 flex flex-col justify-between">
              <div className="border-b border-dark-border/40 pb-1 mb-1.5 flex items-center justify-between text-gray-400 font-bold uppercase tracking-wider">
                <span>A Fazer</span>
                <span className="font-mono">{kanban.todo.count}</span>
              </div>
              <div className="flex flex-col gap-1.5 flex-grow">
                {kanban.todo.items.map((card, idx) => (
                  <div key={idx} className="bg-[#0b1329] border border-dark-border/40 rounded p-1.5 flex flex-col gap-1 hover:border-dark-border transition-colors">
                    <p className="text-white font-medium leading-tight line-clamp-2">{card.title}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="px-1 rounded-[2px] text-[7px] font-bold text-white shrink-0" style={{ backgroundColor: card.tagColor }}>
                        {card.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-[7.5px] text-gray-500 font-bold text-center pt-1 border-t border-dark-border/20 mt-1">
                +4 tarefas
              </div>
            </div>

            {/* Em Execução Column */}
            <div className="bg-black/20 rounded-lg p-1.5 flex flex-col justify-between">
              <div className="border-b border-dark-border/40 pb-1 mb-1.5 flex items-center justify-between text-gray-400 font-bold uppercase tracking-wider">
                <span>Em Execução</span>
                <span className="font-mono">{kanban.doing.count}</span>
              </div>
              <div className="flex flex-col gap-1.5 flex-grow">
                {kanban.doing.items.map((card, idx) => (
                  <div key={idx} className="bg-[#0b1329] border border-dark-border/40 rounded p-1.5 flex flex-col gap-1 hover:border-dark-border transition-colors">
                    <p className="text-white font-medium leading-tight line-clamp-2">{card.title}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="px-1 rounded-[2px] text-[7px] font-bold text-white shrink-0" style={{ backgroundColor: card.tagColor }}>
                        {card.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-[7.5px] text-gray-500 font-bold text-center pt-1 border-t border-dark-border/20 mt-1">
                +11 tarefas
              </div>
            </div>

            {/* Em Revisão Column */}
            <div className="bg-black/20 rounded-lg p-1.5 flex flex-col justify-between">
              <div className="border-b border-dark-border/40 pb-1 mb-1.5 flex items-center justify-between text-gray-400 font-bold uppercase tracking-wider">
                <span>Em Revisão</span>
                <span className="font-mono">{kanban.review.count}</span>
              </div>
              <div className="flex flex-col gap-1.5 flex-grow">
                {kanban.review.items.map((card, idx) => (
                  <div key={idx} className="bg-[#0b1329] border border-dark-border/40 rounded p-1.5 flex flex-col gap-1 hover:border-dark-border transition-colors">
                    <p className="text-white font-medium leading-tight line-clamp-2">{card.title}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="px-1 rounded-[2px] text-[7px] font-bold text-white shrink-0" style={{ backgroundColor: card.tagColor }}>
                        {card.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-[7.5px] text-gray-500 font-bold text-center pt-1 border-t border-dark-border/20 mt-1">
                +3 tarefas
              </div>
            </div>

            {/* Concluído Column */}
            <div className="bg-black/20 rounded-lg p-1.5 flex flex-col justify-between">
              <div className="border-b border-dark-border/40 pb-1 mb-1.5 flex items-center justify-between text-gray-400 font-bold uppercase tracking-wider">
                <span>Concluído</span>
                <span className="font-mono">{kanban.done.count}</span>
              </div>
              <div className="flex flex-col gap-1.5 flex-grow">
                {kanban.done.items.map((card, idx) => (
                  <div key={idx} className="bg-[#0b1329]/50 border border-[#10b981]/25 rounded p-1.5 flex flex-col gap-1 hover:bg-[#0b1329] hover:border-[#10b981]/40 transition-all select-none">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-status-green shrink-0 mt-0.5" />
                      <p className="text-gray-400 font-medium leading-tight line-clamp-2">{card.title.split(' ')[0]} {card.title.split(' ')[1]} {card.title.split(' ')[2]}</p>
                    </div>
                    <span className="text-[7.5px] text-gray-500 font-bold font-mono pl-4 block">{card.title.split(' ').slice(3).join(' ')}</span>
                  </div>
                ))}
              </div>
              <div className="text-[7.5px] text-status-green font-bold text-center pt-1 border-t border-[#10b981]/20 mt-1">
                +8 concluídas
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ROW 4: PROJECTS, NEXT DELIVERIES, NPS RADIAL, ALERTS GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Projetos em Andamento (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[300px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Projetos em Andamento</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todos</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[9.5px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Projeto</th>
                  <th className="py-2">Progresso</th>
                  <th className="py-2">Prazo</th>
                  <th className="py-2 px-1 text-center">Saúde</th>
                </tr>
              </thead>
              <tbody>
                {projetosEmAndamento.map((p, idx) => {
                  let progressColor = 'bg-status-green';
                  if (p.health === 'warning') progressColor = 'bg-status-yellow';
                  if (p.health === 'danger') progressColor = 'bg-status-red';

                  let healthHeart = '💚';
                  if (p.health === 'warning') healthHeart = '💛';
                  if (p.health === 'danger') healthHeart = '❤️';

                  return (
                    <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors animate-fade-in">
                      <td className="py-1.5 font-medium text-white max-w-[65px] truncate">{p.project}</td>
                      <td className="py-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-8 h-1 bg-black/35 rounded-full overflow-hidden shrink-0 border border-dark-border/20">
                            <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${p.progress}%` }} />
                          </div>
                          <span className="font-mono font-bold text-white shrink-0">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="py-1.5 font-mono text-gray-400">{p.deadline}</td>
                      <td className="py-1.5 px-1 text-center text-[10px]">{healthHeart}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Próximas Entregas (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[300px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Próximas Entregas</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver agenda</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[9.5px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Período</th>
                  <th className="py-2">Horário</th>
                  <th className="py-2">Entrega</th>
                  <th className="py-2 px-1 text-right">Responsável</th>
                </tr>
              </thead>
              <tbody>
                {proximasEntregas.map((item, idx) => (
                  <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                    <td className="py-1.5 font-medium text-white">{item.period}</td>
                    <td className="py-1.5 font-mono text-gray-500">{item.time}</td>
                    <td className="py-1.5 text-gray-400 truncate max-w-[90px]">{item.task}</td>
                    <td className="py-1.5 px-1 text-right text-gray-400 font-medium">{item.owner.split(' ')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NPS Radial (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[300px]">
          <div className="border-b border-dark-border pb-2.5 mb-2 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">NPS da Operação</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver relatório</button>
          </div>

          <div className="flex items-center justify-between gap-2 flex-grow select-none">
            
            {/* Semicircle Gauge */}
            <div className="w-1/2 h-[120px] flex items-center justify-center relative overflow-hidden">
              <Chart options={npsGaugeOptions} series={npsGaugeSeries} type="radialBar" height={165} width={165} />
              <div className="absolute bottom-2 text-center flex flex-col">
                <span className="text-[9px] text-[#06b6d4] font-extrabold uppercase tracking-wider">NPS GERAL</span>
                <span className="text-[7.5px] text-gray-500 font-bold font-mono mt-px">-100 a 100</span>
              </div>
            </div>

            {/* NPS team list */}
            <div className="w-1/2 flex flex-col gap-1.5 text-[9px] py-1">
              <span className="text-[8px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Por Colaborador</span>
              {npsOperacao.team.map((colab, idx) => (
                <div key={idx} className="flex items-center justify-between py-0.5 border-b border-dark-border/20 last:border-0 text-gray-300">
                  <span className="font-medium truncate max-w-[65px]">{colab.name}</span>
                  <span className="font-mono font-bold text-white">{colab.value}</span>
                </div>
              ))}
            </div>

          </div>

          <button className="text-[9.5px] text-gray-400 hover:text-brand-gold-start transition-colors font-semibold border-t border-dark-border/40 pt-2.5 mt-2 flex items-center justify-between w-full">
            <span>Ver análise completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Alertas Operacionais (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
              <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Alertas Operacionais</h3>
              <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todos</button>
            </div>

            <div className="flex flex-col gap-1.5">
              {alerts.map((alert, idx) => {
                let alertColor = 'border-status-yellow/30 bg-status-yellow/5 text-gray-300';
                let iconColor = 'text-status-yellow';
                if (alert.type === 'danger') {
                  alertColor = 'border-status-red/30 bg-status-red/5 text-gray-300';
                  iconColor = 'text-status-red';
                }

                return (
                  <div key={idx} className={`flex items-start justify-between gap-1.5 p-1.5 rounded-lg border text-[9.5px] leading-tight hover:bg-white/5 transition-colors cursor-pointer ${alertColor}`}>
                    <div className="flex items-start gap-1.5 min-w-0">
                      <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${iconColor} mt-px`} />
                      <span className="font-medium truncate max-w-[130px]">{alert.text}</span>
                    </div>
                    <span className="font-mono text-gray-500 text-[8px] font-bold shrink-0">{alert.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button className="text-[9.5px] text-gray-400 hover:text-brand-gold-start transition-colors font-semibold border-t border-dark-border/40 pt-2.5 mt-2 flex items-center justify-between w-full">
            <span>Ver todos os alertas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </section>

    </div>
  );
};

export default OperacaoTab;
