// @ts-check
import { StorageHelper } from "./StorageHelper.js";

const KEY = "monthly_snapshots";

export class MonthlyClosingRepository {
  /**
   * Obtém o histórico completo de meses fechados.
   * @returns {import("../domain/governance/types.js").MonthlySnapshot[]}
   */
  static getSnapshots() {
    return StorageHelper.getItem(KEY, []);
  }

  /**
   * Obtém o snapshot de um mês específico.
   * @param {number} month 
   * @returns {import("../domain/governance/types.js").MonthlySnapshot | undefined}
   */
  static getSnapshotByMonth(month) {
    const snapshots = this.getSnapshots();
    return snapshots.find(s => s.month === month);
  }

  /**
   * Salva um novo fechamento mensal (snapshot).
   * Se já existir para aquele mês, sobrescreve.
   * @param {import("../domain/governance/types.js").MonthlySnapshot} snapshot 
   */
  static saveSnapshot(snapshot) {
    const snapshots = this.getSnapshots();
    const existingIndex = snapshots.findIndex(s => s.month === snapshot.month);
    
    if (existingIndex !== -1) {
      snapshots[existingIndex] = snapshot;
    } else {
      snapshots.push(snapshot);
      // Garantir ordem por mês
      snapshots.sort((a, b) => a.month - b.month);
    }
    
    StorageHelper.setItem(KEY, snapshots);
  }

  /**
   * Remove um snapshot se necessário.
   * @param {string} id 
   */
  static deleteSnapshot(id) {
    let snapshots = this.getSnapshots();
    snapshots = snapshots.filter(s => s.id !== id);
    StorageHelper.setItem(KEY, snapshots);
  }
}
