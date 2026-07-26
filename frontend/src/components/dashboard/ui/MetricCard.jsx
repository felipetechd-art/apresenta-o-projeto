import React from 'react';

export function MetricCard({ title, value, subtitle, icon: Icon, evolution, evolutionText, invertColors = false }) {
  // Evolução positiva vs negativa
  let evoColor = 'text-gray-500';
  if (evolution) {
    if (evolution > 0) evoColor = invertColors ? 'text-[var(--color-danger-red)]' : 'text-[var(--color-success-green)]';
    if (evolution < 0) evoColor = invertColors ? 'text-[var(--color-success-green)]' : 'text-[var(--color-danger-red)]';
  }

  return (
    <div className="glass-card rounded-xl p-4 sm:p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
        {Icon && <Icon className="w-5 h-5 text-gray-500" />}
      </div>
      
      <div className="flex items-baseline gap-2">
        {value === null ? (
          <span className="text-xs font-medium text-gray-500 italic mt-2 leading-tight break-words">Aguardando medição</span>
        ) : (
          <>
            <span className="text-3xl font-heading font-bold text-white">
              {value}
            </span>
            {subtitle && (
              <span className="text-xs text-gray-500 font-medium">{subtitle}</span>
            )}
          </>
        )}
      </div>

      {value !== null && (evolution !== undefined || evolutionText) && (
        <div className={`mt-3 text-xs font-bold flex items-center gap-1 ${evoColor}`}>
          {evolution > 0 ? '↑' : evolution < 0 ? '↓' : '−'}
          <span>
            {evolution !== undefined ? `${Math.abs(evolution)}%` : ''} {evolutionText}
          </span>
        </div>
      )}
    </div>
  );
}
