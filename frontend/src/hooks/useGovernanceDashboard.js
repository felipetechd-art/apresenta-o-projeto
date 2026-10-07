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
    role: ROLES.CLIENT
  });

  const { companyId, presentationSessionId, isMagicLink } = initialProps;
  
  const repositoryScopeId = companyId || (presentationSessionId ? `draft-${presentationSessionId}` : 'demo-company');

  const roadmap = useRoadmap(repositoryScopeId);
  const closing = useMonthlyClosing(repositoryScopeId);
  
  // Draft integration for Prévia Administrativa
  const draftData = (!companyId && presentationSessionId) 
    ? PresentationGovernanceDraftRepository.findBySessionId(presentationSessionId) 
    : null;

  // Pegamos o snapshot mais recente para os cards principais
  const snapshots = closing.snapshots;
  const latestSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;

  const isPreviewMode = !companyId && !!presentationSessionId && !isMagicLink && draftData?.status !== 'active';

  // Calculamos IGE baseado nos últimos dados, ou draft (Prévia), ou null
  const currentIde = latestSnapshot ? latestSnapshot.metrics.provisionalIde : (isPreviewMode && draftData?.diagnosticData?.ideDependency != null ? clampPercentage(draftData.diagnosticData.ideDependency) : null);
  const currentClo = latestSnapshot ? latestSnapshot.metrics.clo : (isPreviewMode && draftData?.diagnosticData?.cloOperationalFreedom != null ? clampPercentage(draftData.diagnosticData.cloOperationalFreedom) : null);
  const currentAutonomy = latestSnapshot ? latestSnapshot.metrics.autonomy : (isPreviewMode && draftData?.diagnosticData?.cloOperationalFreedom != null ? clampPercentage(draftData.diagnosticData.cloOperationalFreedom) : null); // fallback
  const currentProcessMaturity = latestSnapshot ? latestSnapshot.metrics.processMaturity : null; // Aguardando medição
  const currentAutomation = null; // Aguardando medição
  const currentGovernance = null; // Aguardando medição

  // IGE should be null in preview mode OR when there are no actual snapshots to measure
  const ige = isPreviewMode ? null : (latestSnapshot ? calculateIGE({
    ide: currentIde || 0,
    clo: currentClo || 0,
    autonomy: currentAutonomy || 0,
    processMaturity: currentProcessMaturity || 0,
    automation: currentAutomation || 0,
    governance: currentGovernance || 0
  }) : null);

  const maturityLevel = ige !== null ? getMaturityLevel(ige) : 'Aguardando medição';

  const decisionsToOwner = latestSnapshot?.rawData?.decisionsToOwner ?? (isPreviewMode ? 35 : null);
  
  const pillars = [
    { id: 'people', name: 'Pessoas e Lideranças', currentScore: isPreviewMode ? 12 : null },
    { id: 'processes', name: 'Processos e Rotinas', currentScore: currentProcessMaturity },
    { id: 'delegation', name: 'Delegação e Alçadas', currentScore: isPreviewMode ? 10 : null },
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
    personType: draftData?.contractData?.personType || null,
    leaders: draftData?.clientInfo?.leaders || [],
    presentationSessionId: initialProps.presentationSessionId,
    isMagicLink: initialProps.isMagicLink,
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
    scopeId: repositoryScopeId,
    returnClosing,
    createRevision,
    validateTask,
    updateTask,
    addTask
  };
}
