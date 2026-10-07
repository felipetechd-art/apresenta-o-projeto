import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertTriangle, Target, Briefcase, ChevronRight, Activity, Zap } from 'lucide-react';
import { diagnosticService } from '../../services/diagnosticService';
import { questionnaireService } from '../../services/questionnaireService';
import { DiagnosticEngine } from '../../domain/governance/diagnosticEngine';
import ActionPlanProposal from './ActionPlanProposal';
import DossiePDF from './DossiePDF';

export default function DiagnosticResults() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [showProposal, setShowProposal] = useState(false);
  const [data, setData] = useState({
    diagnostic: null,
    results: null,
    answersCount: 0
  });

  useEffect(() => {
    loadResults();
  }, [id]);

  const loadResults = async () => {
    setLoading(true);
    try {
      const diag = await diagnosticService.getDiagnosticById(id);
      const answers = await questionnaireService.getAnswersByDiagnostic(id);
      const templates = await questionnaireService.getTemplates();

      // Processa os dados brutos no motor analítico
      const results = DiagnosticEngine.calculateAllScores(answers, templates);

      setData({
        diagnostic: diag,
        results: results,
        answersCount: answers.length,
        allAnswers: answers,
        templates: templates
      });
    } catch (e) {
      console.error(e);
      alert("Erro ao carregar os resultados.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin mb-4" />
        <p className="text-sm uppercase tracking-wider font-bold">Processando Triangulação de Dados...</p>
      </div>
    );
  }

  const { diagnostic, results, answersCount } = data;
  const scores = results.scores;
  const gaps = results.gapsIdentificados || [];

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-[#d4af37]/30">
      
      {/* Header */}
      <header className="bg-black border-b border-white/5 py-4 px-6 md:px-12 sticky top-0 z-50 pdf-exclude">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-neutral-500 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-px h-6 bg-neutral-800"></div>
            <Activity className="w-5 h-5 text-[#d4af37]" />
            <h1 className="text-lg font-bold">Devolutiva do Mapa 360</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-500 font-mono">ID: {diagnostic.id.slice(-6).toUpperCase()}</span>
            <span className="px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] rounded-full text-xs font-bold uppercase tracking-wider">
              {answersCount} Avaliações Coletadas
            </span>
          </div>
        </div>
      </header>

      <main id="pdf-document-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Painel Executivo / Score Global */}
        <section className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Target className="w-64 h-64 text-white" />
          </div>
          
          <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-4 block">
            Índice Global
          </span>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 relative z-10">
            <div>
              <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-white leading-none mb-4">
                {results.classification}
              </h2>
              <p className="text-gray-400 max-w-xl text-lg">
                Resultado baseado no cruzamento das perspectivas do dono, lideranças e operação.
              </p>
            </div>
            <div className="text-right">
              <div className="text-7xl md:text-9xl font-bold text-[#d4af37] leading-none tracking-tighter">
                {scores.governabilidade}
              </div>
              <span className="text-sm font-bold text-neutral-500 uppercase tracking-wider">/ 100 pontos</span>
            </div>
          </div>
        </section>

        {/* Informações da Análise de Negócio */}
        <section className="bg-black border border-white/5 rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl font-heading font-bold text-white mb-8 flex items-center gap-3">
            <Target className="w-6 h-6 text-[#d4af37]" /> Dados da Análise de Negócio
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Modelo de Negócio</span>
              <p className="text-white text-lg">{diagnostic.kickoffData?.modelo_negocio || diagnostic.fullData?.diagnosticData?.modelo_negocio || 'Não informado'}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Faturamento Atual</span>
              <p className="text-white text-lg">{diagnostic.kickoffData?.faturamento || diagnostic.fullData?.diagnosticData?.faturamento || 'Não informado'}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Cenário e Atuação</span>
              <p className="text-gray-300 leading-relaxed">{diagnostic.kickoffData?.atuacao || diagnostic.fullData?.diagnosticData?.atuacao || 'Não informado'}</p>
            </div>
          </div>
        </section>

        {/* Breakdown de Índices */}
        <section>
          <h3 className="text-2xl font-heading font-bold text-white mb-6 flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-[#d4af37]" /> Visão Analítica dos Eixos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <IndexCard title="Clareza Estratégica" value={scores.clareza} />
            <IndexCard title="Autonomia" value={scores.autonomia} />
            <IndexCard title="Maturidade Operacional" value={scores.maturidade_operacional} />
            <IndexCard title="Visibilidade" value={scores.visibilidade} />
            <IndexCard title="Dependência do Dono" value={scores.dependencia} invertColor={true} />
            <IndexCard title="Descentralização" value={scores.centralizacao_decisoria} />
          </div>
        </section>

        {/* Triangulação de Gaps */}
        <section className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-8 h-8 text-amber-500" />
            <div>
              <h3 className="text-2xl font-heading font-bold text-white">Triangulação de Gaps</h3>
              <p className="text-gray-400 text-sm mt-1">Divergências matemáticas encontradas entre a visão do Dono e a realidade do Time.</p>
            </div>
          </div>

          {gaps.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <p className="text-gray-400">Nenhum gap significativo (acima de 20 pontos de divergência) foi identificado no cruzamento de dados.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {gaps.map((gap, idx) => (
                <div key={idx} className="bg-black border border-amber-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">{gap.title}</h4>
                    <p className="text-gray-400 text-sm">{gap.description}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <span className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Dono</span>
                      <div className="text-3xl font-bold text-white">{gap.donoView}</div>
                    </div>
                    <div className="w-px h-12 bg-neutral-800"></div>
                    <div className="text-center">
                      <span className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Time</span>
                      <div className="text-3xl font-bold text-amber-500">{gap.teamView}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Resumo Executivo / Pitch de Fechamento */}
        <section className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl font-heading font-bold text-[#d4af37] mb-6 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" /> Resumo Estrutural
          </h3>
          <div className="space-y-6 text-gray-300">
            <p className="text-lg">
              Com um Score de <strong>{scores.governabilidade}</strong>, a empresa encontra-se em um estado onde <strong>{results.classification.toLowerCase()}</strong>.
            </p>
            {scores.dependencia > 60 && (
              <p className="text-lg">
                <strong className="text-white">Alerta Risco Chave:</strong> A dependência estrutural do empresário (Score: {scores.dependencia}) está sufocando o crescimento e garantindo que gargalos operacionais não sejam resolvidos sem a intervenção direta dos sócios.
              </p>
            )}
            {scores.autonomia < 50 && (
              <p className="text-lg">
                A liderança atual funciona mais como "supervisores" do que diretores, aguardando validação para decisões de médio impacto. É imperativo implementar rituais de governança e alçadas de decisão.
              </p>
            )}
          </div>
          
          {!showProposal && (
            <div className="mt-10 flex justify-end pdf-exclude">
               <button 
                onClick={() => setShowProposal(true)}
                className="flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider bg-[#d4af37] text-black hover:bg-[#b5952f] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                Gerar Plano de Ação (90 Dias)
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </section>

        {showProposal && (
          <div id="proposal-section">
            <ActionPlanProposal diagnostic={diagnostic} results={results} allAnswers={data.allAnswers} templates={data.templates} />
          </div>
        )}

      </main>

      {/* COMPONENTE OCULTO PARA EXPORTAÇÃO PDF */}
      <DossiePDF data={data} />

    </div>
  );
}

// Componente auxiliar
function IndexCard({ title, value, invertColor = false }) {
  // Lógica visual: se for dependência, valor alto é vermelho. Para o resto, valor alto é verde/gold
  let colorClass = "text-white";
  if (value > 0) {
    if (invertColor) {
      colorClass = value > 60 ? "text-red-500" : value > 30 ? "text-amber-500" : "text-emerald-500";
    } else {
      colorClass = value >= 70 ? "text-emerald-500" : value >= 40 ? "text-[#d4af37]" : "text-red-500";
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between h-full">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-4">{title}</span>
      <div className="flex items-end justify-between">
        <span className={`text-3xl font-bold ${colorClass}`}>{value || 0}</span>
        <div className="w-full h-1 bg-neutral-800 ml-4 rounded-full overflow-hidden mb-2">
          <div className={`h-full ${invertColor && value > 60 ? 'bg-red-500' : 'bg-[#d4af37]'}`} style={{ width: `${value || 0}%` }}></div>
        </div>
      </div>
    </div>
  );
}
