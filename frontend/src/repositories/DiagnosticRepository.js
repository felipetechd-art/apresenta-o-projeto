// @ts-check
import { StorageHelper } from "./StorageHelper.js";

const KEY = "quarterly_diagnostics";

export class DiagnosticRepository {
  /**
   * Retorna os mapas 360 oficiais trimestrais.
   * @returns {import("../domain/governance/types.js").QuarterlyDiagnostic[]}
   */
  static getDiagnostics() {
    return StorageHelper.getItem(KEY, []);
  }

  /**
   * Salva um mapa 360 oficial.
   * @param {import("../domain/governance/types.js").QuarterlyDiagnostic} diagnostic 
   */
  static saveDiagnostic(diagnostic) {
    const diagnostics = this.getDiagnostics();
    const existingIndex = diagnostics.findIndex(d => d.quarter === diagnostic.quarter);
    
    if (existingIndex !== -1) {
      diagnostics[existingIndex] = diagnostic;
    } else {
      diagnostics.push(diagnostic);
      diagnostics.sort((a, b) => a.quarter - b.quarter);
    }
    
    StorageHelper.setItem(KEY, diagnostics);
  }

  /**
   * Obtém o mapa 360 mais recente.
   * @returns {import("../domain/governance/types.js").QuarterlyDiagnostic | null}
   */
  static getLatestDiagnostic() {
    const diagnostics = this.getDiagnostics();
    if (diagnostics.length === 0) return null;
    return diagnostics[diagnostics.length - 1];
  }
}
