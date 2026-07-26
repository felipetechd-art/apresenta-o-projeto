// @ts-check

const STORAGE_PREFIX = "@PGE_GovCenter:";
const CURRENT_SCHEMA_VERSION = 1;

/**
 * Utilitário de persistência tipada no localStorage
 * Garante versionamento do schema para migrações futuras.
 */
export class StorageHelper {
  /**
   * @template T
   * @param {string} key 
   * @param {T} defaultValue 
   * @returns {T}
   */
  static getItem(key, defaultValue) {
    try {
      const fullKey = `${STORAGE_PREFIX}${key}`;
      const item = localStorage.getItem(fullKey);
      if (!item) return defaultValue;

      const parsed = JSON.parse(item);
      
      // Se tivermos um esquema de versão, validamos. Se for mais antigo, 
      // aqui entraria lógica de migração futura.
      if (parsed.schemaVersion && parsed.schemaVersion < CURRENT_SCHEMA_VERSION) {
        console.warn(`[PGE] Migração de dados de ${parsed.schemaVersion} para ${CURRENT_SCHEMA_VERSION} necessária futuramente.`);
        // Para esta versão inicial, retornamos o valor
      }
      
      return parsed.data !== undefined ? parsed.data : defaultValue;
    } catch (error) {
      console.error(`[PGE] Erro ao ler ${key} do localStorage`, error);
      return defaultValue; // Fallback se os dados estiverem corrompidos
    }
  }

  /**
   * @template T
   * @param {string} key 
   * @param {T} data 
   */
  static setItem(key, data) {
    try {
      const fullKey = `${STORAGE_PREFIX}${key}`;
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
   */
  static removeItem(key) {
    const fullKey = `${STORAGE_PREFIX}${key}`;
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
