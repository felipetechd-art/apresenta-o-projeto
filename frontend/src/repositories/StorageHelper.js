// @ts-check
import { FirestoreSyncService } from './FirestoreSyncService';

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
   * Executa de forma segura: grava na nova, faz backup da velha, apaga a velha.
   */
  static _migrateFromGlobal(companyId, key) {
    if (!companyId || companyId === 'demo-company') return;

    const oldKey = `${STORAGE_PREFIX}${key}`;
    const oldItem = localStorage.getItem(oldKey);
    
    if (oldItem) {
      try {
        const parsedOld = JSON.parse(oldItem);
        const newKey = this._buildKey(companyId, key);
        
        // Se já existe dado na nova chave, não migra por cima
        if (localStorage.getItem(newKey)) return;
        
        // Salva no novo formato com o companyId
        const payload = {
          schemaVersion: CURRENT_SCHEMA_VERSION,
          timestamp: new Date().toISOString(),
          data: parsedOld.data || parsedOld
        };
        
        localStorage.setItem(newKey, JSON.stringify(payload));
        
        // Valida se a gravação foi bem-sucedida antes de deletar
        const verify = localStorage.getItem(newKey);
        if (verify) {
          // Cópia de segurança temporária da chave antiga
          const backupKey = `${oldKey}:backup`;
          localStorage.setItem(backupKey, oldItem);
          
          // Somente após validar a nova chave e criar o backup, a chave original é removida
          localStorage.removeItem(oldKey);
        }
      } catch (error) {
        console.error(`[PGE] Erro na migração segura da chave ${key}`, error);
        // Se houver erro de parse ou quota, a chave original `oldKey` é integralmente preservada
      }
    }
  }

  /**
   * @template T
   * @param {string} key 
   * @param {T} defaultValue 
   * @param {string} companyId
   * @returns {T}
   */
  static getItem(key, defaultValue, companyId = null) {
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
   * @param {boolean} shouldSync
   */
  static setItem(key, data, companyId = null, shouldSync = true) {
    try {
      const fullKey = this._buildKey(companyId, key);
      const payload = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        timestamp: new Date().toISOString(),
        data: data
      };
      localStorage.setItem(fullKey, JSON.stringify(payload));
      
      if (shouldSync && companyId.startsWith('client-')) {
        FirestoreSyncService.syncToCloud(companyId).catch(console.error);
      }
    } catch (error) {
      console.error(`[PGE] Erro ao salvar ${key} no localStorage`, error);
    }
  }

  /**
   * Remove item específico
   * @param {string} key 
   * @param {string} companyId
   */
  static removeItem(key, companyId = null) {
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
