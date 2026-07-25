import React, { useState, useEffect } from 'react';
import { X, Save, TrendingUp, Users, Target, ShieldAlert, Award, Calendar, CheckCircle2, Play, RefreshCw, BarChart2 } from 'lucide-react';

export default function ClientGovernanceCenter({ 
  onClose, 
  clientName = 'Empresário PGE',
  totalInvestment = 'R$ 80.000,00',
  hourlyRate = '150',
  hoursPerWeek = '44',
  strategicPercent = '20',
  calculatedOpportunityCost = 0,
  calculatedLostGrowth = 0
}) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'entry'
  const [selectedMonth, setSelectedMonth] = useState(1); // 1 to 12
  const [activeMonthForDashboard, setActiveMonthForDashboard] = useState(1);
  const [strategicPriority, setStrategicPriority] = useState('Liderança & Processos');

  // Initial mockup progression data
  const [monthlyData, setMonthlyData] = useState(() => {
    const data = [];
    const baseIde = 85;
    const baseAutonomia = 12;
    const baseProcessos = 0;
    const baseDecisões = 35;
    const baseGovernanca = 0;

    for (let m = 1; m <= 12; m++) {
      const factor = (m - 1) / 11; // 0 to 1
      data.push({
        month: m,
        ide: Math.round(baseIde - (baseIde - 15) * factor),
        autonomia: Math.round(baseAutonomia + (100 - baseAutonomia) * factor),
        processos: Math.round(baseProcessos + (100 - baseProcessos) * factor),
        decisoes: Math.round(baseDecisões - (baseDecisões - 2) * factor),
        governanca: Math.round(baseGovernanca + (100 - baseGovernanca) * factor)
      });
    }
    return data;
  });

  // Local state for editing form
  const [editIde, setEditIde] = useState('85');
  const [editAutonomia, setEditAutonomia] = useState('12');
  const [editProcessos, setEditProcessos] = useState('0');
  const [editDecisoes, setEditDecisoes] = useState('35');
  const [editGovernanca, setEditGovernanca] = useState('0');

  // Load selected month's data into form editor
  useEffect(() => {
    const current = monthlyData.find(d => d.month === selectedMonth);
    if (current) {
      setEditIde(current.ide.toString());
      setEditAutonomia(current.autonomia.toString());
      setEditProcessos(current.processos.toString());
      setEditDecisoes(current.decisoes.toString());
      setEditGovernanca(current.governanca.toString());
    }
  }, [selectedMonth, monthlyData]);

  const handleSaveMonthData = (e) => {
    e.preventDefault();
    setMonthlyData(prev => prev.map(d => {
      if (d.month === selectedMonth) {
        return {
          ...d,
          ide: Math.min(100, Math.max(0, parseInt(editIde) || 0)),
          autonomia: Math.min(100, Math.max(0, parseInt(editAutonomia) || 0)),
          processos: Math.min(100, Math.max(0, parseInt(editProcessos) || 0)),
          decisoes: Math.max(0, parseInt(editDecisoes) || 0),
          governanca: Math.min(100, Math.max(0, parseInt(editGovernanca) || 0))
        };
      }
      return d;
    }));
    setActiveMonthForDashboard(selectedMonth);
    setActiveTab('dashboard');
  };

  // Get active dashboard data
  const currentMetrics = monthlyData.find(d => d.month === activeMonthForDashboard) || monthlyData[0];

  // Calculate current evolution level based on IDE
  // 1. Operação (> 70% dependency)
  // 2. Gestão (50% to 70% dependency)
  // 3. Liderança (30% to 50% dependency)
  // 4. Governo (< 30% dependency)
  let currentLevel = 'Operação';
  let currentLevelDesc = 'Fundador é gargalo operacional total do negócio.';
  let activeLevelIdx = 1;

  if (currentMetrics.ide <= 25) {
    currentLevel = 'Governo';
    currentLevelDesc = 'Empresa roda de forma autônoma. Fundador atua no conselho.';
    activeLevelIdx = 4;
  } else if (currentMetrics.ide <= 50) {
    currentLevel = 'Liderança';
    currentLevelDesc = 'Lideranças operacionais ativas e respondendo pela entrega.';
    activeLevelIdx = 3;
  } else if (currentMetrics.ide <= 70) {
    currentLevel = 'Gestão';
    currentLevelDesc = 'Fundador coordena e monitora equipe, mas sem atuar no operacional.';
    activeLevelIdx = 2;
  }

  // Helper for currency styling
  const opportunityCostFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(calculatedOpportunityCost);

  // SVG Chart Dimensions & calculation helper
  const chartWidth = 520;
  const chartHeight = 180;
  const padding = 25;

  const getPoints = (key) => {
    return monthlyData.map(d => {
      const x = padding + ((d.month - 1) / 11) * (chartWidth - padding * 2);
      // y-axis is inverted: 0 is at top, chartHeight at bottom
      const val = d[key];
      const y = chartHeight - padding - (val / 100) * (chartHeight - padding * 2);
      return { x, y, val };
    });
  };

  const idePoints = getPoints('ide');
  const autonomyPoints = getPoints('autonomia');

  const makePathString = (points) => {
    return points.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#02060c]/95 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#080f1e] border border-[#d4af37]/35 rounded-2xl w-full max-w-6xl shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col my-4">
        
        {/* Header */}
        <div className="border-b border-gray-800 p-4 sm:p-5 flex items-center justify-between bg-black/30 rounded-t-2xl">
          <div className="text-left">
            <span className="text-[10px] font-accent text-[#d4af37] font-bold uppercase tracking-widest block">Programa Governo Empresarial</span>
            <h2 className="text-lg sm:text-xl font-heading font-extrabold text-white uppercase flex items-center gap-2">
              Centro de Governança PGE <span className="text-gray-500 font-normal">|</span> <span className="text-[#ffd700]">{clientName}</span>
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-gray-800 bg-[#050a14] px-4 py-2 gap-3">
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'dashboard' 
                  ? 'bg-[#d4af37] text-black shadow-[0_0_10px_rgba(212,175,55,0.25)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Painel de Controle
            </button>
            <button 
              onClick={() => setActiveTab('entry')}
              className={`px-4 py-2 rounded-lg text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'entry' 
                  ? 'bg-[#d4af37] text-black shadow-[0_0_10px_rgba(212,175,55,0.25)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Lançamento Mensal
            </button>
          </div>

          {/* Quick Metrics Config */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 text-[10px] uppercase font-bold">Mês Visualizado:</span>
              <select 
                value={activeMonthForDashboard}
                onChange={(e) => setActiveMonthForDashboard(parseInt(e.target.value))}
                className="bg-black/50 border border-gray-800 rounded px-2.5 py-1 text-white font-bold outline-none focus:border-[#d4af37]"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i+1} value={i+1}>Mês {i+1}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 text-[10px] uppercase font-bold">Foco/Prioridade:</span>
              <select 
                value={strategicPriority}
                onChange={(e) => setStrategicPriority(e.target.value)}
                className="bg-black/50 border border-gray-800 rounded px-2.5 py-1 text-white font-bold outline-none focus:border-[#d4af37]"
              >
                <option value="Liderança & Processos">Liderança & Processos</option>
                <option value="Estruturação Comercial">Estruturação Comercial</option>
                <option value="Processos & Sistemas">Processos & Sistemas</option>
                <option value="Atração de Talentos">Atração de Talentos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' ? (
          <div className="p-4 sm:p-6 space-y-6">
            
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Metric 1: Nível de Evolução */}
              <div className="bg-[#0d1627] border border-gray-800 rounded-xl p-4 flex items-center gap-4 text-left">
                <div className="p-3 bg-[#d4af37]/10 rounded-lg text-[#d4af37] border border-[#d4af37]/20">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Nível de Maturidade</span>
                  <span className="text-lg font-heading font-extrabold text-white block uppercase tracking-wide">{currentLevel}</span>
                  <span className="text-[9px] text-gray-400 font-light mt-0.5 block leading-tight">{currentLevelDesc}</span>
                </div>
              </div>

              {/* Metric 2: IDE */}
              <div className="bg-[#0d1627] border border-gray-800 rounded-xl p-4 flex items-center gap-4 text-left">
                <div className="p-3 bg-[#d4af37]/10 rounded-lg text-[#ffd700] border border-[#d4af37]/20">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Dep. do Dono (IDE)</span>
                  <span className={`text-xl font-heading font-extrabold block ${currentMetrics.ide > 50 ? 'text-red-500' : currentMetrics.ide > 25 ? 'text-orange-500' : 'text-green-500'}`}>
                    {currentMetrics.ide}%
                  </span>
                  <span className="text-[9px] text-gray-400 font-light block">Meta de Segurança: &lt; 15%</span>
                </div>
              </div>

              {/* Metric 3: CLO Recuperado */}
              <div className="bg-[#0d1627] border border-[#34d399]/20 rounded-xl p-4 flex items-center gap-4 text-left">
                <div className="p-3 bg-[#34d399]/10 rounded-lg text-[#34d399] border border-[#34d399]/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Capital Reavido (Tempo)</span>
                  <span className="text-lg font-heading font-extrabold text-[#34d399] block">{opportunityCostFormatted}</span>
                  <span className="text-[9px] text-gray-400 font-light block">Calculado da sua hora intelectual</span>
                </div>
              </div>

              {/* Metric 4: Decisões Centralizadas */}
              <div className="bg-[#0d1627] border border-gray-800 rounded-xl p-4 flex items-center gap-4 text-left">
                <div className="p-3 bg-[#34d399]/10 rounded-lg text-slate-300 border border-gray-800">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Decisões Operacionais / Semana</span>
                  <span className="text-xl font-heading font-extrabold text-white block">{currentMetrics.decisoes}</span>
                  <span className="text-[9px] text-gray-400 font-light block">Passagem de bastão em andamento</span>
                </div>
              </div>

            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column: 3 Pillars & Evolution Levels */}
              <div className="lg:col-span-6 flex flex-col gap-6 text-left">
                
                {/* 3 Pillars */}
                <div className="premium-card p-4 rounded-xl border border-gray-800/80 bg-black/20">
                  <h3 className="text-xs font-heading font-extrabold text-white uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
                    A Transformação do Fundador
                  </h3>
                  <div className="space-y-4">
                    
                    {/* Pillar: Pessoas */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-bold text-slate-200">👥 Pessoas: Liderança Madura & Autônoma</span>
                        <span className="text-[#ffd700] font-mono font-bold">{currentMetrics.autonomia}%</span>
                      </div>
                      <div className="w-full bg-black/40 h-2 rounded-full border border-gray-800 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#d4af37] to-[#ffd700] h-full transition-all duration-500" style={{ width: `${currentMetrics.autonomia}%` }}></div>
                      </div>
                      <p className="text-[9.5px] text-gray-400 mt-1 font-light leading-snug">
                        Lideranças assumindo a operação no dia a dia, da atração/contratação de equipe até a entrega do serviço.
                      </p>
                    </div>

                    {/* Pillar: Processos */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-bold text-slate-200">⚙️ Processos: Engrenagens & Cadência</span>
                        <span className="text-[#ffd700] font-mono font-bold">{currentMetrics.processos}%</span>
                      </div>
                      <div className="w-full bg-black/40 h-2 rounded-full border border-gray-800 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#d4af37] to-[#ffd700] h-full transition-all duration-500" style={{ width: `${currentMetrics.processos}%` }}></div>
                      </div>
                      <p className="text-[9.5px] text-gray-400 mt-1 font-light leading-snug">
                        Mapeamento de rotinas operacionais, definição clara de alçadas executivas e governança estratégica estruturada.
                      </p>
                    </div>

                    {/* Pillar: Indicadores */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-bold text-slate-200">📊 Indicadores: Visibilidade por Dados</span>
                        <span className="text-[#ffd700] font-mono font-bold">{100 - currentMetrics.ide}%</span>
                      </div>
                      <div className="w-full bg-black/40 h-2 rounded-full border border-gray-800 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#d4af37] to-[#ffd700] h-full transition-all duration-500" style={{ width: `${100 - currentMetrics.ide}%` }}></div>
                      </div>
                      <p className="text-[9.5px] text-gray-400 mt-1 font-light leading-snug">
                        Visibilidade total através de métricas chaves (IDE, CLO, KPIs), habilitando decisões puramente baseadas em números.
                      </p>
                    </div>

                  </div>
                </div>

                {/* 4 Levels of Maturity */}
                <div className="premium-card p-4 rounded-xl border border-gray-800/80 bg-black/20">
                  <h3 className="text-xs font-heading font-extrabold text-white uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
                    Escala de Maturidade de Governança
                  </h3>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { name: 'Operação', level: 1, desc: 'Centralizador' },
                      { name: 'Gestão', level: 2, desc: 'Supervisão' },
                      { name: 'Liderança', level: 3, desc: 'Delegação' },
                      { name: 'Governo', level: 4, desc: 'Conselho' }
                    ].map((lvl) => {
                      const isActive = lvl.level === activeLevelIdx;
                      return (
                        <div 
                          key={lvl.level} 
                          className={`p-2 rounded-lg border transition-all duration-300 ${
                            isActive 
                              ? 'bg-[#d4af37]/15 border-[#d4af37] text-white shadow-[0_0_12px_rgba(212,175,55,0.25)]' 
                              : 'bg-black/30 border-gray-900 text-gray-500'
                          }`}
                        >
                          <span className="text-[10px] font-bold uppercase block">{lvl.name}</span>
                          <span className="text-[8px] font-mono block mt-1 opacity-70">{lvl.desc}</span>
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mx-auto mt-1.5 animate-pulse"></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: Dynamic evolution chart */}
              <div className="lg:col-span-6 flex flex-col justify-between premium-card p-4 rounded-xl border border-gray-800/80 bg-black/20 text-left">
                
                <div>
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
                    <h3 className="text-xs font-heading font-extrabold text-white uppercase tracking-wider">
                      Histórico e Projeção (12 Meses)
                    </h3>
                    <div className="flex items-center gap-3 text-[8px] uppercase tracking-wider font-mono">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> IDE (Dep. Dono)</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Autonomia</span>
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div className="w-full bg-black/25 rounded-lg border border-gray-900 p-2 overflow-x-auto">
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[450px]">
                      
                      {/* Grid Lines */}
                      {Array.from({ length: 5 }, (_, i) => {
                        const y = padding + (i / 4) * (chartHeight - padding * 2);
                        const labelVal = 100 - i * 25;
                        return (
                          <g key={i} className="opacity-15">
                            <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#fff" strokeWidth="1" strokeDasharray="3,3" />
                            <text x={padding - 5} y={y + 3} fill="#fff" fontSize="8" textAnchor="end" fontFamily="monospace">{labelVal}%</text>
                          </g>
                        );
                      })}

                      {/* X Axis Labels */}
                      {monthlyData.map((d, idx) => {
                        const x = padding + (idx / 11) * (chartWidth - padding * 2);
                        const isCurrent = d.month === activeMonthForDashboard;
                        return (
                          <text key={idx} x={x} y={chartHeight - 5} fill={isCurrent ? '#ffd700' : '#4b5563'} fontSize="8" fontWeight={isCurrent ? 'bold' : 'normal'} textAnchor="middle">
                            M{d.month}
                          </text>
                        );
                      })}

                      {/* Line 1: IDE */}
                      <path d={makePathString(idePoints)} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" className="opacity-90" />
                      
                      {/* Line 2: Autonomia */}
                      <path d={makePathString(autonomyPoints)} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" className="opacity-90" />

                      {/* Dot highlight for current month */}
                      {(() => {
                        const idePt = idePoints[activeMonthForDashboard - 1];
                        const autoPt = autonomyPoints[activeMonthForDashboard - 1];
                        if (!idePt || !autoPt) return null;
                        return (
                          <g>
                            {/* IDE indicator */}
                            <circle cx={idePt.x} cy={idePt.y} r="5" fill="#ef4444" stroke="#fff" strokeWidth="1.5" className="animate-ping" style={{ transformOrigin: `${idePt.x}px ${idePt.y}px` }} />
                            <circle cx={idePt.x} cy={idePt.y} r="4" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
                            
                            {/* Autonomia indicator */}
                            <circle cx={autoPt.x} cy={autoPt.y} r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" className="animate-ping" style={{ transformOrigin: `${autoPt.x}px ${autoPt.y}px` }} />
                            <circle cx={autoPt.x} cy={autoPt.y} r="4" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                          </g>
                        );
                      })()}

                    </svg>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-800/80 pt-2 flex items-center justify-between text-[9px] text-gray-500 font-mono">
                  <span>Prioridade Atual: <strong className="text-white">{strategicPriority}</strong></span>
                  <span>Ciclo Operacional: Decidir ➔ Executar ➔ Medir ➔ Corrigir ➔ Avançar</span>
                </div>

              </div>

            </div>

            {/* Bottom Row: Unique Mechanism Status (DODAG Tracker) */}
            <div className="premium-card p-4 rounded-xl border border-gray-800/80 bg-black/20 text-left">
              <h3 className="text-xs font-heading font-extrabold text-white uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
                Mecanismo Único: Etapas da Metodologia PGE
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {[
                  { step: 'D', name: 'Diagnosticar', desc: 'Identificar inércia, CLO e IDE inicial', status: activeMonthForDashboard >= 1 ? 'Concluído' : 'Pendente' },
                  { step: 'O', name: 'Organizar', desc: 'Mapeamento de processos e fluxos', status: activeMonthForDashboard >= 3 ? 'Concluído' : activeMonthForDashboard >= 2 ? 'Em Progresso' : 'Pendente' },
                  { step: 'D', name: 'Delegar', desc: 'Contratar lideranças e descentralizar', status: activeMonthForDashboard >= 6 ? 'Concluído' : activeMonthForDashboard >= 4 ? 'Em Progresso' : 'Pendente' },
                  { step: 'A', name: 'Automatizar', desc: 'Instalar rotinas, ferramentas e SLAs', status: activeMonthForDashboard >= 9 ? 'Concluído' : activeMonthForDashboard >= 7 ? 'Em Progresso' : 'Pendente' },
                  { step: 'G', name: 'Governar', desc: 'Cadência mensal do Conselho Executivo', status: activeMonthForDashboard >= 12 ? 'Concluído' : activeMonthForDashboard >= 10 ? 'Em Progresso' : 'Pendente' }
                ].map((item, index) => {
                  const isDone = item.status === 'Concluído';
                  const isDoing = item.status === 'Em Progresso';
                  return (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isDone 
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-200' 
                          : isDoing 
                            ? 'bg-[#d4af37]/5 border-[#d4af37]/35 text-slate-200'
                            : 'bg-black/30 border-gray-900 text-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            isDone ? 'bg-emerald-500 text-black' : isDoing ? 'bg-[#d4af37] text-black' : 'bg-gray-800 text-gray-400'
                          }`}>
                            {item.step}
                          </span>
                          <span className="text-[11px] font-bold block">{item.name}</span>
                        </div>
                        <span className={`text-[8px] px-1 py-0.5 rounded font-mono ${
                          isDone ? 'bg-emerald-500/10 text-emerald-500' : isDoing ? 'bg-[#d4af37]/10 text-[#ffd700]' : 'bg-gray-800/10 text-gray-500'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[9px] text-gray-400 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          /* Monthly Entry Tab Content */
          <div className="p-4 sm:p-6 max-w-2xl mx-auto text-left">
            <div className="premium-card p-5 rounded-xl border border-gray-800/80 bg-black/20">
              <h3 className="text-sm font-heading font-extrabold text-white uppercase tracking-wider mb-4 border-b border-gray-800 pb-2.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#d4af37]" />
                Lançamento de Indicadores Mensais
              </h3>
              
              <form onSubmit={handleSaveMonthData} className="space-y-4">
                
                {/* Month Picker */}
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Selecionar Mês de Lançamento</label>
                  <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none w-full transition-all font-mono"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i+1} value={i+1}>Mês {i+1} (Lançar dados)</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Input: IDE */}
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Índice de Dependência do Dono (%)</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={editIde}
                      onChange={(e) => setEditIde(e.target.value)}
                      className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none w-full transition-all font-mono"
                      required
                    />
                  </div>

                  {/* Input: Autonomia */}
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Autonomia das Lideranças (%)</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={editAutonomia}
                      onChange={(e) => setEditAutonomia(e.target.value)}
                      className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none w-full transition-all font-mono"
                      required
                    />
                  </div>

                  {/* Input: Processos */}
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Processos Mapeados (%)</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={editProcessos}
                      onChange={(e) => setEditProcessos(e.target.value)}
                      className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none w-full transition-all font-mono"
                      required
                    />
                  </div>

                  {/* Input: Decisoes */}
                  <div className="flex flex-col">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Decisões Centralizadas / Semana</label>
                    <input 
                      type="number"
                      min="0"
                      value={editDecisoes}
                      onChange={(e) => setEditDecisoes(e.target.value)}
                      className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none w-full transition-all font-mono"
                      required
                    />
                  </div>

                </div>

                {/* Input: Governança de Reuniões */}
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Governança de Reuniões de Conselho (%)</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={editGovernanca}
                    onChange={(e) => setEditGovernanca(e.target.value)}
                    className="bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-xs px-3 py-2 rounded-lg outline-none w-full transition-all font-mono"
                    required
                  />
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-3 pt-3 border-t border-gray-800/80">
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2 border border-gray-800 text-gray-400 hover:text-white font-bold text-xs rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-heading font-extrabold text-xs rounded-lg uppercase tracking-wider hover:opacity-90 active:scale-95 shadow-[0_0_12px_rgba(212,175,55,0.2)] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Dados do Mês
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
