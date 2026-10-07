import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2, ArrowLeft, PlayCircle, CheckCircle2, Lock } from 'lucide-react';
import { diagnosticService } from '../../services/diagnosticService';
import OnboardingStep from './OnboardingStep';
import KickoffStep from './KickoffStep';
import FormStep from './FormStep';

export default function DiagnosticFlow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diagnostic, setDiagnostic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('DASHBOARD'); // DASHBOARD, ONBOARDING, KICKOFF, COLETA

  useEffect(() => {
    if (id) {
      loadDiagnostic(id);
    }
  }, [id]);

  const loadDiagnostic = async (diagId) => {
    setLoading(true);
    try {
      const data = await diagnosticService.getDiagnosticById(diagId);
      if (!data) {
        alert("Mapa 360 não encontrado.");
        navigate('/admin');
        return;
      }
      setDiagnostic(data);
    } catch (e) {
      console.error(e);
      alert("Erro ao carregar o mapa 360.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async (nextStatus, extraData = {}) => {
    setLoading(true);
    try {
      await diagnosticService.updateDiagnostic(diagnostic.id, { 
        status: nextStatus,
        ...extraData
      });
      // Update local and return to Dashboard
      setDiagnostic(prev => ({ ...prev, status: nextStatus, ...extraData }));
      setCurrentView('DASHBOARD');
    } catch (e) {
      console.error(e);
      alert("Erro ao avançar etapa.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToDashboard = () => {
    setCurrentView('DASHBOARD');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin mb-4" />
        <p className="text-sm uppercase tracking-wider font-bold">Carregando ambiente...</p>
      </div>
    );
  }

  // Views internas para os passos (acionadas ao clicar nos cards)
  if (currentView === 'ONBOARDING') {
    return <OnboardingStep 
             diagnostic={diagnostic} 
             onNext={() => handleNextStep('KICKOFF')} 
             onBack={handleReturnToDashboard} 
           />;
  }
  if (currentView === 'KICKOFF') {
    return <KickoffStep 
             diagnostic={diagnostic} 
             onNext={(data) => handleNextStep('COLETA', { kickoffData: data })} 
             onBack={handleReturnToDashboard} 
           />;
  }
  if (currentView === 'COLETA') {
    return <FormStep 
             diagnostic={diagnostic} 
             onComplete={() => handleNextStep('FINALIZADO')} 
             onBack={handleReturnToDashboard}
           />;
  }

  // Lógica das fases para o Dashboard
  const getPhaseStatus = (phaseIndex) => {
    const statuses = ['ONBOARDING', 'KICKOFF', 'COLETA', 'FINALIZADO'];
    const currentStatusIndex = statuses.indexOf(diagnostic.status);
    
    if (currentStatusIndex > phaseIndex) return 'CONCLUIDO';
    if (currentStatusIndex === phaseIndex) return 'ATUAL';
    return 'BLOQUEADO';
  };

  const phases = [
    {
      id: 'ONBOARDING',
      index: 0,
      title: 'Fase 1: Onboarding e NDA',
      desc: 'Assinatura do Acordo de Confidencialidade e alinhamento de expectativas.',
      action: () => setCurrentView('ONBOARDING')
    },
    {
      id: 'KICKOFF',
      index: 1,
      title: 'Fase 2: Entrevista de Profundidade',
      desc: 'Mapeamento das 13 áreas e levantamento histórico.',
      action: () => setCurrentView('KICKOFF')
    },
    {
      id: 'COLETA',
      index: 2,
      title: 'Fase 3: Coleta de Percepções',
      desc: 'Painel de links para pesquisa com Sócios, Liderança e Operação.',
      action: () => setCurrentView('COLETA')
    },
    {
      id: 'FINALIZADO',
      index: 3,
      title: 'Fase 4: Plano de Ação e Devolutiva',
      desc: 'Cruzamento de dados, identificação de GAPs e plano de ação.',
      action: () => navigate(`/admin/diagnostico/${diagnostic.id}/resultados`)
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-[#d4af37]/30 pb-20">
      <header className="bg-black border-b border-white/5 py-4 px-6 md:px-12 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="text-neutral-500 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-neutral-800"></div>
            <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
            <h1 className="text-lg font-bold">Painel de Mapa 360</h1>
          </div>
          <div className="text-xs font-mono text-neutral-500">ID: {diagnostic.id.slice(-6).toUpperCase()}</div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4">Mapeamento e Construção</h2>
          <p className="text-gray-400 text-lg">Acompanhe o progresso das 4 fases do mapa 360.</p>
        </div>

        <div className="grid gap-4">
          {phases.map((phase) => {
            const status = getPhaseStatus(phase.index);
            const isCompleted = status === 'CONCLUIDO';
            const isCurrent = status === 'ATUAL';
            const isLocked = status === 'BLOQUEADO';

            return (
              <div 
                key={phase.id}
                className={`relative flex items-center justify-between p-6 rounded-2xl border transition-all ${
                  isCurrent 
                    ? 'bg-[#d4af37]/10 border-[#d4af37]/50 shadow-[0_0_30px_rgba(212,175,55,0.1)]'
                    : isCompleted
                      ? 'bg-neutral-900 border-neutral-800 opacity-70'
                      : 'bg-black border-neutral-900 opacity-50 grayscale'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${
                    isCurrent ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#d4af37]' 
                    : isCompleted ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-600'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold text-lg">{phase.index + 1}</span>}
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold mb-1 ${isCurrent ? 'text-[#d4af37]' : 'text-white'}`}>
                      {phase.title}
                    </h3>
                    <p className="text-sm text-gray-400">{phase.desc}</p>
                  </div>
                </div>

                <div className="ml-4">
                  {isLocked ? (
                    <div className="px-4 py-2 rounded-lg bg-neutral-900 text-neutral-600 flex items-center gap-2 text-xs font-bold uppercase">
                      <Lock className="w-4 h-4" /> Bloqueado
                    </div>
                  ) : (
                    <button 
                      onClick={phase.action}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors ${
                        isCurrent 
                          ? 'bg-[#d4af37] text-black hover:bg-[#b5952f]'
                          : 'bg-neutral-800 text-white hover:bg-neutral-700'
                      }`}
                    >
                      {isCompleted ? (
                        <>Revisar <ArrowLeft className="w-4 h-4 rotate-180" /></>
                      ) : (
                        <>Acessar <PlayCircle className="w-4 h-4" /></>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
