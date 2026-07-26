import React from 'react';
import { Target } from 'lucide-react';

export function MaturityCard({ ige, maturityLevel }) {
  const levels = ["Operação", "Gestão", "Liderança", "Governo"];
  const currentIdx = levels.indexOf(maturityLevel);

  return (
    <div className="glass-card rounded-xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-[var(--color-primary-yellow)]/5 rounded-full blur-3xl group-hover:bg-[var(--color-primary-yellow)]/10 transition-colors" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nível de Maturidade</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-heading font-bold text-gold-gradient">{ige}</span>
            <span className="text-xs text-[var(--color-primary-yellow)] font-bold">IGE</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-[var(--color-primary-yellow)]/10 flex items-center justify-center">
          <Target className="w-5 h-5 text-[var(--color-primary-yellow)]" />
        </div>
      </div>

      <div className="relative z-10">
        <h4 className="text-lg font-heading font-bold text-white mb-2">{maturityLevel}</h4>
        
        <div className="flex w-full gap-1 h-1.5">
          {levels.map((level, idx) => {
            const isActive = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div 
                key={level}
                className={`flex-1 rounded-full ${
                  isActive 
                    ? isCurrent 
                      ? 'bg-[var(--color-primary-yellow)] shadow-[0_0_8px_var(--color-primary-yellow)]' 
                      : 'bg-[var(--color-primary-yellow-dark)]/50'
                    : 'bg-[var(--color-border-color)]'
                }`}
                title={level}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[9px] text-[var(--color-text-secondary)]">Operação</span>
          <span className="text-[9px] text-[var(--color-text-secondary)]">Governo</span>
        </div>
      </div>
    </div>
  );
}
