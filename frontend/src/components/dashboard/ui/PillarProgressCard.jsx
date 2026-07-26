import React from 'react';
import { Users, Workflow, Handshake, Cpu, ShieldCheck } from 'lucide-react';

const ICONS = {
  people: Users,
  processes: Workflow,
  delegation: Handshake,
  automation: Cpu,
  governance: ShieldCheck
};

export function PillarProgressCard({ id, name, currentScore }) {
  const Icon = ICONS[id] || ShieldCheck;
  const score = currentScore || 0;

  return (
    <div className="glass-card rounded-xl p-4 flex flex-col justify-between h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[var(--color-background-secondary)] border border-[var(--color-border-color)] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[var(--color-primary-yellow)]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white leading-tight">{name}</h3>
          <p className="text-[10px] text-[var(--color-text-secondary)]">50% Impl / 50% Resultado</p>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Aderência</span>
          <span className="text-lg font-heading font-bold text-white">{score}%</span>
        </div>
        <div className="w-full bg-[var(--color-background-main)] rounded-full h-1.5 border border-black/50">
          <div 
            className="bg-gradient-to-r from-[var(--color-primary-yellow-dark)] to-[var(--color-primary-yellow)] h-1.5 rounded-full transition-all duration-1000"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}
