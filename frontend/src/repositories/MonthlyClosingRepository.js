// @ts-check
import { StorageHelper } from "./StorageHelper.js";
import { canValidateMonthlyClosing, canReturnMonthlyClosing, canCreateRevision } from "../domain/governance/auth.js";

const KEY = "monthly_snapshots";

export class MonthlyClosingRepository {
  /**
   * Obtém o histórico completo de meses fechados.
   * @returns {import("../domain/governance/types.js").MonthlySnapshot[]}
   */
  /**
   * Obtém o histórico completo de meses fechados, retornando sempre a revisão mais recente de cada mês.
   * @param {string} companyId
   * @returns {import("../domain/governance/types.js").MonthlySnapshot[]}
   */
  static getSnapshots(companyId = null) {
    const all = StorageHelper.getItem(KEY, [], companyId);
    // Para cada mês, retorna a revisão mais alta.
    const latestByMonth = new Map();
    for (const snap of all) {
      const existing = latestByMonth.get(snap.month);
      if (!existing || snap.revision > existing.revision) {
        latestByMonth.set(snap.month, snap);
      }
    }
    return Array.from(latestByMonth.values()).sort((a, b) => a.month - b.month);
  }

  /**
   * Obtém o histórico bruto total (incluindo revisões antigas).
   * @param {string} companyId
   */
  static getAllRevisions(companyId = null) {
    return StorageHelper.getItem(KEY, [], companyId);
  }

  /**
   * Obtém o snapshot de um mês específico (a revisão mais recente).
   * @param {number} month 
   * @param {string} companyId
   * @returns {import("../domain/governance/types.js").MonthlySnapshot | undefined}
   */
  static getSnapshotByMonth(month, companyId = null) {
    return this.getSnapshots(companyId).find(s => s.month === month);
  }

  /**
   * Salva um fechamento mensal (Rascunho ou Envio).
   * Impede a sobrescrita caso a revisão atual esteja validada.
   * @param {import("../domain/governance/types.js").MonthlySnapshot} snapshot 
   * @param {import("../domain/governance/auth.js").Actor} actor
   * @param {string} companyId
   */
  static saveSnapshot(snapshot, actor, companyId = null) {
    const all = this.getAllRevisions(companyId);
    const existingIndex = all.findIndex(s => s.id === snapshot.id);
    const existing = existingIndex !== -1 ? all[existingIndex] : null;

    if (existing && existing.status === 'validated' && snapshot.status !== 'validated' && !snapshot.supersedesId) {
       throw new Error("Não é possível alterar um fechamento validado sem criar uma nova revisão autorizada.");
    }

    if (existing) {
      all[existingIndex] = { ...snapshot, updatedAt: new Date().toISOString() };
    } else {
      snapshot.createdAt = new Date().toISOString();
      snapshot.updatedAt = snapshot.createdAt;
      all.push(snapshot);
    }
    
    StorageHelper.setItem(KEY, all, companyId);
  }

  /**
   * Valida um snapshot. Somente conselheiros podem realizar esta ação.
   * @param {string} snapshotId 
   * @param {import("../domain/governance/auth.js").Actor} actor 
   * @param {string} companyId
   */
  static validateSnapshot(snapshotId, actor, companyId = null) {
    if (!canValidateMonthlyClosing(actor)) {
      throw new Error("Acesso Negado: Apenas o conselheiro pode validar um fechamento.");
    }

    const all = this.getAllRevisions(companyId);
    const existingIndex = all.findIndex(s => s.id === snapshotId);
    
    if (existingIndex === -1) throw new Error("Snapshot não encontrado.");

    all[existingIndex].status = 'validated';
    all[existingIndex].validatedAt = new Date().toISOString();
    all[existingIndex].validatedBy = actor.id || actor.name;
    all[existingIndex].updatedAt = new Date().toISOString();

    StorageHelper.setItem(KEY, all, companyId);
  }

  /**
   * Devolve um snapshot para correção.
   * @param {string} snapshotId
   * @param {import("../domain/governance/auth.js").Actor} actor
   * @param {string} reason
   * @param {string} companyId
   */
  static returnSnapshot(snapshotId, actor, reason, companyId = null) {
    if (!canReturnMonthlyClosing(actor)) {
      throw new Error("Acesso Negado: Apenas o conselheiro pode devolver um fechamento.");
    }
    
    const all = this.getAllRevisions(companyId);
    const existingIndex = all.findIndex(s => s.id === snapshotId);
    if (existingIndex === -1) throw new Error("Snapshot não encontrado.");

    all[existingIndex].status = 'returned';
    all[existingIndex].returnReason = reason;
    all[existingIndex].returnedAt = new Date().toISOString();
    all[existingIndex].updatedAt = new Date().toISOString();

    StorageHelper.setItem(KEY, all, companyId);
  }

  /**
   * Cria uma nova revisão a partir de um snapshot validado.
   * Útil quando o conselheiro autoriza uma correção retroativa.
   * @param {number} month
   * @param {import("../domain/governance/auth.js").Actor} actor
   * @param {string} companyId
   */
  static createRevision(month, actor, companyId = null) {
    if (!canCreateRevision(actor)) {
      throw new Error("Acesso Negado: Apenas o conselheiro pode autorizar a criação de uma nova revisão.");
    }

    const latest = this.getSnapshotByMonth(month, companyId);
    if (!latest || latest.status !== 'validated') {
      throw new Error("Não há snapshot validado para revisar neste mês.");
    }

    const newRevision = {
      ...latest,
      id: `snap-${crypto.randomUUID()}`,
      revision: (latest.revision || 1) + 1,
      status: 'draft',
      supersedesId: latest.id,
      validatedAt: undefined,
      validatedBy: undefined,
      returnedAt: undefined,
      returnReason: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const all = this.getAllRevisions(companyId);
    all.push(newRevision);
    StorageHelper.setItem(KEY, all, companyId);
    return newRevision;
  }
}
