import React from 'react';
import { X, Maximize2, Minimize2, ShieldAlert } from 'lucide-react';

export function GovernanceHeader({ 
  clientName, 
  startDate, 
  mode, 
  onClose, 
  isFullscreen,
  onToggleFullscreen 
}) {
  const isPreview = mode === 'preview';
  const isAdmin = mode === 'administrative';

  return (
    <div className={`border-b border-gray-800 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between bg-black/30 ${!isFullscreen ? 'rounded-t-2xl' : ''}`}>
      
      {/* Esquerda: Identificação e Títulos */}
      <div className="text-left mb-4 md:mb-0">
        <span className="text-[10px] font-accent text-[#d4af37] font-bold uppercase tracking-widest block">
          Programa Governo Empresarial
        </span>
        <h2 className="text-lg sm:text-xl font-heading font-extrabold text-white uppercase flex items-center gap-2 flex-wrap">
          Centro de Governança PGE <span className="text-gray-500 font-normal hidden sm:inline">|</span> <span className="text-[#ffd700]">{clientName}</span>
        </h2>
        <span className="text-[9px] text-gray-400 font-mono mt-1 block uppercase">
          DATA DE INÍCIO: {startDate || 'A DEFINIR'}
        </span>
      </div>

      {/* Direita: Status e Ações */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
        
        {/* Status Mode */}
        {isPreview && (
          <div className="flex flex-col items-start sm:items-end">
            <span className="border border-[#d4af37]/40 bg-black/40 text-[#ffd700] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
              <ShieldAlert className="w-3 h-3" />
              Prévia Administrativa
            </span>
            <span className="text-[9px] text-gray-400 font-medium mt-1 text-left sm:text-right">
              Ambiente ainda não ativado para o mentorado
            </span>
          </div>
        )}
        {isAdmin && (
          <div className="flex flex-col items-start sm:items-end">
            <span className="border border-[#d4af37]/40 bg-black/40 text-[#ffd700] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
              <ShieldAlert className="w-3 h-3" />
              Visualização Administrativa
            </span>
            <span className="text-[9px] text-gray-400 font-medium mt-1 text-left sm:text-right">
              Acessando ambiente de {clientName} como Administrador
            </span>
          </div>
        )}

        <div className="w-full h-px sm:w-px sm:h-8 bg-gray-800 md:block hidden"></div>

        {/* Ações (Fullscreen / Fechar) */}
        <div className="flex items-center gap-2 mt-2 sm:mt-0 self-end sm:self-auto">
          <button 
            onClick={onToggleFullscreen}
            className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-all border border-transparent hover:border-gray-700 cursor-pointer"
            title={isFullscreen ? "Minimizar" : "Tela Cheia"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-red-400 rounded-lg transition-all border border-transparent hover:border-red-900/50 cursor-pointer"
            title="Voltar para Apresentação"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
