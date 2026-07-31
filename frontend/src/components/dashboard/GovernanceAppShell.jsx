import React, { useState, Suspense, lazy } from 'react';
import { X, Maximize2, Minimize2, BarChart2, Calendar, TrendingUp, ShieldAlert, Loader } from 'lucide-react';
import { ROLES } from '../../domain/governance/auth.js';
import { GovernanceHeader } from './ui/GovernanceHeader.jsx';
import { PresentationGovernanceDraftRepository } from '../../repositories/PresentationGovernanceDraftRepository.js';
// Lazy loading das abas
const DashboardTab = lazy(() => import('./tabs/DashboardTab').then(m => ({ default: m.DashboardTab })));
const MonthlyClosingTab = lazy(() => import('./tabs/MonthlyClosingTab').then(m => ({ default: m.MonthlyClosingTab })));
const RoadmapTab = lazy(() => import('./tabs/RoadmapTab').then(m => ({ default: m.RoadmapTab })));

export function GovernanceAppShell({ dashboardData, onClose }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState(null);

  const TABS = [
    { id: 'dashboard', label: 'Painel de Controle', icon: BarChart2 },
    { id: 'closing', label: 'Fechamento Mensal', icon: Calendar },
    { id: 'roadmap', label: 'Roadmap de Transição', icon: TrendingUp }
  ];

  const handleToggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const toggleRole = () => {
    dashboardData.setActor(prev => ({
      ...prev,
      role: prev.role === ROLES.CLIENT ? ROLES.ADVISOR : ROLES.CLIENT
    }));
  };

  const handleActivatePanel = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      
      // Salvar a alteração de status para ativo
      if (dashboardData.presentationSessionId) {
        PresentationGovernanceDraftRepository.update(dashboardData.presentationSessionId, { status: 'active' });
      }
      
      const baseUrl = window.location.origin + '/painel?token=';
      const newLinks = [];
      
      if (dashboardData.personType === 'PJ' && dashboardData.leaders && dashboardData.leaders.length > 0) {
        dashboardData.leaders.forEach(l => {
          if (l.name) {
            const tokenData = {
              sessionId: dashboardData.presentationSessionId,
              name: l.name,
              email: l.email || ''
            };
            newLinks.push({
              name: l.name,
              email: l.email || 'Sem e-mail cadastrado',
              url: baseUrl + btoa(JSON.stringify(tokenData))
            });
          }
        });
      } else {
        const tokenData = {
          sessionId: dashboardData.presentationSessionId,
          name: dashboardData.clientName,
          email: ''
        };
        newLinks.push({
          name: dashboardData.clientName,
          email: 'Acesso Principal',
          url: baseUrl + btoa(JSON.stringify(tokenData))
        });
      }
      
      setGeneratedLinks(newLinks);
    }, 1500);
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
              Modo de Demonstração — Visualizando como {dashboardData.actor.role === ROLES.ADVISOR ? 'Conselheiro' : 'Cliente'}
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
          leaders={dashboardData.leaders}
          personType={dashboardData.personType}
          startDate={new Intl.DateTimeFormat('pt-BR').format(new Date())}
          mode={dashboardData.isMagicLink ? 'client' : (dashboardData.isPreviewMode ? 'preview' : 'administrative')}
          onClose={onClose}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          onActivate={handleActivatePanel}
          isActivating={isActivating}
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
          {activeTab === 'dashboard' && <DashboardTab dashboardData={dashboardData} onNavigate={setActiveTab} />}
          {activeTab === 'closing' && <MonthlyClosingTab dashboardData={dashboardData} onNavigate={setActiveTab} />}
          {activeTab === 'roadmap' && <RoadmapTab dashboardData={dashboardData} onNavigate={setActiveTab} />}
        </Suspense>

      </div>

      {/* Generated Links Modal */}
      {generatedLinks && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0f1a] border border-[#d4af37]/30 p-6 rounded-2xl max-w-lg w-full shadow-[0_0_50px_rgba(212,175,55,0.15)] relative">
            <button 
              onClick={() => setGeneratedLinks(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-heading font-extrabold text-white mb-2 uppercase flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#d4af37]" /> Painel Ativado
            </h3>
            <p className="text-sm text-gray-400 mb-6">Os links de acesso exclusivos abaixo foram gerados com sucesso. Copie e envie para os respectivos líderes.</p>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {generatedLinks.map((link, idx) => (
                <div key={idx} className="bg-white/5 border border-gray-800 p-3 rounded-lg flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[#d4af37] font-bold text-sm block uppercase tracking-wider">{link.name}</span>
                      <span className="text-xs text-gray-500">{link.email}</span>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(link.url);
                        alert('Link copiado!');
                      }}
                      className="text-xs bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] px-2 py-1 rounded border border-[#d4af37]/30 flex items-center gap-1 transition-colors cursor-pointer font-bold uppercase tracking-wider"
                    >
                      Copiar Link
                    </button>
                  </div>
                  <input 
                    type="text" 
                    readOnly 
                    value={link.url}
                    className="bg-black/50 text-gray-400 text-[10px] p-2 rounded outline-none border border-gray-800 w-full"
                  />
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setGeneratedLinks(null)}
              className="mt-6 w-full py-2 bg-[#d4af37] hover:bg-[#ffd700] text-black font-bold uppercase tracking-wider rounded-lg transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              Concluído
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
