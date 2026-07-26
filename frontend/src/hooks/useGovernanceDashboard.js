import { useState, useCallback } from 'react';
import { useRoadmap } from './useRoadmap.js';
import { useMonthlyClosing } from './useMonthlyClosing.js';
import { calculateIGE, getMaturityLevel, clampPercentage } from '../domain/governance/calculations.js';
import { ROLES } from '../domain/governance/auth.js';
import { PresentationGovernanceDraftRepository } from '../repositories/PresentationGovernanceDraftRepository.js';

export function useGovernanceDashboard(initialProps = {}) {
  // Simulação de Role (Modo Demonstração)
  const [actor, setActor] = useState({
    id: 'user-demo-1',
    name: 'Usuário Demonstração',
    role: ROLES.MENTORADO
  });

  const roadmap = useRoadmap(initialProps.companyId);
  const closing = useMonthlyClosing(initialProps.companyId);
  const { companyId, presentationSessionId } = initialProps;
  
  // Draft integration for Prévia Administrativa
  const draftData = (!companyId && presentationSessionId) 
    ? PresentationGovernanceDraftRepository.findBySessionId(presentationSessionId) 
    : null;

  // Pegamos o snapshot mais recente para os cards principais
  const snapshots = closing.snapshots;
  const latestSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;

  // Calculamos IGE baseado nos últimos dados, ou draft (Prévia), ou null
  const currentIde = latestSnapshot ? latestSnapshot.metrics.provisionalIde : (draftData?.diagnosticData?.ideDependency != null ? clampPercentage(draftData.diagnosticData.ideDependency) : null);
  const currentClo = latestSnapshot ? latestSnapshot.metrics.clo : (draftData?.diagnosticData?.cloOperationalFreedom != null ? clampPercentage(draftData.diagnosticData.cloOperationalFreedom) : null);
  const currentAutonomy = latestSnapshot ? latestSnapshot.metrics.autonomy : (draftData?.diagnosticData?.cloOperationalFreedom != null ? clampPercentage(draftData.diagnosticData.cloOperationalFreedom) : null); // fallback
  const currentProcessMaturity = latestSnapshot ? latestSnapshot.metrics.processMaturity : null; // Aguardando medição
  const currentAutomation = null; // Aguardando medição
  const currentGovernance = null; // Aguardando medição

  const isPreviewMode = !companyId && !!presentationSessionId;

  // IGE should be null in preview mode because we don't have all pillars measured
  const ige = isPreviewMode ? null : calculateIGE({
    ide: currentIde || 0,
    clo: currentClo || 0,
    autonomy: currentAutonomy || 0,
    processMaturity: currentProcessMaturity || 0,
    automation: currentAutomation || 0,
    governance: currentGovernance || 0
  });

  const maturityLevel = ige !== null ? getMaturityLevel(ige) : 'Aguardando medição';

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
    clientName: draftData?.clientInfo?.name || initialProps.clientName || 'Empresa Demonstração',
    month: latestSnapshot ? latestSnapshot.month : 1,
    isPreviewMode,
    actor,
    setActor,
    ige,
    maturityLevel,
    ide: currentIde,
    clo: currentClo,
    autonomy: currentAutonomy,
    decisionsToOwner: latestSnapshot?.rawData?.decisionsToOwner ?? null,
    roadmapProgress: isPreviewMode ? null : roadmap.progress,
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
