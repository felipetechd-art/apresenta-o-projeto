import React from 'react';
import { MaturityCard } from '../ui/MaturityCard';
import { MetricCard } from '../ui/MetricCard';
import { PillarProgressCard } from '../ui/PillarProgressCard';
import { BrainCircuit, Activity, LineChart, Target, AlertTriangle } from 'lucide-react';

export function DashboardTab({ dashboardData }) {
  const { ige, maturityLevel, ide, clo, autonomy, decisionsToOwner, roadmapProgress, pillars } = dashboardData;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* 6 Cards Superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="xl:col-span-2">
          <MaturityCard ige={ige} maturityLevel={maturityLevel} />
        </div>
        <MetricCard 
          title="Índice de Dependência" 
          value={`${ide}%`} 
          subtitle="IDE"
          icon={AlertTriangle}
          evolution={-2} // Fake evolution for layout
          invertColors={true}
        />
        <MetricCard 
          title="Liberdade Operacional" 
          value={`${clo}%`} 
          subtitle="CLO"
          icon={Activity}
          evolution={5}
        />
        <MetricCard 
          title="Autonomia (Lideranças)" 
          value={`${autonomy}%`} 
          icon={BrainCircuit}
          evolution={1}
        />
        <div className="flex flex-col gap-4">
          <MetricCard 
            title="Decisões (Dono)" 
            value={decisionsToOwner} 
            subtitle="/ semana"
            evolution={-10}
            evolutionText="decisões"
            invertColors={true}
          />
        </div>
      </div>

      {/* Pilares da Transformação */}
      <div>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-[var(--color-primary-yellow)]" />
          Pilares da Transformação
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {pillars.map(pillar => (
            <PillarProgressCard key={pillar.id} {...pillar} />
          ))}
        </div>
      </div>

      {/* Grid Principal (Evolução x Prioridades) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico (Ocupa 2 colunas) */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <LineChart className="w-4 h-4 text-[var(--color-primary-yellow)]" />
            Evolução (12 Meses)
          </h2>
          <div className="w-full h-[300px] flex items-center justify-center bg-black/20 rounded border border-gray-800 border-dashed text-gray-500">
            [Gráfico ApexCharts em Desenvolvimento]
          </div>
        </div>

        {/* Prioridades do Mês */}
        <div className="glass-card rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-[var(--color-primary-yellow)]" />
              Prioridades do Mês
            </h2>
            <span className="text-[10px] font-bold bg-[var(--color-primary-yellow)]/10 text-[var(--color-primary-yellow)] px-2 py-1 rounded">
              Roadmap: {roadmapProgress}%
            </span>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-gray-800 border-dashed rounded bg-black/20 text-gray-500">
            <p className="text-xs mb-2">O Roadmap de execução guiará as prioridades.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
