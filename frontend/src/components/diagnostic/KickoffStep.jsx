import React, { useState } from 'react';
import { ArrowRight, MessageSquare, Target, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export default function KickoffStep({ diagnostic, onNext, onBack }) {
  const [kickoffNotes, setKickoffNotes] = useState({
    expectations: '',
    sensitiveTopics: '',
    knownProblems: '',
    desiredDecision: ''
  });

  // Hipóteses geradas na primeira conversa
  const hypotheses = [
    { title: "Possível dependência gerencial", context: "Você mencionou que se não cobrar algumas coisas, elas não acontecem." },
    { title: "Possível centralização de decisões", context: "Você mencionou que várias decisões da operação ainda chegam até você." },
    { title: "Baixa visibilidade operacional", context: "Você mencionou que não tem certeza de onde a empresa perde dinheiro hoje." }
  ];

  return (
    <div className="flex flex-col h-full animate-fade-in pb-20 px-4 md:px-8 pt-8 max-w-6xl mx-auto w-full">
      
      <div className="mb-12">
        <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-4 block">Fase 2</span>
        <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white leading-tight mb-4">
          Visão do <span className="text-[#d4af37]">Dono</span> e Kickoff
        </h2>
        <p className="text-gray-400">
          Antes de abrirmos a coleta para a equipe, vamos alinhar as percepções que tivemos na nossa primeira conversa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        
        {/* Lado Esquerdo: Hipóteses da Conversa 1 */}
        <div>
          <h3 className="text-lg font-heading font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#d4af37]" /> Na primeira conversa, mapeamos:
          </h3>
          
          <div className="space-y-4">
            {hypotheses.map((hip, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#d4af37]/50 transition-colors">
                <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block mb-1">Hipótese {idx + 1}</span>
                <h4 className="text-white font-bold mb-2">{hip.title}</h4>
                <p className="text-sm text-gray-400 italic">"{hip.context}"</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
            <p className="text-sm text-amber-500 font-medium">
              O mapa 360 que iniciaremos agora servirá justamente para encontrar <strong>evidências</strong> reais (nos processos e na equipe) se estas hipóteses são verdadeiras, e qual o impacto financeiro delas.
            </p>
          </div>
        </div>

        {/* Lado Direito: Formulário de Kickoff */}
        <div className="space-y-6">
          <h3 className="text-lg font-heading font-bold text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#d4af37]" /> Alinhamento de Foco:
          </h3>

          <div>
            <label className="block text-sm text-gray-300 font-bold mb-2">
              O que você mais espera descobrir com este mapa 360?
            </label>
            <textarea 
              value={kickoffNotes.expectations}
              onChange={e => setKickoffNotes({...kickoffNotes, expectations: e.target.value})}
              className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-sm p-4 rounded-xl outline-none transition-all min-h-[100px] resize-none"
              placeholder="Sua principal expectativa..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 font-bold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Existe algum assunto que é especialmente sensível na equipe?
            </label>
            <textarea 
              value={kickoffNotes.sensitiveTopics}
              onChange={e => setKickoffNotes({...kickoffNotes, sensitiveTopics: e.target.value})}
              className="w-full bg-black/40 border border-gray-800 focus:border-amber-500 text-white text-sm p-4 rounded-xl outline-none transition-all min-h-[80px] resize-none"
              placeholder="Conflitos, demissões recentes, familiares..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 font-bold mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" /> Onde a empresa está melhor do que aparenta?
            </label>
            <textarea 
              value={kickoffNotes.knownProblems}
              onChange={e => setKickoffNotes({...kickoffNotes, knownProblems: e.target.value})}
              className="w-full bg-black/40 border border-gray-800 focus:border-blue-400 text-white text-sm p-4 rounded-xl outline-none transition-all min-h-[80px] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 font-bold mb-2">
              Qual grande decisão você gostaria de tomar ao terminar este mapa 360?
            </label>
            <textarea 
              value={kickoffNotes.desiredDecision}
              onChange={e => setKickoffNotes({...kickoffNotes, desiredDecision: e.target.value})}
              className="w-full bg-black/40 border border-gray-800 focus:border-[#d4af37] text-white text-sm p-4 rounded-xl outline-none transition-all min-h-[100px] resize-none"
              placeholder="Ex: Contratar um diretor, mudar modelo de comissão, delegar operação..."
            />
          </div>

        </div>

      </div>

      {/* Ações */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 mt-auto pt-8 border-t border-white/5">
        <button 
          onClick={onBack}
          className="w-full md:w-auto px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors"
        >
          Voltar
        </button>

        <button 
          onClick={() => onNext(kickoffNotes)}
          className="w-full md:w-auto flex justify-center items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 bg-[#d4af37] text-black hover:bg-[#b5952f] shadow-[0_0_20px_rgba(212,175,55,0.3)] transform hover:scale-105"
        >
          Iniciar Questionários
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
