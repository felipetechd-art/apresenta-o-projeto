// @ts-check
import { useState, useEffect, useCallback } from 'react';
import { MonthlyClosingRepository } from '../repositories/MonthlyClosingRepository.js';
import { 
  calculateCLO, 
  calculateAutonomy, 
  calculateRecentralization, 
  calculateProcessMaturity,
  calculateProvisionalIDE 
} from '../domain/governance/calculations.js';

export function useMonthlyClosing(companyId = null) {
  const [snapshots, setSnapshots] = useState(/** @type {import("../domain/governance/types.js").MonthlySnapshot[]} */ ([]));

  const loadSnapshots = useCallback(() => {
    if (companyId === null) {
      setSnapshots([]);
    } else {
      setSnapshots(MonthlyClosingRepository.getSnapshots(companyId));
    }
  }, [companyId]);

  useEffect(() => {
    loadSnapshots();
  }, [loadSnapshots]);

  /**
   * Recebe os dados crus, calcula as métricas, salva no repo e recarrega.
   */
  const saveClosing = useCallback((month, date, rawData, roadmapProgress, status = 'draft', notes = '', actor) => {
    const clo = calculateCLO(rawData.operationalHours, rawData.totalHours);
    const autonomy = calculateAutonomy(rawData.decisionsByLeaders, rawData.decisionsToOwner);
    const recentralizationRate = calculateRecentralization(rawData.recentralizedResponsibilities, rawData.delegatedResponsibilities);
    const processMaturity = calculateProcessMaturity(rawData.priorityProcesses, rawData.documentedProcesses, rawData.processAdherence);
    
    const provisionalIde = calculateProvisionalIDE({
      decisionsToOwner: rawData.decisionsToOwner,
      decisionsByLeaders: rawData.decisionsByLeaders,
      operationalHours: rawData.operationalHours,
      totalHours: rawData.totalHours,
      priorityProcesses: rawData.priorityProcesses,
      independentProcesses: rawData.priorityProcesses - rawData.documentedProcesses,
      recentralized: rawData.recentralizedResponsibilities,
      delegated: rawData.delegatedResponsibilities
    });

    const existingSnap = MonthlyClosingRepository.getSnapshotByMonth(month);
    
    const snapshot = {
      id: existingSnap ? existingSnap.id : `snap-${crypto.randomUUID()}`, 
      month,
      year: new Date(date).getFullYear(),
      revision: existingSnap ? existingSnap.revision : 1,
      date,
      status,
      notes,
      rawData,
      metrics: {
        clo,
        autonomy,
        recentralizationRate,
        processMaturity,
        provisionalIde,
        roadmapProgress
      },
      supersedesId: existingSnap ? existingSnap.supersedesId : undefined
    };

    MonthlyClosingRepository.saveSnapshot(snapshot, actor, companyId);
    loadSnapshots();
  }, [loadSnapshots, companyId]);

  const validateClosing = useCallback((snapshotId, actor) => {
    MonthlyClosingRepository.validateSnapshot(snapshotId, actor, companyId);
    loadSnapshots();
  }, [loadSnapshots, companyId]);

  const returnClosing = useCallback((snapshotId, actor, reason) => {
    MonthlyClosingRepository.returnSnapshot(snapshotId, actor, reason, companyId);
    loadSnapshots();
  }, [loadSnapshots, companyId]);

  const createRevision = useCallback((month, actor) => {
    MonthlyClosingRepository.createRevision(month, actor, companyId);
    loadSnapshots();
  }, [loadSnapshots, companyId]);

  return {
    snapshots,
    saveClosing,
    validateClosing,
    returnClosing,
    createRevision,
    refresh: loadSnapshots
  };
}
