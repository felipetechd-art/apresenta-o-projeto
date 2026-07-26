// @ts-check
import { useRoadmap } from './useRoadmap.js';
import { useMonthlyClosing } from './useMonthlyClosing.js';
import { calculateIGE, getMaturityLevel } from '../domain/governance/calculations.js';

export function useGovernanceDashboard(initialProps = {}) {
  const roadmap = useRoadmap();
  const closing = useMonthlyClosing();
  
  // Pegamos o snapshot mais recente para os cards principais
  const snapshots = closing.snapshots;
  const latestSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;

  // Calculamos IGE baseado nos últimos dados, ou defaults de demonstração (Mês 1)
  const currentIde = latestSnapshot ? latestSnapshot.metrics.provisionalIde : 85;
  const currentClo = latestSnapshot ? latestSnapshot.metrics.clo : 15;
  const currentAutonomy = latestSnapshot ? latestSnapshot.metrics.autonomy : 12;
  const currentProcessMaturity = latestSnapshot ? latestSnapshot.metrics.processMaturity : 8; // Demo
  const currentAutomation = 5; // Demo
  const currentGovernance = 10; // Demo

  const ige = calculateIGE({
    ide: currentIde,
    clo: currentClo,
    autonomy: currentAutonomy,
    processMaturity: currentProcessMaturity,
    automation: currentAutomation,
    governance: currentGovernance
  });

  const maturityLevel = getMaturityLevel(ige);

  const decisionsToOwner = latestSnapshot?.rawData?.decisionsToOwner ?? 35; // Demo
  
  // Dados simulados para os pilares (50% implementação / 50% aderência)
  // No futuro, isso pode ser calculado de forma dinâmica cruzando as tarefas validadas de cada pilar 
  // com as métricas de aderência coletadas no fechamento.
  const pillars = [
    { id: 'people', name: 'Pessoas e Lideranças', currentScore: 12 },
    { id: 'processes', name: 'Processos e Rotinas', currentScore: currentProcessMaturity },
    { id: 'delegation', name: 'Delegação e Alçadas', currentScore: 10 },
    { id: 'automation', name: 'Automação e Tecnologia', currentScore: currentAutomation },
    { id: 'governance', name: 'Indicadores e Governança', currentScore: currentGovernance }
  ];

  return {
    clientName: initialProps.clientName || 'Empresa Demonstração',
    month: latestSnapshot ? latestSnapshot.month : 1,
    ige,
    maturityLevel,
    ide: currentIde,
    clo: currentClo,
    autonomy: currentAutonomy,
    decisionsToOwner,
    roadmapProgress: roadmap.progress,
    pillars,
    tasks: roadmap.tasks,
    snapshots,
    saveClosing: closing.saveClosing,
    validateTask: roadmap.validateTask,
    updateTask: roadmap.updateTask
  };
}
