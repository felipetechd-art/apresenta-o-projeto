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
   * @param {number} month 
   * @param {string} date 
   * @param {Object} rawData 
   * @param {number} roadmapProgress
   * @param {"draft" | "submitted" | "validated"} status
   * @param {string} [notes]
   */
  const saveClosing = useCallback((month, date, rawData, roadmapProgress, status = 'draft', notes = '') => {
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
      independentProcesses: rawData.priorityProcesses - rawData.documentedProcesses, // Simplificação
      recentralized: rawData.recentralizedResponsibilities,
      delegated: rawData.delegatedResponsibilities
    });

    const snapshot = {
      id: `snap-${month}`, // Usar apenas o mês garante que updates no mesmo mês sobrescrevam o draft anterior (regra 9)
      month,
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
      }
    };

    MonthlyClosingRepository.saveSnapshot(snapshot);
    loadSnapshots();
  }, [loadSnapshots]);

  return {
    snapshots,
    saveClosing,
    refresh: loadSnapshots
  };
}
