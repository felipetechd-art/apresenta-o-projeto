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
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  LineChart
} from 'lucide-react';

const FinanceiroTab = ({ data, formatValue }) => {
  if (!data) return null;

  const {
    kpis,
    fluxoDeCaixa,
    projecoes,
    recebimentos,
    recebimentosTotalPrevisto,
    contasPagarProximas,
    contasPagarTotal,
    receitaProduto,
    receitaProdutoTotal,
    dre,
    mrr,
    despesas,
    despesasTotal,
    inadimplencia,
    inadimplenciaTotal,
    rentabilidade,
    rentabilidadeTotal,
    roiArea,
    roiAreaTotal,
    cenariosCaixa,
    metasFinanceiras,
    alerts,
    insights
  } = data;

  // 1. ApexCharts: Fluxo de Caixa (Diário)
  const flowChartOptions = {
    chart: {
      type: 'line',
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false },
      parentHeightOffset: 0
    },
    colors: ['#10b981', '#ef4444', '#3b82f6'], // Entradas (Green), Saídas (Red), Saldo (Blue)
    stroke: {
      width: [0, 0, 3],
      curve: 'smooth'
    },
    plotOptions: {
      bar: {
        columnWidth: '45%',
        borderRadius: 2
      }
    },
    grid: {
      borderColor: 'rgba(27, 42, 63, 0.3)',
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    xaxis: {
      categories: fluxoDeCaixa.dates,
      labels: { style: { colors: '#94a3b8', fontSize: '9px', fontFamily: 'Inter' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '9px', fontFamily: 'Inter' },
        formatter: (val) => {
          if (val >= 1000000 || val <= -1000000) return `R$ ${(val / 1000000).toFixed(1)}M`;
          if (val >= 1000 || val <= -1000) return `R$ ${(val / 1000).toFixed(0)}K`;
          return `R$ ${val}`;
        }
      }
    },
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
        formatter: (val) => val ? `R$ ${val.toLocaleString('pt-BR')}` : 'R$ 0'
      }
    }
  };

  const flowChartSeries = [
    { name: 'Entradas', type: 'column', data: fluxoDeCaixa.entradas },
    { name: 'Saídas', type: 'column', data: fluxoDeCaixa.saidas },
    { name: 'Saldo', type: 'line', data: fluxoDeCaixa.saldo }
  ];

  // 2. ApexCharts: Donut Distribuição de Despesas
  const donutOptions = {
    chart: { type: 'donut' },
    labels: despesas.map(d => d.name),
    colors: despesas.map(d => d.color),
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
              label: 'Total',
              color: '#94a3b8',
              fontSize: '10px',
              fontFamily: 'Inter',
              formatter: () => 'R$ 1,12M'
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

  const donutSeries = despesas.map(d => d.percentage);

  // 3. ApexCharts: Caixa Previsto (Cenários) Lines
  const scenarioChartOptions = {
    chart: {
      type: 'line',
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#3b82f6', '#10b981', '#ef4444'], // Realista (Blue), Otimista (Green), Pessimista (Red)
    stroke: {
      width: 2.5,
      curve: 'straight'
    },
    grid: {
      borderColor: 'rgba(27, 42, 63, 0.2)',
      strokeDashArray: 2
    },
    xaxis: {
      categories: cenariosCaixa.dates,
      labels: { style: { colors: '#94a3b8', fontSize: '8.5px', fontFamily: 'Inter' } }
    },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '8.5px', fontFamily: 'Inter' },
        formatter: (val) => {
          if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(1)}M`;
          if (val >= 1000) return `R$ ${(val / 1000).toFixed(0)}K`;
          return `R$ ${val}`;
        }
      }
    },
    legend: { show: false },
    tooltip: { theme: 'dark' }
  };

  const scenarioChartSeries = [
    { name: 'Realista', data: cenariosCaixa.realista },
    { name: 'Otimista', data: cenariosCaixa.otimista },
    { name: 'Pessimista', data: cenariosCaixa.pessimista }
  ];

  // 4. MRR Sparkline config
  const mrrSparkOptions = {
    chart: { type: 'line', sparkline: { enabled: true } },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#3b82f6'],
    tooltip: { enabled: false }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 8 TOP LEVEL KPI CARDS */}
      <section className="grid grid-cols-2 lg:grid-cols-8 gap-3.5">
        
        {/* KPI 1: Caixa Atual */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Caixa Atual</span>
            <Wallet className="w-3.5 h-3.5 text-status-blue" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {formatValue(kpis.caixaAtual.value, 'currency')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.caixaAtual.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs ontem</span>
          </div>
        </div>

        {/* KPI 2: Receita Recebida */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Receita Recebida</span>
            <DollarSign className="w-3.5 h-3.5 text-status-green" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {formatValue(kpis.receitaRecebida.value, 'currency')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.receitaRecebida.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 3: Receita Contratada */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Receita Contratada</span>
            <FileText className="w-3.5 h-3.5 text-status-purple" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {formatValue(kpis.receitaContratada.value, 'currency')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.receitaContratada.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 4: Contas a Receber */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Contas a Receber</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-status-cyan" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {formatValue(kpis.contasReceber.value, 'currency')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.contasReceber.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 5: Contas a Pagar */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Contas a Pagar</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-status-red" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {formatValue(kpis.contasPagar.value, 'currency')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▼ {Math.abs(kpis.contasPagar.change)}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 6: Fluxo Projetado (90d) */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Fluxo Projetado (90d)</span>
            <LineChart className="w-3.5 h-3.5 text-status-blue" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {formatValue(kpis.fluxoProjetado.value, 'currency')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.fluxoProjetado.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs proj. anterior</span>
          </div>
        </div>

        {/* KPI 7: Margem Operacional */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Margem Operacional</span>
            <Percent className="w-3.5 h-3.5 text-status-yellow" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {kpis.margemOperacional.value}%
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.margemOperacional.change} p.p.</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

        {/* KPI 8: Lucro Líquido */}
        <div className="glass-card p-3 rounded-xl flex flex-col justify-between min-h-[96px]">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[8px] font-bold uppercase tracking-wider">Lucro Líquido</span>
            <Activity className="w-3.5 h-3.5 text-status-green" />
          </div>
          <div className="my-1.5">
            <span className="text-base md:text-lg font-heading font-black text-white font-mono block">
              {formatValue(kpis.lucroLiquido.value, 'currency')}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-[8px] text-status-green font-bold">
            <span>▲ {kpis.lucroLiquido.change}%</span>
            <span className="text-gray-500 font-medium normal-case">vs anterior</span>
          </div>
        </div>

      </section>

      {/* ROW 2: CASHFLOW, SALDO PROJ, RECEBIMENTOS, PAYABLES GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Fluxo de Caixa (4/12 wide) */}
        <div className="glass-card p-5 rounded-xl xl:col-span-4 flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Fluxo de Caixa</h3>
          </div>
          <div className="flex-grow flex items-center select-none">
            <div className="w-full h-[250px]">
              <Chart
                options={flowChartOptions}
                series={flowChartSeries}
                type="line"
                height="100%"
                width="100%"
              />
            </div>
          </div>
        </div>

        {/* Projeção de Saldo (2/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-2 flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-dark-border pb-2.5 mb-3">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Projeção de Saldo</h3>
          </div>

          <div className="flex flex-col gap-3.5 flex-grow justify-around py-2">
            <div>
              <span className="text-[9px] text-gray-500 font-medium">Hoje</span>
              <span className="text-sm font-black text-white font-mono block mt-0.5">
                {formatValue(projecoes.today, 'currency-full')}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-gray-500 font-medium">Próximos 30 dias</span>
              <span className="text-sm font-black text-white font-mono block mt-0.5">
                {formatValue(projecoes.d30, 'currency-full')}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-gray-500 font-medium">Próximos 60 dias</span>
              <span className="text-sm font-black text-white font-mono block mt-0.5">
                {formatValue(projecoes.d60, 'currency-full')}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-gray-500 font-medium">Próximos 90 dias</span>
              <span className="text-sm font-black text-white font-mono block mt-0.5">
                {formatValue(projecoes.d90, 'currency-full')}
              </span>
            </div>
          </div>

          <div className="mt-2 border-t border-dark-border/40 pt-3 relative">
            <select className="w-full bg-[#0d1726] border border-dark-border text-gray-300 text-[10px] rounded-lg py-1.5 px-2 focus:outline-none appearance-none cursor-pointer">
              <option>Cenário: Realista</option>
              <option>Cenário: Otimista</option>
              <option>Cenário: Pessimista</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-[18px] pointer-events-none" />
          </div>
        </div>

        {/* Recebimentos Próximos Table (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Recebimentos (Próximos)</h3>
            <button className="text-[9px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todas</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Data</th>
                  <th className="py-2">Descrição</th>
                  <th className="py-2 text-right">Valor</th>
                  <th className="py-2">Origem</th>
                  <th className="py-2 px-1 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {recebimentos.map((r, idx) => {
                  let badgeClass = 'bg-status-blue/10 text-status-blue border-status-blue/20';
                  if (r.status === 'Amanhã' || r.status === 'Sexta') badgeClass = 'bg-status-green/10 text-status-green border-status-green/20';
                  if (r.status === 'Próx. semana') badgeClass = 'bg-status-yellow/10 text-status-yellow border-status-yellow/20';

                  return (
                    <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                      <td className="py-2 font-mono text-gray-400">{r.date}</td>
                      <td className="py-2 font-medium text-white max-w-[65px] truncate">{r.desc}</td>
                      <td className="py-2 text-right font-mono">{formatValue(r.value, 'currency')}</td>
                      <td className="py-2 text-gray-400 font-medium">{r.origin}</td>
                      <td className="py-2 px-1 text-right">
                        <span className={`px-1 rounded-[3px] text-[7.5px] font-bold uppercase tracking-wider border ${badgeClass}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-dark-border/40 pt-2.5 mt-2 flex items-center justify-between text-[10px] bg-black/15 p-2 rounded-lg">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[8px]">Total Previsto</span>
            <span className="text-brand-gold-start font-black font-mono">{formatValue(recebimentosTotalPrevisto, 'currency')}</span>
          </div>
        </div>

        {/* Contas a Pagar Próximas Table (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-dark-border pb-2.5 mb-3 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Contas a Pagar (Próximas)</h3>
            <button className="text-[9px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todas</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Vencimento</th>
                  <th className="py-2">Descrição</th>
                  <th className="py-2 text-right">Valor</th>
                  <th className="py-2 px-1 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {contasPagarProximas.map((c, idx) => {
                  let badgeClass = 'bg-status-red/10 text-status-red border-status-red/20';
                  if (c.status === 'Amanhã') badgeClass = 'bg-status-yellow/10 text-status-yellow border-status-yellow/20';
                  if (c.status === '3 dias') badgeClass = 'bg-status-green/10 text-status-green border-status-green/20';

                  return (
                    <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                      <td className="py-2 font-mono text-gray-400">{c.due}</td>
                      <td className="py-2 font-medium text-white max-w-[80px] truncate">{c.desc}</td>
                      <td className="py-2 text-right font-mono">{formatValue(c.value, 'currency')}</td>
                      <td className="py-2 px-1 text-right">
                        <span className={`px-1.5 rounded-[3px] text-[7.5px] font-bold uppercase tracking-wider border ${badgeClass}`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-dark-border/40 pt-2.5 mt-2 flex items-center justify-between text-[10px] bg-black/15 p-2 rounded-lg">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-[8px]">Total a Pagar</span>
            <span className="text-status-blue font-black font-mono">{formatValue(contasPagarTotal, 'currency')}</span>
          </div>
        </div>

      </section>

      {/* ROW 3: RECEITA POR PRODUTO, DRE, MRR, DISTRIBUIÇÃO DESPESAS GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Receita por Produto (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[340px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Receita por Produto</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver relatório</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[9.5px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Produto</th>
                  <th className="py-2 text-right">Contratado</th>
                  <th className="py-2 text-right">Recebido</th>
                  <th className="py-2 text-right">A Receber</th>
                  <th className="py-2 text-right px-1">% Rec.</th>
                </tr>
              </thead>
              <tbody>
                {receitaProduto.map((p, idx) => (
                  <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors animate-fade-in">
                    <td className="py-2 font-medium text-white max-w-[65px] truncate">{p.name}</td>
                    <td className="py-2 text-right font-mono">{formatValue(p.contracted, 'currency')}</td>
                    <td className="py-2 text-right font-mono">{formatValue(p.received, 'currency')}</td>
                    <td className="py-2 text-right font-mono">{formatValue(p.toReceive, 'currency')}</td>
                    <td className="py-2 text-right px-1">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="w-8 h-1 bg-black/35 rounded-full overflow-hidden shrink-0 border border-dark-border/20">
                          <div className="h-full bg-status-green rounded-full" style={{ width: `${p.percentage}%` }} />
                        </div>
                        <span className="font-mono font-bold text-white shrink-0">{p.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-black/25 font-bold border-t border-dark-border text-white uppercase tracking-wide">
                  <td className="py-2">Total</td>
                  <td className="py-2 text-right font-mono">{formatValue(receitaProdutoTotal.contracted, 'currency')}</td>
                  <td className="py-2 text-right font-mono">{formatValue(receitaProdutoTotal.received, 'currency')}</td>
                  <td className="py-2 text-right font-mono">{formatValue(receitaProdutoTotal.toReceive, 'currency')}</td>
                  <td className="py-2 text-right px-1 font-mono text-brand-gold-start">{receitaProdutoTotal.percentage}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* DRE Gerencial Acumulado (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[340px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">DRE Gerencial (Acumulado)</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver relatório</button>
          </div>

          <div className="flex flex-col gap-1.5 text-[10px] flex-grow justify-around py-1">
            <div className="flex justify-between border-b border-dark-border/20 pb-1">
              <span className="text-gray-400 font-medium">Receita Bruta</span>
              <div className="flex gap-4 font-mono">
                <span className="text-white font-bold">{formatValue(dre.receitaBruta.value, 'currency-full')}</span>
                <span className="text-gray-500 w-8 text-right">{dre.receitaBruta.percentage}%</span>
              </div>
            </div>
            <div className="flex justify-between border-b border-dark-border/20 pb-1 text-status-red font-medium">
              <span>(-) Impostos</span>
              <div className="flex gap-4 font-mono">
                <span>{formatValue(dre.impostos.value, 'currency-full')}</span>
                <span className="w-8 text-right">{dre.impostos.percentage}%</span>
              </div>
            </div>
            <div className="flex justify-between border-b border-dark-border/20 pb-1 font-bold">
              <span className="text-white">Receita Líquida</span>
              <div className="flex gap-4 font-mono">
                <span className="text-white">{formatValue(dre.receitaLiquida.value, 'currency-full')}</span>
                <span className="text-gray-400 w-8 text-right">{dre.receitaLiquida.percentage}%</span>
              </div>
            </div>
            <div className="flex justify-between border-b border-dark-border/20 pb-1 text-gray-400 font-medium">
              <span>(-) Custos Variáveis</span>
              <div className="flex gap-4 font-mono text-status-red">
                <span>{formatValue(dre.custosVariaveis.value, 'currency-full')}</span>
                <span className="text-gray-500 w-8 text-right">{dre.custosVariaveis.percentage}%</span>
              </div>
            </div>
            <div className="flex justify-between border-b border-dark-border/20 pb-1 font-bold">
              <span className="text-white">Margem de Contribuição</span>
              <div className="flex gap-4 font-mono">
                <span className="text-white">{formatValue(dre.margemContribuicao.value, 'currency-full')}</span>
                <span className="text-gray-400 w-8 text-right">{dre.margemContribuicao.percentage}%</span>
              </div>
            </div>
            <div className="flex justify-between border-b border-dark-border/20 pb-1 text-gray-400 font-medium">
              <span>(-) Custos Fixos</span>
              <div className="flex gap-4 font-mono text-status-red">
                <span>{formatValue(dre.custosFixos.value, 'currency-full')}</span>
                <span className="text-gray-500 w-8 text-right">{dre.custosFixos.percentage}%</span>
              </div>
            </div>
            <div className="flex justify-between border-b border-dark-border/20 pb-1 font-bold">
              <span className="text-[#06b6d4]">EBITDA</span>
              <div className="flex gap-4 font-mono">
                <span className="text-white">{formatValue(dre.ebitda.value, 'currency-full')}</span>
                <span className="text-gray-400 w-8 text-right">{dre.ebitda.percentage}%</span>
              </div>
            </div>
            <div className="flex justify-between border-b border-dark-border/20 pb-1 text-gray-400 font-medium">
              <span>(-) Despesas Financeiras</span>
              <div className="flex gap-4 font-mono text-status-red">
                <span>{formatValue(dre.despesasFinanceiras.value, 'currency-full')}</span>
                <span className="text-gray-500 w-8 text-right">{dre.despesasFinanceiras.percentage}%</span>
              </div>
            </div>
            <div className="flex justify-between font-extrabold text-[#10b981] bg-[#10b981]/5 p-1 rounded">
              <span>Lucro Líquido</span>
              <div className="flex gap-4 font-mono">
                <span>{formatValue(dre.lucroLiquido.value, 'currency-full')}</span>
                <span className="w-8 text-right">{dre.lucroLiquido.percentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Receita Recorrente MRR (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[340px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Receita Recorrente (MRR)</h3>
          </div>

          <div className="flex items-center justify-between gap-4 py-2 shrink-0">
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">MRR Atual</span>
              <span className="text-lg font-black text-white font-mono mt-0.5">{formatValue(mrr.value, 'currency-full')}</span>
              <span className="text-[8px] text-status-green font-bold flex items-center gap-0.5 mt-0.5">
                ▲ {mrr.change}% <span className="text-gray-500 font-medium normal-case">vs mês anterior</span>
              </span>
            </div>
            
            <div className="w-[80px] h-[30px]">
              <Chart options={mrrSparkOptions} series={[{ data: mrr.sparkline }]} type="line" height="100%" width="100%" />
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-grow justify-around text-[10px] border-t border-dark-border/40 pt-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Novas Assinaturas</span>
              <span className="text-status-green font-bold font-mono">+{formatValue(mrr.details.novasAssinaturas, 'currency-full')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Cancelamentos</span>
              <span className="text-status-red font-bold font-mono">{formatValue(mrr.details.cancelamentos, 'currency-full')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Upgrades</span>
              <span className="text-status-green font-bold font-mono">+{formatValue(mrr.details.upgrades, 'currency-full')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Downgrades</span>
              <span className="text-status-red font-bold font-mono">{formatValue(mrr.details.downgrades, 'currency-full')}</span>
            </div>
            <div className="flex justify-between border-t border-dark-border/20 pt-1.5 font-bold">
              <span className="text-white">Churn Financeiro</span>
              <span className="text-status-yellow font-mono">{mrr.details.churn}%</span>
            </div>
          </div>
        </div>

        {/* Distribuição de Despesas Donut (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[340px]">
          <div className="border-b border-dark-border pb-2.5 mb-2 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Distribuição de Despesas</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver detalhes</button>
          </div>

          <div className="w-full h-[120px] flex items-center justify-center relative select-none">
            <Chart options={donutOptions} series={donutSeries} type="donut" height="100%" width="100%" />
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-1.5 mt-2.5 text-[9px] flex-grow justify-around border-t border-dark-border/40 pt-2.5">
            {despesas.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                  <span className="font-medium truncate max-w-[80px]">{item.name}</span>
                </div>
                <div className="flex gap-3 font-mono shrink-0">
                  <span className="text-gray-500">{item.percentage}%</span>
                  <span className="text-white font-bold">{formatValue(item.value, 'currency-full')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ROW 4: INADIMPLÊNCIA, RENTABILIDADE, ROI POR ÁREA, CAIXA PREVISTO CENÁRIOS */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Inadimplência Table (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[300px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Inadimplência</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todas</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[9.5px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Faixa</th>
                  <th className="py-2 text-right">Quantidade</th>
                  <th className="py-2 text-right">Valor</th>
                  <th className="py-2 text-right px-1">% Total</th>
                </tr>
              </thead>
              <tbody>
                {inadimplencia.map((item, idx) => {
                  let pctColor = 'text-white';
                  if (item.range.includes('30') || item.range.includes('60')) pctColor = 'text-status-red';

                  return (
                    <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                      <td className="py-2 font-medium text-white">{item.range}</td>
                      <td className="py-2 text-right font-mono">{item.count}</td>
                      <td className="py-2 text-right font-mono">{formatValue(item.value, 'currency')}</td>
                      <td className={`py-2 text-right font-mono px-1 font-bold ${pctColor}`}>{item.percentage}%</td>
                    </tr>
                  );
                })}
                <tr className="bg-black/25 font-bold border-t border-dark-border text-white uppercase tracking-wide">
                  <td className="py-2">Total</td>
                  <td className="py-2 text-right font-mono">{inadimplenciaTotal.count}</td>
                  <td className="py-2 text-right font-mono text-brand-gold-start">{formatValue(inadimplenciaTotal.value, 'currency')}</td>
                  <td className="py-2 text-right font-mono px-1 text-brand-gold-start">{inadimplenciaTotal.percentage}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Rentabilidade por Produto (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[300px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Rentabilidade por Produto</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver detalhes</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[9.5px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Produto</th>
                  <th className="py-2 text-right">Receita</th>
                  <th className="py-2 text-right">Custo</th>
                  <th className="py-2 text-right px-1">Margem (%)</th>
                </tr>
              </thead>
              <tbody>
                {rentabilidade.slice(0, 4).map((r, idx) => (
                  <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                    <td className="py-2 font-medium text-white max-w-[80px] truncate">{r.product}</td>
                    <td className="py-2 text-right font-mono">{formatValue(r.revenue, 'currency')}</td>
                    <td className="py-2 text-right font-mono text-status-red">{formatValue(r.cost, 'currency')}</td>
                    <td className="py-2 text-right px-1 font-mono font-bold text-white">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="w-8 h-1 bg-black/35 rounded-full overflow-hidden shrink-0 border border-dark-border/20">
                          <div className="h-full bg-status-green rounded-full" style={{ width: `${r.margin}%` }} />
                        </div>
                        <span className="shrink-0">{r.margin}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-black/25 font-bold border-t border-dark-border text-white uppercase tracking-wide">
                  <td className="py-2">Total</td>
                  <td className="py-2 text-right font-mono">{formatValue(rentabilidadeTotal.revenue, 'currency')}</td>
                  <td className="py-2 text-right font-mono text-status-red">{formatValue(rentabilidadeTotal.cost, 'currency')}</td>
                  <td className="py-2 text-right font-mono px-1 text-brand-gold-start">{rentabilidadeTotal.margin}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ROI por Área (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[300px]">
          <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">ROI por Área</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver detalhes</button>
          </div>

          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse text-[9.5px]">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-2">Área</th>
                  <th className="py-2 text-right">Investimento</th>
                  <th className="py-2 text-right">Retorno</th>
                  <th className="py-2 text-right px-1">ROI</th>
                </tr>
              </thead>
              <tbody>
                {roiArea.map((item, idx) => (
                  <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                    <td className="py-2 font-medium text-white">{item.area}</td>
                    <td className="py-2 text-right font-mono">{formatValue(item.investment, 'currency')}</td>
                    <td className="py-2 text-right font-mono">{formatValue(item.returnVal, 'currency')}</td>
                    <td className="py-2 text-right px-1 font-mono font-bold text-white">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="w-8 h-1 bg-black/35 rounded-full overflow-hidden shrink-0 border border-dark-border/20">
                          <div className="h-full bg-status-green rounded-full" style={{ width: `${Math.min(100, item.roi / 8)}%` }} />
                        </div>
                        <span className="shrink-0">{item.roi}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-black/25 font-bold border-t border-dark-border text-white uppercase tracking-wide">
                  <td className="py-2">Empresa Total</td>
                  <td className="py-2 text-right font-mono">{formatValue(roiAreaTotal.investment, 'currency')}</td>
                  <td className="py-2 text-right font-mono">{formatValue(roiAreaTotal.returnVal, 'currency')}</td>
                  <td className="py-2 text-right font-mono px-1 text-brand-gold-start">{roiAreaTotal.roi}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Caixa Previsto Cenários (3/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-3 flex flex-col justify-between min-h-[300px]">
          <div className="border-b border-dark-border pb-2 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Caixa Previsto (Cenários)</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver detalhes</button>
          </div>

          <div className="overflow-x-auto my-1.5">
            <table className="w-full text-left border-collapse text-[8.5px] leading-tight">
              <thead>
                <tr className="border-b border-dark-border/60 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-1">Período</th>
                  <th className="py-1 text-right text-status-blue">Realista</th>
                  <th className="py-1 text-right text-status-green">Otimista</th>
                  <th className="py-1 text-right px-1 text-status-red">Pessimista</th>
                </tr>
              </thead>
              <tbody>
                {cenariosCaixa.dates.map((d, idx) => (
                  <tr key={idx} className="border-b border-dark-border/30 hover:bg-white/5 text-gray-300 transition-colors">
                    <td className="py-1 font-medium text-white">{d}</td>
                    <td className="py-1 text-right font-mono font-medium">{formatValue(cenariosCaixa.realista[idx], 'currency-full')}</td>
                    <td className="py-1 text-right font-mono font-medium">{formatValue(cenariosCaixa.otimista[idx], 'currency-full')}</td>
                    <td className="py-1 text-right font-mono px-1 font-medium">{formatValue(cenariosCaixa.pessimista[idx], 'currency-full')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex-grow flex items-center select-none">
            <div className="w-full h-[90px]">
              <Chart options={scenarioChartOptions} series={scenarioChartSeries} type="line" height="100%" width="100%" />
            </div>
          </div>
        </div>

      </section>

      {/* ROW 5: METAS FINANCEIRAS, ALERTAS, IA INSIGHTS GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Metas Financeiras (4/12 wide) */}
        <div className="glass-card p-4 rounded-xl xl:col-span-4 flex flex-col justify-between min-h-[200px]">
          <div className="border-b border-dark-border pb-2.5 mb-2 flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Metas Financeiras</h3>
            <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver metas</button>
          </div>

          <div className="flex-grow flex flex-col justify-around gap-1.5 text-[9.5px]">
            {metasFinanceiras.map((goal, idx) => (
              <div key={idx} className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between text-gray-400 font-medium">
                  <span>{goal.label}</span>
                  <span className="text-white font-bold">{goal.percentage}%</span>
                </div>
                {/* Progress bar container */}
                <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden border border-dark-border/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-status-blue to-status-green transition-all duration-500"
                    style={{ width: `${Math.min(100, goal.percentage)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[7.5px] text-gray-500 font-mono mt-px">
                  <span>{goal.isPercent ? `${goal.current}%` : formatValue(goal.current, 'currency-full')}</span>
                  <span>Proj: {goal.isPercent ? `${goal.projection}%` : formatValue(goal.projection, 'currency-full')}</span>
                  <span>Meta: {goal.isPercent ? `${goal.target}%` : formatValue(goal.target, 'currency-full')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas Financeiros (4/12 wide) */}
        <div className="glass-card p-5 rounded-xl xl:col-span-4 flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
              <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Alertas Financeiros</h3>
              <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todos</button>
            </div>

            <div className="flex flex-col gap-2">
              {alerts.map((alert, idx) => {
                let alertClass = 'border-status-blue/30 bg-status-blue/5 text-gray-300';
                let iconColor = 'text-status-blue';
                if (idx === 0 || idx === 2 || idx === 4) {
                  alertClass = 'border-status-red/30 bg-status-red/5 text-gray-300';
                  iconColor = 'text-status-red';
                } else if (idx === 1 || idx === 3) {
                  alertClass = 'border-status-yellow/30 bg-status-yellow/5 text-gray-300';
                  iconColor = 'text-status-yellow';
                }

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 p-2 rounded-lg border text-[10px] leading-snug hover:bg-white/5 cursor-pointer transition-colors ${alertClass}`}
                  >
                    <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${iconColor} mt-0.5`} />
                    <span className="font-medium">{alert.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Insights IA Financeira (4/12 wide) */}
        <div className="glass-card p-5 rounded-xl xl:col-span-4 flex flex-col justify-between min-h-[200px]">
          <div>
            <div className="border-b border-dark-border pb-2.5 mb-2.5 flex items-center justify-between">
              <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-brand-gold-start" />
                Insights da IA Financeira
              </h3>
              <button className="text-[10px] text-gray-500 hover:text-brand-gold-start font-semibold">Ver todos</button>
            </div>

            <div className="flex flex-col gap-2 text-[10px] leading-relaxed">
              {insights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-status-green mt-1.5 pulse-dot"></span>
                  <p className="text-gray-300 font-medium">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};

export default FinanceiroTab;
