import React, { useMemo } from 'react';
import { Target, Flag, ArrowRight, CheckCircle2, Download, AlertTriangle, Lightbulb, Users, Activity } from 'lucide-react';
import { ActionPlanEngine } from '../../domain/governance/actionPlanEngine';

export default function ActionPlanProposal({ diagnostic, results, allAnswers, templates }) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const kickoffData = diagnostic.kickoffData || diagnostic.fullData?.diagnosticData || {};
  
  // Roda o motor para gerar o plano
  const plan = useMemo(() => {
    return ActionPlanEngine.generatePlan(diagnostic, allAnswers, templates, results);
  }, [diagnostic, allAnswers, templates, results]);

  const { summary, initiatives } = plan;

  const handleDownloadPDF = () => {
    const root = document.getElementById('dossie-pdf-root');
    if (root) {
      const originalTitle = document.title;
      const clientName = diagnostic.clientName || diagnostic.companyName || 'Cliente';
      document.title = `Mapa 360 - ${clientName}`;

      root.classList.add('print-active');
      window.print();
      
      setTimeout(() => {
        root.classList.remove('print-active');
        document.title = originalTitle;
      }, 500);
    }
  };

  return (
    <div className="bg-neutral-900 border border-[#d4af37]/30 rounded-3xl overflow-hidden shadow-2xl animate-fade-in mt-16 pb-12">
      
      {/* Header Proposal */}
      <div className="bg-black border-b border-white/5 p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Flag className="w-32 h-32 text-[#d4af37]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-4 relative z-10">
          Plano de Governo de 90 Dias
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl relative z-10">
          Não é um plano genérico. Este é o mapa de execução exato construído pelo cruzamento das respostas da sua equipe no Mapa 360. Ele ataca diretamente a causa raiz da dependência operacional e das ineficiências do negócio.
        </p>
      </div>

      {/* Resumo Estrutural */}
      <div className="p-8 md:p-12 border-b border-white/5 bg-white/[0.02]">
        <h3 className="text-sm font-bold text-[#d4af37] uppercase tracking-widest mb-8 flex items-center gap-2">
          <Target className="w-4 h-4" /> Resumo Estrutural
        </h3>
        
        <div className="grid md:grid-cols-12 gap-8 mb-8">
          {/* Score Geral */}
          <div className="md:col-span-4 bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
            <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Score Mapa 360</h4>
            <div className="text-6xl font-black text-white mb-2">{summary.scoreGeral}</div>
            <span className="text-xs text-gray-500 uppercase tracking-widest">/ 100</span>
          </div>

          {/* Conclusão Principal */}
          <div className="md:col-span-8 bg-black/40 border border-white/5 p-6 rounded-2xl">
            <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Principal Conclusão
            </h4>
            <p className="text-white font-medium text-lg leading-relaxed">
              "{summary.principalConclusao}"
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
            <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" /> Top 3 Gargalos Críticos
            </h4>
            <ul className="space-y-3">
              {summary.top3Gargalos.map((gargalo, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-gray-300">
                  <span className="text-red-500 font-bold">{idx + 1}.</span> {gargalo}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col gap-6">
            <div>
              <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Principal Risco</h4>
              <p className="text-red-400 font-medium text-sm">
                {summary.principalRisco}
              </p>
            </div>
            <div>
              <h4 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Principal Oportunidade</h4>
              <p className="text-[#10b981] font-medium text-sm">
                {summary.principalOportunidade}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 p-6 rounded-2xl text-center">
          <h4 className="text-[#d4af37] text-xs font-bold uppercase tracking-wider mb-2">Meta Central dos 90 Dias</h4>
          <p className="text-[#d4af37] font-bold text-lg md:text-xl">
            "{summary.metaCentral}"
          </p>
        </div>
      </div>

      {/* Timeline de Iniciativas */}
      <div className="p-8 md:p-12">
        <h3 className="text-sm font-bold text-[#d4af37] uppercase tracking-widest mb-10 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Movimentos Estratégicos
        </h3>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-[1.15rem] md:before:ml-[1.15rem] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#d4af37]/50 before:via-white/10 before:to-transparent">
          
          {initiatives.map((init, idx) => (
            <div key={idx} className="relative flex items-start gap-8">
              {/* Ícone Lateral */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-neutral-900 bg-[#d4af37] text-black shadow shrink-0 relative z-10 font-bold text-sm">
                {idx + 1}
              </div>
              
              {/* Card da Iniciativa */}
              <div className="flex-1 bg-black border border-white/10 rounded-2xl shadow-xl overflow-hidden hover:border-[#d4af37]/30 transition-colors">
                
                {/* Header do Card */}
                <div className="bg-white/5 border-b border-white/10 p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                    <span className="bg-[#d4af37]/20 text-[#d4af37] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {init.movimento}
                    </span>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                      {init.fase}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-white">{init.titulo}</h4>
                </div>

                {/* Corpo do Card (Nova Estrutura Exata) */}
                <div className="p-6 space-y-6">
                  
                  {/* ACHADO & CAUSA */}
                  <div className="grid md:grid-cols-2 gap-6 bg-neutral-900/50 p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Achado (Mapa 360)</span>
                      <p className="text-sm text-gray-300">{init.achado}</p>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Causa Provável</span>
                      <p className="text-sm text-red-400/80">{init.causa}</p>
                    </div>
                  </div>

                  {/* AÇÃO & RESPONSÁVEL */}
                  <div>
                    <span className="block text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2">Ação Implementada</span>
                    <p className="text-base text-white mb-4">{init.acao}</p>
                    
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-300">
                        Responsável: <strong className="text-white">{init.responsavel}</strong>
                      </span>
                    </div>
                  </div>

                  {/* INDICADOR E METAS */}
                  <div className="border-t border-white/10 pt-6">
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Indicador de Liberação Humana</span>
                    <p className="text-sm font-bold text-white mb-4">{init.indicador}</p>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                        <span className="block text-xs text-red-400 uppercase tracking-wider mb-1">Baseline (Atual)</span>
                        <strong className="text-lg text-white">{init.baseline}</strong>
                      </div>
                      <div className="flex items-center justify-center text-gray-500">
                        <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" />
                      </div>
                      <div className="flex-1 bg-[#10b981]/10 border border-[#10b981]/20 p-3 rounded-lg">
                        <span className="block text-xs text-[#10b981] uppercase tracking-wider mb-1">Meta (90 Dias)</span>
                        <strong className="text-lg text-white">{init.meta}</strong>
                      </div>
                    </div>
                  </div>

                  {/* GAP TAG */}
                  <div className="flex justify-end pt-2">
                    <span className="text-[10px] font-mono text-gray-500 uppercase border border-gray-800 px-2 py-1 rounded">
                      GAP: {init.gap}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-8 md:p-12 text-center text-white border-t border-white/10">
        <h3 className="text-3xl font-extrabold mb-3">Sua Governança Começa Aqui.</h3>
        <p className="font-medium text-gray-400 mb-8 max-w-2xl mx-auto">
          Este plano tira a empresa das suas costas e transfere para um sistema. O próximo passo é fechar o acordo de implementação.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pdf-exclude">
          <button 
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className={`w-full md:w-auto bg-black/50 text-[#d4af37] border-2 border-[#d4af37]/30 px-8 py-5 rounded-xl font-bold uppercase tracking-wider text-sm transition-colors flex items-center justify-center gap-3 ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d4af37]/10'}`}
          >
            <Download className={`w-5 h-5 ${isGenerating ? 'animate-bounce' : ''}`} /> 
            {isGenerating ? 'GERANDO PDF...' : 'BAIXAR DOSSIÊ COMPLETO'}
          </button>
          
          <button 
            onClick={() => window.open('/', '_blank')}
            className="w-full md:w-auto bg-[#d4af37] text-black px-10 py-5 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-[#b5952f] transition-colors shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center justify-center gap-3 transform hover:scale-105"
          >
            Apresentação PGE <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
}
