import React, { useState, Suspense, lazy } from 'react';
import { X, Maximize2, Minimize2, BarChart2, Calendar, TrendingUp, ShieldAlert, Loader } from 'lucide-react';
import { ROLES } from '../../domain/governance/auth.js';

// Lazy loading das abas
const DashboardTab = lazy(() => import('./tabs/DashboardTab').then(m => ({ default: m.DashboardTab })));
const MonthlyClosingTab = lazy(() => import('./tabs/MonthlyClosingTab').then(m => ({ default: m.MonthlyClosingTab })));
const RoadmapTab = lazy(() => import('./tabs/RoadmapTab').then(m => ({ default: m.RoadmapTab })));

export function GovernanceAppShell({ dashboardData, onClose }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const TABS = [
    { id: 'dashboard', label: 'Painel de Controle', icon: BarChart2 },
    { id: 'closing', label: 'Fechamento Mensal', icon: Calendar },
    { id: 'roadmap', label: 'Roadmap de Transição', icon: TrendingUp }
  ];

  const handleToggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const toggleRole = () => {
    dashboardData.setActor(prev => ({
      ...prev,
      role: prev.role === ROLES.MENTORADO ? ROLES.MENTOR : ROLES.MENTORADO
    }));
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm transition-all duration-300`}>
      <div 
        className={`bg-gradient-to-br from-[var(--color-background-main)] to-[#03060a] border-gray-800 shadow-2xl flex flex-col relative transition-all duration-300 ${
          isFullscreen 
            ? 'w-full h-full rounded-none border-0' 
            : 'w-[1400px] max-w-[98vw] h-[95vh] rounded-2xl border'
        }`}
      >
        {/* Simulador de Role (Apenas Local/Experimental) */}
        {import.meta.env.VITE_ENABLE_ROLE_SIMULATION === 'true' && (
          <div className="bg-red-500/20 border-b border-red-500/30 px-4 py-1.5 flex justify-center items-center gap-4 rounded-t-2xl">
            <span className="text-[10px] text-red-300 font-bold uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-3 h-3" />
              Modo de Demonstração — Visualizando como {dashboardData.actor.role === ROLES.MENTOR ? 'Mentor' : 'Mentorado'}
            </span>
            <button 
              onClick={toggleRole}
              className="text-[10px] bg-red-500/30 text-red-200 px-3 py-0.5 rounded cursor-pointer hover:bg-red-500/50 transition-colors"
            >
              Trocar Papel
            </button>
          </div>
        )}

        {/* Header Corporativo */}
        <div className={`border-b border-[var(--color-border-color)] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black/30 gap-4 sm:gap-0 ${import.meta.env.VITE_ENABLE_ROLE_SIMULATION !== 'true' ? 'rounded-t-2xl' : ''}`}>
          <div className="text-left">
            <span className="text-[10px] font-accent text-[var(--color-primary-yellow)] uppercase tracking-[0.2em] font-bold">
              Programa Governo Empresarial
            </span>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight">
                Centro de Governança PGE
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 text-xs font-medium border border-white/10 mt-1">
                Mês {dashboardData.month}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 font-medium">{dashboardData.clientName}</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
            {TABS.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-[var(--color-primary-yellow)] text-black shadow-[0_0_10px_rgba(241,198,43,0.25)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-gray-400 absolute sm:relative top-4 right-4 sm:top-0 sm:right-0">
            <button 
              onClick={handleToggleFullscreen}
              className="hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? "Minimizar" : "Tela Cheia"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <div className="w-px h-4 bg-gray-700 hidden sm:block"></div>
            <button 
              onClick={onClose}
              className="hover:text-red-400 transition-colors p-1 bg-black/40 rounded-full border border-gray-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corpo do Dashboard - com Suspense */}
        <Suspense fallback={
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <Loader className="w-8 h-8 animate-spin mb-4 text-[var(--color-primary-yellow)]" />
            <p className="text-sm font-bold uppercase tracking-wider">Carregando Módulo...</p>
          </div>
        }>
          {activeTab === 'dashboard' && <DashboardTab dashboardData={dashboardData} />}
          {activeTab === 'closing' && <MonthlyClosingTab dashboardData={dashboardData} />}
          {activeTab === 'roadmap' && <RoadmapTab dashboardData={dashboardData} />}
        </Suspense>

      </div>
    </div>
  );
}
