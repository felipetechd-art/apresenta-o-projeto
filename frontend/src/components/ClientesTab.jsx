import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Percent,
  Activity,
  Calendar,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  MessageSquare,
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
  HelpCircle,
  MoreHorizontal,
  ChevronLeft
} from 'lucide-react';

const ClientesTab = ({ data, formatValue }) => {
  const { kpis, jornadaCliente, saudeCarteira, clientesEmRisco, renovacoes } = data;

  const [selectedClientId, setSelectedClientId] = useState('empresa-beta');
  const [clientDetail, setClientDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeHealthFilter, setActiveHealthFilter] = useState('all'); // 'all', 'Saudável', 'Atenção', 'Risco'
  const [detailTab, setDetailTab] = useState('visao-geral'); // 'visao-geral', 'jornada', etc.

  // Fetch client details dynamically
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setDetailLoading(true);
        const response = await fetch(`/api/clientes?clientId=${selectedClientId}`);
        if (response.ok) {
          const json = await response.json();
          setClientDetail(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setDetailLoading(false);
      }
    };
    if (selectedClientId) {
      fetchDetail();
    }
  }, [selectedClientId]);

  // Filtering table rows
  const filteredCarteira = saudeCarteira.filter(item => {
    if (activeHealthFilter === 'all') return true;
    return item.status === activeHealthFilter;
  });

  // ApexCharts Configs
  // 1. Health Score Semicircle Gauge
  const getHealthGaugeOptions = (score, status) => {
    let gaugeColor = '#f59e0b'; // Atenção
    if (status === 'Saudável') gaugeColor = '#10b981';
    if (status === 'Risco') gaugeColor = '#ef4444';

    return {
      chart: { type: 'radialBar', sparkline: { enabled: true } },
      plotOptions: {
        radialBar: {
          startAngle: -110,
          endAngle: 110,
          hollow: { size: '68%' },
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
              formatter: () => `${score}`
            }
          }
        }
      },
      colors: [gaugeColor],
      stroke: { lineCap: 'round' }
    };
  };

  // 2. Evolution Chart: Engajamento, Entregas, NPS Line Graph
  const getEvolutionChartOptions = (dates) => ({
    chart: {
      type: 'line',
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#3b82f6', '#10b981', '#8b5cf6'],
    xaxis: {
      categories: dates || [],
      labels: { style: { colors: '#94a3b8', fontSize: '8px', fontFamily: 'Inter' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 4,
      labels: { style: { colors: '#94a3b8', fontSize: '8px', fontFamily: 'Inter' } }
    },
    grid: { borderColor: 'rgba(27, 42, 63, 0.15)', strokeDashArray: 4 },
    legend: { show: false },
    tooltip: { theme: 'dark' }
  });

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

        {/* KPI 2: Novos Clientes */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Novos Clientes</span>
            <Rocket className="w-3.5 h-3.5 text-status-purple" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.novosClientes.value}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.novosClientes.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs mês anterior</span>
          </div>
        </div>

        {/* KPI 3: Clientes Saudáveis */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Clientes Saudáveis</span>
            <ShieldCheck className="w-3.5 h-3.5 text-status-green" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.clientesSaudaveis.value}%
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.clientesSaudaveis.change} p.p.</span>
            <span className="text-gray-500 font-medium normal-case">vs mês anterior</span>
          </div>
        </div>

        {/* KPI 4: Clientes em Risco */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Clientes em Risco</span>
            <AlertTriangle className="w-3.5 h-3.5 text-status-red" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.clientesEmRisco.value}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▼ {Math.abs(kpis.clientesEmRisco.change)}</span>
            <span className="text-gray-500 font-medium normal-case">vs mês anterior</span>
          </div>
        </div>

        {/* KPI 5: NPS Médio */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">NPS Médio</span>
            <Star className="w-3.5 h-3.5 text-status-yellow" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.npsMedio.value}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.npsMedio.change} p.p.</span>
            <span className="text-gray-500 font-medium normal-case">vs mês anterior</span>
          </div>
        </div>

        {/* KPI 6: MRR (Recorrente) */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">MRR (Recorrente)</span>
            <DollarSign className="w-3.5 h-3.5 text-status-blue" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {formatValue(kpis.mrr.value, 'currency')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.mrr.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs mês anterior</span>
          </div>
        </div>

        {/* KPI 7: Churn (30 dias) */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Churn (30 dias)</span>
            <TrendingDown className="w-3.5 h-3.5 text-status-red" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.churn.value}%
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▼ {Math.abs(kpis.churn.change)} p.p.</span>
            <span className="text-gray-500 font-medium normal-case">vs mês anterior</span>
          </div>
        </div>

        {/* KPI 8: LTV Médio */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">LTV Médio</span>
            <TrendingUp className="w-3.5 h-3.5 text-status-cyan" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {formatValue(kpis.ltv.value, 'currency')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.ltv.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs mês anterior</span>
          </div>
        </div>

      </section>

      {/* ROW 2: SAUDE DA CARTEIRA, JORNADA DO CLIENTE, RISCOS & RENOVAÇÕES */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Saúde da Carteira (6/12) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-6 flex flex-col justify-between min-h-[350px]">
          <div>
            <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
              <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Saúde da Carteira</h3>
              
              {/* Category tabs */}
              <div className="flex gap-2 text-[8px] font-bold uppercase tracking-wider text-gray-400">
                <button onClick={() => setActiveHealthFilter('all')} className={`px-2 py-0.5 rounded border transition-colors ${activeHealthFilter === 'all' ? 'bg-[#3b82f6]/20 border-[#3b82f6] text-[#3b82f6]' : 'border-dark-border hover:text-white'}`}>
                  Todos <span className="font-mono ml-0.5">128</span>
                </button>
                <button onClick={() => setActiveHealthFilter('Saudável')} className={`px-2 py-0.5 rounded border transition-colors ${activeHealthFilter === 'Saudável' ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]' : 'border-dark-border hover:text-white'}`}>
                  Saudáveis <span className="font-mono ml-0.5">118</span>
                </button>
                <button onClick={() => setActiveHealthFilter('Atenção')} className={`px-2 py-0.5 rounded border transition-colors ${activeHealthFilter === 'Atenção' ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#f59e0b]' : 'border-dark-border hover:text-white'}`}>
                  Atenção <span className="font-mono ml-0.5">10</span>
                </button>
                <button onClick={() => setActiveHealthFilter('Risco')} className={`px-2 py-0.5 rounded border transition-colors ${activeHealthFilter === 'Risco' ? 'bg-[#ef4444]/20 border-[#ef4444] text-[#ef4444]' : 'border-dark-border hover:text-white'}`}>
                  Risco <span className="font-mono ml-0.5">8</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[9.5px]">
                <thead>
                  <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                    <th className="py-2">Cliente</th>
                    <th className="py-2 text-center">Health Score</th>
                    <th className="py-2">Etapa atual</th>
                    <th className="py-2">Último contato</th>
                    <th className="py-2">Próxima ação</th>
                    <th className="py-2">Responsável</th>
                    <th className="py-2 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCarteira.map((item) => {
                    let scoreBadge = 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30';
                    let dotClass = 'bg-[#10b981]';
                    if (item.health < 50) {
                      scoreBadge = 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30';
                      dotClass = 'bg-[#ef4444]';
                    } else if (item.health < 80) {
                      scoreBadge = 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30';
                      dotClass = 'bg-[#f59e0b]';
                    }

                    if (item.paused) {
                      dotClass = 'bg-[#f97316]';
                    }

                    const isSelected = selectedClientId === item.id;
                    const rowHighlight = isSelected ? 'bg-white/5 border-l-2 border-[#3b82f6]' : 'hover:bg-white/5 border-b border-dark-border/30';

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedClientId(item.id)}
                        className={`transition-colors cursor-pointer text-gray-300 ${rowHighlight}`}
                      >
                        <td className="py-1.5 font-bold text-white pl-2">{item.client}</td>
                        <td className="py-1.5 text-center">
                          <span className={`px-1.5 py-0.5 rounded-[4px] font-mono font-bold border text-[8.5px] ${scoreBadge}`}>
                            {item.health}
                          </span>
                        </td>
                        <td className="py-1.5 font-medium flex items-center gap-1.5 mt-[3px]">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
                          <span className={item.paused ? 'text-[#f97316]' : 'text-gray-400'}>{item.stage}</span>
                        </td>
                        <td className="py-1.5 text-gray-400">{item.lastContact}</td>
                        <td className="py-1.5">
                          <span className={item.urgent ? 'text-status-red font-bold' : 'text-gray-300'}>
                            {item.nextAction}
                          </span>
                        </td>
                        <td className="py-1.5 text-gray-400 flex items-center gap-1.5">
                          <div className="w-4.5 h-4.5 rounded bg-white/10 text-white flex items-center justify-center font-bold text-[8.5px] border border-dark-border/35">
                            {item.avatar}
                          </div>
                          <span>{item.owner}</span>
                        </td>
                        <td className="py-1.5 text-right pr-2">
                          <button className="p-1 hover:text-white text-gray-500 rounded">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold text-center border-t border-dark-border/40 pt-2 mt-2 w-full">
            Ver todos os clientes
          </button>
        </div>

        {/* Jornada do Cliente (3/12) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[350px]">
          <div>
            <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
              <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Jornada do Cliente</h3>
              <button className="text-[9px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver funil completo</button>
            </div>
            
            <div className="flex flex-col gap-2.5 text-[8.5px]">
              {jornadaCliente.slice(0, 7).map((step, idx) => {
                let barColor = 'bg-[#3b82f6]';
                if (idx === 2 || idx === 6) barColor = 'bg-[#10b981]';
                if (idx === 3 || idx === 4 || idx === 5) barColor = 'bg-[#f59e0b]';

                return (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-gray-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{idx + 1}</span>
                        <span className="truncate max-w-[85px]">{step.stage}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono">
                        <span className="text-white font-bold">{step.clients}</span>
                        <span className="text-gray-500">({step.conversion}%)</span>
                        {step.label && <span className="text-gray-500 ml-1">· {step.label}</span>}
                        {step.delayed > 0 && (
                          <span className="bg-status-red/10 text-status-red border border-status-red/25 px-1 rounded-[3px] text-[7.5px] font-bold font-mono ml-1">
                            {step.delayed} atrasados
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-full h-1 bg-black/35 rounded-full overflow-hidden border border-dark-border/20">
                      <div className={`h-full rounded-full ${barColor}`} style={{ width: `${step.conversion}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[7.5px] text-gray-500 font-bold border-t border-dark-border/30 pt-2 text-center uppercase tracking-wider">
            Fases de Pós-Implantacão e Renovação integradas
          </div>
        </div>

        {/* Clientes em Risco & Renovações (3/12) */}
        <div className="xl:col-span-3 flex flex-col gap-6 min-h-[350px]">
          
          {/* Clientes em Risco */}
          <div className="glass-card p-4 rounded-xl flex-grow flex flex-col justify-between">
            <div>
              <div className="border-b border-dark-border pb-2 mb-2 flex items-center justify-between">
                <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Clientes em Risco</h3>
                <button className="text-[9px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todos</button>
              </div>

              <div className="flex flex-col gap-1.5 text-[9px]">
                {clientesEmRisco.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedClientId(item.id)}
                    className="flex items-center justify-between p-1.5 rounded-lg border border-status-red/20 bg-status-red/5 hover:bg-status-red/10 transition-colors cursor-pointer text-gray-300 leading-tight"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-bold truncate">{item.client}</span>
                      <span className="text-[7.5px] text-gray-500 mt-0.5 truncate">{item.reason}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      <span className="font-mono text-status-red font-bold bg-status-red/10 border border-status-red/30 px-1 rounded-[3px] text-[8px]">
                        {item.health}
                      </span>
                      <AlertTriangle className="w-3.5 h-3.5 text-status-red shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Renovações (Próximos 90 dias) */}
          <div className="glass-card p-4 rounded-xl flex-grow flex flex-col justify-between">
            <div>
              <div className="border-b border-dark-border pb-2 mb-2 flex items-center justify-between">
                <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Renovações <span className="text-[8px] text-gray-500 lowercase font-medium">90d</span></h3>
                <button className="text-[9px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todos</button>
              </div>

              <div className="flex flex-col gap-1.5 text-[9px]">
                {renovacoes.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedClientId(item.id)}
                    className="flex items-center justify-between p-1.5 rounded-lg border border-dark-border/40 bg-black/25 hover:bg-white/5 transition-colors cursor-pointer text-gray-300 leading-tight"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-bold truncate">{item.client}</span>
                      <span className="text-[7.5px] text-gray-500 mt-0.5 font-mono">Vencimento: {item.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      <div className="text-right flex flex-col leading-none">
                        <span className="text-white font-bold font-mono">{formatValue(item.value, 'currency')}</span>
                        <span className="text-[7px] text-status-green font-bold mt-[2px]">{item.status.split(' ')[0]}</span>
                      </div>
                      <div className="w-7 h-7 flex items-center justify-center relative shrink-0">
                        {/* Simulated circular progress */}
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="14" cy="14" r="10" stroke="rgba(27, 42, 63, 0.4)" strokeWidth="2.5" fill="transparent" />
                          <circle cx="14" cy="14" r="10" stroke="#10b981" strokeWidth="2.5" fill="transparent"
                            strokeDasharray={2 * Math.PI * 10}
                            strokeDashoffset={2 * Math.PI * 10 * (1 - item.prob / 100)}
                          />
                        </svg>
                        <span className="absolute text-[7.5px] font-bold font-mono text-white">{item.prob}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* COCKPIT DETALHES DO CLIENTE SELECIONADO */}
      {selectedClientId && clientDetail && (
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 border-t border-dark-border/40 pt-6 mt-2 animate-fade-in">
          
          {/* Details Left Sidebar (3/12) */}
          <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[480px]">
            <div>
              {/* Back to Client selection */}
              <button
                onClick={() => setSelectedClientId(null)}
                className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-white font-bold uppercase tracking-wider mb-4 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Voltar para clientes
              </button>

              <div className="flex flex-col items-center text-center pb-4 border-b border-dark-border/30">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-gold-start/20 to-brand-gold-end/30 border border-brand-gold-start/40 flex items-center justify-center font-heading font-black text-2xl text-white shadow-inner mb-3">
                  {clientDetail.client.charAt(0)}
                </div>
                <h4 className="font-heading font-bold text-sm text-white">{clientDetail.client}</h4>
                <span className={`px-2 py-0.5 rounded-[4px] text-[7.5px] font-extrabold uppercase border mt-2.5 tracking-wider ${
                  clientDetail.status === 'Saudável' ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30' :
                  clientDetail.status === 'Atenção' ? 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30' :
                  'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30'
                }`}>
                  {clientDetail.status}
                </span>
              </div>

              {/* Data specifications */}
              <div className="py-4 border-b border-dark-border/30 flex flex-col gap-2.5 text-[9.5px]">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold uppercase tracking-tight">Segmento</span>
                  <span className="text-white font-medium">{clientDetail.segment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold uppercase tracking-tight">Porte</span>
                  <span className="text-white font-medium">{clientDetail.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold uppercase tracking-tight">Cidade</span>
                  <span className="text-white font-medium">{clientDetail.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold uppercase tracking-tight">Cliente desde</span>
                  <span className="text-white font-medium">{clientDetail.since}</span>
                </div>
              </div>

              {/* Responsável CS */}
              <div className="py-4 border-b border-dark-border/30">
                <span className="text-gray-500 text-[8.5px] font-bold uppercase tracking-wider block mb-2.5">Responsável</span>
                <div className="flex items-center gap-2.5">
                  <div className="w-6.5 h-6.5 rounded bg-white/10 text-white flex items-center justify-center font-bold text-[10px] border border-dark-border/30 shrink-0">
                    {clientDetail.owner.charAt(0)}
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-white font-bold text-[9.5px]">{clientDetail.owner}</span>
                    <span className="text-[7.5px] text-gray-500 font-medium uppercase tracking-tight">{clientDetail.role}</span>
                  </div>
                </div>
              </div>

              {/* Contact shortcuts */}
              <div className="py-4 flex items-center justify-around">
                <button className="w-7 h-7 rounded-lg border border-dark-border/40 hover:bg-[#10b981]/15 hover:text-[#10b981] hover:border-[#10b981]/30 text-gray-400 flex items-center justify-center transition-all">
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded-lg border border-dark-border/40 hover:bg-[#3b82f6]/15 hover:text-[#3b82f6] hover:border-[#3b82f6]/30 text-gray-400 flex items-center justify-center transition-all">
                  <Mail className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded-lg border border-dark-border/40 hover:bg-[#06b6d4]/15 hover:text-[#06b6d4] hover:border-[#06b6d4]/30 text-gray-400 flex items-center justify-center transition-all">
                  <Phone className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded-lg border border-dark-border/40 hover:bg-white/5 hover:text-white text-gray-400 flex items-center justify-center transition-all">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>

              <button className="w-full bg-black/25 hover:bg-white/5 border border-dark-border/50 text-white font-bold text-[9px] py-1.5 rounded transition-colors uppercase tracking-wider">
                Ver contrato e documentos
              </button>
            </div>

            {/* IA DO CLIENTE CARD */}
            <div className="bg-[#0c182b] border border-[#3b82f6]/20 rounded-lg p-2.5 select-none flex flex-col gap-2 relative overflow-hidden mt-4">
              <div className="absolute inset-0 bg-radial-at-t from-[#3b82f6]/10 via-transparent to-transparent pointer-events-none" />
              <h5 className="font-heading font-black text-[10px] text-white flex items-center gap-1.5 z-10 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-status-cyan" />
                IA do Cliente
                <span className="bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30 text-[6px] font-black px-1 rounded">BETA</span>
              </h5>
              <p className="text-gray-400 text-[8px] leading-relaxed z-10">Peça um resumo ou insights inteligentes sobre qualquer cliente.</p>
              <button className="w-full bg-[#1062e6] hover:bg-[#1a73e8] text-white font-bold text-[8.5px] py-1 px-3 rounded border border-[#3b82f6]/30 shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1 z-10">
                Perguntar à IA
              </button>
            </div>

          </div>

          {/* Details Dashboard (9/12) */}
          <div className="xl:col-span-9 flex flex-col gap-5 min-h-[480px]">
            
            {/* Abas Horizontais do Cockpit */}
            <div className="border-b border-dark-border flex gap-4 text-[10.5px] font-bold uppercase tracking-wider text-gray-400 select-none overflow-x-auto pb-1">
              <button onClick={() => setDetailTab('visao-geral')} className={`pb-2 transition-colors border-b-2 ${detailTab === 'visao-geral' ? 'border-[#3b82f6] text-white' : 'border-transparent hover:text-white'}`}>
                Visão Geral
              </button>
              <button onClick={() => setDetailTab('jornada')} className={`pb-2 transition-colors border-b-2 ${detailTab === 'jornada' ? 'border-[#3b82f6] text-white' : 'border-transparent hover:text-white'}`}>
                Jornada
              </button>
              <button onClick={() => setDetailTab('atividades')} className={`pb-2 transition-colors border-b-2 ${detailTab === 'atividades' ? 'border-[#3b82f6] text-white' : 'border-transparent hover:text-white'}`}>
                Atividades
              </button>
              <button onClick={() => setDetailTab('produtos')} className={`pb-2 transition-colors border-b-2 ${detailTab === 'produtos' ? 'border-[#3b82f6] text-white' : 'border-transparent hover:text-white'}`}>
                Produtos
              </button>
              <button onClick={() => setDetailTab('financeiro')} className={`pb-2 transition-colors border-b-2 ${detailTab === 'financeiro' ? 'border-[#3b82f6] text-white' : 'border-transparent hover:text-white'}`}>
                Financeiro
              </button>
              <button onClick={() => setDetailTab('comunicacao')} className={`pb-2 transition-colors border-b-2 ${detailTab === 'comunicacao' ? 'border-[#3b82f6] text-white' : 'border-transparent hover:text-white'}`}>
                Comunicação
              </button>
              <button onClick={() => setDetailTab('arquivos')} className={`pb-2 transition-colors border-b-2 ${detailTab === 'arquivos' ? 'border-[#3b82f6] text-white' : 'border-transparent hover:text-white'}`}>
                Arquivos
              </button>
              <button onClick={() => setDetailTab('notas')} className={`pb-2 transition-colors border-b-2 ${detailTab === 'notas' ? 'border-[#3b82f6] text-white' : 'border-transparent hover:text-white'}`}>
                Notas
              </button>
            </div>

            {/* TAB CONTENT: VISÃO GERAL */}
            {detailTab === 'visao-geral' && (
              <div className="flex flex-col gap-4 animate-fade-in">
                
                {/* Row 1: Health, Resumo IA, Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  
                  {/* Health Score Gauge */}
                  <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[190px]">
                    <div className="border-b border-dark-border/40 pb-2 mb-2 flex items-center justify-between">
                      <span className="text-[8.5px] text-gray-500 uppercase font-bold tracking-wider">Health Score</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                        clientDetail.status === 'Saudável' ? 'bg-[#10b981]/10 text-[#10b981]' :
                        clientDetail.status === 'Atenção' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' :
                        'bg-[#ef4444]/10 text-[#ef4444]'
                      }`}>
                        {clientDetail.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 flex-grow select-none">
                      <div className="w-1/2 h-[95px] flex items-center justify-center relative overflow-hidden">
                        <Chart options={getHealthGaugeOptions(clientDetail.health, clientDetail.status)} series={[clientDetail.health]} type="radialBar" height={135} width={135} />
                        <span className={`absolute bottom-0 text-[8px] font-bold uppercase tracking-wider ${
                          clientDetail.status === 'Saudável' ? 'text-[#10b981]' :
                          clientDetail.status === 'Atenção' ? 'text-[#f59e0b]' :
                          'text-[#ef4444]'
                        }`}>{clientDetail.status}</span>
                      </div>

                      <div className="w-1/2 flex flex-col gap-1.5 text-[8.5px] py-1 font-medium">
                        <div className="flex items-center justify-between border-b border-dark-border/20 pb-1">
                          <span className="text-gray-500">Uso Plataforma</span>
                          <span className="font-mono text-white">{clientDetail.healthBreakdown.platform}/100</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-dark-border/20 pb-1">
                          <span className="text-gray-500">Entregas CS</span>
                          <span className="font-mono text-white">{clientDetail.healthBreakdown.deliveries}/100</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-dark-border/20 pb-1">
                          <span className="text-gray-500">Reuniões</span>
                          <span className="font-mono text-white">{clientDetail.healthBreakdown.meetings}/100</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-dark-border/20 pb-1">
                          <span className="text-gray-500">Financeiro</span>
                          <span className="font-mono text-white">{clientDetail.healthBreakdown.payment}/100</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">NPS score</span>
                          <span className="font-mono text-white">{clientDetail.healthBreakdown.nps}/100</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resumo IA & Próximas Ações */}
                  <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[190px]">
                    <div className="border-b border-dark-border/40 pb-2 mb-2 flex items-center justify-between">
                      <span className="text-[8.5px] text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-status-cyan" />
                        Resumo IA
                        <span className="bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30 text-[6px] font-black px-1 rounded ml-1">BETA</span>
                      </span>
                      <button className="text-[8px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver recomendações</button>
                    </div>

                    <p className="text-gray-300 text-[9px] leading-relaxed flex-grow pr-1 italic">
                      "{clientDetail.aiSummary}"
                    </p>

                    <div className="border-t border-dark-border/30 pt-2.5 mt-2 flex flex-col gap-1.5 text-[8.5px]">
                      <span className="text-gray-500 font-bold uppercase tracking-wider block">Próximas ações</span>
                      {clientDetail.nextActions.slice(0, 2).map((act, idx) => (
                        <div key={idx} className="flex items-center justify-between text-gray-300 hover:text-white transition-colors">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {act.type === 'whatsapp' ? <MessageSquare className="w-3 h-3 text-[#10b981] shrink-0" /> : <Calendar className="w-3 h-3 text-[#3b82f6] shrink-0" />}
                            <span className="truncate">{act.title}</span>
                          </div>
                          <span className="font-mono text-gray-500 text-[8px] shrink-0">{act.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline da jornada */}
                  <div className="glass-card p-4 rounded-xl flex flex-col justify-between min-h-[190px]">
                    <div className="border-b border-dark-border/40 pb-2 mb-2.5 flex items-center justify-between">
                      <span className="text-[8.5px] text-gray-500 uppercase font-bold tracking-wider">Timeline da Jornada</span>
                      <button className="text-[8.5px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver jornada completa</button>
                    </div>

                    <div className="flex flex-col gap-2 relative pl-3 flex-grow py-1 overflow-y-auto">
                      {/* Vertical line indicator */}
                      <div className="absolute left-1.5 top-2 bottom-2 w-[1px] bg-dark-border/50" />
                      
                      {clientDetail.timeline.slice(0, 3).map((item, idx) => {
                        let bulletColor = 'bg-[#10b981]';
                        if (item.status === 'info') bulletColor = 'bg-[#3b82f6]';
                        if (item.status === 'warning') bulletColor = 'bg-[#f59e0b]';

                        return (
                          <div key={idx} className="flex items-start gap-2 text-[8px] leading-tight select-none">
                            <span className={`w-3.5 h-3.5 rounded-full shrink-0 flex items-center justify-center text-white ${bulletColor} border-2 border-[#090e1a] z-10 font-bold text-[7px]`}>
                              {idx + 1}
                            </span>
                            <div className="flex flex-col">
                              <span className="text-white font-bold">{item.title}</span>
                              <span className="text-gray-500 text-[7px] font-medium mt-[1px]">{item.desc} · {item.date}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Row 2: Evolution and CS statistics / Financial */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  
                  {/* Evolution graph (7/12) */}
                  <div className="glass-card p-4 rounded-xl lg:col-span-7 flex flex-col justify-between min-h-[300px]">
                    <div>
                      <div className="border-b border-dark-border/40 pb-2 mb-3 flex items-center justify-between">
                        <span className="text-[8.5px] text-gray-500 uppercase font-bold tracking-wider">Evolução do Cliente</span>
                        <div className="flex gap-2.5 text-[7.5px] font-bold uppercase tracking-wider text-gray-500">
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" /> Engajamento</span>
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Entregas</span>
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" /> NPS</span>
                        </div>
                      </div>
                      
                      <div className="h-[155px]">
                        <Chart options={getEvolutionChartOptions(clientDetail.evolution.dates)} series={[
                          { name: 'Engajamento', data: clientDetail.evolution.engagement },
                          { name: 'Entregas', data: clientDetail.evolution.deliveries },
                          { name: 'NPS', data: clientDetail.evolution.nps }
                        ]} type="line" height={150} />
                      </div>
                    </div>

                    {/* period indicators */}
                    <div className="border-t border-dark-border/30 pt-3 flex items-center justify-around text-center text-[9px]">
                      <div>
                        <span className="text-gray-500 uppercase font-bold block leading-none">Acessos</span>
                        <span className="text-white font-mono font-bold block my-1">{clientDetail.indicators.logins.value}</span>
                        <span className={`font-bold font-mono text-[7.5px] ${clientDetail.indicators.logins.change > 0 ? 'text-status-green' : 'text-status-red'}`}>
                          {clientDetail.indicators.logins.change > 0 ? '▲' : '▼'} {Math.abs(clientDetail.indicators.logins.change)}%
                        </span>
                      </div>
                      <div className="w-[1px] h-8 bg-dark-border/30" />
                      <div>
                        <span className="text-gray-500 uppercase font-bold block leading-none">Entregas concluídas</span>
                        <span className="text-white font-mono font-bold block my-1">{clientDetail.indicators.deliveries.value}%</span>
                        <span className={`font-bold font-mono text-[7.5px] ${clientDetail.indicators.deliveries.change > 0 ? 'text-status-green' : 'text-status-red'}`}>
                          {clientDetail.indicators.deliveries.change > 0 ? '▲' : '▼'} {Math.abs(clientDetail.indicators.deliveries.change)} p.p.
                        </span>
                      </div>
                      <div className="w-[1px] h-8 bg-dark-border/30" />
                      <div>
                        <span className="text-gray-500 uppercase font-bold block leading-none">Treinamentos</span>
                        <span className="text-white font-mono font-bold block my-1">{clientDetail.indicators.training.value}</span>
                        <span className={`font-bold font-mono text-[7.5px] ${clientDetail.indicators.training.change >= 0 ? 'text-status-green' : 'text-status-red'}`}>
                          {clientDetail.indicators.training.change >= 0 ? '▲' : '▼'} {Math.abs(clientDetail.indicators.training.change)}
                        </span>
                      </div>
                      <div className="w-[1px] h-8 bg-dark-border/30" />
                      <div>
                        <span className="text-gray-500 uppercase font-bold block leading-none">NPS</span>
                        <span className="text-white font-mono font-bold block my-1">{clientDetail.indicators.nps.value}</span>
                        <span className={`font-bold font-mono text-[7.5px] ${clientDetail.indicators.nps.change > 0 ? 'text-status-green' : 'text-status-red'}`}>
                          {clientDetail.indicators.nps.change > 0 ? '▲' : '▼'} {Math.abs(clientDetail.indicators.nps.change)} p.p.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial & Products (5/12) */}
                  <div className="grid grid-rows-2 gap-4 lg:col-span-5 min-h-[300px]">
                    
                    {/* Financial stats */}
                    <div className="glass-card p-4 rounded-xl flex flex-col justify-between text-[9px] leading-tight">
                      <div className="border-b border-dark-border/40 pb-2 mb-2 flex items-center justify-between">
                        <span className="text-gray-500 uppercase font-bold">Resumo Financeiro</span>
                        <button className="text-[8.5px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver detalhes</button>
                      </div>
                      
                      <div className="flex-grow flex flex-col justify-around py-1 text-gray-300 font-medium">
                        <div className="flex justify-between">
                          <span>Total Contratado</span>
                          <span className="text-white font-mono font-bold">{formatValue(clientDetail.financial.total, 'currency')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Recebido</span>
                          <span className="text-white font-mono font-bold text-status-green">{formatValue(clientDetail.financial.received, 'currency')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>A Receber</span>
                          <span className="text-white font-mono font-bold text-status-cyan">{formatValue(clientDetail.financial.remaining, 'currency')}</span>
                        </div>
                        <div className="flex justify-between border-t border-dark-border/20 pt-1.5 mt-1">
                          <div className="flex flex-col">
                            <span>Próxima parcela</span>
                            <span className="text-gray-500 text-[8px] mt-0.5 font-mono">{clientDetail.financial.nextDue}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-status-green/10 border border-status-green/30 text-status-green font-bold text-[8px] flex items-center gap-1 select-none">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            {clientDetail.financial.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Products list */}
                    <div className="glass-card p-4 rounded-xl flex flex-col justify-between text-[9px] leading-tight">
                      <div className="border-b border-dark-border/40 pb-2 mb-2 flex items-center justify-between">
                        <span className="text-gray-500 uppercase font-bold">Produtos Contratados</span>
                        <button className="text-[8.5px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todos</button>
                      </div>

                      <div className="flex-grow grid grid-cols-2 gap-1.5 py-1 text-gray-300 select-none">
                        {clientDetail.products.map((prod, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 truncate">
                            <CheckCircle2 className="w-3.5 h-3.5 text-status-green shrink-0" />
                            <span className="truncate">{prod}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* PLACEHOLDER VIEWS FOR OTHER COCKPIT TABS */}
            {detailTab !== 'visao-geral' && (
              <div className="glass-card p-12 rounded-xl text-center border-dashed border-dark-border flex flex-col items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 text-brand-gold-start animate-bounce" />
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">Aba {detailTab.replace('-', ' ')} em Desenvolvimento</h4>
                <p className="text-gray-500 text-[9px] max-w-sm">Este painel específico está sendo integrado e mapeado. Os atalhos de visualização de timeline e dados financeiros permanecem visíveis na Visão Geral.</p>
              </div>
            )}

          </div>

        </section>
      )}

      {/* Floating help action button at the bottom right */}
      <button className="fixed bottom-6 right-6 w-11 h-11 bg-status-blue hover:bg-[#1a73e8] text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 border border-[#3b82f6]/40 select-none z-50 animate-bounce">
        <HelpCircle className="w-5 h-5" />
      </button>

    </div>
  );
};

export default ClientesTab;
