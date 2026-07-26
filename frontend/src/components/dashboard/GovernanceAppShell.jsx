import React, { useState, Suspense, lazy } from 'react';
import { X, Maximize2, Minimize2, BarChart2, Calendar, TrendingUp, ShieldAlert, Loader } from 'lucide-react';
import { ROLES } from '../../domain/governance/auth.js';
import { GovernanceHeader } from './ui/GovernanceHeader.jsx';
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

        <GovernanceHeader 
          clientName={dashboardData.clientName}
          startDate={new Intl.DateTimeFormat('pt-BR').format(new Date())}
          mode={dashboardData.isPreviewMode ? 'preview' : 'administrative'}
          onClose={onClose}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-gray-800 bg-[#050a14] px-4 py-2 gap-3">
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
