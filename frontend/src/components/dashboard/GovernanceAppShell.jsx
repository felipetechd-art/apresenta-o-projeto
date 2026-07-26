import React, { useState } from 'react';
import { X, Maximize2, Minimize2, BarChart2, Calendar, TrendingUp } from 'lucide-react';
import { DashboardTab } from './tabs/DashboardTab';
import { MonthlyClosingTab } from './tabs/MonthlyClosingTab';

export function GovernanceAppShell({ dashboardData, onClose }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const TABS = [
    { id: 'dashboard', label: 'Painel de Controle', icon: BarChart2 },
    { id: 'closing', label: 'Fechamento Mensal', icon: Calendar },
    { id: 'roadmap', label: 'Roadmap de Transição', icon: TrendingUp }
  ];

  const handleToggleFullscreen = () => setIsFullscreen(!isFullscreen);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm transition-all duration-300`}>
      <div 
        className={`bg-gradient-to-br from-[var(--color-background-main)] to-[#03060a] border-gray-800 shadow-2xl flex flex-col relative transition-all duration-300 ${
          isFullscreen 
            ? 'w-full h-full rounded-none border-0' 
            : 'w-[1400px] max-w-[98vw] h-[95vh] rounded-2xl border'
        }`}
      >
        {/* Header Corporativo */}
        <div className="border-b border-[var(--color-border-color)] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black/30 rounded-t-2xl gap-4 sm:gap-0">
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

        {/* Corpo do Dashboard */}
        {activeTab === 'dashboard' && <DashboardTab dashboardData={dashboardData} />}
        {activeTab === 'closing' && <MonthlyClosingTab dashboardData={dashboardData} />}
        {activeTab === 'roadmap' && <div className="p-8 text-white">Roadmap (Em desenvolvimento)</div>}

      </div>
    </div>
  );
}
