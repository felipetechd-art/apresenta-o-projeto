// @ts-check

const STORAGE_PREFIX = "@PGE_GovCenter:";
const CURRENT_SCHEMA_VERSION = 2; // Incremented for companyId isolation migration

/**
 * Utilitário de persistência tipada no localStorage
 * Garante versionamento do schema para migrações futuras.
 */
export class StorageHelper {
  
  /**
   * Helper para construir a chave com companyId
   * @param {string} companyId 
   * @param {string} key 
   */
  static _buildKey(companyId, key) {
    return `${STORAGE_PREFIX}${companyId}:${key}`;
  }

  /**
   * Realiza a migração de dados globais antigos para o formato isolado por empresa.
   * Só roda se existir o dado global e a empresa atual for demo-company.
   */
  static _migrateFromGlobal(companyId, key) {
    if (companyId !== 'demo-company') return;

    const oldKey = `${STORAGE_PREFIX}${key}`;
    const oldItem = localStorage.getItem(oldKey);
    
    if (oldItem) {
      const parsedOld = JSON.parse(oldItem);
      const newKey = this._buildKey(companyId, key);
      
      // Salva no novo formato com o companyId
      const payload = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        timestamp: new Date().toISOString(),
        data: parsedOld.data || parsedOld // fallback in case old format didn't have wrapper
      };
      localStorage.setItem(newKey, JSON.stringify(payload));
      
      // Remove o antigo (Idempotente e seguro, movimenta e apaga origem)
      localStorage.removeItem(oldKey);
    }
  }

  /**
   * @template T
   * @param {string} key 
   * @param {T} defaultValue 
   * @param {string} companyId
   * @returns {T}
   */
  static getItem(key, defaultValue, companyId = 'demo-company') {
    try {
      this._migrateFromGlobal(companyId, key);

      const fullKey = this._buildKey(companyId, key);
      const item = localStorage.getItem(fullKey);
      if (!item) return defaultValue;

      const parsed = JSON.parse(item);
      
      return parsed.data !== undefined ? parsed.data : defaultValue;
    } catch (error) {
      console.error(`[PGE] Erro ao ler ${key} do localStorage`, error);
      return defaultValue;
    }
  }

  /**
   * @template T
   * @param {string} key 
   * @param {T} data 
   * @param {string} companyId
   */
  static setItem(key, data, companyId = 'demo-company') {
    try {
      const fullKey = this._buildKey(companyId, key);
      const payload = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        timestamp: new Date().toISOString(),
        data: data
      };
      localStorage.setItem(fullKey, JSON.stringify(payload));
    } catch (error) {
      console.error(`[PGE] Erro ao salvar ${key} no localStorage`, error);
    }
  }

  /**
   * Remove item específico
   * @param {string} key 
   * @param {string} companyId
   */
  static removeItem(key, companyId = 'demo-company') {
    const fullKey = this._buildKey(companyId, key);
    localStorage.removeItem(fullKey);
  }

  /**
   * Limpa todo o repositório da PGE do localStorage
   */
  static clearAll() {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  }
}
