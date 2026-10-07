import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Shield, Calendar, Users, FileText } from 'lucide-react';

export default function OnboardingStep({ diagnostic, onNext, onBack }) {
  const [acceptedNDA, setAcceptedNDA] = useState(false);

  return (
    <div className="flex flex-col h-full animate-fade-in pb-20 px-4 md:px-8 pt-8 max-w-6xl mx-auto w-full">
      
      {/* Bem vindo */}
      <div className="mb-16">
        <span className="text-xs font-accent text-[#d4af37] font-bold uppercase tracking-[0.25em] mb-4 block">Bem-vindo</span>
        <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white leading-tight mb-6">
          Mapa 360 de <span className="text-[#d4af37]">Governo Empresarial</span>
        </h2>
        <div className="prose prose-invert max-w-3xl text-gray-300">
          <p className="text-lg leading-relaxed mb-4">
            Nos próximos dias vamos olhar sua empresa através de diferentes perspectivas.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            Nosso objetivo <strong>não é avaliar pessoas</strong>. Queremos entender o sistema que conecta estratégia, liderança, decisões, processos, números e execução.
          </p>
          <p className="text-lg leading-relaxed text-[#d4af37] font-medium">
            Tudo começa pela empresa que vocês já construíram.
          </p>
        </div>
      </div>

      {/* Cronograma Visual */}
      <div className="mb-16">
        <h3 className="text-xl font-heading font-bold text-white mb-8 flex items-center gap-3">
          <Calendar className="text-[#d4af37]" /> Próximos Passos
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Users className="w-20 h-20" />
            </div>
            <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block mb-2">Agora</span>
            <h4 className="text-white font-bold mb-2">Kickoff & Visão do Dono</h4>
            <p className="text-sm text-gray-400">Alinhamento de expectativas e coleta da sua percepção principal.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 opacity-70">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Dias 2-4</span>
            <h4 className="text-white font-bold mb-2">Questionários</h4>
            <p className="text-sm text-gray-400">Coleta anônima com Sócios, Lideranças e Operação.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 opacity-70">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Dias 5-8</span>
            <h4 className="text-white font-bold mb-2">Motor de Análise</h4>
            <p className="text-sm text-gray-400">Cruzamento de dados, mapeamento de gaps e levantamento de evidências.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 opacity-70">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Dia 10+</span>
            <h4 className="text-white font-bold mb-2">Devolutiva</h4>
            <p className="text-sm text-gray-400">Apresentação executiva com prioridades e plano de ação.</p>
          </div>
        </div>
      </div>

      {/* NDA */}
      <div className="mb-16 bg-gradient-to-r from-black to-neutral-900 border border-neutral-800 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Shield className="w-32 h-32 text-white" />
        </div>
        
        <h3 className="text-xl font-heading font-bold text-white mb-6 relative z-10 flex items-center gap-3">
          <Shield className="text-[#d4af37]" /> Confidencialidade e Segurança
        </h3>
        
        <div className="space-y-4 text-sm text-gray-300 relative z-10 max-w-3xl mb-8">
          <p>
            O Programa de Governo Empresarial adota um protocolo estrito de confidencialidade. 
            Todas as informações financeiras, estratégicas e operacionais fornecidas durante este mapa 360 serão tratadas sob <strong>sigilo absoluto</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>As respostas individuais da equipe serão anonimizadas nas análises de grupo.</li>
            <li>Nenhum documento anexado será compartilhado com terceiros.</li>
            <li>Você possui controle total sobre quem pode visualizar os resultados.</li>
          </ul>
        </div>

        <label 
          className="flex items-start gap-4 cursor-pointer group relative z-10 w-fit"
          onClick={(e) => {
            e.preventDefault(); // prevent double toggle if we add real checkbox
            setAcceptedNDA(!acceptedNDA);
          }}
        >
          <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-colors ${acceptedNDA ? 'bg-[#d4af37] border-[#d4af37]' : 'border-gray-600 group-hover:border-[#d4af37]'}`}>
            {acceptedNDA && <CheckCircle2 className="w-4 h-4 text-black" />}
          </div>
          <span className={`text-sm transition-colors ${acceptedNDA ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-300'}`}>
            Compreendo e autorizo o início da coleta e cruzamento de informações da empresa.
          </span>
        </label>
      </div>

      {/* Ações */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 mt-auto border-t border-white/5 pt-8">
        <button 
          onClick={onBack}
          className="w-full md:w-auto px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors"
        >
          Sair
        </button>

        <button 
          disabled={!acceptedNDA}
          onClick={onNext}
          className={`w-full md:w-auto flex justify-center items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
            acceptedNDA 
              ? 'bg-[#d4af37] text-black hover:bg-[#b5952f] shadow-[0_0_20px_rgba(212,175,55,0.3)] transform hover:scale-105' 
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
          }`}
        >
          Iniciar Kickoff
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
