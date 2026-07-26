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

export function useMonthlyClosing() {
  const [snapshots, setSnapshots] = useState(/** @type {import("../domain/governance/types.js").MonthlySnapshot[]} */ ([]));

  const loadSnapshots = useCallback(() => {
    setSnapshots(MonthlyClosingRepository.getSnapshots());
  }, []);

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

    MonthlyClosingRepository.saveSnapshot(snapshot, actor);
    loadSnapshots();
  }, [loadSnapshots]);

  const validateClosing = useCallback((snapshotId, actor) => {
    MonthlyClosingRepository.validateSnapshot(snapshotId, actor);
    loadSnapshots();
  }, [loadSnapshots]);

  const returnClosing = useCallback((snapshotId, actor, reason) => {
    MonthlyClosingRepository.returnSnapshot(snapshotId, actor, reason);
    loadSnapshots();
  }, [loadSnapshots]);

  const createRevision = useCallback((month, actor) => {
    MonthlyClosingRepository.createRevision(month, actor);
    loadSnapshots();
  }, [loadSnapshots]);

  return {
    snapshots,
    saveClosing,
    validateClosing,
    returnClosing,
    createRevision,
    refresh: loadSnapshots
  };
}
