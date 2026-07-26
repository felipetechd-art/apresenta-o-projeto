import { useState, useCallback } from 'react';
import { useRoadmap } from './useRoadmap.js';
import { useMonthlyClosing } from './useMonthlyClosing.js';
import { calculateIGE, getMaturityLevel } from '../domain/governance/calculations.js';
import { ROLES } from '../domain/governance/auth.js';

export function useGovernanceDashboard(initialProps = {}) {
  // Simulação de Role (Modo Demonstração)
  const [actor, setActor] = useState({
    id: 'user-demo-1',
    name: 'Usuário Demonstração',
    role: ROLES.MENTORADO
  });

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
  
  const pillars = [
    { id: 'people', name: 'Pessoas e Lideranças', currentScore: 12 },
    { id: 'processes', name: 'Processos e Rotinas', currentScore: currentProcessMaturity },
    { id: 'delegation', name: 'Delegação e Alçadas', currentScore: 10 },
    { id: 'automation', name: 'Automação e Tecnologia', currentScore: currentAutomation },
    { id: 'governance', name: 'Indicadores e Governança', currentScore: currentGovernance }
  ];

  // Wrappers para injetar o actor automaticamente nas chamadas de domínio
  const saveClosing = useCallback((month, date, rawData, roadmapProgress, status, notes) => {
    closing.saveClosing(month, date, rawData, roadmapProgress, status, notes, actor);
  }, [closing, actor]);

  const validateClosing = useCallback((snapshotId) => {
    closing.validateClosing(snapshotId, actor);
  }, [closing, actor]);

  const returnClosing = useCallback((snapshotId, reason) => {
    closing.returnClosing(snapshotId, actor, reason);
  }, [closing, actor]);

  const createRevision = useCallback((month) => {
    closing.createRevision(month, actor);
  }, [closing, actor]);

  const validateTask = useCallback((taskId) => {
    roadmap.validateTask(taskId, actor);
  }, [roadmap, actor]);

  const updateTask = useCallback((task, action, comment) => {
    roadmap.updateTask(task, actor, action, comment);
  }, [roadmap, actor]);
  
  const addTask = useCallback((task) => {
    roadmap.addTask(task, actor);
  }, [roadmap, actor]);

  return {
    clientName: initialProps.clientName || 'Empresa Demonstração',
    month: latestSnapshot ? latestSnapshot.month : 1,
    actor,
    setActor,
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
    saveClosing,
    validateClosing,
    returnClosing,
    createRevision,
    validateTask,
    updateTask,
    addTask
  };
}
